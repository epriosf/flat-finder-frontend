import useMessage from '../../hooks/useMessage';
import MessageItem from './MessageItem';
interface MessagesListProps {
  flatId: string;
  userEmail: string;
  isAdmin: boolean;
}
const MessageList: React.FC<MessagesListProps> = ({
  flatId,
  userEmail,
  isAdmin,
}) => {
  const { messages, loading, error } = useMessage(flatId);

  if (loading)
    return (
      <div>
        <i className="pi pi-spin pi-spinner"></i> Loading...
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  const filteredMessages = isAdmin
    ? messages
    : messages.filter((message) => message.userEmail === userEmail);
  return (
    <>
      {messages.length === 0 ? (
        <div className="text-center mt-6 text-500 font-medium">
          <i className="pi pi-info-circle"></i>
          <p>No messages yet</p>
        </div>
      ) : (
        <ul className="list-none p-0 m-0 mt-5">
          {filteredMessages.map((message) => (
            <MessageItem key={message.messageId} message={message} />
          ))}
        </ul>
      )}
    </>
  );
};
export default MessageList;
