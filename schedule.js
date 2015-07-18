/**
 * Created by songzhongli on 2015/7/18.
 */

/**
 * ;ţ - �г̽ṹ���༭��
 * param sch_id ���Ϊ�գ���Ϊ����������Ϊ�༭ sch_obj�����׶ε�demoJson����
 */
;(function ($) {
    //uuid������ localstorage���ֲ�ͬҳ��汾��
    Math.uuid=(function(){var $="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");return function(_,G){var C=$,F=[],D=Math.random;G=G||C.length;if(_){for(var B=0;B<_;B++)F[B]=C[0|D()*G]}else{var A=0,E;F[8]=F[13]=F[18]=F[23]="-";F[14]="4";for(B=0;B<36;B++)if(!F[B]){E=0|D()*16;F[B]=C[(B==19)?(E&3)|8:E&15]}}return F.join("")}})();

    $.fn.TNScheduleEditor = function (options) {
        var defaults = { sch_id: 0, sch_obj: {}, sch_out: $("#desc_tnSch"), sch_out_old: $("#desc_tnSch_old"),sch_out_html:$("#desc_tnSch_html"), cityOrPoi:"city"};
        var opts = $.extend({}, defaults, options);
        var $editorWrapper = $(this);

        //��ʼ�� - ִ��
        initLoad($editorWrapper,opts); //��ʼȫҳ��Ⱦ
        bindFunc(); //�¼���
    };

    var sch_json = {}; //�г̱༭��ȫ��
    var wrapper = $(document.body); //Ĭ��
    var schTimer; //��ʱ�� ʵʱ��������
    var LsKey = "TNSch"; //LocalStorage Key
    var sch_id;
    var schSaveFlag = false;
    //var schAjaxHost = "";
    var schAjaxHost = "http://admin.tuniu.org"; //BOSS�ȸ����Ͻӿ�
    var $sch_out;
    var $sch_out_old;
    var $sch_out_html;
    //var draggingFlag = false;//�϶���ʶ��ֻ�д�����һ���϶��¼�����

    //���кͽ�ͨѡ��� - ���л���poi
    var cityOrPoi;

    //�������ñ���
    var schGlobalCfgVars = {
        CURRENCYS:[
            {"code":"CNY", "name":"�����"},
            {"code":"EUR", "name":"ŷԪ"},
            {"code":"USD", "name":"��Ԫ"},
            {"code":"THB", "name":"̩��"},
            {"code":"TWD", "name":"��̨��"},
            {"code":"MYR", "name":"���������"},
            {"code":"SGD", "name":"�¼���Ԫ"},
            {"code":"KRW", "name":"��Ԫ"},
            {"code":"KHR", "name":"���"},
            {"code":"GBP", "name":"Ӣ��"},
            {"code":"CHF", "name":"��ʿ����"},
            {"code":"AUD", "name":"����Ԫ"},
            {"code":"CZK", "name":"�ݿ˿���"},
            {"code":"IDR", "name":"ӡ���"},
            {"code":"PHP", "name":"���ɱ�����"},
            {"code":"NPR", "name":"�Ჴ��¬��"},
            {"code":"SEK", "name":"������"},
            {"code":"DKK", "name":"�������"},
            {"code":"HUF", "name":"����������"},
            {"code":"NZD", "name":"������Ԫ"},
            {"code":"CAD", "name":"���ô�Ԫ"},
            {"code":"TRY", "name":"������������"},
            {"code":"INR", "name":"ӡ��¬��"},
            {"code":"RUB", "name":"����˹¬��"},
            {"code":"EGY", "name":"������"},
            {"code":"NOK", "name":"Ų������"},
            {"code":"LAK", "name":"���λ���"},
            {"code":"LKR", "name":"˹������¬��"},
            {"code":"BUK", "name":"���Ԫ"},
            {"code":"PLN", "name":"����������"},
            {"code":"MXN", "name":"ī�������"},
            {"code":"ZAR", "name":"�Ϸ�����"},
            {"code":"BRL", "name":"���Ƕ�"},
            {"code":"ISK", "name":"��������"},
            {"code":"ARS", "name":"����͢����"},
            {"code":"RON", "name":"������������"},
            {"code":"BNG", "name":"���������и�"},
            {"code":"UAH", "name":"�������"},
            {"code":"ZWR", "name":"��Ͳ�ΤԪ"},
            {"code":"MNT", "name":"�ɹ�ͼ�����"},
            {"code":"MOP", "name":"���ű�"},
            {"code":"HKD", "name":"��Ԫ"},
            {"code":"ILS", "name":"��л�˶�"},
            {"code":"JPY", "name":"��Ԫ"},
            {"code":"AED", "name":"�������϶���"},
            {"code":"PKR", "name":"�ͻ�˹̹¬��"},
            {"code":"MVR", "name":"�������������"},
            {"code":"BTN", "name":"����Ŭ����³ķ"},
            {"code":"VND", "name":"Խ�϶�"}
        ],
        HOURS:[
            "","0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"
        ],
        MINUTES:[
            "","00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30",
            "31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59"
        ],
        TRANSPORT_TYPES: {
            "train": {
                "code": "train",
                "name": "��",
                "pic": "http://img.tuniucdn.com/icons/route/train.gif"
            },
            "plain": {
                "code": "plain",
                "name": "�ɻ�",
                "pic": "http://img.tuniucdn.com/icons/route/plain.gif"
            },
            "car": {
                "code": "car",
                "name": "����",
                "pic": "http://admin.tuniu.org/assets/plug/TNScheduleEditor/assets/images/transport_car.png"
            },
            "bus": {
                "code": "bus",
                "name": "��ʿ",
                "pic": "http://admin.tuniu.org/assets/plug/TNScheduleEditor/assets/images/transport_bus.png"
            },
            "ship": {
                "code": "ship",
                "name": "�ִ�",
                "pic": "http://img.tuniucdn.com/icons/route/ship.gif"
            },
            "other":{
                "code": "other",
                "name": "����",
                "pic": "http://admin.tuniu.org/assets/plug/TNScheduleEditor/assets/images/transport_other.png"
            }
        }
    };

    //��ʼȫҳ��Ⱦ
    function initLoad($editorWrapper,opts){
        sch_id = opts.sch_id;
        $sch_out = opts.sch_out;
        $sch_out_old = opts.sch_out_old;
        $sch_out_html = opts.sch_out_html;
        cityOrPoi = (typeof opts.cityOrPoi=="undefined")?"city":opts.cityOrPoi;
        wrapper = $editorWrapper;
        wrapper.off('click');
        LsKey = LsKey + ( (parseInt(opts.sch_id)>0)?opts.sch_id:Math.uuid() );
        handleSchJson(opts.sch_obj); //��ȡ�ʹ���sch_json����
        renderInitEmpty(); //��Ⱦ��ҳ��
        renderDays(); //��Ⱦ����ѡ����
        renderContent(); //��Ⱦ�г�����
        $(".day_top_wrap:first",wrapper).find(".day_banner").trigger("click");

        //draggingFlag = false;
        //enableDragSort();
    }

    //�¼���
    function bindFunc(){
        //���������İ�ť�¼�
        //enableDragSort();

        addDay();
        addDayBeforeAfter();
        delDay();
        moveDays(); //�����ƶ�����

        //city - func
        addCity();
        delCity();
        changeCityTransport();

        //item - func
        addItem();
        delItem();
        editItem();
        saveItem();
        changeItemDay(); //�ƶ��ճ̰������һ��(���)
        price_valid()
        moveItems(); //�����ƶ��ճ̰�����;
        moveCitys(); //�����ƶ�����
        addPicText(); //���ͼ����
        delPicText(); //ɾ��ͼ����
        addShop(); //��ӹ����
        delShop(); //ɾ�������

        //����ͼƬ�ϴ�
        uploadSpotPic();

        //��洢
        saveSchVer();
        revertSch();
        previewSch();
        //ȫ������
        saveAllSch();

        //�۵���ת��Ч��
        addEffects();
    }

    //ҳ��ˢ�»�ر���ʾ
    /*
     var existingHandler = window.onbeforeunload;
     $(window).bind("beforeunload", function() {
     //boss�ⲿ�Ѿ�ע����beforeunload�¼�����ʾԭ�е�
     if (existingHandler){
     existingHandler(event);
     }
     return "�㻹û���ύ���رմ��ں�༭���г̽���ʧ���Ƿ�Ҫ�����رգ�";
     });
     */

    //�����ֲ�����
    function handleSchJson(init_json){
        //���LocalStorage�Ƿ����
        if(getLocalStorage(LsKey)){
            sch_json = getLocalStorage(LsKey);
        }else{
            //����һЩ��ʽ���etc.
            sch_json = init_json;
            if(!sch_json.hasOwnProperty("sch_days")){
                sch_json.sch_days = [];
            }
            saveSchOut();
        }
    }

    //��Ⱦ��ģ�� daysEmpty & all
    function renderInitEmpty() {
        var htmlTopBanner = template('T-Top-Banner', {});
        var htmlDaysEmpty = template('T-Days-Empty', {});
        var htmlContentEmpty = template('T-Content-Empty', {});
        wrapper.empty().append(htmlTopBanner);
        wrapper.append(htmlDaysEmpty);
        wrapper.append(htmlContentEmpty);
    }

    //��Ⱦ�����б�
    function renderDays(){
        resortDayIndex();
        var wrapDays = $('.wrap_days',wrapper);
        var htmlDays = template('T-Days', sch_json);
        wrapDays.find('li').remove().end().prepend(htmlDays);
    }

    //����day_index
    function resortDayIndex(){
        var sch_days = sch_json.sch_days;
        var sch_days_length = sch_days.length;
        if(sch_days_length>0){
            for(var i=0;i<sch_days_length;i++){
                sch_days[i].day_index = parseInt(i)+1;
            }
        }else{
            return sch_days;
        }
    }

    //day - ����һ��
    function addDay() {
        wrapper.on('click','.btn_add_day',function(){
            addEmptyDay();
            return false;
        });
    }

    //ǰ�����ӳ���
    function addDayBeforeAfter() {
        wrapper.on('click','.btn_add_day_before',function(){
            var add_day_index = parseInt($(this).parents("li.sch_day").attr("target_day_index"));
            addEmptyDay(add_day_index);
        });
        wrapper.on('click','.btn_add_day_after',function(){
            var add_day_index = parseInt($(this).parents("li.sch_day").attr("target_day_index")) + 1;
            addEmptyDay(add_day_index);
        });
    }

    //���ߺ��� - ����һ���� ��֮ǰ��֮����� ���ֳ��� ע��index�׻�����
    function addEmptyDay(day_index){
        var sch_days_length = parseInt(sch_json.sch_days.length);
        day_index = day_index || sch_days_length+1; //���û��day_index��������
        var emptyDayJson = getEmptyJson("day");
        sch_json.sch_days.splice(day_index-1,0,emptyDayJson);
        emptyDayJson.day_index = day_index;
        var htmlDayWrap = template('T-Content-Day-Wrap',emptyDayJson);
        var cur_day_cnt = $(".day_top_wrap").length;
        renderDays();
        if(cur_day_cnt>0 && day_index>1){
            $(".day_top_wrap:eq("+(day_index-2)+")").after(htmlDayWrap);
        }else{
            $(".sch_content_top",wrapper).prepend(htmlDayWrap);
        }
        reIndexDays(); //����day_index
        saveSchOut();
        $(".text_left:eq("+(day_index-1)+")",wrapper).trigger("click");
    }

    //day - ɾ��һ��
    function delDay(){
        wrapper.on('click','.btn_del_day',function(){
            if(confirm("ȷ��Ҫɾ����һ����г�?")) {
                var del_day_index = parseInt($(this).parents("li.sch_day").attr("target_day_index")) - 1;
                sch_json.sch_days.splice(del_day_index, 1);
                //ɾ����Ӧday dom
                $(".day_top_wrap:eq("+del_day_index+")").remove();
                renderDays();
                reIndexDays(); //����day_index
                saveSchOut();
            }
        });
    }

    //������������
    function moveDays(){
        wrapper.on("click",".btn_move_day_up,.btn_move_day_down",function(){
            var dayIndex = parseInt($(this).parents(".sch_day").attr("target_day_index"));
            var targetDayIndex = dayIndex - 1;
            var upDownFlag = "up";
            var curBiggerDayIndex = dayIndex - 1;
            var curSmallerDayIndex = targetDayIndex - 1;
            if($(this).hasClass("btn_move_day_down")){
                upDownFlag = "down";
                targetDayIndex = dayIndex + 1;
                curBiggerDayIndex = targetDayIndex - 1;
                curSmallerDayIndex = dayIndex - 1;
            }

            if(upDownFlag == "up" && dayIndex==1){
                showSchMsg("�Ѿ��ǵ�һ����",1);
                return false;
            }
            if(upDownFlag == "down" && dayIndex == sch_json.sch_days.length){
                showSchMsg("�Ѿ������һ����",1);
                return false;
            }

            //json����
            var tmpDayJson = sch_json.sch_days[dayIndex - 1];
            sch_json.sch_days[dayIndex - 1] = sch_json.sch_days[targetDayIndex - 1];
            sch_json.sch_days[targetDayIndex - 1] = tmpDayJson;
            resortDayIndex(); //json�������

            //dom����
            if(curSmallerDayIndex == 0){
                $(".day_top_wrap:eq(" + curBiggerDayIndex + ")").detach().prependTo($(".sch_content_top"));
            }else{
                $(".day_top_wrap:eq(" + curBiggerDayIndex + ")").detach().insertBefore($(".day_top_wrap:eq(" + curSmallerDayIndex + ")"));
            }
            renderDays();
            reIndexDays(); //����day_index
            saveSchOut();
        });
    }

    //day - ����day_index
    function reIndexDays(){
        //����day_index
        $(".day_top_wrap").each(function(index){
            $(this).attr("day_index",index+1);
            $(this).find(".day_banner span").text(index+1);
        });
    }

    //��Ⱦ�Ҳ�����
    function renderContent(){
        var sch_days_length = parseInt(sch_json.sch_days.length);
        if(sch_days_length>0){
            transportSelector();
            for(var i=0;i<sch_days_length;i++){
                //������Ⱦÿһ��
                var day_index = i+1;
                renderOneDay(sch_json.sch_days[i],day_index);
            }
            $(".day_city_top").find(".city_transport_selector:last").hide(); //�������һ����ͨ��ʶ
        }
    }

    //��Ⱦһ��
    function renderOneDay(day_json,day_index){
        //Day banner index & city
        day_json.day_index = day_index;
        //day_json.globalCfgVars = schGlobalCfgVars;
        var htmlDayWrap = template('T-Content-Day-Wrap',day_json);
        $(".sch_content_top",wrapper).append(htmlDayWrap);

        if(day_json.sch_items && day_json.sch_items.length>0){
            for(var i=0;i<day_json.sch_items.length;i++){
                day_json.sch_items[i].item_index = i+1;
                var item_json_this = JSON.parse( JSON.stringify( day_json.sch_items[i] ) );
                var day_index_this = day_json.day_index;
                switch(day_json.sch_items[i].item_type){
                    case "transport":
                        renderItemTransport(item_json_this,day_index_this,"readonly");
                        break;
                    case "spot":
                        renderItemSpot(item_json_this,day_index_this,"readonly");
                        break;
                    default:
                        renderItemSimple(item_json_this,day_index_this,"readonly");
                        break;
                }
            }
        }
    }

    //��ӳ���
    function addCity(){
        wrapper.on('click','.btn_add_city',function(){
            $(this).parents(".day_city_top").find(".wrapper_add_city").show();
            var $target_input = $(this).parents(".day_city_top").find(".city_selector_wrap input");
            $target_input.attr("city_id",0).attr("city_name","").val("");
        });
        //ȡ��
        wrapper.on('click','.btn_add_city_cancel',function(){
            $(this).parents(".day_city_top").find(".wrapper_add_city").hide();
        });
        //��ӳ���input���¼�����ճ��
        city_selector();
        //���
        bindCityConfirmClick();
    }

    //����ѡ����
    function city_selector(){
        wrapper.on('keyup paste','.selected_city_input',function(){
            var $cur = $(this);
            clearTimeout(schTimer);
            schTimer = setTimeout(function() {
                var q = $.trim($cur.val());
                if(q) {
                    $.ajax({
                        url: schAjaxHost+"/schedule/scheduleAjax/getCityList/",
                        data: {
                            q: q,
                            cityOrPoi: cityOrPoi  //city��poi
                        },
                        type: "GET",
                        dataType: "json",
                        success: function (res) {
                            var city_list = res.data;
                            var city_cnt = res.data.length;
                            var city_option_dom = '';
                            if(city_cnt>0){
                                for(var i=0;i<city_cnt;i++){
                                    city_option_dom+='<a class="city_option" href="javascript:;" data-id="'+city_list[i].id+'" data-name="'+city_list[i].name+'">'+city_list[i].name+'</a>';
                                }
                            }
                            $cur.parents('.city_selector_wrap').find('.city_options').html(city_option_dom);
                            $cur.parents('.city_selector_wrap').find('.city_options').show();
                            bindCityOptionClick();
                        }
                    });
                }else{
                    //��Ⱦ��ǰ��day_citys
                    $cur.parents('.city_selector_wrap').find('.city_options').empty();
                }
            }, 200);
        });
        wrapper.on('click','.selected_city_input',function(){
            //������Ϊ�� չʾday_citys��ĳ��й��û�ѡ��
        });
    }

    //bind city option click
    function bindCityOptionClick(){
        //�б���ѡ�г���
        wrapper.on('click','.city_option',function(){
            var city_id = $(this).attr("data-id");
            var city_name = $(this).attr("data-name");
            $(this).parents('div').siblings('input.selected_city_input').attr("city_id",city_id).attr('city_name',city_name).val(city_name);
            $(this).parents(".city_options").hide();
        });
    }

    //����ѡ����
    function spot_selector(){
        wrapper.on('keyup  paste','.selected_spot_input',function(){
            var $cur = $(this);
            clearTimeout(schTimer);
            schTimer = setTimeout(function() {
                var q = $.trim($cur.val());
                if(q) {
                    $.ajax({
                        url: schAjaxHost+"/schedule/scheduleAjax/getSpotList/",
                        data: {
                            q: q
                        },
                        type: "GET",
                        dataType: "json",
                        success: function (res) {
                            var spot_list = res.data;
                            var spot_cnt = res.data.length;
                            var spot_option_dom = '';
                            if(spot_cnt>0){
                                for(var i=0;i<spot_cnt;i++){
                                    spot_option_dom+='<a class="spot_option" href="javascript:;" data-id="'+spot_list[i].id+'" data-name="'+spot_list[i].name+'">'+spot_list[i].name+'</a>';
                                }
                            }
                            $cur.parents('.spot_selector_wrap').find('.spot_options').html(spot_option_dom);
                            $cur.parents('.spot_selector_wrap').find('.spot_options').show();
                            bindSpotOptionClick();
                        }
                    });
                }else{
                    //��Ⱦ��ǰ��day_citys
                    $cur.parents('.spot_selector_wrap').find('.spot_options').empty();
                }
            }, 200);
        });
    }

    //bind spot option click
    function bindSpotOptionClick(){
        //�б���ѡ�о���
        wrapper.on('click','.spot_option',function(){
            var $cur = $(this);
            var spot_id = $(this).attr("data-id");
            var spot_name = $(this).attr("data-name");
            $(this).parents('div').siblings('input.selected_spot_input').attr("spot_id",spot_id).attr('spot_name',spot_name).val(spot_name);
            $(this).parents(".spot_options").hide();
            if(spot_id){
                $.ajax({
                    url: schAjaxHost+"/schedule/scheduleAjax/getSpotDetail/",
                    data: {
                        spot_id: spot_id
                    },
                    type: "GET",
                    dataType: "json",
                    success: function (res) {
                        $cur.parents(".item_top_wrap").find(".poi_img_selector").remove();
                        $cur.parents('.item_spot').find('.description').val(res.data.introduction);
                        $cur.parents('.spot_selector_wrap').find('img.spot_pic_url').attr("src",res.data.picUrlDefault);
                    }
                });
            }
        });
    }

    //bind city confirm click
    function bindCityConfirmClick(){
        wrapper.on('click','.btn_add_city_confirm',function(){
            var $select_city_option = $(this).parents(".wrapper_add_city").find(".selected_city_input");
            var add_city_id = $select_city_option.attr("city_id");
            var add_city_name = $select_city_option.attr("city_name") || $select_city_option.val();
            if(add_city_name) {
                var add_city_info = {
                    "city_id": add_city_id,
                    "city_name": add_city_name,
                    "transport_type":""
                };
                var htmlOneCityWrap = template('T-One-City', add_city_info);
                $(this).parents(".day_city_top").find(".btn_add_city").parent('li').before(htmlOneCityWrap);
                $(this).parents(".day_city_top").find(".city_transport_selector").show();
                $(this).parents(".day_city_top").find(".city_transport_selector:last").hide(); //�������һ����ͨ��ʶ
                $(this).parents(".day_city_top").find(".wrapper_add_city").hide();
                //json�仯
                var day_index = parseInt($(this).parents(".day_top_wrap").attr("day_index"))-1;
                var city_cnt = sch_json.sch_days[day_index].day_citys.length;
                sch_json.sch_days[day_index].day_citys[city_cnt] = add_city_info;
                saveSchOut();
                renderDays();
            }else{
                alert("�������������");
            }
            return false;
        });
    }

    //ɾ������
    function delCity(){
        wrapper.on('click','.btn_del_city',function(){
            if(confirm("ȷ��Ҫɾ���˳���ô��")) {
                //��ȡ����
                var day_index = parseInt($(this).parents(".day_top_wrap").attr("day_index")) - 1;
                var city_id = parseInt($(this).parents(".day_city").attr("city_id"));
                //�����б�
                $(this).parents(".day_city").remove();
                //ɾ����Ӧ��json�������city
                var day_city_json = sch_json.sch_days[day_index].day_citys;
                var del_day_city_index = 0;
                for (var i = 0; i < day_city_json.length; i++) {
                    if (day_city_json[i].city_id == city_id) {
                        del_day_city_index = i;
                        break;
                    }
                }
                sch_json.sch_days[day_index].day_citys.splice(del_day_city_index, 1);
                sch_json.sch_days[day_index].day_citys[sch_json.sch_days[day_index].day_citys.length-1].transport_type = '';
                $(this).parents(".day_city_top").find(".city_transport_selector:last").hide(); //�������һ����ͨ��ʶ
                saveSchOut();
                renderDays();
            }
        });
    }

    //�л����еĽ�ͨ��ʽ
    function changeCityTransport(){
        wrapper.on("change",".city_transport_selector",function(){
            var cur_day_index = $(this).parents(".day_top_wrap").attr("day_index")-1; //����ţ���0��ʼ
            var cur_city_index = $(this).parents(".day_city_list").find(".day_city").index($(this).parents(".day_city")); //������ţ���0��ʼ
            sch_json.sch_days[cur_day_index].day_citys[cur_city_index].transport_type = $(this).val();
            saveSchOut();
        })
    }

    //ɾ���ճ̰�����
    function delItem(){
        wrapper.on('click','.btn_item_delete',function(){
            if(confirm("ȷ��Ҫɾ�����ճ̰�����ô��")) {
                //��ȡ����
                var day_index = parseInt($(this).parents(".day_top_wrap").attr("day_index")) - 1;
                //��ȡ��Ӧ��itemIndex
                var del_item_index = parseInt($(this).parents(".item_top_wrap").attr("item_index")) - 1;
                //ɾ��dom
                $(this).parents('.item_top_wrap').remove();
                //ɾ����Ӧ��json����
                sch_json.sch_days[day_index].sch_items.splice(del_item_index, 1);
                reIndexItems(day_index);
                saveSchOut();
            }
        });
    }


    //���������ճ̰�����
    function moveItems(){
        wrapper.on("click",".btn_move_item_up,.btn_move_item_down",function(){
            var curDayIndex = parseInt($(this).parents(".day_top_wrap").attr("day_index"));
            var $curDayWrapper = $(this).parents(".day_top_wrap");
            var itemIndex = parseInt($(this).parents(".item_top_wrap").attr("item_index"));
            var targetItemIndex = itemIndex - 1;
            var upDownFlag = "up";
            var curBiggerItemIndex = itemIndex;
            var curSmallerItemIndex = targetItemIndex;
            if($(this).hasClass("btn_move_item_down")){
                upDownFlag = "down";
                targetItemIndex = itemIndex + 1;
                curBiggerItemIndex = targetItemIndex;
                curSmallerItemIndex = itemIndex;
            }

            if(upDownFlag == "up" && itemIndex==1){
                showSchMsg("�Ѿ��ǵ�һ����",1);
                return false;
            }
            if(upDownFlag == "down" && itemIndex == sch_json.sch_days[curDayIndex - 1].sch_items.length){
                showSchMsg("�Ѿ������һ����",1);
                return false;
            }

            //json����
            var tmpItemJson = sch_json.sch_days[curDayIndex - 1].sch_items[itemIndex-1];
            sch_json.sch_days[curDayIndex - 1].sch_items[itemIndex-1] = sch_json.sch_days[curDayIndex - 1].sch_items[targetItemIndex-1];
            sch_json.sch_days[curDayIndex - 1].sch_items[targetItemIndex-1] = tmpItemJson;

            //dom����
            if(curSmallerItemIndex == 1){
                $curDayWrapper.find(".item_top_wrap:eq(" + curBiggerItemIndex + ")").detach().insertAfter($curDayWrapper.find(".day_city_top"));
            }else{
                $curDayWrapper.find(".item_top_wrap:eq(" + curBiggerItemIndex + ")").detach().insertBefore($curDayWrapper.find(".item_top_wrap:eq(" + curSmallerItemIndex + ")"));
            }
            showSchMsg("�ƶ��ɹ���",1);

            reIndexItems(curDayIndex-1);
            saveSchOut();

            /* scrollTop �ѿ���
             $(".sch_content_top",wrapper).animate( {
             scrollTop: $curDayWrapper.find(".item_top_wrap:eq(" + targetItemIndex + ") .panel-heading").position().top + wrapper.scrollTop()
             }, 600);
             */
        });
    }

    //�����ƶ�����
    function moveCitys(){
        wrapper.on("click",".btn_move_city_up,.btn_move_city_down",function(){
            var curDayIndex = parseInt($(this).parents(".day_top_wrap").attr("day_index"));
            var $curDayWrapper = $(this).parents(".day_top_wrap");
            var cityIndex = parseInt($(this).parents(".day_city_top ul").find("li.day_city").index($(this).parents("li.day_city")));
            var targetCityIndex = cityIndex - 1;
            var upDownFlag = "up";
            var curBiggerCityIndex = cityIndex;
            var curSmallerCityIndex = targetCityIndex;
            if($(this).hasClass("btn_move_city_down")){
                upDownFlag = "down";
                targetCityIndex = cityIndex + 1;
                curBiggerCityIndex = targetCityIndex;
                curSmallerCityIndex = cityIndex;
            }

            if(upDownFlag == "up" && cityIndex==0){
                showSchMsg("�Ѿ��ǵ�һ��������",1);
                return false;
            }
            if(upDownFlag == "down" && cityIndex+1 == sch_json.sch_days[curDayIndex - 1].day_citys.length){
                showSchMsg("�Ѿ������һ��������",1);
                return false;
            }

            //json����
            var tmpCityJson = sch_json.sch_days[curDayIndex-1].day_citys[cityIndex];
            sch_json.sch_days[curDayIndex-1].day_citys[cityIndex] = sch_json.sch_days[curDayIndex-1].day_citys[targetCityIndex];
            sch_json.sch_days[curDayIndex-1].day_citys[targetCityIndex] = tmpCityJson;

            //dom����
            if(curSmallerCityIndex == 0){
                $curDayWrapper.find(".day_city:eq(" + curBiggerCityIndex + ")").detach().prependTo($curDayWrapper.find(".drag_city_wrap ul.day_city_list"));
            }else{
                $curDayWrapper.find(".day_city:eq(" + curBiggerCityIndex + ")").detach().insertBefore($curDayWrapper.find(".day_city:eq(" + curSmallerCityIndex + ")"));
            }
            //����ͨѡ�����ʾ�������ݵ�
            $curDayWrapper.find(".city_transport_selector").show();
            $curDayWrapper.find(".city_transport_selector:last").hide();
            sch_json.sch_days[curDayIndex-1].day_citys[sch_json.sch_days[curDayIndex-1].day_citys.length-1].transport_type = '';
            showSchMsg("�ƶ��ɹ���",1);
            renderDays();
            saveSchOut();
        });
    }

    //�༭�ճ̰�����
    function editItem(){
        wrapper.on('click','.btn_item_edit',function(){
            var $itemWrap = $(this).parents(".item_top_wrap");
            if( $itemWrap.hasClass("readonly") ) {
                $itemWrap.removeClass("readonly");
                $itemWrap.find("input,textarea").attr("readonly",false);
                $itemWrap.find("select").removeAttr('disabled');
                $itemWrap.find(".transport_type_selected").removeClass("disabled")
            }
        });
    }

    //����Item
    function saveItem(){
        wrapper.on('click','.btn_save_item',function(){
            var $itemWrap = $(this).parents(".item_top_wrap");
            if( !$itemWrap.hasClass("readonly") ) {
                var itemType = $itemWrap.attr("item_type");
                var itemIndex = parseInt( $itemWrap.attr("item_index") );
                var dayIndex = parseInt( $(this).parents(".day_top_wrap").attr("day_index"));
                var item_new = {};
                item_new.item_type = itemType;
                item_new.item_index = itemIndex;
                if( $.inArray(itemType,['activity','catering','accommodation','tip','shopping'])!==-1 ){
                    //��ʿ����Ҫʱ��
                    if(itemType!='tip') {
                        item_new.begin_time = $itemWrap.find(".begin_time_h option:selected").val() + ":" + $itemWrap.find(".begin_time_m option:selected").val();
                        item_new.end_time = $itemWrap.find(".end_time_h option:selected").val() + ":" + $itemWrap.find(".end_time_m option:selected").val();
                        item_new.time_desc = $itemWrap.find(".time_desc").val();
                    }
                    //�������Ϣ
                    if(itemType=="shopping"){
                        item_new.shop_info = [];
                        $itemWrap.find(".one_shop").each(function(index,ele){
                            item_new.shop_info[index] = {
                                "shop_name": $(this).find(".shop_name").val(),
                                "business_product": $(this).find(".business_product").val(),
                                "wait_time": $(this).find(".wait_time").val(),
                                "description": $(this).find(".description").val()
                            }
                        });
                    }
                    item_new.title = $itemWrap.find(".sch_title").val();
                    item_new.content = $itemWrap.find(".sch_content").val();
                }else if(itemType=="spot"){
                    item_new.begin_time = $itemWrap.find(".begin_time_h option:selected").val()+":"+$itemWrap.find(".begin_time_m option:selected").val();
                    item_new.end_time = $itemWrap.find(".end_time_h  option:selected").val()+":"+$itemWrap.find(".end_time_m  option:selected").val();
                    item_new.time_desc = $itemWrap.find(".time_desc").val();
                    item_new.spot_name = $itemWrap.find(".spot_name").val();
                    item_new.spot_id = $itemWrap.find(".spot_name").attr("spot_id");
                    item_new.spot_pic_url = $itemWrap.find(".spot_pic_url").attr("src");
                    item_new.price = $itemWrap.find(".price").val();
                    item_new.currency = $itemWrap.find(".currency").val();
                    item_new.description = $itemWrap.find(".description").val();
                    item_new.extra_description = $itemWrap.find(".extra_description").val();
                }else if(itemType=="transport"){
                    item_new.depart_time = $itemWrap.find(".depart_time_h option:selected").val()+":"+$itemWrap.find(".depart_time_m option:selected").val();
                    item_new.arrival_time = $itemWrap.find(".arrival_time_h option:selected").val()+":"+$itemWrap.find(".arrival_time_m option:selected").val();
                    item_new.time_desc = $itemWrap.find(".time_desc").val();
                    item_new.arrival_days = $itemWrap.find(".arrival_days").val();
                    item_new.depart_city = $itemWrap.find(".depart_city").val();
                    item_new.arrival_city = $itemWrap.find(".arrival_city").val();
                    item_new.transfer_city = $itemWrap.find(".transfer_city").val();
                    item_new.transport_type = $itemWrap.find(".transport_type_selected").attr("transport_type");
                    item_new.transport_no = $itemWrap.find(".transport_no").val();
                    item_new.notes = $itemWrap.find(".sch_content").val();
                    // ȫ������ - ȡ����֤����
                    // if (!item_new.depart_city || !item_new.arrival_city) {
                    //    alert("��¼��������к͵������");
                    //    return;
                    //}
                }else{
                    return;
                }
                //��֮ͨ������ͼ��
                if(itemType!="transport"){
                    item_new.pic_text_info = [];
                    $itemWrap.find(".one_rich_text").each(function(index,ele){
                        item_new.pic_text_info[index] = {
                            "pic_url": $(this).find(".pic_url").attr("src"),
                            "pic_title": $(this).find(".pic_title").val()
                            //"pic_desc": $(this).find(".pic_desc").val()
                        }
                    });
                }
                sch_json.sch_days[dayIndex-1].sch_items[itemIndex-1]=item_new;
                saveSchOut();
                $itemWrap.addClass("readonly");
                $itemWrap.find("input,textarea").attr("readonly",true);
                $itemWrap.find("select").attr("disabled","disabled");
                $itemWrap.find(".transport_type_selected").removeClass("disabled").addClass("disabled");
                if(itemType=="spot"){
                    $itemWrap.find(".poi_img_selector").remove();
                }
            }
            return false;
        });
    }

    //item�л�����������
    function changeItemDay(){
        //��ʾ�ǵ�ǰ��list
        wrapper.on("mouseenter",".btn_item_change_day",function(){
            $(this).siblings(".dropdown-menu").find("li.item_select_day").remove();
            var dayIndex = parseInt($(this).parents(".day_top_wrap").attr("day_index"))-1;
            var cntDay = sch_json.sch_days.length;
            if(cntDay>1){
                var moveDayListDom = "";
                for(var i=1;i<=cntDay;i++){
                    if((i-1)!=dayIndex) {
                        moveDayListDom += '<li class="item_select_day"><a href="javascript:;" class="item_move_day" target_day_index="' + i + '">&nbsp;��' + i + '��</a></li>';
                    }
                }
                $(this).siblings(".dropdown-menu").append(moveDayListDom);
            }
        });

        //����ƶ���ĳ��
        wrapper.on("click",".item_move_day",function(){
            if(confirm("ȷ��Ҫ����Ŀ�ƶ�����һ�죿")) {
                var itemIndex = parseInt($(this).parents(".item_top_wrap").attr("item_index")) -1;
                var fromDayIndex = parseInt($(this).parents(".day_top_wrap").attr("day_index")) - 1;
                var toDayIndex = parseInt($(this).attr("target_day_index")) - 1;
                $(this).parents(".item_top_wrap").detach().appendTo($(".day_top_wrap:eq(" + toDayIndex + ") .day_content"));
                //sch_json�仯
                var tmp_item_json = sch_json.sch_days[fromDayIndex].sch_items[itemIndex];
                sch_json.sch_days[toDayIndex].sch_items.push(tmp_item_json);
                sch_json.sch_days[fromDayIndex].sch_items.splice(itemIndex, 1);

                reIndexItems(fromDayIndex);
                reIndexItems(toDayIndex);
                saveSchOut();
            }
        });
    }

    //�����Զ����ϴ�ͼƬ
    function uploadSpotPic(){
        wrapper.on("change",".btn_file",function(e){
            var $cur = $(this);
            var file = $(e.target)[0].files[0];
            if (file){
                var fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
                if (!fileExtension.match(/.jpg|.gif|.png|.bmp|.jpeg/i)){
                    alert("��ѡ����ļ�����ͼƬ��������ѡ��");
                    $(e.target).val("");
                    return;
                }else if((file.fileSize || file.size) > (parseInt(1024) * 10240)){
                    alert("��ѡ���ͼƬ�ļ���С����10M,�뽵��ͼƬ����������!");
                    $(e.target).val("");
                    return;
                }else if(typeof FileReader !== 'undefined'){
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function(){
                        var imgBase64 = this.result;
                        //$cur.siblings('img').attr("src",imgBase64); //ע�� ��ֹbase64 д��json
                        //�ϴ���������
                        $.ajax({
                            url: schAjaxHost+"/schedule/scheduleAjax/uploadPic/",
                            data: {
                                //'img': encodeURIComponent(imgBase64.split(',')[1])
                                'img': imgBase64.split(',')[1]
                            },
                            type: "POST",
                            dataType: "json",
                            beforeSend: function( xhr ) {
                                showSchMsg("ͼƬ�ϴ���...");
                            },
                            success: function (res) {
                                var pic_url = "http://img2.tuniucdn.com/site/file/deyonUserCenter/images/nomarl.jpg";
                                if(res) {
                                    var pic_url = res.url;
                                }
                                $cur.siblings('img').attr("src",pic_url);
                                showSchMsg("�ϴ��ɹ�",2);
                            }
                        });
                    }
                }else{
                    showSchMsg("�����������֧��FileReader,��ʹ��chrome,firefox���ִ��������");
                }
            }
        });
        wrapper.on("click",".btn_select_pic",function(){
            $(this).parents(".item_top_wrap").find(".poi_img_selector").remove();
            var $cur = $(this);
            var spot_id = parseInt($(this).parents(".item_top_wrap").find(".selected_spot_input").attr("spot_id"));
            if(spot_id && spot_id>0){
                $.ajax({
                    url: schAjaxHost+"/schedule/scheduleAjax/getAllSpotImgs/",
                    data: {
                        'spot_id':spot_id
                    },
                    type: "GET",
                    dataType: "json",
                    beforeSend: function( xhr ) {
                        showSchMsg("��ȡͼƬ��...");
                    },
                    success: function (res) {
                        var obj = {};
                        obj.poi_imgs = res.data;
                        var htmlPicSelect = template('T-Spot-Pic-Select',obj);
                        $cur.parents(".one_rich_text").css("height","auto").prepend(htmlPicSelect);
                        showSchMsg("��ȡ�ɹ�",1);
                    }
                });
            }else{
                showSchMsg("����ѡ�񾰵�",1);
            }
        });
        wrapper.on("click",".poi_img_wrap",function(){
            var img_url = $(this).find("img").attr("src");
            $(this).parents(".one_rich_text").find(".pic_url").attr("src",img_url);
            $(this).parents(".poi_img_selector").remove();
            $(this).parents(".one_rich_text").css("height","70px");
        });
        wrapper.on("click",".btn_close_img_selector",function(){
            $(this).parents(".poi_img_selector").remove();
            $(this).parents(".one_rich_text").css("height","70px");
        });
    }

    //�����ճ̰�����
    function addItem(){
        wrapper.on('click','.btn_add_item', function () {
            //��ȡ����
            var day_index = parseInt($(this).parents(".day_top_wrap").attr("day_index")) - 1;
            //��ȡ��Ӧ��itemIndex
            var cur_item_index = parseInt($(this).parents(".item_top_wrap").attr("item_index")) - 1;
            var add_item_type = $(this).attr("item_type");
            var item_empty = getEmptyJson(add_item_type);
            //var item_empty = JSON.parse( JSON.stringify(getEmptyJson(add_item_type)) );
            sch_json.sch_days[day_index].sch_items.splice(cur_item_index+1,0,item_empty);
            item_empty = JSON.parse( JSON.stringify(item_empty) );
            item_empty.itemTypeName = getItemTypeName(add_item_type);
            item_empty.globalCfgVars = schGlobalCfgVars;

            if( $.inArray(add_item_type,['activity','catering','accommodation','tip','shopping'])!==-1 ){
                var htmlContentSimple = template('T-Content-Simple',item_empty);
                $(this).parents(".item_top_wrap").after(htmlContentSimple);
            }else if(add_item_type == 'spot'){
                var htmlContentSpot = template('T-Content-Spot',item_empty);
                $(this).parents(".item_top_wrap").after(htmlContentSpot);
                //����ѡ����
                spot_selector();
            }else if(add_item_type == 'transport'){
                var htmlContentTransport = template('T-Content-Transport',item_empty);
                $(this).parents(".item_top_wrap").after(htmlContentTransport);
                //��ͨ����ѡ��
                transportSelector();
                city_selector();
            }

            reIndexItems(day_index);
            saveSchOut();
        });
    }

    //��������ĳ���item
    function reIndexItems(dayIndex) {
        $(".day_top_wrap:eq(" + dayIndex + ")").find(".item_top_wrap").each(function (index) {
            $(this).attr("item_index", index);
        });

        $.each(sch_json.sch_days[dayIndex].sch_items, function (i) {
            sch_json.sch_days[dayIndex].sch_items[i].item_index = i + 1;
        });
    }

    //���ͼ����
    function addPicText(){
        wrapper.on("click",".btn_add_pic_text",function(){
            var pic_text_empty = getEmptyJson("pic_text");
            var htmlContentPicText = template('T-One-Pic-Text',pic_text_empty);
            if($(this).hasClass("first")){
                $(this).after(htmlContentPicText);
            }else {
                $(this).parents(".one_rich_text").after(htmlContentPicText);
            }
        });
    }

    //ɾ��ͨ��ͼ�ı༭��
    function delPicText(){
        wrapper.on("click",".btn_del_pic_text",function(){
            if(confirm("��ȷ��Ҫɾ����ͼ����ô��")){
                $(this).parents(".one_rich_text").remove();
            }
        });
    }

    //��ӹ����
    function addShop(){
        wrapper.on("click",".btn_add_shop",function(){
            var shop_empty = getEmptyJson("shop");
            var htmlContentShop = template('T-One-Shop',shop_empty);
            if($(this).hasClass("first")){
                $(this).parents(".shop_wrapper").find(".shop_title").after(htmlContentShop);
            }else {
                $(this).parents(".one_shop").after(htmlContentShop);
            }
        });
    }

    //ɾ�������
    function delShop(){
        wrapper.on("click",".btn_del_shop",function(){
            if(confirm("��ȷ��Ҫɾ���˹����ô��")){
                $(this).parents(".one_shop").remove();
            }
        });
    }

    function getEmptyJson(type){
        var json_empty = null;
        if( $.inArray(type,['activity','catering','accommodation','tip','shopping'])!==-1 ){
            json_empty = {
                "item_id":0,
                "item_index":1,
                "item_type":type,
                "title":"",
                "content":'',
                "pic_text_info":[]
            };
            //�������ӹ����
            if(type=="shopping"){
                json_empty.shop_info = [];
            }
            //��ʿ����Ҫʱ��
            if(type!="tip"){
                json_empty.begin_time="";
                json_empty.end_time="";
                json_empty.time_desc="";
            }
        }else if(type == 'spot'){
            json_empty = {
                "item_id":0,
                "item_index":1,
                "item_type":type,
                "begin_time":'',
                "end_time":'',
                "time_desc":'',
                "spot_id":0,
                "spot_name":'',
                "spot_pic_url":'',
                "price":'',
                "currency":'CNY',
                "description":'',
                "extra_description":''
            };
        }else if(type == 'transport'){
            json_empty = {
                "item_id":0,
                "item_index":1,
                "item_type":type,
                "depart_city":'',
                "arrival_city":'',
                "transfer_city":'',
                "transport_type":"train",
                "depart_time":'',
                "arrival_time":'',
                "time_desc":'',
                "arrival_days":0,
                "transport_no":'',
                "notes":''
            };
        }else if(type == 'day'){
            json_empty = {
                "day_citys":[],
                "sch_items":[]
            };
        }else if(type == "pic_text"){
            json_empty = {
                "pic_url":'',
                "pic_title":''
                //"pic_desc":''
            }
        }else if(type == "shop"){
            json_empty = {
                "shop_name":'',
                "business_product":'',
                "wait_time":'',
                "description":''
            }
        }
        return json_empty;
    }

    //��Ⱦ��ͨ
    function renderItemTransport(item_json,day_index,readEditClass){
        item_json.readEditClass = readEditClass || ""; //��orд
        item_json.globalCfgVars = schGlobalCfgVars;
        var htmlContentTransport = template('T-Content-Transport',item_json);
        var $dayWrap = $(".day_content:eq("+(day_index-1)+")",wrapper);
        $dayWrap.append(htmlContentTransport);
        if(readEditClass == "readonly"){
            $dayWrap.find(".item_top_wrap:last input,textarea").attr("readonly",true);
        }
        //��ͨ����ѡ��
        transportSelector();
    }

    //��Ⱦ����
    function renderItemSpot(item_json,day_index,readEditClass){
        item_json.readEditClass = readEditClass || ""; //��orд
        item_json.globalCfgVars = schGlobalCfgVars;
        var htmlContentSpot = template('T-Content-Spot',item_json);
        var $dayWrap = $(".day_content:eq("+(day_index-1)+")",wrapper);
        $dayWrap.append(htmlContentSpot);
        if(readEditClass == "readonly"){
            $dayWrap.find(".item_top_wrap:last input,textarea").attr("readonly",true);
            $dayWrap.find(".item_top_wrap:last select").attr('disabled', 'disabled');
        }
        //����ѡ����
        spot_selector();
    }

    //��Ⱦ�������ױ�׼ģ��
    function renderItemSimple(item_json,day_index,readEditClass){
        item_json.readEditClass = readEditClass || ""; //��orд
        item_json.itemTypeName = getItemTypeName(item_json.item_type);
        item_json.globalCfgVars = schGlobalCfgVars;
        var htmlContentSimple = template('T-Content-Simple',item_json);
        var $dayWrap = $(".day_content:eq("+(day_index-1)+")",wrapper);
        $dayWrap.append(htmlContentSimple);
        if(readEditClass == "readonly"){
            $dayWrap.find(".item_top_wrap:last input,textarea").attr("readonly",true);
        }
    }

    //��ͨ����ѡ��
    function transportSelector(){
        //��ͨ����ѡ��
        wrapper.on("click",".transport_icon_selector a.selected",function(){
            if($(this).hasClass("disabled")){
                return false;
            }else{
                $(this).siblings(".transport_icon_options").show();
            }
        });
        wrapper.on("click",".transport_icon_options a",function(){
            var icon_src = $(this).find('img').attr("src");
            var transport_type = $(this).attr("transport_type");
            var $target_selected = $(this).parents(".transport_icon_selector").find("a.selected");
            $target_selected.attr("transport_type",transport_type);
            $target_selected.find("img").attr("src",icon_src);
            $(this).parents(".transport_icon_options").hide();
        });
    }

    //�����϶����� ����ʱ�����ã�
    function enableDragSort(){
        //������ק
        $(".wrap_days",wrapper).dragsort({ dragSelector: "li.sch_day", dragSelectorExclude:"button,ul,ul.btn-group li",dragEnd: function() {
            //if(draggingFlag == false) {
            //draggingFlag = true;
            var chgSortDays = [];
            $(".sch_day", wrapper).each(function (index, element) {
                if (parseInt($(this).attr("target_day_index")) != (index + 1)) {
                    chgSortDays.push(index + 1);
                }
            });
            if(chgSortDays.length == 2){
                var swapDayIndexA = parseInt(chgSortDays[0])-1;
                var swapDayIndexB = parseInt(chgSortDays[1])-1;
                var tmpDayJson = sch_json.sch_days[swapDayIndexB];
                sch_json.sch_days[swapDayIndexB] = sch_json.sch_days[swapDayIndexA];
                sch_json.sch_days[swapDayIndexA] = tmpDayJson;
                sch_json.sch_days[swapDayIndexB].day_index = swapDayIndexA+1;
                sch_json.sch_days[swapDayIndexA].day_index = swapDayIndexB+1;
                initLoad(wrapper, {sch_id: sch_id, sch_obj: sch_json, sch_out: $sch_out});
            }
            //draggingFlag = false;
            //}
        }, dragBetween: false, placeHolderTemplate: "<li></li>" });
    }

    //ת��itemType��Ӧ����Ŀ��
    function getItemTypeName(item_type){
        var itemTypeName = '';
        switch(item_type){
            case "spot":
                itemTypeName = "����";
                break;
            case "transport":
                itemTypeName = "��ͨ";
                break;
            case "catering":
                itemTypeName = "�ò�";
                break;
            case "accommodation":
                itemTypeName = "ס��";
                break;
            case "tip":
                itemTypeName = "��ʿ";
                break;
            case "shopping":
                itemTypeName = "����";
                break;
            case "activity":
                itemTypeName = "�";
                break;
            default:
                itemTypeName = "δ֪";
                break;
        }
        return itemTypeName;
    }

    //��洢��ǰ�汾
    function saveSchVer(){
        wrapper.on('click','.btn_save_sch', function () {
            schSaveFlag = true;
            setLocalStorage(LsKey,sch_json);
            showSchMsg("����ɹ���",2);
            return false;
        });
    }

    //�ָ���֮ǰ�洢�İ汾
    function revertSch(){
        wrapper.on('click','.btn_revert_sch', function () {
            if(schSaveFlag){
                sch_json = getLocalStorage(LsKey);
                clearLocalStorage(LsKey);
                schSaveFlag = false;
                initLoad(wrapper, {sch_id: sch_id, sch_obj: sch_json, sch_out:$sch_out, sch_out_old:$sch_out_old, sch_out_html:$sch_out_html});
                showSchMsg("�ع��ɹ���",2);
                return false;
            }else{
                showSchMsg("����û�и���ı���汾��",2);
                return false;
            }
        });
    }

    //Ԥ��sch_json
    function previewSch(){
        wrapper.on("click",".btn_preview_sch",function(){
            //��������
            $(".item_top_wrap",wrapper).not(".readonly").find(".btn_save_item").trigger("click");
            //
            if($(".sch_content_top",wrapper).is(":visible")) {
                $(".sch_content_top", wrapper).hide();
                $(".sch_days_list", wrapper).hide();
                var sch_json_obj = {
                    "sch_json": JSON.stringify(sch_json, null, 4),
                    "sch_json_old": JSON.stringify(oldFormat(sch_json), null, 4),
                    "sch_json_obj":sch_json
                };
                var htmlPreview = template('T-Preview', sch_json_obj);
                $(".sch_preview", wrapper).remove();
                $(".sch_content_top", wrapper).after(htmlPreview);

                //���浽BOSS DB
                if( typeof(save_schedule3) == "function" ){
                    save_schedule3();
                }
                return false;
            }else{
                $(".sch_preview", wrapper).remove();
                $(".sch_days_list", wrapper).show();
                $(".sch_content_top", wrapper).show();
            }
        });
        //tab�л�
        wrapper.on("click",".btn_preview_new,.btn_preview_old,.btn_preview_html,.btn_preview_web",function(){
            $(this).siblings("li").removeClass("active");
            $(this).addClass("active");

            $(this).parents(".sch_preview").find("pre,.html_preview,.web_preview").hide();
            if($(this).hasClass("btn_preview_new")) {
                $(this).parents(".sch_preview").find(".json_preview_new").show();
            }else if($(this).hasClass("btn_preview_old")) {
                $(this).parents(".sch_preview").find(".json_preview_old").show();
            }else if($(this).hasClass("btn_preview_html")) {
                $(this).parents(".sch_preview").find(".html_preview").show();
            }else if($(this).hasClass("btn_preview_web")) {
                $(this).parents(".sch_preview").find(".web_preview").show();
            }
        });
        //���ر༭
        wrapper.on("click",".btn_preview_close",function(){
            $(".btn_preview_sch",wrapper).trigger("click");
        });
    }

    //ȫ������
    function saveAllSch(){
        wrapper.on("click",".btn_save_all",function(){
            //trigger all save button
            $(".item_top_wrap",wrapper).not(".readonly").find(".btn_save_item").trigger("click");
            showSchMsg("ȫ������ɹ���",1);

            //���浽BOSS DB
            if( typeof(save_schedule3) == "function" ){
                save_schedule3();
            }
        });
    }

    //չʾ��Ϣ
    function showSchMsg(msg_text,close_seconds){
        $(".sch_msg_box .sch_msg_text",wrapper).text(msg_text);
        $(".sch_msg_box",wrapper).show();
        if(close_seconds && parseInt(close_seconds*1000)>0){
            window.setTimeout(function(){
                hideSchMsg();
            },parseInt(close_seconds *1000));
        }
    }

    //������Ϣ
    function hideSchMsg(){
        $(".sch_msg_box",wrapper).hide();
    }

    //�洢sch_json��localStorage��hidden input
    function saveSchOut(){
        //setLocalStorage(LsKey,sch_json);
        $sch_out.val(JSON.stringify(sch_json));
        $sch_out_old.val(JSON.stringify(oldFormat(sch_json)));
        $sch_out_html.val(htmlFormat(sch_json));
    }

    //ת���ɾɸ�ʽ
    function oldFormat(json){
        var json_old = [];
        if(json.sch_days && json.sch_days.length>0){
            var dayLength = json.sch_days.length;
            for(var i=0;i<dayLength; i++){
                var sch_day = json.sch_days[i];
                var json_day_old = {
                    "day":"",
                    "title":"",
                    "summary":[],
                    "eat1":"���г�����Ϊ׼",
                    "eat2":"���г�����Ϊ׼",
                    "eat3":"���г�����Ϊ׼",
                    //"eat_content":"",
                    "live":"",
                    shop:[],
                    times_info:[]
                };
                json_day_old["day"] = (i+1).toString();
                //����
                json_day_old["title"] = '';
                var cityLength = sch_day.day_citys.length;
                if(cityLength>0){
                    for(var j=0;j<cityLength; j++){
                        json_day_old["title"]+=sch_day.day_citys[j].city_name;
                        if(j!=cityLength-1){
                            if(sch_day.day_citys[j].transport_type){
                                if(sch_day.day_citys[j].transport_type=="train") {
                                    json_day_old["title"] += '<img src="http://img.tuniucdn.com/icons/route/train.gif">';
                                }else if(sch_day.day_citys[j].transport_type=="plain"){
                                    json_day_old["title"] += '<img src="http://img.tuniucdn.com/icons/route/plain.gif">';
                                }else if(sch_day.day_citys[j].transport_type=="bus" || sch_day.day_citys[j].transport_type=="car"){
                                    json_day_old["title"] += '<img src="http://img.tuniucdn.com/icons/route/bus.gif">';
                                }else if(sch_day.day_citys[j].transport_type=="ship"){
                                    json_day_old["title"] += '<img src="http://img.tuniucdn.com/icons/route/ship.gif">';
                                }else{
                                    json_day_old["title"]+="-";
                                }
                            }else{
                                json_day_old["title"]+="-";
                            }
                        }
                    }
                }
                //����
                var itemLength = sch_day.sch_items.length;
                if(itemLength>0){
                    var eatIndex = 1;
                    for(var k=0;k<itemLength; k++){
                        var itemThis = sch_day.sch_items[k];
                        var itemTypeThis = itemThis.item_type;
                        /*
                         //�����ʳ
                         if(itemTypeThis == "catering"){

                         if(eatIndex==1){
                         json_day_old.eat1 = '<span class="po_dining_diy">' + itemThis.content + '</span> ';
                         json_day_old.eat_content += ("��ͣ�" + itemThis.content + " ");
                         }else if(eatIndex==2){
                         json_day_old.eat2 = '<span class="po_dining_diy">' + itemThis.content + '</span> ';
                         json_day_old.eat_content += ("��ͣ�" + itemThis.content + " ");
                         }else if(eatIndex==3){
                         json_day_old.eat3 = '<span class="po_dining_diy">' + itemThis.content + '</span> ';
                         json_day_old.eat_content += ("��ͣ�" + itemThis.content + " ");
                         }else {
                         json_day_old.eat_content += ("������" + itemThis.content + " ");
                         }

                         json_day_old.eat_content += (itemThis.title||"") + " " + itemThis.content + " ";
                         eatIndex++;
                         }
                         //����ס��
                         else
                         */
                        if(itemTypeThis == "accommodation"){
                            json_day_old.live += itemThis.title + " " + itemThis.content + " ";
                        }
                        //������
                        else if(itemTypeThis == "shopping"){
                            if(itemThis.shop_info.length>0){
                                for(var jj=0;jj<itemThis.shop_info.length;jj++){
                                    var shopThis = itemThis.shop_info[jj];
                                    json_day_old.shop[jj] = {
                                        "shop_name": shopThis.shop_name,
                                        "main_bussiness_product": shopThis.business_product,
                                        "added_bussiness_product": "",
                                        "wait_time": shopThis.wait_time,
                                        "description": shopThis.description
                                    };
                                }
                            }
                            //�������� + ˵�� ����time_do
                            var itemTypeNameThis = getItemTypeName(itemTypeThis);
                            var time_info_this = {
                                "time_num":"",
                                "time_desc":"",
                                "time_do":[]
                            };
                            var timeDoLength = 0;
                            if(itemThis.begin_time!="" && itemThis.begin_time!=":"){
                                time_info_this.time_num = itemThis.begin_time;
                            }else{
                                time_info_this.time_num = itemThis.time_desc;
                            }
                            time_info_this.time_do.push({
                                "time_detial_title": itemThis.title || itemTypeNameThis
                            });

                            if(itemThis.content && itemThis.content!=""){
                                time_info_this.time_do.push({
                                    "time_detail_desc":itemThis.content
                                });
                            }
                            json_day_old.times_info.push(time_info_this);

                        }
                        //�������� (����òͣ�ס��  && ����)
                        else if($.inArray(itemTypeThis,['activity','tip','spot','catering'])!==-1){
                            var itemTypeNameThis = getItemTypeName(itemTypeThis);
                            var time_info_this = {
                                "time_num":"",
                                "time_desc":"",
                                "time_do":[]
                            };
                            var timeDoLength = 0;
                            if(itemThis.begin_time!="" && itemThis.begin_time!=":"){
                                time_info_this.time_num = itemThis.begin_time;
                            }else{
                                time_info_this.time_num = itemThis.time_desc;
                            }
                            if(itemTypeThis == "spot"){

                                if(itemThis.spot_name && itemThis.spot_name!=''){
                                    time_info_this.time_do.push({
                                        "time_detial_title":itemThis.spot_name
                                    });
                                }

                                if(itemThis.description && itemThis.description!=''){
                                    time_info_this.time_do.push({
                                        "time_detail_desc":itemThis.description +" " + itemThis.extra_description
                                    });
                                }

                                if(itemThis.pic_text_info && itemThis.pic_text_info.length>0){
                                    var detail_photo = [];
                                    for(var m=0;m<itemThis.pic_text_info.length;m++){
                                        detail_photo.push({
                                            "name":itemThis.pic_text_info[m].pic_title,
                                            "path":itemThis.pic_text_info[m].pic_url
                                        });

                                    }
                                    time_info_this.time_do.push({
                                        "time_detail_photo":detail_photo
                                    });
                                }
                            }else{
                                //time_info_this.time_desc = itemThis.content;
                                if(itemTypeThis == "catering"){
                                    if(itemThis.title && itemThis.title!="" && itemThis.content && itemThis.content!=""){
                                        time_info_this.time_do.push({
                                            "time_detial_title": itemThis.title
                                        });
                                        time_info_this.time_do.push({
                                            "time_detail_desc": itemThis.content
                                        });
                                    }else{
                                        time_info_this.time_do.push({
                                            "time_detial_title": "��ʳ��Ϣ"
                                        });
                                        time_info_this.time_do.push({
                                            "time_detail_desc": itemThis.title
                                        });
                                    }
                                }else {
                                    time_info_this.time_do.push({
                                        "time_detial_title": itemThis.title || itemTypeNameThis
                                    });

                                    if(itemThis.content && itemThis.content!=""){
                                        time_info_this.time_do.push({
                                            "time_detail_desc":itemThis.content
                                        });
                                    }
                                }

                                if(itemThis.pic_text_info && itemThis.pic_text_info.length>0){
                                    var detail_photo = [];
                                    for(var m=0;m<itemThis.pic_text_info.length;m++){
                                        detail_photo.push({
                                            "name":itemThis.pic_text_info[m].pic_title,
                                            "path":itemThis.pic_text_info[m].pic_url
                                        });
                                    }
                                    time_info_this.time_do.push({
                                        "time_detail_photo":detail_photo
                                    });
                                }
                            }
                            timeDoLength++

                            json_day_old.times_info.push(time_info_this);
                        }
                    }
                }

                json_old[i] = json_day_old;
            }
        }
        showSchMsg("���ݴ�����...",0.2);
        return json_old;
    }

    //ת����html
    function htmlFormat(json){
        var htmlSchOut = template('T-Preview-Web',json);
        return htmlSchOut;
    }

    //���ñ�����洢
    function setLocalStorage(key,val){
        try{
            if (!localStorage){
                showSchMsg("����ʹ�õ��������δ֧�ֱ��ش洢����ʹ��chorme���������");
                return;
            }
            localStorage.setItem(key,JSON.stringify(val));
        }catch(e){
            console.log(e);
        }
    }

    //��ȡ������洢
    function getLocalStorage(key){
        try{
            if (!localStorage){
                showSchMsg("����ʹ�õ��������δ֧�ֱ��ش洢����ʹ��chorme���������");
                return;
            }
        }catch(e){
            console.log(e);
        }
        return JSON.parse(localStorage.getItem(key));
    }

    //���������洢
    function clearLocalStorage(key){
        try{
            if(localStorage.getItem(key))
                localStorage.removeItem(key);
        }catch(e){
            console.log(e);
        }
    }

    $(window).unload(function(){
        clearLocalStorage(LsKey);
    });

    //������ת&�۵���Ч��
    function addEffects(){
        wrapper.on("click",".day_banner",function(){
            var $targetContent = $(this).siblings(".day_content");
            $targetContent.toggle();
        });
        wrapper.on("click",".text_left",function(){
            var targetDayIndex = parseInt( $(this).parents(".sch_day").attr("target_day_index") );
            $(".day_content").hide();
            $(".day_content:eq("+(targetDayIndex-1)+")").show();
            $(".sch_content_top",wrapper).animate( {
                scrollTop:$(".day_top_wrap:eq("+(targetDayIndex-1)+") .day_banner").position().top
            }, 600);
        });
        wrapper.on("click",".btn_unfold_all",function(){
            $(".day_content").show();
        });
        wrapper.on("click",".btn_fold_all",function(){
            $(".day_content").hide();
        });
    }

    //���� - ���json
    function debug_json(json){
        console.log(JSON.stringify(json,null,4));
    }

    //����۸�У��
    function price_valid(){
        wrapper.on("keyup",".price",function(){
            var price = $(this).val();
            var strLen = price.length;
            var re=/^(0|[1-9][0-9]{0,9})\.{0,1}(\d{1,2})?$/;
            if( '' != price && true != re.test(price) ){
                $(this).val(price.substr(0,strLen-1));
            }
        });
    }

})(jQuery);
