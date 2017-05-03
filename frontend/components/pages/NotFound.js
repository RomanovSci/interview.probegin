import React, {Component} from 'react';
import {browserHistory} from 'react-router';

export default class extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        browserHistory.push('/404');
    }

    render() {
        return (
            <main className="main-content">
                <h1>404</h1>
                <div id="wrapper">
                    <h2>Page not found</h2>
                    <button
                        type="button"
                        className="btn btn-action"
                        onClick={() => {browserHistory.push('/')}}
                    >
                        Main page
                    </button>
                </div>
            </main>
        );
    }
};

