<template>
  <div class="archives-info" style="height:100%;overflow-x:hidden">
  <div style="float:left;width: 6px;height: 16px; background: #409EFF;"></div>
  <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold">工单进度</p>
    <el-steps :active="orderStatus" align-center  v-if="this.orderStatus != ''">
      <el-step :title="item.step_name" :key="index" v-for="(item,index) in steplist">
        <template slot="description">
          <p>{{item.user_name}}</p>
          <p style="width:110px">{{item.date}}</p>
        </template>
      </el-step>
    </el-steps>
  <div style="float:left;width: 6px;height: 16px; background: #409EFF;"></div>
  <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;">工单信息</p>
    <el-form ref="elForm" :model="formData" :rules="rules" size="mini" label-width="115px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="工单号码:" prop="age">
            <p style="width:138px"> {{formData.work_code}}</p>
          </el-form-item>
        </el-col>
          <el-col :span="8">
          <el-form-item label="工单状态:" prop="c_health_state" style="margin:0px;display:inline;" >
            <p style="width:80px"> {{formData.state_name}}</p>
            <div v-if="formData.state==2">
              <get-select-dictionaries v-model="form.state_child" :classKey="'维修中'" :placeholder="'请选择状态'" :disabled="curChangeType == 'detail'"></get-select-dictionaries>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-show="!!formData.out_repair_flow_code">
          <el-form-item label="车辆外修联系单:" prop="out_repair_flow_code">
            <el-button @click="openOutRepairHandle" type="text" size="mini">{{ formData.out_repair_flow_code }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="优先级:" prop="c_nation">
          <el-select v-model="formData.priority" placeholder="请选择" clearable :style="{width: '100%'}" disabled>
              <el-option v-for="(item, index) in PriorityOptions"             
                :key="index"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预算(元):" prop="i_height">
            <el-input v-model="form.budget_fee" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.budget_fee = $event.target.value" placeholder="请填写预算(元)" clearable
              :style="{width: '100%'}" :disabled="curChangeType == 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划完工日期:" prop="c_marry">
              <el-date-picker v-model="form.plan_finish" format="yyyy-MM-dd  HH:mm:ss" value-format="yyyy-MM-dd  HH:mm:ss"
              :style="{width: '100%'}" placeholder="请选择日期" clearable :disabled="curChangeType == 'detail'"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="维修车间:">
            <p style="width:138px"> {{formData.maint_dept_name}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="调度员:" prop="i_is_join_army">
            <get-user-select
              ref="driverTree1"
              v-model="form.dispatch_id"
              :width="'390'"
              :isShowCheckbox="false"
              :placeholder="'请选择调度员'"
              :isExportMultiple="false"
              :disabled="curChangeType=='detail'"
            ></get-user-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注:" type="textarea"  prop="i_is_nyl">
              <el-input v-model="form.remark" type="textarea" placeholder="备注"
              :autosize="{minRows: 2, maxRows: 2}" :style="{width: '100%'}" :disabled="curChangeType == 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="未完成原因说明:" prop="c_party_remark">
            <el-input v-model="form.fail_reason" type="textarea" placeholder="请输入未完成原因说明"
              :autosize="{minRows: 2, maxRows: 2}" :style="{width: '100%'}" :disabled="curChangeType == 'detail'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="float:left;width: 6px;height: 16px; background: #409EFF;"></div>
      <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;">报修信息</p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="自编号:" prop="d_other_date">
            <p style="width:138px"> {{formData.vehicle_number}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车牌号:" prop="i_is_staff_representative">
            <p style="width:138px"> {{formData.vehicle_name}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属组织:" prop="d_be_elected">
            <p style="width:138px"> {{formData.department_name}}</p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="车辆型号:" prop="c_be_elected_layer">
            <p style="width:150px"> {{formData.vehicle_kind_name}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报修类别:" prop="c_degree_of_education">
            <p style="width:138px"> {{formData.type_child_name}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报修人:" prop="c_personal_identity">
            <p style="width:138px"> {{formData.repair_user_name}}</p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="报修时间:" prop="c_salary_card">
            <p style="width:138px"> {{formData.repair_time}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报修地点:" prop="c_social_card">
            <p style="width:138px"> {{formData.repair_address}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="驾驶员:" prop="c_reserve_account">
             <p style="width:138px"> {{formData.driver_name}}</p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否拖车:" prop="c_hometown">
             <p v-if="formData.is_trailer == 2" style="width:138px"> 是</p>
             <p v-else style="width:138px"> 否</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="报修描述:" prop="c_hometown">
             <el-input v-model="formData.repair_describe" type="textarea" placeholder="请输入报修描述"
                :autosize="{minRows: 2, maxRows: 2}" :style="{width: '100%'}" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
         <el-form-item label="相关图片:" prop="c_hometown">
            <el-image v-for="(item,i) in formData.imgs" :key='i'
            style="width: 100px; height: 100px;margin-left:50px"
            :src="item"
            ></el-image>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="float:left;width: 6px;height: 16px; background: #409EFF;"></div>
      <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;">进场检验信息</p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="检验人:" prop="c_salary_card">
            <p style="width:138px"> {{checkform.check_name}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检验时间:" prop="c_social_card">
            <p style="width:138px"> {{checkform.check_time}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="检验描述:" prop="c_hometown">
             <el-input v-model="checkform.check_describe" type="textarea" placeholder="请输入检验描述"
                :autosize="{minRows: 2, maxRows: 2}" :style="{width: '100%'}" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <div style="float:left;width: 6px;height: 16px; background: #409EFF;"></div>
      <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;">接修信息</p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="接修人:" prop="c_salary_card">
            <p style="width:138px"> {{formData.receive_name}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="接修时间:" prop="c_social_card">

             <p style="width:138px"> {{formData.receive_time}}</p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="display: flex;align-items: center;">
          <div style="width: 6px;height: 16px; background: #409EFF;"></div>
          <p style="margin-left:9px;color:#409EFF;font-size:14px;font-weight:bold;">完工信息</p>
          <el-button style="margin-left:15px;" size="mini" type="primary" @click="openCompletionList">完工详情</el-button>
        </el-col>
        <el-col :span="8">
          <el-form-item label="完工负责人:" prop="c_salary_card">
            <p style="width:138px"> {{formData.finish_name}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="完工时间:" prop="c_social_card">
            <p style="width:138px"> {{formData.finish_time}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="完工描述:" prop="c_hometown">
             <el-input v-model="formData.finish_content" type="textarea" placeholder="请输入报修描述"
                :autosize="{minRows: 2, maxRows: 2}" :style="{width: '100%'}" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <div style="float:left;width: 6px;height: 16px; background: #409EFF;"></div>
      <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;">完工检验信息</p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="检验人:" prop="c_salary_card">
            <p style="width:138px"> {{formData.finish_check_name}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检验时间:" prop="c_social_card">
            <p style="width:138px"> {{formData.finish_check_time}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="检验描述:" prop="c_hometown">
             <el-input v-model="formData.finish_check_content" type="textarea" placeholder="请输入报修描述"
                :autosize="{minRows: 2, maxRows: 2}" :style="{width: '100%'}" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="float:left;width: 6px;height: 16px; background: #409EFF;"></div>
      <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;">车辆出厂信息</p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="接车驾驶员:" prop="c_salary_card">
            <p style="width:138px"> {{formData.out_name}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出厂时间:" prop="c_social_card">
            <p style="width:138px"> {{formData.out_time}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="接车人意见:" prop="c_hometown">
             <el-input v-model="formData.out_content" type="textarea" placeholder="请输入报修描述"
                :autosize="{minRows: 2, maxRows: 2}" :style="{width: '100%'}" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="float:left;width: 6px;height: 16px; background: #409EFF;"></div>
      <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;">费用清单</p>
      <el-row>
        <el-col :span="6">
          <el-form-item label="预算（元）:" prop="c_salary_card">
            <p  style="width:138px"> {{form.budget_fee}}</p>
          </el-form-item>
        </el-col>
            <el-col :span="6">
          <el-form-item label="材料费（元）:" prop="c_social_card">
            <p  style="width:138px"> {{formData.total_materials}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="工时费（元）:" prop="c_social_card">
            <p  style="width:138px"> {{formData.total_hours_fees}}</p>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="施救费（元）:" prop="c_social_card">
            <p v-if="!formData.rescue_cost"></p>
            <p v-else style="width:138px"> {{formData.rescue_cost}}</p>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="辅料费（元）:" prop="c_social_card">
            <p v-if="formData.repair_fee==null"></p>
            <p v-else style="width:138px"> {{formData.repair_fee.ingredients}}</p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="总工时(h):" prop="c_salary_card">
            <p v-if="formData.repair_fee==null"></p>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="加班费（元）:" prop="c_social_card">
            <p v-if="formData.repair_fee==null"></p>
            <p v-else style="width:138px"> {{formData.repair_fee.overtime}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="优惠（元）:" prop="c_social_card">
            <p v-if="formData.repair_fee==null"></p>
            <p v-else style="width:138px"> {{formData.repair_fee.sale}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="实际费用（元）:" prop="c_social_card">
            <p v-if="formData.repair_fee==null"></p>
            <p v-else style="width:138px"> {{formData.repair_fee.pay_fee}}</p>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <repair-completion-dialog
      ref="repairCompletionDialog"
      :dialogBool.sync="repairCompletionDialogShow"
      :selectChangeType="'detail'"
    ></repair-completion-dialog>
  </div>
</template>
<script>
import repairCompletionDialog from '../dialog/repair-completion-dialog'
import getUserSelect from 'components/base/formModel/tree/get-user-select'
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getUserSelectTree from '@/components/base/formModel/tree/get-user-select-tree'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getmaintaindep from "@/components/base/formModel/select/get-maintain-dep";
export default {
  components: {repairCompletionDialog,getDepartmentSelect,getUserSelectTree,getDriverSelectTree,getmaintaindep,getSelectDictionaries,getUserSelect},
  props: {
    curChangeType:{
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      repairCompletionDialogShow: false,
      orderStatus:'',
      steplist:[],
      marryOptions:[
        { value: "已婚", name: "已婚" },
        { value: "未婚", name: "未婚" },
        { value: "离异", name: "离异" },
        { value: "丧偶", name: "丧偶" },
      ],
      PriorityOptions:[
        { value: "3", name: "非常紧急" },
        { value: "2", name: "紧急" },
        { value: "1", name: "一般" },
      ],
      statesTypeOptions:[
        { value: "等配件", name: "等配件" },
        { value: "等厂家处理", name: "等厂家处理" },
        { value: "尾气检测", name: "尾气检测" },
      ],
      isJoinArmyOptions:[
        { value: 1, name: "是" },
        { value: 0, name: "否" },
      ],
      isNylOptions:[
        { value: 1, name: "是" },
        { value: 0, name: "否" },
      ],
      politicalOptions:[
        { value: "群众", name: "群众" },
        { value: "团员", name: "团员" },
        { value: "党员", name: "党员" },
        { value: "预备党员", name: "预备党员" },
      ],
      isStaffRepresentativeOptions:[
        { value: 1, name: "是" },
        { value: 0, name: "否" },
      ],
      isManagerOptions:[
        { value: 1, name: "是" },
        { value: 0, name: "否" },
      ],
      accountTypeOptions:[
        { value: "农业户口", name: "农业户口" },
        { value: "非农业户口", name: "非农业户口" },
      ],
      date:[],
      checkform:{
        check_name:'',
        check_time:'',
        check_describe:''
      },
      formData: {
        finish_check_name:'',
        finish_check_content:'',
        finish_check_time:'',
        finish_time:'',
        finish_name:'',
        finish_content:'',
        work_code:'',
        state:'',
        state_name:'',
        priority:'',
        dept_id:'',
        vehicle_number:'',
        vehicle_name:'',
        department_name:'',
        vehicle_kind_name:'',
        type_name:'',
        maint_dept_name:'',
        repair_user_name:'',
        repair_time:'',
        repair_address:'',
        repair_address_id:'',
        is_trailer:'',
        driver_name:'',
        type_child_name:'',
        repair_describe:'',
        imgs:[],
        receive_name:'',
        rescue_cost: '',
        out_repair_flow_code: '',
      },
      form:{
        state_child:0,
        budget_fee:0,
        plan_finish:'',
        dispatch_id:'',
        remark:'',
        fail_reason:'',
        id:'',
        maint_dept:'',
      },
      rules: {},
      staffAge:'' //员工年龄
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化数据
    resetData(){ 
      this.$refs['elForm'].resetFields()
      this.$refs.driverTree1.onClear();
      this.staffAge = 0;
    },
    // 选择
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.formData.d_from = this.date[0];
        this.formData.d_end = this.date[1];
      }else{
        this.formData.d_from = '';
        this.formData.d_end = '';
      }
    },
    // 数据回显
    setData(val){
      this.formData = val
        console.log( this.formData,'488')
      this.$client.getMaintRepairRecord({repair_id:val.repair_id})
          .then(res => {
            if (res.head.result == "200") {
              this.formData.is_trailer = res.context.is_trailer
              this.formData.repair_user_name = res.context.repair_user_name
              this.formData.repair_time = res.context.repair_time
              this.formData.driver_name = res.context.driver_name
              this.formData.type_child_name = res.context.type_child_name
              this.formData.repair_describe = res.context.repair_describe
              this.formData.repair_address = res.context.repair_address
              this.formData.repair_address_id = res.context.repair_address_id
              this.formData.imgs = res.context.imgs
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            };
          })
      this.$client.getStepById({order_id:val.id})
      .then(res => {
        if (res.head.result == "200") {
          this.orderStatus = res.context.index
          this.steplist =res.context.data
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };
      })
     console.log(this.formData.imgs,'1111')
     
     if(val.state_child!=0){
       this.form.state_child = val.state_child
     }
     this.formData.finish_check_name =val.finish_check_name
     this.formData.finish_check_content =val.finish_check_content
     this.form.finish_check_time = val.finish_check_time
     this.formData.finish_time =val.finish_time
     this.formData.finish_name =val.finish_name
     this.form.finish_content = val.finish_content
     this.formData.work_code = val.work_code
     this.formData.state = val.state
     this.formData.state_name = val.state_name
     this.formData.priority = val.priority.toString()
     this.formData.dept_id = val.dept_id
     this.formData.rescue_cost = val.rescue_cost
     if(val.vehicle_info){
     this.formData.vehicle_number = val.vehicle_info.vehicle_number
     this.formData.vehicle_name = val.vehicle_info.vehicle_name
     this.formData.department_name = val.vehicle_info.department_name
     this.formData.vehicle_kind_name = val.vehicle_info.vehicle_kind_name
     }
     this.formData.type_name = val.type_name
     if(val.repair_check){
     this.checkform.check_name = val.repair_check.check_name
     this.checkform.check_time = val.repair_check.check_time
     this.checkform.check_describe = val.repair_check.check_describe
     this.formData.maint_dept_name = val.repair_check.maint_dept_name
     this.form.maint_dept = val.repair_check.maint_dept.toString()
     }
     
     this.form.fail_reason = val.fail_reason
     this.form.remark = val.remark
     this.form.id = val.id
     this.form.dispatch_id = val.dispatch_id
     this.form.plan_finish = val.plan_finish
     this.form.budget_fee = val.budget_fee
    },
    // 打开车辆外修联系单
    openOutRepairHandle() {
      this.$emit('on-close')
      let detail_id = 5080, title = '车辆外修联系单'
      this.$router.push({
        path: `/news-details/${this.formData.out_repair_order_id}/${title}/${detail_id}`
      })
    },
    // 打开会签列表
    openCompletionList() {
      this.repairCompletionDialogShow = true
      this.$refs.repairCompletionDialog.loadData(this.formData.id)
    },
    // 给父级页面提供得获取本页数据
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs['elForm'].validate(valid => {
          if (!valid) {
            reject({
              result: 400,
              msg: '获取失败,带星号的为必填项'
            })
            return
          }
          resolve({ 
            formData: this.form,
            result:200,
            msg: '获取成功'

          })
        })
      })
    },
  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.long-lable {

}
.archives-info /deep/ .el-input{
  width: 150px;
}

.archives-info /deep/ .el-input--mini{
  width: 165px;
}

.long-lable /deep/ .el-form-item__label{
  width: 180px !important;
}
.long-lable /deep/ .el-form-item__content {
   width: 585px !important;
   margin-left: 0px !important;
}
</style>

