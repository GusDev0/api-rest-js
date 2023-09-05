create database api_rest_js;

create table users(
  id serial primary key,
  name text not null,
  email text not null,
  password text not null,
  idade integer,
  url_image text,
  admission_date date,
  cargo text not null 
)