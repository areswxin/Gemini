<template>
  <div>
    <Row>
      <Card>
        <p slot="title">
          <Icon type="ios-crop"/>
          用户权限
        </p>
        <div>
          <Table border :columns="columns" :data="data6" stripe height="550">
            <template slot-scope="{ row }" slot="action">
              <Button type="info" size="small" @click="editAuthGroup(row)" style="margin-right: 5px">查看与编辑</Button>
              <Poptip
                confirm
                title="确定要清空该用户的权限吗？"
                @on-ok="deleteAuthGroup(row)"
                transfer
              >
                <Button type="warning" size="small">清空权限</Button>
              </Poptip>
            </template>
          </Table>
        </div>
        <br>
        <Page :total="pagenumber" show-elevator @on-change="splicpage" :page-size="10" ref="total"></Page>
      </Card>
    </Row>

    <Modal v-model="addAuthGroupModal" :width="800">
      <h3 slot="header" style="color:#2D8CF0">用户权限</h3>
      <Form :model="addAuthGroupForm" :label-width="120" label-position="right">
        <FormItem label="用户名">
          <Input v-model="addAuthGroupForm.groupname" v-bind:readonly="isReadOnly"></Input>
        </FormItem>
        <template>
          <FormItem label="DDL及索引权限:">
            <RadioGroup v-model="permission.ddl">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <template v-if="permission.ddl === '1'">
            <FormItem label="连接名:">
              <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                <Checkbox
                  :indeterminate="indeterminate.ddl"
                  :value="checkAll.ddl"
                  @click.prevent.native="ddlCheckAll('ddl_source', 'ddl', 'connection')">全选
                </Checkbox>
              </div>
              <CheckboxGroup v-model="permission.ddl_source">
                <Checkbox v-for="i in connectionList.connection" :label="i.Source" :key="i.Source">
                  <Tag color="purple" :key="i.Source"> {{i.Source}}</Tag>
                </Checkbox>
              </CheckboxGroup>
            </FormItem>
          </template>
          <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
          <br>
          <FormItem label="DML权限:">
            <RadioGroup v-model="permission.dml">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <template v-if="permission.dml === '1'">
            <FormItem label="连接名:">
              <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                <Checkbox
                  :indeterminate="indeterminate.dml"
                  :value="checkAll.dml"
                  @click.prevent.native="ddlCheckAll('dml_source', 'dml', 'connection')">全选
                </Checkbox>
              </div>
              <CheckboxGroup v-model="permission.dml_source">
                <Checkbox v-for="i in connectionList.connection" :label="i.Source" :key="i.Source">
                  <Tag color="geekblue" :key="i.Source"> {{i.Source}}</Tag>
                </Checkbox>
              </CheckboxGroup>
            </FormItem>
          </template>
          <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
          <br>
          <FormItem label="数据查询权限:">
            <RadioGroup v-model="permission.query">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <template v-if="permission.query === '1'">
            <FormItem label="连接名:">
              <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                <Checkbox
                  :indeterminate="indeterminate.query"
                  :value="checkAll.query"
                  @click.prevent.native="ddlCheckAll('query_source', 'query', 'connection')">全选
                </Checkbox>
              </div>
              <CheckboxGroup v-model="permission.query_source">
                <Checkbox v-for="i in connectionList.connection" :label="i.Source" :key="i.Source">
                  <Tag color="blue" :key="i.Source"> {{i.Source}}</Tag>
                </Checkbox>
              </CheckboxGroup>
            </FormItem>
          </template>
          <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
          <br>
          <FormItem label="选择上级审核人:">
            <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
              <Checkbox
                :indeterminate="indeterminate.person"
                :value="checkAll.person"
                @click.prevent.native="ddlCheckAll('auditor', 'person', 'person')">全选
              </Checkbox>
            </div>
            <CheckboxGroup v-model="permission.auditor">
              <Checkbox v-for="i in connectionList.person" :label="i.Username" :key="i.Username">
                <Tag color="cyan" :key="i.Username"> {{i.Username}}</Tag>
              </Checkbox>
            </CheckboxGroup>
          </FormItem>
        </template>
        <template v-if="addAuthGroupForm.rule === 'admin'">
          <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
          <br>
          <FormItem label="用户管理权限:">
            <RadioGroup v-model="permission.user">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
          <br>
          <FormItem label="数据库管理权限:">
            <RadioGroup v-model="permission.base">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
        </template>
      </Form>
      <div slot="footer">
        <Button type="text" @click="addAuthGroupModal = false">取消</Button>
        <Button type="primary" @click="saveAddGroup">保存</Button>
      </div>
    </Modal>


  </div>
</template>

<script>
  import axios from 'axios'
  import '../../styles/tablesmargintop.css'

  const structure = {
    ddl: '0',
    ddlsource: [],
    dml: '0',
    dmlsource: [],
    query: '0',
    querysource: [],
    user: '0',
    base: '0',
    auditor: []
  }
  export default {
    name: 'auth-group',
    data () {
      return {
        isReadOnly: false,
        pagenumber: 1,
        data6: [],
        columns: [
          {
            title: 'ID',
            key: 'ID',
            width: 85,
            sortable: true
          },
          {
            title: '用户名',
            key: 'Username',
            sortable: true
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            slot: 'action'
          }
        ],
        permission: structure,
        indeterminate: {
          ddl: true,
          dml: true,
          query: true,
          person: true
        },
        checkAll: {
          ddl: false,
          dml: false,
          query: false,
          person: false
        },
        connectionList: {
          connection: [],
          person: []
        },
        addAuthGroupForm: {
          groupname: '',
          rule: ''
        },
        addAuthGroupModal: false
      }
    },
    methods: {
      editAuthGroup (vl) {
        [this.isReadOnly, this.addAuthGroupModal, this.isAdd] = [true, true, false];
        this.id = vl.ID;
        this.addAuthGroupForm.groupname = vl.Username;
        this.addAuthGroupForm.rule = vl.Rule;
        this.permission = vl.Permissions;
      },
      saveAddGroup () {
        axios.post(`${this.$config.url}/group/update`, {
          'username': this.addAuthGroupForm.groupname,
          'permission': this.permission
        })
          .then(res => {
            this.$config.notice(res.data)
            this.$refs.total.currentPage = 1
            this.refreshgroup()
          })
          .catch(error => {
            this.$config.err_notice(this, error)
          })
        this.addAuthGroupModal = false
      },
      refreshgroup (vl = 1) {
        axios.get(`${this.$config.url}/group?page=${vl}`)
          .then(res => {
            this.data6 = res.data.data;
            this.pagenumber = parseInt(res.data.page);
            this.connectionList.connection = res.data.source;
            this.connectionList.person = res.data.audit;
          })
          .catch(error => {
            this.$config.err_notice(this, error)
          })
      },
      splicpage (page) {
        this.refreshgroup(page)
      },
      ddlCheckAll (name, indeterminate, ty) {
        this.checkAll[indeterminate] = !this.checkAll[indeterminate]
        this.indeterminate[indeterminate] = false;
        if (this.checkAll[indeterminate]) {
          if (ty === 'person') {
            this.permission[name] = this.connectionList[ty].map(vl => vl.Username);
          } else {
            this.permission[name] = this.connectionList[ty].map(vl => vl.Source)
          }
        } else {
          this.permission[name] = []
        }
      },
      deleteAuthGroup (vl) {
        axios.delete(`${this.$config.url}/group/del/${vl.Username}`)
          .then(res => {
            this.$config.notice(res.data);
            this.refreshgroup()
          })
          .catch(err => this.$config.err_notice(this, err))
      }
    },
    mounted () {
      this.refreshgroup()
    }
  }
</script>

<style scoped>
</style>
