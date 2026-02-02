import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { formatDate } from "../utils/functions";

/* eslint-disable react/prop-types */

const LikesPage = () => {
    const [likes, setLikes] = useState([]);

    useEffect(() => {
        const getLikes = async () => {
            try {
                // Sahi Backend URL
                const res = await fetch("http://127.0.0.1:5005/api/users/likes", { credentials: "include" });
                const data = await res.json();
                
                if (data.error) throw new Error(data.error);

                // LOGIC UPDATE: 
                // data.likedBy = Wo log jinhon ne aapko like kiya
                // data.likedProfiles = Wo log jinhein AAPNE like kiya (Hum ye dikhayenge)
                // Note: Agar aapne controller update kiya hai to ye 'likedProfiles' bhej raha hoga
                setLikes(data.likedProfiles || data.likedBy || []); 
                
            } catch (error) {
                toast.error(error.message);
            }
        };
        getLikes();
    }, []);

    return (
        <div className='relative overflow-x-auto shadow-md rounded-lg px-4'>
            <table className='w-full text-sm text-left rtl:text-right bg-glass overflow-hidden'>
                <thead className='text-xs uppercase bg-glass'>
                    <tr>
                        <th scope='col' className='p-4'>No</th>
                        <th scope='col' className='px-6 py-3'>Username</th>
                        <th scope='col' className='px-6 py-3'>Date</th>
                        <th scope='col' className='px-6 py-3'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {likes.length === 0 ? (
                        <tr>
                            <td colSpan='4' className='text-center py-4 font-medium'>
                                No likes found yet. Start liking some profiles!
                            </td>
                        </tr>
                    ) : (
                        likes.map((user, idx) => (
                            <tr className='bg-glass border-b transition-all hover:bg-gray-800/50' key={user.username || idx}>
                                <td className='w-4 p-4'>
                                    <span>{idx + 1}</span>
                                </td>
                                <th scope='row' className='flex items-center px-6 py-4 whitespace-nowrap '>
                                    <img 
                                        className='w-10 h-10 rounded-full border border-blue-500' 
                                        src={user.avatarUrl || "https://via.placeholder.com/150"} 
                                        alt='User Avatar' 
                                    />
                                    <div className='ps-3'>
                                        <div className='text-base font-semibold'>{user.username}</div>
                                    </div>
                                </th>
                                <td className='px-6 py-4'>
                                    {user.likedDate ? formatDate(user.likedDate) : "Just now"}
                                </td>
                                <td className='px-6 py-4'>
                                    <div className='flex items-center gap-2'>
                                        <FaHeart size={18} className='text-red-500' />
                                        <span className='text-xs'>You liked this profile</span>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LikesPage;