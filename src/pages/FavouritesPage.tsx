import React, { useEffect, useState } from 'react';
import FlatList from '../components/Flats/FlatList';
import { useAuth } from '../hooks/useAuth';
//import { db } from '../config/firebase';
import FlatTitle from '../components/Flats/FlatTitle';
import { Flat } from '../components/Interfaces/FlatInterface';
import { User } from '../components/Interfaces/UserInterface';
import { getFlatById } from '../services/flatsService';
import { getUserById } from '../services/userService';
const FavouritesPage: React.FC = () => {
  const { user: loggedUser } = useAuth();
  const [favoriteFlats, setFavoriteFlats] = useState<Flat[]>([]);
  const [filteredFlats, setFilteredFlats] = useState<Flat[]>([]); // Track filtered flats
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFavoriteFlats = async () => {
      if (!loggedUser) return;

      try {
        setLoading(true); // Set loading to true at the beginning

        // Fetch user data to get favorite flats IDs
        const userData: User = await getUserById(loggedUser._id);
        const favouriteFlatsIds: string[] = userData.favouriteFlats || [];

        if (favouriteFlatsIds.length === 0) {
          setFavoriteFlats([]);
          setFilteredFlats([]);
          return;
        }

        // Fetch all flats using Promise.all
        const flatsPromises = favouriteFlatsIds.map(async (flatId) => {
          try {
            return await getFlatById(flatId); // Fetch individual flat
          } catch (error) {
            console.warn(`Flat ID ${flatId} could not be fetched`, error);
            return null; // Return null for failed requests
          }
        });

        const flats = (await Promise.all(flatsPromises)).filter(
          Boolean,
        ) as Flat[];

        setFavoriteFlats(flats);
        setFilteredFlats(flats); // Initialize filtered flats state
      } catch (error) {
        console.error('Error fetching favorite flats:', error);
      } finally {
        setLoading(false); // Reset loading regardless of outcome
      }
    };

    fetchFavoriteFlats();
  }, [loggedUser]);

  const handleFavoriteToggle = (flatId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      // Remove the flat from the list if it's unfavorited
      setFavoriteFlats((prevFlats) =>
        prevFlats.filter((flat) => flat._id !== flatId),
      );
      setFilteredFlats((prevFlats) =>
        prevFlats.filter((flat) => flat._id !== flatId),
      );
    }
  };

  if (loading) {
    return (
      <div>
        <i className="pi pi-spin pi-spinner"></i> Loading...
      </div>
    );
  }

  if (!loggedUser) {
    return <div>You need to be logged in to view your favorite flats.</div>;
  }

  return (
    <div className="favourites-page">
      {/* FlatTitle with sorting and filtering */}
      <FlatTitle
        title="My Favorite Flats"
        originalFlats={favoriteFlats} // Pass the original favorite flats
        setFlats={setFilteredFlats} // Update the filtered flats after sort/filter
      />

      {/* Display the list of filtered favorite flats */}
      {filteredFlats.length > 0 ? (
        <FlatList
          flats={filteredFlats} // Use the filtered flats for display
          onFlatDeleted={(flatId) => {
            setFavoriteFlats((prevFlats) =>
              prevFlats.filter((flat) => flat._id !== flatId),
            );
            setFilteredFlats((prevFlats) =>
              prevFlats.filter((flat) => flat._id !== flatId),
            );
          }}
          onFavoriteToggle={handleFavoriteToggle} // Pass the callback
        />
      ) : (
        <div className="w-full flex align-items-center flex-column justify-center h-full">
          <i className="pi pi-exclamation-triangle text-7xl text-pink-400"></i>
          <p className="text-xl text-600">
            You have no favorite flats yet. See all flats to add favorites
          </p>
          <a
            href="/home"
            rel="noopener noreferrer"
            className="p-button font-bold no-underline"
          >
            See All Flats
          </a>
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;
