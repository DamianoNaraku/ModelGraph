import {
  AttribETypes,
  EType,
  IAttribute,
  M2Class,
  IFeature,
  IReference,
  Json,
  MClass,
  ModelPiece,
  ShortAttribETypes, M2Attribute,
  U, StringSimilarity, M3Attribute, IVertex, IField, MetaModel, Model, Status, Info
} from '../../../../common/Joiner';
import {del} from 'selenium-webdriver/http';


export class MAttribute extends IAttribute {
  parent: MClass;
  metaParent: M2Attribute;
  // instances: ModelNone[];
  values: any[];
  valuesStr: string;

  static typeChange(arr: any[], newType: EType, oldType: EType): void {
    let i = -1;
    while (++i < arr.length) {
      if (Array.isArray(arr[i])) { MAttribute.typeChange(arr[i], newType, oldType); continue; }
      let newVal: any;
      switch (newType.short) {
        default: U.pe(true, 'unexpected type: ' + newType.short); break;
        case ShortAttribETypes.EDate: newVal = null; break;
        case ShortAttribETypes.EFloat: case ShortAttribETypes.EDouble:
          newVal = parseFloat('' + arr[i]);
          if (newVal === null || newVal === undefined) { newVal = newType.defaultValue; }
          break;
        case ShortAttribETypes.EBoolean: newVal = !!arr[i]; break;
        case ShortAttribETypes.EChar:
          newVal = (arr[i] + '')[0];
          if (newVal === undefined) { newVal = newType.defaultValue; }
          break;
        case ShortAttribETypes.EString: newVal = (arr[i] === null || arr[i] === undefined ? null : '' + arr[i]); break;
        case ShortAttribETypes.EInt: case ShortAttribETypes.EByte: case ShortAttribETypes.EShort: case ShortAttribETypes.ELong:
          let tentativo: number = parseInt('' + arr[i], 10);
          tentativo = !isNaN(+tentativo) ? (+tentativo) : newType.defaultValue;
          tentativo = Math.min(newType.maxValue, Math.max(newType.minValue, tentativo));
          break;
      }

      arr[i] = newVal;
    }
  }

  constructor(parent: MClass, json: Json, meta: M2Attribute) {
    super(parent, meta);
    this.parse(json, true); }

  getModelRoot(): Model { return super.getModelRoot() as Model; }

  parse(json: Json, destructive: boolean): void {
    // if (!json) { json = }
    this.setValue(json as any[]);
    if (!this.validate()) {
      this.setValue(null);
      U.pw(true, 'marked attribute (' + this.metaParent.name + ') with type ', this.getType(), 'values:', this.values, 'this:', this);
      this.mark(true, 'errorValue');
    } else { this.mark(false, 'errorValue'); }
  }

  getType(): EType { return (this.metaParent ? this.metaParent.primitiveType : null); }

  getInfo(toLower: boolean = false): any {
    const info: any = super.getInfo();
    Info.set(info, 'values', this.values);
    return info; }

  conformability(meta: IAttribute, debug: boolean = true): number {
    let conformability = 0;
    // todo: questo check è totalmente sbagliato, this.getType non può riuscire senza un metaParent assegnato
    conformability += 0.5 * StringSimilarity.compareTwoStrings(this.getType().short, meta.getType().short);
    conformability += 0.5 * StringSimilarity.compareTwoStrings(this.name, meta.name);
    U.pif(debug, 'ATTRIBUTE.comform(', this.name, {0: this}, ', ', meta.name, {0: meta}, ') = ', conformability);
    return conformability; }

  duplicate(nameAppend: string = null, newParent: MClass = null): MAttribute {
    const ret: MAttribute = new MAttribute(newParent, null, this.metaParent);
    ret.copy(this, nameAppend, newParent);
    return ret; }

  copy(other: MAttribute, nameAppend: string = '_Copy', newParent: MClass = null): void {
    super.copy(other, nameAppend, newParent);
    this.setValueStr(other.getValueStr()); }

  generateModel(): Json {
    if (this.values.length === 0) { return null; }
    if (this.values.length === 1) { return this.values[0]; }
    return this.values; }

  validate(): boolean {
    let i: number;
    switch (this.getType().long) {
      default: U.pe(true, 'unexpected mattrib type:', this.getType()); return false;
      case AttribETypes.EDate: U.pe(true, 'eDAte: todo'); break;
      case AttribETypes.EBoolean: return true;
      case AttribETypes.EChar: return U.isString(this.values) || U.isCharArray(this.values);
      case AttribETypes.EString: return U.isStringArray(this.values);
      case AttribETypes.EFloat:
      case AttribETypes.EDouble:
        for (i = 0; i < this.values.length; i++) { this.values[i] = +this.values[i]; }
        return U.isNumberArray(this.values, this.getType().minValue, this.getType().maxValue);
      case AttribETypes.EByte:
      case AttribETypes.EShort:
      case AttribETypes.EInt:
      case AttribETypes.ELong:
        for (i = 0; i < this.values.length; i++) { this.values[i] = +this.values[i]; }
        return U.isIntegerArray(this.values, this.getType().minValue, this.getType().maxValue);
    }
  }

  fieldChanged(e: JQuery.ChangeEvent) {
    const html: HTMLElement = e.currentTarget;
    switch (html.tagName.toLowerCase()) {
      default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
      case 'textarea':
      case 'input': this.setValueStr((html as HTMLInputElement).value); break;
      case 'select': U.pe(true, 'Unexpected non-disabled select field in a Vertex.MAttribute.'); break;
    }
    try { this.parent.refreshGUI(); } catch (e) {} finally {}
  }

  setValueStr(valStr: string) {
    if (this.metaParent.upperbound === 1) {
      // this.setValue(JSON.parse( '"' + U.replaceAll(valStr, '"', '\\"') + '"'));
      this.setValue([ valStr ]);
      return; }
    try { this.setValue(JSON.parse(valStr)); } catch (e) {
      U.pw(true, 'This attribute have upperbound > 1 and the input is not a valid JSON string: ' + valStr);
      return; } finally {}
  }
  setValue(values: any[] = null, refreshGUI: boolean = true, debug: boolean = false) {
    const values0 = values;
    const type: EType = this.getType();
    const defaultv: any = type.defaultValue;
    if (U.isEmptyObject(values, true, true) || values === [{}]) {
      values = defaultv; }
    if (!Array.isArray(values)) { values = [values]; }
    U.pif(debug, this.metaParent.fullname() +  '.setvalue: |', values0, '| --> ', values, 'defaultv:', defaultv, 'type:', type);
    this.values = values;
    U.pe('' + values === '' + undefined, 'undef:', values, this);
    // this.replaceVarsSetup();
    if (refreshGUI) { this.refreshGUI(); } else { this.graph().propertyBar.refreshGUI(); } }

  getValueStr(debug: boolean = false): string {
    let ret: any;
    if (this.metaParent.upperbound === 1) {
      ret = this.values.length ? this.values[0] : '';
    } else { ret = this.values; }
    let retStr: string = Array.isArray(ret) ? JSON.stringify(ret) : '' + ret;
    if (retStr === '' + undefined) { this.setValue(null); retStr = this.valuesStr = '' + this.values[0]; }
    U.pif(debug, 'this.values:', this.values, ', val[0]:', this.values[0], 'retStr:', retStr);
    ///
    const field: IField = this.getField();
    const html: HTMLElement | SVGElement = field ? field.getHtml() : null;
    if (!html) { return retStr; }
    ($(html).find('input')[0] as HTMLInputElement).value = retStr; // todo: delete
    return retStr; }

  replaceVarsSetup(debug: boolean = false): void {
    super.replaceVarsSetup();
    const old = this.valuesStr;
    U.pif(debug, this.values);
    const val: string = this.getValueStr();
    U.pif(debug, 'val:', val, ', this.values:', this.values, ', this:', this);
    this.valuesStr = val ? U.replaceAll(val, '\n', '', debug) : '';
    if (this.valuesStr && this.valuesStr[0] === '[') {this.valuesStr = this.valuesStr.substr(1, this.valuesStr.length - 2); }
    U.pif(debug, 'valuesSTR: |' + old + '| --> |' + this.valuesStr + '|'); }

}

