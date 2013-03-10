# -*- coding: utf-8 -*-

import redis

client = redis.Redis(host='localhost', port=6379, db=1)

for l in open("stroke_simp.dict.yaml"):
    a = l.split()
    #for i in range(1,len(a[1])+1):
        #print a[1][:i], a[0]
        #client.sadd(a[1][:i], a[0])
    for ll in open("word.txt"):
        b = ll.split()
        if b[0] == a[0]:
            print a[0], a[1], b[1]
            break
