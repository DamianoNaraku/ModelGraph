import {AttribETypes, Dictionary, IModel, Json, Status, U} from '../common/Joiner';
import {ShortAttribETypes} from '../common/util';

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
  static getFromLongString(m3longstring: string): EType {
    switch (m3longstring) {
      default: U.pe(true, 'unrecognized type: ', m3longstring, 'estring=', AttribETypes.EString); break;
      case AttribETypes.EChar: return EType.get(ShortAttribETypes.EChar);
      case AttribETypes.EString: return EType.get(ShortAttribETypes.EString);
      case AttribETypes.EBoolean: return EType.get(ShortAttribETypes.EBoolean);
      case AttribETypes.EByte: return EType.get(ShortAttribETypes.EByte);
      case AttribETypes.EShort: return EType.get(ShortAttribETypes.EShort);
      case AttribETypes.EInt: return EType.get(ShortAttribETypes.EInt);
      case AttribETypes.ELong: return EType.get(ShortAttribETypes.ELong);
      case AttribETypes.EFloat: return EType.get(ShortAttribETypes.EFloat);
      case AttribETypes.EDouble: return EType.get(ShortAttribETypes.EDate);
    }
    return null; }

  static get(a: ShortAttribETypes): EType { return EType.shorts[a]; }
  static getAlias(a: ShortAttribETypes): string {
    const str = Status.status.typeAliasDictionary[a];
    return !str ? '' + a : Status.status.typeAliasDictionary[a]; }

  static updateAllTypeSelectors(): void {
    const $selectors = $('select.TypeSelector');
    let i = 0;
    while (i < $selectors.length) { EType.updateTypeSelector($selectors[i++] as HTMLSelectElement); }
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
  static emptyMetaMetaModel: string = 'empty Meta-MetaModel: todo'; // todo

  constructor(json: Json) { super(json, null); this.modify(json, true); }

  modify(json: Json, destructive: boolean) { super.modify(json, destructive); }
  // parse(deep: boolean) { super.parse(deep); }
  mark(bool: boolean): boolean {return super.mark(bool); }
  validate(): boolean { return super.validate(); }
  conformsTo(m: IModel): boolean { return super.conformsTo(m); }
  draw(): void { return super.draw(); }


}
