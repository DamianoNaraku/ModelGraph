import {
  Json,
  U,
  IEdge,
  IVertex,
  IPackage,
  M2Class,
  IAttribute,
  AttribETypes,
  IFeature,
  ModelPiece,
  ISidebar,
  IGraph,
  IModel,
  Status
} from '../../common/Joiner';

export class IField {
  owner: IVertex;
  logic: IFeature;
  private html: HTMLElement | SVGElement;
  constructor(logic: IFeature) { this.logic = logic; }

  getHtml(): HTMLElement | SVGElement { return this.html; }

  refreshGUI(debug: boolean = true): void { }
}
