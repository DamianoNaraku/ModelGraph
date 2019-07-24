import {
  IVertex,
  IEdge,
  IField,
  IPackage,
  IClass,
  IAttribute,
  AttribETypes,
  IFeature,
  Json,
  U,
  ModelPiece,
  ISidebar,
  IGraph, IReference, MetaModel, eCorePackage, Status, MClass, Options, TopBar
} from '../common/Joiner';
import {eCoreClass, eCoreRoot, InputPopup} from '../common/util';
import ChangeEvent = JQuery.ChangeEvent;

export class IModel extends ModelPiece {
  // packages: IPackage[] = null;
  graph: IGraph = null;
  sidebar: ISidebar = null;
  classRoot: MClass = null; // for model
  namespace_var: string = null;

  constructor(json: Json, metaParent: MetaModel, skipParse: boolean = false) {
    super(null, metaParent);
    this.setJson(json);
    if (!skipParse) { this.modify(this.json, true); }
  }

  private static nameTaken(value: string) {
    return false;
  }
  getClassRoot(): MClass {
    if (this.classRoot) { return this.classRoot; }
    U.pe(true, 'failed to get class root');
    const classes: MClass[] = this.getAllClasses() as MClass[];
    let i = -1;
    while (++i < classes.length) { if (classes[i]['' + 'isRoot <-- old IClass var, now deleted']) { return classes[i]; }}
  }
  getClassByNameSpace(fullnamespace: string, caseSensitive: boolean = false, canThrow: boolean = false): IClass {
    const classes: IClass[] = this.getAllClasses();
    let i: number;
    if (caseSensitive) { fullnamespace = fullnamespace.toLowerCase(); }
    let justNameMatchFallback: IClass = null;
    let namestr: string = fullnamespace.substr(fullnamespace.lastIndexOf(':') + 1);
    if (!caseSensitive) { namestr = namestr.toLowerCase(); }
    for (i = 0; i < classes.length; i++) {
      const mmclass: IClass = classes[i];
      if ( (caseSensitive ? mmclass.name : mmclass.name.toLowerCase()) === namestr) { justNameMatchFallback = mmclass; }
      let mmclassNS = mmclass.getNamespaced();
      if (!mmclassNS) { continue; }
      if (caseSensitive) { mmclassNS = mmclassNS.toLowerCase(); }
      if (mmclassNS === fullnamespace) { return mmclass; } }
    U.pe(!justNameMatchFallback, 'class |' + fullnamespace + '| not found. classArr:', classes);
    return justNameMatchFallback; }

  getDefaultStyle(): HTMLElement | SVGElement { U.pe(true, 'called GetDefaultStyle on IModel'); return undefined; }
  fixReferences(): void {
    const arr: IReference[] = this.getAllReferences();
    let i = -1;
    while (++i < arr.length) { arr[i].link(); }
  }
  modify(json: Json, destructive: boolean) {
    this.setJson(json);
    /// own attributes.
    /// childrens
    if (destructive) { this.childrens = []; }
    const childrens = Json.getChildrens(json);
    let i;
    for (i = 0; i < childrens.length; i++) {
      const child = childrens[i];
      const metaParent: IPackage = null;
      // metaParent = U.findMetaParentP(this, child);
      if (destructive) { this.childrens.push(new IPackage(this, child, metaParent)); continue; }
      U.pe(true, 'Non-destructive model modify: to do');
    }
  }

  mark(bool: boolean): boolean {return bool; }
  validate(): boolean {
    // todo:
    return true;
  }
  conformsTo(m: IModel): boolean {
    return undefined;
  }

  draw(): void {
  }

  namespace(): string {
    const ns: string = this.namespace_var;
    if (!ns) { this.setNamespace('default.namespace.to.change'); return this.namespace(); }
    const pos: number = ns.lastIndexOf(':');
    return pos === -1 ? ns : ns.substring(0, pos); }

  generateModel(): Json {
    const packageArr = [];
    let i;
    for (i = 0; i < this.childrens.length; i++) {
      const pkg = this.childrens[i];
      packageArr.push(pkg.generateModel());
    }
    const model = new Json(null);
    model[eCoreRoot.ecoreEPackage] = packageArr;
    return model; }
  getAllPackages(): IPackage[] { return this.childrens as IPackage[]; }
  getAllClasses(): IClass[] {
    const arr: IClass[] = [];
    const packages: IPackage[] = this.getAllPackages();
    let i;
    for (i = 0; i < packages.length; i++) {
      packages[i].childrens.forEach( (elem) => {arr.push(elem as IClass); } );
    }
    return arr; }

  getAllReferences(): IReference[] {
    const arr: IReference[] = [];
    const classes: IClass[] = this.getAllClasses();
    let i;
    for (i = 0; i < classes.length; i++) {
      classes[i].references.forEach( (elem) => {arr.push(elem as IReference); } );
    }
    return arr; }

  getPackage(fullname: string, throwErr: boolean = true): IPackage {
    if (fullname.indexOf('.') !== -1) { U.pe(throwErr, 'not a package name:', fullname); return null; }
    let i;
    for ( i = 0; i < this.childrens.length; i++) { if (this.childrens[i].name === fullname) { return this.childrens[i] as IPackage; } }
    if (fullname.indexOf('.') !== -1) { U.pe(throwErr, 'valid a package name, but package does not exist:', fullname); return null; }
    return null; }
  getClass(fullname: string, throwErr: boolean = true, debug: boolean = true): IClass {
    const tks: string[] = fullname.split('.');
    if (tks.length !== 2) { U.pe(throwErr, 'not a full class name:', fullname); return null; }
    const classes: IClass[] = this.getAllClasses();
    let i = -1;
    while (++i < classes.length) {
      U.pif(debug, 'fllname: |' + fullname + '| =?= |' + classes[i].fullname + '| = ' + classes[i].fullname === fullname);
      if (classes[i].fullname === fullname) { return classes[i] as unknown as IClass; }
    }
    const name: string = fullname.substr(fullname.indexOf('.') + 1);
    i = -1;
    while (++i < classes.length) {
      U.pif(debug, 'name: |' + name + '| =?= |' + classes[i].name + '| = ' + classes[i].name === name);
      if (classes[i].name === name) { return classes[i] as unknown as IClass; }
    }
    U.pe(throwErr, 'valid name but unable to find it. fullname:', fullname, 'classes:', classes);
    return null;
    // let i;
    // for ( i = 0; i < pkg.childrens.length; i++) { if (pkg.childrens[i].name === fullname) { return pkg.childrens[i] as IClass; } }
  }

  addEmptyP() {
    U.pe(true, 'todo addEmptyP()');
  }

  addEmptyClass(parentPackage: IPackage, metaVersion: IClass) {
    console.log('addEmptyClass(); package:', parentPackage, '; metaVersion: ', metaVersion);
    const c = new IClass(parentPackage, null, metaVersion);
    parentPackage.childrens.push(c);
    c.generateVertex(null).draw();
    IClass.updateAllMMClassSelectors();
  }

  fieldChanged(e: JQuery.ChangeEvent) { U.pe(true, 'shoud never happen', e); }

  addClass(parentPackage: IPackage, metaVersion: IClass) {
    const childJson: Json = U.cloneObj<Json>(metaVersion.getJson());
    // Json.write(childJson, '@type', metaVersion.fullname);
    const c = new IClass(parentPackage, childJson, metaVersion);
    // U.pe(!!c.customStyle, '1', c, c.customStyle);
    Json.write(childJson, eCoreClass.name, metaVersion.name.toLowerCase() + '_obj');
    c.setName(metaVersion.name.toLowerCase() + '_obj');
    parentPackage.childrens.push(c);
    // U.pe(!!c.customStyle, '2', c, c.customStyle);
    c.generateVertex(null).draw();
    // U.pe(!!c.customStyle, '3', c, c.customStyle);
    // U.pe(true, '4', c, c.customStyle);
    IClass.updateAllMClassSelectors();
  }
  duplicate(): ModelPiece {
    U.pe(true, 'IModel duplicate to do.');
    return undefined; }
    delete(): void { U.pe(true, 'IModel duplicate to do.'); }

  refreshGUI(): void {
    if (!Status.status.loadedLogic) { return; }
    // const packages: IPackage[] = this.getAllPackages();
    // for (const key in packages) { if (!packages[key]) { continue; } packages[key].refreshGUI(); }
    const classes: IClass[] = this.getAllClasses();
    for (const key in classes) { if (!classes[key]) { continue; } classes[key].refreshGUI(); }
  }
  processTemplate(htmlRaw: HTMLElement | SVGElement): HTMLElement | SVGElement {
    U.pe(true, 'Model.processTemplate() should never be called');
    return null; }

  setName(value: string, refreshGUI: boolean = false) {
    const oldname: string = this.name;
    super.setName(value);
    this.fullname = this.midname = this.name;
    const oldSave = localStorage.getItem((this.isMM() ? 'M' : '') + 'M_' + oldname);
    localStorage.removeItem((this.isMM() ? 'M' : '') + 'M_' + oldname);
    localStorage.setItem((this.isMM() ? 'M' : '') + 'M_' + oldname, oldSave);
    TopBar.topbar.updateRecents();
    this.graph.propertyBar.refreshGUI();
  }
  save(isAutosave: boolean, saveAs: boolean = null): void {
    let ecoreJSONStr: string = this.generateModelString();
    console.log('save ' + (this.isMM() ? 'M' : '') + 'Model[' + this.name + '] = ', ecoreJSONStr);
    if (saveAs === null ) { saveAs = false; }
    localStorage.setItem('LastOpenedM' + (this.isMM() ? 'M' : ''), ecoreJSONStr);
    let popup: InputPopup;
    const finishSave = () => {
      ecoreJSONStr = this.generateModelString();
      const prefix: string = (this.isMM() ? 'MM_' : 'M_');
      localStorage.setItem( prefix + this.name, ecoreJSONStr);
      let tmp: string = localStorage.getItem(prefix + 'SaveList');
      let saveList: Json[];
      if (!tmp || tmp === '' || tmp === 'null' || tmp === 'undefined') { saveList = []; } else { saveList = JSON.parse(tmp); }
      U.arrayRemoveAll(saveList, this.name);
      saveList.push(this.name);
      localStorage.setItem(prefix + 'SaveList', JSON.stringify(saveList));
      if (popup) { popup.destroy(); }
      console.log( prefix + this.name + ' saved:', ecoreJSONStr); };
    const oninput = (e: ChangeEvent) => {
      console.log('onchange');
      const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
      input.setAttribute('isValid', IModel.nameTaken(input.value) ? 'false' : 'true'); };
    const onchange = (e: any) => {
      console.log('oninput');
      const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
      console.log('save.setname: |' + input.value + '|');
      this.setName(input.value);
      popup.destroy();
      finishSave(); };

    console.log('isAutosave:', isAutosave, 'saveAs:', saveAs, 'this.name:', this.name);
    if (isAutosave) {
      if (this.name && this.name !== '') {
        finishSave();
      }
    } else
    if (saveAs || !this.name || this.name === '') {
      popup = new InputPopup('Choose a name for the ' + (this.isMM() ? 'meta' : '') + 'model.',
        '', '', [['input', oninput], ['change', onchange]],
        (this.isMM() ? 'Meta-m' : 'M') + 'odel name', this.name); }

  }
  isMM(): boolean { return Status.status.mm === this; }
  isM(): boolean { return !this.isMM(); }

  getDefaultPackage(): IPackage {
    if (this.childrens.length !== 0) { return this.childrens[0] as IPackage; }
    if (this.isMM()) {
      this.childrens.push( new IPackage(this, null, null));
    } else {
      this.childrens.push( new IPackage(this, null, (this.metaParent as IModel).getDefaultPackage()));
    }
    return this.childrens[0] as IPackage;
  }


  linkToMetaParent(meta: MetaModel) {
    const outObj: any = {};
    const comformability: number = this.comformability(meta, outObj);
    if (comformability !== 1) {
      U.pw(true, 'IModel: ' + this.name + ' not fully conform to ' + meta.name + '. Compatibility = ' + comformability * 100 + '%' );
      return; }
    this.metaParent = meta;
    let i: number;
    const pkgPermutation: number[] = outObj.pkgPermutation;
    i = -1;
    while (++i < pkgPermutation.length) { (this.childrens[i] as IPackage).linkToMetaParent(meta.childrens[pkgPermutation[i]] as IPackage); }
  }

  comformability(meta: MetaModel, outObj: any = null/*.classPermutation*/): number {
    // todo: abilita package multipli e copia da IPackage e IClass.comformability();
    if (outObj) {outObj.pkgPermutation = [0]; }
    return 1;
  }

  setNamespace(value: string): void {
    this.namespace_var = value;
    const pos: number = this.namespace_var.lastIndexOf(':');
    this.namespace_var = pos === -1 ? this.namespace_var : this.namespace_var.substring(0, pos);
    console.log('setnamespace: |' + value + '| -> |' + this.namespace_var + '|');
  }

  uri(): string {
    if (this.uri_var) { return this.uri_var; }
    return this.uri_var = 'http://default/uri/to/change';
  }
  setUri(str: string): void {
    this.uri_var = str;
  }
}

