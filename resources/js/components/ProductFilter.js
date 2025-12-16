import React from 'react';

function ProductFilter({ value, onChange, onSearch }) {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && onSearch) {
            onSearch();
        }
    };

    const handleFilterClick = () => {
        if (onSearch) {
            onSearch();
        }
    };

    return (
        <div className="inventory-filter">
            <input
                type="text"
                className="inventory-input inventory-search-input"
                placeholder="Search products by name..."
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button
                type="button"
                className="inventory-btn inventory-btn--filter"
                onClick={handleFilterClick}
            >
                🔍 Filter Product
            </button>
        </div>
    );
}

export default ProductFilter;
