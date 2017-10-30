from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response

from .serializers import PersonSerializer, CourseSerializer
from .models import Person, Course, PersonCourseManager, ModelManager, StoredModelManager
from rest_framework.decorators import api_view

class CoursesViewSet(viewsets.ViewSet):
    # Required for the Browsable API renderer to have a nice form.
    serializer_class = CourseSerializer
    manager = ModelManager(Course)

    def list(self, request):
        queryset = self.manager.list()
        serializer = self.serializer_class(
            instance=queryset,
            many=True)
        count = self.manager.count()
        return Response({'total': count, 'data': serializer.data})

class PersonViewSet(viewsets.ViewSet):
    # Required for the Browsable API renderer to have a nice form.
    serializer_class = PersonSerializer
    manager = StoredModelManager(Person)

    def list(self, request):
        limit = request.query_params.get('limit')
        offset = request.query_params.get('offset')
        search = request.query_params.get('name')
        if search:
            # TODO Pagination for search 
            queryset = self.manager.search(field='name', query=search)
        else:
            queryset = self.manager.list(limit=limit, offset=offset)

        serializer = self.serializer_class(
            instance=queryset,
            many=True)
        count = self.manager.count()
        return Response({'total': count, 'data': serializer.data})

    def retrieve(self, request, pk=None):
        if pk:
            person = self.manager.get(pk)
            serializer = self.serializer_class(person)
            return Response(serializer.data)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.create(serializer.validated_data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.update(pk, serializer.validated_data)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        serializer = self.serializer_class(data=request.data)
        serializer.delete(pk)
        return Response({}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def person_courses(request, pk):

    manager = PersonCourseManager()

    if request.method == 'POST':
        #{"action":"subscribe", "id":id}
        #{'action':'unsubscribe', 'id':id}
        action = request.data.get('action')
        if action == 'subscribe':
            manager.subscribe(pk, request.data['id'])
            
        elif action == 'unsubscribe':
            manager.unsubscribe(pk, request.data['id'])

    serializer_available = CourseSerializer(
        instance=manager.courses_available(pk),
        many=True)
    serializer_applied = CourseSerializer(
        instance=manager.courses_applied(pk),
        many=True)

    return Response({'applied': serializer_applied.data,
                     'available': serializer_available.data})

    



