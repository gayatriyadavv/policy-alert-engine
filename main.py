from scraper.fetch_bills import fetch_bills
from ai.generate_draft import generate_draft
from database.db import save_bill, init_db


def run_engine():

    # Initialize database
    init_db()

    # Fetch bills from scraper
    bills = fetch_bills()

    print("\nFetched bills:", len(bills), "\n")

    for bill in bills:

        print("Checking:", bill)

        # Save bill to database
        is_new = save_bill(bill)

        if is_new:

            print("✅ Saved to database")

            try:
                draft = generate_draft(bill)

                print("\n⚠️ POLICY ALERT DETECTED")
                print("Bill:", bill)

                print("\nDraft Comment:")
                print(draft)

            except Exception as e:
                print("AI draft skipped:", e)

        else:

            print("⏩ Bill already exists in database")


if __name__ == "__main__":
    run_engine()