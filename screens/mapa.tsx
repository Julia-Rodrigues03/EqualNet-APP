import React from 'react';
import { Text, StyleSheet, View } from 'react-native'; //importa os componentes básicos do React Native
import { SafeAreaView } from 'react-native-safe-area-context'; //importa o SafeAreaView para proteger o conteúdo da tela
import { styles as globalStyles } from '../styles.ts'; // Importa os estilos globais do arquivo styles.ts
import MapViewComponent from './MapViewComponent'; //importa o componente do mapa

export function MapScreen() {
return (
    // SafeAreaView protege o conteúdo da tela de sobreposição com a barra de status e outros elementos do sistema
    <SafeAreaView style={[globalStyles.container, localStyles.safeArea]} edges={['top']}>
    <Text style={localStyles.title}>Mapa de Monitoramento</Text>

      {/* Caixa que limita o tamanho e arredonda as bordas do mapa */}
    <View style={localStyles.mapContainer}>
        <MapViewComponent />
    </View>
    </SafeAreaView>
);
}
// Estilos locais específicos para a tela do mapa
const localStyles = StyleSheet.create({
safeArea: {
    flex: 1,
    backgroundColor: '#050810',
},
title: {
    color: '#00F5D4',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
},
mapContainer: {
    flex: 1,
    marginHorizontal: 16,     // Deixa margem nas laterais
    marginBottom: 20,         // Afasta da barra inferior
    borderRadius: 20,         // Cantos arredondados
    overflow: 'hidden',       // Recorta o WebView dentro da borda
    borderWidth: 1,           // Borda sutil estilo glassmorphism
    borderColor: 'rgba(0, 245, 212, 0.3)',
},
});