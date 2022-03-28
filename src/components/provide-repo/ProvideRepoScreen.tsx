import axios from 'axios';
import React, { useContext, useState } from 'react'
import { PullRequestContext } from '../../contexts/PullRequestsContext';
import './styles.scss';

export default function ProvideRepoScreen() {
    const { onRepoUrlSubmit } = useContext(PullRequestContext)
    const [repoUrl, setRepoUrl] = useState('');

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setRepoUrl(event.target.value);
    }

    async function handleSendRepoUrl() {
        const reg = new RegExp(/^https:\/\/github.com\/(\w+)\/(.+)$/gm);
        const matches = reg.exec(repoUrl);

        if (matches) {
            const owner = matches[1];
            const repoName = matches[2];

            try {
                const res = await axios.get(`https://api.github.com/repos/${owner}/${repoName}`);

                if (res.status === 200) {
                    /** Le repo existe, on fetch les pull request et on affiche la liste */
                    onRepoUrlSubmit(owner, repoName);
                }
            } catch (error: any) {
                if (error.response.status === 404)
                    alert("This repo doesn't exists, maybe you misspelled it or it's in private mode.")
                else 
                    alert("There was a problem attempting to resolve your request.")
            }
        } else {
            alert("Your input link does not seems to match the GitHub link format, please provide a format like https://github.com/<owner>/<repo_name>")
        }
    }

    return (
        <div id='provide-repo-screen'>
            <input
                name='repo-url'
                onChange={handleChange}
                placeholder='Provide a GitHub repository URL...'
                value={repoUrl}
            />
            <button id="provide-repo-screen-submit" onClick={handleSendRepoUrl}>
                <i id="icon" className='fa fa-check' />
                <h1 id="title">submit</h1>
            </button>
        </div>
    )
}
