<template>
  <v-content>
    <Authorized />
    <Navbar />
    <v-row align="center" justify="center">
      <v-col cols="12" sm="12" md="8">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Match Details</v-toolbar-title>
            <v-spacer></v-spacer>
            <template>
              <v-btn color="warning" class="mb-2" @click="dialog = true">Delete Game</v-btn>
            </template>
          </v-toolbar>
          <v-card-text v-if="showHistory">
            <v-card-title class="justify-center">{{gameId}}</v-card-title>
            <v-card-subtitle class="text-center">Won by {{winner}}</v-card-subtitle>

            <v-data-table
              :headers="headers"
              :items="rounds"
              show-expand
              class="elevation-1"
              multi-sort
              item-key="roundNr"
              :sort-by="['status', 'round']"
              :sort-desc="[true, true]"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <tr>
                      <th>Name</th>
                      <th class="text-center">Score</th>
                      <th class="text-center">Times Knocked</th>
                      <th class="text-center">Outcome</th>
                      <th class="text-end">Status</th>
                    </tr>
                    <tr v-for="player in item.players" :key="player.id">
                      <td>{{player.name}}</td>
                      <td class="text-center">{{player.score}}</td>
                      <td class="text-center">{{player.timesKnocked}}</td>
                      <td
                        class="text-center"
                        v-if="player.withJack == 0"
                      >{{player.roundStatus ? 'Winner' : ''}}</td>
                      <td
                        class="text-center"
                        v-else
                      >{{player.roundStatus ? 'Winner with jack' : ''}}</td>
                      <td
                        class="text-end"
                        v-if="player.status != 0"
                      >{{player.status == 1 ? 'ELIMINATED' : 'WINNER'}}</td>
                      <td class="text-end" v-else></td>
                    </tr>
                  </table>
                </td>
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

          <v-card-text class="text-center">Are you sure you want to delete this game?</v-card-text>

          <v-card-actions class="justify-center">
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="dialog = false">No</v-btn>

            <v-btn color="green darken-1" text @click="deleteGame()">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-content>
</template>

<script>
import Navbar from "@/components/Navbar";
import Authorized from "@/components/Authorized";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    Navbar,
    Authorized
  },
  props: ["gameId"],

  data() {
    return {
      showHistory: true,
      dialog: false,
      rounds: [],
      winner: "",
      expanded: false,
      headers: [
        {
          text: "Round",
          align: "start",
          value: "roundNr",
          sortable: false
        },
        {
          text: "Winner",
          align: "start",
          value: "roundWinner",
          sortable: false
        },
        { text: "", value: "data-table-expand", sortable: false }
      ]
    };
  },

  computed: {
    ...mapGetters(["GetMatchDetails"])
  },

  async created() {
    await this.GetAllMatchDetails({
      gameId: this.gameId
    }).then(() => {
      this.GetMatchDetails.forEach(element => {
        let roundInfo = element["roundInfo"];
        let playerInfo = element["playerInfo"];

        this.rounds.push({
          roundNr: roundInfo["roundNr"],
          roundWinner: playerInfo.filter(p => {
            return p.roundStatus === 1;
          })[0]["name"],
          players: playerInfo
        });
      });
    });

    this.winner = this.rounds[this.rounds.length - 1]["players"].filter(p => {
      return p.status === 2;
    })[0]["name"];
  },

  methods: {
    ...mapActions(["GetAllMatchDetails", "DeleteGameById"]),

    deleteGame() {
      this.DeleteGameById({ gameId: this.gameId });
      this.dialog = false;
    },
  }
};
</script>