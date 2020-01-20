import * as tslib_1 from "tslib";
import { AttribETypes, IAttribute, ShortAttribETypes, U, StringSimilarity, Status } from '../common/Joiner';
var MAttribute = /** @class */ (function (_super) {
    tslib_1.__extends(MAttribute, _super);
    function MAttribute(parent, json, meta) {
        var _this = _super.call(this, parent, meta) || this;
        _this.parse(json, true);
        return _this;
    }
    MAttribute.typeChange = function (arr, newType, oldType) {
        var i = -1;
        while (++i < arr.length) {
            if (Array.isArray(arr[i])) {
                MAttribute.typeChange(arr[i], newType, oldType);
                continue;
            }
            var newVal = void 0;
            switch (newType.short) {
                default:
                    U.pe(true, 'unexpected type: ' + newType.short);
                    break;
                case ShortAttribETypes.EDate:
                    newVal = null;
                    break;
                case ShortAttribETypes.EFloat:
                case ShortAttribETypes.EDouble:
                    newVal = parseFloat('' + arr[i]);
                    if (newVal === null || newVal === undefined) {
                        newVal = newType.defaultValue;
                    }
                    break;
                case ShortAttribETypes.EBoolean:
                    newVal = !!arr[i];
                    break;
                case ShortAttribETypes.EChar:
                    newVal = (arr[i] + '')[0];
                    if (newVal === undefined) {
                        newVal = newType.defaultValue;
                    }
                    break;
                case ShortAttribETypes.EString:
                    newVal = (arr[i] === null || arr[i] === undefined ? null : '' + arr[i]);
                    break;
                case ShortAttribETypes.EInt:
                case ShortAttribETypes.EByte:
                case ShortAttribETypes.EShort:
                case ShortAttribETypes.ELong:
                    var tentativo = parseInt('' + arr[i], 10);
                    tentativo = !isNaN(+tentativo) ? (+tentativo) : newType.defaultValue;
                    tentativo = Math.min(newType.maxValue, Math.max(newType.minValue, tentativo));
                    break;
            }
            arr[i] = newVal;
        }
    };
    MAttribute.SplitAtNotRepeatingChar = function (str, char) {
        var ret = [];
        U.pe(char.length !== 1, 'currently only chars are supported.');
        var i;
        var indexes = [];
        var startIndex = 0;
        var endIndex = null;
        for (i = 0; i < str.length; i++) {
            var prev = i === 0 ? null : str[i - 1];
            var current = str[i];
            var next = i === str.length ? null : str[i + 1];
            if (current === char && prev !== current && next !== current) {
                indexes.push(i);
                endIndex = i;
                var match = str.substring(startIndex, endIndex);
                ret.push(match);
                startIndex = endIndex + 1;
            }
        }
        return ret;
    };
    MAttribute.generateEmptyAttribute = function () { return {}; };
    MAttribute.prototype.getModelRoot = function () { return _super.prototype.getModelRoot.call(this); };
    MAttribute.prototype.parse = function (json, destructive) {
        // if (!json) { json = }
        this.setValue(json);
        if (!this.validate()) {
            this.setValue(null);
            U.pw(true, 'marked attribute (' + this.metaParent.name + ') with type ', this.getType(), 'values:', this.values, 'this:', this);
            this.mark(true, 'errorValue');
        }
        else {
            this.mark(false, 'errorValue');
        }
    };
    MAttribute.prototype.getType = function () { return (this.metaParent ? this.metaParent.type : null); };
    MAttribute.prototype.getInfo = function (toLower) {
        if (toLower === void 0) { toLower = false; }
        var info = _super.prototype.getInfo.call(this);
        var set = function (k, v) {
            k = toLower ? k.toLowerCase() : k;
            while (info[k]) {
                k = Status.status.XMLinlineMarker + k;
            }
            info[k] = v;
        };
        var unset = function (k) { delete info[toLower ? k.toLowerCase() : k]; };
        set('values', this.values);
        unset('name');
        return info;
    };
    MAttribute.prototype.conformability = function (meta, debug) {
        if (debug === void 0) { debug = true; }
        var conformability = 0;
        // todo: questo check è totalmente sbagliato, this.getType non può riuscire senza un metaParent assegnato
        conformability += 0.5 * StringSimilarity.compareTwoStrings(this.getType().short, meta.getType().short);
        conformability += 0.5 * StringSimilarity.compareTwoStrings(this.name, meta.name);
        U.pif(debug, 'ATTRIBUTE.comform(', this.name, { 0: this }, ', ', meta.name, { 0: meta }, ') = ', conformability);
        return conformability;
    };
    MAttribute.prototype.duplicate = function (nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = null; }
        if (newParent === void 0) { newParent = null; }
        var ret = new MAttribute(newParent, null, this.metaParent);
        ret.copy(this, nameAppend, newParent);
        return ret;
    };
    MAttribute.prototype.copy = function (other, nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        _super.prototype.copy.call(this, other, nameAppend, newParent);
        this.setValueStr(other.getValueStr());
    };
    MAttribute.prototype.generateModel = function () {
        if (this.values.length === 0) {
            return null;
        }
        if (this.values.length === 1) {
            return this.values[0];
        }
        return this.values;
    };
    MAttribute.prototype.validate = function () {
        switch (this.getType().long) {
            default:
                U.pe(true, 'unexpected mattrib type:', this.getType());
                return false;
            case AttribETypes.EDate:
                U.pe(true, 'eDAte: todo');
                break;
            case AttribETypes.EBoolean: return true;
            case AttribETypes.EChar: return U.isString(this.values) || U.isCharArray(this.values);
            case AttribETypes.EString: return U.isStringArray(this.values);
            case AttribETypes.EFloat:
            case AttribETypes.EDouble: return U.isNumberArray(this.values, this.getType().minValue, this.getType().maxValue);
            case AttribETypes.EByte:
            case AttribETypes.EShort:
            case AttribETypes.EInt:
            case AttribETypes.ELong: return '' + (+this.values) === this.values + ''
                || U.isIntegerArray(this.values, this.getType().minValue, this.getType().maxValue);
        }
    };
    MAttribute.prototype.fieldChanged = function (e) {
        var html = e.currentTarget;
        switch (html.tagName.toLowerCase()) {
            default:
                U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e);
                break;
            case 'textarea':
            case 'input':
                this.setValueStr(html.value);
                break;
            case 'select':
                U.pe(true, 'non dovrebbero esserci campi select nel vertice di un MAttribute.');
                break;
        }
        try {
            this.parent.refreshGUI();
        }
        catch (e) { }
        finally { }
    };
    MAttribute.prototype.setValueStr = function (valStr) {
        if (this.metaParent.upperbound === 1) {
            // this.setValue(JSON.parse( '"' + U.replaceAll(valStr, '"', '\\"') + '"'));
            this.setValue([valStr]);
            return;
        }
        try {
            this.setValue(JSON.parse(valStr));
        }
        catch (e) {
            U.pw(true, 'This attribute have upperbound > 1 and the input is not a valid JSON string: ' + valStr);
            return;
        }
        finally { }
    };
    MAttribute.prototype.setValue = function (values, debug) {
        if (values === void 0) { values = null; }
        if (debug === void 0) { debug = false; }
        var values0 = values;
        var type = this.getType();
        var defaultv = type.defaultValue;
        if (values === null || values === undefined || $.isEmptyObject(values) || values === [{}]) {
            values = defaultv;
        }
        if (!Array.isArray(values)) {
            values = [values];
        }
        U.pif(debug, 'setvalue: |', values0, '| --> ', values, 'defaultv:', defaultv, 'type:', type);
        this.values = values;
        U.pe('' + values === '' + undefined, 'undef:', values, this);
        // this.replaceVarsSetup();
        this.refreshGUI();
    };
    MAttribute.prototype.getValueStr = function (debug) {
        if (debug === void 0) { debug = false; }
        var ret;
        if (this.metaParent.upperbound === 1) {
            ret = this.values.length ? this.values[0] : '';
        }
        else {
            ret = this.values;
        }
        var retStr = Array.isArray(ret) ? JSON.stringify(ret) : '' + ret;
        if (retStr === '' + undefined) {
            this.setValue(null);
            retStr = this.valuesStr = '' + this.values[0];
        }
        U.pif(debug, 'this.values:', this.values, ', val[0]:', this.values[0], 'retStr:', retStr);
        ///
        var field = this.getField();
        var html = field ? field.getHtml() : null;
        if (!html) {
            return retStr;
        }
        $(html).find('input')[0].value = retStr; // todo: delete
        return retStr;
    };
    MAttribute.prototype.replaceVarsSetup = function (debug) {
        if (debug === void 0) { debug = false; }
        _super.prototype.replaceVarsSetup.call(this);
        var old = this.valuesStr;
        U.pif(debug, this.values);
        var val = this.getValueStr();
        U.pif(debug, 'val:', val, ', this.values:', this.values, ', this:', this);
        this.valuesStr = val ? U.replaceAll(val, '\n', '', debug) : '';
        if (this.valuesStr && this.valuesStr[0] === '[') {
            this.valuesStr = this.valuesStr.substr(1, this.valuesStr.length - 2);
        }
        U.pif(debug, 'valuesSTR: |' + old + '| --> |' + this.valuesStr + '|');
    };
    return MAttribute;
}(IAttribute));
export { MAttribute };
//# sourceMappingURL=MAttribute.js.map