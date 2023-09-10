from __future__ import unicode_literals
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, BaseUserManager
)

class UserManager(BaseUserManager):
    def _create_user(self, email, password, **extra_fields):
        """ 
Creates and saves a User with the given email,and password. 
"""
        if not email:
            raise ValueError('The given email must be set')
        try:
            with transaction.atomic():
                user = self.model(email=email, **extra_fields)
                user.save(using=self._db)
                return user
        except:
            raise
    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('admin', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('admin', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(email, password=password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """ 
An abstract base class implementing a fully featured User model with 
admin-compliant permissions. 

"""
    name = models.CharField(max_length=34)
    email = models.EmailField(max_length=31, unique=True)
    admin = models.BooleanField(default=False)
    blocked = models.BooleanField(default=False)
    created = models.DateTimeField(default=timezone.now)
    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    def save(self, *args, **kwargs):
        super(User, self).save(*args, **kwargs)
        return self