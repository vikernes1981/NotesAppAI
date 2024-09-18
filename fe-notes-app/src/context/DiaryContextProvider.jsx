import { createContext } from "react";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

const DiaryContext = createContext();
const useDiaryContext = () => useContext(DiaryContext);

const DiaryContextProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [updateList, setUpdateList] = useState(false);

  console.log("Initial entries:", entries);


  useEffect(() => {
    console.log("Diary Context Provider: useEffect [updateList] triggered");
    
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_NOTES_API}/entries`
        );
        const entriesFromApi = await data
        setEntries(entriesFromApi);
        console.log("Diary Entries fetched:", entriesFromApi);
        console.log("Diary Entries set:", entries);
      } catch (error) {
        toast.error(error.message);
      }
    })();
  }, [updateList]);
  

  return (
    <DiaryContext.Provider value={{ entries, setEntries, setUpdateList }}>
      {children}
    </DiaryContext.Provider>
  );
};

export { DiaryContextProvider, useDiaryContext };
