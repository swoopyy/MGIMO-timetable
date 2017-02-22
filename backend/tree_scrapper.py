# coding=utf-8

import urllib
import urllib2
import json
import logging
import lxml.html as html

base_url = 'http://rs.mgimo.ru'
url = base_url + "/ReportServer/Pages/ReportViewer.aspx?%2freports%2f%D0%A0%D0%B0%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5+%D1%8F%D0%B7%D1%8B%D0%BA%D0%BE%D0%B2%D0%BE%D0%B9+%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D1%8B&rs:Command=Render"

headers = {
    'HTTP_USER_AGENT': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.13) Gecko/2009073022 Firefox/3.0.13',
    'HTTP_ACCEPT': 'text/html,application/xhtml+xml,application/xml; q=0.9,*/*; q=0.8',
    'Content-Type': 'application/x-www-form-urlencoded'
}

selects = [r'ReportViewerControl$ctl00$ctl05$ctl00', r'ReportViewerControl$ctl00$ctl07$ctl00',
           r'ReportViewerControl$ctl00$ctl09$ctl00', r'ReportViewerControl$ctl00$ctl11$ctl00',
           r'ReportViewerControl$ctl00$ctl13$ctl00', r'ReportViewerControl$ctl00$ctl15$ctl00']

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


def _render_payload(page, date, vals):
    payload = [
        (r'__EVENTTARGET', r'ReportViewerControl$ctl00$ctl05$ctl00'),
        (r'__VIEWSTATE', _find_viewstate(page)),
        (r'__VIEWSTATEGENERATOR', r'177045DE'),
        (r'__EVENTARGUMENT', ''),
        (r'__LASTFOCUS', ''),
        (r'__EVENTVALIDATION', _find_eventvalid(page)),
         (r'ReportViewerControl$ctl00$ctl03$ctl00', date),
        (r'ReportViewerControl$ctl00$ctl00', r'Просмотр отчета'),
        (r'ReportViewerControl$ctl04', ''),
        (r'ReportViewerControl$ctl05', ''),
        (r'ReportViewerControl$ctl06', r'1'),
        (r'ReportViewerControl$ctl07', r'0'),
    ]
    for val in vals:
        payload.append((val[0], val[1]))
    return tuple(payload)


def _find_export_url(data):
    val = 'OpType=Export'
    back = fow = data.index(val)
    while data[back] != '"':
        back -= 1
    while data[fow] != '"':
        fow += 1
    return data[back + 1: fow]


def _extract_options(page, select_name):
    out = []
    hparser = html.HTMLParser(encoding='utf-8')
    parsed = html.fromstring(page, parser=hparser)
    e = parsed.xpath("//select[@name='%s']/option" % select_name)
    for option in e:
        if option.attrib['value'] != '0':
            out.append([option.attrib['value'], option.text])
    return out


def _insert(vals, obj, options):
    target = obj
    for i in vals:
        target = target[i[1]]
    for option in options:
        target[option[0]] = {'name': option[1].replace('"', '\\"')}


def _insert_timetable(vals, obj, page):
    target = obj
    for i in vals:
        target = target[i[1]]
    export_url = base_url + _find_export_url(page) + 'XML'
    f = urllib2.urlopen(export_url)
    timetable = f.read()
    target['timetable'] = str(timetable).replace('"', '\\"')


def _scrape(select_ind, page, vals, date, obj):
    if select_ind == len(selects):
        _insert_timetable(vals, obj, page)
        return
    select = selects[select_ind]
    options = _extract_options(page, select)
    print(repr(options).decode('unicode-escape'))
    _insert(vals, obj, options)
    new_vals = list(vals)
    new_vals.append(['', ''])
    for option in options:
        new_vals[-1][0] = select
        new_vals[-1][1] = option[0]
        payload = _render_payload(page, date, new_vals)
        encodedFields = urllib.urlencode(payload)
        req = urllib2.Request(url, encodedFields, headers)
        f = urllib2.urlopen(req)
        page = f.read()
        _scrape(select_ind + 1, page, new_vals, date, obj)


def scrape_tree(date):
    obj = {}
    page = urllib.urlopen(url).read()
    _scrape(0, page, [], date, obj)
    return obj


def to_file(obj):
    with open('tree.json', 'w') as outfile:
        s = json.dumps(obj).decode('unicode-escape')
        outfile.write(s.encode('utf8'))


obj = scrape_tree('14.02.2017')
to_file(obj)
