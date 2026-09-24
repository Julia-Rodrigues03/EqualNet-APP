import React, { useState } from 'react'; //importa os hooks do React para gerenciar estado e ciclo de vida
import { Text, View, TouchableOpacity, StatusBar } from 'react-native'; //importa os componentes básicos do React Native
import { SafeAreaProvider } from 'react-native-safe-area-context'; //importa o SafeAreaProvider para fornecer contexto de área segura para o aplicativo
import { Ionicons } from '@expo/vector-icons'; //importa os ícones do Ionicons para usar na barra de navegação
import { styles } from './styles'; //importa os estilos globais do aplicativo

type Tab = "console" | "mapa" | "metricas" | "down" | "perfil"; // Define os tipos de abas disponíveis no aplicativo
type Screen = "auth" | "app"; // Define os tipos de telas disponíveis no aplicativo
type AuthMode = "welcome" | "login" | "register"; // Define os modos de autenticação disponíveis na tela de login

// ─── Componente de Navegação Inferior ────────────────────────────────────────
function NavBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
const items: { id: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: "console", label: "Console", icon: "speedometer-outline" },
    { id: "mapa", label: "Mapa", icon: "map-outline" },
    { id: "metricas", label: "Métricas", icon: "bar-chart-outline" },
    { id: "down", label: "Down", icon: "pulse-outline" },
    { id: "perfil", label: "Perfil", icon: "person-outline" },
];
// retorna a barra de navegação inferior com os itens definidos, destacando o item ativo
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

// ─── Importações das Telas ───────────────────────────────────────────────────
import { AuthScreen } from './screens/home';
import { ConsoleScreen } from './screens/console';
import { MapScreen } from './screens/mapa';
import { MetricasScreen } from './screens/metricas';
import { DownScreen } from './screens/down';
import { PerfilScreen } from './screens/perfil';

// ─── App Principal ───────────────────────────────────────────────────────────
export default function App() {
const [screen, setScreen] = useState<Screen>("auth");
const [tab, setTab] = useState<Tab>("console");

// area de proteção para o conteúdo da tela, evitando sobreposição com a barra de status e outros elementos do sistema
return (
    <SafeAreaProvider>
    {screen === "auth" ? (
        <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#050810" />
        <AuthScreen onLoginSuccess={() => setScreen("app")} />
        </View>
    ) : (
        <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#050810" />

          {/* Corpo Dinâmico */}
        <View style={styles.contentContainer}>
            {tab === "console" && <ConsoleScreen />}
            {tab === "mapa" && <MapScreen />}
            {tab === "metricas" && <MetricasScreen />}
            {tab === "down" && <DownScreen />}
            {tab === "perfil" && <PerfilScreen />}
        </View>

          {/* Barra de Navegação */}
        <NavBar tab={tab} setTab={setTab} />
        </View>
)}
    </SafeAreaProvider>
);
}