<template>
  <el-dialog :visible="dialogBool"
             :before-close="dialogClose"
             fullscreen
             center>
    <tr-page-header ref="trPageHeader" slot="title" content="公告详情" @back="dialogClose"></tr-page-header>
    <div class="content-box">
      <p class="title-box">{{formData.title}}</p>
      <p><span style="margin-right: 10px">{{ formData.type_name }} </span> <span> {{ formData.author }}</span></p>
      <p>{{formData.send_type === 1 ?  formData.send_time : formData.created_date}}</p>
      <div class="box-content" v-html="formData.content"></div>
      <div class="img-box" v-if="formData.image_url">
        <el-image
          :src="formData.image_url"
          class="table-img"
          :preview-src-list="[formData.image_url]"
        ></el-image>
      </div>
      <div class="img-box" v-if="formData.file_list.length">
        <ul class="document-content show-flex-box-c" style="margin-top:10px">
          <li class="show-flex-box-r" style="margin-bottom:10px;justify-content:space-between;" v-for="(item,index) in formData.file_list" :key="index">
            <span class="show-flex-box-r">
              <i class="el-icon-document-remove" style="margin-right:6px;font-size: 16px"></i>
              <span>{{item.name}}</span>
            </span>
            <div class="show-flex-box-r">
              <el-button type="text" style="padding:0" @click="downloadDocument(item)">下载</el-button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import bgImg from "@/assets/notice-image/bj.png"
export default {
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      formData: {
        title: '',
        author: '',
        send_time: '',
        content: '',
        created_date: '',
        type_name: '',
        send_type: '',
        image_url: '',
        file_list: [],
      },
      bgImg: bgImg,
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
    // 预览时数据回显
    setData(info){
      Object.keys(info).forEach(key => {
        if (this.formData.hasOwnProperty(key)) {
          this.formData[key] = info[key]
        }
      })
      console.log('this.formData',this.formData);
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 下载文件
    downloadDocument(item) {
      window.location.href = item.url
      this.$message({type: 'success', message: '下载成功'})
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.content-box {
  min-height: 89vh;
  width: 80%;
  background-color: #F2F6FC;
  margin: 0 auto;
  padding: 17px;
  p {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    margin-bottom: 15px;
  }
  .title-box {
    font-size: 25px;
    font-weight: bold;
    color: #333333;
  }
  .box-content {
    width: 100%; 
    /deep/ p {
      line-height: 25px;
      font-size: 16px;
      letter-spacing: 2px;
      // text-indent:2em;
      font-weight: 400;
      color: #333333;
    }
    /deep/ img {
      max-width: 100%;
      box-sizing:border-box;
    }
  }
}
</style>
