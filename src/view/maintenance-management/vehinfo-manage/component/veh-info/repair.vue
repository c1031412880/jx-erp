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
        <el-form-item>
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
         <el-form-item label="工单类别：">
          <get-select-dictionaries
            ref="type_child"
            v-model="form.type_child"
            :classKey="'报修类别'"
            :placeholder="'请选择'"
            :accidentType="true"
          ></get-select-dictionaries>
        </el-form-item>
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
           <template slot-scope="scope" slot="work_code">
              <el-button  type="text" size="mini" @click="jumpOrderPage(scope.data)">{{scope.data.work_code}}</el-button>
          </template>
         <template slot-scope="scope" slot="state_detail_name">
                <div  v-if="scope.data.state == 1">
            <div style="color: #d71345;">
            <p class = "mark" style="background-color: #d71345;"></p> <span>{{scope.data.state_detail_name}}</span>
          </div>
        </div>    
          <div  v-else-if="scope.data.state == 2">
            <div style="color: #18BE6B;">
            <p class = "mark" style="background-color: #18BE6B;"></p> <span>{{scope.data.state_detail_name}}</span>
          </div>
        </div> 
          <div   v-else-if="scope.data.state == 3">
          <div style="color: #c88400;">
            <p class = "mark" style="background-color: #c88400;"></p> <span>{{scope.data.state_detail_name}}</span>
          </div>
        </div> 
          <div   v-else-if="scope.data.state == 4">
          <div style="color: #ffc20e;">
            <p class = "mark" style="background-color: #ffc20e;"></p> <span>{{scope.data.state_detail_name}}</span>
          </div>
        </div> 
          <div   v-else-if="scope.data.state == 5">
          <div style="color: #409EFF;">
            <p class = "mark" style="background-color: #409EFF;"></p> <span>{{scope.data.state_detail_name}}</span>
          </div>
        </div>
          <div   v-else-if="scope.data.state == 7" >
          <div style="color: #77787b;">
            <p class = "mark" style="background-color: #77787b;"></p> <span>{{scope.data.state_detail_name}}</span>
          </div>
        </div> 
        </template>
          <template slot-scope="scope" slot="vehicle_number">
            <span v-if="scope.data.vehicle_info == null" ></span>     
              <el-button v-else type="text" size="mini">{{scope.data.vehicle_info.vehicle_number}}</el-button>
          </template>
          <template slot-scope="scope" slot="vehicle_name">
            <span v-if="scope.data.vehicle_info == null" ></span>
            <span v-else>{{scope.data.vehicle_info.vehicle_name}}</span>
          </template>
            <template slot-scope="scope" slot="department_name">
          <span v-if="scope.data.vehicle_info == null" ></span>
          <span v-else>{{scope.data.vehicle_info.department_name}}</span>
        </template>
        <template slot-scope="scope" slot="vehicle_kind_name">
          <span v-if="scope.data.vehicle_info == null" ></span>
          <span v-else>{{scope.data.vehicle_info.vehicle_kind_name}}</span>
        </template> 
        <template slot-scope="scope" slot="check_time">
          <span v-if="scope.data.repair_check == null" ></span>
          <span v-else>{{scope.data.repair_check.check_time}}</span>
        </template>  
        <template slot-scope="scope" slot="check_describe">
          <span v-if="scope.data.repair_check == null" ></span>
          <span v-else>{{scope.data.repair_check.check_describe}}</span>
        </template> 
        <template slot-scope="scope" slot="state_child">
          <span v-if="scope.data.repair_check == null" ></span>
          <span v-else>{{scope.data.repair_check.state_child}}</span>
        </template>
        <template slot-scope="scope" slot="total_hours">
          <span v-if="scope.data.repair_items == null" ></span>
          <span v-else>{{scope.data.total_hours}}</span>
        </template>
        <template slot-scope="scope" slot="material_fee">
          <span v-if="scope.data.repair_items == null" ></span>
          <span v-else>{{scope.data.material_fee}}</span>
        </template>  
         <template slot-scope="scope" slot="item_name">
          <span v-if="scope.data.item_name == null" ></span>
          <span v-else>{{scope.data.item_name}}</span>
        </template> 
        <template slot-scope="scope" slot="person_name">
          <span v-if="scope.data.person_name == null" ></span>
          <span v-else>{{scope.data.person_name}}</span>
        </template>   
          <template slot-scope="scope" slot="operation">
            <el-button type="primary" size="mini" @click="staffRowInfo(scope.data)">详情</el-button>
            <el-button type="primary" size="mini" @click="editStaffInfo(scope.data)">编辑</el-button>
            <el-button type="primary" size="mini" @click="deleteRowInfo(scope.data,c)" >删除</el-button>
             <!-- <el-button slot="reference" type="danger"  @click="editrepair(scope.data)"  size="mini" style="margin-left: 10px;" :disabled="$isPowerShow('repair')&&scope.data.state!=1">接修</el-button> -->
             <!-- <el-button type="primary" size="mini" @click="showComplete(scope.data)"  :disabled="$isPowerShow('complete')&&scope.data.state!=2">完工</el-button> -->
          </template>
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
            label: "工单号码",
            prop: "work_code",
            width: "150",
            align: "center",
            signIndex:0,
            sortable:true
          },
          {
            id: 2,
            label: "工单状态",
            prop: "state_detail_name",
            width: "140",
            align: "center",
            signIndex:1,
            sortable:true
          },
          {
            id: 3,
            label: "自编号",
            prop: "vehicle_number",
            width: "110",
            align: "center",
            signIndex:2,
            sortable:true
          },
          {
            id: 4,
            label: "车牌号",
            prop: "vehicle_name",
            width: "110",
            align: "center",
            signIndex:3,
            sortable:true
          },
          {
            id: 5,
            label: "所属组织",
            prop: "department_name",
            width: "130",
            align: "center",
            signIndex:4,
            sortable:true
          },
          {
            id: 6,
            label: "车辆型号",
            prop: "vehicle_kind_name",
            width: "120",
            align: "center",
            signIndex:5,
            sortable:true
          },
          {
            id: 7,
            label: "工单类别",
            prop: "type_child_name",
            width: "130",
            align: "center",
            signIndex:6,
            sortable:true
          },
          {
            id: 8,
            label: "报修时间",
            prop: "repair_time",
            width: "120",
            align: "center",
            signIndex:7,
            sortable:true
          },
          {
            id: 9,
            label: "报修地点",
            prop: "maint_dept_name",
            width: "120",
            align: "center",
            signIndex:8,
            sortable:true
          },
          {
            id: 10,
            label: "报修内容",
            prop: "describe",
            width: "120",
            align: "center",
            signIndex:9,
            sortable:true
          },
          {
            id: 11,
            label: "维修项目",
            prop: "item_name",
            width: "135",
            align: "center",
            signIndex:10,
            sortable:true
          },
          {
            id: 12,
            label: "维修人员",
            prop: "person_name",
            width: "140",
            align: "center",
            signIndex:11,
            sortable:true
          },
          {
            id: 13,
            label: "总工时",
            prop: "total_hours",
            width: "110",
            align: "center",
            signIndex:12,
            sortable:true
          },
          {
            id: 14,
            label: "材料费",
            prop: "total_materials",
            width: "110",
            align: "center",
            signIndex:13,
            sortable:true
          },
          {
            id: 15,
            label: "工时费",
            prop: "total_hours_fees",
            width: "150",
            align: "center",
            signIndex:14,
            sortable:true
          },
          {
            id: 15,
            label: "总费用",
            prop: "total_fees",
            width: "150",
            align: "center",
            signIndex:14,
            sortable:true
          },
          {
            id: 16,
            label: "完工时间",
            prop: "finish_check_time",
            width: "150",
            align: "center",
            signIndex:15,
            sortable:true
          },
          {
            id: 17,
            label: "出厂时间",
            prop: "out_time",
            width: "120",
            align: "center",
            signIndex:16,
            sortable:false
          },
           {
            id: 18,
            label: "工单备注",
            prop: "remark",
            width: "120",
            align: "center",
            signIndex:17,
            sortable:false
          },
        ],
        form: {
        // type_child: "",
        start_date: "",
        end_date: "",
        vehicle_ids:"",
        car_type: "1",
        date_type: "1"
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
      this.form.start_date = this.date[0];
      this.form.end_date = this.date[1];
      console.log(this.date);
    },
    setData(val){
      this.form.vehicle_ids =[val]
     this.loadDataGeneralStaff()
    },
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.start_date = this.date[0];
        this.form.end_date = `${this.date[1]} 23:59:59`;
      } else {
        this.form.start_date = "";
        this.form.end_date = "";
      }
      console.log(this.form.end_date);
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

        this.$client.exporMaintRepairOrder(params)
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
        this.$client.getByPageSimpletMaintRepairOrder(params)
          .then(res => {
            if (res.head.result == "200") {
              this.generalStaffData = res.context.list;
              this.pageInfoFirst.pageCount = res.context.total
              res.context.list.forEach(ele => {
                console.log(ele.repair_items.length)
                if(ele.repair_items.length>0){
                  const itemList =[]
                  const person_name =[]
                  ele.repair_items.forEach(element => {
                    itemList.push(element.item_name)
                    person_name.push(element.person_name)
                  });
                  var i = this.generalStaffData.findIndex(item=>{return item.id == ele.id})
                  this.$set(this.generalStaffData[i],'item_name',itemList.toString())
                  let person_name1 = this.unique(person_name);
                  this.$set(this.generalStaffData[i],'person_name',person_name1.toString())
                }
               });
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
