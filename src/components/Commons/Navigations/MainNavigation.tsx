import { Avatar } from 'primereact/avatar';
import { Ripple } from 'primereact/ripple';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { logoutUser } from '../../../services/authService';
interface MainNavigationProps {
  // visible: boolean;
  setVisible: (visible: boolean) => void;
}

const MainNavigation = ({ setVisible }: MainNavigationProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    setVisible(false);
    navigate('/login');
  };

  const handleVisible = () => {
    setVisible(false);
  };

  return (
    <>
      <div className="overflow-y-auto">
        <ul className="list-none p-0 m-0 overflow-hidden">
          <li>
            <div className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
              <i className="pi pi-home mr-2"></i>
              <NavLink
                to="/home"
                className="font-medium no-underline text-700"
                onClick={handleVisible}
              >
                Home
              </NavLink>
              <Ripple />
            </div>
          </li>
          <li>
            <div className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
              <i className="pi pi-heart mr-2"></i>
              <NavLink
                to="/home/favorites"
                className="font-medium no-underline text-700"
                onClick={handleVisible}
              >
                Favorites
              </NavLink>
              <Ripple />
            </div>
          </li>
          <li>
            <div className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
              <i className="pi pi-face-smile mr-2"></i>
              <NavLink
                to="/home/my-flats"
                className="font-medium no-underline text-700"
                onClick={handleVisible}
              >
                My Flats
              </NavLink>
              <Ripple />
            </div>
          </li>
          <li>
            <div className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
              <i className="pi pi-plus mr-2"></i>
              <NavLink
                to="/home/new-flat"
                className="font-medium no-underline text-700"
                onClick={handleVisible}
              >
                New Flat
              </NavLink>

              <Ripple />
            </div>
          </li>
          {user && user.isAdmin === true && (
            <li>
              <div className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                <i className="pi pi-user mr-2"></i>
                <NavLink
                  to="/home/all-users"
                  className="font-medium no-underline text-700"
                  onClick={handleVisible}
                >
                  All Users
                </NavLink>
                <Ripple />
              </div>
            </li>
          )}
          <li>
            <button
              type="button"
              onClick={handleLogout}
              className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-200 transition-duration-150 transition-colors w-full surface-100 border-noround border-none font-medium text-700 text-base"
              style={{ fontWeight: 700 }}
            >
              <i className="pi pi-sign-out mr-2"></i>
              {/* <span className="font-medium no-underline text-700"> */}
              Sign Out
              {/* </span> */}
              <Ripple />
            </button>
          </li>
        </ul>
      </div>
      <div className="mt-auto">
        <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
        <NavLink
          to="/home/profile"
          v-ripple
          className="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple no-underline"
          onClick={handleVisible}
        >
          {/* <div className="flex items-center">
            <Avatar image={user?.profile} shape="circle" size="xlarge" />
            <div className="ml-3">
              <p className="font-bold mt-1">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-gray-500 mt-0 pt-0">{user?.email}</p>
            </div>
          </div> */}
          <div className="mt-4 flex gap-2 align-items-center">
            <Avatar
              image={user!.profile}
              imageAlt="{user.firstName} {user.lastName}"
              className="mr-2"
              size="large"
              shape="circle"
            />
            <div>
              <p className="font-bold m-0">
                {user!.firstName} {user!.lastName}
              </p>
              <p className="text-sm text-gray-500 m-0">{user!.email}</p>
            </div>
          </div>
        </NavLink>
      </div>
    </>
  );
};
export default MainNavigation;
