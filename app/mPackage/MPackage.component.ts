import {
  Json,
  U,
  IField,
  IEdge,
  IVertex,
  IClass,
  IAttribute,
  AttribETypes,
  IFeature,
  ModelPiece,
  MetaModel,
  ISidebar,
  IGraph,
  IModel,
  Status, IReference, StringSimilarity, EdgeStyle, IPackage, Model, Dictionary, MClass
} from '../common/Joiner';
import {eCoreClass, eCorePackage} from '../common/util';
import {GraphPoint} from '../mGraph/Vertex/iVertex';
import {isNullOrUndefined} from 'util';


export class MPackage extends IPackage {
  protected json: Json = null;
  metaParent: ModelPiece = null;
  instances: ModelPiece[] = [];
  parent: ModelPiece = null;
  childrens: ModelPiece[] = [];
  name: string = null;
  midname: string = null;
  fullname: string = null;
  html: HTMLElement | SVGElement = null;
  styleOfInstances: HTMLElement | SVGElement = null;
  customStyle: HTMLElement | SVGElement;
  uri: string;

  // edge: IEdge;
  edgeStyleCommon: EdgeStyle;
  edgeStyleHighlight: EdgeStyle;
  edgeStyleSelected: EdgeStyle;
  markHtml: SVGRectElement;
  marks: Dictionary<string, SVGRectElement>;
  vertex: IVertex;

  constructor(model: Model, json: Json, metaparent: IPackage = null) {
    super(model, json, metaparent);
    if (!this.metaParent) { this.metaParent = model.metaParent.childrens[0]; }
    this.parent = model;
    // return;
    // this.setName(name);
    // this.setJson(json);
    // this.modify(json, true);
  }

  generateModel(): Json { return (this.parent as Model).generateModel(); }
  /*
  generateModel(rootClass: MClass): Json {
    const key: string = U.toDottedURI(this.uri) + ':' + rootClass.name;
    const xmlnsuri = '@xmlns:org.eclipse.example.' + this.name;
    const value: Json = {
      '@xmlns:xmi': 'http://www.omg.org/XMI',
      xmlnsuri : U.toHttpsURI(this.uri), // "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
      '-xmi:version': '2.0',
    };
    let i: number;
    for (i = 0, i < this.childrens.length; i++) {
      const cl: MClass = this.childrens[i];
      value[cl.name] = wrongggg!!! non è nemmeno un package, è una cosa del tipo:
    }
    return undefined;
  }

  getInfo(toLower?: boolean): any {
  }

  linkToMetaParent(meta: IPackage): void {
  }
*/
  modify(json: Json, destructive: boolean, uri: string = null, name: string = null): void {
    /* e se c'è un riferimento circolare?
      <league (rootclass)>
        <players (attribute)>
          <player>...</player>
        </players>
      </league>

    "org.eclipse.example.bowling:League": {
      "-xmlns:xmi": "http://www.omg.org/XMI",
      "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
      "-xmi:version": "2.0",
      "Players": [
          { "-name": "tizio" },
          { "-name": "asd" } ]
  }*/
    return; }

}
