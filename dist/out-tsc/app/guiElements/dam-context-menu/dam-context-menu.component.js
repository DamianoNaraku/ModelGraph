import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { IVertex, Size, U, ModelPiece, ExtEdge, IEdge, IClassifier, MReference } from '../../common/Joiner';
var DamContextMenuComponent = /** @class */ (function () {
    function DamContextMenuComponent() {
        var _this = this;
        this.html = null;
        this.$html = null;
        this.$html = $('#damContextMenuTemplateContainer');
        this.html = this.$html[0];
        $(document).off('click.hideContextMenu').on('click.hideContextMenu', function (e) { return _this.checkIfHide(e); });
        this.$vertexcontext = this.$html.find('ul.vertex');
        this.$edgecontext = this.$html.find('ul.edge');
        this.$extedgecontext = this.$html.find('ul.extedge');
        this.vertexcontext = this.$vertexcontext[0];
        this.edgecontext = this.$edgecontext[0];
        this.extedgecontext = this.$extedgecontext[0];
        this.$html.on('contextmenu', function (e) { e.preventDefault(); e.stopPropagation(); return false; });
    }
    DamContextMenuComponent_1 = DamContextMenuComponent;
    DamContextMenuComponent.staticInit = function () {
        DamContextMenuComponent_1.contextMenu = new DamContextMenuComponent_1();
    };
    DamContextMenuComponent.prototype.ngOnInit = function () { };
    DamContextMenuComponent.prototype.show = function (location, classSelector, target) {
        U.pe(!target, 'target is null.');
        this.clickTarget = target;
        this.addEventListeners(); // must be done here, per facilità di fare binding usando variabili esterne agli eventi.
        this.html.style.display = 'none'; // if was already displaying, start the scrollDown animation without doing the scrollUp()
        this.$html.slideDown();
        var vertex = IVertex.getvertexByHtml(target);
        var edge = IEdge.getByHtml(target);
        var extedge = null;
        if (edge instanceof ExtEdge) {
            extedge = edge;
            edge = null;
        }
        console.log('contextmenu target:', this.clickTarget);
        var templateSize = U.sizeof(this.html);
        // todo:
        var viewPortSize = new Size(0, 0, window.innerWidth, window.innerHeight);
        location.x = Math.max(0, location.x);
        location.y = Math.max(0, location.y);
        location.x = Math.min(viewPortSize.w - (templateSize.w), location.x);
        console.log('vp.w:', viewPortSize.w, ' - t.w:', templateSize.w, ', loc.x', location.x, ', t.size:', templateSize, this.html);
        location.y = Math.min(viewPortSize.h - (templateSize.h), location.y);
        this.html.style.position = 'absolute';
        this.html.style.zIndex = '1000';
        this.html.style.left = '' + location.x + 'px';
        this.html.style.top = '' + location.y + 'px';
        this.extedgecontext.style.display = 'none';
        this.edgecontext.style.display = 'none';
        this.vertexcontext.style.display = 'none';
        this.edgecontext.style.display = edge ? '' : 'none';
        this.extedgecontext.style.display = extedge ? '' : 'none';
        this.vertexcontext.style.display = vertex ? '' : 'none';
        this.$vertexcontext.find('.Reference').hide();
        this.$vertexcontext.find('.refli.dynamic').remove();
        if (vertex) {
            var mp = ModelPiece.getLogic(target);
            var model = mp.getModelRoot();
            if (model.isM1()) {
                this.$vertexcontext.find('.m1hide').hide();
                this.$vertexcontext.find('.m2hide').show();
            }
            else {
                this.$vertexcontext.find('.m1hide').show();
                this.$vertexcontext.find('.m2hide').hide();
            }
            if (mp instanceof IClassifier) {
                this.$vertexcontext.find('.Feature').hide();
                this.$vertexcontext.find('.Vertex').show();
            }
            else {
                if (mp instanceof MReference) {
                    var i = void 0;
                    var $refli = this.$vertexcontext.find('.refli.template');
                    for (i = 0; i < mp.mtarget.length; i++) {
                        var li = U.cloneHtml($refli[0], true);
                        li.classList.remove('template');
                        li.classList.add('dynamic');
                        li.dataset.index = '' + i;
                        var $li = $(li);
                        $li.find('.index').text('' + i);
                        $li.find('.text').text(mp.printableName());
                        $refli[0].parentNode.appendChild(li);
                    }
                    this.$vertexcontext.find('.Reference').show();
                }
                this.$vertexcontext.find('.Feature').show();
                this.$vertexcontext.find('.Vertex').hide();
            }
        }
    };
    DamContextMenuComponent.prototype.hide = function () {
        this.$html.slideUp();
    };
    DamContextMenuComponent.prototype.addEventListeners = function () {
        var html = this.html;
        var $html = $(html);
        console.log(this.clickTarget);
        var v = IVertex.getvertexByHtml(this.clickTarget);
        var m = ModelPiece.getLogic(this.clickTarget);
        console.log('contextMenu target:', this.clickTarget, 'modelPiece:', m);
        U.pe(!v, 'vertex null:', v);
        $html.find('li.refli.dynamic').off('click.setref').on('click.setref', function (e) {
            var index = +e.currentTarget.dataset.index;
            IVertex.linkVertexMouseDown(null, m.edges[index]);
        });
        $html.find('button.refli.delete').off('click.setref').on('click.setref', function (e) {
            e.preventDefault();
            e.stopPropagation(); // impedisco di nascondere il contextmenù per tanto poco
            var li = e.currentTarget.parentNode;
            var index = li.dataset.index;
            $(li).find('.text').text(m.printableName());
            U.pe(!index || U.isNumber(index), 'failed to get index.');
            IVertex.linkVertexMouseDown(null, m.edges[index]);
        });
        $html.find('.Vertex.duplicate').off('click.ctxMenu').on('click.ctxMenu', function (e) { m.duplicate('_Copy', m.parent); });
        $html.find('.Vertex.delete').off('click.ctxMenu').on('click.ctxMenu', function (e) { m.delete(); });
        $html.find('.Vertex.minimize').off('click.ctxMenu').on('click.ctxMenu', function (e) { v.minimize(); });
        $html.find('.Vertex.up').off('click.ctxMenu').on('click.ctxMenu', function (e) { m.pushDown(); v.pushUp(); }); // must be opposites
        $html.find('.Vertex.down').off('click.ctxMenu').on('click.ctxMenu', function (e) { m.pushUp(); v.pushDown(); }); // must be opposites
        $html.find('.Vertex.editStyle').off('click.ctxMenu').on('click.ctxMenu', function (e) { U.pw(true, 'deprecato'); /*StyleEditor.editor.show(m);*/ });
        $html.find('.Feature.autofix').off('click.ctxMenu').on('click.ctxMenu', function (e) { alert('autofix conformity: todo.'); });
        $html.find('.Feature.autofixinstances').off('click.ctxMenu').on('click.ctxMenu', function (e) { alert('autofix instances: todo.'); });
        $html.find('.Feature.duplicate').off('click.ctxMenu').on('click.ctxMenu', function (e) { m.duplicate('_Copy', m.parent); });
        $html.find('.Feature.delete').off('click.ctxMenu').on('click.ctxMenu', function (e) { m.delete(); });
        $html.find('.Feature.minimize').off('click.ctxMenu').on('click.ctxMenu', function (e) { v.minimize(); });
        $html.find('.Feature.up').off('click.ctxMenu').on('click.ctxMenu', function (e) { m.pushUp(); v.refreshGUI(); });
        $html.find('.Feature.down').off('click.ctxMenu').on('click.ctxMenu', function (e) { m.pushDown(); v.refreshGUI(); });
        $html.find('.Feature.link').off('click.ctxMenu').on('click.ctxMenu', function (e) {
            var index = e.currentTarget.dataset.edgeindex;
            var r = m;
            var edge = r.edges[index];
            if (!edge)
                new IEdge(r, index, null, null);
            IVertex.linkVertexMouseDown(null, edge); /*StyleEditor.editor.show(m); */
        });
    };
    DamContextMenuComponent.prototype.checkIfHide = function (e) {
        var originalTarget = e.target;
        var cond = true; // !U.isParentOf(this.html, originalTarget);
        if (cond) {
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