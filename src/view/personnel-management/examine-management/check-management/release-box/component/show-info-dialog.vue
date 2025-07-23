<template>
  <el-dialog
    :visible="dialogBool"
    title="考核人员详情"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    center
    append-to-body
    width="80%"
    top="20px"
  >
    <div class="base-info">
      <el-form
        ref="form"
        size="mini"
        :model="form"
        label-suffix=":"
      >
        <div style="display:flex">
          <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div> 
          <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">基本信息</p>
          <div style="margin-left:auto;font-weight: bold;font-size: 24px;">考核总得分: {{form.exam_score}}</div>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="经办人" prop="user_id">
              <span>{{form.user_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在部门" prop="dept_id">
              <span>{{form.user_dept_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="考核名称" prop="exam_name">
              <span>{{form.exam_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="考核类型" prop="exam_type">
              <span>{{form.exam_type_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="考核日期" prop="exam_type">
              <span>{{form.date}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="考核开始时间" prop="start_time">
              <span>{{form.start_time}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="考核结束时间" prop="end_time">
              <span>{{form.end_time}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="被考核对象" prop="exam_obj">
              <span>{{form.exam_obj_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="被考核部门" prop="exam_dept">
              <span>{{form.exam_dept_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="被考核人员" prop="exam_user_ids">
              <span>{{form.exam_user_names}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核人" prop="exam_checks">
              <span>{{form.exam_check_names}}</span>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8" v-if="form.exam_obj == 2">
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
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="考核说明" prop="remark">
              <el-input autosize type="textarea" class="richText" disabled v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="table-box">
            <div style="display: flex;align-items:center;margin-bottom:5px">
              <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div> 
              <p style="margin:0 15px;color:#409EFF;font-size:16px;font-weight:bold">考核详情</p>
              <el-button type="primary" size="mini" @click="preview()">预览</el-button>
              <el-button v-if="curSelecedType == 'detail'" type="primary" size="mini" @click="onExport()">导出</el-button>
            </div>
            <tr-table
              :loading="loading"
              class="tableBox"
              ref="tableBox"
              :data="tableList"
              :tableHeaderList="tableHeaderList"
              :isShowSummary="true"
              :omitColumnIndex='[1,2,3,5,6,7,9,10,11,12,13,15,16]'
              :rowspanObj="rowspanObj"
              :mergekeys="mergekeys"
              :spanMethodType="['column']"
              :TableHeight="300">
              <template slot-scope="scope" slot="exam_score">
                <div v-if="curSelecedType == 'detail' || curSelecedType == 'check'">
                  {{scope.data.exam_score}}
                </div>
                <div v-else>
                  <el-input 
                  v-model="scope.data.exam_score" 
                  clearable 
                  @change="changeScore(scope.data,scope.index)"
                  oninput="value=value.replace(/[^\d.-]/g,'')" 
                  @blur="scope.data.exam_score = $event.target.value"
                  ></el-input>
                </div>
              </template>
              <template slot-scope="scope" slot="exam_score_remark">
                <div v-if="curSelecedType == 'detail' || curSelecedType == 'check'">
                  {{scope.data.exam_score_remark}}
                </div>
                <div v-else>
                  <el-input v-model="scope.data.exam_score_remark" clearable></el-input>
                </div>
              </template>
              <template slot-scope="scope" slot="exam_files">
                <el-upload
                  v-if="curSelecedType == 'edit'"
                  class="upload-demo"
                  ref="uploadDocomnet"
                  action="string"
                  :on-change="(file => {return handlePreview(file,scope.index)})"
                  accept=".rar,.zip,.doc,.docx,.pdf,.png,.jpg"
                  :show-file-list="false"
                  :auto-upload="false">
                  <el-button slot="trigger" size="small" type="text">选择文件</el-button>
                </el-upload>
                <div v-for="(item,index) in scope.data.exam_files" :key="index">
                  <div style="display:flex;align-items:center">
                    <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                      <div @click="downloadDocument(item)" style="color:#409EFF;flex:1;cursor: pointer;">{{item.name}}</div>
                    </el-tooltip>
                    <i class="el-icon-delete" v-if="curSelecedType == 'edit'" style="color:red;width:50px;cursor: pointer;" @click="deleteDocument(scope.index,index)"></i>
                  </div>
                </div>
              </template>
              <template slot-scope="scope" slot="appeal_files">
                <div v-if="scope.data.appeal_files.length == 0"></div>
                <div v-else v-for="(item,index) in scope.data.appeal_files" :key="index">
                  <div style="display:flex;align-items:center">
                    <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                      <div @click="downloadDocument(item)" style="color:#409EFF;flex:1;cursor: pointer;">{{item.name}}</div>
                    </el-tooltip>
                  </div>
                </div>
              </template>
              <template slot-scope="scope" slot="deal_files">
                <div v-if="scope.data.deal_files.length == 0"></div>
                <div v-else v-for="(item,index) in scope.data.deal_files" :key="index">
                  <div style="display:flex;align-items:center">
                    <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                      <div @click="downloadDocument(item)" style="color:#409EFF;flex:1;cursor: pointer;">{{item.name}}</div>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </tr-table>
          </el-col>
          <el-col :span="24" style="margin-top: 20px">
            <image-file-upload
              :images="form.imgs"
              :files="form.files"
              :isShowBox="false"></image-file-upload>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" v-if="curSelecedType == 'edit' || curSelecedType == 'check'">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill()" size="mini"
        >确 认</el-button>
    </span>
    
    <el-dialog
      ref="previewDialog"
      title="预览"
      :visible.sync="previewDialogVisible"
      :append-to-body="true"
      fullscreen>
        <tr-table
          ref="table"
          :data="tableList"
          :tableHeaderList="tableHeaderList"
          :isShowSummary="true"
          :omitColumnIndex='[1,2,3,5,6,7,9,10,11,12,13,15,16]'
          :rowspanObj="rowspanObj"
          :mergekeys="mergekeys"
          :spanMethodType="['column']"
          :TableHeight="previewHeight">
          <template slot-scope="scope" slot="exam_score">
            <div v-if="curSelecedType == 'detail' || curSelecedType == 'check'">
              {{scope.data.exam_score}}
            </div>
            <div v-else>
              <el-input 
              v-model="scope.data.exam_score" 
              clearable 
              @change="changeScore(scope.data,scope.index)"
              oninput="value=value.replace(/[^\d.-]/g,'')" 
              @blur="scope.data.exam_score = $event.target.value"
              ></el-input>
            </div>
          </template>
          <template slot-scope="scope" slot="exam_score_remark">
            <div v-if="curSelecedType == 'detail' || curSelecedType == 'check'">
              {{scope.data.exam_score_remark}}
            </div>
            <div v-else>
              <el-input v-model="scope.data.exam_score_remark" clearable></el-input>
            </div>
          </template>
          <template slot-scope="scope" slot="exam_files">
            <el-upload
              v-if="curSelecedType == 'edit'"
              class="upload-demo"
              ref="uploadDocomnet"
              action="string"
              :on-change="(file => {return handlePreview(file,scope.index)})"
              accept=".rar,.zip,.doc,.docx,.pdf,.png,.jpg"
              :show-file-list="false"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="text">选择文件</el-button>
            </el-upload>
            <div v-for="(item,index) in scope.data.exam_files" :key="index">
              <div style="display:flex;align-items:center">
                <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                  <div @click="downloadDocument(item)" style="color:#409EFF;flex:1;cursor: pointer;">{{item.name}}</div>
                </el-tooltip>
                <i class="el-icon-delete" v-if="curSelecedType == 'edit'" style="color:red;width:50px;cursor: pointer;" @click="deleteDocument(scope.index,index)"></i>
              </div>
            </div>
          </template>
          <template slot-scope="scope" slot="appeal_files">
            <div v-if="scope.data.appeal_files.length == 0"></div>
            <div v-else v-for="(item,index) in scope.data.appeal_files" :key="index">
              <div style="display:flex;align-items:center">
                <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                  <div @click="downloadDocument(item)" style="color:#409EFF;flex:1;cursor: pointer;">{{item.name}}</div>
                </el-tooltip>
              </div>
            </div>
          </template>
          <template slot-scope="scope" slot="deal_files">
            <div v-if="scope.data.deal_files.length == 0"></div>
            <div v-else v-for="(item,index) in scope.data.deal_files" :key="index">
              <div style="display:flex;align-items:center">
                <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                  <div @click="downloadDocument(item)" style="color:#409EFF;flex:1;cursor: pointer;">{{item.name}}</div>
                </el-tooltip>
              </div>
            </div>
          </template>
        </tr-table>
      <!-- <tr-table
        :loading="loading"
        ref="table"
        :data="tableList"
        :tableHeaderList="tableHeaderList"
        :isShowSummary="true"
        :omitColumnIndex='[1,2,3,5,6,7,9,10,11,12,13,15,16]'
        :rowspanObj="rowspanObj"
        :mergekeys="mergekeys"
        :spanMethodType="['column']"
        :TableHeight="previewHeight"
        >
        <template slot-scope="scope" slot="exam_files">
          <div v-if="scope.data.exam_files.length == 0"></div>
          <div v-else v-for="(item,index) in scope.data.exam_files" :key="index">
            <div style="display:flex;align-items:center">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                <div @click="downloadDocument(item)" style="color:#409EFF;flex:1;cursor: pointer;">{{item.name}}</div>
              </el-tooltip>
            </div>
          </div>
        </template>
      </tr-table> -->
    </el-dialog>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import imageFileUpload from "@/components/imageFileUpload/index";
import { getUser } from "@/utils/auth";
import { formatDate } from '@/utils/index'
import common from '@/mixin/exportToExcel'
export default {
  components: {
    imageFileUpload,
  },
  mixins: [common],
  props: {
    dialogBool: Boolean,
    curSelecedType: [String],
    tableHeaderList: [Array]
  },
  data() {
    return {
      form: {
        imgs: [],
        files: [],
      },
      loading: false,
      tableList: [],
      
      rowspanObj: {},
      mergekeys: ['group_id','group_name','total_score'],

      previewDialogVisible: false,
      previewHeight: 500,
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
      }
    },
  },
  methods: {
    // 初始化数据
    initSet(info) {
      if (!!info) {
        this.form = JSON.parse(JSON.stringify(info))
        if (this.form.temp_id) {
          this.saveTemplate()
        }
      }
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 预览
    preview() {
      this.previewDialogVisible = true
      this.$nextTick(() => {
        this.previewHeight = this.$refs.previewDialog.$el.offsetHeight - 70
      })
    },
    // 获取考核模板
    saveTemplate(){
      this.loading = true
      let params = {
        record_id: this.form.id,
        temp_id: this.form.temp_id,
        page_index: 1,
        page_size: 999
      }
      this.$client.GetAssessModelContentByPage(params)
      .then(res => {
        if (res.head.result == "200") {
            this.tableList = res.context.list;
            this.rowspanObj = this.$handleTableSpan(this.mergekeys, this.tableList,'group_id',true)

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
    // 导出
    onExport() {
      if (this.tableList.length > 0) {
        let table_dom = this.$refs['tableBox'].$refs.table.$el
        let titles = [this.form.user_dept_name,`${this.form.start_time}~${this.form.end_time}`]
        let signs = [
          `考核类型：${this.form.exam_type_name}`,
          `被考核部门：${this.form.exam_dept_name}`,
          `被考核人员：${this.form.exam_user_names}`,
        ]
        this.exportToExcel(table_dom,'考核模板','tableBox',titles,signs)
      } else {
        this.$message({
          showClose: true,
          message: "暂无数据",
          type: "warning",
        });
      }
      // let params = {
      //   temp_id: this.form.temp_id
      // }
      // this.$client.ExportAssessModel(params).then((res) => {
      //   if(res.head) {
      //     if (res.head.result == "200") {
      //       window.location.href = res.context;
      //       this.$message({ type: "success", message: "导出成功" });
      //     } else {
      //       this.$message({ type: "error", message: "导出失败" });
      //     }
      //   }else{
      //     this.$message({ type: "warning", message: "暂无可导出内容" });
      //   }
        
      // });
    },
    // 修改评分
    changeScore(row,index) {
      if (Number(row.exam_score) > Number(row.max_score)) {
        this.tableList[index].exam_score = ''
        this.$message({ type: "warning", message: "审核人评分不能大于内容最高评分" });
        return
      }
      if (row.exam_score) {
        this.tableList[index].score_person = JSON.parse(getUser()).user_id
      } else {
        this.tableList[index].score_person = ''
      }
    },
    // 考核评分
    updatePlaybill() {
      let list = []
      this.tableList.forEach(item => {
        let obj = {
          content_id: item.id,
          score: item.exam_score,
          score_remark: item.exam_score_remark || '',
          file_ids: item.exam_files.map(child => {return child.id}),
          score_person: item.score_person,
        }
        list.push(obj)
      })
      let params = {
        record_id: this.form.id,
        list: list
      }

      this.$emit('on-save',params)
    },
    // 上传文件
    handlePreview(file,index) {
      let formData = new FormData();
      formData.append("file", file.raw);

      let params = {
        file: formData,
      };
      let fileName = file.name;
      this.$client.NewAddTxtfileUpload(params).then(res => {
        if(res.head.result == "200") {
          let fileObj = {
            name: fileName,
            url: res.context.url,
            id: res.context.id,
          }
          this.tableList[index].exam_files.push(fileObj)
          this.$message({
            showClose: true,
            message: "上传成功",
            type: "success"
          });
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    downloadDocument(item) {
      // console.log(item)
      window.location.href = item.url
      this.$message({type: 'success', message: '下载成功'})
    },
    // 删除文件
    deleteDocument(rowIndex,index) {
      this.tableList[rowIndex].exam_files.splice(index, 1)
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


