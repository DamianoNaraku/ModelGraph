/* NOTE: error in module.extends: devi importare i file rispettando l'ordine di dichiarazioni delle classi, se dichiaro class A nel file A, e class
 B extensa A nel file B, il file B non può essere importato prima del file A*/
/* this is undefined in constructors or method calls: likely caused by a reserved class name that is listed in config.ts and is behaving
 differently.*/
// /*new*/export {Styles, ModelPieceStyleEntry, SortType, StyleVisibility} from '../GuiStyles/styles';
// /*new*/export {ViewHtmlSettings, ViewPoint, Vieww, ModelView, PackageView, ClassView, AttributeView, EdgeView, ReferenceView, OperationView,
// ParameterView} from '../GuiStyles/viewpoint';
/*new*/export {ViewHtmlSettings, ViewPoint, Vieww, EdgeView} from '../GuiStyles/viewpoint';
export {LocalStorage} from '../Database/LocalStorage';
export {ModelPiece, Info, ModelNone, StyleComplexEntry} from '../Model/modelPiece';
export {ShortAttribETypes, U, Json, AttribETypes,
  InputPopup, DetectZoom, Dictionary, MeasurableArrays,
  IPoint, Point, GraphPoint, ISize, Size, GraphSize} from './util';
export {Status} from '../app.module';
export {IGraph, ViewPointShell} from '../guiElements/mGraph/iGraph';
export {IVertex} from '../guiElements/mGraph/Vertex/iVertex';
export {IField} from '../guiElements/mGraph/Field/iField';
export {IEdge, EdgeModes} from '../guiElements/mGraph/Edge/iEdge';
export {EdgePoint, EdgePointFittizio, CursorFollowerEP} from '../guiElements/mGraph/Edge/EdgePoint';
export {EdgeStyle, EdgePointStyle} from '../guiElements/mGraph/Edge/edgeStyle';
export {ISidebar} from '../guiElements/isidebar/isidebar.component';
export {PropertyBarr} from '../guiElements/propertyBar/propertyBar';
export {TopBar} from '../guiElements/top-bar/top-bar.component';
export {StyleEditor} from '../guiElements/style-editor/style-editor.component';
// export {Options} from '../Save/Save';
export {MyConsole} from '../guiElements/console/console.component';
export {IModel, ECoreRoot, ECorePackage, ECoreClass, ECoreReference,
  ECoreAttribute, ECoreParameter, ECoreOperation, XMIModel } from '../Model/iModel';
export {MetaMetaModel} from '../Model/MetaMetaModel';
export {MetaModel} from '../Model/MetaModel';
export {Model} from '../Model/Model';
export {IPackage, M3Package} from '../Model/mPackage/iPackage';
export {M2Package} from '../Model/mPackage/MMPackage';
export {MPackage} from '../Model/mPackage/MPackage.component';
export {IClass, M3Class} from '../mClass/iClass';
export {M2Class} from '../mClass/m2Class';
export {MClass} from '../mClass/MClass';
export {EType} from '../Model/MetaMetaModel';
export {IClassChild} from '../mClass/classChild/IClassChild';
export {IFeature, M3Feature, M2Feature, MFeature} from '../mClass/classChild/Features/iFeature';
export {IReference, M3Reference} from '../mClass/classChild/Features/References/iReference';
export {M2Reference} from '../mClass/classChild/Features/References/M2Reference';
export {MReference} from '../mClass/classChild/Features/References/MReference';
export {IAttribute, M3Attribute} from '../mClass/classChild/Features/Attributes/iAttribute';
export {M2Attribute} from '../mClass/classChild/Features/Attributes/MMAttribute';
export {MAttribute} from '../mClass/classChild/Features/Attributes/MAttribute';
/*new*/export {Database} from '../common/Database';
export {DamContextMenuComponent} from '../guiElements/dam-context-menu/dam-context-menu.component';
export {EOperation, OperationVisibility} from '../mClass/classChild/Operations/eOperation';
export {EParameter} from '../mClass/classChild/Operations/eParameter';


import { default as AnsiUp } from 'ansi_up';
export const ansiUp = new AnsiUp(); // https://github.com/drudru/ansi_up // ansi color formatter.

import * as stringsimilarity from '../../app/common/StringSimilarity.js';
export let StringSimilarity = stringsimilarity;
import * as $$ from 'jquery';
export const $ = $$;
import * as JQueryUII from '../../node_modules/jquery-ui';
export const JQueryUI = JQueryUII;
import * as _pr_json2xml from '../common/prj_json2xml.js';
import * as _pr_xml2json from '../common/prj_xml2json.js';
export const prjson2xml = _pr_json2xml;
export const prxml2json = _pr_xml2json;
export const $$$: JQueryStatic = require('jquery-ui');
export const $ui: JQueryStatic = $$$;

