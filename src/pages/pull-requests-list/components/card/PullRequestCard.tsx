import classNames from 'classnames';
import React, { useState } from 'react';
import ReactTimeAgo from 'react-time-ago';
import PullRequestIcon from '../../../../icons/pull-request-icon';
import { PullRequest } from '../../../../types/pull-request';
import './styles.scss';

interface Props extends PullRequest {

}

export default function PullRequestCard(props: Props) {
    const [open, setOpen] = useState(false);

    function handleToggleOpen() {
        setOpen(op => !op);
    }

    return (
        <div className={classNames({ 'pr-card': true, open })} onClick={handleToggleOpen}>
            <section style={{ display: 'flex' }}>
                <span className='pr-card-id'>{`#${props.number}`}</span>
                {props.state === 'open' && <span className='pr-card-chip open'>Open</span>}
                {props.auto_merge && <span className='pr-card-chip auto-merge'>Auto complete</span>}
            </section>

            <section style={{ display: 'flex', alignItems: 'center' }}>
                <PullRequestIcon size={32} />
                <section style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ whiteSpace: 'nowrap' }}>{props.title}</span>
                    <span style={{ fontSize: '12px', fontStyle: 'italic', color: '#0007' }}>
                        opened <ReactTimeAgo date={new Date(props.created_at)} locale="en-US" /> by <strong>{props.user.login}</strong>
                    </span>
                </section>
            </section>
            <span style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>merging into <strong>{props.base.label}</strong> from <strong>{props.head.label}</strong></span>

            <section style={{ height: '100px', fontSize: '14px' }}>
                {/* We can display some usefull informations here */}
            </section>

            <a href={props.html_url} title='See it on github' target="_blank" rel="noreferrer noopener">
                <i className="pr-card-github-link fa-solid fa-arrow-up-right-from-square"></i>
            </a>
        </div>
    )
}
