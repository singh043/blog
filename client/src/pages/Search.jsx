/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMdArrowDropdown } from "react-icons/io";
import PostCard from './../components/PostCard';

const Search = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized',
    })
    
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');
        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
          setSidebarData({
            ...sidebarData,
            searchTerm: searchTermFromUrl,
            sort: sortFromUrl,
            category: categoryFromUrl,
          });
        }
    
        const fetchPosts = async () => {
          setLoading(true);
          const searchQuery = urlParams.toString();
          const res = await fetch(`/api/post/getposts?${searchQuery}&order=${sidebarData.sort}`);
          if (!res.ok) {
            setLoading(false);
            return;
          }
          if (res.ok) {
            const data = await res.json();
            setPosts(data.posts);
            setLoading(false);
            if (data.posts.length === 9) {
              setShowMore(true);
            } else {
              setShowMore(false);
            }
          }
        };
        fetchPosts();
        //eslint-disable-next-line
    }, [location.search])

    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
          setSidebarData({ ...sidebarData, searchTerm: e.target.value });
        }
        if (e.target.id === 'sort') {
          const order = e.target.value || 'desc';
          setSidebarData({ ...sidebarData, sort: order });
        }
        if (e.target.id === 'category') {
          const category = e.target.value || 'uncategorized';
          setSidebarData({ ...sidebarData, category });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(sidebarData)
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        if ( sidebarData.sort !== null ) {
            urlParams.set('sort', sidebarData.sort);
        }
        if ( sidebarData.category !== null ) {
            urlParams.set('category', sidebarData.category);
        }
        if( sidebarData.category === 'uncategorized' ) {
            urlParams.set('category', '')
        }
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!res.ok) {
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setPosts([...posts, ...data.posts]);
          if (data.posts.length < 4) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
    }

    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
                <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap font-semibold">Search Term:</label>
                        <input 
                            placeholder="Search..."
                            id="searchTerm"
                            type="text"
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                            className="h-8 outline-blue-700 textsm rounded-md px-3 py-4 border-2 border-black/50 text-gray-700"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Sort:</label>
                        <div className="flex relative">
                            <select onChange={handleChange} value={sidebarData.sort} id="sort" className="">
                                <option value="desc" className="">Latest</option>
                                <option value="asc">Oldest</option>
                            </select>
                            <IoMdArrowDropdown size={22} className="absolute top-2.5 right-2.5 cursor-pointer" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Category:</label>
                        <div className="flex relative">
                            <select onChange={handleChange} value={sidebarData.category} id="category">
                                <option value="uncategorized">Uncategorized</option>
                                <option value="reactjs">React.js</option>
                                <option value="nextjs">Next.js</option>
                                <option value="javascript">Javascript</option>
                            </select>
                            <IoMdArrowDropdown size={22} className="absolute top-2.5 right-2.5 cursor-pointer" />
                        </div>
                    </div>
                    <button type="submit" className="border-none outline-none w-full h-10 font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white p-[2px] px-[3px]">
                        <div className="w-full h-full rounded-md bg-white text-black flex items-center justify-center hover:bg-transparent hover:text-white">
                         Apply Filters
                        </div>
                    </button>
                </form>
            </div>
            <div className="w-full">
                <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
                    Post results
                </h1>
                <div className="p-7 flex flex-wrap gap-4">
                    {
                        !loading && posts.length === 0 && (
                            <p className="text-xl text-gray-500">No posts found.</p>
                        )
                    }
                    {
                        loading && (
                            <p className="text-xl text-gray-500">Loading...</p>
                        )
                    }
                    {
                        !loading && posts && posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    }
                    {showMore && (
                        <button
                        onClick={handleShowMore}
                        className='text-teal-500 text-lg hover:underline p-7 w-full'
                        >
                        Show More
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Search;