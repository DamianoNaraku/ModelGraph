import { U, IVertex, Size, PropertyBarr } from '../common/joiner';
import { GraphPoint, GraphSize } from './Vertex/iVertex';
var IGraph = /** @class */ (function () {
    function IGraph(model, container) {
        this.id = null;
        this.container = null;
        this.model = null;
        this.vertex = null;
        this.edges = null;
        this.scroll = null;
        this.propertyBar = null;
        this.zoom = null;
        this.id = IGraph.ID++;
        IGraph.all[this.id + ''] = this;
        this.model = model;
        this.model.graph = this;
        this.zoom = new Point(1, 1);
        this.container = container;
        this.container.dataset.graphID = '' + this.id;
        this.vertex = [];
        this.edges = [];
        this.scroll = new GraphPoint(0, 0);
        var i;
        console.log(this.model);
        var arr = this.model.getAllClasses();
        var classEdges = [];
        for (i = 0; i < arr.length; i++) {
            if (arr[i].shouldBeDisplayedAsEdge()) {
                classEdges.push(arr[i]);
            }
            arr[i].generateVertex(null);
        }
        for (i = 0; i < classEdges.length; i++) {
            classEdges[i].generateEdge();
        }
        var arrReferences = this.model.getAllReferences();
        for (i = 0; i < arrReferences.length; i++) {
            arrReferences[i].generateEdge();
        }
        this.propertyBar = new PropertyBarr(this.model);
        this.addGraphEventListeners();
    }
    IGraph.getByID = function (id) { return IGraph.all[id]; };
    IGraph.getByHtml = function (html) {
        for (var id in IGraph.all) {
            if (!IGraph.all.hasOwnProperty(id)) {
                continue;
            }
            var graph = IGraph.all[id];
            if (U.isParentOf(graph.container, html)) {
                return graph;
            }
        }
        U.pe(true, 'failed to find parent graph of:', html);
        return null;
    };
    /*
      addv(v: IVertex, position: GraphPoint = null) {
        // if (!position ) { position = new Point(0, 0); }
        U.pe(!v, 'vertex is null;');
        this.vertex.push(v);
        const html: HTMLElement = v.createGUI();
        this.container.append(html);
        if (position) {
          html.setAttribute('x', '' + position.x);
          html.setAttribute('y', '' + position.y); }
        IVertex.addEventListeners(html); }
      adde(e: IEdge, position: GraphPoint = null) {
        this.edges.push(e);
        const html: HTMLElement = e.createGUI();
        e.refreshGui();
        this.container.append(html);
        if (position) {
          html.setAttribute('x', '' + position.x);
          html.setAttribute('y', '' + position.y); }
        IEdge.addEventListeners(html);
      }
    */
    IGraph.prototype.screenToGraphCoordinates = function (p) {
        var size = U.sizeof(this.container);
        var pos = new Point(size.x, size.y);
        return p.subtract(pos, true).add(new Point(this.scroll.x, this.scroll.y), true);
    };
    IGraph.prototype.addGraphEventListeners = function () {
        var $graph = $(this.container);
        $graph.off('mousedown.graph').on('mousedown.graph', function (evt) { IGraph.getByHtml(evt.currentTarget).onMouseDown(evt); });
        $graph.off('mouseup.graph').on('mouseup.graph', function (evt) { IGraph.getByHtml(evt.currentTarget).onMouseUp(evt); });
        $graph.off('mousemove.graph').on('mousemove.graph', function (evt) { IGraph.getByHtml(evt.currentTarget).onMouseMove(evt); });
        this.model.linkToLogic(this.container);
        $graph.off('click.propbar').on('click.propbar', function (e) { IVertex.ChangePropertyBarContentClick(e); });
    };
    IGraph.prototype.onMouseDown = function (evt) {
        return; // todo o
    };
    IGraph.prototype.onMouseUp = function (evt) {
        return; // todo
    };
    IGraph.prototype.onMouseMove = function (evt) {
        if (IVertex.selected) {
            var v = IVertex.selected;
            var currentMousePos = new Point(evt.pageX, evt.pageY);
            console.log('evt:', evt);
            var currentGraphCoord = this.toGraphCoord(currentMousePos);
            currentGraphCoord = currentGraphCoord.subtract(IVertex.selectedStartPt, false);
            v.moveTo(currentGraphCoord);
        }
        return; // todo
    };
    IGraph.prototype.toGraphCoordS = function (s) {
        var tl = this.toGraphCoord(new Point(s.x, s.y));
        var br = this.toGraphCoord(new Point(s.x + s.w, s.y + s.h));
        return new GraphSize(tl.x, tl.y, br.x - tl.x, br.y - tl.x);
    };
    IGraph.prototype.toGraphCoord = function (p) {
        var sizeOfGraph = U.sizeof(this.container);
        console.log('graphSize:', sizeOfGraph, 'evt uncorrect expected:', { x: 281, y: 175 }, 'correct topleft pos: 91,308');
        var ret = new GraphPoint(p.x, p.y);
        var debug = true;
        ret.x -= sizeOfGraph.x;
        ret.y -= sizeOfGraph.y;
        ret.x += this.scroll.x;
        ret.y += this.scroll.y;
        ret.x /= this.zoom.x;
        ret.y /= this.zoom.y;
        console.log('x: globalPos:', p.x, 'graphTL:', sizeOfGraph.x, 'scroll.x', this.scroll.x, 'zoom.x:', this.zoom.x);
        if (debug) {
            var ver = this.toHtmlCoord(ret);
            U.pe(ver.x !== p.x || ver.y !== p.y, 'error in toGraphCoord or toHtmlCoord: inputPt:', p, ', result: ', ret, 'verify:', ver);
        }
        console.log('globalCoord:', p, 'graphCoord:', ret);
        return ret;
    };
    IGraph.prototype.toHtmlCoordS = function (s) {
        var tl = this.toHtmlCoord(new GraphPoint(s.x, s.y));
        var br = this.toHtmlCoord(new GraphPoint(s.x + s.w, s.y + s.h));
        return new Size(tl.x, tl.y, br.x - tl.x, br.y - tl.x);
    };
    IGraph.prototype.toHtmlCoord = function (p) {
        var graphSize = U.sizeof(this.container);
        var ret = new Point(p.x, p.y);
        ret.x *= this.zoom.x;
        ret.y *= this.zoom.y;
        ret.x -= this.scroll.x;
        ret.y -= this.scroll.y;
        ret.x += graphSize.x;
        ret.y += graphSize.y;
        return ret;
    };
    IGraph.prototype.addC = function (cla, location) {
        var graphCoord;
        if (location) {
            graphCoord = this.toGraphCoord(location);
        }
        else {
            graphCoord = this.scroll;
        }
        if (cla.shouldBeDisplayedAsEdge()) {
            cla.generateEdge();
        }
        else {
            cla.generateVertex(graphCoord);
        }
    };
    IGraph.prototype.addP = function (pkg, location) {
        var graphCoord;
        if (location) {
            graphCoord = this.toGraphCoord(location);
        }
        else {
            graphCoord = this.scroll;
        }
        pkg.generateVertex(graphCoord);
    };
    IGraph.all = {};
    IGraph.ID = 0;
    return IGraph;
}());
export { IGraph };
var Point = /** @class */ (function () {
    function Point(x, y) {
        if (isNaN(+x)) {
            x = 0;
        }
        if (isNaN(+y)) {
            y = 0;
        }
        this.x = x;
        this.y = y;
    }
    Point.prototype.subtract = function (p2, newInstance) {
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
    Point.prototype.add = function (p2, newInstance) {
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
    Point.prototype.addAll = function (p, newInstance) {
        var i;
        var p0;
        if (!newInstance) {
            p0 = this;
        }
        else {
            p0 = this.clone();
        }
        for (i = 0; i < p.length; i++) {
            p0.add(p[i], true);
        }
        return p0;
    };
    Point.prototype.subtractAll = function (p, newInstance) {
        var i;
        var p0;
        if (!newInstance) {
            p0 = this;
        }
        else {
            p0 = this.clone();
        }
        for (i = 0; i < p.length; i++) {
            p0.subtract(p[i], true);
        }
        return p0;
    };
    Point.prototype.clone = function () { return new Point(this.x, this.y); };
    Point.prototype.multiply = function (scalar, newInstance) {
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
    Point.prototype.divide = function (scalar, newInstance) {
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
    return Point;
}());
export { Point };
//# sourceMappingURL=iGraph.js.map