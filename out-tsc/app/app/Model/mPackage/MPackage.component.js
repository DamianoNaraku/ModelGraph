import * as tslib_1 from "tslib";
import { Status, IPackage, MClass } from '../../common/Joiner';
var MPackage = /** @class */ (function (_super) {
    tslib_1.__extends(MPackage, _super);
    function MPackage(model, json, metaparent) {
        var _this = _super.call(this, model, json, metaparent) || this;
        // todo: nel parse il json viene ignorato, cerca come vengono costruite le classi.
        // return;
        // this.setName(name);
        // this.setJson(json);
        _this.parse(json, true);
        return _this;
    }
    MPackage.prototype.getClass = function (name, caseSensitive, throwErr, debug) {
        if (caseSensitive === void 0) { caseSensitive = false; }
        if (throwErr === void 0) { throwErr = true; }
        if (debug === void 0) { debug = true; }
        return _super.prototype.getClass.call(this, name, caseSensitive, throwErr, debug);
    };
    MPackage.prototype.addEmptyClass = function (metaVersion) {
        var c = new MClass(this, null, metaVersion);
        if (Status.status.loadedLogic)
            c.generateVertex();
        console.log('addEmptyClass(); package:', this, '; metaVersion: ', metaVersion, 'classe:', c);
        return c;
    };
    MPackage.prototype.generateModel = function () { return this.parent.generateModel(); };
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
  
    LinkToMetaParent(meta: IPackage): void {
    }
  */
    MPackage.prototype.parse = function (json, destructive, uri, name) {
        if (destructive === void 0) { destructive = true; }
        if (uri === void 0) { uri = null; }
        if (name === void 0) { name = null; }
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
        var i; /*
        this.views = [];
        for(i = 0; i < this.parent.viewpoints.length; i++) {
          const vp: ViewPoint = this.parent.viewpoints[i];
          const v = new PackageView(vp.modelView);
          this.views.push(v);
          vp.modelView.packageViews.push(v); }*/
    };
    return MPackage;
}(IPackage));
export { MPackage };
//# sourceMappingURL=MPackage.component.js.map