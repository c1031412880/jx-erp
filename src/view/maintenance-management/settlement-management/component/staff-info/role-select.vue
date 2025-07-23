<template>
  <div class="role-info" style="height:100%;overflow-x:hidden">
  <el-form ref="elForm" :model="formData"  size="mini" label-width="115px">
     <div class="show-flex-box-r">
        <el-col :span="8">
          <el-form-item label="工单号码:" prop="d_other_date">
             <p style="width:138px"> {{formData.work_code}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="自编号:" prop="i_is_staff_representative"> 
            <p style="width:138px"> {{formData.vehicle_number}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车牌号:" prop="d_be_elected">
            <p style="width:138px"> {{formData.vehicle_name}}</p>
          </el-form-item>
        </el-col>
       </div>
        <!-- <el-form-item label="故障分类:" prop="d_other_date">
        </el-form-item>
         <el-form-item  prop="d_other_date">
          <div style="width:400px">
              <tr-table
                ref="table"
                :selectionShow="false"
                :data="repair_faults"
                :tableHeaderList="tableHeaderList"
                :TableHeight=200
                :isFixedEmptyPlaceholder="false"
              >
              </tr-table>
            </div>
          </el-form-item> -->
          <el-form-item label="维修项目:" prop="d_be_elected">
          <el-button v-if="curChangeType !='detail'" type="primary" size="mini" @click="showDiaLog()">添加</el-button>
          <el-button v-else type="primary" disabled size="mini" @click="showDiaLog()">添加</el-button>
        <el-dialog
          width="80%"
          :visible.sync="innerVisible"
          append-to-body>
          <faultdlg ref="faultdlg" @func="addData" @funct="addData1" :parentmessage.sync="selectList"></faultdlg>
          <span >
          <el-button type="primary" size="mini" @click="addDatalist">添加</el-button>
          <el-button type="primary" size="mini"  @click="innerVisible=false">取消</el-button>
        </span>
        </el-dialog>
          <div class="table">
            <tr-table
              :selectionShow="true"
              :data="selectList"
              :tableHeaderList="tableHeaderLists"
              :TableHeight="500"
              @on-select-change-row="selectedList"
              :isFixedEmptyPlaceholder="false"
            > 
            <template slot-scope="scope" slot="maint_dept_name" >
              <!-- <getmaintaindep v-model="scope.data.dept_id" placeholder="选择维修车间" disabled></getmaintaindep>             -->
              {{scope.data.maint_dept_name}}
            </template>
              <template slot-scope="scope" slot="shopidlist" >
                <el-select v-model="scope.data.shop_id" placeholder="请选择" :disabled="curChangeType == 'detail'" @change="getperson($event,scope, scope.$index)">
                  <el-option
                    v-for="item in scope.data.shopidlist"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
               <template slot-scope="scope" slot="personList" >
                <el-select v-model="scope.data.person_id" placeholder="请选择" :disabled="curChangeType == 'detail'" >
                  <el-option
                    v-for="item in scope.data.personList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
               <template slot-scope="scope" slot="count" >
                 <el-input-number v-model="scope.data.count" @change="countChange(scope.data)" :min="0"  :disabled="curChangeType == 'detail'" ></el-input-number>
              </template>
            <template slot-scope="scope" slot="operation" >
              <el-button type="primary" size="mini"  :disabled="curChangeType == 'detail'" @click="deleteRow(scope.data,selectList)">移除</el-button>
            </template>
            </tr-table>
          </div>
          </el-form-item>
  </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import getmaintaindep from "@/components/base/formModel/select/get-maintain-dep";
  import faultdlg from "@/view/maintenance-management/workorder-management/fault-diagnosis-manage";
  import roleTree from 'components/base/formModel/tree/role-tree'
  export default {
    components: {roleTree,faultdlg,getmaintaindep},
    props:{
      curChangeType:{
        type: String,
        default: 'add'
      }
    },
    data() {
      return {
        count:'0',
        ture_hours:'',
        actual_fee:'',
        personList:[],
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
        },
        data: [],
        keys: [],
        roleIds:[],
         tableHeaderLists: [
        {
          id: 1,
          label: "维修分类",
          prop: "group_name",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "项目编号",
          prop: "c_code",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
         {
          id: 3,
          label: "维修项目",
          prop: "c_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
         {
          id: 4,
          label: "标准工时",
          prop: "i_hours",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
         {
          id: 5,
          label: "标准费用",
          prop: "n_price",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        }, 
        {
          id: 6,
          label: "维修车间",
          prop: "maint_dept_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
         {
          id: 7,
          label: "维修班组",
          prop: "shopidlist",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: false,
          
        },
        {
          id: 8,
          label: "维修人员",
          prop: "personList",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: false,
          
        },
          {
          id: 9,
          label: "数量",
          prop: "count",
          width: "160",
          align: "center",
          signIndex: 1,
          sortable: false,
          
        },
         {
          id: 10,
          label: "实际工时",
          prop: "actual_hours",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: false,
          
        },
        {
          id: 11,
          label: "实际费用",
          prop: "actual_fee",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: false,
          
        },
         {
          id: 12,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        }
      ],
         tableHeaderList: [
        {
          id: 1,
          label: "故障分类",
          prop: "group_name",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "故障项目",
          prop: "fault_name",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: true,
        }
      ],
      }
    },
  methods: {
    countChange(value){
      //获取下标
       var i = this.selectList.findIndex(item=>{return item.i_id == value.i_id})
       this.selectList[i].actual_fee= this.selectList[i].n_price * this.selectList[i].count
       console.log(this.selectList[i].actual_fee,'ooo')
       this.selectList[i].actual_hours= this.selectList[i].i_hours * this.selectList[i].count
    },
    getperson($e, data, index){
     var i = this.selectList.findIndex(item=>{return item.i_id == data.data.i_id})
     console.log(data.data,"1267")
      this.$client.getMaintDeptGetPerson({dept_id:this.formData.dept_id,shop_id:data.data.shop_id})
        .then(res => {
          if (res.head.result == "200") {
          this.personList = res.context
          if(this.selectList.length>0){
             this.selectList[i].personList= this.personList
          }
          console.log(this.personList,'获取人员后')
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
      },
    showDiaLog() {
      setTimeout(() => {
      this.$refs.faultdlg.setSelectTabel(this.selectList)
      }, 100)
      this.innerVisible=true
    },
    deleteRow(value, rows) {//删除改行
      var i = this.selectList.findIndex(item=>{return item.i_id == value.i_id})
      rows.splice(i, 1);
    },
    selectedList(projectList) {
      this.selectedProjectIds = [];
      projectList.forEach((item,index) => {
        this.selectedProjectIds.push(item)
      });
      // console.log(this.selectedProjectIds,'11111');
      // this.$emit('func',this.selectedProjectIds)
    },
      // 重置信息
      resetData() {
        this.roleIds = [];
        this.data = [];
        this.keys = [];
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
        this.selectoldList = data
        
      },
      addData(data){
        console.log(data,'data')
        this.selectoldList = data
        if(this.selectList.length>0){ 
         this.selectList1=this.selectList.concat(data);
         this.selectList1 = this.unique(this.selectList1);
         this.selectList1= this.selectList1.filter(item =>!item.dept_id )
          this.selectList1.forEach(item => {
        // this.$set(item,'dept_id',this.formData.dept_id)
        this.$set(item,'dept_id','1008')
        this.$set(item,'maint_dept_name',this.formData.maint_dept_name)
        this.$set(item,'shopidlist',this.shopidlist)
        this.$set(item,'shop_id','')
        this.$set(item,'person_id','')
        this.$set(item,'personList','')
        this.$set(item,'count','')
        this.$set(item,'actual_fee','')
        this.$set(item,'ture_hours','')
        this.$set(item,'order_id',this.formData.order_id)
        })
         setTimeout(() => {
       this.selectList=this.selectList.concat(this.selectList1);
      }, 100)
         console.log( this.selectList1,'niubi');
        }else{
        console.log( data,'niubi');
        this.selectList=data
        this.selectList.forEach(item => {
        this.$set(item,'dept_id','1008')
        // this.$set(item,'dept_id',this.formData.dept_id)
        this.$set(item,'maint_dept_name',this.formData.maint_dept_name)
        this.$set(item,'shopidlist',this.shopidlist)
        this.$set(item,'shop_id','')
        this.$set(item,'person_id','')
        this.$set(item,'personList','')
        this.$set(item,'count','')
        this.$set(item,'actual_fee','')
        this.$set(item,'ture_hours','')
        this.$set(item,'order_id',this.formData.order_id)
        })
      // this.selectList = this.selectList.forEach(item =>(item,'dep_name',this.formData.dept_id))

      // this.formData.fault_ids = this.selectList.map(fault_ids =>fault_ids.i_id)
      console.log(this.selectList,'qqq')
        }
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
      resetData(){
        this.selectList= []
      },
      setData(val) {
        if(val.repair_items){
        this.selectList = val.repair_items
        // console.log(val.repair_items,'12356')
        this.selectList = JSON.parse(JSON.stringify(this.selectList).replace(/code/g,"c_code").replace(/i_id/g,"item_id").replace(/item_name/g,"c_name").replace(/hours/g,"i_hours").replace(/price/g,"n_price").replace(/actual_i_hours/g,"actual_hours"))
        this.selectList.forEach(item => {
        this.$set(item,'maint_dept_name',val.maint_dept_name)
        // this.$set(item,'de',val.maint_dept_name)
        })
        console.log(this.selectList,'12356')
        }
        this.formData.order_id = val.id
        this.formData.dept_id = val.maint_dept
        this.formData.maint_dept_name =val.maint_dept_name
         this.$client.getMaintDeptGetShop({dept_id:val.maint_dept})
          .then(res => {
            if (res.head.result == "200") {
            this.shopidlist = res.context
              if(this.selectList.length>0){
            this.selectList.forEach(item => {
              this.$set(item,'shopidlist',res.context)
            })
            }
            console.log(this.shopidlist,'获取组后')
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            };
          })
        this.formData.work_code = val.work_code
        if(val.vehicle_info){
          this.formData.vehicle_number = val.vehicle_info.vehicle_number
          this.formData.vehicle_name = val.vehicle_info.vehicle_name
        } 
        if(val.repair_check){
          if(val.repair_check.repair_faults){
            this.repair_faults = val.repair_check.repair_faults
          }
        }else{
          this.repair_faults = []
        }
      },
      // 给父级页面提供得获取本页数据
      getData() {
      this.selectList = JSON.parse(JSON.stringify(this.selectList).replace(/i_id/g,"item_id"))
        // this.selectList1.forEach(item => {
        // this.$set(item,'dept_id',this.formData.dept_id)
        // this.$delete( item ,'c_code')
        // })
      // this.$delete( this.selectList ,'c_code')
      console.log(this.selectList,'999')
        return new Promise((resolve, reject) => {
          if (this.data.lenght < 1) {
            reject({
              result: 400,
              msg: '获取失败'
            })
            return
          }

          this.roleIds = [];
          if(this.data.length > 0) {
            this.data.forEach(item => {
              this.roleIds.push(item.i_role_id)
            });
          }
          resolve({ 
            formData: this.selectList,
            result:200,
            msg: '获取成功'

          })
        })
      },
    },
    
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
