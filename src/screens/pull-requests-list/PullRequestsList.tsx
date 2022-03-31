import React, { useContext } from 'react'
import { PullRequestContext } from '../../contexts/PullRequestsContext';
import PullRequestFamily from './components/family/PullRequestFamily';
import './styles.scss';

export default function PullRequestsList() {
    const { groupedPullRequests, search, onSearchChange, nextPullRequest } = useContext(PullRequestContext);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        onSearchChange(e.target.value)
    }

    return (
        <div id='pr-page'>
            <input
                id='search-input'
                type='text'
                placeholder='Search a pull request by its title or ID...'
                name='search'
                value={search}
                onChange={handleChange}
                style={{ gridArea: 'search' }}
            />
            <section id='pr-list'>
                {nextPullRequest &&
                    <PullRequestFamily
                        important
                        tag={'You should review this first :'}
                        pullRequests={nextPullRequest ? [nextPullRequest] : []}
                    />
                }
                {Object.keys(groupedPullRequests).map((tag, index) =>
                    <PullRequestFamily
                        key={'pr-family-' + index}
                        tag={tag}
                        pullRequests={groupedPullRequests[tag]}
                    />
                )}
            </section>
        </div>
    );
}
