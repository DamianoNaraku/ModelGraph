import {
  Json,
  U,
  IEdge,
  IVertex,
  IPackage,
  IClass,
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
  constructor(logic: IFeature) { this.logic = logic; }

}