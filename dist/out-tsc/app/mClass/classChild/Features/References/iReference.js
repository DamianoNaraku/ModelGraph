import * as tslib_1 from "tslib";
import { EdgeModes, EdgePointStyle, EdgeStyle, IFeature, M2Reference, MReference, U } from '../../../../common/Joiner';
var IReference = /** @class */ (function (_super) {
    tslib_1.__extends(IReference, _super);
    function IReference(parent, meta) {
        var _this = _super.call(this, parent, meta) || this;
        _this.edges = [];
        if (parent)
            parent.references.push(_this);
        _this.edgeStyleCommon = new EdgeStyle(EdgeModes.straight, 2, '#ffffff', new EdgePointStyle(5, 2, '#ffffff', '#000000'));
        _this.edgeStyleHighlight = new EdgeStyle(EdgeModes.straight, 4, '#ffffff', new EdgePointStyle(5, 2, '#ffffff', '#0077ff'));
        _this.edgeStyleSelected = new EdgeStyle(EdgeModes.straight, 4, '#ffffff', // #ffbb22
        new EdgePointStyle(5, 2, '#ffffff', '#ff0000'));
        return _this;
    }
    IReference.prototype.clearTargets = function () {
        var i;
        var thiss = this instanceof MReference ? this : null;
        for (i = 0; thiss && i < thiss.mtarget.length; i++) {
            U.arrayRemoveAll(thiss.mtarget[i].referencesIN, thiss);
        }
        for (i = 0; i < this.edges.length; i++) {
            if (this.edges[i])
                this.edges[i].remove();
        }
        if (thiss)
            thiss.mtarget = new Array(this.metaParent.upperbound);
        this.edges = new Array(this.metaParent.upperbound);
    };
    IReference.prototype.delete = function (linkStart, linkEnd) {
        if (linkStart === void 0) { linkStart = null; }
        if (linkEnd === void 0) { linkEnd = null; }
        if (linkStart === null && linkEnd === null) {
            _super.prototype.delete.call(this);
            linkStart = 0;
            linkEnd = this.edges.length;
        }
        var edges = U.ArrayCopy(this.getEdges(), false);
        var i;
        linkEnd = Math.min(edges.length, linkEnd);
        linkStart = Math.max(0, linkStart);
        for (i = linkStart; i < linkEnd; i++) {
            edges[i].remove();
        }
    };
    // abstract linkClass(classe?: IClass): void;
    IReference.prototype.getEdges = function () { return this.edges; };
    IReference.prototype.refreshGUI_Alone = function (debug) {
        if (debug === void 0) { debug = true; }
        _super.prototype.refreshGUI_Alone.call(this, debug);
        var i = -1;
        var edges = this.getEdges();
        while (++i < edges.length) {
            if (edges[i]) {
                edges[i].refreshGui();
            }
        }
    };
    IReference.prototype.copy = function (r, nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        while (this.edges.length) {
            if (this.edges[0])
                this.edges[0].remove();
        }
        _super.prototype.copy.call(this, r, nameAppend, newParent);
        this.clearTargets();
        _super.prototype.copy.call(this, r, nameAppend, newParent);
        this.generateEdges();
        this.edgeStyleCommon = r.edgeStyleCommon.clone();
        this.edgeStyleHighlight = r.edgeStyleHighlight.clone();
        this.edgeStyleSelected = r.edgeStyleSelected.clone();
        // this.typeClassFullnameStr = r.typeClassFullnameStr;
        if (newParent) {
            U.ArrayAdd(newParent.references, this);
        }
        this.refreshGUI();
        return this;
    };
    /*
      getStartPoint(nextPt: GraphPoint = null, fixOnSides: boolean = true): GraphPoint {
        let html: HTMLElement | SVGElement = this.getField().getHtml();
        // todo: introduzione field con campo html.
        if ( this.html && this.html.style.display !== 'none') {
          html = this.getStartPointHtml();
        } else { html = this.parent.getStartPointHtml(); }
        const vertexSize: GraphSize = this.graph().toGraphCoordS(U.sizeof(this.parent.html.firstChild as HTMLElement | SVGElement ));
        let htmlSize: Size = U.sizeof(html);
        let size: GraphSize = this.getModelRoot().graph.toGraphCoordS(htmlSize);
        if ( size.w === 0 || size.h === 0) {
          html = this.parent.getEndPointHtml();
          htmlSize = U.sizeof(html);
          size = this.getModelRoot().graph.toGraphCoordS(htmlSize); }
    
        let ep: GraphPoint = new GraphPoint(size.x + size.w / 2, size.y + size.h / 2);
        // console.log('sizeH:', htmlSize, 'sizeg:', size, ' center: ', ep);
        // this.getModelRoot().graph.markS(htmlSize, false, 'green');
        // this.getModelRoot().graph.markS(htmlSize, false, 'green');
        // ora è corretto, ma va fissato sul bordo vertex più vicino
        let fixOnHorizontalSides = false;
        const oldEpDebug = new GraphPoint(ep.x, ep.y);
        let vicinanzaL;
        let vicinanzaR;
        let vicinanzaT;
        let vicinanzaB;
        if (!nextPt) {
          vicinanzaL = Math.abs(ep.x - (vertexSize.x));
          vicinanzaR = Math.abs(ep.x - (vertexSize.x + vertexSize.w));
          vicinanzaT = Math.abs(ep.y - (vertexSize.y)) + (fixOnHorizontalSides ? Number.POSITIVE_INFINITY : 0);
          vicinanzaB = Math.abs(ep.y - (vertexSize.y + vertexSize.h)) + (fixOnHorizontalSides ? Number.POSITIVE_INFINITY : 0);
          const nearest = Math.min(vicinanzaL, vicinanzaT, vicinanzaR, vicinanzaB);
          // console.log('vicinanze (LRTB)', vicinanzaL, vicinanzaR, vicinanzaT, vicinanzaB, 'vSize: ', vertexSize);
          if ( nearest === vicinanzaT || (false && nextPt.x >= vertexSize.x && nextPt.x <= vertexSize.x + vertexSize.w && nextPt.y < ep.y)) {
            ep.y = vertexSize.y; } else
          if ( nearest === vicinanzaB || (false && nextPt.x >= vertexSize.x && nextPt.x <= vertexSize.x + vertexSize.w && nextPt.y > ep.y)) {
            ep.y = vertexSize.y + vertexSize.h; } else
          if ( nearest === vicinanzaR || (false && nextPt.x >= ep.x)) { ep.x = vertexSize.x + vertexSize.w; } else
          if ( nearest === vicinanzaL) { ep.x = vertexSize.x; }
          console.log('html:', html);
        } else {
          const grid = this.getModelRoot().graph.grid;
          ep = GraphSize.closestIntersection(vertexSize, nextPt, ep, grid); }
        // console.log('StartPoint fissato sul bordo:', oldEpDebug, '-->', ep);
        // return this.parent.vertex.owner.fitToGrid(ep);
        // if (fixOnSides && nextPt) { if (nextPt.x > ep.x) { ep.x += size.w / 2; } else { ep.x -= size.w / 2; }  }
        return ep; // meglio se svincolato dalla grid: il vertica può essere di width ~ height non conforme alla grid e il punto risultare fuori
      }
    */
    IReference.prototype.setDefaultStyle = function (value) {
        U.pw(true, 'IReference.setDefaultStyle(): todo.');
    };
    IReference.prototype.isContainment = function () {
        if (this instanceof M2Reference) {
            return this.containment;
        }
        if (this instanceof MReference) {
            return this.metaParent.containment;
        }
        U.pe(true, 'unrecognized class.');
    };
    /*getM2Target(): M2Class {
      if (this instanceof M2Reference) { return this.classType; }
      if (this instanceof MReference) { return this.metaParent.classType; }
      U.pe(true, 'unrecognized class.'); }*/
    IReference.prototype.getUpperbound = function () {
        if (this instanceof M2Reference) {
            return this.upperbound;
        }
        if (this instanceof MReference) {
            return this.metaParent.upperbound;
        }
        U.pe(true, 'unrecognized class.');
    };
    IReference.prototype.getLowerbound = function () {
        if (this instanceof M2Reference) {
            return this.lowerbound;
        }
        if (this instanceof MReference) {
            return this.metaParent.lowerbound;
        }
        U.pe(true, 'unrecognized class.');
    };
    return IReference;
}(IFeature));
export { IReference };
var M3Reference = /** @class */ (function (_super) {
    tslib_1.__extends(M3Reference, _super);
    function M3Reference(parent, meta) {
        if (meta === void 0) { meta = null; }
        var _this = _super.call(this, parent, meta) || this;
        _this.parse(null);
        return _this;
    }
    M3Reference.prototype.canBeLinkedTo = function (hoveringTarget) { U.pe(true, 'Invalid operation: m3Reference.canBeLinkedTo()'); return true; };
    //conformability(meta: IReference, debug?: boolean): number { U.pe(true, 'Invalid operation: m3Reference.comformability()'); return 0; }
    M3Reference.prototype.duplicate = function (nameAppend, newParent) { U.pe(true, 'Invalid operation: m3Reference.duplicate()'); return this; };
    M3Reference.prototype.generateEdges = function () { U.pe(true, 'Invalid operation: m3Reference.generateEdges()'); return []; };
    M3Reference.prototype.generateModel = function () { U.pe(true, 'Invalid operation: m3Reference.generateModel()'); return {}; };
    M3Reference.prototype.parse = function (json, destructive) { this.name = 'Reference'; };
    M3Reference.prototype.linkClass = function (classe) {
        if (classe === void 0) { classe = null; }
        U.pe(true, 'Invalid operation: M3Reference.linkClass();');
    };
    return M3Reference;
}(IReference));
export { M3Reference };
//# sourceMappingURL=iReference.js.map