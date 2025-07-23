<template>
  <el-dialog
    :title="title"
    :visible="dialogVisible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    width="760px"
    center
    top="10px"
  >
    <staff-movement-form ref="staffMovementForm" :dialogBool="dialogVisible" />
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button
        v-if="type == 'add'"
        v-loading="updateLoading"
        size="small"
        type="primary"
        @click="submit"
      >
        保 存
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import staffMovementForm from '@/view/main-Interface-entrance/launch-affair/component/all-box/fixed-form-body/staff-movement-form'
export default {
  components: { staffMovementForm },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: '人员调动',
      formKey: 'staffMovementForm',
      formAddApi: 'CreateNoFlowOaPersonTransfer',
      updateLoading: false,
      data: null,
      type: 'add'
    }
  },
  watch: {
    dialogVisible(bool) {
      if (!bool) {
        Object.assign(this.$data, this.$options.data())
      } else {
        this.$nextTick(() => {
          this.$refs[this.formKey].initSet(this.data)
        })
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
    },
    submit() {
      this.$refs[this.formKey]
        .outData()
        .then(res => {
          this.updateLoading = true
          let formData = res.form
          this.$client[this.formAddApi]({
            context: formData
          })
            .then(req => {
              this.updateLoading = false
              if (req.head.result === '200') {
                this.handleClose()
                this.$message({ message: req.head.describle, type: 'success' })
              } else {
                this.$message({ message: req.head.describle, type: 'error' })
              }
            })
            .catch(e => {
              this.updateLoading = false
              this.$message({ message: '服务异常', type: 'error' })
            })
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.msg,
            type: 'warning'
          })
        })
    }
  },
  beforeDestroy() {}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .el-dialog__title {
  font-size: 18px;
  font-weight: bold;
  color: #333333
}
</style>
