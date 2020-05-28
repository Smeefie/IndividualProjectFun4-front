<template>
  <v-content>
    <Authorized />
    <Navbar ref="NavBar" />

    <v-row align="center" justify="center" v-if="!loading">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
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

    <v-container v-else-if="loading" fill-height fluid class="justify-center align-center">
      <v-layout row wrap align-center>
        <v-row align="center" justify="center">
          <v-progress-circular class="mb-12" indeterminate color="primary"></v-progress-circular>
        </v-row>
      </v-layout>
    </v-container>

    <SnackBar ref="SnackBar" />
  </v-content>
</template>

<script>
import Navbar from "@/components/Navbar";
import Authorized from "@/components/Authorized";
import SnackBar from "@/components/SnackBar";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    Navbar,
    Authorized,
    SnackBar
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
      users: []
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

  computed: {
    ...mapGetters([
      "GetLoggedInUser",
      "GetFriends",
      "GetUser",
      "GetUsersNotFriends",
      "GetAllFriendRequests",
      "GetFriendRequest",
      "GetAddedFriend"
    ])
  },

  methods: {
    ...mapActions([
      "GetAllFriendsById",
      "GetAllUsersNotFriendsById",
      "GetAllFriendRequestsById",
      "GetUserById",
      "GetFriendRequestById",
      "AcceptFriend",
      "DeclineFriend",
      "AddFriend",
      "RemoveFriend"
    ]),

    remove(item) {
      const index = this.friends.indexOf(item.name);
      if (index >= 0) this.friends.splice(index, 1);
    },

    //#region Update and fill lists
    //FILL LISTS
    fillUserList() {
      this.users = [];

      this.GetAllUsersNotFriendsById({ id: this.GetLoggedInUser["id"] })
        .then(() => {
          this.GetUsersNotFriends.forEach(element => {
            if (this.GetLoggedInUser["id"] != element["id"])
              this.addToList(this.users, element);
          });
        })
        .finally(() => {
          this.loadingState++;
        });
    },

    fillFriendsList() {
      this.currentFriends = [];

      this.GetAllFriendsById({ id: this.GetLoggedInUser["id"] })
        .then(() => {
          this.GetFriends.forEach(element => {
            if (this.GetLoggedInUser["id"] != element["id"]) {
              this.addToList(this.currentFriends, element, true);
            }
          });
        })
        .finally(() => {
          this.loadingState++;
        });
    },

    fillRequestsList() {
      this.friendRequests = [];

      this.GetAllUsersNotFriendsById({ id: this.GetLoggedInUser["id"] })
        .then(async () => {
          for (let element of this.GetAllFriendRequests) {
            await this.GetUserById({ id: element["requester"] });
            this.addToList(this.friendRequests, this.GetUser);
          }
        })
        .finally(() => {
          this.loadingState++;
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
        this.GetFriendRequestById({
          id: this.GetLoggedInUser["id"],
          friendId: userToAdd.id
        }).then(() => {
          list.push({
            name: userToAdd["name"],
            id: userToAdd["id"],
            avatar: userToAdd["avatar"],
            status: this.GetFriendRequest["status"]
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
      this.AcceptFriend({
        id: this.GetLoggedInUser["id"],
        friendId: user.id
      })
        .then(() => {
          this.addToList(this.currentFriends, user, true);

          this.removeFromList(this.friendRequests, user);
          this.removeFromList(this.users, user);
          this.$refs.NavBar.updateBadges();
          this.$refs.SnackBar.GenerateSnack(
            `Accepted ${user.name} as a friend.`,
            "primary"
          );
        })
        .catch(error => {
          this.$refs.SnackBar.GenerateSnack(error.message);
        });
    },

    declineRequest(user) {
      this.DeclineFriend({
        id: this.GetLoggedInUser["id"],
        friendId: user.id
      })
        .then(() => {
          this.removeFromList(this.friendRequests, user);
          this.$refs.NavBar.updateBadges();
          this.$refs.SnackBar.GenerateSnack(
            `Declined ${user.name} as a friend.`,
            "primary"
          );
        })
        .catch(error => {
          this.$refs.SnackBar.GenerateSnack(error.message);
        });
    },

    addFriend() {
      this.AddFriend({
        id: this.GetLoggedInUser["id"],
        friendId: this.friends
      })
        .then(() => {
          this.GetUserById({
            id: this.GetAddedFriend["userRequested"]
          }).then(() => {
            this.addToList(this.currentFriends, this.GetUser, true);
            this.removeFromList(this.users, this.GetUser);
            this.$refs.SnackBar.GenerateSnack(
              `Successfully added ${this.GetUser["name"]} as a friend.`,
              "primary"
            );

            this.removeFromList(this.friendRequests, this.GetUser);
            this.$refs.NavBar.updateBadges();
          });
        })
        .catch(error => {
          this.$refs.SnackBar.GenerateSnack(error.message);
        });
    },

    removeFriend(friend) {
      this.RemoveFriend({
        id: this.GetLoggedInUser["id"],
        friendId: friend.id
      })
        .then(() => {
          this.addToList(this.users, friend);
          this.removeFromList(this.currentFriends, friend);
          this.friends = [];
          this.$refs.SnackBar.GenerateSnack(
            `Successfully removed ${friend.name} as a friend.`,
            "primary"
          );
        })
        .catch(error => {
          this.$refs.SnackBar.GenerateSnack(error.message);
        });
    }
    //#endregion
  }
};
</script>
