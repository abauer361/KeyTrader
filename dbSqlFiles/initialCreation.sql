DROP DATABASE IF EXISTS `keytrader`;
CREATE DATABASE `keytrader`;


DROP TABLE IF EXISTS `Channels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Channels` (
  `pkChannel` int(11) NOT NULL AUTO_INCREMENT,
  `Channel_ID` varchar(20) DEFAULT NULL,
  `Server_ID` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`pkChannel`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `Discord_Servers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Discord_Servers` (
  `Server_ID` varchar(50) NOT NULL,
  `Server_Name` varchar(50) DEFAULT NULL,
  `Server_Link` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Server_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `Game_Keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Game_Keys` (
  `Game_PK` int(11) NOT NULL AUTO_INCREMENT,
  `U_ID` varchar(20) DEFAULT NULL,
  `Server_ID` varchar(20) DEFAULT NULL,
  `Key_ID` varchar(10) DEFAULT NULL,
  `Key_name` varchar(50) DEFAULT NULL,
  `Key_price` int(10) DEFAULT NULL,
  `Key_string` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Game_PK`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `NotificationSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `NotificationSettings` (
  `Setting_ID` int(11) NOT NULL AUTO_INCREMENT,
  `newKey` tinyint(1) DEFAULT NULL,
  `claimedKey` tinyint(1) DEFAULT NULL,
  `newUser` tinyint(1) DEFAULT NULL,
  `Server_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`Setting_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Roles` (
  `Role_Name` varchar(20) NOT NULL,
  `User_Role_ID` int(11) NOT NULL,
  `Server_ID` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `UBS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UBS` (
  `UBS_PK` int(11) NOT NULL AUTO_INCREMENT,
  `U_ID` int(11) DEFAULT NULL,
  `Server_ID` int(11) DEFAULT NULL,
  `User_Role_Type` int(11) DEFAULT NULL,
  PRIMARY KEY (`UBS_PK`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `User_Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User_Role` (
  `User_Role_ID` int(11) NOT NULL AUTO_INCREMENT,
  `User_Role_Type` int(11) DEFAULT NULL,
  `User_Role_Def` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`User_Role_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


LOCK TABLES `User_Role` WRITE;
/*!40000 ALTER TABLE `User_Role` DISABLE KEYS */;
INSERT INTO `User_Role` VALUES (1,1,'Admin'),(2,2,'Donor/Recipient'),(3,3,'Donor'),(4,4,'Recipient'),(5,5,'Viewer'),(6,6,'Blocked');
/*!40000 ALTER TABLE `User_Role` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `KeyTraderUsers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `KeyTraderUsers` (
  `Email` varchar(50) DEFAULT NULL,
  `Token` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;



DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `U_ID` varchar(20) NOT NULL,
  `User_Name` varchar(50) DEFAULT NULL,
  `Discord_Token` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`U_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
