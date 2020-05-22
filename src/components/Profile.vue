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
              <img src="https://cdn.onlinewebfonts.com/svg/img_569205.png" />
            </v-avatar>
            <v-list-item class="float-right">
              <v-list-item-content>
                <v-list-item-title class="title">{{Username}}</v-list-item-title>
                <v-list-item-subtitle></v-list-item-subtitle>
              </v-list-item-content>
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
    return{
      Username:""
    }
    
  },

  created(){
    var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    this.Username = loggedInUser['name'];
  }
};
</script>