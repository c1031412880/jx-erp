<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="经办人" prop="user_id">
          <get-department-select
            ref="personalTree1"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择经办人'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
            :disabled="true"
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所在部门" prop="dept_id">
          <get-department-select
            ref="departmentTree"
            v-model="form.dept_id"
            :width="'220'"
            :isShowCheckbox="false"
            :placeholder="'请选择申请部门'"
            :isContainEmp="false"
            :isExportMultiple="false"
            :disabled="true"
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="考核年度" prop="assessment_year">
          <el-date-picker
            value-format="yyyy"
            type="year"
            placeholder="请选择考核年度"
            v-model="form.assessment_year"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <div style="margin-bottom: 10px;">
          <span style="align-items: center; margin-right: 10px; color:#999999;">行车安全优秀驾驶员</span>
          <el-button size="mini" type="primary" @click="addRowData">添加</el-button>
          <el-button size="mini" type="primary" @click="fileDialogVisible = true" icon="el-icon-download">导入</el-button>
        </div>
        <tr-table
          ref="dataTable"
          :data="form.details"
          :loading="false"
          :selectionShow="true"
          :TableHeight="300"
          :backFixedNum="1"
          :isShowBottomOptions="false"
          :tableHeaderList="canRendererTableHeader">
          <template slot-scope="scope" slot="driver_id">
            <get-driver-select-tree
              :ref="'driverTree' + scope.index"
              v-model="scope.data.driver_id"
              :isShowCheckbox="false"
              :placeholder="'请选择驾驶员'"
              :isExportMultiple="false"
              :isCheckStrictly="false"
              :size="'mini'"
              @on-change="(list, node) => {getDriverStar(list, node, scope.index)}"
            ></get-driver-select-tree>
          </template>
          <template slot-scope="scope" slot="driving_license_class">
            <el-input v-model="scope.data.driving_license_class" size="mini" placeholder="请输入准驾车型"></el-input>
          </template>
          <template slot-scope="scope" slot="line_id">
            <get-line-select-tree
              ref="lineTree"
              :placeholder="'请选择营运路线'"
              :isShowCheckbox="false"
              v-model="scope.data.line_id"
              :size="'mini'"
              :isExportMultiple="false">
            </get-line-select-tree>
          </template>
          <template slot-scope="scope" slot="vehicle_id">
            <get-vehicle-select-tree
              ref="vehicleTree"
              :placeholder="'选择车辆'"
              :isShowCheckbox="false"
              :codeAndName="true"
              :size="'mini'"
              v-model="scope.data.vehicle_id">
            </get-vehicle-select-tree>
          </template>
          <template slot-scope="scope" slot="driver_license_number">
            <el-input v-model="scope.data.driver_license_number" size="mini" placeholder="请输入驾驶证号"></el-input>
          </template>
          <template slot-scope="scope" slot="total_safe_km">
            <el-input v-model="scope.data.total_safe_km" size="mini" placeholder="请输入累计安全公里数"></el-input>
          </template>
          <template slot-scope="scope" slot="resume">
            <el-input v-model="scope.data.resume" size="mini" placeholder="请输入驾驶简历"></el-input>
          </template>
          <template slot-scope="scope" slot="operation">
            <el-button size="mini" type="danger" @click="delRowData(scope.index)">移除</el-button>
          </template>
        </tr-table>
      </el-col>
      <el-col :span="24" style="margin-top: 18px">
        <image-file-upload 
          :images="form.thumbnail_imgs"
          :files="form.files_list"
          @files-update-success="filesUpdateSuccess"
          @images-update-success="imagesUpdateSuccess"></image-file-upload>
      </el-col>
    </el-row>
    <file-dialog
      :dialogBool.sync="fileDialogVisible"
      :fileData="FileData"
      :typeMessage="'同名驾驶员'"
      @on-submit-excel="onSubmitExcel"
    ></file-dialog>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import imageFileUpload from "@/components/imageFileUpload/index";
import fileDialog from "@/components/fileDialog/file-dialog.vue";
import { deepCopy } from '@/utils/index'; 
import { getUser } from '@/utils/auth';
// import common from './common/index'
export default {
  name: "driving-excellent-driver-form",
  components: {
    getDepartmentSelect,
    getDriverSelectTree,
    imageFileUpload,
    getLineSelectTree,
    getVehicleSelectTree,
    fileDialog,
  },
  // mixins: [common],
  props: {
    dialogBool:{
      type: Boolean,
      default: false
    },
    isShowSelectUser: {
      type: Boolean,
      default: true
    },
    isAgain: {
      type: Boolean,
      default: false
    },
    formId: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      form: {
        id: 0,
        user_id:null,
        dept_id:null,
        assessment_year: new Date().getFullYear() + '',
        details: [],
        files_list: [],
        thumbnail_imgs: [],
      },
      fileDialogVisible: false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/行车安全优秀驾驶员模板.xlsx`,
      },
      canRendererTableHeader: [
        {
          id: 1,
          label: "驾驶员姓名",
          prop: "driver_id",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "准驾车型",
          prop: "driving_license_class",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "营运路线",
          prop: "line_id",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "驾驶员车辆号",
          prop: "vehicle_id",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "驾驶证号",
          prop: "driver_license_number",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "累计安全公里数",
          prop: "total_safe_km",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "驾驶简历",
          prop: "resume",
          width: "180",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "操作",
          prop: "operation",
          width: "180",
          align: "center",
          signIndex: 7,
        },
      ],
      oldForm: null, // 历史草稿数据   用来比较是否修改
      rules: {
        user_id: [
          {
            required: true,
            message: "请选择经办人",
            trigger: "change",
          },
        ],
        dept_id: [
          {
            required: true,
            message: "请选择所在部门",
            trigger: "change",
          },
        ],
        assessment_year: [
          {
            required: true,
            message: "请选择考核年度",
            trigger: "change",
          },
        ],
      },
    }
  },
  watch:{
    dialogBool() {
      if(!this.dialogBool) {
        this.$refs.personalTree1.onClear();
        this.$refs.departmentTree.onClear();
        Object.assign(this.$data.form, this.$options.data().form);
      }else{
        this.$nextTick(() => {
          this.$refs["form"].resetFields();
        })
      }
    }
  },
  methods: {
    // 初始化数据
    initSet(info){
      if (!!info) {
        for (const key in this.form) {
          if (Object.hasOwnProperty.call(info, key)) {
            this.form[key] = info[key];
          }
        }
      } else {
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          this.form.user_id = Number(userInfo.user_id);
          this.form.dept_id = Number(userInfo.department_id);
        }
      }
      this.oldForm = deepCopy(this.form)
      this.dateChange()
    },
    // 导入
    onSubmitExcel(val) {
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      this.$client.ImportElectricRecord(params)
      .then(res => {
        if(res.head.result == "200") {
          this.fileDialogVisible = false;
          let info = res.context;
          info.forEach(item => {
            this.form.details.push({
              driver_id: item.driver_id,
              driving_license_class: item.driving_license_class,
              line_id: item.line_id,
              vehicle_id: item.vehicle_id,
              driver_license_number: item.driver_license_number,
              total_safe_km: item.total_safe_km,
              resume: item.resume,
            })
          })
        }else{
          this.fileDialogVisible = false;
          let errorData = [];
          const h = this.$createElement;
          errorData.push(h('p',null,res.head.describle));
          this.$msgbox({
            title: '提示',
            message: h('div',null, errorData),
            confirmButtonText: '确定',
          })
        }
      })
    },
    // 添加
    addRowData() {
      this.form.details.push({driver_id: ''})
    },
    // 删除
    delRowData(index) {
      this.form.details.splice(index, 1)
    },
    // 选择驾驶员
    getDriverStar(info, nodes, index) {
      if(info && info.length > 0) {
        let params = {id: info[0]}
        this.$client.getDriverInfo(params)
        .then((res) => {
          if (res.head.result == "200") {
            let dataList = res.context;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {console.log(err); 
        });
      }
    },
    // 保存草稿时的校验   必填项只要有一个填了  即可保存草稿 
    saveDraft() {
      return new Promise((resolve,reject) => {
        // 判断是否有已填写项   只要有一个就可以走保存
        if (
          this.form.assessment_year || 
          this.form.details.length || 
          this.form.thumbnail_imgs.length || 
          this.form.files_list.length
        ) {
          resolve({
            form: this.form
          });
        }else {
          reject({
            msg: '必须填写一项必填项才可保存草稿'
          });
          return false;
        }
      })
    },
    // 合并表单值
    outData() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if(this.form.details.length) {
              const hasDuplicateSampleTypeId = this.form.details.some((item, index, array) => {
                return array.filter(innerItem => innerItem.driver_id === item.driver_id).length > 1;
              });
              if(hasDuplicateSampleTypeId) {
                reject({
                  msg: '驾驶员重复，请检查'
                });
                return false;
              }else {
                let empList = this.form.details.filter(item =>  !item.driver_id)
                if(empList.length) {
                  reject({
                    msg: '请选择驾驶员'
                  });
                }else {
                  resolve({
                    form: this.form
                  });
                }
              }
            }else {
              reject({
                msg: '请添加优秀驾驶员'
              });
              return false;
            }
          } else {
            reject({
              msg: '获取失败,带星号的为必填项'
            });
            return false;
          }
        });
      });
    },
    // 上传图片
    imagesUpdateSuccess(val) {
      let obj = ''
      let list = []
      val.forEach(item => {
        obj = {
          thumbnail_url: item.thumbnail_url ? item.thumbnail_url : null,
          url: item.url ? item.url : item,
        }
        list.push(obj)
      })
      this.form.thumbnail_imgs = list
    },
    // 上传文件
    filesUpdateSuccess(filesList) {
      this.form.files_list = filesList;
    },
    dateChange() {
      this.$emit('out-form', {
        form: this.form,
        code: this.formId
      })
    },
  },
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
</style>
