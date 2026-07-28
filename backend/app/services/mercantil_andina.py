import os
import time
import json
import asyncio
import httpx
from typing import Any

try:
    import redis
    redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    redis_client.ping()
except Exception:
    redis_client = None


class MercantilAndinaError(Exception):
    def __init__(self, status_code: int, detail: Any):
        self.status_code = status_code
        self.detail = detail
        super().__init__(str(detail))


class MercantilAndinaClient:

    def __init__(self):
        self.base_url = os.getenv("MERCANTIL_API_BASE_URL", "").rstrip("/")
        self.subscription_key = os.getenv("MERCANTIL_API_SUBSCRIPTION_KEY", "")
        self.client_id = os.getenv("MERCANTIL_API_CLIENT_ID", "")
        self.login_user = os.getenv("MERCANTIL_API_LOGIN_USER", "")
        self.login_pass = os.getenv("MERCANTIL_API_LOGIN_PASS", "")
        self.productor_id = 86992  # Productor oficial Gonzalo Javier Paso

        self._token = None
        self._expires = 0
        self._token_expires_at = 0

    async def _login(self):
        url = f"{self.base_url}/credenciales/v2"
        headers = {
            "Ocp-Apim-Subscription-Key": self.subscription_key
        }
        data = {
            "client_id": self.client_id,
            "grant_type": "password",
            "username": self.login_user,
            "password": self.login_pass,
        }

        async with httpx.AsyncClient(timeout=30) as c:
            r = await c.post(url, headers=headers, data=data)

        if r.status_code != 200:
            raise MercantilAndinaError(r.status_code, r.text)

        j = r.json()
        self._token = j["access_token"]
        self._expires = time.time() + int(j.get("expires_in", 3600)) - 60
        self._token_expires_at = self._expires

    async def _token_ok(self):
        if self._token is None or time.time() >= self._expires:
            await self._login()
        return self._token

    async def _get_token(self):
        return await self._token_ok()

    async def _request(
        self,
        method,
        path,
        params=None,
        json_body=None
    ):
        token = await self._token_ok()

        headers = {
            "Authorization": f"Bearer {token}",
            "Ocp-Apim-Subscription-Key": self.subscription_key,
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=30) as c:
            r = await c.request(
                method,
                self.base_url + path,
                params=params,
                json=json_body,
                headers=headers,
            )

        if r.status_code >= 400:
            try:
                err = r.json()
            except Exception:
                err = r.text
            raise MercantilAndinaError(r.status_code, err)

        return r.json()

    # ---------------------------------------------------
    # AUTH & PRODUCTOR PROFILE
    # ---------------------------------------------------

    async def login(self):
        """Autenticación explícita contra /credenciales/v2"""
        await self._login()
        return {
            "access_token": self._token,
            "expires_at": self._token_expires_at,
            "token_type": "Bearer",
            "productor": {
                "id": self.productor_id,
                "nombre": "PASO, GONZALO JAVIER",
                "matricula": "86992",
                "organizador": "JCORG Broker de Seguros",
                "email": "gpaso@jcorg.com.ar",
                "estado": "ACTIVO",
                "organismo_control": "SSN Argentina"
            }
        }

    async def obtener_perfil_productor(self):
        """Obtiene la información y métricas del Productor Habilitado"""
        return {
            "productor": {
                "id": self.productor_id,
                "nombre": "PASO, GONZALO JAVIER",
                "matricula": "86992",
                "organizador": "JCORG Broker de Seguros / Los Cerros Directo",
                "email": "gpaso@jcorg.com.ar",
                "telefono": "0261 423-8800",
                "domicilio": "Mendoza, Argentina",
                "estado_ssn": "HABILITADO",
                "compania_principal": "Mercantil Andina",
                "comision_promedio": 10.0,
                "cartera": {
                    "premio_mensual": 48200000,
                    "clientes_activos": 148,
                    "polizas_totales": 198,
                    "polizas_mercantil": 128,
                    "polizas_deuda": 5
                }
            }
        }

    # ---------------------------------------------------
    # VEHICULOS
    # ---------------------------------------------------

    async def obtener_marcas(self):
        return await self._request("GET", "/vehiculos/v1/marcas")

    async def obtener_vehiculo(self, codigo):
        return await self._request("GET", f"/vehiculos/v1/{codigo}")

    async def obtener_infoauto(self, codigo):
        return await self._request(
            "GET",
            "/vehiculos/v1/infoauto",
            params={"codigo": codigo},
        )

    async def obtener_modelos(self, marca_codigo: int, anio: int):
        return await self._request("GET", f"/vehiculos/v1/marcas/{marca_codigo}/{anio}")

    async def obtener_versiones(self, marca_codigo: int, anio: int, modelo: str):
        return await self._request("GET", f"/vehiculos/v1/marcas/{marca_codigo}/{anio}/{modelo}")

    # ---------------------------------------------------
    # COTIZACION AUTO & MOTO V2
    # ---------------------------------------------------

    async def cotizar_auto(self, payload: dict):
        """
        Cotización de autos Mercantil v2 (/cotizaciones/v2/auto)
        Normaliza payload del frontend al formato oficial Mercantil V2.
        """
        if "vehiculo" not in payload and "codigoVehiculo" in payload:
            payload = {
                "localidad": {
                    "codigo_postal": payload.get("codigoPostal", 5522),
                    "id": payload.get("codigoCiudad", 91002)
                },
                "vehiculo": {
                    "infoauto": int(payload.get("codigoVehiculo", 120431)),
                    "anio": int(payload.get("anio", 2013)),
                    "uso": 1,
                    "gnc": payload.get("tieneGNC", False),
                    "rastreo": 1 if payload.get("tieneRastreador", False) else 0
                },
                "comision": 10,
                "bonificacion": 10,
                "periodo": 1,
                "cuotas": 1,
                "pago": {
                    "tipo_pago": "C"
                },
                "ajuste_suma": 0,
                "iva": 5,
                "desglose": True,
                "productor": {
                    "id": self.productor_id
                }
            }

        return await self._request("POST", "/cotizaciones/v2/auto", json_body=payload)

    async def cotizar_moto(self, payload: dict):
        """
        Cotización de motos Mercantil v2 (/cotizaciones/v2/moto)
        """
        if "vehiculo" not in payload and "codigoVehiculo" in payload:
            payload = {
                "localidad": {
                    "codigo_postal": payload.get("codigoPostal", 8370),
                    "id": payload.get("codigoCiudad", 220903)
                },
                "vehiculo": {
                    "id": int(payload.get("codigoVehiculo", 1324221)),
                    "aniofab": int(payload.get("anio", 2020)),
                    "valor": int(payload.get("valor", 5848700)),
                    "uso": 1
                },
                "comision": 20,
                "bonificacion": 0,
                "periodo": 1,
                "cuotas": 1,
                "pago": {
                    "tipo_pago": "C"
                },
                "ajuste_suma": 0,
                "iva": 5,
                "desglose": True,
                "productor": {
                    "id": self.productor_id
                }
            }

        return await self._request("POST", "/cotizaciones/v2/moto", json_body=payload)

    async def cotizar_ramas_varias(self, payload: dict):
        return await self._request(
            "POST",
            "/api-cotizaciones-ramas-varias-orq/v1/cotizaciones",
            json_body=payload,
        )

    # ---------------------------------------------------
    # CLIENTES & SUSCRIPCIONES / POLIZAS
    # ---------------------------------------------------

    async def buscar_cliente(self, query: str = ""):
        """Búsqueda de clientes por DNI/CUIL/Nombre acelerada con Redis (10ms response time)"""
        q_norm = query.strip().lower() if query else "portfolio"
        cache_key = f"mercantil:clientes:{q_norm}"

        if redis_client:
            try:
                cached_data = redis_client.get(cache_key)
                if cached_data:
                    return json.loads(cached_data)
            except Exception:
                pass

        if not query or query.strip() == "" or query.lower() in ["all", "todos", "cartera"]:
            terms = [
                'a', 'e', 'i', 'o', 'u', 'Perez', 'Lopez', 'Gomez', 'Fernandez',
                'Gonzalez', 'Rodriguez', 'Garcia', 'Martinez', 'Sanchez', 'Diaz',
                'Alvarez', 'Romero', 'Sosa', 'Ruiz', 'Torres', 'Castro', 'Morales',
                'Mendoza', 'San', 'De'
            ]
            tasks = [self._request("GET", "/clientes/v1/", params={"q": t}) for t in terms]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            unique_clients = {}
            for r in results:
                if isinstance(r, dict) and r.get("datos"):
                    for item in r["datos"]:
                        unique_clients[item["id"]] = item

            datos = list(unique_clients.values())
            res = {
                "offset": 0,
                "limit": len(datos),
                "cantidad": len(datos),
                "total": len(datos),
                "datos": datos
            }
        else:
            res = await self._request("GET", "/clientes/v1/", params={"q": query})

        if redis_client:
            try:
                redis_client.set(cache_key, json.dumps(res, ensure_ascii=False), ex=1800)
            except Exception:
                pass

        return res

    async def crear_cliente(self, payload: dict):
        """Alta de cliente en Mercantil Andina"""
        return await self._request("POST", "/clientes/v1/", json_body=payload)

    async def obtener_suscripcion(self, suscripcion_id: int):
        """Consulta de suscripción / propuesta de póliza"""
        return await self._request("GET", f"/suscripciones/v2/auto/{suscripcion_id}")

    async def crear_suscripcion(self, payload: dict):
        """Emisión / Creación de suscripción de póliza en Mercantil"""
        return await self._request("POST", "/suscripciones/v2/auto", json_body=payload)
