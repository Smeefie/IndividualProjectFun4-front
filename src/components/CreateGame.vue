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
            <v-card-title class="justify-center">Create new game</v-card-title>
            <v-form>
              <v-text-field
                id="roundLimit"
                label="Round Limit"
                name="roundLimit"
                v-model="roundLimit"
                :rules="limitRules"
                hint="Default is 15"
                style="padding: 15px 10px 0 10px"
              ></v-text-field>
              <v-col>
                <v-autocomplete
                  v-model="selectedUsers"
                  :items="users"
                  :search-input.sync="search"
                  color="grey lighten-2"
                  placeholder="Select users"
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
                    >
                      <!-- <v-avatar left>
                      <v-img v-bind:src="require('../uploads/avatars/' + data.item.avatar)"></v-img>
                      </v-avatar>-->
                      {{ data.item.name }}
                    </v-chip>
                  </template>

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
                <v-btn color="primary" :disabled="!buttonEnabled" @click="StartNewGame">Start Game</v-btn>
              </v-card-actions>
            </v-form>

            <v-spacer></v-spacer>

            <v-card-title class="justify-center">Resume Existing Game</v-card-title>
            <v-form>
              <v-text-field
                id="gameId"
                label="Game Id"
                name="gameId"
                v-model="gameId"
                :rules="resumeRules"
                style="padding: 15px 10px 0 10px"
                :counter="8"
              ></v-text-field>
              <v-card-actions class="justify-center">
                <v-btn
                  color="primary"
                  :disabled="!resumeButtonEnabled"
                  @click="resumeGame"
                >Resume Game</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <SnackBar ref="SnackBar" />
  </v-content>
</template>

<script>
import Navbar from "@/components/Navbar";
import Authorized from "@/components/Authorized";
import SnackBar from "@/components/SnackBar";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CreateGame",
  components: {
    Navbar,
    Authorized,
    SnackBar
  },

  data() {
    return {
      buttonEnabled: false,
      resumeButtonEnabled: false,
      search: "",
      gameId: "",
      selectedUsers: [],
      users: [],
      roundLimit: "",
      limitOkay: true,

      limitRules: [
        value => {
          const pattern = /^[0-9]*$/;
          return pattern.test(value) || "Must be a number";
        }
      ],
      resumeRules: [
        value => {
          const pattern = /^\d{8}$/;
          return pattern.test(value) || "Must be 8 numbers";
        }
      ]
    };
  },

  watch: {
    gameId(newValue) {
      const pattern = /^\d{8}$/;
      this.resumeButtonEnabled = pattern.test(newValue) ? true : false;
    },

    roundLimit(newValue) {
      const pattern = /^[0-9]*$/;
      this.limitOkay = pattern.test(newValue) ? true : false;

      this.buttonEnabled =
        this.selectedUsers.length >= 2 && this.limitOkay ? true : false;
    }
  },

  computed: {
    ...mapGetters([
      "GetFriends",
      "GetUsersNotFriends",
      "GetLoggedInUser",
      "GetGameId",
      "GetGameExists",
      "GetGame",
      "GetGamePlayers"
    ])
  },

  created() {
    this.Initialize();
  },

  methods: {
    ...mapActions([
      "GetAllFriendsById",
      "GetAllUsersNotFriendsById",
      "CreateNewGame",
      "CheckForGameId",
      "GetGameById",
      "GetAllGamePlayersByGameId"
    ]),
    Initialize() {
      //ADD YOURSELF TO THE LIST
      this.users.push({ header: "Self" });
      this.users.push({
        name: this.GetLoggedInUser["name"],
        id: this.GetLoggedInUser["id"],
        avatar: this.GetLoggedInUser["avatar"]
      });

      //ADD ALL YOUR FRIENDS TO THE LIST
      this.GetAllFriendsById({
        id: this.GetLoggedInUser["id"]
      }).then(() => {
        if (this.GetFriends.length > 0) {
          this.users.push({ divider: true });
          this.users.push({ header: "Friends" });
          this.GetFriends.forEach(element => {
            this.users.push({
              name: element["name"],
              id: element["id"],
              avatar: element["avatar"]
            });
          });
        }
      });

      //ADD ALL OTHER USERS TO THE LIST
      this.GetAllUsersNotFriendsById({
        id: this.GetLoggedInUser["id"]
      }).then(() => {
        if (this.GetUsersNotFriends.length > 0) {
          this.users.push({ divider: true });
          this.users.push({ header: "Others" });

          this.GetUsersNotFriends.forEach(element => {
            this.users.push({
              name: element["name"],
              id: element["id"],
              avatar: "default.png"
            });
          });
        }
      });
    },

    StartNewGame() {
      let gameId = -1;
      this.CreateNewGame({
        players: this.selectedUsers,
        limit: this.roundLimit == "" ? 15 : this.roundLimit,
        creatorId: this.GetLoggedInUser["id"]
      })
        .then(() => {
          gameId = this.GetGameId;
        })
        .catch(error => {
          console.log(error);
          this.$refs.SnackBar.GenerateSnack(error.response.data.message);
        })
        .finally(() => {
          if (gameId != -1) {
            this.$router.push({ path: `/Game?gameId=${gameId}` });
          } else {
            this.$refs.SnackBar.GenerateSnack("No Valid Game Id Found");
          }
        });
    },

    resumeGame() {
      this.CheckForGameId({
        gameId: this.gameId
      })
        .then(async () => {
          if (this.GetGameExists == true) {
            await this.GetGameById({
              gameId: this.gameId
            }).then(async () => {
              if (this.GetGame["status"] == 1) {
                this.$refs.SnackBar.GenerateSnack(
                  "This game is not in progress anymore!"
                );
              } else {
                await this.GetAllGamePlayersByGameId({
                  gameId: this.gameId
                }).then(() => {
                  var userInGame = false;
                  this.GetGamePlayers.forEach(player => {
                    if (player["userId"] == this.GetLoggedInUser["id"]) {
                      userInGame = true;
                    }
                  });

                  if (
                    !userInGame &&
                    this.GetGame["creatorId"] != this.GetLoggedInUser["id"]
                  ) {
                    this.$refs.SnackBar.GenerateSnack(
                      "You do not have access to this game!"
                    );
                  } else {
                    this.$router.push({
                      path: `/Game?gameId=${this.gameId}`
                    });
                  }
                });
              }
            });
          } else {
            this.$refs.SnackBar.GenerateSnack("This GameId does not exists!");
          }
        })
        .catch(error => {
          console.log(error);
          this.$refs.SnackBar.GenerateSnack(error);
        });
    },

    EnableButton() {
      if (this.selectedUsers.length >= 2 && this.limitOkay) {
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