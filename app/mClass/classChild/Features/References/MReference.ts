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
  MClass,
  MAttribute,
  U,
  ECoreAttribute,
  ECoreReference,
  ShortAttribETypes,
  IReference,
  Dictionary,
  MPackage,
  M3Reference,
  M2Reference,
  IClass,
  Info, Type,
} from '../../../../common/Joiner';

export class MReference extends IReference {
  static stylesDatalist: HTMLDataListElement;
  private static loopDetection: Dictionary<number /*MClass id*/, MClass> = {};

  parent: MClass;
  metaParent: M2Reference;
  // instances: ModelNone[];
  mtarget: MClass[];
  /*childrens: ModelPiece[];
  instances: ModelPiece[];
  metaParent: IReference;
  // parent: MClass;
  */
  // mtarget: MClass[];
  // targetStr: string;
  // constructor() {}

  constructor(classe: MClass, json: Json, metaParent: M2Reference) {
    super(classe, metaParent);
    if (!classe && !json && !metaParent) { return; } // empty constructor for .duplicate();
    this.parse(json, true); }
/*
  getStyle(): HTMLElement | SVGElement {
    const htmlRaw: HTMLElement | SVGElement = super.getStyle();
    const $html = $(htmlRaw);
    const $selector = $html.find('select.ClassSelector');
    M2Class.updateMMClassSelector($selector[0] as HTMLSelectElement, this.getm2Target());
    return htmlRaw; }*/

  getm2Target(): M2Class { return this.metaParent.type.classType; }

  endingName(valueMaxLength: number = 10): string {
    if (this.mtarget.length > 0) {
      const t: MClass = this.mtarget[0];
      if (t instanceof MClass && t.attributes.length > 0) {
        const a: MAttribute = t.attributes[0];
        return a.endingName(valueMaxLength); } }
    return ''; }
/*
  conformability(meta: M2Reference, debug: boolean = true): number {
    let comformability = 0;
    comformability += 0.1 * StringSimilarity.compareTwoStrings(this.getm2Target().name, meta.classType.name);
    // todo: devi calcolare la 90% conformability in base al tipo dedotto della classe del m1-target.
    // comformability += 0.2 * StringSimilarity.compareTwoStrings(this.name, meta.name);
    // comformability += 0.2 * (this.metaParent.containment === meta.containment ? 1 : 0);
    U.pif(debug, 'REFERENCE.comform(', this.name, {0: this}, ', ', meta.name, {0: meta}, ') = ', comformability);
    return comformability; }*/



  duplicate(nameAppend: string = '_Copy', newParent: MClass = null): MReference {
    const r: MReference = new MReference(null, null, null);
    return r.copy(this, nameAppend, newParent); }

  getInfo(toLower?: boolean): any {
    const info: Json = {};
    Info.set(info, 'target', this.mtarget);
    Info.unset(info, 'upperbound');
    Info.unset(info, 'lowerbound');
    let i: number;
    for (i = 0; i < this.mtarget.length; i++) {
      const t: MClass = this.mtarget[i];
      // todo problem: le mClassi non hanno un nome
      Info.set(info, '' + i, t); }
    return info; }

  delete(linkStart: number = null, linkEnd: number = null): void {
    super.delete(linkStart, linkEnd);
    // total deletion
    let i: number;
    if (linkStart === null && linkEnd === null) {
      const targets: MClass[] = U.ArrayCopy(this.mtarget, false);
      for (i = 0; i < targets.length; i++ ) {
        U.arrayRemoveAll(targets[i].referencesIN, this);
        U.arrayRemoveAll(this.mtarget, this.mtarget[i]); }
      return; }
    // just cut some edges
    linkEnd = Math.min(this.mtarget.length, linkEnd);
    linkStart = Math.max(0, linkStart);
    // todo: questo sistema non ammette una ref con 2 link alla stessa classe.
    for (i = linkStart; i < linkEnd; i++) { U.arrayRemoveAll(this.mtarget[i].referencesIN, this); }
  }

  getType(): Type { return (this.metaParent ? this.metaParent.getType() : null); }

  canBeLinkedTo(hoveringTarget: MClass): boolean {
    const c1: M2Class = this.getType().classType;
    const c2: M2Class = hoveringTarget.metaParent;
    return c1 === c2 || c1.isExtending(c2); }

  // link(targetStr?: string, debug?: boolean): void { throw new Error('mreference.linkByStr() should never be called'); }


  // LinkToMetaParent(ref: MReference): void { super.LinkToMetaParent(ref); }
  generateModel(): Json { MReference.loopDetection = {}; return this.generateModelLoop(); }
  generateModelLoop(): Json {
    const ret: Json[] = [];
    let i: number;
    for (i = 0; i < this.mtarget.length; i++) {
      const mclass: MClass = this.mtarget[i];
      if (MReference.loopDetection[mclass.id]) {
        // todo: in caso di loop cosa ci devo mettere nel modello?
        ret.push('LoopingReference');
        U.pw(true, 'looping reference in model');
      } else {
        MReference.loopDetection[mclass.id] = mclass;
        ret.push(mclass.generateModel());
      }
    }
    return ret;
  }
  parse(json0: Json, destructive: boolean = true): void {
    /*
        "ReferenceName": [
          { "-name": "tizio" },  <-- reference.target[0]
          { "-name": "asd" }     <-- reference.target[1]
        ]*/
    U.pe(!destructive, 'non-destructive parse of MReference to do.');
    if (!json0) { json0 = []; }
    const json: Json[] = Array.isArray(json0) ? json0 : [json0];
    const targetMM: M2Class = this.getm2Target();
    let i: number;
    if (!this.mtarget) { this.mtarget = []; }
    if (destructive) {
      for (i = 0; i < this.mtarget.length; i++) { U.arrayRemoveAll(this.mtarget[i].referencesIN, this); }
      while (this.edges.length > 0) { this.edges[0].remove(); U.arrayRemoveAll(this.edges, this.edges[0]); }
      this.edges = [];
      this.mtarget = []; }

    const pkg: MPackage = this.getClass().parent as MPackage;
    for (i = 0; i < json.length; i++) {
      // console.log('mref.parse: ', json0, json, 'i:', json[i]);
      if ($.isEmptyObject(json[i])) { continue; }
      const t: MClass = new MClass(pkg, json[i], targetMM);
      U.ArrayAdd(this.mtarget, t);
    }/*
    this.views = [];
    for(i = 0; i < this.parent.views.length; i++) {
      const pv: ClassView = this.parent.views[i];
      const v = new ReferenceView(pv);
      this.views.push(v);
      pv.referenceViews.push(v); }*/
  }

  validate(): boolean { return true; }

  generateEdge(): IEdge[] {
    // const arr: IEdge[] = [];
    let i: number;
    // while (this.edges && this.edges.length > 0) { this.edges[0].remove(); U.arrayRemoveAll(this.edges, this.edges[0]); }
    for (i = this.edges.length; i < this.mtarget.length; i++) {
      this.edges.push(new IEdge(this, this.parent.getVertex(), this.mtarget[i].getVertex()));
    }
    return this.edges; }

  copy(r: MReference, nameAppend: string = '_Copy', newParent: MClass = null): MReference {
    super.copy(r, nameAppend, newParent);
    this.mtarget = U.ArrayCopy(r.mtarget, true);
    // todo: fix edges.
    // this.link();
    this.refreshGUI();
    return r; }

  linkClass(classe: MClass = null, id: number = null, refreshGUI: boolean = true, debug: boolean = false): void {
    // super.linkClass(classe, id, debug);
    if (!Status.status.loadedLogic) { return; }
    if (!classe && id !== null) { classe = ModelPiece.getByID(id) as any as MClass; }
    let i: number;
    if (this.mtarget.indexOf(classe) >= 0) return;
    // for (i = 0; i < this.mtarget.length; i++) { U.arrayRemoveAll(this.mtarget[i].referencesIN, this); }
    console.log(classe, id, this);
    classe.referencesIN.push(this);
    this.mtarget.push(classe);
    if (this.edges) {
      this.generateEdge();
      U.pe(this.edges.length != this.mtarget.length, 'mismatch between edges and targets.', this, this.edges, this.mtarget);
      const edge: IEdge = this.edges[this.edges.length - 1];
      // edge.setTarget(this.classType.vertex);
      edge.refreshGui(); }

    U.pif(debug, 'ref target changed; target:', classe, '; inside:', this);
    if (refreshGUI) { this.refreshGUI(debug); }
  }

}
