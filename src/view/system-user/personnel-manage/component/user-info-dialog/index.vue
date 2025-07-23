<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="780px"
    
  >
    <div class="el-dialog-div">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane name="用户信息" label="用户信息">
          <div style="width: 670px;height: 550px;">
            <form-data ref="formData"></form-data>
          </div>
        </el-tab-pane>
        <el-tab-pane name="部门选择" label="部门选择">
          <div style="width: 670px;height: 550px;">
            <group-data ref="groupData"></group-data>
          </div>
        </el-tab-pane>
        <el-tab-pane name="角色选择" label="角色选择">
          <div style="width: 670px;height: 550px;">
            <role-data ref="roleData"></role-data>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import groupData from './group-data'
  import formData from './form-data'
  import roleData from './role-data'
  export default {
    props: {
      dialogBool: Boolean,
      title: [String]
    },
    components: {formData,groupData, roleData},
    data() {
      return {
        form: {
        },
        activeName: "用户信息",
        checkers: []
      };
    },
    watch: {
      dialogBool(bool) {
        if (bool === false) {
          Object.assign(this.$data, this.$options.data());
          this.$refs.roleData.initTreeData({});
          this.$refs.groupData.initTreeData({});
          this.$refs.formData.assign()
        }
      },
    },
    methods: {
      initFormData(form) {
        let roles = []
        let group = []
        if (form.orgs) {
          form.orgs.forEach(item => {
            group.push(item.i_org_id)
          })
        }

        if (form.roles){
          form.roles.forEach(item => {
            roles.push(item.i_id)
          })
        }
        this.$refs.roleData.initTreeData({keys: roles})
        this.$refs.groupData.initTreeData({keys: group, data: form.orgs})
        for(let i = 0;i<Object.keys(this.$refs.formData.form).length;i++) {
          let key = Object.keys(this.$refs.formData.form)[i]
          this.$refs.formData.form[key] = form[key] || ''
        }
      },
      dialogClose() {
        this.$emit("update:dialogBool", false);
      },
      ok() {
        this.form = this.$refs.formData.form
        this.form.orgs = this.$refs.groupData.data
        this.form.role_ids = this.$refs.roleData.keys
        if (!this.form.c_login_id) {
          this.$message.error('请输入用户账号');
          return false
        }
        if (!this.form.c_name) {
          this.$message.error('请输入用户姓名');
          return false
        }
        // if (!this.form.c_worker_id) {
        //   this.$message.error('请输入用户工号');
        //   return false
        // }
        if (this.form.c_state === '2') {
          if (!this.form.d_expired) {
            this.$message.error('请选择用户有效时长');
            return false
          }
        }
        if (!this.form.orgs.length) {
          this.$message.error('请选择用户所属部门');
          return false
        } else {
          let num = 0
          this.form.orgs.forEach(item => {
            if (item.is_main_org) {
              num ++
            }
          })
          if (num === 0) {
            this.$message.error('请设置主部门');
            return false
          }
          if (num > 1) {
            this.$message.error('用户只能设置1个主部门');
            return false
          }
        }
        this.form.systems_login = ['erp']
        this.$emit('on-ok', this.form)
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
