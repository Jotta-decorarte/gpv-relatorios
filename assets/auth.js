// GPV Auth System — v2.0
// Sessão expira em 8 horas
// Níveis: cliente (só visualiza) e admin (gerencia tudo)

const GPV_AUTH = {
  SESSION_DURATION: 8 * 60 * 60 * 1000,
  ADMIN_PASSWORD: 'gpv@admin2026',

  set: function(client) {
    const session = { client: client, role: 'client', expires: Date.now() + this.SESSION_DURATION };
    sessionStorage.setItem('gpv_session', JSON.stringify(session));
  },

  setAdmin: function() {
    const session = { client: 'admin', role: 'admin', expires: Date.now() + this.SESSION_DURATION };
    sessionStorage.setItem('gpv_session', JSON.stringify(session));
  },

  get: function() {
    try {
      const raw = sessionStorage.getItem('gpv_session');
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (Date.now() > session.expires) { sessionStorage.removeItem('gpv_session'); return null; }
      return session;
    } catch(e) { return null; }
  },

  isAdmin: function() {
    const s = this.get();
    return s && s.role === 'admin';
  },

  clear: function() {
    sessionStorage.removeItem('gpv_session');
  },

  require: function(expectedClient, loginPath) {
    const session = this.get();
    // Admin pode acessar qualquer área
    if (session && session.role === 'admin') return true;
    if (!session || session.client !== expectedClient) {
      this.clear();
      window.location.replace(loginPath);
      return false;
    }
    history.replaceState(null, '', loginPath.replace('login.html', ''));
    return true;
  },

  requireAdmin: function() {
    if (!this.isAdmin()) {
      window.location.replace('../index.html');
      return false;
    }
    return true;
  }
};
