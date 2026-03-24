/**
 * Insight Service — wraps GET /insights
 */
import api from './api';

const BUSINESS_ID = '550e8400-e29b-41d4-a716-446655440001';

/** AI-generated business insights and recommendations */
export const getInsights = (businessId = BUSINESS_ID) => 
  api.get(`/api/v1/businesses/${businessId}/ai/insights`, { params: { _: Date.now() } }).then((r) => r.data);
