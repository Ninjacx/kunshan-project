import XLSX from "xlsx-style"  //ps  需要修改源码：在\node_modules\xlsx-style\dist\cpexcel.js 807行 的 var cpt = require(’./cpt’ + ‘able’); 改成 var cpt = cptable 不然会报错;

handleDownClick(){
      // 模拟数据
      var data = [
        {'时间':'2020-01-12','新注册人数':'12','在线人数':'12','累计用户数':'12'},
        {'时间':'2020-01-12','新注册人数':'12','在线人数':'12','累计用户数':'13'},
        {'时间':'2020-01-12','新注册人数':'12','在线人数':'12','累计用户数':'14'},
        {'时间':'2020-01-12','新注册人数':'12','在线人数':'12','累计用户数':'15'},
      ];
      //表格标题
      var dataTitle = '用户统计2020-01-10-2020-01-12';
      // 配置文件类型
        const wopts = { bookType: 'xlsx', bookSST: true, type: 'binary', cellStyles: true };
        this.downloadExl(data, wopts, dataTitle)
    },
    // 下载功能
     saveAs(obj, fileName) {
          var tmpa = document.createElement("a");
          tmpa.download = fileName || "未命名";
          // 兼容ie 
          if ("msSaveOrOpenBlob" in navigator) {
            window.navigator.msSaveOrOpenBlob(obj, "下载的文件名"+ ".xlsx");
          } else {
            tmpa.href = URL.createObjectURL(obj);
          }
          tmpa.click();
          setTimeout(function() {
            URL.revokeObjectURL(obj);
          }, 100);
    },
      
    downloadExl(json, type, dataTitle) {
        var tmpdata = json[0];
        json.unshift({});
        var keyMap = []; //获取keys
        for (var k in tmpdata) {
            keyMap.push(k);
            json[0][k] = k;
        }
        var tmpdata = [];//用来保存转换好的json 
        json.map((v, i) => {
          let data = keyMap.map((k, j) => {
            // console.log(k,this.getCharCol(j));
            return Object.assign({}, {
              v: v[k],
              position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 2)
            });
          });
        return data;

        }).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
            v: v.v
        });
        var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
        tmpdata["A1"] = {v:dataTitle};
        outputPos = ["A1"].concat(outputPos);
        tmpdata["A1"].s = { font: { sz: 14, bold: true, vertAlign:true }, alignment:{ vertical:"center", horizontal:"center" }, fill: { bgColor: { rgb: "E8E8E8"}, fgColor: { rgb: "E8E8E8" } } };//<====设置xlsx单元格样式
        tmpdata["!merges"] = [{
            s: { c: 0, r: 0 },
            e: { c: 3, r: 0 }
        }];//<====合并单元格 

        tmpdata["!cols"] = [
          {wpx: 300},
          {wpx: 300},
          {wpx: 300},
          {wpx: 300}
        ];//<====设置一列宽度 
        
        var tmpWB = {
            SheetNames: ['mySheet'], //保存的表标题
            Sheets: {
              'mySheet': Object.assign({},
              tmpdata, //内容
              {
                '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
              }
              )
            }
        };
        var tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
            { bookType: (type == undefined ? 'xlsx' : type.bookType), bookSST: false, type: 'binary' }//这里的数据是用来定义导出的格式类型
        ))], {
                type: ""
            });
        this.saveAs(tmpDown, "下载的文件名" + '.' + (type.bookType == "biff2" ? "xls" : type.bookType));
    },
    // 获取26个英文字母用来表示excel的列
    getCharCol(n) {
        let temCol = '',
            s = '',
            m = 0
        while (n > 0) {
            m = n % 26 + 1
            s = String.fromCharCode(m + 64) + s
            n = (n - m) / 26
        }
        return s
    },
    s2ab(s) {
        if (typeof ArrayBuffer !== 'undefined') {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        } else {
            var buf = new Array(s.length);
            for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
    },