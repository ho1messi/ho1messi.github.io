import sys
import chardet
import os
import codecs
import time

if len(sys.argv) == 1:
    fileName = input('input file name:')
else:
    fileName = sys.argv[1]

if isinstance(fileName, str):
    title = fileName
else:
    confidence, code = chardet.detect(fileName)
    title = fileName.decode(code)

code = 'utf-8'
localtime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

fout = codecs.open(title + '.md', 'a', code)

fout.write('---\n')
fout.write('title: ' + title + '\n')
fout.write('date: ' + localtime + '\n')
fout.write('categories: \n')
fout.write('tags: \n')
fout.write('---\n')

fout.close()

os.startfile(fileName + '.md')