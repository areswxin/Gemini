<template>
  <div>
    <editor v-model="formItem.textarea" @init="editorInit" @setCompletions="setCompletions"></editor>
    <br>
    <p>当前选择的库: {{dataBase}}</p>
    <br>
    <Button type="warning" icon="md-trash" @click.native="clearObj()">清除</Button>
    <Button type="success" icon="ios-redo" @click.native="querySQL()">查询</Button>
    <Button
      type="primary"
      icon="ios-cloud-download"
      @click.native="exportdata()"
      v-if="export_data"
    >导出查询数据
    </Button>
    <br>
    <br>
    <p>查询结果:</p>
    <Table :columns="columnsName" :data="queryRes" highlight-row ref="table"></Table>
    <br>
    <Page :total="total" show-total @on-change="splice_arr" ref="total"></Page>
  </div>
</template>

<script>
  import axios from 'axios'
  import Csv from 'iview/src/utils/csv'
  import ExportCsv from 'iview/src/components/table/export-csv'
  import editor from './editor'
  const exportcsv = function exportCsv (params) {
    if (params.filename) {
      if (params.filename.indexOf('.csv') === -1) {
        params.filename += '.csv'
      }
    } else {
      params.filename = 'table.csv'
    }

    let columns = []
    let datas = []
    if (params.columns && params.data) {
      columns = params.columns
      datas = params.data
    } else {
      columns = this.columns
      if (!('original' in params)) params.original = true
      datas = params.original ? this.data : this.rebuildData
    }

    let noHeader = false
    if ('noHeader' in params) noHeader = params.noHeader
    const data = Csv(columns, datas, params, noHeader)
    if (params.callback) {
      params.callback(data)
    } else {
      ExportCsv.download(params.filename, data)
    }
  }

  export default {
    name: 'tabQuery',
    components: {
      editor: editor
    },
    props: {
      wordList: Array,
      export_data: Boolean,
      dataBase: String
    },
    data () {
      return {
        columnsName: [],
        queryRes: [],
        allQueryData: [],
        total: 0,
        formItem: {
          textarea: ''
        }
      }
    },
    methods: {
      exportdata () {
        exportcsv({
          filename: 'Yearning_Data',
          original: true,
          data: this.allQueryData,
          columns: this.columnsName
        })
      },
      editorInit: function () {
        require('brace/mode/mysql')
        require('brace/theme/xcode')
      },
      splice_arr (page) {
        this.queryRes = this.allQueryData.slice(page * 10 - 10, page * 10)
      },
      clearObj () {
        this.formItem.textarea = '';
        this.queryRes = [];
        this.columnsName = [];
        this.$refs.total.currentPage = 1;
        this.total = 0
      },
      setCompletions (editor, session, pos, prefix, callback) {
        callback(null, this.wordList.map(function (word) {
          return {
            caption: word.vl,
            value: word.vl,
            meta: word.meta
          }
        }))
      },
      querySQL () {
        this.$Spin.show({
          render: (h) => {
            return h('div', [
              h('Icon', {
                props: {
                  size: 30,
                  type: 'ios-loading'
                },
                style: {
                  animation: 'ani-demo-spin 1s linear infinite'
                }
              }),
              h('div', '正在查询,请稍后........')
            ])
          }
        });
        axios.post(`${this.$config.url}/query`, {
          'sql': this.formItem.textarea,
          'basename': this.dataBase
        })
          .then(res => {
            if (res.data.data === null) {
              this.$config.err_notice(this, '没有查询结果!')
            } else if (!res.data['data']) {
              this.$config.err_notice(this, res.data)
            } else {
              this.columnsName = res.data['title']
              this.allQueryData = res.data['data']
              this.queryRes = this.allQueryData.slice(0, 10)
              this.total = res.data['data'].length
            }
            this.$Spin.hide()
          })
          .catch(err => {
            this.$config.err_notice(this, err)
            this.$Spin.hide()
          })
      }
    }
  }
</script>

<style scoped>

</style>
