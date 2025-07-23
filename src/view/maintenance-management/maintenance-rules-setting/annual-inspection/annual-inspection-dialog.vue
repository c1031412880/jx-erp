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
        <el-form-item label="年检条件:" prop="i_age_condition_min" label-width="130px">
          <div class="annual-inspection-condition show-flex-box-r">
            <!-- <span>车龄</span>
            <el-select v-model="ruleForm.region" placeholder="选择条件">
              <el-option label="大于" value="大于"></el-option>
              <el-option label="等于" value="等于"></el-option>
              <el-option label="小于" value="小于"></el-option>
            </el-select> -->
            <el-input-number v-model="ruleForm.i_age_condition_min" :min="0" :controls="false"></el-input-number>
              <span>&lt;车龄 &lt;=</span>
            <el-input-number v-model="ruleForm.i_age_condition_max" :min="0" :controls="false"></el-input-number>
            <span>年</span>
          </div>
        </el-form-item>
        <el-form-item label="年检频率:" prop="i_condition_type" label-width="130px">
          <el-select v-model="ruleForm.i_condition_type" placeholder="选择年检频率">
            <el-option label="半年一次" :value="0"></el-option>
            <el-option label="一年一次" :value="1"></el-option>
            <el-option label="两年一次" :value="2"></el-option>
            <el-option label="三年一次" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提醒人员:" prop="reminders" label-width="130px">
          <!-- <get-user-info ref="tree" v-model="remindersUserId" @on-change="onSelectChange"></get-user-info> -->
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
        <el-form-item label="提前提醒天数:" prop="i_warn_days" label-width="130px">
          <el-input-number
            v-model="ruleForm.i_warn_days"
              :min="0"
              :controls="false"
            placeholder="输入0代表当天准时提醒"
          ></el-input-number>
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
        <el-form-item label="规则是否启用:" prop="i_valid" label-width="130px">
          <el-switch v-model="i_valid" @change="changeSwith"></el-switch>
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
import getUserInfo from "@/components/base/formModel/tree/get-user-select-tree";
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
      remindersUserId:[],
      remindTypeMap:{
        '系统消息':1,
        'APP推送':2,
        '短信通知':3,
      },
      ruleForm: {
        i_id: "",
        c_rules_name: "",
        i_age_condition_min: "",
        i_age_condition_max: "",
        i_condition_type: "",
        // reminders:[],  //提醒人员
        i_warn_days: "",
        i_warn_way: "",
        c_warn_content: "[车牌]距离年检时间（[年检日期]）[条件][到期天数]天！",
        i_valid: 1,
        warn_person: [],
      },
      remindType:[],
      i_valid: true,
      rules: {
        c_rules_name: [
          { required: true, message: "请输入规则名称", trigger: "change" },
        ],
        i_age_condition_min: [
          { required: true, message: "请输入最小车龄", trigger: "change" },
        ],
        i_age_condition_max: [
          { required: true, message: "请输入最大车龄", trigger: "change" },
        ],
        i_condition_type: [
          { required: true, message: "请选择年检周期", trigger: "change" },
        ],

      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        // this.resetForm();
        // this.remindersUserId = [];
        // 清空提醒人员选中
        // this.$refs.tree.onClear()
      } else {
        this.configTitle();
        // if(this.curType =='edit') {
        //   // 回显示提醒人员
        //   setTimeout(() => {
        //     if(this.ruleForm.reminders && this.ruleForm.reminders.length > 0) {
        //       this.$refs.tree.userCheck(this.ruleForm.reminders);
        //     }
        //   },50)
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
      // alert(this.curType)
      if (this.curType == "add") {
        this.showTitle = "添加年检规则";
      } else {
        this.showTitle = "编辑年检规则";
      }
    },
    changeSwith(newValue) {
      console.log(newValue)
      this.ruleForm.i_valid = !!newValue? 1 : 0
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

    onSelectChange(vehs,nodes) {
      // alert(JSON.stringify(nodes))
      if(nodes && nodes.length > 0) {
        
        nodes.forEach((item,index) => {
          delete item.children
        });
        this.ruleForm.reminders = nodes
      }else{
        this.ruleForm.reminders = []
      }
    },
    
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.ruleForm)
            this.$emit("save-add-edit-annual-inspection", this.ruleForm);
          } else {
            return false;
          }
        });

      // let successrMessage = "";
      // let errorMessage = "";
      // if (this.curType == "add") {
      //   this.ruleForm.operate_type = "add";
      //   delete this.ruleForm.id;
      //   successrMessage = "添加成功";
      //   errorMessage = "添加失败";
      // } else {
      //   this.ruleForm.operate_type = "update";
      //   successrMessage = "修改成功";
      //   errorMessage = "修改失败";
      // }
      // this.$emit("save-add-edit-annual-inspection", this.ruleForm);
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
    // margin-left: 15px;
  }

  .el-select {
    width: 140px;
    margin-right: 15px;
  }

  .el-input {
    width: 90px;
    margin-right: 15px;
    margin-left: 15px;
  }
}

// .el-dialog-div /deep/ .el-form-item__content  .el-popover__reference-wrapper{
//   width 180px
// }

.el-cascader{
    width 100% !important
  }
</style>


