import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from 'primereact/inputnumber';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef, useState } from 'react';
import { Flat } from '../../Interfaces/FlatInterface';
import { InputText } from 'primereact/inputtext';

interface FilterByFlatsProps {
  setFilteredFlats: (flats: Flat[]) => void;
  originalFlats: Flat[];
}

const FilterByFlats: React.FC<FilterByFlatsProps> = ({
  setFilteredFlats,
  originalFlats,
}) => {
  const [city, setCity] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minArea, setMinArea] = useState<number | null>(null);
  const [maxArea, setMaxArea] = useState<number | null>(null);
  const [minRooms, setMinRooms] = useState<number | null>(null);
  const [maxRooms, setMaxRooms] = useState<number | null>(null);
  const [minBathrooms, setMinBathrooms] = useState<number | null>(null);
  const [maxBathrooms, setMaxBathrooms] = useState<number | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const op = useRef<OverlayPanel>(null);
  const handleCityValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };
  const handleMinValueChange = (e: InputNumberValueChangeEvent) => {
    setMinPrice(e.value !== undefined ? e.value : null);
  };
  const handleMaxValueChange = (e: InputNumberValueChangeEvent) => {
    setMaxPrice(e.value !== undefined ? e.value : null);
  };
  const handleMinAreaValueChange = (e: InputNumberValueChangeEvent) => {
    setMinArea(e.value !== undefined ? e.value : null);
  };
  const handleMaxAreaValueChange = (e: InputNumberValueChangeEvent) => {
    setMaxArea(e.value !== undefined ? e.value : null);
  };
  const handleMinRoomsValueChange = (e: InputNumberValueChangeEvent) => {
    setMinRooms(e.value !== undefined ? e.value : null);
  };
  const handleMaxRoomsValueChange = (e: InputNumberValueChangeEvent) => {
    setMaxRooms(e.value !== undefined ? e.value : null);
  };
  const handleMinBathroomsValueChange = (e: InputNumberValueChangeEvent) => {
    setMinBathrooms(e.value !== undefined ? e.value : null);
  };
  const handleMaxBathroomsValueChange = (e: InputNumberValueChangeEvent) => {
    setMaxBathrooms(e.value !== undefined ? e.value : null);
  };
  const handleButtonClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let filteredFlats = originalFlats.filter((flat) => {
      const cityCondition = city
        ? flat.city.toLowerCase().includes(city.toLowerCase())
        : true;
      const priceCondition =
        (minPrice == null || (flat.price != null && flat.price >= minPrice)) &&
        (maxPrice == null || (flat.price != null && flat.price <= maxPrice));
      const areaCondition =
        (minArea == null ||
          (flat.areaSize != null && flat.areaSize >= minArea)) &&
        (maxArea == null ||
          (flat.areaSize != null && flat.areaSize <= maxArea));

      const roomsCondition =
        (minRooms == null || (flat.rooms != null && flat.rooms >= minRooms)) &&
        (maxRooms == null || (flat.rooms != null && flat.rooms <= maxRooms));

      const bathroomsCondition =
        (minBathrooms == null ||
          (flat.bathrooms != null && flat.bathrooms >= minBathrooms)) &&
        (maxBathrooms == null ||
          (flat.bathrooms != null && flat.bathrooms <= maxBathrooms));

      return (
        cityCondition &&
        priceCondition &&
        areaCondition &&
        roomsCondition &&
        bathroomsCondition
      );
    });

    setFilteredFlats(filteredFlats);

    if (isPanelOpen) {
      op.current?.hide(); // Close the panel
    } else {
      op.current?.toggle(e); // Open the panel
    }
    setIsPanelOpen(!isPanelOpen);
  };
  const handleClearFilter = () => {
    setCity(null); // Clear the city field
    setMinPrice(null); // Reset min price
    setMaxPrice(null); // Reset max price
    setMinArea(null); // Reset min area
    setMaxArea(null); // Reset max area

    // Set the flats back to the original list
    setFilteredFlats(originalFlats);
  };

  return (
    <div className="card flex justify-content-center">
      <Button
        type="button"
        rounded
        icon="pi pi-filter"
        onClick={(e) => op.current?.toggle(e)}
      />
      <OverlayPanel
        ref={op}
        onHide={() => setIsPanelOpen(false)}
        style={{ width: '300px' }}
        className="filter-panel"
      >
        <form onSubmit={handleButtonClick} className="loginForm text-600">
          <p className="mb-1">
            {/* <i className="pi pi-user pr-2"></i> */}
            City
          </p>
          <IconField iconPosition="left">
            <InputIcon className="pi pi-map-marker" />
            <InputText
              id="city-input"
              value={city ?? ''}
              onChange={handleCityValueChange}
              className="w-full left-3"
            />
          </IconField>

          <p className="mb-1">
            {/* <i className="pi pi-user pr-2"></i> */}
            Price Range
          </p>
          <div className="flex justify-content-between gap-2 w-full filter-input">
            <IconField iconPosition="left" className="w-full">
              <InputIcon className="pi pi-dollar" />
              <InputNumber
                id="minPrice-input"
                value={minPrice ?? null}
                onValueChange={handleMinValueChange}
                className="w-full left-3"
              />
            </IconField>

            <IconField iconPosition="left" className="w-full">
              <InputIcon className="pi pi-dollar" />
              <InputNumber
                id="maxPrice-input"
                value={maxPrice ?? null}
                onValueChange={handleMaxValueChange}
                className="w-full left-3"
              />
            </IconField>
          </div>

          <p className="mb-1">
            {/* <i className="pi pi-user pr-2"></i> */}
            Area Range
          </p>
          <div className="flex justify-content-between gap-2 w-full filter-input">
            <IconField iconPosition="left">
              <InputIcon className="pi pi-expand" />
              <InputNumber
                id="minArea-input"
                value={minArea ?? null}
                onValueChange={handleMinAreaValueChange}
                className="w-full"
              />
            </IconField>

            <IconField iconPosition="left">
              <InputIcon className="pi pi-expand" />
              <InputNumber
                id="maxArea-input"
                value={maxArea ?? null}
                onValueChange={handleMaxAreaValueChange}
                className="w-full"
              />
            </IconField>
          </div>

          <p className="mb-1">
            {/* <i className="pi pi-user pr-2"></i> */}
            Rooms Range
          </p>
          <div className="flex justify-content-between gap-2 w-full filter-input">
            <IconField iconPosition="left">
              <InputIcon className="pi pi-building" />
              <InputNumber
                id="minRooms-input"
                value={minRooms ?? null}
                onValueChange={handleMinRoomsValueChange}
                className="w-full"
              />
            </IconField>

            <IconField iconPosition="left">
              <InputIcon className="pi pi-building" />
              <InputNumber
                id="maxRooms-input"
                value={maxRooms ?? null}
                onValueChange={handleMaxRoomsValueChange}
                className="w-full"
              />
            </IconField>
          </div>
          <p className="mb-1">
            {/* <i className="pi pi-user pr-2"></i> */}
            Bathrooms Range
          </p>
          <div className="flex justify-content-between gap-2 w-full filter-input">
            <IconField iconPosition="left">
              <InputIcon className="pi pi-building" />
              <InputNumber
                id="minBathrooms-input"
                value={minBathrooms ?? null}
                onValueChange={handleMinBathroomsValueChange}
                className="w-full"
              />
            </IconField>

            <IconField iconPosition="left">
              <InputIcon className="pi pi-building" />
              <InputNumber
                id="maxBathrooms-input"
                value={maxBathrooms ?? null}
                onValueChange={handleMaxBathroomsValueChange}
                className="w-full"
              />
            </IconField>
          </div>
          <Button label="Filter" className="w-full mt-3" type="submit" />
          <Button
            label="Clear Filter"
            className="w-full mt-2"
            onClick={handleClearFilter}
            type="button"
          />
        </form>
      </OverlayPanel>
    </div>
  );
};

export default FilterByFlats;
