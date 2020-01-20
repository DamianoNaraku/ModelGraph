var IEdge = /** @class */ (function () {
    function IEdge(v1, v2) {
        this.start = v1;
        this.end = v2;
    }
    IEdge.addEventListeners = function (html) {
        // todo
    };
    IEdge.prototype.createGUI = function () {
        // todo
        return null;
    };
    IEdge.prototype.refreshGui = function () {
        // todo: itera tra i this.midNodes, start e end vertex e crea l'svg path
    };
    IEdge.prototype.updateGui = function () { return this.refreshGui(); };
    return IEdge;
}());
export { IEdge };
//# sourceMappingURL=iEdge.js.map