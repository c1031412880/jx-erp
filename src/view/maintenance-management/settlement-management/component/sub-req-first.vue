<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-select v-model="form.date_type"  placeholder="日期状态" style="width:100px">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择日期范围"
            end-placeholder="请选择日期范围"
            @change="selectedTime"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工单号码：">
          <el-input v-model="form.work_code" placeholder="请输入工单号码" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="车辆型号：">
        <el-select v-model="form.veh_type" clearable placeholder="车辆型号">
            <el-option
              v-for="item in vehTypeData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报修车辆：">
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          >
          </get-vehicle-select-tree> -->
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids	"
          >
          </get-vehicle-select-dialog>
        </el-form-item>
        <el-form-item label="维修车间：" >
          <getmaintaindep v-model="form.maint_dept" :init="false" placeholder="选择维修车间"></getmaintaindep>
        </el-form-item>
        <el-form-item label="工单类别：">
          <get-select-dictionaries ref="type_child" :accidentType="true" v-model="form.type_child" :classKey="'报修类别'" :placeholder="'请选择'"></get-select-dictionaries>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button  @click="Reset" icon="el-icon-refresh-left"
            >重置</el-button
          >
        </el-form-item>
          <!-- <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" v-if="$isPowerShow('add')"
            >添加员工</el-button
          >
        </el-form-item> -->
        <!-- <el-form-item>
          <el-button @click="onBtn('import')" icon="el-icon-upload2" v-if="$isPowerShow('import')"
            >导入</el-button
          >
        </el-form-item> -->
        <el-form-item>
          <el-button @click="onBtn('export')" v-if="$isPowerShow('export')" icon="el-icon-download" 
            >导出</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="deleteSelect()" v-if="$isPowerShow('settlement')" type="primary">确认结算</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="deleteSelect1()" v-if="$isPowerShow('settlement')" type="primary">结算退回</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-download"  v-if="$isPowerShow('printStatement')" @click="printStatement()" type="primary">导出结算单</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="onBtn('screen')"
            >高级筛选</el-button
          >
        </el-form-item>  
          <div style="float: right; height: 20px; display: flex">
          <i
            class="el-icon-refresh"
            style="margin-right: 15px; cursor: pointer"
            @click="refreshTableList()"
          ></i>
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div>
      </el-row>
    </el-form>
  
  </div>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getPositionList from "@/components/base/formModel/select/get-position-list";
import getmaintaindep from "@/components/base/formModel/select/get-maintain-dep";
import { getDate } from "@/utils/index";
export default {
  components: { getDepartmentSelect, getPositionList,getVehicleSelectTree,getVehicleSelectDialog,getSelectDictionaries,getmaintaindep},
  data() {
    return {
      vehTypeData:[],
      activeIndex: '1',
      options:[
        {value: '1', label: '报修日期',},
        {value: '2', label: '接修日期',},
        {value: '3',label: '完工日期',},
        {value: '4',label: '出厂日期',}
      ],
      isContainEmp: false, //是否显示部门下的人员
      departmentList:[], //部门
      priorityList:[ //工种属性
        { value: "1", name: "一般" },
        { value: "2", name: "紧急" },
        { value: "3", name: "非常紧急" },
      ],
      staffStatusOptions:[ //状态
        { value: "正式", label: "一般维修", 
        children: [{
              value: 'yizhi',
              label: '一保'
            }, {
              value: 'fankui',
              label: '二保'
            }, {
              value: '2',
              label: '回厂小修'
            }, {
              value: '3',
              label: '白天抢修'
            },{
              value: '5',
              label: '夜间抢修'
            },
            {
              value: '4',
              label: '三包服务'
            }
            ]},
        { value: "借用", label: "借用" },
        { value: "停薪留职", label: "停薪留职" },
        { value: "长假", label: "长假" },
        { value: "内退", label: "内退" },
      ],
      jobOptions: [ //岗位
        
      ],
      employmentFormOptions: [ //用工形式
        { value: "全日制", name: "全日制" },
        { value: "全日制外地就业", name: "全日制外地就业" },
        { value: "方正派遣工", name: "方正派遣工" },
        { value: "汇才派遣工", name: "汇才派遣工" },
        { value: "返聘", name: "返聘" },
      ],
      date: [],
      form: {
        maint_dept:'',
        vehicle_ids:'',
        priority:'',
        date_type:'1',
        work_code:"",
        type_child:'',
        state:'',
        state_child:'',
        // i_department_base: [],
        // c_work_kind: "",
        // c_job_type: "",
        // i_position_id: "",
        // c_employee_type: "",
        start_date: "",
        end_date: "",
      },
    };
  },
  mounted() {
    this.getVehType()
    this.onSetTime()
  },
  methods: {
    onSetTime() {
      let timeObj = getDate('lastOneWeek')
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.start_date = this.date[0]
      this.form.end_date = this.date[1]
      console.log(this.date)
    },
   getVehType(){
      this.vehTypeData = []
      this.$client.GetCarModelVehicleManager({}).then(req => {
        if (req.head.result === '200') {
          this.vehTypeData = req.context.list
        }
      })
    },
      handleSelect(key, keyPath) {
        this.form.state_child = ''
        console.log(key, keyPath);
        this.form.state = key
        if(keyPath.length>1){
          this.form.state = 1
          this.form.state_child = key
        }
        // this.form.state_child = keyPath
        this.onSubmit()
      },
    deleteSelect() {
      this.$emit("delete-select");
    },
    deleteSelect1() {
      this.$emit("delete-select1");
    },
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.start_date = this.date[0];
        this.form.end_date = `${this.date[1]} 23:59:59`
      } else {
        this.form.start_date = "";
        this.form.end_date = "";
      }
      console.log(this.form.end_date)
    },
    onSelectChange(vehs, nodes) {
      // alert(JSON.stringify(nodes))
      if (nodes && nodes.length > 0) {
        // nodes.forEach((item, index) => {
        //   delete item.children;
        // });
        // this.ruleForm.reminders = nodes;
      } else {
        // this.ruleForm.reminders = [];
      }
    },

    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      // if(info.i_department_base.length == 0) {
      //   delete info.i_department_base
      // }
      // if(this.form.i_position_id === 0) {
      //   info.i_position_id = 0
      // }
      // console.log(info)
      // return
      this.$emit("on-ok", info);
    },
    refreshTableList() {
      this.Reset()
    },
    // 重置
    Reset(){
      this.form.maint_dept = '',
      this.form.vehicle_ids = '',
      this.form.priority = '',
      this.form.date_type = '1',
      this.form.work_code = '',
      this.form.type_child = '',
      this.form.veh_type = ''
      // this.form.start_date = '',
      // this.form.end_date = '',
      this.onSetTime()
      // this.date = [],
      // 清空部门选中

      // this.$refs.vehicleTree.onClear()
    console.log(this.form.type_child,'13')
      this.onSubmit()
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
    // 打印结算单
    printStatement() {
      this.$emit('on-print-statement')
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
