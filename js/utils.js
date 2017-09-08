/**
 * Created by xinyu on 2016/10/20.
 */
function deleteDisplay(id){
    document.getElementById(id).style.display  = 'block';
}
function deletePlay(id) {
    document.getElementById(id).style.display  = 'none';
}
var CMD = {
    HA_DEVICEID_ON_OFF_OUTPUT:'X0002',
    HA_ATTRID_LEVEL:'X1004',
    HA_ATTRID_INFRARED_CODE_TYPE:'X1032',
    HA_ATTRID_INFRARED_SUB_TYPE:'X1033',
    HA_CMDID_DEV_LEVEL:'X1102',
    HA_ATTR_OFF:'X7100',
    HA_ATTR_ON:'X7101',
    HA_CMDID_DEV_INFRARED_CMD:'1107',
    HA_ATTRID_INFRARED_CMD:'1004',
    OPENORSTOP:'X1001',
    STOP:'X7100',
    OPEN:'X7101',
    HA_ATTR_STOP:'X7103',
    HA_ATTRID_LEVEL2:'X1010',
    DEV_ON_OFF:'1101',
    WINDOW_ON_OFF :'1102',
    DEV_INFRARED_CMD:'1107',
    HA_ATTRID_PM25:'104A',
    HA_ATTRID_IAS_ZONE_STATUS:'2001',                //安防探测器状态
    HA_ATTRID_IAS_ZONE_TYPE:'2002',		  //安防探测器类型
    HA_ATTRID_IAS_STATUS:'2003',
    //安防
    HA_ATTR_STANDARD:'7270',//通用
    HA_ATTR_CONTROL:'7271',//遥控器
    HA_ATTR_MOTION:'7272',//(红外)移动探测器
    HA_ATTR_INFRARED:'7273',//红外对射探测器
    HA_ATTR_DOOR:'7274',//门磁
    HA_ATTR_WINDOW:'7275',//窗磁
    HA_ATTR_GLASS:'7276',//玻璃破碎探测器
    HA_ATTR_EMERGENCY:'7277',//紧急求助
    HA_ATTR_FIRE:'7278',//火
    HA_ATTR_GAS:'7279',//可燃气
    HA_ATTR_WATER:'727A',//水
    HA_ATTR_CURTAIN:'727B',//幕帘探测器
    MUSIC:'X000C',

    HA_ATTR_ALERT:'29281'
}
var spacePic = ['zhuwo','shufang','huiyishi','chufang1','yingershi','keting','home','jifang','ciwo','yushi','yangtai'];
var scenePic = ['-zlikaimoshi','peizhizhinenghua','scenes_default','sence_huijia','sence_huik','sence_huiyi','sence_jinrumoshi','sence_jiucan','sence_lij','sence_lijia','sence_looktv','sence_qichuang','sence_qiye','sence_shangban','sence_shuimian','sence_taolun','sence_wuxiu','sence_xiaban','sence_xiyu','sence_yanjiangmoshi','sence_yinyuan','sence_zhunbeimoshi','shoucangciqingjing'];
var devicePic = {
    '01040314':"lib/ionic/img/device/door.png",
    'X7270':"lib/ionic/img/device/door.png",
    '01040201':"lib/ionic/img/device/window.png",
    'X727B':"lib/ionic/img/device/curtain.png",
    'X727A':'lib/ionic/img/device/detect.png'
}
var devicePics = ['anfangyaokong','beijingyingyue','chazhuo','chuangci','chuangliankongzi','chuowu','dantiyingyue','diancifamen','diandeng','dianqi','dianshiji','diaodeng','guan','guangxianchuanganqi','hongwaishebei','huike','jiankong','jiashiqi','kaiguan(1)','kaiguan','ketiaodeng','ketiaokaiguan','kongqichuanganqi','kongtiao(1)','kongtiao(2)','kongtiao','liangba','lookktv','maike','menci1','mengchi','mengkouji','mengshuo','mulian','open','qiye','ranqichuanganqi','RTSPshexiangtou','shexiangji','shiduchuangganqi','shui','shuiluanqi','taideng(1)','taideng(2)','taideng','tance','touying(1)','wait','wengduji','xinfeng','yaliji','yangantanceqi','yaokong','yidongtanche','yingxiang','zanfang','zhinengchazuo','zhinengdianbiao','zhongyangwengkongqi','pm2.5','tiaosedeng'];
var pageStatus = {
    'plus': 'lib/ionic/img/device/jia.png',
    'minus':'lib/ionic/img/device/jian.png'
};
var airConditonTemp = {  //开头0为制冷
    "117":'11',
    '118':'06',
    '119':'12',
    '120':'07',
    '121':'13',
    '122':'08',
    '123':'14',
    '124':'09',
    '125':'15',
    '126':'0A',
    '127':'16',
    '128':'17',
    '129':'18',
    '130':'0B',
    '017':'19',
    '018':'0C',
    '019':'1A',
    '020':'1B',
    '021':'1C',
    '022':'0D',
    '023':'1D',
    '024':'0E',
    '025':'1F',
    '026':'0F',
    '027':'20',
    '028':'21',
    '029':'22',
    '030':'10'
}
var  identify = {
    '104A':"PM2.5",
    '7270':'通用',
    '7271':'遥控器',
    '7272':'(红外)移动探测器',
    '7273':'红外对射探测器',
    '7274':'门磁',
    '7275':'窗磁',
    '7276':'玻璃破碎探测器',
    '7277':'紧急求助',
    '7278':'火',
    '7279':'可燃气',
    '727A':'水',
    '727B':'幕帘探测器'
}

var DeviceFilter = {
    '01040310':'1',
    '01040100':'1',
    '01040101':'1',
    '01040201':'1',
    '01040103':'1',
    '01040104':'1',
    '01100100':'1',
    '01100300':'1',
    '01100501':'1',
    '01100200':'1',
    '01100500':'1',
    '01100602':'1',
    '01100101':'1',
    '01100340':'1',
    '01040500':'1',
    '01040102':'1',
    '05000602':'1',
    '01040502':'1',
    '01040602':'1',
    '01040603':'1',
    '01040321':'1',
    '01040316':'1',
 //   '01040317':'1',
    '01040319':'1',
    '01040320':'1',
    '04000A01':'1'
}
var InputDeviceFilte = {
    '01040318':'1',
    '01040314':'1',
    '07000402':'1',
    '01100402':'1'
}

var CenterAir='01040322';
var PM25={
    '0':'1002',
    '1':'1005',
    '2':'104A',
    '3':'1050'
}
var typename=[
    {text:'灯光',value: '1'},
    {text:'视频',value: '2'},
    {text:'安全',value: '3'},
    {text:'音乐',value: '4'},
    {text:'窗帘',value: '13'},
    {text:'电器',value: '14'},
    {text:'传感器',value: '5'},
    {text:'其他',value: '6'}
];
var dianbiao = "04000A01";
function goUrl(url){
    window.location.href = url;
}


function getuuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

//var IPPort = "http://192.168.4.135:6688/";
var IPPort = "../";
var IPPortWEB = "http://123.56.236.231";
var Utilcompile = '0';
var equlistsName;//新加的变量 zhx
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.X2JS = factory();
    }
}(this, function () {
    return function (config) {
        'use strict';

        var VERSION = "1.2.0";

        config = config || {};
        initConfigDefaults();
        initRequiredPolyfills();

        function initConfigDefaults() {
            if(config.escapeMode === undefined) {
                config.escapeMode = true;
            }

            config.attributePrefix = config.attributePrefix || "_";
            config.arrayAccessForm = config.arrayAccessForm || "none";
            config.emptyNodeForm = config.emptyNodeForm || "text";

            if(config.enableToStringFunc === undefined) {
                config.enableToStringFunc = true;
            }
            config.arrayAccessFormPaths = config.arrayAccessFormPaths || [];
            if(config.skipEmptyTextNodesForObj === undefined) {
                config.skipEmptyTextNodesForObj = true;
            }
            if(config.stripWhitespaces === undefined) {
                config.stripWhitespaces = true;
            }
            config.datetimeAccessFormPaths = config.datetimeAccessFormPaths || [];

            if(config.useDoubleQuotes === undefined) {
                config.useDoubleQuotes = false;
            }

            config.xmlElementsFilter = config.xmlElementsFilter || [];
            config.jsonPropertiesFilter = config.jsonPropertiesFilter || [];

            if(config.keepCData === undefined) {
                config.keepCData = false;
            }
        }

        var DOMNodeTypes = {
            ELEMENT_NODE 	   : 1,
            TEXT_NODE    	   : 3,
            CDATA_SECTION_NODE : 4,
            COMMENT_NODE	   : 8,
            DOCUMENT_NODE 	   : 9
        };

        function initRequiredPolyfills() {
        }

        function getNodeLocalName( node ) {
            var nodeLocalName = node.localName;
            if(nodeLocalName == null) // Yeah, this is IE!!
                nodeLocalName = node.baseName;
            if(nodeLocalName == null || nodeLocalName=="") // =="" is IE too
                nodeLocalName = node.nodeName;
            return nodeLocalName;
        }

        function getNodePrefix(node) {
            return node.prefix;
        }

        function escapeXmlChars(str) {
            if(typeof(str) == "string")
                //return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                return str.replace(/&/g, '&amp;').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
            else
                return str;
        }

        function unescapeXmlChars(str) {
            return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
        }

        function checkInStdFiltersArrayForm(stdFiltersArrayForm, obj, name, path) {
            var idx = 0;
            for(; idx < stdFiltersArrayForm.length; idx++) {
                var filterPath = stdFiltersArrayForm[idx];
                if( typeof filterPath === "string" ) {
                    if(filterPath == path)
                        break;
                }
                else
                if( filterPath instanceof RegExp) {
                    if(filterPath.test(path))
                        break;
                }
                else
                if( typeof filterPath === "function") {
                    if(filterPath(obj, name, path))
                        break;
                }
            }
            return idx!=stdFiltersArrayForm.length;
        }

        function toArrayAccessForm(obj, childName, path) {
            switch(config.arrayAccessForm) {
                case "property":
                    if(!(obj[childName] instanceof Array))
                        obj[childName+"_asArray"] = [obj[childName]];
                    else
                        obj[childName+"_asArray"] = obj[childName];
                    break;
                /*case "none":
                 break;*/
            }

            if(!(obj[childName] instanceof Array) && config.arrayAccessFormPaths.length > 0) {
                if(checkInStdFiltersArrayForm(config.arrayAccessFormPaths, obj, childName, path)) {
                    obj[childName] = [obj[childName]];
                }
            }
        }

        function fromXmlDateTime(prop) {
            // Implementation based up on http://stackoverflow.com/questions/8178598/xml-datetime-to-javascript-date-object
            // Improved to support full spec and optional parts
            var bits = prop.split(/[-T:+Z]/g);

            var d = new Date(bits[0], bits[1]-1, bits[2]);
            var secondBits = bits[5].split("\.");
            d.setHours(bits[3], bits[4], secondBits[0]);
            if(secondBits.length>1)
                d.setMilliseconds(secondBits[1]);

            // Get supplied time zone offset in minutes
            if(bits[6] && bits[7]) {
                var offsetMinutes = bits[6] * 60 + Number(bits[7]);
                var sign = /\d\d-\d\d:\d\d$/.test(prop)? '-' : '+';

                // Apply the sign
                offsetMinutes = 0 + (sign == '-'? -1 * offsetMinutes : offsetMinutes);

                // Apply offset and local timezone
                d.setMinutes(d.getMinutes() - offsetMinutes - d.getTimezoneOffset())
            }
            else
            if(prop.indexOf("Z", prop.length - 1) !== -1) {
                d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));
            }

            // d is now a local time equivalent to the supplied time
            return d;
        }

        function checkFromXmlDateTimePaths(value, childName, fullPath) {
            if(config.datetimeAccessFormPaths.length > 0) {
                var path = fullPath.split("\.#")[0];
                if(checkInStdFiltersArrayForm(config.datetimeAccessFormPaths, value, childName, path)) {
                    return fromXmlDateTime(value);
                }
                else
                    return value;
            }
            else
                return value;
        }

        function checkXmlElementsFilter(obj, childType, childName, childPath) {
            if( childType == DOMNodeTypes.ELEMENT_NODE && config.xmlElementsFilter.length > 0) {
                return checkInStdFiltersArrayForm(config.xmlElementsFilter, obj, childName, childPath);
            }
            else
                return true;
        }

        function parseDOMChildren( node, path ) {
            if(node.nodeType == DOMNodeTypes.DOCUMENT_NODE) {
                var result = new Object;
                var nodeChildren = node.childNodes;
                // Alternative for firstElementChild which is not supported in some environments
                for(var cidx=0; cidx <nodeChildren.length; cidx++) {
                    var child = nodeChildren.item(cidx);
                    if(child.nodeType == DOMNodeTypes.ELEMENT_NODE) {
                        var childName = getNodeLocalName(child);
                        result[childName] = parseDOMChildren(child, childName);
                    }
                }
                return result;
            }
            else
            if(node.nodeType == DOMNodeTypes.ELEMENT_NODE) {
                var result = new Object;
                result.__cnt=0;

                var nodeChildren = node.childNodes;

                // Children nodes
                for(var cidx=0; cidx <nodeChildren.length; cidx++) {
                    var child = nodeChildren.item(cidx); // nodeChildren[cidx];
                    var childName = getNodeLocalName(child);

                    if(child.nodeType!= DOMNodeTypes.COMMENT_NODE) {
                        var childPath = path+"."+childName;
                        if (checkXmlElementsFilter(result,child.nodeType,childName,childPath)) {
                            result.__cnt++;
                            if(result[childName] == null) {
                                result[childName] = parseDOMChildren(child, childPath);
                                toArrayAccessForm(result, childName, childPath);
                            }
                            else {
                                if(result[childName] != null) {
                                    if( !(result[childName] instanceof Array)) {
                                        result[childName] = [result[childName]];
                                        toArrayAccessForm(result, childName, childPath);
                                    }
                                }
                                (result[childName])[result[childName].length] = parseDOMChildren(child, childPath);
                            }
                        }
                    }
                }

                // Attributes
                for(var aidx=0; aidx <node.attributes.length; aidx++) {
                    var attr = node.attributes.item(aidx); // [aidx];
                    result.__cnt++;
                    result[config.attributePrefix+attr.name]=attr.value;
                }

                // Node namespace prefix
                var nodePrefix = getNodePrefix(node);
                if(nodePrefix!=null && nodePrefix!="") {
                    result.__cnt++;
                    result.__prefix=nodePrefix;
                }

                if(result["#text"]!=null) {
                    result.__text = result["#text"];
                    if(result.__text instanceof Array) {
                        result.__text = result.__text.join("\n");
                    }
                    //if(config.escapeMode)
                    //	result.__text = unescapeXmlChars(result.__text);
                    if(config.stripWhitespaces)
                        result.__text = result.__text.trim();
                    delete result["#text"];
                    if(config.arrayAccessForm=="property")
                        delete result["#text_asArray"];
                    result.__text = checkFromXmlDateTimePaths(result.__text, childName, path+"."+childName);
                }
                if(result["#cdata-section"]!=null) {
                    result.__cdata = result["#cdata-section"];
                    delete result["#cdata-section"];
                    if(config.arrayAccessForm=="property")
                        delete result["#cdata-section_asArray"];
                }

                if( result.__cnt == 0 && config.emptyNodeForm=="text" ) {
                    result = '';
                }
                else
                if( result.__cnt == 1 && result.__text!=null  ) {
                    result = result.__text;
                }
                else
                if( result.__cnt == 1 && result.__cdata!=null && !config.keepCData  ) {
                    result = result.__cdata;
                }
                else
                if ( result.__cnt > 1 && result.__text!=null && config.skipEmptyTextNodesForObj) {
                    if( (config.stripWhitespaces && result.__text=="") || (result.__text.trim()=="")) {
                        delete result.__text;
                    }
                }
                delete result.__cnt;

                if( config.enableToStringFunc && (result.__text!=null || result.__cdata!=null )) {
                    result.toString = function() {
                        return (this.__text!=null? this.__text:'')+( this.__cdata!=null ? this.__cdata:'');
                    };
                }

                return result;
            }
            else
            if(node.nodeType == DOMNodeTypes.TEXT_NODE || node.nodeType == DOMNodeTypes.CDATA_SECTION_NODE) {
                return node.nodeValue;
            }
        }

        function startTag(jsonObj, element, attrList, closed) {
            var resultStr = "<"+ ( (jsonObj!=null && jsonObj.__prefix!=null)? (jsonObj.__prefix+":"):"") + element;
            if(attrList!=null) {
                for(var aidx = 0; aidx < attrList.length; aidx++) {
                    var attrName = attrList[aidx];
                    var attrVal = jsonObj[attrName];
                    if(config.escapeMode)
                        attrVal=escapeXmlChars(attrVal);
                    resultStr+=" "+attrName.substr(config.attributePrefix.length)+"=";
                    if(config.useDoubleQuotes)
                        resultStr+='"'+attrVal+'"';
                    else
                        resultStr+="'"+attrVal+"'";
                }
            }
            if(!closed)
                resultStr+=">";
            else
                resultStr+="/>";
            return resultStr;
        }

        function endTag(jsonObj,elementName) {
            return "</"+ (jsonObj.__prefix!=null? (jsonObj.__prefix+":"):"")+elementName+">";
        }

        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }

        function jsonXmlSpecialElem ( jsonObj, jsonObjField ) {
            if((config.arrayAccessForm=="property" && endsWith(jsonObjField.toString(),("_asArray")))
                || jsonObjField.toString().indexOf(config.attributePrefix)==0
                || jsonObjField.toString().indexOf("__")==0
                || (jsonObj[jsonObjField] instanceof Function) )
                return true;
            else
                return false;
        }

        function jsonXmlElemCount ( jsonObj ) {
            var elementsCnt = 0;
            if(jsonObj instanceof Object ) {
                for( var it in jsonObj  ) {
                    if(jsonXmlSpecialElem ( jsonObj, it) )
                        continue;
                    elementsCnt++;
                }
            }
            return elementsCnt;
        }

        function checkJsonObjPropertiesFilter(jsonObj, propertyName, jsonObjPath) {
            return config.jsonPropertiesFilter.length == 0
                || jsonObjPath==""
                || checkInStdFiltersArrayForm(config.jsonPropertiesFilter, jsonObj, propertyName, jsonObjPath);
        }

        function parseJSONAttributes ( jsonObj ) {
            var attrList = [];
            if(jsonObj instanceof Object ) {
                for( var ait in jsonObj  ) {
                    if(ait.toString().indexOf("__")== -1 && ait.toString().indexOf(config.attributePrefix)==0) {
                        attrList.push(ait);
                    }
                }
            }
            return attrList;
        }

        function parseJSONTextAttrs ( jsonTxtObj ) {
            var result ="";

            if(jsonTxtObj.__cdata!=null) {
                result+="<![CDATA["+jsonTxtObj.__cdata+"]]>";
            }

            if(jsonTxtObj.__text!=null) {
                if(config.escapeMode)
                    result+=escapeXmlChars(jsonTxtObj.__text);
                else
                    result+=jsonTxtObj.__text;
            }
            return result;
        }

        function parseJSONTextObject ( jsonTxtObj ) {
            var result ="";

            if( jsonTxtObj instanceof Object ) {
                result+=parseJSONTextAttrs ( jsonTxtObj );
            }
            else
            if(jsonTxtObj!=null) {
                if(config.escapeMode)
                    result+=escapeXmlChars(jsonTxtObj);
                else
                    result+=jsonTxtObj;
            }

            return result;
        }

        function getJsonPropertyPath(jsonObjPath, jsonPropName) {
            if (jsonObjPath==="") {
                return jsonPropName;
            }
            else
                return jsonObjPath+"."+jsonPropName;
        }

        function parseJSONArray ( jsonArrRoot, jsonArrObj, attrList, jsonObjPath ) {
            var result = "";
            if(jsonArrRoot.length == 0) {
                result+=startTag(jsonArrRoot, jsonArrObj, attrList, true);
            }
            else {
                for(var arIdx = 0; arIdx < jsonArrRoot.length; arIdx++) {
                    result+=startTag(jsonArrRoot[arIdx], jsonArrObj, parseJSONAttributes(jsonArrRoot[arIdx]), false);
                    result+=parseJSONObject(jsonArrRoot[arIdx], getJsonPropertyPath(jsonObjPath,jsonArrObj));
                    result+=endTag(jsonArrRoot[arIdx],jsonArrObj);
                }
            }
            return result;
        }

        function parseJSONObject ( jsonObj, jsonObjPath ) {
            var result = "";

            var elementsCnt = jsonXmlElemCount ( jsonObj );

            if(elementsCnt > 0) {
                for( var it in jsonObj ) {

                    if(jsonXmlSpecialElem ( jsonObj, it) || (jsonObjPath!="" && !checkJsonObjPropertiesFilter(jsonObj, it, getJsonPropertyPath(jsonObjPath,it))) )
                        continue;

                    var subObj = jsonObj[it];

                    var attrList = parseJSONAttributes( subObj )

                    if(subObj == null || subObj == undefined) {
                        result+=startTag(subObj, it, attrList, true);
                    }
                    else
                    if(subObj instanceof Object) {

                        if(subObj instanceof Array) {
                            result+=parseJSONArray( subObj, it, attrList, jsonObjPath );
                        }
                        else if(subObj instanceof Date) {
                            result+=startTag(subObj, it, attrList, false);
                            result+=subObj.toISOString();
                            result+=endTag(subObj,it);
                        }
                        else {
                            var subObjElementsCnt = jsonXmlElemCount ( subObj );
                            if(subObjElementsCnt > 0 || subObj.__text!=null || subObj.__cdata!=null) {
                                result+=startTag(subObj, it, attrList, false);
                                result+=parseJSONObject(subObj, getJsonPropertyPath(jsonObjPath,it));
                                result+=endTag(subObj,it);
                            }
                            else {
                                result+=startTag(subObj, it, attrList, true);
                            }
                        }
                    }
                    else {
                        result+=startTag(subObj, it, attrList, false);
                        result+=parseJSONTextObject(subObj);
                        result+=endTag(subObj,it);
                    }
                }
            }
            result+=parseJSONTextObject(jsonObj);

            return result;
        }

        this.parseXmlString = function(xmlDocStr) {
            var isIEParser = window.ActiveXObject || "ActiveXObject" in window;
            if (xmlDocStr === undefined) {
                return null;
            }
            var xmlDoc;
            if (window.DOMParser) {
                var parser=new window.DOMParser();
                var parsererrorNS = null;
                // IE9+ now is here
                if(!isIEParser) {
                    try {
                        parsererrorNS = parser.parseFromString("INVALID", "text/xml").getElementsByTagName("parsererror")[0].namespaceURI;
                    }
                    catch(err) {
                        parsererrorNS = null;
                    }
                }
                try {
                    xmlDoc = parser.parseFromString( xmlDocStr, "text/xml" );
                    if( parsererrorNS!= null && xmlDoc.getElementsByTagNameNS(parsererrorNS, "parsererror").length > 0) {
                        //throw new Error('Error parsing XML: '+xmlDocStr);
                        xmlDoc = null;
                    }
                }
                catch(err) {
                    xmlDoc = null;
                }
            }
            else {
                // IE :(
                if(xmlDocStr.indexOf("<?")==0) {
                    xmlDocStr = xmlDocStr.substr( xmlDocStr.indexOf("?>") + 2 );
                }
                xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async="false";
                xmlDoc.loadXML(xmlDocStr);
            }
            return xmlDoc;
        };

        this.asArray = function(prop) {
            if (prop === undefined || prop == null)
                return [];
            else
            if(prop instanceof Array)
                return prop;
            else
                return [prop];
        };

        this.toXmlDateTime = function(dt) {
            if(dt instanceof Date)
                return dt.toISOString();
            else
            if(typeof(dt) === 'number' )
                return new Date(dt).toISOString();
            else
                return null;
        };

        this.asDateTime = function(prop) {
            if(typeof(prop) == "string") {
                return fromXmlDateTime(prop);
            }
            else
                return prop;
        };

        this.xml2json = function (xmlDoc) {
            return parseDOMChildren ( xmlDoc );
        };

        this.xml_str2json = function (xmlDocStr) {
            var xmlDoc = this.parseXmlString(xmlDocStr);
            if(xmlDoc!=null)
                return this.xml2json(xmlDoc);
            else
                return null;
        };

        this.json2xml_str = function (jsonObj) {
            return parseJSONObject ( jsonObj, "" );
        };

        this.json2xml = function (jsonObj) {
            var xmlDocStr = this.json2xml_str (jsonObj);
            return this.parseXmlString(xmlDocStr);
        };

        this.getVersion = function () {
            return VERSION;
        };
    }
}))
//格式化时间格式，兼容ios,andriod
//甘国西
function FormatDate (date) {
    var d1;
    if (typeof (date) != "object") {
        d1 =  new Date(date.replace(/-/g, '/'));
    }else{
        d1 =date;
    }


    var curr_year = d1.getFullYear();
    var curr_month = d1.getMonth() + 1;
    var curr_date = d1.getDate();
    var curr_hour = d1.getHours();
    var curr_min = d1.getMinutes();
    var curr_sec = d1.getSeconds();
    var newtimestamp = curr_year.toString() + "-" + curr_month.toString() + "-" + curr_date.toString() + " " +
        curr_hour.toString() + ":" + curr_min.toString() + ":" + curr_sec.toString();

    return newtimestamp;
}
function FormatTime (date) {
    var d1;
    if (typeof (date) != "object") {
        d1 =  new Date(date.replace(/-/g, '/'));
    }else{
        d1 =date;
    }
    var curr_hour = d1.getHours();
    var curr_min = d1.getMinutes(); var curr_sec = d1.getSeconds();
    var newtimestamp = curr_hour.toString() + ":" + curr_min.toString() ;

    return newtimestamp;
}