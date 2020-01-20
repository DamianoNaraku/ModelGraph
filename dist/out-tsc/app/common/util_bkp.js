import * as tslib_1 from "tslib";
import { ModelPiece, XMIModel, Point, GraphSize, ECoreClass, ECorePackage, ECoreRoot, ECoreOperation, MAttribute } from './Joiner';
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
            this.html = null;
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
        console.log('pe[0/' + (restArgs.length + 1) + ']: ', s);
        for (var i = 0; i < restArgs.length; i++) {
            s = restArgs[i];
            str += 'pe[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ' + s + '\t\t\r\n';
            console.log('pe[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ', s);
        }
        if (!U.production) {
            alert(str);
        }
        s = b['@makeMeCrash']['@makeMeCrash'];
        return str;
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
        console.log('pw[0/' + (restArgs.length + 1) + ']: ', s);
        for (var i = 0; i < restArgs.length; i++) {
            s = restArgs[i];
            str += 'pw[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ' + s + '\t\t\r\n';
            console.log('pw[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ', s);
        }
        if (!U.production) {
            alert(str);
        }
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
        console.log('p:', s);
        for (var i = 0; i < restArgs.length; i++) {
            s = restArgs[i];
            str += 'p[' + (i + 1) + '/' + restArgs.length + ']: ' + s + '\t\t\r\n';
            console.log('p[' + (i + 1) + '/' + restArgs.length + ']: ', s);
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
        console.log('p:', s);
        for (var i = 0; i < restArgs.length; i++) {
            s = restArgs[i];
            str += 'p[' + (i + 1) + '/' + restArgs.length + ']: ' + s + '\t\t\r\n';
            console.log('p[' + (i + 1) + '/' + restArgs.length + ']: ', s);
        }
        // alert(str);
        return str;
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
        var tmpID = clone.id + (clone.id.indexOf('_Clone') === -1) ? '_Clone' : '';
        while (document.getElementById(tmpID + (++lastnum))) { }
        clone.id = tmpID + lastnum;
        return clone;
    };
    U.cloneObj = function (o) {
        // const r: HTMLElement = document.createElement(o.tagName);
        // r.innerHTML = o.innerHTML;
        // U.pe( o as HTMLElement !== null, 'non utilizzabile su html');
        return JSON.parse(JSON.stringify(o));
        // todo: questa funzione non pu� clonare html.
        // todo: allow cloneObj of circular objects.
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
        console.log('measureHtml0:', measureHtml, 'evt:', e);
        if (!measureHtml) {
            measureHtml = e.currentTarget;
        }
        console.log('measureHtml1:', measureHtml);
        if (!measureHtml || measureHtml === document) {
            measureHtml = e.target;
            console.log('measureHtml2:', measureHtml);
            while (!measureHtml.classList.contains('measurable')) {
                measureHtml = measureHtml.parentElement;
                console.log('measureHtml3:', measureHtml);
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
            var result = '' + U.replaceSingleVar(obj, varname, isBase64, false);
            var i = -1;
            if (!asHtml) {
                while (++i < escapeC.length) {
                    result = U.replaceAll(result, escapeC[i], replacer[i]);
                }
            }
            U.pif(debug, 'replaceSingleVar: ' + debugtext + ' --> ' + result + ' --> ' + prefixError + result, obj);
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
            ret.parent = U.replaceSingleVarRaw(obj, targetPatternParent);
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
        if (replacement === void 0) { replacement = '�'; }
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
                U.changeVarTemplateDelimitersInMeasurablesAttr($measurables[i].attributes[j], toReplace, replacement);
            }
        }
        return html.innerHTML;
    };
    U.changeBackVarTemplateDelimitersInMeasurablesAttr = function (attrVal, toReplace, replacement) {
        if (toReplace === void 0) { toReplace = '�'; }
        if (replacement === void 0) { replacement = '$'; }
        return U.changeVarTemplateDelimitersInMeasurablesAttrStr(attrVal, toReplace, replacement);
    };
    U.changeVarTemplateDelimitersInMeasurablesAttr = function (attr, toReplace, replacement) {
        if (toReplace === void 0) { toReplace = '$'; }
        if (replacement === void 0) { replacement = '�'; }
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
        // var visible = $element.is(":visible"); crea bug quando un elemento � teoricamente visibile ma orfano
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
        return container.firstChild;
    };
    U.toHtml_RootlessArray = function (html) {
        var o = document.createElement('div');
        o.innerHTML = html;
        return o.childNodes;
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
    U.setSvgSize = function (style, size) {
        if (size === void 0) { size = null; }
        size = size.clone();
        var defaults = new GraphSize(0, 0, 200, 101);
        if (isNaN(+size.x)) {
            U.pw(true, 'Svg x attribute is NaN: ' + style.getAttribute('x') + ' will be set to default: ' + defaults.x);
            size.x = defaults.x;
        }
        if (isNaN(+size.y)) {
            U.pw(true, 'Svg y attribute is NaN: ' + style.getAttribute('y') + ' will be set to default: ' + defaults.y);
            size.y = defaults.y;
        }
        if (isNaN(+size.w)) {
            U.pw(true, 'Svg w attribute is NaN: ' + style.getAttribute('width') + ' will be set to default: ' + defaults.w);
            size.w = defaults.w;
        }
        if (isNaN(+size.h)) {
            U.pw(true, 'Svg h attribute is NaN: ' + style.getAttribute('height') + ' will be set to default: ' + defaults.h);
            size.h = defaults.h;
        }
        // U.pe(true, '100!, ', size, style);
        style.setAttributeNS(null, 'x', '' + size.x);
        style.setAttributeNS(null, 'y', '' + size.y);
        style.setAttributeNS(null, 'width', '' + size.w);
        style.setAttributeNS(null, 'height', '' + size.h);
        return size;
    };
    U.getSvgSize = function (style, minimum, maximum) {
        if (minimum === void 0) { minimum = null; }
        if (maximum === void 0) { maximum = null; }
        var defaults = new GraphSize(0, 0, 200, 99);
        var ret0 = new GraphSize(+style.getAttribute('x'), +style.getAttribute('y'), +style.getAttribute('width'), +style.getAttribute('height'));
        var ret = ret0.clone();
        if (isNaN(ret.x)) {
            U.pw(true, 'Svg x attribute is NaN: ' + style.getAttribute('x') + ' will be set to default: ' + defaults.x);
            ret.x = defaults.x;
        }
        if (isNaN(ret.y)) {
            U.pw(true, 'Svg y attribute is NaN: ' + style.getAttribute('y') + ' will be set to default: ' + defaults.y);
            ret.y = defaults.y;
        }
        if (isNaN(ret.w)) {
            U.pw(true, 'Svg w attribute is NaN: ' + style.getAttribute('width') + ' will be set to default: ' + defaults.w);
            ret.w = defaults.w;
        }
        if (isNaN(ret.h)) {
            U.pw(true, 'Svg h attribute is NaN: ' + style.getAttribute('height') + ' will be set to default: ' + defaults.h);
            ret.h = defaults.h;
        }
        if (minimum) {
            if (!isNaN(+minimum.x) && ret.x < minimum.x) {
                ret.x = minimum.x;
            }
            if (!isNaN(+minimum.y) && ret.y < minimum.y) {
                ret.y = minimum.y;
            }
            if (!isNaN(+minimum.w) && ret.w < minimum.w) {
                ret.w = minimum.w;
            }
            if (!isNaN(+minimum.h) && ret.h < minimum.h) {
                ret.h = minimum.h;
            }
        }
        if (maximum) {
            if (!isNaN(+maximum.x) && ret.x > maximum.x) {
                ret.x = maximum.x;
            }
            if (!isNaN(+maximum.y) && ret.y > maximum.y) {
                ret.y = maximum.y;
            }
            if (!isNaN(+maximum.w) && ret.w > maximum.w) {
                ret.w = maximum.w;
            }
            if (!isNaN(+maximum.h) && ret.h > maximum.h) {
                ret.h = maximum.h;
            }
        }
        if (!ret.equals(ret0)) {
            U.setSvgSize(style, ret);
        }
        return ret;
    };
    U.findMetaParent = function (parent, childJson, canFail) {
        var modelRoot = parent.getModelRoot();
        var debug = true;
        // instanceof crasha non so perch�, d� undefined constructor quando non lo �.
        if (U.getClass(modelRoot) === 'MetaMetaModel') {
            U.pif(debug, 'return null;');
            return null;
        }
        if (U.getClass(modelRoot) === 'MetaModel') {
            U.pif(debug, 'return null;');
            return null;
        } // potrei ripensarci e collegarlo a m3
        // todo: risolvi bene e capisci che collegamento deve esserci tra mmpackage e mpackage.
        // fix temporaneo: cos� per� consento di avere un solo package.
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
    U.arrayRemoveAll = function (arr, elem) {
        var index;
        while (true) {
            index = arr.indexOf(elem);
            if (index === -1) {
                return;
            }
            arr.splice(index, 1);
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
                try { // for statements
                    value = (new Function('with(this) { ' + js + ' }')).call(context);
                }
                catch (e) { }
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
        a = U.multiReplaceAll(a.trim(), ['\\', '//', ':', '*', '?', '<', '>', '"', '|'], ['[lslash]', '[rslash]', ';', '�', '_', '{', '}', '\'', '!']);
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
        svg.setAttributeNS(null, 'viewbox', size.x + ' ' + size.y + ' ' + size.w + ' ' + size.h);
    };
    U.getViewBox = function (svg) {
        var str = svg.getAttributeNS(null, 'viewbox');
        var arr = str.split(' ');
        var x = isNaN(+arr[0]) ? 0 : +arr[0];
        var y = isNaN(+arr[1]) ? 1 : +arr[1];
        var w = isNaN(+arr[2]) ? 2 : +arr[2];
        var h = isNaN(+arr[3]) ? 3 : +arr[3];
        return new Size(x, y, w, h);
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
        console.log('SelectOption not found. html:', htmlSelect, ', searchingFor: ', optionValue, ', in options:', $options);
        U.pe(!isFound && !canFail, 'SelectOption not found. html:', htmlSelect, ', searchingFor: ', optionValue, ', in options:', $options);
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
        U.addCss('customTabs', '.UtabHeaderContainer{ padding: 0; margin: 0; display: flex;}\n' +
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
            '\n}\n');
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
    U.cloneAllAttributes = function (source, destination) {
        U.pw(true, 'cloneAllAttributes: todo');
        // todo
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
    U.resizableBorderMouseDown = function (e) {
        U.resizingBorder = e.currentTarget;
        U.resizingContainer = U.resizingBorder;
        while (!U.resizingContainer.classList.contains('resizableBorderContainer')) {
            U.resizingContainer = U.resizingContainer.parentNode;
        }
    };
    U.resizableBorderMouseUp = function (e) { U.resizingBorder = U.resizingContainer = null; };
    U.resizableBorderUnset = function (e) {
        e.preventDefault();
        var border = e.currentTarget;
        var container = border;
        while (container.classList.contains('resizableBorderContainer')) {
            container = container.parentNode;
        }
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
        console.log(' lrtb: ', l, r, t, b);
        console.log('ptcoinc: ', puntoDaFarCoinciderePT, ' cursor:', cursor, ' size:', size, 'adjust:', add);
        U.resizingContainer.style.width = U.resizingContainer.style.maxWidth = U.resizingContainer.style.minWidth = (size.w + add.x) + 'px';
        U.resizingContainer.style.height = U.resizingContainer.style.maxHeight = U.resizingContainer.style.minHeight = (size.h + add.y) + 'px';
        console.log('result:' + U.resizingContainer.style.width);
        U.resizingContainer.style.flexBasis = 'unset';
    };
    U.resizableBorderSetup = function (root) {
        if (root === void 0) { root = document.body; }
        // todo: addBack is great, aggiungilo tipo ovunque. find() esclude l'elemento radice anche se matcha la query, addback rimedia
        // todo: aggiungendo il previous matched set che matcha la condizione.
        var arr = $(root).find('.resizableBorder').addBack('.resizableBorder');
        var i = -1;
        var nl = '\n';
        while (++i < arr.length) {
            U.makeResizableBorder(arr[i]);
        }
        U.eventiDaAggiungereAlBody(null);
        $('.resizableBorder.side').off('mousedown.ResizableBorder').on('mousedown.ResizableBorder', U.resizableBorderMouseDown)
            .off('contextmenu.ResizableBorder').on('contextmenu.ResizableBorder', U.resizableBorderUnset);
        $('.resizableBorder.corner').off('mousedown.ResizableBorder').on('mousedown.ResizableBorder', U.resizableBorderMouseDown)
            .off('contextmenu.ResizableBorder').on('contextmenu.ResizableBorder', U.resizableBorderUnset);
        $(document.body).off('mousemove.ResizableBorder').on('mousemove.ResizableBorder', U.resizableBorderMouseMove);
        $(document.body).off('mouseup.ResizableBorder').on('mouseup.ResizableBorder', U.resizableBorderMouseUp);
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
        console.log('style.border:', style.border);
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
        container.style.border = 'none';
        content.style.border = 'none';
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
    U.toDottedURI = function (uri) {
        return U.replaceAll(U.replaceAll(uri.substring(uri.indexOf('://') + '://'.length), '\\', '/'), '/', '.');
    };
    U.toHttpsURI = function (uri, folderChar) {
        if (folderChar === void 0) { folderChar = '/'; }
        return 'https://' + U.replaceAll(uri, '.', folderChar);
    };
    U.isNumber = function (o) { return +o === o; };
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
        if (v === null) {
            return returnIfNull;
        }
        if (v === undefined) {
            return returnIfUndefined;
        }
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
    U.increaseEndingNumber = function (s, ignoreNonNumbers, allowDecimal) {
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
        if (numberEnd === -1) {
            return s + '_1';
        }
        i++;
        numberEnd++;
        var nums = +s.substring(i, numberEnd);
        U.pe(isNaN(nums), 'wrong parsing:', s, s.substring(i, numberEnd), i, numberEnd);
        return s.substring(0, i) + (+nums + 1);
    };
    U.isValidName = function (name) { return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name); };
    U.getTSClassName = function (thing) { return thing.constructor.name + ''; };
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
    U.computeMeasurableAttributeRightPart = function (str, attr, logic, measurableHtml, size, absTargetSize, relTargetSize) {
        if (size === void 0) { size = null; }
        if (absTargetSize === void 0) { absTargetSize = null; }
        if (relTargetSize === void 0) { relTargetSize = null; }
        str = U.changeBackVarTemplateDelimitersInMeasurablesAttr(str);
        if (!relTargetSize) {
            var relativeRoot = measurableHtml;
            while (!relativeRoot.classList.contains('vertexShell')) {
                relativeRoot = relativeRoot.parentElement;
            }
            var $relativeHtml = $(relativeRoot).find(measurableHtml.getAttribute('relativeSelectorOf' + attr.name));
            U.pw($relativeHtml.length > 1, 'found more than one relative target (', $relativeHtml, ') assigned to: ', measurableHtml, ' root:', relativeRoot);
            relTargetSize = $relativeHtml.length ? U.sizeof($relativeHtml[0]) : absTargetSize;
        }
        var relativePos = size.tl().subtract(relTargetSize.tl(), false);
        var absolutePos = size.tl().subtract(absTargetSize.tl(), false);
        if (!absTargetSize) {
            absTargetSize = U.sizeof(document.body);
        }
        str = U.replaceVarsString(logic, str);
        str = U.multiReplaceAll(str, ['positionX', 'positionX'], ['positionRelX', 'positionRelY']);
        str = U.multiReplaceAll(str, ['width', 'height', 'positionAbsX', 'positionAbsY', 'positionRelX', 'positionRelY'], ['' + size.w, '' + size.h, '' + absolutePos.x, '' + absolutePos.y, '' + relativePos.x, '' + relativePos.y]);
        str = U.multiReplaceAll(str, ['absoluteTargetSizeX', 'absoluteTargetSizeY', 'absoluteTargetSizeW', 'absoluteTargetSizeH'], ['' + absTargetSize.x, '' + absTargetSize.y, '' + absTargetSize.w, '' + absTargetSize.h]);
        str = U.multiReplaceAll(str, ['relativeTargetSizeX', 'relativeTargetSizeY', 'relativeTargetSizeW', 'relativeTargetSizeH'], ['' + relTargetSize.x, '' + relTargetSize.y, '' + relTargetSize.w, '' + relTargetSize.h]);
        try {
            str = eval(str);
        }
        catch (e) {
            U.pw(true, 'error occurred while evaluating ', str, 'in measurable attribute ', attr, 'err:', e);
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
        console.log('attr:', attr, 'left:', leftSide, 'right:', rightSide, ' ---> |' + value + '|');
        return { destination: leftSide, operator: operator, value: value };
    };
    U.processMeasurableExport = function (attr, logic, measurableHtml, size, absTargetSize) {
        if (size === void 0) { size = null; }
        if (absTargetSize === void 0) { absTargetSize = null; }
        var rule = U.computeResizableAttribute(attr, logic, measurableHtml, size, absTargetSize);
        if (!rule) {
            return;
        }
        var attributePseudoSelector = '->';
        var pos = rule.destination.indexOf(attributePseudoSelector);
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
        var destination = attr0.value;
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
                    destinationParent.setValue(rule.value, false, true);
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
        var outputSize = size.clone();
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
    U.processMeasurableVariable = function (attr, logic, measurableHtml, size, absTargetSize) {
        if (size === void 0) { size = null; }
        if (absTargetSize === void 0) { absTargetSize = null; }
        attr.ownerElement.setAttribute(attr.name.substr(1), U.computeMeasurableAttributeRightPart(attr.value, attr, logic, measurableHtml, size, absTargetSize));
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
        U.processMeasurableVariable(attr, logic, html, size, absTargetSize);
        var elem = attr.parentElement;
        var fake = document.createElement('div');
        fake.setAttribute('style', elem.getAttribute('dstyle'));
        var key;
        for (key in fake.style) {
            if (fake[key] !== null && fake[key] !== undefined && fake[key] !== '') {
                elem.style[key] = fake[key];
            }
        }
    };
    U.prefix = 'ULibrary_';
    U.sizeofvar = null;
    U.$sizeofvar = null;
    U.clipboardinput = null;
    U.PermuteArr = [];
    U.PermuteUsedChars = [];
    U.resizingBorder = null;
    U.resizingContainer = null;
    // static he = null;
    U.production = false; // true;
    U.addCssAvoidDuplicates = {};
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
    Json.getChildrensXMI = function (json) {
        return ['todo childrensxmi'];
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
        var ret = mod || pkg || cla || fun;
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
        if ((ret === null || ret === undefined)) {
            U.pe(valueIfNotFound === 'read<T>CanThrowError', 'Json.read<', '> failed: field[' + field + '], json: ', json);
            return valueIfNotFound;
        }
        return ret;
    };
    Json.write = function (json, field, val) { json[field] = val; return val; };
    return Json;
}());
export { Json };
var Dictionary = /** @class */ (function (_super) {
    tslib_1.__extends(Dictionary, _super);
    function Dictionary() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Dictionary;
}(Object));
export { Dictionary };
;
import * as detectzoooom from 'detect-zoom';
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
var Size = /** @class */ (function () {
    function Size(x, y, w, h) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (w === void 0) { w = 0; }
        if (h === void 0) { h = 0; }
        if (+x === null || +x === undefined) {
            this.x = 0;
        }
        else {
            this.x = x;
        }
        if (+y === null || +y === undefined) {
            this.y = 0;
        }
        else {
            this.y = y;
        }
        if (+w === null || +w === undefined) {
            this.w = 0;
        }
        else {
            this.w = w;
        }
        if (+h === null || +h === undefined) {
            this.h = 0;
        }
        else {
            this.h = h;
        }
    }
    Size.prototype.tl = function () { return new Point(this.x + 0, this.y + 0); };
    Size.prototype.tr = function () { return new Point(this.x + this.w, this.y + 0); };
    Size.prototype.bl = function () { return new Point(this.x + 0, this.y + this.h); };
    Size.prototype.br = function () { return new Point(this.x + this.w, this.y + this.h); };
    Size.prototype.clone = function () { return new Size(this.x, this.y, this.w, this.h); };
    Size.prototype.equals = function (size) { return this.x === size.x && this.y === size.y && this.w === size.w && this.h === size.h; };
    /// field-wise Math.min()
    Size.prototype.min = function (minSize, clone) {
        var ret = clone ? this.clone() : this;
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
    Size.prototype.max = function (maxSize, clone) {
        var ret = clone ? this.clone() : this;
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
    return Size;
}());
export { Size };
//# sourceMappingURL=util_bkp.js.map