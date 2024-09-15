import { Bar } from 'react-chartjs-2';

const Charts = ({ aiSummary }) => {
  return (
    <div>
      <Bar data={aiSummary} />
    </div>
  );
};

export default Charts;