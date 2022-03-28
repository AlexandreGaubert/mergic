import axios from "axios";
import { PullRequest } from "../types/pull-request";

export async function fetchPullRequestsList(repoOwner: string, repoName: string): Promise<PullRequest[]> {
    try {
        /** Fetching 100 pull requests by default, a smart pagination system should be implemented */
        const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls?per_page=100`);

        return response.data;
    } catch (error) {
        alert('There was a problem while fetching pull requests, please verify your repo link. If your repo is private, this app won\'t have access to it')
    }

    return [];
}

export async function repoExists(repoOwner: string, repoName: string): Promise<boolean> {
    try {
        /** Fetching 100 pull requests by default, a smart pagination system should be implemented */
        const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls?per_page=100`);

        return response.status === 200;
    } catch (error) {
        alert('There was a problem while fetching pull requests, please verify your repo link. If your repo is private, this app won\'t have access to it')
        return false;
    }
}

export async function getNextPullRequest(pullRequests: PullRequest[]): Promise<PullRequest | null> {
    try {
        /** Fetching 100 pull requests by default, a smart pagination system should be implemented */
        const response = await axios.post('http://localhost:8000/pull-requests/next-to-review', { pull_requests: pullRequests });

        if (response.status === 200 && response.data)
            return response.data;
        else
            return null

    } catch (error) {
        alert('There was a problem while fetching pull requests, please verify your repo link. If your repo is private, this app won\'t have access to it')
        return null;
    }
}