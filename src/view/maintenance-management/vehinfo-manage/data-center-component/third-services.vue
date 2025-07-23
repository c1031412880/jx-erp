<template>
  <div class="table-data">
     <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="报修日期:" >
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择日期范围"
            end-placeholder="请选择日期范围"
            @change="selectedTime"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
         <!-- <el-form-item label="工单类别：">
          <get-select-dictionaries
            ref="type_child"
            v-model="form.type_child"
            :classKey="'报修类别'"
            :placeholder="'请选择'"
          ></get-select-dictionaries>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-button @click="exportFile()" icon="el-icon-download"
            >导出</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
    <tr-table
      ref="table"
      :data="generalStaffData"
      :tableHeaderList="customSettingFirstList"
      :TableHeight="TableHeight"
      :loading="loading"
      style="margin-top:10px"
    >
    </tr-table>
    <el-pagination
      style="margin: 5px 0;display:flex; justify-content: flex-end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfoFirst.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfoFirst.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfoFirst.pageCount">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import { getDate } from "@/utils/index";
export default {
  components: {
    getSelectDictionaries
  },
  name: "table-data",
  props: {
    TableHeight: {
      type: Number,
      default:390
    },
    info: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      loading: false,
      generalStaffData: [],
      date:'',
      pageInfoFirst: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      customSettingFirstList:[
          {
            id: 1,
            label: "自编号",
            prop: "v_num",
            width: "100",
            align: "center",
            signIndex:0,
            sortable:true
          },
          {
            id: 2,
            label: "车牌号",
            prop: "lp_num",
            width: "100",
            align: "center",
            signIndex:1,
            sortable:true
          },
          {
            id: 3,
            label: "所属组织",
            prop: "group_name",
            width: "110",
            align: "center",
            signIndex:2,
            sortable:true
          },
          {
            id: 4,
            label: "线路",
            prop: "line_name",
            width: "110",
            align: "center",
            signIndex:3,
            sortable:true
          },
          {
            id: 5,
            label: "车辆型号",
            prop: "vehicle_kind",
            width: "130",
            align: "center",
            signIndex:4,
            sortable:true
          },
          {
            id: 6,
            label: "报修时间",
            prop: "repair_date",
            width: "120",
            align: "center",
            signIndex:5,
            sortable:true
          },
          {
            id: 7,
            label: "出厂时间",
            prop: "leave_date",
            width: "120",
            align: "center",
            signIndex:6,
            sortable:true
          },
          {
            id: 8,
            label: "三包维修内容",
            prop: "content",
            width: "150",
            align: "center",
            signIndex:7,
            sortable:true
          },
          {
            id: 9,
            label: "三包维修厂家",
            prop: "vender_name",
            width: "150",
            align: "center",
            signIndex:8,
            sortable:true
          },
          {
            id: 10,
            label: "检验员",
            prop: "check_name",
            width: "120",
            align: "center",
            signIndex:9,
            sortable:true
          },
          {
            id: 11,
            label: "备注",
            prop: "remark",
            width: "120",
            align: "center",
            signIndex:10,
            sortable:true
          },
        ],
        form: {
        // type_child: "",
        date_start: "",
        date_end: "",
        vehicle_ids:[],
        date_type: "1"
      },
    }
  },
  mounted() {
    this.onSetTime()
    this.setData(this.info)
  },
  methods: {
     onSetTime(type = "lastOneMonth") {
      let timeObj = getDate(type);
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
      this.form.date_start = this.date[0];
      this.form.date_end = this.date[1];
      console.log(this.date);
    },
    setData(val){
      this.form.vehicle_ids =[val.id]
      this.loadDataGeneralStaff()
    },
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.date_start = this.date[0];
        this.form.date_end = `${this.date[1]} 23:59:59`;
      } else {
        this.form.date_start = "";
        this.form.date_end = "";
      }
      console.log(this.form.date_end);
    },
     onSubmit(form) {
        this.pageInfoFirst.pageIndex = 1;
        this.pageInfoFirst.pageCount = 0;
        this.loadDataGeneralStaff();
    },
    jumpOrderPage(info){
      this.$router.push({
        name:'workorder-management',
        params:{
          orderId: info.work_code
        }
      })
    },
     handleCurrentChange(idx) {
        // if(this.showCollapse == 'first') {
          this.pageInfoFirst.pageIndex = idx
          this.loadDataGeneralStaff()
        // }else{
        //   this.pageInfoSecond.pageIndex = idx;
        // }
      },
       handleSizeChange(sizes) {
        // if(this.showCollapse == 'first') {
          this.pageInfoFirst.pageIndex = 1;
          this.pageInfoFirst.pageSize = sizes;
          this.pageInfoFirst.pageCount = 0;
          this.loadDataGeneralStaff()
        // }else{
        //   this.pageInfoSecond.pageIndex = 1;
        //   this.pageInfoSecond.pageSize = sizes;
        //   this.pageInfoSecond.pageCount = 0;
        // }
      },
      //去重
       unique(arr) {
        const res = new Map();
        return arr.filter((arr) => !res.has(arr) && res.set(arr, 1));
        },
      exportFile(){
        let  params = Object.assign({},this.form);

        this.$client.exportMaintRepairPackage(params)
        .then(res => {
          if(res.head.result == '200') {
            window.location.href = res.context
            this.$message({type: 'success', message: '导出成功'})
          }else{
            this.$message({type: 'error', message: '导出失败'})
          }
        })

      },
    // 加载工单列表
      loadDataGeneralStaff() {
        this.loading = true
        let params = {};

        params = Object.assign({},this.form);
        params.page_index = this.pageInfoFirst.pageIndex;
        params.page_size = this.pageInfoFirst.pageSize;
        this.$client.getByPageMaintRepairPackage(params)
          .then(res => {
            if (res.head.result == "200") {
              this.generalStaffData = res.context.list;
              this.pageInfoFirst.pageCount = res.context.total
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            };
            this.loading = false;
          })
      },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.table-data{
  width 100%
  margin-bottom 20px
  .t-title{
    width 100%
  }
}
</style>
