var appctrl =angular.module('app.controllers', ['ionic', 'app.routes', 'app.directives','app.services',"ion-datetime-picker"]);
//设置时间格式
appctrl.run(function($ionicPickerI18n) {
    $ionicPickerI18n.weekdays = [ "天","一", "二", "三", "四", "五", "六"];
    $ionicPickerI18n.months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    $ionicPickerI18n.ok = "确定";
    $ionicPickerI18n.cancel = "取消";
    $ionicPickerI18n.okClass = "button-positive";
    $ionicPickerI18n.cancelClass = "button-positive";

})

.controller('page1Ctrl', ['$scope', '$stateParams', '$location','$http','$ionicPopup','$state','messageService',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$location,$http,$ionicPopup,$state,messageService) {
    $scope.Back =function () {
        console.log($location.url());
        if("/side-menu21/page1"==$location.url()){
            window.localJS.jsBack();
        }else{
            $scope.$ionicGoBack();
        }
    }
    var a = 0;
    function add(n){
        n = n+1;
    }
    a = add(a);
    console.log(typeof a=='undefined');
    $scope.initDevice = function () {
        $http.get(IPPort+"service/equipment/list?typename=-1").success(function (data) {
            var x2js = new X2JS();
            var jsonObj = x2js.xml_str2json(data);
            $scope.equ = [];
            $scope.q =jsonObj.equipments.equipment;
                for(var j = 0;j<$scope.q.length;j++){
                    if($scope.q[j]._haid=='01040310'){
                        $scope.equ.push($scope.q[j]);
                    }
                }
        });
    }

    $scope.Store = function () {
        $state.go("menu.Bak");
    }

    $scope.saveBak = function () {
        var confirmPopup = $ionicPopup.show({
            title: '备份配置',
            template: '确定要备份当前的配置吗?',
            scope : $scope,
            buttons : [
                {text : "取消"},
                {text : "确定",
                    type : "button-positive",
                    onTap : function (e) {
                        $http.get(IPPort+"service/system/backup_config").success(function (data) {
                            var x2js = new X2JS();
                            var jsonObj = x2js.xml_str2json(data);
                            if(jsonObj.success._code=='1'){
                                $ionicPopup.alert({
                                    title: "提示",
                                    template: "备份成功"
                                });
                            }else{
                                $ionicPopup.alert({
                                    title: "提示",
                                    template: jsonObj.success._message
                                });
                            }
                        });
                    }
                }
            ]
        });
    }
    
    $scope.restore = function () {
        var confirmPopup = $ionicPopup.show({
            title: '还原配置配置',
            template: '确定要还原备份的配置吗?',
            scope : $scope,
            buttons : [
                {text : "取消"},
                {text : "确定",
                    type : "button-positive",
                    onTap : function (e) {
                        $http.get(IPPort+"service/system/restore_config").success(function (data) {
                            var x2js = new X2JS();
                            var jsonObj = x2js.xml_str2json(data);
                            if(jsonObj.success._code=='1'){
                                $ionicPopup.alert({
                                    title: "提示",
                                    template: "配置还原成功，重启网关后生效，即将重启设备。"
                                });

                                var promise = messageService.getDW_ID();
                                promise.success(function (data) {
                                    var jsonObj = x2js.xml_str2json(data);
                                    gwid = jsonObj.system.gwid;
                                    var zyt = {};
                                    zyt['_type'] = '1';
                                    zyt['_f'] = '111';
                                    zyt['_to'] = gwid;
                                    var cmd = {};
                                    cmd['_id'] = '6010';
                                    zyt['cmd'] = cmd;
                                    var zyt = x2js.json2xml_str({zyt:zyt});
                                    var data = {xml_data:zyt,submit:'submit'};
                                    console.log(data);
                                    messageService.restore(data);
                                });
                            }else{
                                $ionicPopup.alert({
                                    title: "提示",
                                    template: jsonObj.success._message
                                });
                            }
                        });
                    }
                }
            ]
        });
    }
    $scope.goToDevice = function (item) {
        console.log(item);
        window.localJS.infraredEncode(item._subtype,item._uuid);
    }
}])

.controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
    .controller('accountCtrl', ['$scope', '$stateParams','$accountService','messageService',
// The following is the constructor function for this page's controller.
// See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
//绑定用户用户
        function ($scope, $stateParams,$accountService,messageService) {
            //绑定用户
            $scope.compile ="0";
            $scope.isShowEdit =false;
            var x2js = new X2JS();

            $scope.getUserListName =function(){
                var promise = messageService.getDW_ID();
                var x2js = new X2JS();
                promise.success(function (data) {
                    var jsonObj = x2js.xml_str2json(data);
                    $scope.gwid = jsonObj.system.gwid;
                    var paramData={gwid:$scope.gwid,compile: $scope.compile};
                    var userPromis =  $accountService.getUserListName(paramData);
                    userPromis.success(function (data) {
                        var userlist  =  data.extdata;
                        for(var i =0; i<userlist.length; i++) {
                            userlist["checked"] = false;
                        }
                        $scope.userlist =userlist;
                    })
                })
            }
            $scope.getUserListName();
            $scope.editUser =function () {
                if ($scope.isShowEdit) {
                    $scope.isShowEdit = false;
                } else {
                    $scope.isShowEdit = true;
                }
            }

            //删除用户
            $scope.deleteUsers =function () {
                for(var n =0; n<$scope.userlist.length; n++ ){
                    var user = $scope.userlist[n];
                    if(user.checked){

                        var data ={username:user.username, gwid:$scope.gwid,compile:$scope.compile};
                        var usr_relust = $accountService.deleteUserAndDevice(data);
                        usr_relust.success(function (data) {
                            if(data.result == '1'){
                                window.localJS.deleteUser(user.username);
                                messageService.showAlert("删除成功");
                            }else{
                                messageService.showAlert("删除失败");
                               // alert("删除失败");
                                return ;
                            }


                        })
                    }
                }
                $scope.isShowEdit = false;
                $scope.getUserListName();
            }


        }])
.controller('page5Ctrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
    $scope.deleteAccount = function(){
        document.getElementById("page5-button1").style.display = "block";
    };
    $scope.delete = function(){
        alert(aaa);
    }
}])

.controller('page6Ctrl', ['$scope', '$stateParams','$state' ,'$http','$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state,$http,$ionicPopup) {
    var url= IPPort + "service/spatial/list";
    $scope.refresh = function(){
        $http.post(url).success(function(response) {
            var x2js = new X2JS();
            var jsonObj = x2js.xml_str2json(response);
            $scope.items = [];
            $scope.items = jsonObj.spatials.spatial;
            /*for(var i = 0 ;i < spatial.length;i++){
                $scope.items.push(spatial[i]);
                //  alert(spatial[i]._name+" "+spatial[i]._label+" "+spatial[i]._icon);
            }*/
        });
    }
    /*$scope.deleteSpace = function(id,name,$index){
        document.getElementById("index").value = $index;
        document.getElementById("name").value = name;
       // alert(document.getElementById("name").value);
        deleteDisplay(id);
    }*/
    $scope.goUrl = function (url,item) {
       // alert(item._label);
        $state.go(url,{name:item._name,label:item._label,icon:item._icon});
    }
    $scope.delete = function (name,index) {
        /*var index = document.getElementById("index").value;
        var name = document.getElementById("name").value;*/

        var url = IPPort + "service/spatial/remove?name="+name;
        var confirmPopup = $ionicPopup.show({
            title: '删除空间',
            template: '确定要删除该空间吗?',
            scope : $scope,
            buttons : [
                {text : "取消"},
                {text : "确定",
                    type : "button-positive",
                    onTap : function (e) {
                        $http.get(IPPort+"service/equipment/list?typename=-1").success(function (data) {
                            var x2js = new X2JS();
                            var jsonObj = x2js.xml_str2json(data);
                            $scope.q =jsonObj.equipments.equipment;
                            if($scope.q instanceof Array){
                                for(var j = 0;j<$scope.q.length;j++){
                                    if($scope.q[j]._spatialname==name){
                                        $ionicPopup.alert({
                                            title: "提示",
                                            template: "空间存在设备，不允许删除！"
                                        });
                                        return;
                                    }
                                }
                            }
                            $http.post(url).success(function(response) {
                                var x2js = new X2JS();
                                var jsonObj = x2js.xml_str2json(response);
                                if(jsonObj.success._code=='1'){
                                    $ionicPopup.alert({
                                        title: "提示",
                                        template: "删除成功"
                                    });
                                    $scope.items.splice(index,1);
                                }else{
                                    $ionicPopup.alert({
                                        title: "提示",
                                        template: jsonObj.success._message
                                    });
                                }
                            });
                        });
                    }
                }
            ]
        });
    }

}])

.controller('MessageCtrl', ['$scope', '$stateParams','messageService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,messageService) {
    var promise = messageService.getDW_ID();
    var x2js = new X2JS();
    $scope.GW_ID = '';
    promise.success(function (data) {
        var jsonObj = x2js.xml_str2json(data);
        $scope.GW_ID = jsonObj.system.gwid;
        console.log("GW_ID"+$scope.GW_ID);
    })
    $scope.getMessage = function () {
        var promise = messageService.initMessage();
        promise.success(function (data) {
            var jsonObj = x2js.xml_str2json(data);
            console.log(jsonObj);
            var properties = jsonObj.config_properties.properties;
            if(null!=properties){
                $scope.alarm_interval = properties._alarm_interval/1000;
                $scope.debug = properties._debug;
                $scope.lock_alarm_interval = properties._lock_alarm_interval/1000;
                $scope.data_upload_interval = properties._data_upload_interval;
              //  $scope.push_local = properties._push_local=='1'?true:false;
                $scope.push_local = false;
                $scope.debug = properties._debug=='1'?true:false;
                $scope.recovery = properties._configrestore=='1'?true:false;
                console.log($scope.push_local);
            }
        })
    }
    $scope.showSave = function (id) {
        document.getElementById(id).focus();
        deleteDisplay("button");
    }
    $scope.save = function (push_local,debug,recovery) {
        var lock_alarm_interval =document.getElementById('lock_alarm_interval').value*1000;
        var alarm_interval =document.getElementById('alarm_interval').value*1000;
        var data_upload_interval = document.getElementById('data_upload_interval').value;
        console.log(push_local+" "+alarm_interval+" "+lock_alarm_interval+" "+debug+" "+recovery+" "+data_upload_interval);
        var name = "alarm_interval,lock_alarm_interval,push_local,debug,configrestore,data_upload_interval";
       // push_local = push_local?'1':'0';
        push_local = '0';
        debug = debug?'1':'0';
        recovery = recovery?'1':'0';
        var value = alarm_interval+","+lock_alarm_interval+","+push_local+","+debug+","+recovery+","+data_upload_interval;
        var data = {name:name,value:value};
        var promise = messageService.saveTime(data);
        promise.success(function (data) {
            var jsonObj = x2js.xml_str2json(data);
            console.log(jsonObj);
            if(jsonObj.success._code=='1'){
               // alert("保存成功");
                messageService.showAlert("保存成功");
            }else{
                messageService.showAlert(jsonObj.success._message);
            }
          //  deletePlay("button");
        })
    }

}])

    .controller('windowController', ['$scope', '$stateParams','sceneService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,sceneService) {
            $scope.label = $stateParams.label;
            $scope.name = $stateParams.name;
            $scope.sceneName = $stateParams.sceneName;
            console.log("$scope.name="+$scope.name+" $scope.sceneName="+$scope.sceneName+' $stateParams.OPENORSTOP='+$stateParams.OPENORSTOP);
            $scope.initRollingScreen = function () {
                if($stateParams.OPENORSTOP!=null){
                    switch ($stateParams.OPENORSTOP){
                        case CMD.STOP:
                            document.getElementById("page-button5").style.backgroundColor='#8f8f8f'; break;
                        case CMD.OPEN:
                            document.getElementById("page-button4").style.backgroundColor='#8f8f8f'; break;
                        case CMD.HA_ATTR_STOP:
                            document.getElementById("page-button6").style.backgroundColor='#8f8f8f'; break;

                    }
                }
            }
            $scope.onRelease = function () {
                console.log("$scope.range="+$scope.range);
                $scope.rangeText = $scope.range;
            };
            $scope.saveRollingScreen = function (key) {
                var cmd = {};
                cmd['_eq'] = $scope.name;
                cmd['_id'] = CMD.OPENORSTOP;
                cmd[CMD.OPENORSTOP] = CMD[key];
                var x2js = new X2JS();
                var xml_data = x2js.json2xml_str({cmd:cmd});
                console.log("cmd="+cmd);
                console.log("name="+$scope.name);
                var data = {name:$scope.sceneName,eq_id:$scope.name,xml_data:xml_data};
                var promise = sceneService.saveSceneDevice(data);
                promise.success(function (data) {
                    var jsonObj = x2js.xml_str2json(data);
                    console.log(jsonObj);
                    if(jsonObj.success._code=='1'){
                        sceneService.showAlert('添加成功');
                        $scope.$ionicGoBack();
                       // alert("添加成功");
                    }else{
                        sceneService.showAlert(jsonObj.success._message);
                        $scope.$ionicGoBack();
                       // alert(jsonObj.success._message);
                    }
                })
            }
            $scope.initWindowScreen = function () {
                if($stateParams.OPENORSTOP!=null&&$stateParams.OPENORSTOP!=''){
                    $scope.range = $stateParams.HA_ATTRID_LEVEL;
                    $scope.check = $stateParams.OPENORSTOP==CMD.STOP? false : true;
                }else{
                    $scope.range = '1';
                }
                console.log($scope);
            }
            $scope.saveWindowScreen = function (range,check) {
                var cmd = {};
                cmd['_eq'] = $scope.name;
                cmd['_id'] = CMD.OPENORSTOP;
                if(check){
                    cmd[CMD.OPENORSTOP] = CMD.OPEN;
                    cmd[CMD.HA_ATTRID_LEVEL2] = document.getElementById('range').value;
                }else{
                    cmd[CMD.OPENORSTOP] = CMD.STOP;
                    cmd[CMD.HA_ATTRID_LEVEL2] = 0;
                }
                var x2js = new X2JS();
                var xml_data = x2js.json2xml_str({cmd:cmd});
                console.log("cmd="+cmd);
                console.log("name="+$scope.name);
                var data = {name:$scope.sceneName,eq_id:$scope.name,xml_data:xml_data};
                var promise = sceneService.saveSceneDevice(data);
                promise.success(function (data) {
                    var jsonObj = x2js.xml_str2json(data);
                    console.log(jsonObj);
                    if(jsonObj.success._code=='1'){
                       // alert("添加成功");
                        sceneService.showAlert('添加成功');
                    }else{
                        //alert(jsonObj.success._message);
                        sceneService.showAlert(jsonObj.success._message);
                    }
                    $scope.$ionicGoBack();
                })
            }

        }])
    .controller('aboutCtrl', ['$scope', '$stateParams','$state' ,'$http','aboutService','$location',
//关于网关设置
//注入about = $aboutService
        function ($scope, $stateParams,$state,$http,aboutService,$location) {
            $scope.IP = $location.host();
            var paramData={};
            var promise = aboutService.getSysConfig(paramData);
            var x2js = new X2JS();
            promise.success(function (data) {
                //解析xml
                //以及绑定
                var x2jsObj = x2js.xml_str2json(data);
                if(x2jsObj.system != null) {
                    $scope.sysConfig  = x2jsObj.system;
                    var datePromise = aboutService.getSysTime();
                    datePromise.success(function (data) {
                        x2jsObj = x2js.xml_str2json(data);
                        if(x2jsObj.date != null) {
                            /*$scope.sysConfig["systemTime"] = new Date(x2jsObj.date);*/
                            $scope.sysConfig["systemTime"] = x2jsObj.date;
                        }
                    });
                }
            });
            // $scope.sysConfig["systemTime"] = FormatDate(new Date());
            //保存网关信息
           /* var  datePromise = aboutService.getSysTime();
            datePromise.success(function (data) {
                var x2jsObj = x2js.xml_str2json(data);
                if(x2jsObj.date != null) {
                    $scope.sysConfig["systemTime"] = new Date(x2jsObj.date) ;
                }
            });*/
            //保存设置
            $scope.saveSysConfig =function (sysConfig) {
                if(sysConfig.useralias == undefined ||
                    sysConfig.useralias == null ||
                    sysConfig.useralias == ''){

                    return ;
                }
                //时间格式
                if(sysConfig.systemTime == undefined ||
                    sysConfig.systemTime == null ||
                    sysConfig.systemTime == ''){

                    return ;
                }
                var configData = {useralias:sysConfig.useralias,roomno:'0001-01-01-01' };
                var dateData = {date:FormatDate(sysConfig.systemTime)};

                var rel_respose = aboutService.saveSysConfig(configData);
                rel_respose.success(function (data) {
                    var j_config = x2js.xml_str2json(data);
                    if(j_config.success._code !="1"  ){
                        //alert("保存网关别名失败");
                        aboutService.showAlert("保存网关别名失败");
                        return ;
                    }

                    //时间保存
                    rel_respose = aboutService.saveSysDate(dateData);

                    rel_respose.success(function (date_data) {
                        var j_date =x2js.xml_str2json(date_data);
                        if(j_date.success._code !="1"  ){
                           // alert("保存时间失败");
                            aboutService.showAlert("保存时间失败");
                            return ;
                        }
                       // alert("保存成功");
                        aboutService.showAlert("保存成功");
                    });

                })

                //

            }

            $scope.showSave = function (id) {
                document.getElementById(id).focus();
            }

            $scope.synCofigToServer =function () {
                var reslust = aboutService.synchronous();
                reslust.success(function (data) {
                    var x2jsObj = x2js.xml_str2json(data);
                    console.log(x2jsObj);
                    if(x2jsObj.success._code !="1") {
                       // alert("同步失败");
                        aboutService.showAlert("同步失败");
                        return ;
                    }
                   // alert("同步成功");
                    aboutService.showAlert("同步成功");
                })
            }


        }])

    .controller('revampedDeviceCtrl', ['$scope', '$stateParams','$http','$ionicModal','$state', 'deviceService',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,$http,$ionicModal,$state,deviceService) {
            console.log(window.location.pathname.substring(1));
            $scope.picItems =devicePics;
            var tittle = $stateParams.tittle;
            var space =$stateParams.space;
            var device =$stateParams.device;
            $scope.pic = $stateParams.icon;
            $scope.tittle = tittle;
            $scope.device =JSON.parse(device) ;
            $scope.space =JSON.parse(space) ;

            //获取空间列表
            $http.post(IPPort+"service/spatial/list").success(function (data) {
                var x2js = new X2JS();
                var jsonObj = x2js.xml_str2json(data);
                var j_spatial = jsonObj.spatials.spatial;
                $scope.spatialsNameList  =j_spatial;

            });

            $scope.getTypename = function () {
                $scope.typename = typename;
                var select = document.getElementById("typenameSelect");
                for(var i=0;i<select.options.length;i++){
                    if($scope.device._typename==select.options[i].value){
                        select.options[i].selected = true;
                        break;
                    }
                }
            }

            //空间弹出层
            $ionicModal.fromTemplateUrl('templates/modal.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
            });
            //空间弹出层点击
            $scope.serverSideChange = function(item) {
                $scope.space = item;
                $scope.modal.hide();
                //点击空间时更换空间
                /*$http.post(IPPort+"service/spatial/update",{
                    name:item._name,
                    label:item._label,
                    icon:item._icon,
                }).success(function (data) {
                    alert(data)
                });*/
            };
            //修改(保存)设备
            $scope.equipmentSave = function(device){
                var select = document.getElementById("typenameSelect");
                var typenameSelect = select[select.selectedIndex].value;
                console.log(typenameSelect);
                console.log(device);
                var data = {name:device._name,label:$scope.device._label,haid:device._haid,typename:device._typename,equipmentid:device._equipmentid,controlequipmentname:device._controlequipmentname,spatialname:$scope.space._name,customicon:$scope.pic};
                if(device._typename=='3'){
                    data.typename = '3';
                    data.securityname = device._securityname;
                    data.subtype = device._subtype;
                }
          //      var data = {name:device._name,label:$scope.device._label,haid:device._haid,typename:typenameSelect,equipmentid:device._equipmentid,controlequipmentname:device._controlequipmentname,spatialname:$scope.space._name,customicon:$scope.pic};
                var promise = deviceService.saveSafeDevice(data);
                promise.success(function (data) {
                    var x2js = new X2JS();
                    var jsonObj = x2js.xml_str2json(data);
                    console.log(jsonObj);
                    if(jsonObj.equipment != null){
                       // alert("修改成功");
                        deviceService.showAlert("修改成功！");
                    }else{
                        deviceService.showAlert(jsonObj.success._message);
                    }
                    $scope.$ionicGoBack();
                })
                /*$http.post(IPPort+"service/equipment/save?"+
                    "haid="+device._haid+
                    "&typename="+device._typename+
                    "&equipmentid="+device._equipmentid+
                    "&controlequipmentname="+device._controlequipmentname+
                    "&spatialname="+$scope.space._name+
                    "&customicon="+device.__customicon
                ).success(function (data) {
                    $scope.$ionicGoBack();
//      	 console.log(device);
                    alert(data);
                });*/
            }
            $scope.chosePic = function (pic,index) {
                $scope.pic = pic.item;
               /* for(var i =0;i<devicePic.length;i++){
                    document.getElementById('pic'+i).style.backgroundColor = '#FFFFFF';
                }
                document.getElementById('pic'+index).style.backgroundColor = 'beige';*/
                $scope.modalIcon.hide();
            }
            //图标弹出层
            $ionicModal.fromTemplateUrl('templates/modalIcon.html', {
                scope: $scope
            }).then(function(modalIcon) {
                $scope.modalIcon = modalIcon;
            });


        }])

.controller('page10Ctrl', ['$scope', '$stateParams','messageService','$state', '$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,messageService,$state,$ionicPopup) {
    var x2js = new X2JS();
    $scope.getSecurityPhone = function (compile) {
        var promise = messageService.getDW_ID();
        promise.success(function (data) {
            var jsonObj = x2js.xml_str2json(data);
            $scope.GW_ID = jsonObj.system.gwid;
            var data = {compile:compile,gwid:$scope.GW_ID};
            console.log("GW_ID"+$scope.GW_ID);
            var promise = messageService.getSecurityPhone(data);
            promise.success(function (data) {
                $scope.items = [];
                for(var i = 0; i<data.extdata.length;i++){
                    data.extdata[i].isSend = data.extdata[i].isSend=='0'?false:true;
                    $scope.items.push(data.extdata[i]);
                }
                console.log($scope.items);
            });
        });
    }
    $scope.showDelete = function (phone,index) {
        console.log(phone);
        $scope.deletePhone = phone;
        $scope.index = index;
        var confirmPopup = $ionicPopup.show({
            template: '确定要删除电话号码？',
            scope : $scope,
            buttons : [
                {
                    text : "取消"
                },
                {
                    text: "删除号码",
                    type: "button-assertive",
                    onTap: function (e) {
                        var data = {gwid:$scope.GW_ID,compile:Utilcompile,phone:phone};
                        var promise = messageService.deleteSecurityPhone(data);
                        promise.success(function (data) {
                            if(data.result =='1'){
                                $scope.items.splice(index,1);
                                messageService.showAlert("删除成功");
                            }else{
                                messageService.showAlert('删除失败');
                                //alert("删除失败");
                            }
                        })
                    }
                }
            ]
        });
    }
    $scope.goUpdate = function (item) {
        $state.go('menu.updateMessagePerson',{gwid:$scope.GW_ID,compile:Utilcompile,phone:item.phone,username:item.username,isSend:item.isSend});
    }
    $scope.delete = function () {
        var data = {gwid:$scope.GW_ID,compile:Utilcompile,phone:$scope.deletePhone};
        var promise = messageService.deleteSecurityPhone(data);
        promise.success(function (data) {
            if(data.result =='1'){
                //alert("删除成功");
                messageService.showAlert("删除成功");
                $scope.items.splice($scope.index,1);
            }else{
               // alert(jsonObj.success._message);
                messageService.showAlert(jsonObj.success._message);
            }
        })

    }
}])

.controller('sceneDetailCtrl', ['$scope', '$stateParams', 'sceneService','$state','$ionicModal','$ionicPopup','$http',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,sceneService,$state,$ionicModal,$ionicPopup,$http) {
    var x2js = new X2JS();
    var name = $stateParams.name;
    var cache = {};
    $scope.name = name;
    var tittle = $stateParams.tittle;
    $scope.tittle = tittle;
    
    
   /* $scope.goAddInputDevice = function (url,name) {

        console.log($scope.itemsInput==null);
        console.log($scope.itemsInput.length==0);

        if($scope.itemsInput==null||$scope.itemsInput.length==0){
            $state.go(url,{name:name});
        }else{
            alert("已存在联动条件");
        }
    }*/
    
    
    $scope.getSceneDevice = function () {
        var promise = sceneService.getSceneDetail(name);
        promise.success(function (response) {
            var x2js = new X2JS();
            var jsonObj = x2js.xml_str2json(response);
            $scope.items = [];
            if(jsonObj&&jsonObj.equipments.equipment){
                var equipments = jsonObj.equipments.equipment;
                if(equipments.length) {
                    for (var i = 0; i < equipments.length; i++) {
                        if (equipments[i].cmd && (equipments[i].cmd[CMD.OPENORSTOP] == CMD.OPEN)) {
                            equipments[i].check = true;
                        } else {
                            equipments[i].check = false;
                        }
                        $scope.items.push(equipments[i]);
                    }
                }else{
                    if (equipments.cmd && (equipments.cmd[CMD.OPENORSTOP] == CMD.OPEN)) {
                        equipments.check = true;
                    }else{
                        equipments.check = false;
                    }
                    $scope.items.push(equipments);
                }
            }
            console.log($scope.items);
        })

        var promise2 = sceneService.getInputDevice({name:name});
        promise2.success(function (response) {
            $http.get(IPPort+"service/equipment/list?typename=-1").success(function (data) {
                var x2js = new X2JS();
                $scope.itemsInput = [];
                var jsonObj2 = x2js.xml_str2json(data);
                var jsonObj = x2js.xml_str2json(response);
                if(jsonObj!=null&&jsonObj2!=null) {
                    var equipmentsSafey = typeof (jsonObj2.equipment) == 'undefined' ? jsonObj2.equipments.equipment : jsonObj2.equipment;
                  //  var equipments = typeof (jsonObj.equipment) == 'undefined' ? jsonObj.equipments.equipment : jsonObj.equipment;
                    var equipments = typeof (jsonObj.input.equipment) == 'undefined' ? jsonObj.input : jsonObj.input.equipment;
                    equipments = equipments instanceof Array ? equipments : [equipments];
                    equipmentsSafey = equipmentsSafey instanceof Array ? equipmentsSafey : [equipmentsSafey];
                    for (var i = 0; i < equipments.length; i++) {
                        for (var j = 0; j < equipmentsSafey.length; j++) {
                            if (equipmentsSafey[j]._name == equipments[i]._fname) {
                                equipments[i].label = equipmentsSafey[j]._label;
                                equipments[i].haid = equipmentsSafey[j]._haid
                                $scope.itemsInput.push(equipments[i]);
                                break;
                            }
                        }
                    }
                }
                console.log($scope.itemsInput.length);

            });




        })

    }
    /*$scope.getSceneDevice = function () {
        alert("初始化");
       /!* var promise = sceneService.getInputDevice({name:$scope.name});
        promise.success(function (response) {
            var x2js = new X2JS();
            var jsonObj = x2js.xml_str2json(response);
            alert(JSON.stringify(jsonObj));
        })*!/
    }*/
    $scope.deleteDisplay = function (id) {
        var confirmPopup = $ionicPopup.show({
            template: '选择你要添加的设备类型',
            scope : $scope,
            buttons : [
                {
                    text : "取消"
                },
                {
                    text: "联动条件",
                    type: "button-balanced",
                    onTap : function (e) {
                        console.log($scope.itemsInput==null);
                        console.log($scope.itemsInput.length==0);
                       // if($scope.itemsInput==null||$scope.itemsInput.length==0){
                            $state.go('menu.sceneInputDeviceList',{name:$scope.name});
                       // }else{
                        //    sceneService.showAlert("已存在联动条件");
                       // }
                    }
                },
                {
                    text: "情景执行",
                    type: "button-assertive",
                    onTap: function (e) {
                        $state.go("menu.sceneDeviceList",{name:$scope.name});
                    }
                }
            ]
        });
        //deleteDisplay(id);
    }
    $scope.getOption = function(name){
        var promise = sceneService.getOption({name:name});
        promise.success(function (response) {
            var jsonObj = x2js.xml_str2json(response);
            $scope.items = [];
            if(jsonObj&&jsonObj.equipments.equipment){
                var equipments = jsonObj.equipments.equipment;
                equipments = equipments instanceof Array ? equipments : [equipments];
                for(var i = 0;i<equipments.length;i++){
                    console.log(equipments[i]._haid);
                    if(DeviceFilter[equipments[i]._haid]){
                        $scope.items.push(equipments[i]);
                    }
                }
            }
        })
    }
    $scope.goUrl = function (item) {
        console.log(item);
        switch (item._haid){
            case '01040201':  $state.go('menu.windowScreen',{label:item._label,name:item._name,sceneName:$scope.name}); break;  //窗帘
            case '01040310':
                if(item._subtype=='X72C1'){
                    $state.go("menu.TV",{item:JSON.stringify(item)});
                    break;
                }
                console.log(item);
                var code_type;
                var sub_type;
                for(var i = 0;i<item.params.param.length;i++){
                    if('code_type'==item.params.param[i]._content){
                        code_type = item.params.param[i]._value;
                    }
                    if('sub_type'==item.params.param[i]._content){
                        sub_type = item.params.param[i]._value;
                    }
                    if(code_type!=null && sub_type!=null){
                        break;
                    }
                }
                $state.go('menu.addAirCondition',{eq_id:item._name,name:name,code_type:code_type,sub_type:sub_type,extfield:item._extfield});
                break;
            case '01040502': $state.go('menu.rollingScreen',{label:item._label,name:item._name,sceneName:$scope.name}); break;//卷帘
            default: $state.go('menu.sceneDeviceSettings',{label:item._label,name:item._name,sceneName:$scope.name,ext:item._extfield,haid:item._haid});
        }
    }
    $scope.saveStatus = function(name,spaceName,checked){
        //alert(name+" "+spaceName+" "+checked);
        var cmd = {};
        if(checked){
            cmd[CMD.OPENORSTOP] = CMD.OPEN;
        }else{
            cmd[CMD.OPENORSTOP] = CMD.STOP;
        }
        cmd['_eq'] = name;
        cmd['_id'] = CMD.DEV_ON_OFF;
        var xml_data = x2js.json2xml_str({cmd:cmd});
        var data = {name:spaceName,eq_id:name,xml_data:xml_data};
        var promise = sceneService.saveSceneDevice(data);
        promise.success(function (response) {
            var jsonObj = x2js.xml_str2json(response);
            if(jsonObj.success._code=='1') {
               // alert("保存成功！");
                sceneService.showAlert("保存成功");
            }else{
                sceneService.showAlert(jsonObj.success._message);
            }
        })

    }
    $scope.goUpdate = function (url,item2) {
        console.log(item2);
        console.log($scope);
        item2._scenename = $scope.name;
        if(item2.haid=='01040314'){  //lock
            $state.go(url,{item2:JSON.stringify(item2)});
        }else if(item2.haid=='01040318'){  //PM
            $state.go(url,{item2:JSON.stringify(item2)});
           // $state.go(url,{check:item2._enable,fname:item2._fname,weeks:item2._weeks,date:item2._date,start_time:item2._start_time,end_time:item2._end_time,name:item2.condition._name,property:item2.condition._property,operator:item2.condition._operator,value:item2.condition._value,scenename:$scope.name,type:item2.haid});
        }else{
            $state.go(url,{item2:JSON.stringify(item2)});
            //$state.go(url,{check:item2._enable,fname:item2._fname,weeks:item2._weeks,date:item2._date,start_time:item2._start_time,end_time:item2._end_time,name:item2.condition._name,property:item2.condition._property,operator:item2.condition._operator,value:item2.condition._value,scenename:$scope.name,type:item2.haid});
        }

    }

    $scope.goDelete = function (name,index) {
        var id = this.item._name;
        var confirmPopup = $ionicPopup.show({
            template: '确定删除吗？',
            scope : $scope,
            buttons : [
                {
                    text : "取消"
                },
                {
                    text: "删除",
                    type: "button-assertive",
                    onTap: function (e) {
                        var data = {name:$scope.name,eq_id:id};
                        var promise = sceneService.deleteSceneDevice(data);
                        promise.success(function (response) {
                            var jsonObj = x2js.xml_str2json(response);
                            if(jsonObj.success._code=='1') {
                                sceneService.showAlert("删除成功！");
                                /*var its = [];
                                for(var i = 0;i<$scope.items.length;i++){
                                    if(i!=index){
                                        its.push($scope.items[i]);
                                    }
                                }
                                $scope.items = its;*/
                                $scope.items.splice(index, 1);
                            }else{
                                sceneService.showAlert(jsonObj.success._message);
                            }
                        })
                    }
                }
            ]
        });
    }
    $scope.goDeleteInput = function (item,index) {
        var confirmPopup = $ionicPopup.show({
            template: '确定删除吗？',
            scope : $scope,
            buttons : [
                {
                    text : "取消"
                },
                {
                    text: "删除",
                    type: "button-assertive",
                    onTap: function (e) {
                        var data = {name:$scope.name,eq_id:item._fname};
                        var promise = sceneService.deleteInputSceneDevice(data);
                        promise.success(function (response) {
                            var jsonObj = x2js.xml_str2json(response);
                            if(jsonObj.success._code=='1') {
                                sceneService.showAlert("删除成功！");
                            }else{
                                sceneService.showAlert(jsonObj.success._message);
                            }

                            $scope.itemsInput.splice(index, 1);
                        })
                    }
                }
            ]
        });
    }
    $scope.deleteSceneDevice = function () {
        var data;
        var promise;
        if(cache.input =='1'){
            data = {name:$scope.name,eq_id:cache.item.condition._name};
           // alert($scope.name+" "+cache.item.condition._name);
            promise = sceneService.deleteInputSceneDevice(data);
            promise.success(function (response) {
                var jsonObj = x2js.xml_str2json(response);
                if(jsonObj.success._code=='1') {
                    sceneService.showAlert("删除成功！");
                }else{
                    sceneService.showAlert(jsonObj.success._message);
                }

                $scope.itemsInput.splice(cache.index, 1);
            })
        }else{
           // alert($scope.name+" "+cache.item._name);
            data = {name:$scope.name,eq_id:cache.item._name}
            promise = sceneService.deleteSceneDevice(data);
            promise.success(function (response) {
                var jsonObj = x2js.xml_str2json(response);
                if(jsonObj.success._code=='1') {
                    sceneService.showAlert("删除成功！");
                }else{
                    sceneService.showAlert(jsonObj.success._message);
                }
                $scope.items.splice(cache.index, 1);
            })
        }
    }
    $scope.goUpdateDevice = function (item,url) {
        var code_type;
        var sub_type;
        switch (item._haid){
            case '01040201':
                var OPENORSTOP = item.cmd[CMD.OPENORSTOP];
                var HA_ATTRID_LEVEL = item.cmd[CMD.HA_ATTRID_LEVEL2];
                $state.go('menu.windowScreen',{label:item._label,name:item._name,sceneName:name,OPENORSTOP:OPENORSTOP,HA_ATTRID_LEVEL:HA_ATTRID_LEVEL}); break;  //窗帘
            case '01040310':
                if(item._subtype=='X72C1'){
                    console.log(item);
                    $state.go("menu.TV");
                    break;
                }
                for(var i = 0;i<item.params.param.length;i++){
                    if('code_type'==item.params.param[i]._content){
                        code_type = item.params.param[i]._value;
                        break;
                    }
                }
                var extfield = item._extfield;
                var temper = item.cmd[CMD.HA_ATTRID_LEVEL];
                var open = item.cmd[CMD.HA_DEVICEID_ON_OFF_OUTPUT];
                $state.go(url,{scenename:$scope.name,extfield:extfield,open:open,temp:temper,equipmentid:item._equipmentid,name:item._name,spatialname:item._spatialname,sub_type:item._subtype,code_type:code_type});
                break;
            case '01040502':
                var OPENORSTOP = item.cmd[CMD.OPENORSTOP];
                $state.go('menu.rollingScreen',{label:item._label,name:item._name,sceneName:name,OPENORSTOP:OPENORSTOP}); break;//卷帘
            default: $state.go('menu.sceneDeviceSettings',{label:item._label,name:item._name,sceneName:name});
        }
    }
}])

.controller('page12Ctrl', ['$scope', '$stateParams','$ionicModal', '$http','spaceService',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicModal,$http,spaceService) {
    var x2js = new X2JS();
    //alert(spaceService.get());
    var name = $stateParams.name;
    var icon = $stateParams.icon;//默认
    $scope.picItems = spacePic;
    $scope.label = $stateParams.label;
    $scope.pic = icon;
    $scope.chosePic = function (pic,index) {
        $scope.pic = pic.item;
        console.log($scope.pic);
        /*for(var i =0;i<spacePic.length;i++){
            document.getElementById('pic'+i).style.backgroundColor = '#FFFFFF';
        }
        document.getElementById('pic'+index).style.backgroundColor = 'beige';*/
        $scope.modalIcon.hide();
    }
    $scope.update = function(){
        var label = document.getElementById("name").value;
        var url = IPPort + 'service/spatial/update?name='+name+'&label='+label+'&icon='+$scope.pic ;
        $http.post(url).success(function(response) {
            var jsonObj = x2js.xml_str2json(response);
            if(jsonObj.success._code=='1'){
                spaceService.showAlert("修改成功");
            }else{
                spaceService.showAlert(jsonObj.success._message);
            }
            $scope.$ionicGoBack();
        });
    }
    //图标弹出层
    $ionicModal.fromTemplateUrl('templates/modalIcon.html', {
        scope: $scope
    }).then(function(modalIcon) {
        $scope.modalIcon = modalIcon;
    });
}])

.controller('sceneController', ['$scope', '$stateParams','$ionicModal','sceneService', '$state','$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicModal,sceneService,$state,$ionicPopup) {
    var x2js = new X2JS();
    $scope.picItems = scenePic;
    if($stateParams.icon!=null){
        $scope.pic = $stateParams.icon;
    }else{
        $scope.pic = scenePic[0];
    }

    $scope.sceneName = $stateParams.label;
    $scope.chosePic = function (pic,index) {
        console.log(pic);
        $scope.pic = pic.item;
        /*for(var i =0;i<scenePic.length;i++){
            document.getElementById('pic'+i).style.backgroundColor = '#FFFFFF';
        }
        document.getElementById('pic'+index).style.backgroundColor = 'beige';*/
        $scope.modalIcon.hide();
       // pic.style.backgroundColor = '#000000';
    }
    //图标弹出层
    $ionicModal.fromTemplateUrl('templates/modalIcon.html', {
        scope: $scope
    }).then(function(modalIcon) {
        $scope.modalIcon = modalIcon;
    });
    var cache = '';
    $scope.getScene = function(){
        var promise = sceneService.getScenes() ;
        promise.success(function (data) {
            var jsonObj = x2js.xml_str2json(data);
            var scenes = jsonObj.scenes.scene;
            $scope.items = [];
            $scope.items = scenes;
        });
    }
    $scope.goUrl = function (url,item) {
        $state.go(url,{name:item._name,tittle:item._label});
    }
    $scope.updateAnddelete = function (item,index) {
        var confirmPopup = $ionicPopup.show({
            title: item._label,
            template: '选择你要进行的操作',
            scope : $scope,
            buttons : [
                {
                    text : "取消"
                },
                {
                    text: "修改",
                    type: "button-balanced",
                    onTap : function (e) {
                        console.log(item);
                        $state.go('menu.updateScene',{name:item._name,label:item._label,icon:item._icon});
                    }
                },
                {
                    text: "删除",
                    type: "button-assertive",
                    onTap: function (e) {
                        var promise = sceneService.deleteScene(item._name);
                        promise.success(function (data) {
                            var x2js = new X2JS();
                            var jsonObj = x2js.xml_str2json(data);
                            if (jsonObj.success._code == '1') {
                                $scope.items.splice(index, 1);
                                sceneService.showAlert("删除成功！");
                            } else {
                                sceneService.showAlert(jsonObj.success._message);
                            }
                        });
                    }
                }
            ]
        });
    }
    $scope.save = function (sceneName) {
        var promise = sceneService.saveScene(sceneName,$scope.pic);
        promise.success(function (data) {
            var jsonObj = x2js.xml_str2json(data);
            if(jsonObj.success._code=='1') {
                sceneService.showAlert("保存成功！");
            }else{
                sceneService.showAlert(jsonObj.success._message);
            }
            $scope.$ionicGoBack();
        })
    }
    $scope.update = function (name) {
        var data = {name:$stateParams.name,label:name,icon:$scope.pic};
        var promise = sceneService.updateScene(data);
        promise.success(function (response) {
            var jsonObj = x2js.xml_str2json(response);
            if(jsonObj.success._code=='1'){
                sceneService.showAlert("修改成功！");
            }else{
                sceneService.showAlert(jsonObj.success._message);
            }
            $scope.$ionicGoBack();
        });
    }

}])
.controller('sceneDeviceCtrl', ['$scope', '$stateParams', 'sceneService',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams,sceneService) {
        var x2js = new X2JS();
        $scope.label = $stateParams.label;
        $scope.name = $stateParams.name;
        var sceneName = $stateParams.sceneName;
        console.log($stateParams);
        $scope.save = function (checked,name) {
            var cmd = {};
            if(checked){
                cmd[CMD.OPENORSTOP] = CMD.OPEN;
            }else{
                cmd[CMD.OPENORSTOP] = CMD.STOP;
            }
            if($stateParams.haid==dianbiao){
                cmd[CMD.HA_DEVICEID_ON_OFF_OUTPUT] = $stateParams.ext;
            }
            cmd['_eq'] = name;
            cmd['_id'] = CMD.DEV_ON_OFF;
            var x2js = new X2JS();
            var xml_data = x2js.json2xml_str({cmd:cmd});
            var data = {name:$stateParams.sceneName,eq_id:name,xml_data:xml_data};
            var promise = sceneService.saveSceneDevice(data);
            promise.success(function (response) {
                var jsonObj = x2js.xml_str2json(response);
                console.log(jsonObj);
                if(jsonObj.success._code=='1') {
                    sceneService.showAlert("保存成功！");
                }else{
                    sceneService.showAlert(jsonObj.success._message);
                }
                $scope.$ionicGoBack();
            }).error(function (response) {
                var jsonObj = x2js.xml_str2json(response);
                sceneService.showAlert(jsonObj.success._message)
            })
        }

    }])

    .controller('deviceCtrl', ['$scope', '$stateParams', '$state','$http','$ionicPopup','$ionicActionSheet','$ionicScrollDelegate',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,$state,$http,$ionicPopup,$ionicActionSheet,$ionicScrollDelegate) {
            var x2js = new X2JS();

            //长按删除
            $scope.deleteAccount = function(equlists) {
                equlistsName=equlists._name;
                var confirmPopup = $ionicPopup.show({
                    title: '确认删除？',
                    template: '确定要删除该设备吗?',
                    scope : $scope,
                    buttons : [
                        {text : "取消"},
                        {text : "确定",
                            type : "button-positive",
                            onTap : function (e) {
                                $http.post(IPPort+"service/equipment/remove?name="+equlistsName).success(function (data) {
                                    var x2js = new X2JS();
                                    var jsonObj = x2js.xml_str2json(data);
                                    if(jsonObj.success._code=='1'){
                                       // alert("删除成功！");
                                        $ionicPopup.alert({
                                            title: "提示",
                                            template: "删除成功"
                                        });

                                        //修改bug 删除后 实际已删除 但是还显示
                                        /*items = [];
                                        for(var i=0;i<$scope.equ.length;i++){
                                            if($scope.equ[i]._name!=equlistsName){
                                                items.push($scope.equ[i]);
                                            }
                                        }*/
                                        var equ = $scope.equ;
                                        items = [];
                                        for(var i=0;i<equ.length;i++){
                                            if(equ[i]._name!=equlistsName){
                                                items.push(equ[i]);
                                            }
                                        }
                                        if(items.length==0){
                                            $scope.spatialsNameList = [];
                                        }
                                        $scope.q =$scope.equ = items;
                                    }else{
                                        $ionicPopup.alert({
                                            title: "提示",
                                            template: jsonObj.success._message
                                        });
                                        //alert(jsonObj.success._message);
                                    }
                                });
                            }
                        }
                    ]
                });
                return equlistsName;
            }
            //获取设备列表
            $scope.initDevice = function () {
                $http.post(IPPort+"service/spatial/list").success(function (data) {
                    var jsonObj = x2js.xml_str2json(data);
                    $scope.spatialsNameList =jsonObj.spatials.spatial;
                    $http.get(IPPort+"service/equipment/list?typename=-1").success(function (data) {
                        var x2js = new X2JS();
                        var jsonObj = x2js.xml_str2json(data);
                        $scope.equ = null;
                        $scope.q =jsonObj.equipments.equipment;
                        for(var i =0 ;i<$scope.spatialsNameList.length;i++){
                            if($scope.q.length) {
                                for (var j = 0; j < $scope.q.length; j++) {
                                  //  console.log($scope.q[j]._spatialname + " " + $scope.spatialsNameList[i]._name)
                                    if ($scope.q[j]._spatialname == $scope.spatialsNameList[i]._name) {
                                        $scope.spatialsNameList[i].check = true;
                                    }
                                }
                                $scope.spatialsNameList[i].icon = pageStatus.plus;
                            }else{
                                if ($scope.q._spatialname == $scope.spatialsNameList[i]._name) {
                                    console.log($scope.q._spatialname + " " + $scope.spatialsNameList[i]._name)
                                    $scope.spatialsNameList[i].check = true;
                                    $scope.spatialsNameList[i].icon = pageStatus.plus;
                                }

                            }
                        }
                    });
                });
            }
            $scope.launch = function (item) {
                console.log(item);
                $ionicScrollDelegate.scrollTop();
                for(var i =0 ;i<$scope.spatialsNameList.length;i++){
                    if(item._name==$scope.spatialsNameList[i]._name){
                        $scope.spatialsNameList[i].icon = $scope.spatialsNameList[i].icon==pageStatus.plus?pageStatus.minus:pageStatus.plus;
                        $scope.show = $scope.spatialsNameList[i].icon==pageStatus.plus?'':item._name;
                    }else{
                        $scope.spatialsNameList[i].icon = pageStatus.plus;
                    }
                }
                $scope.icon = $scope.icon==pageStatus.plus?pageStatus.minus:pageStatus.plus;
                $scope.equ = $scope.q.length?$scope.q:[$scope.q];
            }

            //页面跳转
            $scope.goToDevice = function(tittle,device,space,icon){
                console.log(device);
                switch (device._haid){
                    case '04000A01':
                        $state.go("menu.add485Device",{'item':JSON.stringify(device)});
                        break;
                    //case '01040310':

                        /*else {
                            var item = device;
                            console.log(item);
                            var code_type;
                            var sub_type;
                            for (var i = 0; i < item.params.param.length; i++) {
                                if ('code_type' == item.params.param[i]._content) {
                                    code_type = item.params.param[i]._value;
                                }
                                if ('sub_type' == item.params.param[i]._content) {
                                    sub_type = item.params.param[i]._value;
                                }
                                if (code_type != null && sub_type != null) {
                                    break;
                                }
                            }
                            $state.go('menu.addAirCondition', {
                                eq_id: item._name,
                                name: name,
                                code_type: code_type,
                                sub_type: sub_type
                            });
                            break;
                        }*/
                    default: $state.go('menu.revampedDevice',{tittle:tittle,device:JSON.stringify(device) ,space:JSON.stringify(space),icon:icon});
                }
            }



            //  点删除弹出 对话框
            $scope.showConfirm = function() {

                var confirmPopup = $ionicPopup.show({
                    title: '确认删除？',
                    template: '确定要删除该设备吗?',
                    scope : $scope,
                    buttons : [
                        {text : "取消"},
                        {text : "确定",
                            type : "button-positive",
                            onTap : function (e) {
                                $http.post(IPPort+"service/equipment/remove?name="+equlistsName).success(function (data) {
                                    var x2js = new X2JS();
                                    var jsonObj = x2js.xml_str2json(data);
                                    if(jsonObj.success._code=='1'){
                                        //alert("删除成功！");
                                        $ionicPopup.alert({
                                            title: "提示",
                                            template: "删除成功"
                                        });
                                    }else{
                                      //  alert(jsonObj.success._message);
                                        $ionicPopup.alert({
                                            title: "提示",
                                            template: jsonObj.success._message
                                        });
                                    }
                                });
                            }
                        }
                    ]
                });

                confirmPopup.then(function(res) {
                    if(res) {
                        $http.post(IPPort+"service/equipment/remove?name="+equlistsName).success(function (data) {
//		       		 document.getElementById("page14-button1").style.display = "none";
                            var x2js = new X2JS();
                            var jsonObj = x2js.xml_str2json(data);
                            if(jsonObj.success._code=='1'){
                              //  alert("删除成功！");
                                $ionicPopup.alert({
                                    title: "提示",
                                    template: "删除成功"
                                });
                            }else{
                                //alert(jsonObj.success._message);
                                $ionicPopup.alert({
                                    title: "提示",
                                    template: jsonObj.success._message
                                });
                            }
                        });
                    }
                });
            };
        }])
.controller('addSpaceCtrl', ['$scope', '$stateParams','$ionicModal','$http','$state','$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicModal,$http,$state,$ionicPopup) {
    var x2js = new X2JS();
    $scope.picItems = spacePic;
    $scope.pic = 'lib/ionic/img/space/defult.png';
    $ionicModal.fromTemplateUrl('templates/modalIcon.html', {
        scope: $scope
    }).then(function(modalIcon) {
        console.log(modalIcon);
        $scope.modalIcon = modalIcon;
    });
    $scope.chosePic = function (pic,index) {
        $scope.pic = pic.item;
       /* for(var i =0;i<spacePic.length;i++){
            document.getElementById('pic'+i).style.backgroundColor = '#FFFFFF';
        }
        document.getElementById('pic'+index).style.backgroundColor = 'beige';*/
        $scope.modalIcon.hide();
    }
    $scope.save = function(){
        var spaceName = document.getElementById('spaceName').value;
        if(null!=$scope.pic){
            var icon = $scope.pic;  //默认的图标
        }else{
            var icon = 'icon ion-android-home';  //默认的图标
        }

        var url = IPPort+'service/spatial/add?label='+spaceName+'&icon='+icon;
        $http.post(url).success(function(response) {
            var jsonObj = x2js.xml_str2json(response);
            if(jsonObj.success._code=='1'){
               // alert("保存成功");
                $ionicPopup.alert({
                    title: "提示",
                    template: "保存成功"
                });
            }else{
               // alert(jsonObj.success._message);
                $ionicPopup.alert({
                    title: "提示",
                    template: jsonObj.success._message
                });
            }
            $state.go("menu.page6");
        });
    }
}])

.controller('MessagePersonCtrl', ['$scope', '$stateParams','messageService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,messageService) {
        console.log("gwid"+$stateParams.gwid);
        $scope.save = function (data,save) {
            data.gwid = $stateParams.gwid;
            data.compile = Utilcompile;
            data.isSend = data.isSend?'1':'0';
            //console.log(data);
            var promise = messageService.saveOrUpdateSecurityPhone(data);
            promise.success(function (data) {
                if(data.result=='1'){
                    if(save=='1'){
                       // alert("修改成功");
                        messageService.showAlert("修改成功");
                    }else{
                        //alert("保存成功");
                        messageService.showAlert("保存成功");
                    }
                }else{
                    messageService.showAlert(data.msg);
                    //alert(data.msg);
                }
                $scope.$ionicGoBack();
            })
        }
        $scope.init = function () {
            $scope.gwid = $stateParams.gwid;
            $scope.compile = $stateParams.compile;
            $scope.phone = $stateParams.phone;
            $scope.username = $stateParams.username;
            $scope.isSend = $stateParams.isSend=="true"?true:false;

        }

}])
.controller('page16Ctrl', ['$scope', '$stateParams','deviceService','$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams,deviceService,$state) {


        $scope.goUrl = function () {
            $state.go('menu.listInfrared');
        }

        $scope.init = function () {
            var x2js = new X2JS();
            var haid = '01040310';
            var promise = deviceService.equipmentGet2({haid:haid});
            promise.success(function (data) {
                var jsonObj = x2js.xml_str2json(data);

                $scope.items = jsonObj.equipments;
                console.log($scope.items);
                var device = {};
                if($scope.items==null){
                    $state.go('menu.findDevice');
                }
            })
        }


        $scope.goDetail = function (item) {
            $state.go('menu.page22', {device: JSON.stringify(item), tittle: item._label});
        }

    }])
    .controller('CenterAirCtrl', ['$scope', '$stateParams','deviceService','$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,deviceService,$state) {
            $scope.init = function () {
                var x2js = new X2JS();
                var haid = CenterAir;
                var promise = deviceService.equipmentGet2({haid:haid});
                promise.success(function (data) {
                    var jsonObj = x2js.xml_str2json(data);
                    $scope.items = jsonObj.equipments;
                    console.log($scope.items);
                })
            }

            $scope.goToDevice = function (item) {
                console.log(item);
            }

           /* $scope.goDetail = function (item) {
                $state.go('menu.page22', {device: JSON.stringify(item), tittle: item._label});
            }*/

        }])

    .controller('findDeviceCtrl', ['$scope', '$stateParams', '$state','$http','$timeout','deviceService','$ionicLoading','$interval','$rootScope',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,$state,$http,$timeout,deviceService,$ionicLoading,$interval,$rootScope) {
            var x2js = new X2JS();
            $scope.deviceList = {};
            $scope.newDevicesList = [];
            var time =30;


            $scope.clearDevice = function () {
                console.log("清空");
                $scope.deviceList = {};
                $scope.newDevicesList = $rootScope.newDevicesList;

            }

            $scope.findDevices = function(newdevice){
                $scope.newDevicesList = [];
                $ionicLoading.show({
                    template :"<img style='width: 75px;padding: 0px;' src='lib/ionic/img/base/loading.gif'></img>",
                    content: '查找中',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 2000,
                    showDelay: 0
                });

                var searchDevice = function searchDevice() {

                    console.log("time="+time);
                    if(--time>0){
                        var promise2 = deviceService.shownewdevices();
                        promise2.success(function (data) {
                            if(data!=='<equipments></equipments>'){
                                var jsonObj = x2js.xml_str2json(data);
                                var equipments = jsonObj.equipments.equipment;
                                if(equipments.length){
                                    for(var i = 0;i<equipments.length;i++){
                                        $scope.deviceList[equipments[i]._equipmentid] = equipments[i];
                                    }
                                }else{
                                    $scope.deviceList[equipments._equipmentid] = equipments;
                                }
                            //    $scope.deviceList.push(jsonObj.equipments.equipment);
                            }
                        })
                    }
                    if(time==0){
                        if($scope.deviceList ==null){
                            deviceService.showAlert("未查找到设备");// alert("未查找到设备");
                        }else{
                            console.log($scope.deviceList);
                            for(var device in $scope.deviceList){
                                $scope.newDevicesList.push($scope.deviceList[device]);
                            }
                            $rootScope.newDevicesList = $scope.newDevicesList;
                           // $scope.newDevicesList = $scope.deviceList;
                        }
                        $ionicLoading.hide();
                        $http.post(IPPort+"service/commissioning/findnetworknewdevices?duration=0").success(function (data) {
                            console.log("关闭查找")
                        })
                      //  deviceService.findnetworknewdevices({duration:'0'}).success(function(response) {console.log("关闭查找")});

                    }
                }

                //查找智能设备
                var promise = deviceService.findnetworknewdevices({duration:'30'});
                promise.success(function (data) {
                    if(data!=null){
                        time =30;
                        $interval(searchDevice, 1000, 30);

                      //  setInterval("searchDevice()", 1000);
                    }
                })
               /* $timeout(
                    function () {
                        $ionicLoading.hide();
                        //promise.success(function (dat) {
                           /!* var promise2 = deviceService.shownewdevices();
                            promise2.success(function (data) {
                                console.log(data);
                                if(data!=='<equipments></equipments>'){//判断返回的设备是不是为空
                                    var jsonObj = x2js.xml_str2json(data);
                                    //判断查找的返回设备是否是数组
                                    if(jsonObj.equipments.equipment instanceof Array){
                                        $scope.newDevicesList =jsonObj.equipments.equipment;
                                        console.log($scope.newDevicesList);
                                    }else{
                                        var arr =[];
                                        arr.push(jsonObj.equipments.equipment);
                                        $scope.newDevicesList =arr;
                                    }
                                    $http.post(IPPort+"service/commissioning/findnetworknewdevices",{duration:0}).success(function(response) {console.log("关闭查找")});
                                }else{
                                    deviceService.showAlert("未查找到设备");// alert("未查找到设备");
                                }
                            })*!/

                            if($scope.deviceList.length<=0){
                                deviceService.showAlert("未查找到设备");// alert("未查找到设备");
                            }else{
                                $scope.newDevicesList = $scope.deviceList;
                            }
                            $http.post(IPPort+"service/commissioning/findnetworknewdevices",{duration:0}).success(function(response) {console.log("关闭查找")});
                      //  });
                    },30000);*/
            }
            //跳转设备页
            $scope.goToDevice = function(newdevice,tittle){
                switch (newdevice._haid){
                    case '01040310':
                        $state.go('menu.page22',{tittle:tittle,device:JSON.stringify(newdevice)});
                        break;
                    /*case ' ':
                        if(newdevice._subtype=='X72C1'){
                            $state.go("menu.TV");
                            break;
                        }
                        var item = newdevice;
                        console.log(item);
                        var code_type;
                        var sub_type;
                        if(item.params) {
                            for (var i = 0; i < item.params.param.length; i++) {
                                if ('code_type' == item.params.param[i]._content) {
                                    code_type = item.params.param[i]._value;
                                }
                                if ('sub_type' == item.params.param[i]._content) {
                                    sub_type = item.params.param[i]._value;
                                }
                                if (code_type != null && sub_type != null) {
                                    break;
                                }
                            }
                            $state.go('menu.addAirCondition',{eq_id:item._name,name:name,code_type:code_type,sub_type:sub_type});
                        }else{
                            $state.go('menu.addAirCondition',{eq_id:item._equipmentid,name:item._controlequipmentname});
                        }

                        break;*/
                    default: $state.go('menu.addDevice',{newdevice:JSON.stringify(newdevice),tittle:tittle});
                }



            }
        }])

    .controller('addZigBeeCtrl', ['$scope', '$stateParams','$state', '$http','deviceService','$timeout',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,$state,$http,deviceService,$timeout) {
            var x2js = new X2JS();
            $scope.getDevice = function () {
                var promise = deviceService.getSafeDevice();
                promise.success(function (data) {
                    var jsonObj = x2js.xml_str2json(data);
                    $scope.items = jsonObj.equipments.equipment;
                    console.log($scope.items);
                })
            }
            $scope.goToDevice = function(item){
                /*var promise = deviceService.getDeviceByType({typename:3});
                var b = 0;
                promise.success(function (data) {
                    var jsonObj = x2js.xml_str2json(data);
                    var existList = jsonObj.equipments.equipment;
                    if(existList) {
                        if (existList instanceof Array) {
                            for (var j = 0; j < existList.length; j++) {
                                if (existList[j]._subtype == item._subtype&&existList[j]._haid==item._haid) {
                                    b++;
                                }
                            }
                        } else {
                            console.log(existList);
                            if (existList._subtype == item._subtype) {
                                b++;
                            }
                        }
                    }
                    if(b>0){
                        deviceService.showAlert("你已添加该设备");
                    }else {*/
                        console.log(item);
                        $state.go('menu.page19', {
                            tittle: item._label,
                            name: item._name,
                            allowedremote: item._allowedremote,
                            controlequipmentname: item._controlequipmentname,
                            customicon: item._customicon,
                            equipmentid: item._equipmentid,
                            haid: item._haid,
                            securityname: item._securityname,
                            spatialname: item._spatialname,
                            subtype: item._subtype,
                            typename: item._typename
                        });
                   // }
               // });


            }

            $scope.initDevice = function () {
                $scope.name = $stateParams.name ;
                $scope.tittle = $stateParams.tittle;
            }

        }])

    .controller('page19Ctrl', ['$scope', '$stateParams','$ionicModal','$http','deviceService','$timeout','$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,$ionicModal,$http,deviceService,$timeout,$ionicPopup) {
            var x2js = new X2JS();
            $scope.picItems = devicePics;
            $scope.pic = 'dianqi';
            //获取空间列表
            $http.post(IPPort+"service/spatial/list").success(function (data) {
                var jsonObj = x2js.xml_str2json(data);
                $scope.spatialsNameList =jsonObj.spatials.spatial;
                if( $scope.spatialsNameList  != null && $scope.spatialsNameList.length >0){
                    $scope.space= $scope.spatialsNameList[0];
                }
            });
            $scope.initDevice = function () {
                console.log($stateParams);
                $scope.name = $stateParams.name ;
                $scope.tittle = $stateParams.tittle;
                $scope.enClick = 'disabled';
                $scope.newdevice = {};
                $scope.newdevice._label = $stateParams.tittle;

            }

            //设备对码
            /*$scope.matchCode = function() {
                $http.post(IPPort+"service/commissioning/matchcode").success(function (data) {
//			   				var x2js = new X2JS();
//			       		var jsonObj = x2js.xml_str2json(data);
//			       		 $scope.spatialsNameList =jsonObj.spatials.spatial;
//			       		  if( $scope.spatialsNameList  != null && $scope.spatialsNameList.length >0){
//								      $scope.space= $scope.spatialsNameList[0];
//								 }
                    alert(data);
                });
            };*/
            $scope.matchCode = function () {
                var select = document.getElementById("select");
                var data = {equipmentid:$stateParams.equipmentid,
                    haid:$stateParams.haid,
                    controlequipmentname:$stateParams.controlequipmentname,
                    checked:$scope.checked?"on":"off",
                    typename:$stateParams.typename,
                    spatialname:$scope.space._name,
                    customicon:$scope.pic,
                    subtype:$stateParams.subtype,
                   // securityname:$stateParams.securityname,
                    securityname:'3',
                    name:$stateParams.name,
                    label:$scope.newdevice._label};
                var promise = deviceService.saveSafeDevice(data);
                promise.success(function (data) {
                    var jsonObj = x2js.xml_str2json(data);
                    var name = jsonObj.equipment ;
                    document.getElementById("page19-button9").innerHTML = "对码中……";
                    document.getElementById("page19-button9").disabled = true;
                    var promise = deviceService.matchCode({name:name});
                    $timeout(promise,30000);
                    promise.success(function (data) {
                        var jsonObj = x2js.xml_str2json(data);
                        if(jsonObj.success._code =='0'){
                            deviceService.showAlert(jsonObj.success._message);
                            removeDevice(name);
                            // alert(jsonObj.success._message);
                        }else{
                          //  deviceService.showAlert("对码成功！");
                            var confirmPopup = $ionicPopup.show({
                                title: '对码成功',
                                template: '是否保存设备？',
                                scope : $scope,
                                buttons : [
                                    {   text : "确定",
                                        type: "button-positive",
                                        onTap : function (e) {
                                            $scope.$ionicGoBack();
                                        }
                                    },
                                    {   text : "取消",
                                        onTap : function (e) {
                                            removeDevice(name);
                                            $scope.$ionicGoBack();
                                        }
                                    }
                                ]
                            });
                        }
                        removeDevice(name);
                        document.getElementById("page19-button9").innerHTML = "对码";
                        document.getElementById("page19-button9").disabled = false;
                    })
                    promise.error(function (data) {
                        removeDevice(name);
                        deviceService.showAlert("请求超时");
                        document.getElementById("page19-button9").innerHTML = "对码";
                        document.getElementById("page19-button9").disabled = false;
                        // alert("请求超时");
                    })

                });


            }
            function removeDevice(name) {
                $http.post(IPPort+"service/equipment/remove?name="+name).success(function (data) {
                    var x2js = new X2JS();
                    var jsonObj = x2js.xml_str2json(data);
                    if(jsonObj.success._code=='1'){
                        console.log("对码失败，删除设备成功");
                    }else{
                        console.log("对码失败，删除设备失败");
                    }
                });
            }
            $scope.saveSafeDevice = function () {
                var data = {equipmentid:$stateParams.equipmentid,
                    haid:$stateParams.haid,
                    controlequipmentname:$stateParams.controlequipmentname,
                    checked:$stateParams.allowedremote?"on":"off",
                    typename:$stateParams.typename,
                    spatialname:$scope.space._name,
                    customicon:$stateParams.customicon,
                    subtype:$stateParams.subtype,
                    securityname:$stateParams.securityname,
                    name:$stateParams.name,
                    label:$stateParams.tittle};
                var promise = deviceService.saveSafeDevice(data);
                promise.success(function (data) {
                    alert(data);
                });
            }

            $scope.chosePic = function (pic,index) {
                $scope.pic = pic.item;
                $scope.modalIcon.hide();
            }

            //空间弹出层
            $ionicModal.fromTemplateUrl('templates/modal.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
            });
            //弹出点击
            $scope.serverSideChange = function(item) {
                $scope.space =item;
                $scope.modal.hide();
                //点击空间时更换空间
                $http.post(IPPort+"service/spatial/update",{
                    name:item._name,
                    label:item._label,
                    icon:item._icon,
                }).success(function (data) {
                    deviceService.showAlert(data);
                });
            };

            //图标弹出层
            $ionicModal.fromTemplateUrl('templates/modalIcon.html', {
                scope: $scope
            }).then(function(modalIcon) {
                $scope.modalIcon = modalIcon;
            });

            //添加（保存）智能设备
            $scope.equipmentSave = function(){
                var data = {"haid":newdevice._haid, "typename":newdevice._typename, "equipmentid":newdevice._equipmentid, "controlequipmentname":newdevice._controlequipmentname,"spatialname":$scope.space._name, "customicon":$scope.pic};
                var promise = deviceService.saveSafeDevice(data);
                promise.success(function (data) {
                    $scope.$ionicGoBack();
                    var jsonObj = x2js.xml_str2json(data);
                    if(jsonObj.success._code =='0'){

                        deviceService.showAlert(jsonObj._message);
                    }else{
                        deviceService.showAlert("保存成功！");
                    }
                });
            }

        }])

    .controller('Add485Ctrl', ['$scope', '$stateParams','$http','deviceService','$ionicModal','$rootScope','$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,$http,deviceService,$ionicModal,$rootScope,$ionicPopup) {
            var x2js = new X2JS();
            $scope.typenames = typename;
            $scope.picItems = devicePics;
            $scope.pic = 'dianqi';
            $scope.newdevice = {};
            console.log($stateParams);
            if($stateParams.item!=null&&$stateParams.item!=""){
                $scope.updateState = true;
                $scope.newdevice = JSON.parse($stateParams.item);
                $scope.newdevice._address = $scope.newdevice._equipmentid;
                $scope.pic = $scope.newdevice._customicon;
                $scope.space = $scope.newdevice._spatialname;
                console.log($scope.newdevice);
            }
            //获取空间列表
            $http.post(IPPort+"service/spatial/list").success(function (data) {
                var jsonObj = x2js.xml_str2json(data);
                $scope.spatialsNameList =jsonObj.spatials.spatial;
                if( $scope.spatialsNameList  != null && $scope.spatialsNameList.length >0){
                    $scope.space= $scope.spatialsNameList[0];
                }

            });
            //空间弹出层
            $ionicModal.fromTemplateUrl('templates/modal.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
            });
            //弹出点击
            $scope.serverSideChange = function(item) {
                $scope.space =item;
                $scope.modal.hide();
                //点击空间时更换空间
                $http.post(IPPort+"service/spatial/update",{
                    name:item._name,
                    label:item._label,
                    icon:item._icon,
                }).success(function (data) {
                });
            };
            $scope.chosePic = function (pic,index) {
                $scope.pic = pic.item;
                console.log($scope.pic);
                $scope.modalIcon.hide();
            }

            //图标弹出层
            $ionicModal.fromTemplateUrl('templates/modalIcon.html', {
                scope: $scope
            }).then(function(modalIcon) {
                $scope.modalIcon = modalIcon;
            });
            //添加（保存）智能设备
            $scope.equipmentSave = function(newdevice) {
                var select = document.getElementById("typenameSelect");
                var typenameSelect = select[select.selectedIndex].value;
                if(newdevice._address==null||newdevice._address==''){
                    deviceService.showAlert("设备地址为空！");
                    return;
                }
                if(newdevice._address.length>12){
                    deviceService.showAlert("设备地址不能超过12位！");
                    return;
                }
                if(newdevice._label==null||newdevice._label==''){
                    deviceService.showAlert("设备名称为空！");
                    return;
                }
                var url = IPPort + "service/equipment/save?" +
                    "typename=" + typenameSelect +
                    "&equipmentid=" + newdevice._address +
                    "&haid=" + dianbiao +
                    "&controlequipmentname=" + newdevice._address +
                    "&spatialname=" + $scope.space._name +
                    "&customicon=" + $scope.pic +
                    "&label=" + newdevice._label;
                if($scope.updateState){
                    url = url + "&name="+$scope.newdevice._name;
                }

                console.log(newdevice);
                $http.get(url).success(function (data) {
                    var x2js = new X2JS();
                    var jsonObj = x2js.xml_str2json(data);
                    if (jsonObj.equipment > 0) {
                        //   $rootScope.newDevicesList = newdevice._equipmentid;
                        if($rootScope.newDevicesList instanceof Array) {
                            for (var i = 0; i < $rootScope.newDevicesList.length; i++) {
                                if ($rootScope.newDevicesList[i]._equipmentid == newdevice._equipmentid) {
                                    $rootScope.newDevicesList.splice(i, 1);
                                }
                            }
                        }
                        $ionicPopup.alert({
                            title: "提示",
                            template: "保存成功"
                        });
                        // alert("保存成功");
                    } else {
                        $ionicPopup.alert({
                            title: "提示",
                            template: "保存失败"
                        });
                        // alert("保存失败");
                    }
                    $scope.$ionicGoBack();

                });
            }

        }])

    .controller('page22Ctrl', ['$scope', '$stateParams','$state','deviceService','$http','$ionicModal', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,$state,deviceService,$http,$ionicModal) {
            var x2js = new X2JS();
            $scope.tittle = $stateParams.tittle;
            $scope.device = $stateParams.device;
            var code_type =  '';
            var sub_type = '';
            $scope.goDetail = function (label,type) {
                $state.go('menu.showInfrared',{tittle:label,type:type,device:JSON.stringify($stateParams.device)});
            }

            $scope.initDevice = function () {
                $scope.device = $stateParams.device;
                $scope.tittle = $stateParams.tittle;
                var subtype = '';
                if('1'==$stateParams.type) {
                    subtype = 'X72C1';
                }else if('2'==$stateParams.type) {
                    subtype = 'X72C0';
                }else{

                }
                var data = {'haid':'01040310','subtype':subtype};
                var promise = deviceService.getParams(data);
                promise.success(function (result) {
                    var jsonObj = x2js.xml_str2json(result);
                    $scope.items = jsonObj.equipmenttemplatemodels.model;
                    console.log($scope.items);
                });
            }
            


            $scope.goInfrared = function (item) {
                $state.go('menu.addDeviceInfrared',{newdevice:JSON.stringify(item),device:$scope.device});
            }

            $scope.initInfraredDevice = function () {
                $scope.device = JSON.parse($stateParams.device);
                $scope.newdevice = JSON.parse($stateParams.newdevice);
                $http.post(IPPort+"service/spatial/list").success(function (data) {
                    var jsonObj = x2js.xml_str2json(data);
                    $scope.spatialsNameList =jsonObj.spatials.spatial;
                    if( $scope.spatialsNameList  != null && $scope.spatialsNameList.length >0){
                        $scope.space= $scope.spatialsNameList[0];
                    }
                });
                $scope.picItems = devicePics;
                $scope.pic = 'dianqi';
            }

            $scope.chosePic = function (pic,index) {
                $scope.pic = pic.item;
                console.log($scope.pic);
                /*for(var i =0;i<spacePic.length;i++){
                 document.getElementById('pic'+i).style.backgroundColor = '#FFFFFF';
                 }
                 document.getElementById('pic'+index).style.backgroundColor = 'beige';*/
                $scope.modalIcon.hide();
            }



            $ionicModal.fromTemplateUrl('templates/modal.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
            });
            //图标弹出层
            $ionicModal.fromTemplateUrl('templates/modalIcon.html', {
                scope: $scope
            }).then(function(modalIcon) {
                $scope.modalIcon = modalIcon;
            });

            $scope.serverSideChange = function(item) {
                $scope.space = item;
                $scope.modal.hide();
            };
            
            $scope.saveInfraredDevice = function (newdevice) {
                var device = JSON.parse($scope.device);
                var params = {};
                params.params = newdevice.params;
                params._paramsid = newdevice._name;
                console.log(JSON.stringify(params));
                console.log(x2js.json2xml_str(params));
                var data = {"haid":device._haid,'paramsid':newdevice._name, "typename":'1', label:newdevice._label,"equipmentid":device._equipmentid, "controlequipmentname":device._controlequipmentname,"spatialname":$scope.space._name, "customicon":$scope.pic,'xml_data':x2js.json2xml_str(params)};
                var promise = deviceService.saveSafeDevice(data);
                promise.success(function (data) {
                    $scope.$ionicGoBack();
                    var jsonObj = x2js.xml_str2json(data);
                    if(jsonObj.equipment) {
                        deviceService.showAlert("保存成功！");
                    }else{
                        deviceService.showAlert(jsonObj._message);
                    }
                });
            }
        }])

    .controller('page23Ctrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams) {


        }])

    .controller('TVCtrl', ['$scope', '$stateParams','sceneService',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams,sceneService) {
        $scope.TVList = [
            { text: "开机", value: "01" },
            { text: "关机", value: "02" },
            { text: "--/-", value: "03" },
            { text: "静音", value: "04" },
            { text: "待机", value: "05" },
            { text: "音量+", value: "06" },
            { text: "音量-", value: "07" },
            { text: "频道+", value: "08" },
            { text: "频道-", value: "09" },
            { text: "回看", value: "0A" },
            { text: "上", value: "0B" },
            { text: "下", value: "0C" },
            { text: "左", value: "0D" },
            { text: "右", value: "0E" },
            { text: "确定", value: "0F" },
            { text: "0", value: "10" },
            { text: "1", value: "11" },
            { text: "2", value: "12" },
            { text: "3", value: "13" },
            { text: "4", value: "14" },
            { text: "5", value: "15" },
            { text: "6", value: "16" },
            { text: "7", value: "17" },
            { text: "8", value: "18" },
            { text: "9", value: "19" }];

        $scope.TVSelect = function (it) {
            $scope.item = JSON.parse($stateParams.item);
            var cmd = {};
            cmd[CMD.HA_DEVICEID_ON_OFF_OUTPUT] = $scope.item._extfield;
            cmd['_eq'] = CMD.HA_CMDID_DEV_INFRARED_CMD;
            cmd['_id'] = $scope.item._name;
            cmd[CMD.HA_ATTRID_LEVEL] = it.value;
            cmd[CMD.HA_ATTRID_INFRARED_CODE_TYPE] =$scope.item.params.param[0]._value;
            cmd[CMD.HA_ATTRID_INFRARED_SUB_TYPE] = $scope.item._subtype;
            var x2js = new X2JS();
            var xml_data = x2js.json2xml_str({cmd:cmd});
            var data = {name:$scope.item._name,eq_id:CMD.HA_CMDID_DEV_INFRARED_CMD,xml_data:xml_data};
            console.log(data);
            var promise = sceneService.saveSceneDevice(data);
            promise.success(function (response) {
                var jsonObj = x2js.xml_str2json(response);
                if(jsonObj.success._code=='1') {
                    sceneService.showAlert("保存成功！");
                }else{
                    sceneService.showAlert(jsonObj.success._message);
                }
            })

        }

    }])
    .controller('addInfraredCtrl', ['$scope', '$stateParams', 'deviceService',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,deviceService) {

        }])

    .controller('airConditionCtrl', ['$scope', '$stateParams', 'sceneService',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,sceneService) {
                var x2js = new X2JS();
                $scope.getAirCondition = function () {
                    $scope.power = '1';
                    $scope.temper = '0';
                    var buttons = document.getElementsByName('button');
                    for(var i = 0 ;i < buttons.length;i++){
                        buttons[i].onclick = function () {
                            $scope.num = this.innerHTML;
                        }
                    }
                    $scope.num = '18';
                }
                $scope.initCondition = function () {
                    var temp = $stateParams.temp;
                    $scope.power = temp!='02'?'1':'0';
                    for(var t in airConditonTemp){
                        if(temp==airConditonTemp[t]){
                            var coldorwarm = t.substr(0,1);
                            var weather = t.substr(1,2);
                            $scope.num = weather;
                           // $scope.power = '1';
                            $scope.temper = coldorwarm;
                            var buttons = document.getElementsByName('button');
                            var index = '';
                            for(var i=0;i<buttons.length;i++){
                                if(buttons[i].innerHTML == weather){
                                    index = i;
                                    buttons[i].className = 'button activated';
                                   // button.setAttribute('class','button');
                                }
                                buttons[i].onclick = function () {
                                    if(index!=''){
                                        buttons[index].className = 'button button-positive';
                                    }
                                    this.className = 'button activated';
                                    $scope.num = this.innerHTML;
                                }
                            }
                            break;
                        }
                    }
                    //var temp = $stateParams.temp;

                   /* $stateParams.equipmentid;
                    $stateParams.name;
                    $stateParams.spatialname;
                    $stateParams.subtype;*/
                }
                $scope.change = function (t,type) {
                    if('power' ==type){
                        $scope.power = t.power;
                    }else{
                        $scope.temper = t.temper;
                    }
                }
                $scope.update = function () {
                    var power = $scope.power ;
                    var temper = $scope.temper==null?'0':$scope.temper;
                    var num = $scope.num==null?'18':$scope.num;
                    var code_type = $stateParams.code_type;
                    var sub_type = $stateParams.sub_type;
                    var name = $stateParams.scenename;
                    var eq_id = $stateParams.name;
                    console.log(code_type+" "+sub_type+" "+name+" "+eq_id);
                    var cmd = {};
                    cmd[CMD.HA_DEVICEID_ON_OFF_OUTPUT] = $stateParams.extfield;
                    cmd['_eq'] = eq_id;
                    cmd['_id'] = CMD.HA_CMDID_DEV_INFRARED_CMD;
                    if(power=='1') {
                        num = num ==null?'18':num;
                        cmd[CMD.HA_ATTRID_LEVEL] = airConditonTemp[temper + num];
                    }else{
                        cmd[CMD.HA_ATTRID_LEVEL] = '02';
                    }
                    cmd[CMD.HA_ATTRID_INFRARED_CODE_TYPE] = code_type;
                    cmd[CMD.HA_ATTRID_INFRARED_SUB_TYPE] = sub_type;
                    var x2js = new X2JS();
                    var xml_data = x2js.json2xml_str({cmd:cmd});
                    var data = {name:name,eq_id:eq_id,xml_data:xml_data};
                    var promise = sceneService.updateDevice(data);
                    promise.success(function (response) {
                        var jsonObj = x2js.xml_str2json(response);
                        if(jsonObj.success._code=='1') {
                            sceneService.showAlert("修改成功！");
                        }else{
                            sceneService.showAlert(jsonObj.success._message);
                        }
                        $scope.$ionicGoBack();
                    })
                }
                $scope.save = function () {
                    var power = $scope.power ;
                    var temper = $scope.temper;
                    var num = $scope.num;
                    var code_type = $stateParams.code_type;
                    var sub_type = $stateParams.sub_type;
                    var name = $stateParams.name;
                    var eq_id = $stateParams.eq_id;
                    console.log(code_type+" "+sub_type+" "+name+" "+eq_id);
                    var cmd = {};
                    cmd[CMD.HA_DEVICEID_ON_OFF_OUTPUT] = $stateParams.extfield;
                    cmd['_eq'] = eq_id;
                    cmd['_id'] = CMD.HA_CMDID_DEV_INFRARED_CMD;
                    if(power=='1') {
                        cmd[CMD.HA_ATTRID_LEVEL] = airConditonTemp[temper + num];
                    }else{
                        cmd[CMD.HA_ATTRID_LEVEL] = '02';
                    }
                    cmd[CMD.HA_ATTRID_INFRARED_CODE_TYPE] = code_type;
                    cmd[CMD.HA_ATTRID_INFRARED_SUB_TYPE] = sub_type;
                    var x2js = new X2JS();
                    var xml_data = x2js.json2xml_str({cmd:cmd});
                    var data = {name:name,eq_id:eq_id,xml_data:xml_data};
                    var promise = sceneService.saveSceneDevice(data);
                    promise.success(function (response) {
                        var jsonObj = x2js.xml_str2json(response);
                        if(jsonObj.success._code=='1') {
                            sceneService.showAlert("保存成功！");
                        }else{
                            sceneService.showAlert(jsonObj.success._message);
                        }
                        $scope.$ionicGoBack();
                    })
                }

        }])

    .controller('sceneInputDeviceCtrl', ['$scope', '$stateParams','sceneService','$ionicModal', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,sceneService,$ionicModal) {
            var x2js = new X2JS();
            console.log($stateParams);
            $scope.PMList = new Array(4);
            $scope.settingsList = [
                { text: "每天",value:'',checked: true },
                { text: "周一",value:'1', checked: false },
                { text: "周二",value:'2', checked: false },
                { text: "周三",value:'3', checked: false },
                { text: "周四",value:'4', checked: false },
                { text: "周五",value:'5', checked: false },
                { text: "周六",value:'6', checked: false },
                { text: "周日",value:'7', checked: false }
            ];
            $scope.values = JSON.parse($stateParams.item2)._weeks;
            if($scope.values==null||$scope.values==''){
                $scope.days = "每天";
            }else {
                $scope.settingsList[0].checked = false;
                for (var i = 1; i < $scope.settingsList.length; i++) {
                    if($scope.values.indexOf($scope.settingsList[i].value) != -1){
                        if($scope.days==null){
                            $scope.days = $scope.settingsList[i].text;
                        }else{
                            $scope.days = $scope.days +","+$scope.settingsList[i].text;
                        }
                        $scope.settingsList[i].checked = true;
                    }
                }
            }


            $ionicModal.fromTemplateUrl('templates/modal.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
            });

            $ionicModal.fromTemplateUrl('templates/modal2.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal2 = modal;
                $scope.modal2.openModal = function (index) {
                    $scope.modal2.show();
                    $scope.index = index;
                    console.log($scope.PMList[index]);
                    if(typeof ($scope.PMList[index])!='undefined'){
                        $scope.pmChecked = true;
                        $scope.pmSelect = $scope.PMList[index]._operator;
                        console.log($scope.PMList[index]._value);
                        if(typeof ($scope.PMList[index]._value)!='undefined'&&'undefined'!=$scope.PMList[index]._value) {
                            document.getElementById("pmNum").value = $scope.PMList[index]._value;
                            $scope.pmNum = $scope.PMList[index]._value;
                        }
                    }else{
                        $scope.pmChecked = false;
                        $scope.pmSelect = '';
                        $scope.pmNum = '';
                    }


                }
                $scope.modal2.confirm = function (pmChecked,pmSelect,pmNum) {
                    console.log(document.getElementsByName("pmNum")[0].value);
                    var PMStr = {};
                    PMStr['pmChecked'] = pmChecked;
                    PMStr['pmSelect'] = pmSelect;
                    PMStr['pmNum'] = document.getElementsByName("pmNum")[0].value;
                    PMStr['name'] = '1';
                    $scope.PMList[$scope.index] = PMStr;
                    $scope.pmChecked = false;
                    $scope.pmSelect = '';
                    $scope.pmNum = '';
                    $scope.modal2.hide();
                }
            });

            //弹出点击
            $scope.serverSideChange = function(item) {
                if(item.value!=null&&item.value!=''){
                    $scope.settingsList[0].checked = false;
                }else{
                    for(var i=1;i<$scope.settingsList.length;i++){
                        $scope.settingsList[i].checked = false;
                    }
                }
                $scope.days=null;
                $scope.values = null;
                for(var i=0;i<$scope.settingsList.length;i++){
                    if($scope.settingsList[i].checked){
                        if($scope.days==null){
                            $scope.days = $scope.settingsList[i].text;
                            $scope.values = $scope.settingsList[i].value;
                        }else {
                            $scope.days = $scope.days + "," + $scope.settingsList[i].text;
                            $scope.values = $scope.values+ ","+$scope.settingsList[i].value;
                        }
                    }

                }
            };

            $scope.getDetail = function () {
                var item2 = JSON.parse($stateParams.item2);
                console.log(item2);
                $scope.doorLock = false;
                $scope.PM = false;
                if(item2.haid=='01040314'){
                    $scope.doorLock = true;
                    if(item2.condition._property=='1039'){
                        $scope.$parent.inputText = true;
                        $scope.doorNum = parseInt(item2.condition._value).toString(16);
                        console.log($scope);
                    }else{

                    }
                }
                if(item2.haid=='01040318'){
                    console.log($scope);
                    $scope.PM = true;
                    if(item2.condition.length){
                        for(var i=0;i<item2.condition.length;i++){
                            $scope.PMList[i]=item2.condition[i];
                            $scope.PMList[i].pmSelect = item2.condition[i]._operator;
                            $scope.PMList[i].pmNum = item2.condition._value;
                        }
                    }else{
                        for(var i =0;i<4;i++){
                            if(PM25[i]==item2.condition._property){
                                $scope.PMList[i] = item2.condition;
                                $scope.PMList[i].pmSelect = item2.condition._operator;
                                $scope.PMList[i].pmNum = item2.condition._value;
                                break;
                            }
                        }
                    }

                    console.log($scope.PMList);
                }
                $scope.checked = item2._enable=='1'?true:false;
                $scope.startTime = item2._start_time;
                $scope.endTime = item2._end_time;
                $scope.item = item2;
                $scope.item.select = item2.weeks=='1'?'2':'1';
            }
            $scope.update =function (checked,select) {
                var equipment = {};
                var condition = {};
                if($scope.PM){
                    var conditions = [];
                    var j =0;
                    for(var i=0;i<$scope.PMList.length;i++){
                        if($scope.PMList[i]!=null){
                            condition = {};
                            condition['_name'] = getuuid();
                            condition['_property'] = PM25[i];
                            condition['_operator'] = $scope.PMList[i].pmSelect;
                            $scope.PMList[i].pmNum=$scope.PMList[i].pmNum==null?$scope.PMList[i]._value:$scope.PMList[i].pmNum;
                            condition['_value'] =$scope.PMList[i].pmNum;
                            conditions[j++] = condition;
                        }
                    }
                    equipment['condition'] = conditions;
                    console.log(equipment['condition']);

                }else if($scope.doorLock&&$scope.inputText){
                    condition['_name'] = getuuid();
                    condition['_property'] = '1039';
                    condition['_operator'] = '=';
                    condition['_value'] = parseInt(document.getElementById('doorNum').value,16);
                    equipment['condition'] = condition;
                }else{
                    condition['_name'] = JSON.parse($stateParams.item2).condition._name;
                    condition['_property'] = CMD.HA_ATTRID_IAS_ZONE_STATUS;
                    condition['_operator'] = '=';
                    condition['_value'] = CMD.HA_ATTR_ALERT;
                    equipment['condition'] = condition;
                }
                console.log((document.getElementById("checked").checked));
                equipment['_fname'] = $scope.item._fname;
                equipment['_enable'] = $scope.checked?'1':'0';
                equipment['_weeks'] = $scope.values;
                equipment['_date'] = '';
                equipment['_end_date'] = '';
                equipment['_start_time'] = document.getElementById('startTime').innerHTML;
                equipment['_end_time'] = document.getElementById('endTime').innerHTML;

                var xml_data = x2js.json2xml_str({equipment:equipment});
                var data = {name:$scope.item._scenename,eq_id:$scope.item._fname,xml_data:xml_data};
                var promise = sceneService.updateInputDevice(data);
                promise.success(function (response) {
                    var jsonObj = x2js.xml_str2json(response);
                    console.log(jsonObj);
                    if(jsonObj.success._code=='1') {
                        sceneService.showAlert("修改成功！");
                        $scope.$ionicGoBack();
                    }else{
                        sceneService.showAlert(jsonObj.success._message);
                    }
                })
            }
            //check&fname&weeks&date&start_time&end_time&name&property&operator&value

        }])

    .controller('sceneInputCtrl', ['$scope', '$stateParams','sceneService','$state','$ionicModal','$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,sceneService,$state,$ionicModal,$http) {
            var name = $stateParams.name;
            $scope.name = name;
            var x2js = new X2JS();
            $scope.doorLock = $stateParams.type=='01040314'?true:false;
            $scope.PM = $stateParams.type=='01040318'?true:false;
            $scope.settingsList = [
                { text: "每天",value:'',checked: true },
                { text: "周一",value:'1', checked: false },
                { text: "周二",value:'2', checked: false },
                { text: "周三",value:'3', checked: false },
                { text: "周四",value:'4', checked: false },
                { text: "周五",value:'5', checked: false },
                { text: "周六",value:'6', checked: false },
                { text: "周日",value:'7', checked: false }
            ];

            $scope.PMList = new Array(4);
            if($scope.days==null){
                $scope.days = $scope.settingsList[0].text;
                $scope.values = $scope.settingsList[0].value;
            }
            $scope.getDevice = function () {
                var promise = sceneService.getDevice({name:name});
                promise.success(function (response) {
                    var jsonObj = x2js.xml_str2json(response);
                    console.log(jsonObj.equipments.equipment);
                    $scope.items = [];
                    if(jsonObj&&jsonObj.equipments.equipment){
                        var equipments = jsonObj.equipments.equipment;
                        for(var i=0;i<equipments.length;i++){
                            if(InputDeviceFilte[equipments[i]._haid]){
                                $scope.items.push(equipments[i]);
                            }
                        }
                    }
                })
            }
            $scope.goUrl = function (item,name) {
                $scope.item = item;
                $scope.name = name;
                console.log(item);
                var promise2 = sceneService.getInputDevice({name:name});
                promise2.success(function (response) {
                    $http.get(IPPort+"service/equipment/list?typename=-1").success(function (data) {
                        var x2js = new X2JS();
                        $scope.itemsInput = [];
                        var jsonObj2 = x2js.xml_str2json(data);
                        var jsonObj = x2js.xml_str2json(response);
                        if(jsonObj!=null&&jsonObj2!=null) {
                            var equipmentsSafey = typeof (jsonObj2.equipment) == 'undefined' ? jsonObj2.equipments.equipment : jsonObj2.equipment;
                            var equipments = typeof (jsonObj.input.equipment) == 'undefined' ? jsonObj.input : jsonObj.input.equipment;
                            equipments = equipments instanceof Array ? equipments : [equipments];
                            equipmentsSafey = equipmentsSafey instanceof Array ? equipmentsSafey : [equipmentsSafey];
                            for (var i = 0; i < equipments.length; i++) {
                                for (var j = 0; j < equipmentsSafey.length; j++) {
                                    console.log(equipmentsSafey[j]._name + " " + equipments[i]._fname);
                                    if (equipmentsSafey[j]._name == equipments[i]._fname) {
                                        equipments[i].label = equipmentsSafey[j]._label;
                                        equipments[i].haid = equipmentsSafey[j]._haid
                                        $scope.itemsInput.push(equipments[i]);
                                        break;
                                    }
                                }
                            }
                        }
                        console.log($scope.itemsInput.length);
                        if($scope.itemsInput==null||$scope.itemsInput.length==0){
                        }else{
                        //    sceneService.showAlert("已存在联动条件");
                       //     return;
                        }
                        $state.go('menu.sceneInputDevice',{name:name,label:item._label,id:item._name,subtype:item._subtype,type:item._haid});
                    });
                });


            }
            $scope.getInputDetail = function (name) {
                $scope.startTime = '00:00';
                $scope.endTime =  '23:59';
                $scope.checked = false;
            }


            $ionicModal.fromTemplateUrl('templates/modal.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
            });

            $ionicModal.fromTemplateUrl('templates/modal2.html', {
                scope: $scope
            }).then(function(modal2) {
                $scope.modal2 = modal2;
                $scope.modal2.openModal = function (index) {
                    $scope.modal2.show();
                    $scope.index = index;
                    console.log($scope.PMList[index]);
                    if(typeof ($scope.PMList[index])!='undefined'){
                        $scope.pmChecked = $scope.PMList[index].pmChecked;
                        $scope.pmSelect = $scope.PMList[index].pmSelect;
                        document.getElementById("pmNum").value = $scope.PMList[index].pmNum;
                    }else{
                        $scope.pmChecked = false;
                        $scope.pmSelect = '';
                        $scope.pmNum = '';
                    }


                }
                $scope.modal2.confirm = function (pmChecked,pmSelect,pmNum) {
                    var PMStr = {};
                    PMStr['pmChecked'] = pmChecked;
                    PMStr['pmSelect'] = pmSelect;
                    PMStr['pmNum'] = document.getElementById("pmNum").value;
                    PMStr['name'] = '1';
                    $scope.PMList[$scope.index] = PMStr;
                    $scope.pmChecked = false;
                    $scope.pmSelect = '';
                    $scope.pmNum = '';
                    $scope.modal2.hide();
                }
            });

            //弹出点击
            $scope.serverSideChange = function(item) {
                if(item.value!=null&&item.value!=''){
                    $scope.settingsList[0].checked = false;
                }else{
                    for(var i=1;i<$scope.settingsList.length;i++){
                        $scope.settingsList[i].checked = false;
                    }
                }
                $scope.days=null;
                $scope.values = null;
                for(var i=0;i<$scope.settingsList.length;i++){
                    if($scope.settingsList[i].checked){
                        if($scope.days==null){
                            $scope.days = $scope.settingsList[i].text;
                            $scope.values = $scope.settingsList[i].value;
                        }else {
                            $scope.days = $scope.days + "," + $scope.settingsList[i].text;
                            $scope.values = $scope.values+ ","+$scope.settingsList[i].value;
                        }
                    }

                }
            };

            $scope.saveInputDevice = function (checked,select) {
                var subtype = $stateParams.subtype;
                subtype = subtype.substring(1,subtype.length);
                var equipment = {};
                var condition = {};
           //     condition['_name'] = $stateParams.name;
                if($scope.PM){
                    var conditions = [];
                    var j =0;
                    for(var i=0;i<$scope.PMList.length;i++){
                        if($scope.PMList[i]!=null&&$scope.PMList[i].pmChecked){
                            condition = {};
                            condition['_name'] = getuuid();
                            condition['_property'] = PM25[i];
                            condition['_operator'] = $scope.PMList[i].pmSelect;
                            condition['_value'] =$scope.PMList[i].pmNum;
                            conditions[j++] = condition;
                        }
                    }
                    if(conditions.length==0){
                        sceneService.showAlert("没有保存的条件！");
                        return;
                    }
                    equipment['condition'] = conditions;
                    console.log(equipment['condition']);

                }else if($scope.doorLock&&$scope.inputText){
                        condition['_name'] = getuuid();
                        condition['_property'] = '1039';
                        condition['_operator'] = '=';
                        condition['_value'] = parseInt(document.getElementById('doorNum').value,16);
                        equipment['condition'] = condition;
                }else{
                    condition['_name'] = getuuid();
                    condition['_property'] = CMD.HA_ATTRID_IAS_ZONE_STATUS;
                    condition['_operator'] = '=';
                    condition['_value'] = CMD.HA_ATTR_ALERT;
                    equipment['condition'] = condition;
                }
               /* condition['_name'] = getuuid();
                condition['_property'] = CMD.HA_ATTRID_IAS_ZONE_STATUS;
                condition['_operator'] = '=';
                condition['_value'] = CMD.HA_ATTR_ALERT;
                equipment['condition'] = condition;*/
                equipment['_fname'] =$stateParams.id;
                equipment['_enable'] = checked?'1':'0';
                equipment['_weeks'] = $scope.values;
                equipment['_date'] = '';
                equipment['_end_date'] = '';
                equipment['_start_time'] = document.getElementById('startTime').innerHTML;
                equipment['_end_time'] = document.getElementById('endTime').innerHTML;
                var xml_data = x2js.json2xml_str({equipment:equipment});
                console.log(xml_data);
                var data = {name:$stateParams.name,eq_id:$stateParams.id,xml_data:xml_data};

                var promise = sceneService.saveInputDevice(data);
                promise.success(function (response) {
                    var jsonObj = x2js.xml_str2json(response);
                    console.log(jsonObj);
                    if(jsonObj.success._code=='1') {
                        sceneService.showAlert("保存成功！");
                    }else{
                        sceneService.showAlert(jsonObj.success._message);
                    }
                    $scope.$ionicGoBack();
                })


               /* console.log($stateParams.name);
                console.log($stateParams.label);
                console.log($stateParams.id);
                console.log($stateParams.subtype);*/
            }


        }])
    .controller('addDeviceCtrl', ['$scope', '$stateParams','$http','$ionicModal','$ionicPopup','$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,$http,$ionicModal,$ionicPopup,$rootScope) {
//				 var tittle = $stateParams.tittle;
//					 var str_newdevicec = $stateParams.newdevice;
//				 $scope.tittle = tittle;
//					 $scope.newdevice = JSON.parse(str_newdevicec);
            $scope.picItems = devicePics;
            var tittle = $stateParams.tittle;
            var newdevice =$stateParams.newdevice;

            $scope.tittle = tittle;
            $scope.newdevice =JSON.parse(newdevice);
            $scope.newdevice._label = $scope.newdevice._equipmentid.substr(0,4)+'-'+$scope.newdevice._label;
            console.log(newdevice);
            $scope.picItems = devicePics;
            $scope.pic = $scope.newdevice._icon;
            var code_type = $stateParams.code_type;
            var sub_type= $stateParams.sub_type;
            $scope.typenames = typename;
            //获取空间列表
            $http.post(IPPort+"service/spatial/list").success(function (data) {
                var x2js = new X2JS();
                var jsonObj = x2js.xml_str2json(data);
                $scope.spatialsNameList =jsonObj.spatials.spatial;
                if( $scope.spatialsNameList  != null && $scope.spatialsNameList.length >0){
                    $scope.space= $scope.spatialsNameList[0];
                }

            });
            //空间弹出层
            $ionicModal.fromTemplateUrl('templates/modal.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
            });
            //弹出点击
            $scope.serverSideChange = function(item) {
                $scope.space =item;
                $scope.modal.hide();
                //点击空间时更换空间
                $http.post(IPPort+"service/spatial/update",{
                    name:item._name,
                    label:item._label,
                    icon:item._icon,
                }).success(function (data) {
                });
            };
            //添加（保存）智能设备
            $scope.equipmentSave = function(newdevice){
                var select = document.getElementById("typenameSelect");
                var typenameSelect = select[select.selectedIndex].value;
                console.log(newdevice);
                /*var equipment = {};
                equipment['_equipmentid'] = newdevice._equipmentid;
                equipment['_haid'] = newdevice._haid;
                equipment['_controlequipmentname'] = newdevice._controlequipmentname;
                equipment['_typename'] = newdevice._typename;
                equipment['_spatialname'] = $scope.space._name;
                equipment['_customicon'] = newdevice._icon;
                var x2js = new X2JS();
                var xml_data = x2js.json2xml_str({equipment:equipment});
                var data = {name:newdevice._equipmentid,label:newdevice._label,xml_data:xml_data};*/
                $http.get(IPPort+"service/equipment/save?"+
                    "&typename="+typenameSelect+
                    "&equipmentid="+newdevice._equipmentid+
                    "&haid="+newdevice._haid+
                    "&controlequipmentname="+newdevice._controlequipmentname+
                    "&spatialname="+$scope.space._name+
                    "&customicon="+$scope.pic+
                        "&label="+newdevice._label +
                        "&codetype=" + code_type +
                        "&subtype=" + sub_type +
                        "&nwkid=" + newdevice._nwkid
                ).success(function (data) {
                    var x2js = new X2JS();
                    var jsonObj = x2js.xml_str2json(data);
                    if(jsonObj.equipment >0 ){
                     //   $rootScope.newDevicesList = newdevice._equipmentid;
                        for(var i=0;i<$rootScope.newDevicesList.length;i++){
                            if($rootScope.newDevicesList[i]._equipmentid==newdevice._equipmentid){
                                $rootScope.newDevicesList.splice(i,1);
                            }
                        }
                        $ionicPopup.alert({
                            title: "提示",
                            template: "保存成功"
                        });
                       // alert("保存成功");
                    }else{
                        $ionicPopup.alert({
                            title: "提示",
                            template: "保存失败"
                        });
                       // alert("保存失败");
                    }
                    $scope.$ionicGoBack();

                });
            }

            //图标弹出层
            $ionicModal.fromTemplateUrl('templates/modalIcon.html', {
                scope: $scope
            }).then(function(modalIcon) {
                $scope.modalIcon = modalIcon;
            });
            $scope.chosePic = function (pic,index) {
                $scope.pic = pic.item;
               /* for(var i =0;i<devicePic.length;i++){
                    document.getElementById('pic'+i).style.backgroundColor = '#FFFFFF';
                }
                document.getElementById('pic'+index).style.backgroundColor = 'beige';*/
                $scope.modalIcon.hide();
            }
        }])
    .controller('timeCtrl', ['$scope', '$stateParams', '$ionicPopup','$state','timeService','$ionicModal','$http',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,$ionicPopup,$state,timeService,$ionicModal,$http) {
            var x2js = new X2JS();
            $scope.indexs = [];
            $scope.settingsList = [
                { text: "周一",value:'1', checked: true },
                { text: "周二",value:'2', checked: true },
                { text: "周三",value:'3', checked: true },
                { text: "周四",value:'4', checked: true },
                { text: "周五",value:'5', checked: true },
                { text: "周六",value:'6', checked: true },
                { text: "周日",value:'7', checked: true }
            ];

            $scope.addTime = function () {
                var confirmPopup = $ionicPopup.show({
                    title: '定时器类型',
                    template: '选择你要添加的类型',
                    scope : $scope,
                    buttons : [
                        {
                            text : "取消",
                            type: "button-energized"
                        },
                        {
                            text : "电器",
                            type: "button-positive",
                            onTap : function (e) {
                                $state.go('menu.timeDevice');
                            }
                        },
                        {
                            text: "安防",
                            type: "button-balanced",
                            onTap : function (e) {
                                $state.go('menu.timeSafty');
                            }
                        },
                        {
                            text: "情景",
                            type: "button-assertive",
                            onTap: function (e) {
                                $state.go('menu.timeScene');
                            }
                        }
                    ]
                });
            }

            $scope.initDevice = function () {
                var promise = timeService.getTimeDevice(null);
                promise.success(function (result) {
                    var jsonObj = x2js.xml_str2json(result);
                    $scope.items = [];
                    var its =  jsonObj.equipments.equipment instanceof Array?jsonObj.equipments.equipment:[jsonObj.equipments.equipment];
                    for(var i=0;i<its.length;i++){
                        if(DeviceFilter[its[i]._haid]=='1'){
                            $scope.items.push(its[i]);
                        }
                    }
                })
            }

            $scope.initScene = function () {
                var promise = timeService.getTimeScene(null);
                promise.success(function (result) {
                    var jsonObj = x2js.xml_str2json(result);
                    $scope.items =  jsonObj.scenes.scene.length>1?jsonObj.scenes.scene:jsonObj.scenes;
                })
            }

            $scope.initSafty = function () {
                var promise = timeService.getTimeSafty(null);
                promise.success(function (result) {
                    var jsonObj = x2js.xml_str2json(result);
                    console.log(jsonObj);
             //       $scope.items = jsonObj.securitys.security;
                    $scope.items =  jsonObj.securitys.security.length>1?jsonObj.securitys.security:jsonObj.securitys;
                })
            }

            $scope.goDetail = function (type) {
                $state.go('menu.timeDetail',{type:type});
            }


            $scope.initTimeDetail = function () {
                var type = $stateParams.type;
                var promise = timeService.getTimeByType({type:type});
                promise.success(function (result) {
                    var jsonObj = x2js.xml_str2json(result);
                    $scope.items =  jsonObj.clockequipments.clockequipment.length>1?jsonObj.clockequipments.clockequipment:jsonObj.clockequipments;
                    console.log($scope.items);
                })
            }


            $scope.goRemoveTime = function (item,index) {
                var confirmPopup = $ionicPopup.show({
                    title: '删除',
                    template: '是否要删除？',
                    scope : $scope,
                    buttons : [
                        {
                            text : "取消",
                            type: "button-positive",
                        },
                        {
                            text : "确定",
                            type : "button-balanced",
                            onTap : function (e) {
                                console.log(item);
                                timeService.removeTime({name:item._name}).success(function (result) {
                                    var json = x2js.xml_str2json(result);
                                    if(json.success._code=='1'){
                                        timeService.showAlert("删除成功！");
                                        $scope.$ionicGoBack();

                                    }else{
                                        timeService.showAlert("删除失败！");
                                    }
                                });
                            }
                        }
                    ]
                });
            }
            
            $scope.goUpdateTime = function (item) {
                $scope.checked = item._enable;
                if(item._type=='0'){
                    $state.go("menu.timeAddDevice",{item:JSON.stringify(item),type:'1'})
                }else if(item._type=='2'){
                    $state.go("menu.timeAddScene",{item:JSON.stringify(item),type:'1'})
                }else{
                    $state.go("menu.timeAddSafty",{item:JSON.stringify(item),type:'1'})
                }


            }

            //空间弹出层
            $ionicModal.fromTemplateUrl('templates/modal.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
            });

            //窗帘弹出层
            $ionicModal.fromTemplateUrl('templates/modal1.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal1 = modal;
            });

            //电视机弹出层
            $ionicModal.fromTemplateUrl('templates/modal2.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal2 = modal;
            });

            //空调弹出层
            $ionicModal.fromTemplateUrl('templates/modal3.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal3 = modal;
            });

            //卷帘弹出层
            $ionicModal.fromTemplateUrl('templates/modal4.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal4 = modal;
            });



            $scope.gotimeAddDevice = function (item) {
                $state.go("menu.timeAddDevice",{item:JSON.stringify(item)})
            }
            
            $scope.showModel = function (index) {
                $scope.index = index;
                if($stateParams.type!='1') {
                    $scope.indexs[$scope.index] = {};
                }
                console.log($scope.indexs);
                switch ($scope.deviceType){
                    case '1':   //窗帘
                        $scope.modal1.show();
                        break;
                    case '2':
                        $scope.modal2.show(); //电视机
                        $scope.TVList = [
                                { text: "开机", value: "01" },
                                { text: "关机", value: "02" },
                                { text: "--/-", value: "03" },
                                { text: "静音", value: "04" },
                                { text: "待机", value: "05" },
                                { text: "音量+", value: "06" },
                                { text: "音量-", value: "07" },
                                { text: "频道+", value: "08" },
                                { text: "频道-", value: "09" },
                                { text: "回看", value: "0A" },
                                { text: "上", value: "0B" },
                                { text: "下", value: "0C" },
                                { text: "左", value: "0D" },
                                { text: "右", value: "0E" },
                                { text: "确定", value: "0F" },
                                { text: "0", value: "10" },
                                { text: "1", value: "11" },
                                { text: "2", value: "12" },
                                { text: "3", value: "13" },
                                { text: "4", value: "14" },
                                { text: "5", value: "15" },
                                { text: "6", value: "16" },
                                { text: "7", value: "17" },
                                { text: "8", value: "18" },
                                { text: "9", value: "19" }];

                        break;
                    case '3':  //空调
                        $scope.modal3.show();
                        var buttons = document.getElementsByName("button");
                        for(var i=0;i<buttons.length;i++){
                            buttons[i].onclick = function () {
                                $scope.indexs[$scope.index].buttonNum = this.innerHTML;
                                $scope.indexs[$scope.index].num = this.innerHTML;
                            }
                        }
                        if($stateParams.type!='1'){
                            $scope.indexs[index].num = '18';
                            $scope.indexs[index].temper = '0';
                            $scope.indexs[index].power = '0';
                        }else {
                            $scope.indexs[index].power = $scope.power = $scope.indexs[$scope.index].power==null?'0':$scope.indexs[$scope.index].power;
                            $scope.indexs[index].temper = $scope.temper = $scope.indexs[$scope.index].temper==null?'0':$scope.indexs[$scope.index].power;
                        }
                        console.log($scope);
                        break;
                    case '4':  //卷帘
                        $scope.modal4.show();
                        $scope.select = $scope['select' + $scope.index];
                        console.log($scope.select);
                        break;
                }
            }


            $scope.TVSelect = function (item) {
                $scope.indexs[$scope.index] = {};
                $scope.indexs[$scope.index].TVNum= item.value;
            }
            $scope.airSelect = function (item,str) {
                if(str=='temper'){
                    $scope.indexs[$scope.index].temper = item.temper;
                    $scope.indexs[$scope.index].power = item.power;
                }else{
                    $scope.indexs[$scope.index].power = item.power;
                    $scope.indexs[$scope.index].temper = item.temper;
                }
                console.log("$scope.power"+$scope.power);
            }
            $scope.gotimeAddScene = function (item) {
                $state.go("menu.timeAddScene",{item:JSON.stringify(item)})
            }

            $scope.gotimeAddSafty = function (item) {
                $state.go("menu.timeAddSafty",{item:JSON.stringify(item)})
            }

            $scope.timeAddDeviceInit = function () {
                $scope.device = JSON.parse($stateParams.item);
                $http.get(IPPort+"service/equipment/list?typename=-1").success(function (data) {
                    var x2js = new X2JS();
                    var jsonObj = x2js.xml_str2json(data);
                    $scope.q =jsonObj.equipments.equipment;
                    for(var j = 0;j<$scope.q.length;j++){
                        if($scope.q[j]._name==$scope.device._fname){
                            $scope.device._haid = $scope.q[j]._haid;
                            $scope.device._subtype = $scope.q[j]._subtype;
                        }
                    }
                    $scope.statuschecked = new Array();
                    if($scope.device.timeaction instanceof Array &&$scope.device.timeaction.length>0) {
                        for (var i = 0; i < $scope.device.timeaction.length; i++) {
                            $scope.indexs[i] = {};
                            switch ($scope.device._haid) {
                                case '01040201':   //窗帘
                                    $scope.deviceType = '1';
                                    if ($scope.device.timeaction[i]) {
                                        $scope.check = $scope.device.timeaction[i].cmd[CMD.OPENORSTOP] == CMD.HA_ATTR_ON ? true : false;
                                        $scope.range = $scope.device.timeaction[i].cmd[CMD.HA_ATTRID_LEVEL2];
                                        $scope.indexs[i].check = $scope.check;
                                        $scope.indexs[i].range = $scope.range;
                                    }

                                    break;
                                case '01040310':
                                    if ($scope.device._subtype == 'X72C1') {
                                        $scope.deviceType = '2'; //电视机
                                        if ($scope.device.timeaction[i]) {
                                            $scope.TVNum = $scope.device.timeaction[i].cmd[CMD.HA_ATTRID_LEVEL];
                                            $scope.device._extfield = $scope.device.timeaction[i].cmd[CMD.HA_DEVICEID_ON_OFF_OUTPUT];
                                        }
                                        $scope.select = $scope.TVNum;
                                        $scope.indexs[i].TVNum = $scope.select;
                                    } else {
                                        console.log($scope.device);
                                        $scope.deviceType = '3'; //空调
                                        console.log($scope.power);
                                        if ($scope.device.timeaction[i]) {
                                            $scope.power = $scope.device.timeaction[i].cmd[CMD.HA_ATTRID_LEVEL] != '02' ? '1' : '0';
                                            var temp = $scope.device.timeaction[i].cmd[CMD.HA_ATTRID_LEVEL];
                                            $scope.device._extfield = $scope.device.timeaction[i].cmd[CMD.HA_DEVICEID_ON_OFF_OUTPUT];
                                            for (var t in airConditonTemp) {
                                                if (airConditonTemp[t] == temp) {
                                                    $scope.temper = t.substr(0, 1);
                                                    $scope.num = t.substr(1, 2);
                                                    break;
                                                }
                                            }
                                        }
                                        $scope.power = $scope.power != null ? $scope.power : '0';
                                        $scope.temper = $scope.temper != null ? $scope.temper : '0';
                                        $scope.indexs[i].num = $scope.num;
                                        $scope.indexs[i].power = $scope.power;
                                        $scope.indexs[i].temper = $scope.temper;
                                        console.log($scope);
                                    }
                                    break;
                                case '01040502':  //卷帘
                                    $scope.deviceType = '4';
                                    if ($scope.device.timeaction[i]) {
                                        $scope['select' + i] = $scope.device.timeaction[i].cmd[CMD.OPENORSTOP];
                                        $scope.indexs[i].rollSelected = $scope.device.timeaction[i].cmd[CMD.OPENORSTOP];
                                    }
                                    break;
                                case '01040603':
                                    if ($scope.device.timeaction[i]) {
                                        $scope['statuschecked' + i] = $scope.device.timeaction[i].cmd[CMD.OPENORSTOP] == CMD.OPEN ? true : false;
                                        if ($scope['statuschecked' + i]) {
                                            document.getElementById('checked' + i).checked = true;
                                        }
                                    }
                                    $scope.deviceType = '0';
                                    break;
                                default:
                                    if ($scope.device.timeaction[i]) {
                                        $scope.statuschecked[i] = $scope.device.timeaction[i].cmd[CMD.OPENORSTOP] == CMD.OPEN ? true : false;
                                        $scope.device._extfield = $scope.device.timeaction[i].cmd[CMD.HA_DEVICEID_ON_OFF_OUTPUT];
                                    }

                                    $scope.deviceType = '0';
                                    break;
                            }

                            console.log($scope);
                        }
                    }else{
                        switch ($scope.device._haid) {
                            case '01040201':   //窗帘
                                $scope.deviceType = '1';
                                if ($scope.device.timeaction) {
                                    $scope.check = $scope.device.timeaction.cmd[CMD.OPENORSTOP] == CMD.HA_ATTR_ON ? true : false;
                                    $scope.range = $scope.device.timeaction.cmd[CMD.HA_ATTRID_LEVEL2];
                                }

                                break;
                            case '01040310':
                                if ($scope.device._subtype == 'X72C1') {
                                    $scope.deviceType = '2'; //电视机
                                    if ($scope.device.timeaction) {
                                        $scope.TVNum = $scope.device.timeaction.cmd[CMD.HA_ATTRID_LEVEL];
                                        $scope.device._extfield = $scope.device.timeaction.cmd[CMD.HA_DEVICEID_ON_OFF_OUTPUT];
                                    }
                                    $scope.select = $scope.TVNum;
                                } else {
                                    console.log($scope.device);
                                    $scope.deviceType = '3'; //空调
                                    console.log($scope.power);
                                    if ($scope.device.timeaction) {
                                        $scope.power = $scope.device.timeaction.cmd[CMD.HA_ATTRID_LEVEL] != '02' ? '1' : '0';
                                        var temp = $scope.device.timeaction.cmd[CMD.HA_ATTRID_LEVEL];
                                        $scope.device._extfield = $scope.device.timeaction.cmd[CMD.HA_DEVICEID_ON_OFF_OUTPUT];
                                        for (var t in airConditonTemp) {
                                            if (airConditonTemp[t] == temp) {
                                                $scope.temper = t.substr(0, 1);
                                                $scope.num = t.substr(1, 2);
                                                break;
                                            }
                                        }
                                    }
                                    $scope.power = $scope.power != null ? $scope.power : '0';
                                    $scope.temper = $scope.temper != null ? $scope.temper : '0';
                                    $scope.indexs[0] = {};
                                    $scope.indexs[0].power = $scope.power;
                                    $scope.indexs[0].temper = $scope.temper;
                                    $scope.indexs[0].num = $scope.num;
                                    console.log($scope);
                                }
                                break;
                            case '01040502':  //卷帘
                                $scope.deviceType = '4';
                                if ($scope.device.timeaction) {
                                    $scope['select' + 0] = $scope.device.timeaction.cmd[CMD.OPENORSTOP];
                                    $scope.indexs[0] = {};
                                    $scope.indexs[0].rollSelected = $scope.device.timeaction.cmd[CMD.OPENORSTOP];
                                }
                                break;
                            case '01040603':
                                if ($scope.device.timeaction) {
                                    $scope.statuschecked[i] = $scope.device.timeaction.cmd[CMD.OPENORSTOP] == CMD.OPEN ? true : false;
                                }
                                $scope.deviceType = '0';
                                break;
                            default:
                                if ($scope.device.timeaction) {
                                    $scope.statuschecked[i] = $scope.device.timeaction.cmd[CMD.OPENORSTOP] == CMD.OPEN ? true : false;
                                    $scope.device._extfield = $scope.device.timeaction.cmd[CMD.HA_DEVICEID_ON_OFF_OUTPUT];
                                }
                                $scope.deviceType = '0';
                                break;
                        }

                        console.log($scope);
                    }
                    if($stateParams.type!='1') {
                        $scope.repeatDays = '每天';
                        $scope.Time = '00:00';
                        $scope.times = [$scope.Time];
                    }else{
                        var days = '';
                        if($scope.device.timeaction._date!=null&&$scope.device.timeaction._date!='') {
                            $scope.Time = $scope.device.timeaction._date + " " + $scope.device.timeaction._time;
                        }else{
                            $scope.times = [];
                            if(typeof ($scope.device.timeaction.length)!='undefined') {
                                for (var i = 0; i < $scope.device.timeaction.length; i++) {
                                    $scope.times.push($scope.device.timeaction[i]._time);
                                }
                            }else{
                                $scope.times.push($scope.device.timeaction._time);
                            }
                            console.log($scope.times);
                        }
                        for(var i=0;i<$scope.settingsList.length;i++){
                            if($scope.device._weeks.indexOf($scope.settingsList[i].value)!=-1){
                                $scope.settingsList[i].checked = true;
                                if(days==''){
                                    days = $scope.settingsList[i].text;
                                }else{
                                    days = days + ','+$scope.settingsList[i].text;
                                }
                            }else{
                                $scope.settingsList[i].checked = false;
                            }
                        }

                        if(days.length>=20){
                            $scope.repeatDays = '每天';
                        }else{
                            $scope.repeatDays = days.length<11?days:days.substr(0,11);
                        }
                        $scope.checked = $scope.device._enable=='true'?true:false;
                    }
                });
            }

            $scope.changeTime = function(){
                var days ='';
                for(var i=0;i<$scope.settingsList.length;i++){
                    if($scope.settingsList[i].checked){
                        if(days==''){
                            days = $scope.settingsList[i].text;
                        }else{
                            days = days + ','+$scope.settingsList[i].text;
                        }
                    }
                }
                if(days.length>=20){
                    $scope.repeatDays = '每天';
                }else{
                    $scope.repeatDays = days.length<11?days:days.substr(0,11) +"…";
                }
            }

            $scope.timeAddSceneInit = function () {
                $scope.scene = JSON.parse($stateParams.item);

                if($stateParams.type!='1') {
                    $scope.repeatDays = '每天';
                    $scope.Time = '00:00';
                    $scope.times = [$scope.Time];
                }else{
                    var days = '';
                    if($scope.scene.timeaction._date!=null&&$scope.scene.timeaction._date!='') {
                        $scope.Time = $scope.scene.timeaction._date + " " + $scope.scene.timeaction._time;
                    }else{
                        $scope.times = [];
                        if($scope.scene.timeaction.length) {
                            for (var i = 0; i < $scope.scene.timeaction.length; i++) {
                                $scope.times.push($scope.scene.timeaction[i]._time);
                            }
                        }else{
                            $scope.times.push($scope.scene.timeaction._time);
                        }
                    }
                    for(var i=0;i<$scope.settingsList.length;i++){
                        if($scope.scene._weeks.indexOf($scope.settingsList[i].value)!=-1){
                            $scope.settingsList[i].checked = true;
                            if(days==''){
                                days = $scope.settingsList[i].text;
                            }else{
                                days = days + ','+$scope.settingsList[i].text;
                            }
                        }else{
                            $scope.settingsList[i].checked = false;
                        }
                    }
                    if(days.length>=20){
                        $scope.repeatDays = '每天';
                    }else{
                        $scope.repeatDays = days.length<11?days:days.substr(0,11) +"…";
                    }
                    console.log($scope.settingsList);
                    $scope.checked = $scope.scene._enable=='true'?true:false;
                }

            }
            $scope.addOneTime = function () {
                var timeStr='';
                var b = false;
                for(var i=0;i<$scope.times.length;i++){
                    if(timeStr.indexOf(document.getElementById('Time'+i).innerHTML)!=-1){
                         b = true;
                    }
                    timeStr = timeStr +','+ document.getElementById('Time'+i).innerHTML;
                    $scope.times[i] = document.getElementById('Time'+i).innerHTML;
                }
                if(b){
                    timeService.showAlert("时间冲突，请检查！");
                }else{
                    $scope.times[$scope.times.length]='00:00';
                }

            }
            $scope.addOneTime2 = function () {
                var timeStr='';
                var b = false;
                for(var i=0;i<$scope.times.length;i++){
                    if(timeStr.indexOf(document.getElementById('Time'+i).innerHTML)!=-1){
                        b = true;
                    }
                    timeStr = timeStr +','+ document.getElementById('Time'+i).innerHTML;
                    $scope.times[i] = document.getElementById('Time'+i).innerHTML;
                }
                if(b){
                    timeService.showAlert("时间冲突，请检查！");
                }else{
                    $scope.times[$scope.times.length] ='00:00';
                    $scope.indexs[$scope.indexs.length] = {};
                }

            }
            $scope.timeAddSaftyInit = function () {
                $scope.security = JSON.parse($stateParams.item);
                if($stateParams.type!='1') {
                    $scope.repeatDays = '每天';
                    $scope.Time = '00:00';
                    $scope.times = [$scope.Time];
                }else{
                    var days = '';
                    if($scope.security.timeaction._date!=null&&$scope.security.timeaction._date!='') {
                        $scope.Time = $scope.security.timeaction._date + " " + $scope.security.timeaction._time;
                    }else{
                        $scope.times = [];
                        if($scope.security.timeaction.length) {
                            for (var i = 0; i < $scope.security.timeaction.length; i++) {
                                $scope.times.push($scope.security.timeaction[i]._time);
                            }
                        }else{
                            $scope.times.push($scope.security.timeaction._time);
                        }
                    }
                    for(var i=0;i<$scope.settingsList.length;i++){
                        if($scope.security._weeks.indexOf($scope.settingsList[i].value)!=-1){
                            $scope.settingsList[i].checked = true;
                            if(days==''){
                                days = $scope.settingsList[i].text;
                            }else{
                                days = days + ','+$scope.settingsList[i].text;
                            }
                        }else{
                            $scope.settingsList[i].checked = false;
                        }
                    }
                    if(days.length>=20){
                        $scope.repeatDays = '每天';
                    }else{
                        $scope.repeatDays = days.length<11?days:days.substr(0,11) +"…";
                    }
                    console.log($scope.settingsList);
                    $scope.checked = $scope.security._enable=='true'?true:false;
                }

            }
            //卷帘选中事件
            $scope.rollSelect = function (item) {
                $scope.indexs[$scope.index].rollSelected = item.value;
            }

            //初始化卷帘
            $scope.initRolling = function () {
                $scope.serverSideList = [
                    {text: "上升", value: "X7101"},
                    {text: "下降", value: "X7100"},
                    {text: "停止", value: "X7103"}
                ];
                $scope.select = "X7101";
            }

            //窗帘选中事件
            $scope.windowSelect = function (range,check) {
                $scope.indexs[$scope.index].check = check?'X7101':'X7100';
                $scope.indexs[$scope.index].range = range;
                $scope.modal1.hide();
            }

            //初始化窗帘
            $scope.initWindow = function () {
                if($stateParams.type=='1'){
                    $scope.range = $scope.indexs[$scope.index];
                }else{
                    $scope.range = '1';
                }

            }
            
            $scope.getAirCondition1 = function () {
                console.log($scope.indexs);
                if($stateParams.type=='1'){

                }
            }

            $scope.saveTimeDevice = function () {
                var weeks = '';
                for(var i=0;i<$scope.settingsList.length;i++){
                    console.log($scope.settingsList[i]);
                    if($scope.settingsList[i].checked){
                        if(weeks==''){
                            weeks = $scope.settingsList[i].value;
                        }else{
                            weeks = weeks + ',' + $scope.settingsList[i].value;
                        }
                    }
                }
                var timeactions = [];
                var timeStr='';
                var b = false;
                for(var i=0;i<$scope.times.length;i++){
                    if(timeStr.indexOf(document.getElementById('Time'+i).innerHTML)!=-1){
                        b = true;
                    }
                    timeStr = timeStr +','+ document.getElementById('Time'+i).innerHTML;
                    $scope.times[i] = document.getElementById('Time'+i).innerHTML;
                }
                if(b){
                    timeService.showAlert("时间冲突，请检查！");
                    return ;
                }

                for(var k=0;k<$scope.times.length;k++) {
                    var date = document.getElementById('Time'+k).innerHTML;
                    var dates = date.split(' ');
                    var timeaction = {};
                    timeaction._name = k+1;
                    if (dates.length > 1) {
                        timeaction._date = dates[0];
                        timeaction._time = dates[1];
                    } else {
                        timeaction._time = dates[0];
                    }
                    var cmd = {};
                    cmd._eq = $scope.device._name;
                    switch ($scope.device._haid) {
                        case '01040201':   //窗帘
                            console.log($scope.indexs);
                            cmd._id = CMD.WINDOW_ON_OFF;
                            cmd[CMD.OPENORSTOP] = $scope.indexs[k].check;
                            if ($scope.indexs[k].check == 'X7100') {
                                cmd[CMD.HA_ATTRID_LEVEL2] = '0';
                            } else {
                                if ($scope.indexs[k].range == null || $scope.indexs[k].range == '0') {
                                    timeService.showAlert("开机情况下不能将窗帘等级设置为0");
                                    return;
                                } else {
                                    cmd[CMD.HA_ATTRID_LEVEL2] = $scope.indexs[k].range;
                                }
                            }
                            break;
                        case '01040310':
                            if ($scope.deviceType == '3') {
                                console.log(airConditonTemp[$scope.temper + $scope.num]);
                                cmd._id = CMD.DEV_INFRARED_CMD;
                                $scope.indexs[k].num = $scope.indexs[k].num==null?$scope.indexs[k].buttonNum:$scope.indexs[k].num;
                                $scope.indexs[k].num = $scope.indexs[k].num==null?'18':$scope.indexs[k].num;
                                if ($scope.indexs[k].power == '0') {
                                    cmd[CMD.HA_ATTRID_LEVEL] = '02';
                                } else {
                                    cmd[CMD.HA_ATTRID_LEVEL] = airConditonTemp[$scope.indexs[k].temper + $scope.indexs[k].num];
                                }
                                cmd[CMD.HA_DEVICEID_ON_OFF_OUTPUT] = $scope.device._extfield;//'2';  //有待商榷
                            } else {
                                cmd[CMD.HA_DEVICEID_ON_OFF_OUTPUT] = $scope.device._extfield;
                                cmd._id = CMD.HA_CMDID_DEV_INFRARED_CMD;
                                cmd[CMD.HA_ATTRID_LEVEL] = $scope.indexs[k].TVNum;
                            }

                            cmd[CMD.HA_ATTRID_INFRARED_CODE_TYPE] = 'X72A8';

                            cmd[CMD.HA_ATTRID_INFRARED_SUB_TYPE] = $scope.device._subtype;
                            break;
                        case '01040502':  //卷帘
                            cmd._id = CMD.DEV_ON_OFF;
                            cmd[CMD.OPENORSTOP] = $scope.indexs[k].rollSelected;
                            break;
                        case '01040603':
                            cmd._id = CMD.DEV_ON_OFF;
                            $scope.statuschecked = document.getElementsByName("statuschecked"+k)[1].checked;
                            cmd[CMD.OPENORSTOP] = $scope.statuschecked ? CMD.OPEN : CMD.STOP;
                            cmd[CMD.MUSIC] = '0';
                            break;
                        default:
                            cmd._id = CMD.DEV_ON_OFF;
                            $scope.statuschecked = document.getElementsByName("statuschecked"+k)[1].checked;
                            console.log('statuschecked' + $scope.statuschecked);
                            cmd[CMD.OPENORSTOP] = $scope.statuschecked ? CMD.OPEN : CMD.STOP;
                            if($scope.device._haid==dianbiao){
                                cmd[CMD.HA_DEVICEID_ON_OFF_OUTPUT] = $scope.device._extfield;
                            }
                            break;
                    }
                    timeaction.cmd = cmd;
                    timeactions.push(timeaction);
                }
                var data = {};
                data._fname = $scope.device._name;
                data._label = $scope.device._label;
                console.log(document.getElementsByName('checked'));
                $scope.checked = document.getElementsByName('checked')[1].checked?true:false;
                data._enable = $scope.checked;
                console.log($scope.checked);
                data._weeks = weeks;
                data._type = '0';
                data.timeaction = timeactions;

                console.log(x2js.json2xml_str({clockequipment :data}));
                if($stateParams.type!='1'){
                    var params = {'xml_data':x2js.json2xml_str({clockequipment :data})};
                    var promise = timeService.addTime(params);
                }else{
                    data._fname = $scope.device._fname;
                    var params = {'xml_data':x2js.json2xml_str({clockequipment :data}),name:$scope.device._name};
                    var promise = timeService.updateTime(params);
                }
                console.log(params);
                console.log($stateParams.type);
                promise.success(function (result) {
                    console.log(result);
                    var jsonObj = x2js.xml_str2json(result);
                    if(jsonObj.name!=''){
                        timeService.showAlert("保存成功！");
                    }else{
                        timeService.showAlert("保存失败！");
                    }
                    $scope.$ionicGoBack();
                })
            }
            $scope.deleteTime = function (index) {
                var confirmPopup = $ionicPopup.show({
                    title: '删除时间',
                    template: '确定删除吗？',
                    scope : $scope,
                    buttons : [
                        {
                            text : "取消",
                            type: "button-energized"
                        },
                        {
                            text : "确定",
                            type: "button-positive",
                            onTap : function (e) {
                                $scope.times.splice(index,1);
                            }
                        }
                    ]
                });
            }

            $scope.saveTimeScene = function () {
               // var date = document.getElementById('Time').innerHTML;
                var weeks = '';
                for(var i=0;i<$scope.settingsList.length;i++){
                    if($scope.settingsList[i].checked){
                        if(weeks==''){
                            weeks = $scope.settingsList[i].value;
                        }else{
                            weeks = weeks + ',' + $scope.settingsList[i].value;
                        }
                    }
                }
                var timeactions = [];

                var timeStr='';
                var b = false;
                for(var i=0;i<$scope.times.length;i++){
                    if(timeStr.indexOf(document.getElementById('Time'+i).innerHTML)!=-1){
                        b = true;
                    }
                    timeStr = timeStr +','+ document.getElementById('Time'+i).innerHTML;
                    $scope.times[i] = document.getElementById('Time'+i).innerHTML;
                }
                if(b){
                    timeService.showAlert("时间冲突，请检查！");
                    return ;
                }

                for(var i = 0;i<$scope.times.length;i++) {
                    var date = document.getElementById('Time' + i).innerHTML;
                    var dates = date.split(' ');
                    var timeaction = {};
                    timeaction._name = i+1;
                    if (dates.length > 1) {
                        timeaction._date = dates[0];
                        timeaction._time = dates[1];
                    } else {
                        timeaction._time = dates[0];
                    }
                    timeactions.push(timeaction);
                }
                var data = {};
                data._fname = $scope.scene._name;
                data._label = $scope.scene._label;

                console.log(document.getElementsByName('checked'));
                $scope.checked = document.getElementsByName('checked')[1].checked?true:false;
                data._enable = $scope.checked;
                console.log($scope.checked);
                data._weeks = weeks;
                data._type = '2';
                data.timeaction = timeactions;
                console.log(params);
                var promise;
                if($stateParams.type!='1'){
                    var params = {'xml_data':x2js.json2xml_str({clockequipment :data})};
                    promise = timeService.addTime(params);
                }else{
                    data._fname = $scope.scene._fname;
                    var params = {'xml_data':x2js.json2xml_str({clockequipment :data}),name:$scope.scene._name};
                    promise = timeService.updateTime(params);
                }


                promise.success(function (result) {
                    console.log(result);
                    var jsonObj = x2js.xml_str2json(result);
                    if(jsonObj.name!=''){
                        timeService.showAlert("保存成功！");
                    }else{
                        timeService.showAlert("保存失败！");
                    }
                    $scope.$ionicGoBack();
                })
                
            }

            $scope.saveTimeSafty = function () {
               // var date = document.getElementById('Time').innerHTML;
                var weeks = '';
                for(var i=0;i<$scope.settingsList.length;i++){
                    if($scope.settingsList[i].checked){
                        if(weeks==''){
                            weeks = $scope.settingsList[i].value;
                        }else{
                            weeks = weeks + ',' + $scope.settingsList[i].value;
                        }
                    }
                }
                var timeactions = [];
                var timeStr='';
                var b = false;
                for(var i=0;i<$scope.times.length;i++){
                    if(timeStr.indexOf(document.getElementById('Time'+i).innerHTML)!=-1){
                        b = true;
                    }
                    timeStr = timeStr +','+ document.getElementById('Time'+i).innerHTML;
                    $scope.times[i] = document.getElementById('Time'+i).innerHTML;
                }
                if(b){
                    timeService.showAlert("时间冲突，请检查！");
                    return ;
                }

                for(var i = 0;i<$scope.times.length;i++) {
                    var date = document.getElementById('Time'+i).innerHTML;
                    var dates = date.split(' ');
                    var timeaction = {};
                    timeaction._name = i+1;
                    if (dates.length > 1) {
                        timeaction._date = dates[0];
                        timeaction._time = dates[1];
                    } else {
                        timeaction._time = dates[0];
                    }
                    timeactions.push(timeaction);
                }
                var data = {};
                data._fname = $scope.security._name;
                data._label = $scope.security._label;

                console.log(document.getElementsByName('checked'));
                $scope.checked = document.getElementsByName('checked')[1].checked?true:false;
                data._enable = $scope.checked;
                console.log($scope.checked);
                data._weeks = weeks;
                data._type = '1';
                data.timeaction = timeactions;
                console.log(params);
                var promise;
                if($stateParams.type!='1'){
                    var params = {'xml_data':x2js.json2xml_str({clockequipment :data})};
                    promise = timeService.addTime(params);
                }else{
                    data._fname = $scope.security._fname;
                    var params = {'xml_data':x2js.json2xml_str({clockequipment :data}),name:$scope.security._name};
                    promise = timeService.updateTime(params);
                }


                promise.success(function (result) {
                    console.log(result);
                    var jsonObj = x2js.xml_str2json(result);
                    if(jsonObj.name!=''){
                        timeService.showAlert("保存成功！");
                    }else{
                        timeService.showAlert("保存失败！");
                    }
                    $scope.$ionicGoBack();
                })
            }

        }])
