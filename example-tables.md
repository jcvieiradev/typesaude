# Tables
- [User](#user)
- [Doctor](#doctor)
- [Service](#service)
- [Patient](#patient)
- [Appointment](#appointment)
- [Consultation](#consultation)
- [Document](#document)

# User

## Description


## Columns

|Name | Type | Default | Nullable | Unique | Children | Parent | Comment|
|--- | --- | --- | --- | --- | --- | --- | ---|
|id | Int | autoincrement | false | true | [Document](#document) |  | |
|createdAt | DateTime | now | false | false |  |  | |
|updatedAt | DateTime |  | false | false |  |  | |
|name | String |  | true | false |  |  | |
|email | String |  | false | true |  |  | |
|password | String |  | false | false |  |  | |
|role | String | VIEWER | false | false |  |  | |
# Doctor

## Description


## Columns

|Name | Type | Default | Nullable | Unique | Children | Parent | Comment|
|--- | --- | --- | --- | --- | --- | --- | ---|
|id | Int | autoincrement | false | true | [Appointment](#appointment), [Consultation](#consultation) |  | |
|createdAt | DateTime | now | false | false |  |  | |
|updatedAt | DateTime |  | false | false |  |  | |
|name | String |  | true | false |  |  | |
|cpf | String |  | true | true |  |  | |
|crm | String |  | true | true |  |  | |
|phone | String |  | true | false |  |  | |
|email | String |  | true | false |  |  | |
# Service

## Description


## Columns

|Name | Type | Default | Nullable | Unique | Children | Parent | Comment|
|--- | --- | --- | --- | --- | --- | --- | ---|
|id | Int | autoincrement | false | true | [Appointment](#appointment), [Consultation](#consultation) |  | |
|createdAt | DateTime | now | false | false |  |  | |
|updatedAt | DateTime |  | false | false |  |  | |
|name | String |  | true | false |  |  | |
|description | String |  | true | false |  |  | |
|price | Float |  | true | false |  |  | |
|duration | Int |  | false | false |  |  | |
# Patient

## Description


## Columns

|Name | Type | Default | Nullable | Unique | Children | Parent | Comment|
|--- | --- | --- | --- | --- | --- | --- | ---|
|id | Int | autoincrement | false | true | [Appointment](#appointment), [Consultation](#consultation) |  | |
|createdAt | DateTime | now | false | false |  |  | |
|updatedAt | DateTime |  | false | false |  |  | |
|name | String |  | true | false |  |  | |
|cpf | String |  | true | false |  |  | |
|birth | DateTime |  | true | false |  |  | |
|phone | String |  | true | false |  |  | |
|email | String |  | true | false |  |  | |
|address | String |  | true | false |  |  | |
# Appointment

## Description


## Columns

|Name | Type | Default | Nullable | Unique | Children | Parent | Comment|
|--- | --- | --- | --- | --- | --- | --- | ---|
|id | Int | autoincrement | false | true | [Consultation](#consultation) |  | |
|createdAt | DateTime | now | false | false |  |  | |
|updatedAt | DateTime |  | false | false |  |  | |
|dateTime | DateTime |  | false | false |  |  | |
|status | String | SCHEDULED | false | false |  |  | |
|doctorId | Int |  | false | false |  | [Doctor](#doctor) | |
|patientId | Int |  | false | false |  | [Patient](#patient) | |
|serviceId | Int |  | false | false |  | [Service](#service) | |
# Consultation

## Description


## Columns

|Name | Type | Default | Nullable | Unique | Children | Parent | Comment|
|--- | --- | --- | --- | --- | --- | --- | ---|
|id | Int | autoincrement | false | true | [Document](#document) |  | |
|createdAt | DateTime | now | false | false |  |  | |
|updatedAt | DateTime |  | false | false |  |  | |
|initialDateTime | DateTime |  | false | false |  |  | |
|finalDateTime | DateTime |  | true | false |  |  | |
|description | String |  | true | false |  |  | |
|doctorId | Int |  | false | false |  | [Doctor](#doctor) | |
|patientId | Int |  | false | false |  | [Patient](#patient) | |
|serviceId | Int |  | false | false |  | [Service](#service) | |
|appointmentId | Int |  | true | true |  | [Appointment](#appointment) | |
# Document

## Description


## Columns

|Name | Type | Default | Nullable | Unique | Children | Parent | Comment|
|--- | --- | --- | --- | --- | --- | --- | ---|
|id | Int | autoincrement | false | true |  |  | |
|createdAt | DateTime | now | false | false |  |  | |
|updatedAt | DateTime |  | false | false |  |  | |
|url | String |  | false | false |  |  | |
|type | String |  | false | false |  |  | |
|userId | Int |  | true | true |  | [User](#user) | |
|consultationId | Int |  | true | false |  | [Consultation](#consultation) | |