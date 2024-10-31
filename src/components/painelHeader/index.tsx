import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import {auth} from '../../services/firebaseConnection'

export function PainelHeader(){
    
     async function handleLogOut(){
            await signOut(auth)
        }
    
    return(
        <div
        className="w-full items-center flex h-10 bg-red-500 rounded-lg text-white font-medium gap-4 px-4 mb-4"
        >
            <Link to='/dashboard'>
                Dashboard
            </Link>

            <Link to='/new'>
                Add a new car
            </Link>


            <button
            className="ml-auto "
            onClick={handleLogOut}
            >
                Logout
            </button>
        </div>
    )
}