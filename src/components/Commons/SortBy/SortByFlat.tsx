import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import { useRef, useState } from 'react';
import { Flat } from '../../Interfaces/FlatInterface'; // Ensure this path is correct

interface SortByFlatsProps {
  items: Flat[]; // Flat type used here
  setItems: (items: Flat[]) => void;
  keys: Array<keyof Flat>; // The sorting keys should relate to Flat fields
  labels: string[];
}

interface JustifyOption {
  icon: string;
  value: 'asc' | 'desc';
}

export const SortByFlats: React.FC<SortByFlatsProps> = ({
  items,
  setItems,
  keys,
  labels,
}) => {
  const [selectedSortKey, setSelectedSortKey] = useState<keyof Flat | null>(
    null,
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const justifyOptions: JustifyOption[] = [
    { icon: 'pi pi-sort-amount-down', value: 'asc' },
    { icon: 'pi pi-sort-amount-up', value: 'desc' },
  ];

  const justifyTemplate = (option: JustifyOption) => {
    return <i className={option.icon}></i>;
  };

  const handleSort = (key: keyof Flat, order: 'asc' | 'desc') => {
    const sortedItems = [...items].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (valueA == null || valueB == null) {
        return 0; // Skip sorting if value is null or undefined
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return order === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return order === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return 0; // If values are not comparable, return 0
    });

    setItems(sortedItems); // Update the state with sorted flats
  };

  const op = useRef<OverlayPanel>(null);

  const getIconForKey = (key: keyof Flat) => {
    switch (key) {
      case 'city':
        return 'map-marker';
      case 'price':
        return 'dollar';
      case 'areaSize':
        return 'expand';
      default:
        return 'sort'; // Fallback icon
    }
  };

  return (
    <div className="card flex justify-content-center">
      <Button
        type="button"
        rounded
        icon="pi pi-sort-alt"
        onClick={(e) => op.current?.toggle(e)}
      />
      <OverlayPanel ref={op} style={{ width: '20em' }}>
        {keys.map((key, index) => (
          <div className="flex justify-content-between text-600" key={index}>
            <p>
              <i
                className={`pi pi-${getIconForKey(key as keyof Flat)} pr-2`}
              ></i>{' '}
              {labels[index]}
            </p>
            <SelectButton
              value={selectedSortKey === key ? sortOrder : null}
              onChange={(e: SelectButtonChangeEvent) => {
                setSelectedSortKey(key);
                setSortOrder(e.value as 'asc' | 'desc');
                handleSort(key, e.value as 'asc' | 'desc');
              }}
              itemTemplate={justifyTemplate}
              options={justifyOptions}
              className="text-600"
            />
          </div>
        ))}
      </OverlayPanel>
    </div>
  );
};
