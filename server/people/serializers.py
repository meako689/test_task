from rest_framework import serializers

from .models import Person, Course, ModelManager, StoredModelManager


class CourseSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False, read_only=True)
    name = serializers.CharField(max_length=50, required=True)
    code = serializers.CharField(max_length=50, required=True)

    def create(self, validated_data):
        obj = ModelManager(Course).create(validated_data)
        return obj


class PersonSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False, read_only=True)
    name = serializers.CharField(max_length=50, required=True)
    email = serializers.EmailField(required=True)
    status = serializers.BooleanField(required=False)
    phone = serializers.CharField(max_length=13, allow_blank=True, required=False)
    mobile_phone = serializers.CharField(max_length=13, allow_blank=True, required=False)

    def create(self, validated_data):
        obj = ModelManager(Person).create(validated_data)
        return obj

    def update(self, pk, validated_data):
        obj = ModelManager(Person).update(pk, validated_data)
        return obj

    def delete(self, pk):
        ModelManager(Person).delete(pk)
