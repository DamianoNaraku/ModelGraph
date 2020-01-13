import { Component, OnInit } from '@angular/core';
import {
  IPackage,
  IVertex,
  Size,
  StyleEditor,
  U,
  M2Class,
  Point,
  ModelPiece,
  IFeature,
  IReference,
  IAttribute,
  IClass, ExtEdge, IEdge, IClassifier, IModel
} from '../../common/Joiner';
import ClickEvent = JQuery.ClickEvent;
import ContextMenuEvent = JQuery.ContextMenuEvent;

@Component({
  selector: 'app-dam-context-menu',
  templateUrl: './dam-context-menu.component.html',
  styleUrls: ['./dam-context-menu.component.css']
})

export class DamContextMenuComponent implements OnInit {
  static contextMenu: DamContextMenuComponent = null;
  private html: HTMLElement = null;
  private $html: JQuery<HTMLElement> = null;
  // private currentlyOpened: HTMLElement = null;
  private clickTarget: HTMLElement | SVGElement;
  private $vertexcontext: JQuery<HTMLUListElement>;
  private $edgecontext: JQuery<HTMLUListElement>;
  private $extedgecontext: JQuery<HTMLUListElement>;
  private vertexcontext: HTMLUListElement;
  private edgecontext: HTMLUListElement;
  private extedgecontext: HTMLUListElement;
  static staticInit() {
    DamContextMenuComponent.contextMenu = new DamContextMenuComponent();
  }
  constructor() {
    this.$html = $('#damContextMenuTemplateContainer');
    this.html = this.$html[0];
    $(document).off('click.hideContextMenu').on('click.hideContextMenu', (e: ClickEvent) => this.checkIfHide(e));
    this.$vertexcontext = this.$html.find('ul.vertex') as JQuery<HTMLUListElement>;
    this.$edgecontext = this.$html.find('ul.edge') as JQuery<HTMLUListElement>;
    this.$extedgecontext = this.$html.find('ul.extedge') as JQuery<HTMLUListElement>;
    this.vertexcontext = this.$vertexcontext[0];
    this.edgecontext = this.$edgecontext[0];
    this.extedgecontext = this.$extedgecontext[0];
    this.$html.on('contextmenu', (e: ContextMenuEvent): boolean => { e.preventDefault(); e.stopPropagation(); return false; });
  }

  ngOnInit() { }

  show(location: Point, classSelector: string, target: HTMLElement | SVGElement) {
    U.pe(!target, 'target is null.');
    this.clickTarget = target;
    this.addEventListeners(); // must be done here, per facilità di fare binding usando variabili esterne agli eventi.
    this.html.style.display = 'none'; // if was already displaying, start the scrollDown animation without doing the scrollUp()
    this.$html.slideDown();
    const vertex: IVertex = IVertex.getvertexByHtml(target);

    let edge: IEdge = IEdge.getByHtml(target);
    let extedge: ExtEdge = null;
    if (edge instanceof ExtEdge) { extedge = edge; edge = null; }

    console.log('contextmenu target:', this.clickTarget);

    const templateSize: Size = U.sizeof(this.html);
    // todo:
    const viewPortSize: Size = new Size(0, 0, window.innerWidth, window.innerHeight);
    location.x = Math.max(0, location.x );
    location.y = Math.max(0, location.y );
    location.x = Math.min(viewPortSize.w - (templateSize.w), location.x );
    console.log('vp.w:', viewPortSize.w, ' - t.w:', templateSize.w, ', loc.x', location.x, ', t.size:', templateSize, this.html);
    location.y = Math.min(viewPortSize.h - (templateSize.h), location.y );
    this.html.style.position = 'absolute';
    this.html.style.zIndex = '1000';
    this.html.style.left = '' + location.x + 'px';
    this.html.style.top = '' + location.y + 'px';
    this.extedgecontext.style.display = 'none';
    this.edgecontext.style.display  = 'none';
    this.vertexcontext.style.display = 'none';
    this.edgecontext.style.display = edge ? '' : 'none';
    this.extedgecontext.style.display = extedge ? '' : 'none';
    this.vertexcontext.style.display = vertex ? '' : 'none';
    if (vertex) {
      const mp: ModelPiece = ModelPiece.getLogic(target);
      const model: IModel = mp.getModelRoot();
      if (model.isM1()) {
        this.$vertexcontext.find('.m1hide').hide();
        this.$vertexcontext.find('.m2hide').show(); }
      else {
        this.$vertexcontext.find('.m1hide').show();
        this.$vertexcontext.find('.m2hide').hide(); }

      if (mp instanceof IClassifier) {
        this.$vertexcontext.find('.Feature').hide();
        this.$vertexcontext.find('.Vertex').show();
      }
      else {
        this.$vertexcontext.find('.Feature').show();
        this.$vertexcontext.find('.Vertex').hide();
      }
    }

  }
  hide(): void {
    this.$html.slideUp();
  }

  private addEventListeners() {
    const html = this.html;
    const $html = $(html);
    console.log(this.clickTarget);
    const v: IVertex = IVertex.getvertexByHtml(this.clickTarget);
    const m: ModelPiece = ModelPiece.getLogic(this.clickTarget);
    console.log('contextMenu target:', this.clickTarget, 'modelPiece:', m);
    U.pe(!v, 'vertex null:', v);
    $html.find('.Vertex.duplicate').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { m.duplicate('_Copy', m.parent); });
    $html.find('.Vertex.delete').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { m.delete(); });
    $html.find('.Vertex.minimize').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { v.minimize(); });
    $html.find('.Vertex.up').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { v.pushUp(); });
    $html.find('.Vertex.down').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { v.pushDown(); });
    $html.find('.Vertex.editStyle').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { U.pw(true, 'deprecato'); /*StyleEditor.editor.show(m);*/ });

    $html.find('.Feature.duplicate').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { m.duplicate('_Copy', m.parent); });
    $html.find('.Feature.delete').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { m.delete(); });
    $html.find('.Feature.minimize').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { v.minimize(); });
    $html.find('.Feature.up').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { v.pushUp(); });
    $html.find('.Feature.down').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { v.pushDown(); });
    $html.find('.Feature.editStyle').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { U.pw(true, 'deprecato'); /*StyleEditor.editor.show(m); */});

  }
  private checkIfHide(e: ClickEvent) {
    const originalTarget: HTMLElement = e.target;
    const cond: boolean = true; // !U.isParentOf(this.html, originalTarget);
    if (cond) { this.hide(); }
  }
}
