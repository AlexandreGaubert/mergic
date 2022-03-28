import React from 'react'
import './styles.scss'

export default function DotsLoadingIndicator() {
    return (
        <div id="dots-loading-indicator">
            <div className="dot" id="dot-one" />
            <div className="dot" id="dot-two" />
            <div className="dot" id="dot-three" />
        </div>
    )
}
