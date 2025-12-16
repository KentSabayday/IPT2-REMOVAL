import React, { useState, useEffect, useMemo } from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import ProductFilter from './ProductFilter';

const API_BASE_URL = '/api/product';

function ProductInventoryApp() {
    const [products, setProducts] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [stockFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, product: null });
    const [deleting, setDeleting] = useState(false);

    const loadProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(API_BASE_URL);
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleCreate = async (productData) => {
        setSaving(true);
        setError('');
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            const data = await response.json();
            await loadProducts();
            return true;
        } catch (err) {
            setError('Failed to create product. Please try again.');
            return false;
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (productData) => {
        setSaving(true);
        setError('');
        try {
            const response = await fetch(
                `${API_BASE_URL}/${productData.id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
                }
            );
            const data = await response.json();
            await loadProducts();
            return true;
        } catch (err) {
            setError('Failed to update product. Please try again.');
            return false;
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (product) => {
        setDeleteConfirm({ isOpen: true, product });
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm({ isOpen: false, product: null });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm.product) return;
        
        setDeleting(true);
        try {
            await fetch(`${API_BASE_URL}/${deleteConfirm.product.id}`, {
                method: 'DELETE',
            });
            await loadProducts();
            setDeleteConfirm({ isOpen: false, product: null });
        } catch (err) {
            setError('Failed to delete product. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    const handleSave = (productData) => {
        if (editingProduct) {
            return handleUpdate({ ...productData, id: editingProduct.id });
        }
        return handleCreate(productData);
    };

    const handleToolbarSearch = () => {
        loadProducts();
    };

    const handleAddClick = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setEditingProduct(null);
        setIsFormOpen(false);
    };

    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        if (filterText) {
            const searchLower = filterText.toLowerCase();
            filtered = filtered.filter((product) => {
                const name = product.name || '';
                const category = product.category || '';
                const description = product.description || '';
                return (
                    name.toLowerCase().includes(searchLower) ||
                    category.toLowerCase().includes(searchLower) ||
                    description.toLowerCase().includes(searchLower)
                );
            });
        }

        if (stockFilter === 'low') {
            filtered = filtered.filter((product) => {
                const qty =
                    typeof product.quantity === 'number'
                        ? product.quantity
                        : product.quantity != null
                        ? Number(product.quantity)
                        : 0;
                return qty < 10;
            });
        } else if (stockFilter === 'out') {
            filtered = filtered.filter((product) => {
                const qty =
                    typeof product.quantity === 'number'
                        ? product.quantity
                        : product.quantity != null
                        ? Number(product.quantity)
                        : 0;
                return qty === 0;
            });
        }

        return filtered;
    }, [products, filterText, stockFilter]);

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

    const stats = useMemo(() => {
        const total = products.length;
        const totalValue = products.reduce((sum, product) => {
            const price =
                typeof product.price === 'number'
                    ? product.price
                    : product.price != null
                    ? Number(product.price)
                    : 0;
            const quantity =
                typeof product.quantity === 'number'
                    ? product.quantity
                    : product.quantity != null
                    ? Number(product.quantity)
                    : 0;
            return sum + price * quantity;
        }, 0);
        const lowStock = products.filter((product) => {
            const qty =
                typeof product.quantity === 'number'
                    ? product.quantity
                    : product.quantity != null
                    ? Number(product.quantity)
                    : 0;
            return qty < 10 && qty > 0;
        }).length;
        const categories = new Set(
            products.map((p) => p.category || 'Uncategorized')
        ).size;

        return { total, totalValue, lowStock, categories };
    }, [products]);

    const hasProducts = filteredProducts.length > 0;

    return (
        <div className="inventory-app">
            <div className="inventory-header">
                <div className="inventory-header-main">
                    <div className="inventory-header-icon">
                        <span className="inventory-header-icon-text">PI</span>
                    </div>
                    <div>
                        <h1 className="inventory-title">
                            Product Inventory Manager
                        </h1>
                        <p className="inventory-subtitle">
                            Manage your product catalog
                        </p>
                    </div>
                </div>
            </div>

            <div className="inventory-stats-row">
                <div className="inventory-stat-card">
                    <div className="inventory-stat-icon inventory-stat-icon--products">
                        📦
                    </div>
                    <div className="inventory-stat-content">
                        <div className="inventory-stat-value">{stats.total}</div>
                        <div className="inventory-stat-label">Total Products</div>
                    </div>
                </div>
                <div className="inventory-stat-card">
                    <div className="inventory-stat-icon inventory-stat-icon--value">
                        💰
                    </div>
                    <div className="inventory-stat-content">
                        <div className="inventory-stat-value">
                            {formatCurrency(stats.totalValue)}
                        </div>
                        <div className="inventory-stat-label">Total Value</div>
                    </div>
                </div>
                <div className="inventory-stat-card">
                    <div className="inventory-stat-icon inventory-stat-icon--low-stock">
                        ⚠️
                    </div>
                    <div className="inventory-stat-content">
                        <div className="inventory-stat-value">{stats.lowStock}</div>
                        <div className="inventory-stat-label">Low Stock</div>
                    </div>
                </div>
                <div className="inventory-stat-card">
                    <div className="inventory-stat-icon inventory-stat-icon--categories">
                        🏷️
                    </div>
                    <div className="inventory-stat-content">
                        <div className="inventory-stat-value">
                            {stats.categories}
                        </div>
                        <div className="inventory-stat-label">Categories</div>
                    </div>
                </div>
            </div>

            <div className="inventory-toolbar-row">
                <div className="inventory-search-wrapper">
                    <ProductFilter
                        value={filterText}
                        onChange={setFilterText}
                        onSearch={handleToolbarSearch}
                    />
                </div>
                <div className="inventory-toolbar-actions">
                    <button
                        onClick={handleAddClick}
                        className="inventory-btn inventory-btn--primary"
                    >
                        + Add Product
                    </button>
                </div>
            </div>

            {error && <div className="inventory-error">{error}</div>}

            <div className="inventory-content-card">
                {loading && <div className="inventory-loading">Loading...</div>}

                {!loading && hasProducts && (
                    <ProductList
                        products={filteredProducts}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
                )}

                {!loading && !hasProducts && (
                    <div className="inventory-empty">
                        <p>No products found</p>
                        <button
                            onClick={handleAddClick}
                            className="inventory-btn inventory-btn--primary"
                        >
                            Add your first product
                        </button>
                    </div>
                )}
            </div>

            {isFormOpen && (
                <div className="modal-overlay" onClick={handleCloseForm}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <ProductForm
                            initialProduct={editingProduct}
                            onSave={handleSave}
                            onCancel={handleCloseForm}
                            saving={saving}
                        />
                    </div>
                </div>
            )}

            {deleteConfirm.isOpen && (
                <div className="modal-overlay" onClick={handleDeleteCancel}>
                    <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-modal-icon">
                            <span>⚠️</span>
                        </div>
                        <h3 className="delete-modal-title">Delete Product</h3>
                        <p className="delete-modal-message">
                            Are you sure you want to delete <strong>"{deleteConfirm.product?.name}"</strong>?
                        </p>
                        <p className="delete-modal-warning">
                            This action cannot be undone.
                        </p>
                        <div className="delete-modal-actions">
                            <button
                                onClick={handleDeleteCancel}
                                className="inventory-btn inventory-btn--secondary"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="inventory-btn inventory-btn--danger"
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductInventoryApp;
