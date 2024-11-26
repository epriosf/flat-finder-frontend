import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useState } from 'react';
import { User } from '../Interfaces/UserInterface';
import bgProfile from './../../images/bg-profile.png';
import UpdateProfile from './UpdateProfile';
interface ProfileViewProps {
  user: User;
}
const ProfileView = ({ user }: ProfileViewProps) => {
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const handleEditClick = () => {
    setDialogVisible(true);
  };
  const handleDialogClose = () => {
    setDialogVisible(false);
  };
  console.log(user.birthday);
  return (
    <>
      <div className="w-full">
        <div className="relative">
          <img
            src={bgProfile}
            className="w-full border-round-md"
            alt="Ornare"
          />
          <Avatar
            image={user.profile}
            size="xlarge"
            className="flex absolute w-5rem h-5rem border-round-md"
            shape="circle"
            style={{ bottom: '-1.5rem', right: '1.5rem' }}
          />
        </div>
        <div className="p-3">
          <div className="text-900 font-medium text-3xl mb-3 text-center uppercase">
            {user.firstName} {user.lastName}
          </div>

          <ul className="list-none p-1 m-1">
            <li className="flex align-items-center py-3 px-2 flex-wrap">
              <div className="text-500 w-full md:w-3 font-medium">
                First Name
              </div>
              <div className="text-900 w-full md:w-9">{user.firstName}</div>
            </li>
            <li className="flex align-items-center py-3 px-2 flex-wrap">
              <div className="text-500 w-full md:w-3 font-medium">
                Last Name
              </div>
              <div className="text-900 w-full md:w-9">{user.lastName}</div>
            </li>
            <li className="flex align-items-center py-3 px-2 flex-wrap">
              <div className="text-500 w-full md:w-3 font-medium">Email</div>
              <div className="text-900 w-full md:w-9">{user.email}</div>
            </li>
            <li className="flex align-items-center py-3 px-2 flex-wrap">
              <div className="text-500 w-full md:w-3 font-medium">Birthday</div>
              <div className="text-900 w-full md:w-9">2000-02-02</div>
            </li>
          </ul>
        </div>

        <Button
          label="Edit Profile"
          icon="pi pi-user-edit"
          className="w-full bg-indigo-400"
          type="button"
          onClick={handleEditClick}
        />
      </div>
      <Dialog
        header="Edit User"
        visible={dialogVisible}
        style={{ width: '50vw' }}
        onHide={handleDialogClose}
      >
        {user ? (
          <UpdateProfile
            userUpdate={{ ...user, password: '' }}
            isAdminister={user.isAdmin}
            onClose={handleDialogClose}
          />
        ) : (
          <div>Loading...</div>
        )}{' '}
      </Dialog>
    </>
  );
};
export default ProfileView;
