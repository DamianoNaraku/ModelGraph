import { U, IEdge, IField, M2Class, ModelPiece, IClass, Point, DamContextMenuComponent, Status, IReference, EType } from '../../common/Joiner';
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
    GraphPoint.getM = function (firstPt, secondPt) { return (firstPt.y - secondPt.y) / (firstPt.x - secondPt.x); };
    GraphPoint.getQ = function (firstPt, secondPt) { return firstPt.y - GraphPoint.getM(firstPt, secondPt) * firstPt.x; };
    GraphPoint.fromEvent = function (e) {
        var p = new Point(e.pageX, e.pageY);
        var g = Status.status.getActiveModel().graph;
        return g.toGraphCoord(p);
    };
    GraphPoint.prototype.toString = function () { return '(' + this.x + ', ' + this.y + ')'; };
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
    GraphPoint.prototype.isInTheMiddleOf = function (firstPt, secondPt, tolleranza) {
        var ret = this.isInTheMiddleOf0(firstPt, secondPt, tolleranza);
        // console.log('this ', this, 'is in middle of(', firstPt, ', ', secondPt, ') ? ', ret);
        return ret;
    };
    GraphPoint.prototype.isInTheMiddleOf0 = function (firstPt, secondPt, tolleranza) {
        var rectangle = GraphSize.fromPoints(firstPt, secondPt);
        var tolleranzaX = tolleranza; // actually should be cos * arctan(m);
        var tolleranzaY = tolleranza; // actually should be sin * arctan(m);
        if (this.x < rectangle.x - tolleranzaX || this.x > rectangle.x + rectangle.w + tolleranzaX) {
            return false;
        }
        if (this.y < rectangle.y - tolleranzaX || this.y > rectangle.y + rectangle.h + tolleranzaY) {
            return false;
        }
        var m = GraphPoint.getM(firstPt, secondPt);
        var q = GraphPoint.getQ(firstPt, secondPt);
        var lineDistance = this.distanceFromLine(firstPt, secondPt);
        // console.log('distance:', lineDistance, ', this:', this, ', p1:', firstPt, ', p2:', secondPt);
        if (lineDistance <= tolleranza) {
            return true;
        }
        return false;
    };
    GraphPoint.prototype.isInTheMiddleOfOld = function (firstPt, secondPt, tolleranza) {
        var rectangle = GraphSize.fromPoints(firstPt, secondPt);
        var tolleranzaX = tolleranza; // actually should be cos * arctan(m);
        var tolleranzaY = tolleranza; // actually should be sin * arctan(m);
        if (this.x < rectangle.x - tolleranzaX || this.x > rectangle.x + rectangle.w + tolleranzaX) {
            return false;
        }
        if (this.y < rectangle.y - tolleranzaX || this.y > rectangle.y + rectangle.h + tolleranzaY) {
            return false;
        }
        var m1Max = GraphPoint.getM(new GraphPoint(this.x + tolleranzaX, this.y + tolleranzaY), firstPt);
        var m1Min = GraphPoint.getM(new GraphPoint(this.x - tolleranzaX, this.y - tolleranzaY), firstPt);
        if (m1Min > m1Max) {
            var tmp = m1Min;
            m1Min = m1Max;
            m1Max = tmp;
        }
        var m2 = GraphPoint.getM(firstPt, secondPt);
        return !(m2 >= m1Min && m2 <= m1Max);
    };
    GraphPoint.prototype.distanceFromLine = function (p1, p2) {
        var top = +(p2.y - p1.y) * this.x
            - (p2.x - p1.x) * this.y
            + p2.x * p1.y
            - p1.x * p2.y;
        var bot = (p2.y - p1.y) * (p2.y - p1.y) +
            (p2.x - p1.x) * (p2.x - p1.x);
        return Math.abs(top) / Math.sqrt(bot);
    };
    GraphPoint.prototype.equals = function (pt, tolleranzaX, tolleranzaY) {
        if (tolleranzaX === void 0) { tolleranzaX = 0; }
        if (tolleranzaY === void 0) { tolleranzaY = 0; }
        if (pt === null) {
            return false;
        }
        return Math.abs(this.x - pt.x) <= tolleranzaX && Math.abs(this.y - pt.y) <= tolleranzaY;
    };
    GraphPoint.prototype.moveOnNearestBorder = function (startVertexSize, clone, debug) {
        if (debug === void 0) { debug = true; }
        var pt = clone ? this.clone() : this;
        var tl = startVertexSize.tl();
        var tr = startVertexSize.tr();
        var bl = startVertexSize.bl();
        var br = startVertexSize.br();
        var L = pt.distanceFromLine(tl, bl);
        var R = pt.distanceFromLine(tr, br);
        var T = pt.distanceFromLine(tl, tr);
        var B = pt.distanceFromLine(bl, br);
        var min = Math.min(L, R, T, B);
        if (min === L) {
            pt.x = tl.x;
        }
        if (min === R) {
            pt.x = tr.x;
        }
        if (min === T) {
            pt.y = tr.y;
        }
        if (min === B) {
            pt.y = br.y;
        }
        if (debug) {
            Status.status.getActiveModel().graph.markg(pt, false, 'purple');
        }
        return pt;
    };
    GraphPoint.prototype.getM = function (pt2) { return GraphPoint.getM(this, pt2); };
    GraphPoint.prototype.degreeWith = function (pt2, toRadians) {
        var directionVector = this.subtract(pt2, true);
        var ret = Math.atan2(directionVector.y, directionVector.x);
        return toRadians ? ret : U.RadToDegree(ret);
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
        this.w = w;
        this.h = h;
    }
    GraphSize.fromPoints = function (firstPt, secondPt) {
        var minX = Math.min(firstPt.x, secondPt.x);
        var maxX = Math.max(firstPt.x, secondPt.x);
        var minY = Math.min(firstPt.y, secondPt.y);
        var maxY = Math.max(firstPt.y, secondPt.y);
        return new GraphSize(minX, minY, maxX - minX, maxY - minY);
    };
    GraphSize.closestIntersection = function (vertexGSize, prevPt, pt0, gridAlign) {
        if (gridAlign === void 0) { gridAlign = null; }
        var pt = pt0.clone();
        var m = GraphPoint.getM(prevPt, pt);
        var q = GraphPoint.getQ(prevPt, pt);
        U.pe(Math.abs((pt.y - m * pt.x) - (prevPt.y - m * prevPt.x)) > .001, 'wrong math in Q:', (pt.y - m * pt.x), ' vs ', (prevPt.y - m * prevPt.x));
        /*const isL = prevPt.x < pt.x;
        const isT = prevPt.y < pt.y;
        const isR = !isL;
        const isB = !isT; */
        if (m === Number.POSITIVE_INFINITY && q === Number.NEGATIVE_INFINITY) { // bottom middle
            return new GraphPoint(vertexGSize.x + vertexGSize.w / 2, vertexGSize.y + vertexGSize.h);
        }
        // console.log('pt:', pt, 'm:', m, 'q:', q);
        var L = new GraphPoint(0, 0);
        var T = new GraphPoint(0, 0);
        var R = new GraphPoint(0, 0);
        var B = new GraphPoint(0, 0);
        L.x = vertexGSize.x;
        L.y = m * L.x + q;
        R.x = vertexGSize.x + vertexGSize.w;
        R.y = m * R.x + q;
        T.y = vertexGSize.y;
        T.x = (T.y - q) / m;
        B.y = vertexGSize.y + vertexGSize.h;
        B.x = (B.y - q) / m;
        // prendo solo il compreso pt ~ prevPt (escludo così il "pierce" sulla faccia opposta), prendo il più vicino al centro.
        // console.log('4 possibili punti di intersezione (LTBR):', L, T, B, R);
        /* this.owner.mark(this.owner.toHtmlCoord(T), true, 'blue');
        this.owner.mark(this.owner.toHtmlCoord(B), false, 'violet');
        this.owner.mark(this.owner.toHtmlCoord(L), false, 'red');
        this.owner.mark(this.owner.toHtmlCoord(R), false, 'orange');*/
        if ((B.x >= pt.x && B.x <= prevPt.x) || (B.x >= prevPt.x && B.x <= pt.x)) { }
        else {
            B = null;
        }
        if ((T.x >= pt.x && T.x <= prevPt.x) || (T.x >= prevPt.x && T.x <= pt.x)) { }
        else {
            T = null;
        }
        if ((L.y >= pt.y && L.y <= prevPt.y) || (L.y >= prevPt.y && L.y <= pt.y)) { }
        else {
            L = null;
        }
        if ((R.y >= pt.y && R.y <= prevPt.y) || (R.y >= prevPt.y && R.y <= pt.y)) { }
        else {
            R = null;
        }
        // console.log('superstiti step1: (LTBR):', L, T, B, R);
        var vicinanzaT = !T ? Number.POSITIVE_INFINITY : ((T.x - pt.x) * (T.x - pt.x)) + ((T.y - pt.y) * (T.y - pt.y));
        var vicinanzaB = !B ? Number.POSITIVE_INFINITY : ((B.x - pt.x) * (B.x - pt.x)) + ((B.y - pt.y) * (B.y - pt.y));
        var vicinanzaL = !L ? Number.POSITIVE_INFINITY : ((L.x - pt.x) * (L.x - pt.x)) + ((L.y - pt.y) * (L.y - pt.y));
        var vicinanzaR = !R ? Number.POSITIVE_INFINITY : ((R.x - pt.x) * (R.x - pt.x)) + ((R.y - pt.y) * (R.y - pt.y));
        var closest = Math.min(vicinanzaT, vicinanzaB, vicinanzaL, vicinanzaR);
        // console.log( 'closest:', closest);
        // succede quando pt e prevPt sono entrambi all'interno del rettangolo del vertice.
        // L'edge non è visibile e il valore ritornato è irrilevante.
        if (closest === Number.POSITIVE_INFINITY) {
            /* top center */
            pt = vertexGSize.tl();
            pt.x += vertexGSize.w / 2;
        }
        else if (closest === Number.POSITIVE_INFINITY) {
            /* bottom center */
            pt = vertexGSize.br();
            pt.x -= vertexGSize.w / 2;
        }
        else if (closest === vicinanzaT) {
            pt = T;
        }
        else if (closest === vicinanzaB) {
            pt = B;
        }
        else if (closest === vicinanzaR) {
            pt = R;
        }
        else if (closest === vicinanzaL) {
            pt = L;
        }
        if (!gridAlign) {
            return pt;
        }
        if ((pt === T || pt === B || isNaN(closest)) && gridAlign.x) {
            var floorX = Math.floor(pt.x / gridAlign.x) * gridAlign.x;
            var ceilX = Math.ceil(pt.x / gridAlign.x) * gridAlign.x;
            var closestX = void 0;
            var farthestX = void 0;
            if (Math.abs(floorX - pt.x) < Math.abs(ceilX - pt.x)) {
                closestX = floorX;
                farthestX = ceilX;
            }
            else {
                closestX = ceilX;
                farthestX = floorX;
            }
            // todo: possibile causa del bug che non allinea punti fake a punti reali. nel calcolo realPT questo non viene fatto.
            // if closest grid intersection is inside the vertex.
            if (closestX >= vertexGSize.x && closestX <= vertexGSize.x + vertexGSize.w) {
                pt.x = closestX;
            }
            else 
            // if 2° closer grid intersection is inside the vertex.
            if (closestX >= vertexGSize.x && closestX <= vertexGSize.x + vertexGSize.w) {
                pt.x = farthestX;
                // if no intersection are inside the vertex (ignore grid)
            }
            else {
                pt = pt;
            }
        }
        else if ((pt === L || pt === R) && gridAlign.y) {
            var floorY = Math.floor(pt.y / gridAlign.y) * gridAlign.y;
            var ceilY = Math.ceil(pt.y / gridAlign.y) * gridAlign.y;
            var closestY = void 0;
            var farthestY = void 0;
            if (Math.abs(floorY - pt.y) < Math.abs(ceilY - pt.y)) {
                closestY = floorY;
                farthestY = ceilY;
            }
            else {
                closestY = ceilY;
                farthestY = floorY;
            }
            // if closest grid intersection is inside the vertex.
            if (closestY >= vertexGSize.y && closestY <= vertexGSize.y + vertexGSize.h) {
                pt.y = closestY;
            }
            else 
            // if 2° closer grid intersection is inside the vertex.
            if (closestY >= vertexGSize.y && closestY <= vertexGSize.y + vertexGSize.h) {
                pt.y = farthestY;
                // if no intersection are inside the vertex (ignore grid)
            }
            else {
                pt = pt;
            }
        }
        return pt;
    };
    GraphSize.prototype.tl = function () { return new GraphPoint(this.x + 0, this.y + 0); };
    GraphSize.prototype.tr = function () { return new GraphPoint(this.x + this.w, this.y + 0); };
    GraphSize.prototype.bl = function () { return new GraphPoint(this.x + 0, this.y + this.h); };
    GraphSize.prototype.br = function () { return new GraphPoint(this.x + this.w, this.y + this.h); };
    GraphSize.prototype.clone = function () { return new GraphSize(this.x, this.y, this.w, this.h); };
    GraphSize.prototype.equals = function (size) { return this.x === size.x && this.y === size.y && this.w === size.w && this.h === size.h; };
    /// field-wise Math.min()
    GraphSize.prototype.min = function (minSize, clone) {
        var ret = clone ? this.clone() : this;
        if (!isNaN(minSize.x) && ret.x < minSize.x) {
            ret.x = minSize.x;
        }
        if (!isNaN(minSize.y) && ret.y < minSize.y) {
            ret.y = minSize.y;
        }
        if (!isNaN(minSize.w) && ret.w < minSize.w) {
            ret.w = minSize.w;
        }
        if (!isNaN(minSize.h) && ret.h < minSize.h) {
            ret.h = minSize.h;
        }
        return ret;
    };
    GraphSize.prototype.max = function (maxSize, clone) {
        var ret = clone ? this.clone() : this;
        if (!isNaN(maxSize.x) && ret.x > maxSize.x) {
            ret.x = maxSize.x;
        }
        if (!isNaN(maxSize.y) && ret.y > maxSize.y) {
            ret.y = maxSize.y;
        }
        if (!isNaN(maxSize.w) && ret.w > maxSize.w) {
            ret.w = maxSize.w;
        }
        if (!isNaN(maxSize.h) && ret.h > maxSize.h) {
            ret.h = maxSize.h;
        }
        return ret;
    };
    return GraphSize;
}());
export { GraphSize };
var IVertex = /** @class */ (function () {
    function IVertex(classe) {
        this.fields = [];
        this.edgesStart = [];
        this.edgesEnd = [];
        this.Vmarks = {};
        this.id = IVertex.ID++;
        IVertex.all[this.id] = this;
        var graph = classe.getModelRoot().graph;
        this.logic(classe);
        if (graph) {
            graph.addVertex(this);
        }
        this.contains = [];
        this.fields = [];
        this.edgesStart = [];
        this.edgesEnd = [];
    }
    IVertex.linkVertexMouseDown = function (e) {
        e.stopPropagation();
        var ref = IEdge.refChanging = ModelPiece.get(e);
        U.pe(!(ref instanceof IReference), 'The .LinkVertex element must be inserted only inside a reference field.');
        var edges = ref.getEdges();
        if (!ref) {
            return;
        }
        U.pe(!edges, 'ref.edges === null', IEdge.refChanging);
        var edge;
        if (ref.upperbound > 0 && edges.length >= ref.upperbound) {
            edge = edges[edges.length - 1];
        }
        else {
            edge = new IEdge(ref);
        }
        edge.useRealEndVertex = false;
        edge.useMidNodes = true;
        edge.tmpEnd = GraphPoint.fromEvent(e);
        edge.tmpEndVertex = ref.parent.getVertex();
        edge.refreshGui();
    };
    IVertex.getvertex = function (e) { return IVertex.getvertexByHtml(e.currentTarget); };
    IVertex.getvertexByHtml = function (node) {
        while (!node.dataset.vertexID) {
            node = node.parentNode;
        }
        // console.log('getVertex by id:' + node.dataset.vertexID, 'all:', IVertex.all);
        return IVertex.getByID(+(node.dataset.vertexID));
    };
    IVertex.getByID = function (id) { return IVertex.all[id]; };
    IVertex.FieldNameChanged = function (e) {
        var html = e.currentTarget;
        var modelPiece = ModelPiece.getLogic(html);
        modelPiece.fieldChanged(e);
        $(html).trigger('click'); // updates the propertyBar
        // const m: IModel = modelPiece.getModelRoot();
        var mm = Status.status.mm;
        var m = Status.status.m;
        setTimeout(function () { mm.refreshGUI(); m.refreshGUI(); }, 1);
    };
    // todo: move on pbar
    IVertex.ChangePropertyBarContentClick = function (e, isEdge) {
        if (isEdge === void 0) { isEdge = false; }
        var html = e.target; // todo: approfondisci i vari tipi di m2target (current, orginal...)
        var modelPiece = ModelPiece.getLogic(html);
        var model = modelPiece.getModelRoot();
        U.pe(!modelPiece, 'failed to get modelPiece from html:', html);
        var pbar = model.graph.propertyBar;
        // console.log('isEdge ? ', isEdge);
        pbar.show(modelPiece);
        if (isEdge) {
            pbar.styleEditor.showE(modelPiece);
        }
        else {
            pbar.styleEditor.show(modelPiece);
        }
    };
    IVertex.prototype.constructorClass = function (logical) {
        this.classe = logical;
        this.setGraph(logical.getModelRoot().graph);
        var i;
        var fields = [];
        return;
        if (!this.classe || !this.classe.attributes) {
            return;
        }
        U.pe(!this.classe, 'undefined class while creating a vertex from class:', this.classe);
        U.pe(!this.classe.attributes, 'undefined class attributes while creating a vertex from class:', this.classe.attributes, this.classe);
        for (i = 0; i < this.classe.attributes.length; i++) {
            fields.push(new IField(this.classe.attributes[i]));
        }
        this.setFields(fields);
    };
    IVertex.prototype.mark = function (markb, key, color, radiusX, radiusY, width, backColor, extraOffset) {
        if (color === void 0) { color = 'red'; }
        if (radiusX === void 0) { radiusX = 10; }
        if (radiusY === void 0) { radiusY = 10; }
        if (width === void 0) { width = 5; }
        if (backColor === void 0) { backColor = 'none'; }
        if (extraOffset === void 0) { extraOffset = null; }
        if (!this.isDrawn()) {
            return;
        }
        if (color === null) {
            color = 'yellow';
        }
        if (radiusX === null) {
            radiusX = 10;
        }
        if (radiusY === null) {
            radiusY = 10;
        }
        if (backColor === null) {
            backColor = 'none';
        }
        if (width === null) {
            width = 5;
        }
        var mark = this.Vmarks[key];
        // mark off
        if (!markb) { // se non deve essere marchiato
            if (mark) { // ma lo è attualmente
                if (mark.parentNode) {
                    mark.parentNode.removeChild(mark);
                }
                delete this.Vmarks[key];
            }
            return;
        }
        // mark on
        if (!extraOffset) {
            var same = 5;
            extraOffset = new GraphSize(same, same, same, same);
        }
        mark = this.Vmarks[key] = U.newSvg('rect');
        var size = this.getSize();
        // console.log('extraoffset:', extraOffset, 'size:', size);
        size.x -= extraOffset.x;
        size.y -= extraOffset.y;
        size.w += extraOffset.x + extraOffset.w;
        size.h += extraOffset.y + extraOffset.h;
        U.setSvgSize(mark, size);
        /*
        mark.setAttributeNS(null, 'x', '' + size.x);
        mark.setAttributeNS(null, 'y', '' + size.y);
        mark.setAttributeNS(null, 'width', '' + (size.w));
        mark.setAttributeNS(null, 'height', '' + (size.h));*/
        mark.setAttributeNS(null, 'rx', '' + (radiusX));
        mark.setAttributeNS(null, 'ry', '' + (radiusY));
        mark.setAttributeNS(null, 'stroke', '' + (color));
        mark.setAttributeNS(null, 'stroke-width', '' + (width));
        mark.setAttributeNS(null, 'fill', '' + (backColor));
        this.logic().getModelRoot().graph.vertexContainer.prepend(mark);
    };
    IVertex.prototype.getStartPoint = function (nextPt) {
        if (nextPt === void 0) { nextPt = null; }
        return this.getMidPoint(nextPt);
    };
    IVertex.prototype.getEndPoint = function (nextPt) {
        if (nextPt === void 0) { nextPt = null; }
        return this.getMidPoint(nextPt);
    };
    IVertex.prototype.getMidPoint = function (prevPt) {
        if (prevPt === void 0) { prevPt = null; }
        // NB: MAI fare sizeof() di un SVGForeignObjectElement, ridà valori sballati. fallo ai suoi childs.
        var html = this.getHtml();
        var $htmlEP = $(html).find('.EndPoint');
        var htmlEP;
        var endPointSize;
        var pt;
        if ($htmlEP.length === 0) {
            htmlEP = html;
        }
        else {
            htmlEP = $htmlEP[0];
        }
        endPointSize = U.sizeof(htmlEP);
        // console.log('htmlsize:', htmlSize, 'childSize:', U.sizeof(html.firstChild as HTMLElement));
        // console.log('real size(', htmlSize, ') vs graphSize(', this.toGraphCoordS(htmlSize), '), html:', html);
        var endPointGSize = this.owner.toGraphCoordS(endPointSize);
        var vertexGSize = this.getSize();
        pt = endPointGSize.tl();
        pt.x += endPointGSize.w / 2;
        pt.y += endPointGSize.h / 2;
        if (!prevPt) {
            return pt;
        }
        pt = GraphSize.closestIntersection(vertexGSize, prevPt, pt, this.owner.grid);
        U.pe(!U.isOnEdge(pt, vertexGSize), 'not on Vertex edge.');
        return pt;
    };
    IVertex.prototype.setSize = function (size, refreshVertex, refreshEdge) {
        if (refreshVertex === void 0) { refreshVertex = true; }
        if (refreshEdge === void 0) { refreshEdge = true; }
        U.pe(!size, 'setPosition: null');
        var oldSize = this.size.clone();
        this.size = size;
        var htmlForeign = this.getHtmlRawForeign();
        U.setSvgSize(htmlForeign, this.size);
        // todo: cerca tutti gli as string, non è un vero cast ma solo un cambiotipo senza trasformazione, crea errori.
        // const spostamento: GraphPoint = this.size.tl().subtract(oldSize.tl(), true);
        // todo: cambia struttura interna size in tl+br, controlla tutti i riferimenti a tl(newinstnce = false) e considera di cambiarli a true.
        if (refreshVertex) {
            this.refreshGUI();
        }
        if (!refreshEdge) {
            return;
        }
        var refEnd = this.edgesEnd; // this.getReferencesEnd();
        var refStart = this.edgesStart; // this.getReferencesStart();
        var i;
        for (i = 0; i < refEnd.length; i++) {
            if (refEnd[i]) {
                refEnd[i].refreshGui();
            }
        }
        for (i = 0; i < refStart.length; i++) {
            if (refStart[i]) {
                refStart[i].refreshGui();
            }
        }
    };
    IVertex.prototype.draw = function () {
        var html = this.getHtml();
        var htmlRaw = this.classe.getStyle(); // todo: tipizza
        this.drawC(this.classe, htmlRaw);
        this.addEventListeners();
        this.autosize(false, false);
    };
    IVertex.prototype.autosize = function (refreshVertex, refreshEdge, debug) {
        if (refreshVertex === void 0) { refreshVertex = true; }
        if (refreshEdge === void 0) { refreshEdge = true; }
        if (debug === void 0) { debug = false; }
        var html = this.getHtml();
        var autosize = html.dataset.autosize;
        // console.log('autosize() ? ', modelPiece.html, ' dataset.autosize:', autosize);
        if (autosize !== '1' && autosize !== 't' && autosize !== 'true') {
            return this;
        }
        // console.log('autosize() started');
        if (html.style.height !== 'auto') {
            U.pw(true, 'To use autosize the root node must have "height: auto;", this has been automatically solved.');
            html.style.height = 'auto';
        }
        // const zoomLevel: number = DetectZoom.device();
        var actualSize = this.owner.toGraphCoordS(U.sizeof(html));
        // const minSize: GraphSize = new GraphSize(null, null, 200, 30);
        actualSize.min(IVertex.minSize, false);
        U.pe(actualSize.h === 100, '', IVertex.minSize, actualSize, html);
        this.setSize(new GraphSize(this.size.x, this.size.y, actualSize.w, actualSize.h), refreshVertex, refreshEdge);
        return this;
    };
    IVertex.prototype.drawC = function (data, htmlRaw) { return this.drawC0(data, htmlRaw); };
    IVertex.prototype.drawC_OriginalGoodNonDebug = function (data, htmlRaw) {
        try {
            this.drawC0(data, htmlRaw);
        }
        catch (e) {
            var level = void 0;
            if (this.classe.customStyle) {
                level = 1;
            }
            else {
                if (this.classe.metaParent.styleOfInstances) {
                    level = 2;
                }
                else {
                    level = 3;
                }
            }
            U.pw(true, 'Invalid user defined template:' + e.toString() + ', at style level ' + level +
                '. The Higher level template will be loaded instead.', ' HtmlCustomStyle:', htmlRaw);
            switch (level) {
                case 1:
                    data.setStyle_SelfLevel_1(null);
                    break;
                case 2:
                    data.metaParent.setStyle_InstancesLevel_2(null);
                    break;
                case 3:
                    data.setStyle_GlobalLevel_3(null);
                    break;
                default:
                    U.pe(true, 'unexpected level.', this, data, htmlRaw);
                    break;
            }
            this.draw();
        }
        finally { }
    };
    IVertex.prototype.drawC0 = function (data, htmlRaw) {
        // console.log('drawC()');
        U.pe(!this.classe, 'class null?', data, htmlRaw);
        this.setHtmls(data, htmlRaw);
        var htmlForeign = this.htmlForeign;
        var html = this.html;
        /// append childrens:
        var $attContainer = $(html).find('.AttributeContainer');
        var $refContainer = $(html).find('.ReferenceContainer');
        if ($attContainer.length !== 1) {
            throw new Error('there must be exactly one element with class "AttributeContainer".');
        }
        if ($refContainer.length !== 1) {
            throw new Error('there must be exactly one element with class "ReferenceContainer".');
        }
        var attContainer = $attContainer[0];
        var refContainer = $refContainer[0];
        var i;
        for (i = 0; i < data.attributes.length; i++) {
            // console.log('append attr:', data.attributes[i]);
            var attr = this.drawA(data.attributes[i]);
            attContainer.appendChild(attr);
        }
        for (i = 0; i < data.references.length; i++) {
            // console.log('append ref:', data.references[i]);
            var refField = this.drawR(data.references[i]);
            refContainer.appendChild(refField);
        }
    };
    IVertex.prototype.getStartPointHtml = function () {
        var html = this.getHtml();
        var $start = $(html).find('.StartPoint');
        if ($start.length > 0) {
            return $start[0];
        }
        else {
            return html;
        }
    };
    IVertex.prototype.getEndPointHtml = function () {
        var html = this.getHtml();
        var $start = $(html).find('.EndPoint');
        if ($start.length > 0) {
            return $start[0];
        }
        return (html.tagName.toLowerCase() === 'foreignobject') ? html.firstChild : html;
    };
    IVertex.prototype.setHtmls = function (data, htmlRaw) {
        // console.log('drawCV()');
        console.log(this.owner, this);
        var graphHtml = this.owner.vertexContainer;
        if (graphHtml.contains(this.htmlForeign)) {
            graphHtml.removeChild(this.htmlForeign);
        }
        // console.log('drawing Vertex[' + data.name + '] with style:', htmlRaw, 'logic:', data);
        // console.log('drawVertex: template:', htmlRaw);
        var foreign = this.htmlForeign = U.replaceVars(data, htmlRaw, true);
        data.linkToLogic(foreign);
        graphHtml.appendChild(foreign);
        // console.log('this.style:', this.style);
        // console.log('this.size? (' + (!!this.size) + ': setSize() : ', U.getSvgSize(this.style));
        // console.log('drawC_Vertex. size:', this.size, data.html, this.size = U.getSvgSize(data.html as SVGForeignObjectElement));
        if (!this.size) {
            this.size = this.getSize();
        }
        else {
            this.setSize(this.size, false, false);
        }
        foreign.dataset.vertexID = '' + this.id;
        if (this.htmlForeign.childNodes.length !== 1) {
            throw new Error('The custom style must have a single root node.');
        }
        this.html = this.htmlForeign.firstChild;
        return foreign;
    };
    IVertex.prototype.drawA = function (data) {
        var htmlRaw = data.getStyle();
        U.pe(!htmlRaw, 'failed to get attribute style:', data);
        if (data.getModelRoot().isM()) {
            data.replaceVarsSetup();
        }
        // todo: sposta l'opearzione nei Graph.Field
        var html = U.replaceVars(data, htmlRaw, true);
        // console.log('draw Attribute[' + data.midname + '] with style:', htmlRaw, 'logic:', data);
        data.linkToLogic(html);
        return html;
    };
    IVertex.prototype.drawR = function (data) {
        var htmlRaw = data.getStyle();
        var html = U.replaceVars(data, htmlRaw);
        // console.log('draw Reference[' + data.midname + '] with style:', htmlRaw, 'logic:', data);
        data.linkToLogic(html);
        return html;
    };
    IVertex.prototype.toEdge = function (start, end) {
        // todo
        U.pe(true, 'vertexToEdge() todo.');
        return null;
    };
    IVertex.prototype.addEventListeners = function () {
        this.owner.addGraphEventListeners(); // todo: spostalo per efficienza.
        // todo: viene chiamato 1 volta per ogni elementNode con modelID, ma io eseguo tutto dalla radice.
        // quindi viene eseguito N +1 volte per ogni vertice dove N sono i suoi (attributes + references)
        // console.log(html.tagName, html.dataset.modelPieceID);
        // if (html.tagName.toLowerCase() === 'foreignobject' && html.dataset.modelPieceID )
        //   { html = html.firstChild as HTMLElement | SVGElement; }
        // while (!(html.classList.contains('Vertex'))) { console.log(html); html = html.parentNode as HTMLElement | SVGElement; }
        var $html = $(this.getHtmlRawForeign());
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
        $html.off('click.pbar').on('click.pbar', function (e) { IVertex.ChangePropertyBarContentClick(e); });
        // if (!IVertex.contextMenu) { IVertex.contextMenu = new MyContextMenuClass(new ContextMenuService()); }
        $html.off('contextmenu').on('contextmenu', function (evt) {
            DamContextMenuComponent.contextMenu.show(new Point(evt.pageX, evt.pageY), '.Vertex', evt.currentTarget);
            evt.stopPropagation();
            return false;
        });
        $html.find('.Attribute').off('contextmenu').on('contextmenu', function (evt) {
            DamContextMenuComponent.contextMenu.show(new Point(evt.pageX, evt.pageY), '.Feature', evt.currentTarget);
            evt.stopPropagation();
            return false;
        });
        $html.find('.Reference').off('contextmenu').on('contextmenu', function (evt) {
            DamContextMenuComponent.contextMenu.show(new Point(evt.pageX, evt.pageY), '.Feature', evt.currentTarget);
            evt.stopPropagation();
            return false;
        });
        U.eventiDaAggiungereAlBody('setreference');
        // todo: spostalo.
        $(document.body).off('mousemove.setReference').on('mousemove.setReference', function (e) {
            var ref = IEdge.refChanging;
            if (!ref) {
                return;
            }
            var edges = ref.getEdges();
            U.pe(!edges, 'ref.edges === null', ref);
            var edge;
            if (ref.upperbound > 0 && edges.length - 1 >= ref.upperbound) {
                edge = edges[edges.length - 1];
            }
            else {
                edge = new IEdge(ref);
            }
            var html2 = e.target;
            while (html2 && html2.classList && !html2.classList.contains('vertexShell')) {
                html2 = html2.parentNode;
            }
            var hoveringTarget = html2 ? ModelPiece.getLogic(html2) : null;
            U.pe(!(hoveringTarget instanceof IClass), 'hoveringTarget is not a class', hoveringTarget, ', html:', html2);
            if (hoveringTarget) {
                var linkable = ref.canBeLinkedTo(hoveringTarget);
                // todo: vertexmouseleave -> de-mark(key=refhover);
                var size = hoveringTarget.getVertex().getSize();
                var width = 3;
                var pad = 5 + width;
                var padding = new GraphSize(pad, pad, pad, pad);
                hoveringTarget.mark(true, 'refhover', linkable ? 'green' : 'red', (size.w + padding.x + padding.w) / 10, (size.h + padding.y + padding.h) / 10, width, null, padding);
            }
            edge.tmpEnd = GraphPoint.fromEvent(e);
            edge.tmpEndVertex = hoveringTarget ? hoveringTarget.getVertex() : null;
            edge.refreshGui(null, false);
        });
        $('.LinkVertex').off('mousedown.setReference').on('mousedown.setReference', IVertex.linkVertexMouseDown);
        /*const stopMovingReference = (ref: IReference) => {
          if (!ref) { return; }
          IEdge.refChanging = null;
          if (ref.edge) {
            ref.edge.useMidNodes = true;
            ref.edge.useRealEndVertex = true;
            ref.edge.refreshGui(); }
          return; };
        $('.LinkVertex').off('click.setReference').on('click.setReference', (e: ClickEvent) => {
          let ref: IReference = IEdge.refChanging;
          if (ref) { stopMovingReference(ref); return; }
          ref = IEdge.refChanging = ModelPiece.get(e) as IReference;
          if (!IEdge.refChanging.edge) { IEdge.refChanging.generateEdge(); }
          ref.edge.useMidNodes = true;
          ref.edge.useRealEndVertex = true;
          ref.edge.refreshGui();
        });*/
    };
    IVertex.prototype.onMouseDown = function (e) {
        IVertex.selected = this;
        IVertex.selectedStartPt = this.owner.toGraphCoord(new Point(e.pageX, e.pageY));
        IVertex.selectedStartPt.subtract(this.size.tl(), false);
    };
    IVertex.prototype.onMouseUp = function (e) { IVertex.selected = null; };
    IVertex.prototype.onMouseMove = function (e) {
    };
    IVertex.prototype.onMouseEnter = function (e) { };
    IVertex.prototype.onMouseLeave = function (e) { };
    IVertex.prototype.addFieldClick = function (e) {
        U.pe(!(this.classe instanceof M2Class), 'AddFieldClick should only be allowed on M2Classes.');
        var modelPiece = this.classe;
        U.pe(!this.classe, 'called addFieldClick on a package');
        Status.status.debug = true;
        var select;
        // const debugOldJson = U.cloneObj(modelPiece.generateModel());
        var html = this.getHtml();
        select = $(html).find('.addFieldButtonContainer').find('select')[0];
        switch (select.value) {
            default:
                U.pe(true, 'unexpected select value for addField:' + select.value);
                break;
            case 'Reference':
                modelPiece.addReference();
                break;
            case 'Attribute':
                modelPiece.addAttribute();
                break;
        }
        EType.fixPrimitiveTypeSelectors();
        // modelPiece.getModelRoot().refreshGUI();
        // modelPiece.getModelRoot().refreshInstancesGUI();
        // console.log('addFieldClick(); pre:', debugOldJson, ', post:', modelPiece.getJson());
    };
    IVertex.prototype.setFields = function (f) {
        this.fields = f;
    };
    IVertex.prototype.setGraph = function (graph) { this.owner = graph; };
    IVertex.prototype.refreshGUI = function () { this.draw(); };
    IVertex.prototype.moveTo = function (graphPoint, gridIgnore) {
        if (gridIgnore === void 0) { gridIgnore = false; }
        // console.log('moveTo(', graphPoint, '), gridIgnore:', gridIgnore, ', grid:');
        var size = this.size; // U.getSvgSize(this.logic().html as SVGForeignObjectElement);
        if (!gridIgnore) {
            graphPoint = this.owner.fitToGrid(graphPoint);
        }
        this.setSize(new GraphSize(graphPoint.x, graphPoint.y, size.w, size.h), false, true);
    };
    IVertex.prototype.logic = function (set) {
        if (set === void 0) { set = null; }
        if (set) {
            return this.classe = set;
        }
        return this.classe;
    };
    IVertex.prototype.getHtmlRawForeign = function () { return this.htmlForeign; };
    IVertex.prototype.getHtml = function () { return this.html; };
    IVertex.prototype.minimize = function () {
        U.pe(true, 'minimize() to do.');
    };
    IVertex.prototype.isDrawn = function () { return !!(this.htmlForeign && this.htmlForeign.parentNode); };
    IVertex.prototype.pushDown = function () {
        if (!this.isDrawn()) {
            return;
        }
        var html = this.htmlForeign;
        var parent = html.parentNode;
        parent.removeChild(html);
        parent.appendChild(html);
    };
    IVertex.prototype.pushUp = function () {
        if (!this.isDrawn()) {
            return;
        }
        var html = this.htmlForeign;
        var parent = html.parentNode;
        parent.removeChild(html);
        parent.prepend(html);
    };
    IVertex.prototype.remove = function () {
        console.log('IVertex.delete();');
        var i;
        // for (i = 0; i < this.edgesStart.length; i++) {}
        var arr;
        arr = U.ArrayCopy(this.edgesStart, false);
        for (i = 0; i < arr.length; i++) {
            arr[i].remove();
        }
        arr = U.ArrayCopy(this.edgesEnd, false);
        for (i = 0; i < arr.length; i++) {
            arr[i].remove();
        }
        this.edgesStart = [];
        this.edgesEnd = [];
        var html = this.htmlForeign;
        html.parentNode.removeChild(html);
    };
    IVertex.prototype.getSize = function (debug) {
        if (debug === void 0) { debug = false; }
        var html0 = this.htmlForeign;
        var sizeOld;
        if (debug) {
            sizeOld = this.size ? this.size.clone() : null;
            if (this.size) {
                this.owner.markgS(this.size, true, 'blue');
            }
        }
        var size = this.size = U.getSvgSize(html0, IVertex.minSize);
        U.pe(debug && !sizeOld.equals(size), 'Wrong size. this:', this);
        return this.size;
    };
    IVertex.all = {};
    IVertex.ID = 0;
    IVertex.selected = null;
    IVertex.selectedStartPt = null;
    IVertex.refChangingVertex = null;
    IVertex.minSize = new GraphSize(null, null, 200, 30);
    return IVertex;
}());
export { IVertex };
//# sourceMappingURL=iVertex.js.map