import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
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
  const toast = useRef<Toast>(null); // Ref for Toast

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
          toast.current?.show({
            severity: 'success',
            summary: 'Login Successful',
            detail: 'Welcome back!',
            life: 3000, // Toast will stay for 3 seconds
          });
          setTimeout(() => {
            navigate('/home'); // Navigate after a short delay
          }, 2000); // Delay matches the toast's `life` duration
        } else {
          toast.current?.show({
            severity: 'error',
            summary: 'Login Failed',
            detail: 'Incorrect email or password.',
            life: 3000,
          });
        }
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Login Failed',
          detail: `An unexpected error occurred ${error}`,
          life: 3000,
        });
      }
    },
  });

  return (
    <>
      <Toast ref={toast} />
      <form id="loginForm" className="w-full" onSubmit={formik.handleSubmit}>
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
    </>
  );
};
export default LoginForm;
