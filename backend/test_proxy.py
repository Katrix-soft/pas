import urllib.request
import json
import sys

url = "http://127.0.0.1:8000/api/v1/quotations/vehicle/automotive"
token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNVQzJlMm15VU5LOVF1Z3NibDFwMiJ9.eyJodHRwczovL3NhbmNvcnNlZ3Vyb3MubmV0L2NsYWltcy90eXBlIjo5LCJodHRwczovL3NhbmNvcnNlZ3Vyb3MubmV0L2NsYWltcy91cG4iOiJvY29yb25lbDIxNjJAUHJvZHVjdG9yQS5jZWliby5zYW5jb3JzZWd1cm9zLmNvbSIsImh0dHBzOi8vc2FuY29yc2VndXJvcy5uZXQvY2xhaW1zL29mZmljZUlkIjo1MDAsIm5pY2tuYW1lIjoib2Nvcm9uZWwyMTYyIiwibmFtZSI6IkNPUk9ORUwgSkFWSUVSIE9TQ0FSIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyL2I1ZDA1NGFhMjk4NTc3MjYxOGU0YTkzY2I5MmUwYTk0P3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGY2oucG5nIiwidXBkYXRlZF9hdCI6IjIwMjYtMDctMDdUMjE6Mzg6MzAuOTU5WiIsImlzcyI6Imh0dHBzOi8vbG9naW4tZGV2LmxvZ2luLWRldi1ncnVwb3NhbmNvcnNlZ3Vyb3MuYXV0aDBhcHAuY29tLyIsImF1ZCI6IkpPc2R0MGFnajVEMU5ucXVBNnpXWmFPZzVHRVpaZ1VQIiwic3ViIjoiYXV0aDB8Y2VpYm98MjA1MTkiLCJpYXQiOjE3ODM0NjAzMTEsImV4cCI6MTc5MTIzNjMxMX0.HEhQPPDEY02SOrI17IMuiVJCM0BsO1wnMDYnwc4Bam9OlGJ7M4N9R3EudWFZPpEF7Gj9h9VZguZnAOfza7JAGddV-3pmqMXn6LEoCIZ1W22HGIsC0qtijeumOh600nJORSunIZSgHXNZLmSSMV8qyXhCITpB1U8imVxTAvsk8VkGMC2szcT_iwreMu7-pGwymnuMb-KuHrXF_wiOyndeS-E95PSSu33t9agLxkhxgIshrR9CI2Zcm4cqOz1VtQP_kCTimIFx6E38UE9zJwXzOK_0sX7ZuclKBAW1HTNgsWIEcxTXGQfBDpKC1pyWqhP-oSTAep0Sou3ZC6PHpW4FgA"

producer_code = int(sys.argv[1]) if len(sys.argv) > 1 else 2162
upper_code = int(sys.argv[2]) if len(sys.argv) > 2 else 2162

headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": f"Bearer {token}",
    "X-dynaTrace": "test-uuid-1234"
}

payload = {
    "vehicleQuotation": {
        "currencyCode": 1,
        "policyVigencyCode": 1,
        "policyPaymentPeriodicityCode": 5,
        "productCode": 44,
        "policyQuotas": 12,
        "policyPeriodStartEffectiveDate": "2026-07-08T00:40:54.698Z",
        "person": {
            "isJuridicPerson": False,
            "identificationType": "D",
            "identificationNumber": 99443221
        },
        "intermediary": {
            "prodProducerCode": producer_code,
            "upperProducerCode": upper_code,
            "statisticCode": 123
        },
        "zone": {
            "postalCode": 2000,
            "cityCode": 320
        },
        "vehicle": {
            "vehicleCode": "VW_GOL_TREND_1.6_2022",
            "vehicleYear": 2022,
            "yearSuggestedValue": 8500000,
            "vehicleUseTypeCode": 2,
            "vehicleTrackingEquipment": False,
            "assistance": {
                "assistance": "sa_02",
                "assistanceProvider": "ibero"
            },
            "zeroKM": False
        }
    }
}

print(f"Probando localmente proxy con prodProducerCode={producer_code}, upperProducerCode={upper_code}...")

try:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    with urllib.request.urlopen(req) as res:
        print("Success! Status code:", res.status)
        print("Response:", res.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}: {e.read().decode('utf-8')}")
except Exception as e:
    print("Error general:", e)
