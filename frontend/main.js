import React from 'react';
import {render} from 'react-dom';
import routes from './routes';
import moment from 'moment';

moment.locale('uk');

render(
    routes,
    document.getElementById('root')
);