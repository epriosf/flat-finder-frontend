import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import FlatList from '../components/Flats/FlatList';
import { useAuth } from '../hooks/useAuth';
import { db } from '../config/firebase';
import { Flat } from '../components/Interfaces/FlatInterface';
import FlatTitle from '../components/Flats/FlatTitle';

const FavouritesPage: React.FC = () => {
  const { user: loggedUser } = useAuth();
  const [favoriteFlats, setFavoriteFlats] = useState<Flat[]>([]);
  const [filteredFlats, setFilteredFlats] = useState<Flat[]>([]); // Track filtered flats
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFavoriteFlats = async () => {
      if (loggedUser) {
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', loggedUser.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();

            if (userData.favoriteFlats && userData.favoriteFlats.length > 0) {
              const flatsRef = collection(db, 'flats');
              const flatsQuery = query(
                flatsRef,
                where('flatId', 'in', userData.favoriteFlats),
              );
              const flatsSnapshot = await getDocs(flatsQuery);

              const flats: Flat[] = flatsSnapshot.docs.map((doc) => {
                return {
                  ...doc.data(),
                  flatId: doc.id,
                } as Flat;
              });

              setFavoriteFlats(flats);
              setFilteredFlats(flats); // Initialize filteredFlats with the favorite flats
            }
          }
        } catch (error) {
          console.error('Error fetching favorite flats:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFavoriteFlats();
  }, [loggedUser]);

  const handleFavoriteToggle = (flatId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      // Remove the flat from the list if it's unfavorited
      setFavoriteFlats((prevFlats) =>
        prevFlats.filter((flat) => flat.flatId !== flatId),
      );
      setFilteredFlats((prevFlats) =>
        prevFlats.filter((flat) => flat.flatId !== flatId),
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
              prevFlats.filter((flat) => flat.flatId !== flatId),
            );
            setFilteredFlats((prevFlats) =>
              prevFlats.filter((flat) => flat.flatId !== flatId),
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
