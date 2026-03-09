import streamlit as st
import sqlite3

st.set_page_config(page_title="Policy Alert Engine", page_icon="📜")

st.title("📜 Policy Alert Engine Dashboard")

# connect database
conn = sqlite3.connect("bills.db")
cursor = conn.cursor()

cursor.execute("SELECT id, title FROM bills")
bills = cursor.fetchall()

# alert keywords (same as API)
keywords = [
    "animal",
    "wildlife",
    "habitat",
    "poaching",
    "endangered",
    "conservation"
]

alerts = []

for bill in bills:
    title = bill[1].lower()
    for word in keywords:
        if word in title:
            alerts.append(bill)
            break

# overview
st.subheader("📊 Overview")

col1, col2 = st.columns(2)

with col1:
    st.metric("Total Bills Detected", len(bills))

with col2:
    st.metric("Alerts Triggered", len(alerts))

st.divider()

# bills
st.subheader("📄 Detected Policy Bills")

for bill in bills:
    st.write("•", bill[1])

st.divider()

# alerts section
st.subheader("⚠ Policy Alerts")

if len(alerts) == 0:
    st.success("No high-impact environmental bills detected")

else:
    for alert in alerts:
        st.error(alert[1])

conn.close()