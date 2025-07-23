<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="700px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <div class="show-flex-box-r">
          <el-form-item label="姓名:" prop="user_id">
            <get-department-select
              ref="personalTree"
              v-model="form.user_id"
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
          <el-form-item label="所在单位（部门）:" prop="department_base">
           <get-department-select
              ref="baseTree"
              v-model="form.department_base"
              :isContainEmp="false"
              :isShowCheckbox="false"
              :isExportMultiple="false"
              :disabled="curSelecedType == 'detail'"
            ></get-department-select>
          </el-form-item>
        </div>
        <div class="show-flex-box-r"> 
          <el-form-item label="现任岗位:" prop="job_names">
            <el-input v-model="form.job_names" :disabled="curSelecedType == 'detail'"></el-input>
            <!-- <get-position-list v-model="form.position_id" :multiple="false" :disabled="curSelecedType == 'detail'"></get-position-list> -->
          </el-form-item>
          <el-form-item label="出生日期:" prop="birthday">
            <el-date-picker
              v-model="form.birthday"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              :disabled="curSelecedType == 'detail'"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="学历:" prop="top_education">
            <el-input v-model="form.top_education" placeholder="请输入学历" clearable :disabled="curSelecedType == 'detail'"></el-input>
          </el-form-item>
          <el-form-item label="毕业院校:" prop="school">
            <el-input v-model="form.school" placeholder="请输入毕业院校" clearable :disabled="curSelecedType == 'detail'"></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="专业:" prop="major">
            <el-input v-model="form.major" placeholder="请输入专业" clearable :disabled="curSelecedType == 'detail'"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="上传图片:" prop="ex_pics">
            <div class="list-data-list show-flex-box-r" >
              <ul class="list-data" v-for="(item,index) in form.ex_pics" :key="index">
                <li class="item" v-if="item.url">
                  <image-box :src="item.url" :id="index+1" @on-delete="imageDelete(index)" :disabled="curSelecedType == 'detail'"></image-box>
                </li>
                <!-- <li class="item unchecked" v-else @click="uploadFile()">
                  <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
                </li> -->
              </ul>
              <div class="item unchecked" @click="uploadFile()" v-if="!form.ex_pics || (!!form.ex_pics && form.ex_pics.length < 1) && curSelecedType != 'detail'">
                <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
              </div>
            </div>
            <!-- <span v-else style="color: #909399">暂无上传图片</span> -->
          </el-form-item>
          <el-form-item label="上传附件:" prop="address">
            <multiple-files-upload :filesList="form.ex_files" :acceptType="'.doc,.docx,.pdf,.xls,.xlsx'" :isPreviewable="true" @upload-update-success="uploadUpdateSuccess" :disabled="curSelecedType == 'detail'"></multiple-files-upload>
            <!-- <span v-else style="color: #909399">暂无上传附件</span> -->
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
import multipleFilesUpload from "@/components/multiple-files-upload";
import imageBox from './image-box';
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getPositionList from "@/components/base/formModel/select/get-position-list";
export default {
  components: {multipleFilesUpload,imageBox,getDepartmentSelect, getPositionList},
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      date: [],
      form: {
        id: "",
        user_id: "",
        department_base: '',
        job_names: "",
        birthday: "",
        top_education: "",
        school: "",
        major: "",
        imgs:"",
        file_paths:[],

        ex_pics:[],
        ex_files:[],
      },
      basicRules: {
        user_id: [
          { required: true, message: "请选择姓名", trigger: "change" },
        ],
        department_base: [
          { required: true, message: "请选择所在单位（部门）", trigger: "change" },
        ],
        birthday: [
          { required: true, message: "请选择出生年月", trigger: "change" },
        ]
      },
      isFirstLoad: true
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.$refs.personalTree.onClear()
        this.$refs.baseTree.onClear()
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

    // 数据回显
    setData(info){
      let val = JSON.parse(JSON.stringify(info))
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(val, key)) {
          this.form[key] = val[key];
          if(key === 'imgs' && !!val.imgs) {
            this.form.ex_pics = [{
              name: '1',
              url:val.imgs
            }]
          }

          if(key === 'file_paths' && !!this.form.file_paths && this.form.file_paths.length) {
            this.form.ex_files = this.form.file_paths.map(item => {
              item.name = item.file_name
              delete item.file_name
              return item
            })
          }
        }
      }
      this.$nextTick(() =>{
        this.$refs.form.clearValidate();
      })
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
            // console.log(res)
            let staffInfo = res.context;
            if(staffInfo) {
              this.form.department_base = staffInfo.dept_id
              this.form.job_names = staffInfo.job_names || '';
              this.form.birthday = staffInfo.date_of_birth || '';
              this.form.top_education = staffInfo.qrz_xl || '';
              this.form.school = staffInfo.qrz_byyx || '';
              this.form.major = staffInfo.qrz_sxzy || '';
              this.$nextTick(() => {
                this.$refs.form.clearValidate();
              })
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch((err) => {});
      }
    },

    // 删除照片
    imageDelete(index) {
      this.form.ex_pics.splice(index,1)
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
            this.form.ex_pics.push(obj)
          }
        });
      };
      input.click();
    },
    // 上传文件
    uploadUpdateSuccess(filesList) {
      console.log(filesList)
      this.form.ex_files = filesList;
    },
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = JSON.parse(JSON.stringify(this.form))
          delete info.ex_pics
          delete info.ex_files
          if(!!this.form.ex_pics && this.form.ex_pics.length) {
            info.imgs =  this.form.ex_pics[0].url
          }else{
            info.imgs = ''
          }
          if(!!this.form.ex_files && this.form.ex_files.length) {
            info.file_paths = this.form.ex_files.map(item => {
              item.file_name = item.name
              delete item.name
              return item
            })
          }else{
            info.file_paths = []
          }
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
  height: 420px;
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
  width: 500px;
}

// .name-content>.el-form-item /deep/ .el-input,.el-input--mini {
//   width: 500px;
// }

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

