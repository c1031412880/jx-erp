<template>
  <div class="base-dynamic-sudit" v-loading="loading">
    <div class="head-image">
      <img :src="require('../../launch-affair/component/tableData/img/zhang1.png')" v-if="formData.state === 2" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang2.png')" v-if="formData.state === 4" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang3.png')" v-if="formData.state === 3" alt="">
    </div>
    <title-box-new :title="`${formData.title + (formData.replace_name ? formData.replace_name : '')}`">
      <div class="head-content">
        <p style="color: #BBBBBB;">审批编号:{{formData.flow_code}}</p>
        <p :style="{'color': outColor(formData.state)}">
          {{formData.state === 0  ? '发起审批' : formData.state_name}}
        </p>
      </div>
    </title-box-new>
    <item-box-new title="基本信息">
      <el-row :gutter="20">
        <el-col :span="12">
          <p>标题</p>
          <em>{{formData.grassroots_title}}</em>
        </el-col>
        <el-col :span="12">
          <p>动态分类</p>
          <em>{{formData.type_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>作者</p>
          <em>{{formData.user_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>设为置顶动态</p>
          <em>{{formData.top ? '是' : '否'}}</em>
        </el-col>
        <el-col :span="12">
          <p>公开阅读信息</p>
          <em>{{formData.is_public ? '是' : '否'}}</em>
        </el-col>
        <el-col :span="12">
          <p>首页轮播图</p>
          <em>{{formData.home_page ? '是' : '否'}}</em>
        </el-col>
        <el-col :span="24">
          <p>封面图片</p>
          <el-image
            style="width:350px; height: 136px"
            :src="formData.image_url ? formData.image_url : require('@/assets/notice-image/bj.png')" 
          ></el-image>
        </el-col>
        <el-col :span="24" v-show="formData.files_list.length">
          <p>上传文件</p>
          <ul class="document-content show-flex-box-c" style="margin-top:10px;">
            <li class="show-flex-box-r" style="margin-bottom:10px;justify-content:space-between;" v-for="(item,index) in formData.files_list" :key="index">
              <span class="show-flex-box-r" style="align-items: center;color: #333333">
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
        <el-col :span="24">
          <p>动态内容</p>
          <div v-html="formData.content"></div>
        </el-col>
      </el-row>
    </item-box-new>
  </div>
</template>

<script type="text/ecmascript-6">
import itemBoxNew from "../component/item-box-new";
import titleBoxNew from "../component/title-box-new";
import imageFileUpload from "@/components/imageFileUpload/index";

export default {
  name: "base-dynamic-sudit",
  components: {
    itemBoxNew,
    titleBoxNew,
    imageFileUpload,
  },
  data() {
    return {
      formData: {
        flow_id: 0,
        user_ids: [],
        files_list: []
      },
    };
  },
  props: {
    userId: '',
    step_id: '',
    loading:{
      type: Boolean,
      default: false
    },
  },
  watch: {
  },
  methods: {
    outColor(state) {
      switch (state) {
        case 0:
          return '#00ccff'
        case 1:
          return '#F58A40'
        case 2:
          return '#0CB780'
        case 3:
          return '#F2260E'
        case 4:
          return '#999999'
      }
    },
  },
};
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
.base-dynamic-sudit {
  .head-image {
    position: absolute
    top: 32px;
    right: 38px;
    img {
      height: 98px;
      width: 98px
    }
  }
  .head-content {
    position: relative
    width: 100%;
    p {
      font-size: 12px;
      font-weight: 400;
      margin-top: 15px
    }
  }
  .el-row {
    .el-col {
      margin-bottom: 22px;
    }
    p {
      font-family: Source Han Sans SC-Medium, Source Han Sans SC;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      margin-bottom: 6px
    }
    em, /deep/ .el-textarea__inner {
      font-size: 14px;
      font-weight: 500;
      color: #333333;
    }
  }
  .image-box {
    margin-bottom: 0px;
  }

  .richText {
    width: 100%;
    /deep/ {
      .el-textarea__inner {
        background-color: #fff; 
        border: none;
        cursor: auto;
        padding: 0;
      }
    }
  }
}
</style>
