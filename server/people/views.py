from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import (api_view,
                                       detail_route,
                                       list_route)

from .serializers import PersonSerializer, CourseSerializer
from .models import (Person,
                     Course,
                     PersonCourseManager,
                     ModelManager,
                     StoredModelManager)


class CoursesViewSet(viewsets.ViewSet):
    """Viewset for browsing Courses"""
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
    """Viewset for browsing and CRUD'ing people """
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
        return Response({'data': serializer.data})

    @list_route()
    def count(self, request):
        """Get total number of items for pagination"""
        count = self.manager.count()
        return Response({'total': count})

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
    """View for manipulating M2M relations
    Allows to see available and subscribed courses for given person.

    Also you can subscribe or unsubscribe for a course using POST request:

        {"action":"subscribe", "id":id}
        {'action':'unsubscribe', 'id':id}
    """

    manager = PersonCourseManager()

    if request.method == 'POST':
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
