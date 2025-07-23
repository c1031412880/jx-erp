<template>
  <div
    class="base-info"
    :style="`height:${curChangeType == 'detail' ? '470' : '470'}px; overflow-x: hidden`"
  >
    <el-form size="mini" :model="formData" :rules="rules" ref="formData" label-width="130px">
      <div class="show-flex-box-r">
        <el-form-item label="车辆自编号:" prop="i_vehicle_id">
          <get-carcode-select-tree
            ref="carcodeTree"
            :placeholder="'选择车辆自编号'"
            :isShowCheckbox="false"
            v-model="formData.i_vehicle_id"
            @on-change="onSelectChange"
            :isExportMultiple="false"
            :width="'220'"
            :disabled="curChangeType == 'detail'"
          ></get-carcode-select-tree>
        </el-form-item>
        <el-form-item label="车牌号:" prop="i_vehicle_id">
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="false"
            v-model="formData.i_vehicle_id"
            @on-change="onSelectChange"
            :isExportMultiple="false"
            :width="'220'"
            :disabled="curChangeType == 'detail'"
          ></get-vehicle-select-tree>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="线路:" prop="i_line_id">
          <get-line-select-tree
            ref="lineTree"
            :placeholder="'选择线路'"
            :isShowCheckbox="false"
            v-model="formData.i_line_id"
            @on-change="onLineSelectChange"
            :isExportMultiple="false"
            :width="'220'"
            :disabled="curChangeType == 'detail'"
          ></get-line-select-tree>
        </el-form-item>
        <el-form-item label="所属组织:" prop="i_dept_id">
          <!-- <el-input
            placeholder="请选择所属组织"
            v-model="department_name"
            disabled
          ></el-input> -->
          <get-department-select
            ref="deptTree"
            v-model="formData.i_dept_id"
            :isShowCheckbox="false"
            :placeholder="'请选择所属组织'"
            :isContainEmp="false"
            :show_all="true"
            :isExportMultiple="false"
            :disabled="curChangeType == 'detail'"
          ></get-department-select>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="事故驾驶员:" prop="i_driver_id">
          <get-driver-select-tree
            ref="driverTree"
            v-model="formData.i_driver_id"
            :width="'220'"
            :isShowCheckbox="false"
            :placeholder="'请选择所事故驾驶员'"
            :isExportMultiple="false"
            @on-change="onSelectDriverChange"
            :disabled="curChangeType == 'detail'"
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item label="事故性质:" prop="i_accident_nature">
          <get-select-dictionaries
            v-model="formData.i_accident_nature"
            :classKey="'事故性质'"
            :placeholder="'事故性质类型'"
            :disabled="curChangeType == 'detail'"
          ></get-select-dictionaries>
        </el-form-item>
      </div>

      <div class="show-flex-box-r">
        <el-form-item label="事故发生时间:" prop="d_accident_date">
          <el-date-picker
            v-model="formData.d_accident_date"
            type="datetime"
            placeholder="选择日期"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            :disabled="curChangeType == 'detail'"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="事故责任:" prop="i_accident_duty">
          <get-select-dictionaries
            v-model="formData.i_accident_duty"
            :classKey="'事故责任'"
            :placeholder="'请选择事故责任类型'"
            :disabled="curChangeType == 'detail'"
          ></get-select-dictionaries>
        </el-form-item>
      </div>
      <div class="show-flex-box-r" v-if="dialogBool">
        <el-form-item label="事故分类:" prop="i_accident_type">
          <get-select-dictionaries
            v-model="formData.i_accident_type"
            :classKey="'事故分类'"
            :placeholder="'请选择事故分类'"
            :isShowDefaultValue="curChangeType == 'add'"
            :disabled="curChangeType == 'detail'"
          ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="事故等级:" prop="i_accident_category">
          <get-select-dictionaries
            v-model="formData.i_accident_category"
            :classKey="'事故等级'"
            :placeholder="'请选择事故等级'"
            :isShowDefaultValue="curChangeType == 'add'"
            :disabled="curChangeType == 'detail'"
          ></get-select-dictionaries>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="事故原因:" prop="accident_reasons">
          <get-select-dictionaries
            v-model="formData.accident_reasons"
            :classKey="'事故原因'"
            :placeholder="'请选择事故原因'"
            :isMultiple="true"
            :disabled="curChangeType == 'detail'"
          ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="事故地点类别:" prop="i_accident_address_type" v-if="dialogBool">
          <get-select-dictionaries
            v-model="formData.i_accident_address_type"
            :classKey="'事故地点类别'"
            :placeholder="'请选择事故地点类别'"
            :isShowDefaultValue="curChangeType == 'add'"
            :disabled="curChangeType == 'detail'"
          ></get-select-dictionaries>
        </el-form-item>
        <!-- <el-form-item v-if="curChangeType !='add'" label="有无人伤:" prop="is_person_wound">
          <el-radio-group v-model="formData.is_person_wound">
              <el-radio disabled :label="1">有</el-radio>
              <el-radio disabled :label="2">无</el-radio>
            </el-radio-group>
        </el-form-item> -->
        <!-- <el-form-item label="预估费用:" prop="n_fee">
         <el-input
            placeholder="请输入预估费用"
            v-model="formData.n_fee"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.n_fee = $event.target.value"
            :disabled="curChangeType=='detail'"
          ></el-input>
        </el-form-item> -->
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="事故地点:" prop="c_accident_address">
          <el-input
            placeholder="请输入事故地点"
            v-model="formData.c_accident_address"
            :disabled="curChangeType == 'detail'"
          ></el-input>
          <el-button
            v-if="curChangeType != 'detail'"
            type="primary"
            @click="openMap()"
            style="margin-left: 15px"
          >
            地图自动获取
          </el-button>
        </el-form-item>
      </div>
      <div class="show-flex-box-r" v-if="dialogBool">
        <el-form-item label="事故类型:" prop="i_accident_lx">
          <get-select-dictionaries
            v-model="formData.i_accident_lx"
            :classKey="'事故类型'"
            :placeholder="'请选择事故类型'"
            :isShowDefaultValue="curChangeType == 'add'"
            :disabled="curChangeType == 'detail'"
          ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="事故天气:" prop="i_accident_weather">
          <get-select-dictionaries
            v-model="formData.i_accident_weather"
            :classKey="'事故天气'"
            :placeholder="'请选择事故天气'"
            :isShowDefaultValue="curChangeType == 'add'"
            :disabled="curChangeType == 'detail'"
          ></get-select-dictionaries>
        </el-form-item>
      </div>
      <!-- <div class="show-flex-box-r">
        <el-form-item label="是否私了:" prop="is_person_wound">
          <el-radio-group v-model="formData.is_compounding" style="width: 250px;">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="金钱流向:" prop="money_reten" v-if="formData.is_compounding">
          <el-input v-model="formData.money_reten"></el-input>
        </el-form-item>
      </div> -->
      <div class="show-flex-box-r">
        <el-form-item label="事故类别:" prop="i_accident_type_category">
          <get-select-dictionaries
            v-model="formData.i_accident_type_category"
            :classKey="'事故类别'"
            :placeholder="'请选择事故类别'"
            :isShowDefaultValue="curChangeType == 'add'"
            :disabled="curChangeType == 'detail'"
          ></get-select-dictionaries>
        </el-form-item>
        <!-- <el-form-item label="客伤评定无责事故:" prop="is_responsibility">
          <el-radio-group v-model="formData.is_responsibility" style="width: 250px;">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
        </el-form-item> -->
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="事故描述:" prop="c_describe">
          <el-input
            type="textarea"
            :disabled="curChangeType == 'detail'"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入详细事故描述"
            v-model="formData.c_describe"
          ></el-input>
        </el-form-item>
      </div>
      <!-- <div v-if="curChangeType != 'add' && $isPowerShow('handle_acc')">
        <div class="show-flex-box-r">
          <i style="float:left;width: 6px;height: 18px; background: #409EFF;"></i> 
          <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">事故处理</p>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="事故经办人:" prop="i_result_person">
            <get-department-select
              ref="personalTree"
              v-model="formData.i_result_person"
              :width="'220'"
              :isShowCheckbox="false"
              :placeholder="'请选择事故经办人'"
              :isContainEmp="true"
              :isExportMultiple="false"
              :disabled="curChangeType=='detail'"
            ></get-department-select>

          </el-form-item>
          <el-form-item label="处理日期:" prop="d_result_date">
            <el-date-picker
              v-model="formData.d_result_date"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :disabled="curChangeType=='detail'">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="safety-distance-box show-flex-box-r">
          <el-form-item label="罚款:" prop="n_result_cost">
            <el-input
              placeholder="请输入罚款"
              v-model="formData.n_result_cost"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.n_result_cost = $event.target.value"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
         <el-form-item label="安全里程:" prop="i_result_mile">
            <el-select v-model="formData.i_result_mile" placeholder="请选择" :disabled="curChangeType=='detail'">
              <el-option
                v-for="item in safetyDistanceOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="扣除里程:" prop="n_result_mile" v-if="formData.i_result_mile != 1">
             <el-input
              placeholder="请输入扣除里程"
              v-model="formData.n_result_mile"
              style="width: 170px;"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.n_result_mile = $event.target.value"
              :disabled="curChangeType=='detail'"
            ></el-input>
            <span>公里</span>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
         <el-form-item label="处理意见:" prop="c_result_remark">
          <el-input
            type="textarea"
            v-model="formData.c_result_remark"
            :disabled="curChangeType=='detail'"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入处理意见"
          ></el-input>
        </el-form-item>
      </div>
      </div> -->
    </el-form>
    <select-place-dialog
      ref="selectPlaceDialog"
      :dialogBool.sync="isShowSelectPlaceDialog"
      @save-place="savePlace"
    ></select-place-dialog>
  </div>
</template>
<script>
import { getSession, getUser } from '@/utils/auth'
import getCarcodeSelectTree from '@/components/base/formModel/tree/get-carcode-select-tree'
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
import getVehicleSelectTree from '@/components/base/formModel/tree/get-vehicle-select-tree'
import getLineSelectTree from '@/components/base/formModel/tree/get-line-select-tree'
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
import selectPlaceDialog from '../dialog/select-place-dialog'

import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries'
export default {
  components: {
    getCarcodeSelectTree,
    getDepartmentSelect,
    getVehicleSelectTree,
    getLineSelectTree,
    getDriverSelectTree,
    getSelectDictionaries,
    selectPlaceDialog
  },
  props: {
    dialogBool: Boolean,
    curChangeType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      isContainEmp: false, //是否显示部门下的人员
      safetyDistanceOptions: [
        //状态
        { value: 1, name: '不扣除' },
        { value: 2, name: '扣除指定安全里程' },
        { value: 3, name: '扣除当月安全里程' },
        { value: 4, name: '扣除当季度安全里程' },
        { value: 5, name: '扣除全部安全里程' },
        { value: 6, name: '扣除当前安全里程' }
      ],
      department_name: '', //部门名称
      formData: {
        i_vehicle_id: '',
        i_line_id: '',
        i_dept_id: '',
        i_driver_id: '',
        i_accident_nature: '',
        d_accident_date: '',
        i_accident_duty: '',
        i_accident_type: '',
        i_accident_lx: '',
        i_accident_category: '',
        i_accident_type_category: '',
        accident_reasons: '',
        // n_fee: "",
        i_accident_weather: '',
        i_accident_address_type: '',
        c_accident_address: '',
        n_latitude: '',
        n_longitud: '',
        c_describe: '',

        // is_person_wound: 2,
        n_latitude: '',
        n_longitud: '',

        // money_reten: '',
        is_compounding: false,
        is_responsibility: false
        // i_result_person: "",
        // d_result_date: "",
        // n_result_cost: "",
        // i_result_mile: 1,
        // n_result_mile: "",
        // c_result_remark: "",
      },
      rules: {
        i_vehicle_id: [
          {
            required: true,
            message: '请选择车辆',
            trigger: 'change'
          }
        ],
        // i_line_id: [
        //   {
        //     required: true,
        //     message: "请选择线路",
        //     trigger: "change",
        //   },
        // ],
        i_driver_id: [
          {
            required: true,
            message: '请选择驾驶员',
            trigger: 'change'
          }
        ],

        i_accident_nature: [
          {
            required: true,
            message: '请选择事故性质',
            trigger: 'change'
          }
        ],
        d_accident_date: [
          {
            required: true,
            message: '请选择事故发生时间',
            trigger: 'change'
          }
        ],
        i_accident_duty: [
          {
            required: true,
            message: '请选择事故责任',
            trigger: 'change'
          }
        ],
        i_accident_type: [
          {
            required: true,
            message: '请选择事故类型',
            trigger: 'change'
          }
        ],
        i_accident_category: [
          {
            required: true,
            message: '请选择事故等级',
            trigger: 'change'
          }
        ],
        accident_reasons: [
          {
            required: true,
            message: '请选择事故原因',
            trigger: 'change'
          }
        ],
        // n_fee: [
        //   {
        //     required: true,
        //     message: "请输入预估费用",
        //     trigger: "change",
        //   },
        // ],
        // i_accident_weather: [
        //   {
        //     required: true,
        //     message: "请选择事故天气",
        //     trigger: "change",
        //   },
        // ],
        i_accident_address_type: [
          {
            required: true,
            message: '请选择事故地点类别',
            trigger: 'change'
          }
        ],
        c_accident_address: [
          {
            required: true,
            message: '请输入事故地点',
            trigger: 'change'
          }
        ]
      },
      isFirstLoad: false,
      isShowSelectPlaceDialog: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // let userInfo = JSON.parse(getUser());
    // console.log(userInfo)
    // this.formData.i_result_person = Number(userInfo.user_id)
    // console.log(this.formData.i_result_person)
  },
  methods: {
    // 初始化数据
    resetData() {
      // 清空部门选中
      this.$refs.carcodeTree.onClear()
      this.$refs.vehicleTree.onClear()
      this.$refs.lineTree.onClear()
      this.$refs.driverTree.onClear()
      this.$refs.deptTree.onClear()
      // this.department_name = '';
      this.isFirstLoad = false
      this.$refs['formData'].resetFields()
      console.log(this.formData)

      this.formData.accident_reasons = ''
    },
    // 车辆选择
    onSelectChange(vehs, nodes) {
      console.log(vehs, nodes)
      // 编辑和详情需要加一层锁
      if (this.curChangeType != 'add') {
        if (!this.isFirstLoad && !!this.formData.i_vehicle_id) {
          this.isFirstLoad = true
          return
        }
        if (this.isFirstLoad && vehs && vehs.length > 0) {
          this.reqVehicleRelationInfo(vehs[0])
        }
      } else {
        if (vehs && vehs.length > 0) {
          this.reqVehicleRelationInfo(vehs[0])
        }
      }
    },
    // 所选线路
    onLineSelectChange(lines, nodes) {},
    // 选择驾驶员
    onSelectDriverChange(Drivers, nodes) {},
    // 获取车辆相关信息
    reqVehicleRelationInfo(car_id) {
      let params = {
        id: car_id
      }
      this.$client
        .getVehicleRelationInfo(params)
        .then(res => {
          if (res.head.result == '200') {
            let relationInfo = res.context
            if (!!relationInfo.line && relationInfo.line.length > 0) {
              this.formData.i_dept_id = relationInfo.line[0].dept_id
              // this.$refs.lineTree.lineCheck(relationInfo.line)
              this.formData.i_line_id = relationInfo.line[0].i_id
            } else {
              this.formData.i_line_id = ''
              setTimeout(() => {
                this.$refs.lineTree.onClear()
              }, 60)
            }
          } else {
            this.$message({
              type: 'error',
              message: res.head.describle,
              showClose: true
            })
          }
        })
        .catch(err => {})
    },
    // 数据回显
    setData(val) {
      console.log(val, 'sj')
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(val, key)) {
          // const element = this.formData[key];
          if (key == 'i_line_id') {
            continue
          }
          this.formData[key] = val[key]
        }
      }
      // this.department_name = val.department_name;
      this.formData.i_accident_nature = Number(val.i_accident_nature)
      // let lineList = []
      // let lineObj = {
      //   c_name: val.line,
      //   i_id: val.i_line_id,
      //   type: 2
      // }
      // lineList.push(lineObj)
      setTimeout(() => {
        // this.$refs.lineTree.lineCheck(lineList);
        this.formData.i_line_id = val.i_line_id
      }, 500)
    },
    // 打开地图
    openMap() {
      this.isShowSelectPlaceDialog = true
      if (this.curChangeType == 'edit') {
        let params = {
          id: '',
          address: this.formData.c_accident_address,
          lon: this.formData.n_longitud,
          lat: this.formData.n_latitude
        }
        this.$nextTick(() => {
          this.$refs.selectPlaceDialog.addPlace(params)
        })
      }
    },
    // 保存地点和经纬度
    savePlace(form) {
      this.formData.c_accident_address = form.address.split('-')[0]
      this.formData.n_latitude = form.lat
      this.formData.n_longitud = form.lon
      this.isShowSelectPlaceDialog = false
    },
    // 给父级页面提供得获取本页数据
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs['formData'].validate(valid => {
          if (!valid) {
            reject({
              result: 400,
              msg: '获取失败,带星号的为必填项'
            })
            return
          }
          resolve({
            formData: this.formData,
            result: 200,
            msg: '获取成功'
          })
        })
      })
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.base-info /deep/ .el-date-editor {
  width: 250px;
}
.base-info /deep/.el-select,.el-select--mini {
  width: 250px;
}
.base-info /deep/ .el-input,.el-input--mini{
  width: 250px;
}

.base-info /deep/ .el-textarea {
  width: 620px;
}
</style>
