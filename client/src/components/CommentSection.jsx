/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CommentSection = ({ postId }) => {

    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null)
    const { currentUser } = useSelector((state) => state.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 200) return;

        try {
            const res = await fetch(`/api/comment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: comment, postId, userId: currentUser._id })
            });
    
            const data = await res.json();
    
            if(res.ok) {
                setComment('');
                setCommentError(null);
            }
        } catch (error) {
            setCommentError(error);
        }
    }
    
    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {currentUser ? 
                (
                    <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                        <p className="">Signed in as:</p>
                        <img src={currentUser.profilePicture} alt='' className='h-5 w-5 object-cover rounded-full' />
                        <Link to={`/dashboard?tab=profile`} className='text-sm text-cyan-600 hover:underline'>
                            @{currentUser.username}
                        </Link>
                    </div>
                ) :
                (
                    <div className='text-sm text-teal-500 my-5 flex gap-1'>
                        You must be signed in to comment.
                        <Link to={`/sign-in`} className='text-blue-500 hover:underline'>
                            Sign in
                        </Link>
                    </div>
                )
            }
            {
                currentUser && (
                    <form onSubmit={handleSubmit} className="border border-teal-500 rounded-md p-3">
                        <textarea 
                            placeholder='Add a comment...'
                            rows='3'
                            maxLength='200'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className='w-full border-[2px] p-2 rounded-lg bg-gray-50 outline-blue-700'
                        />
                        <div className='flex justify-between items-center mt-5'>
                            <p className="text-gray-500 text-xs">{200 - comment.length} characters remaining</p>
                            <button className="border-none outline-none font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-3 py-1.5">
                                Submit
                            </button>
                        </div>
                        {
                            commentError && (
                                <div className='text-center mt-5 bg-red-300 p-2 rounded-md select-text w-full'>
                                    {commentError}
                                </div>
                            )
                        }
                    </form>
                )
            }
        </div>
    )
}

export default CommentSection;