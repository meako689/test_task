from rest_framework import serializers

from .models import Person, ModelManager

class PersonSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False, read_only=True)
    name = serializers.CharField(max_length=50,required=True)
    email = serializers.EmailField(required=True)
    status = serializers.BooleanField()
    phone = serializers.CharField(max_length=13)
    mobile_phone = serializers.CharField(max_length=13)

    def create(self, validated_data):
        obj = ModelManager(Person).create(validated_data)
        return obj

    def update(self, pk, validated_data):
        obj = ModelManager(Person).update(pk, validated_data)
        return obj
