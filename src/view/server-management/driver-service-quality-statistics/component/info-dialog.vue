<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="900px"
  >
    <div slot="title">
      <div class="show-flex-box-r" style="align-items: center">
        <h2 style="font-size: 20px; font-weight: 600;margin-right: 80px">查看明细</h2>
        <div class="show-flex-box-r">
          <strong style="margin-right: 15px">当前月份:</strong>
          <span style="margin-right: 30px;color:#D9001B">{{form.month}}</span>
          <strong style="margin-right: 15px">当前驾驶员:</strong>
          <span style="color:#D9001B">{{form.driver_name}}</span>
        </div>
      </div>
    </div>
    <div class="el-dialog-div">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="item.lable" :name="item.value" v-for="(item,index) in activeNameList" :key="index">
          <tr-table
            v-if="tableHeaderData[item.value]"
            :selectionShow="false"
            :data="dataMap[item.value]"
            :tableHeaderList="tableHeaderData[item.value]"
            :isShowBottomOptions="false"
            :TableHeight="420"
            :loading="loading"
            :frontFixedNum="1"
            :backFixedNum="0"
          >
          </tr-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import tableHeader from './table-header'
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "查看明细",
    },
    accidentLiabilityType:{
      type: Array,
      default: () => []
    },
    workOrderType:{
      type: [String,Number],
      default: "",
    }
  },
  mounted() {
  },
  data() {
    return {
      activeName: 'first',
      activeNameList:[
        {
          id: 1,
          lable: "违规记录",
          value: 'first',
        },
        {
          id: 2,
          lable: "有责投诉",
          value: 'second',
        },
        {
          id: 3,
          lable: "违法记录",
          value: 'third',
        },
        {
          id: 4,
          lable: "事故记录",
          value: 'fourth',
        },
      ],
      tableHeaderData:{},
      form: {
        month: "",
        driver_id: "",
        driver_name: "",
      },
      dataMap:{
        'first':[],
        'second':[],
        'third':[],
        'fourth':[],
      },
      loading: false
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.tableHeaderData = tableHeader
        this.handleClick({name: this.activeName})
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    handleClick(tab) {
      // console.log(tab.name);
      this.loading = true
      switch (tab.name) {
        case 'first':
          this.reqViolationRecord()
          break;
        case 'second':
          this.reqResponsibleComplaint()
          break;
        case 'third':
          this.reqListViolationRecord()
          break;
        case 'fourth':
          this.reqAccidentRecord()
          break;
      }
    },
    // 获取驾驶员违规记录
    reqViolationRecord() {
      let params = {
        driver_id:this.form.driver_id ? [this.form.driver_id] : [],
        date_month: this.form.month
      }
      this.$client.getDriverRecord(params).then(res => {
        if (res.head.result === "200") {
          this.loading = false;
          this.dataMap[this.activeName] = res.context.list;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
        this.loading = false;
      });
    },
    // 获取驾驶员有责投诉
    reqResponsibleComplaint(){
      let params = {
        driver_id :this.form.driver_id ? [this.form.driver_id] : [],
        month: this.form.month,
        duty: 1,
        order_type: this.workOrderType ? [this.workOrderType] : [],
      }
      this.$client.listPassengerServiceManage(params).then(res => {
        if (res.head.result == "200") {
          this.loading = false;
          this.dataMap[this.activeName] = res.context.list;
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
          this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
      })
    },
    // 获取驾驶员违法记录
    reqListViolationRecord() {
      let params = {
        context: {
          i_driver_id :this.form.driver_id ? [this.form.driver_id] : [],
          month: this.form.month
        }
      }
       this.$client.getListViolationManage(params).then(res => {
        if (res.head.result === "200") {
          this.loading = false;
          this.dataMap[this.activeName] = res.context.list;
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };
      })
    },
    // 获取驾驶员事故记录
    reqAccidentRecord(){
      let params = {
        i_driver_id :[this.form.driver_id],
        month: this.form.month,
        i_accident_duty: this.accidentLiabilityType
      }
       this.$client.getAccidentRecordList(params).then(res => {
        if (res.head.result === "200") {
          this.loading = false;
          this.dataMap[this.activeName] = res.context.list;
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };
      })
    }


  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
  height: 500px;
}
</style>

