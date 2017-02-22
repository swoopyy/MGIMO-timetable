from lxml import etree
from StringIO import StringIO
import json


def xml_to_json(text):
    out = {}
    utf8_parser = etree.XMLParser(recover=True, encoding='utf8')
    #text = text.decode('utf8')
    root = etree.fromstring(text, parser=utf8_parser)
    dates = root.xpath("/*[name()='Report']/*[name()='list2']")[0][0].attrib['textbox480']
    out['from'], out['to'] = dates.split(' - ')
    out['semester'] = root.xpath("/*[name()='Report']/*[name()='list5']")[0][0].attrib['textbox474']

    table = root.xpath("/*[name()='Report']/*[name()='table1']/*[name()='Detail_Collection']")
    pair = 1
    for element in table[0]:
        day = 1
        for subelement in element:
            if str(day) not in out:
                out[str(day)] = {}
            item = subelement[0][0]
            if len(item) != 0:
                info = item[0][0]
                out[str(day)][str(pair)] = {
                    'name': info.attrib['textbox5'] if 'textbox5' in info.attrib else '',
                    'type': info.attrib['textbox1'] if 'textbox1' in info.attrib else '',
                    'room': info.attrib['textbox2'] if 'textbox2' in info.attrib else '',
                    'professor_name': info.attrib['textbox3'] if 'textbox3' in info.attrib else '',
                    'professor_position': info.attrib['job_position_title'] if 'job_position_title' in info.attrib else '',
                    'from_to': info.attrib['textbox7'] if 'textbox7' in info.attrib else '',
                    'comment': info.attrib['comment'] if 'comment' in info.attrib else ''
                }
            else:
                out[str(day)][str(pair)] = {}
            day += 1
        pair += 1
    return out


def tree_to_json(tree):
    for i in tree:
        if i == "timetable":
            tree["timetable"] = xml_to_json(tree["timetable"])
        elif i != "name":
            tree_to_json(tree[i])



# text = open('test.xml').read()
# obj = xml_to_json(text)
# with open('tree3.json', 'w') as outfile:
#     s = json.dumps(obj).decode('unicode-escape')
#     outfile.write(s.encode('utf8'))

# with open('tree.json', 'r') as infile:
#     with open('tree_js.json', 'w') as outfile:
#         obj = json.loads(infile.read())
#         tree_to_json(obj)
#         s = json.dumps(obj).decode('unicode-escape')
#         outfile.write(s.encode('utf8'))

with open('tree1.json', 'r') as infile:
    obj = json.loads(infile.read())
    print(json.dumps(obj['2']['3']['1']['1']['1']['1']['name']).decode('unicode-escape'))
