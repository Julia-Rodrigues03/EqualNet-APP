import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function MapViewComponent() {
const [points, setPoints] = useState<[number, number, number][]>([]); // cria um estado para armazenar os pontos de calor
const [loading, setLoading] = useState<boolean>(true); // cria um estado para controlar o carregamento da tela
const webViewRef = useRef<WebView>(null);

useEffect(() => {
    async function loadData() {
    try {
        const response = await fetch('https://internet-quality-api.onrender.com/api/v1/locations'); // chama o endpoint da API
        if (response.ok) {
        const data = await response.json();
        const items = data.items || [];

          // Mapeia os 10 pontos oficiais da API
          // Cada ponto é representado como [latitude, longitude, intensidade]
          // A intensidade é simulada para representar a qualidade do sinal em cada capital
          // Os 10 pontos oficiais da API são: Brasília, São Paulo, Rio de Janeiro, Belo Horizonte, Porto Alegre, Curitiba, Salvador, Recife, Fortaleza e Manaus
        const parsedPoints: [number, number, number][] = items.map((item: any, index: number) => {
            const lat = item.location.latitude;
            const lon = item.location.longitude;
            // Varia a intensidade simulando qualidade para cada capital (0.3 a 1.0)
            const weights = [1.0, 0.7, 0.5, 0.8, 0.6, 0.9, 0.4, 0.3, 0.7, 0.85];
            const weight = weights[index % weights.length];

            return [lat, lon, weight];
        });

        setPoints(parsedPoints);
        webViewRef.current?.postMessage(JSON.stringify(parsedPoints));
        }
    } catch (err) {
        console.warn('Erro ao obter dados da API:', err);
    } finally {
        setLoading(false);
    }
    }

    loadData();
}, []);

// cria uma função para renderizar o conteúdo HTML do mapa com a camada de calor
const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"></script>
    <style>
        * { box-sizing: border-box; }
        body, html { margin: 0; padding: 0; height: 100%; width: 100%; background: #000; }
        #map { height: 100%; width: 100%; }
        .legend {
        position: absolute;
        bottom: 25px;
        right: 12px;
        z-index: 1000;
        background: rgba(18, 18, 18, 0.92);
        color: #fff;
        padding: 8px 12px;
        border-radius: 8px;
        font-family: -apple-system, sans-serif;
        font-size: 11px;
        border: 1px solid rgba(255,255,255,0.12);
        }
        .legend-item { display: flex; align-items: center; margin-bottom: 4px; }
        .legend-color { width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; }
    </style>
    </head>
    <body>
    <div id="map"></div>
      // Adiciona a legenda para os níveis de qualidade de sinal
    <div class="legend">
        <div style="font-weight: 600; margin-bottom: 5px;">Qualidade de Sinal</div>
        <div class="legend-item"><span class="legend-color" style="background: #ff0000;"></span>Crítico / Instável</div>
        <div class="legend-item"><span class="legend-color" style="background: #ff8800;"></span>Instabilidade Média</div>
        <div class="legend-item"><span class="legend-color" style="background: #00ff00;"></span>Estável</div>
    <script>
        // Visão inicial abrangendo as principais capitais brasileiras
        var map = L.map('map', { zoomControl: true }).setView([-15.7801, -47.9292], 4);
        // Adiciona o mapa base do OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        // Adiciona a camada de calor com os pontos recebidos do React Native
        var currentPoints = ${JSON.stringify(points)};
        var heatLayer = null;
        //renderiza a camada de calor com os pontos recebidos do React Native
        function renderHeat(pts) {
        if (!pts || pts.length === 0) return;
        if (heatLayer) map.removeLayer(heatLayer);

        heatLayer = L.heatLayer(pts, {
            radius: 40,
            blur: 25,
            maxZoom: 12,
            max: 1.0,
            minOpacity: 0.5,
            gradient: {
            0.1: '#00ff00',
            0.4: '#ffff00',
            0.7: '#ff8800',
            1.0: '#ff0000'
            }
        }).addTo(map);
        }

        renderHeat(currentPoints);

        window.addEventListener('message', function(event) {
        try {
            var newPoints = JSON.parse(event.data);
            if (Array.isArray(newPoints) && newPoints.length > 0) renderHeat(newPoints);
        } catch(e) {}
        });

        document.addEventListener('message', function(event) {
        try {
            var newPoints = JSON.parse(event.data);
            if (Array.isArray(newPoints) && newPoints.length > 0) renderHeat(newPoints);
        } catch(e) {}
        });
    </script>
    </body>
    </html>
`;

return (
    <View style={styles.container}>
    <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
    />
    </View>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#000',
},
webview: {
    flex: 1,
},
});