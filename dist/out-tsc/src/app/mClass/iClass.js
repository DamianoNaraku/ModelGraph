import * as tslib_1 from "tslib";
import { IVertex, IAttribute, Json, U, ModelPiece, IReference, Status } from '../common/joiner';
import { eCoreAttribute, eCoreClass } from '../common/util';
var IClass = /** @class */ (function (_super) {
    tslib_1.__extends(IClass, _super);
    function IClass(pkg, json) {
        var _this = _super.call(this, pkg) || this;
        _this.references = null;
        _this.attributes = null;
        _this.modify(json, true);
        return _this;
    }
    IClass.getByFullname = function (targetPackageStr, targetClassStr) {
        return IClass.all[targetPackageStr + '.' + targetClassStr];
    };
    IClass.defaultSidebarHtml = function () {
        var div = document.createElement('div');
        var p = document.createElement('p');
        div.appendChild(p);
        p.innerHTML = '$##name$';
        p.classList.add('sidebarNodeName');
        div.classList.add('sidebarNode');
        div.classList.add('class');
        return div;
    };
    IClass.defaultStyle = function () {
        if (Status.status.defaultVertexStyle_Class != null) {
            return Status.status.defaultVertexStyle_Class;
        }
        var html; // = document.createElement('div');
        // html.classList.add('vertexShell');
        // html = html;
        var vertexStyle = 'height: auto; width: 100%; overflow: auto;';
        var vertexHStyle = 'height: 20px; width: 100%; text-align: center;';
        var vertexMStyle = 'margin-right:5px; float: right; width: 8px; height: 8px;';
        var attributeContainerStyle = 'display: flex; border-top: 1px solid black; flex-direction: column;';
        var referenceContainerStyle = attributeContainerStyle;
        var addFieldStyle = 'display: flex; height: 20px; width: 100%; text-align: center;';
        html = U.toHtml('<div class="Vertex vertexShell" style="' + vertexStyle + '" data-autosize="1">' +
            '<div class="VertexHeader" style="' + vertexHStyle + '">' +
            '<input type="text" placeholder="Class Name" pattern="[A-Za-z0-9_$$]+" value="$##name$"' +
            'style="text-align:center; width:100%; color:red;">$##name$</input>' +
            '<div class="VertexMinimize" style="' + vertexMStyle + '">-</div>' +
            '</div>' +
            '<div class="AttributeContainer"  style="' + attributeContainerStyle + '"></div>' +
            '<div class="ReferenceContainer"  style="' + referenceContainerStyle + '"></div>' +
            '<div class="addFieldButtonContainer" style="' + addFieldStyle + '">' +
            '<span style="display:flex; margin:auto;">Add&nbsp</span>' +
            '<select class="AddFieldSelect" style="display:flex; margin:auto;">' +
            '<optgroup label="FeatureType">' +
            '<option value="Attribute" selected>Attribute</option>' +
            '<option value="Reference">Reference</option>' +
            '</optgroup>' +
            '</select>' +
            '<span style="display:flex; margin:auto;">&nbspfield</span>' +
            '<button>Go</button>' +
            '</div>' +
            '</div>');
        var foreign = U.newSvg('foreignObject');
        foreign.appendChild(html);
        // const rect: SVGForeignObjectElement = foreign;
        // const rect: SVGForeignObjectElement = U.newSvg<SVGForeignObjectElement>('foreignObject');
        // rect.appendChild(foreign);
        foreign.setAttribute('x', '' + 0);
        foreign.setAttribute('y', '' + 0);
        foreign.setAttribute('width', '' + 200);
        foreign.setAttribute('height', '' + 100);
        Status.status.defaultVertexStyle_Class = foreign;
        return foreign;
    };
    IClass.generateEmptyeCore = function () {
        var str = '{' +
            '"@xsi:type":"ecore:EClass",' +
            '"@name":"NewClass",' +
            '"eStructuralFeatures":[' +
            //  '{"@xsi:type":"ecore:EAttribute",' +
            //   '"@name":"name",' +
            //   '"@eType":"ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EString"},' +
            //  '{"@xsi:type":"ecore:EReference",' +
            //   '"@name":"players",' +
            //   '"@upperBound":"@1",' +
            //   '"@eType":"#//Player",' +
            //   '"@containment":"true"}' +
            ']' +
            '}';
        return JSON.parse(str);
    };
    IClass.prototype.modify = function (json, destructive) {
        if (!json) {
            json = IClass.generateEmptyeCore();
        }
        this.setJson(json);
        /// own attributes.
        if (this.fullname) {
            delete IClass.all[this.fullname];
        }
        this.name = Json.read(this.json, eCoreClass.name);
        this.fullname = this.midname = this.parent.fullname + '.' + this.name;
        IClass.all[this.fullname] = this;
        /// childrens
        var childs = Json.getChildrens(json);
        var i;
        var newFeature;
        if (destructive) {
            this.childrens = [];
            this.attributes = [];
            this.references = [];
        }
        for (i = 0; i < childs.length; i++) {
            console.log('reading class children[' + i + '/' + childs.length + '] of: ', childs, 'of', json);
            var child = childs[i];
            var xsiType = Json.read(child, eCoreAttribute.xsitype);
            if (destructive) {
                switch (xsiType) {
                    default:
                        U.pe(true, 'unexpected xsi:type: ', xsiType, ' in feature:', child);
                        break;
                    case 'ecore:EAttribute':
                        this.attributes.push(newFeature = new IAttribute(this, child));
                        break;
                    case 'ecore:EReference':
                        this.references.push(newFeature = new IReference(this, child));
                        break;
                    case 'ecore:FakeElement':
                        this.attributes.push(newFeature = IAttribute.makeAddFeatureButton(this, child));
                        break;
                }
                this.childrens.push(newFeature);
                continue;
            }
            U.pe(true, 'Non-destructive class modify: to do');
        }
    };
    IClass.prototype.remove = function () {
        // controllo se il parent è il package contenente eClassifiers o se è direttamente l'array come dovrebbe.
        // U.pe(!Array.isArray(this.parent.json['@eClassifiers']), 'tried to read array in wrong position in model:', this.parent.json);
        _super.prototype.remove.call(this);
        // this.styleEditor.remove(); // rimuove dalla toolbar
        var index = IClass.all.indexOf(this);
        IClass.all.splice(index);
        return this;
    };
    IClass.prototype.mark = function (bool) { return bool; };
    IClass.prototype.validate = function () { return true === true; };
    IClass.prototype.generateModel = function () {
        var featurearr = [];
        var model = new Json(null);
        model['@ecore:eStructuralFeatures'] = featurearr;
        model['@xsi:type'] = 'ecore:EClass';
        model['@name'] = this.name;
        var i;
        for (i = 0; i < this.childrens.length; i++) {
            var feature = this.childrens[i];
            featurearr.push(feature.generateModel());
        }
        return model;
    };
    IClass.prototype.generateVertex = function (position) {
        var v = this.vertex = new IVertex();
        v.constructorClass(this);
        v.draw();
        if (position) {
            v.moveTo(position);
        }
        return v;
    };
    IClass.prototype.generateEdge = function () {
        var e = null;
        // todo check questa funzione e pure il shouldbedisplayedasedge
        this.edge = e;
        return e;
    };
    IClass.prototype.getVertex = function () {
        U.pe(this.shouldBeDisplayedAsEdge(), 'err');
        if (this.vertex == null) {
            this.generateVertex(null);
        }
        return this.vertex;
    };
    IClass.prototype.getEdge = function () {
        U.pe(!this.shouldBeDisplayedAsEdge(), 'err');
        if (this.edge == null) {
            this.generateEdge();
        }
        return this.edge;
    };
    IClass.prototype.addReference = function () {
        var ref = new IReference(this, null);
        this.references.push(ref);
        this.childrens.push(ref);
        this.json = this.generateModel();
        this.refreshGUI();
    };
    IClass.prototype.addAttribute = function () {
        var attr = new IAttribute(this, null);
        this.attributes.push(attr);
        this.childrens.push(attr);
        this.json = this.generateModel();
        this.refreshGUI();
    };
    IClass.prototype.fieldChanged = function (e) {
        var html = e.currentTarget;
        switch (html.tagName.toLowerCase()) {
            case 'select':
            default:
                U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e);
                break;
            case 'input':
                this.name = html.value;
                break;
        }
        // todo: aggiorna tutti i select type e i fullname dei suoi attributi,
        // oppure (meglio) elimina il campo fullname e rendilo disponibile solo su chiamata a funzione.
    };
    IClass.prototype.setName = function (name) {
        _super.prototype.setName.call(this, name);
        this.midname = this.parent.name + '.' + this.name;
        this.fullname = this.midname;
        this.refreshGUI();
    };
    IClass.all = [];
    return IClass;
}(ModelPiece));
export { IClass };
//# sourceMappingURL=iClass.js.map