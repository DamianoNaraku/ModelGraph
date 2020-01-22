import * as tslib_1 from "tslib";
import { EOperation, IClass, IField, Info, ModelPiece, Type, U } from '../../common/Joiner';
var IClassChild = /** @class */ (function (_super) {
    tslib_1.__extends(IClassChild, _super);
    function IClassChild(parent, metaVersion) {
        var _this = _super.call(this, parent, metaVersion) || this;
        _this.upperbound = 1 || 1; // to avoid stupid compiler warning on primitive types
        _this.lowerbound = 0 || 0;
        _this.ordered = false && false;
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
    IClassChild.prototype.fieldChanged = function (e, ignoreSwitch) {
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
    IClassChild.prototype.setType = function (classOrPrimitiveString, throwError, refreshGui) {
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
    IClassChild.prototype.getType = function () { return this.type; };
    IClassChild.prototype.getInfo = function (toLower) {
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
    IClassChild.prototype.copy = function (c, nameAppend, newParent) {
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
    IClassChild.prototype.getPackage = function () { return this.parent ? this.getClass().parent : null; };
    IClassChild.prototype.graph = function () { return this.getVertex().owner; };
    IClassChild.prototype.getVertex = function () { return this.parent ? this.getClass().getVertex() : null; };
    /*linkToMetaParent<T extends IClassChild>(classChild: T) {
      U.pe(true, 'linkToMetaPrent: todo();');
      this.metaParent = classChild;
      if (!this.metaParent) { return; }
      U.ArrayAdd(this.metaParent.instances, this); }*/
    IClassChild.prototype.fullname = function () { return this.getClass().fullname() + '.' + this.name; };
    IClassChild.prototype.generateField = function () { return this.field = new IField(this); };
    IClassChild.prototype.getField = function () { return this.field ? this.field : this.generateField(); };
    IClassChild.prototype.refreshGUI_Alone = function (debug) {
        if (debug === void 0) { debug = true; }
        this.getField().refreshGUI(true);
    };
    IClassChild.prototype.delete = function () {
        _super.prototype.delete.call(this);
        if (this.parent) {
            if (this.parent instanceof IClass) {
                U.arrayRemoveAll(this.parent.attributes, this);
                U.arrayRemoveAll(this.parent.references, this);
                U.arrayRemoveAll(this.parent.getOperations(), this);
            }
            else if (this.parent instanceof EOperation) {
            }
            else {
                U.pe(true, 'unrecognized parent class:' + U.getTSClassName(this) + ':', this);
            }
        }
    };
    // getClassType(): M2Class { return this.type.classType; }
    IClassChild.prototype.getUpperbound = function () { return this.upperbound; };
    IClassChild.prototype.getLowerbound = function () { return this.lowerbound; };
    IClassChild.prototype.setUpperbound = function (val) { this.upperbound = isNaN(+val) ? -1 : +val; };
    IClassChild.prototype.setLowerbound = function (val) { this.lowerbound = isNaN(+val) || +val < 0 ? 0 : +val; };
    return IClassChild;
}(ModelPiece));
export { IClassChild };
//# sourceMappingURL=IClassChild.js.map