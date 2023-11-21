import axios from "axios";
import {useState} from "react";

export default function PhotosUploader({addedPhotos, onChange}) {
    const [photoLink, setPhotoLink] = useState('');

    const addPhotoByLink = async (e) => {
        e.preventDefault();
        if (e.target.value == null) {
            return alert('Enter link please')
        }

        const {data: filename} = await axios.post('/upload-by-link', {link: photoLink});
        onChange(prev => {
            return [...prev, filename];
        })
        console.log(filename)
        setPhotoLink('')
    }

    function handleUploadPhoto(e) {
        const files =  e.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        axios.post('/upload', data, {
            headers: {'Content-type': 'multipart/form-data'}
        }).then(response => {
            const {data: filenames} = response;
            onChange(prev => {
                return [...prev, ...filenames];
            })
        })
    }

    return (
        <>
            <div className='flex gap-2'>
                <input value={photoLink} onChange={e => setPhotoLink(e.target.value)} type='text' placeholder='Add using a link ...jpg' />
                <button onClick={addPhotoByLink} className='bg-gray-200 px-4 rounded-2xl'>Add&nbsp;photo</button>
            </div>
            <div className='mt-2 grid items-center grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6'>
                {addedPhotos.length > 0 && addedPhotos.map(link => (
                    <div className='h-32 flex' key={link}>
                        <img className='rounded-2xl w-full object-cover' src={'http://localhost:4000/uploads/' + link} alt='image' />
                    </div>
                ))}
                <label className='h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-8 text-gray-600'>
                    <input multiple type='file' className='hidden' onChange={handleUploadPhoto}/>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                    </svg>
                    Upload
                </label>
            </div>
        </>

)
}