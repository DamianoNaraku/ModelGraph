import {
  U,
  IModel,
  IPackage,
  IAttribute,
  IClass,
  IReference,
  ModelPiece,
  AttribETypes,
  Status,
  StyleEditor,
  MAttribute, MReference, MPackage, Model, MClass
} from '../common/Joiner';
import {container} from '@angular/core/src/render3';
import ClickEvent = JQuery.ClickEvent;
import {ShortAttribETypes} from '../common/util';
import {selectValueAccessor} from '@angular/forms/src/directives/shared';
import {EType} from '../Model/MetaMetaModel';
import {type} from 'os';

export class PropertyBarr {
  model: IModel = null;
  container: HTMLElement;
  rawTextArea: HTMLTextAreaElement;
  templateContainer: HTMLElement;
  selectedModelPiece: ModelPiece;
  styleEditor: StyleEditor = null;
  constructor(model: IModel) {
    this.model = model;
    this.selectedModelPiece = null;
    // todo: model.graph.    shell = null
    const $root: JQuery<HTMLElement | SVGElement> = this.get$root();
    this.container = $root.find('#propertySidebarCurrentContent')[0] as HTMLElement;
    this.templateContainer = $root.find('#propertySidebarTemplates')[0] as HTMLElement;
    U.pe( !this.container, 'property bar shell not found in: ', $root);
    U.pe( !this.templateContainer, 'property bar template shell not found in: ', $root);
    this.styleEditor = new StyleEditor(this, $root);
  }
  static AddEventListeners(html: HTMLElement): void {
    const $html = $(html);
    $html.find('.minimizer').off('click.minimizeTemplate').on('click.minimizeTemplate',
      (e: ClickEvent) => {PropertyBarr.templateMinimizerClick(e); });
  }

  static templateMinimizerClick(e: ClickEvent): void {
    const minimizer: HTMLElement = e.currentTarget;
    let template: HTMLElement = minimizer;
    while ( !template.classList.contains('template')) {template = template.parentNode as HTMLElement; }
    template.classList.add('minimized');
    $(template).off('click.maximizeTemplate').on('click.maximizeTemplate',
      (ee: ClickEvent) => { PropertyBarr.templateMaximizerClick(ee); });
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault(); }

  static templateMaximizerClick(e: ClickEvent): void {
    const template: HTMLElement = e.currentTarget;
    template.classList.remove('minimized'); }
  static getcopy(node: HTMLElement, selector: string): HTMLElement { return U.cloneHtml($(node).find(selector)[0]); }

  static makeClassListSelector(m: IModel, selectHtml: HTMLSelectElement, selectedClass: IClass): HTMLSelectElement {
    // const m: IModel = o.getModelRoot();
    if (!m) {m = Status.status.mm; }
    U.pe(m.isM(), 'should not be used for models.');
    if (selectHtml === null) { selectHtml = document.createElement('select'); }
    const classes: IClass[] = m.getAllClasses();
    const optgrp: HTMLOptGroupElement = document.createElement('optgroup');
    optgrp.label = 'Classes';
    selectHtml.appendChild(optgrp);
    let optionFound = false;
    let i;
    for ( i = 0; i < classes.length; i++) { // todo wrong
      const opt: HTMLOptionElement = document.createElement('option');
      opt.value = classes[i].fullname;
      opt.innerHTML = classes[i].fullname;
      if (selectedClass && classes[i].fullname === selectedClass.fullname) { opt.selected = true; optionFound = true; }
      optgrp.appendChild(opt);
    }
    U.pe(!optionFound, 'reference selected class option not found; optgrp:', optgrp, 'classes:', classes, ', searching:', selectedClass);
    return selectHtml; }

  static fixPrimitiveTypeSelectors(): void {
    const $selectors = $('....');
    const selectors: HTMLSelectElement[] = $selectors[0];
    let i = -1;
    while (++i < selectors.length) {
      get attrib and type from html.

      controlal se c'è una opzione selected (facile, se è selezionata la prima senza il tag selected="true", allora è selected di default per sbaglio.
        aggiusta solo quelli settati per sbaglio (saranno gli attrib dei vertici)
      selectors[i]
    }
  }
  static makePrimitiveTypeSelector(selectHtml: HTMLSelectElement, selectedType: EType): HTMLSelectElement {
    if (selectHtml === null) { selectHtml = document.createElement('select'); }
    const optgrp: HTMLOptGroupElement = document.createElement('optgroup');
    optgrp.label = 'Primitive Types';
    selectHtml.appendChild(optgrp);
    let optionFound = false;
    // const extendedAttribETypes = U.getExtendedAttribETypes();
    for (const typestr in EType.shorts) {
      if (!EType.shorts[typestr]) { continue; }
      const type: EType = EType.shorts[typestr];
      // if (! AttribETypes[type] ) { continue; } // ide requires a filter
      const opt: HTMLOptionElement = document.createElement('option');
      opt.value = type.short;
      opt.innerHTML = type.name;
      // if (selectedType) { console.log(type, '===', selectedType, ' ? => ', (selectedType && type === selectedType));
      // } else { console.log('not selecting any type.'); }
      if (selectedType && type === selectedType) { opt.selected = true; optionFound = true; }
      optgrp.appendChild(opt);
    }
    U.pe(selectedType && !optionFound, 'attribute primitive selected class option not found; optgrp:', optgrp,
      ' attribETypes:', AttribETypes, 'typeArrSearchShort:', EType.shorts, ', searchedVal:', selectedType);
    return selectHtml; }
  addEventListeners(): void { PropertyBarr.AddEventListeners(this.container); }
  private get$root(): JQuery<HTMLElement | SVGElement> {
    let TabRootHtml: HTMLElement | SVGElement = this.model.graph.container;
    console.log('TabRootHtml:', TabRootHtml);
    while (!TabRootHtml.classList.contains('UtabContent')) { TabRootHtml = TabRootHtml.parentNode as HTMLElement | SVGElement; }
    // if (this.model === Status.status.mm) { $root = $('#mmproperty_sidebar'); } else { $root = $('mproperty_sidebar'); }
    const $ret = $(TabRootHtml).find('.propertyBarContainer');
    U.pe($ret.length !== 1, 'pbar container not found:', $ret);
    return $ret; }
  tryUpdatingRaws() { this.updateRaw(this.selectedModelPiece); }
  updateRaw(o: ModelPiece): void {
    if (!o) { return; }
    this.selectedModelPiece = o;
    const $root = this.get$root();
    const textArea = this.rawTextArea = $root.find('.rawecore')[0] as HTMLTextAreaElement;
    if (!textArea) { return; }
    textArea.value = o.generateModelString(); }

  show(o: ModelPiece): void {
    this.selectedModelPiece = o;
    console.log('PropertyBar.show: ', o);
    this.styleEditor.show(o);
    this.showCommon(o);
    if (o instanceof Model) { this.container.append(this.getM(o, this.templateContainer));
    } else if (o instanceof MPackage) { this.container.append(this.getP_M(o, this.templateContainer));
    } else if (o instanceof MClass) { this.container.append(this.getC_M(o, this.templateContainer));
    } else if (o instanceof MAttribute) { this.container.append(this.getA_M(o, this.templateContainer));
    } else if (o instanceof MReference) { this.container.append(this.getR_M(o, this.templateContainer));
    } else if (o instanceof IModel) { this.container.append(this.getMM(o, this.templateContainer));
    } else if (o instanceof IPackage) { this.container.append(this.getP(o, this.templateContainer));
    } else if (o instanceof IClass) { this.container.append(this.getC(o, this.templateContainer));
    } else if (o instanceof IAttribute) { this.container.append(this.getA(o, this.templateContainer));
    } else if (o instanceof IReference) { this.container.append(this.getR(o, this.templateContainer));
    } else { U.pe(true, 'invalid ModelPiece type instance: ', o); }
    this.addEventListeners();
  }
  private showM(o: IModel): void {
    this.container.append(this.getMM(o, this.templateContainer));
    this.addEventListeners();
  }
  private showP(o: IPackage): void {
    this.container.append(this.getP(o, this.templateContainer));
    this.addEventListeners();
  }
  private showCommon(o: ModelPiece) {
    this.updateRaw(o);
    U.clear(this.container); }
  private showC(o: IClass): void {
    this.showCommon(o);
    this.container.append(this.getC(o, this.templateContainer));
    this.addEventListeners(); }
  private showR(o: IReference): void {
    this.showCommon(o);
    this.container.append(this.getR(o, this.templateContainer));
    this.addEventListeners(); }
  private showA(o: IAttribute): void {
    this.showCommon(o);
    this.container.append(this.getA(o, this.templateContainer));
    this.addEventListeners(); }
  private getMM(o: IModel, templateContainer: HTMLElement): HTMLElement {
    const html: HTMLElement = PropertyBarr.getcopy(templateContainer, '#mmodelTemplate');
    const $html = $(html);
    const nameHtml = ($html.find('input.modelName')[0] as HTMLInputElement);
    const nsHtml = ($html.find('input.namespace')[0] as HTMLInputElement);
    const uriHtml = ($html.find('input.uri')[0] as HTMLInputElement);
    nameHtml.value = o.name ? o.name : '';
    nsHtml.value = o.namespace();
    uriHtml.value = o.uri();
    $(nameHtml).off('change.pbar').on('change.pbar', (e: Event) => { o.setName(nameHtml.value); });
    $(uriHtml).off('change.pbar').on('change.pbar', (e: Event) => { o.setUri(uriHtml.value); });
    $(nsHtml).off('change.pbar').on('change.pbar', (e: Event) => { o.setNamespace(nsHtml.value); });
    const pkgListHtml = ($html.find('.packageList')[0]);
    let i;
    for (i = 0; i < o.childrens.length; i++) { pkgListHtml.appendChild(this.getP(o.childrens[i] as IPackage, templateContainer)); }
    return html;
  }
  private getM(o: Model, templateContainer: HTMLElement): HTMLElement {
    const html: HTMLElement = PropertyBarr.getcopy(templateContainer, '#modelTemplate');
    const $html = $(html);
    const nameHtml = ($html.find('input.modelName')[0] as HTMLInputElement);
    const nsHtml = ($html.find('input.namespace')[0] as HTMLInputElement);
    const uriHtml = ($html.find('input.uri')[0] as HTMLInputElement);
    nameHtml.value = o.name ? o.name : '';
    nsHtml.value = o.namespace();
    uriHtml.value = o.uri();
    $(nameHtml).off('change.pbar').on('change.pbar', (e: Event) => { o.setName(nameHtml.value, false); });
    $(uriHtml).off('change.pbar').on('change.pbar', (e: Event) => { o.setUri(uriHtml.value); });
    $(nsHtml).off('change.pbar').on('change.pbar', (e: Event) => { o.setNamespace(nsHtml.value); });
    const pkgListHtml = ($html.find('.packageList')[0]);
    let i;
    for (i = 0; i < o.childrens.length; i++) { pkgListHtml.appendChild(this.getP_M(o.childrens[i] as MPackage, templateContainer)); }
    return html;
  }
  private getP(o: IPackage, templateContainer: HTMLElement): HTMLElement {
    const html: HTMLElement = PropertyBarr.getcopy(templateContainer, '#packageTemplate');
    const $html = $(html);
    const classListHtml = ($html.find('.classList')[0]);
    let i;
    for (i = 0; i < o.childrens.length; i++) { classListHtml.appendChild(this.getC(o.childrens[i] as IClass, templateContainer)); }
    // package own properties (sembra ci sia solo il name)
    const nameHtml = ($html.find('input.packageName')[0] as HTMLInputElement);
    nameHtml.value = o.name;
    $(nameHtml).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        console.log('value:', input.value, 'inputHtml:', input, 'evt:', evt);
        o.setName(input.value, false);
      });
    return html; }
  private getP_M(o: MPackage, templateContainer: HTMLElement): HTMLElement {
    const html: HTMLElement = PropertyBarr.getcopy(templateContainer, '#mpackageTemplate');
    const $html = $(html);
    const classListHtml = ($html.find('.classList')[0]);
    let i;
    for (i = 0; i < o.childrens.length; i++) { classListHtml.appendChild(this.getC_M(o.childrens[i] as MClass, templateContainer)); }
    return html; }
  private getC(o: IClass, templateContainer: HTMLElement): HTMLElement {
    const html: HTMLElement = PropertyBarr.getcopy(templateContainer, '#classTemplate');
    const $html = $(html);
    let i;
    const attribListHtml = ($html.find('.attributeList')[0]);
    for (i = 0; i < o.attributes.length; i++) { attribListHtml.appendChild(this.getA(o.attributes[i], templateContainer)); }
    const refListHtml = ($html.find('.referenceList')[0]);
    for (i = 0; i < o.references.length; i++) { refListHtml.appendChild(this.getR(o.references[i], templateContainer)); }
    // class own properties (sembra ci sia solo il name)
    const nameHtml = ($html.find('input.className')[0] as HTMLInputElement);
    nameHtml.value = o.name;
    $(nameHtml).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        o.setName(input.value, true);
      });
    return html; }
  private getR(o: IReference, templateContainer: HTMLElement): HTMLElement {
    const model: IModel = o.getModelRoot();
    if (model.isM()) { return this.getR_M(o, templateContainer); }
    const html: HTMLElement = PropertyBarr.getcopy(templateContainer, '#referenceTemplate');
    const $html = $(html);
    // todo ref own properties
    const nameHtml = ($html.find('input.referenceName')[0] as HTMLInputElement);
    nameHtml.value = o.name;

    const htmlUpperBound = ($html.find('input.referenceUpperBound')[0] as HTMLInputElement);
    if (o.upperbound !== null) { htmlUpperBound.value = '' + o.upperbound; } else { htmlUpperBound.placeholder = '1'; }
    const htmlLowerBound = ($html.find('input.referenceUpperBound')[0] as HTMLInputElement);
    if (o.lowerbound !== null) { htmlLowerBound.value = '' + o.lowerbound; } else { htmlLowerBound.placeholder = '1'; }
    const htmlContainment = ($html.find('input.referenceContainment')[0] as HTMLInputElement);
    if (o.containment !== null) { htmlContainment.checked = o.containment; } else { htmlContainment.checked = false; }
    let selectType = null;
    selectType = $html.find('select.referenceType')[0] as HTMLSelectElement;
    U.clear(selectType);
    PropertyBarr.makeClassListSelector(model, selectType, o.target);
    $(selectType).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLSelectElement = (evt.currentTarget as HTMLSelectElement);
        o.link(target.value); } );
    // todo: add events on change
    $(nameHtml).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        o.setName(input.value, true);
      });
    $(htmlContainment).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        o.setContainment(target.checked);
        o.refreshGUI();
      });
    $(htmlUpperBound).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        o.setUpperBound(+target.value);
        o.refreshGUI();
      });
    $(htmlLowerBound).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        o.setLowerBound(+target.value);
        o.refreshGUI();
      });
    return html; }
  private getA(o: IAttribute, templateContainer: HTMLElement): HTMLElement {
    const html: HTMLElement = PropertyBarr.getcopy(templateContainer, '#attributeTemplate');
    const $html = $(html);
    const nameHtml = ($html.find('input.attributeName')[0] as HTMLInputElement);
    nameHtml.value = o.name;
    $(nameHtml).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        o.setName(input.value, true);
      });
    const model: IModel = o.getModelRoot();
    const selectType = ($html.find('select.attributeType')[0] as HTMLSelectElement);
    U.clear(selectType);
    PropertyBarr.makePrimitiveTypeSelector(selectType, o.getType());
    $(selectType).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLSelectElement = (evt.currentTarget as HTMLSelectElement);
        o.setType(EType.get(target.value as ShortAttribETypes));
        o.refreshGUI(); } );
    return html; }
  private getC_M(o: MClass, templateContainer: HTMLElement): HTMLElement {
    const html: HTMLElement = PropertyBarr.getcopy(templateContainer, '#mclassTemplate');
    const $html = $(html);
    let i;
    const attribListHtml: HTMLElement = ($html.find('.attributeList')[0]);
    for (i = 0; i < o.attributes.length; i++) { attribListHtml.appendChild(this.getA_M(o.attributes[i] as MAttribute, templateContainer)); }
    const refListHtml: HTMLElement = ($html.find('.referenceList')[0]);
    for (i = 0; i < o.references.length; i++) { refListHtml.appendChild(this.getR_M(o.references[i], templateContainer)); }
    // class own properties (sembra ci sia solo il name)
    const nameHtml: HTMLInputElement = ($html.find('input.className')[0] as HTMLInputElement);
    const isRoot: HTMLInputElement = ($html.find('input.isRoot')[0]) as HTMLInputElement;
    isRoot.disabled = isRoot.checked = o.isRoot();
    nameHtml.value = o.metaParent.name;
    nameHtml.disabled = true;
    $(isRoot).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        if (!input.checked) { input.checked = true; return; }
        o.setRoot(input.checked);
        o.refreshGUI();
        this.refreshGUI();
      });
    return html; }
  private getR_M(o: MReference, templateContainer: HTMLElement): HTMLElement {
    // const model: IModel = o.getModelRoot();
    // if (model.isMM()) { return this.getR_M(o, templateContainer); }
    const html: HTMLElement = PropertyBarr.getcopy(templateContainer, '#mreferenceTemplate');
    // const $html = $(html);
    return html; }
  private getA_M(o: MAttribute, templateContainer: HTMLElement): HTMLElement {
    const html: HTMLElement = PropertyBarr.getcopy(templateContainer, '#mattributeTemplate');
    const $html = $(html);
    const nameHtml = ($html.find('input.attributeName')[0] as HTMLInputElement);
    const typeHtml = ($html.find('select.attributeType')[0] as HTMLSelectElement);
    const valueHtml = ($html.find('.attributeValue')[0] as HTMLInputElement);
    PropertyBarr.makePrimitiveTypeSelector(typeHtml, o.getType());
    nameHtml.value = o.metaParent.name;
    nameHtml.disabled = typeHtml.disabled = true;
    valueHtml.value = o.getValueStr();
    // $(typeHtml).off('change.pbar').on('change.pbar', (e: Event) => { o.refreshGUI(); });
    $(valueHtml).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        o.setValueStr(input.value);
        o.refreshGUI();
      });
    return html;
  }

  refreshGUI() { this.show(this.selectedModelPiece); }
}
