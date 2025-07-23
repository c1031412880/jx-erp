<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="90%"
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
            <el-form-item label="入库方式:" prop="enter_type">
              <el-select
                :disabled="state == '2'"
                v-model="form.enter_type"
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
            <el-form-item label="入库日期:" prop="enter_date">
              <el-date-picker
                :disabled="state == '2'"
                v-model="form.enter_date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="仓库:" prop="house_id">
              <el-select
                @change="getWarehouseperson"
                :disabled="state == '2'"
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

          <el-col :span="8">
            <el-form-item label="关联单号:" prop="vehicle_id">
              <el-input
                :disabled="state == '2'"
                v-model="form.relate_num"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓管员:" prop="vehicle_id">
              <el-select
                :disabled="state == '2'"
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
            <el-form-item label="采购员:" prop="vehicle_id">
              <!-- <get-user-select
                  :disabled="state=='2'"
                 ref="persontree1"
                v-model="form.buyer_id"
                :isShowCheckbox="false"
                :placeholder="'请选择领料员'"
                :isExportMultiple="false"
              >
              </get-user-select> -->
              <el-select
                filterable
                :disabled="state == '2'"
                v-model="form.buyer_id"
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
            <el-form-item label="备注:" prop="vehicle_id">
              <el-input
                :disabled="state == '2'"
                v-model="form.remark"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商:" prop="vehicle_id">
              <el-select
               :disabled="state == '2'"
                v-model="form.provider_id"
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
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button
        type="primary"
        size="mini"
        :disabled="state == '2' || state == '3'"
        @click="addData"
        :loading="loadind"
        >添加入库明细</el-button
      >
      <el-button
        style="margin-bottom: 10px"
        :disabled="state == '2' || state == '3'"
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
          :TableHeight="280"
          @on-select-change-row="selectedList"
          ref="table"
          :omitColumnIndex="[2, 3, 4, 5, 6, 8, 10, 11, 12, 13, 14]"
        >
          >
          <template slot-scope="scope" slot="material_id">
            <el-select
              :disabled="state == '2' || state == '3'"
              :autofocus="true"
              v-model="scope.data.material_id"
              size="mini"
              :remote-method="remoteMethod"
              filterable
              remote
              @change="changeData(scope)"
              placeholder="请选择"
            >
              <el-option
                v-for="item in wuziOptions"
                :key="item.id"
                :label="item.groupgo"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope" slot="count">
            <el-input-number
              :disabled="state == '2'"
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
              :disabled="state == '2'"
              v-model="scope.data.price"
              :precision="2"
              :controls="false"
              @change="priceChange(scope.data)"
              :min="0"
              size="mini"
            ></el-input-number>
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
          <template slot-scope="scope" slot="cost_price">
            <el-input-number
              :disabled="state == '2'"
              v-model="scope.data.cost_price"
              :precision="2"
              :controls="false"
              @change="priceChange(scope.data)"
              :min="0"
              size="mini"
            ></el-input-number>
          </template>
          <template slot-scope="scope" slot="cost_total_price">
            <el-input-number
              disabled
              v-model="scope.data.cost_total_price"
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
          <template slot-scope="scope" slot="origin_code">
            <el-input
              :disabled="state == '2' || state == '3'"
              size="mini"
              v-model="scope.data.origin_code"
            ></el-input>
          </template>
          <template slot-scope="scope" slot="position">
            <el-input
              :disabled="state == '2' || state == '3'"
              size="mini"
              v-model="scope.data.position"
            ></el-input>
          </template>
          <template slot-scope="scope" slot="remark">
            <el-input
              :disabled="state == '2' || state == '3'"
              size="mini"
              v-model="scope.data.remark"
            ></el-input>
          </template>
          <template slot-scope="scope" slot="provider_id">
            <el-select
              :disabled="state == '2' || state == '3'"
              @change="providerChange(scope)"
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
      <el-button type="primary" @click="updatePlaybill('form')"
        >保 存</el-button
      >
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { formatDateTime } from "@/utils/index";
import { getSession, getUser } from "@/utils/auth";
import imageListUpload from "@/components/imageListUpload";
import getUserSelect from "components/base/formModel/tree/get-warehouse-select";
import getWarehouseSelect from "components/base/formModel/tree/get-warehouse-select";
import getTyreModel from "@/components/base/formModel/select/get-tyre-model";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getTyreCode from "@/components/base/formModel/select/get-tyre-code";
export default {
  components: {
    getUserSelect,
    getWarehouseSelect,
    imageListUpload,
    getTyreModel,
    getVehicleSelectTree,
    getTyreCode,
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  // mounted() {
  //   // let userInfo = JSON.parse(getUser());
  //   // this.form.storage_id = Number(userInfo.user_id)
  // },
  data() {
    return {
      warehouseList: [],
      state: "",
      pagesize: 10, //默认分页每页数据量
      currentPage: 1, //默认展示第一页数据
      form: {
        enter_type: "CGRK",
        enter_date: formatDateTime(new Date()),
        relate_num: "",
        storage_id: "",
        buyer_id: "",
        remark: "",
        provider_id:"",
        house_id: "",
        state: "",
      },
      buyerList: [],
      gongysOptions: [],
      stoneOptions: [],
      basicRules: {
        enter_type: [
          {
            required: true,
            message: "请选择入库方式",
            trigger: "blur",
          },
        ],
        enter_date: [
          {
            required: true,
            message: "请输入入库时间",
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
      },
      Modeoptions: [
        { value: "YBRK", label: "一般入库" },
        { value: "CGRK", label: "采购单入库" },
        { value: "DBRK", label: "调拨入库" },
        // { value: "PYRK", label: "盘盈入库" },
        { value: "HCRK", label: "红冲入库" },
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
          label: "*物料编码",
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
          label: "*申请入库数量",
          prop: "count",
          width: "160",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "*销售单价",
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
          label: "成本单价",
          prop: "cost_price",
          width: "160",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "成本金额",
          prop: "cost_total_price",
          width: "160",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "批次",
          prop: "batch_no",
          width: "100",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "供应商",
          prop: "provider_id",
          width: "150",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "原始物料编码",
          prop: "origin_code",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "仓位",
          prop: "position",
          width: "90",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
      ],
      loadind: false
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());

        //  this.$refs.persontree.onClear();
        //  this.$refs.persontree1.onClear();
        //  let userInfo = JSON.parse(getUser());
        //  this.form.storage_id = Number(userInfo.user_id)
      } else {
        this.getGinsang();
        this.getWarehouse();
        setTimeout(() => {
          this.getWarehouseperson1(this.form.house_id);
          this.getwuzi();
        }, 300);
        this.$nextTick(() => {
          this.$refs["form"].clearValidate();
        });
      }
    },
  },
  mounted() {
    // this.getdate()
  },
  methods: {
    handleSizeChange: function (val) {
      this.pagesize = val;
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
    },
    //获取时间
    // getdate(){
    //    this.form.enter_date = formatDateTime(new Date())
    // },
    //供应商
    getGinsang() {
      this.$client.GetProviderPage().then((req) => {
        if (req.head.result === "200") {
          this.gongysOptions = req.context.list;
        } else {
          this.$message({ type: "error", message: "获取失败" });
        }
      });
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
      this.tableData[i].total_price =
        (this.tableData[i].count * this.tableData[i].price).toFixed(2);
        if(this.tableData[i].cost_price){
        this.tableData[i].cost_total_price =
        (this.tableData[i].count * this.tableData[i].cost_price).toFixed(2);
        }else{
          this.tableData[i].cost_total_price= ''
        }
    },
    unique(arr) {
      // 根据唯一标识no来对数组进行过滤
      const res = new Map(); //定义常量 res,值为一个Map对象实例 //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1));
    },
    remoteMethod(query) {
      if (query !== "") {
        // this.loading = true;
        // let Options = []
        setTimeout(() => {
          // this.loading = false;
          this.wuziOptions = Object.values(this.wuziOptionAllMap).filter(
            (item) => {
              return (
                item.groupgo.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            }
          );
          // this.wuziOptions=this.wuziOptions.concat( Options)
          // this.wuziOptions= this.unique(this.wuziOptions);
        }, 200);
      } else {
        this.wuziOptions = [];
      }
    },
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
      if (this.wuziOptions[0].id) {
        var l = this.wuziOptions.findIndex((item) => {
          return item.id == val.data.material_id;
        });
      } else {
        var l = this.wuziOptions.findIndex((item) => {
          return item.id == val.data.material_id;
        });
      }
      // var requir = this.tableData.findIndex((item) => {
      //   return item.material_id == this.tableData[i].material_id;
      // });

      // if (requir > -1 && requir != (val.index + 10 * (this.currentPage - 1))) {
      //   //  this.tableData[(val.index+(10*(this.currentPage-1)))] = {}
      //   Object.keys(this.tableData[(val.index+(10*(this.currentPage-1)))]).forEach((key) => {
      //     this.tableData[(val.index+(10*(this.currentPage-1)))][key] = ''
      //   });
      //   this.$message({
      //     showClose: true,
      //     message: "请勿重复添加相同物料",
      //     type: "warning",
      //   });
      //   return;
      // }

      for (var o = 0; o < this.tableData.length; o++) {
        for (var j = o + 1; j < this.tableData.length; j++) {
          if (
            this.tableData[o].material_id == this.tableData[j].material_id &&
            this.tableData[o].material_id != null
          ) {
            Object.keys(
              this.tableData[val.index + 10 * (this.currentPage - 1)]
            ).forEach((key) => {
              this.tableData[val.index + 10 * (this.currentPage - 1)][key] = "";
            });
            this.$message({
              showClose: true,
              message: "请勿重复添加相同物料",
              type: "warning",
            });
            return;
          }
        }
      }
      this.tableData[i].material_name = this.wuziOptions[l].name;
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
        if (ids[n] == "" || typeof ids[n] == "undefined" || ids[n] == null) {
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
      this.loadind = true
      this.$client.getMaterialPage({ usable: 1 }).then((req) => {
        if (req.head.result === "200") {
          let ids = [];
          this.wuziOptionMap = {};
          this.wuziOptionAllMap = {};
          this.tableData.forEach((obj) => {
            ids.push(obj.material_id);
          });
          for (var n = 0; n < ids.length; n++) {
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
          for (var i = 0; i < length; i++) {
            let item = allList[i];
            if (item.specification == null) {
              item.groupgo = item.name + "(" + item.code + ")";
            } else {
              item.groupgo =
                item.name + item.specification + "(" + item.code + ")";
            }
            this.wuziOptionAllMap[item.id] = item;
            if (i < 99) {
              this.wuziOptionMap[item.id] = item;
            }
          }
          ids.forEach((key) => {
            this.wuziOptionMap[key] = this.wuziOptionAllMap[key];
          });
          this.wuziOptions = Object.values(this.wuziOptionMap);
          // console.log(this.wuziOptionAllMap, this.wuziOptionMap, ids)
          this.loadind = false
        } else {
          this.$message({ type: "error", message: "获取失败" });
        }
      });
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
      const list = this.tableData.slice(
        (this.currentPage - 1) * this.pagesize,
        this.currentPage * this.pagesize
      );
      if (list.length == 1) {
        this.handleCurrentChange(this.currentPage - 1);
      }
      this.tableData.splice(i, 1);
      console.log();
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
      if (this.tableData.length > 0) {
        this.tableData.push({
          provider_id: this.tableData[this.tableData.length - 1].provider_id,
        });
      } else {
        if(this.form.provider_id!=""){
        this.tableData.push({
          provider_id: this.form.provider_id,
        });
        }else{
          this.tableData.push({});
        }
      }
      // this.tableData[this.tableData.length - 1].provider_id = this.tableData[this.tableData.length - 2].provider_id;
      setTimeout(() => {
        this.$refs.table.gobutton();
        let page = Math.ceil(this.tableData.length / this.pagesize);
        this.handleCurrentChange(page);
      }, 60);
    },
    //获取仓管员
    getWarehouseperson(val) {
      this.form.storage_id = "";
      this.warehouseList = [];
      this.buyerList = [];
      this.buyer_id = "";
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
    },
    //获取仓库
    getWarehouse() {
      let params ={
        usable: 1 //1 启用， 2 未启用
      }
      this.$client.getRecord1Warehouse(params).then((req) => {
        if (req.head.result === "200") {
          this.stoneOptions = req.context;
          if (req.context.length > 0) {
            this.form.house_id = req.context[0].id;
          }
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
          console.log(this.tableData);
          if (this.tableData.length == 0) {
            this.$message({ type: "error", message: "请添加入库明细" });
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
  height: 500px;
  overflow-y: scroll;
}

.el-dialog-div-image {
  height: 450px;
}
</style>
