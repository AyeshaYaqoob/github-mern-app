/* eslint-disable react/prop-types */
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

console.log("INSIDE");

const LikeProfile = ({ userProfile }) => {
  const { authUser } = useAuthContext();

  const isOwnProfile = authUser?.username === userProfile.login;

  const handleLikeProfile = async () => {
    console.log("INSIDE 2");

    try {
      const res = await fetch(
        `http://127.0.0.1:5005/api/users/like/${userProfile.login}`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      console.log("INSIDE 3");

      const data = await res.json();
      console.log(`Data of Likes: ${JSON.stringify(data)}`);

      if (data.error) throw new Error(data.error);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!authUser || isOwnProfile) return null;

  return (
    <button
      className="p-2 text-xs w-full font-medium rounded-md bg-glass border border-blue-400 flex items-center gap-2"
      onClick={handleLikeProfile}
    >
      <FaHeart size={16} /> Like Profile
    </button>
  );
};
export default LikeProfile;
