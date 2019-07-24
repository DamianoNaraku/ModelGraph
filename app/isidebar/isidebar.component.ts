import { Component, OnInit } from '@angular/core';
import {IModel, U, IPackage, MetaModel, ModelPiece, Status, Dictionary, IClass, MClass, MPackage} from '../common/Joiner';
import ClickEvent = JQuery.ClickEvent;
import {GraphPoint} from '../mGraph/Vertex/iVertex';
import {Point} from '../mGraph/iGraph';


@Component({
  selector: 'app-isidebar',
  templateUrl: './isidebar.component.html',
  styleUrls: ['./isidebar.component.css']
})
export class IsidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
export class ISidebar {
  // mm: boolean = null;
  model: IModel;
  container: HTMLElement = null;
  packageContainer: HTMLElement = null;
  classContainer: HTMLElement = null;
  htmls: Dictionary<string /*ModelPiece.fullname*/, HTMLElement | SVGGElement> = null;
  // nodeContainer: HTMLDivElement = null;
  constructor(model: IModel, container: HTMLElement) {
    this.model = model;
    // this.mm = (model instanceof MetaModel);
    if (Status.status.mmm === this.model) { Status.status.mm.sidebar = this; } else  { Status.status.m.sidebar = this; }
    this.container = container;
    this.packageContainer = document.createElement('div');
    this.packageContainer.classList.add('sidebarPackageContainer');
    this.classContainer = document.createElement('div');
    this.classContainer.classList.add('sidebarClassContainer');
    this.container.appendChild(this.packageContainer);
    this.container.appendChild(this.classContainer);
    this.htmls = this.loadDefaultHtmls();
  }
  loadDefaultHtmls(): Dictionary<string, HTMLElement | SVGGElement> {
    this.clear();
    let arr: ModelPiece[] = null;
    let i;
    this.htmls = {};
    if (this.model !== Status.status.mmm && false) {// package is not shown for mmm (in the mm sidebar), per ora tolgo proprio i packages
      arr = this.model.getAllPackages();
      for (i = 0; i < arr.length; i++) { this.htmls[arr[i].fullname] = IPackage.defaultSidebarHtml(); }
    }
    arr = this.model.getAllClasses();
    for (i = 0; i < arr.length; i++) { this.htmls[arr[i].fullname] = IClass.defaultSidebarHtml();  }
    this.updateAll();
    return this.htmls; }
  clear() {
    U.clear(this.packageContainer);
    U.clear(this.classContainer);
  }


  updateAll() {
    let i;
    let arr: ModelPiece[] = null;
    if (false && this.model !== Status.status.mmm) {// package is not shown for mmm (in the mm sidebar), per ora tolgo proprio i packages
      U.clear(this.packageContainer);
      for (i = 0; i < arr.length; i++) { this.updateNode( arr[i], this.packageContainer); }
    }
    arr = this.model.getAllClasses();
    for (i = 0; i < arr.length; i++) { this.updateNode( arr[i], this.classContainer); }
  }

  addEventListeners(html: HTMLElement): void {
    const $html = $(html);
    $html.off('click.sidebarNode').on('click.sidebarNode', (e: ClickEvent) => {
      Status.status.getActiveModel().sidebar.sidebarNodeClick(e);
    });
  }
  sidebarNodeClick(e: ClickEvent): void {
    console.log('sidebarNodeClick()', Status.status.getActiveModel() === Status.status.mm, Status.status.getActiveModel());
    if (Status.status.getActiveModel().isMM()) { this.sidebarNodeClickMM(e); } else { this.sidebarNodeClickM(e); }
  }
  sidebarNodeClickMM(e: ClickEvent): void {
    console.log('sidebarNodeClick_MM()');
    let html: HTMLElement | SVGElement = e.currentTarget;
    while (!html.dataset.modelPieceID) { html = html.parentNode as HTMLElement | SVGElement; }
    const modelPiece = ModelPiece.getLogic(html);
    U.pe( !modelPiece , 'the id does not match any class or package', e);
    const modelOfSidebar = modelPiece.getModelRoot();
    const modelOfGraph = Status.status.getActiveModel();
    const graph = modelOfGraph.graph;
    U.pe(!graph, 'invalid graph of model:', modelOfGraph);
    const defaultPackage: IPackage = modelOfGraph.getDefaultPackage() as IPackage;
    console.log('pre Add empty class');
    if ( modelPiece instanceof IClass /*m3*/) { modelOfGraph.addEmptyClass(defaultPackage, modelPiece); } else
    if ( modelPiece instanceof IPackage /*m3*/) { modelOfGraph.addEmptyP(); } else {
      U.pe(true, 'unxpected class type of modelpiece:', modelPiece); }
    console.log('addSidebarNoeClick done');
    // todo: le classi aggiunte tramite sidebar non hanno parent.
  }

  sidebarNodeClickM(e: ClickEvent): void {
    console.log('sidebarNodeClick_M()');
    let html: HTMLElement | SVGElement = e.currentTarget;
    while (!html.dataset.modelPieceID) { html = html.parentNode as HTMLElement | SVGElement; }
    const modelPiece = ModelPiece.getLogic(html);
    U.pe( !modelPiece , 'the id does not match any class or package', e);
    const modelOfSidebar = modelPiece.getModelRoot();
    const modelOfGraph = Status.status.getActiveModel();
    const graph = modelOfGraph.graph;
    U.pe(!graph, 'invalid graph of model:', modelOfGraph, 'status:', Status.status);
    const defaultPackage: IPackage = modelOfGraph.childrens[0] as IPackage;
    if ( modelPiece instanceof IClass) { modelOfGraph.addClass(defaultPackage, modelPiece); }
    if ( modelPiece instanceof IPackage) { modelOfGraph.addEmptyP(); }
    // todo: le classi aggiunte tramite sidebar non hanno parent.
  }
  updateNode(piece: ModelPiece, container: HTMLElement) {
    let html: HTMLElement = U.cloneHtml(this.htmls['' + piece.fullname]);
    html = U.replaceVars<HTMLElement>(piece, html);
    piece.linkToLogic(html);
    this.addEventListeners(html);
    // const node: HTMLElement = ISidebar.createNodeContainer();
    // node.innerHTML = html;
    container.appendChild(html);
  }
  fullnameChanged(old: string, neww: string) {
    this.htmls[neww] = this.htmls[old];
    this.htmls[old] = undefined;
  }
}
export class SidebarElement {
  constructor() { }
}

