# -*- coding: utf-8 -*-

import fileinput
import redis

client = redis.Redis(host='localhost', port=6379, db=2)

for l in fileinput.input("weighted_stroke.txt"):
    a = l.split()
    for i in range(1,len(a[1])+1):
        print a[1][:i], a[0], a[2]
        client.zadd(a[1][:i], a[0], a[2])
    print a[0], a[1], len(a[1])
