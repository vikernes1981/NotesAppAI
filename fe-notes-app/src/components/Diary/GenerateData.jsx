// import generateTestEntries from "../lib/generateTestEntries";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function GenerateData({ setEntries, setUpdateList }) {
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_GEN_AI_API_KEY;

  const generateTestEntries = async () => {
    try {
      setLoading(true);

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
            content: `JSON mode. Generate 8 diary entries to be used for a mood analysis.
  
            The tone of the diary entries should be very negative and depressing.
  
              Said diary entries are in JSON format and are provided in your response message under "diaryEntries".
              Each diary inside the JSON object should have following keys: id, date, title, image-url, content.
              Each image-url will be a web url showing a random cat image, its existence validated by your beforehand.`,
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
      console.log("Generated Data:", data);

      const testEntries = JSON.parse(data.message.content);

      console.log("Test Entries:", testEntries.diaryEntries);

      const promiseAllEntriedAddedToDb = new Promise((resolve, reject) => {
        resolve(
          testEntries.diaryEntries.map((entry) => {
            axios.post(`${import.meta.env.VITE_NOTES_API}/entries`, {
              title: entry.title,
              date: entry.date,
              author: "Hans",
              image: entry["image-url"],
              content: entry.content,
            });
          })
        );
      });

      promiseAllEntriedAddedToDb.then(() => setUpdateList((prev) => !prev));
      // promiseAllEntriedAddedToDb.then(() => setEntries(testEntries.diaryEntries));

      toast.success("Test Entries Generated");
      setLoading(false);

      // alert("Test Entries Generated");
    } catch (error) {
      console.error("Error generating Data:", error.message);
      setLoading(false);
      // alert("Test Entries Generated");
      toast.error("Error generating Data");
    }
  };

  return (
    <div className="fixed bottom-4 right-28">
      {loading ? (
        <button
          onClick={() => generateTestEntries()}
          className="bg-red-300 text-white font-bold py-2 px-4 rounded-xl shadow-lg cursor-wait"
        >
          Loading Test Entries...
        </button>
      ) : (
        <button
          onClick={() => generateTestEntries()}
          className="bg-blue-500 hover:bg-red-300 text-white font-bold py-2 px-4 rounded-xl shadow-lg"
        >
          Generate Test Entries
        </button>
      )}
    </div>
  );
}

export default GenerateData;
