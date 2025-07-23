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
          <el-select v-model="form.expire_rule" placeholder="请选择">
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
            value-format="MM-dd">
          </el-date-picker>
          <el-input-number v-model="form.expire_day" v-else style="width:100px" size="mini" :min="0" :controls="false" step-strictly :precision="0" label="描述文字"></el-input-number>
          {{form.expire_rule == 1 ? '' :'天'}}后作废
        </el-form-item>
        <el-form-item label="假期过期提醒" prop="expire_warn">
          <el-switch
            v-model="form.expire_warn"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
          <span v-show="!!form.expire_warn" style="padding-left: 20px;">
            假期过期前
            <el-input-number v-model="form.notice_day" :min="0" :controls="false" step-strictly :precision="0" label="描述文字"></el-input-number>
            天提醒
          </span>
        </el-form-item>
        <el-form-item v-show="!!form.expire_warn" label="通知人员" prop="notice_type">
          <el-checkbox-group v-model="form.notice_type">
            <el-checkbox :label="1">员工本人</el-checkbox>
            <el-checkbox :label="2">员工主管</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

    </div>
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
      title: '有效期规则',
      date: '',
      form: {
        expire_rule: 1,
        month: '',
        day: '',
        expire_day: '',
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
  mounted() {
    
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>