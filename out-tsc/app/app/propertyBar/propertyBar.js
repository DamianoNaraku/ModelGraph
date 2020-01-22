import { U, M2Class, AttribETypes, Status, StyleEditor, EType, MAttribute, MReference, MPackage, Model, MClass, MetaModel, M2Reference, M2Attribute, M2Package } from '../common/Joiner';
var PropertyBarr = /** @class */ (function () {
    function PropertyBarr(model) {
        this.model = null;
        this.styleEditor = null;
        this.model = model;
        this.selectedModelPiece = null;
        // todo: model.graph.    shell = null
        var $root = this.get$root();
        this.container = $root.find('#propertySidebarCurrentContent')[0];
        this.templateContainer = $root.find('#propertySidebarTemplates')[0];
        U.pe(!this.container, 'property bar shell not found in: ', $root);
        U.pe(!this.templateContainer, 'property bar template shell not found in: ', $root);
        this.styleEditor = new StyleEditor(this, $root);
    }
    PropertyBarr.AddEventListeners = function (html) {
        var $html = $(html);
        $html.find('.minimizer').off('click.minimizeTemplate').on('click.minimizeTemplate', function (e) { PropertyBarr.templateMinimizerClick(e); });
    };
    PropertyBarr.templateMinimizerClick = function (e) {
        var minimizer = e.currentTarget;
        var templatee = minimizer;
        while (!templatee.classList.contains('template')) {
            templatee = templatee.parentNode;
        }
        templatee.classList.add('minimized');
        $(templatee).off('click.maximizeTemplate').on('click.maximizeTemplate', function (ee) { PropertyBarr.templateMaximizerClick(ee); });
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
    };
    PropertyBarr.templateMaximizerClick = function (e) {
        var templatee = e.currentTarget;
        templatee.classList.remove('minimized');
    };
    PropertyBarr.getcopy = function (node, selector) { return U.cloneHtml($(node).find(selector)[0]); };
    PropertyBarr.makeClassListSelector = function (m, selectHtml, selectedClass) {
        // const m: IModel = o.getModelRoot();
        if (!m || !m.isMM()) {
            m = Status.status.mm;
        }
        // U.pe(m.isM(), 'should not be used for models.');
        if (selectHtml === null) {
            selectHtml = document.createElement('select');
        }
        var classes = m.getAllClasses();
        var optgrp = document.createElement('optgroup');
        optgrp.label = 'Classes';
        selectHtml.appendChild(optgrp);
        var optionFound = false;
        var i;
        for (i = 0; i < classes.length; i++) { // todo wrong
            var opt = document.createElement('option');
            opt.value = classes[i].fullname();
            opt.innerHTML = classes[i].fullname();
            if (selectedClass && classes[i].fullname() === selectedClass.fullname()) {
                opt.selected = true;
                optionFound = true;
            }
            optgrp.appendChild(opt);
        }
        U.pe(!optionFound, 'reference selected class option not found; optgrp:', optgrp, 'classes:', classes, ', searching:', selectedClass);
        return selectHtml;
    };
    PropertyBarr.makePrimitiveTypeSelector = function (selectHtml, selectedType) {
        if (selectHtml === null) {
            selectHtml = document.createElement('select');
        }
        var optgrp = document.createElement('optgroup');
        optgrp.label = 'Primitive Types';
        selectHtml.appendChild(optgrp);
        var optionFound = false;
        // const extendedAttribETypes = U.getExtendedAttribETypes();
        for (var typestr in EType.shorts) {
            if (!EType.shorts[typestr]) {
                continue;
            }
            var etype = EType.shorts[typestr];
            // if (! AttribETypes[type] ) { continue; } // ide requires a filter
            var opt = document.createElement('option');
            opt.value = etype.short;
            opt.innerHTML = etype.name;
            // if (selectedType) { console.log(type, '===', selectedType, ' ? => ', (selectedType && type === selectedType));
            // } else { console.log('not selecting any type.'); }
            if (selectedType && etype === selectedType) {
                opt.selected = true;
                optionFound = true;
            }
            optgrp.appendChild(opt);
        }
        U.pe(selectedType && !optionFound, 'attribute primitive selected class option not found; optgrp:', optgrp, ' attribETypes:', AttribETypes, 'typeArrSearchShort:', EType.shorts, ', searchedVal:', selectedType);
        return selectHtml;
    };
    PropertyBarr.prototype.addEventListeners = function () { PropertyBarr.AddEventListeners(this.container); };
    PropertyBarr.prototype.get$root = function () {
        var TabRootHtml = this.model.graph.container;
        console.log('TabRootHtml:', TabRootHtml);
        while (!TabRootHtml.classList.contains('UtabContent')) {
            TabRootHtml = TabRootHtml.parentNode;
        }
        // if (this.model === Status.status.mm) { $root = $('#mmproperty_sidebar'); } else { $root = $('mproperty_sidebar'); }
        var $ret = $(TabRootHtml).find('.propertyBarContainer');
        U.pe($ret.length !== 1, 'pbar container not found:', $ret);
        return $ret;
    };
    PropertyBarr.prototype.updateRaw = function (o) {
        if (o === void 0) { o = null; }
        var $root = this.get$root();
        var textArea = this.rawTextArea = $root.find('.rawecore')[0];
        if (!textArea) {
            return;
        }
        textArea.value = o.generateModelString();
    };
    PropertyBarr.prototype.show = function (o) {
        if (o === void 0) { o = null; }
        o = this.selectedModelPiece = o || this.selectedModelPiece;
        if (!o) {
            return;
        }
        console.log('PropertyBar.show: ', o);
        this.styleEditor.show(o);
        U.clear(this.container);
        this.updateRaw(o);
        if (false && false) {
        }
        else if (o instanceof Model) {
            this.container.append(this.getM_I(o, this.templateContainer));
        }
        else if (o instanceof MPackage) {
            this.container.append(this.getP_I(o, this.templateContainer));
        }
        else if (o instanceof MClass) {
            this.container.append(this.getC_I(o, this.templateContainer));
        }
        else if (o instanceof MAttribute) {
            this.container.append(this.getA_I(o, this.templateContainer));
        }
        else if (o instanceof MReference) {
            this.container.append(this.getR_I(o, this.templateContainer));
        }
        else if (o instanceof MetaModel) {
            this.container.append(this.getM_I(o, this.templateContainer));
        }
        else if (o instanceof M2Package) {
            this.container.append(this.getP_I(o, this.templateContainer));
        }
        else if (o instanceof M2Class) {
            this.container.append(this.getC_I(o, this.templateContainer));
        }
        else if (o instanceof M2Attribute) {
            this.container.append(this.getA_I(o, this.templateContainer));
        }
        else if (o instanceof M2Reference) {
            this.container.append(this.getR_I(o, this.templateContainer));
        }
        else {
            U.pe(true, 'invalid ModelPiece type instance: ', o);
        }
        this.addEventListeners();
    };
    PropertyBarr.prototype.getM_I = function (o, templateContainer) {
        var html = PropertyBarr.getcopy(templateContainer, '.template.model');
        var $html = $(html);
        var nameHtml = $html.find('input.modelName')[0];
        var nsHtml = $html.find('input.namespace')[0];
        var uriHtml = $html.find('input.uri')[0];
        nameHtml.value = o.name ? o.name : '';
        nsHtml.value = o.namespace();
        uriHtml.value = o.uri();
        $(nameHtml).off('change.pbar').on('change.pbar', function (e) { o.setName(nameHtml.value); });
        $(uriHtml).off('change.pbar').on('change.pbar', function (e) { o.uri(uriHtml.value); });
        $(nsHtml).off('change.pbar').on('change.pbar', function (e) { o.namespace(nsHtml.value); });
        var pkgListHtml = ($html.find('.packageList')[0]);
        var i;
        for (i = 0; i < o.childrens.length; i++) {
            pkgListHtml.appendChild(this.getP_I(o.childrens[i], templateContainer));
        }
        return html;
    };
    PropertyBarr.prototype.getP_I = function (o, templateContainer) {
        var html = PropertyBarr.getcopy(templateContainer, '.template.package');
        var $html = $(html);
        $html.find((Status.status.isM() ? '.m1' : '.m2') + 'disable').attr('disabled');
        $html.find((Status.status.isM() ? '.m1' : '.m2') + 'hide').hide();
        var classListHtml = ($html.find('.classList')[0]);
        var i;
        for (i = 0; i < o.childrens.length; i++) {
            classListHtml.appendChild(this.getC_I(o.childrens[i], templateContainer));
        }
        // package own properties (sembra ci sia solo il name)
        var nameHtml = $html.find('input.packageName')[0];
        nameHtml.value = o.name;
        $(nameHtml).off('change.pbar').on('change.pbar', function (evt) {
            var input = evt.currentTarget;
            console.log('value:', input.value, 'inputHtml:', input, 'evt:', evt);
            o.setName(input.value, false);
        });
        return html;
    };
    PropertyBarr.prototype.getC_I = function (o, templateContainer) {
        var _this = this;
        var html = PropertyBarr.getcopy(templateContainer, '.template.class');
        var $html = $(html);
        $html.find((Status.status.isM() ? '.m1' : '.m2') + 'disable').attr('disabled');
        $html.find((Status.status.isM() ? '.m1' : '.m2') + 'hide').hide();
        var i;
        var attribListHtml = ($html.find('.attributeList')[0]);
        var refListHtml = ($html.find('.referenceList')[0]);
        var featureHtml;
        for (i = 0; i < o.attributes.length; i++) {
            if (o instanceof M2Class) {
                featureHtml = this.getA_I(o.attributes[i], templateContainer);
            }
            if (o instanceof MClass) {
                featureHtml = this.getA_I(o.attributes[i], templateContainer);
            }
            attribListHtml.appendChild(featureHtml);
        }
        for (i = 0; i < o.references.length; i++) {
            if (o instanceof M2Class) {
                featureHtml = this.getR_I(o.references[i], templateContainer);
            }
            if (o instanceof MClass) {
                featureHtml = this.getR_I(o.references[i], templateContainer);
            }
            refListHtml.appendChild(featureHtml);
        }
        // class own properties (sembra ci sia solo il name)
        var nameHtml = $html.find('input.className')[0];
        // Se M2Class
        if (o instanceof M2Class) {
            nameHtml.value = o.name;
            $(nameHtml).off('change.pbar').on('change.pbar', function (evt) {
                var input = evt.currentTarget;
                o.setName(input.value, true);
            });
            return html;
        }
        /// Se MClass
        var classe = o;
        var isRoot = ($html.find('input.isRoot')[0]);
        isRoot.disabled = isRoot.checked = classe.isRoot();
        nameHtml.value = classe.metaParent.name;
        nameHtml.disabled = true;
        $(isRoot).off('change.pbar').on('change.pbar', function (evt) {
            var input = evt.currentTarget;
            if (!input.checked) {
                input.checked = true;
                return;
            }
            classe.setRoot(input.checked);
            classe.refreshGUI();
            _this.refreshGUI();
        });
        return html;
    };
    PropertyBarr.prototype.getR_I = function (o, templateContainer) {
        var metamodel = o.getm2();
        var html = PropertyBarr.getcopy(templateContainer, '.template.reference');
        var $html = $(html);
        $html.find((Status.status.isM() ? '.m1' : '.m2') + 'disable').attr('disabled');
        $html.find((Status.status.isM() ? '.m1' : '.m2') + 'hide').hide();
        // todo ref own properties
        var nameHtml = $html.find('input.referenceName')[0];
        nameHtml.value = o.name;
        var htmlUpperBound = $html.find('input.referenceUpperBound')[0];
        if (o.getUpperbound() !== null) {
            htmlUpperBound.value = '' + o.getUpperbound();
        }
        else {
            htmlUpperBound.placeholder = '1';
        }
        var htmlLowerBound = $html.find('input.referenceUpperBound')[0];
        if (o.getLowerbound() !== null) {
            htmlLowerBound.value = '' + o.getLowerbound();
        }
        else {
            htmlLowerBound.placeholder = '1';
        }
        var htmlContainment = $html.find('input.referenceContainment')[0];
        htmlContainment.checked = o.isContainment();
        var selectType = $html.find('select.referenceType')[0];
        U.clear(selectType);
        PropertyBarr.makeClassListSelector(metamodel, selectType, o.getM2Target());
        if (o instanceof MReference) {
            return html;
        }
        var ref = o;
        $(selectType).off('change.pbar').on('change.pbar', function (evt) {
            var target = evt.currentTarget;
            ref.link(target.value);
        });
        // todo: add events on change
        $(nameHtml).off('change.pbar').on('change.pbar', function (evt) {
            var input = evt.currentTarget;
            ref.setName(input.value, true);
        });
        $(htmlContainment).off('change.pbar').on('change.pbar', function (evt) {
            var target = evt.currentTarget;
            ref.setContainment(target.checked);
            ref.refreshGUI();
        });
        $(htmlUpperBound).off('change.pbar').on('change.pbar', function (evt) {
            var target = evt.currentTarget;
            ref.setUpperBound(+target.value);
            ref.refreshGUI();
        });
        $(htmlLowerBound).off('change.pbar').on('change.pbar', function (evt) {
            var target = evt.currentTarget;
            ref.setLowerBound(+target.value);
            ref.refreshGUI();
        });
        return html;
    };
    PropertyBarr.prototype.getA_I = function (o, templateContainer) {
        var html = PropertyBarr.getcopy(templateContainer, '.attribute.template');
        var $html = $(html);
        $html.find((Status.status.isM() ? '.m1' : '.m2') + 'disable').attr('disabled');
        $html.find((Status.status.isM() ? '.m1' : '.m2') + 'hide').hide();
        var nameHtml = $html.find('input.attributeName')[0];
        var typeHtml = $html.find('select.attributeType')[0];
        U.clear(typeHtml);
        PropertyBarr.makePrimitiveTypeSelector(typeHtml, o.getType());
        // Se M2Attribute
        if (o instanceof M2Attribute) {
            nameHtml.value = o.name;
            $(nameHtml).off('change.pbar').on('change.pbar', function (evt) {
                var input = evt.currentTarget;
                o.setName(input.value, true);
            });
            $(typeHtml).off('change.pbar').on('change.pbar', function (evt) {
                var target = evt.currentTarget;
                o.setType(EType.get(target.value));
                o.refreshGUI();
            });
            return html;
        }
        // Se MAttribute
        var attr = o;
        var valueHtml = $html.find('.attributeValue')[0];
        nameHtml.value = attr.metaParent.name;
        nameHtml.disabled = typeHtml.disabled = true;
        U.pe(!valueHtml, attr, $html, templateContainer);
        valueHtml.value = attr.getValueStr();
        $(valueHtml).off('change.pbar').on('change.pbar', function (evt) {
            var input = evt.currentTarget;
            attr.setValueStr(input.value);
            attr.refreshGUI();
        });
        return html;
    };
    PropertyBarr.prototype.refreshGUI = function () { this.show(this.selectedModelPiece); };
    return PropertyBarr;
}());
export { PropertyBarr };
//# sourceMappingURL=propertyBar.js.map