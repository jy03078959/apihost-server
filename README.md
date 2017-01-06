# API

## Error Handler
- 200:数据正常
- 400: 输入参数有误
- 401: 请求没有权限
- 404: 请求的资源不存在

所有错误都会详细code和msg提示
```
HTTP/1.1 200
{
	"code":1,
	"msg": "Internal Server Error",
	"data":{}
}
```

### GET /mock/:name  获取mock数据
- Request
```
```
- Response
```
{
}
```
