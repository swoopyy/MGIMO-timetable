# coding=utf-8

import urllib
import urllib2
from models import Node

import lxml.html as html

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
        (r'ReportViewerControl$ctl00$ctl11$ctl00', obj['grade']),
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
    data = urllib.urlopen(url).read()
    for i in range(7):
        payload = _render_payload(obj, data)
        encodedFields = urllib.urlencode(payload)
        req = urllib2.Request(url, encodedFields, headers)
        f = urllib2.urlopen(req)  # that's the actual call to the http site.
        data = f.read()
    return data


def scrape_timetable(obj):
    data = _scrape_last_page(obj)
    export_url = base_url + _find_export_url(data) + 'XML'
    f = urllib2.urlopen(export_url)
    data = f.read()
    return data


def scrape_tree():
    pass

# page = _scrape_last_page({
#     'date': '31.10.2016',
#     'program_type': '1',
#     'faculty': '1',
#     'department': '1',
#     'grade': '1',
#     'academic_group': '1',
#     'lang_group': '1',
# })
#
# f = open('tmp.html', 'w')
# f.write(page)
# f.close()

f = open('tmp.html', 'r')
parsed = html.fromstring(f.read())
f.close()
e = parsed.xpath("//select[@name='ReportViewerControl$ctl00$ctl07$ctl00']")
for i in e:
    print(str(i))