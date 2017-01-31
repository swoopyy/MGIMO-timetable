from google.appengine.ext import ndb

class User(ndb.Model):
    id = ndb.IntegerProperty(required=True)
    is_pro = ndb.BooleanProperty(required=True)
    program_type = ndb.StringProperty()
    faculty = ndb.StringProperty()
    department = ndb.StringProperty()
    grade = ndb.IntegerProperty()
    academic_group = ndb.StringProperty()
    lang_group = ndb.StringProperty()


class Node(ndb.Model):
    type = ndb.IntegerProperty(required=True)
    number = ndb.IntegerProperty(required=True)
    name = ndb.IntegerProperty(required=True)
    children = ndb.KeyProperty(repeated=True)
    parent = ndb.KeyProperty()