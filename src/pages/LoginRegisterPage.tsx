import { Image } from 'primereact/image';
import { Outlet } from 'react-router';
import LoginRegisterNavigation from '../components/Commons/Navigations/LoginRegisterNavigation';
import LogoWhite from './../images/logo-white.svg';

const LoginRegister = () => {
  return (
    <>
      <div className="flex justify-content-center align-items-center w-screen h-screen flex-column bg-login-img">
        <div className="w-28rem bg-indigo-800 flex justify-content-center align-items-center p-3 border-round-lg mb-4">
          <Image src={LogoWhite} alt="Image" width="150" />
        </div>
        <div
          className="card flex flex-column justify-content-center w-28rem overflow-y-scroll h-75 text-500 bg-login border-round-lg pt-5
        "
        >
          <LoginRegisterNavigation />
          <div className="w-full h-full">
            <div className="card flex flex-column justify-content-center w-full p-5 gap-5 text-500">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginRegister;
