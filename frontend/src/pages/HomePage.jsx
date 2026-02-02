import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import ProfileInfo from "../components/ProfileInfo";
import Repos from "../components/Repos";
import Search from "../components/Search";
import SortRepos from "../components/SortRepos";
import Spinner from "../components/Spinner";

/* eslint-disable react/prop-types */

const HomePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortType, setSortType] = useState("recent");

    // Memoized function to get user data
    const getUserProfileAndRepos = useCallback(async (username = "ayeshayaqoob") => {
        setLoading(true);
        try {
            // Calling our own backend API instead of direct GitHub call
            const res = await fetch(`http://127.0.0.1:5005/api/users/profile/${username}`);
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "User not found");
            }

            const data = await res.json();
            const { userProfile, repos: userRepos } = data;

            // Default sorting by most recent date
            userRepos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            setRepos(userRepos);
            setUserProfile(userProfile);

            return { userProfile, repos: userRepos };
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getUserProfileAndRepos();
    }, [getUserProfileAndRepos]);

    const onSearch = async (e, username) => {
        e.preventDefault();
        if (!username) return toast.error("Please enter a username");

        setLoading(true);
        setRepos([]);
        setUserProfile(null);

        const result = await getUserProfileAndRepos(username);

        if (result) {
            setSortType("recent"); // Reset sort type on new search
        }
        setLoading(false);
    };

   const onSort = (type) => {
    setSortType(type); // Button ka active state change karein

    // 1. Ek naya array banayein (Shallow Copy)
    const sortedRepos = [...repos];

    // 2. Sorting logic
    sortedRepos.sort((a, b) => {
        if (type === "recent") {
            // Nayi date pehle (Descending)
            return new Date(b.created_at) - new Date(a.created_at);
        }
        if (type === "stars") {
            // Zyada stars pehle
            return b.stargazers_count - a.stargazers_count;
        }
        if (type === "forks") {
            // Zyada forks pehle
            return b.forks_count - a.forks_count;
        }
        return 0;
    });

    // 3. Naya array set karein taake React foran UI update kare
    setRepos(sortedRepos);
};

    return (
        <div className='m-4'>
            {/* Search Input Section */}
            <Search onSearch={onSearch} />

            {/* Sorting Buttons - only show if repos exist */}
            {repos.length > 0 && <SortRepos onSort={onSort} sortType={sortType} />}

            <div className='flex gap-4 flex-col lg:flex-row justify-center items-start'>
                {/* Profile Card */}
                {userProfile && !loading && <ProfileInfo userProfile={userProfile} />}

                {/* Repositories List */}
                {!loading && repos.length > 0 && <Repos repos={repos} />}

                {/* Loading State */}
                {loading && <Spinner />}
            </div>
        </div>
    );
};

export default HomePage;