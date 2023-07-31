CREATE DATABASE evaclue_db;
USE evaclue_db;

-- Reviews Service
Create Table Addresses (
  id int auto_increment,
  lat double not null,
  lng double not null,
  city varchar(100) not null,
  street varchar(255) not null,
  nr varchar(5) not null,
  postalCode varchar(20) not null,
  country varchar(100) not null,
  PRIMARY KEY (id)
);

Create Table Residences (
  id int auto_increment,
  addressId int not null,
  floor varchar(50) not null,
  direction varchar(50) not null,
  PRIMARY KEY (id)
);

Create Table Reviews (
  id int auto_increment,
  userId int not null,
  adminId int not null,
  residenceId int not null,
  review text not null,
  rating int not null,
  createdOn datetime not null,
  approvedOn datetime,
  anonymous boolean not null,
  approved int not null, -- 0 - pending, 1 - approved, 3 - rejected
  PRIMARY KEY (id)
);

Create Table ResidenceOwners (
  id int auto_increment,
  userId int not null,
  adminId int not null,
  addressId int not null,
  resId int not null,
  rentPrice float(7,2),
  free int not null, -- 0 false, 1 true
  createdOn datetime,
  approvedOn datetime,
  approved int not null,
  hide int,
  fileProof varchar(120) not null,
  PRIMARY KEY (id)
);

-- TODO: to be implemented in ReviewsService
Create Table RevChecker (
  id int auto_increment,
  userId int not null,
  addressId int not null,
  totReviews int not null,
  lastReviewDate datetime, -- can only do 1 review per 6 months
  createdOn datetime,
  PRIMARY KEY (id)
);

-- NotificationServices
Create Table Subs(
    id int auto_increment,
    email varchar(120) not null,
    createdAt datetime not null,
    PRIMARY KEY (id)
);

Create Table ContactResOwner(
    id int auto_increment,
    resOwnerId int not null,
    userId int not null,
    resOwnerEmail varchar(120) not null,
    userEmail varchar(120) not null,
    userName varchar(80) not null,
    createdAt datetime,
    PRIMARY KEY (id)
);

-- Users Service
Create Table Users(
    id int auto_increment,
    email varchar(60) not null,
    username varchar(30) not null,
    firstName varchar(30) not null,
    image varchar(120) not null,
    lastName varchar(30) not null,
    password varchar(128) not null,
    type varchar(30) not null,
    blocked boolean DEFAULT false,
    verified boolean DEFAULT false,
    PRIMARY KEY (id)
);

-- Notification of available residences on Users defined filters
-- NBOFilters = Notification Based On Filters
Create Table UserFilters(
    id int auto_increment,
    userId int not null,
    byCities varchar(60) not null,
    byRentPriceMin float(7,2),
    byRentPriceMax float(7,2),
    enable int not null,
    PRIMARY KEY (id)
);

-- Create first super Admin user
INSERT INTO Users (email, username, firstName, image, lastName, password, type, blocked, verified) VALUES ("superAdmin@evaclue.pt", "admin", "admin", "default.gif", "admin", "$2b$10$NMecm/pGsLagjXWMSNalmeLD11YIVKsQrYT1hv7JFiFGSrnyHanP.", "superAdmin", 0, 1);