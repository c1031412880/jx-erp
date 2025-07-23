<template>
  <div class="detail-maintain" style="height: 50vh; overflow-x: hidden">
    <el-form ref="elForm" size="mini" :model="form" :rules="rules" label-width="90px" label-suffix=":" label-position="left">
      <el-row>
        <el-col>
          <el-form-item label="维修日期" prop="repair_time">
            <el-date-picker
              v-model="form.repair_time"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :disabled="curChangeType == 'search'">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="自编号" prop="vehicle_id">
            <get-carcode-select-tree
              ref="carcodeTree"
              :placeholder="'选择车辆自编号'"
              :isShowCheckbox="false"
              v-model="form.vehicle_id"
              @on-change="onSelectChange"
              :isExportMultiple="false"
              :disabled="curChangeType == 'search'"
            ></get-carcode-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车牌号" prop="vehicle_id">
            <get-vehicle-select-tree
              ref="vehicleTree"
              :placeholder="'选择车辆'"
              :isShowCheckbox="false"
              v-model="form.vehicle_id"
              @on-change="onSelectChange"
              :isExportMultiple="false"
              :disabled="curChangeType == 'search'"
            ></get-vehicle-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="线路" prop="line_name">
            <el-input disabled v-model="line_name" placeholder="线路"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="维修类型" prop="type_child">
            <get-select-dictionaries
              ref="type_child"
              v-model="form.type_child"
              :classKey="'报修类别'"
              placeholder="请选择维修类型"
              style="width: 220px"
              :accidentType="true"
              :disabled="curChangeType == 'search'"
            ></get-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="维修车间" prop="maint_dept">
            <getmaintaindep
              @on-change="getMaintDept"
              @on-out="setDeptId"
              ref="maintainde"
              v-model="form.maint_dept"
              placeholder="选择维修车间"
              style="width: 220px"
              :disabled="curChangeType == 'search'"
            ></getmaintaindep>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检验员" prop="finish_check_id">
            <el-select
              :disabled="curChangeType == 'search'"
              style="width: 220px"
              v-model="form.finish_check_id"
              placeholder="请选择检验员"
              clearable>
                <el-option
                  v-for="item in check_list"
                  :key="item.i_id"
                  :label="item.c_name"
                  :value="item.i_id">
                </el-option>
              </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="工单备注" prop="remark">
            <el-input
              :disabled="curChangeType == 'search'"
              v-model="form.remark"
              type="textarea"
              placeholder="请输入未完成原因说明"
              :autosize="{ minRows: 2, maxRows: 2 }"
              :style="{ width: '220px' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <p
            style="font-size: 12px;color:#999999"
            >说明：点击保存后页面不关闭，不清空数据，方便继续添加。</p>
        </el-col>
      </el-row>
    </el-form>
    <p
      style="font-size: 12px;color:#999999"
      >说明：选择项目后，若项目已关联了工种工时则会自动带入到各工种的维修项目中并带出工时。</p>
    <tr-table
      ref="table"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="tableHeaderList"
      :TableHeight="250"
      :indexShow="false">
      <template slot-scope="scope" slot="type">
        <el-select 
          style="width: 160px" 
          v-model="scope.data.type" 
          disabled 
          v-loading = selectLoading>
          <el-option
            v-for="item in shopidlist"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" :disabled="curChangeType == 'search'" @click="selectItems(scope)">选择项目</el-button>
      </template>
      <template slot-scope="scope" slot="item_names">
        <el-input :disabled="curChangeType == 'search'" v-model="scope.data.item_names" placeholder="请选择或输入维修项目" style="width: 100%"></el-input>
      </template>
      <template slot-scope="scope" slot="total_hours">
        <el-input-number style="width:100px" :disabled="curChangeType == 'search'" @change="gethours(scope.data)" v-model="scope.data.total_hours" :controls="false" :min="0"></el-input-number>
      </template>
      <template slot-scope="scope" slot="person_ids" >
        <el-select 
          :disabled="curChangeType == 'search'"
          v-model="scope.data.person_ids" 
          v-loading = selectLoading 
          placeholder="请选择维修人员" 
          @change="gethours(scope.data)"
          clearable multiple>
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
    <maintenance-items-dialog
      :dialogBool.sync="itemsDialogVisible"      
      @out-info="setItemsInfo"
    ></maintenance-items-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import getCarcodeSelectTree from "@/components/base/formModel/tree/get-carcode-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getmaintaindep from "@/components/base/formModel/select/get-maintain-dep";
import maintenanceItemsDialog from '../maintenance-items-dialog'
import { formatTime } from "@/utils/index";
export default {
  components: {
    getCarcodeSelectTree,
    getSelectDictionaries,
    getVehicleSelectTree,
    maintenanceItemsDialog,
    getmaintaindep
  },
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      selectIndex: '',
      data: [],
      line_name: '',
      form: {
        id: '',
        repair_time: '',
        vehicle_id: '',
        type_child: '',
        maint_dept: null,
        finish_check_id: '',
        remark: '',
        line_id: '',
      },
      check_list:[],
      shopidlist:[],
      selectLoading: false,
      itemsDialogVisible: false,
      tableHeaderList: [
          {
            id: 1,
            label: "维修班组",
            prop: "type",
            width: "185",
            align: "center",
            signIndex:0,
            sortable:true
          },
           {
            id: 2,
            label: "操作",
            prop: "operation",
            width: "120",
            align: "center",
            signIndex:1,
            sortable:true
          },
          {
            id: 3,
            label: "维修项目",
            prop: "item_names",
            width: "205",
            align: "center",
            signIndex:2,
            sortable:true
          },
           {
            id: 4,
            label: "工时",
            prop: "total_hours",
            width: "125",
            align: "center",
            signIndex:3,
            sortable:true
          },
          {
            id: 5,
            label: "维修人员",
            prop: "person_ids",
            width: "225",
            align: "center",
            signIndex:4,
            sortable:false
          },
          {
            id: 6,
            label: "单人平均工时",
            prop: "hours",
            width: "120",
            align: "center",
            signIndex:5,
            sortable:false
          },
      ],
      rules: {
        repair_time: [
          {
            required: true,
            message: "请选择维修日期",
            trigger: "change",
          },
        ],
        vehicle_id: [
          {
            required: true,
            message: "请选择车辆",
            trigger: "change",
          },
        ],
        type_child: [
          {
            required: true,
            message: "请选择维修类型",
            trigger: "change",
          },
        ],
        maint_dept: [
          {
            required: true,
            message: "请选择维修车间",
            trigger: "change",
          },
        ],
      }
    }
  },
  mounted() {
    this.form.repair_time = formatTime(new Date())
  },
  methods: {
    // 选中维修车间
    setDeptId(id) {
      this.form.maint_dept = id
      this.getMaintDept({id})
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 选择车辆
    onSelectChange(vehs, nodes) {
      // console.log('车辆信息', vehs, nodes);
      if(!!nodes && nodes.length > 0) {
        this.$emit('send-vehicle-name', nodes[0].c_name)
        this.$client.getCarinfo({ id: Number(vehs) }).then((res) => {
          if (res.head.result == "200") {
            if (res.context.list) {
              let carInfo = res.context.list[0];
              this.line_name = carInfo.line_name ? carInfo.line_name : '';
              this.form.line_id = carInfo.line_id ? carInfo.line_id : '';
            } else {
              this.line_name = '';
              this.line_id = '';
            }
          } else {
            this.$message({
              type: "error",
              message: res.head.describle,
              showClose: true,
            });
          }
        });
      }else {
        this.line_name = '';
        this.line_id = '';
      }
    },
    // 维修车间初始化赋值
    getMaintDept(val) {
      // this.form.maint_dept = vla.id
      this.getWarehouseperson(val, true)
      this.getDeptShop(val)
    },
    //获取维修人员
     getWarehouseperson(val, reset) {
      if(reset) {
        this.form.finish_check_id = "";
      }
      this.check_list = [];
      this.$client.getMaintainOrgDetail({ i_id: val.id ,type :4}).then((req) => {
        if (req.head.result === "200") {
          this.check_list = req.context.emps;
        }
      });
    },
    // 获取车间下的班组
    getDeptShop(val) {
      this.$client.getMaintDeptGetShop({dept_id:val.id})
        .then(res => {
          if (res.head.result == "200") {
            this.shopidlist = res.context
          if(this.curChangeType != 'search') {
              let arr = []
              this.shopidlist.forEach(item => {
                arr.push({
                  item_names: '',
                  type: item.id,
                  total_hours: 0,
                  hours: 0,
                })
              })
              this.data = arr
            }
            this.getperson()
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
    },
    //获取人员数插入data
    getperson(){
      this.data.forEach(element => {
        this.$client.getMaintDeptGetPerson({dept_id:this.form.maint_dept,shop_id:element.type})
        .then(res => {
          if (res.head.result == "200") {
            this.$set(element,'personList',res.context)
            // this.$set(element,'person_ids',[res.context[0].id])
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
    //获取单人平均工时
    gethours(data){
      var i = this.data.findIndex(item=>{return item.type == data.type})
      if(this.data[i].total_hours!=null&&this.data[i].person_ids.length!=0){
         this.data[i].hours = !!this.data[i].total_hours ?  (this.data[i].total_hours/this.data[i].person_ids.length).toFixed(2): 0;
      }
    },
    // 选择项目
    selectItems(data) {
      this.selectIndex = data.index
      this.itemsDialogVisible = true
    },
    // 回显选择项目
    setItemsInfo(val) {
      let info = JSON.parse(JSON.stringify(val))
      info.forEach(item => {
        let text = '、' +  item.c_name
        let proInfo = []
        this.data[this.selectIndex].item_names += text
        if(item.details && item.details.length) {
          proInfo = item.details.filter(el => {
            return el.shop_id == this.data[this.selectIndex].type
          })
        }
        console.log(proInfo);
        
        this.data[this.selectIndex].total_hours += proInfo.length ? Number(proInfo[0].hour) : Number(item.i_hours)
      })
    },
    // 给父级页面提供得获取本页数据
    getData() {
      this.form.repair_dispatchs = this.data
      return new Promise((resolve, reject) => {
        this.$refs["elForm"].validate((valid) => {
          if (!valid) {
            reject({
              result: 400,
              msg: "获取失败,带星号的为必填项",
            });
            return;
          }else if(!this.data.length) {
            reject({
              result: 400,
              msg: "请添加维修项目后保存",
            });
            return;
          }
          if(this.curChangeType === 'add') {
            delete this.form.id
          }
          resolve({
            formData: this.form,
            result: 200,
            msg: "获取成功",
          });
        });
      });
    },
    //  初始化数据
    resetData() {
      this.$refs.carcodeTree.onClear();
      this.$refs["elForm"].clearValidate();
      this.form.remark = ''
      let arr = []
      this.shopidlist.forEach(item => {
        arr.push({
          item_names: '',
          type: item.id,
          total_hours: 0,
          hours: 0,
        })
      })
      this.data = arr
    },
    setData(val) {
      console.log(val);
      if(val.maint_dept) {
        this.getWarehouseperson({id: val.maint_dept})
        // 获取班组列表
        this.getShopList({id: val.maint_dept})
      }
      
      
      for(let key in this.form) {
        if(val[key]) {
          this.form[key] = val[key]
        }
      }
      this.data = val.repair_dispatchs ? val.repair_dispatchs : []  
      this.getperson()
    },
    getShopList(val) {
      this.$client.getMaintDeptGetShop({dept_id:val.id})
      .then(res => {
        if (res.head.result == "200") {
          this.shopidlist = res.context
        }
      })
    },
    getShop() {
      this.$refs['maintainde'].loadData()
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .el-form-item__content {
  width: 220px
}
</style>