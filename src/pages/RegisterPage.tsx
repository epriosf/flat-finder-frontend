import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { FloatLabel } from 'primereact/floatlabel';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { Nullable } from 'primereact/ts-helpers';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import GeneralInput from '../components/Commons/Inputs/GeneralInput';
import PasswordInput from '../components/Commons/Inputs/PasswordInput';
import { UserRegister } from '../components/Interfaces/UserInterface';
import {
  registerUserWithAuth,
  registerUserWithFirestore,
  uploadProfileImage,
} from '../services/firebase';

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
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Za-z]/, 'Password must contain at least one letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    )
    .required('Password Required'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Password Confirm Required'),
});

const RegisterPage = () => {
  const toastCenter = useRef<Toast>(null);

  const navigate = useNavigate();
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      birthday: null,
      password: '',
      passwordConfirm: '',
    },
    validationSchema: SignupSchema,
    onSubmit: async (values, { resetForm }) => {
      let imageUrl = '';

      try {
        if (profileFile) {
          imageUrl = await uploadProfileImage(profileFile);
        }
        const user: UserRegister = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          birthday: values.birthday
            ? new Date(values.birthday)
            : new Date(today),
          password: values.password,
          profile: imageUrl,
          isAdmin: false,
        };

        const userCredential = await registerUserWithAuth(
          user.email,
          user.password,
        );
        await registerUserWithFirestore(userCredential.uid, {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          birthday: user.birthday,
          profile: user.profile,
          isAdmin: user.isAdmin,
        });
        // console.log('User Register Succesfully');
        toastCenter.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'User Registered Successfully',
          life: 3000,
        });

        resetForm();
        setProfileFile(null);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        console.error('Error registering user:', error);
        toastCenter.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: `Registration Failed. Please try again. ${error}`,
          life: 3000,
        });
      }
    },
  });

  const handleBirthdayChange = (e: Nullable<Date>) => {
    formik.setFieldValue('birthday', e);
    formik.setFieldTouched('birthday', true); // Mark birthday field as touched to trigger validation
  };

  const handleUploadImage = async (e: FileUploadHandlerEvent) => {
    const file = e.files[0];
    setProfileFile(file);
  };

  return (
    <>
      <Toast ref={toastCenter} />
      <form id="loginForm" onSubmit={formik.handleSubmit}>
        <GeneralInput
          id="firstName"
          name="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          iconClass="pi pi-user"
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
          iconClass="pi pi-user"
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
          iconClass="pi pi-envelope"
          label="Email"
          type="email"
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
        <PasswordInput
          id="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          iconClass="pi pi-lock text-500"
          label="password"
        />
        {formik.touched.password && formik.errors.password ? (
          <Message
            severity="error"
            text={formik.errors.password}
            className="mb-1 w-full justify-content-start text-pink-300"
            style={{ backgroundColor: 'transparent' }}
          />
        ) : (
          <div className="mt-5"></div>
        )}
        <PasswordInput
          id="passwordConfirm"
          name="passwordConfirm"
          value={formik.values.passwordConfirm}
          onChange={formik.handleChange}
          iconClass="pi pi-lock text-500"
          label="password confirm"
        />
        {formik.touched.passwordConfirm && formik.errors.passwordConfirm ? (
          <Message
            severity="error"
            text={formik.errors.passwordConfirm}
            className="mb-1 w-full justify-content-start text-pink-300"
            style={{ backgroundColor: 'transparent' }}
          />
        ) : (
          <div className="mt-5"></div>
        )}

        <FileUpload
          name="demo[]"
          multiple={false}
          accept="image/*"
          maxFileSize={1000000}
          emptyTemplate={
            <p className="m-0">Drag and drop images to here to upload.</p>
          }
          chooseLabel="Photo"
          customUpload
          auto
          uploadHandler={handleUploadImage}
        />

        <Button label="Sign up" className="w-full mt-5" type="submit" />
      </form>
    </>
  );
};

export default RegisterPage;
