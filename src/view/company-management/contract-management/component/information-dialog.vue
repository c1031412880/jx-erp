<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="750px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <div class="show-flex-box-r">
          <el-form-item label="合同编号:" prop="code">
            <el-input v-model="form.code" placeholder="请输入合同编号" clearable :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="合同名称:" prop="name">
            <el-input v-model="form.name" placeholder="请输入合同名称" clearable :disabled="curSelecedType == 'detail'"></el-input>
          </el-form-item>
        </div>

        <div class="show-flex-box-r">
          <el-form-item label="开始日期:" prop="start_date">
            <el-date-picker
              v-model="form.start_date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="请选择合同开始日期"
              :disabled="curSelecedType == 'detail'"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期:" prop="end_date">
            <el-date-picker
              v-model="form.end_date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="请选择合同结束日期"
              :disabled="curSelecedType == 'detail'"
            >
            </el-date-picker>
          </el-form-item>
        </div>

        <div class="show-flex-box-r">
          <el-form-item label="客户名称:" prop="customer_id">
            <el-select v-model="form.customer_id" clearable  placeholder="请选择客户名称" @change="selectedCustomer" :disabled="curSelecedType == 'detail'">
              <el-option
                v-for="item in customerOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人:" prop="customer_person">
            <el-input v-model="form.customer_person" placeholder="请输入联系人" disabled clearable></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="联系电话:" prop="customer_phone">
            <el-input v-model="form.customer_phone" placeholder="请输入联系电话"  oninput="value=value.replace(/[^\d.-]/g,'')"  @blur="form.customer_phone = $event.target.value" disabled clearable></el-input>
          </el-form-item>
          <el-form-item label="合同金额:" prop="fee">
            <el-input v-model="form.fee" placeholder="请输入合同金额" oninput="value=value.replace(/[^\d.-]/g,'')"  @blur="form.fee = $event.target.value" clearable :disabled="curSelecedType == 'detail'"></el-input>
          </el-form-item>
        </div>

         <div class="show-flex-box-r">
          <el-form-item label="每年缴费日期:" prop="timer_date">
            <el-date-picker
              v-model="form.timer_date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="请选择每年缴费日期"
              :disabled="curSelecedType == 'detail'"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="合同金额年递增率:" prop="rise_rate">
            <el-input v-model="form.rise_rate" placeholder="请输入合同金额年递增率" oninput="value=value.replace(/[^\d.-]/g,'')"  @blur="form.rise_rate = $event.target.value" clearable :disabled="curSelecedType == 'detail'"><template slot="append">%</template></el-input>
          </el-form-item>
        </div>

        <div class="show-flex-box-r">
          <el-form-item label="收款方式:" prop="way">
            <tr-select-dictionaries v-model="form.way" :classKey="'合同管理收款方式'" :placeholder="'收款方式'" :disabled="curSelecedType == 'detail'"></tr-select-dictionaries>
          </el-form-item>
          <el-form-item label="合同状态:" prop="state">
            <el-select v-model="form.state" clearable  placeholder="合同状态" :disabled="true">
              <el-option
                label="有效合同"
                :value="1">
              </el-option>
              <el-option
                label="无效合同"
                :value="2">
              </el-option>
            </el-select>
            <!-- <tr-select-dictionaries v-model="form.state" :classKey="'合同管理合同状态'" :placeholder="'合同状态'" :disabled="curSelecedType == 'detail'"></tr-select-dictionaries> -->
          </el-form-item>
        </div>
        <div>
          <el-form-item label="合同车辆:" prop="vehicle_ids" v-if="form.type === 1">
            <get-vehicle-select-tree
              ref="vehicleTree"
              :placeholder="'选择车辆'"
              :isShowCheckbox="true"
              v-model="form.vehicle_ids"
              :isExportMultiple="true"
              :width="'180'"
              :disabled="curSelecedType == 'detail'"
            >
            </get-vehicle-select-tree>
          </el-form-item>
          <el-form-item label="合同房屋:" prop="object_id" v-if="form.type === 2">
             <el-select v-model="form.object_id" clearable  placeholder="请选择合同关联的租房" :disabled="curSelecedType == 'detail'" v-if="curSelecedType != 'detail'">
              <el-option
                v-for="item in rentingHouseRecordOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>

            <el-input v-model="form.house_name" placeholder="请选择合同关联的租房" disabled v-else></el-input>

          </el-form-item>
        </div>
        <div>
          <el-form-item label="备注:" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              maxlength="100"
              :rows="4"
              show-word-limit
              placeholder="请输入备注"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="附件：" prop="area">
            <div>
              <el-upload
                class="upload-demo"
                ref="uploadDocomnet"
                action="string"
                :on-change="handlePreview"
                :on-remove="handleRemove"
                accept=".jpg,.jpeg,.png,.rar,.zip,.doc,.docx,.pdf,.xls,.xlsx,"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary" class="el-icon-upload" :disabled="curSelecedType == 'detail'">上传文件</el-button>
                <div slot="tip" class="el-upload__tip">支持格式：.jpg,.jpeg,.png,.rar,.zip,.doc,.docx,.pdf,.xls,.xlsx,单个文件不能超过10MB，最多只能保存5个文件</div>
              </el-upload>
              <ul class="document-content show-flex-box-c" v-loading="uploadDocumentLoading">
                <li class="show-flex-box-r" style="margin-bottom:10px;" v-for="(item,index) in form.files" :key="index">
                  <span class="show-flex-box-r" style="align-items: center;">
                    <i class="el-icon-document-remove" style="margin-right:6px; font-size: 16px"></i>
                    <span>{{item.name}}</span> 
                  </span>
                  <strong class="show-flex-box-r">
                    <el-button type="text" @click="downloadDocument(item)">下载</el-button
                    >
                    <el-button type="text" @click="deleteDocument(item,index)" :disabled="curSelecedType == 'detail'">删除</el-button>
                  
                  </strong>
                </li>
              </ul>
            </div>
          </el-form-item>
        </div>
        
        <div class="show-flex-box-c" v-if="curSelecedType == 'detail'">
          <span style="font-weight: 700;font-size: 14px;color: #606266;margin-bottom: 10px;">合同缴费记录：</span>
          <tr-table
            :selectionShow="false"
            :data="contractPaymentData"
            :tableHeaderList="canRendererTableHeader"
            :isShowBottomOptions="false"
            :TableHeight="200"
            :loading="false"
            :frontFixedNum="1"
            :backFixedNum="0"
          >
            <template slot-scope="scope" slot="finish">
              <span v-if="!!scope.data.finish">{{scope.data.finish === 1?'是':'否'}}</span>
            </template>
          </tr-table>
        </div>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确认发布</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "./get-vehicle-select-tree.vue";
export default {
  components: {getVehicleSelectTree},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      date: [],
      form: {
        id: "",
        type: '',
        code: "",
        name: "",
        start_date: "",
        end_date: "",
        customer_id: "",
        customer_phone: "",
        customer_person: "",
        fee: "",
        way: "",
        state: "",
        object_id:"",
        vehicle_ids:[],
        remark: "",
        files: [],
        timer_date: '',
        rise_rate: '',

        house_name:'',
      },
      basicRules: {
        code: [
          { required: true, message: "请输入合同编号", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入合同名称", trigger: "change" },
        ],
        start_date: [
          { required: true, message: "请选择开始日期", trigger: "change" },
        ],
        end_date: [
          { required: true, message: "请选择结束日期", trigger: "change" },
        ],
        customer_id: [
          { required: true, message: "请选择客服名称", trigger: "change" },
        ],
        // customer_person: [
        //   { required: true, message: "请输入联系人", trigger: "change" },
        // ],
        // customer_phone: [
        //   { required: true, message: "请输入联系电话", trigger: "change" },
        // ],
        fee: [
          { required: true, message: "请输入合同金额租金", trigger: "change" },
        ],
        way: [
          { required: true, message: "请选择收款方式", trigger: "change" },
        ],
        rise_rate: [
          { required: true, message: "请输入合同金额年递增率", trigger: "change" },
        ],
        // state: [
        //   { required: true, message: "请选择合同状态", trigger: "change" },
        // ],
        object_id: [
          { required: true, message: `请选择合同房屋`, trigger: "change" },
        ],
        vehicle_ids:[{ required: true, message: "请选择合同车辆", trigger: "change" },]
      },
      uploadDocumentLoading: false,
      limitNum: 5,
      customerOptions:[],
      rentingHouseRecordOptions:[],
      canRendererTableHeader: [
        {
          id: 1,
          label: "缴费人",
          prop: "user_name",
          width: "100",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "缴费日期",
          prop: "post_date",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "缴费金额（元）",
          prop: "fee",
          width: "150",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "本年缴费是否结清",
          prop: "finish",
          width: "150",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "创建人",
          prop: "created_name",
          width: "100",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "创建时间",
          prop: "created_date",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        }
      ],
      contractPaymentData:[]
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.reqCustomerRecord()
        if(this.curSelecedType == 'add') {
          this.reqCodeContract()
        }
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        })
      }
    },
    'form.type'(){
      // this.basicRules.object_id[0].message = `请选择${this.form.type === 1? '合同车辆':'合同房屋'}`;
      if(this.form.type === 2) {
        this.reqRentingHouseRecord()
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 获取合同编号
    reqCodeContract() {
      this.$client.GetCodeContract()
        .then(res => {
          if (res.head.result == "200") {
            this.form.code = res.context
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 获取客服
    reqCustomerRecord() {
      this.$client.getByPageCustomer()
        .then(res => {
          if (res.head.result == "200") {
            this.customerOptions = res.context.list;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 获取租房记录
    reqRentingHouseRecord() {
       this.$client.getByPageHouse({state:1})
        .then(res => {
          if (res.head.result == "200") {
            this.rentingHouseRecordOptions = res.context.list || [];
            if(this.curSelecedType == 'edit' && !!this.form.object_id) {
              let obj ={
                id: this.form.object_id,
                name: this.form.house_name + '-(此合同房屋)'
              }
              this.rentingHouseRecordOptions.push(obj)
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    selectedCustomer(val) {
      this.customerOptions.forEach(item => {
        if(item.id === val) {
          this.form.customer_person = item.con_name;
          this.form.customer_phone = item.phone;
        }
      })
    },
   // 判断文件大小
    beforeFileUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 10
      if (isLt1M) {
        return true
      }
      this.$message({type: 'error', message: '请不要上载大小超过10M的文件', showClose: true})
      return false
    },
    // 上传资料
    handlePreview(file) {
      if(this.curSelecedType == 'detail') {
        this.$message({type: 'warning', message: '详情不支持上传，如需上传请到编辑页面', showClose: true})
        return
      }
      if( this.form.files.length > 4) {
         this.$message({type: 'warning', message: '最多只能上传五个文件', showClose: true})
        return
      }
      if (this.beforeFileUpload(file)) {
        this.uploadAccidentDataFiles(file)
      }
    },
    // 上传相关资料文件
    uploadAccidentDataFiles(file) {
       // let parmas ={
      //   file: file.row
      // };
      console.log(file)
      let formData = new FormData();
      formData.append("file", file.raw);

      let params = {
        file: formData,
      };
      let fileName = file.name;
      this.$client.AddTxtfileUpload(params).then(res => {
        if(res.head.result == "200") {
          let fileObj = {
            name: fileName,
            url: res.context
          }
          this.form.files.push(fileObj)
          this.$message({
            showClose: true,
            message: "上传成功",
            type: "success"
          });
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 删除相关资料
    handleRemove(file, fileList){
      console.log(file, fileList)
      // this.$emit('on-reset')
    },
    // 下载文件
    downloadDocument(item) {
      // console.log(item)
      window.location.href = item.url
      this.$message({type: 'success', message: '下载成功'})
    },
    // 删除文件
    deleteDocument(item,index) {
      this.fileDocumentIndex = index;
       this.form.files.splice(index, 1)
      // this.$refs.uploadDocomnet.uploadFiles.splice(index, 1)
    },
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          info.vehicles = []
          if(info.type == 1 && !!this.form.vehicle_ids && this.form.vehicle_ids.length > 0) {
            this.form.vehicle_ids.forEach(item => {
              let obj = {vehicle_id: item}
              info.vehicles.push(obj)
            })
            delete info.object_id
          }
          delete info.vehicle_ids
          
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
  height: 500px;
  overflow-y: scroll;
}
.el-dialog-div /deep/ .el-date-editor {
  width: 200px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 200px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 200px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 540px;
}
.document-content{
  padding: 5px 4px 40px;
  
  // width: 100%;
  >li{
    width: 100%;
    // padding: 8px 0;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid #19be6b;
  }
}
.el-dialog-div /deep/ .el-upload-list{
  display: none
}
</style>

