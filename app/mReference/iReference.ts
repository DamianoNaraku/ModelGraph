import {
  AttribETypes, GraphPoint, GraphSize,
  IAttribute,
  IClass,
  IEdge,
  IFeature,
  IField,
  IModel,
  IVertex,
  Json, Model,
  ModelPiece,
  PropertyBarr, Size, Status, StringSimilarity,
  U, eCoreAttribute, eCoreReference, ShortAttribETypes, EType, MClass, MReference
} from '../common/Joiner';

export class IReference extends ModelPiece {
  // static all: any[] = [];
  type: AttribETypes = null;
  targetStr: string;
  target: IClass;
  metaParent: IReference;
  upperbound: number = null;
  lowerbound: number = null;
  containment: boolean = null;
  IAmNotAnAttribute: any;
  mtarget: MClass[];

  constructor(classe: IClass, json: Json, metaParent: IReference) {
    super(classe, metaParent);
    if (!classe && !json && !metaParent) { return; } // empty constructor for .duplicate();
    if (json === null || json === undefined) {
      if (!metaParent) {
        U.pe(classe.getModelRoot().isM(), 'metaparent cannot be null on m1 constructors');
        json = IReference.generateEmptyReference(classe);
      } else {
        U.pe(classe.getModelRoot().isMM(), 'metaparent must be null on mm constructors');
        json = MReference.generateEmptyReference(); }
    }
    this.setJson(json);
    this.modify(json, true);
  }

  static generateEmptyReference(parentClass: IClass): Json {
    const name = 'Ref';
    let namei = 1;
    const json: Json = {};
    Json.write(json, eCoreReference.xsitype, 'ecore:EReference');
    Json.write(json, eCoreReference.eType, '#//' + parentClass.name);
    Json.write(json, eCoreReference.lowerbound, '@0');
    Json.write(json, eCoreReference.upperbound, '@1');
    Json.write(json, eCoreReference.containment, 'true');
    while (parentClass.isChildNameTaken(name + '_' + namei)) { namei++; }
    Json.write(json, eCoreReference.name, name + '_' + namei);
    return json; }
  static GetDefaultStyle(model: IModel): HTMLElement { return IReference.GetDefaultStyle_Field(model); }

  private static defaultStyle_Edge(): SVGPathElement {
    // todo
    return undefined;
  }

  static GetDefaultStyle_Field(modelRoot: IModel): HTMLElement {
    const selector = '.' + (modelRoot === Status.status.m ? 'M' : 'MM') + 'DefaultStyles>.Reference.Template';
    let $template: JQuery<HTMLElement> = $(selector + '.Customized');
    if ($template.length === 0) { $template = $(selector); }
    U.pe($template.length !== 1, 'template not found? (' + $template.length + '); selector: "' + selector + '"');
    const ret = U.cloneHtml($template[0]);
    ret.classList.remove('Template');
    ret.classList.remove('Customized');
    return ret; }

  static SetDefaultStyle_Field(modelRoot: IModel, newTemplate: HTMLElement): void {
    const selector = '.' + (modelRoot === Status.status.m ? 'M' : 'MM') + 'DefaultStyles>.Reference.Template';
    let $oldTemplate: JQuery<HTMLElement> = $(selector + '.Customized');
    if ($oldTemplate.length === 0) { $oldTemplate = $(selector); }
    U.pe($oldTemplate.length !== 1, 'template not found? (' + $oldTemplate.length + '); selector: "' + selector + '"');
    const old = $oldTemplate[0];
    newTemplate.classList.add('Template');
    newTemplate.classList.add('Customized');
    old.parentNode.appendChild(newTemplate);
    if (old.classList.contains('Customized')) { old.parentNode.removeChild(old); }
    return; }

  getStyle(): HTMLElement | SVGElement {
    // prima precedenza: stile personale.
    // seconda precedenza: stile del meta-parent.
    let htmlRaw: HTMLElement | SVGElement = super.getStyle();
    if (htmlRaw) { return this.processTemplate(htmlRaw); }
    // terza precedenza: stile della sua classe.
    htmlRaw = IReference.GetDefaultStyle(this.getModelRoot());
    return this.processTemplate(htmlRaw); }

  processTemplate(htmlRaw: HTMLElement | SVGElement): HTMLElement | SVGElement {
    const $html = $(htmlRaw);
    const $selector = $html.find('select.ClassSelector');
    IClass.updateMMClassSelector($selector[0] as HTMLSelectElement, this.target);
    return htmlRaw; }

  modify(json: Json, destructive: boolean) {
    // super.modify(json, destructive);
    const modelRoot: IModel = IModel.getModelRoot(this);
    this.setJson(json);
    /// own attributes.
    this.setName(Json.read<string>(this.json, eCoreReference.name));
    const eType = Json.read<string>(json, eCoreReference.eType);
    // this.type = AttribETypes.reference;
    this.targetStr = this.parent.parent.name + '.' +  ModelPiece.getPrintableTypeName(eType);
    this.link();
    this.containment = Json.read<boolean>(json, eCoreReference.containment, false);
    this.lowerbound = Json.read<number>(json, eCoreReference.lowerbound, 1);
    this.upperbound = Json.read<number>(json, eCoreReference.upperbound, 1);
  }
  // getPrintableTypeName(): string { return ModelPiece.getPrintableTypeName(this.type as string); }

  generateModelLoop(): Json {throw new Error('should not occurr in metamodel');}
  generateModel(): Json {
    const model = new Json(null);
    model[eCoreReference.xsitype] = 'ecore:EReference';
    model[eCoreReference.eType] = '#//' + this.target.name;
    model[eCoreReference.name] = this.name;
    if (this.lowerbound != null) { model[eCoreReference.lowerbound] = this.lowerbound; }
    if (this.upperbound != null) { model[eCoreReference.upperbound] = this.upperbound; }
    if (this.containment != null) { model[eCoreReference.containment] = this.containment; }
    return model; }


  generateEdge(): IEdge[] {
    const e: IEdge = new IEdge(this, (this.parent as IClass).getVertex(), this.target.getVertex());
    return [e]; }

  generateVertex(): IVertex { U.pe(true, 'called generate vertex on a reference.'); return undefined; }
  shouldBeDisplayedAsEdge(): boolean { return true; }
  getModelRoot() { return ModelPiece.getModelRoot(this); }


  setContainment(b: boolean): void { this.containment = b; }
  setUpperBound(n: number): void {
    this.upperbound = n;
    let i = -1;
    while (++i < this.instances.length) {
      const mref: MReference = (this.instances[i] as MReference);
      mref.remove(mref.mtarget.length, Number.POSITIVE_INFINITY); } }
  setLowerBound(n: number): void { this.lowerbound = n; }

  fieldChanged(e: JQuery.ChangeEvent) {
    const html: HTMLElement = e.currentTarget;
    switch (html.tagName.toLowerCase()) {
      default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
      case 'textarea':
      case 'input': this.setName((html as HTMLInputElement).value); break;
      case 'select':
        const select: HTMLSelectElement = html as HTMLSelectElement;
        const m: ModelPiece = ModelPiece.getByID(+select.value);
        this.link(m.fullname); break;
    }
  }

  setName(name: string, refreshGUI: boolean = false): void {
    super.setName(name, refreshGUI);
    this.midname = this.parent.name + '.' + this.name;
    this.fullname = this.parent.midname + '.' + this.name;
    if (refreshGUI) { this.parent.refreshGUI(); } }

  refreshGUI(): void {
    if (!Status.status.loadedLogic) { return; }
    if (this.vertex) { this.vertex.refreshGUI(); }
    let i = -1;
    while (++i < this.edges.length) { if (this.edges[i]) { this.edges[i].refreshGui(); } }
    this.parent.refreshGUI(); }

  delete(): void {
    console.log('Reference.delete(): ', this.name);
    const parent: IClass = this.parent as IClass;
    U.arrayRemoveAll(this.metaParent.instances, this);
    U.arrayRemoveAll(parent.childrens, this);
    U.arrayRemoveAll(parent.references, this);
    U.arrayRemoveAll(this.target.referencesIN, this);
    parent.refreshGUI();
    this.target.refreshGUI(); }

  duplicate(nameAppend: string = '_Copy', newParent: IClass = null): IReference {
    console.log('Reference.duplicate(): ', this.name);
    const r: IReference = new IReference(null, null, null);
    r.setName(this.name + nameAppend);
    if (newParent) {
      r.parent = newParent;
      r.midname = r.parent.name + '.' + r.name;
      r.fullname = r.parent.fullname + '.' + r.name;
      newParent.childrens.push(r);
      newParent.references.push(r); }
    r.metaParent = this.metaParent;
    r.metaParent.instances.push(r);
    r.childrens = [];
    r.styleOfInstances = this.styleOfInstances;
    r.customStyle = this.customStyle;
    r.html = null;
    r.json = {} as Json;
    r.type = this.type;
    r.targetStr = this.targetStr;
    r.link();
    r.lowerbound = this.lowerbound;
    r.upperbound = this.upperbound;
    r.containment = this.containment;
    r.refreshGUI();
    return r; }
    link(targetStr: string = null, debug: boolean = false): void {
      if (Status.status.mm === null) { return; }
      if (this.target) { U.arrayRemoveAll(this.target.referencesIN, this); }
      if (targetStr) { this.targetStr = targetStr; }
      this.target = Status.status.mm.getClass(this.targetStr);
      U.pe(!this.target, 'reference targetStr is not a class: ', this.targetStr, ' found in: ', this.json,
        'classList: ', this.getModelRoot().getAllClasses(), ' this:', this);
      this.target.referencesIN.push(this);
      if (this.edges && this.edges[0]) { this.edges[0].setTarget(this.target.vertex); this.edges[0].refreshGui(); }
      U.pif(debug, 'ref target changed; targetStr:' + targetStr + '; this.targetStr:' + this.targetStr +
        '; target:', this.target, 'inside:', this); }
  graph() { return this.parent.vertex.owner; }


  getStartPoint(nextPt: GraphPoint = null, fixOnSides: boolean = true): GraphPoint {
    let html: HTMLElement | SVGElement;
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

  setDefaultStyle(value: string): void {
    U.pw(true, 'Reference.setDefaultStyle(): todo.');
  }
  comformability(meta: IReference): number {
    let comformability = 0;
    if (this.target)  { this.targetStr = this.target.name; }
    comformability += 0.8 * StringSimilarity.compareTwoStrings(this.targetStr, meta.target.name);
    comformability += 0.5 * 0.2 * StringSimilarity.compareTwoStrings(this.name, meta.name);
    comformability += 0.5 * 0.2 * (this.containment === meta.containment ? 1 : 0);
    console.log('REFERENCE.comform(', this.name, {0: this}, ', ', meta.name, {0: meta}, ') = ', comformability);
    return comformability; }

  linkToMetaParent(iReference: IReference) {
    this.metaParent = iReference;
  }
  getInfo(toLower: boolean = true): any {
    const info: any = super.getInfo();
    info['' + 'tsClass'] = (this.getModelRoot().isMM() ? 'm' : '') + 'mReference';
    const myinfoKey: string[] = [];
    const myinfoVal: any[] = [];
    const set = (k: string, v: any) => {
      while (info[k]) { k = '@' + k; }
      info[k] = v; };
    set('target', this.target);
    // set('typeOriginal', this.type);
    set('containment', this.containment);
    set('upperbound', this.upperbound);
    set('lowerbound', this.lowerbound);
    const targetinfo: any = !this.target ? null : this.target.getInfo(toLower);
    let key: string;
    console.log('targetinfo:', targetinfo);
    for (key in targetinfo) {
      if (!targetinfo.hasOwnProperty(key)) { continue; }
      set(key, targetinfo[key]);
    }
    return info; }

  canBeLinkedTo(hoveringTarget: IClass) {
    const targetmetaclass: IClass = this.metaParent ? this.metaParent.target : this.target;
    const hoveringmetaclass: IClass = hoveringTarget.metaParent ? hoveringTarget.metaParent as IClass : hoveringTarget;
    return hoveringmetaclass === targetmetaclass;
  }
}
