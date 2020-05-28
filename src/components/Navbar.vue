<template>
  <div>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-subheader>Social</v-subheader>
        <v-list-item link to="/Profile" :active="$router.name=='Profile'">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/Friends" :active="$router.name=='Friends'">
          <v-list-item-action>
            <v-badge :content="this.GetAllFriendRequests.length" :value="this.GetAllFriendRequests.length" overlap color="accent">
              <v-icon>mdi-account-multiple</v-icon>
            </v-badge>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Friends</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider style="margin-bottom:10px; margin-top: 10px"></v-divider>
        <v-subheader>Game</v-subheader>
        <v-list-item
          link
          to="/CreateGame"
          :active="$router.name=='CreateGame' || $router.name=='Game/:users'"
        >
          <v-list-item-action>
            <v-icon>mdi-gamepad-square-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Create Game</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/MatchHistory" :active="$router.name=='MatchHistory'">
          <v-list-item-action>
            <v-icon>mdi-history</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Match History</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/Statistics" :active="$router.name=='Statistics'">
          <v-list-item-action>
            <v-icon>mdi-chart-bar</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Statistics</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <div style=" position: absolute; bottom: 10%; width: 100%">
          <v-divider style="margin-bottom:10px;"></v-divider>
          <v-list-item link to :active="$router.name==''">
            <v-list-item-action>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link @click="dialog = true">
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>De Toephulp V2.0</v-toolbar-title>
      <ToggleDarkmode @toggle="toggle" />
    </v-app-bar>

    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="290">
        <v-card>
          <v-card-title class="headline justify-center">Warning</v-card-title>

          <v-card-text class="text-center">Are you sure you want to log out?</v-card-text>

          <v-card-actions class="justify-center">
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="dialog = false">No</v-btn>

            <v-btn color="green darken-1" text @click="Logout">Logout</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import ToggleDarkmode from "@/components/ToggleDarkmode";
import {mapGetters, mapActions} from 'vuex';

export default {
  components: {
    ToggleDarkmode
  },

  computed: {
    ...mapGetters(['GetAllFriendRequests', 'GetLoggedInUser'])
  },

  data() {
    return {
      dialog: false,
      requests: 0,
      drawer: null
    };
  },

  created() {
    this.updateBadges();
  },

  methods: {
    ...mapActions(['GetAllFriendRequestsById']),
    Logout() {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("loggedInUser");
      this.$router.push("Login");
    },
    toggle() {
      this.$vuetify.theme.dark = this.$vuetify.theme.dark ? false : true;
    },
    updateBadges() {
      this.GetAllFriendRequestsById({
        id: this.GetLoggedInUser['id']
      })
    }
  }
};
</script>