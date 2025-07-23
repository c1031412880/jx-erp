<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="租房名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入租房名称"></el-input>
        </el-form-item>
        <el-form-item label="地址:" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <!-- <el-form-item label="联系人:" prop="person_name">
          <el-input v-model="form.person_name" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="person_phone">
          <el-input v-model="form.person_phone" placeholder="请输入联系电话" oninput="value=value.replace(/[^\d.-]/g,'')"  @blur="form.person_phone = $event.target.value"></el-input>
        </el-form-item> -->
        <el-form-item label="租金:" prop="hope_rent">
          <el-input v-model="form.hope_rent" placeholder="请输入租金" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.hope_rent = $event.target.value"></el-input>
        </el-form-item>
        <el-form-item label="面积/㎡:" prop="area">
          <el-input v-model="form.area" placeholder="请输入房屋面积" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.area = $event.target.value"></el-input>
        </el-form-item>
        <el-form-item label="房源类型:" prop="type">
          <tr-select-dictionaries v-model="form.type" :classKey="'房源类型'" :placeholder="'房源类型'"></tr-select-dictionaries>
        </el-form-item>
        <!-- <el-form-item label="出租方式:" prop="way">
          <tr-select-dictionaries v-model="form.way" :classKey="'出租方式'" :placeholder="'出租方式'"></tr-select-dictionaries>
        </el-form-item>
        <el-form-item label="看房时间:" prop="view_time">
          <tr-select-dictionaries v-model="form.view_time" :classKey="'看房时间'" :placeholder="'看房时间'"></tr-select-dictionaries>
        </el-form-item>
        <el-form-item label="房间设施:" prop="facilities">
          <el-input v-model="form.facilities" placeholder="请输入房间设施"></el-input>
        </el-form-item> -->

        <el-form-item label="房产证编号:" prop="house_no">
          <el-input v-model="form.house_no" placeholder="请输入房产证编号"></el-input>
        </el-form-item>
        <el-form-item label="土地证编号:" prop="land_no">
          <el-input v-model="form.land_no" placeholder="请输入土地证编号"></el-input>
        </el-form-item>


        <el-form-item label="上传照片:" prop="images">
          <div class="list-data-list show-flex-box-r">
            <ul class="list-data" v-for="(item,index) in form.images" :key="index">
              <li class="item" v-if="item">
                <image-box :src="item" :id="index+1" @on-delete="imageDelete(index)"></image-box>
              </li>
              <!-- <li class="item unchecked" v-else @click="uploadFile()">
                <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
              </li> -->
            </ul>
            <div class="item unchecked" @click="uploadFile()" v-if="form.images.length < 9">
              <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
            </div>
          </div>
          
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确认发布</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import imageBox from './image-box'
export default {
  components: { imageBox },
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
        name: "",
        address: "",
        person_name: "",
        person_phone: "",
        hope_rent: "",
        type: "",
        area: "",
        way: "",
        land_no: "",
        house_no: "",
        view_time: "",
        facilities: "",
        state: "",
        images:[],
      },
      basicRules: {
        name: [
          { required: true, message: "请输入租房名称", trigger: "change" },
        ],
        address: [
          { required: true, message: "请填写地址", trigger: "change" },
        ],
        // person_name: [
        //   { required: true, message: "请输入联系人名称", trigger: "change" },
        // ],
        // person_phone: [
        //   { required: true, message: "请填写联系电话", trigger: "change" },
        // ],
        // hope_rent: [
        //   { required: true, message: "请输入租金", trigger: "change" },
        // ],
        // type: [
        //   { required: true, message: "请选择房源类型", trigger: "change" },
        // ],
        area: [
          { required: true, message: "请输入房屋面积", trigger: "change" },
        ],
        
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
   imageDelete(index) {
      this.form.images.splice(index,1)
    },
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        reader.onload = (ev) => {
          input = undefined;
        };
        let params = new FormData
        params.append('file', file)
        this.$client.uploadPicture({file: params}, '/api/ERPWeb/VehicleManager/AddCarInfoImage').then((req) => {
          // console.log(req);
          if (req.head.result === "200") {
            this.form.images.push(req.context)
          }
        });
      };
      input.click();
    },
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
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
  width: 380px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 380px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 380px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 380px;
}
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

