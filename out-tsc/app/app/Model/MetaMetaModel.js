import * as tslib_1 from "tslib";
import { IModel, M3Package, U } from '../common/Joiner';
var MetaMetaModel = /** @class */ (function (_super) {
    tslib_1.__extends(MetaMetaModel, _super);
    function MetaMetaModel(json) {
        var _this = _super.call(this, null) || this;
        _this.parse(json, true);
        return _this;
    }
    MetaMetaModel.prototype.conformability = function (metaparent, outObj, debug) {
        if (outObj === void 0) { outObj = null; }
        if (debug === void 0) { debug = false; }
        return 1;
    };
    MetaMetaModel.prototype.getAllClasses = function () { return _super.prototype.getAllClasses.call(this); };
    MetaMetaModel.prototype.getAllReferences = function () { return _super.prototype.getAllReferences.call(this); };
    MetaMetaModel.prototype.generateModel = function () { return undefined; };
    MetaMetaModel.prototype.getPrefix = function () { return 'mmm'; };
    MetaMetaModel.prototype.getPrefixNum = function () { return 'm3'; };
    MetaMetaModel.prototype.isM1 = function () { return false; };
    MetaMetaModel.prototype.isM2 = function () { return false; };
    MetaMetaModel.prototype.isM3 = function () { return true; };
    MetaMetaModel.prototype.parse = function (json, destructive) {
        this.name = 'Meta-Metamodel';
        var useless = new M3Package(this, null);
    };
    MetaMetaModel.prototype.refreshGUI_Alone = function (debug) {
        if (debug === void 0) { debug = true; }
    };
    MetaMetaModel.prototype.getDefaultPackage = function () {
        if (this.childrens.length !== 0) {
            return this.childrens[0];
        }
        U.ArrayAdd(this.childrens, new M3Package(this, null));
        return this.childrens[0];
    };
    MetaMetaModel.prototype.getPackage = function () { return this.getDefaultPackage(); };
    MetaMetaModel.prototype.getClass = function (fullname, throwErr, debug) {
        if (fullname === void 0) { fullname = null; }
        if (throwErr === void 0) { throwErr = true; }
        if (debug === void 0) { debug = true; }
        return this.getDefaultPackage().classes[0];
    };
    MetaMetaModel.prototype.getAttribute = function () { return this.getClass().attributes[0]; };
    MetaMetaModel.prototype.getReference = function () { return this.getClass().references[0]; };
    MetaMetaModel.prototype.getOperation = function () { return this.getClass().getOperations()[0]; };
    MetaMetaModel.prototype.getParameter = function () { return this.getOperation().childrens[0]; };
    MetaMetaModel.prototype.duplicate = function (nameAppend) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        U.pe(true, 'invalid operation: m3.duplicate();');
        return this;
    };
    MetaMetaModel.emptyMetaMetaModel = '' + 'empty Meta-MetaModel: todo'; // todo
    return MetaMetaModel;
}(IModel));
export { MetaMetaModel };
//# sourceMappingURL=MetaMetaModel.js.map