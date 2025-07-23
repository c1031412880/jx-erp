<!--  -->
<template>
  <div>
    <el-drawer
      title="高级筛选"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="dialogClose"
      size="650px"
    >
    <div class="advanced-filter ">
      <el-form ref="form" :model="form"  label-width="100px" size="mini">
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="轮胎状态:" prop="state">
              <el-select v-model="form.state" clearable placeholder="选择轮胎状态">
                <el-option
                  v-for="item in pressureVesselStatusOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="厂牌:" prop="firm">
              <get-tyre-firm v-model="form.firm"></get-tyre-firm>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="日期:" prop="date_type">
              <el-select v-model="form.date_type" placeholder="请选择日期">
                <el-option label="安装日期" :value="1"></el-option>
                <el-option label="购买日期" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="50" v-if="form.date_type">
          <el-col :span="12">
            <el-form-item :label="`${form.date_type === 1?'选择安装日期':'选择购买日期'}`" prop="standard">
               <el-date-picker
                  v-model="date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  end-placeholder="结束日期"
                  @change="selectedTime">
                </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <div class="demo-drawer__footer show-flex-box-r show-flex-center">
        <el-button icon="el-icon-refresh-left" @click="resetForm('form')" size="mini">重置</el-button>
        <el-button icon="el-icon-search" type="primary" @click="onSubmit" size="mini">查询</el-button>
      </div>
    </div>
    
    </el-drawer>
  </div>
</template>

<script>
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getTyreFirm from "@/components/base/formModel/select/get-tyre-firm";
export default {
  components: { getSelectDictionaries,getTyreFirm },
  data() {
    return {
      date:[],
      pressureVesselStatusOptions:[ //状态
        { value: 1, name: "使用中" },
        { value: 2, name: "闲置" },
        { value: 3, name: "已报废" },
        // { value: 4, name: "修理中" },
      ],
      direction: 'rtl',
      form:{
        firm:'',
        date_type:'',
        start_time:'',
        end_time:'',
        state:''
      },
    };
  },
  props: {
    drawer: Boolean,
  },

  watch: {
    drawer(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    }
  },

  methods: {
    // 修饰符回调
    dialogClose() {
      // element组件的修饰符关闭方法(使用自己的)
      this.$emit("update:drawer", false);
    },
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        // console.log(this.date)
        this.form.start_time = this.date[0];
        this.form.end_time = this.date[1];
      }else{
        this.form.start_time = '';
        this.form.end_time = '';
      }
    },
    onSubmit() {
      let info = this.$outFormData(this.form)
      this.$emit("on-ok", info);
      this.dialogClose();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // this.$parent.informationDialogOk();
      // setTimeout(() => {
      //   this.$message({ message: "重置成功", type: "success" });
      // }, 50);
    }
  },
};
</script>
<style lang='scss' scoped>
.advanced-filter{
  padding: 0 40px;
}
.demo-drawer__footer{
  margin-top: 40px;
}
</style>