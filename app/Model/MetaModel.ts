import {
  Json,
  U,
  IVertex,
  IEdge,
  IField,
  IPackage,
  IClass,
  IAttribute,
  AttribETypes,
  IFeature,
  ModelPiece,
  ISidebar,
  IGraph,
  IModel
} from '../common/Joiner';
import {forEach} from '@angular/router/src/utils/collection';
import {MetaMetaModel} from './MetaMetaModel';


export class MetaModel extends IModel {
  static emptyMetaModel: string = 'empty meta-model: todo'; // todo

  constructor(json: Json, metaParent: MetaMetaModel) { super(json, metaParent); this.modify(json, true); }

  modify(json: Json, destructive: boolean) { super.modify(json, destructive); }
  // parse(deep: boolean) { super.parse(deep); }
  mark(bool: boolean): boolean {return super.mark(bool); }
  validate(): boolean { return super.validate(); }
  conformsTo(m: IModel): boolean { return super.conformsTo(m); }
  draw(): void { return super.draw(); }


}
