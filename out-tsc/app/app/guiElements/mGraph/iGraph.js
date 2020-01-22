import { U, IEdge, IVertex, IModel, Status, Size, GraphPoint, GraphSize, PropertyBarr, ViewPoint, Point } from '../../common/Joiner';
var ViewPointShell = /** @class */ (function () {
    function ViewPointShell(g) {
        var _this = this;
        this.lastVP = null; // se ne sono attivi multipli e modifichi lo stile di qualcosa, questo sarà quello che viene aggiornato.
        this.getViewpointGUI = {};
        this.graph = g;
        this.model = g.model;
        this.$html = $(g.container.parentElement).find('.viewpointShell');
        this.html = this.$html[0];
        this.$template = this.$html.find('li.viewpointrow.template');
        this.template = this.$template[0];
        var $checkboxlidefault = this.$html.find('li.viewpointrow.default');
        var $defaultCheckbox = $checkboxlidefault.find('input[type="radio"]');
        this.defaultCheckbox = $defaultCheckbox[0];
        this.checkboxes = [];
        this.getViewpointGUI = {};
        var i;
        // this.ignoreEvents = false;
        $defaultCheckbox.on('click', function (e) { _this.undoAll(true); });
        $checkboxlidefault.find('button.duplicate').on('click', function (e) { return _this.duplicateEvent(e, null, _this.defaultCheckbox); });
    }
    /*undoAllOld(model :IModel): void {
      let i1: number;
      let i2: number;
      let i3: number;
      let i4: number;
      model.graph.gridDisplay = IGraph.defaultGridDisplay;
      model.graph.scroll = new GraphPoint(0, 0);
      model.graph.setZoom(IGraph.defaultZoom);
      model.graph.setGrid(IGraph.defaultGrid);
      const undostyle = (m: ModelPiece) => { m.resetViews(); };
      for (i1 = 0; i1 < model.childrens.length; i1++) {
        const pkg: IPackage = model.childrens[i1];
        undostyle(pkg);
        for (i2 = 0; i2 < pkg.childrens.length; i2++) {
          const c: IClass = pkg.childrens[i2];
          undostyle(c);
          c.shouldBeDisplayedAsEdge(false);
          for (i3 = 0; i3 < c.attributes.length; i3++) {
            const a: IAttribute = c.attributes[i3];
            undostyle(a); }
          for (i3 = 0; i3 < c.references.length; i3++) {
            const r: IReference = c.references[i3];
            undostyle(r); }
          const operations = c.getOperations();
          for (i3 = 0; i3 < operations.length; i3++) {
            const o: EOperation = operations[i3];
            undostyle(o);
            for (i4 = 0; i4 < o.childrens.length; i4++) {
              const p: EParameter = o.childrens[i4];
              undostyle(p); }
          }
        }
      }
      model.refreshGUI_Alone();
    }*/
    ViewPointShell.prototype.undoAll = function (changingGuiChecked) {
        var i;
        // de-apply all
        for (i = 0; i < this.model.viewpoints.length; i++) {
            this.model.viewpoints[i].detach();
        }
        // update gui
        this.ignoreEvents = true;
        if (changingGuiChecked) {
            for (i = 0; i < this.checkboxes.length; i++) {
                this.checkboxes[i].checked = false;
            }
            this.graph.model.refreshGUI_Alone();
        }
        var defaultradio = this.$html.find('input[type="radio"]')[0];
        defaultradio.checked = true;
        this.ignoreEvents = false;
    };
    ViewPointShell.prototype.refreshApplied = function () {
        // this.undoAll(false);
        var i;
        var stylecustomized = false;
        var makeSureAllCheckboxesAreProcessed = this.checkboxes.slice();
        for (i = this.model.viewpoints.length; --i >= 0;) {
            var vp = this.model.viewpoints[i];
            var checkbox = this.getCheckbox(vp);
            U.pe(!checkbox, 'failed to get checkbox of:', vp, this);
            U.arrayRemoveAll(makeSureAllCheckboxesAreProcessed, checkbox);
            stylecustomized = stylecustomized || checkbox.checked;
            if (vp.isApplied === checkbox.checked) {
                continue;
            }
            if (vp.isApplied) {
                vp.detach();
            }
            else {
                vp.apply();
            }
        } /*
        for (i = 0; i < makeSureAllCheckboxesAreProcessed.length; i++) {
          const cbox: HTMLInputElement = makeSureAllCheckboxesAreProcessed[i];
          const vp = ViewPoint.getbyID(+cbox.dataset.vpid);
          if (vp.isApplied === checkbox.checked) { continue; }
          if (vp.isApplied) { vp.detach(); } else { vp.apply(); }
        }*/
        U.pe(!!makeSureAllCheckboxesAreProcessed.length, 'Error: some checkbox are not yet processed.', makeSureAllCheckboxesAreProcessed, this);
        // U.pe(true, 'stopped here still works? 2');
        var defaultradio = this.$html.find('input[type="radio"]')[0];
        defaultradio.checked = !stylecustomized;
        this.updatelastvp();
        this.graph.model.refreshGUI_Alone();
        this.graph.propertyBar.refreshGUI();
    };
    ViewPointShell.prototype.duplicateEvent = function (e, oldvp, oldvpCheckbox, debug) {
        if (debug === void 0) { debug = false; }
        U.pif(debug, 'duplicate(' + (oldvp ? oldvp.name : null) + ') Start:', this.model.viewpoints);
        // const vp: ViewPoint = ViewPoint.get($input[0].value);
        var newvp = new ViewPoint(this.model, oldvp ? oldvp.name : null);
        if (oldvp) {
            newvp.clone(oldvp);
            newvp.updateTarget(this.model);
        }
        this.ignoreEvents = true;
        this.add(newvp, false);
        if (oldvpCheckbox) {
            oldvpCheckbox.checked = false;
        }
        this.ignoreEvents = false;
        this.refreshApplied();
        U.pif(debug, 'duplicate() End:', this.model.viewpoints);
    };
    ViewPointShell.prototype.add = function (v, allowApply) {
        var _this = this;
        var $li = this.$template.clone();
        var li = $li[0];
        var $checkbox = $li.find('input[type="checkbox"]');
        var checkbox = $checkbox[0];
        this.checkboxes.push(checkbox);
        this.getViewpointGUI[v.id] = li;
        var $input = $li.find('input.name');
        var input = $input[0];
        var $duplicate = $li.find('button.duplicate');
        var $delete = $li.find('button.remove');
        var $rename = $li.find('button.edit');
        $duplicate.on('click', function (e) { return _this.duplicateEvent(e, v, checkbox); });
        $delete.on('click', function (e) {
            _this.html.removeChild(li);
            U.arrayRemoveAll(_this.checkboxes, checkbox);
            delete _this.getViewpointGUI[v.id];
            v.delete();
        });
        $rename.on('click', function (e) {
            input.readOnly = false;
            input.focus();
            //
            //
            // $rename.hide(); $delete.hide(); $duplicate.hide();
        });
        var inputConfirm = function (confirm) {
            if (confirm === void 0) { confirm = true; }
            if (confirm) {
                v.setname(input.name);
            }
            input.value = v.name;
            input.readOnly = true;
            // $rename.show();
            // $delete.show();
            // $duplicate.show();
        };
        $input.on('keydown', function (e) { if (e.key === 'return') {
            inputConfirm(true);
        }
        else if (e.key === 'escape') {
            inputConfirm(false);
        } });
        $input.on('blur', function (e) { inputConfirm(false); });
        $input.on('click', function (e) {
            // todo: se non lo fa già di suo: (per triggerare default.click() = this.undoAll();
            // if (input.readOnly) { this.undoAll(true); }
        });
        checkbox.dataset.vpid = '' + v.id;
        input.value = v.name;
        checkbox.checked = v.isApplied;
        $checkbox.on('change', function (e) {
            if (_this.ignoreEvents) {
                e.preventDefault();
                return false;
            }
            _this.refreshApplied();
            return true;
        });
        if (allowApply && v.isApplied) {
            $checkbox.trigger('change');
        }
        li.classList.remove('template');
        this.html.appendChild(li);
    };
    ViewPointShell.prototype.updatelastvp = function () {
        this.$html.find('li[islastvp]').removeAttr('islastvp');
        var vp = this.model.getLastView();
        console.log('updatelastvp() ', this.model.viewpoints, this.getViewpointGUI, this);
        if (!vp)
            return;
        this.lastVP = vp;
        var li = this.getViewpointGUI[vp.id];
        li.setAttribute('islastvp', 'true');
    };
    ViewPointShell.prototype.getCheckbox = function (vp) {
        var i;
        for (i = 0; i < this.checkboxes.length; i++) {
            var cbox = this.checkboxes[i];
            if (cbox.dataset.vpid === '' + vp.id)
                return cbox;
        }
        return null;
    };
    return ViewPointShell;
}());
export { ViewPointShell };
var CursorAction;
(function (CursorAction) {
    CursorAction[CursorAction["drag"] = 0] = "drag";
    CursorAction[CursorAction["select"] = 1] = "select";
    CursorAction[CursorAction["multiselect"] = 2] = "multiselect";
})(CursorAction || (CursorAction = {}));
var IGraph = /** @class */ (function () {
    function IGraph(model, container) {
        this.id = null;
        this.container = null;
        this.model = null;
        this.vertex = null;
        this.edges = null;
        this.scroll = null;
        this.propertyBar = null;
        this.zoom = null;
        this.grid = null;
        this.gridDisplay = false && false;
        // campi per robe di debug
        this.allMarkgp = [];
        U.pe(!container, 'graph container is null. model:', model);
        this.id = IGraph.ID++;
        IGraph.all[this.id + ''] = this;
        this.model = model;
        this.model.graph = this;
        this.container = container;
        this.container.dataset.graphID = '' + this.id;
        this.edgeContainer = U.newSvg('g');
        this.edgeContainer.classList.add('allEdgeContainer');
        this.vertexContainer = U.newSvg('g');
        this.vertexContainer.classList.add('allVertexContainer');
        this.container.appendChild(this.edgeContainer);
        this.container.appendChild(this.vertexContainer);
        this.gridDefsHtml = $(this.container).find('g.gridContainer>defs')[0];
        this.gridHtml = $(this.container).find('g.gridContainer>rect.grid')[0];
        this.gridHtml.setAttributeNS(null, 'fill', 'url(#grid_' + this.id + ')');
        this.isMoving = null;
        this.clickedScroll = null;
        this.cursorAction = CursorAction.select;
        // this.svg = $(this.container).find('svg.graph')[0] as unknown as SVGElement;
        this.vertex = [];
        this.edges = [];
        this.zoom = new Point(1, 1);
        this.scroll = new GraphPoint(0, 0);
        this.grid = new GraphPoint(20, 20);
        this.gridPos = new Point(0, 0);
        this.gridDisplay = true;
        var i;
        var j;
        var earr = this.model.getAllEnums();
        for (i = 0; i < earr.length; i++) {
            earr[i].generateVertex();
        }
        var classArr = this.model.getAllClasses();
        var classEdges = [];
        for (i = 0; i < classArr.length; i++) {
            if (classArr[i].shouldBeDisplayedAsEdge()) {
                classEdges.push(classArr[i]);
                continue;
            }
            classArr[i].generateVertex();
        }
        // vertex disegnati, ora disegno gli edges.
        // Class-extends-edges
        if (this.model.isM2()) {
            for (i = 0; i < classArr.length; i++) {
                var classe = classArr[i];
                for (j = 0; j < classe.extends.length; j++) {
                    U.ArrayAdd(this.edges, classe.makeExtendEdge(classe.extends[j]));
                }
            }
        }
        // Class-edges
        for (i = 0; i < classEdges.length; i++) {
            U.ArrayMerge(this.edges, classEdges[i].generateEdge());
        }
        // Reference-edges
        var arrReferences = this.model.getAllReferences();
        for (i = 0; i < arrReferences.length; i++) {
            U.ArrayMerge(this.edges, arrReferences[i].generateEdges());
        }
        this.propertyBar = new PropertyBarr(this.model);
        this.viewPointShell = new ViewPointShell(this);
        this.addGraphEventListeners();
        this.ShowGrid();
    }
    IGraph.getByID = function (id) { return IGraph.all[id]; };
    IGraph.getByHtml = function (html) {
        for (var id in IGraph.all) {
            if (!IGraph.all.hasOwnProperty(id)) {
                continue;
            }
            var graph = IGraph.all[id];
            if (U.isParentOf(graph.container, html)) {
                return graph;
            }
        }
        U.pe(true, 'failed to find parent graph of:', html);
        return null;
    };
    IGraph.prototype.fitToGrid = function (pt0, clone, debug, fitHorizontal, fitVertical) {
        if (clone === void 0) { clone = true; }
        if (debug === void 0) { debug = false; }
        if (fitHorizontal === void 0) { fitHorizontal = true; }
        if (fitVertical === void 0) { fitVertical = true; }
        var pt = clone ? pt0.clone() : pt0;
        U.pe(!this.grid, 'grid not initialized.');
        if (fitHorizontal && !isNaN(this.grid.x) && this.grid.x > 0) {
            pt.x = Math.round(pt.x / this.grid.x) * this.grid.x;
        }
        if (fitVertical && !isNaN(this.grid.y) && this.grid.y > 0) {
            pt.y = Math.round(pt.y / this.grid.y) * this.grid.y;
        }
        U.pif(debug, 'fitToGrid(', pt0, '); this.grid:', this.grid, ' = ', pt);
        return pt;
    };
    IGraph.prototype.fitToGridS = function (pt0, clone, debug, fitHorizontal, fitVertical) {
        if (clone === void 0) { clone = true; }
        if (debug === void 0) { debug = false; }
        if (fitHorizontal === void 0) { fitHorizontal = true; }
        if (fitVertical === void 0) { fitVertical = true; }
        var pt = clone ? pt0.duplicate() : pt0;
        U.pe(!this.grid, 'grid not initialized.');
        if (fitHorizontal && !isNaN(this.grid.x) && this.grid.x > 0) {
            pt.x = Math.round(pt.x / this.grid.x) * this.grid.x;
        }
        if (fitVertical && !isNaN(this.grid.y) && this.grid.y > 0) {
            pt.y = Math.round(pt.y / this.grid.y) * this.grid.y;
        }
        U.pif(debug, 'fitToGrid(', pt0, '); this.grid:', this.grid, ' = ', pt);
        return pt;
    };
    IGraph.prototype.addGraphEventListeners = function () {
        var _this = this;
        var $graph = $(this.container);
        var thiss = this;
        this.model.linkToLogic(this.container);
        $graph.off('mousedown.graph').on('mousedown.graph', function (evt) { thiss.onMouseDown(evt); });
        $graph.off('mouseup.graph').on('mouseup.graph', function (evt) { thiss.onMouseUp(evt); });
        $graph.off('mousemove.graph').on('mousemove.graph', function (evt) { thiss.onMouseMove(evt); });
        // $graph.off('keydown.graph').on('keydown.graph', (evt: KeyDownEvent) => { thiss.onKeyDown(evt); }); non triggerabile, non ha focus.
        // $graph.off('click.mark').on('click.mark', (e: ClickEvent) => { thiss.markClick(e, true); } );
        $graph.off('mousedown.move').on('mousedown.move', function (e) {
            switch (_this.cursorAction) {
                default: U.pe(true, 'unexpected cursorAction:', _this.cursorAction);
                case CursorAction.drag:
                case CursorAction.select:
                    var mp = IVertex.ChangePropertyBarContentClick(e);
                    if (mp instanceof IModel) {
                        _this.isMoving = Point.fromEvent(e);
                        _this.clickedScroll = _this.scroll.clone();
                    }
                    break;
                case CursorAction.multiselect: break;
            }
        });
        $graph.off('mouseup.move').on('mouseup.move', function (e) {
            if (_this.isMoving) {
                _this.isMoving = _this.clickedScroll = null;
            }
        });
        // @ts-ignore
        if (!!ResizeObserver) { // not supported by edge, android firefox.
            if (!window['' + 'resizeobservers'])
                window['' + 'resizeobservers'] = [];
            // @ts-ignore
            var tmp = new ResizeObserver(function (entryes, observer) { _this.onResize(); });
            window['' + 'resizeobservers'] = tmp;
            tmp.observe(this.container.parentElement);
        }
        // @ts-ignore
        if (!ResizeObserver) {
            var oldSize_1 = null;
            setInterval(function () {
                U.pif(true, 'setinterval graphsize checker');
                var size = _this.getSize();
                if (!size.equals(oldSize_1))
                    _this.onResize(size);
            }, 100);
        }
        // altre opzioni:
        // 1) MutationObserver (detect dom changes (attributes like "style" too)),
        // 2) http://marcj.github.io/css-element-queries/ : sembra simile a mutationObserver, no timers, funziona su flexbox che non cambiano
        // direttamente valori. non ho capito perchè parsa tutti i file css.
        // 3) "Use a combination of mousedown, mousemove and/or mouseup to tell whether the div is being / has been resized.
        // If you want really fine-grained control you can check in every mousemove event how much / if the div has been resized. If you don't need that,
        // you can simply not use mousemove at all and just measure the div in mousedown and mouseup and figure out if it was resized in the latter."
        // PROBLEMA: potrebbe avvenire un resize dovuto a serverEvents, keyboardEvents, timers.
    };
    IGraph.prototype.onMouseDown = function (evt) { };
    IGraph.prototype.onMouseUp = function (evt) { };
    IGraph.prototype.onMouseMoveSetReference = function (evt, edge) {
        // console.log('graph.movereference()', edge, edge ? edge.tmpEndVertex : null);
        if (!edge || edge.tmpEndVertex) {
            return;
        }
        // const ref: IReference | IClass = edge.logic;
        edge.tmpEnd = GraphPoint.fromEvent(evt);
        // console.log('graph.movereference: success!', edge.tmpEnd);
        edge.refreshGui(null, false);
    };
    IGraph.prototype.onMouseMoveVertexMove = function (evt, v) {
        if (!v) {
            return;
        }
        var currentMousePos = new Point(evt.pageX, evt.pageY);
        // console.log('evt:', evt);
        var currentGraphCoord = this.toGraphCoord(currentMousePos);
        currentGraphCoord = currentGraphCoord.subtract(IVertex.selectedStartPt, false);
        v.moveTo(currentGraphCoord);
    };
    IGraph.prototype.onMouseMoveDrag = function (e) {
        if (!this.isMoving)
            return;
        var offset = Point.fromEvent(e);
        offset.subtract(this.isMoving, false);
        this.scroll.x = this.clickedScroll.x - offset.x;
        this.scroll.y = this.clickedScroll.y - offset.y;
        this.setGridPos();
        // console.log('scroll:', this.scroll, 'offset:', offset, ' scroll0: ', this.clickedScroll, ' currentCursor:', this.isMoving);
        this.updateViewbox();
    };
    IGraph.prototype.edgeChangingAbort = function (e) {
        var edge = IEdge.edgeChanging;
        if (!edge) {
            return;
        }
        IEdge.edgeChanging = null;
        // unmark hovering vertex
        var hoveringVertex = IVertex.GetMarkedWith('refhover');
        var i;
        U.pw(hoveringVertex.length > 1, 'hovering on more than one target at the same time should be impossible.', hoveringVertex);
        for (i = 0; i < hoveringVertex.length; i++) {
            hoveringVertex[i].mark(false, 'refhover');
        }
        // restore previous endTarget or delete edge.
        if (!edge.end) {
            edge.remove();
            return;
        }
        edge.useMidNodes = true;
        edge.useRealEndVertex = true;
        edge.tmpEnd = null;
        edge.refreshGui();
    };
    IGraph.prototype.onMouseMove = function (evt) {
        if (IEdge.edgeChanging)
            return this.onMouseMoveSetReference(evt, IEdge.edgeChanging);
        if (IVertex.selected)
            return this.onMouseMoveVertexMove(evt, IVertex.selected);
        if (this.isMoving)
            return this.onMouseMoveDrag(evt);
    };
    IGraph.prototype.toGraphCoordS = function (s) {
        var tl = this.toGraphCoord(new Point(s.x, s.y));
        var br = this.toGraphCoord(new Point(s.x + s.w, s.y + s.h));
        var ret = new GraphSize(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
        return ret;
    };
    IGraph.prototype.computeSize = function () { this.size = U.sizeof(this.container); };
    IGraph.prototype.getSize = function () {
        if (!this.size)
            this.computeSize();
        return this.size;
    };
    IGraph.prototype.toGraphCoord = function (p) {
        var graphSize = this.getSize();
        var ret = new GraphPoint(p.x, p.y);
        var debug = true;
        ret.x -= graphSize.x;
        ret.y -= graphSize.y;
        ret.x += this.scroll.x;
        ret.y += this.scroll.y;
        ret.x /= this.zoom.x;
        ret.y /= this.zoom.y;
        // console.log('toGraph()  - graphSize:', graphSize, ' + scroll: ', this.scroll, ' / zoom', this.zoom);
        if (debug) {
            var ver = this.toHtmlCoord(ret);
            U.pe(ver.x !== p.x || ver.y !== p.y, 'error in toGraphCoord or toHtmlCoord: inputPt:', p, ', result: ', ret, 'verify:', ver, 'point:', p, 'scroll:', this.scroll, 'zoom:', this.zoom, 'GraphHtmlSize:', graphSize);
        }
        return ret;
    };
    IGraph.prototype.toHtmlCoordS = function (s) {
        if (s === null) {
            return null;
        }
        var tl = this.toHtmlCoord(new GraphPoint(s.x, s.y));
        var br = this.toHtmlCoord(new GraphPoint(s.x + s.w, s.y + s.h));
        return new Size(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    };
    IGraph.prototype.toHtmlCoord = function (p) {
        var graphSize = this.getSize();
        var ret = new Point(p.x, p.y);
        // console.log('toHtml()', ' * zoom', this.zoom, ' - scroll: ', this.scroll, ' + graphSize:', graphSize);
        ret.x *= this.zoom.x;
        ret.y *= this.zoom.y;
        ret.x -= this.scroll.x;
        ret.y -= this.scroll.y;
        ret.x += graphSize.x;
        ret.y += graphSize.y;
        return ret;
    };
    IGraph.prototype.getAllVertexIsBroke = function () { return this.vertex; };
    IGraph.prototype.markClick = function (e, clean) {
        if (clean === void 0) { clean = true; }
        return this.mark(new Point(e.pageX, e.pageY), clean);
    };
    IGraph.prototype.markg = function (gp, clean, colorTop) {
        if (clean === void 0) { clean = false; }
        if (colorTop === void 0) { colorTop = 'red'; }
        return this.mark(this.toHtmlCoord(gp), clean, colorTop);
    };
    IGraph.prototype.markgS = function (gs, clean, colorTop, colorBot) {
        if (clean === void 0) { clean = false; }
        if (colorTop === void 0) { colorTop = 'red'; }
        if (colorBot === void 0) { colorBot = null; }
        /*if (!colorBot) { colorBot = colorTop; }
        this.markg(gs.tl(), clean, colorTop);
        this.markg(gs.tr(), false, colorTop);
        this.markg(gs.bl(), false, colorBot);
        this.markg(gs.br(), false, colorBot);*/
        // const htmls: Size = this.owner.toHtmlCoordS(size0);
        return this.markS(this.toHtmlCoordS(gs), clean, colorTop, colorBot);
    };
    IGraph.prototype.markS = function (s, clean, colorTop, colorBot) {
        if (clean === void 0) { clean = false; }
        if (colorTop === void 0) { colorTop = 'red'; }
        if (colorBot === void 0) { colorBot = null; }
        if (!colorBot) {
            colorBot = colorTop;
        }
        U.pe(!s, 'size cannot be null.');
        this.mark(s.tl(), clean, colorTop);
        // color = 'white';
        this.mark(s.tr(), false, colorTop);
        // color = 'purple';
        this.mark(s.bl(), false, colorBot);
        // color = 'orange';
        this.mark(s.br(), false, colorBot);
    };
    IGraph.prototype.mark = function (p, clean, color) {
        if (clean === void 0) { clean = false; }
        if (color === void 0) { color = 'red'; }
        var gp = this.toGraphCoord(p);
        if (clean) {
            var i = void 0;
            for (i = 0; i < this.allMarkgp.length; i++) {
                var node = this.allMarkgp[i];
                if (this.container.contains(node)) {
                    this.container.removeChild(node);
                }
            }
            for (i = 0; i < IGraph.allMarkp.length; i++) {
                var node = IGraph.allMarkp[i];
                if (document.body.contains(node)) {
                    document.body.removeChild(node);
                }
            }
        }
        // console.log('mark:', p, gp);
        this.markp = U.toHtml('<div style="width:10px; height:10px; top:' + (p.y - 5) + 'px; left:' + (p.x - 5) + 'px;' +
            ' position: absolute; border: 1px solid ' + color + '; z-index:1;">');
        this.markgp = U.newSvg('circle');
        this.markgp.setAttribute('cx', '' + gp.x);
        this.markgp.setAttribute('cy', '' + gp.y);
        this.markgp.setAttribute('r', '' + 1);
        this.markgp.setAttribute('stroke', color);
        this.allMarkgp.push(this.markgp);
        IGraph.allMarkp.push(this.markp);
        document.body.appendChild(this.markp);
        this.container.appendChild(this.markgp);
    };
    IGraph.prototype.setZoom = function (x, y) {
        var oldZoom = this.zoom.clone();
        y = x;
        this.zoom.x = !U.isNumber(x) || x === 0 ? this.zoom.x : +x;
        this.zoom.y = !U.isNumber(y) || y === 0 ? this.zoom.y : +y;
        console.log('zoomOld:', oldZoom, 'x:', x, 'y:', y, ' zoom:', this.zoom);
        this.updateViewbox();
    };
    IGraph.prototype.onResize = function (currSize) {
        if (currSize === void 0) { currSize = null; }
        if (currSize)
            this.size = currSize;
        else
            this.computeSize();
        this.updateViewbox();
    };
    IGraph.prototype.updateViewbox = function () {
        var vbox = U.getViewBox(this.container);
        vbox.w = this.size.w / this.zoom.x;
        vbox.h = this.size.h / this.zoom.y;
        vbox.x = this.scroll.x;
        vbox.y = this.scroll.y;
        U.setViewBox(this.container, vbox);
    };
    IGraph.prototype.setGridPos = function () {
        var biggerSquareX = this.grid.x * 10;
        var biggerSquareY = this.grid.y * 10;
        var safetySquares = 1;
        this.gridHtml.setAttributeNS(null, 'x', '' + ((this.scroll.x - this.scroll.x % biggerSquareX) - biggerSquareX * safetySquares));
        this.gridHtml.setAttributeNS(null, 'y', '' + ((this.scroll.y - this.scroll.y % biggerSquareY) - biggerSquareY * safetySquares));
        var size = this.getSize();
        this.gridHtml.setAttributeNS(null, 'width', ((size.w + biggerSquareX * safetySquares * 2) / this.zoom.x) + '');
        this.gridHtml.setAttributeNS(null, 'height', ((size.h + biggerSquareY * safetySquares * 2) / this.zoom.y) + '');
    };
    IGraph.prototype.ShowGrid = function (checked) {
        if (checked === void 0) { checked = null; }
        var graph = (this.model === Status.status.mm ? Status.status.mm.graph : Status.status.m.graph);
        if (checked === null) {
            checked = graph.gridDisplay;
        }
        if (this.model === Status.status.mm) {
            graph.gridDisplay = checked;
        }
        else {
            graph.gridDisplay = checked;
        }
        var x = isNaN(this.grid.x) || this.grid.x <= 0 ? 10000 : this.grid.x;
        var y = isNaN(this.grid.y) || this.grid.y <= 0 ? 10000 : this.grid.y;
        this.gridDefsHtml.innerHTML =
            '<pattern id="smallGrid_' + this.id + '" width="' + x + '" height="' + y + '" patternUnits="userSpaceOnUse">\n' +
                '  <path d="M ' + x + ' 0 L 0 0 0 ' + y + '" fill="none" stroke="gray" stroke-width="0.5"/>\n' +
                '</pattern>\n' +
                '<pattern id="grid_' + this.id + '" width="' + (x * 10) + '" height="' + (y * 10) + '" patternUnits="userSpaceOnUse">\n' +
                '  <rect width="' + (x * 10) + '" height="' + (y * 10) + '" fill="url(#smallGrid_' + this.id + ')"/>\n' +
                '  <path d="M ' + (x * 10) + ' 0 L 0 0 0 ' + (y * 10) + '" fill="none" stroke="gray" stroke-width="1"/>\n' +
                '</pattern>';
        this.setGridPos();
        // $grid[0].setAttributeNS(null, 'justForRefreshingIt', 'true');
        // $grid.x
        if (checked) {
            $(this.gridHtml).show();
        }
        else {
            $(this.gridHtml).hide();
        }
    };
    IGraph.prototype.addVertex = function (v) {
        v.owner = this;
        U.ArrayAdd(this.vertex, v);
        // todo: aggiungi edges tra i vertici. in matrix edgeMatrix[vertex][vertex] = edge
    };
    // todo: this.vertex non è mai aggiornato reealmente.
    IGraph.all = {};
    IGraph.ID = 0;
    IGraph.allMarkp = []; // campo per robe di debug
    IGraph.defaultGridDisplay = true;
    IGraph.defaultGrid = new GraphPoint(20, 20);
    IGraph.defaultZoom = new Point(1, 1);
    return IGraph;
}());
export { IGraph };
//# sourceMappingURL=iGraph.js.map