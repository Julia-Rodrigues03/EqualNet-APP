import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import { styles } from '../styles.ts';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'OK' | 'CMD';
type LogEntry = {
  id: number;
  time: string;
  level: LogLevel;
  message: string;
};

const COLORS: Record<LogLevel, string> = {
  INFO: '#94A3B8',
  WARN: '#F59E0B',
  ERROR: '#FB7185',
  OK: '#00F5D4',
  CMD: '#60A5FA',
};

const INITIAL_LOGS: LogEntry[] = [
  {
    id: 1,
    time: '00:00:01',
    level: 'INFO',
    message: 'EqualNet Diagnostic Console v1.0 iniciado.',
  },
  {
    id: 2,
    time: '00:00:01',
    level: 'OK',
    message: 'Interface carregada; monitoramento local ativo.',
  },
  {
    id: 3,
    time: '00:00:02',
    level: 'INFO',
    message: 'Aguardando eventos de diagnóstico...',
  },
];

export function ConsoleScreen() {
  const [download, setDownload] = useState(505);
  const [upload, setUpload] = useState(346);
  const [ping, setPing] = useState(142);
  const [loss, setLoss] = useState(8.3);
  const [jitter, setJitter] = useState(22);

  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [command, setCommand] = useState('');
  const [autoLogs, setAutoLogs] = useState(true);

  const scrollRef = useRef<ScrollView>(null);
  const nextId = useRef(4);
  const startedAt = useRef(Date.now());

  // Adiciona uma entrada ao terminal de logs.
  const addLog = useCallback(
    (level: LogLevel, message: string) => {
      const elapsed = Math.floor(
        (Date.now() - startedAt.current) / 1000,
      );

      const entry: LogEntry = {
        id: nextId.current++,
        time: `${String(Math.floor(elapsed / 3600)).padStart(2, '0')}:${String(
          Math.floor((elapsed % 3600) / 60),
        ).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`,
        level,
        message,
      };

      // Mantém no máximo 100 registros.
      setLogs(previous => [...previous.slice(-99), entry]);
    },
    [],
  );

  // Simula eventos de diagnóstico periodicamente.
  useEffect(() => {
    if (!autoLogs) return;

    const timer = setInterval(() => {
      const events = [
        () => {
          const value = Math.max(
            8,
            Math.round(135 + Math.random() * 25),
          );

          setPing(value);
          addLog(
            value > 150 ? 'WARN' : 'INFO',
            `Latência monitorada: ${value} ms.`,
          );
        },

        () => {
          const value = Number(
            (Math.random() * 2.5).toFixed(1),
          );

          setLoss(value);
          addLog(
            value > 1.5 ? 'WARN' : 'OK',
            `Perda de pacotes: ${value}%.`,
          );
        },

        () => {
          const value = Math.round(15 + Math.random() * 18);

          setJitter(value);
          addLog(
            value > 28 ? 'WARN' : 'INFO',
            `Jitter atualizado: ${value} ms.`,
          );
        },

        () => {
          setDownload(value =>
            Math.max(
              250,
              Math.min(
                650,
                value + Math.round(Math.random() * 30 - 15),
              ),
            ),
          );

          setUpload(value =>
            Math.max(
              150,
              Math.min(
                420,
                value + Math.round(Math.random() * 20 - 10),
              ),
            ),
          );

          addLog('INFO', 'Amostra de throughput atualizada.');
        },
      ];

      events[Math.floor(Math.random() * events.length)]();
    }, 3500);

    return () => clearInterval(timer);
  }, [autoLogs, addLog]);

  // Mantém a visualização posicionada no último registro.
  useEffect(() => {
    const timer = setTimeout(
      () => scrollRef.current?.scrollToEnd({ animated: true }),
      80,
    );

    return () => clearTimeout(timer);
  }, [logs]);

  // Interpreta e executa os comandos digitados.
  const runCommand = () => {
    const raw = command.trim();

    if (!raw) return;

    const normalized = raw.toLowerCase();

    addLog('CMD', `> ${raw}`);
    setCommand('');
    Keyboard.dismiss();

    switch (normalized) {
      case 'help':
      case 'ajuda':
        addLog(
          'INFO',
          'Comandos: help, status, ping, diagnostico, logs, clear, monitor on, monitor off.',
        );
        break;

      case 'status':
        addLog(
          'OK',
          `Status: monitor ${autoLogs ? 'ATIVO' : 'PAUSADO'} | download ${download} Mbps | upload ${upload} Mbps.`,
        );

        addLog(
          loss > 2 ? 'WARN' : 'INFO',
          `Rede: ping ${ping} ms, perda ${loss}%, jitter ${jitter} ms.`,
        );
        break;

      case 'ping':
        addLog(
          ping > 150 ? 'WARN' : 'OK',
          `Resposta simulada do gateway: ${ping} ms; jitter ${jitter} ms.`,
        );
        break;

      case 'diagnostico':
      case 'diagnóstico':
        addLog('INFO', 'Executando verificações locais...');
        addLog('OK', 'UI: operacional. Sessão: ativa.');

        addLog(
          loss > 2 ? 'WARN' : 'OK',
          `Qualidade estimada: ${
            loss > 2 || ping > 150
              ? 'atenção necessária'
              : 'estável'
          }.`,
        );

        addLog(
          'WARN',
          'Métricas demonstrativas; conectividade real não foi testada por este console.',
        );
        break;

      case 'logs':
        addLog(
          'INFO',
          `${logs.length} entradas atualmente no buffer de logs.`,
        );
        break;

      case 'clear':
      case 'limpar':
        setLogs([]);
        break;

      case 'monitor on':
      case 'monitor ligar':
        setAutoLogs(true);
        addLog('OK', 'Geração automática de logs ativada.');
        break;

      case 'monitor off':
      case 'monitor pausar':
        setAutoLogs(false);
        addLog('WARN', 'Geração automática de logs pausada.');
        break;

      default:
        addLog(
          'ERROR',
          `Comando não reconhecido: "${raw}". Digite help para ver os comandos.`,
        );
    }
  };

  return (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: 28 },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.sysReady}>
        SYS_READY // CON_ID:0010
      </Text>

      <Text style={styles.title}>EqualNet Console</Text>

      {/* Métricas da conexão */}
      <View style={styles.card}>
        <Text style={styles.cardSubtitle}>
          VELOCIDADE DA CONEXÃO (AMOSTRAS DEMONSTRATIVAS)
        </Text>

        <View style={styles.speedRow}>
          <View style={styles.speedBox}>
            <Text
              style={[
                styles.speedValue,
                { color: '#0087f5' },
              ]}
            >
              {download}
            </Text>

            <Text style={styles.speedUnit}>
              Mbps Download
            </Text>
          </View>

          <View style={styles.speedBox}>
            <Text
              style={[
                styles.speedValue,
                { color: '#00F5D4' },
              ]}
            >
              {upload}
            </Text>

            <Text style={styles.speedUnit}>
              Mbps Upload
            </Text>
          </View>
        </View>

        <View style={styles.metricsMiniRow}>
          <Text style={styles.miniText}>
            PING:{' '}
            <Text
              style={{
                color: ping > 150 ? '#FB7185' : '#F59E0B',
              }}
            >
              {ping}ms
            </Text>
          </Text>

          <Text style={styles.miniText}>
            PERDA:{' '}
            <Text
              style={{
                color: loss > 2 ? '#FB7185' : '#00F5D4',
              }}
            >
              {loss}%
            </Text>
          </Text>

          <Text style={styles.miniText}>
            JITTER:{' '}
            <Text style={{ color: '#F59E0B' }}>
              {jitter}ms
            </Text>
          </Text>
        </View>
      </View>

      {/* Aviso sobre as métricas */}
      <View style={styles.alertCard}>
        <View style={styles.rowCenter}>
          <View style={styles.redDot} />

          <Text style={styles.alertTitle}>
            ALERTA PREDITIVO — DEMONSTRAÇÃO
          </Text>
        </View>

        <Text style={styles.alertDesc}>
          As leituras exibidas são simuladas para demonstração
          da interface. A previsão de instabilidade depende de
          integração com uma fonte real de telemetria.
        </Text>
      </View>

      {/* Terminal de comandos */}
      <View
        style={[
          styles.card,
          { marginTop: 16, padding: 14 },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <Text
            style={[
              styles.cardSubtitle,
              { marginBottom: 0, color: '#E2E8F0' },
            ]}
          >
            TERMINAL DE COMANDOS
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: autoLogs
                  ? '#00F5D4'
                  : '#64748B',
                marginRight: 6,
              }}
            />

            <Text
              style={{
                color: autoLogs ? '#00F5D4' : '#94A3B8',
                fontSize: 10,
              }}
            >
              {autoLogs ? 'MONITOR ATIVO' : 'MONITOR PAUSADO'}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#050810',
            borderWidth: 1,
            borderColor: '#263246',
            borderRadius: 9,
            padding: 10,
          }}
        >
          <Text
            style={{
              color: '#64748B',
              fontFamily: 'monospace',
              fontSize: 10,
              marginBottom: 8,
            }}
          >
            EqualNet OS [versão acadêmica] — digite help
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#00F5D4',
                fontFamily: 'monospace',
                fontSize: 13,
                marginRight: 7,
              }}
            >
              eq&gt;
            </Text>

            <TextInput
              value={command}
              onChangeText={setCommand}
              onSubmitEditing={runCommand}
              placeholder="Digite um comando..."
              placeholderTextColor="#64748B"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="send"
              style={{
                flex: 1,
                color: '#F8FAFC',
                fontFamily: 'monospace',
                fontSize: 13,
                paddingVertical: 7,
                minWidth: 0,
              }}
              accessibilityLabel="Comando do terminal"
            />

            <TouchableOpacity
              onPress={runCommand}
              accessibilityRole="button"
              accessibilityLabel="Executar comando"
              style={{
                backgroundColor: '#00F5D4',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  color: '#04111A',
                  fontWeight: '800',
                  fontSize: 11,
                }}
              >
                EXEC
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Atalhos de comandos */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 7,
            marginTop: 10,
          }}
        >
          {['help', 'status', 'ping', 'diagnostico', 'clear'].map(
            item => (
              <TouchableOpacity
                key={item}
                onPress={() => setCommand(item)}
                style={{
                  borderColor: '#334155',
                  borderWidth: 1,
                  borderRadius: 6,
                  paddingHorizontal: 9,
                  paddingVertical: 6,
                }}
              >
                <Text
                  style={{
                    color: '#94A3B8',
                    fontFamily: 'monospace',
                    fontSize: 10,
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>
      </View>

      {/* Logs de diagnóstico */}
      <View style={[styles.card, { padding: 14 }]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <Text
            style={[
              styles.cardSubtitle,
              { color: '#E2E8F0', marginBottom: 0 },
            ]}
          >
            LOGS DE DIAGNÓSTICO
          </Text>

          <TouchableOpacity onPress={() => setLogs([])}>
            <Text
              style={{
                color: '#94A3B8',
                fontSize: 10,
              }}
            >
              LIMPAR LOGS
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          nestedScrollEnabled
          style={{
            maxHeight: 255,
            backgroundColor: '#050810',
            borderRadius: 8,
            padding: 10,
          }}
        >
          {logs.length === 0 ? (
            <Text
              style={{
                color: '#64748B',
                fontFamily: 'monospace',
                fontSize: 11,
              }}
            >
              Nenhum registro. Os próximos eventos aparecerão aqui.
            </Text>
          ) : (
            logs.map(log => (
              <View
                key={log.id}
                style={{
                  flexDirection: 'row',
                  marginBottom: 7,
                  alignItems: 'flex-start',
                }}
              >
                <Text
                  style={{
                    color: '#64748B',
                    fontFamily: 'monospace',
                    fontSize: 10,
                    width: 62,
                  }}
                >
                  {log.time}
                </Text>

                <Text
                  style={{
                    color: COLORS[log.level],
                    fontFamily: 'monospace',
                    fontSize: 10,
                    width: 42,
                  }}
                >
                  [{log.level}]
                </Text>

                <Text
                  style={{
                    color: '#CBD5E1',
                    fontFamily: 'monospace',
                    fontSize: 10,
                    flex: 1,
                    lineHeight: 15,
                  }}
                >
                  {log.message}
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        <Text
          style={{
            color: '#64748B',
            fontSize: 10,
            marginTop: 8,
          }}
        >
          Buffer limitado às últimas 100 entradas. Logs gerados
          localmente para demonstração; não representam telemetria
          real do sistema operacional ou do roteador.
        </Text>
      </View>
    </ScrollView>
  );
}