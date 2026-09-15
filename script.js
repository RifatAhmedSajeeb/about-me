const GITHUB_USERNAME = "RifatAhmedSajeeb";

document.getElementById("year").textContent = new Date().getFullYear();

async function fetchGitHubData() {
  try {
    // 1. Fetch User Profile
    const profileRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    
    if (profileRes.ok) {
      const profileData = await profileRes.json();
      
      if (profileData.avatar_url) {
        document.getElementById("github-avatar").src = profileData.avatar_url;
      }
      if (profileData.name) {
        document.getElementById("github-name").textContent = profileData.name;
      }
      if (profileData.bio) {
        document.getElementById("github-bio").textContent = profileData.bio;
      }
      document.getElementById("repo-count").textContent = profileData.public_repos || "0";
      document.getElementById("follower-count").textContent = profileData.followers || "0";
    }

    // 2. Fetch Public Repositories
    const repoRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
    const projectsContainer = document.getElementById("projects-container");

    if (repoRes.ok) {
      const repos = await repoRes.json();
      projectsContainer.innerHTML = ""; // Clear loading message

      if (repos.length === 0) {
        projectsContainer.innerHTML = "<p class='loading-text'>No public repositories found yet.</p>";
        return;
      }

      repos.forEach(repo => {
        const repoCard = document.createElement("div");
        repoCard.className = "project-card";

        repoCard.innerHTML = `
          <div>
            <h3>${repo.name}</h3>
            <p>${repo.description || "No description provided for this repository."}</p>
          </div>
          <div class="project-meta">
            <span>⚡ ${repo.language || "Code"}</span>
            <a href="${repo.html_url}" target="_blank" style="color: var(--accent);">View Repo &rarr;</a>
          </div>
        `;

        projectsContainer.appendChild(repoCard);
      });
    } else {
      projectsContainer.innerHTML = "<p class='loading-text'>Unable to load GitHub repositories right now.</p>";
    }
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    document.getElementById("projects-container").innerHTML = "<p class='loading-text'>Failed to fetch repositories.</p>";
  }
}

// Execute on load
fetchGitHubData();
