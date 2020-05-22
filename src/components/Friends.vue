<template>
  <v-content>
    <Authorized />
    <Navbar />

    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Friends</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-card-title class="justify-center">Add a new friend</v-card-title>
            <v-col cols="12">
              <v-autocomplete
                v-model="friends"
                :disabled="isUpdating"
                :items="users"
                color="secondary"
                item-text="name"
                item-value="id"
                placeholder="Select user"
                no-data-text="No users to add"
              >
                <template v-slot:item="data">
                  <template v-if="typeof data.item !== 'object'">
                    <v-list-item-content v-text="data.item"></v-list-item-content>
                  </template>
                  <template v-else>
                    <v-list-item-avatar>
                      <img v-bind:src="require('../uploads/avatars/' + data.item.avatar)" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-html="data.item.name"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
            </v-col>

            <v-card-actions class="justify-center">
              <v-btn color="primary" @click="addFriend()">Add Friend</v-btn>
            </v-card-actions>
          </v-card-text>

          <v-spacer></v-spacer>
          <v-card-text v-if="showFriendList">
            <v-card-title class="justify-center">Current Friends</v-card-title>

            <v-list subheader>
              <v-list-item v-for="friend in currentFriends" :key="friend.name">
                <v-list-item-avatar>
                  <v-img v-bind:src="require('../uploads/avatars/' + friend.avatar)"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-text="friend.name"></v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on" @click="removeFriend(friend)">
                        <v-icon>mdi-trash-can-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Delete</span>
                  </v-tooltip>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-text v-if="!showFriendList">
            <v-card-title class="justify-center">No Friends</v-card-title>
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
      <v-btn color="accent" text @click="generalSnack = false">Close</v-btn>
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
      autoUpdate: true,
      isUpdating: false,
      showFriendList: false,
      friends: [],
      users: [],

      generalSnack: false,
      generalSnackColor: "error",
      generalSnackText: "",
      generalSnackTimeout: 5000,

      currentFriends: []
    };
  },

  created() {
    this.updateLists();
  },

  watch: {
    isUpdating(val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 3000);
      }
    }
  },

  methods: {
    remove(item) {
      const index = this.friends.indexOf(item.name);
      if (index >= 0) this.friends.splice(index, 1);
    },

    addFriend() {
      var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

      axios
        .post("http://localhost:8000/api/AddFriend", {
          id: loggedInUser["id"],
          friendId: this.friends
        })
        .then(response => {
          this.fullResponse = response.data;
          axios
            .post("http://localhost:8000/api/GetUserById", {
              id: this.fullResponse["userRequested"]
            })
            .then(userResponse => {
              this.addToList(this.currentFriends, userResponse.data);
              this.removeFromList(this.users, userResponse.data);
              this.showFriendList = true;
              this.generateSnack(
                "Successfully added " +
                  userResponse.data["name"] +
                  " as friend.",
                "primary"
              );
            });           
        })
        .catch(error => {
          this.generateSnack(error.message);
        });       
    },

    fillUserList() {
      this.users = [];
      var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

      axios
        .post("http://localhost:8000/api/GetAllUsersNotFriends", {
          id: loggedInUser["id"]
        })
        .then(response => {
          this.fullResponse = response.data;

          this.fullResponse.forEach(element => {
            if (loggedInUser["id"] != element["id"])
            this.addToList(this.users, element);
          });
        });
    },

    fillFriendsList() {
      this.currentFriends = [];
      var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      axios
        .post("http://localhost:8000/api/GetAllFriends", {
          id: loggedInUser["id"]
        })
        .then(response => {
          this.fullResponse = response.data;

          if (this.fullResponse.length > 0) {
            this.showFriendList = true;

            this.fullResponse.forEach(element => {
              if (loggedInUser["id"] != element["id"])
                this.addToList(this.currentFriends, element);
            });
          } else {
            this.showFriendList = false;
          }
        });
    },

    addToList(list, userToAdd) {
      list.push({
        name: userToAdd["name"],
        id: userToAdd["id"],
        avatar: userToAdd["avatar"]
      });
    },

    removeFromList(list, userToRemove){
      function findWithAttr(array, attr, value) {
      for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
          }
        }
      return -1;
      }
      list.splice(findWithAttr(list, 'id', userToRemove['id']), 1)
    },

    generateSnack(text, color = "error") {
      this.generalSnackText = text;
      this.generalSnackColor = color;
      this.generalSnack = true;
    },

    removeFriend(friend) {
      var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      axios.post("http://localhost:8000/api/RemoveFriend", {
        id: loggedInUser["id"],
        friendId: friend.id
      })
      .then(() => {
          axios
            .post("http://localhost:8000/api/GetUserById", {
              id: friend.id
            })
            .then(userResponse => {
              this.addToList(this.users, userResponse.data);
              this.removeFromList(this.currentFriends, userResponse.data);
              this.generateSnack(
                "Successfully removed " +
                  userResponse.data["name"] +
                  " as friend.",
                "primary"
              );
            });

            if(this.currentFriends.length <= 1){
              this.showFriendList = false;
            }
        })
        .catch(error => {
          this.generateSnack(error.message);
        });
    },

    updateLists() {
      this.fillUserList();
      this.fillFriendsList();
    }
  }
};
</script>