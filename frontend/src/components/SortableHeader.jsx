export default function SortableHeader({ label, field, sortBy, order, onSort }) {
  const active = sortBy === field;
  return (
    <th onClick={() => onSort(field)} className="sortable-header">
      {label}
      {active ? (order === 'asc' ? ' ▲' : ' ▼') : ''}
    </th>
  );
}
