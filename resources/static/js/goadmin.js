/**

    goadmin 全局

 */

layui.define(function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    var $ = layui.jquery
      ,setter = layui.setter

      ,obj = {
        api_login_url : '/api/v1/login'  // 登陆地址
        ,api_menu_url: '/api/v1/menu'   // 菜单地址
        ,api_admin_page_url: '/api/v1/admin/pages'   // 管理员列表
        ,api_admin_info_url: '/api/v1/admin/info'   // 管理员信息
        ,api_role_all_url: '/api/v1/role/all'   // 获取全部角色
        ,api_admin_update_url: '/api/v1/admin/update'   // 获取全部角色
        ,api_admin_delete_url: '/api/v1/admin/delete'   // 删除用户
        ,api_admin_add_url: '/api/v1/admin/add'   // 添加用户
        ,web_admin_form_url: '/admin/form'
        ,web_admin_add_url: '/admin/add'

        ,timestampToTime: function(timestamp) {  // 1561953956 => yyyy-MM-dd hh:mm:ss
            var d = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            year = d.getFullYear();
            month = ((d.getMonth()+1)>9?"":"0")+(d.getMonth()+1);
            day = (d.getDate()>9?"":"0")+d.getDate();
            hh = (d.getHours()>9?"":"0")+d.getHours();
            mm = (d.getMinutes()>9?"":"0")+d.getMinutes();
            ss = (d.getSeconds()>9?"":"0")+d.getSeconds();
            return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
        },
        code: {
        ok: 0
        },
        response: {
          statusName: 'code' //数据状态的字段名称
          ,statusCode: {
            ok: 0 //数据状态一切正常的状态码
            ,logout: 1001 //登录状态失效的状态码
          }
          ,msgName: 'message' //状态信息的字段名称
          ,dataName: 'data' //数据详情的字段名称
        },
        req: function(options){
         var that = this
         ,success = options.success
         ,error = options.error
         ,response = that.response

         options.data = options.data || {};
         options.headers = options.headers || {};


         delete options.success;
         delete options.error;

         return $.ajax($.extend({
           type: 'get'
           ,dataType: 'json'
           ,success: function(res){
             var statusCode = response.statusCode;

             //只有 response 的 code 一切正常才执行 done
             if(res[response.statusName] == statusCode.ok) {
               typeof options.done === 'function' && options.done(res);
             }

             //登录状态失效，清除本地 access_token，并强制跳转到登入页
             else if(res[response.statusName] == statusCode.logout){
               layui.layer.alert(res.message)
             }

             //其它异常
             else {
               layui.layer.alert(res.message)
             }

             //只要 http 状态码正常，无论 response 的 code 是否正常都执行 success
             typeof success === 'function' && success(res);
           }
           ,error: function(e, code){
            if (typeof error !== 'function'){
               layui.layer.alert(e.responseText)
               return
            }
             typeof error === 'function' && error(res);
           }
         }, options));
       },

  };

  exports('goadmin', obj);
});