import {
  Dictionary,
  EdgePointStyle,
  EdgeStyle, GraphSize, EdgeModes,
  IAttribute,
  IClass,
  IEdge,
  IFeature,
  IModel,
  IPackage,
  IReference,
  IVertex,
  Json, Model, Status,
  U
} from '../common/Joiner';
import ClickEvent = JQuery.ClickEvent;
import MouseMoveEvent = JQuery.MouseMoveEvent;
import MouseDownEvent = JQuery.MouseDownEvent;
import MouseUpEvent = JQuery.MouseUpEvent;

export abstract class ModelPiece {
  private static idToLogic = {};
  private static idMax = 0;
  protected json: Json = null;
  id: number = null;
  metaParent: ModelPiece = null;
  instances: ModelPiece[] = [];
  parent: ModelPiece = null;
  childrens: ModelPiece[] = [];
  name: string = null;
  midname: string = null;
  fullname: string = null;
  vertex: IVertex = null;
  edge: IEdge = null;
  edges: IEdge[] = [];
  edgeStyleCommon: EdgeStyle = null;
  edgeStyleHighlight: EdgeStyle = null;
  edgeStyleSelected: EdgeStyle = null;
  uri_var: string = null;
  // styleRaw: HTMLElement | SVGElement = null;
  // style: HTMLElement | SVGElement = null;
  // htmlRaw: HTMLElement | SVGForeignObjectElement = null;
  html: HTMLElement | SVGElement = null;
  styleOfInstances: HTMLElement | SVGElement = null;
  customStyle: HTMLElement | SVGElement;
  markHtml: SVGRectElement = null;
  marks: Dictionary<string, SVGRectElement> = {};

  // todo: remove() vs delete() ? ho implementato tutte e 2.
  static Remove(obj: ModelPiece | IFeature | IReference | IAttribute): ModelPiece | IFeature | IReference | IAttribute {
    const oldi = obj.getChildIndex();
    const childArr = Json.getChildrens(obj.parent.json) as any[];
    console.log('ModelPiece.remove(), json:', obj.parent.json, 'childArr:', childArr);
    let i;
    for (i = oldi; i + 1 < childArr.length; i++) {
      childArr[i] = childArr[i + 1]; // delete in the model.
      childArr[i] = childArr[i + 1]; // fill parent.children[] hole
      // this.parent.classes[i].childindex = i; // fix child index
    }
    childArr[i] = undefined; // dopo lo shift devo cancellare l'ultimo (che è una copia del penultimo)
    // this.styleEditor.remove(); // rimuove dalla toolbar
    return obj; }

  static GetChildIndex(obj: ModelPiece): number {
    const childArr = Json.getChildrens(obj.parent.json) as any[];
    // console.log('getChildIndex() parent.Json: ', obj.parent.json, 'childArr: ', childArr);
    for (let i = 0; i < childArr.length; i++) {
      // console.log('cond: ', childArr[i] === obj.json, 'childarr[' + i + ']: ', childArr[i], ' === obj.json: ', obj.json);
      if (childArr[i] === obj.json) { return i; }
    }
    U.pe(true, 'childindex not found. iModelPiece.getChildIndex(); parent:', obj.parent, 'childArr:', childArr, 'this: ', obj);
  }
  static Mark(obj: ModelPiece | IFeature | IReference | IAttribute, bool: boolean): void {return; }
  static Validate(obj: ModelPiece | IFeature | IReference | IAttribute): boolean {
    return true; // todo:
  }
  static getModelRoot(thiss: ModelPiece | IFeature | IReference | IAttribute): IModel {
    let p: ModelPiece = thiss;
    let i = 0;
    while (p.parent && p !== p.parent && i++ < 6) { p = p.parent; }
    const model: IModel = p as IModel;
    U.pe(!model || !(p instanceof IModel), 'failed to get model root:', thiss, 'm lastParent:', p);
    return model; }

  static get(e: JQuery.ChangeEvent | ClickEvent | MouseMoveEvent | MouseDownEvent | MouseUpEvent): ModelPiece {
    return ModelPiece.getLogic(e.target); }
  static getLogic(html: HTMLElement | SVGElement): ModelPiece {
    if (!html) { return null; }
    while ( html && (!html.dataset || !html.dataset.modelPieceID)) { html = html.parentNode as HTMLElement | SVGElement; }
    return html ? ModelPiece.getByID(+html.dataset.modelPieceID) : null; }

  static getByID(id: number): ModelPiece { return ModelPiece.idToLogic[id]; }
  static LinkToLogic<T extends HTMLElement | SVGElement>(modelpiece: ModelPiece | IAttribute | IReference, html: T) {
    U.pe(modelpiece.id === null || modelpiece.id === undefined, 'undefined id.', modelpiece);
    html.dataset.modelPieceID = '' + modelpiece.id; }

  /*
    wrong: how do i detect class root iModel?
    static isPkg(thiss: ModelPiece): boolean { return ( thiss.name === thiss.fullname ); }
    static isClass(thiss: ModelPiece): boolean { return ( ! ModelPiece.isPkg(thiss) && thiss.name === thiss.midname ); }
    static isFeature(thiss: ModelPiece): boolean { return ( ! ModelPiece.isPkg(thiss) && !ModelPiece.isClass(thiss) ); }*/



  static setJson(thiss: ModelPiece, j: Json): Json {
    U.pe(!j, 'json assigned to ', j);
    return thiss.json = j; }

  static getPrintableTypeName(eType: string): string {
    const pos = eType.lastIndexOf('#//');
    return eType.substring(pos + 3); }

  constructor(parent: ModelPiece, metaVersion: ModelPiece) {
    this.parent = parent == null ? this : parent;
    // if (!metaVersion) { metaVersion = this; }
    this.metaParent = metaVersion;
    this.instances = [];
    if (this.metaParent) { this.metaParent.instances.push(this); this.metaParent.refreshGUI(); this.metaParent.refreshInstancesGUI(); }
    this.loadEdgeStyles();
    this.assignID(); }

  loadEdgeStyles(): void {
    this.edgeStyleCommon = new EdgeStyle(EdgeModes.angular23Auto, 2, '#ffffff',
      new EdgePointStyle(5, 1, '#ffffff', '#0000ff'));
    this.edgeStyleHighlight = new EdgeStyle(null, 4, '#ffffff',
      new EdgePointStyle(5, 1, '#ffffff', '#ff0000' ));
    this.edgeStyleSelected = new EdgeStyle(null, 3, '#ffffff',
      new EdgePointStyle(7, 4, '#ffffff', '#ff0000' ));
  }
  isChildNameTaken(s: string) {
    let i;
    for (i = 0; i < this.childrens.length; i++) { if (s === this.childrens[i].name) { return true; } }
    return false;
  }
  getParentInheritedStyle(): HTMLElement | SVGElement { return this.metaParent.styleOfInstances; }
  assignID(): number {
    this.id = ModelPiece.idMax++;
    ModelPiece.idToLogic[this.id] = this;
    return this.id; }
  linkToLogic<T extends HTMLElement | SVGElement>(html: T) { return ModelPiece.LinkToLogic(this, html); }
  setName(value: string, refreshGUI: boolean = false) {
    value = '' + value.trim();
    U.pe(!value, 'wrong name:');
    // if(this.json) { Json.write(this.json, 'name', value); }
    this.name = value; }
  setJson(j: Json): Json { return ModelPiece.setJson(this, j); }
  getJson(): Json { return this.json = this.generateModel(); }
  // abstract modify(json: Json, destructive: boolean);
  modify(json: Json, destructive: boolean) { // todo: rendilo astratto.
    this.setJson(json);
    this.setName(Json.read<string>(this.json, 'name')); }
  remove(): ModelPiece | IFeature | IReference | IAttribute {return ModelPiece.Remove(this); }
  abstract refreshGUI(): void;
  refreshInstancesGUI(): void {
    let i = 0;
    while (i < this.instances.length) {
      try { this.instances[i++].refreshGUI(); } catch (e) {} finally {}
    }
  }
  getChildIndex(): number {return ModelPiece.GetChildIndex(this); }
  mark(bool: boolean, key: string, color: string = 'red', radiusX: number = 10, radiusY: number = 10,
       width: number = 5, backColor: string = 'none', extraOffset: GraphSize = null): void {
    if (color === null) { color = 'yellow'; }
    if (radiusX === null) { radiusX = 10; }
    if (radiusY === null) { radiusY = 10; }
    if (backColor === null) { backColor = 'none'; }
    if (width === null) { width = 5; }
    let mark: SVGRectElement = this.marks[key];
    // mark off
    if (mark && false) {
      if (mark.parentNode) { mark.parentNode.removeChild(mark); }
      delete this.marks[key]; }
    if (!bool) { return; }
    // mark on
    if (!this.html) { return; }
    // if (mark) { return; }
    if (!extraOffset) { const same = 5; extraOffset = new GraphSize(same, same, same, same); }
    mark = this.marks[key] = U.newSvg<SVGRectElement>('rect');
    const size: GraphSize = this.vertex.getSize();
    console.log('extraoffset:', extraOffset, 'size:', size);
    size.x -= extraOffset.x;
    size.y -= extraOffset.y;
    size.w += extraOffset.x + extraOffset.w;
    size.h += extraOffset.y + extraOffset.h;
    mark.setAttributeNS(null, 'x', '' + size.x);
    mark.setAttributeNS(null, 'y', '' + size.y);
    mark.setAttributeNS(null, 'width', '' + (size.w));
    mark.setAttributeNS(null, 'height', '' + (size.h));
    mark.setAttributeNS(null, 'rx', '' + (radiusX));
    mark.setAttributeNS(null, 'ry', '' + (radiusY));
    mark.setAttributeNS(null, 'stroke', '' + (color));
    mark.setAttributeNS(null, 'stroke-width', '' + (width));
    mark.setAttributeNS(null, 'fill', '' + (backColor));
    this.getModelRoot().graph.vertexContainer.prepend(mark); }
  validate(): boolean {return ModelPiece.Validate(this); }
  abstract generateModel(): Json;
  generateModelString(): string { return JSON.stringify(this.generateModel(), null, 4); }


  getNamespaced(): string {
    const str: string = this.getModelRoot().namespace();
    if (this instanceof Model) { return str; }
    return str + ':' + (this.metaParent ? this.metaParent.name : this.name); }

  shouldBeDisplayedAsEdge(set: boolean = null): boolean {
    // todo
    return set && false; }

  /*getModelRoot(): IModel {
    let root: ModelPiece = this;
    while (root.parent !== root) { root = root.parent; }
    return root as IModel; }*/
  getModelRoot(): IModel { return ModelPiece.getModelRoot(this); }

  abstract duplicate(nameAppend: string, newParent: ModelPiece): ModelPiece;
  abstract delete(): void;

//  setName(value: string) { return ModelPiece.setName(this, value); }
  // abstract generateVertex(): IVertex;
  // abstract generateEdge(): IEdge;

  abstract fieldChanged(e: JQuery.ChangeEvent): void;

  getStartPointHtml(): HTMLElement | SVGElement {
    const $start = $(this.html).find('.StartPoint');
    if ($start.length > 0) { return $start[0]; }
    return (this.html.tagName.toLowerCase() === 'foreignobject') ? this.html.firstChild as HTMLElement | SVGElement : this.html;
  }
  getEndPointHtml(): HTMLElement | SVGElement {
    const $start = $(this.html).find('.EndPoint');
    if ($start.length > 0) { return $start[0]; }
    return (this.html.tagName.toLowerCase() === 'foreignobject') ? this.html.firstChild as HTMLElement | SVGElement : this.html; }

  getStyle(): HTMLElement | SVGElement {
    const debug: boolean = true;
    // prima precedenza: stile personale.
    // U.pif(true, 'getStyle().super().customStyle = ', this.customStyle, this);
    if (this.customStyle && (this.customStyle + '' as any) !== this.customStyle) { return this.customStyle; }
    // U.pif(true, 'getStyle().super().parent.instanceStyle = ', this.metaParent.styleOfInstances, this);
    // seconda precedenza: stile del meta-parent.
    if (this.metaParent && this.metaParent.styleOfInstances && !U.isString(this.metaParent.styleOfInstances)) {
      return this.metaParent.styleOfInstances; }
    return null; }
  abstract processTemplate(htmlRaw: HTMLElement | SVGElement): HTMLElement | SVGElement;

  getInfo(toLower: boolean = true): any {
    const info: any = {};
    const instancesInfo: any = {};
    const childrenInfo: any = {};
    const model: IModel = this.getModelRoot();
    info['' + 'tsClass'] = (model.isMM() ? 'm' : '') + 'mModelPiece';
    if (this.fullname) { info['' + 'fullname'] = this.fullname; }
    info['' + 'this'] = this;
    info['' + 'instance'] = instancesInfo;
    info['' + 'childrens'] = childrenInfo;
    let i = -1;
    const set = (baseJson: any, k: string, v: any) => { while (baseJson[k]) { k = '_' + k; } baseJson[k] = v; };
    while (++i < this.childrens.length) {
      const child = this.childrens[i];
      if (model.isMM()) {
        set(info, child.name.toLowerCase(), child);
      } else { set(childrenInfo, '' + i, child); }
    }
    i = -1;
    while (++i < this.instances.length) {
      const child = this.instances[i];
      set(instancesInfo, '' + i, child);
    }
    return info;
  }
}
