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
      {/* <TabView className="bg-transparent border-round-lg w-full justify-content-center h-full">
          <TabPanel
            header="Log In"
            className="text-white bg-transparent text-center justify-content-center"
          >
            <LoginForm />
          </TabPanel>
          <TabPanel
            header="Sign Up"
            className="text-white bg-transparent text-center justify-content-center"
          >
            <RegisterPage />
          </TabPanel>
        </TabView> */}
    </div>
  );
};

export default LoginPage;
