import * as tslib_1 from "tslib";
import { IVertex, U, ModelPiece, Status, M2Class, Type, EEnum, } from '../common/Joiner';
var IClassifier = /** @class */ (function (_super) {
    tslib_1.__extends(IClassifier, _super);
    function IClassifier() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.vertex = null;
        return _this;
    }
    IClassifier.defaultSidebarHtml = function () {
        return U.toHtml('<div class="sidebarNode class"><p class="sidebarNodeName">$##name$</p></div>');
    };
    IClassifier.prototype.generateVertex = function () {
        if (this.vertex)
            return;
        var lastView = this.getLastViewWith('vertexSize');
        var size = lastView ? lastView.vertexSize : null;
        var v = this.vertex = new IVertex(this, size);
        return v;
    };
    IClassifier.prototype.getSidebarHtml = function () {
        if (this.sidebarHtml) {
            return this.sidebarHtml;
        }
        return IClassifier.defaultSidebarHtml();
    };
    IClassifier.prototype.setName = function (value, refreshGUI) {
        if (refreshGUI === void 0) { refreshGUI = false; }
        var oldName = this.name;
        _super.prototype.setName.call(this, value, refreshGUI);
        var model = this.parent ? this.getModelRoot() : null;
        var i;
        // for (i = 0; model && i < model.instances.length; i++) { model.instances[i].sidebar.fullnameChanged(oldName, this.name); }
        Type.updateTypeSelectors(null, false, true, true);
        return this.name;
    };
    IClassifier.prototype.getVertex = function () {
        var displayAsEdge = this.shouldBeDisplayedAsEdge();
        // U.pw(displayAsEdge, 'getvertex called on a class that should not have a vertex.', this);
        if (!displayAsEdge && this.vertex === null && Status.status.loadedLogic) {
            this.generateVertex();
        }
        return this.vertex;
    };
    IClassifier.prototype.refreshGUI_Alone = function (debug) {
        if (!Status.status.loadedLogic) {
            return;
        }
        this.getVertex().refreshGUI();
    };
    IClassifier.prototype.getEcoreTypeName = function () {
        if (this instanceof EEnum || M2Class)
            return Type.classTypePrefix + this.name;
        return Type.classTypePrefix + this.parent.name;
    };
    return IClassifier;
}(ModelPiece));
export { IClassifier };
//# sourceMappingURL=IClassifier.js.map