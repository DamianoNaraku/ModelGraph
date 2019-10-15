import { BrowserModule, Meta } from '@angular/platform-browser';
import { MatTabGroup, MatTabsModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { AppComponent } from './app.component';
import { MminputComponent } from './guiElements/mminput/mminput.component';
import { MmsidebarComponent } from './guiElements/mmsidebar/mmsidebar.component';
import { MsidebarComponent } from './guiElements/msidebar/msidebar.component';
import { IsidebarComponent} from './guiElements/isidebar/isidebar.component';
import { TopBar, TopBarComponent } from './guiElements/top-bar/top-bar.component';
import { GraphTabHtmlComponent } from './guiElements/graph-tab-html/graph-tab-html.component';
import { MmGraphHtmlComponent } from './guiElements/mm-graph-html/mm-graph-html.component';
import {
  IGraph,
  IModel,
  MetaModel,
  Model,
  ModelPiece,
  ISidebar,
  Json,
  U,
  DetectZoom,
  Dictionary,
  M2Class,
  GraphPoint, Options, MyConsole, EType, MetaMetaModel, ShortAttribETypes, ECoreRoot
} from './common/Joiner';
import { PropertyBarrComponent } from './guiElements/property-barr/property-barr.component';
import { MGraphHtmlComponent } from './guiElements/m-graph-html/m-graph-html.component';
import { DamContextMenuComponent } from './guiElements/dam-context-menu/dam-context-menu.component';
import { StyleEditorComponent } from './guiElements/style-editor/style-editor.component';
import { ConsoleComponent } from './guiElements/console/console.component';
import KeyDownEvent = JQuery.KeyDownEvent;
import {saveEntries} from './Database/LocalStorage';
// @ts-ignore
// @ts-ignore
// @ts-ignore
@NgModule({
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
    /*BrowserAnimationsModule*/
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
    GraphTabHtmlComponent], // todo: devi aggiungere qua ogni componente html (vengono caricati prima dei ts?)
  // aggiunto da me
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
export class Status {
  static status: Status = null;
  mmm: MetaMetaModel;
  mm: MetaModel = null;
  m: Model = null;
  typeAliasDictionary: Dictionary<ShortAttribETypes, string> = {};
  aliasTypeDictionary: Dictionary<string, ShortAttribETypes> = {};
  debug = false;
  loadedLogic = false;
  loadedGUI = false;
  XMLinlineMarker: string = '' + '@';
  // todo: consenti di customizzare il marker, (in m3options?)

  refreshModeAll: boolean = true || true;
  refreshModelAndInstances: boolean = false && false;
  refreshModelAndParent: boolean = false && false;
  refreshInstancesToo: boolean = false && false;
  refreshModel: boolean = false && false;
  refreshMetaParentToo: boolean = false && false;
  refreshParentToo: boolean = false && false;
  // modelMatTab: MatTabGroup = null;
  /*showMMGrid = true;
  showMGrid = true;
  mmGrid = new GraphPoint(20, 20);
  mGrid = new GraphPoint(20, 20);*/

  constructor() { }
  save(): string {
    return 'TO DO: SERIALIZE'; }
  getActiveModel(): IModel {
    // if (Status.status.modelMatTab) { if (Status.status.modelMatTab.selectedIndex === 0) { return this.mm; } else { return this.m; } }
    if ($('.UtabHeader.main[data-target="1"][selected="true"]').length === 1) { return Status.status.mm; }
    if ($('.UtabHeader.main[data-target="2"][selected="true"]').length === 1) { return Status.status.m; }
    U.pe(true, 'modello attivo non trovato.');
    return null;
  }

  isM(): boolean {return this.getActiveModel() === this.m; }
  isMM(): boolean {return this.getActiveModel() === this.mm; }
}


function main0(tentativi: number = 0) {
  // EcoreLayer.test2(); return;
  Status.status = new Status();
  (window as any).global = window;
  (window as any).global.Buffer = (window as any).global.Buffer || require('buffer').Buffer;
  if (document.getElementById('MM_INPUT') === null) {
    if (tentativi++ >= 10)  { U.pe(true, 'failed to load MM_INPUT'); }
    setTimeout(() => main0(tentativi), 100);
    console.log('main0 wait(100)');
    return;
  }// else { mainForceTabChange(0); }

  // U.loadScript('./app/common/jquery-ui-1.12.1/jquery-ui.js');
  // U.loadScript('./app/common/jquery-ui-1.12.1/jquery-ui.structure.js');
  U.loadScript('https://code.jquery.com/ui/1.12.1/jquery-ui.min.js');
  main();
  console.log('main(), $ loaded:', $ !== undefined, 'status: ', status);
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

const M2InputXml: string = '<?xml version="1.0" encoding="UTF-8"?>\n' +
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

function globalevents(): void {
  // Prevent the backspace key from navigating back.
  const $document = $(document);
  $document.unbind('keydown').bind('keydown', U.preventBackSlashHistoryNavigation);
  $document.on('keydown', (e: KeyDownEvent): void  => {
    console.log('documentKeyDown: ', e.key, e.keyCode);
    if (e.key === 'Escape') { Status.status.getActiveModel().graph.edgeChangingAbort(e); }
  });
  window['' + 'help'] = [
    'setBackup (backup <= save)',
    'backupSave (save <= backup)',
    'destroy (the backup)',
    'discardSave (stop autosave)'];
  window['' + 'destroy'] = () => {
    localStorage.setItem('m1_' + saveEntries.lastOpened, null);
    localStorage.setItem('m2_' + saveEntries.lastOpened, null);
    localStorage.setItem('backupMM', null);
    localStorage.setItem('backupGUI', null);
    localStorage.setItem('backupM', null);
    localStorage.setItem('autosave', 'false');
  };
  window['' + 'discardSave'] = () => {
    localStorage.setItem('autosave', 'false');
    $(window).off('beforeunload.unload_autosave');
    window.location.href += ''; };
  window['' + 'backupSave'] = () => {
    window['' + 'discardSave']();
    window['' + 'backupSaveMM']();
    window['' + 'backupSaveM']();
    window['' + 'backupSaveGUI'](); };
  window['' + 'backupSaveGUI'] = () => { localStorage.setItem('modelGraphSave_GUI_Damiano', localStorage.getItem('backupGUI')); };
  window['' + 'backupSaveMM'] = () => { localStorage.setItem('LastOpenedMM', localStorage.getItem('backupMM')); };
  window['' + 'backupSaveM'] = () => { localStorage.setItem('LastOpenedM', localStorage.getItem('backupM')); };
  window['' + 'setBackup'] = () => { window['' + 'setBackupM'](); window['' + 'setBackupMM'](); window['' + 'setBackupGUI'](); };
  window['' + 'setBackupGUI'] = () => { localStorage.setItem('backupGUI', localStorage.getItem('modelGraphSave_GUI_Damiano')); };
  window['' + 'setBackupMM'] = () => { localStorage.setItem('backupMM', localStorage.getItem('LastOpenedMM')); };
  window['' + 'setBackupM'] = () => { localStorage.setItem('backupM', localStorage.getItem('LastOpenedM')); };
}

function main() {
  (window as any).U = U;
  (window as any).status = Status.status;
  U.tabSetup();
  U.resizableBorderSetup();
  ECoreRoot.initializeAllECoreEnums();
  globalevents();
  const mmconsole: MyConsole = new MyConsole($('.mmconsole')[0]);
  const mconsole: MyConsole = new MyConsole($('.mconsole')[0]);

  let tmp: any;
  let useless;
  U.pw((tmp = +DetectZoom.device()) !== 1, 'Current zoom level is different from 100%.',
    'The graph part of this website may be graphically misplaced due to a bug with Svg\'s <foreignObject> content.',
    'current zoom:' + (+tmp * 100) + '%',
    'The bug happens in: Chrome.',
    'The bug does NOT happen in: Firefox.',
    'Behaviour is unknown for other browsers.');
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

  tmp = localStorage.getItem('m2_' + saveEntries.lastOpened);
  if (tmp && tmp !== '' && tmp !== 'null' && tmp !== 'undefined') { MetaModelinputStr = tmp; }

  tmp = localStorage.getItem('m1_' + saveEntries.lastOpened);
  if (tmp && tmp !== '' && tmp !== 'null' && tmp !== 'undefined') { ModelInputStr = tmp; }

  console.log('loading MMM:', MetaMetaModelStr);
  console.log('loading MM:', MetaModelinputStr);
  console.log('loading M:', ModelInputStr);
  // inputStr = atob(inputStr);
  Status.status.mmm = new MetaMetaModel(null);
  useless = new TopBar();
  Status.status.mm = new MetaModel(JSON.parse(MetaModelinputStr), Status.status.mmm);
  Status.status.mm.fixReferences();
  Status.status.m = new Model(JSON.parse(ModelInputStr), Status.status.mm);
  console.log('m3:', Status.status.mmm, 'm2:', Status.status.mm, 'm1:', Status.status.m);
  // Status.status.m.LinkToMetaParent(Status.status.mm);
  Status.status.m.fixReferences();
  Status.status.loadedLogic = true;
  useless = new ISidebar(Status.status.mmm, document.getElementById('metamodel_sidebar'));
  useless = new ISidebar(Status.status.mm, document.getElementById('model_sidebar'));
  useless = new IGraph(Status.status.mm, document.getElementById('metamodel_editor'));
  useless = new IGraph(Status.status.m, document.getElementById('model_editor'));
  Status.status.loadedGUI = true;
  Status.status.mm.graph.propertyBar.show(Status.status.mm, false);
  Status.status.m.graph.propertyBar.show(Status.status.m, false);
  M2Class.updateAllMMClassSelectors();
  EType.fixPrimitiveTypeSelectors();
  // M2Class.updateAllMClassSelectors();
  // Imposto un autosave raramente (minuti) giusto nel caso di crash improvvisi o disconnessioni
  // per evitare di perdere oltre X minuti di lavoro.
  // In condizioni normali non è necessario perchè il salvataggio è effettuato al cambio di pagina asincronamente
  // e con consegna dei dati garantita dal browser anche a pagina chiusa (navigator.beacon)
  Options.enableAutosave(2 * 60 * 1000);
  // Options.Load(Status.status);

}
main0();
const inputStrJsonMMM: string = '{\n' +
  '  "ecore:EPackage": {\n' +
  '    "@xmlns:xmi": "http://www.omg.org/XMI",\n' +
  '    "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",\n' +
  '    "@xmlns:ecore": "http://www.eclipse.org/emf/2002/Ecore",\n' +
  '    "@xmi:version": "2.0",\n' +
  '    "@name": "eCore MMM",\n' +
  '    "@nsURI": "http://???",\n' +
  '    "@nsPrefix": "org.???",\n' +
  '    "eClassifiers": [\n' +
  '      {\n' +
  '        "@xsi:type": "ecore:EClass",\n' +
  '        "@name": "Class",\n' +
  '        "eStructuralFeatures": {\n' +
//  '          "@xsi:type": "ecore:FakeElement",\n' +
//  '          "@name": "Add Feature.",\n' +
//  '          "@eType": "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//FakeElement"\n' +
  '        }\n' +
  '      },\n' +
  '      {\n' +
  '        "@xsi:type": "ecore:EClass",\n' +
  '        "@name": "Package",\n' +
  '        "eStructuralFeatures": {\n' +
//  '          "@xsi:type": "ecore:FakeElement",\n' +
//  '          "@name": "Add Feature.",\n' +
//  '          "@eType": "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//FakeElement"\n' +
  '        }\n' +
  '      }\n' +
  '    ]\n' +
  '  }\n' +
  '}';
const inputStrJsonMM: string = '{\n' +
  '  "ecore:EPackage": {\n' +
  '    "@xmlns:xmi": "http://www.omg.org/XMI",\n' +
  '    "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",\n' +
  '    "@xmlns:ecore": "http://www.eclipse.org/emf/2002/Ecore",\n' +
  '    "@xmi:version": "2.0",\n' +
  '    "@name": "bowling",\n' +
  '    "@nsURI": "http://org/eclipse/example/bowling",\n' +
  '    "@nsPrefix": "org.eclipse.example.bowling",\n' +
  '    "eClassifiers": [\n' +
  '      {\n' +
  '        "@xsi:type": "ecore:EClass",\n' +
  '        "@name": "Player",\n' +
  '        "eStructuralFeatures": {\n' +
  '          "@xsi:type": "ecore:EAttribute",\n' +
  '          "@name": "name",\n' +
  '          "@eType": "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EString"\n' +
  '        }\n' +
  '      },\n' +
  '      {\n' +
  '        "@xsi:type": "ecore:EClass",\n' +
  '        "@name": "League",\n' +
  '        "eStructuralFeatures": [\n' +
  '          {\n' +
  '            "@xsi:type": "ecore:EAttribute",\n' +
  '            "@name": "name",\n' +
  '            "@eType": "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EString"\n' +
  '          },\n' +
  '          {\n' +
  '            "@xsi:type": "ecore:EReference",\n' +
  '            "@name": "players",\n' +
  '            "@upperBound": "@1",\n' +
  '            "@eType": "#//Player",\n' +
  '            "@containment": "true"\n' +
  '          }\n' +
  '        ]\n' +
  '      }\n' +
  '    ]\n' +
  '  }\n' +
  '}';
const inputStrJsonMOLD = '{\n' +
  '  "ecore:EPackage": {\n' +
  '    "@xmlns:xmi": "http://www.omg.org/XMI",\n' +
  '    "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",\n' +
  '    "@xmlns:ecore": "http://www.eclipse.org/emf/2002/Ecore",\n' +
  '    "@xmi:version": "2.0",\n' +
  '    "@name": "defaultPackage",\n' +
  '    "@nsURI": "http://???",\n' +
  '    "@nsPrefix": "org.???",\n' +
  '    "eClassifiers": []\n' +
  '  }\n' +
  '}';
const inputStrJsonM = '{\n' +
  '  "org.eclipse.example.bowling:League": {\n' +
  '    "@xmlns:xmi": "http://www.omg.org/XMI",\n' +
  '    "@xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",\n' +
  '    "@xmi:version": "2.0",\n' +
  '    "Players": [\n' +
  '      { "@name": "tizio" },\n' +
  '      { "@name": "asd" }\n' +
  '    ]\n' +
  '  }\n' +
  '}';
const MetaMetaModelStr: string = MetaMetaModel.emptyMetaMetaModel;
let MetaModelinputStr: string = inputStrJsonMM;
let ModelInputStr: string = inputStrJsonM;
