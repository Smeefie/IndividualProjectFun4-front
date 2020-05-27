<template>
  <div></div>
</template>

<script>
import { mapGetters } from "vuex";

    export default {
        name: "Authorized",
        computed: {
            ...mapGetters(['GetAccessToken'])
        },

        created() {
            if (this.GetAccessToken === null) {
                this.$router.push('Login');
            }
        }
    }
</script>

<style scoped>
</style>