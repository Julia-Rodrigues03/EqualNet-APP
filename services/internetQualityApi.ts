
import { httpRequest } from './httpClient';

// A URL pode ser trocada pela variável EXPO_PUBLIC_API_URL (ex.: no arquivo .env)
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  'https://internet-quality-api.onrender.com/api/v1';

// A API roda no plano grátis do Render: a 1ª chamada pode levar de 30 a 60s
const ACTIVITY_TIMEOUT_MS = 60000;

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

// ─── Verificador de atividades (US-18) ───────────────────────────────────────
export type ActivityType =
  | 'VIDEO_CALL'
  | 'AUDIO_CALL'
  | 'STREAMING'
  | 'FILE_UPLOAD'
  | 'WEB_BROWSING'
  | 'MESSAGING';

export interface ActivityCheckResponse {
  model: { id: string; name: string; version: string };
  activity: ActivityType;
  suitable: boolean;
  forecast: {
    quality: 'GOOD' | 'MODERATE' | 'UNSTABLE';
    predictedAvgRttMs: number;
    predictedPacketLossPct: number;
  };
  recommendation: { code: string; message: string };
  metadata: { disclaimer: string; locationPrivacy: string };
}

export interface CheckActivityParams {
  activity: ActivityType;
  latitude: number;
  longitude: number;
  dateTime?: Date;
  modelId?: string;
}

export async function checkActivity({
  activity,
  latitude,
  longitude,
  dateTime = new Date(),
  modelId = 'model-a',
}: CheckActivityParams): Promise<ActivityCheckResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ACTIVITY_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/activity/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        modelId,
        latitude,
        longitude,
        dateTime: dateTime.toISOString(),
        activity,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        response.status === 422
          ? 'A API não aceitou os dados enviados.'
          : `O servidor respondeu com erro (${response.status}).`
      );
    }

    return (await response.json()) as ActivityCheckResponse;
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error('O servidor demorou demais para responder.');
    }
    if (e instanceof TypeError) {
      throw new Error('Sem conexão com o servidor. Verifique sua internet.');
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
