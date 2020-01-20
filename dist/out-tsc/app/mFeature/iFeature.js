import * as tslib_1 from "tslib";
import { U, IField, ModelPiece } from '../common/Joiner';
var IFeature = /** @class */ (function (_super) {
    tslib_1.__extends(IFeature, _super);
    function IFeature() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.upperbound = 1 || 1; // to avoid stupid compiler warning on primitive types
        _this.lowerbound = 1 || 1;
        _this.childrens = null;
        _this.instances = [];
        return _this;
    }
    IFeature.prototype.graph = function () { return this.parent.vertex.owner; };
    IFeature.prototype.getVertex = function () { return this.parent.getVertex(); };
    IFeature.prototype.linkToMetaParent = function (feature) { this.metaParent = feature; };
    IFeature.prototype.fullname = function () { return this.parent.fullname() + '.' + this.name; };
    IFeature.prototype.midname = function () { return this.parent.name + '.' + this.name; };
    IFeature.prototype.generateField = function () { return this.field = new IField(this); };
    IFeature.prototype.getField = function () { return this.field ? this.field : this.generateField(); };
    IFeature.prototype.refreshGUI_Alone = function (debug) {
        if (debug === void 0) { debug = true; }
        this.getField().refreshGUI(true);
    };
    IFeature.prototype.delete = function () {
        _super.prototype.delete.call(this);
        if (this.parent) {
            U.arrayRemoveAll(this.parent.attributes, this);
            U.arrayRemoveAll(this.parent.references, this);
        }
    };
    return IFeature;
}(ModelPiece));
export { IFeature };
/*
export abstract class M3Feature extends IFeature {
  parent: M3Class;
  metaParent: M3Feature;
  instances: M3Feature[] | M2Feature[];
}
export abstract class M2Feature extends IFeature {
  parent: M2Class;
  metaParent: M3Feature;
  instances: MFeature[];
}
export abstract class MFeature extends IFeature {
  parent: MClass;
  metaParent: M2Feature;
  instances: ModelNone;
}*/
//# sourceMappingURL=iFeature.js.map