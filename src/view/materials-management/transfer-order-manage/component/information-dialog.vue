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
        <el-row>
          <el-col :span="12">
            <el-form-item label="调拨日期:" prop="leave_date">
              <el-date-picker
                style="width: 100%;"
                :disabled="curSelecedType == 'detail'"
                v-model="form.trans_date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="制单人:" prop="pick_id">
              <span>{{userInfo.user_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注:">
              <el-input
                type="textarea"
                :rows="3"
                :disabled="curSelecedType == 'detail'"
                v-model="form.remark"
                style="width: 100%;"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button
        type="primary"
        size="mini"
        :disabled="curSelecedType == 'detail'"
        @click="addData"
        >添加调拨明细</el-button
      >
      <el-button
        style="margin-bottom: 30px"
        :disabled="curSelecedType == 'detail'"
        type="primary"
        size="mini"
        @click="deleteSelect()"
        >移除</el-button
      >
      <el-button style="margin-bottom: 30px" size="mini" @click="materialsDialogBool = !materialsDialogBool" type="primary">物料档案F6</el-button>
      <el-button style="margin-bottom: 30px" size="mini" @click="nowInventoryDialogBool = !nowInventoryDialogBool" type="primary">即时库存F8</el-button>
      <el-button style="margin-bottom: 30px" size="mini" @click="openSettingPageEvent" type="primary">表头设置</el-button>
      <el-button style="margin-bottom: 30px" size="mini" @click="getwuzi" type="primary">刷新物料</el-button>
      <div class="table">
        <tr-table
          :selectionShow="true"
          :TableHeight="tableHead"
          :data="paginatedTableData"
          :loading="headerLoading"
          :tableHeaderList="canRendererTableHeader"
          @on-select-change-row="selectedList"
          @row-click="tableSelectRow"
          ref="table"
          :isFixedEmptyPlaceholder="false"
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
              @focus="e => inputFocus(scope.index,e)"
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
              :min="0"
              size="mini"
            ></el-input-number>
          </template>
          <template slot-scope="scope" slot="before_house_id">
            <el-select
              :disabled="curSelecedType == 'detail'"
              v-model="scope.data.before_house_id"
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
          <template slot-scope="scope" slot="after_house_id">
            <el-select
                :disabled="curSelecedType == 'detail'"
                v-model="scope.data.after_house_id"
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
          </template>
          <template slot-scope="scope" slot="before_position_name">
            <el-input
                :disabled="curSelecedType == 'detail'"
                v-model="scope.data.before_position_name"
                size="mini"
            ></el-input>
          </template>
          <template slot-scope="scope" slot="after_position_name">
            <el-input
                :disabled="curSelecedType == 'detail'"
                v-model="scope.data.after_position_name"
                size="mini"
            ></el-input>
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
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
    main_name: [String]
  },
  data() {
    return {
      veh_key:'1',
      customSettingVialogVisible:false,
      AuditType: '',
      tableHead: 400,
      pagesize: 10, //默认分页每页数据量
      currentPage: 1, //默认展示第一页数据
      warehouseList: [],
      state_name: "",
      userInfo: JSON.parse(getUser()),
      //是否外部车辆
      // checked:false,
      select_lp_num: '',
      defaultCode: '',
      form: {
        main_id: 0,
        trans_date: '',
        operator_id: '',
        remark: ''
      },
      use_way_key: '1314567',
      vehDisabled: false,
      gongysOptions: [],
      stoneOptions: [],
      basicRules: {
        trans_date: [
          {
            required: true,
            message: "请调拨时间",
            trigger: "blur",
          },
        ],
      },
      buyerList: [],
      tyreMaintainData: [],
      picturePathList: [],
      tableData: [],
      wuziOptions: [],
      wuziOptionAllMap: {},
      wuziOptionMap: {},
      wuziOptionsLoading: false,
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
          label: "即时单价",
          prop: "price",
          width: "160",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "数量",
          prop: "count",
          width: "160",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "调出仓库",
          prop: "before_house_id",
          width: "160",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "调出仓位",
          prop: "before_position_name",
          width: "160",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "调入仓库",
          prop: "after_house_id",
          width: "160",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "调入仓位",
          prop: "after_position_name",
          width: "160",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "商品规格",
          prop: "brand",
          width: "120",
          align: "center",
          signIndex: 9,
        },
      ],
      canRendererTableHeader: null,
      customSettingShowList: null,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      headerLoading:false,
      // F7 物资
      materialsDialogBool: false,
      nowInventoryDialogBool: false,
      remoteWuzi: '',
      TimerHouseMap: {},
      menu_code: '100331001001',
      titlesId:'', //当前表头的id
      price_count: 0,
      count_count: 0,
      updateTimer: null,
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.price_count = 0
        this.count_count = 0
        if (this.curSelecedType === 'add') {
          this.addData()
          this.form.trans_date = formatDate(new Date(), "yyyy-MM-dd");
          this.veh_key = new Date().getTime()
          this.use_way_key = new Date().getTime() + 'use_way_key'
        }
        this.getwuzi()
        this.getWarehouse();
        this.dialogFull(true)
        this.reqTitleTable()
        this.form.operator_id = this.userInfo.user_id
        setTimeout(() => {
          // this.updateCount()
        }, 300);
        console.log(this.userInfo)
        this.$nextTick(() => {
          this.$refs["form"].clearValidate();
        });
      }
    },
    // 监听数量变化
    'tableData': {
      handler(newVal) {
        newVal.forEach((item, index) => {
          if (item.material_id && item.before_house_id) {
            const houseData = this.TimerHouseMap[item.material_id] || [];
            const selectedHouse = houseData.find(house => house.house_id === item.before_house_id);

            if (selectedHouse && item.count > selectedHouse.count) {
              this.$message.warning(`第${index + 1}行调拨数量不能大于库存数量(${selectedHouse.count})`);
              this.$set(this.tableData[index], 'count', selectedHouse.count);
            }
          }
        });
      },
      deep: true
    }
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
    inputFocus(index,e) {
      e.target.select()
      // this.$refs[`number-count${index}`].select()
    },
    // 打开自定义表格头部弹窗
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 更新表头
    updateTableHeader(newestTableHeaderList) {
      this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {

        this.reqTitleTable()
      }).catch(err => {

      })
    },
    // 获取表头
    reqTitleTable() {
      this.headerLoading = true;
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.$forceUpdate();
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      }).catch(err => {
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      })
    },
    dialogFull(full) {
      if (full) {
        let windowHeight = window.innerHeight;
        this.tableHead = windowHeight - 370
      } else {
        this.tableHead = 400
      }
      console.log(full, this.tableHead)
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
      if (this.curSelecedType === 'add' && info.main_id === 0) {
        this.form.main_id = 0;
        this.form.trans_date = formatDate(new Date(), 'yyyy-MM-dd');
      }
      
      this.tableData = info.list || info.details || []
      // 复制模式时，确保明细数据的ID也为0
      if (this.curSelecedType === 'add' && this.tableData.length > 0) {
        this.tableData.forEach(detail => {
          detail.id = 0;
          detail.detail_id = 0;
          detail.main_id = 0;
        });
      }
      
      this.userInfo.user_name = info.operator_name || this.userInfo.user_name
    },
    handleSizeChange(val) {
      this.pagesize = val;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    priceChange(val) {
      let i = 0;
      //获取下标
      if (this.tableData[0].id) {
        i = this.tableData.findIndex((item) => {
          return item.material_id == val.material_id;
        });
      } else {
        i = this.tableData.findIndex((item) => {
          return item.material_id == val.material_id;
        });
      }
      // console.log('1',this.tableData[i].count)
      // this.tableData[i].count = this.checkAndAssign(this.tableData[i].count)
      // console.log('2',this.tableData[i].count)
      if (this.tableData[i].count && this.tableData[i].price) {
        this.tableData[i].total_price =
          this.tableData[i].count * this.tableData[i].price;
      }
      // this.updateCount()
    },
    remoteMethod(query) {
      if (query !== "") {
        this.remoteWuzi = query
        console.log('this.remoteWuzi', this.remoteWuzi,this.wuziOptionAllMap)
        this.loading = true;
        // let Options = []
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
    changeData(scope) {
      if (!scope.data.material_id) {
        return;
      }

      try {
        // 获取选中的物料信息
        const selectedMaterial = this.wuziOptions.find(item => item.id === scope.data.material_id);
        if (!selectedMaterial) {
          this.$message.warning('未找到选中的物料信息');
          return;
        }

        // 检查物料是否重复
        const duplicateIndex = this.tableData.findIndex((item, index) =>
          item.material_id === scope.data.material_id &&
          index !== scope.index + (this.currentPage - 1) * this.pagesize
        );

        if (duplicateIndex !== -1) {
          this.$message.warning('该物料已在调拨单中，请勿重复选择');
          // 清空当前选择
          Object.keys(scope.data).forEach(key => {
            scope.data[key] = '';
          });
          return;
        }

        // 使用防抖处理数据更新
        this.debounceUpdate(() => {
          // 更新所有页面的相同物料数据
          this.tableData.forEach(item => {
            if (item.material_id === scope.data.material_id) {
              item.material_code = selectedMaterial.code;
              // 不再自动赋值 before_house_id、after_house_id、before_position_name、after_position_name
            }
          });

          // 获取物料库存信息
          this.getMaterialInventory(scope.data.material_id);
        });
      } catch (error) {
        console.error('更新物料信息失败:', error);
        this.$message.error('更新物料信息失败,请重试');
      }
    },
    // 防抖函数
    debounceUpdate(fn) {
      if (this.updateTimer) {
        clearTimeout(this.updateTimer);
      }
      this.updateTimer = setTimeout(fn, 300);
    },
    // 获取物料库存信息
    async getMaterialInventory(materialId) {
      try {
        const res = await this.$client.getByPage1TimerHouse({
          material_id: materialId,
        });

        if (res.head.result === "200") {
          const houseData = res.context.list || [];
          this.TimerHouseMap[materialId] = houseData;
          this.tableData.forEach(item => {
            if (item.material_id === materialId) {
              if (houseData.length > 0) {
                const firstHouse = houseData[0];
                // 只赋值物料相关信息，不赋值仓库和仓位
                item.material_name = firstHouse.material_name;
                item.specification = firstHouse.specification;
                item.price = firstHouse.price;
                item.brand = firstHouse.brand;
                item.count = firstHouse.count;
                // 不赋值 before_house_id、after_house_id、before_position_name、after_position_name
              }
            }
          });
        } else {
          this.$message({
            showClose: true,
            message: "获取物料库存信息失败",
            type: "error",
          });
        }
      } catch (error) {
        console.error('获取物料库存信息失败:', error);
        this.$message.error('获取物料库存信息失败,请重试');
      }
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
    },
    // 表格行选择
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
    // 即时库存双击带出数据
    async nowDialogSelect(val) {
      // val: { material_id, house_id }
      let rowIndex = this.tableData.findIndex(item => item.material_id === val.material_id);

      if (rowIndex >= 0) {
        // 1. 已有该物料，只修改调出仓库
        this.tableData[rowIndex].before_house_id = val.house_id;
        // 调用接口补充其他数据
        await this.getMaterialInventoryAndFill(this.tableData[rowIndex]);
      } else {
        // 2. 没有该物料，查找空行
        let emptyIndex = this.tableData.findIndex(item => !item.material_id);
        if (emptyIndex >= 0) {
          // 覆盖空行
          this.tableData[emptyIndex].material_id = val.material_id;
          this.tableData[emptyIndex].before_house_id = val.house_id;
          await this.getMaterialInventoryAndFill(this.tableData[emptyIndex]);
        } else {
          // 3. 没有空行，新增
          let newRow = {
            id: '',
            main_id: '',
            material_id: val.material_id,
            price: '',
            count: '',
            before_house_id: val.house_id,
            after_house_id: '',
            material_code: '',
            material_name: '',
            specification: '',
            before_house_name: '',
            after_house_name: '',
            before_position_name: '',
            after_position_name: '',
            brand: ''
          };
          this.tableData.push(newRow);
          await this.getMaterialInventoryAndFill(newRow);
        }
      }
    },
    // 新增一个方法用于补充物料信息（不覆盖 before_house_id）
    async getMaterialInventoryAndFill(row) {
      try {
        const res = await this.$client.getByPage1TimerHouse({
          material_id: row.material_id,
        });
        if (res.head.result === "200") {
          const houseData = res.context.list || [];
          if (houseData.length > 0) {
            // 找到与当前 before_house_id 匹配的仓库信息
            const matchedHouse = houseData.find(h => h.house_id === row.before_house_id) || houseData[0];
            row.material_code = matchedHouse.code;
            row.material_name = matchedHouse.material_name;
            row.specification = matchedHouse.specification;
            row.price = matchedHouse.price;
            row.brand = matchedHouse.brand;
            row.count = matchedHouse.count;
            row.before_position_name = matchedHouse.provider_name;
            // 只补充 after_house_id/after_position_name 如果为空
            // if (!row.after_house_id) {
            //   row.after_house_id = matchedHouse.house_id;
            // }
            // if (!row.after_position_name) {
            //   row.after_position_name = matchedHouse.provider_name;
            // }
          }
        } else {
          this.$message({
            showClose: true,
            message: "获取物料库存信息失败",
            type: "error",
          });
        }
      } catch (error) {
        console.error('获取物料库存信息失败:', error);
        this.$message.error('获取物料库存信息失败,请重试');
      }
    },
    //新增行
    addData() {
      if (this.tableData.length > 49) {
        this.$message({ type: "error", message: "物资数量不能超过50" });
        return;
      }
      this.tableData.push({
        id: '',
        main_id: '',
        material_id: '',
        price: '',
        count: '',
        before_house_id: '',
        after_house_id: '',
        material_code: '',
        material_name: '',
        specification: '',
        before_house_name: '',
        after_house_name: '',
        before_position_name: '',
        after_position_name: '',
        brand: ''
      });
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
        console.log('仓库',req);
        if (req.head.result === "200") {
          this.stoneOptions = req.context;
        }
        this.$client.GetUserWHWarehouse().then(res => {
          console.log(res, '仓库所属')

          if (res.head.result === '200') {
            if (res.context.length === 1) {
              console.log(res.context, '仓库所属1')
              // this.form.house_id = req.context[0].id;
            }
          }
        })
      });
    },
    // 取消
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    antiAudit(type) {
      this.$emit("on-audit",this.form.main_id, type);
    },
    // 保存
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tableData.length == 0) {
            this.$message({ type: "warning", message: "请添加调拨明细" });
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
                !item.before_house_id ||
                !item.after_house_id
              ) {
                rows.push(index)
              }
            }
            if (rows.length > 0) {
              this.$message({ type: "warning", message: `第${rows.join(',')}行数量、单价、仓库请填写完整` });
              return;
            }
          }
          // 过滤掉空值
          const context = {
            main_id: this.form.main_id || undefined,
            trans_date: this.form.trans_date || undefined,
            operator_id: this.form.operator_id || undefined,
            remark: this.form.remark_msg || undefined,
            trans_date_string: this.form.trans_date_string || undefined,
            operator_name: this.form.operator_name || undefined,
            details: this.tableData.map(item => {
              const detail = {
                id: item.id || undefined,
                main_id: item.main_id || undefined,
                material_id: item.material_id || undefined,
                price: item.price || undefined,
                count: item.count || undefined,
                before_house_id: item.before_house_id || undefined,
                after_house_id: item.after_house_id || undefined,
                material_code: item.material_code || undefined,
                material_name: item.material_name || undefined,
                specification: item.specification || undefined,
                before_house_name: item.before_house_name || undefined,
                after_house_name: item.after_house_name || undefined,
                before_position_name: item.before_position_name || undefined,
                after_position_name: item.after_position_name || undefined,
                brand: item.brand || undefined
              };
              // 移除所有undefined的属性
              return Object.fromEntries(
                Object.entries(detail).filter(([_, v]) => v !== undefined)
              );
            })
          };
          // 移除所有undefined的属性
          const filteredContext = Object.fromEntries(
            Object.entries(context).filter(([_, v]) => v !== undefined)
          );
          this.$emit("save-add-edit", filteredContext);
        } else {
          return false;
        }
      });
    },
    // 保存并审核
    updateAudit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tableData.length == 0) {
            this.$message({ type: "warning", message: "请添加调拨明细" });
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
                !item.before_house_id ||
                !item.after_house_id
              ) {
                rows.push(index)
              }
            }
            if (rows.length > 0) {
              this.$message({ type: "warning", message: `第${rows.join(',')}行数量、单价、仓库请填写完整` });
              return;
            }
          }
          // 过滤掉空值
          const context = {
            main_id: this.form.main_id || undefined,
            trans_date: this.form.trans_date || undefined,
            operator_id: this.form.operator_id || undefined,
            remark: this.form.remark_msg || undefined,
            trans_date_string: this.form.trans_date_string || undefined,
            operator_name: this.form.operator_name || undefined,
            details: this.tableData.map(item => {
              const detail = {
                id: item.id || undefined,
                main_id: item.main_id || undefined,
                material_id: item.material_id || undefined,
                price: item.price || undefined,
                count: item.count || undefined,
                before_house_id: item.before_house_id || undefined,
                after_house_id: item.after_house_id || undefined,
                material_code: item.material_code || undefined,
                material_name: item.material_name || undefined,
                specification: item.specification || undefined,
                before_house_name: item.before_house_name || undefined,
                after_house_name: item.after_house_name || undefined,
                before_position_name: item.before_position_name || undefined,
                after_position_name: item.after_position_name || undefined,
                brand: item.brand || undefined
              };
              // 移除所有undefined的属性
              return Object.fromEntries(
                Object.entries(detail).filter(([_, v]) => v !== undefined)
              );
            })
          };
          // 移除所有undefined的属性
          const filteredContext = Object.fromEntries(
            Object.entries(context).filter(([_, v]) => v !== undefined)
          );
          this.$emit("save-audit-add-edit", filteredContext);
        } else {
          return false;
        }
      });
    },
    //获取物资
    async getwuzi() {
      try {
        this.wuziOptionsLoading = true;
        const res = await this.$client.GetSimpleTimerHouse({});

        if (res.head.result === "200") {
          // 获取当前已选择的物料ID
          const selectedIds = this.tableData
            .map(obj => obj.material_id)
            .filter(id => id && id !== "" && id !== null && id !== undefined);

          // 处理物料数据
          const allList = res.context;
          this.wuziOptionAllMap = {};
          this.wuziOptionMap = {};

          // 构建完整物料映射
          allList.forEach(item => {
            this.wuziOptionAllMap[item.id] = item;
          });

          // 优先添加已选择的物料
          selectedIds.forEach(id => {
            if (this.wuziOptionAllMap[id]) {
              this.wuziOptionMap[id] = this.wuziOptionAllMap[id];
            }
          });

          // 添加其他物料(最多99个)
          const remainingSlots = 99 - Object.keys(this.wuziOptionMap).length;
          if (remainingSlots > 0) {
            allList
              .filter(item => !selectedIds.includes(item.id))
              .slice(0, remainingSlots)
              .forEach(item => {
                this.wuziOptionMap[item.id] = item;
              });
          }

          // 更新选项列表
          this.wuziOptions = Object.values(this.wuziOptionMap);
        } else {
          this.$message.error('获取物料列表失败');
        }
      } catch (error) {
        console.error('获取物料列表失败:', error);
        this.$message.error('获取物料列表失败,请重试');
      } finally {
        this.wuziOptionsLoading = false;
      }
    },
    // 仓库选择变更处理
    async changeMaterialSelectHouse(item, val, index) {
      if (!val) {
        return;
      }

      try {
        // 获取物料的库存信息
        const houseData = this.TimerHouseMap[item.material_id] || [];

        // 查找选中仓库的库存信息
        const selectedHouse = houseData.find(house => house.house_id === val);

        if (selectedHouse) {
          // 更新物料信息
          const currentItem = this.tableData[index];

          // 根据是调入还是调出仓库来更新不同的字段
          if (item.before_house_id === val) {
            // 调出仓库 - 从库存信息中获取所有物料信息
            currentItem.material_name = selectedHouse.material_name;
            currentItem.specification = selectedHouse.specification;
            currentItem.price = selectedHouse.price;
            currentItem.brand = selectedHouse.brand;
            currentItem.count = selectedHouse.count;
            currentItem.before_position_name = selectedHouse.provider_name;

            // 添加库存数量验证
            if (currentItem.count > selectedHouse.count) {
              this.$message.warning(`调拨数量不能大于库存数量(${selectedHouse.count})`);
              currentItem.count = selectedHouse.count;
            }

            // 保持调入调出仓位一致
            // currentItem.after_position_name = selectedHouse.provider_name;
          }
          // else if (item.after_house_id === val) {
          //   // 调入仓库
          //   currentItem.after_position_name = selectedHouse.provider_name;
          //   // 保持调入调出仓位一致
          //   currentItem.before_position_name = selectedHouse.provider_name;
          // }
        } else {
          // 清空仓库选择并提示
          if (item.before_house_id === val) {
            this.tableData[index].before_house_id = '';
          } else if (item.after_house_id === val) {
            this.tableData[index].after_house_id = '';
          }
          this.$message({
            showClose: true,
            message: "该仓库没有可调拨的物料",
            type: "warning",
          });
        }
      } catch (error) {
        console.error('更新仓库信息失败:', error);
        this.$message.error('更新仓库信息失败,请重试');
      }
    },
    // 保存
    saveAddEdit() {
      // 检查是否有调拨明细
      if (!this.tableData.length) {
        this.$message({
          showClose: true,
          message: "请先添加调拨明细",
          type: "warning",
        });
        return;
      }

      // 检查调拨明细是否完整
      const hasIncompleteDetail = this.tableData.some(item =>
        !item.material_id ||
        !item.before_house_id ||
        !item.after_house_id ||
        !item.count
      );

      if (hasIncompleteDetail) {
        this.$message({
          showClose: true,
          message: "请完善调拨明细信息",
          type: "warning",
        });
        return;
      }

      // 检查调入调出仓位名称是否一致
      const hasPositionMismatch = this.tableData.some(item =>
        item.before_position_name !== item.after_position_name
      );

      if (hasPositionMismatch) {
        this.$message({
          showClose: true,
          message: "调入调出仓位名称必须一致",
          type: "warning",
        });
        return;
      }

      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = {
            context: {
              main_id: this.form.main_id,
              trans_date: this.form.trans_date,
              remark_msg: this.form.remark_msg,
              list: this.tableData
            }
          };
          this.$emit("save-add-edit", params.context);
        }
      });
    },
    // 保存并审核
    saveAuditAddEdit() {
      // 检查是否有调拨明细
      if (!this.tableData.length) {
        this.$message({
          showClose: true,
          message: "请先添加调拨明细",
          type: "warning",
        });
        return;
      }

      // 检查调拨明细是否完整
      const hasIncompleteDetail = this.tableData.some(item =>
        !item.material_id ||
        !item.before_house_id ||
        !item.after_house_id ||
        !item.count
      );

      if (hasIncompleteDetail) {
        this.$message({
          showClose: true,
          message: "请完善调拨明细信息",
          type: "warning",
        });
        return;
      }

      // 检查调入调出仓位名称是否一致
      const hasPositionMismatch = this.tableData.some(item =>
        item.before_position_name !== item.after_position_name
      );

      if (hasPositionMismatch) {
        this.$message({
          showClose: true,
          message: "调入调出仓位名称必须一致",
          type: "warning",
        });
        return;
      }

      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('审核后将立即更新库存，请仔细核对调拨明细，确保调拨信息无误', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = {
              context: {
                main_id: this.form.main_id,
                trans_date: this.form.trans_date,
                remark_msg: this.form.remark_msg,
                list: this.tableData
              }
            };
            this.$emit("save-audit-add-edit", params.context);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消审核'
            });
          });
        }
      });
    },
  },
  computed: {
    paginatedTableData() {
      const start = (this.currentPage - 1) * this.pagesize;
      const end = this.currentPage * this.pagesize;
      return this.tableData.slice(start, end);
    }
  },
  beforeDestroy() {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

.el-row{
    display:flex;
    flex-wrap: wrap;
}
.el-dialog-div {
  display: flex;
}

</style>
