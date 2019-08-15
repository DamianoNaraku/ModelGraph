import {
  AttribETypes,
  GraphPoint,
  GraphSize,
  IAttribute,
  M2Class,
  IEdge,
  IFeature,
  IField,
  IModel,
  IVertex,
  Json,
  Model,
  ModelPiece,
  PropertyBarr,
  Size,
  Status,
  StringSimilarity,
  U,
  ECoreAttribute,
  ECoreReference,
  ShortAttribETypes,
  EType,
  MClass,
  MReference,
  ModelNone,
  IReference,
  M3Reference,
  EdgeStyle,
  EdgeModes,
  EdgePointStyle, MetaModel
} from '../common/Joiner';

export class M2Reference extends IReference {
  targetStr: string;
  m2target: M2Class;
  parent: M2Class;
  metaParent: M3Reference;
  instances: MReference[];

  upperbound: number = 0 - 1;
  lowerbound: number = 0 - 1;
  containment: boolean = false && false;

  constructor(classe: M2Class, json: Json, metaParent: IReference) {
    super(classe, metaParent);
    if (!classe && !json && !metaParent) { return; } // empty constructor for .duplicate();
    this.parse(json, true); }

  getModelRoot(): MetaModel { return super.getModelRoot() as MetaModel; }

  // todo:
  loadEdgeStyles(): void {
    this.edgeStyleCommon = new EdgeStyle(EdgeModes.angular23Auto, 2, '#ffffff',
      new EdgePointStyle(5, 1, '#ffffff', '#0000ff'));
    this.edgeStyleHighlight = new EdgeStyle(null, 4, '#ffffff',
      new EdgePointStyle(5, 1, '#ffffff', '#ff0000' ));
    this.edgeStyleSelected = new EdgeStyle(null, 3, '#ffffff',
      new EdgePointStyle(7, 4, '#ffffff', '#ff0000' ));
  }

  parse(json: Json, destructive: boolean): void {
    /// own attributes.
    this.setName(Json.read<string>(json, ECoreReference.namee, 'Ref_1'));
    const eType = Json.read<string>(json, ECoreReference.eType, '#//' + this.parent.name );
    // this.type = AttribETypes.reference;
    this.targetStr = this.parent.parent.name + '.' +  ModelPiece.getPrintableTypeName(eType);
    this.link();
    this.containment = Json.read<boolean>(json, ECoreReference.containment, false);
    this.lowerbound = Json.read<number>(json, ECoreReference.lowerbound, 0);
    this.upperbound = Json.read<number>(json, ECoreReference.upperbound, 1); }

  generateModel(): Json {
    const model = new Json(null);
    model[ECoreReference.xsitype] = 'ecore:EReference';
    model[ECoreReference.eType] = '#//' + this.m2target.name;
    model[ECoreReference.namee] = this.name;
    if (this.lowerbound != null && !isNaN(+this.lowerbound)) { model[ECoreReference.lowerbound] = +this.lowerbound; }
    if (this.upperbound != null && !isNaN(+this.lowerbound)) { model[ECoreReference.upperbound] = +this.upperbound; }
    if (this.containment != null) { model[ECoreReference.containment] = this.containment; }
    return model; }

  generateEdge(): IEdge[] {
    const e: IEdge = new IEdge(this, this.parent.getVertex(), this.m2target.getVertex());
    return [e]; }

  fieldChanged(e: JQuery.ChangeEvent) {
    const html: HTMLElement = e.currentTarget;
    switch (html.tagName.toLowerCase()) {
      default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
      case 'textarea':
      case 'input': this.setName((html as HTMLInputElement).value); break;
      case 'select':
        const select: HTMLSelectElement = html as HTMLSelectElement;
        const m: ModelPiece = ModelPiece.getByID(+select.value);
        this.link(m.fullname()); break;
    }
  }

  setContainment(b: boolean): void { this.containment = b; }

  setUpperBound(n: number): void {
    this.upperbound = n;
    let i = -1;
    while (++i < this.instances.length) {
      const mref: MReference = this.instances[i];
      mref.delete(mref.mtarget.length, Number.POSITIVE_INFINITY); } }

  setLowerBound(n: number): void { this.lowerbound = n; }

  delete(linkStart: number = null, linkEnd: number = null): void {
    super.delete(linkStart, linkEnd);
    // total deletion
    if (linkStart === null && linkEnd === null) {
      U.arrayRemoveAll(this.m2target.referencesIN, this);
      return; }

  }

  getStyle(debug: boolean = true): HTMLElement | SVGElement {
    const raw: HTMLElement | SVGElement = super.getStyle(debug);
    const $raw = $(raw);
    const $selector = $raw.find('select.ClassSelector');
    M2Class.updateMMClassSelector($selector[0] as HTMLSelectElement, this.m2target);
    return raw; }

  duplicate(nameAppend: string = '_Copy', newParent: M2Class = null): M2Reference {
    const r: M2Reference = new M2Reference(null, null, null);
    return r.copy(this, nameAppend, newParent); }

  copy(r: M2Reference, nameAppend: string = '_Copy', newParent: M2Class = null): M2Reference {
    super.copy(r, nameAppend, newParent);
    this.targetStr = r.targetStr;
    this.lowerbound = r.lowerbound;
    this.upperbound = r.upperbound;
    this.containment = r.containment;
    this.m2target = r.m2target;
    this.targetStr = r.m2target.getTargetStr();
    this.link();
    this.refreshGUI();
    return this; }


  link(targetStr: string = null, debug: boolean = false): void {
    if (targetStr) { this.targetStr = targetStr; }
    if (Status.status.mm === null) { return; }
    if (this.m2target) {
      U.arrayRemoveAll(this.m2target.referencesIN, this);
    } else {
      U.pe(!this.targetStr, 'neither target or targetStr are defined:', this);
      this.m2target = Status.status.mm.getClass(this.targetStr, true); }

    this.m2target.referencesIN.push(this);
    if (this.edges && this.edges[0]) { this.edges[0].setTarget(this.m2target.vertex); this.edges[0].refreshGui(); }
    U.pif(debug, 'ref target changed; targetStr:' + targetStr + '; this.targetStr:' + this.targetStr +
      '; target:', this.m2target, 'inside:', this); }

  conformability(meta: M3Reference, debug: boolean = true): number { U.pw(true, 'it\'s ok but should not be called'); return 1; }

  getInfo(toLower: boolean = true): any {
    const info: any = super.getInfo();
    const set = (k: string, v: any) => {
      k = toLower ? k.toLowerCase() : k;
      while (info[k]) { k = Status.status.XMLinlineMarker + k; }
      info[k] = v; };
    // set('typeOriginal', this.type);
    // info['' + 'tsClass'] = (this.getModelRoot().getPrefix()) + 'Reference';
    set('m2target', this.m2target);
    set('containment', this.containment);
    set('upperBound', this.upperbound);
    set('lowerBound', this.lowerbound);
    const targetinfo: any = !this.m2target ? null : this.m2target.getInfo(toLower);
    console.log('targetinfo:', targetinfo);
    let key: string;
    for (key in targetinfo) {
      if (!targetinfo.hasOwnProperty(key)) { continue; }
      set(key, targetinfo[key]); }
    return info; }


  canBeLinkedTo(hoveringTarget: M2Class): boolean { return this.m2target === hoveringTarget; }

}
