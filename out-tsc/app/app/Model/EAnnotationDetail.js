import * as tslib_1 from "tslib";
import { Json, U, ModelPiece } from '../common/Joiner';
import { ECoreDetail } from './iModel';
var EAnnotationDetail = /** @class */ (function (_super) {
    tslib_1.__extends(EAnnotationDetail, _super);
    function EAnnotationDetail(parent, json) {
        var _this = _super.call(this, parent, null) || this;
        _this.parse(json);
        return _this;
    }
    EAnnotationDetail.prototype.duplicate = function (nameAppend, newParent) {
        return undefined; // todo
    };
    EAnnotationDetail.prototype.fullname = function () { return this.parent.fullname() + '.' + this.name; };
    EAnnotationDetail.prototype.generateModel = function () {
        var json = {};
        if (this.name !== null)
            Json.write(json, ECoreDetail.key, this.name);
        if (this.value !== null)
            Json.write(json, ECoreDetail.value, this.value);
        return json;
    };
    EAnnotationDetail.prototype.getVertex = function () { return this.parent.getVertex(); };
    EAnnotationDetail.prototype.parse = function (json, destructive) {
        var key;
        this.childrens = [];
        if (!json) {
            json = {};
        }
        for (key in json) {
            var value = json[key];
            switch (key) {
                default:
                    U.pe(true, 'unexpected field in EDetail:  ' + key + ' => |' + value + '|');
                    break;
                case ECoreDetail.key: break;
                case ECoreDetail.value: break;
            }
        }
        this.value = Json.read(json, ECoreDetail.value, '');
        this.setName(Json.read(json, ECoreDetail.key, 'DetailKey1'));
    };
    EAnnotationDetail.prototype.refreshGUI_Alone = function (debug) { return this.parent.refreshGUI_Alone(); };
    return EAnnotationDetail;
}(ModelPiece));
export { EAnnotationDetail };
//# sourceMappingURL=EAnnotationDetail.js.map