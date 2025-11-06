import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController(); // Para cancelar a requisição se o componente desmontar

    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Falha na requisição`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        // Tratamento específico para "Failed to fetch"
        if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
          setError("Sem conexão com a internet. Verifique sua rede e tente novamente.");
        } else if (err.name === "AbortError") {
          console.log("Requisição cancelada (componente desmontado).");
          return;
        } else {
          setError(err.message || "Erro desconhecido ao carregar usuários.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();

    // Cleanup: cancela a requisição se o componente for desmontado
    return () => {
      controller.abort();
    };
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <h1>Tabela de Usuários</h1>
        <input
          className={`search ${search ? "active" : ""}`}
          type="text"
          placeholder="Pesquisar por nome, email, username, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setSearch("")}
          className="btn-limpar-pesquisa"
          aria-label="Limpar pesquisa"
        >
          Limpar
        </button>
      </header>
      <hr />

      {/* Loading */}
      {isLoading && (
        <div className="loading">
          <p>Carregando usuários...</p>
        </div>
      )}

      {/* Erro com tratamento especial para "Failed to fetch" */}
      {error && (
        <div className="error" role="alert">
          <p><strong>Erro:</strong> {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-retry"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Lista de usuários */}
      {!isLoading && !error && (
        <ul className="list">
          {filtered.map((u) => (
            <li className="card" key={u.id}>
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  u.name
                )}&background=random&size=64`}
                alt={`Avatar de ${u.name}`}
                className="avatar"
              />
              <div className="title">{u.name}</div>
              <div className="muted">{u.email}</div>
              <div className="muted">{u.username}</div>
              <div className="muted">{u.phone}</div>
              <a
                className="link"
                href={`http://${u.website}`}
                target="_blank"
                rel="noreferrer"
              >
                {u.website}
              </a>
            </li>
          ))}
        </ul>
      )}

      <footer className="footer-copyright">
        <p>© {new Date().getFullYear()} Minha App. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;