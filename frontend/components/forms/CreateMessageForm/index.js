import React, {Component} from 'react';
import validate from 'validate.js';
import {rules} from './rules';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import crypto from 'crypto-js';
import randomstring from 'randomstring';
import axios from 'axios';

const KEY_LENGTH = 128;
const CSRF_TOKEN = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute('content');

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            eKey: '',
            eMessage: '',

            message: '',
            password: '',
            confirmPassword: '',
            destroyMethod: '',

            accessToken: '',
        };
    }

    /**
     * Validate form data
     * @return boolean|undefined
     */
    validate() {
        let validationResult = validate(this.state, rules);

        if (!validationResult) {
            return true;
        }

        /** Show first error */
        NotificationManager.error(
            validationResult[Object.keys(validationResult)[0]][0]
        );
    }

    /**
     * Encrypt message
     * @return boolean
     */
    encryptMessage() {

        /** Generate encrypt key and crypt message */
        this.state.eKey = randomstring.generate(KEY_LENGTH);
        this.state.eMessage = crypto.AES.encrypt(
            this.state.message,
            this.state.eKey
        ).toString();

        this.forceUpdate();
    }

    /**
     * Form submit handler
     * @param e
     * @return boolean
     */
    submit(e) {
        e.preventDefault();

        /** Validation */
        if (!this.validate()) {
            return false;
        }

        /** Encryption */
        this.encryptMessage();

        /** Sending to server */
        axios.post('api/message/create', {
            Message: {
                'message': this.state.eMessage,
                'key': this.state.eKey,
                'password': this.state.password,
                'destroy_method': this.state.destroyMethod,
            },
            _csrf: CSRF_TOKEN,
        })
            .then((res) => {
                let data = res.data;

                if (data.hasOwnProperty('success') && data.success) {
                    this.setState({
                        accessToken: data.accessToken,
                    });
                }
            });
    }

    /**
     * Input change handler
     * @param field
     * @param e
     */
    changeHandler(field, e) {
        this.setState({
            [field]: e.target.value
        });
    }

    render() {
        if (this.state.accessToken) {
            return <p>{this.state.accessToken}</p>;
        }

        return (
            <div>
                <form onSubmit={this.submit.bind(this)} >
                    <input
                        type="text"
                        onChange={this.changeHandler.bind(this, 'message')}
                        value={this.state.message}
                    />
                    <input
                        type="password"
                        onChange={this.changeHandler.bind(this, 'password')}
                        value={this.state.password}
                    />
                    <input
                        type="password"
                        onChange={this.changeHandler.bind(this, 'confirmPassword')}
                        value={this.state.confirmPassword}
                    />
                    <select onChange={this.changeHandler.bind(this, 'destroyMethod')}>
                        <option value="">Chose message destroy method</option>
                        <option value="0">By time</option>
                        <option value="1">By read</option>
                    </select>
                    <input type="submit" value="Save message"/>
                </form>
                <NotificationContainer/>
            </div>
        );
    }
};
