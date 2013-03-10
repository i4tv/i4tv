# -*- coding: utf-8 -*-

import fileinput
import redis

#client = redis.Redis(host='localhost', port=6379, db=1)
client = redis.Redis(host='localhost', port=6379, db=2)

s = client.zrevrange ('hhs', 0, -1)

for ss in s:
    print ss
