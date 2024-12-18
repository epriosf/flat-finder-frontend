import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlatList from '../components/Flats/FlatList';
import FlatTitle from '../components/Flats/FlatTitle';
import { Flat } from '../components/Interfaces/FlatInterface';
import { useAuth } from '../hooks/useAuth';
import { getUserFlats } from '../services/flatsService';

const MyFlatsPage: React.FC = () => {
  const [flats, setFlats] = useState<Flat[]>([]);
  const [filteredFlats, setFilteredFlats] = useState<Flat[]>([]); // State for filtered flats
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const { user } = useAuth();
  const navigate = useNavigate(); // React Router navigate function

  useEffect(() => {
    if (user) {
      const fetchMyFlats = async () => {
        try {
          const { flats } = await await getUserFlats({
            page: 1,
            limit: 5,
            sort: 'rentPrice',
            order: 'desc',
          });
          setFlats(flats);
          setFilteredFlats(flats); // Initialize filteredFlats with the fetched data
        } catch (error) {
          console.error('Error fetching user flats:', error);
        } finally {
          setLoading(false); // Stop loading after fetching data
        }
      };
      fetchMyFlats();
    }
  }, [user]);

  const handleDelete = async (flatId: string) => {
    try {
      setFlats((prevFlats) => prevFlats.filter((flat) => flat._id !== flatId)); // Update state after deletion
      setFilteredFlats((prevFlats) =>
        prevFlats.filter((flat) => flat._id !== flatId),
      ); // Update filtered flats after deletion
    } catch (error) {
      console.error('Failed to delete the flat:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <i className="pi pi-spin pi-spinner"></i> Loading...
      </div>
    ); // Show loading state
  }

  return (
    <div>
      {/* FlatTitle with FilterByFlats and SortByFlats */}
      <FlatTitle
        title="My Flats"
        originalFlats={flats} // Pass the original flats for sorting and filtering
        setFlats={setFilteredFlats} // Pass the setter for updating filtered flats
      />
      {/* Display the list of filtered flats */}
      {filteredFlats.length > 0 ? (
        <FlatList flats={filteredFlats} onFlatDeleted={handleDelete} /> // Pass filteredFlats to the FlatList
      ) : (
        <div className="w-full flex align-items-center flex-column justify-center h-full">
          <i className="pi pi-exclamation-triangle text-7xl text-pink-400"></i>
          <p className="text-xl text-600">
            You have not created any flats yet. Create a new flat to get
            started.
          </p>
          <button
            onClick={() => navigate('/home/new-flat')} // Use navigate for navigation
            className="p-button font-bold"
          >
            Create New Flat
          </button>
        </div>
      )}
    </div>
  );
};

export default MyFlatsPage;
