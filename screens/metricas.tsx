import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, TextInput, Image, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../styles.ts';
type Tab = "console" | "mapa" | "metricas" | "rank" | "perfil";
type Screen = "auth" | "app";
type AuthMode = "welcome" | "login" | "register";

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
