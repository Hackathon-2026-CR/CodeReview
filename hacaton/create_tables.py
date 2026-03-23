import mysql.connector
from utils.connection import get_connection, close_connection
import json

connection, cursor = get_connection()

if connection and cursor:
    try:
        cursor.execute("DROP TABLE IF EXISTS tasks;")
        cursor.execute("DROP TABLE IF EXISTS users;")

        create_users_table = """
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            password VARCHAR(255),
            credits INT DEFAULT 200,
            `groups` JSON DEFAULT NULL,
            price INT DEFAULT NULL,
            rating DECIMAL(2,1) DEFAULT NULL,
            languages JSON DEFAULT ('[]')
        ) ENGINE=InnoDB
        """
        
        create_tasks_table = """
        CREATE TABLE IF NOT EXISTS tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255),
            user_name VARCHAR(100),
            languages JSON,
            description TEXT,
            `groups` JSON DEFAULT ('["public"]'),
            status ENUM('waiting for review', 'review in process', 'reviewed') DEFAULT 'waiting for review',
            reviewer VARCHAR(100) DEFAULT NULL,
            price INT
        ) ENGINE=InnoDB
        """
        
        cursor.execute(create_users_table)
        cursor.execute(create_tasks_table)

        # Step 4: Dummy Data for Users (Matches new schema: name, password, credits, groups, price, rating, languages)
        users_data = [
            ('Jacob', 'pass_jacob', 500, json.dumps(['Google', 'Meta']), 50, 4.8, json.dumps(['Python', 'SQL'])),
            ('Alice', 'pass_alice', 300, json.dumps(['Amazon']), 35, 4.2, json.dumps(['Java', 'C++'])),
            ('Bob', 'pass_bob', 150, json.dumps(['Microsoft', 'Netflix']), 40, 3.5, json.dumps(['JavaScript', 'HTML'])),
            ('Charlie', 'pass_charlie', 120, json.dumps(['Apple']), 60, 4.0, json.dumps(['Swift', 'Objective-C'])),
            ('David', 'pass_david', 800, json.dumps(['Stripe', 'Square']), 80, 4.9, json.dumps(['Go', 'Rust'])),
            ('Eve', 'pass_eve', 90, json.dumps(['Uber']), 20, 2.5, json.dumps(['Python'])),
            ('Frank', 'pass_frank', 450, json.dumps(['Airbnb', 'DoorDash']), 55, 4.7, json.dumps(['Ruby', 'JavaScript'])),
            ('Grace', 'pass_grace', 200, json.dumps(['Spotify']), 45, 3.8, json.dumps(['C#', 'SQL'])),
            ('Heidi', 'pass_heidi', 50, json.dumps(['Tesla']), 25, 2.1, json.dumps(['C', 'C++'])),
            ('Ivan', 'pass_ivan', 600, json.dumps(['Oracle', 'IBM']), 65, 4.5, json.dumps(['Java', 'SQL'])),
            ('Judy', 'pass_judy', 310, json.dumps(['Intel']), 30, 3.9, json.dumps(['Assembly', 'C'])),
            ('Kevin', 'pass_kevin', 180, json.dumps(['Adobe']), 50, 4.1, json.dumps(['C++', 'Python'])),
            ('Laura', 'pass_laura', 25, json.dumps(['Lyft']), 15, 1.5, json.dumps(['JavaScript'])),
            ('Mallory', 'pass_mallory', 110, json.dumps(['TikTok']), 35, 3.4, json.dumps(['Kotlin', 'Java'])),
            ('Niaj', 'pass_niaj', 950, json.dumps(['Palantir', 'Snowflake']), 100, 5.0, json.dumps(['Python', 'R', 'SQL'])),
            ('Olivia', 'pass_olivia', 400, json.dumps(['Salesforce']), 40, 4.3, json.dumps(['Apex', 'Java'])),
            ('Peggy', 'pass_peggy', 220, json.dumps(['X', 'Meta']), 45, 3.7, json.dumps(['Scala', 'Java'])),
            ('Rupert', 'pass_rupert', 520, json.dumps(['Slack', 'Discord']), 70, 4.6, json.dumps(['Erlang', 'Elixir'])),
            ('Sybil', 'pass_sybil', 85, json.dumps(['Zoom']), 20, 2.9, json.dumps(['C++', 'WebRTC'])),
            ('Trent', 'pass_trent', 340, json.dumps(['GitHub', 'GitLab']), 50, 4.4, json.dumps(['Ruby', 'Go']))
        ]

        # Step 5: Dummy Data for Tasks (Matches new schema: title, user_name, languages, description, groups, status, reviewer, price)
        tasks_data = [
            ('Python Aggregator', 'Jacob', json.dumps(['Python', 'SQL']), 'A script to scrape data.', json.dumps(['Meta', 'Google']), 'waiting for review', None, 45),
            ('Elasticsearch Pipeline', 'Jacob', json.dumps(['Python']), 'Log indexing pipeline.', json.dumps(['Amazon', 'Google']), 'review in process', 'Alice', 60),
            ('Kafka Producer', 'Jacob', json.dumps(['Python', 'Java']), 'Distributed message producer.', json.dumps(['Netflix']), 'reviewed', 'Bob', 50),
            ('MongoDB Queries', 'Jacob', json.dumps(['JavaScript']), 'Complex aggregation pipelines.', json.dumps(['Uber', 'Airbnb']), 'waiting for review', None, 35),
            ('FastAPI Backend', 'Jacob', json.dumps(['Python']), 'REST API implementation.', json.dumps(['Stripe']), 'review in process', 'David', 55),
            ('Redis Cache Stream', 'Jacob', json.dumps(['Python']), 'High-throughput caching layer.', json.dumps(['Spotify']), 'reviewed', 'Eve', 40),
            ('Docker Compose Setup', 'Jacob', json.dumps(['YAML']), 'Orchestration for 5 containers.', json.dumps(['GitHub']), 'waiting for review', None, 25),
            ('OpenShift Deploy', 'Jacob', json.dumps(['YAML', 'Shell']), 'Deployment configurations.', json.dumps(['IBM', 'Oracle']), 'review in process', 'Ivan', 70),
            ('Data Cleansing Script', 'Jacob', json.dumps(['Python', 'Pandas']), 'Pandas script to clean CSVs.', json.dumps(['Apple']), 'reviewed', 'Charlie', 30),
            ('SQL Window Functions', 'Jacob', json.dumps(['SQL']), 'Advanced analytical queries.', json.dumps(['Palantir']), 'waiting for review', None, 80),
            ('Java Auth Microservice', 'Alice', json.dumps(['Java']), 'Spring Boot microservice.', json.dumps(['Amazon']), 'review in process', 'Frank', 30),
            ('React Dropdown', 'Bob', json.dumps(['JavaScript']), 'Dynamic dropdown menu.', json.dumps(['Microsoft']), 'reviewed', 'Grace', 40),
            ('iOS Map View', 'Charlie', json.dumps(['Swift']), 'iOS app logic for map view.', json.dumps(['Apple']), 'waiting for review', None, 50),
            ('Concurrent Web Scraper', 'David', json.dumps(['Go']), 'Web scraper in Golang.', json.dumps(['Stripe', 'Google']), 'waiting for review', None, 75),
            ('Simple Calculator', 'Eve', json.dumps(['Python']), 'Basic calculator utility.', json.dumps(['public']), 'reviewed', 'Heidi', 15), # Using 'public' group
            ('Active Record Migration', 'Frank', json.dumps(['Ruby']), 'Rails database migration.', json.dumps(['Airbnb']), 'review in process', 'Judy', 50),
            ('Unity Character Movement', 'Grace', json.dumps(['C#']), '3D character physics.', json.dumps(['public']), 'waiting for review', None, 40), # Using 'public' group
            ('Custom Memory Allocator', 'Heidi', json.dumps(['C++']), 'Low-level memory allocator.', json.dumps(['Tesla']), 'reviewed', 'Kevin', 20),
            ('Scikit-Learn ML Model', 'Ivan', json.dumps(['Python']), 'ML model predicting prices.', json.dumps(['Adobe']), 'waiting for review', None, 45),
            ('Express Server Setup', 'Judy', json.dumps(['JavaScript']), 'Node.js API server.', json.dumps(['Lyft']), 'reviewed', 'Laura', 10)
        ]

        # Step 6: Execute Inserts
        insert_users_query = """
        INSERT INTO users (name, password, credits, `groups`, price, rating, languages)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.executemany(insert_users_query, users_data)
        users_inserted = cursor.rowcount

        insert_tasks_query = """
        INSERT INTO tasks (title, user_name, languages, description, `groups`, status, reviewer, price)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.executemany(insert_tasks_query, tasks_data)
        tasks_inserted = cursor.rowcount

        connection.commit()
        print(f"Success! {users_inserted} users and {tasks_inserted} tasks inserted.")

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
    finally:
        close_connection(connection, cursor)
else:
    print("Execution aborted: Could not connect to the database.")