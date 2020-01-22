import { U, IVertex, Status, Size, GraphPoint, GraphSize, PropertyBarr } from '../common/Joiner';
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
        this.grid = null;
        this.gridDisplay = false && false;
        // campi per robe di debug
        this.allMarkgp = [];
        U.pe(!container, 'graph container is null. model:', model);
        this.id = IGraph.ID++;
        IGraph.all[this.id + ''] = this;
        this.model = model;
        this.model.graph = this;
        this.container = container;
        this.container.dataset.graphID = '' + this.id;
        this.edgeContainer = U.newSvg('g');
        this.edgeContainer.classList.add('allEdgeContainer');
        this.vertexContainer = U.newSvg('g');
        this.vertexContainer.classList.add('allVertexContainer');
        this.container.appendChild(this.edgeContainer);
        this.container.appendChild(this.vertexContainer);
        this.svg = $(this.container).find('svg.graph')[0];
        this.vertex = [];
        this.edges = [];
        this.zoom = new Point(1, 1);
        this.scroll = new GraphPoint(0, 0);
        this.grid = new GraphPoint(20, 20);
        this.gridDisplay = true;
        var i;
        var arr = this.model.getAllClasses();
        var classEdges = [];
        for (i = 0; i < arr.length; i++) {
            if (arr[i].shouldBeDisplayedAsEdge()) {
                classEdges.push(arr[i]);
            }
            else {
                this.vertex.push(arr[i].generateVertex(null));
            }
        }
        // vertex disegnati, ora disegno gli edges.
        for (i = 0; i < classEdges.length; i++) {
            this.edges.concat(classEdges[i].generateEdge());
        }
        var arrReferences = this.model.getAllReferences();
        for (i = 0; i < arrReferences.length; i++) {
            this.edges.concat(arrReferences[i].generateEdge());
        }
        this.propertyBar = new PropertyBarr(this.model);
        this.addGraphEventListeners();
        this.ShowGrid();
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
    IGraph.prototype.fitToGrid = function (pt0, clone, debug, fitHorizontal, fitVertical) {
        if (clone === void 0) { clone = true; }
        if (debug === void 0) { debug = false; }
        if (fitHorizontal === void 0) { fitHorizontal = true; }
        if (fitVertical === void 0) { fitVertical = true; }
        var pt = clone ? pt0.clone() : pt0;
        U.pe(!this.grid, 'grid not initialized.');
        if (fitHorizontal && !isNaN(this.grid.x) && this.grid.x > 0) {
            pt.x = U.trunc(pt.x / this.grid.x) * this.grid.x;
        }
        if (fitVertical && !isNaN(this.grid.y) && this.grid.y > 0) {
            pt.y = U.trunc(pt.y / this.grid.y) * this.grid.y;
        }
        U.pif(debug, 'fitToGrid(', pt0, '); this.grid:', this.grid, ' = ', pt);
        return pt;
    };
    /*
      addv(v: IVertex, position: GraphPoint = null) {
        // if (!position ) { position = new Point(0, 0); }
        U.pe(!v, 'vertex is null;');
        this.vertex.push(v);
        const html: HTMLElement = v.createGUI();
        this.shell.append(html);
        if (position) {
          html.setAttribute('x', '' + position.x);
          html.setAttribute('y', '' + position.y); }
        IVertex.addEventListeners(html); }
      adde(e: IEdge, position: GraphPoint = null) {
        this.edges.push(e);
        const html: HTMLElement = e.createGUI();
        e.refreshGui();
        this.shell.append(html);
        if (position) {
          html.setAttribute('x', '' + position.x);
          html.setAttribute('y', '' + position.y); }
        IEdge.addEventListeners(html);
      }
    */
    IGraph.prototype.addGraphEventListeners = function () {
        var $graph = $(this.container);
        $graph.off('mousedown.graph').on('mousedown.graph', function (evt) { IGraph.getByHtml(evt.currentTarget).onMouseDown(evt); });
        $graph.off('mouseup.graph').on('mouseup.graph', function (evt) { IGraph.getByHtml(evt.currentTarget).onMouseUp(evt); });
        $graph.off('mousemove.graph').on('mousemove.graph', function (evt) { IGraph.getByHtml(evt.currentTarget).onMouseMove(evt); });
        this.model.linkToLogic(this.container);
        $graph.off('click.propbar').on('click.propbar', function (e) { IVertex.ChangePropertyBarContentClick(e); });
        // $graph.off('click.mark').on('click.mark', (e: ClickEvent) => { this.markClick(e, true); } );
    };
    IGraph.prototype.onMouseDown = function (evt) {
        return; // todo o
    };
    IGraph.prototype.onMouseUp = function (evt) { };
    IGraph.prototype.onMouseMove = function (evt) {
        if (IVertex.selected) {
            var v = IVertex.selected;
            var currentMousePos = new Point(evt.pageX, evt.pageY);
            // console.log('evt:', evt);
            var currentGraphCoord = this.toGraphCoord(currentMousePos);
            currentGraphCoord = currentGraphCoord.subtract(IVertex.selectedStartPt, false);
            v.moveTo(currentGraphCoord);
        }
        return; // todo
    };
    IGraph.prototype.toGraphCoordS = function (s) {
        var tl = this.toGraphCoord(new Point(s.x, s.y));
        var br = this.toGraphCoord(new Point(s.x + s.w, s.y + s.h));
        var ret = new GraphSize(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
        return ret;
    };
    IGraph.prototype.toGraphCoord = function (p) {
        var graphSize = U.sizeof(this.container);
        var ret = new GraphPoint(p.x, p.y);
        var debug = true;
        ret.x -= graphSize.x;
        ret.y -= graphSize.y;
        ret.x += this.scroll.x;
        ret.y += this.scroll.y;
        ret.x /= this.zoom.x;
        ret.y /= this.zoom.y;
        // console.log('toGraph()  - graphSize:', graphSize, ' + scroll: ', this.scroll, ' / zoom', this.zoom);
        if (debug) {
            var ver = this.toHtmlCoord(ret);
            U.pe(ver.x !== p.x || ver.y !== p.y, 'error in toGraphCoord or toHtmlCoord: inputPt:', p, ', result: ', ret, 'verify:', ver);
        }
        return ret;
    };
    IGraph.prototype.toHtmlCoordS = function (s) {
        if (s === null) {
            return null;
        }
        var tl = this.toHtmlCoord(new GraphPoint(s.x, s.y));
        var br = this.toHtmlCoord(new GraphPoint(s.x + s.w, s.y + s.h));
        return new Size(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    };
    IGraph.prototype.toHtmlCoord = function (p) {
        var graphSize = U.sizeof(this.container);
        var ret = new Point(p.x, p.y);
        // console.log('toHtml()', ' * zoom', this.zoom, ' - scroll: ', this.scroll, ' + graphSize:', graphSize);
        ret.x *= this.zoom.x;
        ret.y *= this.zoom.y;
        ret.x -= this.scroll.x;
        ret.y -= this.scroll.y;
        ret.x += graphSize.x;
        ret.y += graphSize.y;
        return ret;
    };
    IGraph.prototype.getAllVertexIsBroke = function () { return this.vertex; };
    IGraph.prototype.markClick = function (e, clean) {
        if (clean === void 0) { clean = true; }
        return this.mark(new Point(e.pageX, e.pageY), clean);
    };
    IGraph.prototype.markg = function (gp, clean, colorTop) {
        if (clean === void 0) { clean = false; }
        if (colorTop === void 0) { colorTop = 'red'; }
        return this.mark(this.toHtmlCoord(gp), clean, colorTop);
    };
    IGraph.prototype.markgS = function (gs, clean, colorTop, colorBot) {
        if (clean === void 0) { clean = false; }
        if (colorTop === void 0) { colorTop = 'red'; }
        if (colorBot === void 0) { colorBot = null; }
        /*if (!colorBot) { colorBot = colorTop; }
        this.markg(gs.tl(), clean, colorTop);
        this.markg(gs.tr(), false, colorTop);
        this.markg(gs.bl(), false, colorBot);
        this.markg(gs.br(), false, colorBot);*/
        // const htmls: Size = this.owner.toHtmlCoordS(size0);
        return this.markS(this.toHtmlCoordS(gs), clean, colorTop, colorBot);
    };
    IGraph.prototype.markS = function (s, clean, colorTop, colorBot) {
        if (clean === void 0) { clean = false; }
        if (colorTop === void 0) { colorTop = 'red'; }
        if (colorBot === void 0) { colorBot = null; }
        if (!colorBot) {
            colorBot = colorTop;
        }
        U.pe(!s, 'size cannot be null.');
        this.mark(s.tl(), clean, colorTop);
        // color = 'white';
        this.mark(s.tr(), false, colorTop);
        // color = 'purple';
        this.mark(s.bl(), false, colorBot);
        // color = 'orange';
        this.mark(s.br(), false, colorBot);
    };
    IGraph.prototype.mark = function (p, clean, color) {
        if (clean === void 0) { clean = false; }
        if (color === void 0) { color = 'red'; }
        var gp = this.toGraphCoord(p);
        if (clean) {
            var i = void 0;
            for (i = 0; i < this.allMarkgp.length; i++) {
                var node = this.allMarkgp[i];
                if (this.container.contains(node)) {
                    this.container.removeChild(node);
                }
            }
            for (i = 0; i < IGraph.allMarkp.length; i++) {
                var node = IGraph.allMarkp[i];
                if (document.body.contains(node)) {
                    document.body.removeChild(node);
                }
            }
        }
        // console.log('mark:', p, gp);
        this.markp = U.toHtml('<div style="width:10px; height:10px; top:' + (p.y - 5) + 'px; left:' + (p.x - 5) + 'px;' +
            ' position: absolute; border: 1px solid ' + color + '; z-index:1;">');
        this.markgp = U.newSvg('circle');
        this.markgp.setAttribute('cx', '' + gp.x);
        this.markgp.setAttribute('cy', '' + gp.y);
        this.markgp.setAttribute('r', '' + 1);
        this.markgp.setAttribute('stroke', color);
        this.allMarkgp.push(this.markgp);
        IGraph.allMarkp.push(this.markp);
        document.body.appendChild(this.markp);
        this.container.appendChild(this.markgp);
    };
    IGraph.prototype.setZoom = function (zoom) {
        if (zoom === void 0) { zoom = null; }
        if (zoom) {
            this.zoom = zoom;
        }
        var size = U.getViewBox(this.svg);
        U.pw(true, 'Graph.setZoom: todo.');
        U.setViewBox(this.svg, size);
    };
    IGraph.prototype.ShowGrid = function (checked) {
        if (checked === void 0) { checked = null; }
        var graph = (this.model === Status.status.mm ? Status.status.mm.graph : Status.status.m.graph);
        if (checked === null) {
            checked = graph.gridDisplay;
        }
        if (this.model === Status.status.mm) {
            graph.gridDisplay = checked;
        }
        else {
            graph.gridDisplay = checked;
        }
        var $grid = $(this.container).find('.gridContainer');
        var x = isNaN(this.grid.x) || this.grid.x <= 0 ? 10000 : this.grid.x;
        var y = isNaN(this.grid.y) || this.grid.y <= 0 ? 10000 : this.grid.y;
        $grid[0].innerHTML = '\n' +
            '   <defs>\n' +
            '      <pattern id="smallGrid_' + this.id + '" width="' + x + '" height="' + y + '" patternUnits="userSpaceOnUse">\n' +
            '        <path d="M ' + x + ' 0 L 0 0 0 ' + y + '" fill="none" stroke="gray" stroke-width="0.5"/>\n' +
            '      </pattern>\n' +
            '      <pattern id="grid_' + this.id + '" width="' + (x * 10) + '" height="' + (y * 10) + '" patternUnits="userSpaceOnUse">\n' +
            '        <rect width="' + (x * 10) + '" height="' + (y * 10) + '" fill="url(#smallGrid_' + this.id + ')"/>\n' +
            '        <path d="M ' + (x * 10) + ' 0 L 0 0 0 ' + (y * 10) + '" fill="none" stroke="gray" stroke-width="1"/>\n' +
            '      </pattern>\n' +
            '    </defs>\n' +
            '    <rect class="grid" width="100%" height="100%" fill="url(#grid_' + this.id + ')" />';
        $grid[0].setAttributeNS(null, 'justForRefreshingIt', 'true');
        // $grid.x
        if (checked) {
            $grid.show();
        }
        else {
            $grid.hide();
        }
    };
    IGraph.prototype.addVertex = function (v) {
        v.owner = this;
        U.ArrayAdd(this.vertex, v);
        // todo: aggiungi edges tra i vertici. in matrix edgeMatrix[vertex][vertex] = edge
    };
    // todo: this.vertex non è mai aggiornato reealmente.
    IGraph.all = {};
    IGraph.ID = 0;
    IGraph.allMarkp = []; // campo per robe di debug
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