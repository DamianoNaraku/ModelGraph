import { U, IVertex, EdgePoint, ModelPiece, Status, IReference, CursorFollowerEP, EdgePointFittizio, Point, GraphPoint, IClass, ExtEdge } from '../../../common/Joiner';
export var EdgeModes;
(function (EdgeModes) {
    EdgeModes["straight"] = "straight";
    EdgeModes["angular2"] = "angular con 2 segmenti.";
    EdgeModes["angular3"] = "angular con 3 segmenti (un break centrale)";
    EdgeModes["angular23Auto"] = "angular 2 o angular 3 automatico";
})(EdgeModes || (EdgeModes = {}));
var IEdge = /** @class */ (function () {
    function IEdge(logic, index, startv, end) {
        if (startv === void 0) { startv = null; }
        if (end === void 0) { end = null; }
        // private static tempMidPoint_Clicked: GraphPoint = null;
        // private static tempMidPoint_ModelPiece: ModelPiece = null;
        this.owner = null;
        this.start = null;
        this.end = null;
        this.midNodes = null;
        this.shell = null;
        this.html = null;
        this.shadow = null;
        this.logic = null;
        this.isSelected = null;
        this.isHighlighted = null;
        this.mode = null;
        this.edgeHead = null;
        this.edgeTail = null;
        this.tmpEnd = null;
        this.tmpEndVertex = null;
        this.useMidNodes = true || true;
        this.useRealEndVertex = true || true;
        this.id = null;
        if (!startv) {
            if (logic instanceof IClass) {
                startv = logic.getVertex();
            }
            if (logic instanceof IReference) {
                startv = logic.getVertex();
            }
        }
        U.pe(!startv, 'startVertex missing');
        U.pe(!logic || !startv, 'new Edge() invalid parameters. logic:', logic, 'start:', startv, 'end:', end);
        IEdge.all.push(this);
        this.id = IEdge.edgeCount++;
        IEdge.idToEdge[this.id] = this;
        this.logic = logic;
        if (!(this instanceof ExtEdge)) {
            U.pe(index === null || index === undefined, 'index must be set.');
            this.logic.edges[index] = this;
        }
        this.shell = document.createElementNS('http://www.w3.org/2000/svg', 'g'); // U.newSvg<SVGGElement>('g');
        this.html = document.createElementNS('http://www.w3.org/2000/svg', 'path'); // U.newSvg<SVGPathElement>('Path');
        this.shadow = U.newSvg('path');
        this.shadow.dataset.edgeid = this.shell.dataset.edgeid = this.html.dataset.edgeid = '' + this.id;
        this.start = startv;
        this.start.edgesStart.push(this);
        this.setTarget(end);
        this.startNode = new EdgePoint(this, new GraphPoint(0, 0), this.start);
        this.midNodes = [];
        this.endNode = new EdgePoint(this, new GraphPoint(0, 0), this.end);
        this.owner = this.start.owner;
        this.isSelected = false;
        this.isHighlighted = false;
        // this.logic.edgeStyleCommon.style = EdgeModes.angular23Auto;
        this.mode = this.logic.edgeStyleCommon.style;
        // this.mode = EdgeModes.angular23Auto;
        this.edgeHead = null;
        this.edgeTail = null;
        this.owner.edgeContainer.append(this.shell);
        this.shell.classList.add('EdgeShell');
        this.html.classList.add('Edge');
        this.shadow.classList.add('Edge', 'Shadow');
        this.shell.dataset.modelPieceID = '' + this.logic.id;
        this.html.dataset.modelPieceID = '' + this.logic.id;
        this.shadow.dataset.modelPieceID = '' + this.logic.id;
        this.html.setAttribute('fill', 'none');
        this.shadow.setAttribute('fill', 'none');
        this.shadow.setAttribute('stroke', 'none');
        this.shadow.setAttribute('visibility', 'hidden');
        this.shadow.setAttribute('pointer-events', 'stroke');
        this.refreshGui();
    }
    IEdge.staticInit = function () {
        IEdge.all = [];
        IEdge.selecteds = [];
        // todo: prevent propagation on click on edges.
        U.eventiDaAggiungereAlBody('trigger onBlur of all IEdge.selecteds.');
        $(document.body).off('click.blurEdgeSelection').on('click.blurEdgeSelection', function (ee) {
            var debug = false;
            U.pif(debug, 'body.click(): clear All Edge Selections');
            var i = -1;
            while (++i < IEdge.selecteds.length) {
                IEdge.selecteds[i].onBlur();
            }
            U.pif(debug, 'graph clicked:', ee);
            var modelPieceClicked = ModelPiece.get(ee);
            var edgeClicked = IEdge.get(ee);
            U.pif(debug, 'modelPieceClicked ? ', modelPieceClicked);
            if (!modelPieceClicked) {
                return;
            }
            var htmlClicked = ee.target;
            var parent = htmlClicked;
            while (parent && parent.classList && !parent.classList.contains('EdgeShell')) {
                parent = parent.parentNode;
            }
            // const edgeClicked: IEdge = (parent && parent.classList) ? edge : null;
            U.pif(debug, 'edgeClicked ? ', edgeClicked);
            if (!edgeClicked) {
                return;
            }
            edgeClicked.onClick(ee);
        });
        return [];
    };
    IEdge.get = function (e) {
        // return ModelPiece.getLogic(e.classType).edge;
        return IEdge.getByHtml(e.target);
    };
    IEdge.getByHtml = function (html0, debug) {
        if (debug === void 0) { debug = false; }
        if (!html0) {
            return null;
        }
        var html = html0;
        while (html && (!html.dataset || !html.dataset.edgeid)) {
            html = html.parentNode;
        }
        var ret = html ? IEdge.getByID(+html.dataset.edgeid) : null;
        U.pe(debug && !ret, 'failed to find edge. html0:', html0, 'html:', html, 'map:', IEdge.idToEdge);
        return ret;
    };
    IEdge.getByID = function (id) { return IEdge.idToEdge[id]; };
    IEdge.generateAggregationHead = function (fill, stroke, strokeWidth) {
        if (fill === void 0) { fill = 'black'; }
        if (stroke === void 0) { stroke = 'white'; }
        if (strokeWidth === void 0) { strokeWidth = 20; }
        // https://jsfiddle.net/Naraku/3hngkrc1/
        var svg = U.newSvg('svg');
        var path = U.newSvg('path');
        svg.setAttributeNS(null, 'width', '20');
        svg.setAttributeNS(null, 'height', '20');
        svg.setAttributeNS(null, 'viewBox', (-strokeWidth) + ' ' + (-strokeWidth) + ' ' + (200 + strokeWidth * 2) + ' ' + (200 + strokeWidth * 2));
        path.setAttributeNS(null, 'fill', fill);
        path.setAttributeNS(null, 'stroke', stroke);
        path.setAttributeNS(null, 'stroke-width', '' + strokeWidth);
        path.setAttributeNS(null, 'd', 'M100 0 L200 100 L100 200 L0 100 Z');
        svg.appendChild(path);
        return svg;
    };
    IEdge.generateAggregationTail = function (fill, stroke, strokeWidth) {
        if (fill === void 0) { fill = 'black'; }
        if (stroke === void 0) { stroke = 'white'; }
        if (strokeWidth === void 0) { strokeWidth = 20; }
        return null;
    };
    IEdge.generateContainmentHead = function () { return IEdge.generateAggregationHead('white', 'white'); };
    IEdge.generateContainmentTail = function () { return IEdge.generateAggregationTail('white', 'white'); };
    IEdge.generateGeneralizationHead = function (fill, stroke, strokeWidth) {
        if (fill === void 0) { fill = 'white'; }
        if (stroke === void 0) { stroke = 'white'; }
        if (strokeWidth === void 0) { strokeWidth = 20; }
        var svg = U.newSvg('svg');
        svg.setAttributeNS(null, 'width', '20');
        svg.setAttributeNS(null, 'height', '20');
        svg.setAttributeNS(null, 'viewBox', (-strokeWidth) + ' ' + (-strokeWidth) + ' ' + (200 + strokeWidth * 2) + ' ' + (200 + strokeWidth * 2));
        svg.innerHTML = '<path fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + strokeWidth + '" d="M100 0 L200 200 L000 200 Z" />';
        return svg;
    };
    IEdge.generateGeneralizationTail = function (fill, stroke, strokeWidth) {
        if (fill === void 0) { fill = 'white'; }
        if (stroke === void 0) { stroke = 'white'; }
        if (strokeWidth === void 0) { strokeWidth = 20; }
        var svg = U.newSvg('svg');
        svg.setAttributeNS(null, 'width', '20');
        svg.setAttributeNS(null, 'height', '20');
        svg.setAttributeNS(null, 'viewBox', (-strokeWidth) + ' ' + (-strokeWidth) + ' ' + (200 + strokeWidth * 2) + ' ' + (200 + strokeWidth * 2));
        svg.innerHTML = '<path fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + strokeWidth + '" d="M100 0 L200 200 L000 200 Z" />';
        return null;
    };
    IEdge.makePathSegment = function (prevPt, nextPt, mode0, angularFavDirectionIsHorizontal, prevVertexSize, nextVertexSize, type, debug) {
        if (angularFavDirectionIsHorizontal === void 0) { angularFavDirectionIsHorizontal = null; }
        if (type === void 0) { type = ' L'; }
        if (debug === void 0) { debug = false; }
        // todo: devi rifare totalmente la parte di "angularFavDirection" basandoti su se cade perpendicolare sul vertice e devi usare
        // 2 variabili, forzando la direzione ad essere per forza perpendicolare sul lato su cui risiede il vertex.startPt o .endPt
        // poi: se le direzioni forzate coincidono, allora è un angular3, se sono vertical+horizontal, allora è un angular2.
        // nb: in prevVertexSize e nextVertexSize la favDirection viene calcolata uguale, ma l'assenamento prevVertexSize = nextVertexSize;
        // poi deve sparire perchè devo generare 2 diverse favDirection e non una sola.
        var m;
        var pathStr = '';
        var pt1IsOnHorizontalSide = !prevVertexSize ? null : U.isOnHorizontalEdges(prevPt, prevVertexSize);
        var pt2IsOnHorizontalSide = !nextVertexSize ? null : U.isOnHorizontalEdges(nextPt, nextVertexSize);
        // if (prevVertexSize) { prevPt = prevVertexSize} //IVertex.closestIntersection(); }
        if (debug) {
            U.cclear();
            Status.status.getActiveModel().graph.markg(prevPt, true, 'green');
            if (prevVertexSize) {
                Status.status.getActiveModel().graph.markgS(prevVertexSize, false, 'white');
            }
            Status.status.getActiveModel().graph.markg(nextPt, false, 'green');
            if (nextVertexSize) {
                Status.status.getActiveModel().graph.markgS(nextVertexSize, false);
            }
        }
        U.pif(debug, 'prev:' + (pt1IsOnHorizontalSide) + ', next:' + (pt2IsOnHorizontalSide), 'm0:' + mode0 + ' --> ' + mode0 + ', favDirection' + angularFavDirectionIsHorizontal);
        // return '';
        U.pif(debug, 'directions:', pt1IsOnHorizontalSide, pt2IsOnHorizontalSide);
        if (prevVertexSize && !U.isOnEdge(prevPt, prevVertexSize)) {
            U.pw(debug, 'prev not on border');
            return '';
        }
        if (nextVertexSize && !U.isOnEdge(nextPt, nextVertexSize)) {
            U.pw(debug, 'next not on border');
            return '';
        }
        U.pe(prevVertexSize && !U.isOnEdge(prevPt, prevVertexSize) || nextVertexSize && !U.isOnEdge(nextPt, nextVertexSize), 'not on border');
        if (prevVertexSize && !U.isOnEdge(prevPt, prevVertexSize) || nextVertexSize && !U.isOnEdge(nextPt, nextVertexSize)) {
            /*console.clear();
            const g = Status.status.getActiveModel().graph;
            g.markg(prevPt, false, 'green');
            g.markgS(prevVertexSize, false, 'green');
            g.markg(prevPt, false);
            g.markgS(prevVertexSize, false);
            console.log('not on vertex border. pt:', prevPt, 'vertex:', prevVertexSize);
            console.log('not on vertex border. nextpt:', nextPt, 'nextvertex:', nextVertexSize);
            U.pw(true, (!U.isOnEdge(prevPt, prevVertexSize) ? 'prev' : 'next') + ' not on vertex border.');
            return '';
            */
        }
        var mode = mode0;
        if (prevVertexSize && nextVertexSize) {
            // mode = (pt1IsOnHorizontalSide && pt2IsOnHorizontalSide) ? EdgeModes.angular3 : EdgeModes.angular2;
        }
        // if (mode === EdgeModes.angular23Auto) { mode = EdgeModes.angular3; }
        /*
        if (prevVertexSize && mode === EdgeModes.angular23Auto) {
          // U.pe(angularFavDirectionIsHorizontal === null, 'preferred direction is useless with prevVertexSize');
          U.pif(debug, 'favdirection pre:', angularFavDirectionIsHorizontal,
            'isOnVerticalEdge:', U.isOnVerticalEdges(prevPt, prevVertexSize),
            'isOnHorizontalEdge:', U.isOnHorizontalEdges(prevPt, prevVertexSize), 'prevPt:', prevPt, 'prevSize:', prevVertexSize);
          if (angularFavDirectionIsHorizontal === false && U.isOnVerticalEdges(prevPt, prevVertexSize)) {
            mode = EdgeModes.angular2; angularFavDirectionIsHorizontal = true; }
          if (angularFavDirectionIsHorizontal === true && U.isOnHorizontalEdges(prevPt, prevVertexSize)) {
            mode = EdgeModes.angular2; angularFavDirectionIsHorizontal = false; }
          U.pif(debug, 'favdirection post:', angularFavDirectionIsHorizontal);
        } */
        /* compute last favorite direction * /
    let lastIsHorizontalSide: boolean = null;
    const endPt: GraphPoint = allRealPt[allRealPt.length - 1].pos;
    const penultimoPt: GraphPoint = allRealPt[allRealPt.length - 2].getStartPoint();
    console.log('endVertex:', endVertex, 'endPt:', endPt, '; useRealEnd ? ', useRealEndVertex, ' = ', this.tmpEnd, this.tmpEndVertex);
    if (!endVertex) { lastIsHorizontalSide = Math.abs(GraphPoint.getM(penultimoPt, endPt)) < 1; } else
    if (endPt.x === endVertexSize.x) {                   /*from Left* /   lastIsHorizontalSide = true; } else
    if (endPt.x === endVertexSize.x + endVertexSize.w) { /*from Right* /  lastIsHorizontalSide = true; } else
    if (endPt.y === endVertexSize.y) {                   /*from Top* /    lastIsHorizontalSide = false; } else
    if (endPt.y === endVertexSize.y + endVertexSize.h) { /*from Bottom* / lastIsHorizontalSide = false;
    } else { lastIsHorizontalSide = null; }
    U.pe(lastIsHorizontalSide === null, 'endpoint is not on the boundary of vertex.',
      ' Vertex.endpoint:', endPt, '; vertexSize:', endVertexSize);*/
        /* done setting realpoints.pos, now draw path */
        var oldPathStr = pathStr;
        if (mode === EdgeModes.angular23Auto) {
            mode = mode0 = EdgeModes.angular3;
        }
        var angular23 = EdgeModes.angular3;
        // if (mode0 === angular23 && prevVertexSize && !pt1IsOnHorizontalSide && nextVertexSize && pt2IsOnHorizontalSide) {
        U.pif(debug, mode0 === angular23, !!prevVertexSize, pt1IsOnHorizontalSide);
        if (mode0 === angular23 && prevVertexSize && pt1IsOnHorizontalSide) {
            angularFavDirectionIsHorizontal = false;
            mode = EdgeModes.angular3;
            U.pif(debug, 'fixed');
        }
        // if (prevVertexSize) { angularFavDirectionIsHorizontal = pt1IsOnHorizontalSide; }
        // if (nextVertexSize) { angularFavDirectionIsHorizontal = !pt2IsOnHorizontalSide; }
        // if (mode === angular23 && prev)
        switch (mode) {
            default:
                U.pe(true, 'unexpected EdgeMode:', mode);
                break;
            case EdgeModes.angular2:
                m = GraphPoint.getM(prevPt, nextPt); // coefficiente angolare della prossima linea disegnata (come se fosse dritta)
                if (angularFavDirectionIsHorizontal === null) {
                    angularFavDirectionIsHorizontal = Math.abs(m) <= 1;
                } // angolo <= abs(45°)
                if (angularFavDirectionIsHorizontal) {
                    // qui resizer orizzontale
                    oldPathStr = pathStr;
                    pathStr += type + (nextPt.x) + ' ' + (prevPt.y);
                    U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; ang2 favdirectionHorizontal');
                }
                else {
                    // qui resizer verticale.
                    oldPathStr = pathStr;
                    pathStr += type + (prevPt.x) + ' ' + (nextPt.y);
                    U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; ang2 favdirectionVertical');
                }
                // qui resizer opposto al precedente.
                // oldPathStr = pathStr;
                // pathStr += type + (nextPt.x) + ' ' + (nextPt.y);
                // U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; ang2 end ridondante?');
                break;
            case EdgeModes.angular23Auto + '':
                U.pw(true, 'mode.angular23Auto should be replaced before entering here');
                break;
            case EdgeModes.angular3:
                m = GraphPoint.getM(prevPt, nextPt); // coefficiente angolare della prossima linea disegnata (come se fosse dritta)
                if (angularFavDirectionIsHorizontal === null) {
                    angularFavDirectionIsHorizontal = Math.abs(m) <= 1;
                } // angolo <= abs(45°)
                if (angularFavDirectionIsHorizontal) {
                    var midX = (nextPt.x + prevPt.x) / 2;
                    // todo: e qui dovrei appendere un path invisibile che cambia cursore in HorizontalResizer intercettare gli eventi edge.
                    oldPathStr = pathStr;
                    pathStr += type + (midX) + ' ' + (prevPt.y);
                    U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; angular3 orizzontale: orizzontale big');
                    // qui invece uno piccolino verticale
                    oldPathStr = pathStr;
                    pathStr += type + (midX) + ' ' + (nextPt.y);
                    U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; angular3 orizzontale: verticale small');
                }
                else {
                    var midY = (nextPt.y + prevPt.y) / 2;
                    // todo: qui resizer verticale.
                    oldPathStr = pathStr;
                    pathStr += type + prevPt.x + ' ' + (midY);
                    U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; angular3 verticale: verticale big');
                    // qui invece uno piccolino orizzontale
                    oldPathStr = pathStr;
                    pathStr += type + nextPt.x + ' ' + (midY);
                    U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; angular3 verticale: orizzontale small');
                }
                // todo: qui resizer opposto al precedente.
                break;
            case EdgeModes.straight: /* nessun punto fittizio di mezzo */ break;
        }
        oldPathStr = pathStr;
        pathStr += type + (nextPt.x) + ' ' + (nextPt.y);
        U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; lastPt comune a tutti.');
        return pathStr;
    };
    /*private static midPointMouseDown(e: JQuery.MouseDownEvent) {
      IEdge.tempMidPoint_ModelPiece = ModelPiece.getLogic(e.currentTarget);
      IEdge.tempMidPoint_Clicked = Status.status.getActiveModel().graph.toGraphCoord( new Point(e.pageX, e.pageY) );
    }*/ /*
    private static midPointMouseMove(e: JQuery.MouseMoveEvent) {
      const p: GraphPoint = Status.status.getActiveModel().graph.toGraphCoord( new Point(e.pageX, e.pageY) );
  
    }
    private static midPointMouseUp(e: JQuery.MouseUpEvent) { }*/
    IEdge.prototype.canBeLinkedTo = function (target) { return this.logic.canBeLinkedTo(target); };
    IEdge.prototype.refreshGui = function (debug, useRealEndVertex, usemidnodes) {
        if (debug === void 0) { debug = false; }
        if (useRealEndVertex === void 0) { useRealEndVertex = null; }
        if (usemidnodes === void 0) { usemidnodes = null; }
        debug = false;
        if (useRealEndVertex === null) {
            useRealEndVertex = this.useRealEndVertex;
        }
        if (usemidnodes === null) {
            usemidnodes = this.useMidNodes;
        }
        /* setup variables */
        if (!this.logic.edgeStyleCommon.style) {
            this.logic.edgeStyleCommon.style = EdgeModes.straight;
        }
        this.mode = this.logic.edgeStyleCommon.style;
        var startVertex = this.start;
        var startVertexSize = this.start.getSize();
        var endVertex = null;
        var endVertexSize = null;
        var allRealPt = this.getAllRealMidPoints();
        if (!usemidnodes) {
            allRealPt = [allRealPt[0], allRealPt[allRealPt.length - 1]];
        }
        if (useRealEndVertex) {
            endVertex = this.end;
            endVertexSize = endVertex.getSize();
            this.startNode.moveTo(startVertex.getStartPoint(allRealPt[1].getEndPoint()), false);
            this.endNode.moveTo(endVertex.getEndPoint(allRealPt[allRealPt.length - 2].getStartPoint()), false);
        }
        else {
            endVertex = this.tmpEndVertex;
            endVertexSize = endVertex ? endVertex.getSize() : null;
            this.startNode.moveTo(startVertex.getStartPoint(allRealPt[1].getEndPoint()), false);
            this.endNode.moveTo(endVertex ? endVertex.getEndPoint(allRealPt[allRealPt.length - 2].getStartPoint()) : this.tmpEnd, false);
        }
        U.pif(debug, 'allRealPt:', allRealPt);
        var i;
        var pathStr; // 'M' + (allRealPt[0].getStartPoint().x) + ' ' + (allRealPt[0].getStartPoint().y);
        var oldpathStr;
        var graph = this.logic.getModelRoot().graph;
        if (debug) {
            U.cclear();
            if (startVertexSize) {
                graph.markgS(startVertexSize, true, 'blue');
            }
            if (endVertexSize) {
                graph.markgS(endVertexSize, false);
            }
        }
        for (i = 1; i < allRealPt.length; i++) { // escludo il primo punto dal loop.
            var curr = allRealPt[i];
            var prev = allRealPt[i - 1];
            var favdirection = null; // i === allRealPt.length - 1 ? lastdirectionIsHorizontal : null;
            var prevVertexSize = i === 1 ? startVertexSize : null;
            var nextVertexSize = i === allRealPt.length - 1 ? endVertexSize : null;
            /* const prevFitGridVertical: boolean = false; // prevVertexSize ? U.isOnHorizontalEdges(prev.getStartPoint(), prevVertexSize) : true;
            const prevFitGridHorizontal: boolean = false; // prevVertexSize ? U.isOnHorizon todo;
            const nextFitToGridHorizontal: boolean = false;
            const nextFitToGridVertical: boolean = false;*/
            var prevPt = prev.getStartPoint(!prevVertexSize, !prevVertexSize);
            var currPt = curr.getEndPoint(!nextVertexSize, !nextVertexSize);
            if (debug) {
                graph.markg(prevPt, false, 'green');
                graph.markg(currPt, false, 'green');
                if (prevVertexSize) {
                    graph.markgS(prevVertexSize, false, 'blue');
                }
                if (nextVertexSize) {
                    graph.markgS(nextVertexSize, false);
                }
            }
            // if (i === 1) { pt1.moveOnNearestBorder(startVertexSize, false); }
            // if (i === allRealPt.length - 1) { pt2.moveOnNearestBorder(endVertexSize, false); }
            if (i === 1) {
                pathStr = 'M' + prevPt.x + ' ' + prevPt.y;
            }
            oldpathStr = pathStr;
            pathStr += IEdge.makePathSegment(prevPt, currPt, this.mode, favdirection, prevVertexSize, nextVertexSize);
            U.pif(debug, 'pathStr: RealPts:' + '[' + i + '] = ' + currPt.toString() + '; prev:' + prevPt.toString());
            U.pif(debug, 'pathStr[' + (i) + '/' + allRealPt.length + ']: ' + oldpathStr + ' --> ' + pathStr);
        }
        this.setPath(pathStr, debug);
        this.appendTailHead(this.getEdgeHead(), true, pathStr);
        this.appendTailHead(this.getEdgeTail(), false, pathStr);
        this.addEventListeners();
    };
    IEdge.prototype.setPath = function (pathStr, debug) {
        if (debug === void 0) { debug = false; }
        var style = null;
        if (this.isHighlighted) {
            style = this.logic.edgeStyleHighlight;
        }
        else if (this.isSelected) {
            style = this.logic.edgeStyleSelected;
        }
        else {
            style = this.logic.edgeStyleCommon;
        }
        /* update style */
        this.html.setAttribute('stroke', style.color);
        this.html.setAttribute('stroke-width', '' + style.width);
        this.shadow.setAttribute('stroke-width', '' + (style.width + IEdge.shadowWidthIncrease));
        U.clear(this.shell);
        this.shell.appendChild(this.html);
        this.shell.appendChild(this.shadow);
        U.pif(debug, 'edgeHead:', this.edgeHead, 'tail:', this.edgeTail);
        this.html.setAttributeNS(null, 'd', pathStr);
        this.shadow.setAttributeNS(null, 'd', pathStr);
        var i;
        if (this.isSelected) {
            this.startNode.show();
            for (i = 0; i < this.midNodes.length; i++) {
                this.midNodes[i].show();
            }
            this.endNode.show();
        }
        else if (this.isHighlighted) {
            this.startNode.hide();
            for (i = 0; i < this.midNodes.length; i++) {
                this.midNodes[i].show();
            }
            this.endNode.hide();
        }
        else {
            this.startNode.hide();
            for (i = 0; i < this.midNodes.length; i++) {
                this.midNodes[i].hide();
            }
            this.endNode.hide();
        }
    };
    IEdge.prototype.addEventListeners = function () {
        var _this = this;
        var $html = $(this.shell);
        $html.off('click.pbar').on('click.pbar', function (e) { return IVertex.ChangePropertyBarContentClick(e, _this); });
        /*$html.off('mousedown.showStyle').on('mousedown.showStyle',
          (e: MouseDownEvent) => { Status.status.getActiveModel().graph.propertyBar.styleEditor.showE(this.logic); });*/
        $html.off('mousedown.startSetMidPoint').on('mousedown.startSetMidPoint', function (e) {
            // const ownermp: M2Class | IReference = ModelPiece.getLogic(e.currentTarget) as M2Class | IReference;
            // U.pe( ownermp === null || ownermp === undefined, 'unable to get logic of:', e.currentTarget);
            var edge = IEdge.get(e);
            U.pe(!e, 'unable to get edge of:', e.currentTarget);
            edge.onMouseDown(e);
        });
        $html.off('mousemove.startSetMidPoint').on('mousemove.startSetMidPoint', function (e) {
            // const ownermp: M2Class | IReference = ModelPiece.getLogic(e.currentTarget) as M2Class | IReference;
            // U.pe( ownermp === null || ownermp === undefined, 'unable to get logic of:', e.currentTarget);
            var edge = IEdge.getByHtml(e.target, true);
            edge.onMouseMove(e);
        });
        $html.off('click.addEdgePoint').on('click.addEdgePoint', function (e) { IEdge.get(e).onClick(e); });
        $html.find('.Edge').off('mouseover.cursor').on('mouseover.cursor', function (e) { IEdge.get(e).onMouseOver(e); });
        $html.find('.Edge').off('mouseenter.cursor').on('mouseenter.cursor', function (e) { IEdge.get(e).onMouseEnter(e); });
        $html.find('.Edge').off('mouseleave.cursor').on('mouseleave.cursor', function (e) { IEdge.get(e).onMouseLeave(e); });
    };
    IEdge.prototype.onBlur = function () {
        this.isSelected = false;
        this.html.classList.remove('selected_debug');
        U.arrayRemoveAll(IEdge.selecteds, this);
        var i;
        for (i = 0; i < this.midNodes; i++) {
            this.midNodes[i].hide();
        }
        this.refreshGui();
    };
    IEdge.prototype.getAllRealMidPoints = function () {
        var allNodes = [];
        allNodes.push(this.startNode);
        var i = 0;
        while (i < this.midNodes.length) {
            allNodes.push(this.midNodes[i++]);
        }
        allNodes.push(this.endNode);
        return allNodes;
    };
    IEdge.prototype.getAllFakePoints = function (debug) {
        if (debug === void 0) { debug = false; }
        // if (!this.html) { return null; }
        var d = this.html.getAttributeNS(null, 'd'); // .replace('M', 'L');
        // let dArr: string[] = d.split('L'); /// consider instead: U.parseSvgPath(pathStr).pts;
        // if (dArr.length === 1) { dArr = [dArr[0], dArr[0]]; }
        var i;
        var realMidPoints = this.getAllRealMidPoints();
        var nodiFittizi = [];
        var realNodeIndex = 0;
        var puntiReali = 0;
        var parsedpts = U.parseSvgPath(d);
        for (i = 0; i < parsedpts.pts.length; i++) {
            var pt = new GraphPoint(parsedpts.pts[i].x, parsedpts.pts[i].y);
            var target = null;
            U.pif(debug, 'getAllFakePoints() d:', d, 'pt', pt, 'realMidPoints:', realMidPoints, 'index:', realNodeIndex, 'match?', realNodeIndex >= realMidPoints.length ? 'overflow' : realMidPoints[realNodeIndex].pos.equals(pt));
            var fitToGrid = i !== 0 || i !== parsedpts.pts.length - 1;
            var fitHorizontal = void 0;
            var fitVertical = void 0;
            if (i !== 0 && i !== parsedpts.pts.length - 1) {
                fitHorizontal = fitVertical = true;
            }
            if (i === 0 && !U.isOnHorizontalEdges(pt, this.start.getSize())) {
                fitHorizontal = false;
                fitVertical = true;
            }
            if (i === 0 && U.isOnHorizontalEdges(pt, this.start.getSize())) {
                fitHorizontal = true;
                fitVertical = false;
            }
            if (i === parsedpts.pts.length - 1 && !U.isOnHorizontalEdges(pt, this.end.getSize())) {
                fitHorizontal = false;
                fitVertical = true;
            }
            if (i === parsedpts.pts.length - 1 && U.isOnHorizontalEdges(pt, this.end.getSize())) {
                fitHorizontal = true;
                fitVertical = false;
            }
            // fitHorizontal = (i === 0 && U.isOnHorizontalEdges(pt, this.start.getSize()));
            var midPoint = realMidPoints[realNodeIndex].getStartPoint(fitHorizontal, fitVertical);
            // todo: se cambi endpoint !== startpoint, devi fare due check.
            // const prevPt: GraphPoint = allNodes[realNodeIndex].getStartPoint(!!prevVertexSize, !!prevVertexSize);
            // const currPt: GraphPoint = curr.getEndPoint(!!nextVertexSize, !!nextVertexSize);
            U.pif(debug, pt, ' =?= ', midPoint, pt.equals(midPoint));
            if (pt.equals(midPoint)) {
                puntiReali++;
                target = realMidPoints[realNodeIndex++];
            }
            nodiFittizi.push(new EdgePointFittizio(pt, target));
        }
        if (puntiReali < 2 || puntiReali < realMidPoints.length) {
            var prettyFittizi = [];
            var prettyRealMidPoints = [];
            i = -1;
            while (++i < nodiFittizi.length) {
                prettyFittizi.push(nodiFittizi[i].pos.toString());
            }
            i = -1;
            while (++i < realMidPoints.length) {
                prettyRealMidPoints.push(realMidPoints[i].pos.toString());
            }
            U.pw(debug, 'fallimento nell\'assegnare fakepoints ai punti reali. Assegnati:' + puntiReali + ' / ' + prettyRealMidPoints.length
                + '; fittizi trovati:', prettyFittizi, ' reali:', prettyRealMidPoints, ', parsedpts:', parsedpts, ', path:', d);
        }
        return nodiFittizi;
    };
    IEdge.prototype.getBoundingMidPoints = function (e, style, canFail, arrFittizi) {
        if (style === void 0) { style = null; }
        if (canFail === void 0) { canFail = false; }
        if (arrFittizi === void 0) { arrFittizi = null; }
        var fittizi = arrFittizi ? arrFittizi : this.getAllFakePoints();
        var tmp = this.getBoundingMidPointsFake(e, style, canFail, fittizi);
        return { prev: tmp[0].getPreviousRealPt(fittizi), next: tmp[1].getNextRealPt(fittizi) };
    };
    IEdge.prototype.getBoundingMidPointsFake = function (e, style, canFail, arrFittizi) {
        if (style === void 0) { style = null; }
        if (canFail === void 0) { canFail = false; }
        if (arrFittizi === void 0) { arrFittizi = null; }
        // if (style.style === EdgeModes.straight) { return this.getBoundingMidPointsStraight(e, canFail); }
        // const edge: IEdge = ModelPiece.getLogic(e.classType).edge;
        var clickedPt = GraphPoint.fromEvent(e);
        var lineWidth = +this.shadow.getAttributeNS(null, 'stroke-width');
        var allNodes = this.getAllRealMidPoints();
        var fittizi = arrFittizi ? arrFittizi : this.getAllFakePoints();
        var i = 0;
        var closestPrev = null;
        var closestNext = null;
        var closestDistance = Number.POSITIVE_INFINITY;
        if (fittizi.length <= 2)
            return null;
        while (++i < fittizi.length) {
            var prev = fittizi[i - 1];
            var next = fittizi[i];
            var currentDistance = clickedPt.distanceFromLine(prev.pos, next.pos);
            /*if (clickedPt.isInTheMiddleOf(prev.pos, next.pos, lineWidth)) { return [prev, next]; }*/
            if (currentDistance < closestDistance) {
                closestPrev = prev;
                closestNext = next;
                closestDistance = currentDistance;
            }
        }
        return [closestPrev, closestNext];
    };
    IEdge.prototype.getBoundingMidPointsStraight_OLD = function (e, canFail) {
        if (canFail === void 0) { canFail = false; }
        var edge = null; // ModelPiece.getLogic(e.classType).edge;
        var clickedPt = GraphPoint.fromEvent(e);
        var first = this.startNode;
        var second = (this.midNodes.length === 0 ? this.endNode : this.midNodes[0]);
        var penultimo = (this.midNodes.length === 0 ? this.startNode : this.midNodes[this.midNodes.length - 1]);
        var last = this.endNode;
        var lineWidth = +this.shadow.getAttributeNS(null, 'stroke-width');
        if (clickedPt.isInTheMiddleOf(first.pos, second.pos, lineWidth)) {
            /*console.log('bounding (first[' + edge.midNodes.indexOf(second)
              + '] && second[' + + edge.midNodes.indexOf(penultimo) + ']); e:', edge);*/
            return [first, second];
        }
        /* if (penultimo !== first && second !== penultimo && clickedPt.isInTheMiddleOf(second.pos, penultimo.pos, lineWidth)) {
          console.log('bounding (second[' + edge.midNodes.indexOf(second)
            + '] && penultimo[' + + edge.midNodes.indexOf(penultimo) + ']), e:', edge);
          U.pe(edge.midNodes.indexOf(second) + 1 !== edge.midNodes.indexOf(penultimo), 'non conseguenti');
          return [second, penultimo]; } */
        if (last !== second && clickedPt.isInTheMiddleOf(penultimo.pos, last.pos, lineWidth)) {
            /*console.log('bounding (penultimo[' + edge.midNodes.indexOf(penultimo)
              + '] && ultimo[' + + edge.midNodes.indexOf(last) + ']); e:', edge);*/
            return [penultimo, last];
        }
        var i;
        for (i = 0; i < this.midNodes.length; i++) { // ottimizzazione: può partire da 1 e terminare 1 prima (penultimo)
            var pre = i === 0 ? first : this.midNodes[i - 1];
            var now = this.midNodes[i];
            if (clickedPt.isInTheMiddleOf(pre.pos, now.pos, lineWidth)) {
                /*console.log('bounding (pre[' + edge.midNodes.indexOf(pre)
                  + '] && now[' + + edge.midNodes.indexOf(now) + ']), e:', edge);*/
                U.pe(edge.midNodes.indexOf(pre) + 1 !== edge.midNodes.indexOf(now), 'non consecutivi.');
                return [pre, now];
            }
        }
        console.log('clickedPt:', clickedPt, ', start:', this.startNode.pos, ', mids:', this.midNodes, ', end:', this.endNode.pos);
        U.pe(!canFail, 'bounding points not found:', e, this, 'edge:', IEdge.get(e));
        return null;
    };
    IEdge.prototype.onMouseLeave = function (e) {
        this.isHighlighted = false;
        this.startNode.refreshGUI(null, false);
        this.endNode.refreshGUI(null, false);
        var i;
        for (i = 0; i < this.midNodes.length; i++) {
            this.midNodes[i].refreshGUI(null, false);
        }
        this.refreshGui();
    };
    IEdge.prototype.onMouseEnter = function (e) {
        this.onMouseLeave(null);
        this.isHighlighted = true;
        this.refreshGui();
    };
    IEdge.prototype.onMouseMove = function (e) { this.onMouseOver(e, false); };
    IEdge.prototype.onMouseOver = function (e, canFail, debug) {
        if (canFail === void 0) { canFail = false; }
        if (debug === void 0) { debug = false; }
        if (CursorFollowerEP.get().isAttached() || IEdge.edgeChanging) {
            return;
        }
        var fakePoints = this.getAllFakePoints();
        var tmp = this.getBoundingMidPointsFake(e, null, canFail, fakePoints);
        if (!tmp || tmp.length < 2) {
            return;
        }
        var preFake = tmp[0];
        var nextFake = tmp[1];
        var pre = preFake.getPreviousRealPt(fakePoints);
        var next = nextFake.getNextRealPt(fakePoints);
        U.pe(!pre, 'failed to get previousRealPt of point:', preFake, ', all fakePoints:', fakePoints);
        U.pe(!next, 'failed to get nextRealPt of point:', nextFake, ', all fakePoints:', fakePoints);
        var i = -1;
        this.startNode.refreshGUI(null, false);
        this.endNode.refreshGUI(null, false);
        var cursor;
        switch (this.logic.edgeStyleCommon.style) {
            default:
                cursor = 'help';
                break;
            case EdgeModes.straight:
                cursor = 'select';
                break;
            case EdgeModes.angular2:
            case EdgeModes.angular3:
            case EdgeModes.angular23Auto:
                if (preFake.pos.x === nextFake.pos.x) {
                    cursor = 'col-resize';
                }
                else if (preFake.pos.y === nextFake.pos.y) {
                    cursor = 'row-resize';
                }
                else {
                    cursor = 'no-drop';
                }
                break;
        }
        this.shadow.style.cursor = this.html.style.cursor = cursor;
        while (++i < this.midNodes.length) {
            this.midNodes[i].refreshGUI(null, false);
        }
        if (debug) {
            U.cclear();
        }
        U.pif(debug, 'fake     pre: ', preFake, ', next:', nextFake);
        U.pif(debug, 'real     pre: ', pre, ', next:', next);
        pre.refreshGUI(null, true);
        next.refreshGUI(null, true);
    };
    IEdge.prototype.onClick = function (e) {
        // console.log('IEdge.clicked:', this);
        var debug = false;
        this.isSelected = true;
        IEdge.selecteds.push(this);
        var i;
        this.html.setAttributeNS(null, 'stroke-width', '' + 5);
        this.html.classList.add('selected_debug');
        this.startNode.show();
        if (debug) {
            U.cclear();
        }
        U.pif(debug, 'midnodes:', this.midNodes);
        for (i = 0; i < this.midNodes; i++) {
            this.midNodes[i].show(debug);
        }
        this.endNode.show();
        // if (!triggered) { Status.status.getActiveModel().graph.propertyBar.styleEditor.showE(this.logic); }
        this.refreshGui();
        IVertex.ChangePropertyBarContentClick(e, this);
        e.stopPropagation();
    };
    IEdge.prototype.onMouseDown = function (e) {
        if (!this.isSelected) {
            return;
        }
        var tmp = this.getBoundingMidPoints(e);
        var pos = this.owner.toGraphCoord(new Point(e.pageX, e.pageY));
        CursorFollowerEP.get().attach(this, pos, this.midNodes.indexOf(tmp.prev));
    };
    IEdge.prototype.onMouseUp = function (e) {
        var len0 = this.midNodes.length;
        var index = this.midNodes.indexOf(CursorFollowerEP.get());
        if (!this.isSelected) {
            return;
        }
        // console.log('point inserted Pre', this.midNodes, ' [0]:', this.midNodes[0], this.midNodes[1]);
        CursorFollowerEP.get().detach(false);
        var len1 = this.midNodes.length;
        U.insertAt(this.midNodes, index, new EdgePoint(this, CursorFollowerEP.get().pos));
        var len2 = this.midNodes.length;
        U.pe(len0 !== this.midNodes.length, 'size varied: ' + len0 + ' --> ' + len1 + ' --> ' + len2 + ' --> ' + this.midNodes.length);
        // console.log('point inserted Post:', this.midNodes,  len0 + ' --> ' + this.midNodes.length);
        this.refreshGui();
    };
    IEdge.prototype.remove = function () {
        U.arrayRemoveAll(this.start.edgesStart, this);
        U.arrayRemoveAll(this.end.edgesEnd, this);
        U.arrayRemoveAll(IEdge.all, this);
        if (!(this instanceof ExtEdge)) {
            var index = this.getIndex();
            U.pe(this.logic.edges[index] !== this, 'deleting wrong edge.');
            this.logic.edges[index] = null;
        }
        U.arrayRemoveAll(this.owner.edges, this);
        this.html.parentNode.removeChild(this.html);
        // gc helper
        this.end = null;
        this.logic = null;
        this.tmpEnd = null;
        this.tmpEndVertex = null;
        this.endNode = null;
        this.midNodes = null;
        this.owner = null;
        this.start = null;
        this.startNode = null;
    };
    IEdge.prototype.unsetTarget = function () {
        var v = this.end;
        if (!v) {
            return null;
        }
        this.end = null;
        U.arrayRemoveAll(v.edgesEnd, this);
        return v;
    };
    IEdge.prototype.setTarget = function (v) {
        this.unsetTarget();
        this.end = v;
        if (v) {
            v.edgesEnd.push(this);
        }
    };
    IEdge.prototype.getEdgeHead = function () {
        var logic = this.logic;
        var logicref = this.logic instanceof IReference ? this.logic : null;
        var logicclass = this.logic instanceof IClass ? this.logic : null;
        var html = null;
        if (logicref && logicref.isContainment()) {
            html = IEdge.generateContainmentHead();
        }
        if (this instanceof ExtEdge) {
            html = IEdge.generateGeneralizationHead();
        }
        if (!html) {
            return this.edgeHead = null;
        }
        html.classList.add('Edge', 'EdgeHead');
        return this.edgeHead = html;
    };
    IEdge.prototype.getEdgeTail = function () {
        var logic = this.logic;
        var logicref = this.logic instanceof IReference ? this.logic : null;
        var logicclass = this.logic instanceof IClass ? this.logic : null;
        var html = null;
        if (logicref && logicref.isContainment()) {
            html = IEdge.generateContainmentTail();
        }
        if (this instanceof ExtEdge) {
            html = IEdge.generateGeneralizationTail();
        }
        if (!html) {
            return this.edgeTail = null;
        }
        html.classList.add('Edge', 'EdgeTail');
        return this.edgeTail = html;
    };
    IEdge.prototype.mark = function (markb, key, color) {
        if (key === void 0) { key = 'errorGeneric'; }
        if (color === void 0) { color = 'red'; }
        U.pe(true, 'IEdge.mark() todo.');
    };
    IEdge.prototype.appendTailHead = function (cosa, onEnd, pathStr, debug) {
        if (debug === void 0) { debug = false; }
        if (!cosa) {
            return;
        }
        // debug = true;
        if (debug)
            U.cclear();
        var oldPathStr = pathStr;
        var startsub;
        var endsub;
        // filtro il pathStr estraendo solo i primi 2 o gli ultimi 2 punti. (migliora performance su edge pieni di edgepoints)
        var pt1;
        var pt2;
        if (onEnd) {
            endsub = pathStr.length;
            startsub = pathStr.lastIndexOf('L');
            U.pe(startsub === -1, 'the pathString have no L (but should have at least 2 points)');
            startsub = pathStr.lastIndexOf('L', startsub - 1);
            if (startsub === -1) {
                startsub = 0;
            }
        }
        else {
            startsub = 0;
            endsub = pathStr.indexOf('L');
            U.pe(endsub === -1, 'the pathString have no L (but should have at least 2 points)');
            endsub = pathStr.indexOf('L', endsub + 1);
            if (endsub === -1) {
                endsub = pathStr.length;
            }
        }
        pathStr = pathStr.substring(startsub, endsub);
        U.pif(debug, 'pathStr: ' + oldPathStr + ' --> ' + pathStr, 'onEnd ? ', onEnd);
        var points = U.parseSvgPath(pathStr).pts;
        U.pe(points.length !== 2, 'expected exactly 2 points, the pathStr got substringed for that.', points);
        if (onEnd) {
            pt1 = points[1];
            pt2 = points[0];
        }
        else {
            pt1 = points[0];
            pt2 = points[1];
        }
        this.owner.markg(pt1, true, 'red');
        this.owner.markg(pt2, true, 'blue');
        U.pif(debug, 'size of head: ', cosa, 'pt1:', pt1, 'pt2:', pt2, ', pts:', points, pathStr, oldPathStr);
        this.appendEdgeOrTail(cosa, pt1, pt2);
    };
    IEdge.prototype.appendEdgeOrTail = function (cosa, pt1, pt2real, debug) {
        if (debug === void 0) { debug = false; }
        var m = GraphPoint.getM(pt1, pt2real);
        var HeadSize = U.getSvgSize(cosa);
        var shell = U.newSvg('g');
        shell.appendChild(cosa);
        var firstEdgePointHtml = this.html.nextElementSibling;
        if (firstEdgePointHtml) {
            this.shell.insertBefore(shell, firstEdgePointHtml);
        }
        else {
            this.shell.appendChild(shell);
        }
        // const HeadSize: GraphSize = this.owner.toGraphCoordS(U.sizeof(this.edgeHead));
        debug = false;
        if (debug) {
            this.owner.markg(pt1, true, 'white');
            this.owner.markg(pt2real, false, 'green');
        }
        U.pif(debug, 'size of head: ', HeadSize, 'pt1:', pt1, 'pt2:', pt2real, 'm:', m);
        if (m === Number.POSITIVE_INFINITY) {
            // link hit on top
            (cosa).setAttributeNS(null, 'x', '' + (pt1.x - HeadSize.w / 2));
            (cosa).setAttributeNS(null, 'y', '' + (pt1.y - HeadSize.h));
        }
        else if (m === Number.NEGATIVE_INFINITY) {
            // link hit on bot
            (cosa).setAttributeNS(null, 'y', '' + (pt1.y));
            (cosa).setAttributeNS(null, 'x', '' + (pt1.x - HeadSize.w / 2));
        } /* else if (U.isPositiveZero(m)) {
          // link hit on left
          (cosa).setAttributeNS(null, 'y', '' + (pt1.y - HeadSize.h / 2));
          (cosa).setAttributeNS(null, 'x', '' + (pt1.x - HeadSize.w));
        } else if (U.isNegativeZero(m)) {
          // link hit on right
          (cosa).setAttributeNS(null, 'y', '' + (pt1.y - HeadSize.h / 2));
          (cosa).setAttributeNS(null, 'x', '' + (pt1.x));
        }*/
        else {
            var degreeRad = pt1.degreeWith(pt2real, true); // U.TanToDegree(m);
            var center = new GraphPoint(0, 0);
            var pt2 = new GraphPoint(0, 0);
            cosa.style.zIndex = '' + 100;
            cosa.style.position = 'absolute';
            if (pt1.x < pt2.x && pt1.y < pt2.y) {
                cosa.setAttributeNS(null, 'fill', 'blue');
            }
            pt2.x = pt1.x - HeadSize.w * Math.cos(degreeRad);
            pt2.y = pt1.y - HeadSize.h * Math.sin(degreeRad);
            center.x = (pt1.x + pt2.x) / 2;
            center.y = (pt1.y + pt2.y) / 2;
            var degree = U.RadToDegree(degreeRad) + 90; // don't know why +90.
            if (debug) {
                this.owner.markg(pt2, false, 'blue');
            }
            shell.setAttributeNS(null, 'transform', 'rotate(' + degree + ' ' + center.x + ' ' + center.y + ')');
            (cosa).setAttributeNS(null, 'x', '' + (center.x - HeadSize.w / 2));
            (cosa).setAttributeNS(null, 'y', '' + (center.y - HeadSize.h / 2));
            // link hit diagonally
        }
    };
    IEdge.prototype.getIndex = function () { return this.logic.edges.indexOf(this); };
    IEdge.selecteds = [];
    IEdge.all = IEdge.staticInit();
    IEdge.shadowWidthIncrease = 7;
    IEdge.edgeChangingStopTime = Date.now();
    IEdge.idToEdge = {};
    IEdge.edgeCount = 0 || 0;
    return IEdge;
}());
export { IEdge };
//# sourceMappingURL=iEdge.js.map