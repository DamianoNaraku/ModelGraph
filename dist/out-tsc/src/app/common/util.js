import { Point } from '../mGraph/iGraph';
import { GraphSize } from '../mGraph/Vertex/iVertex';
export var eCoreRoot;
(function (eCoreRoot) {
    eCoreRoot["ecoreEPackage"] = "ecore:EPackage";
})(eCoreRoot || (eCoreRoot = {}));
export var eCorePackage;
(function (eCorePackage) {
    eCorePackage["eClassifiers"] = "eClassifiers";
    eCorePackage["xmlnsxmi"] = "@xmlns:xmi";
    eCorePackage["xmlnsxsi"] = "@xmlns:xsi";
    eCorePackage["xmiversion"] = "@xmi:version";
    eCorePackage["xmlnsecore"] = "@xmlns:ecore";
    eCorePackage["nsURI"] = "@nsURI";
    eCorePackage["nsPrefix"] = "@nsPrefix";
    eCorePackage["name"] = "@name";
})(eCorePackage || (eCorePackage = {}));
export var ShortAttribETypes;
(function (ShortAttribETypes) {
    ShortAttribETypes["EString"] = "EString";
    ShortAttribETypes["integer"] = "integer? boh";
})(ShortAttribETypes || (ShortAttribETypes = {}));
export var AttribETypes;
(function (AttribETypes) {
    //  FakeElementAddFeature = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//FakeElement',
    // era il 'pulsante per aggiungere feature nel mm.',
    // reference = 'reference??',
    AttribETypes["integer"] = "integer??? search how its done";
    AttribETypes["EString"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EString";
})(AttribETypes || (AttribETypes = {}));
export var eCoreClass;
(function (eCoreClass) {
    eCoreClass["xsitype"] = "@xsi:type";
    eCoreClass["name"] = "@name";
    eCoreClass["eStructuralFeatures"] = "eStructuralFeatures";
})(eCoreClass || (eCoreClass = {}));
export var eCoreReference;
(function (eCoreReference) {
    eCoreReference["eType"] = "@eType";
    eCoreReference["containment"] = "@containment";
    eCoreReference["upperbound"] = "@upperbound";
    eCoreReference["lowerbound"] = "@lowerbound";
    eCoreReference["xsitype"] = "@xsi:type";
    eCoreReference["name"] = "@name";
})(eCoreReference || (eCoreReference = {}));
export var eCoreAttribute;
(function (eCoreAttribute) {
    eCoreAttribute["xsitype"] = "@xsi:type";
    eCoreAttribute["name"] = "@name";
    eCoreAttribute["eType"] = "@eType";
})(eCoreAttribute || (eCoreAttribute = {}));
/*
export class Json {
  eClassifiers: any;
  eStructuralFeatures: any;
  logical: ModelPiece;
}*/
// export type Json = object;
var Json = /** @class */ (function () {
    function Json(j) {
    }
    Json.getChildrens = function (thiss) {
        var mod = thiss[eCoreRoot.ecoreEPackage];
        var pkg = thiss[eCorePackage.eClassifiers];
        var cla = thiss[eCoreClass.eStructuralFeatures];
        var ret = mod || pkg || cla;
        if (ret === undefined || ret === null) {
            // if (thiss['@name'] !== undefined) { ret = thiss; } // if it's the root with only 1 child arrayless
        }
        // U.pe(true, debug);
        console.log('getchildrens(', thiss, ')');
        U.pe(ret === undefined || ret === null, 'getChildrens() Failed: ', thiss);
        console.log('ret = ', ret, ' === ', {}, ' ? ', ($.isEmptyObject(ret) ? [] : [ret]));
        ret = Array.isArray(ret) ? ret : ($.isEmptyObject(ret) ? [] : [ret]);
        console.log('getchildrens() => ', ret);
        return ret;
    };
    Json.read = function (json, field, valueIfNotFound) {
        if (valueIfNotFound === void 0) { valueIfNotFound = 'read<T>CanThrowError'; }
        var ret = json[field];
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
var U = /** @class */ (function () {
    function U() {
    }
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
        alert(str);
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
        var str = 'Warning:' + s + '';
        console.log('pw[0/' + (restArgs.length + 1) + ']: ', s);
        for (var i = 0; i < restArgs.length; i++) {
            s = restArgs[i];
            str += 'pw[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ' + s + '\t\t\r\n';
            console.log('pw[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ', s);
        }
        alert(str);
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
        return U.p(s, restArgs);
    };
    U.p = function (s) {
        var restArgs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            restArgs[_i - 1] = arguments[_i];
        }
        var str = '';
        for (var i = 0; i < restArgs.length; i++) {
            str += 'p[' + i + '/' + restArgs.length + ']: ' + s + '\t\t\r\n';
            console.log('p[' + i + '/' + restArgs.length + ']: ', s);
        }
        alert(str);
        return str;
    };
    U.cloneHtml = function (html) {
        return html.cloneNode(true);
    };
    U.cloneObj = function (o) {
        // const r: HTMLElement = document.createElement(o.tagName);
        // r.innerHTML = o.innerHTML;
        // U.pe( o as HTMLElement !== null, 'non utilizzabile su html');
        return JSON.parse(JSON.stringify(o));
        // todo: questa funzione non può clonare html.
        // todo: allow cloneObj of circular objects.
    };
    U.newSvg = function (type) {
        return document.createElementNS('http://www.w3.org/2000/svg', type);
    };
    U.replaceVars = function (obj, html0) {
        var html = U.cloneHtml(html0);
        var debug = false;
        /// see it in action & modify or debug at
        // v1) perfetto ma non supportata in jscript https://regex101.com/r/Do2ndU/1
        // v2) usata: aggiustabile con if...substring(1). https://regex101.com/r/Do2ndU/3
        // get text between 2 single '$' excluding $$, so they can be used as escape character to display a single '$'
        console.log('html0:', html0, 'html:', html);
        html.innerHTML = html.innerHTML.replace(/(^\$|(((?!\$).|^))[\$](?!\$))(.*?)(^\$|((?!\$).|^)[\$](?!\$))/gm, function (match, capture) {
            console.log('matched:', match, 'capture: ', capture);
            if (match === '$') {
                return '';
            }
            var prefixError = '';
            if (match.charAt(0) !== '$') {
                prefixError = match.charAt(0);
                match = match.substring(1);
            }
            // # = default value: {asHtml = true, isbase64 = false}
            var asHtml = match.charAt(0) === '1' || match.charAt(0) === '#';
            var isBase64 = match.charAt(1) === '1' || match.charAt(1) !== '#';
            var varname = match.substring(3, match.length - 1);
            var debugtext = varname + '(' + match + ')';
            var tmp = prefixError + '' + U.replaceSingleVar(obj, varname, isBase64, asHtml, false);
            U.pif(debug, 'replaceSingleVar: ' + debugtext + ' --> ' + tmp, obj);
            return tmp;
        });
        html.innerHTML = html.innerHTML.replace(/\$\$/gm, '$');
        // console.log('POST:', shell.innerHTML);
        return html;
    };
    U.replaceSingleVar = function (obj, varname, isBase64, asHtml, canThrow) {
        if (canThrow === void 0) { canThrow = false; }
        var debug = false;
        var showErrors = false;
        var debugPathOk = '';
        if (isBase64) {
            varname = atob(varname);
        }
        var requestedValue = obj;
        var fullpath = varname;
        var tokens = varname.split('.');
        var j;
        for (j = 0; j < tokens.length; j++) {
            var token = tokens[j];
            U.pif(debug || showErrors, 'replacer: obj[req] = ', requestedValue, '[', token, '] =', (requestedValue ? requestedValue[token] : ''));
            requestedValue = (requestedValue === null) ? undefined : requestedValue[token];
            if (requestedValue === undefined) {
                U.pe(showErrors, 'requested null or undefined:', obj, ', canthrow ? ', canThrow, ', fillplath:', fullpath);
                if (canThrow) {
                    U.pif(showErrors, 'wrong variable path:', debugPathOk + '.' + token, ': ' + token + ' is undefined. object = ', obj);
                    throw new DOMException('replaceVars.WrongVariablePath', 'replaceVars.WrongVariablePath');
                }
                else {
                    U.pif(showErrors, 'wrong variable path:', debugPathOk + '.' + token, ': ' + token + ' is undefined. ovjet = ', obj);
                }
                return 'Error: ' + debugPathOk + '.' + token + ' = ' + undefined;
            }
            else {
                debugPathOk += (debugPathOk === '' ? '' : '.') + token;
            }
        }
        return requestedValue;
    };
    U.sizeof = function (element) {
        var $element = $(element);
        var i;
        var tmp;
        var size;
        if (U.sizeofvar === null) {
            U.sizeofvar = document.createElement('div');
            U.$sizeofvar = $(U.sizeofvar);
            $('body').append(U.sizeofvar);
        }
        var isOrphan = element.parentNode === null;
        // var visible = element.style.display !== 'none';
        // var visible = $element.is(":visible"); crea bug quando un elemento è teoricamente visibile ma orfano
        var ancestors = U.ancestorArray(element);
        var visibile = [];
        if (isOrphan) {
            U.$sizeofvar.append(element);
        }
        // show all and save visibility to restore it later
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
        return size;
    };
    /* ritorna un array con tutti i figli, nipoti... discendenti di @parent */
    U.iterateDescendents = function (parent) { return parent.getElementsByTagName('*'); };
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
    U.toHtml = function (html) {
        var o = document.createElement('div');
        o.innerHTML = html;
        return o.firstChild;
    };
    U.toHtml_RootlessArray = function (html) {
        var o = document.createElement('div');
        o.innerHTML = html;
        return o.childNodes;
    };
    U.getPrimitiveType = function (value) {
        switch (value) {
            default:
                U.pe(true, 'unrecognized type: ', value, 'estring=', AttribETypes.EString);
                break;
            case ShortAttribETypes.EString:
            case AttribETypes.EString: return AttribETypes.EString;
        }
        return null;
    };
    U.getShortTypeName = function (type) {
        switch (type) {
            default: U.pe(true, 'unexpected type:', type);
            case AttribETypes.EString: return ShortAttribETypes.EString;
            case AttribETypes.integer: return ShortAttribETypes.integer;
        }
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
    U.isChildrenOf = function (child, parent) { return U.isParentOf(parent, child); };
    U.getSvgSize = function (style) {
        var ret = new GraphSize(+style.getAttribute('x'), +style.getAttribute('y'), +style.getAttribute('width'), +style.getAttribute('height'));
        U.pe(isNaN(ret.x) || isNaN(ret.y) || isNaN(ret.w) || isNaN(ret.h), 'svg attributes missing or invalid (NaN)', style);
        return ret;
    };
    U.getExtendedAttribETypes = function () {
        var extended = {};
        for (var type in AttribETypes) {
            extended[AttribETypes[type]] = type;
        }
        for (var type in ShortAttribETypes) {
            extended[ShortAttribETypes[type]] = type;
        }
        return extended;
    };
    U.sizeofvar = null;
    U.$sizeofvar = null;
    return U;
}());
export { U };
/*old file:*/
/*console.log('du.js loaded');
class du{//e se fosse JavascriptUtil? ju?
    constructor(){
        this.a = 0;
        du.pe(true, 'Dam_Util (du) is a static class');}
}
du.prefix = 'du_';

du.exception = function(){
    console.log("Exception occurred: messages.length = "+arguments.length);
    if(arguments.length > 0) console.log(arguments);
    console.trace();};

du.p = function(){
    if(arguments.length > 0) console.log(arguments);
    else console.log('');//act as newline
    console.trace();};

du.pif = function(b){if(b) { // noinspection Annotator
    console.log(arguments);
}};

*/
/*
du.caseError = function(value, ammissibili){
    du.pe(true, 'unexpected switch case:', value, '; should be one of:', ammissibili); };

du.pe = function(b){
    if(!b) return;
    // noinspection Annotator
    console.log(arguments);
    var args = arguments;//Array.isArray(arguments) ? arguments.splice(1) : arguments;
    du.exception.call(args);
    var concat = '';
    for(var i = 1; i<args.length; i++){ concat += '|' + args[i]; }
    concat += '|';
    alert(concat); };
du.assert = function(b){
    arguments[0] = !arguments[0];
    return du.pe.call(arguments); };
/*
du.po(str, obj){
    if(obj === undefined)  return p(str+": undefined");
    if(obj === null)       return p(str+': null');
    if(Array.isArray(str)) return pa(str, obj);
    return p(str+": "+JSON.stringify(obj));}* /
/*
du.pa(str, arr){
    if(arr===undefined) return p(str+=": undefined");
    if(arr===null) return p(str+=': null');
    if(!Array.isArray(str)) return po(str, arr);
    if(arr.length===0) return p(str+": Array empty []");
    str+=": ["+arr[0];
    for(var i=1; i<arr.length; i++){ str+=", "+arr[i]; }
    return p(str+="]");}* /
du.error = function(){ du.pe.call(arguments); }; //arguments[0] = !arguments[0];


du.obj_containValue = function(object, value){
  for(var field in object){ if(object[field] === value) return true; }
  return false;};

du.obj_GetValueKeys = function(object, value){
  var fields = [];
  for(var field in object){ if(object[field] === value) fields.push(field); }
  return fields;};

/// comparator è una stringa contenente il comparatore ( "===" , "<=", ...)
du.obj_GetValueKeys_CustomComparator = function(object, comparator, value){
  var fields = [];
  for(var field in object){ if(eval("object[field] "+comparator+" value") === true) fields.push(field); }
  return fields;};

*/ ///// just for editor line length detection
/*
du.int = function(string){return Number.parseInt(string);};
du.float = function(string){return float.parse(string);};
/// The Object constructor creates an object wrapper for the given value. If the value is null or undefined,
/// it will create and return an empty object, otherwise, it will return an object of a type that corresponds to the given value.
/// If the value is an object already, it will return the value.
du.isObject2 = function(obj) { return obj === Object(obj); };

du.isObject = function(val) {
  if (val === null) { return false;}
  return typeof val === 'object';};

du.isFunction = function(val){
  if (val === null) { return false;}
  return (typeof val === 'function');};

du.isPrimitive = function(val){
  if (val === null || val === undefined) { return true;}
  return (typeof val !== 'function') && (typeof val !== 'object') && (!Array.isArray(val));};

du.isArray = function(val) { return Array.isArray(val); };

du.toDegrees = function(angle){ var deg= angle * (180 / Math.PI); if(deg<0) deg+=360; return deg;};
du.toRadians = function(angle){ return angle * (Math.PI / 180); };
du.removeemptynodes = function(root){
  for(var n = 0; n < root.childNodes.length; n ++) {
    var child = root.childNodes[n];
    switch(root.childNodes[n].nodeType){
      default: break;
      case 1: du.removeemptynodes(child); break;//node: element
      case 2: break;//leaf: attribute
      case 8: break;//leaf: comment
      case 3: //leaf: text node
        if(!/^[\n\r ]*$/g.test(child.nodeValue)) break;
        root.removeChild(child); n--; break;
    }
  }
};
du.unselectable = function(target) {
  var $target = $(target);
  $target
    .addClass( du.prefix+'unselectable' ) // All these attributes are inheritable
    .attr( 'unselectable', 'on' ) // For IE9 - This property is not inherited, needs to be placed onto everything
     // For moz and webkit, although Firefox 16 ignores this when -moz-user-select: none; is set,
     // it's like these properties are mutually exclusive, seems to be a bug.
    .attr( 'draggable', 'false' )
     // Needed since Firefox 16 seems to ingore the 'draggable' attribute we just applied above when '-moz-user-select: none'
     // is applied to the CSS
    .on( 'dragstart', function() { return false; } );

  $target // Apply non-inheritable properties to the child elements
    .find( '*' )
    .attr( 'draggable', 'false' )
    .attr( 'unselectable', 'on' );
};

// non usa incapsulamento, quindi ritorna un elemento unico e funziona solo se string ha una radice.
// altrimenti è impossibile restituire un singolo nodo e va incapsulato oppure va usato div.childNodes per restituire una collezione
du.htmlToDomNode = function(string){
  var div = document.createElement('div');
  div.innerHTML = string.trim();
  return div.firstChild;};

du.CopyToClipboard = function(text){
  if(du.clipboardinput === null || du.clipboardinput === undefined) {
    du.clipboardinput = document.createElement("input");
    du.clipboardinput.id = du.prefix+'CopyDataToClipboard';
    du.clipboardinput.type = "text";
    du.clipboardinput.style.display = 'block';
    du.clipboardinput.style.position = 'absolute';
    du.clipboardinput.style.top = '-100vh';}
  document.body.appendChild(du.clipboardinput);
  window.global.clipboardinput.value = text;
  window.global.clipboardinput.select();
  document.execCommand("copy");
  document.body.removeChild(du.clipboardinput);
  du.clearSelection();};

du.focusAndSelect = function(input){
  input.focus();
  input.setSelectionRange(0, input.value.length);};

du.clearSelection = function(){
  if (window.getSelection) {window.getSelection().removeAllRanges();}
  else {
    if (document.selection) {
      document.selection.empty();}
  }};

*/
///// just for editor line length detection
/*
du.SwapContentInit = function(){
  $(".Swap.Alternative").hide();//.off("focusout.swap").on("focusout.swap")
  $(".Swap.Container").off("mouseenter."+du.prefix+"swap").on("mouseenter."+du.prefix+"swap", function(){du.swapContent(this, true);})
    .off("mouseleave."+du.prefix+"swap").on("mouseleave."+du.prefix+"swap", function(){
    var container = this;
    //var content = container.childNodes[0];
    var swap = container.childNodes[1];
    if( du.isParentOf(swap, document.activeElement)) return;
    du.swapContent(this, false);}).each(function(index, container) {
    container.children[1].display = "none";
  });
};
du.swapContent = function(container, swap){
  var content = container.children[0], $content = $(content);
  var alt =  container.children[1], $alt = $(alt);

  //var containerS = du.sizeof(container);
  var contentS   = du.sizeof(content);
  var altS       = du.sizeof(alt);
  //console.log("C.w:"+containerS.height+", "+contentS.height+", "+altS.height);
  // console.log("C.h:"+containerS.width+", "+contentS.width+", "+altS.width);

  clearTimeout(du.swaptimer);
  $content.stop(); $alt.stop();
  //rimuovo i vari style (height, margin...) teoricamente temporanei impostati dalle animazioni jquery,
  // ma che a volte rimangono anche a evento terminato/stoppato.
  content.style.height = 'auto'; alt.style.height = 'auto';//content.removeAttribute("style"); alt.removeAttribute("style");

  //if(swap){$content.show(); $alt.hide();} else {$content.hide(); $alt.show();}
  //container.style.borderWidth = '3px'; container.style.borderStyle = 'solid'; container.style.borderColor = 'red';
  var animationTime = 400;
  if(swap) {
    container.style.height = contentS.height+'px'; container.style.width  = contentS.width+'px';
    $content.slideUp(animationTime, function(){
      du.swaptimer = setTimeout(function(){
        $alt.slideDown(animationTime, function(){
          content.style.height = 'auto';
          alt.style.height = 'auto';
          container.style.height = container.style.width = 'auto';});}, 0);
    });}
  else {
    container.style.height = altS.height+'px'; container.style.width  = altS.width+'px';
    $alt.slideUp(animationTime, function(){
      du.swaptimer = setTimeout(function(){
        $content.slideDown(animationTime, function(){
          content.style.height = 'auto';
          alt.style.height = 'auto';
          container.style.height = container.style.width = 'auto';});}, 0);
    });}
};

du.insertAfter = function(referenceNode, newNode) {
  var parent = referenceNode.parentElement;
  var next = referenceNode.nextSibling;

  if(next === null) parent.appendChild(newNode);
  else {
    parent.insertBefore(newNode, next);
    parent.appendChild(next);// automatically remove from previous position
  }
};

du.clone_uniqueID = function(node, deep){
  var o = node.cloneNode(false);//non posso usare la versione deep di default perchè devo
   // iterare mentre clono per cambiare gli id children
  //change id
  var debug = false;
  if(o.id !== undefined && o.id!==''){
    var match = o.id.match(/(.+)(_CloneJS_)(\d+)$/);
    if(match === null || match.length === 0){ o.id+="_CloneJS_0";}
    else{
      o.id = match[1] + '_CloneJS_' + (Number.parse(match[3])+1);
      du.pif(debug, "match("+match[3]+")+1 = "+(Number.parse(match[3])+1)+" = "+o.id);
    }}

  // non puoi trasformare il cloneObj su string con outerHTML perchè perderesti gli event listener

  for(var i=0; deep && i < node.childNodes.length; i++){
    o.appendChild(du.clone_uniqueID(node.childNodes[i], deep));
  }
  return o;};
du.cloneObj = function(){du.clone_uniqueID.call(arguments);};

du.decodeEntities0 = (function() {//funzione ottimizzata trovata in rete, non creata da me. ritorna una funzione
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div');
  element.id = du.prefix+'decodeHtmlEntitiesTrick';
  function decodeHTMLEntities(str){
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';}
    return str;}
  return decodeHTMLEntities;})();
//wrapping per aiutare l'IDE a capire che è una funzione e non una variabile.
du.decodeEntities = function(str){return du.decodeEntities0(str);};
/*
* Somma o concatena tutti i campi con lo stesso nome contenuti da entrambi gli oggetti input:   ret.x = ( obj1.x + obj2.x )
* I campi contenuti da uno solo dei 2 input verranno copiati senza modifiche. ( unione insiemistica )
* Se i campi non sono concatenabili perchè uno è array: gli elementi o l'elemento dell'altro membro con lo stesso nome
* verranno aggiunti all'array
* Se i campi non sono concatenabili perchè sono 2 oggetti: verranno ricorsivamente sommati.
* Utilizzi impropri ma comunque gestiti:
* Se i campi non sono concatenabili perchè sono 1 oggetto + un tipo elementare: il tipo elementare verrà considerato
* come array con il solo indice [0].
* Se i campi non sono concatenabili perchè sono 1 oggetto + un array: l'array verrà trattato come oggetto con campi "0, 1, 2..."
* e sommato ricorsivamente.
* WARNING: i boolean non sono gestiti affatto e verranno sommati di default come interi cambiando di tipo.
* nel caso di boolean + string invece: true + true + "string"= 2string; true + "string" = truestring; "string"+true+true = stringtruetrue;
* WARNING2: neanche le funzioni sono trattate.
* * /
du.somma_oggetti = function(obj1, obj2){
  var r;
  try{ r = du.somma_oggetti0(obj1, obj2);}
  catch(ex){
    du.pe(true, "Eccezione in somma oggetti('"+typeof(obj1)+"', '"+typeof(obj2)+"'); con argomenti:", obj1, obj2,
    "forse hai sommato funzioni?");
    r = null;}
  return r;};
du.somma_oggetti0 = function(obj1, obj2){
  //to do: alcuni browser trattano typeof e typeOf diversamente e typeof([1,2,3]) = object ma typeOf([1,2,3]) = array;
  var r = {};
  var field;
  for(field in obj1){
    var val1 = obj1[field], val2 = obj2[field];
    var type1 = typeof(val1);
    var type2 = typeof(val2);
    if(type2 === 'undefined' || type2 === 'null') {r[field] = val1; // noinspection UnnecessaryContinueJS
      continue;}
    else if(type2 === 'object'){
      if(type1 === 'object'){ r[field] = du.somma_oggetti(val1, val2); }
      else if(type1 === 'array'){
        console.log("WARNING: utilizzo improprio di somma_oggetti: '"+type1+"' + '"+type2+"'; argomenti:", obj1, obj2);
        r[field] = du.somma_oggetti(du.ArrayToObject(val1), val2); }
      else {
        console.log("WARNING: utilizzo improprio di somma_oggetti: '"+type1+"' + '"+type2+"'; argomenti:", obj1, obj2);
        r[field] = du.somma_oggetti({0:val1}, val2); }
    }
    else if(type2 === 'array'){
      if(type1 === 'object'){
        console.log("WARNING: utilizzo improprio di somma_oggetti: '"+type1+"' + '"+type2+"'; argomenti:", obj1, obj2);
        r[field] = du.somma_oggetti(val1, ArrayToObject(val2));
      }
      else if(type1 === 'array'){
        r[field] = [];
        for(var field2 in val1){//was: var field2 in obj1
          r[field][field2] = du.somma_oggetti(val1[field2], val2[field2]);
        }}
      else {
        console.log("WARNING: utilizzo improprio di somma_oggetti: '"+type1+"' + '"+type2+"'; argomenti:", obj1, obj2);
        r[field] = du.somma_oggetti([val1], val2); }
    }
    //se type2 è elementare: boolean, number, string
    else switch(type1){//now type2 can't be: object, array, undefined, null;
        case 'undefined': case 'null': r[field] = obj2[field]; break;
        case 'string': case 'number': case 'boolean': default:
          r[field] = val1 + val2; break;
        case 'object':
          r[field] = du.somma_oggetti(val1, {0:val2}); break;
        case 'array':
          r[field] = du.somma_oggetti(val1, [val2]); break;}
  }

  //controllo i campi esistenti in obj2 ma non esistenti in obj1 e li aggiungo senza ulteriori controlli.
  for(field in obj2){
    val1 = obj1[field];
    if(val1 === undefined || val1 === null) r[field] = obj2[field];
  }
};

*/
///// just for editor line length detection
/*
du.arrayRemove = function(array, element){
  var index = array.indexOf(element);
  if (index > -1) { array.splice(index, 1); }
};


du.sizeofvar = null;
du.$sizeofvar = null;
du.sizeof = function(element){
  var $element = $(element), i, tmp, size;
  if(du.sizeofvar === null){ du.sizeofvar = document.createElement("div"); du.$sizeofvar=$(du.sizeofvar); $("body").append(du.sizeofvar); }
  var orphan = element.parentNode === null;
  //var visible = element.style.display!=='none';
  //var visible = $element.is(":visible"); crea bug quando un elemento è teoricamente visibile ma orfano
  var ancestors = du.ancestorArray(element);
  var visibile = [];

  if(orphan) du.$sizeofvar.append(element);
  //show all and save visibility to restore it later
  for(i=0; i<ancestors.length; i++){//document has undefined style
    if(!(visibile[i] = (ancestors[i].style === undefined)? (true) : (ancestors[i].style.display !== 'none'))) $(ancestors[i]).show();}

  tmp = $element.offset();
  size = {width:0, height:0, left:tmp.left, top:tmp.top};
  tmp = element.getBoundingClientRect();
  size.width  = tmp.width;
  size.height = tmp.height;
  //restore visibility
  for(i=0; i<ancestors.length; i++){ if(!visibile[i]) $(ancestors[i]).hide();}
  if(orphan){du.clearchilds(du.sizeofvar);}

  size.x = size.left;
  size.y = size.top;
  size.w = size.width;
  size.h = size.height;
  return size;};

// ritorna un array con tutti i figli, nipoti... discendenti di @parent
du.iterateDescendents = function(parent){ return parent.getElementsByTagName('*');};

*/
///// just for editor line length detection
/*
du.extendPrototype = function(){
  Element.prototype.remove = function() { this.parentElement.removeChild(this); };//rimuove un nodo
  NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {//rimuove tutta una NodeList
    for(var i = this.length - 1; i >= 0; i--) {
      if(this[i] && this[i].parentElement) {
        this[i].parentElement.removeChild(this[i]); } } };
  //Convert a string to HTML entities
  String.prototype.toHtmlEntities = function() {
    return this.replace(/./gm, function(s) { return "&#" + s.charCodeAt(0) + ";"; });
  };
  // Create string from HTML entities
  String.fromHtmlEntities = function(string) {
    return (string+"").replace(/&#\d+;/gm,function(s) {
      return String.fromCharCode(s.match(/\d+/gm)[0]);
    })
  };
};


//du.getLocalClickCoord = function(evt){ return {x: evt.originalEvent.layerX, y: evt.originalEvent.layerY}; };

du.textToHtml = function(text){
  var tmp = document.createElement('div');
  tmp.innerHTML = text;
  return tmp.firstChild;};

du.isValidHtml = function(text){
  var doc = document.createElement('div');
  doc.innerHTML = text;
  console.log('isValidHtml? ',( doc.innerHTML === text ),':', doc.innerHTML);
  console.log('===',text);
  return ( doc.innerHTML === text ); };


du.tabSetup = function(root){
  if(root === null || root === undefined) root = document;
  //var $containers = $(root).find(".tabButton_container");
  var $buttons = $(root).find(".tabButton");
  $buttons.off('click.tabchange').on('click.tabchange', du.tabClick);
  //function(){du.tabClick.call(this, this.dataset.tabselector, this.dataset.containerselector);});
  for(var i=0; i<$buttons.length; i++){ du.tabClick.call($buttons[i], null, $buttons[i].dataset.tabselected); }
};

*/
///// just for editor line length detection
/*
du.tabClick = function(evt, overrideValue){//tabcontentselector, tabcontainerselector){
  overrideValue = (overrideValue === undefined ? undefined :
  (overrideValue === 'true' || overrideValue === 't' || overrideValue === '1' || overrideValue === true));
  var parent = this;
  while(!parent.classList.contains('tabContainer')) {parent = parent.parentNode;}
  var multitab = (parent.dataset.allowmultitab === 'true' || parent.dataset.allowmultitab === 't'
  || parent.dataset.allowmultitab === '1');
  var $targets = $(this.dataset.tabselector);
  //console.log('tabClick(',this,', multitab:',multitab,', overrideValue:', overrideValue, ', targets:', $targets);

  var selected = !multitab || !(this.dataset.tabselected === 'true' || this.dataset.tabselected === '1'
  || this.dataset.tabselected === 't');
  if(overrideValue !== undefined) selected = overrideValue;
  this.dataset.tabselected = selected ? 'true' : 'false';
  if(selected) $targets.show(); else $targets.hide();

  if(multitab || overrideValue !== undefined) return;
  var $childrens = $(parent).find('.tabButton');
  for(var i = 0; i < $childrens.length; i++){
    if($childrens[i] === this) continue;
    du.tabClick.call($childrens[i], evt, false);

  }

};

*/
///// just for editor line length detection
/*
du.doNothing = function(){};

du.cloneObj = function (object, deep){
  try{return JSON.parse(JSON.stringify(object));}
  catch(ex){
    du.pe(true, object, ex);
  }
  return undefined;
};

du.removechilds = function(node){
  while(node.firstChild) node.removeChild(node.firstChild);
};
*/
var Size = /** @class */ (function () {
    function Size(x, y, w, h) {
        if (x === null || x === undefined) {
            this.x = 0;
        }
        else {
            this.x = x;
        }
        if (y === null || y === undefined) {
            this.y = 0;
        }
        else {
            this.y = y;
        }
        if (w === null || w === undefined) {
            this.w = 0;
        }
        else {
            this.w = w;
        }
        if (h === null || h === undefined) {
            this.h = 0;
        }
        else {
            this.h = h;
        }
    }
    Size.prototype.tl = function () { return new Point(this.x, this.y); };
    Size.prototype.br = function () { return new Point(this.x + this.w, this.y + this.h); };
    return Size;
}());
export { Size };
//# sourceMappingURL=util.js.map