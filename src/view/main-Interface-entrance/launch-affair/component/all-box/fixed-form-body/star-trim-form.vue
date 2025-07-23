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
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" show-word-limit v-model="form.remark" :rows="4" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <div style="margin-bottom: 10px;">
          <span style="align-items: center; margin-right: 10px; color:#999999;">员工星级微调</span>
          <el-button size="mini" type="primary" @click="addRowData">添加</el-button>
        </div>
        <tr-table
          ref="dataTable"
          :data="form.changes"
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
              @on-change="(list, node) => {getDriverStar(list, node, scope.index)}"
            ></get-driver-select-tree>
          </template>
          <template slot-scope="scope" slot="old_star">
            <el-select v-model="scope.data.old_star" disabled clearable placeholder="请选择星级">
              <el-option label="无星级" :value="0"></el-option>
              <el-option label="一星级" :value="1"></el-option>
              <el-option label="二星级" :value="2"></el-option>
              <el-option label="三星级" :value="3"></el-option>
              <el-option label="四星级" :value="4"></el-option>
              <el-option label="五星级" :value="5"></el-option>
            </el-select>
          </template>
          <template slot-scope="scope" slot="new_star">
            <el-select v-model="scope.data.new_star" clearable placeholder="请选择星级">
              <el-option label="无星级" :value="0"></el-option>
              <el-option label="一星级" :value="1"></el-option>
              <el-option label="二星级" :value="2"></el-option>
              <el-option label="三星级" :value="3"></el-option>
              <el-option label="四星级" :value="4"></el-option>
              <el-option label="五星级" :value="5"></el-option>
            </el-select>
          </template>
          <template slot-scope="scope" slot="reason">
            <el-input v-model="scope.data.reason" placeholder="请输入申请理由"></el-input>
            <!-- type="textarea" show-word-limit -->
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
  </el-form>
</template>

<script type="text/ecmascript-6">
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import imageFileUpload from "@/components/imageFileUpload/index";
import { deepCopy } from '@/utils/index'; 
import { getUser } from '@/utils/auth';
// import common from './common/index'
export default {
  name: "star-trim-form",
  components: {
    getDepartmentSelect,
    getDriverSelectTree,
    imageFileUpload,
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
        // id: 0,
        user_id:null,
        dept_id:null,
        remark: '',
        changes: [],
        files_list: [],
        thumbnail_imgs: [],
      },
      canRendererTableHeader: [
        {
          id: 1,
          label: "驾驶员",
          prop: "driver_id",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "所属组织",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "考核周期",
          prop: "examine_circle",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "评星日期",
          prop: "evaluate_date",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "调整前星级",
          prop: "old_star",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "调整后星级",
          prop: "new_star",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "申请理由",
          prop: "reason",
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
          // console.log(userInfo);
          this.form.user_id = Number(userInfo.user_id);
          this.form.dept_id = Number(userInfo.department_id);
        }
      }
      this.oldForm = deepCopy(this.form)
      this.dateChange()
    },
    // 添加
    addRowData() {
      this.form.changes.push({driver_id: ''})
    },
    // 删除
    delRowData(index) {
      this.form.changes.splice(index, 1)
    },
    // 选择驾驶员
    getDriverStar(info, nodes, index) {
      console.log(info,nodes, index);
      if(info && info.length > 0) {
        let params = {context: {}}
        params.context.driver_id = info[0]
        params.context.page_index = 1
        params.context.page_size = 9999
        this.$client.GetRecordDriverStar(params)
        .then((res) => {
          if (res.head.result == "200") {
            let dataList = res.context.list
            console.log(dataList);
            
            if(dataList && dataList.length) {
              let obj = {
                driver_id: info[0],
                dept_name: dataList[0].dept_name,
                examine_circle: dataList[0].year_quarter,
                evaluate_date: dataList[0].last_star_time ? dataList[0].last_star_time : '',
                old_star: dataList[0].now_star,
                new_star: this.form.changes[index].new_star ? this.form.changes[index].new_star : '',
                reason: this.form.changes[index].reason ? this.form.changes[index].reason : '',
              }
              this.form.changes.splice(index, 1, obj)
              console.log(dataList,obj, this.form.changes);
            }else { 
              this.$message({
                showClose: true,
                message: '暂无该驾驶员星级记录，请重新选择',
                type: "warning",
              });
            }
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
          this.form.remark || 
          this.form.changes.length || 
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
            if(this.form.changes.length) {
              const hasDuplicateSampleTypeId = this.form.changes.some((item, index, array) => {
                return array.filter(innerItem => innerItem.driver_id === item.driver_id).length > 1;
              });
              if(hasDuplicateSampleTypeId) {
                reject({
                  msg: '驾驶员重复，请检查'
                });
                return false;
              }else {
                let empList = this.form.changes.filter(item =>  !item.driver_id || !item.new_star)
                if(empList.length) {
                  reject({
                    msg: '请选择驾驶员或调整后星级'
                  });
                }else {
                  resolve({
                    form: this.form
                  });
                }
              }
            }else {
              reject({
                msg: '请添加驾驶员星级调整明细'
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
