import * as tslib_1 from "tslib";
import { Json, U, ModelPiece, ECoreAnnotation, EAnnotationDetail } from '../common/Joiner';
var EAnnotation = /** @class */ (function (_super) {
    tslib_1.__extends(EAnnotation, _super);
    function EAnnotation(parent, json) {
        var _this = _super.call(this, parent, null) || this;
        if (_this.parent) {
            U.arrayRemoveAll(_this.parent.childrens, _this);
            _this.parent.annotations.push(_this);
        }
        _this.parse(json);
        return _this;
    }
    EAnnotation.prototype.duplicate = function (nameAppend, newParent) {
        return undefined; // todo
    };
    EAnnotation.prototype.fullname = function () { return this.parent.fullname() + '//' + this.name; };
    EAnnotation.prototype.setReferencesStr = function () {
        // todo?? se è il main package diventa "#//"
    };
    EAnnotation.prototype.prepareSerialize = function () { this.setReferencesStr(); };
    EAnnotation.prototype.generateModel = function () {
        var json = {};
        this.prepareSerialize();
        var i;
        var childarr = [];
        for (i = 0; i < this.childrens.length; i++) {
            childarr.push(this.childrens[i].generateModel());
        }
        Json.write(json, ECoreAnnotation.source, this.name);
        Json.write(json, ECoreAnnotation.references, this.referencesStr);
        Json.write(json, ECoreAnnotation.details, childarr);
        return json;
    };
    EAnnotation.prototype.getVertex = function () { return this.parent.getVertex(); };
    EAnnotation.prototype.parse = function (json, destructive) {
        var key;
        this.childrens = [];
        if (!json) {
            json = {};
        }
        for (key in json) {
            var value = json[key];
            switch (key) {
                default:
                    U.pe(true, 'unexpected field in EAnnotation:  ' + key + ' => |' + value + '|');
                    break;
                case ECoreAnnotation.details: break;
                case ECoreAnnotation.references: break;
                case ECoreAnnotation.source: break;
            }
        }
        this.referencesStr = Json.read(json, ECoreAnnotation.source, '#/');
        this.setName(Json.read(json, ECoreAnnotation.name, 'EAnnotation_1'));
        var details = Json.getDetails(json);
        for (var i = 0; i < details.length; i++) {
            new EAnnotationDetail(this, details[i]);
        }
    };
    EAnnotation.prototype.refreshGUI_Alone = function (debug) {
        var v = this.getVertex();
        if (v)
            v.refreshGUI();
    };
    return EAnnotation;
}(ModelPiece));
export { EAnnotation };
//# sourceMappingURL=EAnnotation.js.map