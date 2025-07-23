<template>
  <el-dialog
    :visible="dialogBool"
    :title="`${title}(当前选中的工单数${formData.order_ids.length}):`"
    :before-close="dialogClose"
    width="800px"
    
    append-to-body>
    <div class="el-dialog-div">
      <el-form
        size="mini"
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="135px"
      >
        <div class="show-flex-box-r">
          <el-form-item label="车辆:" prop="vehicle_ids">
            <div style="width: 220px"  class="hide-line1">{{formData.vehicle_ids}}</div>
          </el-form-item>
          <el-form-item label="工单类型:" prop="type_child_names">
            <el-tooltip :content="formData.type_child_names" placement="top" v-if="formData.type_child_names.length > 14">
              <div style="width: 220px"  class="hide-line1">{{formData.type_child_names}}</div>
            </el-tooltip>
            <div style="width: 220px"  class="hide-line1" v-else>{{formData.type_child_names}}</div>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="完工时间:" prop="finish_time">
            <el-date-picker
              v-model="formData.finish_time"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="出厂时间:" prop="out_time">
            <el-date-picker
              v-model="formData.out_time"
              type="datetime"
              placeholder="选择日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              >
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="工单备注:" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入工单备注"
              v-model="formData.remark"
            ></el-input>
          </el-form-item>
          <el-form-item label="检验员:" prop="finish_check_id">
            <el-select v-model="formData.finish_check_id" placeholder="请选择检验员" >
              <el-option
                v-for="item in licenceGradeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>

      </el-form>
      <div class="show-flex-box-r" style="align-items: center; margin-bottom: 20px;">
        <i style="float:left;width: 6px;height: 18px; background: #409EFF;"></i> 
        <p style="margin-left:15px;color:#409EFF;font-size:16px;font-weight:bold">派工信息</p>
        <el-button size="mini" type="primary" icon="el-icon-plus" style="margin:0 20px;" @click="addDispatch()">添加</el-button>
      </div>
      <tr-table
        :selectionShow="false"
        :data="data"
        :tableHeaderList="customSettingList"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="0"
        :backFixedNum="1">
        <template slot-scope="scope" slot="item_name" >
            <el-input v-model="scope.data.item_name" placeholder="请输入维修项目" size="mini"></el-input>
        </template>
        <template slot-scope="scope" slot="maint_dept_name" >
          {{scope.data.maint_dept_name}}
        </template>
        <template slot-scope="scope" slot="shop_id" >
          <el-select v-model="scope.data.shop_id" placeholder="请选择"  @change="getperson(scope.data, scope.index)" size="mini">
            <el-option
              v-for="item in shopidlist"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
        <template slot-scope="scope" slot="person_id" >
          <el-select v-model="scope.data.person_id" placeholder="请选择"  value-key="id" size="mini">
            <el-option
              v-for="item in scope.data.persons"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
        <template slot-scope="scope" slot="actual_hours" >
            <el-input v-model="scope.data.actual_hours"  :min="0" size="mini" style="width:90px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="scope.data.actual_hours = $event.target.value"></el-input>
        </template>
        <template slot-scope="scope" slot="actual_fee" >
          <el-input v-model="scope.data.actual_fee" :min="0" size="mini" style="width:90px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="scope.data.actual_fee = $event.target.value"></el-input>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data,scope.index)"
            title="确定删除此条记录吗？">
            <el-button slot="reference" type="text" size="mini">删除</el-button>
          </el-popconfirm>
        </template>
      </tr-table>
    </div>
    <span slot="footer" class="dialog-footer show-flex-box-r" style="justify-content: flex-end;">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('formData')">提交</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import {getUser} from '@/utils/auth'
export default {
  components: { },
  props: {
    dialogBool: Boolean,
  },
  mounted() {
  },
  data() {
    return {
      loading: false,
      TableHeight: 200,
      customSettingList: [
        {
          id: 1,
          label: "维修项目",
          prop: "item_name",
          width: "160",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "维修车间",
          prop: "maint_dept_name",
          width: "160",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "维修班组",
          prop: "shop_id",
          width: "160",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "维修人员",
          prop: "person_id",
          width: "160",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "工时",
          prop: "actual_hours",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: false,
        }, 
        {
          id: 6,
          label: "工时费",
          prop: "actual_fee",
          width: "160",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable: false,
          
        }
      ],
      data: [],
      title:'批量完工',
      rules:{
        finish_time: [
          { required: true, message: '请选择完工时间', trigger: 'change' },
        ],
        out_time: [
          { required: true, message: '请选择出厂时间', trigger: 'change' },
        ],
      },
      formData:{
        vehicle_ids:"",
        type_child_names:"",
        order_ids:[],
        finish_time:'',
        out_time:'',
        remark:'批量完工',
        finish_check_id:'',
      },
      licenceGradeOptions:[],//检验员
      shopidlist:[], // 改车间下的全部班组
      dept_id:'', //当前的维修车间id
      maint_dept_name:'', // 当前的维修车间名称
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() =>{
          this.setDate()
          this.$refs.formData.clearValidate();
        })
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 设置默认日期为当天
    setDate() {
      let date = new Date();
      // date.setTime(new Date().getTime());
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      let hours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()
      let minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
      let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
      // + ' ' + hours + ':' + minutes + ':' + seconds
      this.formData.finish_time = Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes + ':' + seconds
      this.formData.out_time = Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes + ':' + seconds
    },
    // 获取车间挂载的人 和全部维修班组，
    reqAllMaintDeptGetPerson (dept_id,maint_dept_name) {
      this.dept_id = dept_id
      this.maint_dept_name = maint_dept_name
       this.$client.getMaintDeptGetPerson({shop_id:dept_id}).then(res => {
        if (res.head.result == "200") {
          this.licenceGradeOptions = res.context
          // 如果当前用户在班组维修人员默认置上
          let user_id = Number(JSON.parse(getUser()).user_id)
          let userIds = !!this.licenceGradeOptions && this.licenceGradeOptions.map(item => item.id)
          //  console.log(userIds,user_id)
          if(userIds.includes(user_id)) {
            this.formData.finish_check_id = user_id
          }
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };
      })
      
      this.$client.getMaintDeptGetShop({dept_id:dept_id}).then(res => {
        if (res.head.result == "200") {
          this.shopidlist = res.context
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };
      })
    },
    // 获取维修班组下的人员信息
    getperson(row, index){
      this.$client.getMaintDeptGetPerson({dept_id:this.dept_id,shop_id:row.shop_id})
        .then(res => {
          if (res.head.result == "200") {
            row.persons = res.context
            row.person_id = ''
            // this.data[index].persons = res.context
            // this.selectList[row.index].person_id =''
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
      },
    // 添加派工
    addDispatch() {
      let obj={
        item_name:'',
        maint_dept_name: this.maint_dept_name,
        shop_id:'',
        person_id:'',
        actual_hours:'',
        actual_fee:''
      }
      this.data.push(obj)
    },
    // 删除
    deleteRowInfo(row,index) {
      this.data.splice(index,1)
    },
    updatePlaybill(formName) {
      if(this.data.length) {
         try{
          this.data.forEach((item,index) => {
            
            if(!item.item_name) {
              this.$message({
                message: `第${index+1}行中的“维修项目名称”为必填项`,
                type: 'warning'
              });
              throw new Error("ending")
            }
            if(!item.shop_id) {
              this.$message({
                message: `第${index+1}行中的“维修班组”为必填项`,
                type: 'warning'
              });
              throw new Error("ending")
            }
            if(!item.person_id) {
              this.$message({
                message: `第${index+1}行中的“维修人员”为必填项`,
                type: 'warning'
              });
              throw new Error("ending")
            }
            if(!item.actual_hours) {
              this.$message({
                message: `第${index+1}行中的“工时”为必填项`,
                type: 'warning'
              });
              throw new Error("ending")
            }
            if(!item.actual_fee) {
              this.$message({
                message: `第${index+1}行中的“工时费”为必填项`,
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
       }
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = JSON.parse(JSON.stringify(this.formData))
          let items = JSON.parse(JSON.stringify(this.data))
          items.map(item => {
            delete item.persons
            delete item.maint_dept_name
          })
          info.items = items
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
  },
}
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
  height: 400px;
}

.el-dialog-div /deep/ .el-date-editor {
  width: 220px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 220px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 220px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 220px;
}
</style>

