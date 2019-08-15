import {
  IModel,
  Json,
  IPackage,
  M2Class,
  IFeature,
  IAttribute,
  IReference,
  MetaModel,
  U,
  IVertex,
  IEdge,
  EdgeStyle, MPackage,
  ModelPiece, Status, MClass, ECoreClass, ModelNone, M3Class, M3Reference, M2Package, MReference
} from '../common/Joiner';

export class Model extends IModel {
  static emptyModel = '{}';
  metaParent: MetaModel = null;
  // instances: ModelNone[] = null;
  childrens: MPackage[] = [];

  classRoot: MClass = null;

  constructor(json: Json, metaModel: MetaModel) {
    super(metaModel);
    this.parse(json, true); }

  fixReferences(): void {/*useless here? or useful in loops?*/}

  getClassRoot(): MClass {
    if (this.classRoot) { return this.classRoot; }
    U.pe(true, 'failed to get class root');
    const classes: MClass[] = this.getAllClasses();
    let i = -1;
    while (++i < classes.length) { if (classes[i]['' + 'isRoot <-- old M2Class var, now deleted']) { return classes[i]; }}
  }

  parse(json: Json, destructive: boolean, metamodel: MetaModel = null) {
    if (!metamodel) {metamodel = Status.status.mm; }
    this.metaParent = metamodel;
    U.pe(!metamodel, 'parsing a model requires a metamodel linked');
    if (destructive) { this.childrens = []; }
    let key: string;
    let mpackage: MPackage;
    if (this.childrens.length === 0) { U.ArrayAdd(this.childrens, new MPackage(this, null)); }
    mpackage = this.childrens[0];
    for (key in json) {
      if (!json.hasOwnProperty(key)) { continue; }
      const namespacedclass: string = key;
      const mmclass: M2Class = this.metaParent.getClassByNameSpace(namespacedclass, false, true);
      const value: Json = json[key];
      const c: MClass = new MClass(mpackage, value, mmclass);
      console.log('mclass:', c);
      if (destructive) { U.ArrayAdd(mpackage.childrens, c); }
    }

    /*
    {
      "org.eclipse.example.bowling:League": { <-- :classroot
        "-xmlns:xmi": "http://www.omg.org/XMI",
        "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
        "-xmi:version": "2.0",
        "Players": [
          { "-name": "tizio" },
          { "-name": "asd" }
        ]
      }
    }
    */
  }
  // parse(deep: boolean) { super.parse(deep); }

  getAllClasses(): MClass[] { return super.getAllClasses() as MClass[]; }
  getAllReferences(): MReference[] { return super.getAllReferences() as MReference[]; }
  getClass(fullname: string, throwErr: boolean = true, debug: boolean = true): MClass {
    return super.getClass(fullname, throwErr, debug) as MClass; }

  generateModel(): Json {
    const json: Json =  {};
    const classRoot: MClass = this.getClassRoot();
    json[classRoot.metaParent.getNamespaced()] = classRoot.generateModel(true);
    return json; }

  // namespace(set: string = null): string { return this.metaParent.namespace(set); }

  getDefaultPackage(): MPackage {
    if (this.childrens.length !== 0) { return this.childrens[0]; }
    U.ArrayAdd(this.childrens, new MPackage(null, null, this.metaParent.getDefaultPackage()) );
    return this.childrens[0]; }


  conformability(metaparent: MetaModel, outObj?: any, debug?: boolean): number {
    U.pw(true, 'm1.conformability(): to do.');
    return 1;
  }


  getPrefix(): string { return 'm'; }
  isM1(): boolean { return true; }
  isM2(): boolean { return false; }
  isM3(): boolean { return false; }

}
