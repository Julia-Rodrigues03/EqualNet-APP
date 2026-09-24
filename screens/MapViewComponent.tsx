import React from 'react';
import { StyleSheet, View } from 'react-native'; //importa os componentes básicos do React Native
import { WebView } from 'react-native-webview'; //importa o componente WebView para exibir conteúdo web dentro do aplicativo

export default function MapViewComponent() {
  // HTML contendo a estrutura do Leaflet.js e a configuração do mapa
const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        body, html { margin: 0; padding: 0; height: 100%; width: 100%; }
        #map { height: 100%; width: 100%; }
    </style>
    </head>
    <body>
    <div id="map"></div>
    <script>
        // Inicializa o mapa com coordenadas centrais (Ex: Mogi das Cruzes / Região) e zoom
        var map = L.map('map').setView([-23.5329, -46.1906], 13);

        // Adiciona a camada de visualização do mapa (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Adiciona um marcador de exemplo no mapa
        var marker = L.marker([-23.5329, -46.1906]).addTo(map);
        marker.bindPopup("<b>EqualNet</b><br />Ponto de monitoramento ativo.").openPopup();
    </script>
    </body>
    </html>
`;
// Renderiza o WebView com o conteúdo HTML do mapa
return (
    <View style={styles.container}>
    <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
    />
    </View>
);
}
//cria estilos para o componente do mapa
const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#000',
},
webview: {
    flex: 1,
},
});