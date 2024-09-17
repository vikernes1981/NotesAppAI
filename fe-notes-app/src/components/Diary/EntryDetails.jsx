import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getImage from "../lib/getImage";
import { toast } from "react-toastify";
import { useDiaryContext } from "@/context/DiaryContextProvider";

function EntryDetails() {
  const { entryId } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {entries, setEntries, setUpdateList } = useDiaryContext();

  const getEntry = async () => {
    try {
      const data = await axios.get(
        `${import.meta.env.VITE_NOTES_API}/entries/${entryId}`
      );
      console.log(data.data);
      setEntry(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getEntry();
  }, []);

  const generateImage = async () => {
    if (entry === null) return;
    setLoading(true);
    const imageUrl = await getImage({ content: entry.content });
    console.log(imageUrl);
    const newEntry = { ...entry, image: imageUrl };
    console.log(newEntry);
    setEntry(newEntry);
    await axios.put(
      `${import.meta.env.VITE_NOTES_API}/entries/${entryId}`,
      newEntry
    );
    setEntries(newEntry, ...entries.filter((e) => e.id !== entryId));
    console.log(entries);
    
    setLoading(false);
    // alert("Image Generated");
    toast.success("Image Generated");
    setUpdateList((prev) => !prev);
  };

  return entry === null ? (
    <div>Loading...</div>
  ) : (
    <div className="flex justify-center p-5 font-sans w-full box-border">
      <div className="card w-full max-w-lg shadow-lg rounded-lg overflow-hidden bg-white">
        <div className="p-5 bg-base-100">
          <button
            onClick={() => navigate("/")}
            className="btn btn-error text-white"
          >
            X
          </button>
          <h1 className="text-center text-2xl font-bold">{entry.title}</h1>
        </div>
        <div className="flex items-center justify-center">
          <img src={entry.image} alt={entry.title} className="w-[50%]" />
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
        {loading ? (<button onClick={generateImage} className="btn bg-red-400 hover:bg-red-500 text-white cursor-wait">
          Image is being generated... Please wait
        </button>) : (
        <button onClick={generateImage} className="btn btn-primary text-white">
          Generate Image
        </button>) 

}
      </div>
    </div>
  );
}

export default EntryDetails;
