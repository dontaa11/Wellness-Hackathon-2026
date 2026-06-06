import type { EthiopianFood } from '@/types';

export const ETHIOPIAN_FOODS: EthiopianFood[] = [
  { id: '1', name_en: 'Injera', name_am: 'እንጀራ', calories_per_serving: 205, protein_g: 5, carbs_g: 42, fat_g: 1, serving_description: '1 large piece (30cm)', is_fasting_friendly: true, category: 'lunch', image_url: '/foods/injera.jpg' },
  { id: '2', name_en: 'Tibs', name_am: 'ጥብስ', calories_per_serving: 380, protein_g: 28, carbs_g: 8, fat_g: 26, serving_description: '150g with vegetables', is_fasting_friendly: false, category: 'lunch', image_url: '/foods/tibs.jpg' },
  { id: '3', name_en: 'Shiro', name_am: 'ሽሮ', calories_per_serving: 220, protein_g: 12, carbs_g: 28, fat_g: 8, serving_description: '1 cup', is_fasting_friendly: true, category: 'lunch', image_url: '/foods/shiro.jpg' },
  { id: '4', name_en: 'Misir Wot', name_am: 'ምስር ወጥ', calories_per_serving: 180, protein_g: 10, carbs_g: 24, fat_g: 5, serving_description: '1 cup', is_fasting_friendly: true, category: 'lunch', image_url: '/foods/misir.jpg' },
  { id: '5', name_en: 'Kinche', name_am: 'ቅንጨ', calories_per_serving: 250, protein_g: 8, carbs_g: 45, fat_g: 4, serving_description: '1 bowl', is_fasting_friendly: true, category: 'breakfast', image_url: '/foods/kinche.jpg' },
  { id: '6', name_en: 'Ful', name_am: 'ፉል', calories_per_serving: 320, protein_g: 14, carbs_g: 45, fat_g: 8, serving_description: '1 bowl with bread', is_fasting_friendly: true, category: 'breakfast', image_url: '/foods/ful.jpg' },
  { id: '7', name_en: 'Kategna', name_am: 'ካተኛ', calories_per_serving: 280, protein_g: 6, carbs_g: 38, fat_g: 12, serving_description: '2 pieces injera', is_fasting_friendly: true, category: 'snack', image_url: '/foods/kategna.jpg' },
  { id: '8', name_en: 'Firfir', name_am: 'ፍርፍር', calories_per_serving: 350, protein_g: 12, carbs_g: 42, fat_g: 14, serving_description: '1 plate shredded injera', is_fasting_friendly: false, category: 'breakfast', image_url: '/foods/firfir.jpg' },
  { id: '9', name_en: 'Gored Gored', name_am: 'ጎረድ ጎረድ', calories_per_serving: 420, protein_g: 32, carbs_g: 4, fat_g: 30, serving_description: '150g raw beef cubes', is_fasting_friendly: false, category: 'lunch', image_url: '/foods/gored.jpg' },
  { id: '10', name_en: 'Doro Wot', name_am: 'ዶሮ ወጥ', calories_per_serving: 480, protein_g: 35, carbs_g: 18, fat_g: 28, serving_description: '1 leg piece + sauce', is_fasting_friendly: false, category: 'lunch', image_url: '/foods/doro.jpg' },
  { id: '11', name_en: 'Ayib', name_am: 'አይብ', calories_per_serving: 120, protein_g: 8, carbs_g: 4, fat_g: 9, serving_description: '100g cottage cheese', is_fasting_friendly: false, category: 'snack', image_url: '/foods/ayib.jpg' },
  { id: '12', name_en: 'Teff Porridge', name_am: 'ጤፍ ሾርባ', calories_per_serving: 200, protein_g: 6, carbs_g: 38, fat_g: 3, serving_description: '1 bowl', is_fasting_friendly: true, category: 'breakfast', image_url: '/foods/teff.jpg' },
  { id: '13', name_en: 'Sambusa', name_am: 'ሳምቡሳ', calories_per_serving: 180, protein_g: 5, carbs_g: 22, fat_g: 8, serving_description: '2 pieces', is_fasting_friendly: true, category: 'snack', image_url: '/foods/sambusa.jpg' },
  { id: '14', name_en: 'Chechebsa', name_am: 'ጨጨብሳ', calories_per_serving: 400, protein_g: 10, carbs_g: 55, fat_g: 16, serving_description: '1 plate', is_fasting_friendly: false, category: 'breakfast', image_url: '/foods/chechebsa.jpg' },
  { id: '15', name_en: 'Genfo', name_am: 'ገንፎ', calories_per_serving: 350, protein_g: 8, carbs_g: 60, fat_g: 8, serving_description: '1 bowl with butter', is_fasting_friendly: false, category: 'breakfast', image_url: '/foods/genfo.jpg' },
  { id: '16', name_en: 'Enkulal Firfir', name_am: 'እንቁላል ፍርፍር', calories_per_serving: 380, protein_g: 16, carbs_g: 40, fat_g: 16, serving_description: '1 plate with egg', is_fasting_friendly: false, category: 'breakfast', image_url: '/foods/enkulal.jpg' },
  { id: '17', name_en: 'Dulet', name_am: 'ዱለት', calories_per_serving: 450, protein_g: 30, carbs_g: 6, fat_g: 34, serving_description: '150g organ meat mix', is_fasting_friendly: false, category: 'lunch', image_url: '/foods/dulet.jpg' },
  { id: '18', name_en: 'Derek Tibs', name_am: 'ደረቅ ጥብስ', calories_per_serving: 360, protein_g: 26, carbs_g: 10, fat_g: 24, serving_description: '150g dry-fried meat', is_fasting_friendly: false, category: 'lunch', image_url: '/foods/derek.jpg' },
  { id: '19', name_en: 'Yetsom Beyaynetu', name_am: 'የጾም በያይነቱ', calories_per_serving: 420, protein_g: 14, carbs_g: 65, fat_g: 12, serving_description: 'Fasting platter with 5 dishes', is_fasting_friendly: true, category: 'lunch', image_url: '/foods/beyaynetu.jpg' },
  { id: '20', name_en: 'Gomen', name_am: 'ጎመን', calories_per_serving: 120, protein_g: 4, carbs_g: 12, fat_g: 6, serving_description: '1 cup collard greens', is_fasting_friendly: true, category: 'lunch', image_url: '/foods/gomen.jpg' },
  { id: '21', name_en: 'Atkilt', name_am: 'አትክልት', calories_per_serving: 150, protein_g: 3, carbs_g: 28, fat_g: 4, serving_description: '1 cup mixed vegetables', is_fasting_friendly: true, category: 'lunch', image_url: '/foods/atkilt.jpg' },
  { id: '22', name_en: 'Beyaynetu', name_am: 'በያይነቱ', calories_per_serving: 550, protein_g: 22, carbs_g: 70, fat_g: 18, serving_description: 'Combination platter', is_fasting_friendly: false, category: 'lunch', image_url: '/foods/beyaynetu-meat.jpg' },
  { id: '23', name_en: 'Kitfo', name_am: 'ክትፎ', calories_per_serving: 400, protein_g: 30, carbs_g: 2, fat_g: 30, serving_description: '150g minced raw beef', is_fasting_friendly: false, category: 'lunch', image_url: '/foods/kitfo.jpg' },
  { id: '24', name_en: 'Bula', name_am: 'ቡላ', calories_per_serving: 180, protein_g: 4, carbs_g: 35, fat_g: 3, serving_description: '1 bowl porridge', is_fasting_friendly: true, category: 'breakfast', image_url: '/foods/bula.jpg' },
  { id: '25', name_en: 'Chornake', name_am: 'ጮርናቄ', calories_per_serving: 300, protein_g: 8, carbs_g: 48, fat_g: 8, serving_description: '1 plate', is_fasting_friendly: true, category: 'breakfast', image_url: '/foods/chornake.jpg' },
  { id: '26', name_en: 'Dabo Kolo', name_am: 'ዳቦ ቆሎ', calories_per_serving: 160, protein_g: 4, carbs_g: 28, fat_g: 4, serving_description: '1 cup snack mix', is_fasting_friendly: true, category: 'snack', image_url: '/foods/dabo.jpg' },
  { id: '27', name_en: 'Tella', name_am: 'ጠላ', calories_per_serving: 120, protein_g: 2, carbs_g: 22, fat_g: 0, serving_description: '1 glass traditional beer', is_fasting_friendly: true, category: 'snack', image_url: '/foods/tella.jpg' },
  { id: '28', name_en: 'Beso', name_am: 'ቤሶ', calories_per_serving: 140, protein_g: 5, carbs_g: 26, fat_g: 2, serving_description: '1 cup barley drink', is_fasting_friendly: true, category: 'snack', image_url: '/foods/beso.jpg' },
  { id: '29', name_en: 'Quanta', name_am: 'ቋንጣ', calories_per_serving: 280, protein_g: 35, carbs_g: 2, fat_g: 14, serving_description: '50g dried beef', is_fasting_friendly: false, category: 'snack', image_url: '/foods/quanta.jpg' },
  { id: '30', name_en: 'Bozena Shiro', name_am: 'ቦዘና ሽሮ', calories_per_serving: 260, protein_g: 14, carbs_g: 30, fat_g: 10, serving_description: '1 cup with meat', is_fasting_friendly: false, category: 'lunch', image_url: '/foods/bozena.jpg' },
  { id: '31', name_en: 'Telba Fitfit', name_am: 'ተልባ ፍትፍት', calories_per_serving: 290, protein_g: 8, carbs_g: 38, fat_g: 12, serving_description: '1 bowl flaxseed dish', is_fasting_friendly: true, category: 'breakfast', image_url: '/foods/telba.jpg' },
  { id: '32', name_en: 'Kolo', name_am: 'ቆሎ', calories_per_serving: 200, protein_g: 6, carbs_g: 18, fat_g: 12, serving_description: '1 cup roasted grains/nuts', is_fasting_friendly: true, category: 'snack', image_url: '/foods/kolo.jpg' },
  { id: '33', name_en: 'Wot with Lamb', name_am: 'በግ ወጥ', calories_per_serving: 440, protein_g: 30, carbs_g: 16, fat_g: 28, serving_description: '150g lamb stew', is_fasting_friendly: false, category: 'dinner', image_url: '/foods/lamb.jpg' },
  { id: '34', name_en: 'Azifa', name_am: 'አዚፋ', calories_per_serving: 160, protein_g: 8, carbs_g: 18, fat_g: 6, serving_description: '1 cup green lentil salad', is_fasting_friendly: true, category: 'lunch', image_url: '/foods/azifa.jpg' },
  { id: '35', name_en: 'Fosolia', name_am: 'ፎሶሊያ', calories_per_serving: 140, protein_g: 6, carbs_g: 20, fat_g: 4, serving_description: '1 cup green beans', is_fasting_friendly: true, category: 'lunch', image_url: '/foods/fosolia.jpg' },
];

export function searchFoods(query: string, fastingOnly = false): EthiopianFood[] {
  const q = query.toLowerCase();
  return ETHIOPIAN_FOODS.filter((f) => {
    if (fastingOnly && !f.is_fasting_friendly) return false;
    return f.name_en.toLowerCase().includes(q) || f.name_am.includes(query);
  });
}

export function getFoodById(id: string): EthiopianFood | undefined {
  return ETHIOPIAN_FOODS.find((f) => f.id === id);
}
