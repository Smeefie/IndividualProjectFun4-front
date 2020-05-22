import Vue from 'vue';
import Router from 'vue-router';

import Home from './components/HelloWorld.vue';
import Login from './components/Login.vue';
import Profile from './components/Profile.vue';
import Friends from './components/Friends.vue';
import CreateGame from './components/CreateGame.vue';
import Game from './components/Game.vue';

Vue.use(Router);

const routes = [{
        path: '/Home',
        name: 'Home',
        component: Home
    },
    {
        path: '/Login',
        name: 'Login',
        component: Login
    },
    {
        path: '/Profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/Friends',
        name: 'Friends',
        component: Friends
    },
    {
        path: '/Game',
        name: 'Game',
        component: Game
    },
    {
        path: '/CreateGame',
        name: 'CreateGame',
        component: CreateGame
    }
]

export default routes;