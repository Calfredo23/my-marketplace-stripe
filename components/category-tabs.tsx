"use client";

import {
  BooksIcon,
  ClothingIcon,
  ElectronicsIcon,
  FurnitureIcon,
  GridIcon,
  OtherIcon,
  SportsIcon,
} from "@/components/icons";
import { CATEGORIES, type Category } from "@/lib/listings";

function CategoryIcon({ category }: { category: Category | null }) {
  switch (category) {
    case "Electronics":
      return <ElectronicsIcon className="category-icon" />;
    case "Furniture":
      return <FurnitureIcon className="category-icon" />;
    case "Clothing":
      return <ClothingIcon className="category-icon" />;
    case "Books":
      return <BooksIcon className="category-icon" />;
    case "Sports":
      return <SportsIcon className="category-icon" />;
    case "Other":
      return <OtherIcon className="category-icon" />;
    default:
      return <GridIcon className="category-icon" />;
  }
}

export function CategoryTabs({
  active,
  onSelect,
}: {
  active: Category | null;
  onSelect: (category: Category | null) => void;
}) {
  return (
    <nav className="category-tabs" aria-label="Listing categories">
      <button
        type="button"
        className={active ? "category-tab" : "category-tab category-tab-active"}
        aria-pressed={!active}
        onClick={() => onSelect(null)}
      >
        <CategoryIcon category={null} />
        All
      </button>
      {CATEGORIES.map((category) => {
        const isActive = active === category;
        return (
          <button
            key={category}
            type="button"
            className={
              isActive ? "category-tab category-tab-active" : "category-tab"
            }
            aria-pressed={isActive}
            onClick={() => onSelect(category)}
          >
            <CategoryIcon category={category} />
            {category}
          </button>
        );
      })}
    </nav>
  );
}
