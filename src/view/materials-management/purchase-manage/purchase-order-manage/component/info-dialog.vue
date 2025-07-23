<template>
  <tr-dialog
    :visible="dialogBool"
    title="采购订单"
    @before-close="dialogClose"
    width="960px"
    center
    top="10px">
    <div style="width: 100%;">
      <base-info ref="BaseInfo"></base-info>
      <el-card style="margin-top: 10px;max-height: 330px;overflow: auto">
        <approve-step ref="approveStep" v-if="dialogBool" :form_data="form_data" :object_id="1040" @on-users="setUsers"></approve-step>
      </el-card>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="ok">仅保存</el-button>
      <el-button type="primary" size="mini" @click="subForm">提交审核</el-button>
    </span>
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
import approveStep from '@/components/approve-echo/approve-step2'
import BaseInfo from "./base-info";
export default {
  name: "info-dialog",
  components: {BaseInfo, approveStep},
  data() {
    //这里存放数据",
    return {
      form_data: {},
      object_id: 0,
      nodes: {},
    }
  },
  props: {
    dialogBool: Boolean,
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    },
  },
  //方法集合",
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 表单初始化
    setForm(form) {
      this.$refs.BaseInfo.form = form
      this.$refs.BaseInfo.data = form.details
      this.form_data = form
    },
    // 设置流程节点
    setUsers(data) {
      this.nodes = data
    },
    ok() {
      this.$refs.BaseInfo.outData().then(data => {
        // this.$emit('on-ok', data.form)
        this.$emit('on-ok', {
          form_data: data.form,
          step_data: this.nodes
        })
      }).catch(err => {
        this.$message({message: err.msg, type: 'error'});
      })
    },
    subForm() {
      this.$refs.BaseInfo.outData().then(data => {
        this.$emit('on-sub', {
          form_data: data.form,
          step_data: this.nodes
        })
      }).catch(err => {
        this.$message({message: err.msg, type: 'error'});
      })
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
