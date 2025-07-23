<template>
  <div class="maintenance-global-setting">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="完工确认：" prop="complete_confirm">
        <el-radio-group v-model="ruleForm.complete_confirm">
          <el-radio :label="1">仅班组长确认</el-radio>
          <el-radio :label="2">维修人员会签确认</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="领退料：" prop="receive_confirm">
        <el-radio-group v-model="ruleForm.receive_confirm">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="2">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="竣工检验：" prop="complete_check_confim">
        <el-radio-group v-model="ruleForm.complete_check_confim">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="2">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="电子签名：" prop="resign_confirm">
        <el-radio-group v-model="ruleForm.resign_confirm">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="2">关闭</el-radio>
        </el-radio-group>
        <el-select v-show="ruleForm.resign_confirm == 1" v-model="ruleForm.resign_type" size="mini" style="padding-left: 20px;" placeholder="请选择场景">
          <el-option label="完工确认" :value="1"></el-option>
          <el-option label="接车确认" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="大额出库审批：" prop="limit_out_type">
        <el-radio-group v-model="ruleForm.limit_out_type">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="2">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" prop="limit_out_amount">
        <span>维修领料总金额或单物料金额&nbsp;≥&nbsp;</span>
        <el-input-number
            size="mini"
            v-model="ruleForm.limit_out_amount"
            style="width: 120px;"
            :controls="false"
            :min="0"
        ></el-input-number>
        <span>&nbsp;元需审批通过才允许出库。</span>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" round>保存</el-button>
        <el-button @click="resetForm('ruleForm')" round>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "maintenance-global-setting",
  data() {
    return {
      ruleForm: {
        id: 0,
        complete_confirm: 1,
        receive_confirm: 1,
        complete_check_confim: 1,
        resign_confirm: 2,
        resign_type: '',
        limit_out_type: 2,
        limit_out_amount: 0,
      },
      rules: {}
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 数据加载
    loadData() {
      this.$client.GetListMaintMainRule({})
        .then(res => {
          if (res.head.result == "200") {
            let info = (res.context && res.context.list) ? res.context.list : []
            if(info.length) {
              for(let key in this.ruleForm) {
                if(res.context.list[0][key]) {
                  this.ruleForm[key] = res.context.list[0][key] * 1
                }else {
                  if(key == 'resign_type') {
                    this.ruleForm[key] = ''
                  }
                }
              }
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
            this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    submitForm(formName) {
      let params = Object.assign({}, this.ruleForm);
      params.resign_type = 0
      this.$client.BatchModifyMaintMainRule([params]).then(res => {
        if(res.head.result == "200") {
          this.loadData()
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm.resign_type = ''
      this.submitForm()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.maintenance-global-setting {
  width: 100%;
  height: 100%;
}
</style>