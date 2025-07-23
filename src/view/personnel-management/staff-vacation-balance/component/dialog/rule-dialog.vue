<template>
  <el-dialog
    :title="title"
    :visible="dialogBool"
    append-to-body
    width="500px"
    :before-close="dialogClose">
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini" label-suffix="：">
        <el-form-item label="有效期" prop="expire_rule">
          <el-select v-model="form.expire_rule" @change="saveValidityRule" placeholder="请选择">
            <el-option label="每年固定时间作废" :value="1"></el-option>
            <el-option label="加班多少天后作废" :value="2"></el-option>
            <el-option label="永久有效" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="form.expire_rule != 3">
          {{form.expire_rule == 1 ? '每年' :'加班'}}
          <el-date-picker
            v-model="date"
            size="mini"
            type="date"
            style="width:100px"
            v-if="form.expire_rule == 1"
            placeholder="选择开始日期"
            format="MM-dd"
            :clearable="false"
            @change="changeDate"
            value-format="MM-dd">
          </el-date-picker>
          <el-input-number v-model="form.expire_day" @change="saveValidityRule" v-else style="width:100px" size="mini" :min="0" :controls="false" step-strictly :precision="0" label="描述文字"></el-input-number>
          {{form.expire_rule == 1 ? '' :'天'}}后作废
        </el-form-item>
        <el-form-item label="假期过期提醒" prop="expire_warn">
          <el-switch
            v-model="form.expire_warn"
            :active-value="1"
            :inactive-value="0"
            @change="saveValidityRule">
          </el-switch>
          <span v-show="!!form.expire_warn" style="padding-left: 20px;">
            假期过期前
            <el-input-number v-model="form.notice_day" @change="saveValidityRule" :min="0" :controls="false" step-strictly :precision="0" label="描述文字"></el-input-number>
            天提醒
          </span>
        </el-form-item>
        <el-form-item v-show="!!form.expire_warn" label="通知人员" prop="notice_type">
          <el-radio-group v-model="form.notice_type" @change="saveValidityRule">
            <el-radio :label="1">员工本人</el-radio>
            <el-radio :label="2">员工主管</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      title: '有效期规则',
      date: '12-31',
      form: {
        id: 0,
        expire_rule: 1,
        month: 12,
        day: 31,
        expire_day: 0,
        expire_warn: 0,
        notice_day: 0,
        notice_type: 1,
      },
      basicRules: {
        expire_rule: [
          { required: true, message: "请输入天数", trigger: "change" },
        ],
        expire_warn: [
          { required: true, message: "请选择有效时间", trigger: "change" },
        ],
        reason: [
          { required: true, message: "请输入理由", trigger: "change" },
        ],
      },
    }
  },
  mounted() {},
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    changeDate(val) {
      this.form.month = Number(val.slice(0, 2))
      this.form.day = Number(val.slice(3, 5))
      this.saveValidityRule()
      // console.log(val, this.form);
    },
    saveValidityRule() {
      let params = {context: this.form}
      this.$client.UpdateCompenRuleRestManage(params)
        .then(res => {
          if (res.head.result == "200") {
            
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
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>