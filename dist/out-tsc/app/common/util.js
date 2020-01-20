import * as tslib_1 from "tslib";
import { ModelPiece, XMIModel, Status, ECoreClass, ECorePackage, ECoreRoot, ECoreOperation, MAttribute, } from './Joiner';
var Dictionary = /** @class */ (function (_super) {
    tslib_1.__extends(Dictionary, _super);
    function Dictionary() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Dictionary;
}(Object));
export { Dictionary };
import * as detectzoooom from 'detect-zoom';
import { ECoreAnnotation, ECoreEnum } from '../Model/iModel';
var MeasurableArrays = /** @class */ (function () {
    function MeasurableArrays() {
    }
    return MeasurableArrays;
}());
export { MeasurableArrays };
var myFileReader = /** @class */ (function () {
    function myFileReader() {
    }
    // constructor(onchange: (e: ChangeEvent) => void = null, fileTypes: FileReadTypeEnum[] | string[] = null) { myFileReader.setinfos(fileTypes, onchange); }
    myFileReader.setinfos = function (fileTypes, onchange, readcontent) {
        if (fileTypes === void 0) { fileTypes = null; }
        myFileReader.fileTypes = (fileTypes || myFileReader.fileTypes);
        console.log('fileTypes:', myFileReader.fileTypes, fileTypes);
        myFileReader.input = document.createElement('input');
        var input = myFileReader.input;
        myFileReader.onchange = function (e) {
            if (!readcontent) {
                onchange(e, input.files, null);
                return;
            }
            var contentObj = {};
            var fileLetti = 0;
            var _loop_1 = function (i) {
                var f = input.files[i];
                console.log('filereadContent[' + i + ']( file:', f, ')');
                U.fileReadContent(f, function (content) {
                    console.log('file[' + i + '] read complete. done: ' + (1 + fileLetti) + ' / ' + input.files.length, 'contentObj:', contentObj);
                    contentObj[i] = content; // cannot use array, i'm not sure the callbacks will be called in order. using push is safer but could alter order.
                    // this is last file to read.
                    if (++fileLetti === input.files.length) {
                        var contentArr = [];
                        for (var j = 0; j < input.files.length; j++) {
                            contentArr.push(contentObj[j]);
                        }
                        onchange(e, input.files, contentArr);
                    }
                });
            };
            for (var i = 0; i < input.files.length; i++) {
                _loop_1(i);
            }
        } || myFileReader.onchange;
    };
    myFileReader.reset = function () {
        myFileReader.fileTypes = null;
        myFileReader.onchange = null;
        myFileReader.input = null;
    };
    myFileReader.show = function (onChange, extensions, readContent) {
        if (extensions === void 0) { extensions = null; }
        myFileReader.setinfos(extensions, onChange, readContent);
        myFileReader.input.setAttribute('type', 'file');
        if (myFileReader.fileTypes) {
            var filetypestr = '';
            var sepkey = U.getStartSeparatorKey();
            for (var i = 0; i < myFileReader.fileTypes.length; i++) {
                filetypestr += U.startSeparator(sepkey, ',') + myFileReader.fileTypes[i];
            }
            myFileReader.input.setAttribute('accept', filetypestr);
        }
        console.log('fileTypes:', myFileReader.fileTypes, 'input:', myFileReader.input);
        $(myFileReader.input).on('change.custom', myFileReader.onchange).trigger('click');
        myFileReader.reset();
    };
    return myFileReader;
}());
export { myFileReader };
var InputPopup = /** @class */ (function () {
    function InputPopup(title, txtpre, txtpost, event /* array of (['oninput', onInputFunction])*/, placeholder, value, inputType, inputSubType) {
        if (placeholder === void 0) { placeholder = null; }
        if (inputType === void 0) { inputType = 'input'; }
        if (inputSubType === void 0) { inputSubType = null; }
        var value0 = value;
        if (!value) {
            value = '';
        }
        var id = 'popup_' + InputPopup.popupCounter++;
        placeholder = (placeholder ? 'placeholder="' + placeholder + '"' : '');
        inputSubType = (inputSubType ? 'type = "' + inputSubType + '"' : '');
        var innerValue;
        if (inputType.toLowerCase() === 'textarea') {
            innerValue = U.replaceAll(U.replaceAll(value, '<', '&lt;'), '>', '&gt;');
            innerValue += '</' + inputType + '>';
            value = '';
        }
        else {
            value = value === '' ? '' : 'value="' + U.replaceAll(value, '"', '&quot;') + '"';
            innerValue = '';
        }
        var container = U.toHtml('' +
            '<div _ngcontent-c3="" data-closebuttontarget="' + id + '" class="screenWideShadow" style="display: none;">' +
            '<div _ngcontent-c3="" class="popupContent">' +
            '<h1 _ngcontent-c3="" style="text-align: center;">' + title + '</h1>' +
            '<button _ngcontent-c3="" class="closeButton" data-closebuttontarget="' + id + '">X</button>' +
            '<br _ngcontent-c3="">' +
            '<div _ngcontent-c3="" class="TypeList">' +
            '<table class="typeTable"><tbody>' +
            '<tr class="typeRow"><td class="alias textPre">' + txtpre + '</td>' +
            '<' + inputType + ' ' + inputSubType + ' ' + placeholder + ' ' + value + ' class="form-control popupInput" ' +
            'aria-label="Small" aria-describedby="inputGroup-sizing-sm">' + innerValue + txtpost +
            '</td>' +
            '</tr>' +
            '</tbody></table></div>' +
            '</div></div>');
        var $input = $(container).find('input');
        U.closeButtonSetup($(container));
        var i = -1;
        while (++i < event.length) {
            var currentEvt = event[i];
            $input.on(currentEvt[0], currentEvt[1]);
        }
        this.html = container;
        if (inputType === 'textarea') {
            this.getInputNode()[0].setAttribute('style', 'width: calc(75vw - 152px); height: calc(75vh - 200px);');
        }
        this.show();
    }
    InputPopup.prototype.getInputNode = function () { return $(this.html).find('.popupInput'); };
    InputPopup.prototype.show = function () {
        document.body.appendChild(this.html);
        this.html.style.display = 'block';
    };
    InputPopup.prototype.hide = function () { this.html.style.display = 'none'; };
    InputPopup.prototype.destroy = function () {
        if (this.html && this.html.parentNode) {
            this.html.parentNode.removeChild(this.html);
            return this.html = null;
        }
    };
    InputPopup.prototype.addOkButton = function (load1, finish) {
        var input = this.getInputNode()[0];
        var button = document.createElement('button');
        button.innerText = 'Confirm';
        var size = U.sizeof(button);
        button.style.left = 'calc( 50% - ' + size.w / 2 + 'px);';
        input.parentNode.appendChild(button);
        $(button).on('click.btnclickpopup', finish);
    };
    InputPopup.prototype.setPostText = function (str) { $(this.html).find('.textPre')[0].innerHTML = str; };
    InputPopup.popupCounter = 0;
    return InputPopup;
}());
export { InputPopup };
export var ShortAttribETypes;
(function (ShortAttribETypes) {
    ShortAttribETypes["void"] = "void";
    ShortAttribETypes["EChar"] = "Echar";
    ShortAttribETypes["EString"] = "EString";
    ShortAttribETypes["EDate"] = "EDate";
    ShortAttribETypes["EFloat"] = "EFloat";
    ShortAttribETypes["EDouble"] = "EDouble";
    ShortAttribETypes["EBoolean"] = "EBoolean";
    ShortAttribETypes["EByte"] = "EByte";
    ShortAttribETypes["EShort"] = "EShort";
    ShortAttribETypes["EInt"] = "EInt";
    ShortAttribETypes["ELong"] = "ELong";
    /*
    ECharObj  = 'ECharObj',
    EStringObj  = 'EStringObj',
    EDateObj  = 'EDateObj',
    EFloatObj  = 'EFloatObj',
    EDoubleObj  = 'EDoubleObj',
    EBooleanObj = 'EBooleanObj',
    EByteObj  = 'EByteObj',
    EShortObj  = 'EShortObj',
    EIntObj  = 'EIntObj',
    ELongObj  = 'ELongObj',
    EELIST  = 'EELIST',*/
})(ShortAttribETypes || (ShortAttribETypes = {}));
var U = /** @class */ (function () {
    function U() {
    }
    U.checkDblClick = function () {
        var now = new Date().getTime();
        var old = U.dblclickchecker;
        U.dblclickchecker = now;
        console.log('dblclick time:', now - old, now, old);
        return (now - old <= U.dblclicktimerms);
    };
    U.firstToUpper = function (s) {
        if (!s || s === '')
            return s;
        return s.charAt(0).toUpperCase() + s.slice(1);
    };
    U.fileReadContent = function (file, callback) {
        var textType = /text.*/;
        try {
            if (!file.type || file.type.match(textType)) {
                var reader_1 = new FileReader();
                reader_1.onload = function (e) { callback('' + reader_1.result); };
                reader_1.readAsText(file);
                return;
            }
        }
        catch (e) {
            U.pe(true, "Exception while trying to read file as text. Error: |", e, "|", file);
        }
        U.pe(true, "Wrong file type found: |", file ? file.type : null, "|", file);
    };
    U.fileRead = function (onChange, extensions, readContent) {
        if (extensions === void 0) { extensions = null; }
        myFileReader.show(onChange, extensions, readContent);
    };
    U.textToSvg = function (str) { return U.textToSvgArr(str)[0]; };
    U.textToSvgArr = function (str) {
        if (!U.varTextToSvg) {
            U.varTextToSvg = U.newSvg('svg');
        }
        U.varTextToSvg.innerHTML = str;
        var ret = [];
        var i;
        for (i = 0; i < U.varTextToSvg.childNodes.length; i++) {
            ret.push(U.varTextToSvg.childNodes[i]);
        }
        return ret;
    };
    U.addCss = function (key, str, prepend) {
        if (prepend === void 0) { prepend = true; }
        var css = document.createElement('style');
        css.innerHTML = str;
        var old = U.addCssAvoidDuplicates[key];
        if (old) {
            old.parentNode.removeChild(old);
        }
        U.addCssAvoidDuplicates[key] = css;
        if (prepend) {
            document.head.prepend(css);
        }
        else {
            document.head.append(css);
        }
    };
    U.clear = function (htmlNode) {
        while (htmlNode.firstChild) {
            htmlNode.removeChild(htmlNode.firstChild);
        }
    };
    U.clearAllTimeouts = function () {
        var highestTimeoutId = setTimeout(function () { }, 1);
        for (var i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }
    };
    U.pe = function (b, s) {
        var restArgs = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            restArgs[_i - 2] = arguments[_i];
        }
        if (!b) {
            return null;
        }
        if (restArgs === null || restArgs === undefined) {
            restArgs = [];
        }
        var str = 'Error:' + s + '';
        console.error('pe[0/' + (restArgs.length + 1) + ']: ', s);
        for (var i = 0; i < restArgs.length; i++) {
            s = restArgs[i];
            str += 'pe[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ' + s + '\t\t\r\n';
            console.error('pe[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ', s);
        }
        if (!U.production) {
            alert(str);
        }
        else
            U.pw.apply(U, [true, s].concat(restArgs));
        return b['@makeMeCrash']['@makeMeCrash'];
    };
    U.pw = function (b, s) {
        var restArgs = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            restArgs[_i - 2] = arguments[_i];
        }
        if (!b) {
            return null;
        }
        if (restArgs === null || restArgs === undefined) {
            restArgs = [];
        }
        console['' + 'trace']();
        var str = 'Warning:' + s + '';
        console.warn('pw[0/' + (restArgs.length + 1) + ']: ', s);
        for (var i = 0; i < restArgs.length; i++) {
            s = restArgs[i];
            str += 'pw[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ' + s + '\t\t\r\n';
            console.warn('pw[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ', s);
        }
        U.bootstrapPopup(str, 'warning', 5000);
        // s = (((b as unknown) as any[])['@makeMeCrash'] as any[])['@makeMeCrash'];
        return str;
    };
    U.ps = function (b, s) {
        var restArgs = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            restArgs[_i - 2] = arguments[_i];
        }
        if (!b) {
            return null;
        }
        if (restArgs === null || restArgs === undefined) {
            restArgs = [];
        }
        var str = s + '';
        console.info('ps[0/' + (restArgs.length + 1) + ']: ', s);
        for (var i = 0; i < restArgs.length; i++) {
            s = restArgs[i];
            str += 'ps[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ' + s + '\t\t\r\n';
            console.info('pw[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ', s);
        }
        U.bootstrapPopup(str, 'success', 3000);
        // s = (((b as unknown) as any[])['@makeMeCrash'] as any[])['@makeMeCrash'];
        return str;
    };
    U.pif = function (b, s) {
        var restArgs = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            restArgs[_i - 2] = arguments[_i];
        }
        if (!b) {
            return null;
        }
        if (restArgs === null || restArgs === undefined) {
            restArgs = [];
        }
        var str = 'p: ' + s;
        console.info('p:', s);
        for (var i = 0; i < restArgs.length; i++) {
            s = restArgs[i];
            str += 'p[' + (i + 1) + '/' + restArgs.length + ']: ' + s + '\t\t\r\n';
            console.info('p[' + (i + 1) + '/' + restArgs.length + ']: ', s);
        }
        // alert(str);
        return str;
    };
    U.p = function (s) {
        var restArgs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            restArgs[_i - 1] = arguments[_i];
        }
        if (restArgs === null || restArgs === undefined) {
            restArgs = [];
        }
        var str = 'p: ' + s;
        console.info('p:', s);
        for (var i = 0; i < restArgs.length; i++) {
            s = restArgs[i];
            str += 'p[' + (i + 1) + '/' + restArgs.length + ']: ' + s + '\t\t\r\n';
            console.info('p[' + (i + 1) + '/' + restArgs.length + ']: ', s);
        }
        // alert(str);
        return str;
    };
    U.bootstrapPopup = function (innerhtmlstr, color, timer) {
        var div = document.createElement('div');
        if (!U.$alertcontainer) {
            U.alertcontainer = document.createElement('div');
            U.alertcontainer.classList.add('alertcontainer');
            document.body.appendChild(U.alertcontainer);
            U.$alertcontainer = $(U.alertcontainer);
        }
        var container = U.alertcontainer;
        var $container = U.$alertcontainer;
        var $div = $(div);
        container.appendChild(div);
        div.classList.add('alertshell');
        document.body.appendChild(container);
        div.setAttribute('role', 'alert');
        var alertMargin = document.createElement('div');
        alertMargin.innerHTML = innerhtmlstr;
        alertMargin.classList.add('alert');
        alertMargin.classList.add('alert-' + color);
        div.appendChild(alertMargin);
        var end = function () { $div.slideUp(400, function () { container.removeChild(div); }); };
        $div.hide().slideDown(200, function () { return setTimeout(end, timer); });
    };
    U.cloneHtml = function (html, deep, defaultIDNum) {
        if (deep === void 0) { deep = true; }
        if (defaultIDNum === void 0) { defaultIDNum = 1; }
        var clone = html.cloneNode(deep);
        var getLastNum = function (str) {
            var pos = str.length;
            while (--pos > 0 && !isNaN(+str.charAt(pos))) { }
            var numstr = (str.substring(pos));
            return isNaN(+numstr) ? defaultIDNum : +numstr;
        };
        if (!clone.id) {
            return clone;
        }
        var lastnum = getLastNum(clone.id) - 1;
        var tmpID = clone.id + (clone.id.indexOf('_Clone') === -1 ? '_Clone' : '');
        while (document.getElementById(tmpID + (++lastnum))) { }
        clone.id = tmpID + lastnum;
        return clone;
    };
    U.clearAttributes = function (node) {
        var j;
        for (j = 0; j < node.attributes.length; j++) {
            node.removeAttribute(node.attributes[j].name);
        }
    };
    U.cloneObj = function (o) {
        // const r: HTMLElement = document.createElement(o.tagName);
        // r.innerHTML = o.innerHTML;
        // U.pe( o as HTMLElement !== null, 'non utilizzabile su html');
        return JSON.parse(JSON.stringify(o));
        // todo: questa funzione non può clonare html. allow cloneObj of circular objects.
    };
    U.cloneObj2 = function (o) {
        U.pe(true, 'todo: dovrebbe fare una deep copy copiando anche le funzioni (cosa che json.stringify non fa).');
        return null;
    };
    U.loadScript = function (path, useEval) {
        if (useEval === void 0) { useEval = false; }
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        U.pe(useEval, 'useEval: todo. potrebbe essere utile per avviare codice fuori dalle funzioni in futuro.');
        document.body.append(script);
    };
    U.newSvg = function (type) {
        return document.createElementNS('http://www.w3.org/2000/svg', type);
    };
    U.measurableGetArrays = function (measureHtml, e) {
        if (!measureHtml) {
            measureHtml = (e.target || e.currentTarget); // currentTarget === dicument sometimes.
            //      console.log('html:', measureHtml, 'e: ', e);
            if (!measureHtml || measureHtml === document) {
                measureHtml = e.target;
                while (measureHtml && !measureHtml.classList.contains('measurable')) {
                    measureHtml = measureHtml.parentElement;
                }
                U.pe(!measureHtml, ' failed to get measurableRoot. evt:', e);
            }
            if (measureHtml.classList.contains('ui-wrapper') && !measureHtml.classList.contains('measurable')
                && measureHtml.firstChild.classList.contains('measurable')) {
                measureHtml = measureHtml.firstChild;
            }
        }
        var ret = {};
        ret.e = e;
        ret.html = measureHtml;
        ret.rules = [];
        ret.constraints = [];
        ret.rules = [];
        ret.imports = [];
        ret.exports = [];
        ret.variables = [];
        ret.constraints = [];
        ret.chain = [];
        ret.chainFinal = [];
        ret.dstyle = [];
        var i;
        for (i = 0; i < measureHtml.attributes.length; i++) {
            var attr = measureHtml.attributes[i];
            var key = attr.name.toLowerCase();
            if (key.indexOf('_') !== 0) {
                continue;
            }
            if (key.indexOf('_rule') === 0) {
                ret.rules.push(attr);
                continue;
            }
            if (key.indexOf('_import') === 0) {
                ret.imports.push(attr);
                continue;
            }
            if (key.indexOf('_export') === 0) {
                ret.exports.push(attr);
                continue;
            }
            if (key.indexOf('_constraint') === 0) {
                ret.constraints.push(attr);
                continue;
            }
            if (key.indexOf('_chain') === 0) {
                ret.chain.push(attr);
                continue;
            }
            if (key.indexOf('_chainfinal') === 0) {
                ret.chainFinal.push(attr);
                continue;
            }
            if (key.indexOf('_dstyle') === 0) {
                ret.dstyle.push(attr);
                continue;
            }
            ret.variables.push(attr);
        }
        return ret;
    };
    U.measurableElementSetup = function ($root, resizeConfig, dragConfig) {
        if (resizeConfig === void 0) { resizeConfig = null; }
        if (dragConfig === void 0) { dragConfig = null; }
        $root.find('.measurable').addBack('.measurable').each(function (i, h) { return U.measurableElementSetupSingle(h, resizeConfig, dragConfig); });
    };
    U.measurableElementSetupSingle = function (elem, resizeConfig, dragConfig) {
        if (resizeConfig === void 0) { resizeConfig = null; }
        if (dragConfig === void 0) { dragConfig = null; }
        // apply resizableborder AND jquery.resize
        if (!elem.classList || !elem.classList.contains('measurable') || elem === document) {
            U.pw(true, 'invalid measurable:', elem, !elem.classList, '||', !elem.classList.contains('measurable'));
            return;
        }
        U.resizableBorderSetup(elem);
        if (!resizeConfig) {
            resizeConfig = {};
        }
        if (!dragConfig) {
            dragConfig = {};
        }
        resizeConfig.create = resizeConfig.create || eval(elem.dataset.r_create);
        resizeConfig.resize = resizeConfig.resize || eval(elem.dataset.r_resize);
        resizeConfig.start = resizeConfig.start || eval(elem.dataset.r_start);
        resizeConfig.stop = resizeConfig.stop || eval(elem.dataset.r_stop);
        dragConfig.create = dragConfig.create || eval(elem.dataset.d_create);
        dragConfig.drag = dragConfig.drag || eval(elem.dataset.d_drag);
        dragConfig.start = dragConfig.start || eval(elem.dataset.d_start);
        dragConfig.stop = dragConfig.stop || eval(elem.dataset.d_stop);
        for (var key in resizeConfig) {
            if (resizeConfig[key] || !elem.dataset['r_' + key]) {
                continue;
            }
            resizeConfig[key] = elem.dataset['r_' + key];
        }
        for (var key in dragConfig) {
            if (dragConfig[key] || !elem.dataset['d_' + key]) {
                continue;
            }
            dragConfig[key] = elem.dataset['d_' + key];
        }
        $(elem).resizable(resizeConfig).draggable(dragConfig);
    };
    U.replaceVars = function (obj, html0, cloneHtml, debug) {
        if (cloneHtml === void 0) { cloneHtml = true; }
        if (debug === void 0) { debug = false; }
        var html = cloneHtml ? U.cloneHtml(html0) : html0;
        /// see it in action & parse or debug at
        // v1) perfetto ma non supportata in jscript https://regex101.com/r/Do2ndU/1
        // v2) usata: aggiustabile con if...substring(1). https://regex101.com/r/Do2ndU/3
        // get text between 2 single '$' excluding $$, so they can be used as escape character to display a single '$'
        // console.log('html0:', html0, 'html:', html);
        U.pe(!(html instanceof Element), 'target must be a html node.', html, html0);
        html.innerHTML = U.replaceVarsString(obj, html.innerHTML, debug);
        U.pif(debug, 'ReplaceVars() return = ', html.innerHTML);
        return html;
    };
    U.replaceVarsString0 = function (obj, str, escapeC, replacer, debug) {
        if (escapeC === void 0) { escapeC = null; }
        if (replacer === void 0) { replacer = null; }
        if (debug === void 0) { debug = false; }
        U.pe(escapeC && !replacer, 'replacer cannot be null if escapeChar is defined.');
        U.pe(replacer && !escapeC, 'escapeChar cannot be null if replacer is defined');
        if (!escapeC && !replacer) {
            escapeC = replacer = [];
        }
        U.pe(escapeC.length !== replacer.length, 'replacer and escapeChar must be arrays of the same length');
        str = str.replace(/(^\$|(((?!\$).|^))[\$](?!\$))(.*?)(^\$|((?!\$).|^)[\$](?!\$))/gm, function (match, capture) {
            // console.log('matched:', match, 'capture: ', capture);
            if (match === '$') {
                return '';
            }
            var prefixError = '';
            if (match.charAt(0) !== '$') {
                prefixError = match.charAt(0);
                match = match.substring(1);
            }
            // # = default value: {asHtml = true, isbase64 = false}
            var asHtml = match.charAt(1) === '1' || match.charAt(1) !== '#';
            var isBase64 = match.charAt(2) === '1' || match.charAt(2) !== '#';
            var varname = match.substring(3, match.length - 1);
            var debugtext = varname + '(' + match + ')';
            U.pif(debug, 'match:', match);
            var resultarr = U.replaceSingleVar(obj, varname, isBase64, false);
            var result = resultarr[resultarr.length - 1].value;
            if (result !== '' + result) {
                try {
                    result = JSON.stringify(result);
                }
                catch (e) {
                    result = '{_Cyclic object_}';
                }
            }
            var i = -1;
            U.pif(debug, 'replaceSingleVar: ', match, ', arr', resultarr, ', ret', result, ', this:', obj);
            if (!asHtml) {
                while (++i < escapeC.length) {
                    result = U.replaceAll(result, escapeC[i], replacer[i]);
                }
            }
            U.pif(debug, 'replaceSingleVar: ' + debugtext + ' --> ' + result + ' --> ' + prefixError, result, obj);
            if (U.isObject(result)) { }
            return prefixError + result;
        });
        return str;
    };
    U.replaceVarsString = function (obj, htmlStr, debug) {
        if (debug === void 0) { debug = false; }
        U.pe(!obj || !htmlStr, 'parameters cannot be null. obj:', obj, ', htmlString:', htmlStr);
        //  https://stackoverflow.com/questions/38563414/javascript-regex-to-select-quoted-string-but-not-escape-quotes
        //  good regex fatto da me https://regex101.com/r/bmWVrp/4
        // only replace content inside " quotes. (eventually escaping ")
        htmlStr = U.QuoteReplaceVarString(obj, htmlStr, '"', debug);
        // only replace content inside ' quotes. (eventually escaping ')
        htmlStr = U.QuoteReplaceVarString(obj, htmlStr, '\'', debug);
        // replaces what's left outside any quotation. (eventually escaping <>)
        htmlStr = U.replaceVarsString0(obj, htmlStr, ['<', '>'], ['&lt;', '&gt;']); // check here aaaaaaaaaaaaaa $$$$$$$$$$$
        return htmlStr;
    };
    U.QuoteReplaceVarString = function (obj, htmlStr, quote, debug) {
        if (debug === void 0) { debug = false; }
        U.pe(quote !== '"' && quote !== '\'', 'the only quote supported are single chars " and \'.');
        var quoteEscape = quote === '&quot;' ? '' : '&#39;'; // '\\' + quote;
        // todo: dovrei anche rimpiazzare & with &amp; per consentire input &something; trattati come stringhe.
        // ""|(:?[^\\](?!"")|^)((:?\\\\)*\"(:?.*?[^\\"]+){0,1}(:?\\\\)*\")
        // '""|(:?[^\\](?!"")|^)((:?\\\\)*\"(:?.*?[^\\"]+){0,1}(:?\\\\)*\")'
        // let regex = /""|(:?[^\\](?!"")|^)((:?\\\\)*\"(:?.*?[^\\"]+){0,1}(:?\\\\)*\")/;
        var regexStr = '""|(:?[^\\\\](?!"")|^)((:?\\\\\\\\)*\\"(:?.*?[^\\\\"]+){0,1}(:?\\\\\\\\)*\\")';
        if (quote !== '"') {
            regexStr = U.replaceAll(regexStr, '"', '\'');
        }
        var quoteRegex = new RegExp(regexStr, 'g'); // new RegExp("a", "b"); === /a/b
        htmlStr = htmlStr.replace(quoteRegex, function (match, capture) {
            var start = match.indexOf(quote);
            var end = match.lastIndexOf(quote);
            var content = U.replaceVarsString0(obj, match.substring(start + 1, end), [quote], [quoteEscape], debug);
            var ret = match.substring(0, start + 1) + content + match.substring(end);
            U.pif(debug, 'replaceQuotedVars: match: |' + match + '| --> |' + content + '| --> |' + ret + '| html:', htmlStr, 'capt:', capture);
            return ret;
        });
        return htmlStr;
    };
    //todo: da rimuovere, è stata completamente superata dal nuovo return type array di replaceSingleVar
    U.replaceSingleVarGetParentAndChildKey = function (obj, fullpattern, canThrow) {
        if (canThrow === void 0) { canThrow = false; }
        var ret = { parent: null, childkey: null };
        var targetPatternParent;
        var pos = fullpattern.indexOf('.');
        var isBase64 = fullpattern.charAt(2) === '1' || fullpattern.charAt(2) !== '#';
        U.pe(isBase64, 'currently this method does not support base64 encoded templates. the conversion is still to do.', fullpattern);
        if (pos === -1) {
            ret.parent = obj;
            ret.childkey = fullpattern.substring(3, fullpattern.length - 1);
            return ret;
        }
        try {
            targetPatternParent = fullpattern.substring(0, pos) + '$';
            var tmparr = U.replaceSingleVarRaw(obj, targetPatternParent);
            ret.parent = tmparr[tmparr.length - 1].value;
            ret.childkey = fullpattern.substring(pos + 1, fullpattern.length - 1);
        }
        catch (e) {
            U.pw(true, 'replaceSingleVarGetParentAndChildKey failed. fullpattern: |' + fullpattern + '| targetPatternParent: |'
                + targetPatternParent + '| obj: ', obj, ' reason: ', e);
            return null;
        }
        return ret;
    };
    U.replaceSingleVarRaw = function (obj, fullpattern, canThrow) {
        if (canThrow === void 0) { canThrow = false; }
        fullpattern = fullpattern.trim();
        var isBase64 = fullpattern.charAt(2) === '1' || fullpattern.charAt(2) !== '#';
        var varName = fullpattern.substring(3, fullpattern.length - 1);
        return U.replaceSingleVar(obj, varName, isBase64, canThrow);
    };
    U.replaceSingleVar = function (obj, varname, isBase64, canThrow) {
        if (canThrow === void 0) { canThrow = false; }
        var debug = false;
        var showErrors = false;
        var debugPathOk = '';
        if (isBase64) {
            varname = atob(varname);
        }
        var requestedValue = obj;
        var fullpath = varname;
        var tokens = varname.split('.'); // varname.split(/\.,/);
        var ret = [];
        var j;
        var token = null;
        for (j = 0; j < tokens.length; j++) {
            ret.push({ token: token === null ? 'this' : token, value: requestedValue });
            token = tokens[j];
            U.pif(debug || showErrors, 'replacer: obj[req] = ', requestedValue, '[', token, '] =', (requestedValue ? requestedValue[token] : ''));
            if (requestedValue === null || requestedValue === undefined) {
                U.pe(showErrors, 'requested null or undefined:', obj, ', canthrow ? ', canThrow, ', fillplath:', fullpath);
                if (canThrow) {
                    U.pif(showErrors, 'wrong variable path:', debugPathOk + '.' + token, ': ' + token + ' is undefined. object = ', obj);
                    throw new DOMException('replace_Vars.WrongVariablePath', 'replace_Vars.WrongVariablePath');
                }
                else {
                    U.pif(showErrors, 'wrong variable path:', debugPathOk + '.' + token, ': ' + token + ' is undefined. ovjet = ', obj);
                }
                ret.push({ token: token, value: 'Error: ' + debugPathOk + '.' + token + ' = ' + undefined });
                // ret.push({token: token, value: requestedValue});
                return ret;
            }
            else {
                debugPathOk += (debugPathOk === '' ? '' : '.') + token;
            }
            ////
            if (requestedValue instanceof ModelPiece) {
                var info = requestedValue.getInfo(true);
                var key = token.toLowerCase();
                if (key in info) {
                    requestedValue = info[key];
                }
                else {
                    requestedValue = requestedValue[token];
                }
            }
            else {
                requestedValue = (requestedValue === null) ? undefined : requestedValue[token];
            }
        }
        ret.push({ token: token, value: requestedValue });
        return ret;
    };
    U.replaceSingleVar_backup = function (obj, varname, isBase64, canThrow) {
        if (canThrow === void 0) { canThrow = false; }
        var debug = false;
        var showErrors = false;
        var debugPathOk = '';
        if (isBase64) {
            varname = atob(varname);
        }
        var requestedValue = obj;
        var fullpath = varname;
        var tokens = varname.split('.'); // varname.split(/\.,/);
        var j;
        for (j = 0; j < tokens.length; j++) {
            var token = tokens[j];
            U.pif(debug || showErrors, 'replacer: obj[req] = ', requestedValue, '[', token, '] =', (requestedValue ? requestedValue[token] : ''));
            if (requestedValue === null || requestedValue === undefined) {
                U.pe(showErrors, 'requested null or undefined:', obj, ', canthrow ? ', canThrow, ', fillplath:', fullpath);
                if (canThrow) {
                    U.pif(showErrors, 'wrong variable path:', debugPathOk + '.' + token, ': ' + token + ' is undefined. object = ', obj);
                    throw new DOMException('replace_Vars.WrongVariablePath', 'replace_Vars.WrongVariablePath');
                }
                else {
                    U.pif(showErrors, 'wrong variable path:', debugPathOk + '.' + token, ': ' + token + ' is undefined. ovjet = ', obj);
                }
                return 'Error: ' + debugPathOk + '.' + token + ' = ' + undefined;
            }
            else {
                debugPathOk += (debugPathOk === '' ? '' : '.') + token;
            }
            ////
            if (requestedValue instanceof ModelPiece) {
                var info = requestedValue.getInfo(true);
                var key = token.toLowerCase();
                if (key in info) {
                    requestedValue = info[key];
                }
                else {
                    requestedValue = requestedValue[token];
                }
            }
            else {
                requestedValue = (requestedValue === null) ? undefined : requestedValue[token];
            }
        }
        return requestedValue;
    };
    U.changeVarTemplateDelimitersInMeasurables = function (innerText, toReplace, replacement) {
        if (toReplace === void 0) { toReplace = '$'; }
        if (replacement === void 0) { replacement = '£'; }
        if (!innerText.indexOf('measurable')) {
            return innerText;
        } // + performance su scommessa probabilistica. better avg, worser worst case.
        var html = document.createElement('div');
        html.innerHTML = innerText;
        var $measurables = $(html).find('.measurable');
        var i;
        var j;
        for (i = 0; i < $measurables.length; i++) {
            for (j = 0; j < $measurables[i].attributes.length; j++) {
                if ($measurables[i].attributes[j].name[0] !== '_') {
                    continue;
                }
                U.changeVarTemplateDelimitersInMeasurablesAttr($measurables[i].attributes[j], toReplace, replacement);
            }
        }
        return html.innerHTML;
    };
    U.changeBackVarTemplateDelimitersInMeasurablesAttr = function (attrVal, toReplace, replacement) {
        if (toReplace === void 0) { toReplace = '£'; }
        if (replacement === void 0) { replacement = '$'; }
        return U.changeVarTemplateDelimitersInMeasurablesAttrStr(attrVal, toReplace, replacement);
    };
    U.changeVarTemplateDelimitersInMeasurablesAttr = function (attr, toReplace, replacement) {
        if (toReplace === void 0) { toReplace = '$'; }
        if (replacement === void 0) { replacement = '£'; }
        attr.value = U.changeVarTemplateDelimitersInMeasurablesAttrStr(attr.value, toReplace, replacement);
    };
    U.changeVarTemplateDelimitersInMeasurablesAttrStr = function (val, toReplace, replacement) {
        var r = toReplace;
        var rstr = '(^\\' + r + '|(((?!\\' + r + ').|^))[\\' + r + '](?!\\' + r + '))(.*?)(^\\' + r + '|((?!\\' + r + ').|^)[\\' + r + '](?!\\' + r + '))';
        return val.replace(new RegExp(rstr, 'gm'), function (match, capture) {
            if (match === toReplace) {
                return toReplace;
            }
            var prefixError = '';
            if (match.charAt(0) !== toReplace) {
                prefixError = match.charAt(0);
                match = match.substring(1);
            }
            return prefixError + replacement + match.substring(1, match.length - 1) + replacement;
        });
    };
    U.sizeof = function (element, debug) {
        if (debug === void 0) { debug = false; }
        U.pif(debug, 'sizeof(', element, ')');
        U.pe(element === document, 'trying to measure document.');
        if (element === document) {
            element = document.body;
        }
        var $element = $(element);
        U.pe(element.tagName === 'foreignObject', 'SvgForeignElementObject have a bug with size, measure a child instead.');
        var i;
        var tmp;
        var size;
        if (!U.sizeofvar) {
            U.sizeofvar = document.createElement('div');
            document.body.append(U.sizeofvar);
        }
        var isOrphan = element.parentNode === null;
        // var visible = element.style.display !== 'none';
        // var visible = $element.is(":visible"); crea bug quando un elemento è teoricamente visibile ma orfano
        var ancestors = U.ancestorArray(element);
        var visibile = [];
        if (isOrphan) {
            U.sizeofvar.append(element);
        }
        // show all and saveToDB visibility to restore it later
        for (i = 0; i < ancestors.length; i++) { // document has undefined style
            visibile[i] = (ancestors[i].style === undefined) ? (true) : (ancestors[i].style.display !== 'none');
            if (!visibile[i]) {
                $(ancestors[i]).show();
            }
        }
        tmp = $element.offset();
        size = new Size(tmp.left, tmp.top, 0, 0);
        tmp = element.getBoundingClientRect();
        size.w = tmp.width;
        size.h = tmp.height;
        // restore visibility
        for (i = 0; i < ancestors.length; i++) {
            if (!visibile[i]) {
                $(ancestors[i]).hide();
            }
        }
        if (isOrphan) {
            U.clear(U.sizeofvar);
        }
        // Status.status.getActiveModel().graph.markS(size, false);
        return size;
    };
    /* ritorna un array con tutti i figli, nipoti... discendenti di @parent */
    U.iterateDescendents = function (parent) {
        return parent.getElementsByTagName('*');
    };
    U.ancestorArray = function (domelem) {
        // [0]=element, [1]=father, [2]=grandfather... [n]=document
        if (domelem === null || domelem === undefined) {
            return [];
        }
        var arr = [domelem];
        var tmp = domelem.parentNode;
        while (tmp !== null) {
            arr.push(tmp);
            tmp = tmp.parentNode;
        }
        return arr;
    };
    U.toSvg = function (html) {
        U.pe(true, 'toSvg maybe not working, test before use');
        var o = U.newSvg('svg');
        o.innerHTML = html;
        return o.firstChild;
    };
    U.toHtmlRow = function (html) {
        return U.toHtml(html, U.toHtml('<table><tbody></tbody></table>').firstChild);
    };
    U.toHtmlCell = function (html) {
        return U.toHtml(html, U.toHtml('<table><tbody><tr></tr></tbody></table>').firstChild.firstChild);
    };
    U.toHtml = function (html, container, containerTag) {
        if (container === void 0) { container = null; }
        if (containerTag === void 0) { containerTag = 'div'; }
        if (container === null) {
            container = document.createElement(containerTag);
        }
        container.innerHTML = html;
        var ret = container.firstChild;
        container.removeChild(ret);
        return ret;
    };
    U.toBase64Image = function (html, container, containerTag) {
        if (container === void 0) { container = null; }
        if (containerTag === void 0) { containerTag = 'div'; }
        // https://github.com/tsayen/dom-to-image
        return 'HtmlToImage todo: check https://github.com/tsayen/dom-to-image';
    };
    /**
     * checks if nodes have a vertical line relationship in the tree (parent, grandparent, ...);
     * @ return {boolean}
     */
    U.isParentOf = function (parent, child) {
        //  parent chains:   element -> ... -> body -> html -> document -> null
        while (child !== null) {
            if (parent === child) {
                return true;
            }
            child = child.parentNode;
        }
        return false;
    };
    U.isChildrenOf = function (child, parent) {
        return U.isParentOf(parent, child);
    };
    U.setSvgSize = function (style, size, defaultsize) {
        if (!style)
            return;
        if (size) {
            size = size.duplicate();
        }
        else {
            size = defaultsize.duplicate();
            defaultsize = null;
        }
        if (!U.isNumber(size.x)) {
            U.pw(true, 'VertexSize Svg x attribute is NaN: ' + size.x + (!defaultsize ? '' : ' will be set to default: ' + defaultsize.x));
            U.pe(!defaultsize || !U.isNumber(defaultsize.x), 'Both size and defaultsize are null.', size, defaultsize, style);
            size.x = defaultsize.x;
        }
        if (!U.isNumber(size.y)) {
            U.pw(true, 'VertexSize Svg y attribute is NaN: ' + size.y + (!defaultsize ? '' : ' will be set to default: ' + defaultsize.y));
            U.pe(!defaultsize || !U.isNumber(defaultsize.y), 'Both size and defaultsize are null.', size, defaultsize, style);
            size.y = defaultsize.y;
        }
        if (!U.isNumber(size.w)) {
            U.pw(true, 'VertexSize Svg w attribute is NaN: ' + size.w + (!defaultsize ? '' : ' will be set to default: ' + defaultsize.w));
            U.pe(!defaultsize || !U.isNumber(defaultsize.w), 'Both size and defaultsize are null.', size, defaultsize, style);
            size.w = defaultsize.w;
        }
        if (!U.isNumber(size.h)) {
            U.pw(true, 'VertexSize Svg h attribute is NaN: ' + size.h + (!defaultsize ? '' : ' will be set to default: ' + defaultsize.h));
            U.pe(!defaultsize || !U.isNumber(defaultsize.h), 'Both size and defaultsize are null.', size, defaultsize, style);
            size.h = defaultsize.h;
        }
        // U.pe(true, '100!, ', size, style);
        style.setAttributeNS(null, 'x', '' + size.x);
        style.setAttributeNS(null, 'y', '' + size.y);
        style.setAttributeNS(null, 'width', '' + size.w);
        style.setAttributeNS(null, 'height', '' + size.h);
        return size;
    };
    U.getSvgSize = function (elem, minimum, maximum) {
        if (minimum === void 0) { minimum = null; }
        if (maximum === void 0) { maximum = null; }
        var defaults = new GraphSize(0, 0, 200, 99);
        var ret0 = new GraphSize(+elem.getAttribute('x'), +elem.getAttribute('y'), +elem.getAttribute('width'), +elem.getAttribute('height'));
        var ret = ret0.duplicate();
        if (!U.isNumber(ret.x)) {
            U.pw(true, 'Svg x attribute is NaN: ' + elem.getAttribute('x') + ' will be set to default: ' + defaults.x);
            ret.x = defaults.x;
        }
        if (!U.isNumber(ret.y)) {
            U.pw(true, 'Svg y attribute is NaN: ' + elem.getAttribute('y') + ' will be set to default: ' + defaults.y);
            ret.y = defaults.y;
        }
        if (!U.isNumber(ret.w)) {
            U.pw(true, 'Svg w attribute is NaN: ' + elem.getAttribute('width') + ' will be set to default: ' + defaults.w);
            ret.w = defaults.w;
        }
        if (!U.isNumber(ret.h)) {
            U.pw(true, 'Svg h attribute is NaN: ' + elem.getAttribute('height') + ' will be set to default: ' + defaults.h);
            ret.h = defaults.h;
        }
        if (minimum) {
            if (U.isNumber(minimum.x) && ret.x < minimum.x) {
                ret.x = minimum.x;
            }
            if (U.isNumber(minimum.y) && ret.y < minimum.y) {
                ret.y = minimum.y;
            }
            if (U.isNumber(minimum.w) && ret.w < minimum.w) {
                ret.w = minimum.w;
            }
            if (U.isNumber(minimum.h) && ret.h < minimum.h) {
                ret.h = minimum.h;
            }
        }
        if (maximum) {
            if (U.isNumber(maximum.x) && ret.x > maximum.x) {
                ret.x = maximum.x;
            }
            if (U.isNumber(maximum.y) && ret.y > maximum.y) {
                ret.y = maximum.y;
            }
            if (U.isNumber(maximum.w) && ret.w > maximum.w) {
                ret.w = maximum.w;
            }
            if (U.isNumber(maximum.h) && ret.h > maximum.h) {
                ret.h = maximum.h;
            }
        }
        if (!ret.equals(ret0)) {
            U.setSvgSize(elem, ret, null);
        }
        return ret;
    };
    U.findMetaParent = function (parent, childJson, canFail, debug) {
        if (debug === void 0) { debug = true; }
        var modelRoot = parent.getModelRoot();
        // instanceof crasha non so perchè, dà undefined constructor quando non lo è.
        if (U.getClass(modelRoot) === 'MetaMetaModel') {
            U.pif(debug, 'return null;');
            return null;
        }
        if (U.getClass(modelRoot) === 'MetaModel') {
            U.pif(debug, 'return null;');
            return null;
        } // potrei ripensarci e collegarlo a m3
        // todo: risolvi bene e capisci che collegamento deve esserci tra mmpackage e mpackage.
        // fix temporaneo: così però consento di avere un solo package.
        if (U.getClass(modelRoot) === 'Model' && U.getClass(parent) === 'Model') {
            U.pif(debug, 'return: ', parent.metaParent.childrens[0]);
            return parent.metaParent.childrens[0];
        }
        // if (modelRoot === Status.status.mmm || !Status.status.mmm && modelRoot instanceof MetaMetaModel) { return null; }
        // if (modelRoot === Status.status.mm) { return null; }
        var ParentMetaParent = parent.metaParent;
        var metaParentName = Json.read(childJson, XMIModel.namee, null);
        // U.pe(!metaParentName, 'type not found.', childJson);
        var i;
        var ret = null;
        U.pif(debug, 'finding metaparent of:', childJson, 'parent:', parent, 'parent.metaparent:', ParentMetaParent, 'childrens:', ParentMetaParent ? ParentMetaParent.childrens : 'null parent');
        for (i = 0; i < ParentMetaParent.childrens.length; i++) {
            var metaVersionCandidate = ParentMetaParent.childrens[i];
            var candidateName = metaVersionCandidate.name;
            U.pif(debug, 'check[' + i + '/' + ParentMetaParent.childrens.length + '] ' + candidateName + ' =?= ' + metaParentName + ' ? ' +
                (candidateName === metaParentName));
            // console.log('is metaparent? of:', metaParentName, ' === ', candidateName, ' ? ', candidateName === metaParentName);
            if (candidateName === metaParentName) {
                ret = metaVersionCandidate;
                break;
            }
        }
        U.pif(debug, 'return: ', ret);
        U.pe(ret == null && !canFail, 'metaParent not found. metaParentParent:', ParentMetaParent, 'metaParentName:', metaParentName, 'parent:', parent, 'json:', childJson);
        // console.log('findMetaParent of:', childJson, ' using parent:', parent, ' = ', ret);
        return ret;
    };
    /*
      static findMetaParentP(parent: IModel, childJson: Json, canFail: boolean = true): IPackage {
        return U.findMetaParent<IModel, IPackage>(parent, childJson, canFail);
      }
  
      static findMetaParentC(parent: IPackage, childJson: Json, canFail: boolean = true): M2Class {
        return U.findMetaParent<IPackage, M2Class>(parent, childJson, canFail);
      }
  
      static findMetaParentA(prnt: M2Class, childJ: Json, canFail: boolean = true): IAttribute {
        return U.findMetaParent<M2Class, IAttribute>(prnt, childJ, canFail);
      }
  
      static findMetaParentR(prnt: M2Class, childJ: Json, canFail: boolean = true): IReference {
        return U.findMetaParent<M2Class, IReference>(prnt, childJ, canFail);
      }
    */
    U.arrayRemoveAll = function (arr, elem, debug) {
        if (debug === void 0) { debug = false; }
        var index;
        while (true) {
            index = arr.indexOf(elem);
            U.pif(debug, 'ArrayRemoveAll: index: ', index, '; arr:', arr, '; elem:', elem);
            if (index === -1) {
                return;
            }
            arr.splice(index, 1);
            U.pif(debug, 'ArrayRemoveAll RemovedOne:', arr);
        }
    };
    U.eventiDaAggiungereAlBody = function (selecteds) {
        // todo: guarda gli invocatori
    };
    U.isOnEdge = function (pt, shape) {
        return U.isOnHorizontalEdges(pt, shape) || U.isOnVerticalEdges(pt, shape);
    };
    U.isOnVerticalEdges = function (pt, shape) {
        return U.isOnLeftEdge(pt, shape) || U.isOnRightEdge(pt, shape);
    };
    U.isOnHorizontalEdges = function (pt, shape) {
        return U.isOnTopEdge(pt, shape) || U.isOnBottomEdge(pt, shape);
    };
    U.isOnRightEdge = function (pt, shape) {
        if (!pt || !shape) {
            return null;
        }
        return (pt.x === shape.x + shape.w) && (pt.y >= shape.y && pt.y <= shape.y + shape.h);
    };
    U.isOnLeftEdge = function (pt, shape) {
        if (!pt || !shape) {
            return null;
        }
        return (pt.x === shape.x) && (pt.y >= shape.y && pt.y <= shape.y + shape.h);
    };
    U.isOnTopEdge = function (pt, shape) {
        if (!pt || !shape) {
            return null;
        }
        return (pt.y === shape.y) && (pt.x >= shape.x && pt.x <= shape.x + shape.w);
    };
    U.isOnBottomEdge = function (pt, shape) {
        if (!pt || !shape) {
            return null;
        }
        return (pt.y === shape.y + shape.h) && (pt.x >= shape.x && pt.x <= shape.x + shape.w);
    };
    // usage: var scope1 = makeEvalContext("variable declariation list"); scope1("another eval like: x *=3;");
    // remarks: variable can be declared only on the first call, further calls on a created context can only modify the context without expanding it.
    U.makeEvalContext = function (declarations) {
        eval(declarations);
        return function (str) { return eval(str); };
    };
    // same as above, but with dynamic context, although it's only extensible manually and not by the eval code itself.
    U.evalInContext = function (context, js) {
        var value;
        try { // for expressions
            value = eval('with(context) { ' + js + ' }');
        }
        catch (e) {
            if (e instanceof SyntaxError) {
                //try { // for statements
                value = (new Function('with(this) { ' + js + ' }')).call(context);
                //} catch (e) { U.pw(true, 'error evaluating')}
            }
        }
        return value;
    };
    U.multiReplaceAllKV = function (a, kv) {
        if (kv === void 0) { kv = []; }
        var keys = [];
        var vals = [];
        var i;
        for (i = 0; i < kv.length; i++) {
            keys.push(kv[i][0]);
            vals.push(kv[i][0]);
        }
        return U.multiReplaceAll(a, keys, vals);
    };
    U.multiReplaceAll = function (a, searchText, replacement) {
        if (searchText === void 0) { searchText = []; }
        if (replacement === void 0) { replacement = []; }
        U.pe(!(searchText.length === replacement.length), 'search and replacement must be have same length:', searchText, replacement);
        var i = -1;
        while (++i < searchText.length) {
            a = U.replaceAll(a, searchText[i], replacement[i]);
        }
        return a;
    };
    U.toFileName = function (a) {
        if (a === void 0) { a = 'nameless.txt'; }
        if (!a) {
            a = 'nameless.txt';
        }
        a = U.multiReplaceAll(a.trim(), ['\\', '//', ':', '*', '?', '<', '>', '"', '|'], ['[lslash]', '[rslash]', ';', '°', '_', '{', '}', '\'', '!']);
        return a;
    };
    U.download = function (filename, text, debug) {
        if (filename === void 0) { filename = 'nameless.txt'; }
        if (text === void 0) { text = null; }
        if (debug === void 0) { debug = true; }
        if (!text) {
            return;
        }
        filename = U.toFileName(filename);
        var htmla = document.createElement('a');
        var blob = new Blob([text], { type: 'text/plain', endings: 'native' });
        var blobUrl = URL.createObjectURL(blob);
        U.pif(debug, text + '|\r\n| <-- rn, |\n| <--n.');
        htmla.style.display = 'none';
        htmla.href = blobUrl;
        htmla.download = filename;
        document.body.appendChild(htmla);
        htmla.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(htmla);
    };
    /// arrotonda verso zero.
    U.trunc = function (num) {
        if (Math['trunc' + '']) {
            return Math['trunc' + ''](num);
        }
        if (Math.floor && Math.ceil) {
            return Math[num > 0 ? 'floor' : 'ceil'](num);
        }
        return Number(String(num).replace(/\..*/, ''));
    };
    U.closeButtonSetup = function ($root, debug) {
        if (debug === void 0) { debug = false; }
        $root.find('.closeButton').off('click.closeButton').on('click.closeButton', function (e) {
            var html = e.target;
            var target = html.dataset.closebuttontarget;
            html = html.parentNode;
            U.pif(debug, 'html:', html, 'target:', e.target, 'targetstr:', target, 'dataset:', e.target.dataset);
            while (html && (html).dataset.closebuttontarget !== target) {
                U.pif(debug, 'html:', html, ', data:', (html).dataset.closebuttontarget, ' === ' + target);
                html = html.parentNode;
            }
            U.pif(debug, 'html:', html);
            U.pe(!html, 'closeTarget not found: event trigger:', e.target, 'html:', html);
            $(html).hide();
        });
    };
    U.insertAt = function (arr, index, elem) {
        var oldl = arr.length;
        var ret = arr.splice(index, 0, elem);
        U.pe(oldl + 1 !== arr.length, oldl + ' --> ' + arr.length + '; arr not growing. ret:', ret, arr);
    };
    U.setViewBox = function (svg, size) {
        if (size === void 0) { size = null; }
        if (!size) {
            size = new Size();
            size.x = size.y = size.w = size.h = null;
        }
        var x = +size.x;
        var y = +size.y;
        var w = +size.w;
        var h = +size.h;
        var htmlsize = null;
        if (isNaN(x)) {
            x = 0;
        }
        if (isNaN(y)) {
            y = 0;
        }
        if (isNaN(w)) {
            w = htmlsize ? htmlsize.w : (htmlsize = U.sizeof(svg)).w;
        }
        if (isNaN(h)) {
            h = htmlsize ? htmlsize.h : (htmlsize = U.sizeof(svg)).h;
        }
        svg.setAttributeNS(null, 'viewBox', x + ' ' + y + ' ' + w + ' ' + h);
    };
    U.getViewBox = function (svg) {
        var str = svg.getAttributeNS(null, 'viewbox');
        if (!str)
            return U.sizeof(svg);
        var arr = str.split(' ');
        var vbox = new Size(0, 0, 0, 0);
        if (isNaN(+arr[0])) {
            vbox = U.sizeof(svg);
            vbox.x = vbox.y = 0;
            return vbox;
        }
        else {
            vbox.x = +arr[0];
        }
        if (isNaN(+arr[1])) {
            vbox = U.sizeof(svg);
            vbox.x = vbox.y = 0;
            return vbox;
        }
        else {
            vbox.y = +arr[1];
        }
        if (isNaN(+arr[2])) {
            vbox = U.sizeof(svg);
            vbox.x = vbox.y = 0;
            return vbox;
        }
        else {
            vbox.w = +arr[2];
        }
        if (isNaN(+arr[3])) {
            vbox = U.sizeof(svg);
            vbox.x = vbox.y = 0;
            return vbox;
        }
        else {
            vbox.h = +arr[3];
        }
        return vbox;
    };
    U.selectHtml = function (htmlSelect, optionValue, canFail) {
        if (canFail === void 0) { canFail = false; }
        var $options = $(htmlSelect).find('option');
        var i;
        var isFound = false;
        if (optionValue === null || optionValue === undefined) {
            return;
        }
        for (i = 0; i < $options.length; i++) {
            var opt = $options[i];
            if (opt.value === optionValue) {
                opt.selected = isFound = true;
            }
        }
        U.pw(!isFound, 'SelectOption not found. html:', htmlSelect, ', searchingFor: |' + optionValue + '|, in options:', $options);
        U.pe(!isFound && !canFail, 'SelectOption not found. html:', htmlSelect, ', searchingFor: |' + optionValue + '| in options:', $options);
    };
    U.tabSetup = function (root) {
        if (root === void 0) { root = document.body; }
        $('.UtabHeader').off('click.tabchange').on('click.tabchange', U.tabClick);
        $('.UtabContent').hide();
        var $tabRoots = $('.UtabContainer');
        var i;
        for (i = 0; i < $tabRoots.length; i++) {
            var selectedStr = $tabRoots[i].dataset.selectedtab;
            var $selected = $($tabRoots[i]).find('>.UtabHeaderContainer>.UtabHeader[data-target="' + selectedStr + '"]');
            U.pe($selected.length !== 1, 'tab container must select exactly one tab. found instead: ' + $selected.length, 'tabRoot:', $tabRoots[i], 'selector:', selectedStr);
            // console.clear(); console.log('triggered: ', $selected);
            $selected.trigger('click');
        }
        /*
            U.addCss('customTabs',
              '.UtabHeaderContainer{ padding: 0; margin: 0; display: flex;}\n' +
              '.UtabContainer{\n' +
              'display: flex;\n' +
              'flex-flow: column;\n' +
              '\n}\n' +
              '.UtabHeader{\n' +
              'display: inline-block;\n' +
              'width: auto; flex-grow: 1;\n' +
              'margin: 10px;\n' +
              'margin-bottom: 0;\n' +
              'flex-basis: 0;\n' +
              'text-align: center;\n' +
              'border: 1px solid red;\n}\n' +
              '.UtabHeader+.UtabHeader{\n' +
              'margin-left:0;\n}\n' +
              '.UtabHeader[selected="true"]{\n' +
              'background-color: darkred;\n' +
              '}\n' +
              '.UtabContentContainer{\n' +
              '\n' +
              '    flex-grow: 1;\n' +
              '    flex-basis: 0;\n' +
              '    overflow: auto;' +
              '\n}\n' +
              '.UtabContent{\n' +
              'flex-grow: 1;\n' +
              // 'height: 100%;\n' +
              '\n}\n');*/
    };
    U.tabClick = function (e) {
        var root = e.currentTarget;
        var target = root.dataset.target;
        while (root && !root.classList.contains('UtabContainer')) {
            root = root.parentNode;
        }
        var $root = $(root);
        var oldTarget = root.dataset.selectedtab;
        root.dataset.selectedtab = target;
        var $targethtml = $root.find('>.UtabContentContainer>.UtabContent[data-target="' + target + '"]');
        U.pe($targethtml.length !== 1, 'tab target count (' + $targethtml.length + ') is !== 1');
        var $oldTargetHtml = $root.find('>.UtabContentContainer>.UtabContent[data-target="' + oldTarget + '"]');
        U.pe($oldTargetHtml.length !== 1, 'oldTab target count (' + $oldTargetHtml.length + ') is !== 1');
        var $oldTargetHeader = $root.find('>.UtabHeaderContainer>.UtabHeader[data-target="' + oldTarget + '"]');
        U.pe($oldTargetHeader.length !== 1, 'oldTabHeader target count (' + $oldTargetHeader.length + ') is !== 1');
        var $targetHeader = $root.find('>.UtabHeaderContainer>.UtabHeader[data-target="' + target + '"]');
        U.pe($targetHeader.length !== 1, 'TabHeader target count (' + $targetHeader.length + ') is !== 1');
        if ($targethtml[0].getAttribute('selected') === 'true') {
            return;
        }
        $oldTargetHeader[0].setAttribute('selected', 'false');
        $targetHeader[0].setAttribute('selected', 'true');
        $oldTargetHtml.slideUp();
        $targethtml.slideDown();
    };
    U.removeemptynodes = function (root, includeNBSP, debug) {
        if (includeNBSP === void 0) { includeNBSP = false; }
        if (debug === void 0) { debug = false; }
        var n;
        for (n = 0; n < root.childNodes.length; n++) {
            var child = root.childNodes[n];
            U.pif(debug, 'removeEmptyNodes: ', child.nodeType);
            switch (child.nodeType) {
                default:
                    break;
                case 1:
                    U.removeemptynodes(child, includeNBSP);
                    break; // node: element
                case 2:
                    break; // leaf: attribute
                case 8:
                    break; // leaf: comment
                case 3: // leaf: text node
                    var txt = child.nodeValue;
                    var i = void 0;
                    // replacing first blanks (\n, \r, &nbsp;) with classic spaces.
                    for (i = 0; i < txt.length; i++) {
                        var exit = false && false;
                        switch (txt[i]) {
                            default:
                                exit = true;
                                break; // if contains non-blank is allowed to live but trimmed.
                            case '&nbsp':
                                if (includeNBSP) {
                                    txt[i] = ' ';
                                }
                                else {
                                    exit = true;
                                }
                                break;
                            case ' ':
                            case '\n':
                            case '\r':
                                txt[i] = ' ';
                                break;
                        }
                        if (exit) {
                            break;
                        }
                    }
                    // replacing last blanks (\n, \r, &nbsp;) with classic spaces.
                    for (i = txt.length; i >= 0; i--) {
                        var exit = false && false;
                        switch (txt[i]) {
                            default:
                                exit = true;
                                break; // if contains non-blank is allowed to live but trimmed.
                            case '&nbsp':
                                if (includeNBSP) {
                                    txt[i] = ' ';
                                }
                                else {
                                    exit = true;
                                }
                                break;
                            case ' ':
                            case '\n':
                            case '\r':
                                txt[i] = ' ';
                                break;
                        }
                        if (exit) {
                            break;
                        }
                    }
                    txt = txt.trim();
                    U.pif(debug, 'txt: |' + root.nodeValue + '| --> |' + txt + '| delete?', (/^[\n\r ]*$/g.test(txt)));
                    if (txt === '') {
                        root.removeChild(child);
                        n--;
                    }
                    else {
                        root.nodeValue = txt;
                    }
                    break;
            }
        }
        return root;
    };
    U.replaceAll = function (str, searchText, replacement, debug, warn) {
        if (debug === void 0) { debug = false; }
        if (warn === void 0) { warn = true; }
        if (!str) {
            return str;
        }
        return str.split(searchText).join(replacement);
        var lastPos = 0;
        if (searchText === replacement) {
            U.pw(warn, 'replaceAll invalid parameters: search text === replacement === ' + replacement);
            return str;
        }
        U.pif(debug, 'replaceAll(', searchText, ' with ', replacement, ') starting str:', searchText);
        while (str.indexOf(searchText, lastPos)) {
            var old = searchText;
            var lastPosOld = lastPos;
            searchText = searchText.substring(0, lastPos) + replacement + searchText.substring(lastPos + searchText.length);
            lastPos = lastPos + replacement.length;
            U.pif(debug, 'replaceAll() ', old, ' => ', searchText, '; lastpos:' + lastPosOld + ' => ', lastPos);
        }
        return str;
    };
    U.isValidHtml = function (htmlStr, debug) {
        if (debug === void 0) { debug = false; }
        var div = document.createElement('div');
        if (!htmlStr) {
            return false;
        }
        div.innerHTML = htmlStr;
        // if (div.innerHTML === htmlStr) { return true; }
        var s2 = U.multiReplaceAll(div.innerHTML, [' ', ' ', '\n', '\r'], ['', '', '', '']);
        var s1 = U.multiReplaceAll(htmlStr, [' ', ' ', '\n', '\r'], ['', '', '', '']);
        var ret = s1 === s2;
        if (ret || !debug) {
            return ret;
        }
        var tmp = U.strFirstDiff(s1, s2, 20);
        U.pif(debug, 'isValidHtml() ' + (tmp ? '|' + tmp[0] + '| vs |' + tmp[1] + '|' : 'tmp === null'));
        return ret;
    };
    U.getIndex = function (node) {
        if (!node.parentElement) {
            return -1;
        }
        // return U.toArray(node.parentElement.children).indexOf(node);
        return Array.prototype.indexOf.call(node.parentElement.children, this);
    };
    U.toArray = function (childNodes) {
        if (Array['' + 'from']) {
            return Array['' + 'from'](childNodes);
        }
        var array = [];
        var i = -1;
        while (++i < childNodes.length) {
            array.push(childNodes[i]);
        }
        return array;
    };
    U.getClass = function (obj) { return obj.__proto__.constructor.name; };
    U.isString = function (elem) { return elem + '' === elem; };
    U.permuteV2 = function (input) {
        U.PermuteArr = [];
        U.PermuteUsedChars = [];
        return U.permute0V2(input);
    };
    U.permute0V2 = function (input) {
        var i;
        var ch;
        for (i = 0; i < input.length; i++) {
            ch = input.splice(i, 1)[0];
            U.PermuteUsedChars.push(ch);
            if (input.length === 0) {
                U.PermuteArr.push(U.PermuteUsedChars.slice());
            }
            U.permute0V2(input);
            input.splice(i, 0, ch);
            U.PermuteUsedChars.pop();
        }
        return U.PermuteArr;
    };
    U.permute = function (inputArr, debug) {
        if (debug === void 0) { debug = true; }
        var results = [];
        var permuteInner = function (arr, memo) {
            if (memo === void 0) { memo = []; }
            var cur;
            var i;
            for (i = 0; i < arr.length; i++) {
                cur = arr.splice(i, 1);
                if (arr.length === 0) {
                    results.push(memo.concat(cur));
                }
                permuteInner(arr.slice(), memo.concat(cur));
                arr.splice(i, 0, cur[0]);
            }
            return results;
        };
        return permuteInner(inputArr);
    };
    U.resizableBorderMouseDblClick = function (e) {
        var size = U.sizeof(U.resizingContainer);
        var minSize = U.sizeof(U.resizingBorder);
        var oldSize = new Size(0, 0, +U.resizingContainer.dataset.oldsizew, +U.resizingContainer.dataset.oldsizeh);
        var horiz = U.resizingBorder.classList.contains('left') || U.resizingBorder.classList.contains('right');
        var vertic = U.resizingBorder.classList.contains('top') || U.resizingBorder.classList.contains('bottom');
        if (horiz && vertic)
            return; // do nothing on corner, non voglio che venga resizato sia a minheight che a minwidth, solo uno dei 2.
        minSize.w *= horiz ? 2 : 1;
        minSize.h *= vertic ? 2 : 1;
        minSize.x = size.x;
        minSize.y = size.y;
        console.log('old, size, min', oldSize, size, minSize, oldSize.w && size.equals(minSize));
        if (oldSize.w && size.equals(minSize)) {
            U.resizingContainer.style.width = U.resizingContainer.style.minWidth = U.resizingContainer.style.maxWidth = oldSize.w + 'px';
            U.resizingContainer.style.height = U.resizingContainer.style.minHeight = U.resizingContainer.style.maxHeight = oldSize.h + 'px';
        }
        else {
            U.resizingContainer.style.width = U.resizingContainer.style.minWidth = U.resizingContainer.style.maxWidth = minSize.w + 'px';
            U.resizingContainer.style.height = U.resizingContainer.style.minHeight = U.resizingContainer.style.maxHeight = minSize.h + 'px';
            U.resizingContainer.dataset.oldsizew = '' + size.w;
            U.resizingContainer.dataset.oldsizeh = '' + size.h;
        }
    };
    U.resizableBorderMouseDown = function (e) {
        U.resizingBorder = e.currentTarget;
        U.resizingContainer = U.resizingBorder;
        U.resizingContainer.style.padding = '0';
        U.resizingContainer.style.flexBasis = '0';
        // U.resizingContent.style.width = '100%'; required too
        while (!U.resizingContainer.classList.contains('resizableBorderContainer')) {
            U.resizingContainer = U.resizingContainer.parentNode;
        }
        if (U.checkDblClick())
            U.resizableBorderMouseDblClick(e);
    };
    U.resizableBorderMouseUp = function (e) { U.resizingBorder = U.resizingContainer = null; };
    U.resizableBorderUnset = function (e) {
        e.preventDefault();
        var border = e.currentTarget;
        var container = border;
        while (container.classList.contains('resizableBorderContainer')) {
            container = container.parentNode;
        }
        container.style.flexBasis = '';
        container.style.minHeight = container.style.minWidth =
            container.style.maxHeight = container.style.maxWidth =
                container.style.height = container.style.width = '';
    };
    U.resizableBorderMouseMove = function (e) {
        if (!U.resizingBorder) {
            return;
        }
        var size = U.sizeof(U.resizingContainer);
        var missing = new Point(0, 0);
        var cursor = new Point(e.pageX, e.pageY);
        var puntoDaFarCoinciderePT = cursor.clone();
        var l = U.resizingBorder.classList.contains('left');
        var r = U.resizingBorder.classList.contains('right');
        var t = U.resizingBorder.classList.contains('top');
        var b = U.resizingBorder.classList.contains('bottom');
        if (l) {
            puntoDaFarCoinciderePT.x = size.x;
        }
        if (r) {
            puntoDaFarCoinciderePT.x = size.x + size.w;
        }
        if (t) {
            puntoDaFarCoinciderePT.y = size.y;
        }
        if (b) {
            puntoDaFarCoinciderePT.y = size.y + size.h;
        }
        var add = cursor.subtract(puntoDaFarCoinciderePT, true);
        if (l) {
            add.x *= -1;
        }
        if (t) {
            add.y *= -1;
        }
        // o = p0 - c
        // p = c
        // c = p0-o
        // console.log('lrtb: ', l, r, t, b);
        // console.log('ptcoinc: ', puntoDaFarCoinciderePT, ' cursor:', cursor, ' size:', size, 'adjust:', add);
        size.w += add.x;
        size.h += add.y;
        var borderSize = U.sizeof(U.resizingBorder);
        if (l || r) {
            size.w = Math.max(size.w, borderSize.w * 2);
        }
        if (t || b) {
            size.h = Math.max(size.h, borderSize.h * 2);
        }
        U.resizingContainer.style.width = U.resizingContainer.style.maxWidth = U.resizingContainer.style.minWidth = (size.w) + 'px';
        U.resizingContainer.style.height = U.resizingContainer.style.maxHeight = U.resizingContainer.style.minHeight = (size.h) + 'px';
        // console.log('result:' + U.resizingContainer.style.width);
        U.resizingContainer.style.flexBasis = 'unset';
    };
    U.resizableBorderSetup = function (root) {
        if (root === void 0) { root = document.body; }
        // todo: addBack is great, aggiungilo tipo ovunque. find() esclude l'elemento radice anche se matcha la query, addback rimedia aggiungendo il
        //  previous matched set che matcha la condizione.
        var $arr = $(root).find('.resizableBorder').addBack('.resizableBorder');
        var i = -1;
        var nl = '\n';
        while (++i < $arr.length) {
            U.makeResizableBorder($arr[i]);
        }
        U.eventiDaAggiungereAlBody(null);
        $(document.body).off('mousemove.ResizableBorder').on('mousemove.ResizableBorder', U.resizableBorderMouseMove);
        $(document.body).off('mouseup.ResizableBorder').on('mouseup.ResizableBorder', U.resizableBorderMouseUp);
        $('.resizableBorder.corner').off('mousedown.ResizableBorder').on('mousedown.ResizableBorder', U.resizableBorderMouseDown)
            .off('contextmenu.ResizableBorder').on('contextmenu.ResizableBorder', U.resizableBorderUnset);
        $('.resizableBorder.side').off('mousedown.ResizableBorder').on('mousedown.ResizableBorder', U.resizableBorderMouseDown)
            .off('contextmenu.ResizableBorder').on('contextmenu.ResizableBorder', U.resizableBorderUnset);
        return;
    };
    U.makeResizableBorder = function (html, left, top, right, bottom) {
        if (left === void 0) { left = true; }
        if (top === void 0) { top = true; }
        if (right === void 0) { right = true; }
        if (bottom === void 0) { bottom = true; }
        // if (!html.classList.contains('resizableBorderContainer')) { html.classList.add('resizableBorderContainer'); }
        var container = null;
        var content = null;
        if (false && html.children.length === 9 && html.children[4].classList.contains('resizableContent')) {
            // already initialized.
            container = html;
            content = container.children[4];
            U.clear(container);
        }
        else {
            // first run: initialing now.
            // const tmpNode: HTMLElement = document.createElement('div');
            // while (html.firstChild) { tmpNode.appendChild(html.firstChild); }
            // while (tmpNode.firstChild) { content.appendChild(tmpNode.firstChild); }
            content = html;
            container = U.cloneHtml(html, false);
            html.setAttribute('original', 'true');
            while (container.classList.length > 0) {
                container.classList.remove(container.classList.item(0));
            }
        }
        console.log('container:', container, 'content:', content);
        U.pe(container.children.length !== 0, '');
        // U.copyStyle(html, container);
        html.parentNode.insertBefore(container, html);
        content.classList.remove('resizableBorderContainer');
        content.classList.add('resizableContent');
        container.classList.add('resizableBorderContainer');
        if (left) {
            html.dataset.resizableleft = 'true';
        }
        if (right) {
            html.dataset.resizableright = 'true';
        }
        if (top) {
            html.dataset.resizabletop = 'true';
        }
        if (bottom) {
            html.dataset.resizablebottom = 'true';
        }
        left = html.dataset.resizableleft === 'true';
        right = html.dataset.resizableright === 'true';
        top = html.dataset.resizabletop === 'true';
        bottom = html.dataset.resizablebottom === 'true';
        // const size: Size = U.sizeof(html);
        // container.style.width = size.w + 'px';
        // container.style.height = size.h + 'px';
        var l = U.toHtml('<div class="resizableBorder side left"></div>');
        var r = U.toHtml('<div class="resizableBorder side right"></div>');
        var t = U.toHtml('<div class="resizableBorder side top"></div>');
        var b = U.toHtml('<div class="resizableBorder side bottom"></div>');
        var tl = U.toHtml('<div class="resizableBorder corner top left"></div>');
        var tr = U.toHtml('<div class="resizableBorder corner top right"></div>');
        var bl = U.toHtml('<div class="resizableBorder corner bottom left"></div>');
        var br = U.toHtml('<div class="resizableBorder corner bottom right"></div>');
        var hstripT = U.toHtml('<div class="resizableStrip up"></div>');
        var hstripM = U.toHtml('<div class="resizableStrip center"></div>');
        var hstripB = U.toHtml('<div class="resizableStrip down"></div>');
        l.dataset.resizeenabled = left ? 'true' : 'false';
        r.dataset.resizeenabled = right ? 'true' : 'false';
        t.dataset.resizeenabled = top ? 'true' : 'false';
        b.dataset.resizeenabled = bottom ? 'true' : 'false';
        tl.dataset.resizeenabled = top && left ? 'true' : 'false';
        tr.dataset.resizeenabled = top && right ? 'true' : 'false';
        bl.dataset.resizeenabled = bottom && left ? 'true' : 'false';
        br.dataset.resizeenabled = bottom && right ? 'true' : 'false';
        var style = getComputedStyle(html, null);
        // html.style.border = 'none';
        t.style.borderTop = tl.style.borderTop = tr.style.borderTop = style.borderTop;
        b.style.borderBottom = bl.style.borderBottom = br.style.borderBottom = style.borderBottom;
        l.style.borderLeft = tl.style.borderLeft = bl.style.borderLeft = style.borderLeft;
        r.style.borderRight = tr.style.borderRight = br.style.borderRight = style.borderRight;
        // per un bug lo stile viene sempre letto come "none"
        /*l.style.borderStyle = 'solid';
        r.style.borderStyle = 'solid';
        t.style.borderStyle = 'solid';
        b.style.borderStyle = 'solid';*/
        //console.log('style.border:', style.border);
        /*U.pe(t.style.borderTopStyle === 'none', '1');
        U.pe(isNaN(+t.style.borderWidth), '2');
        U.pe(+t.style.borderWidth === 0, '3');
        if (t.style.borderTopStyle === 'none' || isNaN(+t.style.borderWidth) || +t.style.borderWidth === 0) {
          t.style.borderWidth = t.style.height = t.style.width = t.style.flexGrow = '0'; }
        if (b.style.borderBottomStyle === 'none' || isNaN(+b.style.borderWidth) || +b.style.borderWidth === 0) {
          b.style.borderWidth = b.style.height = b.style.width = b.style.flexGrow = '0'; }
        if (l.style.borderLeftStyle === 'none' || isNaN(+l.style.borderWidth) || +l.style.borderWidth === 0) {
          l.style.borderWidth = l.style.height = l.style.width = l.style.flexGrow = '0'; }
        if (r.style.borderTopStyle === 'none' || isNaN(+r.style.borderWidth) || +r.style.borderWidth === 0) {
          r.style.borderWidth = r.style.height = r.style.width = r.style.flexGrow = '0'; }*/
        /*
        const borderSizeL: Size;
        const borderSizeR: Size;
        const borderSizeT: Size;
        const borderSizeB: Size;
        tl.style.width = l.style.width = bl.style.width = (borderSizeL.w) + 'px';
        tr.style.width = r.style.width = br.style.width = (borderSizeR.w) + 'px';
        tl.style.height = t.style.height = tr.style.height = (borderSizeT.h) + 'px';
        bl.style.height = b.style.height = br.style.height = (borderSizeB.h) + 'px';
    
        t.style.width = b.style.width = (size.w - (borderSizeL.w + borderSizeR.w)) + 'px';
        l.style.height = r.style.height = (size.h - (borderSizeT.h + borderSizeB.w)) + 'px';*/
        // html.parentNode.appendChild(container);
        hstripT.appendChild(tl);
        hstripT.appendChild(t);
        hstripT.appendChild(tr);
        hstripM.appendChild(l);
        hstripM.appendChild(content);
        hstripM.appendChild(r);
        hstripB.appendChild(bl);
        hstripB.appendChild(b);
        hstripB.appendChild(br);
        container.appendChild(hstripT);
        container.appendChild(hstripM);
        container.appendChild(hstripB);
        container.style.border = 'none'; /*
        const size: Size = U.sizeof(container);
        const hbordersize = 10;
        const vbordersize = 10;
        container.style.width = Math.max(hbordersize * 2 + size.w) + 'px';
        container.style.height = Math.max(vbordersize * 2 + size.h) + 'px';*/
        content.style.border = 'none';
        if (!content.style.width || content.style.width === 'auto') {
            content.style.width = '100%';
            content.style.height = '100%';
        }
        content.style.minWidth = '0';
        content.style.minHeight = '0';
    };
    U.copyStyle = function (from, to, computedStyle) {
        if (computedStyle === void 0) { computedStyle = null; }
        // trying to figure out which style object we need to use depense on the browser support, so we try until we have one.
        if (!computedStyle) {
            computedStyle = from['' + 'currentStyle'] || document.defaultView.getComputedStyle(from, null);
        }
        // if the browser dose not support both methods we will return failure.
        if (!computedStyle) {
            return false;
        }
        // checking that the value is not a undefined, object, function, empty or int index ( happens on some browser)
        var stylePropertyValid = function (name, value) {
            // nb: mind that typeof [] === 'object';
            return typeof value !== 'undefined' && typeof value !== 'object' && typeof value !== 'function' && value.length > 0
                // && value !== parseInt(value, 10); };
                && +name !== parseInt(name, 10);
        };
        var property;
        for (property in computedStyle) {
            // hasOwnProperty is useless, but compiler required
            // console.log('property[', property, '] = ', computedStyle[property]);
            if (!computedStyle.hasOwnProperty(property) || !stylePropertyValid(property, computedStyle[property])) {
                continue;
            }
            to.style[property] = computedStyle[property];
        }
        return true;
    };
    U.cclear = function () { console.clear(); console.trace(); };
    U.toDottedURI = function (uri) {
        return U.replaceAll(U.replaceAll(uri.substring(uri.indexOf('://') + '://'.length), '\\', '/'), '/', '.');
    };
    U.toHttpsURI = function (uri, folderChar) {
        if (folderChar === void 0) { folderChar = '/'; }
        return 'https://' + U.replaceAll(uri, '.', folderChar);
    };
    U.toNumber = function (o) {
        if (o === null || o === undefined || (U.isString(o) && o.trim() === ''))
            return null;
        o = +o;
        if (isNaN(o))
            return null;
        return o;
    };
    U.isNumber = function (o) { return +o === o && o !== NaN; };
    U.isNumberArray = function (o, minn, max, ifItIsEmptyArrReturn) {
        if (minn === void 0) { minn = Number.NEGATIVE_INFINITY; }
        if (max === void 0) { max = Number.POSITIVE_INFINITY; }
        if (ifItIsEmptyArrReturn === void 0) { ifItIsEmptyArrReturn = true; }
        var validation = function (val) { return U.isNumber(val) && val >= minn && val <= max; };
        return U.isArrayOf(o, validation, ifItIsEmptyArrReturn);
    };
    U.isIntegerArray = function (o, minn, max, ifItIsEmptyArrReturn) {
        if (minn === void 0) { minn = Number.NEGATIVE_INFINITY; }
        if (max === void 0) { max = Number.POSITIVE_INFINITY; }
        if (ifItIsEmptyArrReturn === void 0) { ifItIsEmptyArrReturn = true; }
        var validation = function (val) { return (U.isNumber(val) && Math.floor(val) === val && val >= minn && val <= max); };
        return U.isArrayOf(o, validation, ifItIsEmptyArrReturn);
    };
    U.isCharArray = function (values, ifItIsEmpryArrayReturn) {
        if (ifItIsEmpryArrayReturn === void 0) { ifItIsEmpryArrayReturn = true; }
        var charValidator = function (val) { return (val.length === 1); };
        return U.isArrayOf(values, charValidator, ifItIsEmpryArrayReturn);
    };
    U.isArrayOf = function (value, functionCheck, ifItIsEmptyArrayReturn) {
        if (ifItIsEmptyArrayReturn === void 0) { ifItIsEmptyArrayReturn = true; }
        if (!Array.isArray(value)) {
            return false;
        }
        var i;
        if (value.length === 0) {
            return ifItIsEmptyArrayReturn;
        }
        for (i = 0; i < value.length; i++) {
            if (!functionCheck(value[i]) && !U.isArrayOf(value[i], functionCheck, ifItIsEmptyArrayReturn)) {
                return false;
            }
        }
        return true;
    };
    U.isStringArray = function (value, ifItIsEmptyArrayReturn) {
        if (ifItIsEmptyArrayReturn === void 0) { ifItIsEmptyArrayReturn = true; }
        if (!Array.isArray(value)) {
            return false;
        }
        var i;
        if (value.length === 0) {
            return ifItIsEmptyArrayReturn;
        }
        for (i = 0; i < value.length; i++) {
            if (!U.isString(value[i]) && !U.isStringArray(value[i], true)) {
                return false;
            }
        }
        return true;
    };
    U.clipboardCopy = function (text) {
        if (!U.clipboardinput) {
            U.clipboardinput = document.createElement('input');
            U.clipboardinput.id = U.prefix + 'CopyDataToClipboard';
            U.clipboardinput.type = 'text';
            U.clipboardinput.style.display = 'block';
            U.clipboardinput.style.position = 'absolute';
            U.clipboardinput.style.top = '-100vh';
        }
        document.body.appendChild(U.clipboardinput);
        U.clipboardinput.value = text;
        U.clipboardinput.select();
        document.execCommand('copy');
        document.body.removeChild(U.clipboardinput);
        U.clearSelection();
    };
    U.clearSelection = function () { };
    U.refreshPage = function () { window.location.href += ''; };
    U.isArray = function (v) { return Array.isArray(v); };
    U.isEmptyObject = function (v, returnIfNull, returnIfUndefined) {
        if (returnIfNull === void 0) { returnIfNull = true; }
        if (returnIfUndefined === void 0) { returnIfUndefined = false; }
        return U.isObject(v, returnIfNull, returnIfUndefined) && $.isEmptyObject(v);
    };
    U.isObject = function (v, returnIfNull, returnIfUndefined, retIfArray) {
        if (returnIfNull === void 0) { returnIfNull = true; }
        if (returnIfUndefined === void 0) { returnIfUndefined = false; }
        if (retIfArray === void 0) { retIfArray = false; }
        if (v === null) {
            return returnIfNull;
        }
        if (v === undefined) {
            return returnIfUndefined;
        }
        if (Array.isArray(v)) {
            return retIfArray;
        }
        // nb: mind that typeof [] === 'array'
        return typeof v === 'object';
    };
    U.isFunction = function (v) { return (typeof v === 'function'); };
    U.isPrimitive = function (v, returnIfNull, returnIfUndefined) {
        if (returnIfNull === void 0) { returnIfNull = true; }
        if (returnIfUndefined === void 0) { returnIfUndefined = true; }
        if (v === null) {
            return returnIfNull;
        }
        if (v === undefined) {
            return returnIfUndefined;
        }
        // return (typeof v !== 'function') && (typeof v !== 'object') && (!U.isArray(v));
        return !U.isObject(v) && !Array.isArray(v) && !U.isFunction(v);
    };
    U.getEndingNumber = function (s, ignoreNonNumbers, allowDecimal) {
        if (ignoreNonNumbers === void 0) { ignoreNonNumbers = false; }
        if (allowDecimal === void 0) { allowDecimal = false; }
        var i = s.length;
        var numberEnd = -1;
        while (--i > 0) {
            if (!isNaN(+s[i])) {
                if (numberEnd === -1) {
                    numberEnd = i;
                }
                continue;
            }
            if (s[i] === '.' && !allowDecimal) {
                break;
            }
            if (s[i] === '.') {
                allowDecimal = false;
                continue;
            }
            if (!ignoreNonNumbers) {
                break;
            }
            if (numberEnd !== -1) {
                ignoreNonNumbers = false;
            }
        }
        s = numberEnd === -1 ? '1' : s.substring(i, numberEnd);
        return +parseFloat(s);
    };
    U.increaseEndingNumber = function (s, allowLastNonNumberChars, allowDecimal, increaseWhile) {
        if (allowLastNonNumberChars === void 0) { allowLastNonNumberChars = false; }
        if (allowDecimal === void 0) { allowDecimal = false; }
        if (increaseWhile === void 0) { increaseWhile = null; }
        /*let i = s.length;
        let numberEnd = -1;
        while (--i > 0) {
          if (!isNaN(+s[i])) { if (numberEnd === -1) { numberEnd = i; } continue; }
          if (s[i] === '.' && !allowDecimal) { break; }
          if (s[i] === '.') { allowDecimal = false; continue; }
          if (!ignoreNonNumbers) { break; }
          if (numberEnd !== -1) { ignoreNonNumbers = false; }
        }
        if (numberEnd === -1) { return s + '_1'; }
        // i++;
        numberEnd++;*/
        var regexpstr = '([0-9]+' + (allowDecimal ? '|[0-9]+\\.[0-9]+' : '') + ')' + (allowLastNonNumberChars ? '[^0-9]*' : '') + '$';
        var matches = new RegExp(regexpstr, 'g').exec(s); // Global (return multi-match) Single line (. matches \n).
        // S flag removed for browser support (firefox), should work anyway.
        U.pe(matches.length > 2, 'parsing error: /' + regexpstr + '/gs.match(' + s + ')');
        var i = s.length - matches[0].length;
        var prefix = s.substring(0, i);
        var num = 1 + (+matches[1]);
        // U.pe(isNaN(num), 'wrong parsing:', s, s.substring(i, numberEnd), i, numberEnd);
        // const prefix: string = s.substring(0, i);
        // console.log('increaseendingNumber:  prefix: |' + prefix+'| num:'+num, '[i] = ['+i+']; s: |'+s+"|");
        while (increaseWhile !== null && increaseWhile(prefix + num)) {
            num++;
        }
        return prefix + num;
    };
    U.isValidName = function (name) { return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name); };
    U.getTSClassName = function (thing) { return thing.constructor.name + ''; };
    U.detailButtonSetup = function ($root) {
        if ($root === void 0) { $root = null; }
        if (!$root)
            $root = $(document.body);
        $root.find('button.detail').off('click.detailbutton').on('click.detailbutton', function (e, forceHide) {
            var btn = e.currentTarget;
            var $btn = $(btn);
            var $detailPanel = $root.find(btn.getAttribute('target'));
            var otherButtons = $(btn.parentElement).find('button.detail').toArray().filter(function (x) { return x != btn; });
            // $styleown.find('div.detail:not(' + btn.getAttribute('target') + ')');
            var b = btn.dataset.on === '1';
            if (forceHide || b) {
                btn.style.width = '';
                btn.dataset.on = '0';
                btn.style.borderBottom = '';
                btn.style.borderBottomLeftRadius = '';
                btn.style.borderBottomRightRadius = '';
                $btn.find('.closed').show();
                $btn.find('.opened').hide();
                // $detailcontainers.show();
                $detailPanel.hide();
            }
            else {
                var size = U.sizeof(btn);
                btn.style.width = size.w + 'px';
                btn.dataset.on = '1';
                btn.style.borderBottom = 'none'; // '3px solid #252525';
                btn.style.borderBottomLeftRadius = '0';
                btn.style.borderBottomRightRadius = '0';
                $btn.find('.closed').hide();
                $btn.find('.opened').show()[0].style.width = (size.w - 15 * 2) + 'px';
                console.log('others:', otherButtons, 'me:', $btn);
                $(otherButtons).data('on', '1').trigger('click', true);
                $detailPanel.show();
            }
        });
        $root.find('div.detail').hide();
    };
    // Prevent the backspace key from navigating back.
    U.preventBackSlashHistoryNavigation = function (event) {
        if (!event || !event.key || event.key.toLowerCase() !== 'backspace') {
            return true;
        }
        var types = ['text', 'password', 'file', 'search', 'email', 'number', 'date',
            'color', 'datetime', 'datetime-local', 'month', 'range', 'search', 'tel', 'time', 'url', 'week'];
        var srcElement = $(event['' + 'srcElement'] || event.target);
        var disabled = srcElement.prop('readonly') || srcElement.prop('disabled');
        if (!disabled) {
            if (srcElement[0].isContentEditable || srcElement.is('textarea')) {
                return true;
            }
            if (srcElement.is('input')) {
                var type = srcElement.attr('type');
                if (!type || types.indexOf(type.toLowerCase()) > -1) {
                    return true;
                }
            }
        }
        event.preventDefault();
        return false;
    };
    // esercizio per antonella array deep copy
    /// copy all the element inside the array, eventually deep cloning but not duplicating objects or leaf elements.
    U.ArrayCopy = function (arr, deep) {
        var ret = [];
        var i;
        for (i = 0; i < arr.length; i++) {
            if (deep && Array.isArray(arr[i])) {
                var tmp = U.ArrayCopy(arr[i], deep);
                ret.push(tmp);
            }
            else {
                ret.push(arr[i]);
            }
        }
        return ret;
    };
    U.ArrayMerge = function (arr1, arr2) {
        if (!arr1 || !arr2)
            return;
        Array.prototype.push.apply(arr1, arr2);
    };
    U.ArrayMergeUnique = function (arr1, arr2) {
        if (!arr1 || !arr2)
            return;
        var i;
        for (i = 0; i < arr2.length; i++) {
            U.ArrayAdd(arr1, arr2[i]);
        }
    };
    U.ArrayAdd = function (arr, elem, unique, throwIfContained) {
        if (unique === void 0) { unique = true; }
        if (throwIfContained === void 0) { throwIfContained = false; }
        U.pe(!arr || !Array.isArray(arr), 'arr null or not array:', arr);
        if (!unique) {
            arr.push(elem);
            return true;
        }
        if (arr.indexOf(elem) === -1) {
            arr.push(elem);
            return true;
        }
        U.pe(throwIfContained, 'element already contained:', arr, elem);
        return false;
    };
    U.fieldCount = function (obj) {
        var counter = 1 - 1;
        for (var key in obj) {
            if (!(key in obj)) {
                continue;
            }
            counter++;
        }
        return counter;
    };
    U.isPositiveZero = function (m) {
        if (Object['is' + '']) {
            return Object['is' + ''](m, +0);
        }
        return (1 / m === Number.POSITIVE_INFINITY);
    };
    U.isNegativeZero = function (m) {
        if (Object['is' + '']) {
            return Object['is' + ''](m, -0);
        }
        return (1 / m === Number.NEGATIVE_INFINITY);
    };
    U.TanToRadian = function (n) { return U.DegreeToRad(U.TanToDegree(n)); };
    U.TanToDegree = function (n) {
        if (U.isPositiveZero(n)) {
            return 0;
        }
        if (n === Number.POSITIVE_INFINITY) {
            return 90;
        }
        if (U.isNegativeZero(n)) {
            return 180;
        }
        if (n === Number.POSITIVE_INFINITY) {
            return 270;
        }
        return U.RadToDegree(Math.atan(n));
    };
    U.RadToDegree = function (radians) { return radians * (180 / Math.PI); };
    U.DegreeToRad = function (degree) { return degree * (Math.PI / 180); };
    U.replaceAllRegExp = function (value, regExp, replacement) { return value.replace(regExp, replacement); };
    U.fixHtmlSelected = function ($root) {
        var $selecteds = $root.find('select');
        var i;
        for (i = 0; i < $selecteds.length; i++) {
            var $option = $($selecteds[i]).find('option[selected]');
            U.selectHtml($selecteds[i], $option.length ? $option[0].value : null);
        }
    };
    U.computeMeasurableAttributeRightPart = function (str, attr, logic, measurableHtml, size, absTargetSize, relTargetSize, allowVariables) {
        if (size === void 0) { size = null; }
        if (absTargetSize === void 0) { absTargetSize = null; }
        if (relTargetSize === void 0) { relTargetSize = null; }
        if (allowVariables === void 0) { allowVariables = true; }
        str = U.changeBackVarTemplateDelimitersInMeasurablesAttr(str);
        if (!size) {
            size = U.sizeof(measurableHtml);
        }
        var relativeRoot = measurableHtml;
        while (!relativeRoot.classList.contains('vertexShell')) {
            relativeRoot = relativeRoot.parentElement;
        }
        if (!absTargetSize) {
            absTargetSize = U.sizeof(relativeRoot);
        }
        if (!relTargetSize) {
            var $relativeHtml = $(relativeRoot).find(measurableHtml.getAttribute('relativeSelectorOf' + attr.name));
            U.pw($relativeHtml.length > 1, 'found more than one relative target (', $relativeHtml, ') assigned to: ', measurableHtml, ' root:', relativeRoot);
            relTargetSize = $relativeHtml.length ? U.sizeof($relativeHtml[0]) : absTargetSize;
        }
        var relativePos = size.tl().subtract(relTargetSize.tl(), false);
        var absolutePos = size.tl().subtract(absTargetSize.tl(), false);
        var str0debug = str;
        str = U.replaceVarsString(logic, str);
        // ERRORE parzialmente fixato: se il relative container è la vertexRoot che ha bordo e boxsizing = border-box
        // allora this.top == absPositionY - ShellBorderY invece di this.top == absPositionY
        // consiglio generico: non usare mai position: relative su cose con i bordi o con border-box
        var rootStyle = window.getComputedStyle(relativeRoot);
        var borderFix = new Point(+rootStyle.borderTopWidth, +rootStyle.borderLeftWidth);
        if (rootStyle.position === 'relative' && rootStyle.boxSizing === 'border-box') {
            absolutePos.subtract(borderFix, false);
        }
        // relativePos.subtract(borderFix, false); should not work, should check borders on relativetarget vs border on curr. or maybe is correct without any fix.
        if (allowVariables) {
            str = U.multiReplaceAll(str, ['positionX', 'positionX'], ['positionRelX', 'positionRelY']);
            str = U.multiReplaceAll(str, ['width', 'height', 'positionAbsX', 'positionAbsY', 'positionRelX', 'positionRelY'], ['' + size.w, '' + size.h, '' + absolutePos.x, '' + absolutePos.y, '' + relativePos.x, '' + relativePos.y]);
            str = U.multiReplaceAll(str, ['absoluteTargetSizeX', 'absoluteTargetSizeY', 'absoluteTargetSizeW', 'absoluteTargetSizeH'], ['' + absTargetSize.x, '' + absTargetSize.y, '' + absTargetSize.w, '' + absTargetSize.h]);
            str = U.multiReplaceAll(str, ['relativeTargetSizeX', 'relativeTargetSizeY', 'relativeTargetSizeW', 'relativeTargetSizeH'], ['' + relTargetSize.x, '' + relTargetSize.y, '' + relTargetSize.w, '' + relTargetSize.h]);
        } /*
        if (true || attr.name === '_ruleY') {
          console.log(attr.name + ': WallH: ('+(logic.childrens[0] as MAttribute).values[0] + '), top: ' + measurableHtml.style.top +
            ' |' + str0debug + '| --> |' + str + '| abs:', absTargetSize, ' rel:', relTargetSize, ' size:', size, ' htmls.abs', relativeRoot,
            ' rel.html:', $(relativeRoot).find(measurableHtml.getAttribute('relativeSelectorOf' + attr.name)), ' size.html:', measurableHtml,
            'absPos:', absolutePos, 'relPos:', relativePos);
        }*/
        var evalContext = { a: measurableHtml.attributes };
        var a = {};
        var i;
        for (i = 0; i < measurableHtml.attributes.length; i++) {
            var attr_1 = measurableHtml.attributes[i];
            a[attr_1.name] = attr_1.value;
        }
        try {
            // str =  U.evalInContext(evalContext, str);
            str = eval(str);
        }
        catch (e) {
            U.pw(true, 'error occurred while evaluating ', str, 'in measurable attribute ', attr, 'err:', e, ', are you' +
                ' missing quotes?');
        }
        return str;
    };
    U.computeResizableAttribute = function (attr, logic, measurableHtml, size, absTargetSize, relTargetSize) {
        if (size === void 0) { size = null; }
        if (absTargetSize === void 0) { absTargetSize = null; }
        if (relTargetSize === void 0) { relTargetSize = null; }
        var val = attr.value;
        var pos = 0;
        var operator = null;
        var i;
        for (i = 1; i < val.length - 1; i++) {
            switch (val[i]) {
                case '>':
                    if (val[i - 1] !== '-') {
                        continue;
                    } // ignoro lo pseudo operatore "->" per selezionare un attributo in measurableExport
                    pos = i;
                    operator = (val[i + 1] === '=' ? '>=' : '>');
                    break;
                case '<':
                    pos = i;
                    operator = (val[i + 1] === '=' ? '<=' : '<');
                    break;
                case '!':
                    if (val[i + 1] !== '=') {
                        continue;
                    }
                    pos = i;
                    operator = '=';
                    break;
                case '=':
                    pos = i;
                    operator = '=';
                    break;
                default: continue;
            }
        }
        if (!operator) {
            U.pw(true, 'found measurable _attribute without operator: ', attr);
            return null;
        }
        if (!size) {
            size = U.sizeof(measurableHtml);
        }
        var leftSide = val.substr(0, pos).trim();
        var rightSide = val.substr(pos + operator.length).trim();
        var value = null;
        try {
            value = U.computeMeasurableAttributeRightPart(rightSide, attr, logic, measurableHtml, size, absTargetSize, relTargetSize);
        }
        catch (e) {
            U.pw(true, 'failed to read expression of ' + attr.name + ': |' + attr.value
                + '| --> |' + rightSide + '|. reason:' + e.toString()
                + '; the allowed variables are: width, height, positionRelX, positionRelY, positionAbsX, positionAbsY, ' +
                'relativeTargetSizeX, relativeTargetSizeY, relativeTargetSizeW, relativeTargetSizeH, ' +
                'absoluteTargetSizeX, absoluteTargetSizeY, absoluteTargetSizeW, absoluteTargetSizeH, ' + '. and js functions.');
        }
        // console.log('attr:', attr, 'left:', leftSide, 'right:', rightSide, ' ---> |' + value + '|');
        return { destination: leftSide, operator: operator, value: value };
    };
    U.processMeasuring = function (logic, m, ui) {
        var size = U.sizeof(m.html);
        var relativeRoot = m.html;
        while (!relativeRoot.classList.contains('vertexShell')) {
            relativeRoot = relativeRoot.parentElement;
        }
        var absTargetSize = U.sizeof(relativeRoot);
        console.log('measurableHtml parsed special attributes:', m);
        var i;
        for (i = 0; i < m.variables.length; i++) {
            U.processMeasurableVariable(m.variables[i], logic, m.html, size, absTargetSize);
        }
        for (i = 0; i < m.imports.length; i++) {
            U.processMeasurableImport(m.imports[i], logic, m.html, null, absTargetSize);
        }
        for (i = 0; i < m.rules.length; i++) {
            var attr = m.rules[i];
            var val = attr.value;
            if (val.indexOf('=') === -1) {
                U.pw(true, 'found a .resizable rule attribute without "=". ' + attr.name + ': |' + val + '| inside:', m.html);
                continue;
            }
            U.processMeasurableRule(attr, logic, m.html, size, absTargetSize);
        }
        for (i = 0; i < m.constraints.length; i++) {
            var attr = m.constraints[i];
            var val = attr.value;
            if (val.indexOf('=') === -1) {
                U.pw(true, 'found a .resizable constraint without "=". ' + attr.name + ': |' + val + '| inside:', m.html);
                continue;
            }
            // NB: size must be null, constraint will modify size without updating the object, so it must be recalculated.
            U.processMeasurableConstraint(attr, logic, m.html, null, absTargetSize);
        }
        for (i = 0; i < m.dstyle.length; i++) {
            U.processMeasurableDstyle(m.dstyle[i], logic, m.html, null, absTargetSize);
        }
        for (i = 0; i < m.exports.length; i++) {
            var attr = m.exports[i];
            var val = attr.value;
            if (val.indexOf('=') === -1) {
                U.pw(true, 'found a .resizable export attribute without "=". ' + attr.name + ': |' + val + '| inside:', m.html);
                continue;
            }
            U.processMeasurableExport(attr, logic, m.html, size, absTargetSize);
        }
        for (i = 0; i < m.chain.length; i++) {
            U.processMeasurableChain(m.chain[i], logic, m.html, null, absTargetSize, logic.getVertex(), ui);
        }
        for (i = 0; i < m.chainFinal.length; i++) {
            U.processMeasurableChain(m.chainFinal[i], logic, m.html, null, absTargetSize, logic.getVertex(), ui);
        }
    };
    U.processMeasurableExport = function (attr, logic, measurableHtml, size, absTargetSize) {
        if (size === void 0) { size = null; }
        if (absTargetSize === void 0) { absTargetSize = null; }
        var rule = U.computeResizableAttribute(attr, logic, measurableHtml, size, absTargetSize);
        // U.pw(true, 'process export:', rule, attr);
        if (!rule) {
            return;
        }
        var attributePseudoSelector = '->';
        rule.destination = U.changeBackVarTemplateDelimitersInMeasurablesAttr(rule.destination);
        rule.destination = U.replaceVarsString(logic, rule.destination);
        var pos = rule.destination.lastIndexOf(attributePseudoSelector);
        var htmlSelector;
        var attribName;
        if (pos !== -1) {
            htmlSelector = rule.destination.substring(0, pos);
            attribName = rule.destination.substring(pos + attributePseudoSelector.length).trim();
        }
        else {
            htmlSelector = rule.destination;
            attribName = null;
        }
        var $targets = $(htmlSelector);
        if (attribName) {
            $targets.attr(attribName, rule.value);
        }
        else {
            $targets.html(rule.value);
        }
    };
    U.processMeasurableChain = function (attr0, logic, measurableHtml, size, absTargetSize, vertex, ui) {
        if (size === void 0) { size = null; }
        if (absTargetSize === void 0) { absTargetSize = null; }
        var destination = U.computeMeasurableAttributeRightPart('\'' + attr0.value + '\'', attr0, logic, measurableHtml, size, absTargetSize, null, false);
        var attributePseudoSelector = '->';
        var pos = destination.indexOf(attributePseudoSelector);
        var htmlSelector;
        var attribName;
        if (pos !== -1) {
            htmlSelector = destination.substring(0, pos);
            attribName = destination.substring(pos + attributePseudoSelector.length).trim();
        }
        else {
            htmlSelector = destination;
            attribName = null;
        }
        var $targets = $(htmlSelector);
        console.log('measurableChain: ' + htmlSelector + ' -> ' + attribName + '| targets:', $targets);
        U.pe($targets.length <= 0, 'measurableChain: ' + htmlSelector + ' -> ' + attribName + '| targets:', $targets);
        var i;
        for (i = 0; i < $targets.length; i++) {
            var html = $targets[i];
            var attr = attribName ? html.attributes.getNamedItem(attribName) : null;
            if (!attr) {
                vertex.measuringChanged(ui, null, html);
                continue;
            }
            if (attribName.indexOf('_') !== 0) {
                continue;
            }
            if (attribName.indexOf('_rule') === 0) {
                U.processMeasurableRule(attr, logic, html, null, null);
            }
            else if (attribName.indexOf('_import') === 0) {
                U.processMeasurableImport(attr, logic, html, null, null);
            }
            else if (attribName.indexOf('_export') === 0) {
                U.processMeasurableExport(attr, logic, html, null, null);
            }
            else if (attribName.indexOf('_constraint') === 0) {
                U.processMeasurableConstraint(attr, logic, html, null, null);
            }
            else if (attribName.indexOf('_dstyle') === 0) {
                U.processMeasurableDstyle(attr, logic, html, null, null);
            }
            else {
                U.processMeasurableVariable(attr, logic, html, null, null);
            }
            var val = $targets.length === 1 ? html.attributes.getNamedItem(attribName.substr(1)) : null;
            if (!val) {
                continue;
            }
            measurableHtml.setAttribute(attr0.name.substr(1), val.value);
        }
    };
    U.processMeasurableRule = function (attr, logic, measurableHtml, size, absTargetSize) {
        if (size === void 0) { size = null; }
        if (absTargetSize === void 0) { absTargetSize = null; }
        var rule = U.computeResizableAttribute(attr, logic, measurableHtml, size, absTargetSize);
        if (!rule) {
            return;
        }
        console.log('rule:', rule, 'attr:', attr);
        var tmp = U.replaceSingleVarGetParentAndChildKey(logic, rule.destination);
        if (!tmp) {
            U.pw(true, 'replaceVar of ' + rule.destination + '| failed. while parsing the resizable.rule |' + attr.name + ' in vertex of: ' + logic.name);
            return;
        }
        if (!tmp.parent && !(tmp.parent instanceof ModelPiece)) {
            U.pw(true, 'found a rule template with his parent missing or not instance of ModelPiece?? :', tmp.parent, 'rule:', rule);
            return;
        }
        var destinationParent = tmp.parent;
        switch (tmp.childkey) {
            default:
                U.pw(true, 'The rule ' + attr.name + ': |' + attr.value + '| is targeting a valid but not yet allowed field, currently only ".values" is allowed.');
                break;
            case 'values':
                if (destinationParent instanceof MAttribute) {
                    destinationParent.setValue(rule.value);
                    break;
                }
                U.pw(true, 'The rule ' + attr.name + ': |' + attr.value + '| is trying to set "value" on an invalid modelPiece:', destinationParent);
                break;
        }
    };
    U.processMeasurableConstraint = function (attr, logic, measurableHtml, size, absTargetSize) {
        if (size === void 0) { size = null; }
        if (absTargetSize === void 0) { absTargetSize = null; }
        return U.processMeasurableImport(attr, logic, measurableHtml, size, absTargetSize);
    };
    U.processMeasurableImport = function (attr, logic, measurableHtml, size, absTargetSize) {
        if (size === void 0) { size = null; }
        if (absTargetSize === void 0) { absTargetSize = null; }
        var relativeRoot = measurableHtml;
        while (!relativeRoot.classList.contains('vertexShell')) {
            relativeRoot = relativeRoot.parentElement;
        }
        var $relativeHtml = $(relativeRoot).find(measurableHtml.getAttribute('relativeSelectorOf' + attr.name));
        U.pw($relativeHtml.length > 1, 'found more than one relative target (', $relativeHtml, ') assigned to: ', measurableHtml, ' root:', relativeRoot);
        var relativeSize = $relativeHtml.length ? U.sizeof($relativeHtml[0]) : absTargetSize;
        var rule = U.computeResizableAttribute(attr, logic, measurableHtml, size, absTargetSize, relativeSize);
        if (!rule) {
            return;
        }
        var outputSize = size.duplicate();
        switch (rule.destination) {
            default:
                U.pw(true, 'invalid import destination: |' + rule.destination + '| found in html:', measurableHtml);
                break;
            case 'width':
                outputSize.w = rule.value;
                break;
            case 'height':
                outputSize.h = rule.value;
                break;
            case 'positionAbsX':
                outputSize.x = (absTargetSize.tl() + rule.value);
                break;
            case 'positionAbsY':
                outputSize.y = (absTargetSize.tl() + rule.value);
                break;
            case 'positionRelX':
                outputSize.x = (relativeSize.tl() + rule.value);
                break;
            case 'positionRelY':
                outputSize.y = (relativeSize.tl() + rule.value);
                break;
        }
        var setx = function (val) { measurableHtml.setAttributeNS(null, 'x', '' + val); measurableHtml.style.left = val + 'px'; };
        var sety = function (val) { measurableHtml.setAttributeNS(null, 'y', '' + val); measurableHtml.style.top = val + 'px'; };
        var setw = function (val) { measurableHtml.setAttributeNS(null, 'width', '' + val); measurableHtml.style.width = val + 'px'; };
        var seth = function (val) { measurableHtml.setAttributeNS(null, 'height', '' + val); measurableHtml.style.height = val + 'px'; };
        var add = 1;
        switch (rule.operator) {
            default:
                U.pe(true, 'unrecognized operator (not your fault, 100% developer failure): ' + rule.operator, attr);
                break;
            case '>=':
                if (size.x < outputSize.x) {
                    setx(outputSize.x);
                }
                if (size.y < outputSize.y) {
                    sety(outputSize.y);
                }
                if (size.w < outputSize.w) {
                    setw(outputSize.w);
                }
                if (size.h < outputSize.h) {
                    seth(outputSize.h);
                }
                break;
            case '>':
                if (size.x <= outputSize.x) {
                    setx(outputSize.x + add);
                }
                if (size.y <= outputSize.y) {
                    sety(outputSize.y + add);
                }
                if (size.w <= outputSize.w) {
                    setw(outputSize.w + add);
                }
                if (size.h <= outputSize.h) {
                    seth(outputSize.h + add);
                }
                break;
            case '<':
                if (size.x >= outputSize.x) {
                    setx(outputSize.x + add);
                }
                if (size.y >= outputSize.y) {
                    sety(outputSize.y + add);
                }
                if (size.w >= outputSize.w) {
                    setw(outputSize.w + add);
                }
                if (size.h >= outputSize.h) {
                    seth(outputSize.h + add);
                }
                break;
            case '<=':
                if (size.x > outputSize.x) {
                    setx(outputSize.x);
                }
                if (size.y > outputSize.y) {
                    sety(outputSize.y);
                }
                if (size.w > outputSize.w) {
                    setw(outputSize.w);
                }
                if (size.h > outputSize.h) {
                    seth(outputSize.h);
                }
                break;
            case '=':
                setx(outputSize.x);
                sety(outputSize.y);
                setw(outputSize.w);
                seth(outputSize.h);
                break;
        }
    };
    U.processMeasurableVariable = function (attr, logic, measurableHtml, size, absTargetSize, relTargetSize, allowVariables) {
        if (size === void 0) { size = null; }
        if (absTargetSize === void 0) { absTargetSize = null; }
        if (relTargetSize === void 0) { relTargetSize = null; }
        if (allowVariables === void 0) { allowVariables = true; }
        attr.ownerElement.setAttribute(attr.name.substr(1), U.computeMeasurableAttributeRightPart(attr.value, attr, logic, measurableHtml, size, absTargetSize, relTargetSize, allowVariables));
        return;
    };
    U.strFirstDiff = function (s1, s2, len) {
        var i;
        if (!s1 && !s2) {
            return [s1, s2];
        }
        if (s1 && !s2) {
            return [s1.substr(0, len), s2];
        }
        if (!s1 && s2) {
            return [s1, s2.substr(0, len)];
        }
        var min = Math.min(s1.length, s2.length);
        for (i = 0; i < min; i++) {
            if (s1[i] !== s2[i]) {
                return [s1.substr(i, len), s2.substr(i, len)];
            }
        }
        return null;
    };
    U.processMeasurableDstyle = function (attr, logic, html, size, absTargetSize) {
        if (size === void 0) { size = null; }
        if (absTargetSize === void 0) { absTargetSize = null; }
        U.processMeasurableVariable(attr, logic, html, size, absTargetSize, null, false);
        var fake = document.createElement('div');
        fake.setAttribute('style', html.getAttribute('dstyle'));
        console.log('preStyle.Real:', html.getAttribute('style'));
        console.log('preStyle.Fake:', fake.getAttribute('style'));
        U.mergeStyles(fake, html);
        html.setAttribute('style', fake.getAttribute('style'));
        console.log('finalStyle:', html.getAttribute('style'));
        // const fake: HTMLElement = document.createElement('div'); fake.setAttribute('style', elem.getAttribute('dstyle'));
        // let key: string; console.log('processDstyle() fake:', fake, 'attr:', attr, 'html:', elem);
        // for (key in fake.style) { console.log('fake[' + key + '] = ' + fake[key]);
        // if (fake[key] !== null && fake[key] !== undefined && fake[key] !== '') { elem.style[key] = fake[key]; } }
    };
    U.mergeStyles = function (html, fake) {
        var i;
        var styles1 = html.getAttribute('style').split(';');
        var styles2 = fake.getAttribute('style').split(';');
        var stylesKv1 = {};
        var stylesKv2 = {};
        var key;
        var val;
        var pos;
        for (i = 0; i < styles1.length; i++) {
            pos = styles1[i].indexOf(':');
            key = styles1[i].substr(0, pos).trim();
            val = styles1[i].substr(pos + 1).trim();
            if (key == '' || val == '')
                continue;
            stylesKv1[key] = val;
        }
        for (i = 0; i < styles2.length; i++) {
            pos = styles2[i].indexOf(':');
            key = styles2[i].substr(0, pos).trim();
            val = styles2[i].substr(pos + 1).trim();
            if (key == '' || val == '')
                continue;
            stylesKv2[key] = val;
        }
        stylesKv1 = U.join(stylesKv1, stylesKv2, true, false);
        var style = '';
        for (key in stylesKv1) {
            style += key + ':' + stylesKv1[key] + '; ';
        }
        html.setAttribute('style', style);
    };
    U.merge = function (a, b, overwriteNull, clone) {
        if (overwriteNull === void 0) { overwriteNull = true; }
        if (clone === void 0) { clone = true; }
        return U.join(a, b, overwriteNull, clone);
    };
    U.join = function (a, b, overwriteNull, clone) {
        if (overwriteNull === void 0) { overwriteNull = true; }
        if (clone === void 0) { clone = true; }
        if (clone) {
            a = U.cloneObj(a);
        }
        var key;
        for (key in b) {
            if (!b.hasOwnProperty(key)) {
                continue;
            }
            if (b[key] !== undefined && a[key] === null && overwriteNull || a[key] === undefined) {
                a[key] = b[key];
            }
        }
        return a;
    };
    U.getChildIndex_old = function (html, allNodes) {
        if (allNodes === void 0) { allNodes = true; }
        if (allNodes) {
            return Array.prototype.indexOf.call(html.parentNode.childNodes, html);
        }
        return Array.prototype.indexOf.call(html.parentNode.children, html);
    };
    U.getChildIndex = function (array, child) {
        return Array.prototype.indexOf.call(array, child);
    };
    U.getIndexesPath_old = function (parent, child) {
        var ret = [];
        while (child && child !== parent) {
            ret.push(U.getChildIndex(parent.childNodes, child));
            child = child.parentElement;
        }
        // ret = ret.splice(ret.length - 2, 1);
        return ret.reverse();
    };
    U.getIndexesPath_NoParentKey = function (child, parent) {
        U.pe(true, 'getindexespath without parent key: todo');
        return null;
        // todo: top-down ricorsivo a tentativi. implementa loop detection. senza childkey (può variare es: parent.a[3].b.c[1] = child)
        //  return string array con nomi di campi e indici di array.
    };
    U.getIndexesPath = function (child, parentKey, childKey /* null = parent is raw array*/, parentLimit) {
        if (childKey === void 0) { childKey = null; }
        if (parentLimit === void 0) { parentLimit = null; }
        var ret = [];
        while (child) {
            var parent_1 = child[parentKey];
            if (child === parentLimit) {
                break;
            }
            if (!parent_1 || parent_1 === child) {
                break;
            }
            var parentArrChilds = childKey ? parent_1[childKey] : parent_1;
            ret.push(U.getChildIndex(parentArrChilds, child));
            child = child[parentKey];
        }
        return ret.reverse();
    };
    U.followIndexesPath = function (root, indexedPath, childKey, outArr, debug) {
        if (childKey === void 0) { childKey = null; }
        if (outArr === void 0) { outArr = { indexFollowed: [],
            debugArr: [{ index: 'Start', elem: root }] }; }
        if (debug === void 0) { debug = false; }
        var j;
        var ret = root;
        var oldret = ret;
        if (outArr)
            outArr.debugArr.push({ index: 'start', elem: root, childKey: childKey });
        U.pe(childKey && childKey !== '' + childKey, 'U.followIndexesPath() childkey must be a string or a null:', childKey, 'root:', root);
        for (j = 0; j < indexedPath.length; j++) {
            var key = indexedPath[j];
            var childArr = childKey ? ret[childKey] : ret;
            U.pif(debug, 'path ' + j + ') = elem.' + childKey + ' = ', childArr);
            if (!childArr) {
                return oldret;
            }
            ret = childArr[key];
            if (key >= childArr.length) {
                key = 'Key out of boundary: ' + key + '/' + childArr.length + '.';
            }
            U.pif(debug, 'path ' + j + ') = elem.' + childKey + '[ ' + key + '] = ', ret);
            if (outArr)
                outArr.debugArr.push({ index: key, elem: ret });
            if (!ret) {
                return oldret;
            }
            if (outArr)
                outArr.indexFollowed.push(key);
            oldret = ret;
        }
        return ret;
    };
    U.followIndexesPathOld = function (templateRoot, indexedPath, allNodes, outArr, debug) {
        if (allNodes === void 0) { allNodes = true; }
        if (outArr === void 0) { outArr = { indexFollowed: [] }; }
        if (debug === void 0) { debug = false; }
        var j;
        var ret = templateRoot;
        var oldret = ret;
        var debugarr = [{ index: 'Start', html: ret }];
        for (j = 0; j < indexedPath.length; j++) {
            var index = indexedPath[j];
            ret = (allNodes ? ret.childNodes[index] : ret.children[index]);
            if (!ret) {
                console.log('folllowPath: clicked on some dinamically generated content, returning the closest static parent.', debugarr);
                U.pw(debug, 'clicked on some dinamically generated content, returning the closest static parent.', debugarr);
                return oldret;
            }
            oldret = ret;
            outArr.indexFollowed.push(index);
            debugarr.push({ index: index, html: ret });
        }
        U.pif(debug, 'followpath debug arr:', debugarr);
        return ret;
    };
    U.removeDuplicates = function (arr0, clone) {
        if (clone === void 0) { clone = false; }
        if (!arr0)
            return [];
        var arr = clone ? U.cloneObj(arr0) : arr0;
        var found = [];
        var i;
        for (i = 0; i < arr.length; i++) {
            if (arr[i] in found) {
                U.arrayRemoveAll(arr, arr[i]);
                i--;
                continue;
            }
            found.push(arr[i]);
        }
        return arr;
    };
    U.findTemplateList = function (str) {
        return undefined;
    };
    U.makeSet = function (notice_willStripSpaces) {
        var useless = document.createElement('');
        // NB: classList behave like a set but will strip spaces
        return useless.classList;
    };
    U.getStartSeparatorKey = function () { return ++U.startSeparatorKeyMax + ''; };
    U.startSeparator = function (key, separator) {
        if (separator === void 0) { separator = ', '; }
        if (key in U.startSeparatorKeys)
            return separator;
        U.startSeparatorKeys[key] = true;
        return '';
    };
    U.arrayContains = function (arr, searchElem) {
        if (!arr)
            return false;
        // return arr && arr.indexOf(searchElem) === -1; not working properly on strings. maybe they are evaluated by references and not by values.
        var i;
        for (i = 0; i < arr.length; i++) {
            if (arr[i] === searchElem)
                return true;
        }
        return false;
    };
    U.toBoolString = function (bool) { return bool ? "true" : "false"; };
    U.fromBoolString = function (str) { return str === "true" || str === 't' || +str === 1; };
    U.parseSvgPath = function (str) {
        var i;
        var letter = null;
        var num1 = null;
        var num2 = null; // useless initializing phase to avoid IDE warnings
        var foundFloat = null;
        var pt = null;
        var current = null;
        var assoc = [];
        var pts = [];
        var ret = { assoc: assoc, pts: pts };
        var debug = false;
        str = str.toUpperCase();
        var startNextEntry = function () {
            num1 = '';
            num2 = '';
            pt = new Point(0, 0);
            pt.x = null;
            pt.y = null;
            foundFloat = false;
        };
        var endCurrentEntry = function () {
            pt.y = +num2;
            U.pe(isNaN(pt.y), 'parsed non-number as value of: |' + letter + '| in svg.path attribute: |' + str + '|', ret);
            current = { letter: letter, pt: pt };
            U.pe(pt.x === null || pt.y === null, num1, num2, pt, i, str);
            pts.push(pt);
            assoc.push(current);
            U.pif(debug, 'endEntry:', current, ' position: |' + str.substr(0, i) + '|' + str.substr(i) + "|");
            startNextEntry();
        };
        startNextEntry();
        for (i = 0; i < str.length; i++) {
            var c = str[i];
            switch (c) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '.':
                case '-':
                case '+':
                    if (c === '.') {
                        U.pe(foundFloat, ' found 2 floating points in a single parsed number in svg.path attribute: |' + str + '|');
                        foundFloat = true;
                    }
                    U.pe((c === '+' || c === '-') && (pt.x === null && num1 !== '' || pt.y === null && num2 !== ''), 'found a ' + c + ' sign inside a number:', ret, i, str);
                    if (pt.x === null) {
                        num1 += c;
                        break;
                    }
                    if (pt.y === null) {
                        num2 += c;
                        break;
                    }
                    U.pe(true, 'found 3 numbers while parsing svg.path attribute: |' + str + '|', ret);
                    break;
                case ' ':
                    if (pt.x === null) {
                        pt.x = +num1;
                        foundFloat = false;
                        U.pe(isNaN(+pt.x), 'parsed non-number as value of: |' + letter + '| in svg.path attribute: |' + str + '|', ret);
                        break;
                    }
                    if (pt.y === null) {
                        pt.y = +num2;
                        U.pe(isNaN(+pt.y), 'parsed non-number as value of: |' + letter + '| in svg.path attribute: |' + str + '|', ret);
                        break;
                    }
                    break;
                default:
                    if (letter) {
                        endCurrentEntry();
                    }
                    letter = c;
                    break;
            }
        }
        endCurrentEntry();
        return ret;
    };
    /*
      static unescapeHtmlEntities(s: string): string { return HE.decode(s); }
      static escapeHtmlEntities(s: string): string { return HE.encode(s); }*/
    U.shallowArrayCopy = function (arr) {
        var ret = [];
        var i;
        if (!arr)
            return null;
        for (i = 0; i < arr.length; i++) {
            ret.push(arr[i]);
        }
        return ret;
    };
    U.arrayInsertAt = function (arr, index, item) {
        U.pe(!arr || !Array.isArray(arr), 'ArrayInsertAt() must have a parameter array');
        index = Math.max(0, index);
        index = Math.min(arr.length, index);
        arr.splice(index, 0, item);
    };
    U.loopcounter = 0;
    U.prefix = 'ULibrary_';
    U.sizeofvar = null;
    U.$sizeofvar = null;
    U.clipboardinput = null;
    U.PermuteArr = [];
    U.PermuteUsedChars = [];
    U.resizingBorder = null;
    U.resizingContainer = null;
    // static he = null;
    U.production = false;
    U.addCssAvoidDuplicates = {};
    U.varTextToSvg = null;
    U.dblclickchecker = new Date().getTime(); // todo: move @ start
    U.dblclicktimerms = 300; // todo: move @ start
    U.$alertcontainer = null;
    U.alertcontainer = null;
    U.startSeparatorKeys = {};
    U.startSeparatorKeyMax = -1;
    return U;
}());
export { U };
export var AttribETypes;
(function (AttribETypes) {
    //  FakeElementAddFeature = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//FakeElement',
    // era il 'pulsante per aggiungere feature nel mm.',
    // reference = 'reference??',
    AttribETypes["void"] = "???void";
    AttribETypes["EChar"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EChar";
    AttribETypes["EString"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EString";
    AttribETypes["EDate"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDate";
    AttribETypes["EFloat"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EFloat";
    AttribETypes["EDouble"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDouble";
    AttribETypes["EBoolean"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EBoolean";
    AttribETypes["EByte"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EByte";
    AttribETypes["EShort"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EShort";
    AttribETypes["EInt"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EInt";
    AttribETypes["ELong"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//ELong";
    /*
    ECharObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//ECharObject',
    EStringObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EStringObject',
    EDateObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDateObject',
    EFloatObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EFloatObject',
    EDoubleObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDoubleObject',
    EBooleanObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EBooleanObj',
    EByteObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EByteObject',
    EShortObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EShortObject',
    EIntObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EIntegerObject',
    ELongObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//ELongObject', */
    // EELIST = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EEList', // List<E> = List<?>
})(AttribETypes || (AttribETypes = {}));
// export type Json = object;
var Json = /** @class */ (function () {
    function Json(j) {
    }
    Json.getAnnotations = function (thiss) {
        var ret = thiss[ECorePackage.eAnnotations];
        if (!ret || $.isEmptyObject(ret)) {
            return [];
        }
        if (Array.isArray(ret)) {
            return ret;
        }
        else {
            return [ret];
        }
    };
    Json.getDetails = function (thiss) {
        var ret = thiss[ECoreAnnotation.details];
        if (!ret || $.isEmptyObject(ret)) {
            return [];
        }
        if (Array.isArray(ret)) {
            return ret;
        }
        else {
            return [ret];
        }
    };
    Json.getChildrens = function (thiss, throwError, functions) {
        if (throwError === void 0) { throwError = false; }
        if (functions === void 0) { functions = false; }
        if (!thiss && !throwError) {
            return [];
        }
        var mod = thiss[ECoreRoot.ecoreEPackage];
        var pkg = thiss[ECorePackage.eClassifiers];
        var cla = thiss[functions ? ECoreClass.eOperations : ECoreClass.eStructuralFeatures];
        var fun = thiss[ECoreOperation.eParameters];
        var lit = thiss[ECoreEnum.eLiterals];
        var ret = mod || pkg || cla || fun || lit;
        /*if ( ret === undefined || ret === null ) {
          if (thiss['@name'] !== undefined) { ret = thiss; } // if it's the root with only 1 child arrayless
        }*/
        // U.pe(true, debug, 'getchildrens(', thiss, ')');
        U.pe(throwError && !ret, 'getChildrens() Failed: ', thiss, ret);
        // console.log('ret = ', ret, ' === ', {}, ' ? ', ($.isEmptyObject(ret) ? [] : [ret]));
        if (!ret || $.isEmptyObject(ret)) {
            return [];
        }
        if (Array.isArray(ret)) {
            return ret;
        }
        else {
            return [ret];
        }
    };
    Json.read = function (json, field, valueIfNotFound) {
        if (valueIfNotFound === void 0) { valueIfNotFound = 'read<T>CanThrowError'; }
        var ret = json ? json[field] : null;
        if (ret !== null && field.indexOf(Status.status.XMLinlineMarker) !== -1) {
            U.pe(U.isObject(ret, false, false, true), 'inline value |' + field + '| must be primitive.', ret);
            ret = U.multiReplaceAll('' + ret, ['&amp;', '&#38;', '&quot;'], ['&', '\'', '"']);
        }
        if ((ret === null || ret === undefined)) {
            U.pe(valueIfNotFound === 'read<T>CanThrowError', 'Json.read<', '> failed: field[' + field + '], json: ', json);
            return valueIfNotFound;
        }
        return ret;
    };
    Json.write = function (json, field, val) {
        if (val !== null && field.indexOf(Status.status.XMLinlineMarker) !== -1) {
            U.pe(val !== '' + val, 'inline value |' + field + '| must be a string.', val);
            val = U.multiReplaceAll(val, ['&', '\'', '"'], ['&amp;', '&#38;', '&quot;']);
        }
        else
            U.pe(val !== '' + val || !U.isObject(val, true), 'primitive values should be inserted only inline in the xml:', field, val);
        json[field] = val;
        return val;
    };
    return Json;
}());
export { Json };
var DetectZoom = /** @class */ (function () {
    function DetectZoom() {
    }
    DetectZoom.device = function () { return detectzoooom.device(); };
    DetectZoom.zoom = function () { U.pe(true, 'better not use this, looks like always === 1'); return detectzoooom.zoom(); };
    DetectZoom.prototype.test = function () {
        var a;
        return a = null;
    };
    return DetectZoom;
}());
export { DetectZoom };
var ISize = /** @class */ (function () {
    function ISize(x, y, w, h) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (w === void 0) { w = 0; }
        if (h === void 0) { h = 0; }
        if (isNaN(+x)) {
            x = 0;
        }
        if (isNaN(+y)) {
            y = 0;
        }
        if (isNaN(+w)) {
            w = 0;
        }
        if (isNaN(+h)) {
            h = 0;
        }
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    ISize.prototype.tl = function () { return this.makePoint(this.x, this.y); };
    ISize.prototype.tr = function () { return this.makePoint(this.x + this.w, this.y); };
    ISize.prototype.bl = function () { return this.makePoint(this.x, this.y + this.h); };
    ISize.prototype.br = function () { return this.makePoint(this.x + this.w, this.y + this.h); };
    ISize.prototype.equals = function (size) { return this.x === size.x && this.y === size.y && this.w === size.w && this.h === size.h; };
    /// field-wise Math.min()
    ISize.prototype.min = function (minSize, clone) {
        var ret = clone ? this.duplicate() : this;
        if (!isNaN(minSize.x) && ret.x < minSize.x) {
            ret.x = minSize.x;
        }
        if (!isNaN(minSize.y) && ret.y < minSize.y) {
            ret.y = minSize.y;
        }
        if (!isNaN(minSize.w) && ret.w < minSize.w) {
            ret.w = minSize.w;
        }
        if (!isNaN(minSize.h) && ret.h < minSize.h) {
            ret.h = minSize.h;
        }
        return ret;
    };
    ISize.prototype.max = function (maxSize, clone) {
        var ret = clone ? this.duplicate() : this;
        if (!isNaN(maxSize.x) && ret.x > maxSize.x) {
            ret.x = maxSize.x;
        }
        if (!isNaN(maxSize.y) && ret.y > maxSize.y) {
            ret.y = maxSize.y;
        }
        if (!isNaN(maxSize.w) && ret.w > maxSize.w) {
            ret.w = maxSize.w;
        }
        if (!isNaN(maxSize.h) && ret.h > maxSize.h) {
            ret.h = maxSize.h;
        }
        return ret;
    };
    return ISize;
}());
export { ISize };
var Size = /** @class */ (function (_super) {
    tslib_1.__extends(Size, _super);
    function Size() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Size.fromPoints = function (firstPt, secondPt) {
        var minX = Math.min(firstPt.x, secondPt.x);
        var maxX = Math.max(firstPt.x, secondPt.x);
        var minY = Math.min(firstPt.y, secondPt.y);
        var maxY = Math.max(firstPt.y, secondPt.y);
        return new Size(minX, minY, maxX - minX, maxY - minY);
    };
    Size.prototype.clone = function (json) { return new Size(json.x, json.y, json.w, json.h); };
    Size.prototype.duplicate = function () { return new Size().clone(this); };
    Size.prototype.makePoint = function (x, y) { return new Point(x, y); };
    Size.prototype.tl = function () { return _super.prototype.tl.call(this); };
    Size.prototype.tr = function () { return _super.prototype.tr.call(this); };
    Size.prototype.bl = function () { return _super.prototype.bl.call(this); };
    Size.prototype.br = function () { return _super.prototype.br.call(this); };
    Size.prototype.equals = function (size) { return _super.prototype.equals.call(this, size); };
    Size.prototype.min = function (minSize, clone) { return _super.prototype.min.call(this, minSize, clone); };
    Size.prototype.max = function (minSize, clone) { return _super.prototype.max.call(this, minSize, clone); };
    return Size;
}(ISize));
export { Size };
var GraphSize = /** @class */ (function (_super) {
    tslib_1.__extends(GraphSize, _super);
    function GraphSize() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GraphSize.fromPoints = function (firstPt, secondPt) {
        var minX = Math.min(firstPt.x, secondPt.x);
        var maxX = Math.max(firstPt.x, secondPt.x);
        var minY = Math.min(firstPt.y, secondPt.y);
        var maxY = Math.max(firstPt.y, secondPt.y);
        return new GraphSize(minX, minY, maxX - minX, maxY - minY);
    };
    GraphSize.closestIntersection = function (vertexGSize, prevPt, pt0, gridAlign) {
        if (gridAlign === void 0) { gridAlign = null; }
        var pt = pt0.clone();
        var m = GraphPoint.getM(prevPt, pt);
        var q = GraphPoint.getQ(prevPt, pt);
        U.pe(Math.abs((pt.y - m * pt.x) - (prevPt.y - m * prevPt.x)) > .001, 'wrong math in Q:', (pt.y - m * pt.x), ' vs ', (prevPt.y - m * prevPt.x));
        /*const isL = prevPt.x < pt.x;
        const isT = prevPt.y < pt.y;
        const isR = !isL;
        const isB = !isT; */
        if (m === Number.POSITIVE_INFINITY && q === Number.NEGATIVE_INFINITY) { // bottom middle
            return new GraphPoint(vertexGSize.x + vertexGSize.w / 2, vertexGSize.y + vertexGSize.h);
        }
        // console.log('pt:', pt, 'm:', m, 'q:', q);
        var L = new GraphPoint(0, 0);
        var T = new GraphPoint(0, 0);
        var R = new GraphPoint(0, 0);
        var B = new GraphPoint(0, 0);
        L.x = vertexGSize.x;
        L.y = m * L.x + q;
        R.x = vertexGSize.x + vertexGSize.w;
        R.y = m * R.x + q;
        T.y = vertexGSize.y;
        T.x = (T.y - q) / m;
        B.y = vertexGSize.y + vertexGSize.h;
        B.x = (B.y - q) / m;
        // prendo solo il compreso pt ~ prevPt (escludo così il "pierce" sulla faccia opposta), prendo il più vicino al centro.
        // console.log('4 possibili punti di intersezione (LTBR):', L, T, B, R);
        /* this.owner.mark(this.owner.toHtmlCoord(T), true, 'blue');
        this.owner.mark(this.owner.toHtmlCoord(B), false, 'violet');
        this.owner.mark(this.owner.toHtmlCoord(L), false, 'red');
        this.owner.mark(this.owner.toHtmlCoord(R), false, 'orange');*/
        if ((B.x >= pt.x && B.x <= prevPt.x) || (B.x >= prevPt.x && B.x <= pt.x)) { }
        else {
            B = null;
        }
        if ((T.x >= pt.x && T.x <= prevPt.x) || (T.x >= prevPt.x && T.x <= pt.x)) { }
        else {
            T = null;
        }
        if ((L.y >= pt.y && L.y <= prevPt.y) || (L.y >= prevPt.y && L.y <= pt.y)) { }
        else {
            L = null;
        }
        if ((R.y >= pt.y && R.y <= prevPt.y) || (R.y >= prevPt.y && R.y <= pt.y)) { }
        else {
            R = null;
        }
        // console.log('superstiti step1: (LTBR):', L, T, B, R);
        var vicinanzaT = !T ? Number.POSITIVE_INFINITY : ((T.x - pt.x) * (T.x - pt.x)) + ((T.y - pt.y) * (T.y - pt.y));
        var vicinanzaB = !B ? Number.POSITIVE_INFINITY : ((B.x - pt.x) * (B.x - pt.x)) + ((B.y - pt.y) * (B.y - pt.y));
        var vicinanzaL = !L ? Number.POSITIVE_INFINITY : ((L.x - pt.x) * (L.x - pt.x)) + ((L.y - pt.y) * (L.y - pt.y));
        var vicinanzaR = !R ? Number.POSITIVE_INFINITY : ((R.x - pt.x) * (R.x - pt.x)) + ((R.y - pt.y) * (R.y - pt.y));
        var closest = Math.min(vicinanzaT, vicinanzaB, vicinanzaL, vicinanzaR);
        // console.log( 'closest:', closest);
        // succede quando pt e prevPt sono entrambi all'interno del rettangolo del vertice.
        // L'edge non è visibile e il valore ritornato è irrilevante.
        if (closest === Number.POSITIVE_INFINITY) {
            /* top center */
            pt = vertexGSize.tl();
            pt.x += vertexGSize.w / 2;
        }
        else if (closest === Number.POSITIVE_INFINITY) {
            /* bottom center */
            pt = vertexGSize.br();
            pt.x -= vertexGSize.w / 2;
        }
        else if (closest === vicinanzaT) {
            pt = T;
        }
        else if (closest === vicinanzaB) {
            pt = B;
        }
        else if (closest === vicinanzaR) {
            pt = R;
        }
        else if (closest === vicinanzaL) {
            pt = L;
        }
        if (!gridAlign) {
            return pt;
        }
        if ((pt === T || pt === B || isNaN(closest)) && gridAlign.x) {
            var floorX = Math.floor(pt.x / gridAlign.x) * gridAlign.x;
            var ceilX = Math.ceil(pt.x / gridAlign.x) * gridAlign.x;
            var closestX = void 0;
            var farthestX = void 0;
            if (Math.abs(floorX - pt.x) < Math.abs(ceilX - pt.x)) {
                closestX = floorX;
                farthestX = ceilX;
            }
            else {
                closestX = ceilX;
                farthestX = floorX;
            }
            // todo: possibile causa del bug che non allinea punti fake a punti reali. nel calcolo realPT questo non viene fatto.
            // if closest grid intersection is inside the vertex.
            if (closestX >= vertexGSize.x && closestX <= vertexGSize.x + vertexGSize.w) {
                pt.x = closestX;
            }
            else 
            // if 2° closer grid intersection is inside the vertex.
            if (closestX >= vertexGSize.x && closestX <= vertexGSize.x + vertexGSize.w) {
                pt.x = farthestX;
                // if no intersection are inside the vertex (ignore grid)
            }
            else {
                pt = pt;
            }
        }
        else if ((pt === L || pt === R) && gridAlign.y) {
            var floorY = Math.floor(pt.y / gridAlign.y) * gridAlign.y;
            var ceilY = Math.ceil(pt.y / gridAlign.y) * gridAlign.y;
            var closestY = void 0;
            var farthestY = void 0;
            if (Math.abs(floorY - pt.y) < Math.abs(ceilY - pt.y)) {
                closestY = floorY;
                farthestY = ceilY;
            }
            else {
                closestY = ceilY;
                farthestY = floorY;
            }
            // if closest grid intersection is inside the vertex.
            if (closestY >= vertexGSize.y && closestY <= vertexGSize.y + vertexGSize.h) {
                pt.y = closestY;
            }
            else 
            // if 2° closer grid intersection is inside the vertex.
            if (closestY >= vertexGSize.y && closestY <= vertexGSize.y + vertexGSize.h) {
                pt.y = farthestY;
                // if no intersection are inside the vertex (ignore grid)
            }
            else {
                pt = pt;
            }
        }
        return pt;
    };
    GraphSize.prototype.clone = function (json) { return new GraphSize(json.x, json.y, json.w, json.h); };
    GraphSize.prototype.duplicate = function () { return new GraphSize().clone(this); };
    GraphSize.prototype.makePoint = function (x, y) { return new GraphPoint(x, y); };
    GraphSize.prototype.tl = function () { return _super.prototype.tl.call(this); };
    GraphSize.prototype.tr = function () { return _super.prototype.tr.call(this); };
    GraphSize.prototype.bl = function () { return _super.prototype.bl.call(this); };
    GraphSize.prototype.br = function () { return _super.prototype.br.call(this); };
    GraphSize.prototype.equals = function (size) { return _super.prototype.equals.call(this, size); };
    GraphSize.prototype.min = function (minSize, clone) { return _super.prototype.min.call(this, minSize, clone); };
    GraphSize.prototype.max = function (minSize, clone) { return _super.prototype.max.call(this, minSize, clone); };
    return GraphSize;
}(ISize));
export { GraphSize };
var IPoint = /** @class */ (function () {
    function IPoint(x, y) {
        if (isNaN(+x)) {
            x = 0;
        }
        if (isNaN(+y)) {
            y = 0;
        }
        this.x = +x;
        this.y = +y;
    }
    IPoint.getM = function (firstPt, secondPt) { return (firstPt.y - secondPt.y) / (firstPt.x - secondPt.x); };
    IPoint.getQ = function (firstPt, secondPt) { return firstPt.y - IPoint.getM(firstPt, secondPt) * firstPt.x; };
    IPoint.prototype.toString = function () { return '(' + this.x + ', ' + this.y + ')'; };
    IPoint.prototype.subtract = function (p2, newInstance) {
        U.pe(!p2, 'subtract argument must be a valid point: ', p2);
        var p1;
        if (!newInstance) {
            p1 = this;
        }
        else {
            p1 = this.clone();
        }
        p1.x -= p2.x;
        p1.y -= p2.y;
        return p1;
    };
    IPoint.prototype.add = function (p2, newInstance) {
        U.pe(!p2, 'add argument must be a valid point: ', p2);
        var p1;
        if (!newInstance) {
            p1 = this;
        }
        else {
            p1 = this.clone();
        }
        p1.x += p2.x;
        p1.y += p2.y;
        return p1;
    };
    IPoint.prototype.addAll = function (p, newInstance) {
        var i;
        var p0;
        if (!newInstance) {
            p0 = this;
        }
        else {
            p0 = this.clone();
        }
        for (i = 0; i < p.length; i++) {
            p0.add(p[i], true);
        }
        return p0;
    };
    IPoint.prototype.subtractAll = function (p, newInstance) {
        var i;
        var p0;
        if (!newInstance) {
            p0 = this;
        }
        else {
            p0 = this.clone();
        }
        for (i = 0; i < p.length; i++) {
            p0.subtract(p[i], true);
        }
        return p0;
    };
    IPoint.prototype.multiply = function (scalar, newInstance) {
        U.pe(isNaN(+scalar), 'scalar argument must be a valid number: ', scalar);
        var p1;
        if (!newInstance) {
            p1 = this;
        }
        else {
            p1 = this.clone();
        }
        p1.x *= scalar;
        p1.y *= scalar;
        return p1;
    };
    IPoint.prototype.divide = function (scalar, newInstance) {
        U.pe(isNaN(+scalar), 'scalar argument must be a valid number: ', scalar);
        var p1;
        if (!newInstance) {
            p1 = this;
        }
        else {
            p1 = this.clone();
        }
        p1.x /= scalar;
        p1.y /= scalar;
        return p1;
    };
    IPoint.prototype.isInTheMiddleOf = function (firstPt, secondPt, tolleranza) {
        var rectangle = Size.fromPoints(firstPt, secondPt);
        var tolleranzaX = tolleranza; // actually should be cos * arctan(m);
        var tolleranzaY = tolleranza; // actually should be sin * arctan(m);
        if (this.x < rectangle.x - tolleranzaX || this.x > rectangle.x + rectangle.w + tolleranzaX) {
            return false;
        }
        if (this.y < rectangle.y - tolleranzaX || this.y > rectangle.y + rectangle.h + tolleranzaY) {
            return false;
        }
        var m = IPoint.getM(firstPt, secondPt);
        var q = IPoint.getQ(firstPt, secondPt);
        var lineDistance = this.distanceFromLine(firstPt, secondPt);
        // console.log('distance:', lineDistance, ', this:', this, ', p1:', firstPt, ', p2:', secondPt);
        return lineDistance <= tolleranza;
    };
    IPoint.prototype.distanceFromLine = function (p1, p2) {
        var top = +(p2.y - p1.y) * this.x
            - (p2.x - p1.x) * this.y
            + p2.x * p1.y
            - p1.x * p2.y;
        var bot = (p2.y - p1.y) * (p2.y - p1.y) +
            (p2.x - p1.x) * (p2.x - p1.x);
        return Math.abs(top) / Math.sqrt(bot);
    };
    IPoint.prototype.equals = function (pt, tolleranzaX, tolleranzaY) {
        if (tolleranzaX === void 0) { tolleranzaX = 0; }
        if (tolleranzaY === void 0) { tolleranzaY = 0; }
        if (pt === null) {
            return false;
        }
        return Math.abs(this.x - pt.x) <= tolleranzaX && Math.abs(this.y - pt.y) <= tolleranzaY;
    };
    IPoint.prototype.moveOnNearestBorder = function (startVertexSize, clone, debug) {
        if (debug === void 0) { debug = true; }
        var pt = clone ? this.clone() : this;
        var tl = startVertexSize.tl();
        var tr = startVertexSize.tr();
        var bl = startVertexSize.bl();
        var br = startVertexSize.br();
        var L = pt.distanceFromLine(tl, bl);
        var R = pt.distanceFromLine(tr, br);
        var T = pt.distanceFromLine(tl, tr);
        var B = pt.distanceFromLine(bl, br);
        var min = Math.min(L, R, T, B);
        if (min === L) {
            pt.x = tl.x;
        }
        if (min === R) {
            pt.x = tr.x;
        }
        if (min === T) {
            pt.y = tr.y;
        }
        if (min === B) {
            pt.y = br.y;
        }
        if (debug && pt instanceof GraphPoint) {
            Status.status.getActiveModel().graph.markg(pt, false, 'purple');
        }
        return pt;
    };
    IPoint.prototype.getM = function (pt2) { return IPoint.getM(this, pt2); };
    IPoint.prototype.degreeWith = function (pt2, toRadians) {
        var directionVector = this.subtract(pt2, true);
        var ret = Math.atan2(directionVector.y, directionVector.x);
        return toRadians ? ret : U.RadToDegree(ret);
    };
    return IPoint;
}());
export { IPoint };
var GraphPoint = /** @class */ (function (_super) {
    tslib_1.__extends(GraphPoint, _super);
    function GraphPoint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GraphPoint.fromEvent = function (e) {
        if (!e) {
            return null;
        }
        var p = new Point(e.pageX, e.pageY);
        var g = Status.status.getActiveModel().graph;
        return g.toGraphCoord(p);
    };
    GraphPoint.prototype.clone = function () { return new GraphPoint(this.x, this.y); };
    GraphPoint.prototype.subtract = function (p2, newInstance) { return _super.prototype.subtract.call(this, p2, newInstance); };
    GraphPoint.prototype.add = function (p2, newInstance) { return _super.prototype.add.call(this, p2, newInstance); };
    GraphPoint.prototype.multiply = function (scalar, newInstance) { return _super.prototype.multiply.call(this, scalar, newInstance); };
    GraphPoint.prototype.divide = function (scalar, newInstance) { return _super.prototype.divide.call(this, scalar, newInstance); };
    GraphPoint.prototype.isInTheMiddleOf = function (firstPt, secondPt, tolleranza) { return _super.prototype.isInTheMiddleOf.call(this, firstPt, secondPt, tolleranza); };
    GraphPoint.prototype.distanceFromLine = function (p1, p2) { return _super.prototype.distanceFromLine.call(this, p1, p2); };
    GraphPoint.prototype.equals = function (pt, tolleranzaX, tolleranzaY) {
        if (tolleranzaX === void 0) { tolleranzaX = 0; }
        if (tolleranzaY === void 0) { tolleranzaY = 0; }
        return _super.prototype.equals.call(this, pt, tolleranzaX, tolleranzaY);
    };
    GraphPoint.prototype.moveOnNearestBorder = function (startVertexSize, clone, debug) {
        if (debug === void 0) { debug = true; }
        return _super.prototype.moveOnNearestBorder.call(this, startVertexSize, clone, debug);
    };
    GraphPoint.prototype.getM = function (pt2) { return _super.prototype.getM.call(this, pt2); };
    GraphPoint.prototype.degreeWith = function (pt2, toRadians) { return _super.prototype.degreeWith.call(this, pt2, toRadians); };
    return GraphPoint;
}(IPoint));
export { GraphPoint };
var Point = /** @class */ (function (_super) {
    tslib_1.__extends(Point, _super);
    function Point() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Point.fromEvent = function (e) {
        if (!e) {
            return null;
        }
        var p = new Point(e.pageX, e.pageY);
        return p;
    };
    Point.prototype.clone = function () { return new Point(this.x, this.y); };
    Point.prototype.subtract = function (p2, newInstance) { return _super.prototype.subtract.call(this, p2, newInstance); };
    Point.prototype.add = function (p2, newInstance) { return _super.prototype.add.call(this, p2, newInstance); };
    Point.prototype.multiply = function (scalar, newInstance) { return _super.prototype.multiply.call(this, scalar, newInstance); };
    Point.prototype.divide = function (scalar, newInstance) { return _super.prototype.divide.call(this, scalar, newInstance); };
    Point.prototype.isInTheMiddleOf = function (firstPt, secondPt, tolleranza) { return _super.prototype.isInTheMiddleOf.call(this, firstPt, secondPt, tolleranza); };
    Point.prototype.distanceFromLine = function (p1, p2) { return _super.prototype.distanceFromLine.call(this, p1, p2); };
    Point.prototype.equals = function (pt, tolleranzaX, tolleranzaY) {
        if (tolleranzaX === void 0) { tolleranzaX = 0; }
        if (tolleranzaY === void 0) { tolleranzaY = 0; }
        return _super.prototype.equals.call(this, pt, tolleranzaX, tolleranzaY);
    };
    Point.prototype.moveOnNearestBorder = function (startVertexSize, clone, debug) {
        if (debug === void 0) { debug = true; }
        return _super.prototype.moveOnNearestBorder.call(this, startVertexSize, clone, debug);
    };
    Point.prototype.getM = function (pt2) { return _super.prototype.getM.call(this, pt2); };
    Point.prototype.degreeWith = function (pt2, toRadians) { return _super.prototype.degreeWith.call(this, pt2, toRadians); };
    return Point;
}(IPoint));
export { Point };
var FileReadTypeEnum = /** @class */ (function () {
    function FileReadTypeEnum() {
    }
    FileReadTypeEnum.image = "image/*";
    FileReadTypeEnum.audio = "audio/*";
    FileReadTypeEnum.video = "video/*";
    /// a too much huge list https://www.iana.org/assignments/media-types/media-types.xhtml
    FileReadTypeEnum.AndManyOthersButThereAreTooMuch = "And many others... https://www.iana.org/assignments/media-types/media-types.xhtml";
    FileReadTypeEnum.OrJustPutFileExtension = "OrJustPutFileExtension";
    return FileReadTypeEnum;
}());
export { FileReadTypeEnum };
//# sourceMappingURL=util.js.map