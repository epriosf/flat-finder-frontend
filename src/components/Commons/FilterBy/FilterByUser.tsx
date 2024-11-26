import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from 'primereact/inputnumber';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef, useState } from 'react';
import { UserRegister } from '../../Interfaces/UserInterface';
import { calculateAge } from '../../Users/UserList';

interface FilterByProps<T> {
  setItems: (items: T[]) => void;
  originalItems: T[];
  flatsCount?: Record<string, number>;
}

const FilterByUser = <T extends UserRegister>({
  setItems,
  originalItems,
  flatsCount,
}: FilterByProps<T>) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [minAge, setMinAge] = useState<number | null>(null);
  const [maxAge, setMaxAge] = useState<number | null>(null);
  const [minRange, setMinRange] = useState<number | null>(null);
  const [maxRange, setMaxRange] = useState<number | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const op = useRef<OverlayPanel>(null);
  const handleMinValueChange = (e: InputNumberValueChangeEvent) => {
    setMinAge(e.value !== undefined ? e.value : null);
  };
  const handleMaxValueChange = (e: InputNumberValueChangeEvent) => {
    setMaxAge(e.value !== undefined ? e.value : null);
  };
  const handleMinRangeValueChange = (e: InputNumberValueChangeEvent) => {
    setMinRange(e.value !== undefined ? e.value : null);
  };
  const handleMaxRangeValueChange = (e: InputNumberValueChangeEvent) => {
    setMaxRange(e.value !== undefined ? e.value : null);
  };
  const handleButtonClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let filteredUsers = originalItems.filter((item: UserRegister) => {
      const age = calculateAge(new Date(item.birthday));

      const ageCondition =
        (minAge == null || age >= minAge) && (maxAge == null || age <= maxAge);
      const rangeCondition = flatsCount
        ? (minRange == null || flatsCount[item.email] >= minRange) &&
          (maxRange == null || flatsCount[item.email] <= maxRange)
        : true;
      const adminCondition = isAdmin ? item.isAdmin : !item.isAdmin;

      return ageCondition && rangeCondition && adminCondition;
    });

    setItems(filteredUsers);

    if (isPanelOpen) {
      op.current?.hide(); // Close the panel
    } else {
      op.current?.toggle(e); // Open the panel
    }
    setIsPanelOpen(!isPanelOpen);
  };
  const clearFilterForm = () => {
    setIsAdmin(true);
    setMinAge(null);
    setMaxAge(null);
    setMinRange(null);
    setMaxRange(null);

    // Reset items to the original list
    setItems(originalItems);
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
      >
        <form onSubmit={handleButtonClick} className="loginForm text-600">
          <p className="mb-1">
            {/* <i className="pi pi-user pr-2"></i> */}
            Age Range
          </p>
          <div className="flex justify-content-between gap-2 w-full filter-input">
            <IconField iconPosition="left" className="w-full">
              <InputIcon className="pi pi-user" />
              <InputNumber
                id="minNumber-input"
                value={minAge}
                onValueChange={handleMinValueChange}
                className="w-full left-3"
              />
            </IconField>

            <IconField iconPosition="left" className="w-full">
              <InputIcon className="pi pi-user" />
              <InputNumber
                id="maxNumber-input"
                value={maxAge}
                onValueChange={handleMaxValueChange}
                className="w-full left-3"
              />
            </IconField>
          </div>
          <p className="mb-1">
            {/* <i className="pi pi-user pr-2"></i> */}
            Flats Range
          </p>
          <div className="flex justify-content-between gap-2 w-full filter-input">
            <IconField iconPosition="left" className="w-full">
              <InputIcon className="pi pi-hashtag" />
              <InputNumber
                id="minFlats-input"
                value={minRange}
                onValueChange={handleMinRangeValueChange}
                className="w-full"
              />
            </IconField>

            <IconField iconPosition="left" className="w-full">
              <InputIcon className="pi pi-hashtag" />
              <InputNumber
                id="maxFlats-input"
                value={maxRange}
                onValueChange={handleMaxRangeValueChange}
                className="w-full"
              />
            </IconField>
          </div>
          <div className="flex align-items-center mt-3">
            <InputSwitch
              checked={isAdmin}
              onChange={(e: InputSwitchChangeEvent) => setIsAdmin(e.value)}
              className="mr-3"
            />
            <span>Is Admin</span>
          </div>
          <Button label="Filter" className="w-full mt-3" type="submit" />
          <Button
            label="Clear Filter"
            className="w-full mt-2"
            onClick={clearFilterForm}
            type="button"
          />
        </form>
      </OverlayPanel>
    </div>
  );
};

export default FilterByUser;
