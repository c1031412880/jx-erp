<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    width="675px"
    
  >
    <div class="el-dialog-div" v-loading ="loading">
      <el-form
        size="mini"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="show-flex-box-r">
          <el-form-item label="添加人:" prop="created_id">
            <el-input
              v-model="ruleForm.created_name"
              placeholder="请输入添加人"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="添加日期:" prop="created_date">
            <el-date-picker
              v-model="ruleForm.created_date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="年/月/日"
              disabled
            >
            </el-date-picker>
          </el-form-item> 
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="奖金类别:" prop="type">
            <el-select v-model="ruleForm.type" clearable multiple placeholder="请选择" :disabled="curType == 'detail'" @change="selectedType">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="薪资月份：" prop="salary_month">
            <el-date-picker
              v-model="ruleForm.salary_month"
              type="month"
              format="yyyy-MM"
              value-format="yyyy-MM"
              @change="selectedMonth"
              placeholder="选择月份"
              :disabled="curType == 'detail'">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="备注:" prop="remark">
            <el-input
              v-model="ruleForm.remark"
              type="textarea"
              maxlength="200"
              :rows="4"
              show-word-limit
              placeholder="请输入备注"
              :disabled="curType == 'detail'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="人员选择:" prop="fee_details">
            <el-button size="mini" type="primary" @click="openPersonlPop">添加</el-button>
          </el-form-item>
        </div>
        <div class="tr-table-box show-flex-box-r" style="width: 600px;" v-show="ruleForm.fee_details.length > 0">
          <tr-table
            ref="driverTable"
            :selectionShow="false"
            :data="ruleForm.fee_details"
            :tableHeaderList="customSettingList"
            :TableHeight="200"
            :frontFixedNum="1"
            :backFixedNum="0"
          >
           <template slot-scope="scope" slot="overtime">
             <el-input
                placeholder="请输入金额"
                v-model="scope.data.overtime"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="scope.data.overtime = $event.target.value"
                size="mini"
                style="width: 100px"
              >
              </el-input>
            </template>
            <template slot-scope="scope" slot="quality_check">
             <el-input
                placeholder="请输入金额"
                v-model="scope.data.quality_check"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="scope.data.quality_check = $event.target.value"
                size="mini"
                style="width: 100px"
              >
              </el-input>
            </template>
            <template slot-scope="scope" slot="safe_mile">
             <el-input
                placeholder="请输入金额"
                v-model="scope.data.safe_mile"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="scope.data.safe_mile = $event.target.value"
                size="mini"
                style="width: 100px"
              >
              </el-input>
            </template>
            <template slot-scope="scope" slot="line_check">
             <el-input
                placeholder="请输入金额"
                v-model="scope.data.line_check"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="scope.data.line_check = $event.target.value"
                size="mini"
                style="width: 100px"
              >
              </el-input>
            </template>

            <template slot-scope="scope" slot="operation">
              <el-popconfirm
                @confirm="deleteRowInfo(scope.data, scope.index)"
                title="确定删除此吗？"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  size="mini"
                  style="margin-left: 10px"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </tr-table>
        </div>
        
      </el-form>
    </div>

     <el-dialog
      width="30%"
      
      title="驾驶员选择"
      :visible.sync="innerVisible"
      append-to-body>
      <div class="" style="height: 350px">
        <get-driver-tree
          ref="tree"
          :isShowCheckbox="true"
          :placeholder="'请输入关键词'"    
          @on-check="driverCheck"
        ></get-driver-tree>

      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="innerVisible = false">取 消</el-button>
      <el-button type="primary" @click="sureSelectedPersonal()">确定</el-button>
    </span>
    </el-dialog>

    <span slot="footer" class="dialog-footer" v-loading ="loading">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDriverTree from "@/components/base/formModel/tree/get-driver-tree";
import { getUser } from "@/utils/auth";
export default {
  components: {getDriverTree},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curType: [String],
  },
  data() {
    return {
      innerVisible: false,
      showTitle: "",
      typeOptions: [{
        value: 1,
        label: '加班费'
      }, {
        value: 2,
        label: '质量考核奖'
      }, {
        value: 3,
        label: '安全里程奖'
      }, {
        value: 4,
        label: '精品线路考核奖'
      }],
      typeMap:{
        1: 'overtime',
        2: 'quality_check',
        3: 'safe_mile',
        4: 'line_check'
      },
      customHeaderMap:{
        'overtime': {
          id: 2,
          label: "加班费金额（元）",
          prop: "overtime",
          width: "180",
          align: "center",
          signIndex: 1,
          sortable:true
        },
        'quality_check' :{
          id: 3,
          label: "质量考核奖（元）",
          prop: "quality_check",
          width: "180",
          align: "center",
          signIndex: 2,
          sortable:true
        },
        'safe_mile':{
          id: 4,
          label: "安全里程奖（元）",
          prop: "safe_mile",
          width: "180",
          align: "center",
          signIndex: 3,
          sortable:true
        },
        'line_check':{
          id: 5,
          label: "精品线路考核奖 （元）",
          prop: "line_check",
          width: "220",
          align: "center",
          signIndex: 4,
          sortable:true
        }
      },
      ruleForm: {
        created_id: '',
        created_name: '',
        created_date:'',
        type: [],
        salary_month:'',
        remark: '',
        fee_details:[]
      },
      rules: {
        created_id: [
          { required: true, message: "请选择添加人", trigger: "change" },
        ],
        created_date: [
          { required: true, message: "请输添加日期", trigger: "change" },
        ],
        type:[
          { required: true, message: "请选择奖金类别", trigger: "change" },
        ],
        salary_month: [
          { required: true, message: "请选择薪资月份", trigger: "change" },
        ],
        fee_details: [
          { required: true, message: "请选择人员", trigger: "change" },
        ],
      },
      selecredDriverNodes:[], // 已经选择的驾驶员
      customSettingList:[
        {
          id: 1,
          label: "姓名",
          prop: "name",
          width: "100",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        // {
        //   id: 2,
        //   label: "加班费金额（元）",
        //   prop: "overtime",
        //   width: "180",
        //   align: "center",
        //   signIndex: 1,
        //   sortable:true
        // },
        // {
        //   id: 3,
        //   label: "质量考核奖（元）",
        //   prop: "quality_check",
        //   width: "180",
        //   align: "center",
        //   signIndex: 2,
        //   sortable:true
        // },
        // {
        //   id: 4,
        //   label: "安全里程奖（元）",
        //   prop: "safe_mile",
        //   width: "180",
        //   align: "center",
        //   signIndex: 3,
        //   sortable:true
        // },
        // {
        //   id: 5,
        //   label: "精品线路考核奖 （元）",
        //   prop: "line_check",
        //   width: "220",
        //   align: "center",
        //   signIndex: 4,
        //   sortable:true
        // },
        // {
        //   id: 6,
        //   label: "操作",
        //   prop: "operation",
        //   width: "180",
        //   align: "center",
        //   signIndex: 5,
        //   sortable:false
        // }
      ],
      curSelectedNodes: [],
      loading: false
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetForm();
      } else {
        this.configData();
        this.setDate();
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
        })
      }
    },
    innerVisible() {
      if(!this.innerVisible) {
        this.$refs.tree.setCurrentKey([]);
        this.$refs.tree.resetChecked();
      }else{        
        this.selecredDriverNodes = [];
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configData() {
      // alert(this.curType)
      if (this.curType == "add") {
        this.showTitle = "添加奖金";
      } else {
        this.showTitle = "编辑奖金";
      }
      let userInfo = JSON.parse(getUser());
      // console.log(userInfo)
      this.ruleForm.created_id = Number(userInfo.user_id)
      this.ruleForm.created_name = userInfo.user_name
    },
     // 设置默认日期为当天
    setDate() {
      let date = new Date();
      // date.setTime(new Date().getTime());
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      this.ruleForm.created_date = Y + '-' + M + '-' + D
      this.ruleForm.salary_month = Y + '-' + M
    },
    selectedMonth(val) {
      this.ruleForm.salary_month = val;
    },
    // 选择奖金类别构建奖金添加表头
    selectedType(val) {
      let newCustomSettingList = [
        {
          id: 1,
          label: "姓名",
          prop: "name",
          width: "100",
          align: "center",
          signIndex: 0,
          sortable: false
        }
      ]
      if(!!val && val.length) {
        val.forEach((item,index) => {
          let headerObj = this.customHeaderMap[this.typeMap[item]]
          newCustomSettingList.push(headerObj)
        })
      }else{
        this.ruleForm.type = []
      }
      // newCustomSettingList.push(
      //   {
      //     id: 6,
      //     label: "操作",
      //     prop: "operation",
      //     width: "180",
      //     align: "center",
      //     signIndex: 5,
      //     sortable:false
      //   }
      // )
      this.customSettingList = newCustomSettingList.map((item,index) =>{
        item.id = index + 1
        item.signIndex = index
        return item
      })
      this.$nextTick(() =>{
        this.$refs.driverTable.configTableHeaderList()
      })
      console.log(this.customSettingList)

    },
    //打开选择人员弹窗 
    openPersonlPop() {
      if(this.ruleForm.type.length == 0) {
        this.$message({
          showClose: true,
          message: '请先选择添加奖金的类别',
          type: "warning",
        });
        return
      }
      this.innerVisible = true
      setTimeout(() => {
        if(!!this.curSelectedNodes && this.curSelectedNodes.length > 0) {
          this.$refs.tree.setCheckedNodes(this.curSelectedNodes);
        }else{
          this.$refs.tree.setCheckedNodes([]);
        }
      },100)
    },
    // 选择驾驶员
    driverCheck(node) {
      this.selecredDriverNodes = []
      this.curSelectedNodes = []
      node.forEach(item => {
        // 0人员 1部门 2线路 3车辆
        if (!item.type) {
          let obj = {
            name: item.c_name,
            driver_id: item.i_id
          }
          
          this.ruleForm.type.forEach(item => {
            obj[this.typeMap[item]] = ''
          });
          
          this.selecredDriverNodes.push(obj)
          this.curSelectedNodes.push(item)
        }
      })
      console.log(this.selecredDriverNodes)
    },
    sureSelectedPersonal() {
      if(!this.ruleForm.fee_details.length) {
        this.ruleForm.fee_details = this.selecredDriverNodes
      }else{
        let sameArr = this.selecredDriverNodes.map(item => {
          const data = this.ruleForm.fee_details.find(i => item.driver_id == i.driver_id)
          return {
            ...item,
            ...data,
          }
        })
        // console.log(sameArr)
        this.ruleForm.fee_details = sameArr
      }
       this.innerVisible = false
    },
    deleteRowInfo(row,index) {
      this.ruleForm.fee_details.splice(index,1)
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.ruleForm}
          delete info.created_name
          // 添加奖金预检查
          this.addSalaryPreSalaryList(info)
          // this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });

    },
    // 添加奖金预检查
    addSalaryPreSalaryList(form) {
      this.loading = true;
      this.$client.AddSalaryPreSalaryList({context: form}).then((res) => {
        if (res.head.result == "200") {
          this.loading = false;
          this.$emit("save-add-edit", form);
        }else if(res.head.result == "205") {
          this.loading = false;
          if(!!res.context && res.context.length > 0) {
            let errorData = [];
            let list = res.context
            let h = this.$createElement;
            list.forEach(element => {
              errorData.push(h('p',null,element));
            });
            this.$msgbox({
              title: `录入提示(共${list.length}条)`,
              message: h('div',{ style: `height: 300px;${list.length > 12?'overflow-y: scroll':''}`}, errorData),
              showCancelButton: true,
              cancelButtonText: '取消',
              confirmButtonText: '确认覆盖',
            }).then(() =>{
              this.$emit("save-add-edit", form);
            }).catch(() =>{
              this.$message({
                type: 'info',
                message: '已取消'
              });
            })
          }
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },

    // 重置
    resetForm() {
      this.$refs["ruleForm"].resetFields();
    },
  }
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
  height: 380px;
  overflow-y: scroll;
}

.el-dialog-div /deep/ .el-input {
  width: 200px;
}

.el-dialog-div /deep/ .el-date-editor {
  width: 200px;
}

.el-dialog-div /deep/.el-select, .el-select--mini {
  width: 200px;
}

.el-dialog-div /deep/ .el-input, .el-input--mini {
  width: 200px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 500px;
}

.tr-table-box /deep/ div{
  width: 100%;
}

</style>


