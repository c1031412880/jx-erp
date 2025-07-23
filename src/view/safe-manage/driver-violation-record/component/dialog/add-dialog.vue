<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    width="980px"
    :close-on-click-modal="false"
    :append-to-body="appendToBody"
  >
    <div class="base-info" style="height: 440px">
      <el-form size="mini" :model="formData" :rules="rules" ref="formData" label-width="120px">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="show-flex-box-c">
          <el-tab-pane label="违规工单信息" name="first">
            <div class="violation-info">
              <div class="show-flex-box-r">
                <el-form-item label="车辆:" prop="i_vehicle_id">
                  <get-vehicle-select-tree
                    ref="vehicleTree"
                    :placeholder="'请选择车辆'"
                    :isShowCheckbox="false"
                    :isExportMultiple="false"
                    :width="'280'"
                    @on-change="vehicleChange"
                    v-model="formData.i_vehicle_id"
                    :disabled="curChangeType == 'detail'"
                  ></get-vehicle-select-tree>
                </el-form-item>
                <el-form-item label="所属组织:" prop="i_vehicle_id">
                  <!-- <el-input v-model="department_name" placeholder="所属组织" disabled></el-input> -->
                  <get-department-select
                    ref="deptTree"
                    :width="'280'"
                    :isShowCheckbox="false"
                    :isExportMultiple="false"
                    v-model="formData.i_dept_id"
                    :placeholder="'请选择所属组织'"
                    :isContainEmp="isContainEmp"
                    :disabled="curChangeType == 'detail'"
                  ></get-department-select>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="线路:" prop="i_line_id">
                  <get-line-select-tree
                    ref="lineTree"
                    :placeholder="'选择线路'"
                    :isShowCheckbox="false"
                    v-model="formData.i_line_id"
                    :isExportMultiple="false"
                    :width="'280'"
                    :disabled="curChangeType == 'detail'"
                  ></get-line-select-tree>
                </el-form-item>
                <el-form-item label="驾驶员:" prop="i_driver_id">
                  <get-driver-select-tree
                    ref="driverTree"
                    v-model="formData.i_driver_id"
                    :width="'280'"
                    :isShowCheckbox="false"
                    :placeholder="'请选择驾驶员'"
                    :isExportMultiple="false"
                    :disabled="curChangeType == 'detail'"
                  ></get-driver-select-tree>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="违规日期:" prop="d_violation_date">
                  <el-date-picker
                    v-model="formData.d_violation_date"
                    type="datetime"
                    placeholder="请选择违规日期"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="curChangeType == 'detail'"
                  ></el-date-picker>
                </el-form-item>

                <el-form-item label="来源:" prop="c_source">
                  <get-select-dictionaries
                    v-model="formData.c_source"
                    :classKey="'驾驶员违规来源'"
                    :placeholder="'请选择来源'"
                    :disabled="curChangeType == 'detail'"
                    v-if="!source_name"
                  ></get-select-dictionaries>
                  <el-input v-else v-model="source_name" disabled></el-input>
                </el-form-item>
              </div>

              <div class="show-flex-box-r">
                <el-form-item label="责任部门:" prop="i_department_id">
                  <get-department-select
                    ref="departmentTree"
                    :width="'280'"
                    :isShowCheckbox="false"
                    :isExportMultiple="false"
                    v-model="formData.i_department_id"
                    :placeholder="'请选择责任部门'"
                    :isContainEmp="isContainEmp"
                    :disabled="curChangeType == 'detail'"
                  ></get-department-select>
                </el-form-item>

                <el-form-item label="违规项目:" prop="c_violation_item">
                  <get-select-dictionaries
                    v-model="formData.c_violation_item"
                    :classKey="'违规项目'"
                    :placeholder="'违规项目选择'"
                    :disabled="curChangeType == 'detail'"
                  ></get-select-dictionaries>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="处罚依据:" prop="i_check_id">
                  <get-select-record
                    v-model="formData.i_check_id"
                    @on-change="recordChange"
                    :multiple="true"
                    :disabled="curChangeType == 'detail'"
                  ></get-select-record>
                </el-form-item>
                <el-form-item label="安全等级:" prop="i_leavel">
                  <el-input
                    v-model="formData.i_leavel"
                    placeholder="安全等级"
                    :disabled="curChangeType == 'detail'"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="加减分数:" prop="check_core">
                  <el-input
                    v-model="formData.check_core"
                    placeholder="加减分数"
                    :disabled="curChangeType == 'detail'"
                  ></el-input>
                </el-form-item>

                <el-form-item label="备注:" prop="c_remark">
                  <el-input
                    type="textarea"
                    :disabled="curChangeType == 'detail'"
                    :autosize="{ minRows: 4, maxRows: 8 }"
                    placeholder="请输入备注"
                    v-model="formData.c_remark"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="考核资格:" prop="cancel_star">
                  <el-checkbox v-model="formData.cancel_star">取消本季度星级考核资格</el-checkbox>
                </el-form-item>
              </div>
              <el-form-item label="上传图片:" prop="images">
                <div class="list-data-list show-flex-box-r">
                  <ul class="list-data" v-for="(item, index) in formData.images" :key="index">
                    <li class="item" v-if="item.url">
                      <image-box
                        :src="item.url"
                        :id="index + 1"
                        @on-delete="imageDelete(index)"
                        :disabled="curChangeType == 'detail'"
                      ></image-box>
                    </li>
                    <!-- <li class="item unchecked" v-else @click="uploadFile()">
                      <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
                    </li> -->
                  </ul>
                  <div
                    class="item unchecked"
                    @click="uploadFile()"
                    v-if="
                      !formData.images ||
                      (!!formData.images && formData.images.length < 4 && curChangeType != 'detail')
                    "
                  >
                    <i class="el-icon-plus" style="font-size: 60px; font-weight: 600"></i>
                  </div>
                </div>
              </el-form-item>

              <div class="multiple-files-upload-content show-flex-box-r">
                <el-form-item label="附件:" prop="files">
                  <el-upload
                    class="upload-demo"
                    ref="uploadDocomnet"
                    action="string"
                    :on-change="handlePreview"
                    accept=".rar,.zip,.doc,.docx,.pdf,.mp4"
                    :auto-upload="false"
                    :disabled="curChangeType == 'detail' || formData.files.length > 2"
                  >
                    <el-button
                      slot="trigger"
                      size="small"
                      type="primary"
                      class="el-icon-upload"
                      :disabled="curChangeType == 'detail' || formData.files.length > 2"
                    >
                      上传文件
                    </el-button>
                    <div slot="tip" class="el-upload__tip">
                      支持格式：.rar .zip .doc .docx .pdf
                      .mp4，单个文件不能超过20MB(不限视频)，最多只能保存3个文件
                    </div>
                  </el-upload>
                  <ul class="document-content show-flex-box-c">
                    <li
                      class="show-flex-box-r"
                      v-for="(item, index) in formData.files"
                      :key="index"
                    >
                      <span class="show-flex-box-r">
                        <i
                          class="el-icon-document-remove"
                          style="margin: 7px 6px 0px 0px; font-size: 14px"
                        ></i>
                        <span>{{ item.file_name }}</span>
                      </span>
                      <strong class="show-flex-box-r">
                        <el-button type="text" @click="downloadDocument(item)">下载</el-button>
                        <el-button
                          type="text"
                          :disabled="curChangeType == 'detail'"
                          @click="deleteDocument(item, index)"
                        >
                          删除
                        </el-button>
                      </strong>
                    </li>
                  </ul>
                </el-form-item>
              </div>
              <!-- <el-form-item label="上传附件:" prop="address">
                <multiple-files-upload :filesList="formData.files" :acceptType="'.doc,.docx,.pdf,.xls,.xlsx'" :isPreviewable="false" @upload-update-success="uploadUpdateSuccess" :disabled="curChangeType == 'detail'"></multiple-files-upload>
              </el-form-item> -->
            </div>
          </el-tab-pane>
          <el-tab-pane label="工单处理" name="second" v-if="curChangeType != 'add'">
            <div style="height: 410px; overflow-y: scroll">
              <div class="show-flex-box-r">
                <el-form-item label="发起处理流程:" prop="checked" style="width: 300px">
                  <el-checkbox
                    @change="selectApprove"
                    v-model="formData.checked"
                    :disabled="curChangeType == 'detail'"
                  ></el-checkbox>
                </el-form-item>
                <!-- <el-form-item label="选择审核流程:" prop="region" v-if="form.checked">
                  <el-select v-model="form.region" placeholder="请选择选择审核流程">
                    <el-option label="一般投诉处理流程" :value="1"></el-option>
                    <el-option label="重大投诉处理流程" :value="2"></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item
                  label="选择审核流程:"
                  prop="c_result_remark"
                  v-if="formData.checked && curChangeType == 'edit'"
                >
                  <el-select
                    v-model="flow_id"
                    @change="selectedFlowId"
                    clearable
                    placeholder="请选择流程"
                  >
                    <el-option
                      v-for="item in flowListOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="show-flex-box-c" v-if="formData.checked">
                <!-- <i
                  style="float: left; width: 6px; height: 18px; background: #409eff"
                ></i> -->
                <p
                  style="
                    margin-left: 15px;
                    margin-bottom: 15px;
                    color: #409eff;
                    font-size: 16px;
                    font-weight: bold;
                  "
                >
                  流程:
                </p>
                <div
                  class="show-flex-box-r"
                  v-if="!!formData.flow_id && curChangeType == 'detail'"
                  style="margin: 15px 0 0 30px"
                >
                  <approve-schedule
                    style="margin-left: 10px"
                    :isFlow="false"
                    :flow_id="formData.flow_id"
                  ></approve-schedule>
                </div>
                <div
                  class="show-flex-box-r"
                  v-if="!!flow_id && curChangeType == 'edit'"
                  style="margin: 15px 0 0 30px"
                >
                  <approve-step
                    :flow_id="flow_id"
                    :isFlow="true"
                    @on-users="saveOnUsers"
                  ></approve-step>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer" v-if="curChangeType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="submitFormData('formData')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import getLineSelectTree from '@/components/base/formModel/tree/get-line-select-tree'
import getVehicleSelectTree from '@/components/base/formModel/tree/get-vehicle-select-tree'
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries'
import baseInfo from '../dialog/base-info'
import GetSelectRecord from './get-select-record'
import approveSchedule from '@/components/approve-echo/approve-schedule.vue'
import approveStep from '@/components/approve-echo/approve-step.vue'
import imageBox from '@/components/image-box/index'
import multipleFilesUpload from '@/components/multiple-files-upload'
export default {
  components: {
    GetSelectRecord,
    getLineSelectTree,
    getVehicleSelectTree,
    getDriverSelectTree,
    getDepartmentSelect,
    getSelectDictionaries,
    baseInfo,
    approveSchedule,
    approveStep,
    imageBox,
    multipleFilesUpload
  },
  props: {
    dialogBool: Boolean,
    curChangeType: {
      type: String,
      default: 'add' //add添加  edit编辑  detail详情
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedId: '',
      showTitle: '驾驶员违规记录',
      isContainEmp: false, //是否显示部门下的人员
      source_name: '',
      formData: {
        i_id: '',
        i_dept_id: '',
        i_vehicle_id: '',
        group_name: '',
        i_line_id: '',
        i_driver_id: '',
        d_violation_date: '',
        c_source: '',
        i_department_id: '',
        c_violation_item: '',
        i_check_id: [],
        i_leavel: '',
        i_check_name: '',
        c_remark: '',
        check_core: '',
        check_amount: '',
        checked: false,
        flow_id: '', //流程id
        flow_code: '', //流程编号
        source_type: '',
        cancel_star: false,
        images: [],
        files: []
      },
      rules: {
        i_vehicle_id: [
          {
            required: true,
            message: '请选择车辆:',
            trigger: 'change'
          }
        ],
        i_line_id: [
          {
            required: true,
            message: '请选择线路',
            trigger: 'change'
          }
        ],
        i_driver_id: [
          {
            required: true,
            message: '请选择驾驶员',
            trigger: 'change'
          }
        ],
        d_violation_date: [
          {
            required: true,
            message: '请选择违法日期',
            trigger: 'change'
          }
        ]
      },
      department_name: '', //部门名称
      // i_score: "", //违法扣分
      // n_money: "", //违法罚款
      isFirstLoad: false,
      activeName: 'first',
      flowListOptions: [],
      approveStepList: [], //流程列表
      flow_id: ''
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data())
        this.resetData()
      } else {
        this.configAddStaffInfo()
        if (this.curChangeType == 'detail') {
          this.formData.checked = true
        }
        this.$nextTick(() => {
          this.$refs.formData.clearValidate()
        })
      }
    }
  },
  methods: {
    configAddStaffInfo() {
      if (this.curChangeType == 'add') {
        this.showTitle = '驾驶员违规记录'
      } else if (this.curChangeType == 'edit') {
        this.showTitle = '编辑'
      } else {
        this.showTitle = '详情'
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 项目选中
    recordChange(item) {
      console.log(item)
      this.formData.check_core = 0
      item.forEach(item => {
        this.formData.check_core += item.n_score
      })
      // this.formData.check_amount = item.c_fee
      // this.formData.i_leavel = item.i_leavel
    },
    dialogClose() {
      this.$emit('update:dialogBool', false)
    },
    submitFormData(formName) {
      //
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.formData))
          params.cancel_star = params.cancel_star ? 1 : 2

          this.$emit('sure-save-info', params, this.approveStepList)
        } else {
          return false
        }
      })
    },
    // 处罚依据选择弹窗
    checkOpen() {
      this.baseInfoShow = true
    },
    // 车辆选中回调
    vehicleChange(vehs, nodes) {
      if (vehs && vehs.length > 0) {
        this.reqVehicleRelationInfo(vehs[0])
      }
    },
    // 违法项目change事件
    violationProjectChange(item) {
      // this.i_score = item.i_score;
      // this.n_money = item.n_money;
    },
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
            this.department_name = relationInfo.department_name
            this.formData.i_dept_id = relationInfo.dept_id
            if (!!relationInfo.line && relationInfo.line.length > 0) {
              // this.$refs.lineTree.lineCheck(relationInfo.line)
              this.formData.i_line_id = relationInfo.line[0].i_id
            } else {
              setTimeout(() => {
                this.formData.i_line_id = ''
                this.formData.i_dept_id = ''
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
    // 删除照片
    imageDelete(index) {
      this.formData.images.splice(index, 1)
    },
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      // input.accept = ".jpg,.jpeg";
      input.onchange = () => {
        let reader = new FileReader()
        reader.readAsDataURL(input.files[0])
        let file = input.files[0]
        console.log(file)
        reader.onload = ev => {
          input = undefined
        }
        let params = new FormData()
        params.append('file', file)
        this.$client
          .uploadPicture({ file: params }, '/api/ERPWeb/PartyHonor/UploadPicture')
          .then(req => {
            // console.log(req);
            if (req.head.result === '200') {
              let obj = {
                file_name: file.name,
                url: req.context
              }
              this.formData.images.push(obj)
            }
          })
      }
      input.click()
    },
    // // 上传文件
    // uploadUpdateSuccess(filesList) {
    //   // console.log(filesList)
    //   this.formData.files = filesList;
    // },
    // 判断文件大小
    beforeDocumentUpload(file) {
      console.log(file)
      if (file.raw.type.indexOf('video') > -1) {
        console.log(file)
        return true
      }
      const isLt1M = file.size / 1024 / 1024 < 20
      if (isLt1M) {
        return true
      }
      this.$message({ type: 'error', message: '请不要上载大小超过20M的文件', showClose: true })
      return false
    },
    // 上传文件
    handlePreview(file) {
      if (this.formData.files.length > 2) {
        this.$message({ type: 'warning', message: '最多只能上传三个文件', showClose: true })
        return
      }
      if (this.beforeDocumentUpload(file)) {
        this.uploadAccidentDataFiles(file)
      }
    },
    // 上传相关资料文件
    uploadAccidentDataFiles(file) {
      // let parmas ={
      //   file: file.row
      // };
      console.log(file.raw.type)

      // return
      if (file.raw.type.indexOf('video') > -1) {
        this.UpLoadFileBreakPointResume(file)
      } else {
        let formData = new FormData()
        formData.append('file', file.raw)

        let params = {
          file: formData
        }
        let fileName = file.name
        this.$client.uploadFilePassengerServiceManage(params).then(res => {
          if (res.head.result == '200') {
            let fileObj = {
              type: 2,
              file_name: fileName,
              url: res.context
            }
            this.formData.files.push(fileObj)
            this.$message({
              showClose: true,
              message: '上传成功',
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
      }
    },
    // 视频切片断点续传
    async UpLoadFileBreakPointResume(file) {
      console.log(file)
      let splitUploadSize = 10 * 1024 * 1024
      const { splitUpload, singleUpload } = this
      // console.log(file.size > splitUploadSize)
      const uploadFunc = file.size > splitUploadSize ? splitUpload : singleUpload
      try {
        await uploadFunc(file)
      } catch (e) {
        console.log(e)
      }
    },
    // 文件分块,利用Array.prototype.slice方法
    splitFile(file, eachSize, chunks) {
      const fileChunk = []
      for (let chunk = 0; chunks > 0; chunks--) {
        fileChunk.push(file.raw.slice(chunk, chunk + eachSize))
        chunk += eachSize
      }
      return fileChunk
    },
    // 大文件分块上传
    splitUpload(file) {
      return new Promise(async (resolve, reject) => {
        try {
          // console.log(1,file);
          const { eachSize } = this
          // console.log(eachSize)
          const chunks = Math.ceil(file.size / eachSize)
          //  console.log(chunks)
          const fileChunks = this.splitFile(file, eachSize, chunks)
          // console.log(fileChunks)
          let currentChunk = 0
          for (let i = 0; i < fileChunks.length; i++) {
            if (currentChunk === i) {
              let formData = new FormData()
              formData.append('file', fileChunks[i])
              formData.append('md5_code', file.uid)
              formData.append('merge_name', file.name)
              if (i < fileChunks.length - 1) {
                formData.append('is_last', false)
              } else {
                formData.append('is_last', true)
                // formData.append("merge_name", file.name);
              }

              let res = await this.UpLoadFileBreakPointResumeUpload(formData)
              if (res.head.result == '200') {
                console.log(res)
                if (currentChunk == fileChunks.length - 1) {
                  let fileObj = {
                    type: 2,
                    file_name: file.name,
                    url: res.context
                  }
                  this.formData.files.push(fileObj)
                  this.$message({
                    showClose: true,
                    message: '上传成功',
                    type: 'success'
                  })
                }
                currentChunk = i + 1
              } else {
                this.$message({
                  showClose: true,
                  message: res.head.describle,
                  type: 'error'
                })
              }
            }
          }
        } catch (e) {
          reject(e)
        }
      })
    },
    // 小文件直接上传
    singleUpload(file) {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData()
          formData.append('file', file.raw)
          formData.append('md5_code', file.uid)
          formData.append('is_last', true)
          formData.append('merge_name', file.name)
          let res = await this.UpLoadFileBreakPointResumeUpload(formData)
          if (res.head.result == '200') {
            console.log(res)
            let fileObj = {
              type: 2,
              file_name: file.name,
              url: res.context
            }
            this.formData.files.push(fileObj)
            this.$message({
              showClose: true,
              message: '上传成功',
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        } catch (e) {
          reject(e)
        }
      })
    },
    // 调用上传视频接口
    UpLoadFileBreakPointResumeUpload(formData) {
      return this.$client.UpLoadFileBreakPointResumeUpload(formData).then(res => res)
    },

    // 下载文件
    downloadDocument(item) {
      // console.log(item)
      window.location.href = item.url
      this.$message({ type: 'success', message: '下载成功' })
    },
    // 删除文件
    deleteDocument(item, index) {
      this.formData.files.splice(index, 1)
    },

    // 初始化数据
    resetData() {
      // 清空部门选中
      this.$refs.lineTree.onClear()
      this.$refs.driverTree.onClear()
      this.$refs.departmentTree.onClear()
      this.$refs.deptTree.onClear()
      this.isFirstLoad = false
    },
    // 数据回显
    setData(val) {
      Object.keys(this.formData).forEach(key => {
        if (Object.hasOwnProperty.call(val, key)) {
          this.formData[key] = val[key]
          if (key == 'cancel_star') {
            this.formData.cancel_star = val.cancel_star == 1 ? true : false
          }
        }
      })
      this.formData.c_violation_item = !this.formData.c_violation_item
        ? ''
        : this.formData.c_violation_item
      this.formData.c_source = !this.formData.c_source ? '' : this.formData.c_source
      this.source_name = val.source_type ? val.source_name : ''
      this.department_name = val.department
      console.log(val, 'sju', this.formData)
    },

    // 选择是否发起流程
    selectApprove(val) {
      if (val) {
        this.reqGetListFlowManage()
      } else {
        this.flowListOptions = []
        this.approveStepList = []
      }
    },
    // 选择流程
    selectedFlowId(val) {
      if (!val) {
        this.approveStepList = []
      }
    },
    // 获取流程列表
    reqGetListFlowManage() {
      let params = {
        object_id: 80,
        type: 2
      }
      this.$client.GetListFlowManage(params).then(res => {
        if (res.head.result == '200') {
          this.flowListOptions = res.context.list
        } else {
          this.flowListOptions = []
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 根据流程设计发起流程folw_code
    saveOnUsers(list) {
      this.approveStepList = list
      // this.submitApplyMembershipForm();
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.base-info{
  // overflow-y: scroll;
}

.base-info /deep/ .el-date-editor {
  width: 270px;
}

.base-info /deep/.el-select, .el-select--mini {
  width: 270px;
}

.base-info /deep/ .el-input, .el-input--mini {
  width: 270px;
}

.base-info /deep/ .el-textarea {
  // width: 620px;
}

.base-info /deep/ .el-tabs__content {
  // overflow: scroll;
}

.violation-info{
  height: 400px;
  overflow-y: scroll;
}

.list-data-list
  flex-wrap: wrap;
  align-items: center;
  .list-data
    // width: 450px
    overflow: hidden
  .item
    float: left
    width: 100px
    height: 100px
    margin: 5px
  .unchecked
    border-radius: 4px
    border: 2px dashed #606266
    text-align: center
    line-height: 130px
    &:hover
      border-color: #409EFF
      color: #409EFF

.document-content{
  padding: 0 4px 10px;
  margin-top: 10px;

  // width: 100%;
  >li{
    width: 60%;
    // padding: 8px 0;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid #19be6b;
    margin-bottom: 7px;
  }
}

.multiple-files-upload-content /deep/ .el-upload-list{
  display: none
}
</style>
