<style lang="less" scoped>
  @import '../../styles/common.less';
  @import '../../styles/table.less';
</style>
<template>
  <div>
    <Col span="5">
      <Card>
        <p slot="title">
          <Icon type="md-settings"></Icon>
          添加用户
        </p>
        <div class="edittable-testauto-con">
          <Form :model="userinfo" :label-width="80" ref="userinfova" :rules="userinfoValidate">
            <FormItem label="用户名" prop="username">
              <Input v-model="userinfo.username" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="密码" prop="password">
              <Input v-model="userinfo.password" placeholder="请输入" type="password"></Input>
            </FormItem>
            <FormItem label="确认密码" prop="confirmpassword">
              <Input v-model="userinfo.confirmpassword" placeholder="请输入" type="password"></Input>
            </FormItem>
            <FormItem label="部门" prop="department">
              <Input v-model="userinfo.department" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="姓名" prop="realname">
              <Input v-model="userinfo.realname" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="角色" prop="group">
              <Select v-model="userinfo.group" placeholder="请选择">
                <Option value="admin">管理员</Option>
                <Option value="perform" v-if="connectionList.multi">执行人</Option>
                <Option value="guest">使用人</Option>
              </Select>
            </FormItem>
            <FormItem label="电子邮箱" prop="email">
              <Input v-model="userinfo.email" placeholder="请输入"></Input>
            </FormItem>
            <Button type="primary" @click.native="registered" style="margin-left: 35%" :loading="loading">注册</Button>
          </Form>
        </div>
      </Card>
    </Col>
    <Col span="19" class="padding-left-10">
      <Card>
        <p slot="title">
          <Icon type="md-people"></Icon>
          系统用户表
        </p>
        <Input v-model="query.user" placeholder="请填写用户名" style="width: 20%" clearable></Input>
        <Input v-model="query.department" placeholder="请填写部门" style="width: 20%" clearable></Input>
        <Button @click="queryData" type="primary">查询</Button>
        <Button @click="queryCancel" type="warning">重置</Button>
        <div class="edittable-con-1">
          <Table border :columns="columns" :data="tableData" stripe height="520">
            <template slot-scope="{ row }" slot="action">
              <Button type="primary" size="small" style="margin-right: 5px" @click="editPassModal(row)"
                      v-if="row.id !== 1">更改密码
              </Button>
              <Button type="info" size="small" @click="editAuthModal(row)" style="margin-right: 5px">详细信息</Button>
              <Poptip
                confirm
                title="确定删除改用户吗？"
                transfer
                @on-ok="delUser(row)">
                <Button type="warning" size="small" v-if="row.id !== 1">删除</Button>
              </Poptip>
            </template>
          </Table>
        </div>
        <br>
        <Page :total="pagenumber" show-elevator @on-change="refreshUser" :page-size="10" ref="page"></Page>
      </Card>
    </Col>

    <Modal v-model="editPasswordForm.modal" :closable='false' :mask-closable=false :width="500">
      <h3 slot="header" style="color:#2D8CF0">修改用户密码</h3>
      <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right"
            :rules="passwordValidate">
        <FormItem label="用户名">
          <Input v-model="username" readonly="readonly"></Input>
        </FormItem>
        <FormItem label="新密码" prop="newPass">
          <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" type="password"></Input>
        </FormItem>
        <FormItem label="确认新密码" prop="rePass">
          <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码" type="password"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelModal(editPasswordForm)">取消</Button>
        <Button type="primary" @click="saveEditPass" :loading="savePassLoading">保存</Button>
      </div>
    </Modal>

    <Modal v-model="editAuthForm.modal" @on-ok="saveAuthInfo">
      <h3 slot="header" style="color:#2D8CF0">用户信息</h3>
      <Form :model="editAuthForm" label-position="right">
        <FormItem label="用户名">
          <Input v-model="editAuthForm.Username" readonly="readonly"></Input>
        </FormItem>
        <FormItem label="真实姓名">
          <Input v-model="editAuthForm.RealName"></Input>
        </FormItem>
        <FormItem label="角色">
          <Select v-model="editAuthForm.Rule" placeholder="请选择">
            <Option value="admin">管理员</Option>
            <Option value="perform" v-if="connectionList.multi && editAuthForm.id !== 1">执行人</Option>
            <Option value="guest" v-if="editAuthForm.id !== 1">使用者</Option>
          </Select>
        </FormItem>
        <FormItem label="部门">
          <Input v-model="editAuthForm.Department" placeholder="请输入新部门"></Input>
        </FormItem>
        <FormItem label="E-mail">
          <Input v-model="editAuthForm.Email" placeholder="请输入邮箱"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import axios from 'axios'
  import '../../styles/tablesmargintop.css'

  export default {
    data () {
      const valideRePassword = (rule, value, callback) => { // eslint-disable-line no-unused-vars
        if (value !== this.editPasswordForm.newPass) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      const valideuserinfoPassword = (rule, value, callback) => {
        if (value !== this.userinfo.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      return {
        query: {
          user: '',
          department: '',
          valve: false
        },
        loading: false,
        columns: [
          {
            title: '用户名',
            key: 'Username',
            sortable: true
          },
          {
            title: '角色',
            key: 'Rule',
            sortable: true
          },
          {
            title: '姓名',
            key: 'RealName',
            sortable: true
          },
          {
            title: '部门',
            key: 'Department',
            sortable: true
          },
          {
            title: 'email',
            key: 'Email',
            sortable: true
          },
          {
            title: '操作',
            key: 'action',
            width: 250,
            align: 'center',
            slot: 'action'
          }
        ],
        tableData: [],
        pagenumber: 1,
        // 新建用户
        userinfo: {
          username: '',
          password: '',
          confirmpassword: '',
          group: '',
          checkbox: '',
          department: '',
          email: '',
          realname: ''
        },
        userinfoValidate: {
          username: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              message: '请至少输入6个字符',
              trigger: 'blur'
            },
            {
              max: 32,
              message: '最多输入32个字符',
              trigger: 'blur'
            }
          ],
          confirmpassword: [
            {
              required: true,
              message: '请再次输入新密码',
              trigger: 'blur'
            },
            {
              validator: valideuserinfoPassword,
              trigger: 'blur'
            }
          ],
          group: [
            {
              required: true,
              message: '请输入权限',
              trigger: 'blur'
            }
          ],
          department: [
            {
              required: true,
              message: '请输入部门名称',
              trigger: 'blur'
            },
            {
              min: 2,
              message: '请至少输入6个字符',
              trigger: 'blur'
            },
            {
              max: 32,
              message: '最多输入32个字符',
              trigger: 'blur'
            }
          ],
          realname: [
            {
              required: true,
              message: '请输入姓名',
              trigger: 'blur'
            },
            {
              min: 2,
              message: '请至少输入2个字符',
              trigger: 'blur'
            },
            {
              max: 32,
              message: '最多输入32个字符',
              trigger: 'blur'
            }],
          email: [
            {
              required: true,
              message: '请输入工作邮箱',
              trigger: 'blur'
            },
            {
              min: 2,
              message: '请至少输入2个字符',
              trigger: 'blur'
            },
            {
              max: 32,
              message: '最多输入32个字符',
              trigger: 'blur'
            }]
        },
        // 更改密码遮罩层状态
        editPasswordModal: false,
        // 更改密码
        editPasswordForm: {
          newPass: '',
          rePass: '',
          modal: false
        },
        // 保存更改密码loding按钮状态
        savePassLoading: false,
        // 更改密码表单验证规则
        passwordValidate: {
          newPass: [{
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },
            {
              min: 6,
              message: '请至少输入6个字符',
              trigger: 'blur'
            },
            {
              max: 32,
              message: '最多输入32个字符',
              trigger: 'blur'
            }
          ],
          rePass: [{
            required: true,
            message: '请再次输入新密码',
            trigger: 'blur'
          },
            {
              validator: valideRePassword,
              trigger: 'blur'
            }
          ]
        },
        // 更改部门及权限
        GroupModal: false,
        editAuthForm: {
          Username: '',
          Department: '',
          RealName: '',
          Rule: '',
          Email: '',
          modal: false
        },
        // 更改部门及权限遮罩层状态
        // 用户名
        username: '',
        connectionList: {
          multi: Boolean
        }
      }
    },
    methods: {
      editPassModal (row) {
        this.username = row.Username;
        this.editPasswordForm.modal = true;
      },
      editAuthModal (row) {
        this.editAuthForm = this.$config.sameMerge(this.editAuthForm, row, this.editAuthForm);
        this.editAuthForm.modal = true;
      },
      cancelModal (vl) {
        this.$config.clearObj(vl)
      },
      saveEditPass () {
        this.$refs['editPasswordForm'].validate((valid) => {
          if (valid) {
            this.savePassLoading = true;
            axios.post(`${this.$config.url}/management_user/password_reset`, {
              'username': this.username,
              'new': this.editPasswordForm.newPass
            })
              .then(res => {
                this.$config.notice(res.data)
                this.editPasswordForm.modal = false
              })
              .catch(error => {
                this.$config.err_notice(this, error)
              })
            this.savePassLoading = false
          }
        })
      },
      saveAuthInfo () {
        this.savePassLoading = true;
        axios.post(`${this.$config.url}/management_user/modify`, {
          'Username': this.editAuthForm.Username,
          'Rule': this.editAuthForm.Rule,
          'Department': this.editAuthForm.Department,
          'RealName': this.editAuthForm.RealName,
          'Email': this.editAuthForm.Email
        })
          .then(res => {
            this.$config.notice(res.data);
            this.$config.clearObj(this.editAuthForm);
            this.refreshUser(this.$refs.page.currentPage)
          })
          .catch(error => {
            this.$config.err_notice(this, error)
          })
        this.savePassLoading = false
      },
      registered () {
        this.$refs['userinfova'].validate((valid) => {
          if (valid) {
            this.loading = true;
            axios.post(`${this.$config.url}/management_user/register`, {
              'userinfo': this.userinfo
            })
              .then(res => {
                this.loading = false
                this.$config.notice(res.data)
                this.refreshUser(this.$refs.page.currentPage)
                this.userinfo = this.$config.clearObj(this.userinfo)
              })
              .catch(error => {
                this.loading = false
                this.$config.err_notice(this, error)
              })
          }
        })
      },
      refreshUser (vl = 1) {
        axios.get(`${this.$config.url}/management_user/fetch?page=${vl}&con=${JSON.stringify(this.query)}`)
          .then(res => {
            this.connectionList.multi = res.data.multi;
            this.tableData = res.data.data;
            this.pagenumber = parseInt(res.data.page)
          })
          .catch(error => {
            this.$config.err_notice(this, error)
          })
      },
      delUser (row) {
        let step = this.$refs.page.currentPage
        if (this.tableData.length === 1) {
          step = step - 1
        }
        axios.delete(`${this.$config.url}/management_user/del/${row.Username}`)
          .then(res => {
            this.$config.notice(res.data)
            this.refreshUser(step)
          })
          .catch(error => {
            this.$config.err_notice(this, error)
          })
      },
      queryData () {
        this.query.valve = true;
        this.refreshUser()
      },
      queryCancel () {
        this.$config.clearObj(this.query)
        this.refreshUser()
      }
    },
    mounted () {
      this.refreshUser();
    }
  }
</script>
