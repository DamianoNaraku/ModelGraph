import {
  Json,
  U,
  IVertex, EdgePoint, IField,
  IPackage,
  IClass,
  IAttribute,
  AttribETypes,
  IFeature,
  ModelPiece,
  ISidebar,
  IGraph,
  IModel,
  Status, IReference,
  Point, GraphPoint, Size, GraphSize, EdgeStyle, PropertyBarr, Dictionary
} from '../../common/Joiner';
import ClickEvent = JQuery.ClickEvent;
import MouseDownEvent = JQuery.MouseDownEvent;
import MouseUpEvent = JQuery.MouseUpEvent;
import MouseMoveEvent = JQuery.MouseMoveEvent;
import {CursorFollowerEP, EdgePointFittizio} from './EdgePoint';
import MouseOverEvent = JQuery.MouseOverEvent;
import MouseEnterEvent = JQuery.MouseEnterEvent;
import MouseLeaveEvent = JQuery.MouseLeaveEvent;
import htmlString = JQuery.htmlString;
export enum EdgeModes {
  straight = 'straight',
  angular2 = 'angular con 2 segmenti.',
  angular3 = 'angular con 3 segmenti (un break centrale)',
  angular23Auto = 'angular 2 o angular 3 automatico'}
export class IEdge {
  static selecteds: IEdge[] = [];
  static all: IEdge[] = IEdge.staticInit();
  private static shadowWidthIncrease = 7;
  static refChanging: IReference;
  static idToEdge: Dictionary<number, IEdge> = {};
  static edgeCount: number = 0;
  // private static tempMidPoint_Clicked: GraphPoint = null;
  // private static tempMidPoint_ModelPiece: ModelPiece = null;
  owner: IGraph = null;
  start: IVertex = null;
  end: IVertex = null;
  midNodes: EdgePoint[] = null;
  startNode: EdgePoint;
  endNode: EdgePoint;
  shell: SVGGElement = null;
  html: SVGPathElement = null;
  shadow: SVGPathElement = null;
  logic: IClass | IReference = null;
  isSelected: boolean = null;
  isHighlighted: boolean = null;
  mode: EdgeModes = null;
  edgeHead: SVGSVGElement = null;
  edgeTail: SVGSVGElement = null;
  tmpEnd: GraphPoint = null;
  tmpEndVertex: IVertex = null;
  useMidNodes: boolean = true;
  useRealEndVertex: boolean = true;
  id: number = null;
  static staticInit(): IEdge[] {
    IEdge.all = [];
    IEdge.selecteds = [];
    // todo: prevent propagation on click on edges.
    U.eventiDaAggiungereAlBody('trigger onBlur of all IEdge.selecteds.');
    $(document.body).off('click.blurEdgeSelection').on('click.blurEdgeSelection',
      (ee: ClickEvent) => {
        const debug = false;
        U.pif(debug, 'body.click(): clear All Edge Selections');
        let i = -1;
        while (++i < IEdge.selecteds.length) { IEdge.selecteds[i].onBlur(); }
        U.pif(debug, 'graph clicked:', ee);
        const modelPieceClicked: ModelPiece = ModelPiece.get(ee);
        const edgeClicked: IEdge = IEdge.get(ee);
        U.pif(debug, 'modelPieceClicked ? ', modelPieceClicked);
        if (!modelPieceClicked) { return; }
        const htmlClicked = ee.target;
        let parent: HTMLElement = htmlClicked;
        while (parent && parent.classList && !parent.classList.contains('EdgeShell')) { parent = parent.parentNode as HTMLElement; }
        // const edgeClicked: IEdge = (parent && parent.classList) ? edge : null;
        U.pif(debug, 'edgeClicked ? ', edgeClicked);
        if (!edgeClicked) { return; }
        edgeClicked.onClick(ee);
      });
    return []; }

  static get(e: ClickEvent | MouseMoveEvent | MouseDownEvent | MouseUpEvent | MouseLeaveEvent | MouseEnterEvent | MouseEvent): IEdge {
    // return ModelPiece.getLogic(e.target).edge;
    return IEdge.getByHtml(e.target);
  }
  static getByHtml(html0: HTMLElement | SVGElement): IEdge {
    const debug = false;
    if (!html0) { return null; }
    let html = html0;
    while ( html && (!html.dataset || !html.dataset.modelPieceID)) { html = html.parentNode as HTMLElement | SVGElement; }
    const ret = html ? IEdge.getByID(+html.dataset.edgeid) : null;
    U.pif(debug && !ret, 'failed to find edge. html0:', html0, 'html:', html, 'map:', IEdge.idToEdge);
    return ret; }

  static getByID(id: number): IEdge { return IEdge.idToEdge[id]; }

  constructor(logic: IClass | IReference, start: IVertex = null, end: IVertex = null) {
    if (!start) { start = (logic instanceof IClass ? (logic as IClass).getVertex() : (logic as IReference).vertex); }
    U.pe(!start, 'startVertex missing');
    U.pe(!logic || !start, 'new Edge() invalid parameters. logic:', logic, 'start:', start, 'end:', end);
    IEdge.all.push(this);
    this.id = IEdge.edgeCount++;
    IEdge.idToEdge[this.id] = this;
    this.logic = logic;
    this.logic.edges.push(this);
    this.shell = document.createElementNS('http://www.w3.org/2000/svg', 'g'); // U.newSvg<SVGGElement>('g');
    this.html = document.createElementNS('http://www.w3.org/2000/svg', 'path'); // U.newSvg<SVGPathElement>('Path');
    this.shadow = U.newSvg<SVGPathElement>('path');
    this.shadow.dataset.edgeid = this.shell.dataset.edgeid = this.html.dataset.edgeid = '' + this.id;
    this.start = start;
    start.edgesStart.push(this);
    this.setTarget(end);
    this.startNode = new EdgePoint(this, new GraphPoint(0, 0), this.start);
    this.midNodes = [];
    this.endNode = new EdgePoint(this, new GraphPoint(0, 0), this.end);
    this.owner = start.owner;
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
    this.shadow.classList.add('Edge');
    this.shell.dataset.modelPieceID = '' + this.logic.id;
    this.html.dataset.modelPieceID = '' + this.logic.id;
    this.shadow.dataset.modelPieceID = '' + this.logic.id;
    this.html.setAttribute('fill', 'none');
    this.shadow.setAttribute('fill', 'none');
    this.shadow.setAttribute('stroke', 'none');
    this.shadow.setAttribute('visibility', 'hidden');
    this.shadow.setAttribute('pointer-events', 'stroke');
    this.refreshGui(); }
  static generateAggregationHead( fill: string = 'black', stroke: string = 'white', strokeWidth: number = 20): SVGSVGElement {
    // https://jsfiddle.net/Naraku/3hngkrc1/
    const svg: SVGSVGElement = U.newSvg<SVGSVGElement>('svg');
    const path: SVGPathElement = U.newSvg<SVGPathElement>('path');
    svg.setAttributeNS(null, 'width', '20');
    svg.setAttributeNS(null, 'height', '20');
    svg.setAttributeNS(null, 'viewBox',
      (-strokeWidth) + ' ' + (-strokeWidth) + ' ' + (200 + strokeWidth * 2) + ' ' +  (200 + strokeWidth * 2));
    path.setAttributeNS(null, 'fill', fill);
    path.setAttributeNS(null, 'stroke', stroke);
    path.setAttributeNS(null, 'stroke-width', '' + strokeWidth);
    path.setAttributeNS(null, 'd', 'M100 0 L200 100 L100 200 L0 100 Z');
    svg.appendChild(path);
    return svg; }
  static generateContainmentHead(): SVGSVGElement {
    const svg = IEdge.generateAggregationHead('white');
    return svg; }


  private static makePathSegment(prevPt: GraphPoint, nextPt: GraphPoint, mode: EdgeModes, angularFavDirectionIsHorizontal: boolean = null,
                                 prevVertexSize: GraphSize, nextVertexSize: GraphSize, type: string = ' L', debug = false): string {
    // todo: devi rifare totalmente la parte di "angularFavDirection" basandoti su se cade perpendicolare sul vertice e devi usare
    // 2 variabili, forzando la direzione ad essere per forza perpendicolare sul lato su cui risiede il vertex.startPt o .endPt
    // poi: se le direzioni forzate coincidono, allora è un angular3, se sono vertical+horizontal, allora è un angular2.
    // nb: in prevVertexSize e nextVertexSize la favDirection viene calcolata uguale, ma l'assenamento prevVertexSize = nextVertexSize;
    // poi deve sparire perchè devo generare 2 diverse favDirection e non una sola.
    let m;
    let pathStr = '';
    const pt1IsOnHorizontalSide = U.isOnHorizontalEdges(prevPt, prevVertexSize);
    const pt2IsOnHorizontalSide = U.isOnHorizontalEdges(nextPt, nextVertexSize);
    if (mode === EdgeModes.angular23Auto && prevVertexSize && nextVertexSize) {
      if (!U.isOnEdge(prevPt, prevVertexSize) || !U.isOnEdge(nextPt, nextVertexSize)) {
        console.clear();
        const g = Status.status.getActiveModel().graph;
        /*g.markg(prevPt, false, 'green');
        g.markgS(prevVertexSize, false, 'green');
        g.markg(prevPt, false);
        g.markgS(prevVertexSize, false);*/
        console.log('not on vertex border. pt:', prevPt, 'vertex:', prevVertexSize);
        console.log('not on vertex border. nextpt:', nextPt, 'nextvertex:', nextVertexSize);
        // U.pw(true, (!U.isOnEdge(prevPt, prevVertexSize) ? 'prev' : 'next') + ' not on vertex border.');
        return '';
      }
      console.log('directions:', pt1IsOnHorizontalSide, pt2IsOnHorizontalSide);
      mode = (pt1IsOnHorizontalSide && pt2IsOnHorizontalSide) ? EdgeModes.angular3 : EdgeModes.angular2;
    }
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
    } */   /* compute last favorite direction * /
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
    let oldPathStr = pathStr;
    switch (mode) {
      default: U.pe(true, 'unexpected EdgeMode:', mode); break;
      case EdgeModes.angular2:
        m = GraphPoint.getM(prevPt, nextPt); // coefficiente angolare della prossima linea disegnata (come se fosse dritta)
        if (angularFavDirectionIsHorizontal === null) { angularFavDirectionIsHorizontal = Math.abs(m) <= 1; } // angolo <= abs(45°)
        if (angularFavDirectionIsHorizontal) {
          // todo: e qui dovrei appendere un path invisibile che cambia cursore in HorizontalResizer intercettare gli eventi edge.
          oldPathStr = pathStr;
          pathStr += type + (nextPt.x) + ' ' + (prevPt.y);
          U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; ang2 favdirectionHorizontal');
        } else {
          // todo: qui resizer verticale.
          oldPathStr = pathStr;
          pathStr += type + (prevPt.x) + ' ' + (nextPt.y);
          U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; ang2 favdirectionVertical');
        }
        // todo: qui resizer opposto al precedente.
        // oldPathStr = pathStr;
        // pathStr += type + (nextPt.x) + ' ' + (nextPt.y);
        // U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; ang2 end ridondante?');
        break;
      case EdgeModes.angular23Auto + '': break;
      case EdgeModes.angular3:
        m = GraphPoint.getM(prevPt, nextPt); // coefficiente angolare della prossima linea disegnata (come se fosse dritta)
        if (angularFavDirectionIsHorizontal === null) { angularFavDirectionIsHorizontal = Math.abs(m) <= 1; } // angolo <= abs(45°)
        if (angularFavDirectionIsHorizontal) {
          const midX = (nextPt.x + prevPt.x) / 2;
          // todo: e qui dovrei appendere un path invisibile che cambia cursore in HorizontalResizer intercettare gli eventi edge.
          oldPathStr = pathStr;
          pathStr += type + (midX) + ' ' + (prevPt.y);
          U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; angular3 orizzontale: orizzontale big');
          // qui invece uno piccolino verticale
          oldPathStr = pathStr;
          pathStr += type + (midX) + ' ' + (nextPt.y);
          U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; angular3 orizzontale: verticale small');
        } else {
          const midY = (nextPt.y + prevPt.y) / 2;
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
    return pathStr; }
  /*private static midPointMouseDown(e: JQuery.MouseDownEvent) {
    IEdge.tempMidPoint_ModelPiece = ModelPiece.getLogic(e.currentTarget);
    IEdge.tempMidPoint_Clicked = Status.status.getActiveModel().graph.toGraphCoord( new Point(e.pageX, e.pageY) );
  }*//*
  private static midPointMouseMove(e: JQuery.MouseMoveEvent) {
    const p: GraphPoint = Status.status.getActiveModel().graph.toGraphCoord( new Point(e.pageX, e.pageY) );

  }
  private static midPointMouseUp(e: JQuery.MouseUpEvent) { }*/

  refreshGui(debug: boolean = false, useRealEndVertex: boolean = null, usemidnodes: boolean = null) {
    if (debug === null) { debug = false; }
    if (useRealEndVertex === null) { useRealEndVertex = this.useRealEndVertex; }
    if (usemidnodes === null) { usemidnodes = this.useMidNodes; }
    /* setup variables */
    if (!this.logic.edgeStyleCommon.style) { this.logic.edgeStyleCommon.style = EdgeModes.straight; }
    this.mode = this.logic.edgeStyleCommon.style;
    const startVertex: IVertex = this.start;
    const startVertexSize: GraphSize = this.start.getSize();
    let endVertex: IVertex = null;
    let endVertexSize: GraphSize = null;
    let allRealPt: EdgePoint[] = this.getAllRealMidPoints();
    if (!usemidnodes) { allRealPt = [allRealPt[0], allRealPt[allRealPt.length - 1]]; }
    if (useRealEndVertex) {
      endVertex = this.end;
      endVertexSize = endVertex.getSize();
      this.startNode.moveTo(startVertex.getStartPoint(allRealPt[1].getEndPoint()), false);
      this.endNode.moveTo(endVertex.getEndPoint(allRealPt[allRealPt.length - 2].getStartPoint()), false);
    } else {
      endVertex = this.tmpEndVertex;
      endVertexSize = endVertex ? endVertex.getSize() : null;
      this.startNode.moveTo(startVertex.getStartPoint(allRealPt[1].getEndPoint()), false);
      this.endNode.moveTo(endVertex ? endVertex.getEndPoint(allRealPt[allRealPt.length - 2].getStartPoint()) : this.tmpEnd, false);
    }
    U.pif(debug, 'allRealPt:', allRealPt);
    let i;
    let pathStr = 'M' + (allRealPt[0].getStartPoint().x) + ' ' + (allRealPt[0].getStartPoint().y);
    let oldpathStr = pathStr;
    const graph: IGraph = this.logic.getModelRoot().graph;
    for (i = 1; i < allRealPt.length; i++) { // escludo il primo punto dal loop.
      const ep: EdgePoint = allRealPt[i];
      const prev: EdgePoint = allRealPt[i - 1];
      const favdirection: boolean = null; // i === allRealPt.length - 1 ? lastdirectionIsHorizontal : null;
      const prevVertexSize: GraphSize = i === 1 ? startVertexSize : null;
      const nextVertexSize: GraphSize = i === allRealPt.length - 1 ? endVertexSize : null;
      oldpathStr = pathStr;
      const pt1: GraphPoint = graph.fitToGrid(prev.getStartPoint(), true);
      const pt2: GraphPoint = graph.fitToGrid(ep.getEndPoint(), true);
      if (debug) {
        graph.markg(pt1, true, 'green');
        graph.markg(pt2, false, 'green');
        graph.markgS(prevVertexSize, false, 'blue');
        graph.markgS(nextVertexSize, false); }
      // if (i === 1) { pt1.moveOnNearestBorder(startVertexSize, false); }
      // if (i === allRealPt.length - 1) { pt2.moveOnNearestBorder(endVertexSize, false); }
      pathStr += IEdge.makePathSegment(pt1, pt2, this.mode, favdirection, prevVertexSize, nextVertexSize);
      U.pif(debug, 'pathStr[' + (i) + '/' + allRealPt.length + ']: ' + oldpathStr + ' --> ' + pathStr);
    }

    this.setPath(pathStr, debug);
    this.addEventListeners();
  }

  private setPath(pathStr: string, debug: boolean = false): void {
    let style: EdgeStyle = null;
    if (this.isHighlighted) {
      style = this.logic.edgeStyleHighlight;
    } else if (this.isSelected) {
      style = this.logic.edgeStyleSelected;
    } else { style = this.logic.edgeStyleCommon; }
    /* update style */
    this.html.setAttribute('stroke', style.color);
    this.html.setAttribute('stroke-width', '' + style.width);
    this.shadow.setAttribute('stroke-width', '' + (style.width + IEdge.shadowWidthIncrease));
    U.clear(this.shell);
    this.shell.appendChild(this.html);
    this.shell.appendChild(this.shadow);
    this.edgeHead = this.getEdgeHead();
    this.edgeTail = this.getEdgeTail();
    U.pif(debug, 'edgeHead:', this.edgeHead, 'tail:', this.edgeTail);
    this.html.setAttributeNS(null, 'd', pathStr);
    this.shadow.setAttributeNS(null, 'd', pathStr);

    if (this.edgeHead) {
      this.edgeHead.classList.add('Edge');
      this.shell.appendChild(this.edgeHead); }
    if (this.edgeTail) {
      this.edgeTail.classList.add('Edge');
      this.shell.appendChild(this.edgeTail); }
    if (this.edgeHead) {
      const Lpos = pathStr.indexOf('L');
      const firstStr = pathStr.substr(1, Lpos);
      let x: number = parseFloat(firstStr);
      let y: number = parseFloat(firstStr.substr(firstStr.indexOf(' ')));
      const firstPt: GraphPoint = new GraphPoint(x, y);
      const secondStr = pathStr.substr(Lpos + 1);
      x = parseFloat(secondStr);
      y = parseFloat(secondStr.substr(secondStr.indexOf(' ')));
      const secondPt: GraphPoint = new GraphPoint(x, y); // fittizio
      const m = GraphPoint.getM(firstPt, secondPt);
      const HeadSize: GraphSize = U.getSvgSize(this.edgeHead);
      // const HeadSize: GraphSize = this.owner.toGraphCoordS(U.sizeof(this.edgeHead));
      U.pif(debug, 'size of head: ', HeadSize);
      U.pif(debug, 'str1:', firstStr, 'str2:', secondStr, 'pt1:', firstPt, 'pt2:', secondPt, 'm:', m);
      if (m === Number.POSITIVE_INFINITY) { // link hit on top
        (this.edgeHead).setAttributeNS(null, 'x', '' + (firstPt.x - HeadSize.w / 2));
        (this.edgeHead).setAttributeNS(null, 'y', '' + (firstPt.y - HeadSize.h)); }
      if (m === Number.NEGATIVE_INFINITY) { // link hit on bot
        (this.edgeHead).setAttributeNS(null, 'y', '' + (firstPt.y));
        (this.edgeHead).setAttributeNS(null, 'x', '' + (firstPt.x - HeadSize.w / 2)); }
      if ((Object['is' + ''] && Object['is' + ''](m, +0)) || (1 / m === Number.POSITIVE_INFINITY)) { // link hit on left
        (this.edgeHead).setAttributeNS(null, 'y', '' + (firstPt.y - HeadSize.h / 2));
        (this.edgeHead).setAttributeNS(null, 'x', '' + (firstPt.x - HeadSize.w));
      }
      if ((Object['is' + ''] && Object['is' + ''](m, -0)) || (1 / m === Number.NEGATIVE_INFINITY)) { // link hit on right
        (this.edgeHead).setAttributeNS(null, 'y', '' + (firstPt.y - HeadSize.h / 2));
        (this.edgeHead).setAttributeNS(null, 'x', '' + (firstPt.x));

      }
    }
    let i: number;
    if (this.isSelected) {
      this.startNode.show();
      for (i = 0; i < this.midNodes.length; i++) { this.midNodes[i].show(); }
      this.endNode.show(); } else
    if (this.isHighlighted) {
      this.startNode.hide();
      for (i = 0; i < this.midNodes.length; i++) { this.midNodes[i].show(); }
      this.endNode.hide();
    } else {
      this.startNode.hide();
      for (i = 0; i < this.midNodes.length; i++) { this.midNodes[i].hide(); }
      this.endNode.hide();
    }
  }

  addEventListeners(): void {
    const $html = $(this.shell);
    $html.off('click.pbar').on('click.pbar', (e: ClickEvent) => IVertex.ChangePropertyBarContentClick(e, true) );
    /*$html.off('mousedown.showStyle').on('mousedown.showStyle',
      (e: MouseDownEvent) => { Status.status.getActiveModel().graph.propertyBar.styleEditor.showE(this.logic); });*/
    $html.off('mousedown.startSetMidPoint').on('mousedown.startSetMidPoint',
      (e: MouseDownEvent) => {
        // const mp: IClass | IReference = ModelPiece.getLogic(e.currentTarget) as IClass | IReference;
        // U.pe( mp === null || mp === undefined, 'unable to get logic of:', e.currentTarget);
        const edge: IEdge = IEdge.get(e);
        U.pe( !e , 'unable to get edge of:', e.currentTarget);
        edge.onMouseDown(e); } );
    $html.off('mousemove.startSetMidPoint').on('mousemove.startSetMidPoint',
      (e: MouseMoveEvent) => {
        // const mp: IClass | IReference = ModelPiece.getLogic(e.currentTarget) as IClass | IReference;
        // U.pe( mp === null || mp === undefined, 'unable to get logic of:', e.currentTarget);
        const edge: IEdge = IEdge.get(e);
        U.pe( !e , 'unable to get edge of:', e.currentTarget);
        edge.onMouseMove(e); } );
    $html.off('click.addEdgePoint').on('click.addEdgePoint', (e: ClickEvent) => { IEdge.get(e).onClick(e); });
    $html.find('.Edge').off('mouseover.cursor').on('mouseover.cursor', (e: MouseOverEvent) => { IEdge.get(e).onMouseOver(e); });
    $html.find('.Edge').off('mouseenter.cursor').on('mouseenter.cursor', (e: MouseEnterEvent) => { IEdge.get(e).onMouseEnter(e); });
    $html.find('.Edge').off('mouseleave.cursor').on('mouseleave.cursor', (e: MouseLeaveEvent) => { IEdge.get(e).onMouseLeave(e); });

  }
  onBlur() {
    this.isSelected = false;
    this.html.classList.remove('selected_debug');
    U.arrayRemoveAll(IEdge.selecteds, this);
    let i;
    for (i = 0; i < this.midNodes; i++) { this.midNodes[i].hide(); }
    this.refreshGui(); }

  getAllRealMidPoints(): EdgePoint[] {
    const allNodes: EdgePoint[] =  [];
    allNodes.push(this.startNode);
    let i = 0;
    while (i < this.midNodes.length) { allNodes.push(this.midNodes[i++]); }
    allNodes.push(this.endNode);
    return allNodes; }

  getAllFakePoints(debug: boolean = false): EdgePointFittizio[] {
    // if (!this.html) { return null; }
    const d = this.html.getAttributeNS(null, 'd');
    const dArr: string[] = d.split('L');
    let i;
    const allNodes: EdgePoint[] = this.getAllRealMidPoints();
    const nodiFittizi: EdgePointFittizio[] = [];
    let realNodeIndex = 0;
    let puntiReali = 0;
    for (i = 0; i < dArr.length; i++) {
      const tmp = dArr[i].replace('M', '').replace('L', '').trim().split(' ');
      const pt: GraphPoint = new GraphPoint(+tmp[0], +tmp[1]);
      let target: EdgePoint = null;
      U.pif(debug, 'getAllFakePoints() d:', d, 'pt', pt, 'allnodes:', allNodes, 'index:', realNodeIndex, 'match?',
        realNodeIndex >= allNodes.length ? 'overflow' : allNodes[realNodeIndex].pos.equals(pt));
      if (this.owner.fitToGrid(allNodes[realNodeIndex].pos).equals(pt)) {
        puntiReali++;
        target = allNodes[realNodeIndex++];
      }
      nodiFittizi.push( new EdgePointFittizio(pt, target)); }
    const realMidPointCount: number = this.getAllRealMidPoints().length;
    U.pe(puntiReali < 2 || puntiReali < realMidPointCount, 'fallimento nell\'assegnare fakepoints ai punti reali. Assegnati:'
      + puntiReali + ' / ' + realMidPointCount + '; fittizi:', nodiFittizi, ' reali:', this.getAllRealMidPoints());
    return nodiFittizi; }

  getBoundingMidPoints(e: ClickEvent | MouseMoveEvent | MouseUpEvent | MouseDownEvent | MouseEvent | MouseEnterEvent | MouseLeaveEvent,
                       style: EdgeStyle = null, canFail: boolean = false, arrFittizi: EdgePointFittizio[] = null): EdgePoint[] {
    const fittizi: EdgePointFittizio[] = arrFittizi ? arrFittizi : this.getAllFakePoints();
    const tmp: EdgePointFittizio[] = this.getBoundingMidPointsFake(e, style, canFail, fittizi);
    return [tmp[0].getPreviousRealPt(fittizi), tmp[1].getNextRealPt(fittizi)]; }

  getBoundingMidPointsFake(e: ClickEvent | MouseMoveEvent | MouseUpEvent | MouseDownEvent | MouseEvent | MouseEnterEvent | MouseLeaveEvent,
                           style: EdgeStyle = null, canFail: boolean = false, arrFittizi: EdgePointFittizio[] = null): EdgePointFittizio[] {

    // if (style.style === EdgeModes.straight) { return this.getBoundingMidPointsStraight(e, canFail); }
    // const edge: IEdge = ModelPiece.getLogic(e.target).edge;
    const clickedPt: GraphPoint = GraphPoint.fromEvent(e);
    const lineWidth: number = +this.shadow.getAttributeNS(null, 'stroke-width');

    const allNodes: EdgePoint[] =  this.getAllRealMidPoints();
    const fittizi: EdgePointFittizio[] = arrFittizi ? arrFittizi : this.getAllFakePoints();

    let i = 0;
    let closestPrev: EdgePointFittizio = null;
    let closestNext: EdgePointFittizio = null;
    let closestDistance: number = Number.POSITIVE_INFINITY;
    while (++i < fittizi.length) {
      const prev: EdgePointFittizio = fittizi[i - 1];
      const next: EdgePointFittizio = fittizi[i];
      const currentDistance = clickedPt.distanceFromLine(prev.pos, next.pos);
      /*if (clickedPt.isInTheMiddleOf(prev.pos, next.pos, lineWidth)) { return [prev, next]; }*/
      if (currentDistance < closestDistance) { closestPrev = prev; closestNext = next; closestDistance = currentDistance; }
    }
    return [closestPrev, closestNext];
    // U.pe(!canFail, 'bounding points not found', this, e);
  }

  getBoundingMidPointsStraight_OLD(
    e: ClickEvent | MouseMoveEvent | MouseUpEvent | MouseDownEvent | MouseEvent | MouseEnterEvent | MouseLeaveEvent,
    canFail: boolean = false): EdgePoint[] {

    const edge: IEdge = null; // ModelPiece.getLogic(e.target).edge;
    const clickedPt: GraphPoint = GraphPoint.fromEvent(e);
    const first: EdgePoint = this.startNode;
    const second: EdgePoint = (this.midNodes.length === 0 ? this.endNode : this.midNodes[0]);
    const penultimo: EdgePoint = (this.midNodes.length === 0 ? this.startNode : this.midNodes[this.midNodes.length - 1]);
    const last: EdgePoint = this.endNode;
    const lineWidth: number = +this.shadow.getAttributeNS(null, 'stroke-width');
    if (clickedPt.isInTheMiddleOf(first.pos, second.pos, lineWidth)) {
      /*console.log('bounding (first[' + edge.midNodes.indexOf(second)
        + '] && second[' + + edge.midNodes.indexOf(penultimo) + ']); e:', edge);*/
      return [first, second]; }
    /* if (penultimo !== first && second !== penultimo && clickedPt.isInTheMiddleOf(second.pos, penultimo.pos, lineWidth)) {
      console.log('bounding (second[' + edge.midNodes.indexOf(second)
        + '] && penultimo[' + + edge.midNodes.indexOf(penultimo) + ']), e:', edge);
      U.pe(edge.midNodes.indexOf(second) + 1 !== edge.midNodes.indexOf(penultimo), 'non conseguenti');
      return [second, penultimo]; } */
    if (last !== second && clickedPt.isInTheMiddleOf(penultimo.pos, last.pos, lineWidth)) {
      /*console.log('bounding (penultimo[' + edge.midNodes.indexOf(penultimo)
        + '] && ultimo[' + + edge.midNodes.indexOf(last) + ']); e:', edge);*/
      return [penultimo, last]; }
    let i;
    for (i = 0; i < this.midNodes.length; i++) { // ottimizzazione: può partire da 1 e terminare 1 prima (penultimo)
      const pre: EdgePoint = i === 0 ? first : this.midNodes[i - 1];
      const now: EdgePoint = this.midNodes[i];
      if (clickedPt.isInTheMiddleOf(pre.pos, now.pos, lineWidth)) {
        /*console.log('bounding (pre[' + edge.midNodes.indexOf(pre)
          + '] && now[' + + edge.midNodes.indexOf(now) + ']), e:', edge);*/
        U.pe(edge.midNodes.indexOf(pre) + 1 !== edge.midNodes.indexOf(now), 'non consecutivi.');
        return [pre, now]; }
    }
    console.log('clickedPt:', clickedPt, ', start:', this.startNode.pos, ', mids:', this.midNodes, ', end:', this.endNode.pos);
    U.pe(!canFail, 'bounding points not found:', e, this, 'edge:', IEdge.get(e));
    return null; }
  onMouseLeave(e: MouseLeaveEvent): void {
    this.isHighlighted = false;
    this.startNode.refreshGUI(null, false);
    this.endNode.refreshGUI(null, false);
    let i;
    for (i = 0; i < this.midNodes.length; i++) { this.midNodes[i].refreshGUI(null, false); }
    this.refreshGui();
  }
  onMouseEnter(e: MouseEnterEvent): void {
    this.onMouseLeave(null);
    this.isHighlighted = true;
    this.refreshGui();
  }
  onMouseMove(e: MouseMoveEvent): void {
    if (CursorFollowerEP.cursorFollower.isAttached()) { return; }
    this.onMouseOver(e as any, false);
    // nothing, CursorFollower is doing the job alone.
  }
  onMouseOver(e: MouseOverEvent | MouseMoveEvent, canFail: boolean = false): void {
    // if (this.isSelected) { return; }
    if (IEdge.refChanging) { return; }
    const fakePoints: EdgePointFittizio[] = this.getAllFakePoints();
    const tmp: EdgePointFittizio[] = this.getBoundingMidPointsFake(e, null, canFail, fakePoints);
    if (!tmp) { return; }
    const preFake: EdgePointFittizio = tmp[0];
    const nextFake: EdgePointFittizio = tmp[1];
    const pre: EdgePoint = preFake.getPreviousRealPt(fakePoints);
    const post: EdgePoint = nextFake.getNextRealPt(fakePoints);
    U.pe(!pre, 'failed to get previousRealPt of point:', preFake, ', all fakePoints:', fakePoints);
    U.pe(!post, 'failed to get nextRealPt of point:', nextFake, ', all fakePoints:', fakePoints);
    let i = -1;
    this.startNode.refreshGUI(null, false);
    this.endNode.refreshGUI(null, false);
    switch (this.logic.edgeStyleCommon.style) {
      case EdgeModes.straight: break;
      case EdgeModes.angular2:
      case EdgeModes.angular3:
      case EdgeModes.angular23Auto:
        if (preFake.pos.x === nextFake.pos.x) { this.shadow.style.cursor = this.html.style.cursor = 'col-resize';
        } else if (preFake.pos.y === nextFake.pos.y) { this.shadow.style.cursor = this.html.style.cursor = 'row-resize';
        } else { this.shadow.style.cursor = this.html.style.cursor = 'no-drop'; }
        break;
    }
    while (++i < this.midNodes.length) { this.midNodes[i].refreshGUI(null, false); }
    pre.refreshGUI(null, true);
    post.refreshGUI(null, true);
    switch (this.mode) {
      default:  this.shell.style.cursor = 'pointer'; break;
      case EdgeModes.angular2: case EdgeModes.angular23Auto: case EdgeModes.angular3:
        if (pre.pos.x === post.pos.x) { this.shell.style.cursor = 'row-resize'; }
        if (pre.pos.y === post.pos.y) { this.shell.style.cursor = 'col-resize'; }
        break;
    }
  }
  onClick(e: ClickEvent): void {
    // console.log('IEdge.clicked:', this);
    this.isSelected = true;
    IEdge.selecteds.push(this);
    let i;
    this.html.setAttributeNS(null, 'stroke-width', '' + 5);
    this.html.classList.add('selected_debug');
    this.startNode.show();
    for (i = 0; i < this.midNodes; i++) { this.midNodes[i].show(); }
    this.endNode.show();
    // if (!triggered) { Status.status.getActiveModel().graph.propertyBar.styleEditor.showE(this.logic); }
    this.refreshGui();
    IVertex.ChangePropertyBarContentClick(e, true);
    e.stopPropagation();
  }

  onMouseDown(e: MouseDownEvent): void {
    if (!this.isSelected) { return; }
    const tmp: EdgePoint[] = this.getBoundingMidPoints(e);
    const pos: GraphPoint = this.owner.toGraphCoord(new Point(e.pageX, e.pageY));
    CursorFollowerEP.cursorFollower.attach(this, pos, this.midNodes.indexOf(tmp[0]));
  }
  onMouseUp(e: MouseUpEvent): void {
    const len0: number = this.midNodes.length;
    const index = this.midNodes.indexOf(CursorFollowerEP.cursorFollower);
    if (!this.isSelected) { return; }
    // console.log('point inserted Pre', this.midNodes, ' [0]:', this.midNodes[0], this.midNodes[1]);
    CursorFollowerEP.cursorFollower.detach(false);
    const len1: number = this.midNodes.length;
    U.insertAt(this.midNodes, index, new EdgePoint(this, CursorFollowerEP.cursorFollower.pos));
    const len2: number = this.midNodes.length;
    U.pe(len0 !== this.midNodes.length, 'size varied: ' + len0 + ' --> ' + len1 + ' --> ' + len2 + ' --> ' + this.midNodes.length);
    // console.log('point inserted Post:', this.midNodes,  len0 + ' --> ' + this.midNodes.length);
    this.refreshGui();
  }

  remove() {
    U.arrayRemoveAll(this.start.edgesStart, this);
    U.arrayRemoveAll(this.end.edgesEnd, this);
    this.html.parentNode.removeChild(this.html);
  }
  unsetTarget(): IVertex {
    const v: IVertex = this.end;
    if (!v) { return null; }
    this.end = null;
    U.arrayRemoveAll(v.edgesEnd, this);
    return v; }

  setTarget(v: IVertex) {
    this.unsetTarget();
    this.end = v;
    v.edgesEnd.push(this);
  }

  private getEdgeHead(): SVGSVGElement {
    const logic: IReference = this.logic as IReference;
    let html: SVGSVGElement = null;
    if (logic.containment) { html = IEdge.generateContainmentHead(); }
    if (!html) { return null; }
    html.classList.add('EdgeHead');
    return html; }
  private getEdgeTail(): SVGSVGElement {
    const logic: IReference = this.logic as IReference;
    let html: SVGSVGElement = null;
    // if (logic.containment) { html = IEdge.generateContainmentHead(); }
    if (!html) { return null; }
    html.classList.add('EdgeHead');
    return html; }
}
