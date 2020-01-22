import * as tslib_1 from "tslib";
import { IModel } from '../common/joiner';
var MetaModel = /** @class */ (function (_super) {
    tslib_1.__extends(MetaModel, _super);
    function MetaModel(json, metaParent) {
        var _this = _super.call(this, json, metaParent) || this;
        _this.modify(json, true);
        return _this;
    }
    MetaModel.prototype.modify = function (json, destructive) { _super.prototype.modify.call(this, json, destructive); };
    // parse(deep: boolean) { super.parse(deep); }
    MetaModel.prototype.mark = function (bool) { return _super.prototype.mark.call(this, bool); };
    MetaModel.prototype.validate = function () { return _super.prototype.validate.call(this); };
    MetaModel.prototype.conformsTo = function (m) { return _super.prototype.conformsTo.call(this, m); };
    MetaModel.prototype.draw = function () { return _super.prototype.draw.call(this); };
    MetaModel.prototype.toECore = function () { return _super.prototype.toECore.call(this); };
    MetaModel.emptyMetaModel = 'empty meta-model: todo'; // todo
    return MetaModel;
}(IModel));
export { MetaModel };
//# sourceMappingURL=MetaModel.js.map