import { Bar } from 'react-chartjs-2';

const Charts = ({ chartData }) => {
  return (
    <div>
      <Bar data={chartData} />
    </div>
  );
};

export default Charts;