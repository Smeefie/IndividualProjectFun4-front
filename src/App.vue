<template>
  <v-app id="inspire">

      <router-view />

    <v-footer app>
      <span>&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    props: {
      source: String,
    },

    components: {
    },

    methods: {
    },

    created () {
      this.$vuetify.theme.dark = true;
    },
  }
</script>

<style>
 *{
   transition: background 0.3s ease-in-out;
 }
</style>
