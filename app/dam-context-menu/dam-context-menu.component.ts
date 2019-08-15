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
  IClass
} from '../common/Joiner';
import ClickEvent = JQuery.ClickEvent;

@Component({
  selector: 'app-dam-context-menu',
  templateUrl: './dam-context-menu.component.html',
  styleUrls: ['./dam-context-menu.component.css']
})

export class DamContextMenuComponent implements OnInit {
  static contextMenu: DamContextMenuComponent = null;
  private templateContainer: HTMLElement = null;
  private $templateContainer: JQuery<HTMLElement> = null;
  private currentlyOpened: HTMLElement = null;
  private clickTarget: HTMLElement | SVGElement;
  static staticInit() {
    DamContextMenuComponent.contextMenu = new DamContextMenuComponent();
  }
  constructor() {
    this.$templateContainer = $('#damContextMenuTemplateContainer');
    this.templateContainer = this.$templateContainer[0];
    $(document).off('click.hideContextMenu').on('click.hideContextMenu', (e: ClickEvent) => this.checkIfHide(e));
  }

  ngOnInit() { }

  show(location: Point, classSelector: string, target: HTMLElement | SVGElement) {
    U.pe(!target, 'target is null.');
    this.clickTarget = target;
    console.log('clicktarget:', this.clickTarget);
    const templateSelector = '#MM_VertexContextMenu';
    this.hide();
    const $current = this.$templateContainer.find(templateSelector);
    U.pe($current.length !== 1, 'Unable to find a single template with contextMenu selector:', templateSelector,
      '. templateList:', this.templateContainer, ', found:', $current);
    this.currentlyOpened = U.cloneHtml($current[0]);
    this.currentlyOpened.id = 'currentlyOpenedContextMenu';
    const $currentlyOpened = $(this.currentlyOpened);
    console.log('hide:', $currentlyOpened.find('ul.contextMenu>li').hide());
    $currentlyOpened.find(classSelector).show();
    console.log('original:', $current[0], 'cloned:', this.currentlyOpened);
    document.body.appendChild(this.currentlyOpened);
    this.currentlyOpened.style.display = 'inline-block';
    const templateSize: Size = U.sizeof(this.currentlyOpened);
    // todo:
    const viewPortSize: Size = new Size(0, 0, window.innerWidth, window.innerHeight);
    location.x = Math.max(0, location.x );
    location.y = Math.max(0, location.y );
    location.x = Math.min(viewPortSize.w - (templateSize.w), location.x );
    console.log('vp.w:', viewPortSize.w, ' - t.w:', templateSize.w, ', loc.x', location.x, ', t.size:', templateSize, this.currentlyOpened);
    location.y = Math.min(viewPortSize.h - (templateSize.h), location.y );
    this.currentlyOpened.style.position = 'absolute';
    this.currentlyOpened.style.zIndex = '1000';
    this.currentlyOpened.style.left = '' + location.x + 'px';
    this.currentlyOpened.style.top = '' + location.y + 'px';
    console.log('contextMenu.show() = ', this.currentlyOpened);
    this.addEventListeners();
  }
  hide(): void {
    $('#currentlyOpenedContextMenu').remove();
    if (!this.currentlyOpened) { return; }
    const parent = this.currentlyOpened.parentNode;
    if (parent === this.templateContainer) {
      parent.removeChild(this.currentlyOpened);
      this.templateContainer.appendChild(this.currentlyOpened); }
    this.currentlyOpened = null;
  }

  private addEventListeners() {
    const html = this.currentlyOpened;
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
    if ( U.isParentOf(this.clickTarget, originalTarget)) { return; } else { this.hide(); }
  }
}
