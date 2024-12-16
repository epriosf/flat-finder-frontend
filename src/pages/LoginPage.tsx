// import { LoginForm } from '../components/Users/LoginForm';
// import { Image } from 'primereact/image';
// import { TabPanel, TabView } from 'primereact/tabview';
// import LogoWhite from './../images/logo-white.svg';
// import RegisterPage from './RegisterPage';
// import './TabViewDemo.css';

import LoginForm from '../components/Users/LoginForm';

const LoginPage = () => {
  return (
    <div className="card w-full ">
      <h2 className="text-center text-white">Welcome to FlatFinder</h2>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
