<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="550px"
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="0px" size="mini">
        <el-form-item label="" prop="warn_persons">
          <div class="set-proportion-start show-flex-box-r" style="align-items: center;">
            <span>提醒接收人员：&nbsp;</span>
            <get-department-select
                ref="personalTree"
                v-model="form.warn_persons"
                :width="'360'"
                :show_all="true"
                :isShowCheckbox="true"
                :placeholder="'请选择提醒接收人员：'"
                :isContainEmp="true"
                :isExportMultiple="true"
                :isCheckStrictly="false"
              ></get-department-select>
          </div>
        </el-form-item>
        <el-form-item label="" prop="warn_way">
          <div class="set-proportion-start show-flex-box-r" style="align-items: center;">
            <span>提醒方式：&nbsp;</span>
            <el-checkbox-group v-model="form.warn_way" @change="change">
              <el-checkbox :label="1">系统消息</el-checkbox>
              <el-checkbox :label="2">APP推送</el-checkbox>
              <el-checkbox :label="3">短信通知</el-checkbox>
            </el-checkbox-group>
          </div>
          
        </el-form-item>


        <el-form-item label="" prop="warn_day">
          <div class="set-proportion-start show-flex-box-r" style="align-items: center;">
            <span>合同到期提醒时间：第一次提醒时间，距离合同结束时间&nbsp;</span>
            <el-input v-model="form.warn_day" placeholder="" style="width:120px" oninput="value=value.replace(/[^\d.-]/g,'')" size="mini" @blur="form.warn_day = $event.target.value"> <template slot="append">天</template> </el-input>
          </div>
        </el-form-item>

        <el-form-item label="" prop="interval_days">
          <div class="set-proportion-start show-flex-box-r" style="align-items: center;">
            <span>间隔天数：每次间隔&nbsp;</span>
            <el-input v-model="form.interval_days" placeholder="" style="width:120px" oninput="value=value.replace(/[^\d.-]/g,'')" size="mini" @blur="form.interval_days = $event.target.value"> <template slot="append">天</template> </el-input><span>&nbsp;提醒一次。</span>
          </div>
        </el-form-item>

        <el-form-item label="" prop="warn_day1">
          <div class="set-proportion-start show-flex-box-r" style="align-items: center;">
            <span>每年缴费日期提醒：第一次提醒时间，距离缴费日期&nbsp;</span>
            <el-input v-model="form.warn_day1" placeholder="" style="width:120px" oninput="value=value.replace(/[^\d.-]/g,'')" size="mini" @blur="form.warn_day1 = $event.target.value"> <template slot="append">天</template> </el-input>
          </div>
        </el-form-item>

        <el-form-item label="" prop="interval_days1">
          <div class="set-proportion-start show-flex-box-r" style="align-items: center;">
            <span>间隔天数：每次间隔&nbsp;</span>
            <el-input v-model="form.interval_days1" placeholder="" style="width:120px" oninput="value=value.replace(/[^\d.-]/g,'')" size="mini" @blur="form.interval_days1 = $event.target.value"> <template slot="append">天</template> </el-input><span>&nbsp;提醒一次。</span>
          </div>
        </el-form-item>


        
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {getDepartmentSelect},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "提醒设置",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      date: [],
      remindTypeMap: {
        "系统消息": 1,
        "APP推送": 2,
        "短信通知": 3,
      },
      remindType: [],
      form: {
        id: "",
        warn_persons:[],
        warn_way:[],
        warn_day: '',
        interval_days:'',
        id1:'',
        warn_day1: '',
        interval_days1:'',
        message_type: 2, //消息类型;1代办2到期3系统
        valid: 1, //是否可用（1：可用 2：不可用）
        warn_type: 1, //提醒天数类型;1提前2间隔3延后
      },
      basicRules: {
        warn_persons: [
          { required: true, message: "请选择提醒人员", trigger: "change" },
        ],
        warn_way: [
          { required: true, message: "请选择消息提醒方式", trigger: "change" },
        ],
        warn_day: [
          { required: true, message: "请输入合同提前提醒时间", trigger: "change" },
        ],
        interval_days: [
          { required: true, message: "请输入合同提醒时间间隔", trigger: "change" },
        ],
        warn_day1: [
          { required: true, message: "请输入合同每年缴费提前提醒时间", trigger: "change" },
        ],
        interval_days1: [
          { required: true, message: "请输入合同缴费提醒时间间隔", trigger: "change" },
        ],

      },
      isEdit:false
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.reqRulesMessageRule();
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        })
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 获取规则数据
    reqRulesMessageRule(){
       this.$client.GetRulesMessageRule()
        .then(res => {
          if (res.head.result == "200") {
            let list = res.context
            if(!!list && list.length > 0) {
              this.isEdit = true
              this.form.id = list[0].id
              this.form.warn_persons = list[0].warn_persons
              this.form.warn_way = list[0].warn_way.split(',').map((item,index) =>{
                return Number(item)
              })
              this.form.warn_day = list[0].warn_day
              this.form.interval_days = list[0].interval_days
            }
            if(!!list && list.length > 1) {
              this.form.id1 = list[1].id
              this.form.warn_day1 = list[1].warn_day
              this.form.interval_days1 = list[1].interval_days
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
    // 选择消息提醒方式
    change() {

    },
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = JSON.parse(JSON.stringify(this.form))
          let InfoList = []
          let firstObj = {
            warn_persons: info.warn_persons,
            warn_way: info.warn_way.join(','),
            warn_day: info.warn_day,
            interval_days: info.interval_days,
            rule_type: 10,
            message_type: info.message_type,
            valid: info.valid,
            warn_type: info.warn_type,
          }
          let secondObj = {
            warn_persons: info.warn_persons,
            warn_way: info.warn_way.join(','),
            warn_day: Number(info.warn_day1),
            interval_days: Number(info.interval_days1),
            rule_type: 20,
            message_type: info.message_type,
            valid: info.valid,
            warn_type: info.warn_type,
          }
          if(this.isEdit) {
            firstObj.id = info.id
            secondObj.id = info.id1
          }
          InfoList.push(firstObj,secondObj)

          // console.log(InfoList)
          // return
          
          this.$emit("save-add-edit-reminder", InfoList,this.isEdit);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
  height: 250px;
  // overflow-y: scroll;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 370px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 370px;
}
</style>

