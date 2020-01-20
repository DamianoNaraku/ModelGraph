import * as tslib_1 from "tslib";
import { Json, U, M2Class, ECorePackage, ECoreClass, Status, IPackage, EEnum, Type } from '../../common/Joiner';
var M2Package = /** @class */ (function (_super) {
    tslib_1.__extends(M2Package, _super);
    function M2Package(mm, json) {
        var _this = _super.call(this, mm, json, Status.status.mmm.getPackage()) || this;
        _this.parse(json, true);
        return _this;
    }
    M2Package.prototype.getClass = function (name, caseSensitive, throwErr, debug) {
        if (caseSensitive === void 0) { caseSensitive = false; }
        if (throwErr === void 0) { throwErr = true; }
        if (debug === void 0) { debug = true; }
        return _super.prototype.getClass.call(this, name, caseSensitive, throwErr, debug);
    };
    M2Package.prototype.addEmptyClass = function () {
        var c = new M2Class(this, null);
        if (Status.status.loadedLogic) {
            c.generateVertex();
        }
        console.log('addEmptyClass(); package:', this, 'classe:', c);
        Type.updateTypeSelectors(null, false, false, true);
        return c;
    };
    M2Package.prototype.parse = function (json, destructive) {
        if (destructive === void 0) { destructive = true; }
        // if (!json) { return; }
        /*
        json[ECorePackage.xmiversion] // '2.0';
        json[ECorePackage.xmlnsxmi] // 'http://www.omg.org/XMI';
        json[ECorePackage.xmlnsxsi] // 'http://www.w3.org/2001/XMLSchema-instance';
        json[ECorePackage.xmlnsecore] // 'http://www.eclipse.org/emf/2002/Ecore';
        json[ECorePackage.name];
        json[ECorePackage.eClassifiers]; */
        /// own attributes.
        var name = Json.read(json, ECorePackage.namee, 'defaultPackage');
        if (name)
            this.setName(name);
        var uri = Json.read(json, ECorePackage.nsURI, null);
        var nsPrefix = Json.read(json, ECorePackage.nsPrefix, null);
        this.parent.uri(uri);
        this.parent.namespace(nsPrefix);
        /// childrens
        var childs = Json.getChildrens(json);
        if (destructive) {
            this.childrens = [];
        }
        var i;
        for (i = 0; i < childs.length; i++) {
            var child = childs[i];
            if (!child) {
                U.pw(true, 'invalid m2Package in ecore input. found a null classifier, it will be ignored.');
                continue;
            }
            // metaParent = U.findMetaParentC(this, child);
            switch (child[ECoreClass.xsitype]) {
                default:
                    U.pe(true, 'unexpected xsitype:', child[ECoreClass.xsitype], ' found in jsonfragment:', child, ', in json:', json, ' package:', this);
                    break;
                case 'ecore:EClass':
                    new M2Class(this, child);
                    break;
                case 'ecore:EEnum':
                    new EEnum(this, child);
                    break;
            }
        }
    };
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
    M2Package.prototype.generateModel = function () {
        var classarr = [];
        var enumarr = [];
        var i;
        for (i = 0; i < this.classes.length; i++) {
            classarr.push(this.classes[i].generateModel());
        }
        for (i = 0; i < this.enums.length; i++) {
            enumarr.push(this.enums[i].generateModel());
        }
        var classifiers = Array.prototype.concat.call(classarr, enumarr);
        var model = new Json(null);
        model[ECorePackage.xmiversion] = '2.0';
        model[ECorePackage.xmlnsxmi] = 'http://www.omg.org/XMI';
        model[ECorePackage.xmlnsxsi] = 'http://www.w3.org/2001/XMLSchema-instance';
        model[ECorePackage.xmlnsecore] = 'http://www.eclipse.org/emf/2002/Ecore';
        model[ECorePackage.namee] = this.name;
        model[ECorePackage.nsURI] = this.parent.uri();
        model[ECorePackage.nsPrefix] = this.getModelRoot().namespace();
        model[ECorePackage.eClassifiers] = classifiers;
        /*
       "_xmi:version": "2.0",
       "_xmlns:xmi": "http://www.omg.org/XMI",
       "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
       "_xmlns:ecore": "http://www.eclipse.org/emf/2002/Ecore",
       "_name": "bowling",
       "_nsURI": "http://org/eclipse/example/bowling",
       "_nsPrefix": "org.eclipse.example.bowling"*/
        return model;
    };
    return M2Package;
}(IPackage));
export { M2Package };
//# sourceMappingURL=MMPackage.js.map