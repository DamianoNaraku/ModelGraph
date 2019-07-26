import {
  AttribETypes,
  EType,
  IAttribute,
  IClass,
  IFeature,
  IReference,
  Json,
  MClass,
  ModelPiece,
  ShortAttribETypes,
  U
} from '../common/Joiner';


export class MAttribute extends IAttribute {
  metaParent: ModelPiece;
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
  static SplitAtNotRepeatingChar(str: string, char: string): string[] {
    const ret: string[] = [];
    U.pe(char.length !== 1, 'currently only chars are supported.');
    let i: number;
    const indexes: number[] = [];
    let startIndex = 0;
    let endIndex = null;
    for (i = 0; i < str.length; i++) {
      const prev = i === 0 ? null : str[i - 1];
      const current = str[i];
      const next = i === str.length ? null : str[i + 1];
      if (current === char && prev !== current && next !== current) {
        indexes.push(i);
        endIndex = i;
        const match = str.substring(startIndex, endIndex);
        ret.push(match);
        startIndex = endIndex + 1;
      }
    }
    return ret;
  }

  static generateEmptyAttribute(): Json { return {}; }

  modify(json: Json, destructive: boolean) {
    this.setValue(json as any[]);
    if (!this.validate()) {
      this.mark(true, 'errorValue');
      U.pw(true, 'marked attribute (' + this.metaParent.name + ') with type ', this.getType(), 'values:', this.values, 'this:', this);
    } else { this.mark(false, 'errorValue'); }
  }
  comformability(meta: IAttribute): number {
    throw new Error('MAttribute.conformability(): to do');
  }

  delete(): void {
  }

  duplicate(nameAppend: string = null, newParent: MClass = null): MAttribute {
    const ret: MAttribute = new MAttribute(null, null, null);
    ret.copy(this, nameAppend, newParent);
    return ret; }

  copy(other: MAttribute, nameAppend: string = '_Copy', newParent: IClass = null): void {
    super.copy(other, nameAppend, newParent);
    this.metaParent = other.metaParent;
    this.setValueStr(other.getValueStr()); }

  generateModel(): Json {
    if (this.values.length === 0) { return null; }
    if (this.values.length === 1) { return this.values[0]; }
    return this.values;
  }

  generateModelString(): string { return super.generateModelString(); }

  refreshGUI(): void { super.refreshGUI(); }

  refreshInstancesGUI(): void { throw new Error('pointless operation in Model entities'); }

  remove(): ModelPiece | IFeature | IReference | IAttribute { return super.remove(); }

  validate(): boolean {
    switch (this.getType().long) {
      default: U.pe(true, 'unexpected mattrib type:', this.getType()); return false;
      case AttribETypes.EDate: U.pe(true, 'eDAte: todo'); break;
      case AttribETypes.EBoolean: return true;
      case AttribETypes.EChar: return U.isString(this.values) || U.isCharArray(this.values);
      case AttribETypes.EString: return U.isStringArray(this.values);
      case AttribETypes.EFloat:
      case AttribETypes.EDouble: return U.isNumberArray(this.values, this.getType().minValue, this.getType().maxValue);
      case AttribETypes.EByte:
      case AttribETypes.EShort:
      case AttribETypes.EInt:
      case AttribETypes.ELong: return U.isIntegerArray(this.values, this.getType().minValue, this.getType().maxValue);
    }
  }

  fieldChanged(e: JQuery.ChangeEvent) {
    const html: HTMLElement = e.currentTarget;
    switch (html.tagName.toLowerCase()) {
      default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
      case 'textarea':
      case 'input': this.setValueStr((html as HTMLInputElement).value); break;
      case 'select': U.pe(true, 'non dovrebbero esserci campi select nel vertice di un MAttribute.'); break;
    }
  }

  setValueStr(valStr: string) {
    if ((this.metaParent as IAttribute).upperbound === 1) {
      // this.setValue(JSON.parse( '"' + U.replaceAll(valStr, '"', '\\"') + '"'));
      this.setValue([ valStr ]);
      return; }
    try { this.setValue(JSON.parse(valStr)); } catch (e) {
      U.pw(true, 'This attribute have upperbound > 1 and the input is not a valid JSON string: ' + valStr);
      return; }
  }
  setValue(values: any[] = null) {
    // U.pw(true, 'setvalue: |' + values + '| = |', values, '|');
    const values0 = values;
    const type: EType = (this.metaParent as IAttribute).type;
    const defaultv: any = type.defaultValue;
    if (values === null || values === undefined || $.isEmptyObject(values) || values === [{}]) {
      values = defaultv; }
    if (!Array.isArray(values)) { values = [values]; }
    // console.clear();
    // console.log('setvalue: |', values0, '| --> ', values, 'defaultv:', defaultv, 'type:', type);
    this.values = values;
    // this.replaceVarsSetup();
    this.refreshGUI(); }
  getValueStr(): string {
    let ret: any = this.values;
    if ((this.metaParent as IAttribute).upperbound === 1) { ret = this.values.length ? this.values[0] : ''; }
    if (ret === '' + ret) { return '' + ret; }
    return JSON.stringify(ret); }
  replaceVarsSetup(debug: boolean = false): void {
    const old = this.valuesStr;
    U.pif(debug, this.values);
    this.valuesStr = U.replaceAll(this.getValueStr(), '\n', '', debug);
    if (this.valuesStr && this.valuesStr[0] === '[') {this.valuesStr = this.valuesStr.substr(1, this.valuesStr.length - 2); }
    U.pif(debug, 'valuesSTR: |' + old + '| --> |' + this.valuesStr + '|');
  }
}
