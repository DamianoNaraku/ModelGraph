import { Component, OnInit } from '@angular/core';
import {
  IModel,
  U,
  IPackage,
  MetaModel,
  ModelPiece,
  Status,
  Dictionary,
  M2Class,
  MClass,
  MPackage,
  IClass,
  M3Class,
  M3Package, IGraph, IClassifier, EEnum
} from '../../common/Joiner';
import ClickEvent = JQuery.ClickEvent;


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
    this.htmls = this.loadDefaultHtmls(); }

  loadDefaultHtmls(): Dictionary<string, HTMLElement | SVGGElement> {
    console['' + 'trace']('refresh left iSidebar');
    // bug: todo: not refreshing quando cambio il nome di un m2class. però i classSelector si aggiornano.
    this.clear();
    let arr: IClassifier[];
    let i;
    this.htmls = {};
    /*if (false && false) {
      arr = this.model.childrens;
      for (i = 0; i < arr.length; i++) { this.htmls[arr[i].fullname()] = IPackage.defaultSidebarHtml(); } } */
    arr = this.model.getAllClasses();
    Array.prototype.push.apply(arr, this.model.getAllEnums());
    for (i = 0; i < arr.length; i++) { this.htmls[arr[i].fullname()] = arr[i].getSidebarHtml();  }
    this.updateAll();
    return this.htmls; }

  clear() {
    U.clear(this.packageContainer);
    U.clear(this.classContainer); }


  updateAll() {
    let i;
    const arr: IClassifier[] = this.model.getAllClasses();
    Array.prototype.push.apply(arr, this.model.getAllEnums());
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
    if (Status.status.getActiveModel().isMM()) { this.sidebarNodeClick0(e); } else { this.sidebarNodeClick0(e); } }

  sidebarNodeClick0(e: ClickEvent): void {
    console.log('sidebarNodeClick()');
    let html: HTMLElement | SVGElement = e.currentTarget;
    while (!html.dataset.modelPieceID) { html = html.parentNode as HTMLElement | SVGElement; }
    const metaParent = ModelPiece.getLogic(html);
    U.pe( !metaParent , 'the id does not match any class or package', e);
    const modelOfSidebar: IModel /*m3*/ = metaParent.getModelRoot();
    const modelOfGraph: IModel /*m2*/ = Status.status.getActiveModel();
    const graph: IGraph = modelOfGraph.graph; /*m2*/
    U.pe(!graph, 'invalid graph of model:', modelOfGraph);
    console.log('pre Add empty class');
    if ( metaParent instanceof IClass /*m3*/) { modelOfGraph.getDefaultPackage().addEmptyClass(metaParent); }
    else if ( metaParent instanceof EEnum /*m3*/) { modelOfGraph.getDefaultPackage().addEmptyEnum(); }
    else { U.pe(true, 'unxpected class type of metaparent:', metaParent); }
    console.log('addSidebarNodeClick done'); }

  updateNode(piece: ModelPiece, containerr: HTMLElement) {
    let html: HTMLElement = U.cloneHtml(this.htmls['' + piece.fullname()]);
    html = U.replaceVars<HTMLElement>(piece, html);
    piece.linkToLogic(html);
    this.addEventListeners(html);
    // const node: HTMLElement = ISidebar.createNodeContainer();
    // node.innerHTML = html;
    containerr.appendChild(html); }

  fullnameChanged(old: string, neww: string): void {
    if (!this.htmls[old]) { return; }
    this.htmls[neww] = this.htmls[old];
    delete this.htmls[old]; }
}

