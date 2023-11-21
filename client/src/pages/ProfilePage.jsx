import {useContext, useState} from "react";
import {UserContext} from "../UserContext.jsx";
import {Link, Navigate, useParams} from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage.jsx";
import {AccountNav} from "../AccountNav.jsx";

export default function ProfilePage() {
    const [redirect, setRedirect] = useState(null);
    const {user, ready, setUser} = useContext(UserContext);

    let {subpage} = useParams();
    if (subpage === undefined)
        subpage = 'profile'

    if (!ready)
        return 'Loading...'

    if (ready && !user && !redirect)
        return <Navigate to={'/login'} />

    const handleLogout = async ()=>{
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);
    }

    if (redirect)
        return <Navigate to={redirect} />

    return (
        <div className=''>
            <AccountNav />
            {subpage === 'profile' && (
                <div className='text-center max-w-lg mx-auto'>
                    Logged in as {user.name} ({user.email})<br />
                    <button onClick={handleLogout} className='primary max-w-md mt-2'>Logout</button>
                </div>
            )}
            {subpage === 'places' && (
                <PlacesPage />
            )}
        </div>
    );
}