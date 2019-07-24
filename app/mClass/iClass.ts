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
  IReference, Status, DetectZoom, Model,
  eCoreAttribute, eCoreClass, eCorePackage, eCoreReference, eCoreRoot, Point, GraphPoint, IModel, Size, StringSimilarity
} from '../common/Joiner';

export class IClass extends ModelPiece {
  // static all: any[] = [];
  referencesIN: IReference[] = null; // external pointers to this class.
  references: IReference[] = null;
  attributes: IAttribute[] = null;

  constructor(pkg: IPackage, json: Json, metaVersion: IClass) {
    super(pkg, metaVersion);
    if (!pkg && !json && !metaVersion) { return; } // empty constructor for .duplicate();
    this.modify(json, true);
  }
  static defaultSidebarHtml(): HTMLElement {
    const div = document.createElement('div');
    const p = document.createElement('p');
    div.appendChild(p);
    p.innerHTML = '$##name$';
    p.classList.add('sidebarNodeName');
    div.classList.add('sidebarNode');
    div.classList.add('class');
    return div; }

  static GetDefaultStyle(modelRoot: IModel): HTMLElement | SVGElement {
    const selector = '.' + (modelRoot.isMM() ? 'MM' : 'M') + 'DefaultStyles>.Class.Template';
    let $template: JQuery<HTMLElement | SVGElement> = $(selector + '.Customized');
    if ($template.length === 0) { $template = $(selector); }
    U.pe($template.length !== 1, 'template not found? (' + $template.length + '); selector: "' + selector + '"');
    const ret: HTMLElement | SVGElement = U.cloneHtml($template[0]);
    ret.classList.remove('Template');
    ret.classList.remove('Customized');
    return ret; }

  private static generateEmptyeCore(): Json {
    const str =
      '{' +
      '"@xsi:type":"ecore:EClass",' +
      '"@name":"NewClass",' +
      '"eStructuralFeatures":[' +
      //  '{"@xsi:type":"ecore:EAttribute",' +
      //   '"@name":"name",' +
      //   '"@eType":"ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EString"},' +
      //  '{"@xsi:type":"ecore:EReference",' +
      //   '"@name":"players",' +
      //   '"@upperBound":"@1",' +
      //   '"@eType":"#//Player",' +
      //   '"@containment":"true"}' +
      ']' +
      '}';
    return JSON.parse(str); }

  static updateAllMClassSelectors(): void {}
  static updateAllMMClassSelectors(): void {
    console.log('updateAllMMClassSelectors()');
    const $selectors = $('select.ClassSelector');
    let i = 0;
    while (i < $selectors.length) { IClass.updateMMClassSelector($selectors[i++] as HTMLSelectElement); }
    // if (Status.status.mm && Status.status.mm.sidebar) { Status.status.mm.sidebar.updateAll(); }
    if (Status.status.m && Status.status.m.sidebar) { Status.status.m.sidebar.loadDefaultHtmls(); }
    if (Status.status.m) { Status.status.m.refreshGUI(); }
  }

  static updateMMClassSelector(selector: HTMLSelectElement, selected: IClass = null): HTMLSelectElement {
    if (!selector || !Status.status.mm) { return; }
    const optGrp: HTMLOptGroupElement = document.createElement('optgroup');
    let toSelect: string = selected ? '' + selected.id : selector.value;
    if (toSelect === '') { toSelect = null; }
    U.clear(selector);
    selector.appendChild(optGrp);
    optGrp.setAttribute('label', 'Class list');
    const mmClasses: IClass[] = Status.status.mm.getAllClasses();
    let i: number;
    for (i = 0; i < mmClasses.length; i++) {
      const classe: IClass = mmClasses[i];
      const opt: HTMLOptionElement = document.createElement('option');
      opt.value = '' + classe.id;
      if (toSelect && opt.value === toSelect) { opt.selected = true; }
      opt.innerHTML = classe.name;
      optGrp.appendChild(opt); }
    return selector; }

  isRoot(): boolean { U.pe(true, 'm2 class cannot be roots.'); return false; }
  setRoot(value: boolean): void { U.pe(true, 'only usable in model version'); }
  getStyle(): HTMLElement | SVGElement {
    // prima precedenza: stile personale.
    // seconda precedenza: stile del meta-parent.
    let htmlRaw: HTMLElement | SVGElement = super.getStyle();
    if (htmlRaw) { return this.processTemplate(htmlRaw); }
    // terza precedenza: stile della sua classe.
    htmlRaw = IClass.GetDefaultStyle(this.getModelRoot());
    U.pe(!htmlRaw, 'default style of vertex not found.');
    return this.processTemplate(htmlRaw);
  }
  incapsula(html: HTMLElement | SVGElement): HTMLElement | SVGElement {
    const container: SVGForeignObjectElement = U.newSvg<SVGForeignObjectElement>('foreignObject');
    const size: Size = new Size(0, 0, 0, 0);
    size.x = +html.getAttribute('x');
    size.y = +html.getAttribute('y');
    size.w = +html.getAttribute('width');
    size.h = +html.getAttribute('height');
    container.classList.add('Class');
    // todo: ??? a che serviva? U.cloneAllAttributes(html, container);
    container.appendChild(html);
    container.setAttributeNS(null, 'dinamico', 'true');
    container.setAttributeNS(null, 'x', isNaN(size.x) ? '0' : '' + size.x);
    container.setAttributeNS(null, 'y', isNaN(size.y) ? '0' : '' + size.y);
    container.setAttributeNS(null, 'width', isNaN(size.w) ? '200' : '' + size.w);
    container.setAttributeNS(null, 'height', isNaN(size.h) ? '100' : '' + size.h);
    return container; }

  processTemplate(htmlRaw: HTMLElement | SVGElement): HTMLElement | SVGElement {
    htmlRaw = this.incapsula(htmlRaw);
    htmlRaw = U.removeemptynodes(htmlRaw, true);
    return htmlRaw; }

  modify(json: Json, destructive: boolean) {
    if (!json) {json = IClass.generateEmptyeCore(); }
    this.setJson(json);
    /// own attributes.
    this.setName(Json.read<string>(this.json, eCoreClass.name), false);
    /*this.name = Json.read<string>(this.json, eCoreClass.name);
    this.fullname = this.midname = this.parent.fullname + '.' + this.name;*/
    if (!this.referencesIN) { this.referencesIN = []; }
    /// childrens
    const childs: Json[] = Json.getChildrens(json);
    let i: number;
    let newFeature: IFeature;
    const oldChildrens: ModelPiece[] = this.childrens;
    let metaParent: IFeature;
    if (destructive) { this.childrens = []; this.attributes = []; this.references = []; }
    for (i = 0; i < childs.length; i++) {
      // console.log('reading class children[' + i + '/' + childs.length + '] of: ', childs, 'of', json);
      const child: Json = childs[i];
      const xsiType = Json.read<string>(child, eCoreAttribute.xsitype);
      if (destructive) {
        switch (xsiType) {
          default: U.pe(true, 'unexpected xsi:type: ', xsiType, ' in feature:', child); break;
          case 'ecore:EAttribute':
            metaParent = null;
            // metaParent = oldChildrens[i] && oldChildrens[i].metaParent ? oldChildrens[i].metaParent : U.findMetaParentA(this, child);
            newFeature = new IAttribute(this, child, metaParent as unknown as IAttribute);
            this.attributes.push(newFeature as IAttribute); break;
          case 'ecore:EReference':
            metaParent = null;
            // metaParent = oldChildrens[i] && oldChildrens[i].metaParent ? oldChildrens[i].metaParent : U.findMetaParentA(this, child);
            newFeature = new IReference(this, child, metaParent as unknown as IReference);
            this.references.push(newFeature as IReference); break;
        }
        this.childrens.push(newFeature);
        continue; }
      U.pe(true, 'Non-destructive class modify: to do');
    }
  }
  remove(): IClass {
    // controllo se il parent è il package contenente eClassifiers o se è direttamente l'array come dovrebbe.
    // U.pe(!Array.isArray(this.parent.json['@eClassifiers']), 'tried to read array in wrong position in model:', this.parent.json);
    super.remove();
    // this.styleEditor.remove(); // rimuove dalla toolbar
    return this; }


generateModel() {
  const featurearr = [];
  const model = new Json(null);
  model[eCoreClass.xsitype] = 'ecore:EClass';
  model[eCoreClass.name] = this.name;
  model[eCoreClass.eStructuralFeatures] = featurearr;
  let i;
  for (i = 0; i < this.childrens.length; i++) {
    const feature = this.childrens[i];
    featurearr.push(feature.generateModel());
  }
  return model; }


  generateVertex(position: GraphPoint): IVertex {
    if (!position) { position = new GraphPoint(0, 0); }
    const v: IVertex = this.vertex = new IVertex();
    v.constructorClass(this);
    v.draw();
    v.moveTo(position);
    return v; }

  generateEdge(): IEdge[] {
    const e: IEdge = null;
    U.pw(true, 'Class.generateEdge(): todo');
    // todo check questa funzione e pure il shouldbedisplayedasedge
    this.edges = [e];
    return this.edges; }

  getVertex(): IVertex {
    U.pe(this.shouldBeDisplayedAsEdge(), 'err');
    if (this.vertex == null) { this.generateVertex(null); }
    return this.vertex; }
  getEdge(): IEdge[] {
    U.pe(!this.shouldBeDisplayedAsEdge(), 'err');
    if (!this.edges) { this.generateEdge(); }
    return this.edges; }

  refreshGUI(): void {
    if (!Status.status.loadedLogic) { return; }
    // console.log('Class.refreshGUI(), shouldBeEdge?', this.shouldBeDisplayedAsEdge(),
    // '!this.vertex && !this.edge === ', !this.vertex && !this.edge);
    if (!this.vertex && (!this.edges || this.edges.length === 0)) {
      if (this.shouldBeDisplayedAsEdge()) { this.generateEdge(); } else {  this.generateVertex(null); }}
    if (this.vertex) { this.vertex.refreshGUI(); }
    let i = -1;
    while (++i < this.edges.length) { if (this.edges) { this.edges[i].refreshGui(); } }
  }

  addReference() {
    const ref: IReference = new IReference(this, null, null);
    this.references.push(ref);
    this.childrens.push(ref);
    this.json = this.generateModel();
    this.refreshGUI();
  }

  addAttribute() {
    const attr: IAttribute = new IAttribute(this, null, null);
    this.attributes.push(attr);
    this.childrens.push(attr);
    this.json = this.generateModel();
    this.refreshGUI(); }

  fieldChanged(e: JQuery.ChangeEvent): void {
    const html: HTMLElement = e.currentTarget;
    switch (html.tagName.toLowerCase()) {
      case 'select':
      default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
      case 'textarea':
      case 'input': this.setName((html as HTMLInputElement).value); break;
    }
  }


  setName(name: string, refreshGUI: boolean = true) {
    super.setName(name, refreshGUI);
    this.midname = this.parent.name + '.' + this.name;
    this.fullname = this.midname;
    let i;
    for (i = 0; i < this.childrens.length; i++) {
      this.childrens[i].setName(this.childrens[i].name, refreshGUI); // per aggiornare il fullname.
    }
    if (refreshGUI) { this.refreshGUI(); IClass.updateAllMMClassSelectors(); }
  }

  delete(): void {
    U.arrayRemoveAll(this.metaParent.instances, this);
    U.arrayRemoveAll(this.parent.childrens, this);
    // todo: che fare con le reference a quella classe? per ora cancello i campi.
    const pointers: IReference[] = this.getReferencePointingHere();
    let i;
    for (i = 0; i < pointers.length; i++) { pointers[i].remove(); }
    if (this.shouldBeDisplayedAsEdge()) {
      const edges: IEdge[] = this.getEdge();
      while (this.edges.length > 0) { edges[0].remove(); } } else { this.getVertex().remove(); }
    IClass.updateAllMMClassSelectors();
  }

  duplicate(nameAppend: string = '_Copy', newParent: IPackage = null): IClass {
    const c: IClass = new IClass(null, null, null);
    c.setName(this.name + nameAppend);
    if (newParent) {
      c.parent = newParent;
      c.midname = c.parent.name + '.' + c.name;
      c.fullname = c.parent.fullname + '.' + c.name;
      newParent.childrens.push(c); }
    c.metaParent = this.metaParent;
    if (c.metaParent) { c.metaParent.instances.push(c); c.metaParent.refreshGUI(); this.metaParent.refreshInstancesGUI(); }
    c.childrens = [];
    c.references = [];
    c.attributes = [];
    c.referencesIN = [];
    c.styleOfInstances = this.styleOfInstances;
    c.customStyle = this.customStyle;
    c.html = null;
    c.json = {} as Json;
    //// set childrens
    let i;
    for (i = 0; i < this.childrens.length; i++) {
      // console.log('duplicating children[' + (i + 1) + '/' + this.childrens.length + ']');
      this.childrens[i].duplicate('', c);
    }
    IClass.updateAllMMClassSelectors();
    c.refreshGUI();
    return c; }
  getReferencePointingHere(): IReference[] {
    // U.pe(true, 'todo'); // todo:
    return this.referencesIN;
  }

  setDefaultStyle(value: string): void {
    U.pw(true, 'class.setdefaultStyle: todo.');
  }


  linkToMetaParent(meta: IClass) {
    const outObj: any = {};
    const comformability: number = this.comformability(meta, outObj);
    if (comformability !== 1) {
      U.pw(true, 'iClass: ' + this.name + ' not fully conform to ' + meta.name + '. Compatibility = ' + comformability * 100 + '%' );
      return; }
    this.metaParent = meta;
    let i: number;
    const refPermutation: number[] = outObj.refPermutation;
    const attrPermutation: number[] = outObj.attrPermutation;
    i = -1;
    while (++i < attrPermutation.length) { this.attributes[i].linkToMetaParent(meta.attributes[attrPermutation[i]]); }
    i = -1;
    while (++i < refPermutation.length) { this.references[i].linkToMetaParent(meta.references[refPermutation[i]]); }
  }
  comformability(meta: IClass, outObj: any = null/*.refPermutation, .attrPermutation*/): number {
    if (this.attributes > meta.attributes) { return 0; }
    if (this.references > meta.references) { return 0; }
    const refLenArray: number[] = [];
    let i;
    let j;
    // find best references permutation compability
    i = -1;
    while (++i < meta.references.length) { refLenArray.push(i); }
    const refPermut: number[][] = U.permute(refLenArray);
    // console.log('possible class.references permutations[' + meta.references.length + '!]:', refLenArray, ' => ', refPermut);
    const allRefPermutationConformability: number[] = [];
    i = -1;
    let bestRefPermutation: number[] = null;
    let bestRefPermutationValue = -1;
    while (++i < refPermut.length) {
      j = -1;
      const permutation = refPermut[i];
      let permutationComformability = 0;
      while (++j < permutation.length) {
        const Mref: IReference = this.references[j];
        const MMref: IReference = meta.references[permutation[j]];
        const refComf = !Mref ? 0 : Mref.comformability(MMref);
        console.log('ref: permutationComformability:', permutationComformability, ' + ' + refComf + ' / ' + permutation.length,
          '-->', permutationComformability + refComf / permutation.length);
        permutationComformability += refComf / permutation.length; }

      allRefPermutationConformability.push(permutationComformability);
      if (permutationComformability > bestRefPermutationValue) {
        bestRefPermutation = permutation;
        bestRefPermutationValue = permutationComformability; }
      if (permutationComformability === 1) { break; }
    }

    // find best attributes permutation compability
    const attLenArray: number[] = [];
    i = -1;
    while (++i < meta.attributes.length) { attLenArray.push(i); }
    const attPermut: number[][] = U.permute(attLenArray);
    // console.log('possible class.attributes permutations[' + meta.attributes.length + '!]:', attLenArray, ' => ', attPermut);
    const allAttPermutationConformability: number[] = [];
    i = -1;
    let bestAttPermutation: number[] = null;
    let bestAttPermutationValue = -1;
    while (++i < attPermut.length) {
      j = -1;
      const permutation = attPermut[i];
      let permutationComformability = 0;
      while (++j < permutation.length) {
        const Matt: IAttribute = this.attributes[j];
        const MMatt: IAttribute = meta.attributes[permutation[j]];
        const attComf = !Matt ? 0 : Matt.comformability(MMatt);
        console.log('attr: permutationComformability:', permutationComformability, ' + ' + attComf + ' / ' + permutation.length,
          '-->', permutationComformability + attComf / permutation.length);
        permutationComformability += attComf / permutation.length; }

      allAttPermutationConformability.push(permutationComformability);
      if (permutationComformability > bestRefPermutationValue) {
        bestAttPermutation = permutation;
        bestAttPermutationValue = permutationComformability; }
      if (permutationComformability === 1) { break; }
    }

    const total = meta.childrens.length + 1; // + name
    const nameComformability = StringSimilarity.compareTwoStrings(this.name, meta.name) / total;
    bestAttPermutationValue = Math.max(0, bestAttPermutationValue * (meta.attributes.length / total));
    bestRefPermutationValue = Math.max(0, bestRefPermutationValue * (meta.references.length / total));
    if (outObj) {
      outObj.refPermutation = bestRefPermutation;
      outObj.attrPermutation = bestAttPermutation; }

    const ret = nameComformability + bestAttPermutationValue + bestRefPermutationValue;
    console.log('CLASS.comform(', this.name, {0: this}, ', ', meta.name, {0: meta}, ') = ', ret,
      ' = ', nameComformability + ' + ' + bestAttPermutationValue + ' + ', bestRefPermutationValue);
    return ret; }

  getInfo(toLower: boolean = true): any {
    const info: any = super.getInfo();
    info['' + 'tsClass'] = (this.getModelRoot().isMM() ? 'm' : '') + 'mClass';
    return info;
  }

  getAttribute(name: string, caseSensitive: boolean = false): IAttribute {
    let i: number;
    if (!caseSensitive) { name = name.toLowerCase(); }
    for (i = 0; i < this.attributes.length; i++) {
      const s1: string = this.attributes[i].name;
      if ((caseSensitive ? s1 : s1.toLowerCase()) === name) { return this.attributes[i]; }
    }
    return null;
  }

  getReference(name: string, caseSensitive: boolean = false): IReference {
    let i: number;
    if (!caseSensitive) { name = name.toLowerCase(); }
    for (i = 0; i < this.references.length; i++) {
      const s1: string = this.references[i].name;
      console.log('find IReference[' + s1 + '] =?= ' + name + ' ? ' + (caseSensitive ? s1 : s1.toLowerCase()) === name);
      if ((caseSensitive ? s1 : s1.toLowerCase()) === name) { return this.references[i]; }
    }
    return null;
  }


  getChildrenIndex_ByMetaParent(meta: ModelPiece): number { U.pe(true, 'metodo esclusivo a MClass'); return null; }
  getAttributeIndex_ByMetaParent(meta: IAttribute): number { U.pe(true, 'metodo esclusivo a MClass'); return null; }
  getReferenceIndex_ByMetaParent(meta: IReference): number { U.pe(true, 'metodo esclusivo a MClass'); return null; }
}
