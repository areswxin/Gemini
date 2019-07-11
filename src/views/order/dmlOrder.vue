<style lang="less">
  @import "../../styles/common.less";
  @import "../../styles/table.less";
</style>

<template>
  <div>
    <Row>
      <Col span="7">
        <Card>
          <p slot="title">
            <Icon type="ios-redo"></Icon>
            选择数据库
          </p>
          <div class="edittable-test-con">
            <div id="showImage" class="margin-bottom-10">
              <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="环境:" prop="idc">
                  <Select v-model="formItem.idc" @on-change="fetchSource">
                    <Option v-for="i in fetchData.idc" :key="i" :value="i">{{i}}</Option>
                  </Select>
                </FormItem>

                <FormItem label="连接名:" prop="source">
                  <Select v-model="formItem.source" @on-change="fetchBase">
                    <Option
                      v-for="i in fetchData.source"
                      :value="i"
                      :key="i"
                    >{{ i }}
                    </Option>
                  </Select>
                </FormItem>

                <FormItem label="库名:" prop="database">
                  <Select v-model="formItem.database" placeholder="请选择">
                    <Option v-for="item in fetchData.base" :value="item" :key="item">{{item}}</Option>
                  </Select>
                </FormItem>

                <FormItem label="工单说明:" prop="text">
                  <Input v-model="formItem.text" placeholder="请输入" type="textarea" :rows=4></Input>
                </FormItem>

                <FormItem label="审核人:" prop="assigned">
                  <Select v-model="formItem.assigned" filterable>
                    <Option v-for="i in fetchData.assigned" :value="i" :key="i">{{i}}</Option>
                  </Select>
                </FormItem>

                <FormItem label="是否备份" required>
                  <RadioGroup v-model="formItem.backup">
                    <Radio :label=1>是</Radio>
                    <Radio :label=0>否</Radio>
                  </RadioGroup>
                </FormItem>

                <FormItem label="定时执行">
                  <DatePicker format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择时间点" :options="invalidDate"
                              v-model="formItem.delay" @on-change="formItem.delay=$event"
                              :editable="false"></DatePicker>
                </FormItem>
              </Form>
              <Form>
                <FormItem>
                  <Col span="7">
                    <Button
                      type="error"
                      icon="md-trash"
                      @click.native="clearForm()"
                    >清除
                    </Button>
                  </Col>
                  <Col span="7" offset="1">
                    <Button type="primary" icon="md-search" @click.native="testSql()" :loading="loading">检测
                    </Button>
                  </Col>
                  <Col span="7" offset="1">
                    <Button
                      type="success"
                      icon="ios-redo"
                      @click.native="commitOrder()"
                      :disabled="this.validate_gen"
                    >提交
                    </Button>
                  </Col>

                </FormItem>
              </Form>

              <Alert>检测表字段提示信息
                <template slot="desc">
                  <p>1.错误等级 0正常,其他均为有问题。</p>
                  <p>2.阶段状态 审核成功</p>
                  <p>3.错误信息 用来表示错误信息</p>
                  <p>4.当前检查的sql</p>
                  <p>注:只有错误等级等于0时提交按钮才会激活</p>
                </template>
              </Alert>
            </div>
          </div>
        </Card>
      </Col>
      <Col span="17" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="ios-crop"></Icon>
            填写sql语句
          </p>
          <editor v-model="formItem.textarea" @init="editorInit" @setCompletions="setCompletions"></editor>
          <br>
          <br>
          <Table :columns="testColumns" :data="Testresults" highlight-row></Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
  import axios from 'axios'
  import editor from '../../components/editor'
  export default {
    components: {
      editor:  editor
    },
    name: 'SQLsyntax',
    data () {
      return {
        invalidDate: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000
          }
        },
        validate_gen: true,
        formItem: {
          text: '',
          idc: '',
          source: '',
          database: '',
          table: '',
          backup: 0,
          assigned: '',
          delay: null,
          textarea: ''
        },
        testColumns: [
          {
            title: '阶段',
            key: 'Status',
            width: '150'
          },
          {
            title: '错误等级',
            key: 'Level',
            width: '100'
          },
          {
            title: '错误信息',
            key: 'Error',
            tooltip: true
          },
          {
            title: '当前检查的sql',
            key: 'SQL',
            tooltip: true
          },
          {
            title: '影响行数',
            key: 'AffectRows',
            width: '120'
          }
        ],
        Testresults: [],
        item: {},
        ruleValidate: {
          idc: [{
            required: true,
            message: '环境地址不得为空',
            trigger: 'change'
          }],
          source: [{
            required: true,
            message: '连接名不得为空',
            trigger: 'change'
          }],
          database: [{
            required: true,
            message: '数据库名不得为空',
            trigger: 'change'
          }],
          text: [{
            required: true,
            message: '说明不得为空',
            trigger: 'blur'
          }
          ],
          assigned: [{
            required: true,
            message: '审核人不得为空',
            trigger: 'change'
          }]
        },
        id: null,
        assigned: [],
        wordList: [],
        loading: false,
        fetchData: {
          idc: [],
          source: [],
          base: [],
          table: [],
          assigned: []
        }
      }
    },
    methods: {
      setCompletions (editor, session, pos, prefix, callback) {
        callback(null, this.wordList.map(function (word) {
          return {
            caption: word.vl,
            value: word.vl,
            meta: word.meta
          }
        }))
      },
      editorInit: function () {
        require('brace/mode/mysql')
        require('brace/theme/xcode')
      },
      clearForm () {
        this.formItem = this.$config.clearObj(this.formItem)
      },
      fetchIDC () {
        axios.get(`${this.$config.url}/fetch/idc`)
          .then(res => {
            this.fetchData.idc = res.data;
          })
          .catch(error => {
            this.$config.err_notice(this, error)
          })
      },
      fetchSource (idc) {
        if (idc) {
          axios.get(`${this.$config.url}/fetch/source/${idc}/dml`)
            .then(res => {
              if (res.data.x === 'dml') {
                this.fetchData.source = res.data.source;
                this.fetchData.assigned = res.data.assigned
              } else {
                this.$config.notice('非法劫持参数！')
              }
            })
            .catch(error => {
              this.$config.err_notice(this, error)
            })
        }
      },
      fetchBase (source) {
        if (source) {
          axios.get(`${this.$config.url}/fetch/base/${source}`)
            .then(res => {
              this.fetchData.base = res.data;
            })
            .catch(error => {
              this.$config.err_notice(this, error)
            })
        }
      },
      testSql () {
        this.$refs['formItem'].validate((valid) => {
          if (valid) {
            this.loading = true;
            axios.put(`${this.$config.url}/fetch/test`, {
              'source': this.formItem.source,
              'database': this.formItem.database,
              'sql': this.formItem.textarea,
              'isDMl': true
            })
              .then(res => {
                this.Testresults = res.data;
                let gen = 0;
                this.Testresults.forEach(vl => {
                  if (vl.Level !== 0) {
                    gen += 1
                  }
                });
                if (gen === 0) {
                  this.validate_gen = false
                } else {
                  this.validate_gen = true
                }
                this.loading = false
              })
              .catch(err => {
                this.loading = false;
                this.$config.err_notice(err)
              })
          } else {
            this.$Message.error('请填写具体地址或sql语句后再测试!')
          }
        })
      },
      commitOrder () {
        this.$refs['formItem'].validate((valid) => {
          if (valid) {
            axios.post(`${this.$config.url}/sql/refer`, {
              'ddl': this.formItem,
              'sql': this.formItem.textarea,
              'ty': 1
            })
              .then(res => {
                this.validate_gen = true;
                this.$Notice.success({
                  title: '成功',
                  desc: res.data
                })
              })
              .catch(error => {
                this.validate_gen = true;
                this.$config.err_notice(this, error)
              })
          }
        })
      }
    },
    mounted () {
      this.fetchIDC();
      for (let i of this.$config.highlight.split('|')) {
        this.wordList.push({'vl': i, 'meta': '关键字'})
      }
    }
  }
</script>
