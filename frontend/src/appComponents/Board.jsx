import { useState } from 'react';

const initialLists = {
   Todo: ['Create backend API', 'frontend integration', 'Bugs solving'],
   InProgress: ['Payment Gateway Integration', 'Styling'],
   Done: ['Web Designing'],
};

const Board = () => {
   const [lists, setLists] = useState(initialLists);
   const [draggedItem, setDraggedItem] = useState(null);
   const [draggedFromList, setDraggedFromList] = useState('');

   const handleDragStart = (item, listKey) => {
      setDraggedItem(item);
      setDraggedFromList(listKey);
   };

   const handleDrop = (e, listKey) => {
      e.preventDefault();
      if (draggedItem !== null) {
         const newLists = { ...lists };
         newLists[draggedFromList] = newLists[draggedFromList].filter(
            (item) => item !== draggedItem
         );
         newLists[listKey] = [...newLists[listKey], draggedItem];
         setLists(newLists);
         console.log(newLists);
         setDraggedItem(null);
         setDraggedFromList('');
      }
   };

   const handleDragOver = (e) => {
      e.preventDefault();
   };

   return (
      <div className="flex flex-col min-h-screen p-4 space-x-4 justify-top">
         <div>
            <div className='p-2 font-semibold'>Projects/HackEra</div>
         </div>
         <div className='flex gap-4'>
            {Object.keys(lists).map((key) => (
               <div
                  key={key}
                  id={key}
                  className="relative flex flex-col items-center p-4 pt-12 overflow-x-hidden bg-white border border-gray-300 rounded-md w-80 h-80"
                  onDrop={(e) => handleDrop(e, key)}
                  onDragOver={handleDragOver}
               >
                  <h2 className="absolute mb-2 text-lg font-semibold text-slate-400 top-2 left-4">{key}</h2>
                  {lists[key].map((item, index) => (
                     <div
                        key={index}
                        draggable
                        onDragStart={() => handleDragStart(item, key)}
                        className="p-2 m-1 bg-neutral-100 border border-gray-200 cursor-move w-[100%] rounded"
                     >
                        {item}
                     </div>
                  ))}
               </div>
            ))}
         </div>
      </div>
   );
};

export default Board;
