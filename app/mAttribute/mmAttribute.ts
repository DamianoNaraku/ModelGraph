import {
  IAttribute,
  M3Attribute,
  EType,
  M2Class,
  MAttribute,
  ECoreAttribute,
  Json,
  ShortAttribETypes,
  U,
  MetaModel,
  AttribETypes
} from '../common/Joiner';

export class M2Attribute extends IAttribute {
  type: EType = null;
  parent: M2Class;
  metaParent: M3Attribute;
  instances: MAttribute[];

  constructor(classe: M2Class, json: Json, metaParent: M3Attribute) {
    super(classe, metaParent);
    if (!classe && !json && !metaParent) { return; } // empty constructor for .duplicate();
    this.parse(json, true); }

  getModelRoot(): MetaModel { return super.getModelRoot() as MetaModel; }

  parse(json: Json, destructive: boolean) {
    this.setName(Json.read<string>(json, ECoreAttribute.namee, 'Attribute_1'));
    const eType = Json.read<string>(json, ECoreAttribute.eType, AttribETypes.EString);
    this.setType(EType.getFromLongString(eType)); }

  generateModel(): Json {
    const model = new Json(null);
    Json.write(model, ECoreAttribute.xsitype, 'ecore:EAttribute');
    Json.write(model, ECoreAttribute.eType, this.type.long);
    Json.write(model, ECoreAttribute.namee, this.name);
    return model; }

  setType(primitiveType: EType): void {
    const oldType: EType = this.type;
    this.type = primitiveType;
    if (oldType === primitiveType) { return; }
    let i: number;
    for (i = 0; i < this.instances.length; i++) {
      const instance: MAttribute = this.instances[i];
      MAttribute.typeChange(instance.values, primitiveType, oldType);
    }
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

  duplicate(nameAppend: string = '_Copy', newParent: M2Class = null): M2Attribute {
    const a: M2Attribute = new M2Attribute(null, null, null);
    a.copy(this, nameAppend, newParent);
    return a; }

  copy(other: M2Attribute, nameAppend: string = '_Copy', newParent: M2Class = null): void {
    super.copy(other, nameAppend, newParent);
    this.setType(other.type);
  }


  getType(): EType { return this.type; }

  replaceVarsSetup(): void { super.replaceVarsSetup(); }

  conformability(metaparent: M3Attribute, outObj?: any, debug?: boolean): number { return 1; }










}
