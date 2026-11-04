
/// <reference types="jest" />
import { simularTesteVelocidadeComProgresso } from './services/speedtest';

describe('Validação do Módulo de Telemetria e Testes (EqualNet)', () => {
it('garante que o motor de testes está ativo', () => {
    expect(true).toBe(true);
});

it('executa a medição de velocidade simulada com progresso', async () => {
    const progressoMock = jest.fn();
    const resultado = await simularTesteVelocidadeComProgresso(progressoMock);

    expect(resultado).toBeDefined();
    expect(resultado.downloadMbps).toBeGreaterThan(0);
    expect(resultado.pingMs).toBeGreaterThan(0);
    expect(resultado.timestamp).toBeDefined();
    expect(progressoMock).toHaveBeenCalled();
});
});