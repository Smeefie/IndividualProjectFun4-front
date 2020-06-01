import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000/api' //process.env.VUE_APP_API_URL

const state = {
    gameId: -1,
    exists: false,
    game: {},
    gameInfo: [],
    gamePlayers: []
};

const getters = {
    GetGameId: state => state.gameId,
    GetGame: state => state.game,
    GetGameInfo: state => state.gameInfo,
    GetGamePlayers: state => state.gamePlayers,
    GetGameExists: state => state.exists
};

const actions = {
    CreateNewGame(context, credentials) {
        return axios
            .post('/CreateGame', {
                players: credentials.players,
                limit: credentials.limit,
                creatorId: credentials.creatorId
            })
            .then(response => {
                context.commit('SetGameId', response.data);
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    },
    CheckForGameId(context, credentials) {
        return axios
            .get('/CheckIfGameExists', {
                params: {
                    gameId: credentials.gameId
                }
            })
            .then(response => {
                context.commit('SetGameExists', response.data)
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    },
    GetGameById(context, credentials) {
        return axios
            .get("/GetGameById", {
                params: { gameId: credentials.gameId }
            })
            .then(response => {
                context.commit("SetGame", response.data)
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    },
    GetAllGamePlayersByGameId(context, credentials) {
        return axios
            .get("/GetAllGamePlayers", {
                params: { gameId: credentials.gameId }
            })
            .then(response => {
                context.commit("SetGamePlayers", response.data)
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    },
    GetGameInfoByGameId(context, credentials) {
        return axios
            .get("/GetGameInfo", {
                params: { gameId: credentials.gameId }
            })
            .then(response => {
                context.commit("SetGameInfo", response.data)
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    },
    SaveGame(context, credentials) {
        return axios
            .post("/UpdateGame", {
                gameId: credentials.gameId,
                players: credentials.players,
                status: credentials.status,
                round: credentials.round
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    },
    SaveRound(context, credentials) {
        return axios
            .post("/UpdateRounds", {
                gameId: credentials.gameId,
                winner: credentials.winner,
                withJack: credentials.withJack,
                roundObject: credentials.roundObject
            })
            .catch(error => {
                console.log(error.message);
                throw error;
            })
    }
};

const mutations = {
    SetGameId(state, gameId) {
        state.gameId = gameId;
    },
    SetGame(state, game) {
        state.game = game
    },
    SetGameInfo(state, gameInfo) {
        state.gameInfo = gameInfo
    },
    SetGamePlayers(state, gamePlayers) {
        state.gamePlayers = gamePlayers
    },
    SetGameExists(state, exists) {
        state.exists = exists
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}