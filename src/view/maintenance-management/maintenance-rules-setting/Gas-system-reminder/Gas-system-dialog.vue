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
        <el-form-item label="规则名称:" prop="rule_name" label-width="130px">
          <el-input v-model="ruleForm.rule_name"></el-input>
        </el-form-item>
        <el-form-item label="提醒类型:" prop="rule_type" label-width="130px">
          <el-select v-model="ruleForm.rule_type" placeholder="选择提醒类型" style="width: 100%;">
            <el-option label="气瓶" :value="1"></el-option>
            <el-option label="安全阀" :value="2"></el-option>
            <el-option label="压力表" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检验周期:" prop="condition_type" label-width="130px">
          <el-select v-model="ruleForm.condition_type" placeholder="选择检验周期" style="width: 100%;">
            <el-option label="半年一次" :value="1"></el-option>
            <el-option label="一年一次" :value="2"></el-option>
            <el-option label="两年一次" :value="3"></el-option>
            <el-option label="三年一次" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提醒人员:" prop="reminders" label-width="130px">
          <!-- <get-user-info
            ref="tree"
            v-model="ruleForm.warn_person"
            :isEcho="true"
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
          <!-- @on-change="onSelectChange" -->
        </el-form-item>
        <el-form-item
          label="提前提醒天数:"
          prop="warn_days"
          label-width="130px"
        >
          <div class="mileage-remind show-flex-box-r">
            <el-input-number
              v-model="ruleForm.warn_days"
              :min="0"
              :controls="false"
              placeholder="输入提醒天数"
            ></el-input-number>
            <span style="margin-left: 15px; white-space: nowrap">天</span>
          </div>
        </el-form-item>
        <el-form-item
          label="提醒周期:"
          prop="warn_cycle"
          label-width="130px"
        >
          <div class="annual-inspection-condition show-flex-box-r">
            <span style="margin-right: 15px">每</span>
            <el-input-number
              v-model="ruleForm.warn_cycle"
              :min="0"
              :controls="false"
            ></el-input-number>
            <span style="margin-right: 15px"> 天提醒一次，提醒时间</span>
            <el-time-select
              v-model="ruleForm.warn_time"
              :picker-options="{
                start: '00:00',
                step: '00:5',
                end: '23:55'
              }"
              placeholder="选择时间">
            </el-time-select>
          </div>
        </el-form-item>
        <el-form-item label="提醒方式:" prop="warn_way" label-width="130px">
          <el-checkbox-group v-model="remindType" @change="changeWarn">
            <el-checkbox label="系统消息"></el-checkbox>
            <el-checkbox label="APP推送"></el-checkbox>
            <el-checkbox label="短信通知"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="提醒内容:"
          prop="warn_content"
          label-width="130px"
        >
          <el-input
            type="textarea"
            maxlength="200"
            :rows="4"
            show-word-limit
            v-model="ruleForm.warn_content"
            placeholder="请输入提醒内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="规则是否启用:" prop="valid" label-width="130px">
          <el-switch v-model="ruleForm.valid"></el-switch>
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
      remindTypeMap: {
        "系统消息": 1,
        "APP推送": 2,
        "短信通知": 3,
      },
      remindType: [],
      ruleForm: {
        id: "",
        rule_name: "",
        rule_type: "",
        condition_type: "",
        warn_person: [], //提醒人员
        warn_days: "",
        warn_cycle: "",
        warn_time: "",
        warn_way: '',
        warn_content: "",
        valid: true,
      },
      rules: {
        rule_name: [
          { required: true, message: "请输入规则名称", trigger: "change" },
        ],
        rule_type: [
          { required: true, message: "请选择提醒类型", trigger: "change" },
        ],
        condition_type: [
          { required: true, message: "请选择检验周期", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
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
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      if (this.curType == "add") {
        this.showTitle = "添加燃气检验到期提醒规则";
      } else {
        this.showTitle = "编辑燃气检验到期提醒规则";
      }
    },
    changeWarn() {
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
      this.ruleForm.warn_way = !!sum? sum : '';
    },
    // onSelectChange(vehs, nodes) {
    //   // alert(JSON.stringify(nodes))
    //   if (nodes && nodes.length > 0) {
    //     nodes.forEach((item, index) => {
    //       delete item.children;
    //     });
    //     this.ruleForm.reminders = nodes;
    //   } else {
    //     this.ruleForm.reminders = [];
    //   }
    // },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          this.$emit("save-add-edit-maintdiscard", this.ruleForm);
        } else {
          return false;
        }
      });
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
  height: 500px;
  overflow-y: scroll;
  padding-right: 5px;
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


