import { Timestamp } from 'firebase/firestore';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import * as Yup from 'yup';
import { createMessage } from '../../services/firebase';
import { NewMessage } from '../Interfaces/MessageInterface';

interface MessageFormProps {
  flatId: string;
  userEmail: string;
  isAdmin: boolean;
}

// Validation schema
const validationSchema = Yup.object({
  content: Yup.string()
    .max(250, 'Message must be 250 characters or less')
    .required('Message is required'),
});

const MessageForm: React.FC<MessageFormProps> = ({ flatId, userEmail }) => {
  const formik = useFormik({
    initialValues: {
      content: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const newMessage: NewMessage = {
        messageId: '', // Handle or generate messageId as required
        userEmail: userEmail,
        flatId: flatId,
        content: values.content,
        createdAt: Timestamp.fromDate(new Date()),
      };
      const messageId = await createMessage(newMessage);
      // Handle form submission
      console.log('Form values:', messageId);
      window.location.reload();
    },
  });

  return (
    <>
      <p className="text-indigo-500 text-2xl font-bold">
        Let us know what you think
      </p>
      <form onSubmit={formik.handleSubmit}>
        <InputTextarea
          autoResize
          id="content"
          name="content"
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          rows={5}
          cols={30}
          className="w-full"
          placeholder="Write your message here"
        />

        {formik.touched.content && formik.errors.content ? (
          <Message
            severity="error"
            text={formik.errors.content}
            className="mb-1 w-full justify-content-start text-pink-300"
            style={{ backgroundColor: 'transparent' }}
          />
        ) : null}

        <div className="flex justify-content-end flex-wrap">
          <Button
            label="Add Comment"
            icon="pi pi-plus"
            className="text-right bg-indigo-400"
            type="submit"
            disabled={
              !formik.isValid ||
              formik.isSubmitting ||
              formik.values.content.trim() === ''
            }
          />
        </div>
      </form>
    </>
  );
};

export default MessageForm;
