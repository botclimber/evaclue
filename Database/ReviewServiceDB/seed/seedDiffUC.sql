INSERT INTO Addresses(lat,lng,city,street,nr,postalCode,country)VALUES(1.0, 1.0, 'city 1', 'street 1', '000', '0000-000', 'Portugal');
INSERT INTO Addresses(lat,lng,city,street,nr,postalCode,country)VALUES(2.0, 2.0, 'city 2', 'street 2', '000', '0000-000', 'Portugal');
INSERT INTO Addresses(lat,lng,city,street,nr,postalCode,country)VALUES(3.0, 3.0, 'city 3', 'street 3', '000', '0000-000', 'Portugal');

INSERT INTO ResidenceAddresses(addressId, floor, direction)VALUES(1, '5','left');
INSERT INTO ResidenceAddresses(addressId, floor, direction)VALUES(1, '4','left');
INSERT INTO ResidenceAddresses(addressId, floor, direction)VALUES(1, '6','right');
INSERT INTO ResidenceAddresses(addressId, floor, direction)VALUES(2, '1','left');
INSERT INTO ResidenceAddresses(addressId, floor, direction)VALUES(2, '2','right');
INSERT INTO ResidenceAddresses(addressId, floor, direction)VALUES(3, '1','left');

INSERT INTO Reviews(userId,adminId,residenceId,review,rating,createdOn,approvedOn,anonymous,approved)VALUES(0,0,1,'test 1 for residenceId 1', 5, '1000-01-01 00:00:00', '1000-01-01 00:00:00', 0, 0);
INSERT INTO Reviews(userId,adminId,residenceId,review,rating,createdOn,approvedOn,anonymous,approved)VALUES(0,0,1,'test 2 for residenceId 1', 5, '1000-01-01 00:00:00', '1000-01-01 00:00:00', 0, 0);
INSERT INTO Reviews(userId,adminId,residenceId,review,rating,createdOn,approvedOn,anonymous,approved)VALUES(0,0,1,'test 3 for residenceId 1', 5, '1000-01-01 00:00:00', '1000-01-01 00:00:00', 0, 0);
INSERT INTO Reviews(userId,adminId,residenceId,review,rating,createdOn,approvedOn,anonymous,approved)VALUES(0,0,2,'test 1 for residenceId 2', 5, '1000-01-01 00:00:00', '1000-01-01 00:00:00', 0, 0);
INSERT INTO Reviews(userId,adminId,residenceId,review,rating,createdOn,approvedOn,anonymous,approved)VALUES(0,0,3,'test 1 for residenceId 3', 5, '1000-01-01 00:00:00', '1000-01-01 00:00:00', 0, 0);
INSERT INTO Reviews(userId,adminId,residenceId,review,rating,createdOn,approvedOn,anonymous,approved)VALUES(0,0,5,'test 2 for residenceId 2', 5, '1000-01-01 00:00:00', '1000-01-01 00:00:00', 0, 0);
INSERT INTO Reviews(userId,adminId,residenceId,review,rating,createdOn,approvedOn,anonymous,approved)VALUES(0,0,2,'test 3 for residenceId 2', 5, '1000-01-01 00:00:00', '1000-01-01 00:00:00', 0, 0);
INSERT INTO Reviews(userId,adminId,residenceId,review,rating,createdOn,approvedOn,anonymous,approved)VALUES(0,0,4,'test 4 for residenceId 1', 5, '1000-01-01 00:00:00', '1000-01-01 00:00:00', 0, 0);
INSERT INTO Reviews(userId,adminId,residenceId,review,rating,createdOn,approvedOn,anonymous,approved)VALUES(0,0,5,'test 5 for residenceId 1', 5, '1000-01-01 00:00:00', '1000-01-01 00:00:00', 0, 0);
