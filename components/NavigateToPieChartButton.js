import { useRouter } from 'next/router';

const NavigateToPieChartButton = () => {
  const router = useRouter();

  const navigateToPieChart = () => {
    router.push('/pie-chart');
  };

  return (
    
    <div className="flex gap-5 align-botto  justify-center mt-8">
          <div className="text-lg text-green-600 text-center mt-4">Explore our charts :</div>
      <button
        onClick={navigateToPieChart}
        className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
          Generate Pie Chart
      </button>
    </div>
  );
};

export default NavigateToPieChartButton;
