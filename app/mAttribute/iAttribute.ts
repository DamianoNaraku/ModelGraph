import {
  AttribETypes,
  IClass,
  IModel,
  IPackage,
  IReference,
  IVertex,
  Json,
  ModelPiece,
  PropertyBarr,
  Status,
  StringSimilarity,
  U,
  EType, eCoreAttribute, ShortAttribETypes, MAttribute, MReference
} from '../common/Joiner';

export class IAttribute extends ModelPiece {
  // static all: any[] = [];
  // htmlRaw: HTMLElement = null;
  type: EType = null;
  value: any[] = [];
  IAmNotAReference: any;
  upperbound: number = 1;
  lowerbound: number = 1;
  valuesStr: string = '';

  static generateEmptyAttribute(parentClass: IClass): Json {
    const name = 'Attribute';
    let namei = 1;
    const json: Json = {};
    Json.write(json, eCoreAttribute.xsitype, 'ecore:EAttribute');
    Json.write(json, eCoreAttribute.eType, AttribETypes.EString);
    while (parentClass.isChildNameTaken(name + '_' + namei)) { namei++; }
    Json.write(json, eCoreAttribute.name, name + '_' + namei);
    return json; }

  constructor(classe: IClass, json: Json, metaParent: IAttribute) {
    super(classe, metaParent);
    if (!classe && !json && !metaParent) { return; } // empty constructor for .duplicate();
    if (json === null || json === undefined) {
      if (!metaParent) {
        U.pe(classe.getModelRoot().isM(), 'metaparent cannot be null on m1 constructors');
        json = IAttribute.generateEmptyAttribute(classe);
      } else {
        U.pe(classe.getModelRoot().isMM(), 'metaparent must be null on mm constructors');
        json = MAttribute.generateEmptyAttribute(); }
    }
    this.modify(json, true); }

  static GetDefaultStyle(type: ShortAttribETypes, modelRoot: IModel): HTMLElement {
    const selector = '.' + (modelRoot === Status.status.m ? 'M' : 'MM') + 'DefaultStyles>.Attribute.Template.' + type;
    let $template: JQuery<HTMLElement> = $(selector + '.Customized');
    if ($template.length === 0) { $template = $(selector); }
    U.pe($template.length !== 1, 'template not found? (' + $template.length + '); selector: "' + selector + '"');
    const ret = U.cloneHtml($template[0]);
    ret.classList.remove('Template');
    ret.classList.remove('Customized');
    return ret; }

  static SetDefaultStyle(type: ShortAttribETypes, modelRoot: IModel, newTemplate: HTMLElement): void {
    const selector = '.' + (modelRoot === Status.status.m ? 'M' : 'MM') + 'DefaultStyles>.Attribute.Template.' + type;
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
    // seconda precedenza: instances_stile del meta-parent.
    let htmlRaw: HTMLElement | SVGElement = super.getStyle();
    if (htmlRaw) { return this.processTemplate(htmlRaw); }
    // terza precedenza: stile della sua classe.
    htmlRaw = IAttribute.GetDefaultStyle(this.getType().short, this.getModelRoot());
    return this.processTemplate(htmlRaw); }

  processTemplate(htmlRaw: HTMLElement | SVGElement): HTMLElement | SVGElement {
    const $html = $(htmlRaw);
    console.log('IAttribute.processTemplate()');
    const $selector = $html.find('select.TypeSelector');
    EType.updateTypeSelector($selector[0] as HTMLSelectElement, this.getType());
    return htmlRaw; }



  setJson(j: Json): Json { return ModelPiece.setJson(this, j); }

  modify(json: Json, destructive: boolean) {
    // super.modify(json, destructive);
    this.setJson(json);
    /// own attributes.
    // if (eType === 'FakeElement') { return; }
    this.setName(Json.read<string>(this.json, eCoreAttribute.name));
    const eType = Json.read<string>(json, eCoreAttribute.eType);
    this.setType(EType.getFromLongString(eType));
  }
  // getPrintableTypeName(): string { return ModelPiece.getPrintableTypeName(this.type as string); }


  generateModel(): Json {
    const model = new Json(null);
    Json.write(model, eCoreAttribute.xsitype, 'ecore:EAttribute');
    Json.write(model, eCoreAttribute.eType, this.type.long);
    Json.write(model, eCoreAttribute.name, this.name);
    return model; }

  generateVertex(): IVertex { return null; }
  shouldBeDisplayedAsEdge(): boolean { return false; }

  setType(primitiveType: EType, oldType: EType = null): void {
    if (this.type === primitiveType) { return; }
    let i: number;
    for (i = 0; i < this.instances.length; i++) {
      const instance: MAttribute = this.instances[i] as MAttribute;
      MAttribute.typeChange(instance.values, primitiveType, this.type);
    }
    this.type = primitiveType;
  }

  fieldChanged(e: JQuery.ChangeEvent): void {
    const html: HTMLElement = e.currentTarget;
    switch (html.tagName.toLowerCase()) {
      default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
      case 'textarea':
      case 'input': this.setName((html as HTMLInputElement).value); break;
      case 'select':
        const type: EType = EType.get((html as HTMLSelectElement).value as ShortAttribETypes);
        if (!this.type) {
          U.pw(!this.type, 'unrecognized type. str:', ((html as HTMLSelectElement).value), 'selectHtml:', html);
          this.refreshGUI(); // restores the prev. selected type
          return;
        }
        this.setType(type);
        console.log('attrib type changed:', this.type, 'inside:', this, 'evt:', e);
        break;
    }
  }
  setName(str: string, refreshGUI: boolean = false): void {
    super.setName(str, refreshGUI);
    this.midname = this.parent.name + '.' + this.name;
    this.fullname = this.parent.fullname + '.' + this.name;
    if (refreshGUI) { this.parent.refreshGUI(); }
  }
  refreshGUI(): void {
    if (!Status.status.loadedLogic) { return; }
    // this.parent.refreshGUI();
  }

  delete(): void {
    const parent: IClass = this.parent as IClass;
    console.log('Attribute.delete(): ', this.name);
    U.arrayRemoveAll(this.metaParent.instances, this);
    U.arrayRemoveAll(parent.childrens, this);
    U.arrayRemoveAll(parent.attributes, this);
    console.log('deleted. parent:', parent);
    parent.refreshGUI();
  }

  duplicate(nameAppend: string = '_Copy', newParent: IClass = null): IAttribute {
    console.log('Attribute.duplicate(): ', this.name);
    const a: IAttribute = new IAttribute(null, null, null);
    a.copy(this, nameAppend, newParent);
    return a; }

  copy(other: IAttribute, nameAppend: string = '_Copy', newParent: IClass = null): void {
    this.setName(other.name + nameAppend);
    if (newParent) {
      this.parent = newParent;
      this.midname = this.parent.name + '.' + this.name;
      this.fullname = this.parent.fullname + '.' + this.name;
      newParent.childrens.push(this);
      newParent.attributes.push(this); }
    this.metaParent = other.metaParent;
    this.metaParent.instances.push(this);
    this.childrens = [];
    this.styleOfInstances = other.styleOfInstances;
    this.customStyle = other.customStyle;
    this.html = null;
    this.json = {} as Json;
    this.setType(other.type);
    //// set parents
    //// set childrens
    this.refreshGUI();
  }
  setDefaultStyle(value: string): void {
    U.pw(true, 'Attribute.setDefaultStyle(): todo.');
  }

  comformability(meta: IAttribute): number {
    let comformability = 0;
    comformability += 0.5 * StringSimilarity.compareTwoStrings(this.getType().short, meta.getType().short);
    comformability += 0.5 * StringSimilarity.compareTwoStrings(this.name, meta.name);
    console.log('ATTRIBUTE.comform(', this.name, {0: this}, ', ', meta.name, {0: meta}, ') = ', comformability);
    return comformability; }

  linkToMetaParent(iAttribute: IAttribute) {
    this.metaParent = iAttribute;
  }

  getInfo(toLower: boolean = true): any {
    const info: any = super.getInfo();
    const set = (k: string, v: any) => {
      while (info[k]) { k = '@' + k; }
      info[k] = v; };
    const unset = (s: string) => { info[s] = undefined; };
    const ism: boolean = this.getModelRoot().isMM();
    set('tsClass', (ism ? '' : 'm') + 'mAttribute');
    set('type', this.getType().name);
    set('typeOriginal', this.getType().short);
    set('typeDetail', this.getType());
    if (ism) {
      set('value', this.value);
      unset('name');
    }
    return info; }

  getType(): EType { return this.type ? this.type : (this.metaParent ? (this.metaParent as IAttribute).type : null); }

  replaceVarsSetup(): void { return; }
}
