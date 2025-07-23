<template>
  <div class="change-password">
    <div class="el-top">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="100px">
        <el-form-item label="原密码:" prop="old_password">
          <el-input v-model="form.old_password" placeholder="请输入原密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码:" prop="new_password">
          <el-input
            v-model="form.new_password"
            placeholder="请输入新密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码:" prop="make_password">
          <el-input
            v-model="form.make_password"
            placeholder="请输入新密码"
            show-password
          ></el-input>
        </el-form-item>
        <div style="color:red;margin-bottom: 10px;">
          密码必须为包含字母、特殊字符、数字长度为8到16位！
        </div>
        <el-form-item style="text-align: center">
          <el-button type="primary" @click="sureInfo('form')">确 定</el-button>
          <el-button type="primary" @click="goBack()">返 回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getUser } from "@/utils/auth";
import {md5} from 'api/md5'
export default {
  name: "change-password",
  data() {
    return {
      form: {
        old_password: "",
        new_password: "",
        make_password: ""
      },
      basicRules: {
        old_password: [
          { required: true, message: "请输入密码", trigger: "change" }
        ],
        new_password: [
          { required: true, message: "请输入密码", trigger: "change" },
        ],
        make_password: [
          { required: true, message: "请输入密码", trigger: "change" },
        ]
      }
    };
  },
  mounted() {
    // if (getUser()) {
    //   let userInfo = JSON.parse(getUser());
    //   this.form.id = userInfo.user_id;
    // }
  },
  methods: {
    sureInfo(formName) {
       this.$refs[formName].validate((valid) => {
          if (valid) {
            let reg = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,16}');
            if(!reg.test(this.form.new_password)) {
              this.$message({
                message: '密码必须为包含字母、特殊字符、数字长度为8到16位！',
                type: 'warning'
              });
              return
            }

            if(this.form.new_password != this.form.make_password) {
              this.form.new_password = '';
              this.form.make_password = '';
              this.$message({
                message: '新密码和确认密码不一致， 请重新输入',
                type: 'warning'
              });
              return
            }
            let params = {
              old_password: md5(this.form.old_password),
              new_password: md5(this.form.new_password),
            }
            this.$client.changePwd(params)
            .then(res => {
              if (res.errcode == "200") {
                this.$message({ message: "修改成功", type: "success" });
                this.$router.push("/login");
                this.$store.dispatch('FedLogOut').then(() => {
                  try {
                    removeToken()
                    removeUser()
                    removeRoleIds()
                    removeSession()
                  } catch (error) {
                    console.log(error)
                  }
                  // 如果是中台免登的  退回中台
                  if (JSON.parse(localStorage.getItem('FreeLogin'))) {
                    let url = localStorage.getItem('centerUrl')
                    window.location.href = url
                  } else {
                    location.reload() // 为了重新实例化vue-router对象 避免bug
                  }
                })
              } else {
                this.$message({ message: res.head.describle, type: "error" });
              }
            })
        .catch(err => {});
          } else {
            return false;
          }
        });

    },
    goBack(){
      this.$router.go(-1)
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.change-password {
  // width: 100vw;
  // height: 100vh;
}

.el-top {
  width: 400px;
  height: 460px;
  border-radius: 6px;
  // background-color: #999999;
  // margin: calc(((100vh - 460px) / 2)) auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
</style>
