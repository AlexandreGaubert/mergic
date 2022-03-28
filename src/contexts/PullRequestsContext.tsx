import Fuse from "fuse.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchPullRequestsList, getNextPullRequest } from "../fetchers/pull-requests";
import { PullRequest } from "../types/pull-request";

interface Props {
    children?: React.ReactNode;
}

interface PullRequestContextProps {
    groupedPullRequests: GroupedPullRequests;
    pullRequests: PullRequest[];
    nextPullRequest: PullRequest | null;
    search: string;
    loading: boolean;
    onSearchChange: (search: string) => void;
    onRepoUrlSubmit: (owner: string, name: string) => void;
    onResetRepo: () => void;
    repoUrl: string;
}

export const PullRequestContext = React.createContext<PullRequestContextProps>({
    groupedPullRequests: {},
    pullRequests: [],
    onSearchChange: () => null,
    onRepoUrlSubmit: () => null,
    onResetRepo: () => null,
    nextPullRequest: null,
    search: '',
    loading: false,
    repoUrl: ''
});

type GroupedPullRequests = { [labelName: string]: PullRequest[] };

export default function PullRequestContextProvider({ children }: Props) {
    const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [repoOwner, setRepoOwner] = useState('');
    const [repoName, setRepoName] = useState('');
    const [nextPullRequest, setNextPullRequest] = useState<PullRequest | null>(null);

    const getPullRequestsList = useCallback(async () => {
        setLoading(true);

        try {
            const prlist = await fetchPullRequestsList(repoOwner, repoName);

            setPullRequests(prlist);
        } catch (error) {
            /**
             * Nice error handling, display nice and informative message to the user, so he can have a good hint on what happened
             * and how to report the problem.
             * 
             * We can also use a middleware to do all the fetching and error handling, so this catch won't be necessary as 
             * the error would already be handled in the middleware.
             */
        }

        setLoading(false);
    }, [repoOwner, repoName])

    function onSearchChange(newSearch: string) {
        setSearch(newSearch);
    }

    function onRepoUrlSubmit(owner: string, name: string) {
        setRepoOwner(owner);
        setRepoName(name);
    }

    function onResetRepo() {
        setRepoName('');
        setRepoOwner('');
        setPullRequests([]);
        setSearch('');
    }

    const computeNextPullRequest = useCallback(async () => {
        const nextPr = await getNextPullRequest(pullRequests);

        setNextPullRequest(nextPr);
    }, [pullRequests]);

    /**
     * Here we group PRs by tag for displaying. Wrapping it in useMemo wich compute the value at pullRequests changes only.
     * To avoid unecessary renders.
     */
    const groupedPullRequests = useMemo(() => {
        const fuse = new Fuse(pullRequests, {
            keys: ['title', 'id'],
            threshold: 0.2,
            ignoreLocation: true,
        });
        const filtered = search ? fuse.search(search).map(res => res.item) : pullRequests;
        return filtered
            .reduce((acc, pr) => {
                pr.labels.forEach(label => {
                    if (acc[label.name])
                        acc[label.name].push(pr);
                    else
                        acc[label.name] = [pr];
                });

                return acc;
            }, {} as GroupedPullRequests)

    }, [pullRequests, search]);

    useEffect(() => {

        if (repoOwner && repoName)
            getPullRequestsList();

    }, [repoName, repoOwner, getPullRequestsList]);

    useEffect(() => {
        if (!!pullRequests.length)
            computeNextPullRequest();
    }, [pullRequests, computeNextPullRequest])

    return (
        <PullRequestContext.Provider value={{
            groupedPullRequests,
            pullRequests,
            search,
            loading,
            repoUrl: repoOwner,
            nextPullRequest,
            onRepoUrlSubmit,
            onSearchChange,
            onResetRepo
        }}>
            {children}
        </PullRequestContext.Provider>
    )
}