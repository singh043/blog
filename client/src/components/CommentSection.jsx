/* eslint-disable no-unused-vars */
import Comment from './Comment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const CommentSection = ({ postId }) => {

    const navigate = useNavigate();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
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
                setComments([data, ...comments]);
            }
        } catch (error) {
            setCommentError(error);
        }
    }

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`);
                if(res.ok) {
                    const data = await res.json();
                    setComments(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getComments();
    }, [postId, comments])

    const handleLike = async (commentId) => {
        try {
          if (!currentUser) {
            navigate('/sign-in');
            return;
          }
          const res = await fetch(`/api/comment/likeComment/${commentId}`, {
            method: 'PUT',
          });
          if (res.ok) {
            const data = await res.json();
            setComments(
              comments.map((comment) =>
                comment._id === commentId
                  ? {
                      ...comment,
                      likes: data.likes,
                      numberOfLikes: data.likes.length,
                    }
                  : comment
              )
            );
          }
        } catch (error) {
          console.log(error.message);
        }
    }

    const handleEditComment = async (comment, editedContent) => {
        try {
            setComments(
                comments.map((c) => c._id === comment._id ? { ...c, content: editedContent } : c)
            )
        } catch (error) {
            console.log(error.message)
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
            {
                comments.length === 0 ? (
                    <p className='text-sm my-5'>No comments yet!</p>
                ) : (
                    <>
                        <div className='text-sm my-5 flex items-center gap-1'>
                            <p>Comments</p>
                            <div className='border border=gray-400 py-0.5 px-2 rounded-md'>
                                <p>{comments.length}</p>
                            </div>
                        </div>
                        {
                            comments.map((comment) => (
                                <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEditComment} />
                            ))
                        }
                    </>
                )
            }
        </div>
    )
}

export default CommentSection;

