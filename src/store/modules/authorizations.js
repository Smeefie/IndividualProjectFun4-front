import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_API_URL

const state = {
    token: localStorage.getItem('accessToken'),
    loggedInUser: JSON.parse(localStorage.getItem("loggedInUser")),
};

const getters = {
    GetAccessToken: state => state.token,
    GetLoggedInUser: state => state.loggedInUser
};

const actions = {
    LoginUser(context, credentials) {
        return axios
            .post("/Login", {
                email: credentials.email,
                password: credentials.password
            })
            .then(response => {
                localStorage.setItem("accessToken", response.data['accessToken']);
                context.commit('SetAccessToken', response.data['accessToken']);
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    },

    RegisterUser(context, credentials) {
        return axios
            .post("/Register", {
                name: credentials.name,
                email: credentials.email,
                password: credentials.password,
                password_confirmation: credentials.password_confirmation
            })
            .then(response => {
                localStorage.setItem("accessToken", response.data["accessToken"]);
                context.commit('GetAccessToken', response.data['accessToken']);
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    },
    UploadUser(context, credentials) {
        return axios
            .get('/GetUserByEmail', {
                params: { email: credentials.email }
            })
            .then(response => {
                localStorage.setItem("loggedInUser", JSON.stringify(response.data));
                context.commit('SetLoggedInUser', JSON.stringify(response.data));
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })


    }
};

const mutations = {
    SetAccessToken(state, token) {
        state.token = token;
    },
    SetLoggedInUser(state, user) {
        state.user = user;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}