<template>
  <div class="goods-info">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-suffix=":"
      label-width="110px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="物品分类" prop="group_id">
            <!-- <el-select v-model="form.group_id" @change="changeClassifyGroup" placeholder="请选择物品分类" :disabled="curEventType == 'check'">
              <el-option
                v-for="item in classifyOptions1"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select> -->
            <get-assets-select 
              ref="driverTree1"
              v-model="form.group_id"
              :width="'220'"
              :type="2"
              :disabled="curEventType == 'check'"
              :isShowCheckbox="false"
              :placeholder="'请选择物品分类'"
              :isExportMultiple="false"
              @on-change="changeClassifyGroup"
            ></get-assets-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物品名称" prop="goods_name">
            <el-input v-model="form.goods_name" placeholder="请输入物品名称" :disabled="curEventType == 'check'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物品编号" prop="goods_code">
            <el-input v-model="form.goods_code" placeholder="系统自动生成" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规格型号" prop="model">
            <el-input v-model="form.model" placeholder="请输入规格型号" :disabled="curEventType == 'check'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="品牌" prop="brand">
            <el-input v-model="form.brand" placeholder="请输入品牌" :disabled="curEventType == 'check'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="存放地点" prop="address">
            <el-input v-model="form.address" placeholder="请输入存放地点" :disabled="curEventType == 'check'"></el-input>
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
              :disabled="curEventType == 'check'">
            </get-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物品单价(元)" prop="price">
            <el-input-number :disabled="curEventType == 'check'" v-model="form.price" :min="0" label="描述文字" :precision="2" :controls="false" @change="sumTotal"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="库存数量" prop="count">
            <el-input-number :disabled="curEventType == 'check'" v-model="form.count" :min="0" label="描述文字" :precision="0" :controls="false" @change="sumTotal"></el-input-number>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="预警数量" prop="warn_count">
            <el-input-number :disabled="curEventType == 'check'" v-model="form.warn_count" :min="0" label="描述文字" :precision="0" :controls="false"></el-input-number>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="总价值(元)" prop="total_price">
            <el-input-number :disabled="curEventType == 'check'" v-model="form.total_price" :min="0" label="描述文字" :precision="2" :controls="false"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商" prop="supplier_id">
            <!-- <el-input :disabled="curEventType == 'check'" v-model="form.supplier" placeholder="请输入供应商"></el-input> -->
            <get-supplier-list 
              style="width:100%"
              v-model="form.supplier_id" 
              @change="changeSupplier"
              :placeholder="'请选择供应商'">
            </get-supplier-list>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人姓名" prop="contact_person">
            <el-input :disabled="curEventType == 'check'" v-model="form.contact_person" placeholder="请输入联系人姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人电话" prop="contact_phone">
            <el-input :disabled="curEventType == 'check'" v-model="form.contact_phone" placeholder="请输入联系人电话"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上传图片">
            <div class="list-data-list show-flex-box-r">
              <ul class="list-data" v-for="(item,index) in form.img_list" :key="index">
                <li class="item" v-if="item">
                  <image-box :src="item" :id="index+1" @on-delete="imageDelete(index)"></image-box>
                </li>
              </ul>
              <div class="item unchecked">
                <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;" @click="uploadFile()"></i>
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
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import imageBox from '@/components/image-box/index';
import multipleFilesUpload from "@/components/multiple-files-upload";
import getAssetsSelect from 'components/base/formModel/tree/get-assets-select-tree'
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getSupplierList from "@/components/base/formModel/select/get-supplier-list";
export default {
  name: 'goods-info',
  components: { imageBox, multipleFilesUpload, getAssetsSelect, getSelectDictionaries, getSupplierList },
  props: {
    curEventType: { 
      type: String,
      default: 'add'
    },
    classifyOptions1:[Array],//所属类别
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入电话号码'))
      }
      if (value.length !== 11) {
        callback(new Error('请输入正确电话号码'))
      }
      if (value.length !== 11) {
        callback(new Error('请输入正确电话号码'))
      }
      // 验证电话号码手机号码，包含至今所有号段? ?
      var ab = /^[1][3,4,5,7,8][0-9]{9}$/
      if (ab.test(value) === false) {
        callback(new Error('请输入正确电话号码'))
      }
      callback()
    }
    return {
      form: {
        id: 0,
        group_id: '',
        goods_code: '',
        goods_name: '',
        count: 0,
        model: '',
        warn_count: 0,
        price: 0,
        unit: 0,
        address: '',
        supplier_id: '',
        total_price: 0,
        contact_person: '',
        contact_phone: '',
        brand: '',
        img_list: [],
        file_list: [],
      },
      rules: {
        group_id: [
          { required: true, message: "请选择物品分类", trigger: "change", },
        ],
        goods_name: [
          { required: true, message: "请输入物品名称", trigger: "blur", },
        ],
        goods_code: [
          { required: true, message: "请输入物品编号", trigger: "blur", },
        ],
        // model: [
        //   { required: true, message: "请输入规格型号", trigger: "change", },
        // ],
        count: [
          { required: true, message: "请输入物品库存数量", trigger: "change", },
        ],
        // price: [
        //   { required: true, message: "请输入物品单价", trigger: "change", },
        // ],
        // total_price: [
        //   { required: true, message: "请输入总价值", trigger: "change", },
        // ],
        // unit: [
        //   { required: true, message: "请选择单位", trigger: "change", },
        // ],
        address: [
          { required: true, message: "请选择输入存放地点", trigger: "blur", },
        ],
        // supplier: [
        //   { required: true, message: "请输入供应商", trigger: "blur", },
        // ],
        // connect_name: [
        //   { required: true, message: "请输入联系人姓名", trigger: "blur", },
        // ],
        // contact_phone: [
        //   { required: true, message: "请输入联系人电话", trigger: "blur", },
        //   { validator: validatePhone, trigger: 'blur' }
        // ],
      }
    }
  },
  mounted() {

  },
  methods: {
    changeSupplier(info){
      this.form.contact_person = info.contacts
      this.form.contact_phone = info.contacts_phone
    },
    clearValid() {
      this.$refs['form'].clearValidate();
    },
    // 初始化数据
    resetData() {
      Object.assign(this.$data, this.$options.data());
      this.$refs['form'].clearValidate();
    },
    changeClassifyGroup(val) {
      if(this.curEventType != 'add') {
        return false
      }
      let params = {
        group_id: val
      }
      this.$client.GetGoodInfoCodeGoodsInfo(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.form.goods_code = res.context
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
          if(this.form.img_list.length) {
            this.form.image = this.form.img_list[0]
          }
          resolve({
            formData: this.form,
            result: 200,
            msg: "获取成功",
          });
        });
      });
    },
    // 回显
    setData(val) {
      for(let key in this.form) {
        if(val[key]) this.form[key] = val[key]
      }
      this.form.count = val.surplus_count
      if(val.image) {
        this.form.img_list = []
        this.form.img_list.push(val.image)
      }
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
      this.form.file_list = filesList
    },
    // 计算总价值
    sumTotal() {
      this.form.total_price = Number(this.form.price) * Number(this.form.count)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
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