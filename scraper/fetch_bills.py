import requests

API_KEY = "ckJxyXzeeS8NqnxDWivMuOgyRNn8rvQiLfacHArG"


def fetch_bills():

    url = "https://api.congress.gov/v3/bill"

    params = {
        "api_key": API_KEY,
        "limit": 20
    }

    try:

        response = requests.get(url, params=params)

        data = response.json()

        bills = []

        for bill in data.get("bills", []):
            title = bill.get("title")

            if title:
                bills.append(title)

        return bills

    except Exception as e:

        print("Error fetching bills:", e)
        return []