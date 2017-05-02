import React from 'react';
import {
    Router,
    Route,
    RouterState,
    IndexRoute,
    browserHistory
} from 'react-router';
import Layout from './Layout';

/** Pages */
import Home from './components/pages/Home';
import Message from './components/pages/Message';
import NotFound from './components/pages/NotFound';

/** Router */
export default <Router history={browserHistory}>
    <Route path="/" component={Layout}>
        <IndexRoute component={Home}/>
        <Route path="/message/:token" component={Message}/>

        <Route path="*" component={NotFound}/>
    </Route>
</Router>;