import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { U, ModelPiece, Status, IClass, EEnum } from '../../common/Joiner';
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
    // htmls: Dictionary<string /*ModelPiece.fullname*/, HTMLElement | SVGGElement> = null;
    // nodeContainer: HTMLDivElement = null;
    function ISidebar(model, container) {
        this.container = null;
        this.packageContainer = null;
        this.classContainer = null;
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
        this.updateAll();
        // this.htmls = this.loadDefaultHtmls();
    }
    /*
      loadDefaultHtmls(): Dictionary<string, HTMLElement | SVGGElement> /*
        console.log('refresh left iSidebar');
        // bug: todo: not refreshing quando cambio il nome di un m2class. però i classSelector si aggiornano.
        this.clear();
        let arr: IClassifier[];
        let i;
        // this.htmls = {};
        /*if (false && false) {
          arr = this.model.childrens;
          for (i = 0; i < arr.length; i++) { this.htmls[arr[i].fullname()] = IPackage.defaultSidebarHtml(); } } * /
        // arr = this.model.getAllClasses();
        // if (this.model.isM3()) Array.prototype.push.apply(arr, this.model.getAllEnums());
        // for (i = 0; i < arr.length; i++) { this.htmls[arr[i].fullname()] = arr[i].getSidebarHtml();  }
        this.updateAll();
        return this.htmls; */
    ISidebar.prototype.clear = function () {
        U.clear(this.packageContainer);
        U.clear(this.classContainer);
    };
    ISidebar.prototype.updateAll = function () {
        this.clear();
        var i;
        var cla = this.model.getAllClasses();
        var enu = this.model.isM2() ? [] : this.model.getAllEnums();
        for (i = 0; i < cla.length; i++) {
            this.updateNode(cla[i], this.classContainer);
        }
        for (i = 0; i < enu.length; i++) {
            this.updateNode(enu[i], this.classContainer);
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
        var metaParent = ModelPiece.getLogic(html);
        U.pe(!metaParent, 'the id does not match any class or package', e);
        var modelOfSidebar = metaParent.getModelRoot();
        var modelOfGraph = Status.status.getActiveModel();
        var graph = modelOfGraph.graph; /*m2*/
        U.pe(!graph, 'invalid graph of model:', modelOfGraph);
        var pkg = modelOfGraph.getDefaultPackage();
        if (metaParent instanceof IClass /*m3*/) {
            pkg.addEmptyClass(metaParent);
        }
        else if (metaParent instanceof EEnum /*m3*/) {
            pkg.addEmptyEnum();
        }
        else {
            U.pe(true, 'unxpected class type of metaparent:', metaParent);
        }
        console.log('addSidebarNodeClick done');
    };
    ISidebar.prototype.updateNode = function (piece, containerr) {
        var html = U.replaceVars(piece, piece.getSidebarHtml(), true);
        piece.linkToLogic(html);
        this.addEventListeners(html);
        containerr.appendChild(html);
    };
    return ISidebar;
}());
export { ISidebar };
//# sourceMappingURL=isidebar.component.js.map