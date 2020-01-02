import {IClass, IEdge, IReference, IVertex} from '../../../common/Joiner';

export class ExtEdge extends IEdge{

  constructor(logic: IClass | IReference, startv: IVertex = null, end: IVertex = null) {
    super(logic, startv, end);
  }
}
