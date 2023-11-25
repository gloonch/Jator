import {Link} from "react-router-dom";
import {AccountNav} from "../AccountNav.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg.jsx";

export default function PlacesPage() {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        axios.get('/user-places')
            .then(({data}) => {
                setPlaces(data)
            })
    }, []);

    return (
        <>
            <AccountNav />
            <div className='text-center pt-6'>
                <br />
                <Link className='inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full' to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Add new place
                </Link>
                <div className='mt-4 text-left'>
                    {places.length > 0 && places.map(place => (
                        <Link to={'/account/places/' + place._id} className='flex cursor-pointer gap-4 bg-gray-100 rounded-2xl'>
                            <div className='flex w-32 h-32 bg-gray-300 rounded-2xl '>
                                <PlaceImg place={place} className={'rounded-l-2xl'}/>
                            </div>
                            <div className='grow-0 shrink p-4'>
                                <h2 className='text-xl'>{place.title}</h2>
                                <p className='text-sm mt-2'>{place.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}