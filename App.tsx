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
import { AuthScreen } from './screens/home';


// ─── Tela 1: Console ─────────────────────────────────────────────────────────
import { ConsoleScreen } from './screens/console';


// ─── Tela 2: Mapa (Versão com Imagem Estática Provisorio ) ───────────────────────────────
import { MapScreen } from './screens/mapa';


// ─── Tela 3: Métricas ────────────────────────────────────────────────────────
import { MetricasScreen } from './screens/metricas';


// ─── Tela 4: Rank ────────────────────────────────────────────────────────────
import { RankScreen } from './screens/down';



// ─── Tela 5: Perfil ──────────────────────────────────────────────────────────
import { PerfilScreen } from './screens/perfil';

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