import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { IVertex, Size, U, ModelPiece } from '../common/Joiner';
var DamContextMenuComponent = /** @class */ (function () {
    function DamContextMenuComponent() {
        var _this = this;
        this.templateContainer = null;
        this.$templateContainer = null;
        this.currentlyOpened = null;
        this.$templateContainer = $('#damContextMenuTemplateContainer');
        this.templateContainer = this.$templateContainer[0];
        $(document).off('click.hideContextMenu').on('click.hideContextMenu', function (e) { return _this.checkIfHide(e); });
    }
    DamContextMenuComponent_1 = DamContextMenuComponent;
    DamContextMenuComponent.staticInit = function () {
        DamContextMenuComponent_1.contextMenu = new DamContextMenuComponent_1();
    };
    DamContextMenuComponent.prototype.ngOnInit = function () { };
    DamContextMenuComponent.prototype.show = function (location, classSelector, target) {
        U.pe(!target, 'target is null.');
        this.clickTarget = target;
        console.log('clicktarget:', this.clickTarget);
        var templateSelector = '#MM_VertexContextMenu';
        this.hide();
        var $current = this.$templateContainer.find(templateSelector);
        U.pe($current.length !== 1, 'Unable to find a single template with contextMenu selector:', templateSelector, '. templateList:', this.templateContainer, ', found:', $current);
        this.currentlyOpened = U.cloneHtml($current[0]);
        this.currentlyOpened.id = 'currentlyOpenedContextMenu';
        var $currentlyOpened = $(this.currentlyOpened);
        console.log('hide:', $currentlyOpened.find('ul.contextMenu>li').hide());
        $currentlyOpened.find(classSelector).show();
        console.log('original:', $current[0], 'cloned:', this.currentlyOpened);
        document.body.appendChild(this.currentlyOpened);
        this.currentlyOpened.style.display = 'inline-block';
        var templateSize = U.sizeof(this.currentlyOpened);
        // todo:
        var viewPortSize = new Size(0, 0, window.innerWidth, window.innerHeight);
        location.x = Math.max(0, location.x);
        location.y = Math.max(0, location.y);
        location.x = Math.min(viewPortSize.w - (templateSize.w), location.x);
        console.log('vp.w:', viewPortSize.w, ' - t.w:', templateSize.w, ', loc.x', location.x, ', t.size:', templateSize);
        location.y = Math.min(viewPortSize.h - (templateSize.h), location.y);
        this.currentlyOpened.style.position = 'absolute';
        this.currentlyOpened.style.zIndex = '1000';
        this.currentlyOpened.style.left = '' + location.x + 'px';
        this.currentlyOpened.style.top = '' + location.y + 'px';
        console.log('contextMenu.show() = ', this.currentlyOpened);
        this.addEventListeners();
    };
    DamContextMenuComponent.prototype.hide = function () {
        $('#currentlyOpenedContextMenu').remove();
        if (!this.currentlyOpened) {
            return;
        }
        var parent = this.currentlyOpened.parentNode;
        if (parent === this.templateContainer) {
            parent.removeChild(this.currentlyOpened);
            this.templateContainer.appendChild(this.currentlyOpened);
        }
        this.currentlyOpened = null;
    };
    DamContextMenuComponent.prototype.addEventListeners = function () {
        var html = this.currentlyOpened;
        var $html = $(html);
        console.log(this.clickTarget);
        var v = IVertex.getvertexByHtml(this.clickTarget);
        var m = ModelPiece.getLogic(this.clickTarget);
        console.log('contextMenu target:', this.clickTarget, 'modelPiece:', m);
        U.pe(!v, 'vertex null:', v);
        $html.find('.Vertex.duplicate').off('click.ctxMenu').on('click.ctxMenu', function (e) { m.duplicate('_Copy', m.parent); });
        $html.find('.Vertex.delete').off('click.ctxMenu').on('click.ctxMenu', function (e) { m.delete(); });
        $html.find('.Vertex.minimize').off('click.ctxMenu').on('click.ctxMenu', function (e) { v.minimize(); });
        $html.find('.Vertex.up').off('click.ctxMenu').on('click.ctxMenu', function (e) { v.pushUp(); });
        $html.find('.Vertex.down').off('click.ctxMenu').on('click.ctxMenu', function (e) { v.pushDown(); });
        $html.find('.Vertex.editStyle').off('click.ctxMenu').on('click.ctxMenu', function (e) { U.pw(true, 'deprecato'); /*StyleEditor.editor.show(m);*/ });
        $html.find('.Feature.duplicate').off('click.ctxMenu').on('click.ctxMenu', function (e) { m.duplicate('_Copy', m.parent); });
        $html.find('.Feature.delete').off('click.ctxMenu').on('click.ctxMenu', function (e) { m.delete(); });
        $html.find('.Feature.minimize').off('click.ctxMenu').on('click.ctxMenu', function (e) { v.minimize(); });
        $html.find('.Feature.up').off('click.ctxMenu').on('click.ctxMenu', function (e) { v.pushUp(); });
        $html.find('.Feature.down').off('click.ctxMenu').on('click.ctxMenu', function (e) { v.pushDown(); });
        $html.find('.Feature.editStyle').off('click.ctxMenu').on('click.ctxMenu', function (e) { U.pw(true, 'deprecato'); /*StyleEditor.editor.show(m); */ });
    };
    DamContextMenuComponent.prototype.checkIfHide = function (e) {
        var originalTarget = e.target;
        if (U.isParentOf(this.clickTarget, originalTarget)) {
            return;
        }
        else {
            this.hide();
        }
    };
    var DamContextMenuComponent_1;
    DamContextMenuComponent.contextMenu = null;
    DamContextMenuComponent = DamContextMenuComponent_1 = tslib_1.__decorate([
        Component({
            selector: 'app-dam-context-menu',
            templateUrl: './dam-context-menu.component.html',
            styleUrls: ['./dam-context-menu.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], DamContextMenuComponent);
    return DamContextMenuComponent;
}());
export { DamContextMenuComponent };
//# sourceMappingURL=dam-context-menu.component.js.map