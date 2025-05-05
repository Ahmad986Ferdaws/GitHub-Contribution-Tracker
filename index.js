// File: index.js
// Project: GitHub Contribution Tracker
// Description: A simple web app to track and visualize GitHub contributions across multiple repositories

// --- 1. Dependencies ---
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// --- 2. GitHub API Utility ---
const getGitHubContributions = async (username) => {
  try {
    const url = `https://api.github.com/users/${username}/repos`;
    const repos = await axios.get(url);
    let contributions = [];

    for (let repo of repos.data) {
      const commitsUrl = repo.commits_url.replace('{/sha}', '');
      const commits = await axios.get(commitsUrl);
      contributions.push({
        repo: repo.name,
        commits: commits.data.length,
      });
    }

    return contributions;
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return [];
  }
};

// --- 3. API Endpoint ---
app.get('/api/contributions/:username', async (req, res) => {
  const { username } = req.params;
  const data = await getGitHubContributions(username);
  res.json(data);
});

// --- 4. Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
