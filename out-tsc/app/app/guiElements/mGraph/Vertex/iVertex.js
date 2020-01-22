import { U, IEdge, M2Class, ModelPiece, IClass, Point, DamContextMenuComponent, Status, IReference, MReference, M2Reference, GraphSize, GraphPoint, Type, EEnum, ExtEdge } from '../../../common/Joiner';
import { IClassifier } from '../../../mClass/IClassifier';
var IVertex = /** @class */ (function () {
    function IVertex(logical, size) {
        if (size === void 0) { size = null; }
        this.fields = [];
        this.edgesStart = [];
        this.edgesEnd = [];
        this.Vmarks = {};
        this.id = IVertex.ID++;
        IVertex.all[this.id] = this;
        var graph = logical.getModelRoot().graph;
        this.logic(logical);
        if (graph) {
            graph.addVertex(this);
        }
        this.contains = [];
        this.fields = [];
        this.edgesStart = [];
        this.edgesEnd = [];
        this.classe = logical;
        this.classe.vertex = this;
        this.setGraph(logical.getModelRoot().graph);
        if (!size) {
            size = IVertex.defaultSize;
            var gsize = this.owner.getSize();
            size.x = this.owner.scroll.x + (gsize.w - size.w) / 2;
            size.y = this.owner.scroll.y + (gsize.h - size.h) / 2;
        }
        this.size = size;
        this.refreshGUI();
        // this.refreshGUI(); // need both refresh
    }
    IVertex.staticinit = function () {
        var g = new GraphPoint(0, 0);
        g.x = 'prevent_doublemousedowncheck';
        g.y = 'prevent_doublemousedowncheck';
        return g;
    };
    /*
      static linkVertexMouseDownButton(e: MouseDownEvent): void {
        const ref: IReference = ModelPiece.get(e) as IReference;
        U.pe(!(ref instanceof IReference), 'linkVertexButtons are currently only allowed on IReferences.');
        const edges: IEdge[] = ref.getEdges();
        U.pe(!edges, 'ref.edges === null', ref);
        let edge: IEdge;
        let index: number;
        if (ref.getModelRoot().isMM()) { edge = edges[index = 0]; } else
        if (ref.upperbound > 0 && edges.length >= ref.upperbound) { edge = edges[index = ref.upperbound - 1]; }
        else { edge = new IEdge(ref); index = edges.length - 1; }
        if (!edge) edge = new IEdge(ref);
        IVertex.linkVertexMouseDown(e, edge); }*/
    IVertex.linkVertexMouseDown = function (e, edge) {
        if (edge === void 0) { edge = null; }
        if (e) {
            e.stopPropagation();
        }
        if (IEdge.edgeChanging) {
            IEdge.edgeChanging.owner.edgeChangingAbort(e);
        }
        edge = edge ? edge : IEdge.get(e);
        U.pe(!edge, 'IVertex.linkVertexMouseDown() failed to get edge:', e);
        var logic = edge.logic;
        var classe = logic instanceof IClass ? logic : null;
        var ref = logic instanceof IReference ? logic : null;
        U.pe(!ref, 'The .LinkVertex element must be inserted only inside a reference field.');
        IEdge.edgeChanging = edge;
        edge.useRealEndVertex = false;
        edge.useMidNodes = true;
        edge.tmpEnd = GraphPoint.fromEvent(e);
        edge.tmpEndVertex = null;
        // edge.tmpEndVertex = ref.parent.getVertex();
        edge.refreshGui();
    };
    IVertex.getvertex = function (e) {
        return IVertex.getvertexByHtml(e.currentTarget);
    };
    IVertex.getvertexByHtml = function (node) {
        U.pe(!node || !(node instanceof Element), 'getVertexByHtml: parameter is not a DOM node:', node);
        while (!node.dataset.vertexID) {
            node = node.parentNode;
        }
        // console.log('getVertex by id:' + node.dataset.vertexID, 'all:', IVertex.all);
        return IVertex.getByID(+(node.dataset.vertexID));
    };
    IVertex.getByID = function (id) { return IVertex.all[id]; };
    IVertex.FieldNameChanged = function (e) {
        var html = e.currentTarget;
        var modelPiece = ModelPiece.getLogic(html);
        modelPiece.fieldChanged(e);
        modelPiece.getModelRoot().graph.propertyBar.show(null, html, null, true);
        // $(html).trigger('click'); // updates the propertyBar
        // const m: IModel = modelPiece.getModelRoot();
        var mm = Status.status.mm;
        var m = Status.status.m;
        setTimeout(function () { mm.refreshGUI(); m.refreshGUI(); }, 1);
    };
    IVertex.ChangePropertyBarContentClick = function (e, isEdge) {
        if (isEdge === void 0) { isEdge = null; }
        var html = e.target; // todo: approfondisci i vari tipi di classType (current, orginal...)
        var modelPiece = ModelPiece.getLogic(html);
        var model = modelPiece.getModelRoot();
        U.pe(!modelPiece, 'failed to get modelPiece from html:', html);
        var pbar = model.graph.propertyBar;
        pbar.show(modelPiece, html, isEdge, false);
        return modelPiece;
    };
    IVertex.GetMarkedWith = function (markKey, colorFilter) {
        if (colorFilter === void 0) { colorFilter = null; }
        var ret = [];
        for (var id in IVertex.all) {
            if (!IVertex.all[id]) {
                continue;
            }
            var vertex = IVertex.all[id];
            if (vertex.isMarkedWith('refhover', colorFilter)) {
                ret.push(vertex);
            }
        }
        return ret;
    };
    IVertex.prototype.mark = function (markb, key, color, radiusX, radiusY, width, backColor, extraOffset) {
        if (color === void 0) { color = 'red'; }
        if (radiusX === void 0) { radiusX = 10; }
        if (radiusY === void 0) { radiusY = 10; }
        if (width === void 0) { width = 5; }
        if (backColor === void 0) { backColor = 'none'; }
        if (extraOffset === void 0) { extraOffset = null; }
        if (!this.isDrawn()) {
            return;
        }
        if (color === null) {
            color = 'yellow';
        }
        if (radiusX === null) {
            radiusX = 10;
        }
        if (radiusY === null) {
            radiusY = 10;
        }
        if (backColor === null) {
            backColor = 'none';
        }
        if (width === null) {
            width = 5;
        }
        var mark = this.Vmarks[key];
        if (key === 'refhover') { // crosshair (+), alias (default+link), cell (excel)
            var vertexRoot = this.htmlForeign;
            var $inputs = $(vertexRoot).find('input, textarea, select, button');
            var cursor = null;
            console.log('markedHover', markb, vertexRoot, $inputs);
            if (markb) {
                vertexRoot.style.cursor = cursor = (color === 'red' ? 'no-drop' : 'crosshair'); // NO important, bugga e non setta il campo.
            }
            else {
                vertexRoot.style.removeProperty('cursor');
            }
            var i = void 0;
            for (i = 0; i < $inputs.length; i++) {
                if (!cursor) {
                    $inputs[i].style.removeProperty('cursor');
                }
                else {
                    $inputs[i].style.cursor = cursor;
                }
            }
        }
        // mark off
        if (!markb) { // se non deve essere marchiato
            if (mark) { // ma lo è attualmente
                if (mark.parentNode) {
                    mark.parentNode.removeChild(mark);
                }
                delete this.Vmarks[key];
            }
            return;
        }
        // mark on
        if (!extraOffset) {
            var same = 5;
            extraOffset = new GraphSize(same, same, same, same);
        }
        mark = this.Vmarks[key] = U.newSvg('rect');
        var size = this.getSize();
        // console.log('extraoffset:', extraOffset, 'size:', size);
        size.x -= extraOffset.x;
        size.y -= extraOffset.y;
        size.w += extraOffset.x + extraOffset.w;
        size.h += extraOffset.y + extraOffset.h;
        U.setSvgSize(mark, size, null);
        /*
        mark.setAttributeNS(null, 'x', '' + size.x);
        mark.setAttributeNS(null, 'y', '' + size.y);
        mark.setAttributeNS(null, 'width', '' + (size.w));
        mark.setAttributeNS(null, 'height', '' + (size.h));*/
        mark.setAttributeNS(null, 'rx', '' + (radiusX));
        mark.setAttributeNS(null, 'ry', '' + (radiusY));
        mark.setAttributeNS(null, 'stroke', '' + (color));
        mark.setAttributeNS(null, 'stroke-width', '' + (width));
        mark.setAttributeNS(null, 'fill', '' + (backColor));
        this.logic().getModelRoot().graph.vertexContainer.prepend(mark);
    };
    IVertex.prototype.getStartPoint = function (nextPt) {
        if (nextPt === void 0) { nextPt = null; }
        return this.getMidPoint(nextPt);
    };
    IVertex.prototype.getEndPoint = function (nextPt) {
        if (nextPt === void 0) { nextPt = null; }
        return this.getMidPoint(nextPt);
    };
    IVertex.prototype.getMidPoint = function (prevPt) {
        if (prevPt === void 0) { prevPt = null; }
        // NB: MAI fare sizeof() di un SVGForeignObjectElement, ridà valori sballati. fallo ai suoi childs.
        var html = this.getHtml();
        var $htmlEP = $(html).find('.EndPoint');
        var htmlEP;
        var endPointSize;
        var pt;
        if ($htmlEP.length === 0) {
            htmlEP = html;
        }
        else {
            htmlEP = $htmlEP[0];
        }
        endPointSize = U.sizeof(htmlEP);
        // console.log('htmlsize:', htmlSize, 'childSize:', U.sizeof(html.firstChild as HTMLElement));
        // console.log('real size(', htmlSize, ') vs graphSize(', this.toGraphCoordS(htmlSize), '), html:', html);
        var endPointGSize = this.owner.toGraphCoordS(endPointSize);
        var vertexGSize = this.getSize();
        pt = endPointGSize.tl();
        pt.x += endPointGSize.w / 2;
        pt.y += endPointGSize.h / 2;
        if (!prevPt) {
            return pt;
        }
        pt = GraphSize.closestIntersection(vertexGSize, prevPt, pt, this.owner.grid);
        U.pe(!U.isOnEdge(pt, vertexGSize), 'not on Vertex edge.');
        return pt;
    };
    IVertex.prototype.setSize = function (size, refreshVertex, refreshEdge) {
        if (refreshVertex === void 0) { refreshVertex = true; }
        if (refreshEdge === void 0) { refreshEdge = true; }
        if (!size)
            return;
        this.size = size;
        var htmlForeign = this.getHtmlRawForeign();
        U.setSvgSize(htmlForeign, this.size, IVertex.defaultSize);
        // todo: cerca tutti gli as string, non è un vero cast ma solo un cambiotipo senza trasformazione, crea errori.
        // const spostamento: GraphPoint = this.size.tl().subtract(oldSize.tl(), true);
        // todo: cambia struttura interna size in tl+br, controlla tutti i riferimenti a tl(newinstnce = false) e considera di cambiarli a true.
        if (refreshVertex) {
            this.refreshGUI();
        }
        if (!refreshEdge) {
            return;
        }
        var refEnd = this.edgesEnd; // this.getReferencesEnd();
        var refStart = this.edgesStart; // this.getReferencesStart();
        var i;
        for (i = 0; i < refEnd.length; i++) {
            if (refEnd[i]) {
                refEnd[i].refreshGui();
            }
        }
        for (i = 0; i < refStart.length; i++) {
            if (refStart[i]) {
                refStart[i].refreshGui();
            }
        }
    };
    IVertex.prototype.draw = function () {
        /*const htmlRaw: SVGForeignObjectElement = U.newSvg('foreignObject');
        htmlRaw.appendChild(this.classe.getStyleObj().html);*/
        var style = this.classe.getStyle();
        var htmlRaw = style.html;
        U.pe(!this.classe || !(htmlRaw instanceof Element), 'class null?', this, htmlRaw);
        this.setHtmls(this.classe, htmlRaw);
        if (this.classe instanceof IClass)
            this.drawC(this.classe, htmlRaw);
        if (this.classe instanceof EEnum)
            this.drawE(this.classe, htmlRaw);
        this.addEventListeners();
        U.fixHtmlSelected($(htmlRaw));
        this.autosize(false, false);
        Type.updateTypeSelectors($(this.getHtml()));
        var onrefresh = this.htmlForeign.getAttribute('onrefreshgui');
        var $htmlraw = $(htmlRaw);
        var i;
        var parenttmp = htmlRaw.parentNode;
        var next = htmlRaw.nextSibling;
        if (parenttmp)
            parenttmp.removeChild(htmlRaw);
        // duplicate id removal. TODO: non funziona, forse rileva ancora gli id del vecchio html generato e risultano già inseriti on refresh.
        /*const idarr = $htmlraw.find('[id]').addBack('[id]');
        for (i = 0; i < idarr.length; i++) {
          if (!document.getElementById(idarr[i].id)) { continue; }
          idarr[i].innerHTML = '';
          U.clearAttributes(idarr[i]);
          idarr[i].style.display = 'none';
        }*/
        var scripts = $htmlraw.find('script');
        for (i = 0; i < scripts.length; i++) {
            // clone the script, empty it while keeping (to keep same indexedPath structure as the template), execute id
            // todo: problema: tutti i successivi elementi con id statici verranno rimossi e avranno struttura template != struttura ongraph
            //  e falliranno a mostrare il clicked fragment nello styleeditor.
            // non va bene: se cambio lo stile quello script appeso al body rimane e devo aggiornare la pagina.
            // since newlines are replaced with spaces, scripts inline // comments are not allowed. use /*comments*/
            // const oldid = scripts[i].id;
            // delete scripts[i].id;
            //console.log('script:', scripts[i], 'length:', scripts[i].innerHTML.length, scripts[i].innerText.length);
            if (!scripts[i].innerHTML.length) {
                continue;
            } // "deleted" empty element
            var cloned = scripts[i];
            /*const cloned: HTMLScriptElement = U.cloneHtml(scripts[i]); bug: probably getbyid is working on detached elements too.
            it is altering the ViewRule.
            cloned.id = oldid;
            scripts[i].innerHTML = '';
            document.body.appendChild(cloned);*/
            console.log('eval:', cloned.innerHTML);
            try {
                eval(cloned.innerHTML);
            }
            catch (e) {
                U.pw(true, 'error in user script of "' + this.logic().printableName() + '":', e, 'script:', cloned);
            }
        }
        if (parenttmp) {
            if (next)
                parenttmp.insertBefore(htmlRaw, next);
            else
                parenttmp.appendChild(htmlRaw);
        }
        // console.log('onrefresh:', onrefresh, 'window.onrefresh:', window[onrefresh]);
        if (onrefresh) {
            window[onrefresh](this, this.logic(), htmlRaw);
        }
    };
    IVertex.prototype.autosize = function (refreshVertex, refreshEdge, debug) {
        if (refreshVertex === void 0) { refreshVertex = true; }
        if (refreshEdge === void 0) { refreshEdge = true; }
        if (debug === void 0) { debug = false; }
        var html = this.getHtml();
        var autosize = html.dataset.autosize;
        // console.log('autosize() ? ', modelPiece.html, ' dataset.autosize:', autosize);
        U.pe(autosize !== '1' && autosize !== 't' && autosize !== 'true', 'foreignObject:first-child must have data-autosize="true", and style {height: 100%;} required for now.' +
            ' html:', html, 'foreign:', this.htmlForeign);
        if (autosize !== '1' && autosize !== 't' && autosize !== 'true') {
            return this;
        }
        // console.log('autosize() started');
        if (html.style.height !== 'auto') {
            U.pw(true, 'To use autosize the root node must have "height: auto;", this has been automatically solved. was:' + html.style.height);
            html.style.height = 'auto';
        }
        // const zoomLevel: number = DetectZoom.device();
        var actualSize = this.owner.toGraphCoordS(U.sizeof(html));
        // const minSize: GraphSize = new GraphSize(null, null, 200, 30);
        actualSize.min(IVertex.minSize, false);
        U.pe(actualSize.h === 100, '', IVertex.minSize, actualSize, html);
        this.setSize(new GraphSize(this.size.x, this.size.y, actualSize.w, actualSize.h), refreshVertex, refreshEdge);
        return this;
    };
    IVertex.prototype.drawE_production = function (data, htmlRaw) { try {
        return this.drawE0(data, htmlRaw);
    }
    catch (e) { } };
    IVertex.prototype.drawC_production = function (data, htmlRaw) { try {
        return this.drawC0(data, htmlRaw);
    }
    catch (e) { } };
    IVertex.prototype.drawE = function (data, htmlRaw) { return this.drawE0(data, htmlRaw); };
    IVertex.prototype.drawC = function (data, htmlRaw) { return this.drawC0(data, htmlRaw); };
    IVertex.prototype.drawE0 = function (logic, htmlRaw) {
        var html = this.htmlForeign;
        /// append childrens:
        var $eContainer = $(html).find('.LiteralContainer');
        var i;
        for (i = 0; i < logic.childrens.length; i++) {
            var field = this.drawEChild(logic.childrens[i]);
            $eContainer.append(field);
        }
    };
    IVertex.prototype.drawC0 = function (data, htmlRaw) {
        // console.log('drawC()');
        var html = this.htmlForeign;
        /// append childrens:
        var $attContainer = $(html).find('.AttributeContainer');
        var $refContainer = $(html).find('.ReferenceContainer');
        var $opContainer = $(html).find('.OperationContainer');
        // U.pe($attContainer.length !== 1, 'there must be exactly one element with class "AttributeContainer".', $attContainer);
        // U.pe($refContainer.length !== 1, 'there must be exactly one element with class "ReferenceContainer".', $refContainer);
        // U.pe($opContainer.length !== 1, 'there must be exactly one element with class "OperationContainer".', $opContainer);
        // const attContainer = $attContainer[0];
        // const refContainer = $refContainer[0];
        // const opContainer = $opContainer[0];
        var i;
        for (i = 0; i < data.attributes.length; i++) {
            var field = this.drawA(data.attributes[i]);
            field.id = 'ID' + data.attributes[i].id;
            $attContainer.append(field);
        }
        for (i = 0; i < data.references.length; i++) {
            var field = this.drawR(data.references[i]);
            field.id = 'ID' + data.references[i].id;
            $refContainer.append(field);
        }
        var operations = data.getOperations();
        for (i = 0; i < operations.length; i++) {
            // console.log('append ref:', data.references[i]);
            var field = this.drawO(operations[i]);
            field.id = 'ID' + operations[i].id;
            $opContainer.append(field);
        }
    };
    IVertex.prototype.getStartPointHtml = function () {
        var html = this.getHtml();
        var $start = $(html).find('.StartPoint');
        if ($start.length > 0) {
            return $start[0];
        }
        else {
            return html;
        }
    };
    IVertex.prototype.getEndPointHtml = function () {
        var html = this.getHtml();
        var $start = $(html).find('.EndPoint');
        if ($start.length > 0) {
            return $start[0];
        }
        return (html.tagName.toLowerCase() === 'foreignobject') ? html.firstChild : html;
    };
    IVertex.prototype.setHtmls = function (data, htmlRaw) {
        // console.log('drawCV()');
        var graphHtml = this.owner.vertexContainer;
        var $graphHtml = $(graphHtml);
        if (graphHtml.contains(this.htmlForeign)) {
            graphHtml.removeChild(this.htmlForeign);
        }
        // console.log('drawing Vertex[' + data.name + '] with style:', htmlRaw, 'logic:', data);
        // console.log('drawVertex: template:', htmlRaw);
        var foreign = this.htmlForeign = U.textToSvg(U.replaceVars(data, htmlRaw, true).outerHTML);
        var $foreign = $(foreign);
        data.linkToLogic(foreign);
        var $elementWithID = $foreign.find('[id]');
        var i;
        // duplicate prevention.
        for (i = 0; i < $elementWithID.length; i++) {
            var elem = $elementWithID[i];
            var id = '#' + elem.id;
            var $duplicate = $graphHtml.find(id);
            if ($duplicate.length) {
                $foreign.remove(id);
            }
        }
        graphHtml.appendChild(foreign);
        foreign.id = 'ID' + data.id;
        foreign.dataset.vertexID = '' + this.id;
        // graphHtml.innerHTML += foreign.outerHTML;
        // unica soluzione: chiedi a stack e crea manualmente il foreignobject copiando tutti gli attributi.
        // graphHtml.appendChild<HTMLElement | SVGElement>(foreign); problema: non renderizza gli svg che non sono stati creati con document.createElementNS()
        // $(graphHtml).append(foreign.outerHTML); doesn't work either
        // console.log('this.style:', this.style);
        // console.log('this.size? (' + (!!this.size) + ': setSize() : ', U.getSvgSize(this.style));
        // console.log('drawC_Vertex. size:', this.size, data.html, this.size = U.getSvgSize(data.html as SVGForeignObjectElement));
        if (!this.size) {
            this.size = this.getSize();
        }
        else {
            this.setSize(this.size, false, false);
        }
        U.pe(this.htmlForeign.tagName.toLowerCase() !== 'foreignobject', 'The custom style root must be a foreignObject node.', this.htmlForeign);
        U.pe(this.htmlForeign.childNodes.length !== 1, 'The custom style must have a single child node,' +
            ' without spaces between <foreignObject> and the next tag. found ' + this.htmlForeign.childNodes.length + ' childrens.', this.htmlForeign, this.htmlForeign.childNodes);
        // this.html = this.htmlForeign.firstChild as HTMLElement;
        return foreign;
    };
    IVertex.prototype.drawO = function (data) {
        var _this = this;
        var html = this.drawTerminal(data);
        var $html = $(html);
        var $signature = $html.find('.specialjs.signature');
        var i;
        for (i = 0; i < $signature.length; i++) {
            var htmldataset = $signature[0];
            data.setSignatureHtml(htmldataset, ', ', +htmldataset.dataset.maxargumentchars, +htmldataset.dataset.maxarguments);
        }
        var $detailHtml = $html.find('.operationDetail');
        $signature.off('click.show').on('click.show', function (e) {
            var target = e.target;
            var avoidToggle;
            switch (target.tagName.toLowerCase()) {
                case 'input':
                case 'textarea':
                case 'select':
                    avoidToggle = true;
                    break;
                default:
                    avoidToggle = ((target instanceof HTMLElement) && target.isContentEditable);
                    break;
            }
            if (avoidToggle) {
                return;
            }
            data.detailIsOpened = !data.detailIsOpened;
            data.detailIsOpened ? $detailHtml.show() : $detailHtml.hide();
            _this.autosize(false, true);
        });
        data.detailIsOpened ? $detailHtml.show() : $detailHtml.hide();
        $html.find('input.name').val(data.name);
        var $parameterList = $detailHtml.find('.parameterList');
        var j;
        for (j = 0; j < $parameterList.length; j++) {
            var parameterList = $parameterList[j];
            // U.clear(parameterList);
            var lastChild = parameterList.childNodes[parameterList.childNodes.length - 1];
            for (i = 0; i < data.childrens.length; i++) {
                var field = this.drawParam(data.childrens[i]);
                parameterList.insertBefore(field, lastChild);
            }
            // for (i = oldChilds.length; i > 0; i--) { parameterList.prepend(oldChilds.item(i)); }
        }
        var $addParamButton = $html.find('.addParameterButton');
        // $addParamButton.html('<button style="width: 100%; height: 100%;">+</button>');
        $addParamButton.off('click.add').on('click.add', function (e) { data.addParameter(); _this.refreshGUI(); });
        return html;
    };
    IVertex.prototype.drawParam = function (data) {
        var i;
        var html = this.drawTerminal(data);
        var $html = $(html);
        // const $typeHtml: JQuery<HTMLSelectElement> = $html.find('select.fullType') as JQuery<HTMLSelectElement>;
        var $nameHtml = $html.find('input.name');
        $nameHtml.val(data.name);
        return html;
    };
    IVertex.prototype.drawEChild = function (data) { return this.drawTerminal(data); };
    IVertex.prototype.drawA = function (data) { return this.drawTerminal(data); };
    IVertex.prototype.drawR = function (data) { return this.drawTerminal(data); };
    IVertex.prototype.drawTerminal = function (data) {
        data.replaceVarsSetup();
        var style = data.getStyle();
        var htmlRaw = style.html;
        U.pe(!htmlRaw, 'failed to get attribute style:', data);
        // todo: sposta l'opearzione nei Graph.Field
        var html = U.replaceVars(data, htmlRaw, true);
        data.linkToLogic(html);
        return html;
    };
    IVertex.prototype.toEdge = function (start, end) {
        // todo
        U.pe(true, 'vertexToEdge() todo.');
        return null;
    };
    IVertex.prototype.addEventListeners = function () {
        var _this = this;
        // todo: viene chiamato 1 volta per ogni elementNode con modelID, ma io eseguo tutto dalla radice.
        // quindi viene eseguito N +1 volte per ogni vertice dove N sono i suoi (attributes + references)
        // console.log(html.tagName, html.dataset.modelPieceID);
        // if (html.tagName.toLowerCase() === 'foreignobject' && html.dataset.modelPieceID )
        //   { html = html.firstChild as HTMLElement | SVGElement; }
        // while (!(html.classList.contains('Vertex'))) { console.log(html); html = html.parentNode as HTMLElement | SVGElement; }
        var $html = $(this.getHtmlRawForeign());
        $html.off('mousedown.vertex').on('mousedown.vertex', function (e) { _this.onMouseDown(e); });
        $html.off('mouseup.vertex').on('mouseup.vertex', function (e) { _this.onMouseUp(e); });
        $html.off('mousemove.vertex').on('mousemove.vertex', function (e) { _this.onMouseMove(e); });
        $html.off('mouseenter.vertex').on('mouseenter.vertex', function (e) { _this.onMouseEnter(e); });
        $html.off('mouseleave.vertex').on('mouseleave.vertex', function (e) { _this.onMouseLeave(e); });
        $html.off('click').on('click', function (e) { _this.onClick(e); });
        // const $addFieldButtonContainer: JQuery<HTMLElement> = $html.find('.addFieldButtonContainer') as any as JQuery<HTMLElement>;
        // this.setAddButtonContainer($addFieldButtonContainer[0]);
        $html.find('.addFieldButton').off('click.addField').on('click.addField', function (e) { _this.addFieldClick(e); });
        $html.find('.AddFieldSelect').off('change.addField').on('change.addField', function (e) { _this.addFieldClick(e); });
        $html.find('input, select, textarea').off('change.fieldchange').on('change.fieldchange', function (e) { return IVertex.FieldNameChanged(e); });
        // NB: deve essere solo un off, oppure metti selettore .NOT(class) nel selettore dei 'select' di sopra
        // if (!IVertex.contextMenu) { IVertex.contextMenu = new MyContextMenuClass(new ContextMenuService()); }
        $html.off('contextmenu').on('contextmenu', function (e) { return _this.vertexContextMenu(e); });
        $html.find('.Attribute, .Reference').off('contextmenu').on('contextmenu', function (e) { return _this.featureContextMenu(e); });
        // $html.find('.LinkVertex').off('mousedown.setReference').on('mousedown.setReference', IVertex.linkVertexMouseDownButton);
        var defaultResizeConfig = {};
        var defaultDragConfig = {};
        // NB: do not delete the apparantly useless dynamic functions.
        // jqueryui is binding this to e.currentTarget and e.currentTarget to document.body, the dynamic function makes this instanceof iVertex again.
        defaultResizeConfig.create = function (e, ui) { return _this.measuringInit(ui, e); };
        defaultDragConfig.create = function (e, ui) { return _this.measuringInit(ui, e); };
        defaultResizeConfig.resize = function (e, ui) { return _this.measuringChanging(ui, e); };
        defaultDragConfig.drag = function (e, ui) { return _this.measuringChanging(ui, e); };
        defaultResizeConfig.stop = function (e, ui) { return _this.measuringChanged(ui, e); };
        defaultDragConfig.stop = function (e, ui) { return _this.measuringChanged(ui, e); };
        //     console.log('measurableElementSetup:', defaultResizeConfig, defaultDragConfig);
        U.measurableElementSetup($html, defaultResizeConfig, defaultDragConfig);
    };
    IVertex.prototype.measuringInit = function (ui, e) {
        var m = U.measurableGetArrays(null, e);
        console.log('measuringInit:', ui, e, m);
        var i;
        var size = U.sizeof(m.html);
        var absTargetSize = this.owner.getSize();
        var logic = this.logic();
        for (i = 0; i < m.variables.length; i++) {
            U.processMeasurableVariable(m.variables[i], logic, m.html, size, absTargetSize);
        }
        for (i = 0; i < m.dstyle.length; i++) {
            U.processMeasurableDstyle(m.dstyle[i], logic, m.html, null, absTargetSize);
        }
        for (i = 0; i < m.imports.length; i++) {
            U.processMeasurableImport(m.imports[i], logic, m.html, null, absTargetSize);
        }
    };
    IVertex.prototype.measuringChanging = function (ui, e, measurHtml) {
        if (measurHtml === void 0) { measurHtml = null; }
        var m = U.measurableGetArrays(measurHtml, e);
        console.log('Changing.measurableHtml parsed special attributes:', m);
        m.imports = [];
        m.chainFinal = [];
        // m.dstyle = [];
        // m.rules = [];
        // m.variables = [];
        U.processMeasuring(this.logic(), m, ui);
    };
    IVertex.prototype.measuringChanged = function (ui, e, measurHtml) {
        if (measurHtml === void 0) { measurHtml = null; }
        var m = U.measurableGetArrays(measurHtml, e);
        console.log('Changed.measurableHtml parsed special attributes:', m);
        m.chain = [];
        m.imports = [];
        U.processMeasuring(this.logic(), m, ui);
    };
    IVertex.prototype.clickSetReference = function (e, debug) {
        if (debug === void 0) { debug = true; }
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        var edge = IEdge.edgeChanging;
        if (!edge) {
            return;
        }
        U.pif(debug, 'setreferenceClick success!');
        var vertexLogic = this.logic();
        if (!(vertexLogic instanceof IClass))
            return;
        if (!edge.canBeLinkedTo(vertexLogic)) {
            U.pif(debug, 'edge ', edge.logic, 'cannot be linked to ', vertexLogic, 'hoveringvertex:', this);
            return;
        }
        if (edge.logic instanceof MReference)
            edge.logic.linkClass(vertexLogic, edge.getIndex(), true);
        if (edge.logic instanceof M2Reference)
            edge.logic.setType(vertexLogic.getEcoreTypeName());
        if (edge instanceof ExtEdge) {
            U.arrayRemoveAll(edge.logic.extends, edge.end.logic());
            U.ArrayAdd(edge.logic.extends, this.logic());
        }
        else {
            U.pe(true, 'cst: class edges are currently not supported');
        }
        this.mark(false, 'refhover');
        // altrimenti parte l'onClick su AddFieldButton quando fissi la reference.
        // setTimeout( () => { IEdge.edgeChanging = null; }, 1);
        IEdge.edgeChangingStopTime = Date.now();
        IEdge.edgeChanging = null;
        edge.tmpEnd = null;
        edge.useMidNodes = true;
        edge.useRealEndVertex = true;
        edge.end = this;
        edge.refreshGui();
    };
    IVertex.prototype.onClick = function (e) {
        IVertex.ChangePropertyBarContentClick(e);
    };
    IVertex.prototype.featureContextMenu = function (evt) {
        DamContextMenuComponent.contextMenu.show(new Point(evt.pageX, evt.pageY), '.Feature', evt.currentTarget);
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    };
    IVertex.prototype.vertexContextMenu = function (evt) {
        DamContextMenuComponent.contextMenu.show(new Point(evt.pageX, evt.pageY), '.Vertex', evt.currentTarget);
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    };
    IVertex.prototype.onMouseDown = function (e) {
        if (IEdge.edgeChanging) {
            this.clickSetReference(e);
            return;
        }
        var tmp = e.target;
        var thisHtml = this.getHtml();
        // i will not move the vertex while moving a measurable children.
        while (tmp !== thisHtml) {
            if (tmp.classList.contains('measurable')) {
                return;
            }
            tmp = tmp.parentElement;
        }
        IVertex.selected = this;
        if (IVertex.selectedGridWasOn.x === 'prevent_doublemousedowncheck') {
            IVertex.selectedGridWasOn.x = IVertex.selected.owner.grid.x;
        }
        if (IVertex.selectedGridWasOn.y === 'prevent_doublemousedowncheck') {
            IVertex.selectedGridWasOn.y = IVertex.selected.owner.grid.y;
        }
        IVertex.selected.owner.grid.x = null;
        IVertex.selected.owner.grid.y = null;
        IVertex.selectedStartPt = this.owner.toGraphCoord(new Point(e.pageX, e.pageY));
        IVertex.selectedStartPt.subtract(this.size.tl(), false);
    };
    IVertex.prototype.onMouseUp = function (e) {
        if (IEdge.edgeChanging) {
            this.clickSetReference(e);
            return;
        }
        var v = IVertex.selected;
        if (!v)
            return;
        v.owner.grid.x = IVertex.selectedGridWasOn.x;
        v.owner.grid.y = IVertex.selectedGridWasOn.y;
        IVertex.selectedGridWasOn.x = 'prevent_doublemousedowncheck';
        IVertex.selectedGridWasOn.y = 'prevent_doublemousedowncheck';
        this.owner.fitToGridS(v.size, false);
        this.setSize(this.size, false, true);
        IVertex.selected = null;
    };
    IVertex.prototype.onMouseMove = function (e) { };
    IVertex.prototype.onMouseEnter = function (e) { this.mouseEnterLinkPreview(e); };
    IVertex.prototype.onMouseLeave = function (e) { this.mouseLeaveLinkPreview(e); };
    IVertex.prototype.mouseEnterLinkPreview = function (e) {
        var edge = IEdge.edgeChanging;
        if (!edge) {
            return;
        }
        var ref = edge.logic;
        /*const edges: IEdge[] = ref.getEdges();
        U.pe(!edges, 'ref.edges === null', ref);
        let edge: IEdge;
        if (ref.upperbound > 0 && edges.length - 1 >= ref.upperbound) { edge = edges[edges.length - 1]; } else { edge = new IEdge(ref); }*/
        var html2 = e.currentTarget;
        // while (html2 && html2.classList && !html2.classList.contains('vertexShell')) { html2 = html2.parentNode as HTMLElement | SVGElement;}
        var hoveringTarget = html2 ? ModelPiece.getLogic(html2) : null;
        U.pe(!hoveringTarget || !(hoveringTarget instanceof IClassifier), 'the currentTarget should point to the vertex root, only classifier should be retrieved.', hoveringTarget, e, html2);
        var linkable = hoveringTarget instanceof IClass ? edge.canBeLinkedTo(hoveringTarget) : false;
        var size = hoveringTarget.getVertex().getSize();
        var width = 3;
        var pad = 5 + width;
        var padding = new GraphSize(pad, pad, pad, pad);
        var vertex = hoveringTarget.getVertex();
        // const oldHoverVertex: IVertex = window.oldEdgeLink_HoveringVertex;
        // if (oldHoverVertex) { vertex.mark(false, 'refhover'); }
        // window.oldEdgeLink_HoveringVertex = vertex;
        vertex.mark(true, 'refhover', linkable ? 'green' : 'red', (size.w + padding.x + padding.w) / 10, (size.h + padding.y + padding.h) / 10, width, null, padding);
        edge.tmpEndVertex = hoveringTarget.getVertex();
        // NB: serve farlo 2 volte, alla prima ripristina il targetEnd ma non corregge lo startingpoint adattandolo alla nuova destinazione.
        edge.refreshGui(null, false);
        edge.refreshGui(null, false);
    };
    IVertex.prototype.mouseLeaveLinkPreview = function (evt, debug) {
        if (debug === void 0) { debug = true; }
        if (!IEdge.edgeChanging) {
            return;
        }
        var edge = IEdge.edgeChanging;
        U.pif(debug, 'vertexLeave()');
        edge.tmpEndVertex = null;
        edge.tmpEnd = GraphPoint.fromEvent(evt);
        this.mark(false, 'refhover');
    };
    IVertex.prototype.addFieldClick = function (e) {
        // impedisco che un click mentre fisso un edge triggeri altre cose, 100ms di "cooldown"
        if (IEdge.edgeChanging || Date.now() - IEdge.edgeChangingStopTime < 100) {
            return;
        }
        var modelPiece = this.logic();
        var classe = modelPiece instanceof M2Class ? modelPiece : null;
        var enumm = modelPiece instanceof EEnum ? modelPiece : null;
        U.pe(!enumm && !classe, 'AddFieldClick should only be allowed on M2-Classes or enumerations.');
        U.pe(!this.classe, 'called addFieldClick on a package');
        Status.status.debug = true;
        var html = this.getHtml();
        var select;
        // const debugOldJson = U.cloneObj(modelPiece.generateModel());
        select = $(html).find('.AddFieldSelect')[0];
        switch (select.value.toLowerCase()) {
            default:
                U.pe(true, 'unexpected select value for addField:' + select.value + ' allowed values are: ["Reference", "Attribute", "Operation", "Literal"]');
                break;
            case 'reference':
                U.pe(!classe, '"Reference" as .AddFieldSelect value is only allowed on M2-classes');
                classe.addReference();
                break;
            case 'attribute':
                U.pe(!classe, '"Attribute" as .AddFieldSelect value is only allowed on M2-classes');
                classe.addAttribute();
                break;
            case 'operation':
                U.pe(!classe, '"Operation" as .AddFieldSelect value is only allowed on M2-classes');
                classe.addOperation();
                break;
            case 'literal':
                U.pe(!enumm, '"Literal" as .AddFieldSelect value is only allowed on Enumerations');
                enumm.addLiteral();
                break;
        }
    };
    /*
      setAddButtonContainer(container: HTMLElement): void {
        U.toHtml('<span style="display:flex; margin:auto;">Add&nbsp;</span>' +
          '<select class="AddFieldSelect" style="display:flex; margin:auto;"><optgroup label="FeatureType">' +
          '<option value="Attribute" selected="">Attribute</option>' +
          '<option value="Reference">Reference</option>' +
          '<option value="Operation">Operation</option>' +
          '</optgroup></select>' +
          '<span style="display:flex; margin:auto;">&nbsp;field</span>\n' +
          '<button>Go</button>', container); }
    */
    IVertex.prototype.setFields = function (f) {
        this.fields = f;
    };
    IVertex.prototype.setGraph = function (graph) {
        U.pe(!graph, 'Vertex should only be created after Graph initialization.');
        this.owner = graph;
    };
    IVertex.prototype.refreshGUI = function () { this.draw(); };
    IVertex.prototype.moveTo = function (graphPoint, gridIgnore) {
        if (gridIgnore === void 0) { gridIgnore = false; }
        // console.log('moveTo(', graphPoint, '), gridIgnore:', gridIgnore, ', grid:');
        var oldsize = this.size; // U.getSvgSize(this.logic().html as SVGForeignObjectElement);
        if (!gridIgnore) {
            graphPoint = this.owner.fitToGrid(graphPoint);
        }
        this.setSize(new GraphSize(graphPoint.x, graphPoint.y, oldsize.w, oldsize.h), false, true);
    };
    IVertex.prototype.logic = function (set) {
        if (set === void 0) { set = null; }
        if (set) {
            return this.classe = set;
        }
        return this.classe;
    };
    // todo: elimina differenze html e htmlforeign o almeno controlla e riorganizza
    IVertex.prototype.getHtmlRawForeign = function () { return this.htmlForeign; };
    IVertex.prototype.getHtml = function () { return this.htmlForeign.firstChild; };
    IVertex.prototype.minimize = function () {
        U.pe(true, 'minimize() to do.');
    };
    IVertex.prototype.isDrawn = function () { return !!(this.htmlForeign && this.htmlForeign.parentNode); };
    IVertex.prototype.pushDown = function () {
        if (!this.isDrawn()) {
            return;
        }
        var html = this.htmlForeign;
        var parent = html.parentNode;
        parent.removeChild(html);
        parent.appendChild(html);
    };
    IVertex.prototype.pushUp = function () {
        if (!this.isDrawn()) {
            return;
        }
        var html = this.htmlForeign;
        var parent = html.parentNode;
        parent.removeChild(html);
        parent.prepend(html);
    };
    IVertex.prototype.remove = function () {
        console.log('IVertex.delete();');
        var i;
        // for (i = 0; i < this.edgesStart.length; i++) {}
        var arr;
        arr = U.ArrayCopy(this.edgesStart, false);
        for (i = 0; i < arr.length; i++) {
            arr[i].remove();
        }
        arr = U.ArrayCopy(this.edgesEnd, false);
        for (i = 0; i < arr.length; i++) {
            arr[i].remove();
        }
        var html = this.htmlForeign;
        html.parentNode.removeChild(html);
        delete IVertex.all[this.id];
        for (var key in this.Vmarks) {
            if (this.Vmarks[key]) {
                continue;
            }
            var mark = this.Vmarks[key];
            if (mark.parentNode) {
                mark.parentNode.removeChild(mark);
            }
        }
        U.arrayRemoveAll(this.owner.vertex, this);
        this.classe.vertex = null;
        var fields = U.ArrayCopy(this.fields, false);
        for (i = 0; i < fields.length; i++) {
            fields[i].remove();
        }
        // gc helper
        this.owner = null;
        this.size = null;
        this.edgesStart = null;
        this.edgesEnd = null;
    };
    IVertex.prototype.getSize = function (debug) {
        if (debug === void 0) { debug = false; }
        var html0 = this.htmlForeign;
        var sizeOld;
        if (debug) {
            sizeOld = this.size ? this.size.duplicate() : null;
            if (this.size) {
                this.owner.markgS(this.size, true, 'blue');
            }
        }
        var size = this.size = U.getSvgSize(html0, IVertex.minSize);
        U.pe(debug && !sizeOld.equals(size), 'Wrong size. this:', this);
        return this.size;
    };
    /// end of IVertex
    IVertex.prototype.isMarkedWith = function (markKey, colorFilter) {
        if (colorFilter === void 0) { colorFilter = null; }
        if (!this.Vmarks.hasOwnProperty(markKey)) {
            return false;
        }
        if (!colorFilter) {
            return true;
        }
        var markRect = this.Vmarks[markKey];
        return (markRect.getAttributeNS(null, 'stroke') === colorFilter);
    };
    IVertex.all = {};
    IVertex.ID = 0;
    IVertex.selected = null;
    IVertex.selectedGridWasOn = IVertex.staticinit();
    IVertex.selectedStartPt = null;
    IVertex.oldEdgeLinkHoveringVertex = null;
    IVertex.minSize = new GraphSize(null, null, 200, 30);
    IVertex.defaultSize = new GraphSize(5, 5, 201, 41);
    return IVertex;
}());
export { IVertex };
//# sourceMappingURL=iVertex.js.map