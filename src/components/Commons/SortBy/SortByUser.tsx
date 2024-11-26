import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import { useRef, useState } from 'react';

interface SortByProps<T> {
  items: T[];
  setItems: (items: T[]) => void;
  keys: Array<keyof T | 'flatsCount'>;
  labels: string[];
  flatsCount?: Record<string, number>;
}

interface JustifyOption {
  icon: string;
  value: 'asc' | 'desc';
}
export const SortByUser = <T extends { email: string }>({
  items,
  setItems,
  keys,
  labels,
  flatsCount,
}: SortByProps<T>) => {
  const [selectedSortKey, setSelectedSortKey] = useState<
    keyof T | 'flatsCount' | null
  >(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const justifyOptions: JustifyOption[] = [
    { icon: 'pi pi-sort-amount-down', value: 'asc' },
    { icon: 'pi pi-sort-amount-up', value: 'desc' },
  ];

  const justifyTemplate = (option: JustifyOption) => {
    return <i className={option.icon}></i>;
  };

  const handleSort = (key: keyof T | 'flatsCount', order: 'asc' | 'desc') => {
    const sortedItems = [...items].sort((a, b) => {
      if (key === 'flatsCount' && flatsCount) {
        const countA = flatsCount[a.email] || 0;
        const countB = flatsCount[b.email] || 0;
        return order === 'asc' ? countA - countB : countB - countA;
      }

      const valueA = a[key as keyof T];
      const valueB = b[key as keyof T];

      if (valueA < valueB) return order === 'asc' ? -1 : 1;
      if (valueA > valueB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    setItems(sortedItems);
  };
  const op = useRef<OverlayPanel>(null);
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
                className={`pi pi-${key === 'flatsCount' ? 'hashtag' : 'user'} pr-2`}
              ></i>
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
              optionLabel="value"
              options={justifyOptions}
            />
          </div>
        ))}
      </OverlayPanel>
    </div>
  );
};
