import {
  AttribETypes,
  ECoreOperation,
  EParameter,
  EType,
  IClass,
  IClassChild,
  Info,
  Json,
  M2Class,
  ModelPiece,
  ShortAttribETypes,
  U
} from '../../../common/Joiner';
// export abstract class EOperation extends IClassChild {}
/*
export class OperationVisibility {
  static public = 'public';
  static private = 'private';
  static protected = 'protected';
  static internal = 'internal';
  static protectedinternal = 'protected internal';
  static protectedprivate = 'protected private'; }*/

export enum OperationVisibility {
  public = 'public',
  private = 'private',
  protected = 'protected',
  internal = 'internal',
  package = 'package',
  protectedinternal = 'protected internal',
  protectedprivate = 'protected private', }

export class EOperation extends IClassChild {
  // instances: IClassChild[] = undefined;
  // metaParent: IClassChild = undefined;
  parent: IClass;
  childrens: EParameter[] = [];
  exceptionsStr: string; // classlist to be latera processed and linked.
  visibility: OperationVisibility = OperationVisibility.private;
  detailIsOpened: boolean = false && false;
  // exceptions: IClass[];
  // todo: ha davvero senso processarli e creare anche IClass.Object etc? mi conviene tenerli a stringa.

  constructor(parent: M2Class, json: Json) {
    super(parent, null);
    this.parse(json); }

  getVisibilityChar(): string {
    switch (this.visibility) {
      case OperationVisibility.public: return '+';
      case OperationVisibility.private: return '-';
      case OperationVisibility.protected: return '#';
      case OperationVisibility.internal:
      case OperationVisibility.package: return '~';
      case OperationVisibility.protectedinternal: return '#~';
      case OperationVisibility.protectedprivate: return '#-';
      default: return '?'; } }

  getClass(): IClass { return this.parent; }
  conformability(metaparent: ModelPiece, outObj?: any, debug?: boolean): number { U.pe(true, 'operation.conformability()'); return 0; }

  duplicate(nameAppend: string = '_Copy', newParent: M2Class = null): EOperation {
    const c: EOperation = new EOperation(null, null);
    c.copy(this); return c; }

  copy(c: EOperation, nameAppend: string = '_Copy', newParent: M2Class = null): void {
    super.copy(c, nameAppend, newParent);
    this.exceptionsStr = c.exceptionsStr;
    //// set childrens
    // this.arguments = []; for (i = 0; i < this.childrens.length; i++) { U.ArrayAdd(this.arguments, this.childrens[i]); }
    this.refreshGUI(); }

  generateModel(): Json {
    const parameters: Json[] = [];
    const json: Json = {};
    json[ECoreOperation.eParameters] = parameters;
    /*
						"_name": "EExceptionNameCustom",
						"_ordered": "false",
						"_unique": "false",
						"_lowerBound": "5",
						"_upperBound": "7",
						"_eType": "#//Casa",
						"_eExceptions": "#//Casa #//League ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EInt",
						"eParameters": [ ]*/
    Json.write(json, ECoreOperation.namee, this.name);
    Json.write(json, ECoreOperation.eType, this.getTypeStr() );
    Json.write(json, ECoreOperation.lowerBound, '' + this.lowerbound);
    Json.write(json, ECoreOperation.upperBound, '' + this.upperbound);
    Json.write(json, ECoreOperation.eexceptions, this.exceptionsStr);
    Json.write(json, ECoreOperation.ordered, '' + this.ordered);
    Json.write(json, ECoreOperation.unique, '' + this.unique);
    let i: number;
    for (i = 0; i < this.childrens.length; i++) { parameters.push(this.childrens[i].generateModel()); }
    return json; }

  getInfo(toLower: boolean = false): any {
    const info: any = super.getInfo(toLower);
    Info.unset(info, 'instances');
    Info.rename(info, 'type', 'returnType');
    Info.rename(info, 'typeDetail', 'returnTypeDetail');
    return info; }

  parse(json: Json, destructive?: boolean): void {
    this.setName(Json.read<string>(json, ECoreOperation.namee, 'Func_1'));
    const eType = Json.read<string>(json, ECoreOperation.eType, AttribETypes.void); // '#//' + this.parent.name
    this.parsePrintableTypeName(eType);
    if (!this.primitiveType && !this.classType) { this.setPrimitiveType(EType.get(ShortAttribETypes.void)); }
    this.linkClass();
    this.setLowerbound(+Json.read<number>(json, ECoreOperation.lowerBound, 'NAN_Trigger'));
    this.setUpperbound(+Json.read<number>(json, ECoreOperation.upperBound, 'NAN_Trigger'));
    this.exceptionsStr = Json.read<string>(json, ECoreOperation.eexceptions, '');
    this.ordered = 'true' === '' + Json.read<boolean>(json, ECoreOperation.ordered, 'false');
    this.unique = 'true ' === '' + Json.read<boolean>(json, ECoreOperation.unique, 'false');
    this.visibility = OperationVisibility.package;
    const parameters: Json[] = Json.getChildrens(json, false);
    let i: number;
    for (i = 0; i < parameters.length; i++) {
      const param: EParameter = new EParameter(this, parameters[i]);
      // U.ArrayAdd(this.arguments, param);
      U.ArrayAdd(this.childrens, param); }
    /*  https://codebeautify.org/xmltojson
				"Operations": [ {
						"_name": "EExceptionNameCustom",
						"_ordered": "false",
						"_unique": "false",
						"_lowerBound": "5",
						"_upperBound": "7",
						"_eType": "#//Casa",
						"_eExceptions": "#//Casa #//League ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EInt" },
					{
						"eParameters": [
							{
								"_eType": "#//Casa"
							},
							{
								"eAnnotations": {
									"_source": "annotationtext",
									"_references": "#//Umano/anni #//Umano/Attribute_1"
								},
								"_name": "dbl",
								"_ordered": "false",
								"_unique": "false",
								"_lowerBound": "1",
								"_upperBound": "2",
								"_eType": "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDouble"
							}
						],
						"_name": "operationDam"
					}
				],*/
  }


  private getTypeStr(): string { // todo
    return '#//'; }

  setSignatureHtml(html: HTMLElement, separator: string, maxargumentchars: number = null, maxarguments: number = null): void {
    const debug: boolean = false && true;
    maxargumentchars = isNaN(+maxargumentchars) ? 10 : +maxargumentchars;
    maxarguments = isNaN(+maxarguments) ? 2 : +maxarguments;
    const fixName = (s: string): string => {
      U.pif(debug, 'fixname: |' + s + '| --> |' + s.substring(0, maxargumentchars - 1) + '…|');
      if (s.length > maxargumentchars) { return s.substring(0, maxargumentchars - 1) + '…'; }
      return s; };
    let i: number;
    let parameterStr = '';
    maxarguments = Math.min(maxarguments, this.childrens.length);
    for (i = 0; i < maxarguments; i++) {
      if (i !== 0) { parameterStr += separator; }
      U.pif(debug, 'parameter[' + i + '] = ', this.childrens[i]);
      U.pif(debug, 'parameterStr: |' + parameterStr + '| --> |' + parameterStr + this.childrens[i].getTypeName() + '|');
      parameterStr += this.childrens[i].getTypeName(); }
    U.pif(debug, 'finalSignature: ', this.getVisibilityChar(), fixName(this.name), parameterStr,
      fixName(EParameter.GetTypeName(this.getReturnType())), EParameter.GetTypeName(this.getReturnType()), this.getReturnType());
    // todo: innerText is not standard, switch to textContent
    html.innerHTML = '&nbsp'; // == ' '
    html.textContent += this.getVisibilityChar() + '' + fixName(this.name) + '(' + parameterStr + ') → ' // → ⇒
      + fixName(EParameter.GetTypeName(this.getReturnType()));
    html.dataset.visibility = this.visibility;
    html.dataset.exceptions = this.exceptionsStr; }

  getReturnType(): EParameter { return this.getFakeReturnTypeParameter(); }

  getFakeReturnTypeParameter(): EParameter {
    const fake: EParameter = new EParameter(null, null);
    U.arrayRemoveAll(this.childrens, fake);
    fake.parent = this; // can travel fake -> original, can't original -> fake.
    fake.id = this.id;
    fake.ordered = this.ordered;
    fake.unique = this.unique;
    fake.setLowerbound(this.getLowerbound());
    fake.setUpperbound(this.getUpperbound());
    fake.classType = this.classType;
    fake.primitiveType = this.primitiveType;
    fake.name = '';
    return fake; }

  addParameter(): EParameter {
    const p: EParameter = new EParameter(this, null);
    U.ArrayAdd(this.childrens, p);
    return p; }

}
