import { useRef, useState } from 'react';

const apiKey = import.meta.env.VITE_GEN_AI_API_KEY;

const NotesAISummary = ({ notes }) => {
  const modalRef = useRef();
  const resultsRef = useRef();
  const [stream, setStream] = useState(false);
  const [aiSummary, setAiSummary] = useState(null); // To store AI result

  const handleAISummary = async () => {
    setStream(true);
    try {
      console.log('Starting AI summary generation...');
      const myHeaders = new Headers();
      myHeaders.append("provider", "open-ai");
      myHeaders.append("mode", "production");
      const authorizationValue = `${apiKey}`;
      myHeaders.append("Authorization", authorizationValue); // Ensure this is correctly set
      myHeaders.append("Content-Type", "application/json");

      console.log('Headers:', myHeaders);

      const raw = JSON.stringify({
        model: "gpt-4",
        stream: false,
        messages: [
          {
        role: "system",
        content: "You are quite dramatic"
          },
          {
        role: "user",
        content: `Give me a summary of this note's entry: ${notes[0]?.content || ''}`
          }
        ]
      });

      console.log('Request body:', raw);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      console.log('Request options:', requestOptions);

      const response = await fetch('https://gen-ai-wbs-consumer-api.onrender.com/api/v1/chat/completions', requestOptions);
      console.log('Response:', response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error(`Failed to fetch AI analysis: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      data.message.content = data.message.content.replace(/[\n\/]/g, ''); // Remove new lines and slashes
      
      // Extract and set only the content from the response
      setAiSummary(data.message.content);
      console.log('AI Summary:', data.message.content);
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
          onClick={() => {
            console.log('Opening modal...');
            modalRef.current.showModal();
          }}
          className='bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-full shadow-lg w-10 h-10'
        >
          ✨
        </button>
      </div>
      <dialog id='modal-note' className='modal' ref={modalRef}>
        <div className='modal-box h-[600px] py-0'>
          <div className='modal-action items-center justify-between mb-2'>
            <h1 className='text-2xl text-center'>Get AI Gen summary</h1>
            <label htmlFor='Stream?' className='flex items-center gap-1'>
              Stream?
              <input
                id='Stream?'
                type='checkbox'
                className='toggle toggle-error'
                checked={stream}
                onChange={() => {
                  console.log('Toggling stream:', !stream);
                  setStream(p => !p);
                }}
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
              {aiSummary ? aiSummary.error ? `Error: ${aiSummary.error}` : aiSummary : 'AI SUMMARY GOES HERE'}
            </div>
            <button
              className='mt-5 btn bg-purple-500 hover:bg-purple-400 text-white'
              onClick={handleAISummary}
            >
              Gen AI summary ✨
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NotesAISummary;
