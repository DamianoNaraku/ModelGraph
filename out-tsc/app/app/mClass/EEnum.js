import * as tslib_1 from "tslib";
import { ECoreEnum, ELiteral, EType, IClassifier, Json, ShortAttribETypes, Type, U } from '../common/Joiner';
var EEnum = /** @class */ (function (_super) {
    tslib_1.__extends(EEnum, _super);
    function EEnum(parent, json) {
        var _this = _super.call(this, parent, null) || this;
        if (_this.parent) {
            U.ArrayAdd(_this.parent.enums, _this);
        }
        _this.parse(json);
        return _this;
    }
    EEnum.prototype.fullname = function () { return this.parent.name + '.' + this.name; };
    EEnum.prototype.refreshGUI_Alone = function (debug) {
        if (debug === void 0) { debug = false; }
        this.getVertex().refreshGUI();
    };
    EEnum.prototype.addLiteral = function () {
        var attr = new ELiteral(this, null);
        if (attr.ordinal === Number.NEGATIVE_INFINITY)
            this.autofixEnumValues();
        this.refreshGUI();
        return attr;
    };
    EEnum.prototype.parse = function (json, destructive) {
        /*
      <eClassifiers xsi:type="ecore:EEnum" name="EnumNamecustom" instanceTypeName="instanceTypeName"
          serializable="false">
        <eLiterals name="child2name" value="3" literal="child2literal"/>
        <eLiterals name="NameStr" literal="LiteralStr"/>
      </eClassifiers>*/
        // literal, name sono entrambi unici, ma è possibile che literal1.name === literal2.literal; .name è obbligatorio, .literal può essere null/empty
        this.childrens = [];
        this.instanceTypeName = '';
        var i;
        this.setName(Json.read(json, ECoreEnum.namee, 'Enum_1'), false);
        for (var key in json) {
            var value = json[key];
            switch (key) {
                default:
                    U.pe(true, 'Enum.parse() unexpected key:', key, 'in json:', json);
                    break;
                case ECoreEnum.xsitype:
                case ECoreEnum.namee: break;
                case ECoreEnum.eLiterals: break;
                case ECoreEnum.serializable:
                    this.serializable = value === 'true';
                    break;
                case ECoreEnum.instanceTypeName:
                    this.instanceTypeName = value + '';
                    break;
            }
        }
        var literals = Json.getChildrens(json);
        for (i = 0; i < literals.length; i++) {
            new ELiteral(this, literals[i]);
        }
        if (!this.childrens.length)
            new ELiteral(this, null);
        this.autofixEnumValues();
    };
    EEnum.prototype.duplicate = function (nameAppend, newParent) {
        return undefined;
    };
    EEnum.prototype.fieldChanged = function (e) {
        var html = e.currentTarget;
        if (html.classList.contains('AddFieldSelect'))
            return;
        switch (html.tagName.toLowerCase()) {
            case 'select':
            default:
                U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e);
                break;
            case 'textarea':
            case 'input':
                var input = html;
                input.value = this.setName(input.value);
                break;
        }
    };
    EEnum.prototype.generateModel = function () {
        var arr = [];
        var model = {};
        model[ECoreEnum.xsitype] = 'ecore:EEnum';
        model[ECoreEnum.namee] = this.name;
        model[ECoreEnum.serializable] = this.serializable ? "true" : "false";
        if (this.instanceTypeName)
            model[ECoreEnum.instanceTypeName] = this.instanceTypeName;
        model[ECoreEnum.eLiterals] = arr;
        var i;
        for (i = 0; i < this.childrens.length; i++) {
            arr.push(this.childrens[i].generateModel());
        }
        return model;
    };
    /*must remain private*/ EEnum.prototype.autofixEnumValues = function () {
        // valori duplicati sono ammessi se esplicitamente inseriti, ma se il campo è vuoto io cerco di generarli
        var i;
        var valuesfound = {};
        var firsthole = 0;
        for (i = 0; i < this.childrens.length; i++) {
            var lit = this.childrens[i];
            if (lit.ordinal !== Number.NEGATIVE_INFINITY) {
                valuesfound[lit.ordinal] = true;
                if (lit.ordinal === firsthole) {
                    while (valuesfound[++firsthole]) {
                        ;
                    }
                } // update first hole.
                continue;
            }
            lit.ordinal = firsthole;
            if (!lit.name)
                lit.name = this.name + '_' + lit.ordinal;
        }
    };
    EEnum.prototype.isChildLiteralTaken = function (s) {
        var i;
        for (i = 0; i < this.childrens.length; i++) {
            if (s === this.childrens[i].literal) {
                return true;
            }
        }
        return false;
    };
    EEnum.prototype.delete = function () {
        var oldparent = this.parent;
        _super.prototype.delete.call(this);
        if (oldparent)
            U.arrayRemoveAll(oldparent.enums, this);
        // todo: che fare con gli attributes che hanno questo enum come tipo? per ora cambio in stringa.
        var i = 0;
        for (i = 0; i < Type.all.length; i++) {
            if (Type.all[i].enumType !== this)
                continue;
            Type.all[i].changeType(null, EType.get(ShortAttribETypes.EString), null, null);
        }
        Type.updateTypeSelectors(null, false, false, true);
    };
    EEnum.prototype.getDefaultValueStr = function () { return this.childrens[0].name; };
    EEnum.prototype.getAllowedValuesStr = function () {
        var arr = [];
        var i;
        for (i = 0; i < this.childrens.length; i++) {
            arr.push(this.childrens[i].name);
        }
        return arr;
    };
    EEnum.prototype.getAllowedValuesInt = function () {
        var arr = [];
        var i;
        for (i = 0; i < this.childrens.length; i++) {
            arr.push(this.childrens[i].ordinal);
        }
        return arr;
    };
    return EEnum;
}(IClassifier));
export { EEnum };
//# sourceMappingURL=EEnum.js.map