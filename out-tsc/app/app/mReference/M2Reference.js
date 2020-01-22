import * as tslib_1 from "tslib";
import { M2Class, IEdge, Json, ModelPiece, Status, U, ECoreReference, IReference, EdgeStyle, EdgeModes, EdgePointStyle } from '../common/Joiner';
var M2Reference = /** @class */ (function (_super) {
    tslib_1.__extends(M2Reference, _super);
    /*
      static generateEmptyReference_Useless_OLD(parentClass: M2Class): Json {
        const name = 'Ref';
        let namei = 1;
        const json: Json = {};
        Json.write(json, ECoreReference.xsitype, 'ecore:EReference');
        Json.write(json, ECoreReference.eType, '#//' + parentClass.name);
        Json.write(json, ECoreReference.lowerbound, '0');
        Json.write(json, ECoreReference.upperbound, '1');
        Json.write(json, ECoreReference.containment, 'true');
        while (parentClass.isChildNameTaken(name + '_' + namei)) { namei++; }
        Json.write(json, ECoreReference.name, name + '_' + namei);
        return json; }*/
    function M2Reference(classe, json, metaParent) {
        var _this = _super.call(this, classe, metaParent) || this;
        _this.upperbound = 0 - 1;
        _this.lowerbound = 0 - 1;
        _this.containment = false && false;
        if (!classe && !json && !metaParent) {
            return _this;
        } // empty constructor for .duplicate();
        if (json === null || json === undefined) {
            if (!metaParent) {
                U.pe(classe.getModelRoot().isM(), 'metaparent cannot be null on m1 constructors');
                // json = IReference.generateEmptyReference(classe);
            }
            else {
                U.pe(classe.getModelRoot().isMM(), 'metaparent must be null on mm constructors');
                // json = MReference.generateEmptyReference();
            }
        }
        _this.parse(json, true);
        return _this;
    }
    M2Reference.generateEmptyReference_Useless = function (parentClass) {
        return {};
    };
    M2Reference.prototype.getModelRoot = function () { return _super.prototype.getModelRoot.call(this); };
    M2Reference.prototype.loadEdgeStyles = function () {
        this.edgeStyleCommon = new EdgeStyle(EdgeModes.angular23Auto, 2, '#ffffff', new EdgePointStyle(5, 1, '#ffffff', '#0000ff'));
        this.edgeStyleHighlight = new EdgeStyle(null, 4, '#ffffff', new EdgePointStyle(5, 1, '#ffffff', '#ff0000'));
        this.edgeStyleSelected = new EdgeStyle(null, 3, '#ffffff', new EdgePointStyle(7, 4, '#ffffff', '#ff0000'));
    };
    M2Reference.prototype.parse = function (json, destructive) {
        /// own attributes.
        this.setName(Json.read(json, ECoreReference.namee));
        var eType = Json.read(json, ECoreReference.eType);
        // this.type = AttribETypes.reference;
        this.targetStr = this.parent.parent.name + '.' + ModelPiece.getPrintableTypeName(eType);
        this.link();
        this.containment = Json.read(json, ECoreReference.containment, false);
        this.lowerbound = Json.read(json, ECoreReference.lowerbound, 0);
        this.upperbound = Json.read(json, ECoreReference.upperbound, 1);
    };
    M2Reference.prototype.generateModel = function () {
        var model = new Json(null);
        model[ECoreReference.xsitype] = 'ecore:EReference';
        model[ECoreReference.eType] = '#//' + this.m2target.name;
        model[ECoreReference.namee] = this.name;
        if (this.lowerbound != null && !isNaN(+this.lowerbound)) {
            model[ECoreReference.lowerbound] = +this.lowerbound;
        }
        if (this.upperbound != null && !isNaN(+this.lowerbound)) {
            model[ECoreReference.upperbound] = +this.upperbound;
        }
        if (this.containment != null) {
            model[ECoreReference.containment] = this.containment;
        }
        return model;
    };
    M2Reference.prototype.generateEdge = function () {
        var e = new IEdge(this, this.parent.getVertex(), this.m2target.getVertex());
        return [e];
    };
    M2Reference.prototype.fieldChanged = function (e) {
        var html = e.currentTarget;
        switch (html.tagName.toLowerCase()) {
            default:
                U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e);
                break;
            case 'textarea':
            case 'input':
                this.setName(html.value);
                break;
            case 'select':
                var select = html;
                var m = ModelPiece.getByID(+select.value);
                this.link(m.fullname());
                break;
        }
    };
    M2Reference.prototype.setContainment = function (b) { this.containment = b; };
    M2Reference.prototype.setUpperBound = function (n) {
        this.upperbound = n;
        var i = -1;
        while (++i < this.instances.length) {
            var mref = this.instances[i];
            mref.delete(mref.mtarget.length, Number.POSITIVE_INFINITY);
        }
    };
    M2Reference.prototype.setLowerBound = function (n) { this.lowerbound = n; };
    M2Reference.prototype.delete = function (linkStart, linkEnd) {
        if (linkStart === void 0) { linkStart = null; }
        if (linkEnd === void 0) { linkEnd = null; }
        _super.prototype.delete.call(this, linkStart, linkEnd);
        // total deletion
        if (linkStart === null && linkEnd === null) {
            U.arrayRemoveAll(this.m2target.referencesIN, this);
            return;
        }
    };
    M2Reference.prototype.getStyle = function (debug) {
        if (debug === void 0) { debug = true; }
        var raw = _super.prototype.getStyle.call(this, debug);
        var $raw = $(raw);
        var $selector = $raw.find('select.ClassSelector');
        M2Class.updateMMClassSelector($selector[0], this.m2target);
        return raw;
    };
    M2Reference.prototype.duplicate = function (nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        var r = new M2Reference(null, null, null);
        return r.copy(this, nameAppend, newParent);
    };
    M2Reference.prototype.copy = function (r, nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        _super.prototype.copy.call(this, r, nameAppend, newParent);
        this.targetStr = r.targetStr;
        this.lowerbound = r.lowerbound;
        this.upperbound = r.upperbound;
        this.containment = r.containment;
        this.m2target = r.m2target;
        this.targetStr = r.m2target.getTargetStr();
        this.link();
        this.refreshGUI();
        return this;
    };
    M2Reference.prototype.link = function (targetStr, debug) {
        if (targetStr === void 0) { targetStr = null; }
        if (debug === void 0) { debug = false; }
        if (targetStr) {
            this.targetStr = targetStr;
        }
        if (Status.status.mm === null) {
            return;
        }
        if (this.m2target) {
            U.arrayRemoveAll(this.m2target.referencesIN, this);
        }
        else {
            U.pe(!this.targetStr, 'neither target or targetStr are defined:', this);
            this.m2target = Status.status.mm.getClass(this.targetStr, true);
        }
        this.m2target.referencesIN.push(this);
        if (this.edges && this.edges[0]) {
            this.edges[0].setTarget(this.m2target.vertex);
            this.edges[0].refreshGui();
        }
        U.pif(debug, 'ref target changed; targetStr:' + targetStr + '; this.targetStr:' + this.targetStr +
            '; target:', this.m2target, 'inside:', this);
    };
    M2Reference.prototype.conformability = function (meta, debug) {
        if (debug === void 0) { debug = true; }
        U.pw(true, 'it\'s ok but should not be called');
        return 1;
    };
    M2Reference.prototype.getInfo = function (toLower) {
        if (toLower === void 0) { toLower = true; }
        var info = _super.prototype.getInfo.call(this);
        info['' + 'tsClass'] = (this.getModelRoot().getPrefix()) + 'Reference';
        var set = function (k, v) {
            k = toLower ? k.toLowerCase() : k;
            while (info[k]) {
                k = Status.status.XMLinlineMarker + k;
            }
            info[k] = v;
        };
        // set('typeOriginal', this.type);
        set('m2target', this.m2target);
        set('containment', this.containment);
        set('upperBound', this.upperbound);
        set('lowerBound', this.lowerbound);
        var targetinfo = !this.m2target ? null : this.m2target.getInfo(toLower);
        console.log('targetinfo:', targetinfo);
        var key;
        for (key in targetinfo) {
            if (!targetinfo.hasOwnProperty(key)) {
                continue;
            }
            set(key, targetinfo[key]);
        }
        return info;
    };
    M2Reference.prototype.canBeLinkedTo = function (hoveringTarget) { return this.m2target === hoveringTarget; };
    return M2Reference;
}(IReference));
export { M2Reference };
//# sourceMappingURL=M2Reference.js.map