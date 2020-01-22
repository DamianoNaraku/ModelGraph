import * as tslib_1 from "tslib";
import { U, ModelPiece, Status, M3Class, EEnum, Type } from '../../common/Joiner';
var IPackage = /** @class */ (function (_super) {
    tslib_1.__extends(IPackage, _super);
    function IPackage(mm, json, metaParent) {
        var _this = _super.call(this, mm, metaParent) || this;
        _this.classes = [];
        _this.enums = [];
        return _this;
    }
    IPackage.prototype.addEmptyEnum = function () {
        var c = new EEnum(this, null);
        if (this instanceof M3Package || !Status.status.loadedLogic)
            return;
        c.generateVertex();
        Type.updateTypeSelectors(null, false, true, false);
        return c;
    };
    // conformability(metaparent: IPackage, outObj?: any, debug?: boolean): number { return 1; }
    IPackage.prototype.fullname = function () { return this.name; };
    IPackage.prototype.getVertex = function () { return undefined; };
    IPackage.prototype.getEnum = function (name, caseSensitive, throwErr, debug) {
        if (caseSensitive === void 0) { caseSensitive = false; }
        if (throwErr === void 0) { throwErr = true; }
        if (debug === void 0) { debug = true; }
        var i;
        if (!caseSensitive) {
            name = name.toLowerCase();
        }
        for (i = 0; i < this.enums.length; i++) {
            var classname = this.enums[i].name;
            if (!caseSensitive) {
                classname = classname.toLowerCase();
            }
            if (name === classname) {
                return this.enums[i];
            }
        }
        return null;
    };
    IPackage.prototype.getClass = function (name, caseSensitive, throwErr, debug) {
        if (caseSensitive === void 0) { caseSensitive = false; }
        if (throwErr === void 0) { throwErr = true; }
        if (debug === void 0) { debug = true; }
        var i;
        if (!caseSensitive) {
            name = name.toLowerCase();
        }
        for (i = 0; i < this.classes.length; i++) {
            var classname = this.classes[i].name;
            if (!caseSensitive) {
                classname = classname.toLowerCase();
            }
            if (name === classname) {
                return this.classes[i];
            }
        }
        return null;
    };
    IPackage.prototype.duplicate = function (nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        U.pe(true, 'Package duplicate to do.');
        return undefined;
    };
    // todo:
    IPackage.prototype.refreshGUI_Alone = function (debug) {
        var i;
        for (i = 0; i < this.childrens.length; i++) {
            this.childrens[i].refreshGUI_Alone(debug);
        }
    };
    return IPackage;
}(ModelPiece));
export { IPackage };
var M3Package = /** @class */ (function (_super) {
    tslib_1.__extends(M3Package, _super);
    function M3Package(model, json) {
        var _this = _super.call(this, model, json, null) || this;
        _this.parse(json, true);
        return _this;
    }
    M3Package.prototype.getClass = function (name, caseSensitive, throwErr, debug) {
        if (caseSensitive === void 0) { caseSensitive = false; }
        if (throwErr === void 0) { throwErr = true; }
        if (debug === void 0) { debug = true; }
        return _super.prototype.getClass.call(this, name, caseSensitive, throwErr, debug);
    };
    M3Package.prototype.addEmptyClass = function (metaVersion) {
        var c = new M3Class(this, null);
        return c;
    };
    M3Package.prototype.generateModel = function () {
        return undefined;
    };
    M3Package.prototype.parse = function (json, destructive) {
        if (destructive === void 0) { destructive = true; }
        this.name = 'Package';
        this.addEmptyClass(null);
        this.addEmptyEnum();
        this.enums[0].setName('Enumeration');
    };
    M3Package.prototype.refreshGUI_Alone = function (debug) {
        if (debug === void 0) { debug = true; }
    };
    return M3Package;
}(IPackage));
export { M3Package };
//# sourceMappingURL=iPackage.js.map