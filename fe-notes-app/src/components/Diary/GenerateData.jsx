import generateTestEntries from "../lib/generateTestEntries";
import { useState } from "react";

function GenerateData({ setEntries }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed bottom-4 right-28">
      {loading ? (
        <button
          onClick={() => generateTestEntries({ setEntries, setLoading })}
          className="bg-red-300 text-white font-bold py-2 px-4 rounded-xl shadow-lg cursor-wait"
        >
          Loading Test Entries...
        </button>
      ) : (
        <button
          onClick={() => generateTestEntries({ setEntries, setLoading })}
          className="bg-blue-500 hover:bg-red-300 text-white font-bold py-2 px-4 rounded-xl shadow-lg"
        >
          Generate Test Entries
        </button>
      )}
    </div>
  );
}

export default GenerateData;
