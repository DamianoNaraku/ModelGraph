import * as tslib_1 from "tslib";
import { U, ModelPiece, StringSimilarity, M3Class } from '../common/Joiner';
var IPackage = /** @class */ (function (_super) {
    tslib_1.__extends(IPackage, _super);
    function IPackage(mm, json, metaParent) {
        var _this = _super.call(this, mm, metaParent) || this;
        _this.instances = [];
        _this.childrens = [];
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
    IPackage.prototype.conformability = function (metaparent, outObj, debug) { return 1; };
    IPackage.prototype.midname = function () { return this.name; };
    IPackage.prototype.fullname = function () { return this.name; };
    IPackage.prototype.getVertex = function () { return undefined; };
    IPackage.prototype.getClass = function (name, caseSensitive, throwErr, debug) {
        if (caseSensitive === void 0) { caseSensitive = false; }
        if (throwErr === void 0) { throwErr = true; }
        if (debug === void 0) { debug = true; }
        var i;
        if (!caseSensitive) {
            name = name.toLowerCase();
        }
        for (i = 0; i < this.childrens.length; i++) {
            var classname = this.childrens[i].name;
            if (!caseSensitive) {
                classname = classname.toLowerCase();
            }
            if (name === classname) {
                return this.childrens[i];
            }
        }
        return null;
    };
    IPackage.prototype.duplicate = function (nameAppend, newParent) {
        if (nameAppend === void 0) { nameAppend = '_Copy'; }
        if (newParent === void 0) { newParent = null; }
        U.pe(true, 'Package duplicate to do.');
        return undefined;
    };
    // todo:
    IPackage.prototype.refreshGUI_Alone = function (debug) {
        var i;
        for (i = 0; i < this.childrens.length; i++) {
            this.childrens[i].refreshGUI_Alone(debug);
        }
    };
    IPackage.prototype.LinkToMetaParent = function (meta) {
        var outObj = {};
        var comformability = this.comformability(meta, outObj);
        if (comformability !== 1) {
            U.pw(true, 'iPackage: ' + this.name + ' not fully conform to ' + meta.name +
                '. Compatibility = ' + comformability * 100 + '%;', outObj);
            return;
        }
        this.metaParent = meta;
        var i;
        var classPermutation = outObj.classPermutation;
        i = -1;
        console.log(outObj);
        while (++i < classPermutation.length) {
            this.childrens[i].linkToMetaParent(meta.childrens[classPermutation[i]]);
        }
    };
    IPackage.prototype.comformability = function (meta, outObj /*.classPermutation*/) {
        if (outObj === void 0) { outObj = null; }
        // return 1;
        // todo: sbloccalo facendo Mpackage.name conforme a MMPackage.name e abilitando package multipli
        if (this.childrens > meta.childrens) {
            return 0;
        }
        var classLenArray = [];
        var i;
        var j;
        // find best references permutation compability
        i = -1;
        while (++i < meta.childrens.length) {
            classLenArray.push(i);
        }
        var classPermut = U.permute(classLenArray);
        console.log('possible Package.classes permutations[' + meta.childrens.length + '!]:', classLenArray, ' => ', classPermut);
        var allClassPermutationConformability = [];
        i = -1;
        var bestClassPermutation = null;
        var bestClassPermutationValue = Number.NEGATIVE_INFINITY;
        while (++i < classPermut.length) {
            j = -1;
            var permutation = classPermut[i];
            var permutationComformability = 0;
            while (++j < permutation.length) {
                var Mclass = this.childrens[j];
                var MMclass = meta.childrens[permutation[j]];
                var classComf = !Mclass ? 0 : Mclass.conformability(MMclass);
                permutationComformability += classComf / permutation.length;
            }
            allClassPermutationConformability.push(permutationComformability);
            if (permutationComformability > bestClassPermutationValue) {
                bestClassPermutation = permutation;
                bestClassPermutationValue = permutationComformability;
            }
            if (permutationComformability === 1) {
                break;
            }
        }
        var total = meta.childrens.length + 1; // + name
        var nameComformability = StringSimilarity.compareTwoStrings(this.name, meta.name) / total;
        bestClassPermutationValue = Math.max(0, bestClassPermutationValue * (meta.childrens.length / total));
        if (outObj) {
            outObj.classPermutation = bestClassPermutation;
        }
        nameComformability = 1 / total;
        var ret = nameComformability + bestClassPermutationValue;
        console.log('PKG.comform(', this.name, { 0: this }, ', ', meta.name, { 0: meta }, ') = ', ret);
        return ret;
    };
    return IPackage;
}(ModelPiece));
export { IPackage };
var M3Package = /** @class */ (function (_super) {
    tslib_1.__extends(M3Package, _super);
    function M3Package(model, json) {
        var _this = _super.call(this, model, json, null) || this;
        _this.instances = [];
        _this.childrens = [];
        _this.parse(json, true);
        return _this;
    }
    M3Package.prototype.getClass = function (name, caseSensitive, throwErr, debug) {
        if (caseSensitive === void 0) { caseSensitive = false; }
        if (throwErr === void 0) { throwErr = true; }
        if (debug === void 0) { debug = true; }
        return _super.prototype.getClass.call(this, name, caseSensitive, throwErr, debug);
    };
    M3Package.prototype.addEmptyClass = function (metaVersion) {
        var c = new M3Class(this, null);
        U.ArrayAdd(this.childrens, c);
        // c.generateVertex(null).draw();
        // M2Class.updateAllMMClassSelectors();
        return c;
    };
    M3Package.prototype.generateModel = function () {
        return undefined;
    };
    M3Package.prototype.parse = function (json, destructive) {
        if (destructive === void 0) { destructive = true; }
        this.name = 'Package';
        this.addEmptyClass(null);
    };
    M3Package.prototype.refreshGUI_Alone = function (debug) {
        if (debug === void 0) { debug = true; }
    };
    return M3Package;
}(IPackage));
export { M3Package };
//# sourceMappingURL=iPackage.js.map