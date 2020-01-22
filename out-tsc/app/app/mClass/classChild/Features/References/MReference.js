import * as tslib_1 from "tslib";
import { IEdge, Status, MClass, U, IReference, Info, } from '../../../../common/Joiner';
var MReference = /** @class */ (function (_super) {
    tslib_1.__extends(MReference, _super);
    /*childrens: ModelPiece[];
    instances: ModelPiece[];
    metaParent: IReference;
    // parent: MClass;
    */
    // mtarget: MClass[];
    // targetStr: string;
    // constructor() {}
    function MReference(classe, json, metaParent) {
        var _this = _super.call(this, classe, metaParent) || this;
        if (!classe && !json && !metaParent) {
            return _this;
        } // empty constructor for .duplicate();
        _this.parse(json, true);
        return _this;
    }
    /*
      getStyle(): HTMLElement | SVGElement {
        const htmlRaw: HTMLElement | SVGElement = super.getStyle();
        const $html = $(htmlRaw);
        const $selector = $html.find('select.ClassSelector');
        M2Class.updateMMClassSelector($selector[0] as HTMLSelectElement, this.getm2Target());
        return htmlRaw; }*/
    MReference.prototype.getm2Target = function () { return this.metaParent.type.classType; };
    MReference.prototype.endingName = function (valueMaxLength) {
        if (valueMaxLength === void 0) { valueMaxLength = 10; }
        if (this.mtarget.length > 0) {
            var t = this.mtarget[0];
            if (t instanceof MClass && t.attributes.length > 0) {
                var a = t.attributes[0];
                return a.endingName(valueMaxLength);
            }
        }
        return '';
    };
    /*
      conformability(meta: M2Reference, debug: boolean = true): number {
        let comformability = 0;
        comformability += 0.1 * StringSimilarity.compareTwoStrings(this.getm2Target().name, meta.classType.name);
        // todo: devi calcolare la 90% conformability in base al tipo dedotto della classe del m1-target.
        // comformability += 0.2 * StringSimilarity.compareTwoStrings(this.name, meta.name);
        // comformability += 0.2 * (this.metaParent.containment === meta.containment ? 1 : 0);
        U.pif(debug, 'REFERENCE.comform(', this.name, {0: this}, ', ', meta.name, {0: meta}, ') = ', comformability);
        return comformability; }*/
    MReference.prototype.duplicate = function (nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        var r = new MReference(null, null, null);
        return r.copy(this, nameAppend, newParent);
    };
    MReference.prototype.getInfo = function (toLower) {
        var info = {};
        Info.set(info, 'target', this.mtarget);
        Info.unset(info, 'upperbound');
        Info.unset(info, 'lowerbound');
        var i;
        for (i = 0; i < this.mtarget.length; i++) {
            var t = this.mtarget[i];
            // todo problem: le mClassi non hanno un nome
            Info.set(info, '' + i, t);
        }
        return info;
    };
    MReference.prototype.delete = function (linkStart, linkEnd) {
        if (linkStart === void 0) { linkStart = null; }
        if (linkEnd === void 0) { linkEnd = null; }
        _super.prototype.delete.call(this, linkStart, linkEnd);
        // total deletion
        var i;
        if (linkStart === null && linkEnd === null) {
            var targets = U.ArrayCopy(this.mtarget, false);
            for (i = 0; i < targets.length; i++) {
                U.arrayRemoveAll(targets[i].referencesIN, this);
                U.arrayRemoveAll(this.mtarget, this.mtarget[i]);
            }
            return;
        }
        // just cut some edges
        linkEnd = Math.min(this.mtarget.length, linkEnd);
        linkStart = Math.max(0, linkStart);
        // todo: questo sistema non ammette una ref con 2 link alla stessa classe.
        for (i = linkStart; i < linkEnd; i++) {
            U.arrayRemoveAll(this.mtarget[i].referencesIN, this);
        }
    };
    MReference.prototype.getType = function () { return (this.metaParent ? this.metaParent.getType() : null); };
    MReference.prototype.canBeLinkedTo = function (hoveringTarget) {
        var c1 = this.getType().classType;
        var c2 = hoveringTarget.metaParent;
        return c1 === c2 || c1.isExtending(c2);
    };
    // link(targetStr?: string, debug?: boolean): void { throw new Error('mreference.linkByStr() should never be called'); }
    // LinkToMetaParent(ref: MReference): void { super.LinkToMetaParent(ref); }
    MReference.prototype.generateModel = function () { MReference.loopDetection = {}; return this.generateModelLoop(); };
    MReference.prototype.generateModelLoop = function () {
        var ret = [];
        var i;
        for (i = 0; i < this.mtarget.length; i++) {
            var mclass = this.mtarget[i];
            if (MReference.loopDetection[mclass.id]) {
                // todo: in caso di loop cosa ci devo mettere nel modello?
                ret.push('LoopingReference');
                U.pw(true, 'looping reference in model');
            }
            else {
                MReference.loopDetection[mclass.id] = mclass;
                ret.push(mclass.generateModel());
            }
        }
        return ret;
    };
    MReference.prototype.generateEdges = function () {
        // const arr: IEdge[] = [];
        var i;
        // while (this.edges && this.edges.length > 0) { this.edges[0].remove(); U.arrayRemoveAll(this.edges, this.edges[0]); }
        for (i = 0; i < this.mtarget.length; i++) {
            if (this.edges[i] || !this.mtarget[i])
                continue;
            this.edges[i] = (new IEdge(this, i, this.parent.getVertex(), this.mtarget[i].getVertex()));
        }
        return this.edges;
    };
    MReference.prototype.parse = function (json0, destructive) {
        if (destructive === void 0) { destructive = true; }
        /*
            "ReferenceName": [
              { "-name": "tizio" },  <-- reference.target[0]
              { "-name": "asd" }     <-- reference.target[1]
            ]*/
        U.pe(!destructive, 'non-destructive parse of MReference to do.');
        if (!json0) {
            json0 = [];
        }
        var json = Array.isArray(json0) ? json0 : [json0];
        var targetMM = this.getm2Target();
        var i;
        if (!this.mtarget) {
            this.mtarget = new Array(this.metaParent.upperbound);
        }
        if (destructive) {
            this.clearTargets();
        }
        var pkg = this.getClass().parent;
        for (i = 0; i < json.length; i++) {
            // console.log('mref.parse: ', json0, json, 'i:', json[i]);
            if ($.isEmptyObject(json[i])) {
                continue;
            }
            var t = new MClass(pkg, json[i], targetMM);
            U.ArrayAdd(this.mtarget, t);
        } /*
        this.views = [];
        for(i = 0; i < this.parent.views.length; i++) {
          const pv: ClassView = this.parent.views[i];
          const v = new ReferenceView(pv);
          this.views.push(v);
          pv.referenceViews.push(v); }*/
    };
    MReference.prototype.validate = function () { return true; };
    MReference.prototype.copy = function (r, nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        this.clearTargets();
        _super.prototype.copy.call(this, r, nameAppend, newParent);
        this.mtarget = U.ArrayCopy(r.mtarget, false);
        this.generateEdges();
        this.refreshGUI();
        return r;
    };
    MReference.prototype.linkClass = function (classe, index, refreshGUI, debug) {
        if (refreshGUI === void 0) { refreshGUI = true; }
        if (debug === void 0) { debug = false; }
        if (this.mtarget[index]) {
            this.mtarget[index] = null;
            this.edges[index].remove();
        }
        if (!classe)
            return;
        // super.linkClass(classe, id, debug);
        if (!Status.status.loadedLogic) {
            return;
        }
        // if (!classe && id !== null) { classe = ModelPiece.getByID(id) as any as MClass; }
        var i;
        if (this.metaParent.unique && this.mtarget.indexOf(classe) >= 0) {
            // basta evitare elementi identici o anche istanze diverse con stessi valori? o con altri concetti di "uguglianza" ?
            U.pif(true, 'This reference type is labeled as "unique" and is already linked to that element.');
            return;
        }
        // for (i = 0; i < this.mtarget.length; i++) { U.arrayRemoveAll(this.mtarget[i].referencesIN, this); }
        console.log(classe, this);
        classe.referencesIN.push(this);
        this.mtarget[index] = (classe);
        this.generateEdges();
        U.pe(this.edges.length != this.mtarget.length, 'mismatch between edges and targets.', this, this.edges, this.mtarget);
        U.pif(debug, 'ref target changed; target:', classe, '; inside:', this);
        if (refreshGUI) {
            this.refreshGUI(debug);
        }
    };
    MReference.loopDetection = {};
    return MReference;
}(IReference));
export { MReference };
//# sourceMappingURL=MReference.js.map