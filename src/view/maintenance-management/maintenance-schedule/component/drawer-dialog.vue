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
      <el-form ref="form" :model="form"  label-width="80px">
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="车辆型号:">
              <!-- <get-car-model v-model="form.name"></get-car-model> -->
              <el-select v-model="form.name" clearable placeholder="车辆型号">
                <el-option
                  v-for="item in carNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- <el-form-item label="车辆类型:">
              <el-select v-model="form.kind" clearable placeholder="车辆类型">
                <el-option
                  v-for="item in carTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="车辆类型:">
              <tr-select-dictionaries v-model="form.kind" :classKey="'车型信息管理车辆类型'" :placeholder="'车辆类型'"></tr-select-dictionaries>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <div class="demo-drawer__footer">
        <el-button icon="el-icon-refresh-left" @click="resetForm('form')">重置</el-button>
        <el-button icon="el-icon-search" type="primary" @click="onSubmit">查询</el-button>
      </div>
    </div>
    
    </el-drawer>
  </div>
</template>

<script>
// import getCarModel from "@/components/base/formModel/select/get-car-model";
export default {
  data() {
    return {
      input_names: '',
      direction: 'rtl',
      carNameOptions:[],
      carTypeOptions: [
        {
          value: "大客车",
          label: "大客车",
        },
        {
          value: "混动大客",
          label: "混动大客",
        },
        {
          value: "双层大客",
          label: "双层大客",
        },
        {
          value: "中客",
          label: "中客",
        },
        {
          value: "小客",
          label: "小客",
        },
      ],
      form:{
        name:'',
        kind:'',
      },
    };
  },
  components: {
    // getCarModel
  },
  props: {
    drawer: Boolean,
  },

  watch: {
    drawer(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.reqCmDataInfo('1');
      }
    }
  },

  methods: {
    // 修饰符回调
    dialogClose() {
      // element组件的修饰符关闭方法(使用自己的)
      this.$emit("update:drawer", false);
    },
    reqCmDataInfo(type) {
      let context = {
        type: type
      };
      this.$client.GetCMDataVehicleManager(context)
      .then(res =>  {
        if(res.head.result == '200') {
          let dataList = res.context;
          if(type == '1') {
            this.carNameOptions = this.bulidOptions(dataList)
          }
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    bulidOptions(list) {
      let bulidList = [];
      list.forEach(item => {
        let obj = {
          value: item,
          label: item
        }
        bulidList.push(obj)
      });

      return bulidList
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
    resetForm(formName) {
      this.form.name = '';
      this.form.kind = '';
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