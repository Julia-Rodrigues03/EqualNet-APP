import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, TextInput, Image, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../styles.ts';
type Tab = "console" | "mapa" | "metricas" | "down" | "perfil"; // Define os tipos de abas disponíveis no aplicativo
type Screen = "auth" | "app"; // Define os tipos de telas disponíveis no aplicativo
type AuthMode = "welcome" | "login" | "register"; // Define os modos de autenticação disponíveis na tela de login

// ─── Tela 3: Métricas ────────────────────────────────────────────────────────
export function MetricasScreen() {
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
