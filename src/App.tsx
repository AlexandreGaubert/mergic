import React, { useContext } from 'react';
import LoaderScreen from './components/loader-screen/LoaderScreen';
import ProvideRepoScreen from './components/provide-repo/ProvideRepoScreen';
import { PullRequestContext } from './contexts/PullRequestsContext';
import PullRequestsList from './pages/pull-requests-list/PullRequestsList';
import './App.scss';

function App() {
  const { loading, repoUrl, onResetRepo, pullRequests } = useContext(PullRequestContext);

  const noOpenedPullRequests = !loading && repoUrl && pullRequests.length === 0

  if (!repoUrl) return <ProvideRepoScreen />

  return (
    <div className="App">
      {noOpenedPullRequests &&
        <div id='no-pr-screen'>
          This repository don't have any opened pull requests yet.
        </div>
      }
      {loading && <LoaderScreen />}
      {!loading && !noOpenedPullRequests && <PullRequestsList />}
      {!loading &&
        <div id='reset-repo-btn' onClick={onResetRepo}>
          <i className='fa fa-times' />
          Reset repo
        </div>
      }
    </div>
  );
}

export default App;
