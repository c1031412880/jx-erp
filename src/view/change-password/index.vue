<template>
  <change-password-data-center :showBack="true" @change-success="changeSuccess" />
</template>

<script>
export default {
  methods: {
    changeSuccess() {
      this.$store.dispatch('FedLogOut').then(() => {
        this.$router.push('/login')
      })
    }
  }
}
</script>
