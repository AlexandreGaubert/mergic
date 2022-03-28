import React from 'react'
import DotsLoadingIndicator from './dots-loading-indicator/DotsLoadingIndicator'
import './styles.scss'

export default function LoaderScreen() {
    return (
        <div id='loader-screen'>
            Loading pull requests
            <DotsLoadingIndicator />
        </div>
    )
}
