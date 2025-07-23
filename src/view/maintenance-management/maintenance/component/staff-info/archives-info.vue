<template>
  <div class="archives-info" style="height: 60vh; overflow-x: hidden">
    <div
      style="
        float: left;
        width: 6px;
        height: 16px;
        background: #409eff;
        margin-top: 10px;
      "
    ></div>
    <p
      style="
        margin-left: 15px;
        margin-bottom: 15px;
        color: #409eff;
        font-size: 14px;
        font-weight: bold;
        margin-top: 10px;
      "
    >
      工单信息
    </p>
    <el-form
      ref="elForm"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="115px"
    >
      <div class="show-flex-box-r">
        <el-col :span="8">
          <el-form-item label="车辆自编号:" prop="vehicle_id">
            <get-carcode-select-tree
              ref="carcodeTree"
              :placeholder="'选择车辆自编号'"
              :isShowCheckbox="false"
              v-model="form.vehicle_id"
              @on-change="onSelectChange"
              :isExportMultiple="false"
              :width="'220'"
              :disabled="
                curChangeType == 'detail' || curChangeType == 'checkout'
              "
            >
            </get-carcode-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车牌号:" prop="vehicle_id">
            <get-vehicle-select-tree
              ref="vehicleTree"
              :placeholder="'选择车辆'"
              :isShowCheckbox="false"
              v-model="form.vehicle_id"
              @on-change="onSelectChange"
              :isExportMultiple="false"
              :width="'220'"
              :disabled="
                curChangeType == 'detail' || curChangeType == 'checkout'
              "
            >
            </get-vehicle-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属组织:">
            <el-input
              ref="tree"
              v-model="form.dept_id"
              :width="'420'"
              v-loading="loading1"
              :isShowCheckbox="false"
              :isExportMultiple="false"
              :placeholder="'请选择所属组织'"
              :isContainEmp="false"
              clearable
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
      </div>
      <div class="show-flex-box-r">
        <el-col :span="8">
          <el-form-item label="车辆型号:">
            <el-input
              v-model="form.cid"
              placeholder="请输入车辆型号"
              clearable
              :width="'420'"
              disabled
              v-loading="loading1"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报修类别:" prop="type_child">
            <get-select-dictionaries
              ref="type_child"
              v-model="form.type_child"
              :classKey="'报修类别'"
              :placeholder="'请选择'"
              :accidentType="true"
              :disabled="
                curChangeType == 'detail' || curChangeType == 'checkout'
              "
            ></get-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报修人:" prop="repair_user_id">
            <get-user-select
              ref="driverTree1"
              v-model="form.repair_user_id"
              :width="'390'"
              :isShowCheckbox="false"
              :placeholder="'请选择报修人'"
              :isExportMultiple="false"
              :disabled="
                curChangeType == 'detail' || curChangeType == 'checkout'
              "
            >
            </get-user-select>
          </el-form-item>
        </el-col>
      </div>

      <div class="show-flex-box-r">
        <el-col :span="8">
          <el-form-item label="工单状态:">
            <el-select
              v-model="form.state"
              :disabled="curChangeType == 'detail'"
              clearable
              placeholder="工单状态"
            >
              <el-option
                v-for="item in orderStatusList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-if="form.state == '1'"
              v-model="form.state_child"
              clearable
              placeholder="选择工单状态详情"
            >
              <el-option
                v-for="item in statesTypeOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="维修车间:">
            <!-- <el-input  v-if="form.type_child =='959685'||form.type_child =='959686'||form.type_child =='1708609'" v-model="form.maint_dept" :disabled="curChangeType=='detail'||curChangeType=='checkout'"> </el-input> -->
            <getmaintaindep
              @on-change="getWarehouseperson"
              ref="maintainde"
              :disabled="curChangeType == 'detail'"
              v-model="form.maint_dept"
              placeholder="选择维修车间"
            ></getmaintaindep>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="维修地点:">
            <el-input
              :disabled="curChangeType == 'detail'"
              v-model="form.repair_address"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </div>
      <div class="show-flex-box-r">
        <el-col :span="8">
          <el-form-item label="报修时间:" prop="repair_time">
            <el-date-picker
              v-model="form.repair_time"
              type="datetime"
              placeholder="选择日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :disabled="
                curChangeType == 'detail' || curChangeType == 'checkout'
              "
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="完工时间:">
            <el-date-picker
              v-model="form.finish_check_time"
              type="datetime"
              placeholder="选择日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :disabled="
                curChangeType == 'detail' || curChangeType == 'checkout'
              "
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出厂时间:">
            <el-date-picker
              v-model="form.out_time"
              type="datetime"
              placeholder="选择日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :disabled="
                curChangeType == 'detail' || curChangeType == 'checkout'
              "
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </div>
      <div class="show-flex-box-r">
        <el-col :span="8">
          <el-form-item label="报修描述:">
            <el-input
              v-model="form.describe"
              type="textarea"
              placeholder="请输入报修描述"
              :autosize="{ minRows: 2, maxRows: 2 }"
              :style="{ width: '100%' }"
              :disabled="curChangeType == 'detail'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="优先级：">
            <el-select
              v-model="form.priority"
              :disabled="curChangeType == 'detail'"
              clearable
              placeholder="选择优先级"
            >
              <el-option
                v-for="item in priorityList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检验员:">
            <!-- <get-user-select
              ref="driverTree"
              v-model="form.finish_check_id"
              :width="'390'"
              :isShowCheckbox="false"
              :placeholder="'请选择检验员'"
              :isExportMultiple="false"
              :disabled="
                curChangeType == 'detail' || curChangeType == 'checkout'
              "
            >
            </get-user-select> -->
              <el-select
                :disabled="curChangeType == 'detail' || curChangeType == 'checkout'"
                v-model="form.finish_check_id"
                clearable
              >
                <el-option
                  v-for="item in check_list"
                  :key="item.i_id"
                  :label="item.c_name"
                  :value="item.i_id"
                >
                </el-option>
              </el-select>
          </el-form-item>
        </el-col>
      </div>
      <div class="show-flex-box-r">
        <el-col :span="8">
          <el-form-item label="工单备注:">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入未完成原因说明"
              :autosize="{ minRows: 2, maxRows: 2 }"
              :style="{ width: '100%' }"
              :disabled="curChangeType == 'detail'"
            ></el-input>
          </el-form-item>
        </el-col>
      </div>
    </el-form>
     <div
      style="
        float: left;
        width: 6px;
        height: 16px;
        background: #409eff;
        margin-top: 10px;
      "
    ></div>
    <p
      style="
        margin-left: 15px;
        margin-bottom: 15px;
        color: #409eff;
        font-size: 14px;
        font-weight: bold;
        margin-top: 10px;
      "
    >
      派工信息
    </p>
      <tr-table
          ref="table"
          :selectionShow="false"
          :data="tableData"
          :tableHeaderList="canRendererTableHeader"
          :TableHeight="300"
          :indexShow="false"
          style="margin:10px;width:1100px;"
          :isFixedEmptyPlaceholder="false"
        >
         <template slot-scope="scope" slot="type">
             <el-select v-model="scope.data.type" disabled v-loading = loading2 >
              <el-option
                v-for="item in shopidlist"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
         </template>
         <template slot-scope="scope" slot="item_names">
             <el-input style="width:180px" v-model="scope.data.item_names" :disabled="curChangeType == 'detail' || curChangeType == 'checkout'"></el-input>
         </template>
         <template slot-scope="scope" slot="total_hours">
             <el-input-number style="width:100px" @change="gethours(scope.data)" v-model="scope.data.total_hours" :controls="false" :disabled="curChangeType == 'detail' || curChangeType == 'checkout'" :min="0"   ></el-input-number>
         </template>
          <template slot-scope="scope" slot="person_ids" >
                <el-select v-model="scope.data.person_ids" v-loading = loading2 @change="gethours(scope.data)" placeholder="请选择" clearable :disabled="curChangeType =='detail'"  multiple
      >
                  <el-option
                    v-for="item in scope.data.personList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
          </template>
           <template slot-scope="scope" slot="hours" >
             {{scope.data.hours}}
          </template>
        </tr-table>
  </div>
</template>
<script>
import { formatDateTime } from "@/utils/index";
import { getUser } from "@/utils/auth";
import getUserSelect from "components/base/formModel/tree/get-user-select";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getUserSelectTree from "@/components/base/formModel/tree/get-user-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getmaintaindep from "@/components/base/formModel/select/get-maintain-dep";
import getCarcodeSelectTree from "@/components/base/formModel/tree/get-carcode-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
export default {
  components: {
    getVehicleSelectTree,
    getCarcodeSelectTree,
    getUserSelect,
    getDepartmentSelect,
    getUserSelectTree,
    getDriverSelectTree,
    getmaintaindep,
    getSelectDictionaries,
  },
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      loading1:'',
      loading2:'',//派工LOADING
      tableData:[],
      rules: {
        vehicle_id: [
          {
            required: true,
            message: "请选择车辆",
            trigger: "change",
          },
        ],
        repair_user_id: [
          {
            required: true,
            message: "请填写报修人",
            trigger: "change",
          },
        ],
        repair_time: [
          {
            required: true,
            message: "请填写报修时间",
            trigger: "change",
          },
        ],
        type_child: [
          {
            required: true,
            message: "工单类型",
            trigger: "change",
          },
        ],
      },
      orderStatus: "",
      steplist: [],
      marryOptions: [
        { value: "已婚", name: "已婚" },
        { value: "未婚", name: "未婚" },
        { value: "离异", name: "离异" },
        { value: "丧偶", name: "丧偶" },
      ],
      PriorityOptions: [
        { value: "3", name: "非常紧急" },
        { value: "2", name: "紧急" },
        { value: "1", name: "一般" },
      ],
      statesTypeOptions: [
        { value: "0", name: "等配件" },
        { value: "1", name: "等厂家处理" },
        { value: "2", name: "尾气检测" },
      ],
      isJoinArmyOptions: [
        { value: 1, name: "是" },
        { value: 0, name: "否" },
      ],
      isNylOptions: [
        { value: 1, name: "是" },
        { value: 0, name: "否" },
      ],
      politicalOptions: [
        { value: "群众", name: "群众" },
        { value: "团员", name: "团员" },
        { value: "党员", name: "党员" },
        { value: "预备党员", name: "预备党员" },
      ],
      isStaffRepresentativeOptions: [
        { value: 1, name: "是" },
        { value: 0, name: "否" },
      ],
      isManagerOptions: [
        { value: 1, name: "是" },
        { value: 0, name: "否" },
      ],
      accountTypeOptions: [
        { value: "农业户口", name: "农业户口" },
        { value: "非农业户口", name: "非农业户口" },
      ],
      priorityList: [
        //工种属性
        { value: "1", name: "一般" },
        { value: "2", name: "紧急" },
        { value: "3", name: "非常紧急" },
      ],
      orderStatusList: [
        //工种属性
        { value: "1", name: "等待接修" },
        { value: "2", name: "维修中" },
        { value: "3", name: "待完工检验" },
        { value: "4", name: "待出厂" },
        { value: "5", name: "已出厂" },
      ],
      canRendererTableHeader:[
          {
            id: 1,
            label: "维修班组",
            prop: "type",
            width: "150",
            align: "center",
            signIndex:0,
            sortable:true
          },
           {
            id: 2,
            label: "维修项目",
            prop: "item_names",
            width: "150",
            align: "center",
            signIndex:1,
            sortable:true
          },
          {
            id: 3,
            label: "维修总工时",
            prop: "total_hours",
            width: "110",
            align: "center",
            signIndex:2,
            sortable:true
          },
           {
            id: 4,
            label: "维修人员",
            prop: "person_ids",
            width: "150",
            align: "center",
            signIndex:3,
            sortable:true
          },
          {
            id: 5,
            label: "单人平均工时",
            prop: "hours",
            width: "110",
            align: "center",
            signIndex:4,
            sortable:false
          },
      ],
      shopidlist:[],
      date: [],
      checkform: {
        check_name: "",
        check_time: "",
        check_describe: "",
      },
      formData: {
        finish_check_name: "",
        finish_check_content: "",
        finish_check_time: "",
        finish_time: "",
        finish_name: "",
        finish_content: "",
        work_code: "",
        state: "5",
        state_name: "",
        priority: "",
        dept_id: "",
        vehicle_number: "",
        vehicle_name: "",
        department_name: "",
        vehicle_kind_name: "",
        type_name: "",
        maint_dept_name: "",
        repair_user_name: "",
        repair_time: "",
        is_trailer: "",
        driver_name: "",
        type_child_name: "",
        repair_describe: "",
        imgs: [],
        receive_name: "",
        //
      },
      form: {
        vehicle_id: "",
        type_child: "",
        repair_user_id: "",
        state: "5",
        state_child: "",
        maint_dept: "",
        repair_address: "",
        repair_time: "",
        finish_check_time: "",
        out_time: "",
        describe: "",
        priority: "1",
        finish_check_id: "",
        remark: "",
        cid: "",
        dept_id: "",
        repair_dispatchs:[],
      },
      check_list:[],
      staffAge: "", //员工年龄
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    let userInfo = JSON.parse(getUser());
    this.form.repair_user_id = Number(userInfo.user_id);
    setTimeout(() => {
      if(!!this.$refs.maintainde.data &&　this.$refs.maintainde.data.length) {
        this.form.maint_dept = this.$refs.maintainde.data[0].id;
        this.getWarehouseperson({id:this.form.maint_dept})
        this.form.repair_time = formatDateTime(new Date());
        this.$client.getMaintDeptGetShop({dept_id:this.form.maint_dept})
          .then(res => {
            this.loading2 = true
            if (res.head.result == "200") {
              this.shopidlist = res.context
              let arr = []
              this.shopidlist.forEach(item => {
                arr.push({
                  type: item.id
                })
              })
              this.tableData = arr
              console.log(res.context)
              this.loading2 = false
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
              this.loading2 = false
            };
          })
          this.getperson()
      }
      
    }, 500);
  },
  methods: {
    //获取单人平均工时
     gethours(data){
      var i = this.tableData.findIndex(item=>{return item.type == data.type})
      if(this.tableData[i].total_hours!=null&&this.tableData[i].person_ids.length!=0){
         this.tableData[i].hours = !!this.tableData[i].total_hours?  (this.tableData[i].total_hours/this.tableData[i].person_ids.length).toFixed(2): 0;
      }
    },
    //获取人员数插入tableData
    getperson(){
      this.tableData.forEach(element => {
        this.$client.getMaintDeptGetPerson({dept_id:this.form.maint_dept,shop_id:element.type})
        .then(res => {
          if (res.head.result == "200") {
            this.$set(element,'personList',res.context)
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
      });
      
    },
      //清楚部分数据
    resetData1(){
      this.$refs.driverTree1.onClear();
      this.$refs.carcodeTree.onClear();
      this.form.remark = "";
      // this.tableData =  [ {type:1134},{type:1133}, {type:1132}  ],
      // this.form.repair_dispatchs =[]
      this.form.describe = "";
      this.form.dept_id = "";
      this.form.cid = "";
    },
     // 初始化数据
    resetData() {
      this.$refs.carcodeTree.onClear();
      this.$refs["elForm"].resetFields();
      this.$refs.driverTree1.onClear();
      this.tableData =  [],
      this.form.repair_dispatchs =[]
      // this.$refs.driverTree.onClear();
      this.staffAge = 0;
      this.form.vehicle_id = "";
      this.form.dept_id = "";
      this.form.cid = "";
      this.form.type_child = "";
      this.form.repair_user_id = "";
      this.form.state = "5";
      this.form.state_child = "";
      // this.form.maint_dept = ''
      this.form.repair_address = "";
      this.form.repair_time = "";
      this.form.finish_check_time = "";
      this.form.out_time = "";
      this.form.describe = "";
      this.form.priority = "1";
      this.form.finish_check_id = "";
      this.form.remark = "";
      setTimeout(() => {
        let userInfo = JSON.parse(getUser());
        this.form.repair_user_id = Number(userInfo.user_id);
        this.form.repair_time = formatDateTime(new Date());
        this.form.maint_dept = this.$refs.maintainde.data[0].id;
        this.$client.getMaintDeptGetShop({dept_id:this.form.maint_dept})
        .then(res => {
          this.loading2 = true
          if (res.head.result == "200") {
          this.shopidlist = res.context
          let arr = []
          this.shopidlist.forEach(item => {
            arr.push({
              type: item.id
            })
          })
          this.tableData = arr
          this.loading2 = false
          } else {
            this.loading2 = false
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
        this.getperson()
      }, 60);
    },
    
    //获取维修人员
     getWarehouseperson(val) {
      this.form.finish_check_id = "";
      this.check_list = [];
      this.$client.getMaintainOrgDetail({ i_id: val.id ,type :4}).then((req) => {
        if (req.head.result === "200") {
          this.check_list = req.context.emps;
        }
      });
    },
    // 选择
    selectedTime: function () {
      if (this.date && this.date.length > 0) {
        this.formData.d_from = this.date[0];
        this.formData.d_end = this.date[1];
      } else {
        this.formData.d_from = "";
        this.formData.d_end = "";
      }
    },
    onSelectChange(vehs, nodes) {
      console.log(nodes)
      if(!!nodes && nodes.length > 0) {
        this.$emit('send-vehicle-name', nodes[0].c_name)
      }
      if (vehs != 0) {
        this.form.dept_id = "";
        this.form.cid = "";
        this.$client
          .getAccidentRecordList({
            page_index: 1,
            page_size: 9999,
            i_vehicle_id: vehs,
          })
          .then((res) => {
            this.loading1 = true
            if (res.head.result == "200") {
              this.dataList = res.context.list;
              this.loading1 = false;
            } else {
              this.loading1 = false;
              this.dataList = [];
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
            this.loading1 = false;
          });

        this.$client.getCarinfo({ id: Number(vehs) }).then((res) => {
          if (res.head.result == "200") {
            if (res.context.list) {
              let carInfo = res.context.list[0];
              this.form.dept_id = carInfo.group_name;
              this.form.cid = carInfo.name;
            } else {
              this.form.cid = "";
              this.form.dept_id = "";
            }
          } else {
            this.$message({
              type: "error",
              message: res.head.describle,
              showClose: true,
            });
          }
        });
      }
      // console.log(vehs, nodes)
      // 编辑和详情需要加一层锁
      if (this.curChangeType != "add") {
        if (!this.isFirstLoad && !!this.formData.i_vehicle_id) {
          // this.isFirstLoad = true
          return;
        }
        if (this.isFirstLoad && vehs && vehs.length > 0) {
          this.reqVehicleRelationInfo(vehs[0]);
        }
      } else {
        if (vehs && vehs.length > 0) {
          this.reqVehicleRelationInfo(vehs[0]);
        }
      }
    },
    reqVehicleRelationInfo(car_id) {
      let params = {
        id: car_id,
      };
      this.$client
        .getVehicleRelationInfo(params)
        .then((res) => {
          if (res.head.result == "200") {
            let relationInfo = res.context;
            this.department_name = relationInfo.department_name;
            if (!!relationInfo.line && relationInfo.line.length > 0) {
              // this.$refs.lineTree.lineCheck(relationInfo.line)
              // this.formData.i_line_id = relationInfo.line[0].i_id
            } else {
              this.formData.i_line_id = "";
              // setTimeout(() => {
              //   this.$refs.lineTree.onClear();
              // }, 60);
            }
          } else {
            this.$message({
              type: "error",
              message: res.head.describle,
              showClose: true,
            });
          }
        })
        .catch((err) => {});
    },
    // 数据回显
    setData(val) {
      // this.form = val
      (this.form.vehicle_id = val.vehicle_id),
        (this.form.type_child = val.type_child),
        (this.form.repair_user_id = val.repair_user_id),
        (this.form.state = val.state.toString()),
        (this.form.state_child = val.state_child),
        (this.form.maint_dept = val.maint_dept),
        (this.form.repair_address = val.repair_address),
        (this.form.repair_time = val.repair_time),
        (this.form.finish_check_time = val.finish_check_time),
        (this.form.out_time = val.out_time),
        (this.form.describe = val.describe),
        (this.form.priority = val.priority.toString()),
        (this.form.finish_check_id = val.finish_check_id),
        (this.form.remark = val.remark),
        (this.form.id = val.id);
        this.tableData =val.repair_dispatchs
        this.tableData.forEach(element => {
          element.hours= !!element.total_hours? (element.total_hours / element.person_ids.length).toFixed(2): 0
        });
      this.$client.getMaintDeptGetShop({dept_id:this.form.maint_dept})
        .then(res => {
          this.loading2 = true
          if (res.head.result == "200") {
          this.shopidlist = res.context
          this.loading2 = false
          } else {
            this.loading2 = false
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
        this.getperson()
      console.log(this.formData, "488");
   
    },
    // 给父级页面提供得获取本页数据
    getData() {
      this.form.repair_dispatchs = this.tableData
      return new Promise((resolve, reject) => {
        console.log(this.form, "123");
        this.$refs["elForm"].validate((valid) => {
          if (!valid) {
            reject({
              result: 400,
              msg: "获取失败,带星号的为必填项",
            });
            return;
          }
          resolve({
            formData: this.form,
            result: 200,
            msg: "获取成功",
          });
        });
      });
    },
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.long-lable {
}



.archives-info /deep/ .el-input--mini {
  width: 165px;
}

.long-lable /deep/ .el-form-item__label {
  width: 180px !important;
}

.long-lable /deep/ .el-form-item__content {
  width: 585px !important;
  margin-left: 0px !important;
}
</style>

