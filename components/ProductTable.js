import React, { useState, useEffect } from 'react';

const ProductTable = ({ products }) => {
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState({ field: '', ascending: true });
  const [loading, setLoading] = useState(true); // Initial loading state

  // Simulate async data fetching with useEffect
  useEffect(() => {
    // Simulate fetching delay (remove in actual implementation)
    const fetchProducts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSortedProducts([...products]);
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false); // Handle error case by setting loading to false
      }
    };

    fetchProducts();
  }, [products]); // Run effect whenever products prop changes

  // Sort products based on field (slug, quantity, price)
  const sortProducts = (field) => {
    let newSortedProducts;
    if (sortOrder.field === field) {
      newSortedProducts = [...sortedProducts].sort((a, b) => {
        if (field === 'slug') {
          return sortOrder.ascending
            ? a[field].localeCompare(b[field])
            : b[field].localeCompare(a[field]);
        } else {
          return sortOrder.ascending ? a[field] - b[field] : b[field] - a[field];
        }
      });
      setSortOrder({ field, ascending: !sortOrder.ascending });
    } else {
      newSortedProducts = [...sortedProducts].sort((a, b) => {
        if (field === 'slug') {
          return a[field].localeCompare(b[field]);
        } else {
          return a[field] - b[field];
        }
      });
      setSortOrder({ field, ascending: true });
    }
    setSortedProducts(newSortedProducts);
  };

  // Handle delete product
  const handleDeleteProduct = async (action, slug, initialQuantity) => {
    try {
      // Remove the product from sortedProducts locally
      const updatedProducts = sortedProducts.filter(product => product.slug !== slug);
      setSortedProducts(updatedProducts);

      // Send delete action request to server
      setLoading(true);
      const response = await fetch('/api/action/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, slug, initialQuantity }),
      });
      
      if (!response.ok) {
        console.error('Failed to delete product');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="table-container max-h-96 overflow-y-auto">
        <div className="flex justify-center items-center h-full">
          <img width={74} src="/loading.svg" alt="Loading" />
        </div>
      </div>
    );
  }

  return (
    <div className="table-container max-h-96 overflow-y-auto">
      <table className="table-auto w-full bg-white rounded-md shadow-lg">
        <thead>
          <tr className="bg-indigo-300">
            <th className="px-4 py-2 text-left text-lg text-gray-800">
              <button onClick={() => sortProducts('slug')} className="focus:outline-none">
                Product Name {sortOrder.field === 'slug' && (sortOrder.ascending ? '▲' : '▼')}
              </button>
            </th>
            <th className="px-4 py-2 text-left text-lg text-gray-800">
              <button onClick={() => sortProducts('quantity')} className="focus:outline-none">
                Quantity {sortOrder.field === 'quantity' && (sortOrder.ascending ? '▲' : '▼')}
              </button>
            </th>
            <th className="px-4 py-2 text-left text-lg text-gray-800">
              <button onClick={() => sortProducts('price')} className="focus:outline-none">
                Price {sortOrder.field === 'price' && (sortOrder.ascending ? '▲' : '▼')}
              </button>
            </th>
            <th className="px-4 py-2 text-left text-lg text-gray-800">Actions</th> {/* New column for delete button */}
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map(product => (
            <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-300">
              <td className="px-4 py-2 text-gray-700">{product.slug}</td>
              <td className="px-4 py-2 text-gray-700">{product.quantity}</td>
              <td className="px-4 py-2 text-gray-700">₹{product.price}</td>
              <td className="px-4 py-2">
                <button onClick={() => handleDeleteProduct("del",product.slug)} className="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
