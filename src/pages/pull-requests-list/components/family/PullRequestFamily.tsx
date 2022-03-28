import classNames from 'classnames';
import React from 'react'
import { PullRequest } from '../../../../types/pull-request';
import PullRequestCard from '../card/PullRequestCard';
import './styles.scss';

interface Props {
    tag: string;
    pullRequests: PullRequest[];
    important?: boolean;
}

export default function PullRequestFamily(props: Props) {
    return (
        <div className={classNames({ 'pr-family': true, important: props.important })}>
            <h1>{props.tag}</h1>
            <section style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
                {props.pullRequests.map((pr, index) => <PullRequestCard key={'pr-card-' + index} {...pr} />)}
            </section>
        </div>
    )
}
