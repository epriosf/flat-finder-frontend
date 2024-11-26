import { MenuItem } from 'primereact/menuitem';
import { TabMenu } from 'primereact/tabmenu';
import { NavLink } from 'react-router-dom';
const LoginRegisterNavigation = () => {
  const items: MenuItem[] = [
    {
      label: 'Login',
      template: (item, options) => (
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive ? `${options.className} p-highlight` : options.className
          }
        >
          {item.label}
        </NavLink>
      ),
    },
    {
      label: 'Sign Up',
      template: (item, options) => (
        <NavLink
          to="/register"
          className={({ isActive }) =>
            isActive ? `${options.className} p-highlight` : options.className
          }
        >
          {item.label}
        </NavLink>
      ),
    },
  ];
  return (
    <>
      <TabMenu className="w-full" model={items} />
    </>
  );
};
export default LoginRegisterNavigation;
