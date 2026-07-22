// ============================================================
// Modelos para la integración con Mercantil Andina
// vía el backend proxy FastAPI
// ============================================================

/** Representa una marca de vehículo devuelta por /marcas */
export interface MercantilMarca {
  codigo: number;
  desc: string;
}

/** Respuesta del endpoint /marcas */
export interface MercantilMarcasResponse {
  datos: string[]; // Backend devuelve lista de nombres ordenados
}

/** Representa un vehículo (versión) devuelto por /vehiculos o /modelos */
export interface MercantilVehiculo {
  codigo: string;         // código de vehículo (ej: infoauto code)
  desc: string;           // descripción completa
  marca: string;
  modelo?: string;
  anio?: number;
  precio?: number;        // precio sugerido
}

/** Respuesta de /vehiculos */
export interface MercantilVehiculosResponse {
  datos: MercantilVehiculo[];
  total?: number;
}

/** Payload para cotizar un auto en Mercantil Andina */
export interface MercantilCotizarAutoPayload {
  anio: number;
  codigoVehiculo: string;   // código InfoAuto
  tieneGNC: boolean;
  tieneRastreador: boolean;
  prestadorRastreador?: string;
  codigoPostal: number;
  codigoCiudad?: number;
  edadAsegurado: number;
}

/** Item de cobertura en la respuesta de cotización */
export interface MercantilCobertura {
  codigo: string;
  descripcion: string;
  prima: number;
  moneda?: string;
}

/** Respuesta de cotización de Mercantil Andina */
export interface MercantilCotizacionResponse {
  coberturas?: MercantilCobertura[];
  totalPrima?: number;
  [key: string]: any;
}

/** Error genérico del backend */
export interface MercantilError {
  detail?: string;
  message?: string;
}
