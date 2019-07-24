import {
  IVertex,
  IEdge,
  IField,
  IPackage,
  IAttribute,
  AttribETypes,
  IFeature,
  Json,
  U,
  ModelPiece,
  ISidebar,
  IGraph,
  IClass,
  IReference,
  Status,
  DetectZoom,
  Model,
  eCoreAttribute,
  eCoreClass,
  eCorePackage,
  eCoreReference,
  eCoreRoot,
  Point,
  GraphPoint,
  IModel,
  Size,
  StringSimilarity,
  EdgeStyle,
  Dictionary, GraphSize, MPackage, MReference, MAttribute
} from '../common/Joiner';

export class MClass extends IClass {
  // id: number;
  // instances: ModelPiece[];
  // metaParent: IClass;
  // parent: MPackage;
  // childrens: ModelPiece[];
  /*attributes: MAttribute[];
  references: MReference[];
  referencesIN: MReference[];
*/

  static getArrayIndex_ByMetaParentName(name: string, array: ModelPiece[]): number {
    let i = -1;
    while (++i < array.length) { if (name === array[i].metaParent.name) { return i; } }
    return -1; }

  constructor(pkg: MPackage, json: Json, metaVersion: IClass) {
    super(pkg, null, metaVersion);
    if (!pkg && !json && !metaVersion) { return; } // empty constructor for .duplicate();
    U.pe(!metaVersion, 'null metaparent?');
    this.modify(json, true);
  }

  isRoot(): boolean { return this === Status.status.m.classRoot; }
  setRoot(value: boolean): void {
    U.pe(!value, 'should only be used to set root. to remove a root choose another one and call setRoot on it.');
    this.getModelRoot().classRoot = this;
  }

  addAttribute(): void {
    throw new Error('M.addAttribute() todo');
  }

  addReference(): void {
    throw new Error('M.addReference() todo');
  }


  comformability(meta: IClass, outObj?: any): number {
    throw new Error('M.conformability%() todo');
  }

  delete(): void {
    throw new Error('M.delete() todo');
  }

  duplicate(nameAppend: string = null, newParent: IPackage | ModelPiece = null): MClass {
    throw new Error('M.duplicate() todo');
  }

  fieldChanged(e: JQuery.ChangeEvent): any {
    U.pe(true, 'MClass.fieldchanged(), ma non dovrebbero esserci campi modificabili.');
  }

  generateModel(root: boolean = false): Json {
    /*
       { "-name": "tizio", "attrib2": value2, ...}
    OR:
       {
        "-xmlns:xmi": "http://www.omg.org/XMI",
        "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
        "-xmi:version": "2.0",
        "Players": [
          { "-name": "tizio" },
          { "-name": "asd" }
        ]
      }
    */
    const inlineMarker: string = Status.status.XMLinlineMarker;
    const json: Json = {};
    if (root) {
      json[inlineMarker + 'xmlns:xmi'] =  'http://www.omg.org/XMI';
      json[inlineMarker + 'xmlns:' + this.getModelRoot().namespace()] = this.getModelRoot().uri();
      json[inlineMarker + 'xmi:version'] =  '2.0'; }
    let outi: number;
    let i: number;
    const set = (k: string, v: Json) => { json[k] = v; };
    const arr: ModelPiece[][] = [this.attributes, this.references];
    for (outi = 0; outi < arr.length; outi++) {
      for (i = 0; i < arr[outi].length; i++) {
        const child = arr[outi][i];
        const value: Json | string = (child).generateModel();
        const key: string = (U.isString(value) ? inlineMarker : '') + child.metaParent.name;
        json[key] = value; }
    }
    return json;
  }
  generateModelString(): string { return JSON.stringify(this.generateModel(), null, 4); }

  getInfo(toLower?: boolean): any {
  }

  modify(json: Json, destructive: boolean = true): void {
    const attributes: IAttribute[] = (this.metaParent as IClass).attributes;
    const references: IAttribute[] = (this.metaParent as IClass).attributes;
    const childrens: ModelPiece[] = (this.metaParent as IClass).childrens;
    let i = -1;
    if (destructive) {
      this.attributes = [];
      this.references = [];
      this.childrens = [];
      while (++i < childrens.length) {
        if (childrens[i] instanceof IAttribute) {
          const attr: MAttribute = new MAttribute(this, null, childrens[i] as IAttribute);
          this.childrens.push(attr);
          this.attributes.push(attr); }
        if (childrens[i] instanceof IReference) {
          const ref: MReference = new MReference(this, null, childrens[i] as IReference);
          this.childrens.push(ref);
          this.references.push(ref); }
        }
    }
    /*{                                                           <--- classRoot
        "-xmlns:xmi": "http://www.omg.org/XMI",
        "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
        "-xmi:version": "2.0",
        "Players": [
          { "-name": "tizio" },          <-- class[0]
          { "-name": "asd" }             <-- class[1]
        ]
      }*/
    const inlineMarker: string = Status.status.XMLinlineMarker;
    for (let key in json) {
      if (!json.hasOwnProperty(key)) { continue; }
      const value: Json = json[key];
      switch (key) {
        case inlineMarker + 'xmlns:xmi':
        // case inlineMarker + 'xmlns:' + this.getModelRoot().namespace():
        case inlineMarker + 'xmi:version': this.setRoot(true); break;
        default:
          // todo: usa il ns del modello per caricare il metamodello con quel namespace se quello attuale non è conforme?
          if (key.indexOf(inlineMarker) === 0) { key = key.substr(inlineMarker.length); }
          if (key.indexOf('xmlns:') === 0) {
            key = key.substr('xmlns:'.length);
            this.getModelRoot().setNamespace(key);
            U.pw(false, 'setns?', key, this, this.metaParent); continue; }
          const metaAttr: IAttribute = (this.metaParent as IClass).getAttribute(key);
          const metaRef: IReference = (this.metaParent as IClass).getReference(key);
          if (metaAttr) {
            const cindex: number = this.getChildrenIndex_ByMetaParent(metaAttr);
            const aindex: number = this.getAttributeIndex_ByMetaParent(metaAttr);
            const newA: MAttribute = new MAttribute(this, value, metaAttr);
            this.childrens[cindex] = this.attributes[aindex] = newA;
          } else if (metaRef) {
            const cindex: number = this.getChildrenIndex_ByMetaParent(metaRef);
            const rindex: number = this.getReferenceIndex_ByMetaParent(metaRef);
            const newR: MReference = new MReference(this, value, metaRef);
            this.childrens[cindex] = this.references[rindex] = newR;
          } else {
            U.pe(true, 'model attribute-or-reference type not found. class:', this, ', json:', json,
              'key/name:', key, ', Iclass:', this.metaParent); }
          break;
      }
    }

  }
  modify_Old(json: Json, destructive: boolean = true): void {
    /*{                                                                                           <-- :classroot
        "-xmlns:xmi": "http://www.omg.org/XMI",
        "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
        "-xmi:version": "2.0",
        "Players": [
          { "-name": "tizio" },          <-- class[0]
          { "-name": "asd" }             <-- class[1]
        ]
      }*/
    if (destructive) { this.childrens = []; this.references = []; this.attributes = []; this.referencesIN = []; }
    const inlineMarker: string = Status.status.XMLinlineMarker;
    for (let key in json) {
      if (!json.hasOwnProperty(key)) { continue; }
      const value: Json = json[key];
      switch (key) {
        case inlineMarker + 'xmlns:xmi':
        // case inlineMarker + 'xmlns:' + this.getModelRoot().namespace():
        case inlineMarker + 'xmi:version': this.setRoot(true); break;
        default:
          // todo: usa il ns del modello per caricare il metamodello con quel namespace se quello attuale non è conforme?
          if (key.indexOf(inlineMarker) === 0) { key = key.substr(inlineMarker.length); }
          if (key.indexOf('xmlns:') === 0) {
            key = key.substr('xmlns:'.length);
            this.getModelRoot().setNamespace(key);
            U.pw(false, 'setns?', key, this, this.metaParent); continue; }
          const metaAttr: IAttribute = (this.metaParent as IClass).getAttribute(key);
          const metaRef: IReference = (this.metaParent as IClass).getReference(key);
          let newA: MAttribute;
          let newR: MReference;
          if (metaAttr) {
            newA = new MAttribute(this, value, metaAttr);
            this.childrens.push(newA);
            this.attributes.push(newA);
          } else if (metaRef) {
            newR = new MReference(this, value, metaRef);
            this.childrens.push(newR);
            this.references.push(newR);
          } else {
            U.pe(true, 'model attribute-or-reference type not found. class:', this, ', json:', json,
              'key/name:', key, ', Iclass:', this.metaParent); }
          break;
      }
    }

  }


  getChildrenIndex_ByMetaParent(meta: ModelPiece): number { return MClass.getArrayIndex_ByMetaParentName(meta.name, this.childrens); }
  getAttributeIndex_ByMetaParent(meta: IAttribute): number { return MClass.getArrayIndex_ByMetaParentName(meta.name, this.attributes); }
  getReferenceIndex_ByMetaParent(meta: IReference): number { return MClass.getArrayIndex_ByMetaParentName(meta.name, this.references); }
}
