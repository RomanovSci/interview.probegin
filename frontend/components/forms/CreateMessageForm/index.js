import React, {Component} from 'react';
import validate from 'validate.js';
import {
    rules,
    DESTROY_BY_TIME,
    DESTROY_BY_VISIT
} from './rules';
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
            destroyOption: 1,

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
                'destroy_option': this.state.destroyOption,
            },
            _csrf: CSRF_TOKEN,
        })
            .then((res) => {
                let data = res.data;

                if (data.hasOwnProperty('success') && data.success) {
                    this.setState({
                        accessToken: data.accessToken,
                    });

                    return;
                }

                NotificationManager.error('Oppps...Something went wrong');
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

    /**
     * Render destroy option label
     * @returns Sting
     */
    renderDestroyOptionLabel() {

        if (this.state.destroyMethod == DESTROY_BY_TIME) {
            return 'Hours';
        }

        if (this.state.destroyMethod == DESTROY_BY_VISIT) {
            return 'Visit count';
        }

        return '';
    }

    render() {

        if (this.state.accessToken) {
            return (
                <div>
                    <h2>Link for message reading:</h2>
                    <h3>{`${window.location.href}message/${this.state.accessToken}`}</h3>
                </div>
            );
        }

        return (
            <div className="row">
                <div className="col-md-6">
                    <form
                        className="form-horizontal"
                        onSubmit={this.submit.bind(this)}
                    >
                        <div className="form-group">
                            <label className="control-label">Enter your message</label>
                            <textarea
                                type="text"
                                className="form-control"
                                placeholder="Message"
                                onChange={this.changeHandler.bind(this, 'message')}
                                value={this.state.message}
                            />
                        </div>
                        <div className="form-group">
                            <label>Enter password</label>
                            <input
                                type="password"
                                className="form-control"
                                onChange={this.changeHandler.bind(this, 'password')}
                                value={this.state.password}
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm password</label>
                            <input
                                type="password"
                                className="form-control"
                                onChange={this.changeHandler.bind(this, 'confirmPassword')}
                                value={this.state.confirmPassword}
                            />
                        </div>
                        <div className="form-group">
                            <label>Message destroy method</label>
                            <select
                                className="form-control"
                                onChange={this.changeHandler.bind(this, 'destroyMethod')}
                            >
                                <option value="">Chose message destroy method</option>
                                <option value="0">Destroy by time after the creation</option>
                                <option value="1">Destroy after link visit</option>
                            </select>
                        </div>
                        {(() => {
                            if (this.state.destroyMethod) {
                                return (
                                    <div className="form-group">
                                        <label>{this.renderDestroyOptionLabel()}</label>
                                        <input
                                            type="number"
                                            className="form-control col-10"
                                            value={this.state.destroyOption}
                                            onChange={this.changeHandler.bind(this, 'destroyOption')}
                                        />
                                    </div>
                                );
                            }

                            return null;
                        })()}
                        <input
                            type="submit"
                            className="btn btn-default"
                            value="Save message"
                        />
                    </form>
                    <NotificationContainer/>
                </div>
            </div>
        );
    }
};
