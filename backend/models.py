from google.appengine.ext import ndb


class User(ndb.Model):
    is_pro = ndb.BooleanProperty()
    program_type = ndb.StringProperty()
    faculty = ndb.StringProperty()
    department = ndb.StringProperty()
    course = ndb.StringProperty()
    academic_group = ndb.StringProperty()
    lang_group = ndb.StringProperty()


class Tree(ndb.Model):
    date = ndb.DateProperty()
    tree = ndb.JsonProperty()