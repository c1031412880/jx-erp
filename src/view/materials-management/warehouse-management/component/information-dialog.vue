<template>
  <tr-dialog
    :visible="dialogBool"
    :title="title"
    @before-close="dialogClose"
    @change-full="dialogFull"
    ref="trDialog"
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
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="出库方式:" prop="leave_type">
              <el-select
                :disabled="curSelecedType == 'detail'"
                v-model="form.leave_type"
                clearable
                style="width: 100%;"
              >
                <el-option
                  v-for="item in Modeoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :style="item.isRed ? 'color: #f56c6c; font-weight: bold;' : ''"
                >
                  <span :style="item.isRed ? 'color: #f56c6c; font-weight: bold;' : ''">{{item.label}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出库日期:" prop="leave_date">
              <el-date-picker
                style="width: 100%;"
                :disabled="curSelecedType == 'detail'"
                v-model="form.leave_date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出库仓库:" prop="house_id">
              <el-select
                :disabled="curSelecedType == 'detail' || this.tableData.length > 0"
                v-model="form.house_id"
                filterable
                clearable
                placeholder="请选择"
                style="width: 100%;"
                @change="changeSelectHouse"
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
          <el-col :span="6">
            <el-form-item label="关联维修工单:" prop="vehicle_id">
              <el-input
                :disabled="curSelecedType == 'detail'"
                v-if="form.leave_type != 'WXCK'"
                v-model="form.relate_num"
                style="width: 100%;"
              ></el-input>
              <workcode-select
                v-if="form.leave_type == 'WXCK'"
                style="width: 100%;"
                v-model="form.relate_num"
                ref="workcodeSelect"
                @on-change="workcodeChange">
              </workcode-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="3">
            <el-form-item label="外部车辆:">
              <el-checkbox
                :disabled="curSelecedType == 'detail' || vehDisabled"
                :true-label="1"
                :false-label="2"
                v-model="form.out_vehicle"
              ></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="车牌号:" prop="vehicle_id">
              <get-vehicle-select-tree
                style="width: 100%;"
                v-show="form.out_vehicle == '2'"
                ref="vehicleTree"
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                v-model="form.vehicle_id"
                @on-change="vehChange"
                nodeKey="i_id"
                :key="veh_key"
              >
              </get-vehicle-select-tree>
              <el-input
                :disabled="curSelecedType == 'detail' || vehDisabled"
                v-show="form.out_vehicle == '1'"
                v-model="form.lp_num"
                style="width: 100%;"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" v-show="form.out_vehicle == '2' && form.vehicle_id">
            <el-form-item label="车辆型号:">
              <span>{{vehicle_model_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4" v-show="form.out_vehicle == '2' && form.vehicle_id">
            <el-form-item label="车辆登记时间:">
              <span>{{register_certificate_time}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="制单人:" prop="pick_id">
              <span>{{userInfo.user_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工具领用人:">
              <get-user-select
                ref="receiverSelect"
                v-model="form.receiver_id"
                :disabled="curSelecedType == 'detail'"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                :placeholder="'请选择工具领用人'"
                @on-change="receiverChange"
                :func_type="3"
              ></get-user-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="领料用途" prop="use_way">
              <tr-select-dictionaries
                v-model="form.use_way"
                :key="use_way_key"
                :classKey="'维修领料类型'"
                :placeholder="'请选择维修领料类型'"
                :isMultiple="false"
                :isShowDefaultValue="true"
                :disabled="curSelecedType == 'detail'"
              ></tr-select-dictionaries>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="关联大额审批单:" label-width="140px">
              <oa-vehicle-parts-select v-model="form.vehicle_parts_receive_id" :vehicle_id="form.vehicle_id"></oa-vehicle-parts-select>
<!--              <OaVehiclePartsSelect v-model="form.vehicle_parts_receive_id"></OaVehiclePartsSelect>-->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领料组织:" prop="pick_depatment_id">
              <get-department-select
                ref="baseTree"
                :disabled="curSelecedType == 'detail'"
                :isContainEmp="false"
                :funcType="1"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                v-model="form.pick_depatment_id"
                style="width: 100%;"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注:">
              <el-input
                :disabled="curSelecedType == 'detail'"
                v-model="form.remark"
                style="width: 100%;"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="button-group" style="margin: 10px 0;">
        <el-button
          type="primary"
          size="mini"
          :disabled="curSelecedType == 'detail'"
          @click="addData"
          >添加出库明细</el-button
        >
        <el-button
          :disabled="curSelecedType == 'detail'"
          type="primary"
          size="mini"
          @click="deleteSelect()"
          >移除</el-button
        >
        <el-button size="mini" @click="materialsDialogBool = !materialsDialogBool" type="primary">物料档案F6</el-button>
        <el-button size="mini" @click="nowInventoryDialogBool = !nowInventoryDialogBool" type="primary">即时库存F8</el-button>
        <el-button size="mini" @click="openSettingPageEvent" type="primary">表头设置</el-button>
        <el-button size="mini" @click="getwuzi" type="primary">刷新物料</el-button>
        <el-button size="mini" @click="sortByWarehouseName" type="primary">仓库名称排序</el-button>
        <el-tag type="info" style="margin-left: 10px;">总数量:{{count_count}}</el-tag>
        <el-tag type="info" style="margin-left: 10px;">总金额:{{price_count}}</el-tag>
      </div>
      <div class="table">
        <tr-table
          :selectionShow="true"
          :TableHeight="tableHead"
          :data="
            tableData.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
          "
          :loading="headerLoading"
          :tableHeaderList="canRendererTableHeader"
          @on-select-change-row="selectedList"
          @row-click="tableSelectRow"
          ref="table"
          :isFixedEmptyPlaceholder="false"
          @sort-change="handleSortChange"
        >
          <template slot-scope="scope" slot="material_id">
            <el-select
              :disabled="curSelecedType == 'detail'"
              v-model="scope.data.material_id"
              :remote-method="remoteMethod"
              :autofocus="true"
              v-loading="wuziOptionsLoading"
              size="mini"
              filterable
              remote
              @change="changeData(scope)"
              placeholder="请选择"
            >
              <el-option
                v-for="item in wuziOptions"
                :key="item.id"
                :label="item.code"
                :value="item.id"
              >
                <span >{{ item.name }}</span>
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope" slot="count">
            <el-input-number
              :ref="`number-count${scope.index}`"
              :disabled="curSelecedType == 'detail'"
              v-model="scope.data.count"
              @focus="inputFocus(scope.index, $event)"
              @change="priceChange(scope.data)"
              size="mini"
              :precision="2"
              :controls="false"
              :min="0"
            ></el-input-number>
          </template>
          <template slot-scope="scope" slot="price">
            <el-input-number
              :disabled="true"
              v-model="scope.data.price"
              :precision="2"
              :controls="false"
              @change="priceChange(scope.data)"
              :min="0"
              size="mini"
            ></el-input-number>
          </template>
          <template slot-scope="scope" slot="house_id">
            <el-select
              :disabled="curSelecedType == 'detail'"
              v-model="scope.data.house_id"
              filterable
              clearable
              placeholder="请选择"
              @change="e => {changeMaterialSelectHouse(scope.data, e, scope.index)}"
            >
              <el-option
                v-for="item in stoneOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope" slot="remark">
            <el-input
              :disabled="curSelecedType == 'detail'"
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
              :disabled="curSelecedType == 'detail'"
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
    <span slot="footer" class="dialog-footer" >
      <el-button @click="dialogClose" v-if="curSelecedType != 'detail'">取 消</el-button>
      <el-button
        type="primary"
        v-if="curSelecedType != 'detail'"
        :disabled="curSelecedType == 'detail'"
        @click="updatePlaybill('form')"
        >保 存</el-button>
      <el-button
        v-if="curSelecedType != 'detail'"
        type="primary"
        :disabled="curSelecedType == 'detail'"
        @click="updateAudit('form')"
      >保存并审核</el-button>
       <el-button
         type="primary"
         v-if="AuditType === '2'"
         @click="antiAudit('2')"
       >审  核</el-button>
      <el-button
        type="primary"
        v-if="AuditType === '3'"
        @click="antiAudit('3')"
      >反  审  核</el-button>
    </span>
    <materials-dialog :dialogBool.sync="materialsDialogBool" ref="materialsDialog" :remoteWuzi="remoteWuzi"></materials-dialog>
    <now-inventory-dialog
      :dialogBool.sync="nowInventoryDialogBool"
      ref="nowInventoryDialog"
      :remoteWuzi="remoteWuzi"
      @table-db-select="nowDialogSelect"
    ></now-inventory-dialog>
    <!-- 表格自定义组件 -->
    <custom-setting
      :isParentUse="false"
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @update-table-header="updateTableHeader"
      :append-to-body="true"
    ></custom-setting>
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
import { formatDate } from "@/utils/index";
import { getUser } from "@/utils/auth";
import imageListUpload from "@/components/imageListUpload";
import getUserSelect from "components/base/formModel/tree/get-user-select";
import getTyreModel from "@/components/base/formModel/select/get-tyre-model";
import getVehicleSelectTree from "./get-vehicle-number-tree";
import workcodeSelect from "./workcode-select";
import getTyreCode from "@/components/base/formModel/select/get-tyre-code";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import materialsDialog from "./materials-dialog/index.vue";
import nowInventoryDialog from "./now-inventory-dialog/index.vue";
import oaVehiclePartsSelect from "./oa-vehicle-parts-select.vue";
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
    materialsDialog,
    nowInventoryDialog,
    oaVehiclePartsSelect
  },
  props: {
    /**
     * 控制弹窗显示/隐藏
     */
    dialogBool: Boolean,
    /**
     * 弹窗标题
     */
    title: {
      type: String,
      default: "编辑",
    },
    /**
     * 当前操作类型（add/edit/detail）
     */
    curSelecedType: [String],
    /**
     * 主表名称
     */
    main_name: [String]
  },
  data() {
    return {
      veh_key: '1', // 车辆选择组件key
      customSettingVialogVisible: false, // 表头设置弹窗
      AuditType: '', // 审核类型
      tableHead: 400, // 表格高度
      pagesize: 10, // 每页数据量
      currentPage: 1, // 当前页码
      warehouseList: [], // 仓管员列表
      state_name: "", // 状态名
      userInfo: JSON.parse(getUser()), // 当前用户信息
      select_lp_num: '', // 选中车牌号
      defaultCode: '', // 默认物料编码
      stoneOptions: [], // 仓库选项
      basicRules: {
        // receiver_id: [
        //   { required: true, message: '请选择工具领用人', trigger: 'change' }
        // ]
        pick_depatment_id: [
          { required: true, message: '请选择领料组织', trigger: 'change' }
        ],
        use_way: [
          { required: true, message: '请选择领料用途', trigger: 'change' }
        ]
      }, // 表单验证规则
      /**
       * 出库单主表表单
       */
      form: {
        use_way: "", // 领料用途
        out_vehicle: "2", // 是否外部车辆
        leave_type: "WXCK", // 出库方式
        leave_date: formatDate(new Date(), 'yyyy-MM-dd'), // 出库日期
        house_id: '', // 出库仓库
        relate_num: "", // 关联单号
        lp_num: "", // 车牌号
        vehicle_id: null, // 车辆ID
        storage_id: "", // 仓管员ID
        pick_id: "", // 领料员ID
        receiver_id: "", // 工具领用人ID
        pick_depatment_id: "", // 领料组织ID
        remark: "", // 备注
        id: 0, // 主键ID
        vehicle_parts_receive_id: [] // 关联大额审批单
      },
      vehicle_model_name: '',
      register_certificate_time: '',
      use_way_key: '1314567', // 领料用途key
      vehDisabled: false, // 车辆输入框禁用
      buyerList: [], // 领料员列表
      /**
       * 出库方式选项
       */
      Modeoptions: [
        { value: "WXCK", label: "维修出库" },
        { value: "YBCK", label: "一般出库" },
        { value: "DBCK", label: "调拨出库" },
        { value: "PKCK", label: "盘亏出库" },
        { value: "HCCK", label: "红冲出库" },
        { value: "CKTL", label: "出库退料", isRed: true },
      ],
      tyreMaintainData: [], // 轮胎图片等
      picturePathList: [], // 图片路径
      /**
       * 出库明细表格数据
       */
      tableData: [],
      /**
       * 物料选项（下拉）
       */
      wuziOptions: [],
      wuziOptionAllMap: {},
      wuziOptionMap: {},
      wuziOptionsLoading: false, // 物料选项加载中
      /**
       * 表头自定义配置
       */
      customSettingList: [
        {
          id: 1,
          label: "物料编码",
          prop: "material_id",
          width: "200",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "物料名称",
          prop: "material_name",
          width: "160",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "规格型号",
          prop: "specification",
          width: "160",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "出库数量",
          prop: "count",
          width: "160",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "出库仓库",
          prop: "house_id",
          width: "160",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "出库单价",
          prop: "price",
          width: "160",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "总金额",
          prop: "total_price",
          width: "160",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "仓位",
          prop: "position",
          width: "160",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "当前库存",
          prop: "current_inventory",
          width: "150",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "全部库存",
          prop: "total_inventory",
          width: "150",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "单位",
          prop: "measure_unit_name",
          width: "120",
          align: "center",
          signIndex: 10,
        },
        {
          id: 12,
          label: "商品规格",
          prop: "brand",
          width: "120",
          align: "center",
          signIndex: 11,
        },
        {
          id: 13,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 12,
        },
      ],
      canRendererTableHeader: null, // 可渲染表头
      customSettingShowList: null, // 显示的表头
      frontFixedNum: 1, // 前几行固定
      backFixedNum: 1, // 后几行固定
      headerLoading: false, // 表头加载中
      pickList: [
        { value: 1, label: '普通领料' },
        { value: 2, label: '三包领料' },
      ],
      materialsDialogBool: false, // 物料档案弹窗
      nowInventoryDialogBool: false, // 即时库存弹窗
      remoteWuzi: '', // 远程物料搜索关键字
      TimerHouseMap: {}, // 物料-仓库映射
      menu_code: '100302001001', // 菜单编码
      titlesId: '', // 当前表头ID
      price_count: 0, // 总金额
      count_count: 0, // 总数量
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        setTimeout(() => {
          this.$refs.workcodeSelect.onClear();
          this.$refs.baseTree.onClear();
          this.$refs.receiverSelect.onClear();
        }, 60);
      } else {
        this.price_count = 0
        this.count_count = 0
        if (this.curSelecedType === 'add') {
          this.addData()
          this.veh_key = new Date().getTime()
          this.use_way_key = new Date().getTime() + 'use_way_key'
        }
        this.getwuzi()
        this.getGinsang();
        this.getWarehouse();
        this.dialogFull(true)
        this.reqTitleTable()
        this.form.pick_id = this.userInfo.user_id
        setTimeout(() => {
          this.updateCount()
        }, 300);
        console.log(this.userInfo)
        this.$nextTick(() => {
          this.$refs["form"].clearValidate();
        });
      }
    },
  },
  mounted() {
    this.$refs.trDialog.fullSwitch()
    // 获取window 总高度
    // let windowHeight = window.innerHeight;
    // this.tableHead = windowHeight - 370
    document.addEventListener("keydown", event => {
      if (this.dialogBool) {
        if (event.code === 'F6') {
          this.materialsDialogBool = !this.materialsDialogBool
            console.log('F6')
        }
        if (event.code === 'F8') {
          this.nowInventoryDialogBool = !this.nowInventoryDialogBool
          console.log('F8')
        }
      }

    })
  },
  methods: {
    /**
     * 输入框获得焦点时选中内容
     * @param {number} index - 当前行索引
     * @param {Event} e - 事件对象
     */
    inputFocus(index, e) {
      e.target.select();
    },
    /**
     * 打开自定义表格头部弹窗
     */
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    /**
     * 更新表头配置
     * @param {Array} newestTableHeaderList - 新的表头配置列表
     */
    updateTableHeader(newestTableHeaderList) {
      this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {
        this.reqTitleTable()
      }).catch(err => {})
    },
    /**
     * 获取表头配置
     */
    reqTitleTable() {
      this.headerLoading = true;
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.$forceUpdate();
        setTimeout(()=>{
          this.headerLoading = false;
        },600)
      }).catch(err => {
        setTimeout(()=>{
          this.headerLoading = false;
        },600)
      })
    },
    /**
     * 处理对话框全屏切换
     * @param {boolean} full - 是否全屏
     */
    dialogFull(full) {
      if (full) {
        let windowHeight = window.innerHeight;
        this.tableHead = windowHeight - 370
      } else {
        this.tableHead = 400
      }
    },
    /**
     * 设置表单数据（编辑/查看/复制时回显）
     * @param {Object} info - 表单数据对象
     */
    setData(info) {
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(info, key)) {
          this.form[key] = info[key]
        }
      }
      // 如果是复制模式，确保ID为0，并设置当前日期
      if (this.curSelecedType === 'add' && info.id === 0) {
        this.form.id = 0;
        this.form.leave_date = formatDate(new Date(), 'yyyy-MM-dd');
      }

      this.tableData = info.details || []
      // 复制模式时，确保明细数据的ID也为0
      if (this.curSelecedType === 'add' && this.tableData.length > 0) {
        this.tableData.forEach(detail => {
          detail.id = 0;
        });
      }
      if (this.form.vehicle_id) {
        this.getVehModel(this.form.vehicle_id)
      }
      this.userInfo.user_name = info.created_name || this.userInfo.user_name
      this.getWarehouseperson1(this.form.house_id)
    },
    /**
     * 车辆选择变更处理
     * @param {string|number} id - 车辆ID
     * @param {Object} obj - 车辆对象
     */
    vehChange(id,obj) {
      console.log(id,obj)
      this.getVehModel(id)
    },

    // 车辆信息
    getVehModel(id) {
      console.log('车辆信息',id)
      this.$client.GetVehicleInfoById({ id: id }).then((req) => {
        if (req.head.result === "200") {
          this.vehicle_model_name = req.context.vehicle_model_name
          this.register_certificate_time = req.context.register_certificate_time
        }
      });
    },
    /**
     * 处理每页显示数量变更
     * @param {number} val - 新的每页显示数量
     */
    handleSizeChange(val) {
      this.pagesize = val;
    },
    /**
     * 处理当前页码变更
     * @param {number} currentPage - 新的当前页码
     */
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    /**
     * 获取仓管员列表
     * @param {string|number} val - 仓库ID
     */
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
              if (element.id === Number(JSON.parse(getUser()).id)) {
                this.form.pick_id = element.id;
              }
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
    /**
     * 获取仓管员列表(编辑模式)
     * @param {string|number} val - 仓库ID
     */
    getWarehouseperson1(val) {
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
    /**
     * 获取供应商列表
     */
    getGinsang() {
      this.$client.GetProviderPage().then((req) => {
        if (req.head.result === "200") {
          this.gongysOptions = req.context.list;
        }
      });
    },
    /**
     * 检查并转换数值
     * @param {string|number} value - 输入值
     * @returns {string|number} 转换后的值
     */
    checkAndAssign(value) {
      const num = Number(value);
      return isFinite(num) ? value : '';
    },
    /**
     * 数量或单价变更时，自动计算总价，并更新合计
     * @param {Object} val - 当前行数据
     */
    priceChange(val) {
      let i = this.tableData.findIndex(item => item.material_id == val.material_id);
      if (this.tableData[i].count && this.tableData[i].price) {
        this.tableData[i].total_price = Number(this.tableData[i].count) * Number(this.tableData[i].price);
      } else {
        this.tableData[i].total_price = 0;
      }
      this.updateCount();
    },
    /**
     * 更新总数量和总金额
     */
    updateCount() {
      this.price_count = 0;
      this.count_count = 0;
      for(let i=0; i<this.tableData.length; i++) {
        // 使用Number确保转换为数字进行计算
        const total_price = Number(this.tableData[i].total_price || 0);
        const count = Number(this.tableData[i].count || 0);
        // 累加时使用toFixed(2)确保精度
        this.price_count = Number((this.price_count + total_price).toFixed(2));
        this.count_count = Number((this.count_count + count).toFixed(2));
      }
    },
    /**
     * 远程搜索物料
     * @param {string} query - 搜索关键词
     */
    remoteMethod(query) {
      if (query !== "") {
        this.remoteWuzi = query
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.wuziOptions = Object.values(this.wuziOptionAllMap).filter(
            (item) => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                (item.mnemonic_code ? item.mnemonic_code.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
            }
          );
          this.wuziOptions = this.wuziOptions.slice(0, 99);
        }, 200);
      } else {
        this.wuziOptions = [];
      }
    },
    /**
     * 处理物料选择变更
     * @param {Object} val - 选中的物料数据
     */
    changeData(val) {
      for(let i=0;i<this.wuziOptions.length;i++) {
        let obj = this.wuziOptions[i]
        if (val.data.material_id === obj.id) {
          this.remoteWuzi = obj.code
        }
      }
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
      this.$client.getByPage1TimerHouse({
        material_id: val.data.material_id
      }).then(req => {
        if (req.head.result == "200") {
          let list = req.context.list
          let dataMap = []
          list.forEach(item => {
            if (item.material_id == val.data.material_id) {
              dataMap.push(item)
            }
          })
          this.TimerHouseMap[val.data.material_id] = dataMap
          if (dataMap.length > 0) {
            let content = dataMap[0]
            this.tableData[i].count = '';
            this.tableData[i].price = content.price;
            this.tableData[i].material_name = content.material_name;
            this.tableData[i].specification = content.specification;
            this.tableData[i].measure_unit_name = content.measure_unit_name;
            this.tableData[i].brand = content.brand;
          }
        }
      })

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
    /**
     * 处理物料仓库选择变更
     * @param {Object} item - 当前行数据
     * @param {string|number} val - 选中的仓库ID
     * @param {number} index - 当前行索引
     */
    changeMaterialSelectHouse(item,val,index) {
      let houseData = this.TimerHouseMap[item.material_id]
      let bool = false
      if (this.form.leave_type === 'CKTL') {
        bool = true
      }
      if (houseData.length > 0) {
        for (let i = 0; i < houseData.length; i++) {
          if (houseData[i].house_id === val) {
            bool = true
            let content = houseData[i]
            this.tableData[index].price = content.price;
            this.tableData[index].current_inventory = content.count;
            this.tableData[index].total_inventory = content.total_count;
            this.tableData[index].material_name = content.material_name;
            this.tableData[index].specification = content.specification;
            this.tableData[index].position = content.position;
            this.tableData[index].measure_unit_name = content.measure_unit_name;
            this.tableData[index].brand = content.brand;
            this.tableData[index].position = content.position
          }
         }
      }
      if (bool === false) {
        this.tableData[index].house_id = '';
        this.$message({
          showClose: true,
          message: "该仓库没有物料",
          type: "warning",
        });
      }
    },
    /**
     * 获取物料列表
     */
    getwuzi() {
      let params = {
        house_id: 0
      }
      if (this.form.house_id) {
        params.house_id = this.form.house_id;
      }
      this.wuziOptionsLoading = true
      this.$client.GetSimpleTimerHouse(params)
        .then((req) => {
          this.wuziOptionsLoading = false
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
            let length = req.context.length;
            let allList = req.context;
            for (let i = 0; i < length; i++) {
              let item = allList[i];
              this.wuziOptionAllMap[item.id] = item;
              if (i < 99) {
                this.wuziOptionMap[item.id] = item;
              }
            }
            ids.forEach((key) => {
              this.wuziOptionMap[key] = this.wuziOptionAllMap[key];
            });
            this.wuziOptions = Object.values(this.wuziOptionMap);
          }
        }).catch(err=>{console.log(err)});
    },
    /**
     * 处理工单变更
     * @param {Object} val - 工单数据
     */
    workcodeChange (val) {
      if (val && !!val.vehicle_info) {
        this.select_lp_num = val.vehicle_info.vehicle_name
        this.form.lp_num = val.vehicle_info.vehicle_name
        this.form.vehicle_id = val.vehicle_info.vehicle_id
        this.vehDisabled = true
      } else {
        this.vehDisabled = false
        this.form.lp_num = ''
        this.form.vehicle_id = ''
      }
      if (val && !!val.repair_pick) {
        if (val.repair_pick.length > 0) {
          this.form.house_id = val.repair_pick[0].warenhouse_id
          this.tableData = val.repair_pick
        }
      }
    },
    /**
     * 处理工具领用人变更
     * @param {Array} ids - 选中的人员ID数组
     * @param {Array} nodes - 选中的人员节点数组
     */
    receiverChange(ids, nodes) {
      // 由于设置了单选，ids应该是单个值，nodes是单个对象数组
      if (nodes && nodes.length > 0) {
        console.log('选中的工具领用人:', nodes[0]);
        // 可以在这里添加额外的业务逻辑，比如记录工具领用人姓名等
      }
    },
    /**
     * 删除选中的行
     */
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
    /**
     * 删除指定行
     * @param {Object} value - 要删除的行数据
     * @param {Array} rows - 表格数据
     */
    deleteRow(value, rows) {
      var i = this.tableData.findIndex((item) => {
        return item.material_id == value.material_id;
      });
       const list = this.tableData.slice( (this.currentPage - 1) * this.pagesize,this.currentPage * this.pagesize)
       if(list.length==1 ){
        this.handleCurrentChange(this.currentPage - 1)
      }
         this.tableData.splice(i, 1);
    },
    /**
     * 处理表格多选
     * @param {Array} projectList - 选中的行数据列表
     */
    selectedList(projectList) {
      this.selectedProjectIds = [];
      projectList.forEach((item, index) => {
        this.selectedProjectIds.push(item);
      });
    },
    /**
     * 处理表格行选择
     * @param {Object} row - 选中的行数据
     */
    tableSelectRow(row) {
      // 优先用完整的物料映射
      const material = this.wuziOptionAllMap[row.material_id]
        || this.wuziOptions.find(item => item.id === row.material_id);

      if (material) {
        this.remoteWuzi = material.code;
        // 你可以在这里做更多操作，比如弹窗、赋值等
      } else {
        this.remoteWuzi = '';
        // 可选：提示未找到
        // this.$message.warning('未找到选中的物料信息');
      }
    },
    /**
     * 处理即时库存双击选择
     * @param {Object} val - 选中的库存数据
     */
    nowDialogSelect(val) {
      if (this.tableData.length > 0) {
        let i = this.tableData.findIndex((item) => {
          return item.material_id === val.material_id;
        });
        if (i >= 0) {
          this.tableData[i].material_id = val.material_id;
          this.tableData[i].house_id = val.house_id;
          this.tableData[i].position = val.position;
          this.tableData[i].current_inventory = val.count;
          this.tableData[i].total_inventory = val.total_count;
          this.tableData[i].price = val.price;
        } else {
          let j = this.tableData.findIndex((item) => {
            return !item.material_id
          });
          if (j >= 0) {
            this.tableData[j].material_id = val.material_id;
            this.tableData[j].house_id = val.house_id;
            this.tableData[j].position = val.position;
            this.tableData[j].current_inventory = val.count;
            this.tableData[j].total_inventory = val.total_count;
            this.tableData[j].price = val.price;
          } else {
            this.tableData.push({
              material_id: val.material_id,
              house_id: val.house_id,
              position: val.position,
              current_inventory: val.count,
              total_inventory: val.total_count,
              price: val.price,
              count: "",
            });
          }
        }
      } else {
        this.tableData.push({
          material_id: val.material_id,
          house_id: val.house_id,
          position: val.position,
          current_inventory: val.count,
          total_inventory: val.total_count,
          price: val.price,
          count: "",
        });
      }
      this.changeData({data: val})
    },
    /**
     * 添加新行
     */
    addData() {
      let house_id = this.form.house_id
      if (this.tableData.length > 49) {
        this.$message({ type: "error", message: "物资数量不能超过50" });
        return;
      }
      if(this.tableData.length>0){
        this.tableData.push({provider_id:this.tableData[this.tableData.length - 1].provider_id,house_id:house_id,count: ''});
      }else{
        this.tableData.push({house_id:house_id,pick_type_id: ''})
      }
      setTimeout(() => {
        this.$refs.table.gobutton();
        let page = Math.ceil(this.tableData.length / this.pagesize);
        this.handleCurrentChange(page);
      }, 60);
    },
    /**
     * 处理仓库选择变更
     * @param {string|number} val - 选中的仓库ID
     */
    changeSelectHouse(val) {
      this.getWarehouseperson1(val)
      this.getwuzi()
    },
    /**
     * 获取仓库列表
     */
    getWarehouse() {
      let params ={
        usable: 1 //1 启用， 2 未启用
      }
      this.$client.getRecord1Warehouse(params).then((req) => {
        if (req.head.result === "200") {
          this.stoneOptions = req.context;
        }
        this.$client.GetUserWHWarehouse().then(res => {
          if (res.head.result === '200') {
            if (res.context.length === 1) {
              this.getWarehouseperson1(this.form.house_id)
            }
          }
        })
      });
    },
    /**
     * 关闭对话框
     */
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    /**
     * 处理审核/反审核
     * @param {string} type - 审核类型
     */
    antiAudit(type) {
      this.$emit("on-audit",this.form.id, type);
    },
    /**
     * 保存表单
     * @param {string} formName - 表单ref名称
     */
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tableData.length == 0) {
            this.$message({ type: "warning", message: "请添加出库明细" });
            return;
          } else {
            let rows = []
            let house_ids = []
            for(let i=0;i<this.tableData.length;i++) {
              let item = this.tableData[i];
              let index = i + 1
              if (
                item.material_id == null ||
                item.price == null ||
                item.count == null ||
                !item.house_id
              ) {
                rows.push(index)
              }
            }
            if (rows.length > 0) {
              this.$message({ type: "warning", message: `第${rows.join(',')}行数量、单价、仓库请填写完整` });
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
          if (this.form.leave_type == 'WXCK' && this.select_lp_num && this.form.lp_num && (this.select_lp_num != this.form.lp_num)) {
            return this.$message({ type: "warning", message: "当前关联工单车辆与您选择的车辆不一致，无法保存!"})
          }
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
    /**
     * 保存并审核
     * @param {string} formName - 表单ref名称
     */
    updateAudit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tableData.length == 0) {
            this.$message({ type: "warning", message: "请添加出库明细" });
            return;
          } else {
            let rows = []
            for(let i=0;i<this.tableData.length;i++) {
              let item = this.tableData[i];
              let index = i + 1
              if (
                item.material_id == null ||
                item.price == null ||
                item.count == null ||
                !item.house_id
              ) {
                rows.push(index)
              }
            }
            if (rows.length > 0) {
              this.$message({ type: "warning", message: `第${rows.join(',')}行数量、单价、仓库请填写完整` });
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
          if (this.form.leave_type == 'WXCK' && this.select_lp_num && this.form.lp_num && (this.select_lp_num != this.form.lp_num)) {
            return this.$message({ type: "warning", message: "当前关联工单车辆与您选择的车辆不一致，无法保存!"})
          }
          this.$emit("save-audit-add-edit", info);
        } else {
          return false;
        }
      });
    },
    /**
     * 处理数量输入
     * @param {string} value - 输入的值
     */
    handleCountInput(value) {
      // 只允许输入数字
      return value.replace(/[^\d]/g, '');
    },
    handleSortChange({ column, prop, order }) {
      if (prop === 'house_id') {
        // 创建临时数组存储所有数据
        const allData = [...this.tableData];

        // 对整个数据集排序
        allData.sort((a, b) => {
          const nameA = this.getWarehouseName(a.house_id) || '';
          const nameB = this.getWarehouseName(b.house_id) || '';
          return order === 'ascending'
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        });

        // 更新整个数据集
        this.tableData = allData;
      }
    },
    getWarehouseName(houseId) {
      const warehouse = this.stoneOptions.find(opt => opt.id === houseId);
      return warehouse ? warehouse.name : '';
    },
    sortByWarehouseName() {
      // 创建临时数组存储所有数据
      const allData = [...this.tableData];

      // 对整个数据集排序
      allData.sort((a, b) => {
        const nameA = this.getWarehouseName(a.house_id) || '';
        const nameB = this.getWarehouseName(b.house_id) || '';
        return nameA.localeCompare(nameB);
      });

      // 更新整个数据集
      this.tableData = allData;
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

.el-row{
    display:flex;
    flex-wrap: wrap;
    margin-bottom: 10px !important;
}
.el-dialog-div {
  display: flex;
}

// 压缩表单项间距
.el-form-item {
  margin-bottom: 12px !important;
}

// 压缩表单项标签高度
.el-form-item__label {
  line-height: 28px !important;
  padding-bottom: 0 !important;
}

// 压缩表单控件高度
.el-form-item__content {
  line-height: 28px !important;
}

// 压缩输入框高度
.el-input--mini .el-input__inner {
  height: 28px !important;
}

// 压缩选择框高度
.el-select .el-input--mini .el-input__inner {
  height: 28px !important;
}

// 压缩日期选择器高度
.el-date-editor--date.el-input--mini .el-input__inner {
  height: 28px !important;
}

// 红色选项样式
::v-deep .el-select-dropdown__item.red-option {
  color: #f56c6c !important;
  font-weight: bold !important;
}

::v-deep .el-select-dropdown__item.red-option:hover {
  color: #f56c6c !important;
  background-color: #fef0f0 !important;
  font-weight: bold !important;
}

::v-deep .el-select-dropdown__item.red-option.selected {
  color: #f56c6c !important;
  background-color: #fef0f0 !important;
  font-weight: bold !important;
}

::v-deep .el-select-dropdown__item.is-disabled.red-option {
  color: #f56c6c !important;
  opacity: 0.6 !important;
}

</style>
