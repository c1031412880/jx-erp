<!-- tinymc富文本 -->
<template>
  <div>
    <editor v-model="myValue" :init="init" :disabled="disabled" @onClick="onClick">
    </editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import '../../../static/tinymce/themes/silver'
import '../../../static/tinymce/skins/content/default/content.css'
import '../../../static/tinymce/skins/ui/oxide/skin.min.css'
import '../../../static/tinymce/skins/ui/oxide/skin.css'
import '../../../static/tinymce/zh_CN.js' // 本地汉化
// import '../../../static/tinymce/themes/silver/theme'
import '../../../static/tinymce/plugins/image'
import '../../../static/tinymce/plugins/media'
import '../../../static/tinymce/plugins/table'
import '../../../static/tinymce/plugins/lists'
import '../../../static/tinymce/plugins/contextmenu'
import '../../../static/tinymce/plugins/wordcount'
import '../../../static/tinymce/plugins/colorpicker'
import '../../../static/tinymce/plugins/textcolor'
import '../../../static/tinymce/plugins/advlist'
import '../../../static/tinymce/plugins/anchor'
import '../../../static/tinymce/plugins/autolink'
import '../../../static/tinymce/plugins/code'
import '../../../static/tinymce/plugins/codesample'
import '../../../static/tinymce/plugins/directionality'
import '../../../static/tinymce/plugins/fullscreen'
import '../../../static/tinymce/plugins/hr'
import '../../../static/tinymce/plugins/imagetools'
import '../../../static/tinymce/plugins/insertdatetime'
import '../../../static/tinymce/plugins/link'
import '../../../static/tinymce/plugins/lists'
import '../../../static/tinymce/plugins/nonbreaking'
import '../../../static/tinymce/plugins/noneditable'
import '../../../static/tinymce/plugins/pagebreak'
import '../../../static/tinymce/plugins/paste'
import '../../../static/tinymce/plugins/preview'
import '../../../static/tinymce/plugins/print'
import '../../../static/tinymce/plugins/save'
import '../../../static/tinymce/plugins/searchreplace'
import '../../../static/tinymce/plugins/tabfocus'
import '../../../static/tinymce/plugins/template'
import '../../../static/tinymce/plugins/textpattern'
import '../../../static/tinymce/plugins/visualblocks'
import '../../../static/tinymce/plugins/visualchars'
import '../../../static/tinymce/plugins/wordcount'
import "../../../static/tinymce/icons/default" // 图标 -解决测试环境找不icon问题
export default {
  name:'tinymce',
  components: {
    Editor
  },
  props: {
    //传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default:
        ' anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons hr image imagetools insertdatetime link lists   noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'
        // 'lists image media table  wordcount '
    },
    toolbar: {
      type: [String, Array],
      default:
        'undo redo | searchreplace | bold  italic | underline | strikethrough | alignleft  aligncenter alignright | fontselect  fontsizeselect outdent indent  blockquote  removeformat subscript superscript code codesample hr bullist numlist link image charmap preview anchor pagebreak insertdatetime  table  forecolor backcolor '
        // 'undo redo |  formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat hr'
    },
    height: {
      type: Number,
      default: 300
    },
    width: {
      type: Number,
      default: 500
    },
  },
  data () {
    return {
      //初始化配置
      init: {
        font_formats: "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
        fontsize_formats: "1pt 2pt 4pt 6pt 8pt 10pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 19pt 20pt 24pt 36pt",
        language_url: '/static/tinymce/zh_CN.js', // 这里需要单独处理
        language: 'zh_CN',
        height: this.height,
        width: this.width,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        skin_url: "/static/tinymce/skins/ui/oxide",
        menubar: true,
        //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          const img = 'data:image/jpeg;base64,' + blobInfo.base64()

          // function imgCompress(res) {
          //   return new Promise((resolve, reject) => {
          //     const img = new Image()
          //     img.src = res
          //     img.onload = () => {
          //       const canvas = document.createElement('canvas')
          //       const ctx = canvas.getContext('2d')
          //       canvas.width = img.width
          //       canvas.height = img.height
          //       ctx.drawImage(img, 0, 0, img.width, img.height)
          //       const base64 = canvas.toDataURL('image/jpeg', 0.8)
          //       resolve(base64)
          //     }
          //   })
          // }
          //
          // // 压缩img
          // imgCompress(img).then(res => {
          //   success(res)
          // })
          success(img)
        },
        resize: false
      },
      myValue: this.value
    }
  },
  mounted () {
    // tinymce.init({})
  },
  methods: {
    //添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    //需要什么事件可以自己增加
    onClick (e) {
      this.$emit('onClick', e, tinymce)
    },
    clear () {
      this.myValue = ''
    }
  },
  watch: {
    value (newValue) {
      this.myValue = newValue
    },
    myValue (newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
