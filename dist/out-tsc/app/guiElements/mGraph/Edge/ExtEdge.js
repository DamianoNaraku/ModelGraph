import * as tslib_1 from "tslib";
import { IEdge } from '../../../common/Joiner';
var ExtEdge = /** @class */ (function (_super) {
    tslib_1.__extends(ExtEdge, _super);
    function ExtEdge(logic, startv, end) {
        if (startv === void 0) { startv = null; }
        if (end === void 0) { end = null; }
        return _super.call(this, logic, null, startv, end) || this;
    }
    ExtEdge.prototype.canBeLinkedTo = function (target0) {
        var target = target0;
        return target && this.logic !== target && target.extends.indexOf(this.logic) === -1;
    };
    return ExtEdge;
}(IEdge));
export { ExtEdge };
//# sourceMappingURL=ExtEdge.js.map