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
          <v-section>
          <v-card-text v-if="currentFriends.length >0">
            <v-card-title class="justify-center">Current Friends</v-card-title>

            <v-list subheader>
              <v-list-item v-for="friend in currentFriends" :key="friend.name">
                <v-badge
                  :content="friend.status"
                  :value="friend.status"
                  overlap
                  color="#324d3d"
                  offset-x="28"
                  offset-y="20"
                  v-if="friend.status > 0"
                >
                  <v-list-item-avatar>
                    <v-img
                      v-bind:src="require('../uploads/avatars/' + friend.avatar)"
                      style="border-radius:50%"
                    ></v-img>
                  </v-list-item-avatar>
                  <template v-slot:badge>
                    <v-icon>mdi-check</v-icon>
                  </template>
                </v-badge>

                <v-badge
                  :content="1"
                  :value="1"
                  overlap
                  color="#75664b"
                  offset-x="28"
                  offset-y="20"
                  v-else
                >
                  <v-list-item-avatar>
                    <v-img
                      v-bind:src="require('../uploads/avatars/' + friend.avatar)"
                      style="border-radius:50%"
                    ></v-img>
                  </v-list-item-avatar>
                  <template v-slot:badge>
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </template>
                </v-badge>

                <v-list-item-content>
                  <v-list-item-title v-text="friend.name"></v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-tooltip right>
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

          <v-card-text v-else>
            <v-card-title class="justify-center">No Friends</v-card-title>
          </v-card-text>
          </v-section>

          <v-card-text v-if="friendRequests.length > 0">
            <v-card-title class="justify-center">Friend Requests</v-card-title>

            <v-list subheader>
              <v-list-item v-for="friend in friendRequests" :key="friend.name">
                <v-list-item-avatar>
                  <v-img v-bind:src="require('../uploads/avatars/' + friend.avatar)"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-text="friend.name"></v-list-item-title>
                </v-list-item-content>

                <v-card-actions>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on" @click="declineRequest(friend)">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </template>
                    <span>Decline</span>
                  </v-tooltip>

                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on" @click="acceptRequest(friend)">
                        <v-icon>mdi-check</v-icon>
                      </v-btn>
                    </template>
                    <span>Accept</span>
                  </v-tooltip>
                </v-card-actions>
              </v-list-item>
            </v-list>
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
      autoUpdate: true,
      isUpdating: false,
      friends: [],
      friendRequests: [],
      currentFriends: [],
      users: [],

      generalSnack: false,
      generalSnackColor: "error",
      generalSnackText: "",
      generalSnackTimeout: 5000
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

    generateSnack(text, color = "error") {
      this.generalSnackText = text;
      this.generalSnackColor = color;
      this.generalSnack = true;
    },

    //#region Update and fill lists
    //FILL LISTS
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

          this.fullResponse.forEach(element => {
            if (loggedInUser["id"] != element["id"])
              this.addToList(this.currentFriends, element, true);
          });
        });
    },

    fillRequestsList() {
      this.friendRequests = [];
      var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

      axios
        .post("http://localhost:8000/api/GetAllFriendRequests", {
          id: loggedInUser["id"]
        })
        .then(response => {
          this.fullResponse = response.data;

          this.fullResponse.forEach(element => {
            axios
              .post("http://localhost:8000/api/GetUserById", {
                id: element["requester"]
              })
              .then(userResponse => {
                this.addToList(this.friendRequests, userResponse.data);
              });
          });
        });
    },

    //UPDATE LISTS
    updateLists() {
      this.fillUserList();
      this.fillFriendsList();
      this.fillRequestsList();
    },

    //ADDING AND REMOVING FROM LISTS
    addToList(list, userToAdd, doFriendlist = false) {
      if (doFriendlist) {
        var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        axios
          .post("http://localhost:8000/api/GetFriendRequest", {
            id: loggedInUser["id"],
            friendId: userToAdd.id
          })
          .then(response => {
            list.push({
              name: userToAdd["name"],
              id: userToAdd["id"],
              avatar: userToAdd["avatar"],
              status: response.data["status"]
            });
          });
      } else {
        list.push({
          name: userToAdd["name"],
          id: userToAdd["id"],
          avatar: userToAdd["avatar"],
          status: 0
        });
      }
    },

    removeFromList(list, userToRemove) {
      function findWithAttr(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
          if (array[i][attr] === value) {
            return i;
          }
        }
        return -1;
      }
      list.splice(findWithAttr(list, "id", userToRemove["id"]), 1);
    },

    //#endregion

    //#region Adding, Removing, Accepting and Declining
    acceptRequest(user) {
      var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

      axios
        .post("http://localhost:8000/api/AcceptFriend", {
          id: loggedInUser["id"],
          friendId: user.id
        })
        .then(() => {
          axios
            .post("http://localhost:8000/api/GetUserById", {
              id: user.id
            })
            .then(userResponse => {
              this.addToList(this.currentFriends, userResponse.data, true);
              this.removeFromList(this.friendRequests, userResponse.data);
              this.generateSnack(
                "Accepted " + userResponse.data["name"] + " as a friend.",
                "primary"
              );
            });
        })
        .catch(error => {
          this.generateSnack(error.message);
        });
    },

    declineRequest(user) {
      var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

      axios
        .post("http://localhost:8000/api/DeclineFriend", {
          id: loggedInUser["id"],
          friendId: user.id
        })
        .then(() => {
          axios
            .post("http://localhost:8000/api/GetUserById", {
              id: user.id
            })
            .then(userResponse => {
              this.removeFromList(this.friendRequests, userResponse.data);
              this.generateSnack(
                "Declined" + userResponse.data["name"] + " as a friend.",
                "primary"
              );
            });
        })
        .catch(error => {
          this.generateSnack(error.message);
        });
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
              this.addToList(this.currentFriends, userResponse.data, true);
              this.removeFromList(this.users, userResponse.data);
              this.generateSnack(
                "Successfully added " +
                  userResponse.data["name"] +
                  " as friend.",
                "primary"
              );
            })
            .finally(() => {
              this.fillRequestsList();
            });
        })
        .catch(error => {
          this.generateSnack(error.message);
        });
    },

    removeFriend(friend) {
      var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      axios
        .post("http://localhost:8000/api/RemoveFriend", {
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
              this.friends = [];
              this.generateSnack(
                "Successfully removed " +
                  userResponse.data["name"] +
                  " as friend.",
                "primary"
              );
            });
        })
        .catch(error => {
          this.generateSnack(error.message);
        });
    }
    //#endregion
  }
};
</script>