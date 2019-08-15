import {
  Json,
  U,
  IEdge,
  IField,
  IPackage,
  M2Class,
  IAttribute,
  AttribETypes,
  ModelPiece,
  ISidebar,
  IGraph,
  IModel, IClass, M3Class, ModelNone,
  Status, MClass, IVertex, M3Reference, M3Attribute, M2Reference, MReference, MAttribute, M2Attribute
} from '../common/Joiner';
export abstract class IFeature extends ModelPiece {
  upperbound: number = 1 || 1; // to avoid stupid compiler warning on primitive types
  lowerbound: number = 1 || 1;
  parent: IClass;
  metaParent: IFeature;
  childrens: ModelNone[] = null;
  instances: IFeature[] = [];
  field: IField;

  graph(): IGraph { return this.parent.vertex.owner; }
  getVertex(): IVertex { return this.parent.getVertex(); }

  linkToMetaParent<T extends IFeature>(feature: T) { this.metaParent = feature; }
  fullname(): string { return this.parent.fullname() + '.' + this.name; }
  midname(): string { return this.parent.name + '.' + this.name; }
  generateField(): IField { return this.field = new IField(this); }
  getField(): IField { return this.field ? this.field : this.generateField(); }

  refreshGUI_Alone(debug: boolean = true): void { this.getField().refreshGUI(true); }

  delete(): void {
    super.delete();
    if (this.parent) {
      U.arrayRemoveAll(this.parent.attributes, this as any);
      U.arrayRemoveAll(this.parent.references, this as any);
    }
  }
}

export type M3Feature = M3Reference | M3Attribute;
export type M2Feature = M2Reference | M2Attribute;
export type MFeature = MReference | MAttribute;
/*
export abstract class M3Feature extends IFeature {
  parent: M3Class;
  metaParent: M3Feature;
  instances: M3Feature[] | M2Feature[];
}
export abstract class M2Feature extends IFeature {
  parent: M2Class;
  metaParent: M3Feature;
  instances: MFeature[];
}
export abstract class MFeature extends IFeature {
  parent: MClass;
  metaParent: M2Feature;
  instances: ModelNone;
}*/
