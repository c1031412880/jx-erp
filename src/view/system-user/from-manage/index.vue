<template>
  <div class="from-manage">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-newgroup="groupAddHandle"
      @on-order="groupOrderShow = true"
      @on-setup="creatNewFrom"
    ></sub-req>
    <div class="from-manage-content">
      <table-data
        :formTotal="formTotal"
        :loading="loading"
        :disabled="disabled"
        @on-updateGroup="groupEditHandle"
        @on-deleteGroup="groupDeleteHandle"
        @on-updateFrom="creatNewFrom"
        @on-fromShort="formShortHandle"
        @on-authFrom="authFormHandle"
        @send-enableForm="enableFormHandle"
        @send-deleteForm="deleteFormHandle"
        @send-adjustForm="adjustFormHandle"
      ></table-data>
    </div>

    <creat-group-pop
      ref="creatGroup"
      :title="creatGroupTitle"
      :dialogBool.sync="addGroupDialogShow"
      @submit-creat-group="submitCreatGroup"
    ></creat-group-pop>

    <group-order-setting
      :dialogBool.sync="groupOrderShow"
      :customGroupSettingList="fromGroupList"
    ></group-order-setting>

    <form-order-setting
      :dialogBool.sync="formOrderShow"
      :formOrderSettingInfo="groupFormInfoList"
    ></form-order-setting>

    <adjust-group-pop
      :title="adjustGroupTitle"
      :dialogBool.sync="adjustGroupDialogShow"
      :fromGroupList="fromGroupList"
      :curGroupName="curGroupName"
      @submit-adjust-group="submitAdjustGroup"
    ></adjust-group-pop>

    <auth-form-dialog
      ref="authForm"
      :dialogBool.sync="authFormShow"
      @on-auth="submitAuthForm"
    ></auth-form-dialog>

    <add-form-dialog
      ref="addForm"
      :dialogBool.sync="addFormShow"
      :groupOptions="fromGroupList"
      :title="addTitle"
      @save-add-edit="saveAddForm"
    ></add-form-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import tableData from "./component/table";
import creatGroupPop from "./component/dialog/creat-group-pop";
import groupOrderSetting from "./component/dialog/group-order-setting";
import formOrderSetting from "./component/dialog/form-order-setting";
import adjustGroupPop from "./component/dialog/adjust-group-pop";
import authFormDialog from "./component/dialog/auth-form-dialog";
import addFormDialog from "./component/dialog/add-form-dialog";
export default {
  name: "from-manage",
  data() {
    return {
      form: {},
      formTotal: [],
      loading: false,
      creatGroupTitle: '新建表单分组',
      addGroupDialogShow: false,
      groupOrderShow: false,
      fromGroupList: [],
      formOrderShow: false,
      groupFormInfoList: [],
      adjustGroupDialogShow: false,
      adjustGroupTitle: '将「表单」移动到...',
      curGroupName: "",
      formId: "", //表单ID
      disabled: false,
      authFormShow: false,
      addFormShow: false,
      addTitle: "表单添加",
    };
  },
  components: {
    subReq,
    tableData,
    creatGroupPop,
    groupOrderSetting,
    formOrderSetting,
    adjustGroupPop,
    authFormDialog,
    addFormDialog,
  },
  mounted() {
    this.loadData();
  },
  methods: {
    // 查询
    onSubmit(form, bool) {
      this.form = form;
      this.disabled = bool;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let parmas = this.form;
      this.$client
        .getFormGroupList(parmas)
        .then((res) => {
          // console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.loading = false;
            this.formTotal = res.context;
            this.fromGroupList = res.context
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 新建表单分组
    groupAddHandle() {
      this.creatGroupTitle = '新建表单分组'
      this.addGroupDialogShow = true
    },
    // 重命名分组
    groupEditHandle(row) {
      this.creatGroupTitle = '重命名分组'
      let info = {}
      info.id = row.i_id
      info.name = row.c_type_name
      this.$refs.creatGroup.ruleForm = Object.assign({}, info)
      this.addGroupDialogShow = true
    },
    // 创建/重命名分组
    submitCreatGroup(from) {
      let params = {
        context: {},
      };
      params.context = {
        i_id: from.id,
        c_type_name: from.name,
      };
      if(this.creatGroupTitle == '新建表单分组') {
        delete params.context.i_id
        this.$client
          .addFormGroup(params)
          .then((res) => {
            if (res.head.result == "200") {
              this.loadData();
              this.$message({
                showClose: true,
                message: "创建成功",
                type: "success",
              });
            } else {
              this.$message({
                showClose: true,
                message: "创建失败",
                type: "error",
              });
            }
          })
          .catch((err) => {
            this.$message({
              showClose: true,
              message: err.body.message,
              type: "error",
            });
          });
      }else {
        this.$client
          .updateFormGroup(params)
          .then((res) => {
            if (res.head.result == "200") {
              this.loadData();
              this.$message({
                showClose: true,
                message: "重命名成功",
                type: "success",
              });
            } else {
              this.$message({
                showClose: true,
                message: "重命名失败",
                type: "error",
              });
            }
          })
          .catch((err) => {
            this.$message({
              showClose: true,
              message: err.body.message,
              type: "error",
            });
          });
      }
    },
    // 删除分组
    groupDeleteHandle(from) {
      let params = {
        context: []
      }
      params.context.push(from.i_id)
      this.$client
        .deleteNewFormGroup(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.$message({
              showClose: true,
              message: "删除分组成功",
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: "删除分组失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 分组排序
    updateTableForm(tableData) {
      let params = {
        context: []
      }
      params.context = tableData
      this.$client
        .updateFormGroupSort(params)
        .then((res) => {
          // console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.loadData();
            this.$message({
              showClose: true,
              message: "分组排序成功",
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: "分组排序失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 打开表单排序弹窗
    formShortHandle(info) {
      if(info.length) {
        this.groupFormInfoList = info
        this.formOrderShow = true
      }else {
        this.$message({
          showClose: true,
          message: "该分组无表单可排序表单！",
          type: "warning",
        });
      }
    },
    // 表单排序
    updateFormOrde(tableData) {
      let params = {
        context: []
      }
      tableData.forEach(item => {
        params.context.push({
          i_id: item.i_id,
          i_sort: item.i_sort
        })
      })
      this.$client
        .updateNewFormSort(params)
        .then((res) => {
          // console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.loadData();
            this.$message({
              showClose: true,
              message: "表单排序成功",
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: "表单排序失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 停用表单
    enableFormHandle(item, groupInfo) {
      if(groupInfo != '已停用') {
        let params = {
          form_id: item.i_id,
          classify_id: item.i_classify_id,
          use: 0,
        }
        this.$client
          .enableNewForm(params)
            .then((res) => {
              if (res.head.result == "200") {
                this.loadData();
                this.$message({
                  showClose: true,
                  message: '停用成功',
                  type: "success",
                });
              } else {
                this.$message({
                  showClose: true,
                  message: res.head.describle,
                  type: "error",
                });
              }
            })
            .catch((err) => {
              this.$message({
                showClose: true,
                message: err.body.message,
                type: "error",
              });
            });
      }else {
        this.formId = item.i_id
        this.adjustGroupTitle = '启用「表单」到...'
        this.curGroupName = groupInfo
        this.adjustGroupDialogShow = true
      }
    },
    // 移动表单
    adjustFormHandle(item, groupInfo) {
      this.formId = item.i_id
      this.adjustGroupTitle = '将「表单」移动到...'
      this.curGroupName = groupInfo
      this.adjustGroupDialogShow = true
    },
    // 启用表单
    submitAdjustGroup(info) {
      if(this.adjustGroupTitle == '启用「表单」到...') {
        let params = {
          form_id: this.formId,
          classify_id: info.id,
          use: 1
        }
        this.$client
          .enableNewForm(params)
            .then((res) => {
              if (res.head.result == "200") {
                this.loadData();
                this.$message({
                  showClose: true,
                  message: '启用成功',
                  type: "success",
                });
              } else {
                this.$message({
                  showClose: true,
                  message: res.head.describle,
                  type: "error",
                });
              }
            })
            .catch((err) => {
              this.$message({
                showClose: true,
                message: err.body.message,
                type: "error",
              });
            });
      }else {
        let params = {
          form_id: this.formId,
          classify_id: info.id
        }
        this.$client
          .updateNewForm(params)
            .then((res) => {
              if (res.head.result == "200") {
                this.loadData();
                this.$message({
                  showClose: true,
                  message: '表单移动成功',
                  type: "success",
                });
              } else {
                this.$message({
                  showClose: true,
                  message: res.head.describle,
                  type: "error",
                });
              }
            })
            .catch((err) => {
              this.$message({
                showClose: true,
                message: err.body.message,
                type: "error",
              });
            });
      }
    },
    // 删除表单
    deleteFormHandle(item) {
      let params = {
        form_id: item.i_id
      }
      this.$client
        .deleteNewForm(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.$message({
              showClose: true,
              message: "删除表单成功",
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 获取表单权限设置
    authFormHandle(item) {
      console.log(item);
      let params = {}
      params.form_id = item.i_form_id
      this.$client
        .GetFormPermissionFormManagerNew(params)
        .then((res) => {
          if (res.head.result == "200") {
            console.log(res.context);
            this.$refs.authForm.setDate(res.context[0])
            this.authFormShow = true
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 提交表单权限设置
    submitAuthForm(info) {
      let params = {}
      params.context = Object.assign({}, info);
      this.$client
        .AddFormPermissionFormManagerNew(params)
        .then((res) => {
          this.authFormShow = false
          if (res.head.result == "200") {
            this.loadData();
            this.$message({
              showClose: true,
              message: "表单权限设置成功",
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 表单功能暂时不做，为后续自定义表单保留
    creatNewFrom(val, type) {
      console.log(val, type);
      this.addTitle = type == 'updateFrom' ? '编辑表单' : '表单添加'
      this.addFormShow = true
      if(type == 'updateFrom') {
        this.$refs.addForm.setData(val)
      }
    },
    editFrom() {
      this.$message({
        showClose: true,
        message: "暂不支持编辑表单",
        type: "warning",
      })
    },
    saveAddForm(val) {
      let params = {}
      params.context = Object.assign({}, val);
      if(this.addTitle === '表单添加') {
        this.$client
          .addNewForm(params)
          .then((res) => {
            this.authFormShow = false
            if (res.head.result == "200") {
              this.loadData();
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "success",
              });
              this.addFormShow = false
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
          })
          .catch((err) => {
            this.$message({
              showClose: true,
              message: err.body.message,
              type: "error",
            });
          });
      }else {
        this.$client
          .EditNewForm(params)
          .then((res) => {
            this.authFormShow = false
            if (res.head.result == "200") {
              this.loadData();
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "success",
              });
              this.addFormShow = false
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
          })
          .catch((err) => {
            this.$message({
              showClose: true,
              message: err.body.message,
              type: "error",
            });
          });
      }
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.from-manage {
  width: 100%;
  height: 100%;
  .from-manage-content {
    width: 100%;
    height: calc(100% - 65px);
    overflow-y: scroll;
  }
}
</style>
