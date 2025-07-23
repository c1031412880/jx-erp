<template>
  <tr-dialog
    :visible="dialogBool"
    :title="title"
    @before-close="dialogClose"
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
            <el-form-item label="日期:" prop="ask_date">
              <el-date-picker
                :disabled="curSelecedType == 'detail'"
                v-model="form.ask_date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购员:" prop="purchase_person_id">
              <el-select
                filterable
                :disabled="curSelecedType == 'detail'"
                v-model="form.purchase_person_id"
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
            <el-form-item label="备注:" prop="remark">
              <el-input
                :disabled="curSelecedType == 'detail'"
                v-model="form.remark"
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
        :loading="loadind"
        >添加询价明细</el-button
      >
      <el-button
        style="margin-bottom: 10px"
        :disabled="curSelecedType == 'detail'"
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
          :TableHeight="350"
          @on-select-change-row="selectedList"
          ref="table"
          :omitColumnIndex="[1,2, 3, 4, 5, 7, 10]"
        >
          >
          <template slot-scope="scope" slot="material_id">
            <el-select
              :disabled="curSelecedType == 'detail'"
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
              :disabled="curSelecedType == 'detail'"
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
              :disabled="curSelecedType == 'detail'"
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
              :disabled="curSelecedType == 'detail'"
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
          <template slot-scope="scope" slot="supplier_id">
            <el-select
              :disabled="curSelecedType == 'detail'"
              v-model="scope.data.supplier_id"
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
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
import { formatTime } from "@/utils/index";
export default {
  components: {
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
      warehouseList: [],
      pagesize: 10, //默认分页每页数据量
      currentPage: 1, //默认展示第一页数据
      form: {
        ask_date: formatTime(new Date(),'yyyy-MM-dd'),
        purchase_person_id: "",
        remark: "",
        id: 0
      },
      buyerList: [],
      gongysOptions: [],
      basicRules: {
        ask_date: [
          {
            required: true,
            message: "请输入入库时间",
            trigger: "blur",
          },
        ],
        purchase_person_id: [
          {
            required: true,
            message: "请选择采购员",
            trigger: "blur",
          },
        ],
      },
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
          prop: "spec",
          width: "160",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "计量单位",
          prop: "unit",
          width: "120",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "预计采购数量",
          prop: "count",
          width: "160",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "供应商",
          prop: "supplier_id",
          width: "150",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "报价单价",
          prop: "price",
          width: "160",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "报价总金额",
          prop: "total_price",
          width: "160",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 8,
        },
      ],
      loadind: false,
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.getGinsang();
        this.getwuzi()
        this.getWarehouseperson()
        this.$nextTick(() => {  
          this.$refs["form"].clearValidate();
        });
      }
    },
  },
  mounted() {
  },
  methods: {
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
      this.tableData[i].spec = this.wuziOptions[l].specification;
      this.tableData[i].unit =
        this.wuziOptions[l].measure_unit_name;
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
      let params = {
        usable: 1,
      }
      this.$client.getMaterialPage(params).then((req) => {
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
            if (item.spec == null) {
              item.groupgo = item.name + "(" + item.code + ")";
            } else {
              item.groupgo =
                item.name + item.spec + "(" + item.code + ")";
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
    },
    //选择
    selectedList(projectList) {
      this.selectedProjectIds = [];
      projectList.forEach((item, index) => {
        this.selectedProjectIds.push(item);
      });
    },
    //新增行
    addData() {
      if (this.tableData.length > 49) {
        this.$message({ type: "error", message: "物资数量不能超过50" });
        return;
      }
      if (this.tableData.length > 0) {
        this.tableData.push({
          supplier_id: this.tableData[this.tableData.length - 1].supplier_id,
        });
      }  else {
        this.tableData.push({});
      }
      setTimeout(() => {
        this.$refs.table.gobutton();
        let page = Math.ceil(this.tableData.length / this.pagesize);
        this.handleCurrentChange(page);
      }, 60);
    },
    // 取消
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    //获取仓管员
    getWarehouseperson() {
      this.buyerList = [];
      this.$client.GetWHPerson({}).then((req) => {
        if (req.head.result === "200") {
          this.buyerList = req.context
        }
      });
    },
    // 保存
    updatePlaybill(formName) {
      if (this.form.enter_type == 'CGRK' && !this.form.relate_num) {
        this.$message({ type: "error", message: "请选择关联单号" });
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
}
</style>
