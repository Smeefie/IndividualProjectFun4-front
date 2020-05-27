import Vue from 'vue';
import Router from 'vue-router';

import Home from './components/HelloWorld.vue';
import Login from './components/Login.vue';
import Profile from './components/Profile.vue';
import Friends from './components/Friends.vue';
import CreateGame from './components/CreateGame.vue';
import Game from './components/Game.vue';
import Statistics from './components/Statistics.vue';
import MatchHistory from './components/MatchHistory.vue';
import MatchDetails from './components/MatchDetails.vue';

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
    },
    {
        path: '/Statistics',
        name: 'Statistics',
        component: Statistics
    },
    {
        path: '/MatchHistory',
        name: 'MatchHistory',
        component: MatchHistory
    },
    {
        path: '/MatchHistory/:gameId',
        props: true,
        name: 'MatchDetails',
        component: MatchDetails
    }
]

export default routes;