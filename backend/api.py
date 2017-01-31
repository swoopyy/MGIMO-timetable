from protorpc import messages, message_types
import endpoints
from protorpc import  remote

class UserMessage(messages.Message):
    id = messages.IntegerField(required=True)
    is_pro = messages.BooleanField(required=True)
    program_type = messages.StringField()
    faculty = messages.StringField()
    department = messages.StringField()
    grade = messages.IntegerField()
    academic_group = messages.StringField()
    lang_group = messages.StringField()


class RequestTimetableMessage(messages.Message):
    user_id = messages.IntegerField()
    date = messages.IntegerField()


class TimetableMessage(messages.Message):
    pass


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
        pass

    @endpoints.method(
        request_message=RequestTimetableMessage,
        response_message=TimetableMessage,
        path='timetable',
        name='timetable',
        http_method='GET'
    )
    def get_timetable(self, request):
        pass

APPLICATION = endpoints.api_server([Api])