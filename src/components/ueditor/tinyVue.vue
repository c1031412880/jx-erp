<template>
  <!-- 富文本 -->
  <div>
    <editor v-model="content" :init="init" :disabled="disabled"></editor>
  </div>
</template>


  <script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/icons/default/icons";
import "tinymce/themes/silver";
import "tinymce/plugins/image";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/preview";
import "tinymce/plugins/code";
import "tinymce/plugins/link";
import "tinymce/plugins/advlist";
import "tinymce/plugins/codesample";
import "tinymce/plugins/hr";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/autolink";
import "tinymce/plugins/directionality";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/template";
import "tinymce/plugins/charmap";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/autosave";
import "tinymce/plugins/autoresize";
const transToFile = (blob, fileName, fileType) => {
  console.log('blob',blob,fileName,fileType)
  return new File([blob], fileName)
}
export default {
  name: "tinymce-editor",
  components: {
    Editor,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
        type: [String, Array],
        default:
            'lists code pagebreak charmap emoticons save preview print image media link powerpaste ' +
            'anchor codesample table wordcount fullscreen help searchreplace hr insertdatetime',
    },
    toolbar: {
        type: [String, Array],
        default:
            '| formatselect fontselect fontsizeselect ' +
            '| undo redo ' +
            '| code bold italic underline strikethrough ' +
            '| alignleft aligncenter alignright alignjustify ' +
            '| outdent indent numlist bullist insertdatetime ' +
            '| table forecolor backcolor removeformat ' +
            '| hr searchreplace pagebreak charmap ' +
            '| fullscreen ' +
            '| link anchor codesample ',
    },
    // plugins: {
    //   type: [String, Array],
    //   default:
    //     "preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media code codesample table charmap hr nonbreaking insertdatetime advlist lists wordcount imagetools textpattern autosave autoresize",
    // },
    // toolbar: {
    //   type: [String, Array],
    //   default:
    //     "code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link codesample | alignleft aligncenter alignright alignjustify outdent indent formatpainter | \
    //   styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
    //   table image media charmap hr pagebreak insertdatetime | fullscreen preview",
    //   // 图片和视频  image media
    // },
  },
  data() {
    return {
      //初始化配置
      init: {
        menubar: true, // 菜单栏显隐
        placeholder: '请输入内容',
        language_url: `static/tinymce/zh_CN.js`,
        language: "zh_CN",
        skin_url: `static/tinymce/skins/ui/oxide`,
        content_css: 'static/tinymce/skins/content/default/content.css',
        min_height: 350,
        max_height: 600,
        zIndex: 11101,
        resize: true,
        // toolbar_mode: "floating",
        plugins: this.plugins,
        toolbar: this.toolbar,
        paste_data_images: true, // 是否允许黏贴图片
        content_style: "p {margin: 5px 0;}",
        fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
        font_formats:
          "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
        branding: false,
        external_plugins: {
            powerpaste: 'static/powerpaste/plugin.min.js',
        },
        powerpaste_word_import: 'propmt', // 参数可以是propmt, merge, clear，效果自行切换对比
        powerpaste_html_import: 'propmt', // propmt, merge, clear
        powerpaste_allow_local_images: true,
        // 图片上传
        images_upload_handler: (blobInfo, success, failure) => {
          console.log('blobInfo',blobInfo,blobInfo.blob())
          let file = transToFile(blobInfo.blob(), blobInfo.filename(), blobInfo.blob().type)
          let params = new FormData
            // params.append('file', blobInfo.blob())
            // blobInfo转换为file文件格式
          params.append('file', file)
          this.$client.uploadPicture({file: params}, '/api/ERPWeb/PartyHonor/UploadPicture').then((req) => {
            if (req.head.result === "200") {
              success(req.context);
            }else {
              failure("上传出错");
            }
          }).catch(() => {
              failure("上传出错");
          });

        },
      },
      content: this.value,
    };
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
  },
  watch: {
    value(newValue) {
      this.content = newValue;
    },
    content(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>
<style lang="scss">
  .tox-tinymce-aux{z-index:99999 !important;}
	.tinymce.ui.FloatPanel{z-Index: 99;}
</style>
