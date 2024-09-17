import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EntryDetails({ entries }) {
  const { entryId } = useParams();
  const modalRef = useRef(null);
  const [entry, setEntry] = useState(null);
  const navigate = useNavigate();

  const generateImage = async () => {
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await axios.get(
          `${import.meta.env.VITE_NOTES_API}/entries/${entryId}`
        );
        console.log(data.data);
        setEntry(data.data);
      } catch (error) {
        console.error(error);
      }
    })(),
      [];
  });

  return entry === null ? (
    <div>Loading...</div>
  ) : (
    // <dialog id='modal-note' className='modal' ref={modalRef}>
    <div className="flex justify-center p-5 font-sans w-full box-border">

      <div className="card w-full max-w-lg shadow-lg rounded-lg overflow-hidden bg-white">

        <div className="p-5 bg-base-100">
        <button onClick={() => navigate("/")} className="btn btn-error text-white">X</button>
          <h1 className="text-center text-2xl font-bold">{entry.title}</h1>
          <p className="text-lg text-center">{entry.description}</p>
        </div>
        <div className="flex justify-around p-5 bg-base-100">
          <div className="flex-1 p-2">
            <p>
              <strong>Date:</strong> {new Date(entry.date).toDateString()}
            </p>
            <p>
              <strong>Content:</strong> {entry.content}
            </p>
          </div>
        </div>
        <button onClick={generateImage} className="btn btn-primary text-white">Generate Image</button>
        
      </div>
    </div>
    // </dialog>
  );
}

export default EntryDetails;
