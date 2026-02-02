🚀 GitHub Clone - GitHub User & Repository Explorer
GitForge is a full-stack MERN application that allows users to search for any GitHub profile in real-time. It fetches comprehensive data including user stats, contribution graphs, and repository details using the GitHub REST API.

✨ Features
Real-time Search: Instantly fetch any GitHub user profile.
Detailed Stats: View followers, following, public repos, and total stars.
Repository Management: Filter and sort repositories by Stars, Forks, or Recent updates.
Secure Backend: Built with an Express.js proxy server to handle API calls securely (preventing API key exposure).
Responsive UI: Fully mobile-friendly design with a modern Glassmorphism look using Tailwind CSS.
Activity Tracking: Integrated MongoDB to allow "Liking" profiles and tracking search history.

🛠️ Tech Stack
Frontend: React.js, Tailwind CSS, DaisyUI
Backend: Node.js, Express.js
Database: MongoDB Atlas
API: GitHub REST API
Deployment: Render
🚀 Installation & Setup
Clone the repository:

Bash

git clone https://github.com/AyeshaYaqoob/github-mern-app.git
Install dependencies for both frontend and backend:

Bash

cd backend && npm install
cd ../frontend && npm install
Create a .env file in the backend folder and add:

Code snippet

MONGO_URI=your_mongodb_uri
GITHUB_API_KEY=your_github_token
PORT=5000
Start the development server:

Bash

npm run dev