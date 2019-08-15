import {
  Json,
  U,
  IVertex,
  IEdge,
  IField,
  IPackage,
  M2Class,
  IAttribute,
  AttribETypes,
  IFeature,
  ModelPiece,
  ISidebar,
  IGraph, MetaMetaModel,
  IModel, ModelNone, MPackage, Model, M2Package, IReference, MReference, M2Reference, M3Package, ECoreRoot, M3Class, M3Reference, Status
} from '../common/Joiner';


export class MetaModel extends IModel {
  static emptyModel: string =
  '{ "ecore:EPackage": {\n' +
  '    "@xmlns:xmi": "http://www.omg.org/XMI",\n' +
  '    "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",\n' +
  '    "@xmlns:ecore": "http://www.eclipse.org/emf/2002/Ecore",\n' +
  '    "@xmi:version": "2.0",\n' +
  '    "eClassifiers": []' +
  '  }' +
  '}';

  metaParent: MetaMetaModel = null;
  instances: Model[] = [];
  childrens: M2Package[] = [];

  constructor(json: Json, metaParent: MetaMetaModel) { super(metaParent); this.parse(json, true); }

  getAllClasses(): M2Class[] { return super.getAllClasses() as M2Class[]; }
  getAllReferences(): M2Reference[] { return super.getAllReferences() as M2Reference[]; }
  getClass(fullname: string, throwErr: boolean = true, debug: boolean = true): M2Class {
    return super.getClass(fullname, throwErr, debug) as M2Class; }

  getClassByNameSpace(fullnamespace: string, caseSensitive: boolean = false, canThrow: boolean = false): M2Class {
    const classes: M2Class[] = this.getAllClasses();
    let i: number;
    if (caseSensitive) { fullnamespace = fullnamespace.toLowerCase(); }
    let justNameMatchFallback: M2Class = null;
    let namestr: string = fullnamespace.substr(fullnamespace.lastIndexOf(':') + 1);
    if (!caseSensitive) { namestr = namestr.toLowerCase(); }
    for (i = 0; i < classes.length; i++) {
      const mmclass: M2Class = classes[i];
      if ( (caseSensitive ? mmclass.name : mmclass.name.toLowerCase()) === namestr) { justNameMatchFallback = mmclass; }
      let mmclassNS = mmclass.getNamespaced();
      if (!mmclassNS) { continue; }
      if (caseSensitive) { mmclassNS = mmclassNS.toLowerCase(); }
      if (mmclassNS === fullnamespace) { return mmclass; } }
    U.pe(!justNameMatchFallback, 'class |' + fullnamespace + '| not found. classArr:', classes);
    return justNameMatchFallback; }

  fixReferences(): void {
    const arr: M2Reference[] = this.getAllReferences();
    let i = -1;
    while (++i < arr.length) { arr[i].link(); } }

  parse(json: Json, destructive: boolean = true): void {
    if (destructive) { this.childrens = []; }
    const childrens = Json.getChildrens(json);
    let i;
    for (i = 0; i < childrens.length; i++) {
      const child = childrens[i];
      const metaParent: M3Package = null;
      // metaParent = U.findMetaParentP(this, child);
      if (destructive) { U.ArrayAdd(this.childrens, new M2Package(this, child, metaParent)); continue; }
      U.pe(true, 'Non-destructive m2-model parse: to do');
    }
  }

  generateModel(): Json {
    const packageArr = [];
    let i;
    for (i = 0; i < this.childrens.length; i++) {
      const pkg = this.childrens[i];
      packageArr.push(pkg.generateModel());
    }
    const model = new Json(null);
    model[ECoreRoot.ecoreEPackage] = packageArr;
    return model; }

  getDefaultPackage(): M2Package {
    if (this.childrens.length !== 0) { return this.childrens[0]; }
    U.ArrayAdd(this.childrens, new M2Package(null, null, this.metaParent.getDefaultPackage()) );
    return this.childrens[0]; }

  conformability(metaparent: MetaMetaModel, outObj?: any, debug?: boolean): number { return 1; }

  getPrefix(): string { return 'm2'; }
  isM1(): boolean { return false; }
  isM2(): boolean { return true; }
  isM3(): boolean { return false; }


}
