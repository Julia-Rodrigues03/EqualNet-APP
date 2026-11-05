import React, { useEffect, useRef, useState } from 'react';
import { Text, View, ScrollView, Animated, Easing, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { styles } from '../styles';
import { getNearbyQuality, NearbyResponse } from '../services/internetQualityApi';

// ─── Parâmetros do velocímetro ───────────────────────────────────────────────
const VELOCIDADE_MAX = 100;     // fundo de escala do ponteiro (Mbps)
const ANGULO_MIN = -120;        // posição do ponteiro em 0 Mbps
const ANGULO_MAX = 120;         // posição do ponteiro no fundo de escala
const TOTAL_TRACOS = 25;        // marcações ao redor do mostrador

function corDaVelocidade(mbps: number) {
    if (mbps >= 50) return "#00C8B4";
    if (mbps >= 20) return "#F59E0B";
    return "#C0132E";
}

function corDoPing(ms: number) {
    if (ms <= 20) return "#00C8B4";
    if (ms <= 40) return "#F59E0B";
    return "#C0132E";
}

function corDaQualidade(qualidade: string) {
    const q = qualidade.toUpperCase();
    if (q.includes('GOOD') || q.includes('EXCELLENT')) return "#00C8B4";
    if (q.includes('POOR') || q.includes('BAD')) return "#C0132E";
    return "#F59E0B";
}

function nomeDaQualidade(qualidade: string) {
    const q = qualidade.toUpperCase();
    if (q.includes('GOOD') || q.includes('EXCELLENT')) return "BOA";
    if (q.includes('POOR') || q.includes('BAD')) return "RUIM";
    if (q.includes('MODERATE')) return "MODERADA";
    return qualidade;
}

function formatarDataPrevisao(data: string) {
    const dataFormatada = new Date(data);
    if (Number.isNaN(dataFormatada.getTime())) return data;
    return dataFormatada.toLocaleString("pt-BR");
}

export function DownScreen() {
    const [download, setDownload] = useState(0);
    const [ping, setPing] = useState(0);
    const [previsaoQualidade, setPrevisaoQualidade] = useState<NearbyResponse | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const agulha = useRef(new Animated.Value(0)).current;
    const montado = useRef(true);

    function animarAgulha(mbps: number) {
        Animated.timing(agulha, {
            toValue: Math.min(mbps / VELOCIDADE_MAX, 1),
            duration: 900,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    }

    async function carregarTelemetria() {
        setCarregando(true);
        setErro(null);

        try {
            const permissao = await Location.requestForegroundPermissionsAsync();
            if (!permissao.granted) {
                throw new Error("Autorize o GPS para consultar as métricas locais de rede.");
            }

            const localizacao = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const dados = await getNearbyQuality(
                localizacao.coords.latitude,
                localizacao.coords.longitude
            );

            if (!montado.current) return;

            setPrevisaoQualidade(dados);

            // Estima a velocidade com base na pontuação de qualidade (0 a 100)
            const velocidadeEstimada = (dados.assessment.qualityScore / 100) * VELOCIDADE_MAX;
            setDownload(velocidadeEstimada);
            setPing(Math.round(dados.prediction.predictedAvgRttMs));
            animarAgulha(velocidadeEstimada);
        } catch (err) {
            if (!montado.current) return;
            setErro(err instanceof Error ? err.message : "Erro ao carregar dados da conexão.");
        } finally {
            if (montado.current) setCarregando(false);
        }
    }

    useEffect(() => {
        montado.current = true;
        void carregarTelemetria();

        return () => {
            montado.current = false;
        };
    }, []);

    const giro = agulha.interpolate({
        inputRange: [0, 1],
        outputRange: [`${ANGULO_MIN}deg`, `${ANGULO_MAX}deg`],
    });

    const corVel = corDaVelocidade(download);

    return (
        <ScrollView style={styles.screenContainer} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Qualidade da Conexão</Text>
            <Text style={styles.downStatus}>
                {carregando ? "SINCRONIZANDO COM A REDE..." : "TELEMETRIA ATIVA // PREDIÇÃO"}
            </Text>

            {/* Velocímetro passivo */}
            <View style={styles.downGauge}>
                <View style={styles.downGaugeRing} />

                {Array.from({ length: TOTAL_TRACOS }).map((_, i) => {
                    const maior = i % 3 === 0;
                    const angulo = ANGULO_MIN + (i * (ANGULO_MAX - ANGULO_MIN)) / (TOTAL_TRACOS - 1);
                    return (
                        <View
                            key={i}
                            style={[
                                styles.downRotWrap,
                                { transform: [{ rotate: `${angulo}deg` }] }
                            ]}
                        >
                            <View style={[styles.downTick, maior && styles.downTickMajor]} />
                        </View>
                    );
                })}

                <Animated.View
                    style={[
                        styles.downRotWrap,
                        { transform: [{ rotate: giro }] }
                    ]}
                >
                    <View
                        style={[
                            styles.downNeedle,
                            { backgroundColor: corVel, shadowColor: corVel }
                        ]}
                    />
                </Animated.View>

                <View style={[styles.downHub, { backgroundColor: corVel }]} />

                <View style={styles.downGaugeReadout}>
                    <Text style={[styles.downGaugeValue, { color: corVel }]}>
                        {download.toFixed(1)}
                    </Text>
                    <Text style={styles.downGaugeUnit}>SCORE DE DESEMPENHO</Text>
                </View>
            </View>

            {/* Cartões de métricas */}
            <View style={styles.downStatsRow}>
                <View style={styles.downStatCard}>
                    <Text style={styles.downStatLabel}>LATÊNCIA (RTT)</Text>
                    <Text style={[styles.downStatValue, { color: corDoPing(ping) }]}>
                        {ping}
                    </Text>
                    <Text style={styles.downStatUnit}>ms</Text>
                </View>

                <View style={styles.downStatCard}>
                    <Text style={styles.downStatLabel}>ESTIMATIVA</Text>
                    <Text style={[styles.downStatValue, { color: corVel }]}>
                        {download.toFixed(0)}/100
                    </Text>
                    <Text style={styles.downStatUnit}>Qualidade</Text>
                </View>
            </View>

            {/* Informações da Previsão */}
            <View
                style={{
                    marginTop: 20,
                    padding: 16,
                    borderRadius: 14,
                    backgroundColor: "#111A28",
                    borderWidth: 1,
                    borderColor: "#26364A"
                }}
            >
                <Text
                    style={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        fontWeight: "700",
                        marginBottom: 12
                    }}
                >
                    DIAGNÓSTICO REGIONAL
                </Text>

                {carregando && (
                    <View style={{ paddingVertical: 10, alignItems: "center" }}>
                        <ActivityIndicator size="small" color="#00C8B4" />
                        <Text style={{ color: "#AAB7C8", fontSize: 13, marginTop: 8 }}>
                            Localizando nó de rede mais próximo...
                        </Text>
                    </View>
                )}

                {erro && (
                    <Text style={{ color: "#FF6B6B", fontSize: 13, lineHeight: 20 }}>
                        {erro}
                    </Text>
                )}

                {previsaoQualidade && !carregando && (
                    <View>
                        <Text
                            style={{
                                color: corDaQualidade(previsaoQualidade.assessment.quality),
                                fontSize: 22,
                                fontWeight: "800",
                                marginBottom: 4
                            }}
                        >
                            {nomeDaQualidade(previsaoQualidade.assessment.quality)}
                        </Text>

                        <Text style={{ color: "#AAB7C8", fontSize: 12, marginBottom: 14 }}>
                            Índice de estabilidade: {previsaoQualidade.assessment.qualityScore}/100
                        </Text>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginBottom: 12
                            }}
                        >
                            <View>
                                <Text style={{ color: "#AAB7C8", fontSize: 11 }}>LATÊNCIA PREVISTA</Text>
                                <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}>
                                    {previsaoQualidade.prediction.predictedAvgRttMs.toFixed(1)} ms
                                </Text>
                            </View>

                            <View>
                                <Text style={{ color: "#AAB7C8", fontSize: 11 }}>PERDA DE PACOTES</Text>
                                <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}>
                                    {previsaoQualidade.prediction.predictedPacketLossPct.toFixed(1)}%
                                </Text>
                            </View>
                        </View>

                        <Text style={{ color: "#FFFFFF", fontSize: 13, lineHeight: 20, marginBottom: 12 }}>
                            {previsaoQualidade.recommendation.message}
                        </Text>

                        <Text style={{ color: "#AAB7C8", fontSize: 11, marginBottom: 8 }}>
                            Previsão referente a: {formatarDataPrevisao(previsaoQualidade.prediction.predictionFor)}
                        </Text>

                        <Text style={{ color: "#8190A3", fontSize: 10, lineHeight: 16 }}>
                            {previsaoQualidade.metadata.disclaimer}
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}