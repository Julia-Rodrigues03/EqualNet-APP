import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import { styles } from '../styles.ts';

type AuthMode = "welcome" | "login" | "register";

const CREDENCIAIS_FIXAS = {
    email: "admin@equalnet.com",
    senha: "123456",
};

// ─── Tela de inicio Login ou Cadastro ───────────────────────────────────────
export function AuthScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
const [mode, setMode] = useState<AuthMode>("welcome");
const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");
const [nome, setNome] = useState("");
const [error, setError] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);

const limparCampos = () => {
    setEmail("");
    setSenha("");
    setNome("");
};

const validarFormulario = () => {
    const emailLimpo = email.trim();
    const senhaLimpa = senha.trim();

    if (mode === "register" && !nome.trim()) {
        setError("Informe seu nome completo para continuar.");
        return false;
    }

    if (!emailLimpo || !senhaLimpa) {
        setError("Preencha o e-mail e a senha antes de entrar.");
        return false;
    }

    if (!emailLimpo.includes("@") || !emailLimpo.includes(".")) {
        setError("Insira um e-mail válido.");
        return false;
    }

    if (senhaLimpa.length < 6) {
        setError("A senha precisa ter pelo menos 6 caracteres.");
        return false;
    }

    setError("");
    return true;
};

const handleSubmit = () => {
    if (!validarFormulario()) return;

    const emailCorreto = email.trim().toLowerCase() === CREDENCIAIS_FIXAS.email;
    const senhaCorreta = senha.trim() === CREDENCIAIS_FIXAS.senha;

    if (!emailCorreto || !senhaCorreta) {
        setError(`Credenciais inválidas. Use ${CREDENCIAIS_FIXAS.email} / ${CREDENCIAIS_FIXAS.senha}`);
        return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
        setIsSubmitting(false);
        limparCampos();
        onLoginSuccess();
    }, 500);
};

const voltarParaWelcome = () => {
    setMode("welcome");
    setError("");
    limparCampos();
};

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
            onPress={() => {
                setError("");
                onLoginSuccess();
            }}
            >
            <Text style={styles.guestButtonText}>Acessar como Convidado</Text>
            </TouchableOpacity>
        </View>
        )}

        {(mode === "login" || mode === "register") && (
        <View style={styles.formContainer}>
            {error ? <Text style={styles.authErrorText}>{error}</Text> : null}

            {mode === "register" && (
            <TextInput
                style={styles.input}
                placeholder="Nome Completo"
                placeholderTextColor="#64748B"
                value={nome}
                onChangeText={(texto) => {
                    setNome(texto);
                    if (error) setError("");
                }}
            />
            )}
            
            <TextInput
            style={styles.input}
            placeholder="E-mail institucional ou pessoal"
            placeholderTextColor="#64748B"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(texto) => {
                setEmail(texto);
                if (error) setError("");
            }}
            />

            <TextInput
            style={styles.input}
            placeholder="Senha de acesso"
            placeholderTextColor="#64748B"
            secureTextEntry
            value={senha}
            onChangeText={(texto) => {
                setSenha(texto);
                if (error) setError("");
            }}
            />

            <TouchableOpacity
            style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            >
            <Text style={[styles.primaryButtonText, isSubmitting && styles.primaryButtonTextDisabled]}>
                {isSubmitting
                    ? "Entrando..."
                    : mode === "login"
                        ? "Entrar no Sistema →"
                        : "Finalizar Cadastro →"}
            </Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={voltarParaWelcome}
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