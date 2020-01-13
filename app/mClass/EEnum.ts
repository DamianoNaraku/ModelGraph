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
  EdgePointStyle, EOperation, EParameter, Typedd, Type, Dictionary, IClassifier, ECoreEnum, EcoreLiteral, ELiteral, GraphSize
} from '../common/Joiner';
import ChangeEvent = JQuery.ChangeEvent;

export class EEnum extends IClassifier {
  childrens: ELiteral[];
  serializable: boolean;

  constructor(parent: IPackage, json: Json) {
    super(parent, null);
    if (this.parent) { U.ArrayAdd(this.parent.enums, this); }
    this.parse(json);
  }

  fullname(): string { return this.parent.name + '.' + this.name; }

  refreshGUI_Alone(debug: boolean = false): void { this.getVertex().refreshGUI(); }

  addLiteral(): ELiteral {
    const attr: ELiteral = new ELiteral(this, null);
    if (attr.value === Number.NEGATIVE_INFINITY) this.autofixEnumValues();
    this.refreshGUI();
    return attr; }

  parse(json: Json, destructive?: boolean): void {
    /*
  <eClassifiers xsi:type="ecore:EEnum" name="EnumNamecustom" instanceTypeName="instanceTypeName"
      serializable="false">
    <eLiterals name="child2name" value="3" literal="child2literal"/>
    <eLiterals name="NameStr" literal="LiteralStr"/>
  </eClassifiers>*/
    // literal, name sono entrambi unici, ma è possibile che literal1.name === literal2.literal; .name è obbligatorio, .literal può essere null/empty
    this.childrens = [];
    this.instanceTypeName = '';
    let i: number;
    this.setName(Json.read<string>(json, ECoreEnum.namee, 'Enum_1'), false);

    for (let key in json) {
      const value: Json = json[key];
      switch (key){
        default: U.pe(true, 'Enum.parse() unexpected key:', key, 'in json:', json); break;
        case ECoreEnum.xsitype: case ECoreEnum.namee: break;
        case ECoreEnum.eLiterals: break;
        case ECoreEnum.serializable: this.serializable = value === 'true'; break;
        case ECoreEnum.instanceTypeName: this.instanceTypeName = value + ''; break;
      }
    }

    const literals: Json[] = Json.getChildrens(json);
    for (i = 0; i < literals.length; i++) { new ELiteral(this, literals[i]); }
    if (!this.childrens.length) new ELiteral(this, null);
    this.autofixEnumValues();
  }

  duplicate(nameAppend?: string, newParent?: ModelPiece): ModelPiece {
    return undefined;
  }

  fieldChanged(e: JQuery.ChangeEvent): void {
    const html: HTMLElement = e.currentTarget;
    if (html.classList.contains('AddFieldSelect')) return;
    switch (html.tagName.toLowerCase()) {
    case 'select':
    default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
    case 'textarea':
    case 'input':
      const input = html as HTMLInputElement;
      input.value = this.setName((input as HTMLInputElement).value); break;
    }
  }

  generateModel(): Json {
    const arr: Json[] = [];
    const model: Json = {};
    model[ECoreEnum.xsitype] = 'ecore:EEnum';
    model[ECoreEnum.namee] = this.name;
    model[ECoreEnum.serializable] = this.serializable ? "true" : "false";
    if (this.instanceTypeName) model[ECoreEnum.instanceTypeName] = this.instanceTypeName;
    model[ECoreEnum.eLiterals] = arr;
    let i;
    for (i = 0; i < this.childrens.length; i++) { arr.push(this.childrens[i].generateModel()); }
    return model; }

  /*must remain private*/ private autofixEnumValues(): void {
    // valori duplicati sono ammessi se esplicitamente inseriti, ma se il campo è vuoto io cerco di generarli
    let i: number;
    let valuesfound: Dictionary<number, boolean> = {};
    let firsthole: number = 0;
    for (i = 0; i < this.childrens.length; i++) {
      const lit: ELiteral = this.childrens[i];
      if (lit.value !== Number.NEGATIVE_INFINITY) {
        valuesfound[lit.value] = true;
        if (lit.value === firsthole) { while (valuesfound[++firsthole]) { ; } } // update first hole.
        continue; }
      lit.value = firsthole;
      if (!lit.name) lit.name = this.name + '_' + lit.value;
    }
  }

  isChildLiteralTaken(s: string): boolean { // indirectly called by setLiteral(); using this['isChildLiteralTaken']();
    let i;
    for (i = 0; i < this.childrens.length; i++) { if (s === this.childrens[i].literal) { return true; } }
    return false; }

  getAllowedValuesStr(): string[] {
    const arr: string[] = [];
    let i: number;
    for (i = 0; i < this.childrens.length; i++) { arr.push(this.childrens[i].name); }
    return arr; }
  getAllowedValuesInt(): number[] {
    const arr: number[] = [];
    let i: number;
    for (i = 0; i < this.childrens.length; i++) { arr.push(this.childrens[i].value); }
    return arr; }
}

