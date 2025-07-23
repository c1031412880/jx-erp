<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="490px"
    :append-to-body="true"
  >
    <div class="el-dialog-div">
      <el-form>
        <img src="@/assets/404_images/404.png" />
        <p style="margin-top: 20px">
          您当前密码{{ type == 1 ? '为初始密码' : '不满足复杂度要求' }}
        </p>
        <p style="margin-top: 20px">为保障账户安全，请及时修改密码</p>
      </el-form>
    </div>

    <div style="text-align: center">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goTo()">马上修改</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: '提示'
    }
  },
  mounted() {},
  data() {
    return {
      type: 1
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit('update:dialogBool', false)
    },
    goTo() {
      //直接跳转
      this.$router.push('/change-password')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 284px;
  font-size: 16px;
  text-align: center;
}

img {
  width: 180px;
  height: 180px;
}
</style>
