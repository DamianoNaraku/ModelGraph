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
  Status, IReference, StringSimilarity
} from '../common/Joiner';
import {eCoreClass, eCorePackage} from '../common/util';
import {GraphPoint} from '../mGraph/Vertex/iVertex';
import {isNullOrUndefined} from 'util';

 // actually mm

export class IPackage extends ModelPiece {
  // static all: any[] = [];
  // htmlRaw: SVGForeignObjectElement = null;
  constructor(mm: IModel, json: Json, metaParent: IPackage) {
    super(mm, metaParent);
    this.modify(json, true);
  }

  static defaultSidebarHtml(): HTMLElement {
    const div = document.createElement('div');
    const p = document.createElement('p');
    div.appendChild(p);
    p.innerHTML = '$##name$';
    p.classList.add('sidebarNodeName');
    div.classList.add('sidebarNode');
    div.classList.add('package');
    return div; }

  getDefaultStyle(): HTMLElement | SVGElement {
    U.pe(true, 'IPackage.GetDefaultStyle()): todo');
    return undefined;
  }
  modify(json: Json, destructive: boolean) {
    // if (!json) { return; }
    /*
    json[eCorePackage.xmiversion] // '2.0';
    json[eCorePackage.xmlnsxmi] // 'http://www.omg.org/XMI';
    json[eCorePackage.xmlnsxsi] // 'http://www.w3.org/2001/XMLSchema-instance';
    json[eCorePackage.xmlnsecore] // 'http://www.eclipse.org/emf/2002/Ecore';
    json[eCorePackage.name];
    json[eCorePackage.eClassifiers]; */
    this.setJson(json);
    /// own attributes.
    this.setName(Json.read<string>(this.json, eCorePackage.name));
    const uri: string = json[eCorePackage.nsURI];
    const nsPrefix: string = json[eCorePackage.nsPrefix];
    (this.parent as IModel).setUri(uri);
    (this.parent as IModel).setNamespace(nsPrefix);
    /// childrens
    const childs = Json.getChildrens(json);
    let i;
    if (destructive) { this.childrens = []; }
    for (i = 0; i < childs.length; i++) {
      const child = childs[i];
      let metaParent;
      metaParent = null;
      // metaParent = U.findMetaParentC(this, child);
      if (destructive) { this.childrens.push(new IClass(this, child, metaParent)); continue; }
      U.pe(true, 'Non-destructive pkg modify: to do');
    }
    IClass.updateAllMMClassSelectors();
  }

  remove(): IPackage { return super.remove() as IPackage; }

  mark(bool: boolean): boolean {
    return bool; // todo
    }
  /*parse(deep) {
    let i;
    if (deep) {
      if (this.childrens) { while (this.childrens.length !== 0) { this.childrens[0].remove(); } }
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
        case eCorePackage.xmlnsxsi:
        case eCorePackage.xmlnsxmi:
        case eCorePackage.xmlnsecore:
        case eCorePackage.nsPrefix:
        case eCorePackage.nsURI:
        case eCorePackage.xmiversion: break;
        case eCorePackage.name: break;
        case eCorePackage.eClassifiers:
          val1 = Json.getChildrens(this.json);
          for (i = 0; i < val1.length; i++) {
            if (deep) {
              U.pe ( !val1[i], 'val1[' + i + '] = ', val1[i], 'field:', field1, 'json:', this.json);
              const classe = new IClass(this, val1[i]);
              this.childrens.push(classe as ModelPiece);
            }
          }
          break;
      }
    }
  } */
  generateVertex(location: GraphPoint): IVertex {
    const v: IVertex = new IVertex();
    v.constructorPkg(this);
    v.draw();
    v.moveTo(location);
    return v; }
  generateModel(): Json {
    const classarr = [];
    let i;
    for (i = 0; i < this.childrens.length; i++) {
      const classe = this.childrens[i];
      classarr.push(classe.generateModel());
    }
    const model = new Json(null);
    model[eCorePackage.xmiversion] = '2.0';
    model[eCorePackage.xmlnsxmi] = 'http://www.omg.org/XMI';
    model[eCorePackage.xmlnsxsi] = 'http://www.w3.org/2001/XMLSchema-instance';
    model[eCorePackage.xmlnsecore] = 'http://www.eclipse.org/emf/2002/Ecore';
    model[eCorePackage.name] = this.name;
    model[eCorePackage.nsURI] = (this.parent as IModel).uri();
    model[eCorePackage.nsPrefix] = this.getModelRoot().namespace();
    model[eCorePackage.eClassifiers] = classarr;
    /*
   "_xmi:version": "2.0",
   "_xmlns:xmi": "http://www.omg.org/XMI",
   "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
   "_xmlns:ecore": "http://www.eclipse.org/emf/2002/Ecore",
   "_name": "bowling",
   "_nsURI": "http://org/eclipse/example/bowling",
   "_nsPrefix": "org.eclipse.example.bowling"*/
    return model; }

  fieldChanged(e: JQuery.ChangeEvent) {
    U.pe(true, 'package.fieldchanged() should never happen');
    const html: HTMLElement = e.currentTarget;
    switch (html.tagName.toLowerCase()) {
      case 'select':
      default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
      case 'input': this.setName((html as HTMLInputElement).value); break;
    }
  }

  setName(name: string, refreshGUI: boolean = true): void {
    // console.log('pkgsetName(', name, ') = ' + name);
    super.setName(name, refreshGUI);
    this.midname = this.name;
    this.fullname = this.name;
    if ( refreshGUI) { this.refreshGUI(); }
  }

  delete(): void {
    U.pe(true, 'Package delete to do.');
  }

  duplicate(nameAppend: string = '_Copy', newParent: ModelPiece = null): ModelPiece {
    U.pe(true, 'Package duplicate to do.');
    return undefined; }

  // todo:
  refreshGUI(): void { if (!Status.status.loadedLogic) { return; } return; }

  processTemplate(htmlRaw: HTMLElement | SVGElement): HTMLElement | SVGElement {
    return undefined;
  }
  getInfo(toLower: boolean = true): any {
    const info: any = super.getInfo();
    info['' + 'tsClass'] = (this.getModelRoot().isMM() ? 'm' : '') + 'mPackage';
    return info;
  }

  linkToMetaParent(meta: IPackage) {
    const outObj: any = {};
    const comformability: number = this.comformability(meta, outObj);
    if (comformability !== 1) {
      U.pw(true, 'iPackage: ' + this.name + ' not fully conform to ' + meta.name +
        '. Compatibility = ' + comformability * 100 + '%;', outObj );
      return; }
    this.metaParent = meta;
    let i: number;
    const classPermutation: number[] = outObj.classPermutation;
    i = -1;
    console.log(outObj);
    while (++i < classPermutation.length) { (this.childrens[i] as IClass).linkToMetaParent(meta.childrens[classPermutation[i]] as IClass); }
  }
  comformability(meta: IPackage, outObj: any = null/*.classPermutation*/): number {
    // return 1;
    // todo: sbloccalo facendo Mpackage.name conforme a MMPackage.name e abilitando package multipli
    if (this.childrens > meta.childrens) { return 0; }
    const classLenArray: number[] = [];
    let i;
    let j;
    // find best references permutation compability
    i = -1;
    while (++i < meta.childrens.length) { classLenArray.push(i); }
    const classPermut: number[][] = U.permute(classLenArray);
    console.log('possible Package.classes permutations[' + meta.childrens.length + '!]:', classLenArray, ' => ', classPermut);
    const allClassPermutationConformability: number[] = [];
    i = -1;
    let bestClassPermutation: number[] = null;
    let bestClassPermutationValue: number = Number.NEGATIVE_INFINITY;
    while (++i < classPermut.length) {
      j = -1;
      const permutation = classPermut[i];
      let permutationComformability = 0;
      while (++j < permutation.length) {
        const Mclass: IClass = this.childrens[j] as IClass;
        const MMclass: IClass = meta.childrens[permutation[j]] as IClass;
        const classComf = !Mclass ? 0 : Mclass.comformability(MMclass);
        permutationComformability += classComf / permutation.length; }

      allClassPermutationConformability.push(permutationComformability);
      if (permutationComformability > bestClassPermutationValue) {
        bestClassPermutation = permutation;
        bestClassPermutationValue = permutationComformability; }
      if (permutationComformability === 1) { break; }
    }

    const total = meta.childrens.length + 1; // + name
    let nameComformability = StringSimilarity.compareTwoStrings(this.name, meta.name) / total;
    bestClassPermutationValue = Math.max(0, bestClassPermutationValue * (meta.childrens.length / total));
    if (outObj) {
      outObj.classPermutation = bestClassPermutation;
    }
    nameComformability = 1 / total;
    const ret = nameComformability + bestClassPermutationValue;
    console.log('PKG.comform(', this.name, {0: this}, ', ', meta.name, {0: meta}, ') = ', ret);
    return ret; }
}

