import { useEffect, useState } from 'react';
import FilterByUser from '../components/Commons/FilterBy/FilterByUser';
import { SortByUser } from '../components/Commons/SortBy/SortByUser';
import {
  UserOrderBy,
  UserRegister,
} from '../components/Interfaces/UserInterface';
import UserList from '../components/Users/UserList';
const AllUserPage = () => {
  const [users, setUsers] = useState<UserRegister[]>([]);
  const [originalUsers, setOriginalUsers] = useState<UserRegister[]>([]);
  const [flatsCount, setFlatsCount] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersList = [
          {
            firstName: 'Paul',
            lastName: 'Rios',
            email: 'prios@outlook.es',
            password: '1234',
            birthday: new Date(),
            profile: '',
            isAdmin: false,
          },
        ];
        setUsers(usersList);
        setOriginalUsers(usersList);

        setFlatsCount({ someKey: 0 });
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const sortKeys: Array<keyof UserOrderBy | 'flatsCount'> = [
    'firstName',
    'lastName',
    'flatsCount',
  ];
  const sortLabels = ['First Name', 'Last Name', 'Flats Count'];

  return (
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
              flatsCount={flatsCount}
            />
          </div>
          <div className="flex align-items-center justify-content-center w-4rem h-4rem font-bold border-round">
            <FilterByUser
              setItems={setUsers}
              originalItems={originalUsers}
              flatsCount={flatsCount}
            />
          </div>
        </div>
      </div>

      {/* <UserList users={users} flatsCount={flatsCount} /> */}
      <UserList />
    </>
  );
};
export default AllUserPage;
