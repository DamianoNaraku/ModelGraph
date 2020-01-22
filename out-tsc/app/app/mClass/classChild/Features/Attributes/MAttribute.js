import * as tslib_1 from "tslib";
import { AttribETypes, IAttribute, ShortAttribETypes, U, Info, ELiteral, } from '../../../../common/Joiner';
var MAttribute = /** @class */ (function (_super) {
    tslib_1.__extends(MAttribute, _super);
    function MAttribute(parent, json, meta) {
        var _this = _super.call(this, parent, meta) || this;
        _this.parse(json, true);
        return _this;
    }
    MAttribute.typeChange = function (arr, newType) {
        var i = -1;
        while (++i < arr.length) {
            if (Array.isArray(arr[i])) {
                MAttribute.typeChange(arr[i], newType);
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
                    if (newVal === undefined || newVal === null) {
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
                    newVal = tentativo;
                    break;
            }
            U.pe(newVal === null || newVal === undefined, 'failed to fix value:', arr, newType);
            arr[i] = newVal;
        }
    };
    MAttribute.prototype.test = function () {
        // var topp={x:'$##@WallTopX.values.0$',y:0};var bot={x:'$##@WallBotX.values.0$',y:'$##@WallHeight.values.0$'};if(bot.y<=topp.y){return}e.B9=90+DEGREE(Math.atan((topp.x-bot.x)/(topp.y-bot.y)));
    };
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
        this.refreshGUI();
        /*
            this.views = [];
            let i: number;
            for(i = 0; i < this.parent.views.length; i++) {
              const pv: ClassView = this.parent.views[i];
              const v = new AttributeView(pv);
              this.views.push(v);
              pv.attributeViews.push(v); }*/
    };
    MAttribute.prototype.endingName = function (valueMaxLength) {
        if (valueMaxLength === void 0) { valueMaxLength = 10; }
        if (this.values && this.values.length > 0) {
            return (this.values[0] + '').substr(0, valueMaxLength);
        }
        return '';
    };
    MAttribute.prototype.getType = function () { return (this.metaParent ? this.metaParent.getType() : null); };
    MAttribute.prototype.getInfo = function (toLower) {
        if (toLower === void 0) { toLower = false; }
        var info = _super.prototype.getInfo.call(this);
        Info.set(info, 'values', this.values);
        return info;
    };
    /*
      conformability(meta: IAttribute, debug: boolean = true): number {
        let conformability = 0;
        // todo: questo check è totalmente sbagliato, this.getType non può riuscire senza un metaParent assegnato
        conformability += 0.5 * StringSimilarity.compareTwoStrings(this.getType().short, meta.getType().primitiveType.short);
        conformability += 0.5 * StringSimilarity.compareTwoStrings(this.name, meta.name);
        U.pif(debug, 'ATTRIBUTE.comform(', this.name, {0: this}, ', ', meta.name, {0: meta}, ') = ', conformability);
        return conformability; }*/
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
        var values = this.values;
        if (this.values[0] instanceof ELiteral) {
            values = [];
            var i = void 0;
            for (i = 0; i < this.values.length; i++) {
                var v = this.values[i];
                if (v instanceof ELiteral) {
                    values.push(v.generateModelM1());
                }
            }
        }
        if (values.length === 1) {
            return values[0];
        }
        return values;
    };
    MAttribute.prototype.validate = function () {
        var i;
        var primitive = this.getType().primitiveType;
        var enumtype = this.getType().enumType;
        if (enumtype) {
            var admittedValues = enumtype.getAllowedValuesStr();
            for (i = 0; i < this.values.length; i++) {
                if (!U.arrayContains(admittedValues, this.values[i])) {
                    return false;
                }
            }
            return true;
        }
        U.pe(!primitive, 'found type in Mattribute that is neither primitive nor enumerative', this);
        // console.log('U.isIntegerArray(values:', this.values, ', minvalue:', primitive.minValue, ' maxval:', primitive.maxValue);
        switch (primitive.long) {
            default:
                U.pe(true, 'unexpected mattrib type:', this.getType());
                return false;
            // case AttribETypes.void: ...
            case AttribETypes.EDate:
                U.pe(true, 'eDAte: todo');
                break;
            case AttribETypes.EBoolean: return true;
            case AttribETypes.EChar: return U.isString(this.values) || U.isCharArray(this.values);
            case AttribETypes.EString: return U.isStringArray(this.values);
            case AttribETypes.EFloat:
            case AttribETypes.EDouble:
                for (i = 0; i < this.values.length; i++) {
                    this.values[i] = +this.values[i];
                }
                return U.isNumberArray(this.values, primitive.minValue, primitive.maxValue);
            case AttribETypes.EByte:
            case AttribETypes.EShort:
            case AttribETypes.EInt:
            case AttribETypes.ELong:
                for (i = 0; i < this.values.length; i++) {
                    this.values[i] = +this.values[i];
                }
                return U.isIntegerArray(this.values, primitive.minValue, primitive.maxValue);
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
                html.value = this.getValueStr();
                break;
            case 'select':
                U.pe(true, 'Unexpected non-disabled select field in a Vertex.MAttribute.');
                break;
        }
        _super.prototype.fieldChanged.call(this, e, true);
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
    MAttribute.prototype.setValue = function (values, debug, autofix) {
        if (values === void 0) { values = null; }
        if (debug === void 0) { debug = false; }
        if (autofix === void 0) { autofix = true; }
        var values0 = values;
        if (U.isEmptyObject(values, true, true)
            || (Array.isArray(values) && (values.length === 0 || (values.length === 1 && U.isEmptyObject(values[0]))))) {
            values = this.getType().defaultValue();
        } // redundancy, i'm double fixing it. should check if autofix fixes nulls.
        if (!Array.isArray(values)) {
            values = [values];
        }
        // U.pe(values0 === null && values.length === 1 && values[0] === [0], 'wtf?', values0, values, this);
        if (debug)
            console.trace();
        U.pif(debug, this.metaParent.fullname() + '.setvalue: |', values0, '| --> ', values, 'defaultv:', this.getType().defaultValue(), 'type:', this.getType());
        this.values = values;
        U.pe('' + values === '' + undefined || '' + values === '' + null, 'undef:', values, this);
        U.pif(debug, 'end value:', values);
        if (autofix) {
            this.valuesAutofix(debug);
        }
        U.pif(debug, 'end value post autofix:', this.values);
    };
    MAttribute.prototype.valuesAutofix = function (debug) {
        if (debug === void 0) { debug = false; }
        var type = this.getType();
        var conversionType = type.enumType || type.primitiveType;
        var i;
        if (type.enumType) {
            // conversionType = null; // EType.get(ShortAttribETypes.EString);
            var defaultValue = type.enumType.getDefaultValueStr();
            if (!defaultValue) {
                this.values = [];
                return;
            }
            var admittedValues = type.enumType.getAllowedValuesStr();
            var j = void 0;
            for (j = 0; j < this.values.length; j++) {
                this.values[j] += '';
                if (U.arrayContains(admittedValues, this.values[j])) {
                    continue;
                }
                this.values[j] = admittedValues[0];
            }
        }
        if (type.primitiveType) {
            MAttribute.typeChange(this.values, type.primitiveType);
        }
    };
    MAttribute.prototype.getValueStr = function (debug) {
        if (debug === void 0) { debug = false; }
        var ret;
        ret = this.values;
        U.pif(debug, 'getvaluestr: stage1', ret);
        if (ret === undefined)
            ret = null;
        var retStr = null;
        if (ret !== null) {
            if (!(Array.isArray(ret))) {
                ret = [ret];
            }
            U.pif(debug, 'stage 1.1:', ret, retStr);
            if (this.metaParent.upperbound === 1) {
                ret = ret.length ? ret[0] : null;
            }
            U.pif(debug, 'stage 1.2:', ret, retStr);
            retStr = Array.isArray(ret) ? JSON.stringify(ret) : (ret === null || ret === undefined ? null : '' + ret);
        }
        U.pif(debug, 'stage2', ret, retStr);
        if (retStr === null) {
            this.setValue(null);
            U.pe(!this.values.length || this.values[0] === null, 'failed to set default val.', this.getType().defaultValue(), this.values);
            retStr = (this.values.length ? '' + this.values[0] : null);
        }
        U.pif(debug, 'this.values:', this.values, ', val[0]:', this.values[0], 'retStr:', retStr);
        this.valuesStr = retStr;
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