import { imageBlurData } from "@/features/tours/data/image-blur";
import type { ImageCredit, ImageEntry } from "@/types";
import type { LocalizedText } from "@/config/i18n";

/**
 * Demo photography from Wikimedia Commons, downloaded into public/images/tours by
 * `node scripts/fetch-demo-photos.mjs` (Commons rate limits hotlinking with HTTP 429).
 * Blur previews come from `node scripts/generate-blur-data.mjs`.
 * Author and licence come from the Commons API — keep them, the photos are CC licensed.
 */
function photo(
  name: keyof typeof imageBlurData | string,
  commonsFile: string,
  credit: Omit<ImageCredit, "source">,
  alt: LocalizedText,
): ImageEntry {
  return {
    url: `/images/tours/${name}.jpg`,
    blurDataURL: imageBlurData[name],
    alt,
    credit: {
      ...credit,
      source: `https://commons.wikimedia.org/wiki/File:${commonsFile}`,
    },
  };
}

const GAGNON = { author: "Bernard Gagnon", license: "CC BY-SA 3.0" };
const DRONEPICR = { author: "dronepicr", license: "CC BY 2.0" };
const CEBECI = { author: "Dr. Zeynel Cebeci", license: "CC BY-SA 3.0" };
const ANTOLOJI = { author: "Antoloji", license: "CC BY-SA 4.0" };
const ESGINMURAT = { author: "Esginmurat", license: "CC BY-SA 4.0" };
const NALANGAN = { author: "Philip Nalangan", license: "CC BY 4.0" };

export const tourImages = {
  cappadociaBalloons: photo(
    "cappadocia-balloons",
    "Hot_air_balloon_in_Cappadocia_02.jpg",
    GAGNON,
    {
      tr: "Kapadokya'da gün doğumunda peribacalarının üzerinde süzülen sıcak hava balonları",
      en: "Hot air balloons drifting over the fairy chimneys of Cappadocia at sunrise",
    },
  ),
  cappadociaBalloonClose: photo(
    "cappadocia-balloon-close",
    "Hot_air_balloon_in_Cappadocia_01.jpg",
    GAGNON,
    {
      tr: "Vadinin üzerinde yükselen tek bir sıcak hava balonu",
      en: "A single hot air balloon rising above the valley",
    },
  ),
  cappadociaAerial: photo(
    "cappadocia-aerial",
    "Cappadocia_Aerial_View_Landscape.jpg",
    { author: "Benh LIEU SONG (Flickr)", license: "CC BY-SA 4.0" },
    {
      tr: "Kapadokya'nın havadan görünen vadileri ve kaya oluşumları",
      en: "Aerial view of the valleys and rock formations of Cappadocia",
    },
  ),
  oludenizSwimming: photo(
    "oludeniz-swimming",
    "Swimming_in_the_Blue_Lagoon_in_%C3%96l%C3%BCdeniz%2C_Turkey_%2849070223763%29.jpg",
    DRONEPICR,
    {
      tr: "Ölüdeniz'in turkuaz lagününde yüzen insanlar",
      en: "People swimming in the turquoise lagoon of Ölüdeniz",
    },
  ),
  oludenizParagliding: photo(
    "oludeniz-paragliding",
    "Paragliding_over_the_Blue_Lagoon_in_%C3%96l%C3%BCdeniz%2C_Turkey_%2849070937152%29.jpg",
    DRONEPICR,
    {
      tr: "Ölüdeniz lagününün üzerinde yamaç paraşütü",
      en: "A paraglider above the Ölüdeniz lagoon",
    },
  ),
  oludenizLagoon: photo(
    "oludeniz-lagoon",
    "Blue_Lagoon_in_%C3%96l%C3%BCdeniz%2C_Turkey_%2849070738266%29.jpg",
    DRONEPICR,
    {
      tr: "Ölüdeniz'in kum dili ve mavi lagünü",
      en: "The sand spit and blue lagoon of Ölüdeniz",
    },
  ),
  ayderPlateau: photo(
    "ayder-plateau",
    "Ayder_Plateau_%40_Rize-Turkey.JPG",
    CEBECI,
    {
      tr: "Rize'de yeşil tepelere yayılmış Ayder Yaylası",
      en: "The Ayder plateau spread across green hills in Rize",
    },
  ),
  firtinaCreek: photo(
    "firtina-creek",
    "F%C4%B1rt%C4%B1na_Deresi_%40Ayder-Rize-Turkey-2.JPG",
    CEBECI,
    {
      tr: "Ormanın içinden akan Fırtına Deresi",
      en: "The Fırtına creek running through the forest",
    },
  ),
  balatHouses: photo("balat-houses", "Balat_houses.jpg", ANTOLOJI, {
    tr: "Balat'ın renkli cepheli tarihi evleri",
    en: "The colourful historic houses of Balat",
  }),
  balatColorful: photo(
    "balat-colorful",
    "Colorful_Balat_houses.jpg",
    ANTOLOJI,
    {
      tr: "Balat'ta yan yana dizilmiş rengarenk evler",
      en: "Brightly painted houses lined up in Balat",
    },
  ),
  balatStreet: photo(
    "balat-street",
    "The_Colorful_Balat.jpg",
    { author: "Vogueeatss", license: "CC BY-SA 4.0" },
    {
      tr: "Balat'ta dik bir sokak ve boyalı cepheler",
      en: "A steep street and painted façades in Balat",
    },
  ),
  kasLimanagzi: photo(
    "kas-limanagzi",
    "Antalya_-_Ka%C5%9F_-Limana%C4%9Fz%C4%B1.jpg",
    { author: "Tugceeakgunn91", license: "CC BY-SA 4.0" },
    {
      tr: "Kaş yakınlarında Limanağzı koyu ve berrak deniz",
      en: "The Limanağzı cove and clear sea near Kaş",
    },
  ),
  kasSunset: photo(
    "kas-sunset",
    "Ka%C5%9F_Ak%C5%9Fam%C3%BCst%C3%BC_Manzaras%C4%B1.jpg",
    ESGINMURAT,
    {
      tr: "Kaş'ta akşamüstü deniz manzarası",
      en: "An evening sea view from Kaş",
    },
  ),
  kasHarbour: photo(
    "kas-harbour",
    "Ka%C5%9F%2C_A%C4%9Fustos_2015_Liman%27dan_bir_g%C3%B6r%C3%BCn%C3%BCm.jpg",
    ESGINMURAT,
    {
      tr: "Kaş limanından tekneler ve kıyı görünümü",
      en: "Boats and the shoreline seen from the harbour of Kaş",
    },
  ),
  baliTerraces: photo(
    "bali-terraces",
    "Tegallalang_Rice_Terraces_Bali.jpg",
    NALANGAN,
    {
      tr: "Bali'de Tegallalang pirinç terasları",
      en: "The Tegallalang rice terraces in Bali",
    },
  ),
  baliTerracesPath: photo(
    "bali-terraces-path",
    "Tegallalang_Rice_Terraces_Bali_1.jpg",
    NALANGAN,
    {
      tr: "Pirinç teraslarının arasından geçen patika",
      en: "A path winding between the rice terraces",
    },
  ),
  baliRiceFields: photo(
    "bali-rice-fields",
    "Rice_terraces%2C_Bali.jpg",
    { author: "Vyacheslav Argenberg", license: "CC BY 4.0" },
    {
      tr: "Bali'de basamak basamak uzanan pirinç tarlaları",
      en: "Stepped rice fields stretching across Bali",
    },
  ),
} satisfies Record<string, ImageEntry>;
