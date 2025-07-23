<template>
  <div class="table-data">
    <div class="t-title" v-if="title">
      <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
      <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">{{title}}</p>
    </div>
    <el-alert
      v-if="label"
      :title="label"
      :closable="false"
      type="info">
    </el-alert>
     <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="领用日期:" >
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
          :TableHeight="350"
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
    title: [String],
    label: [String],
    TableHeight: {
      type: Number,
      default: 400
    },
    TableHeader: {
      type: Array,
      default: () => []
    },
    apiKey: [String],
    apiForm: {
      type: Object,
      default: () => {
        return {}
      }
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
          label: "出库单号",
          prop: "leave_num",
          width: "150",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "出库类型",
          prop: "leave_type",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
         {
          id: 3,
          label: "出库仓库",
          prop: "house_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
         {
          id: 4,
          label: "出库日期",
          prop: "leave_date",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
         {
          id: 5,
          label: "领料人",
          prop: "pick_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        }, 
        {
          id: 6,
          label: "物料编码",
          prop: "material_code",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
         {
          id: 7,
          label: "物料名称",
          prop: "material_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: false,
          
        },
        {
          id: 8,
          label: "规格型号",
          prop: "specification",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: false,
          
        },
          {
          id: 9,
          label: "计量单位",
          prop: "measure_unit_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: false,
          
        },
         {
          id: 10,
          label: "品牌",
          prop: "brand",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: false,
          
        },
        {
          id: 11,
          label: "出库数量",
          prop: "count",
          width: "160",
          align: "center",
          signIndex: 1,
          sortable: false,
          
        },
         {
          id: 12,
          label: "单价",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
         {
          id: 13,
          label: "总金额",
          prop: "total_price",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
         {
          id: 14,
          label: "批次",
          prop: "batch_no",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
         {
          id: 15,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
        //  {
        //   id: 16,
        //   label: "操作",
        //   prop: "operation",
        //   width: "130",
        //   align: "center",
        //   signIndex: 1,
        //   sortable: false
        // }
      ],
        form: {
        // type_child: "",
        leave_date_start: "",
        leave_date_end: "",
        vehicle_ids:[],
        state: "2"
      },
    }
  },
  mounted() {
    this.onSetTime()
  },
  methods: {
    
     onSetTime(type = "lastOneMonth") {
      let timeObj = getDate(type);
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
      this.form.leave_date_start = this.date[0];
      this.form.leave_date_end = this.date[1];
      console.log(this.date);
    },
    setData(val){
      this.form.vehicle_ids =[val]
     this.loadDataGeneralStaff()
    },
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.leave_date_start = this.date[0];
        this.form.leave_date_end = `${this.date[1]} 23:59:59`;
      } else {
        this.form.leave_date_start = "";
        this.form.leave_date_end = "";
      }
      console.log(this.form.leave_date_end);
    },
     onSubmit(form) {
        console.log(form)
     
          this.pageInfoFirst.pageIndex = 1;
          this.pageInfoFirst.pageCount = 0;
          this.loadDataGeneralStaff();
      
      },
    jumpOrderPage(info){
      this.$router.push({
        path:'/vehicle-maintenance-management-main/workorder-management',
        query:{
          orderId: info.work_code
        }
      })
    },
     handleCurrentChange(idx) {
        if(this.showCollapse == 'first') {
          this.pageInfoFirst.pageIndex = idx
          this.loadDataGeneralStaff()
        }else{
          this.pageInfoSecond.pageIndex = idx;
        }
      },
       handleSizeChange(sizes) {
        if(this.showCollapse == 'first') {
          this.pageInfoFirst.pageIndex = 1;
          this.pageInfoFirst.pageSize = sizes;
          this.pageInfoFirst.pageCount = 0;
          this.loadDataGeneralStaff()
        }else{
          this.pageInfoSecond.pageIndex = 1;
          this.pageInfoSecond.pageSize = sizes;
          this.pageInfoSecond.pageCount = 0;
        }
      },
      //去重
       unique(arr) {
        const res = new Map();
        return arr.filter((arr) => !res.has(arr) && res.set(arr, 1));
        },
      exportFile(){
        let  params = Object.assign({},this.form);

        this.$client.exportLeaveHouse(params)
        .then(res => {
          if(res.head.result == '200') {
            window.location.href = res.context
            this.$message({type: 'success', message: '导出成功'})
          }else{
            this.$message({type: 'error', message: '导出失败'})
          }
        })

      },
    // 加载领料
      loadDataGeneralStaff() {
        this.loading = true
        let params = {};
        
        params = Object.assign({},this.form);
        params.page_index = this.pageInfoFirst.pageIndex;
        params.page_size = this.pageInfoFirst.pageSize;
        this.$client.getByPageLeaveHouse(params)
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
