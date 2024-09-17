import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { RootLayout } from "@/layouts";
import { Diary, SchoolNotes } from "@/pages";
import { EntryDetails } from "./components/Diary";
import { DiaryContextProvider } from "./context/DiaryContextProvider";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Diary />} />
      <Route path="diary/:entryId" element={<EntryDetails />} />

      <Route path="school-notes" element={<SchoolNotes />} />
    </Route>
  )
);

const App = () => (
  <DiaryContextProvider>
    <RouterProvider router={router} />
  </DiaryContextProvider>
);

export default App;
