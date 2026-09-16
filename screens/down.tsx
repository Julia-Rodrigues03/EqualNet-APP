
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, TextInput, Image, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../styles.ts';

type Tab = "console" | "mapa" | "metricas" | "rank" | "perfil";
type Screen = "auth" | "app";
type AuthMode = "welcome" | "login" | "register";




// ───────────────────────────── Tela 4: Rank/down ───────────────────────────────
// Houve  mudança esse tela será substituida por tela de DOWN que é  uma tela que mostrará o status dos servidores mostrando se estão online ou offline, tendo um grafico  em frente ao nome da empresa  para estavel utilizaremos azul e instavel utilizaremos laranja e para critico utilizaremos o vermelho  
// ───────────────────────────────────────────────────────────────────────────────
export function RankScreen() {
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