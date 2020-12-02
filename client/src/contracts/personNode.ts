import {PersonDetails} from "./personDetails";

export interface PersonNode extends PersonDetails {
  mother: PersonNode | null;
  father: PersonNode | null;
  siblings: PersonNode[] | null;
}
