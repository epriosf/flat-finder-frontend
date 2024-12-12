import { NewMessage } from '../components/Interfaces/MessageInterface';

const useMessage = (flatId: string) => {
  console.log(flatId);
  const messages: NewMessage[] = [];
  const loading = false;
  const error = false;
  return { messages, loading, error };
};

export default useMessage;
