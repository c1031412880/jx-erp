<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="750px"
    
  >
    <div class="el-dialog-div">
      <el-form
        size="mini"
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="135px"
      >
        <div class="el-form-row">
          <el-form-item label="姓名:" prop="user_id">
            <get-department-select
              ref="personalTree"
              v-model="formData.user_id"
              :width="'220'"
              :show_all="true"
              :isShowCheckbox="false"
              :placeholder="'请选择'"
              :isContainEmp="true"
              :isExportMultiple="false"
              @on-change="selectedPersonal"
              :disabled="curSelecedType == 'detail'"
            ></get-department-select>
          </el-form-item>
          <el-form-item label="所在单位（部门）:" prop="user_dept">
            <el-input
              placeholder="请选择所在单位（部门）"
              v-model="formData.user_dept"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </div>
         <div class="el-form-row">
          <el-form-item label="岗位级别:" prop="user_position">
            <el-input
              placeholder="请选择岗位级别"
              v-model="formData.user_position"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属种类:" prop="type" label-width="140px">
            <el-select v-model="formData.type" placeholder="请选择所属种类" @change="selectedType" :disabled="curSelecedType != 'add'" >
              <el-option label="奖励" :value="1"></el-option>
              <el-option label="惩罚" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="el-form-row">
          <el-form-item label="奖惩情形:" prop="case_ids">
            <div class="show-flex-box-r" style="align-items: center;">
              <el-select v-model="formData.case_ids" multiple collapse-tags :clearable="false" placeholder="请选择奖惩情形" :disabled="curSelecedType == 'detail' || !formData.type" @change="selectedRewardPunishmentCase">
                <el-option
                  v-for="item in ownershipOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            <i class="el-icon-delete" style="cursor: pointer;" v-if="curSelecedType != 'detail'" @click="deleteCaseIds"></i> 
            </div>
            
          </el-form-item>
          <el-form-item label=" 奖惩种类:" prop="kind_ids">
            <el-select v-model="formData.kind_ids" multiple collapse-tags clearable placeholder="请选择" @change="selectedRewardPunishmentClasslify" :disabled="curSelecedType == 'detail' || formData.case_ids.length == 0">
            <el-option
              v-for="item in rewardsPunishmentsOptions"
              :key="item.id"
              :label="item.type_child_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <div class="el-form-row">
          <el-form-item label="奖惩条款:" prop="content">
            <!-- <el-input
              placeholder="请选择奖惩条款"
              v-model="formData.content"
              :disabled="true"
              style="width: 495px;"
            ></el-input> -->
            <p v-html="formData.content"  style="width: 495px;min-height:28px;background: #F5F7FA; border: 1px solid #DCDFE6;border-color: #E4E7ED;padding: 5px 15px;border-radius: 5px;"></p>
          </el-form-item>
        </div>
        <div class="el-form-row">
          <el-form-item label="关联条约:" prop="patch">
            <p v-html="formData.patch"  style="width: 495px;min-height:28px; background: #F5F7FA; border: 1px solid #DCDFE6;border-color: #E4E7ED;padding: 5px 15px;border-radius: 5px;"></p>
            <!-- <el-input
              placeholder="请选择关联条约"
              style="width: 495px;"
              v-model="formData.patch"
              :disabled="true"
            ></el-input> -->
          </el-form-item>
        </div>
        <div class="el-form-row">
          <el-form-item label="备注:" prop="remark">
            <el-input
              v-model="formData.remark" 
              type="textarea"
              maxlength="200"
              :rows="4"
              show-word-limit
              placeholder="请输入备注"
              :disabled="curSelecedType == 'detail'"></el-input>
          </el-form-item>
        </div>
         <div>
          <el-form-item label="上传图片:" prop="ex_pics">
            <div class="list-data-list show-flex-box-r">
              <ul class="list-data" v-for="(item,index) in formData.ex_pics" :key="index">
                <li class="item" v-if="item.url">
                  <image-box :src="item.url" :id="index+1" @on-delete="imageDelete(index)" :disabled="curSelecedType == 'detail'"></image-box>
                </li>
                <!-- <li class="item unchecked" v-else @click="uploadFile()">
                  <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
                </li> -->
              </ul>
              <div class="item unchecked" @click="uploadFile()" v-if="!formData.ex_pics || (!!formData.ex_pics && formData.ex_pics.length < 1) && curSelecedType != 'detail'">
                <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="上传附件:" prop="address">
            <multiple-files-upload :filesList="formData.ex_files" :acceptType="'.doc,.docx,.pdf,.xls,.xlsx'" :isPreviewable="true" @upload-update-success="uploadUpdateSuccess" :disabled="curSelecedType == 'detail'"></multiple-files-upload>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('formData')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import imageBox from '@/components/image-box/index';
import multipleFilesUpload from "@/components/multiple-files-upload";
export default {
  components: {
    getDepartmentSelect,
    imageBox,
    multipleFilesUpload
  },
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
      formData: {
        id:'',
        user_id: '',
        user_dept: '',
        user_position: '', 
        type: '',
        case_ids: [],
        kind_ids: [],
        remark: '',
        img_path:'',
        files:[],

        ex_pics:[],
        ex_files:[],
        content:'',
        patch:'',
      },
      rules: {
        user_id: [
          { required: true, message: '请选择姓名', trigger: 'change' },
        ],
        type: [
          { required: true, message: '请选择所属种类', trigger: 'change' },
        ],
        case_ids: [
          { required: true, message: '请选择奖惩情形', trigger: 'change' },
        ],
        kind_ids: [
          { required: true, message: '请选择奖惩种类', trigger: 'change' },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      isFirstLoad: true,
      rewardsPunishmentsOptions:[], //奖惩种类
      ownershipOptions:[], //奖惩情形
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.$refs.personalTree.onClear()
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          this.$refs.formData.clearValidate();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
     // 选择人员带出人员基本信息
    selectedPersonal(val,node) {
      console.log(val,node)
      if(this.isFirstLoad) {
        this.isFirstLoad = false;
        return
      }
      if(val && val.length && !this.isFirstLoad) {
        let parmas = {
          id: val[0]
        }
        this.$client.getEmployeeManageDetail(parmas).then((res) => {
          if (res.head.result == "200") {
            let staffInfo = res.context;
            if(staffInfo) {
              this.formData.user_dept = staffInfo.dept_main_name || '';
              this.formData.user_position = staffInfo.job_names || '';
              this.$nextTick(() => {
                this.$refs.formData.clearValidate();
              })
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      }
    },
    // 选择奖惩所属种类
    selectedType(val, pageType) {
      let params = {
        type : val
      }
      // 奖惩种类
      this.$client.GetKindByTypeReward(params).then(res => {
        if (res.head.result == "200") {
          this.rewardsPunishmentsOptions = res.context
        } else {
          this.rewardsPunishmentsOptions = []
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
      // 奖惩情形
      this.$client.GetCaseByTypeReward(params)
        .then(res => {
          if (res.head.result == "200") {
            this.ownershipOptions = res.context
            if(pageType =='check') {
              if(!!this.formData.case_ids && this.formData.case_ids.length) {
                this.selectedRewardPunishmentCase(this.formData.case_ids,pageType)
              }
            }

          } else {
            this.ownershipOptions = []
            
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    // 选择奖惩情形带出 奖惩种类
    selectedRewardPunishmentCase(val,pageType) {
      if(!pageType) {
        this.formData.kind_ids = []
         this.$refs.formData.clearValidate();
      }
      // console.log(val)
      this.rewardsPunishmentsOptions = []
      this.newsRewardsPunishmentsOptions = []
      this.newsRewardsPunishmentsOptionsIds = []
      if(val.length && this.ownershipOptions.length) {
        val.forEach(item => {
          this.ownershipOptions.forEach(obj => {
            if(item == obj.id) {
              if(!!obj.kinds && obj.kinds.length) {
                this.newsRewardsPunishmentsOptions = [...this.newsRewardsPunishmentsOptions,...obj.kinds]
              }
            }
        });
        });
      }
      // console.log(this.newsRewardsPunishmentsOptions)
      this.newsRewardsPunishmentsOptionsIds = [...new Set(this.newsRewardsPunishmentsOptions.map(item => item.id))]
      // console.log(this.newsRewardsPunishmentsOptionsIds,this.newsRewardsPunishmentsOptions.map(item => item.id))
      for (let i = 0; i < this.newsRewardsPunishmentsOptionsIds.length; i++) {
        for (let j = 0; j < this.newsRewardsPunishmentsOptions.length; j++) {
          if(this.newsRewardsPunishmentsOptionsIds[i] === this.newsRewardsPunishmentsOptions[j].id) {
            this.rewardsPunishmentsOptions.push(this.newsRewardsPunishmentsOptions[j])
            break
          }
        }
      }
      console.log(this.rewardsPunishmentsOptions)
      this.$forceUpdate()

    },
    // 选择奖惩种类带出 奖惩条款和关联条约
    selectedRewardPunishmentClasslify(val) {
      this.formData.content = ''
      this.formData.patch = ''
      // console.log(val)
      if(val.length && this.rewardsPunishmentsOptions.length) {
        val.forEach((item,index)=> {
          this.rewardsPunishmentsOptions.forEach(obj => {
            let contentStr = ''
            let pactStr = ''
            if(item === obj.id) {
              if(index == 0) {
                contentStr = obj.content
                if(!!obj.pact) {
                  pactStr = obj.pact
                }
              }else{
                contentStr = '</br>'+obj.content
                if(!!obj.pact) {
                  pactStr = '</br>'+ obj.pact
                }
              }
            }
            this.formData.content = this.formData.content + contentStr
            this.formData.patch = this.formData.patch + pactStr
          })
        })
      }
      // console.log(this.formData.content,this.formData.patch)
    },
    // 清除奖惩情形
    deleteCaseIds() {
      this.formData.case_ids = []
    },
    // 删除照片
    imageDelete(index) {
      this.formData.ex_pics.splice(index,1)
    },
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      // input.accept = ".jpg,.jpeg";
      input.onchange = () => {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        console.log(file)
        reader.onload = (ev) => {
          input = undefined;
        };
        let params = new FormData
        params.append('file', file)
        this.$client.uploadPicture({file: params}, '/api/ERPWeb/PartyHonor/UploadPicture').then((req) => {
          // console.log(req);
          if (req.head.result === "200") {
            let obj = {
              name: file.name,
              url: req.context
            }
            this.formData.ex_pics.push(obj)
          }
        });
      };
      input.click();
    },
    // 上传文件
    uploadUpdateSuccess(filesList) {
      // console.log(filesList)
      this.formData.ex_files = filesList;
    },
     // 数据回显
    setData(info){
      let val = JSON.parse(JSON.stringify(info))
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(val, key)) {
          this.formData[key] = val[key];
          if(key === 'img_path' && !!val.img_path) {
            this.formData.ex_pics = [{
              name: '1',
              url:val.img_path
            }]
          }

          if(key === 'files' && !!this.formData.files && this.formData.files.length) {
            this.formData.ex_files = this.formData.files.map(item => {
              item.name = item.file_name
              delete item.file_name
              return item
            })
          }
        }
      }
      this.selectedType(val.type, 'check')
      // if(!!val.case_ids &&　val.case_ids.length) {
      //   this.selectedRewardPunishmentCase(val.case_ids)
      // }
      this.$nextTick(() =>{
        this.$refs.formData.clearValidate();
      })
    },
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = JSON.parse(JSON.stringify(this.formData));
          delete info.ex_pics
          delete info.ex_files
          if(!!this.formData.ex_pics && this.formData.ex_pics.length) {
            info.img_path =  this.formData.ex_pics[0].url
          }else{
            info.img_path = ''
          }
          if(!!this.formData.ex_files && this.formData.ex_files.length) {
            info.files = this.formData.ex_files.map(item => {
              item.file_name = item.name
              delete item.name
              return item
            })
          }else{
            info.files = []
          }
          if(!!info.case_ids && info.case_ids.length) {
            info.case_ids = info.case_ids.join(',')
          }
          if(!!info.kind_ids && info.kind_ids.length) {
            info.kind_ids = info.kind_ids.join(',')
          }
          delete info.content
          delete info.patch
          delete info.user_dept
          delete info.user_position
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
.el-dialog-div {
  height: 400px;
  overflow-y:scroll; 
}

.el-form-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.el-dialog-div /deep/ .el-date-editor {
  width: 180px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 180px;
  overflow: hidden;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 180px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 495px;
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

</style>

