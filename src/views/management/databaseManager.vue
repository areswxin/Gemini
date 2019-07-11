<style lang="less">
  @import '../../styles/common.less';
  @import '../../styles/table.less';
</style>
<template>
  <div>
    <Col span="5">
      <Card>
        <p slot="title">
          <Icon type="md-refresh"/>
          添加数据库
        </p>
        <div class="edittable-testauto-con">
          <Form ref="formValidate" :model="formItem" :label-width="100" :rules="ruleInline">
            <Form-item label="环境:">
              <Select v-model="formItem.add" placeholder="请选择">
                <Option v-for="list in comList" :value="list" :key="list">{{ list }}</Option>
              </Select>
            </Form-item>
            <Form-item label="连接名称:" prop="name">
              <Input v-model="formItem.name" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="数据库地址:" prop="ip">
              <Input v-model="formItem.ip" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="端口:" prop="port">
              <Input v-model="formItem.port" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="用户名:" prop="username">
              <Input v-model="formItem.username" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="密码:" prop="password">
              <Input v-model="formItem.password" placeholder="请输入" type="password"></Input>
            </Form-item>
            <Button type="info" @click="testConnection()">测试连接</Button>
            <Button type="success" @click="addConnection()" style="margin-left: 5%">确定</Button>
            <Button type="warning" @click="resetForm()" style="margin-left: 5%">重置</Button>
          </Form>
        </div>
      </Card>
    </Col>
    <Col span="19" class="padding-left-10">
      <Card>
        <p slot="title">
          <Icon type="md-apps"/>
          数据库详情表
        </p>
        <Input v-model="query.connection_name" placeholder="请填写连接名" style="width: 20%" clearable></Input>
        <Input v-model="query.computer_room" placeholder="请填写环境" style="width: 20%" clearable></Input>
        <Button @click="queryData" type="primary">查询</Button>
        <Button @click="queryCancel" type="warning">重置</Button>
        <div class="edittable-con-1">
          <Table :columns="columns" :data="tableData">
            <template slot-scope="{ row }" slot="action">
              <Button type="info" size="small" @click="viewConnectionModal(row)" style="margin-right: 5px">详细信息</Button>
              <Poptip
                confirm
                title="删除数据源将会删除对应的所有工单信息,确定要删除吗？"
                @on-ok="delConnection(row)"
                transfer
              >
                <Button type="warning" size="small">删除</Button>
              </Poptip>
            </template>
          </Table>
        </div>
        <br>
        <Page :total="pagenumber" show-elevator @on-change="getPageInfo" :page-size="10" ref="page"></Page>
      </Card>
    </Col>

    <Modal v-model="baseinfo" :width="500" okText="保存" @on-ok="modifyBase">
      <h3 slot="header" style="color:#2D8CF0">数据库连接信息</h3>
      <Form :label-width="100" label-position="right">
        <FormItem label="环境">
          <Input v-model="editbaseinfo.IDC" readonly></Input>
        </FormItem>
        <FormItem label="连接名称:">
          <Input v-model="editbaseinfo.Source" readonly></Input>
        </FormItem>
        <FormItem label="数据库地址:">
          <Input v-model="editbaseinfo.IP"></Input>
        </FormItem>
        <FormItem label="端口:">
          <Input v-model="editbaseinfo.Port"></Input>
        </FormItem>
        <FormItem label="用户名:">
          <Input v-model="editbaseinfo.Username"></Input>
        </FormItem>
        <FormItem label="密码:">
          <Input v-model="editbaseinfo.Password" type="password"></Input>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>
<script>
  import '../../styles/tablesmargintop.css'
  import axios from 'axios'

  export default {
    name: 'sqlist',
    data () {
      return {
        tableData: [],
        columns: [
          {
            title: '连接名称',
            key: 'Source'
          },
          {
            title: '数据库地址',
            key: 'IP'
          },
          {
            title: '环境',
            key: 'IDC'
          },
          {
            title: '操作',
            key: 'action',
            width: 300,
            slot: 'action'
          }
        ],
        // 添加数据库信息
        formItem: {
          name: '',
          ip: '',
          add: '',
          username: '',
          password: '',
          port: ''
        },
        // 添加表单验证规则
        ruleInline: {
          name: [{
            required: true,
            message: '请填写连接名称',
            trigger: 'blur'
          }],
          ip: [{
            required: true,
            message: '请填写连接地址',
            trigger: 'blur'
          }],
          username: [{
            required: true,
            message: '请填写用户名',
            trigger: 'blur'
          }],
          port: [{
            required: true,
            message: '请填写端口',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请填写密码',
            trigger: 'blur'
          }]
        },
        comList: [],
        pagenumber: 1,
        baseinfo: false,
        editbaseinfo: {},
        query: {
          computer_room: '',
          connection_name: '',
          valve: false
        }
      }
    },
    methods: {
      resetForm () {
        this.formItem = this.$config.clearObj(this.formItem)
      },
      testConnection () {
        axios.put(`${this.$config.url}/management_db/test`, {
          'ip': this.formItem.ip,
          'user': this.formItem.username,
          'password': this.formItem.password,
          'port': parseInt(this.formItem.port)
        })
          .then(res => {
            this.$config.notice(res.data)
          })
          .catch(error => {
            this.$config.err_notice(this, error)
          })
      },
      addConnection () {
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            axios.post(`${this.$config.url}/management_db/add`, {
              'source': this.formItem.name,
              'idc': this.formItem.add,
              'ip': this.formItem.ip,
              'user': this.formItem.username,
              'password': this.formItem.password,
              'port': parseInt(this.formItem.port)
            })
              .then(res => {
                this.$config.notice(res.data);
                this.getPageInfo(this.$refs.page.currentPage);
                this.$refs['formValidate'].resetFields()
              })
              .catch(error => {
                this.$config.err_notice(this, error)
              })
            this.reset()
          }
        })
      },
      viewConnectionModal (row) {
        this.baseinfo = true;
        this.editbaseinfo = row
      },
      delConnection (vl) {
        let step = this.$refs.page.currentPage;
        if (this.tableData.length === 1) {
          step = step - 1
        }
        axios.delete(`${this.$config.url}/management_db/del/${vl.Source}`)
          .then(res => {
            this.$config.notice(res.data);
            this.getPageInfo(step)
          })
          .catch(error => {
            this.$config.err_notice(this, error)
          })
      },
      getPageInfo (vl = 1) {
        axios.get(`${this.$config.url}/management_db/fetch/?page=${vl}&permissions_type=base&con=${JSON.stringify(this.query)}`)
          .then(res => {
            [this.tableData, this.pagenumber, this.comList] = [res.data.data, parseInt(res.data.page), res.data.custom]
          })
          .catch(error => {
            this.$config.err_notice(this, error)
          })
      },
      modifyBase () {
        axios.put(`${this.$config.url}/management_db/update`, {
          'data': JSON.stringify(this.editbaseinfo)
        })
          .then(res => this.$config.notice(res.data))
          .catch(err => this.$config.err_notice(this, err))
      },
      queryData () {
        this.query.valve = true;
        this.getPageInfo()
      },
      queryCancel () {
        this.$config.clearObj(this.query)
        this.getPageInfo()
      }
    },
    mounted () {
      this.getPageInfo()
    }
  }
</script>
