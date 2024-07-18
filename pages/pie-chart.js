import { useEffect, useState, useRef } from "react";
import { Chart } from "chart.js";
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import Header from '@/components/Header';




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

function Example() {
  const [products, setProducts] = useState([]);
  const chartRef = useRef(null); 
  const [loading, setLoading] = useState(true);
   const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/product/route');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched products:', data.products);
          setProducts(data.products);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }finally{
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const ctx = chartRef.current.getContext("2d");
      const colors = generateColors(products);

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: products.map(product => product.slug),
          datasets: [{
            data: products.map(product => product.quantity),
            borderColor: colors.borderColors,
            backgroundColor: colors.backgroundColors,
            borderWidth: 2,
          }]
        },
        options: {
          scales: {
            xAxes: [{
              display: false,
            }],
            yAxes: [{
              display: false,
            }],
          }
        },
      });
    }
  
  }, [products]);
  const generateColors = (products) => {
    const borderColors = [];
    const backgroundColors = [];
    const maxQuantity = Math.max(...products.map(product => product.quantity));
    const minQuantity = Math.min(...products.map(product => product.quantity));
    const maxIndex = products.findIndex(product => product.quantity === maxQuantity);
    const minIndex = products.findIndex(product => product.quantity === minQuantity);

    for (let i = 0; i < products.length; i++) {
      if (i === maxIndex) {
        borderColors.push('green');
        backgroundColors.push('rgb(0,255,0)');
      } else if (i === minIndex) {
        borderColors.push('red');
        backgroundColors.push('rgb(255,0,0)');
      } else {
        const color = `hsl(${Math.round(i * (360 / products.length))}, 100%, 50%)`;
        borderColors.push(color);
        backgroundColors.push(`${color.slice(0, color.length - 1)}, 0.1)`);
      }
    }

    return { borderColors, backgroundColors };
  };

  const navigateToDashboard = () => {
    console.log("here is the button");
  router.push('/');
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img width={50} src="/loading.svg" alt="Loading" />
      </div>
    );
  }
  return (
    
    <div className="absolute top-0 z-[-2] w-screen overflow-x-auto   bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] ">

    <Header />
    <div className="flex-col">
  
      <div className="flex flex-col items-center justify-center ">
        <div className="bg-gray-700 m-6 py-8 rounded-lg shadow-xl p-6 w-[500px] mx-auto">
          <h1 className="text-xl font-semibold text-white capitalize mb-4">Interactive Pie Chart</h1>
          <ul className="text-white list-disc space-y-3 pl-5">
          <li>Each slice of the pie corresponds to product's name, and the size of each slice represents the quantity of that product relative to others.</li>
          <li>The colour scheme is dynamically generated based on the number of products and their quantities.</li>
          <li>The largest quantity is depicted by solid green and the smallest quantity is depicted by solid re</li>
        </ul>
        </div>
      </div>
  
    <div className="w-[1100px] overflow-visible h-screen flex mx-auto my-auto">
      <div className='border border-gray-400 pt-0 rounded-xl w-full h-fit my-auto shadow-xl pb-2'>
        <canvas id='myChart' ref={chartRef}></canvas>
        <div className="flex justify-center mt-4">
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md w-[300px]">
            <h2 className="text-lg font-semibold mb-2">Colour Legend</h2>
            <p className="mb-1"><span className="inline-block w-4 h-4 bg-green-300 mr-2"></span> Largest Quantity</p>
            <p><span className="inline-block w-4 h-4 bg-red-500 mr-2"></span> Smallest Quantity</p>
          </div>
        </div>
        <div className="w-full flex justify-center mt-4">
          <button
            onClick={navigateToDashboard}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
            </div>
  
    
  );
}

export default Example;
