<template>
  <el-dialog :visible="dialogBool" :title="title" :before-close="dialogClose" width="50%" >
    <div style="height:400px;overflow-x:hidden">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" size="medium" label-width="100px"
        label-position="left">
        <el-col :span="12">
          <el-form-item label="车辆型号" prop="veh_code">
            <el-input v-model="formData.veh_code" placeholder="请输入车辆型号" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="height: 180px;float: right">

          <div class="el-form-row-first-right">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="avatar-uploader-icon"><el-button class="el-icon-upload2">上传图片</el-button></i>
            </el-upload>
          </div>

          <!-- <el-form-item style="height: 100%;border: 2px solid;"> -->
            <!-- <img :src="this.img_src"> -->
            <!-- <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="avatar-uploader-icon"><el-button class="el-icon-upload2">上传图片</el-button></i>
            </el-upload>
          </el-form-item> -->
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆类型" prop="veh_name">
            <el-input v-model="formData.veh_name" placeholder="请输入车辆类型" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产厂家" prop="vhe_group">
            <el-input v-model="formData.vhe_group" placeholder="请选择生产厂家" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="座位数" prop="car_frame_number">
            <el-input v-model="formData.car_frame_number" placeholder="请输入车架号码" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="核载数" prop="register_number">
            <el-input v-model="formData.register_number" placeholder="请输入登记证书号码" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排量(ml)" prop="car_frame_number">
            <el-input v-model="formData.car_frame_number" placeholder="请输入车架号码" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排放标准" prop="car_frame_number">
            <el-input v-model="formData.car_frame_number" placeholder="请输入车架号码" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>


        <el-col :span="12">
          <el-form-item label="燃料类型" prop="car_frame_number">
            <el-input v-model="formData.car_frame_number" placeholder="请输入车架号码" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车身颜色" prop="car_frame_number">
            <el-input v-model="formData.car_frame_number" placeholder="请输入车架号码" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="长度(mm)" prop="car_frame_number">
            <el-input v-model="formData.car_frame_number" placeholder="请输入车架号码" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="宽度(mm)" prop="car_frame_number">
            <el-input v-model="formData.car_frame_number" placeholder="请输入车架号码" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="高度(mm)" prop="car_frame_number">
            <el-input v-model="formData.car_frame_number" placeholder="请输入车架号码" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="前后轮距(mm)" prop="car_frame_number">
            <el-input v-model="formData.car_frame_number" placeholder="请输入车架号码" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="轴距(mm)" prop="car_frame_number">
            <el-input v-model="formData.car_frame_number" placeholder="请输入车架号码" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="整车整备质量(kg)" prop="car_frame_number">
            <el-input v-model="formData.car_frame_number" placeholder="请输入车架号码" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="总质量(kg)" prop="car_frame_number">
            <el-input v-model="formData.car_frame_number" placeholder="请输入车架号码" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import p1 from "../../../../../assets/veh_svg/1.png";
export default {
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: '车辆信息维护'
    }
  },
  data() {
    return {
      imageUrl:"",
      img_src: p1,
      formData: {
        veh_code: undefined,
        veh_name: undefined,
        vhe_group: undefined,
        car_frame_number: undefined,
        register_number: undefined,
        register_date: null,
        out_factory_date: null,
        insurance_date: null,
        maintenance_date: null,
        veh_type: undefined,
        product_factory: undefined,
        seat_count: undefined,
        allow_number: undefined,
        auto_emissions: undefined,
        emission_standards: undefined,
        fuel_type: undefined,
        car_body_color: undefined,
        car_length: undefined,
        car_width: undefined,
        car_height: undefined,
        wheel_distance: undefined,
        wheelbase: undefined,
        vehicle_weight: undefined,
        all_weight: undefined,
        coefficient: undefined,
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png' ;
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    updatePlaybill() {
      if (!this.form.c_name) {
        this.$message({ message: "请输入品名", type: "warning" })
        return false
      }
      if (!this.form.type_id) {
        this.$message({ message: "请选择物资类别", type: "warning" })
        return false
      }
      if (!this.form.c_unit) {
        this.$message({ message: "请输入单位", type: "warning" })
        return false
      }
      if (!this.form.c_kind) {
        this.$message({ message: "请输入型号", type: "warning" })
        return false
      }
      if (!this.form.c_product_area) {
        this.$message({ message: "请输入产地", type: "warning" })
        return false
      }
      if (!this.form.n_price) {
        this.$message({ message: "请输入价格", type: "warning" })
        return false
      }
      if (!this.form.c_code) {
        this.$message({ message: "请输入条形编码", type: "warning" })
        return false
      }
      this.$emit("on-ok", this.form);
      this.dialogClose()
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-form-row-first-right{
    width: 35%;
    height: 50px;
    margin-left: 30%;
    margin-top: 20%;
}
</style>
