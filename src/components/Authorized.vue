<template>
  <div></div>
</template>

<script>
    export default {
        name: "Authorized",
        created() {
            if (localStorage.getItem("accessToken") === null) {
                this.$router.push('Login');
            }
        }
    }
</script>

<style scoped>
</style>