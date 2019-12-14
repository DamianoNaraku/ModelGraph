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
  IReference,
  M3Reference,
  EdgeStyle,
  EdgeModes,
  EdgePointStyle, MetaModel, Info, IClass,
} from '../../../../common/Joiner';

export class M2Reference extends IReference {
  static stylesDatalist: HTMLDataListElement;
  parent: M2Class;
  metaParent: M3Reference;
  instances: MReference[];

  upperbound: number;
  lowerbound: number;
  containment: boolean = false && false;

  constructor(classe: M2Class, json: Json) {
    super(classe, Status.status.mmm.getReference());
    if (!classe && !json) { return; } // empty constructor for .duplicate();
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
    this.parsePrintableTypeName(eType);
    this.linkClass();
    this.containment = Json.read<boolean>(json, ECoreReference.containment, false);
    this.setLowerbound(Json.read<number>(json, ECoreReference.lowerbound, 0));
    this.setUpperbound(Json.read<number>(json, ECoreReference.upperbound, 1));
    let i: number;/*
    this.views = [];
    for(i = 0; i < this.parent.views.length; i++) {
      const pv: ClassView = this.parent.views[i];
      const v = new ReferenceView(pv);
      this.views.push(v);
      pv.referenceViews.push(v); }*/
  }

  generateModel(): Json {
    const model = new Json(null);
    model[ECoreReference.xsitype] = 'ecore:EReference';
    model[ECoreReference.eType] = '#//' + this.classType.name;
    model[ECoreReference.namee] = this.name;
    if (this.lowerbound != null && !isNaN(+this.lowerbound)) { model[ECoreReference.lowerbound] = +this.lowerbound; }
    if (this.upperbound != null && !isNaN(+this.lowerbound)) { model[ECoreReference.upperbound] = +this.upperbound; }
    if (this.containment != null) { model[ECoreReference.containment] = this.containment; }
    return model; }

  generateEdge(): IEdge[] {
    const e: IEdge = new IEdge(this, this.parent.getVertex(), this.classType.getVertex());
    return [e]; }

  useless(): void {}

  fieldChanged(e: JQuery.ChangeEvent) {
    const html: HTMLElement = e.currentTarget;
    switch (html.tagName.toLowerCase()) {
      default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
      case 'textarea':
      case 'input': this.setName((html as HTMLInputElement).value); break;
      case 'select':
        const select: HTMLSelectElement = html as HTMLSelectElement;
        const m: M2Class = ModelPiece.getByID(+select.value) as any;
        this.linkClass(m); break;
    }
  }

  setContainment(b: boolean): void { this.containment = b; }

  setUpperbound(n: number): void {
    this.upperbound = n;
    let i = -1;
    while (++i < this.instances.length) {
      const mref: MReference = this.instances[i];
      mref.delete(mref.mtarget.length, Number.POSITIVE_INFINITY); } }

  delete(linkStart: number = null, linkEnd: number = null): void {
    super.delete(linkStart, linkEnd);
    // total deletion
    if (linkStart === null && linkEnd === null) {
      U.arrayRemoveAll(this.classType.referencesIN, this);
      return; } }
/*
  getStyle(debug: boolean = true): HTMLElement | SVGElement {
    const raw: HTMLElement | SVGElement = super.getStyle(debug);
    const $raw = $(raw);
    const $selector = $raw.find('select.ClassSelector');
    M2Class.updateMMClassSelector($selector[0] as HTMLSelectElement, this.classType);
    return raw; }*/

  duplicate(nameAppend: string = '_Copy', newParent: M2Class = null): M2Reference {
    const r: M2Reference = new M2Reference(null, null);
    return r.copy(this, nameAppend, newParent); }

  copy(r: M2Reference, nameAppend: string = '_Copy', newParent: M2Class = null): M2Reference {
    super.copy(r, nameAppend, newParent);
    this.lowerbound = r.lowerbound;
    this.upperbound = r.upperbound;
    this.containment = r.containment;
    if (r.classType) { this.typeClassFullnameStr = r.classType.fullname(); }
    this.linkClass();
    this.refreshGUI();
    return this; }


  linkClass(classe: M2Class = null, id: number = null, refreshGUI: boolean = true, debug: boolean = false): void {
    super.linkClass(classe, id, debug);
    if (!Status.status.mm) { return; }
    this.classType.referencesIN.push(this);
    if (this.edges && this.edges[0]) { this.edges[0].setTarget(this.classType.vertex); this.edges[0].refreshGui(); }
    U.pif(debug, 'ref target changed; targetFullName:' + this.classType.fullname() + '; this.targetStr:' + this.typeClassFullnameStr +
      '; target:', this.classType, 'inside:', this);
    if (refreshGUI) { this.refreshGUI(debug); } }

  conformability(meta: M3Reference, debug: boolean = true): number { U.pw(true, 'it\'s ok but should not be called'); return 1; }

  getInfo(toLower: boolean = true): any {
    const info: any = super.getInfo();
    // set('typeOriginal', this.type);
    // info['' + 'tsClass'] = (this.getModelRoot().getPrefix()) + 'Reference';
    Info.rename(info, 'type', 'target');
    Info.rename(info, 'typeDetail', 'targetDetail');
    Info.set(info, 'containment', this.containment);
    const targetinfo: Info = this.classType ? this.classType.getInfo(toLower) : {};
    Info.set(info, 'target', targetinfo);
    Info.merge(info, targetinfo);
    return info; }


  canBeLinkedTo(hoveringTarget: M2Class): boolean {
    if (this.classType === hoveringTarget) { return true; }
    const extendedTargetClasses: M2Class[] = this.classType.getExtendedClassArray();
    let i: number;
    for (i = 0; i < extendedTargetClasses.length; i++) {
      if (this.classType === extendedTargetClasses[i]) { return true; }
    }
    return false;
  }

}