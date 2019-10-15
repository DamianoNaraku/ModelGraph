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
  MReference,
  MClass,
  M2Class,
  EdgeStyle,
  M2Reference,
  M2Attribute,
  M3Package,
  M3Reference,
  M3Attribute,
  M3Feature,
  EdgeModes,
  EdgePointStyle, EOperation
} from '../common/Joiner';

export abstract class IClass extends ModelPiece {
  parent: IPackage;
  childrens: IFeature[];
  attributes: IAttribute[];
  references: IReference[];
  metaParent: IClass;
  instances: IClass[];
  referencesIN: IReference[] = null; // external pointers to this class.
  shouldBeDisplayedAsEdgeVar: boolean = false && false;
  vertex: IVertex = null;

  edges: IEdge[] = [];
  edgeStyleCommon: EdgeStyle;
  edgeStyleHighlight: EdgeStyle;
  edgeStyleSelected: EdgeStyle;
  private sidebarHtml: HTMLElement;


  static defaultSidebarHtml(): HTMLElement {
    return U.toHtml<HTMLElement>('<div class="sidebarNode class"><p class="sidebarNodeName">$##name$</p></div>'); }

  constructor(parent: IPackage, meta: IClass) {
    super(parent, meta);
    this.edgeStyleCommon = new EdgeStyle(EdgeModes.straight, 2, '#ffffff',
      new EdgePointStyle(5, 2, '#ffffff', '#000000'));
    this.edgeStyleHighlight = new EdgeStyle(EdgeModes.straight, 4, '#ffffff',
      new EdgePointStyle(5, 2, '#ffffff', '#0077ff'));
    this.edgeStyleSelected = new EdgeStyle(EdgeModes.straight, 4, '#ffbb22',
      new EdgePointStyle(5, 2, '#ffffff', '#ff0000'));
  }

  getSidebarHtml(): HTMLElement {
    if (this.sidebarHtml) { return this.sidebarHtml; }
    return IClass.defaultSidebarHtml(); }

  fullname(): string { return this.parent.name + '.' + this.name; }
  midname(): string { return this.fullname(); }

  generateEdge(): IEdge[] { U.pe(true, 'IClass.generateEdge() todo.'); return null; }

  canBeLinkedTo(target: IClass): boolean {
    if (!this.shouldBeDisplayedAsEdge()) { return false; }
    return false; }

  getEdges(): IEdge[] { return this.edges; }

  delete(): void {
    // todo: che fare con le reference a quella classe? per ora cancello i campi.
    const pointers: IReference[] = this.getReferencePointingHere();
    let i;
    for (i = 0; i < pointers.length; i++) { pointers[i].delete(); }
    if (this.shouldBeDisplayedAsEdge()) {
      const edges: IEdge[] = U.ArrayCopy(this.getEdges(), false);
      for (i = 0; i < edges.length; i++) { edges[i].remove(); }
    } else { this.getVertex().remove(); }
    M2Class.updateAllMMClassSelectors(); }

  refreshGUI_Alone(debug?: boolean): void {
    if (!Status.status.loadedLogic) { return; }
    if (this.shouldBeDisplayedAsEdge()) {
      if (this.vertex) { this.vertex.remove(); this.vertex = null; }
      const edges: IEdge[] = this.getEdges();
      let i: number;
      for (i = 0; i < edges.length; i++) { edges[i].refreshGui(debug); }
      return; }
    this.getVertex().refreshGUI();
    EType.fixPrimitiveTypeSelectors(this.vertex.getHtml());
    M2Class.updateAllMMClassSelectors(this.vertex.getHtml(), false, false); // update self selectors
  }

  getReferencePointingHere(): IReference[] { return this.referencesIN; }
  getStyle(): SVGForeignObjectElement {
    const html: HTMLElement | SVGElement = super.getStyle(); // U.removeemptynodes(super.getStyle(), true);
    const container: SVGForeignObjectElement = U.newSvg<SVGForeignObjectElement>('foreignObject');
    const size: Size = new Size(0, 0, 0, 0);
    // todo: devi specificarlo che x, y, width, height sono attributi speciali assegnabili agli HTMLElement non-svg e vengono trasmessi.
    // todo: pondera l'uso di U.cloneAllAttributes(html, container); per trasferire gli attributi dell' userStyle-root nell'SvgForeignElem.
    size.x = +html.getAttribute('x');
    size.y = +html.getAttribute('y');
    size.w = +html.getAttribute('width');
    size.h = +html.getAttribute('height');
    container.classList.add('Class');
    container.appendChild(html);
    container.setAttributeNS(null, 'dinamico', 'true');
    /*container.setAttributeNS(null, 'x', isNaN(size.x) ? '0' : '' + size.x);
    container.setAttributeNS(null, 'y', isNaN(size.y) ? '0' : '' + size.y);
    container.setAttributeNS(null, 'width', isNaN(size.w) ? '200' : '' + size.w);
    container.setAttributeNS(null, 'height', isNaN(size.h) ? '100' : '' + size.h);*/
    return container; }

  getAttribute(name: string, caseSensitive: boolean = false): IAttribute {
    let i: number;
    if (!caseSensitive) { name = name.toLowerCase(); }
    for (i = 0; i < this.attributes.length; i++) {
      const s: string = this.attributes[i].name;
      if ((caseSensitive ? s : s.toLowerCase()) === name) { return this.attributes[i]; } }
    return null; }

  getReference(name: string, caseSensitive: boolean = false): IReference {
    let i: number;
    if (!caseSensitive) { name = name.toLowerCase(); }
    for (i = 0; i < this.references.length; i++) {
      const s1: string = this.references[i].name;
      console.log('find IReference[' + s1 + '] =?= ' + name + ' ? ' + (caseSensitive ? s1 : s1.toLowerCase()) === name);
      if ((caseSensitive ? s1 : s1.toLowerCase()) === name) { return this.references[i]; } }
    return null; }

  generateVertex(position: GraphPoint = null): IVertex {
    if (!position) { position = new GraphPoint(0, 0); }
    const v: IVertex = this.vertex = new IVertex(this);
    v.constructorClass(this);
    v.draw();
    v.moveTo(position);
    return v; }

  setName(value: string, refreshGUI: boolean = false): string {
    super.setName(value, refreshGUI);
    M2Class.updateAllMMClassSelectors(null, false);
    return this.name; }

  /*generateEdge(): IEdge[] {
    const e: IEdge = null;
    U.pw(true, 'Class.generateEdge(): todo');
    // todo check questa funzione e pure il shouldbedisplayedasedge
    this.edges = [e];
    return this.edges; }*/

  copy(other: IClass, nameAppend: string = '_Copy', newParent: IClass = null): void {
    super.copy(other, nameAppend, newParent);
    this.attributes = [];
    this.references = [];
    this.edges = [];
    this.edgeStyleCommon = other.edgeStyleCommon.clone();
    this.edgeStyleHighlight = other.edgeStyleHighlight.clone();
    this.edgeStyleSelected = other.edgeStyleSelected.clone();
    let i: number;
    for ( i = 0; i < this.childrens.length; i++) {
      const child: IFeature = this.childrens[i];
      if (child instanceof IReference) { this.references.push(child); continue; }
      if (child instanceof IAttribute) { this.attributes.push(child); continue; }
      U.pe(true, 'found class.children not reference neither attribute: ', child);
    }
  }

  getVertex(): IVertex {
    const displayAsEdge: boolean = this.shouldBeDisplayedAsEdge();
    // U.pw(displayAsEdge, 'getvertex called on a class that should not have a vertex.', this);
    if (!displayAsEdge && this.vertex === null && Status.status.loadedLogic) { this.generateVertex(); }
    return this.vertex; }
  /*getEdge(): IEdge[] {
    U.pe(!this.shouldBeDisplayedAsEdge(), 'err');
    if (!this.edges) { this.generateEdge(); }
    return this.edges; }*/

  linkToMetaParent(meta: IClass): void {
    const outObj: any = {};
    const comformability: number = this.conformability(meta, outObj);
    if (comformability !== 1) {
      U.pw(true, 'm2Class: ' + this.name + ' not fully conform to ' + meta.name + '. Conformability: = ' + comformability * 100 + '%' );
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

  conformability(meta: IClass, outObj: any = null/*.refPermutation, .attrPermutation*/, debug: boolean = true): number {
    if (this.attributes > meta.attributes) { return 0; }
    if (this.references > meta.references) { return 0; }
    const refLenArray: number[] = [];
    let i;
    let j;
    // find best references permutation compabilityF
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
        const refComf = !Mref ? 0 : Mref.conformability(MMref, debug);
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
    const attPermut: number[][] = U.permute(attLenArray, debug);
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
        const M2att: IAttribute = this.attributes[j];
        const M3att: IAttribute = meta.attributes[permutation[j]];
        const attComf = !M2att ? 0 : M2att.conformability(M3att, debug);
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
    U.pif(debug, 'M2CLASS.comform(', this.name, {0: this}, ', ', meta.name, {0: meta}, ') = ', ret,
      ' = ', nameComformability + ' + ' + bestAttPermutationValue + ' + ', bestRefPermutationValue);
    return ret; }

  getOperations(): EOperation[] {
    if (this instanceof M3Class) { return []; }
    if (this instanceof M2Class) { return this.operations; }
    if (this instanceof MClass) { return this.metaParent.operations; }
    U.pe(true, 'unexpected class:' + U.getTSClassName(this) + ': ', this);
  }
}
export class M3Class extends IClass {
  parent: M3Package;
  // childrens: M3Feature[];
  attributes: M3Attribute[];
  references: M3Reference[];
  referencesIN: M3Reference[] = null; // external pointers to this class.
  metaParent: M3Class = null;
  instances: M2Class[] = []; //  | M3Class[] = null;

  constructor(parent: M3Package, json: Json = null, meta: M3Class = null) {
    super(parent, meta);
    this.parse(json, true); }

  duplicate(nameAppend?: string, newParent?: ModelPiece): ModelPiece {
    return undefined;
  }

  generateModel(): Json {
    return undefined;
  }

  parse(json: Json, destructive?: boolean): void { this.name = 'Class'; }

  refreshGUI_Alone(debug: boolean = true): void { }
}
