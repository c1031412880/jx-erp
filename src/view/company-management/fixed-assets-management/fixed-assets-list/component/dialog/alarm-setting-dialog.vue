<template>
  <el-dialog
    center
    width="600px"
    title="提醒设置"
    :visible="dialogBool"
    :before-close="dialogClose"
    >
    <div class="el-dialog-div">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-suffix=":"
        label-width="120px">
        <el-form-item label="接收人员" prop="user_id_list">
          <vue-user-role-tree placeholder="选择接收人员" :show_all="true" :func_type="0" :is_contain_emp="true" :isShowCheckbox="true" v-model="ruleForm.user_id_list"></vue-user-role-tree>
        </el-form-item>
        <el-form-item label="提醒方式" prop="warn_type_list">
          <el-checkbox-group v-model="ruleForm.warn_type_list">
            <el-checkbox :label="1" >系统推送</el-checkbox>
            <el-checkbox :label="2">app推送</el-checkbox>
            <el-checkbox :label="3">短信通知</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="报废提醒时间" prop="before_day">
          <p>提前提醒，当天再次提醒，提前
            <el-input-number style="width: 80px" v-model="ruleForm.before_day" :min="1" label="描述文字" :precision="0" :controls="false"></el-input-number>
            天提醒。
          </p>
        </el-form-item>
        <el-form-item label="间隔天数" prop="interval_day">
          <p>每次间隔
            <el-input-number style="width: 80px" v-model="ruleForm.interval_day" :min="1" label="描述文字" :precision="0" :controls="false"></el-input-number>
            天，提醒一次。
          </p>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="onSaveAlarmSet">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import VueUserRoleTree from '@/components/base/formModel/tree/user-role-tree/index'
export default {
  components: { VueUserRoleTree },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        user_id_list: [],
        warn_type_list: [],
        before_day: 1,
        interval_day: 1,
      },
      rules: {
        user_id_list: [
          { required: true, message: "请选择提醒人员", trigger: "change" },
        ],
        warn_type_list: [
          { required: true, message: "请选择提醒方式", trigger: "change" },
        ],
        before_day: [
          { required: true, message: "请输入提醒时间", trigger: "change" },
        ],
        interval_day: [
          { required: true, message: "请输入间隔天数", trigger: "change" },
        ],
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    setData(info) {
      for(let key in this.ruleForm) {
        if(info[key]) this.ruleForm[key] = info[key]
      }
    },
    onSaveAlarmSet() {
      this.$refs['ruleForm'].validate((valid) => {
        console.log(valid);
        if (valid) {
          let info = {...this.ruleForm};
          this.$emit("save-alarm-set",info);
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>