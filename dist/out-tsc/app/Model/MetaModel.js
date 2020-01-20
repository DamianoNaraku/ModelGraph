import * as tslib_1 from "tslib";
import { Json, U, IModel, M2Package, ECoreRoot, Type } from '../common/Joiner';
import { EAnnotation } from './EAnnotation';
var MetaModel = /** @class */ (function (_super) {
    tslib_1.__extends(MetaModel, _super);
    function MetaModel(json, metaParent) {
        var _this = _super.call(this, metaParent) || this;
        _this.parse(json, true);
        return _this;
    }
    MetaModel.prototype.getAllClasses = function () { return _super.prototype.getAllClasses.call(this); };
    MetaModel.prototype.getAllReferences = function () { return _super.prototype.getAllReferences.call(this); };
    MetaModel.prototype.getClass = function (fullname, throwErr, debug) {
        if (throwErr === void 0) { throwErr = true; }
        if (debug === void 0) { debug = true; }
        return _super.prototype.getClass.call(this, fullname, throwErr, debug);
    };
    MetaModel.prototype.getClassFromEcoreStr = function (targetstr) {
        U.pe(!targetstr || targetstr.indexOf(Type.classTypePrefix) !== 0, 'getClassFromString(): not a ecore class name:', targetstr);
        var classes = this.getAllClasses();
        var i;
        for (i = 0; i < classes.length; i++) {
            if (classes[i].getEcoreTypeName() === targetstr)
                return classes[i];
        }
        return null;
    };
    MetaModel.prototype.getEcoreStr_Class_Dictionary = function () {
        var classes = this.getAllClasses();
        var i;
        var dic = {};
        for (i = 0; i < classes.length; i++) {
            dic[classes[i].getEcoreTypeName()] = classes[i];
        }
        return dic;
    };
    MetaModel.prototype.getClassByNameSpace = function (fullnamespace, caseSensitive, canThrow) {
        if (caseSensitive === void 0) { caseSensitive = false; }
        if (canThrow === void 0) { canThrow = false; }
        var classes = this.getAllClasses();
        var i;
        if (caseSensitive) {
            fullnamespace = fullnamespace.toLowerCase();
        }
        var justNameMatchFallback = null;
        var namestr = fullnamespace.substr(fullnamespace.lastIndexOf(':') + 1);
        if (!caseSensitive) {
            namestr = namestr.toLowerCase();
        }
        for (i = 0; i < classes.length; i++) {
            var mmclass = classes[i];
            if ((caseSensitive ? mmclass.name : mmclass.name.toLowerCase()) === namestr) {
                justNameMatchFallback = mmclass;
            }
            var mmclassNS = mmclass.getNamespaced();
            if (!mmclassNS) {
                continue;
            }
            if (caseSensitive) {
                mmclassNS = mmclassNS.toLowerCase();
            }
            if (mmclassNS === fullnamespace) {
                return mmclass;
            }
        }
        U.pe(!justNameMatchFallback, 'class |' + fullnamespace + '| not found. classArr:', classes);
        return justNameMatchFallback;
    };
    /*
      fixReferences(): void {
        const arr: M2Reference[] = this.getAllReferences();
        let i = -1;
        while (++i < arr.length) {
          arr[i].linkClass();
          U.pe(!arr[i].classType, arr[i], Status.status.loadedLogic);
        } }*/
    MetaModel.prototype.parse = function (json, destructive) {
        if (destructive === void 0) { destructive = true; }
        if (destructive) {
            this.childrens = [];
        }
        var childrens = Json.getChildrens(json);
        var annotations = Json.getAnnotations(json);
        var i;
        for (i = 0; i < annotations.length; i++) {
            var child = annotations[i];
            // metaParent = U.findMetaParentP(this, child);
            if (destructive) {
                new EAnnotation(this, child);
                continue;
            }
            U.pe(true, 'Non-destructive m2-model parse: to do');
        }
        for (i = 0; i < childrens.length; i++) {
            var child = childrens[i];
            var metaParent = null;
            // metaParent = U.findMetaParentP(this, child);
            if (destructive) {
                new M2Package(this, child);
                continue;
            }
            U.pe(true, 'Non-destructive m2-model parse: to do');
        }
    };
    MetaModel.prototype.generateModel = function () {
        var packageArr = [];
        var i;
        for (i = 0; i < this.childrens.length; i++) {
            var pkg = this.childrens[i];
            packageArr.push(pkg.generateModel());
        }
        var model = new Json(null);
        model[ECoreRoot.ecoreEPackage] = packageArr;
        return model;
    };
    MetaModel.prototype.getDefaultPackage = function () {
        if (this.childrens.length !== 0) {
            return this.childrens[0];
        }
        U.ArrayAdd(this.childrens, new M2Package(this, null));
        return this.childrens[0];
    };
    MetaModel.prototype.conformability = function (metaparent, outObj, debug) { return 1; };
    MetaModel.prototype.getPrefix = function () { return 'mm'; };
    MetaModel.prototype.getPrefixNum = function () { return 'm2'; };
    MetaModel.prototype.isM1 = function () { return false; };
    MetaModel.prototype.isM2 = function () { return true; };
    MetaModel.prototype.isM3 = function () { return false; };
    MetaModel.prototype.duplicate = function (nameAppend) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        var m = new MetaModel(null, null);
        m.copy(this);
        m.refreshGUI();
        return m;
    };
    MetaModel.emptyModel = '{}';
    MetaModel.emptyModelOld = '{ "ecore:EPackage": {\n' +
        '    "@xmlns:xmi": "http://www.omg.org/XMI",\n' +
        '    "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",\n' +
        '    "@xmlns:ecore": "http://www.eclipse.org/emf/2002/Ecore",\n' +
        '    "@xmi:version": "2.0",\n' +
        '    "eClassifiers": []' +
        '  }' +
        '}';
    return MetaModel;
}(IModel));
export { MetaModel };
//# sourceMappingURL=MetaModel.js.map