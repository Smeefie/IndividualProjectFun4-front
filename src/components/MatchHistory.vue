<template>
  <v-content>
    <Authorized />
    <Navbar />
    <v-row align="center" justify="center">
      <v-col cols="12" sm="12" md="8">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Match History</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text v-if="showHistory">
            <v-card-title class="justify-center">{{loggedInUser['name']}}'s Match History</v-card-title>

            <v-data-table
              :headers="headers"
              :items="games"
              class="elevation-1"
              multi-sort
              :sort-by="['status', 'round']"
              :sort-desc="[true, true]"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn v-if="item.status == 'Finished'" color="primary" class="mr-5" @click="details(item)">Details</v-btn>
                <v-btn v-else color="pending" class="mr-5" @click="resume(item)">Resume</v-btn>
                <v-btn color="warning" class="mr-5" @click="openDialog(item)">Delete</v-btn>
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-text v-else>
            <v-card-title class="justify-center">No Matches Played</v-card-title>
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

            <v-btn color="green darken-1" text @click="deleteGame(sender)">Delete</v-btn>
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
      sender: 0,
      showHistory: true,
      loggedInUser: JSON.parse(localStorage.getItem("loggedInUser")),

      headers: [
        {
          text: "ID",
          align: "start",
          value: "id"
        },
        { text: "Score Limit", value: "limit", align: "start" },
        { text: "Round", value: "round", align: "start", sortable: false },
        { text: "Status", value: "status", align: "start", sortable: false },
        // { text: "Knocked", value: "knocked", align: "end", sortable: false },
        { text: "", value: "actions", align: "end", sortable: false }
      ],
      games: []
    };
  },

  created() {
    axios
      .get(
        `http://localhost:8000/api/GetAllGamesByUserId/${this.loggedInUser["id"]}`
      )
      .then(response => {
        if (response.data.length > 0) {
          response.data.forEach(element => {
            this.games.push({
              id: element["gameId"],
              limit: element["limit"],
              round: element["round"],
              status: element["status"] ? "Finished" : "In Progress"
            });
          });
        } else {
          this.showHistory = false;
        }
      })
      .catch(error => {
        console.log(error);
      });
  },

  methods: {
    resume(item) {
      console.log(item.id);
      this.$router.push({
        path: `/Game?gameId=${item.id}`
      });
    },

    details(item) {
      this.$router.push(`/MatchHistory/${item.id}`);
    },

    deleteGame(item) {
      axios.delete(`http://localhost:8000/api/DeleteGame/${item.id}`);
      function findWithAttr(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
          if (array[i][attr] === value) {
            return i;
          }
        }
        return -1;
      }
      this.games.splice(findWithAttr(this.games, "id", item.id), 1);
      if(this.games.length <= 0) this.showHistory = false;
      this.dialog = false;
    },

    openDialog(sender) {
      this.sender = sender;
      this.dialog = true;
    }
  }
};
</script>