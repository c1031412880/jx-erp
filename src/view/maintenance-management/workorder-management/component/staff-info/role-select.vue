<template>
  <div class="role-info" style="height:100%;overflow-x:hidden">
    <el-form ref="elForm" :model="formData"  size="mini" label-width="115px">
      <el-row>
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
        <!-- <el-form-item label="故障分类:" prop="d_other_date">
        </el-form-item>
        <el-form-item  prop="d_other_date">
          <div style="width:400px">
            <tr-table
              ref="table"
              :selectionShow="false"
              :data="repair_faults"
              :tableHeaderList="tableHeaderList"
              :TableHeight='200'
              :isFixedEmptyPlaceholder="false">
            </tr-table>
          </div>
        </el-form-item> -->
        <el-col>
          <div style="float:left;width: 6px;height: 16px; background: #409EFF;"></div>
          <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;">维修项目</p>
          <el-button v-if="curChangeType !='detail'&&this.state<3" type="primary" size="mini" @click="showDiaLog()">添加</el-button>
        </el-col>
        <el-col :span="24">
          <tr-table
            :selectionShow="true"
            :data="selectList"
            :tableHeaderList="tableHeaderLists"
            :TableHeight="setTableHeight()"
            @on-select-change-row="selectedList"
            :isFixedEmptyPlaceholder="false"
          > 
            <template slot-scope="scope" slot="work_order_type" >
              <tr-select-dictionaries
                v-model="scope.data.work_order_type"
                :classKey="'派工类型'"
                :placeholder="'请选择派工类型'"
                :isMultiple="false"
                :disabled="disabled1"
              ></tr-select-dictionaries>
            </template>
            
            <template slot-scope="scope" slot="maint_dept_name" >
              <!-- <getmaintaindep v-model="scope.data.dept_id" placeholder="选择维修车间" disabled></getmaintaindep>             -->
              {{scope.data.maint_dept_name}}
            </template>
            <template slot-scope="scope" slot="shop_id" >
              <el-select v-model="scope.data.shop_id" placeholder="请选择" :disabled="disabled1" @change="getperson(scope.data.shop_id, scope.index)">
                <el-option
                  v-for="item in shopidlist"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
            <template slot-scope="scope" slot="person_list" >
              <el-select v-model="scope.data.person_list" placeholder="请选择" filterable multiple value-key="id" :disabled="disabled1" >
                <el-option
                  v-for="item in scope.data.persons"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button type="text" @click="getAllPerson(scope)" :disabled="disabled1">载入全部</el-button>
            </template>
            <template slot-scope="scope" slot="count" >
              <el-input-number v-model="scope.data.count" @change="countChange(scope)" :min="0"  :disabled="disabled1" style="width: 130px;"></el-input-number>
            </template>
              <template slot-scope="scope" slot="actual_hours" >
                <el-input-number v-model="scope.data.actual_hours"  :min="0"  :disabled="disabled1" style="width: 130px;"></el-input-number>
            </template>
              <template slot-scope="scope" slot="actual_fee" >
                <el-input-number v-model="scope.data.actual_fee" :min="0"  :disabled="disabled1" style="width: 140px;"></el-input-number>
            </template>
              <template slot-scope="scope" slot="item_name" >
                <el-input v-model="scope.data.item_name"  :disabled="disabled1" placeholder="请输入维修项目"></el-input>
            </template>
          <template slot-scope="scope" slot="operation" >
            <el-button type="text" size="mini"  :disabled="disabled1" @click="onSelectProject(scope)">选择项目</el-button>
            <el-popconfirm
              @confirm="deleteRow(scope)"
              title="确定删除此条记录吗？">
              <el-button slot="reference" type="text" size="mini" style="margin-left:5px;" :disabled="disabled1">删除</el-button>
            </el-popconfirm>
          </template>
          </tr-table>
        </el-col>
      </el-row>
        
    </el-form>
    <el-dialog
      fullscreen
      :visible.sync="innerVisible"
      append-to-body>
      <faultdlg ref="faultdlg" @func="addData" @on-info="onSetRow" :parentmessage.sync="selectList"></faultdlg>
      <el-button type="primary" size="mini"  @click="innerVisible=false">取消</el-button>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import getmaintaindep from "@/components/base/formModel/select/get-maintain-dep";
  import faultdlg from "@/view/maintenance-management/workorder-management/fault-diagnosis-manage";
  export default {
    components: {faultdlg,getmaintaindep},
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
        persons:[],
        shopidlist:[],
        selectList:[],
        selectList1:[],
        innerVisible:false,
        formData:{
          vehicle_name:'',
          work_code:'',
          vehicle_number:'',
          order_id:'',
          maint_dept_name:'',
        },
        data: [],
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
            width: "300",
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
          // {
          //   id: 4,
          //   label: "项目编号",
          //   prop: "code",
          //   width: "120",
          //   align: "center",
          //   signIndex: 3,
          //   sortable: true,
          // },
          {
            id: 4,
            label: "标准工时",
            prop: "hours",
            width: "120",
            align: "center",
            signIndex: 3,
            sortable: true,
          },
          {
            id: 5,
            label: "标准费用",
            prop: "price",
            width: "120",
            align: "center",
            signIndex: 4,
            sortable: true,
          }, 
          {
            id: 6,
            label: "维修车间",
            prop: "maint_dept_name",
            width: "130",
            align: "center",
            signIndex: 5,
            sortable: false,
          },
          // {
          //   id: 7,
          //   label: "派工类型",
          //   prop: "work_order_type",
          //   width: "160",
          //   align: "center",
          //   signIndex: 6,
          //   sortable: false,
          // },
          {
            id: 7,
            label: "维修班组",
            prop: "shop_id",
            width: "160",
            align: "center",
            signIndex: 6,
            sortable: false,
          },
          {
            id: 8,
            label: "维修人员",
            prop: "person_list",
            width: "300",
            align: "center",
            signIndex: 7,
            sortable: false,
          },
          {
            id: 9,
            label: "数量",
            prop: "count",
            width: "170",
            align: "center",
            signIndex: 8,
            sortable: false,
          },
          {
            id: 10,
            label: "实际工时",
            prop: "actual_hours",
            width: "170",
            align: "center",
            signIndex: 9,
            sortable: false,
          },
          {
            id: 11,
            label: "实际费用",
            prop: "actual_fee",
            width: "170",
            align: "center",
            signIndex: 10,
            sortable: false,
          }
        ],
        // repair_faults:[],
        // tableHeaderList: [
        //   {
        //     id: 1,
        //     label: "故障分类",
        //     prop: "group_name",
        //     width: "120",
        //     align: "center",
        //     signIndex: 0,
        //     sortable: true,
        //   },
        //   {
        //     id: 2,
        //     label: "故障项目",
        //     prop: "fault_name",
        //     width: "120",
        //     align: "center",
        //     signIndex: 0,
        //     sortable: true,
        //   }
        // ],
      }
    },    
    methods: {
      // 动态设置物料表高度
      setTableHeight() {
        let num = this.curChangeType == 'detail' ? 200 : 300
        return document.body.clientHeight - num
      },
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
      getperson(id, index){
        this.$client.getMaintDeptGetPerson({dept_id:this.formData.dept_id,shop_id:id})
          .then(res => {
            if (res.head.result == "200") {
              this.selectList[index].persons = res.context
              this.selectList[index].person_list = []
              // console.log(this.selectList[index].persons,'获取人员后')
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            };
          })
      },
      // 获取全部人员
      getAllPerson(data) {
        this.$client.getMaintDeptGetPerson({})
          .then(res => {
            if (res.head.result == "200") {
              this.selectList[data.index].persons = res.context
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
          shop_id: this.shopidlist.length == 1 ? this.shopidlist[0].id : '',
          count: 1,
          actual_fee: 0,
          actual_hours: 0,
          c_remark: '',
          work_order_type: 0,
          persons: [],
          person_list: [],
        })
        if(this.shopidlist.length == 1) {
          this.getperson(this.shopidlist[0].id,this.selectList.length-1)
        }
        if(!this.shopidlist.length) {
          this.$client.getMaintDeptGetShop({dept_id:this.formData.dept_id})
          .then(res => {
            if (res.head.result == "200") {
            this.shopidlist = res.context
            // console.log(this.shopidlist,'获取组后')
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
      // //删除选择的维修项目行 
      deleteRow(val) {
        var i = val.index
        if(!!val.data.id) {
          // 保存数据库的删除
          this.$client.DeleteByIdsMaintRepairOrder({context:[val.data.id]})
            .then(res => {
              if (res.head.result == "200") {
                this.selectList.splice(i, 1);
              } else {
                this.$message({
                  showClose: true,
                  message: res.head.describle,
                  type: "error",
                });
              };
            })
          return
        }
        // 本地加的删除
        this.selectList.splice(i, 1);
      },
      selectedList(projectList) {
        this.selectedProjectIds = [];
        projectList.forEach((item,index) => {
          this.selectedProjectIds.push(item)
        });
      },
      // 重置信息
      resetData() {
         this.selectList= []
        this.disabled1 = false
        this.data = [];
      },
      unique(arr) { // 根据唯一标识orderId来对数组进行过滤
　　　　const res = new Map();  //定义常量 res,值为一个Map对象实例
　　　　//返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
　　　　return arr.filter((arr) => !res.has(arr.i_id) && res.set(arr.i_id, 1)) 
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
        this.innerVisible=false
        // // 重复工单提示
        // let params = {
        //   orderId: this.formData.order_id,
        //   repairName: val.c_name
        // }
        // this.$client.NoticeRepeatMaintRepairOrder(params).then(res => {
        //   if (res.head.cmd == "200") {
        //     // this.$message({
        //     //   showClose: true,
        //     //   message: res.head.result,
        //     //   type: "success"
        //     // })
        //   } else {
        //     this.$message({
        //       showClose: true,
        //       message: res.head.describle,
        //       type: "warning",
        //     })
        //   }
        // })
      },
      addData(data){
        if(data.length) {
          let index = this.index
          let selectList1 = Object.assign(this.selectList[index], data[0])
          this.$set(this.selectList, this.selectList[index], selectList1)
        }
       },
      setData(val) {
        this.state = val.state
        if(this.curChangeType == 'detail'){
          // this.state > 3 || 
          this.disabled1 = true
        }
        if(val.repair_items){
          let repairItem = val.repair_items.map(item => ({ ...item }))
          setTimeout(() => {           
            this.selectList = repairItem
            this.selectList.forEach(item => {
            this.$set(item,'maint_dept_name',val.maint_dept_name)
            })
          }, 600);
        }
        // this.repair_faults = []
        this.formData.order_id = val.id
        this.formData.dept_id = val.maint_dept
        this.formData.maint_dept_name =val.maint_dept_name
         this.$client.getMaintDeptGetShop({dept_id:val.maint_dept})
          .then(res => {
            if (res.head.result == "200") {
            this.shopidlist = res.context
            // console.log(this.shopidlist,'获取组后')
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
        // if(val.repair_check){
        //   if(val.repair_check.repair_faults){
        //     // this.repair_faults = val.repair_check.repair_faults
        //     val.repair_check.repair_faults.forEach((item, index) => {
        //       this.$set(this.repair_faults, index, item)
        //     })
        //   }
        // }
      },
      // 给父级页面提供得获取本页数据
      getData() {
        this.selectList = JSON.parse(JSON.stringify(this.selectList).replace(/i_id/g,"item_id"))
        let show = '' 
        this.selectList.forEach(item => {
        if(!item.count || !(item.person_list && item.person_list.length)){
            show  = 1
        }
        })
        if(show==1){
            this.$message({showClose: true, message:'请填写完整', type: "warning", });
            return
        }
        return new Promise((resolve, reject) => {
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
