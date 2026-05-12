// GPV Auth System — v1.0
// Sessão expira em 8 horas
// Cada cliente só acessa sua própria área

const GPV_AUTH = {
  SESSION_DURATION: 8 * 60 * 60 * 1000, // 8 horas em ms

  set: function(client) {
    const session = {
      client: client,
      expires: Date.now() + this.SESSION_DURATION
    };
    sessionStorage.setItem('gpv_session', JSON.stringify(session));
  },

  get: function() {
    try {
      const raw = sessionStorage.getItem('gpv_session');
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (Date.now() > session.expires) {
        sessionStorage.removeItem('gpv_session');
        return null;
      }
      return session.client;
    } catch(e) {
      return null;
    }
  },

  clear: function() {
    sessionStorage.removeItem('gpv_session');
  },

  // Verifica se o cliente logado bate com o esperado
  // Se não bater, redireciona para o login correto
  require: function(expectedClient, loginPath) {
    const client = this.get();
    if (!client || client !== expectedClient) {
      this.clear();
      window.location.replace(loginPath);
      return false;
    }
    // Mascara o link na barra do navegador
    history.replaceState(null, '', loginPath.replace('login.html', ''));
    return true;
  }
};
