// GPV Auth System — v3.0
// Login via banco de dados Supabase
// Admin: senha fixa | Cliente: usuário + senha no banco

const GPV_AUTH = {
  SUPABASE_URL: 'https://shoaxshrkcagkpheplhp.supabase.co',
  SUPABASE_KEY: 'sb_publishable_4R07t7BxqGANtdLF3GxuQQ_wu0UeUTG',
  ADMIN_PASSWORD: 'gpv@admin2026',
  SESSION_DURATION: 8 * 60 * 60 * 1000,

  setSession: function(client, role) {
    const session = { client, role, expires: Date.now() + this.SESSION_DURATION };
    sessionStorage.setItem('gpv_session', JSON.stringify(session));
  },

  getSession: function() {
    try {
      const raw = sessionStorage.getItem('gpv_session');
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (Date.now() > session.expires) { sessionStorage.removeItem('gpv_session'); return null; }
      return session;
    } catch(e) { return null; }
  },

  isAdmin: function() {
    const s = this.getSession();
    return s && s.role === 'admin';
  },

  clear: function() {
    sessionStorage.removeItem('gpv_session');
  },

  // Login do cliente via banco
  loginClient: async function(username, password) {
    const res = await fetch(`${this.SUPABASE_URL}/rest/v1/users?username=eq.${encodeURIComponent(username)}&password=eq.${encodeURIComponent(password)}&select=client_id`, {
      headers: { 'apikey': this.SUPABASE_KEY, 'Authorization': 'Bearer ' + this.SUPABASE_KEY }
    });
    const rows = await res.json();
    if (rows && rows.length > 0) {
      this.setSession(rows[0].client_id, 'client');
      return { ok: true, client: rows[0].client_id };
    }
    return { ok: false };
  },

  // Login admin
  loginAdmin: function(password) {
    if (password === this.ADMIN_PASSWORD) {
      this.setSession('admin', 'admin');
      return true;
    }
    return false;
  },

  require: function(expectedClient, loginPath) {
    const session = this.getSession();
    if (session && session.role === 'admin') return true;
    if (!session || session.client !== expectedClient) {
      this.clear();
      window.location.replace(loginPath);
      return false;
    }
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
