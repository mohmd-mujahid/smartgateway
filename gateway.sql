-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 18, 2024 at 01:13 AM
-- Server version: 8.2.0
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gateway`
--

-- --------------------------------------------------------

--
-- Table structure for table `databaseconnection`
--

DROP TABLE IF EXISTS `databaseconnection`;
CREATE TABLE IF NOT EXISTS `databaseconnection` (
  `systemId` int NOT NULL,
  `databaseHost` text NOT NULL,
  `databaseName` int NOT NULL,
  `username` int NOT NULL,
  `password` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `datatype`
--

DROP TABLE IF EXISTS `datatype`;
CREATE TABLE IF NOT EXISTS `datatype` (
  `systemId` int NOT NULL,
  `dataTypeName` text NOT NULL,
  UNIQUE KEY `systemId` (`systemId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `datatype`
--

INSERT INTO `datatype` (`systemId`, `dataTypeName`) VALUES
(1, 'Soap'),
(2, 'XML'),
(3, 'DataBase'),
(4, 'JSON');

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

DROP TABLE IF EXISTS `service`;
CREATE TABLE IF NOT EXISTS `service` (
  `systemId` int NOT NULL,
  `serviceName` text NOT NULL,
  `dataTypeId` int NOT NULL,
  `serviceURI` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dbTypeId` int DEFAULT NULL,
  `soapMethod` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dbConnection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dbQuery` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`systemId`),
  UNIQUE KEY `systemId` (`systemId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`systemId`, `serviceName`, `dataTypeId`, `serviceURI`, `dbTypeId`, `soapMethod`, `dbConnection`, `dbQuery`) VALUES
(1, 'Soap Service Testing', 1, 'https://www.crcind.com/csp/samples/SOAP.Demo.CLS?WSDL', NULL, 'AddInteger', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `servicedatabasequery`
--

DROP TABLE IF EXISTS `servicedatabasequery`;
CREATE TABLE IF NOT EXISTS `servicedatabasequery` (
  `systemId` int NOT NULL,
  `serviceId` int NOT NULL,
  `query` int NOT NULL,
  UNIQUE KEY `systemId` (`systemId`),
  KEY `serviceId` (`serviceId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
