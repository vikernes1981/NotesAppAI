import { CreateEntry, MoodAIAnalysis, EntriesList, GenerateData } from "@/components/Diary";
import { useDiaryContext } from "@/context/DiaryContextProvider";

const Diary = () => {

  const { entries, setEntries } = useDiaryContext();

  return (
    <>
      <EntriesList entries={entries} />
      <CreateEntry setEntries={setEntries} />
      <MoodAIAnalysis entries={entries} />
      <GenerateData setEntries={setEntries} />
    </>
  );
};

export default Diary;
