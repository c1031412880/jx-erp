<template>
  <div class="accident-cost" :style="`height:${curChangeType == 'detail'?'470':'400'}px; overflow-x: hidden`">
    <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="140px"
    >
      <div v-if="curChangeType != 'add'">
        <div class="show-flex-box-r" style="align-items: center;">
          <i style="float:left;width: 6px;height: 18px; background: #409EFF;"></i> 
          <p style="width:100px;margin-left:15px;color:#409EFF;font-size:16px;font-weight:bold">教育记录</p>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="教育时间:" prop="date">
            <el-date-picker
                v-model="formData.date"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :disabled="curChangeType=='detail'">
              </el-date-picker>
          </el-form-item>
          <el-form-item label="教育地点:" prop="address">
            <el-input
              placeholder="请输入教育地点"
              v-model="formData.address"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="教育人:" prop="host_id">
            <get-department-select
              ref="personalTree"
              v-model="formData.host_id"
              :width="'220'"
              :isShowCheckbox="false"
              :placeholder="'请选择教育人'"
              :isContainEmp="true"
              :isExportMultiple="false"
              :disabled="curChangeType=='detail'"
            ></get-department-select>
            <!-- <get-driver-select-tree
              ref="driverTree"
              v-model="formData.host_id"
              :width="'220'"
              :isShowCheckbox="false"
              :placeholder="'请选择教育人'"
              :isExportMultiple="false"
              :disabled="curChangeType=='detail'"
            ></get-driver-select-tree> -->
          </el-form-item>
          <el-form-item label="记录人:" prop="record_id">
            <get-department-select
              ref="personalTree"
              v-model="formData.record_id"
              :width="'220'"
              :isShowCheckbox="false"
              :placeholder="'请选择记录人'"
              :isContainEmp="true"
              :isExportMultiple="false"
              :disabled="curChangeType=='detail'"
            ></get-department-select>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="教育主要内容记录:" prop="main_content">
            <el-input
              type="textarea"
              v-model="formData.main_content"
              :disabled="curChangeType=='detail'"
              :autosize="{ minRows: 4, maxRows: 8}"
              placeholder="请输入教育主要内容记录"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <image-file-upload 
            showTitle="图片"
            :isShowFiles="false"
            :isEdit="curChangeType !='detail'"
            :images="formData.img_list"
            @images-update-success="imagesUpdateSuccess"></image-file-upload>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import {getSession, getUser} from '@/utils/auth'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import imageFileUpload from "@/components/imageFileUpload/index";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
export default {
  components: {
    getDepartmentSelect,
    imageFileUpload,
    getDriverSelectTree
  },
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      formData: {
        date: "",
        address: '',
        host_id: "",
        record_id: "",
        main_content: "",
        img_list: [],
      },
      rules: {},
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    // 数据回显
    setData(val) {
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(val, key)) {
          // const element = this.formData[key];
          this.formData[key] = val[key]
        }
      }
    },
    // 给父级页面提供得获取本页数据
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs["formData"].validate((valid) => {
          if (!valid) {
            reject({
              result: 400,
              msg: '获取失败,带星号的为必填项'
            });
            return;
          }
          resolve({
            formData: this.formData,
            result: 200,
            msg: "获取成功",
          });
        });
      });
    },
    // 上传图片
    imagesUpdateSuccess(val) {
      let list = []
      val.forEach(item => {
        let url = item.url ? item.url : item
        list.push(url)
      })
      this.formData.img_list = list
    },
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.accident-cost /deep/ .el-date-editor {
  width: 250px;
}
.accident-cost /deep/.el-select,.el-select--mini {
  width: 250px;
}
.accident-cost /deep/ .el-input,.el-input--mini{
  width: 250px;
}

.accident-cost /deep/ .el-textarea {
  width: 620px;
}


</style>
