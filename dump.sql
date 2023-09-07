create database api_rest_js;

create table users(
  id serial primary key,
  name text not null,
  email text not null,
  password text not null,
  idade integer,
  url_image text,
  subscribe_date date
)

create table posts(
  id serial primary key,
  conteudo text,
  id_users foreign key references users(id)
)