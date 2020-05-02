import {FamilyTreeJson} from "./familyTreeJson";

export interface FamilyTreeApiRequest {
  submitterEmail: string;
  familyTree: FamilyTreeJson
}
