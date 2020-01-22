import * as tslib_1 from "tslib";
import { Json, U, M2Class, ECorePackage, Status, IPackage } from '../common/Joiner';
var M2Package = /** @class */ (function (_super) {
    tslib_1.__extends(M2Package, _super);
    function M2Package(mm, json, metaParent) {
        var _this = _super.call(this, mm, json, metaParent) || this;
        _this.instances = [];
        _this.childrens = [];
        _this.parse(json, true);
        return _this;
    }
    M2Package.defaultSidebarHtml = function () {
        var div = document.createElement('div');
        var p = document.createElement('p');
        div.appendChild(p);
        p.innerHTML = '$##name$';
        p.classList.add('sidebarNodeName');
        div.classList.add('sidebarNode');
        div.classList.add('package');
        return div;
    };
    M2Package.prototype.getClass = function (name, caseSensitive, throwErr, debug) {
        if (caseSensitive === void 0) { caseSensitive = false; }
        if (throwErr === void 0) { throwErr = true; }
        if (debug === void 0) { debug = true; }
        return _super.prototype.getClass.call(this, name, caseSensitive, throwErr, debug);
    };
    M2Package.prototype.addEmptyClass = function (metaVersion) {
        if (!metaVersion) {
            metaVersion = Status.status.mmm.getDefaultPackage().getClass('class');
        }
        var c = new M2Class(this, null, metaVersion);
        console.log('addEmptyClass(); package:', this, '; metaVersion: ', metaVersion, 'classe:', c);
        U.ArrayAdd(this.childrens, c);
        M2Class.updateAllMMClassSelectors();
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
        this.setName(Json.read(json, ECorePackage.namee));
        var uri = json[ECorePackage.nsURI];
        var nsPrefix = json[ECorePackage.nsPrefix];
        this.parent.uri(uri);
        this.parent.namespace(nsPrefix);
        /// childrens
        var childs = Json.getChildrens(json);
        var i;
        if (destructive) {
            this.childrens = [];
        }
        for (i = 0; i < childs.length; i++) {
            var child = childs[i];
            var metaParent = void 0;
            metaParent = null;
            // metaParent = U.findMetaParentC(this, child);
            if (destructive) {
                U.ArrayAdd(this.childrens, new M2Class(this, child, metaParent));
                continue;
            }
            U.pe(true, 'Non-destructive pkg parse: to do');
        }
        M2Class.updateAllMMClassSelectors();
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
        var i;
        for (i = 0; i < this.childrens.length; i++) {
            var classe = this.childrens[i];
            classarr.push(classe.generateModel());
        }
        var model = new Json(null);
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
        return model;
    };
    return M2Package;
}(IPackage));
export { M2Package };
//# sourceMappingURL=MMPackage.js.map