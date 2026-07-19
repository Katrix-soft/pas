import asyncio
import os
from dotenv import load_dotenv

# Load env variables
load_dotenv()

from app.services.mercantil_andina import MercantilAndinaClient, MercantilAndinaError

async def test():
    client = MercantilAndinaClient()
    print("Base URL:", client.base_url)
    print("Subscription Key:", client.subscription_key[:4] + "..." if client.subscription_key else "None")
    
    try:
        print("Logging in...")
        await client._login()
        print("Login success! Token:", client._token[:20] + "...")
        
        print("\nFetching marcas...")
        marcas = await client.obtener_marcas()
        print(f"Found {len(marcas)} marcas. First 5:")
        for m in marcas[:5]:
            print(m)
            
        print("\nTesting /vehiculos/v1 with query 'honda'...")
        # Since obtener_modelos_por_marca is currently broken, we will call _request directly
        vehiculos = await client._request(
            "GET",
            "/vehiculos/v1",
            params={
                "q": "honda",
                "anio": 2020,
                "tipo": "AUTO",
                "offset": 1,
                "limit": 10
            }
        )
        print("Vehiculos found:")
        print(vehiculos)
        
    except MercantilAndinaError as e:
        print(f"MercantilAndinaError: Status {e.status_code}, Detail: {e.detail}")
    except Exception as e:
        print("General Error:", e)

if __name__ == "__main__":
    asyncio.run(test())
