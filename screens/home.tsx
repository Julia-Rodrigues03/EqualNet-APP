import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, TextInput, Image, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../styles.ts';

type Tab = "console" | "mapa" | "metricas" | "rank" | "perfil";
type Screen = "auth" | "app";
type AuthMode = "welcome" | "login" | "register";

// ─── Tela de inicio Login ou Cadastro ───────────────────────────────────────
export function AuthScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
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