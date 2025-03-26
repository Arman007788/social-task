import { RelationStatus } from 'src/common/constants/relations.constant';

// relation model
export interface IRelation {
  id?: number;
  sender_id: number;
  receiver_id: number;
  status: RelationStatus;
}
