<template>
  <div class="content-model">
    <div class="tool" v-show="isContent && isSet" ref="tool"></div>
    <div class="content-box" >
      <div style="width: 100%;padding: calc(3.7 * 1.23 * 37.8 * 1px) calc(2.6 * 1.23 * 37.8 * 1px) calc(3.5 * 1.23 * 37.8 * 1px) calc(2.8 * 1.23 * 37.8 * 1px);" ref="contentBox">
        <div class="seal-content" :class="{'sealIndex': editorContent.sealList.length}" :style="{height: `${sealHeight}px`, width: '100%'}">
          <draggable-box
            v-if="isSeal"
            :width="item.width"
            :height="item.height"
            :x="item.x"
            :y="item.y"
            :index="i"
            @on-resize="draggableResize"
            v-for="(item,i) in editorContent.sealList"
            :key="i">
            <div style="position: relative;width: 100%;height: 100%">
              <el-button v-show="isdel" size="mini" style="position: absolute;right: 0" @click="deleteImage(item)">删除</el-button>
              <img crossOrigin="anonymous" style="width: 100%; height: 100%" :src="item.url" alt=""/>
            </div>
          </draggable-box>
          <div
            v-else
            v-for="(item,i) in editorContent.sealList"
            :key="i"
            :style="{width: `${item.width}px`,height: `${item.height}px`,left: `${item.x}px`,top: `${item.y}px`,position: 'absolute'}">
            <img style="width: 100%;height: 100%;" crossOrigin="anonymous" :src="item.url" alt=""/>
          </div>
        </div>

        <tr-header v-show="editorContent.isTH" v-if="isModel" v-bind="editorContent"></tr-header>
        <red-head  v-show="editorContent.isTH" v-bind="editorContent" v-if="isModel"></red-head>
        <tr-number v-show="editorContent.isTH" v-bind="editorContent"></tr-number>
        <h2 class="title">{{editorContent.contentTitle}}</h2>
        <div v-show="isContent && isSet" ref="content" class="content"></div>
        <div class="content-html" v-html="editorContent.content" v-if="!isSet"></div>
        <font-end v-show="editorContent.isTH" v-bind="editorContent"></font-end>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import E from 'wangeditor'
import redHead from './red-head'
import TrHeader from './header'
import trNumber from './number'
import fontEnd from './font-end'
import fontgz from './font-gz'
import draggableBox from './draggable-box'
import html2canvas from 'html2canvas'
import {chunk} from '@/utils/index'
import {PDFInit} from "./PDFInit";
export default {
  name: "content-model",
  components: {redHead, TrHeader, trNumber, fontEnd, draggableBox,fontgz},
  props: {
    isModel: {
      type: Boolean,
      default: false
    },
    isContent: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number,
      default: 400
    },
    isSet: {
      type: Boolean,
      default: true
    },
    isdel: {
      type: Boolean,
      default: true
    },
    isSeal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editor: null,
      editorContent: {
        contentTitle: '',
        titleList: [
          {title: '', zoom: 33}
        ],
        content: '',
        code: '0000001',
        secret: 1,
        degree: 1,
        font_number: '',
        fontType: 1,
        userName:'',
        post_count: 0,
        posy_time: '',
        keyword: '',
        type: 8,
        sealList: [],
        department_name_yf: '',
        // defaultFont: '宋体',//默认字体
        main_department_name: '',
        copy_department_names: '',
        post_count_view: 0,
        posy_time_view: 0,
        degree_view: 0,
        secret_view: 0,
        main_department_view: 0,
        copy_department_view: 0,
        keyword_view: 0,
        isTH: false,
        fiveType: 1,
        gzname: '',
      },
      sealHeight: 700
    }
  },
  mounted() {
    // width 971 height 1373 A4纸比例 210 * 297  上下边距327.672px
    // 0.393英寸=1厘米
    this.$nextTick(() => {
      this.initEditor()
    })
  },
  methods: {
    initEditor() {
      this.editor = new E(this.$refs.tool, this.$refs.content);
      this.editor.config.menus = [
        'head',
        'bold',
        'fontSize',
        'fontName',
        'italic',
        'underline',
        'strikeThrough',
        'indent',
        'lineHeight',
        'foreColor',
        'list',
        'justify',
        'undo',
        'redo',
      ]
      this.editor.config.colors = [
        '#FF0000',
        '#000000'
      ]
      this.editor.config.fontSizes = {
        'x-small': { name: '一号', value: '1' },
        'small': { name: '小一', value: '2' },
        'normal': { name: '二号', value: '3' },
        'large': { name: '小二', value: '4' },
        'x-large': { name: '三号', value: '5' },
        'xx-large': { name: '小三', value: '6' },
        'xxx-large': { name: '四号', value: '7' },
      }
      this.editor.config.fontNames = [
        '仿宋_GB2312',
        '黑体',
        '仿宋',
        '楷体',
        '标楷体',
        '华文仿宋',
        '华文楷体',
        '宋体',
        '微软雅黑',
        'Arial',
        'Tahoma',
        'Verdana',
        'Times New Roman',
        'Courier New',
      ]

      this.editor.create();
    },
    deleteImage(image) {
      let idx = this.editorContent.sealList.indexOf(image)
      if (image.name === this.editorContent.gzname) {
        this.editorContent.gzname = ''
      }
      if (idx > -1) {
        this.editorContent.sealList.splice(idx, 1)
      }
    },
    // 返回值
    getData() {
      this.editorContent.content = this.editor.txt.html()
      if (this.editorContent.content) {
        return JSON.stringify(this.editorContent)
      } else {
        return null
      }

    },
    // 设置参数
    setData(obj) {
      if (obj) {
        Object.assign(this.editorContent, obj)
        this.editor.txt.html(obj.content)
      } else {
        Object.assign(this.$data.editorContent, this.$options.data().editorContent);
        this.editor.txt.html('')
      }
    },
    // 设置盖章位置尺寸
    draggableResize(index, item) {
      if (index > -1) {
        console.log('盖章位置', item)
        Object.assign(this.editorContent.sealList[index], item)
      }
    },
    // 设置高度
    setHeight() {
      setTimeout(() => {
        console.log(this.$refs.contentBox, this.$refs.contentBox.offsetHeight)
        this.sealHeight = this.$refs.contentBox.offsetHeight
      }, 60)
    },
    setPDF() {
      const target = this.$refs.contentBox
      const PdfNode = new PDFInit(target)
      let width = target.offsetWidth
      let height = target.offsetHeight
      let scale = window.devicePixelRatio
      target.style.background = '#ffffff'
      const ops = {
        scale,
        width,
        height,
        useCORS: true,
        allowTaint: false,
      }
      setTimeout(() => {
        html2canvas(target, ops).then(canvas => {
          console.log(canvas, 'A4容器')
          let contentWidth = canvas.width;
          let contentHeight = canvas.height;

          //一页pdf显示html页面生成的canvas高度;
          let pageHeight = contentWidth / 592.28 * 841.89;
          //未生成pdf的html页面高度
          let leftHeight = contentHeight;
          //页面偏移
          let position = 0;
          //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
          let imgWidth = 595.28;
          let imgHeight = 592.28/contentWidth * contentHeight;

          let pageData = canvas.toDataURL('image/jpeg', 1.0);
          console.log(pageData)
          let pdf = new jsPDF('', 'pt', 'a4');

          //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
          //当内容未超过pdf一页显示的范围，无需分页
          if (leftHeight < pageHeight) {
            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
          } else {
            while(leftHeight > 0) {
              pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
              leftHeight -= pageHeight;
              position -= 841.89;
              //避免添加空白页
              if(leftHeight > 0) {
                pdf.addPage();
              }
            }
          }
          pdf.save(`${this.editorContent.contentTitle}.pdf`);
        })
      }, 1000)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
font[size="1"] {
  font-size calc(34.66px * 1.23)
  color #000000
  font-weight 500
  text-align justify
}
font[size="2"] {
  font-size calc(32px * 1.23)
  color #000000
  font-weight 500
  text-align justify
}
font[size="3"] {
  font-size calc(29.33px * 1.23)
  color #000000
  font-weight 500
  text-align justify
}
font[size="4"] {
  font-size calc(24px * 1.23)
  color #000000
  font-weight 500
  text-align justify
}
font[size="5"] {
  font-size calc(21.33px * 1.23)
  color #000000
  font-weight 500
  text-align justify
  letter-spacing -1px
}
font[size="6"] {
  font-size calc(20px * 1.23)
  color #000000
  font-weight 500
  text-align justify
}
font[size="7"] {
  font-size calc(18.66px * 1.23)
  color #000000
  font-weight 500
  text-align justify
}

.w-e-text-container > .w-e-text {
  padding 0 !important
}

.w-e-text-container > .w-e-text > p {
  margin 0 !important
  text-align justify
  line-height 1.812
  letter-spacing -1px
}
.content-model{
  width 976.374px
  margin auto
  position relative
  .tool{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    width 100%
    height 45px
    position absolute
    top 0
    left 0
  }
  .content-box{
    width: 100%
    overflow-y auto
    position relative
    .title{
      width 100%
      font-size calc(29.33px *1.23)
      font-family 'xiaobiaosong'
      color #000000
      text-align center
      line-height 2
      margin 44px 0
    }
    .seal-content{
      position absolute
      width 100%
      top 43px
      left 0
    }
    .sealIndex{
      z-index 999999
    }
    .content{
      width 100%
      min-height 30px
    }
    .content-html{
      width 100%
      min-height 30px
    }
    .content-html > p{
      line-height 1.812
      text-align justify
      letter-spacing -1px
    }
  }
}
</style>
