import {Gender} from "./gender";

export interface PersonDetails {
  image: string | null;
  firstName: string | null;
  lastName: string | null;
  maidenName: string | null;
  birthDate: string | null;
  birthPlace: string | null;
  gender: Gender | null;
  motherID: string | null;
  fatherID: string | null;
  isAlive: boolean | null;
  deathPlace: string | null;
  deathDate: string | null;
  isSubmitter: boolean;
}
