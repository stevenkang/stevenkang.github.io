// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function click(e) {
  chrome.tabs.executeScript(null,
      {code:"document.body.style.backgroundColor='" + e.target.id + "'"});
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
	chrome.tabs.executeScript(null,
      {code:`
      	document.querySelectorAll('table').forEach(item => {
      		item.onclick = e => {
      			if (confirm("你确定导出为Excel吗？")) {
      			  var link = document.createElement("a");
				      // 使用outerHTML属性获取整个table元素的HTML代码（包括<table>标签），然后包装成一个完整的HTML文档，设置charset为urf-8以防止中文乱码
    			    var html = "<html><head><meta charset='utf-8' /></head><body>" + item.outerHTML + "</body></html>";
    			    // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
    			    var blob = new Blob([html], { type: "application/vnd.ms-excel" });
    			    // 利用URL.createObjectURL()方法为a元素生成blob URL
    			    link.href = window.URL.createObjectURL(blob);
    			    link.download = "TableToExcel.xls";
    			    document.body.appendChild(link);
    			    link.click();
    			    document.body.removeChild(link);
    			    window.URL.revokeObjectURL(link.href);
    			  }
      		}
      	})
      `});
  

});

