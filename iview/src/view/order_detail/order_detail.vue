<template>
  <div class="order_detail">
    <Card>
      <Form ref="orderDetailForm" :model="initBasicData" :rules="ruleValidate" :label-width="80">
          <Row>
            <Col span="13">
              <Form-item label="客户名称" prop="customer_name">
                <Input v-model="initBasicData.customer_name" placeholder="请输入客户名称"></Input>
            </Form-item>
            </Col>   
          </Row>
          <Row>
              <Col span="13">
              <Form-item label="联系方式" prop="customer_contact">
                  <Input v-model="initBasicData.customer_contact" placeholder=""></Input>
              </Form-item>
              </Col>
          </Row>
          <Row>
              <Col span="13">
              <Form-item label="地址" prop="">
                  <Input v-model="initBasicData.customer_addr" placeholder="请输入地址"></Input>
              </Form-item>
              </Col>
          </Row>
          <Row>
              <Col span="13">
              <Form-item label="订单金额" prop="all_amount">
                  <Input v-model="initBasicData.all_amount" placeholder="请输入订单总金额"></Input>
              </Form-item>
              </Col>
          </Row>
          
          <Row>
              <Col span="13">
              <Form-item label="备注" prop="">
                  <Input type="textarea" v-model="initBasicData.remark" placeholder="请输入备注"></Input>
              </Form-item>
              </Col>
          </Row>
          <Row>
              <Col span="13">
              <Form-item label="创建时间" prop="">
                <div>&nbsp;&nbsp;{{initBasicData.order_create_time}}</div>
                  <!-- <Input style="color: red !improtant;" disabled v-model="initBasicData.order_create_time" placeholder="请输入创建时间"></Input> -->
              </Form-item>
              </Col>
          </Row>
          
          <Row>
            <Col span="18">
              <Row><Col span="24"><Button @click="addOneType" class="addType" type="info" size="small">添加品名</Button></Col></Row>
              <Row :key="index" v-for="(item, index) in initBasicData.orderDetailTypeList">
                <Col span="13">
                  <Form-item :label="'品名规格'+ Number(index+1)" :prop="'orderDetailTypeList.' + index + '.type_id'" :rules="{type:'number', required: true, message: '品名规格不能为空', trigger: 'change'}">
                      <Select  filterable  v-model="item.type_id" placeholder="请选择品名规格">
                          <Option :key="type_index" v-for="(type_item, type_index) in TypeAllList" @click.native="setAmount(type_item, index)" :value="type_item.id">{{type_item.type_name}}</Option>
                      </Select>
                  </Form-item>
                </Col>
                <Col span="3">
                  <Form-item label="单价">
                    <div>{{item.amount}}</div>
                      <!-- <Input v-model="item.amount" placeholder="请输入数量"></Input> -->
                  </Form-item>
                </Col>
                <Col span="5">
                  <Form-item :label="'数量'" :prop="'orderDetailTypeList.' + index + '.count'" :rules="{required: true, message: '数量不能为空'}">
                      <Input @on-blur="computedCount()" v-model="item.count" placeholder="请输入数量"></Input>
                  </Form-item>
                </Col>
                <Col span="3">
                  <i @click="removeTypeOne(item, index)" class="ivu-icon ivu-icon-md-trash clearIcon"></i>
                </Col>
              </Row>
            </Col>
          </Row>
           
            <Row class="TextCenter">
              <Button type="success" @click="submitDetail()" >确认提交</Button>
            </Row>
      </Form>

    </Card>
     
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getOrderDetail, getOrderDetailTypeList, getTypeAll, delOrderDetailTypeOne, updateOrderDetail, addType, delTypeOne } from '@/api/data'
var _this = this
export default {
  name: 'type_list',
  components: {
    Tables
  },
  data () {
    var _this = this
    return {
      loading: true,
      TypeAllList: [],
      // initBasicData:{
      // },
      initBasicData: {
        order_create_time: '',
        customer_name: '',
        all_amount: '',
        customer_contact: '',
        customer_addr: '',
        remark: '',
        orderDetailTypeList: [],
      },
      ruleValidate: {
         customer_name: [
             { required: true, message: '客户名称不能为空', trigger: 'change' }
         ],
         type_id: [
             { type:'number', required: true, message: '请选择品名规格', trigger: 'change' }
         ],
         all_amount: [
             { required: true, message: '订单金额不能为空' }
         ],
         count: [
             { required: true, message: '数量不能为空'},
         ],
        //  remark: [
        //      { required: true, message: '请选择城市', trigger: 'change' }
        //  ]
      },
    }
  },
  methods: {
    submitDetail(){
       this.$refs['orderDetailForm'].validate((valid) => {
         if(valid){
          //  this.$router.push({name: 'order_list'})
           updateOrderDetail(this.initBasicData).then(res => {
                var result = res.data
                this.$Message.success(result.msg);
            })
         }
       })
      
    },
     setAmount(item, index){
      this.initBasicData.orderDetailTypeList[index].amount = item.amount
      this.computedCount()
    },
     removeTypeOne(item, index){
       console.log('item', item);
       var { id } = item
      if(this.initBasicData.orderDetailTypeList.length === 1){
        this.$Message.error('至少有一个品名!');
        return false
      }
      if(id){
        delOrderDetailTypeOne({orderDetail_id: id}).then(res => {
          var result = res.data
          this.$Message.success(result.msg);
        })
      }
      this.$delete(this.initBasicData.orderDetailTypeList, index)
      this.computedCount()
    },
    computedCount(){
      var all_amount = 0
      this.initBasicData.orderDetailTypeList.map((item)=>{
        all_amount += item.amount * item.count
      })
      this.initBasicData.all_amount = all_amount
    },
    addOneType(){
      this.initBasicData.orderDetailTypeList.push({type_id: '', count: '', amount: 0})
    },
    initGetTypeList(){
      var order_id = this.$route.query.order_id
       getOrderDetail({order_id}).then(res => {
          var result = res.data.data
          // 只覆盖定义的值
          for (const key in result) {
            this.initBasicData[key] = result[key]
          }
        })
        getOrderDetailTypeList({order_id}).then(res => {
          var result = res.data.data
          this.initBasicData.orderDetailTypeList = result
        })
        
        getTypeAll({}).then(res => {
          var res = res.data
          if(res.data.length){
            this.TypeAllList = res.data
          }
        })
    },
    cancel(){},
  },
  created(){},
  mounted () {
    this.initGetTypeList()
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
</style>
