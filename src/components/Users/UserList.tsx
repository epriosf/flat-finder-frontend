import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
//import { deleteUserByEmail, updateUserByEmail } from '../../services/firebase';
import UserCard from '../Commons/Cards/UserCard';
import { UserDetail } from '../Interfaces/UserInterface';

type UserListProps = {
  users: UserDetail[];
};

const UserList: React.FC<UserListProps> = ({ users }) => {
  const toastCenter = useRef<Toast>(null);

  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [confirmDeleteDialogVisible, setConfirmDeleteDialogVisible] =
    useState(false);
  const [selectedUserForAdminToggle, setSelectedUserForAdminToggle] =
    useState<UserDetail | null>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] =
    useState<UserDetail | null>(null);

  const handleToggleAdmin = (user: UserDetail) => {
    setSelectedUserForAdminToggle(user);
    setConfirmDialogVisible(true);
  };

  const handleDeleteUser = (user: UserDetail) => {
    setSelectedUserForDelete(user);
    setConfirmDeleteDialogVisible(true);
  };

  const handleConfirmToggleAdmin = async () => {
    // if (selectedUserForAdminToggle) {
    //   try {
    //     await updateUserByEmail(selectedUserForAdminToggle.email, {
    //       isAdmin: !selectedUserForAdminToggle.isAdmin,
    //     });
    //     toastCenter.current?.show({
    //       severity: 'success',
    //       summary: 'Success',
    //       detail: 'Admin status toggle Successfully',
    //       life: 2000,
    //     });
    //     setTimeout(() => {
    //       window.location.reload();
    //     }, 2000);
    //     console.log(
    //       `Admin status toggled for user with email ${selectedUserForAdminToggle.email}`,
    //     );
    //     // Update the UI or state here instead of reloading the page
    //   } catch (error) {
    //     toastCenter.current?.show({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: `Error toggling admin status. ${error}`,
    //       life: 2000,
    //     });
    //     console.error('Error toggling admin status:', error);
    //   }
    //   setConfirmDialogVisible(false);
    // }
  };

  const handleConfirmDeleteUser = async () => {
    // if (selectedUserForDelete) {
    //   try {
    //     await deleteUserByEmail(selectedUserForDelete.email);
    //     toastCenter.current?.show({
    //       severity: 'success',
    //       summary: 'Success',
    //       detail: `User with email ${selectedUserForDelete.email} deleted successfully`,
    //       life: 2000,
    //     });
    //     setTimeout(() => {
    //       window.location.reload();
    //     }, 2000);
    //     console.log(
    //       `User with email ${selectedUserForDelete.email} deleted successfully`,
    //     );
    //   } catch (error) {
    //     toastCenter.current?.show({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: `Error deleting user. ${error}`,
    //       life: 2000,
    //     });
    //     console.error('Error deleting user:', error);
    //   }
    //   setConfirmDeleteDialogVisible(false);
    // }
  };

  const handleCancel = () => {
    setConfirmDialogVisible(false);
    setConfirmDeleteDialogVisible(false);
  };

  return (
    <>
      <Toast ref={toastCenter} />
      <div className="grid">
        {users.map((user, index) => (
          <div
            key={index}
            className="col-12 xl:col-4 lg:col-4 md:col-6 sm:col-12"
          >
            <UserCard
              user={user}
              age={calculateAge(user.birthDate)}
              birthday={
                user.birthDate
                  ? new Date(user.birthDate).toLocaleDateString('en-GB') // Convert to Date here
                  : 'N/A'
              }
              flatsNumber={user.flatsCount || 0}
              onToggleAdmin={() => handleToggleAdmin(user)}
              onDeleteUser={() => handleDeleteUser(user)}
            />
          </div>
        ))}
        {selectedUserForAdminToggle && (
          <ConfirmDialog
            visible={confirmDialogVisible}
            onHide={handleCancel}
            message="Are you sure you want to toggle the admin status of this user?"
            header="Confirmation"
            icon="pi pi-exclamation-triangle"
            acceptClassName="p-button-danger"
            accept={handleConfirmToggleAdmin}
            reject={handleCancel}
          />
        )}
        {selectedUserForDelete && (
          <ConfirmDialog
            visible={confirmDeleteDialogVisible}
            onHide={handleCancel}
            message="Are you sure you want to delete the user?"
            header="Confirmation"
            icon="pi pi-exclamation-triangle"
            acceptClassName="p-button-danger"
            accept={handleConfirmDeleteUser}
            reject={handleCancel}
          />
        )}
      </div>
    </>
  );
};

// Helper function to calculate age from birthday
export const calculateAge = (birthday: string | Date | null): number => {
  if (!birthday) return 0;

  const date = typeof birthday === 'string' ? new Date(birthday) : birthday;

  if (isNaN(date.getTime())) return 0; // Check for invalid dates

  const diff = Date.now() - date.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default UserList;
