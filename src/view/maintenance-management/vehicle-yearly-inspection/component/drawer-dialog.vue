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
      <el-form ref="form" :model="form"  label-width="100px">
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="车辆型号:" prop="cid">
              <el-select v-model="form.cid" clearable placeholder="车辆型号">
                <el-option
                  v-for="item in vehTypeData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年检周期:" prop="check_cycle">
              <el-select v-model="form.check_cycle" clearable placeholder="年检周期">
                <el-option label="半年" value="0"></el-option>
                <el-option label="1年" value="1"></el-option>
                <el-option label="2年" value="2"></el-option>
                <el-option label="3年" value="3"></el-option>
                <el-option label="4年" value="4"></el-option>
                <el-option label="5年" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="24">
            <el-form-item label="登记证书日期" prop="regist_range">
              <el-date-picker
                v-model="regist_range"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="regist_range_selectedTime"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="最近年检日期:" prop="last_range">
              <el-date-picker
                v-model="last_range"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="last_range_selectedTime"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="demo-drawer__footer">
        <el-button icon="el-icon-refresh-left" @click="resetForm()">重置</el-button>
        <el-button icon="el-icon-search" type="primary" @click="onSubmit">查询</el-button>
      </div>
    </div>

    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      direction: 'rtl',
      regist_range: '',
      last_range: '',
      form:{
        cid: '',
        regist_range: '',
        check_cycle: '',
        last_range: ''
      },
      vehTypeData: []
    };
  },
  props: {
    drawer: Boolean,
  },

  watch: {
    drawer(bool) {
      if (bool === false) {
        Object.assign(this.$data.form, this.$options.data().form);
      }
    }
  },
  mounted() {
    this.getVehType()
  },
  methods: {
    regist_range_selectedTime() {
      if(this.regist_range && this.regist_range.length>0) {
        this.form.regist_range = `${this.regist_range[0]}~${this.regist_range[1]}`
      }else{
        this.form.regist_range = ''
      }
    },
    last_range_selectedTime() {
      if(this.last_range && this.last_range.length>0) {
        this.form.last_range = `${this.last_range[0]}~${this.last_range[1]}`
      }else{
        this.form.last_range = ''
      }
    },
    // 获取车辆型号
    getVehType(){
      this.vehTypeData = []
      this.$client.GetCarModelVehicleManager({}).then(req => {
        if (req.head.result === '200') {
          this.vehTypeData = req.context.list
        }
      })
    },
    // 修饰符回调
    dialogClose() {
      // element组件的修饰符关闭方法(使用自己的)
      this.$emit("update:drawer", false);
    },
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
      this.dialogClose();
    },
    resetForm() {
      Object.assign(this.$data.form, this.$options.data().form);
      this.regist_range = ''
      this.last_range = ''
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
