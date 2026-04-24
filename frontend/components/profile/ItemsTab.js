"use client";

import ItemsGrid from "./ItemsGrid";

const ItemsTab = ({
  items, // ← Will receive 'items' prop
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <ItemsGrid
      filteredItems={items} // ← Map 'items' to 'filteredItems' for ItemsGrid
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
    />
  );
};

export default ItemsTab;
