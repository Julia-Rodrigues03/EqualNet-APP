import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, TextInput, Image, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../styles.ts';


type Tab = "console" | "mapa" | "metricas" | "rank" | "perfil";
type Screen = "auth" | "app";
type AuthMode = "welcome" | "login" | "register";

// ─── Tela 2: Mapa (Versão com Imagem Estática Provisorio ) ───────────────────────────────
export function MapScreen() {
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