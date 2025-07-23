<!--  -->
<template>
  <div class="">
    <!-- <div class="width-slider">
      <select-form></select-form>
    </div> -->
    <!-- <div v-if="confGlobalS.length > 0">
      <form-content
      v-for="(item,i) in confGlobalS"
      :key="i + `${item.form_name}`"
      :confGlobal="confGlobal"
      :form_name="form_name"></form-content>
    </div> -->

    <div>
      <el-table :data="tableData" style="width: 50%" border>
        <el-table-column
          prop="name"
          label="表单名称"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="openFillFormPage(scope.$index, scope.row)"
              >填写</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { get_form_table, add_form_data } from "@/api/erp";
import selectForm from "./components/select-form";
import formContent from "./components/form-content";
export default {
  components: {
    selectForm,
    formContent,
  },
  data() {
    return {
      tableData: [],
      confGlobal: null,
      confGlobalS: [],
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getAllForm();
  },
  methods: {
    getAllForm() {
      get_form_table({}).then((req) => {
        if (req.head.result === "200") {
          this.tableData = req.content.data;
        } else {
        }
      });
    },

    openFillFormPage(index,row) {
      this.isShowFillForm = true;
      console.log(row)
      this.toFatherMethods(row.name,row.id)
    },

    toFatherMethods(formName,formId) {

      this.form_name = formName;
      let content = {
        form_name: formName,
      };
      console.log(content)
      get_form_table(content).then((req) => {
        console.log(req);
        if (req.head.result === "200") {
          let FormOptionsList = req.content.data;
          this.confGlobal = JSON.parse(FormOptionsList[0].source_data);
          this.confGlobal.formRef = this.form_name;
          this.confGlobalS = [];
          setTimeout(() => {
            this.confGlobalS = [JSON.parse(FormOptionsList[0].source_data)];
          }, 60);
          this.$router.push({name:'fill-submit-form',query: { formData: this.confGlobal,formName:formName,formId:formId}})

        } else {
        }


      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.preview-container {
  margin: 3rem auto 1rem;
  border-radius: 6px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);

  .width-slider {
    margin-top: 10px;
    width: 400px;
    position: absolute;
    top: 0;
    left: 2rem;
  }
}

.showDivider.form-container {
  margin-bottom: 2rem;
}

.el-range-editor--small .el-range-separator {
  width: 20px !important;
}
</style>
