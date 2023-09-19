CREATE DATABASE IF NOT EXISTS openspaceapiscraper;

CREATE TABLE IF NOT EXISTS openspacescrapertable(
    scraperID VARCHAR(30) PRIMARY KEY,
    scraperGmail VARCHAR(40) UNIQUE,
    scraperPassword VARCHAR(128),
    scraperToken VARCHAR(40),
    scraperCreationTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS openspacelinkstable(
    websiteid VARCHAR(128) PRIMARY KEY,
    websitebase VARCHAR(512),
    websitelink VARCHAR(512) UNIQUE,
    websiteisscraped BOOLEAN DEFAULT 0,
    scrapedBy VARCHAR(30),
    addedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS openspacejointable(
    gmail VARCHAR(30),
    otphash VARCHAR(32),
    vtoken VARCHAR(35),
    ftoken VARCHAR(35)
);

CREATE TABLE IF NOT EXISTS openspacelogintable(
    gmail VARCHAR(30) PRIMARY KEY,
    ltoken VARCHAR(40) UNIQUE,
    otphash VARCHAR(32)
);

