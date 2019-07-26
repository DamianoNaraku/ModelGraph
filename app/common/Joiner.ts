import {MAttribute} from '../mAttribute/MAttribute';
export {eCoreAttribute, ShortAttribETypes, eCoreClass, eCorePackage, eCoreReference, eCoreRoot, Size, U, Json} from './util';
export {Status} from '../app.module';
export {ModelPiece} from '../Model/modelPiece';
export {IVertex} from '../mGraph/Vertex/iVertex';
export {IEdge, EdgeModes} from '../mGraph/Edge/iEdge';
export {EdgePoint, EdgePointFittizio, CursorFollowerEP} from '../mGraph/Edge/EdgePoint';
export {EdgeStyle, EdgePointStyle} from '../mGraph/Edge/edgeStyle';
export {IField} from '../mGraph/Field/iField';
export {IGraph} from '../mGraph/iGraph';
export {IModel} from '../Model/iModel';
export {IPackage} from '../mPackage/iPackage';
export {IClass} from '../mClass/iClass';
export {IFeature} from '../mFeature/iFeature';
export {IReference} from '../mReference/iReference';
export {IAttribute} from '../mAttribute/iAttribute';
export {ISidebar} from '../isidebar/isidebar.component';
export {MetaModel} from '../Model/MetaModel';
export {Model} from '../Model/Model';
export {PropertyBarr} from '../propertyBar/propertyBar';
export {AttribETypes} from './util';
export {TopBar} from '../top-bar/top-bar.component';
export {StyleEditor} from '../style-editor/style-editor.component';
export {Point} from '../mGraph/iGraph';
export {GraphSize, GraphPoint} from '../mGraph/Vertex/iVertex';
export {Options} from '../Save/Save';
export {MyConsole} from '../console/console.component';
export {EType} from '../Model/MetaMetaModel';
export {MPackage} from '../mPackage/MPackage.component';
export {MClass} from '../mClass/MClass';
export {MAttribute} from '../mAttribute/MAttribute';
export {MReference} from '../mReference/MReference';






import {ISidebar} from '../isidebar/isidebar.component';
import {Size, U} from './util';
import {GraphPoint} from '../mGraph/Vertex/iVertex';
import * as stringsimilarity from '../../app/common/StringSimilarity.js';
import * as detectzoooom from 'detect-zoom';
import * as $$ from 'jquery';
export let StringSimilarity = stringsimilarity;
export const $ = $$;
import * as ConvertXMLJSONRaw from 'xml-js';
export const ConvertXMLJSON = ConvertXMLJSONRaw;
import * as _pr_json2xml from '../common/prj_json2xml.js';
import * as _pr_xml2json from '../common/prj_xml2json.js';
export const prjson2xml = _pr_json2xml;
export const prxml2json = _pr_xml2json;





export class Dictionary<K = string, V = string> extends Object {}
export class DetectZoom {
  static device(): number { return detectzoooom.device(); }
  static zoom(): number {U.pe(true, 'better not use this, looks like always === 1'); return detectzoooom.zoom(); }
  private test(): any {
    let a: MAttribute;
    return a = null; }
}
