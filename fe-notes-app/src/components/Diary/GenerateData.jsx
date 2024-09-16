import generateTestEntries from "../lib/generateTestEntries"


function GenerateData( {setEntries} ) {
  return (
    <div className='fixed bottom-4 right-28'>
    <button
      onClick={() => generateTestEntries({setEntries})}
      className='bg-blue-500 hover:bg-red-300 text-white font-bold py-2 px-4 rounded-xl shadow-lg'
    >
      Generate Test Entries (Wait until console shows output then Refresh page)
    </button>
  </div>
  )
}

export default GenerateData