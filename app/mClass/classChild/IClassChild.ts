import {
  EOperation,
  EType,
  IClass,
  IField,
  IGraph, Info, IPackage,
  IVertex,
  M2Attribute,
  M2Class,
  M2Reference,
  M3Attribute,
  M3Reference,
  MAttribute, MClass,
  ModelPiece,
  MReference,
  ShortAttribETypes,
  Status,
  U
} from '../../common/Joiner';

export type M1ClassChild = MAttribute | MReference;
export type M2ClassChild = M2Attribute | M2Reference | EOperation;
export type M3ClassChild = M3Attribute | M3Reference;
export abstract class IClassChild extends ModelPiece {
  upperbound: number = 1 || 1; // to avoid stupid compiler warning on primitive types
  lowerbound: number = 1 || 1;
  parent: ModelPiece; // parent: IClass | EOperation; todo: aggiusta.
  metaParent: IClassChild;
  instances: IClassChild[] = [];
  field: IField;
  ordered: boolean = false && false;
  unique: boolean = false && false;
  primitiveType: EType = null;
  classType: M2Class = null;
  typeClassFullnameStr: string = null;

  parsePrintableTypeName(eTypeLongStr: string): void {
    this.classType = null;
    this.typeClassFullnameStr = null;
    const pkg: IPackage = this.getPackage();
    const searchStr: string = '#//' || '';
    const pos = eTypeLongStr.lastIndexOf(searchStr);
    if (pos === 0 && pkg) {
      this.typeClassFullnameStr = pkg.name + '.' + eTypeLongStr.substring(pos + searchStr.length);
      return; }
    this.setPrimitiveType(EType.getFromLongString(eTypeLongStr), false);
    U.pe(!this.getType(), 'found json ecore type that is not a classname or a primitive type.', eTypeLongStr);
    return; }

  fieldChanged(e: JQuery.ChangeEvent): void {
    const html: HTMLElement = e.currentTarget;
    switch (html.tagName.toLowerCase()) {
      default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
      case 'textarea':
      case 'input': this.setName((html as HTMLInputElement).value); break;
      case 'select':
        // todo: problemi se una "package.class" è omonima ad un shortAttribute. Non devo mai usare "." negli shortAttribute.
        this.setType((html as HTMLSelectElement).value, true, true);  break; } }

  setType(classOrPrimitiveString: string, throwError: boolean = true, refreshGui: boolean = true): boolean {
    const type: EType = EType.get(classOrPrimitiveString as ShortAttribETypes);
    if (type) { this.setPrimitiveType(type, refreshGui); return true; }
    const targetClass: M2Class = this.getm2().getClass(classOrPrimitiveString, true);
    if (targetClass) { this.setClassType(targetClass, refreshGui); return true; }
    U.pe(throwError && !targetClass, 'failed to find type: |' + classOrPrimitiveString + '| primitiveShortTypes:',
      ShortAttribETypes, ', defined m2classes:', Status.status.mm.getAllClasses());
    return false; }

  setPrimitiveType(primitiveType: EType = null, refreshGui: boolean = true): void {
    if (!primitiveType || this.primitiveType === primitiveType) { return; }
    this.primitiveType = primitiveType;
    if (!refreshGui) { return; }
    this.refreshGUI();
    this.refreshInstancesGUI(); }

  setClassType(classType: M2Class = null, refreshGui: boolean = true): void {
    if (!classType || this.classType === classType) { return; }
    this.classType = classType;
    if (!refreshGui) { return; }
    this.refreshGUI();
    this.refreshInstancesGUI(); }

  getType(): EType { return this.primitiveType; }

  getInfo(toLower: boolean = false): any {
    const info: any = super.getInfo(toLower);
    if (!(this instanceof EOperation)) { Info.unset(info, 'childrens'); }
    Info.set(info, 'lowerBound', this.lowerbound);
    Info.set(info, 'upperBound', this.upperbound);
    const type: M2Class | EType = this.getType() || this.getClassType();
    Info.set(info, 'type', type ? (this.getType() ? type.name : '#//' + type.name) : '???');
    Info.set(info, 'typeDetail', type);
    return info; }

  // copy(other: IAttribute, nameAppend: string = '_Copy', newParent: IClass = null): void {
  copy(c: IClassChild, nameAppend: string = '_Copy', newParent: ModelPiece = null): void {
    super.copy(c, nameAppend, newParent);
    this.lowerbound = c.lowerbound;
    this.upperbound = c.upperbound;
    this.unique = c.unique;
    this.ordered = c.ordered;
    this.setPrimitiveType(c.getType());
    if (c.classType) {
      this.typeClassFullnameStr = c.classType.fullname(); this.linkClass();
    } else { this.typeClassFullnameStr = c.typeClassFullnameStr; }
    this.refreshGUI(); }

  abstract getClass(): IClass;
  getPackage(): IPackage { return this.parent ? this.getClass().parent : null; }
  graph(): IGraph { return this.getVertex().owner; }
  getVertex(): IVertex { return this.parent ? this.getClass().getVertex() : null; }

  linkClass(classe: IClass = null, id: number = null, refreshGUI: boolean = true, debug: boolean = false): void {
    if (!Status.status.mm) { return; }
    if (!classe) {
      if (id === null) { classe = this.classType = Status.status.mm.getClass(this.typeClassFullnameStr, true); }
      else { classe = ModelPiece.getByID(id) as any as IClass; }
    }
    if (classe instanceof M2Class) { this.linkClassM2(classe, null, debug); return; }
    if (classe instanceof MClass) { this.linkClassM1(classe, null, debug); return; }
    U.pe(true, 'invalid modelpieceType: ', classe, 'id:', id); }

  linkClassM1(classe: MClass = null, id: number = null, refreshGUI: boolean = true, debug: boolean = false): void {
    U.pe(true, 'linkClassM1() should be overriden'); }

  linkClassM2(classe: M2Class = null, id: number = null, refreshGUI: boolean = true, debug: boolean = false): void {
    if (this.classType) { U.arrayRemoveAll(this.classType.referencesIN, this as any); }
    if (classe) {
      this.classType = classe;
      this.typeClassFullnameStr = classe.fullname();
    } else if (id !== null) {
      this.classType = ModelPiece.getByID(id) as any as M2Class;
      this.typeClassFullnameStr = this.classType.fullname(); }
    else { this.classType = Status.status.mm.getClass(this.typeClassFullnameStr, true); }

    U.pe(!this.classType, 'failed: ', classe, id);
    U.pif(debug, 'classType changed; targetFullName:' + this.classType.fullname() + '; this.targetStr:' + this.typeClassFullnameStr +
      '; target:', this.classType, 'inside:', this); }

  linkToMetaParent<T extends IClassChild>(classChild: T) { this.metaParent = classChild; }
  fullname(): string { return this.getClass().fullname() + '.' + this.name; }
  midname(): string { return this.getClass().name + '.' + this.name; }
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

  getClassType(): M2Class { return this.classType; }
  getUpperbound(): number { return this.upperbound; }
  getLowerbound(): number { return this.lowerbound; }
  setUpperbound(val: number): void { this.upperbound = isNaN(+val) ? -1 : +val; }
  setLowerbound(val: number): void { this.lowerbound = isNaN(+val) || +val < 0 ? 0 : +val; }
}
