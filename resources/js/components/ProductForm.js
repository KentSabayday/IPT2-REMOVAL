import React, { useState, useEffect } from 'react';

function ProductForm({ initialProduct, onSave, onCancel, saving }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (initialProduct) {
            setName(initialProduct.name || '');
            setCategory(initialProduct.category || '');
            setPrice(
                initialProduct.price != null ? String(initialProduct.price) : ''
            );
            setQuantity(
                initialProduct.quantity != null
                    ? String(initialProduct.quantity)
                    : ''
            );
            setDescription(initialProduct.description || '');
        }
    }, [initialProduct]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const productData = {
            name: name.trim(),
            category: category.trim(),
            price: parseFloat(price) || 0,
            quantity: parseInt(quantity, 10) || 0,
            description: description.trim(),
        };

        onSave(productData).then((success) => {
            if (success) {
                onCancel();
            }
        });
    };

    const isEditMode = Boolean(initialProduct && initialProduct.id);

    return (
        <div className="product-form-container">
            <h2 className="form-title">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label htmlFor="name" className="form-label">
                        Item Name <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="inventory-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={saving}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category" className="form-label">
                        Category <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        id="category"
                        className="inventory-input"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        disabled={saving}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="price" className="form-label">
                            Item Cost <span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="price"
                            className="inventory-input"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            step="0.01"
                            min="0"
                            required
                            disabled={saving}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity" className="form-label">
                            Quantity <span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            className="inventory-input"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            min="0"
                            required
                            disabled={saving}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <textarea
                        id="description"
                        className="inventory-input inventory-input--textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        disabled={saving}
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="inventory-btn inventory-btn--primary"
                        disabled={saving}
                    >
                        {saving
                            ? 'Saving...'
                            : isEditMode
                            ? 'Update Product'
                            : 'Add Product'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inventory-btn inventory-btn--secondary"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductForm;
