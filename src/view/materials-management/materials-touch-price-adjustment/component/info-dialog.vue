<template>
  <tr-dialog
    :visible="dialogBool"
    :title="title"
    ref="trDialog"
    @before-close="dialogClose"
    @change-full="dialogFull"
    width="90%"
    top="0px"
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
                :disabled="curSelecedType == 'detail'"
                v-model="form.enter_type"
                clearable
                @change="form.relate_num = ''"
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
                :disabled="curSelecedType == 'detail'"
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
                :disabled="curSelecedType == 'detail'"
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
                v-if="form.enter_type != 'CGRK'"
                :disabled="curSelecedType == 'detail'"
                v-model="form.relate_num"
              ></el-input>
              <el-select
                v-else
                :disabled="curSelecedType == 'detail'"
                v-model="form.relate_num"
                clearable
                @change="changeProcure"
              >
                <el-option
                  v-for="item in procureList"
                  :key="item.purchase_code"
                  :label="item.purchase_code"
                  :value="item.purchase_code"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓管员:" prop="vehicle_id">
              <el-select
                :disabled="curSelecedType == 'detail'"
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
              <el-select
                filterable
                :disabled="curSelecedType == 'detail'"
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
            <el-form-item label="付款状态:" prop="pay_state">
              <el-select
                filterable
                :disabled="curSelecedType == 'detail'"
                v-model="form.pay_state"
                clearable
              >
                <el-option
                  v-for="item in paymentStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="摘要:" prop="remark">
              <el-input
                :disabled="curSelecedType == 'detail'"
                v-model="form.remark"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商:" prop="provider_id">
              <el-select
                :disabled="curSelecedType == 'detail'"
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
        :disabled="curSelecedType == 'detail'"
        @click="addData"
      >添加入库明细</el-button
      >
      <el-button
        style="margin-bottom: 10px"
        :disabled="curSelecedType == 'detail'"
        type="primary"
        size="mini"
        @click="deleteSelect()"
      >移除</el-button
      >
      <el-button style="margin-bottom: 30px" size="mini" @click="materialsDialogBool = !materialsDialogBool" type="primary">物料档案F6</el-button>
      <el-button style="margin-bottom: 30px" size="mini" @click="nowInventoryDialogBool = !nowInventoryDialogBool" type="primary">即时库存F8</el-button>
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
          :TableHeight="tableHead"
          @on-select-change-row="selectedList"
          ref="table"
          :omitColumnIndex="[2, 3, 4, 5,7,8,9,11, 12, 13, 14,15,16]"
        >
          >
          <template slot-scope="scope" slot="material_id">
            <el-select
              :disabled="curSelecedType == 'detail'"
              :autofocus="true"
              v-loading="loadind"
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
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope" slot="count">
            <el-input-number
              :disabled="curSelecedType == 'detail'"
              v-model="scope.data.count"
              :precision="0"
              :controls="false"
              @change="priceChange(scope.data)"
              :min="0"
              size="mini"
              style="width: 80px"
            ></el-input-number>
          </template>
          <template slot-scope="scope" slot="price">
            <el-input-number
              :disabled="curSelecedType == 'detail'"
              v-model="scope.data.price"
              :precision="2"
              :controls="false"
              @change="priceChange(scope.data)"
              :min="0"
              size="mini"
              style="width: 80px"
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
              style="width: 80px"
            ></el-input-number>
          </template>
          <template slot-scope="scope" slot="cost_price">
            <el-input-number
              :disabled="curSelecedType == 'detail'"
              v-model="scope.data.cost_price"
              :precision="2"
              :controls="false"
              @change="priceChange(scope.data)"
              :min="0"
              size="mini"
              style="width: 80px"
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
              style="width: 80px"
            ></el-input-number>
          </template>
          <template slot-scope="scope" slot="batch_no">
            <span v-if="scope.data.batch_no">{{ scope.data.batch_no }}</span>
            <span v-else>系统自动生成</span>
          </template>
          <template slot-scope="scope" slot="origin_code">
            <el-input
              :disabled="curSelecedType == 'detail'"
              size="mini"
              v-model="scope.data.origin_code"
            ></el-input>
          </template>
          <template slot-scope="scope" slot="position">
            <el-input
              :disabled="curSelecedType == 'detail'"
              size="mini"
              v-model="scope.data.position"
            ></el-input>
          </template>
          <template slot-scope="scope" slot="remark">
            <el-input
              :disabled="curSelecedType == 'detail'"
              size="mini"
              v-model="scope.data.remark"
            ></el-input>
          </template>
          <template slot-scope="scope" slot="provider_id">
            <el-select
              :disabled="true"
              v-model="scope.data.provider_id"
              filterable
              clearable
              @change="changeProvider(scope.data)"
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" v-if="curSelecedType != 'detail'">取 消</el-button>
      <el-button type="primary" v-if="curSelecedType != 'detail'" @click="updatePlaybill('form')"
      >保 存</el-button
      >
      <el-button
        v-if="curSelecedType != 'detail'"
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
    ></now-inventory-dialog>
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
import { formatTime } from "@/utils/index";
import materialsDialog from "../../warehouse-management/component/materials-dialog/index.vue";
import nowInventoryDialog from "../../warehouse-management/component/now-inventory-dialog/index.vue";
export default {
  components: {
    materialsDialog,
    nowInventoryDialog,
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
      tableHead: 400,
      warehouseList: [],
      pagesize: 10, //默认分页每页数据量
      currentPage: 1, //默认展示第一页数据
      form: {
        enter_type: "YBRK",
        enter_date: formatTime(new Date(), 'yyyy-MM-dd'),
        relate_num: "",
        storage_id: "",
        buyer_id: "",
        remark: "",
        provider_id: "",
        house_id: "",
        state: "",
        pay_state: '',
        id: 0
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
        remark: [
          {
            required: true,
            message: "请输入摘要",
            trigger: "blur",
          },
        ],
        provider_id: [
          {
            required: true,
            message: "请选择供应商",
            trigger: "blur",
          },
        ]
      },
      AuditType: '',
      Modeoptions: [
        {value: "YBRK", label: "一般入库"},
        {value: "CGRK", label: "采购单入库"},
        {value: "DBRK", label: "调拨入库"},
        {value: "PYRK", label: "盘盈入库"},
        {value: "HCRK", label: "采购退货"},
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
          label: "商品规格",
          prop: "brand",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "*申请入库数量",
          prop: "count",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "最新入库价",
          prop: "new_price",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false,
        }, {
          id: 7,
          label: "税率",
          prop: "tax_rate",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "*含税单价",
          prop: "price",
          width: "120",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "金额",
          prop: "total_price",
          width: "120",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "供应商",
          prop: "provider_id",
          width: "220",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "仓位",
          prop: "position",
          width: "180",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "原始物料编码",
          prop: "origin_code",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "计量单位",
          prop: "measure_unit_name",
          width: "120",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "批次",
          prop: "batch_no",
          width: "100",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
      ],
      loadind: false,
      paymentStatus: [
        {
          value: 1,
          label: '未入账'
        },
        {
          value: 2,
          label: '已入账'
        },
      ],
      procureList: [],
      materialsDialogBool: false,
      nowInventoryDialogBool: false,
      remoteWuzi: ''
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
        this.getProcure()
        this.getwuzi()
        if (this.curSelecedType === 'add') {
          this.addData()
        }
        this.dialogFull(true)
        setTimeout(() => {
          this.getWarehouseperson1(this.form.house_id);
        }, 300);
        this.$nextTick(() => {
          this.$refs["form"].clearValidate();
        });
      }
    },
  },
  mounted() {
    this.$refs.trDialog.fullscreen = true
    document.addEventListener("keydown", event => {
      console.log(event)
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
    dialogFull(full) {
      if (full) {
        let windowHeight = window.innerHeight;
        this.tableHead = windowHeight - 370
      } else {
        this.tableHead = 400
      }
      console.log(full, this.tableHead)
    },
    changeProvider(val) {
      let i = 0
      if (this.tableData[0].id) {
        i = this.tableData.findIndex((item) => {
          return item.material_id === val.material_id;
        });
      } else {
        i = this.tableData.findIndex((item) => {
          return item.material_id === val.material_id;
        });
      }

      let item = this.gongysOptions.find(item => {
        return item.id === val.provider_id
      })
      this.tableData[i].position = item.name
    },
    setData(info) {
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(info, key)) {
          this.form[key] = info[key]
        }
      }
      this.tableData = info.details


    },
    handleSizeChange: function (val) {
      this.pagesize = val;
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
    },
    //供应商
    getGinsang() {
      this.$client.GetProviderSymple().then((req) => {
        this.gongysOptions = req;
      });
    },
    priceChange(val) {
      let i = 0;
      //获取下标
      if (this.tableData[0].id) {
        i = this.tableData.findIndex((item) => {
          return item.material_id === val.material_id;
        });
      } else {
        i = this.tableData.findIndex((item) => {
          return item.material_id === val.material_id;
        });
      }
      this.tableData[i].total_price =
        (this.tableData[i].count * this.tableData[i].price).toFixed(2);
      if (this.tableData[i].cost_price) {
        this.tableData[i].cost_total_price =
          (this.tableData[i].count * this.tableData[i].cost_price).toFixed(2);
      } else {
        this.tableData[i].cost_total_price = ''
      }
    },
    unique(arr) {
      // 根据唯一标识no来对数组进行过滤
      const res = new Map(); //定义常量 res,值为一个Map对象实例 //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1));
    },
    remoteMethod(query) {
      if (query !== "") {
        this.remoteWuzi = query
        // this.loading = true;
        // let Options = []
        setTimeout(() => {
          let count = 0
          let optionAll = Object.values(this.wuziOptionAllMap)
          let option = []
          for (let i = 0; i < optionAll.length; i++) {
            if (optionAll[i].name.indexOf(query) > -1 ||
              (optionAll[i].mnemonic_code ? optionAll[i].mnemonic_code.indexOf(query.toLowerCase()) > -1 : false)) {
              option.push(optionAll[i])
              count++
            }
            if (count > 50) {
              break
            }
          }
          this.wuziOptions = option
          // // this.loading = false;
          // this.wuziOptions = Object.values(this.wuziOptionAllMap).filter(
          //   (item) => {
          //     return (
          //       item.groupgo.toLowerCase().indexOf(query.toLowerCase()) > -1
          //     );
          //   }
          // );
          // this.wuziOptions=this.wuziOptions.concat( Options)
          // this.wuziOptions= this.unique(this.wuziOptions);
        }, 200);
      } else {
        this.wuziOptions = [];
      }
    },
    changeData(val) {
      let i = 0;
      let l = 0;
      for (let i = 0; i < this.wuziOptions.length; i++) {
        let obj = this.wuziOptions[i]
        if (val.data.material_id === obj.id) {
          this.remoteWuzi = obj.code
        }
      }
      if (this.tableData[0].id) {
        i = this.tableData.findIndex((item) => {
          return item.material_id == val.data.material_id;
        });
      } else {
        i = this.tableData.findIndex((item) => {
          return item.material_id == val.data.material_id;
        });
      }
      if (this.wuziOptions[0].id) {
        l = this.wuziOptions.findIndex((item) => {
          return item.id == val.data.material_id;
        });
      } else {
        l = this.wuziOptions.findIndex((item) => {
          return item.id == val.data.material_id;
        });
      }
      console.log(i, l, val)
      for (let o = 0; o < this.tableData.length; o++) {
        for (let j = o + 1; j < this.tableData.length; j++) {
          if (
            this.tableData[o].material_id === this.tableData[j].material_id &&
            this.tableData[o].material_id !== null
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
      this.$client.GetSingleMaterial({
        id: val.data.material_id
      }).then(req => {
        console.log(req, 'req', i)
        if (req.head.result === "200") {
          let content = req.context
          if (content) {
            this.tableData[i].material_name = content.name;
            this.tableData[i].specification = content.specification;
            this.tableData[i].measure_unit_name = content.measure_unit_name;
            this.tableData[i].brand = content.brand;
            this.tableData[i].new_price = content.price;
            this.tableData[i].price = content.price;
            this.tableData[i].tax_rate = content.tax_rate;
            this.tableData[i].provider_id = content.provider_id ? content.provider_id : '';
            this.tableData[i].position = content.provider_name;
          }
        }
      })

      let ids = [];
      this.tableData.forEach((obj) => {
        ids.push(obj.material_id);
      });
      for (let n = 0; n < ids.length; n++) {
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
      let params = {
        // usable: 1,
        warehouse_id: this.form.house_id
      }
      if (this.main_name) {
        params.main_name = this.main_name
      }
      this.$client.GetSimpleMaterial(params).then((req) => {
        if (req.head.result === "200") {
          let ids = [];
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
            // if (item.specification == null) {
            //   item.groupgo = item.name + "(" + item.code + ")";
            // } else {
            //   item.groupgo =
            //     item.name + item.specification + "(" + item.code + ")";
            // }
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
          this.$message({type: "error", message: "获取失败"});
        }
      });
    },
    //获取采购单
    getProcure() {
      let params = {
        enter_state: 1,         //未入库
        page_index: 1,
        page_size: 999,
        state: '2'            //审核通过
      }
      this.$client.GetByPagePurchaseOrder(params).then((res) => {
        if (res.head.result === "200") {
          this.procureList = res.context.list
        } else {
          this.$message({type: "error", message: "获取失败"});
        }
      });
    },
    // 获取采购单信息
    changeProcure() {
      this.procureList.forEach(item => {
        if (item.purchase_code == this.form.relate_num) {
          console.log(JSON.parse(JSON.stringify(item)));
          this.form.buyer_id = item.purchase_user
          this.form.provider_id = item.supplier
          this.tableData = item.details.map(child => {
            return {
              material_id: child.material_id,
              material_name: child.name,
              specification: child.specification,
              measure_unit_name: child.unit,
              brand: child.vehicle_kind_names,
              count: child.count,
              price: child.price,
              total_price: child.fee,
              batch_no: '',
              provider_id: item.supplier,
              origin_code: '',
              position: '',
              remark: child.remark,
            }
          })
        }
      })
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
      let i = this.tableData.findIndex((item) => {
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
      // if (this.form.house_id == "") {
      //   this.$message({ type: "error", message: "请先选择仓库" });
      //   this.tableData[i].count = "";
      //   return;
      // }
      if (this.tableData.length > 49) {
        this.$message({type: "error", message: "物资数量不能超过50"});
        return;
      }
      this.tableData.push({
        provider_id: '',
        material_id: '',
        material_name: '',
        specification: '',
        measure_unit_name: '',
        brand: '',
        count: '',
        price: '',
        total_price: '',
        batch_no: '',
        origin_code: '',
        position: '',
        remark: '',
      });
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
      this.$client.getRecordWarehouse({id: val}).then((req) => {
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
      this.$client.getRecordWarehouse({id: val}).then((req) => {
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
      let params = {
        usable: 1 //1 启用， 2 未启用
      }
      this.$client.getRecord1Warehouse(params).then((req) => {
        if (req.head.result === "200") {
          this.stoneOptions = req.context;
          if (this.curSelecedType === "add") {
            this.$client.GetUserWHWarehouse().then(res => {
              console.log(res, '仓库所属')

              if (res.head.result === '200') {
                if (res.context.length === 1) {
                  console.log(res.context, '仓库所属1')
                  this.form.house_id = req.context[0].id;
                  this.getWarehouseperson1(this.form.house_id)
                  // this.getwuzi()
                }
              }
            })
          }
        }
      });
    },
    // 取消
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    antiAudit(type) {
      this.$emit("on-audit", this.form.id, type);
    },
    // 保存并审核
    updateAudit(formName) {
      if (this.form.enter_type == 'CGRK' && !this.form.relate_num) {
        this.$message({type: "error", message: "请选择关联单号"});
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tableData.length == 0) {
            this.$message({type: "error", message: "请添加入库明细"});
            return;
          } else {
            let err = [];
            let configList = [];
            if (
              this.tableData[0].material_id == null ||
              this.tableData[0].price == null ||
              this.tableData[0].count == null
            ) {
              this.$message({type: "error", message: "数量单价请填写完整"});
              return;
            }
          }
          let index_list = []
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.form.provider_id !== this.tableData[i].provider_id) {
              index_list.push(i)
            }
          }
          if (index_list.length > 0) {
            let names = []
            for (let i = 0; i < index_list.length; i++) {
              names.push(this.tableData[index_list[i]].material_name)
            }
            this.$confirm('物料' + names.join('、') + '供应商不一致，是否继续保存？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
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
              this.$emit("save-audit-add-edit", info);
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消保存'
              })
            })
          } else {
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
            this.$emit("save-audit-add-edit", info);
          }
        } else {
          return false;
        }
      });
    },
    // 保存
    updatePlaybill(formName) {
      if (this.form.enter_type == 'CGRK' && !this.form.relate_num) {
        this.$message({type: "error", message: "请选择关联单号"});
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tableData.length == 0) {
            this.$message({type: "error", message: "请添加入库明细"});
            return;
          } else {
            let err = [];
            let configList = [];
            if (
              this.tableData[0].material_id == null ||
              this.tableData[0].price == null ||
              this.tableData[0].count == null
            ) {
              this.$message({type: "error", message: "数量单价请填写完整"});
              return;
            }
          }
          let index_list = []
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.form.provider_id !== this.tableData[i].provider_id) {
              index_list.push(i)
            }
          }
          if (index_list.length > 0) {
            let names = []
            for (let i = 0; i < index_list.length; i++) {
              names.push(this.tableData[index_list[i]].material_name)
            }
            this.$confirm('物料' + names.join('、') + '供应商不一致，是否继续保存？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
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
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消保存'
              })
            })
          } else {
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
          }
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
</style>
