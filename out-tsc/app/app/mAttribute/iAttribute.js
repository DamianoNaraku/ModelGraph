import * as tslib_1 from "tslib";
import { EType, IFeature, ShortAttribETypes, Status, U } from '../common/Joiner';
var IAttribute = /** @class */ (function (_super) {
    tslib_1.__extends(IAttribute, _super);
    function IAttribute() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /*static GetDefaultStyle(modelRoot: IModel, type: EType = null): HTMLElement | SVGElement {
      return ModelPiece.GetDefaultStyle(modelRoot, 'Attribute', type); }
  
    static SetDefaultStyle(type: ShortAttribETypes, modelRoot: IModel, newTemplate: HTMLElement): void {
      const selector = '.' + (modelRoot.isM() ? 'M' : 'MM') + 'DefaultStyles>.Attribute.Template.' + type;
      let $oldTemplate: JQuery<HTMLElement> = $(selector + '.Customized');
      if ($oldTemplate.length === 0) { $oldTemplate = $(selector); }
      U.pe($oldTemplate.length !== 1, 'template not found? (' + $oldTemplate.length + '); selector: "' + selector + '"');
      const old = $oldTemplate[0];
      newTemplate.classList.add('Template');
      newTemplate.classList.add('Customized');
      old.parentNode.appendChild(newTemplate);
      if (old.classList.contains('Customized')) { old.parentNode.removeChild(old); }
      return; }
  
    setDefaultStyle(value: string): void {
      U.pw(true, 'Attribute.setDefaultStyle(): todo.');
    }
  */
    IAttribute.prototype.getStyle = function () {
        var htmlRaw = _super.prototype.getStyle.call(this);
        var $html = $(htmlRaw);
        var $selector = $html.find('select.TypeSelector');
        EType.updateTypeSelector($selector[0], this.getType());
        return htmlRaw;
    };
    IAttribute.prototype.copy = function (other, nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        _super.prototype.copy.call(this, other, nameAppend, newParent);
        if (newParent) {
            U.ArrayAdd(newParent.attributes, this);
        }
        this.refreshGUI();
    };
    IAttribute.prototype.getInfo = function (toLower) {
        if (toLower === void 0) { toLower = false; }
        var info = _super.prototype.getInfo.call(this, toLower);
        var set = function (k, v) {
            k = toLower ? k.toLowerCase() : k;
            while (info[k]) {
                k = Status.status.XMLinlineMarker + k;
            }
            info[k] = v;
        };
        var unset = function (k) { delete info[toLower ? k.toLowerCase() : k]; };
        var prefix = this.getModelRoot().getPrefix().toUpperCase();
        var type = this.getType();
        set('tsClass', (prefix) + 'Attribute');
        set('type', type ? type.name : '???');
        set('typeDetail', type);
        set('lowerBound', this.lowerbound);
        set('upperBound', this.upperbound);
        unset('childrens');
        return info;
    };
    IAttribute.prototype.refreshGUI_Alone = function (debug) {
        if (debug === void 0) { debug = true; }
    };
    IAttribute.prototype.replaceVarsSetup = function () { return; };
    return IAttribute;
}(IFeature));
export { IAttribute };
var M3Attribute = /** @class */ (function (_super) {
    tslib_1.__extends(M3Attribute, _super);
    function M3Attribute(parent, meta) {
        var _this = _super.call(this, parent, meta) || this;
        _this.instances = []; // | M3Attribute[]
        _this.parse(null, true);
        return _this;
    }
    M3Attribute.prototype.duplicate = function (nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_'; }
        if (newParent === void 0) { newParent = null; }
        U.pe(true, 'm3Attr.duplicate()');
        return this;
    };
    M3Attribute.prototype.generateModel = function () {
        U.pe(true, 'm3Attr.generateModel()');
        return {};
    };
    M3Attribute.prototype.getType = function () { U.pe(true, 'm3Attr.getType()'); return EType.get(ShortAttribETypes.EString); };
    M3Attribute.prototype.parse = function (json, destructive) {
        if (destructive === void 0) { destructive = true; }
        this.name = 'Attribute';
    };
    M3Attribute.prototype.conformability = function (metaparent, outObj, debug) { return 1; };
    return M3Attribute;
}(IAttribute));
export { M3Attribute };
//# sourceMappingURL=iAttribute.js.map