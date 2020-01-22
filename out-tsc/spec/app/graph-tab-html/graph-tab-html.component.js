import * as tslib_1 from "tslib";
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { U } from '../common/util';
import { Status } from '../common/Joiner';
var GraphTabHtmlComponent = /** @class */ (function () {
    function GraphTabHtmlComponent() {
        this.selectedTab = 0;
    }
    GraphTabHtmlComponent_1 = GraphTabHtmlComponent;
    GraphTabHtmlComponent.prototype.ngOnInit = function () {
        this.selectModelTabOnInit(0);
    };
    GraphTabHtmlComponent.prototype.selectModelTabOnInit = function (tentativi) {
        var _this = this;
        if (tentativi === void 0) { tentativi = 0; }
        if (tentativi++ >= 10) {
            U.pe(true, 'failed to wait for Status initialization');
        }
        if (Status.status === null) {
            setTimeout(function () { return _this.selectModelTabOnInit(tentativi); }, 100);
            return;
        }
        U.pe(!this.tabGroup, 'init fail on mat-tab');
        console.log('ngOnInit (mat-tab');
        this.tabGroup.selectedIndex = 1;
        console.log('status:', Status.status);
        Status.status.modelMatTab = this.tabGroup;
        GraphTabHtmlComponent_1.matTabModel = this.tabGroup;
        console.log('POST status:', Status.status);
        // U.pe(true, 'fake error, it is all fine and doing well.');
        // todo: qua devo ottimizzare un bordello e togliere il "middle main", il campo statico è l'unica cosa che funziona, non usare status.
    };
    /*ngAfterViewInit() {
      console.log('afterViewInit => ', this.tabGroup.selectedIndex); }*/
    GraphTabHtmlComponent.prototype.doChangeTab = function () {
        this.selectedTab += 1;
        if (this.selectedTab >= 2) {
            this.selectedTab = 0;
        }
    };
    GraphTabHtmlComponent.prototype.onTabChange = function (e) {
        var model = Status.status.getActiveModel();
        var i;
        var pkgs = model.getAllPackages();
        for (i = 0; i < pkgs.length; i++) {
            pkgs[i].refreshGUI();
        }
        var classes = model.getAllClasses();
        for (i = 0; i < classes.length; i++) {
            classes[i].refreshGUI();
        }
    };
    var GraphTabHtmlComponent_1;
    GraphTabHtmlComponent.matTabModel = null;
    tslib_1.__decorate([
        ViewChild('tabs'),
        tslib_1.__metadata("design:type", MatTabGroup)
    ], GraphTabHtmlComponent.prototype, "tabGroup", void 0);
    GraphTabHtmlComponent = GraphTabHtmlComponent_1 = tslib_1.__decorate([
        Component({
            encapsulation: ViewEncapsulation.None,
            selector: 'app-graph-tab-html',
            templateUrl: './graph-tab-html.component.html',
            styleUrls: ['./graph-tab-html.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], GraphTabHtmlComponent);
    return GraphTabHtmlComponent;
}());
export { GraphTabHtmlComponent };
//# sourceMappingURL=graph-tab-html.component.js.map