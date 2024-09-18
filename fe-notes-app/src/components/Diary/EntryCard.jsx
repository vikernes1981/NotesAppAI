import React, { useState } from 'react'
;
const EntryCard = ({ entry }) => {

  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className='card bg-base-100 shadow-xl hover:bg-teal-200 cursor-pointer'>
      <figure className='bg-white h-48'>
        {!isLoaded && <div className='flex justify-center items-center h-full'>Loading...</div>}
        <img onLoad={handleImageLoad} src={entry.image} alt={entry.title} className='object-cover h-full w-full' />
      </figure>
      <div className='card-body h-56'>
        <h2 className='card-title'>{entry.title}</h2>
        <h3 className='font-bold'>{new Date(entry.date).toDateString()}</h3>
        <p className='truncate text-wrap'>{entry.content}</p>
      </div>
    </div>
  );
};

export default EntryCard;
