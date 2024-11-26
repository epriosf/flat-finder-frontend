import { Timestamp } from 'firebase/firestore';
export interface NewMessage {
  messageId: string;
  flatId: string;
  userEmail: string;
  createdAt: Timestamp;
  content: string;
  firstName?: string;
  lastName?: string;
  profile?: string;
}
