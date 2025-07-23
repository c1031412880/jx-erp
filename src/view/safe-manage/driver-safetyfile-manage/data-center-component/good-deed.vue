<template>
  <div class="install-info" style="height:470px;overflow-x:hidden">
      
      <div class="use-table-record show-flex-box-c" style="margin:0 20px;">
        <el-form :inline="true" size="mini">
        <el-row>
          <el-form-item label="日期范围:">
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
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSubmit"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button  @click="Reset" icon="el-icon-refresh-left"
              >重置</el-button
            >
          </el-form-item>
        </el-row>
    </el-form>
        <div class="table">
          <tr-table
              :selectionShow="true"
              :data="casualtiesRecordList"
              :tableHeaderList="canRendererTableHeader"
              :isShowBottomOptions="false"
              :TableHeight="TableHeight"
              :loading="loading"
              :frontFixedNum="0"
              :backFixedNum="0"
            >
            </tr-table>
        </div>
      </div>
  </div>
</template>
<script>
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
export default {
  components: {getVehicleSelectTree},
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
    info: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      date:[],
      formData: {
        type: 1,
      },
      canRendererTableHeader: [
        {
          id: 1,
          label: "日期",
          prop: "c_person_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "驾驶员",
          prop: "i_person_age",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "自编号", //1对方 2己方
          prop: "person_type",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "车牌号",
          prop: "c_person_code",
          width: "165",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "所属组织",
          prop: "c_person_phone",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "线路",
          prop: "c_work",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "文明事迹",
          prop: "c_address",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "处理结果",
          prop: "c_address",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "加分",
          prop: "c_address",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "备注",
          prop: "c_address",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        }
      ],
      TableHeight:400,
      curInfo:{}, //当前操作的事故
      isShowAddDialog: false,
      selectedIds:[], //勾选的ids
      casualtiesRecordList:[], //人员伤亡记录列表
      loading: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.setData(this.info)
  },
  methods: {
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.form.begin = this.date[0];
        this.form.end = this.date[1];
      }else{
        this.form.begin = '';
        this.form.end = '';
      }
    },
    // 初始化数据
    resetData(){ 
      this.data = [];
    },
    // 数据回显
    setData(val){
      this.curInfo = val;
      // this.reqCasualtiesRecordList();
    },
    // 获取伤亡记录
    reqCasualtiesRecordList() {
      this.loading = true
      let parmas = {
        i_id: this.curInfo.id,
      }
      this.$client.getCasualtiesRecordList(parmas)
        .then(res => {
          if (res.head.result == "200") {
            this.casualtiesRecordList = res.context.list;
            this.loading = false
          } else {
            this.loading = false
            this.casualtiesRecordList = [];
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
          this.loading = false;
        })
    },
    onSubmit() {
      
    },
    Reset() {

    },
    
  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

  .install-info /deep/ .el-input{
    width: 420px;
  }

  .install-info /deep/ .el-input--mini{
    width: 420px;
  }

  .install-info/deep/ .el-date-editor {
    width: 420px;
  }
</style>

