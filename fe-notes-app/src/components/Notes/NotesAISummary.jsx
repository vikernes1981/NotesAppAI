import { useRef, useState } from 'react';

const apiKey = import.meta.env.VITE_GEN_AI_API_KEY;

const NotesAISummary = ({ notes }) => {
  const modalRef = useRef();
  const resultsRef = useRef();
  const [stream, setStream] = useState(false);
  const [aiSummary, setAiSummary] = useState(null); // To store AI result

  const notesJson = JSON.stringify(notes);

  const handleAISummary = async () => {
    setStream(true);
    try {
      console.log('Starting AI summary generation...');
      const myHeaders = new Headers();
      myHeaders.append("provider", "open-ai");
      myHeaders.append("mode", "production");
      myHeaders.append("Authorization", `${apiKey}`); // Corrected header format
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        model: "gpt-4o",
        stream: false,
        response_format: { type: "json_object" },
        messages: [
          {
        role: "user",
        content: `I have a list of notes with titles. For each note, read the content, then create a brief summary of the main points or key information. Display each summary UNDER the corresponding title. Please format it as follows:
      
        **Title of the Note**
        
        Summary: [Brief summary of the note content]

        Here is the list of notes:
        ${notesJson}

        Please provide only the summary content in JSON format.`
          }
        ]
      });
      console.log(notesJson)
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch('https://gen-ai-wbs-consumer-api.onrender.com/api/v1/chat/completions', requestOptions);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error(`Failed to fetch AI analysis: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      
      const cleanedContent = data.message?.content?.replace(/[\n\/\{\}\[\]]/g, '')
        .replace(/"notes":|"title":|"date":|"summary":/gi, '') || 'No summary available';
      console.log('Type of cleanedContent:', typeof cleanedContent);
      setAiSummary(cleanedContent);
      console.log('AI Summary:', cleanedContent);
    } catch (error) {
      console.error('Error fetching AI summary:', error.message);
      setAiSummary({ error: error.message }); // Handle error by setting error message in state
    } finally {
      setStream(false); // Stop loading state
      console.log('Finished AI summary generation.');
    }
  };

  return (
    <>
      <div className='fixed bottom-4 right-4'>
        <button
          onClick={() => modalRef.current.showModal()}
          className='bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-full shadow-lg w-10 h-10'
          aria-label='Open AI Summary Modal'
        >
          ✨
        </button>
      </div>
      <dialog id='modal-note' className='modal' ref={modalRef}>
        <div className='modal-box h-[600px] py-0'>
          <div className='modal-action items-center justify-between mb-2'>
            <h1 className='text-2xl text-center'>Get AI Gen Summary</h1>
            <label htmlFor='stream' className='flex items-center gap-1'>
              Stream?
              <input
                id='stream'
                type='checkbox'
                className='toggle toggle-error'
                checked={stream}
                onChange={() => setStream(prev => !prev)}
              />
            </label>
            <form method='dialog'>
              <button className='btn'>&times;</button>
            </form>
          </div>
          <div className='flex flex-col items-center gap-3'>
            <div
              className='textarea textarea-success w-full h-[400px] overflow-y-scroll'
              ref={resultsRef}
            >
              {aiSummary ? (aiSummary.error ? `Error: ${aiSummary.error}` : aiSummary) : 'AI SUMMARY GOES HERE'}
            </div>
            <button
              className='mt-5 btn bg-purple-500 hover:bg-purple-400 text-white'
              onClick={handleAISummary}
            >
              Gen AI Summary ✨
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NotesAISummary;
