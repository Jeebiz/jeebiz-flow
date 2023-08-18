var cookies={
  setCookie:function (name,value) {
    // var exdate = new Date();
    // exdate.setTime(exdate.getTime() + expireHours * 60 * 60 * 1000);
    //document.cookie = name + "=" + escape(value) + ((expireHours == null) ? "" : ";expires=" + exdate.toUTCString());
    document.cookie = name + "=" + escape(value);
  },
  getCookie:function (c_name) {

    if (document.cookie.length>0)
    {
      var c_start=document.cookie.indexOf(c_name + "=")
      if (c_start!=-1)
      {
        c_start=c_start + c_name.length+1
        var c_end=document.cookie.indexOf(";",c_start)
        if (c_end==-1) c_end=document.cookie.length
        return unescape(document.cookie.substring(c_start,c_end))
      }
    }
    return ""
  },
  clearCookie:function() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
      for (var i = keys.length; i--;) {
        document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();//清除当前域名下的,例如：m.kevis.com
        document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();//清除当前域名下的，例如 .m.kevis.com
      }
    }
  }
}
export default cookies
