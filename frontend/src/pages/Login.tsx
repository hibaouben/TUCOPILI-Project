import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
const { login, user, logout } = useAuth();
const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

useEffect(() => {
if (!user) return;

if (user.role === "ADMIN") {
  navigate("/admin", { replace: true });
} else {
  logout();
  setError("Accès refusé : ce compte n'est pas administrateur.");
}

}, [user, navigate, logout]);

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();

setError("");
setLoading(true);

try {
  await login(email, password);
} catch (err) {
  setError("Email ou mot de passe incorrect.");
} finally {
  setLoading(false);
}

};

return ( <main className="auth-page"> <form onSubmit={handleSubmit} className="auth-form"> <h1>Admin Login</h1>

    <p>
      Connectez-vous pour accéder à l'espace administrateur.
    </p>

    {error && <p className="auth-error">{error}</p>}

    <input
      type="email"
      placeholder="Email administrateur"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      autoComplete="email"
    />

    <input
      type="password"
      placeholder="Mot de passe"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      autoComplete="current-password"
    />

    <button type="submit" disabled={loading}>
      {loading ? "Connexion..." : "Se connecter"}
    </button>
  </form>
</main>

);
}

export default Login;
