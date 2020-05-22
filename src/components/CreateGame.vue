<template>
  <v-content>
    <Authorized />
    <Navbar />

    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Create Game</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-col>
              <v-autocomplete
                v-model="selectedUsers"
                :items="users"
                :search-input.sync="search"
                filled
                color="grey lighten-2"
                label="Select users to play with"
                item-text="name"
                item-value="id"
                chips
                multiple
                @change="EnableButton"
                @input="search = ''"
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    close
                    @click="data.select"
                    @click:close="remove(data.item)"
                  >{{ data.item.name }}</v-chip>
                </template>
              </v-autocomplete>
            </v-col>
            <v-card-actions class="justify-center">
              <v-btn color="primary" :disabled="!buttonEnabled" @click="SubmitUsers">Start Game</v-btn>
            </v-card-actions>
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

  data() {
    return {
      buttonEnabled: false,
      search: 'nultestl',
      selectedUsers: [],
      users: []
    };
  },

  created() {
    this.users = [];
    var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    axios
      .post("http://localhost:8000/api/GetAllFriends", {
        id: loggedInUser["id"]
      })
      .then(response => {
        this.fullResponse = response.data;

        if (this.fullResponse.length > 0) {
          this.users.push({ header: "Friends" });
          this.fullResponse.forEach(element => {
            this.users.push({ name: element["name"], id: element["id"] });
          });
        }
      });

    axios
      .post("http://localhost:8000/api/GetAllUsersNotFriends", {
        id: loggedInUser["id"]
      })
      .then(response => {
        this.fullResponse = response.data;

        if (this.fullResponse.length > 0) {
          this.users.push({ divider: true });
          this.users.push({ header: "Others" });
          this.fullResponse.forEach(element => {
            this.users.push({ name: element["name"], id: element["id"] });
          });
        }
      });
  },

  methods: {
    SubmitUsers() {
      console.log(this.selectedUsers);
    },
    EnableButton() {
      if (this.selectedUsers.length >= 2) {
        this.buttonEnabled = true;
      } else {
        this.buttonEnabled = false;
      }
    },
    remove(item) {
      const index = this.selectedUsers.indexOf(item.id);
      if (index >= 0) this.selectedUsers.splice(index, 1);
      this.EnableButton();
    }
  }
};
</script>