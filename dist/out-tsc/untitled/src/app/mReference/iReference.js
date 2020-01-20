import * as tslib_1 from "tslib";
import { IClass, IEdge, IModel, Json, ModelPiece, PropertyBarr, Status, U } from '../common/joiner';
import { eCoreReference } from '../common/util';
var IReference = /** @class */ (function (_super) {
    tslib_1.__extends(IReference, _super);
    function IReference(classe, json, metaParent) {
        var _this = _super.call(this, classe, metaParent) || this;
        _this.htmlRaw = null;
        _this.html = null;
        _this.styleOfInstances = null;
        _this.type = null;
        _this.upperbound = null;
        _this.lowerbound = null;
        _this.containment = null;
        if (json === null) {
            json = _this.generateEmptyReference();
        }
        _this.setJson(json);
        _this.modify(json, true);
        IReference.all[_this.fullname] = _this;
        return _this;
    }
    IReference.prototype.generateEmptyReference = function () {
        var str = '          {\n' +
            '            "@xsi:type": "ecore:EReference",\n' +
            '            "@name": "NewReference",\n' +
            '            "@upperBound": "@1",\n' +
            '            "@eType": "#//' + this.parent.name + '",\n' +
            '            "@containment": "true"\n' +
            '          }\n';
        return JSON.parse(str);
    };
    IReference.prototype.getDefaultStyle = function () { return this.defaultStyle_Field(); };
    IReference.prototype.defaultStyle_Edge = function () {
        // todo
        return undefined;
    };
    IReference.prototype.defaultStyle_Field = function () {
        if (Status.status.isM()) {
            return this.defaultStyle_FieldM();
        }
        else {
            return this.defaultStyle_FieldMM();
        }
    };
    IReference.prototype.defaultStyle_FieldMM = function () {
        var container = document.createElement('div');
        // const label = document.createElement('label');
        var select = PropertyBarr.makeClassListSelector(this.getModelRoot(), null, this.target);
        var containerStyle = 'height: 22px; width: 100%; border-bottom: 1px solid lightgray; display:flex; box-sizing:content-box;';
        // const labelStyle = 'height: 100%; display:flex; order: 2; flex-grow:3; flex-shrink:3;';
        var selectStyle = 'display:flex; order:3; flex-grow:0; flex-shrink:1;';
        var name = U.toHtml('<input type="text" placeholder="Reference Name" pattern="[A-Za-z0-9_$$]+" value="$##name$" ' +
            'style="order: 1; flex-basis:10px; flex-grow:2; flex-shrink:2; min-width:3px;">');
        // const labelLabel = U.toHtml('<span style="display:flex; order:1; margin: auto; flex-grow:1; flex-shrink:0;">*</span>');
        // label.appendChild(labelLabel);
        container.setAttribute('style', containerStyle);
        // label.setAttribute('style', labelStyle);
        select.setAttribute('style', selectStyle);
        // container.classList.add('referenceField');
        // label.classList.add('referenceLabel');
        // label.appendChild(select);
        // container.appendChild(label);
        container.appendChild(name);
        container.appendChild(select);
        return container;
    };
    IReference.prototype.defaultStyle_FieldM = function () {
        var container = document.createElement('div');
        // const label = document.createElement('label');
        var select = U.toHtml('<span>$metaParent.target.name</span>');
        var containerStyle = 'height: 22px; width: 100%; border-bottom: 1px solid lightgray; display:flex; box-sizing:content-box;';
        // const labelStyle = 'height: 100%; display:flex; order: 2; flex-grow:3; flex-shrink:3;';
        var selectStyle = 'display:flex; order:3; flex-grow:0; flex-shrink:1;';
        var name = U.toHtml('<span style="order: 1; flex-basis:10px; flex-grow:2; flex-shrink:2; min-width:3px;">$##metaParent.name$</span>');
        // const labelLabel = U.toHtml('<span style="display:flex; order:1; margin: auto; flex-grow:1; flex-shrink:0;">*</span>');
        // label.appendChild(labelLabel);
        container.setAttribute('style', containerStyle);
        // label.setAttribute('style', labelStyle);
        select.setAttribute('style', selectStyle);
        // container.classList.add('referenceField');
        // label.classList.add('referenceLabel');
        // label.appendChild(select);
        // container.appendChild(label);
        container.appendChild(name);
        container.appendChild(select);
        return container;
    };
    IReference.prototype.setJson = function (j) {
        return ModelPiece.setJson(this, j);
    };
    IReference.prototype.modify = function (json, destructive) {
        // super.modify(json, destructive);
        var modelRoot = IModel.getModelRoot(this);
        this.setJson(json);
        /// own attributes.
        if (this.fullname) {
            delete IReference.all[this.fullname];
        }
        this.name = Json.read(this.json, eCoreReference.name);
        this.midname = this.parent.name + '.' + this.name;
        this.fullname = this.parent.fullname + '.' + this.name;
        IReference.all[this.fullname] = this;
        var eType = Json.read(json, eCoreReference.eType);
        // this.type = AttribETypes.reference;
        this.targetStr = this.parent.parent.name + '.' + ModelPiece.getPrintableTypeName(eType);
        this.target = modelRoot.getClass(this.targetStr);
        U.pe(!this.target, 'reference eType is not a class: ', this.targetStr, ' found in: ', json, 'classList: ', IClass.all);
        this.containment = Json.read(json, eCoreReference.containment, false);
        this.lowerbound = Json.read(json, eCoreReference.lowerbound, 1);
        this.upperbound = Json.read(json, eCoreReference.upperbound, 1);
    };
    // getPrintableTypeName(): string { return ModelPiece.getPrintableTypeName(this.type as string); }
    IReference.prototype.generateModel = function () {
        var model = new Json(null);
        model[eCoreReference.xsitype] = 'ecore:EReference';
        model[eCoreReference.name] = this.name;
        if (this.lowerbound != null) {
            model[eCoreReference.lowerbound] = this.lowerbound;
        }
        if (this.upperbound != null) {
            model[eCoreReference.upperbound] = this.upperbound;
        }
        if (this.containment != null) {
            model[eCoreReference.containment] = this.containment;
        }
        return model;
    };
    IReference.prototype.getChildIndex = function () { return ModelPiece.GetChildIndex(this); };
    IReference.prototype.remove = function () { return ModelPiece.Remove(this); };
    IReference.prototype.validate = function () { return ModelPiece.Validate(this); };
    IReference.prototype.mark = function (bool) { return ModelPiece.Mark(this, bool); };
    IReference.prototype.generateEdge = function () {
        var v1 = this.parent.getVertex();
        var v2 = this.target.getVertex();
        var e = new IEdge(v1, v2);
        return e;
    };
    IReference.prototype.generateVertex = function () { return undefined; };
    IReference.prototype.shouldBeDisplayedAsEdge = function () { return true; };
    IReference.prototype.getModelRoot = function () { return ModelPiece.getModelRoot(this); };
    IReference.prototype.setTarget = function (target) { this.target = target; };
    IReference.prototype.setContainment = function (b) { this.containment = b; };
    IReference.prototype.setUpperBound = function (n) { this.upperbound = n; };
    IReference.prototype.setLowerBound = function (n) { this.lowerbound = n; };
    IReference.prototype.fieldChanged = function (e) {
        var html = e.currentTarget;
        switch (html.tagName.toLowerCase()) {
            default:
                U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e);
                break;
            case 'input':
                this.name = html.value;
                break;
            case 'select':
                var select = html;
                this.targetStr = select.value;
                var tks = select.value.split('.');
                U.pe(tks.length !== 2, 'invalid fullname of select option, must be a full classname (1 dot):', tks);
                this.target = IClass.getByFullname(tks[0], tks[1]);
                console.log('ref target changed:', this.target, 'inside:', this, 'evt:', e);
                break;
        }
    };
    IReference.prototype.setName = function (name) {
        _super.prototype.setName.call(this, name);
        this.midname = this.parent.name + '.' + this.name;
        this.fullname = this.parent.midname + '.' + this.name;
        this.parent.refreshGUI();
    };
    IReference.prototype.refreshGUI = function () { this.parent.refreshGUI(); };
    IReference.all = [];
    return IReference;
}(ModelPiece));
export { IReference };
//# sourceMappingURL=iReference.js.map