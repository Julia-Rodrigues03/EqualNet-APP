
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles.ts';
import { simularTesteVelocidadeComProgresso, ResultadoTeste } from '../services/speedtest.ts';

type EstadoTeste = "ocioso" | "testando" | "concluido"; // Define os estados possíveis do teste de velocidade

// ─── Parâmetros do velocímetro ───────────────────────────────────────────────
const TAMANHO_ARQUIVO_MB = 10;  // payload simulado pelo serviço
const VELOCIDADE_MAX = 100;     // fundo de escala do ponteiro (Mbps)
const ANGULO_MIN = -120;        // posição do ponteiro em 0 Mbps
const ANGULO_MAX = 120;         // posição do ponteiro no fundo de escala
const TOTAL_TRACOS = 25;        // marcações ao redor do mostrador

// Cores de status seguindo o padrão do app: estável / instável / crítico
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

// ───────────────────────────── Tela 4: Down ──────────────────────────────────
// Teste de velocidade da conexão: ponteiro animado, barra de progresso e os
// valores de download/ping subindo aos poucos enquanto a medição acontece.
// ─────────────────────────────────────────────────────────────────────────────
export function DownScreen() {
    const [estado, setEstado] = useState<EstadoTeste>("ocioso");
    const [download, setDownload] = useState(0);
    const [ping, setPing] = useState(0);
    const [progresso, setProgresso] = useState(0);
    const [resultado, setResultado] = useState<ResultadoTeste | null>(null);

    const agulha = useRef(new Animated.Value(0)).current;  // 0 a 1 → giro do ponteiro
    const barra = useRef(new Animated.Value(0)).current;   // 0 a 1 → largura da barra
    const montado = useRef(true);

    // evita atualizar o estado caso o usuário troque de aba no meio do teste
    useEffect(() => {
        return () => { montado.current = false; };
    }, []);

    function animarAgulha(mbps: number) {
        Animated.timing(agulha, {
            toValue: Math.min(mbps / VELOCIDADE_MAX, 1),
            duration: 220,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    }

    async function iniciarTeste() {
        if (estado === "testando") return;

        // zera o mostrador antes de começar
        setEstado("testando");
        setResultado(null);
        setDownload(0);
        setPing(0);
        setProgresso(0);
        agulha.setValue(0);
        barra.setValue(0);

        // cada leitura parcial do serviço atualiza a UI na hora
        const final = await simularTesteVelocidadeComProgresso(TAMANHO_ARQUIVO_MB, (leitura) => {
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
        });

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
        testando ? `MEDINDO // PAYLOAD ${TAMANHO_ARQUIVO_MB}MB`
        : estado === "concluido" ? "TESTE CONCLUÍDO // DOWN_ID:0042"
        : "SYS_IDLE // AGUARDANDO TESTE";

    const rotuloBotao =
        testando ? "Testando..."
        : estado === "concluido" ? "Testar Novamente"
        : "Iniciar Teste";

    return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.scrollContent}>
    <Text style={styles.title}>Teste de Conexão</Text>
    <Text style={styles.downStatus}>{rotuloStatus}</Text>

      {/* Velocímetro */}
    <View style={styles.downGauge}>
        <View style={styles.downGaugeRing} />

        {/* Marcações do mostrador */}
        {Array.from({ length: TOTAL_TRACOS }).map((_, i) => {
        const maior = i % 3 === 0;
        const angulo = ANGULO_MIN + (i * (ANGULO_MAX - ANGULO_MIN)) / (TOTAL_TRACOS - 1);
        return (
            <View key={i} style={[styles.downRotWrap, { transform: [{ rotate: `${angulo}deg` }] }]}>
            <View style={[styles.downTick, maior && styles.downTickMajor]} />
            </View>
        );
        })}

        {/* Ponteiro animado */}
        <Animated.View style={[styles.downRotWrap, { transform: [{ rotate: giro }] }]}>
        <View style={[styles.downNeedle, { backgroundColor: corVel, shadowColor: corVel }]} />
        </Animated.View>

        <View style={[styles.downHub, { backgroundColor: corVel }]} />

        {/* Leitura principal */}
        <View style={styles.downGaugeReadout}>
        <Text style={[styles.downGaugeValue, { color: corVel }]}>{download.toFixed(1)}</Text>
        <Text style={styles.downGaugeUnit}>MBPS DOWNLOAD</Text>
        </View>
    </View>

      {/* Progresso do teste */}
    <View style={styles.downProgressTrack}>
        <Animated.View style={[styles.downProgressFill, { width: largura, backgroundColor: corVel }]} />
    </View>
    <Text style={styles.downProgressLabel}>{Math.round(progresso * 100)}%</Text>

      {/* Latência e velocidade em cards */}
    <View style={styles.downStatsRow}>
        <View style={styles.downStatCard}>
        <Text style={styles.downStatLabel}>LATÊNCIA</Text>
        <Text style={[styles.downStatValue, { color: corDoPing(ping) }]}>{ping}</Text>
        <Text style={styles.downStatUnit}>ms (ping)</Text>
        </View>
        <View style={styles.downStatCard}>
        <Text style={styles.downStatLabel}>DOWNLOAD</Text>
        <Text style={[styles.downStatValue, { color: corVel }]}>{download.toFixed(2)}</Text>
        <Text style={styles.downStatUnit}>Mbps</Text>
        </View>
    </View>

      {/* Botão principal */}
    <TouchableOpacity
        onPress={iniciarTeste}
        disabled={testando}
        style={[styles.primaryButton, testando && styles.downButtonDisabled]}
    >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name={testando ? "pulse-outline" : "play"} size={18} color="#090D14" />
        <Text style={[styles.primaryButtonText, { marginLeft: 8 }]}>{rotuloBotao}</Text>
        </View>
    </TouchableOpacity>

    {resultado && (
        <Text style={styles.downTimestamp}>
        Última medição às {new Date(resultado.timestamp).toLocaleTimeString("pt-BR")}
        </Text>
    )}
    </ScrollView>
    );
}
