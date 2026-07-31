import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

from app.services.cooperacion_seguros import CooperacionSegurosClient, CooperacionSegurosError

async def test():
    client = CooperacionSegurosClient()
    print("Base URL:", client.base_url)
    print("Client ID:", client.client_id)
    print("Usuario ID:", client.usuario_id)
    print("Codigo Productor:", client.codigo_productor)

    try:
        print("\nAttempting login...")
        login_res = await client.login()
        print("Login success:", login_res)
    except CooperacionSegurosError as e:
        print(f"CooperacionSegurosError: Status {e.status_code}, Detail: {e.detail}")
    except Exception as e:
        print("General Error:", e)

if __name__ == "__main__":
    asyncio.run(test())
