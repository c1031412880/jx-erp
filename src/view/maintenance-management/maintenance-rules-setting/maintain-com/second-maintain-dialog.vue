<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    width="675px"
    
  >
    <div class="el-dialog-div">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        size="mini"
      >
        <el-form-item label="规则名称:" prop="c_rules_name" label-width="130px">
          <el-input v-model="ruleForm.c_rules_name"></el-input>
        </el-form-item>
        <el-form-item
          label="保养条件:"
          prop="i_age_condition_min"
          label-width="130px"
        >
          <div class="annual-inspection-condition show-flex-box-r">
            <el-input-number
              v-model="ruleForm.i_age_condition_min"
              :min="0"
              :controls="false"
            ></el-input-number>
            <span style="margin-right: 15px"> &lt;车龄&lt;=</span>
            <el-input-number
              v-model="ruleForm.i_age_condition_max"
              :min="0"
              :controls="false"
            ></el-input-number>
            <span>年</span>
          </div>
        </el-form-item>
        <el-form-item
          label="保养周期:"
          prop="i_condition_mile"
          label-width="130px"
        >
          <div class="annual-inspection-condition show-flex-box-r">
            <span>周期里程达到</span>
            <el-input-number
              v-model="ruleForm.i_condition_mile"
              :min="0"
              :controls="false"
            ></el-input-number>
            <span style="margin-right: 15px">公里 或</span>
            <el-input-number
              v-model="ruleForm.i_condition_month"
              :min="0"
              :controls="false"
            ></el-input-number>
            <span>个月一次</span>
          </div>
        </el-form-item>
        <el-form-item label="提醒人员:" prop="reminders" label-width="130px">
          <!-- <get-user-info
            ref="tree"
            v-model="remindersUserId"
            @on-change="onSelectChange"
          ></get-user-info> -->
          <get-department-select
            v-if="dialogBool"
            ref="personalTree"
            v-model="ruleForm.warn_person"
            :isShowCheckbox="true"
            :placeholder="'请选择提醒人员'"
            :isContainEmp="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
          ></get-department-select>
        </el-form-item>
        <el-form-item
          label="提前提醒公里:"
          prop="i_warn_miles"
          label-width="130px"
        >
          <div class="mileage-remind show-flex-box-r">
            <el-input-number
              v-model="ruleForm.i_warn_miles"
              :min="0"
              :controls="false"
              placeholder="输入提醒公里"
            ></el-input-number>
            <span style="margin-left: 15px; white-space: nowrap">公里</span>
          </div>
        </el-form-item>
        <el-form-item
          label="后台生成日期:"
          prop="i_gen_play_day"
          label-width="130px"
        >
          <div class="mileage-remind show-flex-box-r">
            <span style="margin-right: 15px; white-space: nowrap">每月</span>
            <el-input-number
              v-model="ruleForm.i_gen_play_day"
              :min="0"
              :controls="false"
              placeholder="输入第几号"
            ></el-input-number>
            <span style="margin-left: 15px; white-space: nowrap"
              >号自动生成下月保养计划</span
            >
          </div>
        </el-form-item>
        <el-form-item label="提醒方式:" prop="i_warn_way" label-width="130px">
          <el-checkbox-group v-model="remindType" @change="change">
            <el-checkbox label="系统消息"></el-checkbox>
            <el-checkbox label="APP推送"></el-checkbox>
            <el-checkbox label="短信通知"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="提醒内容:"
          prop="c_warn_content"
          label-width="130px"
        >
          <el-input
            type="textarea"
            maxlength="200"
            :rows="4"
            show-word-limit
            v-model="ruleForm.c_warn_content"
            placeholder="请输入提醒内容"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="自动下发并确认:"
          prop="i_auto_flow"
          label-width="130px"
        >
          <el-switch v-model="i_auto_flow" @change="changeAutoFlowSwith"></el-switch>
        </el-form-item>
        <el-form-item label="规则是否启用:" prop="i_valid" label-width="130px">
          <el-switch v-model="i_valid" @change="changeValidSwith"></el-switch>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')"
        >保 存</el-button
      >
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getDepartmentSelect,
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curType: [String],
  },
  data() {
    return {
      showTitle: "",
      remindersUserId: [],
      remindTypeMap: {
        '系统消息': 1,
        'APP推送': 2,
        '短信通知': 3,
      },
      remindType: [],
      ruleForm: {
        i_id: "",
        c_rules_type: "2",
        c_rules_name: "",
        i_age_condition_min: "",
        i_age_condition_max: "",
        i_condition_mile: "",
        i_condition_month: "",
        reminders: [], //提醒人员
        i_warn_miles: "",
        i_gen_play_day: "",
        i_warn_way: "",
        c_warn_content: "[车牌]距离二保时间（[二保日期]）[条件][到期天数]天！",
        i_valid: 1,
        i_auto_flow: 1,
        warn_person: []
      },
      i_valid: true,
      i_auto_flow: true,

      rules: {
        c_rules_name: [
          { required: true, message: "请输入规则名称", trigger: "change" },
        ],
        i_age_condition_min: [
          { required: true, message: "请选择保养条件", trigger: "change" },
        ],
        i_condition_mile: [
          { required: true, message: "请输入保养周期公里", trigger: "change" },
        ],
        i_condition_month: [
          { required: true, message: "请选择保养周期", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        // this.resetForm();
        //  this.remindersUserId = [];
        // // 清空提醒人员选中
        // this.$refs.tree.onClear()
      } else {
        this.configTitle();
        // if (this.curType == "edit") {
        //   // 回显示提醒人员
        //   setTimeout(() => {
        //     if(this.ruleForm.reminders && this.ruleForm.reminders.length > 0) {
        //       this.$refs.tree.userCheck(this.ruleForm.reminders);
        //     }
        //   }, 50);
        // }
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
        })
      }
    },
  },
  methods: {
    setData(info) {
      for (const key in this.ruleForm) {
        if (Object.hasOwnProperty.call(info, key)) {
          this.ruleForm[key] = info[key];
        }
      }
      this.remindType = info.c_warn_way;
      this.i_valid = info.i_valid ? true: false
      this.i_auto_flow = info.i_auto_flow ? true: false
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      // alert(this.curType)
      if (this.curType == "add") {
        this.showTitle = "添加二保规则";
      } else {
        this.showTitle = "编辑二保规则";
      }
    },
    changeValidSwith(newValue) {
      // console.log(newValue)
      this.ruleForm.i_valid = !!newValue? 1 : 0
    },
    changeAutoFlowSwith(newValue) {
      // console.log(newValue)
      this.ruleForm.i_auto_flow = !!newValue? 1 : 0
    },
    handleChange(value) {
      // console.log(value);
      //  console.log(this.ruleForm.people);
    },
    change() {
      let sum = 0;
      if(this.remindType.length >1 ) {
        sum = sum + 1;
        for (let i = 0; i < this.remindType.length; i++) {
          let j = this.remindTypeMap[this.remindType[i]];
          sum +=　j
        }
      }else{
        sum = this.remindTypeMap[this.remindType[0]];
      }
      // console.log(sum)
      this.ruleForm.i_warn_way = !!sum? sum : '';
      // console.log(this.ruleForm.i_warn_way)
    },

    onSelectChange(vehs, nodes) {
      // alert(JSON.stringify(nodes))
      if (nodes && nodes.length > 0) {
        nodes.forEach((item, index) => {
          delete item.children;
        });
        this.ruleForm.reminders = nodes;
      } else {
        this.ruleForm.reminders = [];
      }
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          this.$emit("save-add-edit-maintain", this.ruleForm);
        } else {
          return false;
        }
      });
    },

    resetForm() {
      this.$refs["form"].resetFields();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
// .el-dialog__wrapper {
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
// }

.el-dialog-div {
  height: 450px;
  overflow-y: scroll;
}

.annual-inspection-condition {
  width: 100%;

  span {
    white-space: nowrap;
  }

  span:first-child {
    margin-right: 15px;
  }

  .el-select {
    width: 140px;
    margin-right: 15px;
  }

  .el-input {
    width: 90px;
    margin-right: 15px;
  }
}

.mileage-remind /deep/ .el-input {
  width: 120px;
}

.el-cascader {
  width: 100% !important;
}
</style>


