// MessageItem.tsx
import { Avatar } from 'primereact/avatar';
import ReactTimeAgo from 'react-time-ago';
import { NewMessage } from '../Interfaces/MessageInterface';

interface MessageItemProps {
  message: NewMessage;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <li
      className="py-3 border-bottom-1 surface-border flex md:align-items-start md:justify-content-between flex-column md:flex-row"
      key={message.messageId}
    >
      <div className="flex align-items-start mr-0 lg:mr-5">
        <Avatar
          image={message.profile}
          className="mr-3 w-3rem h-3rem"
          shape="circle"
        />
        <div>
          <span className="text-900 font-medium block mb-2">
            {message.firstName} {message.lastName}
          </span>
          <div className="text-700 mb-2">{message.content}</div>
          <i className="pi pi-envelope text-primary">
            <span className="ml-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
              {message.userEmail}
            </span>
          </i>
        </div>
      </div>
      <span className="block text-500 font-medium ml-7 md:ml-5 mt-2 md:mt-0 text-sm">
        <ReactTimeAgo date={message.createdAt.toDate()} locale="en" />
      </span>
    </li>
  );
};

export default MessageItem;
