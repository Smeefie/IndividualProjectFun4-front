import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000/api' //process.env.VUE_APP_API_URL

const state = {
    allGames: [],
    matchDetails: [],
};

const getters = {
    GetAllGames: state => state.allGames,
    GetMatchDetails: state => state.matchDetails
};

const actions = {
    GetAllGamesByUserId(context, credentials) {
        return axios
            .get("/GetAllGamesByUserId", {
                params: { userId: credentials.userId }
            })
            .then(response => {
                context.commit("SetAllGames", response.data)
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    },
    GetAllMatchDetails(context, credentials) {
        return axios
            .get("GetMatchDetails", {
                params: {
                    gameId: credentials.gameId
                }
            })
            .then(response => {
                context.commit("SetMatchDetails", response.data)
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    }
};

const mutations = {
    SetAllGames(state, allGames) {
        state.allGames = allGames;
    },
    SetMatchDetails(state, matchDetails) {
        state.matchDetails = matchDetails
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}