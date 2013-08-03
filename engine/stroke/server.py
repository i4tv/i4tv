
import tornado.ioloop
import tornado.web
import tornado.websocket
import os
import redis

import sys
reload(sys)
sys.setdefaultencoding('utf8')

class EchoWebSocket(tornado.websocket.WebSocketHandler):
    def open(self):
        print "WebSocket opened"

    def on_message(self, message):
        client = redis.Redis(host='localhost', port=6379, db=2)
        print "client message %s" % message
        s = client.zrevrange(message, 0, 29)
        a = u""
        i = 0
        for ss in s:
            i += 1
            a = "%s%s" % (a,ss)
            if i > 29:
                break
        self.write_message(a)

    def on_close(self):
        print "WebSocket closed"

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("sss")

class WebSocket(tornado.web.RequestHandler):
    def get(self):
        self.write("""
<html>
<head>
<script type="text/javascript">
var ws = new WebSocket("ws://www.i4tv.cn:8088/websocket/");
ws.onopen = function() {
   ws.send("Hello, world");
};
ws.onmessage = function (evt) {
   alert(evt.data);
};
</script>
</head>
<body>
<h1>Hello, World</h1>
</body>
</html>
""")

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
}
application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/websocket", WebSocket),
    (r"/websocket/", EchoWebSocket),
    (r"/static/.*", tornado.web.StaticFileHandler,
     dict(path=settings['static_path'])),
], **settings)

if __name__ == "__main__":
    application.listen(8088)
    tornado.ioloop.IOLoop.instance().start()
