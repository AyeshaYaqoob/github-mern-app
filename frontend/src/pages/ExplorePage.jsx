import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import Repos from "../components/Repos";

/* eslint-disable react/prop-types */

const ExplorePage = () => {
    const [loading, setLoading] = useState(false);
    const [repos, setRepos] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState("");

    const exploreRepos = async (language) => {
        setLoading(true);
        setRepos([]);
        try {
            // FIXED: Ab hum backend route ko call kar rahe hain
            const res = await fetch(`http://127.0.0.1:5005/api/explore/repos/${language}`, {
                credentials: "include" // Agar cookies/auth use ho rahi hai
            });
            
            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setRepos(data.repos || []);
            setSelectedLanguage(language);

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='px-4'>
            <div className='bg-glass max-w-2xl mx-auto rounded-md p-4'>
                <h1 className='text-xl font-bold text-center mb-6'>Explore Popular Repositories</h1>
                
                <div className='flex flex-wrap gap-4 my-2 justify-center'>
                    {["javascript", "typescript", "c++", "python", "java"].map((lang) => (
                        <img
                            key={lang}
                            src={`/${ lang}.svg`} 
                            alt={`${lang} logo`}
                            className='h-12 sm:h-20 cursor-pointer hover:scale-110 transition-transform'
                            onClick={() => exploreRepos(lang)}
                        />
                    ))}
                </div>

                {loading && <Spinner />}

                {!loading && repos.length > 0 && (
                    <div className="mt-8">
                        <h2 className='text-lg font-semibold text-center mb-4 uppercase'>
                            Top {selectedLanguage} Repositories
                        </h2>
                        <Repos repos={repos} alwaysFullWidth />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExplorePage;