import {
  EType,
  IClass,
  IFeature,
  Json,
  M2Attribute, M3Class, M3Feature, M3Reference,
  ShortAttribETypes,
  Status,
  U
} from '../common/Joiner';

export abstract class IAttribute extends IFeature {
  metaParent: IAttribute;
  instances: IAttribute[];


  /*static GetDefaultStyle(modelRoot: IModel, type: EType = null): HTMLElement | SVGElement {
    return ModelPiece.GetDefaultStyle(modelRoot, 'Attribute', type); }

  static SetDefaultStyle(type: ShortAttribETypes, modelRoot: IModel, newTemplate: HTMLElement): void {
    const selector = '.' + (modelRoot.isM() ? 'M' : 'MM') + 'DefaultStyles>.Attribute.Template.' + type;
    let $oldTemplate: JQuery<HTMLElement> = $(selector + '.Customized');
    if ($oldTemplate.length === 0) { $oldTemplate = $(selector); }
    U.pe($oldTemplate.length !== 1, 'template not found? (' + $oldTemplate.length + '); selector: "' + selector + '"');
    const old = $oldTemplate[0];
    newTemplate.classList.add('Template');
    newTemplate.classList.add('Customized');
    old.parentNode.appendChild(newTemplate);
    if (old.classList.contains('Customized')) { old.parentNode.removeChild(old); }
    return; }

  setDefaultStyle(value: string): void {
    U.pw(true, 'Attribute.setDefaultStyle(): todo.');
  }
*/


  getStyle(): HTMLElement | SVGElement {
    const htmlRaw: HTMLElement | SVGElement = super.getStyle();
    const $html = $(htmlRaw);
    const $selector = $html.find('select.TypeSelector');
    EType.updateTypeSelector($selector[0] as HTMLSelectElement, this.getType());
    return htmlRaw; }

  copy(other: IAttribute, nameAppend: string = '_Copy', newParent: IClass = null): void {
    super.copy(other, nameAppend, newParent);
    if (newParent) { U.ArrayAdd(newParent.attributes, this); }
    this.refreshGUI();
  }

  getInfo(toLower: boolean = false): any {
    const info: any = super.getInfo(toLower);
    const set = (k: string, v: any) => {
      k = toLower ? k.toLowerCase() : k;
      while (info[k]) { k = Status.status.XMLinlineMarker + k; }
      info[k] = v; };
    const unset = (k: string) => { delete info[toLower ? k.toLowerCase() : k]; };
    const prefix: string = this.getModelRoot().getPrefix().toUpperCase();
    const type: EType = this.getType();
    // set('tsClass', (prefix) + 'Attribute');
    set('type', type ? type.name : '???');
    set('typeDetail', type);
    set('lowerBound', this.lowerbound);
    set('upperBound', this.upperbound);
    unset('childrens');
    return info; }

  abstract getType(): EType;
  refreshGUI_Alone(debug: boolean = true): void { }

  replaceVarsSetup(): void { return; }

}

export class M3Attribute extends IAttribute {
  parent: M3Class;
  metaParent: M3Attribute;
  instances: M2Attribute[] = []; // | M3Attribute[]

  constructor(parent: M3Class, meta: IAttribute) {
    super(parent, meta);
    this.parse(null, true); }

  duplicate(nameAppend: string = '_', newParent: M3Class = null): M3Attribute { U.pe(true, 'm3Attr.duplicate()'); return this; }

  generateModel(): Json {
    U.pe(true, 'm3Attr.generateModel()');
    return {}; }

  getType(): EType { U.pe(true, 'm3Attr.getType()'); return EType.get(ShortAttribETypes.EString); }

  parse(json: Json, destructive: boolean = true): void {
    this.name = 'Attribute'; }


  conformability(metaparent: M3Attribute, outObj?: any, debug?: boolean): number {  return 1; }

}
