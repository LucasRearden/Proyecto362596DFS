export const generarKeyRedisLibros = (version, { pagina, limite, categoria, autor, titulo } = {}) => {
    return `libros:v${version}:pagina:${pagina ?? "all"}:limite:${limite ?? "all"}:categoria:${categoria ?? "-"}:autor:${autor ?? "-"}:titulo:${titulo ?? "-"}`;
};