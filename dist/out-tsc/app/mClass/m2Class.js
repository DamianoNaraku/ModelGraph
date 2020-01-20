import * as tslib_1 from "tslib";
import { Json, U, Status, Model, ECoreAttribute, ECoreClass, IClass, M2Reference, M2Attribute, EOperation, Type, ExtEdge, } from '../common/Joiner';
var M2Class = /** @class */ (function (_super) {
    tslib_1.__extends(M2Class, _super);
    /*
      static updateAllMMClassSelectors(root0: Element = null, updateModel: boolean = false, updateSidebar: boolean = true): void {
        let root: Element = root0;
        if (!Status.status.loadedGUI) { return; }
        if (!root) { root = Status.status.mm.graph.container; }
        // console.log('updateAllMMClassSelectors()', 'selects:', $selectors, root);
        const $selectors = $(root).find('select.ClassSelector');
        let i = -1;
        while (++i < $selectors.length) { M2Class.updateMMClassSelector($selectors[i] as HTMLSelectElement); }
        if (updateSidebar && Status.status.m && Status.status.m.sidebar) { Status.status.m.sidebar.loadDefaultHtmls(); }
        if (!updateModel) { return; }
        // if (Status.status.mm && Status.status.mm.sidebar) { Status.status.mm.sidebar.updateAll(); }
        if (Status.status.m) { Status.statm.refreshGUI(); }
      }
    /*
      static updateMMClassSelector(htmlSelect: HTMLSelectElement, selected: M2Class = null, debug = false,
                                   mustSelect: boolean = true): HTMLSelectElement {
        if (!htmlSelect || !Status.status.loadedGUI) { return; }
        const optGrp: HTMLOptGroupElement = document.createElement('optgroup');
        let toSelect: string;
        if (debug) { console.clear(); }
        if (mustSelect && !selected) {
          const mp: ModelPiece = ModelPiece.getLogic(htmlSelect);
          U.pif(debug, 'ownermp:', mp, 'select:', htmlSelect);
          // if (ownermp instanceof IAttribute || ownermp instanceof MAttribute) { selected = ownermp.parent as M2Class; }
          if (mp instanceof Typedd) { selected = (mp as Typedd).type; }
          U.pw(!selected, 'ClassSelectors must be held inside a m2-reference:', htmlSelect, 'ownermp:', mp) ;
          if (!selected) { return; }
        }
        toSelect = '' + (selected ? selected.id : '');
        U.pif(debug, 'selected:', selected);
        U.clear(htmlSelect);
        htmlSelect.appendChild(optGrp);
        optGrp.setAttribute('label', 'Class list');
        const mmClasses: M2Class[] = Status.status.mm.getAllClasses();
        let i: number;
        let found: boolean = !mustSelect;
        for (i = 0; i < mmClasses.length; i++) {
          const classe: M2Class = mmClasses[i];
          if (classe.shouldBeDisplayedAsEdge()) { continue; }
          const opt: HTMLOptionElement = document.createElement('option');
          opt.value = '' + classe.id;
          if (toSelect && opt.value === toSelect) { opt.setAttribute('selected', ''); opt.selected = found = true; }
          // console.log('mustselect?' + mustSelect + ': ' + toSelect + '&&' + opt.value + ' ? ' + found);
          opt.innerHTML = classe.name;
          optGrp.appendChild(opt); }
        U.pw(debug && !found, 'class not found.', mmClasses, 'searchedClass:', selected,
          'shouldBeEdge?', selected && selected.shouldBeDisplayedAsEdge());
        return htmlSelect; }
    */
    // isRoot(): boolean { U.pe(true, 'm2 class cannot be roots.'); return false; }
    // setRoot(value: boolean): void { U.pe(true, 'only usable in model version'); }
    function M2Class(pkg, json) {
        var _this = _super.call(this, pkg, Status.status.mmm.getAllClasses()[0]) || this;
        // features: M2Feature[]; // M2Feature[];
        _this.operations = [];
        _this.extends = [];
        _this.instances = [];
        if (!pkg && !json) {
            return _this;
        } // empty constructor for .duplicate();
        _this.parse(json, true);
        return _this;
    }
    M2Class.prototype.getModelRoot = function () { return _super.prototype.getModelRoot.call(this); };
    M2Class.prototype.getNamespaced = function () {
        var str = this.getModelRoot().namespace();
        if (this instanceof Model) {
            return str;
        }
        return str + ':' + this.name;
    };
    M2Class.prototype.parse = function (json, destructive) {
        //     console.log('M2Class.parse(); json:', json, '; metaVersion: ', this.metaParent, 'this:', this);
        /// own attributes.
        this.extendEdges = [];
        this.setName(Json.read(json, ECoreClass.namee, 'Class_1'), false);
        var key;
        for (key in json) {
            switch (key) {
                default:
                    U.pw(true, 'unexpected field in M2Class.parse() |' + key + '|', json);
                    break;
                case ECoreClass.instanceTypeName:
                case ECoreClass.eSuperTypes:
                case ECoreClass.xsitype:
                case ECoreClass.eOperations:
                case ECoreClass.eStructuralFeatures:
                case ECoreClass.abstract:
                case ECoreClass.interface:
                case ECoreClass.namee: break;
            }
        }
        this.instanceTypeName = Json.read(json, ECoreClass.instanceTypeName, '');
        this.isInterface = Json.read(json, ECoreClass.interface, 'false') === 'true';
        this.isAbstract = Json.read(json, ECoreClass.abstract, 'false') === 'true';
        var tmps = Json.read(json, ECoreClass.eSuperTypes, null);
        this.extendsStr = tmps ? tmps.split(' ') : [];
        /*this.name = Json.read<string>(this.json, ECoreClass.name);
        this.fullname = this.midname = this.parent.fullname + '.' + this.name;*/
        /// childrens
        var features = Json.getChildrens(json);
        var functions = Json.getChildrens(json, false, true);
        var i;
        var newFeature;
        var oldChildrens = this.childrens;
        // let metaParent: M3Feature;
        if (destructive) {
            this.childrens = [];
            this.attributes = [];
            this.references = [];
            this.operations = [];
        }
        for (i = 0; i < features.length; i++) {
            // console.log('reading class children[' + i + '/' + childs.length + '] of: ', childs, 'of', json);
            var child = features[i];
            var xsiType = Json.read(child, ECoreAttribute.xsitype);
            U.pe(!destructive, 'Non-destructive class parse: to do');
            switch (xsiType) {
                default:
                    U.pe(true, 'unexpected xsi:type: ', xsiType, ' in feature:', child);
                    break;
                case 'ecore:EAttribute':
                    // metaParent = oldChildrens[i] && oldChildrens[i].metaParent ? oldChildrens[i].metaParent : U.findMetaParentA(this, child);
                    newFeature = new M2Attribute(this, child);
                    U.ArrayAdd(this.attributes, newFeature);
                    break;
                case 'ecore:EReference':
                    var metaRef = null;
                    // metaParent = oldChildrens[i] && oldChildrens[i].metaParent ? oldChildrens[i].metaParent : U.findMetaParentA(this, child);
                    newFeature = new M2Reference(this, child);
                    U.ArrayAdd(this.references, newFeature);
                    break;
            }
            U.ArrayAdd(this.childrens, newFeature);
        }
        for (i = 0; i < functions.length; i++) {
            var newFunction = new EOperation(this, functions[i]);
            U.ArrayAdd(this.operations, newFunction);
            U.ArrayAdd(this.childrens, newFunction);
        }
    };
    M2Class.prototype.generateModel = function () {
        var featurearr = [];
        var operationsarr = [];
        var model = {};
        var supertypesstr = '';
        var key = U.getStartSeparatorKey();
        var i;
        for (i = 0; i < this.extends.length; i++) {
            supertypesstr += U.startSeparator(key, ' ') + this.extends[i].getEcoreTypeName();
        }
        for (i = 0; i < this.attributes.length; i++) {
            featurearr.push(this.attributes[i].generateModel());
        }
        for (i = 0; i < this.references.length; i++) {
            featurearr.push(this.references[i].generateModel());
        }
        for (i = 0; i < this.operations.length; i++) {
            operationsarr.push(this.operations[i].generateModel());
        }
        model[ECoreClass.xsitype] = 'ecore:EClass';
        model[ECoreClass.namee] = this.name;
        model[ECoreClass.interface] = U.toBoolString(this.isInterface);
        model[ECoreClass.abstract] = U.toBoolString(this.isAbstract);
        model[ECoreClass.instanceTypeName] = this.instanceTypeName;
        model[ECoreClass.eSuperTypes] = supertypesstr;
        model[ECoreClass.eStructuralFeatures] = featurearr;
        model[ECoreClass.eOperations] = operationsarr;
        return model;
    };
    M2Class.prototype.addOperation = function () {
        var op = new EOperation(this, null);
        U.ArrayAdd(this.childrens, op);
        U.ArrayAdd(this.operations, op);
        this.refreshGUI();
        return op;
    };
    M2Class.prototype.addReference = function () {
        var ref = new M2Reference(this, null);
        U.ArrayAdd(this.childrens, ref);
        U.ArrayAdd(this.references, ref);
        ref.type.changeType(null, null, this);
        ref.generateEdges();
        this.refreshGUI();
        // M2Class.updateAllMMClassSelectors(ref.getHtml());
        return ref;
    };
    M2Class.prototype.addAttribute = function () {
        console.log('addAttribute: pre', this);
        var attr = new M2Attribute(this, null);
        console.log('addAttribute: post', this, attr);
        this.refreshGUI();
        return attr;
    };
    M2Class.prototype.fieldChanged = function (e) {
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
    /*
      setName(name: string, refreshGUI: boolean = true): void {
        super.setName(name, refreshGUI);
        return;
        this.midname = this.parent.name + '.' + this.name;
        this.fullname = this.midname;
        let i;
        for (i = 0; i < this.childrens.length; i++) {
          this.childrens[i].setName(this.childrens[i].name, false && refreshGUI); // per aggiornare il fullname.
        }
        if (refreshGUI) { this.refreshGUI(); M2Class.updateAllMMClassSelectors(); }
    }*/
    M2Class.prototype.duplicate = function (nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        var c = new M2Class(null, null);
        c.copy(this);
        Type.updateTypeSelectors(null, false, false, true);
        c.refreshGUI();
        return c;
    };
    M2Class.prototype.getExtendedClassArray = function (levelDeep, out) {
        if (levelDeep === void 0) { levelDeep = Number.POSITIVE_INFINITY; }
        if (out === void 0) { out = []; }
        var i;
        for (i = 0; i < this.extends.length; i++) {
            var curr = this.extends[i];
            U.ArrayAdd(out, curr);
            if (levelDeep > 0) {
                curr.getExtendedClassArray(levelDeep--, out);
            }
        }
        return out;
    };
    // linkToMetaParent(meta: M3Class): void { return super.linkToMetaParent(meta); }
    M2Class.prototype.getReferencePointingHere = function () { return _super.prototype.getReferencePointingHere.call(this); };
    M2Class.prototype.getAttribute = function (name, caseSensitive) {
        if (caseSensitive === void 0) { caseSensitive = false; }
        return _super.prototype.getAttribute.call(this, name, caseSensitive);
    };
    M2Class.prototype.getReference = function (name, caseSensitive) {
        if (caseSensitive === void 0) { caseSensitive = false; }
        return _super.prototype.getReference.call(this, name, caseSensitive);
    };
    M2Class.prototype.isExtending = function (subclass) {
        if (!subclass)
            return false;
        var extendedTargetClasses = subclass.getExtendedClassArray();
        var i;
        for (i = 0; i < extendedTargetClasses.length; i++) {
            if (this === extendedTargetClasses[i]) {
                return true;
            }
        }
        return false;
    };
    M2Class.updateSuperClasses = function () {
        var dictionary = Status.status.mm.getEcoreStr_Class_Dictionary();
        var classes = Status.status.mm.getAllClasses();
        var j;
        var i;
        for (i = 0; i < classes.length; i++) {
            var classe = classes[i];
            for (j = 0; j < classe.extendsStr.length; j++) {
                var target = dictionary[classe.extendsStr[j]];
                U.pe(!target, 'e1, failed to find extended class:', classe.extendsStr[j], 'in classList:', classes, 'classe to extend:', classe, 'dictionary:', dictionary, 'classe.extendsStr[j]:', classe.extendsStr[j]);
                classe.extendClass(null, target);
            }
            classe.extendsStr = [];
        }
    };
    M2Class.prototype.extendClass = function (targetstr, target) {
        if (!target)
            target = this.getModelRoot().getClassFromEcoreStr(targetstr);
        U.pe(!target, 'e2, failed to find extended class:', targetstr, 'in classList:', Status.status.mm.getAllClasses(), 'this:', this);
        U.ArrayAdd(this.extends, target);
    };
    M2Class.prototype.unextendClass = function (targetstr, target) {
        if (!target)
            target = this.getModelRoot().getClassFromEcoreStr(targetstr);
        U.pe(!target, 'e3, failed to find extended class:', targetstr, 'in classList:', Status.status.mm.getAllClasses(), 'this:', this);
        U.arrayRemoveAll(this.extends, target);
    };
    M2Class.prototype.makeExtendEdge = function (target) {
        var ret = new ExtEdge(this, this.getVertex(), target.getVertex());
        this.extendEdges.push(ret);
        return ret;
    };
    return M2Class;
}(IClass));
export { M2Class };
//# sourceMappingURL=m2Class.js.map