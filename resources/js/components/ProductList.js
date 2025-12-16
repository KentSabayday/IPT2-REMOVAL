import React from 'react';

const formatCurrency = (value) => {
    const number =
        typeof value === 'number'
            ? value
            : value != null
            ? Number(value)
            : 0;

    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number);
};

function ProductList({ products, onEdit, onDelete }) {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="product-list">
            <table className="product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Item Cost</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Available</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => {
                        const quantity =
                            typeof product.quantity === 'number'
                                ? product.quantity
                                : product.quantity != null
                                ? Number(product.quantity)
                                : 0;

                        const available = quantity;

                        const id = product.id != null ? product.id : index + 1;

                        return (
                            <tr key={id}>
                                <td>{id}</td>
                                <td className="product-name-cell">
                                    {product.name || 'N/A'}
                                </td>
                                <td>{product.category || 'N/A'}</td>
                                <td className="price-cell">
                                    {formatCurrency(product.price)}
                                </td>
                                <td className="description-cell">
                                    {product.description || 'N/A'}
                                </td>
                                <td className="quantity-cell">{quantity}</td>
                                <td className="quantity-cell">{available}</td>
                                <td className="actions-cell">
                                    <button
                                        onClick={() => onEdit(product)}
                                        className="inventory-btn inventory-btn--edit"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(product)}
                                        className="inventory-btn inventory-btn--danger"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default ProductList;
