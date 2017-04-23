#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
from models import Tree
from tree_scrapper import scrape_tree
from google.appengine.ext.deferred import deferred
from google.appengine.api import background_thread
import datetime
import logging
import json
from google.appengine.api import urlfetch

class MainHandler(webapp2.RequestHandler):
    def get(self):
        data = {
                  'config': {
                      'encoding': 'LINEAR16',
                      'sampleRate': 16000,
                      'languageCode': 'ru-RU',
                    },
                    'audio': {
                       'uri': 'gs://mgimo-timetable.appspot.com/interview 1 .wav'
                    }
              }
        headers = {'Content-Type': 'application/json'}
        r = urlfetch.fetch(
            url='https://speech.googleapis.com/v1beta1/speech:asyncrecognize?key=AIzaSyDjQQNAuw8b6A4hOi-EiqgRVUXlmXLoIQQ',
            payload=json.dumps(data),
            method=urlfetch.POST,
            headers=headers)

        self.response.write(r.content)


class TreeScrapper(webapp2.RedirectHandler):
    @classmethod
    def scrape_to_db(cls):
        now = datetime.datetime.now()
        date = str(now.strftime("%d.%m.%Y"))
        obj = scrape_tree(date)
        # logging.debug(obj)
        # logging.debug(Tree(date=now, tree=obj).put)

    def get(self):
        #deferred.defer(TreeScrapper.scrape_to_db)
        background_thread.start_new_background_thread(TreeScrapper.scrape_to_db, [])
        self.response.write('Running!')

app = webapp2.WSGIApplication([
    ('/scrape_tree', TreeScrapper),
    ('/', MainHandler)
], debug=True)

# import requests
# data = {
#     'config': {
#         'encoding': 'LINEAR16',
#         'sampleRate': 16000,
#         'languageCode': 'ru-RU',
#     },
#     'audio': {
#         'uri': 'gs://mgimo-timetable.appspot.com/interview 1 .wav'
#     }
# }
# headers = {'Content-Type': 'application/json'}
# r = requests.post('https://speech.googleapis.com/v1beta1/speech:asyncrecognize?key=AIzaSyDjQQNAuw8b6A4hOi-EiqgRVUXlmXLoIQQ', data=json.dumps(data))
# print(r.content)