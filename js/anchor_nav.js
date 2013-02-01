$(document).ready(function(){
    var isMobile = {  //检测是否是移动设备
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        }
        ,BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        }
        ,iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        }
        ,Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        }
        ,Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        }
        ,any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    /**
    $('.post a').each(function(index,element){
        var href = $(this).attr('href');
        if(href){
            if(href.indexOf('#') == 0){
            }else if ( href.indexOf('/') == 0 || href.toLowerCase().indexOf('dolphinboy.me')>-1 ){
            }else if ($(element).has('img').length){
            }else{
                $(this).attr('target','_blank');
                $(this).addClass('external');
            }
        }
    });*/
    /**如果h2标签的个数大于5个并且不是手机设备则添加右侧导航栏*/
    if($('div.post h2').length > 5 && !isMobile.any()){
        var h2 = [],h3 = [],tmpl = '<ul>',h2index = 0;
        var findScrollableElement = function(els){  //搜索滚动节点
            for(var i = 0, argLength = arguments.length; i < argLength; i++){
                var el = arguments[i],
                $scrollElement = $(el);
                if($scrollElement.scrollTop() > 0){
                    return $scrollElement;
                }else{
                    $scrollElement.scrollTop(1);
                    var isScrollable = $scrollElement.scrollTop() > 0;
                    $scrollElement.scrollTop(0);
                    if(isScrollable){
                        return $scrollElement;
                    }
                }
            }
            return [];
        };

        $.each($('div.post h2,h3'),function(index,item){  //检测h2,h3节点，并实例化节点数据
            if(item.tagName.toLowerCase() == 'h2'){
                var h2item = {};
                h2item.name = $(item).text();
                h2item.id = 'anchorIndex'+index;
                h2.push(h2item);
                h2index++;
            }else{
                var h3item = {};
                h3item.name = $(item).text();
                h3item.id = 'anchorIndex'+index;
                if(!h3[h2index-1]){
                    h3[h2index-1] = [];
                }
                h3[h2index-1].push(h3item);
            }
            item.id = 'anchorIndex' + index
        });

        //添加h1
        tmpl += '<li class="h1"><a href="#" data-top="0">'+$('div.post h1').text()+'</a></li>';
         for(var i=0;i<h2.length;i++){
            tmpl += '<li><a href="#" data-id="'+h2[i].id+'">'+h2[i].name+'</a></li>';
            if(h3[i]){
                for(var j=0;j<h3[i].length;j++){
                    tmpl += '<li class="h3"><a href="#" data-id="'+h3[i][j].id+'">'+h3[i][j].name+'</a></li>';
                }
            }
        }
        tmpl += '</ul>';

        var $scrollable = findScrollableElement('body','html');
        $('body').append('<div id="anchorIndex"></div>');
        $('#anchorIndex').append($(tmpl)).delegate('a','click',function(e){  //根据节点数据生成相应的导航栏
            e.preventDefault();
            var scrollNum = $(this).attr('data-top') || $('#'+$(this).attr('data-id')).offset().top;
            //window.scrollTo(0,scrollNum-30);
            $scrollable.animate({ scrollTop: scrollNum-30 }, 400, 'swing');
        })

        $(window).load(function(){
            var scrollTop = [];
            $.each($('#anchorIndex li a'),function(index,item){
                if(!$(item).attr('data-top')){
                    var top = $('#'+$(item).attr('data-id')).offset().top;
                    scrollTop.push(top);
                    $(item).attr('data-top',top);
                }
            });

            $(window).scroll(function(){
                var nowTop = $(window).scrollTop(),index,length = scrollTop.length;
                if(nowTop+60 > scrollTop[length-1]){
                        index = length
                }else{
                    for(var i=0;i<length;i++){
                        if(nowTop+60 <= scrollTop[i]){
                            index = i
                            break;
                        }
                    }
                }
                $('#anchorIndex li').removeClass('on');  //取消当前标签高亮属性
                $('#anchorIndex li').eq(index).addClass('on');  //增加当前标签高亮属性
            });
        });

        //用js计算屏幕的高度
        $('#anchorIndex').css('max-height',$(window).height()-80);
    }
});