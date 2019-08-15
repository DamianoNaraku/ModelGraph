import {
  U,
  IModel,
  IPackage,
  IAttribute,
  M2Class,
  IReference,
  ModelPiece,
  AttribETypes,
  Status,
  StyleEditor, ShortAttribETypes, EType,
  MAttribute, MReference, MPackage, Model, MClass, IClass, MetaModel, M2Reference, M2Attribute, M2Package
} from '../common/Joiner';
import ClickEvent = JQuery.ClickEvent;

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
    let templatee: HTMLElement = minimizer;
    while ( !templatee.classList.contains('template')) { templatee = templatee.parentNode as HTMLElement; }
    templatee.classList.add('minimized');
    $(templatee).off('click.maximizeTemplate').on('click.maximizeTemplate',
      (ee: ClickEvent) => { PropertyBarr.templateMaximizerClick(ee); });
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault(); }

  static templateMaximizerClick(e: ClickEvent): void {
    const templatee: HTMLElement = e.currentTarget;
    templatee.classList.remove('minimized'); }
  static getcopy(node: HTMLElement, selector: string): HTMLElement { return U.cloneHtml($(node).find(selector)[0]); }

  static makeClassListSelector(m: MetaModel, selectHtml: HTMLSelectElement, selectedClass: M2Class): HTMLSelectElement {
    // const m: IModel = o.getModelRoot();
    if (!m || !m.isMM()) { m = Status.status.mm; }
    // U.pe(m.isM(), 'should not be used for models.');
    if (selectHtml === null) { selectHtml = document.createElement('select'); }
    const classes: M2Class[] = m.getAllClasses();
    const optgrp: HTMLOptGroupElement = document.createElement('optgroup');
    optgrp.label = 'Classes';
    selectHtml.appendChild(optgrp);
    let optionFound = false;
    let i;
    for ( i = 0; i < classes.length; i++) { // todo wrong
      const opt: HTMLOptionElement = document.createElement('option');
      opt.value = classes[i].fullname();
      opt.innerHTML = classes[i].fullname();
      if (selectedClass && classes[i].fullname() === selectedClass.fullname()) { opt.selected = true; optionFound = true; }
      optgrp.appendChild(opt);
    }
    U.pe(!optionFound, 'reference selected class option not found; optgrp:', optgrp, 'classes:', classes, ', searching:', selectedClass);
    return selectHtml; }

  static makePrimitiveTypeSelector(selectHtml: HTMLSelectElement, selectedType: EType): HTMLSelectElement {
    if (selectHtml === null) { selectHtml = document.createElement('select'); }
    const optgrp: HTMLOptGroupElement = document.createElement('optgroup');
    optgrp.label = 'Primitive Types';
    selectHtml.appendChild(optgrp);
    let optionFound = false;
    // const extendedAttribETypes = U.getExtendedAttribETypes();
    for (const typestr in EType.shorts) {
      if (!EType.shorts[typestr]) { continue; }
      const etype: EType = EType.shorts[typestr];
      // if (! AttribETypes[type] ) { continue; } // ide requires a filter
      const opt: HTMLOptionElement = document.createElement('option');
      opt.value = etype.short;
      opt.innerHTML = etype.name;
      // if (selectedType) { console.log(type, '===', selectedType, ' ? => ', (selectedType && type === selectedType));
      // } else { console.log('not selecting any type.'); }
      if (selectedType && etype === selectedType) { opt.selected = true; optionFound = true; }
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

  updateRaw(o: ModelPiece = null): void {
    const $root = this.get$root();
    const textArea = this.rawTextArea = $root.find('.rawecore')[0] as HTMLTextAreaElement;
    if (!textArea) { return; }
    textArea.value = o.generateModelString(); }

  show(o: ModelPiece = null): void {
    o = this.selectedModelPiece = o || this.selectedModelPiece;
    if (!o) { return; }
    console.log('PropertyBar.show: ', o);
    this.styleEditor.show(o);
    U.clear(this.container);
    this.updateRaw(o);
    if (false && false) {
    } else if (o instanceof Model) { this.container.append(this.getM_I(o, this.templateContainer));
    } else if (o instanceof MPackage) { this.container.append(this.getP_I(o, this.templateContainer));
    } else if (o instanceof MClass) { this.container.append(this.getC_I(o, this.templateContainer));
    } else if (o instanceof MAttribute) { this.container.append(this.getA_I(o, this.templateContainer));
    } else if (o instanceof MReference) { this.container.append(this.getR_I(o, this.templateContainer));

    } else if (o instanceof MetaModel) { this.container.append(this.getM_I(o, this.templateContainer));
    } else if (o instanceof M2Package) { this.container.append(this.getP_I(o, this.templateContainer));
    } else if (o instanceof M2Class) { this.container.append(this.getC_I(o, this.templateContainer));
    } else if (o instanceof M2Attribute) { this.container.append(this.getA_I(o, this.templateContainer));
    } else if (o instanceof M2Reference) { this.container.append(this.getR_I(o, this.templateContainer));
    } else { U.pe(true, 'invalid ModelPiece type instance: ', o); }
    this.addEventListeners();
  }

  private getM_I(o: IModel, templateContainer: HTMLElement): HTMLElement {
    const html: HTMLElement = PropertyBarr.getcopy(templateContainer, '.template.model');
    const $html = $(html);
    const nameHtml = ($html.find('input.modelName')[0] as HTMLInputElement);
    const nsHtml = ($html.find('input.namespace')[0] as HTMLInputElement);
    const uriHtml = ($html.find('input.uri')[0] as HTMLInputElement);
    nameHtml.value = o.name ? o.name : '';
    nsHtml.value = o.namespace();
    uriHtml.value = o.uri();
    $(nameHtml).off('change.pbar').on('change.pbar', (e: Event) => { o.setName(nameHtml.value); });
    $(uriHtml).off('change.pbar').on('change.pbar', (e: Event) => { o.uri(uriHtml.value); });
    $(nsHtml).off('change.pbar').on('change.pbar', (e: Event) => { o.namespace(nsHtml.value); });
    const pkgListHtml = ($html.find('.packageList')[0]);
    let i;
    for (i = 0; i < o.childrens.length; i++) { pkgListHtml.appendChild(this.getP_I(o.childrens[i], templateContainer)); }
    return html; }

  private getP_I(o: IPackage, templateContainer: HTMLElement): HTMLElement {
    const html: HTMLElement = PropertyBarr.getcopy(templateContainer, '.template.package');
    const $html = $(html);
    $html.find((Status.status.isM() ? '.m1' : '.m2') + 'disable').attr('disabled');
    $html.find((Status.status.isM() ? '.m1' : '.m2') + 'hide').hide();
    const classListHtml = ($html.find('.classList')[0]);
    let i: number;
    for (i = 0; i < o.childrens.length; i++) { classListHtml.appendChild(this.getC_I(o.childrens[i] as M2Class, templateContainer)); }
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

  private getC_I(o: IClass, templateContainer: HTMLElement): HTMLElement {
    const html: HTMLElement = PropertyBarr.getcopy(templateContainer, '.template.class');
    const $html = $(html);
    $html.find((Status.status.isM() ? '.m1' : '.m2') + 'disable').attr('disabled');
    $html.find((Status.status.isM() ? '.m1' : '.m2') + 'hide').hide();
    let i: number;
    const attribListHtml: HTMLElement = ($html.find('.attributeList')[0]);
    const refListHtml: HTMLElement = ($html.find('.referenceList')[0]);
    let featureHtml: HTMLElement;
    for (i = 0; i < o.attributes.length; i++) {
      if (o instanceof M2Class) { featureHtml = this.getA_I( (o as M2Class).attributes[i], templateContainer); }
      if (o instanceof MClass) { featureHtml = this.getA_I( (o as MClass).attributes[i], templateContainer); }
      attribListHtml.appendChild(featureHtml); }
    for (i = 0; i < o.references.length; i++) {
      if (o instanceof M2Class) { featureHtml = this.getR_I( (o as M2Class).references[i], templateContainer); }
      if (o instanceof MClass) { featureHtml = this.getR_I( (o as MClass).references[i], templateContainer); }
      refListHtml.appendChild(featureHtml); }

    // class own properties (sembra ci sia solo il name)
    const nameHtml = ($html.find('input.className')[0] as HTMLInputElement);

    // Se M2Class
    if (o instanceof M2Class) {
      nameHtml.value = o.name;
      $(nameHtml).off('change.pbar').on('change.pbar',
        (evt: Event) => {
          const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
          o.setName(input.value, true);
        });
      return html; }

    /// Se MClass
    const classe: MClass = o as MClass;
    const isRoot: HTMLInputElement = ($html.find('input.isRoot')[0]) as HTMLInputElement;
    isRoot.disabled = isRoot.checked = classe.isRoot();
    nameHtml.value = classe.metaParent.name;
    nameHtml.disabled = true;
    $(isRoot).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        if (!input.checked) { input.checked = true; return; }
        classe.setRoot(input.checked);
        classe.refreshGUI();
        this.refreshGUI();
      });
    return html; }

  private getR_I(o: IReference, templateContainer: HTMLElement): HTMLElement {
    const metamodel: MetaModel = o.getm2();
    const html: HTMLElement = PropertyBarr.getcopy(templateContainer, '.template.reference');
    const $html = $(html);
    $html.find((Status.status.isM() ? '.m1' : '.m2') + 'disable').attr('disabled');
    $html.find((Status.status.isM() ? '.m1' : '.m2') + 'hide').hide();
    // todo ref own properties
    const nameHtml = ($html.find('input.referenceName')[0] as HTMLInputElement);
    nameHtml.value = o.name;

    const htmlUpperBound = ($html.find('input.referenceUpperBound')[0] as HTMLInputElement);
    if (o.getUpperbound() !== null) { htmlUpperBound.value = '' + o.getUpperbound(); } else { htmlUpperBound.placeholder = '1'; }
    const htmlLowerBound = ($html.find('input.referenceUpperBound')[0] as HTMLInputElement);
    if (o.getLowerbound() !== null) { htmlLowerBound.value = '' + o.getLowerbound(); } else { htmlLowerBound.placeholder = '1'; }
    const htmlContainment = ($html.find('input.referenceContainment')[0] as HTMLInputElement);
    htmlContainment.checked = o.isContainment();
    const selectType = $html.find('select.referenceType')[0] as HTMLSelectElement;
    U.clear(selectType);
    PropertyBarr.makeClassListSelector(metamodel, selectType, o.getM2Target());

    if (o instanceof MReference) { return html; }
    const ref: M2Reference = o as M2Reference;
    $(selectType).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLSelectElement = (evt.currentTarget as HTMLSelectElement);
        ref.link(target.value); } );
    // todo: add events on change
    $(nameHtml).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        ref.setName(input.value, true);
      });
    $(htmlContainment).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        ref.setContainment(target.checked);
        ref.refreshGUI();
      });
    $(htmlUpperBound).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        ref.setUpperBound(+target.value);
        ref.refreshGUI();
      });
    $(htmlLowerBound).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        ref.setLowerBound(+target.value);
        ref.refreshGUI();
      });
    return html; }

  private getA_I(o: IAttribute, templateContainer: HTMLElement): HTMLElement {
    const html: HTMLElement = PropertyBarr.getcopy(templateContainer, '.attribute.template');
    const $html = $(html);
    $html.find((Status.status.isM() ? '.m1' : '.m2') + 'disable').attr('disabled');
    $html.find((Status.status.isM() ? '.m1' : '.m2') + 'hide').hide();
    const nameHtml: HTMLInputElement = ($html.find('input.attributeName')[0] as HTMLInputElement);
    const typeHtml: HTMLSelectElement = ($html.find('select.attributeType')[0] as HTMLSelectElement);
    U.clear(typeHtml);
    PropertyBarr.makePrimitiveTypeSelector(typeHtml, o.getType());
    // Se M2Attribute
    if (o instanceof M2Attribute) {
      nameHtml.value = o.name;
      $(nameHtml).off('change.pbar').on('change.pbar',
        (evt: Event) => {
          const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
          o.setName(input.value, true);
        });
      $(typeHtml).off('change.pbar').on('change.pbar',
        (evt: Event) => {
          const target: HTMLSelectElement = (evt.currentTarget as HTMLSelectElement);
          o.setType(EType.get(target.value as ShortAttribETypes));
          o.refreshGUI(); } );
      return html; }

    // Se MAttribute
    const attr: MAttribute = o as MAttribute;
    const valueHtml: HTMLInputElement = ($html.find('.attributeValue')[0] as HTMLInputElement);
    nameHtml.value = attr.metaParent.name;
    nameHtml.disabled = typeHtml.disabled = true;
    U.pe(!valueHtml, attr, $html, templateContainer);
    valueHtml.value = attr.getValueStr();
    $(valueHtml).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        attr.setValueStr(input.value);
        attr.refreshGUI();
      });
    return html; }

  refreshGUI() { this.show(this.selectedModelPiece); }
}
