import * as tslib_1 from "tslib";
import { IAttribute, M2Class, IFeature, IModel, IPackage, IReference, Model, Status, U, IClass, MClass, MetaModel, MetaMetaModel, EOperation, EParameter, MAttribute, MReference, M3Reference, M2Attribute, M3Attribute, M3Class, M2Reference, M3Package, MPackage, M2Package, Type, ELiteral, EEnum } from '../common/Joiner';
var Info = /** @class */ (function () {
    function Info() {
    }
    Info.forConsole = function (obj) { };
    Info.setraw = function (baseJson, k, v, toLower) {
        if (toLower === void 0) { toLower = true; }
        return Info.set(baseJson, k, v, '', toLower);
    };
    Info.setc = function (baseJson, k, v, toLower) {
        if (toLower === void 0) { toLower = true; }
        return Info.set(baseJson, k, v, '@', toLower);
    };
    Info.seti = function (baseJson, k, v, toLower) {
        if (toLower === void 0) { toLower = true; }
        return Info.set(baseJson, k, v, '#', toLower);
    };
    Info.set = function (baseJson, k, v, prefixc, toLower) {
        if (prefixc === void 0) { prefixc = '_'; }
        if (toLower === void 0) { toLower = true; }
        k = toLower ? k.toLowerCase() : k;
        var prefix = prefixc;
        // U.pw(baseJson[prefix + k], 'setinfo() name altready set: ', k, baseJson);
        while (baseJson[prefix + k]) {
            prefix += prefixc === '' ? '*' : prefixc;
        }
        baseJson[prefix + k] = v;
        // if (prefix === '') { baseJson[prefixc + k] = v; }
        return prefix + k;
    };
    Info.unsetraw = function (baseJson, k, toLower) {
        if (toLower === void 0) { toLower = true; }
        return Info.unset(baseJson, k, '', toLower);
    };
    Info.unsetc = function (baseJson, k, toLower) {
        if (toLower === void 0) { toLower = true; }
        return Info.unset(baseJson, k, '@', toLower);
    };
    Info.unseti = function (baseJson, k, toLower) {
        if (toLower === void 0) { toLower = true; }
        return Info.unset(baseJson, k, '#', toLower);
    };
    Info.unset = function (baseJson, k, prefixc, toLower) {
        if (prefixc === void 0) { prefixc = '_'; }
        if (toLower === void 0) { toLower = true; }
        k = prefixc + (toLower ? k.toLowerCase() : k);
        delete baseJson[k];
    };
    Info.renameraw = function (o, k1, k2, toLower) {
        if (toLower === void 0) { toLower = true; }
        return Info.rename(o, k1, k2, '', toLower);
    };
    Info.renamec = function (o, k1, k2, toLower) {
        if (toLower === void 0) { toLower = true; }
        return Info.rename(o, k1, k2, '@', toLower);
    };
    Info.renamei = function (o, k1, k2, toLower) {
        if (toLower === void 0) { toLower = true; }
        return Info.rename(o, k1, k2, '#', toLower);
    };
    Info.rename = function (baseJson, k1, k2, prefixc, toLower) {
        if (prefixc === void 0) { prefixc = '_'; }
        if (toLower === void 0) { toLower = true; }
        k1 = prefixc + (toLower ? k1.toLowerCase() : k2);
        k2 = prefixc + (toLower ? k1.toLowerCase() : k2);
        var old = baseJson[k1];
        delete baseJson[k1];
        baseJson[k2] = old;
    };
    Info.merge = function (info, targetinfo, prefixc) {
        if (prefixc === void 0) { prefixc = '->'; }
        var key;
        if (!targetinfo) {
            return;
        }
        for (key in targetinfo) {
            if (!targetinfo.hasOwnProperty(key)) {
                continue;
            }
            if (!prefixc) {
                switch (key[0]) {
                    default:
                        prefixc = '';
                        break;
                    case '#':
                    case '_':
                    case '@':
                        prefixc = key[0];
                        break;
                }
            }
            // console.log('Info.set(' + info + ', ' + key + ', ' + targetinfo[key] + ', ' + prefixc);
            Info.set(info, key, targetinfo[key], prefixc);
        }
    };
    return Info;
}());
export { Info };
var ModelPiece = /** @class */ (function () {
    function ModelPiece(parent, metaVersion) {
        this.id = null;
        this.parent = null;
        this.childrens = [];
        this.metaParent = null;
        this.instances = [];
        this.name = null;
        // styleOfInstances:Element = null;
        // customStyleToErase: Element = null;
        //  styleobj: ModelPieceStyleEntry = null;
        this.key = null;
        this.views = null;
        this.annotations = [];
        this.detachedViews = []; // required to delete modelpiece
        this.assignID();
        this.parent = parent;
        this.metaParent = metaVersion;
        this.instances = [];
        this.childrens = [];
        this.views = [];
        if (this.parent) {
            U.ArrayAdd(this.parent.childrens, this);
        }
        if (this.metaParent) {
            U.ArrayAdd(this.metaParent.instances, this);
        }
    }
    ModelPiece.GetStyle = function (model, tsClass, checkCustomizedFirst) {
        if (checkCustomizedFirst === void 0) { checkCustomizedFirst = true; }
        var rootSelector;
        if (model.isM()) {
            rootSelector = '.MDefaultStyles';
        }
        else if (model.isMM()) {
            rootSelector = '.MMDefaultStyles';
        }
        else {
            U.pe(true, 'm3 objects should not call getStyle()');
        }
        var $html;
        var $root = $((checkCustomizedFirst ? '.customized' : '.immutable') + rootSelector);
        if (tsClass.indexOf('m1') === 0 || tsClass.indexOf('m2') === 0) {
            tsClass = tsClass.substr(2);
        }
        switch (tsClass) {
            default:
                U.pe(true, 'unrecognized TS Class: ' + tsClass);
                return null;
            case 'EEnum':
                $html = $root.find('.template.EEnum');
                break;
            case 'ELiteral':
                $html = $root.find('.template.ELiteral');
                break;
            case 'Class':
                $html = $root.find('.template.Class');
                break;
            case 'Attribute':
                $html = $root.find('.template.Attribute');
                break;
            case 'Reference':
                $html = $root.find('.template.Reference');
                break;
            case 'EOperation':
                $html = $root.find('.template.Operation');
                break;
            case 'EParameter':
                $html = $root.find('.template.Parameter');
                break;
        }
        U.pw(checkCustomizedFirst && $html.length > 1, 'found more than one match for custom global style, should there be only 0 or 1.', $html, $root, this, tsClass);
        if (checkCustomizedFirst && $html.length === 0) {
            return ModelPiece.GetStyle(model, tsClass, false);
        }
        /*console.log('class?' + (this instanceof IClass), $root.find('.Template'), $root.find('.Class'),
          $root.find('.Template.Class'));
        console.log('condition:', !customizeds, ' && ', $html.length !== -1);*/
        U.pe(!checkCustomizedFirst && $html.length !== 1, 'expected exactly 1 match for the un-customized global style, found instead ' + $html.length + ':', $html, $root, this);
        var ret = U.cloneHtml($html[0], true);
        ret.classList.remove('template');
        ret.classList.remove('Customized');
        return ret;
    };
    ModelPiece.getByKey = function (path, realindexfollowed) {
        if (realindexfollowed === void 0) { realindexfollowed = null; }
        U.pe(!Array.isArray(path), 'ModelPiece.getByKey() should only be called with an array as key:', path);
        U.pe(path.length < 1, 'ModelPiece.getByKey() path array must have >= 1 elements:', path);
        var tmpRoot = { 'childrens': [Status.status.m, Status.status.mm, Status.status.mmm] };
        var ret = U.followIndexesPath(tmpRoot, path, 'childrens', realindexfollowed, true);
        U.pe(!(ret instanceof ModelPiece), 'ModelPiece.getByKey failed: ', ret, realindexfollowed);
        return ret;
    };
    ModelPiece.getByKeyStr = function (key, realindexfollowed) {
        if (realindexfollowed === void 0) { realindexfollowed = null; }
        return ModelPiece.getByKey(JSON.parse(key), realindexfollowed);
    };
    ModelPiece.get = function (e) {
        return ModelPiece.getLogic(e.target);
    };
    ModelPiece.getLogicalRootOfHtml = function (html0) {
        var html = html0;
        if (!html) {
            return null;
        }
        while (html && (!html.dataset || !html.dataset.modelPieceID)) {
            html = html.parentNode;
        }
        return html;
    };
    ModelPiece.getLogic = function (html) {
        html = this.getLogicalRootOfHtml(html);
        var ret = html ? ModelPiece.getByID(+html.dataset.modelPieceID) : null;
        // U.pe(!(ret instanceof T), 'got logic with unexpected class type:', this);
        return ret;
    };
    ModelPiece.getByID = function (id) { return ModelPiece.idToLogic[id]; };
    ModelPiece.prototype.assignID = function () {
        this.id = ModelPiece.idMax++;
        ModelPiece.idToLogic[this.id] = this;
        return this.id;
    };
    //todo: devo stare attento ogni volta che aggiungo-elimino un elemento a chiamare updateKey()
    // le views si salvano perchè usano la chiave all avvio e poi la rigenerano ad ogni salvataggio e non la usano ulteriormente se non per generare
    // la savestring.
    ModelPiece.prototype.getKey = function () { return this.key ? this.key : this.updateKey(); };
    ModelPiece.prototype.getKeyStr = function () { return JSON.stringify(this.getKey()); };
    ModelPiece.prototype.updateKey = function () {
        var m = this.getModelRoot();
        var mnum = m.isM3() ? 2 : (m.isM2() ? 1 : 0);
        var pathIndex = U.getIndexesPath(this, 'parent', 'childrens');
        return this.key = [mnum].concat(pathIndex);
    };
    ModelPiece.prototype.replaceVarsSetup = function () { return; };
    ModelPiece.prototype.linkToLogic = function (html) {
        if (this.id === null || this.id === undefined) {
            U.pw(true, 'undefined id:', this);
            return;
        }
        html.dataset.modelPieceID = '' + this.id;
    };
    ModelPiece.prototype.getm2 = function () {
        var root = this.getModelRoot();
        if (root instanceof Model) {
            return root.metaParent;
        }
        if (root instanceof MetaModel) {
            return root;
        }
        if (root instanceof MetaMetaModel) {
            return root.instances[0];
        }
        U.pe(true, 'failed to get root.');
    };
    ModelPiece.prototype.getModelRoot = function () {
        var p = this;
        var i = 0;
        while (p.parent && p !== p.parent && i++ < 6) {
            p = p.parent;
        }
        U.pe(!p || !(p instanceof IModel), 'failed to get model root:', this, 'm lastParent:', p);
        return p;
    };
    ModelPiece.prototype.isChildNameTaken = function (s) {
        var i;
        for (i = 0; i < this.childrens.length; i++) {
            if (s === this.childrens[i].name) {
                return true;
            }
        }
        return false;
    };
    ModelPiece.prototype.shouldBeDisplayedAsEdge = function (set) {
        if (set === void 0) { set = null; }
        if (set !== null) {
            U.pe(!(this instanceof IClass), 'shouldBeDisplayedAsEdge(' + set + ') should only be set on M2Class instances');
            this.shouldBeDisplayedAsEdgeVar = set;
            Type.updateTypeSelectors(null, false, false, true);
            return set;
        }
        if (this instanceof IModel) {
            return false;
        }
        if (this instanceof IPackage) {
            return false;
        }
        if (this instanceof EEnum) {
            return false;
        }
        if (this instanceof IClass) {
            return this.shouldBeDisplayedAsEdgeVar;
        }
        if (this instanceof IAttribute) {
            return false;
        }
        if (this instanceof IReference) {
            return true;
        }
        if (this instanceof EOperation) {
            return false;
        }
        if (this instanceof EParameter) {
            return false;
        }
        if (this instanceof ELiteral) {
            return false;
        }
        U.pe(true, 'unrecognized class:', this);
    };
    ModelPiece.prototype.refreshGUI = function (debug) {
        if (debug === void 0) { debug = false; }
        if (!Status.status.loadedLogic) {
            return;
        }
        var model = this.getModelRoot();
        var thingsToRefresh = [this];
        var i;
        if (Status.status.refreshModeAll) {
            U.ArrayAdd(thingsToRefresh, Status.status.mmm);
            U.ArrayAdd(thingsToRefresh, Status.status.mm);
            U.ArrayAdd(thingsToRefresh, Status.status.m);
        }
        if (Status.status.refreshModelAndInstances && model) {
            U.ArrayAdd(thingsToRefresh, model);
            for (i = 0; model.instances && i < model.instances.length; i++) {
                U.ArrayAdd(thingsToRefresh, model.instances[i]);
            }
            return;
        }
        if (Status.status.refreshModelAndParent && model && model.metaParent) {
            model = model.metaParent;
            U.ArrayAdd(thingsToRefresh, model);
            for (i = 0; model.instances && i < model.instances.length; i++) {
                U.ArrayAdd(thingsToRefresh, model.instances[i]);
            }
            return;
        }
        if (Status.status.refreshInstancesToo) {
            for (i = 0; this.instances && i < this.instances.length; i++) {
                U.ArrayAdd(thingsToRefresh, this.instances[i]);
            }
        }
        if (Status.status.refreshModel && model) {
            U.ArrayAdd(thingsToRefresh, model);
        }
        if (Status.status.refreshMetaParentToo && this.metaParent) {
            U.ArrayAdd(thingsToRefresh, this.metaParent);
        }
        if (Status.status.refreshParentToo && this.parent) {
            U.ArrayAdd(thingsToRefresh, this.parent);
        }
        for (i = 0; i < thingsToRefresh.length; i++) {
            var mp = thingsToRefresh[i];
            if (mp) {
                mp.refreshGUI_Alone(debug);
            }
        }
    };
    ModelPiece.prototype.refreshInstancesGUI = function () {
        var i = 0;
        U.pe(!this.instances, '', this);
        while (i < this.instances.length) {
            try {
                this.instances[i++].refreshGUI_Alone(false);
            }
            catch (e) { }
            finally { }
        }
    };
    ModelPiece.prototype.mark = function (markb, key, color, radiusX, radiusY, width, backColor, extraOffset) {
        if (color === void 0) { color = 'red'; }
        if (radiusX === void 0) { radiusX = 10; }
        if (radiusY === void 0) { radiusY = 10; }
        if (width === void 0) { width = 5; }
        if (backColor === void 0) { backColor = 'none'; }
        if (extraOffset === void 0) { extraOffset = null; }
        var vertex = this.getVertex();
        // const edge: IEdge[] = (this as any as IReference | IClass).getEdges();
        if (vertex && vertex.isDrawn()) {
            vertex.mark(markb, key, color, radiusX, radiusY, width, backColor, extraOffset);
        }
        var edges = null;
        if (this instanceof IClass && this.shouldBeDisplayedAsEdge()) {
            edges = this.getEdges();
        }
        if (this instanceof IReference) {
            edges = this.getEdges();
        }
        var i;
        for (i = 0; edges && i < edges.length; i++) {
            edges[i].mark(markb, key, color);
        }
    };
    ModelPiece.prototype.generateModelString = function () {
        var json = this.generateModel();
        // console.log('genmodelstring:', json, 'this:',  this);
        return JSON.stringify(json, null, 4);
    };
    ModelPiece.prototype.endingName = function (valueMaxLength) {
        if (valueMaxLength === void 0) { valueMaxLength = 10; }
        return '';
    };
    ModelPiece.prototype.printableName = function (valueMaxLength) {
        if (valueMaxLength === void 0) { valueMaxLength = 5; }
        if (this.name !== null) {
            return this.fullname();
        }
        var ending = this.endingName(valueMaxLength);
        return this.metaParent.fullname() + ':' + this.id + (ending && ending !== '' ? ':' + ending : '');
    };
    // abstract conformability(metaparent: ModelPiece, outObj?: any/*.refPermutation, .attrPermutation*/, debug?: boolean): number;
    ModelPiece.prototype.setName0 = function (value, refreshGUI, warnDuplicateFix, key, allowEmpty) {
        if (refreshGUI === void 0) { refreshGUI = false; }
        if (warnDuplicateFix === void 0) { warnDuplicateFix = true; }
        var valueOld = this['' + key];
        var valueInputError = value;
        value = value !== null && value !== undefined ? '' + value.trim() : null;
        if (!allowEmpty && (!value || value === '')) {
            U.pw(true, key + ' cannot be empty.');
            return valueOld;
        }
        if (value === valueOld) {
            return valueOld;
        }
        var regexp = new RegExp((allowEmpty ? '^$|' : '') + '^[a-zA-Z_$][a-zA-Z_$0-9]*$');
        //    console.log('set' + key + '.valid ? ' + regexp.test(value) + ' |' + value + '|');
        if (!regexp.test(value)) {
            value = value.replace(/([^a-zA-Z_$0-9])/g, '');
            var i = 0;
            while (value[i] && value[i] >= '0' && value[i] <= '9')
                i++;
            value = value.substr(i);
            var remainder = value;
            var firstChar = '' || '';
            while (remainder.length > 0 && firstChar === '') {
                firstChar = remainder[0].replace('[^a-zA-Z_$]', '');
                remainder = remainder.substring(1);
            }
            value = firstChar + remainder;
            U.pw(true, 'a valid ' + key + ' must be match this regular expression: ' + regexp.compile().toString()
                + '; trying autofix: |' + valueInputError + '| --> + |' + value + '|');
            return this['set' + U.firstToUpper(key)](value, true || refreshGUI);
        }
        if (value !== '') {
            var nameFixed = false;
            while (this.parent && this.parent['isChild' + U.firstToUpper(key) + 'Taken'](value)) {
                nameFixed = true;
                value = U.increaseEndingNumber(value, false, false);
            }
            U.pe(nameFixed && (valueInputError === value), 'increaseEningNumber failed:', value, this, this.parent ? this.parent.childrens : null);
            U.pw(nameFixed && warnDuplicateFix, 'that ' + key + ' is already used in this context, trying autofix: |'
                + valueInputError + '| --> + |' + value + '|');
        }
        this['' + key] = value;
        if (refreshGUI) {
            this.refreshGUI();
        }
        return this['' + key];
    };
    // meant to be called from user js.
    ModelPiece.prototype.getChildren = function (name, caseSensitive) {
        if (caseSensitive === void 0) { caseSensitive = false; }
        var i;
        U.pe(!name || name !== '' + name, 'ModelPiece.getChildren() name must be a non-empty string, found: |' + name + '|', name);
        if (!caseSensitive)
            name = name.toLowerCase();
        var m = this.getModelRoot();
        var ism1 = m.isM1();
        for (i = 0; i < this.childrens.length; i++) {
            var mp = this.childrens[i];
            var name2 = (ism1 ? mp.metaParent.name : mp.name);
            if (!caseSensitive)
                name2 = name2 && name2.toLowerCase();
            if (name === name2)
                return mp;
        }
        return null;
    };
    ModelPiece.prototype.setName = function (value, refreshGUI, warnDuplicateFix) {
        if (refreshGUI === void 0) { refreshGUI = false; }
        if (warnDuplicateFix === void 0) { warnDuplicateFix = true; }
        return this.setName0(value, refreshGUI, warnDuplicateFix, 'name', false);
    };
    ModelPiece.prototype.setNameOld = function (value, refreshGUI, warnDuplicateFix) {
        if (refreshGUI === void 0) { refreshGUI = false; }
        if (warnDuplicateFix === void 0) { warnDuplicateFix = true; }
        var valueOld = this.name;
        var valueInputError = value;
        value = value ? '' + value.trim() : null;
        if (!value || value === '') {
            U.pw(true, 'name cannot be empty.');
            return valueOld;
        }
        if (value === valueOld) {
            return valueOld;
        }
        var regexp = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
        // console.log('setName.valid ? ' + regexp.test(value) + ' |' + value + '|');
        if (!regexp.test(value)) {
            value = value.replace(/([^a-zA-Z_$0-9])/g, '');
            var i_1 = 0;
            while (value[i_1] && value[i_1] >= '0' && value[i_1] <= '9')
                i_1++;
            value = value.substr(i_1);
            var remainder = value;
            var firstChar = '' || '';
            while (remainder.length > 0 && firstChar === '') {
                firstChar = remainder[0].replace('[^a-zA-Z_$]', '');
                remainder = remainder.substring(1);
            }
            value = firstChar + remainder;
            U.pw(true, 'a valid name must be match this regular expression: ' + regexp.compile().toString()
                + '; trying autofix: |' + valueInputError + '| --> + |' + value + '|');
            return this.setName(value, true || refreshGUI);
        }
        var nameFixed = false && false;
        while (this.parent && this.parent.isChildNameTaken(value)) {
            nameFixed = true;
            value = U.increaseEndingNumber(value, false, false);
        }
        U.pe(nameFixed && (valueInputError === value), 'increaseEningNumber failed:', value, this, this.parent ? this.parent.childrens : null);
        U.pw(nameFixed && warnDuplicateFix, 'that name is already used in this context, trying autofix: |'
            + valueInputError + '| --> + |' + value + '|');
        this.name = value;
        var model = this.parent ? this.getModelRoot() : null;
        var i;
        // for (i = 0; model && i < model.instances.length; i++) { model.instances[i].sidebar.fullnameChanged(valueOld, this.name); }
        if (refreshGUI) {
            this.refreshGUI();
        }
        Type.updateTypeSelectors(null, false, false, true);
        return this.name;
    };
    ModelPiece.prototype.fieldChanged = function (e) {
        // todo: fix for m2 too. i need to enable custom input in custom viewpoints.
        // U.pe(true, U.getTSClassName(this) + '.fieldChanged() should never be called.');
    };
    ModelPiece.prototype.copy = function (other, nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        this.setName(other.name + nameAppend);
        var i;
        this.views = [];
        for (i = 0; i < other.views.length; i++) {
            var v = other.views[i];
            U.ArrayAdd(this.views, v.duplicate());
        }
        this.parent = newParent ? newParent : other.parent;
        if (this.parent) {
            U.ArrayAdd(this.parent.childrens, this);
        }
        this.childrens = [];
        for (i = 0; i < other.childrens.length; i++) {
            this.childrens.push(other.childrens[i].duplicate('', this));
        }
        this.metaParent = other.metaParent;
        if (this.metaParent) {
            U.ArrayAdd(this.metaParent.instances, this);
        }
        this.instances = [];
        this.refreshGUI();
    };
    ModelPiece.prototype.delete = function () {
        if (this.parent) {
            U.arrayRemoveAll(this.parent.childrens, this);
            this.parent = null;
        }
        if (this.metaParent) {
            U.arrayRemoveAll(this.metaParent.instances, this);
            this.metaParent = null;
        }
        var i;
        var arr = U.shallowArrayCopy(this.views);
        for (i = 0; arr && i < arr.length; i++) {
            arr[i].delete();
        }
        arr = U.shallowArrayCopy(this.detachedViews);
        for (i = 0; arr && i < arr.length; i++) {
            arr[i].delete();
        }
        arr = U.shallowArrayCopy(this.childrens);
        for (i = 0; arr && i < arr.length; i++) {
            arr[i].delete();
        }
        arr = U.shallowArrayCopy(this.instances);
        for (i = 0; arr && i < arr.length; i++) {
            arr[i].delete();
        }
    };
    ModelPiece.prototype.validate = function () {
        var names = {};
        var i;
        if (!U.isValidName(name)) {
            this.mark(true, 'Invalid name');
            return false;
        }
        for (i = 0; i < this.childrens.length; i++) {
            var child = this.childrens[i];
            var name_1 = child.name;
            if (names.hasOwnProperty(name_1)) {
                child.mark(true, 'Duplicate children name');
                return false;
            }
            child.validate();
            names[name_1] = child;
        }
        return true;
    };
    /*
      setStyle_SelfLevel_1(html: Element): void { this.customStyleToErase = html; }
      setStyle_InstancesLevel_2(html: Element): void { this.styleOfInstances = html; }
      setStyle_GlobalLevel_3(html: HTMLElement | SVGElement): void {
        const oldCustomStyle: HTMLElement | SVGElement = this.getGlobalLevelStyle(true);
        if (oldCustomStyle) { oldCustomStyle.parentNode.removeChild(oldCustomStyle); }
        const model: IModel = this.getModelRoot();
        let rootSelector: string;
        if (model.isM()) { rootSelector = '.MDefaultStyles';
        } else if (model.isMM()) { rootSelector = '.MMDefaultStyles';
        } else { U.pe(true, 'm3 objects should not call getStyle()'); }
        let selectorClass: string = '' + '_ERROR_';
        if (false && false) {
        } else if (this instanceof IClass) { selectorClass = ('Class');
        } else if (this instanceof IReference) { selectorClass = ('Reference');
        } else if (this instanceof IAttribute) { selectorClass = ('Attribute'); }
  
        let $root: JQuery<HTMLElement | SVGElement>;
        $root = $('.customized' + rootSelector);
        const container: HTMLElement | SVGElement = $root[0];
        html.classList.add('Template', selectorClass, (this instanceof IClass ? 'Vertex' : ''));
        container.appendChild(html); }*/
    ModelPiece.prototype.getGlobalLevelStyle = function (checkCustomizedFirst) {
        if (checkCustomizedFirst === void 0) { checkCustomizedFirst = true; }
        var tsClass = this.getClassName(); /*
        if (false && false ) {
        } else if (this instanceof IClass) { tsClass = 'Class';
        } else if (this instanceof IAttribute) { tsClass = 'Attribute';
        } else if (this instanceof IReference) { tsClass = 'Reference';
        } else if (this instanceof EOperation) { tsClass = 'EOperation';
        } else if (this instanceof EParameter) { tsClass = 'EParameter';
        } else { tsClass = 'ERROR: ' + U.getTSClassName(this); }*/
        return ModelPiece.GetStyle(this.getModelRoot(), tsClass, checkCustomizedFirst);
    };
    ModelPiece.prototype.getInheritableStyle = function () {
        var i;
        var ret = { html: null, htmlobj: null, view: null, ownermp: null, isownhtml: null, isinstanceshtml: null, isGlobalhtml: null };
        for (i = this.views.length; --i >= 0;) {
            var v = this.views[i];
            // if (!v.viewpoint.isApplied) continue;
            if (!v.htmli || !v.htmli.getHtml())
                continue;
            ret.html = v.htmli.getHtml();
            ret.htmlobj = v.htmli;
            ret.view = v;
            ret.ownermp = this;
            ret.isGlobalhtml = false;
            ret.isinstanceshtml = true;
            ret.isownhtml = false;
            return ret;
        }
        return null;
    };
    ModelPiece.prototype.getInheritedStyle = function () { return this.metaParent ? this.metaParent.getInheritableStyle() : null; };
    ModelPiece.prototype.getStyle = function () {
        var j;
        var i;
        var ret = { html: null, htmlobj: null, view: null, ownermp: null, isownhtml: null, isinstanceshtml: null, isGlobalhtml: null };
        for (j = this.views.length; --j >= 0;) {
            var v = this.views[j];
            if (!v.htmlo || !v.htmlo.getHtml())
                continue;
            ret.html = v.htmlo.getHtml();
            ret.htmlobj = v.htmlo;
            ret.view = v;
            ret.ownermp = this;
            ret.isGlobalhtml = false;
            ret.isinstanceshtml = false;
            ret.isownhtml = true;
            return ret;
        }
        var tmpret = this.getInheritedStyle();
        if (tmpret)
            return tmpret;
        ret.html = this.getGlobalLevelStyle();
        ret.htmlobj = null;
        ret.view = null;
        ret.ownermp = null;
        ret.isGlobalhtml = true;
        ret.isinstanceshtml = false;
        ret.isownhtml = false;
        return ret;
    };
    /*
    getStyleOld(): ViewHtmlSettings { return this.views.getHtml(this); }
    getStyleOldOld(): Element { return this.views.getHtml(this); }
    getStyleOldissimo(debug: boolean = true): Element {
      // prima precedenza: stile personale.
      let ret: Element;
      if (this.customStyleToErase) { ret = this.customStyleToErase; ret.id = '' + this.id; return ret; }
      // seconda precedenza: stile del meta-parent.
      const metap1 = this.metaParent;
      if (metap1 && metap1.styleOfInstances) { ret = metap1.styleOfInstances; ret.id = '' + this.id; return ret; }
      // terzo e quarto livello: search for customized third-override-css-like global styles; or immutable fourth global styles.
      ret = this.getGlobalLevelStyle(true);
      ret.id = '' + this.id;
      return ret; }
      getStyleObj(): ModelPieceStyleEntry {
        if (this.styleobj) { return this.styleobj; }
        return this.styleobj = ModelPieceStyleEntry.load(this.getStyle(), null); }*/
    ModelPiece.prototype.getInfo = function (toLower) {
        if (toLower === void 0) { toLower = false; }
        var i;
        var info = new Info();
        var instancesInfo = {};
        var childrenInfo = {};
        var model = this.getModelRoot();
        Info.set(info, 'tsClass', U.getTSClassName(this));
        Info.set(info, 'this', this);
        if (!(this instanceof IModel)) {
            Info.set(info, 'parent', this.parent);
        }
        if (!(this instanceof IFeature)) {
            Info.set(info, 'childrens', childrenInfo);
        }
        if (model.isMM()) {
            Info.set(info, 'instance', instancesInfo);
            Info.set(info, 'name', this.name);
        }
        else {
            Info.set(info, 'metaParent', this.metaParent);
        }
        for (i = 0; this.childrens && i < this.childrens.length; i++) {
            var child = this.childrens[i];
            var name_2 = model.isM1() && child.metaParent ? child.metaParent.name : child.name;
            U.pw(!name_2, 'getInfo() getName error: probably some metaparent is null.', this, child);
            if (!name_2)
                name_2 = '';
            Info.setc(info, name_2.toLowerCase(), child);
            Info.setraw(childrenInfo, name_2.toLowerCase(), child);
        }
        for (i = 0; this.instances && i < this.instances.length; i++) {
            Info.seti(instancesInfo, '' + i, this.instances[i]);
        }
        return info;
    };
    ModelPiece.prototype.getHtmlOnGraph = function () {
        if (this instanceof IPackage)
            return null;
        var html = this.getVertex().getHtml();
        if (this instanceof IClass)
            return html;
        html = $(html).find('*[data-modelPieceID="' + this.id + '"]')[0];
        return html ? html : null;
    };
    ModelPiece.prototype.getLastViewWith = function (fieldname) {
        var i = this.views.length;
        while (--i >= 0) {
            var v = this.views[i];
            var val = v['' + fieldname];
            // U.pe(fieldname in v, 'property |' + fieldname + '| does not exist in ViewRule. Field name has changed without changing the string
            // accordingly.');
            if (val !== undefined && val !== null)
                return v;
        }
        if (!this.metaParent)
            return null;
        i = this.metaParent.views.length;
        while (--i >= 0) {
            var v = this.metaParent.views[i];
            var val = v['' + fieldname];
            // U.pe(fieldname in v, 'property |' + fieldname + '| does not exist in ViewRule. Field name has changed without changing the string
            // accordingly.(2)');
            if (val !== undefined && val !== null)
                return v;
        }
        return null;
    };
    ModelPiece.prototype.getLastView = function () { return this.views[this.views.length - 1]; };
    /*
      addView(v: ViewRule): void {
        // if (!v.viewpoint.viewsDictionary[this.id]) {  v.viewpoint.viewsDictionary[this.id] = []; }
        v.viewpoint.viewsDictionary[this.id] = v;
        U.ArrayAdd(this.views, v); }
      resetViews(): void { this.views = []; }
    */
    ModelPiece.prototype.getClassName = function () {
        if (this instanceof M3Class) {
            return 'm3Class';
        }
        if (this instanceof M2Class) {
            return 'm2Class';
        }
        if (this instanceof MClass) {
            return 'm1Class';
        }
        if (this instanceof EEnum) {
            return 'EEnum';
        }
        if (this instanceof M3Attribute) {
            return 'm3Attribute';
        }
        if (this instanceof M2Attribute) {
            return 'm2Attribute';
        }
        if (this instanceof MAttribute) {
            return 'm1Attribute';
        }
        if (this instanceof M3Reference) {
            return 'm3Reference';
        }
        if (this instanceof M2Reference) {
            return 'm2Reference';
        }
        if (this instanceof MReference) {
            return 'm1Reference';
        }
        if (this instanceof M3Package) {
            return 'm3Package';
        }
        if (this instanceof M2Package) {
            return 'm2Package';
        }
        if (this instanceof MPackage) {
            return 'm1Package';
        }
        if (this instanceof MetaMetaModel) {
            return 'm3Model';
        }
        if (this instanceof MetaModel) {
            return 'm2Model';
        }
        if (this instanceof Model) {
            return 'm1Model';
        }
        if (this instanceof EOperation) {
            return 'EOperation';
        }
        if (this instanceof EParameter) {
            return 'EParameter';
        }
        if (this instanceof ELiteral) {
            return 'ELiteral';
        }
        U.pe(true, 'failed to find class:', this);
    };
    ModelPiece.prototype.getInstanceClassName = function () {
        var ret = this.getClassName();
        if (ret.indexOf('m1') !== -1)
            return null;
        return ret.replace('m2', 'm1').replace('m3', 'm2');
    };
    ModelPiece.prototype.pushUp = function () {
        if (!this.parent) {
            return;
        }
        var arr;
        var parent = this.parent;
        var i;
        if ((arr = parent.childrens) && (i = arr.indexOf(this)) !== -1) {
            U.arrayRemoveAll(arr, this);
            U.arrayInsertAt(arr, i - 1, this);
        }
        if ((arr = parent.enums) && (i = arr.indexOf(this)) !== -1) {
            U.arrayRemoveAll(arr, this);
            U.arrayInsertAt(arr, i - 1, this);
        }
        if ((arr = parent.classes) && (i = arr.indexOf(this)) !== -1) {
            U.arrayRemoveAll(arr, this);
            U.arrayInsertAt(arr, i - 1, this);
        }
        if ((arr = parent.attributes) && (i = arr.indexOf(this)) !== -1) {
            U.arrayRemoveAll(arr, this);
            U.arrayInsertAt(arr, i - 1, this);
        }
        if ((arr = parent.references) && (i = arr.indexOf(this)) !== -1) {
            U.arrayRemoveAll(arr, this);
            U.arrayInsertAt(arr, i - 1, this);
        }
        if ((arr = parent.operations) && (i = arr.indexOf(this)) !== -1) {
            U.arrayRemoveAll(arr, this);
            U.arrayInsertAt(arr, i - 1, this);
        }
        this.updateKey();
    };
    ModelPiece.prototype.pushDown = function () {
        if (!this.parent) {
            return;
        }
        var arr;
        var parent = this.parent;
        var i;
        if ((arr = parent.childrens) && (i = arr.indexOf(this)) !== -1) {
            U.arrayRemoveAll(arr, this);
            U.arrayInsertAt(arr, i - 1, this);
        }
        if ((arr = parent.enums) && (i = arr.indexOf(this)) !== -1) {
            U.arrayRemoveAll(arr, this);
            U.arrayInsertAt(arr, i + 1, this);
        }
        if ((arr = parent.classes) && (i = arr.indexOf(this)) !== -1) {
            U.arrayRemoveAll(arr, this);
            U.arrayInsertAt(arr, i + 1, this);
        }
        if ((arr = parent.attributes) && (i = arr.indexOf(this)) !== -1) {
            U.arrayRemoveAll(arr, this);
            U.arrayInsertAt(arr, i + 1, this);
        }
        if ((arr = parent.references) && (i = arr.indexOf(this)) !== -1) {
            U.arrayRemoveAll(arr, this);
            U.arrayInsertAt(arr, i + 1, this);
        }
        if ((arr = parent.operations) && (i = arr.indexOf(this)) !== -1) {
            U.arrayRemoveAll(arr, this);
            U.arrayInsertAt(arr, i + 1, this);
        }
        this.updateKey();
    };
    ModelPiece.idToLogic = {};
    ModelPiece.idMax = 0;
    return ModelPiece;
}());
export { ModelPiece };
var ModelNone = /** @class */ (function (_super) {
    tslib_1.__extends(ModelNone, _super);
    function ModelNone() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ModelNone;
}(ModelPiece));
export { ModelNone };
//# sourceMappingURL=modelPiece.js.map