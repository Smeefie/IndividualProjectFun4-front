import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_API_URL

const state = {
    friends: [],
    addedFriend: {},
    friendRequest: {},
    friendRequests: []
};

const getters = {
    GetFriends: state => state.friends,
    GetAddedFriend: state => state.addedFriend,
    GetAllFriendRequests: state => state.friendRequests,
    GetFriendRequest: state => state.friendRequest
};

const actions = {
    GetAllFriendsById(context, credentials) {
        return axios
            .get('/GetAllFriends', {
                params: { id: credentials.id }
            })
            .then(response => {
                context.commit('SetFriends', response.data);
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    },
    GetAllFriendRequestsById(context, credentials) {
        return axios
            .get('/GetAllFriendRequests', {
                params: { id: credentials.id }
            })
            .then(response => {
                context.commit('SetAllFriendRequests', response.data);
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    },
    GetFriendRequestById(context, credentials) {
        return axios
            .get('/GetFriendRequest', {
                params: { id: credentials.id, friendId: credentials.friendId }
            })
            .then(response => {
                context.commit('SetFriendRequest', response.data);
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    },

    AcceptFriend(context, credentials) {
        return axios
            .post("/AcceptFriend", {
                id: credentials.id,
                friendId: credentials.friendId
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    },
    DeclineFriend(context, credentials) {
        return axios
            .delete("/DeclineFriend", {
                id: credentials.id,
                friendId: credentials.friendId
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    },
    AddFriend(context, credentials) {
        return axios
            .post("/AddFriend", {
                id: credentials.id,
                friendId: credentials.friendId
            })
            .then(response => {
                context.commit('SetAddedFriend', response.data)
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    },
    RemoveFriend(context, credentials) {
        return axios
            .delete("/RemoveFriend", {
                data: {
                    id: credentials.id,
                    friendId: credentials.friendId
                }
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    },

};

const mutations = {
    SetFriends(state, friends) {
        state.friends = friends;
    },
    SetAddedFriend(state, addedFriend) {
        state.addedFriend = addedFriend;
    },
    SetAllFriendRequests(state, friendRequests) {
        state.friendRequests = friendRequests;
    },
    SetFriendRequest(state, friendRequest) {
        state.friendRequest = friendRequest;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}