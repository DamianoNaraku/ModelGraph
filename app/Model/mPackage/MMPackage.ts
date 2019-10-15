import {
  Json,
  U,
  IField,
  IEdge,
  IVertex,
  M2Class,
  IAttribute,
  AttribETypes,
  IFeature,
  ModelPiece,
  MetaModel,
  ISidebar,
  IGraph,
  IModel, ECorePackage, ECoreClass, GraphPoint,
  Status, IReference, StringSimilarity, IClass, MPackage, IPackage, M3Package, M3Reference, M3Class
} from '../../common/Joiner';

export class M2Package extends IPackage {
  metaParent: M3Package;
  instances: MPackage[] = [];
  parent: MetaModel;
  childrens: M2Class[] = [];

  constructor(mm: MetaModel, json: Json, metaParent: M3Package) {
    super(mm, json, metaParent);
    this.parse(json, true); }

  getClass(name: string, caseSensitive: boolean = false, throwErr: boolean = true, debug: boolean = true): M3Class {
    return super.getClass(name, caseSensitive, throwErr, debug) as M3Class; }

  addEmptyClass(metaVersion: M3Class): M2Class {
    if (!metaVersion) { metaVersion = Status.status.mmm.getDefaultPackage().getClass('class'); }
    const c = new M2Class(this, null, metaVersion);
    console.log('addEmptyClass(); package:', this, '; metaVersion: ', metaVersion, 'classe:', c);
    U.ArrayAdd(this.childrens, c);
    if (Status.status.loadedLogic) { c.generateVertex(); }
    M2Class.updateAllMMClassSelectors();
    return c; }

  parse(json: Json, destructive: boolean = true): void {
    // if (!json) { return; }
    /*
    json[ECorePackage.xmiversion] // '2.0';
    json[ECorePackage.xmlnsxmi] // 'http://www.omg.org/XMI';
    json[ECorePackage.xmlnsxsi] // 'http://www.w3.org/2001/XMLSchema-instance';
    json[ECorePackage.xmlnsecore] // 'http://www.eclipse.org/emf/2002/Ecore';
    json[ECorePackage.name];
    json[ECorePackage.eClassifiers]; */
    /// own attributes.
    this.setName(Json.read<string>(json, ECorePackage.namee));
    const uri: string = json[ECorePackage.nsURI];
    const nsPrefix: string = json[ECorePackage.nsPrefix];
    this.parent.uri(uri);
    this.parent.namespace(nsPrefix);
    /// childrens
    const childs = Json.getChildrens(json);
    let i;
    if (destructive) { this.childrens = []; }
    for (i = 0; i < childs.length; i++) {
      const child = childs[i];
      let metaParent;
      metaParent = null;
      // metaParent = U.findMetaParentC(this, child);
      if (destructive) { U.ArrayAdd(this.childrens, new M2Class(this, child, metaParent)); continue; }
      U.pe(true, 'Non-destructive pkg parse: to do');
    }
    M2Class.updateAllMMClassSelectors();
  }

  /*parse(deep) {
    let i;
    if (deep) {
      if (this.childrens) { while (this.childrens.length !== 0) { this.childrens[0].delete(); } }
      this.childrens = [];
    }
    let field1;
    for (field1 in this.json) {
      if (!this.json.hasOwnProperty(field1)) { continue; } // il compilatore mi rompe per metterlo, non toglierlo se non da problemi.
      let val1 = Json.read<any>(this.json, field1);
      switch (field1) {
        default:
          U.pe(true, 'unexpected tag at jsonInput package: ' , field1 , ' = ', val1);
          break;
        case 'logical':
        case ECorePackage.xmlnsxsi:
        case ECorePackage.xmlnsxmi:
        case ECorePackage.xmlnsecore:
        case ECorePackage.nsPrefix:
        case ECorePackage.nsURI:
        case ECorePackage.xmiversion: break;
        case ECorePackage.name: break;
        case ECorePackage.eClassifiers:
          val1 = Json.getChildrens(this.json);
          for (i = 0; i < val1.length; i++) {
            if (deep) {
              U.pe ( !val1[i], 'val1[' + i + '] = ', val1[i], 'field:', field1, 'json:', this.json);
              const classe = new M2Class(this, val1[i]);
              this.childrens.push(classe as ModelPiece);
            }
          }
          break;
      }
    }
  }

  generateVertex(location: GraphPoint): IVertex {
    const v: IVertex = new IVertex();
    v.constructorPkg(this);
    v.draw();
    v.moveTo(location);
    return v; }
    */

  generateModel(): Json {
    const classarr = [];
    let i;
    for (i = 0; i < this.childrens.length; i++) {
      const classe = this.childrens[i];
      classarr.push(classe.generateModel());
    }
    const model = new Json(null);
    model[ECorePackage.xmiversion] = '2.0';
    model[ECorePackage.xmlnsxmi] = 'http://www.omg.org/XMI';
    model[ECorePackage.xmlnsxsi] = 'http://www.w3.org/2001/XMLSchema-instance';
    model[ECorePackage.xmlnsecore] = 'http://www.eclipse.org/emf/2002/Ecore';
    model[ECorePackage.namee] = this.name;
    model[ECorePackage.nsURI] = this.parent.uri();
    model[ECorePackage.nsPrefix] = this.getModelRoot().namespace();
    model[ECorePackage.eClassifiers] = classarr;
    /*
   "_xmi:version": "2.0",
   "_xmlns:xmi": "http://www.omg.org/XMI",
   "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
   "_xmlns:ecore": "http://www.eclipse.org/emf/2002/Ecore",
   "_name": "bowling",
   "_nsURI": "http://org/eclipse/example/bowling",
   "_nsPrefix": "org.eclipse.example.bowling"*/
    return model; }


}

