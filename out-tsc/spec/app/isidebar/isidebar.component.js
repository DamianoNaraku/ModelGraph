import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { U, IPackage, ModelPiece, Status, IClass } from '../common/joiner';
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
        this.htmls = null; // dictionary<IModelPiece, html>
        this.model = model;
        // this.mm = (model instanceof MetaModel);
        this.container = container;
        this.packageContainer = document.createElement('div');
        this.packageContainer.classList.add('sidebarPackageContainer');
        this.classContainer = document.createElement('div');
        this.classContainer.classList.add('sidebarClassContainer');
        this.container.appendChild(this.packageContainer);
        this.container.appendChild(this.classContainer);
        this.htmls = this.loadDefaultHtmls();
        // this.createNodeContainer();
        if (Status.status.mmm === this.model) {
            Status.status.mm.sidebar = this;
        }
        else {
            Status.status.m.sidebar = this;
        }
        this.updateAll();
    }
    ISidebar.createNodeContainer = function () {
        var node = document.createElement('div');
        node.classList.add('sidebarNode');
        // this.nodeContainer = node;
        return node;
    };
    ISidebar.prototype.loadDefaultHtmls = function () {
        var arr = null;
        var i;
        this.htmls = {};
        if (this.model !== Status.status.mmm && false) { // package is not shown for mmm (in the mm sidebar), per ora tolgo proprio i packages
            arr = this.model.getAllPackages();
            for (i = 0; i < arr.length; i++) {
                this.htmls[arr[i].fullname] = IPackage.defaultSidebarHtml();
            }
        }
        arr = this.model.getAllClasses();
        for (i = 0; i < arr.length; i++) {
            this.htmls[arr[i].fullname] = IClass.defaultSidebarHtml();
        }
        return this.htmls;
    };
    ISidebar.prototype.clear = function () {
        U.clear(this.packageContainer);
        U.clear(this.classContainer);
    };
    ISidebar.prototype.updateAll = function () {
        var i;
        var arr = null;
        if (this.model !== Status.status.mmm && false) { // package is not shown for mmm (in the mm sidebar), per ora tolgo proprio i packages
            arr = this.model.getAllPackages();
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
        if (Status.status.getActiveModel() === Status.status.mm) {
            this.sidebarNodeClickMM(e);
        }
        else {
            this.sidebarNodeClickM(e);
        }
    };
    ISidebar.prototype.sidebarNodeClickMM = function (e) {
        console.log('button:', e.button, 'e:', e);
        var html = e.currentTarget;
        while (!html.dataset.modelPieceID) {
            html = html.parentNode;
        }
        var modelPiece = ModelPiece.getLogic(html);
        U.pe(!modelPiece, 'the id does not match any class or package', e);
        var modelOfSidebar = modelPiece.getModelRoot();
        var modelOfGraph = Status.status.getActiveModel();
        var graph = modelOfGraph.graph;
        U.pe(!graph, 'invalid graph of model:', modelOfGraph);
        var defaultPackage = modelOfGraph.childrens[0];
        if (modelPiece instanceof IClass) {
            modelOfGraph.addEmptyClass(defaultPackage, modelPiece);
        }
        if (modelPiece instanceof IPackage) {
            modelOfGraph.addEmptyP();
        }
        // todo: le classi aggiunte tramite sidebar non hanno parent.
    };
    ISidebar.prototype.sidebarNodeClickM = function (e) {
        console.log('button:', e.button, 'e:', e);
        var html = e.currentTarget;
        while (!html.dataset.modelPieceID) {
            html = html.parentNode;
        }
        var modelPiece = ModelPiece.getLogic(html);
        U.pe(!modelPiece, 'the id does not match any class or package', e);
        var modelOfSidebar = modelPiece.getModelRoot();
        var modelOfGraph = Status.status.getActiveModel();
        var graph = modelOfGraph.graph;
        U.pe(!graph, 'invalid graph of model:', modelOfGraph, 'status:', Status.status);
        var defaultPackage = modelOfGraph.childrens[0];
        if (modelPiece instanceof IClass) {
            modelOfGraph.addClass(defaultPackage, modelPiece);
        }
        if (modelPiece instanceof IPackage) {
            modelOfGraph.addEmptyP();
        }
        // todo: le classi aggiunte tramite sidebar non hanno parent.
    };
    ISidebar.prototype.updateNode = function (piece, container) {
        var html = U.cloneHtml(this.htmls['' + piece.fullname]);
        html = U.replaceVars(piece, html);
        piece.linkToLogic(html);
        this.addEventListeners(html);
        // const node: HTMLElement = ISidebar.createNodeContainer();
        // node.innerHTML = html;
        container.appendChild(html);
    };
    ISidebar.prototype.fullnameChanged = function (old, neww) {
        this.htmls[neww] = this.htmls[old];
        this.htmls[old] = undefined;
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