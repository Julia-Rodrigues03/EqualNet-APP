import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

    authContainer: {
    width: '100%',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
},

badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 24,
},

greenDotPing: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00F5D4',
    opacity: 0.75,
},

greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00F5D4',
    marginRight: 8,
},

badgeText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#94A3B8',
    letterSpacing: 1,
    fontWeight: '600',
},

brandTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
},

brandSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 10,
},

authButtonContainer: {
    width: '100%',
    gap: 12,
},

primaryButton: {
    width: '100%',
    backgroundColor: '#00F5D4',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#00F5D4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
},

primaryButtonText: {
    color: '#090D14',
    fontSize: 16,
    fontWeight: 'bold',
},

secondaryButton: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
},

secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
},

guestButton: {
    paddingVertical: 12,
    alignItems: 'center',
},

guestButtonText: {
    color: '#64748B',
    fontSize: 13,
},

formContainer: {
    width: '100%',
    gap: 14,
},

input: {
    width: '100%',
    backgroundColor: '#121A2B',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 15,
},

backText: {
    color: '#94A3B8',
    textAlign: 'center',
    fontSize: 14,
},

footerVersion: {
    marginTop: 40,
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#475569',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
},

container: {
    flex: 1,
    backgroundColor: "#050810",
},

contentContainer: {
    flex: 1,
},

screenContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
},

scrollContent: {
    paddingBottom: 30,
},

centeredScreen: {
    flex: 1,
    backgroundColor: "#050810",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
},

sysReady: {
    fontFamily: "monospace",
    fontSize: 10,
    color: "#C0132E",
    letterSpacing: 1.5,
    marginBottom: 4,
},

title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
},

subtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 8,
},

card: {
    backgroundColor: "#0D1220",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
},

cardSubtitle: {
    fontSize: 10,
    color: "#94A3B8",
    letterSpacing: 1,
    marginBottom: 12,
},

speedRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
},

speedBox: {
    alignItems: "center",
},

speedValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#C0132E",
},

speedUnit: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
},

metricsMiniRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
},

miniText: {
    fontSize: 10,
    color: "#6B7280",
},

alertCard: {
    backgroundColor: "#1A0A12",
    borderWidth: 1,
    borderColor: "rgba(192,19,46,0.3)",
    borderRadius: 16,
    padding: 16,
},

mapContainer: {
    flex: 1,
    backgroundColor: "#050810",
    padding: 16,
    paddingTop: 48,
    alignItems: "center",
},

imageWrapper: {
    width: '100%',
    height: '70%',
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
},

staticMapImage: {
    width: '100%',
    height: '100%',
},

mapOverlayBadge: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(9, 13, 20, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 212, 0.3)',
},

mapOverlayText: {
    color: '#00F5D4',
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: 'bold',
},


rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
},

redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C0132E",
    marginRight: 8,
},

alertTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
},

alertDesc: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 18,
},

bigNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#00C8B4",
    marginVertical: 4,
},

bigNumber_um: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#2d04e4",
    marginVertical: 4,
},

subtext: {
    fontSize: 12,
    color: "#94A3B8",
},

rankCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D1220",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
},

rankPos: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#94A3B8",
    width: 24,
},

rankName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
},

rankStatus: {
    fontSize: 11,
    marginTop: 2,
},

rankScore: {
    fontSize: 16,
    fontWeight: "bold",
},

profileHeader: {
    alignItems: "center",
    marginVertical: 20,
},

avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1E2952",
    borderWidth: 2,
    borderColor: "#00F5D4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
},

avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
},
profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
},

profileRole: {
    fontSize: 11,
    color: "#00F5D4",
    letterSpacing: 1,
    marginTop: 4,
},

navBar: {
    flexDirection: "row",
    backgroundColor: "#0D1220",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.07)",
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: "space-around",
},

navItem: {
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
},

navItemActive: {
    backgroundColor: "rgba(0, 245, 212, 0.1)",
},

navLabel: {
    fontSize: 10,
    marginTop: 4,
},
});