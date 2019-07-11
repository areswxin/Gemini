<style lang="less">
  @import '../styles/common.less';
  @import '../styles/table.less';

  .top {
    padding: 10px;
    background: rgba(0, 153, 229, .7);
    color: #fff;
    text-align: center;
    border-radius: 2px;
  }
</style>
<template>
  <div>
    <Row>
      <Card>
        <p slot="title" style="height: 45px">
          <Icon type="android-send"></Icon>
          工单{{ this.$route.query.workid }}详细信息
          <br>
          <Button type="text" v-if="this.$route.query.status === 1" @click.native="rollback()">查看回滚语句</Button>
          <Button type="text" v-else-if="this.$route.query.status === 0 || this.$route.query.status ===4"
                  @click.native="repairOrder()">重新提交
          </Button>
          <Button type="text" @click.native="$router.go(-1)">返回</Button>
        </p>
        <Row>
          <Col span="24">
            <Table border :columns="tabcolumns" :data="TableDataNew" class="tabletop" style="background: #5cadff"
                   size="large"></Table>
          </Col>
        </Row>
      </Card>
    </Row>
    <BackTop :height="100" :bottom="200">
      <div class="top">返回顶端</div>
    </BackTop>
    <Modal v-model="reloadsql" :ok-text="'提交工单'" width="800" @on-ok="referOrder">
      <Row>
        <Card>
          <div class="step-header-con">
            <h3>Yearning SQL平台审核工单</h3>
          </div>
          <p class="step-content"></p>
          <Form class="step-form">
            <FormItem label="用户名:">
              <p>{{formItem.Username}}</p>
            </FormItem>
            <FormItem label="环境:">
              <p>{{formItem.IDC}}</p>
            </FormItem>
            <FormItem label="连接名:">
              <p>{{formItem.Source}}</p>
            </FormItem>
            <FormItem label="数据库库名:">
              <p>{{formItem.DataBase}}</p>
            </FormItem>
            <FormItem label="定时执行:">
              <p>{{formItem.Delay}}</p>
            </FormItem>
            <FormItem>
              <Input v-model="formItem.SQL"
                     v-if="this.$route.query.status === 0 || this.$route.query.status ===4" type="textarea"></Input>
              <Table :columns="rollColumn" :data="rollData" v-if="this.$route.query.status ===1"
                     max-height="300"></Table>
            </FormItem>
            <FormItem label="工单提交说明:">
              <Input v-model="formItem.text" placeholder="最多不超过20个字"></Input>
            </FormItem>
            <FormItem label="是否备份">
              <RadioGroup v-model="formItem.Backup">
                <Radio :label=1>是</Radio>
                <Radio :label=0>否</Radio>
              </RadioGroup>
            </FormItem>
          </Form>
        </Card>
      </Row>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'
  //
  export default {
    name: 'myorder-list',
    data () {
      return {
        tabcolumns: [
          {
            title: 'sql语句',
            key: 'SQL',
            tooltip: true
          },
          {
            title: '状态',
            key: 'State',
            width: 250
          },
          {
            title: '错误信息',
            key: 'Error',
            width: 400
          },
          {
            title: '影响行数',
            key: 'Affectrow',
            width: 100
          },
          {
            title: '执行时间/秒',
            key: 'Time',
            width: 200
          }
        ],
        TableDataNew: [],
        single: false,
        reloadsql: false,
        formItem: {},
        dmlorddl: null,
        rollColumn: [
          {
            title: '回滚语句',
            key: 'SQL',
            tooltip: true
          }
        ],
        rollData: []
      }
    },
    methods: {
      rollback () {
        axios.get(`${this.$config.url}/fetch/roll?workid=${this.$route.query.workid}`)
          .then(res => {
            if (res.data.sql === []) {
              this.$config.err_notice(this, '此工单没有备份或语句执行失败!');
              return
            }
            this.reloadsql = true;
            this.formItem = res.data.order;
            this.rollData = res.data.sql;
            this.formItem.Delay = 'none';
          })
          .catch(err => {
            this.$config.err_notice(this, err)
          })
      },
      repairOrder () {
        axios.get(`${this.$config.url}/fetch/roll?workid=${this.$route.query.workid}`)
          .then(res => {
            this.formItem = res.data.order;
          })
          .catch(error => {
            this.$config.err_notice(this, error)
          });
        this.reloadsql = true
      },
      referOrder () {
        if (this.$route.query.status === 1) {
          let sql = '';
          this.rollData.forEach(item => {
           sql += item.SQL
          });
          this.formItem.SQL = sql;
        }
        delete this.formItem.ID;
        axios.post(`${this.$config.url}/fetch/rollorder`, {
          'data': this.formItem
        })
          .then(() => {
            this.$config.notice('工单已提交成功')
          })
          .catch(error => {
            this.$config.err_notice(this, error)
          })
      }
    },
    mounted () {
      axios.get(`${this.$config.url}/fetch/detail?workid=${this.$route.query.workid}&status=${this.$route.query.status}`)
        .then(res => {
          this.TableDataNew = res.data.record;
          this.dmlorddl = res.data.order.Type;
        })
        .catch(error => {
          this.$config.err_notice(this, error)
        })
    }
  }
</script>
