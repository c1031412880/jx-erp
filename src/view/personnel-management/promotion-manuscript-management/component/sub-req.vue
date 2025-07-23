<template>
  <div v-cloak>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item label="标题:" prop="name">
         <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="录用时间:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="level" label="报送类别:"> 
          <el-select v-model="form.type_name" placeholder="请选择">
            <el-option label="宣传" value="宣传"></el-option>
            <el-option label="信息" value="信息"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <get-department-select
            ref="departmenTree"
            v-model="form.dept_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择部门'"
            :isContainEmp="false"
            :isExportMultiple="true"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-popconfirm
            @confirm="onBtn('delete')"
            title="确定删除选中的宣传稿件吗？">
            <el-button slot="reference" type="primary" icon="el-icon-delete" size="mini" v-if="$isPowerShow('del')">删除</el-button>
          </el-popconfirm>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onBtn('import')" v-if="$isPowerShow('import')" icon="el-icon-download">导入</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('export')" v-if="$isPowerShow('export')" icon="el-icon-download">导出</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('auditing')" v-if="$isPowerShow('auditing')">审核</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('deApproval')" v-if="$isPowerShow('deApproval')">反审核</el-button>
        </el-form-item> -->


        <el-form-item>
          <el-button type="primary" @click="onBtn('fee')" v-if="$isPowerShow('fee')">稿费设置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries';
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import { getDate } from "@/utils/index";
export default {
  props:{
  },
  components: { getSelectDictionaries, getDepartmentSelect},
  data() {
    return {
      date:[],
      form: {
        name:'',
        start_date:'',
        end_date:'',
        type_name:'',
        dept_ids: [],
      },
    };
  },
  mounted() {
    this.onSetTime();
  },
  methods: {
    // 初始化时间
    onSetTime(type = "lastOneYear") {
      let timeObj = getDate(type);
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
      this.form.start_date = this.date[0];
      this.form.end_date = this.date[1];
    },
    // 修改时间
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.start_date = this.date[0];
        this.form.end_date = this.date[1] + ' 23:59:59'
      } else {
        this.form.start_date = "";
        this.form.end_date = "";
      }
    },
    // 查询
    onSubmit() {
      let info = {...this.form};
      this.$emit("on-ok", info);
    },
    // 添加编辑
    onBtn(com) {
      this.$emit("on-add", com);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
