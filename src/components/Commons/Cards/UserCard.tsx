import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { useState } from 'react';
import { UserRegister } from '../../Interfaces/UserInterface';
import UpdateProfileAdmin from '../../Users/UpdateProfileAdmin';
interface UserCardProps {
  user: UserRegister;
  age: number;
  birthday: string;
  flatsNumber: number;
  onToggleAdmin: () => void; //
  onDeleteUser: () => void;
}
const UserCard: React.FC<UserCardProps> = ({
  user,
  age,
  birthday,
  flatsNumber,
  onToggleAdmin,
  onDeleteUser,
}) => {
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  const handleDialogClose = () => {
    setDialogVisible(false);
  };
  const handleEditClick = () => {
    setDialogVisible(true);
  };

  const header = (
    <div className="flex gap-3 align-items-center md:w-25rem mb-0">
      <Avatar
        image={user.profile}
        size="xlarge"
        shape="circle"
        className="my-3 ml-3"
      />
      <p>
        {user.firstName} {user.lastName}
      </p>

      <Button
        icon="pi pi-pencil"
        className="bg-primary-100"
        size="small"
        rounded
        text
        raised
        aria-label="Edit"
        onClick={handleEditClick}
      />
    </div>
  );
  const footer = (
    <>
      <div className="flex flex-column md:flex-row gap-3">
        <Button
          label="Toggle Admin"
          icon="pi pi-user-edit"
          className="w-full md:w-6 bg-indigo-400"
          onClick={onToggleAdmin}
        />
        <Button
          label="Remove User"
          severity="secondary"
          icon="pi pi-trash"
          className="w-full md:w-6 bg-indigo-200 text-indigo-800"
          onClick={onDeleteUser}
        />
      </div>
    </>
  );

  return (
    <>
      <Card
        footer={footer}
        header={header}
        className="border-1 border-round-xl border-indigo-300 bg-indigo-50"
      >
        <p className="mt-0">
          <i className="pi pi-user"></i>
          <span className="font-semibold"> Age:</span>
          {age}
        </p>
        <p>
          <i className="pi pi-at"></i>
          <span className="font-semibold"> Email:</span>
          {user.email}
        </p>
        <p>
          <i className="pi pi-calendar-clock"></i>
          <span className="font-semibold"> Date Of Bith:</span>
          {birthday}
        </p>
        <p>
          <i className="pi pi-user"></i>
          <span className="font-semibold"> #Flats:</span>
          {flatsNumber}
        </p>
        <p>
          <span
            className={`border-1 border-round-xl border-300 border-indigo-300 p-2 ${user.isAdmin ? 'bg-indigo-100' : 'bg-indigo-50'}`}
          >
            {user.isAdmin ? 'Is Admin' : 'Not Admin'}
          </span>
        </p>
      </Card>
      <Dialog
        header="Edit User"
        visible={dialogVisible}
        style={{ width: '50vw' }}
        onHide={handleDialogClose}
      >
        {user ? (
          <UpdateProfileAdmin
            userUpdate={user}
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
export default UserCard;
