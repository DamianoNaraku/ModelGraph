import * as tslib_1 from "tslib";
import { Status, U, ModelPiece, MetaMetaModel, LocalStorage, MetaModel, Model, GraphSize, SaveListEntry, } from '../common/Joiner';
var IModel = /** @class */ (function (_super) {
    tslib_1.__extends(IModel, _super);
    function IModel(metaVersion) {
        var _this = _super.call(this, null, metaVersion) || this;
        _this.graph = null;
        _this.sidebar = null;
        _this.storage = null;
        _this.namespaceVar = null;
        _this.uriVar = null;
        _this.viewpoints = [];
        _this.storage = new LocalStorage(_this);
        return _this;
    }
    // viewpoint: ViewPoint;
    /*
    constructor(json: Json, metaParent: MetaModel, skipParse: boolean = false) {
      super(null, metaParent);
      // todo: mi sa che chiama parse a ripetizione: Modelpiece.parse, IFeature.parse, IAttribute.parse, M2Attribute.parse...
      if (!skipParse) { this.parse(json, true); }
    }*/
    IModel.isValidURI = function (str) { return str.indexOf(' ') !== -1 && true; };
    IModel.removeInvalidNameChars = function (name) { return U.multiReplaceAll(name, [' '], ['']); };
    IModel.prototype.uri = function (str) {
        if (str === void 0) { str = null; }
        if (str) {
            if (IModel.isValidURI(str)) {
                return this.uriVar = str;
            }
            else {
                return null;
            }
        }
        if (this.uriVar) {
            return this.uriVar;
        }
        return this.uriVar = 'http://default/uri/to/change';
    };
    IModel.prototype.namespace = function (value) {
        if (value === void 0) { value = null; }
        var pos;
        if (value) {
            this.namespaceVar = value;
            pos = this.namespaceVar.lastIndexOf(':');
            this.namespaceVar = pos === -1 ? this.namespaceVar : this.namespaceVar.substring(0, pos);
        }
        var ns = this.namespaceVar;
        if (!ns) {
            return this.namespace('default.namespace.to.change');
        }
        pos = ns.lastIndexOf(':');
        return pos === -1 ? ns : ns.substring(0, pos);
    };
    IModel.prototype.getAllClasses = function () {
        var arr = [];
        var packages = this.childrens;
        var i;
        for (i = 0; i < packages.length; i++) {
            packages[i].classes.forEach(function (elem) { arr.push(elem); });
        }
        return arr;
    };
    IModel.prototype.getAllEnums = function () {
        var arr = [];
        var packages = this.childrens;
        var i;
        for (i = 0; i < packages.length; i++) {
            packages[i].enums.forEach(function (elem) { arr.push(elem); });
        }
        return arr;
    };
    IModel.prototype.fullname = function () { return this.name; };
    IModel.prototype.getVertex = function () { U.pe(true, 'IModel.getVertex();', this); return undefined; };
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
    IModel.prototype.getClass = function (fullname, throwErr, debug) {
        if (throwErr === void 0) { throwErr = true; }
        if (debug === void 0) { debug = true; }
        var tks = fullname.split('.');
        if (tks.length !== 2) {
            U.pe(throwErr, 'not a full class name:', fullname);
            return null;
        }
        var classes = this.getAllClasses();
        var i = -1;
        while (++i < classes.length) {
            var currentFname = classes[i].fullname();
            U.pif(debug, 'fllname: |' + fullname + '| =?= |' + currentFname + '| = ' + currentFname === fullname);
            if (currentFname === fullname) {
                return classes[i];
            }
        }
        var name = fullname.substr(fullname.indexOf('.') + 1);
        i = -1;
        while (++i < classes.length) {
            U.pif(debug, 'name: |' + name + '| =?= |' + classes[i].name + '| = ' + classes[i].name === name);
            if (classes[i].name === name) {
                return classes[i];
            }
        }
        U.pe(throwErr, 'valid name but unable to find it. fullname:', fullname, 'classes:', classes);
        return null;
        // let i;
        // for ( i = 0; i < pkg.childrens.length; i++) { if (pkg.childrens[i].name === fullname) { return pkg.childrens[i] as M2Class; } }
    };
    IModel.prototype.getEmptyModel = function () {
        if (this instanceof MetaMetaModel)
            return MetaMetaModel.emptyMetaMetaModel;
        if (this instanceof MetaModel)
            return MetaModel.emptyModel;
        if (this instanceof Model)
            return Model.emptyModel;
        return null;
    };
    IModel.prototype.delete = function () {
        this.storage.remove(this.name, SaveListEntry.model);
        // set empty (meta)model as most recent anonymous savefile and next to be opened.
        LocalStorage.deleteLastOpened(this instanceof MetaModel ? 2 : 1);
        /*this.storage.add(null, null, SaveListEntry.model);
        this.storage.add(null, null, SaveListEntry.view);
        this.storage.add(null, null, SaveListEntry.vertexPos);*/
        U.refreshPage();
    };
    IModel.prototype.refreshGUI_Alone = function (debug) {
        if (debug === void 0) { debug = true; }
        var i;
        for (i = 0; i < this.childrens.length; i++) {
            this.childrens[i].refreshGUI_Alone(debug);
        }
    };
    IModel.prototype.isNameTaken = function (name) { return !!this.storage.get(name, SaveListEntry.model); };
    IModel.prototype.setName = function (value, refreshGUI) {
        if (refreshGUI === void 0) { refreshGUI = false; }
        var oldname = this.name;
        if (this.isNameTaken(value)) {
            U.pw(true, 'tried to saveToDB a model with a name already in use');
            return oldname;
        }
        _super.prototype.setName.call(this, value);
        this.storage.rename(oldname, this.name, SaveListEntry.model);
        this.graph.propertyBar.refreshGUI();
        return this.name;
    };
    IModel.prototype.save = function (isAutosave, saveAs) {
        if (saveAs === void 0) { saveAs = false; }
        this.storage.saveModel(isAutosave, saveAs);
    };
    IModel.prototype.isMMM = function () { return this.isM3(); };
    IModel.prototype.isMM = function () { return this.isM2(); };
    IModel.prototype.isM = function () { return this.isM1(); };
    IModel.prototype.addClass = function (parent, meta) {
        if (parent === void 0) { parent = null; }
        if (meta === void 0) { meta = null; }
        if (!parent) {
            parent = this.getDefaultPackage();
        }
        return parent.addEmptyClass(meta);
    };
    IModel.prototype.friendlyClassName = function (toLower) {
        if (toLower === void 0) { toLower = true; }
        if (this instanceof MetaMetaModel) {
            return 'Meta-metamodel'.toLowerCase();
        }
        if (this instanceof MetaModel) {
            return 'Metamodel'.toLowerCase();
        }
        if (this instanceof Model) {
            return 'Model'.toLowerCase();
        }
        U.pe(true, 'unexpected');
        return 'error';
    };
    IModel.prototype.getLastView = function () {
        var i;
        for (i = this.viewpoints.length; --i >= 0;) {
            var vp = this.viewpoints[i];
            if (vp.isApplied)
                return vp;
        }
        return null;
    };
    IModel.getByName = function (name) {
        if (Status.status.mmm.fullname() === name)
            return Status.status.mmm;
        if (Status.status.mm.fullname() === name)
            return Status.status.mm;
        if (Status.status.m.fullname() === name)
            return Status.status.m;
        return null;
    };
    IModel.prototype.readVertexPositionSaveArr = function (dic) {
        for (var key in dic) {
            var value = new GraphSize().clone(dic[key]);
            var mp = ModelPiece.getByKeyStr(key);
            if (!mp) {
                U.pw(true, 'invalid vertex save, failed to get targetmodelpiece: ', key, dic, this);
                continue;
            }
            mp.getVertex().setSize(value);
        }
    };
    IModel.prototype.generateVertexPositionSaveArr = function () {
        var i;
        var j;
        var ret = {};
        var arr = [this.getAllEnums(), this.getAllClasses()];
        for (j = 0; j < arr.length; j++)
            for (i = 0; i < arr[j].length; i++) {
                ret[arr[j][i].getKeyStr()] = arr[j][i].getVertex().getSize();
            }
        return ret;
    };
    IModel.prototype.generateViewPointSaveArr = function () {
        /*let i: number;
        let tmp: any = [];
        for (i = 0; i < this.viewpoints.length; i++) { tmp.push(this.viewpoints[i].toJSON()); }
        return tmp;*/
        return this.viewpoints;
    };
    return IModel;
}(ModelPiece));
export { IModel };
var ECoreRoot = /** @class */ (function () {
    function ECoreRoot() {
    }
    ECoreRoot.initializeAllECoreEnums = function () {
        ECoreRoot.ecoreEPackage = 'ecore:EPackage';
        ECorePackage.eAnnotations = ECoreClass.eAnnotations = ECoreEnum.eAnnotations = EcoreLiteral.eAnnotations =
            ECoreReference.eAnnotations = ECoreAttribute.eAnnotations = ECoreOperation.eAnnotations = ECoreParameter.eAnnotations = 'eAnnotations';
        ECoreAnnotation.source = Status.status.XMLinlineMarker + 'source';
        ECoreAnnotation.references = Status.status.XMLinlineMarker + 'references'; // "#/" for target = package.
        ECoreAnnotation.details = 'details'; // arr
        ECoreDetail.key = Status.status.XMLinlineMarker + 'key'; // can have spaces
        ECoreDetail.value = Status.status.XMLinlineMarker + 'value';
        ECorePackage.eClassifiers = 'eClassifiers';
        ECorePackage.xmlnsxmi = Status.status.XMLinlineMarker + 'xmlns:xmi'; // typical value: http://www.omg.org/XMI
        ECorePackage.xmlnsxsi = Status.status.XMLinlineMarker + 'xmlns:xsi'; // typical value: http://www.w3.org/2001/XMLSchema-instance
        ECorePackage.xmiversion = Status.status.XMLinlineMarker + 'xmi:version'; // typical value: "2.0"
        ECorePackage.xmlnsecore = Status.status.XMLinlineMarker + 'xmlns:ecore';
        ECorePackage.nsURI = Status.status.XMLinlineMarker + 'nsURI'; // typical value: "http://org/eclipse/example/bowling"
        ECorePackage.nsPrefix = Status.status.XMLinlineMarker + 'nsPrefix'; // typical value: org.eclipse.example.bowling
        ECorePackage.namee = Status.status.XMLinlineMarker + 'name';
        ECoreClass.eStructuralFeatures = 'eStructuralFeatures';
        ECoreClass.eOperations = 'eOperations';
        ECoreClass.xsitype = Status.status.XMLinlineMarker + 'xsi:type'; // "ecore:EClass"
        ECoreClass.namee = ECorePackage.namee;
        ECoreClass.eSuperTypes = Status.status.XMLinlineMarker + 'eSuperTypes'; // space separated: "#name1 #name2"...
        ECoreClass.instanceTypeName = Status.status.XMLinlineMarker + 'instanceTypeName'; // raw str
        ECoreClass.instanceTypeName = Status.status.XMLinlineMarker + 'instanceTypeName';
        ECoreClass.abstract = Status.status.XMLinlineMarker + 'abstract'; // bool
        ECoreClass.interface = Status.status.XMLinlineMarker + 'interface'; // bool
        ECoreEnum.instanceTypeName = ECoreClass.instanceTypeName;
        ECoreEnum.serializable = 'serializable'; // "false", "true"
        ECoreEnum.xsitype = ECoreClass.xsitype; // "ecore:EEnum"
        ECoreEnum.eLiterals = 'eLiterals';
        ECoreEnum.namee = ECorePackage.namee;
        EcoreLiteral.literal = 'literal';
        EcoreLiteral.namee = ECorePackage.namee;
        EcoreLiteral.value = 'value'; // any integer (-inf, +inf), not null. limiti = a type int 32 bit?
        ECoreReference.xsitype = Status.status.XMLinlineMarker + 'xsi:type'; // "ecore:EReference"
        ECoreReference.eType = Status.status.XMLinlineMarker + 'eType'; // "#//Player"
        ECoreReference.containment = Status.status.XMLinlineMarker + 'containment'; // "true"
        ECoreReference.upperbound = Status.status.XMLinlineMarker + 'upperBound'; // "@1"
        ECoreReference.lowerbound = Status.status.XMLinlineMarker + 'lowerBound'; // does even exists?
        ECoreReference.namee = Status.status.XMLinlineMarker + 'name';
        ECoreAttribute.xsitype = Status.status.XMLinlineMarker + 'xsi:type'; // "ecore:EAttribute",
        ECoreAttribute.eType = Status.status.XMLinlineMarker + 'eType'; // "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EString"
        ECoreAttribute.namee = Status.status.XMLinlineMarker + 'name';
        ECoreOperation.eParameters = 'eParameters';
        ECoreOperation.namee = Status.status.XMLinlineMarker + 'name'; // "EExceptionNameCustom",
        ECoreOperation.ordered = Status.status.XMLinlineMarker + 'ordered'; // "false",
        ECoreOperation.unique = Status.status.XMLinlineMarker + 'unique'; // "false",
        ECoreOperation.lowerBound = Status.status.XMLinlineMarker + 'lowerBound'; // "5", ma che senso ha su una funzione?? è il return?
        ECoreOperation.upperBound = Status.status.XMLinlineMarker + 'upperBound';
        ECoreOperation.eType = Status.status.XMLinlineMarker + 'eType'; // "#//Classname",
        ECoreOperation.eexceptions = Status.status.XMLinlineMarker + 'eExceptions';
        // "#//ClassnameException1 #//ClassNameException2 (also custom classes) ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EInt
        ECoreParameter.namee = Status.status.XMLinlineMarker + 'name';
        ECoreParameter.ordered = Status.status.XMLinlineMarker + 'ordered'; // "false";
        ECoreParameter.unique = Status.status.XMLinlineMarker + 'unique'; // "false"
        ECoreParameter.lowerBound = Status.status.XMLinlineMarker + 'lowerBound'; // "1"
        ECoreParameter.upperBound = Status.status.XMLinlineMarker + 'upperBound'; // "2"
        ECoreParameter.eType = Status.status.XMLinlineMarker + 'eType'; // "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDoubl
        XMIModel.type = Status.status.XMLinlineMarker + 'type';
        XMIModel.namee = Status.status.XMLinlineMarker + 'name';
    };
    return ECoreRoot;
}());
export { ECoreRoot };
var ECoreAnnotation = /** @class */ (function () {
    function ECoreAnnotation() {
    }
    return ECoreAnnotation;
}());
export { ECoreAnnotation };
var ECoreDetail = /** @class */ (function () {
    function ECoreDetail() {
    }
    return ECoreDetail;
}());
export { ECoreDetail };
var ECorePackage = /** @class */ (function () {
    function ECorePackage() {
    }
    return ECorePackage;
}());
export { ECorePackage };
var ECoreClass = /** @class */ (function () {
    function ECoreClass() {
    }
    return ECoreClass;
}());
export { ECoreClass };
var ECoreEnum = /** @class */ (function () {
    function ECoreEnum() {
    }
    return ECoreEnum;
}());
export { ECoreEnum };
var EcoreLiteral = /** @class */ (function () {
    function EcoreLiteral() {
    }
    return EcoreLiteral;
}());
export { EcoreLiteral };
var ECoreReference = /** @class */ (function () {
    function ECoreReference() {
    }
    return ECoreReference;
}());
export { ECoreReference };
var ECoreAttribute = /** @class */ (function () {
    function ECoreAttribute() {
    }
    return ECoreAttribute;
}());
export { ECoreAttribute };
var ECoreOperation = /** @class */ (function () {
    function ECoreOperation() {
    }
    return ECoreOperation;
}());
export { ECoreOperation };
var ECoreParameter = /** @class */ (function () {
    function ECoreParameter() {
    }
    return ECoreParameter;
}());
export { ECoreParameter };
var XMIModel = /** @class */ (function () {
    function XMIModel() {
    }
    return XMIModel;
}());
export { XMIModel };
//# sourceMappingURL=iModel.js.map