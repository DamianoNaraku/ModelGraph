import {
  AttribETypes,
  EOperation,
  EParameter,
  EType,
  IAttribute,
  IClass, IClassChild,
  IModel,
  IPackage,
  IReference,
  M2Attribute,
  M2Class,
  M2Package,
  M2Reference,
  MAttribute,
  MClass,
  MetaModel,
  Model,
  ModelPiece,
  MPackage,
  MReference,
  OperationVisibility,
  ShortAttribETypes,
  Status,
  StyleEditor,
  U
} from '../../common/Joiner';
import ClickEvent = JQuery.ClickEvent;

export class PropertyBarr {
  model: IModel = null;
  container: HTMLElement;
  rawTextArea: HTMLTextAreaElement;
  templateContainer: HTMLElement;
  selectedModelPiece: ModelPiece;
  styleEditor: StyleEditor = null;
  selectedModelPieceIsEdge: boolean;
  clickedLevel: Element;

  constructor(model: IModel) {
    this.model = model;
    this.selectedModelPiece = null;
    // todo: model.graph.    shell = null
    const $root: JQuery<HTMLElement> = this.get$root();
    this.container = $root.find('.propertySidebarCurrentContent')[0] as HTMLElement;
    this.templateContainer = $root.find('.propertySidebarTemplates')[0] as HTMLElement;
    U.pe( !this.container, 'property bar shell not found in: ', $root);
    U.pe( !this.templateContainer, 'property bar template shell not found in: ', $root);
    this.styleEditor = new StyleEditor(this, $root); }

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
    const template: HTMLElement = e.currentTarget;
    template.classList.remove('minimized'); }

  static makeFullTypeSelector(html: HTMLSelectElement, primitiveType: EType = null, classType: M2Class = null, addVoid: boolean = false) {
    U.pe( (!!primitiveType && !!classType) || (!primitiveType && !classType) ,
      'exactly one between primitiveType and classType must be set.');
    PropertyBarr.makePrimitiveTypeSelector(html, primitiveType, addVoid);
    const $html: JQuery<HTMLElement> = $(html);
    const $optgroups = $html.find('optgroup');
    M2Class.updateMMClassSelector(html, classType, false, !!classType);
    $html.prepend($optgroups);
    U.pe($html.find('option[selected]').length !== 1, 'failed to find selected type:', primitiveType, classType, html);
    U.fixHtmlSelected($html);
    return html; }

  // todo: sostituisci: pbar.makeClassListSelector -> M2Class.ClassSelector, pbar.MakePrimitiveTypeSelector -> EType....
  static makeClassListSelector(m: MetaModel, selectHtml: HTMLSelectElement, selectedClass: M2Class): HTMLSelectElement {
    // const m: IModel = o.getModelRoot();
    if (!m || !m.isMM()) { m = Status.status.mm; }
    // U.pe(m.isM(), 'should not be used for models.');
    if (selectHtml === null) { selectHtml = document.createElement('select'); }
    U.clear(selectHtml);
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

  static makePrimitiveTypeSelector(selectHtml: HTMLSelectElement, selectedType: EType, addVoid: boolean = false): HTMLSelectElement {
    if (selectHtml === null) { selectHtml = document.createElement('select'); }
    U.clear(selectHtml);
    const optgrp: HTMLOptGroupElement = document.createElement('optgroup');
    optgrp.label = 'Primitive Types';
    selectHtml.appendChild(optgrp);
    let optionFound = false;
    // const extendedAttribETypes = U.getExtendedAttribETypes();
    for (const typestr in EType.shorts) {
      if (!EType.shorts[typestr]) { continue; }
      const etype: EType = EType.shorts[typestr];
      if (etype.short === ShortAttribETypes.void && !addVoid) { continue; }
      // if (! AttribETypes[type] ) { continue; } // ide requires a filter
      const opt: HTMLOptionElement = document.createElement('option');
      opt.value = etype.short;
      opt.innerHTML = etype.name;
      // if (selectedType) { console.log(type, '===', selectedType, ' ? => ', (selectedType && type === selectedType));
      // } else { console.log('not selecting any type.'); }
      if (selectedType && etype === selectedType) { opt.selected = true; optionFound = true; opt.setAttribute('selected', ''); }
      optgrp.appendChild(opt);  }

    U.pe(selectedType && !optionFound, 'attribute primitive selected class option not found; optgrp:', optgrp,
      ' attribETypes:', AttribETypes, 'typeArrSearchShort:', EType.shorts, ', searchedVal:', selectedType);
    return selectHtml; }

  private static makeVisibilitySelector(selectHtml: HTMLSelectElement, visibility: OperationVisibility): HTMLSelectElement {
    if (selectHtml === null) { selectHtml = document.createElement('select'); }
    U.clear(selectHtml);
    const optgrp: HTMLOptGroupElement = document.createElement('optgroup');
    optgrp.label = 'Access Modifier';
    selectHtml.appendChild(optgrp);
    let optionFound = false;
    for (const key in OperationVisibility) {
      if (!OperationVisibility[key]) { continue; }
      const access: string = OperationVisibility[key];
      const opt: HTMLOptionElement = document.createElement('option');
      opt.value = access;
      opt.innerHTML = access;
      if (visibility === access) { opt.selected = true; optionFound = true; }
      optgrp.appendChild(opt); }
    U.pe(visibility && !optionFound, 'OperationVisibility selected option not found; optgrp:', optgrp,
      'OperationVisibility:', OperationVisibility, ', searchedVal:', visibility);
    return selectHtml; }

  getTemplate(o: ModelPiece, selector: string = 'propertySidebarTemplates', root: HTMLElement = null): JQuery<HTMLElement> {
    // selector = '.propertySidebarTemplates';
    // if (!root) { root = this.templateContainer; }
    // const $html = $(U.cloneHtml<HTMLElement>($(root).find(selector)[0]));
    const html = U.cloneHtml<HTMLElement>(this.templateContainer);
    html.classList.remove('propertySidebarTemplates');
    html.classList.add('template');
    const $html = $(html);
    $html.find('.model, .package, .class, .attribute, .reference, .operation, .parameter').hide();
    $html.find('.replaceVarOn').each( (ii: number, elem: HTMLElement) => { U.replaceVars(o, elem, false); });
    let namestr: string;
    if (! (o instanceof IModel || o.getModelRoot().isMM()) ) { namestr = o.metaParent.name; } else { namestr = o.name; }
    $html.find('input.name').val(namestr)
      .off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        console.log('value:', input.value, 'inputHtml:', input, 'evt:', evt);
        input.value = o.setName(input.value, true);
      });
    $html.find('.replaceVarOn').each( (i: number, elem: HTMLElement) => { U.replaceVars(o, elem, false); });
    $html.find((Status.status.isM() ? '.m1' : '.m2') + 'disable').attr('disabled');
    $html.find((Status.status.isM() ? '.m1' : '.m2') + 'hide').hide();
    return $html; }

  get$root(): JQuery<HTMLElement> {
    let TabRootHtml: HTMLElement | SVGElement = this.model.graph.container;
    // console.log('TabRootHtml:', TabRootHtml);
    while (!TabRootHtml.classList.contains('UtabContent')) { TabRootHtml = TabRootHtml.parentNode as HTMLElement | SVGElement; }
    const $ret = $(TabRootHtml).find('.propertyBarContainer') as JQuery<HTMLElement>;
    U.pe($ret.length !== 1, 'pbar container not found:', $ret);
    return $ret; }

  updateRaw(o: ModelPiece = null): void {
    // o = o || this.selectedModelPiece;
    // if (!o) { return; }
    const $root = this.get$root();
    const textArea = this.rawTextArea = $root.find('.rawecore')[0] as HTMLTextAreaElement;
    if (!textArea) { return; }
    textArea.value = o.generateModelString(); }

  show(o: ModelPiece = null, clickedLevel: Element, isEdge: boolean, forceRefresh: boolean = true): void {
    if (!forceRefresh && this.selectedModelPiece === o && this.selectedModelPieceIsEdge === isEdge) {
      if (clickedLevel === this.clickedLevel) { return; }
      this.clickedLevel = clickedLevel = clickedLevel || this.clickedLevel;
      if (isEdge) { this.styleEditor.showE(o as IClass | IReference); } else { this.styleEditor.show(o, clickedLevel); }
      return; }
    this.clickedLevel = clickedLevel = clickedLevel || this.clickedLevel;
    if (isEdge) { this.styleEditor.showE(o as IClass | IReference); } else { this.styleEditor.show(o, clickedLevel); }
    o = this.selectedModelPiece = (o || this.selectedModelPiece);

    U.pe(!(o instanceof ModelPiece), 'invalid parameter type:', U.getTSClassName(o), o);
    this.selectedModelPieceIsEdge = isEdge;
    if (!o) { return; }
    console.log('PropertyBar.show: ', o);
    U.clear(this.container);
    if (false && false) {
    } else if (o instanceof IModel) { this.container.append(this.getM_I(o));
    } else if (o instanceof IPackage) { this.container.append(this.getP_I(o));
    } else if (o instanceof IClass) { this.container.append(this.getC_I(o));
    } else if (o instanceof IAttribute) { this.container.append(this.getA_I(o));
    } else if (o instanceof IReference) { this.container.append(this.getR_I(o));
    } else if (o instanceof EOperation) { this.container.append(this.getO(o));
    } else if (o instanceof EParameter) { this.container.append(this.getParam(o));
    } else { U.pe(true, 'invalid ModelPiece type instance: ', o); }
    this.updateRaw(o);
    const $container = $(this.container);
    $container.find('.minimizer').off('click.minimizeTemplate').on('click.minimizeTemplate',
      (e: ClickEvent) => {PropertyBarr.templateMinimizerClick(e); });

    /// ottimizzazioni di stile.
    while ($container.find('.template:has(>.content:not(:has(*)))').remove().length) {} // remove empty minimizer-content.
    // rimuove template.minimizer nested con un solo child che è un altro template+minimizer.
    // tipo:  ((1, 2)) --> (1, 2); sopravvive invece: (1, (2)) -> (1, (2));
    const monoChildReplacer = (i: number, h: HTMLElement) => {
      /*
        '<template_1>' +
          '<content_1>' +
            '<template_2>' +
              '<content_2>' +
              '</content_2>' +
            '</template_2>' +
          '</content_1>' +
        '</template_1>';*/
      const content1: HTMLElement = h;
      const template1: HTMLElement = h.parentElement;
      const template2: ChildNode = content1.firstChild;
      const content2: ChildNode = $(template2).find('>.content')[0];
      template1.insertBefore(content2, content1);
      template1.removeChild(content1); };
    while ($container.find('.content:has(>.template:only-child)').each(monoChildReplacer).length) {}
    // rimuove il template.minimizer alla radice, non ha senso chiudere tutto e rimanere con la pbar vuota.
    const contentRoot = $container.find('>.template>.content')[0];
    U.clear(this.container);
    while (contentRoot.firstChild) { this.container.append(contentRoot.firstChild); }
  }

  private getM_I(o: IModel): HTMLElement {
    const $html: JQuery<HTMLElement> = this.getTemplate(o);
    $html.find('.model').show();
    const nsHtml = $html.find('input.namespace')[0] as HTMLInputElement;
    const uriHtml = $html.find('input.uri')[0] as HTMLInputElement;
    nsHtml.value = o.namespace();
    uriHtml.value = o.uri();
    $(uriHtml).off('change.pbar').on('change.pbar', (e: Event) => { o.uri(uriHtml.value); });
    $(nsHtml).off('change.pbar').on('change.pbar', (e: Event) => { o.namespace(nsHtml.value); });
    const pkgListHtml = ($html.find('.packageList')[0]);
    let i;
    for (i = 0; i < o.childrens.length; i++) { pkgListHtml.appendChild(this.getP_I(o.childrens[i])); }
    return $html[0]; }

  private getP_I(o: IPackage): HTMLElement {
    const $html: JQuery<HTMLElement> = this.getTemplate(o);
    $html.find('.package').show();
    const classListHtml = ($html.find('.classList')[0]);
    let i: number;
    for (i = 0; i < o.childrens.length; i++) { classListHtml.appendChild(this.getC_I(o.childrens[i])); }
    // package own properties (sembra ci sia solo il name)
    return $html[0]; }

  private getC_I(o: IClass): HTMLElement {
    const $html: JQuery<HTMLElement> = this.getTemplate(o);
    $html.find('.class').show();
    let i: number;
    const attribListHtml: HTMLElement = ($html.find('.attributeList')[0]);
    const refListHtml: HTMLElement = ($html.find('.referenceList')[0]);
    const opListHtml: HTMLElement = ($html.find('.operationList')[0]);
    for (i = 0; i < o.attributes.length; i++) { attribListHtml.appendChild(this.getA_I(o.attributes[i])); }
    for (i = 0; i < o.references.length; i++) { refListHtml.appendChild(this.getR_I(o.references[i])); }
    const operations: EOperation[] = o.getOperations();
    for (i = 0; i < operations.length; i++) { opListHtml.appendChild(this.getO(operations[i])); }
    if (!(o instanceof MClass)) { return $html[0]; }
    /// Se MClass
    const classe: MClass = o as MClass;
    const isRoot: HTMLInputElement = ($html.find('input.isRoot')[0]) as HTMLInputElement;
    isRoot.disabled = isRoot.checked = classe.isRoot();
    $(isRoot).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        if (!input.checked) { input.checked = true; return $html[0]; }
        classe.setRoot(input.checked);
        classe.refreshGUI();
        this.refreshGUI();
      });
    return $html[0]; }

  private setClassChild(o: IClassChild, $html: JQuery<HTMLElement>): void {
    const htmlUpperBound = ($html.find('input.upperbound')[0] as HTMLInputElement);
    if (o.getUpperbound() !== null) { htmlUpperBound.value = '' + o.getUpperbound(); } else { htmlUpperBound.placeholder = '1'; }
    const htmlLowerBound = ($html.find('input.lowerbound')[0] as HTMLInputElement);
    if (o.getLowerbound() !== null) { htmlLowerBound.value = '' + o.getLowerbound(); } else { htmlLowerBound.placeholder = '1'; }

    $(htmlUpperBound).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        o.setUpperbound(+target.value);
        o.refreshGUI();
      });
    $(htmlLowerBound).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        o.setLowerbound(+target.value);
        o.refreshGUI();
      });
  }
  private getR_I(o: IReference): HTMLElement {
    const $html: JQuery<HTMLElement> = this.getTemplate(o);
    $html.find('.reference').show();
    this.setClassChild(o, $html);
    const htmlContainment = ($html.find('input.referenceContainment')[0] as HTMLInputElement);
    htmlContainment.checked = o.isContainment();
    const selectType = $html.find('select.referenceType')[0] as HTMLSelectElement;
    U.clear(selectType);
    PropertyBarr.makeClassListSelector(o.getm2(), selectType, o.getM2Target());

    if (o instanceof MReference) { return $html[0]; }
    const ref: M2Reference = o as M2Reference;
    $(selectType).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLSelectElement = (evt.currentTarget as HTMLSelectElement);
        ref.linkClass(null, +target.value); } );
    $(htmlContainment).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        ref.setContainment(target.checked);
        ref.refreshGUI();
      });
    return $html[0]; }

  private getA_I(o: IAttribute): HTMLElement {
    const $html: JQuery<HTMLElement> = this.getTemplate(o);
    $html.find('.attribute').show();
    this.setClassChild(o, $html);
    const typeHtml: HTMLSelectElement = ($html.find('select.attributeType')[0] as HTMLSelectElement);
    PropertyBarr.makePrimitiveTypeSelector(typeHtml, o.getType());
    $(typeHtml).off('change.pbar').on('change.pbar',
        (evt: Event) => {
          const target: HTMLSelectElement = (evt.currentTarget as HTMLSelectElement);
          o.setPrimitiveType(EType.get(target.value as ShortAttribETypes));
          o.refreshGUI(); } );

    if (o instanceof M2Attribute) { return $html[0]; }
    // Se MAttribute
    const attr: MAttribute = o as MAttribute;
    $html.find('.attributeValue').val(attr.getValueStr()).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        attr.setValueStr(input.value);
        attr.refreshGUI();
      });
    return $html[0]; }

  private getO(o: EOperation): HTMLElement {
    const $html: JQuery<HTMLElement> = this.getTemplate(o);
    $html.find('.operation').show();
    this.setClassChild(o, $html);
    let i: number;
    const paramListHtml: HTMLElement = ($html.find('.parameterList')[0]);
    const visibilityHtml: HTMLSelectElement = ($html.find('.visibilitySelector ')[0]) as HTMLSelectElement;
    PropertyBarr.makeVisibilitySelector(visibilityHtml, o.visibility);
    let paramHtml: HTMLElement = this.getParam(o, true);
    const returnName: HTMLInputElement = ($(paramHtml).find('input.name')[0] as HTMLInputElement);
    returnName.placeholder = 'Return type.';
    returnName.disabled = true;
    returnName.value = '';
    const templateContainingParamList = paramListHtml;
    // while (!templateContainingParamList.classList.contains('replaceVarOn')) { templateContainingParamList = templateContainingParamList.parentElement; }
    templateContainingParamList.prepend(paramHtml);

    for (i = 0; i < o.childrens.length; i++) {
      paramHtml = this.getParam(o.childrens[i], false);
      paramListHtml.appendChild(paramHtml); }

    $html.find('input.exceptions').val(o.exceptionsStr).off('change.pbar').on('change.pbar', (evt: Event) => {
      const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
      input.value = o.exceptionsStr = input.value; });
    return $html[0]; }

  refreshGUI() { this.show(this.selectedModelPiece, this.clickedLevel, this.selectedModelPieceIsEdge); }

  private getParam(o: EParameter | EOperation, asReturnType: boolean = false) {
    const $html: JQuery<HTMLElement> = this.getTemplate(o);
    $html.find('.parameter').show();
    this.setClassChild(o, $html);
    const typeHtml: HTMLSelectElement = ($html.find('select.fullType')[0] as HTMLSelectElement);
    const ordered = ($html.find('input.ordered')[0] as HTMLInputElement);
    const unique = ($html.find('input.unique')[0] as HTMLInputElement);
    ordered.checked = o.ordered;
    unique.checked = o.unique;
    PropertyBarr.makeFullTypeSelector(typeHtml, o.primitiveType, o.classType, asReturnType);
    $(typeHtml).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLSelectElement = (evt.currentTarget as HTMLSelectElement);
        o.setPrimitiveType(EType.get(target.value as ShortAttribETypes));
        o.refreshGUI(); } ); // .trigger('change');
    return $html[0]; }

  onShow(isRaw: boolean = false): void {
    this.styleEditor.onHide();
  }
  onHide(): void {}
}
