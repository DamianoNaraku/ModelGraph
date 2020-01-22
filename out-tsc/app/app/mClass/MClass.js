import * as tslib_1 from "tslib";
import { U, ModelPiece, Status, IClass, MReference, MAttribute, } from '../common/Joiner';
var MClass = /** @class */ (function (_super) {
    tslib_1.__extends(MClass, _super);
    function MClass(pkg, json, metaVersion) {
        var _this = _super.call(this, pkg, metaVersion) || this;
        if (!pkg && !json && !metaVersion) {
            return _this;
        } // empty constructor for .duplicate();
        U.pe(!metaVersion, 'null metaparent?');
        _this.parse(json, true);
        return _this;
    }
    // external pointers to this class.
    // id: number;
    // instances: ModelPiece[];
    // metaParent: M2Class;
    // parent: MPackage;
    // childrens: ModelPiece[];
    /*attributes: MAttribute[];
    references: MReference[];
    referencesIN: MReference[];
  */
    MClass.getArrayIndex_ByMetaParentName = function (name, array) {
        var i = -1;
        while (++i < array.length) {
            if (name === array[i].metaParent.name) {
                return i;
            }
        }
        return -1;
    };
    MClass.prototype.endingName = function (valueMaxLength) {
        if (valueMaxLength === void 0) { valueMaxLength = 10; }
        if (this.attributes.length > 0) {
            return this.attributes[0].endingName(valueMaxLength);
        }
        if (this.references.length > 0) {
            return this.references[0].endingName(valueMaxLength);
        }
        return '';
    };
    MClass.prototype.getModelRoot = function () { return _super.prototype.getModelRoot.call(this); };
    MClass.prototype.isRoot = function () { return this === Status.status.m.classRoot; };
    MClass.prototype.setRoot = function (value) {
        U.pe(!value, 'should only be used to set root. to delete a root choose another one and call setRoot on it.');
        this.getModelRoot().classRoot = this;
    };
    MClass.prototype.conformability = function (meta, outObj) {
        throw new Error('M.conformability%() todo');
    };
    MClass.prototype.duplicate = function (nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = null; }
        if (newParent === void 0) { newParent = null; }
        var c = new MClass(null, null, null);
        c.copy(this);
        c.refreshGUI_Alone();
        return c;
    };
    // linkToMetaParent(meta: M2Class): void { return super.linkToMetaParent(meta); }
    MClass.prototype.generateModel = function (root) {
        if (root === void 0) { root = false; }
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
        var inlineMarker = Status.status.XMLinlineMarker;
        var json = {};
        if (root) {
            json[inlineMarker + 'xmlns:xmi'] = 'http://www.omg.org/XMI';
            json[inlineMarker + 'xmlns:' + this.getModelRoot().namespace()] = this.getModelRoot().uri();
            json[inlineMarker + 'xmi:version'] = '2.0';
        }
        var outi;
        var i;
        var set = function (k, v) { json[k] = v; };
        var arr = [this.attributes, this.references];
        for (outi = 0; outi < arr.length; outi++) {
            for (i = 0; i < arr[outi].length; i++) {
                var child = arr[outi][i];
                var value = (child).generateModel();
                U.pe(value instanceof ModelPiece, 'value returned is modelpiece.', child);
                // some error here, il value = ELIteral viene assegnato alla key .nome
                if (value === '' || value === null || value === undefined || U.isEmptyObject(value)) {
                    continue;
                }
                var key = (U.isPrimitive(value) ? inlineMarker : '') + child.metaParent.name;
                json[key] = value;
            }
        }
        return json;
    };
    MClass.prototype.parse = function (json, destructive) {
        if (destructive === void 0) { destructive = true; }
        var attributes = (this.metaParent).attributes;
        var references = (this.metaParent).references;
        // const childrens: M2Feature[] = (this.metaParent).childrens;
        var i = -1;
        if (destructive) {
            this.attributes = [];
            this.references = [];
            this.childrens = [];
            this.referencesIN = [];
            while (++i < attributes.length) {
                var attr = new MAttribute(this, null, attributes[i]);
                /*U.ArrayAdd(this.childrens, attr);*/
                U.ArrayAdd(this.attributes, attr);
                console.trace();
                console.log('add[' + i + '/' + this.metaParent.attributes.length + ']:', attr, this.attributes, this.attributes.length, this);
            }
            i = -1;
            while (++i < references.length) {
                var ref = new MReference(this, null, references[i]);
                /*U.ArrayAdd(this.childrens, ref);*/
                U.ArrayAdd(this.references, ref);
            }
        }
        U.pe(this.attributes.length > 4, this, this.attributes.length);
        /*{                                                           <--- classRoot
            "-xmlns:xmi": "http://www.omg.org/XMI",
            "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
            "-xmi:version": "2.0",
            "Players": [
              { "-name": "tizio" },          <-- class[0]
              { "-name": "asd" }             <-- class[1]
            ]
          }*/
        var inlineMarker = Status.status.XMLinlineMarker;
        for (var key in json) {
            if (!json.hasOwnProperty(key)) {
                continue;
            }
            var value = json[key];
            switch (key) {
                case inlineMarker + 'xmlns:xmi':
                // case inlineMarker + 'xmlns:' + this.getModelRoot().namespace():
                case inlineMarker + 'xmi:version':
                    this.setRoot(true);
                    break;
                default:
                    // todo: usa il ns del modello per caricare il metamodello con quel namespace se quello attuale non è conforme?
                    if (key.indexOf(inlineMarker) === 0) {
                        key = key.substr(inlineMarker.length);
                    }
                    if (key.indexOf('xmlns:') === 0) {
                        key = key.substr('xmlns:'.length);
                        this.getModelRoot().namespace(key);
                        U.pw(false, 'setns?', key, this, this.metaParent);
                        continue;
                    }
                    var metaAttr = this.metaParent.getAttribute(key);
                    var metaRef = this.metaParent.getReference(key);
                    if (metaAttr) {
                        var cindex = this.getChildrenIndex_ByMetaParent(metaAttr);
                        var aindex = this.getAttributeIndex_ByMetaParent(metaAttr);
                        /*const newA: MAttribute = new MAttribute(this, value, metaAttr);
                        this.childrens[cindex] = this.attributes[aindex] = newA;*/
                        this.attributes[aindex].parse(value, true);
                    }
                    else if (metaRef) {
                        var cindex = this.getChildrenIndex_ByMetaParent(metaRef);
                        var rindex = this.getReferenceIndex_ByMetaParent(metaRef);
                        // const newR: MReference = new MReference(this, value, metaRef);
                        // this.childrens[cindex] = this.references[rindex] = newR;
                        var j = void 0;
                        var edges = this.references[rindex].getEdges();
                        for (j = 0; j < edges.length; j++) { }
                        this.references[rindex].parse(value, true);
                    }
                    else {
                        U.pe(true, 'model attribute-or-reference type not found. class:', this, ', json:', json, 'key/name:', key, ', Iclass:', this.metaParent);
                    }
                    break;
            }
        }
        console.log('here2', this, this.attributes.length);
        U.pe(this.attributes.length > 4, this, this.attributes.length);
    };
    MClass.prototype.modify_Old = function (json, destructive) {
        if (destructive === void 0) { destructive = true; }
        /*{                                                                                           <-- :classroot
            "-xmlns:xmi": "http://www.omg.org/XMI",
            "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
            "-xmi:version": "2.0",
            "Players": [
              { "-name": "tizio" },          <-- class[0]
              { "-name": "asd" }             <-- class[1]
            ]
          }*/
        if (destructive) {
            this.childrens = [];
            this.references = [];
            this.attributes = [];
            this.referencesIN = [];
        }
        var inlineMarker = Status.status.XMLinlineMarker;
        for (var key in json) {
            if (!json.hasOwnProperty(key)) {
                continue;
            }
            var value = json[key];
            switch (key) {
                case inlineMarker + 'xmlns:xmi':
                // case inlineMarker + 'xmlns:' + this.getModelRoot().namespace():
                case inlineMarker + 'xmi:version':
                    this.setRoot(true);
                    break;
                default:
                    // todo: usa il ns del modello per caricare il metamodello con quel namespace se quello attuale non è conforme?
                    if (key.indexOf(inlineMarker) === 0) {
                        key = key.substr(inlineMarker.length);
                    }
                    if (key.indexOf('xmlns:') === 0) {
                        key = key.substr('xmlns:'.length);
                        this.getModelRoot().namespace(key);
                        U.pw(false, 'setns?', key, this, this.metaParent);
                        continue;
                    }
                    var metaAttr = this.metaParent.getAttribute(key);
                    var metaRef = this.metaParent.getReference(key);
                    var newA = void 0;
                    var newR = void 0;
                    if (metaAttr) {
                        newA = new MAttribute(this, value, metaAttr);
                        U.ArrayAdd(this.childrens, newA);
                        U.ArrayAdd(this.attributes, newA);
                    }
                    else if (metaRef) {
                        newR = new MReference(this, value, metaRef);
                        U.ArrayAdd(this.childrens, newR);
                        U.ArrayAdd(this.references, newR);
                    }
                    else {
                        U.pe(true, 'model attribute-or-reference type not found. class:', this, ', json:', json, 'key/name:', key, ', Iclass:', this.metaParent);
                    }
                    break;
            }
        }
    };
    MClass.prototype.getChildrenIndex_ByMetaParent = function (meta) { return MClass.getArrayIndex_ByMetaParentName(meta.name, this.childrens); };
    MClass.prototype.getAttributeIndex_ByMetaParent = function (meta) { return MClass.getArrayIndex_ByMetaParentName(meta.name, this.attributes); };
    MClass.prototype.getReferenceIndex_ByMetaParent = function (meta) { return MClass.getArrayIndex_ByMetaParentName(meta.name, this.references); };
    return MClass;
}(IClass));
export { MClass };
//# sourceMappingURL=MClass.js.map