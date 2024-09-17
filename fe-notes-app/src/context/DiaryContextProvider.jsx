import { createContext } from "react";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

const DiaryContext = createContext();
const useDiaryContext = () => useContext(DiaryContext);

const DiaryContextProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [updateList, setUpdateList] = useState(false);
  
  // useEffect(() => {
  //   console.log("Diary Context Provider: useEffect [] triggered");

  //   (async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `${import.meta.env.VITE_NOTES_API}/entries`
  //       );
  //       setEntries(data);
  //     } catch (error) {
  //       toast.error(error.message);
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    console.log("Diary Context Provider: useEffect [updateList] triggered");
    
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_NOTES_API}/entries`
        );
        setEntries(data);
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
