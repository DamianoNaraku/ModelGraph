import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { IAttribute, IModel, IPackage, IReference, ModelPiece, Status, U, IClass, EdgeModes } from '../common/Joiner';
var StyleEditorComponent = /** @class */ (function () {
    function StyleEditorComponent() {
    }
    StyleEditorComponent.prototype.ngOnInit = function () {
    };
    StyleEditorComponent = tslib_1.__decorate([
        Component({
            selector: 'app-style-editor',
            templateUrl: './style-editor.component.html',
            styleUrls: ['./style-editor.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], StyleEditorComponent);
    return StyleEditorComponent;
}());
export { StyleEditorComponent };
var StyleEditor = /** @class */ (function () {
    function StyleEditor(propertyBar, $root) {
        this.propertyBar = null;
        this.$root = null;
        this.$templates = null;
        this.$display = null;
        this.root = null;
        this.templates = null;
        this.display = null;
        this.propertyBar = propertyBar;
        this.$root = $root.find('.styleContainer');
        this.$display = this.$root.find('.StyleEditorDisplay');
        this.$templates = this.$root.find('.styleTemplates');
        this.root = this.$root[0];
        this.display = this.$display[0];
        this.templates = this.$templates[0];
    }
    // static styleChanged(e: ClipboardEvent | ChangeEvent | KeyDownEvent | KeyUpEvent | KeyboardEvent): HTMLElement | SVGElement { }
    StyleEditor.onPaste = function (e) {
        e.preventDefault();
        var div = e.currentTarget;
        var text = e.originalEvent.clipboardData.getData('text/plain');
        div.innerText = text;
    };
    StyleEditor.prototype.show = function (m) {
        // U.pe(true, 'StyleEditor.show(): todo');
        console.log('styleShow(', m, ')');
        if (m instanceof IModel) {
            this.showM(m);
        }
        if (m instanceof IPackage) {
            this.showP(m);
        }
        if (m instanceof IClass) {
            this.showC(m);
        }
        if (m instanceof IAttribute) {
            this.showA(m);
        }
        if (m instanceof IReference) {
            this.showR(m);
        }
    };
    StyleEditor.prototype.getCopyOfTemplate = function (m, s) {
        var $html = this.$templates.find('.Template' + s);
        var html = U.cloneHtml($html[0]);
        html.dataset.modelPieceID = '' + m.id;
        U.clear(this.display);
        this.display.appendChild(html);
        html.style.display = 'block';
        return html;
    };
    StyleEditor.prototype.showM = function (m) {
        console.log('styleShowM(', m, ')');
        var html = this.getCopyOfTemplate(m, '.model');
        var $html = $(html);
        var gridX = $html.find('.gridX')[0];
        var gridY = $html.find('.gridY')[0];
        var zoomX = $html.find('.zoomX')[0];
        var zoomY = $html.find('.zoomY')[0];
        var showGrid = $html.find('.showGrid')[0];
        var color = $html.find('.graphColor')[0];
        gridX.value = m.graph.grid ? '' + m.graph.grid.x : '';
        gridY.value = m.graph.grid ? '' + m.graph.grid.y : '';
        zoomX.value = m.graph.zoom.x + '';
        zoomY.value = m.graph.zoom.y + '';
        showGrid.checked = m.graph.gridDisplay;
        color.value = '#000ff'; // todo.
        // event listeners:
        $(gridX).off('change.set').on('change.set', function (e) {
            var input = e.currentTarget;
            m.graph.grid.x = isNaN(+input.value) ? 0 : +input.value;
            showGrid.checked = true;
            $(showGrid).trigger('change');
            m.refreshGUI();
        });
        $(gridY).off('change.set').on('change.set', function (e) {
            var input = e.currentTarget;
            m.graph.grid.y = isNaN(+input.value) ? 0 : +input.value;
            showGrid.checked = true;
            $(showGrid).trigger('change');
            m.refreshGUI();
        });
        $(zoomX).off('change.set').on('change.set', function (e) {
            var input = e.currentTarget;
            m.graph.zoom.x = isNaN(+input.value) ? 0 : +input.value;
            m.graph.setZoom();
        });
        $(zoomY).off('change.set').on('change.set', function (e) {
            var input = e.currentTarget;
            m.graph.zoom.y = isNaN(+input.value) ? 0 : +input.value;
            m.graph.setZoom();
        });
        $(showGrid).off('change.set').on('change.set', function (e) {
            var input = e.currentTarget;
            m.graph.ShowGrid(input.checked);
        });
    };
    StyleEditor.prototype.showP = function (m) { U.pe(true, 'styles of Package(', m, '): unexpected.'); };
    StyleEditor.prototype.showC = function (m) {
        var _this = this;
        console.log('styleShowC(', m, ')');
        var model = m.getModelRoot();
        if (m.shouldBeDisplayedAsEdge()) {
            return this.showE(m);
        }
        var html = this.getCopyOfTemplate(m, '.vertex.classe');
        var $html = $(html);
        var showAsEdge = $html.find('.showAsEdge')[0];
        var showAsEdgeText = $html.find('.showAsEdgeText')[0];
        var htmlInput = $html.find('.own.vertexStyle.html')[0];
        var htmlPreview = $html.find('.vertexStyle.own.preview')[0];
        var htmlInputI = $html.find('.vertexStyle.instances.html')[0];
        var htmlPreviewI = $html.find('.vertexStyle.instances.preview')[0];
        htmlInput.setAttribute('placeholder', U.replaceVarsString(m, htmlInput.getAttribute('placeholder')));
        // todo: rimpiazza le chiamate statiche con una dinamica che se fallisce a prendere style personalizzato restituisce quello statico.
        if (model.isMM()) {
            htmlInput.innerText = m.getStyle().firstChild.outerHTML;
            htmlInputI.setAttribute('placeholder', U.replaceVarsString(m, htmlInputI.getAttribute('placeholder')));
            htmlInputI.innerText =
                m.styleOfInstances ? m.styleOfInstances.outerHTML : ModelPiece.GetStyle(Status.status.m, 'Class').outerHTML;
        }
        if (model.isM()) {
            htmlInput.innerText = m.metaParent.getStyle().firstChild.outerHTML;
            var lastElementIndex = U.getIndex(htmlPreview);
            var toHide = U.toArray(htmlPreview.parentNode.childNodes).slice(lastElementIndex + 1);
            $(toHide).hide();
        }
        U.pe(!showAsEdge, 'wrong PropertyBar.show() call', m, 'html:', html);
        showAsEdge.checked = false;
        if (m.references.length < 2) {
            showAsEdge.disabled = true;
            showAsEdgeText.innerHTML = 'Show as an edge (require >= 2 references)';
        }
        else {
            showAsEdge.disabled = false;
            showAsEdgeText.innerHTML = 'Show as an edge.';
        }
        // todo: devi consentire di modificare anche defaultStyle (m3)
        // console.log('ownStyle: ', m.customStyle, 'outerHTML:', (m.customStyle ? m.customStyle.outerHTML : 'empty field'));
        // event listeners:
        $(showAsEdge).off('change.set').on('change.set', function (e) {
            m.shouldBeDisplayedAsEdge(true);
            _this.showE(m);
        });
        var onStyleChange = function (e) {
            if (!U.isValidHtml(htmlInput.innerText)) {
                htmlPreview.innerHTML = 'The html input is invalid, validate it at <a href="//validator.w3.org/">https://validator.w3.org/</a>';
                return;
            }
            htmlPreview.innerHTML = htmlInput.innerText;
            m.customStyle = U.toHtml(htmlInput.innerText);
            console.log('stile salvato su:', m, 'newHtml:', m.customStyle);
            if (e.isTrigger) {
                return;
            }
            m.refreshGUI();
        };
        var onStyleChangeI = function (e) {
            if (!U.isValidHtml(htmlInputI.innerText)) {
                htmlPreviewI.innerHTML = 'The html input is invalid, validate it at <a href="//validator.w3.org/">https://validator.w3.org/</a>';
                return;
            }
            htmlPreviewI.innerHTML = htmlInputI.innerText;
            m.styleOfInstances = U.toHtml(htmlInputI.innerText);
            console.log('stile salvato su:', m, 'newHtml:', m.customStyle);
            if (e.isTrigger) {
                return;
            }
            m.refreshInstancesGUI();
        };
        $(htmlInput).off('paste.set').on('paste.set', StyleEditor.onPaste)
            .off('change.set').on('change.set', onStyleChange)
            .off('blur.set').on('blur.set', onStyleChange)
            .off('keydown.set').on('keydown.set', function (e) { if (e.key === 'Esc') {
            _this.showC(m);
        } }).trigger('change');
        $(htmlInputI).off('paste.set').on('paste.set', StyleEditor.onPaste)
            .off('change.set').on('change.set', onStyleChangeI)
            .off('blur.set').on('blur.set', onStyleChangeI)
            .off('keydown.set').on('keydown.set', function (e) { if (e.key === 'Esc') {
            _this.showC(m);
        } }).trigger('change');
    };
    StyleEditor.prototype.showA = function (m) {
        var _this = this;
        console.log('styleShowA(', m, ')');
        var model = m.getModelRoot();
        var html = this.getCopyOfTemplate(m, '.attribute');
        var $html = $(html);
        var htmlInput = $html.find('.own.attributeStyle.html')[0];
        var htmlPreview = $html.find('.attributeStyle.own.preview')[0];
        var htmlPreviewI = $html.find('.attributeStyle.instances.preview')[0];
        var htmlInputI = $html.find('.attributeStyle.instances.html')[0];
        htmlInput.setAttribute('placeholder', U.replaceVarsString(m, htmlInput.getAttribute('placeholder')));
        htmlInput.innerText = m.getStyle().outerHTML;
        if (model.isMM()) {
            htmlInputI.setAttribute('placeholder', U.replaceVarsString(m, htmlInputI.getAttribute('placeholder')));
            htmlInputI.innerText =
                m.styleOfInstances ? m.styleOfInstances.outerHTML : ModelPiece.GetStyle(Status.status.m, 'Attribute').outerHTML;
        }
        if (model.isM()) {
            var lastElementIndex = U.getIndex(htmlPreview);
            var toHide = U.toArray(htmlPreview.parentNode.childNodes).slice(lastElementIndex + 1);
            $(toHide).hide();
        }
        // todo: devi consentire di modificare anche defaultStyle (m3)
        // event listeners:
        var onStyleChange = function (e) {
            if (!U.isValidHtml(htmlInput.innerText)) {
                htmlPreview.innerHTML = 'The html input is invalid, validate it at <a href="//validator.w3.org/">https://validator.w3.org/</a>';
                return;
            }
            htmlPreview.innerHTML = htmlInput.innerText;
            m.customStyle = U.toHtml(htmlInput.innerText);
            console.log('stile salvato su:', m, 'newHtml:', m.customStyle);
            if (e.isTrigger) {
                return;
            }
            m.refreshGUI();
        };
        var onStyleChangeI = function (e) {
            if (!U.isValidHtml(htmlInputI.innerText)) {
                htmlPreviewI.innerHTML = 'The html input is invalid, validate it at <a href="//validator.w3.org/">https://validator.w3.org/</a>';
                return;
            }
            htmlPreviewI.innerHTML = htmlInputI.innerText;
            m.styleOfInstances = U.toHtml(htmlInputI.innerText);
            console.log('stile salvato su:', m, 'newHtml:', m.customStyle);
            if (e.isTrigger) {
                return;
            }
            m.refreshInstancesGUI();
        };
        $(htmlInput).off('paste.set').on('paste.set', StyleEditor.onPaste)
            .off('change.set').on('change.set', onStyleChange)
            .off('blur.set').on('blur.set', onStyleChange)
            .off('keydown.set').on('keydown.set', function (e) { if (e.key === 'Esc') {
            _this.showA(m);
        } }).trigger('change');
        $(htmlInputI).off('paste.set').on('paste.set', StyleEditor.onPaste)
            .off('change.set').on('change.set', onStyleChangeI)
            .off('blur.set').on('blur.set', onStyleChangeI)
            .off('keydown.set').on('keydown.set', function (e) { if (e.key === 'Esc') {
            _this.showA(m);
        } }).trigger('change');
    };
    StyleEditor.prototype.showR = function (m) {
        var _this = this;
        console.log('styleShowR(', m, ')');
        var model = m.getModelRoot();
        var html = this.getCopyOfTemplate(m, '.reference');
        var $html = $(html);
        var htmlInput = $html.find('.referenceStyle.own.html')[0];
        var htmlInputI = $html.find('.referenceStyle.instances.html')[0];
        var htmlPreview = $html.find('.referenceStyle.own.preview')[0];
        var htmlPreviewI = $html.find('.referenceStyle.instances.preview')[0];
        htmlInput.innerText = m.getStyle().outerHTML;
        htmlInput.setAttribute('placeholder', U.replaceVarsString(m, htmlInput.getAttribute('placeholder')));
        if (model.isMM()) {
            htmlInputI.setAttribute('placeholder', U.replaceVarsString(m, htmlInputI.getAttribute('placeholder')));
            htmlInputI.innerText =
                m.styleOfInstances ? m.styleOfInstances.outerHTML : ModelPiece.GetStyle(Status.status.m, 'Reference').outerHTML;
        }
        if (model.isM()) {
            var lastElementIndex = U.getIndex(htmlPreview);
            var toHide = U.toArray(htmlPreview.parentNode.childNodes).slice(lastElementIndex + 1);
            $(toHide).hide();
        }
        // todo: devi consentire di modificare anche defaultStyle (m3)
        // event listeners:
        var onStyleChange = function (e) {
            if (!U.isValidHtml(htmlInput.innerText)) {
                htmlPreview.innerHTML = 'The html input is invalid, validate it at <a href="//validator.w3.org/">https://validator.w3.org/</a>';
                return;
            }
            htmlPreview.innerHTML = htmlInput.innerText;
            m.customStyle = U.toHtml(htmlInput.innerText);
            console.log('stile salvato su:', m, 'newHtml:', m.customStyle);
            if (e.isTrigger) {
                return;
            }
            m.refreshGUI();
        };
        var onStyleChangeI = function (e) {
            if (!U.isValidHtml(htmlInputI.innerText)) {
                htmlPreviewI.innerHTML = 'The html input is invalid, validate it at <a href="//validator.w3.org/">https://validator.w3.org/</a>';
                return;
            }
            htmlPreviewI.innerHTML = htmlInputI.innerText;
            m.styleOfInstances = U.toHtml(htmlInputI.innerText);
            console.log('stile salvato su:', m, 'newHtml:', m.customStyle);
            if (e.isTrigger) {
                return;
            }
            m.refreshInstancesGUI();
        };
        $(htmlInput).off('paste.set').on('paste.set', StyleEditor.onPaste)
            .off('change.set').on('change.set', onStyleChange)
            .off('blur.set').on('blur.set', onStyleChange)
            .off('keydown.set').on('keydown.set', function (e) { if (e.key === 'Esc') {
            _this.showR(m);
        } }).trigger('change');
        $(htmlInputI).off('paste.set').on('paste.set', StyleEditor.onPaste)
            .off('change.set').on('change.set', onStyleChangeI)
            .off('blur.set').on('blur.set', onStyleChangeI)
            .off('keydown.set').on('keydown.set', function (e) { if (e.key === 'Esc') {
            _this.showR(m);
        } }).trigger('change');
    };
    StyleEditor.prototype.showE = function (m) {
        console.log('styleShowE(', m, ')');
        var edge = m.edges && m.edges.length ? m.edges[0] : null;
        var html = this.getCopyOfTemplate(m, '.edge');
        var $html = $(html);
        var edgeStyle = $html.find('.edgeStyle')[0];
        var eColorCommon = $html.find('.edgeColor.common')[0];
        var eColorHighlight = $html.find('.edgeColor.highlight')[0];
        var eColorSelected = $html.find('.edgeColor.selected')[0];
        var eWidthCommon = $html.find('.edgeWidth.common')[0];
        var eWidthHighlight = $html.find('.edgeWidth.highlight')[0];
        var eWidthSelected = $html.find('.edgeWidth.selected')[0];
        var epRadiusC = $html.find('.edgePoint.radius')[0];
        var epStrokeWC = $html.find('.edgePoint.strokeW')[0];
        var epStrokeC = $html.find('.edgePoint.stroke')[0];
        var epFillC = $html.find('.edgePoint.fill')[0];
        var epRadiusH = $html.find('.edgePointPreview.radius')[0];
        var epStrokeWH = $html.find('.edgePointPreview.strokeW')[0];
        var epStrokeH = $html.find('.edgePointPreview.stroke')[0];
        var epFillH = $html.find('.edgePointPreview.fill')[0];
        var epRadiusS = $html.find('.edgePointSelected.radius')[0];
        var epStrokeWS = $html.find('.edgePointSelected.strokeW')[0];
        var epStrokeS = $html.find('.edgePointSelected.stroke')[0];
        var epFillS = $html.find('.edgePointSelected.fill')[0];
        U.pe(!edgeStyle, 'edgeStyle not found. root:', $html, 'selector: ' + '.edgeStyle');
        var styleName = '';
        switch (m.edgeStyleCommon.style) {
            default:
                U.pe(true, 'unrecognized EdgeStyle:', m.edgeStyleCommon.style);
                break;
            case EdgeModes.angular23Auto:
                styleName = 'angular23Auto';
                break;
            case EdgeModes.angular2:
                styleName = 'angular2';
                break;
            case EdgeModes.angular3:
                styleName = 'angular3';
                break;
            case EdgeModes.straight:
                styleName = 'straight';
                break;
        }
        U.selectHtml(edgeStyle, styleName, false);
        eWidthCommon.value = '' + m.edgeStyleCommon.width;
        eWidthHighlight.value = '' + m.edgeStyleHighlight.width;
        eWidthSelected.value = '' + m.edgeStyleSelected.width;
        eColorCommon.value = m.edgeStyleCommon.color;
        eColorHighlight.value = m.edgeStyleHighlight.color;
        eColorSelected.value = m.edgeStyleSelected.color;
        console.log('logic:', m, 'styleCColor:', m.edgeStyleCommon.color, 'output value:', eColorCommon.value);
        epRadiusC.value = '' + m.edgeStyleCommon.edgePointStyle.radius;
        epStrokeWC.value = '' + m.edgeStyleCommon.edgePointStyle.strokeWidth;
        epStrokeC.value = m.edgeStyleCommon.edgePointStyle.strokeColor;
        epFillC.value = m.edgeStyleCommon.edgePointStyle.fillColor;
        epRadiusH.value = '' + m.edgeStyleHighlight.edgePointStyle.radius;
        epStrokeWH.value = '' + m.edgeStyleHighlight.edgePointStyle.strokeWidth;
        epStrokeH.value = m.edgeStyleHighlight.edgePointStyle.strokeColor;
        epFillH.value = m.edgeStyleHighlight.edgePointStyle.fillColor;
        epRadiusS.value = '' + m.edgeStyleSelected.edgePointStyle.radius;
        epStrokeWS.value = '' + m.edgeStyleSelected.edgePointStyle.strokeWidth;
        epStrokeS.value = m.edgeStyleSelected.edgePointStyle.strokeColor;
        epFillS.value = m.edgeStyleSelected.edgePointStyle.fillColor;
        $(edgeStyle).off('change.set').on('change.set', function (e) {
            var mode;
            switch (edgeStyle.value) {
                default:
                    U.pe(true, 'unrecognized edgeMode(', edgeStyle.value, ') among: ', EdgeModes);
                    break;
                case EdgeModes.straight:
                case 'straight':
                    mode = EdgeModes.straight;
                    break;
                case EdgeModes.angular23Auto:
                case 'angular23Auto':
                    mode = EdgeModes.angular23Auto;
                    break;
                case EdgeModes.angular2:
                case 'angular2':
                    mode = EdgeModes.angular2;
                    break;
                case EdgeModes.angular3:
                case 'angular3':
                    mode = EdgeModes.angular3;
                    break;
            }
            m.edgeStyleCommon.style = mode;
            m.edgeStyleHighlight.style = mode;
            m.edgeStyleSelected.style = mode;
            edge.refreshGui();
        });
        $(eColorCommon).off('change.set').on('change.set', function (e) { m.edgeStyleCommon.color = eColorCommon.value; edge.refreshGui(); });
        $(eWidthCommon).off('change.set').on('change.set', function (e) { m.edgeStyleCommon.width = isNaN(+eWidthCommon.value) ? 0 : +eWidthCommon.value; edge.refreshGui(); });
        $(eColorHighlight).off('change.set').on('change.set', function (e) { m.edgeStyleHighlight.color = eColorHighlight.value; edge.refreshGui(); });
        $(eWidthHighlight).off('change.set').on('change.set', function (e) { m.edgeStyleHighlight.width = isNaN(+eWidthHighlight.value) ? 0 : +eWidthHighlight.value; edge.refreshGui(); });
        $(eColorSelected).off('change.set').on('change.set', function (e) { m.edgeStyleSelected.color = eColorSelected.value; edge.refreshGui(); });
        $(eWidthSelected).off('change.set').on('change.set', function (e) { m.edgeStyleSelected.width = isNaN(+eWidthSelected.value) ? 0 : +eWidthSelected.value; edge.refreshGui(); });
        $(epRadiusC).off('change.set').on('change.set', function (e) {
            m.edgeStyleCommon.edgePointStyle.radius = isNaN(+epRadiusC.value) ? 0 : +epRadiusC.value;
            edge.refreshGui();
        });
        $(epStrokeWC).off('change.set').on('change.set', function (e) {
            m.edgeStyleCommon.edgePointStyle.strokeWidth = isNaN(+epStrokeWC.value) ? 0 : +epStrokeWC.value;
            edge.refreshGui();
        });
        $(epStrokeC).off('change.set').on('change.set', function (e) {
            m.edgeStyleCommon.edgePointStyle.strokeColor = epStrokeC.value;
            edge.refreshGui();
        });
        $(epFillC).off('change.set').on('change.set', function (e) {
            m.edgeStyleCommon.edgePointStyle.fillColor = epFillC.value;
            edge.refreshGui();
        });
        $(epRadiusH).off('change.set').on('change.set', function (e) {
            m.edgeStyleHighlight.edgePointStyle.radius = isNaN(+epRadiusH.value) ? 0 : +epRadiusH.value;
            edge.refreshGui();
        });
        $(epStrokeWH).off('change.set').on('change.set', function (e) {
            m.edgeStyleHighlight.edgePointStyle.strokeWidth = isNaN(+epStrokeWH.value) ? 0 : +epStrokeWH.value;
            edge.refreshGui();
        });
        $(epStrokeH).off('change.set').on('change.set', function (e) {
            m.edgeStyleHighlight.edgePointStyle.strokeColor = epStrokeH.value;
            edge.refreshGui();
        });
        $(epFillH).off('change.set').on('change.set', function (e) {
            m.edgeStyleHighlight.edgePointStyle.fillColor = epFillH.value;
            edge.refreshGui();
        });
        $(epRadiusS).off('change.set').on('change.set', function (e) {
            m.edgeStyleSelected.edgePointStyle.radius = isNaN(+epRadiusS.value) ? 0 : +epRadiusS.value;
            edge.refreshGui();
        });
        $(epStrokeWS).off('change.set').on('change.set', function (e) {
            m.edgeStyleSelected.edgePointStyle.strokeWidth = isNaN(+epStrokeWS.value) ? 0 : +epStrokeWS.value;
            edge.refreshGui();
        });
        $(epStrokeS).off('change.set').on('change.set', function (e) {
            m.edgeStyleSelected.edgePointStyle.strokeColor = epStrokeS.value;
            edge.refreshGui();
        });
        $(epFillS).off('change.set').on('change.set', function (e) {
            m.edgeStyleSelected.edgePointStyle.fillColor = epFillS.value;
            edge.refreshGui();
        });
    };
    return StyleEditor;
}());
export { StyleEditor };
//# sourceMappingURL=style-editor.component.js.map