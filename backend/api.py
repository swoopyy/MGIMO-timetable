from protorpc import messages, message_types
import endpoints
from protorpc import remote
from models import User
from scrapper import get_timetable
import logging
from utils import xml_to_json
import datetime



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
        request_message=RequestTimetableMessage,
        response_message=TimetableMessage,
        path='timetable',
        name='timetable',
        http_method='GET'
    )
    def get_timetable(self, request):
        user = User.get_by_id(str(request.id))
        logging.debug("DATE")
        logging.debug(request.date)
        date = datetime.datetime.fromtimestamp(
            int(request.date) / 1000
        ).strftime('%d.%m.%Y')
        logging.debug("date")
        logging.debug(str(date))
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
