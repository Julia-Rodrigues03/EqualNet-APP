
const DEFAULT_TIMEOUT = 15000;

export class HttpError extends Error {
  constructor(
    message: string,
    public code: 'TIMEOUT' | 'NETWORK' | 'HTTP' | 'UNKNOWN',
    public status?: number
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export async function httpRequest<T>(url: string): Promise<T> {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, DEFAULT_TIMEOUT);

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new HttpError(
        response.status >= 500
          ? 'O servidor está temporariamente indisponível. Ele pode estar inicializando. Tente novamente.'
          : `Não foi possível concluir a solicitação (HTTP ${response.status}).`,
        'HTTP',
        response.status
      );
    }

    try {
      return await response.json() as T;
    } catch {
      throw new HttpError(
        'O servidor retornou uma resposta inválida.',
        'UNKNOWN'
      );
    }
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    if (controller.signal.aborted) {
      throw new HttpError(
        'A conexão demorou mais que o esperado. O servidor pode estar inicializando. Tente novamente.',
        'TIMEOUT'
      );
    }

    if (error instanceof TypeError) {
      throw new HttpError(
        'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
        'NETWORK'
      );
    }

    throw new HttpError(
      'Ocorreu um erro inesperado ao consultar o servidor.',
      'UNKNOWN'
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
