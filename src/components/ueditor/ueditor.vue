<template>
  <div style="width: 100%">
    <div class="container ueditor-content" style="width: 100%; margin: auto">
      <div :id="id" class="edui_editor_wrp"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import $ from "../../../static/ueditor/jquery-1.10.2";
export default {
  props: {
    id: {
      type: String,
      default: "appmsg_editor"
    }
  },
  destroyed() {
    if (this.editor) {
      this.editor.destroy();
    }
  },
  data() {
    return {
      editor: null,
      editorId: "appmsg_editor",
      c_resource_url: ""
    };
  },
  mounted() {
    setTimeout(() => {
      this.initEditor();
    }, 100);
    this.$nextTick(() => {
      this.loadImgBtn()
    })
  },
  methods: {
    eduiWrpPaste(editor, e) {
      e.preventDefault();
      console.log('粘贴图片', e)
      let items = e.originalEvent.clipboardData.items;
      console.log(items,'items')
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (items.length < 2 && item.kind === 'file' && (item.type === 'image/png' || item.type === 'image/jpeg' || item.type === 'image/jpg')) {
          let file = item.getAsFile();
          if (!file) return true
          if (file.size > 1024 * 1024 * 5) {
            this.$message({type: 'warning', message: `请选择上传图片大小不能超过5M`, showClose: true})
            return false
          }
          // let reader = new FileReader();
          // reader.readAsDataURL(file);
          // reader.onload = ev => {
          //
          //   // this.setImge(this.editor)
          //   // let img = ev.target.result;
          //   // this.editor.execCommand("inserthtml", `<img src="${img}"/>`);
          // };
          let params = new FormData
          params.append('file', file)
          console.log(params,'params')
          this.$client.uploadPicture({file: params}, '/api/ERPWeb/PartyHonor/UploadPicture').then((req) => {
            // console.log(req,'aaaaa');
            if (req.head.result === "200") {
              this.editor.execCommand(
                "inserthtml",
                `<a href="${req.context}"><img src="${req.context}"/></a>`
              );
            }
          });
        }
     }
    },
    initEditor() {
      const { id, setImge } = this;
      this.editor = UE.delEditor(this.id);
      this.editor = UE.getEditor(this.id, {
        id: id,
        wordCount: false,
        elementPathEnabled: false
      });
      this.editor.addListener("catchremotesuccess", function() {
        this.success("内容已上传完成");
      });
      this.editor.addListener("catchremoteerror", function() {
        this.error("远程图片抓取失败");
      });
      this.editor.ready(() => {
        console.log('ready')
        this.editor.addListener('paste', this.eduiWrpPaste);
        const { editor } = this;
        const toolbars = editor.ui.toolbars;
        $("#" + editor.ui.toolbars[0].id).addClass("edui-toolbar-primary");
        $("#" + editor.ui.toolbars[1].id).addClass("edui-toobar-secondary");
        $("#" + id + "_toolbarbox").addClass("show-edui-more");
        for (let i = 0; i < toolbars.length; i++) {
          let toolbar = toolbars[i];
          let items = toolbar.items;
          for (let j = 0; j < items.length; j++) {
            if (
              items[j] instanceof UE.ui.Combox ||
              items[j] instanceof UE.ui.SplitButton
            ) {
              try {
                $("#" + items[j].id + "_state").tooltip({
                  container: "body"
                });
              } catch (e) {
                // console.error(1,e.message, $("#" + items[j].id + "_state")[0], items[j])
              }
            } else if (
              items[j] instanceof UE.ui.Button ||
              items[j] instanceof UE.ui.MenuButton
            ) {
              try {
                $("#" + items[j].id + "_body").tooltip({
                  container: "body"
                });
              } catch (e) {
                // console.error(2,e.message, $("#" + items[j].id + "_body"), items[j])
              }
            }
          }
        }
      });

      // 插入图片
      UE.registerUI("insertimage2", (editor, uiName) => {
        editor.registerCommand(uiName, {
          execCommand: () => {
            this.editor = editor;
            this.c_resource_url = "";
            setImge(editor);
          }
        });
        const btn = new UE.ui.Button({
          name: uiName,
          title: "图片",
          cssRules: "",
          onclick: () => {
            editor.execCommand(uiName);
          }
        });
        return btn;
      });
    },

    getContent() {
      let content = this.editor.getContent();
      // let content = this.editor.getAllHtml();
      return content;
    },
    setContent(content) {
      this.editor.ready(() => {
        this.editor.setContent(content);
      });
    },
    loadImgBtn() {
      const { setImge } = this
      // 插入图片
      UE.registerUI('insertimage2', function (editor, uiName) {
        editor.registerCommand(uiName, {
          execCommand: function () {
            setImge(editor)
          },
        })
        var btn = new UE.ui.Button({
          name: uiName,
          title: '图片',
          cssRules: '',
          onclick: function () {
            editor.execCommand(uiName)
          },
        })
        return btn
      })
    },
    setImge(editor) {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        console.log(input.files);
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        reader.onload = ev => {
          input = undefined;
        };
        let params = new FormData
        params.append('file', file)
        this.$client.uploadPicture({file: params}, '/api/ERPWeb/PartyHonor/UploadPicture').then((req) => {
          // console.log(req,'aaaaa');
          if (req.head.result === "200") {
            editor.execCommand(
              "inserthtml",
              `<a href="${req.context}"><img src="${req.context}"/></a>`
            );
          }
        });
      };
      input.click();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
