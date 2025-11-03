function SearchBar({ searchTerm, onSearchChange, sortBy, onSortChange }) {

  return (
    <div className="card p-4">
      
        <div className="font-mono flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products by name or category..."
            className="input w-full"
          />
        </div>

        <div className="font-mono md:w-58">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="input"
          >
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
    </div>
    </div>
  );
}

export default SearchBar;
