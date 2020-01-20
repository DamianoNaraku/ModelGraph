import * as tslib_1 from "tslib";
import { IModel, U, MPackage, Status, MClass } from '../common/Joiner';
var Model = /** @class */ (function (_super) {
    tslib_1.__extends(Model, _super);
    function Model(json, metaModel) {
        var _this = _super.call(this, metaModel) || this;
        _this.classRoot = null;
        _this.parse(json, true);
        return _this;
    }
    // fixReferences(): void {/*useless here? or useful in loops?*/}
    Model.prototype.getClassRoot = function () {
        if (this.classRoot) {
            return this.classRoot;
        }
        var classes = this.getAllClasses();
        if (classes.length)
            U.pw(true, 'Failed to get m1 class root.<br>You need to select a root class in M1\'s structured editor', this);
        if (classes.length && classes[0]) {
            classes[0].setRoot(true);
            U.ps(true, 'Class root automatically selected.');
        }
        return null;
    };
    Model.prototype.parse = function (json, destructive, metamodel) {
        if (metamodel === void 0) { metamodel = null; }
        if (!metamodel) {
            metamodel = Status.status.mm;
        }
        U.pe(!metamodel, 'parsing a model requires a metamodel linked');
        U.pw(json === '' + json, 'ModelPiece.parse() parameter must be a parsed ECORE/json. autofixed.');
        if (json === '' + json)
            json = JSON.parse(json + '');
        if (destructive) {
            this.childrens = [];
        }
        var key;
        for (key in json) {
            if (!json.hasOwnProperty(key)) {
                continue;
            }
            var namespacedclass = key;
            var mmclass = this.metaParent.getClassByNameSpace(namespacedclass, false, true);
            var value = json[key];
            new MClass(this.getDefaultPackage(), value, mmclass);
        }
        /*
        {
          "org.eclipse.example.bowling:League": { <-- :classroot
            "-xmlns:xmi": "http://www.omg.org/XMI",
            "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
            "-xmi:version": "2.0",
            "Players": [
              { "-name": "tizio" },
              { "-name": "asd" }
            ]
          }
        }
        */
    };
    // parse(deep: boolean) { super.parse(deep); }
    Model.prototype.getAllClasses = function () { return _super.prototype.getAllClasses.call(this); };
    Model.prototype.getAllReferences = function () { return _super.prototype.getAllReferences.call(this); };
    Model.prototype.getClass = function (fullname, throwErr, debug) {
        if (throwErr === void 0) { throwErr = true; }
        if (debug === void 0) { debug = true; }
        return _super.prototype.getClass.call(this, fullname, throwErr, debug);
    };
    Model.prototype.generateModel = function () {
        var json = {};
        var classRoot = this.getClassRoot();
        if (!classRoot)
            return Model.emptyModel;
        json[classRoot.metaParent.getNamespaced()] = classRoot.generateModel(true);
        return json;
    };
    // namespace(set: string = null): string { return this.metaParent.namespace(set); }
    Model.prototype.getDefaultPackage = function () {
        if (this.childrens.length !== 0) {
            return this.childrens[0];
        }
        new MPackage(this, null, this.metaParent.getDefaultPackage());
        return this.childrens[0];
    };
    Model.prototype.conformability = function (metaparent, outObj, debug) {
        U.pw(true, 'm1.conformability(): to do.');
        return 1;
    };
    Model.prototype.getPrefix = function () { return 'm'; };
    Model.prototype.getPrefixNum = function () { return 'm1'; };
    Model.prototype.isM1 = function () { return true; };
    Model.prototype.isM2 = function () { return false; };
    Model.prototype.isM3 = function () { return false; };
    Model.prototype.duplicate = function (nameAppend) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        var m = new Model(null, null);
        m.copy(this);
        m.refreshGUI();
        return m;
    };
    Model.emptyModel = '{}';
    return Model;
}(IModel));
export { Model };
//# sourceMappingURL=Model.js.map