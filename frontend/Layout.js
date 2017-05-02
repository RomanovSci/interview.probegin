import './styles/main.scss';
import React, {Component} from 'react';

export default class Layout extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="content">
                {this.props.children}
            </div>
        );
    }
};