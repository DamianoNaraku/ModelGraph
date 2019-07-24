import {
  AttribETypes, GraphPoint, GraphSize,
  IAttribute,
  IClass,
  IEdge,
  IFeature,
  IField,
  IModel,
  IVertex,
  Json, Model,
  ModelPiece,
  PropertyBarr, Size, Status, StringSimilarity, MClass, MAttribute,
  U, eCoreAttribute, eCoreReference, ShortAttribETypes, EType, IReference, Dictionary, MPackage
} from '../common/Joiner';

export class MReference extends IReference {
  private static loopDetection: Dictionary<number /*MClass id*/, MClass> = {};
  /*childrens: ModelPiece[];
  instances: ModelPiece[];
  metaParent: IReference;
  // parent: MClass;
  */
  // mtarget: MClass[];
  // targetStr: string;
  // constructor() {}

  static generateEmptyReference(): Json { return {}; }

  canBeLinkedTo(hoveringTarget: ModelPiece): boolean { return this.metaParent.target === hoveringTarget.metaParent; }

  comformability(meta: IReference): number { throw new Error('MReference.conformability(): todo'); }

  delete(): void { super.delete(); }

  duplicate(nameAppend: string = null, newParent: MClass = null): MReference { return super.duplicate(nameAppend, newParent); }

  fieldChanged(e: JQuery.ChangeEvent): any {
    U.pe(true, 'MReference.Fieldchanged(): non dovrebbe essere mai chiamato, non ha campi input.');
  }

  generateModelString(): string { return super.generateModelString(); }

  getInfo(toLower?: boolean): any {
    const ret: Json = {};
    const set = (key: string, val: Json) => { ret[ toLower ? key.toLowerCase() : key] = val; };
    set('metaParent', this.metaParent);
    set('parent', this.parent);
    set('target', this.mtarget);
    let i: number;
    for (i = 0; i < this.mtarget.length; i++) {
      const t: MClass = this.mtarget[i];
      set('' + t.name, t); // todo problem: le mClassi non hanno un nome
    }
    return ret;
  }

  remove(linkStart: number = null, linkEnd: number = null) {
    if (linkStart === null && linkEnd === null) { return super.remove(); }
    if (linkStart !== null && linkEnd === null) { linkEnd = linkStart + 1; }
    while (linkStart < this.mtarget.length || linkStart <= linkEnd) {
      U.arrayRemoveAll(this.mtarget[linkStart].referencesIN, this); // todo: questo sistema non ammette references duplicate.
      const edge: IEdge = this.edges[linkStart];
      edge.remove();
      U.arrayRemoveAll(this.edges, edge);
      linkStart++;
    }
  }
  link(targetStr?: string, debug?: boolean): void { throw new Error('mreference.linkByStr() should never be called'); }

  linkToLogic<T extends HTMLElement | SVGElement>(html: T): void {
  }

  linkToMetaParent(iReference: IReference): void {
  }
  generateModel(): Json { MReference.loopDetection = {}; return this.generateModelLoop(); }
  generateModelLoop(): Json {
    const ret: Json[] = [];
    let i: number;
    for (i = 0; i < this.mtarget.length; i++) {
      const mclass: MClass = this.mtarget[i];
      if (MReference.loopDetection[mclass.id]) {
        // todo: in caso di loop cosa ci devo mettere nel modello?
        ret.push('LoopingReference');
        U.pw(true, 'looping reference in model');
      } else {
        MReference.loopDetection[mclass.id] = mclass;
        ret.push(mclass.generateModel());
      }
    }
    return ret;
  }
  modify(json0: Json, destructive: boolean = true): void {
    /*
        "ReferenceName": [
          { "-name": "tizio" },  <-- reference.target[0]
          { "-name": "asd" }     <-- reference.target[1]
        ]*/
    U.pe(!destructive, 'non-destructive parse of MReference to do.');
    const json: Json[] = Array.isArray(json0) ? json0 : [json0];
    this.setJson(json);
    const targetMM: IClass = this.metaParent.target;
    let i: number;
    if (!this.mtarget) { this.mtarget = []; }
    if (destructive) {
      for (i = 0; i < this.mtarget.length; i++) { U.arrayRemoveAll(this.mtarget[i].referencesIN, this); }
      this.mtarget = []; }

    const pkg: MPackage = this.parent.parent as MPackage;
    for (i = 0; i < json.length; i++) {
      // console.log('mref.modify: ', json0, json, 'i:', json[i]);
      if ($.isEmptyObject(json[i])) { continue; }
      const t: MClass = new MClass(pkg, json[i], targetMM);
      pkg.childrens.push(t);
      if (destructive) { this.mtarget.push(t); }
    }
  }

  shouldBeDisplayedAsEdge(setValue: boolean = true): boolean { return true; }

  validate(): boolean { return true; }

  generateEdge(): IEdge[] {
    const arr: IEdge[] = [];
    let i: number;
    for (i = 0; i < this.mtarget.length; i++) {
      arr.push(new IEdge(this, (this.parent as IClass).getVertex(), this.mtarget[i].getVertex()));
    }
    return arr; }

}
