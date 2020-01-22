var IField = /** @class */ (function () {
    function IField(logic) {
        this.logic = logic;
    }
    IField.prototype.getHtml = function () { return this.html; };
    IField.prototype.refreshGUI = function (debug) {
        if (debug === void 0) { debug = true; }
    };
    return IField;
}());
export { IField };
//# sourceMappingURL=iField.js.map