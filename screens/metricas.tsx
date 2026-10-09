import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { styles } from '../styles.ts';

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
        <Text style={styles.cardSubtitle}>EXPECTATIVA DE UPLOAD NA REGIÃO</Text>
        <Text style={styles.bigNumber_um}>80.4%</Text>
        <Text style={styles.subtext}>dentro da meta estabelecida pelas diretrizes ODS 10.</Text>
    </View>
    </ScrollView>
);
}
