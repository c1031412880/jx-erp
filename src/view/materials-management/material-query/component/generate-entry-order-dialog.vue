<template>
  <el-dialog :visible="dialogBool" title="生成退料入库单" :before-close="dialogClose" append-to-body width="1050px">
    <div class="generate-entry-order-dialog-content">
      <el-form
        :model="form"
        :rules="basicRules"
        label-width="100px"
        ref="materialForm"
        size="mini"
        inline>
        <el-form-item label="入库方式:">
          <el-input disabled v-model="form.enterType"></el-input>
        </el-form-item>
        <el-form-item label="入库日期:" prop="create_date">
          <el-date-picker
            v-model="form.created_date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入库仓库:" prop="house_id">
          <el-select
            @change="getWarehouseperson"
            v-model="form.house_id"
            filterable
            clearable
            placeholder="请选择">
            <el-option
              v-for="item in stoneOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联工单:">
          <el-input disabled v-model="relevanceWorkCode"></el-input>
        </el-form-item>
        <el-form-item label="仓管员:">
          <el-select
            v-model="form.storage_id"
            clearable>
            <el-option
              v-for="item in warehouseList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item label="关联入库单号:">
          <el-input v-model="relevanceInCode" disabled></el-input>
        </el-form-item>
        <div style="margin-bottom: 10px;"><span style="margin-right: 15px; color: rgb(64, 158, 255);font-weight: bold;">入库明细</span><span style="color: #d3d3d3;font-size: 12px;">说明：退料入库数量不能超过出库数量</span></div>
      </el-form>
      <div class="table">
        <tr-table
          :isShowSummary="true"
          :TableHeight="400"
          :tableHeaderList="tableHeaderLists"
          :sumTotal="sumTotal"
          :sumColumnIndex="[6,8]"
          :data="tableData">
          <template slot-scope="scope" slot="material_id">
            <el-select
              :autofocus="true"
              disabled
              size="mini"
              filterable
              remote
              style="width: 140px"
              v-model="scope.data.material_id">
              <el-option
                v-for="item in MaterialList"
                :key="item.material_id"
                :label="item.groupgo"
                :value="item.material_id">
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope" slot="scount">
            <el-input-number style="width: 100px" size="mini" :max="scope.data.t_count || 0" v-model="scope.data.scount" :controls="false"></el-input-number>
          </template>
          <template slot-scope="scope" slot="provider_id" >
            <el-select v-model="scope.data.provider_id" disabled filterable clearable placeholder="请选择">
              <el-option
                v-for="item in gongysOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </tr-table>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit()" size="mini">提 交</el-button>
      <el-popconfirm
        @confirm="dialogClose()"
        title="当前内容暂未提交，确认取消？">
        <el-button slot="reference" size="mini">取 消</el-button>
      </el-popconfirm>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogBool: Boolean,
    defaultTableData: {
      tyep: Array,
      default: []
    }
  },
  data () {
    return {
      form: {
        id: '',
        enterType: '退料入库',
        created_date: '',
        house_id: '',
        storage_id: '',
        work_code: '',
        remark: '',
        lp_num: ''
      },
      stoneOptions: [],
      selectList: [],
      warehouseList: [], 
      buyerList: [],
      basicRules: {
        created_date: [
          {
            required: true,
            message: "请选择入库日期",
            trigger: "blur",
          },
        ],
        house_id: [
          {
            required: true,
            message: "请选择仓库",
            trigger: "blur",
          },
        ]
      },
      tableData: [],
      MaterialList: [],
      gongysOptions:[],
      MaterialListMap: {},
      isMaterialListMap: false,
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
          id: 6,
          label: "退料入库数量",
          prop: "scount",
          width: "160",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "单价",
          prop: "price",
          width: "160",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {  
          id: 8,
          label: "总金额",
          prop: "total_price",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "批次",
          prop: "batch_no",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "供应商",
          prop: "provider_id",
          width: "160",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
      ]
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false)
    },
    // 获取仓管员
    getWarehouseperson(val) {
    //   this.materialForm.storage_id = ""
      this.warehouseList = []
    //   this.materialForm.pick_id = ""
      this.buyerList = []
      if (val == null || val == '') {
        return false
      }
      this.$client.getRecordWarehouse({ id: val }).then((req) => {
        if (req.head.result === "200") {
          this.buyerList = req.context.persons
          if (req.context.persons.length > 0) {
            req.context.persons.forEach((element) => {
              if (element.is_operater == 1) {
                this.warehouseList.push(element)
              }
            });
            if (this.warehouseList && this.warehouseList.length) {
              this.form.storage_id = this.warehouseList[0].id
            }
          }
        }
        this.getMaterial()
      })
    },
    // 获取仓库
    getWarehouse() {
      this.$client.getRecord1Warehouse().then((req) => {
        if (req.head.result === "200") {
          this.stoneOptions = req.context
        }
        this.getWarehouseperson(this.form.house_id)
      })
    },
    //获取供应商
    getGinsang(){
      this.$client.GetProviderPage().then(req => {
          if (req.head.result === '200') {
          this.gongysOptions = req.context.list
        }
        else{
          this.$message({type: 'error', message: '获取失败'})
        }
      })  
    },
    // 获取物资
    getMaterial() {
      this.$client.getByPage1TimerHouse({ house_id: this.form.house_id }).then((req) => {
        if (req.head.result === "200") {
          let length = req.context.list.length
          let allList = req.context.list
          this.MaterialList = []
          for (let i = 0; i < length; i++) {
            let item = allList[i]
            if (item.specification == null) {
              item.groupgo = item.material_name + "(" + item.material_code + ")"
            } else {
              item.groupgo = item.material_name + item.specification + "(" + item.material_code + ")"
            }
            this.MaterialList.push(item)
            this.MaterialListMap[item.material_id] = item
          }
          this.isMaterialListMap = true
          this.tableData = []
          if (this.defaultTableData && this.defaultTableData.length) {
            console.log(this.defaultTableData)
            this.defaultTableData.forEach(el => {
              let obj = this.MaterialListMap[el.material_id]
              obj.total_price = el.count * obj.price
              obj.t_count = el.count
              obj.scount = el.count
              this.tableData.push(obj)
            })
          }
        }
      })
    },
    submit() {
      let param = {
        context: {
          refund_id : this.form.id,
          enter_date: this.form.created_date,
          enter_type: 'TLRK',
          house_id: this.form.house_id,
          house_name: this.stoneOptions.find(item => item.id == this.form.house_id).name,
          relate_num: this.form.work_code,
          work_code: this.form.work_code,
          lp_num: this.form.lp_num,
          storage_id: this.form.storage_id,
          remark: this.form.remark,
          details: this.tableData.map(item => {
            return {
              house_id: item.house_id,
              material_id: item.material_id,
              material_name: item.material_name,
              material_code: item.material_code,
              specification: item.specification,
              measure_unit_name: item.measure_unit_name,
              brand: item.brand,
              count: item.scount,
              price: item.price,
              total_price: item.total_price,
              current_inventory: item.current_inventory,
              total_inventory: item.total_inventory,
              batch_no: item.batch_no,
              remark: item.remark
            }
          })
        }
      }
      this.$client.setRecordEnterHouse(param).then((res) => {
        if (res.head.result == "200") {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          })
          this.dialogClose()
          this.$emit("refresh")
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          })
        }
      }) .catch((err) => {})
    }
  },
  computed: {
    sumTotal () {
      return {
        6: this.tableData.map(item => item.scount).reduce((a, b) => a + b, 0),
        8: this.tableData.map(item => item.total_price).reduce((a, b) => a + b, 0)
      }
    },
    relevanceWorkCode () {
      return !!this.form.work_code ? this.form.work_code + '(' + this.form.lp_num + ')' :  '未关联'
    },
    relevanceInCode () {
      return !!this.form.in_code ? this.form.in_code + '(' + this.form.lp_num + ')' : '未关联'
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        // Object.assign(this.$data, this.$options.data())
        this.tableData = []
      } else {
        this.getWarehouse()
        this.getGinsang()
        if (this.defaultTableData && this.defaultTableData.length && this.isMaterialListMap) {
          this.defaultTableData.forEach(el => {
            let obj = this.MaterialListMap[el.material_id]
            obj.total_price = el.count * obj.price
            obj.t_count = el.count
            obj.scount = el.count
            this.tableData.push(obj)
          })
        }
        this.$nextTick(() => {
          this.$refs.materialForm.clearValidate()
        })
      }
    },
  },
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.generate-entry-order-dialog-content {
  height: 550px;
  .table {
    margin-bottom: 15px;
  }
}
</style>