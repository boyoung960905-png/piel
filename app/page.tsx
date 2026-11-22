 "use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  url: string;
  name: string;
  category: string;
  supplyPrice: string;
  salePrice: string;
  status: string;
};

export default function Home() {
  const [urls, setUrls] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [notice, setNotice] = useState("");

  const urlList = useMemo(
    () => urls.split(/\r?\n/).map((v) => v.trim()).filter(Boolean),
    [urls]
  );

  function addProducts() {
    const valid = urlList.filter((url) => /^https?:\/\//i.test(url));
    if (!valid.length) {
      setNotice("http 또는 https로 시작하는 상품 URL을 입력해 주세요.");
      return;
    }
    const next = valid.map((url, index) => ({
      id: Date.now() + index,
      url,
      name: "상품명 확인 필요",
      category: "가방/키링",
      supplyPrice: "",
      salePrice: "",
      status: "수집 대기",
    }));
    setProducts((current) => [...current, ...next]);
    setUrls("");
    setNotice(`${valid.length}개 URL을 목록에 추가했어요. 현재는 검수용 임시 목록이며, 실제 상품정보 수집은 승인된 연동 방식을 확인한 뒤 연결합니다.`);
  }

  function updateProduct(id: number, field: keyof Product, value: string) {
    setProducts((current) => current.map((p) => p.id === id ? { ...p, [field]: value } : p));
  }

  function exportCsv() {
    if (!products.length) {
      setNotice("먼저 상품 URL을 목록에 추가해 주세요.");
      return;
    }
    const header = ["상품명", "상품URL", "분류", "공급가격", "판매가격", "상태"];
    const rows = products.map((p) => [p.name, p.url, p.category, p.supplyPrice, p.salePrice, p.status]);
    const csv = [header, ...rows]
      .map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = "piel-products-review.csv";
    a.click();
    URL.revokeObjectURL(href);
    setNotice("검수용 CSV를 다운로드했어요. 아직 샵링커 정식 업로드용 엑셀은 아닙니다.");
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#">PIEL<span>.</span></a>
        <div className="topmeta"><span className="live-dot" /> PRODUCT MANAGER <span className="version">BETA</span></div>
      </header>

      <section className="hero">
        <p className="eyebrow">PIEL BACK OFFICE</p>
        <h1>상품을 모으고,<br /><em>한곳에서 관리하세요.</em></h1>
        <p className="sub">신상마켓 상품 검수부터 샵링커 등록 준비까지.</p>
      </section>

      <section className="panel input-panel">
        <div className="section-head">
          <div><p className="eyebrow">01 / COLLECT</p><h2>상품 URL 추가</h2></div>
          <span className="count">{urlList.length} URLs</span>
        </div>
        <label htmlFor="urls">상품 주소를 줄바꿈으로 구분해 붙여넣어 주세요.</label>
        <textarea id="urls" value={urls} onChange={(e) => setUrls(e.target.value)} placeholder={"https://...\nhttps://...\nhttps://..."} />
        <div className="actions">
          <span className="hint">여러 상품 주소를 한 번에 입력할 수 있어요.</span>
          <button onClick={addProducts}>목록에 추가 <span>→</span></button>
        </div>
        {notice && <p className="notice" role="status">{notice}</p>}
      </section>

      <section className="panel">
        <div className="section-head">
          <div><p className="eyebrow">02 / REVIEW</p><h2>상품 검수 목록</h2></div>
          <span className="count">{products.length} ITEMS</span>
        </div>
        {products.length === 0 ? (
          <div className="empty"><div className="empty-icon">＋</div><strong>아직 등록된 상품이 없어요.</strong><p>위에 상품 URL을 입력하면 이곳에서 검수할 수 있어요.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>상품명</th><th>분류</th><th>공급가</th><th>판매가</th><th>상태</th></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="product-cell"><input value={p.name} onChange={(e) => updateProduct(p.id, "name", e.target.value)} aria-label="상품명" /><a href={p.url} target="_blank" rel="noreferrer">상품 URL 열기 ↗</a></td>
                    <td><select value={p.category} onChange={(e) => updateProduct(p.id, "category", e.target.value)}><option>가방/키링</option><option>가방</option><option>키링</option><option>신발</option><option>의류</option><option>기타</option></select></td>
                    <td><input className="price" inputMode="numeric" placeholder="0" value={p.supplyPrice} onChange={(e) => updateProduct(p.id, "supplyPrice", e.target.value)} /></td>
                    <td><input className="price" inputMode="numeric" placeholder="0" value={p.salePrice} onChange={(e) => updateProduct(p.id, "salePrice", e.target.value)} /></td>
                    <td><span className="status">{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="bottom-actions">
          <span className="hint">상품정보 자동 수집과 샵링커 전용 엑셀은 다음 개발 단계에서 연결합니다.</span>
          <button className="secondary" onClick={exportCsv}>검수 목록 CSV 다운로드 ↓</button>
        </div>
      </section>
      <footer>PIEL PRODUCT MANAGER <span>·</span> PRIVATE WORKSPACE</footer>
    </main>
  );
}
