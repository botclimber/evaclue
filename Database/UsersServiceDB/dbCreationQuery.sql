CREATE DATABASE renUsers_db; 
USE renUsers_db;

Create Table Users (
  id int auto_increment,
  email varchar(255) UNIQUE not null,
  username varchar(30) UNIQUE not null,
  password varchar(30) not null,
  name varchar(255) not null,
  PRIMARY KEY (id)
);

Create Table Admins (
  id int auto_increment,
  email varchar(255) UNIQUE not null,
  username varchar(30) UNIQUE not null,
  password varchar(30) not null,
  PRIMARY KEY (id)
);

Create Table User_Address(
  id int auto_increment,
  city varchar(100) not null,
  streetName varchar(255) not null,
  nr varchar(5) not null,
  state varchar(50) not null,
  postalCode varchar(20) not null,
  country varchar(100) not null,
  PRIMARY KEY (id)
);
