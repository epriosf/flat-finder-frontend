import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
// import { Image } from 'primereact/image';
import { useState } from 'react';
//import { getUserByEmail, toggleFavoriteFlat } from '../../services/firebase';
import { format } from 'date-fns';
import { Avatar } from 'primereact/avatar';
import { Dialog } from 'primereact/dialog';
import EditFlatPage from '../../pages/EditFlatPage';
import { Flat } from '../Interfaces/FlatInterface'; // Updated import
import FlatImg from './../../images/apt-21.jpg';
import UserImg from './../../images/profile.png';
//import { db } from '../../config/firebase';
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
  const [viewDialogVisible, setViewDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const { user: loggedUser } = useAuth();

  const [isFavorite, setIsFavorite] = useState(false);
  const initialDate = flat.dateAvailable ? flat.dateAvailable[0] : null;
  const endDate =
    flat.dateAvailable && flat.dateAvailable.length > 1
      ? flat.dateAvailable[flat.dateAvailable.length - 1]
      : null;
  console.log('flat', JSON.stringify(flat));

  const formattedInitialDate = initialDate
    ? format(new Date(initialDate), 'MMMM dd, yyyy')
    : 'N/A';
  const formattedEndDate = endDate
    ? format(new Date(endDate), 'MMMM dd, yyyy')
    : 'N/A';

  //Check if the flat is already in the user's favorites
  //useEffect(() => {
  //  const checkIfFavorite = async () => {
  //   if (loggedUser) {
  // const usersRef = collection(db, 'users');
  //const q = query(usersRef, where('email', '==', loggedUser.email));
  //const querySnapshot = await getDocs(q);
  // if (!querySnapshot.empty) {
  //   const userDoc = querySnapshot.docs[0];
  //   const userData = userDoc.data();
  //   setIsFavorite(userData.favoriteFlats?.includes(flat.flatId));
  // }
  //   }
  // };
  // checkIfFavorite();
  //}, [loggedUser, flat._id]);

  const handleCardClick = () => {
    setViewDialogVisible(true);
    setActiveDialog(flat._id);
  };

  const handleViewDialogClose = () => {
    setViewDialogVisible(false);
    setActiveDialog(null);
  };

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click from triggering
    setEditDialogVisible(true);
    setActiveDialog(flat._id);
  };

  const handleEditDialogClose = () => {
    setEditDialogVisible(false);
    setActiveDialog(null);
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click from triggering
    onDeleteRequest(flat._id);
  };

  const handleFavoriteClick = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click from triggering
    if (loggedUser) {
      try {
        // await toggleFavoriteFlat(loggedUser.email, flat.flatId, isFavorite);
        setIsFavorite(!isFavorite);
        if (onFavoriteToggle) {
          onFavoriteToggle(flat._id, !isFavorite);
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    } else {
      console.error('User is not logged in');
    }
  };

  // Header and footer for Card component
  const headerCard = (
    <img alt={`${flat.streetNumber} ${flat.streetName}`} src={FlatImg} />
  );

  const footerCard = (
    <div className="flex gap-2">
      {loggedUser && loggedUser._id === flat.ownerId._id && (
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
      {loggedUser && loggedUser._id === flat.ownerId!._id && (
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
          <p className="text-lg font-bold p-0 m-0">Price: ${flat.rentPrice}</p>
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
          Available from:
          <span className="font-bold"> {formattedInitialDate}</span>
        </p>
        <p className="p-0 m-0 text-600">
          Available to:
          <span className="font-bold"> {formattedEndDate}</span>
        </p>
        <Chip
          className={`text-indigo-500 mt-2 ${flat.hasAc ? 'chip-yes' : 'chip-no'}`}
          label={flat.hasAc ? 'Has AC' : 'No AC'}
          icon="pi pi-asterisk"
        />

        {flat.ownerId && (
          <div className="mt-4 flex gap-2 align-items-center">
            <Avatar
              image={UserImg}
              imageAlt="{user.firstName} {user.lastName}"
              className="mr-2"
              size="large"
              shape="circle"
            />
            <div>
              <p className="text-600 m-0">
                Listed by
                <br />
                {flat.ownerId.firstName} {flat.ownerId.lastName}
              </p>
              {/* <p className="text-600 m-0">{user.email}</p> */}
            </div>
          </div>
        )}
      </Card>
      {/* Flat Details Dialog */}
      <Dialog
        visible={activeDialog === flat._id && viewDialogVisible}
        className="w-full md:w-9 lg:w-6"
        onHide={handleViewDialogClose}
      >
        {flat ? <FlatDetailsPage flat={flat} /> : <div>Loading...</div>}
      </Dialog>

      {/* Edit Flat Dialog */}
      <Dialog
        header="Edit Flat"
        visible={activeDialog === flat._id && editDialogVisible}
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
