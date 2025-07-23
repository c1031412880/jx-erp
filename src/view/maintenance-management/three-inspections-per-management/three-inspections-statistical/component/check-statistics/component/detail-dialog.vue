<template>
  <el-dialog
    :visible="dialogBool"
    :title="titleName"
    :before-close="dialogClose"
    top="30px"
    width="760px"
  >
    <div class="el-dialog-div">
      <el-form
        class="basic-form"
        ref="basic_info"
        label-width="140px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="司机">
              <el-input v-model="form.driver_name" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号">
              <el-input v-model="form.driver_work_code" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门">
              <el-input v-model="form.dept_name" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查类型">
              <el-input v-model="form.check_type" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号（自编号）">
              <el-input v-model="form.vehicle_name_code" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="线路">
              <el-input v-model="form.line_name" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查时间">
              <el-input v-model="form.date" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查地点">
              <el-input v-model="form.check_address" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div style="font-size: 16px;font-weight: bold;color:#409eff;line-height:14px;margin-bottom:20px;padding-left: 10px;border-left: 5px solid #409eff;">检查项目</div>
          </el-col>
          <template v-for="item in form.details">
            <el-col :span="24" :key="item.item_id">
              <el-form-item label=""  prop="paper_complete">
                <p style="font-size: 16px;font-weight: bold;color:#000;line-height:14px;margin-bottom:5px">
                  项目: {{ item.check_name }}
                </p>
                <p style="font-size: 14px;color: #999;;line-height:14px;margin-bottom:5px">
                  内容: {{ item.check_content }}
                </p>
                <p style="font-size: 14px;color: #f7ad3a;;line-height:14px;margin-bottom:5px">
                  技术要求: {{ item.technical_require }}
                </p>
                <image-file-upload 
                  v-if="item.noraml == 2"
                  :images="item.imgList"
                  :showTitle="''"
                  :isShowBox="false">
                </image-file-upload>
                <el-input
                  class="my-input"
                  v-if="item.noraml == 2"
                  v-model="item.remark"
                  placeholder="请输入异常描述"
                  style="width: 100%;"
                  disabled
                ></el-input>
                <div style="text-align: right;" class="groupBox">
                  <el-radio-group v-model="item.noraml" size="small" disabled>
                    <el-radio-button :label="1">正常</el-radio-button>
                    <el-radio-button :label="2">异常</el-radio-button>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="24">
            <el-form-item label="检查图片">
              <image-file-upload
                :images="form.vehicle_images"
                :showImageName="true"
                :showTitle="''"
                :isShowBox="false">
              </image-file-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                type="textarea"
                :rows="2"
                v-model="form.remark"
                placeholder="请输入内容"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.handle_state !== 1">
          <el-col :span="24">
            <div style="font-size: 16px;font-weight: bold;color:#409eff;line-height:14px;margin-bottom:20px;padding-left: 10px;border-left: 5px solid #409eff;">处理情况</div>
          </el-col>
          <el-form-item label="处理结果:">
            <el-select v-model="form.handle_result" disabled placeholder="请选择">
              <el-option
                v-for="item in resultsList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理备注:">
            <el-input v-model="form.handle_remark" type="textarea" :rows="2"  placeholder="请输入处理备注" disabled></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import imageFileUpload from "@/components/imageFileUpload/index";
export default {
  components: { imageFileUpload },
  props: {
    dialogBool: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      form: {
        driver_name: "",
        driver_work_code: "",
        dept_name: "",
        check_type: "",
        vehicle_name_code: "",
        line_name: "",
        date: "",
        details: [],
        remark: "",
        vehicle_images: [],
        check_address: "",
        handle_result: "",
        handle_remark: "",
        handle_state: "",
      },
      titleName: '',
      resultsList: [
        {
          value: 1,
          label: '继续行驶'
        },
        {
          value: 2,
          label: '停驶'
        },
      ],
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
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    //设置查看回显
    setData(info,name) {
      this.titleName = `${name}检查详情`
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(info, key)) {
          this.form[key] = info[key]
        }
      }
      let imgs = ''
      if (info.img && Array.isArray(info.img) && info.img.length > 0) {
        imgs = JSON.parse(info.img)
        if (imgs.length > 0) {
          this.form.details.forEach(item => {
            imgs.forEach(child => {
              if (item.item_id == child.item_id) {
                item.imgList = child.imgList || [] 
              }
            })
          })
        }
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.el-dialog-div {
  max-height: 780px;
  padding-right: 15px;
  overflow:auto;
  .groupBox {
  /deep/  .el-radio-button__orig-radio:disabled:checked+.el-radio-button__inner {
      background: #409EFF;
      color: #fff;
    }
  }
}
</style>
