angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('menu.page1', {
    url: '/page1',
    views: {
      'side-menu21': {
        templateUrl: 'templates/page1.html',
        controller: 'page1Ctrl'
      }
    }
  })
  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

      .state('menu.page5', {
        url: '/accountManager',
        views: {
          'side-menu21': {
            templateUrl: 'templates/accountManager.html',
            controller: 'accountCtrl'
          }
        }
      })

  .state('menu.page6', {
    url: '/spaceManager',
    views: {
      'side-menu21': {
        templateUrl: 'templates/spaceManager.html',
        controller: 'page6Ctrl'
      }
    }
  })

  .state('menu.page7', {
    url: '/message',
    views: {
      'side-menu21': {
        templateUrl: 'templates/MessageNotify.html',
        controller: 'MessageCtrl'
      }
    }
  })

      .state('menu.page8', {
        url: '/about',
        views: {
          'side-menu21': {
            templateUrl: 'templates/about.html',
            // controller: 'page8Ctrl'
            controller: 'aboutCtrl'
          }
        }
      })
  .state('menu.addSpace',{
    url: '/addSpace',
    views:{
      'side-menu21' :{
        templateUrl : 'templates/addSpace.html',
        controller : 'addSpaceCtrl'
      }
    }
  })
  .state('menu.addScene',{
    url: '/addScene',
    views:{
      'side-menu21' :{
        templateUrl : 'templates/addScene.html',
        controller : 'sceneController'
      }
    }
  })
  .state('menu.updateScene',{
    url: '/updateScene/:name/:label/:icon',
    views:{
      'side-menu21' :{
        templateUrl : 'templates/updateScene.html',
        controller : 'sceneController'
      }
    }
  })
      .state('menu.windowScreen',{
        url: '/windowScreen/:label/:name:/:sceneName/:OPENORSTOP/:HA_ATTRID_LEVEL',
        views:{
          'side-menu21' :{
            templateUrl : 'templates/windowScreen.html',
            controller : 'windowController'
          }
        }
      })
      .state('menu.rollingScreen',{
        url: '/rollingScreen/:label/:name:/:sceneName/:OPENORSTOP',
        views:{
          'side-menu21' :{
            templateUrl : 'templates/rollingScreen.html',
            controller : 'windowController'
          }
        }
      })
  .state('menu.sceneDeviceList',{
    url: '/sceneDeviceList/:name',
    views:{
      'side-menu21' :{
        templateUrl : 'templates/sceneDeviceList.html',
        controller : 'sceneDetailCtrl'
      }
    }
  })
      .state('menu.TV',{
        url: '/sceneDeviceTV/:item',
        views:{
          'side-menu21' :{
            templateUrl : 'templates/TV.html',
            controller : 'TVCtrl'
          }
        }
      })
      .state('menu.sceneDeviceSettings',{
        url: '/sceneDeviceSettings/:label/:name/:sceneName/:ext/:haid',
        views:{
          'side-menu21' :{
            templateUrl : 'templates/sceneDeviceSettings.html',
            controller : 'sceneDeviceCtrl'
          }
        }
      })



  .state('page10', {
    url: '/messagePhone',
    templateUrl: 'templates/page10.html',
    controller: 'page10Ctrl'
  })

  .state('page11', {
    url: '/goHomeModel',
    templateUrl: 'templates/sceneDetail.html',
    controller: 'sceneDetailCtrl'
  })

  .state('menu.page12', {
    url: '/home/:name/:label/:icon',
    views: {
      'side-menu21': {
        templateUrl: 'templates/updateSpace.html',
        controller: 'page12Ctrl'
      }
    }
  })
      .state('menu.revampedDevice',{
        cache: false,
        url:'/device/:tittle/:device/:space/:icon',
        views:{
          'side-menu21':{
            templateUrl :'templates/revampedDevice.html',
            controller : 'revampedDeviceCtrl'
          }
        }
      })
      .state('menu.page11',{
        url:'/modern/:name/:tittle',
        views:{
          'side-menu21':{
            templateUrl :'templates/sceneDetail.html',
            controller : 'sceneDetailCtrl'
          }
        }
      })
  .state('menu.page13', {
    url: '/scene',
    views: {
      'side-menu21': {
        templateUrl: 'templates/sceneManager.html',
        controller: 'sceneController'
      }
    }
  })


      .state('menu.device', {
        cache : false,
        url: '/device',
        views: {
          'side-menu21': {
            templateUrl: 'templates/device.html',
            controller: 'deviceCtrl'
          }
        }
      })
      .state('menu.page10', {
        url: '/addPhone',
        views: {
          'side-menu21': {templateUrl: 'templates/page10.html',
            controller: 'page10Ctrl'
          }
        }
      })

      .state('menu.addZigBee', {
        url: '/page18',
        views: {
          'side-menu21':{templateUrl: 'templates/addZigBee.html',
            controller: 'addZigBeeCtrl'
          }
        }
      })
      .state('menu.findDevice', {
        url: '/page18',
        views: {
          'side-menu21':{templateUrl: 'templates/findDevice.html',
            controller: 'findDeviceCtrl'
          }
        }
      })

      .state('menu.listInfrared', {
        url: '/listInfrared',
        views: {
          'side-menu21':{templateUrl: 'templates/listInfrared.html',
            controller: 'page16Ctrl'
          }
        }
      })
      .state('menu.list485', {
          url: '/list485',
          views: {
              'side-menu21':{templateUrl: 'templates/list485.html',
                  controller: '485Ctrl'
              }
          }
      })
      .state('menu.add485Device', {
          url: '/add485Device/:item',
          views: {
              'side-menu21':{templateUrl: 'templates/add485Device.html',
                  controller: 'Add485Ctrl'
              }
          }
      })
      .state('menu.listCenterAir', {
          url: '/listCenterAir',
          views: {
              'side-menu21':{templateUrl: 'templates/CenterAirList.html',
                  controller: 'CenterAirCtrl'
              }
          }
      })
      .state('menu.page19', {
        url: '/page19/:tittle/:name/:allowedremote/:controlequipmentname/:customicon/:equipmentid/:haid/:securityname/:spatialname/:subtype/:typename',
        views: {
          'side-menu21':{templateUrl: 'templates/page19.html',
            controller: 'page19Ctrl'
          }
        }
      })
      .state('menu.page20', {
        url: '/page20',
        views: {
          'side-menu21':{templateUrl: 'templates/page20.html',
            controller: 'page20Ctrl'
          }
        }
      })

  .state('menu.page15', {
    url: '/page15/:gwid',
    views: {
      'side-menu21': {
        templateUrl: 'templates/addMessagePerson.html',
        controller: 'MessagePersonCtrl'
      }
    }
  })
      .state('menu.updateMessagePerson', {
        url: '/updateMessagePerson/:gwid/:compile/:phone/:username/:isSend',
        views: {
          'side-menu21': {
            templateUrl: 'templates/updateMessagePerson.html',
            controller: 'MessagePersonCtrl'
          }
        }
      })
      .state('menu.Bak', {
          url: '/Bak',
          views: {
              'side-menu21': {
                  templateUrl: 'templates/Bak.html',
                  controller: 'page1Ctrl'
              }
          }
      })

      .state('menu.showInfrared', {
        url: '/page21/:tittle/:type/:device',
        views: {
          'side-menu21': {
            templateUrl: 'templates/InfraredDevice.html',
            controller: 'page22Ctrl'
          }
        }
      })
      .state('menu.page22', {
        url: '/page22/:tittle/:device',
        views: {
          'side-menu21': {
            templateUrl: 'templates/page22.html',
            controller: 'page22Ctrl'
          }
        }
      })
      .state('menu.page23', {
        url: '/page23',
        views: {
          'side-menu21': {
            templateUrl: 'templates/page23.html',
            controller: 'page1Ctrl'
          }
        }
      })
      .state('menu.page24', {
        url: '/page24',
        views: {
          'side-menu21': {
            templateUrl: 'templates/page24.html',
            controller: 'page24Ctrl'
          }
        }
      })
      .state('menu.page16', {
        url: '/page16',
        views: {
          'side-menu21': {
            templateUrl: 'templates/page16.html',
            controller: 'page16Ctrl'
          }
        }
      })
      .state('menu.addDeviceInfrared', {
        url: '/page16/:newdevice/:device',
        views: {
          'side-menu21': {
            templateUrl: 'templates/addDeviceInfrared.html',
            controller: 'page22Ctrl'
          }
        }
      })
      .state('page16', {
        url: '/addDevice',
        templateUrl: 'templates/page16.html',
        controller: 'page16Ctrl'
      })


      .state('menu.sceneInputDevice', {
        url: '/addInputDevice/:name/:label/:id/:subtype/:type',
        views: {
          'side-menu21': {
            templateUrl: 'templates/sceneInputDevice.html',
            controller: 'sceneInputCtrl'
          }
        }
      })
      .state('menu.sceneInputDeviceList', {
        url: '/sceneInputDeviceList?name',
        views: {
          'side-menu21': {
            templateUrl: 'templates/sceneInputDeviceList.html',
            controller: 'sceneInputCtrl'
          }
        }
      })
      .state('menu.UpdatesceneInputDevice', {
      //  url: '/UpdatesceneInputDevice?check&fname&weeks&date&start_time&end_time&name&property&operator&value&scenename&type',
        url: '/UpdatesceneInputDevice?item2',
        views: {
          'side-menu21': {
            templateUrl: 'templates/UpdatesceneInputDevice.html',
            controller: 'sceneInputDeviceCtrl'
          }
        }
      })
      .state('menu.addAirCondition', {
        url: '/addAirCondition/:eq_id/:name/:code_type/:sub_type/:extfield',
        views: {
          'side-menu21': {
            templateUrl: 'templates/addAirCondition.html',
            controller: 'airConditionCtrl'
          }
        }
      })
      .state('menu.updateAirCondition', {
        url: '/updateAirCondition/:scenename/:extfield/:open/:temp/:equipmentid/:name/:spatialname/:sub_type/:code_type',
        views: {
          'side-menu21': {
            templateUrl: 'templates/updateAirCondition.html',
            controller: 'airConditionCtrl'
          }
        }
      })

      .state('menu.addDevice', {
        url:'/device/:newdevice/:tittle/:code_type/:sub_type',
        views: {
          'side-menu21': {
            templateUrl: 'templates/addDevice.html',
            controller: 'addDeviceCtrl'
          }
        }
      })

      .state('menu.time', {
        url:'/time',
        views: {
          'side-menu21': {
            templateUrl: 'templates/timeManager.html',
            controller: 'timeCtrl'
          }
        }
      })

      .state('menu.timeDetail', {
          url:'/timeDetail/:type',
          views: {
              'side-menu21': {
                  templateUrl: 'templates/timeDetail.html',
                  controller: 'timeCtrl'
              }
          }
      })

      .state('menu.timeDevice', {
        url:'/time',
        views: {
          'side-menu21': {
            templateUrl: 'templates/timeDevice.html',
            controller: 'timeCtrl'
          }
        }
      })
      .state('menu.timeScene', {
        url:'/timeScene',
        views: {
          'side-menu21': {
            templateUrl: 'templates/timeScene.html',
            controller: 'timeCtrl'
          }
        }
      })
      .state('menu.timeSafty', {
        url:'/timeSafty',
        views: {
          'side-menu21': {
            templateUrl: 'templates/timeSafty.html',
            controller: 'timeCtrl'
          }
        }
      })

      .state('menu.timeAddDevice', {
        url:'/timeAddDevice/:item/:type',
        views: {
          'side-menu21': {
            templateUrl: 'templates/timeAddDevice.html',
            controller: 'timeCtrl'
          }
        }
      })

      .state('menu.timeAddScene', {
          url:'/timeAddScene/:item/:type',
          views: {
              'side-menu21': {
                  templateUrl: 'templates/timeAddScene.html',
                  controller: 'timeCtrl'
              }
          }
      })
      .state('menu.timeAddSafty', {
          url:'/timeAddSafty/:item/:type',
          views: {
              'side-menu21': {
                  templateUrl: 'templates/timeAddSafty.html',
                  controller: 'timeCtrl'
              }
          }
      })


      .state('menu.addInfrared', {
        url:'/addInfrared',
        views: {
          'side-menu21': {
            templateUrl: 'templates/page22.html',
            controller: 'addInfraredCtrl'
          }
        }
      })

$urlRouterProvider.otherwise('/side-menu21/page1')

  

});