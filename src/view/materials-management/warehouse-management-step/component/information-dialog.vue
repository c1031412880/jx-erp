<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="1050px"
    top="10px"
  >
    <div class="el-dialog-div-content">
      <el-form
        :model="form"
        :rules="basicRules"
        label-width="100px"
        ref="form"
        size="mini"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="出库方式:" prop="leave_type">
              <el-select
                :disabled="state_name == '已审核'"
                v-model="form.leave_type"
                clearable
              >
                <el-option
                  v-for="item in Modeoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出库日期:" prop="leave_date">
              <el-date-picker
                :disabled="state_name == '已审核'"
                v-model="form.leave_date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="出库仓库:" prop="house_id">
              <el-select
                :disabled="state_name == '已审核' || this.tableData.length > 0"
                @change="getWarehouseperson"
                v-model="form.house_id"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in stoneOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="7">
            <el-form-item label="关联单号:" prop="vehicle_id">
              <el-input
                :disabled="state_name == '已审核'"
                v-show="form.leave_type != 'WXCK'"
                v-model="form.relate_num"
              ></el-input>
              <workcode-select v-show="form.leave_type == 'WXCK'" v-model="form.relate_num" ref="workcodeSelect" @on-change="workcodeChange"></workcode-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="车牌号:" prop="vehicle_id">
              <get-vehicle-select-tree
                :width="300"
                :disabled="state_name == '已审核'"
                v-show="form.out_vehicle == '2'"
                ref="vehicleTree"
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                @on-change="onSelectChange"
                :isExportMultiple="false"
                v-model="form.lp_num"
              >
              </get-vehicle-select-tree>
              <el-input
                :disabled="state_name == '已审核'"
                v-show="form.out_vehicle == '1'"
                v-model="form.lp_num"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="外部车辆:">
              <el-checkbox
                :disabled="state_name == '已审核'"
                :true-label="1"
                :false-label="2"
                v-model="form.out_vehicle"
              ></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="线路名:">
             <el-input disabled v-model="form.line_name" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
              <el-form-item label="领料用途:">
              <get-select-dictionaries
                :disabled="state_name == '已审核'"
                v-model="form.use_way"
                :classKey="'领料用途'"
                :placeholder="'请选择领料用途'"
              ></get-select-dictionaries>
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item label="仓管员:">
              <el-select
                :disabled="state_name == '已审核'"
                v-model="form.storage_id"
                clearable
              >
                <el-option
                  v-for="item in warehouseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item label="领料员:" prop="pick_id">
              <el-select
                filterable
                :disabled="state_name == '已审核'"
                v-model="form.pick_id"
                clearable
              >
                <el-option
                  v-for="item in buyerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领料组织:">
              <!-- <el-input v-model="form.pick_depatment_id"></el-input> -->
              <get-department-select
                ref="baseTree"
                :disabled="state_name == '已审核'"
                :isContainEmp="false"
                :funcType="1"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                v-model="form.pick_depatment_id"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注:">
              <el-input
                :disabled="state_name == '已审核'"
                v-model="form.remark"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button
        type="primary"
        size="mini"
        :disabled="state_name == '已审核'"
        @click="addData"
        >添加出库明细</el-button
      >
      <el-button
        style="margin-bottom: 30px"
        :disabled="state_name == '已审核'"
        type="primary"
        size="mini"
        @click="deleteSelect()"
        >移除</el-button
      >
      <div class="table">
        <tr-table
          :isShowSummary="true"
          :selectionShow="true"
          :data="
            tableData.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
          "
          :tableHeaderList="tableHeaderLists"
          :TableHeight="250"
          @on-select-change-row="selectedList"
          :omitColumnIndex="[2, 3, 4, 5, 6, 8, 10, 11, 12, 13, 14]"
          ref="table"
          :isFixedEmptyPlaceholder="false"
        >
          <template slot-scope="scope" slot="material_id">
            <el-select
              :disabled="state_name == '已审核'"
              v-model="scope.data.material_id"
              :remote-method="remoteMethod"
              :autofocus="true"
              size="mini"
              filterable
              remote
              @change="changeData(scope)"
              placeholder="请选择"
            >
              <el-option
                v-for="item in wuziOptions"
                :key="item.material_id"
                :label="item.groupgo"
                :value="item.material_id"
              >
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope" slot="count">
            <el-input-number
              :disabled="state_name == '已审核'"
              v-model="scope.data.count"
              :precision="0"
              :controls="false"
              @change="priceChange(scope.data)"
              :min="0"
              size="mini"
            ></el-input-number>
          </template>
          <template slot-scope="scope" slot="price">
            <el-input-number
              :disabled="state_name == '已审核'"
              v-model="scope.data.price"
              :precision="2"
              :controls="false"
              @change="priceChange(scope.data)"
              :min="0"
              size="mini"
            ></el-input-number>
          </template>
          <template slot-scope="scope" slot="remark">
            <el-input
              :disabled="state_name == '已审核'"
              v-model="scope.data.remark"
              maxlength="8"
              size="mini"
            ></el-input>
          </template>
          <template slot-scope="scope" slot="total_price">
            <el-input-number
              disabled
              v-model="scope.data.total_price"
              :precision="2"
              :controls="false"
              :min="0"
              size="mini"
            ></el-input-number>
          </template>
          <template slot-scope="scope" slot="batch_no">
            <span v-if="scope.data.batch_no">{{ scope.data.batch_no }}</span>
            <span v-else>系统自动生成</span>
          </template>
          <template slot-scope="scope" slot="provider_id">
            <el-select
              :disabled="state_name == '已审核'"
              v-model="scope.data.provider_id"
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in gongysOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
        </tr-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10]"
          :page-size="pagesize"
          :total="tableData.length"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button
        type="primary"
        :disabled="state_name == '已审核'"
        @click="updatePlaybill('form')"
        >保 存</el-button
      >
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { formatDateTime } from "@/utils/index";
import { getSession, getUser } from "@/utils/auth";
import imageListUpload from "@/components/imageListUpload";
import getUserSelect from "components/base/formModel/tree/get-user-select";
import getTyreModel from "@/components/base/formModel/select/get-tyre-model";
import getVehicleSelectTree from "./get-vehicle-number-tree";
import workcodeSelect from "./workcode-select";
import getTyreCode from "@/components/base/formModel/select/get-tyre-code";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getDepartmentSelect,
    getUserSelect,
    imageListUpload,
    getTyreModel,
    getVehicleSelectTree,
    getTyreCode,
    getSelectDictionaries,
    workcodeSelect
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  data() {
    return {
      pagesize: 10, //默认分页每页数据量
      currentPage: 1, //默认展示第一页数据
      warehouseList: [],
      state_name: "",
      //是否外部车辆
      // checked:false,
      select_lp_num: '',
      defaultCode: '',
      form: {
        use_way: "",
        out_vehicle: "2",
        // leave_type:'',
        // enter_date:'',
        // relate_num:'',
        // storage_id:'',
        // buyer_id:'',
        // remark:'',
        // house_id:'',
        line_name:'',
        line_id:'',
        leave_type: "WXCK",
        leave_date: formatDateTime(new Date()),
        house_id: "",
        relate_num: "",
        lp_num: "",
        storage_id: "",
        pick_id: "",
        pick_depatment_id: "",
        remark: "",
      },
      gongysOptions: [],
      stoneOptions: [],
      basicRules: {
        leave_type: [
          {
            required: true,
            message: "请选择出库方式",
            trigger: "blur",
          },
        ],
        leave_date: [
          {
            required: true,
            message: "请输出出库时间",
            trigger: "blur",
          },
        ],
        house_id: [
          {
            required: true,
            message: "请选择仓库",
            trigger: "blur",
          },
        ],
        pick_id: [
          {
            required: true,
            message: "请选择领料员",
            trigger: "blur",
          },
        ],
      },
      buyerList: [],
      Modeoptions: [
        { value: "YBCK", label: "一般出库" },
        { value: "WXCK", label: "维修出库" },
        { value: "DBCK", label: "调拨出库" },
        // { value: "PYCK", label: "盘盈出库" },
        { value: "HCCK", label: "红冲出库" },
      ],
      tyreMaintainData: [],
      picturePathList: [],
      tableData: [],
      wuziOptions: [],
      wuziOptionAllMap: {},
      wuziOptionMap: {},
      tableHeaderLists: [
        {
          id: 1,
          label: "物料编码",
          prop: "material_id",
          width: "200",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "物料名称",
          prop: "material_name",
          width: "160",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "规格型号",
          prop: "specification",
          width: "160",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "计量单位",
          prop: "measure_unit_name",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "品牌",
          prop: "brand",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 7,
          label: "申请出库数量",
          prop: "count",
          width: "160",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        // {
        //   id: 8,
        //   label: "含税单价",
        //   prop: "trueprice",
        //   width: "160",
        //   align: "center",
        //   signIndex: 7,
        //   sortable: false,
        // },
        {
          id: 8,
          label: "销售单价",
          prop: "price",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "销售金额",
          prop: "total_price",
          width: "160",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "当前仓库库存",
          prop: "current_inventory",
          width: "150",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "全部仓库库存",
          prop: "total_inventory",
          width: "150",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "批次",
          prop: "batch_no",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 14,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
      ],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        setTimeout(() => {
          // let userInfo = JSON.parse(getUser());
          // this.form.storage_id = Number(userInfo.user_id)
          // this.$refs.persontree.onClear();
          this.$refs.workcodeSelect.onClear();
          this.$refs.baseTree.onClear();
        }, 60);
      } else {
        // this.getwuzi()
        this.getGinsang();
        this.getWarehouse();
        // setTimeout(() => {
        //
        //   this.getWarehouseperson1(this.form.house_id)
        // }, 400);
        this.$nextTick(() => {
          this.$refs["form"].clearValidate();
        });
      }
    },
  },
  mounted() {
    // this.$refs[form].clearValidate()
    // let userInfo = JSON.parse(getUser());
    // this.form.storage_id = Number(userInfo.user_id)
  },
  methods: {
    handleSizeChange: function (val) {
      this.pagesize = val;
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
    },
    //获取仓管员
    getWarehouseperson(val) {
      this.form.storage_id = "";
      this.warehouseList = [];
      this.form.pick_id = "";
      this.buyerList = [];
      if(val==null ||val==''){
        return
      }
      this.$client.getRecordWarehouse({ id: val }).then((req) => {
        if (req.head.result === "200") {
          this.buyerList = req.context.persons;
          if (req.context.persons.length > 0) {
            req.context.persons.forEach((element) => {
              if (element.is_operater == 1) {
                this.warehouseList.push(element);
              }
            });
            if (this.warehouseList.length == 1) {
              this.form.storage_id = this.warehouseList[0].id;
            }
          }
        }
      });
      this.getwuzi();
    },
    //获取仓管员
    getWarehouseperson1(val) {
      // this.form.storage_id =''
      this.warehouseList = [];
      this.buyerList = [];
      this.$client.getRecordWarehouse({ id: val }).then((req) => {
        if (req.head.result === "200") {
          this.buyerList = req.context.persons;
          if (req.context.persons.length > 0) {
            req.context.persons.forEach((element) => {
              if (element.is_operater == 1) {
                this.warehouseList.push(element);
              }
            });
            if (
              this.warehouseList.length == 1 &&
              this.curSelecedType != "edit"
            ) {
              this.form.storage_id = this.warehouseList[0].id;
            }
          }
        }
      });
      this.getwuzi();
    },
    //供应商
    getGinsang() {
      this.$client.GetProviderPage().then((req) => {
        if (req.head.result === "200") {
          this.gongysOptions = req.context.list;
        } else {
          // this.$message({ type: "error", message: "获取失败" });
        }
      });
    },
    onSelectChange(){
      this.$client.getCarinfo({ num:this.form.lp_num}).then(res => {
        if(res.head.result == '200') {
          this.form.line_name = res.context.list[0].line_name
          this.form.line_id = res.context.list[0].line_id
          console.log(this.form.line_id)
        }else{
          this.$message({
            type: 'error',
            message: res.head.describle,
            showClose: true
          })
        }
      })
    },
    priceChange(val) {
      //获取下标
      if (this.tableData[0].id) {
        var i = this.tableData.findIndex((item) => {
          return item.material_id == val.material_id;
        });
      } else {
        var i = this.tableData.findIndex((item) => {
          return item.material_id == val.material_id;
        });
      }
      if (this.tableData[i].count && this.tableData[i].price) {
        this.tableData[i].total_price =
          this.tableData[i].count * this.tableData[i].price;
      }
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        // let Options = []
        setTimeout(() => {
          this.loading = false;
          this.wuziOptions = Object.values(this.wuziOptionAllMap).filter(
            (item) => {
              return item.groupgo.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
          );
          // this.wuziOptions=this.wuziOptions.concat( Options)
          // this.wuziOptions= this.unique(this.wuziOptions);
        }, 200);
      } else {
        this.wuziOptions = [];
      }
    },
    // changeData1(){
    //   let ids = [];
    //   this.tableData.forEach((obj) => {
    //     ids.push(obj.material_id);
    //   });
    //   ids.forEach((key) => {
    //     this.wuziOptionMap[key] = this.wuziOptionAllMap[key];
    //   });
    //   this.wuziOptions = Object.values(this.wuziOptionMap);
    // },
    changeData(val) {
      if (this.tableData[0].id) {
        var i = this.tableData.findIndex((item) => {
          return item.material_id == val.data.material_id;
        });
      } else {
        var i = this.tableData.findIndex((item) => {
          return item.material_id == val.data.material_id;
        });
      }
      if (this.wuziOptions[0].material_id) {
        var l = this.wuziOptions.findIndex((item) => {
          return item.material_id == val.data.material_id;
        });
      } else {
        var l = this.wuziOptions.findIndex((item) => {
          return item.material_id == val.data.material_id;
        });
      }
      // var requir = this.tableData.findIndex((item) => {
      //   return item.material_id == this.tableData[i].material_id;
      // });
      // if (requir > -1 && requir != val.index + 10 * (this.currentPage - 1)) {
      //   //  this.tableData[(val.index+(10*(this.currentPage-1)))] = {}
      //   Object.keys(
      //     this.tableData[val.index + 10 * (this.currentPage - 1)]
      //   ).forEach((key) => {
      //     this.tableData[val.index + 10 * (this.currentPage - 1)][key] = "";
      //   });
      //   this.$message({
      //     showClose: true,
      //     message: "请勿重复添加相同物料",
      //     type: "warning",
      //   });
      //   return;
      // }
        for (var o=0; o<this.tableData.length; o++) {
        for (var j=o+1; j<this.tableData.length; j++) {
          if (this.tableData[o].material_id == this.tableData[j].material_id&&this.tableData[o].material_id!=null) {
            Object.keys(this.tableData[(val.index+(10*(this.currentPage-1)))]).forEach((key) => {
              this.tableData[(val.index+(10*(this.currentPage-1)))][key] = ''
            });
            this.$message({
              showClose: true,
              message: "请勿重复添加相同物料",
              type: "warning",
            });
             return
            }
        }
      }
      this.tableData[i].count = "";
      this.tableData[i].price = this.wuziOptions[l].price;
      this.tableData[i].current_inventory = this.wuziOptions[l].count;
      this.tableData[i].total_inventory = this.wuziOptions[l].total_count;
      this.tableData[i].material_name = this.wuziOptions[l].material_name;
      this.tableData[i].specification = this.wuziOptions[l].specification;
      this.tableData[i].measure_unit_name =
        this.wuziOptions[l].measure_unit_name;
      this.tableData[i].brand = this.wuziOptions[l].brand;
      console.log(this.tableData);
      let ids = [];
      this.tableData.forEach((obj) => {
        ids.push(obj.material_id);
      });
      for (var n = 0; n < ids.length; n++) {
        if (ids[n] == "" || typeof(ids[n]) == "undefined"|| ids[n] == null) {
            ids.splice(n, 1);
            n = n - 1;
        }
      }
      ids.forEach((key) => {
        this.wuziOptionMap[key] = this.wuziOptionAllMap[key];
      });
      this.wuziOptions = Object.values(this.wuziOptionMap);
    },
    //获取物资
    getwuzi() {
      this.$client
        .getByPage1TimerHouse({ house_id: this.form.house_id })
        .then((req) => {
          if (req.head.result === "200") {
            let ids = [];
            this.wuziOptions = [];
            this.wuziOptionMap = {};
            this.wuziOptionAllMap = {};
            this.tableData.forEach((obj) => {
              ids.push(obj.material_id);
            });
            for (let n = 0; n < ids.length; n++) {
            if (
              ids[n] == "" ||
              typeof ids[n] == "undefined" ||
              ids[n] == null
            ) {
              ids.splice(n, 1);
              n = n - 1;
            }
          }
            let length = req.context.list.length;
            let allList = req.context.list;
            for (let i = 0; i < length; i++) {
              let item = allList[i];
              if (item.specification == null) {
                item.groupgo =
                  item.material_name + "(" + item.material_code + ")";
              } else {
                item.groupgo =
                  item.material_name +
                  item.specification +
                  "(" +
                  item.material_code +
                  ")";
              }
              this.wuziOptionAllMap[item.material_id] = item;
              if (i < 99) {
                this.wuziOptionMap[item.material_id] = item;
              }
            }
            ids.forEach((key) => {
              this.wuziOptionMap[key] = this.wuziOptionAllMap[key];
            });
            this.wuziOptions = Object.values(this.wuziOptionMap);
            console.log(this.wuziOptionMap);
            // console.log(this.wuziOptionAllMap, this.wuziOptionMap, ids)
          } else {
            // this.$message({ type: "error", message: "获取失败" });
          }
        }).catch(err=>{console.log(err)});
    },
    workcodeChange (val) {
      this.select_lp_num = val
      this.form.lp_num = val
      this.onSelectChange()
    },
    //删除
    deleteSelect() {
      if (this.selectedProjectIds.length == 0) {
        this.$message({
          showClose: true,
          message: "请勾选要删除的选项",
          type: "warning",
        });
        return;
      }
      this.selectedProjectIds.forEach((item, index) => {
        this.deleteRow(item);
      });
    },
     deleteRow(value, rows) {
      //删除改行
      var i = this.tableData.findIndex((item) => {
        return item.material_id == value.material_id;
      });
       const list = this.tableData.slice( (this.currentPage - 1) * this.pagesize,this.currentPage * this.pagesize)
       if(list.length==1 ){
        this.handleCurrentChange(this.currentPage - 1)
      }
         this.tableData.splice(i, 1);
      console.log()
    },
    //选择
    selectedList(projectList) {
      this.selectedProjectIds = [];
      projectList.forEach((item, index) => {
        this.selectedProjectIds.push(item);
      });
      console.log(this.selectedProjectIds, "11111");
      // this.$emit('func',this.selectedProjectIds)
    },
    //新增行
      addData() {
      if (this.form.house_id == "") {
        this.$message({ type: "error", message: "请先选择仓库" });
        this.tableData[i].count = "";
        return;
      }
      if (this.tableData.length > 49) {
        this.$message({ type: "error", message: "物资数量不能超过50" });
        return;
      }
      if(this.tableData.length>0){
       this.tableData.push({provider_id:this.tableData[this.tableData.length - 1].provider_id});
      }else{
        this.tableData.push({})
      }
      // this.tableData[this.tableData.length - 1].provider_id = this.tableData[this.tableData.length - 2].provider_id;
      setTimeout(() => {
        this.$refs.table.gobutton();
        let page = Math.ceil(this.tableData.length / this.pagesize);
        this.handleCurrentChange(page);
      }, 60);
    },
    //获取仓库
    getWarehouse() {
      let params ={
        usable: 1 //1 启用， 2 未启用
      }
      this.$client.getRecord1Warehouse(params).then((req) => {
        if (req.head.result === "200") {
          this.stoneOptions = req.context;
        }
        if (req.context.length == 1) {
          this.form.house_id = req.context[0].id;
          this.getWarehouseperson1(this.form.house_id)
          this.getwuzi()
        }
      });
    },
    //计算和
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价";
          return;
        }
        if (index === 1 || index === 13) {
          sums[index] = "";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    // 取消
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 保存
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tableData.length == 0) {
            this.$message({ type: "error", message: "请添加出库明细" });
            return;
          } else {
            if (
              this.tableData[0].material_id == null ||
              this.tableData[0].price == null ||
              this.tableData[0].count == null
            ) {
              this.$message({ type: "error", message: "数量单价请填写完整" });
              return;
            }
          }
          console.log(this.tableData);
          this.$set(this.form, "details", this.tableData);
          let info = {};
          for (let i in this.form) {
            if (this.form[i]) {
              info[i] = this.form[i];
            }
          }
          if (this.tyreMaintainData.length > 0) {
            info.ImgPaths = this.tyreMaintainData;
          }
          // 维修出库时校验输入的车牌号是否与选择的关联工单车牌号一致
          if (this.form.leave_type == 'WXCK' && this.select_lp_num && this.form.lp_num && this.select_lp_num != this.form.lp_num) {
            return this.$message({ type: "warning", message: "当前关联工单车辆与您选择的车辆不一致，无法保存!"})
          }
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

.el-row{
    display:flex;
    flex-wrap: wrap;
}
.el-dialog-div /deep/ {
  width: 200px;
}

.el-input /deep/ {
  width: 185px;
}

.el-dialog-div {
  display: flex;
}

.el-dialog-div-content {
  height: 550px;
  overflow-y: scroll;
}

.el-dialog-div-image {
  height: 450px;
}
</style>
