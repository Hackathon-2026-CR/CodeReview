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
            email VARCHAR(100),
            credits INT DEFAULT 200,
            `groups` JSON DEFAULT NULL,
            price INT DEFAULT NULL,
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
            price INT,
            code TEXT  
        ) ENGINE=InnoDB
        """
        
        cursor.execute(create_users_table)
        cursor.execute(create_tasks_table)
        print("✅ Tables created")

        # Insert users - simplified (name, password, email, credits, groups, price, languages)
        users_data = [
            ('Jacob', 'pass_jacob', 'jacob.dev@example.com', 500, json.dumps(['Google', 'Meta']), 50, json.dumps(['Python', 'SQL'])),
            ('Alice', 'pass_alice', 'alice.code@example.com', 300, json.dumps(['Amazon']), 35, json.dumps(['Java', 'C++'])),
            ('Bob', 'pass_bob', 'bob.web@example.com', 150, json.dumps(['Microsoft', 'Netflix']), 40, json.dumps(['JavaScript', 'HTML'])),
            ('Charlie', 'pass_charlie', 'charlie.ios@example.com', 120, json.dumps(['Apple']), 60, json.dumps(['Swift', 'Objective-C'])),
            ('David', 'pass_david', 'david.sys@example.com', 800, json.dumps(['Stripe', 'Square']), 80, json.dumps(['Go', 'Rust'])),
            ('Eve', 'pass_eve', 'eve.python@example.com', 90, json.dumps(['Uber']), 20, json.dumps(['Python'])),
            ('Frank', 'pass_frank', 'frank.fullstack@example.com', 450, json.dumps(['Airbnb', 'DoorDash']), 55, json.dumps(['Ruby', 'JavaScript'])),
            ('Grace', 'pass_grace', 'grace.dotnet@example.com', 200, json.dumps(['Spotify']), 45, json.dumps(['C#', 'SQL'])),
            ('Heidi', 'pass_heidi', 'heidi.lowlevel@example.com', 50, json.dumps(['Tesla']), 25, json.dumps(['C', 'C++'])),
            ('Ivan', 'pass_ivan', 'ivan.enterprise@example.com', 600, json.dumps(['Oracle', 'IBM']), 65, json.dumps(['Java', 'SQL'])),
            ('Judy', 'pass_judy', 'judy.hardware@example.com', 310, json.dumps(['Intel']), 30, json.dumps(['Assembly', 'C'])),
            ('Kevin', 'pass_kevin', 'kevin.graphics@example.com', 180, json.dumps(['Adobe']), 50, json.dumps(['C++', 'Python'])),
            ('Laura', 'pass_laura', 'laura.frontend@example.com', 25, json.dumps(['Lyft']), 15, json.dumps(['JavaScript'])),
            ('Mallory', 'pass_mallory', 'mallory.mobile@example.com', 110, json.dumps(['TikTok']), 35, json.dumps(['Kotlin', 'Java'])),
            ('Niaj', 'pass_niaj', 'niaj.data@example.com', 950, json.dumps(['Palantir', 'Snowflake']), 100, json.dumps(['Python', 'R', 'SQL'])),
            ('Olivia', 'pass_olivia', 'olivia.salesforce@example.com', 400, json.dumps(['Salesforce']), 40, json.dumps(['Apex', 'Java'])),
            ('Peggy', 'pass_peggy', 'peggy.bigdata@example.com', 220, json.dumps(['X', 'Meta']), 45, json.dumps(['Scala', 'Java'])),
            ('Rupert', 'pass_rupert', 'rupert.distributed@example.com', 520, json.dumps(['Slack', 'Discord']), 70, json.dumps(['Erlang', 'Elixir'])),
            ('Sybil', 'pass_sybil', 'sybil.voip@example.com', 85, json.dumps(['Zoom']), 20, json.dumps(['C++', 'WebRTC'])),
            ('Trent', 'pass_trent', 'trent.devops@example.com', 340, json.dumps(['GitHub', 'GitLab']), 50, json.dumps(['Ruby', 'Go']))
        ]

        # Insert tasks
        tasks_data = [
            ('Python Aggregator', 'Jacob', json.dumps(['Python', 'SQL']), 'A script to scrape data.', json.dumps(['Meta', 'Google']), 'waiting for review', None, 45, None),
            ('Elasticsearch Pipeline', 'Jacob', json.dumps(['Python']), 'Log indexing pipeline.', json.dumps(['Amazon', 'Google']), 'review in process', 'Alice', 60, None),
            ('Kafka Producer', 'Jacob', json.dumps(['Python', 'Java']), 'Distributed message producer.', json.dumps(['Netflix']), 'reviewed', 'Bob', 50, None),
            ('MongoDB Queries', 'Jacob', json.dumps(['JavaScript']), 'Complex aggregation pipelines.', json.dumps(['Uber', 'Airbnb']), 'waiting for review', None, 35, None),
            ('FastAPI Backend', 'Jacob', json.dumps(['Python']), 'REST API implementation.', json.dumps(['Stripe']), 'review in process', 'David', 55, None),
            ('Redis Cache Stream', 'Alice', json.dumps(['Python']), 'High-throughput caching layer.', json.dumps(['Spotify']), 'waiting for review', None, 40, None),
            ('Docker Compose Setup', 'Bob', json.dumps(['YAML']), 'Orchestration for 5 containers.', json.dumps(['GitHub']), 'reviewed', 'Grace', 25, None),
            ('OpenShift Deploy', 'Charlie', json.dumps(['YAML', 'Shell']), 'Deployment configurations.', json.dumps(['IBM', 'Oracle']), 'waiting for review', None, 70, None),
            ('Data Cleansing Script', 'David', json.dumps(['Python', 'Pandas']), 'Pandas script to clean CSVs.', json.dumps(['Apple']), 'review in process', 'Ivan', 30, None),
            ('SQL Window Functions', 'Eve', json.dumps(['SQL']), 'Advanced analytical queries.', json.dumps(['Palantir']), 'reviewed', 'Kevin', 80, None),
            ('Java Auth Microservice', 'Frank', json.dumps(['Java']), 'Spring Boot microservice.', json.dumps(['Amazon']), 'waiting for review', None, 30, None),
            ('React Dropdown', 'Grace', json.dumps(['JavaScript']), 'Dynamic dropdown menu.', json.dumps(['Microsoft']), 'review in process', 'Judy', 40, None),
            ('iOS Map View', 'Heidi', json.dumps(['Swift']), 'iOS app logic for map view.', json.dumps(['public']), 'waiting for review', None, 50, None),
            ('Concurrent Web Scraper', 'Ivan', json.dumps(['Go']), 'Web scraper in Golang.', json.dumps(['Stripe', 'Google']), 'reviewed', 'Laura', 75, None),
            ('Simple Calculator', 'Judy', json.dumps(['Python']), 'Basic calculator utility.', json.dumps(['public']), 'review in process', 'Mallory', 15, None),
            ('Active Record Migration', 'Kevin', json.dumps(['Ruby']), 'Rails database migration.', json.dumps(['Airbnb']), 'waiting for review', None, 50, None),
            ('Unity Character Movement', 'Laura', json.dumps(['C#']), '3D character physics.', json.dumps(['public']), 'reviewed', 'Niaj', 40, None),
            ('Custom Memory Allocator', 'Mallory', json.dumps(['C++']), 'Low-level memory allocator.', json.dumps(['Tesla']), 'waiting for review', None, 20, None),
            ('Scikit-Learn ML Model', 'Niaj', json.dumps(['Python']), 'ML model predicting prices.', json.dumps(['Adobe']), 'review in process', 'Olivia', 45, None),
            ('Express Server Setup', 'Olivia', json.dumps(['JavaScript']), 'Node.js API server.', json.dumps(['Lyft']), 'reviewed', 'Peggy', 10, None)
        ]

        insert_users_query = """
        INSERT INTO users (name, password, email, credits, `groups`, price, languages)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.executemany(insert_users_query, users_data)
        users_inserted = cursor.rowcount

        insert_tasks_query = """
        INSERT INTO tasks (title, user_name, languages, description, `groups`, status, reviewer, price, code)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.executemany(insert_tasks_query, tasks_data)
        tasks_inserted = cursor.rowcount

        connection.commit()
        print(f"✅ Success! {users_inserted} users, {tasks_inserted} tasks inserted")

    except mysql.connector.Error as err:
        print(f"❌ Database error: {err}")
    finally:
        close_connection(connection, cursor)
else:

    print("No database connection")
        print(f"✅ Success! {users_inserted} users, {tasks_inserted} tasks, + code column")

