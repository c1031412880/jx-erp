<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="关键字">
      <el-tooltip class="item" effect="dark" content="模糊搜索合同编号、收款单位、第三方单位名称、合同备案号/名称、合同名称" placement="top-start">
        <el-input v-model="form.content" placeholder="模糊搜索合同编号、收款单位、第三方单位名称、合同备案号/名称、合同名称"></el-input>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="合同状态" v-show="bigBoxName !== 'third'">
      <el-select v-model="form.contract_state" placeholder="请选择合同状态">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.label">
        </el-option>  
      </el-select>
    </el-form-item>
    <el-form-item label="签订日期">
      <el-date-picker
        v-model="qdDate"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="onQdChange"
        :picker-options="qdPickerOptions">
      </el-date-picker>
    </el-form-item>
    <!-- <el-form-item label="预计完结日期">
      <el-date-picker
        v-model="wjDate"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="onWjChange"
        :picker-options="wjPickerOptions">
      </el-date-picker>
    </el-form-item> -->
    <el-form-item label="经办部门">
      <!-- <el-select v-model="form.handler_dept_names" multiple clearable collapse-tags placeholder="请选择经办部门">
        <el-option
          v-for="item in deptOptions"
          :key="item"
          :label="item"
          :value="item">
        </el-option>  
      </el-select> -->
      <el-input v-model="form.handler_dept_names" placeholder="请输入经办部门"></el-input>
    </el-form-item>
    <el-form-item label="经办人">
      <el-input v-model="form.handler_name" placeholder="请输入经办人"></el-input>
    </el-form-item>
    <el-form-item label="完结日期" v-show="bigBoxName === 'third'">
      <el-date-picker
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="选择完结日期"
        v-model="form.completionDate"
        style="width: 100%;">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="提醒部门" v-show="bigBoxName === 'third'">
      <get-department-select-tree
        ref="personalTree1"
        v-model="form.handleDept"
        :isShowCheckbox="true"
        :placeholder="'请选择提醒部门'"
        :isContainEmp="false"
        :show_all="false"
        :isExportMultiple="true"
        :isCheckStrictly="false"
      ></get-department-select-tree>
    </el-form-item>
    <el-form-item></el-form-item>
    <el-form-item label="合同金额">
      <el-input-number v-model="form.contract_fee" :controls="false" :min="0" label="描述文字"></el-input-number>
      <span> ~ </span>
      <el-input-number v-model="form.contract_end_fee" :controls="false" :min="form.contract_fee" label="描述文字"></el-input-number>
    </el-form-item>
    <el-form-item label="导入部门">
      <get-department-select-tree
        ref="personalTree1"
        v-model="form.dept_ids"
        :isShowCheckbox="true"
        :placeholder="'请选择导入部门'"
        :isContainEmp="false"
        :show_all="false"
        :isExportMultiple="true"
        :isCheckStrictly="false"
      ></get-department-select-tree>
    </el-form-item>
    <el-form-item label="导入人">
      <get-department-select-tree
        ref="personalTree2"
        v-model="form.user_ids"
        :isShowCheckbox="true"
        :placeholder="'请选择导入人'"
        :isContainEmp="true"
        :isExportMultiple="true"
        :isCheckStrictly="false"
      ></get-department-select-tree>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-refresh-right" @click="resetForm()">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-popover
        placement="top"
        v-if="$isPowerShow('import') && bigBoxName === 'second'"
        v-model="visible">
        <el-radio v-model="radio" :label="1">普通</el-radio>
        <el-radio v-model="radio" :label="2">框架</el-radio>
        <div style="text-align: right; margin: 20px 0 0 0">
          <el-button size="mini" type="text" @click="visible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="onBtn('import')">确定</el-button>
        </div>
        <el-button type="primary" slot="reference">导入</el-button>
      </el-popover>
      <!-- <el-button type="primary" icon="el-icon-download" v-if="$isPowerShow('import') && bigBoxName === 'second'" @click="onBtn('import')">导入</el-button> -->
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-upload2" v-if="$isPowerShow('export')" @click="onBtn('export')">导出</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-s-tools" v-if="$isPowerShow('set') && bigBoxName === 'third' && activeName === 'first'" @click="onBtn('set')">提醒规则设置</el-button>
    </el-form-item> 
  </el-form>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getDepartmentSelectTree from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: { getDepartmentSelectTree },
  props: {
    bigBoxName: {
      type: String,
      default: "second",
    },
    activeName: {
      type: String,
      default: "first",
    },
  },
  data() {
    return {
      visible: false,
      radio: 1,
      qdDate: [],
      wjDate: [],
      form: {
        menu_code: 9120000,
        content: '',
        contract_state: '',
        sign_time: "",
        sign_end_time: "",
        expected_date: "",
        expected_end_date: "",
        handler_dept_names: '',
        dept_ids: [],
        handleDept: [],
        user_ids: [],
        handler_name : '',
        completionDate : '',
        contract_fee: 0,
        contract_end_fee: 0,
      },
      options: [
        {value: 0, label: '全部'},
        {value: 1, label: '履约中'},
        {value: 2, label: '即将完结'},
        {value: 3, label: '已完结'},
      ],
      deptOptions: [],
      qdPickerMinDate: null,
      qdPickerMaxDate: null,
      wjPickerMinDate: null,
      wjPickerMaxDate: null,
    }
  },
  computed: {
    qdPickerOptions() {
      const  _this = this;
      return {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()]);
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }],
        //点击时间回调
        onPick:({maxDate,minDate})=>{
          if(minDate){
            let currentYear = minDate.getFullYear()
            _this.qdPickerMinDate = new Date(minDate).setFullYear(currentYear-1)
            _this.qdPickerMaxDate = new Date(minDate).setFullYear(currentYear+1)
          }
        },
        //禁用时间 打开选择器就调用
        disabledDate:(time)=> {
          if(_this.qdPickerMinDate!=null){
            //点击月份后只允许选前后1年的时间
            //return true是禁用
            return time.getTime() < _this.qdPickerMinDate || _this.qdPickerMaxDate < time.getTime()
          }
        },
      }
    },
    wjPickerOptions() {
      const  _this = this;
      return {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()]);
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }],
        //点击时间回调
        onPick:({maxDate,minDate})=>{
          if(minDate){
            let currentYear = minDate.getFullYear()
            _this.wjPickerMinDate = new Date(minDate).setFullYear(currentYear-1)
            _this.wjPickerMaxDate = new Date(minDate).setFullYear(currentYear+1)
          }
        },
        //禁用时间 打开选择器就调用
        disabledDate:(time)=> {
          if(_this.wjPickerMinDate!=null){
            //点击月份后只允许选前后1年的时间
            //return true是禁用
            return time.getTime() < _this.wjPickerMinDate || _this.wjPickerMaxDate < time.getTime()
          }
        },
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getDepartmentList()
      this.onSetTime()
      this.onSubmit()
    })
  },
  methods: {
    // 获取部门列表
    getDepartmentList() {
      let params = {}
      params.type =  this.activeName === 'first' ? 1 : 2
      this.$client.GetAllHandlerDeptErpContractRemind(params)
      .then(res => {
        if (res.head.result == "200") {
          this.deptOptions = res.context;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 初始化时间
    onSetTime() {
      let timeYearObj = getDate('lastOneYear')
      // let timeMonthObj = getDate('lastOneMonth')
      this.qdDate = this.$addTime([timeYearObj.startTime, timeYearObj.endTime])
      // this.wjDate = this.$addTime([timeMonthObj.startTime, timeMonthObj.endTime])
      this.form.sign_time = this.qdDate[0]
      this.form.sign_end_time = this.qdDate[1]
      // this.form.expected_date = this.wjDate[0]
      // this.form.expected_end_date = this.wjDate[1]
    },
    onQdChange(val) {
      if(!val) {
        this.qdPickerMinDate = null
        this.qdPickerMaxDate = null
        this.form.sign_time = ''
        this.form.sign_end_time = ''
      }else {
        this.form.sign_time = val[0]
        this.form.sign_end_time = val[1] + ' 23:59:59'
      }
    },
    onWjChange(val) {
      if(!val) {
        this.wjPickerMinDate = null
        this.wjPickerMaxDate = null
        this.form.expected_date = ''
        this.form.expected_end_date = ''
      }else {
        this.form.expected_date = val[0]
        this.form.expected_end_date = val[1] + ' 23:59:59'
      }
    },
    onSubmit() {
      let info = {}
      for(let key in this.form) {
        if(this.form[key]) info[key] = this.form[key]
      }
      this.$emit("on-ok", info);
    },
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.getDepartmentList()
      this.onSetTime()
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 500);
    },
    onBtn(type) {
      this.$emit('on-' + type, this.radio)
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>