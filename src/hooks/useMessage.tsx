import {
  collection,
  DocumentData,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { NewMessage } from '../components/Interfaces/MessageInterface';
import { UserMessage } from '../components/Interfaces/UserInterface';
import { db } from '../config/firebase';

const useMessage = (flatId: string) => {
  const [messages, setMessages] = useState<NewMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const messagesRef = collection(db, 'messages');

        const q = query(messagesRef, where('flatId', '==', flatId));

        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

        const fetchedMessages: NewMessage[] = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data() as Omit<NewMessage, 'messageId'>;

            const usersRef = collection(db, 'users');
            const userQuery = query(
              usersRef,
              where('email', '==', data.userEmail),
            );
            const userSnapshot = await getDocs(userQuery);

            let firstName = 'Not Found';
            let lastName = 'Not Found';
            let profile = 'Not Found';
            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data() as UserMessage;
              firstName = userData.firstName;
              lastName = userData.lastName;
              profile = userData.profile;
            }

            return {
              messageId: doc.id,
              ...data,
              firstName,
              lastName,
              profile,
            };
          }),
        );

        setMessages(fetchedMessages);
      } catch (error) {
        setError('Failed to fetch messages and users');
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [flatId]);

  return { messages, loading, error };
};

export default useMessage;
