import React, {Component} from 'react';
import CreateMessageForm from '../forms/CreateMessageForm/index';

export default class extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p>Main page from react</p>
                <CreateMessageForm />
            </div>
        );
    }
};