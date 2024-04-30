import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import MaterialSymbolsContentCopy from './components/MaterialSymbolsContentCopy';

export default function App() {
  const apiendpoint = "https://sheapiuat.kyawphyothu.com"
  const [chawSuList, setChawSuList] = useState([]);
  const [newChawSuName, setNewChawSuName] = useState('');
  const [clickedCopyIconIndex, setClickedCopyIconIndex] = useState(null);

  const inputRef = useRef();

  useEffect(() => {
    fetchChawSuList();
  }, []);

  const fetchChawSuList = async () => {
    try {
      const response = await axios.get(`${apiendpoint}/chaw_su`);
      setChawSuList(response.data);
    } catch (error) {
      console.error('Error fetching chaw_su:', error);
    }
  };

  const handleCreateChawSu = async () => {
    if(!newChawSuName) return;
    try {
      const response = await axios.post(`${apiendpoint}/chaw_su`, { name: newChawSuName });
      console.log(response.data);
      fetchChawSuList(); // Refresh the chaw_su list after creating a new one
      setNewChawSuName("")
      inputRef.current.focus();
    } catch (error) {
      console.error('Error creating chaw_su:', error);
    }
  };

  const handleDeleteChawSu = async (id) => {
    try {
      const response = await axios.delete(`${apiendpoint}/chaw_su/${id}`);
      console.log(response.data);
      fetchChawSuList(); // Refresh the chaw_su list after deleting one
    } catch (error) {
      console.error('Error deleting chaw_su:', error);
    }
  };

  const handleCopyText = (text, id) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setClickedCopyIconIndex(id); // Set the index of the clicked copy icon
    setTimeout(() => {
      setClickedCopyIconIndex(null); // Reset the index after 2 seconds
    }, 2000);
  };

  return (
    <div className='w-full h-full flex flex-col items-center space-y-5 py-8'>
      <div className='flex space-x-3 items-center'>
        <textarea
          rows={4}
          className='w-96 px-3 py-2 bg-black/20 outline-0 rounded-md'
          type="text"
          value={newChawSuName}
          ref={inputRef}
          onChange={(e) => setNewChawSuName(e.target.value)}
        />
        <button
          className='bg-black text-white h-10 w-10 rounded-md'
          onClick={handleCreateChawSu}
          >
          +
        </button>
      </div>

      <div className='w-96 flex flex-col space-y-3'>
        {
          chawSuList.map(i => {
            const names = i.name.split('///');
            return (
              <React.Fragment key={i.id}>
                <div className='flex'>
                  <div className='bg-black/30 px-2 py-1 rounded-tl-md rounded-bl-md'>{names.length === 2 && names[0]}:</div>
                  <div className='border-black/30 px-2 py-1 border-2 flex-grow overflow-clip whitespace-nowrap truncate'>{names.length===2?names[1]:names[0]}</div>
                  <div className='flex gap-3 ml-2 items-center'>
                    <div
                      className='cursor-pointer'
                      onClick={() => handleCopyText(names.length===2 ? names[1] : names[0], i.id)}
                      >
                      <MaterialSymbolsContentCopy className={clickedCopyIconIndex===i.id && "text-emerald-500"} />
                    </div>
                    <button className='text-red-600 text-sm' onClick={() => handleDeleteChawSu(i.id)}>X</button>
                  </div>
                </div>
              </React.Fragment>
            )
          })
        }
      </div>
    </div>
  )
}
