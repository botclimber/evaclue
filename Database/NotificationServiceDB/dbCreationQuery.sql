CREATE DATABASE evaNotifications_db;
USE evaNotifications_db;

Create Table Subs(
    id int auto_increment,
    email varchar(120) not null,
    createdAt datetime not null,
    PRIMARY KEY (id)
);

Create Table contactResOwner(
    id int auto_increment,
    resOnwerId int not null,
    userId int not null,
    createdAt datetime,
    PRIMARY KEY (id)
);