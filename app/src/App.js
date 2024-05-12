// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { isAuthenticated } from './utils/auth';
import routes from './routes';
// Inside your Router setup

const App = () => {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Switch>
                    {routes.map((route, index) => {
                        const { path, component, exact, private: isPrivate } = route;
                        return <Route key={index} path={path} exact={exact} render={(props) => (
                            isPrivate && !isAuthenticated() ? <Redirect to="/login" /> : React.createElement(component, props)
                        )} />;
                    })}
                </Switch>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
