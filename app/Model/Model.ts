import {
  IModel,
  Json,
  IPackage,
  IClass,
  IFeature,
  IAttribute,
  IReference,
  MetaModel,
  U,
  IVertex,
  IEdge,
  EdgeStyle,
  ModelPiece, Status, MClass, eCoreClass
} from '../common/Joiner';
import {MPackage} from '../mPackage/MPackage.component';

export class Model extends IModel {
  private static emptyModel = 'empty model: todo'; // todo
  protected json: Json = null;
  metaParent: MetaModel = null;
  instances: ModelPiece[] = [];
  parent: ModelPiece = null;
  childrens: MPackage[] = [];
  edgeStyleCommon: EdgeStyle = null;
  edgeStyleHighlight: EdgeStyle = null;
  edgeStyleSelected: EdgeStyle = null;
  // styleRaw: HTMLElement | SVGElement = null;
  // style: HTMLElement | SVGElement = null;
  // htmlRaw: HTMLElement | SVGForeignObjectElement = null;
  html: HTMLElement | SVGElement = null;
  styleOfInstances: HTMLElement | SVGElement = null;
  customStyle: HTMLElement | SVGElement;
  constructor(json: Json, metaModel: MetaModel) {
    super(json, metaModel, true);
    this.modify(json, true); }
  fixReferences(): void {/*useless here? or useful in loops?*/}
  modify(json: Json, destructive: boolean, metamodel: MetaModel = null) {
    if (!metamodel) {metamodel = Status.status.mm; }
    this.metaParent = metamodel;
    U.pe(!metamodel, 'parsing a model requires a metamodel linked');
    if (destructive) { this.childrens = []; }
    let key: string;
    let mpackage: MPackage;
    if (this.childrens.length === 0) { this.childrens.push(new MPackage(this, null)); }
    mpackage = this.childrens[0];
    for (key in json) {
      if (!json.hasOwnProperty(key)) { continue; }
      const namespacedclass: string = key;
      const mmclass: IClass = this.metaParent.getClassByNameSpace(namespacedclass, false, true);
      const value: Json = json[key];
      const c: MClass = new MClass(mpackage, value, mmclass);
      console.log('mclass:', c);
      if (destructive) { mpackage.childrens.push(c); }
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
  mark(bool: boolean): boolean {return super.mark(bool); }
  validate(): boolean { return super.validate(); }
  conformsTo(m: IModel): boolean { return super.conformsTo(m); }
  draw(): void { return super.draw(); }

  generateModel(): Json {
    const json: Json =  {};
    const classRoot: MClass = this.getClassRoot();
    json[classRoot.getNamespaced()] = classRoot.generateModel(true);
    return json; }

  addClass(parentPackage: MPackage, metaVersion: IClass): void {
    // const childJson: Json = U.cloneObj<Json>(metaVersion.getJson());
    // Json.write(childJson, '@type', metaVersion.fullname);
    const c = new MClass(parentPackage, null, metaVersion);
    // U.pe(!!c.customStyle, '1', c, c.customStyle);
    // Json.write(childJson, eCoreClass.name, metaVersion.name.toLowerCase() + '_obj');
    // c.setName(metaVersion.name.toLowerCase() + '_obj');
    parentPackage.childrens.push(c);
    // U.pe(!!c.customStyle, '2', c, c.customStyle);
    c.generateVertex(null).draw();
    // U.pe(!!c.customStyle, '3', c, c.customStyle);
    // U.pe(true, '4', c, c.customStyle);
    // IClass.updateAllMClassSelectors();
  }

}
