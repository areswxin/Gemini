<style>
  label {
    font-size: 30px;
  }
</style>

<template>
  <div>
    <Row>
      <Col span="24">
        <Card>
          <p slot="title">
            <Icon type="md-settings"></Icon>
            基础设置
          </p>
          <Row>
            <Col span="12">
              <Card>
                <p slot="title">消息推送</p>
                <Form :label-width="120">
                  <FormItem label="钉钉webhook:">
                    <Input placeholder="此webhook只用于查询工单,权限工单的消息推送。" v-model="message.web_hook"></Input>
                  </FormItem>
                  <FormItem label="邮件SMTP服务地址:">
                    <Input placeholder="STMP服务 地址" v-model="message.host"></Input>
                  </FormItem>
                  <FormItem>
                    <Checkbox v-model="message.ssl">启用ssl端口</Checkbox>
                  </FormItem>
                  <FormItem label="SMTP服务端口:">
                    <Input placeholder="STMP服务 端口" v-model="message.port"></Input>
                  </FormItem>
                  <FormItem label="邮件推送人用户名:">
                    <Input placeholder="推送人 用户名" v-model="message.user"></Input>
                  </FormItem>
                  <FormItem label="邮件推送人密码:">
                    <Input placeholder="推送人 密码" type="password" v-model="message.password"></Input>
                  </FormItem>
                  <FormItem label="邮件测试收件地址::">
                    <Input placeholder="测试收件人地址填写" v-model="message.to_user"></Input>
                  </FormItem>
                  <Form-item label="email推送开关:">
                    <i-switch v-model="message.mail" size="large" @on-change="mail_switching">
                      <span slot="open">开</span>
                      <span slot="close">关</span>
                    </i-switch>
                  </Form-item>
                  <Form-item label="钉钉推送开关:">
                    <i-switch v-model="message.ding" size="large" @on-change="dingding_switching">
                      <span slot="open">开</span>
                      <span slot="close">关</span>
                    </i-switch>
                  </Form-item>
                  <Button type="primary" @click="dingding_test()">钉钉测试</Button>
                  <Button type="warning" @click="mail_test()" style="margin-left: 5%">邮件测试</Button>
                  <Button type="success" @click.native="openDrawer()" style="margin-left: 5%">审核引擎设置</Button>
                </Form>
              </Card>
            </Col>
            <Col span="12">
              <Card style="margin-left: 5%">
                <p slot="title">LDAP设置</p>
                <Form :label-width="120">
                  <FormItem label="服务地址url">
                    <Input placeholder="ldap://[ip地址或者域名]:[端口号]" v-model="ldap.url"></Input>
                  </FormItem>
                  <FormItem label="LDAP管理员DN:">
                    <Input placeholder="请填写管理员DN" v-model="ldap.user"></Input>
                  </FormItem>
                  <FormItem label="LDAP管理员密码:">
                    <Input placeholder="请填写管理员密码" v-model="ldap.password" type="password"></Input>
                  </FormItem>
                  <FormItem label="LDAP搜索规则:">
                    <Select v-model="ldap.type">
                      <Option :value=1>sAMAccountName</Option>
                      <Option :value=2>uid</Option>
                      <Option :value=3>cn</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="LDAP_SCBASE:">
                    <Input placeholder="LDAP Search Base" v-model="ldap.sc"></Input>
                  </FormItem>
                  <Button type="primary" @click="ldap_test()">ldap测试</Button>
                </Form>
              </Card>
              <br>
              <Alert style="margin-left: 5%" type="info" show-icon>
                注意事项：
                <template slot="desc">
                  1.LDAP登录用户名，必须全局唯一。
                </template>
              </Alert>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
    <br>
    <Row>
      <Col span="24">
        <Card>
          <p slot="title">
            <Icon type="android-settings"></Icon>
            进阶设置
          </p>
          <Row>
            <Col span="12">
              <Card style="margin-left: 5%">
                <p slot="title">其他</p>
                <Form :label-width="120">
                  <FormItem label="查询最大Limit限制:">
                    <Input placeholder="查询最大的Limit数。" v-model="other.limit"></Input>
                  </FormItem>
                  <FormItem label="自定义环境:">
                    <Tag v-for="item in other.idc" :key="item" :name="item" type="border" closable color="blue"
                         @on-close="handleClose2">{{ item }}
                    </Tag>
                    <br>
                    <Input placeholder="环境名称" v-model="other.foce" style="width: 30%"></Input>
                    <Button icon="ios-plus-empty" type="dashed" size="small" @click="handleAdd">添加环境</Button>
                  </FormItem>
                  <FormItem label="排除数据库:">
                    <Tag v-for="v in other.exclude_db_list" :key="v" :name="v" type="border" closable color="blue"
                         @on-close="handleClose_exclued_db">{{ v }}
                    </Tag>
                    <br>
                    <Input placeholder="排除数据库" v-model="other.exclued_db" style="width: 30%"></Input>
                    <Button icon="ios-plus-empty" type="dashed" size="small" @click="handleAdd_exclued_db">添加排除数据库
                    </Button>
                  </FormItem>
                  <FormItem label="脱敏字段:">
                    <Tag v-for="v in other.insulate_word_list" :key="v" :name="v" type="border" closable color="blue"
                         @on-close="handleClose3">{{ v }}
                    </Tag>
                    <br>
                    <Input placeholder="脱敏字段设置" v-model="other.sensitive" style="width: 30%"></Input>
                    <Button icon="ios-plus-empty" type="dashed" size="small" @click="handleAdd1">添加脱敏字段</Button>
                  </FormItem>
                  <Row>
                    <Col span="11">
                      <Form-item label="多级审核开关:">
                        <i-switch size="large" @on-change="multi_switching" v-model="other.multi">
                          <span slot="open">开</span>
                          <span slot="close">关</span>
                        </i-switch>
                      </Form-item>
                    </Col>
                    <Col span="11">
                      <Form-item label="查询审核开关:">
                        <i-switch size="large" @on-change="multi_query" v-model="other.query">
                          <span slot="open">开</span>
                          <span slot="close">关</span>
                        </i-switch>
                      </Form-item>
                    </Col>
                  </Row>

                  <Row>
                    <Col span="11">
                      <Form-item label="注册开关:">
                        <i-switch size="large" @on-change="multi_register" v-model="other.register">
                          <span slot="open">开</span>
                          <span slot="close">关</span>
                        </i-switch>
                      </Form-item>
                    </Col>
                    <Col span="11">
                      <Form-item label="查询导出开关:">
                        <i-switch size="large" @on-change="multi_export" v-model="other.export">
                          <span slot="open">开</span>
                          <span slot="close">关</span>
                        </i-switch>
                      </Form-item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
            <Col span="12">
              <Alert style="margin-left: 5%" type="warning" show-icon>
                注意事项：
                <template slot="desc">
                  1.由于各个邮件服务提供商对于垃圾邮件过滤的机制各不相同，可能会造成邮件无法接收的情况。所以使用前请测试是否稳定,推荐使用搜狐
                  <br>
                  2.只有开启相应的消息推送开关后，消息推送才会开启。否则只有站内信一种消息推送方式。
                  <br>
                  3.设置最大Limit数后，所有的查询语句的查询结果都不会超过这个数值。
                  <br>
                  4.开启多级审核开关后,用户组将新增执行人角色，只有执行人角色的用户才能最终执行工单。关闭后执行人角色用户将全部更改为使用者
                  <br>
                  5.查询审核开关开启后，所有的查询都必须通过管理员同意才能进行。关闭则可自主查询
                  <br>
                  6.设置脱敏字段后，查询时如匹配到对应字段则该字段将只会以******显示
                </template>
              </Alert>
              <Button style="margin-left: 5%;width: 95%" type="primary" @click="save_upload">保存</Button>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>

    <Drawer
      title="审核引擎规则设置"
      v-model="this.sw"
      width="720"
      :closable="false"
      @on-close="cl"
    >
      <Form :label-width="180">
        <Col span="8">
          <FormItem label="检查插入语句存在列名">
            <i-switch size="large" v-model="juno.DMLInsertColumns">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="inert语句字段上限">
            <Input v-model="juno.DMLMaxInsertRows" type="number"></Input>
          </FormItem>
          <FormItem label="检查dml语句where条件">
            <i-switch size="large" v-model="juno.DMLWhere">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="检查dml语句order条件">
            <i-switch size="large" v-model="juno.DMLOrder">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="检查dml语句有select语句">
            <i-switch size="large" v-model="juno.DMLSelect">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="检查表注释">
            <i-switch size="large" v-model="juno.DDLCheckTableComment">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="检查列注释">
            <i-switch size="large" v-model="juno.DDlCheckColumnComment">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="检查ddl语句有null值">
            <i-switch size="large" v-model="juno.DDLCheckColumnNullable">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="检查列默认值">
            <i-switch size="large" v-model="juno.DDLCheckColumnDefault">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="是否允许跨库表迁移">
            <i-switch size="large" v-model="juno.DDLEnableAcrossDBRename">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="强制自增列初始值为1">
            <i-switch size="large" v-model="juno.DDLEnableAutoincrementInit">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="允许设置排列顺序">
            <i-switch size="large" v-model="juno.EnableSetCollation">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="允许设置字符集">
            <i-switch size="large" v-model="juno.EnableSetCharset">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="允许一个工单内有多条DDL语句">
            <i-switch size="large" v-model="juno.DDLMultiToSubmit">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
        </Col>
        <Col span="10" offset="2">
          <FormItem label="检查关键词">
            <i-switch size="large" v-model="juno.CheckIdentifier">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="检查自增列设置无符号标志unsigned">
            <i-switch size="large" v-model="juno.DDLEnableAutoincrementUnsigned">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="允许删除表">
            <i-switch size="large" v-model="juno.DDLEnableDropTable">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="允许删除库">
            <i-switch size="large" v-model="juno.DDLEnableDropDatabase">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="允许索引名为空">
            <i-switch size="large" v-model="juno.DDLEnableNullIndexName">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="开启索引名称规范">
            <i-switch size="large" v-model="juno.DDLIndexNameSpec">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
          <FormItem label="单个索引指定字段上限">
            <Input v-model="juno.DDLMaxKeyParts" type="number"></Input>
          </FormItem>
          <FormItem label="单表索引数上限">
            <Input v-model="juno.DDLMaxKey" type="number"></Input>
          </FormItem>
          <FormItem label="char字段最大长度">
            <Input v-model="juno.DDLMaxCharLength" type="number"></Input>
          </FormItem>
          <FormItem label="表名最大长度">
            <Input v-model="juno.MaxTableNameLen" type="number"></Input>
          </FormItem>
          <FormItem label="最大影响行数">
            <Input v-model="juno.MaxAffectRows" type="number"></Input>
          </FormItem>
          <FormItem label="允许的排列顺序范围">
            <Input v-model="juno.SupportCollation"></Input>
          </FormItem>
          <FormItem label="允许的字符集范围">
            <Input v-model="juno.SupportCharset"></Input>
          </FormItem>
          <FormItem label="建表时必须拥有哪些字段">
            <Input v-model="juno.MustHaveColumns"></Input>
          </FormItem>
        </Col>
      </Form>
    </Drawer>
  </div>
</template>

<script>

  import axios from 'axios'

  export default {
    name: 'Setting',
    data () {
      return {
        juno: {
          DMLMaxInsertRows: 0
        },
        sw: false,
        ldap: Object,
        message: Object,
        other: {
          limit: 0
        }
      }
    },
    methods: {
      cl () {
        this.sw = false
      },
      openDrawer () {
        this.sw = true
      },
      handleAdd () {
        this.other.idc.push(this.other.foce)
        this.other.foce = ''
      },
      handleAdd1 () {
        this.other.insulate_word_list.push(this.other.sensitive);
        this.other.sensitive = ''
      },
      handleAdd_exclued_db () {
        this.other.exclude_db_list.push(this.other.exclued_db)
        this.other.exclued_db = ''
      },
      handleClose2 (event, name) {
        const index = this.other.idc.indexOf(name)
        this.other.idc.splice(index, 1)
      },
      handleClose3 (event, name) {
        const index = this.other.insulate_word_list.indexOf(name)
        this.other.insulate_word_list.splice(index, 1)
      },
      handleClose_exclued_db (event, name) {
        const index = this.other.exclude_db_list.indexOf(name)
        this.other.exclude_db_list.splice(index, 1)
      },
      multi_switching (status) {
        this.other.multi = status
      },
      multi_register (status) {
        this.other.register = status
      },
      multi_export (status) {
        this.other.export = status
      },
      multi_query (status) {
        this.other.query = status
      },
      dingding_switching (status) {
        this.message.ding = status
      },
      mail_switching (status) {
        this.message.mail = status
      },
      ldap_test () {
        axios.put(`${this.$config.url}/group/setting/test/ldap`, {
          'ldap': this.ldap
        })
          .then(res => {
            this.$config.notice(res.data)
          })
          .catch(error => {
            this.$config.err_notice(this, error)
          })
      },
      dingding_test () {
        this.message.port = parseInt(this.message.port);
        axios.put(`${this.$config.url}/group/setting/test/ding`, {
          'mail': this.message
        })
          .then(res => {
            this.$config.notice(res.data)
          })
          .catch(error => {
            this.$config.err_notice(this, error)
          })
      },
      mail_test () {
        this.message.port = parseInt(this.message.port);
        axios.put(`${this.$config.url}/group/setting/test/mail`, {
          'mail': this.message
        })
          .then(res => {
            this.$config.notice(res.data)
          })
          .catch(error => {
            this.$config.err_notice(this, error)
          })
      },
      save_upload () {
        this.juno.DMLMaxInsertRows = parseInt(this.juno.DMLMaxInsertRows);
        this.juno.DDLMaxKeyParts = parseInt(this.juno.DDLMaxKeyParts);
        this.juno.DDLMaxKey = parseInt(this.juno.DDLMaxKey);
        this.juno.DDLMaxCharLength = parseInt(this.juno.DDLMaxCharLength);
        this.juno.MaxTableNameLen = parseInt(this.juno.MaxTableNameLen);
        this.juno.MaxAffectRows = parseInt(this.juno.MaxAffectRows);
        this.message.port = parseInt(this.message.port);
        axios.post(`${this.$config.url}/group/setting/add`, {
          'ldap': this.ldap,
          'message': this.message,
          'other': this.other,
          'juno': this.juno
        })
          .then(res => {
            this.$config.notice(res.data)
          })
          .catch(error => {
            this.$config.err_notice(this, error)
          })
      }
    },
    mounted () {
      axios.get(`${this.$config.url}/group/setting`)
        .then(res => {
          this.message = res.data.Message;
          this.other = res.data.Other;
          this.ldap = res.data.Ldap;
          this.juno = res.data.AuditRole
        })
        .catch(error => {
          this.$config.err_notice(this, error)
        })
    }
  }
</script>

<style scoped>

</style>
