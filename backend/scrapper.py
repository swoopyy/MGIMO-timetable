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
    f = urllib2.urlopen(export_url, timeout=60)
    data = f.read()
    js = xml_to_json(data)
    return json.dumps(js).decode('unicode-escape')


def get_cached_timetable(obj):
    pass

# page = get_timetable({
#     'date': '27.02.2017',
#     'program_type': '1',
#     'faculty': '1',
#     'department': '1',
#     'course': '1',
#     'academic_group': '1',
#     'lang_group': '1',
# })


text = '''<?xml version="1.0"?><Report xmlns="Расписание_x0020_языковой_x0020_группы" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="Расписание_x0020_языковой_x0020_группы http://rs.mgimo.ru/ReportServer?%2freports%2f%d0%a0%d0%b0%d1%81%d0%bf%d0%b8%d1%81%d0%b0%d0%bd%d0%b8%d0%b5+%d1%8f%d0%b7%d1%8b%d0%ba%d0%be%d0%b2%d0%be%d0%b9+%d0%b3%d1%80%d1%83%d0%bf%d0%bf%d1%8b&amp;rs%3aFormat=XML&amp;rc%3aSchema=True" Name="Расписание языковой группы" textbox481="Расписание занятий академической/языковой группы" textbox475="Институт международных отношений и управления" textbox478="1" textbox476="Институт международных отношений и управления" textbox479="01" textbox477="02-рус/англ/фр"><list1><Item textbox473="2016/2017" /></list1><list5><Item textbox474="Весенний" /></list5><list2><Item textbox480="27.02.2017 - 04.03.2017" /></list2><table1 textbox2="Понедельник" textbox3="Вторник" textbox10="Среда" textbox13="Четверг" textbox16="Пятница" textbox19="Суббота" textbox37="27.02.2017" textbox38="28.02.2017" textbox39="01.03.2017" textbox40="02.03.2017" textbox41="03.03.2017" textbox42="04.03.2017"><Detail_Collection><Detail textbox29="1"><subreport1><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport1><subreport2><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Русский язык/Russian" textbox1="Семинар" textbox2="4161" job_position_title="" textbox7="c 07.02.2017 по 30.05.2017 (еженед.)" comment="" /></Detail_Collection></table5></Report></subreport2><subreport3><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Всемирная история/World History" textbox1="Лекция" textbox2="4127" job_position_title="" textbox3="Романова Екатерина Владимировна" textbox7="c 15.02.2017 по 24.05.2017 (по четн.)" comment="" /></Detail_Collection></table5></Report></subreport3><subreport4><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Основы маркетинга/Basics of Marketing" textbox1="Лекция" textbox2="4154" job_position_title="" textbox7="c 09.02.2017 по 30.03.2017 (еженед.)" comment="Преп. Старостин В.С., Бутковский Ю." /></Detail_Collection></table5></Report></subreport4><subreport5><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Физическая культура/Physical training " textbox1="Семинар" job_position_title="" textbox7="c 10.02.2017 по 26.05.2017 (еженед.)" comment="" /></Detail_Collection></table5></Report></subreport5><subreport6><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Русский язык/Russian" textbox1="Семинар" textbox2="4161" job_position_title="" textbox7="c 11.02.2017 по 27.05.2017 (еженед.)" comment="" /></Detail_Collection></table5></Report></subreport6></Detail><Detail textbox29="2"><subreport1><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Русский язык/Russian" textbox1="Семинар" textbox2="4161" job_position_title="" textbox7="c 13.02.2017 по 29.05.2017 (еженед.)" comment="" /></Detail_Collection></table5></Report></subreport1><subreport2><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Теория международных отношений/Theory of International Relations" textbox1="Семинар" textbox2="531" job_position_title="Доцент" textbox3="Худайкулова Александра Викторовна" textbox7="c 14.02.2017 по 23.05.2017 (по четн.)" comment="" /></Detail_Collection></table5></Report></subreport2><subreport3><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Основы теории управления и менеджмента/General Management and Governance" textbox1="Семинар" textbox2="4127" job_position_title="Преподаватель" textbox3="Чернина Маргарита Михайловна" textbox7="c 15.02.2017 по 24.05.2017 (по четн.)" comment="" /></Detail_Collection></table5></Report></subreport3><subreport4><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Основы маркетинга/Basics of Marketing" textbox1="Семинар" job_position_title="" textbox7="c 09.02.2017 по 30.03.2017 (еженед.)" comment="Преп. Старостин В.С." /></Detail_Collection></table5></Report></subreport4><subreport5><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Государственное право Российской Федерации/State Law of the Russian Federation" textbox1="Семинар" textbox2="4166" job_position_title="Доцент" textbox3="Кремянская Елена Александровна" textbox7="c 17.02.2017 по 26.05.2017 (по четн.)" comment="" /></Detail_Collection></table5></Report></subreport5><subreport6><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Английский язык для международников/Advanced Course of English" textbox1="Семинар" textbox2="4162" job_position_title="" textbox7="c 11.02.2017 по 27.05.2017 (еженед.)" comment="" /></Detail_Collection></table5></Report></subreport6></Detail><Detail textbox29="3"><subreport1><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport1><subreport2><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Русский язык и культура речи" textbox1="Семинар" textbox2="3141" job_position_title="" textbox3="Назарова Наталия Евгеньевна" textbox7="c 07.02.2017 по 30.05.2017 (еженед.)" comment="" /></Detail_Collection></table5></Report></subreport2><subreport3><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Основы политической науки/Basics of Political Science" textbox1="Семинар" textbox2="4166" job_position_title="" textbox3="Веретевская Анна Вячеславовна" textbox7="c 15.02.2017 по 24.05.2017 (по четн.)" comment="Доцент Окунев Игорь Юрьевич" /></Detail_Collection></table5></Report></subreport3><subreport4><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Русский язык/Russian" textbox1="Семинар" textbox2="4162" job_position_title="" textbox7="c 09.02.2017 по 25.05.2017 (еженед.)" comment="" /></Detail_Collection></table5></Report></subreport4><subreport5><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Русский язык/Russian" textbox1="Семинар" textbox2="4162" job_position_title="" textbox7="c 10.02.2017 по 26.05.2017 (еженед.)" comment="" /></Detail_Collection></table5></Report></subreport5><subreport6><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport6></Detail><Detail textbox29="4"><subreport1><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Математические методы (Основы математического анализа для международников и количественные методы в экономике)/ Mathematical Methods (Basics of Mathematical Analysis for International Relations Spesialists and Quantitative Methods in Economics)" textbox1="Лекция" textbox2="4127" job_position_title="Заведующий кафедрой" textbox3="Артамонов Никита Вячеславович" textbox7="c 13.02.2017 по 22.05.2017 (по четн.)" comment="" /></Detail_Collection></table5></Report></subreport1><subreport2><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport2><subreport3><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="История России во всемирном историческом процессе/History of Russia in the World Historical Process" textbox1="Семинар" textbox2="4127" job_position_title="" textbox3="Волкова Елена  Сергеевна" textbox7="c 15.02.2017 по 24.05.2017 (по четн.)" comment="" /></Detail_Collection></table5></Report></subreport3><subreport4><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Физическая культура/Physical training " textbox1="Семинар" job_position_title="" textbox7="c 09.02.2017 по 25.05.2017 (еженед.)" comment="" /></Detail_Collection></table5></Report></subreport4><subreport5><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Макроэкономика/Macroeconomics" textbox1="Семинар" textbox2="4154" job_position_title="Профессор" textbox3="Столбов Михаил Иосифович" textbox7="c 17.02.2017 по 26.05.2017 (по четн.)" comment="" /></Detail_Collection></table5></Report></subreport5><subreport6><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport6></Detail><Detail textbox29="5"><subreport1><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport1><subreport2><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport2><subreport3><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport3><subreport4><Report Name="subreport_Расписание языковой группы"><table5><Detail_Collection><Detail textbox5="Английский язык для международников/Advanced Course of English" textbox1="Семинар" textbox2="4162" job_position_title="" textbox7="c 09.02.2017 по 25.05.2017 (еженед.)" comment="" /></Detail_Collection></table5></Report></subreport4><subreport5><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport5><subreport6><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport6></Detail><Detail textbox29="6"><subreport1><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport1><subreport2><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport2><subreport3><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport3><subreport4><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport4><subreport5><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport5><subreport6><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport6></Detail><Detail textbox29="7"><subreport1><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport1><subreport2><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport2><subreport3><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport3><subreport4><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport4><subreport5><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport5><subreport6><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport6></Detail><Detail textbox29="8"><subreport1><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport1><subreport2><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport2><subreport3><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport3><subreport4><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport4><subreport5><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport5><subreport6><Report Name="subreport_Расписание языковой группы"><table5 /></Report></subreport6></Detail></Detail_Collection></table1></Report>
'''
print(xml_to_json(text))