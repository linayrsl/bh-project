import {PersonDetails} from "./personDetails";

export interface FamilyTreePersonJson extends PersonDetails {
  ID: string;
  siblings: string[];
}
