import requests
import sqlite3

API_KEY = "DEMO_KEY"

url = f"https://api.congress.gov/v3/bill?limit=20&api_key={API_KEY}"

response = requests.get(url)

data = response.json()

# connect database
conn = sqlite3.connect("../bills.db")
cursor = conn.cursor()

# ensure table exists
cursor.execute("""
CREATE TABLE IF NOT EXISTS bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT UNIQUE
)
""")

bills = data.get("bills", [])

for bill in bills:

    title = bill.get("title")

    if not title:
        continue

    try:
        cursor.execute(
            "INSERT OR IGNORE INTO bills (title) VALUES (?)",
            (title,)
        )
    except:
        pass

conn.commit()
conn.close()

print(f"{len(bills)} bills imported successfully")