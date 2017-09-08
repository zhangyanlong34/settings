angular.module('app.services', [])
.service('basicService', function($q,$http,$ionicPopup){
    return{
        basicRequest:function (url, params, httpmethod) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            // 登录
            $http({
                url: url,
                method: httpmethod,
                cache: false,
                params: params,
                timeout:30000
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.reject('Wrong credentials.');
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        showAlert:function (content) {
            $ionicPopup.alert({
                    title: "提示",
                    template: content
            });
        }
    }
})
.service('aboutService', function($q,$http,basicService){
    return {
        //获取系统配置
        getSysConfig: function (data) {
            var url = IPPort+ "service/system/config";
            var params = data;
            var httpmethod = "POST";
            return basicService.basicRequest(url, params, httpmethod);
        },
        getSysTime: function (data) {
            var url = IPPort + "service/system/date";
            var params = data;
            var httpmethod = "POST";
            return basicService.basicRequest(url, params, httpmethod);
        },
        saveSysConfig:function (data) {
            var url = IPPort+"service/system/save";
            var params = data;
            var httpmethod = "POST";
            return basicService.basicRequest(url, params, httpmethod);
        },
        saveSysDate:function (data) {
            var url = IPPort + "service/system/set_date";
            var params = data;
            var httpmethod = "POST";
            return basicService.basicRequest(url, params, httpmethod);
        },
        synchronous: function (data) {
            var url = IPPort + "service/system/synchronous";
            return basicService.basicRequest(url, data, "POST");
        },
        showAlert:function (content) {
            basicService.showAlert(content);
        }
    }

})
.service('timeService', function($q,$http,basicService){
    return {
        //获取系统配置
        getTimeDevice: function (data) {
            var url = IPPort+ "service/equipmentclock/equipment";
            var params = data;
            var httpmethod = "POST";
            return basicService.basicRequest(url, params, httpmethod);
        },
        getTimeScene: function (data) {
            var url = IPPort + "service/equipmentclock/scene";
            var params = data;
            var httpmethod = "POST";
            return basicService.basicRequest(url, params, httpmethod);
        },
        getTimeSafty:function (data) {
            var url = IPPort+"service/equipmentclock/security";
            var params = data;
            var httpmethod = "POST";
            return basicService.basicRequest(url, params, httpmethod);
        },
        getTimeByType:function (data) {
            var url = IPPort + "service/equipmentclock/list";
            var params = data;
            var httpmethod = "POST";
            return basicService.basicRequest(url, params, httpmethod);
        },
        openOrclose: function (data) {
            var url = IPPort + "service/equipmentclock/enable";
            return basicService.basicRequest(url, data, "POST");
        },
        removeTime: function (data) {
            var url = IPPort + "service/equipmentclock/remove";
            return basicService.basicRequest(url,data,"POST");
        },
        addTime: function (data) {
            var url = IPPort + "service/equipmentclock/add";
            return basicService.basicRequest(url,data,"POST");
        },
        updateTime : function (data) {
            var url = IPPort + "service/equipmentclock/edit";
            return basicService.basicRequest(url,data,"POST");
        },

        showAlert:function (content) {
            basicService.showAlert(content);
        }
    }

})
.service('deviceService',function ($q,$http,basicService) {
    this.shownewdevices = function (data) {
        var url = IPPort +　"service/commissioning/shownewdevices";
        return basicService.basicRequest(url,data,"POST");
    }
    this.findnetworknewdevices = function (data) {
        var url = IPPort + "service/commissioning/findnetworknewdevices";
        return basicService.basicRequest(url,data,"POST");
    }
    this.getSafeDevice = function (data) {
        var url = IPPort + "service/equipment/getIASTemp";
        return basicService.basicRequest(url,data,"POST");
    }
    this.matchCode = function (data) {
        var url = IPPort + "service/commissioning/matchcode";
        return basicService.basicRequest(url,data,"POST");
    }
    this.saveSafeDevice = function (data) {
        var url = IPPort + "service/equipment/save";
        return basicService.basicRequest(url,data,"POST");
    }
    this.showAlert = function (content) {
        basicService.showAlert(content);
    }
    this.getDeviceByType = function (data) {
        var url = IPPort + "service/equipment/list";
        return basicService.basicRequest(url,data,"POST");
    }
    this.getParams = function (data) {
        var url = IPPort + "service/system/getparams";
        return basicService.basicRequest(url,data,"POST");
    }
    this.equipmentGet2 = function (data) {
        var url = IPPort + "service/equipment/get2";
        return basicService.basicRequest(url,data,"POST");
    }

})
.service('spaceService',function ($q,$http,basicService) {
   this.get = function () {
       return "aaaa";
   }
   this.showAlert = function (content) {
        basicService.showAlert(content);
    }
   return this;
})
    .service('$accountService', function($q,$http,basicService){
        return {
            //用户账号管理
            getUserListName: function (data) {
                var url = IPPortWEB + "/NewAssistanceWeb/service/mobileAuthorize/getUserListName";
                var params = data;
                var httpmethod = "POST";
                return basicService.basicRequest(url, params, httpmethod);
            },
            deleteUserAndDevice: function (data) {
                var url = IPPortWEB +　"/NewAssistanceWeb/service/mobileAuthorize/deleteUserAndDevice";
                var params = data;
                var httpmethod = "POST";
                return basicService.basicRequest(url, params, httpmethod);
            },

        }

    })
    .service('messageService',function ($q,$http,basicService) {
        this.getDW_ID = function () {
            var url = IPPort + "service/system/config";
            return basicService.basicRequest(url,null,"POST");
        }
        this.restore = function (data) {
            var url = IPPort + "debug/exec";
            return basicService.basicRequest(url,data,"POST");
        }
        this.initMessage = function () {
            var url = IPPort + "service/system/get_config_properties";
            return basicService.basicRequest(url,null,"POST");
        }
        this.saveTime = function(data){
            var url = IPPort + "service/system/set_config_properties";
            return basicService.basicRequest(url,data,"POST");
        }
        this.saveOrUpdateSecurityPhone = function (data) {
            var url = IPPortWEB + "/NewAssistanceWeb/service/mobileAuthorize/saveOrUpdateSecurityPhone";
            return basicService.basicRequest(url,data,"POST");
        }
        this.deleteSecurityPhone =function (data) {
            var url = IPPortWEB + "/NewAssistanceWeb/service/mobileAuthorize/deleteSecurityPhone";
            return basicService.basicRequest(url,data,"POST");
        }
        this.getSecurityPhone = function (data) {
            var url = IPPortWEB + "/NewAssistanceWeb/service/mobileAuthorize/getSecurityPhone";
            return basicService.basicRequest(url,data,"POST");
        }
        this.showAlert = function (content) {
            basicService.showAlert(content);
        }
    })
.service('sceneService',function ($q,$http,basicService) {
    this.getScenes = function () {
        var url = IPPort + "service/scene/ls";
        return basicService.basicRequest(url,null,"POST");
    }
    this.getSceneDetail = function (data) {
        var url = IPPort + "service/scene/equipment_ls";
        return basicService.basicRequest(url,{name:data},"POST");
    }
    this.saveScene = function (sceneName,icon) {
        var url = IPPort + "service/scene/add";
        return basicService.basicRequest(url,{label:sceneName,icon:icon},"POST");
    }
    this.deleteScene = function (name) {
        var url = IPPort + "service/scene/remove";
        return basicService.basicRequest(url,{name:name},"POST");
    }
    this.updateScene = function (data) {
        var url = IPPort + "service/scene/update";
        return basicService.basicRequest(url,data,"POST");
    }
    this.getOption = function(data){
        var url = IPPort + "service/scene/option_equipment_ls";
        return basicService.basicRequest(url,data,"POST");
    }
    this.saveSceneDevice = function (data) {
        var url = IPPort + "service/scene/equipment_add";
        return basicService.basicRequest(url,data,"POST");
    }
    this.deleteSceneDevice = function (data) {
        var url = IPPort + "service/scene/remove_equipment";
        return basicService.basicRequest(url,data,"POST");
    }
    this.getInputDevice = function (data){
        var url = IPPort + "service/scene/input_equipment_ls";
        return basicService.basicRequest(url,data,"POST");
    }
    this.getDevice = function (data) {
        var url = IPPort + "service/scene/input_option_equipment_ls";
        return basicService.basicRequest(url,data,"POST");
    }
    this.saveInputDevice = function (data) {
        var url = IPPort + "service/scene/input_equipment_add";
        return basicService.basicRequest(url,data,"POST");
    }
    this.updateDevice = function (data) {
        var url = IPPort + "service/scene/equipment_edit";
        return basicService.basicRequest(url,data,"POST");
    }
    this.updateInputDevice = function (data) {
        var url = IPPort + "service/scene/input_equipment_edit";
        return basicService.basicRequest(url,data,"POST");
    }
    this.deleteInputSceneDevice = function (data) {
        var url = IPPort + 'service/scene/input_equipment_remove';
        return basicService.basicRequest(url, data, "POST");
    }
    this.showAlert = function (content) {
        basicService.showAlert(content);
    }

    return this;
});
