$(function(){
  var currentPage = 1; //当前页
  var pageSize = 5;  //每页的总条数

  // 开始之前先执行一次
  render();
  function render(){
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page: currentPage,
        pageSize: pageSize
      },
      dataType:'json',
      success: function( info ){
        // console.log(info);
        var htmlStr = template('tpl',info);
        $("tbody").html(htmlStr);
        // 进行分页初始化
        $('#paginator').bootstrapPaginator({
          // 指定bootstrap版本
          bootstrapMajorVersion: 3,
          // 总页数
          totalPages : Math.ceil(info.total / info.size),
          // 当前第几页
          currentPage : info.page,
          // 注册按钮点击事件
          onPageClicked : function(a,b,c,page){
            currentPage = page,
            render()
          }

        })
      }
  
    })
  };

  // 点击添加分类按钮,显示模态框
  $('#addBtn').click(function(){
    $('#addModal').modal('show')
  })

  // 使用表单校验插件,实现表单校验
  $('#form').bootstrapValidator({
    // 配置图表
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',     // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    
    // 配置字段
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: "一级分类不能为空"
          }
        }
      }
    }
  });

  // 注册表单校验成功事件,阻止默认的提交,使用ajax提交
  $('#form').on('success.form.bv',function(e){
    e.preventDefault();

    // 通过ajax进行提交
    $.ajax({
      type:'post',
      url:'/category/addTopCategory',
      data:$('#form').serialize(),
      dataType:'json',
      success:function(info){
        // console.log(info);
        if(info.success){
          $('#addModal').modal("hide");
          // 重新渲染第一页,让用户看到第一页的数据
          currentPage = 1;
          render();
          // 重置模态框,不仅要重置模态框的状态,还要重置里面的文本内容
          $('#form').data('bootstrapValidator').resetForm(true);
        }
      }
    })
  })

})