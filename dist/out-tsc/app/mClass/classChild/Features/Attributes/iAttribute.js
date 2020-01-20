import * as tslib_1 from "tslib";
import { IFeature, U } from '../../../../common/Joiner';
var IAttribute = /** @class */ (function (_super) {
    tslib_1.__extends(IAttribute, _super);
    function IAttribute(parent, metaParent) {
        var _this = _super.call(this, parent, metaParent) || this;
        if (parent)
            U.ArrayAdd(parent.attributes, _this);
        return _this;
    }
    /*static GetDefaultStyle(modelRoot: IModel, type: EType = null): HTMLElement | SVGElement {
      return ModelPiece.GetDefaultStyle(modelRoot, 'Attribute', type); }
  
    static SetDefaultStyle(type: ShortAttribETypes, modelRoot: IModel, newTemplate: HTMLElement): void {
      const selector = '.' + (modelRoot.isM() ? 'M' : 'MM') + 'DefaultStyles>.Attribute.Template.' + type;
      let $oldTemplate: JQuery<HTMLElement> = $(selector + '.Customized');
      if ($oldTemplate.length === 0) { $oldTemplate = $(selector); }
      U.pe($oldTemplate.length !== 1, 'template not found? (' + $oldTemplate.length + '); selector: "' + selector + '"');
      const old = $oldTemplate[0];
      newTemplate.classList.add('template');
      newTemplate.classList.add('Customized');
      old.parentNode.appendChild(newTemplate);
      if (old.classList.contains('Customized')) { old.parentNode.removeChild(old); }
      return; }
  
    setDefaultStyle(value: string): void {
      U.pw(true, 'Attribute.setDefaultStyle(): todo.');
    }
  */
    /*
      getStyle(): HTMLElement | SVGElement {
        const htmlRaw: HTMLElement | SVGElement = super.getStyle();
        const $html = $(htmlRaw);
        const $selector = $html.find('select.TypeSelector') as JQuery<HTMLSelectElement>;
        let i: number;
        for (i = 0; i < $selector.length; i++) { PropertyBarr.makePrimitiveTypeSelector($selector[0], this.getType()); }
        // EType.updateTypeSelector($selector[0] as HTMLSelectElement, this.getType());
        return htmlRaw; }*/
    IAttribute.prototype.copy = function (other, nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        _super.prototype.copy.call(this, other, nameAppend, newParent);
        if (newParent) {
            U.ArrayAdd(newParent.attributes, this);
        }
        this.refreshGUI();
    };
    return IAttribute;
}(IFeature));
export { IAttribute };
var M3Attribute = /** @class */ (function (_super) {
    tslib_1.__extends(M3Attribute, _super);
    function M3Attribute(parent, meta) {
        var _this = _super.call(this, parent, meta) || this;
        _this.parse(null, true);
        return _this;
    }
    M3Attribute.prototype.duplicate = function (nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_'; }
        if (newParent === void 0) { newParent = null; }
        U.pe(true, 'Invalid operation: m3Attr.duplicate()');
        return this;
    };
    M3Attribute.prototype.generateModel = function () {
        U.pe(true, 'm3Attr.generateModel()');
        return {};
    };
    // getType(): Type { U.pe(true, 'm3Attr.getType()'); return null; }
    M3Attribute.prototype.parse = function (json, destructive) {
        if (destructive === void 0) { destructive = true; }
        this.name = 'Attribute';
    };
    M3Attribute.prototype.conformability = function (metaparent, outObj, debug) { return 1; };
    return M3Attribute;
}(IAttribute));
export { M3Attribute };
//# sourceMappingURL=iAttribute.js.map