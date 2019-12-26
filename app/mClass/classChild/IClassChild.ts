import {
  EOperation,
  IClass,
  IField,
  IGraph, Info, IPackage,
  IVertex, Json,
  M2Attribute,
  M2Class,
  M2Reference,
  M3Attribute,
  M3Reference,
  MAttribute, MClass,
  ModelPiece,
  MReference,
  ShortAttribETypes,
  Status, Type,
  U
}                    from '../../common/Joiner';
import {EType}       from './Type';
import {IClassifier} from '../IClassifier';

export type M1ClassChild = MAttribute | MReference;
export type M2ClassChild = M2Attribute | M2Reference | EOperation;
export type M3ClassChild = M3Attribute | M3Reference;
export abstract class IClassChild extends ModelPiece {
  upperbound: number = 1 || 1; // to avoid stupid compiler warning on primitive types
  lowerbound: number = 0 || 0;
  parent: ModelPiece; // parent: IClass | EOperation; todo: aggiusta.
  metaParent: IClassChild;
  instances: IClassChild[];
  field: IField;
  ordered: boolean = false && false;
  unique: boolean = false && false;
  type: Type;
  constructor(parent: ModelPiece, metaVersion: ModelPiece){
    super(parent, metaVersion);
    this.type = this.getModelRoot().isM2() ? new Type(this) : null;
  }
  // typeClassFullnameStr: string = null;
/*
  parsePrintableTypeName(eTypeLongStr: string): void {
    this.classType = null;
    this.typeClassFullnameStr = null;
    const pkg: IPackage = this.getPackage();
    const searchStr: string = '#//' || '';
    const pos = eTypeLongStr.lastIndexOf(searchStr);
    if (pos === 0 && pkg) {
      this.typeClassFullnameStr = pkg.name + '.' + eTypeLongStr.substring(pos + searchStr.length);
      return; }
    this.updateTypeAndValue(EType.getFromLongString(eTypeLongStr), false);
    U.pe(!this.getType(), 'found json ecore type that is not a classname or a primitive type.', eTypeLongStr);
    return; }*/

  fieldChanged(e: JQuery.ChangeEvent, ignoreSwitch: boolean = false): void {
    const html: HTMLElement = e.currentTarget;
    const graph: IGraph = this.getModelRoot().graph;
    const fromGraph: boolean = U.isParentOf(graph.container, html);
    const fromSidebar: boolean = U.isParentOf(graph.propertyBar.container, html);
    if (!ignoreSwitch) switch (html.tagName.toLowerCase()) {
      default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
      case 'textarea':
      case 'input': this.setName((html as HTMLInputElement).value); break;
      case 'select':
        this.setType((html as HTMLSelectElement).value, true, false); break; }
    if (!fromGraph) { this.refreshGUI(); }
    if (!fromSidebar) { graph.propertyBar.refreshGUI(); }
  }

  setType(classOrPrimitiveString: string, throwError: boolean = true, refreshGui: boolean = true): boolean {
    const type: Type = this.getType();
    U.pe(type !== this.type, 'attempting to change parent type!', this, type);
    type.changeType(classOrPrimitiveString);
    if (refreshGui) this.refreshGUI();
    return true; }

  // updateTypeAndValue(primitiveType: EType = null, refreshGui: boolean = true): void {}
/*
  setClassType(classType: M2Class = null, refreshGui: boolean = true): void {
    if (!classType || this.classType === classType) { return; }
    this.classType = classType;
    if (!refreshGui) { return; }
    this.refreshGUI();
    this.refreshInstancesGUI(); }*/

  getType(): Type { return this.type; }

  getInfo(toLower: boolean = false): any {
    const info: any = super.getInfo(toLower);
    if (!(this instanceof EOperation)) { Info.unset(info, 'childrens'); }
    Info.set(info, 'lowerBound', this.lowerbound);
    Info.set(info, 'upperBound', this.upperbound);
    const type: Type = this.getType();
    Info.set(info, 'type', type.toEcoreString());
    Info.set(info, 'typeDetail', type);
    return info; }

  // copy(other: IAttribute, nameAppend: string = '_Copy', newParent: IClass = null): void {
  copy(c: IClassChild, nameAppend: string = '_Copy', newParent: ModelPiece = null): void {
    super.copy(c, nameAppend, newParent);
    this.lowerbound = c.lowerbound;
    this.upperbound = c.upperbound;
    this.unique = c.unique;
    this.ordered = c.ordered;
    this.setType(c.getType().toEcoreString(), null, false);
    this.refreshGUI(); }

  abstract getClass(): IClassifier;
  getPackage(): IPackage { return this.parent ? this.getClass().parent : null; }
  graph(): IGraph { return this.getVertex().owner; }
  getVertex(): IVertex { return this.parent ? this.getClass().getVertex() : null; }

  /*linkToMetaParent<T extends IClassChild>(classChild: T) {
    U.pe(true, 'linkToMetaPrent: todo();');
    this.metaParent = classChild;
    if (!this.metaParent) { return; }
    U.ArrayAdd(this.metaParent.instances, this); }*/

  fullname(): string { return this.getClass().fullname() + '.' + this.name; }
  generateField(): IField { return this.field = new IField(this); }
  getField(): IField { return this.field ? this.field : this.generateField(); }

  refreshGUI_Alone(debug: boolean = true): void { this.getField().refreshGUI(true); }

  delete(): void {
    super.delete();
    if (this.parent) {
      if (this.parent instanceof IClass) {
        U.arrayRemoveAll(this.parent.attributes, this as any);
        U.arrayRemoveAll(this.parent.references, this as any);
        U.arrayRemoveAll(this.parent.getOperations(), this as any);
      } else if (this.parent instanceof EOperation) {
      } else { U.pe(true, 'unrecognized parent class:' + U.getTSClassName(this) + ':', this); }
    }
  }

  // getClassType(): M2Class { return this.type.classType; }
  getUpperbound(): number { return this.upperbound; }
  getLowerbound(): number { return this.lowerbound; }
  setUpperbound(val: number): void { this.upperbound = isNaN(+val) ? -1 : +val; }
  setLowerbound(val: number): void { this.lowerbound = isNaN(+val) || +val < 0 ? 0 : +val; }
}
