import Vue from 'vue';
import Vuex from 'vuex';
import authorizations from './modules/authorizations';
import friends from './modules/friends';
import users from './modules/users';
import games from './modules/games';
import histories from './modules/matchHistories';


Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        authorizations,
        friends,
        users,
        games,
        histories
    }
})