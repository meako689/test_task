import string
import random
def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


from people.models import Person
pm = Person()
res = pm.create({'name':'black'+id_generator(),'email':'ia@i.a'+id_generator(),'status':'True','phone':'15','mobile_phone':'16'})
# import ipdb; ipdb.set_trace()
print(res)
