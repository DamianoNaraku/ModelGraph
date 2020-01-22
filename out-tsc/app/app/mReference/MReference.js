import * as tslib_1 from "tslib";
import { M2Class, IEdge, Status, StringSimilarity, MClass, U, IReference } from '../common/Joiner';
var MReference = /** @class */ (function (_super) {
    tslib_1.__extends(MReference, _super);
    function MReference(classe, json, metaParent) {
        var _this = _super.call(this, classe, metaParent) || this;
        if (!classe && !json && !metaParent) {
            return _this;
        } // empty constructor for .duplicate();
        json = json === null ? MReference.generateEmptyReference(_this.parent) : json;
        _this.parse(json, true);
        return _this;
    }
    /*childrens: ModelPiece[];
    instances: ModelPiece[];
    metaParent: IReference;
    // parent: MClass;
    */
    // mtarget: MClass[];
    // targetStr: string;
    // constructor() {}
    MReference.generateEmptyReference = function (target) { return {}; };
    MReference.prototype.getStyle = function () {
        var htmlRaw = _super.prototype.getStyle.call(this);
        var $html = $(htmlRaw);
        var $selector = $html.find('select.ClassSelector');
        M2Class.updateMMClassSelector($selector[0], this.getm2Target());
        return htmlRaw;
    };
    MReference.prototype.getm2Target = function () { return this.metaParent.m2target; };
    MReference.prototype.conformability = function (meta, debug) {
        if (debug === void 0) { debug = true; }
        var comformability = 0;
        comformability += 0.1 * StringSimilarity.compareTwoStrings(this.getm2Target().name, meta.m2target.name);
        // todo: devi calcolare la 90% conformability in base al tipo dedotto della classe del m1-target.
        // comformability += 0.2 * StringSimilarity.compareTwoStrings(this.name, meta.name);
        // comformability += 0.2 * (this.metaParent.containment === meta.containment ? 1 : 0);
        U.pif(debug, 'REFERENCE.comform(', this.name, { 0: this }, ', ', meta.name, { 0: meta }, ') = ', comformability);
        return comformability;
    };
    MReference.prototype.duplicate = function (nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        var r = new MReference(null, null, null);
        return r.copy(this, nameAppend, newParent);
    };
    MReference.prototype.getInfo = function (toLower) {
        var info = {};
        var set = function (k, v) {
            k = toLower ? k.toLowerCase() : k;
            while (info[k]) {
                k = Status.status.XMLinlineMarker + k;
            }
            info[k] = v;
        };
        set('target', this.mtarget);
        var i;
        for (i = 0; i < this.mtarget.length; i++) {
            var t = this.mtarget[i];
            // todo problem: le mClassi non hanno un nome
            set('' + i, t);
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
    MReference.prototype.canBeLinkedTo = function (hoveringTarget) {
        if (!this.metaParent || !hoveringTarget.metaParent) {
            return null;
        }
        return hoveringTarget.metaParent === this.getm2Target();
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
    MReference.prototype.parse = function (json0, destructive) {
        if (destructive === void 0) { destructive = true; }
        /*
            "ReferenceName": [
              { "-name": "tizio" },  <-- reference.target[0]
              { "-name": "asd" }     <-- reference.target[1]
            ]*/
        U.pe(!destructive, 'non-destructive parse of MReference to do.');
        var json = Array.isArray(json0) ? json0 : [json0];
        var targetMM = this.metaParent.m2target;
        var i;
        if (!this.mtarget) {
            this.mtarget = [];
        }
        if (destructive) {
            for (i = 0; i < this.mtarget.length; i++) {
                U.arrayRemoveAll(this.mtarget[i].referencesIN, this);
            }
            this.mtarget = [];
        }
        var pkg = this.parent.parent;
        for (i = 0; i < json.length; i++) {
            // console.log('mref.parse: ', json0, json, 'i:', json[i]);
            if ($.isEmptyObject(json[i])) {
                continue;
            }
            var t = new MClass(pkg, json[i], targetMM);
            U.ArrayAdd(pkg.childrens, t);
            if (destructive) {
                U.ArrayAdd(this.mtarget, t);
            }
        }
    };
    MReference.prototype.validate = function () { return true; };
    MReference.prototype.generateEdge = function () {
        var arr = [];
        var i;
        for (i = 0; i < this.mtarget.length; i++) {
            arr.push(new IEdge(this, this.parent.getVertex(), this.mtarget[i].getVertex()));
        }
        return arr;
    };
    MReference.prototype.copy = function (r, nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        _super.prototype.copy.call(this, r, nameAppend, newParent);
        this.mtarget = U.ArrayCopy(r.mtarget, true);
        // this.link();
        this.refreshGUI();
        return r;
    };
    MReference.loopDetection = {};
    return MReference;
}(IReference));
export { MReference };
//# sourceMappingURL=MReference.js.map