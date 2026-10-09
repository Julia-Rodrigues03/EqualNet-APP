import React, { useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { styles } from '../styles.ts';

// ─── Tela 1: Console ─────────────────────────────────────────────────────────
export function ConsoleScreen() {
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