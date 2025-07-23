<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    width="900px"
  >
    <div class="el-dialog-div">
      <el-form :model="form" ref="form" :rules="basicRules" label-width="130px" size="mini">
        <p style="height: 24px; margin-bottom: 20px">
          <span
            style="
              float: left;
              width: 7px;
              height: 20px;
              background: #31a7ff;
              margin-right: 6px;">
          </span>
          <span
            style="
              line-height: 20px;
              font-weight: 700;
              color: #666666;
              font-size: 18px;
            ">
            违章信息
          </span>
        </p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号(自编号):" prop="i_vehicle_id">
              <get-vehicle-select-tree
                ref="vehicleTree"
                width="200"
                :placeholder="'请选择自编号'"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                :oilType="2"
                v-model="form.i_vehicle_id"
                @on-change="onSelectChange"
                :disabled="curChangeType == 'detail'">
              </get-vehicle-select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属组织:" prop="i_dept_id">
              <get-department-select
                ref="deptTree"
                :isShowCheckbox="false"
                :funcType="1"
                :placeholder="'请选择所属公司'"
                :isExportMultiple="false"
                v-model="form.i_dept_id"
                :disabled="curChangeType == 'detail'">
              </get-department-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="线路:" prop="i_line_id">
              <get-line-select-tree
                ref="lineTree"
                placeholder="请选择线路"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                v-model="form.i_line_id"
                :disabled="curChangeType == 'detail'">
              </get-line-select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="违章时间:" prop="d_violation_date">
              <el-date-picker
                v-model="form.d_violation_date"
                type="datetime"
                placeholder="请选择时间"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                :disabled="curChangeType == 'detail'"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="违章驾驶员:" prop="i_driver_id">
              <get-driver-select-tree
                ref="driverTree"
                v-model="form.i_driver_id"
                :isShowCheckbox="false"
                :placeholder="'请选择司机'"
                :isExportMultiple="false"
                :disabled="curChangeType == 'detail'">
              </get-driver-select-tree>
            </el-form-item> 
          </el-col>
          <el-col :span="12">
            <el-form-item label="违章地点:" prop="c_place">
              <el-input v-model="form.c_place" placeholder="请输入违章地点" clearable :disabled="curChangeType == 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="交警处理结果:" prop="i_state ">
              <!-- <el-select v-model="form.i_state " filterable placeholder="请选择">
                <el-option label="已处理" :value="1"></el-option>
                <el-option label="未处理" :value="2"></el-option>
                <el-option label="复议中" :value="3"></el-option>
                <el-option label="已复议" :value="4"></el-option>
              </el-select> -->
              <get-select-dictionaries 
                v-model="form.i_state" 
                clearable 
                :classKey="'交警处理结果'" 
                :placeholder="'请选择交警处理结果'"
                :disabled="curChangeType == 'detail'">
              </get-select-dictionaries>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="违章项目:" prop="i_violation_id">
              <el-select v-model="form.i_violation_id" clearable placeholder="请选择物品类别" @clear="clearProject" @change="changeProject" :disabled="curChangeType == 'detail'">
                <el-option v-for="(item,index) in projectData" :key="index" :label="item.c_name" :value="item.i_id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="违规扣分:">
              <el-input v-model="form.score" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="违章罚款:">
              <el-input v-model="form.money" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注:" prop="c_remark">
              <el-input type="textarea" :rows="4" v-model="form.c_remark" placeholder="请输入备注" :disabled="curChangeType == 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 20px;padding: 0 45px;">
            <image-file-upload 
              :images="form.evidences_img_list" 
              :files="form.evidences_files_list"
              :isPreview="false"
              :isShowBox="curChangeType == 'detail'  ? false : true"
              @files-update-success="violationFilesUpdateSuccess"
              @images-update-success="violationImagesUpdateSuccess">
            </image-file-upload>
          </el-col>
        </el-row>
        <div>
          <p style="height: 24px; margin-bottom: 20px">
          <span
            style="
              float: left;
              width: 7px;
              height: 20px;
              background: #31a7ff;
              margin-right: 6px;">
          </span>
          <span
            style="
              line-height: 20px;
              font-weight: 700;
              color: #666666;
              font-size: 18px;
            ">
            教育记录
          </span>
        </p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="教育时间:" prop="d_educate_time">
              <el-date-picker
                v-model="form.d_educate_time"
                type="date"
                placeholder="请选择时间"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :disabled="curChangeType == 'detail'"
              ></el-date-picker>
            </el-form-item> 
          </el-col>
          <el-col :span="12">
            <el-form-item label="教育地点:" prop="c_educate_address">
              <el-input v-model="form.c_educate_address" placeholder="请输入教育地点" clearable :disabled="curChangeType == 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="教育人:" prop="i_educate_user">
              <get-all-dept-user-tree
                ref="driverTree2"
                v-model="form.i_educate_user"
                :isShowCheckbox="false"
                :placeholder="'请选择教育人'"
                :isExportMultiple="false"
                :isContainEmp="true"
                :show_all="true"
                clearable
                :disabled="curChangeType == 'detail'">
              </get-all-dept-user-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="记录人:" prop="i_record_user">
              <get-all-dept-user-tree
                ref="personTree2"
                v-model="form.i_record_user"
                :isShowCheckbox="false"
                :placeholder="'请选择记录人'"
                :isContainEmp="true"
                :show_all="true"
                :isExportMultiple="false"
                clearable
                :disabled="curChangeType == 'detail'"
              ></get-all-dept-user-tree>
            </el-form-item> 
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="是否扣除安全奖:" prop="deduct_safe">
              <el-radio-group  v-model="form.deduct_safe" :disabled="curChangeType == 'detail'">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="教育主要内容记录:" prop="c_educate_content">
              <el-input type="textarea" :rows="4" v-model="form.c_educate_content" placeholder="请输入" :disabled="curChangeType == 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 20px;padding: 0 45px;">
            <image-file-upload 
              :images="form.img_list" 
              :files="form.files_list"
              :isPreview="false"
              :isShowBox="curChangeType == 'detail'  ? false : true"
              @files-update-success="filesUpdateSuccess"
              @images-update-success="imagesUpdateSuccess">
            </image-file-upload>
          </el-col>
        </el-row>
        </div>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curChangeType !== 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill(3)">完 结</el-button>
      <el-button type="primary" @click="updatePlaybill(1)" v-if="curChangeType == 'add'">保存草稿</el-button>
      <el-button type="primary" @click="updatePlaybill('save')" v-if="curChangeType == 'edit'">保 存</el-button>
      <el-button type="primary" @click="updatePlaybill(2)" v-if="curChangeType !== 'handle' && form.i_order_state !== 2">下 发</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getAllDeptUserTree from "@/components/base/formModel/tree/get-all-dept-user-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import imageFileUpload from "@/components/imageFileUpload/index";
export default {
  components: {
    getDepartmentSelect,
    getLineSelectTree,
    getVehicleSelectTree,
    getDriverSelectTree, 
    getAllDeptUserTree,
    imageFileUpload,
    getSelectDictionaries
  },
  props: {
    dialogBool: Boolean,
    curChangeType: {
      type: String,
      default: "add" //add添加  edit编辑  detail详情
    },
  },
  mounted() {
  },
  data() {
    return {
      title: "添加违章",
      date: [],
      projectData: [],//违章项目下拉框
      form: {
        i_id: 0,
        i_order_state: 0,
        state: 1,
        i_vehicle_id: "",
        i_dept_id: "",
        i_line_id: "",
        d_violation_date: "",
        i_driver_id: "",
        c_place: "",
        i_state: "",
        i_violation_id: "",
        score: "",
        money: "",
        c_remark: "",
        d_educate_time: "",
        c_educate_address: "",
        i_educate_user: "",
        i_record_user: "",
        deduct_safe: 1,
        c_educate_content: "",
        img_list: [], //教育图片
        files_list: [],
        evidences_img_list: [], //违章图片
        evidences_files_list: [], 
      },
      basicRules: {
        i_vehicle_id: [
          {
            required: true,
            message: "请选择车辆",
            trigger: "change",
          },
        ],
        i_dept_id: [
          {
            required: true,
            message: "请选择所属公司",
            trigger: "change",
          },
        ],
        i_line_id: [
          {
            required: true,
            message: "请选择线路",
            trigger: "change",
          },
        ],
        // i_driver_id: [
        //   {
        //     required: true,
        //     message: "请选择驾驶员",
        //     trigger: "change",
        //   },
        // ],
        i_violation_id: [
          {
            required: true,
            message: "请选择违章项目",
            trigger: "change",
          },
        ],
        d_violation_date: [
          {
            required: true,
            message: "请选择违章时间",
            trigger: "change",
          },
        ],
        c_place: [
          {
            required: true,
            message: "请输入违章地点",
            trigger: "change",
          },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetForm()
      }else{
        this.getViolationProject() //获取违章项目
        this.$nextTick(() => {
          switch(this.curChangeType){
            case "add":
              this.title = "添加";
              break;
            case "edit":
              this.title = "编辑";
              break;
            case "detail":
              this.title = "详情";
              break;
            case "handle":
              this.title = "办结";
              break;
          }
          this.$refs.form.clearValidate();
        })
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    //加载违章项目信息
    getViolationProject(){
      this.$client.listViolationItem({context:{}}).then(res => {
        if (res.head.result == "200") {
          this.projectData = res.context.list;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
      });
    },
    //修改违章项目 绑定扣分 罚款
    changeProject(val){
      this.projectData.forEach(item=>{
        if(item.i_id == val){
          this.form.score = item.i_score
          this.form.money = item.n_money
        }
      })
    },
    clearProject(){
      this.form.score = ""
      this.form.money = ""
    },
    //选择车辆 绑定所属公司和线路
    onSelectChange(vhe,node) {
        this.$client.GetVehicleInfoById({ id: vhe }).then((res) => {
          if (res.head.result == "200") {
            this.form.i_dept_id = res.context.dept_id
            this.form.i_line_id = res.context.line_id
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
      // }
    },
    //编辑 查看 数据回显
    setData(val){
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(val, key)) {
          this.form[key] = val[key]; 
        }
      }
    },
    // 上传图片
    imagesUpdateSuccess(imageList) {
      this.form.img_list = imageList.map(item => {
        return {
          file_name: item.name,
          url: item.url
        }
      })
    },
    // 上传文件
    filesUpdateSuccess(filesList) {
      this.form.files_list = filesList.map(item => {
        return {
          file_name: item.name,
          url: item.url
        }
      })
    },
    // 上传图片
    violationImagesUpdateSuccess(imageList) {
      this.form.evidences_img_list = imageList.map(item => {
        return {
          file_name: item.name,
          url: item.url
        }
      })
    },
    // 上传文件
    violationFilesUpdateSuccess(filesList) {
      this.form.evidences_files_list = filesList.map(item => {
        return {
          file_name: item.name,
          url: item.url
        }
      })
    },
    resetForm(){
      this.$refs.vehicleTree.onClear();
      this.$refs.lineTree.onClear();
      this.$refs.deptTree.onClear();
      this.$refs.driverTree.onClear();
      this.$refs.driverTree2.onClear();
      this.$refs.personTree2.onClear();
      this.form.img_list = []
      this.form.files_list = []
      this.form.evidences_img_list = []
      this.form.evidences_files_list = []
    },
    //提交数据
    updatePlaybill(type) {
      this.$refs.form.validate(valid => {
        if (valid) {
          let info = this.form;
          if(type !== 'save'){
            //不是编辑的时候状态通过按钮赋值 编辑的时候保留原有状态
            info.i_order_state = type
          }
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    }
  }
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 450px;
  overflow-y: scroll;
}

.el-dialog-div /deep/ .el-input {
  width: 240px;
}
.el-dialog-div /deep/ .el-textarea {
  width: 661px;
}
</style>

