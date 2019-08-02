## title

> 基于xlsx antd的react组件，用于导出表格，或者传入表格解析json


## code useage

> ``` npm i 'xlsx-jsons' ```

> ``` import {XLSX2JSON} from 'xlsx-jsons'; ```

> ``` <XLSX2JSON isNeedExcel={true} json={[{a:1,b:2}]} / > ```

> ``` <XLSX2JSON isNeedJson={true} getJson={(json)=>{console.log(json)}} /> ```


## useage


> isNeedJson:bool  是否是上传表格导出json, 

> getJson:func 上传表格后的返回json的回调函数,

> isNeedExcel:bool 是否要导出表格,

> json：需要导成表格的js对象,



## introduce

> 目前只支持react版本，后续更新支持vue版本

