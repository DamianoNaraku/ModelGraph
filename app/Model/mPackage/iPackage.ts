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
  IModel, MetaMetaModel,
  Status, IReference, StringSimilarity, IClass, ModelNone, M3Class, M2Package
} from '../../common/Joiner';

export abstract class IPackage extends ModelPiece {
  metaParent: IPackage;
  instances: IPackage[] = [];
  parent: IModel;
  childrens: IClass[] = [];

  constructor(mm: IModel, json: Json, metaParent: IPackage) {
    super(mm, metaParent); }

  abstract generateModel(): Json;
  abstract parse(json: Json, destructive?: boolean): void;
  abstract addEmptyClass(metaVersion: IClass): IClass;

  conformability(metaparent: IPackage, outObj?: any, debug?: boolean): number { return 1; }
  midname(): string { return this.name; }
  fullname(): string { return this.name; }
  getVertex(): IVertex { return undefined; }

  getClass(name: string, caseSensitive: boolean = false, throwErr: boolean = true, debug: boolean = true): IClass {
    let i: number;
    if (!caseSensitive) { name = name.toLowerCase(); }
    for (i = 0; i < this.childrens.length; i++) {
      let classname: string = this.childrens[i].name;
      if (!caseSensitive) { classname = classname.toLowerCase(); }
      if (name === classname) { return this.childrens[i]; }
    }
    return null; }


  duplicate(nameAppend: string = '_Copy', newParent: ModelPiece = null): ModelPiece {
    U.pe(true, 'Package duplicate to do.');
    return undefined; }

  // todo:
  refreshGUI_Alone(debug?: boolean): void {
    let i: number;
    for (i = 0; i < this.childrens.length; i++) { this.childrens[i].refreshGUI_Alone(debug); } }

  LinkToMetaParent(meta: IPackage) {
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
    while (++i < classPermutation.length) {
      this.childrens[i].linkToMetaParent(meta.childrens[classPermutation[i]]); }
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
        const Mclass: IClass = this.childrens[j];
        const MMclass: IClass = meta.childrens[permutation[j]];
        const classComf = !Mclass ? 0 : Mclass.conformability(MMclass);
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

export class M3Package extends IPackage {
  metaParent: M3Package;
  instances: M2Package[] = [];
  parent: MetaMetaModel;
  childrens: M3Class[] = [];

  constructor(model: MetaMetaModel, json: Json) { super(model, json, null); this.parse(json, true); }

  getClass(name: string, caseSensitive: boolean = false, throwErr: boolean = true, debug: boolean = true): M3Class {
    return super.getClass(name, caseSensitive, throwErr, debug) as M3Class; }

  addEmptyClass(metaVersion?: M3Class): M3Class {
    const c = new M3Class(this, null);
    U.ArrayAdd(this.childrens, c);
    // c.generateVertex(null).draw();
    // M2Class.updateAllMMClassSelectors();
    return c; }

  generateModel(): Json {
    return undefined;
  }


  parse(json: Json, destructive: boolean = true): void {
    this.name = 'Package';
    this.addEmptyClass(null); }

  refreshGUI_Alone(debug: boolean = true): void { }

}
