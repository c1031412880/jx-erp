<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    width="1030px"
    top="20px"
  >
    <el-form
      :model="form"
      :rules="formRules"
      ref="form"
      size="mini"
      label-suffix=":"
      label-position="right"
      label-width="130px"
      class="form-box"
    >
      <el-row :gutter="20" id="information">
        <el-col :span="24" style="display: flex; align-items: center; padding-bottom: 10px">
          <div style="float: left; width: 6px; height: 18px; background: #409eff"></div>
          <p style="margin-left: 5px; color: #000; font-size: 14px">工单信息</p>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工单所属" prop="order_affiliation">
            <el-select
              v-model="form.order_affiliation"
              placeholder="请选择工单所属"
              @change="changeAffiliation"
              :disabled="curSelectedType == 'detail'"
            >
              <el-option label="定点稽查" :value="2"></el-option>
              <el-option label="监控稽查" :value="1"></el-option>
              <el-option label="随车动态稽查" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车牌号(自编号)" prop="vehicle_id">
            <get-vehicle-select-tree
              ref="vehicleTree"
              :placeholder="'选择车辆'"
              :isShowCheckbox="false"
              :isExportMultiple="false"
              @on-change="vehicleChange"
              v-model="form.vehicle_id"
              :disabled="curSelectedType == 'detail'"
            ></get-vehicle-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="线路" prop="line_id">
            <get-line-select-tree
              ref="lineTree"
              :placeholder="'选择线路'"
              :isShowCheckbox="false"
              v-model="form.line_id"
              :isExportMultiple="false"
              :width="'390'"
              :disabled="curSelectedType == 'detail'"
            ></get-line-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.device_state != 2">
          <el-form-item label="所属组织" prop="dept_id">
            <get-department-select
              ref="personalTree"
              v-model="form.dept_id"
              :isShowCheckbox="false"
              :placeholder="'请选择所属组织'"
              :isContainEmp="false"
              :show_all="true"
              :isExportMultiple="false"
              :disabled="curSelectedType == 'detail'"
            ></get-department-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="当班驾驶员" prop="driver_id">
            <get-driver-select-tree
              ref="driverTree"
              v-model="form.driver_id"
              :width="'390'"
              :isShowCheckbox="false"
              :placeholder="'请选择当班驾驶员'"
              :isExportMultiple="false"
              :disabled="curSelectedType == 'detail'"
            ></get-driver-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="经办人" prop="handle_user">
            <get-department-select
              ref="personalTree1"
              v-model="form.handle_user"
              :width="'220'"
              :isShowCheckbox="true"
              :placeholder="'请选择经办人'"
              :isContainEmp="true"
              :isExportMultiple="true"
              :disabled="curSelectedType == 'detail'"
            ></get-department-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation != 1">
          <el-form-item label="稽查方式" prop="check_type">
            <get-select-dictionaries
              v-model="form.check_type"
              :classKey="'稽查方式'"
              :placeholder="'请选择稽查方式'"
              :disabled="curSelectedType == 'detail'"
              :isMultiple="false"
            ></get-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation != 1">
          <el-form-item label="检查站点" prop="check_station">
            <el-input
              v-model="form.check_station"
              placeholder="请输入检查站点"
              clearable
              :disabled="curSelectedType == 'detail'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1">
          <el-form-item label="设备状态" prop="device_state">
            <el-select
              v-model="form.device_state"
              placeholder="请选择设备状态"
              @change="changeDevice"
            >
              <el-option label="正常" :value="1"></el-option>
              <el-option label="异常" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1 && form.device_state != 2">
          <el-form-item label="监控开始时间" prop="start_time">
            <el-date-picker
              v-model="form.start_time"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              style="width: 180px"
              :disabled="curSelectedType === 'detail'"
              placeholder="请选择监控开始时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1 && form.device_state != 2">
          <el-form-item label="监控结束时间" prop="end_time">
            <el-date-picker
              v-model="form.end_time"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              style="width: 180px"
              :disabled="curSelectedType === 'detail'"
              placeholder="请选择监控结束时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.order_affiliation == 1 && form.device_state != 2">
          <el-form-item label="监控通道">
            <el-select
              v-model="form.device_thorough"
              placeholder="请选择监控通道"
              multiple
              clearable
              :disabled="curSelectedType == 'detail'"
            >
              <el-option v-for="item in 8" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" key="check_user">
          <el-form-item label="检查员" prop="check_user">
            <get-department-select
              ref="personalTree2"
              v-model="form.check_user"
              :width="'220'"
              :isShowCheckbox="false"
              :placeholder="'请选择检查员'"
              :isContainEmp="true"
              :isExportMultiple="false"
              :disabled="curSelectedType == 'detail'"
            ></get-department-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检查时间" prop="check_time">
            <el-date-picker
              v-model="form.check_time"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              style="width: 180px"
              :disabled="curSelectedType === 'detail'"
              placeholder="请选择检查时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.device_state != 2">
          <el-form-item label="本次检查主要内容" prop="check_content">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入本次检查主要内容"
              v-model="form.check_content"
              :disabled="curSelectedType === 'detail'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入备注"
              v-model="form.remark"
              :disabled="curSelectedType === 'detail'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="1" class="files-box" v-if="form.device_state != 2">
          <image-file-upload
            :images="form.img_list"
            :files="form.files_list"
            :isPreview="false"
            :isShowBox="curSelectedType != 'detail'"
            @files-update-success="filesUpdateSuccess"
            @images-update-success="imagesUpdateSuccess"
          ></image-file-upload>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="form.device_state != 2">
        <el-col :span="24" style="display: flex; align-items: center; padding-bottom: 10px">
          <div style="float: left; width: 6px; height: 18px; background: #409eff"></div>
          <p style="margin-left: 5px; color: #000; font-size: 14px">处理情况</p>
        </el-col>
        <el-col :span="24">
          <el-form-item label="奖罚依据" prop="violation_according">
            <el-input
              style="width: 100%"
              v-model="form.violation_according"
              placeholder="请选择奖罚依据"
              :disabled="curSelectedType === 'detail'"
              @focus="openViolationInspectPop"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="违规类型" prop="violation_type">
            <el-input v-model="form.violation_type" disabled size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="加/减分" prop="score">
            <el-input-number
              v-model="form.score"
              style="width: 100%"
              :controls="false"
              :precision="2"
              :disabled="curSelectedType === 'detail'"
              size="mini"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="驾驶员处理情况" prop="handle_result">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入驾驶员处理情况"
              v-model="form.handle_result"
              :disabled="curSelectedType === 'detail'"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="form.device_state == 2">
        <el-col :span="24" style="display: flex; align-items: center; padding-bottom: 10px">
          <div style="float: left; width: 6px; height: 18px; background: #409eff"></div>
          <p style="margin-left: 5px; color: #000; font-size: 14px">监控修复情况</p>
        </el-col>
        <el-col :span="24">
          <el-form-item label="修复情况" prop="repair_state">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入修复情况"
              v-model="form.repair_state"
              :disabled="curSelectedType === 'detail'"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="curSelectedType === 'edit' && !isEnd">
        <el-col :span="24" style="display: flex; align-items: center; padding-bottom: 10px">
          <div style="float: left; width: 6px; height: 18px; background: #409eff"></div>
          <p style="margin-left: 5px; color: #000; font-size: 14px">处理流程</p>
        </el-col>
        <el-col :span="24">
          <el-checkbox v-model="form.checked">发起处理流程:</el-checkbox>
          <approve-step
            v-if="form.checked"
            ref="approveStep"
            :showTitle="false"
            @on-users="setUsers"
            :form_data="form"
            :object_id="5280"
          ></approve-step>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="curSelectedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="saveFormData(1)" v-if="curSelectedType == 'edit'">
        保存
      </el-button>
      <el-button
        type="primary"
        @click="saveFormData(1)"
        v-if="curSelectedType == 'edit' && form.checked"
      >
        发起审批流程
      </el-button>
      <el-button
        type="primary"
        @click="saveFormData(7)"
        v-if="curSelectedType == 'add' || isEnd || form.order_state == 5"
      >
        完结
      </el-button>
      <el-button type="primary" @click="saveFormData(5)" v-if="curSelectedType == 'add'">
        保存草稿
      </el-button>
      <el-button
        type="primary"
        @click="saveFormData(6)"
        v-if="(curSelectedType == 'add' || form.order_state == 5) && form.handle_user.length > 0"
      >
        下发
      </el-button>
    </div>

    <div>
      <violation-inspect-pop
        ref="violationInspectPop"
        :dialogBool.sync="violationInspectPopShow"
        @save-add="saveAddViolationInspect"
      ></violation-inspect-pop>
    </div>
  </el-dialog>
</template>

<script>
import { getUser } from '@/utils/auth'
import { deepCopy, formatDate, TimestampToDate } from '@/utils/index'
import imageFileUpload from '@/components/imageFileUpload/index'
import getLineSelectTree from '@/components/base/formModel/tree/get-line-select-tree'
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
import getVehicleSelectTree from '@/components/base/formModel/tree/get-vehicle-select-tree'
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries'
import approveStep from '@/components/approve-echo/approve-step2'
import violationInspectPop from './violation-inspect-pop'
export default {
  components: {
    imageFileUpload,
    getLineSelectTree,
    getDriverSelectTree,
    getVehicleSelectTree,
    getDepartmentSelect,
    getSelectDictionaries,
    approveStep,
    violationInspectPop
  },
  props: {
    dialogBool: Boolean,
    curSelectedType: [String]
  },
  data() {
    return {
      form: {
        id: null,
        order_affiliation: 2,
        vehicle_id: '',
        line_id: '',
        dept_id: '',
        driver_id: '',
        handle_user: [],
        check_type: '',
        check_station: '',
        start_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        end_time: '',
        device_thorough: [],
        check_user: '',
        check_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        check_content: '',
        remark: '',
        img_list: [],
        files_list: [],
        violation_according: '',
        violation_type: '',
        score: '',
        handle_result: '',
        checked: false,
        repair_state: '',
        violation_accordings: [],
        order_state: '',
        device_state: ''
      },
      form_data: {
        id: null
      },
      formRules: {},
      basicRules1: {
        order_affiliation: [
          {
            required: true,
            message: '请选择工单所属',
            trigger: 'change'
          }
        ],
        vehicle_id: [
          {
            required: true,
            message: '请选择车牌号(自编号)',
            trigger: 'change'
          }
        ],
        line_id: [
          {
            required: true,
            message: '请选择所属线路',
            trigger: 'change'
          }
        ],
        dept_id: [
          {
            required: true,
            message: '请选择所属组织',
            trigger: 'change'
          }
        ],
        driver_id: [
          {
            required: true,
            message: '请选择当班驾驶员',
            trigger: 'change'
          }
        ],
        // check_type: [
        //   {
        //     required: true,
        //     message: "请选择稽查方式",
        //     trigger: "change",
        //   },
        // ],
        check_station: [
          {
            required: true,
            message: '请输入检查站点',
            trigger: 'change'
          }
        ],
        check_user: [
          {
            required: true,
            message: '请选择检查员',
            trigger: 'change'
          }
        ],
        check_time: [
          {
            required: true,
            message: '请选择检查时间',
            trigger: 'change'
          }
        ]
      },
      basicRules2: {
        order_affiliation: [
          {
            required: true,
            message: '请选择工单所属',
            trigger: 'change'
          }
        ],
        vehicle_id: [
          {
            required: true,
            message: '请选择车牌号(自编号)',
            trigger: 'change'
          }
        ],
        line_id: [
          {
            required: true,
            message: '请选择所属线路',
            trigger: 'change'
          }
        ],
        dept_id: [
          {
            required: true,
            message: '请选择所属组织',
            trigger: 'change'
          }
        ],
        driver_id: [
          {
            required: true,
            message: '请选择当班驾驶员',
            trigger: 'change'
          }
        ],
        device_state: [
          {
            required: true,
            message: '请选择设备状态',
            trigger: 'change'
          }
        ],
        start_time: [
          {
            required: true,
            message: '请选择监控开始时间',
            trigger: 'change'
          }
        ],
        end_time: [
          {
            required: true,
            message: '请选择监控结束时间',
            trigger: 'change'
          }
        ],
        // violation_according: [
        //   {
        //     required: true,
        //     message: "请输入奖罚依据",
        //     trigger: "change",
        //   },
        // ],
        check_user: [
          {
            required: true,
            message: '请选择检查员',
            trigger: 'change'
          }
        ],
        check_time: [
          {
            required: true,
            message: '请选择检查时间',
            trigger: 'change'
          }
        ]
      },
      basicRules3: {
        order_affiliation: [
          {
            required: true,
            message: '请选择工单所属',
            trigger: 'change'
          }
        ],
        vehicle_id: [
          {
            required: true,
            message: '请选择车牌号(自编号)',
            trigger: 'change'
          }
        ],
        line_id: [
          {
            required: true,
            message: '请选择所属线路',
            trigger: 'change'
          }
        ],
        driver_id: [
          {
            required: true,
            message: '请选择当班驾驶员',
            trigger: 'change'
          }
        ],
        handle_user: [
          {
            required: true,
            message: '请选择经办人',
            trigger: 'change'
          }
        ],
        device_state: [
          {
            required: true,
            message: '请选择设备状态',
            trigger: 'change'
          }
        ],
        check_user: [
          {
            required: true,
            message: '请选择检查员',
            trigger: 'change'
          }
        ],
        check_time: [
          {
            required: true,
            message: '请选择检查时间',
            trigger: 'change'
          }
        ]
      },
      key: null,
      violationInspectPopShow: false,
      nodes: null,
      isEnd: false,
      isEcho: false,
      siteList: [],
      title: '添加稽查登记'
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool) {
        if (this.curSelectedType == 'add') {
          this.formRules = { ...this.basicRules1 }
          this.form.check_user = JSON.parse(getUser()).user_id
        }
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
        this.getTitle()
      } else {
        if (this.form.vehicle_id && this.$refs.vehicleTree) {
          this.$refs.vehicleTree.onClear()
        }
        if (this.form.dept_id && this.$refs.personalTree) {
          this.$refs.personalTree.onClear()
        }
        if (this.form.handle_user.length && this.$refs.personalTree1) {
          this.$refs.personalTree1.onClear()
        }
        if (this.form.check_user && this.$refs.personalTree2) {
          this.$refs.personalTree2.onClear()
        }
        if (this.form.driver_id && this.$refs.driverTree) {
          this.$refs.driverTree.onClear()
        }
        if (this.form.line_id && this.$refs.lineTree) {
          this.$refs.lineTree.onClear()
        }
        Object.assign(this.$data, this.$options.data())
      }
    }
  },
  methods: {
    // 数据回显
    setData(info, type, bool) {
      this.$refs.form.clearValidate()
      this.formRules =
        info.order_affiliation == 2
          ? { ...this.basicRules1 }
          : info.order_affiliation == 1 && info.device_state == 1
          ? { ...this.basicRules2 }
          : { ...this.basicRules3 }
      this.isEnd = bool
      for (let key in this.form) {
        if (Object.hasOwnProperty.call(info, key)) {
          this.form[key] = info[key]
        }
      }

      if (type == 'copy') {
        this.form.checked = false
        this.form.id = ''
      }
    },
    getTitle() {
      switch (this.curSelectedType) {
        case 'add':
          this.title = '添加稽查登记'
          break
        case 'edit':
          this.title = '编辑稽查登记'
          break
        case 'detail':
          this.title = '查看稽查登记'
          break
        default:
          break
      }
    },
    // 定位
    positioning(name) {
      document.querySelector(`#${name}`).scrollIntoView()
    },
    dialogClose() {
      this.$emit('update:dialogBool', false)
    },
    // 保存
    saveFormData(type) {
      if (this.form.order_affiliation != 1) {
        this.form.start_time = ''
      }
      // 草稿直接保存  不走校验
      if (type == 5) {
        let params = {
          form_data: Object.assign({}, this.form),
          step_data: null
        }
        params.form_data.order_state = type
        this.$emit('save-add-edit', params)
      } else {
        this.$refs['form'].validate(valid => {
          if (valid) {
            let params = {
              form_data: Object.assign({}, this.form),
              step_data: null
            }
            // 保存时 不修改状态
            if (type == 1) {
              if (params.form_data.checked) {
                params.step_data = this.nodes
              } else {
                params.step_data = null
              }
            } else {
              params.form_data.order_state = type
            }
            this.$emit('save-add-edit', params)
          } else {
            console.log('error submit!!', valid)
            return false
          }
        })
      }
    },
    // 打开违规项目稽查
    openViolationInspectPop() {
      this.violationInspectPopShow = true
      setTimeout(() => {
        if (!!this.form.epbs_detail && !!this.form.epbs_detail.length) {
          this.$refs.violationInspectPop.oldSelectedProjectIds = this.epbs
        }
      }, 60)
    },
    // 保存奖罚依据
    saveAddViolationInspect(selectedIds, list) {
      this.form.score = ''
      this.form.violation_according = ''
      let violation_type = []
      this.form.violation_accordings = selectedIds
      if (list.length) {
        list.forEach(element => {
          this.form.violation_according = this.form.violation_according + element.c_name + ','
          this.form.score = Number(this.form.score) + Number(element.n_score)
          if (element.type_name) {
            violation_type.push(element.type_name)
          }
        })
      }
      this.form.violation_type = violation_type.toString()
      this.violationInspectPopShow = false
    },
    // 上传图片
    imagesUpdateSuccess(imageList) {
      this.form.img_list = imageList.map(item => {
        return {
          file_name: item.name,
          url: item.url
        }
      })
    },
    // 上传文件
    filesUpdateSuccess(filesList) {
      this.form.files_list = filesList.map(item => {
        return {
          file_name: item.name,
          url: item.url
        }
      })
    },
    // 获取车辆信息
    vehicleChange(vehs, nodes) {
      this.$client.GetVehicleInfoById({ id: this.form.vehicle_id }).then(res => {
        if (res.head.result == '200') {
          this.form.line_id = res.context.line_id || ''
          this.form.dept_id = res.context.dept_id || ''
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 接收流程节点
    setUsers(data) {
      this.nodes = data
    },
    // 修改 工单所属
    changeAffiliation() {
      this.form.device_state = 1
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
      this.formRules =
        this.form.order_affiliation != 1
          ? { ...this.basicRules1 }
          : this.form.order_affiliation == 1 && this.form.device_state == 1
          ? { ...this.basicRules2 }
          : { ...this.basicRules3 }
      this.form.check_type = ''
      this.form.check_station = ''
      this.form.start_time = ''
      this.form.end_time = ''
      this.form.device_thorough = []
      // this.form.check_time = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      this.updateFlow()
    },
    // 更新流程
    updateFlow() {
      if (this.form.checked) {
        this.$refs.approveStep.loadData()
      }
    },
    // 修改设备状态
    changeDevice(val) {
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
      this.formRules = val === 1 ? { ...this.basicRules2 } : { ...this.basicRules3 }
      this.form.dept_id = ''
      this.form.start_time = ''
      this.form.end_time = ''
      this.form.device_thorough = []
      this.form.check_content = ''
      this.form.violation_according = ''
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.form-box{
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 10px;
}
</style>
