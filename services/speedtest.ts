// ─── Serviço: Teste de Velocidade ────────────────────────────────────────────
// Simula um teste de conexão (download + ping) usado pela tela Down.
// ─────────────────────────────────────────────────────────────────────────────

export type ResultadoTeste = {
    downloadMbps: number;   // velocidade final de download em Mbps
    pingMs: number;         // latência medida em milissegundos
    timestamp: string;      // momento em que o teste terminou (ISO)
};

export type ProgressoTeste = {
    progresso: number;      // 0 a 1 — quanto do "arquivo" já foi baixado
    downloadMbps: number;   // leitura parcial da velocidade
    pingMs: number;         // leitura parcial da latência
};

const DURACAO_MS = 1500;    // tempo total simulado de download
const INTERVALO_MS = 100;   // de quanto em quanto tempo a UI recebe uma leitura
const CURVA_SLOW_START = 1.6; // expoente que faz a banda subir aos poucos no início

// ─── Teste simples ───────────────────────────────────────────────────────────
// Retorna apenas o resultado final, sem leituras intermediárias.
export async function simularTesteVelocidade(tamanhoArquivoMB = 10): Promise<ResultadoTeste> {
    const inicio = performance.now();
    // Simulação de download de payload para cálculo
    await new Promise(resolve => setTimeout(resolve, DURACAO_MS));
    const fim = performance.now();

    const duracaoSegundos = (fim - inicio) / 1000;
    const velocidadeMbps = ((tamanhoArquivoMB * 8) / duracaoSegundos).toFixed(2);

    return {
        downloadMbps: Number(velocidadeMbps),
        pingMs: Math.floor(Math.random() * 20) + 10,
        timestamp: new Date().toISOString()
    };
}

// ─── Teste com progresso ─────────────────────────────────────────────────────
// Mesma conta do teste simples, mas emitindo leituras parciais enquanto o
// "download" acontece — é o que permite os valores subirem aos poucos na tela.
export async function simularTesteVelocidadeComProgresso(
    tamanhoArquivoMB = 10,
    onProgresso?: (leitura: ProgressoTeste) => void
): Promise<ResultadoTeste> {
    const inicio = performance.now();
    const pingFinal = Math.floor(Math.random() * 20) + 10;

    await new Promise<void>((resolve) => {
        const timer = setInterval(() => {
            const decorrido = performance.now() - inicio;
            const progresso = Math.min(decorrido / DURACAO_MS, 1);

            // A conexão não entrega a banda cheia de imediato: o volume baixado
            // segue uma curva de slow start, então a velocidade medida sobe
            // gradualmente até chegar no valor real no fim do teste.
            const fracaoBaixada = Math.pow(progresso, CURVA_SLOW_START);
            const mbBaixados = tamanhoArquivoMB * fracaoBaixada;
            const segundos = decorrido / 1000;
            const bruta = segundos > 0 ? (mbBaixados * 8) / segundos : 0;

            // pequena oscilação para a leitura não parecer artificial
            const ruido = progresso < 1 ? 1 + (Math.random() * 0.06 - 0.03) : 1;
            const parcial = bruta * ruido;

            // a latência oscila durante a medição e estabiliza no fim
            const jitter = progresso < 1 ? Math.floor(Math.random() * 7) - 3 : 0;
            const pingParcial = Math.max(1, pingFinal + jitter);

            onProgresso?.({
                progresso,
                downloadMbps: Number(parcial.toFixed(2)),
                pingMs: pingParcial
            });

            if (progresso >= 1) {
                clearInterval(timer);
                resolve();
            }
        }, INTERVALO_MS);
    });

    const fim = performance.now();
    const duracaoSegundos = (fim - inicio) / 1000;
    const velocidadeMbps = ((tamanhoArquivoMB * 8) / duracaoSegundos).toFixed(2);

    return {
        downloadMbps: Number(velocidadeMbps),
        pingMs: pingFinal,
        timestamp: new Date().toISOString()
    };
}
