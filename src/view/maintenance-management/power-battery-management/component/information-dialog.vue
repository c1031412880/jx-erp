<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    top="30px"
  >
    <div class="el-dialog-div">
      <el-form
        :model="form"
        :rules="basicRules"
        ref="form"
        label-width="150px"
        size="mini"
        :disabled="curSelecedType == 'detail'"
      >
        <el-form-item label="动力电池品牌/类型:" prop="battery_type_id">
          <tr-select-dictionaries
            v-model="form.battery_type_id"
            :classKey="'动力电池品牌'"
            :placeholder="'请选择动力电池品牌'"
          ></tr-select-dictionaries>
        </el-form-item>
        <el-form-item label="电池型号:" prop="battery_model">
          <el-input v-model="form.battery_model" placeholder="请输入电池型号"></el-input>
        </el-form-item>
        <el-form-item label="登记日期:" prop="regist_date">
          <el-date-picker
            v-model="form.regist_date"
            type="date"
            format="yyyy/MM/dd"
            value-format="yyyy-MM-dd"
            placeholder="年/月/日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="电池容量(千瓦时):" prop="battery_capacity">
          <el-input
            v-model.number="form.battery_capacity"
            type="number"
            placeholder="请输入电池容量"
          ></el-input>
        </el-form-item>
        <el-form-item label="动力类别:" prop="power_type_id">
          <tr-select-dictionaries
            v-model="form.power_type_id"
            :classKey="'动力类别'"
            :isMultiple="false"
            :placeholder="'请选择动力类别'"
          ></tr-select-dictionaries>
        </el-form-item>
        <el-form-item label="关联车型：" prop="vehicle_model_type_id">
          <get-veh-model-select
            :multiple="false"
            v-model="form.vehicle_model_type_id"
            @change="vehModelChange"
          />
        </el-form-item>
        <el-form-item label="批次:" prop="batch_no">
          <el-input v-model="form.batch_no" placeholder="请输入批次" disabled></el-input>
        </el-form-item>
        <el-form-item label="数量:" prop="count">
          <el-input v-model="form.count" placeholder="请输入数量" disabled></el-input>
        </el-form-item>
        <el-form-item label="关联车辆：" prop="vehicle_ids">
          <el-select
            v-loading="vehLoading"
            v-model="form.vehicle_ids"
            clearable
            multiple
            collapse-tags
            placeholder="请选择关联车辆"
          >
            <el-option
              v-for="item in vehData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="理论续航里程(KM):" prop="theoretical_range">
          <el-input
            v-model.number="form.theoretical_range"
            type="number"
            placeholder="请输入理论续航里程"
          ></el-input>
        </el-form-item>
        <el-form-item label="电池额定电压(V):" prop="nominal_voltage">
          <el-input
            v-model.number="form.nominal_voltage"
            type="number"
            placeholder="请输入电池额定电压"
          ></el-input>
        </el-form-item>
        <el-form-item label="电池额定容量(Ah):" prop="rated_capacity">
          <el-input
            v-model.number="form.rated_capacity"
            type="number"
            placeholder="请输入电池额定容量"
          ></el-input>
        </el-form-item>
        <el-form-item label="质保期(年):" prop="warranty_period">
          <el-input
            v-model.number="form.warranty_period"
            type="number"
            placeholder="请输入质保期"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            maxlength="200"
            :rows="4"
            show-word-limit
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import getVehicleSelectTree from '@/components/base/formModel/tree/get-vehicle-select-tree'
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
import getLineSelectTree from '@/components/base/formModel/tree/get-line-select-tree'
import getVehModelSelect from '@/components/base/formModel/select/get-veh-model-select'
export default {
  components: {
    getVehicleSelectTree,
    getLineSelectTree,
    getDriverSelectTree,
    getVehModelSelect
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: '编辑'
    },
    curSelecedType: [String]
  },
  mounted() {},
  data() {
    return {
      vehTypeData: [],
      vehData: [],
      vehLoading: false,
      form: {
        id: 0,
        battery_type_id: '',
        battery_model: '',
        regist_date: '',
        battery_capacity: undefined,
        power_type_id: '',
        vehicle_model_type_id: '',
        batch_no: '',
        count: '',
        vehicle_ids: [],
        theoretical_range: undefined,
        nominal_voltage: undefined,
        rated_capacity: undefined,
        warranty_period: undefined,
        remark: ''
      },
      basicRules: {
        battery_type_id: [
          { required: true, message: '请选择动力电池品牌/类型', trigger: 'change' }
        ],
        battery_model: [{ required: true, message: '请输入电池型号', trigger: 'change' }],
        regist_date: [{ required: true, message: '请输入登记日期', trigger: 'change' }],
        battery_capacity: [
          { required: true, message: '请输入电池容量（千瓦时）', trigger: 'change' }
        ],
        power_type_id: [{ required: true, message: '请输入动力类别', trigger: 'change' }],
        vehicle_model_type_id: [{ required: true, message: '请选择关联车型', trigger: 'change' }],
        vehicle_ids: [{ required: true, message: '请关联车辆', trigger: 'change' }]
      }
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data())
        // this.resetData()
      } else {
        if (this.curSelecedType == 'add') {
          this.setDate()
        }
        this.$nextTick(() => {
          this.$refs['form'].resetFields()
        })
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit('update:dialogBool', false)
    },
    vehModelChange(model_id) {
      this.vehData = []
      this.form.count = ''
      this.form.vehicle_ids = []
      if (!model_id) return
      this.vehLoading = true
      this.$dataCenterHttp
        .getVehicleArchivesInfo({
          vehicle_model_id: model_id,
          tenant_id: window.newHttpConfig.TenantId
        })
        .then(res => {
          if (res.errcode == '200') {
            this.vehData = res.data.items
            this.form.count = res.data.total
          }
        })
        .finally(() => {
          this.vehLoading = false
        })
      this.$dataCenterHttp
        .getVehicleModelInfo({
          ids: [model_id],
          tenant_id: window.newHttpConfig.TenantId
        })
        .then(res => {
          if (res.errcode == '200' && res.data.items && res.data.items.length) {
            this.form.batch_no = res.data.items[0].batch
          }
        })
    },
    // 设置默认日期为当天
    setDate() {
      let date = new Date()
      let Y = date.getFullYear()
      let M = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1)
      let D = (date.getDate() < 10 ? '0' : '') + date.getDate()
      this.form.regist_date = Y + '-' + M + '-' + D
    },
    resetData() {
      this.$refs.vehicleTree.onClear()
      this.$refs.lineTree.onClear()
      this.$refs.driverTree.onClear()
    },
    // 保存继续添加  置空
    clear() {
      this.form.id = 0
      this.form.vehicle_id = ''
      this.form.line_id = ''
      this.form.val = ''
      this.form.amount = ''
      this.form.remark = ''
      this.form.driver_id = ''
      this.form.addgas_person = ''
    },
    // 车辆选择
    onSelectChange(vehs, nodes) {
      //根据车牌号或自编号绑定线路
      if (this.form.vehicle_id) {
        this.form.line_id = nodes[0].parent_id
      } else {
        this.$refs.lineTree.onClear()
      }
    },
    changeValvue(val) {
      if (!!val) {
        this.form.val = Number(val).toFixed(2)
      }
    },
    changeAmount(val) {
      if (!!val) {
        this.form.amount = Number(val).toFixed(2)
      }
    },
    updatePlaybill() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let info = {}
          for (let key in this.form) {
            if (this.form[key] || this.form[key] === 0) {
              info[key] = this.form[key]
            }
          }
          this.$emit('save-add-edit', info)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
  height: 500px;
  padding-right: 10px;
  overflow: auto;

  .el-inpit,
  .el-select,
  .el-date-editor{
    width: 100%;
  }
}
</style>
