import { Json, U } from '../common/joiner';
var ModelPiece = /** @class */ (function () {
    function ModelPiece(parent, metaVersion) {
        this.id = null;
        this.metaParent = null;
        this.instances = [];
        this.parent = null;
        this.childrens = [];
        this.json = null;
        this.name = null;
        this.midname = null;
        this.fullname = null;
        this.vertex = null;
        this.edge = null;
        // styleRaw: HTMLElement | SVGElement = null;
        // style: HTMLElement | SVGElement = null;
        this.htmlRaw = null;
        this.html = null;
        this.styleOfInstances = null;
        this.parent = parent == null ? this : parent;
        if (!metaVersion) {
            metaVersion = this;
        }
        this.metaParent = metaVersion;
        this.instances = [];
        this.metaParent.instances.push(this);
        this.id = ModelPiece.idMax++;
        ModelPiece.idToLogic[this.id] = this;
    }
    ModelPiece.Remove = function (obj) {
        var oldi = obj.getChildIndex();
        var childArr = Json.getChildrens(obj.parent.json);
        console.log(obj.parent.json, childArr);
        var i;
        for (i = oldi; i + 1 < childArr.length; i++) {
            childArr[i] = childArr[i + 1]; // delete in the model.
            childArr[i] = childArr[i + 1]; // fill parent.children[] hole
            // this.parent.classes[i].childindex = i; // fix child index
        }
        childArr[i] = undefined; // dopo lo shift devo cancellare l'ultimo (che è una copia del penultimo)
        // this.styleEditor.remove(); // rimuove dalla toolbar
        return obj;
    };
    ModelPiece.GetChildIndex = function (obj) {
        var childArr = Json.getChildrens(obj.parent.json);
        console.log('parent.Json: ', obj.parent.json, 'childArr: ', childArr);
        for (var i = 0; i < childArr.length; i++) {
            console.log('cond: ', childArr[i] === obj.json, 'childarr[' + i + ']: ', childArr[i], ' === obj.json: ', obj.json);
            if (childArr[i] === obj.json) {
                return i;
            }
        }
        console.log('parent:', obj.parent);
        console.log('childArr:', 'childArr:');
        console.log('this{iModelPiece}: ', obj);
        U.pe(true, 'childindex not found !?');
    };
    // todo: look for all parse e modify, qualcuno si mette a modificare il json settando undefined nei 'childrens', è proibita ogni modifica.
    ModelPiece.Mark = function (obj, bool) { return; };
    ModelPiece.Validate = function (obj) {
        return true; // todo:
    };
    ModelPiece.getModelRoot = function (thiss) {
        var p = thiss.parent;
        var i = 0;
        while (p !== p.parent && i++ < 5) {
            p = p.parent;
        }
        return p;
    };
    ModelPiece.getLogic = function (html) {
        while (!html.dataset.modelPieceID) {
            html = html.parentNode;
        }
        return ModelPiece.idToLogic[html.dataset.modelPieceID];
    };
    ModelPiece.LinkToLogic = function (modelpiece, html) {
        html.dataset.modelPieceID = '' + modelpiece.id;
    };
    /*
      wrong: how do i detect class root iModel?
      static isPkg(thiss: ModelPiece): boolean { return ( thiss.name === thiss.fullname ); }
      static isClass(thiss: ModelPiece): boolean { return ( ! ModelPiece.isPkg(thiss) && thiss.name === thiss.midname ); }
      static isFeature(thiss: ModelPiece): boolean { return ( ! ModelPiece.isPkg(thiss) && !ModelPiece.isClass(thiss) ); }*/
    ModelPiece.setJson = function (thiss, j) {
        U.pe(!j, 'json assigned to ', j);
        return thiss.json = j;
    };
    ModelPiece.getPrintableTypeName = function (eType) {
        var pos = eType.lastIndexOf('#//');
        return eType.substring(pos + 3);
    };
    ModelPiece.prototype.getStyleFromParent = function () { return this.metaParent.styleOfInstances; };
    ModelPiece.prototype.getStyle = function () {
        var parentStyle = this.getStyleFromParent();
        if (parentStyle) {
            return parentStyle;
        }
        var defaultStyle = this.getDefaultStyle();
        return defaultStyle;
    };
    ModelPiece.prototype.linkToLogic = function (html) { return ModelPiece.LinkToLogic(this, html); };
    ModelPiece.prototype.setName = function (value) {
        value = '' + value.trim();
        console.log('modelPiece.setname(', value, ')=  ', value);
        U.pe(!value, 'wrong name:');
        Json.write(this.json, 'name', value);
        this.name = value;
        // todo: cotnrolla l'output sdi setname quando editi un package, dovrebbe essere corretto come logica e forse sbaglia solo in gui.'
        console.log('setname(); name:', value, ', this', this);
    };
    ModelPiece.prototype.setJson = function (j) { return ModelPiece.setJson(this, j); };
    // abstract modify(json: Json, destructive: boolean);
    ModelPiece.prototype.modify = function (json, destructive) {
        this.setJson(json);
        this.name = Json.read(this.json, 'name');
    };
    ModelPiece.prototype.remove = function () { return ModelPiece.Remove(this); };
    ModelPiece.prototype.refreshGUI = function () {
        if (this.vertex !== null) {
            this.vertex.refreshGUI();
        }
        if (this.edge !== null) {
            this.edge.refreshGui();
        }
        var i;
        var logic = this; // .classe ? this.classe : this.package;
        console.log(logic.instances);
        for (i = 0; i < logic.instances.length; i++) {
            var instance = logic.instances[i];
            if (instance === logic) {
                continue;
            }
            instance.refreshGUI();
        }
    };
    ModelPiece.prototype.getChildIndex = function () { return ModelPiece.GetChildIndex(this); };
    ModelPiece.prototype.mark = function (bool) { return ModelPiece.Mark(this, bool); };
    ModelPiece.prototype.validate = function () { return ModelPiece.Validate(this); };
    ModelPiece.prototype.shouldBeDisplayedAsEdge = function () {
        // todo
        return false;
    };
    /*getModelRoot(): IModel {
      let root: ModelPiece = this;
      while (root.parent !== root) { root = root.parent; }
      return root as IModel; }*/
    ModelPiece.prototype.getModelRoot = function () { return ModelPiece.getModelRoot(this); };
    ModelPiece.idToLogic = {};
    ModelPiece.idMax = 0;
    return ModelPiece;
}());
export { ModelPiece };
//# sourceMappingURL=modelPiece.js.map