(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-74b2d977"],{"30d9":function(e,t,a){},4974:function(e,t,a){"use strict";a("fb81")},5114:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("Card",[a("tables",{ref:"tables",attrs:{editable:"",searchable:"","search-place":"top",columns:e.columns},on:{"on-search-change":e.onSearchChange,"on-delete":e.handleDelete},model:{value:e.tableData,callback:function(t){e.tableData=t},expression:"tableData"}},[a("Button",{staticClass:"search-btn",attrs:{slot:"right",type:"primary"},on:{click:e.showAddType},slot:"right"},[a("Icon",{attrs:{type:"search"}}),e._v("  添加")],1)],1),a("Button",{staticStyle:{margin:"10px 0"},attrs:{type:"primary"},on:{click:e.exportExcel}},[e._v("导出为Csv文件")]),a("Page",{attrs:{current:e.pageCurrent,total:e.dataCount,"page-size":e.pageSize,"show-total":"","show-sizer":"","show-elevator":""},on:{"update:current":function(t){e.pageCurrent=t},"on-change":e.changepage,"on-page-size-change":e._nowPageSize}})],1),a("Modal",{attrs:{loading:e.loading,title:"添加品名规格"},on:{"on-ok":e.addType,"on-cancel":e.cancel},model:{value:e.addTypeShow,callback:function(t){e.addTypeShow=t},expression:"addTypeShow"}},[a("Form",{ref:"formValidate",attrs:{model:e.formValidate,rules:e.ruleValidate,"label-width":80}},[a("Form-item",{attrs:{label:"品名规格",prop:"type_name"}},[a("Input",{attrs:{placeholder:"请输入品名规格"},model:{value:e.formValidate.type_name,callback:function(t){e.$set(e.formValidate,"type_name",t)},expression:"formValidate.type_name"}})],1),a("Form-item",{attrs:{label:"单价",prop:"amount"}},[a("Input",{attrs:{placeholder:"请输入单价"},model:{value:e.formValidate.amount,callback:function(t){e.$set(e.formValidate,"amount",t)},expression:"formValidate.amount"}})],1)],1)],1)],1)},i=[],o=(a("e680"),a("fa69")),l=a("7e1e"),s={name:"type_list",components:{Tables:o["a"]},data:function(){var e=this;return{searchKey:"",searchValue:"",loading:!0,formValidate:{type_name:"",amount:""},ruleValidate:{type_name:[{required:!0,message:"数量不能为空",trigger:"change"}],amount:[{required:!0,message:"订单金额不能为空",trigger:"change"}]},addTypeShow:!1,columns:[{title:"序号",width:70,align:"center",key:"",render:function(t,a){return t("span",Number(a.index)+(Number(e.pageCurrent)-1)*Number(e.pageSize)+1)}},{title:"品名规格",align:"center",key:"type_name",isSearch:!0},{title:"单价",width:200,align:"center",key:"amount"},{title:"删除",key:"handle",align:"center",options:["delete"],button:[function(e,t,a){return e("Poptip",{props:{confirm:!0,title:"你确定要删除吗?"},on:{"on-ok":function(){a.$emit("on-delete",t),a.$emit("input",t.tableData.filter((function(e,a){return a!==t.row.initRowIndex})))}}},[])}]}],tableData:[],pageSize:10,dataCount:1,pageCurrent:1}},methods:{initGetTypeList:function(){var e=this;Object(l["g"])({pageSize:this.pageCurrent,limit:this.pageSize,searchKey:this.searchKey,searchValue:this.searchValue}).then((function(t){var a=t.data;e.tableData=a.data.data,e.dataCount=a.data.allCount}))},cancel:function(){},showAddType:function(){this.addTypeShow=!0,this.$refs["formValidate"].resetFields()},addType:function(){var e=this;this.$refs["formValidate"].validate((function(t){t?Object(l["b"])(e.formValidate).then((function(t){e.pageCurrent=1,e.initGetTypeList();var a=t.msg||"添加成功!";e.$Message.success(a),e.addTypeShow=!1})):(setTimeout((function(){e.loading=!1,e.$nextTick((function(){e.loading=!0}))}),100),e.$Message.error("请填写必填项!"))}))},onSearchChange:function(e){var t=e.searchKey,a=e.searchValue;this.searchKey=t,this.searchValue=a,this.pageCurrent=1,this.initGetTypeList()},changepage:function(e){this.pageCurrent=e,this.initGetTypeList()},_nowPageSize:function(e){this.pageSize=e,this.initGetTypeList()},handleDelete:function(e){var t=this,a=e.row.id;console.log("id",a),Object(l["d"])({type_id:a}).then((function(e){t.pageCurrent=1,t.initGetTypeList();var a=e.msg||"删除成功!";t.$Message.success(a)}))},exportExcel:function(){this.$refs.tables.exportCsv({filename:"table-".concat((new Date).valueOf(),".csv")})}},mounted:function(){this.initGetTypeList()}},c=s,r=a("cba8"),u=Object(r["a"])(c,n,i,!1,null,null,null);t["default"]=u.exports},d2c3:function(e,t,a){},d9fc:function(e,t,a){"use strict";a("d2c3")},fa69:function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[e.searchable&&"top"===e.searchPlace?a("div",{staticClass:"search-con search-con-top"},[a("Select",{staticClass:"search-col",model:{value:e.searchKey,callback:function(t){e.searchKey=t},expression:"searchKey"}},e._l(e.columns,(function(t){return t.isSearch?a("Option",{key:"search-col-"+t.key,attrs:{value:t.key}},[e._v(e._s(t.title))]):e._e()})),1),a("Input",{staticClass:"search-input",attrs:{clearable:"",placeholder:"输入关键字搜索"},on:{"on-change":e.handleClear},model:{value:e.searchValue,callback:function(t){e.searchValue=t},expression:"searchValue"}}),a("Button",{staticClass:"search-btn",attrs:{type:"primary"},on:{click:e.handleSearch}},[a("Icon",{attrs:{type:"search"}}),e._v("  搜索")],1),a("div",{staticClass:"fright"},[e._t("right")],2)],1):e._e(),a("Table",{ref:"tablesMain",attrs:{data:e.insideTableData,columns:e.insideColumns,stripe:e.stripe,border:e.border,"show-header":e.showHeader,width:e.width,height:e.height,loading:e.loading,"disabled-hover":e.disabledHover,"highlight-row":e.highlightRow,"row-class-name":e.rowClassName,size:e.size,"no-data-text":e.noDataText,"no-filtered-data-text":e.noFilteredDataText},on:{"on-current-change":e.onCurrentChange,"on-select":e.onSelect,"on-select-cancel":e.onSelectCancel,"on-select-all":e.onSelectAll,"on-selection-change":e.onSelectionChange,"on-sort-change":e.onSortChange,"on-filter-change":e.onFilterChange,"on-row-click":e.onRowClick,"on-row-dblclick":e.onRowDblclick,"on-expand":e.onExpand}},[e._t("header",null,{slot:"header"}),e._t("footer",null,{slot:"footer"}),e._t("loading",null,{slot:"loading"})],2),e.searchable&&"bottom"===e.searchPlace?a("div",{staticClass:"search-con search-con-top"},[a("Select",{staticClass:"search-col",model:{value:e.searchKey,callback:function(t){e.searchKey=t},expression:"searchKey"}},e._l(e.columns,(function(t){return"handle"!==t.key?a("Option",{key:"search-col-"+t.key,attrs:{value:t.key}},[e._v(e._s(t.title))]):e._e()})),1),a("Input",{staticClass:"search-input",attrs:{placeholder:"输入关键字搜索"},model:{value:e.searchValue,callback:function(t){e.searchValue=t},expression:"searchValue"}}),a("Button",{staticClass:"search-btn",attrs:{type:"primary"}},[a("Icon",{attrs:{type:"search"}}),e._v("  搜索")],1)],1):e._e(),a("a",{staticStyle:{display:"none",width:"0px",height:"0px"},attrs:{id:"hrefToExportTable"}})],1)},i=[],o=(a("1bc7"),a("e680"),function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"tables-edit-outer"},[e.isEditting?a("div",{staticClass:"tables-editting-con"},[a("Input",{staticClass:"tables-edit-input",attrs:{value:e.value},on:{input:e.handleInput}}),a("Button",{staticStyle:{padding:"6px 4px"},attrs:{type:"text"},on:{click:e.saveEdit}},[a("Icon",{attrs:{type:"md-checkmark"}})],1),a("Button",{staticStyle:{padding:"6px 4px"},attrs:{type:"text"},on:{click:e.canceltEdit}},[a("Icon",{attrs:{type:"md-close"}})],1)],1):a("div",{staticClass:"tables-edit-con"},[a("span",{staticClass:"value-con"},[e._v(e._s(e.value))]),e.editable?a("Button",{staticClass:"tables-edit-btn",staticStyle:{padding:"2px 4px"},attrs:{type:"text"},on:{click:e.startEdit}},[a("Icon",{attrs:{type:"md-create"}})],1):e._e()],1)])}),l=[],s={name:"TablesEdit",props:{value:[String,Number],edittingCellId:String,params:Object,editable:Boolean},computed:{isEditting:function(){return this.edittingCellId==="editting-".concat(this.params.index,"-").concat(this.params.column.key)}},methods:{handleInput:function(e){this.$emit("input",e)},startEdit:function(){this.$emit("on-start-edit",this.params)},saveEdit:function(){this.$emit("on-save-edit",this.params)},canceltEdit:function(){this.$emit("on-cancel-edit",this.params)}}},c=s,r=(a("4974"),a("cba8")),u=Object(r["a"])(c,o,l,!1,null,null,null),d=u.exports,h={delete:function(e,t,a){return e("Poptip",{props:{confirm:!0,title:"你确定要删除吗?"},on:{"on-ok":function(){a.$emit("on-delete",t),a.$emit("input",t.tableData.filter((function(e,a){return a!==t.row.initRowIndex})))}}},[e("Button",{props:{type:"text",ghost:!0}},[e("Icon",{props:{type:"md-trash",size:18,color:"#000000"}})])])}},p=h,f=(a("30d9"),{name:"Tables",props:{value:{type:Array,default:function(){return[]}},columns:{type:Array,default:function(){return[]}},size:String,width:{type:[Number,String]},height:{type:[Number,String]},stripe:{type:Boolean,default:!1},border:{type:Boolean,default:!1},showHeader:{type:Boolean,default:!0},highlightRow:{type:Boolean,default:!1},rowClassName:{type:Function,default:function(){return""}},context:{type:Object},noDataText:{type:String},noFilteredDataText:{type:String},disabledHover:{type:Boolean},loading:{type:Boolean,default:!1},editable:{type:Boolean,default:!1},searchable:{type:Boolean,default:!1},searchPlace:{type:String,default:"top"}},data:function(){return{insideColumns:[],insideTableData:[],edittingCellId:"",edittingText:"",searchValue:"",searchKey:""}},methods:{suportEdit:function(e,t){var a=this;return e.render=function(e,t){return e(d,{props:{params:t,value:a.insideTableData[t.index][t.column.key],edittingCellId:a.edittingCellId,editable:a.editable},on:{input:function(e){a.edittingText=e},"on-start-edit":function(e){a.edittingCellId="editting-".concat(e.index,"-").concat(e.column.key),a.$emit("on-start-edit",e)},"on-cancel-edit":function(e){a.edittingCellId="",a.$emit("on-cancel-edit",e)},"on-save-edit":function(e){a.value[e.row.initRowIndex][e.column.key]=a.edittingText,a.$emit("input",a.value),a.$emit("on-save-edit",Object.assign(e,{value:a.edittingText})),a.edittingCellId=""}}})},e},surportHandle:function(e){var t=this,a=e.options||[],n=[];a.forEach((function(e){p[e]&&n.push(p[e])}));var i=e.button?[].concat(n,e.button):n;return e.render=function(e,a){return a.tableData=t.value,e("div",i.map((function(n){return n(e,a,t)})))},e},handleColumns:function(e){var t=this;this.insideColumns=e.map((function(e,a){var n=e;return n.editable&&(n=t.suportEdit(n,a)),"handle"===n.key&&(n=t.surportHandle(n)),n}))},setDefaultSearchKey:function(){this.searchKey="handle"!==this.columns[0].key?this.columns[0].key:this.columns.length>1?this.columns[1].key:""},handleClear:function(e){""===e.target.value&&(this.insideTableData=this.value)},handleSearch:function(){this.$emit("on-search-change",{searchKey:this.searchKey,searchValue:this.searchValue})},handleTableData:function(){this.insideTableData=this.value.map((function(e,t){var a=e;return a.initRowIndex=t,a}))},exportCsv:function(e){this.$refs.tablesMain.exportCsv(e)},clearCurrentRow:function(){this.$refs.talbesMain.clearCurrentRow()},onCurrentChange:function(e,t){this.$emit("on-current-change",e,t)},onSelect:function(e,t){this.$emit("on-select",e,t)},onSelectCancel:function(e,t){this.$emit("on-select-cancel",e,t)},onSelectAll:function(e){this.$emit("on-select-all",e)},onSelectionChange:function(e){this.$emit("on-selection-change",e)},onSortChange:function(e,t,a){this.$emit("on-sort-change",e,t,a)},onFilterChange:function(e){this.$emit("on-filter-change",e)},onRowClick:function(e,t){this.$emit("on-row-click",e,t)},onRowDblclick:function(e,t){this.$emit("on-row-dblclick",e,t)},onExpand:function(e,t){this.$emit("on-expand",e,t)}},watch:{columns:function(e){this.handleColumns(e),this.setDefaultSearchKey()},value:function(e){this.handleTableData()}},mounted:function(){this.handleColumns(this.columns),this.setDefaultSearchKey(),this.handleTableData()}}),m=f,g=(a("d9fc"),Object(r["a"])(m,n,i,!1,null,null,null)),y=g.exports;t["a"]=y},fb81:function(e,t,a){}}]);