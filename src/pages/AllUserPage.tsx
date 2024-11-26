import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import FilterByUser from '../components/Commons/FilterBy/FilterByUser';
import { SortByUser } from '../components/Commons/SortBy/SortByUser';
import {
  UserOrderBy,
  UserRegister,
} from '../components/Interfaces/UserInterface';
import UserList from '../components/Users/UserList';
import { db } from '../config/firebase';
const AllUserPage = () => {
  const [users, setUsers] = useState<UserRegister[]>([]);
  const [originalUsers, setOriginalUsers] = useState<UserRegister[]>([]);
  const [flatsCount, setFlatsCount] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            birthday: data.birthday ? data.birthday.toDate() : null,
            profile: data.profile,
            isAdmin: data.isAdmin,
          } as UserRegister;
        });
        setUsers(usersList);
        setOriginalUsers(usersList);

        // Fetch flats count for each user
        const flatsCountObj: { [key: string]: number } = {};
        for (const user of usersList) {
          const flatsQuery = query(
            collection(db, 'flats'),
            where('flatUser', '==', user.email),
          );
          const flatsSnapshot = await getDocs(flatsQuery);
          flatsCountObj[user.email] = flatsSnapshot.size;
        }

        // Set the state for flats count
        setFlatsCount(flatsCountObj);
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

      <UserList users={users} flatsCount={flatsCount} />
    </>
  );
};
export default AllUserPage;
