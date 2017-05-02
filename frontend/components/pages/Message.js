import React, {Component} from 'react';
import axios from 'axios';
import {
    NotificationContainer,
    NotificationManager
} from 'react-notifications';
import crypto from 'crypto-js';

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messageIsExists: null,
            password: '',
            message: '',
        };
    }

    /**
     * @inheritDoc
     */
    componentWillMount() {
        axios.get(`/api/message/check?token=${this.props.params.token}`)
            .then(res => {

                if (res.data.hasOwnProperty('success')) {
                    this.setState({
                        messageIsExists: res.data.success,
                    });
                }
            });
    }

    /**
     * Submit get message form
     * @param e
     * @return undefined
     */
    submit(e) {
        e.preventDefault();

        /** Validate password */
        if (!this.state.password) {
            NotificationManager.error('Please enter password');
            return;
        }

        /** Get message */
        axios.get(`/api/message/get`, {
            params: {
                'password': this.state.password,
                'token': this.props.params.token,
            },
        })
            .then(res => {

                if (res.data.hasOwnProperty('success') && res.data.success) {
                    this.setState({
                        message: crypto.AES.decrypt(
                            res.data.message,
                            res.data.key
                        ).toString(crypto.enc.Utf8),
                    });

                    return;
                }

                NotificationManager.error('Wrong password');
            });
    }

    /**
     * Change password field handler
     * @param e
     * @return undefined
     */
    handleChangePass(e) {
        this.setState({
            password: e.target.value,
        });
    }

    render() {
        if (typeof this.state.messageIsExists !== 'boolean') {
            return <p>Loading...</p>
        }

        if (!this.state.messageIsExists) {
            document.location.href = '/404';
            return null;
        }

        if (this.state.message) {
            return <p>{this.state.message}</p>
        }

        return (
            <div>
                <form onSubmit={this.submit.bind(this)}>
                    <input
                        type="password"
                        onChange={this.handleChangePass.bind(this)}
                        value={this.state.password}
                    />
                    <input type="submit" value="Show message"/>
                </form>
                <NotificationContainer/>
            </div>
        );
    }
};