<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="700px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <div class="name-content show-flex-box-r">
          <el-form-item label="荣誉类型:" prop="name">
            <!-- <el-input v-model="form.name" placeholder="请输入荣誉类型" style="width: 500px"></el-input> -->
            <el-select v-model="form.name" placeholder="请选择">
              <el-option
                v-for="item in nameOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="获奖党组织:" prop="ex_organ_ids" v-if="form.name == '组织'">
            <!-- <el-input v-model="form.address" placeholder="请输入获奖党组织"></el-input> -->
            <get-party-org-select-tree
              ref="getPartyOrgSelectTree"
              :placeholder="'选择获奖党组织'"
              :isShowCheckbox="true"
              v-model="form.ex_organ_ids"
              :isExportMultiple="true"
              :isCheckStrictly="true"
              :width="'180'"
              :disabled="false"
              @on-change="selectedPartyOrg"
            >
            </get-party-org-select-tree>

          </el-form-item>
          <el-form-item label="获奖人员:" prop="ex_user_ids" v-if="form.name == '党员'">
            <get-party-personnel-select-tree
              ref="getPartyOrgSelectTree"
              :placeholder="'选择获奖人员'"
              :isShowCheckbox="true"
              v-model="form.ex_user_ids"
              :isExportMultiple="true"
              :isCheckStrictly="true"
              :width="'180'"
              :disabled="false"
            >
            </get-party-personnel-select-tree>
            <!-- <el-input v-model="form.person_name" placeholder="请输入获奖人员"></el-input> -->
          </el-form-item>
          <el-form-item label="荣誉级别:" prop="level">
            <el-input v-model="form.level" placeholder="请输入荣誉级别"></el-input>
          </el-form-item>

        </div>
        <div class="show-flex-box-r">
          <el-form-item label="批准机关:" prop="organ">
            <el-input v-model="form.organ" placeholder="请输入批准机关"></el-input>
          </el-form-item>
          <el-form-item label="批准时间:" prop="ratify_date">
            <el-date-picker
              v-model="form.ratify_date"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="备注:" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入备注"
              v-model="form.remark"
              maxlength="500"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="荣誉照片:" prop="c_remark">
            <div class="list-data-list show-flex-box-r">
              <ul class="list-data" v-for="(item,index) in form.ex_pics" :key="index">
                <li class="item" v-if="item.url">
                  <image-box :src="item.url" :id="index+1" @on-delete="imageDelete(index)"></image-box>
                </li>
                <!-- <li class="item unchecked" v-else @click="uploadFile()">
                  <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
                </li> -->
              </ul>
              <div class="item unchecked" @click="uploadFile()" v-if="!form.ex_pics || (!!form.ex_pics && form.ex_pics.length < 8)">
                <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="上传文件:" prop="address">
            <multiple-files-upload :filesList="form.ex_files" :acceptType="'.doc,.docx,.pdf,.xls,.xlsx'" :isPreviewable="true" @upload-update-success="uploadUpdateSuccess" :disabled="curSelecedType == 'detail'"></multiple-files-upload>
          </el-form-item> 
        </div>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import multipleFilesUpload from "@/components/multiple-files-upload";
import imageBox from './image-box';
import getPartyOrgSelectTree from "@/components/base/formModel/tree/get-party-org-select-tree";
import getPartyPersonnelSelectTree from "@/components/base/formModel/tree/get-party-personnel-select-tree";
export default {
  components: {multipleFilesUpload,imageBox,getPartyOrgSelectTree, getPartyPersonnelSelectTree},
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
      nameOptions:[{
        value: '组织',
        label: '组织'
      }, {
        value: '党员',
        label: '党员'
      }],
      form: {
        id: "",
        name: "组织",
        level: "",
        organ: "",
        ex_organ_ids: [],
        ex_user_ids: [],
        ratify_date: "",
        remark: "",
        ex_pics:[],
        ex_files:[]
      },
      basicRules: {
        name: [
          { required: true, message: "请输入荣誉类型", trigger: "change" },
        ],
        level: [
          { required: true, message: "请填写荣誉类型", trigger: "change" },
        ],
        organ: [
          { required: true, message: "请输入批准机关", trigger: "change" },
        ],
        ex_organ_ids: [
          { required: true, message: "请选择奖党组织", trigger: "change" },
        ],
        ex_user_ids: [
          { required: true, message: "请选择获奖人员", trigger: "change" },
        ],
        ratify_date: [
          { required: true, message: "请选择批准时间", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        if(this.curSelecedType == 'add') {
          this.setDate();
        }
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
    // 设置默认日期为当天
    setDate() {
      let date = new Date();
      // date.setTime(new Date().getTime());
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      let hours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()
      let minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
      let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
      this.form.ratify_date = Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes + ':' + seconds
    },
    // 选择党组织带出党人员
    selectedPartyOrg(orgIds, nodes) {
      return
      console.log(orgIds, nodes);
      if(orgIds.length > 0) {
        let params = {
          context: orgIds
        }
        this.$client
          .OrganUserListPartyRecord(params)
          .then((res) => {
            if (res.head.result == "200") {
              this.form.ex_user_ids = res.context
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
          })
      }else{
        this.form.ex_user_ids = [];
        this.$refs.getPartyOrgSelectTree.onClear();
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
      this.form.ex_files = filesList;
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

.name-content>.el-form-item /deep/ .el-input,.el-input--mini {
  width: 500px;
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

