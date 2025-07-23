<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    width="900px"
    top="20px"
  >
    <el-form :model="form" :rules="basicRules" ref="form" label-width="100px" size="mini">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="会议名称:" prop="name">
            <el-input
              v-model="form.name"
              clearable
              :disabled="curSelectedType === 'detail'"
              placeholder="请输入会议名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="会议日期:" prop="date">
            <el-date-picker
              v-model="date"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 100%; height: 100%"
              :disabled="curSelectedType === 'detail'"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="dateChange"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开会时间:" prop="start_time">
            <el-time-select
              placeholder="请选择"
              :clearable="false"
              v-model="form.start_time"
              style="width: 100px"
              @change="form.end_time = ''"
              :disabled="curSelectedType === 'detail'"
              :picker-options="{
                start: '06:30',
                step: '00:15',
                end: '20:30'
              }"
            ></el-time-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="闭会时间:" prop="end_time">
            <el-time-select
              placeholder="请选择"
              v-model="form.end_time"
              style="width: 100px"
              :disabled="curSelectedType === 'detail'"
              :picker-options="{
                start: form.start_time,
                step: '00:15',
                end: '20:30'
              }"
            ></el-time-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="会议地点:" prop="place_name">
            <!-- <tr-select-dictionaries
              v-model="form.place_id"
              :classKey="'会议地点'"
              style="width: 100%"
              :placeholder="'请选择会议地点'"
              :disabled="curSelectedType === 'detail'"
            ></tr-select-dictionaries> -->
            <el-input
              v-model="form.place_name"
              clearable
              :disabled="curSelectedType === 'detail'"
              placeholder="请输入会议地点"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主持人:" prop="compere">
            <get-department-select
              ref="personalTree1"
              v-model="form.compere"
              :isShowCheckbox="true"
              :placeholder="'请选择主持人'"
              :disabled="curSelectedType === 'detail'"
              :isContainEmp="true"
              :isExportMultiple="true"
            ></get-department-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="记录人:" prop="recorder">
            <get-department-select
              ref="personalTree2"
              v-model="form.recorder"
              :isShowCheckbox="true"
              :placeholder="'请选择记录人'"
              :disabled="curSelectedType === 'detail'"
              :isContainEmp="true"
              :isExportMultiple="true"
            ></get-department-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出席情况:" prop="should_arrive">
            应到
            <el-input-number
              v-model="form.should_arrive"
              style="width: 100px"
              :precision="0"
              :controls="false"
              :disabled="curSelectedType === 'detail'"
              label="描述文字"
            ></el-input-number>
            人， 实到
            <el-input-number
              v-model="form.actual_arrive"
              style="width: 100px"
              :precision="0"
              :controls="false"
              :disabled="curSelectedType === 'detail'"
              label="描述文字"
            ></el-input-number>
            人
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="会议纪要:" prop="message">
            <el-input
              v-model="form.message"
              type="textarea"
              :rows="12"
              show-word-limit
              style="width: 100%"
              :disabled="curSelectedType === 'detail'"
              placeholder="请输入会议纪要"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <image-file-upload
            :images="form.thumbnail_imgs"
            :files="form.files_list"
            :isShowBox="curSelectedType !== 'detail'"
            @files-update-success="filesUpdateSuccess"
            @images-update-success="imagesUpdateSuccess"
          ></image-file-upload>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" v-show="curSelectedType !== 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import imageFileUpload from '@/components/imageFileUpload/index'
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
export default {
  components: { getDepartmentSelect, imageFileUpload },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: '添加'
    },
    curSelectedType: [String]
  },
  data() {
    return {
      date: [],
      form: {
        id: 0,
        name: '',
        date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        place_name: '',
        compere: [],
        recorder: [],
        should_arrive: 0,
        actual_arrive: 0,
        message: '',
        files_list: [],
        thumbnail_imgs: []
      },
      basicRules: {
        name: [{ required: true, message: '请输入会议名称', trigger: 'change' }],
        date: [{ required: true, message: '请输入会议日期', trigger: 'change' }],
        end_date: [{ required: true, message: '请输入结束日期', trigger: 'change' }],
        start_time: [{ required: true, message: '请选择开会时间', trigger: 'change' }],
        end_time: [{ required: true, message: '请选择闭会i时间', trigger: 'change' }],
        place_name: [{ required: true, message: '请入会议地点', trigger: 'change' }],
        compere: [{ required: true, message: '请选择主持人', trigger: 'change' }],
        recorder: [{ required: true, message: '请选择记录人', trigger: 'change' }],
        message: [{ required: true, message: '请输入会议纪要', trigger: 'change' }]
      }
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data())
        this.$refs.personalTree1.onClear()
        this.$refs.personalTree2.onClear()
      } else {
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit('update:dialogBool', false)
    },
    dateChange(value) {
      if (value && value.length) {
        this.form.date = value[0]
        this.form.end_date = value[1]
      } else {
        this.form.date = ''
        this.form.end_date = ''
      }
    },
    setData(row) {
      let info = Object.assign({}, row)
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(info, key)) {
          this.form[key] = info[key]
        }
      }
      this.form.start_time = info.start
      this.form.end_time = info.end
      this.form.compere = info.compere_ids
      this.form.recorder = info.recorder_ids
      this.date = [this.form.date, this.form.end_date]
    },
    // 上传图片
    imagesUpdateSuccess(val) {
      let obj = ''
      let list = []
      val.forEach(item => {
        obj = {
          thumbnail_url: item.thumbnail_url ? item.thumbnail_url : null,
          url: item.url ? item.url : item
        }
        list.push(obj)
      })
      this.form.thumbnail_imgs = list
    },
    // 上传文件
    filesUpdateSuccess(filesList) {
      this.form.files_list = filesList
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let info = { ...this.form }
          this.$emit('save-add-edit-row', info)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
