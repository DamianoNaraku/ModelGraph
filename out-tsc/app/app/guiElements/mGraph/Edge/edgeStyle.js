import { EdgeModes } from '../../../common/Joiner';
var EdgePointStyle = /** @class */ (function () {
    function EdgePointStyle(radius, strokeWidth, strokeColor, fillColor) {
        if (radius === void 0) { radius = null; }
        if (strokeWidth === void 0) { strokeWidth = null; }
        if (strokeColor === void 0) { strokeColor = null; }
        if (fillColor === void 0) { fillColor = null; }
        this.radius = null;
        this.strokeWidth = null;
        this.strokeColor = null;
        this.fillColor = null;
        this.radius = radius;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.fillColor = fillColor;
    }
    return EdgePointStyle;
}());
export { EdgePointStyle };
var EdgeStyle = /** @class */ (function () {
    function EdgeStyle(style, width, color, edgePointStyle) {
        if (style === void 0) { style = EdgeModes.angular23Auto; }
        if (width === void 0) { width = 2; }
        if (color === void 0) { color = '#ffffff'; }
        this.style = null;
        this.width = null;
        this.color = null;
        this.edgePointStyle = null;
        this.edgePointStyle = edgePointStyle;
        this.style = style;
        this.width = width;
        this.color = color;
    }
    EdgeStyle.prototype.clone = function () { return new EdgeStyle(this.style, this.width, this.color, this.edgePointStyle); };
    return EdgeStyle;
}());
export { EdgeStyle };
//# sourceMappingURL=edgeStyle.js.map