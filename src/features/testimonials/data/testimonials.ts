import type { TestimonialEntry } from "@/features/testimonials/types";

/** Invented reviews for the demo — no real traveller said any of this. */
export const testimonials: TestimonialEntry[] = [
  {
    id: "elif-k",
    author: "Elif K.",
    rating: 5,
    context: { tr: "Likya Yolu, Eylül", en: "Lycian Way, September" },
    quote: {
      tr: "Altı gün boyunca hiçbir şeyi düşünmek zorunda kalmadım. Sabah kalkıyorsun, çantan bir sonraki pansiyona gitmiş oluyor.",
      en: "For six days I did not have to think about anything. You wake up and your bag is already at the next guesthouse.",
    },
  },
  {
    id: "mert-a",
    author: "Mert A.",
    rating: 5,
    context: {
      tr: "Kapadokya Balon Rotası, Mayıs",
      en: "Cappadocia Balloon Route, May",
    },
    quote: {
      tr: "Balon uçuşu beklediğim gibiydi ama asıl sürpriz rehberdi. Kalabalığın gittiği yerlerin hep bir sokak ötesine götürdü bizi.",
      en: "The balloon flight was what I expected, but the guide was the surprise. He kept taking us one street away from the crowds.",
    },
  },
  {
    id: "seda-y",
    author: "Seda Y.",
    rating: 4,
    context: {
      tr: "Karadeniz Yayla Rotası, Temmuz",
      en: "Black Sea Highlands, July",
    },
    quote: {
      tr: "Sekiz kişiydik ve üçüncü gün herkes birbirini tanıyordu. Yürüyüşler zorlamıyor, akşamları sobanın başında oturuyorsun.",
      en: "There were eight of us and by day three everyone knew each other. The walks never push you, and the evenings are spent by the stove.",
    },
  },
  {
    id: "can-o",
    author: "Can Ö.",
    rating: 5,
    context: {
      tr: "Ölüdeniz Tekne Turu, Ağustos",
      en: "Ölüdeniz Boat Trip, August",
    },
    quote: {
      tr: "Üç gün telefonu elime almadım. Günde dört kez denize giriyorsun, akşam güvertede yemek yiyorsun, bitiyor.",
      en: "I did not pick up my phone for three days. You swim four times a day, eat on deck at night, and that is the whole plan.",
    },
  },
  {
    id: "irem-d",
    author: "İrem D.",
    rating: 5,
    context: {
      tr: "İstanbul'un Gizli Sokakları, Nisan",
      en: "Hidden Streets of Istanbul, April",
    },
    quote: {
      tr: "On yıldır İstanbul'da yaşıyorum ve gittiğimiz sekiz yerden altısını bilmiyordum. Fiyatına da değdi.",
      en: "I have lived in Istanbul for ten years and had not heard of six of the eight places we visited. Worth every lira.",
    },
  },
  {
    id: "burak-t",
    author: "Burak T.",
    rating: 5,
    context: {
      tr: "Bali Pirinç Terasları, Şubat",
      en: "Bali Rice Terraces, February",
    },
    quote: {
      tr: "Programda boş günlerin olması çok iyi düşünülmüş. Dönüşte dinlenmeye ihtiyacım olmadı, gerçekten tatil yapmış gibiydim.",
      en: "Leaving empty days in the plan was the smartest part. I came back rested instead of needing another holiday.",
    },
  },
];
