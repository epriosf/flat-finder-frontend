import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
// import { Image } from 'primereact/image';
import { useEffect, useState } from 'react';
import { getUserByEmail, toggleFavoriteFlat } from '../../services/firebase';
import { Dialog } from 'primereact/dialog';
import { Flat } from '../Interfaces/FlatInterface'; // Updated import
import { User } from '../Interfaces/UserInterface';
import EditFlatPage from '../../pages/EditFlatPage';
import { Avatar } from 'primereact/avatar';
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import FlatImg from './../../images/apt-21.jpg';
import { db } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import FlatDetailsPage from '../../pages/FlatDetailsPage';

interface FlatItemProps {
  flat: Flat;
  activeDialog: string | null;
  setActiveDialog: (id: string | null) => void;
  onDeleteRequest: (flatId: string) => void;
  onFavoriteToggle?: (flatId: string, isFavorite: boolean) => void;
}

const FlatItem: React.FC<FlatItemProps> = ({
  flat,
  activeDialog,
  setActiveDialog,
  onDeleteRequest,
  onFavoriteToggle,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewDialogVisible, setViewDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  // const [fullFlat, setFullFlat] = useState<Flat | null>(null);
  const { user: loggedUser } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch the user data related to the flat
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUserByEmail(flat.flatUser);
        setUser(fetchedUser.length > 0 ? fetchedUser[0] : null);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [flat.flatUser]);

  // Check if the flat is already in the user's favorites
  useEffect(() => {
    const checkIfFavorite = async () => {
      if (loggedUser) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', loggedUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setIsFavorite(userData.favoriteFlats?.includes(flat.flatId));
        }
      }
    };
    checkIfFavorite();
  }, [loggedUser, flat.flatId]);

  const formatDate = (date: Timestamp | Date): string => {
    const dateObj = date instanceof Timestamp ? date.toDate() : date;
    const formatter = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formatter.format(dateObj);
  };

  const formattedDate = flat.dateAvailable
    ? formatDate(flat.dateAvailable)
    : 'N/A';

  const handleCardClick = () => {
    setViewDialogVisible(true);
    setActiveDialog(flat.flatId);
  };

  const handleViewDialogClose = () => {
    setViewDialogVisible(false);
    setActiveDialog(null);
  };

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click from triggering
    setEditDialogVisible(true);
    setActiveDialog(flat.flatId);
  };

  const handleEditDialogClose = () => {
    setEditDialogVisible(false);
    setActiveDialog(null);
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click from triggering
    onDeleteRequest(flat.flatId);
  };

  const handleFavoriteClick = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click from triggering
    if (loggedUser) {
      try {
        await toggleFavoriteFlat(loggedUser.email, flat.flatId, isFavorite);
        setIsFavorite(!isFavorite);
        if (onFavoriteToggle) {
          onFavoriteToggle(flat.flatId, !isFavorite);
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    } else {
      console.error('User is not logged in');
    }
  };

  if (loading) {
    return (
      <div>
        <i className="pi pi-spin pi-spinner"></i> Loading...
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  // Header and footer for Card component
  const headerCard = (
    <img
      alt={`${flat.streetNumber} ${flat.streetName}`}
      src={flat.flatImage || FlatImg}
    />
  );

  const footerCard = (
    <div className="flex gap-2">
      {loggedUser && loggedUser.email === flat.flatUser && (
        <Button
          icon="pi pi-trash"
          className="bg-primary-100"
          size="small"
          rounded
          text
          raised
          aria-label="Delete"
          onClick={handleDeleteClick}
        />
      )}
      {loggedUser && loggedUser.email === flat.flatUser && (
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
      )}
      <Button
        icon={isFavorite ? 'pi pi-heart-fill' : 'pi pi-heart'}
        className="bg-primary-100"
        size="small"
        rounded
        text
        raised
        aria-label="Favorite"
        onClick={handleFavoriteClick}
      />
    </div>
  );

  // Header and footer for flat details dialog
  // const headerDetails = (
  //   <div>
  //     <img
  //       alt={`${flat.streetNumber} ${flat.streetName}`}
  //       src={flat.flatImage || FlatImg}
  //       style={{ maxWidth: '97%' }}
  //     />
  //     <h2>
  //       {flat.streetNumber} {flat.streetName}
  //     </h2>
  //   </div>
  // );
  return (
    <>
      <Card
        title={`${flat.streetName} ${flat.streetNumber}`}
        subTitle={flat.city}
        footer={footerCard}
        header={headerCard}
        onClick={handleCardClick}
        className="flat-card border-round-xl"
        style={{ cursor: 'pointer' }}
      >
        <div className="flex flex-column gap-1 mb-3 pt-2">
          <p className="text-lg font-bold p-0 m-0">Price: ${flat.price}</p>
          {/* <p className="p-0 m-0 text-600">Built on {flat.yearBuilt}</p> */}
          <p className="p-0 m-0 text-600">
            Built on {flat.yearBuilt ? flat.yearBuilt : 'N/A'}
          </p>

          <div className="flex gap-2">
            <p className="p-0 m-0 text-600">{flat.areaSize} m²</p>
            <p className="p-0 m-0 text-600">{flat.rooms} rooms</p>
            <p className="p-0 m-0 text-600">{flat.bathrooms} baths</p>
          </div>
        </div>
        <p className="p-0 m-0 text-600">
          Available on: <span className="font-bold">{formattedDate}</span>
        </p>
        <Chip
          className={`text-indigo-500 mt-2 ${flat.hasAc ? 'chip-yes' : 'chip-no'}`}
          label={flat.hasAc ? 'Has AC' : 'No AC'}
          icon="pi pi-asterisk"
        />
        {/* <p className="p-0 m-0 text-600">Has AC: {flat.hasAc ? 'Yes' : 'No'}</p> */}

        {user && (
          <div className="mt-4 flex gap-2 align-items-center">
            <Avatar
              image={user.profile}
              imageAlt="{user.firstName} {user.lastName}"
              className="mr-2"
              size="large"
              shape="circle"
            />
            <div>
              <p className="text-600 m-0">
                Listed by {user.firstName} {user.lastName}
              </p>
              <p className="text-600 m-0">{user.email}</p>
            </div>
          </div>
        )}
      </Card>
      {/* Flat Details Dialog */}
      <Dialog
        // header={headerDetails}
        visible={activeDialog === flat.flatId && viewDialogVisible}
        className="w-full md:w-9 lg:w-6"
        onHide={handleViewDialogClose}
      >
        {flat ? <FlatDetailsPage flat={flat} /> : <div>Loading...</div>}
      </Dialog>

      {/* Edit Flat Dialog */}
      <Dialog
        header="Edit Flat"
        visible={activeDialog === flat.flatId && editDialogVisible}
        className="w-full md:w-9 lg:w-6"
        onHide={handleEditDialogClose}
      >
        {flat ? (
          <EditFlatPage flat={flat} onClose={handleEditDialogClose} />
        ) : (
          <div>Loading...</div>
        )}
      </Dialog>
    </>
  );
};
export default FlatItem;
