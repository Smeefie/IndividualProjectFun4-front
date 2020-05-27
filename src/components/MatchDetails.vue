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
          </v-toolbar>
          <v-card-text v-if="showHistory">
            <v-card-title class="justify-center">{{gameId}}</v-card-title>

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
  props: ["gameId"],

  data() {
    return {
      showHistory: true,
      loggedInUser: JSON.parse(localStorage.getItem("loggedInUser")),
      rounds: [],
      expanded: false,
      headers: [
        {
          text: "Round",
          align: "start",
          value: "roundNr"
        },
        { text: "", value: "data-table-expand" }
      ]
    };
  },

  created() {
    axios
      .get(`http://localhost:8000/api/GetMatchDetails/${this.gameId}`)
      .then(response => {
        response.data.forEach(element => {
          let roundInfo = element["roundInfo"];
          let playerInfo = element["playerInfo"];
          console.log(playerInfo);
          this.rounds.push({
            roundNr: roundInfo["roundNr"],
            players: playerInfo
          });
        });
      }).catch;
  },

  methods: {}
};
</script>