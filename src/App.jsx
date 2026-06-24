import { useState, useEffect } from "react";

// ─── PRICING DATA ────────────────────────────────────────────────────────────
const SYSTEMS = [
  { id: "lighting", icon: "💡", label: "Oświetlenie", desc: "Sterowanie strefami, sceny, ściemnianie" },
  { id: "blinds",   icon: "🪟", label: "Rolety / żaluzje", desc: "Automatyczne sterowanie osłonami" },
  { id: "heating",  icon: "🌡️", label: "Ogrzewanie", desc: "Tygodniowy harmonogram, strefy, oszczędzanie" },
  { id: "security", icon: "🔒", label: "Alarm / czujniki", desc: "Czujniki ruchu, otwarcia, powiadomienia" },
  { id: "audio",    icon: "🔊", label: "Multiroom audio", desc: "Muzyka w każdym pomieszczeniu" },
  { id: "gate",     icon: "🚗", label: "Bramy / dostęp", desc: "Brama garażowa, furka, domofon IP" },
  { id: "energy",   icon: "⚡", label: "Licznik energii", desc: "Monitoring zużycia prądu i PV" },
  { id: "camera",   icon: "📷", label: "Kamery IP", desc: "Podgląd z telefonu, nagrywanie" },
];

const PRICES = {
  miniserver:   { label: "Loxone Miniserver Go Gen. 2", unit: "szt.", price: 2200 },
  lighting_pp:  { label: "Sterowanie oświetleniem (na punkt)", unit: "pkt", price: 180 },
  blind_pp:     { label: "Sterowanie roletą", unit: "szt.", price: 320 },
  heating_zone: { label: "Strefa ogrzewania", unit: "szt.", price: 280 },
  motion:       { label: "Czujnik ruchu/obecności", unit: "szt.", price: 350 },
  door_sensor:  { label: "Czujnik otwarcia", unit: "szt.", price: 90 },
  audio_zone:   { label: "Strefa audio (amplituner + głośniki)", unit: "szt.", price: 1800 },
  gate:         { label: "Sterowanie bramą/furtką", unit: "szt.", price: 480 },
  energy_meter: { label: "Licznik energii", unit: "szt.", price: 650 },
  camera:       { label: "Kamera IP", unit: "szt.", price: 750 },
  programming:  { label: "Programowanie Loxone Config", unit: "godz.", price: 250 },
  installation: { label: "Instalacja i uruchomienie", unit: "godz.", price: 120 },
  // Okablowanie
  cable_tree:   { label: "Kabel Loxone Tree (sygnałowy)", unit: "mb", price: 3.2 },
  cable_ytdy:   { label: "Kabel YTDY 4x0,5 (czujniki/rolety)", unit: "mb", price: 1.8 },
  cable_utp:    { label: "Kabel UTP kat.6 (sieć/kamery)", unit: "mb", price: 2.4 },
  cable_speaker:{ label: "Kabel głośnikowy 2x1,5", unit: "mb", price: 2.1 },
  cable_power:  { label: "Kabel YDY 3x1,5 (zasilanie)", unit: "mb", price: 3.8 },
  cable_conduit:{ label: "Rury / korytka kablowe", unit: "mb", price: 4.5 },
  cable_boxes:  { label: "Puszki i akcesoria montażowe", unit: "kpl.", price: 280 },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function formatPLN(n) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(n);
}

// ─── STEP COMPONENTS ─────────────────────────────────────────────────────────

function StepProject({ data, onChange }) {
  const types = ["Dom jednorodzinny", "Apartament", "Biuro", "Dom letniskowy", "Inny"];
  return (
    <div className="step-content">
      <h2 className="step-title">Podstawowe informacje</h2>
      <p className="step-sub">Powiedz nam o swoim projekcie</p>
      <div className="form-grid">
        <div className="field">
          <label>Nazwa projektu / adres</label>
          <input
            type="text"
            placeholder="np. Dom Kowalski, ul. Leśna 12"
            value={data.name}
            onChange={e => onChange({ ...data, name: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Typ obiektu</label>
          <div className="pill-group">
            {types.map(t => (
              <button
                key={t}
                className={`pill ${data.type === t ? "active" : ""}`}
                onClick={() => onChange({ ...data, type: t })}
              >{t}</button>
            ))}
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Metraż (m²)</label>
            <input
              type="number"
              min="20" max="2000"
              placeholder="150"
              value={data.area}
              onChange={e => onChange({ ...data, area: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Liczba pomieszczeń</label>
            <input
              type="number"
              min="1" max="50"
              placeholder="6"
              value={data.rooms}
              onChange={e => onChange({ ...data, rooms: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Liczba kondygnacji</label>
            <input
              type="number"
              min="1" max="5"
              placeholder="2"
              value={data.floors}
              onChange={e => onChange({ ...data, floors: e.target.value })}
            />
          </div>
        </div>
        <div className="field">
          <label>Etap projektu</label>
          <div className="pill-group">
            {["Budowa (surowy stan)", "Remont", "Modernizacja istniejącego systemu"].map(s => (
              <button
                key={s}
                className={`pill ${data.stage === s ? "active" : ""}`}
                onClick={() => onChange({ ...data, stage: s })}
              >{s}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepSystems({ selected, onChange }) {
  const toggle = (id) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };
  return (
    <div className="step-content">
      <h2 className="step-title">Wybierz systemy</h2>
      <p className="step-sub">Zaznacz wszystko, co chcesz zautomatyzować</p>
      <div className="systems-grid">
        {SYSTEMS.map(s => (
          <button
            key={s.id}
            className={`system-card ${selected.includes(s.id) ? "active" : ""}`}
            onClick={() => toggle(s.id)}
          >
            <span className="sys-icon">{s.icon}</span>
            <span className="sys-label">{s.label}</span>
            <span className="sys-desc">{s.desc}</span>
            {selected.includes(s.id) && <span className="sys-check">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepDetails({ systems, details, onChange }) {
  const update = (key, val) => onChange({ ...details, [key]: val });
  return (
    <div className="step-content">
      <h2 className="step-title">Szczegóły systemów</h2>
      <p className="step-sub">Podaj ilości, a my wyliczymy kosztorys</p>
      <div className="details-list">
        {systems.includes("lighting") && (
          <DetailSection icon="💡" title="Oświetlenie">
            <NumberField label="Liczba punktów świetlnych sterowanych" value={details.lightPoints} onChange={v => update("lightPoints", v)} />
          </DetailSection>
        )}
        {systems.includes("blinds") && (
          <DetailSection icon="🪟" title="Rolety / żaluzje">
            <NumberField label="Liczba rolet / żaluzji" value={details.blindsCount} onChange={v => update("blindsCount", v)} />
          </DetailSection>
        )}
        {systems.includes("heating") && (
          <DetailSection icon="🌡️" title="Ogrzewanie">
            <NumberField label="Liczba stref grzewczych" value={details.heatingZones} onChange={v => update("heatingZones", v)} />
          </DetailSection>
        )}
        {systems.includes("security") && (
          <DetailSection icon="🔒" title="Alarm / czujniki">
            <NumberField label="Czujniki ruchu / obecności" value={details.motionSensors} onChange={v => update("motionSensors", v)} />
            <NumberField label="Czujniki otwarcia drzwi / okien" value={details.doorSensors} onChange={v => update("doorSensors", v)} />
          </DetailSection>
        )}
        {systems.includes("audio") && (
          <DetailSection icon="🔊" title="Multiroom audio">
            <NumberField label="Liczba stref audio" value={details.audioZones} onChange={v => update("audioZones", v)} />
          </DetailSection>
        )}
        {systems.includes("gate") && (
          <DetailSection icon="🚗" title="Bramy / dostęp">
            <NumberField label="Liczba bram / furtek" value={details.gateCount} onChange={v => update("gateCount", v)} />
          </DetailSection>
        )}
        {systems.includes("energy") && (
          <DetailSection icon="⚡" title="Licznik energii">
            <NumberField label="Liczba liczników" value={details.energyMeters} onChange={v => update("energyMeters", v)} />
          </DetailSection>
        )}
        {systems.includes("camera") && (
          <DetailSection icon="📷" title="Kamery IP">
            <NumberField label="Liczba kamer" value={details.cameraCount} onChange={v => update("cameraCount", v)} />
          </DetailSection>
        )}
      </div>
    </div>
  );
}

function DetailSection({ icon, title, children }) {
  return (
    <div className="detail-section">
      <div className="detail-header">
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      <div className="detail-fields">{children}</div>
    </div>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="number-input">
        <button onClick={() => onChange(Math.max(0, (parseInt(value) || 0) - 1))}>−</button>
        <input
          type="number" min="0"
          value={value || ""}
          onChange={e => onChange(e.target.value)}
          placeholder="0"
        />
        <button onClick={() => onChange((parseInt(value) || 0) + 1)}>+</button>
      </div>
    </div>
  );
}

// ─── AUTO-ESTIMATE CABLING ────────────────────────────────────────────────────
function calcCablingAuto(project, systems, details) {
  const area = parseInt(project.area) || 100;
  const floors = parseInt(project.floors) || 1;
  const factor = 1 + (floors - 1) * 0.3;

  const treeDevices = (parseInt(details.lightPoints) || 0)
    + (parseInt(details.blindsCount) || 0)
    + (parseInt(details.motionSensors) || 0)
    + (parseInt(details.heatingZones) || 0);
  const tree = Math.round(treeDevices * 12 * factor);
  const ytdy = (systems.includes("blinds") || systems.includes("security"))
    ? Math.round(area * 0.6 * factor) : 0;
  const utp = systems.includes("camera")
    ? Math.round((parseInt(details.cameraCount) || 0) * 25 * factor + area * 0.3)
    : Math.round(area * 0.3 * factor);
  const speaker = systems.includes("audio")
    ? Math.round((parseInt(details.audioZones) || 0) * 20 * factor) : 0;
  const power = Math.round(area * 0.8 * factor);
  const conduit = Math.round((tree + ytdy + utp + power) * 0.4);
  const boxes = floors + (systems.length > 4 ? 2 : 1);

  return { tree, ytdy, utp, speaker, power, conduit, boxes };
}

function StepCabling({ project, systems, details, cabling, onChange }) {
  const auto = calcCablingAuto(project, systems, details);
  const init = (key) => (cabling[key] !== undefined ? cabling[key] : auto[key]);
  const update = (key, val) => onChange({ ...cabling, [key]: parseInt(val) || 0 });

  const cables = [
    { key: "tree",    icon: "🔵", label: "Kabel Loxone Tree", unit: "mb", desc: "Magistrala sygnałowa do urządzeń Loxone" },
    { key: "ytdy",    icon: "🟡", label: "Kabel YTDY 4×0,5", unit: "mb", desc: "Czujniki, rolety, sygnały niskoprądowe" },
    { key: "utp",     icon: "🟠", label: "Kabel UTP kat.6", unit: "mb", desc: "Sieć, kamery IP, switche" },
    { key: "speaker", icon: "🟣", label: "Kabel głośnikowy 2×1,5", unit: "mb", desc: "Instalacja multiroom audio" },
    { key: "power",   icon: "🔴", label: "Kabel YDY 3×1,5", unit: "mb", desc: "Obwody zasilające urządzenia" },
    { key: "conduit", icon: "⚪", label: "Rury / korytka", unit: "mb", desc: "Ochrona i prowadzenie kabli" },
    { key: "boxes",   icon: "🟤", label: "Puszki i akcesoria", unit: "kpl.", desc: "Rozdzielnie, puszki podtynkowe" },
  ];

  return (
    <div className="step-content">
      <h2 className="step-title">Okablowanie</h2>
      <p className="step-sub">Wstępne ilości wyliczone automatycznie — możesz je skorygować</p>
      <div className="cabling-info">
        <span>⚡</span>
        Wartości obliczone na podstawie {project.area} m², {project.floors || 1} kondygnacji i wybranych systemów.
      </div>
      <div className="cabling-list">
        {cables.map(c => {
          const val = init(c.key);
          if (val === 0 && c.key === "speaker") return null;
          return (
            <div key={c.key} className="cabling-row">
              <div className="cabling-left">
                <span className="cabling-dot">{c.icon}</span>
                <div>
                  <div className="cabling-label">{c.label}</div>
                  <div className="cabling-desc">{c.desc}</div>
                </div>
              </div>
              <div className="cabling-right">
                <div className="cabling-auto-badge">auto: {auto[c.key]} {c.unit}</div>
                <div className="number-input compact">
                  <button onClick={() => update(c.key, Math.max(0, val - (c.unit === "kpl." ? 1 : 5)))}>−</button>
                  <input type="number" min="0" value={val} onChange={e => update(c.key, e.target.value)} />
                  <button onClick={() => update(c.key, val + (c.unit === "kpl." ? 1 : 5))}>+</button>
                </div>
                <div className="cabling-unit">{c.unit}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function calcEstimate(systems, details, rates) {
  const ratesProg = rates?.programming_h ?? PRICES.programming.price;
  const ratesInst = rates?.installation_h ?? PRICES.installation.price;
  let items = [];
  let progHours = 8;
  let instHours = 16;

  items.push({ ...PRICES.miniserver, qty: 1, total: PRICES.miniserver.price });

  if (systems.includes("lighting") && details.lightPoints > 0) {
    const qty = parseInt(details.lightPoints) || 0;
    items.push({ ...PRICES.lighting_pp, qty, total: qty * PRICES.lighting_pp.price });
    progHours += Math.ceil(qty / 5);
    instHours += Math.ceil(qty / 4);
  }
  if (systems.includes("blinds") && details.blindsCount > 0) {
    const qty = parseInt(details.blindsCount) || 0;
    items.push({ ...PRICES.blind_pp, qty, total: qty * PRICES.blind_pp.price });
    progHours += Math.ceil(qty / 3);
    instHours += qty * 0.5;
  }
  if (systems.includes("heating") && details.heatingZones > 0) {
    const qty = parseInt(details.heatingZones) || 0;
    items.push({ ...PRICES.heating_zone, qty, total: qty * PRICES.heating_zone.price });
    progHours += qty;
  }
  if (systems.includes("security")) {
    const m = parseInt(details.motionSensors) || 0;
    const d = parseInt(details.doorSensors) || 0;
    if (m > 0) items.push({ ...PRICES.motion, qty: m, total: m * PRICES.motion.price });
    if (d > 0) items.push({ ...PRICES.door_sensor, qty: d, total: d * PRICES.door_sensor.price });
    instHours += (m + d) * 0.3;
  }
  if (systems.includes("audio") && details.audioZones > 0) {
    const qty = parseInt(details.audioZones) || 0;
    items.push({ ...PRICES.audio_zone, qty, total: qty * PRICES.audio_zone.price });
    instHours += qty * 2;
  }
  if (systems.includes("gate") && details.gateCount > 0) {
    const qty = parseInt(details.gateCount) || 0;
    items.push({ ...PRICES.gate, qty, total: qty * PRICES.gate.price });
    instHours += qty;
  }
  if (systems.includes("energy") && details.energyMeters > 0) {
    const qty = parseInt(details.energyMeters) || 0;
    items.push({ ...PRICES.energy_meter, qty, total: qty * PRICES.energy_meter.price });
  }
  if (systems.includes("camera") && details.cameraCount > 0) {
    const qty = parseInt(details.cameraCount) || 0;
    items.push({ ...PRICES.camera, qty, total: qty * PRICES.camera.price });
    instHours += qty * 0.5;
  }

  progHours = Math.round(progHours);
  instHours = Math.round(instHours);

  const hardware = items.reduce((s, i) => s + i.total, 0);
  const programming = progHours * ratesProg;
  const installation = instHours * ratesInst;
  const total = hardware + programming + installation;

  return { items, progHours, instHours, hardware, programming, installation, total, ratesProg, ratesInst };
}

function calcCablingCost(cabling, rates) {
  if (!cabling || Object.keys(cabling).length === 0) return { cablingItems: [], cablingTotal: 0 };
  const cablingMbRate = rates?.cabling_mb ?? 15;
  const map = [
    { key: "tree",    price: { ...PRICES.cable_tree,    price: cablingMbRate > 0 ? cablingMbRate * 0.22 : PRICES.cable_tree.price },    unit: "mb" },
    { key: "ytdy",    price: { ...PRICES.cable_ytdy,    price: cablingMbRate > 0 ? cablingMbRate * 0.12 : PRICES.cable_ytdy.price },    unit: "mb" },
    { key: "utp",     price: { ...PRICES.cable_utp,     price: cablingMbRate > 0 ? cablingMbRate * 0.16 : PRICES.cable_utp.price },     unit: "mb" },
    { key: "speaker", price: { ...PRICES.cable_speaker, price: cablingMbRate > 0 ? cablingMbRate * 0.14 : PRICES.cable_speaker.price }, unit: "mb" },
    { key: "power",   price: { ...PRICES.cable_power,   price: cablingMbRate > 0 ? cablingMbRate * 0.25 : PRICES.cable_power.price },   unit: "mb" },
    { key: "conduit", price: { ...PRICES.cable_conduit, price: cablingMbRate > 0 ? cablingMbRate * 0.30 : PRICES.cable_conduit.price }, unit: "mb" },
    { key: "boxes",   price: { ...PRICES.cable_boxes },   unit: "kpl." },
  ];
  const cablingItems = map
    .filter(m => (cabling[m.key] || 0) > 0)
    .map(m => ({ ...m.price, qty: cabling[m.key], total: cabling[m.key] * m.price.price }));
  const cablingTotal = cablingItems.reduce((s, i) => s + i.total, 0);
  return { cablingItems, cablingTotal };
}

function generatePDF({ project, est, cablingItems, cablingTotal, grandTotal, systemLabels }) {
  const date = new Date().toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" });
  const html = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8"/>
  <title>Kosztorys Smart Home — ${project.name || "tHOME"}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; color: #1a1a1a; background: #fff; padding: 32px; font-size: 13px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 3px solid #69c351; margin-bottom: 24px; }
    .logo-wrap { display: flex; align-items: center; gap: 10px; }
    .logo-icon { width: 44px; height: 44px; }
    .logo-text { font-size: 22px; font-weight: 800; color: #1a1a1a; }
    .logo-text span { color: #69c351; }
    .logo-tag { font-size: 9px; color: #888; letter-spacing: .1em; text-transform: uppercase; margin-top: 2px; }
    .header-right { text-align: right; color: #555; font-size: 12px; line-height: 1.7; }
    .doc-title { font-size: 22px; font-weight: 700; margin-bottom: 4px; color: #1a1a1a; }
    .doc-sub { font-size: 13px; color: #555; margin-bottom: 20px; }
    .project-box { background: #f8fdf6; border: 1px solid #d4edc9; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    .proj-item label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: .07em; display: block; margin-bottom: 3px; }
    .proj-item value { font-size: 14px; font-weight: 600; color: #1a1a1a; }
    .total-hero { background: #1a1a1a; color: #fff; border-radius: 10px; padding: 20px 24px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .total-label { font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: #aaa; margin-bottom: 4px; }
    .total-value { font-size: 32px; font-weight: 800; color: #69c351; }
    .total-range { font-size: 12px; color: #aaa; margin-top: 4px; }
    .breakdown { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; margin-bottom: 24px; }
    .bc { border: 1px solid #e5e5e5; border-radius: 8px; padding: 12px; }
    .bc-label { font-size: 11px; color: #888; margin-bottom: 6px; }
    .bc-val { font-size: 15px; font-weight: 700; color: #1a1a1a; }
    .bc-bar { height: 3px; background: #eee; border-radius: 2px; margin-top: 8px; }
    .bc-fill { height: 100%; border-radius: 2px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    thead th { background: #1a1a1a; color: #fff; padding: 9px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .07em; }
    tbody tr:nth-child(even) { background: #f9f9f9; }
    tbody td { padding: 9px 12px; border-bottom: 1px solid #eee; font-size: 12px; }
    .section-row td { background: #f0fae8; color: #3a7a2a; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; padding: 5px 12px; }
    .total-row-pdf td { background: #1a1a1a; color: #fff; font-weight: 700; font-size: 13px; }
    .total-row-pdf td:last-child { color: #69c351; font-size: 15px; }
    td:last-child { text-align: right; font-weight: 600; }
    td:nth-child(2), td:nth-child(3) { text-align: right; color: #555; }
    .systems-row { font-size: 11px; color: #555; margin-bottom: 20px; }
    .systems-row strong { color: #1a1a1a; }
    .footer { border-top: 2px solid #69c351; padding-top: 14px; display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
    .footer-left { font-size: 11px; color: #888; line-height: 1.6; }
    .footer-right { text-align: right; font-size: 11px; color: #888; }
    .footer-right a { color: #69c351; text-decoration: none; }
    .disclaimer { font-size: 10px; color: #aaa; line-height: 1.6; margin-top: 14px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-wrap">
      <svg class="logo-icon" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="10" fill="#0d0f0d"/>
        <line x1="32" y1="14" x2="32" y2="28" stroke="#69c351" stroke-width="5" stroke-linecap="round"/>
        <path d="M22 21.5a16 16 0 1 0 20 0" fill="none" stroke="#69c351" stroke-width="5" stroke-linecap="round"/>
      </svg>
      <div>
        <div class="logo-text">t<span>HOME</span></div>
        <div class="logo-tag">Thinking Home · Certyfikowany Partner Loxone</div>
      </div>
    </div>
    <div class="header-right">
      <div><strong>Data:</strong> ${date}</div>
      <div><strong>Dokument:</strong> Szacunkowy kosztorys</div>
      <div>kontakt@thome.pl · thome.pl</div>
    </div>
  </div>

  <div class="doc-title">${project.name || "Projekt Smart Home"}</div>
  <div class="doc-sub">Szacunkowy kosztorys systemu Loxone</div>

  <div class="project-box">
    <div class="proj-item"><label>Typ obiektu</label><value>${project.type || "—"}</value></div>
    <div class="proj-item"><label>Metraż</label><value>${project.area ? project.area + " m²" : "—"}</value></div>
    <div class="proj-item"><label>Pomieszczenia</label><value>${project.rooms ? project.rooms + " pom." : "—"}</value></div>
    <div class="proj-item"><label>Kondygnacje</label><value>${project.floors ? project.floors + " kondygnacje" : "—"}</value></div>
    <div class="proj-item"><label>Etap</label><value>${project.stage || "—"}</value></div>
  </div>

  <div class="total-hero">
    <div>
      <div class="total-label">Łączna wartość inwestycji (netto)</div>
      <div class="total-value">${formatPLN(grandTotal)}</div>
      <div class="total-range">Zakres: ${formatPLN(grandTotal * 0.9)} – ${formatPLN(grandTotal * 1.15)}</div>
    </div>
  </div>

  <div class="breakdown">
    <div class="bc"><div class="bc-label">Sprzęt i urządzenia</div><div class="bc-val">${formatPLN(est.hardware)}</div><div class="bc-bar"><div class="bc-fill" style="width:${Math.round(est.hardware/grandTotal*100)}%;background:#6C9EE8"></div></div></div>
    <div class="bc"><div class="bc-label">Okablowanie</div><div class="bc-val">${formatPLN(cablingTotal)}</div><div class="bc-bar"><div class="bc-fill" style="width:${Math.round(cablingTotal/grandTotal*100)}%;background:#F59E0B"></div></div></div>
    <div class="bc"><div class="bc-label">Programowanie</div><div class="bc-val">${formatPLN(est.programming)}</div><div class="bc-bar"><div class="bc-fill" style="width:${Math.round(est.programming/grandTotal*100)}%;background:#A78BFA"></div></div></div>
    <div class="bc"><div class="bc-label">Instalacja</div><div class="bc-val">${formatPLN(est.installation)}</div><div class="bc-bar"><div class="bc-fill" style="width:${Math.round(est.installation/grandTotal*100)}%;background:#69c351"></div></div></div>
  </div>

  <table>
    <thead><tr><th>Pozycja</th><th>Ilość</th><th>Cena jedn.</th><th>Wartość</th></tr></thead>
    <tbody>
      <tr class="section-row"><td colspan="4">Sprzęt i urządzenia</td></tr>
      ${est.items.map(i => `<tr><td>${i.label}</td><td>${i.qty} ${i.unit}</td><td>${formatPLN(i.price)}</td><td>${formatPLN(i.total)}</td></tr>`).join("")}
      ${cablingItems.length > 0 ? `
      <tr class="section-row"><td colspan="4">Okablowanie (materiały)</td></tr>
      ${cablingItems.map(i => `<tr><td>${i.label}</td><td>${i.qty} ${i.unit}</td><td>${formatPLN(i.price)}</td><td>${formatPLN(i.total)}</td></tr>`).join("")}
      ` : ""}
      <tr class="section-row"><td colspan="4">Robocizna</td></tr>
      <tr><td>Programowanie Loxone Config</td><td>${est.progHours} godz.</td><td>${formatPLN(est.ratesProg)}</td><td>${formatPLN(est.programming)}</td></tr>
      <tr><td>Instalacja i uruchomienie systemu</td><td>${est.instHours} godz.</td><td>${formatPLN(est.ratesInst)}</td><td>${formatPLN(est.installation)}</td></tr>
      <tr class="total-row-pdf"><td colspan="3">RAZEM NETTO</td><td>${formatPLN(grandTotal)}</td></tr>
    </tbody>
  </table>

  <div class="systems-row"><strong>Wybrane systemy:</strong> ${systemLabels}</div>

  <div class="footer">
    <div class="footer-left">
      <strong>tHOME — Thinking Home</strong><br/>
      Certyfikowany Partner Loxone<br/>
      kontakt@thome.pl
    </div>
    <div class="footer-right">
      <a href="https://thome.pl">thome.pl</a><br/>
      konfigurator.thome.pl
    </div>
  </div>
  <div class="disclaimer">* Wycena ma charakter szacunkowy i nie stanowi oferty handlowej w rozumieniu Kodeksu Cywilnego. Ostateczna cena zależy od specyfiki instalacji, standardu wykończenia i zakresu prac. Ceny netto, do których należy doliczyć podatek VAT 23%.</div>

  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

function StepResult({ project, systems, details, cabling, rates }) {
  const est = calcEstimate(systems, details, rates);
  const { cablingItems, cablingTotal } = calcCablingCost(cabling, rates);
  const grandTotal = est.total + cablingTotal;
  const [lead, setLead] = useState({ name: "", phone: "", email: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const systemLabels = systems.map(s => SYSTEMS.find(x => x.id === s)?.label).join(", ");

  const sendLead = async () => {
    setSending(true);
    setError("");
    try {
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: "service_c4i6b1t",
          template_id: "template_vtjpppj",
          user_id: "cp949tIM01NdHiFvz",
          template_params: {
            from_name: lead.name,
            phone: lead.phone,
            reply_to: lead.email || "nie podano",
            project_name: project.name || "Bez nazwy",
            project_type: project.type || "—",
            area: project.area || "—",
            rooms: project.rooms || "—",
            systems: systemLabels,
            total: formatPLN(grandTotal),
          }
        })
      });
      setSent(true);
    } catch (e) {
      setError("Błąd wysyłki — zadzwoń lub napisz bezpośrednio na kontakt@thome.pl");
    }
    setSending(false);
  };

  return (
    <div className="step-content result-step">
      <div className="result-header">
        <div className="result-badge">Szacunkowy kosztorys</div>
        <h2 className="result-title">{project.name || "Twój projekt"}</h2>
        <p className="result-meta">{project.type} · {project.area} m² · {project.rooms} pomieszczeń</p>
      </div>

      <div className="estimate-total-box">
        <div className="estimate-total-label">Łączna wartość inwestycji</div>
        <div className="estimate-total-value">{formatPLN(grandTotal)}</div>
        <div className="estimate-total-range">
          Zakres: {formatPLN(grandTotal * 0.9)} – {formatPLN(grandTotal * 1.15)}
        </div>
      </div>

      <button
        className="pdf-btn"
        onClick={() => generatePDF({ project, est, cablingItems, cablingTotal, grandTotal, systemLabels })}
      >
        ⬇ Pobierz kosztorys PDF
      </button>

      <div className="breakdown-grid breakdown-grid-4">
        <BreakdownCard icon="📦" label="Sprzęt i urządzenia" value={formatPLN(est.hardware)} pct={Math.round(est.hardware / grandTotal * 100)} color="#6C9EE8" />
        <BreakdownCard icon="🔌" label="Okablowanie" value={formatPLN(cablingTotal)} pct={Math.round(cablingTotal / grandTotal * 100)} color="#F59E0B" />
        <BreakdownCard icon="⚙️" label="Programowanie" value={formatPLN(est.programming)} sub={`${est.progHours} godz.`} pct={Math.round(est.programming / grandTotal * 100)} color="#A78BFA" />
        <BreakdownCard icon="🔧" label="Instalacja" value={formatPLN(est.installation)} sub={`${est.instHours} godz.`} pct={Math.round(est.installation / grandTotal * 100)} color="#34D399" />
      </div>

      <div className="items-table">
        <div className="items-table-header">
          <span>Pozycja</span>
          <span>Ilość</span>
          <span>Cena jedn.</span>
          <span>Wartość</span>
        </div>
        <div className="items-section-label">Sprzęt i urządzenia</div>
        {est.items.map((item, i) => (
          <div key={i} className="items-row">
            <span>{item.label}</span>
            <span>{item.qty} {item.unit}</span>
            <span>{formatPLN(item.price)}</span>
            <span className="row-total">{formatPLN(item.total)}</span>
          </div>
        ))}
        {cablingItems.length > 0 && <>
          <div className="items-section-label cabling-section">Okablowanie</div>
          {cablingItems.map((item, i) => (
            <div key={"c"+i} className="items-row cabling-row-color">
              <span>{item.label}</span>
              <span>{item.qty} {item.unit}</span>
              <span>{formatPLN(item.price)}</span>
              <span className="row-total">{formatPLN(item.total)}</span>
            </div>
          ))}
        </>}
        <div className="items-section-label prog-section">Robocizna (programowanie i uruchomienie)</div>
        <div className="items-row prog-row">
          <span>Programowanie Loxone Config</span>
          <span>{est.progHours} godz.</span>
          <span>{formatPLN(est.ratesProg)}</span>
          <span className="row-total">{formatPLN(est.programming)}</span>
        </div>
        <div className="items-row prog-row">
          <span>Instalacja i uruchomienie systemu</span>
          <span>{est.instHours} godz.</span>
          <span>{formatPLN(est.ratesInst)}</span>
          <span className="row-total">{formatPLN(est.installation)}</span>
        </div>
        <div className="items-row total-row">
          <span style={{fontWeight:700}}>RAZEM NETTO</span>
          <span></span>
          <span></span>
          <span className="row-total" style={{fontSize:15}}>{formatPLN(grandTotal)}</span>
        </div>
      </div>

      <div className="systems-summary">
        <span className="systems-label">Wybrane systemy:</span>
        <span>{systemLabels}</span>
      </div>

      {!sent ? (
        <div className="lead-form">
          <div className="lead-logo-row">
            <span className="lead-logo-icon">⌂</span>
            <span className="lead-logo-name">t<strong>HOME</strong></span>
          </div>
          <h3 className="lead-title">Umów bezpłatną konsultację</h3>
          <p className="lead-sub">Zostaw dane — oddzwonimy i omówimy szczegóły Twojego projektu. Bez zobowiązań.</p>
          <div className="lead-fields">
            <input placeholder="Imię i nazwisko" value={lead.name} onChange={e => setLead({ ...lead, name: e.target.value })} />
            <input placeholder="Numer telefonu" value={lead.phone} onChange={e => setLead({ ...lead, phone: e.target.value })} />
            <input placeholder="Adres e-mail (opcjonalnie)" value={lead.email} onChange={e => setLead({ ...lead, email: e.target.value })} />
          </div>
          <button className="lead-btn" onClick={sendLead} disabled={!lead.name || !lead.phone || sending}>
            {sending ? "Wysyłanie..." : "Wyślij zapytanie do tHOME →"}
          </button>
          {error && <div className="lead-error">{error}</div>}
          <div className="lead-contact-row">
            <a href="mailto:kontakt@thome.pl">kontakt@thome.pl</a>
            <span>·</span>
            <a href="https://thome.pl" target="_blank">thome.pl</a>
          </div>
        </div>
      ) : (
        <div className="lead-success">
          <div className="success-icon">✓</div>
          <h3>Zapytanie wysłane!</h3>
          <p>Zespół tHOME skontaktuje się z Tobą w ciągu 24 godzin roboczych.</p>
        </div>
      )}

      <div className="disclaimer">
        * Wycena szacunkowa, nie stanowi oferty handlowej. Ceny netto + VAT 23%. tHOME — Certyfikowany Partner Loxone.
      </div>

      <div className="thome-footer">
        <span className="footer-logo">⌂ t<strong>HOME</strong></span>
        <span>kontakt@thome.pl · <a href="https://thome.pl" target="_blank">thome.pl</a></span>
      </div>
    </div>
  );
}

function BreakdownCard({ icon, label, value, sub, pct, color }) {
  return (
    <div className="breakdown-card">
      <div className="bc-icon">{icon}</div>
      <div className="bc-label">{label}</div>
      {sub && <div className="bc-sub">{sub}</div>}
      <div className="bc-value" style={{ color }}>{value}</div>
      <div className="bc-bar-bg">
        <div className="bc-bar" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="bc-pct">{pct}%</div>
    </div>
  );
}

// ─── DEFAULT RATES ────────────────────────────────────────────────────────────
const DEFAULT_RATES = {
  cabling_mb:      15,   // zł/mb (łącznie wszystkie kable, średnia)
  programming_h:   250,  // zł/godz.
  installation_h:  120,  // zł/godz. (montaż urządzeń)
};

// ─── SETTINGS MODAL ──────────────────────────────────────────────────────────
function SettingsModal({ rates, onChange, onClose }) {
  const [local, setLocal] = useState({ ...rates });
  const update = (key, val) => setLocal(p => ({ ...p, [key]: parseFloat(val) || 0 }));
  const save = () => { onChange(local); onClose(); };
  const reset = () => setLocal({ ...DEFAULT_RATES });

  const sections = [
    {
      icon: "🔌",
      title: "Okablowanie",
      color: "#F59E0B",
      desc: "Średnia stawka za metr bieżący materiału kablowego (kable, rury, puszki łącznie)",
      fields: [
        { key: "cabling_mb", label: "Stawka za mb okablowania", unit: "zł/mb" },
      ]
    },
    {
      icon: "⚙️",
      title: "Programowanie",
      color: "#A78BFA",
      desc: "Stawka za godzinę pracy w Loxone Config (konfiguracja, sceny, harmonogramy)",
      fields: [
        { key: "programming_h", label: "Stawka za godzinę programowania", unit: "zł/godz." },
      ]
    },
    {
      icon: "🔧",
      title: "Montaż i uruchomienie",
      color: "#34D399",
      desc: "Stawka za godzinę montażu urządzeń, podłączeń i uruchomienia systemu",
      fields: [
        { key: "installation_h", label: "Stawka za godzinę montażu", unit: "zł/godz." },
      ]
    },
  ];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">Przelicznik stawek</div>
            <div className="modal-sub">Ustaw swoje stawki — kosztorys wyliczy się automatycznie</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {sections.map(s => (
            <div key={s.title} className="settings-section">
              <div className="settings-section-header" style={{ borderLeftColor: s.color }}>
                <span className="settings-icon">{s.icon}</span>
                <div>
                  <div className="settings-title">{s.title}</div>
                  <div className="settings-desc">{s.desc}</div>
                </div>
              </div>
              {s.fields.map(f => (
                <div key={f.key} className="settings-field">
                  <label>{f.label}</label>
                  <div className="settings-input-wrap">
                    <input
                      type="number"
                      min="0"
                      step="5"
                      value={local[f.key]}
                      onChange={e => update(f.key, e.target.value)}
                    />
                    <span className="settings-unit">{f.unit}</span>
                  </div>
                  <div className="settings-default">
                    Domyślnie: {DEFAULT_RATES[f.key]} {f.unit}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn-reset" onClick={reset}>↺ Przywróć domyślne</button>
          <button className="btn-save" onClick={save}>Zapisz stawki</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const STEPS = ["Projekt", "Systemy", "Szczegóły", "Okablowanie", "Kosztorys"];

export default function App() {
  const [step, setStep] = useState(0);
  const [project, setProject] = useState({ name: "", type: "", area: "", rooms: "", floors: "", stage: "" });
  const [systems, setSystems] = useState([]);
  const [details, setDetails] = useState({
    lightPoints: "", blindsCount: "", heatingZones: "",
    motionSensors: "", doorSensors: "", audioZones: "",
    gateCount: "", energyMeters: "", cameraCount: ""
  });
  const [cabling, setCabling] = useState({});
  const [rates, setRates] = useState({ ...DEFAULT_RATES });
  const [showSettings, setShowSettings] = useState(false);

  const canNext = () => {
    if (step === 0) return project.name && project.type && project.area;
    if (step === 1) return systems.length > 0;
    return true;
  };

  return (
    <div className="app">
      <style>{CSS}</style>

      {showSettings && <SettingsModal rates={rates} onChange={setRates} onClose={() => setShowSettings(false)} />}

      <header className="header">
        <div className="logo">
          <svg viewBox="0 0 595.28 280.63" className="logo-svg" xmlns="http://www.w3.org/2000/svg">
            <line stroke="#69c351" strokeLinecap="round" strokeWidth="8.63" fill="none" x1="280.93" y1="88.82" x2="280.93" y2="112.38"/>
            <path fill="none" stroke="#69c351" strokeLinecap="round" strokeWidth="8.63" d="M265.24,100.05c-7.37,5.02-12.21,13.48-12.21,23.08,0,15.41,12.49,27.9,27.91,27.9s27.9-12.49,27.9-27.9c0-9.64-4.88-18.13-12.31-23.15"/>
            <path fill="white" d="M459.77,183.76v-4.25h6.78c1.1,0,1.65-.58,1.65-1.8s-.55-1.8-1.65-1.8h-8.64c-1.44,0-2.08.64-2.08,2.08v15.7c0,1.44.64,2.08,2.08,2.08h8.83c1.1,0,1.65-.58,1.65-1.8s-.55-1.8-1.65-1.8h-6.96v-4.8h5.53c1.1,0,1.65-.58,1.65-1.8s-.55-1.8-1.65-1.8h-5.53ZM437.81,180.86l.7,13.41c.06,1.1.76,1.65,2.14,1.65s1.98-.55,1.92-1.65l-1.1-16c-.12-1.65-.64-2.51-2.66-2.51-1.89,0-2.69.7-3.39,2.57l-3.91,10.05-3.91-10.05c-.73-1.92-1.68-2.57-3.48-2.57-2.08,0-2.6.86-2.69,2.51l-1.13,16c-.06,1.1.55,1.65,1.86,1.65s1.96-.49,2.02-1.65l.73-13.41,4.06,10.63c.43,1.13,1.07,1.71,2.38,1.71s1.96-.58,2.38-1.71l4.06-10.63ZM392.73,185.84c0-4.21,2.2-6.69,5.47-6.69s5.5,2.47,5.5,6.69-2.2,6.69-5.5,6.69-5.47-2.47-5.47-6.69M388.45,185.84c0,6.32,3.85,10.29,9.74,10.29s9.74-3.97,9.74-10.29-3.82-10.29-9.74-10.29-9.74,3.97-9.74,10.29M373.58,175.76c-1.38,0-2.05.55-2.05,1.65v6.32h-7.85v-6.32c0-1.1-.67-1.65-2.08-1.65s-2.08.55-2.08,1.65v16.86c0,1.1.67,1.65,2.08,1.65s2.08-.55,2.08-1.65v-6.84h7.85v6.84c0,1.1.67,1.65,2.08,1.65s2.05-.55,2.05-1.65v-16.86c0-1.1-.67-1.65-2.08-1.65M326.93,188.34v3.64c-.79.24-1.74.4-2.63.4-3.48,0-5.9-2.26-5.9-6.66s2.26-6.48,5.62-6.48c1.22,0,2.32.28,3.27.79.64.37,1.04.67,1.53.67.92,0,1.83-1.1,1.83-1.99,0-.7-.58-1.34-1.59-1.92-1.4-.82-3.18-1.22-5.07-1.22-5.62,0-9.87,3.6-9.87,10.23s4.34,10.17,10.02,10.17c1.86,0,3.82-.37,5.01-.89,1.34-.58,1.74-1.28,1.74-2.5v-5.77c0-1.44-.64-2.08-2.08-2.08h-4.46c-1.1,0-1.65.58-1.65,1.8s.55,1.8,1.65,1.8h2.57ZM288.02,181.1l7.67,12.92c.73,1.28,1.53,1.89,3.12,1.89,1.68,0,2.54-.73,2.54-2.23v-16.28c0-1.1-.64-1.65-1.93-1.65s-1.92.55-1.92,1.65v12.89l-7.3-12.71c-.64-1.13-1.53-1.83-3.3-1.83s-2.69.7-2.69,2.23v16.28c0,1.1.64,1.65,1.92,1.65s1.89-.55,1.89-1.65v-13.16ZM270.64,177.41c0-1.1-.67-1.65-2.08-1.65s-2.08.55-2.08,1.65v16.86c0,1.1.67,1.65,2.08,1.65s2.08-.55,2.08-1.65v-16.86ZM253.29,193.14l-6.54-7.76,6.23-6.75c.4-.43.98-1.13.98-1.8s-.49-1.07-1.93-1.07c-1.31,0-1.99.31-2.75,1.25l-6.45,7.67v-7.27c0-1.1-.67-1.65-2.08-1.65s-2.08.55-2.08,1.65v16.86c0,1.1.67,1.65,2.08,1.65s2.08-.55,2.08-1.65v-8l6.23,8.06c1.01,1.31,1.68,1.59,3.05,1.59,1.47,0,1.99-.4,1.99-1.1,0-.58-.37-1.16-.82-1.68M211.81,181.1l7.67,12.92c.73,1.28,1.53,1.89,3.12,1.89,1.68,0,2.54-.73,2.54-2.23v-16.28c0-1.1-.64-1.65-1.92-1.65s-1.93.55-1.93,1.65v12.89l-7.3-12.71c-.64-1.13-1.53-1.83-3.3-1.83s-2.69.7-2.69,2.23v16.28c0,1.1.64,1.65,1.93,1.65s1.89-.55,1.89-1.65v-13.16ZM194.43,177.41c0-1.1-.67-1.65-2.08-1.65s-2.08.55-2.08,1.65v16.86c0,1.1.67,1.65,2.08,1.65s2.08-.55,2.08-1.65v-16.86ZM174.64,175.76c-1.38,0-2.05.55-2.05,1.65v6.32h-7.85v-6.32c0-1.1-.67-1.65-2.08-1.65s-2.08.55-2.08,1.65v16.86c0,1.1.67,1.65,2.08,1.65s2.08-.55,2.08-1.65v-6.84h7.85v6.84c0,1.1.67,1.65,2.08,1.65s2.05-.55,2.05-1.65v-16.86c0-1.1-.67-1.65-2.08-1.65M142.45,179.6h4.21c1.1,0,1.65-.61,1.65-1.86s-.55-1.83-1.65-1.83h-12.58c-1.1,0-1.65.61-1.65,1.86s.55,1.83,1.65,1.83h4.21v14.66c0,1.1.67,1.65,2.08,1.65s2.08-.55,2.08-1.65v-14.66Z"/>
            <path fill="white" d="M227.38,151.49c0,2.4,2.01,4.41,4.41,4.41s4.41-2.01,4.41-4.41v-53.69c0-2.4-2.01-4.41-4.41-4.41s-4.41,2.01-4.41,4.41v22.63h-36.43v-22.63c0-2.4-2.01-4.41-4.41-4.41s-4.41,2.01-4.41,4.41v53.69c0,2.4,2.01,4.41,4.41,4.41s4.41-2.01,4.41-4.41v-22.63h36.43v22.63ZM167.55,155.14c2.3,0,4.22-1.92,4.22-4.22s-1.92-4.22-4.22-4.22h-14.19c-5.18,0-8.92-3.74-8.92-8.92v-25.03h23.11c2.3,0,4.22-1.92,4.22-4.22s-1.92-4.22-4.22-4.22h-23.11v-11.03c0-2.4-1.92-4.31-4.32-4.31s-4.31,1.92-4.31,4.31v11.03h-6.81c-2.3,0-4.22,1.92-4.22,4.22s1.92,4.22,4.22,4.22h6.81v24.93c0,9.78,7.67,17.45,17.45,17.45h14.29Z"/>
            <path fill="white" d="M466.17,155.14c2.4,0,4.32-1.92,4.32-4.31s-1.92-4.32-4.32-4.32h-33.85v-17.55h30.97c2.4,0,4.31-1.92,4.31-4.31s-1.92-4.32-4.31-4.32h-30.97v-17.55h33.85c2.4,0,4.32-1.92,4.32-4.31s-1.92-4.31-4.32-4.31h-38.16c-2.4,0-4.51,2.01-4.51,4.51v51.97c0,2.49,2.11,4.51,4.51,4.51h38.16ZM399.73,151.49c0,2.4,2.01,4.41,4.41,4.41s4.41-2.01,4.41-4.41v-42.09c0-9.11-7.38-16.49-16.49-16.49s-16.49,7.38-16.49,16.49v30.68c0,4.22-3.45,7.67-7.67,7.67s-7.67-3.45-7.67-7.67v-30.68c0-9.11-7.38-16.49-16.49-16.49s-16.49,7.38-16.49,16.49v42.09c0,2.4,2.01,4.41,4.41,4.41s4.41-2.01,4.41-4.41v-42.28c0-4.22,3.45-7.67,7.67-7.67s7.67,3.45,7.67,7.67v30.68c0,9.11,7.38,16.49,16.49,16.49s16.49-7.38,16.49-16.49v-30.68c0-4.22,3.45-7.67,7.67-7.67s7.67,3.45,7.67,7.67v42.28Z"/>
          </svg>
        </div>
        <button className="settings-btn" onClick={() => setShowSettings(true)} title="Stawki robocizny">
          ⚙️ <span className="settings-btn-label">Stawki</span>
        </button>
      </header>

      <div className="progress-bar-wrap">
        <div className="progress-steps">
          {STEPS.map((s, i) => (
            <div key={i} className={`progress-step ${i < step ? "done" : ""} ${i === step ? "active" : ""}`}>
              <div className="ps-dot">{i < step ? "✓" : i + 1}</div>
              <div className="ps-label">{s}</div>
            </div>
          ))}
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
        </div>
      </div>

      <main className="main">
        {step === 0 && <StepProject data={project} onChange={setProject} />}
        {step === 1 && <StepSystems selected={systems} onChange={setSystems} />}
        {step === 2 && <StepDetails systems={systems} details={details} onChange={setDetails} />}
        {step === 3 && <StepCabling project={project} systems={systems} details={details} cabling={cabling} onChange={setCabling} rates={rates} />}
        {step === 4 && <StepResult project={project} systems={systems} details={details} cabling={cabling} rates={rates} />}
      </main>

      <div className="nav-bar">
        {step > 0 && (
          <button className="btn-back" onClick={() => setStep(s => s - 1)}>← Wróć</button>
        )}
        <div style={{ flex: 1 }} />
        {step < STEPS.length - 1 && (
          <button
            className={`btn-next ${canNext() ? "" : "disabled"}`}
            onClick={() => canNext() && setStep(s => s + 1)}
          >
            {step === STEPS.length - 2 ? "Generuj kosztorys →" : "Dalej →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0f0d;
    --surface: #141614;
    --surface2: #1b1e1b;
    --border: #242724;
    --accent: #69c351;
    --accent2: #4a9e38;
    --green: #69c351;
    --text: #eef2ee;
    --muted: #6b7a6b;
    --radius: 14px;
  }

  body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; -webkit-text-size-adjust: 100%; }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    max-width: 540px;
    margin: 0 auto;
  }

  /* HEADER */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 10;
    background: var(--bg);
  }
  .logo { display: flex; align-items: center; }
  .logo-svg { height: 38px; width: auto; }
  .logo-icon { font-size: 20px; color: var(--accent); line-height: 1; }
  .logo-text-wrap { display: flex; flex-direction: column; gap: 0; }
  .logo-t { font-family: 'Syne', sans-serif; font-size: 19px; font-weight: 600; color: var(--muted); }
  .logo-home { font-family: 'Syne', sans-serif; font-size: 19px; font-weight: 800; color: var(--accent); margin-left: -1px; }
  .logo-tagline { font-size: 9px; color: var(--muted); letter-spacing: .12em; text-transform: uppercase; margin-top: -2px; }

  /* PROGRESS */
  .progress-bar-wrap { padding: 16px 16px 0; }
  .progress-steps { display: flex; justify-content: space-between; margin-bottom: 10px; position: relative; z-index: 1; }
  .progress-step { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .ps-dot {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 600;
    background: var(--surface2); border: 2px solid var(--border); color: var(--muted);
    transition: all .3s;
  }
  .progress-step.active .ps-dot { background: var(--accent); border-color: var(--accent); color: #fff; }
  .progress-step.done .ps-dot { background: var(--green); border-color: var(--green); color: #000; }
  .ps-label { font-size: 11px; color: var(--muted); }
  .progress-step.active .ps-label { color: var(--accent); }
  .progress-step.done .ps-label { color: var(--green); }
  .progress-track { height: 3px; background: var(--border); border-radius: 2px; margin-top: 4px; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 2px; transition: width .4s ease; }

  /* MAIN */
  .main { flex: 1; padding: 20px 16px 110px; }
  .step-content { animation: fadeIn .25s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  .step-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; margin-bottom: 4px; }
  .step-sub { color: var(--muted); font-size: 13px; margin-bottom: 20px; }
  .form-grid { display: flex; flex-direction: column; gap: 18px; }
  .field-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .field-row .field { flex: 1; min-width: 80px; }
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--muted); }
  .field input {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 13px 14px;
    color: var(--text);
    font-size: 16px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color .2s;
    width: 100%;
  }
  .field input:focus { border-color: var(--accent); }
  .field input::placeholder { color: var(--muted); }
  .pill-group { display: flex; flex-wrap: wrap; gap: 7px; }
  .pill {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 14px;
    color: var(--muted);
    font-size: 13px;
    cursor: pointer;
    transition: all .2s;
    font-family: 'Inter', sans-serif;
  }
  .pill.active { background: rgba(105,195,81,.12); border-color: var(--accent); color: var(--accent); }
  .pill:hover:not(.active) { border-color: #2a3a2a; color: var(--text); }

  /* SYSTEMS */
  .systems-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .system-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 16px;
    display: flex; flex-direction: column; align-items: flex-start; gap: 6px;
    cursor: pointer; transition: all .2s; position: relative; text-align: left;
    font-family: 'Inter', sans-serif;
  }
  .system-card.active { background: rgba(105,195,81,.08); border-color: var(--accent); }
  .system-card:hover:not(.active) { border-color: #2a3a2a; }
  .sys-icon { font-size: 26px; }
  .sys-label { font-size: 14px; font-weight: 600; color: var(--text); }
  .sys-desc { font-size: 11px; color: var(--muted); line-height: 1.5; }
  .sys-check { position: absolute; top: 12px; right: 12px; width: 20px; height: 20px; background: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #111; font-weight: 700; }

  /* DETAILS */
  .details-list { display: flex; flex-direction: column; gap: 16px; }
  .detail-section { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; }
  .detail-header { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 15px; margin-bottom: 16px; }
  .detail-fields { display: flex; flex-direction: column; gap: 14px; }
  .number-input { display: flex; align-items: center; gap: 0; }
  .number-input button {
    width: 40px; height: 44px; background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); font-size: 18px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; transition: background .15s;
  }
  .number-input button:first-child { border-radius: 10px 0 0 10px; }
  .number-input button:last-child { border-radius: 0 10px 10px 0; }
  .number-input button:hover { background: var(--border); }
  .number-input input {
    width: 70px; height: 44px; text-align: center;
    background: var(--surface); border: 1px solid var(--border); border-left: none; border-right: none;
    color: var(--text); font-size: 16px; font-weight: 600; font-family: 'Inter', sans-serif; outline: none;
  }

  /* RESULT */
  .result-step { display: flex; flex-direction: column; gap: 20px; }
  .result-header { text-align: center; }
  .result-badge { display: inline-block; background: rgba(105,195,81,.12); color: var(--accent); font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 5px 14px; border-radius: 20px; margin-bottom: 10px; }
  .result-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; }
  .result-meta { color: var(--muted); font-size: 13px; margin-top: 4px; }
  .estimate-total-box { background: linear-gradient(135deg, rgba(105,195,81,.08), rgba(74,158,56,.06)); border: 1px solid rgba(105,195,81,.2); border-radius: var(--radius); padding: 28px; text-align: center; }
  .estimate-total-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: .1em; margin-bottom: 8px; }
  .estimate-total-value { font-family: 'Syne', sans-serif; font-size: 42px; font-weight: 800; background: linear-gradient(90deg, var(--accent), #8fda76); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .estimate-total-range { font-size: 13px; color: var(--muted); margin-top: 6px; }
  .breakdown-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .breakdown-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 4px; }
  .bc-icon { font-size: 20px; margin-bottom: 4px; }
  .bc-label { font-size: 11px; color: var(--muted); line-height: 1.4; }
  .bc-sub { font-size: 11px; color: var(--muted); }
  .bc-value { font-size: 16px; font-weight: 700; margin-top: 4px; }
  .bc-bar-bg { height: 3px; background: var(--border); border-radius: 2px; margin-top: 8px; }
  .bc-bar { height: 100%; border-radius: 2px; }
  .bc-pct { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .items-table { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .items-table-header { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 10px 16px; background: var(--surface2); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--muted); }
  .items-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 11px 16px; border-top: 1px solid var(--border); font-size: 13px; color: var(--text); }
  .prog-row { background: rgba(139,92,246,.04); }
  .row-total { font-weight: 600; color: var(--text); }
  .systems-summary { font-size: 12px; color: var(--muted); }
  .systems-label { font-weight: 600; margin-right: 6px; }
  .lead-form { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; }
  .lead-title { font-family: 'Syne', sans-serif; font-size: 18px; margin-bottom: 6px; }
  .lead-sub { color: var(--muted); font-size: 13px; margin-bottom: 18px; }
  .lead-fields { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
  .lead-fields input { background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 12px 16px; color: var(--text); font-size: 14px; font-family: 'Inter', sans-serif; outline: none; }
  .lead-fields input:focus { border-color: var(--accent); }
  .lead-fields input::placeholder { color: var(--muted); }
  .lead-logo-row { margin-bottom: 14px; }
  .lead-btn { width: 100%; padding: 14px; background: linear-gradient(90deg, var(--accent), var(--accent2)); border: none; border-radius: 10px; color: #111; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Inter', sans-serif; transition: opacity .2s; }
  .lead-btn:hover { opacity: .9; }
  .lead-btn.disabled, .lead-btn:disabled { opacity: .4; cursor: not-allowed; }
  .lead-contact-row { display: flex; justify-content: center; gap: 10px; font-size: 12px; color: var(--muted); margin-top: 12px; }
  .lead-contact-row a { color: var(--accent); text-decoration: none; }
  .lead-success { text-align: center; padding: 32px; background: rgba(52,211,153,.08); border: 1px solid rgba(52,211,153,.3); border-radius: var(--radius); }
  .success-icon { width: 52px; height: 52px; background: var(--green); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #000; font-weight: 700; margin: 0 auto 14px; }
  .lead-success h3 { font-family: 'Syne', sans-serif; font-size: 20px; margin-bottom: 6px; }
  .lead-success p { color: var(--muted); font-size: 14px; }
  .disclaimer { font-size: 11px; color: var(--muted); line-height: 1.6; padding-top: 8px; }
  .thome-footer { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 20px 24px; border-top: 1px solid var(--border); margin-top: 8px; }
  .thome-footer span { font-size: 11px; color: var(--muted); }
  .thome-footer a { color: var(--accent); text-decoration: none; }
  .total-row { background: rgba(105,195,81,.06); border-top: 2px solid var(--accent) !important; }

  /* NAV */
  .nav-bar {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 540px;
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px 20px;
    background: linear-gradient(to top, var(--bg) 75%, transparent);
    border-top: 1px solid var(--border);
  }
  .btn-back { background: var(--surface); border: 1px solid var(--border); color: var(--muted); padding: 14px 18px; border-radius: 12px; font-size: 14px; cursor: pointer; font-family: 'Inter', sans-serif; transition: all .2s; white-space: nowrap; }
  .btn-next { background: linear-gradient(90deg, var(--accent), var(--accent2)); border: none; color: #111; padding: 14px 0; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Inter', sans-serif; transition: opacity .2s; flex: 1; }
  .btn-next:hover { opacity: .9; }
  .btn-next.disabled { opacity: .4; cursor: not-allowed; }

  /* SETTINGS BUTTON */
  .settings-btn { background: var(--surface); border: 1px solid var(--border); color: var(--muted); padding: 8px 12px; border-radius: 8px; font-size: 13px; cursor: pointer; font-family: 'Inter', sans-serif; transition: all .2s; display: flex; align-items: center; gap: 5px; white-space: nowrap; }
  .settings-btn:hover { color: var(--text); border-color: var(--accent); }
  .settings-btn-label { display: inline; }

  /* MODAL — slides up from bottom on mobile */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.75); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: flex-end; justify-content: center; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 20px 20px 0 0; width: 100%; max-width: 540px; max-height: 88vh; display: flex; flex-direction: column; overflow: hidden; }
  .modal-header { padding: 18px 16px 14px; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-shrink: 0; }
  .modal-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; }
  .modal-sub { font-size: 12px; color: var(--muted); margin-top: 3px; }
  .modal-close { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 14px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .modal-body { padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }
  .modal-footer { padding: 12px 16px 20px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; flex-shrink: 0; }
  .btn-reset { background: transparent; border: 1px solid var(--border); color: var(--muted); padding: 12px 16px; border-radius: 10px; font-size: 13px; cursor: pointer; font-family: 'Inter', sans-serif; }
  .btn-save { background: linear-gradient(90deg, var(--accent), var(--accent2)); border: none; color: #111; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Inter', sans-serif; flex: 1; }

  /* SETTINGS SECTIONS */
  .settings-section { background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 12px; }
  .settings-section-header { display: flex; align-items: flex-start; gap: 10px; padding-left: 10px; border-left: 3px solid; }
  .settings-icon { font-size: 18px; flex-shrink: 0; }
  .settings-title { font-size: 14px; font-weight: 600; }
  .settings-desc { font-size: 12px; color: var(--muted); margin-top: 2px; line-height: 1.4; }
  .settings-field { display: flex; flex-direction: column; gap: 6px; }
  .settings-field label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--muted); }
  .settings-input-wrap { display: flex; align-items: center; gap: 10px; }
  .settings-input-wrap input { flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; color: var(--text); font-size: 22px; font-weight: 700; font-family: 'Inter', sans-serif; outline: none; transition: border-color .2s; }
  .settings-input-wrap input:focus { border-color: var(--accent); }
  .settings-unit { font-size: 13px; color: var(--muted); white-space: nowrap; }
  .settings-default { font-size: 11px; color: var(--muted); }

  /* BREAKDOWN — 2 cols on mobile, 4 on wide */
  .breakdown-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .breakdown-grid-4 { grid-template-columns: 1fr 1fr !important; }
  .breakdown-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 3px; }
  .bc-icon { font-size: 18px; margin-bottom: 2px; }
  .bc-label { font-size: 11px; color: var(--muted); line-height: 1.3; }
  .bc-sub { font-size: 10px; color: var(--muted); }
  .bc-value { font-size: 14px; font-weight: 700; margin-top: 4px; }
  .bc-bar-bg { height: 3px; background: var(--border); border-radius: 2px; margin-top: 6px; }
  .bc-bar { height: 100%; border-radius: 2px; }
  .bc-pct { font-size: 10px; color: var(--muted); margin-top: 2px; }

  /* ITEMS TABLE — 3 col on mobile (hide unit price) */
  .items-table { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .items-table-header { display: grid; grid-template-columns: 1fr auto auto; padding: 8px 12px; background: var(--surface2); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--muted); gap: 8px; }
  .items-row { display: grid; grid-template-columns: 1fr auto auto; padding: 10px 12px; border-top: 1px solid var(--border); font-size: 12px; color: var(--text); gap: 8px; align-items: center; }
  .items-table-header span:nth-child(3), .items-row span:nth-child(3) { display: none; }
  .items-section-label { padding: 6px 12px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--muted); background: var(--surface2); border-top: 1px solid var(--border); }
  .cabling-section { color: #D97706; }
  .prog-section { color: #A78BFA; }
  .cabling-row-color { background: rgba(245,158,11,.04); }
  .prog-row { background: rgba(139,92,246,.04); }
  .row-total { font-weight: 600; text-align: right; white-space: nowrap; }
  .total-row { background: rgba(105,195,81,.06); border-top: 2px solid var(--accent) !important; }

  /* CABLING STEP */
  .cabling-info { display: flex; align-items: flex-start; gap: 8px; background: rgba(245,158,11,.08); border: 1px solid rgba(245,158,11,.25); border-radius: 10px; padding: 10px 12px; font-size: 12px; color: #D97706; margin-bottom: 16px; line-height: 1.5; }
  .cabling-list { display: flex; flex-direction: column; gap: 8px; }
  .cabling-row { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .cabling-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
  .cabling-dot { font-size: 16px; flex-shrink: 0; }
  .cabling-label { font-size: 13px; font-weight: 600; color: var(--text); }
  .cabling-desc { font-size: 11px; color: var(--muted); margin-top: 1px; }
  .cabling-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
  .cabling-auto-badge { font-size: 10px; color: var(--muted); background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; padding: 2px 7px; white-space: nowrap; }
  .cabling-unit { font-size: 10px; color: var(--muted); text-align: center; }
  .number-input.compact button { width: 34px; height: 38px; font-size: 16px; }
  .number-input.compact input { width: 50px; height: 38px; font-size: 14px; }

  /* PDF BUTTON */
  .pdf-btn { width: 100%; padding: 14px; background: transparent; border: 1.5px solid var(--accent); border-radius: 12px; color: var(--accent); font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .pdf-btn:hover { background: rgba(105,195,81,.08); }

  /* LEAD FORM */
  .lead-form { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; }
  .lead-logo-row { display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
  .lead-logo-icon { font-size: 18px; color: var(--accent); }
  .lead-logo-name { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: var(--text); }
  .lead-logo-name strong { color: var(--accent); }
  .lead-sub { color: var(--muted); font-size: 13px; margin-bottom: 14px; line-height: 1.5; }
  .lead-fields { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
  .lead-fields input { background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 13px 14px; color: var(--text); font-size: 16px; font-family: 'Inter', sans-serif; outline: none; width: 100%; }
  .lead-fields input:focus { border-color: var(--accent); }
  .lead-fields input::placeholder { color: var(--muted); }
  .lead-error { font-size: 12px; color: #f87171; margin-top: 8px; text-align: center; }
  .lead-contact-row { display: flex; justify-content: center; gap: 10px; font-size: 12px; color: var(--muted); margin-top: 12px; flex-wrap: wrap; }
  .lead-contact-row a { color: var(--accent); text-decoration: none; }
  .lead-success { text-align: center; padding: 28px 16px; background: rgba(52,211,153,.08); border: 1px solid rgba(52,211,153,.3); border-radius: var(--radius); }
  .success-icon { width: 48px; height: 48px; background: var(--green); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #000; font-weight: 700; margin: 0 auto 12px; }
  .lead-success h3 { font-family: 'Syne', sans-serif; font-size: 18px; margin-bottom: 6px; }
  .lead-success p { color: var(--muted); font-size: 13px; }
  .disclaimer { font-size: 11px; color: var(--muted); line-height: 1.6; padding-top: 8px; }
  .thome-footer { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px; border-top: 1px solid var(--border); margin-top: 4px; flex-wrap: wrap; text-align: center; }
  .footer-logo { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: var(--accent); }
  .thome-footer span { font-size: 11px; color: var(--muted); }
  .thome-footer a { color: var(--accent); text-decoration: none; }
`;

