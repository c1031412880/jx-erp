<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="月份:" >
          <el-date-picker
            v-model="form.year_month"
            type="month"
            value-format="yyyy-MM"
            format="yyyy-MM"
            placeholder="选择月"
            style="width:120px" 
            :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item  label="型号/轮胎名称:">
         <el-input v-model="form.type_name" clearable placeholder="请输入型号/轮胎名称" style="width:200px" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button  @click="Reset" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('add')" type="primary">入库</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('out')" type="primary">出库</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('inventory')" type="primary">盘点</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('detail')" type="primary">明细</el-button>
        </el-form-item>
        <!-- <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div> -->
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  components: { },
  data() {
    return {
      date: [],
      form: {
        type_name:'',
        year_month: ''
      },
    };
  },
  mounted() {
    this.setDate()
    this.onSubmit()
  },
  methods: {
    // 设置默认为当前月份
    setDate() {
      let date = new Date();
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      this.form.year_month = Y + '-' + M
    },

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
    Reset(){
      this.form.year_month = ''
      this.form.type_name = ''
      // 清空部门选中
      this.onSubmit()
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
