import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Status } from '../common/Joiner';
var MmGraphHtmlComponent = /** @class */ (function () {
    function MmGraphHtmlComponent() {
    }
    MmGraphHtmlComponent_1 = MmGraphHtmlComponent;
    MmGraphHtmlComponent.graphMain = function () {
        if (Status.status === null) {
            setTimeout(MmGraphHtmlComponent_1.graphMain, 1000);
            return;
        }
        // real main can start
    };
    MmGraphHtmlComponent.prototype.ngOnInit = function () {
        MmGraphHtmlComponent_1.graphMain();
    };
    var MmGraphHtmlComponent_1;
    MmGraphHtmlComponent = MmGraphHtmlComponent_1 = tslib_1.__decorate([
        Component({
            selector: 'app-mm-graph-html',
            templateUrl: './mm-graph-html.component.html',
            styleUrls: ['./mm-graph-html.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], MmGraphHtmlComponent);
    return MmGraphHtmlComponent;
}());
export { MmGraphHtmlComponent };
//# sourceMappingURL=mm-graph-html.component.js.map