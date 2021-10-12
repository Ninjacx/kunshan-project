<template>
  <div>
    <Card>
      <tables ref="tables" @on-row-dblclick="rowClick" @on-search-change="onSearchChange" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete">
          <Button @click="showAddType" slot="right" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;添加</Button>
      </tables>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
      <Page :current.sync="pageCurrent" :total="dataCount" :page-size="pageSize" @on-change="changepage" @on-page-size-change="_nowPageSize"
      show-total show-sizer show-elevator/>
    </Card>
    <Modal
        width="550"
        :scrollable="true"
        :loading="loading"
        v-model="addOrderShow"
        title="添加订单"
        @on-ok="addOrder"
        @on-cancel="cancel">
          <Form  ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <Form-item label="客户名称" prop="customer_name">
                <Input v-model="formValidate.customer_name" placeholder="请输入客户名称"></Input>
            </Form-item>
            <Form-item label="客户地址" prop="customer_addr">
                <Input v-model="formValidate.customer_addr" placeholder="请输入客户地址"></Input>
            </Form-item>
            <Form-item label="联系方式" prop="customer_contact">
                <Input v-model="formValidate.customer_contact" placeholder="请输入联系方式"></Input>
            </Form-item>
            <Row><Col span="24"><Button @click="addOneType" class="addType" type="info" size="small">添加品名</Button></Col></Row>
            <Row :key="index" v-for="(item, index) in formValidate.typeContList">
              <Col span="13">
                <Form-item :label="'品名规格'+ Number(index+1)" :prop="'typeContList.' + index + '.type_id'" :rules="{type:'number',required: true, message: '品名规格不能为空', trigger: 'change'}">
                    <Select  filterable  v-model="item.type_id" placeholder="请选择品名规格">
                        <Option :key="type_index" v-for="(type_item, type_index) in TypeAllList" @click.native="setAmount(type_item, index)" :value="type_item.id">{{type_item.type_name}}</Option>
                    </Select>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item :label="'数量'" :prop="'typeContList.' + index + '.count'" :rules="{required: true, message: '数量不能为空', trigger: 'change'}">
                    <Input @on-blur="computedCount()" v-model="item.count" placeholder="请输入数量"></Input>
                    
                </Form-item>
                
              </Col>
              <Col span="3">
                <i @click="removeTypeOne(index)" class="ivu-icon ivu-icon-md-trash clearIcon"></i>
              </Col>
            </Row>
            <!-- <Form-item label="单价">
                <Input disabled v-model="amount" placeholder="请选择品名规格带出单价"></Input>
            </Form-item> -->
            <Form-item label="订单金额" prop="all_amount">
                <Input v-model="formValidate.all_amount" placeholder="请输入订单总金额"></Input>
            </Form-item>
            <Form-item label="备注" prop="remark">
                <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
            </Form-item>
            <!-- <Form-item>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </Form-item> -->
      </Form>
    </Modal>
    
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getOrderList, addOrder, getTypeAll, delOrderOne, getOrderDetail, getOrderDetailTypeList,} from '@/api/data'
// import XLSX from 'xlsx'
import XLSX from 'xlsx-style'
export default {
  name: 'type_list',
  components: {
    Tables
  },
  data () {
    var _this = this
    return {
      searchKey: '',
      searchValue: '',
      amount: '', // 选规则带出单价
      loading: true,
      formValidate: {
        all_amount: '',
        count: '',
        remark: '',
        // type_id: '',
        customer_name: '',
        customer_addr: '',
        customer_contact: '',
        typeContList: [{type_id: '', count: '', amount: 0}],
      },
       ruleValidate: {
         customer_name: [
             { required: true, message: '客户名称不能为空', trigger: 'change' }
         ],
         type_id: [
             { type:'number', required: true, message: '请选择品名规格', trigger: 'change' }
         ],
         all_amount: [
             { required: true, message: '订单金额不能为空', trigger: 'change' }
         ],
         count: [
             { required: true, message: '数量不能为空', trigger: 'change' },
         ],
        //  remark: [
        //      { required: true, message: '请选择城市', trigger: 'change' }
        //  ]
      },
      addOrderShow: false,
      columns: [
        { title: '序号', width: 70, align: 'center',key: '',
          render: function (h, params) {
             return h('span', Number(params.index) + (Number(_this.pageCurrent) - 1)* Number(_this.pageSize) + 1)
          }
        },
        { title: '客户名称', key: 'customer_name'},
        { title: '客户地址', key: 'customer_addr'},
        { title: '联系方式', key: 'customer_contact'},
        // { title: '品名规格', key: 'type_name', isSearch: true},
        // { title: '数量', key: 'count' },// , editable: true
        // { title: '单价', key: 'amount' },
        { title: '订单金额', key: 'all_amount' },
        { title: '创建时间', key: 'order_create_time', sortable: true },
        { title: '备注', key: 'remark'},
        {
          title: '删除',
          key: 'handle',
          align: 'center', 
          options: ['delete'],
          button: [
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('on-delete', params)
                    vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                    // addType(this.formValidate).then(res => {
                    //   this.pageCurrent = 1
                    //   this.initGetOrderList()
                    //   var msg = res.msg || '添加成功!'
                    //     this.$Message.success(msg);
                    //     this.addOrderShow = false
                    // })


                  }
                }
              }, [
                // h('Button', '自定义删除')
              ])
            }
          ]
        },
        {
          title: '出库单',
          key: '',
          align: 'center', 
          render:  (h, params) => {
            return h('button',  {
									class: 'ivu-btn ivu-btn-info',
									on: {
										click: () => {
                      var { id } = params.row
                      // getOrderDetail, getOrderDetailTypeList,
                      Promise.all([getOrderDetail({order_id: id}), getOrderDetailTypeList({order_id: id})]).then(([resDetail,resTypeList])=> {
                          this.handleDownClick(resDetail.data, resTypeList.data)
                      })
                        
										}
									}
								},'导出')
          }
        }
      ],
      TypeAllList: [],
      tableData: [],
      // 分页
      pageSize: 10, // 每页显示多少条
      dataCount: 1, // 总条数
      pageCurrent: 1 // 当前页
    }
  },
  methods: {
      compare (prop) {
        return function (obj1, obj2) {
            var val1 = obj1[prop];
            var val2 = obj2[prop];if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else  {
                return 0;
            }            
        } 
    },
    handleDownClick(detail, typeList){
      var TypeListInit = JSON.parse(JSON.stringify(typeList.data))
      
      // var aaa = TypeListInit.sort(this.compare())
      // console.log(aaa)
      console.log('typeList', TypeListInit); //  amount*count
     var list =  typeList.data.map((item, index)=>{
        var obj = {
          index: index+1,
          type_name: item.type_name,
          type_code: item.type_code,
          count: item.count,
          amount: item.amount,
          type_amount: item.count * item.amount
        }
        return obj
      })
      console.log('list', list);
  
      var keyCn = {index: '行号',type_name: '品名规格', type_code: '条形码', amount: '单价', count: '数量', type_amount: '金额'}
      var resArr = []
      list.map((item, index)=>{
        var obj = {}
        resArr.push(obj)
         for (const key in item) {
           if(keyCn[key]){
             Object.assign(obj, { [keyCn[key]] : item[key] })
           }
          }
          return resArr
      })
      
      
      console.log('data', resArr);
      // return false
      // 模拟数据
      // var data = [
      //   {'时间':'2020-01-12','新注册人数':'12','在线人数':'12','累计用户数':'12'},
      //   {'时间':'2020-01-12','新注册人数':'12','在线人数':'12','累计用户数':'13'},
      //   {'时间':'2020-01-12','新注册人数':'12','在线人数':'12','累计用户数':'14'},
      //   {'时间':'2020-01-12','新注册人数':'12','在线人数':'12','累计用户数':'15'},
      // ];
      //表格标题
      // 配置文件类型
        const wopts = { bookType: 'xlsx', bookSST: true, type: 'binary', cellStyles: true };
        this.downloadExl(resArr, wopts, detail.data)
    },
    // 下载功能
     saveAs(obj, fileName) {
          var tmpa = document.createElement("a");
          tmpa.download = fileName || "未命名";
          // 兼容ie 
          if ("msSaveOrOpenBlob" in navigator) {
            window.navigator.msSaveOrOpenBlob(obj, "下载的文件名"+ ".xlsx");
          } else {
            tmpa.href = URL.createObjectURL(obj);
          }
          tmpa.click();
          setTimeout(function() {
            URL.revokeObjectURL(obj);
          }, 100);
    },
      
    downloadExl(json, type, dataItem) {
      var { customer_name, customer_contact, all_amount, customer_addr, remark } = dataItem
        var tmpdata = json[0];
        console.log('tmpdata', tmpdata);
        json.unshift({});
        var keyMap = []; //获取keys
        for (var k in tmpdata) {
            keyMap.push(k);
            json[0][k] = k;
        }
        var tmpdata = [];//用来保存转换好的json 
        var rowIndex = 7 // 上面自定的行 循环数据从上面第几行开始
        json.map((v, i) => {
          let data = keyMap.map((k, j) => {
            // console.log(k,this.getCharCol(j));
            return Object.assign({}, {
              v: v[k],
              position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + rowIndex)
            });
          });
        return data;

        }).reduce((prev, next) => prev.concat(next)).forEach((v, i) => {
            tmpdata[v.position] = {
              v: v.v
            }
            // console.log('tmpdatattttt', tmpdata);
        }
        );
        var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10


        // 所有列加上线
        for (const key in tmpdata) {
          const element = tmpdata[key];
          // console.log('ele',element);
          element.s = { border:{ 
              top: {
                style: "thin",
              },
              bottom: {
                style: "thin",
              },
              left: {
                style: "thin",
              },
              right: {
                style: "thin",
              }
            }
          }
        }
        // var boderCssParams = { 
        //       top: {
        //         style: "thin",
        //       },
        //       bottom: {
        //         style: "thin",
        //       },
        //       left: {
        //         style: "thin",
        //       },
        //       right: {
        //         style: "thin",
        //       }
        //     }
        tmpdata["A1"] = {v: customer_name};
        tmpdata["A3"] = {v: `店铺地址：${customer_addr}`};
        tmpdata["A4"] = {v: `联系方式：${customer_contact}`};
        tmpdata["A5"] = {v: `备注：${remark}`};

        // console.log('length', );
        var tabFootKey = json.length + 8
        // return false
        tmpdata['A'+tabFootKey] = {v: `合计金额：￥${all_amount}`};
        
        tmpdata["A1"].s = { font: { sz: 20, bold: true, vertAlign:true }, alignment:{ vertical:"center", horizontal:"center" }, 
        fill: { patternType: 'solid' ,bgColor: { rgb: ""}, fgColor: { rgb: "" } } };//<====设置xlsx单元格样式

        var initExcelSty = { font: { sz: 13,  vertAlign:true }, alignment:{ vertical:"center", horizontal:"left" }, 
        fill: { bgColor: { rgb: ""}, fgColor: { rgb: "" } } };//<====设置xlsx单元格样式
        
        tmpdata["A3"].s = initExcelSty
        tmpdata["A4"].s = initExcelSty
        tmpdata['A'+tabFootKey].s = initExcelSty
        
        // s 开始 { c: 左边往右数 r: 3 第4行 (0 开始) }
        tmpdata["!merges"] = [
          {
            s: { c: 0, r: 0 },
            e: { c: 5, r: 1 },
          },
          {
            s: {c: 0, r: 2},
            e: {c: 5, r: 2}
          },
          {
            s: {c: 0, r: 3},
            e: {c: 5, r: 3}
          }
          ];//<====合并单元格 

        // tmpdata["!rows"] = [
        //   {hpt: 150},
        //   {hpt: 150},
        //   {hpt: 150},
        //   {hpt: 150},
        //   {hpt: 150}
        // ];
        tmpdata["!cols"] = [
          {wpx: 60},
          {wpx: 160},
          {wpx: 120},
          {wpx: 50},
          {wpx: 50},
          {wpx: 50}
        ];//<====设置一列宽度 

    
        var tmpWB = {
            SheetNames: ['出库单'], //保存的表标题
            Sheets: {
              '出库单': Object.assign({},
              tmpdata, //内容
              {
                '!ref': 'A1:G30'//outputPos[0] + ':' + outputPos[outputPos.length - 1], //设置填充区域
              },
               
              )
            }
        };
        var tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
            { bookType: (type == undefined ? 'xlsx' : type.bookType), bookSST: false, type: 'binary' }//这里的数据是用来定义导出的格式类型
        ))], {
                type: ""
            });
        this.saveAs(tmpDown, customer_name + "-出库单" + '.' + (type.bookType == "biff2" ? "xls" : type.bookType));
    },
    // 获取26个英文字母用来表示excel的列
    getCharCol(n) {
        let temCol = '',
            s = '',
            m = 0
        while (n > 0) {
            m = n % 26 + 1
            s = String.fromCharCode(m + 64) + s
            n = (n - m) / 26
        }
        return s
    },
    s2ab(s) {
        if (typeof ArrayBuffer !== 'undefined') {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        } else {
            var buf = new Array(s.length);
            for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
    },
    rowClick(...params){
      var [item] = params
      this.$router.push({name: 'order_detail', query: {order_id: item.id}})
    },
    addOneType(){
      this.formValidate.typeContList.push({type_id: '', count: '', amount: 0})
    },
    removeTypeOne(index){
      if(this.formValidate.typeContList.length === 1){
        this.$Message.error('至少有一个品名!');
        return false
      }
      this.$delete(this.formValidate.typeContList, index)

      this.computedCount()
    },
    computedCount(){
      var all_amount = 0
      this.formValidate.typeContList.map((item)=>{
        all_amount += item.amount * item.count
      })
      this.formValidate.all_amount = String(all_amount)
    },
    initGetOrderList(){
       getOrderList({pageSize: this.pageCurrent, limit: this.pageSize, searchKey: this.searchKey, searchValue: this.searchValue}).then(res => {
          var result = res.data
          this.tableData = result.data.data
          this.dataCount = result.data.allCount
          // dataCount
        })
    },
    setAmount(item, index){
      console.log('item', item);
      this.formValidate.typeContList[index].amount = item.amount
      this.computedCount()
    },
    cancel(){},
    showAddType(){
      this.addOrderShow = true
      this.formValidate.typeContList = [{type_id: '', count: '', amount: 0}]
      this.$refs['formValidate'].resetFields();
    },
    addOrder () {
      this.$refs['formValidate'].validate((valid) => {
           if (valid) {
              addOrder(this.formValidate).then(res => {
                this.pageCurrent = 1
                this.initGetOrderList()
                var msg = res.msg || '添加成功!'
                  this.$Message.success(msg);
                  this.addOrderShow = false
              })
           } else {
             console.log('formValidate', this.formValidate);
               setTimeout(()=>{
                 this.loading = false
                 this.$nextTick(()=>{
                   this.loading = true
                 })
               }, 100)
               this.$Message.error('请填写必填项!');
           }
      })
    },
    onSearchChange(item) {
      var {searchKey, searchValue} = item
      this.searchKey = searchKey
      this.searchValue = searchValue
      this.pageCurrent = 1
      this.initGetOrderList()
    },
    changepage (index) {
      // 需要显示开始数据的index,(因为数据是从0开始的，页码是从1开始的，需要-1)
      // let _start = (index - 1) * this.pageSize
      // 需要显示结束数据的index
      // let _end = index * this.pageSize
      // 截取需要显示的数据
      // this.tableData = this.data.slice(_start, _end)
      // 储存当前页
      this.pageCurrent = index
      this.initGetOrderList()
    },
    // 每页显示的数据条数
    _nowPageSize (index) {
      this.pageSize = index
      this.initGetOrderList()
    },
    handleDelete (params) {
      console.log('params.row', params.row);
      var {id} = params.row
       delOrderOne({order_id: id}).then(res => {
          this.pageCurrent = 1
          this.initGetOrderList()
          var msg = res.msg || '删除成功!'
            this.$Message.success(msg);
       })
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    }
  },
  created () {
    getTypeAll({}).then(res => {
      var res = res.data
      if(res.data.length){
        this.TypeAllList = res.data
      }
    })
  },
  mounted () {
    this.initGetOrderList()
  }
}
</script>

<style scoped>
  .addType{
    float:right;margin-bottom:10px
  }
  .clearIcon{
    font-size: 18px;line-height: 32px;margin-left:15px
  }
  /* .orderListForm{
    max-height:480px;overflow:auto;
  } */
</style>
