import React from 'react';
import {Button, Upload, Icon, } from 'antd';
import XLSX  from 'xlsx';

class XLSX2JSON extends React.Component {

  constructor(props){
    super(props);
  }

  renderUpload = () => {
    if(!this.props.isNeedJson) return null
    const props = {
      name: 'file',//发到后台的文件参数名
      accept:'*',
      // action: '//jsonplaceholder.typicode.com/posts/', //上传的地址
      headers: {
        // authorization: 'authorization-text',
      },
      beforeUpload:(info)=>{
          let fileReader = new FileReader();
          fileReader.readAsBinaryString(info)
          fileReader.onload = (e) => {
            let data = e.target.result, workbook = XLSX.read(data,{type:'binary'})
            // console.log(workbook.Sheets);
            // let fromTo = '';
            let json = {};
            for(let sheet in workbook.Sheets) {
              if(workbook.Sheets.hasOwnProperty(sheet)) {
                // fromTo = workbook.Sheets[sheet]['!ref'];
                let d = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                json.sheet = sheet;
                json.data = d;
                this.json = json;
                console.log(this.props)
                if(this.props.getJson)this.props.getJson(this.json);
              }
            }
          }
        //
        // if (info.file.status === 'done') {
        //   message.success(`${info.file.name} file uploaded successfully`);
        // } else if (info.file.status === 'error') {
        //   message.error(`${info.file.name} file upload failed.`);
        // }
        return false
      },
      onChange:(info)=> {

      },
    };
    return (
      <div key={'isNeedJson'}>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> Click to Upload
          </Button>
        </Upload>
      </div>)
  }


  renderExcel = () => {
    if(!this.props.isNeedExcel) return null;
    let json = this.props.json;
    let sheetObj = this.handelExecl(json);
    let wb = {
      SheetNames: ['sheet1'],
      Sheets: {sheet1:sheetObj}
    };
    console.log(wb)

    let excelData = XLSX.write(wb,{bookType:'xlsx',bookSST:false,type:'binary'});
    let blob = new Blob([this.string2ArrayBuffer(excelData)],{type:''});
    console.log(blob)


    // let link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = '数据表1.xls';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);


    return (
      <div key={'isNeedExcel'}>
        <a download = '数据表1.xls' href={URL.createObjectURL(blob)}>down</a>
      </div>
    )
  }

  string2ArrayBuffer = (s) => {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for(let i = 0; i!=s.length; i++) {
      view[i]= s.charCodeAt(i)& 0xFF;
    }
    return buf
  }

  getCharCol = (n) => {
    let temCol = '',
      s = '',
      m = 0
    while (n > 0) {
      m = n % 26 + 1
      s = String.fromCharCode(m + 64) + s
      n = (n - m) / 26
    }
    return s
  }

  handelExecl = (data) => {
    let _headers = Object.keys(data[0]);
    let _data = data;
    let headers = _headers
      .map((v, i) => Object.assign({}, {
          v: v,
          position: i > 25 ? this.getCharCol(i) + 1 : String.fromCharCode(65 + i) + 1
        })
      )// prev  回调的返回值  next是当前的值
      .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
    let data1 = _data
      .map((v, i) => _headers.map((k, j) => Object.assign({}, {
        v: v[k],
        position: j > 25 ? this.getCharCol(j) + (i + 2) : String.fromCharCode(65 + j) + (i + 2)
      })))//
      .reduce((prev, next) => prev.concat(next))
      .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
    let output = Object.assign({}, headers, data1);
    let outputPos = Object.keys(output);
    let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
    return Object.assign({}, output, { '!ref': ref })
  }

  render() {
      return (
        [
          this.renderUpload(),
          this.renderExcel()
        ]
      )
  }
}

export default  XLSX2JSON
