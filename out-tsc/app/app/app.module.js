import * as tslib_1 from "tslib";
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { MminputComponent } from './guiElements/mminput/mminput.component';
import { MmsidebarComponent } from './guiElements/mmsidebar/mmsidebar.component';
import { MsidebarComponent } from './guiElements/msidebar/msidebar.component';
import { IsidebarComponent } from './guiElements/isidebar/isidebar.component';
import { TopBar, TopBarComponent } from './guiElements/top-bar/top-bar.component';
import { GraphTabHtmlComponent } from './guiElements/graph-tab-html/graph-tab-html.component';
import { MmGraphHtmlComponent } from './guiElements/mm-graph-html/mm-graph-html.component';
import { IGraph, IModel, MetaModel, Model, ModelPiece, ISidebar, U, DetectZoom, M2Class, 
//Options,
MyConsole, MetaMetaModel, ShortAttribETypes, ECoreRoot, M3Class, MClass, IClass, Typedd, EOperation, MPackage, M2Reference, M2Package, M2Attribute, IPackage, M3Package, M3Attribute, EParameter, IAttribute, MReference, IReference, M3Reference, MAttribute, Type, LocalStorage, ViewPoint, SaveListEntry, EType, IClassifier, GraphSize, ELiteral, EEnum } from './common/Joiner';
import { PropertyBarrComponent } from './guiElements/property-barr/property-barr.component';
import { MGraphHtmlComponent } from './guiElements/m-graph-html/m-graph-html.component';
import { DamContextMenuComponent } from './guiElements/dam-context-menu/dam-context-menu.component';
import { StyleEditorComponent } from './guiElements/style-editor/style-editor.component';
import { ConsoleComponent } from './guiElements/console/console.component';
// @ts-ignore
// @ts-ignore
// @ts-ignore
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib_1.__decorate([
        NgModule({
            declarations: [
                AppComponent,
                MminputComponent,
                MmsidebarComponent,
                MsidebarComponent,
                IsidebarComponent,
                TopBarComponent,
                GraphTabHtmlComponent,
                MmGraphHtmlComponent,
                PropertyBarrComponent,
                MGraphHtmlComponent,
                DamContextMenuComponent,
                StyleEditorComponent,
                TopBarComponent,
                ConsoleComponent,
            ],
            imports: [
                BrowserModule,
                BrowserAnimationsModule,
                MatTabsModule
            ],
            providers: [],
            bootstrap: [
                AppComponent,
                MminputComponent,
                DamContextMenuComponent,
                TopBarComponent,
                ConsoleComponent,
                GraphTabHtmlComponent
            ],
            // aggiunto da me
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
var Status = /** @class */ (function () {
    // modelMatTab: MatTabGroup = null;
    /*showMMGrid = true;
    showMGrid = true;
    mmGrid = new GraphPoint(20, 20);
    mGrid = new GraphPoint(20, 20);*/
    function Status() {
        this.mm = null;
        this.m = null;
        this.typeAliasDictionary = {};
        this.aliasTypeDictionary = {};
        this.debug = false;
        this.loadedLogic = false;
        this.loadedGUI = false;
        this.XMLinlineMarker = '' + '@';
        // todo: consenti di customizzare il marker, (in m3options?)
        this.refreshModeAll = true || true;
        this.refreshModelAndInstances = false && false;
        this.refreshModelAndParent = false && false;
        this.refreshInstancesToo = false && false;
        this.refreshModel = false && false;
        this.refreshMetaParentToo = false && false;
        this.refreshParentToo = false && false;
    }
    Status.prototype.save = function () {
        return 'TO DO: SERIALIZE';
    };
    Status.prototype.getActiveModel = function () {
        // if (Status.status.modelMatTab) { if (Status.status.modelMatTab.selectedIndex === 0) { return this.mm; } else { return this.m; } }
        if ($('.UtabHeader.main[data-target="1"][selected="true"]').length === 1) {
            return Status.status.mm;
        }
        if ($('.UtabHeader.main[data-target="2"][selected="true"]').length === 1) {
            return Status.status.m;
        }
        U.pe(true, 'modello attivo non trovato.');
        return null;
    };
    Status.prototype.isM = function () { return this.getActiveModel() === this.m; };
    Status.prototype.isMM = function () { return this.getActiveModel() === this.mm; };
    Status.prototype.enableAutosave = function (timer) {
        var _this = this;
        $(window).off('beforeunload.unload_autosave').on('beforeunload.unload_autosave', function () { _this.autosave(); });
        localStorage.setItem('autosave', 'true');
        setInterval(function () { _this.autosave(); }, timer);
    };
    Status.prototype.autosave = function () {
        this.mm.save(true, null);
        this.m.save(true, null);
        console.log('autosave completed.');
    };
    Status.status = null;
    return Status;
}());
export { Status };
export function main0(loadEvent, tentativi) {
    if (tentativi === void 0) { tentativi = 0; }
    // EcoreLayer.test2(); return;
    Status.status = new Status();
    window.global = window;
    window.global.Buffer = window.global.Buffer || require('buffer').Buffer;
    if (document.getElementById('MM_INPUT') === null) {
        if (tentativi++ >= 10) {
            U.pe(true, 'failed to load MM_INPUT');
        }
        setTimeout(function () { return main0(null, tentativi); }, 100);
        console.log('main0 wait(100)');
        return;
    } // else { mainForceTabChange(0); }
    // U.loadScript('./app/common/jquery-ui-1.12.1/jquery-ui.js');
    // U.loadScript('./app/common/jquery-ui-1.12.1/jquery-ui.structure.js');
    U.loadScript('https://code.jquery.com/ui/1.12.1/jquery-ui.min.js');
    main();
    // console.log('main(), $ loaded:', $ !== undefined, 'status: ', Status.status);
}
/*function mainForceTabChange(tentativi: number = 0) {
  let retry = false;
  if (!Status.status.modelMatTab) {
    Status.status.modelMatTab = GraphTabHtmlComponent.matTabModel;
    retry = true;
    if (tentativi++ >= 10) { U.pe(true, 'failed to change tab (not initialized)', Status.status); }}
  if (Status.status.modelMatTab && Status.status.modelMatTab.selectedIndex === 1) {
    Status.status.modelMatTab.selectedIndex = 0;
    if (tentativi++ >= 10) { U.pe(true, 'failed to change tab (changeindex)'); }
    retry = true; }
  if (retry) {
    setTimeout(() => mainForceTabChange(tentativi), 100);
  } else { main(); }
}*/
var M2InputXml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<ecore:EPackage xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
    '    xmlns:ecore="http://www.eclipse.org/emf/2002/Ecore" name="pkg" nsURI="http://www.pkg.uri.com" nsPrefix="pkg.prefix">\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="player">\n' +
    '   <eStructuralFeatures xsi:type="ecore:EAttribute" name="name"' +
    '       eType="ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EChar"/>\n' +
    '  </eClassifiers>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="league">\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="playerlist" eType="#//player"/>\n' +
    '  </eClassifiers>\n' +
    '</ecore:EPackage>\n';
function globalevents() {
    // Prevent the backspace key from navigating back.
    var $document = $(document);
    $document.unbind('keydown').bind('keydown', U.preventBackSlashHistoryNavigation);
    $document.on('keydown', function (e) {
        console.log('documentKeyDown: ', e.key, e.keyCode);
        if (e.key === 'Escape') {
            Status.status.getActiveModel().graph.edgeChangingAbort(e);
        }
    });
    window['' + 'U'] = U;
    window['' + 'ModelPiece'] = ModelPiece;
    window['' + 'IModel'] = IModel;
    window['' + 'Status'] = Status;
    window['' + 'M3Model'] = MetaMetaModel;
    window['' + 'M2Model'] = MetaModel;
    window['' + 'MModel'] = Model;
    window['' + 'IPackage'] = IPackage;
    window['' + 'M3Package'] = M3Package;
    window['' + 'M2Package'] = M2Package;
    window['' + 'MPackage'] = MPackage;
    window['' + 'Enum'] = EEnum;
    window['' + 'ELiteral'] = ELiteral;
    window['' + 'IClassifier'] = IClass;
    window['' + 'IClass'] = IClass;
    window['' + 'M3Class'] = M3Class;
    window['' + 'M2Class'] = M2Class;
    window['' + 'MClass'] = MClass;
    window['' + 'Typedd'] = Typedd;
    window['' + 'EOperation'] = EOperation;
    window['' + 'EParameter'] = EParameter;
    window['' + 'IReference'] = IReference;
    window['' + 'M3Reference'] = M3Reference;
    window['' + 'M2Reference'] = M2Reference;
    window['' + 'MReference'] = MReference;
    window['' + 'IAttribute'] = IAttribute;
    window['' + 'M3Attribute'] = M3Attribute;
    window['' + 'M2Attribute'] = M2Attribute;
    window['' + 'MAttribute'] = MAttribute;
    window['' + 'help'] = [
        'setBackup (backup <= saveToDB)',
        'backupSave (saveToDB <= backup)',
        'destroy (the backup)',
        'discardSave (stop autosave)'
    ];
    window['' + 'destroy'] = function () {
        localStorage.setItem('m1_' + SaveListEntry.model.lastopened, null);
        localStorage.setItem('m2_' + SaveListEntry.model.lastopened, null);
        localStorage.setItem('m1_' + SaveListEntry.view.lastopened, null);
        localStorage.setItem('m2_' + SaveListEntry.view.lastopened, null);
        localStorage.setItem('m1_' + SaveListEntry.vertexPos.lastopened, null);
        localStorage.setItem('m2_' + SaveListEntry.vertexPos.lastopened, null);
        localStorage.setItem('backupMM', null);
        localStorage.setItem('backupGUI', null);
        localStorage.setItem('backupM', null);
        localStorage.setItem('autosave', 'false');
    };
    window['' + 'discardSave'] = function () {
        localStorage.setItem('autosave', 'false');
        $(window).off('beforeunload.unload_autosave');
        window.location.href += '';
    };
    window['' + 'backupSave'] = function () {
        window['' + 'discardSave']();
        window['' + 'backupSaveMM']();
        window['' + 'backupSaveM']();
        window['' + 'backupSaveGUI']();
    };
    window['' + 'backupSaveGUI'] = function () { localStorage.setItem('modelGraphSave_GUI_Damiano', localStorage.getItem('backupGUI')); };
    window['' + 'backupSaveMM'] = function () { localStorage.setItem('LastOpenedMM', localStorage.getItem('backupMM')); };
    window['' + 'backupSaveM'] = function () { localStorage.setItem('LastOpenedM', localStorage.getItem('backupM')); };
    window['' + 'setBackup'] = function () { window['' + 'setBackupM'](); window['' + 'setBackupMM'](); window['' + 'setBackupGUI'](); };
    window['' + 'setBackupGUI'] = function () { localStorage.setItem('backupGUI', localStorage.getItem('modelGraphSave_GUI_Damiano')); };
    window['' + 'setBackupMM'] = function () { localStorage.setItem('backupMM', localStorage.getItem('LastOpenedMM')); };
    window['' + 'setBackupM'] = function () { localStorage.setItem('backupM', localStorage.getItem('LastOpenedM')); };
}
function main() {
    window.U = U;
    window.status = Status.status;
    U.tabSetup();
    $('app-mm-graph-html .propertyBarContainer .UtabHeader').on('click', function (e) {
        if (e.currentTarget.innerText === 'Style') {
            Status.status.mm.graph.propertyBar.styleEditor.onShow();
        }
        else if (e.currentTarget.innerText === 'Structured') {
            Status.status.mm.graph.propertyBar.onShow();
        }
        else if (e.currentTarget.innerText === 'Raw') {
            Status.status.mm.graph.propertyBar.onShow(true);
        }
        else {
            U.pe(true, 'unrecognized right-side tab:', e.currentTarget);
        }
    });
    $('app-m-graph-html .propertyBarContainer .UtabHeader').on('click', function (e) {
        if (e.currentTarget.innerText === 'Style') {
            Status.status.m.graph.propertyBar.styleEditor.onShow();
        }
        else if (e.currentTarget.innerText === 'Structured') {
            Status.status.m.graph.propertyBar.onShow();
        }
        else if (e.currentTarget.innerText === 'Raw') {
            Status.status.m.graph.propertyBar.onShow(true);
        }
        else {
            U.pe(true, 'unrecognized right-side tab:', e.currentTarget);
        }
    });
    U.resizableBorderSetup();
    ECoreRoot.initializeAllECoreEnums();
    globalevents();
    var mmconsole = new MyConsole($('.mmconsole')[0]);
    var mconsole = new MyConsole($('.mconsole')[0]);
    var tmp;
    var useless;
    var i;
    U.pw((tmp = +DetectZoom.device()) !== 1, 'Current zoom level is different from 100%.', 'The graph part of this website may be graphically misplaced due to a bug with Svg\'s <foreignObject> content.', 'current zoom:' + (+tmp * 100) + '%', 'The bug happens in: Chrome.', 'The bug does NOT happen in: Firefox.', 'Behaviour is unknown for other browsers.');
    Status.status.typeAliasDictionary[ShortAttribETypes.void] = 'void';
    Status.status.typeAliasDictionary[ShortAttribETypes.EChar] = 'char';
    Status.status.typeAliasDictionary[ShortAttribETypes.EString] = 'string';
    Status.status.typeAliasDictionary[ShortAttribETypes.EDate] = 'date';
    Status.status.typeAliasDictionary[ShortAttribETypes.EFloat] = 'float';
    Status.status.typeAliasDictionary[ShortAttribETypes.EDouble] = 'double';
    Status.status.typeAliasDictionary[ShortAttribETypes.EBoolean] = 'bool';
    Status.status.typeAliasDictionary[ShortAttribETypes.EByte] = 'byte';
    Status.status.typeAliasDictionary[ShortAttribETypes.EShort] = 'short';
    Status.status.typeAliasDictionary[ShortAttribETypes.EInt] = 'int';
    Status.status.typeAliasDictionary[ShortAttribETypes.ELong] = 'long';
    /*
    Status.status.typeAliasDictionary[ShortAttribETypes.ECharObj] = 'ECharObj';
    Status.status.typeAliasDictionary[ShortAttribETypes.EStringObj] = 'EStringObj';
    Status.status.typeAliasDictionary[ShortAttribETypes.EDateObj] = 'EDateObj';
    Status.status.typeAliasDictionary[ShortAttribETypes.EFloatObj] = 'EFloatObj';
    Status.status.typeAliasDictionary[ShortAttribETypes.EDoubleObj] = 'EDoubleObj';
    Status.status.typeAliasDictionary[ShortAttribETypes.EByteObj] = 'EByteObj';
    Status.status.typeAliasDictionary[ShortAttribETypes.EShortObj] = 'EShortObj';
    Status.status.typeAliasDictionary[ShortAttribETypes.EIntObj] = 'EIntObj';
    Status.status.typeAliasDictionary[ShortAttribETypes.ELongObj] = 'ELongObj';
    Status.status.typeAliasDictionary[ShortAttribETypes.EELIST] = 'EELIST';*/
    EType.staticInit();
    DamContextMenuComponent.staticInit();
    var savem2 = LocalStorage.getLastOpened(2);
    var savem1 = LocalStorage.getLastOpened(1);
    /*let MetaMetaModelStr = MetaMetaModel.emptyMetaMetaModel;
    let MetaModelinputStr = MetaModel.emptyModel;
    let ModelinputStr = Model.emptyModel;*/
    var validate = function (thing, defaultvalue) { return tmp && tmp !== '' && tmp !== 'null' && tmp !== 'undefined' ? thing : defaultvalue; };
    savem2.model = validate(savem2.model, MetaModel.emptyModel);
    savem1.model = validate(savem1.model, Model.emptyModel);
    console.log('loading MM:', savem2);
    console.log('loading M:', savem1);
    Status.status.mmm = new MetaMetaModel(null);
    useless = new TopBar();
    try {
        Status.status.mm = new MetaModel(JSON.parse(savem2.model), Status.status.mmm);
    }
    catch (e) {
        U.pw(true, 'Failed to load the metamodel.');
        console.log(e);
        Status.status.mm = new MetaModel(JSON.parse(MetaModel.emptyModel), Status.status.mmm);
    }
    // console.log('m3:', Status.status.mmm, 'm2:', Status.status.mm, 'm1:', Status.status.m); return;
    Type.linkAll();
    M2Class.updateSuperClasses();
    try {
        Status.status.m = new Model(JSON.parse(savem1.model), Status.status.mm);
    }
    catch (e) {
        U.pw(true, 'Failed to load the model. Does it conform to the metamodel?');
        console.log(e);
        Status.status.m = new Model(JSON.parse(Model.emptyModel), Status.status.mm);
    }
    console.log('m3:', Status.status.mmm, 'm2:', Status.status.mm, 'm1:', Status.status.m);
    // Status.status.m.LinkToMetaParent(Status.status.mm);
    // Status.status.m.fixReferences(); already linked at parse time.
    Status.status.loadedLogic = true;
    useless = new ISidebar(Status.status.mmm, document.getElementById('metamodel_sidebar'));
    useless = new ISidebar(Status.status.mm, document.getElementById('model_sidebar'));
    useless = new IGraph(Status.status.mm, document.getElementById('metamodel_editor'));
    useless = new IGraph(Status.status.m, document.getElementById('model_editor'));
    Status.status.loadedGUI = true;
    Status.status.mm.graph.propertyBar.show(Status.status.mm, null, null);
    Status.status.m.graph.propertyBar.show(Status.status.m, null, null);
    Type.updateTypeSelectors(null, true, true, true);
    if (!savem2.vertexpos || !savem2.view) {
        var tmpp = Status.status.mm.storage.getViewPoints();
        savem2.view = savem2.view || tmpp.view;
        savem2.vertexpos = savem2.vertexpos || tmpp.vertexPos;
    }
    if (!savem1.vertexpos || !savem1.view) {
        var tmpp = Status.status.m.storage.getViewPoints();
        savem1.view = savem1.view || tmpp.view;
        savem1.vertexpos = savem1.vertexpos || tmpp.vertexPos;
    }
    savem2.view = validate(savem2.view, '[]');
    savem2.vertexpos = validate(savem2.vertexpos, '{}');
    savem1.view = validate(savem1.view, '[]');
    savem1.vertexpos = validate(savem1.vertexpos, '{}');
    var marr = [Status.status.mm, Status.status.m];
    var vpmatjson = [JSON.parse(savem2.view || '[]'), JSON.parse(savem1.view || '[]')];
    var vertexposMat = [JSON.parse(savem2.vertexpos), JSON.parse(savem1.vertexpos)];
    // console.log(vpmatjson, Status.status.mm.graph.viewPointShell);
    var j;
    for (j = 0; j < vertexposMat.length; j++) {
        var vdic = vertexposMat[j];
        var m = marr[j];
        for (var key in vdic) {
            console.log('key:', key, 'varr:', vdic);
            var mp = ModelPiece.getByKeyStr(key);
            var size = new GraphSize().clone(vdic[key]);
            U.pw(!mp || !(mp instanceof IClassifier), 'invalid vertexposition save, failed to get classifier:', key, vdic);
            if (!mp || !(mp instanceof IClassifier)) {
                U.cclear();
                console.log(mp, 'key', key, 'vdic', vdic);
                continue;
            }
            mp.getVertex().setSize(size);
        }
    }
    for (j = 0; j < vpmatjson.length; j++) {
        var vparr = vpmatjson[j];
        var m = marr[j];
        var v = void 0;
        for (i = 0; i < vparr.length; i++) {
            var jsonvp = vparr[i];
            // console.clear();
            // console.log('looping this:', jsonvp, ', vpmatjson:', vpmatjson);
            v = new ViewPoint(m);
            v.clone(jsonvp);
            v.updateTarget(m);
            m.graph.viewPointShell.add(v, false); // [persistent isApplied] STEP 1: qui setto checked sulla gui in base al v.isApplied salvato.
            v.isApplied = false; // STEP 2: qui affermo che non è stato ancora applicato
        }
        if (vparr.length === 0) {
            v = new ViewPoint(m); // m.getPrefix() + '_VP autogenerated');
            v.isApplied = true;
            m.graph.viewPointShell.add(v, false); // [persistent isApplied] STEP 1: qui setto checked sulla gui in base al v.isApplied salvato.
            v.isApplied = false;
        }
        m.graph.viewPointShell.refreshApplied(); // STEP 3: qui vedo che non è stato applicato, ma è stato ordinato dalla gui di applicarlo -> lo applico.
    }
    setTimeout(function () { Status.status.mm.graph.ShowGrid(); Status.status.m.graph.ShowGrid(); }, 1);
    // Imposto un autosave raramente (minuti) giusto nel caso di crash improvvisi o disconnessioni
    // per evitare di perdere oltre X minuti di lavoro.
    // In condizioni normali non è necessario perchè il salvataggio è effettuato al cambio di pagina asincronamente
    // e con consegna dei dati garantita dal browser anche a pagina chiusa (navigator.beacon)
    return;
    Status.status.enableAutosave(2 * 60 * 1000);
    //Options.enableAutosave(2 * 60 * 1000);
    // Options.Load(Status.status);
}
window['' + 'main'] = main0;
document.addEventListener('DOMContentLoaded', main0);
//# sourceMappingURL=app.module.js.map