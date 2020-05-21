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
              <v-select
                v-model="selectedUsers"
                :items="users"
                item-text="name"
                item-value="id"
                label="Select users"
                multiple
                chips
                hint="What users are joining the game"
                persistent-hint
                @change="EnableButton"
              ></v-select>
            </v-col>
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn color="primary" :disabled="!buttonEnabled" @click="SubmitUsers">Start Game</v-btn>
          </v-card-actions>
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
      selectedUsers: [],
      users: []
    };
  },

  created() {
    axios.get("http://localhost:8000/api/GetAllUsers").then(response => {
      this.fullResponse = response.data;
      this.fullResponse.forEach(element => {
        this.users.push(element);
      });
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
    }
  }
};
</script>