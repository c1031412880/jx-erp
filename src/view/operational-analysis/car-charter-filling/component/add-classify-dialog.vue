<template>
  <tr-dialog
    :visible="dialogBool"
    title="包车管理"
    @before-close="dialogClose"
    width="80%"
    top="20px "
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="rules" ref="form" class="demo-form" size="mini">
        <el-row :gutter="20">
          <item-box-new title="基本信息" @on-title="onTitle">
            <el-col :span="6">
              <el-form-item label="用车单位:" prop="use_uint">
                <el-input
                  v-model="form.use_uint"
                  :disabled="curType == 'detail'"
                  clearable
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用车时间:" prop="date">
                <el-date-picker
                  v-model="form.date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                  :disabled="curType == 'detail' || [3, 4].includes(dialogType)"
                  :picker-options="pickerOptions"
                  @change="changeTime"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用车人数:" prop="use_people">
                <el-input
                  v-model="form.use_people"
                  :disabled="curType == 'detail'"
                  clearable
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.use_people = $event.target.value"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="车型:" prop="car_type">
                <el-select
                  v-model="form.car_type"
                  placeholder="请选择"
                  :disabled="curType == 'detail'"
                  style="width: 100%"
                >
                  <el-option label="大客" :value="1"></el-option>
                  <el-option label="中客" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="投放台数:" prop="deployment_units">
                <el-input
                  v-model="form.deployment_units"
                  :disabled="curType == 'detail'"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.deployment_units = $event.target.value"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系人:" prop="contact_person">
                <el-input
                  v-model="form.contact_person"
                  :disabled="curType == 'detail'"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话:" prop="contact_phone">
                <el-input
                  v-model="form.contact_phone"
                  :disabled="curType == 'detail'"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="包车类型:" prop="chariot_type">
                <el-select
                  v-model="form.chariot_type"
                  placeholder="请选择"
                  style="width: 100%"
                  :disabled="curType == 'detail'"
                >
                  <el-option label="普通包车" :value="1"></el-option>
                  <el-option label="大型用车" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="划分组织:" prop="department_ids">
                <!-- <el-select
                  v-model="scope.data.department_ids"
                  :disabled="curType == 'detail' || [3,4].includes(dialogType)"
                  placeholder="请选择" multiple>
                  <el-option
                    v-for="item in branchOffice"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select> -->
                <get-department-select
                  v-if="dialogBool"
                  ref="deptTree"
                  v-model="form.department_ids"
                  :placeholder="'请选择所属组织'"
                  :funcType="1"
                  :isContainEmp="false"
                  @on-change="changeDept"
                  :disabled="curType == 'detail' || [3, 4].includes(dialogType)"
                ></get-department-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="费用结算:" prop="cost_settlement">
                <el-input
                  v-if="this.haveRule || this.curType == 'add'"
                  v-model="form.cost_settlement"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.cost_settlement = $event.target.value"
                  :disabled="curType == 'detail'"
                  placeholder="请输入"
                ></el-input>
                <el-input v-else v-model="cost_sett" disabled placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结算方式:" prop="settlement_mode">
                <el-select
                  v-model="form.settlement_mode"
                  placeholder="请选择"
                  style="width: 100%"
                  :disabled="curType == 'detail'"
                >
                  <el-option label="转账" :value="1"></el-option>
                  <el-option label="现金" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="签发时间:" prop="issuance_time">
                <el-date-picker
                  v-model="form.issuance_time"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="年-月-日"
                  style="width:100%"
                  :disabled="curType == 'detail'"
                >
                </el-date-picker>
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item label="起点:" prop="starting_point">
                <el-input
                  v-model="form.starting_point"
                  clearable
                  placeholder="请选择"
                  :disabled="curType == 'detail' || [3, 4].includes(dialogType)"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="起点用车时间:" prop="starting_point_use_time">
                <el-time-picker
                  v-model="form.starting_point_use_time"
                  format="HH:mm"
                  value-format="HH:mm"
                  style="width: 100%"
                  placeholder="起点用车时间"
                  :disabled="curType == 'detail' || [3, 4].includes(dialogType)"
                ></el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="终点:" prop="ending_point">
                <el-input
                  v-model="form.ending_point"
                  clearable
                  placeholder="请选择"
                  :disabled="curType == 'detail' || [3, 4].includes(dialogType)"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="终点用车时间:" prop="end_point_use_time">
                <el-time-picker
                  v-model="form.end_point_use_time"
                  format="HH:mm"
                  value-format="HH:mm"
                  style="width: 100%"
                  placeholder="终点用车时间"
                  :disabled="curType == 'detail' || [3, 4].includes(dialogType)"
                ></el-time-picker>
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              v-if="
                (comList.includes('公交一分公司') && this.curType == 'add') ||
                (haveRule && form.one_fee) ||
                (this.curType != 'add' &&
                  userInfo.dept_name == '公交一分公司' &&
                  comList.includes('公交一分公司'))
              "
            >
              <el-form-item label="公交一分公司费用:" prop="one_fee">
                <el-input
                  v-model="form.one_fee"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.one_fee = $event.target.value"
                  :disabled="curType == 'detail'"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              v-if="
                (comList.includes('公交二分公司') && this.curType == 'add') ||
                (haveRule && form.two_fee) ||
                (this.curType != 'add' &&
                  userInfo.dept_name == '公交二分公司' &&
                  comList.includes('公交二分公司'))
              "
            >
              <el-form-item label="公交二分公司费用:" prop="two_fee">
                <el-input
                  v-model="form.two_fee"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.two_fee = $event.target.value"
                  :disabled="curType == 'detail'"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              v-if="
                (comList.includes('公交三分公司') && this.curType == 'add') ||
                (haveRule && form.three_fee) ||
                (this.curType != 'add' &&
                  userInfo.dept_name == '公交三分公司' &&
                  comList.includes('公交三分公司'))
              "
            >
              <el-form-item label="公交三分公司费用:" prop="three_fee">
                <el-input
                  v-model="form.three_fee"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.three_fee = $event.target.value"
                  :disabled="curType == 'detail'"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              v-if="
                (comList.includes('公交四分公司') && this.curType == 'add') ||
                (haveRule && form.four_fee) ||
                (this.curType != 'add' &&
                  userInfo.dept_name == '公交四分公司' &&
                  comList.includes('公交四分公司'))
              "
            >
              <el-form-item label="公交四分公司费用:" prop="four_fee">
                <el-input
                  v-model="form.four_fee"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.four_fee = $event.target.value"
                  :disabled="curType == 'detail'"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              v-if="
                (comList.includes('五分公司') && this.curType == 'add') ||
                (haveRule && form.five_fee) ||
                (this.curType != 'add' &&
                  userInfo.dept_name == '五分公司' &&
                  comList.includes('五分公司'))
              "
            >
              <el-form-item label="五分公司费用:" prop="five_fee">
                <el-input
                  v-model="form.five_fee"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.five_fee = $event.target.value"
                  :disabled="curType == 'detail'"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="工单说明:" prop="work_order_description">
                <el-input
                  v-model="form.work_order_description"
                  type="textarea"
                  clearable
                  placeholder="请输入"
                  :disabled="curType == 'detail'"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="margin-bottom: 20px">
              <!--              <image-file-upload-->
              <!--                :images="form.img_list"-->
              <!--                :isShowFiles="false"-->
              <!--                showTitle="包车合同"-->
              <!--                :isShowBox="curType !== 'detail'"-->
              <!--                @images-update-success="imagesUpdateSuccess"-->
              <!--              ></image-file-upload>-->
              <multiple-files-upload
                :filesList="form.files_list"
                :disabled="curType === 'detail'"
                @upload-update-success="uploadUpdateSuccess"
              ></multiple-files-upload>
            </el-col>
          </item-box-new>
          <el-col :span="24" style="margin-bottom: 20px" v-if="tableTabs.length > 0">
            <el-tabs v-model="tabsValue" type="card">
              <el-tab-pane
                v-for="(item, index) in tableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
              >
                <el-button
                  style="margin-bottom: 10px"
                  type="primary"
                  size="small"
                  @click="printTable(form, item)"
                >
                  打印
                </el-button>
                <tx-table
                  :data="item.data"
                  :tableHeaderList="canRendererTableHeader"
                  :TableHeight="TableHeight"
                  :colFields="colFields"
                  :mergekeys="mergekeys"
                  :mergeAgain="mergeAgain"
                  :topKeys="topKeys"
                >
                  <template slot-scope="scope" slot="start_point">
                    <el-input
                      v-model="scope.data.start_point"
                      placeholder="请输入起点"
                      :disabled="curType == 'detail' || [3, 4].includes(dialogType)"
                    ></el-input>
                  </template>
                  <template slot-scope="scope" slot="usege_time">
                    <el-time-picker
                      v-model="scope.data.usege_time"
                      format="HH:mm"
                      value-format="HH:mm"
                      placeholder="用车时间"
                      :disabled="curType == 'detail' || [3, 4].includes(dialogType)"
                    ></el-time-picker>
                  </template>
                  <template slot-scope="scope" slot="end_point">
                    <el-input
                      v-model="scope.data.end_point"
                      placeholder="请输入终点"
                      :disabled="curType == 'detail' || [3, 4].includes(dialogType)"
                    ></el-input>
                  </template>
                  <template slot-scope="scope" slot="vehicles_num">
                    <el-input
                      v-model="scope.data.vehicles_num"
                      placeholder="请输入"
                      oninput="value=value.replace(/[^\d.-]/g,'')"
                      :disabled="curType == 'detail' || [3, 4].includes(dialogType)"
                      @blur="scope.data.vehicles_num = $event.target.value"
                    ></el-input>
                  </template>
                  <template slot-scope="scope" slot="cost">
                    <el-input
                      v-model="scope.data.cost"
                      placeholder="请输入"
                      oninput="value=value.replace(/[^\d.-]/g,'')"
                      :disabled="curType == 'detail' || [3, 4].includes(dialogType)"
                      @blur="scope.data.cost = $event.target.value"
                    ></el-input>
                  </template>
                  <template slot-scope="scope" slot="vehicle_id">
                    <get-vehicle-select-tree
                      placeholder="选择车辆"
                      :vehicleTree="vehicleTree"
                      v-model="scope.data.vehicle_id"
                      @on-change="
                        veh => {
                          getVehicleInfo(scope.data.vehicle_id, index, scope.index)
                        }
                      "
                      :disabled="curType == 'detail'"
                      :isShowCheckbox="false"
                    ></get-vehicle-select-tree>
                  </template>
                  <template slot-scope="scope" slot="driver_id">
                    <get-driver-select-tree
                      v-model="scope.data.driver_id"
                      :driverTree="driverTree"
                      :placeholder="'请选择姓名'"
                      :disabled="curType == 'detail'"
                      @on-change="
                        drivers => {
                          getDriverInfo(drivers, index, scope.index)
                        }
                      "
                    ></get-driver-select-tree>
                  </template>
                  <template slot-scope="scope" slot="phone">
                    <el-input
                      v-model="scope.data.phone"
                      placeholder="请输入"
                      oninput="value=value.replace(/[^\d.-]/g,'')"
                      :disabled="curType == 'detail'"
                      @blur="scope.data.phone = $event.target.value"
                    ></el-input>
                  </template>
                  <template slot-scope="scope" slot="remark">
                    <el-input
                      type="textarea"
                      v-model="scope.data.remark"
                      :disabled="curType == 'detail'"
                    ></el-input>
                  </template>
                </tx-table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" v-if="curType != 'detail'">
      <el-button type="primary" v-if="dialogType == 1" @click="confirm" size="mini">
        确 认
      </el-button>
      <el-button type="primary" v-if="dialogType == 2" @click="updatePlaybill(1)" size="mini">
        保存草稿
      </el-button>
      <el-button type="primary" v-if="dialogType == 2" @click="updatePlaybill(2)" size="mini">
        下 发
      </el-button>
      <el-button type="primary" v-if="dialogType == 3" @click="updatePlaybill(3)" size="mini">
        完 成
      </el-button>
      <el-button type="primary" v-if="dialogType == 4" @click="updatePlaybill(3)" size="mini">
        保 存
      </el-button>
      <el-button @click="dialogClose" size="mini">取 消</el-button>
    </span>
  </tr-dialog>
</template>

<script>
import getDepartmentSelect from '../tree/get-department-select-tree'
import imageFileUpload from '@/components/imageFileUpload/index'
import multipleFilesUpload from '../../../../components/multiple-files-upload/index.vue'
import txTable from './tx-table'
import { formatDate, deepCopy, uuid, getDays } from '@/utils/index'
import getDriverSelectTree from '../tree/driver-tree'
import getVehicleSelectTree from '../tree/vehicle-tree'
import itemBoxNew from '@/view/main-Interface-entrance/news-details/component/item-box-new'
import ordinaryPrint from './ordinary-print'
import largecarPrint from './largecar-print'
import Vue from 'vue'
import { getUser } from '@/utils/auth'
export default {
  components: {
    imageFileUpload,
    getDepartmentSelect,
    txTable,
    getDriverSelectTree,
    getVehicleSelectTree,
    itemBoxNew,
    multipleFilesUpload
  },
  props: {
    dialogBool: Boolean,
    haveRule: {
      type: Boolean,
      default: false
    },
    curType: [String],
    driverTree: [Array],
    vehicleTree: [Array]
  },
  data() {
    return {
      showTitle: '',
      comList: [], //选择的分公司
      userInfo: {},
      // branchOffice: [],//分公司
      cost_sett: '***',
      form: {
        id: 0,
        date: [],
        use_uint: '',
        use_start_time: '',
        use_end_time: '',
        use_people: '',
        car_type: '',
        deployment_units: '',
        contact_person: '',
        contact_phone: '',
        chariot_type: '',
        department_ids: [],
        cost_settlement: '',
        one_fee: '',
        two_fee: '',
        three_fee: '',
        four_fee: '',
        five_fee: '',
        settlement_mode: '',
        // issuance_time: '',
        starting_point: '',
        ending_point: '',
        starting_point_use_time: '',
        end_point_use_time: '',
        work_order_description: '',
        img_list: [],
        details: [],
        type: '',
        dept_name: '',
        files_list: []
      },
      rules: {
        use_uint: [
          {
            required: true,
            message: '请输入用车单位',
            trigger: 'change'
          }
        ],
        date: [
          {
            required: true,
            message: '请选择用车时间',
            trigger: 'change'
          }
        ],
        deployment_units: [
          {
            required: true,
            message: '请输入投放台数',
            trigger: 'change'
          }
        ],
        contact_person: [
          {
            required: true,
            message: '请输入联系人',
            trigger: 'change'
          }
        ],
        // contact_phone: [
        //   {
        //     required: true,
        //     message: "请输入联系电话",
        //     trigger: "change",
        //   },
        // ],
        chariot_type: [
          {
            required: true,
            message: '请选择包车类型',
            trigger: 'change'
          }
        ],
        department_ids: [
          {
            required: true,
            message: '请选择划分组织',
            trigger: 'change'
          }
        ],
        starting_point: [
          {
            required: true,
            message: '请输入起点',
            trigger: 'change'
          }
        ],
        starting_point_use_time: [
          {
            required: true,
            message: '请选择起点用车时间',
            trigger: 'change'
          }
        ],
        ending_point: [
          {
            required: true,
            message: '请输入终点',
            trigger: 'change'
          }
        ]
      },
      min: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.min = minDate && minDate.getTime()
          // 如果选了时间段  则清空
          if (maxDate) {
            this.min = ''
          }
        },
        disabledDate: time => {
          let days = 2 * 24 * 60 * 60 * 1000
          if (this.min) {
            return time.getTime() > this.min + days || time.getTime() < this.min - days
          }
        }
      },
      deptNodes: [],
      TableHeight: 300,
      canRendererTableHeader: [
        {
          id: 1,
          label: '*起点',
          prop: 'start_point',
          width: '120',
          align: 'center',
          signIndex: 0
        },
        {
          id: 2,
          label: '*用车时间',
          prop: 'usege_time',
          width: '120',
          align: 'center',
          signIndex: 1
        },
        {
          id: 3,
          label: '*终点',
          prop: 'end_point',
          width: '120',
          align: 'center',
          signIndex: 2
        },
        {
          id: 4,
          label: '分公司',
          prop: 'dept_name',
          width: '80',
          align: 'center',
          signIndex: 3
        },
        {
          id: 5,
          label: '*用车数',
          prop: 'vehicles_num',
          width: '80',
          align: 'center',
          signIndex: 4
        }
        // {
        //   id: 6,
        //   label: "费用",
        //   prop: "cost",
        //   width: "80",
        //   align: "center",
        //   signIndex: 5,
        // },
      ],
      canRendererTableHeader2: [
        {
          id: 6,
          label: '*车号',
          prop: 'vehicle_id',
          width: '120',
          align: 'center',
          signIndex: 5
        },
        {
          id: 7,
          label: '*驾驶员',
          prop: 'driver_id',
          width: '120',
          align: 'center',
          signIndex: 6
        },
        {
          id: 8,
          label: '驾驶员电话',
          prop: 'phone',
          width: '120',
          align: 'center',
          signIndex: 7
        },
        {
          id: 9,
          label: '备注',
          prop: 'remark',
          width: '150',
          align: 'center',
          signIndex: 8
        }
      ],
      tableTabs: [],
      tabsValue: '1',
      colFields: [
        'start_point',
        'usege_time',
        'end_point',
        'dept_name',
        'vehicles_num',
        'cost',
        'car_code',
        'driver_id',
        'driver_phone',
        'remark'
      ],
      mergekeys: ['start_point', 'usege_time', 'end_point', 'dept_name'],

      topKeys: ['start_point', 'usege_time', 'end_point'],
      isEcho: false,
      mergeAgain: false,
      dialogType: '',
      filterateData: [] // 过滤权限后的数据
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data())
        this.$refs.deptTree.onClear()
        this.$refs.form.resetFields()
        // console.log(this.$data);
      } else {
        // this.GetDeptInfoCaches()
        console.log(JSON.parse(getUser()))
        this.userInfo = JSON.parse(getUser())
        if (this.curType == 'add') {
          this.dialogType = 1
        }
      }
    }
  },
  methods: {
    GetDeptInfoCaches() {
      this.$client.GetDeptInfoCaches({}).then(res => {
        if (res.head.result === '200') {
          this.branchOffice = res.context
        }
      })
    },
    // 关闭弹窗
    dialogClose() {
      this.$emit('update:dialogBool', false)
    },
    // 修改用车时间
    changeTime(val) {
      // console.log(val);
      if (this.form.date.length > 0) {
        this.form.use_start_time = this.form.date[0]
        this.form.use_end_time = this.form.date[1]
      } else {
        this.form.use_start_time = ''
        this.form.use_end_time = ''
      }
      if (this.curType !== 'detail' || this.curType !== 'edit') return false
      // 如果已经生成表格后 再改变
      if (this.tableTabs.length > 0) {
        this.dialogType = 1
        if (val) {
          this.confirm()
        } else {
          this.tableTabs = []
        }
      }
    },
    // 确认 （生成表格数据）
    confirm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.dialogType = 2
          this.createTableData()
        } else {
          return false
        }
      })
    },
    // 生成表格数据
    createTableData() {
      let timeDate = getDays(this.form.use_start_time, this.form.use_end_time)
      this.tableTabs = []
      timeDate.forEach((item, index) => {
        let data = []
        this.deptNodes.forEach((child, i) => {
          let arr = this.form.end_point_use_time
            ? [
                {
                  vehicle_use_time: item,
                  start_point: this.form.starting_point,
                  usege_time: this.form.starting_point_use_time,
                  end_point: this.form.ending_point,
                  dept_name: child.c_name,
                  dept_id: child.i_id,
                  vehicles_num: '',
                  cost: '',
                  vehicle_id: '',
                  driver_id: '',
                  phone: '',
                  remark: '',
                  sort: i + (index + 1) * 10,
                  uuid: uuid(),
                  mergekeys: this.form.starting_point
                },
                {
                  vehicle_use_time: item,
                  start_point: this.form.ending_point,
                  usege_time: this.form.end_point_use_time,
                  end_point: this.form.starting_point,
                  dept_name: child.c_name,
                  dept_id: child.i_id,
                  vehicles_num: '',
                  cost: '',
                  vehicle_id: '',
                  driver_id: '',
                  phone: '',
                  remark: '',
                  sort: i + (index + 1) * 1000,
                  uuid: uuid(),
                  mergekeys: this.form.ending_point
                }
              ]
            : [
                {
                  vehicle_use_time: item,
                  start_point: this.form.starting_point,
                  usege_time: this.form.starting_point_use_time,
                  end_point: this.form.ending_point,
                  dept_name: child.c_name,
                  dept_id: child.i_id,
                  vehicles_num: '',
                  cost: '',
                  vehicle_id: '',
                  driver_id: '',
                  phone: '',
                  remark: '',
                  sort: i + (index + 1) * 10,
                  uuid: uuid(),
                  mergekeys: this.form.starting_point
                }
              ]
          data = [...data, ...arr]
        })
        // 根据 sort 排序
        data.sort(function (a, b) {
          return a.sort - b.sort
        })
        let obj = {
          name: index + 1 + '',
          title: this.dateConversion(item),
          data: data
        }
        this.tableTabs.push(obj)
      })
      // console.log('=========',JSON.parse(JSON.stringify(this.tableTabs)));
    },
    // 日期转换
    dateConversion(date) {
      let month = new Date(date).getMonth() + 1
      let days = new Date(date).getDate()
      return `${month}月${days}日`
    },
    // 获取 划分组织信息
    changeDept(vehs, nodes) {
      this.comList = !!nodes ? nodes.map(item => item.c_name) : []
      this.form.one_fee = this.comList.includes('公交一分公司') ? this.form.one_fee : ''
      this.form.two_fee = this.comList.includes('公交二分公司') ? this.form.two_fee : ''
      this.form.three_fee = this.comList.includes('公交三分公司') ? this.form.three_fee : ''
      this.form.four_fee = this.comList.includes('公交四分公司') ? this.form.four_fee : ''
      this.form.five_fee = this.comList.includes('五分公司') ? this.form.five_fee : ''
      console.log('nodes', vehs, nodes, this.haveRule, this.comList)
      this.deptNodes = nodes
      if (this.curType !== 'detail' || this.curType !== 'edit') return false
      // 如果已经生成表格后 再改变
      if (this.tableTabs.length > 0) {
        this.dialogType = 1
        if (this.deptNodes.length > 0) {
          this.confirm()
        } else {
          this.tableTabs = []
        }
      }
    },
    updatePlaybill(type) {
      // 草稿不校验
      if (type == 1) {
        let list = []
        this.tableTabs.forEach(item => {
          item.data.forEach(child => {
            list.push(child)
          })
        })
        this.form.details = list
        this.form.type = type
        let info = { ...this.form }
        this.$emit('save-add-edit-organization', info)
      } else {
        let Flowed = false,
          required = false
        for (let index = 0; index < this.tableTabs.length; index++) {
          let data = this.tableTabs[index].data
          let list = data.filter(item => {
            return item.start_point === item.end_point
          })
          let arr = data.filter(item => {
            return !item.start_point || !item.end_point || !item.vehicles_num || !item.usege_time
          })
          if (list.length > 0) Flowed = true
          if (arr.length > 0) required = true
        }
        if (Flowed) {
          this.$message({
            showClose: true,
            message: '不能有相同的起点和终点',
            type: 'warning'
          })
          return
        }
        if (required) {
          this.$message({
            showClose: true,
            message: '列表中有必填项 起点、用车时间、终点、车辆数不能为空',
            type: 'warning'
          })
          return
        }

        let list = []
        this.tableTabs.forEach(item => {
          item.data.forEach(child => {
            if (type == 2) {
              for (let index = 0; index < child.vehicles_num; index++) {
                child.sort += index
                list.push(deepCopy(child))
                console.log('child', type, child)
              }
            } else {
              console.log('child', type, child)
              list.push(child)
            }
          })
        })
        console.log('list', list)
        this.form.details = [...list, ...this.filterateData]

        if (type == 3) {
          // 如果驾驶员和车辆没有全部填写完  就算填报中
          let arr = this.form.details.filter(item => {
            return !item.vehicle_id || !item.driver_id
          })
          if (arr.length > 0) {
            type = 2
          }
        }

        // console.table('----------',JSON.parse(JSON.stringify(this.form.details)));
        // console.log('*********',JSON.parse(JSON.stringify(list)));

        this.$refs['form'].validate(valid => {
          if (valid) {
            this.form.type = type
            let info = { ...this.form }

            this.$emit('save-add-edit-organization', info)
          } else {
            return false
          }
        })
      }
    },
    setData(info) {
      let type = info.type
      for (const key in info) {
        if (Object.hasOwnProperty.call(this.form, key)) {
          this.form[key] = info[key]
        }
      }
      this.form.date = [this.form.use_start_time, this.form.use_end_time]
      // 草稿不变
      if (type == 1) {
        this.mergeAgain = false
        this.dialogType = 2
      } else {
        this.mergeAgain = true
        this.dialogType = 3
        this.mergekeys = [
          'start_point',
          'usege_time',
          'end_point',
          'dept_name',
          'vehicles_num',
          'cost'
        ]
        this.canRendererTableHeader = [
          ...this.canRendererTableHeader,
          ...this.canRendererTableHeader2
        ]
      }

      if (type == 3) {
        this.dialogType = 4
      }
      this.assemblyData(info, type)
    },

    // 组装数据
    assemblyData(info, type) {
      let data = []
      let all_data = deepCopy(info.details)
      let all = this.$isPowerShow('all')
      // 管理员权限  看全部
      if (all) {
        data = all_data
      } else {
        // let dept_id = this.userInfo.department_id
        // console.log('-----------',dept_id,all_data);
        // 过滤数据  自己部门只能看自己部门的
        data = all_data.filter(item => {
          return item.dept_id == this.userInfo.department_id
        })
        this.filterateData = all_data.filter(item => {
          return item.dept_id != this.userInfo.department_id
        })
      }

      this.tableTabs = []
      if (data.length == 0) {
        return
      }
      let list = []
      // 根据车辆数 拆分成对应数量的数据
      data.forEach(item => {
        // 只有完成逻辑要拆分
        // if (type == 2) {
        //   for (let index = 0; index < item.vehicles_num; index++) {
        //     item.sort += index
        //     list.push(deepCopy(item))
        //   }
        // } else {
        list.push(deepCopy(item))
        // }
      })

      list.forEach(item => {
        if (type == 1) {
          item.mergekeys = item.start_point
        } else {
          item.mergekeys = item.start_point + item.dept_name
        }
      })
      let vehicle_use_time_info = {}
      let i = 0
      // 根据用车时间 生成对应tabs
      list.forEach((item, index) => {
        item.uuid = uuid()
        if (!vehicle_use_time_info[item.vehicle_use_time]) {
          vehicle_use_time_info[item.vehicle_use_time] = 1
          let obj = {
            name: ++i,
            title: this.dateConversion(item.vehicle_use_time),
            vehicle_use_time: item.vehicle_use_time,
            data: []
          }
          obj.name = obj.name + ''
          this.tableTabs.push(obj)
        }
      })

      // 循环匹配
      list.forEach(item => {
        this.tableTabs.forEach(child => {
          if (item.vehicle_use_time == child.vehicle_use_time) {
            child.data.push(item)
          }
        })
      })
      this.tableTabs.forEach(item => {
        item.data = item.data.sort(function (a, b) {
          return a.sort - b.sort
        })
      })
      // console.log('=========',JSON.parse(JSON.stringify(this.tableTabs)));
    },
    // 选择车辆给回程信息赋值
    getVehicleInfo(ids, i, index) {
      console.log('选择车辆', ids, i, index)

      // if(ids) {
      //   this.tableTabs[i].data.forEach(item => {
      //     console.log(item, this.tableTabs[i].data[index]);

      //     if(
      //       item.start_point === this.tableTabs[i].data[index].end_point &&
      //       item.end_point === this.tableTabs[i].data[index].start_point &&
      //       item.dept_name === this.tableTabs[i].data[index].dept_name
      //     ) {
      //       item.vehicle_id = ids
      //     }
      //   })
      // }
    },
    getDriverInfo(ids, i, index) {
      console.log('选择司机', ids, i, index)
      // if (ids.length > 0) {
      this.getListSysPerson(ids[0], i, index)
      //   this.tableTabs[i].data.forEach(item => {
      //     if(
      //       item.start_point === this.tableTabs[i].data[index].end_point &&
      //       item.end_point === this.tableTabs[i].data[index].start_point &&
      //       item.dept_name === this.tableTabs[i].data[index].dept_name
      //     ) {
      //       item.driver_id = ids[0]
      //     }
      //   })
      // }
    },
    // 获取用户信息
    getListSysPerson(user_id, i, index) {
      let content = {
        id: user_id
      }
      this.$client.GetDriverEmployeeManageDetail(content).then(res => {
        if (res.head.result === '200') {
          this.tableTabs[i].data[index].phone = res.context.phone || ''
          // this.tableTabs[i].data.forEach(item => {
          //   if(
          //     item.start_point === this.tableTabs[i].data[index].end_point &&
          //     item.end_point === this.tableTabs[i].data[index].start_point &&
          //     item.dept_name === this.tableTabs[i].data[index].dept_name
          //   ) {
          //     item.phone = res.context.phone || ''
          //   }
          // })
        }
      })
    },
    // 上传图片
    imagesUpdateSuccess(val) {
      console.log(val)
      let url = ''
      let list = []
      val.forEach(item => {
        url = item.url ? item.url : item
        list.push(url)
      })
      this.form.img_list = list
    },
    uploadUpdateSuccess(val) {
      // console.log(val)
      // let url = ''
      // let list = []
      // val.forEach(item => {
      //   url = item.url ? item.url : item
      //   list.push(url)
      // })
      this.form.files_list = val
    },
    // 收缩
    onTitle(bool) {
      this.TableHeight = bool ? 300 : 500
    },
    printTable(form, tableData) {
      console.log(form, 'form')
      console.log(tableData, 'tableData')
      let printContent
      let style = ''
      if (this.form.chariot_type == 1) {
        // 普通包车
        printContent = Vue.extend(ordinaryPrint)
        style = ``
      } else {
        // 大型用车
        printContent = Vue.extend(largecarPrint)
        style = `
          * {
            margin: 0;
            padding: 0;
          }
          html,
          body {
            width: 1000px;
            padding: 10px;
          }
          /* 确保表格合并边框，避免重叠 */
          .el-table {
            width: 100%;
            border-collapse: collapse;
            border-right: 1px solid black;
            border-bottom: 1px solid black;
          }

          /* 设置表头和表格主体单元格的边框 */
          .el-table th,
          .el-table td {
            border: 1px solid black; /* 设置每个单元格的边框为 1px */
            box-sizing: border-box; /* 确保边框不影响整体尺寸 */
          }

          /* 单独处理表头的底部边框，避免和主体单元格的边框重叠 */
          .el-table__header-wrapper th {
            border-bottom: 1px solid black; /* 设置表头单元格的底部边框 */
          }

          .el-table__body-wrapper td {
            border-top: 1px solid black; /* 设置主体单元格的顶部边框 */
          }

          .title {
            font-size: 20px;
            color: #000;
            text-align: center;
            margin-top: 20px;
            margin-bottom: 20px;
            font-weight: bold;
          }
        `
      }
      const instance = new printContent({
        propsData: {
          form: form,
          tableData: tableData
        }
      })
      instance.$mount()

      // 创建新窗口
      const printWindow = window.open('', '_blank')
      printWindow.document.write('<html><head><title>打印</title>')
      printWindow.document.write(
        '<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">'
      )
      printWindow.document.write(`<style>${style}</style>`) // 添加样式

      printWindow.document.write('</head><body>')
      printWindow.document.write('</body></html>')
      printWindow.document.close()
      printWindow.document.body.appendChild(instance.$el)

      // 等待新窗口加载完成后打印
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 500)
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  /deep/ .el-col-6 {
    min-height: 75px;
  }
}
</style>
