import axios from "axios";
import { PullRequest } from "../types/pull-request";

export async function fetchPullRequestsList(repoOwner: string, repoName: string): Promise<PullRequest[]> {
    try {
        /** Fetching 100 pull requests by default, a smart pagination system should be implemented */
        const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls?per_page=100`);

        return response.data;
    } catch (error) {
        alert('There was a problem while fetching pull requests, please verify your repo link. If your repo is private, this app won\'t have access to it')
        /**
         * We can implement a nicer error handling, displaying nice and informative message to the user, so he can have a good hint on what happened
         * and how to report the problem. This will require more backend logic, so the frontend know what happened
         * 
         * We can also use a middleware to do all the fetching and error handling, so this catch won't be necessary as 
         * the error would already be handled nicely in the middleware.
         */
        throw error;
        /** We rethrow the error so we can reset the repoUrl, as it seems to have a problem with the PR fetching */
    }
}

export async function repoExists(
    repoOwner: string,
    repoName: string,
    onSuccess: (owner: string, repoName: string) => void
): Promise<boolean> {
    try {
        const res = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}`);

        if (res.status === 200) {
            /** Le repo existe, on fetch les pull request et on affiche la liste */
            onSuccess(repoOwner, repoName);
            return true;
        }
    } catch (error: any) {
        if (error.response.status === 404)
            alert("This repo doesn't exists, maybe you misspelled it or it's in private mode.")
        else
            alert("There was a problem attempting to resolve your request.")
    }

    return false;
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