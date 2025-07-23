<template>
  <div class="process-info-manage">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-newgroup="addGroupDialogShow = true"
      @on-order="groupOrderShow = true"
      @on-setup="creatNewFrom"
    ></sub-req>
    <table-data
      :formTotal="formTotal"
      :loading="loading"
      @open-from-order-pop="openFromOrderPop"
      @send-group-edit="sendGroupEdit"
      @send-group-dead="sendGroupDead"
      @send-group-adjust="sendGroupAdjust"
      @send-form-delete="sendFormDelete"
      @change-form-visible="changeFormVisible"
    ></table-data>

    <creat-group-pop
      :dialogBool.sync="addGroupDialogShow"
      @submit-creat-group="submitCreatGroup"
    ></creat-group-pop>

    <adjust-group-pop
      :dialogBool.sync="adjustGroupDialogShow"
      :fromGroupList="fromGroupList"
      :curGroupName="curGroupName"
      @submit-adjust-group="submitAdjustGroup"
    ></adjust-group-pop>

    <group-order-setting
      :dialogBool.sync="groupOrderShow"
      :customGroupSettingList="fromGroupList"
    ></group-order-setting>

    <form-order-setting
      :dialogBool.sync="formOrderShow"
      :formOrderSettingInfo="groupFormInfoList"
    ></form-order-setting>

    <setup-form
      :dialogBool.sync="setupFormShow"
      :fromGroupList="fromGroupList"
      :formDataInfo="formDataInfo"
      :curFormInfo="curFormInfo"
      :changeType="changeType"
      @submit-creat-form="submitCreatForm"
    ></setup-form>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import tableData from "./component/table";
import creatGroupPop from "./component/creat-group-pop";
import adjustGroupPop from "./component/adjust-group-pop";
import groupOrderSetting from "./component/group-order-setting";
import formOrderSetting from "./component/form-order-setting";
import setupForm from "./component/setup-form";
export default {
  name: "from-manage",
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      informationDialogShow: false,
      addGroupDialogShow: false,
      adjustGroupDialogShow: false,
      groupOrderShow: false,
      formOrderShow: false,
      groupFormInfoList: [],
      curGroupName: "",
      formTotal: [
        {
          id: 1,
          count: "2",
          title: "机务",
          itemList: [
            {
              id: 1,
              formTitle: "年检通过申请单1",
              describe:
                "用于年检通过后，分公司向总公司提交申请用于年检通过后，分公司向总公司提交申请用于年检通过后，分公司向总公司提交申请用于年检通过后，分公司向总公司提交申请",
              updateTime: "2021-1-25 00:25:25",
              status: 1,
            },
            {
              id: 2,
              formTitle: "年检通过申请单2",
              describe: "用于年检通过后，分公司向总公司提交申请....",
              updateTime: "2021-1-25 00:25:25",
              status: 1,
            },
          ],
        },
        {
          id: 2,
          count: "2",
          title: "人事",
          itemList: [
            {
              id: 1,
              formTitle: "请假单1",
              describe: "用于年检通过后，分公司向总公司提交申请....",
              updateTime: "2021-1-25 00:25:25",
              status: 1,
            },
            {
              id: 2,
              formTitle: "请假单2",
              describe: "用于年检通过后，分公司向总公司提交申请....",
              updateTime: "2021-1-25 00:25:25",
              status: 1,
            },
          ],
        },
      ],
      setupFormShow: false, //打开表单
      changeType: "", //新建、编辑
      fromGroupList: [],
      orgISortList: [],
      fromGroupInfo: [],
      formId: "", //表单ID
      formDataInfo: null,
      curFormInfo:null,
    };
  },
  components: {
    subReq,
    tableData,
    creatGroupPop,
    adjustGroupPop,
    groupOrderSetting,
    formOrderSetting,
    setupForm,
  },
  mounted() {
    this.loadData();
    this.reqQueryFromGroup();
  },
  methods: {
    creatNewFrom() {
      this.changeType = "add";
      this.setupFormShow = true;
    },

    // 创建分组
    submitCreatGroup(from) {
      let params = {
        context: [],
      };
      params.context[0] = {
        c_type_name: from.name,
      };
      this.$client
        .addInsertGroup(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.fromGroupInfo = [];
            this.reqQueryFromGroup();
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
    },
    // 调整分组
    submitAdjustGroup(i_classify_id) {
      let params = {
        context: [],
      };
      params.context[0] = {
        i_classify_id: i_classify_id,
        i_id: this.formId,
      };
      console.log(JSON.stringify(params));
      this.$client
        .adjustFormGroup(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            // this.fromGroupInfo = [];
            // this.reqQueryFromGroup();
            this.$message({
              showClose: true,
              message: "调整分组成功",
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: "调整分组失败",
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

    // 分页切换事件
    // handleCurrentChange(idx) {
    //   this.pageInfo.pageIndex = idx;
    //   this.get_List();
    //   // this.tabledata = this.tabledataAll.slice((idx-1)*this.pageInfo.pageSize,idx*this.pageInfo.pageSize)
    // },
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let parmas = this.form;
      this.$client
        .reqFormSortGroup(parmas)
        .then((res) => {
          // console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.loading = false;
            this.formTotal = res.context;
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
    // 查询分组
    reqQueryFromGroup() {
      this.$client
        .queryFromGroup()
        .then((res) => {
          // console.log("////////");
          // console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.fromGroupInfo = res.context;
            // console.log(fromGroupInfo)
            this.fromGroupInfo.forEach((item, index) => {
              let obj = {
                id: item.i_id,
                label: item.c_type_name,
                sort: index,
                i_sort: item.i_sort,
              };
              this.fromGroupList.push(obj);
              // this.orgISortList.push(item.i_sort)
            });
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
    // 分组排序、删除
    updateTableForm(tableData, deleteGroupId) {
      if (deleteGroupId.length) {
        deleteGroupId.forEach((id, index) => {
          this.fromGroupInfo.forEach((jItem, jIndex) => {
            if (jItem.i_id == id) {
              this.fromGroupInfo.splice(jIndex, 1);
            }
          });
        });
      }
      console.log(JSON.stringify(this.fromGroupInfo));
      this.fromGroupInfo.forEach((item, index) => {
        item.i_sort = tableData[index].i_sort;
      });
      console.log(JSON.stringify(this.fromGroupInfo));
      let params = {
        context: this.fromGroupInfo,
      };
      this.$client
        .groupSort(params)
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

      if (deleteGroupId.length > 0) {
        let deleteGroupIdParams = {
          context: deleteGroupId,
        };
        this.$client
          .deleteFormGroup(deleteGroupIdParams)
          .then((res) => {
            // console.log(JSON.stringify(res));
            if (res.head.result == "200") {
              this.loadData();
              // this.$message({
              //   showClose: true,
              //   message: "分组排序成功",
              //   type: "success",
              // });
            } else {
              this.$message({
                showClose: true,
                message: "分组删除失败",
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
      // 排序和删除分组之后都需要刷新一下列表
      // alert(111)
      // this.loadData();
    },
    // 表单排序
    updateFormOrde(tableData) {
      tableData.forEach((item, index) => {
        this.groupFormInfoList.forEach((zItem, zIndex) => {
          if (item.id == zItem.i_form_id) {
            zItem.i_sort = item.sort;
          }
        });
      });
      // console.log(this.groupFormInfoList)
      // console.log(JSON.stringify(tableData));
      let params = {
        context: this.groupFormInfoList,
      };
      console.log(JSON.stringify(params))
      this.$client
        .updateFormSort(params)
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
    // 打开获取表单排序弹窗
    openFromOrderPop(groupFormInfo) {
      // alert(JSON.stringify(groupFormInfo))
      let i_classify_id = groupFormInfo.i_id || "";
      let params = {
        id: i_classify_id,
      };
      this.$client
        .reqFormSortList(params)
        .then((res) => {
          console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.groupFormInfoList = res.context;
            this.formOrderShow = true;
            console.log(this.groupFormInfoList);
          } else {
            this.$message({
              showClose: true,
              message: "获取表单排序记录失败",
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
      // this.groupFormInfoList = groupFormInfo;
    },

    sendGroupEdit(formInfo, groupFormInfo) {
      this.changeType = "edit";
      this.setupFormShow = true;
      this.curFormInfo = formInfo;
      // alert(JSON.stringify(formInfo))
      let params = {
        form_id: formInfo.i_form_id,
      };
      this.$client
        .getForm(params)
        .then((res) => {
          // console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.formDataInfo = res.context;
            // console.log(JSON.stringify(this.formDataInfo));
            this.setupFormShow = true;
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
    // 停用启用表单
    sendGroupDead(formInfo, groupFormInfo) {
      let params = {
        form_id: formInfo.i_form_id,
        enable: formInfo.i_enabled ? 0 : 1,
      };
      let messageInfo = formInfo.i_enabled
        ? `${formInfo.c_form_name}停用成功`
        : `${formInfo.c_form_name}启用成功`;
      this.$client
        .enableForm(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.$message({
              showClose: true,
              message: messageInfo,
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
      // alert(111)
    },
    // 删除表单
    sendFormDelete(formInfo, groupFormInfo) {
      let i_form_id = [];
      i_form_id[0] = formInfo.i_form_id;
      let deleteFormIdParams = {
        context: i_form_id,
      };
      this.$client
        .deleteForm(deleteFormIdParams)
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
    // 修改表单可见范围
    changeFormVisible(params) {
      console.log(params)
      this.$client
        .editFormVisible(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.$message({
              showClose: true,
              message: "修改成功",
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
    //
    sendGroupAdjust(formInfo, groupFormInfo) {
      this.adjustGroupDialogShow = true;
      this.curGroupName = groupFormInfo.c_type_name;
      this.formId = formInfo.i_id;

      // alert(JSON.stringify(formInfo))
    },
    // 创建、编辑表单
    submitCreatForm(context) {
      let params = {
        context: context,
      };
      console.log(JSON.stringify(params));
      if (this.changeType == "add") {
        this.$client
          .createForm(params)
          .then((res) => {
            console.log(JSON.stringify(res));
            if (res.head.result == "200") {
              this.loadData();
              this.$message({
                showClose: true,
                message: "创建表单成功",
                type: "success",
              });
            } else {
              this.$message({
                showClose: true,
                message: "创建表单失败",
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
      } else {
        this.$client
          .editForm(params)
          .then((res) => {
            console.log(JSON.stringify(res));
            if (res.head.result == "200") {
              this.loadData();
              this.$message({
                showClose: true,
                message: "编辑表单成功",
                type: "success",
              });
            } else {
              this.$message({
                showClose: true,
                message: "编辑表单失败",
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
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.process-info-manage {
  width: 100%;
  height: 100%;
}
</style>
