import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaComments, FaLongArrowAltUp, FaUsers } from "react-icons/fa";
import { HiDocumentText } from 'react-icons/hi';
import { Link } from "react-router-dom";

const DashboardComp = () => {

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const { currentUser } = useSelector((state) => state.user);
    const [lastMonthComments, setLastMonthComments] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers?limit=5`);
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?limit=5`);
                const data = await res.json();
                if (res.ok) {
                    setPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPosts);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments?limit=5`);
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.lastMonthComments);
                }
            } catch (error) {
                console.log(error.message);
            }
        }

        if(currentUser.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
        }
    }, [currentUser])

    return (
        <div className="p-3 md:mx-auto">
            <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
                            <p className="text-2xl">{totalUsers}</p>
                        </div>
                        <FaUsers className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <FaLongArrowAltUp />
                            {lastMonthUsers}
                        </span>
                        <div className="text-gray-500">Last month</div>
                    </div>
                </div>
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">Total Comments</h3>
                            <p className="text-2xl">{totalComments}</p>
                        </div>
                        <FaComments className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <FaLongArrowAltUp />
                            {lastMonthComments}
                        </span>
                        <div className="text-gray-500">Last month</div>
                    </div>
                </div>
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
                            <p className="text-2xl">{totalPosts}</p>
                        </div>
                        <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <FaLongArrowAltUp />
                            {lastMonthPosts}
                        </span>
                        <div className="text-gray-500">Last month</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap justify-center mx-auto gap-4 py-3">
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent users</h1>
                        <button className="px-2.5 py-1.5 bg-green-600 rounded-md text-white">
                            <Link to={"/dashboard?tab=users"}>
                                See all
                            </Link>
                        </button>
                    </div>
                    <table className="min-w-[270px]">
                        <thead className="bg-gray-50 border-gray-200 font-semibold text-xs uppercase">
                            <tr className="">
                                <th className="p-3 font-bold 
                                    tracking-wide whitespace-nowrap text-center">User image</th>
                                <th className="p-3 font-bold 
                                    tracking-wide whitespace-nowrap text-center">Username</th>
                            </tr>
                        </thead>
                        {users.map((user) => (
                            <tbody key={user._id} className="text-gray-500 text-center">
                                <tr className="">
                                    <td className="p-3 text-sm text-gray-700 
                                        whitespace-nowrap flex justify-center">
                                        <img src={user.profilePicture} alt="user" 
                                            className="w-10 h-10 object-cover rounded-full bg-gray-500" 
                                        />
                                    </td>
                                    <td className="p-3 text-sm whitespace-nowrap 
                                        text-gray-500 text-center">{user.username}</td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent comments</h1>
                        <button className="px-2.5 py-1.5 bg-green-600 rounded-md text-white">
                            <Link to={"/dashboard?tab=comments"}>
                                See all
                            </Link>
                        </button>
                    </div>
                    <table className="min-w-[270px]">
                        <thead className="bg-gray-50 border-gray-200 font-semibold text-xs uppercase">
                            <tr className="">
                                <th className="p-3 font-bold 
                                    tracking-wide whitespace-nowrap text-center">Comment content</th>
                                <th className="p-3 font-bold 
                                    tracking-wide whitespace-nowrap text-center">Likes</th>
                            </tr>
                        </thead>
                        {comments.map((comments) => (
                            <tbody key={comments._id} className="text-gray-500 text-center">
                                <tr className="w-96">
                                    <td className="p-3 text-sm text-gray-700 
                                        whitespace-nowrap text-center line-clamp-2">
                                        {comments.content}
                                    </td>
                                    <td className="p-3 text-sm whitespace-nowrap 
                                        text-gray-500 text-center">{comments.numberOfLikes}</td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent posts</h1>
                        <button className="px-2.5 py-1.5 bg-green-600 rounded-md text-white">
                            <Link to={"/dashboard?tab=posts"}>
                                See all
                            </Link>
                        </button>
                    </div>
                    <table className="min-w-[270px]">
                        <thead className="bg-gray-50 border-gray-200 font-semibold text-xs uppercase">
                            <tr className="">
                                <th className="p-3 font-bold 
                                    tracking-wide whitespace-nowrap text-center">Post image</th>
                                <th className="p-3 font-bold 
                                    tracking-wide whitespace-nowrap text-center">Post title</th>
                                <th className="p-3 font-bold 
                                    tracking-wide whitespace-nowrap text-center">Post category</th>
                            </tr>
                        </thead>
                        {posts.map((post) => (
                            <tbody key={post._id} className="text-gray-500 text-center">
                                <tr className="">
                                    <td className="p-3 text-sm text-gray-700 
                                        whitespace-nowrap flex justify-center">
                                        <img src={post.image} alt="post" 
                                            className="w-16 h-10 object-cover rounded-md bg-gray-500" 
                                        />
                                    </td>
                                    <td className="p-3 text-sm whitespace-nowrap 
                                        text-gray-500 text-center w-96">{post.title}</td>
                                    <td className="p-3 text-sm whitespace-nowrap 
                                        text-gray-500 text-center w-5">{post.category}</td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DashboardComp;