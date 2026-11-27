// Supabase Edge Function: baca-foto
// Membaca angka hasil ukur dari foto alat ukur memakai Claude (vision).
// Secret yang dibutuhkan: ANTHROPIC_API_KEY  (opsional: CLAUDE_MODEL)
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (o, s = 200) =>
  new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });

const PROMPT = `Ini foto layar alat ukur (misalnya megger, micro-ohmmeter, multimeter, clamp meter).
Tugas: baca HASIL UKUR UTAMA yang tampil di layar, yaitu angka paling besar/dominan beserta satuannya.
ABAIKAN: tanggal, jam, koordinat/alamat (watermark), logo, skala analog (10T, 1G, 100M, dst.),
tegangan uji, waktu pengujian, arus bocor, kapasitansi, label tombol, dan tulisan pada body alat.
Jika layar menampilkan beberapa hasil ukur utama sekaligus (misalnya R, S, T), tulis semuanya berurutan.
Jawab HANYA JSON tanpa teks lain, format:
{"readings":[{"value":"3.69","unit":"GΩ"}],"note":"catatan singkat jika ragu"}
"value" memakai titik desimal tanpa pemisah ribuan. "unit" persis seperti di layar (contoh: GΩ, MΩ, kΩ, Ω, mΩ, µΩ, V, kV, A, mA, ms, s).
Jika tidak ada angka hasil ukur yang terbaca, jawab {"readings":[],"note":"alasan"}.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const { image, hint } = await req.json();
    if (!image || typeof image !== "string" || image.length > 7_000_000) {
      return json({ error: "Gambar tidak valid atau terlalu besar" }, 400);
    }
    const key = Deno.env.get("ANTHROPIC_API_KEY");
    if (!key) return json({ error: "ANTHROPIC_API_KEY belum diatur di Secrets" }, 500);
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: Deno.env.get("CLAUDE_MODEL") || "claude-sonnet-5-5",
        max_tokens: 400,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } },
            { type: "text", text: PROMPT + (hint ? `\nKonteks titik ukur yang akan diisi: ${String(hint).slice(0, 200)}` : "") },
          ],
        }],
      }),
    });
    const d = await r.json();
    if (!r.ok) return json({ error: "Layanan AI: " + (d?.error?.message || r.status) }, 502);
    const text = (d.content || []).map((c) => c.text || "").join("");
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return json({ error: "Jawaban AI tidak terbaca" }, 502);
    const p = JSON.parse(m[0]);
    const readings = (Array.isArray(p.readings) ? p.readings : [])
      .map((x) => ({ value: String(x.value ?? "").replace(",", "."), unit: String(x.unit ?? "") }))
      .filter((x) => /^-?\d+(\.\d+)?$/.test(x.value));
    return json({ readings, note: String(p.note || "") });
  } catch (e) {
    return json({ error: String(e?.message || e) }, 500);
  }
});
