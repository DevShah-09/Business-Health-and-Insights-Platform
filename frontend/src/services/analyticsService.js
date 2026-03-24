/**
 * Analytics Service — wraps GET /analytics and GET /alerts
 */
import api from './api';

const BUSINESS_ID = '550e8400-e29b-41d4-a716-446655440001';

/** Full analytics payload: KPIs, trend data, category breakdown */
export const getAnalytics = (businessId = BUSINESS_ID) => 
  api.get(`/api/v1/businesses/${businessId}/analytics`, { params: { _: Date.now() } }).then((r) => r.data);

/** Active alerts: critical / warning / info */
export const getAlerts = (businessId = BUSINESS_ID) => 
  api.get(`/api/v1/businesses/${businessId}/alerts`, { params: { _: Date.now() } }).then((r) => r.data);
