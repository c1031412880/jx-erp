<template>
  <tr-dialog
    :visible="dialogBool"
    :title="title"
    @before-close="dialogClose"
    width="1050px"
    top="70px"
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
            <el-form-item label="退货日期:" prop="return_date">
              <el-date-picker
                style="width: 100%;"
                :disabled="curSelecedType == 'detail'"
                v-model="form.return_date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经办人:" prop="agent_person_id">
              <get-department-select
                ref="handlePersonalTree"
                v-model="form.agent_person_id"
                :disabled="curSelecedType == 'detail'"
                :width="'220'"
                :show_all="true"
                :isShowCheckbox="false"
                :placeholder="'请选择人员'"
                :isContainEmp="true"
                :isExportMultiple="false"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退货仓库:" prop="house_id">
              <el-select
                :disabled="curSelecedType == 'detail' || this.tableData.length > 0"
                v-loading="houseLoading"
                @change="changeSelectHouse"
                v-model="form.house_id"
                filterable
                clearable
                placeholder="请选择"
                style="width: 100%;">
                <el-option
                  v-for="item in warehouseOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商:" prop="supplier_id">
              <el-select placeholder="请选择供应商" v-model="form.supplier_id" v-loading="supplierLoading" :disabled="curSelecedType == 'detail'" style="width: 100%" filterable>
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关联入库单:" prop="enter_order">
              <el-select 
                placeholder="请选择关联入库单"
                v-loading="orderLoading" 
                v-model="form.enter_order" 
                @change="changeSelectWarehouseIn" 
                :disabled="curSelecedType == 'detail'"
                style="width: 100%" clearable filterable>
                <el-option
                  v-for="item in stockOptions"
                  :key="item.id"
                  :label="item.enter_num"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓管员:" prop="warehouse_person_id">
              <el-select
                :disabled="curSelecedType == 'detail'"
                v-loading="personLoading"
                v-model="form.warehouse_person_id"
                clearable
                filterable
                style="width: 100%;">
                <el-option
                  v-for="item in warehousePersons"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="退料原因:" prop="return_reason">
              <el-input v-model="form.return_reason" :disabled="curSelecedType == 'detail'" type="textarea" style="width: 100%"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button
        type="primary"
        size="mini"
        :disabled="curSelecedType == 'detail'"
        @click="addData"
        >添加退货明细</el-button
      >
      <el-button
        style="margin-bottom: 30px"
        :disabled="curSelecedType == 'detail'"
        type="primary"
        size="mini"
        @click="selectRowDel()"
        >移除</el-button
      >
      <div class="table">
        <tr-table
          ref="table"
          :isShowSummary="true"
          :selectionShow="true"
          :data="tableData"
          :tableHeaderList="tableHeaderLists"
          @on-select-change-row="selectedList"
          :omitColumnIndex="[ 2, 3, 4, 5, 6, 12, 13]"
          :isFixedEmptyPlaceholder="false">
          <template slot-scope="scope" slot="material_id">
            <el-select
              :disabled="curSelecedType == 'detail'"
              v-loading="materialLoading"
              v-model="scope.data.material_id"
              :remote-method="remoteMethod"
              :autofocus="true"
              size="mini"
              filterable
              remote
              @change="changeSelectMaterials(scope)"
              placeholder="请选择">
              <el-option
                v-for="item in wuziOptions"
                :key="item.material_id"
                :label="item.groupgo"
                :value="item.material_id">
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope" slot="count">
            <el-input-number
              :disabled="curSelecedType == 'detail'"
              @change="priceChange(scope.data)"
              v-model="scope.data.count"
              :precision="1"
              :controls="false"
              :min="0"
              size="mini"
            ></el-input-number>
          </template>
          <template slot-scope="scope" slot="remark">
            <el-input
              :disabled="curSelecedType == 'detail'"
              v-model="scope.data.remark"
              maxlength="8"
              size="mini"
            ></el-input>
          </template>
        </tr-table>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button
        type="primary"
        :disabled="curSelecedType == 'detail'"
        @click="updatePlaybill('form')">保 存</el-button>
    </span>
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
import { formatDate } from "@/utils/index";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getDepartmentSelect
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
      selectedProjectIds: [], //仓库
      warehouseOptions: [], //仓库
      warehousePersons: [], //仓管员
      supplierOptions: [], // 供应商
      stockOptions: [], // 入库单
      tableData: [], //表格数据
      wuziOptions: [], //物资
      wuziOptionMap: {}, //截取的部分物资对象
      wuziOptionAllMap: {}, //所有物资对象
      houseLoading: false,
      supplierLoading: false,
      orderLoading: false,
      personLoading: false,
      materialLoading: false,

      form: {
        id: 0,
        return_date: formatDate(new Date(), 'yyyy-MM-dd'),
        agent_person_id: "",
        house_id: "",
        supplier_id: "",
        enter_order: "",
        warehouse_person_id: "",
        return_reason: "",
      },
      
      basicRules: {
        return_date: [
          {
            required: true,
            message: "请选择退货日期",
            trigger: "change",
          },
        ],
        agent_person_id: [
          {
            required: true,
            message: "请输入经办人",
            trigger: "change",
          },
        ],
        house_id: [
          {
            required: true,
            message: "请选择仓库",
            trigger: "change",
          },
        ],
        supplier_id: [
          {
            required: true,
            message: "请选择供应商",
            trigger: "change",
          },
        ],
      },
      tableHeaderLists: [
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
          label: "计量单位",
          prop: "measure_unit_name",
          width: "120",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "品牌",
          prop: "brand",
          width: "120",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "退货数量",
          prop: "count",
          width: "160",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "出库单价",
          prop: "price",
          width: "160",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "总金额",
          prop: "total_price",
          width: "160",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "当前库存",
          prop: "current_inventory",
          width: "130",
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
          label: "批次",
          prop: "batch_no",
          width: "130",
          align: "center",
          signIndex: 10,
        },
        {
          id: 12,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 11,
        },
      ],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.$refs.handlePersonalTree.onClear()
      } else {
        this.getSupplier(); //获取供应商
        this.getWarehouse(); // 获取仓库
        this.$nextTick(() => {
          this.$refs["form"].clearValidate();
        });
      }
    },
  },
  mounted() {
  },
  methods: {
    // 取消
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    setData(info) {
      this.form.agent_person_id =  ''
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(info, key)) {
          this.form[key] = info[key]
        }
      }
      this.form.enter_order = Number(info.enter_order)
      console.log(this.form);
      this.tableData = !!info.details ? info.details : []
    },
    //获取仓库
    getWarehouse() {
      let params ={
        usable: 1 //1 启用， 2 未启用
      }
      this.houseLoading = true
      this.$client.getRecord1Warehouse(params).then((req) => {
        this.houseLoading = false
        if (req.head.result === "200") {
          this.warehouseOptions = req.context;
        }
        if (req.context.length) {
          if(this.curSelecedType == 'add') {
            this.form.house_id = req.context[0].id; //给仓库赋值
          }
          this.GetGoodsAndMaterials() //获取物资
          this.getWarehousePerson() //获取仓管员
          this.getStockIn(); //获取入库单
        }
      });
    },
    //获取仓管员
    getWarehousePerson() {
      this.warehousePersons = [];
      this.personLoading = true
      this.$client.getRecordWarehouse({ id: this.form.house_id }).then((req) => {
        this.personLoading = false
        if (req.head.result === "200") {
          if (req.context.persons.length > 0) {
            req.context.persons.forEach((element) => {
              if (element.is_operater == 1) {
                this.warehousePersons.push(element);
              }
            });
            // 仓管员赋值
            if(this.curSelecedType == 'add') {
              this.form.warehouse_person_id = req.context.persons[0].id
            }
          }
        }
      });
    },
    //获取物资
    GetGoodsAndMaterials() {
      let params = {
        house_id: this.form.house_id 
      }
      // 如果选择了供应商
      if(this.form.supplier_id) {
        params.provider_id = this.form.supplier_id
      }
      this.materialLoading = true
      this.$client.getByPage1TimerHouse(params)
        .then((req) => {
          this.materialLoading = false
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
          } else {
          }
        }).catch(err=>{console.log(err)});
    },
    //获取供应商
    getSupplier() {
      this.supplierLoading = true
      this.$client.GetProviderPage().then((req) => {
        this.supplierLoading = false
        if (req.head.result === "200") {
          this.supplierOptions = req.context.list;
          if(this.curSelecedType == 'add') {
            this.form.supplier_id = req.context.list[0].id
          }
        }
      });
    },
    // 获取入库单
    getStockIn() {
      let params = {
        state: 2,
        // provider: this.form.supplier_id ? this.form.supplier_id : '',
        house_ids: this.form.house_id ? [ this.form.house_id ] : ''
      }
      this.orderLoading = true
      this.$client.getByPageEnterHouse(params).then((req) => {
        this.orderLoading = false
        if (req.head.result === "200") {
          this.stockOptions = req.context.list;
        }
      });
    },
    // 切换仓库清空原数据
    changeSelectHouse(val) {
      if(!!val) {
        this.form.enter_order = ''
        this.form.warehouse_person_id = ''
        this.wuziOptions = []
        this.stockOptions = []
        this.warehousePersons = []
        this.GetGoodsAndMaterials()
        this.getWarehousePerson()
        this.getStockIn(); //获取入库单
      }
    },
    // 物料搜索方法
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
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
    // 选择物资
    changeSelectMaterials(val) {
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
      for (var o=0; o<this.tableData.length; o++) {
        for (var j=o+1; j<this.tableData.length; j++) {
          if (this.tableData[o].material_id == this.tableData[j].material_id&&this.tableData[o].material_id!=null) {
            Object.keys(this.tableData[val.index]).forEach((key) => {
              this.tableData[val.index][key] = ''
            });
            console.log(this.tableData);
            this.$message({
              showClose: true,
              message: "已添加过该物料",
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
      this.tableData[i].measure_unit_name = this.wuziOptions[l].measure_unit_name;
      this.tableData[i].brand = this.wuziOptions[l].brand;
      this.tableData[i].batch_no = this.wuziOptions[l].batch_no;
      console.log(this.tableData, '添加物料后列表');
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
        // this.tableData[i].total_price =
        //   this.tableData[i].count * this.tableData[i].price;
        this.$set(this.tableData[i], 'total_price', this.tableData[i].count * this.tableData[i].price)
      }
      console.log(this.tableData,i);
    },
    // 选择入库单
    changeSelectWarehouseIn(val) {
      if(!val) {
        this.tableData = []
        return false
      }
      let info = this.stockOptions.filter(item => {
        return item.id === val
      })
      if(info[0].details && info[0].details.length) {
        info[0].details.forEach(item => {
          if(info[0].house_id == this.form.house_id && item.provider_id == this.form.supplier_id) {
            let isTrue = this.tableData.some(sing => { return sing.material_id == item.material_id})
            let selectObj = this.wuziOptionAllMap[item.material_id]
            console.log(this.tableData,this.wuziOptionAllMap,item.material_id, isTrue, selectObj, '选择入库单后列表、每一个id、是否要加入、加入的对象');
            if(!isTrue && !!selectObj) {
              let obj = {
                count: "",
                price: selectObj.price,
                current_inventory: selectObj.count,
                total_inventory: selectObj.total_count,
                material_id: item.material_id,
                material_name: selectObj.material_name,
                specification: selectObj.specification,
                measure_unit_name: selectObj.measure_unit_name,
                brand: selectObj.brand,
                batch_no: selectObj.batch_no,
              }
              this.tableData.push(obj)
            }
          }
        })
        setTimeout(() => {
          this.GetGoodsAndMaterials()
        }, 300);
      }
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
      this.tableData.push({})
      setTimeout(() => {
        this.$refs.table.gobutton();
      }, 60);
    },
    //选择行
    selectedList(projectList) {
      this.selectedProjectIds = [];
      projectList.forEach((item, index) => {
        this.selectedProjectIds.push(item);
      });
    },
    //批量移除
    selectRowDel() {
      if (this.selectedProjectIds.length == 0) {
        this.$message({
          showClose: true,
          message: "请勾选要删除的选项",
          type: "warning",
        });
        return;
      }
      this.selectedProjectIds.forEach((item, index) => {
        //删除改行
        var i = this.tableData.findIndex((sing) => {
            return sing.material_id == item.material_id;
        });
        this.tableData.splice(i, 1);
      });
    },
    // 保存
    updatePlaybill(formName) {
      if(this.tableData.length === 0) {
        this.$message({ type: "warning", message: "请添加出库明细" });
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let validate = false
          this.tableData.forEach(item => {
            if(!item.material_id || !item.count) validate = true
          })
          if(validate) {
            this.$message({ type: "warning", message: "请选择物料后并填写退货数量" });
            return;
          }
          this.$set(this.form, "details", this.tableData);
          let info = {};
          for (let i in this.form) {
            if (this.form[i]) {
              info[i] = this.form[i];
            }
          }
          if(this.curSelecedType == 'add') info.id = 0
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
.el-dialog-div {
  display: flex;
}

</style>
