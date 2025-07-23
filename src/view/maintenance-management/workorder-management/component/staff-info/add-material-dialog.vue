<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    append-to-body
    width="1050px">
    <div class="add-material-dialog-content">
      <el-form
        :model="materialForm"
        :rules="basicRules"
        label-width="100px"
        ref="materialForm"
        size="mini"
        inline>
        <el-form-item label="领料单号:">
          <el-input v-if="materialForm.code" disabled v-model="materialForm.code" placeholder=""></el-input>
          <el-input v-else disabled v-model="text" placeholder=""></el-input>
        </el-form-item>
        <!-- <el-form-item label="出库方式:">
          <el-input disabled v-model="materialForm.leave_type_text" placeholder=""></el-input>
        </el-form-item> -->
        <el-form-item label="领料日期:" prop="leave_date">
          <el-date-picker
            v-model="materialForm.leave_date"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            type="datetime"
            placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="领料仓库:" prop="house_id">
          <el-select
            @change="getWarehouseperson"
            v-model="materialForm.house_id"
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
          <el-input disabled v-model="materialForm.relate_num"></el-input>
        </el-form-item>
        <el-form-item label="车辆:">
          <el-input disabled v-model="materialForm.lp_num"></el-input>
        </el-form-item>
        <!-- <el-form-item label="领料用途:">
          <get-select-dictionaries
            v-model="materialForm.use_way"
            :classKey="'领料用途'"
            :placeholder="'请选择领料用途'">
          </get-select-dictionaries>
        </el-form-item> -->
        <!-- <el-form-item label="仓管员:">
          <el-select
            v-model="materialForm.storage_id"
            clearable>
            <el-option
              v-for="item in warehouseList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="领料人:" prop="pick_id">
          <el-select
            filterable
            v-model="materialForm.pick_id"
            clearable>
            <el-option
              v-for="item in buyerList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="领料组织:">
          <get-department-select
            ref="baseTree"
            :isContainEmp="false"
            :funcType="1"
            :isShowCheckbox="false"
            :isExportMultiple="false"
            v-model="materialForm.pick_depatment_id">
          </get-department-select>
        </el-form-item> -->
        <!-- <el-form-item label="领料类型:" prop="pick_type_id">
          <tr-select-dictionaries
            v-model="materialForm.pick_type_id"
            :classKey="'维修领料类型'"
            :placeholder="'请选择维修领料类型'"
            :isMultiple="false"
            :isShowDefaultValue="true"
          ></tr-select-dictionaries>
        </el-form-item> -->
        <el-form-item label="备注:">
          <el-input v-model="materialForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="mini" @click="addData()" >添加领料明细</el-button>
      <el-button style="margin-bottom: 30px" type="primary" size="mini" @click="deleteSelect()">移除</el-button>
      <div class="table">
        <tr-table
          :isShowSummary="true"
          :selectionShow="true"
          :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
          :tableHeaderList="tableHeaderLists"
          @on-select-change-row="tableSelectChange"
          :TableHeight="330"
          :sumTotal="sumTotal"
          :sumColumnIndex="[6,8]"
          :omitColumnIndex="[2, 3, 4, 5, 6, 8, 10, 11, 12, 13, 14]"
          ref="table"
          :isFixedEmptyPlaceholder="false"
        >
          <template slot-scope="scope" slot="material_id">
            <el-select
              :remote-method="remoteMethod"
              :autofocus="true"
              size="mini"
              filterable
              clearable
              remote
              style="width: 140px"
              v-model="scope.data.material_id"
              @change="materialChange($event, scope.index)"
              placeholder="请选择">
              <el-option
                v-for="item in MaterialList"
                :key="item.material_id"
                :label="item.groupgo"
                :value="item.material_id">
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope" slot="remark">
            <el-input style="width: 100px" size="mini" v-model="scope.data.remark" type="textarea"></el-input>
          </template>
          <template slot-scope="scope" slot="scount">
            <el-input-number style="width: 100px" size="mini" :max="scope.data.count || 0" @change="setFee(scope.index)" @input.native="check($event, scope.data.count)" v-model="scope.data.scount" :controls="false"></el-input-number>
          </template>
          <template slot-scope="scope" slot="pick_type_id">
            <tr-select-dictionaries
              v-model="scope.data.pick_type_id"
              :classKey="'维修领料类型'"
              :placeholder="'请选择维修领料类型'"
              :isMultiple="false"
              :isShowDefaultValue="true"
            ></tr-select-dictionaries>
          </template>
          <template slot-scope="scope" slot="batch_no">
            <span v-if="scope.data.batch_no">{{ scope.data.batch_no }}</span>
            <span v-else>系统自动生成</span>
          </template>
          <template slot-scope="scope" slot="operation">
            <el-popconfirm
              @confirm="deleteSelect(scope.index)"
              title="确定移除当前记录吗？">
              <el-button slot="reference" type="primary" size="mini">移除</el-button>
            </el-popconfirm>
        </template>
        </tr-table>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10]"
        :page-size="pagesize"
        :total="tableData.length"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="submit()" type="primary">提 交</el-button>
      <el-popconfirm
        @confirm="dialogClose()"
        title="当前内容暂未提交，确认取消？">
        <el-button slot="reference" size="mini">取 消</el-button>
      </el-popconfirm>
    </span>
  </el-dialog>
</template>
<script>
import { formatDateTime } from "@/utils/index"
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries"
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree"
export default {
  components: {
    getSelectDictionaries,
    getDepartmentSelect
  },
  data () {
    return {
      text: '提交后自生成',
      materialForm: {
        use_way: "",
        out_vehicle: "2",
        line_name:'',
        line_id:'',
        leave_type: "WXCK",
        code: '',
        leave_type_text: '维修出库',
        leave_date: '',
        house_id: "",
        relate_num: "",
        lp_num: "",
        storage_id: "",
        pick_id: "",
        // pick_type_id: "",
        pick_depatment_id: "",
        remark: "",
        order_id: '',
        out_code: '',
        id: ''
      },
      stoneOptions: [],
      selectList: [],
      warehouseList: [],
      buyerList: [],
      basicRules: {
        leave_date: [
          {
            required: true,
            message: "请输入领料日期",
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
        // pick_type_id: [
        //   {
        //     required: true,
        //     message: "请选择领料类型",
        //     trigger: "blur",
        //   },
        // ]
      },
      exitsData: [],
      tableData: [],
      pagesize: 10, //默认分页每页数据量
      currentPage: 1, //默认展示第一页数据
      MaterialList: [],
      MaterialListMap: {},
      isMaterialListMap: false,
      tableHeaderLists: [
        {
          id: 1,
          label: "物料编码",
          prop: "material_id",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "物料名称",
          prop: "material_name",
          // width: "160",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "规格型号",
          prop: "specification",
          // width: "160",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "单位",
          prop: "measure_unit_name",
          // width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        // {
        //   id: 5,
        //   label: "品牌",
        //   prop: "brand",
        //   width: "120",
        //   align: "center",
        //   signIndex: 4,
        //   sortable: false,
        // },
        {
          id: 7,
          label: "领取数量",
          prop: "scount",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "领料类型",
          prop: "pick_type_id",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        // {  
        //   id: 9,
        //   label: "总金额",
        //   prop: "total_price",
        //   width: "160",
        //   align: "center",
        //   signIndex: 8,
        //   sortable: false,
        // },
        // {
        //   id: 10,
        //   label: "当前仓库库存",
        //   prop: "count",
        //   width: "150",
        //   align: "center",
        //   signIndex: 9,
        //   sortable: false,
        // },
        // {
        //   id: 11,
        //   label: "全部仓库库存",
        //   prop: "total_count",
        //   width: "150",
        //   align: "center",
        //   signIndex: 10,
        //   sortable: false,
        // },
        // {
        //   id: 12,
        //   label: "批次",
        //   prop: "batch_no",
        //   width: "130",
        //   align: "center",
        //   signIndex: 11,
        //   sortable: false,
        // },
        // {
        //   id: 14,
        //   label: "备注",
        //   prop: "remark",
        //   width: "130",
        //   align: "center",
        //   signIndex: 13,
        //   sortable: false,
        // },
        {
          id: 15,
          label: "操作",
          prop: "operation",
          // width: "140",
          align: "center",
          signIndex:14
        },
      ],
    }
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "添加领料单",
    },
    curSelectType: {
      type: String,
      default: "add",
    }
  },
  mounted() {},
  methods: {
    handleSizeChange(val) {
      this.pagesize = val
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    },
    dialogClose() {
      this.$emit("update:dialogBool", false)
    },
    // 获取仓管员
    getWarehouseperson(val, pick_id) {
      this.tableData = []
      this.materialForm.storage_id = ""
      this.warehouseList = []
      if (pick_id) {
        this.materialForm.pick_id = pick_id
      } else {
        this.materialForm.pick_id = ""
      }
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
              this.materialForm.storage_id = this.warehouseList[0].id
            }
          }
        }
        this.getMaterial()
      })
    },
    // 获取仓库
    getWarehouse(house_id, pick_id) {
      this.$client.getRecord1Warehouse().then((req) => {
        if (req.head.result === "200") {
          this.stoneOptions = req.context
        }
        if (req.context.length) {
          if (!house_id) {
            this.materialForm.house_id = req.context[0].id
          }
          this.getWarehouseperson(this.materialForm.house_id, pick_id)
        }
      })
    },
    // 获取物资
    getMaterial() {
      this.$client.getByPage1TimerHouse({ house_id: this.materialForm.house_id }).then((req) => {
        if (req.head.result === "200") {
          this.MaterialList = []
          this.MaterialListAll = []
          let length = req.context.list.length
          let allList = req.context.list
          for (let i = 0; i < length; i++) {
            let item = allList[i]
            if (item.specification == null) {
              item.groupgo = item.material_name + "(" + item.material_code + ")"
            } else {
              item.groupgo = item.material_name + item.specification + "(" + item.material_code + ")"
            }
            this.MaterialListAll.push(item)
            this.MaterialListMap[item.material_id] = item
            if (i < 30) {
              this.MaterialList.push(item)
            }
          }
          this.isMaterialListMap = true
          if (this.exitsData && this.exitsData.length) {
            this.tableData = this.exitsData.map(children => {
              let obj = this.MaterialListMap[children.material_id]
              return {
                material_id: obj.material_id,
                material_name: obj.material_name,
                specification: obj.specification,
                measure_unit_name: obj.measure_unit_name,
                brand: obj.brand,
                scount: children.count,
                total_price: children.count * obj.price,
                price: obj.price,
                count: obj.count,
                total_count: obj.total_count,
                batch_no: obj.batch_no,
                pick_type_id: obj.pick_type_id,
                id: obj.id,
                code: obj.material_code,
                remark: children.remark
              }
            })
          }
        }
      })
    },
    // 物料编码筛选
    remoteMethod(query) {
      if (query) {
        this.MaterialList = this.MaterialListAll.filter(
          (item) => {
            return (
              item.groupgo.toLowerCase().indexOf(query.toLowerCase()) > -1 && this.MaterialList.length < 31
            );
          }
        );
      } else {
        this.MaterialList = this.MaterialListAll.filter((item, i) => {
          return i < 30
        })
      }
    },
    // addData
    addData() {
      if (this.materialForm.house_id == "") {
        this.$message({ type: "error", message: "请先选择仓库" })
        return
      }
      if (this.tableData.length > 49) {
        this.$message({ type: "error", message: "物资数量不能超过50" })
        return
      }
      this.tableData.push({
        material_name: '',
        specification: '',
        measure_unit_name: '',
        brand: '',
        scount: 0,
        price: '',
        count: '',
        total_count: '',
        batch_no: '',
        pick_type_id: '',
        remark: ''
      })
      setTimeout(() => {
        this.$refs.table.gobutton()
        let page = Math.ceil(this.tableData.length / this.pagesize)
        this.handleCurrentChange(page)
      }, 60)
    },
    // 表格选中
    tableSelectChange(row) {
      console.log(row)
      this.selectList = row.map(item => item.material_id)
    },
    deleteSelect(index) {
      if (index || index === 0) {
        let realIndex = index + (this.currentPage - 1) * this.pagesize
        this.tableData.splice(realIndex, 1)
      } else {
        if (this.selectList && this.selectList.length) {
          let data = this.tableData.filter(item => this.selectList.indexOf(item.material_id) < 0)
          this.tableData = [...data]
        } else {
          this.$message({
            showClose: true,
            message: "请勾选要删除选项",
            type: "warning"
          })
        }
      }
    },
    // 选中变化
    materialChange(id, index) {
      let item = this.MaterialListMap[id]
      let realIndex = index + (this.currentPage - 1) * this.pagesize
      if (!item.count) {
        this.$message({ type: "warning", message: "该物资当前库存为0，无法添加！" })
        this.tableData[realIndex].material_id = ''
        return
      }
      let repeatArr = this.tableData.filter(child => child.material_id == item.material_id)
      if (repeatArr && repeatArr.length > 1) {
        this.$message({
          showClose: true,
          message: "请勿重复添加相同物料！",
          type: "warning"
        })
        this.tableData[realIndex].material_id = ''
        return
      }
      this.tableData[realIndex].material_name = item.material_name
      this.tableData[realIndex].specification = item.specification
      this.tableData[realIndex].measure_unit_name = item.measure_unit_name
      this.tableData[realIndex].brand = item.brand
      this.tableData[realIndex].scount = 0
      this.tableData[realIndex].total_price = 0
      this.tableData[realIndex].price = item.price
      this.tableData[realIndex].count = item.count
      this.tableData[realIndex].total_count = item.total_count
      this.tableData[realIndex].batch_no = item.batch_no
      this.tableData[realIndex].id = item.id
      this.tableData[realIndex].code = item.material_code
      this.tableData[realIndex].remark = ''
    },
    setFee(index) {
      let realIndex = index + (this.currentPage - 1) * this.pagesize
      this.tableData[realIndex].total_price = this.tableData[realIndex].price * this.tableData[realIndex].scount
    },
    // 检查是否超出库存
    check(e, maxCount) {
      if (e.target.value > maxCount) {
        return this.$message({
          showClose: true,
          message: "该物料当前仓库库存为[" + maxCount + "], 领取数量不能大于当前库存！",
          type: "warning"
        })
      }
    },
    setData(data, isAdd) {
      this.tableData = []
      this.exitsData = []
      this.pagesize = 10
      this.currentPage = 1
      if (isAdd) {
        // Object.assign(this.materialForm, this.$options.data().materialForm)
        this.materialForm.id = ''
        this.getWarehouse(false, false)
      } else {
        this.materialForm.code = data[0].code
        this.materialForm.house_id = data[0].warenhouse_id
        this.materialForm.pick_id = data[0].pick_user
        this.materialForm.remark = data[0].remark
        this.materialForm.lp_num = data[0].lp_num
        this.materialForm.relate_num = data[0].work_code
        this.materialForm.pick_date = data[0].pick_date
        this.materialForm.out_code = data[0].out_code
        this.exitsData = data.map(item => {
          return {
            material_id: item.material_id,
            remark: item.remark,
            count: item.count,
            pick_type_id: item.pick_type_id,
          }
        })
        if (this.isMaterialListMap) {
          if (this.exitsData && this.exitsData.length) {
            console.log(this.exitsData);
            this.tableData = this.exitsData.map(children => {
              let obj = this.MaterialListMap[children.material_id]
              return {
                material_id: obj.material_id,
                material_name: obj.material_name,
                specification: obj.specification,
                measure_unit_name: obj.measure_unit_name,
                brand: obj.brand,
                scount: children.count,
                total_price: children.count * obj.price,
                price: obj.price,
                count: obj.count,
                total_count: obj.total_count,
                batch_no: obj.batch_no,
                id: obj.id,
                code: obj.material_code,
                pick_type_id: children.pick_type_id,
                remark: children.remark
              }
            })
          }
        } else {
          this.getWarehouse(this.materialForm.house_id, this.materialForm.pick_id)
        }
      }
    },
    submit() {
      this.materialForm.details = this.tableData
      if (!this.materialForm.details.length) {
        return this.$message({
          showClose: true,
          message: "请添加要领取的物品明细",
          type: "warning"
        })
      }
      this.$refs.materialForm.validate((valid) => {
        if (valid) {
          let check = this.materialForm.details.some(element => !element.material_id || !element.scount || !element.pick_type_id)
          if (check) {
            return this.$message({
              showClose: true,
              message: "请选择物料或领料类型或填写数量",
              type: "warning"
            })
          } else {
            let param = {
              context: {
                order_id: this.materialForm.order_id,
                pick_date: this.materialForm.leave_date,
                warenhouse_id: this.materialForm.house_id,
                pick_user: this.materialForm.pick_id,
                remark: this.materialForm.remark,
                code: this.materialForm.code,
                out_code: this.materialForm.out_code,
                work_code: this.materialForm.relate_num,
                id: this.materialForm.id,
                details: this.materialForm.details.map(item => {
                  return {
                    material_id: item.material_id,
                    pick_type_id: item.pick_type_id,
                    count: item.scount
                  }
                })
              } 
            }
            this.$client.addMaintRepairPick(param).then(res => {
              if (res.head.result == "200") {
                this.$message({
                  showClose: true,
                  message: res.head.describle,
                  type: "success"
                })
                this.dialogClose()
                this.$emit('refresh')
              } else {
                this.$message({
                  showClose: true,
                  message: res.head.describle,
                  type: "error",
                })
              }
            })
          }
        } else {
          return this.$message({
            showClose: true,
            message: "带星号的为必填项",
            type: "warning"
          })
        }
      })
    } 
  },
  computed: {
    sumTotal () {
      return {
        6: this.tableData.map(item => item.scount).reduce((a, b) => a + b, 0),
        // 8: this.tableData.map(item => item.total_price).reduce((a, b) => a + b, 0)
      }
    }
  },
  watch: {
    dialogBool(bool) {
      this.$nextTick(() => {
        if (bool === false) {
          // Object.assign(this.$data, this.$options.data())
          // this.$refs.baseTree.onClear()
        } else {
          if(this.curSelectType == 'add') {
            this.materialForm.leave_date = formatDateTime(new Date())
          }
          this.$refs.materialForm.clearValidate()
        }
      })
    },
  },
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.add-material-dialog-content {
  height: 550px;
  .table {
    margin-bottom: 15px;
  }
}
</style>