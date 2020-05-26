<template>
  <v-content>
    <Navbar />
    <Authorized />

    <v-row align="center" justify="center">
      <v-col cols="16" sm="12" md="8">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Current Game</v-toolbar-title>
            <v-spacer></v-spacer>
            <template>
              <v-btn color="accent" class="mb-2" @click="dialog = true">Quit Game</v-btn>
            </template>
          </v-toolbar>

          <v-card-text>
            <v-card-title class="justify-center">Game Info</v-card-title>
            <v-row>
              <v-col cols="12" sm="6" md="6" class="text-center">
                <v-card-subtitle style="font-size: 1.5em">General</v-card-subtitle>
                <v-row>
                  <v-col class="text-end">Round:</v-col>
                  <v-col class="text-center">{{gameRound}}</v-col>
                </v-row>
                <v-row>
                  <v-col class="text-end">Limit:</v-col>
                  <v-col class="text-center">{{scoreLimit}}</v-col>
                </v-row>
              </v-col>
              <v-col cols="12" sm="6" md="6" class="text-center">
                <v-card-subtitle style="font-size: 1.5em">Test</v-card-subtitle>
                <v-row>
                  <v-col class="text-end">Round:</v-col>
                  <v-col class="text-center">3</v-col>
                </v-row>
                <v-row>
                  <v-col class="text-end">Limit:</v-col>
                  <v-col class="text-center">15</v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text>
            <v-data-table :headers="headers" :items="users" hide-default-footer class="elevation-1">
              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-badge
                      :content="item.knocked"
                      :value="item.knocked"
                      color="pending"
                      offset-x="20"
                      offset-y="12"
                      class="mr-5"
                    >
                      <v-btn
                        icon
                        v-on="on"
                        @click="item.knocked++; item.timesKnocked++"
                        :disabled="item.status == 1"
                      >
                        <v-icon>mdi-boxing-glove</v-icon>
                      </v-btn>
                    </v-badge>
                  </template>
                  <span>Knock</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      v-on="on"
                      class="mr-2"
                      @click="won(item, true)"
                      :disabled="item.status == 1"
                    >
                      <v-icon>mdi-cards</v-icon>
                    </v-btn>
                  </template>
                  <span>Won with jack</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      v-on="on"
                      class="mr-2"
                      @click="won(item)"
                      :disabled="item.status == 1"
                    >
                      <v-icon>mdi-flag-checkered</v-icon>
                    </v-btn>
                  </template>
                  <span>Won</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="290">
        <v-card>
          <v-card-title class="headline justify-center">Warning</v-card-title>

          <v-card-text class="text-center">Are you sure you want to quit without saving?</v-card-text>

          <v-card-actions class="justify-center">
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false">No</v-btn>

            <v-btn color="green darken-1" text @click="saveAndQuit()">Save and Quit</v-btn>

            <v-btn color="green darken-1" text @click="quit()">Quit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
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
      dialog: false,
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name"
        },
        { text: "Score", value: "score", align: "center" },
        // { text: "Knocked", value: "knocked", align: "end", sortable: false },
        { text: "Actions", value: "actions", align: "end", sortable: false }
      ],
      users: [],

      //Game info
      gameId: -1,
      gameRound: 0,
      gameStatus: 0,
      scoreLimit: 10
    };
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.gameId = JSON.parse(this.$route.query.gameId);

      axios
        .post("http://localhost:8000/api/GetGameInfo", {
          gameId: this.gameId
        })
        .then(async response => {
          await response.data["players"].forEach(player => {
            axios
              .post("http://localhost:8000/api/GetUserById", {
                id: player["userId"]
              })
              .then(async userResponse => {
                await this.users.push({
                  id: userResponse.data["id"],
                  name: userResponse.data["name"],
                  avatar: userResponse.data["avatar"],
                  score: player["score"],
                  knocked: 0,
                  timesKnocked: player["timesKnocked"],
                  roundsWon: player["roundsWon"],
                  roundsWonWithJack: player["roundsWonWithJack"],
                  status: player["status"]
                });
              });
          });

          let gameInfo = response.data["info"];
          this.gameRound = gameInfo["round"];
          this.scoreLimit = gameInfo["limit"];
        });
    },

    won(item, withJack = false) {
      this.users.forEach(user => {
        if (user.id != item.id && user.status != 1) {
          if (!withJack) {
            user.score += 1 + user.knocked;
          } else {
            user.score += 2 + user.knocked;
          }
        }
      });

      if (withJack) {
        item.roundsWonWithJack++;
      } else {
        item.roundsWon++;
      }

      this.users.map(x => {
        x.knocked = 0;
        return x;
      });

      this.loserCheck();

      this.gameRound++;

      this.updateGame();
    },

    loserCheck() {
      this.users.forEach(user => {
        if (user.score >= this.scoreLimit) {
          user.status = true;
        }
      });

      this.winnerCheck();
    },

    winnerCheck() {
      let loserAmount = 0;
      this.users.forEach(user => {
        if (user.status == 1) loserAmount++;
      });

      let winner = null;
      if (loserAmount >= this.users.length - 1) {
        winner = this.users.find(x => {
          return x.status != 1;
        });
      }

      if (winner != null) {
        winner.status = 2;
        this.gameStatus = 1;
        console.log(winner.id);
      }
    },

    quit() {
      this.$router.push("Profile");
    },

    async saveAndQuit() {
      await this.updateGame();
      this.$router.push("Profile");
    },

    updateGame() {
      axios
        .post("http://localhost:8000/api/UpdateGame", {
          gameId: this.gameId,
          players: this.users,
          status: this.gameStatus,
          round: this.gameRound
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>