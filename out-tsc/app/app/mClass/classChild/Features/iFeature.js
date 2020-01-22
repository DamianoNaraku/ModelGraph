import * as tslib_1 from "tslib";
import { Typedd } from '../../../common/Joiner';
var IFeature = /** @class */ (function (_super) {
    tslib_1.__extends(IFeature, _super);
    function IFeature() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // linkToMetaParent<T extends IFeature>(feature: T) { this.metaParent = feature; }
    IFeature.prototype.getClass = function () { return this.parent; };
    return IFeature;
}(Typedd));
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