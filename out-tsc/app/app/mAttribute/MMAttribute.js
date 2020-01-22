import * as tslib_1 from "tslib";
import { IAttribute, EType, MAttribute, ECoreAttribute, Json, U } from '../common/Joiner';
var M2Attribute = /** @class */ (function (_super) {
    tslib_1.__extends(M2Attribute, _super);
    function M2Attribute(classe, json, metaParent) {
        var _this = _super.call(this, classe, metaParent) || this;
        _this.type = null;
        if (!classe && !json && !metaParent) {
            return _this;
        } // empty constructor for .duplicate();
        if (json === null || json === undefined) {
            if (!metaParent) {
                U.pe(classe.getModelRoot().isM(), 'metaparent cannot be null on m1 constructors');
                json = M2Attribute.generateEmptyAttributeJSON(classe);
            }
            else {
                U.pe(classe.getModelRoot().isMM(), 'metaparent must be null on mm constructors');
                json = MAttribute.generateEmptyAttribute();
            }
        }
        _this.parse(json, true);
        return _this;
    }
    M2Attribute.generateEmptyAttributeJSON = function (parentClass) {
        var name = 'Attribute';
        var namei = 1;
        var json = {};
        while (parentClass.isChildNameTaken(name + '_' + namei)) {
            namei++;
        }
        Json.write(json, ECoreAttribute.namee, name + '_' + namei);
        return json;
    };
    M2Attribute.prototype.getModelRoot = function () { return _super.prototype.getModelRoot.call(this); };
    M2Attribute.prototype.parse = function (json, destructive) {
        this.setName(Json.read(json, ECoreAttribute.namee));
        var eType = Json.read(json, ECoreAttribute.eType);
        this.setType(EType.getFromLongString(eType));
    };
    M2Attribute.prototype.generateModel = function () {
        var model = new Json(null);
        Json.write(model, ECoreAttribute.xsitype, 'ecore:EAttribute');
        Json.write(model, ECoreAttribute.eType, this.type.long);
        Json.write(model, ECoreAttribute.namee, this.name);
        return model;
    };
    M2Attribute.prototype.setType = function (primitiveType) {
        var oldType = this.type;
        this.type = primitiveType;
        if (oldType === primitiveType) {
            return;
        }
        var i;
        for (i = 0; i < this.instances.length; i++) {
            var instance = this.instances[i];
            MAttribute.typeChange(instance.values, primitiveType, oldType);
        }
    };
    M2Attribute.prototype.fieldChanged = function (e) {
        var html = e.currentTarget;
        switch (html.tagName.toLowerCase()) {
            default:
                U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e);
                break;
            case 'textarea':
            case 'input':
                this.setName(html.value);
                break;
            case 'select':
                var type = EType.get(html.value);
                if (!this.type) {
                    U.pw(!this.type, 'unrecognized type. str:', (html.value), 'selectHtml:', html);
                    this.refreshGUI(); // restores the prev. selected type
                    return;
                }
                this.setType(type);
                console.log('attrib type changed:', this.type, 'inside:', this, 'evt:', e);
                break;
        }
    };
    M2Attribute.prototype.duplicate = function (nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        var a = new M2Attribute(null, null, null);
        a.copy(this, nameAppend, newParent);
        return a;
    };
    M2Attribute.prototype.copy = function (other, nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        _super.prototype.copy.call(this, other, nameAppend, newParent);
        this.setType(other.type);
    };
    M2Attribute.prototype.getType = function () { return this.type; };
    M2Attribute.prototype.replaceVarsSetup = function () { _super.prototype.replaceVarsSetup.call(this); };
    M2Attribute.prototype.conformability = function (metaparent, outObj, debug) { return 1; };
    return M2Attribute;
}(IAttribute));
export { M2Attribute };
//# sourceMappingURL=MMAttribute.js.map