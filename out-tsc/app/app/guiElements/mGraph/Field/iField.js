import { U } from '../../../common/Joiner';
var IField = /** @class */ (function () {
    function IField(logic) {
        this.logic = logic;
    }
    IField.prototype.getHtml = function () { return this.html; };
    IField.prototype.refreshGUI = function (debug) {
        if (debug === void 0) { debug = true; }
    };
    IField.prototype.remove = function () {
        if (this.html && this.html.parentNode) {
            this.html.parentNode.removeChild(this.html);
        }
        this.logic.field = null;
        U.arrayRemoveAll(this.owner.fields, this);
    };
    return IField;
}());
export { IField };
//# sourceMappingURL=iField.js.map