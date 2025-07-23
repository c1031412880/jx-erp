<template>
  <el-dialog 
    :visible="dialogBool" 
    :title="showTitle" 
    :before-close="dialogClose" 
    width="780px"  
    :append-to-body="true"
    :close-on-click-modal="false"
    top="20px"
  >
    <div>
      <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="140px"
    >
      <el-row>
        <el-col :span="24">
          <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
          <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">违章信息</p>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车牌号:" prop="i_vehicle_id">
            <get-vehicle-select-tree
              ref="vehicleTree"
              :placeholder="'选择车辆'"
              :isShowCheckbox="false"
              :isExportMultiple="false"
              @on-change="vehicleChange"
              v-model="formData.i_vehicle_id"
              :disabled="curChangeType=='detail'"
            >
            </get-vehicle-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属组织" prop="i_dept_id">
            <get-department-select
              ref="personalTree"
              v-model="formData.i_dept_id"
              :isShowCheckbox="false"
              :placeholder="'请选择所属组织'"
              :isContainEmp="false"
              :show_all="true"
              :isExportMultiple="false"
              :disabled="curChangeType=='detail'"
              @on-change="changeDept"
            ></get-department-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="线路:" prop="i_line_id">
            <get-line-select-tree
              ref="lineTree"
              :placeholder="'选择线路'"
              :isShowCheckbox="false"
              v-model="formData.i_line_id"
              :isExportMultiple="false"
              :width="'390'"
              :disabled="curChangeType=='detail'"
            >
            </get-line-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="违章时间:" prop="d_violation_date">
            <el-date-picker
              v-model="formData.d_violation_date"
              type="datetime"
              placeholder="选择日期"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              :disabled="curChangeType=='detail'">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属组织经办人:" prop="dept_handle">
            <el-select v-model="formData.dept_handle" multiple filterable placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in userData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="违章驾驶员:" prop="i_driver_id">
            <get-driver-select-tree
              ref="driverTree"
              v-model="formData.i_driver_id"
              :width="'390'"
              :isShowCheckbox="false"
              :placeholder="'请选择违章驾驶员'"
              :isExportMultiple="false"
              :disabled="curChangeType=='detail'"
            ></get-driver-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="违章地点:" prop="c_place">
            <el-input
              placeholder="请输入违章地点"
              v-model="formData.c_place"
              :disabled="curChangeType=='detail'"
              style="width: 300px;"
            ></el-input>
            <el-button v-if="curChangeType != 'detail'" type="primary" @click="openMap()" style="margin-left:15px;">地图自动获取</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交警处理结果:" prop="police_result">
            <el-select v-model="formData.police_result" :disabled="curChangeType=='detail'" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in handelData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="违章项目:" prop="d_violation_date">
            <el-select v-model="formData.i_violation_id" :disabled="curChangeType=='detail'" filterable placeholder="请选择" @change="changeViolation" style="width: 100%;">
              <el-option
                v-for="item in violationData"
                :key="item.i_id"
                :label="item.c_name"
                :value="item.i_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="违章扣分:" prop="score">
            <el-input v-model="formData.score" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="违章罚款:" prop="money">
            <el-input v-model="formData.money" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注:" prop="c_remark">
            <el-input v-model="formData.c_remark" :disabled="curChangeType=='detail'" type="textarea" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="margin-bottom: 20px">
          <image-file-upload
            :images="formData.evidences_img_list"
            :files="formData.evidences_files_list"
            :isEdit="curChangeType !='detail'"
            @files-update-success="filesUpdateEvidences"
            @images-update-success="imagesUpdateEvidences"></image-file-upload>
        </el-col>

        <el-col :span="24">
          <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
          <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">教育记录</p>
        </el-col>

        <el-col :span="12">
          <el-form-item label="教育时间:" prop="d_educate_time">
            <el-date-picker
              v-model="formData.d_educate_time"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :disabled="curChangeType=='detail'">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教育地点:" prop="c_educate_address">
            <el-input v-model="formData.c_educate_address" clearable :disabled="curChangeType=='detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教育人:" prop="i_educate_user">
            <get-department-select
              v-if="dialogBool"
              ref="personalTree2"
              v-model="formData.i_educate_user"
              :width="'220'"
              :isShowCheckbox="false"
              :placeholder="'请选择教育人'"
              :isContainEmp="true"
              :isExportMultiple="false"
              :disabled="curChangeType=='detail'"
            ></get-department-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="记录人:" prop="i_record_user">
            <get-department-select
              v-if="dialogBool"
              ref="personalTree3"
              v-model="formData.i_record_user"
              :width="'220'"
              :isShowCheckbox="false"
              :placeholder="'请选择记录人'"
              :isContainEmp="true"
              :isExportMultiple="false"
              :disabled="curChangeType=='detail'"
            ></get-department-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="扣除安全奖金额（元）:" prop="b_deduct_safe" label-width="160px">
            <el-input
              placeholder="请输入扣除安全奖金额"
              v-model="formData.b_deduct_safe"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.b_deduct_safe = $event.target.value"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="教育主要内容记录:" prop="c_educate_content">
            <el-input v-model="formData.c_educate_content" type="textarea" clearable :disabled="curChangeType=='detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="margin-bottom: 20px">
          <image-file-upload
            :images="formData.img_list"
            :files="formData.files_list"
            :isEdit="curChangeType !='detail'"
            @files-update-success="filesUpdateSuccess"
            @images-update-success="imagesUpdateSuccess"></image-file-upload>
        </el-col>
      </el-row>    
    </el-form>
    </div>
    <div slot="footer" class="dialog-footer" v-if="curChangeType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="submitFormData(3)" v-if="(formData.i_order_state != 3 && !isEdit) || curChangeType == 'add'">完 结</el-button>
      <el-button type="primary" @click="submitFormData(1)" v-if="curChangeType == 'add'">保存草稿</el-button>
      <el-button type="primary" @click="submitFormData(2)" v-if="formData.i_order_state != 2">下 发</el-button>
      <el-button type="primary" @click="submitFormData(formData.i_order_state)" v-if="isEdit">保 存</el-button>
    </div>

    <select-place-dialog ref="selectPlaceDialog" :dialogBool.sync="isShowSelectPlaceDialog" @save-place="savePlace"></select-place-dialog>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import selectPlaceDialog from "@/view/safe-manage/accident-manage/component/dialog/select-place-dialog";
import imageFileUpload from "@/components/imageFileUpload/index";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    selectPlaceDialog,
    imageFileUpload,
    getLineSelectTree,
    getVehicleSelectTree,
    getDriverSelectTree,
    getDepartmentSelect,
  },
  props: {
    dialogBool: Boolean,
    curChangeType: {
      type: String,
      default: 'add' //add添加  edit编辑  detail详情
    },
  },
  data() {
    return {
      showTitle: '',
      rules: {
        i_vehicle_id: [
          {
            required: true,
            message: "请选择车辆",
            trigger: "change",
          },
        ],
        i_dept_id: [
          {
            required: true,
            message: "请选择所属组织",
            trigger: "change",
          },
        ],
        // i_line_id: [
        //   {
        //     required: true,
        //     message: "选择线路",
        //     trigger: "change",
        //   },
        // ],
        d_violation_date: [
          {
            required: true,
            message: "选择违章时间",
            trigger: "change",
          },
        ],
        // dept_handle: [
        //   {
        //     required: true,
        //     message: "请选择所属组织经办人",
        //     trigger: "change",
        //   },
        // ],
        c_place: [
          {
            required: true,
            message: "请选择违章地点",
            trigger: "change",
          },
        ],
        d_violation_date: [
          {
            required: true,
            message: "请选择违章项目",
            trigger: "change",
          },
        ],
      },
      options: [],
      formData: {
        i_id: 0,
        i_vehicle_id: '',
        i_dept_id: '',
        i_line_id: '',
        d_violation_date: '',
        dept_handle: [],
        i_driver_id: '',
        c_place: '',
        i_violation_id: '',
        score: '',
        money: '',
        c_remark: '',
        evidences_img_list: [],
        evidences_files_list: [],
        d_educate_time: '',
        c_educate_address: '',
        i_educate_user: '',
        i_record_user: '',
        b_deduct_safe: '',
        c_educate_content: '',
        img_list: [],
        files_list: [],
        n_longitud: '',
        n_latitude: '',
        police_result: '',
        i_order_state: ''
      },
      violationData: [],
      isShowSelectPlaceDialog: false,
      userData: [],
      handelData: [
        {
          value: 1,
          label: '已处理'
        },
        {
          value: 2,
          label: '未处理'
        },
        {
          value: 3,
          label: '复议中'
        },
        {
          value: 4,
          label: '已复议'
        },
      ],
      isEcho: false,
      isEdit: false
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.resetData();
        Object.assign(this.$data, this.$options.data());
      }else{
        this.configAddStaffInfo();
        this.listViolationItem()
      }
    },
  },
  methods: {
    // 编辑时数据回显  
    setData(info,bool){
      this.isEcho = true
      this.isEdit = bool
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(info, key)) {
          this.formData[key] = info[key]
        }
      }
    },
    resetData() {
      this.$refs.vehicleTree.onClear()
      this.$refs.personalTree.onClear()
      this.$refs.lineTree.onClear()
      this.$refs.driverTree.onClear()
      this.$refs.personalTree2.onClear()
      this.$refs.personalTree3.onClear()
    },
    // 获取违章项目 
    listViolationItem() {
      let params = {
        page_index: 1,
        page_size: 9999
      }
      this.$client.listViolationItem(params)
        .then(res => {
          if (res.head.result == "200") {
            this.violationData = res.context.list;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    changeViolation() {
      this.violationData.forEach(item => {
        if (item.i_id == this.formData.i_violation_id) {
          this.formData.score = item.i_score
          this.formData.money = item.n_money
        }
      })
    },
    vehicleChange(vehs, nodes) {
      this.$client.GetVehicleInfoById({ id: this.formData.i_vehicle_id })
        .then((res) => {
          if (res.head.result == "200") {
            this.formData.i_line_id = res.context.line_id
            this.formData.i_dept_id = res.context.dept_id
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    changeDept(vehs, nodes) {
      if (!this.isEcho) {
        this.formData.dept_handle = []
        this.GetDeptUser()
      }else if (this.isEcho) {
        this.isEcho = false
        this.GetDeptUser()
      }
    },
    // 获取部门下的人员 
    GetDeptUser() {
      if (!this.formData.i_dept_id) {
        return
      }
      this.$client.GetDeptUser({dept_id:this.formData.i_dept_id})
        .then(res => {
          if (res.head.result == "200") {
            this.userData = res.context
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    // 打开地图
    openMap() {
      this.isShowSelectPlaceDialog = true
      if (this.curChangeType == 'edit') {
        let params = {
          id:"",
          address: this.formData.c_place,
          lon: this.formData.n_longitud,
          lat: this.formData.n_latitude,
        }
        this.$nextTick(() => {
          this.$refs.selectPlaceDialog.addPlace(params)
        })
      }
    },
    // 保存地点和经纬度
    savePlace(form) {
      this.formData.c_place = form.address.split('-')[0]
      this.formData.n_latitude = form.lat
      this.formData.n_longitud = form.lon
      this.isShowSelectPlaceDialog = false
    },

    configAddStaffInfo() {
      if(this.curChangeType == 'add') {
        this.showTitle = '添加';
      }else if(this.curChangeType == 'edit'){
        this.showTitle = '编辑'
      }else{
        this.showTitle = '详情'
      }
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    submitFormData(type) {
      if (type == 2 && this.formData.dept_handle.length == 0) {
        this.$message({
          showClose: true,
          message: '下发时请选择所属组织经办人',
          type: "warning",
        });
        return
      }
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          let info = {...this.formData};
          info.i_order_state = type
          this.$emit("sure-save-info",info);
        } else {
          return false;
        }
      });
    },
    // 上传图片
    imagesUpdateSuccess(val) {
      let list = []
      val.forEach(item => {
        let url = item.url ? item.url : item
        list.push(url)
      })
      this.formData.img_list = val
    },
    // 上传文件
    filesUpdateSuccess(filesList) {
      this.formData.files_list = filesList;
    },
    // 上传图片
    imagesUpdateEvidences(val) {
      let list = []
      val.forEach(item => {
        let url = item.url ? item.url : item
        list.push(url)
      })
      this.formData.evidences_img_list = val
    },
    // 上传文件
    filesUpdateEvidences(filesList) {
      this.formData.evidences_files_list = filesList;
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
