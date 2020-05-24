<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field label="Email" name="email" type="email" v-model="email"></v-text-field>
                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                  v-model="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="primary" v-on:click="Login()">Login</v-btn>
              <v-btn text disabled>or</v-btn>
              <v-btn color="warning" @click="registerModal = true">Register</v-btn>
            </v-card-actions>
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
    </v-container>

    <v-dialog v-model="registerModal" persistent max-width="600px">
      <v-card light flat color="grey lighten-2">
        <v-toolbar color="primary" dark flat>
          <v-spacer></v-spacer>
          <v-toolbar-title>Register</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="username"
                  :counter="20"
                  label="Username*"
                  required
                  :rules="nameRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="email"
                  :counter="30"
                  label="Email*"
                  required
                  :rules="emailRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  :counter="20"
                  label="Password*"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show2 ? 'text' : 'password'"
                  @click:append="show2 = !show2"                 
                  required
                  :rules="passwordRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="password_confirmation"
                  label="Verify Password*"
                  :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show3 ? 'text' : 'password'"
                  @click:append="show3 = !show3"             
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="registerModal = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="Register()">Register</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",

      registerModal: false,
      show1: false,
      show2: false,
      show3: false,


      generalSnack: false,
      generalSnackColor: "error",
      generalSnackText: "",
      generalSnackTimeout: 5000,

      emailRules: [
        value => !!value || "Required.",
        value => (value || "").length <= 35 || "Max 35 characters",
        value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        }
      ],

      nameRules: [
        value => !!value || "Required.",
        value => (value || "").length <= 20 || "Max 20 characters",
        value => (value || "").length >= 3 || "Minimum of 3 characters"
      ],

      passwordRules: [
        value => !!value || "Required.",
        value => (value || "").length <= 20 || "Max 20 characters",
        value => (value || "").length >= 4 || "Minimum of 4 characters"
      ]
    };
  },
  methods: {
    Login() {
      if (this.email != "" && this.password != "") {
        axios
          .post("http://localhost:8000/api/Login", {
            email: this.email,
            password: this.password
          })
          .then(async response => {
            this.fullResponse = response.data;
            localStorage.setItem("accessToken", response.data["access_token"]);
            await this.AddUserToLocalStorage(this.email);
            this.$router.push("/Profile");
          })
          .catch(error => {
            console.warn(error);
            this.generalSnackText = error.response.data.message;
            this.generalSnack = true;
          });
      } else {
        this.generalSnackText = "Please enter all required fields!";
        this.generalSnack = true;
      }
    },
    Register() {
      if (
        this.username != "" &&
        this.email != "" &&
        this.password != "" &&
        this.password_confirmation != ""
      ) {
        axios
          .post("http://localhost:8000/api/Register", {
            name: this.username,
            email: this.email,
            password: this.password,
            password_confirmation: this.password_confirmation
          })
          .then(async response => {
            localStorage.setItem("accessToken", response.data["access_token"]);
            await this.AddUserToLocalStorage(this.email);
            this.$router.push("/Profile");
          })
          .catch(error => {
            console.warn(error);
            this.generalSnackText = error.response.data.message;
            this.generalSnack = true;
          });
      } else {
        this.generalSnackText = "Please enter all required fields!";
        this.generalSnack = true;
      }
    },

    AddUserToLocalStorage(loggedInEmail) {
      return axios
        .post("http://localhost:8000/api/GetUserByEmail", {
          email: loggedInEmail
        })
        .then(response => {
          this.fullResponse = response.data;
          localStorage.setItem("loggedInUser", JSON.stringify(response.data));
        })
        .catch(error => {
          console.warn(error);
        });
    }
  }
};
</script>