
// 入口函数
$(function(){
  var currentPage = 1;  //当前页
  var pageSize = 5;  //每页的条数
  // 定义全局变量
  var currentId;
  var isDelete;

  // 用点点击进入页面发送ajax向后台请求数据,然后将数据用模板引擎进行渲染
  // 一进入页面先执行一遍
  render();

  function render(){
    $.ajax({
      type:'get',
      url:'/user/queryUser',
      data:{
        page : currentPage,
        pageSize : pageSize
      },
      dataType: 'json',
      success: function(info){
        console.log(info);
        // 使用模板引擎渲染出来
        var htmlstr = template('tpl',info);
        $('tbody').html(htmlstr);

        //分页初始化
        $('#paginator').bootstrapPaginator({
          // 配置bootstrap的版本
          bootstrapMajorVersion : 3,
          // 指定总页数
          totalPages : Math.ceil(info.total / info.size),
          // 当前页
          currentPage : info.page,
          // 当页码被点击是调用回调函数,跳转到点击的那一页
          onPageClicked : function(a,b,c,page){
            // 更新当前页
            currentPage = page;
            // 重新渲染
            render();
          }
        })

      }
    })
  }
  render();

  // 点击禁用按钮,弹出模态框,实现禁用功能
  // 因为禁用按钮是通过模板引擎动态生成出来的,所以要使用事件委托来绑定点击事件
  $("tbody").on("click",".btn",function(){
    // 点击弹出模态框
    $("#userModal").modal('show');
    // 获取用户 id, jquery 中提供了获取自定义属性的方法, data()
    // 因为要拿到全局的,所以需要在全局定义这个变量
    currentId = $(this).parent().data('id');
    // 如果是禁用按钮,说明用户是要设置禁用 所以传0
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
  });

  // 点击确认按钮,通过ajax发送请求给后台,修改用户的状态.需要传两个参数(id和isdelete)
  $("#submitBtn").click(function(){
    console.log("用户的id是"+currentId);
    console.log("用户的状态"+isDelete);
    // 发送ajax请求
    $.ajax({
      type:'post',
      url:'/user/updateUser',
      data:{
        id : currentId,
        isDelete : isDelete
      },
      dataType:'json',
      success: function( info ){
        // console.log(info);  //为true所以成功
        // 隐藏模态框
        $("#userModal").modal('hide');
        // 操作完成重现渲染当前页面
        render();
      }
    })
  })
})