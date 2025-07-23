<template>
  <div class="set-info">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-suffix=":"
      label-width="120px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="资产编号" prop="assets_code">
            <el-input v-model="form.assets_code" placeholder="请输入资产编号" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产名称" prop="assets_name">
            <el-input v-model="form.assets_name" placeholder="请输入资产名称" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产所属分类" prop="type_id" disabled>
            <!-- <get-assets-select 
              ref="driverTree1"
              v-model="form.type_id"
              :width="'220'"
              :isShowCheckbox="false"
              clearable
              :placeholder="'请选择分组'"
              :isExportMultiple="false"
              :disabled="curEventType == 'check'"
            ></get-assets-select> -->
            <el-select v-model="form.type_id" placeholder="请选择" clearable disabled>
              <el-option
                v-for="item in curOptions"
                :key="item.id"
                :label="item.assets_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规格型号" prop="model">
            <el-input v-model="form.model" placeholder="请输入规格型号" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计量单位" prop="unit">
            <get-select-dictionaries 
              v-model="form.unit" 
              clearable 
              style="width:100%"
              :classKey="'计量单位'" 
              :placeholder="'请选择计量单位'"
              :disabled="true">
            </get-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产单价" prop="fee">
            <el-input-number v-model="form.fee" :min="0" label="描述文字" :precision="2" :controls="false" :disabled="curEventType != 'edit'"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="存放地点" prop="address">
            <el-input v-model="form.address" placeholder="请输入存放地点" :disabled="curEventType != 'edit'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="购买日期" prop="buy_date">
            <el-date-picker
              disabled
              v-model="form.buy_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产使用年限" prop="time_limit">
            <el-input v-model="form.time_limit" placeholder="请输入资产使用年限" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产报废日期" prop="scrap_date">
            <el-date-picker
              :disabled="curEventType != 'edit'"
              v-model="form.scrap_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商" prop="supplier_id">
            <!-- <el-input v-model="form.supplier" placeholder="请输入供应商" :disabled="curEventType != 'edit'"></el-input> -->
            <get-supplier-list 
              style="width:100%"
              v-model="form.supplier_id" 
              :disabled='true'
              :placeholder="'请选择供应商'">
            </get-supplier-list>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人姓名" prop="contact_person">
            <el-input v-model="form.contact_person" placeholder="请输入联系人姓名" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="联系人电话" prop="contact_phone">
            <el-input v-model="form.contact_phone" placeholder="请输入联系人电话" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="margin-bottom: 20px">
          <el-form-item label="上传图片">
            <div class="list-data-list show-flex-box-r">
              <ul class="list-data" v-for="(item,index) in form.img_list" :key="index">
                <li class="item" v-if="item">
                  <image-box :src="item" :id="index+1" @on-delete="imageDelete(index)"></image-box>
                </li>
              </ul>
              <div class="item unchecked" @click="uploadFile()">
                <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上传文件">
            <multiple-files-upload 
              :filesList="form.file_list" 
              :acceptType="'.rar,.zip,.doc,.docx,.pdf,.xls,.xlsx'" 
              :isPreviewable="false" 
              :maxUpLoadSize="100" 
              :maxUpLoadNum="3"
              @upload-update-success="uploadUpdateSuccess"></multiple-files-upload>
          </el-form-item>
        </el-col>
        <div v-if="curEventType != 'edit'">
          <el-col :span="24">
            <div
              style="
                float: left;
                width: 6px;
                height: 14px;
                background: #409eff;
                margin-top: 10px;
              "
            ></div>
            <p
              style="
                margin-left: 15px;
                margin-bottom: 15px;
                color: #409eff;
                font-size: 14px;
                font-weight: bold;
                margin-top: 10px;
              "
            >
              当前使用信息
            </p>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="curEventType == 'borrow' || curEventType == 'check' ? '使用部门' : '归还部门'" prop="dept_id">           
              <get-dept-emp-select-tree 
                :placeholder="curEventType == 'borrow' || curEventType == 'check' ? '请选择使用部门' : '请选择归还部门'" 
                :func_type="0" 
                :disabled="curEventType != 'borrow'"
                v-model="form.dept_id"></get-dept-emp-select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用人" prop="user_id">            
              <get-dept-emp-select-tree 
                placeholder="选择使用人" 
                :func_type="0" 
                :is_contain_emp="true" 
                :disabled="curEventType != 'borrow'"
                v-model="form.user_id"></get-dept-emp-select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="curEventType == 'borrow' || curEventType == 'check' ? '使用日期' : '归还日期'" prop="date">
              <el-date-picker
                :disabled="curEventType != 'borrow' && curEventType != 'back'"
                v-model="form.date"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </div>   
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import imageBox from '@/components/image-box/index';
import multipleFilesUpload from "@/components/multiple-files-upload";
import getAssetsSelect from 'components/base/formModel/tree/get-assets-select-tree'
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getDeptEmpSelectTree from '@/components/base/formModel/tree/get-dept-emp-select-tree';
import getSupplierList from "@/components/base/formModel/select/get-supplier-list";
import { formatTime } from '@/utils';
export default {
  components: {
    imageBox,
    multipleFilesUpload,
    getAssetsSelect,
    getSelectDictionaries,
    getDeptEmpSelectTree,
    getSupplierList
  },
  props: {
    curEventType:  { 
      type: String,
      default: 'add'
    },
  },
  data() {
    return {
      form: {
        id: '',
        assets_code: '',
        assets_name: '',
        type_id: 0,
        model: '',
        unit: 0,
        fee: 0,
        address: '',
        buy_date: '',
        time_limit: '',
        scrap_date: '',
        supplier_id: '',
        contact_person: '',
        contact_phone: '',
        img_list: [],
        file_list: [],
        user_id: '',
        dept_id: '',
        date: ''
      },
      curOptions: [],
      rules: {
        assets_code: [
          { required: true, message: "请输入资产编号", trigger: "change", },
        ],
        assets_name: [
          { required: true, message: "请输入资产名称", trigger: "change", },
        ],
        type_id: [
          { required: true, message: "请选择分类", trigger: "change", },
        ],
        // model: [
        //   { required: true, message: "请输入规格型号", trigger: "change", },
        // ],
        // unit: [
        //   { required: true, message: "请选择计量单位", trigger: "change", },
        // ],
        fee: [
          { required: true, message: "请输入资产单价", trigger: "change", },
        ],
        address: [
          { required: true, message: "请输入存放位置", trigger: "change", },
        ],
        buy_date: [
          { required: true, message: "请输入购买日期", trigger: "change", },
        ],
        // time_limit: [
        //   { required: true, message: "请输入资产使用年限", trigger: "change", },
        // ],
        // scrap_date: [
        //   { required: true, message: "请选择报废日期", trigger: "change", },
        // ],
        // supplier: [
        //   { required: true, message: "请输入供应商", trigger: "change", },
        // ],
        // contact_person: [
        //   { required: true, message: "请输入联系人姓名", trigger: "change", },
        // ],
        // contact_phone: [
        //   { required: true, message: "请输入联系人电话", trigger: "change", },
        // ],
        dept_id: [
          { required: true, message: "请选择部门", trigger: "change", },
        ],
        date: [
          { required: true, message: "请选择日期", trigger: "change", },
        ],
      },
    }
  },
  mounted() {
    this.getClassList()
  },
  methods: {
    clearValid() {
      this.$refs['form'].clearValidate();
    },
    // 初始化数据
    resetData() {
      // this.$refs.driverTree1.onClear();
      Object.assign(this.$data.form, this.$options.data().form);
      this.$refs['form'].clearValidate();
      this.form.img_list = []
      this.form.file_list = []
    },
    // 获取所有分类
    getClassList() {
      this.$client.GetByPageAssetsType({})
      .then(res => {
        if (res.head.result == "200") {
          this.curOptions = res.context.list;
          }
      })
    },
    // 回显
    setData(val) {
      for(let key in this.form) {
        if(val[key]) this.form[key] = val[key]
      }
      if(this.curEventType != 'check')
      this.form.date = formatTime(new Date())
      // console.log(val, this.form);
    },
     // 删除照片
    imageDelete(index) {
      this.form.img_list.splice(index,1)
    },
    // 自定义上传文件方法
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      // input.accept = ".jpg,.jpeg";
      input.onchange = () => {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        reader.onload = (ev) => {
          input = undefined;
        };
        let params = new FormData
        params.append('file', file)
        this.$client.uploadPicture({file: params}, '/api/ERPWeb/PartyHonor/UploadPicture').then((req) => {
          if (req.head.result === "200") {
            // let obj = {
            //   name: file.name,
            //   url: req.context
            // }
            this.form.img_list.push(req.context)
          }
        });
      };
      input.click();
    },
    // 上传文件
    uploadUpdateSuccess(filesList) {
      // console.log(filesList)
      this.form.file_list = filesList
    },
    // 给父级页面提供得获取本页数据
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate((valid) => {
          if (!valid) {
            reject({
              result: 400,
              msg: '获取失败,带星号的为必填项'
            });
            return;
          }
          resolve({
            formData: this.form,
            result: 200,
            msg: "获取成功",
          });
        });
      });
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .el-input__inner
  width: 220px

.list-data-list
  flex-wrap: wrap;
  align-items: center;
  .list-data
    // width: 450px
    overflow: hidden
  .item
    float: left
    width: 100px
    height: 100px
    margin: 5px
  .unchecked
    border-radius: 4px
    border: 2px dashed #606266
    text-align: center
    line-height: 130px
    &:hover
      border-color: #409EFF
      color: #409EFF
</style>