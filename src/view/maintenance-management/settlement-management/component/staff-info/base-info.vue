<template>
  <div class="archives-info" style="height:60vh;overflow-x:hidden">

  <div style="float:left;width: 6px;height: 16px; background: #409EFF;margin-top:10px"></div>
  <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;margin-top:10px">工单信息</p>
      <el-form ref="elForm" :model="formData" :rules="rules" size="mini" label-width="115px">
        <div class="show-flex-box-r">
          <el-col :span="8">
            <el-form-item label="工单号码:" prop="age">
              <p style="width:138px"> {{formData.work_code}}</p>
            </el-form-item>
          </el-col>
         <el-col :span="8">
            <el-form-item label="结算日期:" prop="age">
               <el-date-picker v-model="getformData.end_date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                :style="{width: '100%'}" placeholder="请选择日期" clearable :disabled="curChangeType == 'detail'"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item label="结算单位:" prop="group">
            <get-department-select
              ref="baseTree"
              :placeholder="'请选择结算单位'"
              :isShowCheckbox="false"
              v-model="getformData.dept_id"
            ></get-department-select>
          </el-form-item>
          </el-col>
        </div>
        <div class="show-flex-box-r">
          <el-col :span="8">
            <el-form-item label="自编号" prop="i_height">
              <p style="width:138px"> {{formData.vehicle_number}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车牌号:" prop="c_marry">
                <p style="width:138px"> {{formData.vehicle_name}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="8">
           <el-form-item label="车辆型号:">
             <p style="width:150px"> {{formData.vehicle_kind_name}}</p>
           </el-form-item>
          </el-col>
        </div>
        
        <div class="show-flex-box-r">
          <el-col :span="8">
            <el-form-item label="发动机编号:" prop="i_is_join_army">
              <p style="width:150px"> {{formData.vehicle_kind_name}}</p>
            </el-form-item>
          </el-col>
         <el-col :span="8">
           <el-form-item label="送修人:">
             <p style="width:138px"> {{formData.repair_user_name}}</p>
           </el-form-item>
          </el-col>
           <el-col :span="8">
           <el-form-item label="联系电话:">
             <!-- <p style="width:138px"> {{formData.repair_user_name}}</p> -->
           </el-form-item>
          </el-col>
        </div>

        <div class="show-flex-box-r">
           <el-col :span="8">
           <el-form-item label="报修分类:">
             <p style="width:138px"> {{formData.type_child_name}}</p>
           </el-form-item>
          </el-col>
        </div>
        <div style="float:left;width: 6px;height: 16px; background: #409EFF;"></div>
         <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;">费用信息</p>
       <div class="show-flex-box-r">
        <el-col :span="8">
          <el-form-item label="材料费:" prop="d_other_date">
            <!-- <p v-if="formData.repair_fee==null"></p> -->
            <p v- style="width:138px"> {{formData.total_materials ? formData.total_materials.toFixed(2) : 0.00}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="管理费:" prop="i_is_staff_representative">
           <el-input v-model="getformData.management" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="getformData.management = $event.target.value" placeholder="" clearable
                :style="{width: '100%'}" :disabled="curChangeType == 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="辅料费:" prop="d_be_elected">
            <el-input v-model="getformData.ingredients" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="getformData.ingredients = $event.target.value" placeholder="" clearable
                :style="{width: '100%'}" :disabled="curChangeType == 'detail'"></el-input>
          </el-form-item>
        </el-col>
       </div>
       <div class="show-flex-box-r">
        <el-col :span="8">
          <el-form-item label="工时费:" prop="c_be_elected_layer">
            <!-- <p v-if="formData.repair_fee==null"></p> -->
            <p  style="width:138px"> {{formData.total_hours_fees ? formData.total_hours_fees.toFixed(2) : 0.00}}</p>
            <!-- <el-input v-model="guanlifei"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="加班费:" prop="c_degree_of_education">
            <el-input v-model="getformData.overtime" oninput="value=value.replace(/[^\d.-]/g,'')" placeholder="" clearable
                :style="{width: '100%'}" :disabled="curChangeType == 'detail'" @blur="getformData.overtime = $event.target.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="施救费:" prop="c_degree_of_education">
            <el-input v-model="getformData.rescue_cost" oninput="value=value.replace(/[^\d.-]/g,'')" placeholder="" clearable
                :style="{width: '100%'}" :disabled="curChangeType == 'detail'" @blur="getformData.rescue_cost = $event.target.value"></el-input>
          </el-form-item>
        </el-col>
       </div>
       <div class="show-flex-box-r">
        <el-col :span="8">
          <el-form-item label="优惠:" prop="c_salary_card">
             <el-input v-model="getformData.sale" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="getformData.sale = $event.target.value" placeholder="" clearable
                :style="{width: '100%'}" :disabled="curChangeType == 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="优惠原因:" prop="c_social_card">
            <el-input v-model="getformData.sale_reason"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总费用:" prop="c_reserve_account">
             <p style="width:138px"> {{total}}</p>
          </el-form-item>
        </el-col>
        </div>
      
         <div style="float:left;width: 6px;height: 16px; background: #409EFF;"></div>
         <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;">支付信息</p>
         <div class="show-flex-box-r">
        <el-col :span="8">
          <el-form-item label="应收金额:" prop="c_salary_card">
            <p style="width:138px"> {{total}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实收金额:" prop="c_social_card">
             <el-input v-model="getformData.pay_fee" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="getformData.pay_fee = $event.target.value" placeholder="" clearable
                :style="{width: '100%'}" :disabled="curChangeType == 'detail'"></el-input>
          </el-form-item>
        </el-col>  
        <el-col :span="8">
          <el-form-item label="支付人:" prop="c_social_card">
            <el-select v-model="getformData.pay_way" placeholder="请选择支付人" clearable :style="{width: '100%'}" :disabled="curChangeType == 'detail'">
                <el-option v-for="(item, index) in politicalOptions" :key="index" :label="item.name"
                  :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        </div>
           <div class="show-flex-box-r">
        <el-col :span="8">
          <el-form-item label="结算方式:" prop="c_salary_card">
            <get-select-dictionaries ref="type_child" v-model="getformData.settlement" :classKey="'结算方式'" :placeholder="'请选择'"></get-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="8">
           <el-form-item label="是否支付:" prop="c_hometown">
              <el-checkbox true-label="2" false-label="1" v-model="getformData.is_pay" :disabled="curChangeType=='detail'||curChangeType=='checkout'" ></el-checkbox>
          </el-form-item>
        </el-col>  
        <el-col :span="8">
         <el-form-item label="是否返修:" prop="c_hometown">
               <el-checkbox true-label="2" false-label="1" v-model="getformData.is_back" :disabled="curChangeType=='detail'||curChangeType=='checkout'" ></el-checkbox>
          </el-form-item>
        </el-col>
        </div>
        <el-col :span="24">
          <el-form-item label="备注:" prop="c_hometown">
             <el-input v-model="getformData.remark" type="textarea" placeholder="请输入检验描述"
                :autosize="{minRows: 2, maxRows: 2}" :style="{width: '100%'}" ></el-input>
          </el-form-item>
        </el-col>

      </el-form>
  </div>
</template>
<script>
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getUserSelectTree from '@/components/base/formModel/tree/get-user-select-tree'
// import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getmaintaindep from "@/components/base/formModel/select/get-maintain-dep";
import getDepartmentSelect from "@/components/base/formModel/tree/get-dept-emp-select-tree";
export default {
  components: {getDepartmentSelect,getUserSelectTree,getDriverSelectTree,getmaintaindep,getSelectDictionaries},
  props: {
    curChangeType:{
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
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
        { value: "0", name: "未知" },
        { value: "1", name: "公司" },
        { value: "2", name: "个人" },
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
      getformData:{
        order_id:'',
        management:'0.00',
        ingredients:'0.00',
        overtime:'0.00',
        sale:'0.00',
        sale_reason:'',
        pay_fee:'0.00',
        pay_way:"0",
        rescue_cost:"0",
        settlement:'',
        is_pay:1,
        is_back:1,
        total:'0.00',
        remark:'',
        dept_id:'',
        end_date:'',
        id:'0',
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
        is_trailer:'',
        driver_name:'',
        type_child_name:'',
        repair_describe:'',
        imgs:[],
        receive_name:'',
        //
      },
      form:{
        state_child:0,
        budget_fee:'',
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
  computed: {
    total(){
      let one = this.getformData.management ? Number(this.getformData.management) : 0 //管理
      let two = this.getformData.ingredients ? Number(this.getformData.ingredients) : 0 //辅料
      let three = this.getformData.overtime ? Number(this.getformData.overtime) : 0 //加班
      let four = this.getformData.sale ? Number(this.getformData.sale) : 0 //优惠
      let six = this.getformData.total_hours_fees ? Number(this.getformData.total_hours_fees) : 0
      let five = this.getformData.total_materials ? Number(this.getformData.total_materials) : 0
      let total = one + two + three + six + five - four
      return total.toFixed(2)
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化数据
    resetData(){ 
      this.$refs['elForm'].resetFields()
      this.getformData.id = '0'
      this.staffAge = 0;
      this.getformData.management ='0.00'
      this.getformData.ingredients ='0.00'
      this.getformData.overtime ='0.00'
      this.getformData.sale ='0.00'
      this.getformData.sale_reason =''
      this.getformData.pay_fee = '0.00'
      this.getformData.pay_way = "0"
      this.getformData.settlement = '1297145'
      this.getformData.is_pay = '1'
      this.getformData.is_back = '1'
      this.getformData.total = '0'
      this.getformData.rescue_cost = '0'
      this.getformData.remark = ''
      this.getformData.dept_id = ''  
      this.getformData.end_date = ''
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
        if(val.repair_fee){
          this.getformData.id =val.repair_fee.id
          this.getformData.management =val.repair_fee.management
          this.getformData.ingredients =val.repair_fee.ingredients
          this.getformData.overtime =val.repair_fee.overtime
          this.getformData.sale =val.repair_fee.sale
          this.getformData.sale_reason =val.repair_fee.sale_reason
          this.getformData.pay_fee =val.repair_fee.pay_fee
          this.getformData.pay_way =val.repair_fee.pay_way.toString()
          this.getformData.settlement =val.repair_fee.settlement
          this.getformData.is_pay =val.repair_fee.is_pay.toString()
          this.getformData.is_back =val.repair_fee.is_back.toString()
          this.getformData.total =val.repair_fee.total
          this.total =val.repair_fee.total
          this.getformData.remark =val.repair_fee.remark
          this.getformData.dept_id =val.repair_fee.dept_id    
          this.getformData.end_date =val.repair_fee.end_date          
        }
        this.getformData.order_id = val.id
        this.getformData.rescue_cost = val.rescue_cost
        console.log(this.curChangeType)
      this.$client.getMaintRepairRecord({repair_id:val.repair_id})
          .then(res => {
            if (res.head.result == "200") {
              this.formData.is_trailer = res.context.is_trailer
              this.formData.repair_user_name = res.context.repair_user_name
              this.formData.repair_time = res.context.repair_time
              this.formData.driver_name = res.context.driver_name
              this.formData.type_child_name = res.context.type_child_name
              this.formData.repair_describe = res.context.repair_describe
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
     
    },
    // 给父级页面提供得获取本页数据
    getData() {
      console.log(this.total,'666')
      if(this.total){
        this.getformData.total = this.total  
      }
      if(this.getformData.dept_id==''){
           this.$message({
            showClose: true,
            message: "请填写结算单位",
            type: "success",
          });
          return
      }
       if(this.getformData.end_date==''){
        this.$message({
            showClose: true,
            message: "请填写结算日期",
            type: "success",
          });
          return
      }
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
            formData: this.getformData,
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

