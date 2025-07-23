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
        <!-- <el-form-item label="优先级：">
          <el-select v-model="form.priority" clearable placeholder="选择优先级">
            <el-option
              v-for="item in priorityList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item  label="报修车辆：">
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
            width="360"
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
          <getmaintaindep v-model="form.maint_dept" :width="'160px'" :init="false" placeholder="选择维修车间"></getmaintaindep>
        </el-form-item>
        <el-form-item label="工单类别：">
          <get-select-dictionaries 
            ref="type_child" 
            v-model="form.type_child" 
            :width="'160px'" 
            :classKey="'报修类别'" 
            :placeholder="'请选择'"
            :accidentType="true"
          ></get-select-dictionaries>
        </el-form-item>
        <!-- <el-form-item label="维修人员:">
          <get-department-select
            ref="personalTree"
            v-model="form.person_ids"
            :show_all="false"
            :isShowCheckbox="true"
            :placeholder="'请选择维修人员'"
            :isContainEmp="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
          ></get-department-select>
        </el-form-item> -->
        <el-form-item label="维修组织:">
          <el-select v-model="form.shop_id" style="width:160px;" placeholder="请选择">
            <el-option
              v-for="item in shopidlist"
              :key="item.value"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
        <!-- <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item> -->
        <!-- <el-form-item>
          <el-button icon="el-icon-download"  v-if="$isPowerShow('printStatement')" @click="printStatement('export')" type="primary">导出结算单</el-button>
        </el-form-item> -->
        <!-- <el-form-item>
          <el-button icon="el-icon-thumb"  v-if="$isPowerShow('printStatement')" @click="printStatement('print')" type="primary">打印结算单</el-button>
        </el-form-item> -->
        <el-form-item v-if="$isPowerShow('invalid') || $isPowerShow('del')">
          <el-dropdown @command="handleCommand">
            <el-button  size="mini" class="btn">
              更多操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="delete" size="mini" v-if="$isPowerShow('del')">删除</el-dropdown-item>
              <el-dropdown-item command="invalid" size="mini" v-if="$isPowerShow('invalid')">作废</el-dropdown-item>
              <el-dropdown-item command="export" size="mini" v-if="$isPowerShow('export')">导出</el-dropdown-item>
              <el-dropdown-item command="complete" size="mini" v-if="$isPowerShow('complete')">批量完工</el-dropdown-item>
              <el-dropdown-item command="print-statement" size="mini" v-if="$isPowerShow('printStatement')">导出结算单</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </el-form-item>
        <!-- <el-form-item>
          <el-button type="text" @click="onBtn('screen')"
            >高级筛选</el-button
          >
        </el-form-item> -->
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
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">全部</el-menu-item>
            <el-menu-item index="2" >待接修</el-menu-item>
            <el-submenu index="3">
              <template slot="title">维修中</template>
              <el-menu-item index="3">维修中</el-menu-item>
              <el-menu-item 
                v-for="(item,index) in manageList"
                :key="item.c_code"
                :index="item.c_code.toString()"
              >{{item.c_name}}</el-menu-item>
              <!-- <el-menu-item index="1146019">等厂家</el-menu-item>
              <el-menu-item index="1146037">尾气检测</el-menu-item>
              <el-menu-item index="1146038">等配件</el-menu-item>
              <el-menu-item index="1383683">完工未通过</el-menu-item>
              <el-menu-item index="91813">转外修</el-menu-item> -->
            </el-submenu>
              <el-menu-item index="4" >待完工检验</el-menu-item>
            <!-- <el-badge :value="200" :max="99" >
             <el-menu-item index="4" >待完工检验</el-menu-item>
            </el-badge>   -->
            <el-menu-item index="5" >待出厂</el-menu-item>
            <el-menu-item index="6" >已出厂</el-menu-item>
            <el-menu-item index="8" >已作废</el-menu-item>
            <!-- <el-submenu index="7">
              <template slot="title">更多</template>
              <el-menu-item index="7-1">已作废</el-menu-item>
              <el-menu-item index="7-2">完工未通过</el-menu-item>
            </el-submenu> -->
          </el-menu>
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
        ids: [],
        shop_id: '',
      },
      isActivated: false,
      shopidlist: [],
      manageList: [],
    };
  },
  activated() {
    if(this.isActivated) {
      let ids = this.$route.params.ids
      if(ids) {
        let info = [ ids ]
        this.form.ids = info
        this.onSubmit()
      } else {
        this.onSetTime()
        let orderId = this.$route.params.orderId
        if (orderId) {
          this.form.work_code = orderId
        }
        if(!!this.$route.params.start_date) {
          this.form.start_date = this.$route.params.start_date
          this.form.end_date = this.$route.params.end_date
          this.date = [this.form.start_date,this.form.end_date.slice(0,10)]
        }
        if(orderId && !!this.$route.params.start_date) {
          this.onSubmit()
        }
      }
    }
  },
  created() {
    // 获取维修中字典
    this.getManagementType()
  },
  mounted() {
    this.getMaintDeptGetShop()
    
    let ids = this.$route.params.ids
    if(ids) {
      let info = [ ids ]
      this.form.ids = info
      this.onSubmit()
    } else {
      this.onSetTime()
      let orderId = this.$route.params.orderId
      if (orderId) {
        this.form.work_code = orderId
      }
      if(!!this.$route.params.start_date) {
        this.form.start_date = this.$route.params.start_date
        this.form.end_date = this.$route.params.end_date
        this.date = [this.form.start_date,this.form.end_date.slice(0,10)]
      }

      this.onSubmit('del')
    }
    this.$nextTick(() =>{
      this.isActivated = true
    })
  },
  methods: {
    // 获取维修中字典
    getManagementType() {
      this.$client.getDictionaryDataBase({context:['repairing']}).then(req => {
        if (req.head.result === '200') {
          if (req.context.length) {
            this.manageList = req.context[0].dic_detls;
          }
        }
      })
    },
    getMaintDeptGetShop() {
      this.$client.getMaintDeptGetShop({})
        .then(res => {
          if (res.head.result == "200") {
            this.shopidlist = res.context
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
    },
    onSetTime(type = 'lastOneWeek') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.start_date = this.date[0]
      this.form.end_date = this.date[1]
      console.log(this.date)
    },
    handleSelect(key, keyPath) {
      this.form.state_child = ''
      console.log(key, keyPath);
      if(keyPath[1]>3){
        this.form.state = 2
        this.form.state_child = key
      }else{this.form.state = key-1 }
      // this.form.state_child = keyPath
      this.onSubmit()
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

    onSubmit(val) {
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
      if(val && this.form.ids.length) {
        this.form.ids = []
      }
      this.$emit("on-ok", info);
    },
    refreshTableList() {
      this.Reset()
    },
    // 重置
    Reset(){
      this.form.maint_dept = ''
      this.form.vehicle_ids = ''
      this.form.priority = ''
      this.form.date_type = ''
      this.form.work_code = ''
      this.form.type_child = ''
      this.form.start_date = ''
      this.form.end_date = ''
      this.form.shop_id = ''
      this.date = []
      // 清空部门选中

      // this.$refs.vehicleTree.onClear()

      this.onSubmit()
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
    // 打印结算单
    printStatement(type) {
      this.$emit('on-print-statement',type)
    },
    handleCommand(command) {
      this.$emit("on-" + command);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
