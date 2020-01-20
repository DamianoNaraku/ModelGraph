import { U, IModel, IPackage, IAttribute, IClass, IReference, AttribETypes } from '../common/Joiner';
var PropertyBarr = /** @class */ (function () {
    function PropertyBarr(model) {
        this.model = null;
        this.model = model;
        this.selectedModelPiece = null;
        // todo: model.graph.    container = null
        var $root = this.get$root();
        this.container = $root.find('#propertySidebarCurrentContent')[0];
        this.templateContainer = $root.find('#propertySidebarTemplates')[0];
        U.pe(!this.container, 'property bar container not found in: ', $root);
        U.pe(!this.templateContainer, 'property bar template container not found in: ', $root);
    }
    PropertyBarr.AddEventListeners = function (html) {
        var $html = $(html);
        $html.find('.minimizer').off('click.minimizeTemplate').on('click.minimizeTemplate', function (e) { PropertyBarr.templateMinimizerClick(e); });
    };
    PropertyBarr.templateMinimizerClick = function (e) {
        var minimizer = e.currentTarget;
        var template = minimizer;
        while (!template.classList.contains('template')) {
            template = template.parentNode;
        }
        template.classList.add('minimized');
        $(template).off('click.maximizeTemplate').on('click.maximizeTemplate', function (ee) { PropertyBarr.templateMaximizerClick(ee); });
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
    };
    PropertyBarr.templateMaximizerClick = function (e) {
        var template = e.currentTarget;
        template.classList.remove('minimized');
    };
    PropertyBarr.getcopy = function (node, selector) { return U.cloneHtml($(node).find(selector)[0]); };
    PropertyBarr.makeClassListSelector = function (m, selectHtml, selectedClass) {
        // const m: IModel = o.getModelRoot();
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
            opt.value = classes[i].fullname;
            opt.innerHTML = classes[i].fullname;
            if (selectedClass && classes[i].fullname === selectedClass.fullname) {
                opt.selected = true;
                optionFound = true;
            }
            optgrp.appendChild(opt);
        }
        U.pe(!optionFound, 'reference selected class option not found; optgrp:', optgrp, 'classes:', classes);
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
        for (var type in AttribETypes) {
            // if (! AttribETypes[type] ) { continue; } // ide requires a filter
            var opt = document.createElement('option');
            opt.value = type;
            opt.innerHTML = type;
            // if (selectedType) { console.log(type, '===', selectedType, ' ? => ', (selectedType && type === selectedType));
            // } else { console.log('not selecting any type.'); }
            if (selectedType && (type === selectedType || U.getShortTypeName(selectedType) === type)) {
                opt.selected = true;
                optionFound = true;
            }
            optgrp.appendChild(opt);
        }
        U.pe(!optionFound, 'attribute primitive selected class option not found; optgrp:', optgrp, ' attribETypes:', AttribETypes);
        return selectHtml;
    };
    PropertyBarr.prototype.addEventListeners = function () { PropertyBarr.AddEventListeners(this.container); };
    PropertyBarr.prototype.get$root = function () {
        var TabRootHtml = this.model.graph.container;
        while (!TabRootHtml.classList.contains('tabContent')) {
            TabRootHtml = TabRootHtml.parentNode;
        }
        // if (this.model === Status.status.mm) { $root = $('#mmproperty_sidebar'); } else { $root = $('mproperty_sidebar'); }
        return $(TabRootHtml);
    };
    PropertyBarr.prototype.tryUpdatingRaws = function () { this.updateRaw(this.selectedModelPiece); };
    PropertyBarr.prototype.updateRaw = function (o) {
        if (!o) {
            return;
        }
        this.selectedModelPiece = o;
        var $root = this.get$root();
        var textArea = this.rawTextArea = $root.find('.rawecore')[0];
        if (!textArea) {
            return;
        }
        textArea.value = JSON.stringify(o.json);
    };
    PropertyBarr.prototype.show = function (modelPiece) {
        if (modelPiece instanceof IModel) {
            return this.showM(modelPiece);
        }
        if (modelPiece instanceof IPackage) {
            return this.showP(modelPiece);
        }
        if (modelPiece instanceof IClass) {
            return this.showC(modelPiece);
        }
        if (modelPiece instanceof IAttribute) {
            return this.showA(modelPiece);
        }
        if (modelPiece instanceof IReference) {
            return this.showR(modelPiece);
        }
        U.pe(true, 'invalid ModelPiece type instance: ', modelPiece);
    };
    PropertyBarr.prototype.showM = function (o) {
        this.updateRaw(o);
        U.clear(this.container);
        this.container.append(this.getM(o, this.templateContainer));
        this.addEventListeners();
    };
    PropertyBarr.prototype.showP = function (o) {
        this.updateRaw(o);
        U.clear(this.container);
        this.container.append(this.getP(o, this.templateContainer));
        this.addEventListeners();
    };
    PropertyBarr.prototype.showC = function (o) {
        this.updateRaw(o);
        U.clear(this.container);
        this.container.append(this.getC(o, this.templateContainer));
        this.addEventListeners();
    };
    PropertyBarr.prototype.showR = function (o) {
        this.updateRaw(o);
        U.clear(this.container);
        this.container.append(this.getR(o, this.templateContainer));
        this.addEventListeners();
    };
    PropertyBarr.prototype.showA = function (o) {
        this.updateRaw(o);
        U.clear(this.container);
        this.container.append(this.getA(o, this.templateContainer));
        this.addEventListeners();
    };
    PropertyBarr.prototype.getM = function (o, templateContainer) {
        var _this = this;
        console.log('getM()', o, templateContainer);
        var html = PropertyBarr.getcopy(templateContainer, '#modelTemplate');
        var $html = $(html);
        var nameHtml = $html.find('input.modelName')[0];
        nameHtml.value = o.name;
        $(nameHtml).off('change.pbar').on('change.pbar', function (evt) {
            var input = evt.currentTarget;
            _this.model.setName(input.value);
        });
        var pkgListHtml = ($html.find('.packageList')[0]);
        var i;
        for (i = 0; i < o.childrens.length; i++) {
            pkgListHtml.appendChild(this.getP(o.childrens[i], templateContainer));
        }
        return html;
    };
    PropertyBarr.prototype.getRaw = function (o, templateContainer) {
        var html = PropertyBarr.getcopy(templateContainer, '#rawjsonTemplate');
        var $html = $(html);
        var jsonIndentSpaces = 4;
        var replacer = function (key, value) { if (key === 'logical') {
            return undefined;
        }
        else {
            return value;
        } };
        var rawStr = JSON.stringify(o.json, replacer, jsonIndentSpaces);
        html.innerHTML = rawStr;
        return html;
    };
    PropertyBarr.prototype.getP = function (o, templateContainer) {
        var html = PropertyBarr.getcopy(templateContainer, '#packageTemplate');
        var $html = $(html);
        var classListHtml = ($html.find('.classList')[0]);
        var i;
        for (i = 0; i < o.childrens.length; i++) {
            classListHtml.appendChild(this.getC(o.childrens[i], templateContainer));
        }
        // package own properties (sembra ci sia solo il name)
        var nameHtml = $html.find('input.packageName')[0];
        nameHtml.value = o.name;
        $(nameHtml).off('change.pbar').on('change.pbar', function (evt) {
            var input = evt.currentTarget;
            console.log('value:', input.value, 'inputHtml:', input, 'evt:', evt);
            o.setName(input.value);
        });
        return html;
    };
    PropertyBarr.prototype.getC = function (o, templateContainer) {
        var html = PropertyBarr.getcopy(templateContainer, '#classTemplate');
        var $html = $(html);
        var i;
        var attribListHtml = ($html.find('.attributeList')[0]);
        for (i = 0; i < o.attributes.length; i++) {
            attribListHtml.appendChild(this.getA(o.attributes[i], templateContainer));
        }
        var refListHtml = ($html.find('.referenceList')[0]);
        for (i = 0; i < o.references.length; i++) {
            refListHtml.appendChild(this.getR(o.references[i], templateContainer));
        }
        // class own properties (sembra ci sia solo il name)
        var nameHtml = $html.find('input.className')[0];
        nameHtml.value = o.name;
        $(nameHtml).off('change.pbar').on('change.pbar', function (evt) {
            var input = evt.currentTarget;
            o.setName(input.value);
        });
        return html;
    };
    PropertyBarr.prototype.getR = function (o, templateContainer) {
        var html = PropertyBarr.getcopy(templateContainer, '#referenceTemplate');
        var $html = $(html);
        // todo ref own properties
        var nameHtml = $html.find('input.referenceName')[0];
        nameHtml.value = o.name;
        var htmlUpperBound = $html.find('input.referenceUpperBound')[0];
        if (o.upperbound !== null) {
            htmlUpperBound.value = '' + o.upperbound;
        }
        else {
            htmlUpperBound.placeholder = '1';
        }
        var htmlLowerBound = $html.find('input.referenceUpperBound')[0];
        if (o.lowerbound !== null) {
            htmlLowerBound.value = '' + o.lowerbound;
        }
        else {
            htmlLowerBound.placeholder = '1';
        }
        var htmlContainment = $html.find('input.referenceContainment')[0];
        if (o.containment !== null) {
            htmlContainment.checked = o.containment;
        }
        else {
            htmlContainment.checked = false;
        }
        var model = o.getModelRoot();
        var selectType = $html.find('select.referenceType')[0];
        U.clear(selectType);
        PropertyBarr.makeClassListSelector(model, selectType, o.target);
        $(selectType).off('change.pbar').on('change.pbar', function (evt) {
            var target = evt.currentTarget;
            o.setTarget(model.getClass(target.value));
        });
        // todo: add events on change
        $(nameHtml).off('change.pbar').on('change.pbar', function (evt) {
            var input = evt.currentTarget;
            o.setName(input.value);
        });
        $(htmlContainment).off('change.pbar').on('change.pbar', function (evt) {
            var target = evt.currentTarget;
            o.setContainment(target.checked);
        });
        $(htmlUpperBound).off('change.pbar').on('change.pbar', function (evt) {
            var target = evt.currentTarget;
            o.setUpperBound(+target.value);
        });
        $(htmlLowerBound).off('change.pbar').on('change.pbar', function (evt) {
            var target = evt.currentTarget;
            o.setLowerBound(+target.value);
        });
        return html;
    };
    PropertyBarr.prototype.getA = function (o, templateContainer) {
        var html = PropertyBarr.getcopy(templateContainer, '#attributeTemplate');
        var $html = $(html);
        var nameHtml = $html.find('input.attributeName')[0];
        nameHtml.value = o.name;
        $(nameHtml).off('change.pbar').on('change.pbar', function (evt) {
            var input = evt.currentTarget;
            o.setName(input.value);
        });
        var model = o.getModelRoot();
        var selectType = $html.find('select.attributeType')[0];
        U.clear(selectType);
        PropertyBarr.makePrimitiveTypeSelector(selectType, o.type);
        $(selectType).off('change.pbar').on('change.pbar', function (evt) {
            var target = evt.currentTarget;
            o.setType(U.getPrimitiveType(target.value));
        });
        return html;
    };
    return PropertyBarr;
}());
export { PropertyBarr };
//# sourceMappingURL=propertyBar.js.map