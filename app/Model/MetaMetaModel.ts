import {
  AttribETypes,
  Dictionary, EOperation, EParameter,
  IAttribute,
  IModel,
  Json, M3Attribute,
  M3Class,
  M3Package,
  M3Reference,
  MetaModel,
  ModelPiece, PropertyBarr,
  ShortAttribETypes,
  Status,
  U
} from '../common/Joiner';

export class EType {
  static shorts: Dictionary<ShortAttribETypes, EType> = {};
  name: string = null;
  long: AttribETypes = null;
  short: ShortAttribETypes = null;
  defaultValue: any = null;
  minValue: number;
  maxValue: number;
  constructor(long: AttribETypes, short: ShortAttribETypes, defaultVal: any, minValue: number = null, maxValue: number = null) {
    U.pe(EType.shorts[short], 'etype created twice:', EType.shorts[short]);
    EType.shorts[short] = this;
    this.long = long;
    this.short = short;
    this.defaultValue = defaultVal;
    this.minValue = minValue;
    this.maxValue = maxValue;
    const alias = Status.status.typeAliasDictionary[short];
    this.name = alias ? alias : short; }
  static staticInit(): Dictionary<ShortAttribETypes, EType> {
    EType.shorts = {};
    let noWarning: EType;
    noWarning = new EType(AttribETypes.void, ShortAttribETypes.void, undefined);
    noWarning = new EType(AttribETypes.EDate, ShortAttribETypes.EDate, ' ');
    noWarning = new EType(AttribETypes.EChar, ShortAttribETypes.EChar, ' ');
    noWarning = new EType(AttribETypes.EString, ShortAttribETypes.EString, '');
    noWarning = new EType(AttribETypes.EBoolean, ShortAttribETypes.EBoolean, true);
    noWarning = new EType(AttribETypes.EByte, ShortAttribETypes.EByte, 0, -127, 127);
    noWarning = new EType(AttribETypes.EShort, ShortAttribETypes.EShort, 0, 32768, 32767);
    noWarning = new EType(AttribETypes.EInt, ShortAttribETypes.EInt, 0, 2147483648, 2147483647);
    noWarning = new EType(AttribETypes.ELong, ShortAttribETypes.ELong, 0, -9223372036854775808, 9223372036854775808);
    noWarning = new EType(AttribETypes.EFloat, ShortAttribETypes.EFloat, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    noWarning = new EType(AttribETypes.EDouble, ShortAttribETypes.EDouble, 0,  Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    return EType.shorts; }

  static getFromLongString(ecorelongstring: string): EType {
    switch (ecorelongstring) {
      default: U.pe(true, 'Etype.Get() unrecognized type: ', ecorelongstring, '; string: ', AttribETypes.EString); break;
      case AttribETypes.void: return EType.get(ShortAttribETypes.void);
      case AttribETypes.EChar: return EType.get(ShortAttribETypes.EChar);
      case AttribETypes.EString: return EType.get(ShortAttribETypes.EString);
      case AttribETypes.EBoolean: return EType.get(ShortAttribETypes.EBoolean);
      case AttribETypes.EByte: return EType.get(ShortAttribETypes.EByte);
      case AttribETypes.EShort: return EType.get(ShortAttribETypes.EShort);
      case AttribETypes.EInt: return EType.get(ShortAttribETypes.EInt);
      case AttribETypes.ELong: return EType.get(ShortAttribETypes.ELong);
      case AttribETypes.EFloat: return EType.get(ShortAttribETypes.EFloat);
      case AttribETypes.EDouble: return EType.get(ShortAttribETypes.EDouble);
      case AttribETypes.EDate: return EType.get(ShortAttribETypes.EDate); }
    return null; }

  static get(a: ShortAttribETypes): EType { return EType.shorts[a]; }
  static getAlias(a: ShortAttribETypes): string {
    const str = Status.status.typeAliasDictionary[a];
    return !str ? '' + a : Status.status.typeAliasDictionary[a]; }

  static fixPrimitiveTypeSelectors(root: Element = null): void {
    if (!root) { root = document.body; }
    const $selectors = $(root).find('select.TypeSelector');
    // const selectors: HTMLSelectElement[] = $selectors[0];
    let i = -1;
    while (++i < $selectors.length) {
      const select: HTMLSelectElement = $selectors[i] as HTMLSelectElement;
      // if (select.selectedIndex !== 0 || select.options[0].getAttribute('selected')) { continue; }
      const attr: IAttribute = ModelPiece.getLogic(select) as IAttribute;
      if (!(attr instanceof IAttribute)) { continue; }
      PropertyBarr.makePrimitiveTypeSelector(select, attr.getType());
      // EType.updateTypeSelector(select, attr.getType());
    }
  }
  static updateTypeSelector(selector: HTMLSelectElement, selectedType: EType = null): HTMLSelectElement {
    if (!selector) { return null; }
    // U.pe(!selector, 'called updateTypeSelector on null selector.');
    const optGrp: HTMLOptGroupElement = document.createElement('optgroup');
    let toSelect: string = selectedType ? '' + selectedType.short : selector.value;
    if (toSelect === '') { toSelect = null; }
    U.clear(selector);
    selector.appendChild(optGrp);
    optGrp.setAttribute('label', 'Primitive types');
    for (const attr in EType.shorts) {
      if (!EType.shorts[attr]) { continue; }
      const type: EType = EType.shorts[attr];
      const opt: HTMLOptionElement = document.createElement('option');
      opt.value = type.short;
      if (toSelect && opt.value === toSelect) { opt.selected = true; }
      opt.innerHTML = type.name;
      optGrp.appendChild(opt); }
    return selector; }

  changeAlias(value: string) {
    this.name = value;
    Status.status.typeAliasDictionary[this.short] = this.name;
    Status.status.aliasTypeDictionary[this.name] = this.short;
    Status.status.mm.refreshGUI();
    Status.status.m.refreshGUI();
    Status.status.mm.graph.propertyBar.refreshGUI();
    Status.status.m.graph.propertyBar.refreshGUI();
  }

}

export class MetaMetaModel extends IModel {
  static emptyMetaMetaModel: string = '' + 'empty Meta-MetaModel: todo'; // todo
  childrens: M3Package[];
  metaParent: MetaMetaModel;
  instances: MetaModel[];

  constructor(json?: Json) { super(null); this.parse(json, true); }

  conformability(metaparent: MetaMetaModel, outObj: any = null, debug: boolean = false): number { return 1; }

  getAllClasses(): M3Class[] { return super.getAllClasses() as M3Class[]; }
  getAllReferences(): M3Reference[] { return super.getAllReferences() as M3Reference[]; }


  generateModel(): Json { return undefined; }

  getPrefix(): string { return 'mmm'; }
  getPrefixNum(): string { return 'm3'; }
  isM1(): boolean { return false; }
  isM2(): boolean { return false; }
  isM3(): boolean { return true; }

  parse(json: Json, destructive?: boolean): void {
    this.name = 'Meta-Metamodel';
    const useless = new M3Package(this, null); }

  refreshGUI_Alone(debug: boolean = true): void { }

  getDefaultPackage(): M3Package {
    if (this.childrens.length !== 0) { return this.childrens[0]; }
    U.ArrayAdd(this.childrens, new M3Package(this, null));
    return this.childrens[0]; }

  getPackage(): M3Package { return this.getDefaultPackage(); }

  getClass(fullname: string = null, throwErr: boolean = true, debug: boolean = true): M3Class { return this.getDefaultPackage().childrens[0]; }

  getAttribute(): M3Attribute { return this.getClass().attributes[0]; }
  getReference(): M3Reference { return this.getClass().references[0]; }
  getOperation(): EOperation { return this.getClass().getOperations()[0]; }
  getParameter(): EParameter { return this.getOperation().childrens[0]; }
  duplicate(nameAppend: string = '_Copy'): MetaMetaModel { U.pe(true, 'invalid operation: m3.duplicate();'); return this; }
}
