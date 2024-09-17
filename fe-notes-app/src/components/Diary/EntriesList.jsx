import EntryCard from './EntryCard';
import { Link } from 'react-router-dom';

const EntriesList = ({ entries }) => {
  if (!entries.length) return <p className='p-5 text-center'>No diary entries available</p>;

  return (
    <div className='p-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
      {entries.map(e => (
        <Link key={e._id} to={`/diary/${e._id}`}>
        <EntryCard entry={e} />
        </Link>
      ))}
    </div>
  );
};

export default EntriesList;
