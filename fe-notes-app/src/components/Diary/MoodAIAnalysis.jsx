import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Charts from "./Charts"; // Import Charts component
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js"; // Import ChartJS components

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const apiKey = import.meta.env.VITE_GEN_AI_API_KEY;

const MoodAIAnalysis = ({ entries }) => {
  const modalRef = useRef();
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState(null); // To store AI result
  const [toneValues, setToneValues] = useState(null);

  const entriesJson = JSON.stringify(entries);

  const handleAISummary = async () => {
    setLoading(true); // Start loading state

    try {
      const myHeaders = new Headers();
      myHeaders.append("provider", "open-ai");
      myHeaders.append("mode", "production");
      const authorizationValue = `${apiKey}`;
      myHeaders.append("Authorization", authorizationValue); // Ensure this is correctly set
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        model: "gpt-4o",
        stream: false,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: `You are a mood analysis bot. Analyze the mood of this diary entries. 
            Said diary entries are provided in the request body as a JSON object. 
            You will output a JSON object with the first key being "summary" of the mood as a string and 
            you will provide a second key being "moodAnalysis" in quantitative measureable metrics.
            Said metrics reflect a score between 0 and 100.            
            Said mood analysis consists of following keys:
            "overallMood", "tone", "overallTone".
            The "tone" consists of "positive", "negative", "neutral".
            Here is the JSON object of the entries: ${entriesJson}`,
          },
        ],
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "https://gen-ai-wbs-consumer-api.onrender.com/api/v1/chat/completions",
        requestOptions
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch AI analysis: ${errorText}`);
      }
      const data = await response.json();
      const botMessage = JSON.parse(
        data.message.content.replace(/[\n\/]/g, "")
      ); // Remove new lines and slashes

      console.log("AI Response:", botMessage);

      // Extract
      setAiSummary(botMessage.summary);
      setToneValues(botMessage.moodAnalysis.tone);
      toast.success("AI Analysis Generated");
    } catch (error) {
      console.error("Error fetching AI summary:", error.message);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  const chartData =
    aiSummary && typeof aiSummary === "string"
      ? {
          labels: ["Positive", "Negative", "Neutral"],
          datasets: [
            {
              label: "Mood Analysis",
              data: [
                toneValues.positive,
                toneValues.negative,
                toneValues.neutral,
              ],
              backgroundColor: [
                "rgba(75, 192, 192, 0.2)",
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
              ],
              borderWidth: 1,
            },
          ],
        }
      : null;

  return (
    <>
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => modalRef.current.showModal()}
          className="bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-full shadow-lg w-10 h-10"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Loading..." : "✨"} {/* Loading feedback */}
        </button>
      </div>
      <dialog id="modal-note" className="modal" ref={modalRef}>
        <div className="modal-box h-[600px] py-0 w-11/12 max-w-5xl">
          <div className="modal-action items-center justify-between mb-2">
            <h1 className="text-2xl text-center">
              Get your AI Gen Mood Analysis
            </h1>
            <form method="dialog">
              <button className="btn">&times;</button>
            </form>
          </div>
          <div className="flex items-center gap-3">
            <div className="textarea textarea-success w-1/2 h-[400px] overflow-y-scroll">
              {loading
                ? "Loading AI Summary..."
                : aiSummary
                ? JSON.stringify(aiSummary, null, 2)
                : "AI SUMMARY GOES HERE..."}
            </div>
            <div className="textarea textarea-success w-1/2 h-[400px] overflow-y-scroll">
              {chartData ? (
                <Charts chartData={chartData} /> // Use the Charts component to display the chart
              ) : (
                "No data available for chart"
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="mt-5 btn bg-purple-500 hover:bg-purple-400 text-white"
              onClick={handleAISummary}
              disabled={loading} // Disable while loading
            >
              {loading ? "Loading..." : "Gen AI mood analysis ✨"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default MoodAIAnalysis;
