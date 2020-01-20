import * as tslib_1 from "tslib";
import { IAttribute, ECoreAttribute, Json, AttribETypes, Status, } from '../../../../common/Joiner';
var M2Attribute = /** @class */ (function (_super) {
    tslib_1.__extends(M2Attribute, _super);
    function M2Attribute(classe, json) {
        var _this = _super.call(this, classe, Status.status.mmm.getAttribute()) || this;
        if (!classe && !json) {
            return _this;
        } // empty constructor for .duplicate();
        _this.parse(json, true);
        return _this;
    }
    M2Attribute.prototype.getModelRoot = function () { return _super.prototype.getModelRoot.call(this); };
    M2Attribute.prototype.parse = function (json, destructive) {
        this.setName(Json.read(json, ECoreAttribute.namee, 'Attribute_1'));
        this.type.changeType(Json.read(json, ECoreAttribute.eType, AttribETypes.EString));
        /*
        this.views = [];
        let i: number;
        for(i = 0; i < this.parent.views.length; i++) {
          const pv: ClassView = this.parent.views[i];
          const v = new AttributeView(pv);
          this.views.push(v);
          pv.attributeViews.push(v); }*/
    };
    M2Attribute.prototype.generateModel = function () {
        var model = new Json(null);
        Json.write(model, ECoreAttribute.xsitype, 'ecore:EAttribute');
        Json.write(model, ECoreAttribute.eType, this.type.toEcoreString());
        Json.write(model, ECoreAttribute.namee, this.name);
        return model;
    };
    M2Attribute.prototype.duplicate = function (nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        var a = new M2Attribute(null, null);
        a.copy(this, nameAppend, newParent);
        return a;
    };
    M2Attribute.prototype.replaceVarsSetup = function () { _super.prototype.replaceVarsSetup.call(this); };
    M2Attribute.prototype.conformability = function (metaparent, outObj, debug) { return 1; };
    return M2Attribute;
}(IAttribute));
export { M2Attribute };
//# sourceMappingURL=MMAttribute.js.map