import {
  Json,
  U,
  IEdge,
  IVertex,
  IPackage,
  M2Class,
  IAttribute,
  AttribETypes,
  IFeature,
  ModelPiece,
  ISidebar,
  IModel,
  Status,
  Size,
  IReference, GraphPoint, GraphSize,
  PropertyBarr, Dictionary, IClass
} from '../../common/Joiner';
import MouseDownEvent = JQuery.MouseDownEvent;
import MouseUpEvent = JQuery.MouseUpEvent;
import MouseMoveEvent = JQuery.MouseMoveEvent;
import ClickEvent = JQuery.ClickEvent;
import KeyDownEvent = JQuery.KeyDownEvent;

export class IGraph {
// todo: this.vertex non è mai aggiornato reealmente.
  static all: Dictionary<number, IGraph> = {};
  static ID = 0;
  private static allMarkp: HTMLElement[] = []; // campo per robe di debug
  id: number = null;
  container: HTMLElement = null;
  model: IModel = null;
  vertex: IVertex[] = null;
  edges: IEdge[] = null;
  scroll: GraphPoint = null;
  propertyBar: PropertyBarr = null;
  zoom: Point = null;
  grid: GraphPoint = null;
  gridDisplay: boolean = false && false;
  edgeContainer: SVGGElement;
  vertexContainer: SVGGElement;

  // campi per robe di debug
  private allMarkgp: SVGCircleElement[] = [];
  private markp: HTMLElement;
  private markgp: SVGCircleElement;
  private svg: SVGElement;

  static getByID(id: string): IGraph { return IGraph.all[id]; }
  static getByHtml(html: HTMLElement | SVGElement): IGraph {
    for (const id in IGraph.all) {
      if (!IGraph.all.hasOwnProperty(id)) { continue; }
      const graph = IGraph.all[id] as IGraph;
      if (U.isParentOf(graph.container, html)) { return graph; }
    }
    U.pe(true, 'failed to find parent graph of:', html);
    return null; }
  constructor(model: IModel, container: HTMLElement) {
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
    this.svg = $(this.container).find('svg.graph')[0] as unknown as any;
    this.vertex = [];
    this.edges = [];
    this.zoom = new Point(1, 1);
    this.scroll = new GraphPoint(0, 0);
    this.grid = new GraphPoint(20, 20);
    this.gridDisplay = true;
    let i;
    const arr: IClass[] = this.model.getAllClasses();
    const classEdges: IClass[] = [];
    for (i = 0; i < arr.length; i++) {
      if (arr[i].shouldBeDisplayedAsEdge()) {
        classEdges.push(arr[i]);
      } else { this.vertex.push(arr[i].generateVertex()); }
    }
    // vertex disegnati, ora disegno gli edges.
    for (i = 0; i < classEdges.length; i++) {  this.edges.concat(classEdges[i].generateEdge()); }
    const arrReferences: IReference[] = this.model.getAllReferences();
    for (i = 0; i < arrReferences.length; i++) { this.edges.concat(arrReferences[i].generateEdge()); }
    this.propertyBar = new PropertyBarr(this.model);
    this.addGraphEventListeners();
    this.ShowGrid(); }

  fitToGrid(pt0: GraphPoint, clone: boolean = true, debug: boolean = false, fitHorizontal = true, fitVertical = true): GraphPoint {
    const pt: GraphPoint = clone ? pt0.clone() : pt0;
    U.pe(!this.grid, 'grid not initialized.');
    if (fitHorizontal && !isNaN(this.grid.x) && this.grid.x > 0) { pt.x = U.trunc(pt.x / this.grid.x) * this.grid.x; }
    if (fitVertical && !isNaN(this.grid.y) && this.grid.y > 0) { pt.y = U.trunc(pt.y / this.grid.y) * this.grid.y; }
    U.pif(debug, 'fitToGrid(', pt0, '); this.grid:', this.grid, ' = ', pt);
    return pt; }
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

  addGraphEventListeners() {
    const $graph = $(this.container);
    const thiss: IGraph = this;
    this.model.linkToLogic(this.container);
    $graph.off('mousedown.graph').on('mousedown.graph', (evt: MouseDownEvent) => { thiss.onMouseDown(evt); });
    $graph.off('mouseup.graph').on('mouseup.graph', (evt: MouseUpEvent) => { thiss.onMouseUp(evt); });
    $graph.off('mousemove.graph').on('mousemove.graph', (evt: MouseMoveEvent) => { thiss.onMouseMove(evt); });
    // $graph.off('keydown.graph').on('keydown.graph', (evt: KeyDownEvent) => { thiss.onKeyDown(evt); }); non triggerabile, non ha focus.
    // $graph.off('click.mark').on('click.mark', (e: ClickEvent) => { thiss.markClick(e, true); } );
    $graph.off('click.propbar').on('click.propbar', (e: ClickEvent) => { IVertex.ChangePropertyBarContentClick(e); } );
  }

  onMouseDown(evt: MouseDownEvent): void { }
  onMouseUp(evt: MouseUpEvent): void { }

  onMouseMoveSetReference(evt: MouseMoveEvent, edge: IEdge): void {
    // console.log('graph.movereference()', edge, edge ? edge.tmpEndVertex : null);
    if (!edge || edge.tmpEndVertex) { return; }
    // const ref: IReference | IClass = edge.logic;
    edge.tmpEnd = GraphPoint.fromEvent(evt);
    // console.log('graph.movereference: success!', edge.tmpEnd);
    edge.refreshGui(null, false); }

  onMouseMoveVertexMove(evt: MouseMoveEvent, v: IVertex): void {
    if (!v) { return; }
    const currentMousePos: Point = new Point(evt.pageX, evt.pageY);
    // console.log('evt:', evt);
    let currentGraphCoord: GraphPoint = this.toGraphCoord(currentMousePos);
    currentGraphCoord = currentGraphCoord.subtract(IVertex.selectedStartPt, false);
    v.moveTo(currentGraphCoord); }

  edgeChangingAbort(e: KeyDownEvent | MouseDownEvent): void {
    const edge: IEdge = IEdge.edgeChanging;
    if (!edge) { return; }
    IEdge.edgeChanging = null;

    // unmark hovering vertex
    const hoveringVertex: IVertex[] = IVertex.GetMarkedWith('refhover');
    let i: number;
    U.pw(hoveringVertex.length > 1, 'hovering on more than one target at the same time should be impossible.', hoveringVertex);
    for (i = 0; i < hoveringVertex.length; i++) { hoveringVertex[i].mark(false, 'refhover'); }

    // restore previous endTarget or delete edge.
    if (!edge.end) { edge.remove(); return; }
    edge.useMidNodes = true;
    edge.useRealEndVertex = true;
    edge.tmpEnd = null;
    edge.refreshGui(); }

  onMouseMove(evt: MouseMoveEvent): void {
    this.onMouseMoveSetReference(evt, IEdge.edgeChanging);
    this.onMouseMoveVertexMove(evt, IVertex.selected); }

  toGraphCoordS(s: Size): GraphSize {
    const tl = this.toGraphCoord(new Point(s.x, s.y));
    const br = this.toGraphCoord(new Point(s.x + s.w, s.y + s.h));
    const ret = new GraphSize(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    return ret; }

  toGraphCoord(p: Point): GraphPoint {
    const graphSize: Size = U.sizeof(this.container);
    const ret: GraphPoint = new GraphPoint(p.x, p.y);
    const debug = true;
    ret.x -= graphSize.x;
    ret.y -= graphSize.y;
    ret.x += this.scroll.x;
    ret.y += this.scroll.y;
    ret.x /= this.zoom.x;
    ret.y /= this.zoom.y;
    // console.log('toGraph()  - graphSize:', graphSize, ' + scroll: ', this.scroll, ' / zoom', this.zoom);
    if (debug) {
      const ver: Point = this.toHtmlCoord(ret);
      U.pe( ver.x !== p.x || ver.y !== p.y, 'error in toGraphCoord or toHtmlCoord: inputPt:', p, ', result: ', ret, 'verify:', ver);
    }
    return ret; }
  toHtmlCoordS(s: GraphSize): Size {
    if (s === null) { return null; }
    const tl = this.toHtmlCoord(new GraphPoint(s.x, s.y));
    const br = this.toHtmlCoord(new GraphPoint(s.x + s.w, s.y + s.h));
    return new Size(tl.x, tl.y, br.x - tl.x, br.y - tl.y); }
  toHtmlCoord(p: GraphPoint): Point {
    const graphSize: Size = U.sizeof(this.container);
    const ret: Point = new Point(p.x, p.y);
    // console.log('toHtml()', ' * zoom', this.zoom, ' - scroll: ', this.scroll, ' + graphSize:', graphSize);
    ret.x *= this.zoom.x;
    ret.y *= this.zoom.y;
    ret.x -= this.scroll.x;
    ret.y -= this.scroll.y;
    ret.x += graphSize.x;
    ret.y += graphSize.y;
    return ret; }

  getAllVertexIsBroke() { return this.vertex; }

  markClick(e: JQuery.ClickEvent, clean: boolean = true) { return this.mark(new Point(e.pageX, e.pageY), clean); }
  markg(gp: GraphPoint, clean: boolean = false, colorTop: string = 'red'): void {
    return this.mark(this.toHtmlCoord(gp), clean, colorTop); }
  markgS(gs: GraphSize, clean: boolean = false, colorTop: string = 'red', colorBot: string = null): void {
    /*if (!colorBot) { colorBot = colorTop; }
    this.markg(gs.tl(), clean, colorTop);
    this.markg(gs.tr(), false, colorTop);
    this.markg(gs.bl(), false, colorBot);
    this.markg(gs.br(), false, colorBot);*/
    // const htmls: Size = this.owner.toHtmlCoordS(size0);
    return this.markS(this.toHtmlCoordS(gs), clean, colorTop, colorBot);
  }
  markS(s: Size, clean: boolean = false, colorTop: string = 'red', colorBot: string = null): void {
    if (!colorBot) { colorBot = colorTop; }
    U.pe(!s, 'size cannot be null.');
    this.mark(s.tl(), clean, colorTop);
    // color = 'white';
    this.mark(s.tr(), false, colorTop);
    // color = 'purple';
    this.mark(s.bl(), false, colorBot);
    // color = 'orange';
    this.mark(s.br(), false, colorBot);
  }
  mark(p: Point, clean: boolean = false, color: string = 'red'): void {
    const gp: GraphPoint = this.toGraphCoord(p);
    if (clean) {
      let i;
      for (i = 0; i < this.allMarkgp.length; i++) {
        const node: SVGCircleElement = this.allMarkgp[i];
        if (this.container.contains(node)) { this.container.removeChild(node); }
      }
      for (i = 0; i < IGraph.allMarkp.length; i++) {
        const node: HTMLElement = IGraph.allMarkp[i];
        if (document.body.contains(node)) { document.body.removeChild(node); }
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
  }

  setZoom(zoom: Point = null): void {
    if (zoom) { this.zoom = zoom; }
    const size: Size = U.getViewBox(this.svg);
    U.pw(true, 'Graph.setZoom: todo.');
    U.setViewBox(this.svg, size); }

  ShowGrid(checked: boolean = null) {
    const graph = (this.model === Status.status.mm ? Status.status.mm.graph : Status.status.m.graph);
    if (checked === null) { checked = graph.gridDisplay; }
    if (this.model === Status.status.mm) { graph.gridDisplay = checked; } else { graph.gridDisplay = checked; }
    const $grid = $(this.container).find('.gridContainer');
    const x = isNaN(this.grid.x) || this.grid.x <= 0 ? 10000 : this.grid.x;
    const y = isNaN(this.grid.y) || this.grid.y <= 0 ? 10000 : this.grid.y;
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
    if (checked) { $grid.show(); } else { $grid.hide(); }

  }

  addVertex(v: IVertex): void {
    v.owner = this;
    U.ArrayAdd(this.vertex, v);
    // todo: aggiungi edges tra i vertici. in matrix edgeMatrix[vertex][vertex] = edge
  }
}

export class Point {
  x: number;
  y: number;
  dontMixWithGraphPoint: any;

  constructor(x: number | string, y: number | string) {
    if (isNaN(+x)) { x = 0; }
    if (isNaN(+y)) { y = 0; }
    this.x = +x;
    this.y = +y; }

  clone(): Point { return new Point(this.x, this.y); }

  subtract(p2: Point, newInstance: boolean): Point {
    U.pe(!p2, 'subtract argument must be a valid point: ', p2);
    let p1: Point;
    if (!newInstance) { p1 = this; } else { p1 = this.clone(); }
    p1.x -= p2.x;
    p1.y -= p2.y;
    return p1; }

  add(p2: Point, newInstance: boolean): Point {
    U.pe(!p2, 'add argument must be a valid point: ', p2);
    let p1: Point;
    if (!newInstance) { p1 = this; } else { p1 = this.clone(); }
    p1.x += p2.x;
    p1.y += p2.y;
    return p1; }

  addAll(p: Point[], newInstance: boolean): Point {
    let i;
    let p0: Point;
    if (!newInstance) { p0 = this; } else { p0 = this.clone(); }
    for (i = 0; i < p.length; i++) { p0.add(p[i], true); }
    return p0; }

  subtractAll(p: Point[], newInstance: boolean): Point {
    let i;
    let p0: Point;
    if (!newInstance) { p0 = this; } else { p0 = this.clone(); }
    for (i = 0; i < p.length; i++) { p0.subtract(p[i], true); }
    return p0; }

  multiply(scalar: number, newInstance: boolean): Point {
    U.pe( isNaN(+scalar), 'scalar argument must be a valid number: ', scalar);
    let p1: Point;
    if (!newInstance) { p1 = this; } else { p1 = this.clone(); }
    p1.x *= scalar;
    p1.y *= scalar;
    return p1; }

  divide(scalar: number, newInstance: boolean): Point {
    U.pe( isNaN(+scalar), 'scalar argument must be a valid number: ', scalar);
    let p1: Point;
    if (!newInstance) { p1 = this; } else { p1 = this.clone(); }
    p1.x /= scalar;
    p1.y /= scalar;
    return p1; }
}
