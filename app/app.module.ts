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
  GraphPoint,
  //Options,
  MyConsole,
  MetaMetaModel,
  ShortAttribETypes,
  ECoreRoot,
  M3Class,
  MClass,
  IClass,
  Typedd,
  EOperation,
  MPackage,
  M2Reference,
  M2Package,
  M2Attribute,
  IPackage,
  M3Package,
  M3Attribute,
  EParameter,
  IAttribute,
  MReference,
  IReference,
  M3Reference,
  MAttribute,
  prjson2xml, prxml2json, Type
} from './common/Joiner';
import { PropertyBarrComponent }   from './guiElements/property-barr/property-barr.component';
import { MGraphHtmlComponent }     from './guiElements/m-graph-html/m-graph-html.component';
import { DamContextMenuComponent } from './guiElements/dam-context-menu/dam-context-menu.component';
import { StyleEditorComponent }    from './guiElements/style-editor/style-editor.component';
import { ConsoleComponent }        from './guiElements/console/console.component';
import KeyDownEvent = JQuery.KeyDownEvent;
import {saveEntries}               from './Database/LocalStorage';
import {ViewPoint}                 from './GuiStyles/viewpoint';
import {EType}                     from './mClass/classChild/Type';
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
  static userid: string;
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

  enableAutosave(timer: number): void {
    $(window).off('beforeunload.unload_autosave').on('beforeunload.unload_autosave', () => { this.autosave(); });
    localStorage.setItem('autosave', 'true');
    setInterval(() => { this.autosave(); }, timer);
  }
  autosave(): void {
    this.mm.save(true, null);
    this.m.save(true, null);
    console.log('autosave completed.');
  }
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
  window['' + 'U'] = U;
  window['' + 'IModel'] = IModel;
  window['' + 'Status'] = Status;
  window['' + 'M3Model'] = MetaMetaModel;
  window['' + 'M2Model'] = MetaModel;
  window['' + 'MModel'] = Model;
  window['' + 'IPackage'] = IPackage;
  window['' + 'M3Package'] = M3Package;
  window['' + 'M2Package'] = M2Package;
  window['' + 'MPackage'] = MPackage;
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
    'discardSave (stop autosave)'];
  window['' + 'destroy'] = () => {
    localStorage.setItem('m1_' + saveEntries.lastOpened, null);
    localStorage.setItem('m2_' + saveEntries.lastOpened, null);
    localStorage.setItem('m1_' + saveEntries.lastOpenedView, null);
    localStorage.setItem('m2_' + saveEntries.lastOpenedView, null);
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
  $('app-mm-graph-html .propertyBarContainer .UtabHeader').on('click', (e) =>  {
    if (e.currentTarget.innerText === 'Style') { Status.status.mm.graph.propertyBar.styleEditor.onShow(); } else
    if (e.currentTarget.innerText === 'Structured') { Status.status.mm.graph.propertyBar.onShow(); } else
    if (e.currentTarget.innerText === 'Raw')  { Status.status.mm.graph.propertyBar.onShow(true); }
    else { U.pe(true, 'unrecognized right-side tab:', e.currentTarget); }
  });
  $('app-m-graph-html .propertyBarContainer .UtabHeader').on('click', (e) =>  {
    if (e.currentTarget.innerText === 'Style') { Status.status.m.graph.propertyBar.styleEditor.onShow(); } else
    if (e.currentTarget.innerText === 'Structured') { Status.status.m.graph.propertyBar.onShow(); } else
    if (e.currentTarget.innerText === 'Raw')  { Status.status.m.graph.propertyBar.onShow(true); }
    else { U.pe(true, 'unrecognized right-side tab:', e.currentTarget); }
  });
  U.resizableBorderSetup();
  ECoreRoot.initializeAllECoreEnums();
  globalevents();
  const mmconsole: MyConsole = new MyConsole($('.mmconsole')[0]);
  const mconsole: MyConsole = new MyConsole($('.mconsole')[0]);

  let tmp: any;
  let useless: any;
  let i: number;
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

  let m2Viewpoints: Json[] = [];
  let m1Viewpoints: Json[] = [];
  tmp = localStorage.getItem('m2_' + saveEntries.lastOpened);
  if (tmp && tmp !== '' && tmp !== 'null' && tmp !== 'undefined') { MetaModelinputStr = tmp; }

  tmp = localStorage.getItem('m1_' + saveEntries.lastOpened);
  if (tmp && tmp !== '' && tmp !== 'null' && tmp !== 'undefined') { ModelInputStr = tmp; }

  tmp = localStorage.getItem('m2_' + saveEntries.lastOpenedView);
  if (tmp && tmp !== '' && tmp !== 'null' && tmp !== 'undefined') { m2Viewpoints = tmp; }
  tmp = localStorage.getItem('m1_' + saveEntries.lastOpenedView);
  if (tmp && tmp !== '' && tmp !== 'null' && tmp !== 'undefined') { m1Viewpoints = tmp; }

  console.log('loading MMM:', MetaMetaModelStr);
  console.log('loading MM:', MetaModelinputStr);
  console.log('loading M:', ModelInputStr);
  console.log('loading MM_viewpoints:', m2Viewpoints);
  console.log('loading M_viewpoints:', m1Viewpoints);
  // inputStr = atob(inputStr);
  Status.status.mmm = new MetaMetaModel(null);
  useless = new TopBar();
  Status.status.mm = new MetaModel(JSON.parse(MetaModelinputStr), Status.status.mmm);
  // console.log('m3:', Status.status.mmm, 'm2:', Status.status.mm, 'm1:', Status.status.m); return;
  Type.linkAll();
  M2Class.updateSuperClasses();
  Status.status.m = new Model(JSON.parse(ModelInputStr), Status.status.mm);
  console.log('m3:', Status.status.mmm, 'm2:', Status.status.mm, 'm1:', Status.status.m);
  // Status.status.m.LinkToMetaParent(Status.status.mm);
  // Status.status.m.fixReferences(); already linked at parse time.
  Status.status.loadedLogic = true;
  useless = new ISidebar(Status.status.mmm, document.getElementById('metamodel_sidebar'));
  useless = new ISidebar(Status.status.mm, document.getElementById('model_sidebar'));
  useless = new IGraph(Status.status.mm, document.getElementById('metamodel_editor') as unknown as SVGElement);
  useless = new IGraph(Status.status.m, document.getElementById('model_editor') as unknown as SVGElement);
  Status.status.loadedGUI = true;
  Status.status.mm.graph.propertyBar.show(Status.status.mm, null, false);
  Status.status.m.graph.propertyBar.show(Status.status.m, null, false);
  Type.updateTypeSelectors(null, true, true, true);
  setTimeout( () => { Status.status.mm.graph.ShowGrid(); Status.status.m.graph.ShowGrid(); }, 1);
  // M2Class.updateAllMClassSelectors();
  // Imposto un autosave raramente (minuti) giusto nel caso di crash improvvisi o disconnessioni
  // per evitare di perdere oltre X minuti di lavoro.
  // In condizioni normali non è necessario perchè il salvataggio è effettuato al cambio di pagina asincronamente
  // e con consegna dei dati garantita dal browser anche a pagina chiusa (navigator.beacon)
  let marr: IModel[] = [Status.status.mm, Status.status.m];
  let vpmatjson: Json[][] = [m2Viewpoints, m1Viewpoints];
  console.log(m2Viewpoints, m1Viewpoints, Status.status.mm.graph.viewPointShell);
  let j: number;
  for (j = 0; j < marr.length; j++) {
    const vparr: Json[] = vpmatjson[j];
    const m: IModel = marr[j];
    let v: ViewPoint;
    for (i = 0; i < vparr.length; i++) {
      const jsonvp: ViewPoint = vparr[i] as any;
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
      v.isApplied = false; }
    m.graph.viewPointShell.refreshApplied(); // STEP 3: qui vedo che non è stato applicato, ma è stato ordinato dalla gui di applicarlo -> lo applico.
  }/*
  ViewPoint.deserializeAndApply(m1Viewpoints, Status.status.m);
  ViewPoint.deserializeAndApply(m2Viewpoints, Status.status.mm);
  if (!m2Viewpoints.length) new ViewPoint(Status.status.mm.fullname(),  Status.status.mm).apply(Status.status.mm);
  if (!m1Viewpoints.length) new ViewPoint(Status.status.m.fullname(),  Status.status.m).apply(Status.status.m);*/
  // U.pe(true,'');

  window['' + 'jsonxml'] = prjson2xml.json2xml;
  window['' + 'xmljson'] = prxml2json.xml2json;
  window['' + 'xmlstr'] = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<ecore:EPackage xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
    '    xmlns:ecore="http://www.eclipse.org/emf/2002/Ecore" name="ermesMM" nsURI="https://ermes-project.org/ermes-core-mm" nsPrefix="ermesCoreMM">\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="NamedElement" abstract="true">\n' +
    '    <eStructuralFeatures xsi:type="ecore:EAttribute" name="nome" eType="ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EString"/>\n' +
    '  </eClassifiers>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="EnteFisico" abstract="true" eSuperTypes="#//NamedElement"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="EnteLogico" abstract="true" eSuperTypes="#//NamedElement"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="Ferro" abstract="true" eSuperTypes="#//EnteFisico">\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="dx" eType="#//Ferro"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="sx" eType="#//Ferro"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EAttribute" name="lunghezza" eType="ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EInt"/>\n' +
    '  </eClassifiers>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="Binario" eSuperTypes="#//Ferro"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="Deviatoio" abstract="true" eSuperTypes="#//Ferro"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="DeviatoioSemplice" eSuperTypes="#//Deviatoio">\n' +
    '    <eStructuralFeatures xsi:type="ecore:EAttribute" name="normalmenteDispostoRamoDeviato"\n' +
    '        lowerBound="1" eType="ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EBoolean"\n' +
    '        defaultValueLiteral="false"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="elettromagnete" eType="#//Elettromagnete"\n' +
    '        containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EAttribute" name="tallonabilita" lowerBound="1"\n' +
    '        eType="#//TallonabilitaDeviatoio" defaultValueLiteral="Tallonabile"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="ramoDeviato" lowerBound="1"\n' +
    '        eType="#//Binario" containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EAttribute" name="posizioneInizialeRovescia"\n' +
    '        lowerBound="1" eType="ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EBoolean"\n' +
    '        defaultValueLiteral="false"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EAttribute" name="direzionePunta" lowerBound="1"\n' +
    '        eType="#//Direzione"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EAttribute" name="normaleADestra" eType="ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EBoolean"\n' +
    '        defaultValueLiteral="false"/>\n' +
    '  </eClassifiers>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="FabbricatoViaggiatori" eSuperTypes="#//EnteFisico"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="CircuitoDiBinario" eSuperTypes="#//EnteFisico">\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="ferriCDB" lowerBound="1"\n' +
    '        upperBound="-1" eType="#//Ferro"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EAttribute" name="stazionamento" lowerBound="1"\n' +
    '        eType="ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EBoolean" defaultValueLiteral="false"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EAttribute" name="diLinea" lowerBound="1"\n' +
    '        eType="ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EBoolean" defaultValueLiteral="false"/>\n' +
    '  </eClassifiers>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="Segnale" abstract="true" eSuperTypes="#//EnteFisico">\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="ferroSegnale" lowerBound="1"\n' +
    '        eType="#//Ferro"/>\n' +
    '  </eClassifiers>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="Scudetto" eSuperTypes="#//EnteLogico">\n' +
    '    <eStructuralFeatures xsi:type="ecore:EAttribute" name="direzione" lowerBound="1"\n' +
    '        eType="#//DirezioneScudetto" defaultValueLiteral="Bidirezionale"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="ferroScudetto" lowerBound="1"\n' +
    '        eType="#//Ferro"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EAttribute" name="inibizioneLiberoTransito"\n' +
    '        lowerBound="1" eType="ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EBoolean"\n' +
    '        defaultValueLiteral="false"/>\n' +
    '  </eClassifiers>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="Blocco" eSuperTypes="#//EnteLogico">\n' +
    '    <eStructuralFeatures xsi:type="ecore:EAttribute" name="reversibile" lowerBound="1"\n' +
    '        eType="ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EBoolean" defaultValueLiteral="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EAttribute" name="NormalePercorrenza" lowerBound="1"\n' +
    '        eType="#//NormalePercorrenzaBlocco" defaultValueLiteral="DX"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="ferroBlocco" lowerBound="1"\n' +
    '        eType="#//Ferro"/>\n' +
    '  </eClassifiers>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="SegnaleAlto" eSuperTypes="#//Segnale">\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="segnaleAvvio" eType="#//SegnaleAvvio"\n' +
    '        containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="segnaleAvanzamento" eType="#//SegnaleAvanzamento"\n' +
    '        containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="indicatoreAltoDiPartenza"\n' +
    '        eType="#//IndicatoreAltoDiPartenza" containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="primaLuce" lowerBound="1"\n' +
    '        eType="#//PrimaLuce" containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="secondaLuce" eType="#//SecondaLuce"\n' +
    '        containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="terzaLuce" eType="#//TerzaLuce"\n' +
    '        containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EAttribute" name="direzioneSegnale" lowerBound="1"\n' +
    '        eType="#//Direzione"/>\n' +
    '  </eClassifiers>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="SegnaleBasso" eSuperTypes="#//Segnale"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="SegnaleAvvio" eSuperTypes="#//EnteFisico"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="SegnaleAvanzamento" eSuperTypes="#//EnteFisico"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="PS" eSuperTypes="#//EnteLogico">\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="fabbricatiViaggiatori"\n' +
    '        lowerBound="1" upperBound="-1" eType="#//FabbricatoViaggiatori" containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="ferri" upperBound="-1"\n' +
    '        eType="#//Ferro" containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="scudetti" upperBound="-1"\n' +
    '        eType="#//Scudetto" containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="segnali" upperBound="-1"\n' +
    '        eType="#//Segnale" containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="blocchi" upperBound="-1"\n' +
    '        eType="#//Blocco" containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="circuitiDiBinario" upperBound="-1"\n' +
    '        eType="#//CircuitoDiBinario" containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="rte" upperBound="-1" eType="#//RTE"\n' +
    '        containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="regimiStazione" upperBound="-1"\n' +
    '        eType="#//RegimeStazione" containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="soccorsiTxTcl" upperBound="-1"\n' +
    '        eType="#//SoccorsoTxTcl" containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="trasmettiChiave" upperBound="-1"\n' +
    '        eType="#//Trasmettichiave" containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="tracciatiPermanenti" upperBound="-1"\n' +
    '        eType="#//TracciatoPermanente" containment="true"/>\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="tracciatiPermanentiManovra"\n' +
    '        upperBound="-1" eType="#//TracciatoPermanenteManovra" containment="true"/>\n' +
    '  </eClassifiers>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="Luce" abstract="true" eSuperTypes="#//EnteFisico"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="PrimaLuce" eSuperTypes="#//Luce"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="SecondaLuce" eSuperTypes="#//Luce"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="TerzaLuce" eSuperTypes="#//Luce"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="IndicatoreAltoDiPartenza" eSuperTypes="#//EnteFisico"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="Elettromagnete" eSuperTypes="#//EnteFisico"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="RTE" eSuperTypes="#//EnteFisico">\n' +
    '    <eStructuralFeatures xsi:type="ecore:EReference" name="deviatoiRTE" upperBound="-1"\n' +
    '        eType="#//Deviatoio"/>\n' +
    '  </eClassifiers>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="RegimeStazione" eSuperTypes="#//EnteLogico"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="SoccorsoTxTcl" eSuperTypes="#//EnteLogico"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="Trasmettichiave" eSuperTypes="#//EnteLogico"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="TracciatoPermanente" eSuperTypes="#//EnteLogico"/>\n' +
    '  <eClassifiers xsi:type="ecore:EClass" name="TracciatoPermanenteManovra" eSuperTypes="#//EnteLogico"/>\n' +
    '  <eClassifiers xsi:type="ecore:EEnum" name="NormalePercorrenzaBlocco">\n' +
    '    <eLiterals name="DX"/>\n' +
    '    <eLiterals name="SX" value="1"/>\n' +
    '  </eClassifiers>\n' +
    '  <eClassifiers xsi:type="ecore:EEnum" name="DirezioneScudetto">\n' +
    '    <eLiterals name="Bidirezionale"/>\n' +
    '    <eLiterals name="OrientamentoSX" value="1"/>\n' +
    '    <eLiterals name="OrientamentoDX" value="2"/>\n' +
    '  </eClassifiers>\n' +
    '  <eClassifiers xsi:type="ecore:EEnum" name="TallonabilitaDeviatoio">\n' +
    '    <eLiterals name="Tallonabile"/>\n' +
    '    <eLiterals name="Intallonabile" value="1"/>\n' +
    '    <eLiterals name="IntallonabileAComando" value="2"/>\n' +
    '  </eClassifiers>\n' +
    '  <eClassifiers xsi:type="ecore:EEnum" name="Direzione">\n' +
    '    <eLiterals name="Destra"/>\n' +
    '    <eLiterals name="Sinistra" value="1"/>\n' +
    '  </eClassifiers>\n' +
    '</ecore:EPackage>\n'
  return;
  Status.status.enableAutosave(2 * 60 * 1000);
  //Options.enableAutosave(2 * 60 * 1000);
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
