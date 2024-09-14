import { useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import Charts from './Charts'; // Import Charts component

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
const apiKey = import.meta.env.VITE_GEN_AI_API_KEY;
const MoodAIAnalysis = ({ entries }) => {
  const modalRef = useRef();
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState(null); // To store AI result

  console.log('Entries:', entries); // Log the entries values

  const handleAISummary = async () => {
    setLoading(true); // Start loading state

    try {
      const myHeaders = new Headers();
      myHeaders.append("provider", "open-ai");
      myHeaders.append("mode", "production");

      console.log('API Key:', apiKey); // Log the API key to ensure it's being read correctly
      const authorizationValue = `${apiKey}`;
      console.log('Authorization Value:', authorizationValue); // Log the authorization value
      myHeaders.append("Authorization", authorizationValue); // Ensure this is correctly set
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        model: "gpt-4o",
        stream: false,
        messages: [
          {
            role: "system",
            content: "You are quite dramatic"
          },
          {
            role: "user",
            content: `Analyze the mood of this diary entry: ${entries.map(entry => entry.content).join(' ')}`
          }
        ]
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      console.log(`Entries after join: ${entries.map(entry => entry.content).join(' ')}`); // Log the entries values

      const response = await fetch('https://gen-ai-wbs-consumer-api.onrender.com/api/v1/chat/completions', requestOptions);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response Text:', errorText);
        throw new Error(`Failed to fetch AI analysis: ${errorText}`);
      }
      const data = await response.json();
      data.message.content = data.message.content.replace(/[\n\/]/g, ''); // Remove new lines and slashes


      console.log('AI Response Data:', data);

      // Extract and set only the content from the response
      setAiSummary(data.message.content);
    } catch (error) {
      console.error('Error fetching AI summary:', error.message);
      setAiSummary({ error: error.message }); // Handle error by setting error message in state
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  // Example chart data for Chart.js
  

  const chartData = aiSummary && typeof aiSummary.moodBreakdown === 'object' ? {
    labels: Object.keys(aiSummary.moodBreakdown), // Using moodBreakdown from API response
    datasets: [{
      label: 'Mood Breakdown',
      data: Object.values(aiSummary.moodBreakdown),
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1,
    }],
  } : null;

  return (
    <>
      <div className='fixed bottom-4 right-4'>
        <button
          onClick={() => modalRef.current.showModal()}
          className='bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-full shadow-lg w-10 h-10'
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Loading...' : '✨'} {/* Loading feedback */}
        </button>
      </div>
      <dialog id='modal-note' className='modal' ref={modalRef}>
        <div className='modal-box h-[600px] py-0 w-11/12 max-w-5xl'>
          <div className='modal-action items-center justify-between mb-2'>
            <h1 className='text-2xl text-center'>Get your AI Gen Mood Analysis</h1>
            <form method='dialog'>
              <button className='btn'>&times;</button>
            </form>
          </div>
          <div className='flex items-center gap-3'>
            <div className='textarea textarea-success w-1/2 h-[400px] overflow-y-scroll'>
              {loading ? 'Loading AI Summary...' : (aiSummary ? JSON.stringify(aiSummary, null, 2) : 'AI SUMMARY GOES HERE...')}
            </div>
            <div className='textarea textarea-success w-1/2 h-[400px] overflow-y-scroll'>
              {chartData ? (
                <Charts data={chartData} /> // Use the Charts component to display the chart
              ) : (
                'No data available for chart'
              )}
            </div>
          </div>
          <div className='flex justify-center'>
            <button
              className='mt-5 btn bg-purple-500 hover:bg-purple-400 text-white'
              onClick={handleAISummary}
              disabled={loading} // Disable while loading
            >
              {loading ? 'Loading...' : 'Gen AI mood analysis ✨'}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );

};

export default MoodAIAnalysis;
