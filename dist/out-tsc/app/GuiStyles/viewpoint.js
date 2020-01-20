import * as tslib_1 from "tslib";
import { ModelPiece, Status, U, 
// Options,
Point, GraphPoint, GraphSize, IClassifier, } from '../common/Joiner';
var StyleVisibility = /** @class */ (function () {
    function StyleVisibility() {
    }
    StyleVisibility._public = 'public';
    StyleVisibility._private = 'private';
    // approccio estendibile ai gruppi senza neanche creare nuove tabelle.
    StyleVisibility._publicExceptUserList = 'crea una relationship table key=tutto= (owner+stylename+utenteCheNONPuòVedere)';
    StyleVisibility._privateExceptUserList = 'crea una relationship table key=tutto= (owner+stylename+utenteChePuòVedere)'; // lo vede nessuno tranne...
    return StyleVisibility;
}());
export { StyleVisibility };
var ViewHtmlSettings = /** @class */ (function () {
    function ViewHtmlSettings() {
        this.featuredependency = []; // dot separated. "Class" as typeof (m1class | m2class) instead of the name
        this.html = null;
    }
    ViewHtmlSettings.prototype.toJSON = function (nameOrIndex) {
        this.updateHtmlMetaData();
        var copy0 = {};
        for (var key in this) {
            copy0[key] = this[key];
        }
        var copy = copy0;
        copy.htmlstr = this.html.outerHTML;
        delete copy.html;
        return copy;
    };
    ViewHtmlSettings.prototype.toString = function () { return JSON.stringify(this); };
    ViewHtmlSettings.prototype.updateHtml = function () {
        this.html = U.toHtml(this.htmlstr);
        // todo: inserisci tutti gli attributi metadata nell html.
    };
    ViewHtmlSettings.prototype.updateHtmlMetaData = function () {
        this.htmlstr = this.html.outerHTML;
        var $meta = $(this.html).find('meta');
        var setValue = function (jq) { return jq.length === 0 ? '' : jq[0].innerHTML; };
        var isTrue = function (jq) { return jq.length > 0 && jq[0].innerHTML === '1' || jq[0].innerHTML === 'true'; };
        $meta.find('owner').text(this.userOwner);
        $meta.find('name').text(this.name);
        $meta.find('isM1').text(this.AllowedOnM1);
        $meta.find('isM2').text(this.AllowedOnM2);
        $meta.find('isClass').text(this.allowedOnClass);
        $meta.find('isAttribute').text(this.allowedOnAttribute);
        $meta.find('isReference').text(this.allowedOnReference);
        $meta.find('isOperation').text(this.allowedOnOperation);
        $meta.find('isParameter').text(this.allowedOnParameter);
        $meta.find('preview').html(this.imgPreviewBase64);
        var featuredependencystr = '';
        var i;
        for (i = 0; i < this.featuredependency.length; i++) {
            var f = this.featuredependency[i];
            featuredependencystr += '<dependency><template>' + f.template + '</template><names>' + f.namesArray + '</names><types>' + f.typesArray + '</types></template>';
        }
        $meta.find('featuredependencyList').html(featuredependencystr);
    };
    ViewHtmlSettings.prototype.setHtml = function (html) { return this.setHtml0(html, null); };
    ViewHtmlSettings.prototype.setHtmlStr = function (html) { return this.setHtml0(null, html); };
    ViewHtmlSettings.prototype.setHtml0 = function (html, htmlstr) {
        // U.pe(!html && !htmlstr, 'both html and htmlstr are null.');
        // U.pe(true, this, html, htmlstr, !html, !htmlstr, !html && !htmlstr);
        if (!html) {
            html = U.toHtml(htmlstr);
        }
        if (!htmlstr) {
            htmlstr = html ? html.outerHTML : null;
        }
        U.pe(!html || !htmlstr, this, 'html is null:', html, 'htmlstr:', htmlstr, 'html?', !html, 'htmlstr?', !htmlstr, 'html && htmlstr?', !html && !htmlstr);
        U.pe(!!html.parentElement || !!html.parentNode, 'parentElement shuld be null here:', html, this);
        this.html = html;
        var $meta = $(html).find('meta');
        var getValue = function (jq) { return jq.length === 0 ? '' : jq[0].innerHTML; };
        var isTrue = function (jq) { return jq.length > 0 && (jq[0].innerHTML === '1' || jq[0].innerHTML === 'true'); };
        this.userOwner = getValue($meta.find('owner'));
        this.name = getValue($meta.find('name'));
        this.AllowedOnM1 = isTrue($meta.find('isM1'));
        this.AllowedOnM2 = isTrue($meta.find('isM2'));
        this.allowedOnClass = isTrue($meta.find('isClass'));
        this.allowedOnAttribute = isTrue($meta.find('isAttribute'));
        this.allowedOnReference = isTrue($meta.find('isReference'));
        this.allowedOnOperation = isTrue($meta.find('isOperation'));
        this.allowedOnParameter = isTrue($meta.find('isParameter'));
        var $tmp = $meta.find('preview');
        this.imgPreviewBase64 = $tmp.length > 0 ? $tmp[0].innerText : U.toBase64Image(U.toHtml('<div>Select a instance to initializeFromModel' +
            ' the preview.</div>'));
    };
    ViewHtmlSettings.prototype.getHtml = function () { return this.html; };
    ViewHtmlSettings.prototype.getHtmlstr = function () { return this.html.outerHTML; };
    ViewHtmlSettings.prototype.clone = function (json) {
        this.allowedOnClass = json.allowedOnClass;
        this.allowedOnAttribute = json.allowedOnAttribute;
        this.allowedOnReference = json.allowedOnReference;
        this.allowedOnOperation = json.allowedOnOperation;
        this.allowedOnParameter = json.allowedOnParameter;
        this.AllowedOnM1 = json.AllowedOnM1;
        this.AllowedOnM2 = json.AllowedOnM2;
        this.elementStylingCount = json.elementStylingCount;
        this.featuredependency = json.featuredependency;
        this.forkCounter = json.forkCounter;
        this.ForkedFromStr_name = json.ForkedFromStr_name;
        this.ForkedFromStr_user = json.ForkedFromStr_user;
        //this.htmlstr = json.htmlstr;
        if (json.htmlstr)
            this.html = U.toHtml(json.htmlstr);
        U.pe(!(this.html instanceof Element), 'invalid htmlstr:', json.htmlstr, json);
    };
    ViewHtmlSettings.prototype.setDependencyArray = function (featuredependency) {
        // todo: insert metadata into html, copy from ModelPieceStyleEntry
    };
    ViewHtmlSettings.prototype.saveToDB = function () {
    };
    return ViewHtmlSettings;
}());
export { ViewHtmlSettings };
var ViewRule = /** @class */ (function () {
    function ViewRule(owner, target) {
        if (target === void 0) { target = null; }
        this.target = null;
        this.targetStr = null;
        this.htmlo = null;
        this.htmli = null;
        /// for classes
        this.displayAsEdge = false;
        this.vertexSize = null;
        /// for classes or references
        this.edgeViews = [];
        ViewRule[this.id = ViewRule.maxID++] = this;
        if (owner)
            owner.views.push(this);
        this.viewpoint = owner;
        this.target = target;
        this.setTargetStr();
    }
    ViewRule.getbyID = function (id) { return ViewRule.allByID[id]; };
    ViewRule.getbyHtml = function (html0) {
        var html = html0;
        while (html && html.dataset && !html.dataset.styleid)
            html = html.parentNode;
        return ViewRule.getbyID(html && html.dataset ? +html.dataset.styleid : null);
    };
    // will be called by JSON.serialize() before starting, replacing the original parameter.
    ViewRule.prototype.toJSON = function (nameOrIndex) {
        var copy0 = {};
        this.setViewpointStr();
        this.setTargetStr();
        for (var key in this) {
            copy0[key] = this[key];
        }
        var copy = copy0;
        if (this.target instanceof IClassifier)
            this.vertexSize = this.target.getVertex().getSize();
        delete copy.id;
        delete copy.target;
        delete copy.viewpoint;
        return copy;
    };
    // redundant explicit call toJSON just to make the IDE realize i'm using it.
    ViewRule.prototype.toJsonString = function () { return JSON.stringify(this.toJSON(null)); };
    ViewRule.prototype.setViewpointStr = function () { this.viewpointstr = this.viewpoint ? this.viewpoint.name : null; };
    ViewRule.prototype.setTargetStr = function () {
        this.targetStr = this.target ? this.target.getKeyStr() : null;
        U.pe(!this.targetStr && !!this.target, 'failed to get targetstr from:', this.target);
    };
    ViewRule.prototype.updateViewpoint = function (vp) {
        if (vp === void 0) { vp = null; }
        this.viewpoint = vp || ViewPoint.get(this.viewpointstr);
        var arr = this.edgeViews ? this.edgeViews : [];
        var i;
        for (i = 0; i < arr.length; i++) {
            arr[i].updateViewpoint(vp);
        }
    };
    ViewRule.prototype.updateTarget = function () {
        var root = this.viewpoint.target;
        var path = JSON.parse(this.targetStr);
        var realindexfollowed = { indexFollowed: [], debugArr: [] };
        this.target = ModelPiece.getByKey(path, realindexfollowed);
        if (realindexfollowed.indexFollowed.length !== path.length) {
            U.pw(true, 'unable to find target of view:', this, ' search output:', realindexfollowed);
            this.target = null;
        }
    };
    ViewRule.prototype.clone = function (json) {
        if (json.setViewpointStr) {
            json.setViewpointStr();
        }
        for (var key in json) {
            switch (key) {
                default:
                    U.pe(true, 'unexpected key', key, json);
                    break;
                case 'id':
                case 'target': break;
                case 'targetStr':
                    this.targetStr = json[key];
                    break;
                case 'htmlo':
                    if (!json.htmlo) {
                        this.htmlo = null;
                        break;
                    }
                    if (!this.htmlo) {
                        this.htmlo = new ViewHtmlSettings();
                    }
                    this.htmlo.clone(json.htmlo);
                    break;
                case 'htmli':
                    if (!json.htmli) {
                        this.htmli = null;
                        break;
                    }
                    if (!this.htmli) {
                        this.htmli = new ViewHtmlSettings();
                    }
                    this.htmli.clone(json.htmli);
                    break;
                case 'displayAsEdge':
                    this.displayAsEdge = json.displayAsEdge;
                    break;
                case 'vertexSize':
                    this.vertexSize = json.vertexSize ? new GraphSize().clone(json.vertexSize) : null;
                    break;
                case 'edgeViews':
                    this.edgeViews = [];
                    var arr = json.edgeViews ? json.edgeViews : [];
                    var i = void 0;
                    for (i = 0; i < arr.length; i++) {
                        U.ArrayAdd(this.edgeViews, new EdgeViewRule(this.viewpoint).clone(arr[i]));
                    }
                    break;
                case 'viewpointstr':
                    this.viewpointstr = json.viewpointstr;
                    break;
            }
        }
        this.updateViewpoint();
        this.updateTarget();
    };
    ViewRule.prototype.duplicate = function () {
        var duplicate = new ViewRule(null);
        duplicate.clone(this);
        return duplicate;
    };
    ViewRule.prototype.isEmpty = function () { return this.equals(new ViewRule(this.viewpoint)); };
    ViewRule.prototype.equals = function (other) { return this.toString() === other.toString(); };
    // should only be called from ViewPoint
    ViewRule.prototype.apply = function (target) {
        if (target === void 0) { target = null; }
        this.target = target || this.target || ModelPiece.getByKeyStr(this.targetStr);
        console.log(this);
        this.viewpoint.viewsDictionary[this.target.id] = this;
        U.ArrayAdd(this.target.views, this);
    };
    // should only be called from ViewPoint
    ViewRule.prototype.detach = function () {
        // if (!this.target) return; target must never be deleted in Viewww.
        U.arrayRemoveAll(this.target.views, this);
        U.ArrayAdd(this.target.detachedViews, this);
        delete this.viewpoint.viewsDictionary[this.target.id];
        this.setTargetStr();
        // this.target = null; target must never be deleted in ViewRule
    };
    ViewRule.prototype.getViewPoint = function () { return this.viewpoint; };
    ViewRule.prototype.delete = function () {
        console.log('modelview.delete() todo.' +
            'non posso invece di implementarla lasciarla "orfana" senza target e la faccio ignorare dal loader.' +
            'altrimenti non potrei cancellare la view senza cancellare il modelpiece, o forse basta settare tutto a null e mollarla lì?');
    };
    ViewRule.allByID = {};
    ViewRule.maxID = 0;
    return ViewRule;
}());
export { ViewRule };
//todo: nuova idea:
//  creo un set di View[] dentro un ViewPoint.
//  ogni View ha un target: ModelPiece, e un private targetStr: string usato solo per la serializzazione e de-serializzazione.
//  la targetStr deve essere presa da ModelPiece.getKey()
var ViewPoint = /** @class */ (function (_super) {
    tslib_1.__extends(ViewPoint, _super);
    // abstract _isApplied(): boolean;
    function ViewPoint(target, name) {
        if (name === void 0) { name = null; }
        var _this = _super.call(this, null) || this;
        _this.isApplied = false;
        _this.scroll = new Point(0, 0);
        _this.zoom = new Point(1, 1);
        _this.grid = new Point(20, 20);
        _this.viewsDictionary = {};
        _this.views = [];
        _this.setname(name);
        _this.updateTarget(target);
        return _this;
    }
    ViewPoint.getAppliedViews_TOMOVE = function (m) {
        var i;
        var arr = [];
        for (var name_1 in ViewPoint.allnames) {
            var vp = ViewPoint.allnames[name_1];
            var v = vp.getMpStyle(m);
            if (v)
                arr.push(v);
        }
        return arr;
    };
    ViewPoint.get = function (value) {
        return ViewPoint.allnames[value];
    };
    ViewPoint.prototype.updateTarget = function (m) {
        if (m === void 0) { m = null; }
        this.apply(m, true);
    };
    ViewPoint.prototype.getMpStyle = function (m) { return this.viewsDictionary[m.id]; };
    ViewPoint.prototype.setname = function (s) {
        if (!s)
            s = 'ViewPoint 1';
        if (s === this.name)
            return;
        if (ViewPoint.allnames[this.name] === this) {
            delete ViewPoint.allnames[this.name];
        }
        while (s in ViewPoint.allnames) {
            s = U.increaseEndingNumber(s);
        }
        ViewPoint.allnames[this.name = s] = this;
    };
    ViewPoint.prototype.toJSON = function (nameOrIndex) {
        var copy0 = {};
        this.setTargetStr();
        for (var key in this) {
            copy0[key] = this[key];
        }
        var copy = copy0;
        delete copy.viewpoint;
        delete copy.viewpointstr;
        delete copy.viewsDictionary;
        delete copy.target;
        return copy;
    };
    // toString(): string { return JSON.stringify(this); }
    // should only be called from ViewPointShell
    ViewPoint.prototype.apply = function (m, onlyAttach, debug) {
        if (m === void 0) { m = null; }
        if (onlyAttach === void 0) { onlyAttach = false; }
        if (debug === void 0) { debug = false; }
        if (m !== this.target)
            this.detach();
        this.target = m = (m || this.target);
        U.pe(!this.target, 'called ViewPoint.apply() without a target.', this);
        U.pif(debug, 'add() PRE:', this.target.viewpoints.map(function (vp) { return vp.name; }), this.target.viewpoints);
        U.arrayRemoveAll(this.target.viewpoints, this);
        U.pif(debug, 'add() MID:', this.target.viewpoints.map(function (vp) { return vp.name; }), this.target.viewpoints, this.target.viewpoints.indexOf(this));
        U.pif(debug, this.target.viewpoints);
        // U.pw(true, 'stopped');
        // todo: il browser chrome è impazzito e mi fa il sort per nome ogni volta che faccio push.
        this.target.viewpoints.push(this); // NON usare U.ArrayAdd(), la rimozione è necessaria per garantire che venga sempre aggiunto in fondo.
        U.pif(debug, this.target.viewpoints);
        U.pif(debug, 'add() POST:', this.target.viewpoints.map(function (vp) { return vp.name; }), this.target.viewpoints);
        if (onlyAttach)
            return;
        var i;
        for (i = 0; i < this.views.length; i++) {
            var v = this.views[i];
            v.apply();
        }
        this.isApplied = true;
        // U.pe(true, 'stopped here still works');
    };
    // should only be called from ViewPointShell
    ViewPoint.prototype.detach = function () {
        if (!this.isApplied)
            return;
        // NB: don't remove from model.viewPoints, just de-apply it.
        for (var istr in this.viewsDictionary) {
            var i = +istr;
            var v = this.viewsDictionary[i];
            v.detach();
        }
        this.isApplied = false;
    };
    // should only be called from ViewPointShell
    ViewPoint.prototype.delete = function () {
        this.detach();
        U.arrayRemoveAll(this.target.viewpoints, this);
        this.target = null;
    };
    ViewPoint.prototype.clone = function (json) {
        if (json.target && json.setTargetStr)
            json.setTargetStr();
        var i;
        for (var key in json) {
            switch (key) {
                default:
                    U.pe(true, 'unexpected key:', key, json);
                    break;
                case 'id':
                case 'target':
                case 'viewpoint': break;
                case 'htmlo':
                    if (!json.htmlo) {
                        this.htmlo = null;
                        continue;
                    }
                    if (!this.htmlo)
                        this.htmlo = new ViewHtmlSettings();
                    this.htmlo.clone(json.htmlo);
                    break;
                case 'htmli':
                    if (!json.htmli) {
                        this.htmli = null;
                        continue;
                    }
                    if (!this.htmli)
                        this.htmli = new ViewHtmlSettings();
                    this.htmli.clone(json.htmli);
                    break;
                case 'isApplied':
                    this.isApplied = json.isApplied;
                    break;
                case 'name':
                    this.setname(json.name);
                    break;
                case 'targetStr':
                    if (!json.targetStr)
                        break;
                    this.targetStr = json.targetStr;
                    var m = ModelPiece.getByKeyStr(this.targetStr);
                    U.pe(!m, 'failed to find VP.target:', this, this.targetStr, Status.status);
                    this.updateTarget(m);
                    break;
                case 'edgeViews':
                    this.edgeViews = [];
                    if (!json.edgeViews)
                        continue;
                    for (i = 0; i < json.edgeViews.length; i++) {
                        var v = new EdgeViewRule(this);
                        v.clone(json.edgeViews[i]);
                        U.ArrayAdd(this.edgeViews, v);
                    }
                    break;
                case 'views':
                    this.views = [];
                    if (!json.views)
                        continue;
                    for (i = 0; i < json.views.length; i++) {
                        var v = new ViewRule(this);
                        v.clone(json.views[i]);
                        U.ArrayAdd(this.views, v);
                    }
                    break;
                case 'grid':
                    this.grid = new Point(json.grid.x, json.grid.y);
                    break;
                case 'gridShow':
                    this.gridShow = json.gridShow;
                    break;
                case 'scroll':
                    this.scroll = new GraphPoint(json.scroll.x, json.scroll.y);
                    break;
                case 'zoom':
                    this.zoom = new GraphPoint(json.zoom.x, json.zoom.y);
                    break;
                case 'vertexSize':
                    this.vertexSize = json.vertexSize ? new GraphSize(json.vertexSize.x, json.vertexSize.y) : null;
                    break;
                case 'displayAsEdge':
                    this.displayAsEdge = json.displayAsEdge;
                    break;
            }
        }
    };
    ViewPoint.prototype.duplicate = function () {
        var duplicate = new ViewPoint(null);
        duplicate.clone(this);
        return duplicate;
    };
    ViewPoint.prototype.isEmpty = function () {
        var SingleLinkedTempVp = new ViewPoint(null);
        SingleLinkedTempVp.target = this.target;
        // NB: il target deve essere settato così "raw" non tramite costruttore e funzioni perchè non deve inserirlo nei viewpoints[] del target.
        return this.equals(SingleLinkedTempVp, true);
    };
    ViewPoint.prototype.equals = function (other, ignoreName) {
        if (ignoreName === void 0) { ignoreName = true; }
        var tmp = this.name;
        if (ignoreName)
            this.name = other.name;
        var ret = this.toString() === other.toString();
        this.name = tmp;
        return ret;
    };
    ViewPoint.allnames = {};
    return ViewPoint;
}(ViewRule));
export { ViewPoint };
var EdgeViewRule = /** @class */ (function (_super) {
    tslib_1.__extends(EdgeViewRule, _super);
    function EdgeViewRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EdgeViewRule.prototype.clone = function (obj0) {
        return this;
    };
    return EdgeViewRule;
}(ViewRule));
export { EdgeViewRule };
var EdgePointView = /** @class */ (function (_super) {
    tslib_1.__extends(EdgePointView, _super);
    function EdgePointView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EdgePointView.prototype.clone = function (obj0) { };
    return EdgePointView;
}(ViewRule));
export { EdgePointView };
//# sourceMappingURL=viewpoint.js.map