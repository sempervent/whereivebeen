// src/routes.js
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

const routes = [
    {
        path: '/',
        component: Home,
        exact: true
    },
    {
        path: '/login',
        component: Login,
        exact: true
    },
    {
        path: '/dashboard',
        component: Dashboard,
        exact: true,
        private: true  // this is a suggestion to handle authentication-required routes
    }
];

export default routes;
