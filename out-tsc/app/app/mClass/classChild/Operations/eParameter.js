import * as tslib_1 from "tslib";
import { AttribETypes, Json, ECoreParameter, U, ECoreOperation, Typedd, Info, M3Class, } from '../../../common/Joiner';
// export abstract class EParameter extends Typedd {}
var EParameter = /** @class */ (function (_super) {
    tslib_1.__extends(EParameter, _super);
    function EParameter(parent, json) {
        var _this = _super.call(this, parent, null) || this;
        if (!parent) {
            return _this;
        } // fake constructor will allow to travel fake -> original. can't original -> fake.
        _this.parse(json);
        return _this;
    }
    EParameter.prototype.fullname = function () { return _super.prototype.fullname.call(this) + ':' + this.name; };
    EParameter.prototype.getField = function () { return this.parent ? this.parent.getField() : null; };
    EParameter.prototype.getClass = function () { return this.parent ? this.parent.parent : null; };
    EParameter.prototype.conformability = function (metaparent, outObj, debug) { U.pe(true, 'eop.conformability'); return 0; };
    EParameter.prototype.duplicate = function (nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        var c = new EParameter(null, null);
        c.copy(this, nameAppend, newParent);
        return c;
    };
    EParameter.prototype.copy = function (c, nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        _super.prototype.copy.call(this, c, nameAppend, newParent);
        //// set childrens
        // let i; for (i = 0; i < this.childrens.length; i++) { U.ArrayAdd(this.parent.arguments, this.childrens[i]); }
        this.refreshGUI();
    };
    EParameter.prototype.getInfo = function (toLower) {
        if (toLower === void 0) { toLower = false; }
        var info = _super.prototype.getInfo.call(this, toLower);
        Info.unset(info, 'instances');
        return info;
    };
    EParameter.prototype.generateModel = function () {
        var json = {};
        Json.write(json, ECoreOperation.lowerBound, '' + this.lowerbound);
        Json.write(json, ECoreOperation.upperBound, '' + this.upperbound);
        Json.write(json, ECoreOperation.ordered, '' + this.ordered);
        Json.write(json, ECoreOperation.unique, '' + this.unique);
        Json.write(json, ECoreOperation.eType, '' + this.getType().toEcoreString());
        return json;
    };
    EParameter.prototype.parse = function (json, destructive) {
        /* {"eAnnotations": {
                        "_source": "annotationtext",
                        "_references": "#//Umano/anni #//Umano/Attribute_1" },
                    "_name": "dbl",
                    "_ordered": "false",
                    "_unique": "false",
                    "_lowerBound": "1",
                    "_upperBound": "2",
                    "_eType": "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDouble" }*/
        U.pe(!this.parent || !this.parent.parent, 'json:', json, 'this: ', this, 'this.parent:', this.parent, 'this.p.p:', this.parent ? this.parent.parent : undefined);
        this.setName(this.parent.parent instanceof M3Class ? 'Parameter' : Json.read(json, ECoreParameter.namee, 'Param_1'));
        this.setLowerbound(+Json.read(json, ECoreOperation.lowerBound, 'NAN_Trigger'));
        this.setUpperbound(+Json.read(json, ECoreOperation.upperBound, 'NAN_Trigger'));
        this.ordered = 'true' === '' + Json.read(json, ECoreOperation.ordered, 'false');
        this.unique = 'true ' === '' + Json.read(json, ECoreOperation.unique, 'false');
        this.setType(Json.read(json, ECoreParameter.eType, AttribETypes.EString));
        var i; /*
        this.views = [];
        for(i = 0; i < this.parent.views.length; i++) {
          const pv: OperationView = this.parent.views[i];
          const v = new ParameterView(pv);
          this.views.push(v);
          pv.parameterView.push(v); }*/
    };
    return EParameter;
}(Typedd));
export { EParameter };
//# sourceMappingURL=eParameter.js.map