import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function PerfilScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#07111F" />

      <View style={styles.overlay} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.eyebrow}>EQUALNET</Text>
            <Text style={styles.title}>PERFIL DO AGENTE</Text>
          </View>

          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>ATIVO</Text>
          </View>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarBorder}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JR</Text>
            </View>
          </View>

          <Text style={styles.profileName}>Julia Rodrigues</Text>
          <Text style={styles.profileRole}>AGENTE COMUNITÁRIA • PO</Text>

          <View style={styles.regionRow}>
            <Ionicons name="location-outline" size={15} color="#B9D7E7" />
            <Text style={styles.regionText}>Zona Leste • Linha 11</Text>
          </View>

          <View style={styles.agentBadge}>
            <Ionicons
              name="shield-checkmark-outline"
              size={17}
              color="#00E5A8"
            />
            <Text style={styles.agentBadgeText}>Agente EqualNet</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>ESTATÍSTICAS DE IMPACTO</Text>
              <Text style={styles.cardSubtitle}>
                Atuação na rede comunitária
              </Text>
            </View>

            <Ionicons name="analytics-outline" size={26} color="#00E5A8" />
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.greenValue}>142</Text>
              <Text style={styles.statLabel}>Nós Ativos</Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.statBox}>
              <Text style={styles.redValue}>12</Text>
              <Text style={styles.statLabel}>Alertas Mitigados</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>MONITORAMENTO DA REDE</Text>
              <Text style={styles.cardSubtitle}>
                Diagnóstico comunitário
              </Text>
            </View>

            <Ionicons name="pulse-outline" size={26} color="#6ED6FF" />
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricName}>Latência e ping</Text>
            <Text style={styles.metricStatus}>MONITORADO</Text>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricName}>Perda de pacotes</Text>
            <Text style={styles.metricStatus}>MONITORADO</Text>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricName}>Instabilidade de rede</Text>
            <Text style={styles.metricStatus}>PREDITIVO</Text>
          </View>
        </View>

        <View style={styles.impactCard}>
          <View style={styles.impactIcon}>
            <Ionicons name="earth-outline" size={27} color="#00E5A8" />
          </View>

          <View style={styles.impactContent}>
            <Text style={styles.impactTitle}>Impacto EqualNet</Text>
            <Text style={styles.impactText}>
              Monitorando conectividade e contribuindo para uma infraestrutura
              digital mais igualitária.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>
          OBJETIVOS DE DESENVOLVIMENTO SUSTENTÁVEL
        </Text>

        <View style={styles.odsRow}>
          <View style={styles.odsCard}>
            <Text style={styles.odsNumber}>ODS 9</Text>
            <Text style={styles.odsText}>
              Indústria, inovação e infraestrutura
            </Text>
          </View>

          <View style={styles.odsCard}>
            <Text style={styles.odsNumber}>ODS 10</Text>
            <Text style={styles.odsText}>
              Redução das desigualdades
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          EQUALNET • CONECTANDO COMUNIDADES
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07111F",
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(4, 12, 22, 0.46)",
  },

  screen: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 44,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  eyebrow: {
    color: "#00E5A8",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2.2,
    marginBottom: 3,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(14,29,46,0.86)",
    borderWidth: 1,
    borderColor: "#29475B",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#00E5A8",
    marginRight: 7,
  },

  statusText: {
    color: "#00E5A8",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },

  profileCard: {
    alignItems: "center",
    backgroundColor: "rgba(7, 20, 34, 0.80)",
    borderWidth: 1,
    borderColor: "rgba(100, 190, 220, 0.25)",
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 22,
    marginBottom: 18,
  },

  avatarBorder: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2,
    borderColor: "#00E5A8",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(5, 18, 30, 0.86)",
    marginBottom: 15,
  },

  avatar: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: "#10283A",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#00E5A8",
    fontSize: 31,
    fontWeight: "900",
  },

  profileName: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 6,
    textAlign: "center",
  },

  profileRole: {
    color: "#C2D3DF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.9,
    textAlign: "center",
  },

  regionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  regionText: {
    color: "#B9D7E7",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },

  agentBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    backgroundColor: "rgba(0,229,168,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,229,168,0.30)",
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },

  agentBadgeText: {
    color: "#00E5A8",
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 6,
  },

  card: {
    backgroundColor: "rgba(7, 20, 34, 0.82)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(100, 190, 220, 0.20)",
    padding: 20,
    marginBottom: 18,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
  },

  cardSubtitle: {
    color: "#8FA8B9",
    fontSize: 11,
    marginTop: 5,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(160, 210, 230, 0.18)",
    marginVertical: 20,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 5,
  },

  verticalDivider: {
    width: 1,
    backgroundColor: "rgba(160, 210, 230, 0.18)",
  },

  greenValue: {
    color: "#00E5A8",
    fontSize: 31,
    fontWeight: "900",
  },

  redValue: {
    color: "#FF3B5C",
    fontSize: 31,
    fontWeight: "900",
  },

  statLabel: {
    color: "#A9BAC8",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },

  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(160, 210, 230, 0.12)",
  },

  metricName: {
    color: "#D1E0E9",
    fontSize: 12,
    fontWeight: "600",
  },

  metricStatus: {
    color: "#6ED6FF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.9,
  },

  impactCard: {
    flexDirection: "row",
    backgroundColor: "rgba(7, 20, 34, 0.82)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(100, 190, 220, 0.20)",
    padding: 18,
    marginBottom: 22,
  },

  impactIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "rgba(0,229,168,0.09)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  impactContent: {
    flex: 1,
  },

  impactTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 6,
  },

  impactText: {
    color: "#B0C1CD",
    fontSize: 12,
    lineHeight: 18,
  },

  sectionLabel: {
    color: "#9EB2BF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  odsRow: {
    flexDirection: "row",
    gap: 12,
  },

  odsCard: {
    flex: 1,
    backgroundColor: "rgba(7, 20, 34, 0.82)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(100, 190, 220, 0.20)",
    padding: 15,
  },

  odsNumber: {
    color: "#00E5A8",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 7,
  },

  odsText: {
    color: "#AFC0CB",
    fontSize: 11,
    lineHeight: 16,
  },

  footer: {
    color: "#8296A5",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
    textAlign: "center",
    marginTop: 30,
  },
});

export default PerfilScreen;
