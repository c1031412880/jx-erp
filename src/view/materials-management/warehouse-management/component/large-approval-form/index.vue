<template>
  <tr-dialog
    :visible="dialogBool"
    :title="title"
    @before-close="dialogClose"
    ref="trDialog"
    width="1050px"
    top="10px"
  >

  </tr-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  data() {
    return {
      dialogBool: false,
      title: '大额审批单'
    }
  },
  mounted() {

  },
  methods: {}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
