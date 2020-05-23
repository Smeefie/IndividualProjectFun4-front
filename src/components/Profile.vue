<template>
  <v-content>
    <Authorized />
    <Navbar />

    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Profile</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-avatar size="64">
              <img v-bind:src="require('../uploads/avatars/' + avatar)" />
            </v-avatar>
            <v-list-item class="float-right">
              <v-list-item-content>
                <v-list-item-title class="title">{{username}}</v-list-item-title>
                <v-list-item-subtitle></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-spacer></v-spacer>
            </v-list-item>
            <v-list-item>
              <v-file-input
                :rules="rules"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Pick an avatar"
                prepend-icon="mdi-camera"
                label="Avatar"
                disabled=""
              ></v-file-input>
              <v-btn disabled style="margin-left: 50px;">Upload</v-btn>
            </v-list-item>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import Navbar from "@/components/Navbar";
import Authorized from "@/components/Authorized";

export default {
  components: {
    Navbar,
    Authorized
  },

  data() {
    return {
      username: "",
      avatar: "",

      rules: [
        value =>
          !value ||
          value.size < 2000000 ||
          "Avatar size should be less than 2 MB!"
      ]
    };
  },

  created() {
    var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    this.username = loggedInUser["name"];
    this.avatar = loggedInUser["avatar"];
  },
};
</script>