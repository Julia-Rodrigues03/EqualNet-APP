
import { httpRequest } from './httpClient';
const API_BASE_URL =
  'https://internet-quality-api.onrender.com/api/v1';

export interface NearbyResponse {
  model: {
    id: string;
    name: string;
    version: string;
  };
  requestedLocation: {
    latitude: number;
    longitude: number;
  };
  matchedProbe: {
    probeId: number;
    distanceKm: number;
  };
  prediction: {
    predictionFor: string;
    predictedAvgRttMs: number;
    predictedPacketLossPct: number;
  };
  assessment: {
    quality: string;
    qualityScore: number;
  };
  recommendation: {
    code: string;
    message: string;
  };
  metadata: {
    disclaimer: string;
    locationPrivacy: string;
  };
}

export interface TimelineItem {
  predictionFor: string;
  predictedAvgRttMs: number;
  predictedPacketLossPct: number;
  quality: string;
  qualityScore: number;
}

export interface TimelineResponse {
  model: {
    id: string;
    name: string;
    version: string;
  };
  probeId: number;
  timeline: TimelineItem[];
}

async function request<T>(endpoint: string): Promise<T> {
  return httpRequest<T>(`${API_BASE_URL}${endpoint}`);
}

export async function getNearbyQuality(
  latitude: number,
  longitude: number,
  modelId: string = 'model-a',
  radiusKm: number = 50
): Promise<NearbyResponse> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    model_id: modelId,
    radius_km: String(radiusKm),
  });

  return request<NearbyResponse>(
    `/forecasts/nearby?${params.toString()}`
  );
}

export async function getProbeTimeline(
  probeId: number,
  modelId: string = 'model-a',
  limit: number = 24
): Promise<TimelineResponse> {
  const params = new URLSearchParams({
    model_id: modelId,
    limit: String(limit),
  });

  return request<TimelineResponse>(
    `/forecasts/probes/${probeId}/timeline?${params.toString()}`
  );
}
