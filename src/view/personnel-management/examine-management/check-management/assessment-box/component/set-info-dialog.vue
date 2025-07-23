<template>
  <el-dialog
    :visible="dialogBool"
    title="添加考核"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    append-to-body
    width="80%"
    top="20px"
  >
    <div class="base-info">
      <el-form
        ref="form"
        size="mini"
        :model="form"
        :rules="rules"
        label-suffix=":"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="经办人" prop="user_id">
              <get-department-select
                ref="personalTree1"
                v-model="form.user_id"
                :isShowCheckbox="false"
                :placeholder="'请选择经办人'"
                :isContainEmp="true"
                :show_all="true"
                :isExportMultiple="false"
                :disabled="isShowSelectUser"
                @on-change="selectedUser"
                v-if="dialogBool"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在部门" prop="dept_id">
              <el-select
                v-model="form.dept_id"
                style="width: 100%"
                placeholder="请选择所在部门"
              >
                <el-option
                  v-for="item in deptList"
                  :key="item.dept_id"
                  :label="item.dept_name"
                  :value="item.dept_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="考核名称" prop="exam_name">
              <el-input
                style="width: 100%"
                v-model="form.exam_name"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="考核类型" prop="exam_type">
              <el-select
                v-model="form.exam_type"
                style="width: 100%"
                placeholder="请选择考核类型"
                @change="changeExam"
              >
                <el-option
                  v-for="item in examList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8" v-if="form.exam_type == 1">
            <el-form-item label="考核日期" prop="date">
              <el-date-picker
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择考核日期"
                v-model="form.date"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.exam_type == 2">
            <el-form-item label="考核日期" prop="date">
              <el-date-picker
                value-format="yyyy-MM"
                type="month"
                placeholder="选择考核日期"
                v-model="form.date"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.exam_type == 3">
            <el-form-item label="考核日期" prop="date">
              <el-select
                v-model="form.date"
                style="width: 100%"
                placeholder="请选择考核日期"
              >
                <el-option
                  v-for="item in quarterList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.exam_type == 4">
            <el-form-item label="考核日期" prop="date">
              <el-date-picker
                value-format="yyyy"
                type="year"
                placeholder="选择考核日期"
                v-model="form.date"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>


          <el-col :span="8">
            <el-form-item label="考核开始时间" prop="start_time">
              <el-date-picker
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择考核开始时间"
                v-model="form.start_time"
                style="width: 100%"
                @change="changeTime"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="考核结束时间" prop="end_time">
              <el-date-picker
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择考核结束时间"
                v-model="form.end_time"
                style="width: 100%"
                @change="changeTime"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="被考核对象" prop="exam_obj">
              <el-select
                v-model="form.exam_obj"
                style="width: 100%"
                @change="dateChange"
                placeholder="请选择被考核对象"
                disabled
              >
                <el-option
                  v-for="item in objectList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="被考核部门" prop="exam_dept">
              <get-department-select
                ref="personalTree2"
                v-model="form.exam_dept"
                :isShowCheckbox="false"
                :placeholder="'请选被考核部门'"
                :isContainEmp="false"
                :isExportMultiple="false"
                @on-change="selectedDept"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.exam_obj == 1">
            <el-form-item label="被考核人员" prop="exam_user_ids">
              <el-select
                v-model="form.exam_user_ids"
                style="width: 100%"
                placeholder="请选择被考核人员"
                multiple
                filterable 
              >
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8" v-if="form.exam_obj == 2">
            <el-form-item label="被考核人员" prop="exam_user_ids">
              <get-department-select
                ref="personalTree3"
                v-model="form.exam_user_ids"
                :isShowCheckbox="false"
                :placeholder="'请选择被考核人员'"
                :isContainEmp="true"
                :show_all="false"
                :isExportMultiple="false"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核人" prop="exam_checks">
              <get-department-select
                ref="personalTree4"
                v-model="form.exam_checks"
                :isShowCheckbox="true"
                :placeholder="'请选择审核人'"
                :isContainEmp="true"
                :show_all="false"
                :isCheckStrictly="false"
                :isExportMultiple="true"
                v-if="dialogBool"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.exam_obj == 2">
            <el-form-item label="是否允许员工自评" prop="user_id">
              <el-radio-group v-model="form.aaa" style="width: 100%">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.exam_obj == 2 && form.aaa == 1">
            <el-form-item label="考核成绩组成" prop="user_id">
              <div style="display: flex">
                <span>自评分</span>
                <el-input v-model="form.aa" clearable></el-input>
                <span>%+审核人评分</span>
                <el-input v-model="form.aa" clearable></el-input>
                <span>%</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="考核说明" prop="remark">
              <el-input
                type="textarea"
                v-model="form.remark"
                :rows="4"
                placeholder="请输入考核说明"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="table-box">
            <div style="display: flex;align-items:center;margin-bottom:15px">
              <!-- <h2 style="margin-right:10px">选择考核模板</h2> -->
              <el-form-item label="选择考核模板" prop="temp_id" label-width="120px" style="margin:0">
                <el-select v-model="form.temp_id" placeholder="请选择" style="margin-right:10px" @change="saveTemplate()">
                  <el-option
                    v-for="item in organizationTreeList"
                    :key="item.id"
                    :label="item.temp_name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-button type="primary" size="small" @click="preview()">预览</el-button>
              <el-button type="primary" size="small" @click="onExport()">导出</el-button>
            </div>
            <tr-table
              :loading="loading"
              ref="table"
              :data="tableList"
              :tableHeaderList="tableHeaderList"
              :isShowSummary="true"
              :omitColumnIndex='[1,2,3,5,6,7,8]'
              :rowspanObj="rowspanObj"
              :mergekeys="mergekeys"
              :spanMethodType="['column']"
              :TableHeight="300">
            </tr-table>
          </el-col>
          <el-col :span="24" style="margin-top: 20px">
            <image-file-upload
              :images="imgs"
              :files="files"
              @files-update-success="filesUpdateSuccess"
              @images-update-success="imagesUpdateSuccess"
            ></image-file-upload>
          </el-col>
        </el-row>
      </el-form>
      <!-- 流程节点显示 -->
      <el-card style="margin-top: 10px;max-height: 330px;overflow: auto">
        <approve-step 
          ref="approveStep"
          :key="key" 
          @on-users="setUsers" 
          :form_data="form_data" 
          :object_id="5220">
        </approve-step>
      </el-card>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form',1)" size="mini"
        >提 交</el-button>
      <el-button type="primary" @click="updatePlaybill('form',0)" size="mini"
      >保存草稿</el-button>
    </span>
    
    <el-dialog
      ref="previewDialog"
      title="预览"
      :visible.sync="previewDialogVisible"
      :append-to-body="true"
      fullscreen>
      <tr-table
        :loading="loading"
        ref="table"
        :data="tableList"
        :tableHeaderList="tableHeaderList"
        :isShowSummary="true"
        :omitColumnIndex='[1,2,3,5,6,7,8]'
        :rowspanObj="rowspanObj"
        :mergekeys="mergekeys"
        :spanMethodType="['column']"
        :TableHeight="previewHeight"
        >
      </tr-table>
    </el-dialog>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import imageFileUpload from "@/components/imageFileUpload/index";
import approveStep from '@/components/approve-echo/approve-step2'
import { getUser } from '@/utils/auth';
import { formatDate } from '@/utils/index'
export default {
  components: {
    getDepartmentSelect,
    imageFileUpload,
    getSelectDictionaries,
    approveStep
  },
  props: {
    dialogBool: Boolean,
    curSelecedType: [String],
  },
  data() {
    return {
      form: {
        user_id: "",
        dept_id: "",
        exam_name: "",
        exam_type: "",
        start_time: "",
        end_time: "",
        exam_obj: 1,
        exam_dept: "",
        exam_user_ids: [],
        exam_checks: [],
        remark: "",
        date: '',
        img_ids: [],
        file_ids: [],
        id: 0,
        temp_id: ''
      },
      rules: {
        user_id: [
          { required: true, message: "请选择经办人", trigger: "change" },
        ],
        dept_id: [
          { required: true, message: "请选择所在部门", trigger: "change" },
        ],
        exam_name: [
          { required: true, message: "请输入考核名称", trigger: "change" },
        ],
        exam_type: [
          { required: true, message: "请选择考核类型", trigger: "change" }
        ],
        start_time: [
          { required: true, message: "请选择考核开始时间", trigger: "change" },
        ],
        end_time: [
          { required: true, message: "请选择考核结束时间", trigger: "change" },
        ],
        exam_obj: [
          { required: true, message: "请选择被考核对象", trigger: "change" },
        ],
        exam_dept: [
          { required: true, message: "请选择被考核部门", trigger: "change" },
        ],
        exam_user_ids: [
          { required: true, message: "请选择被考核人员", trigger: "change" },
        ],
        exam_checks: [
          { required: true, message: "请选择审核人", trigger: "change" },
        ],
        temp_id: [
          { required: true, message: "请选择考核模板", trigger: "change" },
        ],
      },
      showTitle: "",
      files: [],
      imgs: [],
      deptList: [],
      dept_id: '',

      objectList: [
        {
          label: "部门",
          value: 1,
        },
        {
          label: "个人",
          value: 2,
        },
      ],
      examList: [
        {
          label: "日考核",
          value: 1,
        },
        {
          label: "月考核",
          value: 2,
        },
        {
          label: "季度考核",
          value: 3,
        },
        {
          label: "年度考核",
          value: 4,
        },
      ],
      quarterList: [
        {
          label: "一季度",
          value: "一季度",
        },
        {
          label: "二季度",
          value: "二季度",
        },
        {
          label: "三季度",
          value: "三季度",
        },
        {
          label: "四季度",
          value: "四季度",
        },
      ],
      loading: false,
      tableList: [],
      tableHeaderList: [
        {
          id: 1,
          label: "指标分类",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "考核内容",
          prop: "content",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "指标值及要求",
          prop: "demand",
          width: "200",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "分值",
          prop: "score",
          width: "100",
          align: "center",
          signIndex: 3,
          nestedTablesHeader: [
            {
              id: 101,
              label: "明细",
              prop: "score",
              width: "100",
              align: "center",
              signIndex: 100,
            },
            {
              id: 102,
              label: "合计",
              prop: "total_score",
              width: "100",
              align: "center",
              signIndex: 101,
            },
          ]
        },
        {
          id: 5,
          label: "考核标准",
          prop: "standard",
          width: "200",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 5,
        },
      ],
      rowspanObj: {},
      mergekeys: ['group_id','group_name','total_score'],

      userList: [],
      organizationTreeList: [],
      form_data: null,
      key: null,
      previewDialogVisible: false,
      previewHeight: 500,
      isShowSelectUser: true,

      isEdit: false
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        // this.$refs.personalTree1.onClear()
        this.$refs.personalTree2.onClear()
        // this.$refs.personalTree4.onClear()
        if (this.form.exam_obj == 2) {
          this.$refs.personalTree3.onClear()
        }
      } else {
        let year = formatDate(new Date(),'yyyy')
        this.quarterList.forEach(item => {
          item.value = `${year}年${item.value}`
          item.label = `${year}年${item.label}`
        })
        this.configTitle();
        this.getBehalfHandle()
        this.getTemplateTree()
      }
    },
  },
  mounted() {},
  methods: {
    // 初始化数据
    initSet(info,type) {
      if (!!info) {
        this.isEdit = true
        for (const key in this.form) {
          if (Object.hasOwnProperty.call(info, key)) {
            this.form[key] = info[key];
          }
        }
        this.dept_id = JSON.parse(JSON.stringify(info.dept_id))


        console.log(this.form);
        // // 做一下延迟来确保回显
        // setTimeout(() => {
        //   this.form.exam_user_ids = info.exam_user_ids
        // }, 500);
        this.files = info.files
        this.imgs = info.imgs
        if (type == 'copy') {
          this.form.id = 0
        }
        if (this.form.temp_id) {
          // 如果是历史记录id   则不显示
          if (info.temp_is_delete === 1) {
            this.form.temp_id = ''
            //  稍微做点延迟  在dialog 出来以后显示
            setTimeout(() => {
              this.$message({
                showClose: true,
                message: '该模板已被删除，请选择最新考核模板。',
                type: "warning",
              });
            }, 500);
            return
          }
          this.saveTemplate()
        }
      } else {
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          this.form.user_id = Number(userInfo.user_id);
          this.dept_id = Number(userInfo.department_id);
        }
      }
    },
    // 根据用户id获取是否可以代他人提交
    getBehalfHandle() {
      let params = { form_id : 5220}
      this.$client.GetBehalfByIdFlowManage(params).then(res => {
        if(res.head.result == '200') {
          this.isShowSelectUser = !res.context
        }
      })
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      if (this.curSelecedType == "add") {
        this.showTitle = "添加考核内容";
      } else {
        this.showTitle = "编辑考核内容";
      }
    },
    updatePlaybill(formName,type) {
      let info = JSON.parse(JSON.stringify(this.form));
      let data = JSON.parse(JSON.stringify(this.nodes)) 

      if (this.imgs.length > 0) {
        info.img_ids = this.imgs.map(item => {return item.id})
      }

      if (this.files.length > 0) {
        info.file_ids = this.files.map(item => {return item.id})
      }

      if (type == 0) {
        info.flow_state = type
        let params = {
          form_data: info,
          step_data: data
        }
        this.$emit("save-add-edit", params);
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            if (this.imgs.length > 0) {
              info.img_ids = this.imgs.map((item) => {
                return item.id;
              });
            }

            if (this.files.length > 0) {
              info.file_ids = this.files.map((item) => {
                return item.id;
              });
            }

            info.flow_state = type
            let params = {
              form_data: info,
              step_data: data
            }
            this.$emit("save-add-edit", params);
          } else {
            return false;
          }
        });
      }
    },
    // 上传图片
    imagesUpdateSuccess(list) {
      this.imgs = list;
    },
    // 上传文件
    filesUpdateSuccess(filesList) {
      this.files = filesList;
    },
    // 获取考核模板分类
    getTemplateTree() {
      this.$client.GetAllAssessModel()
      .then(res => {
        if (res.head.result == "200") {
          this.organizationTreeList = res.context;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    // 选择考核模板
    saveTemplate(){
      this.loading = true
      let params = {
        temp_id: this.form.temp_id,
        page_index: 1,
        page_size: 999
      }
      this.$client.GetAssessModelContentByPage(params)
      .then(res => {
        if (res.head.result == "200") {
            this.tableList = res.context.list;
            this.getSpanObj()
            this.loading = false
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {
        this.loading = false
      })
    },
    // 预览
    preview() {
      this.previewDialogVisible = true
      this.$nextTick(() => {
        this.previewHeight = this.$refs.previewDialog.$el.offsetHeight - 70
      })
    },
    // 导出
    onExport() {
      if (!this.form.temp_id) {
        this.$message({ type: "warning", message: "请选择考核模板" });
        return
      }
      let params = {
        temp_id: this.form.temp_id
      }
      this.$client.ExportAssessModel(params).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        }else{
          this.$message({ type: "warning", message: "暂无可导出内容" });
        }
        
      });
    },
    getSpanObj() {
      this.rowspanObj = this.$handleTableSpan(this.mergekeys, this.tableList,'group_id',true)
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
    // 选择部门查询  部门下的人员
    selectedDept() {
      if (!this.form.exam_dept) {
        return
      }
      if (!this.isEdit) {
        this.form.exam_user_ids = []
      }
      this.$client.getEmployeeManageList({i_department_base: [this.form.exam_dept]}).then(res => {
        if (res.head.result == "200") {
          this.userList = res.context.list
          this.isEdit = false
        }else {
          this.userList = []
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 日期大小校验
    changeTime() {
      if (new Date(this.form.end_time).getTime() < new Date(this.form.start_time).getTime()) {
        this.form.start_time = ''
        this.$message({
          showClose: true,
          message: '考核结束时间不能小于开始时间',
          type: "warning",
        });
      }
    },
    // 流程
    dateChange() {
      if (!this.dialogBool) {
        return
      }
      this.form_data = this.form
      this.key = new Date().getTime()
    },
    // 接收流程节点
    setUsers(data) {
      this.nodes = data
    },
    changeExam() {
      switch (this.form.exam_type) {
        case 1:
          this.form.date = formatDate(new Date(),'yyyy-MM-dd')
          break;
        case 2:
          this.form.date = formatDate(new Date(),'yyyy-MM')
          break;
        case 3:
          this.form.date = ''
          break;
        case 4:
          this.form.date = formatDate(new Date(),'yyyy')
          break;
        default:
          break;
      }

    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 400px;
  overflow-y: scroll;
}

.dialog-box /deep/ .el-dialog{
  height: 90%;
}

.dialog-box /deep/ .el-dialog__body {
  height: calc(100% - 20px);
}
</style>


