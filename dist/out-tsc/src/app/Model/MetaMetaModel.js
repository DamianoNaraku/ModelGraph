import * as tslib_1 from "tslib";
import { IModel } from '../common/joiner';
var MetaMetaModel = /** @class */ (function (_super) {
    tslib_1.__extends(MetaMetaModel, _super);
    function MetaMetaModel(json) {
        var _this = _super.call(this, json, null) || this;
        _this.modify(json, true);
        return _this;
    }
    MetaMetaModel.prototype.modify = function (json, destructive) { _super.prototype.modify.call(this, json, destructive); };
    // parse(deep: boolean) { super.parse(deep); }
    MetaMetaModel.prototype.mark = function (bool) { return _super.prototype.mark.call(this, bool); };
    MetaMetaModel.prototype.validate = function () { return _super.prototype.validate.call(this); };
    MetaMetaModel.prototype.conformsTo = function (m) { return _super.prototype.conformsTo.call(this, m); };
    MetaMetaModel.prototype.draw = function () { return _super.prototype.draw.call(this); };
    MetaMetaModel.prototype.toECore = function () { return _super.prototype.toECore.call(this); };
    MetaMetaModel.emptyMetaMetaModel = 'empty Meta-MetaModel: todo'; // todo
    return MetaMetaModel;
}(IModel));
export { MetaMetaModel };
//# sourceMappingURL=MetaMetaModel.js.map