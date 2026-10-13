# 🌐 EqualNet

> Conectando comunidades, medindo o presente e prevendo um futuro digital igualitário.

**EqualNet** é um aplicativo mobile desenvolvido em **React Native / Expo** focado em monitoramento de conectividade, previsão preditiva de instabilidade de rede e redução de desigualdades digitais (alinhado aos objetivos das ODS 9 e ODS 10 da ONU).

---

## 📱 Funcionalidades do App

- **Console Digital:** Monitoramento em tempo real de métricas de rede (Download, Upload, Ping, Jitter e Perda de Pacotes).
- **Mapa de Calor (Heatmap) Interativo:** Visualização geoespacial das áreas com sinal crítico, instabilidade moderada e conexão estável via Leaflet e Leaflet.heat.
- **Integração com API Preditiva:** Consumo de dados e classificações em tempo real (`GOOD`, `MODERATE`, `UNSTABLE`) da **Internet Quality API** baseada em dados RIPE Atlas e modelos de Machine Learning.
- **Alerta Preditivo:** Sistema para antecipar quedas de sinal e instabilidade regional.
- **Métricas Regionais:** Comparativo de confiabilidade e desempenho entre distritos.
- **Ranking de Igualdade:** Listagem de comunidades ordenadas por seus índices de desempenho digital.
- **Perfil do Agente:** Painel do usuário com gerenciamento de estatísticas e metas ODS.

---

## 🛠️ Tecnologias Utilizadas

- **React Native** & **Expo** (Framework Mobile)
- **TypeScript** (Tipagem estática)
- **React Native WebView** (Renderização webview segura no app)
- **Leaflet.js & Leaflet.heat** (Renderização do mapa OpenStreetMap e camada de calor)
- **Internet Quality API** (Backend preditivo em FastAPI/Render consumindo dados do RIPE Atlas)
- **Expo Vector Icons** (Biblioteca de ícones)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js**: Versão LTS `>= 20.19.4` (necessária para compatibilidade com Expo SDK 54).
- **npm** instalado.
- Aplicativo **Expo Go** instalado no smartphone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779)).

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SEU-USUARIO/EqualNet.git](https://github.com/SEU-USUARIO/EqualNet.git)
   cd EqualNet
Instale as dependências:

Bash
npm install
Inicie o servidor de desenvolvimento:

Bash
npx expo start -c
💡 Dicas para redes universitárias/corporativas ou iOS:

Redes com firewall/isolamento (Wi-Fi da Faculdade): Se o app não carregar no celular, inicie em modo túnel:

Bash
npx expo start --tunnel -c
No iOS (iPhone): Escaneie o QR Code exibido no terminal diretamente usando o aplicativo Câmera nativo do iOS para abrir no Expo Go.

👥 Equipe de Desenvolvimento
Arthur (DEV)

Gabriel (DEV)

João (DEV)

Julia (PO)

Lucas (SM)

Rodrigo (DEV)
