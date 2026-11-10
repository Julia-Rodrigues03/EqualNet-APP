import React, { useState } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { checkActivity, ActivityCheckResponse, ActivityType } from '../services/internetQualityApi';

// Local usado quando o usuário não libera a localização (centro de São Paulo)
const LOCAL_PADRAO = { latitude: -23.55, longitude: -46.63 };

const ATIVIDADES: { id: ActivityType; label: string; verbo: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'VIDEO_CALL', label: 'Vídeo chamada', verbo: 'vídeo chamadas', icon: 'videocam-outline' },
  { id: 'AUDIO_CALL', label: 'Ligação', verbo: 'ligações', icon: 'call-outline' },
  { id: 'STREAMING', label: 'Streaming', verbo: 'streaming', icon: 'play-circle-outline' },
  { id: 'FILE_UPLOAD', label: 'Enviar arquivos', verbo: 'enviar arquivos', icon: 'cloud-upload-outline' },
  { id: 'WEB_BROWSING', label: 'Navegar', verbo: 'navegar na internet', icon: 'globe-outline' },
  { id: 'MESSAGING', label: 'Mensagens', verbo: 'mensagens', icon: 'chatbubble-outline' },
];

const QUALIDADE = {
  GOOD: { texto: 'boa', cor: '#10B981' },
  MODERATE: { texto: 'razoável', cor: '#F59E0B' },
  UNSTABLE: { texto: 'instável', cor: '#EF4444' },
};

// Resumo grande: verde (boa), amarelo (adequada com ressalvas), vermelho (ruim)
function montarResumo(r: ActivityCheckResponse, verbo: string) {
  const q = QUALIDADE[r.forecast.quality];
  if (r.suitable) return { titulo: `Boa para ${verbo}`, cor: '#10B981', icon: 'checkmark-circle' as const };
  if (r.forecast.quality === 'UNSTABLE') return { titulo: `Ruim para ${verbo}`, cor: q.cor, icon: 'close-circle' as const };
  return { titulo: `Pode falhar em ${verbo}`, cor: '#F59E0B', icon: 'warning' as const };
}

export function ActivityCheckScreen() {
  const [atividade, setAtividade] = useState<ActivityType>('VIDEO_CALL');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ActivityCheckResponse | null>(null);
  const [verboResultado, setVerboResultado] = useState('');

  async function obterLocal() {
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== 'granted') return LOCAL_PADRAO;
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    } catch {
      return LOCAL_PADRAO;
    }
  }

  async function verificar() {
    setCarregando(true);
    setErro(null);
    setResultado(null);
    try {
      const local = await obterLocal();
      const resp = await checkActivity({ activity: atividade, ...local });
      setVerboResultado(ATIVIDADES.find((a) => a.id === atividade)!.verbo);
      setResultado(resp);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível verificar agora.');
    } finally {
      setCarregando(false);
    }
  }

  const resumo = resultado ? montarResumo(resultado, verboResultado) : null;

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerSub}>PREVISÃO DE QUALIDADE</Text>
        <Text style={s.headerTitle}>Posso usar a internet para...?</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={s.grid}>
          {ATIVIDADES.map((a) => {
            const ativo = a.id === atividade;
            return (
              <TouchableOpacity
                key={a.id}
                style={[s.chip, ativo && s.chipAtivo]}
                onPress={() => setAtividade(a.id)}
                disabled={carregando}
              >
                <Ionicons name={a.icon} size={22} color={ativo ? '#00F5D4' : '#94A3B8'} />
                <Text style={[s.chipTxt, ativo && { color: '#00F5D4' }]}>{a.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={[s.botao, carregando && { opacity: 0.6 }]} onPress={verificar} disabled={carregando}>
          <Text style={s.botaoTxt}>Verificar</Text>
        </TouchableOpacity>

        {carregando && (
          <View style={s.caixa}>
            <ActivityIndicator color="#00C8B4" />
            <Text style={s.caixaTxt}>Acordando o servidor, pode levar alguns segundos...</Text>
          </View>
        )}

        {erro && !carregando && (
          <View style={s.caixa}>
            <Ionicons name="cloud-offline-outline" size={32} color="#EF4444" />
            <Text style={s.caixaTxt}>{erro}</Text>
            <TouchableOpacity style={s.botaoSec} onPress={verificar}>
              <Text style={s.botaoSecTxt}>Tentar de novo</Text>
            </TouchableOpacity>
          </View>
        )}

        {resultado && resumo && !carregando && (
          <View style={[s.resultado, { borderColor: resumo.cor }]}>
            <Ionicons name={resumo.icon} size={44} color={resumo.cor} />
            <Text style={[s.resumo, { color: resumo.cor }]}>{resumo.titulo}</Text>
            <Text style={s.mensagem}>{resultado.recommendation.message}</Text>

            <View style={s.linha}>
              <Text style={s.rotulo}>Qualidade prevista</Text>
              <Text style={[s.valor, { color: QUALIDADE[resultado.forecast.quality].cor }]}>
                {QUALIDADE[resultado.forecast.quality].texto}
              </Text>
            </View>
            <View style={s.linha}>
              <Text style={s.rotulo}>Tempo de resposta</Text>
              <Text style={s.valor}>{resultado.forecast.predictedAvgRttMs.toFixed(0)} ms</Text>
            </View>
            <View style={s.linha}>
              <Text style={s.rotulo}>Perda de dados</Text>
              <Text style={s.valor}>{resultado.forecast.predictedPacketLossPct.toFixed(1)}%</Text>
            </View>
            <Text style={s.aviso}>{resultado.metadata.disclaimer}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1A', paddingHorizontal: 16, paddingTop: 48 },
  header: { marginBottom: 16 },
  headerSub: { color: '#00C8B4', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    width: '31%', alignItems: 'center', gap: 6, paddingVertical: 14, borderRadius: 12,
    backgroundColor: '#111A28', borderWidth: 1, borderColor: '#1D2A3D',
  },
  chipAtivo: { borderColor: '#00F5D4', backgroundColor: '#0F2A2E' },
  chipTxt: { color: '#94A3B8', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  botao: { backgroundColor: '#00C8B4', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 18 },
  botaoTxt: { color: '#050810', fontSize: 16, fontWeight: '800' },
  caixa: { alignItems: 'center', gap: 10, marginTop: 24, padding: 16 },
  caixaTxt: { color: '#AAB7C8', fontSize: 14, textAlign: 'center' },
  botaoSec: { borderWidth: 1, borderColor: '#00C8B4', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20 },
  botaoSecTxt: { color: '#00C8B4', fontWeight: '700' },
  resultado: {
    marginTop: 24, padding: 20, borderRadius: 16, borderWidth: 2, backgroundColor: '#111A28', alignItems: 'center',
  },
  resumo: { fontSize: 26, fontWeight: '800', marginTop: 8, textAlign: 'center' },
  mensagem: { color: '#E2E8F0', fontSize: 15, textAlign: 'center', marginTop: 8, marginBottom: 16 },
  linha: {
    flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch',
    paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#1A273B',
  },
  rotulo: { color: '#94A3B8', fontSize: 14 },
  valor: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  aviso: { color: '#64748B', fontSize: 11, marginTop: 12, textAlign: 'center' },
});
