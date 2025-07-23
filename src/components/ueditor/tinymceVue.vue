<template>
  <div class="tinymce-editor">
    <editor
      v-model="myValue"
      :init="init"
      :disabled="disabled"
    ></editor>
  </div>
</template>

<script type="text/ecmascript-6">
import tinymce from "tinymce";
import "tinymce/themes/silver";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver";
import "tinymce/plugins/paste";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount";

export default {
  components: {
    Editor
  },
  name: 'tinymce-editor',
  props: {
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
        "link lists image code table wordcounts"
    },
    toolbar: {
      type: [String, Array],
      default:
        "bold italic underline strikethrough | fontsizeselect fontselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink code | removeformat"
    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    }
  },
  data() {
    return {
      myValue: this.value,
      init: {
        language_url: "/static/plugins/langs/zh_CN.js", //如果语言包不存在，指定一个语言包路径
        language: "zh_CN", //语言
        skin_url: "/static/plugins/tinymce/skins/ui/oxide", //如果主题不存在，指定一个主题路径
        height: "600px",
        width: this.calcWidth(),
        plugins: this.plugins, //插件
        toolbar: this.toolbar, //工具栏
        branding: false, //技术支持(Powered by Tiny || 由Tiny驱动)
        menubar: false, //菜单栏
        // theme: "silver", //主题
        zIndex: 9999,
      },
    }
  },
  mounted() {

  },
  methods: {
    calcWidth() {
      return document.body.clientWidth / 2 + "px";
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
