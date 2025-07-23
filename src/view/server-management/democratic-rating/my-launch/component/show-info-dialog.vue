<template>
  <el-dialog
    :visible="dialogBool"
    title="民主评分"
    width="760px"
    class="dialog-box"
    ref="dialog-box"
    center
    :before-close="dialogClose"
    top="10px">
    <div class="base-info">
      <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="经办人" prop="user_id">
              <get-department-select
                ref="personalTree"
                v-model="form.user_id"
                :isShowCheckbox="false"
                :placeholder="'请选择发送部门经办人'"
                :isContainEmp="true"
                :show_all="true"
                :isExportMultiple="false"
                :disabled="isShowSelectUser"
                @on-change="selectedUser"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在组织" prop="dept_id">
              <el-select v-model="form.dept_id" style="width:100%" @change="dateChange" placeholder="请选择发送部门">
                <el-option
                  v-for="item in deptList"
                  :key="item.dept_id"
                  :label="item.dept_name"
                  :value="item.dept_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评分季度" prop="score_year">
              <div style="display: flex;width: 100%;">
                <el-date-picker
                  v-model="form.score_year"
                  value-format="yyyy"
                  format="yyyy"
                  type="year"
                  placeholder="选择年">
                </el-date-picker>
                <el-select v-model="form.score_season" placeholder="请选择季度">
                  <el-option
                    v-for="item in quarterList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评分时间" prop="score_date_start">
              <el-date-picker
                v-model="date"
                type="daterange"
                start-placeholder="选择开始日期"
                end-placeholder="选择结束日期"
                range-separator="至"
                value-format="yyyy-MM-dd"
                @change="selectedTime"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评分人" prop="score_person_ids">
              <get-department-select
                ref="personalTree"
                v-model="form.score_person_ids"
                :isShowCheckbox="true"
                :placeholder="'请选择评分人'"
                :isContainEmp="true"
                :isExportMultiple="true"
                :isCheckStrictly="false"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="被评分驾驶员" prop="driver_ids">
              <get-driver-select-tree
                ref="personalTree2"
                v-model="form.driver_ids"
                :isShowCheckbox="true"
                :placeholder="'请选择驾驶员'"
                :isExportMultiple="true"
                :isCheckStrictly="false"
              ></get-driver-select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark" :rows="4" placeholder="请输入盖章内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 20px">
            <image-file-upload 
              :images="form.thumbnail_imgs"
              :files="form.files_list"
              @files-update-success="filesUpdateSuccess"
              @images-update-success="imagesUpdateSuccess"></image-file-upload>
          </el-col>
        </el-row>
        <el-card style="margin-top: 10px;max-height: 330px;overflow: auto">
          <approve-step 
            ref="approveStep"
            :key="key" 
            @on-users="setUsers" 
            :form_data="form_data" 
            :object_id="7000">
          </approve-step>
        </el-card>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="saveForm(1)">保存草稿</el-button>
      <el-button type="primary" @click="saveForm(2)">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import imageFileUpload from "@/components/imageFileUpload/index";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import approveStep from '@/components/approve-echo/approve-step2'
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import { getUser } from "@/utils/auth";
export default {
  components: {
    imageFileUpload,
    getDepartmentSelect,
    approveStep,
    getDriverSelectTree
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      form: {
        user_id:null,
        dept_id:null,
        score_year: '',
        score_season: '1',
        score_date_start: '',
        score_date_end: '',
        score_person_ids: [],
        driver_ids: [],
        remark: '',
        files_list: [],
        thumbnail_imgs: [],
        id: 0
      },
      date: [],
      deptList: [],
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
        score_year: [
          {
            required: true,
            message: "请选择评分季度",
            trigger: "change",
          },
        ],
        score_date_start: [
          {
            required: true,
            message: "请选择评分时间",
            trigger: "change",
          },
        ],
        driver_ids: [
          {
            required: true,
            message: "请选择被评分驾驶员",
            trigger: "change",
          },
        ],
      },
      loading: false,
      dept_id: null,
      changeNum: 0,
      quarterList: [
        {
          label: '第一季度',
          value: '1'
        },
        {
          label: '第二季度',
          value: '2'
        },
        {
          label: '第三季度',
          value: '3'
        },
        {
          label: '第四季度',
          value: '4'
        }
      ],
      key: null,
      isShowSelectUser: false,
      form_data: null,
      nodes: null,
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.$refs.personalTree.onClear();
        this.$refs.personalTree2.onClear();
        Object.assign(this.$data, this.$options.data());
      } else {
      }
    },
  },
  methods: {
    // 初始化数据
    initSet(info) {
      if (!!info) {
        for (const key in this.form) {
          if (Object.hasOwnProperty.call(info, key) && key != 'dept_id') {
            this.form[key] = info[key];
          }
        }
        this.dept_id = JSON.parse(JSON.stringify(info.dept_id))
        this.date = [info.score_date_start,info.score_date_end]
      } else {
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          this.form.user_id = Number(userInfo.user_id);
          this.dept_id = Number(userInfo.department_id);
        }
      }
    },
    // 修改时间
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.score_date_start = this.date[0];
        this.form.score_date_end = this.date[1] + ' 23:59:59'
      } else {
        this.form.score_date_start = "";
        this.form.score_date_end = "";
      }
    },
    // 根据用户id获取是否可以代他人提交
    getBehalfHandle() {
      let params = { form_id : 7000}
      this.$client.GetBehalfByIdFlowManage(params).then(res => {
        if(res.head.result == '200') {
          this.isShowSelectUser = !res.context
        }
      })
    },
    // 选择人员后获取部门信息
    async selectedUser(userIds, nodes,parentNode) {
      let dept_id = null
      this.changeNum ++ 
      if (this.changeNum > 1) {
        if(userIds.length > 0 && !!parentNode) {
          dept_id = parentNode.i_id
        }
      } else {
        // 若有草稿  则部门为草稿中部门   若无草稿 则为主部门
        dept_id = this.dept_id
      }
      
      this.deptList = await this.GetUserDept(this.form.user_id)
      this.form.dept_id = dept_id
      this.dateChange()
    },
    GetUserDept(user_id) {
      return this.$client.GetUserDept({user_id}).then(res => res.context)
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 合并表单值
    outData() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            resolve({
              form: this.form
            });
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
      this.form_data = this.form
      this.key = new Date().getTime()
    },
    // 接收流程节点
    setUsers(data) {
      this.nodes = data
    },
    // 保存草稿
    saveDraftApply() {
      this.check().then(res => {
        let formData = res.form
        this.saveDraft(formData)
      }).catch(err => {
        console.log(err);
        this.$message({
          showClose: true,
          message: err.msg,
          type: "warning",
        });
      })
    },
    // 保存草稿时的校验   必填项只要有一个填了  即可保存草稿   除申请人和申请部门
    check() {
      return new Promise((resolve,reject) => {
        let data = []
        for (const key in this.rules) {
          if (key != "user_id" && key != "dept_id") {
            data.push(key)
          }
        }
        let validList = []
        this.$refs.form.validateField(data,(valid) =>{
          validList.push(valid)
        })
        // 判断是否有已填写项   只要有一个就可以走保存
        if (validList.includes('')) {
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
    // 保存草稿
    saveDraft(formData) {
      let params = {
        type: 7000,
        data: formData
      }
      this.$emit('save-draft',params)
    },
    // 提交 
    saveForm(type) {
      this.outData().then(res => {
        let formData = res.form
        formData.data_state = type
        let data = JSON.parse(JSON.stringify(this.nodes)) 
        this.$emit('save-form',formData,data)
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.msg,
          type: "warning",
        });
      })
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.richText {
  width: 100%;
  /deep/ {
    .el-textarea__inner {
      background-color: #fff; 
      border: none;
      cursor: auto;
      padding: 0;
    }
  }
}
</style>


