import { Timestamp } from 'firebase/firestore';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { FloatLabel } from 'primereact/floatlabel';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { Message } from 'primereact/message';
import * as Yup from 'yup';

import { Image } from 'primereact/image';

import { Nullable } from 'primereact/ts-helpers';
import { updateUser } from '../../services/userService';
import GeneralInput from '../Commons/Inputs/GeneralInput';
import { User } from '../Interfaces/UserInterface';
import {} from './../../services/firebase';

//Min and Max Dates
const today = new Date();
let minDate = new Date(today);
let maxDate = new Date(today);

minDate.setFullYear(today.getFullYear() - 120);
maxDate.setFullYear(today.getFullYear() - 18);

const SignupSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First Name must be at least 2 characters')
    .max(20, 'First Name can not be more than 20 characters')
    .matches(/^[A-Za-z]+$/, 'First Name can only contain letters')
    .required('First Name Required'),
  lastName: Yup.string()
    .min(2, 'Last Name must be at least 2 characters')
    .max(20, 'First Name can not be more than 20 characters')
    .matches(/^[A-Za-z]+$/, 'First Name can only contain letters')
    .required('Last Name Required'),
  email: Yup.string().email('Invalid email').required('Email Required'),
  birthday: Yup.date()
    .required('Birth Date Required')
    .min(minDate, 'Date can not be more than 120 years ago')
    .max(maxDate, 'Date can not be less than 18 years ago'),
});

interface UpdateProfileProps {
  userUpdate?: User;
  isAdminister?: boolean;
  onClose: () => void;
}

const UpdateProfile = ({
  userUpdate,
  isAdminister = false,
  onClose,
}: UpdateProfileProps) => {
  // const [profileFile, setProfileFile] = useState<File | null>(null);

  const formik = useFormik({
    initialValues: {
      firstName: userUpdate?.firstName || '',
      lastName: userUpdate?.lastName || '',
      email: userUpdate?.email || '',
      birthday: userUpdate?.birthday
        ? userUpdate.birthday instanceof Timestamp
          ? userUpdate.birthday.toDate()
          : userUpdate.birthday
        : null,
      isAdmin: userUpdate?.isAdmin || false,
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      try {
        const user: Partial<User> = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          birthday: values.birthday ? values.birthday : new Date(today),
          isAdmin: userUpdate!.isAdmin,
        };
        //update user
        await updateUser(userUpdate!._id, user);
        console.log('User updated successfully');
        onClose();

        window.location.reload();
      } catch (error) {
        console.error('Error registering user:', error);
      }
    },
  });

  const handleBirthdayChange = (e: Nullable<Date>) => {
    formik.setFieldValue('birthday', e);
    formik.setFieldTouched('birthday', true);
  };

  const handleUploadImage = async (e: FileUploadHandlerEvent) => {
    const file = e.files[0];
    console.log(file);
    //setProfileFile(file);
  };

  return (
    <>
      <form id="newFlatForm" onSubmit={formik.handleSubmit}>
        <div className="flex justify-content-center mb-4">
          <Image src={userUpdate?.profileImage} alt="userProfile" width="150" />
        </div>

        <GeneralInput
          id="firstName"
          name="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          iconClass="pi pi-user text-500"
          label="FirstName"
          type="text"
        />
        {formik.touched.firstName && formik.errors.firstName ? (
          <Message
            severity="error"
            text={formik.errors.firstName}
            className="mb-1 w-full justify-content-start text-pink-300"
            style={{ backgroundColor: 'transparent' }}
          />
        ) : (
          <div className="mt-5"></div>
        )}

        <GeneralInput
          id="lastName"
          name="lastName"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          iconClass="pi pi-user text-500"
          label="LastName"
          type="text"
        />

        {formik.touched.lastName && formik.errors.lastName ? (
          <Message
            severity="error"
            text={formik.errors.lastName}
            className="mb-1 w-full justify-content-start text-pink-300"
            style={{ backgroundColor: 'transparent' }}
          />
        ) : (
          <div className="mt-5"></div>
        )}

        <GeneralInput
          id="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          iconClass="pi pi-envelope text-500"
          label="Email"
          type="email"
          disabled={true}
        />

        {formik.touched.email && formik.errors.email ? (
          <Message
            severity="error"
            text={formik.errors.email}
            className="mb-1 w-full justify-content-start text-pink-300"
            style={{ backgroundColor: 'transparent' }}
          />
        ) : (
          <div className="mt-5"></div>
        )}
        <FloatLabel>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-calendar text-500"></i>
            </span>
            <Calendar
              inputId="birth_date"
              value={formik.values.birthday}
              onChange={(e) => handleBirthdayChange(e.value)}
              inputStyle={{ borderLeft: 'none' }}
              minDate={minDate}
              dateFormat="dd/mm/yy"
            />
          </div>
          <label htmlFor="birth_date" className="left-3 text-400">
            Birth Date
          </label>
        </FloatLabel>

        {formik.touched.birthday && formik.errors.birthday ? (
          <Message
            severity="error"
            text={formik.errors.birthday}
            className="mb-1 w-full justify-content-start text-pink-300"
            style={{ backgroundColor: 'transparent' }}
          />
        ) : (
          <div className="mt-5"></div>
        )}

        {isAdminister && (
          <>
            <div className="mt-3">
              <InputSwitch
                checked={formik.values.isAdmin}
                onChange={(e: InputSwitchChangeEvent) =>
                  formik.setFieldValue('isAdmin', e.value)
                }
                className="mr-3"
              />
              <span>Is Admin</span>
            </div>
          </>
        )}

        <FileUpload
          name="demo[]"
          multiple={false}
          accept="image/*"
          maxFileSize={1000000}
          emptyTemplate={
            <p className="m-0">Drag and drop images to here to upload.</p>
          }
          chooseLabel={'Update Photo'}
          customUpload
          auto
          uploadHandler={handleUploadImage}
        />

        <Button label={'Save Changes'} className="w-full mt-5" type="submit" />
      </form>
    </>
  );
};

export default UpdateProfile;
