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
  EdgePointStyle, EOperation, EParameter, Typedd, Type, Dictionary, EEnum,
  IClassifier, ECoreEnum, EcoreLiteral
}                                from '../../common/Joiner';

import ChangeEvent = JQuery.ChangeEvent;

export class ELiteral extends Typedd {
  parent: EEnum;
  literal: string;
  value: number;

  constructor(parent: EEnum, json: Json) {
    super(parent, null);
    this.parse(json);
  }
  duplicate(nameAppend?: string, newParent?: ModelPiece): ModelPiece {
    return undefined; //todo
  }

  generateModel(): Json {
    const model: Json = {};
    model[EcoreLiteral.value] = this.value;
    model[EcoreLiteral.literal] = this.literal;
    model[EcoreLiteral.namee] = this.name;
    return model; }

  getClass(): EEnum { return this.parent; }

  setLiteral(value: string, refreshGUI: boolean = false, warnDuplicateFix: boolean = true): string {
    if (value === '' || !value) { this.literal = ''; return; }
    return this.setName0(value, refreshGUI, warnDuplicateFix, 'literal', true); }

  parse(json: Json, destructive: boolean = true): void {
    this.value = Json.read<number>(json, EcoreLiteral.value, Number.NEGATIVE_INFINITY);
    this.setLiteral(Json.read<string>(json, EcoreLiteral.literal, ''), false);
    let name: string = Json.read<string>(json, EcoreLiteral.namee, this.value === Number.NEGATIVE_INFINITY ? null : this.parent.name + '_' + this.value);
    if (name) this.setName(name, false); else this.name = null;
  }


  fieldChanged(e: ChangeEvent) {
    const html: HTMLElement = e.currentTarget;
    switch (html.tagName.toLowerCase()) {
    default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
    case 'textarea':
    case 'input':
      const input: HTMLInputElement = html as HTMLInputElement;
      if (input.classList.contains('name')) { this.setName(input.value); } else
      if (input.classList.contains('literal')) { this.setLiteral(input.value); } else
      if (input.classList.contains('value')) { this.value = isNaN(+input.value) ? this.value : +input.value; }
      else U.pe(true, 'ELiteral input fields must contain one of the following classes: name, literal, value');
      break;
    case 'select': U.pe(true, 'Unexpected non-disabled select field in a Vertex.ELiteral.'); break;
    }
    super.fieldChanged(e, true);
  }

  generateModelM1(): string { return this.name; }
}
