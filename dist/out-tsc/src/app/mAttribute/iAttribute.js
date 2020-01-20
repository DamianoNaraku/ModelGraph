import * as tslib_1 from "tslib";
import { Json, ModelPiece, PropertyBarr, Status, U } from '../common/joiner';
import { eCoreAttribute, ShortAttribETypes } from '../common/util';
var IAttribute = /** @class */ (function (_super) {
    tslib_1.__extends(IAttribute, _super);
    function IAttribute(classe, json, metaParent) {
        var _this = _super.call(this, classe, metaParent) || this;
        _this.htmlRaw = null;
        _this.html = null;
        _this.styleOfInstances = null;
        _this.type = null;
        _this.val = undefined;
        if (json === null) {
            json = IAttribute.generateEmptyAttribute();
        }
        _this.modify(json, true);
        return _this;
    }
    /*
      static makeAddFeatureButton(parent: IClass, json: Json): IAttribute {
        const f = new IAttribute(parent, json);
        return f; }*/
    IAttribute.isReference = function (json) { return json['@xsi:type'] === 'ecore:EReference'; };
    IAttribute.generateEmptyAttribute = function () {
        var str = '          {\n' +
            '            "@xsi:type": "ecore:EAttribute",\n' +
            '            "@name": "NewAttribute",\n' +
            '            "@eType": "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EString"\n' +
            '          }\n';
        return JSON.parse(str);
    };
    IAttribute.prototype.defaultStyleMM = function () {
        var container = U.toHtml('<div style="height:22px; width:100%; border-bottom:1px solid lightgray; display:flex; box-sizing:content-box;"/>');
        var type = PropertyBarr.makePrimitiveTypeSelector(null, U.getLongTypeName(this.type));
        type.setAttribute('style', 'display:flex; order:2; flex-grow:2; flex-shrink:2; flex-basis:3px; min-width:3px; text-align: right;');
        var name = U.toHtml('<input type="text" placeholder="Attribute Name" pattern="[A-Za-z0-9_$$]+" value="$##name$" ' +
            'style="order: 1; flex-basis:10px; flex-grow:3; flex-shrink:3; min-width:3px;">');
        container.appendChild(type);
        container.appendChild(name);
        return container;
    };
    IAttribute.prototype.getDefaultStyle = function () {
        if (this.getModelRoot() === Status.status.m) {
            return this.defaultStyleM();
        }
        else {
            return this.defaultStyleMM();
        }
    };
    IAttribute.prototype.defaultStyleM = function () {
        var container = U.toHtml('<div style="height:22px; width:100%; border-bottom:1px solid lightgray; display:flex; box-sizing:content-box;"/>');
        var type = U.toHtml('<span style="order:0; flex-basis:10px; flex-grow:2; flex-shrink:2; min-width:3px; margin:auto; color:darkorange;">' +
            '$##metaParent.type$</span>');
        var name = U.toHtml('<span style="order:1; flex-basis:10px; flex-grow:3; flex-shrink:3; min-width:3px; margin:auto;">' +
            '$##metaParent.name$ =&nbsp</span>');
        var value;
        var valueStr;
        var valueStyle = 'order:2; flex-basis:10px; flex-grow:3; flex-shrink:3; min-width:3px;';
        // todo: idea: posso far creare nel template un <genericInput> con tutti gli attrib e style, e poi cambio SOLO la tag in fase di draw.
        switch (this.type) {
            default:
                U.pe(true, 'Unrecognized or invalid type: ', this.type);
                break;
            case ShortAttribETypes.integer:
                // value = document.createElement('input') as HTMLInputElement;
                // value.type = 'num';
                valueStr = '<input type="number" placeholder="0 (integer)" value="$##value$" step = "1" style="' + valueStyle + '">';
                value = U.toHtml(valueStr);
                break;
            case ShortAttribETypes.EString:
                valueStr = '<input type="text" placeholder="empty string" value="$##value$" style="' + valueStyle + '">';
                value = U.toHtml(valueStr);
                break;
        }
        container.appendChild(type);
        container.appendChild(name);
        container.appendChild(value);
        return container;
    };
    IAttribute.prototype.setJson = function (j) { return ModelPiece.setJson(this, j); };
    IAttribute.prototype.modify = function (json, destructive) {
        // super.modify(json, destructive);
        this.setJson(json);
        /// own attributes.
        // if (eType === 'FakeElement') { return; }
        if (this.fullname) {
            delete IAttribute.all[this.fullname];
        }
        this.name = Json.read(this.json, eCoreAttribute.name);
        this.midname = this.parent.name + '.' + this.name;
        this.fullname = this.parent.fullname + '.' + this.name;
        IAttribute.all[this.fullname] = this;
        var eType = Json.read(json, eCoreAttribute.eType);
        this.setType(U.getShortTypeName(U.getPrimitiveType(eType)));
    };
    // getPrintableTypeName(): string { return ModelPiece.getPrintableTypeName(this.type as string); }
    IAttribute.prototype.generateModel = function () {
        var model = new Json(null);
        Json.write(model, '@xsi:type', 'ecore:EAttribute');
        Json.write(model, '@eType', U.getLongTypeName(this.type));
        Json.write(model, '@name', this.name);
        return model;
    };
    IAttribute.prototype.getChildIndex = function () { return ModelPiece.GetChildIndex(this); };
    IAttribute.prototype.remove = function () { return ModelPiece.Remove(this); };
    IAttribute.prototype.validate = function () { return ModelPiece.Validate(this); };
    IAttribute.prototype.mark = function (bool) { return ModelPiece.Mark(this, bool); };
    IAttribute.prototype.getModelRoot = function () { return ModelPiece.getModelRoot(this); };
    IAttribute.prototype.generateEdge = function () { return undefined; };
    IAttribute.prototype.generateVertex = function () { return null; };
    IAttribute.prototype.shouldBeDisplayedAsEdge = function () { return false; };
    IAttribute.prototype.setType = function (primitiveType) {
        this.type = primitiveType;
    };
    IAttribute.prototype.selectCorrectOptionInStyle = function () {
        var $select = $(this.html).find('select');
        if ($select.length === 0) {
            return;
        }
        var i;
        var j;
        var findAtLeastOne = false;
        var printableType = this.type; // this.getPrintableTypeName();
        for (i = 0; i < $select.length; i++) {
            var select = $select[i];
            for (j = 0; j < select.options.length; j++) {
                var opt = select.options[j];
                console.log('check if need to be selected: ' + printableType + ' === ' + opt.value + '(' + (opt.value === '' + this.type) + ')');
                if (opt.value === printableType) {
                    opt.selected = true;
                    findAtLeastOne = true;
                    break;
                }
            }
        }
        U.pe(!findAtLeastOne, 'failed to find current type inside the select options. type:', this.type, ' printableType:', printableType, '; $select:', $select);
    };
    IAttribute.prototype.fieldChanged = function (e) {
        var html = e.currentTarget;
        switch (html.tagName.toLowerCase()) {
            default:
                U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e);
                break;
            case 'input':
                this.name = html.value;
                break;
            case 'select':
                this.setType(U.getShortTypeName(U.getPrimitiveType(html.value)));
                U.pe(!this.type, 'unrecognized type. str:', (html.value), 'selectHtml:', html);
                console.log('attrib type changed:', this.type, 'inside:', this, 'evt:', e);
                break;
        }
    };
    IAttribute.prototype.setName = function (name) {
        _super.prototype.setName.call(this, name);
        this.midname = this.parent.name + '.' + this.name;
        this.fullname = this.parent.midname + '.' + this.name;
        this.refreshGUI();
    };
    IAttribute.prototype.refreshGUI = function () { this.parent.refreshGUI(); };
    IAttribute.all = [];
    return IAttribute;
}(ModelPiece));
export { IAttribute };
//# sourceMappingURL=iAttribute.js.map