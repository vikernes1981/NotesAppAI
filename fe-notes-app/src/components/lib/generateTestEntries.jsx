import axios from "axios";

const generateTestEntries = async ({ setEntries }) => {
  const apiKey = import.meta.env.VITE_GEN_AI_API_KEY;

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
          content: `JSON mode. Generate 6 diary entries to be used for a mood analysis.
            Said diary entries are in JSON format and are provided in your response message under "diaryEntries".
            Each diary inside the JSON object should have following keys: id, date, title, image-url, content.
            Said image-url is a random cat image, the image-url is valdidated by you beforehand.`,
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

    testEntries.diaryEntries.map(async (entry) => {
      axios.post(`${import.meta.env.VITE_NOTES_API}/entries`, {
        title: entry.title,
        date: entry.date,
        author: "Hans",
        image: entry["image-url"],
        content: entry.content,
      });
    });

    setEntries(testEntries);
  } catch (error) {
    console.error("Error generating Data:", error.message);
  }
};

export default generateTestEntries;
