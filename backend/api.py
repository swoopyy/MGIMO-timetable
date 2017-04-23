# -*- coding: utf-8 -*-
from protorpc import messages, message_types
import endpoints
from protorpc import remote
from models import User
from scrapper import get_timetable
import logging
from utils import xml_to_json
import  datetime
import os
import lib.cloudstorage as gcs

from google.appengine.api import app_identity


class UserMessage(messages.Message):
    id = messages.StringField(1, required=True)
    is_pro = messages.BooleanField(2)
    program_type = messages.StringField(3)
    faculty = messages.StringField(4)
    department = messages.StringField(5)
    course = messages.StringField(6)
    academic_group = messages.StringField(7)
    lang_group = messages.StringField(8)


class RequestTimetableMessage(messages.Message):
    id = messages.StringField(1)
    date = messages.IntegerField(2)
    cached = messages.BooleanField(3, default=False)


class TimetableMessage(messages.Message):
    timetable = messages.StringField(1)


class TreeMessage(messages.Message):
    tree = messages.StringField(1)


class VersionMessage(messages.Message):
    version = messages.IntegerField(1)

tree_version = 1
bucket_name = os.environ.get('BUCKET_NAME',
                             app_identity.get_default_gcs_bucket_name())
@endpoints.api(name='mgimo', version='v1', description='mgimo timetable api')
class Api(remote.Service):
    @endpoints.method(
        request_message=UserMessage,
        response_message=message_types.VoidMessage,
        path='register',
        name='register',
        http_method='GET'
    )
    def register(self, request):
        user = User.get_or_insert(request.id)
        user.is_pro = request.is_pro
        user.program_type = request.program_type
        user.faculty = request.faculty
        user.department = request.department
        user.course = request.course
        user.academic_group = request.academic_group
        user.lang_group = request.lang_group
        logging.debug(user.put())
        return message_types.VoidMessage()

    @endpoints.method(
        request_message=message_types.VoidMessage,
        response_message=TreeMessage,
        path='tree',
        name='tree',
        http_method='GET'
    )
    def get_tree(self, request):
        filename = '/' + bucket_name + '/tree.json'
        gcs_file = gcs.open(filename)
        tree = gcs_file.read()
        gcs_file.close()
        return TreeMessage(
            tree=tree.decode('utf-8').encode('unicode-escape')
        )


    @endpoints.method(
        request_message=message_types.VoidMessage,
        response_message=VersionMessage,
        path='version',
        name='version',
        http_method='GET',
    )
    def get_verision(self, request):
        return VersionMessage(
            version=tree_version
        )

    @endpoints.method(
        request_message=RequestTimetableMessage,
        response_message=TimetableMessage,
        path='timetable',
        name='timetable',
        http_method='GET'
    )
    def get_timetable(self, request):
        logging.debug(request.id)
        user = User.get_by_id(str(request.id))
        date = datetime.datetime.fromtimestamp(
            int(request.date) / 1000
        ).strftime('%d.%m.%Y')
        obj = {
            "date": str(date),
            "program_type": user.program_type,
            "faculty": user.faculty,
            "department": user.department,
            "course": user.course,
            "academic_group": user.academic_group,
            "lang_group": user.lang_group,
        }
        return TimetableMessage(
            timetable=get_timetable(obj)
        )


APPLICATION = endpoints.api_server([Api])

