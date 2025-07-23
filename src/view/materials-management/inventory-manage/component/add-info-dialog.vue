<template>
  <el-dialog
    :visible="dialogBool"
    title="盘点录入"
    :before-close="dialogClose"
    width="920px"
    
  >
    <el-form
      ref="form"
      style="margin-bottom: 10px"
      class="demo-ruleForm"
      :inline="true"
      :model="form"
      :rules="rules"
      size="mini">
      <el-form-item label="方案名称" prop="plan_name">
        <el-input v-model="form.plan_name"></el-input>
      </el-form-item>
      <el-form-item label="盘点日期" prop="check_date">
        <el-date-picker
          v-model="form.check_date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="盘点仓库" prop="warehouse_id">
        <el-select
          v-model="form.warehouse_id"
          filterable
          clearable
          @change="getMaterial()"
          :disabled="data.length > 0"
          placeholder="请选择">
          <el-option
            v-for="item in houseOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="盘点负责人" prop="check_id">
        <el-select
          filterable
          v-model="form.check_id"
          clearable>
          <el-option
            v-for="item in checkList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      
      <!-- <el-form-item label="审核状态">
        <el-select v-model="form.state">
          <el-option
            v-for="item in stateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="盘点类型" prop="type">
        <el-select v-model="form.type">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addData" :loading="loading">添加盘点明细</el-button>
        <el-button type="primary" @click="delAll">移除</el-button>
        <el-button type="primary" @click="importFile">导入</el-button>
      </el-form-item>
    </el-form>
    <tr-table
      ref="table"
      @on-select-change-row="tableSelectChange"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :isFixedEmptyPlaceholder="false">
      <template slot-scope="scope" slot="operation">
        <el-popconfirm
          @confirm="delTable(scope.index)"
          title="确定移除当前盘点记录吗？">
          <el-button slot="reference" type="primary" size="mini">移除</el-button>
        </el-popconfirm>
      </template>
      <template slot-scope="scope" slot="code">
        <get-material-select
          :allList="allList"
          :maxMumber="maxMumber"
          v-model="data[scope.index].material_id"
        @change="materialChange($event, scope.index)"></get-material-select>
      </template>
      <template slot="real_count" slot-scope="scope">
        <el-input-number style="width: 100px" size="mini" v-model="data[scope.index].real_count" @change="changeRealCount(scope.data,scope.index)" :controls="false" :min="0"></el-input-number>
      </template>
      <template slot="difference" slot-scope="scope">
        {{scope.data.real_count > scope.data.inventory_count ? '+' : ''}}{{scope.data.real_count - scope.data.inventory_count}}
      </template>
      <template slot="state" slot-scope="scope">
        <el-tag size="mini" :type="scope.data.real_count > scope.data.inventory_count ? 'success' : (scope.data.real_count === scope.data.inventory_count ? '' : 'danger')">
          {{scope.data.real_count > scope.data.inventory_count ? '盘盈' : (scope.data.real_count === scope.data.inventory_count ? '盘平' : '盘亏')}}
        </el-tag>
      </template>
      <template slot="fee" slot-scope="scope">
        <el-input-number style="width: 100px" size="mini" v-model="data[scope.index].fee" :controls="false" ></el-input-number>
      </template>
    </tr-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="ok">保 存</el-button>
    </span>
    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :typeMessage ="'物料编码'"
      @on-submit-excel ="importInfoExcel"
      :isShowImportState="false"
    ></file-dialog>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { formatDate } from "@/utils/index";
import detailsConfig from "./detailsConfig";
import getMaterialSelect from "./get-material-select";
import fileDialog from '@/components/fileDialog/file-dialog.vue'
export default {
  components: {getMaterialSelect,fileDialog},
  props: {
    dialogBool: Boolean,
    materialList:[Array],
    // 物料名称    目前只给轮胎用
    main_name:[Array],
  },
  data() {
    return {
      form: {
        warehouse_id: '',
        id: 0,
        plan_name: '',
        check_date: formatDate(new Date(),"yyyy-MM-dd"),
        check_id: '',
        state: 1,
        type: '',
        remark: '',
        details: []
      },
      stateOptions: detailsConfig.state,
      typeOptions: detailsConfig.type,
      canRendererTableHeader: detailsConfig.headData,
      TableHeight: detailsConfig.TableHeight,
      frontFixedNum: detailsConfig.frontFixedNum,
      backFixedNum: detailsConfig.backFixedNum,
      data: [],
      houseOptions: [],
      checkList: [],
      selectList: [],
      warehouseList:[],
      loading: false,
      allList:[],
      FileData: {
          url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/盘点明细模板.xlsx`,
        },
      filedialogVisible: false,
      maxMumber: 30,
      rules:{
        plan_name: [{ required: true, message: "请输入方案名称", trigger: "change" }],
        check_date: [{ required: true, message: "请选择盘点日期", trigger: "change" }],
        check_id: [{ required: true, message: "请选择盘点负责人", trigger: "change" }],
        warehouse_id: [{ required: true, message: "请选择盘点仓库", trigger: "change" }],
        type: [{ required: true, message: "请选择盘点类型", trigger: "change" }],
      }
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.form, this.$options.data().form);
        this.data = []
      }else{
        // this.getMaterial()
        setTimeout(() => {
          this.getMaterial()
        }, 30);
      }
    },
    'form.warehouse_id' (val) {
      this.getWarehouseList(val)
    },
    // materialList(newVal, oldVal) {  //对数组进行监听
    //   this.allList = JSON.parse(JSON.stringify(this.materialList))    
    // },
  },
  mounted() {
    this.getWarehouse()
  },
  methods: {
    // 获取盈亏金额
    changeRealCount(row,index) {
      this.data[index].fee = (row.real_count - row.inventory_count) * row.price
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 表格选中
    tableSelectChange(row) {
      this.selectList = []
      row.forEach(item => {
        this.selectList.push(item.material_id)
      })
    },
    //获取物资
    getMaterial() {
      let form = {
        usable: 1
      }
      if (this.form.warehouse_id) {
        form.warehouse_id = this.form.warehouse_id
      }
      if (this.main_name) {
        form.main_name = this.main_name
      }
      this.$client.getMaterialPage(form).then((req) => {
        if (req.head.result === "200") {
          this.allList = req.context.list;
        }
      });
    },
    // 批量移除
    delAll() {
      let data = []
      this.data.forEach(item => {
        if (this.selectList.indexOf(item.material_id) < 0) {
          data.push(item)
        }
      })
      this.data = [...data]
    },
    // 打开导入弹窗
    importFile() {
      this.filedialogVisible = true;
    },
    // 导入物料信息Excel
    importInfoExcel(exportInfo){
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      // formData.append("type", 1);
      let params = formData
      this.$client.ImportWarehouseCheck(params).then(res => {
        if(res.head.result == "200") {
          let Item1 = res.context.Item1
          if(!!Item1 && Item1.length) {
            this.maxMumber =  Item1.length + this.data.length + 30
            Item1.forEach((item,index) => {
              this.allList.forEach((zItem,zIndex) => {
                if(item.material_id == zItem.id) {
                  let obj = Object.assign({},zItem)
                  this.allList.splice(zIndex,1)
                  this.allList.unshift(obj)
                }
              })
            })
            this.data = [...Item1,...this.data]
          }
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        }else if(res.head.result == "205") {
          this.filedialogVisible = false;
          if(!!res.context && res.context.length > 0) {
            let errorData = [];
            let list = res.context
            let h = this.$createElement;
            list.forEach(element => {
              errorData.push(h('p',null,element));
            });
            this.$msgbox({
              title: `导入错误提示(共${list.length}条)`,
              message: h('div',{ style: `height: 300px;${list.length > 12?'overflow-y: scroll':''}`}, errorData),
              confirmButtonText: '确定',
            })
          }
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 提交
    ok() {
      this.form.details = []
      this.data.forEach(item => {
        this.form.details.push({
          material_id: item.material_id,
          inventory_count: item.inventory_count,
          real_count: item.real_count,
          difference: item.real_count - item.inventory_count,
          state: item.real_count > item.inventory_count ? 1 : (item.real_count === item.inventory_count ? 3 : 2),
          fee: item.fee,
          price: item.price,
        })
      })
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('on-ok', {...this.form})
        } else {
          return false;
        }
      });
    },
    // 移除明细
    delTable(idx) {
      this.data.splice(idx, 1)
    },
    // 选中变化
    materialChange(item, index) {
      this.data[index].name = item.name
      this.data[index].specification = item.specification
      this.data[index].unit = item.measure_unit_name
      this.data[index].inventory_count = item.count
      this.data[index].real_count = item.count
      this.data[index].price = item.price
    },
    // 添加
    addData() {
      this.loading = true
      this.data.push({...detailsConfig.formModel})
      setTimeout(() => {
        this.loading = false
      }, 1200);
    },
    //获取仓管员
    getWarehouseList(val) {
      this.checkList = [];
      this.warehouseList = [];
      this.$client.getRecordWarehouse({ id: val }).then((req) => {
        if (req.head.result === "200") {
          this.checkList = req.context.persons;
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
    //获取仓库
    getWarehouse() {
      this.$client.getRecord1Warehouse().then((req) => {
        if (req.head.result === "200") {
          this.houseOptions = req.context;
          if (req.context.length > 0) {
            this.form.warehouse_id = req.context[0].id;
          }
        }
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


