import * as tslib_1 from "tslib";
import { IAttribute, U, IReference, Status, MClass, M2Class, EdgeStyle, M3Reference, M3Attribute, EdgeModes, EdgePointStyle, EOperation, EParameter, Type, } from '../common/Joiner';
import { IClassifier } from './IClassifier';
var IClass = /** @class */ (function (_super) {
    tslib_1.__extends(IClass, _super);
    function IClass(parent, meta) {
        var _this = _super.call(this, parent, meta) || this;
        _this.referencesIN = []; // external pointers to this class.
        _this.shouldBeDisplayedAsEdgeVar = false && false;
        _this.edges = [];
        if (_this.parent) {
            U.ArrayAdd(_this.parent.classes, _this);
        }
        _this.edgeStyleCommon = new EdgeStyle(EdgeModes.straight, 2, '#ffffff', new EdgePointStyle(5, 2, '#ffffff', '#000000'));
        _this.edgeStyleHighlight = new EdgeStyle(EdgeModes.straight, 4, '#ffffff', new EdgePointStyle(5, 2, '#ffffff', '#0077ff'));
        _this.edgeStyleSelected = new EdgeStyle(EdgeModes.straight, 4, '#ffbb22', new EdgePointStyle(5, 2, '#ffffff', '#ff0000'));
        return _this;
    }
    IClass.prototype.fullname = function () { return this.parent.name + '.' + this.name; };
    IClass.prototype.generateEdge = function () { U.pe(true, 'IClass.generateEdge() todo.'); return null; };
    IClass.prototype.canBeLinkedTo = function (target) {
        if (!this.shouldBeDisplayedAsEdge()) {
            return false;
        }
        return false;
    };
    IClass.prototype.getEdges = function () { return this.edges; };
    IClass.prototype.delete = function () {
        var oldparent = this.parent;
        _super.prototype.delete.call(this);
        if (oldparent)
            U.arrayRemoveAll(oldparent.classes, this);
        // todo: che fare con le reference a quella classe? per ora cancello i campi.
        var pointers = this.getReferencePointingHere();
        var i;
        for (i = 0; i < pointers.length; i++) {
            pointers[i].delete();
        }
        if (this.shouldBeDisplayedAsEdge()) {
            var edges = U.ArrayCopy(this.getEdges(), false);
            for (i = 0; i < edges.length; i++) {
                edges[i].remove();
            }
        }
        else {
            this.getVertex().remove();
        }
        Type.updateTypeSelectors(null, false, false, true);
    };
    IClass.prototype.refreshGUI_Alone = function (debug) {
        if (!Status.status.loadedLogic) {
            return;
        }
        if (this.shouldBeDisplayedAsEdge()) {
            if (this.vertex) {
                this.vertex.remove();
                this.vertex = null;
            }
            var edges = this.getEdges();
            var i = void 0;
            for (i = 0; i < edges.length; i++) {
                edges[i].refreshGui(debug);
            }
            return;
        }
        this.getVertex().refreshGUI();
    };
    IClass.prototype.getReferencePointingHere = function () { return this.referencesIN; };
    /*getStyle_oldhtml(): SVGForeignObjectElement {
      const html: Element = super.getStyle().html; // U.removeemptynodes(super.getStyle(), true);
      const container: SVGForeignObjectElement = html as SVGForeignObjectElement; //U.newSvg<SVGForeignObjectElement>('foreignObject');
      const size: Size = new Size(0, 0, 0, 0);
      // todo: devi specificarlo che x, y, width, height sono attributi speciali assegnabili agli HTMLElement non-svg e vengono trasmessi.
      // todo: pondera l'uso di U.cloneAllAttributes(html, container); per trasferire gli attributi dell' userStyle-root nell'SvgForeignElem.
  
      const firstChild: HTMLElement = container.firstChild as HTMLElement;
      if (!firstChild.style.height || firstChild.style.height === '') { firstChild.style.height = 'auto'; }
      if (firstChild.style.height === 'auto') { container.dataset.autosize = 'true'; }
      else if (container.dataset.autosize === 'true') { firstChild.style.height = 'auto'; }
      // (html.firstChild as HTMLElement).style.height = 'auto'; // allows autosize.
  
  
      container.classList.add('Class');
      container.setAttributeNS(null, 'dinamico', 'true');
      /*
      size.x = +html.getAttribute('x');
      size.y = +html.getAttribute('y');
      size.w = +html.getAttribute('width');
      size.h = +html.getAttribute('height');
      container.setAttributeNS(null, 'x', isNaN(size.x) ? '0' : '' + size.x);
      container.setAttributeNS(null, 'y', isNaN(size.y) ? '0' : '' + size.y);
      container.setAttributeNS(null, 'width', isNaN(size.w) ? '200' : '' + size.w);
      container.setAttributeNS(null, 'height', isNaN(size.h) ? '100' : '' + size.h);
      container.appendChild(html);* /
      return container; }
  */
    IClass.prototype.getAttribute = function (name, caseSensitive) {
        if (caseSensitive === void 0) { caseSensitive = false; }
        var i;
        if (!caseSensitive) {
            name = name.toLowerCase();
        }
        for (i = 0; i < this.attributes.length; i++) {
            var s = this.attributes[i].name;
            if ((caseSensitive ? s : s.toLowerCase()) === name) {
                return this.attributes[i];
            }
        }
        return null;
    };
    IClass.prototype.getReference = function (name, caseSensitive) {
        if (caseSensitive === void 0) { caseSensitive = false; }
        var i;
        if (!caseSensitive) {
            name = name.toLowerCase();
        }
        for (i = 0; i < this.references.length; i++) {
            var s1 = this.references[i].name;
            console.log('find IReference[' + s1 + '] =?= ' + name + ' ? ' + (caseSensitive ? s1 : s1.toLowerCase()) === name);
            if ((caseSensitive ? s1 : s1.toLowerCase()) === name) {
                return this.references[i];
            }
        }
        return null;
    };
    /*generateEdge(): IEdge[] {
      const e: IEdge = null;
      U.pw(true, 'Class.generateEdge(): todo');
      // todo check questa funzione e pure il shouldbedisplayedasedge
      this.edges = [e];
      return this.edges; }*/
    IClass.prototype.copy = function (other, nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        _super.prototype.copy.call(this, other, nameAppend, newParent);
        this.attributes = [];
        this.references = [];
        this.edges = [];
        this.edgeStyleCommon = other.edgeStyleCommon.clone();
        this.edgeStyleHighlight = other.edgeStyleHighlight.clone();
        this.edgeStyleSelected = other.edgeStyleSelected.clone();
        var i;
        for (i = 0; i < this.childrens.length; i++) {
            var child = this.childrens[i];
            if (child instanceof IReference) {
                this.references.push(child);
                continue;
            }
            if (child instanceof IAttribute) {
                this.attributes.push(child);
                continue;
            }
            U.pe(true, 'found class.children not reference neither attribute: ', child);
        }
    };
    /*getEdge(): IEdge[] {
      U.pe(!this.shouldBeDisplayedAsEdge(), 'err');
      if (!this.edges) { this.generateEdge(); }
      return this.edges; }*/
    /*linkToMetaParent(meta: IClass): void {
      U.pe(true, 'linkToMetaParent: todo.');
      const outObj: any = {};
      const comformability: number = this.conformability(meta, outObj);
      if (comformability !== 1) {
        U.pw(true, 'm2Class: ' + this.name + ' not fully conform to ' + meta.name + '. Conformability: = ' + comformability * 100 + '%' );
        return; }
      this.metaParent = meta;
      let i: number;
      const refPermutation: number[] = outObj.refPermutation;
      const attrPermutation: number[] = outObj.attrPermutation;
      i = -1;
      while (++i < attrPermutation.length) { this.attributes[i].linkToMetaParent(meta.attributes[attrPermutation[i]]); }
      i = -1;
      while (++i < refPermutation.length) { this.references[i].linkToMetaParent(meta.references[refPermutation[i]]); }
    }*/
    /*conformability(meta: IClass, outObj: any = null/*.refPermutation, .attrPermutation* /, debug: boolean = true): number {
      if (this.attributes > meta.attributes) { return 0; }
      if (this.references > meta.references) { return 0; }
      const refLenArray: number[] = [];
      let i;
      let j;
      // find best references permutation compabilityF
      i = -1;
      while (++i < meta.references.length) { refLenArray.push(i); }
      const refPermut: number[][] = U.permute(refLenArray);
      // console.log('possible class.references permutations[' + meta.references.length + '!]:', refLenArray, ' => ', refPermut);
      const allRefPermutationConformability: number[] = [];
      i = -1;
      let bestRefPermutation: number[] = null;
      let bestRefPermutationValue = -1;
      while (++i < refPermut.length) {
        j = -1;
        const permutation = refPermut[i];
        let permutationComformability = 0;
        while (++j < permutation.length) {
          const Mref: IReference = this.references[j];
          const MMref: IReference = meta.references[permutation[j]];
          const refComf = !Mref ? 0 : Mref.conformability(MMref, debug);
          console.log('ref: permutationComformability:', permutationComformability, ' + ' + refComf + ' / ' + permutation.length,
            '-->', permutationComformability + refComf / permutation.length);
          permutationComformability += refComf / permutation.length; }
  
        allRefPermutationConformability.push(permutationComformability);
        if (permutationComformability > bestRefPermutationValue) {
          bestRefPermutation = permutation;
          bestRefPermutationValue = permutationComformability; }
        if (permutationComformability === 1) { break; }
      }
  
      // find best attributes permutation compability
      const attLenArray: number[] = [];
      i = -1;
      while (++i < meta.attributes.length) { attLenArray.push(i); }
      const attPermut: number[][] = U.permute(attLenArray, debug);
      // console.log('possible class.attributes permutations[' + meta.attributes.length + '!]:', attLenArray, ' => ', attPermut);
      const allAttPermutationConformability: number[] = [];
      i = -1;
      let bestAttPermutation: number[] = null;
      let bestAttPermutationValue = -1;
      while (++i < attPermut.length) {
        j = -1;
        const permutation = attPermut[i];
        let permutationComformability = 0;
        while (++j < permutation.length) {
          const M2att: IAttribute = this.attributes[j];
          const M3att: IAttribute = meta.attributes[permutation[j]];
          const attComf = !M2att ? 0 : M2att.conformability(M3att, debug);
          console.log('attr: permutationComformability:', permutationComformability, ' + ' + attComf + ' / ' + permutation.length,
            '-->', permutationComformability + attComf / permutation.length);
          permutationComformability += attComf / permutation.length; }
  
        allAttPermutationConformability.push(permutationComformability);
        if (permutationComformability > bestRefPermutationValue) {
          bestAttPermutation = permutation;
          bestAttPermutationValue = permutationComformability; }
        if (permutationComformability === 1) { break; }
      }
  
      const total = meta.childrens.length + 1; // + name
      const nameComformability = StringSimilarity.compareTwoStrings(this.name, meta.name) / total;
      bestAttPermutationValue = Math.max(0, bestAttPermutationValue * (meta.attributes.length / total));
      bestRefPermutationValue = Math.max(0, bestRefPermutationValue * (meta.references.length / total));
      if (outObj) {
        outObj.refPermutation = bestRefPermutation;
        outObj.attrPermutation = bestAttPermutation; }
  
      const ret = nameComformability + bestAttPermutationValue + bestRefPermutationValue;
      U.pif(debug, 'M2CLASS.comform(', this.name, {0: this}, ', ', meta.name, {0: meta}, ') = ', ret,
        ' = ', nameComformability + ' + ' + bestAttPermutationValue + ' + ', bestRefPermutationValue);
      return ret; }*/
    IClass.prototype.getOperations = function () {
        if (this instanceof M3Class) {
            var i = void 0;
            for (i = 0; i < this.childrens.length; i++) {
                var c = this.childrens[i];
                if (c instanceof EOperation) {
                    return [c];
                }
            }
            U.pe(true, 'failed to find m3Operation');
        }
        if (this instanceof M2Class) {
            return this.operations;
        }
        if (this instanceof MClass) {
            return this.metaParent.operations;
        }
        U.pe(true, 'unexpected class:' + U.getTSClassName(this) + ': ', this);
    };
    return IClass;
}(IClassifier));
export { IClass };
var M3Class = /** @class */ (function (_super) {
    tslib_1.__extends(M3Class, _super);
    function M3Class(parent, json) {
        if (json === void 0) { json = null; }
        var _this = _super.call(this, parent, null) || this;
        _this.parse(json, true);
        return _this;
    }
    M3Class.prototype.duplicate = function (nameAppend, newParent) { U.pe(true, 'Invalid operation: m3Class.duplicate()'); return this; };
    M3Class.prototype.generateModel = function () { U.pe(true, 'Invalid operation: m3Class.generateModel()'); return this; };
    M3Class.prototype.parse = function (json, destructive) {
        this.name = 'Class';
        this.childrens = [];
        this.attributes = [];
        this.references = [];
        this.instances = [];
        var a = new M3Attribute(this, null);
        var r = new M3Reference(this, null);
        var o = new EOperation(this, null);
        var p = new EParameter(o, null);
    };
    M3Class.prototype.refreshGUI_Alone = function (debug) {
        if (debug === void 0) { debug = true; }
    };
    return M3Class;
}(IClass));
export { M3Class };
//# sourceMappingURL=iClass.js.map