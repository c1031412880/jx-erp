<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    append-to-body
    width="80%"
    top="20px"
  >
    <div class="base-info">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px"
        class="demo-form"
        :label-position="'right'"
        size="mini"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="文章名称:" prop="advert_title">
              <el-input v-model="form.advert_title" :disabled="curSelecedType == 'detail'" clearable style="width: 100%">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="录用平台:" prop="enter_platform">
              <el-select v-model="form.enter_platform" :disabled="curSelecedType == 'detail'" placeholder="请选择" style="width: 100%" @change="changePlatform">
                <el-option
                  v-for="item in platformList"
                  :key="item.id"
                  :label="item.platform"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文章分数:" prop="advert_score">
              <el-input v-model="form.advert_score" disabled style="width: 100%">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="宣传类型:" prop="advert_type">
              <get-select-dictionaries
                :disabled="curSelecedType == 'detail'"
                style="width: 100%"
                v-model="form.advert_type"
                :classKey="'宣传类型'"
                :isShowDefaultValue="true"
                :placeholder="'请选择宣传类型'"
              ></get-select-dictionaries>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="录用时间:" prop="enter_time">
              <el-date-picker
                :disabled="curSelecedType == 'detail'"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择录用时间"
                v-model="form.enter_time"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" :disabled="curSelecedType == 'detail'" show-word-limit v-model="form.remark" :rows="4" placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="table-box">
            <div style="display: flex;align-items:center;margin-bottom:5px">
              <h2 style="margin-right:10px">关联宣传稿件</h2>
              <el-button type="primary" size="small" @click="add()" v-if="curSelecedType != 'detail'">关联宣传审批单</el-button>
              <el-button type="primary" size="small" @click="del()" v-if="curSelecedType != 'detail'">删除</el-button>
            </div>
            <tr-table
              ref="table"
              :selectionShow="true"
              :data="form.advert_manuscript_relevs"
              :tableHeaderList="tableHeaderList"
              @on-select-change-row="handleSelectionChange"
              :TableHeight="TableHeight">
            </tr-table>
          </el-col>
          <el-col :span="24" style="margin-top: 20px">
            <image-file-upload 
              :images="imgs"
              :files="files"
              @files-update-success="filesUpdateSuccess"
              @images-update-success="imagesUpdateSuccess"></image-file-upload>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')" size="mini" v-if="curSelecedType != 'detail'"
        >保 存</el-button>
    </span>

    <el-dialog
      :visible.sync="isShowPublicizeDialog"
      :close-on-click-modal="false"
      :append-to-body="true"
      top="5px"
      width="80%"
      class="dialog-box">
      <publicize-box
        ref="publicizeBox"
        @on-save="savePublicize"
        @on-close="isShowPublicizeDialog = false">
      </publicize-box>
    </el-dialog>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import imageFileUpload from "@/components/imageFileUpload/index";
import publicizeBox from '../publicize-box'
import { formatTime } from '@/utils/index';  
export default {
  components: {
    getSelectDictionaries,
    imageFileUpload,
    publicizeBox
  },
  props: {
    dialogBool: Boolean,
    curSelecedType: [String],
    organizationTreeList: [Array], //所属类别
  },
  data() {
    return {
      showTitle: "",
      form: {
        advert_title: "",
        enter_platform: "",
        advert_score: "",
        advert_type: "",
        enter_time: formatTime(new Date,'yyyy-MM-dd'),
        remark: "",
        advert_manuscript_relevs: [],
        id: "",
        file_ids: [],
      },
      rules: {
        advert_title: [
          { required: true, message: "请输入文章名称", trigger: "change" },
        ],
        enter_platform: [
          { required: true, message: "请选择录用平台", trigger: "change" },
        ],
        advert_score: [
          { required: true, message: "请选择文章分数", trigger: "change" },
        ],
        advert_type: [
          { required: true, message: "请选择宣传类型", trigger: "change" },
        ],
        enter_time: [
          { required: true, message: "请选择录用时间", trigger: "change" },
        ],
      },
      tableHeaderList: [
        {
          id: 1,
          label: "宣传审批单编号",
          prop: "flow_code",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "信息标题",
          prop: "title",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "作者（文）",
          prop: "author_article_name",
          width: "200",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "作者（文）得分",
          prop: "article_score",
          width: "100",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "作者（摄）",
          prop: "author_photo_name",
          width: "200",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "作者（摄）得分",
          prop: "photo_score",
          width: "130",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "总得分",
          prop: "total_score",
          width: "130",
          align: "center",
          signIndex: 6,
        },
      ],
      TableHeight: 200,
      isShowPublicizeDialog: false,
      platformList: [],
      imgs: [],
      files: [],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.platformList = this.organizationTreeList[0].advertPlatforms
        this.configTitle();
        this.$nextTick(() => {
        });
      }
    },
  },
  mounted() {
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      if (this.curSelecedType == "add") {
        this.showTitle = "添加文章";
      } else if (this.curSelecedType == "edit") {
        this.showTitle = "编辑文章";
      } else {
        this.showTitle = "查看文章";
      }
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.advert_manuscript_relevs.length == 0) {
            this.$message({
              showClose: true,
              message: '请关联宣传稿件',
              type: "warning",
            });
            return
          }
          let info = JSON.parse(JSON.stringify(this.form));
          info.file_ids = []
          if (this.imgs.length > 0) {
            this.imgs.forEach(item => {
              info.file_ids.push(item.id)
            })
          }
          if (this.files.length > 0) {
            this.files.forEach(item => {
              info.file_ids.push(item.id)
            })
          }
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
    // 添加考核模板
    savePublicize(list){
      console.log('list',list);
      let array = [...list,...this.form.advert_manuscript_relevs]
      let newList = this.unique(array)

      this.form.advert_manuscript_relevs = newList.map(item => {
        return {
          flow_code: item.flow_code,
          title: item.advert_title || item.title,
          author_article: item.author_article,
          author_article_name: item.author_article_name,
          article_score: '',
          author_photo: item.author_photo,
          author_photo_name: item.author_photo_name,
          photo_score: '',
          total_score: '',
          advert_id: item.id || item.advert_id
        }
      })
      console.log('-=----',JSON.parse(JSON.stringify(this.form.advert_manuscript_relevs)));
      this.isShowPublicizeDialog = false

      this.calculateScore()
      this.countHeight()
    },
    // 计算关联稿件得分    如果只关联一个  文占2/3  摄1/3     如果关联多个 则每个占一半
    calculateScore() {
      let num = this.form.advert_score

      if (this.form.advert_manuscript_relevs.length == 1) {
        if (this.form.advert_manuscript_relevs[0].author_photo_name) {
          this.form.advert_manuscript_relevs[0].article_score = Number((num * 2 / 3).toFixed(2))
          this.form.advert_manuscript_relevs[0].photo_score = Number((num * 1 / 3).toFixed(2))
        } else {
          this.form.advert_manuscript_relevs[0].article_score = num
          this.form.advert_manuscript_relevs[0].photo_score = 0
        }
        this.form.advert_manuscript_relevs[0].total_score = this.form.advert_manuscript_relevs[0].article_score + this.form.advert_manuscript_relevs[0].photo_score
      } else {
        this.form.advert_manuscript_relevs.forEach(item => {
          if (item.author_photo_name) {
            item.article_score = Number((num / 2 * 2 / 3).toFixed(2))
            item.photo_score = Number((num / 2 * 1 / 3).toFixed(2))
          } else {
            item.article_score = num / 2
            item.photo_score = 0
          }
          item.total_score = item.article_score + item.photo_score
        })
      }
    },
    // 打开考核模板
    add() {
      this.isShowPublicizeDialog = true
      this.$nextTick(() => {
        this.$refs.publicizeBox.$refs.head.onSubmit()
      })
    },
    // 添加考核模板
    del() {
      if (this.ids.length == 0) {
        this.$message({
          showClose: true,
          message: "请先选中需要删除的信息",
          type: "warning",
        });
        return
      }
      this.form.advert_manuscript_relevs = this.form.advert_manuscript_relevs.filter(item => {return this.ids.indexOf(item.advert_id) == -1})
      this.calculateScore()
    },
    handleSelectionChange(rows) {
      this.ids = []
      rows.forEach(item => {
        this.ids.push(item.advert_id)
      })
    },
    //去重
    unique(arr) {
      let map = new Map();
      for (let item of arr) {
        map.set(item.flow_code, item);
      }
      return [...map.values()];
    },
    // 计算表格高度
    countHeight() {
      if (this.form.advert_manuscript_relevs.length === 0) {
        this.TableHeight = 200
      } else {
        this.TableHeight = this.form.advert_manuscript_relevs.length * 50 + 100
      }
    },
    // 获取分数
    changePlatform() {
      console.log('=========',this.platformList);
      this.platformList.forEach(item => {
        if (item.id == this.form.enter_platform) {
          this.form.advert_score = item.score
        }
      })

      this.calculateScore()
    },
    // 上传图片
    imagesUpdateSuccess(list) {
      this.imgs = list;
    },
    // 上传文件
    filesUpdateSuccess(filesList) {
      this.files = filesList;
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.dialog-box /deep/ .el-dialog{
  height: 90%;
}

.dialog-box /deep/ .el-dialog__body {
  height: calc(100% - 20px);
}
</style>


