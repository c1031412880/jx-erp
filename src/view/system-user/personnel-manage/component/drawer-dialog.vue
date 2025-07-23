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
            <el-form-item label="车辆型号:" prop="seats_num">
              <el-input v-model="form.seats_num" placeholder="请输入座位数"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年检周期:" prop="permit_num">
              <el-input v-model="form.permit_num" placeholder="请输入核载数"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="购车日期" prop="displacement">
              <el-input v-model="form.displacement" placeholder="请输入排量(ml)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最近年检日期:" prop="standard">
                <el-select v-model="form.standard" placeholder="请选择排放标准">
                  <el-option
                    v-for="item in effluentStandardOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
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
export default {
  data() {
    return {
      input_names: '',
      direction: 'rtl',
      fuelTypeOptions:[
        {
          value: '柴油',
          label: '柴油'
        }, {
          value: 'LNG',
          label: 'LNG'
        }, {
          value: '插电式混合动力',
          label: '插电式混合动力'
        }, {
          value: '充电/快充',
          label: '充电/快充'
        },{
          value: '充电/慢充',
          label: '充电/慢充'
        },
      ],
      effluentStandardOptions:[
        {
          value: '国一',
          label: '国一'
        }, {
          value: '国二',
          label: '国二'
        }, {
          value: '国三',
          label: '国三'
        }, {
          value: '国四',
          label: '国四'
        }, {
          value: '国五',
          label: '国五'
        }, {
          value: '国六',
          label: '国六'
        }
      ],
      form:{
        seats_num:'',
        permit_num:'',
        displacement:'',
        standard:'',
        fuel:''
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
