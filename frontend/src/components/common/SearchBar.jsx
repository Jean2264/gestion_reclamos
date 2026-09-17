import "./SearchBar.css";

function SearchBar({ value, onChange, placeholder, onSearch }) {
  return (
    <div className="search-bar">
      <input
        className="input-search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className="search-btn" type="button" onClick={onSearch}>
        <i className="bi bi-search"></i>
      </button>
    </div>
  );
}

export default SearchBar;
