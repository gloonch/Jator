import {useContext, useState} from "react";
import {UserContext} from "../UserContext.jsx";
import {Link, Navigate, useParams} from "react-router-dom";
import axios from "axios";

export default function AccountPage() {
    const [redirect, setRedirect] = useState(null);
    const {user, ready, setUser} = useContext(UserContext);

    let {subpage} = useParams();
    if (subpage === undefined)
        subpage = 'profile'

    if (!ready)
        return 'Loading...'

    if (ready && !user && !redirect)
        return <Navigate to={'/login'} />

    const linkClasses = (type=null)=>{
        let classes = 'py-2 px-6';
        if (type === subpage || (subpage === undefined && type === 'profile')) {
            classes += ' bg-primary text-white rounded-full';
        }
        return classes;
    }

    const handleLogout = async ()=>{
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);
    }

    if (redirect)
        return <Navigate to={redirect} />

    return (
        <div className=''>
            <nav className='w-full flex justify-center gap-4 mt-8'>
                <Link className={linkClasses('profile')} to={'/account'} >My Profile</Link>
                <Link className={linkClasses('bookings')} to={'/account/bookings'} >My Bookings</Link>
                <Link className={linkClasses('places')} to={'/account/places'} >My Accommodations</Link>
            </nav>
            {subpage === 'profile' && (
                <div className='text-center max-w-lg mx-auto'>
                    Logged in as {user.name} ({user.email})<br />
                    <button onClick={handleLogout} className='primary max-w-md mt-2'>Logout</button>
                </div>
            )}
        </div>
    );
}