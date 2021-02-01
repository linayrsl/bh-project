import {PersonDetails} from './personDetails';
import {PersonNode} from './personNode';

export interface CoParent extends PersonDetails {
  sharedChildren: PersonNode[];
  uniqueKey: string;
}
