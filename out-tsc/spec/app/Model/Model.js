import * as tslib_1 from "tslib";
import { IModel } from '../common/Joiner';
var Model = /** @class */ (function (_super) {
    tslib_1.__extends(Model, _super);
    function Model(json, metaModel) {
        var _this = _super.call(this, json, metaModel) || this;
        _this.modify(json, true);
        return _this;
    }
    Model.prototype.modify = function (json, destructive) { _super.prototype.modify.call(this, json, destructive); };
    // parse(deep: boolean) { super.parse(deep); }
    Model.prototype.mark = function (bool) { return _super.prototype.mark.call(this, bool); };
    Model.prototype.validate = function () { return _super.prototype.validate.call(this); };
    Model.prototype.conformsTo = function (m) { return _super.prototype.conformsTo.call(this, m); };
    Model.prototype.draw = function () { return _super.prototype.draw.call(this); };
    Model.prototype.toECore = function () { return _super.prototype.toECore.call(this); };
    Model.emptyModel = 'empty model: todo'; // todo
    return Model;
}(IModel));
export { Model };
//# sourceMappingURL=Model.js.map