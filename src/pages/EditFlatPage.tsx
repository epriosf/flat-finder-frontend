import FlatForm from '../components/Flats/FlatForm';
import { Flat } from '../components/Interfaces/FlatInterface';

interface EditFlatPageProps {
  flat: Flat;
  onClose: () => void; // New prop to close the dialog
}

const EditFlatPage: React.FC<EditFlatPageProps> = ({ flat, onClose }) => {
  console.log('Flat ID in EditFlatPage:', flat.flatId); // Debugging
  return (
    <div>
      {/* Pass the flat data and set isEditing to true */}
      <FlatForm initialFlat={flat} isEditing={true} onFormSubmit={onClose} />
    </div>
  );
};

export default EditFlatPage;
