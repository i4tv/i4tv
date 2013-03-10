# -*- coding: utf-8 -*-

import fileinput
import redis

client = redis.Redis(host='localhost', port=6379, db=1)

for l in fileinput.input("stroke_simp.dict.yaml"):
    a = l.split()
    for i in range(1,len(a[1])+1):
        print a[1][:i], a[0]
        #client.sadd(a[1][:i], a[0])
    print a[0], a[1], len(a[1])
