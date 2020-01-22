import * as tslib_1 from "tslib";
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MminputComponent } from './mminput/mminput.component';
import { MmsidebarComponent } from './mmsidebar/mmsidebar.component';
import { MsidebarComponent } from './msidebar/msidebar.component';
import { IsidebarComponent } from './isidebar/isidebar.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { GraphTabHtmlComponent } from './graph-tab-html/graph-tab-html.component';
import { MmGraphHtmlComponent } from './mm-graph-html/mm-graph-html.component';
// import { MGraphHtmlComponent } from './m-graph-html/m-graph-html.component';
import { IGraph, $, MetaModel, Model, ISidebar, U, DetectZoom } from './common/Joiner';
import { MetaMetaModel } from './Model/MetaMetaModel';
import { PropertyBarrComponent } from './property-barr/property-barr.component';
import { MGraphHtmlComponent } from './m-graph-html/m-graph-html.component';
/* not  install --save @angular/material @angular/cdk   */
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
                TopBarComponent,
                GraphTabHtmlComponent
            ] // todo: devi aggiungere qua ogni componente html (vengono caricati prima dei ts?)
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
var Status = /** @class */ (function () {
    function Status() {
        this.mm = null;
        this.m = null;
        this.defaultVertexStyle_Package = null;
        this.defaultVertexStyle_Class = null;
        this.defaultVertexStyle_MMMClass = null;
        this.defaultEdgeStyle = null;
        this.defaultReferenceStyle = null;
        this.defaultAttributeStyle = null;
        this.debug = false;
        this.modelMatTab = null;
    }
    Status.prototype.save = function () {
        return 'TO DO: SERIALIZE';
    };
    Status.prototype.getActiveModel = function () {
        if (Status.status.modelMatTab.selectedIndex === 0) {
            return this.mm;
        }
        else {
            return this.m;
        }
        return null;
    };
    Status.prototype.isM = function () { return this.getActiveModel() === this.m; };
    Status.prototype.isMM = function () { return this.getActiveModel() === this.mm; };
    Status.status = null;
    return Status;
}());
export { Status };
function main0(tentativi) {
    if (tentativi === void 0) { tentativi = 0; }
    console.log('main(), $ loaded:', $ !== undefined);
    Status.status = new Status();
    console.log('status: ', status);
    if (document.getElementById('MM_INPUT') === null) {
        if (tentativi++ >= 10) {
            U.pe(true, 'failed to load MM_INPUT');
        }
        setTimeout(function () { return main0(tentativi); }, 100);
        console.log('wait 100');
    }
    else {
        mainForceTabChange(0);
    }
}
function mainForceTabChange(tentativi) {
    if (tentativi === void 0) { tentativi = 0; }
    var retry = false;
    if (!Status.status.modelMatTab) {
        Status.status.modelMatTab = GraphTabHtmlComponent.matTabModel;
        retry = true;
        if (tentativi++ >= 10) {
            U.pe(true, 'failed to change tab (not initialized)', Status.status);
        }
    }
    if (Status.status.modelMatTab && Status.status.modelMatTab.selectedIndex === 1) {
        Status.status.modelMatTab.selectedIndex = 0;
        if (tentativi++ >= 10) {
            U.pe(true, 'failed to change tab (changeindex)');
        }
        retry = true;
    }
    if (retry) {
        setTimeout(function () { return mainForceTabChange(tentativi); }, 100);
    }
    else {
        main();
    }
}
function main() {
    var tmpz;
    U.pw((tmpz = +DetectZoom.device()) !== 1, 'Current zoom level is different from 100%.', 'The graph part of this website may be graphically misplaced due to a bug with Svg\'s <foreignObject> content.', 'current zoom:' + (+tmpz * 100) + '%', 'The bug happens in: Chrome', 'The bug does NOT happen in: Firefox');
    console.log('main()');
    var tmp = $('input#MM_INPUT')[0]; // document.getElementById('MM_INPUT');
    MetaModelinputStr = tmp.value;
    // inputStr = atob(inputStr);
    console.log('input:', MetaModelinputStr);
    console.log('JSON:', JSON.parse(MetaModelinputStr));
    var useless;
    console.log('status:', Status.status);
    console.log(MetaMetaModelStr);
    Status.status.mmm = new MetaMetaModel(JSON.parse(MetaMetaModelStr));
    Status.status.mm = new MetaModel(JSON.parse(MetaModelinputStr), Status.status.mm);
    Status.status.m = new Model(JSON.parse(ModelInputStr), Status.status.mm);
    Status.status.mm.fixReferences();
    Status.status.m.fixReferences();
    // todo error here: colpa del lazy loading delle mat-tab
    console.log('mm: ', Status.status.mm);
    console.log('model_sidebar: dom:', document.getElementById('model_sidebar'), '$:', $('#model_sidebar'));
    useless = new ISidebar(Status.status.mmm, document.getElementById('metamodel_sidebar'));
    useless = new ISidebar(Status.status.mm, document.getElementById('model_sidebar'));
    console.log('sidebar made');
    // U.pe(true, 'stop here, sidebars done.')
    useless = new IGraph(Status.status.mm, document.getElementById('metamodel_editor'));
    useless = new IGraph(Status.status.m, document.getElementById('model_editor'));
    console.log('graph made');
    Status.status.mm.graph.propertyBar.showM(Status.status.mm);
    Status.status.m.graph.propertyBar.showM(Status.status.m);
}
main0();
var inputStrJsonMMM = '{\n' +
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
var inputStrJsonMM = '{\n' +
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
var inputStrJsonM = '{\n' +
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
var MetaMetaModelStr = inputStrJsonMMM;
var MetaModelinputStr = inputStrJsonMM;
var ModelInputStr = inputStrJsonM;
//# sourceMappingURL=app.module.js.map