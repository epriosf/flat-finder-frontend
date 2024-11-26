import FlatList from '../components/Flats/FlatList';
import FlatTitle from '../components/Flats/FlatTitle';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Flat } from '../components/Interfaces/FlatInterface';
import { useEffect, useState } from 'react';
import { getFlats } from '../services/firebase';

const HomePage = () => {
  const [flats, setFlats] = useState<Flat[]>([]);
  const [filteredFlats, setFilteredFlats] = useState<Flat[]>([]); // State for filtered flats
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(9);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFlats();
      setFlats(data as Flat[]);
      setFilteredFlats(data as Flat[]); // Initialize with full data set
    };
    fetchData();
  }, []);

  // Update the flats list after pagination change
  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setRows(event.rows);
    window.scrollTo(0, 0); // Scroll to the top on page change
  };

  // Handle flat deletion and update the flats list accordingly
  const handleFlatDeleted = (deletedFlatId: string) => {
    setFilteredFlats(
      filteredFlats.filter((flat) => flat.flatId !== deletedFlatId),
    );
  };

  // Slice the list of flats for pagination
  const currentFlats = filteredFlats.slice(first, first + rows);

  return (
    <>
      {/* FlatTitle with FilterByFlats and SortByFlats */}
      <FlatTitle
        title="Home"
        originalFlats={flats} // Pass the original flats for sorting and filtering
        setFlats={setFilteredFlats} // Pass the setter for updating filtered flats
      />

      {/* List of filtered flats */}
      <FlatList flats={currentFlats} onFlatDeleted={handleFlatDeleted} />

      {/* Pagination component */}
      {filteredFlats.length > 9 && (
        <Paginator
          first={first}
          rows={rows}
          totalRecords={filteredFlats.length} // Paginate based on filtered flats
          rowsPerPageOptions={[9, 12, 15, 18]}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default HomePage;
