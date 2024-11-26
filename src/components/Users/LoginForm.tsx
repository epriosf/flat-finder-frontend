import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import GeneralInput from '../Commons/Inputs/GeneralInput';
import PasswordInput from '../Commons/Inputs/PasswordInput';

const SignupSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email Required'),
  password: Yup.string().required('Password Required').min(6),
});

export interface UserLogin {
  email: string;
  password: string;
}
const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      console.log(values);
      try {
        const user = await login(formik.values.email, formik.values.password);
        if (user) {
          navigate('/home');
          console.log('Logged in user:', user);
          setLoginError(false);
        } else {
          console.error('Error logging in user:', user);
          setLoginError(true);
        }
      } catch (error) {
        console.error('Error logging in user:', error);
        setLoginError(true);
      }
    },
  });

  return (
    <>
      <form id="loginForm" className="w-full" onSubmit={formik.handleSubmit}>
        {/* Display general error message after submission if login fails */}
        {loginError && (
          <Message
            severity="error"
            text="Incorrect email or password."
            className="mb-5 w-full justify-content-start text-pink-300 bg-indigo-800"
          />
        )}
        {/* Email */}
        <GeneralInput
          id="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          iconClass="pi pi-at text-500"
          label="Email"
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

        {/* Password */}
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
        {/* Button */}
        <Button
          label="Log In"
          type="submit"
          className="w-full bg-indigo-500 text-white"
        />
      </form>
      {/* <Toast ref={toast} position="bottom-left" /> */}
      {/* <div className="card flex justify-content-center">
        </div> */}
    </>
  );
};
export default LoginForm;
