import { Paginator } from 'primereact/paginator';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import FlatList from '../components/Flats/FlatList';
import FlatTitle from '../components/Flats/FlatTitle';
import { Flat } from '../components/Interfaces/FlatInterface';
import { useAuth } from '../hooks/useAuth';
import { getFlats } from '../services/flatsService';

const HomePage = () => {
  const { user: loggedUser } = useAuth();
  const navigate = useNavigate(); // React Router navigate function
  const [flats, setFlats] = useState<Flat[]>([]);
  const [filteredFlats, setFilteredFlats] = useState<Flat[]>([]);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    rows: 10,
    page: 1,
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Redirect to login if the user is not logged in
  useEffect(() => {
    if (!loggedUser) {
      navigate('/login'); // Navigate to the login page
    }
  }, [loggedUser, navigate]);

  // Fetch flats data from the backend
  const fetchData = async (page = 1, limit = pagination.rows) => {
    setLoading(true);
    try {
      const { flats, pagination: backendPagination } = await getFlats({
        page,
        limit,
      });
      setFlats(flats);
      setFilteredFlats(flats);
      setPagination({
        totalRecords: backendPagination.totalPages * backendPagination.limit,
        rows: backendPagination.limit,
        page: backendPagination.page,
      });
    } catch (error) {
      console.error('Error fetching flats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedUser) {
      fetchData();
    }
  }, [loggedUser]);

  return (
    <>
      {/* FlatTitle with FilterByFlats and SortByFlats */}
      <FlatTitle
        title="Home"
        originalFlats={flats}
        setFlats={setFilteredFlats}
      />

      {/* List of filtered flats */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <FlatList flats={filteredFlats} onFlatDeleted={() => {}} />
      )}

      {/* Pagination Component */}
      <Paginator
        first={(pagination.page - 1) * pagination.rows}
        rows={pagination.rows}
        totalRecords={pagination.totalRecords}
        onPageChange={(event) => {
          const newPage = event.page + 1;
          fetchData(newPage, pagination.rows);
        }}
      />
    </>
  );
};

export default HomePage;
