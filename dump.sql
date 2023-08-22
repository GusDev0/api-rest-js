create database api_rest_js;

create table users(
  id serial primary key,
  user_name text not null,
  user_email text not null,
  user_password text not null,
  user_idade integer,
  user_url_image text,
  user_admission_date date,
  user_cargo text not null 
)