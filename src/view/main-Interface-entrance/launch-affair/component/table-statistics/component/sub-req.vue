<template>
  <div v-loading="loading">
    <el-form :inline="true" size="mini">
      <template v-for="(item,index) in querysData">
        <el-form-item :label="item.label" :key="index" v-if="item.type == 1">
          <el-input v-model="form[item.field]" clearable :placeholder="`请输入${item.label}`"></el-input>
        </el-form-item>
        <el-form-item :label="item.label" :key="index" v-if="item.type == 2">
          <el-date-picker
            v-if="item.pub_field == 3"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="选择日期"
            v-model="form[item.field]"
            :clearable="false"
            style="width: 170px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="item.label" :key="index" v-if="item.type == 3">
          <el-input-number v-model="form[item.field]" clearable :placeholder="`请输入${item.label}`"></el-input-number>
        </el-form-item>
        <el-form-item :label="item.label" :key="index" v-if="item.type == 4">
          <el-select v-model="form[item.field]" style="width:100%" clearable :placeholder="`请选择${item.label}`">
            <el-option
              v-for="t in item.lxk_data"
              :key="t.value" 
              :label="t.label"
              :value="t.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="item.label" :key="index" v-if="item.type == 5">
          <get-user-select
            ref="userTree"
            v-model="form[item.field]"
            :isExportMultiple="item.multiple"
            :isShowCheckbox="item.multiple"
            placeholder="请选择人员">
          </get-user-select>
        </el-form-item>
        <el-form-item :label="item.label" :key="index" v-if="item.type == 6">
          <get-department-select
              ref="departmenTree"
              v-model="form[item.field]"
              :width="'220'"
              :placeholder="'请选择责任部门'"
              :isContainEmp="false"
              :isCheckStrictly="false"
              :isShowCheckbox="item.multiple"
              :isExportMultiple="item.multiple"
            ></get-department-select>
        </el-form-item>
        <el-form-item :label="item.label" :key="index" v-if="item.type == 9">
          <get-select-dictionaries  style="width: 100%;" v-model="form[item.field]" :classKey="item.pub_field" :placeholder="`请选择${item.label}`"></get-select-dictionaries>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onBtn('export')" icon="el-icon-download">导出</el-button>
      </el-form-item>
      <div style="float: right; height: 47px; display: flex">
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
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate,formatDate} from '@/utils/index'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getUserSelect from '@/components/base/formModel/tree/get-user-select'
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components:{
    getDepartmentSelect,
    getUserSelect,
    getSelectDictionaries
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    querysData: {
      type: Array, //1文本框 2时间 3数字 4普通下拉框 5用户下拉框 6部门下拉框 7车辆下拉框 8线路 9数据字典
      default: []  //pub_field: 0无效 1年 2年月 3年月日 4 年月日时分秒   //is_init 是否需要初始化   is_check  是否需要校验
    }
  },
  data() {
    return {
      form: {},
    };
  },
  mounted() {
    this.dataList = []
    this.querysData.forEach(item =>{
      this.$set(this.form,item.field,'')
    })
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      let date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.querysData.forEach(item =>{
        if (item.is_init) {
          if (item.field.includes("start")) {
            this.form[item.field] = date[0] + ' 00:00:00'
          } else if (item.field.includes("end")) {
            this.form[item.field] = date[1]
          }
        }
      })
      // this.form.start_time = date[0] + ' 00:00:00'
      // this.form.end_time = date[1]
    },
    // 查询
    onSubmit() {
      let success = this.checkForm()
      if (success) {
        let info = {};
        for (let i in this.form) {
          if (this.form[i]) {
            info[i] = this.form[i];
          }
        }
        this.$emit("on-ok", info);
      }
    },
    checkForm() {
      let success = false
      let timeData = []
      this.querysData.forEach(item =>{
        if (item.field.includes("start")) {
          this.form[item.field] = formatDate(new Date(this.form[item.field]),'yyyy-MM-dd') + ' 00:00:00'
        } else if (item.field.includes("end")) {
          this.form[item.field] = formatDate(new Date(this.form[item.field]),'yyyy-MM-dd') + ' 23:59:59'
        }
        if (item.is_check) {
          let start = ""
          let end = ""
          let obj = {
            data:'',
            name: item.label
          }
          if (item.field.includes("start")) {
            start = new Date(this.form[item.field]).getTime()
            obj.data = start
          } else if (item.field.includes("end")) {
            end = new Date(this.form[item.field]).getTime()
            obj.data = end
          }
          timeData.push(obj)
        }
      })
      let timeDataChild = this.sliceArray(timeData,2)
      timeDataChild.forEach(item => {
        let day = (item[1].data - item[0].data) / (24 * 60 * 60 * 1000)
        if (day > 365) {
          this.$message({ message: `${item[0].name}范围不可超过一年`, type: "warning" });
          success = false
        }else {
          success = true
        }
      })
      return success
    },
    // 拆分数组
    sliceArray(array, size) {
      let result = [];
      for (let x = 0; x < Math.ceil(array.length / size); x++) {
        let start = x * size;
        let end = start + size;
        result.push(array.slice(start, end));
      }
      return result;
    },
    // 重置
    resetForm() {
      // 清空树选中
      if (this.$refs.departmenTree) {
        this.$refs.departmenTree[0].onClear();
      }
      if (this.$refs.userTree) {
        this.$refs.userTree[0].onClear();
      }
      this.querysData.forEach(item =>{
        this.$set(this.form,item.field,'')
      })
      this.onSetTime('thisMonth');
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 导出
    onBtn(com) {
      this.$emit("on-" + com);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新
    refreshTableList() {
      this.resetForm()
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
