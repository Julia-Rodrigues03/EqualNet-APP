import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, TextInput, Image, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';

type Tab = "console" | "mapa" | "metricas" | "rank" | "perfil";
type Screen = "auth" | "app";
type AuthMode = "welcome" | "login" | "register";

// ─── Componente de Navegação Inferior ────────────────────────────────────────
function NavBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
const items: { id: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: "console", label: "Console", icon: "speedometer-outline" },
    { id: "mapa", label: "Mapa", icon: "map-outline" },
    { id: "metricas", label: "Métricas", icon: "stats-chart-outline" },
    { id: "rank", label: "Rank", icon: "trophy-outline" },
    { id: "perfil", label: "Perfil", icon: "person-outline" },
];

    return (
    <View style={styles.navBar}>
    {items.map(({ id, label, icon }) => {
        const active = tab === id;
        return (
        <TouchableOpacity
            key={id}
            onPress={() => setTab(id)}
            style={[styles.navItem, active && styles.navItemActive]}
        >
            <Ionicons name={icon} size={20} color={active ? "#00F5D4" : "#94A3B8"} />
            <Text style={[styles.navLabel, { color: active ? "#00F5D4" : "#94A3B8" }]}>{label}</Text>
        </TouchableOpacity>
        );
    })}
    </View>
);
}

// ─── Tela de inicio Login ou Cadastro ───────────────────────────────────────
function AuthScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
const [mode, setMode] = useState<AuthMode>("welcome");
const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");
const [nome, setNome] = useState("");

    return (
    <View style={styles.centeredScreen}>
    <View style={styles.authContainer}>
        
        {/* Top Badge */}
        <View style={styles.badgeContainer}>
        <View style={styles.greenDotPing} />
        <View style={styles.greenDot} />
        <Text style={styles.badgeText}>EQ_NET_v1.0 • SECURE ACCESS</Text>
        </View>

        <Text style={styles.brandTitle}>EqualNet</Text>
        <Text style={styles.brandSubtitle}>
        Conectando comunidades, medindo o presente e prevendo um futuro digital igualitário.
        </Text>

        {mode === "welcome" && (
        <View style={styles.authButtonContainer}>
            <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setMode("login")}
            >
            <Text style={styles.primaryButtonText}>Entrar na Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setMode("register")}
            >
            <Text style={styles.secondaryButtonText}>Criar Novo Cadastro</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.guestButton}
            onPress={onLoginSuccess}
            >
            <Text style={styles.guestButtonText}>Acessar como Convidado</Text>
            </TouchableOpacity>
        </View>
        )}

        {(mode === "login" || mode === "register") && (
        <View style={styles.formContainer}>
            {mode === "register" && (
            <TextInput
                style={styles.input}
                placeholder="Nome Completo"
                placeholderTextColor="#64748B"
                value={nome}
                onChangeText={setNome}
            />
            )}
            
            <TextInput
            style={styles.input}
            placeholder="E-mail institucional ou pessoal"
            placeholderTextColor="#64748B"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            />

            <TextInput
            style={styles.input}
            placeholder="Senha de acesso"
            placeholderTextColor="#64748B"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            />

            <TouchableOpacity
            style={styles.primaryButton}
            onPress={onLoginSuccess}
            >
            <Text style={styles.primaryButtonText}>
                {mode === "login" ? "Entrar no Sistema →" : "Finalizar Cadastro →"}
            </Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={() => setMode("welcome")}
            style={{ marginTop: 16 }}
            >
            <Text style={styles.backText}>← Voltar</Text>
            </TouchableOpacity>
        </View>
        )}

        <Text style={styles.footerVersion}>
        DISPOSITIVO DE MONITORAMENTO AUTÔNOMO v1.8
        </Text>
    </View>
    </View>
);
}

// ─── Tela 1: Console ─────────────────────────────────────────────────────────
function ConsoleScreen() {
const [download] = useState(505);
const [upload] = useState(346);

    return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.sysReady}>SYS_READY // CON_ID:0010</Text>
    <Text style={styles.title}>EqualNet Console</Text>

      {/* Card de Velocidade */}
    <View style={styles.card}>
        <Text style={styles.cardSubtitle}>VELOCIDADE DA CONEXÃO (AO VIVO)</Text>
        
        <View style={styles.speedRow}>
        <View style={styles.speedBox}>
            <Text style={[styles.speedValue, { color: "#0087f5" }]}>{download}</Text>
            <Text style={styles.speedUnit}>Mbps Download</Text>
        </View>
        <View style={styles.speedBox}>
            <Text style={[styles.speedValue, { color: "#2d04e4" }]}>{upload}</Text>
            <Text style={styles.speedUnit}>Mbps Up</Text>
        </View>
        </View>

        <View style={styles.metricsMiniRow}>
        <Text style={styles.miniText}>PING: <Text style={{ color: "#F59E0B" }}>142ms</Text></Text>
        <Text style={styles.miniText}>PERDA: <Text style={{ color: "#C0132E" }}>8.3%</Text></Text>
        <Text style={styles.miniText}>JITTER: <Text style={{ color: "#F59E0B" }}>22ms</Text></Text>
        </View>
    </View>

      {/* Alerta Preditivo */}
    <View style={styles.alertCard}>
        <View style={styles.rowCenter}>
        <View style={styles.redDot} />
        <Text style={styles.alertTitle}>ALERTA PREDITIVO - ZONA LESTE</Text>
        </View>
        <Text style={styles.alertDesc}>
        Risco de instabilidade elevado nas próximas 4 horas devido ao congestionamento de nós na Zona Leste.
        </Text>
    </View>
    </ScrollView>
);
}
// ─── Tela 2: Mapa (Versão com Imagem Estática Provisorio ) ───────────────────────────────
function MapScreen() {
    return (
    <View style={styles.mapContainer}>
    <Text style={styles.title}>Mapa Geográfico</Text>
    <Text style={styles.subtitle}>Mapeamento de nós na região zona leste.</Text>

      {/* Container da Imagem */}
    <View style={styles.imageWrapper}>
        <Image
source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1000&auto=format&fit=crop' }} 
style={styles.staticMapImage}
resizeMode="cover"
/>
        <View style={styles.mapOverlayBadge}>
        <Text style={styles.mapOverlayText}>📍 MODO ESTÁTICO / SIMULAÇÃO</Text>
        </View>
    </View>
    </View>
);
}

// ─── Tela 3: Métricas ────────────────────────────────────────────────────────
function MetricasScreen() {
    return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.scrollContent}>
    <Text style={styles.title}>Métricas Regionais</Text>
    <View style={styles.card}>
        <Text style={styles.cardSubtitle}>CONFIABILIDADE MÉDIA</Text>
        <Text style={styles.bigNumber}>67.4%</Text>
        <Text style={styles.subtext}>Abaixo da meta estabelecida pelas diretrizes ODS 10.</Text>
    </View>
    <View style={styles.card}>
        <Text style={styles.cardSubtitle}>EXPECTATIVO DE UPLOAD NA REGIÃO</Text>
        <Text style={styles.bigNumber_um}>80.4%</Text>
        <Text style={styles.subtext}>dentro da meta estabelecida pelas diretrizes ODS 10.</Text>
    </View>
    </ScrollView>
);
}

// ─── Tela 4: Rank ────────────────────────────────────────────────────────────
function RankScreen() {
    const comunidades = [
    { pos: 1, nome: "Tatuapé", status: "Estável", score: 92.5, color: "#00C8B4" },
    { pos: 2, nome: "Itaquera", status: "Estável", score: 88.0, color: "#00C8B4" },
    { pos: 3, nome: "Guaianases", status: "Instável", score: 65.2, color: "#F59E0B" },
    { pos: 4, nome: "Mauá", status: "Instável", score: 58.7, color: "#F59E0B" },
    { pos: 5, nome: "Suzano", status: "Crítico", score: 45.2, color: "#C0132E" },
    { pos: 6, nome: "Ferraz de Vasconcelos", status: "Crítico", score: 45.2, color: "#C0132E" },
];

    return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.scrollContent}>
    <Text style={styles.title}>Melhores Cidades com Maior Desempenho</Text>
    {comunidades.map((c) => (
        <View key={c.pos} style={styles.rankCard}>
        <Text style={styles.rankPos}>#{c.pos}</Text>
        <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.rankName}>{c.nome}</Text>
            <Text style={[styles.rankStatus, { color: c.color }]}>{c.status}</Text>
        </View>
        <Text style={[styles.rankScore, { color: c.color }]}>{c.score}</Text>
        </View>
    ))}
    </ScrollView>
    );
}

// ─── Tela 5: Perfil ──────────────────────────────────────────────────────────
function PerfilScreen() {
return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.scrollContent}>
    <View style={styles.profileHeader}>
        <View style={styles.avatar}>
        <Text style={styles.avatarText}>JR</Text>
        </View>
        <Text style={styles.profileName}>Julia Rodrigues</Text>
        <Text style={styles.profileRole}>AGENTE COMUNITÁRIA • PO</Text>
    </View>

    <View style={styles.card}>
        <Text style={styles.cardSubtitle}>ESTATÍSTICAS DE IMPACTO</Text>
        <View style={styles.speedRow}>
        <View style={styles.speedBox}>
            <Text style={styles.speedValue}>142</Text>
            <Text style={styles.speedUnit}>Nós Ativos</Text>
        </View>
        <View style={styles.speedBox}>
            <Text style={[styles.speedValue, { color: "#FF3B5C" }]}>12</Text>
            <Text style={styles.speedUnit}>Alertas Mitigados</Text>
        </View>
        </View>
    </View>
    </ScrollView>
);
}

// ─── App Principal ───────────────────────────────────────────────────────────
export default function App() {
const [screen, setScreen] = useState<Screen>("auth");
const [tab, setTab] = useState<Tab>("console");

if (screen === "auth") {
    return (
    <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#050810" />
        <AuthScreen onLoginSuccess={() => setScreen("app")} />
    </View>
    );
}

return (
    <View style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#050810" />

      {/* Corpo Dinâmico */}
    <View style={styles.contentContainer}>
        {tab === "console" && <ConsoleScreen />}
        {tab === "mapa" && <MapScreen />}
        {tab === "metricas" && <MetricasScreen />}
        {tab === "rank" && <RankScreen />}
        {tab === "perfil" && <PerfilScreen />}
    </View>

      {/* Barra de Navegação */}
    <NavBar tab={tab} setTab={setTab} />
    </View>
);
}