import React, { useEffect, useRef, useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Animated,
    Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { styles } from '../styles.ts';
import {
    simularTesteVelocidadeComProgresso,
    ResultadoTeste
} from '../services/speedtest.ts';

import { getNearbyQuality } from '../services/internetQualityApi.ts';
import type { NearbyResponse } from '../services/internetQualityApi.ts';

type EstadoTeste = "ocioso" | "testando" | "concluido";

const TAMANHO_ARQUIVO_MB = 10;
const VELOCIDADE_MAX = 100;
const ANGULO_MIN = -120;
const ANGULO_MAX = 120;
const TOTAL_TRACOS = 25;

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

    if (q.includes('GOOD') || q.includes('EXCELLENT')) {
        return "#00C8B4";
    }

    if (q.includes('POOR') || q.includes('BAD')) {
        return "#C0132E";
    }

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

    if (Number.isNaN(dataFormatada.getTime())) {
        return data;
    }

    return dataFormatada.toLocaleString("pt-BR");
}

export function DownScreen() {
    const [estado, setEstado] = useState<EstadoTeste>("ocioso");
    const [download, setDownload] = useState(0);
    const [ping, setPing] = useState(0);
    const [progresso, setProgresso] = useState(0);
    const [resultado, setResultado] = useState<ResultadoTeste | null>(null);

    // Estados da previsão da internet
    const [previsaoQualidade, setPrevisaoQualidade] =
        useState<NearbyResponse | null>(null);

    const [carregandoPrevisao, setCarregandoPrevisao] = useState(false);
    const [erroPrevisao, setErroPrevisao] = useState<string | null>(null);

    const agulha = useRef(new Animated.Value(0)).current;
    const barra = useRef(new Animated.Value(0)).current;
    const montado = useRef(true);

    useEffect(() => {
        montado.current = true;

        return () => {
            montado.current = false;
        };
    }, []);

    function animarAgulha(mbps: number) {
        Animated.timing(agulha, {
            toValue: Math.min(mbps / VELOCIDADE_MAX, 1),
            duration: 220,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    }

    // Solicita GPS e consulta a API de previsão
    async function buscarPrevisaoQualidade() {
        setCarregandoPrevisao(true);
        setPrevisaoQualidade(null);
        setErroPrevisao(null);

        try {
            const permissao =
                await Location.requestForegroundPermissionsAsync();

            if (!permissao.granted) {
                throw new Error(
                    permissao.canAskAgain
                        ? "Permissão de localização não concedida. Autorize o GPS para consultar a previsão."
                        : "Permissão de localização bloqueada. Ative a localização nas configurações do aparelho."
                );
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

        } catch (erro) {
            if (!montado.current) return;

            const mensagem =
                erro instanceof Error
                    ? erro.message
                    : "Não foi possível consultar a previsão da internet.";

            setErroPrevisao(mensagem);

        } finally {
            if (montado.current) {
                setCarregandoPrevisao(false);
            }
        }
    }

    async function iniciarTeste() {
        if (estado === "testando") return;

        setEstado("testando");
        setResultado(null);
        setDownload(0);
        setPing(0);
        setProgresso(0);

        agulha.setValue(0);
        barra.setValue(0);

        // Consulta GPS/API em paralelo com o teste de velocidade
        void buscarPrevisaoQualidade();

        const final = await simularTesteVelocidadeComProgresso(
            TAMANHO_ARQUIVO_MB,
            (leitura) => {
                if (!montado.current) return;

                setDownload(leitura.downloadMbps);
                setPing(leitura.pingMs);
                setProgresso(leitura.progresso);

                animarAgulha(leitura.downloadMbps);

                Animated.timing(barra, {
                    toValue: leitura.progresso,
                    duration: 100,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }).start();
            }
        );

        if (!montado.current) return;

        setDownload(final.downloadMbps);
        setPing(final.pingMs);
        setResultado(final);
        setEstado("concluido");

        animarAgulha(final.downloadMbps);
    }

    const giro = agulha.interpolate({
        inputRange: [0, 1],
        outputRange: [`${ANGULO_MIN}deg`, `${ANGULO_MAX}deg`],
    });

    const largura = barra.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    const testando = estado === "testando";
    const corVel = corDaVelocidade(download);

    const rotuloStatus =
        testando
            ? `MEDINDO // PAYLOAD ${TAMANHO_ARQUIVO_MB}MB`
            : estado === "concluido"
                ? "TESTE CONCLUÍDO // DOWN_ID:0042"
                : "SYS_IDLE // AGUARDANDO TESTE";

    const rotuloBotao =
        testando
            ? "Testando..."
            : estado === "concluido"
                ? "Testar Novamente"
                : "Iniciar Teste";

    const timestampPrevisao = previsaoQualidade
        ? new Date(previsaoQualidade.prediction.predictionFor).getTime()
        : NaN;

    const previsaoExpirada =
        Number.isFinite(timestampPrevisao) &&
        timestampPrevisao < Date.now() - 60 * 60 * 1000;

    const corQualidade = previsaoQualidade
        ? corDaQualidade(previsaoQualidade.assessment.quality)
        : "#F59E0B";

    return (
        <ScrollView
            style={styles.screenContainer}
            contentContainerStyle={styles.scrollContent}
        >
            <Text style={styles.title}>Teste de Conexão</Text>

            <Text style={styles.downStatus}>{rotuloStatus}</Text>

            {/* Velocímetro */}
            <View style={styles.downGauge}>
                <View style={styles.downGaugeRing} />

                {Array.from({ length: TOTAL_TRACOS }).map((_, i) => {
                    const maior = i % 3 === 0;

                    const angulo =
                        ANGULO_MIN +
                        (i * (ANGULO_MAX - ANGULO_MIN)) /
                        (TOTAL_TRACOS - 1);

                    return (
                        <View
                            key={i}
                            style={[
                                styles.downRotWrap,
                                { transform: [{ rotate: `${angulo}deg` }] }
                            ]}
                        >
                            <View
                                style={[
                                    styles.downTick,
                                    maior && styles.downTickMajor
                                ]}
                            />
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
                            {
                                backgroundColor: corVel,
                                shadowColor: corVel
                            }
                        ]}
                    />
                </Animated.View>

                <View
                    style={[
                        styles.downHub,
                        { backgroundColor: corVel }
                    ]}
                />

                <View style={styles.downGaugeReadout}>
                    <Text
                        style={[
                            styles.downGaugeValue,
                            { color: corVel }
                        ]}
                    >
                        {download.toFixed(1)}
                    </Text>

                    <Text style={styles.downGaugeUnit}>
                        MBPS DOWNLOAD
                    </Text>
                </View>
            </View>

            {/* Progresso */}
            <View style={styles.downProgressTrack}>
                <Animated.View
                    style={[
                        styles.downProgressFill,
                        {
                            width: largura,
                            backgroundColor: corVel
                        }
                    ]}
                />
            </View>

            <Text style={styles.downProgressLabel}>
                {Math.round(progresso * 100)}%
            </Text>

            {/* Estatísticas */}
            <View style={styles.downStatsRow}>
                <View style={styles.downStatCard}>
                    <Text style={styles.downStatLabel}>LATÊNCIA</Text>

                    <Text
                        style={[
                            styles.downStatValue,
                            { color: corDoPing(ping) }
                        ]}
                    >
                        {ping}
                    </Text>

                    <Text style={styles.downStatUnit}>
                        ms (ping)
                    </Text>
                </View>

                <View style={styles.downStatCard}>
                    <Text style={styles.downStatLabel}>DOWNLOAD</Text>

                    <Text
                        style={[
                            styles.downStatValue,
                            { color: corVel }
                        ]}
                    >
                        {download.toFixed(2)}
                    </Text>

                    <Text style={styles.downStatUnit}>
                        Mbps
                    </Text>
                </View>
            </View>

            {/* Previsão de qualidade da internet */}
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
                    PREVISÃO DE QUALIDADE DA INTERNET
                </Text>

                {carregandoPrevisao && (
                    <Text style={{ color: "#AAB7C8", fontSize: 13 }}>
                        Obtendo localização e consultando a API...
                    </Text>
                )}

                {erroPrevisao && (
                    <Text
                        style={{
                            color: "#FF6B6B",
                            fontSize: 13,
                            lineHeight: 20
                        }}
                    >
                        {erroPrevisao}
                    </Text>
                )}

                {previsaoQualidade && (
                    <View>
                        <Text
                            style={{
                                color: corQualidade,
                                fontSize: 22,
                                fontWeight: "800",
                                marginBottom: 4
                            }}
                        >
                            {nomeDaQualidade(
                                previsaoQualidade.assessment.quality
                            )}
                        </Text>

                        <Text
                            style={{
                                color: "#AAB7C8",
                                fontSize: 12,
                                marginBottom: 14
                            }}
                        >
                            Pontuação: {previsaoQualidade.assessment.qualityScore}/100
                        </Text>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginBottom: 12
                            }}
                        >
                            <View>
                                <Text style={{ color: "#AAB7C8", fontSize: 11 }}>
                                    LATÊNCIA PREVISTA
                                </Text>

                                <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}>
                                    {previsaoQualidade.prediction.predictedAvgRttMs.toFixed(1)} ms
                                </Text>
                            </View>

                            <View>
                                <Text style={{ color: "#AAB7C8", fontSize: 11 }}>
                                    PERDA DE PACOTES
                                </Text>

                                <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}>
                                    {previsaoQualidade.prediction.predictedPacketLossPct.toFixed(1)}%
                                </Text>
                            </View>
                        </View>

                        <Text
                            style={{
                                color: "#FFFFFF",
                                fontSize: 13,
                                lineHeight: 20,
                                marginBottom: 12
                            }}
                        >
                            {previsaoQualidade.recommendation.message}
                        </Text>

                        <Text
                            style={{
                                color: "#AAB7C8",
                                fontSize: 11,
                                marginBottom: 8
                            }}
                        >
                            Previsão referente a:{" "}
                            {formatarDataPrevisao(
                                previsaoQualidade.prediction.predictionFor
                            )}
                        </Text>

                        {previsaoExpirada && (
                            <Text
                                style={{
                                    color: "#F59E0B",
                                    fontSize: 12,
                                    lineHeight: 18,
                                    marginBottom: 10
                                }}
                            >
                                Atenção: a previsão retornada é referente a um horário passado. Ela não representa a condição atual da sua conexão.
                            </Text>
                        )}

                        <Text
                            style={{
                                color: "#8190A3",
                                fontSize: 10,
                                lineHeight: 16
                            }}
                        >
                            {previsaoQualidade.metadata.disclaimer}
                        </Text>

                        <Text
                            style={{
                                color: "#8190A3",
                                fontSize: 10,
                                lineHeight: 16,
                                marginTop: 6
                            }}
                        >
                            {previsaoQualidade.metadata.locationPrivacy}
                        </Text>
                    </View>
                )}
            </View>

            {/* Botão principal */}
            <TouchableOpacity
                onPress={iniciarTeste}
                disabled={testando}
                style={[
                    styles.primaryButton,
                    testando && styles.downButtonDisabled
                ]}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <Ionicons
                        name={testando ? "pulse-outline" : "play"}
                        size={18}
                        color="#090D14"
                    />

                    <Text
                        style={[
                            styles.primaryButtonText,
                            { marginLeft: 8 }
                        ]}
                    >
                        {rotuloBotao}
                    </Text>
                </View>
            </TouchableOpacity>

            {resultado && (
                <Text style={styles.downTimestamp}>
                    Última medição às{" "}
                    {new Date(resultado.timestamp).toLocaleTimeString("pt-BR")}
                </Text>
            )}
        </ScrollView>
    );
}