<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="1030px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <div class="show-flex-box-r">
          <el-form-item label="党组织名称:" prop="party_id">
            <get-party-org-select-tree
              ref="getPartyOrgSelectTree"
              :placeholder="'选择党组织'"
              :isShowCheckbox="false"
              v-model="form.party_id"
              :isExportMultiple="false"
              :isCheckStrictly="false"
              :width="'180'"
              :disabled="curSelecedType == 'detail'"
            >
            </get-party-org-select-tree>
          </el-form-item>
          <el-form-item label="活动属性:" prop="nature">
            <el-radio-group v-model="form.nature" style="width: 180px;" :disabled="curSelecedType == 'detail'">
              <el-radio :label="1"><span style="color:#606266">线上</span></el-radio>
              <el-radio :label="2"><span style="color:#606266">线下</span> </el-radio>
          </el-radio-group>
          </el-form-item>
          <el-form-item label="是否在党群服务中心举办:" prop="is_center">
            <el-radio-group v-model="form.is_center" style="width: 180px;" :disabled="curSelecedType == 'detail'">
              <el-radio :label="1"><span style="color:#606266">是</span></el-radio>
              <el-radio :label="2"><span style="color:#606266">否</span> </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="活动类别:" prop="type">
            <el-select v-model="form.type" placeholder="请选择活动类别" clearable @change="selectedActivityType" :disabled="curSelecedType == 'detail'">
              <el-option v-for="(item, index) in activityTypeOptions" :key="index" :label="item.name"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否教育培训活动:" prop="edu">
            <el-radio-group v-model="form.edu" style="width: 180px;" :disabled="curSelecedType == 'detail'">
              <el-radio :label="1"><span style="color:#606266">是</span></el-radio>
              <el-radio :label="0"><span style="color:#606266">否</span> </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="主题党日活动" prop="ex_types" v-if="form.type === 1">
            <el-checkbox-group 
              v-model="form.ex_types"
              :disabled="curSelecedType == 'detail'"
              >
              <el-checkbox v-for="item in themePartyDayActivitiesOptions" :label="item" :key="item">{{item}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="日常活动" prop="ex_types" v-if="form.type === 2">
            <el-checkbox-group 
              v-model="form.ex_types"
              :disabled="curSelecedType == 'detail'"
              >
              <el-checkbox v-for="item in dailyActivitiesOptions" :label="item" :key="item">{{item}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="关键词" prop="ex_keyword">
            <el-tag
              :key="tag"
              v-for="tag in form.ex_keyword"
              closable
              :disable-transitions="false"
              :disabled="curSelecedType == 'detail'"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
              style="width: 100px"
            >
            </el-input>
            <el-button v-else class="button-new-tag" @click="showInput" type="primary" icon="el-icon-circle-plus-outline" size="mini" :disabled="curSelecedType == 'detail'">关键词</el-button>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="活动名称:" prop="name">
            <el-input v-model="form.name" placeholder="请输入活动名称" :disabled="curSelecedType == 'detail'"></el-input>
          </el-form-item>
          <el-form-item label="是否开放:" prop="open">
            <el-select v-model="form.open" placeholder="请选择" :disabled="curSelecedType == 'detail'">
              <el-option label="开放" :value="1"></el-option>
              <el-option label="仅组织内部" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="签到管理员:" prop="manage_id">
            <!-- <el-input v-model="form.manage_id" placeholder="请输入签到管理员"></el-input> -->
            <get-party-personnel-select-tree
              ref="getManageIdSelectTree"
              :placeholder="'选择签到管理员'"
              :isShowCheckbox="false"
              v-model="form.manage_id"
              :isExportMultiple="false"
              :isCheckStrictly="false"
              :width="'180'"
              :disabled="curSelecedType == 'detail'"
            >
            </get-party-personnel-select-tree>
          </el-form-item>
          <!-- <el-form-item label="开始时间:" prop="person_phone">
            <el-date-picker
              v-model="form.d_birthday"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item> -->
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="关联的志愿服务队:" prop="volunteer">
            <el-input
              placeholder="请输入关联的志愿服务队"
              v-model="form.volunteer"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="报名人数:" prop="count">
            <el-input
              placeholder="请输入报名人数"
              v-model="form.count"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.c_person_phon = $event.target.value"
              :disabled="curSelecedType == 'detail'"
            ><el-button slot="append">人</el-button></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
           <el-form-item label="开始时间:" prop="start_date">
            <el-date-picker
              v-model="form.start_date"
             type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
              :disabled="curSelecedType == 'detail'"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间:" prop="end_date">
            <el-date-picker
              v-model="form.end_date"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
              :disabled="curSelecedType == 'detail'"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="活动地址:" prop="address">
            <el-input v-model="form.address" placeholder="请输入活动地址" :disabled="curSelecedType == 'detail'"></el-input>
          </el-form-item>
        </div>
        <!-- <div>
          <el-form-item label="签到管理员:" prop="person_phone">
            <el-input v-model="form.person_phone" placeholder="请输入签到管理员"></el-input>
          </el-form-item>
        </div> -->
        <div class="show-flex-box-r">
          <el-form-item label="内容:" prop="content">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入内容"
              v-model="form.content"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="参与人员:" prop="ex_user_ids" v-if="form.open === 1">
            <get-department-select
              ref="personalTree"
              v-model="form.ex_user_ids"
              :width="'180'"
              :show_all="true"
              :isShowCheckbox="true"
              :placeholder="'请选择参与人员'"
              :isContainEmp="true"
              :isExportMultiple="true"
              :isCheckStrictly="false"
              :disabled="curSelecedType == 'detail'"
            ></get-department-select>
          </el-form-item>
          <el-form-item label="参与党员:" prop="ex_party_ids">
            <get-party-personnel-select-tree
              ref="getPartyOrgSelectTree"
              :placeholder="'选择参与党员'"
              :isShowCheckbox="true"
              v-model="form.ex_party_ids"
              :isExportMultiple="true"
              :isCheckStrictly="true"
              :width="'180'"
              :disabled="curSelecedType == 'detail'"
            >
            </get-party-personnel-select-tree>
          </el-form-item>
          <el-form-item label="审批人:" prop="audit_users">
             <get-party-personnel-select-tree
                ref="getAuditUsersIdSelectTree"
                :placeholder="'选择审批人'"
                :isShowCheckbox="false"
                v-model="form.audit_users"
                :isExportMultiple="false"
                :isCheckStrictly="false"
                :width="'180'"
                :disabled="curSelecedType == 'detail'"
              >
              </get-party-personnel-select-tree>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="图片:" prop="ex_pics">
            <div class="list-data-list show-flex-box-r">
              <ul class="list-data" v-for="(item,index) in form.ex_pics" :key="index">
                <li class="item" v-if="item.url">
                  <image-box :src="item.url" :id="index+1" @on-delete="imageDelete(index)" :disabled="curSelecedType == 'detail'"></image-box>
                </li>
                <!-- <li class="item unchecked" v-else @click="uploadFile()">
                  <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
                </li> -->
              </ul>
              <div class="item unchecked" @click="uploadFile()" v-if="form.ex_pics.length < 9 && this.curSelecedType != 'detail'">
                <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
              </div>
            </div>
            
          </el-form-item>
        </div>

        <div class="multiple-files-upload-content show-flex-box-r">
          <el-form-item label="附件:" prop="files">
            <el-upload
              class="upload-demo"
              ref="uploadDocomnet"
              action="string"
              :on-change="handlePreview"
              accept=".rar,.zip,.doc,.docx,.pdf,.mp4"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary" class="el-icon-upload" :disabled="curSelecedType == 'detail'">上传文件</el-button>
              <div slot="tip" class="el-upload__tip">支持格式：.rar .zip .doc .docx .pdf .mp4，单个文件不能超过20MB(不限视频)，最多只能保存3个文件</div>
            </el-upload>
            <ul class="document-content show-flex-box-c">
              <li class="show-flex-box-r" v-for="(item,index) in form.ex_files" :key="index">
                <span class="show-flex-box-r">
                  <i class="el-icon-document-remove" style="margin:7px 6px 0px 0px; font-size:14px;"></i>
                  <span>{{item.name}}</span> 
                  </span>
                <strong class="show-flex-box-r">
                  <el-button type="text" @click="downloadDocument(item)">下载</el-button
                  >
                  <el-button type="text" :disabled="curSelecedType == 'detail'" @click="deleteDocument(item,index)">删除</el-button>
                
                </strong>
              </li>
            </ul>
          </el-form-item>
        </div>

        
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import imageBox from './image-box'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getPartyOrgSelectTree from "@/components/base/formModel/tree/get-party-org-select-tree";
import getPartyPersonnelSelectTree from "@/components/base/formModel/tree/get-party-personnel-select-tree";
export default {
  components: { imageBox,getDepartmentSelect,getPartyOrgSelectTree,getPartyPersonnelSelectTree},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      date: [],
      activityTypeOptions:[
        { value: 1, name: "主题党日活动" },
        { value: 2, name: "日常活动" }
      ],
      themePartyDayActivitiesOptions:['召开支部党员大会', '召开支部委员会', '召开党小组会', '开展党课教育','召开民主/组织生活会', '政治理论学习', '学习先进典型', '开展志愿服务','开展走访慰问', '开展结对共建', '群团活动', '公益活动','文体活动', '党组织其它活动'],
      dailyActivitiesOptions:['召开支部党员大会', '开展党课教育', '召开民主/组织生活会', '政治理论学习','学习先进典型', '开展志愿服务', '开展走访慰问','开展结对共建','党组织其它活动'],
      inputVisible: false,
      inputValue: '',
      form: {
        id: "",
        party_id:"",
        nature: "",
        is_center: "",
        type: "",
        edu: "",
        name: "",
        open: "",
        volunteer: "",
        count: "",
        start_date: "",
        end_date: "",
        address: "",
        manage_id: "",
        content: "",
        audit_users:"",
        ex_keyword: [],
        ex_pics: [],
        ex_types: [],
        ex_user_ids: [],
        ex_party_ids: [],
        ex_files:[]
      },
      basicRules: {
        party_id: [
          { required: true, message: "请选择党组织", trigger: "change" },
        ],
        nature: [
          { required: true, message: "请选择活动属性", trigger: "change" },
        ],
        is_center: [
          { required: true, message: "请选择是否在党群服务中心举办", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择活动类别", trigger: "change" },
        ],
        edu: [
          { required: true, message: "请选择是否教育培训活动", trigger: "change" },
        ],
        name: [
          { required: true, message: "请填写活动名称", trigger: "change" },
        ],
        open: [
          { required: true, message: "请选择是否开放", trigger: "change" },
        ],
        volunteer: [
          { required: true, message: "请输入关联的志愿服务队", trigger: "change" },
        ],
        count: [
          { required: true, message: "请输入报名人数", trigger: "change" },
        ],

        start_date: [
          { required: true, message: "请选择开始时间", trigger: "change" },
        ],
        end_date: [
          { required: true, message: "请选择结束时间", trigger: "change" },
        ],
        address: [
          { required: true, message: "请输入活动地址", trigger: "change" },
        ],
        content: [
          { required: true, message: "请输入内容", trigger: "change" },
        ],
        ex_pics: [
          { required: true, message: "请上传图片", trigger: "change" },
        ],
        ex_types: [
          { required: true, message: "请选择活动主题", trigger: "change" },
        ],
        ex_user_ids: [
          { required: true, message: "请选择参与人员", trigger: "change" },
        ],
        ex_party_ids: [
          { required: true, message: "请选择参与党员", trigger: "change" },
        ],
        audit_users: [
          { required: true, message: "请选择审批人", trigger: "change" },
        ],
        ex_keyword: [
          { required: true, message: "请输入关键词", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 选择活动类别
    selectedActivityType(val) {
      this.form.ex_types = []
    },
    // 删除关键字
    handleClose(tag) {
      if(this.curSelecedType == 'detail') {
        return
      }
      this.form.ex_keyword.splice(this.form.ex_keyword.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.form.ex_keyword.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
      this.$refs.form.validateField('ex_keyword')
    },
    // 删除图片
    imageDelete(index) {
      this.form.ex_pics.splice(index,1)
    },
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        reader.onload = (ev) => {
          input = undefined;
        };
        let params = new FormData
        params.append('file', file)
        this.$client.uploadPicture({file: params}, '/api/ERPWeb/VehicleManager/AddCarInfoImage').then((req) => {
          // console.log(req);
          if (req.head.result === "200") {
            let obj = {
              name: file.name,
              url: req.context
            }
            this.form.ex_pics.push(obj)
          }
        });
      };
      input.click();
    },

    // 判断文件大小
    beforeDocumentUpload (file) {
      console.log(file)
      if(file.raw.type.indexOf('video') > -1) {
        console.log(file)
        return true
      }
      const isLt1M = file.size / 1024 / 1024 < 40
      if (isLt1M) {
        return true
      }
      this.$message({type: 'error', message: '请不要上载大小超过20M的文件', showClose: true})
      return false
    },
    // 上传文件
    handlePreview(file) {
      if(this.form.ex_files.length > 2) {
         this.$message({type: 'warning', message: '最多只能上传三个文件', showClose: true})
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
      if(file.raw.type.indexOf('video') > -1){
        this.UpLoadFileBreakPointResume(file);
      }else{
        let formData = new FormData();
        formData.append("file", file.raw);
  
        let params = {
          file: formData,
        };
        let fileName = file.name;
        this.$client.uploadFilePassengerServiceManage(params).then(res => {
          if(res.head.result == "200") {
            let fileObj = {
              type: 2,
              name: fileName,
              url: res.context
            }
            this.form.ex_files.push(fileObj)
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
      }

    },
    // 视频切片断点续传
    async UpLoadFileBreakPointResume(file) {
      console.log(file)
      let splitUploadSize = 10 * 1024 * 1024;
      const { splitUpload, singleUpload } = this;
      // console.log(file.size > splitUploadSize)
      const uploadFunc =
        file.size > splitUploadSize ? splitUpload : singleUpload;
      try {
        await uploadFunc(file);
      } catch (e) {
        console.log(e);
      }
    },
    // 文件分块,利用Array.prototype.slice方法
    splitFile(file, eachSize, chunks) {
      const fileChunk = [];
      for (let chunk = 0; chunks > 0; chunks--) {
        fileChunk.push(file.raw.slice(chunk, chunk + eachSize));
        chunk += eachSize;
      }
      return fileChunk;
    },
    // 大文件分块上传
    splitUpload(file) {
      return new Promise(async (resolve, reject) => {
        try {
          // console.log(1,file);
          const { eachSize } = this;
          // console.log(eachSize)
          const chunks = Math.ceil(file.size / eachSize);
          //  console.log(chunks)
          const fileChunks = this.splitFile(file, eachSize, chunks);
          // console.log(fileChunks)
          let currentChunk = 0;
          for (let i = 0; i < fileChunks.length; i++) {
            if (currentChunk === i) {
              let formData = new FormData();
              formData.append("file", fileChunks[i]);
              formData.append("md5_code", file.uid);
              formData.append("merge_name", file.name);
              if(i < fileChunks.length -1) {
                formData.append("is_last", false);

              }else{
                formData.append("is_last", true);
                // formData.append("merge_name", file.name);
              }

              let res = await this.UpLoadFileBreakPointResumeUpload(formData); 
              if(res.head.result == "200") {
                  console.log(res)
                  if(currentChunk == fileChunks.length -1) {
                    let fileObj = {
                      type: 2,
                      name: file.name,
                      url: res.context
                    }
                    this.form.ex_files.push(fileObj)
                    this.$message({
                        showClose: true,
                      message: "上传成功",
                      type: "success"
                    });
                  }
                  currentChunk = i + 1;
                }else{
                  this.$message({
                    showClose: true,
                    message: res.head.describle,
                    type: "error",
                  });
                }
            }
          }
        } catch (e) {
          reject(e);
        }
      });
    },
    // 小文件直接上传
    singleUpload(file) {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append("file", file.raw);
          formData.append("md5_code", file.uid);
          formData.append("is_last", true);
          formData.append("merge_name", file.name);
          let res = await this.UpLoadFileBreakPointResumeUpload(formData); 
          if(res.head.result == "200") {
              console.log(res)
              let fileObj = {
                type: 2,
                name: file.name,
                url: res.context
              }
              this.form.ex_files.push(fileObj)
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

        } catch (e) {
          reject(e);
        }
      });
    },
    // 调用上传视频接口
    UpLoadFileBreakPointResumeUpload(formData) {
     return this.$client.UpLoadFileBreakPointResumeUpload(formData).then(res => res)
    },

    // 下载文件
    downloadDocument(item) {
      // console.log(item)
      window.location.href = item.url
      this.$message({type: 'success', message: '下载成功'})
    },
    // 删除文件
    deleteDocument(item,index) {
      this.form.ex_files.splice(index, 1)
    },
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
  height: 500px;
  overflow-y: scroll;
}
.el-dialog-div /deep/ .el-date-editor {
  width: 180px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 180px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 180px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 820px;
}

.el-tag + .el-tag {
    margin-left: 10px;
  }
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
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

