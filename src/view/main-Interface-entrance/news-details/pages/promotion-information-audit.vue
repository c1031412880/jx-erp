<template>
  <div class="promotion-information-audit" v-loading="loading">
    <div class="head-image">
      <img :src="require('../../launch-affair/component/tableData/img/zhang1.png')" v-if="formData.state === 2" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang2.png')" v-if="formData.state === 4" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang3.png')" v-if="formData.state === 3" alt="">
    </div>
    <title-box-new :title="formData.title">
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
          <p>经办人</p>
          <em>{{formData.user_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>所在部门</p>
          <em>{{formData.dept_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>日期</p>
          <em>{{formData.date}}</em>
        </el-col>
        <el-col :span="12">
          <p>作者(文)</p>
          <em>{{formData.author_article_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>作者(摄)</p>
          <em>{{formData.author_photo_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>报送类别</p>
          <em>{{formData.type_name}}</em>
        </el-col>
        <el-col :span="24" v-if="!(flowFields.adver_title === 3)">
          <p>信息标题</p>
          <em v-if="flowFields.adver_title === 1">{{formData.advert_title}}</em>
          <el-input v-model="formData.advert_title" v-if="flowFields.adver_title === 2" placeholder="请输入信息标题"></el-input>
        </el-col>
        <el-col :span="24" v-if="!(flowFields.content === 3)">
          <p>信息内容</p>
          <el-input 
            autosize type="textarea" 
            class="richText" disabled 
            v-model="formData.content" 
            v-if="flowFields.content === 1"
          ></el-input>
          <el-input 
            autosize type="textarea" 
            v-model="formData.content" 
            placeholder="请输入申请内容" 
            v-if="flowFields.content === 2" 
            @change="changeInputContent"
          ></el-input>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.employment_status === 3)">
          <p>录用媒体</p>
          <em v-if="flowFields.employment_status === 1">{{formData.employment_status_name}}</em>
          <el-select v-model="formData.employment_status" @change="changeEmploymentStatus" style="width: 100%;" v-if="flowFields.employment_status === 2" placeholder="请选择">
            <el-option
              v-for="item in platOptions"
              :key="item.id"
              :label="item.platform"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.text_score === 3)">
          <p>作者（文）得分</p>
          <em v-if="flowFields.text_score === 1">{{formData.text_score || 0}}</em>
          <el-input-number 
            v-model="formData.text_score" 
            v-if="flowFields.text_score === 2" 
            @change="changeInputContent"
            style="width: 100%;"
            :controls="false"
          ></el-input-number>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.text_fee === 3)">
          <p>文字稿费</p>
          <em v-if="flowFields.text_fee === 1">{{formData.text_fee || 0}}</em>
          <el-input-number 
            v-model="formData.text_fee" 
            v-if="flowFields.text_fee === 2" 
            @change="changeInputContent"
            style="width: 100%;"
            :controls="false"
          ></el-input-number>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.img_score === 3)">
          <p>作者（摄）得分</p>
          <em v-if="flowFields.img_score === 1">{{formData.img_score || 0}}</em>
          <el-input-number 
            v-model="formData.img_score" 
            v-if="flowFields.img_score === 2" 
            @change="changeInputContent"
            style="width: 100%;"
            :controls="false"
          ></el-input-number>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.img_fee === 3)">
          <p>摄影稿费</p>
          <em v-if="flowFields.img_fee === 1">{{formData.img_fee || 0}}</em>
          <el-input-number 
            v-model="formData.img_fee" 
            v-if="flowFields.img_fee === 2" 
            @change="changeInputContent"
            style="width: 100%;"
            :controls="false"
          ></el-input-number>
        </el-col>
        <!-- <el-col :span="12" v-if="!(flowFields.img_fee === 3)">
          <p>总得分</p>
          <em v-if="flowFields.img_fee === 1">{{formData.total_score || 0}}</em>
          <el-input-number 
            v-model="formData.total_score" 
            v-if="flowFields.img_fee === 2" 
            style="width: 100%;"
            disabled
          ></el-input-number>
        </el-col> -->
        <el-col :span="24" v-if="!(flowFields.home_page_url === 3)">
          <p>封面图片</p>
          <el-image
             v-if="flowFields.home_page_url === 1"
            style="width:350px; height: 136px"
            :src="formData.home_page_url || require('@/assets/notice-image/bj.png')"
          ></el-image>
          <el-image
             v-if="flowFields.home_page_url === 2"
            @click.native="uploadFile"
            style="width:350px; height: 136px"
            :src="formData.home_page_url || require('@/assets/notice-image/bj.png')"
          ></el-image>
          <p>推荐尺寸750*272；支持.jpg, .jpeg, .bmp, .gif, .png类型文件，5M以下</p>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.is_news === 3)">
          <p>是否同步到新闻</p>
          <em v-if="flowFields.is_news === 1">{{formData.is_news ? '是' : '否'}}</em>
          <el-switch
            v-if="flowFields.is_news === 2"
            v-model="formData.is_news"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeInputContent"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.is_home_page === 3)">
          <p>是否首页轮播图</p>
          <em v-if="flowFields.is_home_page === 1">{{formData.is_home_page ? '是' : '否'}}</em>
          <el-switch
            v-model="formData.is_home_page"
             v-if="flowFields.is_home_page === 2"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeInputContent"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-col>
        <el-col :span="24" v-if="!(flowFields.news_text === 3)">
          <p>新闻信息</p>
          <div class="news-text" v-if="flowFields.news_text === 1" v-html="formData.news_text"></div>
          <tinymce-Vue 
            :value="formData.news_text" 
            v-if="flowFields.news_text === 2"
            @input="res => changeNewsText(res)"
          ></tinymce-Vue>
        </el-col>
      </el-row>
      <el-row class="image-box">
        <image-file-upload
          :images="formData.thumbnail_imgs"
          :files="formData.files_list"
          :isShowBox="false"></image-file-upload>
      </el-row>
    </item-box-new>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from '@/utils/index'; 
import itemBoxNew from "../component/item-box-new";
import titleBoxNew from "../component/title-box-new";
import tinymceVue from "@/components/ueditor/tinyVue.vue";
import imageFileUpload from "@/components/imageFileUpload/index";
let defn 
export default {
  name: "promotion-information-audit",
  components: {
    tinymceVue,
    itemBoxNew,
    titleBoxNew,
    imageFileUpload,
  },
  mounted() {
    defn = debounce(() => {
      console.log('this.changeInputContent()');
      this.changeInputContent()
    }, 2000)
    this.loadOrganizationTree()
  },
  props: {
    step_id: '',
    userId: '',
    loading:{
      type: Boolean,
      default: false
    },
    
  },
  data() {
    return {
      formData: {
        flow_id:0,
        thumbnail_imgs: [],
        files_list: []
      },
      flowFields: {
        adver_title: 1,
        content: 1,
        employment_status: 1,
        text_score: 1,
        img_score: 1,
        home_page_url: 1,
        is_news: 1,
        is_home_page: 1,
        news_text: 1,
        text_fee: 1,
        img_fee: 1,
      },
      platOptions: [],
    }
  },
  watch: {
    step_id(id) {
      if(this.formData.user_ids && this.formData.user_ids.includes(this.userId)) {
        this.getFlowFields(id)
        this.getFee()
      }else {
        Object.assign(this.flowFields, this.$options.data().flowFields)
      }
    },
  },
  methods: {
    // 审批单状态
    outColor(state) {
      switch (state) {
        case 0:
          return '#00ccff'
          break;
        case 1:
          return '#F58A40'
          break;
        case 2:
          return '#0CB780'
          break;
        case 3:
          return '#F2260E'
          break;
        case 4:
          return '#999999'
          break;
      }
    },
    // 获取稿费
    getFee() {
      this.$client.GetAdvertFee({})
      .then(res => {
        if (res.head.result == "200") {
          if(!this.formData.text_fee) {
            this.formData.text_fee = res.context.fee || 0
          }
          if(!this.formData.img_fee) {
            this.formData.img_fee = res.context.fee || 0
          }
        }
      })
    },
    // 获取组织tree信息
    loadOrganizationTree() {
      this.$client.GetAdvertPlatforms()
      .then(res => {
        if (res.head.result == "200") {
          this.platOptions = res.context && res.context[0] ? res.context[0].advertPlatforms : [];
          console.log(res.context, '录用情况列表');
          
        }
      })
    },
    // 自定义上传图片
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = ".jpg,.jpeg,.bmp,.gif,.png";
      input.onchange = () => {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          this.$message({type: 'warning', message: `请选择上传图片大小不能超过5M`, showClose: true})
          return false
        }
        reader.onload = (ev) => {
          input = undefined;
        };
        let params = new FormData
        params.append('file', file)
        this.$client.uploadPicture({file: params}, '/api/ERPWeb/PartyHonor/UploadPicture').then((req) => {
          if (req.head.result === "200") {
            this.formData.home_page_url = req.context
            this.changeInputContent()
          }
        });
      };
      input.click();
    },
    // 获取表单字段控制
     getFlowFields(id) {
      let params = {
        flow_step_id: id
      }
      this.$client.GetFlowFieid(params).then((res) => {
        if (res.head.result == "200") {
          let data = res.context
          let fields = Object.keys(this.flowFields)
          if(data && data.length) {
            data.forEach(item => {
              if(fields.indexOf(item.fieid_code) > -1) {
                this.flowFields[item.fieid_code] = item.type
              }
            })
          }
        }
      }).catch((err) => {});
    },
    // 计算得分
    changeEmploymentStatus() {
      if(this.formData.employment_status) {
        let list = this.platOptions.filter(item => item.id == this.formData.employment_status)
        console.log(list);
        this.formData.text_score = list[0].score ? list[0].score * this.formData.text_fee : 0
        this.formData.img_score = list[0].img_score ? list[0].img_score * this.formData.img_fee : 0
        defn()
      }
    },
    changeNewsText(val) {
      this.formData.news_text = val
      defn()
    },
    // 修改input内容
    changeInputContent() {
      if(this.formData.state) {
        let params = {
          context: {
            form_data: {},
            step_data: null
          }
        }
        params.context.form_data = Object.assign({}, this.formData)
        this.$client.EditAdvertInfo(params).then((req) => {})
      }
    },
  },
  beforeDestroy() {
    defn = null
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.promotion-information-audit {
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
  .el-col {
    margin-bottom: 22px;
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
    /deep/ .el-textarea__inner {
      min-height: 60px !important
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
  .news-text {
    /deep/ img {
      max-width: 450px !important;
      max-height: 300px !important;
      margin: 0 auto;
    }
    /deep/ p {
      font-size: 16px !important;
      line-height: 28px !important;
      white-space: wrap !important;
      color: #3e3e3e !important;
      text-decoration: none !important;
      letter-spacing: 1.5px !important;
      font-family: Arial, Helvetica, sans-serif !important;
    }
    /deep/ span {
      font-size: 16px !important;
      line-height: 28px !important;
      white-space: wrap !important;
      color: #3e3e3e !important;
      text-decoration: none !important;
      letter-spacing: 1.5px !important;
      font-family: Arial, Helvetica, sans-serif  !important;
    }
    /deep/ p > span {
      font-size: 16px !important;
      line-height: 28px !important;
      white-space: wrap !important;
      color: #3e3e3e !important;
      text-decoration: none !important;
      letter-spacing: 1.5px !important;
      font-family: Arial, Helvetica, sans-serif  !important;
    }
  }
}

</style>
