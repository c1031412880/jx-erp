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
          prop="i_condition_type"
          label-width="130px"
        >
          <el-select v-model="ruleForm.i_condition_type" placeholder="请选择">
            <el-option label="最近保养日期" value="1"></el-option>
            <el-option label="累计行驶里程" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="保养周期:"
          prop="i_condition_month"
          label-width="130px"
          v-if="ruleForm.i_condition_type == 1"
        >
          <el-select v-model="ruleForm.i_condition_month" placeholder="请选择">
            <el-option label="每月一次" value="1"></el-option>
            <el-option label="三月一次" value="3"></el-option>
            <el-option label="半年一次" value="6"></el-option>
            <el-option label="一年一次" value="12"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="保养周期:"
          prop="i_condition_mile"
          label-width="130px"
          v-if="ruleForm.i_condition_type == 2"
        >
          <div class="annual-inspection-condition show-flex-box-r">
            <span>达到</span>
            <el-input-number
              v-model="ruleForm.i_condition_mile"
              :min="0"
              :controls="false"
            ></el-input-number>
            <span>公里</span>
          </div>
        </el-form-item>
        <el-form-item label="提醒人员:" prop="name" label-width="130px">
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
          label="提前提醒天数:"
          prop="i_warn_days"
          label-width="130px"
          v-if="ruleForm.i_condition_type == 1"
        >
          <div class="mileage-remind show-flex-box-r">
            <el-input-number
              v-model="ruleForm.i_warn_days"
              placeholder="输入提前提醒天数"
              with="150px"
              :min="0"
              :controls="false"
            ></el-input-number>
            <span style="margin-left: 15px; white-space: nowrap">天</span>
          </div>
        </el-form-item>
        <el-form-item
          label="提前提醒公里:"
          prop="i_warn_miles"
          label-width="130px"
          v-if="ruleForm.i_condition_type == 2"
        >
          <div class="mileage-remind show-flex-box-r">
            <el-input-number
              v-model="ruleForm.i_warn_miles"
              :min="0"
              placeholder="输入提前提醒公里"
              :controls="false"
            ></el-input-number>
            <span style="margin-left: 15px; white-space: nowrap">公里</span>
          </div>
        </el-form-item>
        <el-form-item label="后台生成日期:" prop="name" label-width="130px">
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
        <el-form-item label="提醒内容:" prop="c_warn_content" label-width="130px">
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
      <el-button type="primary" @click="updatePlaybill('ruleForm')">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getDepartmentSelect
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
        "系统消息": 1,
        "APP推送": 2,
        "短信通知": 3,
      },
      remindType: [],
      ruleForm: {
        i_id: "",
        c_rules_type: "1",
        c_rules_name: "",
        i_condition_type: "1", //1：指定周期，2：指定里程
        i_condition_month: "",
        i_condition_mile: "",
        // i_age_condition_min: "",
        // i_age_condition_max: "",
        // reminders: [], //提醒人员
        i_warn_days: "",
        i_warn_miles: "",
        i_gen_play_day:"",
        i_warn_way: "",
        c_warn_content: "[车牌]距离一保时间（[一保日期]）[条件][到期天数]天！",
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
        i_condition_type: [
          { required: true, message: "请选择保养条件", trigger: "change" },
        ],
        i_condition_month: [
          { required: true, message: "请选择保养周期", trigger: "change" },
        ],
        i_condition_mile: [
          { required: true, message: "请输入保养周期公里", trigger: "change" },
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
      //   if(this.curType =='edit') {
      //     // 回显示提醒人员
      //     setTimeout(() => {
      //       if(this.ruleForm.reminders && this.ruleForm.reminders.length > 0) {
      //         this.$refs.tree.userCheck(this.ruleForm.reminders);
      //       }
      //     },50)
      //   }
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate();
      })
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
        this.showTitle = "添加一保规则";
      } else {
        this.showTitle = "编辑一保规则";
      }
    },
    handleChange(value) {
      // console.log(value);
      //  console.log(this.ruleForm.people);
    },
    changeValidSwith(newValue) {
      // console.log(newValue)
      this.ruleForm.i_valid = !!newValue? 1 : 0
    },
    changeAutoFlowSwith(newValue) {
      // console.log(newValue)
      this.ruleForm.i_auto_flow = !!newValue? 1 : 0
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
          if(this.ruleForm.i_condition_type == '1') {
            delete this.ruleForm.i_condition_mile
            delete this.ruleForm.i_warn_miles
          }else{
            delete this.ruleForm.i_condition_month
            delete this.ruleForm.i_warn_days
          }
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

.el-cascader {
  width: 100% !important;
}

.mileage-remind /deep/ .el-input {
  width: 120px;
}
</style>


