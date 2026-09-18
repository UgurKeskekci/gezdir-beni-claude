import { tourImages } from "@/features/tours/data/images";
import type { TourEntry } from "@/features/tours/types";

/**
 * Dummy catalogue. Prices, dates, ratings and itineraries are invented for the demo.
 * When a backend arrives this file is deleted and services fetch instead.
 */
export const tours: TourEntry[] = [
  {
    slug: "kapadokya-balon-rotasi",
    accent: "sunrise",
    cover: tourImages.cappadociaBalloons,
    gallery: [tourImages.cappadociaBalloonClose, tourImages.cappadociaAerial],
    title: {
      tr: "Kapadokya Balon Rotası",
      en: "Cappadocia Balloon Route",
    },
    destination: { tr: "Ürgüp", en: "Ürgüp" },
    country: { tr: "Türkiye", en: "Türkiye" },
    summary: {
      tr: "Gün doğumunda balon uçuşu, mağara otelde iki gece ve Ihlara Vadisi'nde yürüyüş.",
      en: "A sunrise balloon flight, two nights in a cave hotel and a walk through the Ihlara Valley.",
    },
    description: {
      tr: "Dört gün boyunca Kapadokya'yı hem yerden hem havadan görüyorsun. Sabahın ilk ışıklarında balonla kalkıyoruz, ardından vadilerde yürüyor, akşamları taş oyma odalarda dinleniyoruz. Rehberimiz bölgede doğup büyümüş biri; gün içinde kalabalıktan uzak duraklara sapıyoruz.",
      en: "Four days of seeing Cappadocia from the ground and from the air. We lift off at first light, walk the valleys during the day and rest in rooms carved from stone at night. Our guide grew up here, so the route keeps ducking away from the crowds.",
    },
    badge: { tr: "En çok satan", en: "Best seller" },
    badgeTone: "bestseller",
    highlights: [
      { tr: "Balon uçuşu dahil", en: "Balloon flight included" },
      { tr: "Mağara otel", en: "Cave hotel" },
      { tr: "Yerel şarap tadımı", en: "Local wine tasting" },
    ],
    included: [
      { tr: "3 gece mağara otelde konaklama", en: "3 nights in a cave hotel" },
      { tr: "Sıcak hava balonu uçuşu", en: "Hot air balloon flight" },
      { tr: "Her sabah kahvaltı", en: "Breakfast every morning" },
      { tr: "Havalimanı transferleri", en: "Airport transfers" },
    ],
    itinerary: [
      {
        day: 1,
        title: { tr: "Varış ve Ürgüp turu", en: "Arrival and Ürgüp" },
        description: {
          tr: "Kayseri'den transfer, otele yerleşme ve gün batımında Ürgüp'te kısa bir yürüyüş.",
          en: "Transfer from Kayseri, check-in, and a short sunset walk through Ürgüp.",
        },
      },
      {
        day: 2,
        title: { tr: "Balon uçuşu ve Göreme", en: "Balloon flight and Göreme" },
        description: {
          tr: "Gün doğumunda balonla kalkış, ardından Göreme Açık Hava Müzesi ve Güvercinlik Vadisi.",
          en: "Lift off at sunrise, then the Göreme Open Air Museum and the Pigeon Valley.",
        },
      },
      {
        day: 3,
        title: { tr: "Ihlara Vadisi yürüyüşü", en: "Ihlara Valley walk" },
        description: {
          tr: "Vadi boyunca 8 km yürüyüş, kaya kiliseleri ve dere kenarında öğle molası.",
          en: "An 8 km walk along the valley, rock churches and lunch by the stream.",
        },
      },
      {
        day: 4,
        title: {
          tr: "Çömlek atölyesi ve dönüş",
          en: "Pottery workshop and departure",
        },
        description: {
          tr: "Avanos'ta çömlek atölyesi, öğleden sonra havalimanına transfer.",
          en: "A pottery workshop in Avanos, then an afternoon transfer to the airport.",
        },
      },
    ],
    durationDays: 4,
    durationNights: 3,
    maxGroupSize: 10,
    rating: 4.9,
    reviewCount: 312,
    price: { amount: 18900, currency: "TRY" },
  },
  {
    slug: "oludeniz-tekne-turu",
    accent: "sea",
    cover: tourImages.oludenizSwimming,
    gallery: [tourImages.oludenizParagliding, tourImages.oludenizLagoon],
    title: {
      tr: "Ölüdeniz Tekne Turu",
      en: "Ölüdeniz Boat Trip",
    },
    destination: { tr: "Fethiye", en: "Fethiye" },
    country: { tr: "Türkiye", en: "Türkiye" },
    summary: {
      tr: "Kelebekler Vadisi, Gemiler Adası ve saklı koylarda yüzme molaları ile üç günlük mavi rota.",
      en: "Three days on the blue route with swim stops at Butterfly Valley, Gemiler Island and hidden coves.",
    },
    description: {
      tr: "Üç gün boyunca tekne senin evin. Sabah demir alıyoruz, gün içinde dört ayrı koyda yüzüyoruz, akşamları güvertede yemek yiyoruz. Karaya sadece Kelebekler Vadisi ve Gemiler Adası'nda çıkıyoruz.",
      en: "For three days the boat is home. We weigh anchor in the morning, swim in four different coves during the day and eat on deck at night. The only landings are Butterfly Valley and Gemiler Island.",
    },
    highlights: [
      { tr: "Teknede konaklama", en: "Sleep on board" },
      { tr: "Günde 4 yüzme molası", en: "Four swim stops a day" },
      { tr: "Şef eşliğinde akşam yemeği", en: "Dinner cooked on board" },
    ],
    included: [
      { tr: "2 gece teknede konaklama", en: "2 nights on board" },
      { tr: "Tüm öğünler", en: "All meals" },
      { tr: "Şnorkel ekipmanı", en: "Snorkelling gear" },
      { tr: "Fethiye limanı transferi", en: "Transfer to Fethiye harbour" },
    ],
    itinerary: [
      {
        day: 1,
        title: { tr: "Fethiye'den kalkış", en: "Departure from Fethiye" },
        description: {
          tr: "Öğlen demir alıyoruz, Akvaryum Koyu'nda ilk yüzme molası ve gün batımı demirlemesi.",
          en: "We set off at midday, take a first swim in Aquarium Bay and anchor for sunset.",
        },
      },
      {
        day: 2,
        title: { tr: "Kelebekler Vadisi", en: "Butterfly Valley" },
        description: {
          tr: "Sabah vadiye çıkış, şelaleye kısa yürüyüş, öğleden sonra üç koyda yüzme.",
          en: "A morning landing in the valley, a short hike to the waterfall, three swim stops after lunch.",
        },
      },
      {
        day: 3,
        title: {
          tr: "Gemiler Adası ve dönüş",
          en: "Gemiler Island and return",
        },
        description: {
          tr: "Adadaki Bizans kalıntıları, son yüzme molası ve akşamüstü Fethiye'ye dönüş.",
          en: "Byzantine ruins on the island, a final swim and an late afternoon return to Fethiye.",
        },
      },
    ],
    durationDays: 3,
    durationNights: 2,
    maxGroupSize: 12,
    rating: 4.8,
    reviewCount: 204,
    price: { amount: 12400, currency: "TRY" },
  },
  {
    slug: "karadeniz-yayla-rotasi",
    accent: "forest",
    cover: tourImages.ayderPlateau,
    gallery: [tourImages.firtinaCreek],
    title: {
      tr: "Karadeniz Yayla Rotası",
      en: "Black Sea Highlands Route",
    },
    destination: { tr: "Rize", en: "Rize" },
    country: { tr: "Türkiye", en: "Türkiye" },
    summary: {
      tr: "Ayder, Pokut ve Sal yaylalarında sisin içinde yürüyüş, ahşap konaklarda konaklama.",
      en: "Walking through the mist in the Ayder, Pokut and Sal highlands, sleeping in wooden lodges.",
    },
    description: {
      tr: "Beş gün boyunca yaylaları dolaşıyoruz. Sabahları sis kalkmadan yürüyüşe çıkıyoruz, öğlenleri köy sofralarında yemek yiyoruz, geceleri ahşap konaklarda sobanın yanında oturuyoruz. Yürüyüşler zorlu değil ama her gün rakım değişiyor.",
      en: "Five days moving between the highlands. We walk before the mist lifts, eat at village tables at midday and sit by the stove in wooden lodges at night. The walks are gentle, but the altitude changes every day.",
    },
    badge: { tr: "Yeni rota", en: "New route" },
    badgeTone: "new",
    highlights: [
      { tr: "Sisli sabah yürüyüşü", en: "Misty morning hike" },
      { tr: "Yerel kahvaltı", en: "Village breakfast" },
      { tr: "Çay bahçesi turu", en: "Tea garden tour" },
    ],
    included: [
      { tr: "4 gece ahşap konakta konaklama", en: "4 nights in wooden lodges" },
      { tr: "Kahvaltı ve akşam yemeği", en: "Breakfast and dinner" },
      { tr: "Yayla transferleri", en: "Transfers between the highlands" },
      { tr: "Rehberli yürüyüşler", en: "Guided walks" },
    ],
    itinerary: [
      {
        day: 1,
        title: { tr: "Rize'den Ayder'e", en: "From Rize to Ayder" },
        description: {
          tr: "Çay bahçelerinin arasından yayla yoluna çıkış ve Ayder'de ilk gece.",
          en: "Up the highland road through the tea gardens, first night in Ayder.",
        },
      },
      {
        day: 2,
        title: { tr: "Fırtına Deresi", en: "The Fırtına creek" },
        description: {
          tr: "Dere boyunca yürüyüş, taş kemer köprüler ve öğleden sonra serbest zaman.",
          en: "A walk along the creek, stone arch bridges and a free afternoon.",
        },
      },
      {
        day: 3,
        title: { tr: "Pokut Yaylası", en: "Pokut plateau" },
        description: {
          tr: "Sabah sisinde 6 km yürüyüş ve ahşap serenderlerin arasında konaklama.",
          en: "A 6 km walk in the morning mist, sleeping among wooden storehouses.",
        },
      },
      {
        day: 4,
        title: { tr: "Sal Yaylası", en: "Sal plateau" },
        description: {
          tr: "Yayladan yaylaya geçiş, bulutların üstünde gün batımı.",
          en: "Crossing from one plateau to the next, sunset above the clouds.",
        },
      },
      {
        day: 5,
        title: { tr: "Çay hasadı ve dönüş", en: "Tea harvest and return" },
        description: {
          tr: "Çay bahçesinde hasat denemesi, öğleden sonra Rize'ye dönüş.",
          en: "Trying your hand at the tea harvest, then back to Rize in the afternoon.",
        },
      },
    ],
    durationDays: 5,
    durationNights: 4,
    maxGroupSize: 8,
    rating: 4.7,
    reviewCount: 96,
    price: { amount: 21500, currency: "TRY" },
  },
  {
    slug: "istanbul-gizli-sokaklar",
    accent: "city",
    cover: tourImages.balatHouses,
    gallery: [tourImages.balatColorful, tourImages.balatStreet],
    title: {
      tr: "İstanbul'un Gizli Sokakları",
      en: "Hidden Streets of Istanbul",
    },
    destination: { tr: "İstanbul", en: "Istanbul" },
    country: { tr: "Türkiye", en: "Türkiye" },
    summary: {
      tr: "Balat, Kuzguncuk ve Yeldeğirmeni'nde yürüyerek keşif; esnaf lokantalarında tadım turu.",
      en: "Walking through Balat, Kuzguncuk and Yeldeğirmeni, with a tasting tour of neighbourhood eateries.",
    },
    description: {
      tr: "İki gün boyunca vapurla iki yaka arasında gidip geliyoruz. Sultanahmet'e hiç uğramıyoruz; bunun yerine mahalle aralarında yürüyor, sekiz farklı esnaf lokantasında tadım yapıyoruz. Yürüyüş temposu rahat, isteyen arada kahve molası veriyor.",
      en: "Two days of crossing between the two sides by ferry. We skip Sultanahmet entirely and walk the back streets instead, tasting at eight neighbourhood eateries along the way. The pace is easy, with coffee stops whenever anyone wants one.",
    },
    highlights: [
      { tr: "8 duraklı tadım", en: "Eight tasting stops" },
      { tr: "Boğaz vapuru", en: "Bosphorus ferry" },
      { tr: "Fotoğraf rehberi", en: "Photo guide" },
    ],
    included: [
      {
        tr: "1 gece butik otelde konaklama",
        en: "1 night in a boutique hotel",
      },
      {
        tr: "Tüm tadım duraklarındaki yiyecekler",
        en: "Food at every tasting stop",
      },
      { tr: "Vapur ve toplu taşıma kartı", en: "Ferry and transit card" },
      { tr: "Fotoğraf rehberi eşliği", en: "A photo guide with the group" },
    ],
    itinerary: [
      {
        day: 1,
        title: { tr: "Balat ve Fener", en: "Balat and Fener" },
        description: {
          tr: "Renkli evler arasında yürüyüş, beş tadım durağı ve gün batımında Haliç manzarası.",
          en: "A walk among the coloured houses, five tasting stops and a Golden Horn sunset.",
        },
      },
      {
        day: 2,
        title: {
          tr: "Kuzguncuk ve Yeldeğirmeni",
          en: "Kuzguncuk and Yeldeğirmeni",
        },
        description: {
          tr: "Vapurla karşı yakaya geçiş, duvar resimleri, üç tadım durağı ve veda kahvesi.",
          en: "A ferry to the other shore, street murals, three tasting stops and a farewell coffee.",
        },
      },
    ],
    durationDays: 2,
    durationNights: 1,
    maxGroupSize: 12,
    rating: 4.8,
    reviewCount: 428,
    price: { amount: 7900, currency: "TRY" },
  },
  {
    slug: "likya-yolu-yuruyusu",
    accent: "sand",
    cover: tourImages.kasLimanagzi,
    gallery: [tourImages.kasSunset, tourImages.kasHarbour],
    title: {
      tr: "Likya Yolu Yürüyüşü",
      en: "Lycian Way Trek",
    },
    destination: { tr: "Kaş", en: "Kaş" },
    country: { tr: "Türkiye", en: "Türkiye" },
    summary: {
      tr: "Antik patikalarda altı günlük yürüyüş, her akşam denize sıfır pansiyonda konaklama.",
      en: "Six days on ancient paths, with a seafront guesthouse waiting at the end of every stage.",
    },
    description: {
      tr: "Altı gün boyunca günde 12-15 km yürüyoruz. Bagajın her sabah bir sonraki pansiyona gidiyor, sen sadece günlük çantanı taşıyorsun. Rota deniz kıyısı ile antik kentler arasında gidip geliyor; her akşam yürüyüşü denizde yüzerek bitiriyoruz.",
      en: "Six days of walking 12-15 km a day. Your luggage moves to the next guesthouse each morning, so you only carry a daypack. The route swings between the shoreline and ancient cities, and every day ends with a swim.",
    },
    highlights: [
      { tr: "Günde 12-15 km", en: "12-15 km a day" },
      { tr: "Bagaj transferi", en: "Luggage transfer" },
      { tr: "Antik kent gezileri", en: "Ancient city visits" },
    ],
    included: [
      { tr: "5 gece pansiyon konaklaması", en: "5 nights in guesthouses" },
      { tr: "Kahvaltı ve yürüyüş paketi", en: "Breakfast and a trail lunch" },
      { tr: "Günlük bagaj transferi", en: "Daily luggage transfer" },
      { tr: "Antik kent giriş ücretleri", en: "Entry to the ancient sites" },
    ],
    itinerary: [
      {
        day: 1,
        title: { tr: "Kaş'ta buluşma", en: "Meeting in Kaş" },
        description: {
          tr: "Ekipman kontrolü, kısa alıştırma yürüyüşü ve limanda tanışma yemeği.",
          en: "Kit check, a short warm-up walk and a welcome dinner at the harbour.",
        },
      },
      {
        day: 2,
        title: { tr: "Limanağzı etabı", en: "The Limanağzı stage" },
        description: {
          tr: "Koylar boyunca 13 km, öğlen molası kumsalda.",
          en: "13 km along the coves, with lunch on the beach.",
        },
      },
      {
        day: 3,
        title: { tr: "Aperlai antik kenti", en: "Ancient Aperlai" },
        description: {
          tr: "Batık şehrin üzerinden geçen patika ve 14 km yürüyüş.",
          en: "The path above the sunken city, 14 km of walking.",
        },
      },
      {
        day: 4,
        title: { tr: "Üçağız ve Kekova", en: "Üçağız and Kekova" },
        description: {
          tr: "Sabah yürüyüşü, öğleden sonra tekneyle Kekova turu.",
          en: "A morning walk, then a boat around Kekova in the afternoon.",
        },
      },
      {
        day: 5,
        title: { tr: "Kale köyü", en: "The village of Kale" },
        description: {
          tr: "Lykia lahitleri arasında tırmanış ve kale manzarasında mola.",
          en: "A climb among Lycian sarcophagi and a break at the castle viewpoint.",
        },
      },
      {
        day: 6,
        title: { tr: "Son etap ve veda", en: "Final stage and farewell" },
        description: {
          tr: "10 km'lik kısa etap, denizde son yüzme ve öğleden sonra dağılma.",
          en: "A short 10 km stage, a last swim and an afternoon farewell.",
        },
      },
    ],
    durationDays: 6,
    durationNights: 5,
    maxGroupSize: 10,
    rating: 4.9,
    reviewCount: 158,
    price: { amount: 24800, currency: "TRY" },
  },
  {
    slug: "bali-pirinc-terasi",
    accent: "forest",
    cover: tourImages.baliTerraces,
    gallery: [tourImages.baliTerracesPath, tourImages.baliRiceFields],
    title: {
      tr: "Bali Pirinç Terasları",
      en: "Bali Rice Terraces",
    },
    destination: { tr: "Ubud", en: "Ubud" },
    country: { tr: "Endonezya", en: "Indonesia" },
    summary: {
      tr: "Ubud'da villa konaklaması, Tegallalang terasları ve gün doğumunda Batur yürüyüşü.",
      en: "A villa stay in Ubud, the Tegallalang terraces and a sunrise hike up Mount Batur.",
    },
    description: {
      tr: "Sekiz gün boyunca Ubud'daki villamızdan çıkıp adayı parça parça geziyoruz. Teraslarda yürüyor, bir gün Batur'a gün doğumu için gece yarısı kalkıyor, bir gün mutfağa girip yerel yemek yapmayı öğreniyoruz. Programda boş günler de var.",
      en: "Eight days exploring the island in pieces from our villa in Ubud. We walk the terraces, get up in the middle of the night once for the Batur sunrise, and spend a day in the kitchen learning to cook. There are empty days in the plan too.",
    },
    badge: { tr: "Son 3 kontenjan", en: "3 spots left" },
    badgeTone: "scarce",
    highlights: [
      { tr: "Villa konaklaması", en: "Villa stay" },
      { tr: "Batur gün doğumu", en: "Batur sunrise" },
      { tr: "Yemek atölyesi", en: "Cooking class" },
    ],
    included: [
      { tr: "7 gece villa konaklaması", en: "7 nights in a villa" },
      {
        tr: "Kahvaltı ve yemek atölyesi",
        en: "Breakfast and the cooking class",
      },
      { tr: "Ada içi ulaşım", en: "Transport around the island" },
      { tr: "Batur yürüyüşü rehberi", en: "A guide for the Batur hike" },
    ],
    itinerary: [
      {
        day: 1,
        title: { tr: "Denpasar'dan Ubud'a", en: "From Denpasar to Ubud" },
        description: {
          tr: "Havalimanı transferi, villaya yerleşme ve akşam pazarında ilk yemek.",
          en: "Airport transfer, settling into the villa and a first meal at the night market.",
        },
      },
      {
        day: 2,
        title: { tr: "Tegallalang terasları", en: "Tegallalang terraces" },
        description: {
          tr: "Sabah erken teraslarda yürüyüş, öğleden sonra serbest.",
          en: "An early walk through the terraces, with a free afternoon.",
        },
      },
      {
        day: 3,
        title: { tr: "Batur gün doğumu", en: "Batur sunrise" },
        description: {
          tr: "Gece 02.00'de kalkış, zirvede gün doğumu ve dönüşte kaplıca molası.",
          en: "A 2 am start, sunrise at the summit and a hot spring stop on the way back.",
        },
      },
      {
        day: 4,
        title: { tr: "Yemek atölyesi", en: "Cooking class" },
        description: {
          tr: "Pazardan alışveriş, ardından yerel bir mutfakta tam günlük atölye.",
          en: "Shopping at the market, then a full day in a local kitchen.",
        },
      },
      {
        day: 5,
        title: { tr: "Serbest gün", en: "Free day" },
        description: {
          tr: "Program yok. İsteyen bisiklete biniyor, isteyen villada kalıyor.",
          en: "Nothing planned. Rent a bike or stay at the villa.",
        },
      },
      {
        day: 6,
        title: { tr: "Sidemen vadisi", en: "The Sidemen valley" },
        description: {
          tr: "Daha sakin bir vadide yürüyüş ve dokuma atölyesi ziyareti.",
          en: "A walk in a quieter valley and a visit to a weaving workshop.",
        },
      },
      {
        day: 7,
        title: { tr: "Sahil günü", en: "Beach day" },
        description: {
          tr: "Güney sahillerinde yüzme ve gün batımı.",
          en: "Swimming on the southern beaches and a sunset.",
        },
      },
      {
        day: 8,
        title: { tr: "Dönüş", en: "Departure" },
        description: {
          tr: "Son kahvaltı ve havalimanına transfer.",
          en: "A last breakfast and the transfer to the airport.",
        },
      },
    ],
    durationDays: 8,
    durationNights: 7,
    maxGroupSize: 12,
    rating: 4.9,
    reviewCount: 187,
    price: { amount: 68500, currency: "TRY" },
  },
];
