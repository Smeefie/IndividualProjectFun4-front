import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000/api' //process.env.VUE_APP_API_URL

const state = {
    user: {},
    usersNotFriends: [],
};

const getters = {
    GetUser: state => state.user,
    GetUsersNotFriends: state => state.usersNotFriends,
};

const actions = {
    GetUserById(context, credentials) {
        return axios
            .get('/GetUserById', {
                params: { id: credentials.id }
            })
            .then(response => {
                context.commit('SetUser', response.data);
            })
            .catch(error => {
                console.log(error.data);
            })
    },
    GetAllUsersNotFriendsById(context, credentials) {
        return axios
            .get('/GetAllUsersNotFriends', {
                params: { id: credentials.id }
            })
            .then(response => {
                context.commit('SetUsersNotFriends', response.data);
            })
            .catch(error => {
                console.log(error.data);
            })
    },
};

const mutations = {
    SetUser(state, user) {
        state.user = user;
    },
    SetUsersNotFriends(state, usersNotFriends) {
        state.usersNotFriends = usersNotFriends;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}