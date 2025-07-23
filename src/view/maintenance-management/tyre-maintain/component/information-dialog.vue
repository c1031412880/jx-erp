<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
  >
    <div class="el-dialog-div">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <div class="el-dialog-div-content">
            <el-form
              :model="form"
              :rules="basicRules"
              ref="form"
              label-width="140px"
              size="mini"
            >
              <el-form-item label="轮胎编号:" prop="tyre_id">
                <get-tyre-code
                  v-model="form.tyre_id"
                  @change="selectTyreCode"
                  :disabled="curSelecedType == 'detail'"
                ></get-tyre-code>
              </el-form-item>
              <el-form-item label="车辆:" prop="vehicle_id">
                <get-vehicle-select-tree
                  ref="vehicleTree"
                  :placeholder="'选择车辆自编号'"
                  :isShowCheckbox="false"
                  v-model="form.vehicle_id"
                  :isExportMultiple="false"
                  :width="'360'"
                  :disabled="true"
                >
                </get-vehicle-select-tree>
              </el-form-item>
              <el-form-item label="轮胎规格型号:" prop="tyre_model_id">
                <get-tyre-model
                  v-model="form.tyre_model_id"
                  :disabled="true"
                ></get-tyre-model>
              </el-form-item>
              <el-form-item label="轮胎随车里程:" prop="mileage">
                <el-input
                  v-model="form.mileage"
                  placeholder="请输入轮胎随车里程"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.mileage = $event.target.value"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="位置:" prop="position">
                <get-select-dictionaries
                  v-model="form.position"
                  :classKey="'轮胎安装位置'"
                  :placeholder="'请选择安装位置'"
                  :isMultiple="false"
                  :disabled="true"
                ></get-select-dictionaries>
              </el-form-item>
              <el-form-item label="轮胎损坏情况:" prop="fail_describe">
                <el-input
                  v-model="form.fail_describe"
                  type="textarea"
                  maxlength="200"
                  :rows="4"
                  show-word-limit
                  placeholder="请输入轮胎损坏情况"
                  :disabled="curSelecedType == 'detail'"
                ></el-input>
              </el-form-item>
              <el-form-item label="更换场站:" prop="replace_station">
                <el-input
                  v-model="form.replace_station"
                  placeholder="请输入更换场站"
                  :disabled="curSelecedType == 'detail'"
                ></el-input>
              </el-form-item>

              <el-form-item label="处理方式:" prop="treatment_method">
                <el-select
                  v-model="form.treatment_method"
                  clearable
                  placeholder="请选择处理方式"
                  :disabled="curSelecedType == 'detail'"
                >
                  <el-option
                    v-for="item in repairsTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="日期:" prop="date">
                <el-date-picker
                  v-model="form.date"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                  :disabled="curSelecedType == 'detail'"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="备注:" prop="remark">
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  maxlength="200"
                  :rows="4"
                  show-word-limit
                  placeholder="请输入备注"
                  :disabled="curSelecedType == 'detail'"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="相关图片" name="second">
          <div class="el-dialog-div-image">
            <image-list-upload
              ref="laborInfo"
              :action="'/api/ERPWeb/EmployeeManage/UploadPicture'"
              :imgData="tyreMaintainData"
              :picturePathList="picturePathList"
              :imageHeight="340"
              :isShowRemark="false"
              :ImageBoxName="'tyreMaintainData'"
              @on-add-img="addTyreMaintainImg(arguments)"
              @on-del="deleteImg(arguments)"
              @on-del-all="deleteAllImg"
              :disabled="curSelecedType == 'detail'"
            ></image-list-upload>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')"
        >保 存</el-button
      >
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import imageListUpload from "@/components/imageListUpload";
import getTyreModel from "@/components/base/formModel/select/get-tyre-model";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getTyreCode from "@/components/base/formModel/select/get-tyre-code";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: {
    imageListUpload,
    getTyreModel,
    getVehicleSelectTree,
    getTyreCode,
    getSelectDictionaries,
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {},
  data() {
    return {
      activeName: "first",
      repairsTypeOptions: [
        {
          value: 1,
          label: "报废",
        },
        {
          value: 2,
          label: "补修 ",
        },
        {
          value: 3,
          label: "翻新",
        },
      ],
      form: {
        id: "",
        // tyre_number: "",
        tyre_id: "",
        vehicle_id: "",
        tyre_model_id: "",
        date: "",
        mileage: "",
        fail_describe: "",
        position: "",
        replace_station: "",
        treatment_method: "",
        remark: "",
        ImgPaths: [],
        tyre_vehicle_id: "",
      },
      basicRules: {
        tyre_id: [
          { required: true, message: "请选择轮胎编号", trigger: "change" },
        ],
        treatment_method: [
          { required: true, message: "请选择处理方式", trigger: "change" },
        ],
        date: [{ required: true, message: "请选择日期", trigger: "change" }],
      },
      tyreMaintainData: [],
      picturePathList: [],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        if (this.curSelecedType == "add") {
          this.setDate();
        }
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      }
    },
  },
  methods: {
    dialogClose() {
      this.restData();
      this.$emit("update:dialogBool", false);
    },
    restData() {
      this.$refs.vehicleTree.onClear();
    },
    // 设置默认日期为当天
    setDate() {
      let date = new Date();
      // date.setTime(new Date().getTime());
      let Y = date.getFullYear();
      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      this.form.date = Y + "-" + M + "-" + D;
    },
    // 选择轮胎编号
    selectTyreCode(info) {
      // console.log(info);
      if (info) {
        this.form.vehicle_id = info.vehicle_id;
        this.form.tyre_model_id = info.tyre_mode && info.tyre_mode.id;
        this.form.mileage =
          (info.tyre_vehicle_info && info.tyre_vehicle_info.mileage) || "";
        this.form.position = !!info.position ? Number(info.position) : "";
        this.form.tyre_vehicle_id = info.tyre_vehicle_id;
      }
    },
    // 添加图片
    addTyreMaintainImg(msg) {
      // console.log('addVehLicenseImg',JSON.stringify(msg) ,msg)
      let lastChildId = 0;
      if (this.tyreMaintainData.length > 0) {
        lastChildId =
          this.tyreMaintainData[this.tyreMaintainData.length - 1].id;
      }
      let imgSort = lastChildId + 1;
      let Obj = {
        id: imgSort,
        image_path: msg[0],
        isStore: false, // 是否存储到数据表里   如果只是新增图片，则isStore 为 false
      };
      this.tyreMaintainData.push(Obj);
      this.picturePathList.push(msg[0]);
    },

    // 删除图片
    deleteImg(msg) {
      //  console.log(msg[0],msg[1])
      let item = msg[0];
      let flag = msg[1];

      this[`${flag}`].forEach((element, index) => {
        if (element.id == item.id) {
          this[`${flag}`].splice(index, 1);
          this.picturePathList.splice(index, 1);
        }
      });
    },
    // 删除所有图片
    deleteAllImg(val) {
      // console.log(this[`${val}`])
      this[`${val}`] = [];
      this.picturePathList = [];
    },
    saveRemark(remark, picName) {
      console.log(remark, picName);
      switch (picName) {
        case "VehicleLicenseData":
          this.VehicleLicenseDataRemark = remark;
          break;
      }
    },
    
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = { ...this.form };
          if (!info.vehicle_id) {
            delete info.vehicle_id;
          }
          delete info.tyre_model_id;
          delete info.mileage;
          delete info.position;
          if (this.tyreMaintainData.length > 0) {
            info.ImgPaths = this.tyreMaintainData.map((item) => {
              return item.image_path;
            });
          }
          if (!this.form.tyre_vehicle_id) {
            info.tyre_vehicle_id = "";
          }
          // console.log(info)
          // return
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
.el-dialog-div-content {
  height: 350px;
  overflow-y: scroll;
}

.el-dialog-div-image {
  height: 350px;
}

.el-dialog-div /deep/ .el-input {
  width: 400px;
}
</style>

