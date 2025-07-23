<template>
  <el-dialog
    :visible="dialogBool"
    :title="title + '年审规则'"
    :before-close="dialogClose"
    width="560px"
    
  >
    <div class="el-dialog-div">
      <el-form ref="form" size="mini" :model="form" :rules="rules" label-width="120px" label-suffix=":">
        <el-form-item label="规则名称" prop="rule_name">
          <el-input v-model="form.rule_name" clearable placeholder="请输入规则名称"></el-input>
        </el-form-item>
        <el-form-item label="保养条件" prop="condition_type" v-if="type == 1">
          <el-select v-model="form.condition_type" placeholder="请选择">
            <el-option
              v-for="item in maintenanceDate"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保养条件" prop="min" v-if="type == 2">
          <el-input-number v-model="form.min" style="width:80px" :controls="false"></el-input-number>
          <span>＜车龄＜＝</span>
          <el-input-number v-model="form.max" style="width:80px" :controls="false"></el-input-number>
          <span>年</span>
        </el-form-item>
        <el-form-item label="保养周期" prop="interval_time" v-if="type == 1 && form.condition_type == 1">
          <el-select v-model="form.interval_time" placeholder="请选择">
            <el-option
              v-for="item in cycleData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保养周期" prop="interval_mile" v-if="type == 1 && form.condition_type == 2">
          <span>达到</span>
          <el-input-number v-model="form.interval_mile" style="width:80px" :controls="false"></el-input-number>
          <span>公里</span>
        </el-form-item>
        <el-form-item label="保养周期" prop="interval_mile" v-if="type == 2">
          <span>周期里程达到</span>
          <el-input-number v-model="form.interval_mile" style="width:80px" :controls="false"></el-input-number>
          <span>公里 或</span>
          <el-input-number v-model="form.interval_time" style="width:80px" :controls="false"></el-input-number>
          <span>个月一次</span>
        </el-form-item>
        <el-form-item label="提醒人员" prop="person_ids">
          <get-user-select-tree ref="busAuthorityUser" :isEcho="true" v-model="form.person_ids" style="wdith:100%;height:300px" placeholder="请选择公车权限用户"></get-user-select-tree>
        </el-form-item>
        <el-form-item :label="type == 1 && form.condition_type == 1 ? '提前提醒天数' : '提前提醒公里'" prop="warn_day">
          <el-input-number v-model="form.warn_day" style="width:80px" :controls="false"></el-input-number>
          <span>{{ type == 1 && form.condition_type == 1 ? "天" : "公里"}}</span>
        </el-form-item>
        <el-form-item label="提醒方式" prop="user_id">
          <el-checkbox-group v-model="form.warn_type_list">
            <el-checkbox :label="1">系统提醒</el-checkbox>
            <el-checkbox :label="2">APP推送</el-checkbox>
            <el-checkbox :label="3">短信通知</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="提醒内容" prop="warn_content">
          <el-input v-model="form.warn_content" type="textarea" :rows="4" clearable></el-input>
        </el-form-item>
        <el-form-item label="自动下发并确认">
          <el-switch v-model="form.auto" :active-value="1" :inactive-value="0" active-color="#13ce66"></el-switch>
          <el-tooltip class="item" effect="dark" content="若开启，则后台将根据保养规则自动生成保养计划和保养单号，无需走下发确认流程。" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="规则是否启用">
          <el-switch v-model="form.enable" :active-value="1" :inactive-value="0" active-color="#13ce66"></el-switch>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="submit()">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getUserSelectTree from 'components/base/formModel/tree/get-user-select-tree'
export default {
  components: {
    getUserSelectTree
  },
  props: {
    type: {
      type: Number,
      default: 1,
    },
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      maintenanceDate:[
        {value: 1, label: "最近保养日期"},
        {value: 2, label: "累积行驶里程"},
      ],
      cycleData:[
        {value: 1, label: "半年一次"},
        {value: 2, label: "一年一次"},
        {value: 3, label: "两年一次"},
        {value: 4, label: "三年一次"},
      ],
      form: {
        id: 0,
        rule_name: '',
        condition_type: 1,
        min: 0,
        max: 0,
        interval_time: 1,
        interval_mile: 0,
        interval_name: 0,
        person_ids: [],
        warn_day: 0,
        warn_content: '',
        warn_type_list: [],
        auto: 1,
        enable: 1
      },
      rules: {
        rule_name: [
          {
            required: true,
            message: "请输入规则名称",
            trigger: "change",
          },
        ],
        condition_type: [
          {
            required: true,
            message: "请选择保养条件",
            trigger: "change",
          },
        ],
        interval_time: [
          {
            required: true,
            message: "请选择保养周期",
            trigger: "change",
          },
        ],
        interval_mile: [
          {
            required: true,
            message: "请输入保养周期",
            trigger: "change",
          },
        ],
        interval_name: [
          {
            required: true,
            message: "请输入保养周期",
            trigger: "change",
          },
        ],
        min: [
          {
            required: true,
            message: "请输入保养条件",
            trigger: "change",
          },
        ],
        max: [
          {
            required: true,
            message: "请输入保养条件",
            trigger: "change",
          },
        ]
      }
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data.form, this.$options.data().form);
        this.resetFrom();
        console.log('this.$data',this.$data);
      }else{
        this.$nextTick( () => {
          this.$refs.busAuthorityUser.$refs.tree.scapshow = 0
          this.$refs["form"].resetFields();
        })
      }
    },
  },
  methods: {
    // 重置
    resetFrom() {
      this.$refs.busAuthorityUser.onClear()
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 数据回显
    setData(val){
      Object.keys(this.form).forEach(key => {
        if (val.hasOwnProperty(key)) {
          this.form[key] = val[key]
        }
      })
      this.form.id = val.id
      this.form.rule_name = val.rule_name
      this.form.condition_type = val.condition_type
      this.form.min = val.min
      this.form.max = val.max
      this.form.interval_time = val.interval_time
      this.form.interval_mile = val.interval_mile
      this.form.interval_name = val.interval_name
      this.form.person_ids = val.person_ids
      this.form.warn_day = val.warn_day
      this.form.warn_content = val.warn_content
      this.form.warn_type_list = val.warn_type_list
      this.form.auto = val.auto
      this.form.enable = val.enable
    },
    // 保存
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.type = this.type
          if (this.form.type == 2) {
            this.form.condition_type = 3
          }
          this.$emit("on-ok",this.form,this.curSelecedType)
        } else {
          reject({
            msg: '获取失败,带星号的为必填项'
          });
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>

