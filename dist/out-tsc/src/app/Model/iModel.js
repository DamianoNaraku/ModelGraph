import * as tslib_1 from "tslib";
import { IPackage, IClass, IAttribute, Json, U, ModelPiece, IReference } from '../common/joiner';
var IModel = /** @class */ (function (_super) {
    tslib_1.__extends(IModel, _super);
    function IModel(json) {
        var _this = _super.call(this, null) || this;
        // packages: IPackage[] = null;
        _this.graph = null;
        _this.sidebar = null;
        _this.setJson(json);
        _this.modify(_this.json, true);
        return _this;
    }
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
            console.log('modelhere: (' + i + '/' + childrens.length + ')', 2);
            if (destructive) {
                this.childrens.push(new IPackage(this, child));
                continue;
            }
            console.log('modelhere', 3);
            U.pe(true, 'Non-destructive model modify: to do');
        }
    };
    IModel.prototype.modify_Old = function (json, destructive) {
        // this.rawstr = jsonStr;
        // this.rawjson = JSON.parse(this.rawstr);
        this.setJson(json);
        _super.prototype.modify.call(this, this.json, destructive);
        Json.write(this.json, '@logical', this);
        this.parse(destructive);
        this.mark(this.validate());
    };
    IModel.prototype.parse = function (deep) {
        if (deep) {
            if (this.childrens) {
                while (this.childrens.length !== 0) {
                    this.childrens[0].remove();
                }
            }
            this.childrens = [];
        }
        // 1) apply all 3 function above (parent, target, array)
        // 2) fill out variables: packages, classes
        // let field0: any;
        for (var field0 in this.json) {
            if (!this.json.hasOwnProperty(field0)) {
                continue;
            } // il compilatore mi rompe per metterlo, non toglierlo se non da problemi.
            var val0 = Json.read(this.json, field0);
            switch (field0) {
                default:
                    U.pe(true, 'unexpected tag at lv0 of jsonInput:' + field0);
                    break;
                case 'logical':
                case 'clone': break;
                case 'EPackage':
                case 'ecore:EPackage':
                    if (deep) {
                        var pkg = void 0;
                        pkg = new IPackage(this, val0);
                        this.childrens.push(pkg);
                    }
                    break;
            }
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
    IModel.prototype.addEmptyClass = function (parentPackage) {
        var c = new IClass(parentPackage, null);
        parentPackage.childrens.push(c);
        c.generateVertex(null).draw();
        // todo
    };
    IModel.prototype.fieldChanged = function (e) { U.pe(true, 'shoud never happen', e); };
    return IModel;
}(ModelPiece));
export { IModel };
//# sourceMappingURL=iModel.js.map