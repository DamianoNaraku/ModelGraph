import * as tslib_1 from "tslib";
import { GraphPoint, IVertex, Point, Status, U } from '../../../common/Joiner';
var EdgePointFittizio = /** @class */ (function () {
    function EdgePointFittizio(pos, realPoint) {
        if (realPoint === void 0) { realPoint = null; }
        this.pos = null;
        this.realPoint = null;
        this.pos = pos;
        this.realPoint = realPoint;
    }
    EdgePointFittizio.prototype.link = function (realPoint) { this.realPoint = realPoint; };
    EdgePointFittizio.prototype.getPreviousRealPt = function (fittizi, includeMySelf) {
        if (includeMySelf === void 0) { includeMySelf = true; }
        var index = fittizi.indexOf(this);
        U.pe(index < 0, 'the element must be inside the array. this:', this, ', arr:', fittizi, ', index:', index);
        index += (includeMySelf ? 1 : 0);
        while (--index >= 0) {
            if (fittizi[index].realPoint) {
                return fittizi[index].realPoint;
            }
        }
        return null;
    };
    EdgePointFittizio.prototype.getNextRealPt = function (fittizi, includeMySelf, debug) {
        if (includeMySelf === void 0) { includeMySelf = true; }
        if (debug === void 0) { debug = false; }
        var index = fittizi.indexOf(this);
        U.pe(index < 0, 'the element must be inside the array');
        index -= (includeMySelf ? 1 : 0);
        while (++index < fittizi.length) {
            U.pif(debug, index + '/' + fittizi.length + ']', fittizi[index], 'fittiziAll:', fittizi);
            if (fittizi[index].realPoint) {
                return fittizi[index].realPoint;
            }
        }
        return null;
    };
    return EdgePointFittizio;
}());
export { EdgePointFittizio };
var EdgePoint = /** @class */ (function () {
    function EdgePoint(e, pos, endPointOfVertex) {
        if (endPointOfVertex === void 0) { endPointOfVertex = null; }
        this.id = null;
        this.pos = null;
        this.html = null;
        this.edge = null;
        this.endPointOfVertex = null;
        this.isSelected = null;
        this.isHighlighted = null;
        this.edge = e;
        this.endPointOfVertex = endPointOfVertex;
        // edge = null is ok, è il cursorfollower statico.
        U.pe(this.edge === undefined, 'edge === undefined on EdgePoint constructor.');
        this.html = U.newSvg('circle');
        this.id = EdgePoint.ID++;
        if (e) {
            e.logic.linkToLogic(this.html);
        }
        EdgePoint.all[this.id] = this;
        this.html.dataset.EdgePointID = '' + this.id;
        this.pos = new GraphPoint(0, 0);
        this.isSelected = false;
        this.isHighlighted = false;
        this.refreshGUI();
        this.moveTo(pos, false);
        this.addEventListeners();
    }
    EdgePoint.getFromHtml = function (html) { return EdgePoint.all[html.dataset.EdgePointID]; };
    EdgePoint.prototype.follow = function (e) {
        if (e === void 0) { e = null; }
        CursorFollowerEP.activeEP = this;
        var edge = this.edge;
        if (this !== CursorFollowerEP.cursorFollower && this === edge.endNode) {
            CursorFollowerEP.activeEP = null;
            IVertex.linkVertexMouseDown(e, edge);
        }
    };
    EdgePoint.prototype.unfollow = function () {
        console.log('un-follow');
        CursorFollowerEP.activeEP = null;
    };
    EdgePoint.prototype.addEventListeners = function () {
        var _this = this;
        var $html = $(this.html);
        // $html.off('click.ep').on('click.ep', (e: ClickEvent) => { EdgePoint.getFromHtml(e.currentTarget).onClick(e); });
        $html.off('mousedown.ep').on('mousedown.ep', function (e) { EdgePoint.getFromHtml(e.currentTarget).onMouseDown(e); });
        // $html.off('mousemove.ep').on('mousemove.ep', (e: MouseMoveEvent) => { EdgePoint.getFromHtml(e.currentTarget).onMouseMove(e); });
        $html.off('mouseup.ep').on('mouseup.ep', function (e) { EdgePoint.getFromHtml(e.currentTarget).onMouseUp(e); });
        $html.off('mouseenter.ep').on('mouseenter.ep', function (e) { EdgePoint.getFromHtml(e.currentTarget).onMouseEnter(e); });
        $html.off('mouseleave.ep').on('mouseleave.ep', function (ee) { EdgePoint.getFromHtml(ee.currentTarget).onMouseLeave(ee); });
        // $html.off('mouseover.ep').on('mouseover.ep', (e: MouseLeaveEvent) => { EdgePoint.getFromHtml(e.currentTarget).onMouseOver(e); });
        $html.off('contextmenu.deleteEdgePoint').on('contextmenu.deleteEdgePoint', function (e) { _this.detach(); return false; });
    };
    EdgePoint.prototype.isAttached = function () { return this.edge !== null; };
    EdgePoint.prototype.detach = function (refreshGUI) {
        if (refreshGUI === void 0) { refreshGUI = true; }
        if (!this.isAttached()) {
            return;
        }
        U.arrayRemoveAll(this.edge.midNodes, this);
        if (this.html && this.html.parentNode) {
            this.html.parentNode.removeChild(this.html);
        }
        if (refreshGUI) {
            this.edge.refreshGui();
        }
        this.edge = null;
        this.unfollow();
    };
    EdgePoint.prototype.onClick = function (e) { };
    EdgePoint.prototype.onMouseEnter = function (e) {
        // console.log('enter');
        this.refreshGUI(null, true);
    };
    EdgePoint.prototype.onMouseLeave = function (e) {
        // console.log('leave');
        // if (this.isMoving) { this.onMouseMove(e); }
        this.refreshGUI(null, false);
    };
    EdgePoint.prototype.onMouseDown = function (e) {
        this.refreshGUI(true);
        // console.log('leave');
        this.follow(e);
        e.preventDefault();
        e.stopPropagation();
    };
    // onMouseOver(e: MouseOverEvent): void { e.preventDefault(); e.stopPropagation(); }
    /* onMouseMoveOld(e: MouseMoveEvent | MouseLeaveEvent): void {
      if (!this.isMoving) { return; }
      const screenPt: Point = new Point(e.pageX, e.pageY);
      const graphPt: GraphPoint = this.edge.owner.toGraphCoord(screenPt);
      this.moveTo(graphPt, true); }*/
    EdgePoint.prototype.onMouseUp = function (e) {
        this.refreshGUI(false);
        e.stopPropagation();
        // console.log('up');
        this.unfollow();
    };
    EdgePoint.prototype.getCenter = function (fitHorizontal, fitVertical) {
        if (fitHorizontal === void 0) { fitHorizontal = false; }
        if (fitVertical === void 0) { fitVertical = false; }
        return this.edge.owner.fitToGrid(this.pos, true, false, fitHorizontal, fitVertical);
    };
    EdgePoint.prototype.getStartPoint = function (fitHorizontal, fitVertical) {
        if (fitHorizontal === void 0) { fitHorizontal = true; }
        if (fitVertical === void 0) { fitVertical = true; }
        return this.getCenter(fitHorizontal, fitVertical);
    };
    EdgePoint.prototype.getEndPoint = function (fitHorizontal, fitVertical) {
        if (fitHorizontal === void 0) { fitHorizontal = true; }
        if (fitVertical === void 0) { fitVertical = true; }
        return this.getCenter(fitHorizontal, fitVertical);
    };
    EdgePoint.prototype.moveTo = function (pos, refresh, centra) {
        if (centra === void 0) { centra = true; }
        if (!this.edge) {
            return;
        }
        var r = centra ? 0 : (isNaN(-this.html.r) ? 0 : -this.html.r);
        this.pos.x = (pos.x + r);
        this.pos.y = (pos.y + r);
        this.html.setAttribute('cx', '' + this.pos.x);
        this.html.setAttribute('cy', '' + this.pos.y);
        this.show();
        if (refresh) {
            this.edge.refreshGui();
        }
    };
    EdgePoint.prototype.show = function (debug) {
        if (debug === void 0) { debug = false; }
        var oldParent = this.html.parentNode;
        if (oldParent) {
            oldParent.removeChild(this.html);
        }
        this.edge.shell.appendChild(this.html);
        this.html.style.display = 'block';
        this.refreshGUI(null, null, debug);
    };
    EdgePoint.prototype.hide = function () { this.html.style.display = 'none'; };
    EdgePoint.prototype.refreshGUI = function (select, highlight, debug) {
        if (select === void 0) { select = null; }
        if (highlight === void 0) { highlight = null; }
        if (debug === void 0) { debug = false; }
        if (select !== null) {
            this.isSelected = select;
        }
        if (highlight !== null) {
            this.isHighlighted = highlight;
        }
        if (this.isSelected) {
            this.styleSelected();
        }
        else if (this.isHighlighted) {
            this.styleHighlight();
        }
        else {
            this.styleCommon(debug);
        }
    };
    EdgePoint.prototype.styleCommon = function (debug) {
        if (debug === void 0) { debug = false; }
        if (!this.isAttached()) {
            U.pw(debug, 'not attached', this);
            return;
        }
        var eps = this.edge.logic.edgeStyleCommon.edgePointStyle;
        if (debug) {
            this.html.setAttributeNS(null, 'debug', 'styleCommon');
        }
        this.html.setAttributeNS(null, 'r', '' + eps.radius);
        this.html.setAttributeNS(null, 'stroke-width', '' + eps.strokeWidth);
        this.html.setAttributeNS(null, 'stroke', eps.strokeColor);
        this.html.setAttributeNS(null, 'fill', eps.fillColor);
    };
    EdgePoint.prototype.styleHighlight = function () {
        if (!this.isAttached()) {
            return;
        }
        var eps = this.edge.logic.edgeStyleHighlight.edgePointStyle;
        this.html.setAttributeNS(null, 'r', '' + eps.radius);
        this.html.setAttributeNS(null, 'stroke-width', '' + eps.strokeWidth);
        this.html.setAttributeNS(null, 'stroke', eps.strokeColor);
        this.html.setAttributeNS(null, 'fill', eps.fillColor);
    };
    EdgePoint.prototype.styleSelected = function () {
        if (!this.isAttached()) {
            return;
        }
        var eps = this.edge.logic.edgeStyleSelected.edgePointStyle;
        this.html.setAttributeNS(null, 'r', '' + eps.radius);
        this.html.setAttributeNS(null, 'stroke-width', '' + eps.strokeWidth);
        this.html.setAttributeNS(null, 'stroke', eps.strokeColor);
        this.html.setAttributeNS(null, 'fill', eps.fillColor);
    };
    EdgePoint.ID = 0;
    EdgePoint.all = {};
    return EdgePoint;
}());
export { EdgePoint };
var CursorFollowerEP = /** @class */ (function (_super) {
    tslib_1.__extends(CursorFollowerEP, _super);
    function CursorFollowerEP() {
        var _this = _super.call(this, null, new GraphPoint(0, 0)) || this;
        _this.endPointOfVertex = undefined;
        _this.html.setAttributeNS(null, 'fill', 'purple');
        _this.html.setAttributeNS(null, 'stroke', 'purple');
        _this.html.setAttributeNS(null, 'r', '5');
        U.eventiDaAggiungereAlBody('cursor follower');
        var $b = $(document.body);
        $b.off('mousemove.cursorFollowerEdgePoint_Move').on('mousemove.cursorFollowerEdgePoint_Move', function (e) {
            var debug = false && false;
            U.pif(debug, 'mousemove.cursorFollowerEdgePoint_Move()');
            var f = CursorFollowerEP.activeEP;
            if (!f || !f.isAttached()) {
                return;
            }
            var graph = Status.status.getActiveModel().graph;
            f.moveTo(graph.toGraphCoord(new Point(e.pageX, e.pageY)), true);
            f.edge.refreshGui(true);
            /// here bug edge
        });
        $b.off('click.cursorFollowerEdgePoint_Detach').on('click.cursorFollowerEdgePoint_Detach', function (e) {
            var f = CursorFollowerEP.get();
            f.detach();
        });
        _this.addEventListeners();
        return _this;
    }
    CursorFollowerEP.get = function () {
        if (!this.cursorFollower) {
            this.cursorFollower = new CursorFollowerEP();
        }
        return this.cursorFollower;
    };
    /*
      cursorFollowerClick(e: ClickEvent) {
        const coord: GraphPoint = this.getCenter();
        this.detach();
        const useless = new EdgePoint(this.edge, coord);
        this.attach(this.edge, null);
      }*/
    CursorFollowerEP.prototype.onMouseUp = function (e) { if (this.isAttached()) {
        this.edge.onMouseUp(e);
    } };
    CursorFollowerEP.prototype.moveTo = function (pos, refresh, centra) {
        if (centra === void 0) { centra = true; }
        _super.prototype.moveTo.call(this, pos, refresh, centra);
        if (!this.isAttached()) {
            return;
        }
        if (refresh) {
            this.edge.refreshGui();
        }
    };
    CursorFollowerEP.prototype.isAttached = function () { return this.edge !== null; };
    CursorFollowerEP.prototype.attach = function (edge, position, index) {
        if (index === void 0) { index = Number.POSITIVE_INFINITY; }
        this.detach();
        edge.logic.linkToLogic(this.html);
        this.graph = edge.owner;
        if (index < 0) {
            index = -1;
        }
        if (index === null || index === Number.POSITIVE_INFINITY) {
            index = this.edge.midNodes.length;
        }
        // console.log('CursorFollower.Attach()');
        this.edge = edge;
        this.html.dataset.modelPieceID = '' + this.edge.logic.id;
        U.insertAt(this.edge.midNodes, index + 1, this);
        if (position) {
            this.moveTo(position, false);
        }
        this.graph.container.appendChild(this.html);
        this.follow();
        this.refreshGUI(true);
    };
    CursorFollowerEP.prototype.addEventListeners = function () {
        _super.prototype.addEventListeners.call(this);
        /*$(this.html).off('click.makeEdgePoint').on('click.makeEdgePoint',
          (e: ClickEvent) => { CursorFollowerEP.cursorFollower.cursorFollowerClick(e); });*/
        $(this.html).off('mouseup.makeEdgePoint').on('mouseup.makeEdgePoint', function (e) { CursorFollowerEP.get().onMouseUp(e); });
    };
    CursorFollowerEP.cursorFollower = null;
    CursorFollowerEP.activeEP = null;
    return CursorFollowerEP;
}(EdgePoint));
export { CursorFollowerEP };
//# sourceMappingURL=EdgePoint.js.map