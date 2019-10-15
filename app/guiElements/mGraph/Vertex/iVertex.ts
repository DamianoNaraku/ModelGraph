import {
  Json,
  U,
  IEdge,
  IField,
  IPackage,
  M2Class,
  IAttribute,
  AttribETypes,
  IFeature,
  ModelPiece,
  ISidebar,
  IGraph,
  IModel,
  IClass,
  Point,
  DamContextMenuComponent,
  IClassChild,
  Status,
  Size,
  Model,
  IReference,
  Dictionary,
  DetectZoom,
  PropertyBarr,
  EType,
  MClass,
  MReference,
  M2Reference,
  EOperation,
  EParameter,
  MAttribute, MeasurableArrays
} from '../../../common/Joiner';
import MouseMoveEvent = JQuery.MouseMoveEvent;
import MouseDownEvent = JQuery.MouseDownEvent;
import MouseUpEvent = JQuery.MouseUpEvent;
import MouseEnterEvent = JQuery.MouseEnterEvent;
import MouseLeaveEvent = JQuery.MouseLeaveEvent;
import ClickEvent = JQuery.ClickEvent;
import ChangeEvent = JQuery.ChangeEvent;
import ContextMenuEvent = JQuery.ContextMenuEvent;
import KeyDownEvent = JQuery.KeyDownEvent;
import KeyUpEvent = JQuery.KeyUpEvent;
import KeyPressEvent = JQuery.KeyPressEvent;
import ResizableOptions = JQueryUI.ResizableOptions;
import DraggableOptions = JQueryUI.DraggableOptions;
import ResizableUIParams = JQueryUI.ResizableUIParams;
import DraggableEventUIParams = JQueryUI.DraggableEventUIParams;

export class GraphPoint {
  x: number;
  y: number;
  dontmixwithPoint: any;
  static getM(firstPt: GraphPoint, secondPt: GraphPoint): number { return (firstPt.y - secondPt.y) / (firstPt.x - secondPt.x); }
  static getQ(firstPt: GraphPoint, secondPt: GraphPoint): number { return firstPt.y - GraphPoint.getM(firstPt, secondPt) * firstPt.x; }
  static fromEvent(e: ClickEvent | MouseMoveEvent | MouseUpEvent | MouseDownEvent | MouseEnterEvent | MouseLeaveEvent | MouseEvent)
    : GraphPoint {
    if (!e) { return null; }
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
    return false; }

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
    return !( m2 >= m1Min && m2 <= m1Max); }

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

  getM(pt2: GraphPoint): number { return GraphPoint.getM(this, pt2); }
  degreeWith(pt2: GraphPoint, toRadians: boolean) {
    const directionVector: GraphPoint = this.subtract(pt2, true);
    const ret: number = Math.atan2(directionVector.y, directionVector.x);
    return toRadians ? ret : U.RadToDegree(ret); }

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

  equals(size: GraphSize) { return this.x === size.x && this.y === size.y && this.w === size.w && this.h === size.h; }

  /// field-wise Math.min()
  min(minSize: GraphSize, clone: boolean): GraphSize {
    const ret: GraphSize = clone ? this.clone() : this;
    if (!isNaN(minSize.x) && ret.x < minSize.x) { ret.x = minSize.x; }
    if (!isNaN(minSize.y) && ret.y < minSize.y) { ret.y = minSize.y; }
    if (!isNaN(minSize.w) && ret.w < minSize.w) { ret.w = minSize.w; }
    if (!isNaN(minSize.h) && ret.h < minSize.h) { ret.h = minSize.h; }
    return ret; }

  max(maxSize: GraphSize, clone: boolean): GraphSize {
    const ret: GraphSize = clone ? this.clone() : this;
    if (!isNaN(maxSize.x) && ret.x > maxSize.x) { ret.x = maxSize.x; }
    if (!isNaN(maxSize.y) && ret.y > maxSize.y) { ret.y = maxSize.y; }
    if (!isNaN(maxSize.w) && ret.w > maxSize.w) { ret.w = maxSize.w; }
    if (!isNaN(maxSize.h) && ret.h > maxSize.h) { ret.h = maxSize.h; }
    return ret; }
  // end of GraphSize
}

export class IVertex {
  static all: Dictionary = {};
  static ID = 0;
  static selected: IVertex = null;
  static selectedStartPt: GraphPoint = null;
  private static oldEdgeLinkHoveringVertex: IVertex = null;
  private static minSize: GraphSize = new GraphSize(null, null, 200, 30);
  classe: IClass;
  // package: IPackage;
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
  private htmlForeign: SVGForeignObjectElement;
  private html: HTMLElement;
  private Vmarks: Dictionary<string, SVGRectElement> = {};

  static linkVertexMouseDown(e: MouseDownEvent, edge: IEdge = null): void {
    if (e) { e.stopPropagation(); }
    if (IEdge.edgeChanging) { IEdge.edgeChanging.owner.edgeChangingAbort(e); }
    const ref: IReference = edge ? edge.logic as IReference : ModelPiece.get(e) as IReference;
    U.pe( !(ref instanceof IReference), 'The .LinkVertex element must be inserted only inside a reference field.');
    if (!edge) {
      const edges: IEdge[] = ref.getEdges();
      U.pe(!edges, 'ref.edges === null', ref);
      if (ref.upperbound > 0 && edges.length >= ref.upperbound) { edge = edges[edges.length - 1]; } else { edge = new IEdge(ref); } }
    IEdge.edgeChanging = edge;
    edge.useRealEndVertex = false;
    edge.useMidNodes = true;
    edge.tmpEnd = GraphPoint.fromEvent(e);
    edge.tmpEndVertex = null;
    // edge.tmpEndVertex = ref.parent.getVertex();
    edge.refreshGui(); }

  static getvertex(e: Event | MouseEvent | MouseDownEvent | MouseUpEvent | MouseMoveEvent | MouseEnterEvent | MouseLeaveEvent | ClickEvent
    | KeyDownEvent | KeyUpEvent | KeyPressEvent | ChangeEvent): IVertex {
    return IVertex.getvertexByHtml(e.currentTarget as HTMLElement | SVGElement); }

  static getvertexByHtml(node: HTMLElement | SVGElement): IVertex {
    while (!node.dataset.vertexID) { node = node.parentNode as HTMLElement | SVGElement; }
    // console.log('getVertex by id:' + node.dataset.vertexID, 'all:', IVertex.all);
    return IVertex.getByID(+(node.dataset.vertexID)); }

  static getByID(id: number): IVertex { return IVertex.all[id]; }

  static FieldNameChanged(e: ChangeEvent) {
    const html: HTMLElement | SVGElement = e.currentTarget;
    const modelPiece: ModelPiece = ModelPiece.getLogic(html);
    modelPiece.fieldChanged(e);
    modelPiece.getModelRoot().graph.propertyBar.show(null, false, true);
    // $(html).trigger('click'); // updates the propertyBar
    // const m: IModel = modelPiece.getModelRoot();
    const mm: IModel = Status.status.mm;
    const m: IModel = Status.status.m;
    setTimeout( () => { mm.refreshGUI(); m.refreshGUI(); }, 1); }

  static ChangePropertyBarContentClick(e: ClickEvent, isEdge: boolean = false) {
    const html: HTMLElement | SVGElement = e.target; // todo: approfondisci i vari tipi di classType (current, orginal...)
    const modelPiece: ModelPiece = ModelPiece.getLogic(html);
    const model: IModel = modelPiece.getModelRoot();
    U.pe(!modelPiece, 'failed to get modelPiece from html:', html);
    const pbar: PropertyBarr = model.graph.propertyBar;
    pbar.show(modelPiece, isEdge, false); }

  static GetMarkedWith(markKey: string, colorFilter: string = null): IVertex[] {
    const ret: IVertex[] = [];
    for (const id in IVertex.all) {
      if (!IVertex.all[id]) { continue; }
      const vertex: IVertex = IVertex.all[id];
      if (vertex.isMarkedWith('refhover', colorFilter)) { ret.push(vertex); } }
    return ret; }

  constructor(classe: IClass) {
    this.id = IVertex.ID++;
    IVertex.all[this.id] = this;
    const graph: IGraph = classe.getModelRoot().graph;
    this.logic(classe);
    if (graph) { graph.addVertex(this); }
    this.contains = [];
    this.fields = [];
    this.edgesStart = [];
    this.edgesEnd = []; }

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


  mark(markb: boolean, key: string, color: string = 'red', radiusX: number = 10, radiusY: number = 10,
       width: number = 5, backColor: string = 'none', extraOffset: GraphSize = null): void {
    if (!this.isDrawn()) { return; }
    if (color === null) { color = 'yellow'; }
    if (radiusX === null) { radiusX = 10; }
    if (radiusY === null) { radiusY = 10; }
    if (backColor === null) { backColor = 'none'; }
    if (width === null) { width = 5; }
    let mark: SVGRectElement = this.Vmarks[key];
    if (key === 'refhover') { // crosshair (+), alias (default+link), cell (excel)
      const vertexRoot: SVGForeignObjectElement = this.htmlForeign;
      const $inputs = $(vertexRoot).find('input, textarea, select, button');
      let cursor: string = null;
      console.log('markedHover', markb, vertexRoot, $inputs);
      if (markb) {
        vertexRoot.style.cursor = cursor = (color === 'red' ? 'no-drop' : 'crosshair'); // NO important, bugga e non setta il campo.
      } else { vertexRoot.style.removeProperty('cursor'); }
      let i: number;
      for (i = 0; i < $inputs.length; i++) {
        if (!cursor) { $inputs[i].style.removeProperty('cursor'); } else { $inputs[i].style.cursor = cursor; }
      }
    }
    // mark off
    if (!markb) { // se non deve essere marchiato
      if (mark) { // ma lo è attualmente
        if (mark.parentNode) { mark.parentNode.removeChild(mark); }
        delete this.Vmarks[key]; }
      return; }
    // mark on
    if (!extraOffset) { const same = 5; extraOffset = new GraphSize(same, same, same, same); }
    mark = this.Vmarks[key] = U.newSvg<SVGRectElement>('rect');
    const size: GraphSize = this.getSize();
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
    this.logic().getModelRoot().graph.vertexContainer.prepend(mark); }

  getStartPoint(nextPt: GraphPoint = null): GraphPoint { return this.getMidPoint(nextPt); }
  getEndPoint(nextPt: GraphPoint = null): GraphPoint { return this.getMidPoint(nextPt); }
  getMidPoint(prevPt: GraphPoint = null): GraphPoint {
    // NB: MAI fare sizeof() di un SVGForeignObjectElement, ridà valori sballati. fallo ai suoi childs.
    const html: HTMLElement = this.getHtml();
    const $htmlEP = $(html).find('.EndPoint');
    let htmlEP: HTMLElement;
    let endPointSize: Size;
    let pt: GraphPoint;
    if ($htmlEP.length === 0) { htmlEP = html; } else { htmlEP = $htmlEP[0]; }
    endPointSize = U.sizeof(htmlEP);
    // console.log('htmlsize:', htmlSize, 'childSize:', U.sizeof(html.firstChild as HTMLElement));
    // console.log('real size(', htmlSize, ') vs graphSize(', this.toGraphCoordS(htmlSize), '), html:', html);
    const endPointGSize: GraphSize = this.owner.toGraphCoordS(endPointSize);
    const vertexGSize = this.getSize();
    pt = endPointGSize.tl();
    pt.x += endPointGSize.w / 2;
    pt.y += endPointGSize.h / 2;
    if (! prevPt ) { return pt; }
    pt = GraphSize.closestIntersection(vertexGSize, prevPt, pt, this.owner.grid);
    U.pe(!U.isOnEdge(pt, vertexGSize), 'not on Vertex edge.');
    return pt; }

  setSize(size: GraphSize, refreshVertex: boolean = true, refreshEdge: boolean = true) {
    U.pe(!size, 'setPosition: null');
    const oldSize: GraphSize = this.size.clone();
    this.size = size;
    const htmlForeign: SVGForeignObjectElement = this.getHtmlRawForeign();
    U.setSvgSize(htmlForeign, this.size);
    // todo: cerca tutti gli as string, non è un vero cast ma solo un cambiotipo senza trasformazione, crea errori.
    // const spostamento: GraphPoint = this.size.tl().subtract(oldSize.tl(), true);
    // todo: cambia struttura interna size in tl+br, controlla tutti i riferimenti a tl(newinstnce = false) e considera di cambiarli a true.
    if (refreshVertex) { this.refreshGUI(); }
    if (!refreshEdge) { return; }
    const refEnd: IEdge[] = this.edgesEnd; // this.getReferencesEnd();
    const refStart: IEdge[] = this.edgesStart; // this.getReferencesStart();
    let i: number;
    for (i = 0; i < refEnd.length; i++) { if (refEnd[i]) { refEnd[i].refreshGui(); } }
    for (i = 0; i < refStart.length; i++) { if (refStart[i]) { refStart[i].refreshGui(); } } }

  draw(): void {
    const htmlRaw: SVGForeignObjectElement = this.classe.getStyle();
    this.drawC(this.classe, htmlRaw);
    this.addEventListeners();
    U.fixHtmlSelected($(htmlRaw));
    this.autosize(false, false); }

  private autosize(refreshVertex: boolean = true, refreshEdge: boolean = true, debug: boolean = false): IVertex {
    const html: HTMLElement = this.getHtml();
    const autosize: string = html.dataset.autosize;
    // console.log('autosize() ? ', modelPiece.html, ' dataset.autosize:', autosize);
    if (autosize !== '1' && autosize !== 't' && autosize !== 'true') { return this; }
    // console.log('autosize() started');
    if (html.style.height !== 'auto') {
      U.pw(true, 'To use autosize the root node must have "height: auto;", this has been automatically solved. was:' + html.style.height);
      html.style.height = 'auto'; }
    // const zoomLevel: number = DetectZoom.device();
    const actualSize: GraphSize = this.owner.toGraphCoordS(U.sizeof(html));
    // const minSize: GraphSize = new GraphSize(null, null, 200, 30);
    actualSize.min(IVertex.minSize, false);
    U.pe(actualSize.h === 100, '', IVertex.minSize, actualSize, html);
    this.setSize(new GraphSize(this.size.x, this.size.y, actualSize.w, actualSize.h), refreshVertex, refreshEdge);
    return this; }

  private drawC(data: IClass, htmlRaw: SVGForeignObjectElement): void { return this.drawC0(data, htmlRaw); }
  // todo: attiva questo in produzione
  private drawC_NonDebug(data: IClass, htmlRaw: SVGForeignObjectElement): void {
    try {
      this.drawC0(data, htmlRaw);
    } catch (e) {
      let level: number;
      if (this.classe.customStyle) { level = 1;
      } else {
        if (this.classe.metaParent.styleOfInstances) { level = 2;
        } else { level = 3; } }
      U.pw(true,
        'Invalid user defined template:' + e.toString() + ', at style level ' + level +
        '. The Higher level template will be loaded instead.', ' HtmlCustomStyle:', htmlRaw);

      switch (level) {
        case 1: data.setStyle_SelfLevel_1(null); break;
        case 2: data.metaParent.setStyle_InstancesLevel_2(null); break;
        case 3: data.setStyle_GlobalLevel_3(null); break;
        default: U.pe(true, 'unexpected level.', this, data, htmlRaw); break; }
      this.draw();
    } finally {}
  }
  private drawC0(data: IClass, htmlRaw: SVGForeignObjectElement): void {
    // console.log('drawC()');
    U.pe(!this.classe, 'class null?', data, htmlRaw);
    this.setHtmls(data, htmlRaw);
    const htmlForeign: SVGForeignObjectElement = this.htmlForeign;
    const html: HTMLElement = this.html;
    /// append childrens:
    const $attContainer = $(html).find('.AttributeContainer');
    const $refContainer = $(html).find('.ReferenceContainer');
    const $opContainer = $(html).find('.OperationContainer');

    // U.pe($attContainer.length !== 1, 'there must be exactly one element with class "AttributeContainer".', $attContainer);
    // U.pe($refContainer.length !== 1, 'there must be exactly one element with class "ReferenceContainer".', $refContainer);
    // U.pe($opContainer.length !== 1, 'there must be exactly one element with class "OperationContainer".', $opContainer);
    // const attContainer = $attContainer[0];
    // const refContainer = $refContainer[0];
    // const opContainer = $opContainer[0];
    let i: number;

    for (i = 0; i < data.attributes.length; i++) {
      const field = this.drawA(data.attributes[i]);
      $attContainer.append(field); }

    for (i = 0; i <  data.references.length; i++) {
      const field = this.drawR(data.references[i]);
      $refContainer.append(field); }

    const operations: EOperation[] = data.getOperations();
    for (i = 0; i < operations.length; i++) {
      // console.log('append ref:', data.references[i]);
      const field = this.drawO(operations[i]);
      $opContainer.append(field); }
  }
  getStartPointHtml(): HTMLElement | SVGElement {
    const html: HTMLElement = this.getHtml();
    const $start = $(html).find('.StartPoint');
    if ($start.length > 0) { return $start[0]; } else { return html; } }
  getEndPointHtml(): HTMLElement | SVGElement {
    const html: HTMLElement | SVGElement = this.getHtml();
    const $start = $(html).find('.EndPoint');
    if ($start.length > 0) { return $start[0]; }
    return (html.tagName.toLowerCase() === 'foreignobject') ? html.firstChild as HTMLElement | SVGElement : html; }

  private setHtmls(data: IClass, htmlRaw: SVGForeignObjectElement): SVGForeignObjectElement {
    // console.log('drawCV()');
    const graphHtml: HTMLElement | SVGElement = this.owner.vertexContainer;
    if (graphHtml.contains(this.htmlForeign)) { graphHtml.removeChild<SVGElement>(this.htmlForeign); }
    // console.log('drawing Vertex[' + data.name + '] with style:', htmlRaw, 'logic:', data);
    // console.log('drawVertex: template:', htmlRaw);
    const foreign: SVGForeignObjectElement = this.htmlForeign = U.replaceVars<SVGForeignObjectElement>(data, htmlRaw, true);
    data.linkToLogic(foreign);
    graphHtml.appendChild<HTMLElement | SVGElement>(foreign);
    // console.log('this.style:', this.style);
    // console.log('this.size? (' + (!!this.size) + ': setSize() : ', U.getSvgSize(this.style));
    // console.log('drawC_Vertex. size:', this.size, data.html, this.size = U.getSvgSize(data.html as SVGForeignObjectElement));
    if (!this.size) { this.size = this.getSize(); } else { this.setSize(this.size, false, false); }

    foreign.dataset.vertexID = '' + this.id;
    if (this.htmlForeign.childNodes.length !== 1) { throw new Error('The custom style must have a single root node.'); }
    this.html = this.htmlForeign.firstChild as HTMLElement;
    return foreign; }

  drawO(data: EOperation): HTMLElement | SVGElement {
    const html: HTMLElement | SVGElement =  this.drawTerminal(data);
    const $html = $(html);
    const $signature = $html.find('.specialjs.signature');
    let i: number;
    for (i = 0; i < $signature.length; i++) {
      const htmldataset: HTMLElement = $signature[0] as HTMLElement;
      data.setSignatureHtml(htmldataset, ', ', +htmldataset.dataset.maxargumentchars, +htmldataset.dataset.maxarguments); }
    const $detailHtml: JQuery<HTMLElement> = $html.find('.operationDetail') as JQuery<HTMLElement> ;
    $signature.off('click.show').on('click.show', (e: Event) => {
      const target: HTMLElement | SVGElement = e.target as HTMLElement | SVGElement;
      let avoidToggle: boolean;
      switch (target.tagName.toLowerCase()) {
        case 'input':
        case 'textarea':
        case 'select': avoidToggle = true; break;
        default: avoidToggle = ((target instanceof HTMLElement) && target.isContentEditable); break; }
      if (avoidToggle) { return; }
      data.detailIsOpened = !data.detailIsOpened;
      data.detailIsOpened ? $detailHtml.show() : $detailHtml.hide();
      this.autosize(false, true);
    });
    data.detailIsOpened ? $detailHtml.show() : $detailHtml.hide();

    const $typeHtml: JQuery<HTMLSelectElement> = $detailHtml.find('select.returnType') as JQuery<HTMLSelectElement>;
    for (i = 0; i < $typeHtml.length; i++) { PropertyBarr.makeFullTypeSelector($typeHtml[0], data.primitiveType, data.classType, true); }
    $html.find('input.name').val(data.name);
    const $parameterList = $detailHtml.find('.parameterList');
    let j: number;
    for (j = 0; j < $parameterList.length; j++) {
      const parameterList = $parameterList[j];
      // U.clear(parameterList);
      const lastChild: Node = parameterList.childNodes[parameterList.childNodes.length - 1];
      for (i = 0; i < data.childrens.length; i++) {
        const field = this.drawParam(data.childrens[i]);
        parameterList.insertBefore(field, lastChild); }
      // for (i = oldChilds.length; i > 0; i--) { parameterList.prepend(oldChilds.item(i)); }
    }

    const $addParamButton = $html.find('.addParameterButton');
    $addParamButton.html('<button style="width: 100%; height: 100%;">+</button>');
    $addParamButton.off('click.add').on('click.add', (e: Event) => { data.addParameter(); this.refreshGUI(); });
    return html; }

  drawParam(data: EParameter): HTMLElement | SVGElement {
    let i: number;
    const html: HTMLElement | SVGElement = this.drawTerminal(data);
    const $html = $(html);
    const $typeHtml: JQuery<HTMLSelectElement> = $html.find('select.fullType') as JQuery<HTMLSelectElement>;
    for (i = 0; i < $typeHtml.length; i++) { PropertyBarr.makeFullTypeSelector($typeHtml[0], data.primitiveType, data.classType); }
    const $nameHtml: JQuery<HTMLInputElement> = $html.find('input.name') as JQuery<HTMLInputElement>;
    $nameHtml.val(data.name);
    return html; }

  drawA(data: IAttribute): HTMLElement | SVGElement { return this.drawTerminal(data); }
  drawR(data: IReference): HTMLElement | SVGElement { return this.drawTerminal(data); }

  drawTerminal(data: IClassChild): HTMLElement | SVGElement {
    data.replaceVarsSetup();
    const htmlRaw: HTMLElement | SVGElement = data.getStyle();
    U.pe(!htmlRaw, 'failed to get attribute style:', data);
    // todo: sposta l'opearzione nei Graph.Field
    const html: HTMLElement | SVGElement = U.replaceVars<HTMLElement | SVGElement>(data, htmlRaw, true);
    data.linkToLogic(html);
    return html; }

  toEdge(start: IVertex, end: IVertex): IEdge {
    // todo
    U.pe(true, 'vertexToEdge() todo.');
    return null; }

  addEventListeners(): void {
    this.owner.addGraphEventListeners(); // todo: spostalo per efficienza.
    // todo: viene chiamato 1 volta per ogni elementNode con modelID, ma io eseguo tutto dalla radice.
    // quindi viene eseguito N +1 volte per ogni vertice dove N sono i suoi (attributes + references)
    // console.log(html.tagName, html.dataset.modelPieceID);
    // if (html.tagName.toLowerCase() === 'foreignobject' && html.dataset.modelPieceID )
    //   { html = html.firstChild as HTMLElement | SVGElement; }
    // while (!(html.classList.contains('Vertex'))) { console.log(html); html = html.parentNode as HTMLElement | SVGElement; }
    const $html = $(this.getHtmlRawForeign());
    const thiss: IVertex = this;
    $html.off('mousedown.vertex').on('mousedown.vertex', (e: MouseDownEvent) => { thiss.onMouseDown(e); });
    $html.off('mouseup.vertex').on('mouseup.vertex', (e: MouseUpEvent) => { thiss.onMouseUp(e); });
    $html.off('mousemove.vertex').on('mousemove.vertex', (e: MouseMoveEvent) => { thiss.onMouseMove(e); });
    $html.off('mouseenter.vertex').on('mouseenter.vertex', (e: MouseEnterEvent) => { thiss.onMouseEnter(e); });
    $html.off('mouseleave.vertex').on('mouseleave.vertex', (e: MouseLeaveEvent) => { thiss.onMouseLeave(e); });
    $html.off('click').on('click', (e: ClickEvent) => { thiss.onClick(e); });
    const $addFieldButtonContainer: JQuery<HTMLElement> = $html.find('.addFieldButtonContainer') as any as JQuery<HTMLElement>;
    this.setAddButtonContainer($addFieldButtonContainer[0]);
    $addFieldButtonContainer.find('button').off('click.addField').on('click.addField',
      (e: ClickEvent) => {thiss.addFieldClick(e); });
    $addFieldButtonContainer.find('select').off('change.addField').on('change.addField',
      (e: ClickEvent) => {thiss.addFieldClick(e); });
    $html.find('input, select').off('change.fieldchange').on('change.fieldchange', (e: ChangeEvent) => IVertex.FieldNameChanged(e));
    // NB: deve essere solo un off, oppure metti selettore .NOT(class) nel selettore dei 'select' di sopra
    $html.find('.AddFieldSelect').off('change.fieldchange');
    // if (!IVertex.contextMenu) { IVertex.contextMenu = new MyContextMenuClass(new ContextMenuService()); }
    $html.off('contextmenu').on('contextmenu', (e: ContextMenuEvent) => { thiss.vertexContextMenu(e); });
    $html.find('.Attribute, .Reference').off('contextmenu').on('contextmenu', (e: ContextMenuEvent) => { thiss.featureContextMenu(e); });
    $html.find('.LinkVertex').off('mousedown.setReference').on('mousedown.setReference', IVertex.linkVertexMouseDown);
    const defaultResizeConfig: ResizableOptions = {};
    const defaultDragConfig: DraggableOptions = {};
    // NB: do not delete the apparantly useless dynamic functions.
    // jqueryui is binding this to e.currentTarget and e.currentTarget to document.body, the dynamic function makes this instanceof iVertex again.
    defaultResizeConfig.create = (e: Event, ui: ResizableUIParams) => this.measuringInit(ui, e);
    defaultDragConfig.create = (e: Event, ui: DraggableEventUIParams) => this.measuringInit(ui, e);
    defaultResizeConfig.resize = (e: Event, ui: ResizableUIParams) => this.measuringChanging(ui, e);
    defaultDragConfig.drag = (e: Event, ui: DraggableEventUIParams) => this.measuringChanging(ui, e);
    defaultResizeConfig.stop = (e: Event, ui: ResizableUIParams) => this.measuringChanged(ui, e);
    defaultDragConfig.stop = (e: Event, ui: DraggableEventUIParams) => this.measuringChanged(ui, e);
    console.log('measurableElementSetup:', defaultResizeConfig, defaultDragConfig);
    U.measurableElementSetup($html, defaultResizeConfig, defaultDragConfig); }

  measuringInit(ui: ResizableUIParams | DraggableEventUIParams, e: Event): void {
    const m = U.measurableGetArrays(null, e);
    console.log('measuringInit:', ui, e, m);
    let i: number;
    const size: Size = U.sizeof(m.html);
    const absTargetSize: Size = U.sizeof(this.owner.container);
    const logic: IClass = this.logic();
    for (i = 0; i < m.variables.length; i++) { U.processMeasurableVariable(m.variables[i], logic, m.html, size, absTargetSize); }
    for (i = 0; i < m.dstyle.length; i++) { U.processMeasurableDstyle(m.dstyle[i], logic, m.html, null, absTargetSize); }
    for (i = 0; i < m.imports.length; i++) { U.processMeasurableImport(m.imports[i], logic, m.html, null, absTargetSize); }
  }

  measuringChanging(ui: ResizableUIParams | DraggableEventUIParams, e: Event, measurHtml: HTMLElement | SVGElement = null): void {
    const m: MeasurableArrays = U.measurableGetArrays(measurHtml, e);
    console.log('Changing.measurableHtml parsed special attributes:', m);
    m.imports = [];
    m.chainFinal = [];
    U.processMeasuring(this.logic(), m, ui);
  }

  measuringChanged(ui: ResizableUIParams | DraggableEventUIParams, e: Event, measurHtml: HTMLElement | SVGElement = null): void {
    const m = U.measurableGetArrays(measurHtml, e);
    console.log('Changed.measurableHtml parsed special attributes:', m);
    m.chain = [];
    m.imports = [];
    U.processMeasuring(this.logic(), m, ui);
  }


  clickSetReference(e: ClickEvent | MouseUpEvent | MouseDownEvent, debug: boolean = true): void {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    const edge: IEdge = IEdge.edgeChanging;
    if (!edge) { return; }
    U.pif(debug, 'setreferenceClick success!');
    const vertexLogic: IClass = this.logic();
    if (!edge.logic.canBeLinkedTo(vertexLogic)) {
      U.pif(debug, 'edge ', edge.logic, 'cannot be linked to ', vertexLogic, 'hoveringvertex:', this);
      return; }
    (edge.logic as IReference).linkClass(vertexLogic);
    this.mark(false, 'refhover');
    // altrimenti parte l'onClick su AddFieldButton quando fissi la reference.
    // setTimeout( () => { IEdge.edgeChanging = null; }, 1);
    IEdge.edgeChangingStopTime = Date.now();
    IEdge.edgeChanging = null;
    edge.tmpEnd = null;
    edge.useMidNodes = true;
    edge.useRealEndVertex = true;
    edge.end = this;
    edge.refreshGui(); }

  onClick(e: ClickEvent): void {
    IVertex.ChangePropertyBarContentClick(e); }


  featureContextMenu(evt: ContextMenuEvent): boolean {
    DamContextMenuComponent.contextMenu.show(new Point(evt.pageX, evt.pageY), '.Feature', evt.currentTarget);
    evt.stopPropagation();
    return false; }

  vertexContextMenu(evt: ContextMenuEvent): boolean {
    DamContextMenuComponent.contextMenu.show(new Point(evt.pageX, evt.pageY), '.Vertex', evt.currentTarget);
    evt.stopPropagation();
    return false; }

  onMouseDown(e: MouseDownEvent): void {
    if (IEdge.edgeChanging) { this.clickSetReference(e); return; }
    let tmp: HTMLElement = e.target as HTMLElement;
    const thisHtml = this.getHtml();
    // i will not move the vertex while moving a measurable children.
    while (tmp !== thisHtml) { if (tmp.classList.contains('measurable')) { return; } tmp = tmp.parentElement; }
    IVertex.selected = this;
    IVertex.selectedStartPt = this.owner.toGraphCoord(new Point(e.pageX, e.pageY));
    IVertex.selectedStartPt.subtract(this.size.tl(), false); }

  onMouseUp(e: MouseUpEvent): void {
    if (IEdge.edgeChanging) { this.clickSetReference(e); return; }
    IVertex.selected = null; }

  onMouseMove(e: MouseMoveEvent): void { }
  onMouseEnter(e: MouseEnterEvent): void { this.mouseEnterLinkPreview(e); }
  onMouseLeave(e: MouseLeaveEvent): void { this.mouseLeaveLinkPreview(e); }

  mouseEnterLinkPreview(e: MouseEnterEvent): void {
    const edge: IEdge = IEdge.edgeChanging;
    if (!edge) { return; }
    const ref: IReference | IClass = edge.logic;
    /*const edges: IEdge[] = ref.getEdges();
    U.pe(!edges, 'ref.edges === null', ref);
    let edge: IEdge;
    if (ref.upperbound > 0 && edges.length - 1 >= ref.upperbound) { edge = edges[edges.length - 1]; } else { edge = new IEdge(ref); }*/
    const html2: HTMLElement | SVGElement = e.currentTarget as HTMLElement | SVGGElement;
    // while (html2 && html2.classList && !html2.classList.contains('vertexShell')) { html2 = html2.parentNode as HTMLElement | SVGElement;}
    let hoveringTarget: IClass = html2 ? ModelPiece.getLogic(html2) as IClass : null;
    U.pe(!hoveringTarget || !(hoveringTarget instanceof IClass),
      'the currentTarget should point to the vertex root, only class should be retrieved.', hoveringTarget, e, html2);
    if (false && false) {
    } else if (hoveringTarget instanceof IReference) { hoveringTarget = hoveringTarget.parent;
    } else if (hoveringTarget instanceof IAttribute) { hoveringTarget = hoveringTarget.parent;
    } else if (hoveringTarget instanceof IClass) { } else { hoveringTarget = null; }
    const linkable: boolean = ref.canBeLinkedTo(hoveringTarget);
    const size: GraphSize = hoveringTarget.getVertex().getSize();
    const width = 3;
    const pad = 5 + width;
    const padding: GraphSize = new GraphSize(pad, pad, pad, pad);
    const vertex: IVertex = hoveringTarget.getVertex();
    // const oldHoverVertex: IVertex = window.oldEdgeLink_HoveringVertex;
    // if (oldHoverVertex) { vertex.mark(false, 'refhover'); }
    // window.oldEdgeLink_HoveringVertex = vertex;
    vertex.mark(true, 'refhover',
      linkable ? 'green' : 'red',
      (size.w + padding.x + padding.w) / 10,
      (size.h + padding.y + padding.h) / 10,
      width, null, padding);
    edge.tmpEndVertex = hoveringTarget.getVertex();
    // NB: serve farlo 2 volte, alla prima ripristina il targetEnd ma non corregge lo startingpoint adattandolo alla nuova destinazione.
    edge.refreshGui(null, false); edge.refreshGui(null, false); }

  mouseLeaveLinkPreview(evt: MouseLeaveEvent, debug: boolean = true): void {
    if (!IEdge.edgeChanging) { return; }
    const edge: IEdge = IEdge.edgeChanging;
    U.pif(debug, 'vertexLeave()');
    edge.tmpEndVertex = null;
    edge.tmpEnd = GraphPoint.fromEvent(evt);
    this.mark(false, 'refhover'); }

  addFieldClick(e: ClickEvent): void {
    // impedisco che un click mentre fisso un edge triggeri altre cose, 100ms di "cooldown"
    if (IEdge.edgeChanging || Date.now() - IEdge.edgeChangingStopTime < 100) { return; }
    U.pe(!(this.classe instanceof M2Class), 'AddFieldClick should only be allowed on M2Classes.');
    const modelPiece: M2Class = this.classe as M2Class;
    U.pe(!this.classe, 'called addFieldClick on a package');
    Status.status.debug = true;
    const html = this.getHtml();
    let select: HTMLSelectElement;
    // const debugOldJson = U.cloneObj(modelPiece.generateModel());
    select = $(html).find('.addFieldButtonContainer').find('select')[0] as unknown as HTMLSelectElement;
    switch (select.value) {
      default: U.pe(true, 'unexpected select value for addField:' + select.value); break;
      case 'Reference': modelPiece.addReference(); break;
      case 'Attribute': modelPiece.addAttribute(); break;
      case 'Operation': modelPiece.addOperation(); break; }
    EType.fixPrimitiveTypeSelectors(); }

  setAddButtonContainer(container: HTMLElement): void {
    U.toHtml('<span style="display:flex; margin:auto;">Add&nbsp;</span>' +
      '<select class="AddFieldSelect" style="display:flex; margin:auto;"><optgroup label="FeatureType">' +
      '<option value="Attribute" selected="">Attribute</option>' +
      '<option value="Reference">Reference</option>' +
      '<option value="Operation">Operation</option>' +
      '</optgroup></select>' +
      '<span style="display:flex; margin:auto;">&nbsp;field</span>\n' +
      '<button>Go</button>', container); }

  setFields(f: IField[]) {
    this.fields = f;
  }

  setGraph(graph: IGraph) { this.owner = graph; }

  refreshGUI(): void { this.draw(); }

  moveTo(graphPoint: GraphPoint, gridIgnore: boolean = false): void {
    // console.log('moveTo(', graphPoint, '), gridIgnore:', gridIgnore, ', grid:');
    const size: GraphSize = this.size; // U.getSvgSize(this.logic().html as SVGForeignObjectElement);
    if (!gridIgnore) { graphPoint = this.owner.fitToGrid(graphPoint); }
    this.setSize(new GraphSize(graphPoint.x, graphPoint.y, size.w, size.h), false, true); }

  logic(set: IClass = null): IClass {
    if (set) { return this.classe = set; }
    return this.classe; }
  getHtmlRawForeign(): SVGForeignObjectElement { return this.htmlForeign; }
  getHtml(): HTMLElement { return this.html; }
  minimize(): void {
    U.pe(true, 'minimize() to do.');
  }

  isDrawn(): boolean { return !!(this.htmlForeign && this.htmlForeign.parentNode); }

  pushDown(): void {
    if (!this.isDrawn()) { return; }
    const html = this.htmlForeign;
    const parent = html.parentNode;
    parent.removeChild(html);
    parent.appendChild(html); }

  pushUp(): void {
    if (!this.isDrawn()) { return; }
    const html = this.htmlForeign;
    const parent = html.parentNode;
    parent.removeChild(html);
    parent.prepend(html); }

  remove() {
    console.log('IVertex.delete();');
    let i: number;
    // for (i = 0; i < this.edgesStart.length; i++) {}
    let arr: IEdge[];
    arr = U.ArrayCopy(this.edgesStart, false);
    for (i = 0; i < arr.length; i++) { arr[i].remove(); }
    arr = U.ArrayCopy(this.edgesEnd, false);
    for (i = 0; i < arr.length; i++) { arr[i].remove(); }
    const html = this.htmlForeign;
    html.parentNode.removeChild(html);
    delete IVertex.all[this.id];
    for (const key in this.Vmarks) {
      if (this.Vmarks[key]) { continue; }
      const mark: SVGRectElement = this.Vmarks[key];
      if (mark.parentNode) { mark.parentNode.removeChild(mark); } }
    U.arrayRemoveAll(this.owner.vertex, this);
    this.classe.vertex = null;

    const fields: IField[] = U.ArrayCopy(this.fields, false);
    for (i = 0; i < fields.length; i++) { fields[i].remove(); }

    // gc helper
    this.owner = null;
    this.size = null;
    this.edgesStart = null;
    this.edgesEnd = null; }

  getSize(debug: boolean = false): GraphSize {
    const html0: SVGForeignObjectElement = this.htmlForeign;
    let sizeOld: GraphSize;
    if (debug) {
      sizeOld = this.size ? this.size.clone() : null;
      if (this.size) { this.owner.markgS(this.size, true, 'blue'); }
    }
    const size: GraphSize = this.size = U.getSvgSize(html0, IVertex.minSize);
    U.pe(debug && !sizeOld.equals(size), 'Wrong size. this:', this);
    return this.size; }

/// end of IVertex
  isMarkedWith(markKey: string, colorFilter: string = null) {
    if (!this.Vmarks.hasOwnProperty(markKey)) { return false; }
    if (!colorFilter) { return true; }
    const markRect: SVGRectElement = this.Vmarks[markKey];
    return (markRect.getAttributeNS(null, 'stroke') === colorFilter);
  }

}
