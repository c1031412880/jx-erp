<template>
  <el-dialog
    :modal="false"
    :visible="dialogBool"
    :title="title + '车辆维修记录'"
    :before-close="dialogClose"
    width="760px"
    
    append-to-body
    class="repair-info-dialog"
  >
    <div class="el-dialog-div">
      <el-form ref="form" size="mini" :model="form" :rules="rules" label-width="130px" label-suffix=":">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="关联审批单" prop="flow_id">
              <!-- <el-input v-model="form.flow_id" style="width:100%" disabled placeholder="请选择关联维修单"></el-input> -->
              <el-input v-model="repair_name" @click.native="choiceOver()" class="over" style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修日期" prop="repair_date">
              <el-date-picker
                :disabled="disabled"
                style="width:100%"
                v-model="form.repair_date"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号" prop="bus_code">
              <el-input v-model="form.bus_code" style="width:100%" disabled placeholder="请输入车牌号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修金额（元）" prop="repair_fee">
              <el-input-number v-model="form.repair_fee" style="width:100%" :disabled="disabled"  :min="0" :precision="2" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修负责人" prop="repair_user">
              <get-department-select
                ref="personalTree"
                v-model="form.repair_user"
                :isShowCheckbox="false"
                :placeholder="'请选择保养负责人'"
                :isContainEmp="true"
                :show_all="true"
                :isExportMultiple="false"
                :disabled="disabled"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" style="width:100%" :disabled="disabled" type="textarea" :rows="4" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row style="margin-bottom:15px">
          <el-col :span="24" style="display:flex;align-items:center;padding-bottom:10px">
            <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
            <p style="margin-left:5px;color:#000;font-size:14px;">保险相关图片</p>
          </el-col>
          <template v-for="(item,index) in form.img_list" >
            <el-col :span="8" :key="index" class="image-box">
              <el-image fit="fill" :src="item" style="width:100%;height:100%"></el-image>
              <div class="box">
                <i class="el-icon-delete" @click="imageDelete(index)"></i>
              </div>
            </el-col>
          </template>
          <el-col :span="8" v-if="form.img_list.length < 3 && !disabled" style="height:180px;border:1px dashed #409EFF">
            <div style="height:100%;padding-top:50px;text-align:center;">
              <el-button type="primary" @click="uploadFile">选择图片</el-button>
              <p style="padding-top:20px">仅支持上传jpg/png格式文件</p>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="display:flex;align-items:center;padding-bottom:10px;justify-content: space-between;">
            <div style="display:flex;align-items:center;width:150px;">
              <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
              <p style="margin-left:5px;color:#000;font-size:14px;">保险相关资料</p>
            </div>
            <el-upload
              v-if="!disabled"
              class="upload-demo"
              ref="uploadDocomnet"
              action="string"
              :on-change="handlePreview"
              accept=".rar,.zip,.doc,.docx,.pdf "
              :show-file-list="false"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary" class="el-icon-upload">选择文件</el-button>
            </el-upload>
          </el-col>
          <el-col :span="24">
            <div class="el-upload__tip" style="padding-bottom:15px;">支持格式：.rar .zip .doc .docx .pdf ，单个文件不能超过10MB，最多只能保存5个文件</div>
            <ul class="document-content show-flex-box-c" style="margin-top:10px">
              <li class="show-flex-box-r" style="margin-bottom:10px;justify-content:space-between;" v-for="(item,index) in form.file_list" :key="index">
                <span class="show-flex-box-r">
                  <i class="el-icon-document-remove" style="margin-right:6px;font-size: 16px"></i>
                  <span>{{item.name}}</span>
                </span>
                <div class="show-flex-box-r">
                  <el-button type="text" style="padding:0" @click="downloadDocument(item)">下载</el-button>
                  <el-button type="text" style="padding:0" @click="deleteDocument(item,index)">删除</el-button>
                </div>
              </li>
            </ul>
          </el-col>
        </el-row> -->
        <el-row>
          <image-file-upload
            :images="form.img_list"
            :files="form.file_list"
            :maxUpLoadSize="100"
            :isPreview="false"
            @files-update-success="filesUpdateSuccess"
            @images-update-success="imagesUpdateSuccess"></image-file-upload>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" v-if="!disabled">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="submit()">保 存</el-button>
    </span>
    <el-dialog
      title="选择维修单"
      v-if="overVisible"
      :append-to-body="true"
      :modal="false"
      width="70%"
      :visible.sync="overVisible">
      <el-table
        ref="table"
        :data="repairList"
        tooltip-effect="dark"
        height="500"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="申请人" prop="user_name"></el-table-column>
        <el-table-column label="申请部门" prop="dept_name"></el-table-column>
        <el-table-column label="维修日期" prop="repair_date"></el-table-column>
        <el-table-column label="车牌号" prop="code"></el-table-column>
        <el-table-column label="预估材料费总金额（元）" width="200" prop="material_total_fee"></el-table-column>
        <el-table-column label="预估工时费总金额（元）" width="200" prop="hour_total_fee"></el-table-column>
        <el-table-column label="预估总金额（元）" width="170" prop="repair_total_fee"></el-table-column>
        <el-table-column label="审批单编号" width="160">
          <template slot-scope="scope" >
            <el-button type="text" @click="openApply(scope.row, 1)">{{scope.row.flow_code}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="审批状态" prop="state_name"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer" style="text-align:right">
        <el-button @click="overVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="checked_name" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import imageFileUpload from "@/components/imageFileUpload/index";
import { getUser } from '@/utils/auth';
import {formatDate} from "@/utils/index"
export default {
  components: {
    imageFileUpload,
    getDepartmentSelect
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
    disabled: Boolean,
    bus_code: {
      type: String,
      default: "",
    },
    bus_id: null
    // bus_id: {
    //   type: String,
    //   default: "",
    // }
  },
  data() {
    return {
      form: {
        id: 0,
        flow_id: 0,
        repair_date: '',
        bus_code: "",
        repair_fee: "",
        repair_user: "",
        flow_title: '',
        remark: "",
        img_list: [],
        file_list: []
      },
      repairList: [],
      overVisible: false,
      repair_name: '',
      overInfo: null,
      rules: {
        repair_date: [
          {
            required: true,
            message: "请选择维修日期",
            trigger: "change",
          },
        ],
        bus_code: [
          {
            required: true,
            message: "请输入车牌号",
            trigger: "change",
          },
        ],
        repair_fee: [
          {
            required: true,
            message: "请输入维修金额",
            trigger: "change",
          },
        ],
      }
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data.form, this.$options.data().form);
        this.epairList = [],
        this.overVisible = false,
        this.repair_name = '',
        this.overInfo = null,
        this.resetFrom();
      }else{
        this.$nextTick( () => {
          this.$refs["form"].resetFields();
        })
      }
    },
  },
  mounted() {
    this.form.repair_date = formatDate(new Date(),"yyyy-MM-dd")
    this.form.bus_code = this.bus_code
    if (getUser()) {
      this.form.repair_user = Number(JSON.parse(getUser()).user_id)
    }
    this.GetListOaFormRepairReq()
  },
  methods: {
    // 选择审批单
    choiceOver() {
      this.overVisible = true
      if (this.repair_name) {
        setTimeout(() => {
          this.repairList.forEach(item => {
            if (this.form.flow_id === item.id) {
              this.$refs.table.toggleRowSelection(item, true)
            }
          })
        }, 60);
      }
    },
    checked_name() {
      this.form.flow_id = this.overInfo.flow_id
      this.repair_name = this.overInfo.user_name + "提交的公车维修单"
      this.form.repair_fee = this.overInfo.repair_total_fee
      this.overVisible = false
    },
    // 多选只能选一个
    handleSelectionChange(val) {
      this.overInfo = val[0]
      this.repairList.forEach(item => {
        if (val[val.length - 1] === item) {
          this.$refs.table.toggleRowSelection(item, true)
        } else {
          this.$refs.table.toggleRowSelection(item, false)
        }
      })
    },
    // 查询维修单
    GetListOaFormRepairReq() {
      this.loading = false
      let params = {
        state: 2,
        bus_id: this.bus_id
      }
      this.$client.GetListOaFormRepairReq(params).then(res => {
        if (res.head.result === "200") {
          this.repairList = res.context
        }
        this.loading = true
      })
    },
    // 审批单查看
    openApply(row, type) {
      // let div = document.getElementsByClassName('v-modal')
      // this.$set(div[0].style, 'z-index', -1)
      this.overVisible = false
      this.dialogClose()
      this.$parent.checkDetail(row, type)
      // let detail_id = 1230, title = '公车维修申请'
      // this.$router.push({
      //   path: `/news-details/${row.id}/${title}/${detail_id}`
      // })
    },
    // 重置
    resetFrom() {
      this.$refs.personalTree.onClear()
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 数据回显
    setData(val){
      console.log(val);
      Object.keys(this.form).forEach(key => {
        if (val.hasOwnProperty(key)) {
          this.form[key] = val[key]
        }
      })
      this.repair_name = val.flow_title
    },
    // 保存
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit("on-ok",this.form,this.curSelecedType)
        } else {
          reject({
            msg: '获取失败,带星号的为必填项'
          });
          return false;
        }
      });
    },
    // 上传图片
    imagesUpdateSuccess(val) {
      let url = '';let list = [];val.forEach(item => {url = item.url ? item.url : item;list.push(url);});this.form.img_list = list
    },
    // 上传文件
    filesUpdateSuccess(filesList) {
      this.form.file_list = filesList;
      // console.log(this.form, filesList);
    },
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      // input.accept = "image/*";
      input.accept = ".jpg,.png";
      input.onchange = () => {
        console.log(input.files);
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        if(!this.beforeUpload(file)) {
          return
        }
        reader.onload = (ev) => {
          input = undefined;
        };
        let formData = new FormData();
        formData.append("file", file);
        let params = {
          file: formData,
        };
        this.$client.uploadPictureMeetingRoom(params)
        .then(res => {
          if(res.head.result == '200') {
            // this.form.img_url = res.context;
            this.form.img_list.push(res.context)
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
      };
      input.click();
    },
    // 判断文件大小
    beforeUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({type: 'error', message: '请不要上传大小超过1M的文件', showClose: true})
      return false
    },
    // 判断文件大小
    beforeFileUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 20
      if (isLt1M) {
        return true
      }
      this.$message({type: 'error', message: '请不要上传大小超过10M的文件', showClose: true})
      return false
    },
    // 判断文件类型
    beforeUploadFileType(file) {
      let acceptType = '.rar,.zip,.doc,.docx,.pdf'
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1)
      if(acceptType.indexOf(fileSuffix) === -1) {
        this.$message({type: 'warning', message: `只能上传${acceptType}类型的文件`, showClose: true})
        return false
      }else{
        return true
      }
    },
    // 上传资料
    handlePreview(file) {
      if( this.form.file_list.length > 4) {
         this.$message({type: 'warning', message: '最多只能上传五个文件', showClose: true})
        return
      }
      if (this.beforeFileUpload(file) && this.beforeUploadFileType(file)) {
        this.uploadAccidentDataFiles(file)
      }
    },
    // 上传相关资料文件
    uploadAccidentDataFiles(file) {
       // let parmas ={
      //   file: file.row
      // };
      console.log(file)
      let formData = new FormData();
      formData.append("file", file.raw);

      let params = {
        file: formData,
      };
      let fileName = file.name;
      this.$client.AddTxtfileUpload(params).then(res => {
        if(res.head.result == "200") {
          let fileObj = {
            name: fileName,
            url: res.context,
            size: file.size
          }
          this.form.file_list.push(fileObj)
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
    // 下载文件
    downloadDocument(item) {
      // console.log(item)
      window.location.href = item.url
      this.$message({type: 'success', message: '下载成功'})
    },
    // 删除文件
    deleteDocument(item,index) {
      this.form.file_list.splice(index, 1)
      // this.$refs.uploadDocomnet.uploadFiles.splice(index, 1)
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.repair-info-dialog {
  .image-box {
    height:180px;
    position: relative;
  }
  .image-box:hover {
    .box {
      display: block;
      background-color: rgba(0,0,0,0.3);
    }
  }
  .box {
    display: none;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    line-height: 180px;
    i {
      font-size: 18px;
      cursor: pointer;
      color: red;
    }
  }
  .over {
    /deep/ .el-input__inner {
      cursor: pointer;
      background-color: #fff
    }
  }
}
</style>

