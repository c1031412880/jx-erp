//.............高德地图JS操作开始..................

var mapRealTime; //唯一的全局对象，其他数据都作为这个全局对象的属性来使用，动态性比较强，需要了解这个JS地图类库的作用！
function judgeSuccLoad() {
    //if (!mapRealTime.loadsucc)//默认没有这个数据，所以就是false
    //{
    //    alert('加载地图失败');
    //}
    if (mapRealTime.timerOutFlag == 2)//说明目前还没有加载成功，那么弹窗提示失败
    {
        mapRealTime.timerOutFlag = 1;
        alert('加载地图失败');
    }
    if (mapRealTime.loadTimer) {
        clearTimeout(mapRealTime.loadTimer);
        delete mapRealTime.loadTimer;
    }
}
export function initMap(el, interMap)   ////初始化地图对象，加载地图
{
    try {
        mapRealTime = new AMap.Map(el,
            {
                resizeEnable: true
            });
        mapRealTime.interMap = interMap;
        mapRealTime.timerOutFlag = 2; //加载地图是否超时的引用计数
        //mapRealTime.loadTimer = setInterval("judgeSuccLoad()", 20000);
        //实例化地图类型插件
        mapRealTime.plugin(["AMap.MapType"], function () {
            //地图类型切换
            var type = new AMap.MapType(
                {
                    defaultType: 0  //1：使用3D地图  0：2D地图（默认）
                });
            mapRealTime.addControl(type);
            mapRealTime["NormalLayer"] = type;
        });
        mapRealTime["currLayer"] = mapRealTime["NormalLayer"];

        //实例化3D楼块图层
        var buildings = new AMap.Buildings();
        mapRealTime["buildings"] = buildings;
        //加载鹰眼、比例尺、工具条插件  
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView'],
            function () {
                mapRealTime.addControl(new AMap.ToolBar());

                mapRealTime.addControl(new AMap.Scale());

                mapRealTime.addControl(new AMap.OverView({ isOpen: true }));
            });

        mapRealTime.currentDraw = ''; //当前正在画的东西：是代表测距（画的是线条）？还是代表区域查车（画的是矩形），在画之前（即winform调用JS方法之前会给这个对象赋值！）
        mapRealTime.plugin(["AMap.MouseTool"], function () {
            var mousetool = new AMap.MouseTool(mapRealTime);
            mapRealTime.addControl(mousetool);
            mapRealTime["mousetool"] = mousetool;
            AMap.event.addListener(mousetool, 'draw', function (e)  //参数是{type,obj}    type:draw
            {
                mousetooldraw(e); //鼠标工具操作完之后！
            });
        });

        //加载悬浮窗
        var infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(5, 0) }); //, isCustom: true, autoMove: true, showShadow: true });
        mapRealTime["infoWindow"] = infoWindow;

        //地图对象：所有站点、所有车辆、所有线路、所有参数设置。
        mapRealTime.drawSites = {};
        mapRealTime.drawVehs = {};
        mapRealTime.drawLines = {}; //定义所有线条的字面量对象！画线的时候，所有线条都在这个对象里！
        mapRealTime.drawRoadMarkers = {}; //定义所有路况标注线条的字面量对象！
        mapRealTime.options = {
            ShowVehicleCode: true,
            Alpha: 1,
            DrawTrackMode: 3,//历史轨迹查询模式：先画出轨迹，然后正常播放
        }; //地图参数设置！
        reSetBound(); //地图坐标可视范围！用于在画车辆的时候，考虑到策略，某些不在可视范围内的车辆不必画出来！
        mapRealTime.mousewheel = '1';
        //加载点聚合插件
        addCluster();

        //事件绑定
        AMap.event.addListener(mapRealTime, 'click', function (e)   //点击事件：配合添加站点使用！
        {
            try {
                setMouseWheeling('1', true);
                var x = e.lnglat.getLng();
                var y = e.lnglat.getLat();
                var ret = [x, y];
                if (mapRealTime.currentDraw === 'AddStation' || mapRealTime.currentDraw === 'EditStationPoint' || mapRealTime.currentDraw === 'EditAnchorPoint') {
                    interWinform(ret, mapRealTime.currentDraw);
                    //var mousetool = mapRealTime["mousetool"];
                    //mousetool.close(true);
                }

                else if (mapRealTime.currentDraw === 'AddRegion' || mapRealTime.currentDraw === 'AddNoOperLine' || mapRealTime.currentDraw === 'RoadMarker') {
                    if (!mapRealTime.regionArr)//创建画区域的坐标数组。用这个来保存所有画出的区域的坐标点
                    {
                        mapRealTime.regionArr = [];
                    }
                    mapRealTime.regionArr.push(ret);
                }
                else//这里还可以做进一步的细致判断操作类型，但是这里只是单纯针对历史轨迹的点击：查找轨迹点
                {
                    getNearestPoint(e);
                }
            }
            catch (ex) {
                showError("地图单击事件", ex);
            }
        });
        AMap.event.addListener(mapRealTime, 'dblclick', function (e)    //鼠标双击，获取经纬度坐标  
        {
            try {
                setMouseWheeling('1', true);
                var x = e.lnglat.getLng();
                var y = e.lnglat.getLat();
                var ret = [x, y];
                if (mapRealTime.currentDraw === 'AddRegion' || mapRealTime.currentDraw === 'AddNoOperLine' || mapRealTime.currentDraw === 'RoadMarker')//这个时候应该在绘制结束的事件里去获取绘制区域的坐标数据，所以这里不作处理
                {
                    if (mapRealTime.regionArr)//用户可能会用双击事件来结束画区域的操作，也可能通过右键单击事件结束画区域的操作
                    {
                        interWinform(mapRealTime.regionArr, mapRealTime.currentDraw);
                        delete mapRealTime.regionArr;

                        var mousetool = mapRealTime["mousetool"];
                        mousetool.close(true);
                    }
                }
                else if (mapRealTime.currentDraw === 'NO' || mapRealTime.currentDraw === '') {
                    interWinform(ret, "mouseDoubleClick"); //mouseDoubleClick(ret);
                }
            }
            catch (ex) {
                showError("地图双击事件", ex);
            }
        });
        //以下几个事件都是跟地图可见区域有关的
        AMap.event.addListener(mapRealTime, 'mousemove', function (e)    //地图平移后触发
        {
            checkRoadMarkerValid(e);
        });
        AMap.event.addListener(mapRealTime, 'moveend', function ()    //地图平移结束后触发
        {
            setMouseWheeling('1', true);
            reSetBound(); //alert(mapRealTime.bound.toString() + "moveend");
            RedrawRequireVeh();
        });
        AMap.event.addListener(mapRealTime, 'resize', function ()    //地图容器大小改变事件
        {
            reSetBound();  //alert(mapRealTime.bound.toString() + "resize");
            RedrawRequireVeh();
        });
        AMap.event.addListener(mapRealTime, 'zoomchange', function ()    //地图缩放级别更改后触发
        {
            reSetBound(); //alert("zoomchange");
            RedrawRequireVeh();
            showOrHideDomByClass();
        });
        AMap.event.addListener(mapRealTime, 'complete', function () {
            mapRealTime.timerOutFlag = 0; //说明已经成功加载地图，设置flag数据
            //mapRealTime.loadsucc = true;
            reSetBound(); //alert(mapRealTime.bound.toString() + "complete");
            try {
                interWinform("", "LoadMapComplete");
                window.onmousewheel = document.onmousewheel = scrollFunc;//IE/Opera/Chrome/Safari 鼠标中键滑动的事件，为了在历史地图里
            }
            catch (ex) {
                showError("LoadMapComplete", ex);
            }
        }); //初始化完成事件
    }
    catch (ex) {
        alert('地图载入失败，请检查网络，或重新登录');
        //showError("initMap", ex);
    }
}
function scrollFunc(e) {
    if (mapRealTime.mousewheel == "0")//当该地图不处于可以缩放的情况下
    {
        /*判断滚轮向上或向下在浏览器中也要考虑兼容性，
        现在五大浏览器（IE、Opera、 Safari、Firefox、Chrome）中Firefox 使用detail；其余四类使用wheelDelta；
        两者只在取值上不一致，代表含义一致，
        detail与wheelDelta只各取两个 值，detail只取±3，wheelDelta只取±120，
        其中正数表示为向上，负数表示向下。 */
        var direct = 0;
        e = e || window.event || '1';
        var param = '1';//1代表向上，0代表向下
        if (e.wheelDelta)//IE/Opera/Chrome 
        {
            if (e.wheelDelta < 0) {
                param = '0';
            }
        }
        else if (e.detail)//Firefox 
        {
            if (e.detail < 0) {
                param = '0';
            }
        }
        interWinform(param, 'scrollFunc');
    }
}
function searchPOI() {
    //var divmyPageTop = document.getElementById("myPageTop");
    //if (divmyPageTop)
    //{
    //    divmyPageTop.style.display = '';//显示查询框
    //}
    //city: '全国',
    //AMap.plugin('AMap.Autocomplete', function ()
    //{
    //    // 实例化Autocomplete
    //    var autoOptions = {
    //        // input 为绑定输入提示功能的input的DOM ID
    //        input: 'tipinput'
    //    }
    //    var autoComplete = new AMap.Autocomplete(autoOptions);
    //    // 无需再手动执行search方法，autoComplete会根据传入input对应的DOM动态触发search
    //})
    //查询地址POI服务
    //输入提示
    //var autoOptions = {
    //    input: "tipinput"
    //};
    //var auto = new AMap.Autocomplete(autoOptions);
    //var placeSearch = new AMap.PlaceSearch({
    //    map: mapRealTime
    //});  //构造地点查询类
    //placeSearch.setCityLimit(true);
    //AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
    //AMap.event.addListener(auto, "select", function (e)
    //{
    //    placeSearch.setCity(e.poi.adcode);
    //    placeSearch.search(e.poi.name);  //关键字查询查询
    //    //placeSearch.search(keywords, function (status, result)
    //    //{
    //    //    alert("result : " + result);
    //    //    // 搜索成功时，result即是对应的匹配数据
    //    //    //var node = new PrettyJSON.view.Node({
    //    //    //    el: document.querySelector("#input-info"),
    //    //    //    data: result
    //    //    //});
    //    //});
    //    //placeSearch.clear();
    //});
    //mapRealTime.placeSearch = placeSearch;
}
function select(e) {
    //var placeSearch = mapRealTime.placeSearch;
    //placeSearch.setCity(e.poi.adcode);
    //placeSearch.search(e.poi.name);  //关键字查询查询
    //placeSearch.search(keywords, function (status, result)
    //{
    //    //alert("result : " + result);
    //    // 搜索成功时，result即是对应的匹配数据
    //    //var node = new PrettyJSON.view.Node({
    //    //    el: document.querySelector("#input-info"),
    //    //    data: result
    //    //});
    //});
}
function reSetBound() {
    mapRealTime.bound = getBounds();  //alert(mapRealTime.bound.toString() + "reSetBound");
}
function setMapStyle(colorType) {
    if (colorType == "1") {
        //mapRealTime.setMapStyle('amap://styles/normal');
    }
    else if (colorType == "2") {
        //IE内核下：这里必须调用两次才可以切换到夜景模式，调用一次是不行的
        //Chrome内核下，调用一次即可，但是容易出现内存不足的异常
        mapRealTime.setMapStyle("blue_night");//('amap://styles/blue');
        mapRealTime.setMapStyle("blue_night");//('amap://styles/blue');
    }

}
//根据C#端传来的颜色RGB字符串，计算出对应的颜色值 '#000000'这样的格式
function getRgb(strColor) {
    try {
        var rgbArr = strColor.split(',');
        var sRgb = "RGB(" + rgbArr[0] + ", " + rgbArr[1] + ", " + rgbArr[2] + ")";
        var lineColor = sRgb.colorHex();
        return lineColor;
    }
    catch (ex) {
        showError("getRgb", ex);
    }
}
//地图部分函数
function mouseToolOperate(obj) {
    try {
        var strJson = strToJson(obj);
        var type = strJson.type;
        var preDraw = mapRealTime.currentDraw; //先保存之前的操作类型：如果是测距的话，就不用删除地图上的测距线了，否则没有结果显示！当然可以通过类似老系统弹窗，但这里选择和老系统不同！
        mapRealTime.currentDraw = type;
        var mousetool = mapRealTime["mousetool"];
        switch (type) {
            case 'Location':
                mousetool.rule(); //测距
                break;
            case 'AddAcnchor':
                {
                    //start这是画线的时候给出的线条颜色
                    var color;
                    var strColor = strJson.color;
                    if (strColor) {
                        color = getRgb(strColor);
                    }
                    //end
                    if (!color) {
                        color = "#0000FF";//如果没有给出一个数据，那么默认给这个颜色
                    }
                    mousetool.polyline({ strokeColor: color }); //添加锚点
                }
                break;
            case 'AddRegion': //添加区域【需要和“左键双击事件”与“右键单击事件”配合使用】，在操作的时候和“添加锚点”实际上是一样的，操作完成后对于最终的坐标结果，在C#那里的处理也是类似的
            case 'AddNoOperLine':
            case 'RoadMarker':
                mousetool.polyline();
                break;

            case 'AddStation':
            case 'EditStationPoint':
            case 'EditAnchorPoint':
                //alert(type);这里要配合单击事件！单击地图一下就是画了一个站点了！根据单击事件获取的坐标数据来决定所添加的站点的位置！
                //mousetool.marker();
                break;
            case 'RegionSeeVeh':
                mousetool.rectangle(); //区域查车
                break;
            case 'HisRegionVeh':
                mousetool.rectangle(); //车辆途经区域
                break;
            case 'NO':
                if (preDraw === 'Location') {
                    mousetool.close(false); //不删除之前的临时图元（也就是测距线）
                }
                else {
                    mousetool.close(true); //删除之前的临时图元
                }
                break;
        }
    }
    catch (ex) {
        showError("mouseToolOperate", ex);
    }
}
//鼠标操作结束后
function mousetooldraw(e) {
    try {
        //alert(e.type);
        var eObject = e.obj; //obj属性就是鼠标事件完成所绘制的覆盖物对象。

        switch (mapRealTime.currentDraw) {
            case 'Location':
                interWinform(eObject, mapRealTime.currentDraw); //测距
                break;
            case 'AddAcnchor':   //添加锚点
                interWinform(eObject.getPath(), mapRealTime.currentDraw);
                break;
            case 'AddRegion': //添加区域【需要和“左键双击事件”与“右键单击事件”配合使用】
            case 'AddNoOperLine':
            case 'RoadMarker':
                if (eObject) {
                    interWinform(eObject.getPath(), mapRealTime.currentDraw);
                }
                break;
            case 'AddStation':
            case 'EditStationPoint':
            case 'EditAnchorPoint':
                //interWinform(eObject.getPath(), mapRealTime.currentDraw);
                break;
            case 'RegionSeeVeh': //区域查车
                //mapRealTime.remove(eObject);
                interWinform(eObject, mapRealTime.currentDraw);
                break;
            case 'HisRegionVeh': //车辆途经区域
                interWinform(eObject, mapRealTime.currentDraw);
                break;
        }
    }
    catch (ex) {
        showError("mousetooldraw", ex);
    }
}
//添加正常图层
function createNormal() {
    try {
        if (mapRealTime["Traffic"]) {
            mapRealTime["Traffic"].setMap(null);
        }
        if (mapRealTime["buildings"]) {
            mapRealTime["buildings"].setMap(null);
        }
        mapRealTime["currLayer"] = mapRealTime["NormalLayer"];
    }
    catch (ex) {
        showError("createNormal", ex);
    }
}
//添加3D楼层buildings图层
function createBuilder() {
    try {
        if (mapRealTime["currLayer"] === mapRealTime["buildings"]) {
            var currZoom = getZoom(); //如果当前的缩放比例还没有达到17，那么就设置其为17
            if (currZoom < 17) {
                setZoom(17); //3D图层对地图的缩放比例值要求：至少17
            }
            return;
        }
        //隐藏实时交通路况Traffic图层
        if (mapRealTime["Traffic"]) {
            mapRealTime["Traffic"].setMap(null);
        }
        if (mapRealTime["buildings"]) {
            var currZoom = getZoom(); //如果当前的缩放比例还没有达到17，那么就设置其为17
            if (currZoom < 17) {
                setZoom(17); //3D图层对地图的缩放比例值要求：至少17
            }

            mapRealTime["buildings"].setMap(mapRealTime);
            mapRealTime["currLayer"] = mapRealTime["buildings"];
        }
    }
    catch (ex) {
        showError("createBuilder", ex);
    }
}
// 添加点聚合
function addCluster() {
    try {
        if (!mapRealTime.options.FoldingVehicles) {
            clearCluster(); //先清除插件！
            return;
        }
        var markers = clearCluster();
        mapRealTime.plugin(["AMap.MarkerClusterer"], function () {
            var sts = [];
            var header = "trImage/markerCluster"; //"trImage/VehNum/";
            var end = ".png";
            var pngsize = new AMap.Size(32, 32);
            var pngoffset = new AMap.Pixel(-16, -16);
            var pngurl = header + end;
            var item = {
                url: pngurl,
                size: pngsize,
                offset: pngoffset,
                textColor: '#F5F5F5',
                textSize: 10
            };
            sts.push(item);

            //var sts = [{
            //    url: "http://a.amap.com/lbs/static/img/1102-1.png",
            //    size: new AMap.Size(32, 32),
            //    offset: new AMap.Pixel(-16, -30)

            mapRealTime.cluster = new AMap.MarkerClusterer(mapRealTime, markers, { gridSize: 10, zoomOnClick: false, styles: sts }); //zoomOnClick:点击聚合点的时候是否自动散开
            AMap.event.addListener(mapRealTime.cluster, 'click', function (e) {
                try {
                    var lnglat = e.lnglat;
                    var lng = lnglat.getLng();
                    var lat = lnglat.getLat();

                    var allMarkers = e.markers; //当前聚合点下面所聚合的所有车辆  allMarkers是个数组
                    var middle = '';
                    for (var i = 0; i < allMarkers.length; i++) {
                        var veh = allMarkers[i];
                        var vehid = veh.getExtData(); //与每个点标记关联的自定义数据，在此是车辆id，在addVeh方法内部有这个属性的赋值
                        var strJson = mapRealTime.drawVehs[vehid].vehJson;
                        var VehicleCode = strJson.a || strJson.VehicleCode;
                        middle += '<option value="' + vehid + '">' + VehicleCode + '</option>';
                    }
                    var vehNum = allMarkers.length;
                    //这里的第三个参数：要给某一个车辆的id。或多个车辆的ID，这样，当删除HTML里的某个车辆或多个车辆的时候，要不要这里的HTML自动变化呢？
                    var html = '<div><div style="color: Blue">重叠车辆信息</div><div style="color:Blue">车牌号(' + vehNum + '个)</div>' +
                        '<div><select id="selection" size="6" onchange="gradeChange()" style="color: Blue">' + middle +
                        '</select></div></div>';
                    setInfoWindowContent(html);
                    openInfoWindow(lng, lat, "111", false);
                }
                catch (ex) {
                    showError("点聚合的单击事件", ex);
                }
            }); //点击事件   参数：{cluster,lnglat,target,markers} 其中cluster：点击的聚合点对象，lnglat：点击的位置点坐标，target：点聚合插件对象，marker：点击的聚合点所包含的点对象
        });
    }
    catch (ex) {
        showError("addCluster", ex);
    }
}
function gradeChange() {
    try {
        var objS = document.getElementById("selection");
        var selectVehid = objS.options[objS.selectedIndex].value; //alert(selectVehid);
        interWinform(selectVehid, "selectVehid");
    }
    catch (ex) {
        showError("gradeChange", ex);
    }
}
//清除插件！并获取之前插件的聚合点
function clearCluster() {
    try {
        if (mapRealTime.cluster) {
            delete mapRealTime.separateVehid;
            var markers = mapRealTime.cluster.getMarkers();
            mapRealTime.cluster.removeMarkers(markers);
            mapRealTime.add(markers);
            mapRealTime.cluster.setMap(null);
            delete mapRealTime.cluster;
            return markers;
        }
        else {
            return getAllClusterVeh();
        }
    }
    catch (ex) {
        showError("clearCluster", ex);
    }
}
//获取所有的聚合车辆---从所有车辆里面获取
function getAllClusterVeh() {
    try {
        var vehArr = [];
        for (var vehid in mapRealTime.drawVehs) {
            //alert(111);
            if (mapRealTime.drawVehs.hasOwnProperty(vehid)) {
                //alert(222);
                vehArr.push(mapRealTime.drawVehs[vehid].marker);
            }
        } //alert(vehArr.length);
        return vehArr;
    }
    catch (ex) {
        showError("getAllClusterVeh", ex);
    }
}

//下面是车辆、站点、线路的新老系统兼容方法
function getVehId(strJson) {
    if (!strJson.b) {
        var stack = [];
        var caller = arguments.callee.caller;
        while (caller) {
            stack.unshift(getFunctionName(caller));
            caller = caller && caller.caller;
        }
        alert('functions on stack:' + '\n' + stack.join('\n'));
    }

    //alert(strJson.b);
    return strJson.b || strJson.ID || strJson.VehicleID || 0;
}
function getVehLngLat(strJson)//获取车辆的坐标信息 用ABC坐标
{
    var lng = strJson.u || strJson.offLon || strJson.Lng_abc || 0;
    var lat = strJson.v || strJson.offLat || strJson.Lat_abc || 0;
    return { lng: lng, lat: lat };
}
function getHistVehLngLat(strJson)//获取历史轨迹点的坐标信息
{
    var lng = strJson.a || strJson.off_longitude || strJson.Lng_abc || 0;
    var lat = strJson.b || strJson.off_latitude || strJson.Lat_abc || 0;
    return { lng: lng, lat: lat };
}
//地图设置！每一次画车辆、更新车辆；画线路、画站点之前都要判断一下地图的设置，从而决定显示哪些元素
function setOptions(option) {
    try {
        var strJson = strToJson(option);
        mapRealTime.options = strJson;

        //实时改变地图标记【车辆、及其他元素的状态】
        showOrHideDomByClass();
        operateRealLine();
        //setHistory();//这方法调用可能比较慢！里面也许要画线路锚点
        setMapStatus();
        //锚点的数字序号！
        if (mapRealTime.options.iLineSnchorShow) {
            showlineSeq(true);
        }
        else {
            showlineSeq(false);
        }
        if (mapRealTime.options.MapLayerType === '0') {
            createNormal();
        }
        else {
            createBuilder();
        }
        //alert(mapRealTime.name  + '   111');
        //其他地图设置！
        addCluster();
    }
    catch (ex) {
        showError("setOptions", ex);
    }
}
//设置地图本身的状态
function setMapStatus() {
    var mapoption = mapRealTime.options;
    if (mapoption)//设置地图的缓动效果
    {
        setStatus({ jogEnable: mapoption.jogEnable });
        //将来可以加上其他的地图设置
    }
}
//fromjs代表本次调用是否来自js端，而不是来自C#端：为了避免栈溢出
function setMouseWheeling(mousewheel, fromjs)//mousewheel 是 string 类型
{
    if (mapRealTime.mousewheel === mousewheel) {
        return;
    }
    mapRealTime.mousewheel = mousewheel;//刷新该字段的值
    //return;
    var mapoption = mousewheel === '1' ? true : false;
    setStatus({ scrollWheel: mapoption });
    if (fromjs) {
        var param = mapoption ? '0' : '1';
        interWinform(param, 'setMouseWheeling');
    }
}
//根据DOM元素的class名称，显示或隐藏DOM元素
function showOrHideDomByClass() {
    try {
        var tags = document.getElementsByTagName("*");     //tags ||

        var hideMarker = hideMarkerBaseScale();
        var hideVehCodeAndSpeed = hideMarker && mapRealTime.options.ScaleHiddenVehSpeed; //缩放比例变化，是否导致车辆的车牌号和速度自动隐藏或显示？
        var hideStatTextFoo = hideStatText(); //缩放比例变化，是否导致站点文本自动隐藏
        for (var k in tags) {
            var tag = tags[k];

            switch (tag.className)       //进一步还可以优化：判断之前的地图设置与新的地图设置，哪些选项变化了？然后只修改那些变了的选项
            {
                case 'veh':
                    tag.style.display = hideVehCodeAndSpeed ? 'none' : ''; //车牌号 
                    break;
                case 'vehcode':
                    if (!hideVehCodeAndSpeed) {
                        tag.style.display = mapRealTime.options.ShowVehicleCode ? '' : 'none'; //车牌号
                    }
                    break;
                case 'vehspeed':
                    if (!hideVehCodeAndSpeed) {
                        tag.style.display = mapRealTime.options.ShowSpeed ? '' : 'none'; //车辆速度
                    }
                    break;
                case 'statcontent':
                    tag.style.display = hideStatTextFoo ? 'none' : ''; //隐藏站点文字(0 不隐藏，1隐藏 （默认0）)
                    if (!hideStatTextFoo) {
                        tag.style.fontSize = getStatFontSize();
                    }
                    break;
            } //switch结束
        }
        if (hideMarker) {
            if (mapRealTime.options.ScaleHiddenStat) {
                setSitesStatus(false); //是否根据地图缩放比例显示站点   1　是，　0　不是　　　默认　0
            }
            else {
                setSitesStatus(true);
            }
        }
        else {
            setSitesStatus(true);
        }
    }
    catch (ex) {
        showError("showOrHideDomByClass", ex);
    }
}
//根据当前地图的缩放比例来设置地图上的车辆和站点是否要随之显示或隐藏！
function hideMarkerBaseScale()////如果当前地图的缩放比例大于5，就隐藏元素！
{
    var zoomvalue = getZoom(); //比例值越大地图越细致！地图细致才可以显示marker（车辆或站点）！
    var limitzoom = 13; //限制的缩放比例，这里固定了下来，小于这个缩放比例的话就要隐藏站点！
    var condition = zoomvalue < limitzoom;

    return condition; //暂时显示！
}
function hideStatText() {
    if (mapRealTime.options) {
        if (mapRealTime.options.MapHideStationText) {
            return true;
        }
        var zoomvalue = getZoom(); //比例值越大地图越细致！地图细致才可以显示marker（车辆或站点）！
        var limitzoom = 15; //限制的缩放比例，这里固定了下来，小于这个缩放比例的话就要隐藏站点！
        var condition = zoomvalue < limitzoom;

        return condition && mapRealTime.options.HideStationText;
    }
    else {
        return true;
    }
}
//设置站点是否显示：要顺便设置站点半径（覆盖物）是否显示
function setSitesStatus(visible) {
    //mapRealTime.drawSites[sid] = { marker: marker,circlemarker:circlemarker, markerEvent: clickEvent, siteJson: strJson };
    for (var sid in mapRealTime.drawSites) {
        if (mapRealTime.drawSites.hasOwnProperty(sid)) {
            if (visible) {
                mapRealTime.drawSites[sid].marker.show();
                if (mapRealTime.drawSites[sid].circlemarker) {
                    mapRealTime.drawSites[sid].circlemarker.show();
                }
            }
            else {
                mapRealTime.drawSites[sid].marker.hide();
                if (mapRealTime.drawSites[sid].circlemarker) {
                    mapRealTime.drawSites[sid].circlemarker.hide();
                }
            }
        }
    }
}
//修改站点的可拖拽属性，并绑定事件：在站点拖拽的过程中把最新的经纬度传给界面
function setStatDragStatus(stat_param) {
    try {
        var statInfo = strToJson(stat_param);
        var sid_param = statInfo.sid;
        var drag_param = statInfo.drag === 1 ? true : false;
        for (var sid in mapRealTime.drawSites) {
            if (mapRealTime.drawSites.hasOwnProperty(sid)) {
                if (sid == sid_param) {
                    mapRealTime.drawSites[sid].marker.setDraggable(drag_param);
                    if (drag_param) {
                        //给该站点添加拖动过程的事件：在拖动站点的过程中就不断把最新的经纬度消息报告给调度系统
                        if (!mapRealTime.drawSites[sid].marker.listener_dragging)//当该站点还没有绑定对应的拖动事件的时候
                        {
                            var listener = AMap.event.addListener(mapRealTime.drawSites[sid].marker, 'dragging', function (e) {
                                try {
                                    var lng = e.lnglat.getLng();
                                    var lat = e.lnglat.getLat();
                                    var param_wpf = sid + "," + lng + "," + lat;
                                    interWinform(param_wpf, "statdragging");
                                }
                                catch (ex) {
                                    showError("statdragging", ex);
                                }
                            });
                            mapRealTime.drawSites[sid].marker.listener_dragging = listener;
                        }
                    }
                    else {
                        if (mapRealTime.drawSites[sid].marker.listener_dragging)//当该站点已经绑定对应的拖动事件的时候
                        {
                            AMap.event.removeListener(mapRealTime.drawSites[sid].marker.listener_dragging);
                            mapRealTime.drawSites[sid].marker.listener_dragging = null;
                        }
                    }
                    break;
                }
            }
        }
    }
    catch (ex) {
        showError("setStatDragStatus", ex);
    }
}
//在设置变更后，立即改变车辆的实时轨迹线
function operateRealLine() {
    try {
        for (var vehid in mapRealTime.drawVehs) {
            if (mapRealTime.drawVehs.hasOwnProperty(vehid)) {
                var strJson = mapRealTime.drawVehs[vehid].vehJson;
                //if(strJson)
                //{
                var lnglat = getVehLngLat(strJson);
                var lng = lnglat.lng;
                var lat = lnglat.lat;
                if (lng && lat) {
                    var lnglat = [lng, lat];
                    drawRealLine(vehid, lnglat);
                }
                //}
            }
        }
    }
    catch (ex) {
        showError("operateRealLine", ex);
    }
}
function setMapName(mapname) {
    mapRealTime.name = mapname;
}
//function setMapCore(coreName)//地图内核
//{
//    mapRealTime.coreName = coreName;
//}

function clearMap()//清空地图:删除地图上所有的覆盖物
{
    try {
        mapRealTime.clearMap();
    }
    catch (ex) {
        showError("clearMap", ex);
    }
}
function destroy()//注销地图对象，并清空地图容器
{
    try {
        mapRealTime.destroy();
    }
    catch (ex) {
        showError("destroy", ex);
    }
}
function clearInfoWindow()//清除地图上的信息窗体。
{
    try {
        mapRealTime.clearInfoWindow();
    }
    catch (ex) {
        showError("clearInfoWindow", ex);
    }
}
//平移指定的像素值
//设置缩放级别和中心点
function setZoomAndCenter(zoomValue, lng_abc, lat_abc) {
    try {
        if (mapRealTime) {
            mapRealTime.setZoomAndCenter(zoomValue, [lng_abc, lat_abc]);
        }
        else {
            alert("地图未初始化");
        }
    }
    catch (ex) {
        showError("setZoomAndCenter", ex);
    }
}
function getZoom() {
    try {
        return mapRealTime.getZoom();
    }
    catch (ex) {
        showError("getZoom", ex);
    }
}
function setZoom(zoomvalue) {
    try {
        mapRealTime.setZoom(zoomvalue);
    }
    catch (ex) {
        showError("setZoom", ex);
    }
}
function getCenter(str)         //每次只返回一个值。所以这个方法一般是调用两次
{
    try {
        var e = mapRealTime.getCenter();
        if (str === 'lng') {
            return e.getLng();
        }
        else if (str === 'lat') {
            return e.getLat();
        }
    }
    catch (ex) {
        showError("getCenter", ex);
    }
}
function getLngLat(mapname) {
    try {
        //alert('getLngLat进来了');
        var e = mapRealTime.getCenter();
        var ret = e.getLat() + "," + e.getLng(); //alert('getLngLat:' + ret);
        interWinform(ret, "getLngLat" + mapname);
    }
    catch (ex) {
        showError("getLngLat", ex);
    }
}
function getZoomEx(mapname) {
    try {
        //alert('getZoomEx进来了');
        var ret = getZoom(); //alert('getZoomEx::' + ret);
        interWinform(ret, "getZoomEx" + mapname);
    }
    catch (ex) {
        showError("getZoomEx", ex);
    }
}
//JS页面外部【winform】使用
function setCenter(strLngLat) {
    try {
        var arr = strLngLat.split(","); //字符分割
        var lng_abc = arr[0]; //alert("lng_abc:"+lng_abc);
        var lat_abc = arr[1]; //alert("lat_abc:"+lat_abc);

        setCenterInner(lng_abc, lat_abc);
    }
    catch (ex) {
        showError("setCenter", ex);
    }
}
//JS页面内部使用
function setCenterInner(lng_abc, lat_abc) {
    try {
        mapRealTime.setCenter([lng_abc, lat_abc]);
    }
    catch (ex) {
        showError("setCenterInner", ex);
    }
}

function getScale()//Number	获取当前地图比例尺。其值为当前地图中心点处比例尺值的倒数
{
    try {
        return mapRealTime.getScale();
    }
    catch (ex) {
        showError("getScale", ex);
    }
}

function getCity() {
    //mapRealTime.getCity(function (data)
    //{
    //    if (data['province'] && typeof data['province'] === 'string')
    //    {
    //        alert('城市：' + (data['city'] || data['province']));
    //    }
    //});
} //mapRealTime的函数：【包括回调函数】getCity(callback:function(result)) {province,city,citycode,district}
function setCity(city)  //setCity(city:String，callback:Functon)
{
    //if (typeof city === "string")
    //{
    //    mapRealTime.setCity(city, function ()
    //    {

    //    });
    //}
    //else
    //{
    //    alert('请输入正确的城市名称');
    //}
}
function getBounds()//return Bounds 获取当前地图视图范围
{
    try {
        return mapRealTime.getBounds();
    }
    catch (ex) {
        showError("getBounds", ex);
    }
}
//这里应该对于获取某个点下的所有车辆有用！
function setBounds(bound)//setBounds(bound:Bounds)指定当前地图显示范围，参数bounds为指定的范围
{
    try {
        mapRealTime.setBounds(bound);
    }
    catch (ex) {
        showError("setBounds", ex);
    }
}
function getLimitBounds()//获取Map的限制区域
{
    try {
        return mapRealTime.getLimitBounds();
    }
    catch (ex) {
        showError("getLimitBounds", ex);
    }
}
function setLimitBounds(bound)//setLimitBounds(bound:Bounds) 设置Map的限制区域，设定区域限制后，传入参数为限制的Bounds。地图仅在区域内可拖拽
{
    try {
        mapRealTime.setLimitBounds(bound);
    }
    catch (ex) {
        showError("setLimitBounds", ex);
    }
}
function clearLimitBounds()//清除限制区域
{
    try {
        mapRealTime.clearLimitBounds();
    }
    catch (ex) {
        showError("clearLimitBounds", ex);
    }
}
function zoomIn()//地图放大一级显示
{
    try {
        mapRealTime.zoomIn();
    }
    catch (ex) {
        showError("zoomIn", ex);
    }
}
function zoomOut()//地图缩小一级显示
{
    try {
        mapRealTime.zoomOut();
    }
    catch (ex) {
        showError("zoomOut", ex);
    }
}
function panBy(x, y)//以像素为单位，沿x方向和y方向移动地图，x向右为正，y向下为正
{
    try {
        mapRealTime.panBy(x, y);
    }
    catch (ex) {
        showError("panBy", ex);
    }
}
function panTo(lng_abc, lat_abc)//地图中心点平移至指定坐标(120.2200, 30.0256);
{
    try {
        mapRealTime.panTo([lng_abc, lat_abc]);
    }
    catch (ex) {
        showError("panTo", ex);
    }
}
function getStatus()      //获取当前地图状态信息，包括是否可鼠标拖拽移动、是否可缩放、是否可旋转（rotateEnable）、是否可双击放大、是否可以通过键盘控制地图旋转（keyboardEnable）等
{
    try {
        return mapRealTime.getStatus();
    }
    catch (ex) {
        showError("getStatus", ex);
    }
}
function setStatus(status)//status:Object
{
    try {
        mapRealTime.setStatus(status);
    }
    catch (ex) {
        showError("setStatus", ex);
    }
}
function addControl(obj)       //addControl(obj:Object)		添加控件。参数可以是插件列表中的任何插件对象，如：ToolBar、OverView、Scale等
{
    try {
        mapRealTime.addControl(obj);
    }
    catch (ex) {
        showError("addControl", ex);
    }
}
function removeControl(obj)//removeControl(obj:Object)		移除地图上的指定控件
{
    try {
        mapRealTime.removeControl(obj);
    }
    catch (ex) {
        showError("removeControl", ex);
    }
}
function getAllOverlays(type)//return object 返回添加的覆盖物对象，可选类型包括marker、circle、polyline、polygon； Type可缺省，缺省时返回所有覆盖物（marker、circle、polyline、polygon）。 
{
    try {
        return mapRealTime.getAllOverlays(type);         //返回结果不包含官方覆盖物等，比如定位marker，周边搜索圆等
    }
    catch (ex) {
        showError("getAllOverlays", ex);
    }
}
function add(overlayers) //添加地图覆盖物数组，数组为一个或多个覆盖物。
{
    try {
        mapRealTime.add(overlayers);
    }
    catch (ex) {
        showError("add", ex);
    }
}
function remove(overlayers)//remove(overlayers:Array)删除地图覆盖物数组，数组为一个或多个覆盖物。
{
    try {
        mapRealTime.remove(overlayers);
    }
    catch (ex) {
        showError("remove", ex);
    }
}

//参数cursor应符合CSS的cursor属性规范。可为CSS标注中的光标样式，如：setCursor(“pointer”)等；或者自定义的光标样式，如setCursor("url('http://api.amap.com/webapi/static/Images//0.png'),pointer")
function setDefaultCursor(strCursor) {
    try {
        if (typeof strCursor === "string") {
            mapRealTime.setDefaultCursor(strCursor);
        }
    }
    catch (ex) {
        showError("setDefaultCursor", ex);
    }
}
function setFitView(overlayList)//setFitView(overlayList:Array);根据地图上添加的覆盖物分布情况，缩放平移地图到合适的视野级别，参数overlayList默认为当前地图上添加的所有覆盖物图层
{
    try {
        if (overlayList) {
            mapRealTime.setFitView(overlayList); //针对特定覆盖物
        }
        else {
            mapRealTime.setFitView(); //针对所有覆盖物
        }
    }
    catch (ex) {
        showError("setFitView", ex);
    }
}
function setFitViewLatestFeture(strids) {
    try {
        var arr = strids.split(',');
        var arrMarkers = [];
        for (var i = 0; i < arr.length; i++) {
            var lineid = arr[i];
            if (mapRealTime.drawLines[lineid]) {
                arrMarkers.push(mapRealTime.drawLines[lineid].marker);
            }
        }
        if (arrMarkers.length > 0) {
            setFitView(arrMarkers);
        }
    }
    catch (ex) {
        showError("setFitViewLatestFeture", ex);
    }
}
//mapRealTime.drawSites[sid] = { marker: marker, markerEvent: clickEvent, siteJson: strJson };
function setStationCenter(strid) {
    if (mapRealTime.drawSites[strid]) {
        var strJson = mapRealTime.drawSites[strid].siteJson;
        var lng = strJson.b || strJson.offLon || 0;
        var lat = strJson.a || strJson.offLat || 0;
        setCenterInner(lng, lat);
    }
}

//InfoWindow部分函数
function setInfoWindowContent(str)//(content:String|htmlDOM);
{
    try {
        if (mapRealTime["infoWindow"]) {
            mapRealTime["infoWindow"].setContent(str); 	//设置信息窗体内容，可通过该函数动态更新信息窗体中的信息
        }
        else {
            alert('请等待地图完成初始化');
        }
    }
    catch (ex) {
        showError("setInfoWindowContent", ex);
    }
}

function openInfoWindow(lng, lat, strid, isVeh)//如果strid 是 1 ，就说明要取消特定id与窗口的关联
{
    try {
        if (mapRealTime["infoWindow"]) {
            //if(isVeh)
            //{
            mapRealTime["infoWindow"].id = strid;                //信息展示窗体打开的时候，让它和当前显示的车辆id或站点id关联。
            //}
            mapRealTime["infoWindow"].open(mapRealTime, [lng, lat]); //open(mapRealTime:Map,pos:AMap.LngLat)
        }
        else {
            alert('请等待地图完成初始化');
        }
    }
    catch (ex) {
        showError("openInfoWindow", ex);
    }
}
function closeInfoWindow() {
    try {
        if (mapRealTime["infoWindow"]) {
            mapRealTime["infoWindow"].close();
        }
        else {
            alert('请等待地图完成初始化');
        }
    }
    catch (ex) {
        showError("closeInfoWindow", ex);
    }
}
function releaseInfoWindow(strid) {
    try {
        //先判断信息展示窗体是否与当前这个点标记关联（当显示悬浮窗的时候会把这个待显示的车辆或站点的id关联到信息展示窗体）
        if (mapRealTime["infoWindow"] && mapRealTime["infoWindow"].id) {
            if (mapRealTime["infoWindow"].id.toString() === strid.toString())//if(mapRealTime["infoWindow"].id === strid)//这里必须要先把两个变量转化为字符串！原因不详。。。
            {
                closeInfoWindow();
                delete mapRealTime["infoWindow"].id;
            }
        }
    }
    catch (ex) {
        showError("releaseInfoWindow", ex);
    }
}
function openHisTipWindow(strinfo)//历史报表双击-->地图主动弹窗！参数是parms = latitude + "," + lontitude + "," + vecode + "," + postime + "," + speed + "," + drection + "," + straddr + "," + vegroup;
{
    try {
        var arr = strinfo.split(','); //数组里应该是八个元素
        if (arr.length === 8) {
            var lat = arr[0];
            var lng = arr[1];
            var vehcode = arr[2];
            var time = arr[3];
            var speed = arr[4];
            //var drection = arr[5];
            var straddr = arr[6];
            var group = arr[7];

            var div = '<div><font bgcolor="white" color="black">轨迹信息</font>' + '<div>公司（车组）：' + group + '</div>' + '<div >车牌：' + vehcode + '</div>' + '<div>速度：' + speed + '</div>'
                + '<div>时间：' + time + '</div>' + '<div>地址：' + straddr + '</div>' + '</div>';
            setInfoWindowContent(div);
            openInfoWindow(lng, lat, 'openHisTipWindow', false);

            //        var img = "<div><img src='" + "trImage/" + "current.png" + "'/></div>"; //current.png代表的是双击历史表格产生的红色标记点！
            //        if (mapRealTime.Historylines)
            //        {
            //            if (mapRealTime.Historylines.dbclickMarker)//第一次双击：创建标记点，以后就是直接更新标记点的位置了
            //            {
            //                AMap.event.removeListener(mapRealTime.Historylines.markerEvent);
            //                mapRealTime.Historylines.dbclickMarker.setMap(null); //从地图上清除双击标记
            //            }

            //            //画一个点！标记一下
            //            var marker = new AMap.Marker(
            //            {
            //                map: mapRealTime,
            //                position: [lng, lat],
            //                offset: new AMap.Pixel(-10, -30),  //相对于基点的偏移位置
            //                //autoRotation: true,
            //                //topWhenClick : true,
            //                zIndex: 99, //比正常的Z序小一号！
            //                content: img
            //            });
            //            var clickEvent = AMap.event.addListener(marker, "click", function (e)
            //            {
            //                var newdiv = div;
            //                setInfoWindowContent(newdiv);
            //                var point = e.target.getPosition();
            //                openInfoWindow(point.getLng(), point.getLat(), 'openHisTipWindow', false);
            //            });
            //            mapRealTime.Historylines.dbclickMarker = marker;
            //            mapRealTime.Historylines.markerEvent = clickEvent;
            //        }
        }
    }
    catch (ex) {
        showError("openHisTipWindow", ex);
    }
}
function clearHisTipWindow()//清除历史轨迹的时候要清除历史轨迹里的所有东西！顺便解除与弹窗的关联
{
    try {
        if (mapRealTime.Historylines) {
            if (mapRealTime.Historylines.dbclickMarker) {
                AMap.event.removeListener(mapRealTime.Historylines.markerEvent);
                mapRealTime.Historylines.dbclickMarker.setMap(null); //从地图上清除双击标记
            }
            releaseInfoWindow('openHisTipWindow');
        }
    }
    catch (ex) {
        showError("clearHisTipWindow", ex);
    }
}


//下面是画删站点、车辆部分！！！
function deleteSite(str)//str：1,2,3,4,5,6这样的格式
{
    try {
        var strs = str.split(","); //字符分割 ：定义一数组
        //alert('即将删除的站点数量：'+strs.length);
        var i;
        for (i = 0; i < strs.length; i++) {
            if (strs[i]) {
                deleteStations(strs[i]);
            }
        }
    }
    catch (ex) {
        showError("deleteSite", ex);
    }
}

function deleteStations(strid)//从地图上删除站点
{
    try {
        releaseInfoWindow(strid); //先解除与当前弹窗的关联！
        //待删除的目标，是站点ID对应的站点对象
        var dest = mapRealTime.drawSites[strid];

        if (dest)//如果temp不为false【不为null、不为undefined...】
        {
            if (dest.markerEvent) {
                AMap.event.removeListener(dest.markerEvent);                  //取消点击事件
            }
            dest.marker.setMap(null);
            if (dest.circlemarker) {
                dest.circlemarker.setMap(null);
            }
            delete mapRealTime.drawSites[strid];
        }
    }
    catch (ex) {
        showError("deleteStations", ex);
    }
}
function drawStations(statInfo) {
    try {
        var strJson = strToJson(statInfo);
        if (strJson instanceof Array)//说明是多个站点！C#：list<>
        {
            //var arrMarkers = [];
            var item;
            var firstStat; //第一个站点对象
            //var stat;
            for (item in strJson) {
                if (strJson.hasOwnProperty(item)) {
                    if (!firstStat) {
                        firstStat = strJson[item];
                    }
                    addStat(strJson[item]);
                    //stat = addStat(strJson[item]);
                    //if (stat)
                    //{
                    //    arrMarkers.push(stat);
                    //}
                }
            }
            //if (arrMarkers.length > 0)
            //{
            //    setFitView(arrMarkers);
            //}
            if (firstStat) {
                var lng = firstStat.b || firstStat.offLon || 0;
                var lat = firstStat.a || firstStat.offLat || 0;
                if (lng && lat) {
                    setCenterInner(lng, lat);
                }
            }
        }
        else if (strJson instanceof Object)//说明是一个站点C#： station
        {
            addStat(strJson);

            var lng = strJson.b || strJson.offLon || 0;
            var lat = strJson.a || strJson.offLat || 0;
            if (lng && lat) {
                setCenterInner(lng, lat);
            }
        }
    }
    catch (ex) {
        showError("drawStations", ex);
    }
}
function addStat(strJson) {
    try {
        //下面是兼容代码【兼容新老系统，因为新老系统对于车辆和站点的类对象的属性可能不一样】
        var sid = strJson.Id;
        var lng = strJson.b || strJson.offLon || 0;
        var lat = strJson.a || strJson.offLat || 0;
        if (mapRealTime.drawSites[sid])//同一个站点只允许创建一个图标！
        {
            return;
        }
        if (!lng || !lat) {
            return;
        }
        var marker = new AMap.Marker(
            {
                map: mapRealTime,
                position: [lng, lat],
                offset: new AMap.Pixel(-4, -4),  //相对于基点的偏移位置
                autoRotation: true,
                topWhenClick: true,
                content: getStatContent(strJson, sid)
            });
        if (mapRealTime.options.ScaleHiddenStat && hideMarkerBaseScale())//创建站点之后：要马上判断在当前的缩放比例下，该站点是否应该显示！
        {
            marker.hide();
        }
        var clickEvent = AMap.event.addListener(marker, "click", function (e) {
            try {
                mapRealTime.currStatPoint = e.target.getPosition(); //showStatInfoWindow方法内会使用并删掉这个全局字段
                interWinform(sid, "selectStation");
            }
            catch (ex) {
                showError("站点的单击事件", ex);
            }
        });
        mapRealTime.drawSites[sid] = { marker: marker, markerEvent: clickEvent, siteJson: strJson };
        return marker;
    }
    catch (ex) {
        showError("addStat", ex);
    }
}
function drawStationsRadius() {
    try {
        //这里还要考虑到当前的缩放比例是否让站点显示了，如果显示了，再...
        var visible = !(mapRealTime.options.ScaleHiddenStat && hideMarkerBaseScale());
        for (var sid in mapRealTime.drawSites) {
            if (mapRealTime.drawSites.hasOwnProperty(sid)) {
                if (!mapRealTime.drawSites[sid].circlemarker) {
                    var strJson = mapRealTime.drawSites[sid].siteJson;

                    var lng = strJson.b || strJson.offLon || 0;
                    var lat = strJson.a || strJson.offLat || 0;
                    if (!lng || !lat) {
                        continue;
                    }
                    var radius = strJson.e;
                    var marker = new AMap.Circle(
                        {
                            map: mapRealTime,
                            center: [lng, lat],
                            radius: radius,
                            strokeColor: '#006600',
                            strokeOpacity: 0.3,
                            strokeWeight: 4,
                            fillColor: '#006600',
                            fillOpacity: 0.3,
                            strokeStyle: 'solid',//线样式  "dashed"
                            strokeDasharray: [10, 6, 3, 6] //补充线样式
                        });
                    mapRealTime.drawSites[sid].circlemarker = marker;
                }
                if (visible) {
                    mapRealTime.drawSites[sid].circlemarker.show();
                }
                else {
                    mapRealTime.drawSites[sid].circlemarker.hide();
                }
            }
        }
    }
    catch (ex) {
        showError("drawStationsRadius", ex);
    }
}
function deleteStationsRadius() {
    try {
        for (var sid in mapRealTime.drawSites) {
            if (mapRealTime.drawSites.hasOwnProperty(sid)) {
                if (mapRealTime.drawSites[sid].circlemarker) {
                    mapRealTime.drawSites[sid].circlemarker.setMap(null);
                }
                delete mapRealTime.drawSites[sid].circlemarker;
            }
        }
    }
    catch (ex) {
        showError("deleteStationsRadius", ex);
    }
}
function showStatInfoWindow(statInfo) {
    var strJson = strToJson(statInfo);

    var sid = strJson.Id;
    var SimpleName = strJson.c || strJson.SimpleName;
    var Name = strJson.e || strJson.Name;
    var Remark = strJson.f || strJson.Remark;

    var div = '<div><font bgcolor="white" color="black">站点信息</font>' + '<div >简称：' + SimpleName + '</div>' + '<div >全称：' + Name + '</div>' + '<div>备注：' + Remark + '</div>';//+ '</div>';
    mapRealTime.StatInfoDiv = div;
    mapRealTime.StatInfoWindowID = sid;
    //setInfoWindowContent(div);
    //var point = mapRealTime.currStatPoint;
    //openInfoWindow(point.getLng(), point.getLat(), sid, false);
    //delete mapRealTime.currStatPoint;
}
function appendStatWaitInfo(stat) {
    var arr = strToJson(stat);//数组，代表该站点上等候车辆的数据
    var div = mapRealTime.StatInfoDiv;
    var sid = mapRealTime.StatInfoWindowID;
    if (arr && (arr instanceof Array)) {
        //alert('arr:' + arr.length);
        var temp = "";
        for (var i = 0; i < arr.length; i++)//排除最后一个元素，只针对前面的几个元素进行操作
        {
            var dataitem = arr[i];
            temp += '<div>' + dataitem + '</div>';
        }
        div = div + temp + '</div>';
    }
    else {
        div = div + '</div>';
    }
    setInfoWindowContent(div);
    var point = mapRealTime.currStatPoint;
    openInfoWindow(point.getLng(), point.getLat(), sid, false);
    delete mapRealTime.currStatPoint;
    delete mapRealTime.StatInfoWindowID;
    delete mapRealTime.StatInfoDiv;
}
function getStatContent(strJson, sid) {
    try {
        //下面是兼容代码【兼容新老系统，因为新老系统对于车辆和站点的类对象的属性可能不一样】
        var SimpleName = strJson.c || strJson.SimpleName;
        var isshow; //默认不给值！
        if (hideStatText()) //HideStationText：隐藏站点文字(0 不隐藏，1隐藏 （默认0）)
        {
            isshow = 'none'; //设置为隐藏
        }
        else {
            isshow = '';
        }
        var fontsize = getStatFontSize();
        var iconName = strJson.d || strJson.IconName;
        //图片位于trImage文件夹里！
        var ret = "<div class= 'stat' style='float: left; padding-right: 1px;'><img src='" + "trImage/" + iconName
            + "'/></div><div class= 'statcontent' style='color:Blue;font-size:" + fontsize + ";font-weight:bold; height: 20px; line-height: 20px; width: 700%; display:" + isshow + " '>" + SimpleName + "</div>";
        return ret;
    }
    catch (ex) {
        showError("getStatContent", ex);
    }
}
function getStatFontSize() {
    if (mapRealTime.options) {
        if (mapRealTime.options.StationFontSize === 1) {
            return 'x-small';
        }
        else if (mapRealTime.options.StationFontSize === 2) {
            return 'xx-small';
        }
    }
    return 'small';
}


//删除车辆升级优化版：参数是车辆字符串：'1,2,3,4,5,6'这样的格式
function deleteVehiclesEx(strVehids) {
    try {
        var arr = strVehids.split(',');
        if (mapRealTime.cluster && mapRealTime.options.FoldingVehicles)//在点聚合情况下，先解除点聚合插件与该标记的关联！这样删除的速度快很多
        {
            var clusterMarkers = [];
            for (var i = 0; i < arr.length; i++) {
                var vehid = arr[i];
                var dest = mapRealTime.drawVehs[vehid];
                if (dest && dest.marker) {
                    clusterMarkers.push(dest.marker);
                }
            }
            //mapRealTime.cluster.removeMarkers(clusterMarkers);//这个代码不知道为什么后来不行了，于是暂时注释。选择先清除所有聚合标记，然后删除本次的车辆，再把剩余的车辆重新加入标记里
            //for (var i = 0; i < clusterMarkers.length; i++)
            //{
            //    var marker = clusterMarkers[i];
            //    mapRealTime.cluster.removeMarker(marker);
            //}
            mapRealTime.cluster.clearMarkers();
        }
        for (var i = 0; i < arr.length; i++) {
            var vehid = arr[i];
            vehid = Number(vehid); //这里必须先把所有的车辆id 转化为数字！
            deleteVeh(vehid);
        }
        if (mapRealTime.cluster && mapRealTime.options.FoldingVehicles)//在点聚合情况下，先解除点聚合插件与该标记的关联！这样删除的速度快很多
        {
            var allVehMarkers = getAllClusterVeh();
            mapRealTime.cluster.addMarkers(allVehMarkers);
        }
    }
    catch (ex) {
        showError("deleteVehiclesEx", ex);
    }
}
//删除车辆升级优化版：参数是车辆字符串
export function deleteVehBystrid(strvehid) {
    try {
        //alert('deleteVehBystrid:::' + strvehid);
        var vehid = Number(strvehid); //这里必须先把所有的车辆id 转化为数字！
        if (mapRealTime.cluster && mapRealTime.options.FoldingVehicles)//在点聚合情况下，先解除点聚合插件与该标记的关联！这样删除的速度快很多
        {
            var dest = mapRealTime.drawVehs[vehid];
            if (dest && dest.marker) {
                mapRealTime.cluster.removeMarker(dest.marker);
            }
        }
        deleteVeh(vehid);
    }
    catch (ex) {
        showError("deleteVehBystrid", ex);
    }
}
function my(pa) {
    //   var marker = new AMap.Marker({
    //        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
    //        position: [116.405467, 39.907761]
    //    });
    //    marker.setMap(mapRealTime);
    alert(pa);

}
//画车辆
export function drawVehicles(strVehInfo) {
    // var marker = new AMap.Marker({
    //     position: new AMap.LngLat(116.39, 39.9),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
    //     title: '北京'
    // });

    // // 将创建的点标记添加到已有的地图实例：
    // mapRealTime.add(marker);
    // return;
    //alert("strVehInfo:::" + strVehInfo);
    try {
        var strJson = strVehInfo;// strToJson(strVehInfo);
        if (strJson instanceof Array)//说明是多个车辆！C#：list<>
        {
            var markers = [];
            var marker;
            for (var item in strJson) {
                if (strJson.hasOwnProperty(item)) {
                    marker = addVeh(strJson[item]);
                    if (marker && mapRealTime.cluster && mapRealTime.options.FoldingVehicles) {
                        markers.push(marker);
                    }
                }
                //else
                //{
                //    alert('错误::' + strJson.b);
                //    loopObj(strJson);
                //}
            }
            //添加点标记聚合
            if (mapRealTime.cluster && mapRealTime.options.FoldingVehicles) {
                mapRealTime.cluster.addMarkers(markers);

                var last = strJson[strJson.length - 1]; //获取最后一个车辆
                var vehid = getVehId(last);
                //mapRealTime.cluster.addMarker(marker);
                //原来是上面的代码，直接把当前车辆加入到点聚合里；后来改为，当前车辆不要放入点聚合里，应该独立出来
                separateCurrentVeh(vehid);
            }

            //setFitView(null);//如果是多个车辆，就定位到它们的组合！！
        }
        else //if (strJson instanceof Object)//说明是一个车辆C#： veh...
        {
            var marker = addVeh(strJson);
            //添加点标记聚合
            if (mapRealTime.cluster && mapRealTime.options.FoldingVehicles) {
                var vehid = getVehId(strJson);
                //mapRealTime.cluster.addMarker(marker);
                //原来是上面的代码，直接把当前车辆加入到点聚合里；后来改为，当前车辆不要放入点聚合里，应该独立出来
                separateCurrentVeh(vehid);
            }
        }
    }
    catch (ex) {
        showError("drawVehicles", ex);
    }
}
//mapRealTime.currentVehid指的是当前的大图标车辆的车辆id！【所有被点中的车辆都应该自动变为大图标】
//将车辆定位在地图中心，当前的车辆大图！【之后是修改：如果当前车辆是在视图范围内，就不必移动地图、把车辆放进地图中心了！在方法setCenterInner里处理】
export function drawCurrentVehicle(strVehInfo) {
    try {
        var strJson = strVehInfo;//strToJson(strVehInfo);        //alert(strJson);
        var vehid = getVehId(strJson); //alert('drawCurrentVehicle：' + vehid);
        var lnglat = getVehLngLat(strJson);
        var lng = lnglat.lng;   //alert(lng);
        var lat = lnglat.lat;   //alert(lat);
        setVehCenter(lng, lat);
        //设置之前的大图标车辆为小车辆
        if (mapRealTime.currentVehid) {
            if (mapRealTime.currentVehid === vehid) {
                //setVehCenter(lng, lat);
                //return;//这个暂时注释
            }
            else {
                var preVehid = mapRealTime.currentVehid;
                var preVehInfo = mapRealTime.drawVehs[preVehid].vehJson;
                setVehContent(preVehInfo, false); //设置之前的车辆为小图标！
            }
        }
        mapRealTime.currentVehid = vehid; //更新
        addVeh(strJson);
        //        if (mapRealTime.drawVehs[vehid] && mapRealTime.drawVehs[vehid].marker)
        //        {
        //            mapRealTime.drawVehs[vehid].marker.show();
        //        }
        setVehContent(strJson, true); //设置车辆为大图标！
        setVehCenter(lng, lat);
        if (mapRealTime.drawVehs[vehid] && mapRealTime.drawVehs[vehid].marker) {
            mapRealTime.drawVehs[vehid].marker.show();
        }

        if (mapRealTime.cluster && mapRealTime.options.FoldingVehicles) {
            //mapRealTime.cluster.addMarker(marker);
            //原来是上面的代码，直接把当前车辆加入到点聚合里；后来改为，当前车辆不要放入点聚合里，应该独立出来
            separateCurrentVeh(vehid);
        }
    }
    catch (ex) {
        showError("drawCurrentVehicle", ex);
    }
}
function setVehCenter(lng, lat) {
    try {
        var mapBound = mapRealTime.bound = getBounds(); //mapRealTime.bound;//getBounds(); //判断车辆是否在视图范围内，如果车辆已经在视图内，就不必移动到地图中心
        if (!mapBound.contains([lng, lat])) {
            //setCenterInner(lng, lat);    //直接将车辆定位在地图中心！
            panTo(lng, lat);
            panBy(1, 1);
        }
    }
    catch (ex) {
        showError("setVehCenter", ex);
    }
}

function deleteVeh(strid)//从地图上删除车辆图标
{
    try {
        releaseInfoWindow(strid);
        //再判断这个车辆是不是重心车辆【大图标】，如果是，就把地图Map对象的重心车辆属性设为空值
        if (mapRealTime.currentVehid && mapRealTime.currentVehid === strid) {
            delete mapRealTime.currentVehid;
        }
        //待删除的目标，是车辆ID对应的车辆对象
        var dest = mapRealTime.drawVehs[strid];
        deleteRealLine(strid);

        if (dest)//如果temp不为false【不为null、不为undefined...】
        {
            if (mapRealTime.separateVehid === strid) {
                delete mapRealTime.separateVehid;
            }
            if (dest.markerEvent) {
                AMap.event.removeListener(dest.markerEvent);                  //取消车辆点击事件
            }
            dest.marker.setMap(null);
            delete mapRealTime.drawVehs[strid];
        }
    }
    catch (ex) {
        showError("deleteVeh", ex);
    }
}
//点标记marker部分函数
function addVeh(strJson) {
    try {
        //下面是兼容代码【兼容新老系统，因为新老系统对于车辆和站点的类对象的属性可能不一样】
        var vehid = getVehId(strJson); //if (vehid === 0 || vehid === '0') alert('121211212');
        //if (vehid === 0 || vehid === '0') return;
        var VehicleCode = strJson.a || strJson.VehicleCode;  //alert(vehid);
        //var linename = strJson.LineName;
        var lnglat = getVehLngLat(strJson);
        var lng = lnglat.lng;   //alert(lng);
        var lat = lnglat.lat;   //alert(lat);
        if (mapRealTime.drawVehs[vehid])//同一辆车只允许创建一个图标！
        {
            updateVeh(strJson, vehid, lng, lat); //直接更新文本和位置。
            return;
        }
        var speed = strJson.c || strJson.MoveSpeed || strJson.Speed;
        var time = strJson.d || strJson.GpsTime;
        var onOff = strJson.Online || strJson.e;

        var x = -16;
        var y = -16;

        var marker = new AMap.Marker(
            {
                map: mapRealTime,
                position: [lng, lat],
                offset: new AMap.Pixel(x, y), //相对于基点的偏移位置
                autoRotation: true,
                topWhenClick: true,
                extData: vehid      //用户自定义属性，与此点标记关联
            });
        var clickEvent = AMap.event.addListener(marker, "click", function (e) {
            try {
                interWinform(vehid, "showInfoWindow"); //通知winform客户端，让winform反过来调用JS方法setInfoWindowPos，弹出InfoWindow
                interWinform(vehid, "selectVehid"); //通知winform客户端，让winform窗体的对应车辆在表格和树节点里选中
            }
            catch (ex) {
                showError("车辆点击事件", ex);
            }
        });
        mapRealTime.drawVehs[vehid] = { vehJson: strJson, marker: marker, markerEvent: clickEvent, offset_x: x, offset_y: y, lastDrawLat: lat, lastDrawLng: lng, lastDrawSpeed: speed, lastDrawTime: time, lastDrawonLine: onOff }; //realline实时轨迹线
        setVehContent(strJson, false);
        return marker;
    }
    catch (ex) {
        showError("addVeh", ex);
    }
}
Array.prototype.contains = function (needle) {
    for (i in this) {
        if (this[i] == needle) return true;
    }
    return false;
}
//添加新车辆（调用addVeh方法）的时候/drawCurrentVehicle方法里已经调用了addVeh：先把之前分离出来的车辆加入点聚合；然后从点聚合里删除当前车辆，并作为单独车辆
//mapRealTime.separateVehid ： 代表当前从点聚合车辆里面分离出来的当前车辆
function separateCurrentVeh(currentVehid) {
    if (mapRealTime.separateVehid && mapRealTime.drawVehs[mapRealTime.separateVehid]) {
        var marker = mapRealTime.drawVehs[mapRealTime.separateVehid].marker;
        mapRealTime.cluster.addMarker(marker); //先把之前分离出来的车辆加入点聚合
        marker.setzIndex(100);
    }
    if (mapRealTime.drawVehs[currentVehid]) {
        var marker = mapRealTime.drawVehs[currentVehid].marker;
        //从点聚合里删除当前车辆，让这个车辆分离出来，并作为分离车辆保存。当删除车辆的时候会判断是不是需要删除这个mapRealTime.separateVehid
        mapRealTime.cluster.removeMarker(marker);
        marker.setMap(mapRealTime);
        marker.setzIndex(101);
        mapRealTime.separateVehid = currentVehid;
    }
}
//private const string VehicleCode = "VehicleCode";//自编号
//private const string VehicleGrantCode = "VehicleGrantCode";//车牌号
//private const string GpsTime = "GpsTime";
//private const string Speed = "Speed";
//private const string SimCode = "SimCode";
//private const string TerminalCode = "TerminalCode";
//private const string DriverTelephone = "DriverTelephone";
//private const string Angle = "Angle";
//private const string BeforeCarDistance = "BeforeCarDistance";
//private const string AfterCarDistance = "AfterCarDistance";
function setInfoWindowShowItems(option) {
    var strJson = strToJson(option);
    mapRealTime.vehInfoWindow = strJson; //重置车辆点击时，悬浮窗显示的内容项的可见性
    //mapRealTime.vehInfoWindow.VehicleCode = option.VehicleCode;
    //mapRealTime.vehInfoWindow.GpsTime = option.GpsTime;
    //mapRealTime.vehInfoWindow.Speed = option.Speed;
    //mapRealTime.vehInfoWindow.SimCode = option.SimCode;
    //mapRealTime.vehInfoWindow.TerminalCode = option.TerminalCode;
    //mapRealTime.vehInfoWindow.DriverTelephone = option.DriverTelephone;
    //mapRealTime.vehInfoWindow.Angle = option.Angle;
    //mapRealTime.vehInfoWindow.BeforeCarDistance = option.BeforeCarDistance;
    //mapRealTime.vehInfoWindow.AfterCarDistance = option.AfterCarDistance;
}
function getVehInfoWindow(strJson, windowInfo) {
    try {
        var vehiclegrantcode = strJson.f || strJson.VehicleGrantCode;
        var vehcode = strJson.a || strJson.VehicleCode;
        var groupName = strJson.g || strJson.VehGroup || ""; //alert("VehGroup  "+ groupName);
        var linename = strJson.h || strJson.LineName || "";
        var sim = strJson.i || strJson.DriverTelephone || "";
        var gpstime = strJson.d || strJson.GpsTime || strJson.LastPositionTime || ''; //alert(gpstime);
        var alarmtext = strJson.ac || '';//报警文本
        gpstime = gpstime.toLocaleString().replace(/T/, " ");//把"T"换成空格
        var Speed = strJson.c || strJson.MoveSpeed || strJson.Speed || '0'; //实时速度！
        var TerminalCode = strJson.y || '';
        var Angle = strJson.j || strJson.MoveAngle || strJson.Angle; //alert('2');
        var direc = 0;//getDirection(Angle); // alert('anbgl:' + Angle);
        var addr = strJson.z || '';
        var vehinfo = '车牌号：' + vehiclegrantcode + "\r\n";
        vehinfo += '车速：' + Speed + "\r\n";
        vehinfo += '时间：' + gpstime + "\r\n";
        vehinfo += '地址：' + '' + "\r\n";
        vehinfo += '当日里程' + '' + "\r\n";
        var div = "<div style='font-size:12px;lineheight:1.8em;background:yellowgreen;max-width:260px'><font bgcolor='white' color='black'>车辆基本信息</font>";
        div += '<div>自编号：' + vehcode + '</div>';
        // div += mapRealTime.vehInfoWindow.VehicleGrantCode ? '<div>车牌号：' + vehiclegrantcode + '</div>' : "";
        div += "<div style='margin-top:5px'></div>";
        div += "<span>监控信息</span>";
        // div += "<button type='button' click='querytrick' style='width:70px ;height:25px'>查询轨迹</button>";
        // div += "<button type='button' click='sendsms' style='width:70px ;height:25px'>发送短信</button>";///icons/svg/sms.svg
        div += "<img style='width:25px ;height:25px;margin-left:50px' src='http://www.56gps.cn/download/down_Up/wcf/sms.svg'></img>";
        div += "<img style='width:25px ;height:25px;margin-left:10px' src='http://www.56gps.cn/download/down_Up/wcf/trick.svg'></img>";
        div += '</div>';
        div += '<div>';
        div += "<div style='display:inline-block'>";
        div += "<textarea readonly style='min-height:130px;max-width:120px;font-size:smaller;resize:none'>" + vehinfo + "</textarea>";
        div += '</div>';
        div += "<div style='display:inline-block'>";
        div += "<img style='min-height:120px;min-width:120px;margin-top:15px';src='http://www.56gps.cn/download/down_Up/wcf/driver.jpg'/>";
        div += '</div>';
        div += '</div>';
        // div += '<div>地址：' + addr + '</div>';
        // div += mapRealTime.vehInfoWindow.DriverTelephone ? '<div>司机电话：' + sim + '</div>' : "";
        // div += '<div>天气信息：' + windowInfo.weather || '' + '</div>';
        // div += '<div>报警信息：' + alarmtext + '</div>';
        return div;
    }
    catch (ex) {
        //showError("getVehInfoWindow", ex);
        console.log("getVehInfoWindow:" + ex);
    }
}
function getgpsheight(strJson, windowInfo) {
    try {
        //以下字段， 在新系统里有，老系统里没有。靠某些标志字段来分辨！不支持老系统！
        //if (strJson.isNewOS || strJson.GpsTime || strJson.ID)//说明是新系统
        //通用的GPS高度
        var gpsheight = strJson.k || strJson.Altitude || 0;
        //物流
        var StartStationID = strJson.l || strJson.StartStationID || 0;
        var TargetStationID = strJson.m || strJson.TargetStationID || 0;
        var NextStationDistance = strJson.n || strJson.NextStationDistance || 0;
        var ArriveTime = strJson.o || strJson.ArriveTime || 0;
        //公交
        var TodayMile = strJson.p || strJson.TodayMile || 0;
        var StopTime = strJson.q || strJson.StopTime || 0;
        var TodayPlanTrip = strJson.r || strJson.TodayPlanTrip || 0;
        var TodayFinishTrip = strJson.s || strJson.TodayFinishTrip || 0;

        var BeforeCarDistance = strJson.w || 0;
        var AfterCarDistance = strJson.x || 0;
        //获取客户端的数据！（用户类型、物流的发车站、下一站等数据组成JSON对象）
        //var arr = windowInfo.split(',');
        var usertype = windowInfo.usertype ? windowInfo.usertype : ""; //arr[0];
        var startStat = windowInfo.startStat ? windowInfo.startStat : ""; //arr[1];
        var nextStat = windowInfo.nextStat ? windowInfo.nextStat : ""; //arr[2];
        var PlanArrive = windowInfo.PlanArrive ? windowInfo.PlanArrive : ""; //arr[3];
        //构造html元素
        var ret = mapRealTime.vehInfoWindow.GpsHeight ? '<div>GPS高度：' + gpsheight + '</div>' : "";
        //'<div >手机号：' + sim + '</div>'
        if (usertype === 1)//公交
        {
            //ret += mapRealTime.vehInfoWindow.GpsHeight ? '<div>前车距：' + BeforeCarDistance + '</div>' : "";
            //ret += mapRealTime.vehInfoWindow.GpsHeight ? '<div>后车距：' + AfterCarDistance + '</div>' : "";
            ret += '<div>前车距：' + BeforeCarDistance + '</div>' + '<div>后车距：' + AfterCarDistance + '</div>';
        }
        else//物流
        {
            ret += mapRealTime.vehInfoWindow.startStat ? '<div>发车站：' + startStat + '</div>' : "";
            ret += mapRealTime.vehInfoWindow.NextStat ? '<div>下一站：' + nextStat + '</div>' : "";
            ret += mapRealTime.vehInfoWindow.PlanArrive ? '<div>预计到达：' + PlanArrive + '</div>' : "";
            //ret += '<div>发车站：' + startStat + '</div>' + '<div>下一站：' + nextStat + '</div>' + '<div>预计到达：' + 111 + '</div>';
        }
        ret += mapRealTime.vehInfoWindow.TodayMile ? '<div>当日里程：' + TodayMile + '</div>' : "";
        ret += mapRealTime.vehInfoWindow.StopTime ? '<div>停车时长：' + StopTime + '</div>' : "";
        //ret += '<div>当日里程：' + TodayMile + '</div>' + '<div>停车时长：' + StopTime + '</div>';
        return ret;
    }
    catch (ex) {
        showError("getgpsheight", ex);
    }
}

export function setInfoWindowPos(strJsonParam) {
    try {
        var json = strJsonParam;//strToJson(strJsonParam);
        var strJson = json.vehinfo;
        //var windowInfo = json.windowInfo;
        var div = getVehInfoWindow(strJson, 0);
        setInfoWindowContent(div);
        var vehid = getVehId(strJson);
        var lnglat = getVehLngLat(strJson);
        var lng = lnglat.lng;
        var lat = lnglat.lat;
        openInfoWindow(lng, lat, vehid, true);
    }
    catch (ex) {
        //showError("setInfoWindowPos", ex);
    }
}
function updateCurrentVehPos(strJsonParam) {
    try {
        var json = strToJson(strJsonParam);
        var strJson = json.vehinfo;
        var windowInfo = json.windowInfo;
        var div = getVehInfoWindow(strJson, windowInfo);
        setInfoWindowContent(div);

        var vehid = getVehId(strJson);
        var lnglat = getVehLngLat(strJson);
        mapRealTime["infoWindow"].setPosition(lnglat);
    }
    catch (ex) {
        showError("updateCurrentVehPos", ex);
    }
}
//获取车辆显示的文本！参数isBigIcon：指的是大车辆【地图上当前选中的车辆】还是小车辆图标
function setVehContent(strJson, isBigIcon) {
    try {
        //下面是兼容代码【兼容新老系统，因为新老系统对于车辆和站点的类对象的属性可能不一样】
        var isshowvehcode;
        var isshowvehspeed;

        if (mapRealTime.options.ShowVehicleCode) //ShowVehicleCode 与 ShowSpeed ：1为true，0为false
        {
            isshowvehcode = "";
        }
        else {
            isshowvehcode = "none";
        }
        var VehicleCode = strJson.a || strJson.VehicleCode;
        var Speed = strJson.c || strJson.MoveSpeed || strJson.Speed;
        var speedText = ''; //速度显示文本，如果速度为0，就不显示速度
        if (mapRealTime.options.ShowSpeed) {
            isshowvehspeed = ""; // '1';inline
        }
        else {
            isshowvehspeed = "none";
        }
        if (!Speed) {
            Speed = '0';
        }
        else {
            speedText = '速度:' + Speed;
        }

        var Angle = strJson.j || strJson.MoveAngle || strJson.Angle;
        var Online = strJson.Online || strJson.e;
        var icon = getVehIcon(getDirection(Angle), Speed, Online, isBigIcon, strJson); //alert(icon);
        var ret = "<div style='float: left'><img src='" + icon + "'/></div>"; //; padding-right: 1px;
        var vehid = getVehId(strJson);
        mapRealTime.drawVehs[vehid].marker.setContent(ret);
        if (isBigIcon)//大图标代表当前车辆，要放在所有图标的上方！
        {
            mapRealTime.drawVehs[vehid].marker.setzIndex(101);
        }
        else {
            mapRealTime.drawVehs[vehid].marker.setzIndex(100);
        }
        var hideMarker = hideMarkerBaseScale();
        var hideVehCodeAndSpeed = hideMarker && mapRealTime.options.ScaleHiddenVehSpeed;
        var display = hideVehCodeAndSpeed ? 'none' : ''; //alert('display: ' + display + "  VehicleCode   " + VehicleCode + " speedText " + );
        var labeltext = "<div class= 'veh' style='float:left;display:" + display + "'>" //height: 32px; line-height: 32px; background-color: ButtonFace; border: 1px solid #000
            + "<span class= 'vehcode' style='font-size:small; display:" + isshowvehcode + "'>" + VehicleCode + "</span>"
            + "<span class= 'vehspeed' style='font-size:small;display:" + isshowvehspeed + " '>" + speedText + "</span>" + "</div>";
        var textsize = getVehTextSize(icon);
        setVehLabel(vehid, labeltext, textsize);
    }
    catch (ex) {
        showError("setVehContent", ex);
    }
}
function setVehLabel(vehid, labelText, size) {
    try {
        var left = size;
        var top = 5; //初始化
        if (size === 50) {
            left = 48;
            top = 16;
        }
        else if (size === 32) {
            top = 6;
        }
        else if (size === 20) {
            left = 17;
            top = 0;
        }
        //alert('left:' + left + "  top" + top);
        var json = {
            offset: new AMap.Pixel(left, top), //修改label相对于maker的位置
            content: labelText
        };
        mapRealTime.drawVehs[vehid].marker.setLabel(json);
    }
    catch (ex) {
        showError("setVehLabel", ex);
    }
}


/**
函数名：judgeVehicleRedraw
功能：判断车辆是否需要重绘
参数：
oldLat:纬度
oldLng：经度
oldSpeed：旧的速度
oldTime：旧的时间
oldOnline：旧的在线情况
newLat：当前纬度
newLng：当前经度
newSpeed：当前速度
newTime：当前时间
newOnline:当前在线情况
*/
function judgeVehicleRedraw(oldLat, oldLng, oldSpeed, oldTime, oldOnline, newLat, newLng, newSpeed, newTime, newOnline) {
    //重绘条件，任何一条满足都要重绘
    //1,本次与上次，仅有一次在可见范围
    //2,本次在可见区，两次的在线状态不一样
    //3,本次在可见区，本次与上次，仅有一个速度为0
    //4,本次在可见区，本次与上次，两点的屏幕距离（像素值大于20?) 
    //
    var oldPos = [oldLng, oldLat];
    var newPos = [newLng, newLat];
    var oldVisible = mapRealTime.bound.contains(oldPos);
    var newVisible = mapRealTime.bound.contains(newPos);

    if ((!oldVisible && newVisible)//本次与上次，仅有一次在可见范围
        ||
        (oldVisible && !newVisible)
    ) {
        return true;
    }

    if (newVisible) {
        if (oldOnline != newOnline)//两次的在线状态不一样
        {
            return true;
        }

        if (//本次在可见区，本次与上次，仅有一个速度为0
            (oldSpeed > 0 && newSpeed == 0)
            ||
            (oldSpeed == 0 && newSpeed > 0)
        ) {
            return true;
        }

        //3,本次在可见区，本次与上次，两点的屏幕距离（像素值大于20?) 
        var zoomValue = getZoom();
        var oldPixel = mapRealTime.lnglatToPixel(oldPos, zoomValue);
        var newPixel = mapRealTime.lnglatToPixel(newPos, zoomValue);
        if (Math.abs(oldPixel.getX() - newPixel.getX()) > 20 || Math.abs(oldPixel.getY() - newPixel.getY()) > 20) {
            return true;
        }

    }
    return false;

}
//检查需要重画的车辆，执行重画
function RedrawRequireVeh() {
    for (var vehid in mapRealTime.drawVehs) {
        var vehicleCache = mapRealTime.drawVehs[vehid];
        var strJson = vehicleCache.vehJson;

        if (strJson.Time != vehicleCache.lastDrawTime)//与上次绘制时间相同时不用再重绘
        {
            var lnglat = getVehLngLat(strJson);
            updateVeh(strJson, vehid, lnglat.lng, lnglat.lat);
        }
    }
}
//更新车辆
function updateVeh(strJson, vehid, lng, lat)    //每次重绘车辆都判断当前车辆位置是否位于这个区域内部，如果不是，就不必重绘！
{
    try {
        var speed = strJson.c || strJson.MoveSpeed || strJson.Speed;
        var time = strJson.d || strJson.GpsTime;
        var onOff = strJson.Online || strJson.e;

        var vehLast = mapRealTime.drawVehs[vehid];
        //return;
        var needRedraw = judgeVehicleRedraw(vehLast.lastDrawLat, vehLast.lastDrawLng, vehLast.lastDrawSpeed, vehLast.lastDrawTime, vehLast.lastDrawonLine,
            lat, lng, speed, time, onOff);
        if (mapRealTime.currentVehid === vehid) {//当前车辆必须重画
            needRedraw = true;
        }



        //3 ： 如果新坐标位于视图内，那么要刷新车辆！
        //给大图标还是小图标通过当前这个车辆是否之前的那个大图标车辆


        if (strJson != mapRealTime.drawVehs[vehid].vehJson) {
            mapRealTime.drawVehs[vehid].vehJson = strJson;                  //更新车辆的实时信息
        }
        if (!needRedraw) {
            return;
        }
        //alert('开始重绘车辆');
        //var linename = strJson.LineName;
        var lnglat = [lng, lat];
        var str;
        var marker = mapRealTime.drawVehs[vehid].marker;
        //        if (!mapRealTime.bound.contains(lnglat))
        //        {
        //            //alert("车辆不包含在视图范围内  " + vehid + "    " + mapRealTime.bound.toString());
        //            //1 ： 如果车辆之前 不 在视图内，并且新坐标也不在视图内，那么车辆位置就不刷新！
        //            //2 ： 如果车辆之前在视图内，然后新坐标突然不在视图内，那么车辆仍然应该走到新坐标里！应该刷新,也就算隐藏了这个车辆
        //            var preVehJson = mapRealTime.drawVehs[vehid].vehJson;
        //            var prelng = preVehJson.offLon || preVehJson.Lng_abc || 0;
        //            var prelat = preVehJson.offLat || preVehJson.Lat_abc || 0;
        //            var prelnglat = [prelng, prelat];
        //            if (!mapRealTime.bound.contains(prelnglat))//直接返回！否则的话说明车辆应该刷新，也就是运行下面的代码.....
        //            {
        //                return;
        //            }
        //        }
        //3 ： 如果新坐标位于视图内，那么要刷新车辆！
        //给大图标还是小图标通过当前这个车辆是否之前的那个大图标车辆

        marker.setzIndex(100); //
        if (mapRealTime.currentVehid && mapRealTime.currentVehid === vehid) //车辆还是大图标。【车辆和车辆坐标点的偏移量根据情况进行变化！】
        {
            setVehContent(strJson, true);
            if (marker.offset_x !== -16) {
                marker.setOffset(new AMap.Pixel(-16, -16));
                marker.offset_x = -16;
                marker.offset_y = -16;
            }
        }
        else {
            setVehContent(strJson, false);

            if (marker.offset_x !== -10) {
                marker.setOffset(new AMap.Pixel(-10, -10));
                marker.offset_x = -10;
                marker.offset_y = -10;
            }
        }

        marker.setPosition(lnglat);  //更新位置
        //mapRealTime.drawVehs[vehid].vehJson = strJson;                  //更新车辆的实时信息
        //如果infoWindow也跟这个车辆关联，且infoWindow正在显示中，那么就顺便更新infoWindow【文本、位置】，保证infoWindow展示最新的数据【速度、方位】
        if (mapRealTime["infoWindow"] && mapRealTime["infoWindow"].id === vehid && mapRealTime["infoWindow"].getIsOpen())//getIsOpen是高德地图infoWindow类的API
        {
            interWinform(vehid, "updateCurrentVehPos");
        }

        drawRealLine(vehid, lnglat);
        //记录本次绘制状态
        vehLast.lastDrawLat = lat;
        vehLast.lastDrawLng = lng;
        vehLast.lastDrawSpeed = speed;
        vehLast.lastDrawTime = time;
        vehLast.lastDrawonLine = onOff;
    }
    catch (ex) {
        showError("updateVeh", ex);
    }
}
//画车辆的实时轨迹线
function drawRealLine(vehid, lnglat) {
    try {
        //是否画车辆的实时轨迹线？
        if (!mapRealTime.options.ShowTrackLine) {
            deleteRealLine(vehid);
            return;
        }
        var linepointnum = mapRealTime.options.LinePointNum; //要求显示的实时轨迹线的坐标点数！当然是取最近的几个坐标点
        if (linepointnum === 0) {
            //alert('是0个！');
            //删掉之前的实时轨迹线
            deleteRealLine(vehid);
            return;
        }
        if (!mapRealTime.drawVehs[vehid].polylineReal)//如果还没有实时轨迹线，就画一条！
        {
            //alert('画一条实时轨迹线');
            var polylineArr = [];
            polylineArr.push(lnglat);
            var polyline = new AMap.Polyline(
                {
                    map: mapRealTime,
                    path: polylineArr,          //设置线覆盖物路径
                    strokeColor: "#0000FF", //默认蓝色
                    strokeOpacity: 1,       //线透明度
                    strokeWeight: 1,         //线宽
                    strokeStyle: "solid",   //线样式  "dashed"
                    strokeDasharray: [10, 6, 3, 6], //补充线样式
                    icons: [{ type: "FORWARD_ARROW", offset: '25%' }, { type: "FORWARD_ARROW", offset: '65%' }] //线的箭头样式 
                });
            mapRealTime.drawVehs[vehid].polylineReal = polyline;
        }
        else {
            //alert('已经有了实时轨迹线，准备再次设置！');
            var prePath = mapRealTime.drawVehs[vehid].polylineReal.getPath(); //取得之前的坐标点数组，并把当前的坐标加进去，重新设置path
            prePath.push(lnglat);
            while (prePath.length > linepointnum) {
                prePath.splice(0, 1);
            }
            //alert('最新的坐标点数组的长度：' + prePath.length);
            mapRealTime.drawVehs[vehid].polylineReal.setPath(prePath);
        }
    }
    catch (ex) {
        showError("drawRealLine", ex);
    }
}
function deleteRealLine(vehid) {
    try {
        var temp = mapRealTime.drawVehs[vehid];
        if (temp && temp.polylineReal)//如果车辆已经有了实时轨迹线，就删掉这个线！
        {
            temp.polylineReal.setMap(null);
            delete temp.polylineReal;
            //alert('已经删除实时轨迹线');
        }
    }
    catch (ex) {
        showError("deleteRealLine", ex);
    }
}
//mapRealTime[lines]对象： 包含了所有线条
//画线部分函数Polyline
function deleteLine(lineid)//mapRealTime["infoWindow"].id是重点！！！！！！！！！！
{
    try {
        //先判断infoWindow是否与当前这个线路标记关联（当显示infoWindow的时候会把这个待显示的车辆或站点的id关联到信息展示窗体）
        if (mapRealTime["infoWindow"].id === lineid) {
            closeInfoWindow();
        }
        if (lineid === mapRealTime.currentEditLine) {
            stopEditLineAnchor(lineid);
        }
        if (mapRealTime.drawLines[lineid]) {
            var arrMarkers = mapRealTime.drawLines[lineid].textPoint;
            for (var i = 0; i < arrMarkers.length; i++)    //针对每一条线路，把它所有的点旁边的文本说明删掉！
            {
                arrMarkers[i].setMap(null);
            }

            AMap.event.removeListener(mapRealTime.drawLines[lineid].markerEvent);
            mapRealTime.drawLines[lineid].marker.setMap(null);
            delete mapRealTime.drawLines[lineid];
        }
    }
    catch (ex) {
        showError("deleteLine", ex);
    }
}
//删除所有线路
function deleteAllLines() {
    var allLineids = [];
    for (var lineid in mapRealTime.drawLines) {
        if (mapRealTime.drawLines.hasOwnProperty(lineid)) {
            allLineids.push(lineid);
        }
    }
    for (var i = 0; i < allLineids.length; i++) {
        var lineid = allLineids[i];
        deleteLine(lineid);
    }
    mapRealTime.drawLines = {}; //重置所有线路
}
function addLine(strVehInfo) {
    try {
        var foo = strToJson(strVehInfo);
        var strJson = foo.line;
        var strColor = foo.color;
        var mapset = foo.mapset;//本次画线路的地图设置

        var lineid;
        var linename;
        var lineWidth;
        var lineColor = getRgb(strColor);

        lineid = strJson.ID;
        if (mapRealTime.drawLines[lineid])//【严重警告！关于线路的mapRealTime.drawLines[lineid]   需要用[]符号而不是点符号来引用对应的对象！】
        {
            updateLine(strJson, lineColor);  //重复线路直接更新线路属性
            return;
        }

        linename = strJson.Name;
        lineWidth = strJson.Width;
        var linepoints = strJson.Points;
        if (linepoints instanceof Array)  //说明是多个锚点！C#：list<>
        {
            var i;
            var lng;
            var lat;
            var polylineArr = []; //经纬度坐标数组

            for (i = 0; i < linepoints.length; i++) {
                lng = linepoints[i].Longitude_Off;
                lat = linepoints[i].Latitude_Off;
                //这里需要先删掉不符合坐标要求的点吗？？不然历史地图上的线条会一直延伸到很远很远的离谱坐标点（0,0）！！
                if (lng && lat) {
                    polylineArr.push(new AMap.LngLat(lng, lat));
                }
            }
            if (lineWidth === 0) {
                lineWidth = 4;  //线条宽度默认为4
            }
            var polyline = new AMap.Polyline(
                {
                    map: mapRealTime,
                    path: polylineArr,          //设置线覆盖物路径
                    strokeColor: lineColor, //"#3366FF", //线颜色
                    strokeOpacity: 1,       //线透明度
                    strokeWeight: lineWidth, //4,        //线宽
                    strokeStyle: "solid",   //线样式  "dashed"
                    strokeDasharray: [10, 6, 3, 6], //补充线样式
                    icons: [{ type: "FORWARD_ARROW", offset: '25%' }, { type: "FORWARD_ARROW", offset: '65%' }], //线的箭头样式 
                    showDir: true
                });
            //构造信息窗口对象
            var clickEvent = AMap.event.addListener(polyline, "click", function (e)  //线路信息
            {
                try {
                    var x = e.lnglat.getLng();
                    var y = e.lnglat.getLat();

                    var text = "线路名称：" + linename;
                    setInfoWindowContent(text);
                    openInfoWindow(x, y, lineid, false);
                }
                catch (ex) {
                    showError("线路单击事件", ex);
                }
            });

            mapRealTime.drawLines[lineid] = { marker: polyline, markerEvent: clickEvent, textPoint: [] }; //str: linename,

            if (mapRealTime.options.iLineSnchorShow || mapset) {
                showlineSeq(true);
            }
            else {
                showlineSeq(false);
            }
            var currentBounds = getBounds();
            for (var i = 0; i < polylineArr.length; i++) {
                var lineLngLat = polylineArr[i];
                if (currentBounds.contains(lineLngLat))//20170412:如果如果有一部分在视野内，就不用缩放；所有的点都不在视野内，就动一下比例尺，让线路能完整显示；
                {
                    return;
                }
            }
            setFitView([polyline]);
        }
    }
    catch (ex) {
        showError("addLine", ex);
    }
}
//更新线路信息：初期目的只是要更新该线路的颜色
function updateLine(strJson, lineColor) {
    try {
        var lineid = strJson.ID;
        var preoption = mapRealTime.drawLines[lineid].marker.getOptions();
        preoption.strokeColor = lineColor;
        mapRealTime.drawLines[lineid].marker.setOptions(preoption);
    }
    catch (ex) {
        showError("updateLine", ex);
    }
}
//这里不需要针对特定线路吧？应该是针对所有的线路。如果要针对特定线路，可以加一个参数lineid
function showlineSeq(isShow)//添加线路上每个点的序号！也就是画线的时候，把线条上的path: polylineArr 属性里的每个坐标点的顺序写出来
{
    try {
        for (var lineid in mapRealTime.drawLines) {
            if (mapRealTime.drawLines.hasOwnProperty(lineid)) {
                var path = mapRealTime.drawLines[lineid].marker.getPath();
                //var arrMarkers = mapRealTime.drawLines.lineid.textPoint;//所有的点标记：显示的就是数字！
                if (isShow)   //注意这里的判断：数组长度为0，如果长度不为0，说明已经画了数字说明，就不必画了！在删除线路锚点的数字说明的时候，会把textPoint属性设置为空数组！
                {
                    //alert('开始判断 ' + lineid);
                    if (mapRealTime.drawLines[lineid].textPoint.length === 0) {
                        //alert('开始创建 ' + lineid);
                        for (var i = 0; i < path.length; i++)    //针对每一条线路，在所有的点旁边加一个文本说明！
                        {
                            var lng = path[i].getLng();
                            var lat = path[i].getLat(); //if(lng===0 || lat===0)alert('有0！！！');
                            var point = createLineSeq(lng, lat, i + 1);
                            mapRealTime.drawLines[lineid].textPoint.push(point);
                        }
                    }
                    else {
                        //alert('数组长度不为0！！ '  + lineid);
                    }
                }
                else {
                    //alert('开始删掉数字序号点 ' + lineid);
                    for (var i = 0; i < mapRealTime.drawLines[lineid].textPoint.length; i++)    //针对每一条线路，在所有的点旁边加一个文本说明！
                    {
                        mapRealTime.drawLines[lineid].textPoint[i].setMap(null);
                    }
                    mapRealTime.drawLines[lineid].textPoint = []; //重置数组，和初始化这个属性的时候一样（要保证上面遍历的时候不会出错！）
                }
            }
        }
    }
    catch (ex) {
        showError("showlineSeq", ex);
    }

}
function createLineSeq(lng, lat, i) {
    return new AMap.Marker(
        {
            map: mapRealTime,
            position: [lng, lat],
            //offset: new AMap.Pixel(-2, -2),  //相对于基点的偏移位置
            content: "<div style='color:black ; font-size:large; font-weight:bold '>" + i + "</div>"  //i.toString()
        }); //<div style='color:Blue;font-size:small; height: 20px; line-height: 20px; width: 600%;  '>" + SimpleName + "</div>";     //height: 20px; line-height: 20px; width: 300%; 
}
//让特定的线路处于编辑状态
function editLineAnchor(lid) {
    try {
        for (var lineid in mapRealTime.drawLines) {
            if (mapRealTime.drawLines.hasOwnProperty(lineid)) {
                if (lineid == lid) {
                    if (!mapRealTime.options.iLineSnchorShow)//如果地图的全局设置没有处于画锚点的状态，那么就要为该线路单独画出对应的锚点
                    {
                        var path = mapRealTime.drawLines[lineid].marker.getPath();
                        if (mapRealTime.drawLines[lineid].textPoint.length === 0) {
                            for (var i = 0; i < path.length; i++)    //针对每一条线路，在所有的点旁边加一个文本说明！
                            {
                                var lng = path[i].getLng();
                                var lat = path[i].getLat(); //if(lng===0 || lat===0)alert('有0！！！');
                                var point = createLineSeq(lng, lat, i + 1);
                                mapRealTime.drawLines[lineid].textPoint.push(point);
                            }
                        }
                    }
                    var lineEditor = new AMap.PolyEditor(mapRealTime, mapRealTime.drawLines[lineid].marker);
                    AMap.event.addListener(lineEditor, 'end', function (type, target) {
                        //编辑完之后！
                        interWinform(type.target.getPath(), 'editLineAnchor');
                        //关闭编辑状态
                        //lineEditor.close();
                        //如果地图的全局设置没有处于画锚点的状态，那么就要删除为该线路单独画出的锚点
                        if (!mapRealTime.options.iLineSnchorShow) {
                            var lineid = mapRealTime.currentEditLine;
                            for (var i = 0; i < mapRealTime.drawLines[lineid].textPoint.length; i++)    //针对每一条线路，在所有的点旁边加一个文本说明！
                            {
                                mapRealTime.drawLines[lineid].textPoint[i].setMap(null);
                            }
                            mapRealTime.drawLines[lineid].textPoint = []; //重置数组，和初始化这个属性的时候一样（要保证上面遍历的时候不会出错！）
                        }
                        delete mapRealTime.currentEditLine;
                        delete mapRealTime.lineEditor;
                    });
                    mapRealTime.currentEditLine = lineid;//全局字段，在编辑后直接删掉该字段
                    mapRealTime.lineEditor = lineEditor;
                    lineEditor.open();
                    //alert('左键双击地图可以结束编辑状态：线路进入编辑状态，其中：不透明点为实际结点，鼠标左键单击该类节点可进行删除操作；半透明点为虚拟节点，单击该类节点将为多边形/折线新增结点；实际结点和虚拟节点均可进行拖动操作，以改变多边形/折线的形状');
                    break;
                }
            }
        }
    }
    catch (ex) {
        showError("editLineAnchor", ex);
    }
}
function stopEditLineAnchor(lid) {
    try {
        if (mapRealTime.lineEditor)//编辑线路锚点的时候
        {
            mapRealTime.lineEditor.close();//触发对应的编辑结束事件：事件里会自动回调C#的方法
            delete mapRealTime.lineEditor;
        }
    }
    catch (ex) {
        showError("stopEditLineAnchor", ex);
    }
}
//这里设置一个字段：mapRealTime.DrawTrackMode：代表当前所属的画轨迹、播放轨迹的模式：1：不画、不播放；2：不先画轨迹，而是边播放边画、3：正常：先画轨迹，然后正常播放
function drawHistoryLine(strVehInfo) {
    var strJson = strToJson(strVehInfo);
    var limitSpeed = strJson.limit; //limitSpeed, lineAnchors = linqRet
    if (true)//这个代码块是为了画起始和终点站点
    {
        var firstStat = strJson.firstStat; //起始站点
        var lastStat = strJson.lastStat; //结束站点
        if (firstStat) {
            mapRealTime.HistorylinesfirstStatId = firstStat.Id;
            addStat(firstStat);
        }
        if (lastStat) {
            mapRealTime.HistorylineslastStatId = lastStat.Id;
            addStat(lastStat);
        }
    }
    var lineAnchors = strJson.lineAnchors; //limitSpeed, lineAnchors = linqRet 在C#端是个可枚举的对象
    var vehcode = strJson.vehcode;
    //DrawTrackFirst：先画出轨迹；DrawTrack：如果没有先画出轨迹，那么就在播放的时候，边播放边画轨迹
    if (!mapRealTime.options.DrawTrackFirst && !mapRealTime.options.DrawTrack) {
        mapRealTime.DrawTrackMode = 1; //alert('mode1');
        drawHistLineMode2(lineAnchors, vehcode);
        return;
    }
    if (!mapRealTime.options.DrawTrackFirst && mapRealTime.options.DrawTrack) {
        mapRealTime.DrawTrackMode = 2; //alert('mode2');
        drawHistLineMode2(lineAnchors, vehcode);
        return;
    }
    //否则的话，就是正常的情况：先画出轨迹，然后正常播放
    mapRealTime.DrawTrackMode = 3; //alert('mode3');
    drawHistoryLineEx(lineAnchors, limitSpeed, vehcode);
}
//第二种模式：先画出“起始”和“结束”两个旗帜、以及起始位置的车子
function drawHistLineMode2(strJson, vehcode) {
    try {
        if (mapRealTime.Historylines)//如果历史轨迹已经有了，那么就不再画！
        {
            alert('已经有了历史轨迹，不能再画');
            return;
        }

        mapRealTime.Historylines = {}; //初始化历史轨迹对象！
        mapRealTime.Historylines.textPoint = []; //保存所有的点！
        mapRealTime.Historylines.hisTrickPoints = strJson;

        var value1 = getHistorySet();
        var lineWidth = value1.width;
        var opacity = value1.opa;
        var isshow = value1.isshowpoint;

        if (strJson instanceof Array)  //说明是多个锚点！C#：list<>
        {
            if (strJson.length > 0) {
                var index = 0;
                var lnglat = getHistVehLngLat(strJson[index]);
                var lng = lnglat.lng;
                var lat = lnglat.lat;
                //起始旗子和起始车辆
                drawFlag(lng, lat, true);
                //画一个车辆！
                var marker = new AMap.Marker(
                    {
                        map: mapRealTime,
                        position: [lng, lat],
                        offset: new AMap.Pixel(-10, -10),  //相对于基点的偏移位置
                        autoRotation: true,
                        topWhenClick: true,
                        content: '',
                        visible: true //一开始就显示
                    });
                strJson[0].g = vehcode;
                var markercontenttemp = setHistoryMarkerContent(strJson[0], false);
                marker.setContent(markercontenttemp); 	  //更新内容
                marker.setzIndex(105);
                mapRealTime.Historylines.veh = marker;
                mapRealTime.Historylines.veh.histId = 1;

                //画结束旗子
                index = strJson.length - 1;
                lnglat = getHistVehLngLat(strJson[index]);
                lng = lnglat.lng;
                lat = lnglat.lat;
                drawFlag(lng, lat, false);

                //把起始旗子和终点旗子显示出来
                var markerArr = [];
                markerArr.push(mapRealTime.Historylines.start);
                markerArr.push(mapRealTime.Historylines.stop);
                setFitView(markerArr);
            }
            //下面画一个空的轨迹线条。稍后播放的时候，可以边播放边给这个轨迹添加坐标数据、从而延长该轨迹
            var polylineArr = []; //经纬度坐标数组
            var lines = []; //把轨迹线条加入lines数组！
            var polyline = getHisTempLine(polylineArr, "#0000FF", opacity, lineWidth);
            lines.push(polyline);
            mapRealTime.Historylines.lines = lines; //用mapRealTime.Historylines.lines统一保存轨迹线条，在其他地方有用处

        }
    }
    catch (ex) {
        showError("drawHistLineMode2", ex);
    }
}
//历史轨迹查询部分的线条操作
function drawHistoryLineEx(strJson, limitSpeed, vehcode) {
    try {
        if (mapRealTime.Historylines)//如果历史轨迹已经有了，那么就不再画！
        {
            alert('已经有了历史轨迹，不能再画');
            return;
        }
        //var strJson = strToJson(strVehInfo);

        mapRealTime.Historylines = {}; //初始化历史轨迹对象！
        mapRealTime.Historylines.textPoint = []; //保存所有的点！
        mapRealTime.Historylines.hisTrickPoints = strJson; //保存所有的点！留待关于休息点的操作。

        var value1 = getHistorySet();
        var lineWidth = value1.width;
        var opacity = value1.opa;
        var isshow = value1.isshowpoint;
        var isdiffcolor = value1.isdiffcolor;
        //alert('1');
        if (strJson instanceof Array)  //说明是多个锚点！C#：list<>
        {
            var limitspeedret = getlimitspeed(limitSpeed);

            var i = 0;
            var lnglat;
            var lng;
            var lat;
            var speed = 0;
            var polylineArr = []; //经纬度坐标数组
            var polylineAnchors = []; //strJson[i]坐标数组
            var lines = []; //不管是不是按速度分色，都要把轨迹线条加入lines数组！
            var lastSpeed = 0; //上一次的速度
            var sp1 = limitspeedret.limitspeed1;
            var sp2 = limitspeedret.limitspeed2; //2个速度限制
            //alert('2');
            //alert(sp1.toString() + "::" + sp2.toString() + "");

            for (i = 0; i < strJson.length; i++) {
                var item = strJson[i];
                lnglat = getHistVehLngLat(item);
                lng = lnglat.lng;
                lat = lnglat.lat;
                //if (isNumber(strJson[i].Speed)) alert('number');
                if (!isdiffcolor)//如果不是分速分色，就用一条线！否则用很多短线连成一条长线
                {
                    polylineArr.push(new AMap.LngLat(lng, lat));
                }
                else {
                    speed = item.c || item.Speed || 0; //alert("...." + speed);
                    if (speed < sp1) {
                        if (lastSpeed < sp1)//如果上次的速度也小于第1个限速值，那么就把这个点的坐标直接附加到上次的坐标数组里；否则就根据之前的坐标数组构建一个线条，并把线条加入到线条数组里！并创建一个新的坐标数组！
                        {
                            polylineArr.push(new AMap.LngLat(lng, lat));
                            polylineAnchors.push(item);
                        }
                        else {
                            polylineArr.push(new AMap.LngLat(lng, lat)); //并且把新的坐标放入原来的坐标数组里【如果没有这一句，会出现不同线条间的空白断裂！】
                            var color = getColor(sp1, sp2, lastSpeed);
                            var polyline = getHisTempLine(polylineArr, color, opacity, lineWidth);
                            lines.push(polyline);
                            polyline.strJson = polylineAnchors;

                            polylineArr = []; //创建新的坐标数组！
                            polylineArr.push(new AMap.LngLat(lng, lat));
                            polylineAnchors = []; //创建新的坐标数组！
                            polylineAnchors.push(item);
                        }
                    }
                    else if (speed < sp2) {
                        if (lastSpeed < sp2)//如果上次的速度也小于第2个限速值，那么就把这个点的坐标直接附加到上次的坐标数组里；否则就根据之前的坐标数组构建一个线条，并把线条加入到线条数组里！并创建一个新的坐标数组！
                        {
                            //alert("........" + lastSpeed);
                            polylineArr.push(new AMap.LngLat(lng, lat));
                            polylineAnchors.push(item);
                        }
                        else {
                            polylineArr.push(new AMap.LngLat(lng, lat)); //并且把新的坐标放入原来的坐标数组里【如果没有这一句，会出现不同线条间的空白断裂！】
                            var color = getColor(sp1, sp2, lastSpeed);
                            var polyline = getHisTempLine(polylineArr, color, opacity, lineWidth);
                            lines.push(polyline);
                            polyline.strJson = polylineAnchors;

                            polylineArr = []; //创建新的坐标数组！
                            polylineArr.push(new AMap.LngLat(lng, lat));
                            polylineAnchors = []; //创建新的坐标数组！
                            polylineAnchors.push(item);
                        }
                    }
                    else // if( speed >= sp2)
                    {
                        if (lastSpeed >= sp2)//如果上次的速度也大于等于第2个限速值，那么就把这个点的坐标直接附加到上次的坐标数组里；否则就根据之前的坐标数组构建一个线条，并把线条加入到线条数组里！并创建一个新的坐标数组！
                        {
                            polylineArr.push(new AMap.LngLat(lng, lat));
                            polylineAnchors.push(item);
                        }
                        else {
                            polylineArr.push(new AMap.LngLat(lng, lat)); //并且把新的坐标放入原来的坐标数组里【如果没有这一句，会出现不同线条间的空白断裂！】
                            var color = getColor(sp1, sp2, lastSpeed);
                            var polyline = getHisTempLine(polylineArr, color, opacity, lineWidth);
                            lines.push(polyline);
                            polyline.strJson = polylineAnchors;

                            polylineArr = []; //创建新的坐标数组！
                            polylineArr.push(new AMap.LngLat(lng, lat));
                            polylineAnchors = []; //创建新的坐标数组！
                            polylineAnchors.push(item);
                        }
                    }
                    //alert("lng:" + lng.toString() + "   lat:" + lat.toString() + "  speed:" + speed.toString());
                    lastSpeed = speed;
                }
                if (i === strJson.length - 1)  //终点：应该把polylineArr集合加进lines！
                {
                    var color = getColor(sp1, sp2, lastSpeed);
                    var polyline = getHisTempLine(polylineArr, color, opacity, lineWidth);
                    lines.push(polyline);
                    polyline.strJson = polylineAnchors;
                }

                if (i === 0)   //起点【画旗子】
                {
                    drawFlag(lng, lat, true);
                    //画一个车辆！
                    var marker = new AMap.Marker(
                        {
                            map: mapRealTime,
                            position: [lng, lat],
                            offset: new AMap.Pixel(-10, -10),  //相对于基点的偏移位置
                            autoRotation: true,
                            topWhenClick: true,
                            content: '',
                            visible: true //一开始就显示
                        });
                    strJson[0].g = vehcode;
                    var markercontenttemp = setHistoryMarkerContent(strJson[0], false);
                    marker.setContent(markercontenttemp); 	  //更新内容
                    marker.setzIndex(105);
                    mapRealTime.Historylines.veh = marker;
                    mapRealTime.Historylines.veh.histId = 1;
                    AMap.event.addListener(marker, "click", function (e) {
                        showHistoryInfoWindow(1);
                    });

                    //画一个空圆形图标作为随鼠标指针移动的标记！
                    var circleMarker = new AMap.Marker(
                        {
                            map: mapRealTime,
                            position: [lng, lat],
                            offset: new AMap.Pixel(-4, -4),  //相对于基点的偏移位置
                            autoRotation: true,
                            topWhenClick: true,
                            content: '',
                            visible: true
                        });

                    var circleMarkercontent = getHistoryCircleMarkerContent(strJson[0]);
                    circleMarker.setContent(circleMarkercontent); 	  //更新内容
                    circleMarker.setzIndex(105);
                    AMap.event.addListener(circleMarker, "click", function (e) {
                        showHistoryInfoWindow(2);
                    });
                    mapRealTime.Historylines.vehCircle = circleMarker;
                    mapRealTime.Historylines.vehCircle.histId = 1;
                }
                else if (i === strJson.length - 1)  //终点【画旗子】
                {
                    drawFlag(lng, lat, false);
                }
            }
            //alert('4');
            if (!isdiffcolor)//如果不是分速分色
            {
                var polyline = getHisTempLine(polylineArr, "#0000FF", opacity, lineWidth); //单一的蓝色！【不按速度分色的时候也要把这个线条加入lines集合！】
                lines.push(polyline);
                polyline.strJson = strJson;
                moveHistVeh(polyline);
                setFitView([polyline]); //把地图范围设为： 当前画的线的范围，
            }
            else {
                for (var i = 0; i < lines.length; i++) {
                    var polyline = lines[i];
                    moveHistVeh(polyline); // polyline.strJson 这个属性是在前面赋值的！
                }
                setFitView(lines); //把地图范围设为： 当前画的很多条短线的范围
            }
            //alert('5');
            mapRealTime.Historylines.lines = lines; //用mapRealTime.Historylines.lines统一保存轨迹线条，在其他地方有用处
            //alert("一共有多少个线条：" + lines.length.toString());

            //showHistorylineSeq(isshow);
        }
    }
    catch (ex) {
        showError("drawHistoryLineEx", ex);
    }
}
function showHistoryInfoWindow(param) {
    try {
        if (mapRealTime.playing)//如果正在播放，就不允许移动圆点图标
        {
            return;
        }
        if (param === 1) {
            //mapRealTime.Historylines.vehCircle.histId变量会在moveHistVeh方法内赋值、还会在历史车辆图标位置变动的时候赋值！
            //if (mapRealTime.Historylines.veh.histId)
            //{
            var index = mapRealTime.Historylines.veh.histId;
            if (index < 0) {
                index = 0;
            }
            else {
                index++;
            }
            //if (index > 0)
            //{
            //    index--;
            //}
            interWinform(index, "showHistoryInfoWindow"); //通知winform客户端，让winform反过来调用JS方法setInfoWindowPos，弹出InfoWindow
            //}
        }
        else {
            //mapRealTime.Historylines.vehCircle.histId变量会在moveHistVeh方法内赋值、还会在历史车辆图标位置变动的时候赋值！
            //if (mapRealTime.Historylines.vehCircle.histId)
            //{
            var index = mapRealTime.Historylines.vehCircle.histId;
            if (index < 0) {
                index = 0;
            }
            interWinform(index, "showHistoryInfoWindow"); //通知winform客户端，让winform反过来调用JS方法setInfoWindowPos，弹出InfoWindow
            //}
        }

    }
    catch (ex) {
        showError("车辆点击事件", ex);
    }
}
//获取线条颜色
function getColor(sp1, sp2, lastspeed) {
    try {
        //alert("速度：" + lastspeed + "接着是颜色：");
        if (lastspeed < sp1) {
            //alert("速度：" + lastspeed + "绿色：");
            return "#1D8EFD"; // "#1354B9"; //"#3CB371";       //线颜色：统一为绿色！
        }
        else if (lastspeed < sp2) {
            //alert("速度：" + lastspeed + "黄色：");
            return "#225A09"; //"#CC770B"; //"#FFFF00";      //线颜色：统一为黄色！
        }
        else {
            //alert("速度：" + lastspeed + "红色：");
            return "#E3360D"; // "#E6360D"; //"#8B0000";      //线颜色：统一为红色！
        }
    }
    catch (ex) {
        showError("getColor", ex);
    }
}
function getHisTempLine(polylineArr, color, opacity, lineWidth) {
    try {
        var polyline = new AMap.Polyline(
            {
                map: mapRealTime,
                path: polylineArr,          //设置线覆盖物路径
                strokeColor: color,  //"#000000",     //线颜色：统一为黑色！            红色：#CC0000
                strokeOpacity: opacity,       //线透明度
                strokeWeight: lineWidth, //2,        //线宽
                strokeStyle: "solid",   //线样式  "dashed"
                strokeDasharray: [10, 6, 3, 6], //补充线样式
                icons: [{ type: "FORWARD_ARROW", offset: '25%' }, { type: "FORWARD_ARROW", offset: '65%' }] //线的箭头样式 
            });
        var clickEvent = AMap.event.addListener(polyline, "click", function (e)  //线路信息
        {
            getNearestPoint(e);
        });

        //轨迹线上点击时（点击位置与轨迹点距离像素距离小于5的最近的一个轨迹点），显示该轨迹点的状态，给调用者触发一个车辆被点击事件，事件参数里，带出该点的时间即可，由调用都进行进一步的响应操作
        //        var clickEvent = AMap.event.addListener(polyline, "click", function (e)  //线路信息
        //        {
        //            try
        //            {
        //                var elng = e.lnglat.getLng();
        //                var elat = e.lnglat.getLat();
        //                var zoomValue = getZoom();
        //                var currPixel = mapRealTime.lnglatToPixel([elng, elat], zoomValue);
        //                var x = currPixel.getX();
        //                var y = currPixel.getY();
        //                //var retJsonArr = []; //存储所有符合条件的坐标点（鼠标点击坐标点之间像素距离小于5的点）及对应点的时间数据
        //                var strJson = mapRealTime.Historylines.hisTrickPoints;
        //                var signal = 10000; //作为标志，随便给了一个大的数字，用距离点击点：最小的像素距离跟这个signal进行对比，把那个最小像素距离的轨迹点找出来
        //                var index = -1; //标志着目标轨迹点在strJson数组里的索引下标
        //                //var isFind = false;
        //                for (var i = 0; i < strJson.length; i++)
        //                {
        //                    var lnglat = getHistVehLngLat(strJson[i]);
        //                    var lng = lnglat.lng;
        //                    var lat = lnglat.lat;
        //                    var pixel = mapRealTime.lnglatToPixel([lng, lat], zoomValue);
        //                    var tempX = pixel.getX();
        //                    var tempY = pixel.getY();
        //                    //pow(x,y)	返回 x 的 y 次幂。JS函数
        //                    //sqrt(x)	返回数的平方根。
        //                    var retSqrt = Math.pow((tempX - x), 2) + Math.pow((tempY - y), 2); //alert("retsqrt:" + retSqrt);
        //                    var ret = Math.sqrt(retSqrt);
        //                    if (ret < signal)
        //                    {
        //                        signal = ret; //将当前像素距离保存在signal里，然后用下一个轨迹点与点击点的像素距离和signal进行对比。
        //                        index = i;
        //                        //isFind = true;
        //                    }
        //                }
        //                if (index != -1)//如果不等于初始值，说明至少找到了一个点
        //                {
        //                    var id = strJson[index].f || strJson[index].id || strJson[index].ID; //strJson[index].d || strJson[index].pos_time || strJson[index].GpsTime;
        //                    interWinform(id, "getminhisdist");
        //                }
        //            }
        //            catch (ex)
        //            {
        //                showError("获取与鼠标点击位置的像素距离小于5的点", ex);
        //            }
        //        });
        return polyline;
    }
    catch (ex) {
        showError("getHisTempLine", ex);
    }
}
function getNearestPoint(e) {
    if (mapRealTime.playing)//如果正在播放，就不允许移动圆点图标
    {
        return;
    }
    if (mapRealTime.Historylines && mapRealTime.Historylines.hisTrickPoints) {
        try {
            var elng = e.lnglat.getLng();
            var elat = e.lnglat.getLat();
            var zoomValue = getZoom();
            var currPixel = mapRealTime.lnglatToPixel([elng, elat], zoomValue);
            var x = currPixel.getX();
            var y = currPixel.getY();

            //var retJsonArr = []; //存储所有符合条件的坐标点（鼠标点击坐标点之间像素距离小于5的点）及对应点的时间数据

            var strJson = mapRealTime.Historylines.hisTrickPoints;
            var signal = 10000; //作为标志，随便给了一个大的数字，用距离点击点：最小的像素距离跟这个signal进行对比，把那个最小像素距离的轨迹点找出来
            var index = -1; //标志着目标轨迹点在strJson数组里的索引下标
            //var isFind = false;
            var lng, lat;
            for (var i = 0; i < strJson.length; i++) {
                var lnglat = getHistVehLngLat(strJson[i]);
                lng = lnglat.lng;
                lat = lnglat.lat;

                var pixel = mapRealTime.lnglatToPixel([lng, lat], zoomValue);
                var tempX = pixel.getX();
                var tempY = pixel.getY();
                //pow(x,y)	返回 x 的 y 次幂。JS函数
                //sqrt(x)	返回数的平方根。
                var retSqrt = Math.pow((tempX - x), 2) + Math.pow((tempY - y), 2); //alert("retsqrt:" + retSqrt);
                var ret = Math.sqrt(retSqrt);

                if (ret < 15)//signal)
                {
                    signal = ret; //将当前像素距离保存在signal里，然后用下一个轨迹点与点击点的像素距离和signal进行对比。
                    index = i;
                    //isFind = true;

                    index = i;
                    var circleMarker = mapRealTime.Historylines.vehCircle;
                    if (circleMarker) {
                        var circleMarkercontent = getHistoryCircleMarkerContent(strJson[i]);
                        circleMarker.setContent(circleMarkercontent); 	  //更新内容
                        circleMarker.setPosition([lng, lat]);
                        var id = strJson[index].f || strJson[index].id || strJson[index].ID; //strJson[index].d || strJson[index].pos_time || strJson[index].GpsTime;
                        mapRealTime.Historylines.vehCircle.histId = id;
                    }
                    return;
                }
            }
            //if (index != -1)//如果不等于初始值，说明至少找到了一个点
            //{
            //    if (signal <= 15)//20
            //    {
            //        //var id = strJson[index].f || strJson[index].id || strJson[index].ID; //strJson[index].d || strJson[index].pos_time || strJson[index].GpsTime;
            //        //interWinform(id, "getminhisdist");
            //        var circleMarker = mapRealTime.Historylines.vehCircle;
            //        if (circleMarker)
            //        {
            //            var circleMarkercontent = getHistoryCircleMarkerContent(strJson[index]);
            //            circleMarker.setContent(circleMarkercontent); 	  //更新内容
            //            circleMarker.setPosition([lng, lat]);alert('lng:' + lng + "   lat:" + lat);
            //            var id = strJson[index].f || strJson[index].id || strJson[index].ID; //strJson[index].d || strJson[index].pos_time || strJson[index].GpsTime;
            //            mapRealTime.Historylines.vehCircle.histId = id;
            //        }
            //    }
            //}
        }
        catch (ex) {
            showError("获取与鼠标点击位置的像素距离小于5的点", ex);
        }
    }

}
function setPlayStatus(playingstatus) {
    mapRealTime.playing = playingstatus;
}
//当鼠标在历史轨迹线上移动时，当鼠标移到任何一个轨迹点的时候，就把历史车辆定位到该轨迹点上，并同时让历史表格的数据同步到对于记录
function moveHistVeh(polyline) {
    AMap.event.addListener(polyline, "mouseover", function (e)  //鼠标经过，让车子位于当前，同时让历史表格的数据同步到对于记录
    {
        try {
            if (mapRealTime.playing)//如果正在播放，就不允许移动圆点图标
            {
                return;
            }
            var zoomValue = getZoom();
            var elng = e.lnglat.getLng();
            var elat = e.lnglat.getLat(); //alert(elng + "  " + elat);
            var currPixel = mapRealTime.lnglatToPixel([elng, elat], zoomValue);
            var x = currPixel.getX();
            var y = currPixel.getY();
            //var currLngLat = e.lnglat; //alert(currLngLat);
            var strJson = polyline.strJson;
            if (strJson) {
                //alert('strJson不是空值');
                //var signal = 10000; //作为标志，随便给了一个大的数字，用距离点击点：最小的像素距离跟这个signal进行对比，把那个最小像素距离的轨迹点找出来
                var index = -1; //标志着目标轨迹点在strJson数组里的索引下标
                for (var i = 0; i < strJson.length; i++) {
                    var lnglat = getHistVehLngLat(strJson[i]);
                    var lng = lnglat.lng;
                    var lat = lnglat.lat; //alert(lng + "  " + lat);
                    var pixel = mapRealTime.lnglatToPixel([lng, lat], zoomValue); //alert('pixel   ' + pixel);
                    var tempX = pixel.getX(); //alert(tempX);
                    var tempY = pixel.getY(); //alert(tempY);
                    //pow(x,y)	返回 x 的 y 次幂。JS函数
                    //sqrt(x)	返回数的平方根。
                    var retSqrt = Math.pow((tempX - x), 2) + Math.pow((tempY - y), 2); //alert("retsqrt:" + retSqrt);
                    var ret = Math.sqrt(retSqrt);
                    if (ret < 8)//if (ret < signal)//估计是数字是8
                    {
                        //signal = ret; //将当前像素距离保存在signal里，然后用下一个轨迹点与点击点的像素距离和signal进行对比。
                        index = i;
                        var circleMarker = mapRealTime.Historylines.vehCircle;
                        if (circleMarker) {
                            var circleMarkercontent = getHistoryCircleMarkerContent(strJson[i]);
                            circleMarker.setContent(circleMarkercontent); 	  //更新内容
                            circleMarker.setPosition([lng, lat]);
                            var id = strJson[index].f || strJson[index].id || strJson[index].ID; //strJson[index].d || strJson[index].pos_time || strJson[index].GpsTime;
                            mapRealTime.Historylines.vehCircle.histId = id;
                        }
                        return;
                    }
                }
                //if (index != -1)//如果不等于初始值，说明至少找到了一个点
                //{
                //    //var id = strJson[index].f || strJson[index].id || strJson[index].ID; //strJson[index].d || strJson[index].pos_time || strJson[index].GpsTime;
                //    //interWinform(id, "getminhisdist");
                //}
            }

        }
        catch (ex) {
            showError("moveHistVeh", ex);
        }
    });
}
//根据两个经纬度数据获取对应的两个像素点的距离。lngLat格式：120,30,121,32
function getPixelFromLngLat(lngLat)//strLngLat1, strLngLat2
{
    try {
        var strArr = lngLat.split(",");
        if (strArr.length >= 4) {
            var zoomValue = getZoom();

            var lng1 = Number(strArr[0]);
            var lat1 = Number(strArr[1]);
            var lng2 = Number(strArr[2]);
            var lat2 = Number(strArr[3]);

            var pixel1 = mapRealTime.lnglatToPixel([lng1, lat1], zoomValue);
            var tempX1 = pixel1.getX();
            var tempY1 = pixel1.getY();

            var pixel2 = mapRealTime.lnglatToPixel([lng2, lat2], zoomValue);
            var tempX2 = pixel2.getX();
            var tempY2 = pixel2.getY();

            //pow(x,y)	返回 x 的 y 次幂。JS函数
            //sqrt(x)	返回数的平方根。
            var retSqrt = Math.pow((tempX1 - tempX2), 2) + Math.pow((tempY1 - tempY2), 2); //alert("retsqrt:" + retSqrt);
            var ret = Math.sqrt(retSqrt);
            interWinform(ret, "getPixelFromLngLat");
            return ret;
        }
    }
    catch (ex) {
        showError("getPixelFromLngLat", ex);
    }
}
function getlimitspeed(limitspeed) {
    try {
        var arr = limitspeed.toString().split(',');
        if (arr.length === 2) {
            var temp1 = Number(arr[0]) || 40;
            var temp2 = Number(arr[1]) || 70;
            if (!isNumber(temp1)) {
                temp1 = 40;
            }
            if (!isNumber(temp2)) {
                temp2 = 70;
            }
            var ret = {
                limitspeed1: temp1,
                limitspeed2: temp2
            };
            return ret;
        }
        else {
            var ret = {
                limitspeed1: 40,
                limitspeed2: 70,
                limitspeed3: 150
            };
            return ret;
        }
    }
    catch (ex) {
        showError("getlimitspeed", ex);
    }
}
function getHistorySet()//获取历史地图的设置
{
    try {
        var lineWidth;
        var opacity;
        var isshow;
        var isdiffcolor;
        if (mapRealTime.options.NumHisTrackLineWidth === 0)//地图设置里关于历史轨迹线的宽度、透明度设置【NumHisTrackLineWidth是数字！】
        {
            lineWidth = 1;
        }
        else {
            lineWidth = mapRealTime.options.NumHisTrackLineWidth;
        }
        if (mapRealTime.options.Alpha <= 0) {
            opacity = 1; //默认完全不透明！
        }
        else {
            opacity = mapRealTime.options.Alpha;
        }
        if (mapRealTime.options.iLineSnchorShow === 1) //iLineSnchorShow { get; set; } //是否显示线路锚点(1 显示，0不显示 （默认0）)
        {
            isshow = true;
        }
        else {
            isshow = false;
        }
        if (mapRealTime.options.HistoryTrackSpeedColor) //是否分速分色显示历史轨迹
        {
            isdiffcolor = true;
        }
        else {
            isdiffcolor = false;
        }
        //alert("当前允许宽度吗？：" + mapRealTime.options.NumHisTrackLineWidth + "宽度值：" + lineWidth + '...' + "当前透明度：" + mapRealTime.options.Alpha + "透明度值：" + opacity + '...'
        //+ "当前允许显示线路锚点吗？：" + mapRealTime.options.iLineSnchorShow + "锚点值：" + isshow + '...' + "当前分速分色吗？：" + mapRealTime.options.HistoryTrackSpeedColor + "锚点值：" + isdiffcolor);
        return { width: lineWidth, opa: opacity, isshowpoint: isshow, isdiffcolor: isdiffcolor };
    }
    catch (ex) {
        showError("getHistorySet", ex);
    }
}
function setHistory() {
    try {
        if (mapRealTime.Historylines && mapRealTime.Historylines.lines)//marker)
        {
            //获取地图设置里的宽度和透明度
            var lineWidth;
            var opacity;
            var isshow;

            var value1 = getHistorySet();
            lineWidth = value1.width;
            opacity = value1.opa;
            isshow = value1.isshowpoint;

            //获取历史轨迹线之前的设置
            for (var i = 0; i < mapRealTime.Historylines.lines.length; i++) {
                var preoption = mapRealTime.Historylines.lines[i].getOptions();
                preoption.strokeOpacity = opacity;
                preoption.strokeWeight = lineWidth;

                mapRealTime.Historylines.lines[i].setOptions(preoption);
            }
            //showHistorylineSeq(isshow);
        }
    }
    catch (ex) {
        showError("setHistory", ex);
    }
}
function drawFlag(lng, lat, isStart) {
    try {
        var path = 'trImage/';
        if (isStart) {
            path += 'hbegin.png';
        }
        else {
            path += 'hend.png';
        }
        var marker = new AMap.Marker(
            {
                map: mapRealTime,
                position: [lng, lat],
                offset: new AMap.Pixel(-10, -10),  //相对于基点的偏移位置
                autoRotation: true,
                content: "<div style='float: left; padding-right: 1px; '><img src='" + path + "'/></div>"
            });
        if (isStart) {
            mapRealTime.Historylines.start = marker;
        }
        else {
            mapRealTime.Historylines.stop = marker;
        }
    }
    catch (ex) {
        showError("drawFlag", ex);
    }
}
function drawNewFlag(str) {
    try {
        var strJson = strToJson(str);
        var polylineArr = [];
        for (var i = 0; i < strJson.length; i++) {
            var item = strJson[i];
            var lnglat = getHistVehLngLat(item);
            var lng = lnglat.lng;
            var lat = lnglat.lat;
            polylineArr.push([lng, lat]);

            if (i === 0) {
                drawHistoryMiddleMarker(lng, lat, true);
            }
            else if (i === strJson.length - 1) {
                drawHistoryMiddleMarker(lng, lat, false);
            }
        }
        var polyline = getHisTempLine(polylineArr, "#FFFF00", 1, 4);
        mapRealTime.middleLine = polyline;
    }
    catch (ex) {
        showError("drawNewFlag", ex);
    }

}
function drawHistoryMiddleMarker(lng, lat, isStart) {
    try {
        var path = 'trImage/';
        if (isStart) {
            path += 'startIcon.png';
        }
        else {
            path += 'endIcon.png';
        }
        var marker = new AMap.Marker(
            {
                map: mapRealTime,
                position: [lng, lat],
                offset: new AMap.Pixel(-10, -10),  //相对于基点的偏移位置
                autoRotation: true,
                content: "<div style='float: left; padding-right: 1px; '><img src='" + path + "'/></div>"
            });
        if (isStart) {
            mapRealTime.middleStart = marker;
        }
        else {
            mapRealTime.middleStop = marker;
        }
    }
    catch (ex) {
        showError("drawHistoryMiddleMarker", ex);
    }
}
//清除中间线路
function clearNewFlag() {
    try {
        if (mapRealTime.middleStart) {
            mapRealTime.middleStart.setMap(null);
        }
        if (mapRealTime.middleStop) {
            mapRealTime.middleStop.setMap(null);
        }
        if (mapRealTime.middleLine) {
            mapRealTime.middleLine.setMap(null);
        }
    }
    catch (ex) {
        showError("clearNewFlag", ex);
    }
}
//此方法没有调用！不需要调用
function showHistorylineSeq(isShow)//添加线路上每个点的序号！也就是画线的时候，把线条上的path: polylineArr 属性里的每个坐标点的顺序写出来
{
    return;
    try {
        var lng;
        var lat;
        var path = getHistPoints();
        var arrMarkers = mapRealTime.Historylines.textPoint; //所有的点标记：显示的就是数字！
        if (isShow)   //注意这里的判断：数组长度为0，如果长度不为0，说明已经画了数字说明，就不必画了！在删除线路锚点的数字说明的时候，会把textPoint属性设置为空数组！
        {
            if (arrMarkers.length === 0) {
                //alert('path.length:::' + path.length);
                for (var i = 0; i < path.length; i++)    //针对每一条线路，在所有的点旁边加一个文本说明！
                {
                    lng = path[i].getLng();
                    lat = path[i].getLat(); //if(lng===0 || lat===0)alert('有0！！！');
                    //略过经纬度等于0的情况！
                    if (lng !== 0 && lat !== 0) {
                        var point = createLineSeq(lng, lat, i + 1);
                        arrMarkers.push(point);
                    }
                }
            }
            else {
                //TO DO..其实这里什么都不用做！.
            }
        }
        else {
            for (var i = 0; i < arrMarkers.length; i++)    //针对每一条线路，在所有的点旁边加一个文本说明！
            {
                arrMarkers[i].setMap(null);
            }
            mapRealTime.Historylines.textPoint = []; //重置数组
        }
    }
    catch (ex) {
        showError("showHistorylineSeq", ex);
    }
}
//此方法是兼容新老系统的方法。因为历史轨迹的线条：新系统有轨迹分色（这种情况下，需要很多条短线连接起来；当然也可能不分色，那就是一条线了！），老系统没有轨迹分色：就只有一条线

//参数是string类型，代表休息时间，5秒钟以上
function displayRest(strRestTime) {
    try {
        if (!mapRealTime.Historylines) {
            return;//当根本没有画轨迹的时候直接返回
        }
        if (mapRealTime.Historylines.restpoints) {
            //alert('已存在');
            return;
        }
        mapRealTime.Historylines.restpoints = []; //休息点数组，包含所有的休息点图标！删除轨迹线的时候会删除这个休息点对象

        var i_minute = Number(strRestTime); //alert("规定休息时长："+i_minute);
        var strJson = mapRealTime.Historylines.hisTrickPoints;
        if (strJson && (strJson instanceof Array)) {
            for (var i = 0; i < strJson.length; i++) {
                var item = strJson[i];
                createRestPoint(item, i_minute);
            }
        }
    }
    catch (ex) {
        showError("displayRest", ex);
    }
}
function createRestPoint(item, i_minute) {
    try {
        var i_tlength = item.e || item.tlengths || item.StopTime || 0; //停车时长，若超过参数，说明要画休息点！
        if (i_tlength >= i_minute) {
            var lnglat = getHistVehLngLat(item);
            var lng = lnglat.lng;
            var lat = lnglat.lat;
            var restid = item.f || item.id || item.ID; //strid代表客户端那边的集合hisquerytracklist的id属性！
            //var strlasttime = item.d || item.pos_time || item.GpsTime;
            var currPointText = item.i; //当前标记显示的文本
            var marker = new AMap.Marker(
                {
                    map: mapRealTime,
                    position: [lng, lat],
                    offset: new AMap.Pixel(-10, -30),  //相对于基点的偏移位置
                    content: "<div style='float: left; padding-right: 1px; '><img src='trImage/Rpoint.png'/></div>",
                    topWhenClick: true,
                    label: { content: currPointText, offset: new AMap.Pixel(-20, 30) },
                    extData: { id: restid, text: currPointText }
                });
            //这里没有把产生的事件对象保存起来，我想应该不需要了，在这里，和addVeh方法内的处理不同
            var clickEvent = AMap.event.addListener(marker, "click", function (e) {
                try {
                    if (mapRealTime.Historylines.preRestPointMarker)//如果之前点击了一个，那么它会变为红色标记，需要先变为蓝色！ mapRealTime.Historylines.preRestText代表之前的显示文本
                    {
                        var ret = "<div style='float: left; padding-right: 1px; '><img src='trImage/Rpoint.png'/></div>";
                        mapRealTime.Historylines.preRestPointMarker.setContent(ret);
                    }
                    //设置当前的为红色
                    mapRealTime.Historylines.preRestText = currPointText;
                    mapRealTime.Historylines.preRestPointMarker = marker;
                    var currpoint = "<div style='float: left; padding-right: 1px; '><img src='trImage/RpointD.png'/></div>";
                    mapRealTime.Historylines.preRestPointMarker.setContent(currpoint);

                    interWinform(restid, "displayRest");
                }
                catch (ex) {
                    showError("displayRest休息点点击出错", ex);
                }
            });

            mapRealTime.Historylines.restpoints.push(marker);
        }
    }
    catch (ex) {
        showError("createRestPoint", ex);
    }
}
function selectRestPoint(strid) {
    try {
        if (mapRealTime.Historylines && mapRealTime.Historylines.restpoints) {
            for (var i = 0; i < mapRealTime.Historylines.restpoints.length; i++) {
                var marker = mapRealTime.Historylines.restpoints[i];
                var exdata = marker.getExtData(); //这里的数据与上面的方法是相关联的！
                var restid = exdata.id;
                var currPointText = exdata.text;

                if (strid === restid.toString()) {
                    //alert('找到了：'+ restid + "  curren::"+currPointText);
                    if (mapRealTime.Historylines.preRestPointMarker)//如果之前点击了一个，那么它会变为红色标记，需要先变为蓝色！ mapRealTime.Historylines.preRestText代表之前的显示文本
                    {
                        var ret = "<div style='float: left; padding-right: 1px; '><img src='trImage/Rpoint.png'/></div>";
                        mapRealTime.Historylines.preRestPointMarker.setContent(ret);
                        mapRealTime.Historylines.preRestPointMarker.setzIndex(100); //Z-index还原为100
                    }
                    //设置当前的为红色
                    mapRealTime.Historylines.preRestText = currPointText;
                    mapRealTime.Historylines.preRestPointMarker = marker;
                    var currpoint = "<div style='float: left; padding-right: 1px; '><img src='trImage/RpointD.png'/></div>";
                    mapRealTime.Historylines.preRestPointMarker.setContent(currpoint);
                    mapRealTime.Historylines.preRestPointMarker.setzIndex(101); //Z-index变大，将图标置于最上层

                    break;
                }
            }
        }
    }
    catch (ex) {
        showError("selectRestPoint", ex);
    }
}
//显示取证图片
function displayPic() {
    try {
        if (mapRealTime.Historylines.picPoints) {
            //alert('已存在');
            return;
        }
        mapRealTime.Historylines.picPoints = []; //休息点数组，包含所有的休息点图标！删除轨迹线的时候会删除这个休息点对象

        var strJson = mapRealTime.Historylines.hisTrickPoints;
        if (strJson && (strJson instanceof Array)) {
            for (var i = 0; i < strJson.length; i++) {
                var item = strJson[i];
                createPicPoint(item);
            }
        }
    }
    catch (ex) {
        showError("displayPic", ex);
    }
}
function createPicPoint(item) {
    try {
        var lnglat = getHistVehLngLat(item);
        var lng = lnglat.lng;
        var lat = lnglat.lat;
        var restid = item.f || item.id || item.ID; //strid代表客户端那边的集合hisquerytracklist的id属性！
        //var strlasttime = item.d || item.pos_time || item.GpsTime;
        var currPointText = '查看';
        var picInfo = item.h || item.ImageInfo; //取证图片信息不为空
        if (picInfo) {
            var marker = new AMap.Marker(
                {
                    map: mapRealTime,
                    position: [lng, lat],
                    offset: new AMap.Pixel(-10, -30),  //相对于基点的偏移位置
                    content: "<div style='float: left; padding-right: 1px; '><img src='trImage/pic1.png'/></div>",
                    topWhenClick: true,
                    label: { content: currPointText, offset: new AMap.Pixel(20, 0) }//,
                    //extData: restid//{ id: restid, text: currPointText }
                });
            //这里没有把产生的事件对象保存起来，我想应该不需要了，在这里，和addVeh方法内的处理不同
            AMap.event.addListener(marker, "click", function (e) {
                try {
                    interWinform(restid, "displayPic");
                }
                catch (ex) {
                    showError("displayPic取证图标点击出错", ex);
                }
            });

            mapRealTime.Historylines.picPoints.push(marker);
        }

    }
    catch (ex) {
        showError("createPicPoint", ex);
    }
}

//20171108 显示缓行、停车图片
function drawSlowSpeedPict(strVehInfo) {
    try {
        var strJson = strToJson(strVehInfo);
        var lineAnchors = strJson.lineAnchors;
        var vehcode = strJson.vehcode;
        if (mapRealTime.Historylines.drawSlowSpeedPictPoints) {
            //alert('已存在');
            return;
        }
        mapRealTime.Historylines.drawSlowSpeedPictPoints = []; //缓行、停车图片的数组，包含所有的缓行点图标！删除轨迹线的时候会删除这个对象
        if (lineAnchors && (lineAnchors instanceof Array)) {
            for (var i = 0; i < lineAnchors.length; i++) {
                var item = lineAnchors[i];
                createSlowSpeedPicPoint(item);
            }
        }
    }
    catch (ex) {
        showError("drawSlowSpeedPict", ex);
    }
}
function createSlowSpeedPicPoint(item) {
    try {
        var lnglat = getHistVehLngLat(item);
        var lng = lnglat.lng;
        var lat = lnglat.lat;
        var restid = item.f || item.id || item.ID; //strid代表客户端那边的集合hisquerytracklist的id属性！
        //var currPointText = '查看缓行图片';
        if (item.g) {
            var marker = new AMap.Marker(
                {
                    map: mapRealTime,
                    position: [lng, lat],
                    offset: new AMap.Pixel(-10, -30),  //相对于基点的偏移位置
                    content: "<div style='float: left; padding-right: 1px; '><img src='trImage/slowSpeedD.png'/></div>",
                    topWhenClick: true,
                    //label: { content: currPointText, offset: new AMap.Pixel(20, 0) }//,
                    //extData: restid//{ id: restid, text: currPointText }
                });
            //这里没有把产生的事件对象保存起来，我想应该不需要了，在这里，和addVeh方法内的处理不同
            AMap.event.addListener(marker, "click", function (e) {
                try {
                    interWinform(restid, "drawSlowSpeedPict");
                }
                catch (ex) {
                    showError("drawSlowSpeedPict显示缓行、停车图标点击出错", ex);
                }
            });

            mapRealTime.Historylines.drawSlowSpeedPictPoints.push(marker);
        }

    }
    catch (ex) {
        showError("createSlowSpeedPicPoint", ex);
    }
}
function deleteHistory(lng, lat, isStart)//历史轨迹删除
{
    try {
        if (mapRealTime.HistorylinesfirstStatId) {
            deleteStations(mapRealTime.HistorylinesfirstStatId.toString());
            delete mapRealTime.HistorylinesfirstStatId;
        }
        if (mapRealTime.HistorylineslastStatId) {
            deleteStations(mapRealTime.HistorylineslastStatId.toString());
            delete mapRealTime.HistorylineslastStatId;
        }
        if (mapRealTime.Historylines) {
            if (mapRealTime.Historylines.lines) {
                for (var i = 0; i < mapRealTime.Historylines.lines.length; i++)//1：这是新系统的！
                {
                    mapRealTime.Historylines.lines[i].setMap(null);
                }
            }
            //alert('1');
            if (mapRealTime.Historylines.marker)//2：这是老系统的！
            {
                mapRealTime.Historylines.marker.setMap(null);
            }
            if (mapRealTime.Historylines.start) {
                mapRealTime.Historylines.start.setMap(null);
            }
            if (mapRealTime.Historylines.stop) {
                mapRealTime.Historylines.stop.setMap(null);
            }
            if (mapRealTime.Historylines.veh) {
                mapRealTime.Historylines.veh.setMap(null);
                delete mapRealTime.Historylines.veh.histId;
            }
            if (mapRealTime.Historylines.vehCircle) {
                mapRealTime.Historylines.vehCircle.setMap(null);
                delete mapRealTime.Historylines.vehCircle.histId;
            }
            clearHisTipWindow(); //清除历史轨迹上因为历史报表双击产生的红色圆点和弹窗关联！
            //showHistorylineSeq(false);
            //alert('3');
            //alert( "一共有休息点："+mapRealTime.Historylines.restpoints.length);
            if (mapRealTime.Historylines.restpoints) {
                for (var i = 0; i < mapRealTime.Historylines.restpoints.length; i++)//遍历包含所有休息点图标的数组，一个个删掉
                {
                    var marker = mapRealTime.Historylines.restpoints[i];
                    marker.setMap(null);
                }
            }
            if (mapRealTime.Historylines.picPoints) {
                for (var i = 0; i < mapRealTime.Historylines.picPoints.length; i++)//遍历包含所有取证图标的数组，一个个删掉
                {
                    var marker = mapRealTime.Historylines.picPoints[i];
                    marker.setMap(null);
                }
            }
            if (mapRealTime.Historylines.drawSlowSpeedPictPoints) {
                for (var i = 0; i < mapRealTime.Historylines.drawSlowSpeedPictPoints.length; i++)//遍历包含所有缓行图标的数组，一个个删掉
                {
                    var marker = mapRealTime.Historylines.drawSlowSpeedPictPoints[i];
                    marker.setMap(null);
                }
            }
            //alert('4');
            delete mapRealTime.Historylines.preRestPointMarker;
            delete mapRealTime.Historylines.preRestText;
            delete mapRealTime.Historylines.restpoints;
            //alert('5');
            delete mapRealTime.Historylines.textPoint;
            delete mapRealTime.Historylines.hisTrickPoints;
            delete mapRealTime.Historylines.marker;
            delete mapRealTime.DrawTrackMode;
            //一定要把这句放在最后！如果放在前面，后面的删除代码就执行不了！
            delete mapRealTime.Historylines; //alert("1");
        }
    }
    catch (ex) {
        showError("deleteHistory", ex);
    }
}
//在播放轨迹之前，先显示车辆标记【这是原来的代码，事实上后来车辆图标默认就是显示的！】
function showVehMarker() {
    if (!mapRealTime.DrawTrackMode) {
        return;
    }
    try {
        var marker = mapRealTime.Historylines.veh;
        if (!marker) {
            return;
        }
        if (!marker.visible) {
            marker.show(); //显示车辆！
        }
    }
    catch (ex) {
        showError("showVehMarker", ex);
    }
}
function changeInterval(strVehInfo)      //进度条数字改变，也就是改变车辆的位置！
{
    if (!mapRealTime.DrawTrackMode)//mapRealTime.DrawTrackMode === 1 ||
    {
        return;
    }
    try {
        var marker = mapRealTime.Historylines.veh;
        if (marker) {
            var strJson = strToJson(strVehInfo);
            mapRealTime.Historylines.veh.histId = strJson.a;

            var lnglattemp = getVehLngLat(strJson);
            var lng = lnglattemp.lng;  //alert(lng);
            var lat = lnglattemp.lat;  //alert(lat);

            var str = setHistoryMarkerContent(strJson, false);
            var lnglat = [lng, lat];

            marker.setContent(str); 	  //更新内容
            marker.setPosition(lnglat);   //更新位置

            if (!mapRealTime.bound.contains(lnglat)) {
                setCenterInner(lng, lat);
            }
            //如果是第二种模式：先不画轨迹，边播放边画轨迹，那么就将当前的坐标数据加入轨迹线
            if (mapRealTime.DrawTrackMode === 2) {
                if ((mapRealTime.Historylines.lines instanceof Array) && mapRealTime.Historylines.lines.length > 0) {
                    //alert('进入循环');
                    var polyline = mapRealTime.Historylines.lines[0];

                    var prePath = polyline.getPath(); //取得之前的坐标点数组，并把当前的坐标加进去，重新设置path
                    prePath.push(lnglat);
                    //alert('最新的坐标点数组的长度：' + prePath.length);
                    polyline.setPath(prePath);
                }
            }
        }
    }
    catch (ex) {
        showError("changeInterval", ex);
    }
}

function setHistoryMarkerContent(strJson, isBigIcon) {
    try {
        //下面是兼容代码【兼容新老系统，因为新老系统对于车辆和站点的类对象的属性可能不一样】
        var VehicleCode = strJson.g || strJson.VehicleCode || ''; //alert(VehicleCode);
        var Speed = strJson.c || strJson.MoveSpeed || strJson.Speed;
        var speedText = ''; //速度显示文本，如果速度为0，就不显示速度
        if (!Speed) {
            Speed = '0';
        }
        else {
            speedText = '速度:' + Speed;
        }
        var Angle = strJson.h || strJson.LineName; //alert(Angle);
        var Online = strJson.Online || strJson.e; //alert('online:'+Online);
        if (!Online)//在一开始画历史轨迹的时候，待创建的车辆的Online属性是undefined，这个时候，车辆图标不该是灰色，所以顺便设置为"1"。其实这个时候上面的VehicleCode、Speed、Angle属性也都是未定义
        {
            Online = 1;
        }
        //alert('strL:::' + strJson + "  " + Angle);
        //loopObj(strJson);
        var icon = getVehIcon(Angle, Speed, Online, isBigIcon, strJson);  //alert(icon);
        var ret = "<div style='float: left; padding-right: 1px; '><img src='" + icon
            + "'/></div><div style='height: 20px; line-height: 20px; width: 300%;'>" + VehicleCode + "&nbsp" + speedText + "</div>";
        return ret;
    }
    catch (ex) {
        showError("setHistoryMarkerContent", ex);
    }
}
function getHistoryCircleMarkerContent(strJson) {
    try {
        //loopObj(strJson);
        //下面是兼容代码【兼容新老系统，因为新老系统对于车辆和站点的类对象的属性可能不一样】
        var stoptime = strJson.d;
        var ret = "<div style='float: left; padding-right: 1px; '><img src= 'trImage/marker.png'/></div><div style='height: 20px; line-height: 20px; width: 300%;'>" + stoptime + "</div>";
        return ret;
    }
    catch (ex) {
        showError("getHistoryCircleMarkerContent", ex);
    }
}
function setTrafficJamsArea(strLngLat) {
    try {
        //alert(strLngLat);
        var arr = strLngLat.split(","); //字符分割
        var lng = arr[0]; //alert("lng:"+lng);
        var lat = arr[1]; //alert("lat:"+lat);
        setCenterInner(lng, lat);

        var marker = new AMap.Marker(
            {
                map: mapRealTime,
                position: [lng, lat],
                offset: new AMap.Pixel(-16, -16), //相对于基点的偏移位置
                autoRotation: true,
                topWhenClick: true
                //extData: vehid      //用户自定义属性，与此点标记关联
            });
        var ret = "<div style='float: left'><img src='trImage/AlarmH.png'/></div>";
        marker.setContent(ret);
        var json = {
            offset: new AMap.Pixel(32, 6),
            content: '堵车点'//'火灾点'
        };
        marker.setLabel(json);
        AMap.event.addListener(marker, 'rightclick', function (e)   //点击事件：配合添加站点使用！
        {
            try {
                var contextMenu = new AMap.ContextMenu();  //创建右键菜单
                //实例化交通路网图层
                contextMenu.addItem("清除该标记", function () {
                    var lineid = null; //当前行驶的线路id
                    var tempLineid = null; //绕路线路id
                    if (arr.length >= 3) {
                        lineid = arr[2];
                    }
                    if (arr.length === 4) {
                        tempLineid = arr[3];
                    }
                    marker.setMap(null);
                    if (lineid) {
                        deleteLine(lineid);
                    }
                    if (tempLineid) {
                        deleteLine(tempLineid);
                    }
                    contextMenu.close();
                }, 0);
                contextMenu.open(mapRealTime, e.lnglat);
            }
            catch (ex) {
                showError("车辆点击事件", ex);
            }
        });
    }
    catch (exex) {
        showError("setTrafficJamsArea：：", exex);
    }
}
function removeRoadMarker(markid) {
    var lineid = Number(markid); //这里必须先把id 转化为数字！
    if (mapRealTime.drawRoadMarkers) {
        if (mapRealTime.drawRoadMarkers.hasOwnProperty(lineid)) {
            var obj = mapRealTime.drawRoadMarkers[lineid];
            if (obj.marker) {
                obj.marker.setMap(null);
            }
            if (obj.infowin) {
                obj.infowin.setMap(null);
            }
            delete mapRealTime.drawRoadMarkers[lineid];
        }
    }
}
function hideRoadMarker(markid) {
    var lineid = Number(markid); //这里必须先把id 转化为数字！
    if (mapRealTime.drawRoadMarkers) {
        if (mapRealTime.drawRoadMarkers.hasOwnProperty(lineid)) {
            var obj = mapRealTime.drawRoadMarkers[lineid];
            if (obj.marker) {
                obj.marker.hide();
            }
            if (obj.infowin) {
                obj.infowin.hide(); //.close();
            }
            if (obj.option) {
                obj.option.valid = 1;
            }
        }
    }
}
function addRoadMarker(obj) {
    var strJson = strToJson(obj);
    if (strJson) {
        var id = strJson.ID;
        if (mapRealTime.drawRoadMarkers[id]) {
            var obj = mapRealTime.drawRoadMarkers[id];
            var option = obj.option;
            if (option) {
                option.valid = 2;
            }
            if (obj.marker) {
                obj.marker.show();
            }
            if (obj.infowin) {
                //var pos = obj.infowin.getPosition();
                //obj.infowin.open(mapRealTime, pos);
                obj.infowin.show();
            }
            return;
        }
        else {
            var linepoints = strJson.m_List;
            if (linepoints instanceof Array) {
                var lng;
                var lat;
                var polylineArr = []; //经纬度坐标数组
                var distanceArr = []; //经纬度数组元素之间的距离（单位：米）。这个数据用来比较精确地判断鼠标移动到连线附近时是否需要让路况线路显示出来
                var preLatLng; //之前的经纬度数据
                var minLat = 10000, minLng = 10000, maxLat = 0, maxLng = 0; //该线的最大最小经纬度（获取这些是为了粗略判断鼠标是否位于此线的范围内）
                for (i = 0; i < linepoints.length; i++) {
                    lng = linepoints[i].Lon;
                    lat = linepoints[i].Lat;
                    if (lng && lat) {
                        var currLatLng = new AMap.LngLat(lng, lat);
                        polylineArr.push(currLatLng);
                        //测距、更新
                        //if (preLatLng) {
                        //    var dist = currLatLng.distance(preLatLng);
                        //    distanceArr.push(dist);
                        //}
                        //preLatLng = currLatLng;
                        if (minLat > lat) {
                            minLat = lat;
                        }
                        if (maxLat < lat) {
                            maxLat = lat;
                        }
                        if (minLng > lng) {
                            minLng = lng;
                        }
                        if (maxLng < lng) {
                            maxLng = lng;
                        }
                    }
                }
                var lnglatBound = { minlat: minLat - 0.005, maxlat: maxLat + 0.005, minlng: minLng - 0.005, maxlng: maxLng + 0.005 };
                if (polylineArr.length > 0) {
                    var polyline = new AMap.Polyline(
                        {
                            map: mapRealTime,
                            path: polylineArr,      //设置线覆盖物路径
                            strokeColor: "#FF0000", //红色
                            strokeOpacity: 1,       //线透明度
                            strokeWeight: 4,        //线宽
                            strokeStyle: "solid",   //线样式  "dashed"
                            strokeDasharray: [10, 6, 3, 6], //补充线样式
                            icons: [{ type: "FORWARD_ARROW", offset: '25%' }, { type: "FORWARD_ARROW", offset: '65%' }] //线的箭头样式
                        });
                    var bound = polyline.getBounds();
                    //polyline.hide();
                    var radius = strJson.radius || 500;
                    var remark = strJson.Remark || '';
                    var begintime = strJson.m_BeginTime;
                    var endtime = strJson.m_EndTime;
                    var tooltip = '路况标注信息：半径：' + radius + '，备注：' + remark + ' 有效时间范围：' + begintime + ' -- ' + endtime;

                    var div = "<div style='font-size:12px;lineheight:1.8em;bgcolor:#ffffff;width:140px'><font bgcolor='white' color='blue'>路况标注信息：半径：</font><font bgcolor='white' color='blue'>" + radius + "</font></br>";
                    div += "<p style='color:blue'>备注：" + remark + "</p>";
                    div += "<p style='color:blue'>始：" + begintime + "</p>";
                    div += "<p style='color:blue'>终：" + endtime + "</p>" + '</div>';

                    var infoWindow = new AMap.Marker(
                        {
                            map: mapRealTime,
                            position: [polylineArr[0].getLng(), polylineArr[0].getLat()],
                            offset: new AMap.Pixel(-10, -30),  //相对于基点的偏移位置
                            zIndex: 100,
                            content: div//tooltip
                        });

                    //var infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(5, 0), autoMove: false, content: tooltip, position: polylineArr[0], bound: bound });
                    //infoWindow.open(mapRealTime, polylineArr[0]);
                    mapRealTime.drawRoadMarkers[id] = { marker: polyline, option: strJson, arr: polylineArr, distArr: distanceArr, infowin: infoWindow, lnglatBound: lnglatBound, bound: bound };
                }
            }
        }
    }
}
//检测鼠标在地图上移动的过程中，路况轨迹是否应该显示出来
function checkRoadMarkerValid(e) {
    if (mapRealTime.drawRoadMarkers && e) {
        var lng = e.lnglat.getLng();
        var lat = e.lnglat.getLat();
        var mouselatlng = new AMap.LngLat(lng, lat);//当前鼠标所在的经纬度
        for (var lineid in mapRealTime.drawRoadMarkers) {
            if (mapRealTime.drawRoadMarkers.hasOwnProperty(lineid)) {
                //下面进入每个路况检测线条的处理
                //setRoadMarkerState(lineid, mouselatlng);
                var obj = mapRealTime.drawRoadMarkers[lineid];
                var option = obj.option;
                if (option.valid === 2) {
                    continue;  //如果是通过报表显示的，那么就直接不必判断了，因为一定正在显示
                }
                else {
                    var latlngbound = obj.lnglatBound;
                    if (lat > latlngbound.minlat && lat < latlngbound.maxlat && lng > latlngbound.minlng && lng < latlngbound.maxlng) {
                        //调用C#
                        var param = lineid + ";" + lat + "," + lng;
                        //interWinform(param, "showRoadMarker");
                        setRoadMarkerState(lineid, mouselatlng);
                    }
                    else {
                        hideRoadMarker(lineid); //continue;
                    }
                }
            }
        }
    }
}
function showRoadMarker(lineid) {
    var obj = mapRealTime.drawRoadMarkers[lineid];
    obj.marker.show();
    //var pos = obj.infowin.getPosition();
    //obj.infowin.open(mapRealTime, pos);
    obj.infowin.show();
}
function setRoadMarkerState(lineid, mouselatlng) {
    var obj = mapRealTime.drawRoadMarkers[lineid];
    var option = obj.option;
    if (option.valid === 2) {
        return;//如果是通过报表显示的，那么就直接不必判断了，因为一定正在显示
    }
    var polyline = obj.marker;
    var bound = obj.bound;
    if (bound && bound.contains(mouselatlng)) {
        polyline.show();
        //var pos = obj.infowin.getPosition();
        //obj.infowin.open(mapRealTime, pos);
        obj.infowin.show();
        return;
    }
    var radius = option.radius || 500;
    var polylineArr = obj.arr;
    //如果该路况线条的某个锚点与参数经纬度数据的地面距离（米）为半径以内，那么就显示这个路况线条（通过设置）
    if (polylineArr instanceof Array) {
        for (var i = 0; i < polylineArr.length; i++) {
            var latlng = polylineArr[i];
            var dist = mouselatlng.distance(latlng);
            if (dist <= radius) {
                //alert('dist:' + dist + 'radius：' + radius);
                //alert('jinlaile');
                polyline.show();
                //var pos = obj.infowin.getPosition();
                //obj.infowin.open(mapRealTime, pos);
                obj.infowin.show();
                return;
            }
        }
        polyline.hide();
        //obj.infowin.close();
        obj.infowin.hide();
    }
}

//.............高德地图JS操作结束..................



//JS调用调用winform方法【互操作】
function interWinform(info, type) {
    var param = type + "," + info || "";
    console.log("interWinform:" + param);
    mapRealTime.interMap(info, type);
    // if (window.callbackObj)
    // {
    //     window.callbackObj.interWinform_cef(param);//.NET4.5下：ChromiumWebBrowser控件使用
    //     return;
    // }
    // if (window.external)//(mapRealTime.coreName === "ie")//IE内核浏览器控件使用
    // {
    //     return window.external.interWinform(param); //(info, type);
    // }
    // else
    // {
    //     //.NET4.0下：CefWebBrowser控件使用
    //     return Cef.openMyPc("interWinform", param); //window.CallCSharpMethod("interWinform", param);
    // }
}

//.............JS功能函数开始..................

function strToJson(str)   //str参数是json字符串，需要先转化为JSON对象
{
    try {
        //alert('str:::' + str);
        return eval('(' + str + ')');
        //return (new Function("return " + str))(); 
        //if (window.external)
        //{
        //    return (new Function("return " + str))(); //JSON.parse(str); //return JSON.parse(str); //(new Function("return " + str))();
        //}
        //else
        //{
        //    //return JSON.parse(str);
        //    return eval('(' + str + ')'); 
        //}
    }
    catch (ex) {
        return;
        if (!ex) {
            alert('错误为空。。。未知');
            return;
        }

        alert("strToJson出错 ex.name: " + ex.name + "  ex.message" + ex.message); //|| ex.StackTrace()
        alert("" + ex.toString());

        loopObj(ex);
        //showError("strToJson：：" + "" +"::是参数", ex);
    }
}
function toDecimal(x)   //保留一位小数！
{
    try {
        if (isNaN(x)) {
            return NaN;
        }
        var f = x.toFixed(1);
        return f;
    }
    catch (ex) {
        showError("toDecimal", ex);
    }
}
function isString(str) {
    try {
        return (typeof str == 'string') && str.constructor == String;
    }
    catch (ex) {
        showError("isString", ex);
    }
}
function isNumber(obj) {
    try {
        return (typeof obj == 'number') && obj.constructor == Number;
    }
    catch (ex) {
        showError("isNumber", ex);
    }
}
//把颜色数字转化为"#000000"格式的16进制颜色值
String.prototype.colorHex = function () {
    try {
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var that = this;
        if (/^(rgb|RGB)/.test(that)) {
            var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
            var strHex = "#";
            for (var i = 0; i < aColor.length; i++) {
                var hex = Number(aColor).toString(16);
                if (hex === "0") {
                    hex += hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = that;
            }
            return strHex;
        }
        else if (reg.test(that)) {
            var aNum = that.replace(/#/, "").split("");
            if (aNum.length === 6) {
                return that;
            }
            else if (aNum.length === 3) {
                var numHex = "#";
                for (var i = 0; i < aNum.length; i += 1) {
                    numHex += (aNum + aNum);
                }
                return numHex;
            }
        }
        else {
            return that;
        }
    }
    catch (ex) {
        showError("String.prototype.colorHex", ex);
    }
}
//function getDir()
//{
//    var str = location.href;
//    var arr = str.split("/");
//    delete arr[arr.length - 1];
//    var dir = arr.join("/");
//    return dir;
//}

//根据角度参数：计算方向  if ((angle > 23)  name = "东北";
export function getDirection(angle) {
    try {
        var name;
        if ((angle > 338) && (angle <= 360) || (angle > 0) && (angle <= 23)) {
            name = "北";
        }
        else if ((angle > 23) && (angle <= 68)) {
            name = "东北";
        }
        else if ((angle > 68) && (angle <= 113)) {
            name = "东";
        }
        else if ((angle > 113) && (angle <= 158)) {
            name = "东南";
        }
        else if ((angle > 158) && (angle <= 203)) {
            name = "南";
        }
        else if ((angle > 203) && (angle <= 248)) {
            name = "西南";
        }
        else if ((angle > 248) && (angle <= 293)) {
            name = "西";
        }
        else if ((angle > 293) && (angle <= 338)) {
            name = "西北";
        }
        else {
            name = "北";
        }
        return name;
    }
    catch (ex) {
        showError("getDirection", ex);
    }
}
//获取车辆的状态：正常运行还是报警
export function getVehState(online, speed, alarmstate) {
    if (!online) {
        return '离线';
    }
    else {
        if (alarmstate) {
            //获取报警的类型
            return getAlarmName(alarmstate);
        }
        else {
            //不是报警，是正常、在线的，那么就判断速度
            if (speed) {
                return '行驶';
            }
            else {
                return '停车';
            }
        }
    }
}
function getAlarmName(alarmstate) {
    return '超速报警';
}
//根据方向、速度、是否在线：获取车辆图标if (direction == "北")image = "image/b.png";   是否大图标！
function getVehIcon(direction, speed, online, isBigIcon, strJson) {
    //图标显示的优先级为：离线》非营运状态》报警
    try {
        var image = "on0"; //默认初始值
        //当车辆在线的时候，先判断报警状态，再判断缓行状态
        var isAlarmVeh = false; //是否报警车辆！
        var isRunSlowVeh = false; //是否慢行车辆！
        var alarmstate = strJson.t;  //alert(alarmstate);  //这里只使用最新的方式，不能使用过去的兼容方式了！！strJson.AlarmState || strJson.AlarmType ||
        if (alarmstate === 0)//不是报警
        {
            isAlarmVeh = false;
            isRunSlowVeh = (speed < mapRealTime.options.MaxSpeedIcon);
        }
        else {
            isAlarmVeh = true;
            isRunSlowVeh = false;
        }
        if (online == 1)//在线
        {
            var find = false;//是否根据该车的特殊状态，找到了对应的图标，如果找到了，则find = true; 否则就沿用原来的代码思路：设置原来的图标
            //先判断是否特殊状态：包车、堵车、加油等
            if (strJson.ad)//说明车辆的Other_state状态大于0，属特殊状态！
            {
                find = true;
                var ad = strJson.ad;
                if (ad === 1)//修车
                {
                    image = "xiu0";
                }
                else if (ad === 3)//加油
                {
                    image = "oil0";
                }
                else if (ad === 4)//堵车
                {
                    image = "du0";
                }
                else if (ad === 9)//包车
                {
                    image = "bao0";
                }
                else {
                    find = false;//说明没有找到对应的状态，则接着沿用原来的设计
                }
            }
            if (!find) {
                if (speed != "0") {
                    if (direction == "北") {
                        if (isRunSlowVeh) {
                            image = "slow1";
                        }
                        else if (isAlarmVeh) {
                            image = "alarm1";
                        }
                        else {
                            image = "on1";
                        }
                    }
                    else if (direction == "南") {
                        if (isRunSlowVeh) {
                            image = "slow5";
                        }
                        else if (isAlarmVeh) {
                            image = "alarm5";
                        }
                        else {
                            image = "on5";
                        }
                    }
                    else if (direction == "西") {
                        if (isRunSlowVeh) {
                            image = "slow7";
                        }
                        else if (isAlarmVeh) {
                            image = "alarm7";
                        }
                        else {
                            image = "on7";
                        }
                    }
                    else if (direction == "东") {
                        if (isRunSlowVeh) {
                            image = "slow3";
                        }
                        else if (isAlarmVeh) {
                            image = "alarm3";
                        }
                        else {
                            image = "on3";
                        }
                    }
                    else if (direction == "东南") {
                        if (isRunSlowVeh) {
                            image = "slow4";
                        }
                        else if (isAlarmVeh) {
                            image = "alarm4";
                        }
                        else {
                            image = "on4";
                        }
                    }
                    else if (direction == "西南") {
                        if (isRunSlowVeh) {
                            image = "slow6";
                        }
                        else if (isAlarmVeh) {
                            image = "alarm6";
                        }
                        else {
                            image = "on6";
                        }
                    }
                    else if (direction == "东北") {
                        if (isRunSlowVeh) {
                            image = "slow2";
                        }
                        else if (isAlarmVeh) {
                            image = "alarm2";
                        }
                        else {
                            image = "on2";
                        }
                    }
                    else if (direction == "西北") {
                        if (isRunSlowVeh) {
                            image = "slow8";
                        }
                        else if (isAlarmVeh) {
                            image = "alarm8";
                        }
                        else {
                            image = "on8";
                        }
                    }
                }
                else {
                    if (isRunSlowVeh) {
                        image = "slow0";
                    }
                    else if (isAlarmVeh) {
                        image = "alarm0";
                    }
                    else {
                        image = "on0";
                    }
                }
            }
        }
        else//不在线【离线的优先级大于报警优先级，所以报警的情况就不必在这里判断了】
        {
            if (speed != "0") {
                if (direction == "北")
                    image = "off1";
                else if (direction == "南")
                    image = "off5";
                else if (direction == "西")
                    image = "off7";
                else if (direction == "东")
                    image = "off3";
                else if (direction == "东南")
                    image = "off4";
                else if (direction == "西南")
                    image = "off6";
                else if (direction == "东北")
                    image = "off2";
                else if (direction == "西北")
                    image = "off8";
            }
            else {
                image = "off0";
            }
        }
        var isbig = "";
        if (isBigIcon) {
            isbig = "D";
        }
        if (strJson.aa)//自编号带“挂”的车辆图标没有离线、报警、脱线，所以直接用对应的在线图标即可
        {
            image = image.replace("alarm", "pink").replace("slow", "pink").replace("on", "pink");
        }
        else//不是挂车，且是营运离线的话，就后面加一个S
        {
            if (online != 1 && strJson.ab)//说明是挂车
            {
                isbig += "S";
            }
        }
        //var src = "trImage/" + image + isbig + ".png";
        var src = 'http://www.56gps.cn/download/down_Up/wcf/trImage/' + image + isbig + ".png";
        return src;
    }
    catch (ex) {
        showError("getVehIcon", ex);
    }
}
function getVehTextSize(icon) {
    try {
        var size; //图标的尺寸大小，具体大小应该为几，可以参照车辆状态（是否在线、速度是否为0）和对应的目录里的图标文件大小。
        //确定图标大小
        var index = icon.indexOf("0D");
        if (index >= 0) {
            size = 32; //50;
        }
        else {
            index = icon.indexOf("D");
            if (index >= 0) {
                size = 32;
            }
            else {
                size = 20;
            }
        }
        return size;
    }
    catch (ex) {
        showError("getVehTextSize", ex);
    }
}
//遍历对象的属性和值
function loopObj(obj) {
    try {
        var name;
        for (name in obj) {
            if (obj.hasOwnProperty(name)) {
                if (typeof obj[name] !== 'function') {
                    alert(name + ":" + obj[name]);
                }
            }
        }
        //或者可以：避免使用forin 而使用for语句来遍历一个数组！
    }
    catch (ex) {
        showError("loopObj", ex);
    }
}

//JS代码报错时的提示
function showError(funtionName, ex) {
    var strMessage = "从函数:" + funtionName + " ";
    var errCode = "";
    for (var p in ex) {
        strMessage = strMessage + "\r\n" + p + "=" + ex[p];
        if (p.toString() == "number") {
            errCode = ex[p] & 0xFFFF
        }
    }
    alert(strMessage + "\r\n trueNumber:" + errCode);

    //下面是用法
    //    try
    //    {
    //        return window.external.interProc(type, flag); //这里加了个返回值
    //    } 
    //    catch (ex)
    //    {
    //        showError("interProc", ex);
    //    }

}

function domByClass(classname, isshow) {
    try {
        var tags = document.getElementsByTagName("*");     //tags ||
        for (var k in tags) {
            var tag = tags[k];
            if (tag.className == classname) {
                if (isshow) {
                    tag.style.opacity = '1';
                }
                else {
                    tag.style.opacity = '0';
                }
            }
        }
    }
    catch (ex) {
        showError("domByClass", ex);
    }
}
//生成从minNum到maxNum的随机数
export function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        default:
            return 0;
    }
}
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    }; if (/(y+)/.
        test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    } for (var k in o) {
        if (new RegExp("(" + k + ")").
            test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

//.............JS功能函数结束......................

//以下是不常用的类型成员
//地图方法部分
//pixelToLngLat(pixel:Pixel,level:Number)	LngLat	平面地图像素坐标转换为地图经纬度坐标
//lnglatToPixel(lngLat:LngLat,level:Number)	Pixel	地图经纬度坐标转换为平面地图像素坐标
//containerToLngLat(pixel:Pixel,level:Number)	LngLat	地图容器像素坐标转为地图经纬度坐标
//lngLatToContainer(lnglat:LngLat,level:Number)	Pixel	地图经纬度坐标转为地图容器像素坐标
//setMapStyle(style:String)
//事件	       参数	        说明
//complete		        地图图块加载完成后触发事件
//click	    MapsEvent	鼠标左键单击事件
//dblclick	MapsEvent	鼠标左键双击事件
//mapmove		地图平移时触发事件
//hotspotclick	{type,lnglat,name,id}	鼠标点击热点时触发（自v1.3 新增）
//hotspotover	{type,lnglat,name,id}	鼠标滑过热点时触发（自v1.3 新增）
//hotspotout	{type,lnglat,name,id}	鼠标移出热点时触发（自v1.3 新增）
//movestart		地图平移开始时触发
//moveend		地图平移结束后触发。如地图有拖拽缓动效果，则在缓动结束后触发
//zoomchange		地图缩放级别更改后触发
//zoomstart		缩放开始时触发
//zoomend		缩放停止时触发
//mousemove	MapsEvent	鼠标在地图上移动时触发
//mousewheel	MapsEvent	鼠标滚轮开始缩放地图时触发
//mouseover	MapsEvent	鼠标移入地图容器内时触发
//mouseout	MapsEvent	鼠标移出地图容器时触发
//mouseup	MapsEvent	鼠标在地图上单击抬起时触发
//mousedown	MapsEvent	鼠标在地图上单击按下时触发
//rightclick	MapsEvent	鼠标右键单击事件
//dragstart		开始拖拽地图时触发
//dragging		拖拽地图过程中触发
//dragend		停止拖拽地图时触发。如地图有拖拽缓动效果，则在拽停止，缓动开始前触发
//resize		地图容器大小改变事件

//infoWindow方法部分
//getIsOpen( )	Boolean	获取信息窗体是否打开
//getContent( )	String	获取信息窗体内容 ，结果以字符串方式返回
//setPosition(lnglat:LngLat)		设置信息窗体显示基点位置
//getPosition( )	LngLat	获取信息窗体显示基点位置
//setSize(size:Size)		设置信息窗体大小（isCustom为false时有效）
//getSize( )	Size	获取信息窗体大小
//事件	参数	说明
//change		属性发生变化时
//open		信息窗体打开之后触发事件
//close		信息窗体关闭之后触发事件

//marker部分
//setPosition(lnglat:LngLat)		设置点标记位置
//setContent(html:String|htmlDOM)
//moveAlong(lnglatlist:Array,speed:Number,f:Function,circlable:Boolean)
// 设置点标记的动画效果，此处为弹跳效果
//marker.setAnimation('AMAP_ANIMATION_BOUNCE');
//position: mapRealTime.getCenter(),

//MapsEvent参数部分。
//MapsEvent 对象规范（自v1.2 新增）
//此对象用于表示地图、覆盖物、叠加层上的各种鼠标事件返回，包含以下字段：
//MapsEventOptions	类型	说明
//lnglat	LngLat	发生事件时光标所在处的经纬度坐标。
//pixel	    Pixel	发生事件时光标所在处的像素坐标。
//type	    String	事件类型。
//target	Object	发生事件的目标对象。

//Bounds 类参数部分。
//地物对象的经纬度矩形范围。
//构造函数	说明
//AMap.Bounds(southWest:LngLat, northEast:LngLat)	矩形范围构造函数，参数southWest、northEast分别代表地物对象西南角经纬度和东北角经纬度值。
//方法	返回值	说明
//contains(point：LngLat)	Boolean	指定点坐标是否在矩形范围内。（自v1.2 新增）
//getCenter( )	LngLat	获取当前Bounds的中心点经纬度坐标。（自v1.2 新增）
//getSouthWest( )	LngLat	获取西南角坐标。（自v1.2 新增）
//getNorthEast( )	LngLat	获取东北角坐标。（自v1.2 新增）
//toString( )	String	以字符串形式返回地物对象的矩形范围。

//LngLat 类
//经纬度坐标，确定地图上的一个点。AMap.LngLat(lng:Number,lat:Number)	构造一个地理坐标对象，lng、lat分别代表经度、纬度值
//var x = e.lnglat.getLng();  return float  获取经度值。
//var y = e.lnglat.getLat();                获取纬度值。
//offset(w:Number,s:Number) return	LngLat	当前经纬度坐标值经度移动w，纬度移动s，得到新的坐标。 经度向右移为正值，纬度向上移为正值，单位为米。 （自v1.2 新增）
//distance(lnglat:LngLat)   return  Number	当前经纬度和传入经纬度之间的地面距离，单位为米（自v1.2 新增）
//equals(lnglat:LngLat)	Boolean	判断当前坐标对象与传入坐标对象是否相等.
//toString( )	String	LngLat对象以字符串的形式返回。


//function moveAlong(strVehid, lnglatlist, speed, circlable)  //设置车辆图标以指定的速度、点标记沿指定的路径移动。lnglats为路径坐标串；speed为指定速度，单位：千米/小时；回调函数f为变化曲线函数，缺省为function                                                               (k){return k}；参数circlable表明是否循环执行动画，默认为false
//{
//    if (mapRealTime[strVehid])
//    {
//        mapRealTime[strVehid].marker.moveAlong(lnglatlist, speed, null, circlable);
//    }
//}
//function moveTo(strVehid, lnglat, speed)//设��车辆图标以给定速度移动点标记到指定位置。
//{
//    if (mapRealTime[strVehid])
//    {
//        mapRealTime[strVehid].marker.moveTo(lnglat, speed); // , function () { });//参数lnglat为指定位置，必设；speed为指定速度，单位：千米/小时；回调函数f为变化曲线函数，缺省为function(k){return k}。
//    }
//}
//function stopMove(strVehid) //点标记停止动画
//{
//    if (mapRealTime[strVehid])
//    {
//        mapRealTime[strVehid].marker.stopMove();
//    }
//}