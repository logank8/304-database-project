-- Note: changed User table name to UserTable because User is a reserved word
--  changed name of subreddit -> subName because name is a reserved word
-- changed name of server -> serverName because server is a reserved word
CREATE TABLE Location (
    city char(20),
    serverName char(20),
    PRIMARY KEY(city)
);

CREATE TABLE UserTable (
    username char(20) PRIMARY KEY NOT NULL,
    password char(20) NOT NULL,
    joinDate DATE,
    avatarData char(60),
    city char(20),
    FOREIGN KEY (city) REFERENCES Location(city)
);

CREATE TABLE Message (
    messageId int NOT NULL,
    sender char(20) NOT NULL,
    receiver char(20) NOT NULL,
    PRIMARY KEY(messageId),
    FOREIGN KEY (sender) REFERENCES UserTable(username),
    FOREIGN KEY (receiver) REFERENCES UserTable(username) 
);

CREATE TABLE FriendsWith (
    friend1 char(20),
    friend2 char(20),
    PRIMARY KEY(friend1, friend2),
    FOREIGN KEY (friend1) REFERENCES UserTable(username),
    FOREIGN KEY (friend2) REFERENCES UserTable(username) 
);

CREATE TABLE Ban (
    adminId int NOT NULL,
    userId char(20) NOT NULL,
    PRIMARY KEY(adminId, userId),
    FOREIGN KEY (userId) REFERENCES UserTable(username)
);

CREATE TABLE Ad (
    id int,
    content char(60) NOT NULL,
    link char(50) NOT NULL,
    category int NOT NULL,
    adminId int NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE Subreddit(
    subName char(20),
    creatorId char(20),
    PRIMARY KEY (subName),
    FOREIGN KEY (creatorId) REFERENCES UserTable(username)
);

CREATE TABLE Serves (
    adId int NOT NULL,
    subId char(20) NOT NULL,
    PRIMARY KEY(adId, subId),
    FOREIGN KEY (adId) REFERENCES Ad(id),
    FOREIGN KEY (subId) REFERENCES Subreddit(subName)
);

CREATE TABLE Subscribes (
    userId char(20) NOT NULL,
    subId char(20) NOT NULL,
    PRIMARY KEY (userId, subId),
    FOREIGN KEY (userId) REFERENCES UserTable(username),
    FOREIGN KEY (subId) REFERENCES Subreddit(subName)
);

CREATE TABLE Votable(
    votableId int,
    awards char(30),
    content char(60),
    creatorId char(20), 
    PRIMARY KEY (votableId),
    FOREIGN KEY (creatorId) REFERENCES UserTable(username)
);

CREATE TABLE VotesOn(
    userId char(20) NOT NULL,
    votableId int NOT NULL,
    FOREIGN KEY (userId) REFERENCES UserTable(username), 
    FOREIGN KEY (votableId) REFERENCES Votable(votableId),
    PRIMARY KEY (userId, votableId)
);

CREATE TABLE Popular(
    views int,
    popularity int NOT NULL CHECK (popularity BETWEEN 1 AND 10),
    PRIMARY KEY (views)
);

CREATE TABLE Broadcast(
    liveId int,
    title char(30) NOT NULL,
    quality int,
    creatorId char(20),
    views int,
    PRIMARY KEY (liveId),
    FOREIGN KEY (creatorId) REFERENCES UserTable(username),
    FOREIGN KEY (views) REFERENCES Popular(views)
);

CREATE TABLE Thumbnail(
    liveId int,
    postId int NOT NULL,
    imageData char(60),
    PRIMARY KEY (postId),
    FOREIGN KEY (liveId) REFERENCES Broadcast(liveId)
);

CREATE TABLE Comment(
    votableId int,
    parentId int NOT NULL,
    awards char(30),
    content char(60),
    creatorId char(20),
    PRIMARY KEY (votableId),
    FOREIGN KEY (parentId) REFERENCES Votable(votableId),
    FOREIGN KEY (creatorId) REFERENCES UserTable(username)
);

CREATE TABLE Posts(
    votableId int NOT NULL UNIQUE,
    subId char(20) NOT NULL,
    FOREIGN KEY (votableId) REFERENCES Votable(votableId),
    FOREIGN KEY (subId) REFERENCES Subreddit(subName),
    PRIMARY KEY (votableId, subId)
);

-- populate Location
INSERT INTO Location VALUES ("vancouver", "server 1");
INSERT INTO Location VALUES ("toronto", "server 2");
INSERT INTO Location VALUES ("quebec", "server 3");
INSERT INTO Location VALUES ("ny", "server 4");
INSERT INTO Location VALUES ("boston", "server 5");

-- populate UserTable
INSERT INTO UserTable VALUES ('gavin', '100', DATE("2017-06-15"), "some user data", "vancouver");
INSERT INTO UserTable VALUES ('bob', 'pass1', DATE("2018-06-15"), "some user data2", "toronto");
INSERT INTO UserTable VALUES ('helen', 'pass2', DATE("2019-06-15"), "some user data3", "vancouver");
INSERT INTO UserTable VALUES ('ben', 'pass3', DATE("2020-06-15"), "some user data4", "vancouver");
INSERT INTO UserTable VALUES ('robert', 'pass4', DATE("2021-06-20"), "some user data5", "ny");

-- populate Message
INSERT INTO Message VALUES (1, 'gavin', 'helen');
INSERT INTO Message VALUES (2, 'gavin', 'bob');
INSERT INTO Message VALUES (3, 'gavin', 'ben');
INSERT INTO Message VALUES (4, 'robert', 'helen');
INSERT INTO Message VALUES (5, 'robert', 'ben');

-- populate FriendsWith
INSERT INTO FriendsWith VALUES ('gavin', 'helen');
INSERT INTO FriendsWith VALUES ('gavin', 'bob');
INSERT INTO FriendsWith VALUES ('gavin', 'ben');
INSERT INTO FriendsWith VALUES ('robert', 'ben');
INSERT INTO FriendsWith VALUES ('ben', 'bob');

-- populate Ban
INSERT INTO Ban VALUES (1, 'helen');
INSERT INTO Ban VALUES (1, 'bob');
INSERT INTO Ban VALUES (1, 'ben');
INSERT INTO Ban VALUES (2, 'robert');
INSERT INTO Ban VALUES (2, 'gavin');

-- populate Ad
INSERT INTO Ad VALUES (1, 'buy the stuff', 'buy the stuff.com', 10, 1);
INSERT INTO Ad VALUES (2, 'buy other stuff', 'buy other stuff.com', 11, 1);
INSERT INTO Ad VALUES (3, 'buy cereal', 'buy cereal.com', 12, 1);
INSERT INTO Ad VALUES (4, 'circlespace', 'circlespace.com', 13, 2);
INSERT INTO Ad VALUES (5, 'vpn', 'vpn.com', 14, 2);

-- populate Subreddit
INSERT INTO Subreddit VALUES ('cats', 'gavin');
INSERT INTO Subreddit VALUES ('dogs', 'helen');
INSERT INTO Subreddit VALUES ('ubc', 'bob');
INSERT INTO Subreddit VALUES ('movies', 'gavin');
INSERT INTO Subreddit VALUES ('anime', 'ben');

-- populate Serves
INSERT INTO Serves VALUES (1, 'cats');
INSERT INTO Serves VALUES (2, 'dogs');
INSERT INTO Serves VALUES (3, 'ubc');
INSERT INTO Serves VALUES (4, 'movies');
INSERT INTO Serves VALUES (5, 'anime');

-- populate Subscribes
INSERT INTO Subscribes VALUES ('helen', 'cats');
INSERT INTO Subscribes VALUES ('bob', 'dogs');
INSERT INTO Subscribes VALUES ('ben', 'ubc');
INSERT INTO Subscribes VALUES ('robert', 'movies');
INSERT INTO Subscribes VALUES ('gavin', 'anime');

-- populate Votable
INSERT INTO Votable VALUES (1, 'none :(', 'wow a cool votable', 'helen');
INSERT INTO Votable VALUES (2, 'none :(', 'wow a cool votable2', 'bob');
INSERT INTO Votable VALUES (3, 'shiny', 'wow a cool votable3', 'ben');
INSERT INTO Votable VALUES (4, 'none :(', 'wow a cool votable4', 'robert');
INSERT INTO Votable VALUES (5, 'none :(', 'wow a cool votable5', 'gavin');

-- populate VotesOn
INSERT INTO VotesOn VALUES ('gavin', 1);
INSERT INTO VotesOn VALUES ('gavin', 2);
INSERT INTO VotesOn VALUES ('gavin', 3);
INSERT INTO VotesOn VALUES ('bob', 1);
INSERT INTO VotesOn VALUES ('helen', 1);

-- populate Popular
INSERT INTO Popular VALUES (100, 5);
INSERT INTO Popular VALUES (80, 4);
INSERT INTO Popular VALUES (50, 3);
INSERT INTO Popular VALUES (5, 1);
INSERT INTO Popular VALUES (10, 2);

-- populate Broadcast
INSERT INTO Broadcast VALUES (1, 'awesome broadcast 1', 2, 'gavin', 100);
INSERT INTO Broadcast VALUES (2, 'awesome broadcast 1', 3, 'gavin', 80);
INSERT INTO Broadcast VALUES (3, 'awesome broadcast 1', 4, 'gavin', 50);
INSERT INTO Broadcast VALUES (4, 'awesome broadcast 2', 4, 'bob', 5);
INSERT INTO Broadcast VALUES (5, 'awesome broadcast 3', 4, 'helen', 10);

-- populate Thumbnail
INSERT INTO Thumbnail VALUES (1, 1, "this is some image data");
INSERT INTO Thumbnail VALUES (2, 2, "this is some image data");
INSERT INTO Thumbnail VALUES (3, 3, "this is some image data");
INSERT INTO Thumbnail VALUES (4, 4, "this is some image data");
INSERT INTO Thumbnail VALUES (5, 5, "this is some image data");

-- populate Comment
INSERT INTO Comment VALUES (10, 1, 'none :(', '1st post', 'gavin');
INSERT INTO Comment VALUES (11, 2, 'none :(', 'thread from 1st post?', 'gavin');
INSERT INTO Comment VALUES (12, 1, 'none :(', '3rd post', 'bob');
INSERT INTO Comment VALUES (13, 1, 'none :(', '4th post', 'gavin');
INSERT INTO Comment VALUES (14, 1, 'none :(', '5th post', 'gavin');

-- populate Posts
INSERT INTO Posts VALUES (1, 'cats');
INSERT INTO Posts VALUES (2, 'cats');
INSERT INTO Posts VALUES (3, 'cats');
INSERT INTO Posts VALUES (4, 'dogs');
INSERT INTO Posts VALUES (5, 'dogs');