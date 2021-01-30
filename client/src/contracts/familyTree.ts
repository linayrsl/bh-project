import {CoParent} from './coParent';
import {PersonNode} from "./personNode";

export interface FamilyTree {
  submitterEmail: string;
  submitter: PersonNode & {coParents: CoParent[] | null};
  language: string;
}
