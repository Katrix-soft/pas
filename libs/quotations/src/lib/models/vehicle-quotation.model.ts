export type IdentificationType = 'D' | 'C' | 'L' | 'I' | 'J'; // DNI | LC | LE | CI | CUIT
export type AssistanceType = 'sa_02' | 'sa1_plus' | 'sa2_plus';
export type AssistanceProvider = 'ibero';

export interface Person {
  identificationNumber?: number;
  identificationType: IdentificationType; // Obligatorio
  isJuridicPerson: boolean; // Obligatorio
}

export interface CoverModuleCode {
  offeringCode: number;
}

export interface DiscountCustomization {
  discountCode: number; // 58 | 90 | 173 (Código numérico de descuento)
  percentage: number;
}

export interface Intermediary {
  prodProducerCode: number; // Obligatorio
  upperProducerCode: number; // Obligatorio
  statisticCode?: number;
}

export interface Zone {
  postalCode: number; // Obligatorio
  cityCode?: number;
}

export interface GncInformation {
  hasGNC: boolean;
  accesoryInsuredSum?: number;
}

export interface Assistance {
  assistance: AssistanceType; // Obligatorio
  assistanceProvider: AssistanceProvider; // Obligatorio
}

export interface Vehicle {
  vehicleCode: string; // Obligatorio
  vehicleYear: number; // Obligatorio
  yearSuggestedValue: number; // Obligatorio
  vehicleUseTypeCode: number; // Obligatorio (2 particular | 4 part/comercial | 7 transporte)
  vehicleTrackingEquipment: boolean; // Obligatorio
  gncInformation?: GncInformation;
  assistance: Assistance; // Obligatorio
  hasAuxiliaryTires?: boolean;
  zeroKM: boolean;
  zeroKMPurchaseDate?: string; // string date-time ISO (Obligatorio solo si zeroKM=true)
}

export interface VehicleQuotationData {
  relationQuotationCode?: number;
  person: Person; // Obligatorio
  coverModuleCodes?: CoverModuleCode[];
  currencyCode: number; // Obligatorio
  discountCustomizations?: DiscountCustomization[];
  policyPeriodStartEffectiveDate: string; // Obligatorio (ISO date-time)
  policyPeriodEndEffectiveDate?: string; // ISO date-time
  coveredItemInsuredSum?: number;
  conditionCode?: number; // 1-8
  respectClientIvaCondition?: boolean;
  intermediary: Intermediary; // Obligatorio
  policyVigencyCode: number; // Obligatorio (1 anual | 2 semestral | 3 trimestral)
  policyPaymentPeriodicityCode: number; // Obligatorio (5 mensual | 7 cuotas)
  policyQuotas: number; // Obligatorio
  productCode: number; // Obligatorio
  zone: Zone; // Obligatorio
  vehicle: Vehicle; // Obligatorio
  driversUnder25?: boolean;
  anualKM?: boolean;
  garageParking?: boolean;
}

export interface VehicleQuotationRequest {
  vehicleQuotation: VehicleQuotationData;
}

// Estructura de error estándar de Sancor Seguros
export interface GssMessage {
  status?: string;
  code: string; // Formato: GSS-XXX-XXX
  text: string;
  help?: string;
}

export interface SancorErrorResponse {
  messages: GssMessage[];
}

// Estructura típica/esperada de respuesta exitosa de cotización de vehículo
export interface VehicleQuotationResponse {
  quotationNumber?: number;
  totalPremium?: number;
  netPremium?: number;
  taxes?: number;
  coverages?: any[];
  [key: string]: any;
}
