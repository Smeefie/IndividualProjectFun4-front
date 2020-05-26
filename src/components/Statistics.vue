<template>
  <v-content>
    <Authorized />
    <Navbar />

    <v-row align="center" justify="center">
      <v-col cols="12" sm="12" md="8">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Statistics</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text v-if="showStats">
            <v-card-title class="justify-center">{{loggedInUser['name']}}'s Statistics</v-card-title>
            <v-row>
              <v-col cols="12" sm="6" md="6" class="text-center">
                <v-card-subtitle style="font-size: 1.5em">Game Statistics</v-card-subtitle>
                <v-row>
                  <v-col class="text-end" style="padding: 0 25px 0 0">Games Played:</v-col>
                  <v-col class="text-start" style="padding: 0 0 0 25px">{{gamesPlayed}}</v-col>
                </v-row>
                <v-row>
                  <v-col class="text-end" style="padding: 0 25px 0 0">Games Won:</v-col>
                  <v-col class="text-start" style="padding: 0 0 0 25px">{{gamesWon}}</v-col>
                </v-row>
                <v-row>
                  <v-col class="text-end" style="padding: 0 25px 0 0">Win/Lose Ratio:</v-col>
                  <v-col class="text-start" style="padding: 0 0 0 25px">{{gameWLRatio}}</v-col>
                </v-row>
              </v-col>
              <v-col cols="12" sm="6" md="6" class="text-center">
                <v-card-subtitle style="font-size: 1.5em">Player Statistics</v-card-subtitle>
                <v-row>
                  <v-col class="text-end" style="padding: 0 25px 0 0">Times Knocked:</v-col>
                  <v-col class="text-start" style="padding: 0 0 0 25px">{{timesKnocked}}</v-col>
                </v-row>
                <v-row>
                  <v-col class="text-end" style="padding: 0 25px 0 0">Avg. Times Knocked:</v-col>
                  <v-col class="text-start" style="padding: 0 0 0 25px">{{avgTimesKnocked}}</v-col>
                </v-row>
                <v-divider style="margin: 2% 20% 2% 10%"></v-divider>
                <v-row>
                  <v-col class="text-end" style="padding: 0 25px 0 0">Rounds won:</v-col>
                  <v-col class="text-start" style="padding: 0 0 0 25px">{{roundsWon}}</v-col>
                </v-row>
                <v-row>
                  <v-col class="text-end" style="padding: 0 25px 0 0">Rounds won with Jack:</v-col>
                  <v-col class="text-start" style="padding: 0 0 0 25px">{{roundsWonWithJack}}</v-col>
                </v-row>
                <v-row>
                  <v-col class="text-end" style="padding: 0 25px 0 0">Round Win/Lose Ratio:</v-col>
                  <v-col class="text-start" style="padding: 0 0 0 25px">{{roundWLRatio}}</v-col>
                </v-row>
                <v-divider style="margin: 2% 20% 2% 10%"></v-divider>
                <v-row>
                  <v-col class="text-end" style="padding: 0 25px 0 0">Total Penalty score:</v-col>
                  <v-col class="text-start" style="padding: 0 0 0 25px">{{penaltyScore}}</v-col>
                </v-row>
                <v-row>
                  <v-col class="text-end" style="padding: 0 25px 0 0">Avg. Penalty score:</v-col>
                  <v-col class="text-start" style="padding: 0 0 0 25px">{{avgPenaltyScore}}</v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text v-else>
            <v-card-title class="justify-center">No Statistics</v-card-title>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-if="generalSnackText"
      v-model="generalSnack"
      :color="this.generalSnackColor"
      :top="false"
      :timeout="this.generalSnackTimeout"
    >
      {{ generalSnackText }}
      <v-btn color="accent_light" text @click="generalSnack = false">Close</v-btn>
    </v-snackbar>
  </v-content>
</template>

<script>
import Navbar from "@/components/Navbar";
import Authorized from "@/components/Authorized";
import axios from "axios";

export default {
  components: {
    Navbar,
    Authorized
  },

  data() {
    return {
      generalSnack: false,
      generalSnackColor: "error",
      generalSnackText: "",
      generalSnackTimeout: 5000,

      showConsole: false,
      showStats: true,

      loggedInUser: JSON.parse(localStorage.getItem("loggedInUser")),

      games: [],
      gamePlayers: [],

      gamesPlayed: 0,
      gamesWon: 0,
      gameWLRatio: 0,

      timesKnocked: 0,
      avgTimesKnocked: 0,

      roundsWon: 0,
      roundsWonWithJack: 0,
      roundWLRatio: 0,

      penaltyScore: 0,
      avgPenaltyScore: 0
    };
  },

  async created() {
    await axios
      .post("http://localhost:8000/api/GetAllGamePlayersForUser", {
        userId: this.loggedInUser["id"]
      })
      .then(async playersResponse => {
        if (playersResponse.data.length > 0) {
          this.gamePlayers = playersResponse.data;
          for (let gameIdPlayer of this.gamePlayers) {
            await axios
              .post("http://localhost:8000/api/GetGameById", {
                gameId: gameIdPlayer["gameId"]
              })
              .then(gamesResponse => {
                this.games.push(gamesResponse.data);
              })
              .catch(error => {
                console.log(error);
              });
          }
        } else {
          this.showStats = false;
        }
      })
      .catch(error => {
        console.log(error);
      });

    this.calcGamesPlayed();
    this.calcGamesWon();
    this.calcGameWLRatio();
    this.calcTimesKnocked();
    this.calcAvgTimesKnocked();
    this.calcRoundsWon();
    this.calcRoundsWonWithJack();
    this.calcRoundWLRatio();
    this.calcPenaltyScore();
    this.calcAvgPenaltyScore();
  },

  methods: {
    calcGamesPlayed() {
      let amount = this.games.length;
      this.gamesPlayed = amount;

      if (this.showConsole) console.log("Games Played = " + amount);
    },

    calcGamesWon() {
      let amount = 0;
      this.gamePlayers.forEach(game => {
        if (game.status == 2) amount++;
      });
      this.gamesWon = amount;

      if (this.showConsole) console.log("Games Won = " + amount);
    },

    calcGameWLRatio() {
      let ratio =
        Math.round(
          ((this.gamesWon / this.gamesPlayed) * 100 + Number.EPSILON) * 100
        ) / 100;
      this.gameWLRatio = ratio;

      if (this.showConsole) console.log("Ratio = " + ratio);
    },

    calcTimesKnocked() {
      let amount = this.gamePlayers.reduce(
        (a, b) => a + (b["timesKnocked"] || 0),
        0
      );
      this.timesKnocked = amount;

      if (this.showConsole) console.log("Knocked = " + amount);
    },

    calcAvgTimesKnocked() {
      let avg =
        Math.round(
          (this.timesKnocked / this.gamesPlayed + Number.EPSILON) * 100
        ) / 100;
      this.avgTimesKnocked = avg;
      if (this.showConsole) console.log("Avg. Knocked = " + avg);
    },

    calcRoundsWon() {
      let amount = this.gamePlayers.reduce(
        (a, b) => a + (b["roundsWon"] || 0),
        0
      );
      this.roundsWon = amount;

      if (this.showConsole) console.log("Rounds Won = " + amount);
    },

    calcRoundsWonWithJack() {
      let amount = this.gamePlayers.reduce(
        (a, b) => a + (b["roundsWonWithJack"] || 0),
        0
      );
      this.roundsWonWithJack = amount;

      if (this.showConsole) console.log("Rounds Won With Jack = " + amount);
    },

    calcRoundWLRatio() {
      let roundsPlayed = this.games.reduce((a, b) => a + (b["round"] || 0), 0);
      let ratio =
        Math.round(
          ((this.roundsWon / roundsPlayed) * 100 + Number.EPSILON) * 100
        ) / 100;
      this.roundWLRatio = ratio;

      if (this.showConsole) console.log("Round Ratio = " + ratio);
    },

    calcPenaltyScore() {
      let amount = this.gamePlayers.reduce((a, b) => a + (b["score"] || 0), 0);
      this.penaltyScore = amount;

      if (this.showConsole) console.log("Penalty = " + amount);
    },

    calcAvgPenaltyScore() {
      let avg =
        Math.round(
          (this.penaltyScore / this.gamesPlayed + Number.EPSILON) * 100
        ) / 100;
      this.avgPenaltyScore = avg;

      if (this.showConsole) console.log("Avg Penalty = " + avg);
    }
  }
};
</script>