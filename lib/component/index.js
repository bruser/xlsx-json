'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

var _xlsx = require('xlsx');

var _xlsx2 = _interopRequireDefault(_xlsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XLSX2JSON = function (_React$Component) {
  _inherits(XLSX2JSON, _React$Component);

  function XLSX2JSON(props) {
    _classCallCheck(this, XLSX2JSON);

    var _this = _possibleConstructorReturn(this, (XLSX2JSON.__proto__ || Object.getPrototypeOf(XLSX2JSON)).call(this, props));

    _initialiseProps.call(_this);

    return _this;
  }

  _createClass(XLSX2JSON, [{
    key: 'render',
    value: function render() {
      return [this.renderUpload(), this.renderExcel()];
    }
  }]);

  return XLSX2JSON;
}(_react2.default.Component);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.renderUpload = function () {
    if (!_this2.props.isNeedJson) return null;
    var props = {
      name: 'file', //发到后台的文件参数名
      accept: '*',
      // action: '//jsonplaceholder.typicode.com/posts/', //上传的地址
      headers: {
        // authorization: 'authorization-text',
      },
      beforeUpload: function beforeUpload(info) {
        var fileReader = new FileReader();
        fileReader.readAsBinaryString(info);
        fileReader.onload = function (e) {
          var data = e.target.result,
              workbook = _xlsx2.default.read(data, { type: 'binary' });
          // console.log(workbook.Sheets);
          // let fromTo = '';
          var json = {};
          for (var sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              // fromTo = workbook.Sheets[sheet]['!ref'];
              var d = _xlsx2.default.utils.sheet_to_json(workbook.Sheets[sheet]);
              json.sheet = sheet;
              json.data = d;
              _this2.json = json;
              console.log(_this2.props);
              if (_this2.props.getJson) _this2.props.getJson(_this2.json);
            }
          }
        };
        //
        // if (info.file.status === 'done') {
        //   message.success(`${info.file.name} file uploaded successfully`);
        // } else if (info.file.status === 'error') {
        //   message.error(`${info.file.name} file upload failed.`);
        // }
        return false;
      },
      onChange: function onChange(info) {}
    };
    return _react2.default.createElement(
      'div',
      { key: 'isNeedJson' },
      _react2.default.createElement(
        _antd.Upload,
        props,
        _react2.default.createElement(
          _antd.Button,
          null,
          _react2.default.createElement(_antd.Icon, { type: 'upload' }),
          ' Click to Upload'
        )
      )
    );
  };

  this.renderExcel = function () {
    if (!_this2.props.isNeedExcel) return null;
    var json = _this2.props.json;
    var sheetObj = _this2.handelExecl(json);
    var wb = {
      SheetNames: ['sheet1'],
      Sheets: { sheet1: sheetObj }
    };
    console.log(wb);

    var excelData = _xlsx2.default.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
    var blob = new Blob([_this2.string2ArrayBuffer(excelData)], { type: '' });
    console.log(blob);

    // let link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = '数据表1.xls';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);


    return _react2.default.createElement(
      'div',
      { key: 'isNeedExcel' },
      _react2.default.createElement(
        'a',
        { download: '\u6570\u636E\u88681.xls', href: URL.createObjectURL(blob) },
        'down'
      )
    );
  };

  this.string2ArrayBuffer = function (s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  };

  this.getCharCol = function (n) {
    s = '', m = 0;
    while (n > 0) {
      m = n % 26 + 1;
      s = String.fromCharCode(m + 64) + s;
      n = (n - m) / 26;
    }
    return s;
  };

  this.handelExecl = function (data) {
    var _headers = Object.keys(data[0]);
    var _data = data;
    var headers = _headers.map(function (v, i) {
      return Object.assign({}, {
        v: v,
        position: i > 25 ? _this2.getCharCol(i) + 1 : String.fromCharCode(65 + i) + 1
      });
    }) // prev  回调的返回值  next是当前的值
    .reduce(function (prev, next) {
      return Object.assign({}, prev, _defineProperty({}, next.position, { v: next.v }));
    }, {});
    var data1 = _data.map(function (v, i) {
      return _headers.map(function (k, j) {
        return Object.assign({}, {
          v: v[k],
          position: j > 25 ? _this2.getCharCol(j) + (i + 2) : String.fromCharCode(65 + j) + (i + 2)
        });
      });
    }) //
    .reduce(function (prev, next) {
      return prev.concat(next);
    }).reduce(function (prev, next) {
      return Object.assign({}, prev, _defineProperty({}, next.position, { v: next.v }));
    }, {});
    var output = Object.assign({}, headers, data1);
    var outputPos = Object.keys(output);
    var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
    return Object.assign({}, output, { '!ref': ref });
  };
};

exports.default = XLSX2JSON;