🚀 Community Hub

A full-stack social platform built with TypeScript, React, Tailwind CSS, React Router, React Query, Context API, and Supabase.
The app allows users to create communities, post content, interact with likes and comments, and authenticate via GitHub.

Deployed seamlessly on Vercel with a Postgres backend powered by Supabase.

🎥 Demo

🔗 Live App: Community Hub on Vercel

✨ Features

📝 Post Posts – Share your thoughts, images, or updates.

🌐 Create Communities – Build and manage unique communities around any topic.

❤️ Likes – Show appreciation by liking posts.

💬 Comments – Engage in discussions by commenting on posts.

🔑 GitHub Authentication – Secure sign-in with your GitHub account.

🗄️ Postgres Database – Reliable storage of users, posts, votes, and comments.

⚡ React Query – Optimized server state management and caching.

🎨 Tailwind CSS – Modern, responsive, and utility-first styling.

🛠️ Context API – Global state management for auth and UI.

🌍 Deployed on Vercel – Fast, reliable hosting with continuous integration from GitHub.

🏗️ Tech Stack

Frontend:

React
 + TypeScript

React Router
 for navigation

React Query
 for data fetching

Tailwind CSS
 for styling

Context API
 for state management

Backend & Database:

Supabase
 (Postgres, Auth, Realtime APIs)

Deployment & Tools:

Vercel
 for hosting

GitHub
 for version control and CI/CD

📦 Installation & Setup

Clone the repository:

git clone https://github.com/SG-MATR/Social-Media-App.git
cd Social-Media-App


Install dependencies:

npm install
# or
yarn install


Set up environment variables (.env.local):

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


Run the development server:

npm run dev
# or
yarn dev


The app will be running at http://localhost:5173
 (default Vite port).

🚀 Deployment

Pushed to GitHub → automatically deployed to Vercel
.

Make sure environment variables are added in Vercel dashboard → Project Settings → Environment Variables.

📂 Project Structure
src/
 ├── components/      # Reusable UI components
 ├── context/         # Context API providers (e.g., AuthContext)
 ├── hooks/           # Custom React hooks
 ├── pages/           # App pages (Home, Community, Post, etc.)
 ├── services/        # Supabase client, API utilities
 ├── styles/          # Global Tailwind styles
 ├── App.tsx          # Main app component with routing
 └── main.tsx         # React entry point

🔑 Authentication

Sign in with GitHub using Supabase Auth.

Handles secure sessions and stores user metadata (avatar, username, email).

📊 Database Schema (Simplified)

users – stores user info from GitHub.

communities – community details (id, name, description).

posts – posts created by users, linked to communities.

comments – user comments linked to posts.

votes – likes/upvotes linked to posts.

🤝 Contributing

Fork the repo

Create a new branch (git checkout -b feature/new-feature)

Commit changes (git commit -m 'Add new feature')

Push to branch (git push origin feature/new-feature)

Create a Pull Request 🎉

📜 License

This project is licensed under the MIT License.
