import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator,Modal } from 'react-native';
//import { styles } from '../styles.ts';

import { Ionicons } from '@expo/vector-icons';
import { getProbeTimeline, TimelineItem } from '../services/internetQualityApi';

// ─── 7 Estados / Regiões com as Probes cadastradas na API ─────────────────────
interface EstadoMonitorado {
id: number;
probeId: number;
sigla: string;
nome: string;
  latencia: number;      // ms RTT
  perdaPacotes: number;  // %
qualidade: 'ESTÁVEL' | 'ALERTA' | 'CRÍTICO';
  historicoRtt: number[]; // Sparkline dos últimos pontos
}

const ESTADOS_MONITORADOS: EstadoMonitorado[] = [
{
    id: 1,
    probeId: 900001,
    sigla: 'SP',
    nome: 'São Paulo',
    latencia: 24.2,
    perdaPacotes: 0.1,
    qualidade: 'ESTÁVEL',
    historicoRtt: [22, 23, 24, 22, 25, 24, 24],
},
{
    id: 2,
    probeId: 900002,
    sigla: 'RJ',
    nome: 'Rio de Janeiro',
    latencia: 38.5,
    perdaPacotes: 1.2,
    qualidade: 'ALERTA',
    historicoRtt: [30, 32, 45, 36, 40, 35, 38],
},
{
    id: 3,
    probeId: 900003,
    sigla: 'MG',
    nome: 'Minas Gerais',
    latencia: 31.0,
    perdaPacotes: 0.4,
    qualidade: 'ESTÁVEL',
    historicoRtt: [28, 29, 31, 30, 32, 31, 31],
},
{
    id: 4,
    probeId: 900004,
    sigla: 'RS',
    nome: 'Rio Grande do Sul',
    latencia: 78.4,
    perdaPacotes: 4.8,
    qualidade: 'CRÍTICO',
    historicoRtt: [40, 52, 60, 68, 75, 82, 78],
},
{
    id: 5,
    probeId: 900005,
    sigla: 'PR',
    nome: 'Paraná',
    latencia: 29.8,
    perdaPacotes: 0.2,
    qualidade: 'ESTÁVEL',
    historicoRtt: [26, 28, 27, 30, 29, 31, 29],
},
{
    id: 6,
    probeId: 900006,
    sigla: 'BA',
    nome: 'Bahia',
    latencia: 62.1,
    perdaPacotes: 2.5,
    qualidade: 'ALERTA',
    historicoRtt: [45, 48, 55, 60, 58, 65, 62],
},
{
    id: 7,
    probeId: 900007,
    sigla: 'DF',
    nome: 'Distrito Federal',
    latencia: 35.6,
    perdaPacotes: 0.5,
    qualidade: 'ESTÁVEL',
    historicoRtt: [32, 34, 36, 33, 37, 35, 35],
},
];

export function MetricasScreen() {
const [busca, setBusca] = useState('');
  const [favoritos, setFavoritos] = useState<number[]>([1, 2]); // SP e RJ favoritados
const [estadoSelecionado, setEstadoSelecionado] = useState<EstadoMonitorado | null>(null);
const [timeline, setTimeline] = useState<TimelineItem[]>([]);
const [carregandoTimeline, setCarregandoTimeline] = useState(false);
const [modalVisivel, setModalVisivel] = useState(false);
const [erroTimeline, setErroTimeline] = useState<string | null>(null);

    function alternarFavorito(id: number) {
    setFavoritos((prev) =>
    prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
}

const estadosFiltrados = ESTADOS_MONITORADOS.filter(
    (item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase()) ||
    item.sigla.toLowerCase().includes(busca.toLowerCase())
);

  // Consulta longitudinal via API ao tocar no estado

async function abrirLinhaDoTempo(estado: EstadoMonitorado) {
    setEstadoSelecionado(estado);
    setModalVisivel(true);
    setCarregandoTimeline(true);
    setErroTimeline(null);
    setTimeline([]);

    try {
        const resp = await getProbeTimeline(estado.probeId, 'model-a', 12);

        if (resp && resp.timeline) {
            setTimeline(resp.timeline);
        } else {
            setErroTimeline('Não foi possível obter o histórico da sonda.');
        }
    } catch (e) {
        setErroTimeline(
            e instanceof Error
                ? e.message
                : 'Erro ao carregar o histórico da sonda.'
        );
    } finally {
        setCarregandoTimeline(false);
    }
}

function getStatusCor(status: string) {
    if (status === 'CRÍTICO' || status.includes('BAD') || status.includes('POOR')) return '#EF4444';
    if (status === 'ALERTA' || status.includes('MODERATE')) return '#F59E0B';
    return '#10B981';
}

return (
    <View style={styles.container}>
      {/* Cabeçalho no estilo Downdetector / Speedtest */}
    <View style={styles.header}>
        <Text style={styles.headerSubtitle}>MONITORAMENTO DE SONDAS // TELEMETRIA</Text>
        <Text style={styles.headerTitle}>Métricas Regionais</Text>
    </View>

      {/* Barra de Busca */}
    <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#94A3B8" />
        <TextInput
        style={styles.searchInput}
        placeholder="Filtrar por estado (ex: SP, Bahia...)"
        placeholderTextColor="#64748B"
        value={busca}
        onChangeText={setBusca}
        />
    </View>

    <ScrollView style={styles.listaScroll} contentContainerStyle={{ paddingBottom: 30 }}>
        {estadosFiltrados.map((item) => {
        const isFav = favoritos.includes(item.id);
        const cor = getStatusCor(item.qualidade);

        return (
            <TouchableOpacity
            key={item.id}
            style={styles.itemRow}
            activeOpacity={0.7}
            onPress={() => abrirLinhaDoTempo(item)}
            >
              {/* Estrela / Favorito */}
            <TouchableOpacity
                onPress={() => alternarFavorito(item.id)}
                style={styles.favTouch}
            >
                <Ionicons
                name={isFav ? 'star' : 'star-outline'}
                size={20}
                color={isFav ? '#F59E0B' : '#64748B'}
                />
            </TouchableOpacity>

              {/* Informações da Região */}
            <View style={styles.infoCol}>
                <View style={styles.nomeRow}>
                <Text style={styles.itemNome}>{item.nome}</Text>
                <Text style={styles.itemSigla}>{item.sigla}</Text>
                </View>
                <Text style={styles.itemMétricas}>
                RTT: <Text style={{ color: '#E2E8F0', fontWeight: '600' }}>{item.latencia}ms</Text> • Perda: {item.perdaPacotes}%
                </Text>
            </View>

              {/* Ícone de Status de Instabilidade */}
            <View style={styles.statusCol}>
                {item.qualidade === 'CRÍTICO' && (
                <Ionicons name="alert-circle" size={22} color="#EF4444" />
                )}
                {item.qualidade === 'ALERTA' && (
                <Ionicons name="warning" size={20} color="#F59E0B" />
                )}
                {item.qualidade === 'ESTÁVEL' && (
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                )}
            </View>

              {/* Minigráfico (Sparkline) estilizado da variação de latência */}
            <View style={styles.sparklineWrap}>
                {item.historicoRtt.map((ponto, idx) => {
                  const altura = Math.min(Math.max((ponto / 90) * 26, 4), 28);
                return (
                    <View
                    key={idx}
                    style={[
                        styles.sparkBar,
                        {
                        height: altura,
                        backgroundColor: cor,
                        },
                    ]}
                    />
                );
                })}
            </View>
            </TouchableOpacity>
        );
        })}
    </ScrollView>

      {/* Modal com a Linha do Tempo Longitudinal */}
    <Modal visible={modalVisivel} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
            <View>
                <Text style={styles.modalTitle}>Histórico Longitudinal</Text>
                <Text style={styles.modalSub}>{estadoSelecionado?.nome} ({estadoSelecionado?.sigla}) • Sonda #{estadoSelecionado?.probeId}</Text>
            </View>
            <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Ionicons name="close-circle" size={26} color="#94A3B8" />
            </TouchableOpacity>
            </View>

            {carregandoTimeline ? (
    <View style={styles.loadingBox}>
        <ActivityIndicator size="small" color="#00C8B4" />
        <Text style={styles.loadingText}>
            Carregando telemetria longitudinal...
        </Text>
    </View>
) : erroTimeline ? (
    <View style={styles.loadingBox}>
        <Text style={styles.loadingText}>
            {erroTimeline}
        </Text>
    </View>
) : timeline.length === 0 ? (
    <View style={styles.loadingBox}>
        <Text style={styles.loadingText}>
            Nenhum registro disponível para esta sonda.
        </Text>
    </View>
) : (
    <ScrollView style={{ maxHeight: 320 }}>
        {timeline.map((ponto, i) => (
            <View key={i} style={styles.timelineRow}>
                <Text style={styles.timelineTime}>
                    {ponto.predictionFor.includes('T')
                        ? new Date(ponto.predictionFor).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                        : ponto.predictionFor}
                </Text>

                <View style={styles.timelineData}>
                    <Text style={styles.timelineRtt}>
                        RTT: {ponto.predictedAvgRttMs.toFixed(1)}ms
                    </Text>
                    <Text style={styles.timelineLoss}>
                        Perda: {ponto.predictedPacketLossPct.toFixed(1)}%
                    </Text>
                </View>

                <View
                    style={[
                        styles.tagBadge,
                        {
                            backgroundColor:
                                ponto.predictedPacketLossPct > 2
                                    ? '#EF444420'
                                    : '#10B98120',
                        },
                    ]}
                >
                    <Text
                        style={{
                            color:
                                ponto.predictedPacketLossPct > 2
                                    ? '#EF4444'
                                    : '#10B981',
                            fontSize: 10,
                            fontWeight: '700',
                        }}
                    >
                        {ponto.qualityScore || 80}/100
                    </Text>
                </View>
            </View>
        ))}
    </ScrollView>
)}
        </View>
        </View>
    </Modal>
    </View>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#0A0F1A',
    paddingHorizontal: 16,
    paddingTop: 48,
},
header: {
    marginBottom: 16,
},
headerSubtitle: {
    color: '#00C8B4',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
},
headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
},
searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#162032',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#223249',
    marginBottom: 14,
},
searchInput: {
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
},
listaScroll: {
    flex: 1,
},
itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111A28',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1D2A3D',
},
favTouch: {
    paddingRight: 10,
},
infoCol: {
    flex: 1,
},
nomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
},
itemNome: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
},
itemSigla: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: '#1A2436',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
},
itemMétricas: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
},
statusCol: {
    paddingHorizontal: 10,
},
sparklineWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 30,
    gap: 3,
    width: 60,
    justifyContent: 'flex-end',
},
sparkBar: {
    width: 4,
    borderRadius: 2,
},
modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
},
modalContent: {
    backgroundColor: '#111A28',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#26364A',
},
modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
},
modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
},
modalSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
},
loadingBox: {
    paddingVertical: 30,
    alignItems: 'center',
},
loadingText: {
    color: '#AAB7C8',
    fontSize: 12,
    marginTop: 8,
},
timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1A273B',
},
timelineTime: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
    width: 50,
},
timelineData: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 10,
},
timelineRtt: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
},
timelineLoss: {
    color: '#94A3B8',
    fontSize: 13,
},
tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
},
});