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
  MReference, MClass, IClass, M2Reference, M2Feature, M3Class, M2Package, M2Attribute, M3Reference, M3Attribute, M3Feature, MetaModel,
  EOperation, EParameter,
} from '../common/Joiner';

export class M2Class extends IClass {
  // static all: any[] = [];
  parent: M2Package;
  childrens: Array<M2Feature | EOperation>; // M2Feature[];
  // features: M2Feature[]; // M2Feature[];
  operations: EOperation[] = [];
  attributes: M2Attribute[];
  references: M2Reference[];
  referencesIN: M2Reference[] = []; // external pointers to this class.
  metaParent: M3Class = null;
  instances: MClass[] = [];
  extends: M2Class[] = [];


  static updateAllMMClassSelectors(root0: Element = null, updateModel: boolean = false, updateSidebar: boolean = true): void {
    let root: Element = root0;
    if (!Status.status.loadedGUI) { return; }
    if (!root) { root = Status.status.mm.graph.container; }
    // console.log('updateAllMMClassSelectors()', 'selects:', $selectors, root);
    const $selectors = $(root).find('select.ClassSelector');
    let i = -1;
    while (++i < $selectors.length) { M2Class.updateMMClassSelector($selectors[i] as HTMLSelectElement); }
    if (updateSidebar && Status.status.m && Status.status.m.sidebar) { Status.status.m.sidebar.loadDefaultHtmls(); }
    if (!updateModel) { return; }
    // if (Status.status.mm && Status.status.mm.sidebar) { Status.status.mm.sidebar.updateAll(); }
    if (Status.status.m) { Status.status.m.refreshGUI(); }
  }

  static updateMMClassSelector(htmlSelect: HTMLSelectElement, selected: M2Class = null, debug = false,
                               mustSelect: boolean = true): HTMLSelectElement {
    if (!htmlSelect || !Status.status.loadedGUI) { return; }
    const optGrp: HTMLOptGroupElement = document.createElement('optgroup');
    let toSelect: string;
    if (debug) { console.clear(); }
    if (mustSelect && !selected) {
      const mp: ModelPiece = ModelPiece.getLogic(htmlSelect);
      U.pif(debug, 'mp:', mp, 'select:', htmlSelect);
      // if (mp instanceof IAttribute || mp instanceof MAttribute) { selected = mp.parent as M2Class; }
      if (mp instanceof M2Reference) { selected = (mp as M2Reference).classType; }
      if (mp instanceof MReference) { selected = (mp as MReference).getm2Target(); }
      if (mp instanceof EParameter) { selected = (mp as EParameter).classType; }
      U.pw(!selected, 'ClassSelectors must be held inside a m2-reference:', htmlSelect, 'mp:', mp) ;
      if (!selected) { return; }
    }
    toSelect = '' + (selected ? selected.id : '');
    U.pif(debug, 'selected:', selected);
    U.clear(htmlSelect);
    htmlSelect.appendChild(optGrp);
    optGrp.setAttribute('label', 'Class list');
    const mmClasses: M2Class[] = Status.status.mm.getAllClasses();
    let i: number;
    let found: boolean = !mustSelect;
    for (i = 0; i < mmClasses.length; i++) {
      const classe: M2Class = mmClasses[i];
      if (classe.shouldBeDisplayedAsEdge()) { continue; }
      const opt: HTMLOptionElement = document.createElement('option');
      opt.value = '' + classe.id;
      if (toSelect && opt.value === toSelect) { opt.setAttribute('selected', ''); opt.selected = found = true; }
      // console.log('mustselect?' + mustSelect + ': ' + toSelect + '&&' + opt.value + ' ? ' + found);
      opt.innerHTML = classe.name;
      optGrp.appendChild(opt); }
    U.pw(debug && !found, 'class not found.', mmClasses, 'searchedClass:', selected,
      'shouldBeEdge?', selected && selected.shouldBeDisplayedAsEdge());
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
    /// childrens
    const features: Json[] = Json.getChildrens(json);
    const functions: Json[] = Json.getChildrens(json, false, true);
    let i: number;
    let newFeature: M2Feature;
    const oldChildrens: Array<M2Feature | EOperation> = this.childrens;
    // let metaParent: M3Feature;
    if (destructive) { this.childrens = []; this.attributes = []; this.references = []; this.operations = []; }
    for (i = 0; i < features.length; i++) {
      // console.log('reading class children[' + i + '/' + childs.length + '] of: ', childs, 'of', json);
      const child: Json = features[i];
      const xsiType = Json.read<string>(child, ECoreAttribute.xsitype);
      U.pe(!destructive, 'Non-destructive class parse: to do');
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
    }
    for (i = 0; i < functions.length; i++) {
      const newFunction: EOperation = new EOperation(this, functions[i]);
      U.ArrayAdd(this.operations, newFunction);
      U.ArrayAdd(this.childrens, newFunction);
    }
  }

  generateModel() {
    const featurearr: Json[] = [];
    const operationsarr: Json[] = [];
    const model = new Json(null);
    model[ECoreClass.xsitype] = 'ecore:EClass';
    model[ECoreClass.namee] = this.name;
    model[ECoreClass.eStructuralFeatures] = featurearr;
    model[ECoreClass.eOperations] = operationsarr;
    let i;
    for (i = 0; i < this.attributes.length; i++) { featurearr.push(this.attributes[i].generateModel()); }
    for (i = 0; i < this.references.length; i++) { featurearr.push(this.references[i].generateModel()); }
    for (i = 0; i < this.operations.length; i++) { operationsarr.push(this.operations[i].generateModel()); }

    return model; }


  addOperation(): EOperation {
    const op: EOperation = new EOperation(this, null);
    U.ArrayAdd(this.childrens, op);
    U.ArrayAdd(this.operations, op);
    this.refreshGUI();
    return op; }

  addReference(): M2Reference {
    const ref: M2Reference = new M2Reference(this, null, null);
    U.ArrayAdd(this.childrens, ref);
    U.ArrayAdd(this.references, ref);
    ref.classType = this;
    ref.edges = ref.generateEdge();
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
      case 'input':
        const input = html as HTMLInputElement;
        input.value = this.setName((input as HTMLInputElement).value); break;
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
    c.operations = [];
    c.referencesIN = [];
    c.styleOfInstances = this.styleOfInstances;
    c.customStyle = this.customStyle;
    //// set childrens
    let i;
    for (i = 0; i < this.childrens.length; i++) {
      // console.log('duplicating children[' + (i + 1) + '/' + this.childrens.length + ']');
      const child = this.childrens[i].duplicate();
      U.ArrayAdd(c.childrens, child);
      if (false && false) {
      } else if (child instanceof EOperation) { U.ArrayAdd(c.operations, child);
      } else if (child instanceof M2Attribute) { U.ArrayAdd(c.attributes, child);
      } else if (child instanceof M2Reference) { U.ArrayAdd(c.references, child);
      } else { U .pe(true, 'unexpected child class: ' + U.getTSClassName(child) + ', child:', child); }
    }
    // M2Class.updateAllMMClassSelectors(); already did by setname
    c.refreshGUI();
    return c; }

  getExtendedClassArray(levelDeep: number = Number.POSITIVE_INFINITY, out: M2Class[] = []): M2Class[] {
    let i: number;
    for (i = 0; i < this.extends.length; i++ ) {
      const curr: M2Class = this.extends[i];
      U.ArrayAdd(out, curr);
      if (levelDeep > 0) { curr.getExtendedClassArray(levelDeep--, out); }
    }
    return out; }

  linkToMetaParent(meta: M3Class): void { return super.linkToMetaParent(meta); }
  getReferencePointingHere(): M2Reference[] { return super.getReferencePointingHere() as M2Reference[]; }
  getAttribute(name: string, caseSensitive: boolean = false): M2Attribute { return super.getAttribute(name, caseSensitive) as M2Attribute; }
  getReference(name: string, caseSensitive: boolean = false): M2Reference { return super.getReference(name, caseSensitive) as M2Reference; }

}
