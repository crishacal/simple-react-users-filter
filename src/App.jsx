import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Erro ao carregar usuários:", err));
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
          onClick={() => setSearch('')}
          className="btn-limpar-pesquisa"
          aria-label="Limpar pesquisa"
        >Limpar</button>
      </header>
      <hr />
      <ul className="list">
        {filtered.map((u) => (
          <li className="card" key={u.id}>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&size=64`}
              alt={`Avatar de ${u.name}`}
              className="avatar" // Adicione uma classe CSS para estilizar, se quiser
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
      <footer className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} Minha App. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;