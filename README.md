# Gezdir Beni

Küçük gruplu, rehberli turlar satan bir gezi sitesinin arayüzü. Türkçe ve İngilizce,
tamamen statik, demo verilerle çalışıyor. Backend ve rezervasyon mantığı henüz yok.

> **Demo:** Turlar, fiyatlar, programlar, yorumlar ve iletişim bilgileri gerçek değildir.

## Çalıştırma

```bash
npm install
npm run dev
```

http://localhost:3000 adresi `/tr`'ye yönlenir.

| Komut               | Ne yapar                       |
| ------------------- | ------------------------------ |
| `npm run dev`       | Geliştirme sunucusu            |
| `npm run build`     | Production derlemesi           |
| `npm run lint`      | ESLint                         |
| `npm run typecheck` | Route tipleri + `tsc --noEmit` |
| `npm run format`    | Prettier                       |

## Teknolojiler

Next.js (App Router) · React · TypeScript (strict) · Tailwind CSS v4 · Motion ·
zod ile doğrulanan env · ESLint + Prettier

## Yapı

```
src/
├── app/[locale]/       yönlendirme (tr / en), her sayfa bir dil segmenti altında
├── components/
│   ├── motion/         Reveal, CountUp, Parallax, Magnetic
│   ├── ui/             button, photo, icons, section-heading
│   └── layout/         header, footer, container
├── features/           tours · landing · testimonials
├── i18n/dictionaries/  tüm arayüz metinleri (tr.ts referans, en.ts ona uymak zorunda)
├── config/             site sabitleri, env, dil ayarları
└── lib/                routes, format, localize, api client
```

Mimari kurallar, dil sistemi ve backend eklenince izlenecek üç yol:
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

Kısa versiyonu: sayfalar veriyi doğrudan okumaz, her zaman bir feature'ın `async`
servisini çağırır. Bugün statik veri dönen bu servisler, backend geldiğinde sadece
gövdelerini değiştirir; sayfalar ve bileşenler aynı kalır.

## Fotoğraflar

Demo fotoğrafları Wikimedia Commons'tan, CC lisanslı. Fotoğrafçı ve lisans bilgisi
`src/features/tours/data/images.ts` içinde tutuluyor ve sitede görünür durumda.

```bash
node scripts/fetch-demo-photos.mjs    # public/images/tours içine indirir
node scripts/generate-blur-data.mjs   # next/image için blur önizlemeleri üretir
```
