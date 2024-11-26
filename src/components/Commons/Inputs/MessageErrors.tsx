import { Message } from 'primereact/message';

interface FormErrorMessageProps {
  touched: boolean | undefined;
  error: string | undefined;
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({
  touched,
  error,
}) => {
  if (!touched || !error) {
    return null;
  }

  return (
    <Message
      severity="error"
      text={error}
      className="w-full justify-content-start text-pink-300 p-0"
      style={{ backgroundColor: 'transparent' }}
    />
  );
};

export default FormErrorMessage;
