<template>
  <div>
    <Card>
      <tables ref="tables" @on-search-change="onSearchChange" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete">
         <Button @click="showAddType" slot="right" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;添加</Button>
      </tables>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
      <Page :current.sync="pageCurrent" :total="dataCount" :page-size="pageSize" @on-change="changepage" @on-page-size-change="_nowPageSize"
      show-total show-sizer show-elevator/>
    </Card>
    <Modal
        :loading="loading"
        v-model="addTypeShow"
        title="添加品名规格"
        @on-ok="addType"
        @on-cancel="cancel">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <Form-item label="品名规格" prop="type_name">
                <Input v-model="formValidate.type_name" placeholder="请输入品名规格"></Input>
            </Form-item>
            <Form-item label="品名编码" prop="type_code">
                <Input v-model="formValidate.type_code" placeholder="请输入品名规格"></Input>
            </Form-item>
            <Form-item label="单价" prop="amount">
                <Input  v-model="formValidate.amount" placeholder="请输入单价"></Input>
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
import { getTypeList,addType, delTypeOne } from '@/api/data'
var _this = this
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
      loading: true,
      formValidate: {
        type_name: '',
        amount: '',
        type_code: '',
      },
       ruleValidate: {
         type_name: [
             { required: true, message: '品名规格不能为空', trigger: 'change' },
         ],
         type_code: [
             { required: true, message: '品名编码不能为空', trigger: 'change' },
         ],
         amount: [
             { required: true, message: '单价不能为空', trigger: 'change' }
         ]
      },
      addTypeShow: false,
      columns: [
        { title: '序号', width: 70, align: 'center',key: '',
          render: function (h, params) {
             return h('span', Number(params.index) + (Number(_this.pageCurrent) - 1)* Number(_this.pageSize) + 1)
          }
        },
        { title: '品名规格',align: 'center',  key: 'type_name', isSearch: true},
        { title: '品名编码',align: 'center',  key: 'type_code', isSearch: true},
        { title: '单价',width: 200,align: 'center',  key: 'amount' },
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
                    //   this.initGetTypeList()
                    //   var msg = res.msg || '添加成功!'
                    //     this.$Message.success(msg);
                    //     this.addTypeShow = false
                    // })


                  }
                }
              }, [
                // h('Button', '自定义删除')
              ])
            }
          ]
        }
      ],
      tableData: [],
      // 分页
      pageSize: 10, // 每页显示多少条
      dataCount: 1, // 总条数
      pageCurrent: 1 // 当前页
    }
  },
  methods: {
    initGetTypeList(){
       getTypeList({pageSize: this.pageCurrent, limit: this.pageSize, searchKey: this.searchKey, searchValue: this.searchValue}).then(res => {
          var result = res.data
          this.tableData = result.data.data
          this.dataCount = result.data.allCount
          // dataCount
        })
    },
    cancel(){},
    showAddType(){
      this.addTypeShow = true
      this.$refs['formValidate'].resetFields();
    },
    addType () {
      this.$refs['formValidate'].validate((valid) => {
           if (valid) {
              addType(this.formValidate).then(res => {
                this.pageCurrent = 1
                this.initGetTypeList()
                var msg = res.msg || '添加成功!'
                  this.$Message.success(msg);
                  this.addTypeShow = false
              })
           } else {
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
      this.initGetTypeList()
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
      this.initGetTypeList()
    },
    // 每页显示的数据条数
    _nowPageSize (index) {
      this.pageSize = index
      this.initGetTypeList()
    },
    handleDelete (params) {
      var {id} = params.row
      console.log('id', id);
       delTypeOne({type_id: id}).then(res => {
          this.pageCurrent = 1
          this.initGetTypeList()
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
  // created(){},
  mounted () {
    this.initGetTypeList()
  }
}
</script>