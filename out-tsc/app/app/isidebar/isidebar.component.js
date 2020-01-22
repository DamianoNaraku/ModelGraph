import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { U, ModelPiece, Status, IClass } from '../common/Joiner';
var IsidebarComponent = /** @class */ (function () {
    function IsidebarComponent() {
    }
    IsidebarComponent.prototype.ngOnInit = function () {
    };
    IsidebarComponent = tslib_1.__decorate([
        Component({
            selector: 'app-isidebar',
            templateUrl: './isidebar.component.html',
            styleUrls: ['./isidebar.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], IsidebarComponent);
    return IsidebarComponent;
}());
export { IsidebarComponent };
var ISidebar = /** @class */ (function () {
    // nodeContainer: HTMLDivElement = null;
    function ISidebar(model, container) {
        this.container = null;
        this.packageContainer = null;
        this.classContainer = null;
        this.htmls = null;
        this.model = model;
        // this.mm = (model instanceof MetaModel);
        if (Status.status.mmm === this.model) {
            Status.status.mm.sidebar = this;
        }
        else {
            Status.status.m.sidebar = this;
        }
        this.container = container;
        this.packageContainer = document.createElement('div');
        this.packageContainer.classList.add('sidebarPackageContainer');
        this.classContainer = document.createElement('div');
        this.classContainer.classList.add('sidebarClassContainer');
        this.container.appendChild(this.packageContainer);
        this.container.appendChild(this.classContainer);
        this.htmls = this.loadDefaultHtmls();
    }
    ISidebar.prototype.loadDefaultHtmls = function () {
        this.clear();
        var arr;
        var i;
        this.htmls = {};
        /*if (false && false) {
          arr = this.model.childrens;
          for (i = 0; i < arr.length; i++) { this.htmls[arr[i].fullname()] = IPackage.defaultSidebarHtml(); } } */
        arr = this.model.getAllClasses();
        for (i = 0; i < arr.length; i++) {
            this.htmls[arr[i].fullname()] = arr[i].getSidebarHtml();
        }
        this.updateAll();
        return this.htmls;
    };
    ISidebar.prototype.clear = function () {
        U.clear(this.packageContainer);
        U.clear(this.classContainer);
    };
    ISidebar.prototype.updateAll = function () {
        var i;
        var arr = null;
        if (false && this.model !== Status.status.mmm) { // package is not shown for mmm (in the mm sidebar), per ora tolgo proprio i packages
            U.clear(this.packageContainer);
            for (i = 0; i < arr.length; i++) {
                this.updateNode(arr[i], this.packageContainer);
            }
        }
        arr = this.model.getAllClasses();
        for (i = 0; i < arr.length; i++) {
            this.updateNode(arr[i], this.classContainer);
        }
    };
    ISidebar.prototype.addEventListeners = function (html) {
        var $html = $(html);
        $html.off('click.sidebarNode').on('click.sidebarNode', function (e) {
            Status.status.getActiveModel().sidebar.sidebarNodeClick(e);
        });
    };
    ISidebar.prototype.sidebarNodeClick = function (e) {
        console.log('sidebarNodeClick()', Status.status.getActiveModel() === Status.status.mm, Status.status.getActiveModel());
        if (Status.status.getActiveModel().isMM()) {
            this.sidebarNodeClick0(e);
        }
        else {
            this.sidebarNodeClick0(e);
        }
    };
    ISidebar.prototype.sidebarNodeClick0 = function (e) {
        console.log('sidebarNodeClick()');
        var html = e.currentTarget;
        while (!html.dataset.modelPieceID) {
            html = html.parentNode;
        }
        var modelPiece = ModelPiece.getLogic(html);
        U.pe(!modelPiece, 'the id does not match any class or package', e);
        var modelOfSidebar = modelPiece.getModelRoot();
        var modelOfGraph = Status.status.getActiveModel();
        var graph = modelOfGraph.graph; /*m2*/
        U.pe(!graph, 'invalid graph of model:', modelOfGraph);
        console.log('pre Add empty class');
        U.pe(!modelPiece.instances, modelPiece);
        if (modelPiece instanceof IClass /*m3*/) {
            modelOfGraph.getDefaultPackage().addEmptyClass(modelPiece);
            // } else {
            //  if ( modelPiece instanceof M3Package /*m3*/) { modelOfGraph.addEmptyP(); }
        }
        else {
            U.pe(true, 'unxpected class type of modelpiece:', modelPiece);
        }
        console.log('addSidebarNodeClick done');
    };
    ISidebar.prototype.updateNode = function (piece, containerr) {
        var html = U.cloneHtml(this.htmls['' + piece.fullname()]);
        html = U.replaceVars(piece, html);
        piece.linkToLogic(html);
        this.addEventListeners(html);
        // const node: HTMLElement = ISidebar.createNodeContainer();
        // node.innerHTML = html;
        containerr.appendChild(html);
    };
    ISidebar.prototype.fullnameChanged = function (old, neww) {
        if (!this.htmls[old]) {
            return;
        }
        this.htmls[neww] = this.htmls[old];
        delete this.htmls[old];
    };
    return ISidebar;
}());
export { ISidebar };
var SidebarElement = /** @class */ (function () {
    function SidebarElement() {
    }
    return SidebarElement;
}());
export { SidebarElement };
//# sourceMappingURL=isidebar.component.js.map