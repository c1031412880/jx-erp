<template>
  <el-dialog :visible="dialogBool"
             :before-close="dialogClose"
             fullscreen
             center>
    <tr-page-header ref="trPageHeader" slot="title" :content="formData.id === 0 ? '添加' : '编辑'" @back="dialogClose"></tr-page-header>
    <el-row>
      <el-col :span="10">
        <el-form :model="formData" ref="formData" label-width="140px">
          <el-card style="margin-bottom: 10px" shadow="hover">
            <div slot="header"><span style="font-weight: bold;color: #FFFFFF">页头设置</span></div>
            <div style="border: 1px solid #57ff00">
              <el-form-item v-for="(item,i) in eContent.titleList" :key="i" label="模板名称:" label-width="80px">
                <el-col :span="12">
                  <el-input
                    placeholder="名称"
                    size="mini"
                    v-model="item.title"
                    @input="setTitleChange"
                  ></el-input>
                </el-col>
                <el-col :span="8" style="display: flex;margin-top: 6px">
                  <el-input-number
                    :min="1"
                    size="mini"
                    style="width: 100px"
                    :max="100"
                    :controls="false"
                    v-model="item.zoom"
                    @input="setTitleChange"
                  />
                  <el-color-picker v-model="item.title_fontColor" size="mini"/>
                </el-col>
                <el-col :span="4">
                  <el-button size="mini" @click="titleDelete(i)">移除</el-button>
                </el-col>
                <el-col :span="6">
                  字号<el-input-number v-model="item.title_fontSize" size="mini" οnkeyup="value=value.replace(/[^\d]/g,0)" :min="10"/>
                </el-col>
                <el-col :span="3">
                  加粗<el-switch v-model="item.title_fontWeight" :active-value="0" :inactive-value="1"></el-switch>
                </el-col>
                <el-col :span="5">
                  <el-select v-model="item.defaultFont" placeholder="请选择" style="width:100%;" size="mini">
                    <el-option v-for="item in fontOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
            </div>
            <el-form-item label-width="80px">
              <el-button size="mini" style="margin-top: 5px" @click="titleAdd()">添加</el-button>
            </el-form-item>
            <el-form-item label="签发人:" >
              <el-input
                placeholder="签发人"
                v-model="eContent.userName"
              ></el-input>
            </el-form-item>
            <el-form-item label="是否带五角星">
              <el-switch
                v-model="eContent.fiveType"
                :active-value="0"
                :inactive-value="1"
                active-text="带"
                inactive-text="不带">
              </el-switch>
            </el-form-item>
            <el-form-item label="是否显示缓急程度">
              <el-switch
                v-model="eContent.degree_view"
                :active-value="0"
                :inactive-value="1"
                active-text="显示在套红中"
                inactive-text="不显示">
              </el-switch>
            </el-form-item>
            <el-form-item label="是否显示保密密级">
              <el-switch
                v-model="eContent.secret_view"
                :active-value="0"
                :inactive-value="1"
                active-text="显示在套红中"
                inactive-text="不显示">
              </el-switch>
            </el-form-item>
            <el-form-item label="套红模板说明:">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8}"
                placeholder="套红模板说明"
                v-model="formData.describe"
              ></el-input>
            </el-form-item>
          </el-card>

          <el-card style="margin-bottom: 10px" shadow="hover">
            <div slot="header"><span style="font-weight: bold;color: #FFFFFF">页脚设置</span></div>
<!--            <el-form-item label="套红模板默认字体:" ></el-form-item>-->
            <el-form-item label="印发部门:" >
              <el-input
                placeholder="印发部门"
                v-model="eContent.department_name_yf"
              ></el-input>
            </el-form-item>
            <el-form-item label="是否显示发文份数">
              <el-switch
                v-model="eContent.post_count_view"
                :active-value="0"
                :inactive-value="1"
                active-text="显示在套红中"
                inactive-text="不显示">
              </el-switch>
            </el-form-item>
            <el-form-item label="是否显示发文日期">
              <el-switch
                v-model="eContent.posy_time_view"
                :active-value="0"
                :inactive-value="1"
                active-text="显示在套红中"
                inactive-text="不显示">
              </el-switch>
            </el-form-item>
            <el-form-item label="是否显示主送单位">
              <el-switch
                v-model="eContent.main_department_view"
                :active-value="0"
                :inactive-value="1"
                active-text="显示在套红中"
                inactive-text="不显示">
              </el-switch>
            </el-form-item>
            <el-form-item label="是否显示抄送单位">
              <el-switch
                v-model="eContent.copy_department_view"
                :active-value="0"
                :inactive-value="1"
                active-text="显示在套红中"
                inactive-text="不显示">
              </el-switch>
            </el-form-item>
            <el-form-item label="是否显示主题词">
              <el-switch
                v-model="eContent.keyword_view"
                :active-value="0"
                :inactive-value="1"
                active-text="显示在套红中"
                inactive-text="不显示">
              </el-switch>
            </el-form-item>
          </el-card>
          <el-form-item>
            <el-button @click="dialogClose">取 消</el-button>
            <el-button type="primary" @click="submitFormData">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="13" :offset="1">
        <el-card style="margin-bottom: 10px" shadow="hover">
          <div slot="header"><span style="font-weight: bold;color: #FFFFFF">预览</span></div>
          <document-content-model v-if="dialogBool" :height="600" :isModel="true" :isContent="false" ref="documentContentModel"/>
        </el-card>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import documentContentModel from '@/components/document-model/content-model'
export default {
  props: {
    dialogBool: Boolean,
  },
  components: {documentContentModel},
  data() {
    return {
      formData: {
        id: 0,
        title: "",
        describe: "",
        content: '',
      },
      eContent: {
        titleList: [
          {
            title: '',
            zoom: 33,
            title_fontSize: 72,
            title_fontColor: '',
            title_fontWeight: 0,
            defaultFont: '宋体',
          }
        ],
        title: '',
        zoom: 33,
        userName: '',
        post_count_view: 0,
        posy_time_view: 0,
        degree_view: 0,
        secret_view: 0,
        main_department_view: 0,
        copy_department_view: 0,
        keyword_view: 0,
        department_name_yf: '',
        // defaultFont: '宋体',
        fiveType: 0,
      },
      fontOptions: [
        {value: '宋体', label: '华文中宋'},
        {value: '方正小标宋简体', label: '方正小标宋简体'},
        {value: '仿宋', label: '华文仿宋'},
      ]
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        setTimeout(() => {
          if(this.$refs.documentContentModel) this.$refs.documentContentModel.editorContent.isTH = true
        }, 100)
      }
    },
    'eContent.fiveType' (newTitle) {
      setTimeout(() => {
        console.log(newTitle)
        if(this.$refs.documentContentModel) this.$refs.documentContentModel.editorContent.fiveType = newTitle
      }, 100)
    },
    'eContent.post_count_view' (newTitle) {
      if(this.$refs.documentContentModel) this.$refs.documentContentModel.editorContent.post_count_view = newTitle
    },
    'eContent.posy_time_view' (newTitle) {
      if(this.$refs.documentContentModel) this.$refs.documentContentModel.editorContent.posy_time_view = newTitle
    },
    'eContent.degree_view' (newTitle) {
      if(this.$refs.documentContentModel) this.$refs.documentContentModel.editorContent.degree_view = newTitle
    },
    'eContent.secret_view' (newTitle) {
      if(this.$refs.documentContentModel) this.$refs.documentContentModel.editorContent.secret_view = newTitle
    },
    'eContent.main_department_view' (newTitle) {
      if(this.$refs.documentContentModel) this.$refs.documentContentModel.editorContent.main_department_view = newTitle
    },
    'eContent.copy_department_view' (newTitle) {
      if(this.$refs.documentContentModel) this.$refs.documentContentModel.editorContent.copy_department_view = newTitle
    },
    'eContent.keyword_view' (newTitle) {
      if(this.$refs.documentContentModel) this.$refs.documentContentModel.editorContent.keyword_view = newTitle
    },
    'eContent.userName'(newText) {
      if(this.$refs.documentContentModel) this.$refs.documentContentModel.editorContent.userName = newText
    },
    'eContent.department_name_yf'(newText) {
      if(this.$refs.documentContentModel) this.$refs.documentContentModel.editorContent.department_name_yf = newText
    },
    // 'eContent.defaultFont'(newText) {
    //   if(this.$refs.documentContentModel) this.$refs.documentContentModel.editorContent.defaultFont = newText
    // },
  },
  methods: {
    titleDelete(i) {
      if (this.eContent.titleList.length > 1) {
        this.eContent.titleList.splice(i, 1)
      } else {
        this.$message.error('至少保留一条');
      }
    },
    // 添加标题
    titleAdd() {
      this.eContent.titleList.push({
        title: '',
        zoom: 33,
        title_fontSize: 72,
        title_fontColor: '',
        title_fontWeight: 0,
        defaultFont: '宋体',
      })
    },
    // 头部事件
    setTitleChange() {
      setTimeout(() => {
        if(this.$refs.documentContentModel) this.$refs.documentContentModel.editorContent.titleList = this.eContent.titleList
      }, 100)
    },
    // 编辑时数据回显
    setData(info){
      Object.keys(info).forEach(key => {
        if (this.formData.hasOwnProperty(key)) {
          this.formData[key] = info[key]
        }
      })
      let objContent = info.content ? JSON.parse(info.content) : {}
      Object.keys(objContent).forEach(key => {
        if (this.eContent.hasOwnProperty(key)) {
          this.eContent[key] = objContent[key]
        }
      })
      if (objContent.title && this.eContent.titleList.length < 2) {
        this.eContent.titleList = [{title: objContent.title, zoom : objContent.zoom}]
      }
      setTimeout(() => {
        if(this.$refs.documentContentModel) this.$refs.documentContentModel.setData(this.eContent)
      }, 60)
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    submitFormData() {
      let title = ''
      if (this.eContent.titleList.length > 1) {
        title = '合并套红:'
        this.eContent.titleList.forEach((item, i) => {
          title += i === this.eContent.titleList.length - 1 ? item.title : (item.title + ',')
        })
      } else {
        this.eContent.titleList.forEach((item, i) => {
          title += title + (i === this.eContent.titleList.length - 1 ? item.title : (item.title + ','))
        })
      }
      this.formData.title = title
      this.formData.content = JSON.stringify(this.eContent)
      this.$emit('on-ok', this.formData)
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .el-card__header{
  padding: 8px !important;
  background-color: #409EFF !important;
}
/deep/ .el-card__body{
  padding: 5px 10px !important;
  background-color: #f8f8f8 !important;
}
</style>
