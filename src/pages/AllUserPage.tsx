import { useEffect, useState } from 'react';
import FilterByUser from '../components/Commons/FilterBy/FilterByUser';
import { SortByUser } from '../components/Commons/SortBy/SortByUser';
import {
  UserDetail,
  UserOrderBy,
} from '../components/Interfaces/UserInterface';
import UserList from '../components/Users/UserList';
import { useAuth } from '../hooks/useAuth';
import { getUsers } from '../services/userService';
const AllUserPage = () => {
  const { user: loggedUser } = useAuth();
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [originalUsers, setOriginalUsers] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    if (!loggedUser) {
      setLoading(false); // Stop loading if no user is logged in
      return;
    }

    const fetchAllUsers = async () => {
      try {
        const { users } = await getUsers({
          page: 1,
          limit: 10,
          sort: 'firstName', // Default sort key
          order: 'asc',
        });
        setUsers(users || []);
        setOriginalUsers(users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [loggedUser]);

  const sortKeys: Array<keyof UserOrderBy | 'flatsCount'> = [
    'firstName',
    'lastName',
    'flatsCount',
  ];
  const sortLabels = ['First Name', 'Last Name', 'Flats Count'];

  return (
    <>
      {loading ? (
        <div className="flex justify-center align-items-center">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className="flex justify-content-between items-center w-full">
            <p className="font-bold text-2xl">All Users</p>
            <div className="flex gap-2">
              <div className="flex align-items-center justify-content-center w-4rem h-4rem font-bold border-round">
                <SortByUser
                  items={users}
                  setItems={setUsers}
                  keys={sortKeys}
                  labels={sortLabels}
                />
              </div>
              <div className="flex align-items-center justify-content-center w-4rem h-4rem font-bold border-round">
                <FilterByUser
                  setItems={setUsers}
                  originalItems={originalUsers}
                />
              </div>
            </div>
          </div>

          <UserList users={users} />
        </>
      )}
    </>
  );
};
export default AllUserPage;
