package middleware

import (
	"github.com/bensema/goadmin/ecode"
	"github.com/bensema/goadmin/global"
	"github.com/bensema/goadmin/server/http/internal"
	"github.com/gin-gonic/gin"
	"net/http"
)

// 登陆
func PermitWeb() gin.HandlerFunc {
	return func(c *gin.Context) {
		sid, err := c.Cookie(internal.AdminSession)
		if err != nil {
			err = ecode.NoLogin
			c.Redirect(http.StatusFound, "/login")
			c.Abort()
			return
		}
		adminSession, err := global.Srv.GetAdminSessionCache(c, sid)
		if err != nil {
			err = ecode.AccessTokenExpires
			c.Redirect(http.StatusFound, "/login")
			c.Abort()
			return
		}
		// root无任何限制
		if adminSession.Name == internal.Root {
			c.Next()
			return
		}

		err = global.Srv.PermitWeb(c, adminSession.UserId)
		if err != nil {
			c.Redirect(http.StatusFound, "/403")
			c.Abort()
			return
		}
		c.Next()
		return
	}
}

func PermitApi() gin.HandlerFunc {
	return func(c *gin.Context) {
		sid, err := c.Cookie(internal.AdminSession)
		if err != nil {
			err = ecode.NoLogin
			internal.JSON(c, nil, err)
			c.Abort()
			return
		}
		adminSession, err := global.Srv.GetAdminSessionCache(c, sid)
		if err != nil {
			err = ecode.AccessTokenExpires
			internal.JSON(c, nil, err)
			c.Abort()
			return
		}

		// root无任何限制
		if adminSession.Name == internal.Root {
			c.Next()
			return
		}

		err = global.Srv.PermitAPI(c, adminSession.UserId)
		if err != nil {
			internal.JSON(c, nil, err)
			c.Abort()
			return
		}

		c.Next()
		return
	}
}
