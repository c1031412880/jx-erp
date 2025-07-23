<template>
  <el-dialog
    :visible="dialogBool"
    title="车辆年检"
    :before-close="dialogClose"
    width="560px"
    
  >
    <div class="el-dialog-div">
      <el-form
        size="mini"
        ref="form"
        label-width="120px"
      >
        <el-form-item label="自编号:" >
          <el-input
            v-model="form.v_num"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="车牌号:">
          <el-input
            v-model="form.lp_num"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="上次年检日期:">
          <el-input
            v-model="form.last_check_date"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="本次年检日期:">
          <el-date-picker
            v-model="form.real_check_date"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input
            v-model="form.remark"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <ul class="list-data">
            <li class="item" v-for="(src,i) in imageUrls" :key="i">
              <image-box :src="src" :id="i" @on-delete="imageDelete"></image-box>
            </li>
            <li class="item unchecked" v-if="imageUrls.length < 3" @click="uploadFile()">
              <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
            </li>
          </ul>
        </el-form-item>
<!--        <el-form-item label="审批流程:">-->
<!--          <approve-step v-if="dialogBool" @on-users="setUsers" :form_id="approveObj.id"></approve-step>-->
<!--        </el-form-item>-->
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import {getUser} from '@/utils/auth'
  import imageBox from './image-box'
  import approveConfig from 'components/approve-echo/config'
  import approveStep from 'components/approve-echo/approve-step'
  export default {
    components: {imageBox, approveStep},
    props: {
      dialogBool: Boolean,
      title: {
        type: String,
        default: "编辑",
      },
      curSelecedType: [String],
    },
    data() {
      return {
        form: {
          id: 0,
          real_check_date: '',
          remark: '',
          image_urls: '',
          submitid: '',
          checkers: '',
          v_num: '',
          lp_num: '',
          last_check_date: '',
          check_person: '',
        },
        imageUrls: [],
        approveObj: approveConfig['年检管理']
      };
    },
    watch: {
      dialogBool(bool) {
        if (bool === false) {
          Object.assign(this.$data, this.$options.data());
          this.resetForm()
        }
      },
    },
    methods: {
      // 设置审核人
      setUsers(data) {
        this.form.nodes = data
      },
      dialogClose() {
        this.$emit("update:dialogBool", false);
      },
      ok() {
        if (!this.form.real_check_date) {
          this.$message.error('请选择本次年检日期');
          return false
        }
        if (this.imageUrls.length) {
          this.form.image_urls = this.imageUrls.toString()
        }
        this.form.submitid = JSON.parse(getUser()).user_id
        this.$emit('on-ok', this.form)
      },
      imageDelete(i) {
        if(this.imageUrls.length) {
          this.imageUrls.splice(i,1)
        }
      },
      // 自定义上传文件方法
      // :http-request="uploadFile"
      uploadFile() {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = () => {
          console.log(input.files);
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
              this.imageUrls.push(req.context);
            }
          });
        };
        input.click();
      },
      resetForm() {
        this.$refs["form"].resetFields();
      },
    },
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .list-data
    width: 450px
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

