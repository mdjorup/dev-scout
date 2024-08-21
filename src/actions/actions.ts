'use server';


import { searchRepoGreptile } from "@/lib/utils";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});


export const runFormSubmission = async (topic: string) => {

  
  let files = await searchRepoGreptile({
    query: `Find all files relevant to the implementation of ${topic}`,
    repositories: [
      {
        "remote": "github",
        "branch": "canary",
        "repository": "vercel/next.js"
      }
    ]
  })

  console.log("Retrieved files: ", files.length)

  const contributorSummary: Record<string, {files: string[], commits: number}> = {};

  for (const file of files) {
    try {
      const { data: commits} = await octokit.rest.repos.listCommits({
        owner: file.repository.split('/')[0],
        repo: file.repository.split('/')[1],
        path: file.filepath,
        per_page: 100,
      })

      for (const commit of commits) {
        const author = commit.author?.login;
        if (!author) continue;
      
        if (contributorSummary[author]) {
          contributorSummary[author].files.push(file.filepath);
          contributorSummary[author].commits++;
        } else {
          contributorSummary[author] = {
            files: [file.filepath],
            commits: 1
          }

        }
      }

    } catch (e) {
      console.error(`Error fetching commits for ${file.filepath}: ${e}`)
    }
  }

  let sortedContributorSummary = Object.entries(contributorSummary)
  .filter(([_, value]) => value.commits > 1)
  .map(([key, value]) => ({
    name: key,
    files: Array.from(new Set(value.files)),
    commits: value.commits
  }))
  .sort((a, b) => b.commits - a.commits)
  .slice(0, 10);

  return sortedContributorSummary;

}