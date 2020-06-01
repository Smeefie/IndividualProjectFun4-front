<template>
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
</template>

<script>
export default {
  data() {
    return {
      generalSnack: false,
      generalSnackColor: "error",
      generalSnackText: "",
      generalSnackTimeout: 5000
    };
  },

  methods: {
    GenerateSnack(text, color = "error") {
      this.generalSnackText = text;
      this.generalSnackColor = color;
      this.generalSnack = true;
    },
  }
};
</script>
