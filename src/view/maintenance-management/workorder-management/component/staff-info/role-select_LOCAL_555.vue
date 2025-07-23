<template>
  <div class="role-info" style="height:60vh;overflow-x:hidden">
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
        <el-form-item label="故障分类:" prop="d_other_date">
        </el-form-item>
          <el-form-item  prop="d_other_date">
            <div style="width:400px">
              <tr-table
                ref="table"
                :selectionShow="false"
                :data="repair_faults"
                :tableHeaderList="tableHeaderList"
                :TableHeight=200
                :isFixedEmptyPlaceholder="false">
              </tr-table>
            </div>
          </el-form-item>
          <el-form-item label="维修项目:" prop="d_be_elected">
          <el-button v-if="curChangeType !='detail'&&this.state<3" type="primary" size="mini" @click="showDiaLog()">添加</el-button>
          <el-button v-else type="primary" disabled size="mini" @click="showDiaLog()">添加</el-button>
        <el-dialog
          fullscreen
          :visible.sync="innerVisible"
          append-to-body>
          <faultdlg ref="faultdlg" @func="addData" @on-info="onSetRow" :parentmessage.sync="selectList"></faultdlg>
          <span >
          <!-- <el-button type="primary" size="mini" @click="addDatalist">添加</el-button> -->
          <el-button type="primary" size="mini"  @click="innerVisible=false">取消</el-button>
        </span>
        </el-dialog>
          <div class="table">
            <tr-table
              :selectionShow="true"
              :data="selectList"
              :tableHeaderList="tableHeaderLists"
              :TableHeight="200"
              @on-select-change-row="selectedList"
              :isFixedEmptyPlaceholder="false"
            > 
            <template slot-scope="scope" slot="maint_dept_name" >
              <!-- <getmaintaindep v-model="scope.data.dept_id" placeholder="选择维修车间" disabled></getmaintaindep>             -->
              {{scope.data.maint_dept_name}}
            </template>
              <template slot-scope="scope" slot="shop_id" >
                <el-select v-model="scope.data.shop_id" placeholder="请选择" :disabled="disabled1" @change="getperson($event,scope, scope.$index)">
                  <el-option
                    v-for="item in shopidlist"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
               <template slot-scope="scope" slot="person_id" >
                <el-select v-model="scope.data.person_id" placeholder="请选择"  value-key="id" :disabled="disabled1" >
                  <el-option
                    v-for="item in scope.data.persons"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
               <template slot-scope="scope" slot="count" >
                 <el-input-number v-model="scope.data.count" @change="countChange(scope)" :min="0"  :disabled="disabled1" ></el-input-number>
              </template>
               <template slot-scope="scope" slot="actual_hours" >
                 <el-input-number v-model="scope.data.actual_hours"  :min="0"  :disabled="disabled1" ></el-input-number>
              </template>
               <template slot-scope="scope" slot="actual_fee" >
                 <el-input-number v-model="scope.data.actual_fee" :min="0"  :disabled="disabled1" ></el-input-number>
              </template>
               <template slot-scope="scope" slot="item_name" >
                 <el-input v-model="scope.data.item_name"  :disabled="disabled1" placeholder="请输入维修项目"></el-input>
              </template>
            <template slot-scope="scope" slot="operation" >
              <el-button type="text" size="mini"  :disabled="disabled1" @click="onSelectProject(scope)">选择项目</el-button>
              <el-button type="text" size="mini"  :disabled="disabled1" @click="deleteRow(scope)">移除</el-button>
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
        index: '',
        disabled1:false,
        state:'',
        count:'0',
        ture_hours:'',
        actual_fee:'',
        persons:[],
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
            label: "操作",
            prop: "operation",
            width: "130",
            align: "center",
            signIndex: 0,
            sortable: false
          },
          {
            id: 2,
            label: "维修项目",
            prop: "item_name",
            width: "160",
            align: "center",
            signIndex: 1,
            sortable: true,
          },
          {
            id: 3,
            label: "维修分类",
            prop: "group_name",
            width: "120",
            align: "center",
            signIndex: 2,
            sortable: true,
          },
          {
            id: 4,
            label: "项目编号",
            prop: "code",
            width: "120",
            align: "center",
            signIndex: 3,
            sortable: true,
          },
          {
            id: 5,
            label: "标准工时",
            prop: "hours",
            width: "120",
            align: "center",
            signIndex: 4,
            sortable: true,
          },
          {
            id: 6,
            label: "标准费用",
            prop: "price",
            width: "120",
            align: "center",
            signIndex: 5,
            sortable: true,
          }, 
          {
            id: 7,
            label: "维修车间",
            prop: "maint_dept_name",
            width: "130",
            align: "center",
            signIndex: 6,
            sortable: false,
          },
          {
            id: 8,
            label: "维修班组",
            prop: "shop_id",
            width: "120",
            align: "center",
            signIndex: 7,
            sortable: false,
            
          },
          {
            id: 9,
            label: "维修人员",
            prop: "person_id",
            width: "120",
            align: "center",
            signIndex: 8,
            sortable: false,
            
          },
            {
            id: 10,
            label: "数量",
            prop: "count",
            width: "160",
            align: "center",
            signIndex: 9,
            sortable: false,
            
          },
          {
            id: 11,
            label: "实际工时",
            prop: "actual_hours",
            width: "160",
            align: "center",
            signIndex: 10,
            sortable: false,
            
          },
          {
            id: 12,
            label: "实际费用",
            prop: "actual_fee",
            width: "160",
            align: "center",
            signIndex: 11,
            sortable: false,
            
          },
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
            prop: "c_name",
            width: "120",
            align: "center",
            signIndex: 0,
            sortable: true,
          }
        ],
      }
    },    
    methods: {
      onSelectProject(val) {

        this.index = val.index
        // let clickList = []
        // clickList.push(this.selectList[this.index])
        setTimeout(() => {
          this.$refs.faultdlg.setSelectTabel(this.selectList[val.index], 'true')
        }, 500)
        this.innerVisible=true
      },
      countChange(value){
        //获取下标
        let index = value.index
        this.selectList[index].actual_fee= this.selectList[index].price * this.selectList[index].count
        this.selectList[index].actual_hours= this.selectList[index].hours * this.selectList[index].count
      },
      getperson($e, data, index){
        // this.getperson1($e, data, index)
        // if(this.selectList[0].i_id){
        //   var i = this.selectList.findIndex(item=>{return item.i_id == data.data.i_id})
        // }else{
        //   var i = this.selectList.findIndex(item=>{return item.id == data.data.id})
        // }
        let i = data.index
      console.log(data.data,"1267")
        this.$client.getMaintDeptGetPerson({dept_id:this.formData.dept_id,shop_id:data.data.shop_id})
          .then(res => {
            if (res.head.result == "200") {
            this.persons = res.context
            if(this.selectList.length>0){
              console.log(this.selectList);
              // this.$set(this.selectList[i], this.selectList[i].persons, this.persons)
              this.selectList[i].persons= this.persons
              this.selectList[i].person_id =''
            }
            console.log(this.selectList[i].persons,'获取人员后')
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
        this.selectList.push({
          order_id: this.formData.order_id,
          maint_dept_name: this.formData.maint_dept_name,
          count: 1,
          actual_fee: 1,
          actual_hours: 1,
          c_remark: '',
        })
        if(!this.shopidlist) {
          this.$client.getMaintDeptGetShop({dept_id:this.formData.dept_id})
          .then(res => {
            if (res.head.result == "200") {
            this.shopidlist = res.context
            console.log(this.shopidlist,'获取组后')
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            };
          })
        }
      },
      deleteRow(val) {//删除改行  
        // var i = this.selectList.findIndex(item=>{return item.i_id == value.i_id})
        var i = val.index
        this.selectList.splice(i, 1);
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
         this.selectList= []
        this.disabled1 = false
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
        console.log(data)
        this.selectoldList = data
      },
      onSetRow(val) {
        let index = this.index
        this.$set(this.selectList[index], 'item_id', val.i_id)
        this.$set(this.selectList[index], 'item_name', val.c_name)
        this.$set(this.selectList[index], 'code', val.c_code)
        this.$set(this.selectList[index], 'hours', val.i_hours)
        this.$set(this.selectList[index], 'price', val.n_price)
        this.$set(this.selectList[index], 'group_name', val.group_name)
        this.$set(this.selectList[index], 'c_remark', val.c_remark)
        this.$set(this.selectList[index], 'count', 1)
        this.$set(this.selectList[index], 'actual_fee', val.n_price)
        this.$set(this.selectList[index], 'actual_hours', val.i_hours)
        this.$set(this.selectList[index], 'person_id', null)
        this.$set(this.selectList[index], 'shop_id', null)
        this.$set(this.selectList[index], 'persons', [])
        // this.selectList[index].item_id = val.i_id
        // this.selectList[index].item_name = val.c_name
        // this.selectList[index].hours = val.i_hours
        // this.selectList[index].price = val.n_price
        // this.selectList[index].group_name = val.group_name
        // this.selectList[index].shop_id = null       
        // this.selectList[index].count = 1      
        // this.selectList[index].actual_fee = 1       
        // this.selectList[index].actual_hours = 1             
        // this.selectList[index].person_id = null           
        // this.selectList[index].persons = []            
        this.innerVisible=false
      },
      addData(data){
        if(data.length) {
          let index = this.index
          let selectList1 = Object.assign(this.selectList[index], data[0])
          this.$set(this.selectList, this.selectList[index], selectList1)
          // this.selectList.splice(this.selectList[index], 1, selectList1)
        }
        /* this.selectoldList = data
        if(this.selectList.length>0){ 
         this.selectList1=this.selectList.concat(data);
         this.selectList1 = this.unique(this.selectList1);
         this.selectList1= this.selectList1.filter(item =>!item.dept_id )
          data.forEach(item => {
          // this.$set(item,'dept_id',this.formData.dept_id)
              this.$set(item,'dept_id','1008')
              this.$set(item,'maint_dept_name',this.formData.maint_dept_name)
              this.$set(item,'shopidlist',this.shopidlist)
              this.$set(item,'shop_id','')
              this.$set(item,'person_id','')
              this.$set(item,'persons','')
              this.$set(item,'count','')
              this.$set(item,'actual_fee','')
              this.$set(item,'ture_hours','')
              this.$set(item,'order_id',this.formData.order_id)
          })
          this.selectList = JSON.parse(JSON.stringify(this.selectList).replace(/item_id/g,"i_id"))
          this.selectList1=this.selectList.concat(data);
          this.selectList1 = this.unique(this.selectList1);
         setTimeout(() => {
          this.selectList=this.selectList1
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
        this.$set(item,'persons','')
        this.$set(item,'count','')
        this.$set(item,'actual_fee','')
        this.$set(item,'ture_hours','')
        this.$set(item,'order_id',this.formData.order_id)
        })
      this.selectList = this.selectList.forEach(item =>(item,'dep_name',this.formData.dept_id))

      this.formData.fault_ids = this.selectList.map(fault_ids =>fault_ids.i_id)
      console.log(this.selectList,'qqq')
        } */
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
      setData(val) {
        console.log(val);
        this.state = val.state
        console.log(val.state,'42')
        if(this.state>3||this.curChangeType == 'detail'){
          this.disabled1 = true
        }
        console.log(val,'190')
        if(val.repair_items){
          // this.selectList = val.repair_items
          // console.log(val.repair_items,'12356')
          // this.selectList = JSON.parse(JSON.stringify(this.selectList).replace(/code/g,"c_code").replace(/i_id/g,"item_id").replace(/item_name/g,"c_name").replace(/hours/g,"i_hours").replace(/price/g,"n_price").replace(/actual_i_hours/g,"actual_hours"))
          let repairItem = val.repair_items.map(item => ({ ...item }))
          setTimeout(() => {           
            this.selectList = repairItem
            this.selectList.forEach(item => {
            this.$set(item,'maint_dept_name',val.maint_dept_name)
            // this.$set(item,'persons','')
            })
          }, 600);
        console.log(this.selectList,'12356')
        }
        this.formData.order_id = val.id
        this.formData.dept_id = val.maint_dept
        this.formData.maint_dept_name =val.maint_dept_name
         this.$client.getMaintDeptGetShop({dept_id:val.maint_dept})
          .then(res => {
            if (res.head.result == "200") {
            this.shopidlist = res.context
              // if(this.selectList.length>0){
              // this.selectList.forEach(item => {
              //   this.$set(item,'shopidlist',res.context)
              // })
            // }
            console.log(this.shopidlist,'获取组后')
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            };
          })
          // val.repair_items.forEach(element => {
          //   this.getperson2( element,element)
          // });
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
         let show = '' 
         this.selectList.forEach(item => {
          if(!item.shop_id||!item.person_id||!item.count){
             show  = 1
          }
         })
        if(show==1){
            this.$message({showClose: true, message:'请填写完整', type: "warning", });
            return
         }
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
