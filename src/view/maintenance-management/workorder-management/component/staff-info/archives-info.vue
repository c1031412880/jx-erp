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
  
      <!-- <el-step title="进厂检验通过" description=""></el-step>
      <el-step title="待接修" description=""></el-step>
      <el-step title="待完工检验" description=""></el-step>
      <el-step title="待出厂" description=""></el-step> -->
    </el-steps>
  <div style="float:left;width: 6px;height: 16px; background: #409EFF;margin-top:10px"></div>
  <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;margin-top:10px">工单信息</p>
      <el-form ref="elForm" :model="formData" :rules="rules" size="mini" label-width="130px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="工单号码:" prop="age">
              <p style="width:138px"> {{formData.work_code}}</p>
            </el-form-item>
          </el-col>
            <el-col :span="8">
            <el-form-item label="工单状态:" prop="c_health_state" style="margin:0px;display:inline-block;" >
              <div class="show-flex-box-r">
                <span> {{formData.state_name}}</span>
                <div v-if="formData.state==2">
                  <get-select-dictionaries v-model="form.state_child" :classKey="'维修中'" :placeholder="'请选择状态'" :disabled="curChangeType == 'detail'"></get-select-dictionaries>
                </div>
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
               <el-date-picker v-model="form.plan_finish" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                :style="{width: '100%'}" placeholder="请选择日期" clearable :disabled="curChangeType == 'detail'"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
           <el-form-item label="维修车间:">
             <p style="width:138px"> {{formData.maint_dept_name}}</p>
              <!-- <getmaintaindep v-model="form.maint_dept" placeholder="选择维修车间" disabled></getmaintaindep> -->
           </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调度员:" prop="i_is_join_army">
             <!-- <get-user-select-tree :disabled="curChangeType == 'detail'"
              :isShowCheckbox="false"
              :placeholder="'请选择驾驶员'"
              :isExportMultiple="false"
             ></get-user-select-tree> -->
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
            <!-- <el-form-item label="关联施救车派工单:" prop="rescue_flow_code">
              <el-button type="text" @click="checkApply(formData.rescue_flow_id)">{{formData.rescue_flow_code}}</el-button>
            </el-form-item> -->
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
              :preview-src-list="formData.imgs"
              :src="item"
              ></el-image>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="formData.type_child == -1">
          <el-col :span="8">
            <el-form-item label="关联事故编号:" prop="c_accident_code">
              <p style="width:138px"> {{formData.c_accident_code}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="事故日期:" prop="d_accident_date">
              <p style="width:138px"> {{formData.d_accident_date}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="事故责任:" prop="accident_duty">
              <p style="width:138px"> {{formData.accident_duty}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="定损金额:" prop="n_actual_fee">
              <p style="width:138px"> {{formData.n_actual_fee}}</p>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="车辆受损情况:" prop="c_describe">
              <p style="width:138px"> {{formData.c_describe}}</p>
            </el-form-item>
          </el-col> -->
          <el-col :span="16">
            <el-form-item label="事故经办人:" prop="agent">
              <p style="width:138px"> {{formData.agent}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车辆受损情况:" prop="c_describe">
               <el-input v-model="formData.c_describe" type="textarea" placeholder="车辆受损情况描述"
                :autosize="{minRows: 2, maxRows: 2}" :style="{width: '100%'}" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="formData.type_child == 959687 || formData.type_child == 959688">
          <el-col :span="16">
            <el-form-item label="关联保养计划:" prop="upkeep_name">
              <p> {{formData.upkeep_name}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保养计划日期:" prop="plan_date">
              <p> {{formData.plan_date}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保养类型:" prop="upkeep_type_name">
              <p> {{formData.upkeep_type_name}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最近保养日期:" prop="last_keep_time">
              <p> {{formData.last_keep_time}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保养周期里程:" prop="time_mile">
              <p> {{formData.time_mile}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="修理工:" prop="repair_person_names">
              <p> {{formData.repair_person_names}}</p>
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
          <el-col :span="8">
            <el-form-item label="预估金额:" prop="estimate_amount">
              <el-input
                v-model="checkform.estimate_amount"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.estimate_amount = $event.target.value"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="大额维修申请:" v-show="checkform.limit_repair_flow_code">
            <el-button type="text" @click="openDispatchHandle(checkform.limit_repair_order_id)">{{checkform.limit_repair_flow_code}}</el-button>
          </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审批状态:" v-show="checkform.limit_repair_flow_code">
            <span>{{checkform.authorization_state}}</span>
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
          <el-col :span="8">
            <el-form-item label="分公司验收人:" prop="c_social_card">
              <p style="width:138px"> {{formData.check_person_name}}</p>
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
            <!-- <p v-if="formData.repair_fee==null"></p> -->
              <p  style="width:138px"> {{formData.total_materials}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工时费（元）:" prop="c_social_card">
              <!-- <p v-if="formData.repair_fee==null"></p> -->
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
              <p >{{formData.total_hours}}</p>
              <!-- <p style="width:138px"> {{formData.repair_fee.}}</p> -->
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
              <p v-else style="width:138px"> {{formData.repair_fee.total}}</p>
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
  components: {repairCompletionDialog,getUserSelect,getDepartmentSelect,getUserSelectTree,getDriverSelectTree,getmaintaindep,getSelectDictionaries},
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
      checkform:{
        check_name:'',
        check_time:'',
        check_describe:'',
        estimate_amount:'',
        limit_repair_flow_code:'',
        limit_repair_order_id:'',
        authorization_state:'',
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
        rescue_flow_id: '',
        rescue_flow_code: '',
        driver_name:'',
        type_child:'',
        type_child_name:'',
        repair_describe:'',
        imgs:[],
        receive_name:'',
        //事故信息
        n_actual_fee:'',
        c_describe: '',
        c_accident_code: '',
        d_accident_date:'',
        accident_duty:'',
        agent: '',
        // 保养计划信息
        upkeep_name:'',
        plan_date: '',
        upkeep_type_name: '',
        time_mile:'',
        last_keep_time:'',
        repair_person_names: '',
        rescue_cost: '',
        out_repair_flow_id: '',
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
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    
  },
  methods: {
    // 初始化数据
    resetData(){ 
      this.$refs['elForm'].resetFields()
      this.$refs.driverTree1.onClear();
      this.form.budget_fee = '0'
    },
    // 数据回显
    setData(val){
      this.formData = Object.assign({}, val)
      this.$client.getMaintRepairRecord({repair_id:val.repair_id}).then(res => {
        if (res.head.result == "200") {
          this.formData.rescue_flow_id = res.context.rescue_flow_id
          this.formData.rescue_flow_code = res.context.rescue_flow_code
          this.formData.repair_user_name = res.context.repair_user_name
          this.formData.repair_time = res.context.repair_time
          this.formData.driver_name = res.context.driver_name
          this.formData.type_child = res.context.type_child
          this.formData.type_child_name = res.context.type_child_name
          this.formData.repair_describe = res.context.repair_describe
          this.formData.repair_address = res.context.repair_address
          this.formData.repair_address_id = res.context.repair_address_id
          this.formData.is_trailer = res.context.is_trailer
          this.formData.imgs = res.context.imgs
          // 获取保养计划信息
          if(res.context.type_child == 959687 || res.context.type_child == 959688) {
            this.reqUpkeepPlan(res.context.plan_id,res.context.type_child)
          }
          // 获取事故信息
          if(res.context.type_child == -1 && !!res.context.accident_id) {
            this.reqAccidentRedcord(res.context.accident_id)
          }
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
      this.checkform.estimate_amount = val.repair_check.estimate_amount
      this.checkform.limit_repair_flow_code = val.repair_check.limit_repair_flow_code
      this.checkform.limit_repair_order_id = val.repair_check.limit_repair_order_id
      this.checkform.authorization_state = val.repair_check.authorization_state
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

    // 获取保养计划信息
    reqUpkeepPlan(plan_id,type_child) {
      this.formData.upkeep_name = ''
      this.formData.plan_date = ''
      this.formData.upkeep_type_name = ''
      this.formData.time_mile = ''
      this.formData.last_keep_time = ''
      this.formData.repair_person_names = ''
      if(!!plan_id) {
        this.$client.getUpkeepPlan({ids:plan_id}).then(res => {
          if(res.head.result === '200') {
            if(!!res.context.list && res.context.list.length) {
              let plaInfo = res.context.list[0]
              this.formData.upkeep_name = plaInfo.lp_num + plaInfo.plan_date
              this.formData.plan_date = plaInfo.plan_date
              this.formData.upkeep_type_name = plaInfo.upkeep_type_name
              this.formData.time_mile = plaInfo.time_mile
              this.formData.last_keep_time =  type_child == 959687 ? plaInfo.last_keep_time : plaInfo.last_keep_time2
              this.formData.repair_person_names = plaInfo.repair_person_names
              this.$forceUpdate()
            }
            
          }
        }).catch((err) => {});
      }
      
    },
    // 获取事故信息
     reqAccidentRedcord(id) {
      this.formData.c_accident_code = ''
      this.formData.d_accident_date = ''
      this.formData.accident_duty = ''
      this.formData.agent = ''
      this.$client.getAccidentRecordList({
        i_id: id
      }).then((res) => {
        if (res.head.result == "200") {
          if(res.context.list.length) {
            let dataList = res.context.list[0];
            this.formData.c_accident_code = dataList.c_accident_code
            this.formData.d_accident_date = dataList.d_accident_date
            this.formData.accident_duty = dataList.accident_duty
            this.formData.agent = dataList.agent
          }
          
          this.reqDamageRecordList(id)
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {});
    },
     // 获取车损记录 然后获取定损金额和车辆受损情况
    reqDamageRecordList(data) {
      this.formData.n_actual_fee = ''
      this.formData.c_describe = ''
      let parmas = {
        i_id: data
      }
      this.$client.getDamageRecordList(parmas)
        .then(res => {
          if (res.head.result == "200") {
            let list = res.context.list;
            if(!!list && list.length > 0) {
              list.forEach(element => {
                if(element.i_type == 2) {
                  this.formData.n_actual_fee = element.n_actual_fee || ''
                  this.formData.c_describe = element.c_describe || ''
                  this.$forceUpdate()
                }
              });
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
    },
    // 打开施救车派工单
    checkApply(id) {
      let detail_id = 1650, title = '施救车派工单'
      this.$router.push({
        path: `/news-details/${id}/${title}/${detail_id}`
      })
    },
    // 打开大额维修审批单
    openDispatchHandle(id) {
      this.$emit('on-close')
      let detail_id = 1660, title = '大额维修审批单'
      this.$router.push({
        path: `/news-details/${id}/${title}/${detail_id}`
      })
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

