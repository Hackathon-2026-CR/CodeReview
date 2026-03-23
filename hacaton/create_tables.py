import mysql.connector
from utils.connection import get_connection, close_connection
import json

connection, cursor = get_connection()

if connection and cursor:
    try:
        # Step 1: Drop old tables to ensure clean schema update
        cursor.execute("DROP TABLE IF EXISTS codes;")
        cursor.execute("DROP TABLE IF EXISTS users;")

        # Step 2: Create tables
        create_users_table = """
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            password VARCHAR(255),
            credits INT,
            `groups` JSON,
            price INT,
            rating DECIMAL(2,1),
            code_languages JSON,
            list_of_codes JSON
        ) ENGINE=InnoDB
        """
        
        create_codes_table = """
        CREATE TABLE IF NOT EXISTS codes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255),
            user_name VARCHAR(100),
            code_languages JSON,
            description TEXT,
            groups_of_code JSON,
            status ENUM('waiting for review', 'review in process', 'reviewed') DEFAULT 'waiting for review',
            reviewer VARCHAR(100) DEFAULT NULL,
            price INT
        ) ENGINE=InnoDB
        """
        
        cursor.execute(create_users_table)
        cursor.execute(create_codes_table)

        empty_list = json.dumps([])
        users_data = [
            ('Jacob', 'pass_jacob', 500, json.dumps(['Google', 'Meta']), 50, 4.8, json.dumps(['Python', 'SQL']), empty_list),
            ('Alice', 'pass_alice', 300, json.dumps(['Amazon']), 35, 4.2, json.dumps(['Java', 'C++']), empty_list),
            ('Bob', 'pass_bob', 150, json.dumps(['Microsoft', 'Netflix']), 40, 3.5, json.dumps(['JavaScript', 'HTML']), empty_list),
            ('Charlie', 'pass_charlie', 120, json.dumps(['Apple']), 60, 4.0, json.dumps(['Swift', 'Objective-C']), empty_list),
            ('David', 'pass_david', 800, json.dumps(['Stripe', 'Square']), 80, 4.9, json.dumps(['Go', 'Rust']), empty_list),
            ('Eve', 'pass_eve', 90, json.dumps(['Uber']), 20, 2.5, json.dumps(['Python']), empty_list),
            ('Frank', 'pass_frank', 450, json.dumps(['Airbnb', 'DoorDash']), 55, 4.7, json.dumps(['Ruby', 'JavaScript']), empty_list),
            ('Grace', 'pass_grace', 200, json.dumps(['Spotify']), 45, 3.8, json.dumps(['C#', 'SQL']), empty_list),
            ('Heidi', 'pass_heidi', 50, json.dumps(['Tesla']), 25, 2.1, json.dumps(['C', 'C++']), empty_list),
            ('Ivan', 'pass_ivan', 600, json.dumps(['Oracle', 'IBM']), 65, 4.5, json.dumps(['Java', 'SQL']), empty_list),
            ('Judy', 'pass_judy', 310, json.dumps(['Intel']), 30, 3.9, json.dumps(['Assembly', 'C']), empty_list),
            ('Kevin', 'pass_kevin', 180, json.dumps(['Adobe']), 50, 4.1, json.dumps(['C++', 'Python']), empty_list),
            ('Laura', 'pass_laura', 25, json.dumps(['Lyft']), 15, 1.5, json.dumps(['JavaScript']), empty_list),
            ('Mallory', 'pass_mallory', 110, json.dumps(['TikTok']), 35, 3.4, json.dumps(['Kotlin', 'Java']), empty_list),
            ('Niaj', 'pass_niaj', 950, json.dumps(['Palantir', 'Snowflake']), 100, 5.0, json.dumps(['Python', 'R', 'SQL']), empty_list),
            ('Olivia', 'pass_olivia', 400, json.dumps(['Salesforce']), 40, 4.3, json.dumps(['Apex', 'Java']), empty_list),
            ('Peggy', 'pass_peggy', 220, json.dumps(['X', 'Meta']), 45, 3.7, json.dumps(['Scala', 'Java']), empty_list),
            ('Rupert', 'pass_rupert', 520, json.dumps(['Slack', 'Discord']), 70, 4.6, json.dumps(['Erlang', 'Elixir']), empty_list),
            ('Sybil', 'pass_sybil', 85, json.dumps(['Zoom']), 20, 2.9, json.dumps(['C++', 'WebRTC']), empty_list),
            ('Trent', 'pass_trent', 340, json.dumps(['GitHub', 'GitLab']), 50, 4.4, json.dumps(['Ruby', 'Go']), empty_list)
        ]

        codes_data = [
            ('Python Aggregator', 'Jacob', json.dumps(['Python', 'SQL']), 'A script to scrape and aggregate data from a REST API.', json.dumps(['Meta', 'Google']), 'waiting for review', None, 45),
            ('Elasticsearch Pipeline', 'Jacob', json.dumps(['Python']), 'Log indexing pipeline pushing to Elasticsearch.', json.dumps(['Amazon', 'Google']), 'review in process', 'Alice', 60),
            ('Kafka Producer', 'Jacob', json.dumps(['Python', 'Java']), 'Distributed message producer for microservices.', json.dumps(['Netflix']), 'reviewed', 'Bob', 50),
            ('MongoDB Queries', 'Jacob', json.dumps(['JavaScript']), 'Complex aggregation pipelines for MongoDB.', json.dumps(['Uber', 'Airbnb']), 'waiting for review', None, 35),
            ('FastAPI Backend', 'Jacob', json.dumps(['Python']), 'REST API implementation using FastAPI and Pydantic.', json.dumps(['Stripe']), 'review in process', 'David', 55),
            ('Redis Cache Stream', 'Jacob', json.dumps(['Python']), 'High-throughput caching layer implementation.', json.dumps(['Spotify']), 'reviewed', 'Eve', 40),
            ('Docker Compose Setup', 'Jacob', json.dumps(['YAML']), 'Orchestration for 5 interdependent containers.', json.dumps(['GitHub']), 'waiting for review', None, 25),
            ('OpenShift Deploy', 'Jacob', json.dumps(['YAML', 'Shell']), 'Deployment configurations for Kubernetes/OpenShift.', json.dumps(['IBM', 'Oracle']), 'review in process', 'Ivan', 70),
            ('Data Cleansing Script', 'Jacob', json.dumps(['Python', 'Pandas']), 'Pandas script to clean corrupted CSV files.', json.dumps(['Apple']), 'reviewed', 'Charlie', 30),
            ('SQL Window Functions', 'Jacob', json.dumps(['SQL']), 'Advanced analytical queries using PARTITION BY.', json.dumps(['Palantir']), 'waiting for review', None, 80),
            ('Java Auth Microservice', 'Alice', json.dumps(['Java']), 'Spring Boot microservice for user authentication.', json.dumps(['Amazon']), 'review in process', 'Frank', 30),
            ('React Dropdown', 'Bob', json.dumps(['JavaScript']), 'React component for a dynamic dropdown menu.', json.dumps(['Microsoft']), 'reviewed', 'Grace', 40),
            ('iOS Map View', 'Charlie', json.dumps(['Swift']), 'iOS app logic for rendering a custom map view.', json.dumps(['Apple']), 'waiting for review', None, 50),
            ('Concurrent Web Scraper', 'David', json.dumps(['Go']), 'High-performance concurrent web scraper in Golang.', json.dumps(['Stripe', 'Google']), 'waiting for review', None, 75),
            ('Simple Calculator', 'Eve', json.dumps(['Python']), 'Basic calculator utility for CLI.', json.dumps(['Uber']), 'reviewed', 'Heidi', 15),
            ('Active Record Migration', 'Frank', json.dumps(['Ruby']), 'Rails active record database migration script.', json.dumps(['Airbnb']), 'review in process', 'Judy', 50),
            ('Unity Character Movement', 'Grace', json.dumps(['C#']), 'C# script for handling 3D character physics.', json.dumps(['Spotify']), 'waiting for review', None, 40),
            ('Custom Memory Allocator', 'Heidi', json.dumps(['C++']), 'Low-level memory allocator for embedded systems.', json.dumps(['Tesla']), 'reviewed', 'Kevin', 20),
            ('Scikit-Learn ML Model', 'Ivan', json.dumps(['Python']), 'Machine learning model predicting house prices.', json.dumps(['Adobe']), 'waiting for review', None, 45),
            ('Express Server Setup', 'Judy', json.dumps(['JavaScript']), 'Basic Node.js Express API server setup.', json.dumps(['Lyft']), 'reviewed', 'Laura', 10)
        ]

        insert_users_query = """
        INSERT INTO users (name, password, credits, `groups`, price, rating, code_languages, list_of_codes)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.executemany(insert_users_query, users_data)
        users_inserted = cursor.rowcount

        insert_codes_query = """
        INSERT INTO codes (title, user_name, code_languages, description, groups_of_code, status, reviewer, price)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.executemany(insert_codes_query, codes_data)
        codes_inserted = cursor.rowcount

        connection.commit()
        print(f"Success! {users_inserted} users and {codes_inserted} codes inserted.")

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
    finally:
        close_connection(connection, cursor)
else:
    print("Execution aborted: Could not connect to the database.")