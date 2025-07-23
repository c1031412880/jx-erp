<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    :width="`${activeName=='second'? '910px':'600px'}`"
    
    append-to-body
  >
    <div class="el-dialog-div">
      <el-form
        size="mini"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        :label-width="`${activeName=='fourth'? '145px':'100px'}`"
        class="demo-ruleForm"
      >
        <el-form-item label="线路:" prop="line_id">
          <div class="line-box-content show-flex-box-r">
            <el-input
              placeholder="选择线路"
              disabled
              v-model="showAllText"
              v-if="isSelectedAll"
              style="margin-right: 8px;"
            >
            </el-input>
            <get-line-select-tree
              ref="lineTree"
              :placeholder="'选择线路'"
              :isShowCheckbox="true"
              v-model="ruleForm.line_id"
              :isExportMultiple="true"
              :width="`${activeName=='second'? '800':'380'}`"
              :disabled="curChangeType=='detail'"
              v-else
              >
            </get-line-select-tree>
            <!-- <el-checkbox v-model="isSelectedAll" v-if="!!ruleForm.line_id">所有路线</el-checkbox> -->
          </div>
          
        </el-form-item>
        <el-form-item label="大班工资:" prop="fee" v-if="activeName=='first'">
          <el-input
            placeholder="请输入金额"
            v-model="ruleForm.fee"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="ruleForm.fee = $event.target.value"
            :disabled="curChangeType == 'detail'"
          >
          <template slot="append">天/元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="小班工资:" prop="fee1" v-if="activeName=='first'">
          <el-input
            placeholder="请输入金额"
            v-model="ruleForm.fee1"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="ruleForm.fee1 = $event.target.value"
            :disabled="curChangeType == 'detail'"
          >
          <template slot="append">天/元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="综合奖金额:" prop="fee" v-if="activeName=='second'">
          <div class="set-proportion-box show-flex-box-c">
            <div class="set-proportion-start show-flex-box-r" style="align-items: center; margin-bottom: 15px;">
              <span>上班天数小于等于&nbsp;</span>
              <el-input v-model="startForm.max" placeholder="" style="width:105px" oninput="value=value.replace(/[^\d.-]/g,'')" size="mini" @blur="startForm.max = $event.target.value"> <template slot="append">天</template> </el-input>
              <span>&nbsp;，综合奖金额：</span>
              <el-input v-model="startForm.value" placeholder="" style="width:150px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="startForm.value = $event.target.value" size="mini"> <template slot="append">元/天</template> </el-input>
            </div>

            <ul class="show-flex-box-c" v-if="proportionSetList.length > 0">
              <li class="show-flex-box-r" style="align-items: center; margin-bottom: 15px;" v-for="(item,index) in proportionSetList" :key="index">
                <div class="show-flex-box-r" style="align-items: center;margin-right:10px">
                  <span>上班天数大于等于&nbsp;</span>
                  <el-input v-model="item.min" placeholder="" style="width:105px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="item.min = $event.target.value" size="mini"> <template slot="append">天</template> </el-input>
                  <span>&nbsp;，小于等于&nbsp;</span>
                  <el-input v-model="item.max" placeholder="" style="width:105px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="item.max = $event.target.value" size="mini"> <template slot="append">天</template> </el-input>
                  <span>&nbsp;，综合奖金额：</span>
                  <el-input v-model="item.value" placeholder="" style="width:150px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="item.value= $event.target.value" size="mini"> <template slot="append">元/天</template> </el-input> 
                </div>
                <span class="show-flex-box-r" v-if="index == (proportionSetList.length-1)">
                  <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="addProportionSetList"></el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteProportionSetList(index)"></el-button>
                </span>
              </li>
            </ul>
            <div class="show-flex-box-r" style="align-items: center; margin-bottom: 15px;"  v-else>
              <span>增加综合奖金额设置: &nbsp;&nbsp;</span>
              <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="addProportionSetList"></el-button>
            </div>
            <div class="set-proportion-end show-flex-box-r" style="align-items: center; padding-bottom: 15px;">
              <span>上班天数大于等于&nbsp;</span>
              <el-input v-model="endForm.min" placeholder="" style="width:105px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="endForm.min = $event.target.value" size="mini"> <template slot="append">天</template> </el-input>
              <span>&nbsp;，综合奖金额：</span>
              <el-input v-model="endForm.value" placeholder="" style="width:150px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="endForm.value = $event.target.value" size="mini"> <template slot="append">元/天</template> </el-input>
            </div>
          </div>
          <!-- <el-input
            placeholder="请输入金额"
            v-model="ruleForm.fee"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="ruleForm.fee = $event.target.value"
            :disabled="curChangeType == 'detail'"
          >
          <template slot="append">天/元</template>
          </el-input> -->
        </el-form-item>
        <el-form-item label="餐补金额:" prop="fee" v-if="activeName=='third'">
          <el-input
            placeholder="请输入金额"
            v-model="ruleForm.fee"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="ruleForm.fee = $event.target.value"
            :disabled="curChangeType == 'detail'"
          >
          <template slot="append">天/元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="每趟请假金额:" prop="fee" v-if="activeName=='fourth'">
          <el-input
            placeholder="请输入金额"
            v-model="ruleForm.fee"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="ruleForm.fee = $event.target.value"
            :disabled="curChangeType == 'detail'"
          >
          <template slot="append">趟/元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="临时请假趟次金额:" prop="fee1" v-if="activeName=='fourth'">
          <el-input
            placeholder="请输入金额"
            v-model="ruleForm.fee1"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="ruleForm.fee1 = $event.target.value"
            :disabled="curChangeType == 'detail'"
          >
          <template slot="append">趟/元</template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
export default {
  components: {getLineSelectTree},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curChangeType: [String],
    activeName:[String],
    curInfo:[Object]
  },
  data() {
    return {
      innerVisible: false,
      ruleForm: {
        id: '',
        id1:'', //小班id 临时请假趟次id
        line_id:[],
        type:'',  //1大班2小班3综合奖4餐补5请假趟次6临时请假趟次
        type1:'', //小班类型 临时请假趟次类型
        fee: 0,
        fee1: 0, //小班金额 临时请假趟次金额
        detail_items:[],  //综合奖
      },
      rules: {
        line_id: [
          { required: true, message: "请选择线路", trigger: "change" },
        ],
      },
      startForm: {
        min: 0,
        max: "",
        value: "",
      },
      endForm: {
        min: "",
        max: -1,
        value: "",
      },
      proportionSetList:[
        {
          min: '',
          max: '',
          value:'',
        }
      ],
      isSelectedAll:false,
      showAllText:'全部路线'
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        if(!this.isSelectedAll) {
          this.$refs.lineTree.onClear();
        }
        Object.assign(this.$data, this.$options.data());
      } else {
        this.setType();
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
          if(this.curChangeType == 'edit') {
            this.setData(this.curInfo)
          }
          if(this.curChangeType == 'add') {
            this.resetForm()
          }
        })
      }
    },
    // isSelectedAll() {
    //   if(!this.isSelectedAll) {
    //     this.$refs.lineTree.onClear();
    //   }
    // }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    setType() {
      switch (this.activeName) {
        case 'first':
          this.ruleForm.type = 1
          break;
        case 'second':
          this.ruleForm.type = 3
          break;
        case 'third':
          this.ruleForm.type = 4
          break;
        case 'fourth':
          this.ruleForm.type = 5
          break;
      }
    },
    setData(formInfo) {
      let form = JSON.parse(JSON.stringify(formInfo))
      if(!form.line_id[0]) {
        this.isSelectedAll = true
      }else{
        this.isSelectedAll = false
      }
      this.ruleForm.line_id = form.line_id
      // 设置线路回显
      if(!!this.ruleForm.line_id[0]){
        let lineNames = form.ex_line_name.split(",")
        let lineList = [];
        lineNames.forEach((item,index) => {
          form.line_id.forEach((item1,index1) => {
            if(index == index1) {
              let obj = {
                i_id: item1,
                c_name: item,
                type: 2
              }
              lineList.push(obj)
            }
          });
        });
        this.$refs.lineTree.lineCheck(lineList)
      }
      

      switch (this.activeName) {
        case 'first':
        case 'fourth':
          this.ruleForm.id1 = form.smallId
          this.ruleForm.id = form.bigId
          this.ruleForm.type1 = form.smallType
          this.ruleForm.type = form.bigType
          this.ruleForm.fee1 = form.smallFee
          this.ruleForm.fee = form.bigFee
          break;
        case 'second':
          this.ruleForm.id = form.id
          let list = form.detail_items || [];
          if(list.length > 1) {
            this.startForm = list[0];
            this.endForm = list.slice(-1)[0];
            list.shift();
            list.pop();
            this.proportionSetList = list;
          }
         break; 
        case 'third':
          for (const key in this.ruleForm) {
            if (Object.hasOwnProperty.call(form, key)) {
              this.ruleForm[key] = form[key];
            }
          }
          break;
      }
    },

    updatePlaybill(formName) {
      if(this.isSelectedAll) {
        this.ruleForm.line_id[0] = 0
      }
      let info = [];
      if(this.activeName == 'first' || this.activeName == 'fourth') {
        // 大班、请假趟次金额
        let bigObj = {
          line_id: this.ruleForm.line_id,
          type: this.activeName == 'first'?1:5,
          fee: !!this.ruleForm.fee? this.ruleForm.fee: 0,
        }
        if(this.curChangeType == 'edit') {
          bigObj.id = this.ruleForm.id
        }
        info.push(bigObj)
        // 小班、临时请假趟次金额
        let smallObj = {
          line_id: this.ruleForm.line_id,
          type: this.activeName == 'first'?2:6,
          fee: !!this.ruleForm.fee1? this.ruleForm.fee1: 0,
        }
        if(this.curChangeType == 'edit') {
          smallObj.id = this.ruleForm.id1
        }
        info.push(smallObj)

      }else if(this.activeName == 'second') {
         if(!this.startForm.max) {
          this.$message({
            message: `第1行中的“上班天数小于等于”为必填项`,
            type: 'warning'
          });
          return
        }
        if(!this.startForm.value) {
          this.$message({
            message: `第1行中的“综合奖金额”为必填项`,
            type: 'warning'
          });
          return
        }

        try{
          this.proportionSetList.forEach((item,index) => {
            
            if(!item.min) {
              this.$message({
                message: `第${index+2}行中的“上班天数大于等于”为必填项`,
                type: 'warning'
              });
              throw new Error("ending")
            }
            if(!item.max) {
              this.$message({
                message: `第${index+2}行中的“小于等于”为必填项`,
                type: 'warning'
              });
              throw new Error("ending")
            }
            if(!item.value) {
              this.$message({
                message: `第${index+2}行中的“综合奖金额”为必填项`,
                type: 'warning'
              });
              throw new Error("ending")
            }

          })
        }catch(e) {
          if(e.message == "ending"){
            return
  　　  　}
        }

        if(!this.endForm.min) {
          this.$message({
            message: `最后1行中的“上班天数大于等于”为必填项`,
            type: 'warning'
          });
          return
        }
        if(!this.endForm.value) {
          this.$message({
            message: `最后1行中的“综合奖金额”为必填项`,
            type: 'warning'
          });
          return
        }
        let detail_items = [...this.proportionSetList];
        if(this.startForm.max && this.startForm.value) {
          detail_items.unshift(this.startForm)
        }
        if(this.endForm.min && this.endForm.value) {
          detail_items.push(this.endForm)
        }
        let obj = {
          line_id: this.ruleForm.line_id,
          type: this.ruleForm.type,
          detail_items: detail_items || [],
        }
        if(this.curChangeType == 'edit') {
          obj.id = this.ruleForm.id
        }
        info.push(obj)
      }else{
        let obj = {
          line_id: this.ruleForm.line_id,
          type: this.ruleForm.type,
          fee: !!this.ruleForm.fee? this.ruleForm.fee: 0,
        }
        if(this.curChangeType == 'edit') {
          obj.id = this.ruleForm.id
        }
        info.push(obj)
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(info)
          // return
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });

    },

    // 增加比例设置
    addProportionSetList() {
      let obj = {
        min: '',
        max: '',
        value:'',
      };
      this.proportionSetList.push(obj)
    },
    deleteProportionSetList(index) {
      this.proportionSetList.splice(index,1)
    },

    resetForm() {
      this.$refs.lineTree.onClear();
      this.$refs["ruleForm"].resetFields();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
// .el-dialog__wrapper {
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
// }

.el-dialog-div {
  height: 250px;
  // overflow-y: scroll;
}

.el-dialog-div /deep/ .el-input {
  width: 380x;
}

.el-dialog-div /deep/ .el-date-editor {
  width: 380x;
}

.el-dialog-div /deep/.el-select, .el-select--mini {
  width: 380x;
}

.el-dialog-div /deep/ .el-input, .el-input--mini {
  width: 380x;
}

.el-dialog-div /deep/ .el-textarea {
  width: 500px;
}

.line-box-content>span {
  flex-grow: 1;
  margin-right: 8px;
}

</style>


