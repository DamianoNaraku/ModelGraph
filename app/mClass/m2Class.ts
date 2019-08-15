import {
  IVertex,
  IEdge,
  IField,
  IPackage,
  IAttribute,
  AttribETypes,
  IFeature,
  Json,
  U,
  ModelPiece,
  ISidebar,
  IGraph,
  IReference,
  Status,
  DetectZoom,
  Model,
  ECoreAttribute,
  ECoreClass,
  ECorePackage,
  ECoreReference,
  ECoreRoot,
  Point,
  GraphPoint,
  IModel,
  Size,
  StringSimilarity,
  EType,
  MAttribute,
  MReference, MClass, IClass, M2Reference, M2Feature, M3Class, M2Package, M2Attribute, M3Reference, M3Attribute, M3Feature, MetaModel
} from '../common/Joiner';
export class M2Class extends IClass {
  // static all: any[] = [];
  parent: M2Package;
  childrens: M2Feature[]; // M2Feature[];
  attributes: M2Attribute[];
  references: M2Reference[];
  referencesIN: M2Reference[] = null; // external pointers to this class.
  metaParent: M3Class = null;
  instances: MClass[] = null;


  static updateAllMMClassSelectors(root0: Element = null, updateModel: boolean = true): void {
    let root: Element = root0;
    if (!Status.status.loadedGUI) { return; }
    if (!root) { root = Status.status.mm.graph.container; }
    console.log('updateAllMMClassSelectors()');
    const $selectors = $(root).find('select.ClassSelector');
    console.log('selects:', $selectors, root);
    let i = -1;
    while (++i < $selectors.length) { M2Class.updateMMClassSelector($selectors[i] as HTMLSelectElement); }

    if (!updateModel) { return; }
    // if (Status.status.mm && Status.status.mm.sidebar) { Status.status.mm.sidebar.updateAll(); }
    if (Status.status.m && Status.status.m.sidebar) { Status.status.m.sidebar.loadDefaultHtmls(); }
    if (Status.status.m) { Status.status.m.refreshGUI(); }
  }

  static updateMMClassSelector(htmlSelect: HTMLSelectElement, selected: M2Class = null, debug = false): HTMLSelectElement {
    if (!htmlSelect || !Status.status.loadedGUI) { return; }
    const optGrp: HTMLOptGroupElement = document.createElement('optgroup');
    let toSelect: string;
    if (debug) { console.clear(); }
    if (!selected) {
      const mp: ModelPiece = ModelPiece.getLogic(htmlSelect);
      U.pif(debug, 'mp:', mp, 'select:', htmlSelect);
      // if (mp instanceof IAttribute || mp instanceof MAttribute) { selected = mp.parent as M2Class; }
      if (mp instanceof M2Reference) { selected = (mp as M2Reference).m2target; }
      if (mp instanceof MReference) { selected = (mp as MReference).getm2Target(); }
      U.pw(!selected, 'ClassSelectors must be held inside a m2-reference:', htmlSelect, 'mp:', mp) ;
      if (!selected) { return; }
    }
    toSelect = '' + selected.id;
    U.pif(debug, 'selected:', selected);
    U.clear(htmlSelect);
    htmlSelect.appendChild(optGrp);
    optGrp.setAttribute('label', 'Class list');
    const mmClasses: M2Class[] = Status.status.mm.getAllClasses();
    let i: number;
    let found: boolean = false && false;
    for (i = 0; i < mmClasses.length; i++) {
      const classe: M2Class = mmClasses[i];
      if (classe.shouldBeDisplayedAsEdge()) { continue; }
      const opt: HTMLOptionElement = document.createElement('option');
      opt.value = '' + classe.id;
      if (toSelect && opt.value === toSelect) { opt.selected = found = true; }
      opt.innerHTML = classe.name;
      optGrp.appendChild(opt); }
    U.pw(debug && !found, 'class not found.', mmClasses, 'searchedClass:', selected, 'shouldBeEdge?', selected.shouldBeDisplayedAsEdge());
    return htmlSelect; }

  // isRoot(): boolean { U.pe(true, 'm2 class cannot be roots.'); return false; }
  // setRoot(value: boolean): void { U.pe(true, 'only usable in model version'); }

  constructor(pkg: M2Package, json: Json, metaVersion: M3Class) {
    super(pkg, metaVersion);
    this.instances = [];
    if (!pkg && !json && !metaVersion) { return; } // empty constructor for .duplicate();
    this.parse(json, true); }

  getModelRoot(): MetaModel { return super.getModelRoot() as MetaModel; }

  getNamespaced(): string {
    const str: string = this.getModelRoot().namespace();
    if (this instanceof Model) { return str; }
    return str + ':' + this.name; }

  parse(json: Json, destructive: boolean) {
    console.log('M2Class.parse(); json:', json, '; metaVersion: ', this.metaParent, 'this:', this);
    /// own attributes.
    this.setName(Json.read<string>(json, ECoreClass.namee, 'Class_1'), false);
    /*this.name = Json.read<string>(this.json, ECoreClass.name);
    this.fullname = this.midname = this.parent.fullname + '.' + this.name;*/
    if (!this.referencesIN) { this.referencesIN = []; }
    /// childrens
    const childs: Json[] = Json.getChildrens(json);
    let i: number;
    let newFeature: M2Feature;
    const oldChildrens: M2Feature[] = this.childrens;
    // let metaParent: M3Feature;
    if (destructive) { this.childrens = []; this.attributes = []; this.references = []; }
    for (i = 0; i < childs.length; i++) {
      // console.log('reading class children[' + i + '/' + childs.length + '] of: ', childs, 'of', json);
      const child: Json = childs[i];
      const xsiType = Json.read<string>(child, ECoreAttribute.xsitype);
      if (destructive) {
        switch (xsiType) {
          default: U.pe(true, 'unexpected xsi:type: ', xsiType, ' in feature:', child); break;
          case 'ecore:EAttribute':
            const metaAttr: M3Attribute = null;
            // metaParent = oldChildrens[i] && oldChildrens[i].metaParent ? oldChildrens[i].metaParent : U.findMetaParentA(this, child);
            newFeature = new M2Attribute(this, child, metaAttr);
            U.ArrayAdd(this.attributes, newFeature); break;
          case 'ecore:EReference':
            const metaRef: M3Reference = null;
            // metaParent = oldChildrens[i] && oldChildrens[i].metaParent ? oldChildrens[i].metaParent : U.findMetaParentA(this, child);
            newFeature = new M2Reference(this, child, metaRef);
            U.ArrayAdd(this.references, newFeature); break;
        }
        U.ArrayAdd(this.childrens, newFeature);
        continue; }
      U.pe(true, 'Non-destructive class parse: to do');
    }
  }

generateModel() {
  const featurearr = [];
  const model = new Json(null);
  model[ECoreClass.xsitype] = 'ecore:EClass';
  model[ECoreClass.namee] = this.name;
  model[ECoreClass.eStructuralFeatures] = featurearr;
  let i;
  for (i = 0; i < this.childrens.length; i++) {
    const feature = this.childrens[i];
    featurearr.push(feature.generateModel());
  }
  return model; }


  addReference(): M2Reference {
    const ref: M2Reference = new M2Reference(this, null, null);
    U.ArrayAdd(this.childrens, ref);
    U.ArrayAdd(this.references, ref);
    ref.m2target = this;
    ref.edges.concat(ref.generateEdge());
    this.refreshGUI();
    // M2Class.updateAllMMClassSelectors(ref.getHtml());
    return ref; }

  addAttribute(): M2Attribute {
    const attr: M2Attribute = new M2Attribute(this, null, null);
    U.ArrayAdd(this.childrens, attr);
    U.ArrayAdd(this.attributes, attr);
    this.refreshGUI();
    return attr; }

  fieldChanged(e: JQuery.ChangeEvent): void {
    const html: HTMLElement = e.currentTarget;
    switch (html.tagName.toLowerCase()) {
      case 'select':
      default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
      case 'textarea':
      case 'input': this.setName((html as HTMLInputElement).value); break;
    }
  }

  /*
    setName(name: string, refreshGUI: boolean = true): void {
      super.setName(name, refreshGUI);
      return;
      this.midname = this.parent.name + '.' + this.name;
      this.fullname = this.midname;
      let i;
      for (i = 0; i < this.childrens.length; i++) {
        this.childrens[i].setName(this.childrens[i].name, false && refreshGUI); // per aggiornare il fullname.
      }
      if (refreshGUI) { this.refreshGUI(); M2Class.updateAllMMClassSelectors(); }
  }*/

  duplicate(nameAppend: string = '_Copy', newParent: M2Package = null): M2Class {
    const c: M2Class = new M2Class(null, null, null);
    c.setName(this.name + nameAppend);
    c.parent = (newParent ? newParent : this.parent);
    if (c.parent) { U.ArrayAdd(c.parent.childrens, c); }
    c.metaParent = this.metaParent;
    if (c.metaParent) { U.ArrayAdd(c.metaParent.instances, c); }
    c.childrens = [];
    c.references = [];
    c.attributes = [];
    c.referencesIN = [];
    c.styleOfInstances = this.styleOfInstances;
    c.customStyle = this.customStyle;
    //// set childrens
    let i;
    for (i = 0; i < this.childrens.length; i++) {
      // console.log('duplicating children[' + (i + 1) + '/' + this.childrens.length + ']');
      this.childrens[i].duplicate('', c);
    }
    M2Class.updateAllMMClassSelectors();
    c.refreshGUI();
    return c; }

  linkToMetaParent(meta: M3Class): void { return super.linkToMetaParent(meta); }
  getReferencePointingHere(): M2Reference[] { return super.getReferencePointingHere() as M2Reference[]; }
  getAttribute(name: string, caseSensitive: boolean = false): M2Attribute { return super.getAttribute(name, caseSensitive) as M2Attribute; }
  getReference(name: string, caseSensitive: boolean = false): M2Reference { return super.getReference(name, caseSensitive) as M2Reference; }
  getTargetStr(): string { return /*this.m2target ? this.m2target.fullname() : */null; }

}
