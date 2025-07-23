<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="人员范围:">
          <el-select v-model="form.range" @change="selectedRange" placeholder="请选择">
            <el-option
              v-for="item in personnelRangeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门选择:" v-show="form.range == 1">
          <get-department-select
            v-if="form.range == 1"
            ref="orgTree"
            v-model="form.dept_id"
            :isShowCheckbox="false"
            :placeholder="'请选择部门'"
            :isContainEmp="false"
            :isExportMultiple="false"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="员工选择:" v-show="form.range == 2">
          <get-user-select
            v-if="form.range == 2"
            ref="personalTree"
            :show_all="true"
            v-model="form.user_indexs"
            :isShowCheckbox="true"
            :placeholder="'请选择员工'"
            :isContainEmp="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
            @on-change="onSelectChange"
          ></get-user-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item  v-if="$isPowerShow('export')">
          <el-button type="primary" icon="el-icon-download"  @click="onExport()">导出</el-button>
        </el-form-item>
        <el-form-item  v-if="$isPowerShow('import')">
          <el-button type="primary" @click="onImport('import')" icon="el-icon-download">导入</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="onSet()" v-if="$isPowerShow('rule')">加班调休规则</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getUserSelect from "@/components/base/formModel/tree/get-department-select-tree2";
export default {
  components: {
    getDepartmentSelect,
    getUserSelect
  },
  data() {
    return {
      minDate: new Date(),
      maxDate: new Date(),
      pickerOptions: {
        disabledDate:(time)=> {
          let front = new Date(this.minDate.getTime() - 86400000 * 31)
          let end = new Date(this.maxDate.getTime() + 86400000 * 31)
          // console.log(!(front < time && time < end), formatDateTime(front),formatDateTime(time),formatDateTime(end))
          return !(front < time && time < end);
        },
        onPick:(obj)=> {
          // console.log(obj)
          this.minDate = (!!obj && obj.minDate) || new Date()
          this.maxDate = (!!obj && obj.maxDate) || this.minDate
        }
      },
      leaveStaffData:[],
      personnelRangeOption: [ {
        value: 1,
        label: '部门选择'
      }, {
        value: 2,
        label: '员工选择'
      }],
      form: {
        range: 1,
        user_ids:[],
        dept_id:'',
      },
      user_indexs: [],
      isUpdate: false,
    };
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    onSelectChange(vehs, nodes) {
      if (vehs && vehs.length > 0) {
        this.form.user_ids = vehs.map(item => {
          return Number(item.split('_')[1])
        });
      } else {
        this.form.user_ids = []
      }
    },
    // 选择人员范围
    selectedRange(val) {
      this.form.dept_id = '';
      this.form.user_ids = [];
    },
    // 查询 
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      delete info.range
      if(!!info.user_ids && info.user_ids.length == 0) {
        delete info.user_ids
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      if(this.form.range == 1) {
        this.$refs.orgTree.onClear();
      }
      this.form.dept_id = '';
      this.form.user_ids = [];
      this.form.range = 1;
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    onExport() {
      this.$emit("on-export");     
    },
    onImport() {
      this.$emit("on-import");     
    },
    onSet() {
      this.$emit("on-set");     
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
