import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { deleteFlat, getUserFlats } from '../services/firebase';
import { Flat } from '../components/Interfaces/FlatInterface';
import FlatTitle from '../components/Flats/FlatTitle';
import FlatList from '../components/Flats/FlatList';

const MyFlatsPage: React.FC = () => {
  const [flats, setFlats] = useState<Flat[]>([]);
  const [filteredFlats, setFilteredFlats] = useState<Flat[]>([]); // State for filtered flats
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchMyFlats = async () => {
        try {
          const data = await getUserFlats(user.email); // Fetch flats created by the user
          setFlats(data);
          setFilteredFlats(data); // Initialize filteredFlats with the fetched data
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
      await deleteFlat(flatId); // Delete flat
      setFlats((prevFlats) =>
        prevFlats.filter((flat) => flat.flatId !== flatId),
      ); // Update state after deletion
      setFilteredFlats((prevFlats) =>
        prevFlats.filter((flat) => flat.flatId !== flatId),
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
          <a
            href="/home/new-flat"
            rel="noopener noreferrer"
            className="p-button font-bold no-underline"
          >
            Create New Flat
          </a>
        </div>
      )}
    </div>
  );
};

export default MyFlatsPage;
