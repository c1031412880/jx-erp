<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="beforeDialogClose"
    :close-on-click-modal="false"
    width="90%"
    top="0"
  >
    <div class="el-dialog-div-content">
      <el-card>
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
                  style="width:100%"
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
                  style="width:100%"
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
                  style="width:100%"
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

            <!-- <el-col :span="8">
              <el-form-item label="关联单号:" prop="vehicle_id">
                <el-input
                  :disabled="state_name == '已审核'"
                  v-show="form.leave_type != 'WXCK'"
                  v-model="form.relate_num"
                  style="width:100%"
                ></el-input>
                <workcode-select v-show="form.leave_type == 'WXCK'" style="width:100%" v-model="form.relate_num" ref="workcodeSelect" @on-change="workcodeChange"></workcode-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="车牌号:" prop="vehicle_id">
                <div style="display:flex" v-show="form.out_vehicle == '2'">
                  <!-- <el-select v-model="car_type" style="width: 100px" @change="form.lp_num = ''">
                    <el-option label="车牌号" :value="1"></el-option>
                    <el-option label="自编号" :value="2"></el-option>
                  </el-select> -->
                  <get-vehicle-select-tree
                    :disabled="state_name == '已审核'"
                    ref="vehicleTree"
                    :placeholder="'选择车辆'"
                    :isShowCheckbox="false"
                    @on-change="onSelectChange"
                    :isExportMultiple="false"
                    v-model="form.lp_num"
                    style="width:100%"
                  >
                  </get-vehicle-select-tree>
                  <!-- <get-vehicle-select-tree
                    :disabled="state_name == '已审核'"
                    v-if="car_type == 2"
                    ref="vehicleTree"
                    :placeholder="'选择车辆'"
                    :isShowCheckbox="false"
                    @on-change="onSelectChange"
                    :isExportMultiple="false"
                    v-model="form.lp_num"
                    style="width:100%"
                    :car_type="2"
                  >
                  </get-vehicle-select-tree> -->
                </div>
                <el-input
                  :disabled="state_name == '已审核'"
                  v-show="form.out_vehicle == '1'"
                  v-model="form.lp_num"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="外部车辆:">
                <el-checkbox
                  :disabled="state_name == '已审核'"
                  :true-label="1"
                  :false-label="2"
                  v-model="form.out_vehicle"
                ></el-checkbox>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="线路名:">
              <el-input disabled v-model="form.line_name" placeholder=""></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="领料用途:">
                <get-select-dictionaries
                  style="width:100%"
                  :disabled="state_name == '已审核'"
                  v-model="form.use_way"
                  :classKey="'领料用途'"
                  :placeholder="'请选择领料用途'"
                ></get-select-dictionaries>
              </el-form-item>
            </el-col>
            <!--
            <el-col :span="8">
              <el-form-item label="仓管员:">
                <el-select
                  :disabled="state_name == '已审核'"
                  v-model="form.storage_id"
                  clearable
                  style="width:100%"
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
                  style="width:100%"
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
            </el-col> -->
            <!-- <el-col :span="8">
              <el-form-item label="领料组织:">
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
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="供应商:" prop="provider_id">
                <el-select
                  :disabled="state_name == '已审核'"
                  v-model="form.provider_id"
                  filterable
                  clearable
                  @change="tableData = []"
                  placeholder="请选择"
                  style="width:100%"
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
            <el-col :span="8" style="margin-bottom: 20px">
              <el-form-item label="总金额:" prop="total_fee">
                <el-input disabled v-model="form.total_fee"></el-input>
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
            <el-col :span="24" style="margin-bottom: 20px">
              <image-file-upload 
                :images="form.img_list"
                :files="form.file_list"
                :isEdit="true"
                @files-update-success="filesUpdateSuccess"
                @images-update-success="imagesUpdateSuccess"></image-file-upload>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card style="margin-top: 10px">
        <!-- <el-button
          type="primary"
          size="mini"
          :disabled="state_name == '已审核'"
          @click="addData"
          >添加出库明细</el-button
        > -->
        <el-button
          type="primary"
          size="mini"
          @click="openMaterials"
          >添加出库明细</el-button
        >
        <!-- <el-button
          type="primary"
          size="mini"
          @click="openStock"
          >关联入库单</el-button
        > -->
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
            :TableHeight="TableHeight"
            @on-select-change-row="selectedList"
            :sumColumnIndex="[5,7]"
            :sumTotal="sumTotal"
            ref="table"
            :isFixedEmptyPlaceholder="false"
          >
            <template slot-scope="scope" slot="material_id">
              <el-select
                :disabled="state_name == '已审核'"
                v-model="scope.data.material_id"
                :autofocus="true"
                size="mini"
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
              <el-input
                v-model="scope.data.count"
                @change="priceChange(scope.data,scope.index)"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                style="width: 100px"
                @blur="scope.data.count = $event.target.value"
              ></el-input>
            </template>
            <!-- <template slot-scope="scope" slot="price">
              <el-input
                v-model="scope.data.price"
                @change="priceChange(scope.data,scope.index)"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                style="width: 100px"
                @blur="scope.data.price = $event.target.value"
              ></el-input>
            </template> -->
            <template slot-scope="scope" slot="remark">
              <el-input
                :disabled="state_name == '已审核'"
                v-model="scope.data.remark"
                maxlength="8"
                size="mini"
              ></el-input>
            </template>
            <!-- <template slot-scope="scope" slot="total_price">
              <el-input-number
                disabled
                v-model="scope.data.total_price"
                :precision="2"
                :controls="false"
                :min="0"
                size="mini"
              ></el-input-number>
            </template> -->
            <!-- <template slot-scope="scope" slot="batch_no">
              <span v-if="scope.data.batch_no">{{ scope.data.batch_no }}</span>
              <span v-else>系统自动生成</span>
            </template> -->
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
            :page-sizes="[30]"
            :page-size="pagesize"
            :total="tableData.length"
            layout="total, sizes, prev, pager, next, jumper"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>
    <el-card style="margin-top: 10px;max-height: 330px;overflow: auto" v-if="!caudalAddition && curSelecedType !== 'edit'">
      <approve-step 
        ref="approveStep"
        :key="key" 
        @on-users="setUsers" 
        :form_data="form_data" 
        :object_id="1460">
      </approve-step>
    </el-card>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" v-if="!caudalAddition && !again && curSelecedType !== 'edit'" @click="submit()" v-loading="updateLoading">保存草稿</el-button>
      <!-- 撤销 -->
      <el-button type="primary" v-if="!caudalAddition && curSelecedType !== 'edit'" @click="ok(1)" v-loading="updateLoading">提交并关闭</el-button>
      <el-button type="primary" v-if="!caudalAddition && curSelecedType !== 'edit'" @click="ok(2)" v-loading="updateLoading">继续提交</el-button>
      <!-- 退回至发起人  -->
      <el-button type="primary" v-if="caudalAddition" @click="returnSubmission()" v-loading="updateLoading">提 交</el-button>
      <!-- 编辑后的提交  -->
      <el-button type="primary" v-if="curSelecedType == 'edit'" @click="saveEdit()" v-loading="updateLoading">提 交</el-button>
    </span>

    <el-dialog
      title="选择物料"
      append-to-body
      fullscreen
      :visible.sync="dialogVisible">
      <materials-box 
        ref="materials-box" 
        @on-save="saveMaterials"
        :house_id="form.house_id"
        :tireID="tireID"
      ></materials-box>
    </el-dialog>

    <el-dialog
      title="选择入库单"
      append-to-body
      fullscreen
      :visible.sync="stockdialogVisible">
      <stock-box 
        ref="stock-box" 
        @on-save="saveStocks"
        :house_id="form.house_id"
      ></stock-box>
    </el-dialog>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { formatDate } from "@/utils/index";
import { getSession, getUser } from "@/utils/auth";
import imageListUpload from "@/components/imageListUpload";
import getUserSelect from "components/base/formModel/tree/get-user-select";
import getTyreModel from "@/components/base/formModel/select/get-tyre-model";
import getVehicleSelectTree from "./get-vehicle-number-tree";
import workcodeSelect from "./workcode-select";
import getTyreCode from "@/components/base/formModel/select/get-tyre-code";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import approveStep from '@/components/approve-echo/approve-step2'
import { formatTime, deepCopy, isObjectChanged } from "@/utils/index"
import imageFileUpload from "@/components/imageFileUpload/index-c";
import materialsBox from "../materials-box"
import stockBox from "../stock-box"
export default {
  components: {
    getDepartmentSelect,
    getUserSelect,
    imageListUpload,
    getTyreModel,
    getVehicleSelectTree,
    getTyreCode,
    getSelectDictionaries,
    workcodeSelect,
    approveStep,
    imageFileUpload,
    materialsBox,
    stockBox
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
    again: {
      type: Boolean,
      default: false
    },
    isCommit: {
      type: Boolean,
      default: false
    },
    // 区分 撤销还是退回至发起人    控制流程和草稿按钮
    caudalAddition: {
      type: Boolean,
      default: false
    },
    // 物料id     目前只给轮胎用
    tireID: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      pagesize: 30, //默认分页每页数据量
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
        leave_type: "YBCK",
        leave_date: formatDate(new Date(),'yyyy-MM-dd'),
        house_id: "",
        relate_num: "",
        lp_num: "",
        storage_id: "",
        pick_id: "",
        pick_depatment_id: "",
        remark: "",
        total_fee: "",
        details: [],
        img_list: [],
        file_list: []
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
        // pick_id: [
        //   {
        //     required: true,
        //     message: "请选择领料员",
        //     trigger: "blur",
        //   },
        // ],
      },
      buyerList: [],
      Modeoptions: [
        { value: "YBCK", label: "一般出库" },
        { value: "WXCK", label: "维修出库" },
        { value: "DBCK", label: "调拨出库" },
        // { value: "PYCK", label: "盘盈出库" },
        { value: "HCCK", label: "红冲出库" },
        { value: "GTCK", label: "公摊出库" },
      ],
      tyreMaintainData: [],
      picturePathList: [],
      tableData: [],
      gongysOptions: [],
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
          label: "申请出库数量",
          prop: "count",
          width: "160",
          align: "center",
          signIndex: 4,
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
          id: 6,
          label: "单价",
          prop: "price",
          width: "160",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "金额",
          prop: "total_price",
          width: "160",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        // {
        //   id: 8,
        //   label: "品牌",
        //   prop: "brand",
        //   width: "120",
        //   align: "center",
        //   signIndex: 7,
        //   sortable: false,
        // },
        // {
        //   id: 10,
        //   label: "当前仓库库存",
        //   prop: "current_inventory",
        //   width: "150",
        //   align: "center",
        //   signIndex: 9,
        //   sortable: false,
        // },
        // {
        //   id: 11,
        //   label: "全部仓库库存",
        //   prop: "total_inventory",
        //   width: "150",
        //   align: "center",
        //   signIndex: 10,
        //   sortable: false,
        // },
        {
          id: 12,
          label: "批次",
          prop: "vendor",
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

      loadind: false,
      updateLoading: false,
      key: null,
      form_data: null,

      isShowSetInfoDialog: false,
      TableHeight: 250,
      dialogVisible: false,
      stockdialogVisible: false,

      car_type: 2,
      sumTotal: {
        5: 0,
        7: 0,
      }
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
        if (!this.again && this.curSelecedType != 'edit') {
          this.GetDraftRecordFlowManage()
        }
        if(!this.isCommit) {
            this.dateChange()
          }
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
    // 打开入库单
    openStock() {
      if (this.form.house_id == "") {
        this.$message({ type: "error", message: "请先选择仓库" });
        return;
      }
      if (this.tableData.length > 49) {
        this.$message({ type: "error", message: "物资数量不能超过50" });
        return;
      }
      this.stockdialogVisible = true

      setTimeout(() => {
        this.$refs['stock-box'].loadData()
      }, 300);
    },
    saveStocks(list) {
      if (list.length > 0) {
        let L = this.tableData.length + list.length
        if (L > 49) {
          this.$message({ type: "error", message: "物资数量不能超过50,已截取前49项" });
          list = list.slice(0, 49 - this.tableData.length)
        }
        list.forEach(item => {
          let obj = {
            material_id: item.material_id,
            material_name: item.material_name,
            specification: item.specification,
            measure_unit_name: item.measure_unit_name,
            // brand: item.brand,
            count: item.count,
            price: item.price || 0,
            provider_id: this.form.provider_id,
            total_price: item.count * item.price || 0 ,
            // current_inventory: item.count,
            // total_inventory: item.all_inventory,
            // batch_no: item.batch_no,
            remark: item.remark,
          }
          this.tableData.push(obj)
        })
      }
      this.countHeight()
      this.stockdialogVisible = false
      setTimeout(() => {
        this.$refs.table.gobutton();
        let page = Math.ceil(this.tableData.length / this.pagesize);
        this.handleCurrentChange(page);
      }, 60);
    },
    saveEdit() {
      this.outData().then(res => {
        this.updateLoading = true
        let formData = res.form
        formData.details = this.tableData
        this.$emit("on-save",formData)
      }).catch(err => {
        console.log(err);
        this.$message({
          showClose: true,
          message: err.msg,
          type: "warning",
        });
      })
    },
    saveMaterials(list) {
      if (list.length > 0) {
        let L = this.tableData.length + list.length
        if (L > 49) {
          this.$message({ type: "error", message: "物资数量不能超过50,已截取前49项" });
          list = list.slice(0, 49 - this.tableData.length)
        }
        list.forEach(item => {
          let obj = {
            material_id: item.material_id,
            material_name: item.material_name,
            specification: item.specification,
            measure_unit_name: item.measure_unit_name,
            // brand: item.brand,
            count: item.count,
            price: item.price || 0,
            provider_id: this.form.provider_id,
            total_price: item.count * item.price || 0 ,
            // current_inventory: item.count,
            // total_inventory: item.all_inventory,
            // batch_no: item.batch_no,
            remark: item.remark,
          }
          this.tableData.push(obj)
        })
      }
      this.countHeight()
      this.dialogVisible = false
      setTimeout(() => {
        this.$refs.table.gobutton();
        let page = Math.ceil(this.tableData.length / this.pagesize);
        this.handleCurrentChange(page);
      }, 60);
    },
    // 打开物资选择
    openMaterials() {
      if (this.form.house_id == "") {
        this.$message({ type: "error", message: "请先选择仓库" });
        return;
      }
      if (this.tableData.length > 49) {
        this.$message({ type: "error", message: "物资数量不能超过50" });
        return;
      }
      this.dialogVisible = true

      setTimeout(() => {
        this.$refs['materials-box'].reqOrgProjectList()
      }, 300);
    },
    // 计算表格高度
    countHeight() {
      if (this.tableData.length === 0) {
        this.TableHeight = 150
      } else if (this.tableData.length > 30) {
        this.TableHeight = 30 * 50 + 100
      } else {
        this.TableHeight = this.tableData.length * 50 + 100
      }
    },
    // 退回至发起人的重新提交    只改表单不改流程
    returnSubmission(){
      this.outData().then(res => {
        res.form.details = this.tableData
        let parmas = {
          context: res.form
        };
        this.$client.setRecordLeaveHouse(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.dialogClose() 
            this.$emit('on-update')
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      }).catch(err => {
        console.log(err);
        this.$message({
          showClose: true,
          message: err.msg,
          type: "warning",
        });
      })
      
    },
    // 新增物资
    addMaterials() {
      this.isShowSetInfoDialog = true;
    },
    // 添加
    saveAddEdit(form) {
      let successrMessage = '添加成功';
      let params = {
        context: form
      }
      this.$client
        .setRecordMaterial(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.isShowSetInfoDialog = false;
            this.getwuzi();
            this.$message({
              showClose: true,
              message: successrMessage,
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
    },
    // 获取草稿详情
    GetDraftRecordFlowManage() {
      this.$client.GetDraftRecordFlowManage({type: 1460}).then(res => {
        if(res.head.result == '200') {
          let info = res.context
          if(!!info) {
            for (const key in this.form) {
              if (Object.hasOwnProperty.call(info, key)) {
                this.form[key] = info[key];
              }
            }
            this.tableData = info.details
            this.countHeight()
          }
          this.getWarehouseperson1(this.form.house_id);
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
        this.oldForm = deepCopy(this.form)
        this.dateChange()
      })
    },
    //  保存草稿时的校验   必填项只要有一个填了  即可保存草稿   除申请人和申请部门
    saveDraft() {
      return new Promise((resolve,reject) => {
        let data = []
        for (const key in this.basicRules) {
          data.push(key)
        }
        let validList = []
        this.$refs.form.validateField(data,(valid) =>{
          validList.push(valid)
        })
        console.log('validList',validList);
        // 判断是否有已填写项   只要有一个就可以走保存
        if (validList.includes('')) {
          resolve({
            form: this.form
          });
        }else {
          reject({
            msg: '必须填写一项必填项才可保存草稿'
          });
          return false;
        }
      })
    },
    // 修改流程
    dateChange() {
      let form =  Object.assign({}, this.form)
      this.form_data = form
      this.key = new Date().getTime()
    },
    submit(){
      if (this.updateLoading) {
        return false
      }
      this.saveDraft().then(res => {
        let formData = res.form
        this.updateLoading = true
        this.save(formData)
      }).catch(err => {
        console.log(err);
        this.$message({
          showClose: true,
          message: err.msg,
          type: "warning",
        });
      })
    },
    // 保存草稿
    save(formData) {
      formData.details = this.tableData
      let params = {
        type: 1460,
        data: formData
      }
      this.$client.AddDraftFlowManage(params)
      .then(req => {
        this.updateLoading = false
        if (req.head.result === "200") {
          this.dialogClose()
          this.$message({message: req.head.describle, type: "success",});
        } else {
          this.$message({message: req.head.describle, type: "error",});
        }
      }).catch(e => {
        this.updateLoading = false
        this.dialogClose()
        this.$message({message: '服务异常', type: "error",});
      })
    },
    // 合并表单值
    outData() {
      return new Promise((resolve, reject) => {
        if (this.tableData.length === 0) {
          reject({
            msg: '出库单明细不能为空'
          });
          return false;
        }
        this.$refs.form.validate((valid) => {
          if (valid) {
            resolve({
              form: this.form
            });
          } else {
            reject({
              msg: '获取失败,带星号的为必填项'
            });
            return false;
          }
        });
      });
    },
    // 提交
    ok(type) {
      let step_data = this.nodes
      if (this.updateLoading) {
        return false
      }
      this.outData().then(res => {
        this.updateLoading = true
        let formData = res.form
        formData.details = this.tableData
        console.log('formData',formData);
        this.$client.AddByFlowLeaveHouse({context: {
          form_data: formData,
          step_data: step_data,
        }}).then(req => {
          this.updateLoading = false
          if (req.head.result === "200") {
            this.$emit('on-load')
            if (type == 1) {
              this.dialogClose()
            } else {
              this.initData()
            }
          } else {
            this.updateLoading = false
            this.$message({message: req.head.describle, type: "error",});
          }
        }).catch(e => {
          this.updateLoading = false
          this.$message({message: '服务异常', type: "error",});
        })
      }).catch(err => {
        console.log(err);
        this.$message({
          showClose: true,
          message: err.msg,
          type: "warning",
        });
      })
    },
    // 继续提交 清空数据
    initData() {
      let form =  {
        use_way: "",
        out_vehicle: "2",
        line_name:'',
        line_id:'',
        leave_type: this.form.leave_type,
        leave_date: this.form.leave_date,
        house_id: this.form.house_id,
        relate_num: "",
        lp_num: "",
        storage_id: "",
        pick_id: "",
        pick_depatment_id: "",
        remark: "",
        details: [],
        img_list: [],
        file_list: []
      }
      this.tableData = []
      this.form = form
    },
    // 关闭审批单
    beforeDialogClose() {
      if (this.caudalAddition && this.curSelecedType == 'edit') {
        this.dialogClose() 
      }
      if (this.updateLoading) {
        return false
      }
      let form = this.form
      let oldForm = this.oldForm
      // 判断数据是否存在修改
      if (isObjectChanged(form,oldForm)) {
        this.$confirm('是否需要保存草稿?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.saveDraft().then(res => {
              let formData = res.form
              this.updateLoading = true
              this.save(formData)
            }).catch(err => {
              console.log(err);
              this.$message({
                showClose: true,
                message: err.msg,
                type: "warning",
              });
            })
          }).catch(() => {
            this.dialogClose() 
          });
      } else {
        this.dialogClose()
      }
    },
    setUsers(data) {
      this.nodes = data
    },
    // 上传图片
    imagesUpdateSuccess(val) {
      let url = ''
      let list = []
      val.forEach(item => {
        url = item.url ? item.url : item
        list.push(url)
      })
      this.form.img_list = list
    },
    // 上传文件
    filesUpdateSuccess(filesList) {
      this.form.file_list = filesList;
      // console.log(this.form, filesList);
    },


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
      this.$client.GetProviderPage({type: 2}).then((req) => {
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
    priceChange(val,i) {
      let index = (this.currentPage - 1) * 30 + i
      //获取下标
      // if (this.tableData[0].id) {
      //   var i = this.tableData.findIndex((item) => {
      //     return item.material_id == val.material_id;
      //   });
      // } else {
      //   var i = this.tableData.findIndex((item) => {
      //     return item.material_id == val.material_id;
      //   });
      // }
      if (this.tableData[index].count && this.tableData[index].price) {
        this.tableData[index].total_price =
          this.tableData[index].count * this.tableData[index].price;
      }
      this.getAllfee()
      this.dateChange()
    },
    // 获取总金额
    getAllfee() {
      this.form.total_fee = 0
      this.sumTotal = {
        5: 0,
        7: 0,
      }
      this.tableData.forEach(item => {
        this.form.total_fee += Number(item.total_price)
        this.sumTotal[5] += Number(item.count)
        this.sumTotal[7] += Number(item.total_price)
      })
    },
    // remoteMethod(query) {
    //   if (query !== "") {
    //     this.loading = true;
    //     // let Options = []
    //     setTimeout(() => {
    //       this.loading = false;
    //       this.wuziOptions = Object.values(this.wuziOptionAllMap).filter(
    //         (item) => {
    //           return item.groupgo.toLowerCase().indexOf(query.toLowerCase()) > -1;
    //         }
    //       );
    //       // this.wuziOptions=this.wuziOptions.concat( Options)
    //       // this.wuziOptions= this.unique(this.wuziOptions);
    //     }, 200);
    //   } else {
    //     this.wuziOptions = [];
    //   }
    // },
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
      //   for (var o=0; o<this.tableData.length; o++) {
      //   for (var j=o+1; j<this.tableData.length; j++) {
      //     if (this.tableData[o].material_id == this.tableData[j].material_id&&this.tableData[o].material_id!=null) {
      //       Object.keys(this.tableData[(val.index+(10*(this.currentPage-1)))]).forEach((key) => {
      //         this.tableData[(val.index+(10*(this.currentPage-1)))][key] = ''
      //       });
      //       this.$message({
      //         showClose: true,
      //         message: "请勿重复添加相同物料",
      //         type: "warning",
      //       });
      //        return
      //       }
      //   }
      // }
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
      // let ids = [];
      // this.tableData.forEach((obj) => {
      //   ids.push(obj.material_id);
      // });
      // for (var n = 0; n < ids.length; n++) {
      //   if (ids[n] == "" || typeof(ids[n]) == "undefined"|| ids[n] == null) {
      //       ids.splice(n, 1);
      //       n = n - 1;
      //   }
      // }
      // ids.forEach((key) => {
      //   this.wuziOptionMap[key] = this.wuziOptionAllMap[key];
      // });
      // this.wuziOptions = Object.values(this.wuziOptionMap);
    },
    //获取物资
    getwuzi() {
      let params  = {
          usable: 1,
          main_name:'轮胎'
        }
      // if (this.tireID) {
      //   params = {
      //     house_id: this.form.house_id,
      //     group_id: this.tireID,
      //   }
      // } else {
      //   params = {
      //     house_id: this.form.house_id,
      //   }
      // }
      this.$client
        .getMaterialPage(params)
        .then((req) => {
          if (req.head.result === "200") {
          //   let ids = [];
          //   this.wuziOptions = [];
          //   this.wuziOptionMap = {};
          //   this.wuziOptionAllMap = {};
          //   this.tableData.forEach((obj) => {
          //     ids.push(obj.material_id);
          //   });
          //   for (let n = 0; n < ids.length; n++) {
          //   if (
          //     ids[n] == "" ||
          //     typeof ids[n] == "undefined" ||
          //     ids[n] == null
          //   ) {
          //     ids.splice(n, 1);
          //     n = n - 1;
          //   }
          // }
          //   let length = req.context.list.length;
          //   let allList = req.context.list;
          //   for (let i = 0; i < length; i++) {
          //     let item = allList[i];
          //     if (item.specification == null) {
          //       item.groupgo =
          //         item.material_name + "(" + item.material_code + ")";
          //     } else {
          //       item.groupgo =
          //         item.material_name +
          //         item.specification +
          //         "(" +
          //         item.material_code +
          //         ")";
          //     }
          //     this.wuziOptionAllMap[item.material_id] = item;
          //     if (i < 99) {
          //       this.wuziOptionMap[item.material_id] = item;
          //     }
          //   }
          //   ids.forEach((key) => {
          //     this.wuziOptionMap[key] = this.wuziOptionAllMap[key];
          //   });
            // this.wuziOptions = Object.values(this.wuziOptionMap);
            this.wuziOptions = req.context.list
            this.wuziOptions.forEach(item => {
              item.groupgo = item.code
            })
            // console.log(this.wuziOptionMap);
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
      this.countHeight()
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
        // let page = Math.ceil(this.tableData.length / this.pagesize);
        // this.handleCurrentChange(page);
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
        if (req.context.length > 0) {
          req.context.forEach(item => {
              if (item.is_default === 1) {
                this.form.house_id = item.id
              }
            })
          }
          this.getWarehouseperson1(this.form.house_id)
          this.getwuzi()
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
// .el-dialog-div /deep/ {
//   width: 200px;
// }

// .el-input /deep/ {
//   width: 185px;
// }

.el-dialog-div {
  display: flex;
}

// .el-dialog-div-content {
//   height: 550px;
//   overflow-y: scroll;
// }

.el-dialog-div-image {
  height: 450px;
}
</style>
