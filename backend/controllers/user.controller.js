import User from "../models/user.model.js";

export const getUserProfileAndRepos = async (req, res) => {
    const { username } = req.params;
    try {
        const userRes = await fetch(`https://api.github.com/users/${username}`, {
            headers: { authorization: `token ${process.env.VITE_GITHUB_API_KEY}` },
        });
        const userProfile = await userRes.json();
        
        if (!userRes.ok) return res.status(404).json({ error: "GitHub user not found" });

        const repoRes = await fetch(userProfile.repos_url, {
            headers: { authorization: `token ${process.env.VITE_GITHUB_API_KEY}` },
        });
        const repos = await repoRes.json();
        
        res.status(200).json({ userProfile, repos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const likeProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findById(req.user._id.toString());
        let userToLike = await User.findOne({ username });

        // 1. Agar user DB mein nahi hai, GitHub se fetch karke create karein
        if (!userToLike) {
            const userRes = await fetch(`https://api.github.com/users/${username}`, {
                headers: { authorization: `token ${process.env.VITE_GITHUB_API_KEY}` },
            });
            const userProfile = await userRes.json();
            
            if (!userRes.ok) return res.status(404).json({ error: "User not found on GitHub" });

            userToLike = new User({
                username: userProfile.login,
                name: userProfile.name || userProfile.login,
                profileUrl: userProfile.html_url,
                avatarUrl: userProfile.avatar_url,
                likedProfiles: [],
                likedBy: [],
            });
            await userToLike.save();
        }

        // 2. Check karein ke user pehle se liked toh nahi
        // Note: Hum object check kar rahe hain isliye .some use kiya hai
        const isAlreadyLiked = user.likedProfiles.some((p) => p.username === userToLike.username);
        if (isAlreadyLiked) return res.status(400).json({ error: "User already liked" });

        // 3. Dono documents update karein (Objects push kar rahe hain)
        // Jisay like kiya gaya hai, uske 'likedBy' mein details dalien
        userToLike.likedBy.push({ 
            username: user.username, 
            avatarUrl: user.avatarUrl, 
            likedDate: Date.now() 
        });

        // Jis ne like kiya hai (Aap), apne 'likedProfiles' mein details dalien
        user.likedProfiles.push({
            username: userToLike.username,
            avatarUrl: userToLike.avatarUrl || userToLike.avatar_url,
            likedDate: Date.now()
        });

        // Dono ko save karein
        await Promise.all([userToLike.save(), user.save()]);

        res.status(200).json({ message: "User liked successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getLikes = async (req, res) => {
    try {
        const user = await User.findById(req.user._id.toString());
        
        // Frontend ko 'likedBy' aur 'likedProfiles' dono bhej rahe hain
        res.status(200).json({ 
            likedBy: user.likedBy, 
            likedProfiles: user.likedProfiles 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};