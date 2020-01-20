import * as tslib_1 from "tslib";
import { Json, U, MAttribute, Typedd, Type, EcoreLiteral } from '../../common/Joiner';
var ELiteral = /** @class */ (function (_super) {
    tslib_1.__extends(ELiteral, _super);
    function ELiteral(parent, json) {
        var _this = _super.call(this, parent, null) || this;
        _this.parse(json);
        return _this;
    }
    ELiteral.prototype.duplicate = function (nameAppend, newParent) {
        return undefined; //todo
    };
    ELiteral.prototype.generateModel = function () {
        var model = {};
        model[EcoreLiteral.value] = this.ordinal;
        model[EcoreLiteral.literal] = this.literal;
        model[EcoreLiteral.namee] = this.name;
        return model;
    };
    ELiteral.prototype.getClass = function () { return this.parent; };
    ELiteral.prototype.setLiteral = function (value, refreshGUI, warnDuplicateFix) {
        if (refreshGUI === void 0) { refreshGUI = false; }
        if (warnDuplicateFix === void 0) { warnDuplicateFix = true; }
        if (value === '' || !value) {
            this.literal = '';
            return;
        }
        return this.setName0(value, refreshGUI, warnDuplicateFix, 'literal', true);
    };
    ELiteral.prototype.parse = function (json, destructive) {
        if (destructive === void 0) { destructive = true; }
        this.ordinal = Json.read(json, EcoreLiteral.value, Number.NEGATIVE_INFINITY);
        this.setLiteral(Json.read(json, EcoreLiteral.literal, ''), false);
        var name = Json.read(json, EcoreLiteral.namee, this.ordinal === Number.NEGATIVE_INFINITY ? null : this.parent.name + '_' + this.ordinal);
        if (name)
            this.setName(name, false);
        else
            this.name = null;
    };
    ELiteral.prototype.delete = function () {
        _super.prototype.delete.call(this);
        // todo: che fare con gli attributes che hanno questo literal come valore?
        var i = 0;
        for (i = 0; i < Type.all.length; i++) {
            if (Type.all[i].enumType !== this.parent)
                continue;
            if (Type.all[i].owner instanceof MAttribute)
                Type.all[i].owner.valuesAutofix();
        }
    };
    ELiteral.prototype.fieldChanged = function (e) {
        var html = e.currentTarget;
        switch (html.tagName.toLowerCase()) {
            default:
                U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e);
                break;
            case 'textarea':
            case 'input':
                var input = html;
                if (input.classList.contains('name')) {
                    this.setName(input.value);
                }
                else if (input.classList.contains('literal')) {
                    this.setLiteral(input.value);
                }
                else if (input.classList.contains('value')) {
                    this.ordinal = isNaN(+input.value) ? this.ordinal : +input.value;
                }
                else
                    U.pe(true, 'ELiteral input fields must contain one of the following classes: name, literal, value');
                break;
            case 'select':
                U.pe(true, 'Unexpected non-disabled select field in a Vertex.ELiteral.');
                break;
        }
        _super.prototype.fieldChanged.call(this, e, true);
    };
    ELiteral.prototype.generateModelM1 = function () { return this.name; };
    return ELiteral;
}(Typedd));
export { ELiteral };
//# sourceMappingURL=ELiteral.js.map