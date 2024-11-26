import { Flat } from '../Interfaces/FlatInterface';
import FilterByFlats from '../Commons/FilterBy/FilterByFlat';
import { SortByFlats } from '../Commons/SortBy/SortByFlat';
import { useEffect, useState } from 'react';

interface FlatTitleProps {
  title: string;
  originalFlats: Flat[]; // Pass the full list of flats for sorting/filtering
  setFlats: (flats: Flat[]) => void; // To update the displayed flats list in parent component
  showOrder?: boolean;
  showFilter?: boolean;
}

const FlatTitle: React.FC<FlatTitleProps> = ({
  title,
  originalFlats,
  setFlats, // Use this to update the final flats to display
  showOrder = true,
  showFilter = true,
}) => {
  const [sortedFlats, setSortedFlats] = useState<Flat[]>(originalFlats); // Track sorted flats
  const [filteredFlats, setFilteredFlats] = useState<Flat[]>(originalFlats); // Track filtered flats

  // Ensure filtered flats are updated when either sorting or filtering changes
  useEffect(() => {
    setFilteredFlats(sortedFlats); // Apply sorting first
  }, [sortedFlats]);

  useEffect(() => {
    setFlats(filteredFlats); // Finally set the filtered flats to the parent component
  }, [filteredFlats, setFlats]);

  useEffect(() => {
    // If originalFlats has changed, initialize both sortedFlats and filteredFlats
    if (originalFlats.length > 0) {
      setSortedFlats(originalFlats); // Initialize sortedFlats with originalFlats
      setFilteredFlats(originalFlats); // Initialize filteredFlats with originalFlats
    }
  }, [originalFlats]);

  // Sorting keys and labels
  const sortKeys: Array<keyof Flat> = ['city', 'price', 'areaSize'];
  const sortLabels = ['City', 'Price', 'Area Size'];

  return (
    <div className="flex justify-content-between w-full align-items-center mb-3">
      <h1 className="font-normal">{title}</h1>
      <div className="flex gap-3">
        {showOrder && (
          <SortByFlats
            items={filteredFlats} // Sort the already filtered flats
            setItems={setSortedFlats} // Update the sorted flats
            keys={sortKeys} // Sort keys: city, price, area size
            labels={sortLabels} // Labels to display
          />
        )}
        {showFilter && (
          <FilterByFlats
            setFilteredFlats={setFilteredFlats} // Update filtered flats based on filter
            originalFlats={originalFlats} // Filter from the original list of flats
          />
        )}
      </div>
    </div>
  );
};

export default FlatTitle;
