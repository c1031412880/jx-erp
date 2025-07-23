<template>
  <el-dialog
    :visible="dialogBool"
    title="稿费设置"
    :before-close="dialogClose"
    width="500px"
    top="80px"
  >
    <div class="el-dialog-div">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
        :label-position="'right'" 
        size="mini"
      >
        <el-form-item label="稿费:" prop="fee">
          <el-input v-model="ruleForm.fee" placeholder="请输入稿费"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')" size="mini">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      ruleForm: {
        fee: ''
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.getFee()
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    getFee() {
      this.$client.GetAdvertFee({})
      .then(res => {
        if (res.head.result == "200") {
          this.ruleForm.fee = res.context.fee
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {
      })
    },
    updatePlaybill() {
      if (!this.ruleForm.fee) {
        this.$message({
          showClose: true,
          message: '稿费不能为空',
          type: "warning",
        });
        return
      }
      
      this.$client.AddAdvertFee({context:this.ruleForm})
      .then(res => {
        if (res.head.result == "200") {
            this.$message({
              showClose: true,
              message: '设置稿费成功',
              type: "success",
            });
            this.dialogClose()
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {
      })
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


