<template>
  <v-content>
    <Authorized />
    <Navbar />

    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12" v-if="!loading">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Friends</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-card-title class="justify-center">Add a new friend</v-card-title>
            <v-col cols="12">
              <v-row>
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

                <v-card-actions class="justify-center">
                  <v-btn color="primary" @click="addFriend()">Add Friend</v-btn>
                </v-card-actions>
              </v-row>
            </v-col>
          </v-card-text>

          <v-spacer></v-spacer>

          <v-card-text v-if="currentFriends.length >0">
            <v-divider></v-divider>
            <v-card-title class="justify-center">Current Friends</v-card-title>

            <v-list subheader color="primary_light" style="padding-top:8px">
              <template v-for="friend in currentFriends">
                <v-list-item :key="friend.name" style="padding-left: 0;">
                  <v-badge
                    :content="friend.status"
                    :value="friend.status"
                    overlap
                    bordered
                    color="accepted"
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
                    bordered
                    color="pending"
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
              </template>
            </v-list>
          </v-card-text>

          <v-card-text v-else>
            <v-card-title class="justify-center">No Friends</v-card-title>
          </v-card-text>

          <v-card-text v-if="friendRequests.length > 0">
            <!-- <v-divider></v-divider> -->
            <v-card-title class="justify-center">Friend Requests</v-card-title>

            <v-list subheader color="primary_light" style="padding-top:8px">
              <v-list-item
                v-for="friend in friendRequests"
                :key="friend.name"
                style="padding-left: 0;"
              >
                <v-badge
                  :content="1"
                  :value="1"
                  overlap
                  bordered
                  color="pending"
                  offset-x="28"
                  offset-y="20"
                >
                  <v-list-item-avatar>
                    <v-img v-bind:src="require('../uploads/avatars/' + friend.avatar)"></v-img>
                  </v-list-item-avatar>
                  <template v-slot:badge>
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </template>
                </v-badge>

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

    <v-container v-else-if="loading" fill-height fluid class="justify-center align-center">
      <v-layout row wrap align-center>
        <v-row align="center" justify="center">
          <v-progress-circular class="mb-12" indeterminate color="primary"></v-progress-circular>
        </v-row>
      </v-layout>
    </v-container>
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
      loading: true,
      loadingState: 0,
      isUpdating: false,
      friends: [],
      friendRequests: [],
      currentFriends: [],
      users: [],
      loggedInUser: JSON.parse(localStorage.getItem("loggedInUser")),

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
    },
    loadingState(newValue) {
      if (newValue >= 3) this.loading = false;
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

      axios
        .post("http://localhost:8000/api/GetAllUsersNotFriends", {
          id: this.loggedInUser["id"]
        })
        .then(response => {
          response.data.forEach(element => {
            if (this.loggedInUser["id"] != element["id"])
              this.addToList(this.users, element);
          });
        })
        .finally(() => {
          this.loadingState++;
        });
    },

    fillFriendsList() {
      this.currentFriends = [];

      axios
        .post("http://localhost:8000/api/GetAllFriends", {
          id: this.loggedInUser["id"]
        })
        .then(response => {
          response.data.forEach(element => {
            if (this.loggedInUser["id"] != element["id"])
              this.addToList(this.currentFriends, element, true);
          });
        })
        .finally(() => {
          this.loadingState++;
        });
    },

    fillRequestsList() {
      this.friendRequests = [];

      axios
        .post("http://localhost:8000/api/GetAllFriendRequests", {
          id: this.loggedInUser["id"]
        })
        .then(response => {
          response.data.forEach(element => {
            axios
              .post("http://localhost:8000/api/GetUserById", {
                id: element["requester"]
              })
              .then(userResponse => {
                this.addToList(this.friendRequests, userResponse.data);
              })
              .finally(() => {
                this.loadingState++;
              });
          });

          if (response.data.length <= 0) {
            this.loadingState++;
          }
        });
    },

    //UPDATE LISTS
    updateLists() {
      this.fillUserList();
      this.fillFriendsList();
      this.fillRequestsList();
    },

    //ADDING AND REMOVING FROM LISTS
    addToList(list, userToAdd, withStatus = false) {
      if (withStatus) {
        axios
          .post("http://localhost:8000/api/GetFriendRequest", {
            id: this.loggedInUser["id"],
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
      axios
        .post("http://localhost:8000/api/AcceptFriend", {
          id: this.loggedInUser["id"],
          friendId: user.id
        })
        .then(() => {
          this.addToList(this.currentFriends, user, true);

          this.removeFromList(this.friendRequests, user);
          this.removeFromList(this.users, user);

          this.generateSnack(`Accepted ${user.name} as a friend.`, "primary");
        })
        .catch(error => {
          this.generateSnack(error.message);
        });
    },

    declineRequest(user) {
      axios
        .post("http://localhost:8000/api/DeclineFriend", {
          id: this.loggedInUser["id"],
          friendId: user.id
        })
        .then(() => {
          this.removeFromList(this.friendRequests, user);

          this.generateSnack(`Declined ${user.name} as a friend.`, "primary");
        })
        .catch(error => {
          this.generateSnack(error.message);
        });
    },

    addFriend() {
      axios
        .post("http://localhost:8000/api/AddFriend", {
          id: this.loggedInUser["id"],
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
                `Successfully added ${userResponse.data["name"]} as a friend.`,
                "primary"
              );

              this.removeFromList(this.friendRequests, userResponse.data);
            });
          // .finally(() => {
          //   this.fillRequestsList();
          // });
        })
        .catch(error => {
          this.generateSnack(error.message);
        });
    },

    removeFriend(friend) {
      axios
        .post("http://localhost:8000/api/RemoveFriend", {
          id: this.loggedInUser["id"],
          friendId: friend.id
        })
        .then(() => {
          this.addToList(this.users, friend);
          this.removeFromList(this.currentFriends, friend);
          this.friends = [];
          this.generateSnack(
            `Successfully removed "${friend.name} as a friend.`,
            "primary"
          );
        })
        .catch(error => {
          this.generateSnack(error.message);
        });
    }
    //#endregion
  }
};
</script>
