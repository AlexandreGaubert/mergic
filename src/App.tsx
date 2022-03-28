import React, { useContext } from 'react';
import LoaderScreen from './components/loader-screen/LoaderScreen';
import ProvideRepoScreen from './components/provide-repo/ProvideRepoScreen';
import { PullRequestContext } from './contexts/PullRequestsContext';
import PullRequestsList from './pages/pull-requests-list/PullRequestsList';
import './App.scss';

function App() {
  const { loading, repoUrl, onResetRepo } = useContext(PullRequestContext);

  if (!repoUrl) return <ProvideRepoScreen />

  return (
    <div className="App">
      {loading ? <LoaderScreen /> : <PullRequestsList />}
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
