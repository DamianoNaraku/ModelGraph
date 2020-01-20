import * as tslib_1 from "tslib";
import { M2Class, IEdge, Json, Status, U, ECoreReference, IReference, EdgeStyle, EdgeModes, EdgePointStyle, Info, } from '../../../../common/Joiner';
var M2Reference = /** @class */ (function (_super) {
    tslib_1.__extends(M2Reference, _super);
    function M2Reference(classe, json) {
        var _this = _super.call(this, classe, Status.status.mmm.getReference()) || this;
        _this.containment = false && false;
        if (!classe && !json) {
            return _this;
        } // empty constructor for .duplicate();
        _this.parse(json, true);
        return _this;
    }
    M2Reference.prototype.getModelRoot = function () { return _super.prototype.getModelRoot.call(this); };
    // todo:
    M2Reference.prototype.loadEdgeStyles = function () {
        this.edgeStyleCommon = new EdgeStyle(EdgeModes.angular23Auto, 2, '#ffffff', new EdgePointStyle(5, 1, '#ffffff', '#0000ff'));
        this.edgeStyleHighlight = new EdgeStyle(null, 4, '#ffffff', new EdgePointStyle(5, 1, '#ffffff', '#ff0000'));
        this.edgeStyleSelected = new EdgeStyle(null, 3, '#ffffff', new EdgePointStyle(7, 4, '#ffffff', '#ff0000'));
    };
    M2Reference.prototype.parse = function (json, destructive) {
        /// own attributes.
        this.setName(Json.read(json, ECoreReference.namee, 'Ref_1'));
        this.type.changeType(Json.read(json, ECoreReference.eType, this.parent.getEcoreTypeName()));
        //const eType = Json.read<string>(json, ECoreReference.eType, '#//' + this.parent.name );
        // this.type = AttribETypes.reference;
        // this.parsePrintableTypeName(eType);
        // this.linkClass();
        this.containment = Json.read(json, ECoreReference.containment, false);
        this.setLowerbound(Json.read(json, ECoreReference.lowerbound, 0));
        this.setUpperbound(Json.read(json, ECoreReference.upperbound, 1));
        var i; /*
        this.views = [];
        for(i = 0; i < this.parent.views.length; i++) {
          const pv: ClassView = this.parent.views[i];
          const v = new ReferenceView(pv);
          this.views.push(v);
          pv.referenceViews.push(v); }*/
    };
    M2Reference.prototype.generateModel = function () {
        var model = new Json(null);
        model[ECoreReference.xsitype] = 'ecore:EReference';
        model[ECoreReference.eType] = this.type.toEcoreString();
        model[ECoreReference.namee] = this.name;
        if (this.lowerbound != null && !isNaN(+this.lowerbound)) {
            model[ECoreReference.lowerbound] = +this.lowerbound;
        }
        if (this.upperbound != null && !isNaN(+this.lowerbound)) {
            model[ECoreReference.upperbound] = +this.upperbound;
        }
        if (this.containment != null) {
            model[ECoreReference.containment] = this.containment;
        }
        return model;
    };
    M2Reference.prototype.generateEdges = function () {
        if (!this.edges)
            this.edges = [null]; // size must be 1
        var e = new IEdge(this, 0, this.parent.getVertex(), this.type.classType.getVertex());
        return [e];
    };
    M2Reference.prototype.useless = function () { };
    /*
      fieldChanged(e: JQuery.ChangeEvent) {
        const html: HTMLElement = e.currentTarget;
        switch (html.tagName.toLowerCase()) {
          default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
          case 'textarea':
          case 'input': this.setName((html as HTMLInputElement).value); break;
          case 'select':
            const select: HTMLSelectElement = html as HTMLSelectElement;
            const m: M2Class = ModelPiece.getByID(+select.value) as any;
            this.linkClass(m); break;
        }
      }*/
    M2Reference.prototype.setContainment = function (b) { this.containment = b; };
    M2Reference.prototype.setUpperbound = function (n) {
        this.upperbound = n;
        var i = -1;
        while (++i < this.instances.length) {
            var mref = this.instances[i];
            mref.delete(mref.mtarget.length, Number.POSITIVE_INFINITY);
        }
    };
    M2Reference.prototype.delete = function (linkStart, linkEnd) {
        if (linkStart === void 0) { linkStart = null; }
        if (linkEnd === void 0) { linkEnd = null; }
        _super.prototype.delete.call(this, linkStart, linkEnd);
        // total deletion
        if (linkStart === null && linkEnd === null) {
            if (this.type.classType)
                U.arrayRemoveAll(this.type.classType.referencesIN, this);
            return;
        }
    };
    /*
      getStyle(debug: boolean = true): HTMLElement | SVGElement {
        const raw: HTMLElement | SVGElement = super.getStyle(debug);
        const $raw = $(raw);
        const $selector = $raw.find('select.ClassSelector');
        M2Class.updateMMClassSelector($selector[0] as HTMLSelectElement, this.classType);
        return raw; }*/
    M2Reference.prototype.duplicate = function (nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        var r = new M2Reference(null, null);
        return r.copy(this, nameAppend, newParent);
    };
    M2Reference.prototype.copy = function (r, nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        _super.prototype.copy.call(this, r, nameAppend, newParent);
        this.lowerbound = r.lowerbound;
        this.upperbound = r.upperbound;
        this.containment = r.containment;
        this.type.changeType(r.type.toEcoreString());
        this.refreshGUI();
        return this;
    };
    // linkClass(classe: M2Class = null): void { return this.type.changeType(null, null, classe); }
    // conformability(meta: M3Reference, debug: boolean = true): number { U.pw(true, 'it\'s ok but should not be called'); return 1; }
    M2Reference.prototype.getInfo = function (toLower) {
        if (toLower === void 0) { toLower = true; }
        var info = _super.prototype.getInfo.call(this);
        // set('typeOriginal', this.type);
        // info['' + 'tsClass'] = (this.getModelRoot().getPrefix()) + 'Reference';
        Info.rename(info, 'type', 'target');
        Info.rename(info, 'typeDetail', 'targetDetail');
        Info.set(info, 'containment', this.containment);
        var targetinfo = this.type.classType ? this.type.classType.getInfo(toLower) : {};
        Info.set(info, 'target', targetinfo);
        Info.merge(info, targetinfo);
        return info;
    };
    M2Reference.prototype.canBeLinkedTo = function (hoveringTarget) {
        return (hoveringTarget instanceof M2Class);
        //  return (this.type.classType === hoveringTarget || this.type.classType.isExtending(hoveringTarget));
    }; // && !(hoveringTarget instanceof EEnum); }
    return M2Reference;
}(IReference));
export { M2Reference };
//# sourceMappingURL=M2Reference.js.map