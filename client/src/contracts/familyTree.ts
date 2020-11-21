
import {PersonNode} from "./personNode";

export interface FamilyTree {
  submitterEmail: string;
  submitter: PersonNode & {children: PersonNode[] | null};
  language: string;
}
