const TITLE_AR: Record<string, string> = {
  "Mid-Century Modern Designers": "مصممو منتصف القرن",
  "The Secret Lives of Color": "الحياة السرية للألوان",
  Design: "التصميم",
  "Editing by Design": "التحرير بالتصميم",
  "The Interior Design Handbook": "دليل التصميم الداخلي",
  "Portrait Study": "دراسة البورتريه",
  "blue day. film book": "يوم أزرق. كتاب فيلم",
  WORK: "عمل",
  "Franz Kafka — Dream": "فرانز كافكا — حلم",
  "Louis Vuitton": "لويس فويتون",
  "Doodle School": "مدرسة الرسم الحر",
  "Pink Ovals": "أشكال وردية",
  Futurism: "المستقبلية",
  "Selfhood Artisthood Fatherhood": "الذات والفن والأبوة",
  "Korean Design Index": "فهرس التصميم الكوري",
  "Design Conversations": "حوارات في التصميم",
  "The Creative Process": "العملية الإبداعية",
  "Motion Stories": "قصص الحركة",
  "Studio Notes": "ملاحظات الاستوديو",
  "Visual Culture": "الثقافة البصرية",
};

export function libraryCardTitle(arabic: boolean, title: string) {
  if (!arabic) return title;
  return TITLE_AR[title] ?? title;
}

export function libraryCardPrice(arabic: boolean, priceLabel: string) {
  if (!arabic) return priceLabel;
  if (priceLabel.trim().toLowerCase() === "free") return "مجاني";
  return priceLabel;
}
