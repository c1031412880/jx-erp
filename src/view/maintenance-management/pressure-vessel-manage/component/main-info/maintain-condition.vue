<template>
  <div style="height:400px;overflow-x:hidden" class="maintain-condition-box show-flex-box-c">
    <el-form
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="120px"
      class="demo-formData"
    > 
      <el-form-item label="检验日期:" prop="d_birthday">
        <el-date-picker
          v-model="formData.d_birthday"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          disabled
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="有效期至:" prop="d_birthday">
        <el-date-picker
          v-model="formData.d_birthday"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="填写检验日期后自动生成"
          disabled
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="检验合格证号:" prop="c_name">
        <el-input
          placeholder="请输入检验合格证号"
          v-model="formData.c_name"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="检验机构:" prop="c_name">
        <el-input
          placeholder="请输入检验机构"
          v-model="formData.c_name"
          disabled
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="show-flex-box-c" style="margin:0 20px;">
      <span style="font-weight: 400;font-style: normal;color: rgb(102, 102, 102);margin-bottom:20px;"> 检验记录:</span>
      <tr-table
        :selectionShow="false"
        :data="data"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
      >
      </tr-table>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      formData: {
        scrap_date: "",
        scrap_reason: "",
      },
      rules: {
        scrap_datez: [
          { required: true, message: "请填写驾驶员姓名", trigger: "blur" }
        ],
        department: [
          { required: true, message: "选择部门", trigger: "change" },
        ]
      },
      frontFixedNum: 0, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "检验日期",
          prop: "c_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "有效期至",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "检验合格证号",
          prop: "c_code",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "检验机构",
          prop: "i_hours",
          width: "115",
          align: "center",
          signIndex: 3,
          sortable: false,
        }
      ],
      data:[], //历史车辆使用记录
      TableHeight:350,
      loading:false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化数据
    resetData(){ 
      this.$refs['formData'].resetFields()
    },
    // 数据回显
    setData(val){
      this.formData.c_login_id = val.c_login_id;
    },
  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .maintain-condition-box /deep/ .el-date-editor {
    width: 450px;
  }
  .maintain-condition-box /deep/.el-select,.el-select--mini {
    width: 450px;
  }
  .maintain-condition-box /deep/ .el-input,.el-input--mini{
    width: 450px;
  }

</style>
