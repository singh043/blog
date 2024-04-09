import { IoLogoGoogle } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from 'react-redux';
import { signInFailure, signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {

    const auth = getAuth(app);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const path = useLocation().pathname;

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL
                })
            })

            const data = await res.json();
            if(res.ok) {
                dispatch(signInSuccess(data));
                navigate('/');
            }
        } catch (error) {
            if(error.message !== "Firebase: Error (auth/cancelled-popup-request).") {
                dispatch(signInFailure(error.message));
            }
        }
    }

    return (
        <div className='bg-gradient-to-b from-rose-400 to-red-500 h-12 rounded-xl cursor-pointer p-[1px] flex items-center justify-center gap-2 font-semibold text-white'
            onClick={signInWithGoogle} 
        >
            <IoLogoGoogle size={24} />
            {
                path === "/sign-in" ?
                    <span>Sign in with Google</span>
                    :
                    <span>Sign up with Google</span>
            }
        </div>
    )
}
