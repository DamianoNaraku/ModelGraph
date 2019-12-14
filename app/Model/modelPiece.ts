import {
  Dictionary,
  EdgePointStyle,
  EdgeStyle, GraphSize, EdgeModes,
  IAttribute,
  M2Class,
  IEdge,
  IFeature,
  IModel,
  IPackage,
  IReference,
  IVertex,
  Json, Model, Status,
  U, EType, IClass, MClass, MetaModel, MetaMetaModel, EOperation, EParameter, MAttribute, MReference, ViewHtmlSettings
}              from '../common/Joiner';

import ClickEvent = JQuery.ClickEvent;
import MouseMoveEvent = JQuery.MouseMoveEvent;
import MouseDownEvent = JQuery.MouseDownEvent;
import MouseUpEvent = JQuery.MouseUpEvent;
import {Vieww} from '../GuiStyles/viewpoint';
import {Style} from '@angular/cli/lib/config/schema';
export type StyleComplexEntry = {html: Element, htmlobj:ViewHtmlSettings, view: Vieww, ownermp: ModelPiece, isownhtml: boolean, isinstanceshtml: boolean, isGlobalhtml: boolean};
export class Info {
  static forConsole(obj: any): any {}

  static setraw(baseJson: object, k: string, v: any, toLower: boolean = true): string { return Info.set(baseJson, k, v, '', toLower); }
  static setc(baseJson: object, k: string, v: any, toLower: boolean = true): string { return Info.set(baseJson, k, v, '@', toLower); }
  static seti(baseJson: object, k: string, v: any, toLower: boolean = true): string  { return Info.set(baseJson, k, v, '#', toLower); }
  static set(baseJson: object, k: string, v: any, prefixc: string = '_', toLower: boolean = true): string {
    k = toLower ? k.toLowerCase() : k;
    let prefix = prefixc;
    // U.pw(baseJson[prefix + k], 'setinfo() name altready set: ', k, baseJson);
    while (baseJson[prefix + k]) { prefix += prefixc === '' ? '*' : prefixc; }
    baseJson[prefix + k] = v;
    // if (prefix === '') { baseJson[prefixc + k] = v; }
    return prefix + k; }

  static unsetraw(baseJson: object, k: string, toLower: boolean = true): void { return Info.unset(baseJson, k, '', toLower); }
  static unsetc(baseJson: object, k: string, toLower: boolean = true): void { return Info.unset(baseJson, k, '@', toLower); }
  static unseti(baseJson: object, k: string, toLower: boolean = true): void { return Info.unset(baseJson, k, '#', toLower); }
  static unset(baseJson: object, k: string, prefixc: string = '_', toLower: boolean = true): void {
    k = prefixc + (toLower ? k.toLowerCase() : k);
    delete baseJson[k]; }

  static renameraw(o: object, k1: string, k2: string, toLower: boolean = true): void { return Info.rename(o, k1, k2, '', toLower); }
  static renamec(o: object, k1: string, k2: string, toLower: boolean = true): void { return Info.rename(o, k1, k2, '@', toLower); }
  static renamei(o: object, k1: string, k2: string, toLower: boolean = true): void  { return Info.rename(o, k1, k2, '#', toLower); }
  static rename(baseJson: object, k1: string, k2: string, prefixc: string = '_', toLower: boolean = true): void {
    k1 = prefixc + (toLower ? k1.toLowerCase() : k2);
    k2 = prefixc + (toLower ? k1.toLowerCase() : k2);
    const old: any = baseJson[k1];
    delete baseJson[k1];
    baseJson[k2] = old; }

  static merge(info: Info, targetinfo: Info, prefixc: string = '->'): void {
    let key: string;
    if (!targetinfo) { return; }
    for (key in targetinfo) {
      if (!targetinfo.hasOwnProperty(key)) { continue; }
      if (!prefixc) { switch (key[0]) {
      default: prefixc = ''; break;
      case '#': case '_': case '@': prefixc = key[0]; break; } }
      // console.log('Info.set(' + info + ', ' + key + ', ' + targetinfo[key] + ', ' + prefixc);
      Info.set(info, key, targetinfo[key], prefixc); }
  }
}

export abstract class ModelPiece {
  private static idToLogic = {};
  private static idMax = 0;
  id: number = null;
  parent: ModelPiece = null;
  childrens: ModelPiece[] = [];
  metaParent: ModelPiece = null;
  instances: ModelPiece[] = [];
  name: string = null;
  // styleOfInstances:Element = null;
  // customStyleToErase: Element = null;
//  styleobj: ModelPieceStyleEntry = null;
  key: number[] = null;
  views: Vieww[] = null;

  static GetStyle(model: IModel, tsClass: string, checkCustomizedFirst: boolean = true): HTMLElement | SVGElement {
    let rootSelector: string;
    if (model.isM()) { rootSelector = '.MDefaultStyles';
    } else if (model.isMM()) { rootSelector = '.MMDefaultStyles';
    } else { U.pe(true, 'm3 objects should not call getStyle()'); }

    let $html: JQuery<HTMLElement | SVGElement>;
    const $root: JQuery<HTMLElement | SVGElement> = $((checkCustomizedFirst ? '.customized' : '.immutable') + rootSelector);
    if (tsClass.indexOf('M1') === 0 || tsClass.indexOf('M2') === 0) { tsClass = tsClass.substr(2); }
    switch (tsClass) {
    default: U.pe(true, 'unrecognized TS Class: ' + tsClass); return null;
    case 'Class': $html = $root.find('.Template.Class'); break;
    case 'Attribute': $html = $root.find('.Template.Attribute'); break;
    case 'Reference': $html = $root.find('.Template.Reference'); break;
    case 'EOperation': $html = $root.find('.Template.Operation'); break;
    case 'EParameter': $html = $root.find('.Template.Parameter'); break; }
    U.pw(checkCustomizedFirst && $html.length > 1,
      'found more than one match for custom global style, should there be only 0 or 1.', $html, $root, this);
    if (checkCustomizedFirst && $html.length === 0) { return ModelPiece.GetStyle(model, tsClass, false); }
    /*console.log('class?' + (this instanceof IClass), $root.find('.Template'), $root.find('.Class'),
      $root.find('.Template.Class'));
    console.log('condition:', !customizeds, ' && ', $html.length !== -1);*/
    U.pe(!checkCustomizedFirst && $html.length !== 1,
      'expected exactly 1 match for the un-customized global style, found instead ' + $html.length + ':', $html, $root, this);
    const ret: HTMLElement | SVGElement = U.cloneHtml($html[0], true);
    ret.classList.remove('Template');
    ret.classList.remove('Customized');
    return ret; }

  static get(e: JQuery.ChangeEvent | ClickEvent | MouseMoveEvent | MouseDownEvent | MouseUpEvent): ModelPiece {
    return ModelPiece.getLogic(e.target); }

  public static getLogicalRootOfHtml(html0: Element): Element {
    let html: HTMLElement | SVGElement = html0 as any;
    if (!html) { return null; }
    while ( html && (!html.dataset || !html.dataset.modelPieceID)) { html = html.parentNode as HTMLElement | SVGElement; }
    return html; }

  static getLogic(html: HTMLElement | SVGElement): ModelPiece {
    html = this.getLogicalRootOfHtml(html) as any;
    const ret: ModelPiece = html ? ModelPiece.getByID(+html.dataset.modelPieceID) : null;
    // U.pe(!(ret instanceof T), 'got logic with unexpected class type:', this);
    return ret; }

  static getByID(id: number): ModelPiece { return ModelPiece.idToLogic[id]; }

  constructor(parent: ModelPiece, metaVersion: ModelPiece) {
    this.assignID();
    this.parent = parent;
    this.metaParent = metaVersion;
    this.instances = [];
    this.childrens = [];
    this.views = [];
    if (this.parent) { U.ArrayAdd(this.parent.childrens, this); }
    if (this.metaParent) { U.ArrayAdd(this.metaParent.instances, this); }
  }

  assignID(): number {
    this.id = ModelPiece.idMax++;
    ModelPiece.idToLogic[this.id] = this;
    return this.id; }

  //todo: devo stare attento ogni volta che aggiungo-elimino un elemento a chiamare updateKey()
  // le views si salvano perchè usano la chiave all avvio e poi la rigenerano ad ogni salvataggio e non la usano ulteriormente se non per generare
  // la savestring.
  getKey(): number[] { return this.key ? this.key : this.updateKey(); }
  getKeyStr(): string { return JSON.stringify(this.getKey()); }

  updateKey(): number[] {
    const pathIndex: number[] = U.getIndexesPath(this, 'parent', 'childrens');
    return this.key = pathIndex; }

  replaceVarsSetup(): void { return; }

  linkToLogic<T extends HTMLElement | SVGElement>(html: T): void {
    if (this.id === null || this.id === undefined) { U.pw(true, 'undefined id:', this); return; }
    html.dataset.modelPieceID = '' + this.id; }

  getm2(): MetaModel {
    const root: IModel = this.getModelRoot();
    if (root instanceof Model) { return root.metaParent; }
    if (root instanceof MetaModel) { return root; }
    if (root instanceof MetaMetaModel) { return root.instances[0]; }
    U.pe(true, 'failed to get root.'); }

  getModelRoot(): IModel {
    let p: ModelPiece = this;
    let i = 0;
    while (p.parent && p !== p.parent && i++ < 6) { p = p.parent; }
    U.pe(!p  || !(p instanceof IModel), 'failed to get model root:', this, 'm lastParent:', p);
    return p as any as IModel; }

  isChildNameTaken(s: string): boolean {
    let i;
    for (i = 0; i < this.childrens.length; i++) { if (s === this.childrens[i].name) { return true; } }
    return false; }

  shouldBeDisplayedAsEdge(set: boolean = null): boolean {
    if (set !== null) {
      U.pe( !(this instanceof IClass), 'shouldBeDisplayedAsEdge(' + set + ') should only be set on M2Class instances');
      (this as any as IClass).shouldBeDisplayedAsEdgeVar = set;
      M2Class.updateAllMMClassSelectors(null, false);
      return set; }
    if (this instanceof IModel) { return false; }
    if (this instanceof IPackage) { return false; }
    if (this instanceof IClass) { return (this as IClass).shouldBeDisplayedAsEdgeVar; }
    if (this instanceof IAttribute) { return false; }
    if (this instanceof IReference) { return true; }
    U.pe(true, 'unrecognized class:', this);
  }

  refreshGUI(debug: boolean = false): void {
    if (!Status.status.loadedLogic) { return; }
    let model: IModel = this.getModelRoot();
    const thingsToRefresh: ModelPiece[] = [this];
    let i: number;

    if (Status.status.refreshModeAll) {
      U.ArrayAdd(thingsToRefresh, Status.status.mmm);
      U.ArrayAdd(thingsToRefresh, Status.status.mm);
      U.ArrayAdd(thingsToRefresh, Status.status.m); }
    if (Status.status.refreshModelAndInstances && model) {
      U.ArrayAdd(thingsToRefresh, model);
      for (i = 0; model.instances && i < model.instances.length; i++) { U.ArrayAdd(thingsToRefresh, model.instances[i]); }
      return; }
    if (Status.status.refreshModelAndParent && model && model.metaParent) {
      model = model.metaParent;
      U.ArrayAdd(thingsToRefresh, model);
      for (i = 0; model.instances && i < model.instances.length; i++) { U.ArrayAdd(thingsToRefresh, model.instances[i]); }
      return; }
    if (Status.status.refreshInstancesToo) {
      for (i = 0; this.instances && i < this.instances.length; i++) { U.ArrayAdd(thingsToRefresh, this.instances[i]); } }
    if (Status.status.refreshModel && model) { U.ArrayAdd(thingsToRefresh, model); }
    if (Status.status.refreshMetaParentToo && this.metaParent) { U.ArrayAdd(thingsToRefresh, this.metaParent); }
    if (Status.status.refreshParentToo && this.parent) { U.ArrayAdd(thingsToRefresh, this.parent); }

    for (i = 0; i < thingsToRefresh.length; i++) {
      const mp: ModelPiece = thingsToRefresh[i];
      if (mp) { mp.refreshGUI_Alone(debug); }
    }
  }

  refreshInstancesGUI(): void {
    let i = 0;
    U.pe(!this.instances, '', this);
    while (i < this.instances.length) {
      try { this.instances[i++].refreshGUI_Alone(false); } catch (e) {} finally {}
    }
  }

  mark(markb: boolean, key: string, color: string = 'red', radiusX: number = 10, radiusY: number = 10,
       width: number = 5, backColor: string = 'none', extraOffset: GraphSize = null): void {
    const vertex: IVertex = this.getVertex();
    // const edge: IEdge[] = (this as any as IReference | IClass).getEdges();
    if (vertex && vertex.isDrawn()) { vertex.mark(markb, key, color, radiusX, radiusY, width, backColor, extraOffset); }
    let edges: IEdge[] = null;
    if (this instanceof IClass && this.shouldBeDisplayedAsEdge()) { edges = (this as IClass).getEdges(); }
    if (this instanceof IReference) { edges = (this as IReference).getEdges(); }
    let i: number;
    for (i = 0; edges && i < edges.length; i++) { edges[i].mark(markb, key, color); }
  }
  generateModelString(): string { return JSON.stringify(this.generateModel(), null, 4); }

  abstract refreshGUI_Alone(debug?: boolean): void;
  abstract fullname(): string;
  endingName(valueMaxLength: number = 10): string { return ''; }

  public printableName(valueMaxLength: number = 5): string {
    if (this.name !== null) { return this.fullname(); }
    const ending: String = this.endingName(valueMaxLength);
    return this.metaParent.fullname() + ':' + this.id + (ending && ending !== '' ? ':' + ending : ''); }

  abstract midname(): string;
  abstract parse(json: Json, destructive?: boolean): void;
  abstract getVertex(): IVertex;
  abstract generateModel(): Json;
  abstract duplicate(nameAppend?: string, newParent?: ModelPiece): ModelPiece;
  abstract conformability(metaparent: ModelPiece, outObj?: any/*.refPermutation, .attrPermutation*/, debug?: boolean): number;

  setName(value: string, refreshGUI: boolean = false, warnDuplicateFix: boolean = true): string {
    const valueOld: string = this.name;
    const valueInputError = value;
    value = value ? '' + value.trim() : null;
    if (!value || value === '') { U.pw(true, 'name cannot be empty.'); return valueOld; }
    if (value === valueOld) { return valueOld; }
    const regexp: RegExp = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
    console.log('setName.valid ? ' + regexp.test(value) + ' |' + value + '|');
    if (!regexp.test(value)) {
      value = value.replace(/([^a-zA-Z_$0-9])/g, '');
      let i: number = 0;
      while (value[i] && value[i] >= '0' && value[i] <= '9') i++;
      value = value.substr(i);
      let remainder: string = value;
      let firstChar: string = '' || '';
      while (remainder.length > 0 && firstChar === '') {
        firstChar = remainder[0].replace('[^a-zA-Z_$]', '');
        remainder = remainder.substring(1); }
      value = firstChar + remainder;
      U.pw(true, 'a valid name must be match this regular expression: ' + regexp.compile().toString()
        + '; trying autofix: |' + valueInputError + '| --> + |' + value + '|');
      return this.setName(value, true || refreshGUI); }

    let nameFixed: boolean = false && false;
    while (this.parent && this.parent.isChildNameTaken(value)) {
      nameFixed = true;
      value = U.increaseEndingNumber(value, false, false); }
    U.pe(nameFixed && (valueInputError === value), 'increaseEningNumber failed:', value, this, this.parent ? this.parent.childrens : null);
    U.pw(nameFixed && warnDuplicateFix, 'that name is already used in this context, trying autofix: |'
      + valueInputError + '| --> + |' + value + '|');
    this.name = value;
    const model: IModel = this.parent ? this.getModelRoot() : null;
    let i: number;
    for (i = 0; model && i < model.instances.length; i++) { model.instances[i].sidebar.fullnameChanged(valueOld, this.name); }
    if (refreshGUI) { this.refreshGUI(); }
    return this.name; }

  fieldChanged(e: JQuery.ChangeEvent): void { U.pe(true, U.getTSClassName(this) + '.fieldChanged() should never be called.'); }

  copy(other: ModelPiece, nameAppend: string = '_Copy', newParent: ModelPiece = null): void {
    this.setName(other.name + nameAppend);
    let i: number;
    this.views = [];
    for (i = 0; i < other.views.length; i++) {
      const v: Vieww = other.views[i];
      this.views.push(v.duplicate());
    }
    this.parent = newParent ? newParent : other.parent;
    if (this.parent) { U.ArrayAdd(this.parent.childrens, this); }

    this.childrens = [];
    for (i = 0; i < other.childrens.length; i++) { this.childrens.push(other.childrens[i].duplicate('', this)); }
    this.metaParent = other.metaParent;
    if (this.metaParent) { U.ArrayAdd(this.metaParent.instances, this); }
    this.instances = [];
    this.refreshGUI(); }

  delete(): void {
    if (this.parent) {
      U.arrayRemoveAll(this.parent.childrens, this);
      this.parent = null; }
    if (this.metaParent) {
      U.arrayRemoveAll(this.metaParent.instances, this);
      this.metaParent = null; }
    let i: number;
    for (i = 0; this.childrens && i < this.childrens.length; i++) { this.childrens[i].delete(); }
    for (i = 0; this.instances && i < this.instances.length; i++) { this.instances[i].delete(); }
    setTimeout(() => this.getVertex().refreshGUI(), 1);
  }

  validate(): boolean {
    const names: Dictionary<string, ModelPiece> = {};
    let i: number;
    if (!U.isValidName(name)) { this.mark(true, 'Invalid name'); return false; }
    for (i = 0; i < this.childrens.length; i++) {
      const child: ModelPiece = this.childrens[i];
      const name: string = child.name;
      if (names.hasOwnProperty(name)) { child.mark(true, 'Duplicate children name'); return false; }
      child.validate();
      names[name] = child; }
    return true; }
  /*
    setStyle_SelfLevel_1(html: Element): void { this.customStyleToErase = html; }
    setStyle_InstancesLevel_2(html: Element): void { this.styleOfInstances = html; }
    setStyle_GlobalLevel_3(html: HTMLElement | SVGElement): void {
      const oldCustomStyle: HTMLElement | SVGElement = this.getGlobalLevelStyle(true);
      if (oldCustomStyle) { oldCustomStyle.parentNode.removeChild(oldCustomStyle); }
      const model: IModel = this.getModelRoot();
      let rootSelector: string;
      if (model.isM()) { rootSelector = '.MDefaultStyles';
      } else if (model.isMM()) { rootSelector = '.MMDefaultStyles';
      } else { U.pe(true, 'm3 objects should not call getStyle()'); }
      let selectorClass: string = '' + '_ERROR_';
      if (false && false) {
      } else if (this instanceof IClass) { selectorClass = ('Class');
      } else if (this instanceof IReference) { selectorClass = ('Reference');
      } else if (this instanceof IAttribute) { selectorClass = ('Attribute'); }

      let $root: JQuery<HTMLElement | SVGElement>;
      $root = $('.customized' + rootSelector);
      const container: HTMLElement | SVGElement = $root[0];
      html.classList.add('Template', selectorClass, (this instanceof IClass ? 'Vertex' : ''));
      container.appendChild(html); }*/

  getGlobalLevelStyle(checkCustomizedFirst: boolean = true): HTMLElement | SVGElement {
    let tsClass: string;
    if (false && false ) {
    } else if (this instanceof IClass) { tsClass = 'Class';
    } else if (this instanceof IAttribute) { tsClass = 'Attribute';
    } else if (this instanceof IReference) { tsClass = 'Reference';
    } else if (this instanceof EOperation) { tsClass = 'EOperation';
    } else if (this instanceof EParameter) { tsClass = 'EParameter';
    } else { tsClass = 'ERROR: ' + U.getTSClassName(this); }
    return ModelPiece.GetStyle(this.getModelRoot(), tsClass, checkCustomizedFirst); }

  getStyleOfInstances(): StyleComplexEntry {
    let i: number;
    const ret: StyleComplexEntry = {html:null, htmlobj:null, view:null, ownermp:null, isownhtml:null, isinstanceshtml:null, isGlobalhtml:null};
    for (i = this.views.length; --i >= 0;) {
      let v: Vieww = this.views[i];
      if (!v.htmli || !v.htmli.getHtml()) continue;
      ret.html = v.htmli.getHtml();
      ret.htmlobj = v.htmli;
      ret.view = v;
      ret.ownermp = this;
      ret.isGlobalhtml = false;
      ret.isinstanceshtml = true;
      ret.isownhtml = false;
      return ret; }
    return null; }

  getInstancesInheritedStyle(): StyleComplexEntry { return this.metaParent ? this.metaParent.getStyleOfInstances() : null; }
  getStyle(): StyleComplexEntry {
    let j: number;
    let i: number;
    const ret: StyleComplexEntry = {html:null, htmlobj:null, view:null, ownermp:null, isownhtml:null, isinstanceshtml:null, isGlobalhtml:null};
    for (j = this.views.length; --j >=0 ;){
      const v: Vieww = this.views[j];
      if (!v.htmlo || !v.htmlo.getHtml()) continue;
      ret.html = v.htmlo.getHtml();
      ret.htmlobj = v.htmlo;
      ret.view = v;
      ret.ownermp = this;
      ret.isGlobalhtml = false;
      ret.isinstanceshtml = false;
      ret.isownhtml = true;
      return ret; }
    const tmpret = this.getInstancesInheritedStyle();
    if (tmpret) return tmpret;
    ret.html = this.getGlobalLevelStyle();
    ret.htmlobj = null;
    ret.view = null;
    ret.ownermp = null;
    ret.isGlobalhtml = true;
    ret.isinstanceshtml = false;
    ret.isownhtml = false;
    return ret; }

  /*
  getStyleOld(): ViewHtmlSettings { return this.views.getHtml(this); }
  getStyleOldOld(): Element { return this.views.getHtml(this); }
  getStyleOldissimo(debug: boolean = true): Element {
    // prima precedenza: stile personale.
    let ret: Element;
    if (this.customStyleToErase) { ret = this.customStyleToErase; ret.id = '' + this.id; return ret; }
    // seconda precedenza: stile del meta-parent.
    const metap1 = this.metaParent;
    if (metap1 && metap1.styleOfInstances) { ret = metap1.styleOfInstances; ret.id = '' + this.id; return ret; }
    // terzo e quarto livello: search for customized third-override-css-like global styles; or immutable fourth global styles.
    ret = this.getGlobalLevelStyle(true);
    ret.id = '' + this.id;
    return ret; }
    getStyleObj(): ModelPieceStyleEntry {
      if (this.styleobj) { return this.styleobj; }
      return this.styleobj = ModelPieceStyleEntry.load(this.getStyle(), null); }*/

  getInfo(toLower: boolean = false): Info {
    let i: number;
    const info: any = new Info();
    const instancesInfo: any = {};
    const childrenInfo: any = {};
    const model: IModel = this.getModelRoot();
    Info.set(info, 'tsClass', U.getTSClassName(this));
    Info.set(info, 'this', this);
    if (!(this instanceof IModel)) { Info.set(info, 'parent', this.parent); }
    if (!(this instanceof IFeature)) { Info.set(info, 'childrens', childrenInfo); }
    if (model.isMM()) {
      Info.set(info, 'instance', instancesInfo);
      Info.set(info, 'name', this.name);
    } else { Info.set(info, 'metaParent', this.metaParent); }
    for (i = 0; this.childrens && i < this.childrens.length; i++) {
      const child = this.childrens[i];
      const name = model.isM1() && child.metaParent ? child.metaParent.name : child.name;
      U.pe(!name, 'error: probably some metparent is null.', this, child);
      Info.setc(info, name.toLowerCase(), child);
      Info.setraw(childrenInfo, name.toLowerCase(), child); }
    for (i = 0; this.instances && i < this.instances.length; i++) { Info.seti(instancesInfo,  '' + i, this.instances[i]); }
    return info; }

  getHtmlOnGraph(): HTMLElement | SVGElement {
    let html: HTMLElement | SVGElement = this.getVertex().getHtml();
    if (this instanceof IClass) return html;
    html = $(html).find('*[data-modelPieceID="' + this.id + '"]')[0];
    return html ? html : null; }

  getLastView(): Vieww { return this.views[this.views.length - 1];
    // todo: deve diventare una array.
  }

  addView(v: Vieww): void {
    // if (!v.viewpoint.viewsDictionary[this.id]) {  v.viewpoint.viewsDictionary[this.id] = []; }
    v.viewpoint.viewsDictionary[this.id] = v;
    U.ArrayAdd(this.views, v); }
  resetViews(): void { this.views = []; }
}
export abstract class ModelNone extends ModelPiece {}
