<template>
  <div v-cloak>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item label="物料编码/名称:" prop="begin">
         <el-input @keyup.enter.native="onSubmit" v-model="form.code" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品规格:" prop="begin">
         <el-input @keyup.enter.native="onSubmit" v-model="form.brand" clearable></el-input>
        </el-form-item>
        <el-form-item label="来源供应商:" prop="begin">
          <el-input @keyup.enter.native="onSubmit" v-model="form.provider_name" clearable></el-input>
        </el-form-item>
        <el-form-item label="规格型号:" prop="begin">
         <el-input @keyup.enter.native="onSubmit" v-model="form.specification" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否启用:" prop="begin">
          <el-select  v-model="form.usable" placeholder="请选择" >
            <el-option
              v-for="item in minitabOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit" :disabled="isSort"
            >查询</el-button
          >
        </el-form-item>
          <el-form-item>
          <el-popconfirm
            @confirm="onBtn('delete')"
            title="确定删除选中的物资分类吗？">
            <el-button slot="reference" type="primary" icon="el-icon-delete" size="mini" :disabled="isSort">删除</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" :disabled="isSort">添加</el-button
          >
        </el-form-item>

         <!-- <el-form-item>
          <el-popconfirm
            @confirm="onBtn('delete')"
            title="确定删除选中的维修项目吗？">
            <el-button slot="reference" type="primary" icon="el-icon-delete" size="mini" :disabled="isSort" v-if="$isPowerShow('del')">删除</el-button>
          </el-popconfirm>
        </el-form-item> -->

         <el-form-item>
          <el-button type="primary" @click="onBtn('import')" icon="el-icon-download" :disabled="isSort"
            >导入</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('export')" icon="el-icon-upload2" :disabled="isSort">导出</el-button
          >
        </el-form-item>
        <el-form-item v-if="isShowSortButton">
          <el-button type="primary" @click="adjustSortSet" v-if="$isPowerShow('sort')">{{!isSort? '调整排序':'保存排序'}} </el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="text" icon="el-icon-s-tools" @click="openSettingPage"></el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
// import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import {getDate} from '@/utils/index'
export default {
  props:{
    isSort:{
      type: Boolean,
      default: false,
    },
    isShowSortButton:{
      type: Boolean,
      default: true,
    },
    curSelectedDepartment:[Object]
  },
  components: { },
  data() {
    return {
      date:[],
      form: {
        code: '',
        name:'',
        barcode:'',
        specification:'',
        provider_name: '',
        brand: '',
        usable:'0',
      },
       minitabOptions:[
        {
        value: '0',
        label: '全部'
      },
        {
        value: '1',
        label: '已启用'
      },
      {
        value: '2',
        label: '已停用'
        }
      ],
      minDate: new Date(),
      maxDate: new Date(),
      pickerOptions: {
        disabledDate:(time)=> {
          let front = new Date(this.minDate.getTime() - 86400000 * 366)
          let end = new Date(this.maxDate.getTime() + 86400000 * 366)
          // console.log(!(front < time && time < end), formatDateTime(front),formatDateTime(time),formatDateTime(end))
          return !(front < time && time < end);
        },
        onPick:(obj)=> {
          console.log(obj)
          this.minDate = (!!obj && obj.minDate) || new Date()
          this.maxDate = (!!obj && obj.maxDate) || this.minDate
        }
      },
    };
  },
  mounted() {
    // this.reqNextTime()
  },
  methods: {
    // reqNextTime() {
    //   let time = getDate('lastOneMonth');
    //   // console.log(time)
    //   let day1 = new Date();
    //   this.form.read_date = [time.startTime, time.endTime];
    //   this.form.read_date = this.$addTime(this.form.read_date)
    //   this.minDate = new Date(day1.getTime() - 86400000 * 366)
    //   // console.log(this.date)
    // },
    // 查询
    onSubmit() {
      let info = {...this.form};
      if(this.form.read_date && this.form.read_date.length > 0) {
        info.read_date = this.$addTime(this.form.read_date)
      }else{
        delete info.read_date
      }
      if (info.code) {
        info.code = info.code.trim();
        info.name = info.code.trim();
        info.mnemonic_code = info.code.trim();
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.reqNextTime();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 500);
    },
    // 添加编辑
    onBtn(com) {
      this.$emit("on-add", com);
    },
    // 调整排序
    adjustSortSet() {
      this.$emit("adjust-sort-set", this.isSort)
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$emit('open-setting-page')
    },
  },
  watch:{
    // curSelectedDepartment: {
    //   handler(newVal, oldVal){
    //     this.form.c_name = ""
    //   },
    //   deep: true
    // }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
