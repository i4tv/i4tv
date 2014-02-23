

import tornado.ioloop
import tornado.web
import tornado.websocket
import os
import redis

import sys
reload(sys)
sys.setdefaultencoding('utf8')

class BihuaEngine(tornado.websocket.WebSocketHandler):
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

class PinyinEngine(tornado.websocket.WebSocketHandler):
    def open(self):
        print "WebSocket opened"

    def on_message(self, message):
        client = redis.Redis(host='localhost', port=6379, db=9)
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

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
}

application = tornado.web.Application([
    (r"/bihua/", BihuaEngine),
    (r"/pinyin/", PinyinEngine),
], **settings)

if __name__ == "__main__":
    application.listen(11180)
    tornado.ioloop.IOLoop.instance().start()
