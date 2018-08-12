
$(function(){
  var currentPage = 1; //当前页
  var pageSize = 5; //每页的条数
  var picArr = []; // 用于存储上传的图片

  // 1.已经入页面发送ajax请求,获取数据进行渲染

  render();

  function render(){
    $.ajax({
      type:'get',
      url:'/product/queryProductDetailList',
      data:{
        page : currentPage,
        pageSize : pageSize
      },
      dataType : 'json',
      success: function( info ) {
        console.log( info );
        var htmlStr = template( "productTpl", info );
        $('tbody').html( htmlStr );

        // 分页初始化
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          // 总页数
          totalPages: Math.ceil( info.total / info.size ),
          // 当前页
          currentPage: info.page,
          size: "normal",
          // 添加点击事件
          onPageClicked: function( a, b, c, page ) {
            // 更新当前页
            currentPage = page;
            // 让页面重新刷新
            render();
          },

          // 设置每个按钮的文本
          // 每个按钮在初始化时, 都会调用这个方法, 将这个方法的返回值作为按钮的文本
          // type: 按钮类型, page, first, last, prev, next
          // page: 当前按钮指向的页码
          // current: 当前页
          itemTexts: function( type, page, current ) {
            switch ( type ) {
              case "page":
                return page;
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
            }
          },

          // 配置每个按钮的title文本
          tooltipTitles: function( type, page, current ) {
            switch( type ) {
              case "page":
                return "前往第" + page + "页";
              case "next":
                return "下一页";
              case "prev":
                return "上一页";
              case "first":
                return "首页";
              case "last":
                return "尾页";
            }
          },

          // 使用 bootstrap 的 toolTip组件
          useBootstrapTooltip: true

        })
      }
    })
  };

  // 2. 点击添加商品按钮, 显示模态框
  $('#addBtn').click(function() {
    $('#addModal').modal("show");

    // 发送 ajax 请求, 请求二级分类的全部数据, 进行下拉列表渲染
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );
        var htmlStr = template( "dropdownTpl", info );
        $('.dropdown-menu').html( htmlStr );
      }
    })
  });
  
  // 3.给下拉菜单a注册点击事件(用事件委托进行注册)
  $('.dropdown-menu').on('click','a',function(){
    // 设置文本
    var txt = $(this).text();
    $('#dropdownText').text( txt );

    // 设置 id 给隐藏域
    var id = $(this).data("id");
    $('[name="brandId"]').val( id );

    // 手动设置隐藏域的校验状态
    $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
  });

  // 4.文件上传初始化
  // 插件内部, 会遍历选中的多张图片, 发送多次请求到后台, 后台就会响应多次, 一旦将图片存好后,
  // 后台就会将图片地址返回, 每次响应都会触发一次 done 事件
  $('#fileupload').fileupload({
    // 接受数据类型
    dataType: 'json',

    // 图片上传完成,会返回图片的地址,调用done方法
    done: function(e,data){
      
    }
  })

})