<script>
import {get_form_table,add_form_data} from '@/api/erp'
import render from '@/assets/utils/render.js'
import { trigger } from '@/components/DynamicForm/components/generator/config.js'

// import {removeDrawingList,saveDrawingList} from '@/components/DynamicForm/utils/db'

/**
 * 校验组织机构组件是否为空
 */
const setFcOrgSelectRule = ( conf, ctx ) => {
  return { 
    validator: (rule, value, callback) => {
      var count = 0
      var val = ctx[ctx.confGlobal.formModel][rule.field]
      conf.tabList.forEach(key => {
        val && Array.isArray(val[key]) && (count += val[key].length)
      })
      callback(count ? undefined : new Error(`${conf.title}不能为空`))
    }, 
    trigger: trigger[conf.tag],
    type: 'object' 
  }
}
/**
 * 收集表单必填项并组装成ElementUI表单校验得rules选项
 */
function buildRules ( conf, ctx ) {
  if ( conf.vModel === undefined ||  !trigger[conf.tag]) return
  const rules = []
  if ( conf.required ) {
    const type = Array.isArray( conf.defaultValue ) ? 'array' : undefined
    let message = Array.isArray( conf.defaultValue ) ? `请至少选择一个` : conf.placeholder
    if ( message === undefined ) message = `${conf.label}不能为空`
    conf.tag === 'fc-org-select'
      ? rules.push( setFcOrgSelectRule( conf, ctx ) )
      : rules.push( { required: true, type, message, trigger: trigger[conf.tag] } )
  }
  // 自定义正则匹配
  if ( conf.regList && Array.isArray( conf.regList ) ) {
    conf.regList.forEach( item => {
      if ( item.pattern ) {
        rules.push( { pattern: eval( item.pattern ), message: item.message, trigger: trigger[conf.tag] } )
      }
    } )
  }
  ctx.rules[conf.vModel] = rules
}


var setData = (ctx, val, prop, init = false) => {
  // alert(1141)
  if (!prop) return
  if (init) ctx.$set(ctx[ctx.confGlobal.formModel], prop, val)
  else ctx[ctx.confGlobal.formModel][prop] = val
}


var _isMounted = false // 收集默认值 渲染完成之后防止重复收集默认值

const buildData = (ctx, value, prop) => setData(ctx, value, prop, true)

const layouts = {
  colFormItem: function (conf,  h, ctx, noFormItem = false,) {
    buildRules(conf, ctx)
    !_isMounted && buildData(ctx, conf.defaultValue, conf.vModel)
    // console.log(ctx, conf.vModel)
    let labelWidth = ''
    if ( conf.labelWidth ) labelWidth = `${conf.labelWidth}px`
    if ( noFormItem ) labelWidth = "0px"
    const required = ( !trigger[conf.tag] && conf.required ) || conf.tag === 'fc-org-select' 
    let item =  <el-col span={conf.span}>
                  <el-form-item label-width={labelWidth} label={noFormItem ? '' : conf.label} prop={conf.vModel}  required={required}>
                    <render onInput={val => setData(ctx, val, conf.vModel)} value={ctx[ctx.confGlobal.formModel][conf.vModel]} ref={conf.rowType === 'table'  ? conf.vModel : undefined} conf={conf}  />
                  </el-form-item>
                </el-col>

    if (noFormItem) {
      var tableTitle = <el-col span={24} style="font-size: 14px;padding:6px 0px;margin-bottom: 4px;border-bottom: 1px solid #e5e5e5;">{conf.label}</el-col>
      return [tableTitle, item]
    }
    return item
  },

  rowFormItem: function (conf, h, ctx) {
     if ( conf.rowType === 'table' ) {
       ctx.tableRefs[conf.vModel] = conf
       const param = {...conf, config: conf, formSize: ctx.confGlobal.size, labelWidth: `${conf.labelWidth || ctx.confGlobal.labelWidth}px`}
       return this.colFormItem( param, h, ctx, conf.type === 'list' )
    }
    buildRules(conf, ctx)
    const props = {
      type: conf.type === 'default' ? undefined : conf.type,
      justify: conf.type === 'default' ? undefined : conf.justify,
      align: conf.type === 'default' ? undefined : conf.align,
      gutter: typeof conf.gutter === 'number' ? conf.gutter : undefined,
    }
    let row = <el-col span={conf.span || 24}>
                <el-row {...{ props: props }}>
                  { Array.isArray(conf.children) && conf.children.map( ( el ) => layouts[el.layout]( el, h, ctx ) ) }
                </el-row>
              </el-col>
    let divider
    if (conf.showDivider) {
      let explain
      if (conf.cmpType === 'custom' && conf.explain) {
        explain = <el-tooltip effect="dark" content="组件说明" placement="top">
                    <i class="el-icon-info"
                      onClick={ctx.showExplain.bind(this, conf.explain, conf.label)}
                      style="margin-right: 8px; color: #E6A23C;cursor: pointer;">
                    </i>
                  </el-tooltip>
      }
      divider = <el-col span={24}>
                  <el-divider content-position="left" >{explain} {conf.label}</el-divider>
                </el-col>
      return [divider, row]
    } 
    return row
  },
}


export default {
  components: {
    render,
  },
  props:{
      confGlobalAll:[Object],
      form_name:[String],
      confGlobal: [Object]
  },
  // watch: {
  //   'formData' (a,b) {
  //     console.log(123456789,a,b)
  //   }
  // },
  data () {
    var confGlobal = this.confGlobal
    console.log('55667788',this[this.confGlobal.formModel])
    // var isLoad = false
    // console.log('123456',confGlobal)
    // // var confGlobal = {"formRef":"elForm","formModel":"formData","size":"small","labelPosition":"right","labelWidth":100,"formRules":"rules","gutter":15,"disabled":false,"span":12,"formBtns":true,"fields":[{"cmpType":"common","label":"组织机构","tag":"fc-org-select","tagIcon":"dept","defaultValue":{"dep":[{"nodeId":1,"deptId":1,"deptName":"xxx公司"}]},"tabList":["dep"],"buttonType":"button","title":"组织机构","searchable":true,"maxNum":1,"tagConfig":{"type":"info","closable":true,"disable-transitions":true,"hit":false,"size":"small","effect":"light"},"style":{"width":"100%"},"span":24,"labelWidth":0,"disabled":true,"required":true,"regList":[],"changeTag":true,"proCondition":true,"asSummary":false,"layout":"colFormItem","formId":20,"renderKey":1590641662215,"vModel":"field20"},{"cmpType":"common","label":"姓名","tag":"el-input","tagIcon":"input","placeholder":"请输入姓名","span":12,"labelWidth":0,"style":{"width":"100%"},"clearable":true,"prepend":"","append":"","prefix-icon":"","suffix-icon":"","maxlength":null,"show-word-limit":false,"readonly":false,"disabled":false,"required":false,"regList":[],"changeTag":true,"proCondition":false,"asSummary":false,"formId":2,"renderKey":1590647662215,"layout":"colFormItem","vModel":"field2"},{"cmpType":"common","label":"学历","tag":"el-select","tagIcon":"select","placeholder":"请选择学历","span":12,"labelWidth":0,"style":{"width":"100%"},"clearable":true,"disabled":true,"required":true,"filterable":false,"multiple":false,"options":[{"label":"专科","value":"专科"},{"label":"本科","value":"本科"},{"label":"研究生","value":"研究生"},{"label":"博士生","value":"博士生"}],"regList":[],"changeTag":true,"proCondition":true,"formId":3,"renderKey":1590647681649,"layout":"colFormItem","vModel":"field3"},{"cmpType":"common","label":"性别","tag":"el-radio-group","tagIcon":"radio","span":12,"labelWidth":0,"style":{},"optionType":"default","border":false,"size":"medium","disabled":false,"required":false,"options":[{"label":"男","value":"男"},{"label":"女","value":"女"}],"regList":[],"changeTag":true,"proCondition":true,"formId":4,"renderKey":1590647690138,"layout":"colFormItem","vModel":"field4","defaultValue":"男"},{"cmpType":"common","layout":"rowFormItem","rowType":"table","tagIcon":"row","tag":"fc-input-table","type":"table","justify":"start","align":"top","label":"工作经历","layoutTree":false,"children":[{"cmpType":"common","label":"日期范围","tag":"fc-date-duration","showDuration":false,"tagIcon":"date-range","defaultValue":null,"span":24,"labelWidth":0,"style":{"width":"100%"},"type":"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期","disabled":false,"clearable":true,"required":false,"format":"yyyy-MM-dd","value-format":"yyyy-MM-dd","readonly":false,"regList":[],"changeTag":true,"proCondition":true,"asSummary":false,"formId":6,"renderKey":1590647800330,"layout":"colFormItem","vModel":"field6"},{"cmpType":"common","label":"公司名称","tag":"el-input","tagIcon":"input","placeholder":"请输入公司名称","span":24,"labelWidth":0,"style":{"width":"100%"},"clearable":true,"prepend":"","append":"","prefix-icon":"","suffix-icon":"","maxlength":null,"show-word-limit":false,"readonly":false,"disabled":false,"required":true,"regList":[],"changeTag":true,"proCondition":false,"asSummary":false,"formId":7,"renderKey":1590647831276,"layout":"colFormItem","vModel":"field7"},{"cmpType":"common","label":"岗位","tag":"el-select","tagIcon":"select","placeholder":"请选择岗位","span":24,"labelWidth":0,"style":{"width":"100%"},"clearable":true,"disabled":false,"required":false,"filterable":false,"multiple":false,"options":[{"label":"前端","value":"前端"},{"label":"后端","value":"后端"},{"label":"其他","value":"其他"}],"regList":[],"changeTag":true,"proCondition":true,"formId":8,"renderKey":1590647845533,"layout":"colFormItem","vModel":"field8"},{"cmpType":"common","label":"附件","tag":"el-upload","tagIcon":"upload","action":"https://jsonplaceholder.typicode.com/posts/","defaultValue":[],"labelWidth":0,"disabled":false,"required":false,"accept":"","name":"file","auto-upload":true,"showTip":false,"buttonText":"点击上传附件","fileSize":20,"sizeUnit":"MB","list-type":"text","multiple":false,"regList":[],"changeTag":true,"proCondition":false,"asSummary":false,"formId":9,"span":24,"renderKey":1590647866199,"layout":"colFormItem","vModel":"field9"}],"actionText":"添加","tableConf":{},"showDivider":false,"show-summary":false,"formId":5,"span":24,"renderKey":1590647776442,"vModel":"field5","componentName":"row5","gutter":15}]}
    // Object.freeze(confGlobal)

    return {
      tableRefs: {},
      drawerTitle: '',
      drawerText: '',
      drawerVisible: false,
      containerWidth: 75,
      [confGlobal.formModel]: {},
      [confGlobal.formRules]: {},
      selelcedFrom: '1',
      // isLoad: isLoad
    }
  },
  created() {
    console.log('556677',this[this.confGlobal.formModel])
  },
  mounted(){
    _isMounted = true;
    console.log('5566',this[this.confGlobal.formModel])
    // this.getAllForm()
  },
  methods: {
    submitForm () {
      const isTableValid = this.checkTableData()
      this.$refs[this.confGlobal.formRef].validate(valid => {
        if(!valid) return
        if (!isTableValid) return
        // this.$notify({
        //   title: '表单数据',
        //   message: '请在控制台中查看数据输出',
        //   position: 'bottom-right'
        // });
        console.log(JSON.stringify(this.confGlobal));

        console.log('表单数据', this[this.confGlobal.formModel])


        let formDataList = [];
        
        let submitFormData = this[this.confGlobal.formModel]
        for (let key in submitFormData) {
          // console.log(key)


         this.confGlobal.fields.forEach((item,index) => {
           if(item.vModel == key) {
             let signalFormObj = {};
            //  signalFormObj[item.formId] = submitFormData[key] || '';
            //  signalFormObj.lable_name = item.label || '';

            signalFormObj.form_id = item.formId;
            signalFormObj.data = submitFormData[key] || '';

             formDataList.push(signalFormObj)
           }
           
         });
        }

        console.log(JSON.stringify(formDataList))

        this.submitFormData(formDataList);
      })
    },

    submitFormData(formDataList){
      let content = {
          form_name: this.form_name,
          info: formDataList,
        };
        // console.log(content)
        add_form_data(content).then(req => {
        console.log(req)
          if (req.content.result === '200') {
            this.resetForm();
            this.$notify({
              title: '成功',
              message: '提交成功',
              type: 'success'
            });
          } else {
            this.$notify.error({
              title: '失败',
              message: '提交失败'
            });
          }
        })
    },

    resetForm() {
      this.$refs[this.confGlobal.formRef].resetFields()
      this.resetTableData()
    },

    resetTableData(){
      Object.keys(this.tableRefs).forEach(vModel => {
        const res = this.$refs[vModel].reset()
      })
    },

    checkTableData () {
      let valid = true
      Object.keys(this.tableRefs).forEach(vModel => {
        const res = this.$refs[vModel].$children[0].submit()  // 返回false或表单数据
        res ? (this[this.confGlobal.formModel][vModel] = res) : (valid = false)
      })
      return valid
    },

    showExplain (explainText, title) {
      if(!explainText) return
      this.drawerTitle = title
      this.drawerText = explainText
      this.drawerVisible = true
    },

    buildDrawer (h) {
      var content = <pre style="padding-left: 1rem;">{this.drawerText}</pre>
      return h('el-drawer', {
        props: {
          title: this.drawerTitle + '说明',
          visible: this.drawerVisible,
        },
        on: {
          'update:visible': val => this.drawerVisible = val
        }
      },
      [content])
    },

    buildForm (h) {
        // alert(111)
      let labelPosition = this.confGlobal.labelPosition || 'left'
      console.log('this', this[this.confGlobal.formModel])
      const content = this.confGlobal.fields.map(c => layouts[c.layout](c, h, this))
      let formObject = {
        props: {
          model: this[this.confGlobal.formModel],
          rules: this[this.confGlobal.formRules],
          size: this.confGlobal.size,
          labelWidth: this.confGlobal.labelWidth + 'px',
          labelPosition: this.confGlobal.labelPosition || undefined
        },
        ref: this.confGlobal.formRef
      }

      // if(formObject.props.model)
      // if(this.confGlobal.fields.length >0) {
      //    formObject.props.model = {};
      //    formObject.props.rules = {};
      //   this.confGlobal.fields.forEach((item, index) =>{
      //     formObject.props.model[item.vModel] = undefined;
      //     formObject.props.rules[item.vModel] = []
      //   })
      // }

      console.log('表单', formObject, content)
      const btns = <el-col span={24}>
                    <el-form-item  style="text-align:right;">
                      <el-button type="primary" onClick={this.submitForm}>提交</el-button>
                      <el-button onClick={this.resetForm}>重置</el-button>
                    </el-form-item>
                  </el-col>
      // 因为使用jsx时  el-form 的 model 一直无法正确填充，故采用createElement直接渲染
      return h('el-form', formObject, [content, btns]) 
    },

    // toFatherMethods(formName) {
    //   this.form_name = formName;
    //   let content = {
    //     form_name: formName
    //   };
    //   get_form_table(content).then(req => {
    //     console.log(req)
    //       if (req.content.result === '200') {
    //         removeDrawingList()
    //         let FormOptionsList = req.content.data;
    //         this.confGlobal = JSON.parse(FormOptionsList[0].source_data);
    //         saveDrawingList(this.confGlobal.fields)
    //         this.resetForm();
    //       } else {

    //       }
    //     })
    // }
  },
  // watch: {
  //    confGlobal() {
  //        alert(111)
  //       this.resetForm();
  //       // this.formData = {};
  //       // this.rules = {};
  //       this.confGlobal = JSON.parse(JSON.stringify(this.confGlobalAll))
  //       //  this[this.confGlobal.formModel] = {};
  //       //  this[this.confGlobal.formRules] = {};
  //        console.log(this.confGlobal)
  //        console.log(this.confGlobal.formModel);
  //    }
  // },

  render (h) {
    console.log('shuju', this.confGlobal)
    return  <div class="preview-container" style={'width:' + this.containerWidth + '%;'} >
              <el-row gutter={this.confGlobal.gutter} style="padding: 2rem 2rem 0;">
                { this.buildForm(h)}
              </el-row>
              {this.buildDrawer(h)}
            </div>
  }
}
</script>
<style lang="stylus" scoped>
.preview-container 
  margin 3rem auto 1rem
  border-radius 6px
  box-shadow 0 0 15px rgba(0, 0, 0, .1)
  
  .width-slider
    margin-top 10px
    width  400px
    position absolute
    top 0
    left 2rem

.showDivider.form-container { 
  margin-bottom: 2rem; 
}

.el-range-editor--small .el-range-separator {
    width 20px !important
    }
</style>
