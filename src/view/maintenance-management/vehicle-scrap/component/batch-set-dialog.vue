<template>
  <el-dialog
    :visible="dialogBool"
    :title="`${titleType ==  'single'?'车辆报废申请':'批量报废申请'}`"
    :before-close="dialogClose"
    width="700px"
    
  >
    <div class="el-dialog-div">
      <el-form
        size="mini"
        ref="form"
        label-width="120px"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="报废车辆" prop="ids">
          <el-input v-model="vehicleNames" placeholder="选择报废车辆" disabled>
            <template slot="append" v-if="titleType == 'batch'"><span style="color:red">{{form.ids.length}}</span>&nbsp;辆</template>
          </el-input>
        </el-form-item>
        <el-form-item label="报废日期:" prop="plan_date">
          <el-date-picker
            v-model="form.plan_date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择报废日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报废原因:" prop="reason">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入内容"
            v-model="form.reason"
            maxlength="300"
            show-word-limit
          ></el-input>
        </el-form-item>
        <div v-if="curSelecedType != 'detail'" class="show-flex-box-c">
          <el-form-item label="选择报废流程:" prop="flow_id">
            <el-select v-model="flow_id" @change="selectedFlowId" placeholder="请选择流程">
              <el-option
                v-for="item in flowListOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <span style="font-size: 12px;font-weight: 400;font-style: normal;color: rgba(51, 51, 51, 0.52156862745098);padding-left: 120px; line-height: 28px">备注：添加或者撤销后再次编辑流程默认选择第一个,若更改请选择</span>
        </div>

        <div class="show-flex-box-c" v-if="!!flow_id || (!!form.i_flow_id && curSelecedType == 'detail')">
          <p
            style="
              margin-left: 15px;
              margin-bottom: 15px;
              color: #409eff;
              font-size: 16px;
              font-weight: bold;
            "
          >
            流程:
          </p>
          <div class="show-flex-box-r" v-if="!!form.i_flow_id && curSelecedType == 'detail'" style="margin: 15px 0 0 30px;">
          <approve-schedule style="margin-left: 10px;" :isFlow="false" :flow_id="form.i_flow_id"></approve-schedule>
          </div>
          <div class="show-flex-box-r"  v-if="!!flow_id && curSelecedType != 'detail'" style="margin: 15px 0 0 30px;">
            <approve-step :flow_id="flow_id" :isFlow="true" @on-users="saveOnUsers"></approve-step>
          </div>
        </div>

      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import {getUser} from '@/utils/auth'
  import approveSchedule from '@/components/approve-echo/approve-schedule.vue'
  import approveStep from '@/components/approve-echo/approve-step.vue'  
  export default {
    components: {
      approveSchedule,
      approveStep
    },
    props: {
      dialogBool: Boolean,
      curSelecedType: [String],
    },
    data() {
      return {
        titleType:"",
        vehicleNames:'',
        form: {
          ids: [],
          plan_date: '',
          reason: '',
          flow_id: '',
          flow_code:''
        },
        rules: {
          ids: [
            { required: true, message: '请选择报废车辆', trigger: 'change' },
          ],
          plan_date: [
            { required: true, message: '请选择报废日期', trigger: 'change' },
          ],
          reason: [
            { required: true, message: '请输入报废原因', trigger: 'change' },
          ],
          flow_id:[
            { required: true, message: '请选择报废流程', trigger: 'change' },
          ]
        },
        flowListOptions:[],
        flow_id: '',
        approveStepList:[], //流程列表
      };
    },
    watch: {
      dialogBool(bool) {
        if (bool === false) {
          Object.assign(this.$data, this.$options.data());
        }else{
          this.reqGetListFlowManage();
          this.$nextTick(() =>{
            this.$refs.form.clearValidate();
          })
        }
      },
    },
    methods: {
      dialogClose() {
        this.$emit("update:dialogBool", false);
      },
      // 获取流程列表
      reqGetListFlowManage() {
        let params = {
          object_id: 110,
          type: 2
        }
        this.$client.GetListFlowManage(params).then(res => {
          if(res.head.result == '200') {
            this.flowListOptions = res.context.list;
            if(!!this.flowListOptions && this.flowListOptions.length && !this.flow_id) {
              this.flow_id = this.flowListOptions[0].id
              this.form.flow_id = this.flow_id
              this.$nextTick(() =>{
                this.$refs.form.clearValidate();
              })
            }
          }else{
            this.flowListOptions = [];
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      },

      // 选择流程
      selectedFlowId(val) {
        this.form.flow_id = val
        if(!val) {
          this.approveStepList = []
        }
      },

      // 根据流程设计发起流程folw_code
      saveOnUsers(list) {
        this.approveStepList = list;
        // this.submitApplyMembershipForm();
      },

      updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...{},...this.form};
          if(!!info.flow_id) {
            info.flow_id = ''
          }
          this.$emit("save-add-edit", info, this.approveStepList);
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
  height: 400px;
  overflow-y: scroll;
}
.el-dialog-div /deep/ .el-date-editor {
  width: 500px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 500px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 500px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 500px;
}

</style>

