export default async function handler(req, res) {
  const {
    GITHUB_TOKEN,
    GITHUB_OWNER,
    GITHUB_REPO,
    GITHUB_BRANCH = "main",
    ADMIN_PASSWORD,
    DATA_PATH = "data.json",
    ALLOWED_ORIGIN = "*"
  } = process.env;

  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Password");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO || !ADMIN_PASSWORD) {
    return res.status(500).json({ error: "Не настроены переменные окружения Vercel." });
  }

  const apiUrl = `https://api.github.com/repos/${encodeURIComponent(GITHUB_OWNER)}/${encodeURIComponent(GITHUB_REPO)}/contents/${DATA_PATH}`;
  const headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${GITHUB_TOKEN}`,
    "X-GitHub-Api-Version": "2026-03-10"
  };

  try {
    if (req.method === "GET") {
      const r = await fetch(`${apiUrl}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, { headers });
      if (r.status === 404) return res.status(404).json({ error: "data.json не найден в GitHub." });
      const d = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: d.message || "GitHub API error" });
      const json = Buffer.from(d.content.replace(/\n/g, ""), "base64").toString("utf8");
      return res.status(200).send(json);
    }

    if (req.method === "POST") {
      if (req.headers["x-admin-password"] !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Неверный пароль администратора." });
      }

      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!body || !Array.isArray(body.people) || !Array.isArray(body.connections) || !body.positions) {
        return res.status(400).json({ error: "Некорректные данные дерева." });
      }

      const current = await fetch(`${apiUrl}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, { headers });
      let sha;
      if (current.ok) {
        const currentJson = await current.json();
        sha = currentJson.sha;
      } else if (current.status !== 404) {
        const d = await current.json().catch(() => ({}));
        return res.status(current.status).json({ error: d.message || "Не удалось прочитать data.json" });
      }

      const content = Buffer.from(JSON.stringify(body, null, 2) + "\n", "utf8").toString("base64");
      const payload = {
        message: "Обновление родословной",
        content,
        branch: GITHUB_BRANCH
      };
      if (sha) payload.sha = sha;

      const r = await fetch(apiUrl, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) return res.status(r.status).json({ error: d.message || "GitHub API error" });
      return res.status(200).json({ ok: true, commit: d.commit?.sha || null });
    }

    return res.status(405).json({ error: "Метод не поддерживается." });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Внутренняя ошибка сервера." });
  }
}
