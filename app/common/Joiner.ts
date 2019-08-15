export {ShortAttribETypes, Size, U, Json, AttribETypes, InputPopup, DetectZoom, Dictionary} from './util';
export {Status} from '../app.module';
export {IGraph} from '../mGraph/iGraph';
export {IVertex} from '../mGraph/Vertex/iVertex';
export {IField} from '../mGraph/Field/iField';
export {IEdge, EdgeModes} from '../mGraph/Edge/iEdge';
export {EdgePoint, EdgePointFittizio, CursorFollowerEP} from '../mGraph/Edge/EdgePoint';
export {EdgeStyle, EdgePointStyle} from '../mGraph/Edge/edgeStyle';
export {ISidebar} from '../isidebar/isidebar.component';
export {PropertyBarr} from '../propertyBar/propertyBar';
export {TopBar} from '../top-bar/top-bar.component';
export {StyleEditor} from '../style-editor/style-editor.component';
export {Point} from '../mGraph/iGraph';
export {GraphSize, GraphPoint} from '../mGraph/Vertex/iVertex';
export {Options} from '../Save/Save';
export {MyConsole} from '../console/console.component';
export {ModelPiece} from '../Model/modelPiece';
export {IModel, ECoreRoot, ECorePackage, ECoreClass, ECoreReference, ECoreAttribute, XMIModel} from '../Model/iModel';
export {MetaMetaModel} from '../Model/MetaMetaModel';
export {MetaModel} from '../Model/MetaModel';
export {Model} from '../Model/Model';
export {IPackage, M3Package} from '../mPackage/iPackage';
export {M2Package} from '../mPackage/MMPackage';
export {MPackage} from '../mPackage/MPackage.component';
export {IClass, M3Class} from '../mClass/iClass';
export {M2Class} from '../mClass/m2Class';
export {MClass} from '../mClass/MClass';
export {IFeature, M3Feature, M2Feature, MFeature} from '../mFeature/iFeature';
export {IReference, M3Reference} from '../mReference/iReference';
export {M2Reference} from '../mReference/M2Reference';
export {MReference} from '../mReference/MReference';
export {IAttribute, M3Attribute} from '../mAttribute/iAttribute';
export {M2Attribute} from '../mAttribute/MMAttribute';
export {MAttribute} from '../mAttribute/MAttribute';
export {EType} from '../Model/MetaMetaModel';
export {ModelNone} from '../Model/modelPiece';
export {LocalStorage} from '../Database/LocalStorage';
export {DamContextMenuComponent} from '../dam-context-menu/dam-context-menu.component';



import { default as AnsiUp } from 'ansi_up';
export const ansiUp = new AnsiUp(); // https://github.com/drudru/ansi_up // ansi color formatter.

import * as stringsimilarity from '../../app/common/StringSimilarity.js';
import * as $$ from 'jquery';
export let StringSimilarity = stringsimilarity;
export const $ = $$;
import * as _pr_json2xml from '../common/prj_json2xml.js';
import * as _pr_xml2json from '../common/prj_xml2json.js';
export const prjson2xml = _pr_json2xml;
export const prxml2json = _pr_xml2json;
