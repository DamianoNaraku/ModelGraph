import * as tslib_1 from "tslib";
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { Status } from '../../common/Joiner';
var GraphTabHtmlComponent = /** @class */ (function () {
    function GraphTabHtmlComponent() {
        this.selectedTab = 0;
    }
    GraphTabHtmlComponent_1 = GraphTabHtmlComponent;
    GraphTabHtmlComponent.prototype.ngOnInit = function () {
        // this.selectModelTabOnInit(0);
    };
    /*
      private selectModelTabOnInit(tentativi: number = 0) {
        if (tentativi++ >= 10) { U.pe(true, 'failed to wait for Status initialization'); }
        if (Status.status === null) {
          setTimeout(() => this.selectModelTabOnInit(tentativi), 100);
          return;
        }
        U.pe(!this.tabGroup, 'init fail on mat-tab');
        this.tabGroup.selectedIndex = 1;
        Status.status.modelMatTab = this.tabGroup;
        GraphTabHtmlComponent.matTabModel = this.tabGroup;
        // todo: qua devo ottimizzare un bordello e togliere il "middle main", il campo statico è l'unica cosa che funziona, non usare status.
      }
      ngAfterViewInit() {
        console.log('afterViewInit => ', this.tabGroup.selectedIndex); }*/
    GraphTabHtmlComponent.prototype.doChangeTab = function () {
        this.selectedTab += 1;
        if (this.selectedTab >= 2) {
            this.selectedTab = 0;
        }
    };
    GraphTabHtmlComponent.prototype.onTabChange = function (e) {
        var model = Status.status.getActiveModel();
        if (!model && GraphTabHtmlComponent_1.timesCanFailDuringInit-- > 0) {
            return;
        }
        var i;
        // for (i = 0; i < model.childrens.length; i++) { model.childrens[i].refreshGUI(); }
        var classes = model.getAllClasses();
        for (i = 0; i < classes.length; i++) {
            classes[i].refreshGUI();
        }
    };
    var GraphTabHtmlComponent_1;
    GraphTabHtmlComponent.matTabModel = null;
    GraphTabHtmlComponent.timesCanFailDuringInit = 1;
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