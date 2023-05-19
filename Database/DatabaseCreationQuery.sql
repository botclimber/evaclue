
CREATE DATABASE Rentify_db; 
USE Rentify_db;

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

Create Table Addresses (
  id int auto_increment,
  latitude float not null,
  longitude float not null,
  streetName varchar(255) not null,
  city varchar(100) not null,
  state varchar(50) not null,
  postalCode varchar(20) not null,
  number varchar(5) not null,
  country varchar(100) not null,
  PRIMARY KEY (id)
);

Create Table ResidenceAddresses (
  id int auto_increment,
  addressId int not null,
  floor varchar(50) not null,
  direction varchar(50) not null,
  number varchar(5) not null,
  PRIMARY KEY (id),
  FOREIGN KEY (addressId) REFERENCES Addresses(Id)
);

Create Table Reviews (
  id int auto_increment,
  userId int not null,
  adminId int not null,
  residenceId int not null,
  description text not null,
  rating int not null,
  createdOn datetime not null,
  approvedOn datetime,
  anonymous bit not null,
  approved bit not null,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES Users(Id),
  FOREIGN KEY (adminId) REFERENCES Admins(Id),
  FOREIGN KEY (residenceId) REFERENCES ResidenceAddresses(Id)
);

