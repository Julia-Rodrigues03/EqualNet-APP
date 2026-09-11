import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, TextInput, Image, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../styles.ts';

type Tab = "console" | "mapa" | "metricas" | "rank" | "perfil";
type Screen = "auth" | "app";
type AuthMode = "welcome" | "login" | "register";

// ─── Tela 5: Perfil ──────────────────────────────────────────────────────────
export function PerfilScreen() {
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
