

$(function(){

  // 要渲染历史记录,需先读取记录,下面都是历史记录存取操作
  // 我们需要约定一个键名  search_list

  // 将来下面三句话, 可以放在控制台执行, 进行假数据初始化
  // var arr = [ "耐克", "李宁", "新百伦", "耐克王", "阿迪王" ];
  // var jsonStr = JSON.stringify( arr );
  // localStorage.setItem( "search_list", jsonStr );

  render();
  // 功能1: 历史记录渲染功能
  // (1) 读取本地历史, 得到 jsonStr
  // (2) 将 jsonStr 转换成 数组
  // (3) 通过数组, 进行页面渲染(模板引擎)
  function getHistory(){
    // 如果读取不出来就默认初始[];
    var history = localStorage.getItem('search_list') || '[]';
    // 转成数组
    var arr = JSON.parse(history);
    return arr;
  };

  // 专门用于读取本地历史,进行渲染
  function render(){
    var arr = getHistory();
    // template(第一个必须是模板id,第二则必须是对象)
    var htmlStr = template('historyTpl',{arr:arr});
    $('.lt_history').html(htmlStr);
  };


  // 清空历史记录功能
  // 1.需要通过事件委托给绑定点击事件
  // 2. 清空, 将本地的 search_list 移除, removeItem(key);
  // 3.重新渲染页面
  $('.lt_history').on('click','.btn_empty',function(){

    // mui给我们提供了相应的方法
    mui.confirm('你确定要清空历史吗?','温馨提示',['取消','确认'],function(e){
      console.log(e);
      if(e.index === 1){
        // 点击确认按钮,移除本地历史记录
        localStorage.removeItem('search_list');
        // 重新渲染页面
        render();
      }
    })

  });


  // 实现单挑数据的删除
  // 1.用事件委托来绑定点击事件
  // 2.将下标存储在删除按钮中,点击后获取下标
  // 3.读取本地存储,拿到数组
  // 4.根据下标删除数组中对应的数据, splice
  // 5.将数据转化成字符串 jsonstr
  // 6.将字符串存储到本地内存中
  // 7.页面重新渲染
  $('.lt_history').on('click','.btn_delete',function(){
    var that = this;
    mui.confirm('你确定要删除此条信息吗?','温馨提示',['取消','确定'],function(e){

      if(e.index === 1){
        // 获取下标
        var index = $(that).data('index');
        // 获取数组
        var arr = getHistory();
        // splice(index,删除几个)
        arr.splice(index,1);
        //转成字符串
        var jsonStr = JSON.stringify(arr);
        // 然后存储到内存里面
        localStorage.setItem('search_list',jsonStr);
        // 然后重新渲染
        render();
      }

    })
  })

})