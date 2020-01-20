import * as tslib_1 from "tslib";
import { EOperation, IClass, IField, Info, ModelPiece, Type, U } from '../../common/Joiner';
var Typedd = /** @class */ (function (_super) {
    tslib_1.__extends(Typedd, _super);
    function Typedd(parent, metaVersion) {
        var _this = _super.call(this, parent, metaVersion) || this;
        // upperbound and lowerbound are defining how much values can be given to a single typed element. (nullable, single value, array)
        _this.upperbound = 1 || 1; // to avoid stupid compiler warning on primitive types
        _this.lowerbound = 0 || 0;
        // tells if the values are ordered. useless if upperbound is <= 1
        _this.ordered = false && false;
        // tells if the values are a set. useless if upperbound is <= 1
        _this.unique = false && false;
        _this.type = _this.getModelRoot().isM2() || _this.getModelRoot().isM3() ? new Type(_this) : null;
        return _this;
    }
    // typeClassFullnameStr: string = null;
    /*
      parsePrintableTypeName(eTypeLongStr: string): void {
        this.classType = null;
        this.typeClassFullnameStr = null;
        const pkg: IPackage = this.getPackage();
        const searchStr: string = '#//' || '';
        const pos = eTypeLongStr.lastIndexOf(searchStr);
        if (pos === 0 && pkg) {
          this.typeClassFullnameStr = pkg.name + '.' + eTypeLongStr.substring(pos + searchStr.length);
          return; }
        this.updateTypeAndValue(EType.getFromLongString(eTypeLongStr), false);
        U.pe(!this.getType(), 'found json ecore type that is not a classname or a primitive type.', eTypeLongStr);
        return; }*/
    Typedd.prototype.fieldChanged = function (e, ignoreSwitch) {
        if (ignoreSwitch === void 0) { ignoreSwitch = false; }
        var html = e.currentTarget;
        var graph = this.getModelRoot().graph;
        var fromGraph = U.isParentOf(graph.container, html);
        var fromSidebar = U.isParentOf(graph.propertyBar.container, html);
        if (!ignoreSwitch)
            switch (html.tagName.toLowerCase()) {
                default:
                    U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e);
                    break;
                case 'textarea':
                case 'input':
                    this.setName(html.value);
                    break;
                case 'select':
                    this.setType(html.value, true, false);
                    break;
            }
        if (!fromGraph) {
            this.refreshGUI();
        }
        if (!fromSidebar) {
            graph.propertyBar.refreshGUI();
        }
    };
    Typedd.prototype.setType = function (classOrPrimitiveString, throwError, refreshGui) {
        if (throwError === void 0) { throwError = true; }
        if (refreshGui === void 0) { refreshGui = true; }
        var type = this.getType();
        U.pe(type !== this.type, 'attempting to change parent type!', this, type);
        type.changeType(classOrPrimitiveString);
        if (refreshGui)
            this.refreshGUI();
        return true;
    };
    // updateTypeAndValue(primitiveType: EType = null, refreshGui: boolean = true): void {}
    /*
      setClassType(classType: M2Class = null, refreshGui: boolean = true): void {
        if (!classType || this.classType === classType) { return; }
        this.classType = classType;
        if (!refreshGui) { return; }
        this.refreshGUI();
        this.refreshInstancesGUI(); }*/
    Typedd.prototype.getType = function () { return this.type || this.metaParent.type; };
    Typedd.prototype.getInfo = function (toLower) {
        if (toLower === void 0) { toLower = false; }
        var info = _super.prototype.getInfo.call(this, toLower);
        if (!(this instanceof EOperation)) {
            Info.unset(info, 'childrens');
        }
        Info.set(info, 'lowerBound', this.lowerbound);
        Info.set(info, 'upperBound', this.upperbound);
        var type = this.getType();
        Info.set(info, 'type', type.toEcoreString());
        Info.set(info, 'typeDetail', type);
        return info;
    };
    // copy(other: IAttribute, nameAppend: string = '_Copy', newParent: IClass = null): void {
    Typedd.prototype.copy = function (c, nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        _super.prototype.copy.call(this, c, nameAppend, newParent);
        this.lowerbound = c.lowerbound;
        this.upperbound = c.upperbound;
        this.unique = c.unique;
        this.ordered = c.ordered;
        this.setType(c.getType().toEcoreString(), null, false);
        this.refreshGUI();
    };
    Typedd.prototype.getPackage = function () { return this.parent ? this.getClass().parent : null; };
    Typedd.prototype.graph = function () { return this.getVertex().owner; };
    Typedd.prototype.getVertex = function () { return this.parent ? this.getClass().getVertex() : null; };
    /*linkToMetaParent<T extends Typedd>(classChild: T) {
      U.pe(true, 'linkToMetaPrent: todo();');
      this.metaParent = classChild;
      if (!this.metaParent) { return; }
      U.ArrayAdd(this.metaParent.instances, this); }*/
    Typedd.prototype.fullname = function () { return this.getClass().fullname() + '.' + this.name; };
    Typedd.prototype.generateField = function () { return this.field = new IField(this); };
    Typedd.prototype.getField = function () { return this.field ? this.field : this.generateField(); };
    Typedd.prototype.refreshGUI_Alone = function (debug) {
        if (debug === void 0) { debug = true; }
        this.getField().refreshGUI(true);
    };
    Typedd.prototype.delete = function () {
        var oldparent = this.parent;
        _super.prototype.delete.call(this);
        if (oldparent) {
            if (oldparent instanceof IClass) {
                U.arrayRemoveAll(oldparent.attributes, this);
                U.arrayRemoveAll(oldparent.references, this);
                U.arrayRemoveAll(oldparent.getOperations(), this);
            }
            else if (oldparent instanceof EOperation) {
            }
            else {
                U.pe(true, 'unrecognized parent class:' + U.getTSClassName(this) + ':', this);
            }
        }
    };
    // getClassType(): M2Class { return this.type.classType; }
    Typedd.prototype.getUpperbound = function () { return this.upperbound; };
    Typedd.prototype.getLowerbound = function () { return this.lowerbound; };
    Typedd.prototype.setUpperbound = function (val) { this.upperbound = isNaN(+val) ? -1 : +val; };
    Typedd.prototype.setLowerbound = function (val) { this.lowerbound = isNaN(+val) || +val < 0 ? 0 : +val; };
    return Typedd;
}(ModelPiece));
export { Typedd };
//# sourceMappingURL=Typedd.js.map