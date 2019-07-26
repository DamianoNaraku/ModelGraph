import {
  Json,
  U,
  IEdge,
  IField,
  IPackage,
  IClass,
  IAttribute,
  AttribETypes,
  IFeature,
  ModelPiece,
  ISidebar,
  IGraph,
  IModel,
  Status, Size, Model, IReference, Dictionary, DetectZoom, PropertyBarr, EType
} from '../../common/Joiner';
import {Point} from '../iGraph';
import MouseMoveEvent = JQuery.MouseMoveEvent;
import MouseDownEvent = JQuery.MouseDownEvent;
import MouseUpEvent = JQuery.MouseUpEvent;
import MouseEnterEvent = JQuery.MouseEnterEvent;
import MouseLeaveEvent = JQuery.MouseLeaveEvent;
import ClickEvent = JQuery.ClickEvent;
import ChangeEvent = JQuery.ChangeEvent;
import ContextMenuEvent = JQuery.ContextMenuEvent;
import {DamContextMenuComponent} from '../../dam-context-menu/dam-context-menu.component';
export class GraphPoint {
  x: number;
  y: number;
  dontmixwithPoint: any;
  static getM(firstPt: GraphPoint, secondPt: GraphPoint): number { return (firstPt.y - secondPt.y) / (firstPt.x - secondPt.x); }
  static getQ(firstPt: GraphPoint, secondPt: GraphPoint): number { return firstPt.y - GraphPoint.getM(firstPt, secondPt) * firstPt.x; }
  static fromEvent(e: ClickEvent | MouseMoveEvent | MouseUpEvent | MouseDownEvent | MouseEnterEvent | MouseLeaveEvent | MouseEvent)
    : GraphPoint {
    const p: Point = new Point(e.pageX, e.pageY);
    const g: IGraph = Status.status.getActiveModel().graph;
    return g.toGraphCoord(p); }
  constructor(x: number, y: number) {
    if (isNaN(+x)) { x = 0; }
    if (isNaN(+y)) { y = 0; }
    this.x = x;
    this.y = y; }
  toString(): string { return '(' + this.x + ', ' + this.y + ')'; }
  clone(): GraphPoint { return new GraphPoint(this.x, this.y); }
  subtract(p2: GraphPoint, newInstance: boolean): GraphPoint {
    U.pe(!p2, 'subtract argument must be a valid point: ', p2);
    let p1: GraphPoint;
    if (!newInstance) { p1 = this; } else { p1 = this.clone(); }
    p1.x -= p2.x;
    p1.y -= p2.y;
    return p1; }
  add(p2: GraphPoint, newInstance: boolean): GraphPoint {
    U.pe(!p2, 'add argument must be a valid point: ', p2);
    let p1: GraphPoint;
    if (!newInstance) { p1 = this; } else { p1 = this.clone(); }
    p1.x += p2.x;
    p1.y += p2.y;
    return p1; }
  multiply(scalar: number, newInstance: boolean): GraphPoint {
    U.pe( isNaN(+scalar), 'scalar argument must be a valid number: ', scalar);
    let p1: GraphPoint;
    if (!newInstance) { p1 = this; } else { p1 = this.clone(); }
    p1.x *= scalar;
    p1.y *= scalar;
    return p1; }
  divide(scalar: number, newInstance: boolean): GraphPoint {
    U.pe( isNaN(+scalar), 'scalar argument must be a valid number: ', scalar);
    let p1: GraphPoint;
    if (!newInstance) { p1 = this; } else { p1 = this.clone(); }
    p1.x /= scalar;
    p1.y /= scalar;
    return p1; }

  isInTheMiddleOf(firstPt: GraphPoint, secondPt: GraphPoint, tolleranza: number): boolean {
    const ret = this.isInTheMiddleOf0(firstPt, secondPt, tolleranza);
    // console.log('this ', this, 'is in middle of(', firstPt, ', ', secondPt, ') ? ', ret);
    return ret; }

  isInTheMiddleOf0(firstPt: GraphPoint, secondPt: GraphPoint, tolleranza: number): boolean {
    const rectangle: GraphSize = GraphSize.fromPoints(firstPt, secondPt);
    const tolleranzaX = tolleranza; // actually should be cos * arctan(m);
    const tolleranzaY = tolleranza; // actually should be sin * arctan(m);
    if (this.x < rectangle.x - tolleranzaX || this.x > rectangle.x + rectangle.w + tolleranzaX) { return false; }
    if (this.y < rectangle.y - tolleranzaX || this.y > rectangle.y + rectangle.h + tolleranzaY) { return false; }
    const m = GraphPoint.getM(firstPt, secondPt);
    const q = GraphPoint.getQ(firstPt, secondPt);
    const lineDistance = this.distanceFromLine(firstPt, secondPt);
    // console.log('distance:', lineDistance, ', this:', this, ', p1:', firstPt, ', p2:', secondPt);
    if (lineDistance <= tolleranza) { return true; }
    return false;
  }
  isInTheMiddleOfOld(firstPt: GraphPoint, secondPt: GraphPoint, tolleranza: number): boolean {
    const rectangle: GraphSize = GraphSize.fromPoints(firstPt, secondPt);
    const tolleranzaX = tolleranza; // actually should be cos * arctan(m);
    const tolleranzaY = tolleranza; // actually should be sin * arctan(m);
    if (this.x < rectangle.x - tolleranzaX || this.x > rectangle.x + rectangle.w + tolleranzaX) { return false; }
    if (this.y < rectangle.y - tolleranzaX || this.y > rectangle.y + rectangle.h + tolleranzaY) { return false; }
    let m1Max = GraphPoint.getM( new GraphPoint(this.x + tolleranzaX, this.y + tolleranzaY), firstPt);
    let m1Min = GraphPoint.getM( new GraphPoint(this.x - tolleranzaX, this.y - tolleranzaY), firstPt);
    if (m1Min > m1Max) { const tmp = m1Min; m1Min = m1Max; m1Max = tmp; }
    const m2 = GraphPoint.getM(firstPt, secondPt);
    if ( m2 >= m1Min && m2 <= m1Max) { return false; }
    return true;
  }

  distanceFromLine(p1: GraphPoint, p2: GraphPoint) {
    const top: number =
    + (p2.y - p1.y) * this.x
    - (p2.x - p1.x) * this.y
    + p2.x * p1.y
    - p1.x * p2.y;
    const bot =
      (p2.y - p1.y) * (p2.y - p1.y) +
      (p2.x - p1.x) * (p2.x - p1.x);
    return Math.abs(top) / Math.sqrt(bot);  }

  equals(pt: GraphPoint, tolleranzaX: number = 0, tolleranzaY: number = 0) {
    if (pt === null) { return false; }
    return Math.abs(this.x - pt.x) <= tolleranzaX && Math.abs(this.y - pt.y) <= tolleranzaY; }

  moveOnNearestBorder(startVertexSize: GraphSize, clone: boolean, debug: boolean = true) {
    const pt: GraphPoint = clone ? this.clone() : this;
    const tl: GraphPoint = startVertexSize.tl();
    const tr: GraphPoint = startVertexSize.tr();
    const bl: GraphPoint = startVertexSize.bl();
    const br: GraphPoint = startVertexSize.br();
    const L: number = pt.distanceFromLine(tl, bl);
    const R: number = pt.distanceFromLine(tr, br);
    const T: number = pt.distanceFromLine(tl, tr);
    const B: number = pt.distanceFromLine(bl, br);
    const min: number = Math.min(L, R, T, B);
    if (min === L) { pt.x = tl.x; }
    if (min === R) { pt.x = tr.x; }
    if (min === T) { pt.y = tr.y; }
    if (min === B) { pt.y = br.y; }
    if (debug) { Status.status.getActiveModel().graph.markg(pt, false, 'purple'); }
    return pt;
  }
}
export class GraphSize {
  x: number;
  y: number;
  w: number;
  h: number;
  dontmixwithSize: any;
  constructor(x: number, y: number, w: number, h: number) {
    if (isNaN(+x)) { x = 0; }
    if (isNaN(+y)) { y = 0; }
    if (isNaN(+w)) { w = 0; }
    if (isNaN(+h)) { h = 0; }
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h; }
  static fromPoints(firstPt: GraphPoint, secondPt: GraphPoint): GraphSize {
    const minX = Math.min(firstPt.x, secondPt.x);
    const maxX = Math.max(firstPt.x, secondPt.x);
    const minY = Math.min(firstPt.y, secondPt.y);
    const maxY = Math.max(firstPt.y, secondPt.y);
    return new GraphSize(minX, minY, maxX - minX, maxY - minY); }
  static closestIntersection(vertexGSize: GraphSize, prevPt: GraphPoint, pt0: GraphPoint, gridAlign: GraphPoint = null): GraphPoint {
    let pt = pt0.clone();
    const m = GraphPoint.getM(prevPt, pt);
    const q = GraphPoint.getQ(prevPt, pt);
    U.pe( Math.abs((pt.y - m * pt.x) - (prevPt.y - m * prevPt.x)) > .001,
      'wrong math in Q:', (pt.y - m * pt.x), ' vs ', (prevPt.y - m * prevPt.x));
    /*const isL = prevPt.x < pt.x;
    const isT = prevPt.y < pt.y;
    const isR = !isL;
    const isB = !isT; */
    if (m === Number.POSITIVE_INFINITY && q === Number.NEGATIVE_INFINITY) { // bottom middle
      return new GraphPoint(vertexGSize.x + vertexGSize.w / 2, vertexGSize.y + vertexGSize.h); }
    // console.log('pt:', pt, 'm:', m, 'q:', q);
    let L: GraphPoint = new GraphPoint(0, 0);
    let T: GraphPoint = new GraphPoint(0, 0);
    let R: GraphPoint = new GraphPoint(0, 0);
    let B: GraphPoint = new GraphPoint(0, 0);
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
    if ( (B.x >= pt.x && B.x <= prevPt.x) || (B.x >= prevPt.x && B.x <= pt.x) ) { } else { B = null; }
    if ( (T.x >= pt.x && T.x <= prevPt.x) || (T.x >= prevPt.x && T.x <= pt.x) ) { } else { T = null; }
    if ( (L.y >= pt.y && L.y <= prevPt.y) || (L.y >= prevPt.y && L.y <= pt.y) ) { } else { L = null; }
    if ( (R.y >= pt.y && R.y <= prevPt.y) || (R.y >= prevPt.y && R.y <= pt.y) ) { } else { R = null; }
    // console.log('superstiti step1: (LTBR):', L, T, B, R);
    const vicinanzaT = !T ? Number.POSITIVE_INFINITY : ((T.x - pt.x) * (T.x - pt.x)) + ((T.y - pt.y) * (T.y - pt.y));
    const vicinanzaB = !B ? Number.POSITIVE_INFINITY : ((B.x - pt.x) * (B.x - pt.x)) + ((B.y - pt.y) * (B.y - pt.y));
    const vicinanzaL = !L ? Number.POSITIVE_INFINITY : ((L.x - pt.x) * (L.x - pt.x)) + ((L.y - pt.y) * (L.y - pt.y));
    const vicinanzaR = !R ? Number.POSITIVE_INFINITY : ((R.x - pt.x) * (R.x - pt.x)) + ((R.y - pt.y) * (R.y - pt.y));
    const closest = Math.min(vicinanzaT, vicinanzaB, vicinanzaL, vicinanzaR);
    // console.log( 'closest:', closest);
    // succede quando pt e prevPt sono entrambi all'interno del rettangolo del vertice.
    // L'edge non è visibile e il valore ritornato è irrilevante.
    if (closest === Number.POSITIVE_INFINITY) {
      /* top center */
      pt = vertexGSize.tl();
      pt.x += vertexGSize.w / 2; } else
    if (closest === Number.POSITIVE_INFINITY) {
      /* bottom center */
      pt = vertexGSize.br();
      pt.x -= vertexGSize.w / 2; } else
    if (closest === vicinanzaT) { pt = T; } else
    if (closest === vicinanzaB) { pt = B; } else
    if (closest === vicinanzaR) { pt = R; } else
    if (closest === vicinanzaL) { pt = L; }

    if (!gridAlign) { return pt; }
    if ((pt === T || pt === B || isNaN(closest)) && gridAlign.x) {
      const floorX: number = Math.floor(pt.x / gridAlign.x) * gridAlign.x;
      const ceilX: number = Math.ceil(pt.x / gridAlign.x) * gridAlign.x;
      let closestX;
      let farthestX;
      if (Math.abs(floorX - pt.x) < Math.abs(ceilX - pt.x)) {
        closestX = floorX; farthestX = ceilX;
      } else { closestX = ceilX; farthestX = floorX; }

      // todo: possibile causa del bug che non allinea punti fake a punti reali. nel calcolo realPT questo non viene fatto.
      // if closest grid intersection is inside the vertex.
      if (closestX >= vertexGSize.x && closestX <= vertexGSize.x + vertexGSize.w) { pt.x = closestX; } else
      // if 2° closer grid intersection is inside the vertex.
      if (closestX >= vertexGSize.x && closestX <= vertexGSize.x + vertexGSize.w) { pt.x = farthestX;
      // if no intersection are inside the vertex (ignore grid)
      } else { pt = pt; }
    } else if ((pt === L || pt === R) && gridAlign.y) {
      const floorY: number = Math.floor(pt.y / gridAlign.y) * gridAlign.y;
      const ceilY: number = Math.ceil(pt.y / gridAlign.y) * gridAlign.y;
      let closestY;
      let farthestY;
      if (Math.abs(floorY - pt.y) < Math.abs(ceilY - pt.y)) {
        closestY = floorY; farthestY = ceilY;
      } else { closestY = ceilY; farthestY = floorY; }

      // if closest grid intersection is inside the vertex.
      if (closestY >= vertexGSize.y && closestY <= vertexGSize.y + vertexGSize.h) { pt.y = closestY; } else
      // if 2° closer grid intersection is inside the vertex.
      if (closestY >= vertexGSize.y && closestY <= vertexGSize.y + vertexGSize.h) { pt.y = farthestY;
      // if no intersection are inside the vertex (ignore grid)
      } else { pt = pt; }
    }
    return pt; }

  tl(): GraphPoint { return new GraphPoint(this.x + 0,      this.y + 0); }
  tr(): GraphPoint { return new GraphPoint(this.x + this.w, this.y + 0); }
  bl(): GraphPoint { return new GraphPoint(this.x + 0,      this.y + this.h); }
  br(): GraphPoint { return new GraphPoint(this.x + this.w, this.y + this.h); }

  clone(): GraphSize { return new GraphSize(this.x, this.y, this.w, this.h); }
}
export class IVertex {
  static all: Dictionary = {};
  static ID = 0;
  static selected: IVertex = null;
  static selectedStartPt: GraphPoint = null;
  static refChangingVertex: IVertex = null;
  classe: IClass;
  package: IPackage;
  owner: IGraph;
  fields: IField[] = [];
  edgesStart: IEdge[] = [];
  edgesEnd: IEdge[] = [];
  // styleRaw: SVGForeignObjectElement = null;
  // style: SVGForeignObjectElement = null;
  // position: GraphPoint;
  size: GraphSize;
  contains: IVertex[];
  id: number;
  static getByID(id: number): IVertex { return IVertex.all[id]; }

  static getvertex(e: Event | MouseEvent | MouseDownEvent | MouseUpEvent | MouseMoveEvent | MouseEnterEvent | MouseLeaveEvent | ClickEvent)
    : IVertex { return IVertex.getvertexByHtml(e.currentTarget as HTMLElement | SVGElement); }

  static getvertexByHtml(node: HTMLElement | SVGElement): IVertex {
    while (!node.dataset.vertexID) { node = node.parentNode as HTMLElement | SVGElement; }
    // console.log('getVertex by id:' + node.dataset.vertexID, 'all:', IVertex.all);
    return IVertex.getByID(+(node.dataset.vertexID)); }

  static FieldNameChanged(e: ChangeEvent) {
    const html: HTMLElement | SVGElement = e.currentTarget;
    const modelPiece: ModelPiece = ModelPiece.getLogic(html);
    modelPiece.fieldChanged(e);
    $(html).trigger('click'); // updates the propertyBar
    // const m: IModel = modelPiece.getModelRoot();
    const mm: IModel = Status.status.mm;
    const m: IModel = Status.status.m;
    setTimeout( () => { mm.refreshGUI(); m.refreshGUI(); }, 1);
  }
  static ChangePropertyBarContentClick(e: ClickEvent, isEdge: boolean = false) {
    const html: HTMLElement | SVGElement = e.target; // todo: approfondisci i vari tipi di target (current, orginal...)
    const modelPiece: ModelPiece = ModelPiece.getLogic(html);
    const model = modelPiece.getModelRoot();
    U.pe(!modelPiece, 'failed to get modelPiece from html:', html);
    const pbar: PropertyBarr = model.graph.propertyBar;
    // console.log('isEdge ? ', isEdge);
    pbar.show(modelPiece);
    if (isEdge) { pbar.styleEditor.showE(modelPiece as IReference | IClass); } else { pbar.styleEditor.show(modelPiece); }
  }
  private static ReferenceTypeChanged(e: JQuery.ChangeEvent) {
    console.log('reftypechangerequest:');
  }
  private static AttributeTypeChanged(e: JQuery.ChangeEvent) {
  }
  constructor() {
    this.id = IVertex.ID++;
    IVertex.all[this.id] = this;
    this.contains = [];
    this.fields = [];
    this.edgesStart = [];
    this.edgesEnd = [];
  }
  constructorClass(logical: IClass): void {
    this.classe = logical;
    this.setGraph(logical.getModelRoot().graph);
    let i: number;
    const fields: IField[] = [];
    return;
    if (!this.classe || !this.classe.attributes) { return; }
    U.pe(!this.classe, 'undefined class while creating a vertex from class:', this.classe);
    U.pe(!this.classe.attributes, 'undefined class attributes while creating a vertex from class:', this.classe.attributes, this.classe);
    for (i = 0; i < this.classe.attributes.length; i++) {
      fields.push(new IField(this.classe.attributes[i]));
    }
    this.setFields(fields); }
  constructorPkg(logical: IPackage): void {
    this.package = logical;
    this.setGraph(logical.getModelRoot().graph);
    this.setFields(null); }

  getStartPoint(nextPt: GraphPoint = null): GraphPoint { return this.getEndPoint(nextPt); }
  getEndPoint(prevPt: GraphPoint = null): GraphPoint {
    // NB: MAI fare sizeof() di un SVGForeignObjectElement, ridà valori sballati. fallo ai suoi childs.
    const modelPiece: ModelPiece = this.package ? this.package : this.classe;
    const htmlEP = $(modelPiece.html).find('.EndPoint');
    // U.pe(htmlEP.length === 0, 'failed to find .EndPoint. html:', modelPiece.html);
    let html: HTMLElement | SVGElement;
    let endPointSize: Size;
    let pt: GraphPoint;
    if (htmlEP.length === 0) { html = modelPiece.html.firstChild as HTMLElement; } else { html = htmlEP[0]; }
    endPointSize = U.sizeof(html);
    // console.log('htmlsize:', htmlSize, 'childSize:', U.sizeof(html.firstChild as HTMLElement));
    // console.log('real size(', htmlSize, ') vs graphSize(', this.toGraphCoordS(htmlSize), '), html:', html);
    const endPointGSize: GraphSize = this.owner.toGraphCoordS(endPointSize);
    const vertexGSize = this.autosize(true, false).getSize();
    pt = endPointGSize.tl();
    pt.x += endPointGSize.w / 2;
    pt.y += endPointGSize.h / 2;
    if (! prevPt ) { return pt; }
    pt = GraphSize.closestIntersection(vertexGSize, prevPt, pt, this.owner.grid);
    U.pe(!U.isOnEdge(pt, endPointGSize), 'not on Vertex edge.');
    // this.owner.mark(this.owner.toHtmlCoord(pt), true, 'red');
    return pt; }
/*
  toGraphCoordS(s: Size): GraphSize {
    const tl = this.toGraphCoord(new Point(s.x, s.y));
    const br = this.toGraphCoord(new Point(s.x + s.w, s.y + s.h));
    return new GraphSize(tl.x, tl.y, br.x - tl.x, br.y - tl.y); }
  toGraphCoord(p: Point): GraphPoint {
    const graphSize: Size = U.sizeof(this.owner.container);
    const ret: GraphPoint = new GraphPoint(p.x, p.y);
    const debug = true;
    ret.x -= graphSize.x;
    ret.y -= graphSize.y;
    ret.x += this.owner.scroll.x;
    ret.y += this.owner.scroll.y;
    ret.x /= this.owner.zoom.x;
    ret.y /= this.owner.zoom.y;
    if (debug) {
      const ver: Point = this.toHtmlCoord(ret);
      U.pe( ver.x !== p.x || ver.y !== p.y, 'error in toGraphCoord or toHtmlCoord: inputPt:', p, ', result: ', ret, 'verify:', ver);
    }
    return ret; }
  toHtmlCoordS(s: GraphSize): Size {
    const tl = this.toHtmlCoord(new GraphPoint(s.x, s.y));
    const br = this.toHtmlCoord(new GraphPoint(s.x + s.w, s.y + s.h));
    return new Size(tl.x, tl.y, br.x - tl.x, br.y - tl.x); }
  toHtmlCoord(p: GraphPoint): Point {
    const graphSize: Size = U.sizeof(this.owner.container);
    const ret: Point = new Point(p.x, p.y);
    ret.x *= this.owner.zoom.x;
    ret.y *= this.owner.zoom.y;
    ret.x -= this.owner.scroll.x;
    ret.y -= this.owner.scroll.y;
    ret.x += graphSize.x;
    ret.y += graphSize.y;
    return ret; }*/

  setSize(p: GraphSize, refreshVertex: boolean = true, refreshEdge: boolean = true) {
    U.pe(!p, 'setPosition: null');
    const modelPiece: ModelPiece = this.logic();
    // console.log('setsize(', p, ') logic:', modelPiece, ', html:', modelPiece.html);
    const oldPos: GraphPoint = this.size ? new GraphPoint(this.size.x, this.size.y) : new GraphPoint(0, 0);
    const oldSize: GraphPoint = new GraphPoint(this.size.w, this.size.h);
    this.size = p;
    modelPiece.html.setAttributeNS(null, 'x', '' + this.size.x);
    modelPiece.html.setAttributeNS(null, 'y', '' + this.size.y);
    modelPiece.html.setAttributeNS(null, 'width', '' + this.size.w);
    modelPiece.html.setAttributeNS(null, 'height', '' + this.size.h);
    // todo: cerca tutti gli as string, non è un vero cast ma solo un cambiotipo senza trasformazione, crea errori.
    const spostamento: GraphPoint = this.size.tl().subtract(oldPos, true);
    // for (i = 0; i < this.fields.length; i++) { this.fields[i].refreshGui(); }
    const refEnd: IEdge[] = this.edgesEnd; // this.getReferencesEnd();
    const refStart: IEdge[] = this.edgesStart; // this.getReferencesStart();
    let i: number;
    if (!refreshEdge) { return; }
    for (i = 0; i < refEnd.length; i++) { if (refEnd[i]) { refEnd[i].refreshGui(); } }
    for (i = 0; i < refStart.length; i++) { if (refStart[i]) { refStart[i].refreshGui(); } } }
  getReferencesEnd(): IReference[] {
    U.pe(this.logic() instanceof IPackage, 'unexpected, still todo.');
    return (this.logic() as IClass).referencesIN; }
  getReferencesStart(): IReference[] {
    U.pe(this.logic() instanceof IPackage, 'unexpected, still todo.');
    return (this.logic() as IClass).references; }
  setSizeHtml(p: Size) { return this.setSize( this.owner.toGraphCoordS(p) ); }
  draw() {
    let htmlRaw: SVGForeignObjectElement;
    if (this.package) {
      htmlRaw = this.package.getStyle() as SVGForeignObjectElement;
      this.drawP(this.package, htmlRaw);
      this.addEventListeners(this.classe.html);
    } else {
      htmlRaw = this.classe.getStyle() as SVGForeignObjectElement;
      this.drawC(this.classe, htmlRaw);
      this.addEventListeners(this.classe.html);
    }
    this.autosize();
  }
  private autosize(refreshVertex: boolean = true, refreshEdge: boolean = true, debug: boolean = false): IVertex {
    const modelPiece: ModelPiece = this.package ? this.package : this.classe;
    const singleChildren = modelPiece.html.firstChild as HTMLElement;
    const autosize: string = singleChildren.dataset.autosize;
    // console.log('autosize() ? ', modelPiece.html, ' dataset.autosize:', autosize);
    if (autosize !== '1' && autosize !== 't' && autosize !== 'true') { return this; }
    // console.log('autosize() started');
    U.pe(modelPiece.html.children.length !== 1, 'To use autosize the ForeignObject element must have a single wrapper/shell children.');
    U.pe(!(modelPiece.html.firstChild instanceof HTMLElement), 'the wrapper must be an html element (no svg)');
    if (singleChildren.style.height !== 'auto') {
      U.pw(true, 'To use autosize the ForeignObject single children must have "height: auto;", this has been automatically solved.');
      singleChildren.style.height = 'auto'; }
    const zoomLevel: number = DetectZoom.device();
    //
    const actualSize: Size = U.sizeof(singleChildren);
    U.pif(debug, 'size of(', singleChildren, ') = ', actualSize);
    // todo: ritorna sempre width = 4??
    actualSize.w = (actualSize.w === 4 ? 200 : actualSize.w); // bug fix temporaneo
    actualSize.w = (actualSize.w / this.owner.zoom.x) / zoomLevel;
    actualSize.h = (actualSize.h / this.owner.zoom.x) / zoomLevel;
    this.setSize(new GraphSize(this.size.x, this.size.y, actualSize.w, actualSize.h), refreshVertex, refreshEdge);
    return this;
  }
  private drawP(data: IPackage, htmlRaw: SVGForeignObjectElement): void {
    this.package.html = this.drawCommonVertex(data, htmlRaw); }
  private drawC(data: IClass, htmlRaw: SVGForeignObjectElement): void {
    // console.log('drawC()');
    U.pe(!this.classe, 'class null?', data, htmlRaw);
    const html = this.classe.html = this.drawCommonVertex(data, htmlRaw);
    /// append childrens:
    const $attContainer = $(html).find('.AttributeContainer');
    const $refContainer = $(html).find('.ReferenceContainer');

    if ($attContainer.length !== 1 ) {
      U.pw(true, // todo: falli diventare pw
        'Invalid user defined template: there must be exactly one element with class "AttributeContainer".' +
        ' The parent or default template will be loaded instead.', '$attrContainers:', $attContainer,
        ' StyleHtml:', html, 'raw:', htmlRaw);
      if (this.classe.customStyle) { this.classe.customStyle = null; } else { this.classe.metaParent.styleOfInstances = null; }
      return this.draw(); }
    if ($refContainer.length !== 1 ) {
      U.pw(true,
      'Invalid user defined template: there must be exactly one element with class "ReferenceContainer".' +
      ' The parent or default template will be loaded instead.', '$refContainers:', $refContainer, ' StyleHtml:', this.classe.html);
      if (this.classe.customStyle) { this.classe.customStyle = null; } else { this.classe.metaParent.styleOfInstances = null; }
      return this.draw(); }
    const attContainer = $attContainer[0];
    const refContainer = $refContainer[0];
    let i: number;
    for (i = 0; i < data.attributes.length; i++) {
      // console.log('append attr:', data.attributes[i]);
      const attr = this.drawA(data.attributes[i]);
      attContainer.appendChild(attr); }
    for (i = 0; i < data.references.length; i++) {
      // console.log('append ref:', data.references[i]);
      const refField = this.drawR(data.references[i]);
      refContainer.appendChild(refField);
    }
  }
  drawCommonVertex(data: IPackage | IClass, htmlRaw: HTMLElement | SVGElement): HTMLElement | SVGElement {
    // console.log('drawCV()');
    console.log(this.owner, this);
    const graphHtml: HTMLElement | SVGElement = this.owner.vertexContainer;
    if (graphHtml.contains(data.html)) { graphHtml.removeChild<HTMLElement | SVGElement>(data.html); }
    // console.log('drawing Vertex[' + data.name + '] with style:', htmlRaw, 'logic:', data);
    // console.log('drawVertex: template:', htmlRaw);
    data.html = U.replaceVars<HTMLElement | SVGElement>(data, htmlRaw);
    data.linkToLogic(data.html);
    graphHtml.appendChild<HTMLElement | SVGElement>(data.html);
    // console.log('this.style:', this.style);
    // console.log('this.size? (' + (!!this.size) + ': setSize() : ', U.getSvgSize(this.style));
    // console.log('drawC_Vertex. size:', this.size, data.html, this.size = U.getSvgSize(data.html as SVGForeignObjectElement));
    if (!this.size) { this.size = U.getSvgSize(data.html as SVGForeignObjectElement); } else { this.setSize(this.size); }
    data.html.dataset.vertexID = '' + this.id;
    return data.html; }

  drawA(data: IAttribute): HTMLElement | SVGElement {
    const htmlRaw: HTMLElement | SVGElement = data.getStyle();
    U.pe(!htmlRaw, 'failed to get attribute style:', data);
    if (data.getModelRoot().isM()) { data.replaceVarsSetup(); }
    let html: HTMLElement | SVGElement = U.cloneHtml(htmlRaw);
    html = data.html = U.replaceVars<HTMLElement | SVGElement>(data, htmlRaw, false);
    // console.log('draw Attribute[' + data.midname + '] with style:', htmlRaw, 'logic:', data);
    data.linkToLogic(html);
    data.refreshGUI();
    return html; }

  drawR(data: IReference): HTMLElement | SVGElement {
    const htmlRaw = data.getStyle() as HTMLElement;
    const html = data.html = U.replaceVars<HTMLElement>(data, htmlRaw);
    // console.log('draw Reference[' + data.midname + '] with style:', htmlRaw, 'logic:', data);
    data.linkToLogic(html);
    return html; }

  toEdge(start: IVertex, end: IVertex): IEdge {
    // todo
    return null;
  }
  addEventListeners(html: HTMLElement | SVGElement): void {
    this.owner.addGraphEventListeners(); // todo: spostalo per efficienza.
    // todo: viene chiamato 1 volta per ogni elementNode con modelID, ma io eseguo tutto dalla radice.
    // quindi viene eseguito N +1 volte per ogni vertice dove N sono i suoi (attributes + references)
    // console.log(html.tagName, html.dataset.modelPieceID);
    // if (html.tagName.toLowerCase() === 'foreignobject' && html.dataset.modelPieceID )
    //   { html = html.firstChild as HTMLElement | SVGElement; }
    // while (!(html.classList.contains('Vertex'))) { console.log(html); html = html.parentNode as HTMLElement | SVGElement; }
    const $html = $(html);
    $html.off('mousedown.vertex').on('mousedown.vertex', (evt: MouseDownEvent) => { IVertex.getvertex(evt).onMouseDown(evt); });
    $html.off('mouseup.vertex').on('mouseup.vertex', (evt: MouseUpEvent) => { IVertex.getvertex(evt).onMouseUp(evt); });
    $html.off('mousemove.vertex').on('mousemove.vertex', (evt: MouseMoveEvent) => { IVertex.getvertex(evt).onMouseMove(evt); });
    $html.off('mouseenter.vertex').on('mouseenter.vertex', (evt: MouseEnterEvent) => { IVertex.getvertex(evt).onMouseEnter(evt); });
    $html.off('mouseleave.vertex').on('mouseleave.vertex', (evt: MouseLeaveEvent) => { IVertex.getvertex(evt).onMouseLeave(evt); });
    const $addFieldButtonContainer = $html.find('.addFieldButtonContainer');
    $addFieldButtonContainer.find('button').off('click.addField').on('click.addField',
      (evt: ClickEvent) => { IVertex.getvertex(evt).addFieldClick(evt); });
    $addFieldButtonContainer.find('select').off('change.addField').on('change.addField',
      (evt: ClickEvent) => { IVertex.getvertex(evt).addFieldClick(evt); });
    $html.find('input').off('change.fieldchange').on('change.fieldchange', (e: ChangeEvent) => IVertex.FieldNameChanged(e));
    $html.find('select').off('change.fieldchange').on('change.fieldchange', (e: ChangeEvent) => IVertex.FieldNameChanged(e));
    // NB: deve essere solo un off, oppure metti selettore .NOT(class) nel selettore dei 'select' di sopra
    $html.find('.AddFieldSelect').off('change.fieldchange');
    $html// .find('[data-modelPieceID]')
    // todo: inserisci campo in IAttribute, IReference, typeSelector: stringa  = <optgrp>
    // da inserire dentro il template con select, così puoi editare lo stile e le classi del select
      .off('click.pbar').on('click.pbar',
      (e: ClickEvent) => {IVertex.ChangePropertyBarContentClick(e); } );
    // if (!IVertex.contextMenu) { IVertex.contextMenu = new MyContextMenuClass(new ContextMenuService()); }
    $html.off('contextmenu').on('contextmenu', (evt: ContextMenuEvent) => {
      DamContextMenuComponent.contextMenu.show(new Point(evt.pageX, evt.pageY), '.Vertex', evt.currentTarget);
      evt.stopPropagation();
      return false;
    });
    $html.find('.Attribute').off('contextmenu').on('contextmenu', (evt: ContextMenuEvent) => {
      DamContextMenuComponent.contextMenu.show(new Point(evt.pageX, evt.pageY), '.Feature', evt.currentTarget);
      evt.stopPropagation();
      return false;
    });
    $html.find('.Reference').off('contextmenu').on('contextmenu', (evt: ContextMenuEvent) => {
      DamContextMenuComponent.contextMenu.show(new Point(evt.pageX, evt.pageY), '.Feature', evt.currentTarget);
      evt.stopPropagation();
      return false;
    });
    U.eventiDaAggiungereAlBody('setreference');
    $(document).off('mousemove.setReference').on('mousemove.setReference', (e: MouseMoveEvent) => {
      const ref: IReference = IEdge.refChanging;
      if (!ref) { return; }
      U.pe(!ref.edges, 'ref.edges === null', IEdge.refChanging);
      let edge: IEdge;
      if (ref.upperbound > 0 && ref.edges.length >= ref.upperbound) {
        edge = ref.edges[ref.edges.length - 1]; } else { edge = new IEdge(ref);
      }
      let hoveringTarget: IClass = null;
      let html: HTMLElement | SVGGElement = e.target as HTMLElement | SVGGElement;
      while (html && html.classList && !html.classList.contains('vertexShell')) { html = html.parentNode as HTMLElement | SVGGElement; }
      hoveringTarget = html ? ModelPiece.getLogic(html) as IClass : null;
      if (hoveringTarget) {
        const linkable: boolean = ref.canBeLinkedTo(hoveringTarget);
        // todo: vertexmouseleave -> de-mark(key=refhover);
        const size: GraphSize = hoveringTarget.vertex.size;
        const width = 3;
        const pad = 5 + width;
        const padding: GraphSize = new GraphSize(pad, pad, pad, pad);
        hoveringTarget.mark(true, 'refhover',
          linkable ? 'green' : 'red',
          (size.w + padding.x + padding.w) / 10,
          (size.h + padding.y + padding.h) / 10,
          width, null, padding);
      }
      edge.tmpEnd = GraphPoint.fromEvent(e);
      edge.tmpEndVertex = hoveringTarget ? hoveringTarget.vertex : null;
      edge.refreshGui(null, false);
    });
    $('.LinkVertex').off('mousedown.setReference').on('mousedown.setReference', (e: MouseDownEvent) => {
      e.stopPropagation();
      const ref: IReference = IEdge.refChanging = ModelPiece.get(e) as IReference;
      if (!ref) { return; }
      U.pe(!ref.edges, 'ref.edges === null', IEdge.refChanging);
      let edge: IEdge;
      if (ref.upperbound > 0 && ref.edges.length >= ref.upperbound) {
        edge = ref.edges[ref.edges.length - 1]; } else { edge = new IEdge(ref);
      }
      edge.useRealEndVertex = false;
      edge.useMidNodes = true;
      edge.tmpEnd = GraphPoint.fromEvent(e);
      edge.tmpEndVertex = (ref.parent as IClass).getVertex();
      edge.refreshGui();
    });

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
  }

  onMouseDown(e: MouseDownEvent) {
    IVertex.selected = this;
    IVertex.selectedStartPt = this.owner.toGraphCoord(new Point(e.pageX, e.pageY));
    IVertex.selectedStartPt.subtract(this.size.tl(), false);
  }
  onMouseUp(e: MouseUpEvent) {
    IVertex.selected = null;
  }
  onMouseMove(e: MouseMoveEvent) {

  }
  onMouseEnter(e: MouseEnterEvent) {}
  onMouseLeave(e: MouseLeaveEvent) {}
  addFieldClick(e: ClickEvent) {
    const modelPiece: IClass = this.classe;
    U.pe(!this.classe, 'called addFieldClick on a package');
    Status.status.debug = true;
    let select: HTMLSelectElement;
    // const debugOldJson = U.cloneObj(modelPiece.generateModel());
    select = $(modelPiece.html).find('.addFieldButtonContainer').find('select')[0] as unknown as HTMLSelectElement;
    switch (select.value) {
      default: U.pe(true, 'unexpected select value for addField:' + select.value); break;
      case 'Reference': modelPiece.addReference(); break;
      case 'Attribute': modelPiece.addAttribute(); break; }
    EType.fixPrimitiveTypeSelectors();
    // modelPiece.getModelRoot().refreshGUI();
    // modelPiece.getModelRoot().refreshInstancesGUI();
    // console.log('addFieldClick(); pre:', debugOldJson, ', post:', modelPiece.getJson());
  }
  setFields(f: IField[]) {
    this.fields = f;
  }

  setGraph(graph: IGraph) {
    this.owner = graph;
  }

  refreshGUI(): void { this.draw(); }

  moveTo(graphPoint: GraphPoint, gridIgnore: boolean = false): void {
    // console.log('moveTo(', graphPoint, '), gridIgnore:', gridIgnore, ', grid:');
    const size: GraphSize = U.getSvgSize(this.logic().html as SVGForeignObjectElement);
    if (!gridIgnore) { graphPoint = this.owner.fitToGrid(graphPoint); }
    this.setSize(new GraphSize(graphPoint.x, graphPoint.y, size.w, size.h)); }

  logic(): IPackage | IClass { return this.classe ? this.classe : this.package; }
  html(): HTMLElement | SVGElement { return this.logic().html; }
  minimize(): void {
    U.pe(true, 'minimize() to do.');
  }

  isDrawn(): boolean {
    const logic = this.logic();
    return !!(logic.html && logic.html.parentNode); }

  pushUp(): void {
    if (!this.isDrawn()) { return; }
    const html = this.logic().html;
    const parent = html.parentNode;
    parent.removeChild(html);
    parent.appendChild(html); }

  pushDown(): void {
    if (!this.isDrawn()) { return; }
    const html = this.logic().html;
    const parent = html.parentNode;
    parent.removeChild(html);
    parent.prepend(html); }

  remove() {
    while (this.edgesStart.length > 0) { this.edgesStart[0].remove(); }
    while (this.edgesEnd.length > 0) { this.edgesEnd[0].remove(); }
    const html = this.html();
    html.parentNode.removeChild(html); }

  getSize(): GraphSize {
    // this.owner.markgS(this.size, true, 'blue');
    const html0: SVGForeignObjectElement = this.html() as SVGForeignObjectElement;
    return U.getSvgSize(html0);
}
}
