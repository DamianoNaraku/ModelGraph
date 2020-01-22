import * as tslib_1 from "tslib";
import { IPackage, IClass, IAttribute, Json, U, ModelPiece, IReference } from '../common/joiner';
import { eCoreClass } from '../common/util';
var IModel = /** @class */ (function (_super) {
    tslib_1.__extends(IModel, _super);
    function IModel(json, metaParent) {
        var _this = _super.call(this, null, metaParent) || this;
        // packages: IPackage[] = null;
        _this.graph = null;
        _this.sidebar = null;
        _this.setJson(json);
        _this.modify(_this.json, true);
        return _this;
    }
    IModel.prototype.getDefaultStyle = function () { U.pe(true, 'called GetDefaultStyle on IModel'); return undefined; };
    IModel.prototype.fixReferences = function () {
        for (var fullname in IReference.all) {
            var ref = IReference.all[fullname];
            ref.target = this.getClass(ref.targetStr);
            U.pe(!ref.target, 'reference eType is not a class: ', ref.targetStr, ' found in: ', ref, 'classList: ', IClass.all);
        }
    };
    IModel.prototype.modify = function (json, destructive) {
        console.log('modelhere', 1);
        this.setJson(json);
        /// own attributes.
        /// childrens
        if (destructive) {
            this.childrens = [];
        }
        var childrens = Json.getChildrens(json);
        var i;
        for (i = 0; i < childrens.length; i++) {
            var child = childrens[i];
            if (destructive) {
                this.childrens.push(new IPackage(this, child, U.findMetaParentP(this, child)));
                continue;
            }
            U.pe(true, 'Non-destructive model modify: to do');
        }
    };
    IModel.prototype.mark = function (bool) { return bool; };
    IModel.prototype.validate = function () {
        // todo:
        return true;
    };
    IModel.prototype.conformsTo = function (m) {
        return undefined;
    };
    IModel.prototype.draw = function () {
    };
    IModel.prototype.toECore = function () {
        return '';
    };
    IModel.prototype.generateModel = function () {
        return null;
    };
    IModel.prototype.getAllPackages = function () { return this.childrens; };
    IModel.prototype.getAllClasses = function () {
        var arr = [];
        var packages = this.getAllPackages();
        var i;
        for (i = 0; i < packages.length; i++) {
            packages[i].childrens.forEach(function (elem) { arr.push(elem); });
        }
        return arr;
    };
    IModel.prototype.getAllReferences = function () {
        var arr = [];
        var classes = this.getAllClasses();
        var i;
        for (i = 0; i < classes.length; i++) {
            classes[i].references.forEach(function (elem) { arr.push(elem); });
        }
        return arr;
    };
    IModel.prototype.getPackage = function (fullname, throwErr) {
        if (throwErr === void 0) { throwErr = true; }
        if (fullname.indexOf('.') !== -1) {
            U.pe(throwErr, 'not a package name:', fullname);
            return null;
        }
        if (IPackage.all[fullname]) {
            return IPackage.all[fullname];
        }
        var i;
        for (i = 0; i < this.childrens.length; i++) {
            if (this.childrens[i].name === fullname) {
                return this.childrens[i];
            }
        }
        if (fullname.indexOf('.') !== -1) {
            U.pe(throwErr, 'valid a package name, but package does not exist:', fullname);
            return null;
        }
        return null;
    };
    IModel.prototype.getClass = function (fullname, throwErr) {
        if (throwErr === void 0) { throwErr = true; }
        var tks = fullname.split('.');
        var pkg = this.getPackage(tks[0]);
        if (tks.length !== 2) {
            U.pe(throwErr, 'not a full class name:', fullname);
            return null;
        }
        if (IClass.all[fullname]) {
            return IClass.all[fullname];
        }
        U.pe(!throwErr && pkg == null, 'valid name but unable to find it. fullname:', fullname, 'classes:', IClass.all);
        return null;
        // let i;
        // for ( i = 0; i < pkg.childrens.length; i++) { if (pkg.childrens[i].name === fullname) { return pkg.childrens[i] as IClass; } }
    };
    IModel.prototype.getFeature = function (fullname) {
        var tks = fullname.split('.');
        U.pe(tks.length !== 3, 'not a full attribute name:', fullname);
        if (IAttribute.all[fullname]) {
            return IAttribute.all[fullname];
        }
        if (IReference.all[fullname]) {
            return IReference.all[fullname];
        }
        var classe = this.getClass(tks[0] + tks[1]);
        if (classe == null) {
            return null;
        }
        var i;
        for (i = 0; i < classe.childrens.length; i++) {
            if (classe.childrens[i].name === fullname) {
                return classe.childrens[i];
            }
        }
        return null;
    };
    IModel.prototype.addEmptyP = function () {
        U.pe(true, 'todo addEmptyP()');
    };
    IModel.prototype.addEmptyClass = function (parentPackage, metaVersion) {
        var c = new IClass(parentPackage, null, metaVersion);
        parentPackage.childrens.push(c);
        c.generateVertex(null).draw();
        // todo
    };
    IModel.prototype.fieldChanged = function (e) { U.pe(true, 'shoud never happen', e); };
    IModel.prototype.addClass = function (parentPackage, metaVersion) {
        var childJson = U.cloneObj(metaVersion.json);
        Json.write(childJson, eCoreClass.name, metaVersion.name + '_obj');
        var c = new IClass(parentPackage, childJson, metaVersion);
        parentPackage.childrens.push(c);
        c.generateVertex(null).draw();
    };
    return IModel;
}(ModelPiece));
export { IModel };
//# sourceMappingURL=iModel.js.map