create database api_rest_js;

create table users(
  id serial primary key,
  user_name text not null,
  user_email text not null,
  user_password text not null
)