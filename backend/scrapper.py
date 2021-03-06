# coding=utf-8

import urllib
import urllib2
import json
from utils import xml_to_json
import logging
# from google.appengine.api import urlfetch
# urlfetch.set_default_fetch_deadline(45)

base_url = 'http://rs.mgimo.ru'
url = base_url + "/ReportServer/Pages/ReportViewer.aspx?%2freports%2f%D0%A0%D0%B0%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5+%D1%8F%D0%B7%D1%8B%D0%BA%D0%BE%D0%B2%D0%BE%D0%B9+%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D1%8B&rs:Command=Render"

headers = {
    'HTTP_USER_AGENT': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.13) Gecko/2009073022 Firefox/3.0.13',
    'HTTP_ACCEPT': 'text/html,application/xhtml+xml,application/xml; q=0.9,*/*; q=0.8',
    'Content-Type': 'application/x-www-form-urlencoded'
}


def _find_viewstate(data):
    val = 'id="__VIEWSTATE" value="'
    beg = data.index(val) + len(val)
    end = data.index('"', beg)
    return data[beg:end]


def _find_eventvalid(data):
    val = 'id="__EVENTVALIDATION" value="'
    beg = data.index(val) + len(val)
    end = data.index('"', beg)
    return data[beg:end]


def _find_export_url(data):
    val = 'OpType=Export'
    back = fow = data.index(val)
    while data[back] != '"':
        back -= 1
    while data[fow] != '"':
        fow += 1
    return data[back + 1: fow]


def _render_payload(obj, data):
    payload = (
        (r'__EVENTTARGET', r'ReportViewerControl$ctl00$ctl05$ctl00'),
        (r'__VIEWSTATE', _find_viewstate(data)),
        (r'__VIEWSTATEGENERATOR', r'177045DE'),
        (r'__EVENTARGUMENT', ''),
        (r'__LASTFOCUS', ''),
        (r'__EVENTVALIDATION', _find_eventvalid(data)),
        (r'ReportViewerControl$ctl00$ctl03$ctl00', obj['date']),
        (r'ReportViewerControl$ctl00$ctl05$ctl00', obj['program_type']),
        (r'ReportViewerControl$ctl00$ctl07$ctl00', obj['faculty']),
        (r'ReportViewerControl$ctl00$ctl09$ctl00', obj['department']),
        (r'ReportViewerControl$ctl00$ctl11$ctl00', obj['course']),
        (r'ReportViewerControl$ctl00$ctl13$ctl00', obj['academic_group']),
        (r'ReportViewerControl$ctl00$ctl15$ctl00', obj['lang_group']),
        (r'ReportViewerControl$ctl00$ctl00', r'Просмотр отчета'),
        (r'ReportViewerControl$ctl04', ''),
        (r'ReportViewerControl$ctl05', ''),
        (r'ReportViewerControl$ctl06', r'1'),
        (r'ReportViewerControl$ctl07', r'0'),
    )
    return payload


def _scrape_last_page(obj):
    data = urllib2.urlopen(url, timeout=60).read()
    logging.debug(data)
    for i in range(7):
        payload = _render_payload(obj, data)
        encodedFields = urllib.urlencode(payload)
        req = urllib2.Request(url, encodedFields, headers)
        f = urllib2.urlopen(req, timeout=60)
        data = f.read()
    return data


def get_timetable(obj):
    data = _scrape_last_page(obj)
    export_url = base_url + _find_export_url(data) + 'XML'
    logging.debug('export url')
    logging.debug(export_url)
    f = urllib2.urlopen(export_url, timeout=60)
    data = f.read()
    js = xml_to_json(data)
    return json.dumps(js).decode('unicode-escape')


def get_cached_timetable(obj):
    pass

page = get_timetable({
    'date': '27.02.2017',
    'program_type': '1',
    'faculty': '1',
    'department': '1',
    'course': '1',
    'academic_group': '1',
    'lang_group': '1',
})


