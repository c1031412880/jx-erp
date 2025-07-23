<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="入库日期:">
          <el-date-picker
            size="mini"
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入库单号:">
          <el-input clearable v-model="form.enter_num" placeholder="请输入入库单号"></el-input>
        </el-form-item>
        <el-form-item label="入库方式:">
          <el-select placeholder="全部" clearable v-model="form.enter_type">
            <el-option
              v-for="item in Modeoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联单号:">
          <el-input clearable v-model="form.relate_num" placeholder="请输入关联单号"></el-input>
        </el-form-item>
        <el-form-item label="物料编号:">
          <el-input clearable v-model="form.material_code" placeholder="请输入物料编号"></el-input>
        </el-form-item>
        <el-form-item label="物料名称:">
          <el-input clearable v-model="form.material_name" placeholder="请输入物料名称"></el-input>
        </el-form-item>
        <el-form-item label="规格型号:">
          <el-input clearable v-model="form.specification" placeholder="请输入规格型号"></el-input>
        </el-form-item>
        <!-- <el-form-item label="审核状态:">
          <el-select placeholder="全部" v-model="form.state">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="onSave('save')">保存</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { getDate } from "@/utils/index";
export default {
  components:{
  },
  data() {
    return {
      date:[],
      form: {
        enter_num:'',
        enter_type:'',
        relate_num:'',
        material_code:'',
        material_name:'',
        specification:'',
        state:'2',
        enter_date_start:'',
        enter_date_end: '',
      },
      tyreModelOptions:[
      ],
      Modeoptions:[
        { value: "", label: "全部" },
        {value: 'YBRK',label: '一般入库'}, 
        {value: 'CGRK',label: '采购单入库'}, 
        {value: 'DBRK',label: '调拨入库'}, 
        // {value: 'PYRK',label: '盘盈入库'}, 
        {value: 'HCRK',label: '红冲入库'}, 
      ],
    };
  },
  activated() {
    this.onSubmit()
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    changeDate(date){
      if(date==null||date==[]){
        this.form.enter_date_start = ''
        this.form.enter_date_end = ''
        }else{
        this.form.enter_date_start = date[0]
        this.form.enter_date_end = `${date[1]} 23:59:59`
      }
    },
    onSetTime(type = 'lastOneWeek') {
      let timeObj = getDate('lastOneWeek')
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.enter_date_start = this.date[0]
      this.form.enter_date_end = this.date[1]
      console.log(this.date)
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.vehicle_id = "";
      this.form.tyre_model_id = "";
      this.onSetTime()
      this.form.enter_num = "";
      this.form.enter_type = "";
      this.form.relate_num = "";
      this.form.material_code = "";
      this.form.material_name = "";
      this.form.specification = "";
      this.form.state = "";

      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 刷新列表
    refreshTableList() {
      this.form.c_name = "";
      this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
    onSave() {
      this.$emit("on-save");
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
&.btn{
  color: #999
}
.el-dropdown-menu{
  width: 100px
  padding: 0 5px
  .text{
    font-size: 10px
    text-align: center
    padding: 0
  }
}
</style>
