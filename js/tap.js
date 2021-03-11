// canvas 容器
var canvas = document.querySelector("canvas");
// canvas 2d对象
var obj = canvas.getContext("2d");
// 线条类别li集合
var shap = $(".shape li");
//----------------data 存放数据对象--------------------
let data = {
    type: 'pen',
    iscut: false,
    arr: [],
    cutflag: '',
    color: 'black',
    linewidth: 1,
    style: '',
    width: 500,
    height: 500,
    x:0,
    y:0,
    w:0,
    h:0,
    lx:0,
    ly:0,
    lw:0,
    lh:0,cutdata:''
}
// ----------------------操作函数-----------------------------
// 选择形状
function selectShape(chart, e) {
    data.type = chart
    if (chart === 'eraser') {
        $('canvas').css("cursor", "url(images/rubber.svg),auto")
    } else {
        $('canvas').css("cursor", "url(images/pencli-black.svg),auto")
    }
    // 移除选中样式
    shap.removeClass("typeactive");
    // 当前选中项添加选中样式
    $(e.target).toggleClass("typeactive");
    // 如果是直线或者曲线
    if (chart == 'line' || chart == 'pen') {
        data.style = "stroke";
        $(".stroke").addClass("styleactive");
        // 填充按钮隐藏
        $(".fill").css({ display: "none" }).removeClass("styleactive");
    } else {
        // 填充按钮显示
        $(".fill").css({ display: "block" });
    }
}
// 默认添加图片背景
function setCanvasImgbgc() {
    var imgDom = document.getElementById('imgDom')
    obj.drawImage(imgDom, 0, 0, 1024, 768);
    $("#imgDom").hide()
}
setCanvasImgbgc()
// 调整画板尺寸
function determine(e) {
    e.stopPropagation()
    canvas.width = data.width = $("#setWidth").val();
    canvas.height = data.height = $("#setHeight").val();
    data.arr = [];
    obj.clearRect(0, 0, data.width, data.height);
    $("#createPal").fadeOut();
}
// 剪切
function shearCut(chart) {
    data.type = chart
    shap.removeClass("typeactive");
    data.iscut = true;
}
// 复制
function copy(chart) {
    data.type = chart;
    shap.removeClass("typeactive");
    data.iscut = false;
}
// 撤销
function revoke() {
    data.arr.pop();
    obj.clearRect(0, 0, data.width, data.height);
    if (data.arr.length > 0) {
        obj.putImageData(arr[arr.length - 1], 0, 0, 0, 0, data.width, data.height);
    }
}
// 清空画板
function clearSketchpad() {
    data.arr = [];
    obj.clearRect(0, 0, data.width, data.height);
}
// 保存
function save() {
    var reg = canvas.toDataURL("image/png");
}
// 下载
function dowonLoad() {
    var imgUrl = canvas.toDataURL("image/png")
    // IE11及以下浏览器保存下载
    if (window.navigator.msSaveOrOpenBlob) {
        var bstr = atob(imgUrl.split(',')[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        var blob = new Blob([u8arr]);
        window.navigator.msSaveOrOpenBlob(blob, 'painting-' + Math.floor(Math.random() * 5 + 1) + '.' + 'png');
    } else {
        // chrome浏览器保存下载
        const a = document.createElement('a');
        a.href = imgUrl;
        a.setAttribute('download', 'painting-' + Math.floor(Math.random() * 5 + 1));
        a.click();
    }
}
// 显示 调整画布尺寸控制面板
function create() {
    $("#createPal").fadeIn();
}
// 取消调整
function createClose(e) {
    e.stopPropagation()
    $("#createPal").fadeOut();
}
// 画笔颜色选择,鼠标样式修改
function colorSelect(e) {
    data.color = e.target.getAttribute("value")
    $(e.target).css("border", "1px solid #ccc").siblings('li').css("border", "none")
    // 修改画笔svg
    switch (e.target.getAttribute("value")) {
        case 'black': $('canvas').css("cursor", "url(images/pencli-black.svg),auto"); break;
        case 'yellow': $('canvas').css("cursor", "url(images/pencli-yellow.svg),auto"); break;
        case 'blue': $('canvas').css("cursor", "url(images/pencli-blue.svg),auto"); break;
        case 'red': $('canvas').css("cursor", "url(images/pencli-red.svg),auto"); break;
        case 'green': $('canvas').css("cursor", "url(images/pencli-green.svg),auto"); break;
    }
}
// 线条宽度
function selectLineWidth(e) {
    data.linewidth = e.target.value
}
// canvas内按下鼠标
canvas.onmousedown = function (e) {
    data.x = e.offsetX;
    data.y = e.offsetY;
    if (data.type == "pen") {
        obj.beginPath();
        obj.moveTo(data.x, data.y);
    }
    if (data.type == "eraser") {
        obj.clearRect(data.x - 5, data.y - 5, 10, 10);
    }
    if (data.cutflag && data.type == "cut") {
        if (data.arr.length != 0) {
            data.arr.splice(-1, 1);
        }
    }

    var draw = new Draw(obj, { type: data.type, color: data.color, width: data.linewidth });//实例化构造函数
    // 鼠标指针移动到canvas上
    canvas.onmousemove = function (e) {
        data.w = e.offsetX;
        data.h = e.offsetY;
        if (data.type != "eraser") {
            // 检测图像是否存在
            if (imgDom) {
            } else {
                obj.clearRect(0, 0, data.width, data.height);
            }
            if (data.arr.length != 0) {
                obj.putImageData(data.arr[data.arr.length - 1], 0, 0, 0, 0, data.width, data.height);
            }
        }
        if (data.cutflag && data.type == "cut") {
            if (data.iscut) {
                obj.clearRect(data.lx, data.ly, data.lw - data.lx, data.lh - data.ly);
            }
            var nx = data.lx + (data.w - data.x);
            var ny = data.ly + (data.h - data.y);
            obj.putImageData(cutdata, nx, ny);
        } else if (data.type == "poly") {
            draw[type](data.x, data.y, data.w, data.h, data.n);
        } else {
            draw[data.type](data.x, data.y, data.w, data.h);
        }
    }
    // 鼠标按键松开
    document.onmouseup = function () {
        canvas.onmousemove = null;
        document.onmouseup = null;
        if (data.type == "cut") {
            if (!cutflag) {
                data.cutflag = true;
                cutdata = obj.getImageData(data.x + 1, data.y + 1, data.w - data.x - 2, data.h - data.y - 2);
                data.lx = data.x; data.ly = data.y; data.lw = data.w; data.lh = data.h;
                container.css({ display: "none" });
            } else {
                data.cutflag = false;
                container.css({ display: "block" });
            }
        }
        data.arr.push(obj.getImageData(0, 0, data.width, data.height));
    }
}
