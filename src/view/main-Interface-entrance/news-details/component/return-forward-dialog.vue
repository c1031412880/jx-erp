<template>
  <el-dialog
      width="500px"
      :title="subForm.state == 3?'退回':'转交'"
      :before-close="handleClose"
      :visible="dialogBool"
      append-to-body
      :close-on-click-modal="false">
      <el-form>
        <el-form-item label="回退节点" v-if="subForm.state == 3">
          <el-select v-model="subForm.object_id" placeholder="选择回退节点">
            <el-option
              v-for="(item,i) in returnUsers"
              :key="i"
              :value="item.seq"
              :label="item.title"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择转交人" label-width="90px" v-if="subForm.state == 4">
          <get-department-select
            ref="personalTree"
            v-model="subForm.object_id"
            :width="'260'"
            :isShowCheckbox="false"
            :placeholder="'选择转交人'"
            :isContainEmp="true"
            :isExportMultiple="false"
          ></get-department-select>
        </el-form-item>
        <el-form-item v-if="isReturnToOriginator && subForm.state == 3">
          <div style="color:#999;">说明:若退回到发起人,发起人可编辑内容重新提交,原流程不变。</div>
        </el-form-item>
        <el-form-item label-width="0" v-if="subForm.state == 3">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入理由"
            :show-word-limit="true"
            :maxlength="300"
            v-model="subForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div class="itemBox" v-if="subForm.state == 3">
        <el-row>
          <el-col :span="24" style="margin-bottom:10px">
            <span>审批常用语：</span> 
            <el-select v-model="wordIds" @change="getWordsList" filterable multiple collapse-tags placeholder="请选择">
              <el-option
                v-for="item in commonWordsList"
                :key="item.id" 
                :label="item.language"
                :value="item.language">
                <span style="float: left;max-width:110px;overflow: hidden;text-overflow: ellipsis;">{{ item.language }}</span>
              </el-option>
            </el-select>
            <el-button style="margin-left:10px" type="primary" @click="saveForm">设为常用语</el-button>
          </el-col>
          <el-col :span="6" v-for="(item,index) in wordsList" :key="index" class="commonWords">
              <div class="box" @click="addCommonWords(item.language)">
                {{item.language}}
              </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="returnOk">提  交</el-button>
      </span>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getDepartmentSelect
  },
  name: "return-forward-dialog",
  props: {
    subForm: {
      type: Object,
      default: {}
    },
    returnUsers: {
      type: Array,
      default: []
    },
    isReturnToOriginator: {
      type: Boolean,
      default: false
    },
    dialogBool: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      commonWordsList: [],
      wordsList: [],
      wordIds: [],
      model: ''
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool) {
        if (this.subForm.state == 3) {
          if (this.$route && this.$route.params && this.$route.params.model) {
            this.model = this.$route.params.model
            this.GetListCommonPhrase()
          }
        }
      }
    },
  },
  mounted(){

  },
  methods: {
        // 添加常用语
    saveForm() {
      if (!this.subForm.remark) {
        this.$message({
          showClose: true,
          message: "常用语不能为空，请输入内容",
          type: "warning",
        });
        return
      }
      let parmas = {
        context: {
          sort: -1,
          type: -1,
          buttons: [1,2,3,4],
          is_all: 1,
          form_ids: [],
          language: this.subForm.remark,
        }
      };
      this.$client.AddCommonPhrase(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.$message({
              showClose: true,
              message: '添加成功',
              type: "success",
            });
            this.GetListCommonPhrase(this.buttons)
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
    },
    // 获取常用语列表
    getWordsList(list) {
      let info = ''
      list.forEach(item => {
        info += item
      })
      this.subForm.remark += info
      this.wordIds = []
    },
    addCommonWords(info){
      this.subForm.remark += info
    },
    // 获取常用语
    GetListCommonPhrase() {
      let params = {
        context: {
          page_index: 1,
          page_size: 999,
          buttons: [1],
          form_ids: [Number(this.model)],
          is_enable: 1
        }
      }
      this.wordIds = []
      this.$client.GetListCommonPhrase(params)
        .then(res => {
          if (res.head.result == "200") {
            this.commonWordsList = res.context.list;
            this.wordsList = this.commonWordsList.slice(0,8)
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    // 4转交、3退回
    returnOk() {
      console.log(this.subForm);
      if(this.subForm.state == 3 && this.subForm.object_id === 0) {
        this.subForm.state = 8
      }
      if (this.subForm.state == 3 && !this.subForm.object_id && this.subForm.object_id !== 0) {
        this.$message.warning('请选择退回节点')
        return
      }
      if (this.subForm.state == 4 && !this.subForm.object_id) {
        this.$message.warning('请选择转交人')
        return
      }
      this.suerSubmitInfo();
    },
    // 确定提交
    suerSubmitInfo() {
      let info = this.$outFormData(this.subForm)
      this.$client.checkFlowRecord({ context: info }).then((req) => {
        if (req.head.result === "200") {
          if(this.subForm.state === 1 || this.subForm.state === 2) {
            // this.opinionShow = false
            this.$emit('on-opinion')
          }else{
            // this.dialogBool = false
            this.handleClose()
          }
          this.$message({
            message: req.head.describle,
            type: "success",
          });
        } else {
          this.$message.error(req.head.describle);
        }
        setTimeout(() => {
          this.$emit('on-load')
        }, 100)
      });
    },
    handleClose() {
      console.log('this.subForm',this.subForm);
      if (this.subForm.state == 4) {
        this.$refs.personalTree.onClear()
      }
      this.$emit("update:dialogBool", false)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.itemBox {
  .commonWords {
    .box {
      padding: 10px;  
      cursor: pointer;
      margin: 5px;
      word-break: keep-all;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      border-radius: 5px;
      background: #E8E7E7;
      color: #333333;
    }
  }
}
</style>
