import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { IAttribute, IModel, IPackage, IReference, ModelPiece, Status, U, IClass, EdgeModes, EOperation, EParameter, ViewRule, ViewHtmlSettings } from '../../common/Joiner';
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
        this.clickedLevel = null;
        this.propertyBar = propertyBar;
        this.$root = $root.find('.styleContainer');
        this.$display = this.$root.find('.StyleEditorDisplay');
        this.$templates = this.$root.find('.styleTemplates');
        this.root = this.$root[0];
        this.display = this.$display[0];
        this.templates = this.$templates[0];
    }
    StyleEditor.prototype.onHide = function () {
        this.updateClickedGUIHighlight();
    };
    StyleEditor.prototype.onShow = function () {
        this.propertyBar.onHide();
        this.updateClickedGUIHighlight();
    };
    StyleEditor.prototype.onPaste = function (e) {
        e.preventDefault();
        var div = e.currentTarget;
        var text = e.originalEvent.clipboardData.getData('text/plain');
        text = U.replaceAll(text, '\n', ' ');
        div.innerText = U.replaceAll(text, '\r', ' ');
    };
    StyleEditor.prototype.isVisible = function () { return this.$root.is(':visible'); };
    StyleEditor.prototype.show = function (m, clickedLevel) {
        this.clickedLevel = clickedLevel;
        // console.log('styleShow(', m, ')');
        if (m instanceof IModel) {
            this.showM(m);
            return;
        }
        if (m instanceof IPackage) {
            this.showM(m.parent);
            return;
        }
        // if (m instanceof IPackage) { this.showP(m); return; }
        this.showMP(m, null, false, null);
        return; /*
        if (m instanceof IClass) { this.showC(m); }
        if (m instanceof IAttribute) { this.showA(m); }
        if (m instanceof IReference) { this.showR(m); }
        if (m instanceof EOperation) { this.showO(m); }
        if (m instanceof EParameter) { this.showParam(m); }*/
    };
    StyleEditor.prototype.updateClickedGUIHighlight = function () {
        $(this.propertyBar.model.graph.container).find('.styleEditorSelected').removeClass('styleEditorSelected');
        if (this.isVisible() && this.clickedLevel) {
            this.clickedLevel.classList.add('styleEditorSelected');
        }
    };
    StyleEditor.prototype.getCopyOfTemplate = function (m, s, appendTo, clear) {
        var $html = this.$templates.find('.template' + s);
        var html = U.cloneHtml($html[0]);
        html.classList.remove('template');
        html.dataset.modelPieceID = '' + m.id;
        html.style.display = 'block';
        if (appendTo) {
            if (clear)
                U.clear(appendTo);
            appendTo.appendChild(html);
        }
        $html = $(html).find('.' + (m.getModelRoot().isM() ? 'm1' : 'm2') + 'hide').hide();
        return html;
    };
    StyleEditor.prototype.showM = function (m) {
        console.log('styleShowM(', m, ')');
        var html = this.getCopyOfTemplate(m, '.model', this.display, true);
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
            m.graph.setZoom(+input.value, null);
        });
        $(zoomY).off('change.set').on('change.set', function (e) {
            var input = e.currentTarget;
            m.graph.setZoom(null, +input.value);
        });
        $(showGrid).off('change.set').on('change.set', function (e) {
            var input = e.currentTarget;
            m.graph.ShowGrid(input.checked);
        });
    };
    StyleEditor.prototype.showP = function (m) { U.pe(true, 'styles of Package(', m, '): unexpected.'); };
    StyleEditor.prototype.setStyleEditor = function ($styleown, model, mp, style, templateLevel, indexedPath) {
        var _this = this;
        if (indexedPath === void 0) { indexedPath = null; }
        /// getting the template to fill.
        var debug = false;
        var i;
        var styleowntemplate = $styleown[0];
        var isInherited = styleowntemplate.classList.contains('inherited');
        var isInheritable = styleowntemplate.classList.contains('inheritable');
        var isOwn = styleowntemplate.classList.contains('own');
        U.pe((isInheritable ? 1 : 0 || isInherited ? 1 : 0 || isOwn ? 1 : 0) !== 1, 'failed to get html styleEditor template');
        var tmp = this.getCopyOfTemplate(mp, '.htmlstyle', null, false);
        styleowntemplate.appendChild(tmp);
        styleowntemplate.classList.remove('template');
        // styleowntemplate.parentElement.insertBefore(tmp, styleowntemplate);
        // styleowntemplate.parentElement.removeChild(styleowntemplate);
        styleowntemplate = tmp;
        U.pe(!styleowntemplate.parentElement, 'null parent: ', styleowntemplate, $styleown);
        $styleown = $(styleowntemplate);
        U.pif(debug, 'styleComplexEntry:', style, 'mp:', mp, styleowntemplate, $styleown);
        var obj = {
            editLabel: null,
            editAllowed: null,
            selectstyle: null,
            previewselect: null,
            preview: null,
            input: null,
            detailButton: null,
            detailPanel: null,
            isM1: null,
            isM2: null,
            isClass: null,
            isReference: null,
            isAttribute: null,
            isOperation: null,
            isParameter: null,
            stylename: null,
            forkButton: null,
            delete: null,
            saveasName: null
        };
        //// setting up labelAllowEdit (checking if the (own, inherited or inheritable) style exist or a modelpiece local copy is needed.)
        obj.editAllowed = $styleown.find('button.allowEdit')[0];
        obj.editLabel = $styleown.find('label.allowEdit')[0];
        obj.selectstyle = $styleown.find('select.stylename')[0];
        obj.detailButton = $styleown.find('button.detail')[0];
        obj.detailPanel = $styleown.find('div.detail')[0];
        obj.input = $styleown.find('.html[contenteditable="true"]')[0];
        obj.preview = $styleown.find('.preview')[0];
        obj.previewselect = $styleown.find('select.previewselector')[0];
        var $detail = $styleown.find('div.detail');
        obj.isM1 = $detail.find('.model')[0];
        obj.isM2 = $detail.find('.metamodel')[0];
        obj.isClass = $detail.find('.class')[0];
        obj.isAttribute = $detail.find('.attribute')[0];
        obj.isReference = $detail.find('.reference')[0];
        obj.isOperation = $detail.find('.operation')[0];
        obj.isParameter = $detail.find('.parameter')[0];
        obj.saveasName = $detail.find('input.saveas')[0];
        obj.delete = $detail.find('button.delete')[0];
        obj.forkButton = $detail.find('button.saveas')[0];
        // let inheritableStyle: StyleComplexEntry = isInheritable ? mp.getInheritableStyle() : null;
        // let inheritedStyle: StyleComplexEntry = isInherited ? mp.getInheritedStyle() : null;
        var lastvp = model.getLastView();
        U.pif(debug, 'isOwn && !style.isownhtml || isInherited && !inheritedStyle.html || isInheritable && !inheritableStyle.html)', style);
        U.pif(debug, !style ? '' : isOwn + ' && ' + style.isownhtml + ' || ' + isInherited + ' && ' + style.html + ' || ' + isInheritable + ' && ' + style.html);
        if (!!style && !(isOwn && !style.isownhtml || isInherited && !style.html || isInheritable && !style.html)) {
            $(obj.editLabel).hide();
        }
        else {
            obj.selectstyle.disabled = obj.detailButton.disabled = true;
            obj.input.setAttribute('disabled', 'true');
            obj.input.contentEditable = 'false';
            if (!lastvp) {
                obj.editLabel.innerText = 'Is required to have at least one non-default viewpoint applied to customize styles.';
                obj.editAllowed.style.display = 'none';
            }
            else
                $(obj.editAllowed).on('click', function (e) {
                    var mptarget = isInherited ? mp.metaParent : mp;
                    var v = lastvp.viewsDictionary[mptarget.id];
                    if (!v)
                        v = new ViewRule(lastvp);
                    if (isOwn) {
                        U.pe(!!v.htmlo, 'htmlo should be undefined at this point.');
                        v.htmlo = new ViewHtmlSettings();
                        v.htmlo.setHtmlStr((style ? style.html : mptarget.getStyle().html).outerHTML);
                    }
                    if (isInheritable) {
                        U.pe(!!v.htmli, 'htmli should be undefined at this point.');
                        v.htmli = new ViewHtmlSettings();
                        var instanceCurrentStyle = ModelPiece.GetStyle(Status.status.m, mp.getInstanceClassName());
                        v.htmli.setHtmlStr(instanceCurrentStyle.outerHTML);
                    }
                    if (isInherited) {
                        U.pe(!!v.htmli, 'htmli should be undefined at this point.');
                        v.htmli = new ViewHtmlSettings();
                        v.htmli.setHtmlStr((style ? style.html : mp.getStyle().html).outerHTML);
                    }
                    v.apply(mptarget);
                    _this.showMP(mp);
                    // todo: se stylecomplexEntry è null mostra un altro button.editAllowed per inserire lo stile ereditabile che generi htmli.
                });
            if (!style) {
                if (isInheritable) {
                    obj.editLabel.innerHTML = 'This element does not have a inheritable style.';
                }
                if (isInherited) {
                    obj.editLabel.innerHTML = 'The metaParent of this element does not have a inheritable style appliable to this element.';
                }
                obj.editLabel.appendChild(obj.editAllowed);
                U.clear(styleowntemplate);
                styleowntemplate.appendChild(obj.editLabel);
                return null;
            }
        }
        /// start!
        // obj.is...
        if (model.isM1()) {
            obj.isM1.disabled = obj.isM1.checked = true;
        }
        if (model.isM2()) {
            obj.isM2.disabled = obj.isM2.checked = true;
        }
        if (mp instanceof IClass) {
            obj.isClass.disabled = obj.isClass.checked = true;
        }
        if (mp instanceof IReference) {
            obj.isReference.disabled = obj.isReference.checked = true;
        }
        if (mp instanceof IAttribute) {
            obj.isAttribute.disabled = obj.isAttribute.checked = true;
        }
        if (mp instanceof EOperation) {
            obj.isOperation.disabled = obj.isOperation.checked = true;
        }
        if (mp instanceof EParameter) {
            obj.isParameter.disabled = obj.isParameter.checked = true;
        }
        var styleown = style.htmlobj;
        if (styleown) {
            obj.isM1.checked = styleown.AllowedOnM1;
            obj.isM2.checked = styleown.AllowedOnM2;
            obj.isClass.checked = styleown.allowedOnClass;
            obj.isReference.checked = styleown.allowedOnReference;
            obj.isAttribute.checked = styleown.allowedOnAttribute;
            obj.isOperation.checked = styleown.allowedOnOperation;
            obj.isParameter.checked = styleown.allowedOnParameter;
            $(obj.isM1).on('change', function (e) {
                styleown.AllowedOnM1 = obj.isM1.checked;
                styleown.saveToDB();
            });
            $(obj.isM2).on('change', function (e) {
                styleown.AllowedOnM2 = obj.isM2.checked;
                styleown.saveToDB();
            });
            $(obj.isClass).on('change', function (e) {
                styleown.allowedOnClass = obj.isClass.checked;
                styleown.saveToDB();
            });
            $(obj.isAttribute).on('change', function (e) {
                styleown.allowedOnAttribute = obj.isAttribute.checked;
                styleown.saveToDB();
            });
            $(obj.isReference).on('change', function (e) {
                styleown.allowedOnReference = obj.isReference.checked;
                styleown.saveToDB();
            });
            $(obj.isOperation).on('change', function (e) {
                styleown.allowedOnOperation = obj.isOperation.checked;
                styleown.saveToDB();
            });
            $(obj.isParameter).on('change', function (e) {
                styleown.allowedOnParameter = obj.isParameter.checked;
                styleown.saveToDB();
            });
        }
        else {
            obj.isM1.disabled =
                obj.isM2.disabled =
                    obj.isClass.disabled =
                        obj.isReference.disabled =
                            obj.isAttribute.disabled =
                                obj.isOperation.disabled =
                                    obj.isParameter.disabled = true;
        }
        // main input (html); setup input
        obj.input.setAttribute('placeholder', U.replaceVarsString(mp, obj.input.getAttribute('placeholder')));
        obj.input.innerText = templateLevel.outerHTML;
        $styleown.find('.htmllevel').html((isInherited ? 'Instances Html' : 'Own html')
            + ' (' + (indexedPath && indexedPath.length ? 'Level&nbsp;' + indexedPath.length : 'Root&nbsp;level') + ')');
        var optgroup;
        /*
        preview removed.
        const updatePreview = () => { obj.preview.innerHTML = obj.input.innerText; };
        optgroup = U.toHtml('<optgroup label="' + U.getTSClassName(mp) + '"></optgroup>');
        obj.previewselect.appendChild(optgroup);
        for (i = 0; i < mp.metaParent.instances.length; i++) {
          const peer: ModelPiece = mp.metaParent.instances[i];
          const opt: HTMLOptionElement = document.createElement('option');
          optgroup.appendChild(opt);
          opt.value = '' + peer.id;
          opt.innerText = peer.printableName();
        }*/
        optgroup = U.toHtml('<optgroup label="Compatible Styles"></optgroup>');
        var o = document.createElement('option');
        o.value = 'default';
        o.text = 'default';
        if (style.isGlobalhtml)
            o.selected = true;
        optgroup.append(o);
        // console.log('viewpointSelect: ', mp.views);
        for (i = 0; i < mp.views.length; i++) {
            var v = mp.views[i];
            o = document.createElement('option');
            o.value = '' + v.id;
            o.text = v.getViewPoint().name + ' (own)';
            if (v === style.view)
                o.selected = true;
            optgroup.append(o);
        }
        for (i = 0; mp.metaParent && i < mp.metaParent.views.length; i++) {
            var v = mp.metaParent.views[i];
            o = document.createElement('option');
            o.value = '' + v.id;
            o.text = v.getViewPoint().name + ' (inherited)';
            if (v === style.view)
                o.selected = true;
            optgroup.append(o);
        }
        obj.selectstyle.appendChild(optgroup);
        /*    const styles: ModelPieceStyleEntry[] = Styles.getAllowed(m);
            for (i = 0; i < styles.length; i++) {
              const style: ModelPieceStyleEntry = styles[i];
              const opt: HTMLOptionElement = document.createElement('option');
              optgroup.appendChild(opt);
              opt.innerText = style.name;
              opt.value = style.getKey();
            }
    
        */
        var onStyleChange = function () {
            var inputHtml = U.toHtml(obj.input.innerText);
            // console.log('PRE: ', inputHtml, 'outer:', inputHtml.outerHTML, 'innertext:', obj.input.innerText);
            U.pif(debug, '*** setting inheritable PRE. style.htmlobj:', style.htmlobj, ', style:', style, ', templateLevel:', templateLevel, 'templatelvl.parent:', templateLevel.parentElement, ', inputHtml:', inputHtml);
            if (templateLevel.parentElement) {
                templateLevel.parentElement.insertBefore(inputHtml, templateLevel);
                templateLevel.parentElement.removeChild(templateLevel);
                templateLevel = inputHtml;
            }
            else {
                U.pe(!style.view || style.isGlobalhtml, 'default html cannot be modified.', style, 'todo: automatically make new ClassVieww');
                // ??old message?: se tutto va bene qui deve dare errore, crea una nuova ClassVieww e applicalo al modelpiece ed edita quello.
                style.htmlobj.setHtml(templateLevel = inputHtml);
                U.pif(debug, '*** setting inheritable POST. style.htmlobj', style.htmlobj, 'style:', style);
            }
            if (isOwn) {
                mp.refreshGUI();
            }
            if (isInheritable) {
                mp.refreshInstancesGUI();
            }
            if (isInherited) {
                mp.metaParent.refreshInstancesGUI();
            }
            if (!isInheritable && indexedPath)
                _this.clickedLevel = U.followIndexesPath(mp.getHtmlOnGraph(), indexedPath);
            _this.updateClickedGUIHighlight();
            // obj.input.innerText = inputHtml.outerHTML;
            // DANGER: se lo fai con l'evento onchange() ti sposta il cursore all'inizio e finisci per scrivere rawtext prima dell'html invalidandolo.
            // tenendolo dovresti scrivere i caratteri uno alla volta riposizionando il cursore nel punto giusto ogni volta.
            // console.log('POST: ', inputHtml, 'outer:', inputHtml.outerHTML, 'innertext:', obj.input.innerText);
            // updatePreview();
        };
        $(obj.input).off('paste.set').on('paste.set', function (e /*ClipboardEvent*/) { _this.onPaste(e); onStyleChange(); })
            .off('change.set').on('change.set', onStyleChange)
            .off('input.set').on('input.set', onStyleChange)
            .off('blur.set').on('blur.set', onStyleChange)
            .off('keydown.set').on('keydown.set', function (e) { if (e.key === 'Esc') {
            _this.propertyBar.refreshGUI();
        } });
        obj.selectstyle.disabled = indexedPath && indexedPath.length > 0;
        /*$(obj.selectstyle).on('change', (e: ChangeEvent) => {
          const style: ModelPieceStyleEntry = Styles.getStyleFromKey(obj.selectstyle.value);
          obj.input.innerText = style.htmlstr;
          $(obj.input).trigger('input');
        });*/
        // setup measurable options.
        var ownhtmlinput = $styleown.find('.html[contenteditable="true"]')[0];
        var measurableSelect = $styleown.find('select.attributetypeadd')[0];
        $styleown.find('button.addmeasurable').on('click', function () {
            _this.addmeasurableAttributeButton(measurableSelect, $styleown, mp, style, templateLevel, ownhtmlinput, indexedPath);
        });
        for (i = 0; i < templateLevel.attributes.length; i++) {
            var a = templateLevel.attributes[i];
            if (a.name[0] === '_' || a.name.indexOf('r_') == 0 || a.name.indexOf('r_') == 0) {
                var val = this.clickedLevel.attributes.getNamedItem(a.name.substr(1));
                var style_1 = null;
                this.addmeasurableAttributeButton(measurableSelect, $styleown, mp, style_1, templateLevel, ownhtmlinput, indexedPath, a, val);
            }
        }
        return indexedPath;
    };
    StyleEditor.prototype.showMP = function (m, clickedLevel, asMeasurable, asEdge) {
        var _this = this;
        if (clickedLevel === void 0) { clickedLevel = null; }
        if (asMeasurable === void 0) { asMeasurable = false; }
        if (asEdge === void 0) { asEdge = null; }
        // console.log('styleShow(', m, ', ' + U.getTSClassName(m) + ')');
        var i;
        this.clickedLevel = clickedLevel = clickedLevel || this.clickedLevel;
        // set htmls
        var style = m.getStyle();
        var styleinheritable = m.getInheritableStyle();
        var styleinherited = m.getInheritedStyle();
        var clickedRoot = ModelPiece.getLogicalRootOfHtml(clickedLevel);
        var templateRoot = style.html; // m.styleobj.html;// m.getStyle();
        // let templateLevel: HTMLElement | SVGElement = templateRoot;
        var indexedPath = U.getIndexesPath(clickedLevel, 'parentNode', 'childNodes', clickedRoot);
        // console.log('clickedRoot', clickedRoot, 'clickedLevel', clickedLevel, 'path:', indexedPath);
        U.pe(U.followIndexesPath(clickedRoot, indexedPath, 'childNodes') !== clickedLevel, 'mismatch.', indexedPath);
        var realindexfollowed = { indexFollowed: [], debugArr: [] };
        var templateLevel = U.followIndexesPath(templateRoot, indexedPath, 'childNodes', realindexfollowed);
        // console.log('clickedRoot:',clickedRoot, 'clikedLevel:', clickedLevel, 'indexedPath:', indexedPath, 'followed:', realindexfollowed,
        // 'templateRoot:', templateRoot, 'templateLevel:', templateLevel);
        if (realindexfollowed.indexFollowed.length !== indexedPath.length) {
            indexedPath = realindexfollowed.indexFollowed;
            this.clickedLevel = clickedLevel = U.followIndexesPath(clickedRoot, indexedPath);
        }
        this.updateClickedGUIHighlight();
        // html set END.
        var model = m.getModelRoot();
        if (asEdge && (m instanceof IClass || m instanceof IReference) && m.shouldBeDisplayedAsEdge()) {
            return this.showE(m, asEdge);
        }
        var html = this.getCopyOfTemplate(m, '.modelpiece', this.display, true);
        var $html = $(html);
        var showAsEdge = $html.find('.showAsEdge')[0];
        var showAsEdgeText = $html.find('.showAsEdgeText')[0];
        var $styleown = $html.find('.style.own');
        var $styleInherited = $html.find('.style.inherited');
        var $styleInheritable = $html.find('.style.inheritable');
        //const ownhtml = m.getStyle();
        var htmlPath = this.setStyleEditor($styleown, model, m, style, templateLevel, indexedPath);
        // U.pe(!style.html, $styleown, m, clickedLevel, model, style, instanceshtml);
        // const clickedonStyle: HTMLElement | SVGElement = U.followIndexesPath(style.html, htmlPath) as HTMLElement | SVGElement;
        $html.find('.tsclass').html('' + m.printableName()); // + (htmlDepth === 0 ? ' (root level)' : ' (level&nbsp;' + htmlDepth + ')') );
        // console.log('setStyleEditor inherited, ', styleinherited);
        var inheritedTemplateLevel = null;
        if (styleinherited) {
            var inheritedTemplateRoot = styleinherited.html;
            inheritedTemplateLevel = U.followIndexesPath(inheritedTemplateRoot, indexedPath, 'childNodes', realindexfollowed);
            // se ho cliccato su un non-radice non-ereditato, non posso prendere un frammento dell'ereditato, sarebbe un frammento diverso.
            if (inheritedTemplateLevel !== templateLevel) {
                inheritedTemplateLevel = inheritedTemplateRoot;
            }
        }
        this.setStyleEditor($styleInherited, model, m, styleinherited, inheritedTemplateLevel);
        // console.log('setStyleEditor inheritable, ', styleinheritable);
        var styleInheritableRoot = styleinheritable ? styleinheritable.html : null;
        if (!model.isM1()) {
            this.setStyleEditor($styleInheritable, model, m, styleinheritable, styleInheritableRoot);
        }
        else {
            $styleInheritable[0].innerHTML = '<h5 class="text-danger">M1 elements cannot give inheritance.</h5>';
        }
        U.detailButtonSetup($html);
        // <meta>
        //     <dependency><attributes><type>double</ </ </
        //     <preview><img src=imgurl</img> or html diretto.</
        // </meta>
        // pulsanti per settare preview: "takesnapshotOf / set as example... + select vertex with that style"
        var $arrowup = $html.find('button.arrow.up').on('click', function (e) {
            $(clickedLevel.parentNode).trigger('click');
        });
        $arrowup[0].disabled = htmlPath.length === 0 && m instanceof IClass;
        $html.find('button.arrow.down')[0].disabled = true;
        showAsEdge.checked = false;
        if (m instanceof IClass) {
            showAsEdge.disabled = m.references.length < 2;
            showAsEdgeText.innerHTML = 'Show as an edge' + (showAsEdge.disabled ? ' (require&nbsp;>=&nbsp;2&nbsp;references)' : '');
            $(showAsEdge).off('change.set').on('change.set', function (e) {
                m.shouldBeDisplayedAsEdge(true);
                _this.showE(m, asEdge);
            });
        }
    };
    StyleEditor.prototype.addmeasurableAttributeButton = function (measurableSelect, $styleeditor, m, style, clickedStyle, ownhtmlinput, htmlPath, attr, valAttr) {
        if (attr === void 0) { attr = null; }
        if (valAttr === void 0) { valAttr = null; }
        var val;
        var i;
        var template = this.getCopyOfTemplate(m, '.measurable._root', null, false);
        var $template = $(template);
        var nameinputprefix = $template.find('.nameprefix')[0];
        var nameinput = $template.find('input.name')[0];
        var operator = $template.find('select.operator')[0];
        var left = $template.find('input.leftside')[0];
        var right = $template.find('input.rightside')[0];
        var evaluation = $template.find('input.evaluation')[0];
        var outputErrorLeft = $template.find('.outputerror.left')[0];
        var outputErrorRight = $template.find('.outputerror.right')[0];
        operator.disabled = true;
        operator.selectedIndex = 1;
        right.pattern = '[.]*';
        var setnameinput = function (name) {
            template.dataset.printablename = name;
            nameinput.value = name.substr(nameinput.dataset.prefix.length);
        };
        if (attr) {
            var pos = attr.value.indexOf('=');
            var oplen = 1;
            var operatorstr = void 0;
            if (attr.value[pos] === '>') {
                operatorstr = '>=';
                pos--;
                oplen++;
            }
            else if (attr.value[pos] === '<') {
                operatorstr = '<=';
                pos--;
                oplen++;
            }
            else {
                operatorstr = '=';
            }
            for (i = 0; i < operator.options.length; i++) {
                if (operator.options[i].value === operatorstr) {
                    operator.selectedIndex = i;
                    operatorstr = null;
                }
            }
            U.pe(!!operatorstr, 'option not found in select.', attr.value, operator);
            left.value = attr.value.substr(0, pos);
            right.value = attr.value.substr(pos + oplen);
            evaluation.value = valAttr ? valAttr.value : '';
            if (attr.name.indexOf('d_') === 0) {
                val = 'd_';
            }
            else if (attr.name.indexOf('r_') === 0) {
                val = 'r_';
            }
            else if (attr.name.indexOf('_chainFinal') === 0) {
                val = '_chainFinal';
            }
            else if (attr.name.indexOf('_chain') === 0) {
                val = '_chain';
            }
            else if (attr.name.indexOf('_rule') === 0) {
                val = '_rule';
            }
            else if (attr.name.indexOf('_export') === 0) {
                val = '_export';
            }
            else if (attr.name.indexOf('_import') === 0) {
                val = '_import';
            }
            else if (attr.name.indexOf('_constraint') === 0) {
                val = '_constraint';
            }
            else if (attr.name.indexOf('_dstyle') === 0) {
                val = '_dstyle';
            }
            else if (attr.name.indexOf('_') === 0) {
                val = '_';
            }
            nameinputprefix.innerText = nameinput.dataset.prefix = val;
            setnameinput(attr.name);
        }
        else {
            val = measurableSelect.value;
            // if (measurableSelect.value[0] === '_') {
            var name_1 = measurableSelect.value + 0;
            name_1 = U.increaseEndingNumber(name_1, false, false, function (x) { return !!clickedStyle.attributes.getNamedItem(x); });
            nameinputprefix.innerText = nameinput.dataset.prefix = measurableSelect.value;
            setnameinput(name_1);
            // } else { template.dataset.name = measurableSelect.value + left.value; }
        }
        /*const errormsgleft: {r_:string, d_:string, rule:string, constraint:string, dstyle:string, import:string, export:string, chain:string,
         chainfinal:string}
        = {r_:null, d_:null, rule:null, constraint:null, dstyle:null, import:null, export:null, chain:null, chainfinal:null};
        const errormsgright: {r_:string, d_:string, rule:string, constraint:string, dstyle:string, import:string, export:string, chain:string, chainfinal:string}
        = {r_:null, d_:null, rule:null, constraint:null, dstyle:null, import:null, export:null, chain:null, chainfinal:null};
        errormsgleft.rule = */
        var $input = $(ownhtmlinput);
        var changenamewhile = function (x) { return !!clickedStyle.attributes.getNamedItem(x); };
        var namechanged = function () {
            var oldname = template.dataset.name;
            var oldvalue = clickedStyle.getAttribute(oldname);
            var name = nameinput.dataset.prefix + nameinput.value;
            if (changenamewhile(name)) {
                name = U.increaseEndingNumber(name, false, false, changenamewhile);
            }
            setnameinput(name);
            clickedStyle.removeAttribute(oldname);
            clickedStyle.setAttribute(name, oldvalue);
            style.htmlobj.saveToDB();
        };
        var leftIsValid = function () { return new RegExp(left.pattern).test(left.value); };
        // todo: set template.dataset.name nb: nel caso di d_ e d_ possono cambiare nome dinamicamente
        // todo: rimuovi modelpiece.ownhtml e modelpiece.instancesHtml e sostituiscili con oggetti ModelPieceStyleEntry.
        var attrchanged = function (isr_) {
            if (isr_ === void 0) { isr_ = false; }
            var is_ = left.value === '';
            var attrStr = (isr_ || is_ ? '' : left.value + ' ' + operator.value + ' ') + right.value;
            var templateList = U.removeDuplicates(U.findTemplateList(attrStr));
            var featuredependency = [];
            var i;
            for (i = 0; i < templateList.length; i++) {
                var template_1 = templateList[i];
                var optionsSharp = template_1[1] + template_1[2];
                if (optionsSharp !== '##') {
                    U.pw(true, 'gui debugging of template options different from the default "##" is not currently supported: ' + template_1);
                    continue;
                }
                var replacedArr = U.replaceSingleVarRaw(m, template_1); // last is the final output
                var j = void 0;
                var namesArr = '';
                var typesArr = '';
                for (j = 0; j < replacedArr.length; j++) {
                    namesArr += replacedArr[j].token + '.';
                    var typeDetail = replacedArr[j].value.typeDetail;
                    typesArr += typeDetail.toEcoreString() + '.';
                }
                namesArr = namesArr.substr(0, namesArr.length - 2);
                typesArr = typesArr.substr(0, typesArr.length - 2);
                featuredependency.push({ template: template_1, namesArray: namesArr, typesArray: typesArr });
            }
            style.htmlobj.setDependencyArray(featuredependency);
            if (isr_) {
                clickedStyle.removeAttribute(template.dataset.name);
                template.dataset.printablename = left.value.trim();
                clickedStyle.setAttribute(template.dataset.name, right.value);
            }
            else {
                clickedStyle.setAttribute(template.dataset.name, attrStr);
            }
            $input[0].innerText = clickedStyle.outerHTML;
            $input.trigger('input'); // triggers saveToDB and refreshgui.  style.saveToDB();
        };
        var importleft = function () {
            outputErrorLeft.innerText = '';
            if (leftIsValid())
                return;
            outputErrorLeft.href = 'https://github.com/DamianoNaraku/ModelGraph/wiki/measurable-elements#_import';
            outputErrorLeft.innerText = 'Left side must be one of: width, height, positionRelX, positionRelY, positionAbsX, positionAbsY';
        };
        var ruleleft = function () {
            outputErrorLeft.innerText = '';
            if (leftIsValid())
                return;
            outputErrorLeft.href = 'https://github.com/DamianoNaraku/ModelGraph/wiki/measurable-elements#_rule';
            outputErrorLeft.innerText = 'Left side must be a $##template$';
        };
        var exportleft = function () {
            outputErrorLeft.innerText = '';
            var selector = left.value;
            var valid = false;
            try {
                var matches = m.getVertex() ? $(m.getVertex().getHtml()).find(selector) : [];
                console.log('_export matches: ', matches);
                valid = matches.length > 0;
            }
            catch (e) {
                outputErrorLeft.innerText = ' Exception: ' + JSON.stringify(e);
                console.log('_export or _chain invalid selector: ', e);
                valid = false;
            }
            if (valid)
                return;
            outputErrorLeft.innerText = 'Left side is not matching any element, it must be a jQuery selector.' + outputErrorLeft.innerText;
        };
        var _right = function () {
            var htmldrew = m.getHtmlOnGraph();
            var sameElementInGraph = U.followIndexesPath(htmldrew, htmlPath);
            var result;
            outputErrorRight.innerText = '';
            // todo: pre-validazione dei $##template$ con suggerimenti per similarity e display di tutti i nomi ammissibili se ne trova invalidi.
            try {
                result = U.computeMeasurableAttributeRightPart(right.value, sameElementInGraph.getAttributeNode(template.dataset.name), m, sameElementInGraph);
            }
            catch (e) {
                console.log('Exception on right part:', e);
                outputErrorRight.innerText = 'Exception on right part: ' + e;
            }
            evaluation.value = '' + result;
            return result;
        };
        var constraintRight = function () {
            var result = _right();
            var sameElementInGraph = U.followIndexesPath(m.getHtmlOnGraph(), htmlPath);
            // todo: valuta anche left part e outputta: "true: leftpartcalcolata < rightpartcacolata. eventuali exceptions.";
            // todo: NB: è really incasinato e dovrei cambiare il modo di calcolare il risultato, che non calcola left e right, ma calcola size
            //  required e attuale e vede se sono soddisfacibili con l'operatore.
            return;
        };
        /*
              r_		      str	    any	    /     <-- add dataset to name input.
              d_		      str	    any	    /
              _		        /	      js	    any
              _rule		    $##a$  	js	    any
              _export		  jq	    js	    any
              _chainFinal	export
              _chain		  export
              _constraint	size	  js	    bool	inequality
              _dstyle		  /	      js->css	str
              _import		  size	  js	    any*/
        switch (val) {
            default:
                U.pe(true, 'unexpected select.attributetypeadd value:' + val);
                break;
            case 'r_':
            case 'd_':
                left.placeholder = 'parameter name';
                right.placeholder = 'value';
                right.pattern = '[.]+';
                $(left).on('input', function () { attrchanged(); });
                $(right).on('input', function () { attrchanged(); });
                break;
            case '_rule':
                outputErrorLeft.href = 'https://github.com/DamianoNaraku/ModelGraph/wiki/measurable-elements#_rule';
                left.placeholder = '$##template$';
                left.pattern = '^\$[10#]{2}[.]*\$$'; //semplificato: questo consente anche $ singoli interni al template, normalmente vietati.
                $(left).on('input', function () {
                    attrchanged();
                    setTimeout(ruleleft, 1);
                });
                $(right).on('input', function () {
                    attrchanged();
                    setTimeout(_right, 1);
                });
                break;
            case '_import':
                outputErrorLeft.href = 'https://github.com/DamianoNaraku/ModelGraph/wiki/measurable-elements#_import';
                left.placeholder = 'width | height | positionRelX | positionRelY | positionAbsX | positionAbsY';
                left.pattern = '$width$|^height$|^positionRelX$|^positionRelY$|^positionAbsX$|^positionAbsY$';
                $(left).on('input', function () {
                    attrchanged();
                    setTimeout(importleft, 1);
                });
                $(right).on('input', function () {
                    attrchanged();
                    setTimeout(_right, 1);
                });
                break;
            case '_chain':
            case '_chainFinal':
                outputErrorLeft.href = 'https://github.com/DamianoNaraku/ModelGraph/wiki/measurable-elements#_chainfinal-and-_chain';
                left.placeholder = 'jQuery selector';
                left.pattern = '[.]*';
                $(left).on('input', function () {
                    attrchanged();
                    setTimeout(exportleft, 1);
                });
                break;
            case '_export':
                left.placeholder = 'jQuery selector';
                left.pattern = '[.]*';
                outputErrorLeft.href = 'https://github.com/DamianoNaraku/ModelGraph/wiki/measurable-elements#_export';
                $(left).on('input', function () {
                    attrchanged();
                    setTimeout(exportleft, 1);
                });
                $(right).on('input', function () {
                    attrchanged();
                    setTimeout(_right, 1);
                });
                break;
            case '_dstyle':
                $(right).on('input', function () {
                    attrchanged();
                    setTimeout(_right, 1);
                });
                break;
            case '_':
                $(right).on('input', function () {
                    attrchanged();
                    setTimeout(_right, 1);
                });
                break;
            case '_constraint':
                left.placeholder = 'width | height | positionRelX | positionRelY | positionAbsX | positionAbsY';
                left.pattern = '$width$|^height$|^positionRelX$|^positionRelY$|^positionAbsX$|^positionAbsY$';
                operator.disabled = false;
                $(left).on('input', function () {
                    attrchanged();
                    setTimeout(importleft, 1);
                    setTimeout(constraintRight, 1);
                });
                $(operator).on('change', function () {
                    attrchanged();
                    setTimeout(constraintRight, 1);
                });
                $(right).on('input', function () {
                    attrchanged();
                    setTimeout(constraintRight, 1);
                });
                break;
        }
        $(nameinput).on('input', namechanged);
        var parent = $styleeditor.find('.' + val + 'Container');
        U.pe(!parent.length, 'parent not found:', val, ', editor:', $styleeditor);
        $template.find('.hideOn.' + val).hide();
        parent[0].appendChild(template);
        $template.find('button.delete').on('click', function () {
            clickedStyle.removeAttribute(name);
            parent[0].removeChild(template);
        });
    };
    StyleEditor.prototype.showE = function (m, edge) {
        var index = edge.getIndex();
        console.log('styleShowE(', m, ')');
        var html = this.getCopyOfTemplate(m, '.edge', this.display, true);
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
        $(eColorCommon).off('change.set').on('change.set', function (e) {
            m.edgeStyleCommon.color = eColorCommon.value;
            edge.refreshGui();
        });
        $(eWidthCommon).off('change.set').on('change.set', function (e) {
            m.edgeStyleCommon.width = isNaN(+eWidthCommon.value) ? 0 : +eWidthCommon.value;
            edge.refreshGui();
        });
        $(eColorHighlight).off('change.set').on('change.set', function (e) {
            m.edgeStyleHighlight.color = eColorHighlight.value;
            edge.refreshGui();
        });
        $(eWidthHighlight).off('change.set').on('change.set', function (e) {
            m.edgeStyleHighlight.width = isNaN(+eWidthHighlight.value) ? 0 : +eWidthHighlight.value;
            edge.refreshGui();
        });
        $(eColorSelected).off('change.set').on('change.set', function (e) {
            m.edgeStyleSelected.color = eColorSelected.value;
            edge.refreshGui();
        });
        $(eWidthSelected).off('change.set').on('change.set', function (e) {
            m.edgeStyleSelected.width = isNaN(+eWidthSelected.value) ? 0 : +eWidthSelected.value;
            edge.refreshGui();
        });
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