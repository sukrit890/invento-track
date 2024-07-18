
"use client"
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import Header from '@/components/Header';
import ProductTable from '@/components/ProductTable';
import NavigateToPieChartButton from '@/components/NavigateToPieChartButton';
import ClientSessionProvider from '../components/ClientSessionProvider';





export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}



export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [dropdown, setDropdown] = useState([]);



  // Fetch products on initial load
  useEffect(() => {
    const fetchProducts = async () => {

      try {
        const response = await fetch('/api/product/route');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Function to handle product quantity updates
  const buttonAction = async (action, slug, initialQuantity) => {
    try {
      // Update state based on action
      let newProducts;
      let newDropdown;

      if (action === 'del') {
        // Remove the item from products and dropdown lists
        newProducts = products.filter(product => product.slug !== slug);
        newDropdown = dropdown.filter(item => item.slug !== slug);
      } else {
        // Update quantity of the item in products and dropdown lists
        newProducts = products.map(product =>
          product.slug === slug
            ? { ...product, quantity: action === 'plus' ? product.quantity + 1 : product.quantity - 1 }
            : product
        );
        newDropdown = dropdown.map(item =>
          item.slug === slug
            ? { ...item, quantity: action === 'plus' ? item.quantity + 1 : item.quantity - 1 }
            : item
        );
      }

      setProducts(newProducts);
      setDropdown(newDropdown);

      // Send action request to server
      setLoadingAction(true);
      const response = await fetch('/api/action/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, slug, initialQuantity }),
      });
      if (!response.ok) {
        console.error('Failed to update product quantity or delete item');
      }
      setLoadingAction(false);
    } catch (error) {
      console.error('Error handling product action:', error);
    }
  };

  // Function to add a new product
  const addProduct = async (e) => {
    e.preventDefault();

    if (!productForm.slug || !productForm.quantity || !productForm.price) {
      setAlert("Name, quantity, and price are required fields.");
      return;
    }
    try {
      const response = await fetch('/api/product/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        const newProduct = await response.json();

        // Update the products state with the new product
        setProducts(prevProducts => [...prevProducts, newProduct.product]);
        // Product added successfully
        setAlert('Your Product has been added!');
        setProductForm({});
        // Fetch all products again to update the products state
        const productsResponse = await fetch('/api/product/route');
        const productsData = await productsResponse.json();

        setProducts(productsData.products);

      } else {
        // Handle error case
        console.error('Error adding product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to handle form input changes
  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  // Function to handle search input changes
  const onDropdownEdit = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      setLoading(true);
      setDropdown([]);
      try {
        const response = await fetch('/api/search/route?query=' + encodeURIComponent(value));
        if (response.ok) {
          const data = await response.json();
          setDropdown(data.products);
        } else {
          console.error('Failed to fetch search results');
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setDropdown([]);
      setLoading(false); // Ensure loading state is reset when value.length <= 3
    }


  };

  return (
  
      <ClientSessionProvider>
        <div className="absolute top-0 z-[-2]  w-screen  bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] overflow-hidden">
          <Header />
          <div className="container mx-auto my-8">
        
            <h1 className="text-4xl text-white font-bold text-center mb-6">Search a Product</h1>
            <div className="flex mb-4 justify-center">

              <input onChange={onDropdownEdit} type="text" placeholder="Enter a product name" className="flex-1 max-w-md border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300" />

            </div>
            {loading && (
              <div className="flex justify-center items-center">
                <img width={74} src="/loading.svg" alt="Loading" />
              </div>
            )}
            {dropdown.length > 0 && (
              <div className="dropcontainer w-full max-w-3xl mx-auto bg-white rounded-md shadow-lg mt-4">
                {dropdown.map((item) => (
                  <div key={item.slug} className="flex justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition duration-300">
                    <span className="text-lg font-medium text-gray-700">{item.slug} ({item.quantity} available for ₹{item.price})</span>
                    <div className="flex items-center space-x-3">
                      <button onClick={() => buttonAction("minus", item.slug, item.quantity)} disabled={loadingAction} className="px-3 py-1 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 disabled:bg-indigo-200 transition duration-300">-</button>
                      <span className="text-lg">{item.quantity}</span>
                      <button onClick={() => buttonAction("plus", item.slug, item.quantity)} disabled={loadingAction} className="px-3 py-1 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 disabled:bg-indigo-200 transition duration-300">+</button>
                      <button onClick={() => buttonAction("del", item.slug)} disabled={loadingAction} className="px-3 py-1 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 disabled:bg-red-200 transition duration-300">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="container mx-auto my-8">
          {alert && <div className="text-green-800 text-center mb-4">{alert}</div>}
            <h1 className="text-4xl text-white font-bold text-center mb-6">Add a Product</h1>
            <form onSubmit={addProduct} className="max-w-lg mx-auto bg-white p-6 rounded-md shadow-lg">
              <div className="mb-4">
                <label htmlFor="slug" className="block text-lg font-medium text-gray-700 mb-2">Product Name</label>
                <input value={productForm.slug || ""} name='slug' onChange={handleChange} type="text" id="slug" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300" />
              </div>
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-lg font-medium text-gray-700 mb-2">Quantity</label>
                <input value={productForm.quantity || ""} name='quantity' onChange={handleChange} type="number" id="quantity" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300" />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-lg font-medium text-gray-700 mb-2">Price</label>
                <input value={productForm.price || ""} name='price' onChange={handleChange} type="number" id="price" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300" />
              </div>
              <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-900 text-white py-2 rounded-md shadow-md font-semibold transition duration-300">Add Product</button>
            </form>

          </div>

          <div className="container mx-auto my-8">
            <h1 className="text-4xl text-white font-bold text-center mb-6">Inventory Status</h1>
            <div className="container mx-auto">
     
      <NavigateToPieChartButton />
    </div>
    <div className="container mx-auto my-8">
        
          <ProductTable products={products} />
        </div>

          </div>
    
        </div>
      </ClientSessionProvider>
    
  );
}