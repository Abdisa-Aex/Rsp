"use client";

import ItemsGrid from "./ItemsGrid";

const ItemsTab = ({ items, onEdit, onDelete, onView }) => {
  return (
    <ItemsGrid
      items={items}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
    />
  );
};

export default ItemsTab;
