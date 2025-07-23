<template>
  <div class="role-info" style="height:100%;overflow-x:hidden">
  <el-form ref="elForm" :model="formData"  size="mini" label-width="115px">
    <div class="show-flex-box-r">
      <el-col :span="8">
        <el-form-item label="工单号码:">
          <p style="width:138px"> {{formData.work_code}}</p>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="自编号:">
          <p style="width:138px"> {{formData.vehicle_number}}</p>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车牌号:">
          <p style="width:138px"> {{formData.vehicle_name}}</p>
        </el-form-item>
      </el-col>
    </div>
    <div v-if="returnMaterials == 1">
      <span slot="label" style="font-size: 16px;font-weight: bold;">维修领料:</span>
      <div class="tip">说明：提交领料单后,将自动推送APP消息通知到仓管员；领料单不作为维修材料费结算依据，具体结算以实际出库单费用为准。若领料单已关联出库单,则无法编辑和删除。</div>
      <el-button v-if="curChangeType !='detail'&&this.state<3" type="primary" size="mini" @click="showAddDiaLog()">添加</el-button>
      <el-button v-if="curChangeType !='detail'" @click="delMaintRepairPick" type="primary" size="mini">移除</el-button>
      <material-table v-if="curChangeType !='detail'" ref="materialTable"></material-table>
      <material-table-detail v-else ref="materialTableDetail"></material-table-detail>
    </div>
    <el-row v-if="curChangeType !='detail'">
      <el-col :span="6">
        <el-form-item label="车牌号:">
          <p style="width:138px"> {{formData.vehicle_name}}</p>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="出库日期:"> 
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
      </el-col>
      <el-col :span="6">
        <el-form-item label="选择出库单:" prop="d_be_elected">
            <el-select @change="getDeilce" v-model="leave_num" clearable placeholder="选择出库单">
            <el-option
              v-for="item in stockOutList"
              :key="item.value"
              :label="item"
              :value="item"
            >
            </el-option>
        </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <span slot="label" style="font-size: 16px;font-weight: bold;">实际物料清单:</span>
        <div class="tip">说明：仓管员填写出库单时若关联维修工单号将自动同步到此，若没关联则需要手动关联出库单。</div>
        <el-button v-if="curChangeType !='detail'&&this.state<3" type="primary" size="mini" @click="showDiaLog()">添加</el-button>
        <el-button v-if="curChangeType !='detail'"  type="primary" size="mini" @click="deleteSelect()">移除</el-button>
        <c-table
          :selectionShow="true"
          :data="outList"
          :tableHeaderList="curChangeType !='detail' ? tableHeaderLists : tableHeaderLists.slice(0, -1)"
          :TableHeight="returnMaterials == 1 ? 350 : setTableHeight()"
          @on-select-change-row="selectedList"
          :isFixedEmptyPlaceholder="false"> 
          <template slot-scope="scope" slot="leave_num">
            <el-button @click="staffRowInfo(scope.data)" type="text" size="mini">{{
              scope.data.leave_num
            }}</el-button>
          </template>
          <template slot-scope="scope" slot="leave_type">
            <span v-if="scope.data.leave_type=='YBCK'">一般出库</span>
            <span v-else-if="scope.data.leave_type=='WXCK'">维修出库</span>
            <span v-else-if="scope.data.leave_type=='DBCK'">调拨出库</span>
            <span v-else-if="scope.data.leave_type=='PYCK'">盘盈出库</span>
            <span v-else-if="scope.data.leave_type=='HCCK'">红冲出库</span>
            <span v-else></span>
          </template>
          <template slot-scope="scope" slot="operation" >
            <el-button type="primary" size="mini"  :disabled="disabled1" @click="deleteRow(scope.data,outList)">移除</el-button>
          </template>
        </c-table>
      </el-col>
    </el-row>
  </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import cTable from "./c-table";
  import materialTable from "./material-table";
  import materialTableDetail from "./material-table-detail";
  import getmaintaindep from "@/components/base/formModel/select/get-maintain-dep";
  import faultdlg from "@/view/maintenance-management/workorder-management/fault-diagnosis-manage";
  import roleTree from 'components/base/formModel/tree/role-tree'
  import { getDate } from "@/utils/index";
  export default {
    components: {roleTree,faultdlg,getmaintaindep,cTable,materialTable,materialTableDetail},
    props:{
      curChangeType:{
        type: String,
        default: 'add'
      },
      returnMaterials:{
        type: [Number, String],
        default: 1
      },
    },
    data() {
      return {
        leave_num:[],
        leave_nums:[],
        outList:[],
        deilceList:[],
        stockOutList:[],
        disabled1:false,
        state:'',
        count:'0',
        ture_hours:'',
        actual_fee:'',
        persons:[],
        dept_idlist:[],
        shopidlist:[],
        selectList:[],
        selectoldList:[],
        selectList1:[],
        innerVisible:false,
        repair_faults:[],
        formData:{
          vehicle_name:'',
          work_code:'',
          vehicle_number:'',
          order_id:'',
          maint_dept_name:'',
          start_date:'',
          end_date:'',
        },
        data: [],
        date:'',
        keys: [],
        roleIds:[],
        tableHeaderLists: [
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
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "出库日期",
          prop: "leave_date",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "领料人",
          prop: "pick_name",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable: true,
        }, 
        {
          id: 6,
          label: "物料编码",
          prop: "material_code",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "物料名称",
          prop: "material_name",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable: false,
          
        },
        {
          id: 8,
          label: "规格型号",
          prop: "specification",
          width: "120",
          align: "center",
          signIndex: 7,
          sortable: false,
          
        },
          {
          id: 9,
          label: "计量单位",
          prop: "measure_unit_name",
          width: "120",
          align: "center",
          signIndex: 8,
          sortable: false,
          
        },
        {
          id: 10,
          label: "领料类型",
          prop: "pick_type_name",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "品牌",
          prop: "brand",
          width: "120",
          align: "center",
          signIndex: 10,
          sortable: false,
          
        },
        {
          id: 12,
          label: "出库数量",
          prop: "count",
          width: "160",
          align: "center",
          signIndex: 11,
          sortable: false,
          
        },
        {
          id: 13,
          label: "单价",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false
        },
        {
          id: 14,
          label: "总金额",
          prop: "total_price",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false
        },
        {
          id: 15,
          label: "批次",
          prop: "batch_no",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false
        },
        {
          id: 16,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false
        },
        {
          id: 17,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 16,
          sortable: false
        }
      ],
      }
    },
  mounted() {
     this.onSetTime()
    //  this.getDeilce()
     this.selectedTime()
  },
  methods: {
    // 动态设置物料表高度
    setTableHeight() {
      let num = this.curChangeType == 'detail' ? 185 : 320
      return document.body.clientHeight - num
    },
   onSetTime(type = 'lastOneWeek') {
      let timeObj = getDate('lastOneWeek')
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.formData.start_date = this.date[0]
      this.formData.end_date = this.date[1]
      console.log(this.date)
    },
    staffRowInfo(data){
      this.$router.push({
        path:'/warehouse-leave',
         query: {
            leave_num: data.leave_num
          }
      })
    },
    //获取出库单详情
    getDeilce(val){
       this.$client.getByLeaveNumMaintRepairOrder({leave_num:val})
          .then(res => {
          if (res.head.result == "200") {
            this.deilceList = res.context
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
    },
    //设置时间
    selectedTime() {
      if (this.date && this.date.length > 0) {
        if(this.date[1].toString().length>12)
        {
        this.formData.start_date = this.date[0];
        this.formData.end_date = this.date[1]
        }else{
        this.formData.start_date = this.date[0];
        this.formData.end_date = `${this.date[1]} 23:59:59`
        }
      } else {
        this.formData.start_date = "";
        this.formData.end_date = "";
      }
      this.$client.getMaterialByVehMaintRepairOrder({start_date:this.formData.start_date,end_date:this.formData.end_date,lp_num:this.formData.vehicle_name})
          .then(res => {
          if (res.head.result == "200") {
            this.stockOutList = res.context
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
      // console.log(this.form.end_date)
    },
    countChange(value){
      //获取下标
        if(this.selectList[0].i_id){
        var i = this.selectList.findIndex(item=>{return item.i_id == value.i_id})
      }else{
        var i = this.selectList.findIndex(item=>{return item.id == value.id})
      }
       this.selectList[i].actual_fee= this.selectList[i].n_price * this.selectList[i].count
       console.log(this.selectList[i].actual_fee,'ooo')
       this.selectList[i].actual_hours= this.selectList[i].i_hours * this.selectList[i].count
    },

    //  console.log(data.data,"1267")
    showAddDiaLog () {
      this.$refs.materialTable.setData(this.formData.work_code, this.formData.vehicle_name, this.formData.order_id)
      this.$refs.materialTable.showAddmaterialdDialog()
    },
    showDiaLog() {
      if(this.deilceList.length==0){
          this.$message({
          showClose: true,
          message: '请先选择出库单号再添加',
          type: "warning",
        });
         return
      }
      this.deilceList.forEach(element => {
        var i =this.outList.findIndex(item=>{return item.index == element.index})
        // var l = this.leave_nums.findIndex(item=>{return item == element.leave_num})
        if(i==-1){
           this.outList.push(element)
           this.leave_nums.push(element.leave_num)
        }else{
          this.$message({showClose: true,type:"warning",message:'当前出库单已在列表中，请勿重复添加。'})
        }
      });

    },
        // 批量作废
    deleteSelect() {
      if(this.selectedProjectIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要删除的选项',
          type: "warning",
        });
        return
      }
      this.selectedProjectIds.forEach((item,index) => {
        this.deleteRow(item);
      });
    },
    deleteRow(value, rows) {//删除改行
      var i = this.leave_nums.findIndex(item=>{return item == value.leave_num})
      this.leave_nums.splice(i, 1);
      let new_arrB = [];
      this.outList.map((item) => {
          if (value.leave_num.indexOf(item.leave_num) < 0) { // 这行就是最主要的代码
              new_arrB.push(item);
          }
      });
      this.outList = new_arrB
    },
    selectedList(projectList) {
      this.selectedProjectIds = [];
      projectList.forEach((item,index) => {
        this.selectedProjectIds.push(item)
      });
      console.log(this.selectedProjectIds,'11111');
      // this.$emit('func',this.selectedProjectIds)
    },
      // 重置信息
      resetData() {
        this.deilceList= []
        this.leave_nums=[]
        this.leave_num =''
        // this.date =''
        this.onSetTime()
        this.outList= []
        this.selectList= []
        this.disabled1 = false
        this.roleIds = [];
        this.data = [];
        this.keys = [];
        this.formData.vehicle_name=''
        
        // this.$refs.userGroupTree.setSelectCheckedKeys(this.keys);
      },
      initTreeData({data = [], keys = []}) {
        this.data = data;
        this.keys = keys;
        // this.$refs.userGroupTree.setSelectCheckedKeys(this.keys);
      },
      unique(arr) { // 根据唯一标识orderId来对数组进行过滤
 　　　　　　const res = new Map();  //定义常量 res,值为一个Map对象实例
　　　　　　//返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
　　　　　　return arr.filter((arr) => !res.has(arr.i_id) && res.set(arr.i_id, 1)) 
      }, 
      addData1(data){
        console.log(data)
        this.selectoldList = data
      },
      addData(data){
        
       },
      // 树选中事件
      getTreeNodes(nodes,keys) {
        if(this.curChangeType == 'detail') {
          return
        }
        this.data = []
        nodes.forEach(item => {
          this.data.push({
            c_name: item.c_name,
            i_role_id: item.i_id
          })
        })
        this.keys = keys
      },
      removeData(index) {
        this.data.splice(index, 1)
        this.keys.splice(index, 1)
        // this.$refs.userGroupTree.setSelectCheckedKeys(this.keys)
      },
      addDatalist(){
        this.$refs.faultdlg.sing()
        this.innerVisible=false
      },
      // 数据回显
      // resetData(){
      //   this.selectList= []
      // },
      //批量删除领料单
      delMaintRepairPick() {
        this.$refs.materialTable.batchDelete()
      },
      setData(val) {
        this.$client.getMaterialByOrderMaintRepairOrder({work_code:val.work_code})
          .then(res => {
          if (res.head.result == "200") {
            if(res.context.leave_nums.length==0){
              this.outList=[]
            }else{this.outList = res.context.list
            this.leave_nums = res.context.leave_nums
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
        if(val.vehicle_info != null){
          this.formData.vehicle_name = val.vehicle_info.vehicle_name
          this.formData.vehicle_number = val.vehicle_info.vehicle_number
        }
        this.formData.work_code = val.work_code
        this.formData.order_id = val.id
        if(this.returnMaterials != 1) return
        if (this.curChangeType == 'detail') {
          this.$refs.materialTableDetail.loadData(val.id)
        } else {
          this.$refs.materialTable.loadData(val.id)
        }
      },
      // 给父级页面提供得获取本页数据
      getData() {
        if(this.formData.vehicle_name == null || this.formData.vehicle_name == ''){
          this.$message({ showClose: true, message: '请先绑定车辆', type: "error",})
          return
        }
        return new Promise((resolve, reject) => {
          if (this.data.lenght < 1) {
            reject({
              result: 400,
              msg: '获取失败'
            })
            return
          }
          resolve({ 
            formData: this.leave_nums,
            result:200,
            msg: '获取成功'

          })
        })
      },
    },
    
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.tip {
 color: #c9c9c9;
 display: inline;
}
</style>
