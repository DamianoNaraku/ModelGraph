import {Component, OnInit} from '@angular/core';
import {IAttribute, M2Class, IEdge, IModel, IPackage, IReference, ModelPiece, PropertyBarr, Status, U, IClass,
  EdgeModes
} from '../common/Joiner';
import ChangeEvent = JQuery.ChangeEvent;
import BlurEvent = JQuery.BlurEvent;
import KeyDownEvent = JQuery.KeyDownEvent;
import KeyboardEventBase = JQuery.KeyboardEventBase;
import KeyUpEvent = JQuery.KeyUpEvent;

@Component({
  selector: 'app-style-editor',
  templateUrl: './style-editor.component.html',
  styleUrls: ['./style-editor.component.css']
})
export class StyleEditorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
export class StyleEditor {
  private propertyBar: PropertyBarr = null;
  private $root: JQuery<HTMLElement | SVGElement> = null;
  private $templates: JQuery<HTMLElement | SVGElement> = null;
  private $display: JQuery<HTMLElement | SVGElement> = null;
  private root: HTMLElement | SVGElement = null;
  private templates: HTMLElement | SVGElement = null;
  private display: HTMLElement | SVGElement = null;

  constructor(propertyBar: PropertyBarr, $root: JQuery<HTMLElement | SVGElement>) {
    this.propertyBar = propertyBar;
    this.$root = $root.find('.styleContainer');
    this.$display = this.$root.find('.StyleEditorDisplay');
    this.$templates = this.$root.find('.styleTemplates');
    this.root = this.$root[0];
    this.display = this.$display[0];
    this.templates = this.$templates[0];
  }
  // static styleChanged(e: ClipboardEvent | ChangeEvent | KeyDownEvent | KeyUpEvent | KeyboardEvent): HTMLElement | SVGElement { }
  static onPaste(e: any): void { // e: ClipboardEvent
    e.preventDefault();
    const div: HTMLDivElement | HTMLTextAreaElement = e.currentTarget as HTMLDivElement | HTMLTextAreaElement;
    const text: string = (e as unknown as any).originalEvent.clipboardData.getData('text/plain');
    div.innerText = text; }

  show(m: ModelPiece) {
    // U.pe(true, 'StyleEditor.show(): todo');
    console.log('styleShow(', m, ')');

    if (m instanceof IModel) { this.showM(m); }
    if (m instanceof IPackage) { this.showP(m); }
    if (m instanceof IClass) { this.showC(m); }
    if (m instanceof IAttribute) { this.showA(m); }
    if (m instanceof IReference) { this.showR(m); } }

  private getCopyOfTemplate(m: ModelPiece, s: string): HTMLElement {
    const $html: HTMLElement = this.$templates.find('.Template' + s) as unknown as HTMLElement;
    const html = U.cloneHtml($html[0]);
    html.dataset.modelPieceID = '' + m.id;
    U.clear(this.display);
    this.display.appendChild(html);
    html.style.display = 'block';
    return html; }
  showM(m: IModel) {
    console.log('styleShowM(', m, ')');
    const html: HTMLElement = this.getCopyOfTemplate(m, '.model');
    const $html = $(html);
    const gridX: HTMLInputElement = $html.find('.gridX')[0] as HTMLInputElement;
    const gridY: HTMLInputElement = $html.find('.gridY')[0] as HTMLInputElement;
    const zoomX: HTMLInputElement = $html.find('.zoomX')[0] as HTMLInputElement;
    const zoomY: HTMLInputElement = $html.find('.zoomY')[0] as HTMLInputElement;
    const showGrid: HTMLInputElement = $html.find('.showGrid')[0] as HTMLInputElement;
    const color: HTMLInputElement = $html.find('.graphColor')[0] as HTMLInputElement;
    gridX.value = m.graph.grid ? '' + m.graph.grid.x : '';
    gridY.value = m.graph.grid ? '' + m.graph.grid.y : '';
    zoomX.value = m.graph.zoom.x + '';
    zoomY.value = m.graph.zoom.y + '';
    showGrid.checked = m.graph.gridDisplay;
    color.value = '#000ff'; // todo.
    // event listeners:
    $(gridX).off('change.set').on('change.set', (e: ChangeEvent) => {
      const input: HTMLInputElement = e.currentTarget;
      m.graph.grid.x = isNaN(+input.value) ? 0 : +input.value;
      showGrid.checked = true;
      $(showGrid).trigger('change');
      m.refreshGUI();
    });
    $(gridY).off('change.set').on('change.set', (e: ChangeEvent) => {
      const input: HTMLInputElement = e.currentTarget;
      m.graph.grid.y = isNaN(+input.value) ? 0 : +input.value;
      showGrid.checked = true;
      $(showGrid).trigger('change');
      m.refreshGUI();
    });
    $(zoomX).off('change.set').on('change.set', (e: ChangeEvent) => {
      const input: HTMLInputElement = e.currentTarget;
      m.graph.zoom.x = isNaN(+input.value) ? 0 : +input.value;
      m.graph.setZoom();
    });
    $(zoomY).off('change.set').on('change.set', (e: ChangeEvent) => {
      const input: HTMLInputElement = e.currentTarget;
      m.graph.zoom.y = isNaN(+input.value) ? 0 : +input.value;
      m.graph.setZoom();
    });
    $(showGrid).off('change.set').on('change.set', (e: ChangeEvent) => {
      const input: HTMLInputElement = e.currentTarget;
      m.graph.ShowGrid(input.checked);
    });
  }

  showP(m: IPackage) { U.pe(true, 'styles of Package(', m, '): unexpected.'); }

  showC(m: IClass) {
    console.log('styleShowC(', m, ')');
    const model: IModel = m.getModelRoot();
    if (m.shouldBeDisplayedAsEdge()) { return this.showE(m); }
    const html: HTMLElement = this.getCopyOfTemplate(m, '.vertex.classe');
    const $html = $(html);
    const showAsEdge: HTMLInputElement = $html.find('.showAsEdge')[0] as HTMLInputElement;
    const showAsEdgeText: HTMLElement = $html.find('.showAsEdgeText')[0] as HTMLElement;
    const htmlInput: HTMLTextAreaElement | HTMLDivElement = $html.find('.own.vertexStyle.html')[0] as HTMLTextAreaElement | HTMLDivElement;
    const htmlPreview: HTMLElement = $html.find('.vertexStyle.own.preview')[0] as HTMLElement;
    const htmlInputI: HTMLElement = $html.find('.vertexStyle.instances.html')[0] as HTMLElement;
    const htmlPreviewI: HTMLElement = $html.find('.vertexStyle.instances.preview')[0] as HTMLElement;
    htmlInput.setAttribute('placeholder', U.replaceVarsString(m, htmlInput.getAttribute('placeholder')));
    // todo: rimpiazza le chiamate statiche con una dinamica che se fallisce a prendere style personalizzato restituisce quello statico.
    htmlInput.innerText = (m.getStyle().firstChild as HTMLElement).outerHTML;

    if (model.isMM()) {
      htmlInputI.setAttribute('placeholder', U.replaceVarsString(m, htmlInputI.getAttribute('placeholder')));
      htmlInputI.innerText =
        m.styleOfInstances ? m.styleOfInstances.outerHTML : ModelPiece.GetStyle(Status.status.m, 'Class').outerHTML;
    }
    if (model.isM()) {
      const lastElementIndex = U.getIndex(htmlPreview);
      const toHide: ChildNode[] = U.toArray(htmlPreview.parentNode.childNodes).slice(lastElementIndex + 1);
      $(toHide).hide(); }

    U.pe(!showAsEdge, 'wrong PropertyBar.show() call', m, 'html:', html);
    showAsEdge.checked = false;
    if (m.references.length < 2) {
      showAsEdge.disabled = true;
      showAsEdgeText.innerHTML = 'Show as an edge (require >= 2 references)';
    } else {
      showAsEdge.disabled = false;
      showAsEdgeText.innerHTML = 'Show as an edge.'; }
    // todo: devi consentire di modificare anche defaultStyle (m3)
    // console.log('ownStyle: ', m.customStyle, 'outerHTML:', (m.customStyle ? m.customStyle.outerHTML : 'empty field'));
    // event listeners:
    $(showAsEdge).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.shouldBeDisplayedAsEdge(true);
      this.showE(m); });

    const onStyleChange = (e: ChangeEvent | BlurEvent | KeyDownEvent) => {
      if (! U.isValidHtml(htmlInput.innerText)) {
        htmlPreview.innerHTML = 'The html input is invalid, validate it at <a href="//validator.w3.org/">https://validator.w3.org/</a>';
        return; }
      htmlPreview.innerHTML = htmlInput.innerText;
      m.customStyle = U.toHtml(htmlInput.innerText);
      console.log('stile salvato su:', m, 'newHtml:', m.customStyle);
      if ((e as any).isTrigger) { return; }
      m.refreshGUI(); };

    const onStyleChangeI = (e: ChangeEvent | BlurEvent | KeyDownEvent) => {
      if (! U.isValidHtml(htmlInputI.innerText)) {
        htmlPreviewI.innerHTML = 'The html input is invalid, validate it at <a href="//validator.w3.org/">https://validator.w3.org/</a>';
        return; }
      htmlPreviewI.innerHTML = htmlInputI.innerText;
      m.styleOfInstances = U.toHtml(htmlInputI.innerText);
      console.log('stile salvato su:', m, 'newHtml:', m.customStyle);
      if ((e as any).isTrigger) { return; }
      m.refreshInstancesGUI(); };

    $(htmlInput).off('paste.set').on('paste.set', StyleEditor.onPaste)
      .off('change.set').on('change.set', onStyleChange)
      .off('blur.set').on('blur.set', onStyleChange)
      .off('keydown.set').on('keydown.set', (e: KeyDownEvent) => { if (e.key === 'Esc') { this.showC(m); } } ).trigger('change');
    $(htmlInputI).off('paste.set').on('paste.set', StyleEditor.onPaste)
      .off('change.set').on('change.set', onStyleChangeI)
      .off('blur.set').on('blur.set', onStyleChangeI)
      .off('keydown.set').on('keydown.set', (e: KeyDownEvent) => { if (e.key === 'Esc') { this.showC(m); } } ).trigger('change');
  }

  showA(m: IAttribute) {
    console.log('styleShowA(', m, ')');
    const model: IModel = m.getModelRoot();
    const html: HTMLElement = this.getCopyOfTemplate(m, '.attribute');
    const $html = $(html);
    const htmlInput: HTMLTextAreaElement | HTMLDivElement =
      $html.find('.own.attributeStyle.html')[0] as HTMLTextAreaElement | HTMLDivElement;
    const htmlPreview: HTMLElement = $html.find('.attributeStyle.own.preview')[0] as HTMLElement;
    const htmlPreviewI: HTMLElement = $html.find('.attributeStyle.instances.preview')[0] as HTMLElement;
    const htmlInputI: HTMLElement = $html.find('.attributeStyle.instances.html')[0] as HTMLElement;
    htmlInput.setAttribute('placeholder', U.replaceVarsString(m, htmlInput.getAttribute('placeholder')));
    htmlInput.innerText = m.getStyle().outerHTML;
    if (model.isMM()) {
      htmlInputI.setAttribute('placeholder', U.replaceVarsString(m, htmlInputI.getAttribute('placeholder')));
      htmlInputI.innerText =
        m.styleOfInstances ? m.styleOfInstances.outerHTML : ModelPiece.GetStyle(Status.status.m, 'Attribute').outerHTML;
    }
    if (model.isM()) {
      const lastElementIndex = U.getIndex(htmlPreview);
      const toHide: ChildNode[] = U.toArray(htmlPreview.parentNode.childNodes).slice(lastElementIndex + 1);
      $(toHide).hide();
    }
    // todo: devi consentire di modificare anche defaultStyle (m3)
    // event listeners:
    const onStyleChange = (e: ChangeEvent | BlurEvent | KeyDownEvent) => {
      if (! U.isValidHtml(htmlInput.innerText)) {
        htmlPreview.innerHTML = 'The html input is invalid, validate it at <a href="//validator.w3.org/">https://validator.w3.org/</a>';
        return; }
      htmlPreview.innerHTML = htmlInput.innerText;
      m.customStyle = U.toHtml(htmlInput.innerText);
      console.log('stile salvato su:', m, 'newHtml:', m.customStyle);
      if ((e as any).isTrigger) { return; }
      m.refreshGUI(); };

    const onStyleChangeI = (e: ChangeEvent | BlurEvent | KeyDownEvent) => {
      if (! U.isValidHtml(htmlInputI.innerText)) {
        htmlPreviewI.innerHTML = 'The html input is invalid, validate it at <a href="//validator.w3.org/">https://validator.w3.org/</a>';
        return; }
      htmlPreviewI.innerHTML = htmlInputI.innerText;
      m.styleOfInstances = U.toHtml(htmlInputI.innerText);
      console.log('stile salvato su:', m, 'newHtml:', m.customStyle);
      if ((e as any).isTrigger) { return; }
      m.refreshInstancesGUI(); };

    $(htmlInput).off('paste.set').on('paste.set', StyleEditor.onPaste)
      .off('change.set').on('change.set', onStyleChange)
      .off('blur.set').on('blur.set', onStyleChange)
      .off('keydown.set').on('keydown.set', (e: KeyDownEvent) => { if (e.key === 'Esc') { this.showA(m); } } ).trigger('change');
    $(htmlInputI).off('paste.set').on('paste.set', StyleEditor.onPaste)
      .off('change.set').on('change.set', onStyleChangeI)
      .off('blur.set').on('blur.set', onStyleChangeI)
      .off('keydown.set').on('keydown.set', (e: KeyDownEvent) => { if (e.key === 'Esc') { this.showA(m); } } ).trigger('change');
  }

  showR(m: IReference) {
    console.log('styleShowR(', m, ')');
    const model: IModel = m.getModelRoot();
    const html: HTMLElement = this.getCopyOfTemplate(m, '.reference');
    const $html = $(html);
    const htmlInput: HTMLTextAreaElement = $html.find('.referenceStyle.own.html')[0] as HTMLTextAreaElement;
    const htmlInputI: HTMLTextAreaElement = $html.find('.referenceStyle.instances.html')[0] as HTMLTextAreaElement;
    const htmlPreview: HTMLInputElement = $html.find('.referenceStyle.own.preview')[0] as HTMLInputElement;
    const htmlPreviewI: HTMLInputElement = $html.find('.referenceStyle.instances.preview')[0] as HTMLInputElement;

    htmlInput.innerText = m.getStyle().outerHTML;
    htmlInput.setAttribute('placeholder', U.replaceVarsString(m, htmlInput.getAttribute('placeholder')));
    if (model.isMM()) {
      htmlInputI.setAttribute('placeholder', U.replaceVarsString(m, htmlInputI.getAttribute('placeholder')));
      htmlInputI.innerText =
        m.styleOfInstances ? m.styleOfInstances.outerHTML : ModelPiece.GetStyle(Status.status.m, 'Reference').outerHTML;
    }
    if (model.isM()) {
      const lastElementIndex = U.getIndex(htmlPreview);
      const toHide: ChildNode[] = U.toArray(htmlPreview.parentNode.childNodes).slice(lastElementIndex + 1);
      $(toHide).hide();
    }
    // todo: devi consentire di modificare anche defaultStyle (m3)
    // event listeners:
    const onStyleChange = (e: ChangeEvent | BlurEvent | KeyDownEvent) => {
      if (! U.isValidHtml(htmlInput.innerText)) {
        htmlPreview.innerHTML = 'The html input is invalid, validate it at <a href="//validator.w3.org/">https://validator.w3.org/</a>';
        return; }
      htmlPreview.innerHTML = htmlInput.innerText;
      m.customStyle = U.toHtml(htmlInput.innerText);
      console.log('stile salvato su:', m, 'newHtml:', m.customStyle);
      if ((e as any).isTrigger) { return; }
      m.refreshGUI(); };

    const onStyleChangeI = (e: ChangeEvent | BlurEvent | KeyDownEvent) => {
      if (! U.isValidHtml(htmlInputI.innerText)) {
        htmlPreviewI.innerHTML = 'The html input is invalid, validate it at <a href="//validator.w3.org/">https://validator.w3.org/</a>';
        return; }
      htmlPreviewI.innerHTML = htmlInputI.innerText;
      m.styleOfInstances = U.toHtml(htmlInputI.innerText);
      console.log('stile salvato su:', m, 'newHtml:', m.customStyle);
      if ((e as any).isTrigger) { return; }
      m.refreshInstancesGUI(); };

    $(htmlInput).off('paste.set').on('paste.set', StyleEditor.onPaste)
      .off('change.set').on('change.set', onStyleChange)
      .off('blur.set').on('blur.set', onStyleChange)
      .off('keydown.set').on('keydown.set', (e: KeyDownEvent) => { if (e.key === 'Esc') { this.showR(m); } } ).trigger('change');
    $(htmlInputI).off('paste.set').on('paste.set', StyleEditor.onPaste)
      .off('change.set').on('change.set', onStyleChangeI)
      .off('blur.set').on('blur.set', onStyleChangeI)
      .off('keydown.set').on('keydown.set', (e: KeyDownEvent) => { if (e.key === 'Esc') { this.showR(m); } } ).trigger('change');

  }

  public showE(m: IClass | IReference) {
    console.log('styleShowE(', m, ')');
    const edge: IEdge = m.edges && m.edges.length ? m.edges[0] : null;
    const html: HTMLElement = this.getCopyOfTemplate(m, '.edge');
    const $html = $(html);
    const edgeStyle: HTMLSelectElement = $html.find('.edgeStyle')[0] as HTMLSelectElement;
    const eColorCommon: HTMLInputElement = $html.find('.edgeColor.common')[0] as HTMLInputElement;
    const eColorHighlight: HTMLInputElement = $html.find('.edgeColor.highlight')[0] as HTMLInputElement;
    const eColorSelected: HTMLInputElement = $html.find('.edgeColor.selected')[0] as HTMLInputElement;
    const eWidthCommon: HTMLInputElement = $html.find('.edgeWidth.common')[0] as HTMLInputElement;
    const eWidthHighlight: HTMLInputElement = $html.find('.edgeWidth.highlight')[0] as HTMLInputElement;
    const eWidthSelected: HTMLInputElement = $html.find('.edgeWidth.selected')[0] as HTMLInputElement;
    const epRadiusC: HTMLInputElement = $html.find('.edgePoint.radius')[0] as HTMLInputElement;
    const epStrokeWC: HTMLInputElement = $html.find('.edgePoint.strokeW')[0] as HTMLInputElement;
    const epStrokeC: HTMLInputElement = $html.find('.edgePoint.stroke')[0] as HTMLInputElement;
    const epFillC: HTMLInputElement = $html.find('.edgePoint.fill')[0] as HTMLInputElement;
    const epRadiusH: HTMLInputElement = $html.find('.edgePointPreview.radius')[0] as HTMLInputElement;
    const epStrokeWH: HTMLInputElement = $html.find('.edgePointPreview.strokeW')[0] as HTMLInputElement;
    const epStrokeH: HTMLInputElement = $html.find('.edgePointPreview.stroke')[0] as HTMLInputElement;
    const epFillH: HTMLInputElement = $html.find('.edgePointPreview.fill')[0] as HTMLInputElement;
    const epRadiusS: HTMLInputElement = $html.find('.edgePointSelected.radius')[0] as HTMLInputElement;
    const epStrokeWS: HTMLInputElement = $html.find('.edgePointSelected.strokeW')[0] as HTMLInputElement;
    const epStrokeS: HTMLInputElement = $html.find('.edgePointSelected.stroke')[0] as HTMLInputElement;
    const epFillS: HTMLInputElement = $html.find('.edgePointSelected.fill')[0] as HTMLInputElement;
    U.pe(!edgeStyle, 'edgeStyle not found. root:', $html, 'selector: ' + '.edgeStyle');

    let styleName = '';
    switch (m.edgeStyleCommon.style) {
      default: U.pe(true, 'unrecognized EdgeStyle:', m.edgeStyleCommon.style); break;
      case EdgeModes.angular23Auto: styleName = 'angular23Auto'; break;
      case EdgeModes.angular2: styleName = 'angular2'; break;
      case EdgeModes.angular3: styleName = 'angular3'; break;
      case EdgeModes.straight: styleName = 'straight'; break;
    }
    U.selectHtml(edgeStyle, styleName, false);
    eWidthCommon.value    = '' + m.edgeStyleCommon.width;
    eWidthHighlight.value = '' + m.edgeStyleHighlight.width;
    eWidthSelected.value  = '' + m.edgeStyleSelected.width;
    eColorCommon.value    = m.edgeStyleCommon.color;
    eColorHighlight.value = m.edgeStyleHighlight.color;
    eColorSelected.value  = m.edgeStyleSelected.color;

    console.log('logic:', m, 'styleCColor:', m.edgeStyleCommon.color, 'output value:', eColorCommon.value);
    epRadiusC.value  = '' + m.edgeStyleCommon.edgePointStyle.radius;
    epStrokeWC.value = '' + m.edgeStyleCommon.edgePointStyle.strokeWidth;
    epStrokeC.value  = m.edgeStyleCommon.edgePointStyle.strokeColor;
    epFillC.value    = m.edgeStyleCommon.edgePointStyle.fillColor;

    epRadiusH.value  = '' + m.edgeStyleHighlight.edgePointStyle.radius;
    epStrokeWH.value = '' + m.edgeStyleHighlight.edgePointStyle.strokeWidth;
    epStrokeH.value  = m.edgeStyleHighlight.edgePointStyle.strokeColor;
    epFillH.value    = m.edgeStyleHighlight.edgePointStyle.fillColor;

    epRadiusS.value  = '' + m.edgeStyleSelected.edgePointStyle.radius;
    epStrokeWS.value = '' + m.edgeStyleSelected.edgePointStyle.strokeWidth;
    epStrokeS.value  = m.edgeStyleSelected.edgePointStyle.strokeColor;
    epFillS.value    = m.edgeStyleSelected.edgePointStyle.fillColor;

    $(edgeStyle).off('change.set').on('change.set', (e: ChangeEvent) => {
      let mode: EdgeModes;
      switch (edgeStyle.value) {
        default: U.pe(true, 'unrecognized edgeMode(', edgeStyle.value, ') among: ', EdgeModes); break;
        case EdgeModes.straight: case 'straight': mode = EdgeModes.straight; break;
        case EdgeModes.angular23Auto: case 'angular23Auto': mode = EdgeModes.angular23Auto; break;
        case EdgeModes.angular2: case 'angular2': mode = EdgeModes.angular2; break;
        case EdgeModes.angular3: case 'angular3': mode = EdgeModes.angular3; break; }
      m.edgeStyleCommon.style = mode;
      m.edgeStyleHighlight.style = mode;
      m.edgeStyleSelected.style = mode;
      edge.refreshGui();
    });
    $(eColorCommon).off('change.set').on('change.set',
      (e: ChangeEvent) => { m.edgeStyleCommon.color = eColorCommon.value; edge.refreshGui(); });
    $(eWidthCommon).off('change.set').on('change.set',
      (e: ChangeEvent) => { m.edgeStyleCommon.width = isNaN(+eWidthCommon.value) ? 0 : +eWidthCommon.value; edge.refreshGui(); });
    $(eColorHighlight).off('change.set').on('change.set',
      (e: ChangeEvent) => { m.edgeStyleHighlight.color = eColorHighlight.value; edge.refreshGui(); });
    $(eWidthHighlight).off('change.set').on('change.set',
      (e: ChangeEvent) => { m.edgeStyleHighlight.width = isNaN(+eWidthHighlight.value) ? 0 : +eWidthHighlight.value; edge.refreshGui(); });
    $(eColorSelected).off('change.set').on('change.set',
      (e: ChangeEvent) => { m.edgeStyleSelected.color = eColorSelected.value; edge.refreshGui(); });
    $(eWidthSelected).off('change.set').on('change.set',
      (e: ChangeEvent) => { m.edgeStyleSelected.width = isNaN(+eWidthSelected.value) ? 0 : +eWidthSelected.value; edge.refreshGui(); });

    $(epRadiusC).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleCommon.edgePointStyle.radius = isNaN(+epRadiusC.value) ? 0 : +epRadiusC.value; edge.refreshGui(); });
    $(epStrokeWC).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleCommon.edgePointStyle.strokeWidth = isNaN(+epStrokeWC.value) ? 0 : +epStrokeWC.value; edge.refreshGui(); });
    $(epStrokeC).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleCommon.edgePointStyle.strokeColor = epStrokeC.value; edge.refreshGui(); });
    $(epFillC).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleCommon.edgePointStyle.fillColor = epFillC.value; edge.refreshGui(); });

    $(epRadiusH).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleHighlight.edgePointStyle.radius = isNaN(+epRadiusH.value) ? 0 : +epRadiusH.value; edge.refreshGui(); });
    $(epStrokeWH).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleHighlight.edgePointStyle.strokeWidth = isNaN(+epStrokeWH.value) ? 0 : +epStrokeWH.value; edge.refreshGui(); });
    $(epStrokeH).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleHighlight.edgePointStyle.strokeColor = epStrokeH.value; edge.refreshGui(); });
    $(epFillH).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleHighlight.edgePointStyle.fillColor = epFillH.value; edge.refreshGui(); });

    $(epRadiusS).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleSelected.edgePointStyle.radius = isNaN(+epRadiusS.value) ? 0 : +epRadiusS.value; edge.refreshGui(); });
    $(epStrokeWS).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleSelected.edgePointStyle.strokeWidth = isNaN(+epStrokeWS.value) ? 0 : +epStrokeWS.value; edge.refreshGui(); });
    $(epStrokeS).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleSelected.edgePointStyle.strokeColor = epStrokeS.value; edge.refreshGui(); });
    $(epFillS).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleSelected.edgePointStyle.fillColor = epFillS.value; edge.refreshGui(); });
  }
}
