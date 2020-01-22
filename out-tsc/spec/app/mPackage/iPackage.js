import * as tslib_1 from "tslib";
import { Json, U, IVertex, IClass, ModelPiece } from '../common/joiner';
import { eCorePackage } from '../common/util';
// actually mm
var IPackage = /** @class */ (function (_super) {
    tslib_1.__extends(IPackage, _super);
    function IPackage(mm, json, metaParent) {
        var _this = _super.call(this, mm, metaParent) || this;
        _this.htmlRaw = null;
        _this.html = null;
        _this.styleOfInstances = null;
        _this.modify(json, true);
        return _this;
    }
    IPackage.defaultSidebarHtml = function () {
        var div = document.createElement('div');
        var p = document.createElement('p');
        div.appendChild(p);
        p.innerHTML = '$##name$';
        p.classList.add('sidebarNodeName');
        div.classList.add('sidebarNode');
        div.classList.add('package');
        return div;
    };
    IPackage.prototype.getDefaultStyle = function () {
        U.pe(true, 'IPackage.GetDefaultStyle()): todo');
        return undefined;
    };
    IPackage.prototype.modify = function (json, destructive) {
        this.setJson(json);
        /// own attributes.
        if (this.fullname) {
            delete IPackage.all[this.fullname];
        }
        this.fullname = this.midname = this.name = Json.read(this.json, eCorePackage.name);
        IPackage.all[this.fullname] = this;
        /// childrens
        var childs = Json.getChildrens(json);
        var i;
        if (destructive) {
            this.childrens = [];
        }
        for (i = 0; i < childs.length; i++) {
            var child = childs[i];
            if (destructive) {
                this.childrens.push(new IClass(this, child, U.findMetaParentC(this, child)));
                continue;
            }
            U.pe(true, 'Non-destructive pkg modify: to do');
        }
    };
    IPackage.prototype.remove = function () { return _super.prototype.remove.call(this); };
    IPackage.prototype.mark = function (bool) {
        return bool; // todo
    };
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
    IPackage.prototype.generateVertex = function (location) {
        var v = new IVertex();
        v.constructorPkg(this);
        v.draw();
        v.moveTo(location);
        return v;
    };
    IPackage.prototype.generateModel = function () {
        var classarr = [];
        var i;
        for (i = 0; i < this.childrens.length; i++) {
            var classe = this.childrens[i];
            classarr.push(classe.generateModel());
        }
        var model = new Json(null);
        model[eCorePackage.name] = this.name;
        model[eCorePackage.eClassifiers] = classarr;
        return model;
    };
    IPackage.prototype.fieldChanged = function (e) {
        var html = e.currentTarget;
        switch (html.tagName.toLowerCase()) {
            case 'select':
            default:
                U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e);
                break;
            case 'input':
                this.name = html.value;
                break;
        }
    };
    IPackage.prototype.setName = function (name) {
        console.log('pkgsetName(', name, ') = ' + name);
        _super.prototype.setName.call(this, name);
        this.midname = this.name;
        this.fullname = this.name;
        this.refreshGUI();
    };
    IPackage.all = [];
    return IPackage;
}(ModelPiece));
export { IPackage };
//# sourceMappingURL=iPackage.js.map