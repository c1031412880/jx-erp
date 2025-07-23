<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="760px"
    
  >
    <div class="el-dialog-div">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="basiscInfo">
          <el-form
            size="mini"
            :model="form"
            :rules="basicRules"
            ref="form"
            label-width="150px"
          >
            <div class="el-form-row-first">
              <div class="el-form-row-first-left">
                <el-form-item label="车辆型号:" prop="name">
                  <el-input
                    placeholder="请输入车辆型号，建议用品牌+型号"
                    v-model="form.name"
                  ></el-input>
                </el-form-item>
                <el-form-item label="车辆类型:">
                  <get-select-dictionaries v-model="form.kind" :classKey="'车型信息管理车辆类型'" :placeholder="'请选择车辆类型'"></get-select-dictionaries>
                </el-form-item>
                <el-form-item label="生产厂家:">
                  <el-input
                    placeholder="请输入生产厂家"
                    v-model="form.factory"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="el-form-row-first-right show-flex-box-c">
                <div
                  class="avatar-uploader"
                  :class="{ 'have-avatar-active': form.image_path }"
                >
                  <el-image 
                    v-if="form.image_path"
                    class="avatar"
                    :src="form.image_path" 
                    :preview-src-list="[form.image_path]">
                  </el-image>
                  <!-- <img v-if="form.image_path" :src="form.image_path" class="avatar" /> -->
                  <i v-else class="avatar-uploader-icon"
                    ><el-button class="el-icon-upload2" @click="uploadFile">上传图片</el-button></i
                  >
                  <i class="delete-icon el-icon-delete" v-if="form.image_path" @click.stop="deleteImage()"></i>
                </div>
                <el-button icon="el-icon-plus" size="mini" @click="uploadFile" v-if="form.image_path">更换图片</el-button>
              </div>
            </div>
            <div class="el-form-row">
              <el-form-item label="座位数:">
                <el-input
                  placeholder="请输入座位数"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.seats_num = $event.target.value"
                  v-model="form.seats_num"
                ></el-input>
              </el-form-item>
              <el-form-item label="核载数:">
                <el-input
                  placeholder="请输入核载数"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.permit_num = $event.target.value"
                  v-model="form.permit_num"
                ></el-input>
              </el-form-item>
            </div>
            <div class="el-form-row">
              <el-form-item label="排量(ml):">
                <el-input
                  placeholder="请输入排量"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.displacement = $event.target.value"
                  v-model="form.displacement"
                ></el-input>
              </el-form-item>
              <el-form-item label="排放标准:">
                <get-select-dictionaries v-model="form.standard" :classKey="'排放标准'" :placeholder="'请选择排放标准'"></get-select-dictionaries>
              </el-form-item>
            </div>
            <div class="el-form-row">
              <el-form-item label="燃料类型:">
                <get-select-dictionaries v-model="form.fuel" :classKey="'燃料类别'" :placeholder="'请选择燃料类型'"></get-select-dictionaries>
              </el-form-item>
              <el-form-item label="车身颜色:">
                <el-input
                  placeholder="请输入车身颜色"
                  v-model="form.color"
                ></el-input>
              </el-form-item>
            </div>
            <div class="el-form-row">
              <el-form-item label="长度(mm):">
                <el-input
                  placeholder="请输入车辆长度"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.length = $event.target.value"
                  v-model="form.length"
                ></el-input>
              </el-form-item>
              <el-form-item label="宽度(mm):">
                <el-input
                  placeholder="请输入车辆宽度"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.width = $event.target.value"
                  v-model="form.width"
                ></el-input>
              </el-form-item>
            </div>
            <div class="el-form-row">
              <el-form-item label="高度(mm):">
                <el-input
                  placeholder="请输入车辆高度"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.height = $event.target.value"
                  v-model="form.height"
                ></el-input>
              </el-form-item>
              <el-form-item label="前轮距(mm):">
                <el-input
                  placeholder="请输入车辆轮胎间距离"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.wheel_space = $event.target.value"
                  v-model="form.wheel_space"
                ></el-input>
              </el-form-item>
            </div>
            <div class="el-form-row">
              <el-form-item label="后轮距(mm):">
                <el-input
                  placeholder="请输入车辆轮胎间距离"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.rear_track = $event.target.value"
                  v-model="form.rear_track"
                ></el-input>
              </el-form-item>
              <el-form-item label="轴距(mm):">
                <el-input
                  placeholder="请输入车辆轴距"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.shaft_space = $event.target.value"
                  v-model="form.shaft_space"
                ></el-input>
              </el-form-item>
            </div>
            <div class="el-form-row">
               <el-form-item label="整车整备质量(kg):">
                <el-input
                  placeholder="请输入车辆完全装备好的总量"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.permit_quality = $event.target.value"
                  v-model="form.permit_quality"
                ></el-input>
              </el-form-item>
              <el-form-item label="总质量(kg):">
                <el-input
                  placeholder="请输入车辆总质量"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.total_quality = $event.target.value"
                  v-model="form.total_quality"
                ></el-input>
              </el-form-item>
            </div>
            <div class="el-form-row">
              <el-form-item label="标台系数:">
                <el-input
                  placeholder="请输入车辆标台系数:"
                  v-model="form.index"
                ></el-input>
              </el-form-item>
              <el-form-item label="价格:">
                <el-input
                  placeholder="请输入车辆型号价格"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.price = $event.target.value"
                  v-model="form.price"
                ></el-input>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: { getSelectDictionaries },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  data() {
    return {
      carTypeOptions: [
        {
          value: "大客车",
          label: "大客车",
        },
        {
          value: "混动大客",
          label: "混动大客",
        },
        {
          value: "双层大客",
          label: "双层大客",
        },
        {
          value: "中客",
          label: "中客",
        },
        {
          value: "小客",
          label: "小客",
        },
      ],
      value: "",
      effluentStandardOptions: [
        {
          value: "国一",
          label: "国一",
        },
        {
          value: "国二",
          label: "国二",
        },
        {
          value: "国三",
          label: "国三",
        },
        {
          value: "国四",
          label: "国四",
        },
        {
          value: "国五",
          label: "国五",
        },
        {
          value: "国六",
          label: "国六",
        },
      ],
      fuelTypeOptions: [
        {
          value: "柴油",
          label: "柴油",
        },
        {
          value: "LNG",
          label: "LNG",
        },
        {
          value: "插电式混合动力",
          label: "插电式混合动力",
        },
        {
          value: "纯电/快充",
          label: "纯电/快充",
        },
        {
          value: "纯电/慢充",
          label: "纯电/慢充",
        },
      ],
      form: {
        id: "",
        name: "",
        kind: "",
        factory: "",
        seats_num: "",
        permit_num: "",
        displacement: "",
        standard: "",
        fuel: "",
        color: "",
        length: "",
        width: "",
        height: "",
        wheel_space: "",
        rear_track: '',
        shaft_space: "",
        permit_quality: "",
        total_quality: "",
        price:"",
        index: "",
        image_path: "",
        operate_type: "",
      },
      basicRules: {
        name: [
          { required: true, message: "请输入车辆型号", trigger: "change" },
        ],
      },
      imageUrl: "",
      activeName: "basiscInfo",
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetForm();
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("save-add-edit", this.form);
        } else {
          return false;
        }
      });
    },

    // :on-success="handleAvatarSuccess"
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },

    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        console.log(input.files);
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        reader.onload = (ev) => {
          input = undefined;
        };
        let formData = new FormData();
        formData.append("file", file);
        let params = {
          file: formData,
        };
        this.$client.AddCarInfoImageUpload(params)
        .then(res => {
          if(res.head.result == '200') {
            this.form.image_path = res.context;
            console.log(this.form.image_path)
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
    deleteImage() {
      this.form.image_path = '';
    },
    resetForm() {
      this.$refs["form"].resetFields();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
// .el-dialog__wrapper {
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
// }

.el-dialog-div {
  height: 450px;
  overflow-y: scroll;
}

.el-form-row-first {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  .el-form-row-first-left {
    width: 45%;
    height: 145px;
    display: flex;
    flex-direction: column;
  }

  .el-form-row-first-right {
    width: 35%;
    height: 120px;
    // background red
    margin-left: 15%;
    margin-bottom: 30px;
    display: flex;

    .avatar-uploader {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      // border: 1px dashed #d9d9d9;
      // border-radius: 6px;
      cursor: pointer;
      background: url('../../../../../src/assets/veh_svg/uploader-icon.svg') no-repeat center;
      background-size: 100% 100%;
      overflow: hidden;
      object-fit: cover !important;
      position: relative;
      .avatar {
        display: block;
        width: 100%;
        height: 100%;
      }
      .delete-icon{
        position: absolute;
        font-size: 22px;
        top: 0px;
        right: 0px;
        color: #409EFF;
        font-weight: 700;
      }


      // .el-upload {
      //   width: 100% !important;
      //   height: 100% !important;
      //   overflow: hidden !important;
      //   object-fit: cover !important;

      // }
    }

    .have-avatar-active {
      background: none;

      div {
        width: 100% !important;
        height: 100% !important;
      }
    }
  }
}

.el-form-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  .el-form-item {
    width: 45%;
    margin-right: 5%;

    .el-form-item__label {
      white-space: nowrap;
    }
  }
}
</style>

<style scoped>
.el-form-row-first-right /deep/ .have-avatar-active {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
/* .div{
  background: url("../../../../../src/assets/veh_svg/uploader-icon.svg") no-repeat center;
  object-fit: cover;
} */
</style>
