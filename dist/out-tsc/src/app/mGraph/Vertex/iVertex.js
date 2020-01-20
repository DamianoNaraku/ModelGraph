import { U, IField, IPackage, IClass, ModelPiece, Status, Size, DetectZoom } from '../../common/joiner';
import { Point } from '../iGraph';
var GraphPoint = /** @class */ (function () {
    function GraphPoint(x, y) {
        if (isNaN(+x)) {
            x = 0;
        }
        if (isNaN(+y)) {
            y = 0;
        }
        this.x = x;
        this.y = y;
    }
    GraphPoint.prototype.clone = function () { return new GraphPoint(this.x, this.y); };
    GraphPoint.prototype.subtract = function (p2, newInstance) {
        U.pe(!p2, 'subtract argument must be a valid point: ', p2);
        var p1;
        if (!newInstance) {
            p1 = this;
        }
        else {
            p1 = this.clone();
        }
        p1.x -= p2.x;
        p1.y -= p2.y;
        return p1;
    };
    GraphPoint.prototype.add = function (p2, newInstance) {
        U.pe(!p2, 'add argument must be a valid point: ', p2);
        var p1;
        if (!newInstance) {
            p1 = this;
        }
        else {
            p1 = this.clone();
        }
        p1.x += p2.x;
        p1.y += p2.y;
        return p1;
    };
    GraphPoint.prototype.multiply = function (scalar, newInstance) {
        U.pe(isNaN(+scalar), 'scalar argument must be a valid number: ', scalar);
        var p1;
        if (!newInstance) {
            p1 = this;
        }
        else {
            p1 = this.clone();
        }
        p1.x *= scalar;
        p1.y *= scalar;
        return p1;
    };
    GraphPoint.prototype.divide = function (scalar, newInstance) {
        U.pe(isNaN(+scalar), 'scalar argument must be a valid number: ', scalar);
        var p1;
        if (!newInstance) {
            p1 = this;
        }
        else {
            p1 = this.clone();
        }
        p1.x /= scalar;
        p1.y /= scalar;
        return p1;
    };
    return GraphPoint;
}());
export { GraphPoint };
var GraphSize = /** @class */ (function () {
    function GraphSize(x, y, w, h) {
        if (isNaN(+x)) {
            x = 0;
        }
        if (isNaN(+y)) {
            y = 0;
        }
        if (isNaN(+w)) {
            w = 0;
        }
        if (isNaN(+h)) {
            h = 0;
        }
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
    }
    GraphSize.prototype.tl = function () { return new GraphPoint(this.x, this.y); };
    GraphSize.prototype.br = function () { return new GraphPoint(this.x + this.w, this.y + this.h); };
    return GraphSize;
}());
export { GraphSize };
var IVertex = /** @class */ (function () {
    function IVertex() {
        this.fields = [];
        this.edgesStart = [];
        this.edgesEnd = [];
        this.styleRaw = null;
        this.style = null;
        this.id = IVertex.ID++;
        IVertex.all[this.id] = this;
        this.contains = [];
        this.fields = [];
        this.edgesStart = [];
        this.edgesEnd = [];
    }
    IVertex.getByID = function (id) { return IVertex.all[id]; };
    IVertex.getvertex = function (e) {
        var node = e.currentTarget;
        while (!node.dataset.vertexID) {
            node = node.parentNode;
        }
        // console.log('getVertex by id:' + node.dataset.vertexID, 'all:', IVertex.all);
        return IVertex.getByID(+(node.dataset.vertexID));
    };
    IVertex.FieldNameChanged = function (e) {
        var html = e.currentTarget;
        var modelPiece = ModelPiece.getLogic(html);
        modelPiece.fieldChanged(e);
        $(html).trigger('click'); // updates the propertyBar
        // todo: quando fai un qualsiasi input change nella propertybar devi fare vertex.refreshGUI
    };
    IVertex.ChangePropertyBarContentClick = function (e) {
        var html = e.currentTarget;
        var modelPiece = ModelPiece.getLogic(html);
        var model = modelPiece.getModelRoot();
        model.graph.propertyBar.show(modelPiece);
        e.stopPropagation();
    };
    IVertex.ReferenceTypeChanged = function (e) {
        console.log('reftypechangerequest:');
    };
    IVertex.AttributeTypeChanged = function (e) {
    };
    IVertex.prototype.constructorClass = function (logical) {
        this.classe = logical;
        this.setGraph(logical.getModelRoot().graph);
        var i;
        var fields = [];
        for (i = 0; i < this.classe.attributes.length; i++) {
            fields.push(new IField(this.classe.attributes[i]));
        }
        this.setFields(fields);
    };
    IVertex.prototype.constructorPkg = function (logical) {
        this.package = logical;
        this.setGraph(logical.getModelRoot().graph);
        this.setFields(null);
    };
    IVertex.prototype.getEndPoint = function () {
        var htmlEP = $(this.style).find('.EndPoint');
        var htmlSize;
        var htmlPt;
        var pt;
        if (htmlEP.length !== 0) {
            htmlSize = U.sizeof(this.style);
        }
        else {
            htmlSize = U.sizeof(htmlEP[0]);
        }
        htmlPt = htmlSize.tl();
        htmlPt.x += htmlSize.w / 2;
        htmlPt.y += htmlSize.h / 2;
        pt = this.toGraphCoord(htmlPt);
        return pt;
    };
    IVertex.prototype.toGraphCoordS = function (s) {
        var tl = this.toGraphCoord(new Point(s.x, s.y));
        var br = this.toGraphCoord(new Point(s.x + s.w, s.y + s.h));
        return new GraphSize(tl.x, tl.y, br.x - tl.x, br.y - tl.x);
    };
    IVertex.prototype.toGraphCoord = function (p) {
        var graphSize = U.sizeof(this.owner.container);
        var ret = new GraphPoint(p.x, p.y);
        var debug = true;
        ret.x -= graphSize.x;
        ret.y -= graphSize.y;
        ret.x += this.owner.scroll.x;
        ret.y += this.owner.scroll.y;
        ret.x /= this.owner.zoom.x;
        ret.y /= this.owner.zoom.y;
        if (debug) {
            var ver = this.toHtmlCoord(ret);
            U.pe(ver.x !== p.x || ver.y !== p.y, 'error in toGraphCoord or toHtmlCoord: inputPt:', p, ', result: ', ret, 'verify:', ver);
        }
        return ret;
    };
    IVertex.prototype.toHtmlCoordS = function (s) {
        var tl = this.toHtmlCoord(new GraphPoint(s.x, s.y));
        var br = this.toHtmlCoord(new GraphPoint(s.x + s.w, s.y + s.h));
        return new Size(tl.x, tl.y, br.x - tl.x, br.y - tl.x);
    };
    IVertex.prototype.toHtmlCoord = function (p) {
        var graphSize = U.sizeof(this.owner.container);
        var ret = new Point(p.x, p.y);
        ret.x *= this.owner.zoom.x;
        ret.y *= this.owner.zoom.y;
        ret.x -= this.owner.scroll.x;
        ret.y -= this.owner.scroll.y;
        ret.x += graphSize.x;
        ret.y += graphSize.y;
        return ret;
    };
    IVertex.prototype.setSize = function (p) {
        U.pe(!p, 'setPosition: null');
        var oldPos = this.size ? new GraphPoint(this.size.x, this.size.y) : new GraphPoint(0, 0);
        var oldSize = new GraphPoint(this.size.w, this.size.h);
        this.size = p;
        this.style.setAttribute('x', '' + this.size.x);
        this.style.setAttribute('y', '' + this.size.y);
        this.style.setAttribute('width', '' + this.size.w);
        this.style.setAttribute('height', '' + this.size.h);
        // todo: cerca tutti gli as string, non è un vero cast ma solo un cambiotipo senza trasformazione, crea errori.
        var spostamento = this.size.tl().subtract(oldPos, true);
        var i;
        // for (i = 0; i < this.fields.length; i++) { this.fields[i].refreshGui(); }
        for (i = 0; i < this.edgesEnd.length; i++) {
            this.edgesEnd[i].refreshGui();
        }
        for (i = 0; i < this.edgesStart.length; i++) {
            this.edgesStart[i].refreshGui();
        }
    };
    IVertex.prototype.setSizeHtml = function (p) { return this.setSize(this.toGraphCoordS(p)); };
    IVertex.prototype.draw = function () {
        if (this.package) {
            this.drawP(this.package);
        }
        else {
            this.drawC(this.classe);
        }
        this.autosize();
    };
    IVertex.prototype.autosize = function () {
        var singleChildren = this.style.firstChild;
        var autosize = singleChildren.dataset.autosize;
        console.log('autosize() ? ', this.style, ' dataset.autosize:', autosize);
        if (autosize !== '1' && autosize !== 't' && autosize !== 'true') {
            return;
        }
        console.log('autosize() started');
        U.pe(this.style.children.length !== 1, 'To use autosize the ForeignObject element must have a single wrapper/container children.');
        U.pe(!(this.style.firstChild instanceof HTMLElement), 'the wrapper must be an html element (no svg)');
        if (singleChildren.style.height !== 'auto') {
            U.pw(true, 'To use autosize the ForeignObject single children must have "height: auto;", this has been automatically solved.');
            singleChildren.style.height = 'auto';
        }
        var zoomLevel = DetectZoom.device();
        //
        var actualSize = U.sizeof(singleChildren);
        actualSize.w = (actualSize.w / this.owner.zoom.x) / zoomLevel;
        actualSize.h = (actualSize.h / this.owner.zoom.x) / zoomLevel;
        this.setSize(new GraphSize(this.size.x, this.size.y, actualSize.w, actualSize.h));
    };
    IVertex.prototype.drawP = function (data) {
        if (!this.styleRaw) {
            this.styleRaw = IPackage.defaultStyle();
        }
        this.drawCommonVertex(data);
    };
    IVertex.prototype.drawC = function (data) {
        if (!this.styleRaw) {
            this.styleRaw = IClass.defaultStyle();
        }
        this.style = this.drawCommonVertex(data);
        /// append childrens:
        var $attContainer = $(this.style).find('.AttributeContainer');
        var $refContainer = $(this.style).find('.ReferenceContainer');
        if ($attContainer.length !== 1) {
            U.pe(true, // todo: falli diventare pw
            'Invalid user defined template: there must be exactly one element with class "AttributeContainer".' +
                ' The default template will be loaded instead.', $attContainer, ' StyleHtml:', this.style, 'raw:', this.styleRaw);
            this.styleRaw = null;
            return this.drawC(data);
        }
        if ($refContainer.length !== 1) {
            U.pe(true, 'Invalid user defined template: there must be exactly one element with class "ReferenceContainer".' +
                ' The default template will be loaded instead.', $refContainer, ' StyleHtml:', this.style);
            this.styleRaw = null;
            return this.drawC(data);
        }
        var attContainer = $attContainer[0];
        var refContainer = $refContainer[0];
        var i;
        for (i = 0; i < data.attributes.length; i++) {
            console.log('append attr:', data.attributes[i]);
            var attr = this.drawA(data.attributes[i]);
            attContainer.appendChild(attr);
        }
        for (i = 0; i < data.references.length; i++) {
            console.log('append ref:', data.references[i]);
            var ref = this.drawR(data.references[i]);
            refContainer.appendChild(ref);
        }
    };
    IVertex.prototype.drawCommonVertex = function (data) {
        var graphHtml = this.owner.container;
        if (graphHtml.contains(this.style)) {
            graphHtml.removeChild(this.style);
        }
        this.style = U.replaceVars(data, this.styleRaw);
        data.linkToLogic(this.style);
        graphHtml.appendChild(this.style);
        // console.log('this.style:', this.style);
        // console.log('this.size? (' + (!!this.size) + ': setSize() : ', U.getSvgSize(this.style));
        if (!this.size) {
            this.size = U.getSvgSize(this.style);
        }
        else {
            this.setSize(this.size);
        }
        // U.pe(Status.status.debug, 'stopped');
        this.addEventListeners(this.style);
        this.style.dataset.vertexID = '' + this.id;
        return this.style;
    };
    IVertex.prototype.drawA = function (data) {
        data.styleRaw = data.defaultStyle();
        data.style = U.replaceVars(data, data.styleRaw);
        data.linkToLogic(data.style);
        data.selectCorrectOptionInStyle();
        this.addEventListeners(data.style);
        return data.style;
    };
    IVertex.prototype.drawR = function (data) {
        data.styleRaw = data.defaultStyle_Field();
        data.style = U.replaceVars(data, data.styleRaw);
        data.linkToLogic(data.style);
        this.addEventListeners(data.style);
        return data.style;
    };
    IVertex.prototype.toEdge = function (start, end) {
        // todo
        return null;
    };
    IVertex.prototype.addEventListeners = function (html) {
        console.log('eventAppendStart', html);
        this.owner.addGraphEventListeners(); // todo: spostalo per efficienza.
        // todo: viene chiamato 1 volta per ogni elementNode con modelID, ma io eseguo tutto dalla radice.
        // quindi viene eseguito N +1 volte per ogni vertice dove N sono i suoi (attributes + references)
        // console.log(html.tagName, html.dataset.modelPieceID);
        // if (html.tagName.toLowerCase() === 'foreignobject' && html.dataset.modelPieceID )
        //   { html = html.firstChild as HTMLElement | SVGElement; }
        // while (!(html.classList.contains('Vertex'))) { console.log(html); html = html.parentNode as HTMLElement | SVGElement; }
        var $html = $(html);
        $html.off('mousedown.vertex').on('mousedown.vertex', function (evt) { IVertex.getvertex(evt).onMouseDown(evt); });
        $html.off('mouseup.vertex').on('mouseup.vertex', function (evt) { IVertex.getvertex(evt).onMouseUp(evt); });
        $html.off('mousemove.vertex').on('mousemove.vertex', function (evt) { IVertex.getvertex(evt).onMouseMove(evt); });
        $html.off('mouseenter.vertex').on('mouseenter.vertex', function (evt) { IVertex.getvertex(evt).onMouseEnter(evt); });
        $html.off('mouseleave.vertex').on('mouseleave.vertex', function (evt) { IVertex.getvertex(evt).onMouseLeave(evt); });
        var $addFieldButtonContainer = $html.find('.addFieldButtonContainer');
        $addFieldButtonContainer.find('button').off('click.addField').on('click.addField', function (evt) { IVertex.getvertex(evt).addFieldClick(evt); });
        $addFieldButtonContainer.find('select').off('change.addField').on('change.addField', function (evt) { IVertex.getvertex(evt).addFieldClick(evt); });
        $html.find('input').off('change.fieldchange').on('change.fieldchange', function (e) { return IVertex.FieldNameChanged(e); });
        $html.find('select').off('change.fieldchange').on('change.fieldchange', function (e) { return IVertex.FieldNameChanged(e); });
        // NB: deve essere solo un off, oppure metti selettore .NOT(class) nel selettore dei 'select' di sopra
        $html.find('.AddFieldSelect').off('change.fieldchange');
        $html // .find('[data-modelPieceID]')
            // todo: inserisci campo in IAttribute, IReference, typeSelector: stringa  = <optgrp>
            // da inserire dentro il template con select, così puoi editare lo stile e le classi del select
            .off('click.updatePropertyBar').on('click.updatePropertyBar', function (e) { IVertex.ChangePropertyBarContentClick(e); });
    };
    IVertex.prototype.onMouseDown = function (e) {
        IVertex.selected = this;
        IVertex.selectedStartPt = this.toGraphCoord(new Point(e.pageX, e.pageY));
        IVertex.selectedStartPt.subtract(this.size.tl(), false);
    };
    IVertex.prototype.onMouseUp = function (e) {
        IVertex.selected = null;
    };
    IVertex.prototype.onMouseMove = function (e) {
    };
    IVertex.prototype.onMouseEnter = function (e) { };
    IVertex.prototype.onMouseLeave = function (e) { };
    IVertex.prototype.addFieldClick = function (e) {
        console.log('addFieldClick(); START.');
        Status.status.debug = true;
        var select;
        var debugOldJson = U.cloneObj(this.classe.json);
        select = $(this.style).find('.addFieldButtonContainer').find('select')[0];
        U.pe(!this.classe, 'called add ' + select.value + ' on a package');
        switch (select.value) {
            default:
                U.pe(true, 'unexpected select value for addField:' + select.value);
                break;
            case 'Reference':
                this.classe.addReference();
                break;
            case 'Attribute':
                this.classe.addAttribute();
                break;
        }
        console.log('addFieldClick(); pre:', debugOldJson, ', post:', this.classe.json);
    };
    IVertex.prototype.setFields = function (f) {
        this.fields = f;
    };
    IVertex.prototype.setGraph = function (graph) {
        this.owner = graph;
    };
    IVertex.prototype.refreshGUI = function () { this.draw(); };
    IVertex.prototype.moveTo = function (graphPoint) {
        var size = U.getSvgSize(this.style);
        this.setSize(new GraphSize(graphPoint.x, graphPoint.y, size.w, size.h));
    };
    IVertex.all = {};
    IVertex.ID = 0;
    IVertex.selected = null;
    IVertex.selectedStartPt = null;
    return IVertex;
}());
export { IVertex };
//# sourceMappingURL=iVertex.js.map