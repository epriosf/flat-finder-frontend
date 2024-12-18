// components/Flats/FlatList.tsx
// import { useEffect, useState } from 'react';
// import { getFlats } from '../../services/firebase';
import { Flat } from '../Interfaces/FlatInterface'; // Updated import
import FlatItem from './FlatItem';
// import { confirmDialog } from 'primereact/confirmdialog';
import { useState } from 'react';
//import { deleteFlat } from '../../services/firebase';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

interface FlatListProps {
  flats: Flat[];
  onFlatDeleted?: (flatId: string) => void;
  onFavoriteToggle?: (flatId: string, isFavorite: boolean) => void;
}
const FlatList: React.FC<FlatListProps> = ({
  flats,
  onFlatDeleted,
  onFavoriteToggle,
}) => {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const handleDeleteRequest = (flatId: string) => {
    confirmDialog({
      message: 'Are you sure you want to delete this flat?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          // await deleteFlat(flatId);
          if (onFlatDeleted) {
            onFlatDeleted(flatId);
          }
        } catch (error) {
          console.error('Error deleting flat:', error);
        }
      },
      reject: () => {},
    });
  };
  return (
    <div className="grid">
      {flats.map((flat, index) => (
        <div key={index} className="col-12 md:col-6 lg:col-4">
          <FlatItem
            flat={flat}
            activeDialog={activeDialog}
            setActiveDialog={setActiveDialog}
            onDeleteRequest={handleDeleteRequest}
            onFavoriteToggle={onFavoriteToggle} // Pass the callback down
          />
        </div>
      ))}
      <ConfirmDialog />
    </div>
  );
};

export default FlatList;
